// Cyber-Geo Intelligence — OONI, IODA, ip-api, PeeringDB (free, no auth)
// Tools: cyber_ip_locate, cyber_censorship, cyber_outage, cyber_cable_landing, cyber_ix_points, cyber_connectivity

import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(700);
const cache = new TTLCache<unknown>(60 * 60 * 1000);

async function cachedFetch<T>(url: string): Promise<T> {
  await limiter.acquire();
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`API error: ${resp.status} from ${new URL(url).hostname}`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

export const cyberTools: ToolDef[] = [
  {
    name: "cyber_ip_locate",
    description: "Geolocate an IP address — country, city, ISP, coordinates, timezone.",
    schema: { ip: z.string().describe("IPv4 or IPv6 address to geolocate") },
    async execute(args) {
      const { ip } = args as { ip: string };
      const data: any = await cachedFetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
      if (data.status === "fail") throw new Error(data.message ?? "IP lookup failed");
      return json({ ip: data.query, country: data.country, countryCode: data.countryCode, region: data.regionName, city: data.city, lat: data.lat, lng: data.lon, timezone: data.timezone, isp: data.isp, org: data.org, asn: data.as });
    },
  },
  {
    name: "cyber_censorship",
    description: "Detect internet censorship in a country using OONI measurements — lists blocked websites and censorship methods.",
    schema: {
      country_code: z.string().min(2).max(2).describe("2-letter ISO country code (e.g. 'IR', 'CN', 'TR')"),
      limit: z.number().int().min(1).max(100).default(20).describe("Maximum measurements to return"),
    },
    async execute(args) {
      const { country_code, limit } = args as any;
      const data: any = await cachedFetch(`https://api.ooni.io/api/v1/measurements?probe_cc=${country_code.toUpperCase()}&test_name=web_connectivity&limit=${limit}&order_by=measurement_start_time&order=desc`);
      const measurements = (data.results ?? []).map((m: any) => ({
        url: m.input, date: m.measurement_start_time, blocking: m.scores?.analysis?.blocking ?? m.anomaly, confirmed: m.confirmed,
      }));
      const blocked = measurements.filter((m: any) => m.confirmed || m.blocking);
      return json({ country: country_code, measurements, blockedCount: blocked.length, testedCount: measurements.length });
    },
  },
  {
    name: "cyber_outage",
    description: "Detect internet outages in a country using IODA (Internet Outage Detection and Analysis).",
    schema: { country: z.string().describe("2-letter ISO country code") },
    async execute(args) {
      const { country } = args as { country: string };
      const now = Math.floor(Date.now() / 1000);
      const from = now - 86400;
      try {
        const data: any = await cachedFetch(`https://api.ioda.inetintel.cc.gatech.edu/v2/signals/raw/country/${country.toUpperCase()}?from=${from}&until=${now}`);
        return json({ country, data: data.data ?? data, period: "last_24h", source: "IODA" });
      } catch {
        return json({ country, note: "IODA API may be unavailable. Check https://ioda.inetintel.cc.gatech.edu/ for live outage data.", source: "IODA" });
      }
    },
  },
  {
    name: "cyber_cable_landing",
    description: "Find submarine cable landing points near a coordinate using OpenStreetMap data.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
      radius_km: z.number().min(1).max(500).default(100).describe("Search radius in km"),
    },
    async execute(args) {
      const { lat, lng, radius_km } = args as any;
      const radius_m = radius_km * 1000;
      const resp = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `data=${encodeURIComponent(`[out:json][timeout:15];node["man_made"="submarine_cable_landing"](around:${radius_m},${lat},${lng});out qt 50;`)}`,
      });
      if (!resp.ok) throw new Error(`Overpass error: ${resp.status}`);
      const data: any = await resp.json();
      const landings = (data.elements ?? []).map((e: any) => ({
        name: e.tags?.name, operator: e.tags?.operator, lat: e.lat, lng: e.lon,
      }));
      return json({ nearestLandings: landings, count: landings.length, center: { lat, lng }, radius_km });
    },
  },
  {
    name: "cyber_ix_points",
    description: "Find Internet Exchange Points (IXPs) in a country using PeeringDB.",
    schema: { country: z.string().min(2).max(2).describe("2-letter ISO country code") },
    async execute(args) {
      const { country } = args as { country: string };
      const data: any = await cachedFetch(`https://www.peeringdb.com/api/ix?country=${country.toUpperCase()}`);
      const ixps = (data.data ?? []).map((ix: any) => ({
        name: ix.name, city: ix.city, website: ix.website, participants: ix.net_count,
      }));
      return json({ country, ixps, count: ixps.length, source: "PeeringDB" });
    },
  },
  {
    name: "cyber_connectivity",
    description: "Country internet connectivity overview — IXP count, cable landings, and assessment.",
    schema: { country_code: z.string().min(2).max(2).describe("2-letter ISO country code") },
    async execute(args) {
      const { country_code } = args as { country_code: string };
      const cc = country_code.toUpperCase();
      let ixCount = 0;
      try {
        const data: any = await cachedFetch(`https://www.peeringdb.com/api/ix?country=${cc}`);
        ixCount = (data.data ?? []).length;
      } catch { /* skip */ }
      const assessment = ixCount >= 10 ? "Well-connected" : ixCount >= 3 ? "Moderately connected" : ixCount >= 1 ? "Limited connectivity" : "Very limited or no IXP presence";
      return json({ country: cc, ixCount, assessment, source: "PeeringDB" });
    },
  },
];
