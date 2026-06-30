// Sentinel-2 (Copernicus) — Copernicus Data Space OData API
// Tools: sentinel_search, sentinel_metadata, sentinel_quicklook, sentinel_bands, sentinel_latest, sentinel_timeline, sentinel_coverage, sentinel_download_url

import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(1000);
const cache = new TTLCache<unknown>(15 * 60 * 1000);
const ODATA = "https://catalogue.dataspace.copernicus.eu/odata/v1";

async function cdsFetch<T>(path: string): Promise<T> {
  await limiter.acquire();
  const url = `${ODATA}${path}`;
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Copernicus API error: ${resp.status}`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

const SENTINEL2_BANDS = [
  { band: "B01", name: "Coastal aerosol", wavelength_nm: 443, resolution_m: 60 },
  { band: "B02", name: "Blue", wavelength_nm: 490, resolution_m: 10 },
  { band: "B03", name: "Green", wavelength_nm: 560, resolution_m: 10 },
  { band: "B04", name: "Red", wavelength_nm: 665, resolution_m: 10 },
  { band: "B05", name: "Vegetation Red Edge 1", wavelength_nm: 705, resolution_m: 20 },
  { band: "B06", name: "Vegetation Red Edge 2", wavelength_nm: 740, resolution_m: 20 },
  { band: "B07", name: "Vegetation Red Edge 3", wavelength_nm: 783, resolution_m: 20 },
  { band: "B08", name: "NIR", wavelength_nm: 842, resolution_m: 10 },
  { band: "B8A", name: "Narrow NIR", wavelength_nm: 865, resolution_m: 20 },
  { band: "B09", name: "Water vapour", wavelength_nm: 945, resolution_m: 60 },
  { band: "B10", name: "SWIR - Cirrus", wavelength_nm: 1375, resolution_m: 60 },
  { band: "B11", name: "SWIR 1", wavelength_nm: 1610, resolution_m: 20 },
  { band: "B12", name: "SWIR 2", wavelength_nm: 2190, resolution_m: 20 },
];

export const sentinelTools: ToolDef[] = [
  {
    name: "sentinel_search",
    description: "Search Sentinel-2 satellite imagery by location, date range, and cloud cover percentage.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Center latitude"),
      lng: z.number().min(-180).max(180).describe("Center longitude"),
      start_date: z.string().describe("Start date YYYY-MM-DD"),
      end_date: z.string().describe("End date YYYY-MM-DD"),
      max_cloud: z.number().min(0).max(100).default(30).describe("Maximum cloud cover percentage"),
      limit: z.number().int().min(1).max(50).default(10).describe("Maximum results"),
    },
    async execute(args) {
      const { lat, lng, start_date, end_date, max_cloud, limit } = args as any;
      const bbox = `OData.CSC.Intersects(area=geography'SRID=4326;POINT(${lng} ${lat})')`;
      const filter = `Collection/Name eq 'SENTINEL-2' and ${bbox} and ContentDate/Start ge ${start_date}T00:00:00.000Z and ContentDate/Start le ${end_date}T23:59:59.999Z and Attributes/OData.CSC.DoubleAttribute/any(att:att/Name eq 'cloudCover' and att/OData.CSC.DoubleAttribute/Value le ${max_cloud})`;
      const data: any = await cdsFetch(`/Products?$filter=${encodeURIComponent(filter)}&$top=${limit}&$orderby=ContentDate/Start desc`);
      const products = (data.value ?? []).map((p: any) => ({
        id: p.Id, name: p.Name, date: p.ContentDate?.Start,
        cloudCover: p.Attributes?.find((a: any) => a.Name === "cloudCover")?.Value,
        size_mb: p.ContentLength ? Math.round(p.ContentLength / 1048576) : null,
      }));
      return json({ products, count: products.length, query: { lat, lng, start_date, end_date, max_cloud } });
    },
  },
  {
    name: "sentinel_metadata",
    description: "Get detailed metadata for a Sentinel-2 product by ID.",
    schema: { product_id: z.string().describe("Copernicus product ID (UUID)") },
    async execute(args) {
      const { product_id } = args as { product_id: string };
      const data: any = await cdsFetch(`/Products('${product_id}')`);
      return json(data);
    },
  },
  {
    name: "sentinel_quicklook",
    description: "Get quicklook (thumbnail preview) URL for a Sentinel-2 product.",
    schema: { product_id: z.string().describe("Copernicus product ID") },
    async execute(args) {
      const { product_id } = args as { product_id: string };
      return json({
        product_id,
        quicklookUrl: `${ODATA}/Products('${product_id}')/Quicklook`,
        note: "Download requires Copernicus Data Space authentication.",
      });
    },
  },
  {
    name: "sentinel_bands",
    description: "Reference table of all 13 Sentinel-2 MSI spectral bands with wavelengths and resolutions.",
    schema: {},
    async execute() {
      return json({ satellite: "Sentinel-2 MSI", bands: SENTINEL2_BANDS, totalBands: SENTINEL2_BANDS.length });
    },
  },
  {
    name: "sentinel_latest",
    description: "Find the most recent cloud-free Sentinel-2 image for a location.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
      max_cloud: z.number().min(0).max(100).default(20).describe("Maximum cloud cover %"),
    },
    async execute(args) {
      const { lat, lng, max_cloud } = args as any;
      const bbox = `OData.CSC.Intersects(area=geography'SRID=4326;POINT(${lng} ${lat})')`;
      const filter = `Collection/Name eq 'SENTINEL-2' and ${bbox} and Attributes/OData.CSC.DoubleAttribute/any(att:att/Name eq 'cloudCover' and att/OData.CSC.DoubleAttribute/Value le ${max_cloud})`;
      const data: any = await cdsFetch(`/Products?$filter=${encodeURIComponent(filter)}&$top=1&$orderby=ContentDate/Start desc`);
      const p = data.value?.[0];
      if (!p) return json({ error: "No recent cloud-free image found", lat, lng, max_cloud });
      return json({ id: p.Id, name: p.Name, date: p.ContentDate?.Start, cloudCover: p.Attributes?.find((a: any) => a.Name === "cloudCover")?.Value, lat, lng });
    },
  },
  {
    name: "sentinel_timeline",
    description: "Get available Sentinel-2 image dates for a location over the past year.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
      months: z.number().int().min(1).max(24).default(3).describe("Months to look back"),
    },
    async execute(args) {
      const { lat, lng, months } = args as any;
      const end = new Date().toISOString().split("T")[0];
      const start = new Date(Date.now() - months * 30 * 86400000).toISOString().split("T")[0];
      const bbox = `OData.CSC.Intersects(area=geography'SRID=4326;POINT(${lng} ${lat})')`;
      const filter = `Collection/Name eq 'SENTINEL-2' and ${bbox} and ContentDate/Start ge ${start}T00:00:00.000Z and ContentDate/Start le ${end}T23:59:59.999Z`;
      const data: any = await cdsFetch(`/Products?$filter=${encodeURIComponent(filter)}&$top=100&$orderby=ContentDate/Start desc&$select=ContentDate`);
      const dates = (data.value ?? []).map((p: any) => p.ContentDate?.Start?.split("T")[0]).filter(Boolean);
      return json({ lat, lng, dates: [...new Set(dates)].sort(), count: new Set(dates).size, months });
    },
  },
  {
    name: "sentinel_coverage",
    description: "Sentinel-2 coverage and revisit information for a location.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
    },
    async execute(args) {
      const { lat, lng } = args as any;
      return json({
        lat, lng, satellite: "Sentinel-2A/2B",
        revisitDays: 5, note: "Combined S2A+S2B revisit is 5 days at equator, more frequent at higher latitudes",
        swathWidth_km: 290, resolution: { bands_10m: ["B02", "B03", "B04", "B08"], bands_20m: ["B05", "B06", "B07", "B8A", "B11", "B12"], bands_60m: ["B01", "B09", "B10"] },
        dataAccess: "https://dataspace.copernicus.eu/",
      });
    },
  },
  {
    name: "sentinel_download_url",
    description: "Get download URL for a Sentinel-2 product. Requires Copernicus authentication.",
    schema: { product_id: z.string().describe("Copernicus product ID") },
    async execute(args) {
      const { product_id } = args as { product_id: string };
      return json({
        product_id,
        downloadUrl: `${ODATA}/Products('${product_id}')/$value`,
        note: "Download requires OAuth2 authentication. Set COPERNICUS_CLIENT_ID and COPERNICUS_CLIENT_SECRET environment variables.",
        authUrl: "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token",
      });
    },
  },
];
