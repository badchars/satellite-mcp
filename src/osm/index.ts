// OpenStreetMap / Overpass API — 8 tools (free, no auth)
// Tools: osm_query, osm_buildings, osm_infrastructure, osm_military, osm_airports, osm_water, osm_industrial, osm_identify

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

function getCoords(e: any): { lat: number; lng: number } | null {
  if (e.lat !== undefined && e.lon !== undefined) return { lat: e.lat, lng: e.lon };
  if (e.center) return { lat: e.center.lat, lng: e.center.lon };
  return null;
}

const bboxSchema = {
  south: z.number().min(-90).max(90).describe("South latitude"),
  west: z.number().min(-180).max(180).describe("West longitude"),
  north: z.number().min(-90).max(90).describe("North latitude"),
  east: z.number().min(-180).max(180).describe("East longitude"),
};

export const osmTools: ToolDef[] = [
  {
    name: "osm_query",
    description: "Run a custom Overpass QL query against OpenStreetMap data. Returns GeoJSON-like elements.",
    schema: {
      query: z.string().describe("Full Overpass QL query string"),
      timeout: z.number().int().min(5).max(60).default(25).describe("Query timeout in seconds"),
    },
    async execute(args) {
      let q = (args as any).query as string;
      if (!q.includes("[out:")) q = `[out:json][timeout:${(args as any).timeout}];${q}`;
      const data = await overpassQuery(q);
      return json({ elements: data.elements ?? [], count: (data.elements ?? []).length });
    },
  },
  {
    name: "osm_buildings",
    description: "Count and classify buildings in a bounding box — residential, commercial, industrial, etc.",
    schema: bboxSchema,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(way["building"](${south},${west},${north},${east}););out center qt 500;`);
      const byType: Record<string, number> = {};
      for (const e of data.elements ?? []) {
        const t = e.tags?.building ?? "yes";
        byType[t] = (byType[t] ?? 0) + 1;
      }
      const sample = (data.elements ?? []).slice(0, 20).map((e: any) => {
        const c = getCoords(e);
        return { lat: c?.lat, lng: c?.lng, type: e.tags?.building, name: e.tags?.name };
      });
      return json({ totalBuildings: (data.elements ?? []).length, byType, sample });
    },
  },
  {
    name: "osm_infrastructure",
    description: "Find roads, bridges, and railways in a bounding box.",
    schema: bboxSchema,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(way["highway"](${south},${west},${north},${east});way["bridge"="yes"](${south},${west},${north},${east});way["railway"](${south},${west},${north},${east}););out center qt 300;`);
      const byHighway: Record<string, number> = {};
      let bridges = 0, railways = 0, roads = 0;
      for (const e of data.elements ?? []) {
        if (e.tags?.bridge) bridges++;
        if (e.tags?.railway) railways++;
        if (e.tags?.highway) { roads++; byHighway[e.tags.highway] = (byHighway[e.tags.highway] ?? 0) + 1; }
      }
      return json({ roads, bridges, railways, byHighwayType: byHighway });
    },
  },
  {
    name: "osm_military",
    description: "Find military facilities (bases, airfields, barracks, bunkers, checkpoints, ranges) in a bounding box.",
    schema: bboxSchema,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:30];(node["military"](${south},${west},${north},${east});way["military"](${south},${west},${north},${east});relation["military"](${south},${west},${north},${east}););out center qt 200;`);
      const byType: Record<string, number> = {};
      const facilities = (data.elements ?? []).map((e: any) => {
        const t = e.tags?.military ?? "unknown";
        byType[t] = (byType[t] ?? 0) + 1;
        const c = getCoords(e);
        return { name: e.tags?.name ?? "Unnamed", type: t, lat: c?.lat, lng: c?.lng };
      });
      return json({ totalFacilities: facilities.length, byType, facilities });
    },
  },
  {
    name: "osm_airports",
    description: "Find airports, airfields, and helipads in a bounding box.",
    schema: bboxSchema,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(node["aeroway"="aerodrome"](${south},${west},${north},${east});way["aeroway"="aerodrome"](${south},${west},${north},${east});node["aeroway"="helipad"](${south},${west},${north},${east});way["aeroway"="helipad"](${south},${west},${north},${east}););out center qt 100;`);
      const airports: any[] = [], helipads: any[] = [];
      for (const e of data.elements ?? []) {
        const c = getCoords(e);
        const item = { name: e.tags?.name ?? "Unnamed", icao: e.tags?.icao, iata: e.tags?.iata, type: e.tags?.aeroway, lat: c?.lat, lng: c?.lng };
        if (e.tags?.aeroway === "helipad") helipads.push(item);
        else airports.push(item);
      }
      return json({ airports, helipads, totalAirports: airports.length, totalHelipads: helipads.length });
    },
  },
  {
    name: "osm_water",
    description: "Find water bodies, rivers, streams, and dams in a bounding box.",
    schema: bboxSchema,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(way["natural"="water"](${south},${west},${north},${east});way["waterway"](${south},${west},${north},${east});node["waterway"="dam"](${south},${west},${north},${east});way["waterway"="dam"](${south},${west},${north},${east}););out center qt 200;`);
      let waterBodies = 0, rivers = 0, dams = 0;
      for (const e of data.elements ?? []) {
        if (e.tags?.natural === "water") waterBodies++;
        if (e.tags?.waterway === "river" || e.tags?.waterway === "stream") rivers++;
        if (e.tags?.waterway === "dam") dams++;
      }
      return json({ waterBodies, rivers, dams, totalFeatures: (data.elements ?? []).length });
    },
  },
  {
    name: "osm_industrial",
    description: "Find industrial sites, power plants, and refineries in a bounding box.",
    schema: bboxSchema,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(way["landuse"="industrial"](${south},${west},${north},${east});node["power"="plant"](${south},${west},${north},${east});way["power"="plant"](${south},${west},${north},${east});node["man_made"="works"](${south},${west},${north},${east});way["man_made"="works"](${south},${west},${north},${east}););out center qt 200;`);
      let powerPlants = 0, industrialAreas = 0;
      const items = (data.elements ?? []).map((e: any) => {
        if (e.tags?.power === "plant") powerPlants++;
        if (e.tags?.landuse === "industrial") industrialAreas++;
        const c = getCoords(e);
        return { name: e.tags?.name, type: e.tags?.power ?? e.tags?.landuse ?? e.tags?.man_made, lat: c?.lat, lng: c?.lng };
      });
      return json({ totalSites: items.length, powerPlants, industrialAreas, items: items.slice(0, 50) });
    },
  },
  {
    name: "osm_identify",
    description: "Identify what is at a given coordinate — search within a radius for named features.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
      radius: z.number().min(10).max(5000).default(100).describe("Search radius in meters"),
    },
    async execute(args) {
      const { lat, lng, radius } = args as { lat: number; lng: number; radius: number };
      const data = await overpassQuery(`[out:json][timeout:15];(node(around:${radius},${lat},${lng})["name"];way(around:${radius},${lat},${lng})["name"];);out center qt 50;`);
      const features = (data.elements ?? []).map((e: any) => {
        const c = getCoords(e);
        return { name: e.tags?.name, type: e.tags?.amenity ?? e.tags?.building ?? e.tags?.shop ?? e.tags?.highway ?? e.type, tags: e.tags, lat: c?.lat, lng: c?.lng };
      });
      return json({ location: { lat, lng }, radius_m: radius, features, count: features.length });
    },
  },
];
