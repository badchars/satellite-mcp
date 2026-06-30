#!/usr/bin/env node

import type { ToolContext } from "./types/index.js";
import { startMcpStdio } from "./protocol/mcp-server.js";
import { allTools } from "./protocol/tools.js";

// ─── Build ToolContext from Environment ───

function buildToolContext(): ToolContext {
  return {
    config: {
      // Copernicus (Sentinel)
      copernicusClientId: process.env.COPERNICUS_CLIENT_ID,
      copernicusClientSecret: process.env.COPERNICUS_CLIENT_SECRET,
      // USGS (Landsat)
      usgsUsername: process.env.USGS_USERNAME,
      usgsPassword: process.env.USGS_PASSWORD,
      // NASA
      nasaApiKey: process.env.NASA_API_KEY,
      firmsMapKey: process.env.NASA_FIRMS_KEY,
      earthdataToken: process.env.NASA_EARTHDATA_TOKEN,
      // Planet Labs
      planetApiKey: process.env.PLANET_API_KEY,
      // Aircraft (OpenSky)
      openskyUsername: process.env.OPENSKY_USERNAME,
      openskyPassword: process.env.OPENSKY_PASSWORD,
      // Maritime (Global Fishing Watch)
      gfwApiKey: process.env.GFW_API_KEY,
      // Space (N2YO)
      n2yoApiKey: process.env.N2YO_API_KEY,
      // Conflict (ACLED)
      acledApiKey: process.env.ACLED_API_KEY,
      acledEmail: process.env.ACLED_EMAIL,
      // Trade (UN Comtrade)
      comtradeApiKey: process.env.COMTRADE_API_KEY,
      // Geo (TimezoneDB)
      timezoneDbKey: process.env.TIMEZONEDB_KEY,
    },
  };
}

// ─── Tool Categories for --list display ───

const TOOL_CATEGORIES: { category: string; prefix: string }[] = [
  // Satellite Imagery
  { category: "Sentinel-2 (Copernicus)", prefix: "sentinel_" },
  { category: "Landsat (USGS)", prefix: "landsat_" },
  { category: "NASA FIRMS (Active Fire)", prefix: "firms_" },
  { category: "NASA Earth Observation", prefix: "nasa_" },
  { category: "Night Lights (VIIRS)", prefix: "nightlights_" },
  { category: "Planet Labs", prefix: "planet_" },
  // Tracking
  { category: "Aircraft Intelligence", prefix: "aircraft_" },
  { category: "Maritime Intelligence", prefix: "ship_" },
  { category: "Space & Orbital Tracking", prefix: "space_" },
  // Security & Defense
  { category: "Military & Defense", prefix: "mil_" },
  { category: "Conflict & Events", prefix: "conflict_" },
  { category: "Conflict & Events", prefix: "events_" },
  // Earth Science
  { category: "Environmental Intelligence", prefix: "env_" },
  { category: "Ocean Intelligence", prefix: "ocean_" },
  { category: "Seismic & Disaster", prefix: "quake_" },
  { category: "Weather & Atmosphere", prefix: "weather_" },
  { category: "Weather & Atmosphere", prefix: "atmosphere_" },
  { category: "Terrain & Elevation", prefix: "terrain_" },
  // Infrastructure
  { category: "Critical Infrastructure", prefix: "infra_" },
  { category: "Sanctions & Compliance", prefix: "sanctions_" },
  // Intelligence
  { category: "Cyber-Geo Intelligence", prefix: "cyber_" },
  { category: "Population & Demographics", prefix: "pop_" },
  { category: "Agriculture & Food Security", prefix: "agri_" },
  { category: "Humanitarian & Refugee", prefix: "humanitarian_" },
  { category: "Trade Intelligence", prefix: "trade_" },
  // Geospatial
  { category: "OpenStreetMap / Overpass", prefix: "osm_" },
  { category: "Geocoding & Coordinates", prefix: "geo_" },
  { category: "Spectral Analysis", prefix: "spectral_" },
  { category: "Change Detection", prefix: "change_" },
  // Meta
  { category: "Meta", prefix: "satellite_" },
];

