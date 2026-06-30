// Space & Orbital Tracking — CelesTrak + N2YO
// Tools: space_satellites, space_tle, space_passes, space_overhead, space_starlink, space_debris

import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";
import { requireApiKey } from "../utils/require-key.js";

const limiter = new RateLimiter(2000);
const cache = new TTLCache<unknown>(30 * 60 * 1000);

async function celestrakFetch<T>(params: string): Promise<T> {
  await limiter.acquire();
  const url = `https://celestrak.org/NORAD/elements/gp.php?${params}&FORMAT=json`;
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`CelesTrak API error: ${resp.status}`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

async function n2yoFetch<T>(path: string, ctx: ToolContext): Promise<T> {
  const key = requireApiKey(ctx.config.n2yoApiKey, "N2YO", "N2YO_API_KEY");
  await limiter.acquire();
  const url = `https://api.n2yo.com/rest/v1/satellite/${path}&apiKey=${key}`;
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`N2YO API error: ${resp.status}`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

const GROUPS: Record<string, string> = {
  communications: "active", weather: "weather", "earth-resources": "resource",
  military: "military", science: "science", navigation: "navigation",
  starlink: "starlink", stations: "stations",
};

function parseSat(s: any) {
  return {
    name: s.OBJECT_NAME, noradId: s.NORAD_CAT_ID, intlDesignator: s.OBJECT_ID,
    epoch: s.EPOCH, inclination: s.INCLINATION, eccentricity: s.ECCENTRICITY,
    period_min: s.PERIOD, meanMotion: s.MEAN_MOTION, apoapsis_km: s.APOAPSIS,
    periapsis_km: s.PERIAPSIS,
  };
}

export const spaceTools: ToolDef[] = [
  {
    name: "space_satellites",
    description: "List active satellites by category — communications, weather, military, science, navigation, starlink, or stations.",
    schema: {
      category: z.enum(["communications", "weather", "earth-resources", "military", "science", "navigation", "starlink", "stations"]).describe("Satellite category"),
    },
    async execute(args) {
      const { category } = args as { category: string };
      const group = GROUPS[category] ?? category;
      const data: any = await celestrakFetch(`GROUP=${group}`);
      const sats = Array.isArray(data) ? data.map(parseSat) : [];
      return json({ category, satellites: sats.slice(0, 100), count: sats.length });
    },
  },
  {
    name: "space_tle",
    description: "Get TLE (Two-Line Element) orbital data for a satellite by NORAD catalog number.",
    schema: { norad_id: z.number().int().describe("NORAD catalog number") },
    async execute(args) {
      const { norad_id } = args as { norad_id: number };
      const data: any = await celestrakFetch(`CATNR=${norad_id}`);
      const s = Array.isArray(data) ? data[0] : data;
      if (!s) return json({ error: "Satellite not found", norad_id });
      return json({
        name: s.OBJECT_NAME, noradId: s.NORAD_CAT_ID, intlDesignator: s.OBJECT_ID,
        epoch: s.EPOCH, inclination: s.INCLINATION, raan: s.RA_OF_ASC_NODE,
        eccentricity: s.ECCENTRICITY, argPerigee: s.ARG_OF_PERICENTER,
        meanAnomaly: s.MEAN_ANOMALY, meanMotion: s.MEAN_MOTION,
        revolutionNumber: s.REV_AT_EPOCH, bstar: s.BSTAR,
        period_min: s.PERIOD, apoapsis_km: s.APOAPSIS, periapsis_km: s.PERIAPSIS,
      });
    },
  },
  {
    name: "space_passes",
    description: "Predict visible satellite passes over a location. Requires N2YO API key.",
    schema: {
      norad_id: z.number().int().describe("NORAD catalog number of satellite"),
      lat: z.number().min(-90).max(90).describe("Observer latitude"),
      lng: z.number().min(-180).max(180).describe("Observer longitude"),
      days: z.number().int().min(1).max(10).default(3).describe("Number of days to predict"),
      min_elevation: z.number().min(0).max(90).default(10).describe("Minimum elevation in degrees"),
    },
    async execute(args, ctx) {
      const { norad_id, lat, lng, days, min_elevation } = args as any;
      const data: any = await n2yoFetch(`visualpasses/${norad_id}/${lat}/${lng}/0/${days}/${min_elevation}/?`, ctx);
      const passes = (data.passes ?? []).map((p: any) => ({
        startTime: new Date(p.startUTC * 1000).toISOString(), endTime: new Date(p.endUTC * 1000).toISOString(),
        startAz: p.startAz, endAz: p.endAz, maxElevation: p.maxEl,
        duration_s: p.duration, magnitude: p.mag,
      }));
      return json({ satellite: norad_id, location: { lat, lng }, passes, count: passes.length });
    },
  },
  {
    name: "space_overhead",
    description: "List satellites currently overhead at a location. Requires N2YO API key.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Observer latitude"),
      lng: z.number().min(-180).max(180).describe("Observer longitude"),
      radius: z.number().min(1).max(90).default(70).describe("Search radius in degrees"),
      category: z.number().int().min(0).max(52).default(0).describe("N2YO category ID (0=all)"),
    },
    async execute(args, ctx) {
      const { lat, lng, radius, category } = args as any;
      const data: any = await n2yoFetch(`above/${lat}/${lng}/0/${radius}/${category}/?`, ctx);
      const sats = (data.above ?? []).map((s: any) => ({
        name: s.satname, noradId: s.satid, lat: s.satlat, lng: s.satlng,
        altitude_km: s.satalt, intlDesignator: s.intDesignator,
      }));
      return json({ location: { lat, lng }, satellites: sats, count: sats.length });
    },
  },
  {
    name: "space_starlink",
    description: "Get Starlink constellation status — total satellites, orbital statistics, newest and oldest launches.",
    schema: {},
    async execute() {
      const data: any = await celestrakFetch("GROUP=starlink");
      const sats = Array.isArray(data) ? data : [];
      let totalAlt = 0, totalInc = 0, totalPer = 0;
      let newest = sats[0], oldest = sats[0];
      for (const s of sats) {
        totalAlt += (s.APOAPSIS + s.PERIAPSIS) / 2;
        totalInc += s.INCLINATION;
        totalPer += s.PERIOD;
        if (s.EPOCH > (newest?.EPOCH ?? "")) newest = s;
        if (s.EPOCH < (oldest?.EPOCH ?? "9999")) oldest = s;
      }
      const n = sats.length || 1;
      return json({
        totalSatellites: sats.length,
        stats: {
          avgAltitude_km: Math.round(totalAlt / n),
          avgInclination: Math.round((totalInc / n) * 100) / 100,
          avgPeriod_min: Math.round((totalPer / n) * 100) / 100,
        },
        newestLaunch: newest ? { name: newest.OBJECT_NAME, epoch: newest.EPOCH } : null,
        oldestLaunch: oldest ? { name: oldest.OBJECT_NAME, epoch: oldest.EPOCH } : null,
      });
    },
  },
  {
    name: "space_debris",
    description: "Track space debris objects from known fragmentation events.",
    schema: {
      group: z.string().default("cosmos-1408-debris").describe("Debris group name (e.g. 'cosmos-1408-debris', 'fengyun-1c-debris', 'iridium-33-debris')"),
    },
    async execute(args) {
      const { group } = args as { group: string };
      try {
        const data: any = await celestrakFetch(`GROUP=${group}`);
        const debris = (Array.isArray(data) ? data : []).map((s: any) => ({
          name: s.OBJECT_NAME, noradId: s.NORAD_CAT_ID, epoch: s.EPOCH,
          inclination: s.INCLINATION, eccentricity: s.ECCENTRICITY,
          period_min: s.PERIOD, altitude_km: Math.round((s.APOAPSIS + s.PERIAPSIS) / 2),
        }));
        return json({ group, debrisObjects: debris.slice(0, 100), count: debris.length });
      } catch {
        return json({ group, error: "Debris group not found. Try: cosmos-1408-debris, fengyun-1c-debris, iridium-33-debris", debrisObjects: [], count: 0 });
      }
    },
  },
];
