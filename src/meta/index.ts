import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json } from "../types/index.js";

// ─── Source Definitions ───

interface SourceDef {
  name: string;
  url: string;
  authRequired: boolean;
  envVars: string[];
  tools: number;
  configKeys: (keyof ToolContext["config"])[];
  note?: string;
}

const SOURCES: SourceDef[] = [
  {
    name: "Copernicus (Sentinel-2)",
    url: "https://dataspace.copernicus.eu",
    authRequired: false,
    envVars: ["COPERNICUS_CLIENT_ID", "COPERNICUS_CLIENT_SECRET"],
    tools: 8,
    configKeys: ["copernicusClientId"],
    note: "Catalog search works without auth. Download requires OAuth2.",
  },
  {
    name: "USGS (Landsat)",
    url: "https://m2m.cr.usgs.gov",
    authRequired: false,
    envVars: ["USGS_USERNAME", "USGS_PASSWORD"],
    tools: 7,
    configKeys: ["usgsUsername"],
  },
  {
    name: "NASA FIRMS",
    url: "https://firms.modaps.eosdis.nasa.gov",
    authRequired: false,
    envVars: ["NASA_FIRMS_KEY"],
    tools: 6,
    configKeys: ["firmsMapKey"],
  },
  {
    name: "NASA Earth",
    url: "https://api.nasa.gov",
    authRequired: false,
    envVars: ["NASA_API_KEY"],
    tools: 7,
    configKeys: ["nasaApiKey"],
    note: "DEMO_KEY allows 30 req/hr",
  },
  {
    name: "Night Lights (VIIRS)",
    url: "https://eogdata.mines.edu",
    authRequired: false,
    envVars: ["NASA_EARTHDATA_TOKEN"],
    tools: 5,
    configKeys: ["earthdataToken"],
  },
  {
    name: "Planet Labs",
    url: "https://api.planet.com",
    authRequired: true,
    envVars: ["PLANET_API_KEY"],
    tools: 4,
    configKeys: ["planetApiKey"],
  },
  {
    name: "OpenSky Network (Aircraft)",
    url: "https://opensky-network.org",
    authRequired: false,
    envVars: ["OPENSKY_USERNAME", "OPENSKY_PASSWORD"],
    tools: 10,
    configKeys: ["openskyUsername"],
  },
  {
    name: "Global Fishing Watch (Maritime)",
    url: "https://globalfishingwatch.org",
    authRequired: false,
    envVars: ["GFW_API_KEY"],
    tools: 8,
    configKeys: ["gfwApiKey"],
  },
  {
    name: "Military & Defense",
    url: "https://overpass-api.de",
    authRequired: false,
    envVars: [],
    tools: 8,
    configKeys: [],
    note: "Uses OSM + OpenSky public APIs",
  },
  {
    name: "CelesTrak / N2YO (Space)",
    url: "https://celestrak.org",
    authRequired: false,
    envVars: ["N2YO_API_KEY"],
    tools: 6,
    configKeys: ["n2yoApiKey"],
  },
  {
    name: "ACLED / GDELT (Conflict)",
    url: "https://acleddata.com",
    authRequired: false,
    envVars: ["ACLED_API_KEY", "ACLED_EMAIL"],
    tools: 6,
    configKeys: ["acledApiKey"],
  },
  {
    name: "Environmental (GFW + Copernicus)",
    url: "https://globalforestwatch.org",
    authRequired: false,
    envVars: [],
    tools: 6,
    configKeys: [],
  },
  {
    name: "Critical Infrastructure (OSM)",
    url: "https://overpass-api.de",
    authRequired: false,
    envVars: [],
    tools: 6,
    configKeys: [],
  },
  {
    name: "OFAC / EU (Sanctions)",
    url: "https://sanctionslistservice.ofac.treas.gov",
    authRequired: false,
    envVars: [],
    tools: 5,
    configKeys: [],
  },
  {
    name: "Open Elevation (Terrain)",
    url: "https://api.open-elevation.com",
    authRequired: false,
    envVars: [],
    tools: 6,
    configKeys: [],
  },
  {
    name: "OONI / IODA (Cyber-Geo)",
    url: "https://api.ooni.io",
    authRequired: false,
    envVars: [],
    tools: 6,
    configKeys: [],
  },
  {
    name: "WorldPop / UN (Population)",
    url: "https://worldpop.org",
    authRequired: false,
    envVars: [],
    tools: 5,
    configKeys: [],
  },
  {
    name: "FAO / FEWS NET (Agriculture)",
    url: "https://fao.org",
    authRequired: false,
    envVars: [],
    tools: 5,
    configKeys: [],
  },
  {
    name: "ReliefWeb / UNHCR (Humanitarian)",
    url: "https://api.reliefweb.int",
    authRequired: false,
    envVars: [],
    tools: 5,
    configKeys: [],
  },
  {
    name: "NOAA (Ocean)",
    url: "https://ndbc.noaa.gov",
    authRequired: false,
    envVars: [],
    tools: 5,
    configKeys: [],
  },
  {
    name: "UN Comtrade (Trade)",
    url: "https://comtradeapi.un.org",
    authRequired: false,
    envVars: ["COMTRADE_API_KEY"],
    tools: 5,
    configKeys: ["comtradeApiKey"],
  },
  {
    name: "USGS Earthquake (Seismic)",
    url: "https://earthquake.usgs.gov",
    authRequired: false,
    envVars: [],
    tools: 5,
    configKeys: [],
  },
  {
    name: "Overpass API (OSM)",
    url: "https://overpass-api.de",
    authRequired: false,
    envVars: [],
    tools: 8,
    configKeys: [],
  },
  {
    name: "Nominatim (Geocoding)",
    url: "https://nominatim.openstreetmap.org",
    authRequired: false,
    envVars: [],
    tools: 8,
    configKeys: [],
  },
  {
    name: "Spectral Analysis",
    url: "https://pure-computation.local",
    authRequired: false,
    envVars: [],
    tools: 8,
    configKeys: [],
    note: "Pure computation, no external API",
  },
  {
    name: "Change Detection",
    url: "https://pure-computation.local",
    authRequired: false,
    envVars: [],
    tools: 6,
    configKeys: [],
    note: "Pure computation, no external API",
  },
  {
    name: "Open-Meteo (Weather)",
    url: "https://api.open-meteo.com",
    authRequired: false,
    envVars: [],
    tools: 6,
    configKeys: [],
  },
];

