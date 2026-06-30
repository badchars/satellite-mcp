// Conflict & Events — ACLED + GDELT APIs
// Tools: conflict_events, conflict_fatalities, conflict_actors, conflict_hotspots, events_global, events_media

import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(1000);
const cache = new TTLCache<unknown>(60 * 60 * 1000);

async function acledFetch<T>(params: string, ctx: ToolContext): Promise<T> {
  await limiter.acquire();
  let url = `https://api.acleddata.com/acled/read?${params}`;
  if (ctx.config.acledApiKey && ctx.config.acledEmail) {
    url += `&key=${ctx.config.acledApiKey}&email=${ctx.config.acledEmail}`;
  }
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`ACLED API error: ${resp.status}. Register free at acleddata.com and set ACLED_API_KEY + ACLED_EMAIL.`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

async function gdeltFetch<T>(params: string): Promise<T> {
  await limiter.acquire();
  const url = `https://api.gdeltproject.org/api/v2/doc/doc?${params}&format=json`;
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`GDELT API error: ${resp.status}`);
  const text = await resp.text();
  try { const data = JSON.parse(text); cache.set(url, data); return data as T; }
  catch { return { raw: text } as any; }
}

export const conflictTools: ToolDef[] = [
  {
    name: "conflict_events",
    description: "Get armed conflict events from ACLED — battles, violence against civilians, explosions, riots, protests.",
    schema: {
      country: z.string().optional().describe("Country name (e.g. 'Syria')"),
      event_type: z.string().optional().describe("Event type: Battles, Violence against civilians, Explosions/Remote violence, Riots, Protests, Strategic developments"),
      start_date: z.string().optional().describe("Start date YYYY-MM-DD"),
      end_date: z.string().optional().describe("End date YYYY-MM-DD"),
      limit: z.number().int().min(1).max(500).default(25).describe("Maximum results"),
    },
    async execute(args, ctx) {
      const a = args as any;
      const params: string[] = [`limit=${a.limit}`];
      if (a.country) params.push(`country=${encodeURIComponent(a.country)}`);
      if (a.event_type) params.push(`event_type=${encodeURIComponent(a.event_type)}`);
      if (a.start_date && a.end_date) params.push(`event_date=${a.start_date}|${a.end_date}&event_date_where=BETWEEN`);
      const data: any = await acledFetch(params.join("&"), ctx);
      const events = (data.data ?? []).map((e: any) => ({
        event_date: e.event_date, event_type: e.event_type, sub_event_type: e.sub_event_type,
        actor1: e.actor1, actor2: e.actor2, country: e.country, admin1: e.admin1,
        location: e.location, lat: Number(e.latitude), lng: Number(e.longitude),
        fatalities: Number(e.fatalities), notes: e.notes,
      }));
      return json({ events, count: events.length });
    },
  },
  {
    name: "conflict_fatalities",
    description: "Conflict fatality statistics by country — total fatalities, breakdown by event type, deadliest events.",
    schema: {
      country: z.string().describe("Country name"),
      year: z.number().int().optional().describe("Year to filter (e.g. 2024)"),
      limit: z.number().int().min(1).max(500).default(100).describe("Maximum events to analyze"),
    },
    async execute(args, ctx) {
      const { country, year, limit } = args as any;
      let params = `country=${encodeURIComponent(country)}&limit=${limit}`;
      if (year) params += `&year=${year}`;
      const data: any = await acledFetch(params, ctx);
      const events = data.data ?? [];
      let total = 0;
      const byType: Record<string, number> = {};
      let deadliest: any = null;
      for (const e of events) {
        const f = Number(e.fatalities) || 0;
        total += f;
        byType[e.event_type] = (byType[e.event_type] ?? 0) + f;
        if (!deadliest || f > (Number(deadliest.fatalities) || 0)) deadliest = e;
      }
      return json({ country, year, totalFatalities: total, byEventType: byType, deadliestEvent: deadliest ? { date: deadliest.event_date, type: deadliest.event_type, location: deadliest.location, fatalities: Number(deadliest.fatalities) } : null, eventsAnalyzed: events.length });
    },
  },
  {
    name: "conflict_actors",
    description: "List armed groups and actors active in a country with event counts.",
    schema: {
      country: z.string().describe("Country name"),
      limit: z.number().int().min(1).max(500).default(50).describe("Maximum events to analyze"),
    },
    async execute(args, ctx) {
      const { country, limit } = args as any;
      const data: any = await acledFetch(`country=${encodeURIComponent(country)}&limit=${limit}`, ctx);
      const actorMap = new Map<string, { count: number; latestDate: string; regions: Set<string> }>();
      for (const e of data.data ?? []) {
        for (const actor of [e.actor1, e.actor2].filter(Boolean)) {
          const entry = actorMap.get(actor) ?? { count: 0, latestDate: "", regions: new Set() };
          entry.count++;
          if (e.event_date > entry.latestDate) entry.latestDate = e.event_date;
          if (e.admin1) entry.regions.add(e.admin1);
          actorMap.set(actor, entry);
        }
      }
      const actors = [...actorMap.entries()].sort((a, b) => b[1].count - a[1].count).map(([name, v]) => ({
        name, eventCount: v.count, latestEvent: v.latestDate, regions: [...v.regions],
      }));
      return json({ country, actors, count: actors.length });
    },
  },
  {
    name: "conflict_hotspots",
    description: "Conflict intensity grid map — divides bounding box into cells and counts events per cell.",
    schema: {
      south: z.number().min(-90).max(90).describe("South latitude"),
      west: z.number().min(-180).max(180).describe("West longitude"),
      north: z.number().min(-90).max(90).describe("North latitude"),
      east: z.number().min(-180).max(180).describe("East longitude"),
      days: z.number().int().min(1).max(365).default(90).describe("Days to look back"),
    },
    async execute(args, ctx) {
      const { south, west, north, east, days } = args as any;
      const start = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];
      const end = new Date().toISOString().split("T")[0];
      const data: any = await acledFetch(`limit=500&event_date=${start}|${end}&event_date_where=BETWEEN`, ctx);
      const events = (data.data ?? []).filter((e: any) => {
        const lat = Number(e.latitude), lng = Number(e.longitude);
        return lat >= south && lat <= north && lng >= west && lng <= east;
      });
      const cellSize = 0.5;
      const grid = new Map<string, { lat: number; lng: number; count: number; fatalities: number; types: Record<string, number> }>();
      for (const e of events) {
        const lat = Math.floor(Number(e.latitude) / cellSize) * cellSize + cellSize / 2;
        const lng = Math.floor(Number(e.longitude) / cellSize) * cellSize + cellSize / 2;
        const key = `${lat},${lng}`;
        const cell = grid.get(key) ?? { lat, lng, count: 0, fatalities: 0, types: {} };
        cell.count++;
        cell.fatalities += Number(e.fatalities) || 0;
        cell.types[e.event_type] = (cell.types[e.event_type] ?? 0) + 1;
        grid.set(key, cell);
      }
      const hotspots = [...grid.values()].sort((a, b) => b.count - a.count).map(c => ({
        lat: c.lat, lng: c.lng, eventCount: c.count, fatalities: c.fatalities,
        topEventType: Object.entries(c.types).sort((a, b) => b[1] - a[1])[0]?.[0],
      }));
      return json({ hotspots, totalEvents: events.length, bbox: { south, west, north, east } });
    },
  },
  {
    name: "events_global",
    description: "Global event monitoring via GDELT — search news articles about specific topics, locations, or events.",
    schema: {
      query: z.string().describe("Search query (e.g. 'earthquake Turkey', 'missile launch')"),
      mode: z.enum(["ArtList", "TimelineVol", "ToneChart"]).default("ArtList").describe("GDELT query mode"),
      limit: z.number().int().min(1).max(250).default(20).describe("Maximum results"),
    },
    async execute(args) {
      const { query, mode, limit } = args as any;
      const data: any = await gdeltFetch(`query=${encodeURIComponent(query)}&mode=${mode}&maxrecords=${limit}`);
      if (mode === "ArtList") {
        const articles = (data.articles ?? []).map((a: any) => ({
          title: a.title, url: a.url, source: a.domain, publishDate: a.seendate, language: a.language, tone: a.tone,
        }));
        return json({ query, articles, count: articles.length });
      }
      return json({ query, mode, data });
    },
  },
  {
    name: "events_media",
    description: "Media intensity analysis via GDELT — track news volume over time for a topic or region.",
    schema: {
      query: z.string().describe("Search query"),
      start_date: z.string().optional().describe("Start date YYYYMMDDHHMMSS"),
      end_date: z.string().optional().describe("End date YYYYMMDDHHMMSS"),
    },
    async execute(args) {
      const { query, start_date, end_date } = args as any;
      let params = `query=${encodeURIComponent(query)}&mode=TimelineVol`;
      if (start_date) params += `&STARTDATETIME=${start_date}`;
      if (end_date) params += `&ENDDATETIME=${end_date}`;
      const data: any = await gdeltFetch(params);
      const timeline = (data.timeline ?? []).flatMap((t: any) => (t.data ?? []).map((d: any) => ({ date: d.date, volume: d.value })));
      const volumes = timeline.map((t: any) => t.volume);
      return json({
        query, timeline,
        peakDate: timeline.length > 0 ? timeline.reduce((max: any, t: any) => t.volume > (max?.volume ?? 0) ? t : max, timeline[0])?.date : null,
        avgVolume: volumes.length > 0 ? Math.round(volumes.reduce((s: number, v: number) => s + v, 0) / volumes.length) : 0,
      });
    },
  },
];
