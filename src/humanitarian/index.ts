// Humanitarian & Refugee — ReliefWeb + UNHCR APIs (free, no auth)
// Tools: humanitarian_crises, humanitarian_reports, humanitarian_camps, humanitarian_funding, humanitarian_displacement

import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(1000);
const cache = new TTLCache<unknown>(30 * 60 * 1000);

async function rwFetch<T>(endpoint: string, params: string): Promise<T> {
  await limiter.acquire();
  const url = `https://api.reliefweb.int/v1/${endpoint}?${params}&appname=satellite-mcp`;
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`ReliefWeb API error: ${resp.status}`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

export const humanitarianTools: ToolDef[] = [
  {
    name: "humanitarian_crises",
    description: "List active humanitarian crises worldwide from ReliefWeb.",
    schema: { limit: z.number().int().min(1).max(100).default(20).describe("Maximum results") },
    async execute(args) {
      const { limit } = args as { limit: number };
      const data: any = await rwFetch("disasters", `filter[field]=status&filter[value]=current&limit=${limit}&fields[include][]=name&fields[include][]=country&fields[include][]=type&fields[include][]=date&fields[include][]=glide`);
      const crises = (data.data ?? []).map((d: any) => ({
        id: d.id, name: d.fields?.name, country: d.fields?.country?.map((c: any) => c.name),
        type: d.fields?.type?.map((t: any) => t.name), date: d.fields?.date?.created, glide: d.fields?.glide,
      }));
      return json({ crises, count: crises.length, source: "ReliefWeb" });
    },
  },
  {
    name: "humanitarian_reports",
    description: "Get latest humanitarian situation reports and updates from ReliefWeb.",
    schema: {
      country: z.string().optional().describe("Country name to filter"),
      query: z.string().optional().describe("Search query"),
      limit: z.number().int().min(1).max(50).default(10).describe("Maximum results"),
    },
    async execute(args) {
      const { country, query, limit } = args as any;
      let params = `limit=${limit}&fields[include][]=title&fields[include][]=country&fields[include][]=source&fields[include][]=date&fields[include][]=url`;
      if (query) params += `&query[value]=${encodeURIComponent(query)}`;
      if (country) params += `&filter[field]=country.name&filter[value]=${encodeURIComponent(country)}`;
      const data: any = await rwFetch("reports", params);
      const reports = (data.data ?? []).map((r: any) => ({
        id: r.id, title: r.fields?.title, country: r.fields?.country?.map((c: any) => c.name),
        source: r.fields?.source?.map((s: any) => s.name), date: r.fields?.date?.created, url: r.fields?.url,
      }));
      return json({ reports, count: reports.length, source: "ReliefWeb" });
    },
  },
  {
    name: "humanitarian_camps",
    description: "Get refugee camp locations and population data from UNHCR.",
    schema: { country: z.string().describe("Country name or ISO code") },
    async execute(args) {
      const { country } = args as { country: string };
      try {
        const data: any = await cache.get(`unhcr_${country}`) ??
          await (async () => { await limiter.acquire(); const r = await fetch(`https://data.unhcr.org/api/population/?country_of_asylum=${encodeURIComponent(country)}&limit=20`); return r.json(); })();
        cache.set(`unhcr_${country}`, data);
        return json({ country, data: data.data ?? data, source: "UNHCR" });
      } catch {
        return json({ country, note: "UNHCR data API may require specific query parameters. Visit data.unhcr.org for camp locations and population data.", source: "UNHCR" });
      }
    },
  },
  {
    name: "humanitarian_funding",
    description: "Humanitarian funding status — how much was requested vs received for crises.",
    schema: { year: z.number().int().optional().describe("Year (default: current year)") },
    async execute(args) {
      const year = (args as any).year ?? new Date().getFullYear();
      try {
        const data: any = await rwFetch("reports", `filter[field]=source.shortname&filter[value]=OCHA&filter[field]=date.created&filter[value]=${year}&limit=10&fields[include][]=title&fields[include][]=url&fields[include][]=date`);
        return json({ year, reports: (data.data ?? []).map((r: any) => ({ title: r.fields?.title, url: r.fields?.url, date: r.fields?.date?.created })), source: "ReliefWeb/OCHA", note: "For detailed funding data, visit fts.unocha.org (Financial Tracking Service)." });
      } catch {
        return json({ year, source: "OCHA FTS", url: "https://fts.unocha.org/", note: "Visit the Financial Tracking Service for humanitarian funding data." });
      }
    },
  },
  {
    name: "humanitarian_displacement",
    description: "Global displacement statistics — refugees, IDPs, asylum seekers from UNHCR.",
    schema: { year: z.number().int().optional().describe("Year for statistics") },
    async execute(args) {
      const year = (args as any).year ?? new Date().getFullYear() - 1;
      try {
        const data: any = await (async () => { await limiter.acquire(); const r = await fetch(`https://data.unhcr.org/api/population/?year=${year}&limit=50`); return r.json(); })();
        return json({ year, data: data.data ?? data, source: "UNHCR" });
      } catch {
        return json({ year, source: "UNHCR", url: "https://www.unhcr.org/refugee-statistics/", note: "Visit UNHCR refugee statistics for global displacement data." });
      }
    },
  },
];
