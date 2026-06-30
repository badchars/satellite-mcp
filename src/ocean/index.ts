// Ocean Intelligence — NOAA Buoys + Open-Meteo Marine
// Tools: ocean_buoy_data, ocean_currents, ocean_sea_ice, ocean_chlorophyll, ocean_sst_anomaly

import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(1000);
const cache = new TTLCache<unknown>(15 * 60 * 1000);

async function cachedFetch<T>(url: string): Promise<T> {
  await limiter.acquire();
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`API error: ${resp.status}`);
  const text = await resp.text();
  try { const data = JSON.parse(text); cache.set(url, data); return data as T; }
  catch { return { raw: text } as any; }
}

export const oceanTools: ToolDef[] = [
  {
    name: "ocean_buoy_data",
    description: "Get ocean buoy measurements — wave height, wind, temperature, pressure from NOAA NDBC.",
    schema: { station: z.string().describe("NDBC station ID (e.g. '41004', '46042')") },
    async execute(args) {
      const { station } = args as { station: string };
      try {
        const data: any = await cachedFetch(`https://www.ndbc.noaa.gov/data/latest_obs/${station}.txt`);
        return json({ station, rawData: data.raw ?? data, source: "NOAA NDBC", note: "Parse station observation text for wind, wave, temperature, and pressure data.", url: `https://www.ndbc.noaa.gov/station_page.php?station=${station}` });
      } catch {
        return json({ station, note: `NOAA buoy data available at https://www.ndbc.noaa.gov/station_page.php?station=${station}`, source: "NOAA NDBC" });
      }
    },
  },
  {
    name: "ocean_currents",
    description: "Get ocean current information for a marine location using Open-Meteo marine data.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude (ocean location)"),
      lng: z.number().min(-180).max(180).describe("Longitude (ocean location)"),
    },
    async execute(args) {
      const { lat, lng } = args as any;
      try {
        const data: any = await cachedFetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=ocean_current_velocity,ocean_current_direction&hourly=ocean_current_velocity,ocean_current_direction&forecast_days=3`);
        return json({ lat, lng, current: data.current, hourlyForecast: data.hourly ? { time: data.hourly.time?.slice(0, 24), velocity: data.hourly.ocean_current_velocity?.slice(0, 24), direction: data.hourly.ocean_current_direction?.slice(0, 24) } : null, source: "Open-Meteo Marine" });
      } catch {
        return json({ lat, lng, note: "Marine data not available for this location. Ensure coordinates are in ocean.", source: "Open-Meteo Marine" });
      }
    },
  },
  {
    name: "ocean_sea_ice",
    description: "Sea ice extent information — Arctic and Antarctic ice coverage reference.",
    schema: { region: z.enum(["arctic", "antarctic"]).default("arctic").describe("Polar region") },
    async execute(args) {
      const { region } = args as { region: string };
      return json({
        region,
        dataSource: "NSIDC (National Snow and Ice Data Center)",
        url: `https://nsidc.org/arcticseaicenews/`,
        viewerUrl: region === "arctic"
          ? "https://apps.sentinel-hub.com/eo-browser/?zoom=3&lat=75&lng=0"
          : "https://apps.sentinel-hub.com/eo-browser/?zoom=3&lat=-75&lng=0",
        note: "Sea ice extent data updated daily by NSIDC. For satellite imagery, use Sentinel-1 SAR or MODIS.",
      });
    },
  },
  {
    name: "ocean_chlorophyll",
    description: "Ocean chlorophyll concentration reference — fishing productivity and marine ecosystem indicator.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
    },
    async execute(args) {
      const { lat, lng } = args as any;
      return json({
        lat, lng,
        dataSource: "Sentinel-3 OLCI / NASA MODIS Aqua",
        viewerUrl: `https://apps.sentinel-hub.com/eo-browser/?zoom=8&lat=${lat}&lng=${lng}`,
        note: "Chlorophyll-a concentration indicates phytoplankton abundance. High levels suggest productive fishing areas or potential algal blooms.",
        interpretation: { low: "< 0.1 mg/m³ (oligotrophic — open ocean)", moderate: "0.1-1.0 mg/m³ (mesotrophic)", high: "1.0-10 mg/m³ (eutrophic — productive)", veryHigh: "> 10 mg/m³ (algal bloom risk)" },
      });
    },
  },
  {
    name: "ocean_sst_anomaly",
    description: "Sea surface temperature anomaly — El Nino/La Nina indicator and climate monitoring.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
    },
    async execute(args) {
      const { lat, lng } = args as any;
      try {
        const data: any = await cachedFetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&daily=wave_height_max,wave_period_max&past_days=7`);
        return json({ lat, lng, marineData: data.daily, source: "Open-Meteo Marine", note: "For SST anomaly maps, see NOAA Coral Reef Watch at coralreefwatch.noaa.gov" });
      } catch {
        return json({ lat, lng, note: "SST anomaly data available from NOAA at coralreefwatch.noaa.gov. El Nino monitoring at cpc.ncep.noaa.gov.", source: "NOAA" });
      }
    },
  },
];
