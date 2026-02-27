import { WEATHER_HUBS, type WeatherHub } from "@/lib/map-overlays"

const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"
const WEATHER_REFRESH_MS = 10 * 60 * 1000
const DEFAULT_MAX_STATIONS = 20

export interface LiveWeatherStation {
  id: string
  name: string
  country: string
  region: string
  lat: number
  lng: number
  temperatureC: number | null
  windKmh: number | null
  windDirDeg: number | null
  humidityPct: number | null
  weatherCode: number | null
  weatherText: string
  isDay: boolean | null
  observedAt: string | null
}

export interface WeatherSnapshot {
  source: "Open-Meteo"
  asOf: string | null
  total: number
  pollIntervalSeconds: number
  message: string
  stations: LiveWeatherStation[]
  stale: boolean
  error: string | null
}

interface WeatherCache {
  fetchedAt: number
  asOf: string | null
  message: string
  stations: LiveWeatherStation[]
  error: string | null
}

const globalForWeather = globalThis as typeof globalThis & {
  __weatherCache?: WeatherCache
}

function getCache(): WeatherCache {
  if (!globalForWeather.__weatherCache) {
    globalForWeather.__weatherCache = {
      fetchedAt: 0,
      asOf: null,
      message: "Weather feed initializing...",
      stations: [],
      error: null,
    }
  }
  return globalForWeather.__weatherCache
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function asNumber(value: unknown): number | null {
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

function weatherCodeToText(code: number | null): string {
  if (code === null) return "Unknown"

  const MAP: Record<number, string> = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Light drizzle",
    53: "Drizzle",
    55: "Dense drizzle",
    56: "Freezing drizzle",
    57: "Freezing drizzle",
    61: "Light rain",
    63: "Rain",
    65: "Heavy rain",
    66: "Freezing rain",
    67: "Freezing rain",
    71: "Light snow",
    73: "Snow",
    75: "Heavy snow",
    77: "Snow grains",
    80: "Rain showers",
    81: "Rain showers",
    82: "Violent showers",
    85: "Snow showers",
    86: "Snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm + hail",
    99: "Thunderstorm + heavy hail",
  }

  return MAP[code] ?? `Code ${code}`
}

async function fetchHubWeather(hub: WeatherHub): Promise<LiveWeatherStation | null> {
  const url = new URL(OPEN_METEO_URL)
  url.searchParams.set("latitude", String(hub.lat))
  url.searchParams.set("longitude", String(hub.lng))
  url.searchParams.set(
    "current",
    [
      "temperature_2m",
      "relative_humidity_2m",
      "wind_speed_10m",
      "wind_direction_10m",
      "weather_code",
      "is_day",
    ].join(",")
  )
  url.searchParams.set("timezone", "auto")

  const response = await fetch(url.toString(), { cache: "no-store" })
  if (!response.ok) {
    throw new Error(`Open-Meteo request failed (${response.status})`)
  }

  const json = (await response.json()) as {
    current?: Record<string, unknown>
  }

  const current = json.current
  if (!current) return null

  const weatherCode = asNumber(current.weather_code)
  const isDayRaw = asNumber(current.is_day)

  return {
    id: hub.id,
    name: hub.name,
    country: hub.country,
    region: hub.region,
    lat: hub.lat,
    lng: hub.lng,
    temperatureC: asNumber(current.temperature_2m),
    windKmh: asNumber(current.wind_speed_10m),
    windDirDeg: asNumber(current.wind_direction_10m),
    humidityPct: asNumber(current.relative_humidity_2m),
    weatherCode,
    weatherText: weatherCodeToText(weatherCode),
    isDay: isDayRaw === null ? null : isDayRaw >= 1,
    observedAt: typeof current.time === "string" ? current.time : null,
  }
}

async function refreshWeather(cache: WeatherCache) {
  const results = await Promise.allSettled(WEATHER_HUBS.map((hub) => fetchHubWeather(hub)))

  const stations: LiveWeatherStation[] = []
  const failures: string[] = []
  for (const result of results) {
    if (result.status === "fulfilled") {
      if (result.value) stations.push(result.value)
      continue
    }
    failures.push(result.reason instanceof Error ? result.reason.message : "Weather station failed.")
  }

  stations.sort((a, b) => {
    const aWind = a.windKmh ?? 0
    const bWind = b.windKmh ?? 0
    return bWind - aWind
  })

  cache.fetchedAt = Date.now()
  cache.asOf = new Date(cache.fetchedAt).toISOString()
  cache.stations = stations
  cache.message = `Weather updates for ${stations.length}/${WEATHER_HUBS.length} hubs.`
  cache.error = failures.length > 0 ? failures[0] : null
}

function sampleEvenly<T>(items: T[], maxItems: number): T[] {
  if (items.length <= maxItems) return items
  if (maxItems <= 0) return []

  const step = items.length / maxItems
  const out: T[] = []
  for (let i = 0; i < maxItems; i += 1) {
    out.push(items[Math.floor(i * step)])
  }
  return out
}

export async function getWeatherSnapshot(maxStations = DEFAULT_MAX_STATIONS): Promise<WeatherSnapshot> {
  const cache = getCache()
  const requestedMax = clamp(Math.trunc(maxStations) || DEFAULT_MAX_STATIONS, 4, WEATHER_HUBS.length)

  const shouldRefresh = cache.fetchedAt === 0 || Date.now() - cache.fetchedAt >= WEATHER_REFRESH_MS
  let stale = shouldRefresh

  if (shouldRefresh) {
    try {
      await refreshWeather(cache)
      stale = false
    } catch (err) {
      cache.error = err instanceof Error ? err.message : "Weather refresh failed."
      stale = true
    }
  }

  return {
    source: "Open-Meteo",
    asOf: cache.asOf,
    total: cache.stations.length,
    pollIntervalSeconds: Math.floor(WEATHER_REFRESH_MS / 1000),
    message: cache.message,
    stations: sampleEvenly(cache.stations, requestedMax),
    stale,
    error: cache.error,
  }
}