// ─── Helper ───

function isConfigured(
  source: SourceDef,
  config: ToolContext["config"],
): boolean {
  // Sources with no config keys are always configured (no auth needed)
  if (source.configKeys.length === 0) return true;
  // Check if at least the primary config key has a value
  return source.configKeys.some((key) => !!config[key]);
}

// ─── Tool ───

export const metaTools: ToolDef[] = [
  {
    name: "satellite_list_sources",
    description:
      "List all satellite-mcp data sources, their API key configuration status, and tool counts. Returns a summary of all 27 categories and 161 tools.",
    schema: {},
    execute: async (_args, ctx) => {
      const sources = SOURCES.map((s) => ({
        name: s.name,
        url: s.url,
        authRequired: s.authRequired,
        envVars: s.envVars,
        tools: s.tools,
        configured: isConfigured(s, ctx.config),
        ...(s.note ? { note: s.note } : {}),
      }));

      const totalTools = SOURCES.reduce((sum, s) => sum + s.tools, 0);
      const totalCategories = SOURCES.length;
      const configuredCount = sources.filter((s) => s.configured).length;

      return json({
        totalTools,
        totalCategories,
        configuredSources: configuredCount,
        unconfiguredSources: totalCategories - configuredCount,
        sources,
      });
    },
  },
];