function categorize(toolName: string): string {
  for (const { category, prefix } of TOOL_CATEGORIES) {
    if (toolName.startsWith(prefix)) return category;
  }
  return "Other";
}

// ─── CLI: --help ───

function printHelp(): void {
  console.log(`satellite-mcp — Full-Spectrum GEOINT MCP Server

USAGE:
  satellite-mcp              Start MCP server on stdio
  satellite-mcp --help       Show this help message
  satellite-mcp --list       List all ${allTools.length} tools grouped by category
  satellite-mcp --tool NAME  Run a single tool with JSON args

EXAMPLES:
  satellite-mcp --tool spectral_ndvi '{"nir":0.8,"red":0.2}'
  satellite-mcp --tool geo_distance '{"lat1":41.01,"lng1":28.98,"lat2":39.93,"lng2":32.86}'
  satellite-mcp --tool quake_recent '{"min_magnitude":4.0,"limit":10}'
  satellite-mcp --tool firms_active_country '{"country":"TR","days":1}'

ENVIRONMENT VARIABLES:
  COPERNICUS_CLIENT_ID       Copernicus Data Space OAuth2 client
  COPERNICUS_CLIENT_SECRET   Copernicus Data Space OAuth2 secret
  USGS_USERNAME              USGS EarthExplorer username
  USGS_PASSWORD              USGS EarthExplorer password
  NASA_API_KEY               NASA API key (fallback: DEMO_KEY)
  NASA_FIRMS_KEY             NASA FIRMS map key
  NASA_EARTHDATA_TOKEN       NASA Earthdata bearer token
  PLANET_API_KEY             Planet Labs API key (required for Planet tools)
  OPENSKY_USERNAME           OpenSky Network username (higher rate limit)
  OPENSKY_PASSWORD           OpenSky Network password
  GFW_API_KEY                Global Fishing Watch API key
  N2YO_API_KEY               N2YO satellite tracking key
  ACLED_API_KEY              ACLED conflict data key
  ACLED_EMAIL                ACLED registered email
  COMTRADE_API_KEY           UN Comtrade API key
  TIMEZONEDB_KEY             TimezoneDB API key
`);
}

// ─── CLI: --list ───

function printToolList(): void {
  const grouped = new Map<string, typeof allTools>();

  for (const tool of allTools) {
    const cat = categorize(tool.name);
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(tool);
  }

  console.log(`\nsatellite-mcp — ${allTools.length} tools\n`);

  for (const [category, tools] of grouped) {
    console.log(`━━━ ${category} (${tools.length}) ━━━`);
    for (const tool of tools) {
      const schemaKeys = Object.keys(tool.schema);
      const params = schemaKeys.length > 0 ? `(${schemaKeys.join(", ")})` : "()";
      console.log(`  ${tool.name}${params}`);
      console.log(`    ${tool.description.split(".")[0]}.`);
    }
    console.log();
  }
}

// ─── CLI: --tool ───

async function runSingleTool(name: string, argsJson: string): Promise<void> {
  const ctx = buildToolContext();
  const tool = allTools.find((t) => t.name === name);
  if (!tool) {
    console.error(`Unknown tool: ${name}`);
    console.error(`Run --list to see all available tools.`);
    process.exit(1);
  }

  try {
    const args = argsJson ? JSON.parse(argsJson) : {};
    const result = await tool.execute(args, ctx);
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(`Error running ${name}: ${(err as Error).message}`);
    process.exit(1);
  }
}

// ─── Main ───

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printHelp();
    return;
  }

  if (args.includes("--list") || args.includes("-l")) {
    printToolList();
    return;
  }

  const toolIdx = args.indexOf("--tool");
  if (toolIdx !== -1) {
    const toolName = args[toolIdx + 1];
    const toolArgs = args[toolIdx + 2] ?? "{}";
    if (!toolName) {
      console.error("Usage: satellite-mcp --tool <name> '<json>'");
      process.exit(1);
    }
    await runSingleTool(toolName, toolArgs);
    return;
  }

  // Default: start MCP server on stdio
  const ctx = buildToolContext();
  await startMcpStdio(ctx);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
