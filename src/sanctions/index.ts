// Sanctions & Compliance — OFAC SDN + hardcoded data (free, no auth)
// Tools: sanctions_search, sanctions_vessel, sanctions_entity, sanctions_country, sanctions_changes

import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(2000);
const cache = new TTLCache<unknown>(24 * 60 * 60 * 1000);

const OFAC_API = "https://sanctionslistservice.ofac.treas.gov/api";

async function ofacSearch(query: string): Promise<any[]> {
  await limiter.acquire();
  const url = `${OFAC_API}/PublicationPreview/CustomList/SDN?name=${encodeURIComponent(query)}`;
  const cached = cache.get(url);
  if (cached) return cached as any[];
  try {
    const resp = await fetch(url, { headers: { Accept: "application/json" } });
    if (!resp.ok) return [];
    const data = await resp.json();
    cache.set(url, data);
    return Array.isArray(data) ? data : data?.results ?? data?.data ?? [];
  } catch {
    return [];
  }
}

const COUNTRY_SANCTIONS: Record<string, { level: string; programs: string[]; restrictions: string[] }> = {
  cuba: { level: "Comprehensive", programs: ["Cuba Sanctions"], restrictions: ["Trade embargo", "Financial transactions", "Travel restrictions"] },
  iran: { level: "Comprehensive", programs: ["Iran Sanctions", "JCPOA"], restrictions: ["Oil/gas trade", "Financial system", "Arms", "Nuclear technology"] },
  "north korea": { level: "Comprehensive", programs: ["North Korea Sanctions"], restrictions: ["All trade", "Financial", "Arms", "Luxury goods"] },
  dprk: { level: "Comprehensive", programs: ["North Korea Sanctions"], restrictions: ["All trade", "Financial", "Arms", "Luxury goods"] },
  syria: { level: "Comprehensive", programs: ["Syria Sanctions"], restrictions: ["Oil trade", "Financial", "Arms", "Government dealings"] },
  russia: { level: "Sectoral", programs: ["Ukraine/Russia Sanctions", "CAATSA"], restrictions: ["Energy sector", "Financial sector", "Defense", "Technology exports"] },
  belarus: { level: "Targeted", programs: ["Belarus Sanctions"], restrictions: ["Government officials", "State enterprises", "Potash exports"] },
  myanmar: { level: "Targeted", programs: ["Burma Sanctions"], restrictions: ["Military entities", "Government officials", "Gems/timber"] },
  venezuela: { level: "Sectoral", programs: ["Venezuela Sanctions"], restrictions: ["Oil sector", "Government", "Gold", "Financial"] },
  china: { level: "Targeted", programs: ["Various"], restrictions: ["Military-linked entities", "Technology (Entity List)", "Xinjiang-related"] },
};

export const sanctionsTools: ToolDef[] = [
  {
    name: "sanctions_search",
    description: "Search OFAC SDN sanctions list for a name, entity, or organization.",
    schema: { query: z.string().describe("Name or entity to search for") },
    async execute(args) {
      const { query } = args as { query: string };
      const results = await ofacSearch(query);
      return json({ results: results.slice(0, 20), count: results.length, query, source: "OFAC SDN List" });
    },
  },
  {
    name: "sanctions_vessel",
    description: "Check if a vessel is on sanctions lists by IMO number or vessel name.",
    schema: { identifier: z.string().describe("Vessel name or IMO number") },
    async execute(args) {
      const { identifier } = args as { identifier: string };
      const results = await ofacSearch(identifier);
      const vesselMatches = results.filter((r: any) => {
        const type = (r.type ?? r.sdnType ?? "").toLowerCase();
        return type.includes("vessel") || type.includes("aircraft");
      });
      return json({ vessel: identifier, sanctioned: vesselMatches.length > 0, matches: vesselMatches.slice(0, 10), source: "OFAC SDN List" });
    },
  },
  {
    name: "sanctions_entity",
    description: "Check sanctions status for a specific entity or individual.",
    schema: {
      name: z.string().describe("Entity or individual name"),
      type: z.enum(["individual", "entity"]).default("entity").describe("Type: individual or entity"),
    },
    async execute(args) {
      const { name, type } = args as { name: string; type: string };
      const results = await ofacSearch(name);
      return json({ name, type, sanctioned: results.length > 0, matches: results.slice(0, 10), source: "OFAC SDN List" });
    },
  },
  {
    name: "sanctions_country",
    description: "Get sanctions program summary for a country — sanction level, programs, and restrictions.",
    schema: { country: z.string().describe("Country name or ISO code") },
    async execute(args) {
      const { country } = args as { country: string };
      const key = country.toLowerCase().trim();
      const info = COUNTRY_SANCTIONS[key];
      if (info) {
        return json({ country, sanctionLevel: info.level, programs: info.programs, restrictions: info.restrictions, source: "OFAC/EU Consolidated" });
      }
      return json({ country, sanctionLevel: "None/Minimal", programs: [], restrictions: [], note: "No comprehensive or major targeted sanctions programs found for this country. Specific entities may still be sanctioned." });
    },
  },
  {
    name: "sanctions_changes",
    description: "Check for recent changes to the OFAC sanctions list.",
    schema: {},
    async execute() {
      try {
        await limiter.acquire();
        const resp = await fetch(`${OFAC_API}/PublicationPreview/Recent`, { headers: { Accept: "application/json" } });
        if (!resp.ok) throw new Error(`OFAC API: ${resp.status}`);
        const data = await resp.json();
        return json({ recentChanges: Array.isArray(data) ? data.slice(0, 20) : data, source: "OFAC Recent Actions" });
      } catch {
        return json({ recentChanges: [], note: "OFAC API unavailable. Check https://ofac.treasury.gov/recent-actions for latest changes.", source: "OFAC" });
      }
    },
  },
];
