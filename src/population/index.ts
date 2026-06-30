// Population & Demographics — WorldPop + UN Data
// Tools: pop_density, pop_urban, pop_growth, pop_displacement, pop_age_structure

import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(1000);
const cache = new TTLCache<unknown>(60 * 60 * 1000);

async function cachedFetch<T>(url: string): Promise<T> {
  await limiter.acquire();
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`API error: ${resp.status}`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

export const populationTools: ToolDef[] = [
  {
    name: "pop_density",
    description: "Get population density estimate for a coordinate or country using WorldPop data.",
    schema: {
      lat: z.number().min(-90).max(90).optional().describe("Latitude"),
      lng: z.number().min(-180).max(180).optional().describe("Longitude"),
      country: z.string().optional().describe("3-letter ISO country code (e.g. TUR, DEU)"),
    },
    async execute(args) {
      const { lat, lng, country } = args as any;
      if (country) {
        try {
          const data: any = await cachedFetch(`https://www.worldpop.org/rest/data/pop/cic2020_100m?iso3=${country.toUpperCase()}`);
          return json({ country, data: data.data ?? data, source: "WorldPop" });
        } catch {
          return json({ country, note: "WorldPop API may be unavailable. Visit worldpop.org for data downloads.", source: "WorldPop" });
        }
      }
      return json({ lat, lng, note: "Point-level population density requires raster data processing. Use WorldPop downloads at worldpop.org for gridded population data.", source: "WorldPop" });
    },
  },
  {
    name: "pop_urban",
    description: "Get urbanization and city data for a coordinate — nearby urban areas and their characteristics.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
      radius_km: z.number().min(1).max(100).default(20).describe("Search radius in km"),
    },
    async execute(args) {
      const { lat, lng, radius_km } = args as any;
      const resp = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(`[out:json][timeout:15];(node["place"~"city|town"](around:${radius_km * 1000},${lat},${lng}););out qt 20;`)}`,
      });
      if (!resp.ok) throw new Error(`Overpass error: ${resp.status}`);
      const data: any = await resp.json();
      const cities = (data.elements ?? []).map((e: any) => ({
        name: e.tags?.name, population: e.tags?.population ? Number(e.tags.population) : null, type: e.tags?.place, lat: e.lat, lng: e.lon,
      }));
      return json({ center: { lat, lng }, radius_km, cities, count: cities.length });
    },
  },
  {
    name: "pop_growth",
    description: "Population growth data for a country from UN World Population Prospects.",
    schema: { country: z.string().describe("Country name or 3-letter ISO code") },
    async execute(args) {
      const { country } = args as { country: string };
      return json({
        country,
        dataSource: "UN World Population Prospects",
        url: "https://population.un.org/wpp/",
        note: "Detailed population projections available from UN WPP. For programmatic access, use the UN Data API.",
      });
    },
  },
  {
    name: "pop_displacement",
    description: "Get displaced population data for a country from UNHCR.",
    schema: { country: z.string().describe("Country name or 3-letter ISO code") },
    async execute(args) {
      const { country } = args as { country: string };
      try {
        const data: any = await cachedFetch(`https://data.unhcr.org/api/population/?country_of_origin=${encodeURIComponent(country)}&limit=10`);
        return json({ country, data: data.data ?? data, source: "UNHCR" });
      } catch {
        return json({ country, note: "UNHCR API may require different query parameters. Visit data.unhcr.org for displacement statistics.", source: "UNHCR" });
      }
    },
  },
  {
    name: "pop_age_structure",
    description: "Population age structure reference for a country — age groups relevant for demographic and intelligence analysis.",
    schema: { country: z.string().describe("Country name or ISO code") },
    async execute(args) {
      const { country } = args as { country: string };
      return json({
        country,
        dataSource: "UN World Population Prospects / CIA World Factbook",
        ageGroups: [
          { range: "0-14", label: "Youth (pre-working age)" },
          { range: "15-24", label: "Young adults (military-eligible age)" },
          { range: "25-54", label: "Working age (prime labor force)" },
          { range: "55-64", label: "Pre-retirement" },
          { range: "65+", label: "Elderly (post-working age)" },
        ],
        note: "Detailed age pyramids available from UN WPP at population.un.org/wpp/ and CIA World Factbook.",
        intelligenceRelevance: "Age structure analysis: high youth bulge (0-24 > 40%) correlates with instability risk. Military-eligible cohort (15-24) size indicates mobilization capacity.",
      });
    },
  },
];
