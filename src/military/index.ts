// Military & Defense — OSM Overpass + OpenSky data
// Tools: mil_bases, mil_aircraft, mil_airspace, mil_naval, mil_nuclear, mil_missile, mil_radar, mil_activity

import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
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
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
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

const MIL_PREFIXES = ["ae", "af", "43c", "3f", "3e", "340", "300", "33", "3b"];

export const militaryTools: ToolDef[] = [
  {
    name: "mil_bases",
    description: "Find military bases, barracks, airfields, ranges, and bunkers in a bounding box using OpenStreetMap data.",
    schema: bbox,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:30];(node["military"](${south},${west},${north},${east});way["military"](${south},${west},${north},${east});relation["military"](${south},${west},${north},${east}););out center qt 200;`);
      const byType: Record<string, number> = {};
      const facilities = (data.elements ?? []).map((e: any) => {
        const t = e.tags?.military ?? "unknown";
        byType[t] = (byType[t] ?? 0) + 1;
        const c = coords(e);
        return { name: e.tags?.name ?? "Unnamed", type: t, lat: c?.lat, lng: c?.lng };
      });
      return json({ facilities, count: facilities.length, byType });
    },
  },
  {
    name: "mil_aircraft",
    description: "Track live military aircraft in a bounding box by filtering ICAO24 hex ranges assigned to military operators.",
    schema: bbox,
    async execute(args, ctx) {
      const { south, west, north, east } = args as any;
      const resp = await fetch(`https://opensky-network.org/api/states/all?lamin=${south}&lomin=${west}&lamax=${north}&lomax=${east}`, {
        headers: ctx.config.openskyUsername && ctx.config.openskyPassword
          ? { Authorization: `Basic ${Buffer.from(`${ctx.config.openskyUsername}:${ctx.config.openskyPassword}`).toString("base64")}` }
          : {},
      });
      if (!resp.ok) throw new Error(`OpenSky API error: ${resp.status}`);
      const data: any = await resp.json();
      const military = (data.states ?? []).filter((s: any[]) => {
        const hex = (s[0] ?? "").toLowerCase();
        return MIL_PREFIXES.some(p => hex.startsWith(p));
      }).map((s: any[]) => ({
        icao24: s[0], callsign: (s[1] ?? "").trim(), originCountry: s[2],
        lat: s[6], lng: s[5], altitude_m: s[7], velocity_ms: s[9], heading: s[10],
        affiliation: MIL_PREFIXES.find(p => s[0].toLowerCase().startsWith(p)) ?? "Unknown",
      }));
      return json({ aircraft: military, count: military.length, bbox: { south, west, north, east } });
    },
  },
  {
    name: "mil_airspace",
    description: "Find restricted, danger, prohibited, and military airspace zones in a bounding box.",
    schema: bbox,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(way["airspace:type"~"restricted|danger|prohibited|military"](${south},${west},${north},${east});relation["airspace:type"~"restricted|danger|prohibited|military"](${south},${west},${north},${east}););out center qt 100;`);
      const zones = (data.elements ?? []).map((e: any) => {
        const c = coords(e);
        return { name: e.tags?.name, type: e.tags?.["airspace:type"], class: e.tags?.["airspace:class"], lat: c?.lat, lng: c?.lng };
      });
      return json({ zones, count: zones.length });
    },
  },
  {
    name: "mil_naval",
    description: "Find naval bases and military ports in a bounding box.",
    schema: bbox,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(node["military"="naval_base"](${south},${west},${north},${east});way["military"="naval_base"](${south},${west},${north},${east});node["harbour:category"="military"](${south},${west},${north},${east});way["harbour:category"="military"](${south},${west},${north},${east}););out center qt 100;`);
      const bases = (data.elements ?? []).map((e: any) => {
        const c = coords(e);
        return { name: e.tags?.name ?? "Unnamed", type: e.tags?.military ?? "naval_base", lat: c?.lat, lng: c?.lng };
      });
      return json({ bases, count: bases.length });
    },
  },
  {
    name: "mil_nuclear",
    description: "Find nuclear facilities — power plants, research reactors, enrichment sites in a bounding box.",
    schema: bbox,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(node["generator:source"="nuclear"](${south},${west},${north},${east});way["generator:source"="nuclear"](${south},${west},${north},${east});way["power"="plant"]["plant:source"="nuclear"](${south},${west},${north},${east}););out center qt 100;`);
      const facilities = (data.elements ?? []).map((e: any) => {
        const c = coords(e);
        return { name: e.tags?.name ?? "Unnamed", type: "nuclear_facility", operator: e.tags?.operator, lat: c?.lat, lng: c?.lng };
      });
      return json({ facilities, count: facilities.length });
    },
  },
  {
    name: "mil_missile",
    description: "Find known missile test sites, launch pads, and military testing ranges in a bounding box.",
    schema: bbox,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(node["military"~"range|launch_site|testing_ground"](${south},${west},${north},${east});way["military"~"range|launch_site|testing_ground"](${south},${west},${north},${east}););out center qt 100;`);
      const sites = (data.elements ?? []).map((e: any) => {
        const c = coords(e);
        return { name: e.tags?.name ?? "Unnamed", type: e.tags?.military, lat: c?.lat, lng: c?.lng };
      });
      return json({ sites, count: sites.length });
    },
  },
  {
    name: "mil_radar",
    description: "Find radar stations and air defense installations in a bounding box.",
    schema: bbox,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const data = await overpassQuery(`[out:json][timeout:25];(node["military"="radar"](${south},${west},${north},${east});way["military"="radar"](${south},${west},${north},${east});node["man_made"="monitoring_station"](${south},${west},${north},${east}););out center qt 100;`);
      const stations = (data.elements ?? []).map((e: any) => {
        const c = coords(e);
        return { name: e.tags?.name ?? "Unnamed", type: e.tags?.military ?? "monitoring_station", lat: c?.lat, lng: c?.lng };
      });
      return json({ stations, count: stations.length });
    },
  },
  {
    name: "mil_activity",
    description: "Composite military activity score for a bounding box — combines facility count, restricted airspace, and overall assessment.",
    schema: bbox,
    async execute(args) {
      const { south, west, north, east } = args as any;
      const [milData, airData] = await Promise.all([
        overpassQuery(`[out:json][timeout:25];(node["military"](${south},${west},${north},${east});way["military"](${south},${west},${north},${east}););out count;`),
        overpassQuery(`[out:json][timeout:25];(way["airspace:type"~"restricted|danger|prohibited|military"](${south},${west},${north},${east}););out count;`),
      ]);
      const facilities = milData.elements?.[0]?.tags?.total ?? 0;
      const airspaces = airData.elements?.[0]?.tags?.total ?? 0;
      const score = Number(facilities) + Number(airspaces) * 2;
      const assessment = score <= 2 ? "Low" : score <= 5 ? "Moderate" : score <= 10 ? "High" : "Very High";
      return json({ bbox: { south, west, north, east }, militaryFacilities: Number(facilities), restrictedAirspaces: Number(airspaces), activityScore: score, assessment });
    },
  },
];
