// Maritime Intelligence — Global Fishing Watch API
// Tools: ship_search, ship_position, ship_track, ship_area, ship_fishing, ship_port_visits, ship_encounters, ship_dark

import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json, text } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";
import { requireApiKey } from "../utils/require-key.js";

const limiter = new RateLimiter(1000);
const cache = new TTLCache<unknown>(10 * 60 * 1000);
const GFW = "https://gateway.api.globalfishingwatch.org/v3";

async function gfwFetch<T>(path: string, ctx: ToolContext): Promise<T> {
  const key = requireApiKey(ctx.config.gfwApiKey, "Global Fishing Watch", "GFW_API_KEY");
  await limiter.acquire();
  const url = `${GFW}${path}`;
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url, { headers: { Authorization: `Bearer ${key}` } });
  if (!resp.ok) throw new Error(`GFW API error: ${resp.status} ${resp.statusText}`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

export const maritimeTools: ToolDef[] = [
  {
    name: "ship_search",
    description: "Search for vessels by name, MMSI, or IMO number using Global Fishing Watch.",
    schema: { query: z.string().describe("Vessel name, MMSI number, or IMO number") },
    async execute(args, ctx) {
      const { query } = args as { query: string };
      const data: any = await gfwFetch(`/vessels/search?query=${encodeURIComponent(query)}&limit=10&datasets[0]=public-global-vessel-identity:latest`, ctx);
      const vessels = (data.entries ?? []).map((v: any) => ({
        id: v.id, name: v.name ?? v.shipname, mmsi: v.mmsi, imo: v.imo,
        flag: v.flag, type: v.vesselType ?? v.shiptypes?.[0]?.name, length: v.length,
      }));
      return json({ vessels, count: vessels.length, query });
    },
  },
  {
    name: "ship_position",
    description: "Get last known position for a vessel by GFW vessel ID.",
    schema: { vessel_id: z.string().describe("GFW vessel ID or MMSI") },
    async execute(args, ctx) {
      const { vessel_id } = args as { vessel_id: string };
      const data: any = await gfwFetch(`/vessels/${vessel_id}?datasets[0]=public-global-vessel-identity:latest`, ctx);
      return json({
        vessel_id, name: data.name ?? data.shipname, mmsi: data.mmsi, imo: data.imo,
        flag: data.flag, type: data.vesselType, lastPosition: data.lastPosition,
      });
    },
  },
  {
    name: "ship_track",
    description: "Get vessel movement history (GPS track) over a date range.",
    schema: {
      vessel_id: z.string().describe("GFW vessel ID"),
      start_date: z.string().describe("Start date YYYY-MM-DD"),
      end_date: z.string().describe("End date YYYY-MM-DD"),
    },
    async execute(args, ctx) {
      const { vessel_id, start_date, end_date } = args as any;
      const data: any = await gfwFetch(`/vessels/${vessel_id}/tracks?start-date=${start_date}&end-date=${end_date}&datasets[0]=public-global-vessel-track:latest`, ctx);
      return json({ vessel_id, track: data, start_date, end_date });
    },
  },
  {
    name: "ship_area",
    description: "Get all vessels in a bounding box area using AIS data.",
    schema: {
      south: z.number().min(-90).max(90).describe("South latitude"),
      west: z.number().min(-180).max(180).describe("West longitude"),
      north: z.number().min(-90).max(90).describe("North latitude"),
      east: z.number().min(-180).max(180).describe("East longitude"),
    },
    async execute(args, ctx) {
      const { south, west, north, east } = args as any;
      try {
        const data: any = await gfwFetch(`/vessels?where=latitude>${south} AND latitude<${north} AND longitude>${west} AND longitude<${east}&limit=100&datasets[0]=public-global-vessel-identity:latest`, ctx);
        const vessels = (data.entries ?? []).map((v: any) => ({
          name: v.name ?? v.shipname, mmsi: v.mmsi, flag: v.flag, type: v.vesselType,
        }));
        return json({ vessels, count: vessels.length, bbox: { south, west, north, east } });
      } catch {
        return text("GFW area search requires authenticated access. Set GFW_API_KEY environment variable.");
      }
    },
  },
  {
    name: "ship_fishing",
    description: "Analyze fishing activity in an area over a date range — fishing hours, vessel count, top flag states.",
    schema: {
      south: z.number().min(-90).max(90).describe("South latitude"),
      west: z.number().min(-180).max(180).describe("West longitude"),
      north: z.number().min(-90).max(90).describe("North latitude"),
      east: z.number().min(-180).max(180).describe("East longitude"),
      start_date: z.string().describe("Start date YYYY-MM-DD"),
      end_date: z.string().describe("End date YYYY-MM-DD"),
    },
    async execute(args, ctx) {
      const { south, west, north, east, start_date, end_date } = args as any;
      const data: any = await gfwFetch(`/4wings/report?spatial-resolution=low&temporal-resolution=monthly&group-by=flag&start-date=${start_date}&end-date=${end_date}&datasets[0]=public-global-fishing-effort:latest&geometry={"type":"Polygon","coordinates":[[[${west},${south}],[${east},${south}],[${east},${north}],[${west},${north}],[${west},${south}]]]}`, ctx);
      return json({ fishingData: data, bbox: { south, west, north, east }, start_date, end_date });
    },
  },
  {
    name: "ship_port_visits",
    description: "Get port visit history for a vessel.",
    schema: { vessel_id: z.string().describe("GFW vessel ID") },
    async execute(args, ctx) {
      const { vessel_id } = args as { vessel_id: string };
      const data: any = await gfwFetch(`/vessels/${vessel_id}/events?datasets[0]=public-global-port-visits-events:latest&limit=50`, ctx);
      const ports = (data.entries ?? []).map((e: any) => ({
        port: e.port?.name, country: e.port?.flag, start: e.start, end: e.end,
        duration_hours: e.start && e.end ? Math.round((new Date(e.end).getTime() - new Date(e.start).getTime()) / 3600000) : null,
      }));
      return json({ vessel_id, ports, count: ports.length });
    },
  },
  {
    name: "ship_encounters",
    description: "Detect ship-to-ship encounters and transfers for a vessel — potential at-sea transshipment.",
    schema: {
      vessel_id: z.string().describe("GFW vessel ID"),
      start_date: z.string().optional().describe("Start date YYYY-MM-DD"),
      end_date: z.string().optional().describe("End date YYYY-MM-DD"),
    },
    async execute(args, ctx) {
      const { vessel_id, start_date, end_date } = args as any;
      let path = `/vessels/${vessel_id}/events?datasets[0]=public-global-encounters-events:latest&limit=50`;
      if (start_date) path += `&start-date=${start_date}`;
      if (end_date) path += `&end-date=${end_date}`;
      const data: any = await gfwFetch(path, ctx);
      const encounters = (data.entries ?? []).map((e: any) => ({
        otherVessel: e.encounter?.vessel?.name, lat: e.position?.lat, lng: e.position?.lon,
        start: e.start, end: e.end, type: e.type,
      }));
      return json({ vessel_id, encounters, count: encounters.length });
    },
  },
  {
    name: "ship_dark",
    description: "Detect AIS gap events (dark periods) for a vessel — potential sanctions evasion or illegal activity.",
    schema: {
      vessel_id: z.string().describe("GFW vessel ID"),
      start_date: z.string().describe("Start date YYYY-MM-DD"),
      end_date: z.string().describe("End date YYYY-MM-DD"),
      min_gap_hours: z.number().min(1).default(12).describe("Minimum gap duration in hours to report"),
    },
    async execute(args, ctx) {
      const { vessel_id, start_date, end_date, min_gap_hours } = args as any;
      const data: any = await gfwFetch(`/vessels/${vessel_id}/events?datasets[0]=public-global-gaps-events:latest&start-date=${start_date}&end-date=${end_date}&limit=100`, ctx);
      const gaps = (data.entries ?? []).filter((e: any) => {
        if (!e.start || !e.end) return false;
        const hours = (new Date(e.end).getTime() - new Date(e.start).getTime()) / 3600000;
        return hours >= min_gap_hours;
      }).map((e: any) => ({
        start: e.start, end: e.end,
        duration_hours: Math.round((new Date(e.end).getTime() - new Date(e.start).getTime()) / 3600000),
        lastKnownPosition: e.position,
      }));
      const totalGapHours = gaps.reduce((s: number, g: any) => s + g.duration_hours, 0);
      return json({
        vessel_id, gaps, totalGapHours, count: gaps.length,
        assessment: gaps.length === 0 ? "No significant AIS gaps detected" : `${gaps.length} gap(s) totaling ${totalGapHours} hours — potential dark activity`,
      });
    },
  },
];
