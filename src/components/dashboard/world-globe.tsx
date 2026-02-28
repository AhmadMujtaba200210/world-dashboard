"use client"

import { type ElementType, memo, useCallback, useEffect, useMemo, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useCountry, COUNTRY_DATA } from "@/context/country-context"
import type { GlobeMethods } from "react-globe.gl"
import {
  TRADE_ROUTES,
  PLANE_ROUTES,
  NUCLEAR_SITES,
  MILITARY_BASES,
  type GlobeArc,
  type GlobePoint,
} from "@/lib/globe-layers"
import {
  MAJOR_CITIES,
  WATER_BODY_LABELS,
  STRATEGIC_ROUTES,
  type StrategicRoute,
} from "@/lib/map-overlays"
import {
  Shield,
  Anchor,
  Plane,
  Radio,
  Eye,
  EyeOff,
  MapPin,
  Building2,
  Waves,
  Route as RouteIcon,
  CloudSun,
  Flame,
} from "lucide-react"

const Globe = dynamic(() => import("react-globe.gl").then((mod) => mod.default), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse bg-slate-900 w-full h-full flex items-center justify-center rounded-xl text-muted-foreground text-sm">
      Initializing Earth...
    </div>
  ),
})

interface LiveAircraft {
  id: string
  icao24: string
  callsign: string
  originCountry: string
  lat: number
  lng: number
  velocityKts: number | null
  altitudeFt: number | null
  headingDeg: number | null
  onGround: boolean
}

interface AircraftFeedResponse {
  usingAuth: boolean
  asOf: string | null
  aircraft: LiveAircraft[]
  message: string
  error: string | null
  stale: boolean
}

interface LiveVessel {
  id: string
  mmsi: string
  name: string
  shipType: string
  navStatus: string
  lat: number
  lng: number
  sogKnots: number | null
  cogDeg: number | null
  headingDeg: number | null
}

interface VesselFeedResponse {
  connected: boolean
  connecting: boolean
  asOf: string | null
  vessels: LiveVessel[]
  message: string
  error: string | null
  stale: boolean
}

interface LiveWeatherStation {
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

interface WeatherFeedResponse {
  asOf: string | null
  stations: LiveWeatherStation[]
  message: string
  error: string | null
  stale: boolean
}

interface HtmlMarker {
  id: string
  kind: "ship" | "aircraft" | "weather"
  lat: number
  lng: number
  altitude: number
  name: string
  color: string
  rotationDeg: number
  infoTop: string
  infoMid: string
  infoBottom: string
  badgeText?: string
}

interface MapLabel {
  id: string
  text: string
  lat: number
  lng: number
  altitude: number
  color: string
  size: number
  dotRadius: number
  details: string
  category: "country" | "city" | "water"
}

interface StrategicArc {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
  name: string
  color: string
  type: "route"
  details: string
  category: StrategicRoute["type"]
}

interface WeatherHeatPoint {
  lat: number
  lng: number
  weight: number
}

interface WeatherHeatLayer {
  id: string
  points: WeatherHeatPoint[]
}

type RenderPoint = GlobePoint

type LiveStatus = "live" | "pending" | "warn" | "static"

interface CountryFeature {
  properties: {
    ISO_A3?: string
    ADMIN?: string
    LABELRANK?: number | string
    [key: string]: unknown
  }
  geometry?: {
    type?: string
    coordinates?: unknown
  }
}

interface CountryCollection {
  features: CountryFeature[]
}

const AIRCRAFT_REFRESH_MS = 30_000
const VESSELS_REFRESH_MS = 8_000
const WEATHER_REFRESH_MS = 9 * 60 * 1000

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function toClock(isoTime: string | null): string {
  if (!isoTime) return "n/a"
  const d = new Date(isoTime)
  if (Number.isNaN(d.getTime())) return "n/a"
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  })
}

function formatBearing(deg: number | null): string {
  if (deg === null || !Number.isFinite(deg)) return "n/a"
  const normalized = ((Math.round(deg) % 360) + 360) % 360
  return `${normalized}°`
}

function formatKnots(knots: number | null): string {
  if (knots === null || !Number.isFinite(knots)) return "n/a"
  return `${knots.toFixed(1)} kn`
}

function formatFeet(feet: number | null): string {
  if (feet === null || !Number.isFinite(feet)) return "n/a"
  return `${Math.round(feet).toLocaleString()} ft`
}

function formatTempC(tempC: number | null): string {
  if (tempC === null || !Number.isFinite(tempC)) return "n/a"
  return `${tempC.toFixed(1)}°C`
}

function weatherEmoji(code: number | null, isDay: boolean | null): string {
  if (code === null) return "❓"
  if (code === 0) return isDay ? "☀️" : "🌙"
  if (code === 1 || code === 2) return "⛅"
  if (code === 3 || code === 45 || code === 48) return "☁️"
  if (code >= 51 && code <= 57) return "🌦️"
  if (code >= 61 && code <= 67) return "🌧️"
  if (code >= 71 && code <= 77) return "🌨️"
  if (code >= 80 && code <= 86) return "🌧️"
  if (code >= 95) return "⛈️"
  return "🌡️"
}

function weatherSeverity(code: number | null): number {
  if (code === null) return 0.15
  if (code >= 95) return 1
  if (code >= 80) return 0.75
  if (code >= 61) return 0.6
  if (code >= 51) return 0.45
  if (code >= 45) return 0.25
  if (code >= 1) return 0.2
  return 0.1
}

function makeTooltipLine(text: string, color: string): HTMLDivElement {
  const line = document.createElement("div")
  line.textContent = text
  line.style.fontSize = "10px"
  line.style.color = color
  line.style.lineHeight = "1.25"
  return line
}

function addPointerIsolation(root: HTMLElement) {
  const stopPropagation = (event: Event) => {
    event.stopPropagation()
  }

  root.addEventListener("pointerdown", stopPropagation)
  root.addEventListener("pointerup", stopPropagation)
  root.addEventListener("click", stopPropagation)
  root.addEventListener("dblclick", stopPropagation)
  root.addEventListener("mousemove", stopPropagation)
  root.addEventListener("wheel", stopPropagation)
  root.addEventListener("contextmenu", stopPropagation)
}

