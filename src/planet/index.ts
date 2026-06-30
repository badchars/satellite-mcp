// Planet Labs — Planet Data API
// Tools: planet_search, planet_metadata, planet_thumbnail, planet_stats

import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json } from "../types/index.js";
import { requireApiKey } from "../utils/require-key.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(500);
const cache = new TTLCache<unknown>(10 * 60 * 1000);
const API = "https://api.planet.com/data/v1";

async function planetFetch<T>(path: string, ctx: ToolContext, method = "GET", body?: unknown): Promise<T> {
  requireApiKey(ctx.config.planetApiKey, "PLANET_API_KEY", "Planet Labs");
  await limiter.acquire();
  const url = `${API}${path}`;
  const cacheKey = `${method}:${url}:${body ? JSON.stringify(body) : ""}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached as T;
  const headers: Record<string, string> = {
    Authorization: `Basic ${Buffer.from(ctx.config.planetApiKey + ":").toString("base64")}`,
    "Content-Type": "application/json",
  };
  const resp = await fetch(url, {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  if (!resp.ok) throw new Error(`Planet API error: ${resp.status}`);
  const data = await resp.json();
  cache.set(cacheKey, data);
  return data as T;
}

export const planetTools: ToolDef[] = [
  {
    name: "planet_search",
    description: "Search Planet Labs satellite imagery catalog — daily 3m resolution global coverage. Requires PLANET_API_KEY.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Center latitude"),
      lng: z.number().min(-180).max(180).describe("Center longitude"),
      start_date: z.string().describe("Start date YYYY-MM-DD"),
      end_date: z.string().describe("End date YYYY-MM-DD"),
      max_cloud: z.number().min(0).max(100).default(20).describe("Maximum cloud cover percentage"),
      item_type: z.enum(["PSScene", "SkySatCollect", "SkySatScene"]).default("PSScene").describe("Item type"),
      limit: z.number().int().min(1).max(50).default(10).describe("Maximum results"),
    },
    async execute(args, ctx) {
      const { lat, lng, start_date, end_date, max_cloud, item_type, limit } = args as any;
      const radius = 0.1;
      const filter = {
        type: "AndFilter",
        config: [
          {
            type: "GeometryFilter",
            field_name: "geometry",
            config: {
              type: "Polygon",
              coordinates: [[
                [lng - radius, lat - radius], [lng + radius, lat - radius],
                [lng + radius, lat + radius], [lng - radius, lat + radius],
                [lng - radius, lat - radius],
              ]],
            },
          },
          {
            type: "DateRangeFilter",
            field_name: "acquired",
            config: { gte: `${start_date}T00:00:00Z`, lte: `${end_date}T23:59:59Z` },
          },
          {
            type: "RangeFilter",
            field_name: "cloud_cover",
            config: { lte: max_cloud / 100 },
          },
        ],
      };
      const data: any = await planetFetch("/quick-search", ctx, "POST", {
        item_types: [item_type],
        filter,
        limit,
      });
      const items = (data.features ?? []).map((f: any) => ({
        id: f.id,
        acquired: f.properties?.acquired,
        cloudCover: f.properties?.cloud_cover ? Math.round(f.properties.cloud_cover * 100) : null,
        pixelResolution: f.properties?.pixel_resolution,
        sunElevation: f.properties?.sun_elevation,
        itemType: f.properties?.item_type,
      }));
      return json({ items, count: items.length, query: { lat, lng, start_date, end_date, max_cloud, item_type }, source: "Planet Labs" });
    },
  },
  {
    name: "planet_metadata",
    description: "Get detailed metadata for a Planet Labs item. Requires PLANET_API_KEY.",
    schema: {
      item_id: z.string().describe("Planet item ID"),
      item_type: z.enum(["PSScene", "SkySatCollect", "SkySatScene"]).default("PSScene").describe("Item type"),
    },
    async execute(args, ctx) {
      const { item_id, item_type } = args as any;
      const data: any = await planetFetch(`/item-types/${item_type}/items/${item_id}`, ctx);
      return json({
        id: data.id,
        properties: data.properties,
        geometry: data.geometry,
        assets: data._links?.assets ? "Available — use Planet API to list downloadable assets" : null,
        source: "Planet Labs",
      });
    },
  },
  {
    name: "planet_thumbnail",
    description: "Get thumbnail preview URL for a Planet Labs item. Requires PLANET_API_KEY.",
    schema: {
      item_id: z.string().describe("Planet item ID"),
      item_type: z.enum(["PSScene", "SkySatCollect", "SkySatScene"]).default("PSScene").describe("Item type"),
    },
    async execute(args, ctx) {
      requireApiKey(ctx.config.planetApiKey, "PLANET_API_KEY", "Planet Labs");
      const { item_id, item_type } = args as any;
      return json({
        itemId: item_id, itemType: item_type,
        thumbnailUrl: `${API}/item-types/${item_type}/items/${item_id}/thumb`,
        note: "Thumbnail URL requires Planet API key for access (Basic auth).",
        source: "Planet Labs",
      });
    },
  },
  {
    name: "planet_stats",
    description: "Get Planet imagery coverage statistics for an area. Requires PLANET_API_KEY.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Center latitude"),
      lng: z.number().min(-180).max(180).describe("Center longitude"),
      start_date: z.string().describe("Start date YYYY-MM-DD"),
      end_date: z.string().describe("End date YYYY-MM-DD"),
      interval: z.enum(["year", "month", "week", "day"]).default("month").describe("Time interval for buckets"),
    },
    async execute(args, ctx) {
      const { lat, lng, start_date, end_date, interval } = args as any;
      const radius = 0.1;
      const filter = {
        type: "AndFilter",
        config: [
          {
            type: "GeometryFilter",
            field_name: "geometry",
            config: {
              type: "Polygon",
              coordinates: [[
                [lng - radius, lat - radius], [lng + radius, lat - radius],
                [lng + radius, lat + radius], [lng - radius, lat + radius],
                [lng - radius, lat - radius],
              ]],
            },
          },
          {
            type: "DateRangeFilter",
            field_name: "acquired",
            config: { gte: `${start_date}T00:00:00Z`, lte: `${end_date}T23:59:59Z` },
          },
        ],
      };
      const data: any = await planetFetch("/stats", ctx, "POST", {
        item_types: ["PSScene"],
        filter,
        interval,
      });
      return json({
        buckets: data.buckets ?? [],
        totalCount: (data.buckets ?? []).reduce((s: number, b: any) => s + (b.count ?? 0), 0),
        query: { lat, lng, start_date, end_date, interval },
        source: "Planet Labs",
      });
    },
  },
];
