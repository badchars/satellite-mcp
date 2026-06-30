import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";
import { haversine, bboxFromCenter, mgrsToLatLng, latLngToMgrs, sunTimes } from "../utils/geo-math.js";

// ─── Nominatim Rate Limiter (1 req/sec policy) ───
const limiter = new RateLimiter(1100);

// ─── Cache: 60-minute TTL for API responses ───
const cache = new TTLCache<unknown>(60 * 60 * 1000);

const USER_AGENT = "satellite-mcp/0.1.0";

// ─── Helpers ───

async function nominatimFetch<T>(url: string, cacheKey: string): Promise<T> {
  const cached = cache.get(cacheKey);
  if (cached !== undefined) return cached as T;

  await limiter.acquire();

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(`Nominatim API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as T;
  cache.set(cacheKey, data);
  return data;
}

// ─── Tools ───

export const geoTools: ToolDef[] = [
  // 1. geo_forward — Forward geocoding
  {
    name: "geo_forward",
    description:
      "Forward geocoding: convert an address or place name to geographic coordinates using Nominatim. Returns up to 5 matching results with coordinates, type, and importance score.",
    schema: {
      query: z
        .string()
        .describe("Address, place name, or location query to geocode (e.g. 'Eiffel Tower, Paris')"),
    },
    async execute(args) {
      const query = args.query as string;
      const encoded = encodeURIComponent(query);
      const cacheKey = `geo_forward:${encoded}`;
      const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=5`;

      const results = await nominatimFetch<
        { display_name: string; lat: string; lon: string; type: string; importance: number }[]
      >(url, cacheKey);

      const mapped = results.map((r) => ({
        display_name: r.display_name,
        lat: parseFloat(r.lat),
        lng: parseFloat(r.lon),
        type: r.type,
        importance: r.importance,
      }));

      return json(mapped);
    },
  },

  // 2. geo_reverse — Reverse geocoding
  {
    name: "geo_reverse",
    description:
      "Reverse geocoding: convert latitude/longitude coordinates to a human-readable address using Nominatim. Returns the full address with structured components.",
    schema: {
      lat: z.number().describe("Latitude of the point to reverse-geocode (-90 to 90)"),
      lng: z.number().describe("Longitude of the point to reverse-geocode (-180 to 180)"),
    },
    async execute(args) {
      const lat = args.lat as number;
      const lng = args.lng as number;
      const cacheKey = `geo_reverse:${lat},${lng}`;
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;

      const result = await nominatimFetch<{
        display_name: string;
        address: Record<string, string>;
        lat: string;
        lon: string;
      }>(url, cacheKey);

      return json({
        display_name: result.display_name,
        address: result.address,
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      });
    },
  },

  // 3. geo_distance — Haversine distance
  {
    name: "geo_distance",
    description:
      "Calculate the great-circle distance between two geographic points using the Haversine formula. Returns distance in kilometers, miles, and nautical miles.",
    schema: {
      lat1: z.number().describe("Latitude of the first point (-90 to 90)"),
      lng1: z.number().describe("Longitude of the first point (-180 to 180)"),
      lat2: z.number().describe("Latitude of the second point (-90 to 90)"),
      lng2: z.number().describe("Longitude of the second point (-180 to 180)"),
    },
    async execute(args) {
      const lat1 = args.lat1 as number;
      const lng1 = args.lng1 as number;
      const lat2 = args.lat2 as number;
      const lng2 = args.lng2 as number;

      const distanceKm = haversine(lat1, lng1, lat2, lng2);
      const distanceMiles = distanceKm * 0.621371;
      const distanceNauticalMiles = distanceKm * 0.539957;

      return json({
        distanceKm: Math.round(distanceKm * 1000) / 1000,
        distanceMiles: Math.round(distanceMiles * 1000) / 1000,
        distanceNauticalMiles: Math.round(distanceNauticalMiles * 1000) / 1000,
      });
    },
  },

  // 4. geo_bbox — Bounding box from center + radius
  {
    name: "geo_bbox",
    description:
      "Compute a bounding box (south, west, north, east) from a center point and radius in kilometers. Useful for spatial queries and map viewports.",
    schema: {
      lat: z.number().describe("Latitude of the center point (-90 to 90)"),
      lng: z.number().describe("Longitude of the center point (-180 to 180)"),
      radius_km: z
        .number()
        .positive()
        .describe("Radius in kilometers from the center to each edge of the bounding box"),
    },
    async execute(args) {
      const lat = args.lat as number;
      const lng = args.lng as number;
      const radiusKm = args.radius_km as number;

      const bbox = bboxFromCenter(lat, lng, radiusKm);

      return json({
        south: Math.round(bbox.south * 1e6) / 1e6,
        west: Math.round(bbox.west * 1e6) / 1e6,
        north: Math.round(bbox.north * 1e6) / 1e6,
        east: Math.round(bbox.east * 1e6) / 1e6,
        center: { lat, lng },
        radiusKm,
      });
    },
  },

  // 5. geo_mgrs — MGRS <-> lat/lng conversion
  {
    name: "geo_mgrs",
    description:
      "Convert between MGRS (Military Grid Reference System) and latitude/longitude coordinates. Provide either an MGRS string to convert to lat/lng, or lat/lng to convert to MGRS.",
    schema: {
      mgrs: z
        .string()
        .optional()
        .describe("MGRS coordinate string to convert to lat/lng (e.g. '33UUP0500011800')"),
      lat: z
        .number()
        .optional()
        .describe("Latitude to convert to MGRS (-80 to 84)"),
      lng: z
        .number()
        .optional()
        .describe("Longitude to convert to MGRS (-180 to 180)"),
      precision: z
        .number()
        .int()
        .min(1)
        .max(5)
        .default(5)
        .optional()
        .describe("MGRS precision level from 1 (10km) to 5 (1m), default 5"),
    },
    async execute(args) {
      const mgrsInput = args.mgrs as string | undefined;
      const lat = args.lat as number | undefined;
      const lng = args.lng as number | undefined;
      const precision = (args.precision as number | undefined) ?? 5;

      if (mgrsInput) {
        const result = mgrsToLatLng(mgrsInput);
        return json({
          mgrs: mgrsInput.replace(/\s/g, "").toUpperCase(),
          lat: Math.round(result.lat * 1e6) / 1e6,
          lng: Math.round(result.lng * 1e6) / 1e6,
        });
      }

      if (lat !== undefined && lng !== undefined) {
        const result = latLngToMgrs(lat, lng, precision);
        return json({
          mgrs: result,
          lat,
          lng,
        });
      }

      throw new Error(
        "Provide either 'mgrs' string to convert to lat/lng, or both 'lat' and 'lng' to convert to MGRS.",
      );
    },
  },

  // 6. geo_elevation — Elevation lookup
  {
    name: "geo_elevation",
    description:
      "Get the elevation (altitude above sea level) at a geographic coordinate using the Open Elevation API. Returns elevation in both meters and feet.",
    schema: {
      lat: z.number().describe("Latitude of the point to query elevation (-90 to 90)"),
      lng: z.number().describe("Longitude of the point to query elevation (-180 to 180)"),
    },
    async execute(args) {
      const lat = args.lat as number;
      const lng = args.lng as number;
      const cacheKey = `geo_elevation:${lat},${lng}`;

      const cached = cache.get(cacheKey);
      if (cached !== undefined) return json(cached);

      await limiter.acquire();

      const url = `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lng}`;
      const res = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
      });

      if (!res.ok) {
        throw new Error(`Open Elevation API error: ${res.status} ${res.statusText}`);
      }

      const data = (await res.json()) as {
        results: { latitude: number; longitude: number; elevation: number }[];
      };

      if (!data.results || data.results.length === 0) {
        throw new Error("No elevation data returned for the given coordinates.");
      }

      const elevM = data.results[0].elevation;
      const result = {
        lat,
        lng,
        elevation_m: elevM,
        elevation_ft: Math.round(elevM * 3.28084 * 100) / 100,
      };

      cache.set(cacheKey, result);
      return json(result);
    },
  },

  // 7. geo_timezone — Timezone estimation from coordinates
  {
    name: "geo_timezone",
    description:
      "Estimate the timezone at a geographic coordinate based on longitude. Uses a simple longitude-based calculation (offset = round(lng / 15)). Note: may be inaccurate near timezone borders.",
    schema: {
      lat: z.number().describe("Latitude of the point (-90 to 90)"),
      lng: z.number().describe("Longitude of the point (-180 to 180)"),
    },
    async execute(args) {
      const lat = args.lat as number;
      const lng = args.lng as number;

      const utcOffset = Math.round(lng / 15);
      const sign = utcOffset >= 0 ? "+" : "-";
      const absOffset = Math.abs(utcOffset);
      const estimatedTimezone = `UTC${sign}${absOffset}`;

      return json({
        lat,
        lng,
        utcOffset,
        estimatedTimezone,
        note: "Estimated from longitude. Actual timezone may differ near borders.",
      });
    },
  },

  // 8. geo_sun — Sun position, sunrise, sunset, twilight
  {
    name: "geo_sun",
    description:
      "Calculate sun position data for a geographic coordinate on a given date: sunrise, sunset, solar noon, civil dawn/dusk, and day length in hours. All times are in UTC.",
    schema: {
      lat: z.number().describe("Latitude of the observation point (-90 to 90)"),
      lng: z.number().describe("Longitude of the observation point (-180 to 180)"),
      date: z
        .string()
        .optional()
        .describe("ISO date string (YYYY-MM-DD) for the calculation. Defaults to today if omitted."),
    },
    async execute(args) {
      const lat = args.lat as number;
      const lng = args.lng as number;
      const dateStr = args.date as string | undefined;

      const date = dateStr ? new Date(dateStr) : new Date();
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format. Please provide an ISO date string (YYYY-MM-DD).");
      }

      const result = sunTimes(lat, lng, date);

      return json({
        sunrise: result.sunrise,
        sunset: result.sunset,
        solarNoon: result.solarNoon,
        civilDawn: result.civilDawn,
        civilDusk: result.civilDusk,
        dayLengthHours: result.dayLengthHours,
        date: date.toISOString().split("T")[0],
        location: { lat, lng },
      });
    },
  },
];
