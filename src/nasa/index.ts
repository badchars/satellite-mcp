import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

// ─── Rate Limiter & Cache ───

const limiter = new RateLimiter(1000);
const cache = new TTLCache<unknown>(30 * 60 * 1000); // 30-minute TTL

// ─── Helpers ───

function getNasaApiKey(ctx: ToolContext): string {
  return ctx.config.nasaApiKey ?? "DEMO_KEY";
}

async function nasaFetch<T>(url: string, cacheKey: string): Promise<T> {
  const cached = cache.get(cacheKey);
  if (cached !== undefined) return cached as T;

  await limiter.acquire();

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`NASA API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as T;
  cache.set(cacheKey, data);
  return data;
}

// ─── Tools ───

export const nasaTools: ToolDef[] = [
  // 1. nasa_earth_image — Landsat imagery URL for coordinate
  {
    name: "nasa_earth_image",
    description:
      "Get a Landsat 8 natural color satellite imagery URL for a specific geographic coordinate and date. Returns a direct URL to the image tile from the NASA Earth API. Useful for visual inspection of a location from space.",
    schema: {
      lat: z.number().describe("Latitude of the target location (-90 to 90)"),
      lng: z.number().describe("Longitude of the target location (-180 to 180)"),
      date: z
        .string()
        .optional()
        .describe(
          "Target date in YYYY-MM-DD format. The API returns the closest available image. Defaults to today.",
        ),
      dim: z
        .number()
        .positive()
        .default(0.025)
        .optional()
        .describe(
          "Width and height of the image viewport in degrees. Smaller values zoom in. Default: 0.025 (~2.5 km at equator)",
        ),
    },
    async execute(args, ctx) {
      const lat = args.lat as number;
      const lng = args.lng as number;
      const date = (args.date as string | undefined) ?? new Date().toISOString().split("T")[0];
      const dim = (args.dim as number | undefined) ?? 0.025;
      const key = getNasaApiKey(ctx);

      const url = `https://api.nasa.gov/planetary/earth/imagery?lon=${lng}&lat=${lat}&date=${date}&dim=${dim}&api_key=${key}`;
      const cacheKey = `nasa_earth_image:${lat},${lng},${date},${dim}`;

      // For imagery endpoint, we just need to verify it returns a valid response
      // The URL itself serves as the image — NASA redirects to the actual tile
      const cached = cache.get(cacheKey);
      if (cached !== undefined) return json(cached);

      await limiter.acquire();

      // Verify the endpoint is valid by making a HEAD-like request
      const res = await fetch(url, { method: "GET", redirect: "follow" });
      if (!res.ok) {
        throw new Error(`NASA Earth Imagery API error: ${res.status} ${res.statusText}`);
      }

      // Consume the body to avoid leaking
      await res.arrayBuffer();

      const result = {
        url,
        date,
        lat,
        lng,
        note: "Returns Landsat 8 natural color image URL",
      };

      cache.set(cacheKey, result);
      return json(result);
    },
  },

  // 2. nasa_earth_assets — Available imagery dates for location
  {
    name: "nasa_earth_assets",
    description:
      "List available Landsat 8 imagery dates for a geographic coordinate. Returns a count and sorted list of dates when satellite imagery was captured at the given location. Useful for finding valid dates before requesting imagery.",
    schema: {
      lat: z.number().describe("Latitude of the target location (-90 to 90)"),
      lng: z.number().describe("Longitude of the target location (-180 to 180)"),
    },
    async execute(args, ctx) {
      const lat = args.lat as number;
      const lng = args.lng as number;
      const key = getNasaApiKey(ctx);

      const url = `https://api.nasa.gov/planetary/earth/assets?lon=${lng}&lat=${lat}&api_key=${key}`;
      const cacheKey = `nasa_earth_assets:${lat},${lng}`;

      const data = await nasaFetch<{
        count: number;
        results: { date: string; id: string }[];
      }>(url, cacheKey);

      const dates = (data.results ?? []).map((r) => r.date).sort();

      return json({
        count: dates.length,
        dates,
        lat,
        lng,
      });
    },
  },

  // 3. nasa_epic_latest — Latest DSCOVR EPIC full-Earth image
  {
    name: "nasa_epic_latest",
    description:
      "Get the latest full-disk Earth photograph from DSCOVR's EPIC (Earth Polychromatic Imaging Camera) instrument positioned at the L1 Lagrange point. Returns image URL, caption, centroid coordinates, and sun position data.",
    schema: {},
    async execute(_args, ctx) {
      const key = getNasaApiKey(ctx);

      const url = `https://api.nasa.gov/EPIC/api/natural?api_key=${key}`;
      const cacheKey = "nasa_epic_latest";

      const data = await nasaFetch<
        {
          identifier: string;
          caption: string;
          image: string;
          date: string;
          centroid_coordinates: { lat: number; lon: number };
          sun_j2000_position: { x: number; y: number; z: number };
        }[]
      >(url, cacheKey);

      if (!data || data.length === 0) {
        throw new Error("No EPIC images available");
      }

      const latest = data[0];

      // Parse date to construct archive URL: YYYY/MM/DD
      const dateParts = latest.date.split(" ")[0].split("-");
      const yyyy = dateParts[0];
      const mm = dateParts[1];
      const dd = dateParts[2];
      const imageUrl = `https://api.nasa.gov/EPIC/archive/natural/${yyyy}/${mm}/${dd}/png/${latest.image}.png?api_key=${key}`;

      return json({
        date: latest.date,
        caption: latest.caption,
        imageUrl,
        centroid_coordinates: latest.centroid_coordinates,
        sun_j2000_position: latest.sun_j2000_position,
      });
    },
  },

  // 4. nasa_epic_date — EPIC images for specific date
  {
    name: "nasa_epic_date",
    description:
      "Get DSCOVR EPIC full-Earth photographs for a specific date. EPIC captures about 12-22 images per day as Earth rotates, showing different hemispheres. Returns image URLs, captions, and centroid coordinates for each frame.",
    schema: {
      date: z
        .string()
        .describe("Target date in YYYY-MM-DD format for which to retrieve EPIC images"),
    },
    async execute(args, ctx) {
      const date = args.date as string;
      const key = getNasaApiKey(ctx);

      const url = `https://api.nasa.gov/EPIC/api/natural/date/${date}?api_key=${key}`;
      const cacheKey = `nasa_epic_date:${date}`;

      const data = await nasaFetch<
        {
          identifier: string;
          caption: string;
          image: string;
          date: string;
          centroid_coordinates: { lat: number; lon: number };
        }[]
      >(url, cacheKey);

      const dateParts = date.split("-");
      const yyyy = dateParts[0];
      const mm = dateParts[1];
      const dd = dateParts[2];

      const images = (data ?? []).map((img) => ({
        caption: img.caption,
        imageUrl: `https://api.nasa.gov/EPIC/archive/natural/${yyyy}/${mm}/${dd}/png/${img.image}.png?api_key=${key}`,
        centroid_coordinates: img.centroid_coordinates,
      }));

      return json({
        date,
        count: images.length,
        images,
      });
    },
  },

  // 5. nasa_epic_archive — Available EPIC archive dates
  {
    name: "nasa_epic_archive",
    description:
      "List all available dates in the DSCOVR EPIC image archive. EPIC has been capturing full-disk Earth images since 2015. Returns a list of dates for which imagery is available.",
    schema: {},
    async execute(_args, ctx) {
      const key = getNasaApiKey(ctx);

      const url = `https://api.nasa.gov/EPIC/api/natural/all?api_key=${key}`;
      const cacheKey = "nasa_epic_archive";

      const data = await nasaFetch<{ date: string }[]>(url, cacheKey);

      const dates = (data ?? []).map((d) => d.date).sort();

      return json({
        count: dates.length,
        dates,
      });
    },
  },

  // 6. nasa_power_data — Solar/weather parameters for location
  {
    name: "nasa_power_data",
    description:
      "Retrieve daily solar and meteorological parameters from NASA POWER (Prediction of Worldwide Energy Resources) for a location and date range. Provides data such as downward solar radiation (ALLSKY_SFC_SW_DWN), temperature at 2m (T2M), and wind speed at 2m (WS2M). Useful for renewable energy assessment and agricultural planning.",
    schema: {
      lat: z.number().describe("Latitude of the target location (-90 to 90)"),
      lng: z.number().describe("Longitude of the target location (-180 to 180)"),
      start_date: z
        .string()
        .describe("Start date in YYYYMMDD format (e.g. '20240101')"),
      end_date: z
        .string()
        .describe("End date in YYYYMMDD format (e.g. '20240131'). Max range ~1 year per request."),
      parameters: z
        .string()
        .default("ALLSKY_SFC_SW_DWN,T2M,WS2M")
        .optional()
        .describe(
          "Comma-separated NASA POWER parameter codes. Common: ALLSKY_SFC_SW_DWN (solar irradiance kW-hr/m2/day), T2M (temperature C), WS2M (wind speed m/s), RH2M (relative humidity %), PRECTOTCORR (precipitation mm/day). Default: 'ALLSKY_SFC_SW_DWN,T2M,WS2M'",
        ),
    },
    async execute(args, ctx) {
      const lat = args.lat as number;
      const lng = args.lng as number;
      const startDate = args.start_date as string;
      const endDate = args.end_date as string;
      const params = (args.parameters as string | undefined) ?? "ALLSKY_SFC_SW_DWN,T2M,WS2M";

      const url = `https://power.larc.nasa.gov/api/temporal/daily/point?start=${startDate}&end=${endDate}&latitude=${lat}&longitude=${lng}&community=RE&parameters=${params}&format=JSON`;
      const cacheKey = `nasa_power:${lat},${lng},${startDate},${endDate},${params}`;

      const data = await nasaFetch<{
        properties: {
          parameter: Record<string, Record<string, number>>;
        };
      }>(url, cacheKey);

      return json({
        parameters: data.properties?.parameter ?? {},
        lat,
        lng,
        startDate,
        endDate,
      });
    },
  },

  // 7. nasa_gibs_tile — GIBS WMTS map tile URL
  {
    name: "nasa_gibs_tile",
    description:
      "Construct a NASA GIBS (Global Imagery Browse Services) WMTS tile URL for a specific layer, date, and tile coordinate. GIBS provides near-real-time and archival satellite imagery as map tiles. Common layers: VIIRS_SNPP_CorrectedReflectance_TrueColor, MODIS_Terra_CorrectedReflectance_TrueColor, MODIS_Aqua_CorrectedReflectance_TrueColor, VIIRS_SNPP_Thermal_Anomalies_375m_Night, VIIRS_Black_Marble, MODIS_Terra_Snow_Cover, MODIS_Combined_MAIAC_L2G_AerosolOpticalDepth. Tiles can be viewed in map clients or downloaded directly.",
    schema: {
      layer: z
        .string()
        .describe(
          "GIBS layer identifier. Examples: 'VIIRS_SNPP_CorrectedReflectance_TrueColor', 'MODIS_Terra_CorrectedReflectance_TrueColor', 'VIIRS_SNPP_Thermal_Anomalies_375m_Night', 'VIIRS_Black_Marble', 'MODIS_Terra_Snow_Cover'",
        ),
      date: z
        .string()
        .describe("Imagery date in YYYY-MM-DD format"),
      z: z
        .number()
        .int()
        .min(0)
        .max(9)
        .describe("Zoom level (0-9). 0 = global view, 9 = max detail"),
      x: z
        .number()
        .int()
        .min(0)
        .describe("Tile column index (depends on zoom level)"),
      y: z
        .number()
        .int()
        .min(0)
        .describe("Tile row index (depends on zoom level)"),
    },
    async execute(args) {
      const layer = args.layer as string;
      const date = args.date as string;
      const zoom = args.z as number;
      const x = args.x as number;
      const y = args.y as number;

      const tileUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/${layer}/default/${date}/250m/${zoom}/${y}/${x}.jpg`;

      return json({
        tileUrl,
        layer,
        date,
        zoom,
        x,
        y,
        note: "Use in map viewers or download directly",
      });
    },
  },
];
