// Aircraft Intelligence — OpenSky Network API
// Tools: aircraft_live, aircraft_track, aircraft_flights, aircraft_waypoints, aircraft_arrivals,
//        aircraft_departures, aircraft_search, aircraft_military, aircraft_stats, aircraft_anomaly

import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";
import { haversine } from "../utils/geo-math.js";

const limiter = new RateLimiter(1000);
const cache = new TTLCache<unknown>(2 * 60 * 1000);

const API = "https://opensky-network.org/api";

const MILITARY_PREFIXES = [
  { prefix: "ae", name: "US Military" }, { prefix: "af", name: "US Military" },
  { prefix: "43c", name: "UK Military" }, { prefix: "3f", name: "Germany Military" },
  { prefix: "3e", name: "NATO/Germany" }, { prefix: "340", name: "France Military" },
  { prefix: "300", name: "France Military" }, { prefix: "33", name: "Italy Military" },
  { prefix: "3b", name: "NATO" },
];

function authHeaders(ctx: ToolContext): Record<string, string> {
  const { openskyUsername, openskyPassword } = ctx.config;
  if (openskyUsername && openskyPassword) {
    return { Authorization: `Basic ${Buffer.from(`${openskyUsername}:${openskyPassword}`).toString("base64")}` };
  }
  return {};
}

