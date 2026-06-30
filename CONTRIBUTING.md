# Contributing to satellite-mcp

Thank you for your interest in contributing to satellite-mcp! This document provides guidelines and instructions to help you get started.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/badchars/satellite-mcp.git
cd satellite-mcp

# Install dependencies (Bun 1.3.9+ required)
bun install

# Build the project
bun run build

# Start in development mode (watch for changes)
bun run dev
```

## Project Structure

```
src/
├── index.ts                # Entry point, CLI flags, MCP server bootstrap
├── protocol/
│   └── tools.ts            # Tool registry — all tools registered here
├── types/
│   └── index.ts            # ToolDef, ToolContext, ToolResult interfaces
├── utils/
│   ├── cache.ts            # TTL cache implementation
│   └── rate-limiter.ts     # Per-provider rate limiter
├── sentinel/               # Sentinel-2 imagery (8 tools)
├── landsat/                # Landsat imagery (7 tools)
├── firms/                  # NASA FIRMS fire data (6 tools)
├── nasa/                   # NASA APIs (7 tools)
├── nightlights/            # VIIRS nighttime lights (5 tools)
├── planet/                 # Planet Labs imagery (4 tools)
├── aircraft/               # ADS-B aircraft tracking (10 tools)
├── maritime/               # AIS ship tracking (8 tools)
├── space/                  # Space object tracking (6 tools)
├── military/               # Military intelligence (8 tools)
├── conflict/               # ACLED conflict data (6 tools)
├── environment/            # Environmental monitoring (6 tools)
├── ocean/                  # Ocean & marine data (5 tools)
├── seismic/                # Earthquake & seismic data (5 tools)
├── weather/                # Weather intelligence (6 tools)
├── terrain/                # Terrain & elevation (6 tools)
├── infrastructure/         # Infrastructure monitoring (6 tools)
├── sanctions/              # Sanctions screening (5 tools)
├── cyber/                  # Cyber-geospatial intel (6 tools)
├── population/             # Population & demographics (5 tools)
├── agriculture/            # Agriculture & crop data (5 tools)
├── humanitarian/           # Humanitarian crisis data (5 tools)
├── trade/                  # Global trade flows (5 tools)
├── osm/                    # OpenStreetMap queries (8 tools)
├── geo/                    # Geospatial computation (8 tools)
├── spectral/               # Spectral analysis (8 tools)
├── change/                 # Change detection (6 tools)
└── meta/                   # Server meta info (1 tool)
```

## Adding a New Tool

Each tool is defined using the `ToolDef` interface. Every tool has a name, description, a Zod input schema, and an async `execute` function.

### 1. Define the tool

Create or edit a file in the appropriate provider directory:

```typescript
import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json, text } from "../types/index.js";

export const myNewTool: ToolDef = {
  name: "my_new_tool",
  description: "Short description of what the tool does",
  schema: {
    lat: z.number().describe("Latitude in decimal degrees"),
    lon: z.number().describe("Longitude in decimal degrees"),
    radius_km: z.number().optional().default(10).describe("Search radius in kilometers"),
  },
  execute: async (args, ctx) => {
    const { lat, lon, radius_km } = args as { lat: number; lon: number; radius_km: number };

    const resp = await fetch(`https://api.example.com/search?lat=${lat}&lon=${lon}&radius=${radius_km}`);
    if (!resp.ok) {
      return text(`API error: ${resp.status} ${resp.statusText}`);
    }

    const data = await resp.json();
    return json(data);
  },
};
```

### 2. Register the tool

Import and add the tool to the `allTools` array in `src/protocol/tools.ts`:

```typescript
import { myNewTool } from "../myprovider/index.js";

// Add to the allTools array
export const allTools: ToolDef[] = [
  // ... existing tools
  myNewTool,
];
```

### 3. Test the tool

```bash
bun run src/index.ts --tool my_new_tool '{"lat": 40.7128, "lon": -74.006}'
```

## Adding a New Data Source (Provider)

1. Create a new directory under `src/` named after the provider (e.g., `src/newprovider/`).
2. Create an `index.ts` that exports a `ToolDef[]` array (the provider pattern: `export const newproviderTools: ToolDef[] = [...]`).
3. If the provider requires an API key, add the key field to `ToolContext["config"]` in `src/types/index.ts`.
4. Handle missing API keys gracefully -- return a descriptive error message instead of throwing.
5. Add rate limiting using the shared `RateLimiter` from `src/utils/rate-limiter.ts`.
6. Add caching using the shared `TTLCache` from `src/utils/cache.ts`.
7. Register all tools in `src/protocol/tools.ts` by importing and spreading the array into `allTools`.
8. Update tool counts in the README and CHANGELOG if applicable.

## Guidelines

- **TypeScript strict mode** -- the project uses strict compiler settings. Fix all type errors before submitting.
- **Zod schemas** -- every tool input field must use Zod for validation with a `.describe()` call explaining the field.
- **Native `fetch()`** -- use the built-in `fetch()` for all HTTP API calls. Do not add HTTP client libraries.
- **Minimal dependencies** -- the project has only 2 runtime dependencies (`@modelcontextprotocol/sdk` and `zod`). Avoid adding new dependencies unless strictly necessary.
- **Graceful API key handling** -- all API keys are optional. When a key is missing, return a clear error message explaining which key is needed and how to set it.
- **Conventional Commits** -- use the [Conventional Commits](https://www.conventionalcommits.org/) format for all commit messages:
  - `feat:` for new features or tools
  - `fix:` for bug fixes
  - `docs:` for documentation changes
  - `refactor:` for code refactoring
  - `chore:` for build/tooling changes
- **ESM imports** -- always use `.js` extensions in import paths (TypeScript ESM requirement).
- **No console.log in tool output** -- tool results go through the `text()` or `json()` helpers only.

## Submitting a Pull Request

1. Fork the repository and create a feature branch from `main`.
2. Make your changes following the guidelines above.
3. Ensure the project builds cleanly: `bun run build`
4. Test your changes with the CLI: `bun run src/index.ts --tool <tool_name> '<json_args>'`
5. Commit using Conventional Commits format.
6. Open a pull request against `main` with a clear description of what you changed and why.

## Reporting Issues

- Use [GitHub Issues](https://github.com/badchars/satellite-mcp/issues) for bug reports and feature requests.
- For security vulnerabilities, see [SECURITY.md](SECURITY.md) -- do **not** open a public issue.
- Include reproduction steps, expected behavior, and your environment details (OS, Bun/Node version).
