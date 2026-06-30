// Landsat (USGS) — USGS M2M API
// Tools: landsat_search, landsat_metadata, landsat_browse, landsat_bands, landsat_latest, landsat_timeline, landsat_download_url

import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(1500);
const cache = new TTLCache<unknown>(15 * 60 * 1000);
const M2M = "https://m2m.cr.usgs.gov/api/api/json/stable";

let sessionToken: string | null = null;

async function usgsLogin(ctx: ToolContext): Promise<string | null> {
  if (sessionToken) return sessionToken;
  const { usgsUsername, usgsPassword } = ctx.config;
  if (!usgsUsername || !usgsPassword) return null;
  await limiter.acquire();
  const resp = await fetch(`${M2M}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: usgsUsername, password: usgsPassword }),
  });
  if (!resp.ok) return null;
  const data: any = await resp.json();
  sessionToken = data.data ?? null;
  return sessionToken;
}

async function usgsFetch<T>(endpoint: string, body: Record<string, unknown>, ctx: ToolContext): Promise<T> {
  await limiter.acquire();
  const key = `${endpoint}:${JSON.stringify(body)}`;
  const cached = cache.get(key);
  if (cached) return cached as T;
  const token = await usgsLogin(ctx);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["X-Auth-Token"] = token;
  const resp = await fetch(`${M2M}/${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!resp.ok) throw new Error(`USGS M2M API error: ${resp.status}. Set USGS_USERNAME and USGS_PASSWORD for authenticated access.`);
  const data: any = await resp.json();
  if (data.errorCode) throw new Error(`USGS: ${data.errorMessage ?? data.errorCode}`);
  cache.set(key, data.data);
  return data.data as T;
}

const LANDSAT_BANDS = [
  { band: "B1", name: "Coastal Aerosol", wavelength_nm: "435-451", resolution_m: 30, sensor: "OLI" },
  { band: "B2", name: "Blue", wavelength_nm: "452-512", resolution_m: 30, sensor: "OLI" },
  { band: "B3", name: "Green", wavelength_nm: "533-590", resolution_m: 30, sensor: "OLI" },
  { band: "B4", name: "Red", wavelength_nm: "636-673", resolution_m: 30, sensor: "OLI" },
  { band: "B5", name: "NIR", wavelength_nm: "851-879", resolution_m: 30, sensor: "OLI" },
  { band: "B6", name: "SWIR 1", wavelength_nm: "1566-1651", resolution_m: 30, sensor: "OLI" },
  { band: "B7", name: "SWIR 2", wavelength_nm: "2107-2294", resolution_m: 30, sensor: "OLI" },
  { band: "B8", name: "Panchromatic", wavelength_nm: "503-676", resolution_m: 15, sensor: "OLI" },
  { band: "B9", name: "Cirrus", wavelength_nm: "1363-1384", resolution_m: 30, sensor: "OLI" },
  { band: "B10", name: "Thermal IR 1", wavelength_nm: "10600-11190", resolution_m: 100, sensor: "TIRS" },
  { band: "B11", name: "Thermal IR 2", wavelength_nm: "11500-12510", resolution_m: 100, sensor: "TIRS" },
];

export const landsatTools: ToolDef[] = [
  {
    name: "landsat_search",
    description: "Search Landsat 8/9 satellite scenes by location, date range, and cloud cover.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Center latitude"),
      lng: z.number().min(-180).max(180).describe("Center longitude"),
      start_date: z.string().describe("Start date YYYY-MM-DD"),
      end_date: z.string().describe("End date YYYY-MM-DD"),
      max_cloud: z.number().min(0).max(100).default(30).describe("Maximum cloud cover percentage"),
      limit: z.number().int().min(1).max(50).default(10).describe("Maximum results"),
    },
    async execute(args, ctx) {
      const { lat, lng, start_date, end_date, max_cloud, limit } = args as any;
      try {
        const data: any = await usgsFetch("scene-search", {
          datasetName: "landsat_ot_c2_l2",
          sceneFilter: {
            spatialFilter: {
              filterType: "mbr",
              lowerLeft: { latitude: lat - 0.5, longitude: lng - 0.5 },
              upperRight: { latitude: lat + 0.5, longitude: lng + 0.5 },
            },
            acquisitionFilter: { start: start_date, end: end_date },
            cloudCoverFilter: { min: 0, max: max_cloud },
          },
          maxResults: limit,
          sortDirection: "DESC",
        }, ctx);
        const scenes = (data?.results ?? []).map((s: any) => ({
          entityId: s.entityId, displayId: s.displayId,
          date: s.temporalCoverage?.startDate,
          cloudCover: s.cloudCover, browseUrl: s.browse?.[0]?.browsePath,
        }));
        return json({ scenes, count: scenes.length, query: { lat, lng, start_date, end_date, max_cloud }, source: "USGS EarthExplorer" });
      } catch {
        return json({
          note: "USGS M2M API requires authentication. Set USGS_USERNAME and USGS_PASSWORD environment variables.",
          alternativeSearch: `https://earthexplorer.usgs.gov/`,
          query: { lat, lng, start_date, end_date, max_cloud },
          source: "USGS EarthExplorer",
        });
      }
    },
  },
  {
    name: "landsat_metadata",
    description: "Get detailed metadata for a Landsat scene by entity ID.",
    schema: { entity_id: z.string().describe("Landsat entity ID (e.g. LC08_L2SP_...)") },
    async execute(args, ctx) {
      const { entity_id } = args as { entity_id: string };
      try {
        const data: any = await usgsFetch("scene-metadata", {
          datasetName: "landsat_ot_c2_l2",
          entityId: entity_id,
        }, ctx);
        return json({ entityId: entity_id, metadata: data, source: "USGS" });
      } catch {
        return json({
          entityId: entity_id,
          note: "USGS M2M API requires authentication for metadata queries.",
          url: `https://earthexplorer.usgs.gov/`,
          source: "USGS",
        });
      }
    },
  },
  {
    name: "landsat_browse",
    description: "Get browse/thumbnail URL for a Landsat scene.",
    schema: { entity_id: z.string().describe("Landsat entity ID") },
    async execute(args) {
      const { entity_id } = args as { entity_id: string };
      const parts = entity_id.match(/^L[COTE]\d{2}_\w+_(\d{3})(\d{3})_(\d{4})(\d{2})(\d{2})/);
      if (parts) {
        const [, path, row, year, month, day] = parts;
        return json({
          entityId: entity_id,
          browseUrl: `https://landsatlook.usgs.gov/gen-browse?size=rrb&type=refl&product_id=${entity_id}`,
          earthExplorerUrl: `https://earthexplorer.usgs.gov/`,
          path: parseInt(path), row: parseInt(row),
          date: `${year}-${month}-${day}`,
          source: "USGS LandsatLook",
        });
      }
      return json({
        entityId: entity_id,
        browseUrl: `https://landsatlook.usgs.gov/gen-browse?size=rrb&type=refl&product_id=${entity_id}`,
        source: "USGS LandsatLook",
      });
    },
  },
  {
    name: "landsat_bands",
    description: "Reference table of Landsat 8/9 OLI/TIRS spectral bands with wavelengths and resolutions.",
    schema: {},
    async execute() {
      return json({ satellite: "Landsat 8/9 OLI/TIRS", bands: LANDSAT_BANDS, totalBands: LANDSAT_BANDS.length });
    },
  },
  {
    name: "landsat_latest",
    description: "Find the most recent Landsat scene for a location.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
      max_cloud: z.number().min(0).max(100).default(20).describe("Maximum cloud cover %"),
    },
    async execute(args, ctx) {
      const { lat, lng, max_cloud } = args as any;
      try {
        const data: any = await usgsFetch("scene-search", {
          datasetName: "landsat_ot_c2_l2",
          sceneFilter: {
            spatialFilter: {
              filterType: "mbr",
              lowerLeft: { latitude: lat - 0.5, longitude: lng - 0.5 },
              upperRight: { latitude: lat + 0.5, longitude: lng + 0.5 },
            },
            cloudCoverFilter: { min: 0, max: max_cloud },
          },
          maxResults: 1,
          sortDirection: "DESC",
        }, ctx);
        const s = data?.results?.[0];
        if (!s) return json({ error: "No recent cloud-free Landsat scene found", lat, lng, max_cloud });
        return json({ entityId: s.entityId, displayId: s.displayId, date: s.temporalCoverage?.startDate, cloudCover: s.cloudCover, lat, lng, source: "USGS" });
      } catch {
        return json({ lat, lng, note: "USGS M2M API requires authentication. Set USGS_USERNAME and USGS_PASSWORD.", source: "USGS" });
      }
    },
  },
  {
    name: "landsat_timeline",
    description: "Get Landsat scene availability for a location — historical coverage since 1972.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
      start_year: z.number().int().min(1972).default(2020).describe("Start year"),
      end_year: z.number().int().default(2024).describe("End year"),
    },
    async execute(args, ctx) {
      const { lat, lng, start_year, end_year } = args as any;
      try {
        const data: any = await usgsFetch("scene-search", {
          datasetName: "landsat_ot_c2_l2",
          sceneFilter: {
            spatialFilter: {
              filterType: "mbr",
              lowerLeft: { latitude: lat - 0.25, longitude: lng - 0.25 },
              upperRight: { latitude: lat + 0.25, longitude: lng + 0.25 },
            },
            acquisitionFilter: { start: `${start_year}-01-01`, end: `${end_year}-12-31` },
          },
          maxResults: 100,
          sortDirection: "DESC",
        }, ctx);
        const dates = (data?.results ?? []).map((s: any) => s.temporalCoverage?.startDate?.split("T")[0]).filter(Boolean);
        return json({ lat, lng, dates: [...new Set(dates)].sort(), count: new Set(dates).size, period: `${start_year}-${end_year}`, source: "USGS" });
      } catch {
        return json({
          lat, lng, period: `${start_year}-${end_year}`,
          note: "Landsat archive available since 1972 (Landsat 1). Landsat 8 since 2013, Landsat 9 since 2021. 16-day revisit, 30m resolution.",
          url: "https://earthexplorer.usgs.gov/",
          source: "USGS",
        });
      }
    },
  },
  {
    name: "landsat_download_url",
    description: "Get download URL for a Landsat scene. Requires USGS authentication.",
    schema: { entity_id: z.string().describe("Landsat entity ID") },
    async execute(args, ctx) {
      const { entity_id } = args as { entity_id: string };
      try {
        const data: any = await usgsFetch("download-options", {
          datasetName: "landsat_ot_c2_l2",
          entityIds: [entity_id],
        }, ctx);
        const options = (data ?? []).map((d: any) => ({
          productName: d.productName, filesize: d.filesize, url: d.url, available: d.available,
        }));
        return json({ entityId: entity_id, downloadOptions: options, source: "USGS" });
      } catch {
        return json({
          entityId: entity_id,
          note: "Download requires USGS EarthExplorer authentication. Set USGS_USERNAME and USGS_PASSWORD.",
          url: "https://earthexplorer.usgs.gov/",
          source: "USGS",
        });
      }
    },
  },
];