function createHtmlMarkerElement(
  marker: HtmlMarker,
  onHoverStart: (markerId: string) => void,
  onHoverEnd: (markerId: string) => void
): HTMLElement {
  const root = document.createElement("div")
  root.style.position = "relative"
  root.style.width = marker.kind === "weather" ? "40px" : "32px"
  root.style.height = marker.kind === "weather" ? "28px" : "32px"
  root.style.transform = "translate(-50%, -50%)"
  root.style.pointerEvents = "auto"
  root.style.userSelect = "none"
  root.style.cursor = "pointer"
  root.dataset.globeMarker = "1"
  root.dataset.markerId = marker.id

  if (marker.kind === "weather") {
    const badge = document.createElement("div")
    badge.style.position = "absolute"
    badge.style.inset = "0"
    badge.style.borderRadius = "8px"
    badge.style.background = "rgba(2,6,23,0.9)"
    badge.style.border = `1px solid ${marker.color}`
    badge.style.display = "flex"
    badge.style.alignItems = "center"
    badge.style.justifyContent = "center"
    badge.style.fontSize = "11px"
    badge.style.fontWeight = "700"
    badge.style.color = "#e2e8f0"
    badge.style.boxShadow = `0 0 12px ${marker.color}55`
    badge.textContent = marker.badgeText ?? "Wx"
    root.appendChild(badge)
  } else {
    const halo = document.createElement("div")
    halo.style.position = "absolute"
    halo.style.inset = "0"
    halo.style.borderRadius = "9999px"
    halo.style.background = `${marker.color}1a`
    halo.style.boxShadow = `0 0 20px ${marker.color}80`
    root.appendChild(halo)

    const chip = document.createElement("div")
    chip.style.position = "absolute"
    chip.style.inset = "5px"
    chip.style.borderRadius = "9999px"
    chip.style.background = "rgba(2, 6, 23, 0.9)"
    chip.style.border = `1px solid ${marker.color}`
    chip.style.display = "flex"
    chip.style.alignItems = "center"
    chip.style.justifyContent = "center"
    chip.style.boxShadow = `0 0 12px ${marker.color}55`
    root.appendChild(chip)

    const iconWrap = document.createElement("div")
    iconWrap.style.width = "15px"
    iconWrap.style.height = "15px"
    iconWrap.style.transform = `rotate(${marker.rotationDeg}deg)`
    iconWrap.style.transformOrigin = "center"
    chip.appendChild(iconWrap)

    const icon = document.createElement("img")
    icon.src = marker.kind === "aircraft" ? "/icons/live-aircraft.svg" : "/icons/live-vessel.svg"
    icon.alt = marker.kind
    icon.draggable = false
    icon.style.width = "15px"
    icon.style.height = "15px"
    icon.style.display = "block"
    iconWrap.appendChild(icon)
  }

  const tooltip = document.createElement("div")
  tooltip.style.position = "absolute"
  tooltip.style.left = "50%"
  tooltip.style.bottom = "130%"
  tooltip.style.transform = "translateX(-50%) translateY(6px)"
  tooltip.style.opacity = "0"
  tooltip.style.transition = "opacity 140ms ease, transform 140ms ease"
  tooltip.style.pointerEvents = "none"
  tooltip.style.minWidth = "220px"
  tooltip.style.maxWidth = "250px"
  tooltip.style.padding = "8px 10px"
  tooltip.style.borderRadius = "10px"
  tooltip.style.border = `1px solid ${marker.color}`
  tooltip.style.background = "rgba(2, 6, 23, 0.92)"
  tooltip.style.backdropFilter = "blur(8px)"
  tooltip.style.boxShadow = "0 10px 24px rgba(0, 0, 0, 0.45)"

  const title = document.createElement("div")
  title.textContent = marker.name
  title.style.fontWeight = "700"
  title.style.fontSize = "12px"
  title.style.color = marker.color
  title.style.marginBottom = "4px"
  tooltip.appendChild(title)
  tooltip.appendChild(makeTooltipLine(marker.infoTop, "#cbd5e1"))
  tooltip.appendChild(makeTooltipLine(marker.infoMid, "#94a3b8"))
  tooltip.appendChild(makeTooltipLine(marker.infoBottom, "#64748b"))
  root.appendChild(tooltip)

  const showTooltip = () => {
    onHoverStart(marker.id)
    tooltip.style.opacity = "1"
    tooltip.style.transform = "translateX(-50%) translateY(0)"
  }
  const hideTooltip = () => {
    onHoverEnd(marker.id)
    tooltip.style.opacity = "0"
    tooltip.style.transform = "translateX(-50%) translateY(6px)"
  }

  root.addEventListener("mouseenter", showTooltip)
  root.addEventListener("mouseleave", hideTooltip)
  addPointerIsolation(root)

  root.title = `${marker.name} | ${marker.infoTop} | ${marker.infoMid}`
  return root
}

function collectLngLatPairs(value: unknown, out: Array<[number, number]>) {
  if (!Array.isArray(value)) return

  if (value.length >= 2 && typeof value[0] === "number" && typeof value[1] === "number") {
    out.push([value[0], value[1]])
    return
  }

  for (const child of value) {
    collectLngLatPairs(child, out)
  }
}

function getFeatureCenter(feature: CountryFeature): { lat: number; lng: number } | null {
  const coords: Array<[number, number]> = []
  collectLngLatPairs(feature.geometry?.coordinates, coords)
  if (coords.length === 0) return null

  let minLat = 90
  let maxLat = -90
  let minLng = 180
  let maxLng = -180

  for (const [lng, lat] of coords) {
    minLat = Math.min(minLat, lat)
    maxLat = Math.max(maxLat, lat)
    minLng = Math.min(minLng, lng)
    maxLng = Math.max(maxLng, lng)
  }

  return {
    lat: (minLat + maxLat) / 2,
    lng: (minLng + maxLng) / 2,
  }
}

function routeCategoryLabel(category: StrategicRoute["type"]): string {
  if (category === "energy") return "Energy"
  if (category === "military") return "Defense"
  return "Trade"
}

function sampleEvenly<T>(items: T[], maxItems: number): T[] {
  if (maxItems <= 0) return []
  if (items.length <= maxItems) return items

  const step = items.length / maxItems
  const sampled: T[] = []
  for (let i = 0; i < maxItems; i += 1) {
    sampled.push(items[Math.floor(i * step)])
  }
  return sampled
}

