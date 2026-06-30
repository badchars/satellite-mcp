import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";
import { haversine, interpolateGreatCircle, slopeAngle, lineOfSight } from "../utils/geo-math.js";

// ─── Provider Config ───

const OPEN_ELEVATION_URL = "https://api.open-elevation.com/api/v1/lookup";
const rateLimiter = new RateLimiter(1000);
const cache = new TTLCache<number>(60 * 60 * 1000); // 60 min TTL

// ─── Helpers ───

interface ElevationPoint {
  latitude: number;
  longitude: number;
  elevation: number;
}

/** Build a cache key for a coordinate pair */
function cacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(6)},${lng.toFixed(6)}`;
}

/** Query Open Elevation API for a batch of coordinates */
async function queryElevations(
  locations: { lat: number; lng: number }[],
): Promise<{ lat: number; lng: number; elevation_m: number }[]> {
  // Resolve from cache first, collect misses
  const results: { lat: number; lng: number; elevation_m: number }[] = [];
  const misses: { index: number; lat: number; lng: number }[] = [];

  for (let i = 0; i < locations.length; i++) {
    const loc = locations[i];
    const key = cacheKey(loc.lat, loc.lng);
    const cached = cache.get(key);
    if (cached !== undefined) {
      results[i] = { lat: loc.lat, lng: loc.lng, elevation_m: cached };
    } else {
      misses.push({ index: i, lat: loc.lat, lng: loc.lng });
    }
  }

  if (misses.length > 0) {
    await rateLimiter.acquire();

    const body = {
      locations: misses.map((m) => ({ latitude: m.lat, longitude: m.lng })),
    };

    const res = await fetch(OPEN_ELEVATION_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Open Elevation API error (${res.status}): ${text || res.statusText}`,
      );
    }

    const data = (await res.json()) as { results: ElevationPoint[] };

    if (!data.results || data.results.length !== misses.length) {
      throw new Error("Open Elevation API returned unexpected result count");
    }

    for (let j = 0; j < misses.length; j++) {
      const miss = misses[j];
      const elev = data.results[j].elevation;
      cache.set(cacheKey(miss.lat, miss.lng), elev);
      results[miss.index] = { lat: miss.lat, lng: miss.lng, elevation_m: elev };
    }
  }

  return results;
}

/** Query elevation for a single point */
async function queryElevation(
  lat: number,
  lng: number,
): Promise<{ lat: number; lng: number; elevation_m: number }> {
  const [result] = await queryElevations([{ lat, lng }]);
  return result;
}

/** Meters to feet */
function metersToFeet(m: number): number {
  return Math.round(m * 3.28084 * 100) / 100;
}

/** Classify slope by angle in degrees */
function classifySlope(
  deg: number,
): "Flat" | "Gentle" | "Moderate" | "Steep" | "Very Steep" | "Cliff" {
  const absDeg = Math.abs(deg);
  if (absDeg < 2) return "Flat";
  if (absDeg < 5) return "Gentle";
  if (absDeg < 15) return "Moderate";
  if (absDeg < 30) return "Steep";
  if (absDeg < 45) return "Very Steep";
  return "Cliff";
}

/** Classify flood risk by height above water level */
function classifyFloodRisk(
  heightAboveWater: number,
): "Extreme" | "High" | "Moderate" | "Low" | "Minimal" {
  if (heightAboveWater < 1) return "Extreme";
  if (heightAboveWater < 3) return "High";
  if (heightAboveWater < 10) return "Moderate";
  if (heightAboveWater < 30) return "Low";
  return "Minimal";
}

/** Generate flood risk assessment text */
function floodAssessment(risk: string, heightAboveWater: number): string {
  switch (risk) {
    case "Extreme":
      return `Location is only ${heightAboveWater.toFixed(1)}m above water level. Extremely high flood risk — area is vulnerable to even minor water level rises, storm surges, or heavy rainfall events.`;
    case "High":
      return `Location is ${heightAboveWater.toFixed(1)}m above water level. High flood risk — area could be affected by moderate flooding, storm surges, or sustained heavy rainfall.`;
    case "Moderate":
      return `Location is ${heightAboveWater.toFixed(1)}m above water level. Moderate flood risk — area may be affected by major flooding events or significant storm surges.`;
    case "Low":
      return `Location is ${heightAboveWater.toFixed(1)}m above water level. Low flood risk — area is elevated enough to avoid most flooding, but extreme events could still pose a threat.`;
    case "Minimal":
      return `Location is ${heightAboveWater.toFixed(1)}m above water level. Minimal flood risk — area is well-elevated and unlikely to be affected by flooding under normal conditions.`;
    default:
      return `Location is ${heightAboveWater.toFixed(1)}m above water level.`;
  }
}