async function oskyFetch<T>(url: string, ctx: ToolContext): Promise<T> {
  await limiter.acquire();
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url, { headers: authHeaders(ctx) });
  if (!resp.ok) throw new Error(`OpenSky API error: ${resp.status}`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

function parseState(s: any[]) {
  return {
    icao24: s[0], callsign: (s[1] ?? "").trim(), originCountry: s[2],
    lat: s[6], lng: s[5], altitude_m: s[7] ?? s[13], onGround: s[8],
    velocity_ms: s[9], heading: s[10], verticalRate: s[11], squawk: s[14],
  };
}

function isMilitary(icao24: string): string | null {
  const hex = icao24.toLowerCase();
  for (const m of MILITARY_PREFIXES) {
    if (hex.startsWith(m.prefix)) return m.name;
  }
  return null;
}

const bboxSchema = {
  south: z.number().min(-90).max(90).describe("South latitude of bounding box"),
  west: z.number().min(-180).max(180).describe("West longitude"),
  north: z.number().min(-90).max(90).describe("North latitude"),
  east: z.number().min(-180).max(180).describe("East longitude"),
};

export const aircraftTools: ToolDef[] = [
  {
    name: "aircraft_live",
    description: "Get live aircraft positions within a bounding box including position, altitude, speed, heading, and origin country.",
    schema: bboxSchema,
    async execute(args, ctx) {
      const { south, west, north, east } = args as any;
      const data: any = await oskyFetch(`${API}/states/all?lamin=${south}&lomin=${west}&lamax=${north}&lomax=${east}`, ctx);
      const aircraft = (data.states ?? []).map(parseState);
      return json({ aircraft, count: aircraft.length, timestamp: data.time });
    },
  },
  {
    name: "aircraft_track",
    description: "Track a specific aircraft by ICAO24 hex address — returns flight path waypoints.",
    schema: { icao24: z.string().describe("ICAO24 hex address of aircraft") },
    async execute(args, ctx) {
      const { icao24 } = args as { icao24: string };
      const data: any = await oskyFetch(`${API}/tracks/all?icao24=${icao24.toLowerCase()}&time=0`, ctx);
      const path = (data.path ?? []).map((p: any[]) => ({
        time: new Date(p[0] * 1000).toISOString(), lat: p[1], lng: p[2],
        altitude_m: p[3], heading: p[4], onGround: p[5],
      }));
      return json({ icao24: data.icao24, callsign: data.callsign, startTime: data.startTime, endTime: data.endTime, path });
    },
  },
  {
    name: "aircraft_flights",
    description: "Get flight history for an aircraft over a time period including departure and arrival airports.",
    schema: {
      icao24: z.string().describe("ICAO24 hex address"),
      begin: z.number().optional().describe("Start time as Unix timestamp (default: 7 days ago)"),
      end: z.number().optional().describe("End time as Unix timestamp (default: now)"),
    },
    async execute(args, ctx) {
      const { icao24 } = args as any;
      const end = (args as any).end ?? Math.floor(Date.now() / 1000);
      const begin = (args as any).begin ?? end - 7 * 86400;
      const data: any = await oskyFetch(`${API}/flights/aircraft?icao24=${icao24.toLowerCase()}&begin=${begin}&end=${end}`, ctx);
      const flights = (data ?? []).map((f: any) => ({
        callsign: (f.callsign ?? "").trim(), departureAirport: f.estDepartureAirport,
        arrivalAirport: f.estArrivalAirport, firstSeen: new Date(f.firstSeen * 1000).toISOString(),
        lastSeen: new Date(f.lastSeen * 1000).toISOString(),
      }));
      return json({ icao24, flights, count: flights.length });
    },
  },
  {
    name: "aircraft_waypoints",
    description: "Get flight waypoints for an aircraft with cumulative distance calculation.",
    schema: { icao24: z.string().describe("ICAO24 hex address") },
    async execute(args, ctx) {
      const { icao24 } = args as { icao24: string };
      const data: any = await oskyFetch(`${API}/tracks/all?icao24=${icao24.toLowerCase()}&time=0`, ctx);
      const path = (data.path ?? []).map((p: any[]) => ({ time: new Date(p[0] * 1000).toISOString(), lat: p[1], lng: p[2], altitude_m: p[3], heading: p[4] }));
      let totalDist = 0;
      for (let i = 1; i < path.length; i++) {
        totalDist += haversine(path[i - 1].lat, path[i - 1].lng, path[i].lat, path[i].lng);
      }
      return json({ icao24, waypoints: path, totalDistanceKm: Math.round(totalDist * 100) / 100 });
    },
  },
  {
    name: "aircraft_arrivals",
    description: "Get recent arrivals at an airport by ICAO code.",
    schema: {
      airport: z.string().describe("Airport ICAO code (e.g. 'LTBA' for Istanbul)"),
      begin: z.number().optional().describe("Start time Unix timestamp (default: 2 hours ago)"),
      end: z.number().optional().describe("End time Unix timestamp (default: now)"),
    },
    async execute(args, ctx) {
      const { airport } = args as any;
      const end = (args as any).end ?? Math.floor(Date.now() / 1000);
      const begin = (args as any).begin ?? end - 7200;
      const data: any = await oskyFetch(`${API}/flights/arrival?airport=${airport}&begin=${begin}&end=${end}`, ctx);
      const arrivals = (data ?? []).map((f: any) => ({
        icao24: f.icao24, callsign: (f.callsign ?? "").trim(),
        departureAirport: f.estDepartureAirport,
        firstSeen: new Date(f.firstSeen * 1000).toISOString(),
        lastSeen: new Date(f.lastSeen * 1000).toISOString(),
      }));
      return json({ airport, arrivals, count: arrivals.length });
    },
  },
  {
    name: "aircraft_departures",
    description: "Get recent departures from an airport by ICAO code.",
    schema: {
      airport: z.string().describe("Airport ICAO code (e.g. 'LTBA')"),
      begin: z.number().optional().describe("Start time Unix timestamp (default: 2 hours ago)"),
      end: z.number().optional().describe("End time Unix timestamp (default: now)"),
    },
    async execute(args, ctx) {
      const { airport } = args as any;
      const end = (args as any).end ?? Math.floor(Date.now() / 1000);
      const begin = (args as any).begin ?? end - 7200;
      const data: any = await oskyFetch(`${API}/flights/departure?airport=${airport}&begin=${begin}&end=${end}`, ctx);
      const departures = (data ?? []).map((f: any) => ({
        icao24: f.icao24, callsign: (f.callsign ?? "").trim(),
        arrivalAirport: f.estArrivalAirport,
        firstSeen: new Date(f.firstSeen * 1000).toISOString(),
        lastSeen: new Date(f.lastSeen * 1000).toISOString(),
      }));
      return json({ airport, departures, count: departures.length });
    },
  },
  {
    name: "aircraft_search",
    description: "Search for currently airborne aircraft by callsign (partial match supported).",
    schema: { callsign: z.string().describe("Callsign to search for (case-insensitive, partial match)") },
    async execute(args, ctx) {
      const { callsign } = args as { callsign: string };
      const data: any = await oskyFetch(`${API}/states/all`, ctx);
      const needle = callsign.toUpperCase();
      const matches = (data.states ?? []).map(parseState).filter((a: any) => a.callsign.toUpperCase().includes(needle));
      return json({ callsign, matches, count: matches.length });
    },
  },
  {
    name: "aircraft_military",
    description: "Filter military aircraft in a bounding box by checking ICAO24 hex ranges assigned to military operators.",
    schema: bboxSchema,
    async execute(args, ctx) {
      const { south, west, north, east } = args as any;
      const data: any = await oskyFetch(`${API}/states/all?lamin=${south}&lomin=${west}&lamax=${north}&lomax=${east}`, ctx);
      const all = (data.states ?? []).map(parseState);
      const military = all.filter((a: any) => isMilitary(a.icao24) || !a.callsign).map((a: any) => ({
        ...a, possibleAffiliation: isMilitary(a.icao24) ?? "Unknown (no callsign)",
      }));
      return json({ militaryAircraft: military, count: military.length, bbox: { south, west, north, east } });
    },
  },
  {
    name: "aircraft_stats",
    description: "Traffic statistics for a bounding box — total aircraft, altitude distribution, speed distribution, top countries.",
    schema: bboxSchema,
    async execute(args, ctx) {
      const { south, west, north, east } = args as any;
      const data: any = await oskyFetch(`${API}/states/all?lamin=${south}&lomin=${west}&lamax=${north}&lomax=${east}`, ctx);
      const all = (data.states ?? []).map(parseState);
      const airborne = all.filter((a: any) => !a.onGround);
      const altDist = { low: 0, medium: 0, high: 0 };
      const countries: Record<string, number> = {};
      let totalAlt = 0, totalVel = 0;
      for (const a of airborne) {
        const alt = a.altitude_m ?? 0;
        if (alt < 1000) altDist.low++;
        else if (alt < 10000) altDist.medium++;
        else altDist.high++;
        totalAlt += alt;
        totalVel += a.velocity_ms ?? 0;
        countries[a.originCountry] = (countries[a.originCountry] ?? 0) + 1;
      }
      const topCountries = Object.entries(countries).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([country, count]) => ({ country, count }));
      return json({
        totalAircraft: all.length, airborne: airborne.length, onGround: all.length - airborne.length,
        altitudeDistribution: altDist, topCountries,
        avgAltitude_m: airborne.length > 0 ? Math.round(totalAlt / airborne.length) : 0,
        avgVelocity_ms: airborne.length > 0 ? Math.round(totalVel / airborne.length) : 0,
      });
    },
  },
  {
    name: "aircraft_anomaly",
    description: "Detect anomalous aircraft behavior in a bounding box — low altitude flights, loitering, emergency squawks, no callsign.",
    schema: bboxSchema,
    async execute(args, ctx) {
      const { south, west, north, east } = args as any;
      const data: any = await oskyFetch(`${API}/states/all?lamin=${south}&lomin=${west}&lamax=${north}&lomax=${east}`, ctx);
      const all = (data.states ?? []).map(parseState);
      const anomalies: any[] = [];
      for (const a of all) {
        if (!a.onGround && a.altitude_m !== null && a.altitude_m < 300) {
          anomalies.push({ ...a, type: "LOW_ALTITUDE", detail: `Aircraft at ${a.altitude_m}m — possible surveillance or crop dusting` });
        }
        if (!a.onGround && a.velocity_ms !== null && a.velocity_ms < 28 && a.altitude_m > 500) {
          anomalies.push({ ...a, type: "SLOW_SPEED", detail: `Aircraft moving at ${Math.round(a.velocity_ms * 3.6)} km/h at altitude — possible loitering` });
        }
        if (a.squawk === "7500") anomalies.push({ ...a, type: "SQUAWK_HIJACK", detail: "Squawk 7500 — hijack code" });
        if (a.squawk === "7600") anomalies.push({ ...a, type: "SQUAWK_COMM_FAILURE", detail: "Squawk 7600 — communications failure" });
        if (a.squawk === "7700") anomalies.push({ ...a, type: "SQUAWK_EMERGENCY", detail: "Squawk 7700 — general emergency" });
        if (!a.callsign && !a.onGround) anomalies.push({ ...a, type: "NO_CALLSIGN", detail: "Airborne aircraft with no callsign — possible military/classified" });
        if (a.verticalRate !== null && Math.abs(a.verticalRate) > 30) {
          anomalies.push({ ...a, type: "EXTREME_VERTICAL_RATE", detail: `Vertical rate ${a.verticalRate} m/s — unusual` });
        }
      }
      return json({ anomalies, count: anomalies.length, totalAircraft: all.length, bbox: { south, west, north, east } });
    },
  },
];
