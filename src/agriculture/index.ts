// Agriculture & Food Security — FAO + FEWS NET
// Tools: agri_crop_health, agri_drought, agri_food_price, agri_famine_risk, agri_locust

import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(1000);
const cache = new TTLCache<unknown>(60 * 60 * 1000);

async function cachedFetch<T>(url: string): Promise<T> {
  await limiter.acquire();
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`API error: ${resp.status}`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

export const agricultureTools: ToolDef[] = [
  {
    name: "agri_crop_health",
    description: "Assess crop health at a location using NDVI time series reference — links to satellite vegetation indices.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude of agricultural area"),
      lng: z.number().min(-180).max(180).describe("Longitude of agricultural area"),
    },
    async execute(args) {
      const { lat, lng } = args as any;
      return json({
        lat, lng,
        assessment: "Use spectral_ndvi tool with Sentinel-2 NIR and Red band values for this location",
        ndviGuide: { healthy: "> 0.6", moderate: "0.3 - 0.6", stressed: "0.1 - 0.3", bare: "< 0.1" },
        sentinelViewer: `https://apps.sentinel-hub.com/eo-browser/?zoom=13&lat=${lat}&lng=${lng}`,
        note: "For time series NDVI analysis, use Sentinel-2 imagery (5-day revisit, 10m resolution).",
      });
    },
  },
  {
    name: "agri_drought",
    description: "Drought assessment at a location using weather indicators — temperature, precipitation, humidity analysis.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
    },
    async execute(args) {
      const { lat, lng } = args as any;
      const data: any = await cachedFetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,precipitation_sum&past_days=30&timezone=auto`);
      const d = data.daily;
      const totalPrecip = (d.precipitation_sum ?? []).reduce((s: number, v: number) => s + (v ?? 0), 0);
      const avgTemp = (d.temperature_2m_max ?? []).reduce((s: number, v: number) => s + (v ?? 0), 0) / ((d.temperature_2m_max ?? []).length || 1);
      const dryDays = (d.precipitation_sum ?? []).filter((v: number) => (v ?? 0) < 1).length;
      let severity = "None";
      if (totalPrecip < 5 && avgTemp > 30) severity = "Extreme";
      else if (totalPrecip < 15 && avgTemp > 25) severity = "Severe";
      else if (totalPrecip < 30) severity = "Moderate";
      else if (totalPrecip < 50) severity = "Mild";
      return json({ lat, lng, last30Days: { totalPrecipitation_mm: Math.round(totalPrecip * 10) / 10, avgMaxTemp_c: Math.round(avgTemp * 10) / 10, dryDays }, droughtSeverity: severity });
    },
  },
  {
    name: "agri_food_price",
    description: "FAO Food Price Index — global food commodity price trends.",
    schema: {},
    async execute() {
      try {
        const data: any = await cachedFetch("https://www.fao.org/worldfoodsituation/foodpricesindex/en/");
        return json({ note: "FAO Food Price Index API access may require direct download.", url: "https://www.fao.org/worldfoodsituation/foodpricesindex/en/", source: "FAO" });
      } catch {
        return json({
          source: "FAO Food Price Index",
          url: "https://www.fao.org/worldfoodsituation/foodpricesindex/en/",
          indices: ["Cereals", "Vegetable Oils", "Dairy", "Meat", "Sugar"],
          note: "Visit FAO website for latest food price index data. The index tracks monthly changes in international prices of food commodities.",
        });
      }
    },
  },
  {
    name: "agri_famine_risk",
    description: "Famine risk assessment using FEWS NET IPC phase classification reference.",
    schema: { country: z.string().describe("Country name") },
    async execute(args) {
      const { country } = args as { country: string };
      try {
        const data: any = await cachedFetch(`https://fdw.fews.net/api/ipcphase/?country=${encodeURIComponent(country)}&format=json`);
        return json({ country, data: data.results ?? data, source: "FEWS NET" });
      } catch {
        return json({
          country, source: "FEWS NET",
          url: "https://fews.net/",
          ipcPhases: [
            { phase: 1, label: "Minimal", description: "Food secure" },
            { phase: 2, label: "Stressed", description: "Borderline food insecure" },
            { phase: 3, label: "Crisis", description: "Acute food insecurity" },
            { phase: 4, label: "Emergency", description: "Humanitarian emergency" },
            { phase: 5, label: "Famine", description: "Catastrophic food insecurity" },
          ],
          note: "Visit fews.net for current IPC phase classifications by country and region.",
        });
      }
    },
  },
  {
    name: "agri_locust",
    description: "Desert locust swarm tracking and alerts from FAO Locust Watch.",
    schema: {},
    async execute() {
      try {
        const data: any = await cachedFetch("https://locust-hub-hqfao.hub.arcgis.com/api/v3/datasets?q=swarm");
        return json({ data: data.data ?? data, source: "FAO Desert Locust Watch" });
      } catch {
        return json({
          source: "FAO Desert Locust Information Service",
          url: "https://www.fao.org/ag/locusts/en/info/info/index.html",
          monitoringRegions: ["West Africa", "North Africa", "Horn of Africa", "Southwest Asia", "South Asia"],
          note: "FAO provides regular Desert Locust bulletins and situation updates. Visit the Locust Watch for current swarm locations and forecasts.",
        });
      }
    },
  },
];