// ─── Tool Definitions ───

export const terrainTools: ToolDef[] = [
  // ── 1. terrain_elevation ──
  {
    name: "terrain_elevation",
    description:
      "Get the elevation (altitude above sea level) at a given geographic coordinate using the Open Elevation API.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude in decimal degrees (-90 to 90)"),
      lng: z.number().min(-180).max(180).describe("Longitude in decimal degrees (-180 to 180)"),
    },
    execute: async (args) => {
      try {
        const lat = args.lat as number;
        const lng = args.lng as number;

        const result = await queryElevation(lat, lng);

        return json({
          lat: result.lat,
          lng: result.lng,
          elevation_m: result.elevation_m,
          elevation_ft: metersToFeet(result.elevation_m),
        });
      } catch (err) {
        return json({
          error: err instanceof Error ? err.message : "Failed to query elevation",
        });
      }
    },
  },

  // ── 2. terrain_profile ──
  {
    name: "terrain_profile",
    description:
      "Generate an elevation profile between two geographic points. Returns sampled elevations along the path with distance and elevation statistics.",
    schema: {
      lat1: z.number().min(-90).max(90).describe("Start point latitude in decimal degrees"),
      lng1: z.number().min(-180).max(180).describe("Start point longitude in decimal degrees"),
      lat2: z.number().min(-90).max(90).describe("End point latitude in decimal degrees"),
      lng2: z.number().min(-180).max(180).describe("End point longitude in decimal degrees"),
      samples: z
        .number()
        .int()
        .min(2)
        .max(100)
        .default(20)
        .optional()
        .describe("Number of sample points along the profile (2-100, default 20)"),
    },
    execute: async (args) => {
      try {
        const lat1 = args.lat1 as number;
        const lng1 = args.lng1 as number;
        const lat2 = args.lat2 as number;
        const lng2 = args.lng2 as number;
        const samples = (args.samples as number | undefined) ?? 20;

        const totalDistKm = haversine(lat1, lng1, lat2, lng2);
        const points = interpolateGreatCircle(lat1, lng1, lat2, lng2, samples - 1);
        const elevations = await queryElevations(points);

        let minElev = Infinity;
        let maxElev = -Infinity;
        let totalAscent = 0;
        let totalDescent = 0;

        const profileSamples = elevations.map((pt, i) => {
          const distFromStart =
            i === 0 ? 0 : haversine(lat1, lng1, pt.lat, pt.lng);
          if (pt.elevation_m < minElev) minElev = pt.elevation_m;
          if (pt.elevation_m > maxElev) maxElev = pt.elevation_m;

          if (i > 0) {
            const diff = pt.elevation_m - elevations[i - 1].elevation_m;
            if (diff > 0) totalAscent += diff;
            else totalDescent += Math.abs(diff);
          }

          return {
            lat: pt.lat,
            lng: pt.lng,
            elevation_m: pt.elevation_m,
            distanceFromStart_km: Math.round(distFromStart * 1000) / 1000,
          };
        });

        const elevationGain =
          elevations[elevations.length - 1].elevation_m - elevations[0].elevation_m;

        return json({
          from: { lat: lat1, lng: lng1 },
          to: { lat: lat2, lng: lng2 },
          distanceKm: Math.round(totalDistKm * 1000) / 1000,
          samples: profileSamples,
          minElevation: minElev,
          maxElevation: maxElev,
          totalAscent: Math.round(totalAscent * 100) / 100,
          totalDescent: Math.round(totalDescent * 100) / 100,
          elevationGain: Math.round(elevationGain * 100) / 100,
        });
      } catch (err) {
        return json({
          error: err instanceof Error ? err.message : "Failed to generate elevation profile",
        });
      }
    },
  },

  // ── 3. terrain_slope ──
  {
    name: "terrain_slope",
    description:
      "Calculate the slope (gradient) between two geographic points, including angle in degrees, percentage, and terrain classification.",
    schema: {
      lat1: z.number().min(-90).max(90).describe("First point latitude in decimal degrees"),
      lng1: z.number().min(-180).max(180).describe("First point longitude in decimal degrees"),
      lat2: z.number().min(-90).max(90).describe("Second point latitude in decimal degrees"),
      lng2: z.number().min(-180).max(180).describe("Second point longitude in decimal degrees"),
    },
    execute: async (args) => {
      try {
        const lat1 = args.lat1 as number;
        const lng1 = args.lng1 as number;
        const lat2 = args.lat2 as number;
        const lng2 = args.lng2 as number;

        const [elev1, elev2] = await queryElevations([
          { lat: lat1, lng: lng1 },
          { lat: lat2, lng: lng2 },
        ]);

        const distKm = haversine(lat1, lng1, lat2, lng2);
        const slopeDeg = slopeAngle(elev1.elevation_m, elev2.elevation_m, distKm);
        const slopePercent =
          distKm > 0
            ? ((elev2.elevation_m - elev1.elevation_m) / (distKm * 1000)) * 100
            : 0;

        return json({
          from: { lat: lat1, lng: lng1, elevation_m: elev1.elevation_m },
          to: { lat: lat2, lng: lng2, elevation_m: elev2.elevation_m },
          distanceKm: Math.round(distKm * 1000) / 1000,
          slopeDeg: Math.round(slopeDeg * 100) / 100,
          slopePercent: Math.round(slopePercent * 100) / 100,
          classification: classifySlope(slopeDeg),
        });
      } catch (err) {
        return json({
          error: err instanceof Error ? err.message : "Failed to calculate slope",
        });
      }
    },
  },

  // ── 4. terrain_viewshed ──
  {
    name: "terrain_viewshed",
    description:
      "Line of sight analysis between two points. Determines if an observer at point A can see a target at point B, considering terrain elevation along the path.",
    schema: {
      lat1: z.number().min(-90).max(90).describe("Observer latitude in decimal degrees"),
      lng1: z.number().min(-180).max(180).describe("Observer longitude in decimal degrees"),
      lat2: z.number().min(-90).max(90).describe("Target latitude in decimal degrees"),
      lng2: z.number().min(-180).max(180).describe("Target longitude in decimal degrees"),
      h1: z
        .number()
        .min(0)
        .default(2)
        .optional()
        .describe("Observer height above ground in meters (default 2)"),
      h2: z
        .number()
        .min(0)
        .default(0)
        .optional()
        .describe("Target height above ground in meters (default 0)"),
    },
    execute: async (args) => {
      try {
        const lat1 = args.lat1 as number;
        const lng1 = args.lng1 as number;
        const lat2 = args.lat2 as number;
        const lng2 = args.lng2 as number;
        const h1 = (args.h1 as number | undefined) ?? 2;
        const h2 = (args.h2 as number | undefined) ?? 0;

        const profilePoints = interpolateGreatCircle(lat1, lng1, lat2, lng2, 19); // 20 samples
        const elevations = await queryElevations(profilePoints);

        const distKm = haversine(lat1, lng1, lat2, lng2);

        // Build profile for lineOfSight
        const profile = elevations.map((pt, i) => ({
          dist: i === 0 ? 0 : haversine(lat1, lng1, pt.lat, pt.lng),
          elev: pt.elevation_m,
        }));

        const losResult = lineOfSight(profile, h1, h2);

        const observerElev = elevations[0].elevation_m;
        const targetElev = elevations[elevations.length - 1].elevation_m;

        let obstruction: {
          lat: number;
          lng: number;
          elevation_m: number;
          distanceFromObserver_km: number;
        } | null = null;

        if (losResult.obstructionIndex !== null) {
          const obsPt = elevations[losResult.obstructionIndex];
          obstruction = {
            lat: obsPt.lat,
            lng: obsPt.lng,
            elevation_m: obsPt.elevation_m,
            distanceFromObserver_km:
              Math.round(
                haversine(lat1, lng1, obsPt.lat, obsPt.lng) * 1000,
              ) / 1000,
          };
        }

        return json({
          observer: {
            lat: lat1,
            lng: lng1,
            elevation_m: observerElev,
            totalHeight_m: observerElev + h1,
          },
          target: {
            lat: lat2,
            lng: lng2,
            elevation_m: targetElev,
            totalHeight_m: targetElev + h2,
          },
          distanceKm: Math.round(distKm * 1000) / 1000,
          visible: losResult.visible,
          obstruction,
        });
      } catch (err) {
        return json({
          error: err instanceof Error ? err.message : "Failed to perform line of sight analysis",
        });
      }
    },
  },

  // ── 5. terrain_prominence ──
  {
    name: "terrain_prominence",
    description:
      "Find the highest and lowest points in a bounding box area by querying a grid of elevation points. Useful for terrain prominence and relief analysis.",
    schema: {
      south: z.number().min(-90).max(90).describe("Southern boundary latitude in decimal degrees"),
      west: z.number().min(-180).max(180).describe("Western boundary longitude in decimal degrees"),
      north: z.number().min(-90).max(90).describe("Northern boundary latitude in decimal degrees"),
      east: z.number().min(-180).max(180).describe("Eastern boundary longitude in decimal degrees"),
      grid_size: z
        .number()
        .int()
        .min(3)
        .max(10)
        .default(5)
        .optional()
        .describe("Grid resolution per axis (3-10, default 5). Total points = grid_size x grid_size"),
    },
    execute: async (args) => {
      try {
        const south = args.south as number;
        const west = args.west as number;
        const north = args.north as number;
        const east = args.east as number;
        const gridSize = (args.grid_size as number | undefined) ?? 5;

        if (south >= north) {
          return json({ error: "South boundary must be less than north boundary" });
        }
        if (west >= east) {
          return json({ error: "West boundary must be less than east boundary" });
        }

        // Generate grid points
        const gridPoints: { lat: number; lng: number }[] = [];
        for (let row = 0; row < gridSize; row++) {
          for (let col = 0; col < gridSize; col++) {
            const lat = south + (north - south) * (row / (gridSize - 1));
            const lng = west + (east - west) * (col / (gridSize - 1));
            gridPoints.push({
              lat: Math.round(lat * 1e6) / 1e6,
              lng: Math.round(lng * 1e6) / 1e6,
            });
          }
        }

        const elevations = await queryElevations(gridPoints);

        let highest = elevations[0];
        let lowest = elevations[0];
        let totalElev = 0;

        const points = elevations.map((pt) => {
          if (pt.elevation_m > highest.elevation_m) highest = pt;
          if (pt.elevation_m < lowest.elevation_m) lowest = pt;
          totalElev += pt.elevation_m;

          return {
            lat: pt.lat,
            lng: pt.lng,
            elevation_m: pt.elevation_m,
          };
        });

        const avgElev = totalElev / elevations.length;

        return json({
          bbox: { south, west, north, east },
          gridSize,
          highestPoint: {
            lat: highest.lat,
            lng: highest.lng,
            elevation_m: highest.elevation_m,
          },
          lowestPoint: {
            lat: lowest.lat,
            lng: lowest.lng,
            elevation_m: lowest.elevation_m,
          },
          averageElevation_m: Math.round(avgElev * 100) / 100,
          elevationRange_m: highest.elevation_m - lowest.elevation_m,
          points,
        });
      } catch (err) {
        return json({
          error: err instanceof Error ? err.message : "Failed to analyze terrain prominence",
        });
      }
    },
  },

  // ── 6. terrain_flood_risk ──
  {
    name: "terrain_flood_risk",
    description:
      "Assess flood risk at a given location based on its elevation relative to a reference water level. Returns risk classification and descriptive assessment.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude in decimal degrees (-90 to 90)"),
      lng: z.number().min(-180).max(180).describe("Longitude in decimal degrees (-180 to 180)"),
      water_level_m: z
        .number()
        .default(0)
        .optional()
        .describe("Reference water level in meters above sea level (default 0, i.e. sea level)"),
    },
    execute: async (args) => {
      try {
        const lat = args.lat as number;
        const lng = args.lng as number;
        const waterLevel = (args.water_level_m as number | undefined) ?? 0;

        const result = await queryElevation(lat, lng);
        const heightAboveWater = result.elevation_m - waterLevel;
        const risk = classifyFloodRisk(heightAboveWater);

        return json({
          lat: result.lat,
          lng: result.lng,
          elevation_m: result.elevation_m,
          waterLevel_m: waterLevel,
          heightAboveWater_m: Math.round(heightAboveWater * 100) / 100,
          floodRisk: risk,
          assessment: floodAssessment(risk, heightAboveWater),
        });
      } catch (err) {
        return json({
          error: err instanceof Error ? err.message : "Failed to assess flood risk",
        });
      }
    },
  },
];
