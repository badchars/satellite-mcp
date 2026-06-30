import type { z } from "zod";

// ─── MCP Tool Infrastructure ───

export interface ToolDef {
  name: string;
  description: string;
  schema: Record<string, z.ZodType>;
  execute: (args: Record<string, unknown>, ctx: ToolContext) => Promise<ToolResult>;
}

export interface ToolContext {
  config: {
    // Satellite Imagery
    copernicusClientId?: string;
    copernicusClientSecret?: string;
    usgsUsername?: string;
    usgsPassword?: string;
    nasaApiKey?: string;
    firmsMapKey?: string;
    earthdataToken?: string;
    planetApiKey?: string;
    // Aircraft
    openskyUsername?: string;
    openskyPassword?: string;
    // Maritime
    gfwApiKey?: string;
    // Space
    n2yoApiKey?: string;
    // Conflict
    acledApiKey?: string;
    acledEmail?: string;
    // Trade
    comtradeApiKey?: string;
    // Geo
    timezoneDbKey?: string;
  };
}

export interface ToolResult {
  [key: string]: unknown;
  content: { type: "text"; text: string }[];
}

// ─── Response Helpers ───

export function text(msg: string): ToolResult {
  return { content: [{ type: "text", text: msg }] };
}

export function json(data: unknown): ToolResult {
  return text(JSON.stringify(data, null, 2));
}