function markerSignature(marker: HtmlMarker): string {
  return [
    marker.kind,
    marker.lat.toFixed(4),
    marker.lng.toFixed(4),
    marker.altitude.toFixed(3),
    marker.rotationDeg.toFixed(1),
    marker.name,
    marker.color,
    marker.infoTop,
    marker.infoMid,
    marker.infoBottom,
    marker.badgeText ?? "",
  ].join("|")
}

// ─── Static accessor functions (never change, defined once) ───
const POLYGON_SIDE_COLOR = () => "rgba(0, 0, 0, 0.5)"
const POLYGON_STROKE_COLOR = () => "#222"
const ARC_COLOR_FN = (d: object) => (d as GlobeArc | StrategicArc).color
const ARC_STROKE_FN = (d: object) => {
  const arc = d as GlobeArc | StrategicArc
  return (arc as StrategicArc).type === "route" ? 0.75 : 0.5
}
const POINT_COLOR_FN = (d: object) => (d as GlobePoint).color
const POINT_RADIUS_FN = (d: object) => (d as GlobePoint).size * 0.5
const LABEL_LAT_FN = (d: object) => (d as MapLabel).lat
const LABEL_LNG_FN = (d: object) => (d as MapLabel).lng
const LABEL_TEXT_FN = (d: object) => (d as MapLabel).text
const LABEL_COLOR_FN = (d: object) => (d as MapLabel).color
const LABEL_ALTITUDE_FN = (d: object) => (d as MapLabel).altitude
const LABEL_SIZE_FN = (d: object) => (d as MapLabel).size
const LABEL_DOT_RADIUS_FN = (d: object) => (d as MapLabel).dotRadius
const HEATMAP_POINTS_FN = (d: object) => (d as WeatherHeatLayer).points
const HEATMAP_POINT_LAT_FN = (d: object) => (d as WeatherHeatPoint).lat
const HEATMAP_POINT_LNG_FN = (d: object) => (d as WeatherHeatPoint).lng
const HEATMAP_POINT_WEIGHT_FN = (d: object) => (d as WeatherHeatPoint).weight
const HEATMAP_COLOR_FACTORY = () => (t: number) => `rgba(239, 68, 68, ${clamp(t, 0.06, 0.9).toFixed(3)})`
const HTML_LAT_FN = (d: object) => (d as HtmlMarker).lat
const HTML_LNG_FN = (d: object) => (d as HtmlMarker).lng
const HTML_ALTITUDE_FN = (d: object) => (d as HtmlMarker).altitude
const HTML_VISIBILITY_FN = (el: HTMLElement, isVisible: boolean) => {
  el.style.opacity = isVisible ? "1" : "0"
  el.style.pointerEvents = isVisible ? "auto" : "none"
}

