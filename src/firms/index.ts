import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";
import { haversine, bboxFromCenter } from "../utils/geo-math.js";

// ─── Rate Limiter & Cache ───

const limiter = new RateLimiter(1000);
const cache = new TTLCache<unknown>(5 * 60 * 1000); // 5-minute TTL — fire data changes fast

// ─── Helpers ───

function getFirmsApiKey(ctx: ToolContext): string {
  return ctx.config.firmsMapKey ?? "DEMO_KEY";
}

function parseFirmsCsv(csv: string): Record<string, string>[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];
  const headers = lines[0].split(",");
  return lines.slice(1).map((line) => {
    const values = line.split(",");
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i]?.trim() ?? "";
    });
    return obj;
  });
}

function normalizeFire(raw: Record<string, string>): Record<string, unknown> {
  return {
    latitude: parseFloat(raw.latitude) || 0,
    longitude: parseFloat(raw.longitude) || 0,
    brightness: parseFloat(raw.bright_ti4 ?? raw.brightness) || 0,
    confidence: raw.confidence ?? "",
    frp: parseFloat(raw.frp) || 0,
    daynight: raw.daynight ?? "",
    acq_date: raw.acq_date ?? "",
    acq_time: raw.acq_time ?? "",
  };
}

async function fetchFirmsArea(
  apiKey: string,
  source: string,
  west: number,
  south: number,
  east: number,
  north: number,
  days: number,
  dateSuffix?: string,
): Promise<Record<string, string>[]> {
  const base = dateSuffix
    ? `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/${source}/${west},${south},${east},${north}/${days}/${dateSuffix}`
    : `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/${source}/${west},${south},${east},${north}/${days}`;

  const cacheKey = `firms:${base}`;
  const cached = cache.get(cacheKey);
  if (cached !== undefined) return cached as Record<string, string>[];

  await limiter.acquire();

  const res = await fetch(base);
  if (!res.ok) {
    throw new Error(`FIRMS API error: ${res.status} ${res.statusText}`);
  }

  const csvText = await res.text();
  const parsed = parseFirmsCsv(csvText);
  cache.set(cacheKey, parsed);
  return parsed;
}

async function fetchFirmsCountry(
  apiKey: string,
  source: string,
  country: string,
  days: number,
): Promise<Record<string, string>[]> {
  const url = `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${apiKey}/${source}/${country}/${days}`;
  const cacheKey = `firms:${url}`;
  const cached = cache.get(cacheKey);
  if (cached !== undefined) return cached as Record<string, string>[];

  await limiter.acquire();

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`FIRMS API error: ${res.status} ${res.statusText}`);
  }

  const csvText = await res.text();
  const parsed = parseFirmsCsv(csvText);
  cache.set(cacheKey, parsed);
  return parsed;
}

// ─── Source Enum ───

const sourceEnum = z
  .enum(["VIIRS_SNPP", "VIIRS_NOAA20", "MODIS_NRT"])
  .default("VIIRS_SNPP")
  .optional()
  .describe(
    "Fire detection satellite source. VIIRS_SNPP (Suomi NPP, 375m), VIIRS_NOAA20 (NOAA-20, 375m), or MODIS_NRT (Aqua/Terra, 1km). Default: VIIRS_SNPP",
  );

const daysEnum = z
  .union([z.literal(1), z.literal(2), z.literal(7)])
  .default(1)
  .optional()
  .describe("Number of days to query (1, 2, or 7). Default: 1");

// ─── Tools ───

