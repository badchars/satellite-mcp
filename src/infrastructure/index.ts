// Critical Infrastructure — Overpass API (free, no auth)
// Tools: infra_power, infra_pipelines, infra_telecom, infra_cables, infra_transport, infra_energy

import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(2000);
const cache = new TTLCache<unknown>(60 * 60 * 1000);

async function overpassQuery(query: string): Promise<any> {
  await limiter.acquire();
  const cached = cache.get(query);
  if (cached) return cached;
  const resp = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `data=${encodeURIComponent(query)}`,
  });
  if (!resp.ok) throw new Error(`Overpass API error: ${resp.status}`);
  const data = await resp.json();
  cache.set(query, data);
  return data;
}

function coords(e: any) {
  if (e.lat !== undefined) return { lat: e.lat, lng: e.lon };
  if (e.center) return { lat: e.center.lat, lng: e.center.lon };
  return null;
}

const bbox = {
  south: z.number().min(-90).max(90).describe("South latitude"),
  west: z.number().min(-180).max(180).describe("West longitude"),
  north: z.number().min(-90).max(90).describe("North latitude"),
  east: z.number().min(-180).max(180).describe("East longitude"),
};

export const infrastructureTools: ToolDef[] = [
  {
    name: "infra_power",
    description: "Find power plants, substations, and transmission lines in a bounding box.",
    schema: bbox,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(node["power"~"plant|substation|generator"](${south},${west},${north},${east});way["power"~"plant|substation|line"](${south},${west},${north},${east}););out center qt 200;`);
      let plants = 0, substations = 0, lines = 0;
      const items = (data.elements ?? []).map((e: any) => {
        if (e.tags?.power === "plant") plants++;
        else if (e.tags?.power === "substation") substations++;
        else if (e.tags?.power === "line") lines++;
        const c = coords(e);
        return { name: e.tags?.name, type: e.tags?.power, source: e.tags?.["generator:source"], lat: c?.lat, lng: c?.lng };
      });
      return json({ powerPlants: plants, substations, transmissionLines: lines, totalFacilities: items.length, items: items.slice(0, 50) });
    },
  },
  {
    name: "infra_pipelines",
    description: "Find oil, gas, and water pipelines in a bounding box.",
    schema: bbox,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(way["man_made"="pipeline"](${south},${west},${north},${east}););out center qt 200;`);
      const bySubstance: Record<string, number> = {};
      const items = (data.elements ?? []).map((e: any) => {
        const sub = e.tags?.substance ?? "unknown";
        bySubstance[sub] = (bySubstance[sub] ?? 0) + 1;
        const c = coords(e);
        return { name: e.tags?.name, substance: sub, operator: e.tags?.operator, lat: c?.lat, lng: c?.lng };
      });
      return json({ total: items.length, bySubstance, pipelines: items.slice(0, 50) });
    },
  },
  {
    name: "infra_telecom",
    description: "Find cell towers, communication masts, and data centers in a bounding box.",
    schema: bbox,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(node["tower:type"="communication"](${south},${west},${north},${east});node["man_made"="mast"]["tower:type"="communication"](${south},${west},${north},${east});node["building"="data_centre"](${south},${west},${north},${east});way["building"="data_centre"](${south},${west},${north},${east}););out center qt 200;`);
      let towers = 0, dataCenters = 0;
      for (const e of data.elements ?? []) {
        if (e.tags?.building === "data_centre") dataCenters++;
        else towers++;
      }
      return json({ cellTowers: towers, dataCenters, total: (data.elements ?? []).length });
    },
  },
  {
    name: "infra_cables",
    description: "Find submarine cable landing points in a bounding box.",
    schema: bbox,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(node["man_made"="submarine_cable_landing"](${south},${west},${north},${east}););out qt 100;`);
      const points = (data.elements ?? []).map((e: any) => ({
        name: e.tags?.name, operator: e.tags?.operator, lat: e.lat, lng: e.lon,
      }));
      return json({ landingPoints: points, total: points.length });
    },
  },
  {
    name: "infra_transport",
    description: "Find bridges, tunnels, ferry terminals, and train stations in a bounding box.",
    schema: bbox,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(way["man_made"="bridge"](${south},${west},${north},${east});way["tunnel"="yes"](${south},${west},${north},${east});node["amenity"="ferry_terminal"](${south},${west},${north},${east});node["railway"="station"](${south},${west},${north},${east}););out center qt 200;`);
      let bridges = 0, tunnels = 0, ferries = 0, trains = 0;
      for (const e of data.elements ?? []) {
        if (e.tags?.man_made === "bridge") bridges++;
        else if (e.tags?.tunnel) tunnels++;
        else if (e.tags?.amenity === "ferry_terminal") ferries++;
        else if (e.tags?.railway === "station") trains++;
      }
      return json({ bridges, tunnels, ferryTerminals: ferries, trainStations: trains, total: (data.elements ?? []).length });
    },
  },
  {
    name: "infra_energy",
    description: "Find renewable energy installations — wind turbines and solar farms in a bounding box.",
    schema: bbox,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(node["generator:source"="wind"](${south},${west},${north},${east});way["generator:source"="wind"](${south},${west},${north},${east});node["generator:source"="solar"](${south},${west},${north},${east});way["generator:source"="solar"](${south},${west},${north},${east});way["power"="plant"]["plant:source"="solar"](${south},${west},${north},${east}););out center qt 200;`);
      let wind = 0, solar = 0;
      for (const e of data.elements ?? []) {
        const src = e.tags?.["generator:source"] ?? e.tags?.["plant:source"];
        if (src === "wind") wind++;
        else if (src === "solar") solar++;
      }
      return json({ windTurbines: wind, solarFarms: solar, total: (data.elements ?? []).length });
    },
  },
];