export default function GodModeGlobe() {
  const globeInstance = useRef<GlobeMethods | undefined>(undefined)
  const [countries, setCountries] = useState<CountryCollection>({ features: [] })
  const [hoverD, setHoverD] = useState<CountryFeature | null>(null)
  const { selectedCountry, selectCountry } = useCountry()

  // Layer Toggles
  const [showTrade, setShowTrade] = useState(true)
  const [showPlanes, setShowPlanes] = useState(true)
  const [showNuclear, setShowNuclear] = useState(true)
  const [showBases, setShowBases] = useState(true)
  const [showCountryLabels, setShowCountryLabels] = useState(true)
  const [showCities, setShowCities] = useState(true)
  const [showWaterways, setShowWaterways] = useState(true)
  const [showRoutes, setShowRoutes] = useState(true)
  const [showWeather, setShowWeather] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [showUI, setShowUI] = useState(true)
  const [activeMarkerHoverId, setActiveMarkerHoverId] = useState<string | null>(null)
  const [cameraAltitude, setCameraAltitude] = useState(2.2)
  const activeMarkerHoverRef = useRef<string | null>(null)
  const markerElementCacheRef = useRef<Map<string, { sig: string; el: HTMLElement }>>(new Map())

  // Live layer state
  const [liveAircraft, setLiveAircraft] = useState<LiveAircraft[]>([])
  const [liveVessels, setLiveVessels] = useState<LiveVessel[]>([])
  const [liveWeather, setLiveWeather] = useState<LiveWeatherStation[]>([])
  const lastAircraftFingerprintRef = useRef("")
  const lastVesselFingerprintRef = useRef("")
  const lastWeatherFingerprintRef = useRef("")
  const [airUsingAuth, setAirUsingAuth] = useState(false)
  const [airFeed, setAirFeed] = useState({
    message: "Loading aircraft feed...",
    asOf: null as string | null,
    stale: false,
    error: null as string | null,
  })
  const [vesselFeed, setVesselFeed] = useState({
    connected: false,
    connecting: true,
    message: "Loading vessel feed...",
    asOf: null as string | null,
    stale: false,
    error: null as string | null,
  })
  const [weatherFeed, setWeatherFeed] = useState({
    message: "Loading weather feed...",
    asOf: null as string | null,
    stale: false,
    error: null as string | null,
  })

  useEffect(() => {
    fetch("/ne_110m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then((data: unknown) => {
        const candidate = data as Partial<CountryCollection> | null
        setCountries({
          features: Array.isArray(candidate?.features) ? (candidate.features as CountryFeature[]) : [],
        })
      })
      .catch((err) => console.error("Error loading geojson", err))
  }, [])

  useEffect(() => {
    if (!showPlanes) return

    let cancelled = false
    let inFlight = false

    async function fetchAircraft() {
      if (cancelled || inFlight) return
      inFlight = true

      try {
        const res = await fetch("/api/live/aircraft?max=200", { cache: "no-store" })
        if (!res.ok) throw new Error(`Aircraft API failed (${res.status})`)
        const data = (await res.json()) as AircraftFeedResponse
        if (cancelled) return

        const fingerprint = `${data.asOf ?? "na"}|${data.aircraft?.length ?? 0}|${data.error ?? ""}|${
          data.stale ? "1" : "0"
        }|${data.usingAuth ? "1" : "0"}`
        if (fingerprint === lastAircraftFingerprintRef.current) return
        lastAircraftFingerprintRef.current = fingerprint

        setLiveAircraft(Array.isArray(data.aircraft) ? data.aircraft : [])
        setAirUsingAuth(Boolean(data.usingAuth))
        setAirFeed({
          message: data.message || "Aircraft feed connected.",
          asOf: data.asOf ?? null,
          stale: Boolean(data.stale),
          error: data.error ?? null,
        })
      } catch (err) {
        if (cancelled) return
        setAirFeed((prev) => ({
          ...prev,
          stale: true,
          error: err instanceof Error ? err.message : "Aircraft fetch failed.",
          message: "Aircraft feed unavailable.",
        }))
      } finally {
        inFlight = false
      }
    }

    fetchAircraft()
    const timer = window.setInterval(fetchAircraft, AIRCRAFT_REFRESH_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [showPlanes])

  useEffect(() => {
    if (!showTrade) return

    let cancelled = false
    let inFlight = false

    async function fetchVessels() {
      if (cancelled || inFlight) return
      inFlight = true

      try {
        const res = await fetch("/api/live/vessels?max=260", { cache: "no-store" })
        if (!res.ok) throw new Error(`Vessel API failed (${res.status})`)
        const data = (await res.json()) as VesselFeedResponse
        if (cancelled) return

        const fingerprint = `${data.asOf ?? "na"}|${data.vessels?.length ?? 0}|${data.error ?? ""}|${
          data.connected ? "1" : "0"
        }|${data.connecting ? "1" : "0"}|${data.stale ? "1" : "0"}`
        if (fingerprint === lastVesselFingerprintRef.current) return
        lastVesselFingerprintRef.current = fingerprint

        setLiveVessels(Array.isArray(data.vessels) ? data.vessels : [])
        setVesselFeed({
          connected: Boolean(data.connected),
          connecting: Boolean(data.connecting),
          message: data.message || "Vessel feed connected.",
          asOf: data.asOf ?? null,
          stale: Boolean(data.stale),
          error: data.error ?? null,
        })
      } catch (err) {
        if (cancelled) return
        setVesselFeed((prev) => ({
          ...prev,
          connected: false,
          connecting: false,
          stale: true,
          error: err instanceof Error ? err.message : "Vessel fetch failed.",
          message: "Vessel feed unavailable.",
        }))
      } finally {
        inFlight = false
      }
    }

    fetchVessels()
    const timer = window.setInterval(fetchVessels, VESSELS_REFRESH_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [showTrade])

  useEffect(() => {
    if (!showWeather && !showHeatmap) return

    let cancelled = false
    let inFlight = false

    async function fetchWeather() {
      if (cancelled || inFlight) return
      inFlight = true

      try {
        const res = await fetch("/api/live/weather?max=24", { cache: "no-store" })
        if (!res.ok) throw new Error(`Weather API failed (${res.status})`)
        const data = (await res.json()) as WeatherFeedResponse
        if (cancelled) return

        const fingerprint = `${data.asOf ?? "na"}|${data.stations?.length ?? 0}|${data.error ?? ""}|${
          data.stale ? "1" : "0"
        }`
        if (fingerprint === lastWeatherFingerprintRef.current) return
        lastWeatherFingerprintRef.current = fingerprint

        setLiveWeather(Array.isArray(data.stations) ? data.stations : [])
        setWeatherFeed({
          message: data.message || "Weather feed connected.",
          asOf: data.asOf ?? null,
          stale: Boolean(data.stale),
          error: data.error ?? null,
        })
      } catch (err) {
        if (cancelled) return
        setWeatherFeed((prev) => ({
          ...prev,
          stale: true,
          error: err instanceof Error ? err.message : "Weather fetch failed.",
          message: "Weather feed unavailable.",
        }))
      } finally {
        inFlight = false
      }
    }

    fetchWeather()
    const timer = window.setInterval(fetchWeather, WEATHER_REFRESH_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [showWeather, showHeatmap])

  useEffect(() => {
    activeMarkerHoverRef.current = activeMarkerHoverId
  }, [activeMarkerHoverId])

  useEffect(() => {
    const cache = markerElementCacheRef.current
    return () => {
      cache.clear()
    }
  }, [])

  const detailLevel = useMemo(() => {
    if (cameraAltitude < 1.45) return "high"
    if (cameraAltitude < 2.2) return "medium"
    return "low"
  }, [cameraAltitude])

  const detailCaps = useMemo(() => {
    if (detailLevel === "high") {
      return {
        countryLabels: 110,
        cityLabels: 28,
        waterLabels: WATER_BODY_LABELS.length,
        aircraftMarkers: 140,
        vesselMarkers: 180,
        weatherMarkers: 24,
        heatmapPoints: 24,
      }
    }
    if (detailLevel === "medium") {
      return {
        countryLabels: 70,
        cityLabels: 16,
        waterLabels: 10,
        aircraftMarkers: 90,
        vesselMarkers: 110,
        weatherMarkers: 14,
        heatmapPoints: 14,
      }
    }
    return {
      countryLabels: 24,
      cityLabels: 6,
      waterLabels: 5,
      aircraftMarkers: 30,
      vesselMarkers: 35,
      weatherMarkers: 6,
      heatmapPoints: 6,
    }
  }, [detailLevel])

  const colorScale = useMemo(() => {
    return (d: object) => {
      const feature = d as CountryFeature
      const iso = feature?.properties?.ISO_A3
      if (iso && iso === selectedCountry) return "#22c55e"
      return hoverD === feature ? "#ef4444" : "rgba(30, 41, 59, 0.85)"
    }
  }, [hoverD, selectedCountry])

  const handlePolygonClick = useCallback((d: object) => {
    const feature = d as CountryFeature
    const iso = feature?.properties?.ISO_A3
    const name = feature?.properties?.ADMIN
    if (iso && name) {
      selectCountry(iso, name)
    }
  }, [selectCountry])

  const routeArcs = useMemo<StrategicArc[]>(() => {
    if (!showRoutes) return []
    return STRATEGIC_ROUTES.map((route) => ({
      startLat: route.startLat,
      startLng: route.startLng,
      endLat: route.endLat,
      endLng: route.endLng,
      name: route.name,
      color: route.color,
      type: "route",
      details: route.details,
      category: route.type,
    }))
  }, [showRoutes])

  const activeArcs = useMemo<Array<GlobeArc | StrategicArc>>(() => {
    const arcs: Array<GlobeArc | StrategicArc> = []
    if (showTrade) arcs.push(...TRADE_ROUTES)
    if (showPlanes) arcs.push(...PLANE_ROUTES)
    arcs.push(...routeArcs)
    return arcs
  }, [showTrade, showPlanes, routeArcs])

  const staticPoints = useMemo<RenderPoint[]>(() => {
    const points: RenderPoint[] = []
    if (showNuclear) points.push(...NUCLEAR_SITES)
    if (showBases) points.push(...MILITARY_BASES)
    return points
  }, [showNuclear, showBases])

  const movingVesselCount = useMemo(() => liveVessels.filter((v) => (v.sogKnots ?? 0) > 1).length, [liveVessels])
  const airborneCount = useMemo(() => liveAircraft.filter((a) => !a.onGround).length, [liveAircraft])
  const visibleVessels = useMemo(
    () => sampleEvenly(liveVessels, detailCaps.vesselMarkers),
    [liveVessels, detailCaps.vesselMarkers]
  )
  const visibleAircraft = useMemo(
    () => sampleEvenly(liveAircraft, detailCaps.aircraftMarkers),
    [liveAircraft, detailCaps.aircraftMarkers]
  )
  const visibleWeather = useMemo(
    () => sampleEvenly(liveWeather, detailCaps.weatherMarkers),
    [liveWeather, detailCaps.weatherMarkers]
  )

  const liveMarkers = useMemo<HtmlMarker[]>(() => {
    const markers: HtmlMarker[] = []

    if (showTrade) {
      for (const vessel of visibleVessels) {
        const heading = vessel.headingDeg ?? vessel.cogDeg ?? 0
        markers.push({
          id: `ship-${vessel.id}`,
          kind: "ship",
          lat: vessel.lat,
          lng: vessel.lng,
          altitude: 0.012,
          name: vessel.name,
          color: "#38bdf8",
          rotationDeg: heading,
          infoTop: `${vessel.shipType} · MMSI ${vessel.mmsi}`,
          infoMid: `${vessel.navStatus} · ${formatKnots(vessel.sogKnots)}`,
          infoBottom: `HDG ${formatBearing(vessel.headingDeg)} · COG ${formatBearing(vessel.cogDeg)} · ${toClock(vesselFeed.asOf)}`,
        })
      }
    }

    if (showPlanes) {
      for (const aircraft of visibleAircraft) {
        markers.push({
          id: `air-${aircraft.id}`,
          kind: "aircraft",
          lat: aircraft.lat,
          lng: aircraft.lng,
          altitude: aircraft.onGround ? 0.012 : 0.065,
          name: aircraft.callsign,
          color: "#f59e0b",
          rotationDeg: aircraft.headingDeg ?? 0,
          infoTop: `${aircraft.originCountry} · ICAO ${aircraft.icao24.toUpperCase()}`,
          infoMid: `${aircraft.onGround ? "On ground" : "Airborne"} · ${formatKnots(aircraft.velocityKts)} · ALT ${formatFeet(aircraft.altitudeFt)}`,
          infoBottom: `HDG ${formatBearing(aircraft.headingDeg)} · Updated ${toClock(airFeed.asOf)}`,
        })
      }
    }

    if (showWeather) {
      for (const station of visibleWeather) {
        const tempText = formatTempC(station.temperatureC)
        const emoji = weatherEmoji(station.weatherCode, station.isDay)
        markers.push({
          id: `wx-${station.id}`,
          kind: "weather",
          lat: station.lat,
          lng: station.lng,
          altitude: 0.016,
          name: `${station.name}, ${station.country}`,
          color: station.temperatureC !== null && station.temperatureC > 35 ? "#ef4444" : "#22d3ee",
          rotationDeg: 0,
          infoTop: `${station.weatherText} ${emoji} · ${tempText}`,
          infoMid: `Wind ${station.windKmh?.toFixed(1) ?? "n/a"} km/h @ ${formatBearing(station.windDirDeg)} · Humidity ${station.humidityPct?.toFixed(0) ?? "n/a"}%`,
          infoBottom: `${station.region} · Updated ${toClock(station.observedAt)}`,
          badgeText: `${emoji} ${tempText}`,
        })
      }
    }

    return markers
  }, [
    showTrade,
    showPlanes,
    showWeather,
    visibleVessels,
    visibleAircraft,
    visibleWeather,
    vesselFeed.asOf,
    airFeed.asOf,
  ])

  const countryLabels = useMemo<MapLabel[]>(() => {
    if (!showCountryLabels) return []

    const labels: Array<MapLabel & { rank: number }> = []
    for (const feature of countries.features) {
      const center = getFeatureCenter(feature)
      if (!center) continue

      const name = feature.properties.ADMIN
      if (!name) continue

      const rankRaw = feature.properties.LABELRANK
      const rank = typeof rankRaw === "string" ? Number(rankRaw) : typeof rankRaw === "number" ? rankRaw : 5
      if (Number.isFinite(rank) && rank > 6) continue

      labels.push({
        id: `country-${feature.properties.ISO_A3 ?? name}`,
        text: name,
        lat: center.lat,
        lng: center.lng,
        altitude: 0.014,
        color: "rgba(203,213,225,0.76)",
        size: rank <= 2 ? 0.88 : 0.72,
        dotRadius: 0.055,
        details: `Country label · Rank ${rank}`,
        category: "country",
        rank,
      })
    }

    labels.sort((a, b) => a.rank - b.rank)
    return labels.slice(0, detailCaps.countryLabels).map((label) => ({
      id: label.id,
      text: label.text,
      lat: label.lat,
      lng: label.lng,
      altitude: label.altitude,
      color: label.color,
      size: label.size,
      dotRadius: label.dotRadius,
      details: label.details,
      category: label.category,
    }))
  }, [countries.features, showCountryLabels, detailCaps.countryLabels])

  const cityLabels = useMemo<MapLabel[]>(() => {
    if (!showCities) return []

    const sortedCities = [...MAJOR_CITIES].sort((a, b) => {
      if (a.tier === b.tier) return 0
      return a.tier === "global" ? -1 : 1
    })
    const visibleCities = sortedCities.slice(0, detailCaps.cityLabels)

    return visibleCities.map((city) => ({
      id: `city-${city.id}`,
      text: city.name,
      lat: city.lat,
      lng: city.lng,
      altitude: 0.02,
      color: city.tier === "global" ? "rgba(248,250,252,0.93)" : "rgba(148,163,184,0.88)",
      size: city.tier === "global" ? 0.84 : 0.64,
      dotRadius: city.tier === "global" ? 0.095 : 0.06,
      details: `${city.country} · ${city.tier === "global" ? "Global" : "Regional"} city`,
      category: "city",
    }))
  }, [showCities, detailCaps.cityLabels])

  const waterLabels = useMemo<MapLabel[]>(() => {
    if (!showWaterways) return []

    const visibleWaterways = WATER_BODY_LABELS.slice(0, detailCaps.waterLabels)
    return visibleWaterways.map((body) => ({
      id: `water-${body.id}`,
      text: body.name,
      lat: body.lat,
      lng: body.lng,
      altitude: 0.012,
      color:
        body.type === "strait"
          ? "rgba(125,211,252,0.95)"
          : body.type === "sea"
            ? "rgba(125,211,252,0.82)"
            : "rgba(148,163,184,0.78)",
      size: body.type === "strait" ? 0.92 : body.type === "sea" ? 0.76 : 0.7,
      dotRadius: body.type === "strait" ? 0.095 : 0.045,
      details: `${body.type.toUpperCase()} · ${body.details}`,
      category: "water",
    }))
  }, [showWaterways, detailCaps.waterLabels])

  const labelsData = useMemo<MapLabel[]>(() => {
    return [...countryLabels, ...cityLabels, ...waterLabels]
  }, [countryLabels, cityLabels, waterLabels])

  const weatherHeatmaps = useMemo<WeatherHeatLayer[]>(() => {
    if (!showHeatmap || liveWeather.length === 0) return []

    const sampledWeather = sampleEvenly(liveWeather, detailCaps.heatmapPoints)
    const points: WeatherHeatPoint[] = sampledWeather.map((station) => {
      const tempScore = station.temperatureC === null ? 0 : clamp(Math.abs(station.temperatureC - 18) / 24, 0, 1)
      const windScore = station.windKmh === null ? 0 : clamp(station.windKmh / 90, 0, 1)
      const stormScore = weatherSeverity(station.weatherCode)
      const weight = clamp(tempScore * 0.34 + windScore * 0.36 + stormScore * 0.3, 0.05, 1)

      return {
        lat: station.lat,
        lng: station.lng,
        weight,
      }
    })

    return [{ id: "weather-heat", points }]
  }, [showHeatmap, liveWeather, detailCaps.heatmapPoints])

  useEffect(() => {
    if (!activeMarkerHoverId) return
    if (!liveMarkers.some((marker) => marker.id === activeMarkerHoverId)) {
      setActiveMarkerHoverId(null)
    }
  }, [activeMarkerHoverId, liveMarkers])

  useEffect(() => {
    const clearIfOutsideMarker = (event: PointerEvent) => {
      if (!activeMarkerHoverRef.current) return
      const target = event.target as Element | null
      const onMarker = Boolean(target?.closest?.('[data-globe-marker="1"]'))
      if (!onMarker) {
        setActiveMarkerHoverId(null)
      }
    }

    window.addEventListener("pointermove", clearIfOutsideMarker, true)
    window.addEventListener("pointerdown", clearIfOutsideMarker, true)
    return () => {
      window.removeEventListener("pointermove", clearIfOutsideMarker, true)
      window.removeEventListener("pointerdown", clearIfOutsideMarker, true)
    }
  }, [])

  const isHoveringMarker = activeMarkerHoverId !== null

  const tradeStatus: LiveStatus = vesselFeed.error
    ? "warn"
    : vesselFeed.connected
      ? "live"
      : vesselFeed.connecting
        ? "pending"
        : "warn"
  const planeStatus: LiveStatus = airFeed.error ? "warn" : !airFeed.stale ? "live" : "pending"
  const weatherStatus: LiveStatus = weatherFeed.error ? "warn" : !weatherFeed.stale ? "live" : "pending"

  const vesselMeta = `${toClock(vesselFeed.asOf)} · ${movingVesselCount} moving · ${
    vesselFeed.connected ? "ws live" : vesselFeed.connecting ? "connecting" : "cache"
  }`
  const aircraftMeta = `${toClock(airFeed.asOf)} · ${airborneCount} airborne · ${
    airUsingAuth ? "auth" : "anon"
  }${airFeed.stale ? " · stale" : ""}`
  const weatherMeta = `${toClock(weatherFeed.asOf)} · ${liveWeather.length} hubs · ${weatherFeed.stale ? "cached" : "fresh"}`

  useEffect(() => {
    const liveIds = new Set(liveMarkers.map((marker) => marker.id))
    for (const id of markerElementCacheRef.current.keys()) {
      if (!liveIds.has(id)) {
        markerElementCacheRef.current.delete(id)
      }
    }
  }, [liveMarkers])

  const renderHtmlElement = useCallback((d: object) => {
    const marker = d as HtmlMarker
    const sig = markerSignature(marker)
    const cached = markerElementCacheRef.current.get(marker.id)
    if (cached && cached.sig === sig) {
      return cached.el
    }

    const el = createHtmlMarkerElement(
      marker,
      (markerId) => {
        setHoverD(null)
        setActiveMarkerHoverId(markerId)
      },
      (markerId) => {
        setActiveMarkerHoverId((prev) => (prev === markerId ? null : prev))
      }
    )
    markerElementCacheRef.current.set(marker.id, { sig, el })
    return el
  }, [])

  // ─── Memoized Globe callback props ──────────────────────
  // Stable references prevent unnecessary Three.js re-computations

  const polygonAltitudeFn = useCallback((d: object) => {
    const feature = d as CountryFeature
    const iso = feature?.properties?.ISO_A3
    if (iso === selectedCountry) return 0.06
    return feature === hoverD ? 0.04 : 0.01
  }, [selectedCountry, hoverD])

  const polygonSideColorFn = POLYGON_SIDE_COLOR
  const polygonStrokeColorFn = POLYGON_STROKE_COLOR

  const polygonLabelFn = useCallback((d: object) => {
    if (isHoveringMarker) return ""
    const feature = d as CountryFeature
    const iso = feature?.properties?.ISO_A3
    const meta = iso ? COUNTRY_DATA[iso] : undefined
    return `
      <div style="background:rgba(0,0,0,0.85);padding:10px 14px;border-radius:10px;border:1px solid #334155;backdrop-filter:blur(8px);min-width:180px">
        <div style="font-weight:700;font-size:14px;margin-bottom:4px">${feature.properties.ADMIN ?? "Unknown"}</div>
        ${
          meta
            ? `
              <div style="font-size:11px;color:#94a3b8">
                <div>Index: ${meta.mainIndex}</div>
                <div>Currency: ${meta.currency}</div>
                <div>Region: ${meta.region}</div>
              </div>
            `
            : `<div style="font-size:11px;color:#94a3b8">Click to explore</div>`
        }
      </div>
    `
  }, [isHoveringMarker])

  const onPolygonHoverFn = useCallback((d: object | null) => {
    if (activeMarkerHoverRef.current) return
    setHoverD((d as CountryFeature | null) ?? null)
  }, [])

  const onPolygonClickFn = useCallback((d: object) => {
    if (activeMarkerHoverRef.current) return
    handlePolygonClick(d)
  }, [handlePolygonClick])

  const onZoomFn = useCallback((pov: { altitude: number }) => {
    setCameraAltitude((prev) => {
      const next = pov.altitude
      return Math.abs(prev - next) > 0.05 ? next : prev
    })
  }, [])

  const arcColorFn = ARC_COLOR_FN
  const arcLabelFn = useCallback((d: object) => {
    if (isHoveringMarker) return ""
    const arc = d as GlobeArc | StrategicArc
    const route = arc as StrategicArc
    const isStrategic = route.type === "route"
    return `
      <div style="background:rgba(0,0,0,0.85);padding:8px 12px;border-radius:8px;border:1px solid ${arc.color};backdrop-filter:blur(8px)">
        <div style="font-weight:700;font-size:12px;color:${arc.color}">${arc.name}</div>
        <div style="font-size:10px;color:#94a3b8">${
          isStrategic
            ? `${routeCategoryLabel(route.category)} Route · ${route.details}`
            : (arc as GlobeArc).type === "trade"
              ? "Trade corridor"
              : "Air corridor"
        }</div>
      </div>
    `
  }, [isHoveringMarker])
  const arcStrokeFn = ARC_STROKE_FN

  const pointColorFn = POINT_COLOR_FN
  const pointRadiusFn = POINT_RADIUS_FN
  const pointLabelFn = useCallback((d: object) => {
    if (isHoveringMarker) return ""
    const point = d as GlobePoint
    return `
      <div style="background:rgba(0,0,0,0.85);padding:8px 12px;border-radius:8px;border:1px solid ${point.color};backdrop-filter:blur(8px)">
        <div style="font-weight:700;font-size:12px;color:${point.color}">${point.name}</div>
        <div style="font-size:10px;color:#94a3b8">${point.type.toUpperCase()}${point.details ? ` · ${point.details}` : ""}</div>
      </div>
    `
  }, [isHoveringMarker])

  const labelLatFn = LABEL_LAT_FN
  const labelLngFn = LABEL_LNG_FN
  const labelTextFn = LABEL_TEXT_FN
  const labelColorFn = LABEL_COLOR_FN
  const labelAltitudeFn = LABEL_ALTITUDE_FN
  const labelSizeFn = LABEL_SIZE_FN
  const labelDotRadiusFn = LABEL_DOT_RADIUS_FN
  const labelLabelFn = useCallback((d: object) => {
    if (isHoveringMarker) return ""
    const label = d as MapLabel
    return `
      <div style="background:rgba(0,0,0,0.85);padding:7px 11px;border-radius:8px;border:1px solid #334155;backdrop-filter:blur(8px)">
        <div style="font-weight:700;font-size:12px;color:#e2e8f0">${label.text}</div>
        <div style="font-size:10px;color:#94a3b8">${label.details}</div>
      </div>
    `
  }, [isHoveringMarker])

  const heatmapPointsFn = HEATMAP_POINTS_FN
  const heatmapPointLatFn = HEATMAP_POINT_LAT_FN
  const heatmapPointLngFn = HEATMAP_POINT_LNG_FN
  const heatmapPointWeightFn = HEATMAP_POINT_WEIGHT_FN
  const heatmapColorFn = HEATMAP_COLOR_FACTORY

  const htmlLatFn = HTML_LAT_FN
  const htmlLngFn = HTML_LNG_FN
  const htmlAltitudeFn = HTML_ALTITUDE_FN
  const htmlVisibilityFn = HTML_VISIBILITY_FN

  const handleMouseLeave = useCallback(() => setActiveMarkerHoverId(null), [])

  // ─── Stable toggle callbacks for memoized ToggleButton ──
  const toggleTrade = useCallback(() => setShowTrade(prev => !prev), [])
  const togglePlanes = useCallback(() => setShowPlanes(prev => !prev), [])
  const toggleNuclear = useCallback(() => setShowNuclear(prev => !prev), [])
  const toggleBases = useCallback(() => setShowBases(prev => !prev), [])
  const toggleRoutes = useCallback(() => setShowRoutes(prev => !prev), [])
  const toggleWeather = useCallback(() => setShowWeather(prev => !prev), [])
  const toggleHeatmap = useCallback(() => setShowHeatmap(prev => !prev), [])
  const toggleCountryLabels = useCallback(() => setShowCountryLabels(prev => !prev), [])
  const toggleCities = useCallback(() => setShowCities(prev => !prev), [])
  const toggleWaterways = useCallback(() => setShowWaterways(prev => !prev), [])
  const toggleUI = useCallback(() => setShowUI(prev => !prev), [])

  return (
    <div
      className="w-full h-full flex items-center justify-center bg-transparent cursor-pointer overflow-hidden rounded-xl relative group"
      onMouseLeave={handleMouseLeave}
    >
      <Globe
        ref={globeInstance}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        enablePointerInteraction={!isHoveringMarker}
        onZoom={onZoomFn}

        // Polygons
        polygonsData={countries.features}
        polygonAltitude={polygonAltitudeFn}
        polygonCapColor={colorScale}
        polygonSideColor={polygonSideColorFn}
        polygonStrokeColor={polygonStrokeColorFn}
        polygonLabel={polygonLabelFn}
        onPolygonHover={onPolygonHoverFn}
        onPolygonClick={onPolygonClickFn}
        polygonsTransitionDuration={200}

        // Arcs
        arcsData={activeArcs}
        arcColor={arcColorFn}
        arcLabel={arcLabelFn}
        arcDashLength={0.38}
        arcDashGap={4}
        arcDashAnimateTime={2000}
        arcStroke={arcStrokeFn}

        // Static points
        pointsData={staticPoints}
        pointColor={pointColorFn}
        pointRadius={pointRadiusFn}
        pointAltitude={0.02}
        pointsTransitionDuration={200}
        pointLabel={pointLabelFn}

        // Labels
        labelsData={labelsData}
        labelLat={labelLatFn}
        labelLng={labelLngFn}
        labelText={labelTextFn}
        labelColor={labelColorFn}
        labelAltitude={labelAltitudeFn}
        labelSize={labelSizeFn}
        labelDotRadius={labelDotRadiusFn}
        labelLabel={labelLabelFn}
        labelsTransitionDuration={200}

        // Weather heatmap
        heatmapsData={weatherHeatmaps}
        heatmapPoints={heatmapPointsFn}
        heatmapPointLat={heatmapPointLatFn}
        heatmapPointLng={heatmapPointLngFn}
        heatmapPointWeight={heatmapPointWeightFn}
        heatmapBandwidth={1.35}
        heatmapColorFn={heatmapColorFn}
        heatmapColorSaturation={0.85}
        heatmapBaseAltitude={0.008}
        heatmapTopAltitude={0.11}
        heatmapsTransitionDuration={300}

        // HTML markers
        htmlElementsData={liveMarkers}
        htmlLat={htmlLatFn}
        htmlLng={htmlLngFn}
        htmlAltitude={htmlAltitudeFn}
        htmlElement={renderHtmlElement}
        htmlElementVisibilityModifier={htmlVisibilityFn}
        htmlTransitionDuration={180}

        atmosphereColor="lightskyblue"
        atmosphereAltitude={0.15}
      />

      {/* Floating Toggle Panel */}
      <div
        className={`absolute top-4 right-4 z-10 transition-all duration-300 ${
          showUI ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
        }`}
      >
        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-lg flex flex-col gap-1 shadow-2xl max-h-[86vh] overflow-auto">
          <ToggleButton
            active={showTrade}
            onClick={toggleTrade}
            icon={Anchor}
            label="Trade + Ships"
            color="text-blue-400"
            count={liveVessels.length}
            status={tradeStatus}
            meta={vesselMeta}
          />
          <ToggleButton
            active={showPlanes}
            onClick={togglePlanes}
            icon={Plane}
            label="Air + Aircraft"
            color="text-amber-400"
            count={liveAircraft.length}
            status={planeStatus}
            meta={aircraftMeta}
          />
          <ToggleButton
            active={showNuclear}
            onClick={toggleNuclear}
            icon={Radio}
            label="Nuclear Sites"
            color="text-red-400"
            count={NUCLEAR_SITES.length}
            status="static"
          />
          <ToggleButton
            active={showBases}
            onClick={toggleBases}
            icon={Shield}
            label="Military Bases"
            color="text-violet-400"
            count={MILITARY_BASES.length}
            status="static"
          />
          <ToggleButton
            active={showRoutes}
            onClick={toggleRoutes}
            icon={RouteIcon}
            label="Strategic Routes"
            color="text-cyan-300"
            count={STRATEGIC_ROUTES.length}
            status="static"
            meta="Suez, Hormuz, Malacca, Panama overlays"
          />
          <ToggleButton
            active={showWeather}
            onClick={toggleWeather}
            icon={CloudSun}
            label="Weather Updates"
            color="text-sky-300"
            count={liveWeather.length}
            status={weatherStatus}
            meta={weatherMeta}
          />
          <ToggleButton
            active={showHeatmap}
            onClick={toggleHeatmap}
            icon={Flame}
            label="Climate Heatmap"
            color="text-orange-400"
            count={weatherHeatmaps.length > 0 ? weatherHeatmaps[0].points.length : 0}
            status={weatherStatus}
            meta="Composite of heat, wind, and storm severity"
          />
          <ToggleButton
            active={showCountryLabels}
            onClick={toggleCountryLabels}
            icon={MapPin}
            label="Country Names"
            color="text-slate-200"
            count={countryLabels.length}
            status="static"
          />
          <ToggleButton
            active={showCities}
            onClick={toggleCities}
            icon={Building2}
            label="City Names"
            color="text-slate-300"
            count={cityLabels.length}
            status="static"
          />
          <ToggleButton
            active={showWaterways}
            onClick={toggleWaterways}
            icon={Waves}
            label="Oceans + Straits"
            color="text-blue-300"
            count={waterLabels.length}
            status="static"
          />

          {(vesselFeed.error || airFeed.error || weatherFeed.error) && (
            <div className="mt-1 pt-1 px-1 border-t border-white/10 text-[9px] text-red-300 max-w-[260px]">
              {vesselFeed.error && <div>Ships: {vesselFeed.error}</div>}
              {airFeed.error && <div>Air: {airFeed.error}</div>}
              {weatherFeed.error && <div>Weather: {weatherFeed.error}</div>}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={toggleUI}
        className="absolute bottom-4 right-4 z-10 p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 transition-colors shadow-lg"
      >
        {showUI ? (
          <EyeOff className="h-4 w-4 text-slate-400" />
        ) : (
          <Eye className="h-4 w-4 text-slate-400" />
        )}
      </button>
    </div>
  )
}

const ToggleButton = memo(function ToggleButton({
  active,
  onClick,
  icon: Icon,
  label,
  color,
  count,
  status = "static",
  meta,
}: {
  active: boolean
  onClick: () => void
  icon: ElementType
  label: string
  color: string
  count?: number
  status?: LiveStatus
  meta?: string
}) {
  const statusColor =
    status === "live"
      ? "bg-emerald-400"
      : status === "pending"
        ? "bg-amber-400"
        : status === "warn"
          ? "bg-red-400"
          : color.replace("text", "bg")

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start px-3 py-1.5 rounded-md transition-all text-[10px] uppercase tracking-wider font-medium ${
        active
          ? "bg-white/10 text-white border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)]"
          : "text-slate-500 hover:text-slate-300 border border-transparent"
      }`}
    >
      <div className="flex items-center gap-2 w-full">
        <Icon className={`h-3 w-3 ${active ? color : "text-slate-600"}`} />
        <span>{label}</span>
        {typeof count === "number" && (
          <span className="ml-auto text-[9px] text-slate-400 font-mono tabular-nums">{count}</span>
        )}
        {active && (
          <div className={`h-1.5 w-1.5 rounded-full ${statusColor} ${status === "live" ? "animate-pulse" : ""}`} />
        )}
      </div>
      {active && meta && <div className="pl-5 mt-0.5 text-[9px] text-slate-500 normal-case tracking-normal">{meta}</div>}
    </button>
  )
})
