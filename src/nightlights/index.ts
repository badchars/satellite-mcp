// Night Lights (VIIRS) — EOG/NOAA + NASA GIBS
// Tools: nightlights_tile, nightlights_radiance, nightlights_compare, nightlights_timeseries, nightlights_anomaly

import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(1000);
const cache = new TTLCache<unknown>(30 * 60 * 1000);

export const nightlightsTools: ToolDef[] = [
  {
    name: "nightlights_tile",
    description: "Get night lights map tile URL from NASA GIBS — VIIRS Black Marble layer.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Center latitude"),
      lng: z.number().min(-180).max(180).describe("Center longitude"),
      zoom: z.number().int().min(1).max(12).default(8).describe("Zoom level (1-12)"),
      date: z.string().optional().describe("Date YYYY-MM-DD (default: latest)"),
    },
    async execute(args) {
      const { lat, lng, zoom, date } = args as any;
      const tileX = Math.floor(((lng + 180) / 360) * Math.pow(2, zoom));
      const tileY = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
      const dateStr = date ?? new Date().toISOString().split("T")[0];
      const layer = "VIIRS_Black_Marble";
      return json({
        lat, lng, zoom, tileX, tileY,
        tileUrl: `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/${layer}/default/${dateStr}/500m/${zoom}/${tileY}/${tileX}.png`,
        viewerUrl: `https://worldview.earthdata.nasa.gov/?v=${lng - 5},${lat - 5},${lng + 5},${lat + 5}&l=${layer}`,
        note: "NASA GIBS provides global night light imagery from VIIRS Day/Night Band.",
        source: "NASA GIBS / VIIRS Black Marble",
      });
    },
  },
  {
    name: "nightlights_radiance",
    description: "Get night light radiance estimate for a location — light intensity indicator.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
    },
    async execute(args) {
      const { lat, lng } = args as any;
      return json({
        lat, lng,
        dataSource: "VIIRS Day/Night Band (DNB)",
        unit: "nanoWatts/cm²/sr",
        eogViewer: `https://eogdata.mines.edu/nighttime_light/`,
        interpretation: {
          dark: "< 0.5 nW/cm²/sr (rural, uninhabited)",
          dim: "0.5 - 5 nW/cm²/sr (small settlements)",
          moderate: "5 - 50 nW/cm²/sr (suburban, small cities)",
          bright: "50 - 200 nW/cm²/sr (urban centers)",
          veryBright: "> 200 nW/cm²/sr (dense urban, industrial)",
        },
        note: "For exact radiance values, download VIIRS DNB composite tiles from EOG. Monthly and annual composites available.",
        source: "NOAA/EOG VIIRS",
      });
    },
  },
  {
    name: "nightlights_compare",
    description: "Compare night light levels between two dates — detect power outages, urban growth, or conflict damage.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
      date1: z.string().describe("First date YYYY-MM-DD (earlier)"),
      date2: z.string().describe("Second date YYYY-MM-DD (later)"),
    },
    async execute(args) {
      const { lat, lng, date1, date2 } = args as any;
      const layer = "VIIRS_Black_Marble";
      return json({
        lat, lng, date1, date2,
        viewerUrl1: `https://worldview.earthdata.nasa.gov/?v=${lng - 2},${lat - 2},${lng + 2},${lat + 2}&l=${layer}&t=${date1}`,
        viewerUrl2: `https://worldview.earthdata.nasa.gov/?v=${lng - 2},${lat - 2},${lng + 2},${lat + 2}&l=${layer}&t=${date2}`,
        interpretation: {
          increase: "Urban growth, new infrastructure, economic development",
          decrease: "Power outage, conflict damage, economic decline, sanctions impact",
          seasonal: "Agricultural lighting, holiday illumination, weather effects",
        },
        note: "Compare Worldview imagery for the two dates. For quantitative analysis, download VIIRS DNB composites from EOG.",
        source: "NASA GIBS / VIIRS",
      });
    },
  },
  {
    name: "nightlights_timeseries",
    description: "Night light time series analysis — monthly radiance trends for monitoring urbanization or conflict.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
      start_year: z.number().int().min(2012).default(2020).describe("Start year (VIIRS from 2012)"),
      end_year: z.number().int().default(2024).describe("End year"),
    },
    async execute(args) {
      const { lat, lng, start_year, end_year } = args as any;
      return json({
        lat, lng, period: `${start_year}-${end_year}`,
        dataSource: "VIIRS DNB Monthly Composites",
        downloadUrl: "https://eogdata.mines.edu/nighttime_light/monthly_notile/v10/",
        availableProducts: [
          { name: "vcmcfg", description: "Cloud-free composite (recommended)" },
          { name: "vcmslcfg", description: "Stray light corrected" },
        ],
        coverage: "Global, monthly since April 2012",
        resolution: "15 arc-seconds (~500m at equator)",
        note: "Monthly composites enable trend analysis. Light increase = urbanization/development. Decrease = conflict/outage/decline.",
        source: "NOAA/EOG VIIRS DNB",
      });
    },
  },
  {
    name: "nightlights_anomaly",
    description: "Night light anomaly detection — sudden changes indicating power outages, conflict, or rapid development.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
      radius_km: z.number().min(1).max(500).default(50).describe("Analysis radius in km"),
    },
    async execute(args) {
      const { lat, lng, radius_km } = args as any;
      return json({
        lat, lng, radius_km,
        anomalyTypes: [
          { type: "blackout", description: "Sudden radiance drop > 50% — power grid failure, military strike, natural disaster" },
          { type: "brightening", description: "Sudden radiance increase > 100% — new construction, oil/gas flaring, military activity" },
          { type: "flickering", description: "Intermittent changes — unstable power grid, rotating outages" },
          { type: "seasonal", description: "Regular annual patterns — agricultural, holiday, weather" },
        ],
        methodology: "Compare recent monthly composite against 3-year baseline average. Flag deviations > 2 standard deviations.",
        dataSource: "VIIRS DNB Monthly Composites",
        downloadUrl: "https://eogdata.mines.edu/nighttime_light/",
        note: "For real-time outage detection, combine with IODA (cyber_outage tool) and news monitoring.",
        source: "NOAA/EOG VIIRS",
      });
    },
  },
];
