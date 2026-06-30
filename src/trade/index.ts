// Trade Intelligence — UN Comtrade API
// Tools: trade_flow, trade_partners, trade_commodity, trade_timeseries, trade_balance

import { z } from "zod";
import type { ToolDef, ToolContext } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(1000);
const cache = new TTLCache<unknown>(60 * 60 * 1000);

const API = "https://comtradeapi.un.org/data/v1/get/C/A";

async function comtradeFetch<T>(params: Record<string, string>, ctx: ToolContext): Promise<T> {
  await limiter.acquire();
  const qs = new URLSearchParams(params);
  if (ctx.config.comtradeApiKey) qs.set("subscription-key", ctx.config.comtradeApiKey);
  const url = `${API}?${qs}`;
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`UN Comtrade API error: ${resp.status}. API key optional but recommended — set COMTRADE_API_KEY.`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

export const tradeTools: ToolDef[] = [
  {
    name: "trade_flow",
    description: "Get bilateral trade data between two countries — import/export values by commodity.",
    schema: {
      reporter: z.string().describe("Reporter country ISO 3-letter code (e.g. 'TUR')"),
      partner: z.string().describe("Partner country ISO 3-letter code (e.g. 'DEU')"),
      year: z.number().int().describe("Year (e.g. 2023)"),
      flow: z.enum(["M", "X"]).default("X").describe("Trade flow: M=imports, X=exports"),
    },
    async execute(args, ctx) {
      const { reporter, partner, year, flow } = args as any;
      const data: any = await comtradeFetch({ reporterCode: reporter, partnerCode: partner, period: String(year), flowCode: flow, cmdCode: "TOTAL" }, ctx);
      return json({ reporter, partner, year, flow: flow === "X" ? "exports" : "imports", data: data.data ?? data, source: "UN Comtrade" });
    },
  },
  {
    name: "trade_partners",
    description: "Get top trade partners for a country.",
    schema: {
      country: z.string().describe("Country ISO 3-letter code"),
      year: z.number().int().describe("Year"),
      flow: z.enum(["M", "X"]).default("X").describe("M=imports, X=exports"),
    },
    async execute(args, ctx) {
      const { country, year, flow } = args as any;
      const data: any = await comtradeFetch({ reporterCode: country, partnerCode: "0", period: String(year), flowCode: flow, cmdCode: "TOTAL" }, ctx);
      const records = (data.data ?? []).sort((a: any, b: any) => (b.primaryValue ?? 0) - (a.primaryValue ?? 0));
      return json({ country, year, flow: flow === "X" ? "exports" : "imports", partners: records.slice(0, 20), source: "UN Comtrade" });
    },
  },
  {
    name: "trade_commodity",
    description: "Get global trade data for a specific commodity (HS code).",
    schema: {
      commodity: z.string().describe("HS commodity code (e.g. '2709' for crude petroleum, '1001' for wheat, '9301' for military weapons)"),
      reporter: z.string().default("0").describe("Reporter country code (0=world)"),
      year: z.number().int().describe("Year"),
    },
    async execute(args, ctx) {
      const { commodity, reporter, year } = args as any;
      const data: any = await comtradeFetch({ reporterCode: reporter, partnerCode: "0", period: String(year), flowCode: "X", cmdCode: commodity }, ctx);
      return json({ commodity, reporter, year, data: data.data ?? data, source: "UN Comtrade" });
    },
  },
  {
    name: "trade_timeseries",
    description: "Get trade volume time series for a country pair over multiple years.",
    schema: {
      reporter: z.string().describe("Reporter country ISO 3-letter code"),
      partner: z.string().describe("Partner country code"),
      start_year: z.number().int().describe("Start year"),
      end_year: z.number().int().describe("End year"),
    },
    async execute(args, ctx) {
      const { reporter, partner, start_year, end_year } = args as any;
      const years = [];
      for (let y = start_year; y <= end_year; y++) years.push(String(y));
      const data: any = await comtradeFetch({ reporterCode: reporter, partnerCode: partner, period: years.join(","), flowCode: "X", cmdCode: "TOTAL" }, ctx);
      return json({ reporter, partner, period: `${start_year}-${end_year}`, data: data.data ?? data, source: "UN Comtrade" });
    },
  },
  {
    name: "trade_balance",
    description: "Calculate trade balance between two countries — exports minus imports.",
    schema: {
      country: z.string().describe("Country ISO 3-letter code"),
      partner: z.string().describe("Partner country code"),
      year: z.number().int().describe("Year"),
    },
    async execute(args, ctx) {
      const { country, partner, year } = args as any;
      const [exports, imports]: any[] = await Promise.all([
        comtradeFetch({ reporterCode: country, partnerCode: partner, period: String(year), flowCode: "X", cmdCode: "TOTAL" }, ctx),
        comtradeFetch({ reporterCode: country, partnerCode: partner, period: String(year), flowCode: "M", cmdCode: "TOTAL" }, ctx),
      ]);
      const expVal = (exports.data ?? [])[0]?.primaryValue ?? 0;
      const impVal = (imports.data ?? [])[0]?.primaryValue ?? 0;
      return json({
        country, partner, year, exports_usd: expVal, imports_usd: impVal,
        balance_usd: expVal - impVal, surplus: expVal > impVal, source: "UN Comtrade",
      });
    },
  },
];
