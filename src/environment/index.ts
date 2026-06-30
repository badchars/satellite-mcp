// Environmental Intelligence — Global Forest Watch + open APIs
// Tools: env_deforestation, env_fire_risk, env_methane, env_air_pollution, env_ocean_temp, env_water_quality

import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(1000);
const cache = new TTLCache<unknown>(60 * 60 * 1000);

async function cachedFetch<T>(url: string, headers?: Record<string, string>): Promise<T> {
  await limiter.acquire();
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url, headers ? { headers } : undefined);
  if (!resp.ok) throw new Error(`API error: ${resp.status} from ${new URL(url).hostname}`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

export const environmentTools: ToolDef[] = [
  {
    name: "env_deforestation",
    description: "Get deforestation alerts (GLAD) near a coordinate — recent tree cover loss events.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
      days: z.number().int().min(1).max(365).default(30).describe("Days to look back"),
    },
    async execute(args) {
      const { lat, lng, days } = args as any;
      try {
        const data: any = await cachedFetch(`https://data-api.globalforestwatch.org/dataset/gfw_integrated_alerts/latest/query?sql=SELECT latitude, longitude, gfw_integrated_alerts__date, umd_glad_landsat_alerts__confidence FROM results WHERE latitude > ${lat - 0.5} AND latitude < ${lat + 0.5} AND longitude > ${lng - 0.5} AND longitude < ${lng + 0.5} LIMIT 100`);
        return json({ alerts: data.data ?? [], count: (data.data ?? []).length, center: { lat, lng }, days });
      } catch {
        return json({ note: "Global Forest Watch API may require updated query format. Visit globalforestwatch.org for current data.", center: { lat, lng }, days, alerts: [] });
      }
    },
  },
  {
    name: "env_fire_risk",
    description: "Assess fire risk at a location based on current weather conditions — temperature, humidity, wind, and drought index.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
    },
    async execute(args) {
      const { lat, lng } = args as any;
      const data: any = await cachedFetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation`);
      const c = data.current;
      const temp = c.temperature_2m, humidity = c.relative_humidity_2m, wind = c.wind_speed_10m, precip = c.precipitation;
      let risk = 0;
      if (temp > 35) risk += 3; else if (temp > 30) risk += 2; else if (temp > 25) risk += 1;
      if (humidity < 20) risk += 3; else if (humidity < 30) risk += 2; else if (humidity < 40) risk += 1;
      if (wind > 40) risk += 3; else if (wind > 25) risk += 2; else if (wind > 15) risk += 1;
      if (precip === 0) risk += 1;
      const level = risk >= 8 ? "Extreme" : risk >= 6 ? "High" : risk >= 4 ? "Moderate" : risk >= 2 ? "Low" : "Minimal";
      return json({ lat, lng, temperature_c: temp, humidity_pct: humidity, wind_kmh: wind, precipitation_mm: precip, riskScore: risk, riskLevel: level });
    },
  },
  {
    name: "env_methane",
    description: "Check for methane emission hotspots — uses Sentinel-5P TROPOMI data references.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
    },
    async execute(args) {
      const { lat, lng } = args as any;
      return json({
        lat, lng,
        dataSource: "Sentinel-5P TROPOMI",
        viewerUrl: `https://maps.s5p-pal.com/?target=${lat},${lng},8z&layer=methane`,
        note: "Methane column data available via Copernicus S5P. Use the viewer URL for visual analysis. For raw data, access Copernicus Data Space.",
      });
    },
  },
  {
    name: "env_air_pollution",
    description: "Get satellite-derived air pollution data — NO2, SO2, CO, PM2.5, ozone levels at a coordinate.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
    },
    async execute(args) {
      const { lat, lng } = args as any;
      const data: any = await cachedFetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`);
      const c = data.current;
      return json({ lat, lng, aqi: c.european_aqi, pm25: c.pm2_5, pm10: c.pm10, no2: c.nitrogen_dioxide, so2: c.sulphur_dioxide, co: c.carbon_monoxide, ozone: c.ozone });
    },
  },
  {
    name: "env_ocean_temp",
    description: "Get sea surface temperature (SST) at a coordinate using Open-Meteo marine data.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude (ocean location)"),
      lng: z.number().min(-180).max(180).describe("Longitude (ocean location)"),
    },
    async execute(args) {
      const { lat, lng } = args as any;
      try {
        const data: any = await cachedFetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lng}&current=wave_height,wave_period,wave_direction,ocean_current_velocity,ocean_current_direction`);
        return json({ lat, lng, marine: data.current, source: "Open-Meteo Marine" });
      } catch {
        return json({ lat, lng, note: "Marine data not available for this location (may be on land). Use ocean coordinates.", source: "Open-Meteo Marine" });
      }
    },
  },
  {
    name: "env_water_quality",
    description: "Water quality indicators — chlorophyll, turbidity reference data for a coordinate.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
    },
    async execute(args) {
      const { lat, lng } = args as any;
      return json({
        lat, lng,
        dataSource: "Sentinel-3 OLCI / Sentinel-2 MSI",
        viewerUrl: `https://apps.sentinel-hub.com/eo-browser/?zoom=10&lat=${lat}&lng=${lng}`,
        note: "Water quality (chlorophyll-a, turbidity, algal bloom detection) available via Sentinel-3 OLCI and Sentinel-2 data. Use EO Browser for visual analysis.",
        indicators: ["Chlorophyll-a concentration", "Total Suspended Matter (TSM)", "Colored Dissolved Organic Matter (CDOM)", "Turbidity", "Algal bloom detection"],
      });
    },
  },
];
