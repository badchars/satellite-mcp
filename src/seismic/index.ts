// Seismic & Disaster — USGS Earthquake Hazards API (free, no auth)
// Tools: quake_recent, quake_search, quake_detail, quake_area, quake_stats

import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(500);
const cache = new TTLCache<unknown>(5 * 60 * 1000);

const API = "https://earthquake.usgs.gov/fdsnws/event/1/query";

async function quakeFetch<T>(params: Record<string, string | number>): Promise<T> {
  const qs = new URLSearchParams({ format: "geojson", ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])) });
  const url = `${API}?${qs}`;
  await limiter.acquire();
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`USGS API error: ${resp.status}`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

function parseFeature(f: any) {
  return {
    id: f.id,
    place: f.properties.place,
    magnitude: f.properties.mag,
    depth_km: f.geometry.coordinates[2],
    time: new Date(f.properties.time).toISOString(),
    lat: f.geometry.coordinates[1],
    lng: f.geometry.coordinates[0],
    tsunami: f.properties.tsunami === 1,
    felt: f.properties.felt,
    alert: f.properties.alert,
    significance: f.properties.sig,
    url: f.properties.url,
  };
}

export const seismicTools: ToolDef[] = [
  {
    name: "quake_recent",
    description: "Get recent earthquakes worldwide, filtered by minimum magnitude. Returns location, magnitude, depth, tsunami warning, and alert level.",
    schema: {
      min_magnitude: z.number().min(0).max(10).default(4.0).describe("Minimum magnitude filter"),
      limit: z.number().int().min(1).max(500).default(20).describe("Maximum results to return"),
    },
    async execute(args) {
      const { min_magnitude, limit } = args as { min_magnitude: number; limit: number };
      const data: any = await quakeFetch({ orderby: "time", limit, minmagnitude: min_magnitude });
      return json({
        earthquakes: data.features.map(parseFeature),
        count: data.features.length,
        query: { min_magnitude },
      });
    },
  },
  {
    name: "quake_search",
    description: "Search earthquakes by date range, magnitude, and geographic region.",
    schema: {
      start_date: z.string().describe("Start date YYYY-MM-DD"),
      end_date: z.string().describe("End date YYYY-MM-DD"),
      min_magnitude: z.number().min(0).default(1.0).describe("Minimum magnitude"),
      max_magnitude: z.number().max(10).optional().describe("Maximum magnitude"),
      south: z.number().min(-90).max(90).optional().describe("South latitude of bounding box"),
      west: z.number().min(-180).max(180).optional().describe("West longitude of bounding box"),
      north: z.number().min(-90).max(90).optional().describe("North latitude of bounding box"),
      east: z.number().min(-180).max(180).optional().describe("East longitude of bounding box"),
      limit: z.number().int().min(1).max(1000).default(50).describe("Maximum results"),
    },
    async execute(args) {
      const a = args as any;
      const params: Record<string, string | number> = {
        starttime: a.start_date,
        endtime: a.end_date,
        minmagnitude: a.min_magnitude,
        limit: a.limit,
        orderby: "time",
      };
      if (a.max_magnitude !== undefined) params.maxmagnitude = a.max_magnitude;
      if (a.south !== undefined) params.minlatitude = a.south;
      if (a.west !== undefined) params.minlongitude = a.west;
      if (a.north !== undefined) params.maxlatitude = a.north;
      if (a.east !== undefined) params.maxlongitude = a.east;
      const data: any = await quakeFetch(params);
      return json({ earthquakes: data.features.map(parseFeature), count: data.features.length });
    },
  },
  {
    name: "quake_detail",
    description: "Get detailed information about a specific earthquake by USGS event ID.",
    schema: {
      event_id: z.string().describe("USGS earthquake event ID (e.g. 'us7000abc1')"),
    },
    async execute(args) {
      const { event_id } = args as { event_id: string };
      const data: any = await quakeFetch({ eventid: event_id });
      const f = data.features?.[0] ?? data;
      const p = f.properties ?? data.properties;
      const g = f.geometry ?? data.geometry;
      return json({
        id: f.id ?? event_id,
        place: p.place,
        magnitude: p.mag,
        magnitudeType: p.magType,
        depth_km: g?.coordinates?.[2],
        lat: g?.coordinates?.[1],
        lng: g?.coordinates?.[0],
        time: new Date(p.time).toISOString(),
        tsunami: p.tsunami === 1,
        felt: p.felt,
        alert: p.alert,
        cdi: p.cdi,
        mmi: p.mmi,
        significance: p.sig,
        status: p.status,
        url: p.url,
      });
    },
  },
  {
    name: "quake_area",
    description: "Get earthquakes within a bounding box over a specified time period.",
    schema: {
      south: z.number().min(-90).max(90).describe("South latitude"),
      west: z.number().min(-180).max(180).describe("West longitude"),
      north: z.number().min(-90).max(90).describe("North latitude"),
      east: z.number().min(-180).max(180).describe("East longitude"),
      min_magnitude: z.number().min(0).default(2.0).describe("Minimum magnitude"),
      days: z.number().int().min(1).max(365).default(30).describe("Number of days to look back"),
    },
    async execute(args) {
      const a = args as any;
      const start = new Date(Date.now() - a.days * 86400000).toISOString().split("T")[0];
      const data: any = await quakeFetch({
        starttime: start,
        minlatitude: a.south,
        minlongitude: a.west,
        maxlatitude: a.north,
        maxlongitude: a.east,
        minmagnitude: a.min_magnitude,
        limit: 500,
        orderby: "time",
      });
      return json({
        earthquakes: data.features.map(parseFeature),
        count: data.features.length,
        bbox: { south: a.south, west: a.west, north: a.north, east: a.east },
        days: a.days,
      });
    },
  },
  {
    name: "quake_stats",
    description: "Earthquake statistics for a time period and optional region — magnitude distribution, deepest, strongest, averages.",
    schema: {
      days: z.number().int().min(1).max(365).default(30).describe("Number of days to analyze"),
      south: z.number().min(-90).max(90).optional().describe("South latitude of bounding box"),
      west: z.number().min(-180).max(180).optional().describe("West longitude"),
      north: z.number().min(-90).max(90).optional().describe("North latitude"),
      east: z.number().min(-180).max(180).optional().describe("East longitude"),
    },
    async execute(args) {
      const a = args as any;
      const start = new Date(Date.now() - a.days * 86400000).toISOString().split("T")[0];
      const params: Record<string, string | number> = { starttime: start, minmagnitude: 1, limit: 1000, orderby: "magnitude" };
      if (a.south !== undefined) params.minlatitude = a.south;
      if (a.west !== undefined) params.minlongitude = a.west;
      if (a.north !== undefined) params.maxlatitude = a.north;
      if (a.east !== undefined) params.maxlongitude = a.east;
      const data: any = await quakeFetch(params);
      const quakes = data.features.map(parseFeature);
      const dist = { "< 2": 0, "2-3": 0, "3-4": 0, "4-5": 0, "5-6": 0, "6-7": 0, "7+": 0 };
      let totalMag = 0, totalDepth = 0;
      let strongest = quakes[0], deepest = quakes[0];
      for (const q of quakes) {
        const m = q.magnitude;
        if (m < 2) dist["< 2"]++;
        else if (m < 3) dist["2-3"]++;
        else if (m < 4) dist["3-4"]++;
        else if (m < 5) dist["4-5"]++;
        else if (m < 6) dist["5-6"]++;
        else if (m < 7) dist["6-7"]++;
        else dist["7+"]++;
        totalMag += m;
        totalDepth += q.depth_km;
        if (q.magnitude > (strongest?.magnitude ?? 0)) strongest = q;
        if (q.depth_km > (deepest?.depth_km ?? 0)) deepest = q;
      }
      return json({
        totalEvents: quakes.length,
        magnitudeDistribution: dist,
        strongest,
        deepest,
        avgMagnitude: quakes.length > 0 ? Math.round((totalMag / quakes.length) * 100) / 100 : 0,
        avgDepth_km: quakes.length > 0 ? Math.round((totalDepth / quakes.length) * 100) / 100 : 0,
        days: a.days,
      });
    },
  },
];
