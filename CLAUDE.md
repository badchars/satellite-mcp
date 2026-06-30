# satellite-mcp — Full-Spectrum GEOINT MCP Server

## Overview
161-tool MCP server for geospatial intelligence: satellite imagery (Sentinel-2, Landsat, Planet), aircraft tracking, ship tracking, military intelligence, spectral analysis, change detection, conflict mapping, environmental monitoring, and 27 categories of GEOINT.

## Architecture
- **Runtime:** Bun 1.3.9+ (dev), Node.js (publish)
- **Dependencies:** @modelcontextprotocol/sdk, zod (only 2 runtime deps)
- **Transport:** stdio only
- **Pattern:** Style B — each provider exports ToolDef[] from src/<name>/index.ts

## Key Rules
- TypeScript strict mode, English code/comments
- Native `fetch()` for all HTTP APIs
- Every tool schema field must have `.describe()`
- API keys always optional (graceful error when missing)
- Rate limiter + TTL cache per provider
- Import paths use `.js` extension (ESM)

## Categories (27)
sentinel, landsat, firms, nasa, nightlights, planet, aircraft, maritime, military, space, conflict, environment, infrastructure, sanctions, terrain, cyber, population, agriculture, humanitarian, ocean, trade, seismic, osm, geo, spectral, change, weather, meta

## Commands
```bash
bun install          # Install deps
bun run dev          # Dev mode (watch)
bun run build        # Build for npm
bun run src/index.ts --help   # CLI help
bun run src/index.ts --list   # List all tools
bun run src/index.ts --tool <name> '<json>'  # Run single tool
```