export const firmsTools: ToolDef[] = [
  // 1. firms_active_area — Active fires in bounding box
  {
    name: "firms_active_area",
    description:
      "Query NASA FIRMS for active fire detections within a geographic bounding box. Returns fire hotspots with brightness, confidence, fire radiative power (FRP), and acquisition time. Supports VIIRS (375m) and MODIS (1km) sensors.",
    schema: {
      south: z.number().describe("Southern latitude of the bounding box (-90 to 90)"),
      west: z.number().describe("Western longitude of the bounding box (-180 to 180)"),
      north: z.number().describe("Northern latitude of the bounding box (-90 to 90)"),
      east: z.number().describe("Eastern longitude of the bounding box (-180 to 180)"),
      days: daysEnum,
      source: sourceEnum,
    },
    async execute(args, ctx) {
      const south = args.south as number;
      const west = args.west as number;
      const north = args.north as number;
      const east = args.east as number;
      const days = (args.days as number | undefined) ?? 1;
      const source = (args.source as string | undefined) ?? "VIIRS_SNPP";
      const apiKey = getFirmsApiKey(ctx);

      const rawFires = await fetchFirmsArea(apiKey, source, west, south, east, north, days);
      const fires = rawFires.map(normalizeFire);

      return json({
        fires,
        count: fires.length,
        bbox: { south, west, north, east },
        source,
        days,
      });
    },
  },

  // 2. firms_active_country — Active fires by country code
  {
    name: "firms_active_country",
    description:
      "Query NASA FIRMS for active fire detections within a country. Uses ISO 3166-1 alpha-3 country codes (e.g. TUR for Turkey, USA for United States, BRA for Brazil). Returns fire hotspots with brightness, confidence, FRP, and timing.",
    schema: {
      country: z
        .string()
        .describe("ISO 3166-1 alpha-3 country code (e.g. 'TUR', 'USA', 'BRA', 'AUS')"),
      days: daysEnum,
      source: sourceEnum,
    },
    async execute(args, ctx) {
      const country = (args.country as string).toUpperCase();
      const days = (args.days as number | undefined) ?? 1;
      const source = (args.source as string | undefined) ?? "VIIRS_SNPP";
      const apiKey = getFirmsApiKey(ctx);

      const rawFires = await fetchFirmsCountry(apiKey, source, country, days);
      const fires = rawFires.map(normalizeFire);

      return json({
        fires,
        count: fires.length,
        country,
        source,
        days,
      });
    },
  },

  // 3. firms_active_point — Fires near a coordinate
  {
    name: "firms_active_point",
    description:
      "Find active fires near a specific geographic coordinate within a given radius. Computes a bounding box from the center point and radius, fetches FIRMS data, then filters results by actual haversine distance to ensure accuracy.",
    schema: {
      lat: z.number().describe("Latitude of the center point (-90 to 90)"),
      lng: z.number().describe("Longitude of the center point (-180 to 180)"),
      radius_km: z
        .number()
        .positive()
        .default(50)
        .optional()
        .describe("Search radius in kilometers from the center point. Default: 50"),
      days: daysEnum,
    },
    async execute(args, ctx) {
      const lat = args.lat as number;
      const lng = args.lng as number;
      const radiusKm = (args.radius_km as number | undefined) ?? 50;
      const days = (args.days as number | undefined) ?? 1;
      const apiKey = getFirmsApiKey(ctx);

      const bbox = bboxFromCenter(lat, lng, radiusKm);
      const rawFires = await fetchFirmsArea(
        apiKey,
        "VIIRS_SNPP",
        bbox.west,
        bbox.south,
        bbox.east,
        bbox.north,
        days,
      );

      // Filter by actual haversine distance
      const fires = rawFires
        .map(normalizeFire)
        .filter((f) => {
          const dist = haversine(lat, lng, f.latitude as number, f.longitude as number);
          return dist <= radiusKm;
        })
        .map((f) => ({
          ...f,
          distance_km:
            Math.round(haversine(lat, lng, f.latitude as number, f.longitude as number) * 100) /
            100,
        }));

      return json({
        fires,
        count: fires.length,
        center: { lat, lng },
        radiusKm,
      });
    },
  },

  // 4. firms_history — Historical fire data for a specific date
  {
    name: "firms_history",
    description:
      "Retrieve historical fire detection data from NASA FIRMS for a specific date and bounding box. Limited to recent data availability (typically the last 60 days for NRT products). Uses VIIRS SNPP sensor.",
    schema: {
      south: z.number().describe("Southern latitude of the bounding box (-90 to 90)"),
      west: z.number().describe("Western longitude of the bounding box (-180 to 180)"),
      north: z.number().describe("Northern latitude of the bounding box (-90 to 90)"),
      east: z.number().describe("Eastern longitude of the bounding box (-180 to 180)"),
      date: z
        .string()
        .describe("Target date in YYYY-MM-DD format (must be within FIRMS NRT retention window)"),
    },
    async execute(args, ctx) {
      const south = args.south as number;
      const west = args.west as number;
      const north = args.north as number;
      const east = args.east as number;
      const date = args.date as string;
      const apiKey = getFirmsApiKey(ctx);

      const rawFires = await fetchFirmsArea(
        apiKey,
        "VIIRS_SNPP",
        west,
        south,
        east,
        north,
        1,
        date,
      );
      const fires = rawFires.map(normalizeFire);

      return json({
        fires,
        count: fires.length,
        date,
        bbox: { south, west, north, east },
      });
    },
  },

  // 5. firms_latest — Latest global fire detections summary
  {
    name: "firms_latest",
    description:
      "Retrieve the latest global fire detections from NASA FIRMS. Returns the most recent fire hotspots worldwide, sorted by acquisition time (newest first). Useful for monitoring breaking wildfire events globally.",
    schema: {
      source: sourceEnum,
      limit: z
        .number()
        .int()
        .positive()
        .default(100)
        .optional()
        .describe("Maximum number of fire detections to return, sorted by most recent. Default: 100"),
    },
    async execute(args, ctx) {
      const source = (args.source as string | undefined) ?? "VIIRS_SNPP";
      const limit = (args.limit as number | undefined) ?? 100;
      const apiKey = getFirmsApiKey(ctx);

      // World bounding box
      const rawFires = await fetchFirmsArea(apiKey, source, -180, -90, 180, 90, 1);

      const fires = rawFires
        .map(normalizeFire)
        .sort((a, b) => {
          // Sort by date descending, then time descending
          const dateCompare = String(b.acq_date).localeCompare(String(a.acq_date));
          if (dateCompare !== 0) return dateCompare;
          return String(b.acq_time).localeCompare(String(a.acq_time));
        })
        .slice(0, limit);

      return json({
        fires,
        count: fires.length,
        source,
      });
    },
  },

  // 6. firms_summary — Fire statistics for area
  {
    name: "firms_summary",
    description:
      "Compute aggregate fire statistics for a geographic area over a time period. Returns total fire count, average brightness and fire radiative power (FRP), day vs. night distribution, and confidence level breakdown. Useful for wildfire risk assessment and trend analysis.",
    schema: {
      south: z.number().describe("Southern latitude of the bounding box (-90 to 90)"),
      west: z.number().describe("Western longitude of the bounding box (-180 to 180)"),
      north: z.number().describe("Northern latitude of the bounding box (-90 to 90)"),
      east: z.number().describe("Eastern longitude of the bounding box (-180 to 180)"),
      days: z
        .union([z.literal(1), z.literal(2), z.literal(7)])
        .default(7)
        .optional()
        .describe("Number of days to aggregate (1, 2, or 7). Default: 7"),
    },
    async execute(args, ctx) {
      const south = args.south as number;
      const west = args.west as number;
      const north = args.north as number;
      const east = args.east as number;
      const days = (args.days as number | undefined) ?? 7;
      const apiKey = getFirmsApiKey(ctx);

      const rawFires = await fetchFirmsArea(apiKey, "VIIRS_SNPP", west, south, east, north, days);
      const fires = rawFires.map(normalizeFire);

      if (fires.length === 0) {
        return json({
          totalFires: 0,
          avgBrightness: 0,
          avgFRP: 0,
          dayCount: 0,
          nightCount: 0,
          highConfidence: 0,
          nominalConfidence: 0,
          lowConfidence: 0,
          bbox: { south, west, north, east },
          days,
        });
      }

      const totalFires = fires.length;

      const avgBrightness =
        Math.round(
          (fires.reduce((sum, f) => sum + (f.brightness as number), 0) / totalFires) * 100,
        ) / 100;

      const avgFRP =
        Math.round(
          (fires.reduce((sum, f) => sum + (f.frp as number), 0) / totalFires) * 100,
        ) / 100;

      let dayCount = 0;
      let nightCount = 0;
      let highConfidence = 0;
      let nominalConfidence = 0;
      let lowConfidence = 0;

      for (const f of fires) {
        // Day/night distribution
        const dn = String(f.daynight).toUpperCase();
        if (dn === "D") dayCount++;
        else if (dn === "N") nightCount++;

        // Confidence distribution
        const conf = String(f.confidence).toLowerCase();
        if (conf === "high" || conf === "h") highConfidence++;
        else if (conf === "nominal" || conf === "n") nominalConfidence++;
        else if (conf === "low" || conf === "l") lowConfidence++;
        else {
          // Numeric confidence: high >= 80, nominal 30-79, low < 30
          const confNum = parseInt(conf, 10);
          if (!isNaN(confNum)) {
            if (confNum >= 80) highConfidence++;
            else if (confNum >= 30) nominalConfidence++;
            else lowConfidence++;
          }
        }
      }

      return json({
        totalFires,
        avgBrightness,
        avgFRP,
        dayCount,
        nightCount,
        highConfidence,
        nominalConfidence,
        lowConfidence,
        bbox: { south, west, north, east },
        days,
      });
    },
  },
];
