// Weather & Atmosphere — Open-Meteo API (free, no auth)
// Tools: weather_current, weather_forecast, weather_historical, weather_satellite_window, atmosphere_air_quality, atmosphere_uv

import { z } from "zod";
import type { ToolDef } from "../types/index.js";
import { json } from "../types/index.js";
import { RateLimiter } from "../utils/rate-limiter.js";
import { TTLCache } from "../utils/cache.js";

const limiter = new RateLimiter(500);
const cache = new TTLCache<unknown>(10 * 60 * 1000);

async function meteoFetch<T>(url: string): Promise<T> {
  await limiter.acquire();
  const cached = cache.get(url);
  if (cached) return cached as T;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Open-Meteo API error: ${resp.status} ${resp.statusText}`);
  const data = await resp.json();
  cache.set(url, data);
  return data as T;
}

export const weatherTools: ToolDef[] = [
  {
    name: "weather_current",
    description: "Get current weather conditions at a coordinate including temperature, humidity, wind, pressure, cloud cover, and precipitation.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
    },
    async execute(args) {
      const { lat, lng } = args as { lat: number; lng: number };
      const data: any = await meteoFetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,surface_pressure,cloud_cover,precipitation&timezone=auto`,
      );
      const c = data.current;
      return json({
        temperature_c: c.temperature_2m,
        humidity_pct: c.relative_humidity_2m,
        wind_speed_kmh: c.wind_speed_10m,
        wind_direction_deg: c.wind_direction_10m,
        pressure_hpa: c.surface_pressure,
        cloud_cover_pct: c.cloud_cover,
        precipitation_mm: c.precipitation,
        timezone: data.timezone,
        location: { lat, lng },
      });
    },
  },
  {
    name: "weather_forecast",
    description: "Get 7-day weather forecast for a coordinate with daily temperature, precipitation, wind, sunrise, and sunset.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
    },
    async execute(args) {
      const { lat, lng } = args as { lat: number; lng: number };
      const data: any = await meteoFetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,sunrise,sunset&timezone=auto`,
      );
      const d = data.daily;
      const days = d.time.map((date: string, i: number) => ({
        date,
        temp_max_c: d.temperature_2m_max[i],
        temp_min_c: d.temperature_2m_min[i],
        precipitation_mm: d.precipitation_sum[i],
        wind_max_kmh: d.wind_speed_10m_max[i],
        sunrise: d.sunrise[i],
        sunset: d.sunset[i],
      }));
      return json({ daily: days, location: { lat, lng }, timezone: data.timezone });
    },
  },
  {
    name: "weather_historical",
    description: "Get historical weather data for a specific date and location.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
      date: z.string().describe("Date in YYYY-MM-DD format"),
    },
    async execute(args) {
      const { lat, lng, date } = args as { lat: number; lng: number; date: string };
      const data: any = await meteoFetch(
        `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lng}&start_date=${date}&end_date=${date}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`,
      );
      const d = data.daily;
      return json({
        date,
        temp_max_c: d.temperature_2m_max?.[0],
        temp_min_c: d.temperature_2m_min?.[0],
        precipitation_mm: d.precipitation_sum?.[0],
        wind_max_kmh: d.wind_speed_10m_max?.[0],
        location: { lat, lng },
      });
    },
  },
  {
    name: "weather_satellite_window",
    description: "Find optimal satellite imaging windows (low cloud cover periods) for a location over the next N days.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
      days: z.number().int().min(1).max(16).default(7).describe("Forecast days (1-16)"),
    },
    async execute(args) {
      const { lat, lng, days } = args as { lat: number; lng: number; days: number };
      const data: any = await meteoFetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=cloud_cover&forecast_days=${days}&timezone=auto`,
      );
      const hours = data.hourly;
      const windows: { start: string; end: string; avgCloudCover: number }[] = [];
      let windowStart: number | null = null;
      let windowSum = 0;
      let windowCount = 0;

      for (let i = 0; i < hours.time.length; i++) {
        const cc = hours.cloud_cover[i];
        if (cc < 20) {
          if (windowStart === null) windowStart = i;
          windowSum += cc;
          windowCount++;
        } else {
          if (windowStart !== null && windowCount >= 2) {
            windows.push({
              start: hours.time[windowStart],
              end: hours.time[i - 1],
              avgCloudCover: Math.round((windowSum / windowCount) * 10) / 10,
            });
          }
          windowStart = null;
          windowSum = 0;
          windowCount = 0;
        }
      }
      if (windowStart !== null && windowCount >= 2) {
        windows.push({
          start: hours.time[windowStart],
          end: hours.time[hours.time.length - 1],
          avgCloudCover: Math.round((windowSum / windowCount) * 10) / 10,
        });
      }

      const totalClearHours = hours.cloud_cover.filter((c: number) => c < 20).length;
      return json({
        windows,
        totalClearHours,
        totalHours: hours.time.length,
        recommendation: windows.length > 0
          ? `${windows.length} clear window(s) found. Best: ${windows[0].start}`
          : "No suitable imaging windows found in forecast period.",
        location: { lat, lng },
      });
    },
  },
  {
    name: "atmosphere_air_quality",
    description: "Get current air quality index and pollutant concentrations (PM2.5, PM10, NO2, SO2, CO, Ozone) at a coordinate.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
    },
    async execute(args) {
      const { lat, lng } = args as { lat: number; lng: number };
      const data: any = await meteoFetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lng}&current=european_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone`,
      );
      const c = data.current;
      const aqi = c.european_aqi ?? 0;
      const category = aqi <= 25 ? "Good" : aqi <= 50 ? "Fair" : aqi <= 75 ? "Moderate" : aqi <= 100 ? "Poor" : "Very Poor";
      return json({
        aqi,
        category,
        pm25: c.pm2_5,
        pm10: c.pm10,
        no2: c.nitrogen_dioxide,
        so2: c.sulphur_dioxide,
        co: c.carbon_monoxide,
        ozone: c.ozone,
        location: { lat, lng },
      });
    },
  },
  {
    name: "atmosphere_uv",
    description: "Get current UV index at a coordinate with risk classification.",
    schema: {
      lat: z.number().min(-90).max(90).describe("Latitude"),
      lng: z.number().min(-180).max(180).describe("Longitude"),
    },
    async execute(args) {
      const { lat, lng } = args as { lat: number; lng: number };
      const data: any = await meteoFetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=uv_index,uv_index_clear_sky`,
      );
      const uv = data.current.uv_index ?? 0;
      const uvClear = data.current.uv_index_clear_sky ?? 0;
      const risk = uv < 3 ? "Low" : uv < 6 ? "Moderate" : uv < 8 ? "High" : uv < 11 ? "Very High" : "Extreme";
      return json({ uvIndex: uv, uvIndexClearSky: uvClear, risk, location: { lat, lng } });
    },
  },
];
