const OPEN_SKY_STATES_URL = "https://opensky-network.org/api/states/all";
const OPEN_SKY_TOKEN_URL =
  "https://auth.opensky-network.org/auth/realms/opensky-network/protocol/openid-connect/token";

const OPEN_SKY_AUTH_REFRESH_MS = 90 * 1000;
const OPEN_SKY_ANON_REFRESH_MS = 15 * 60 * 1000;
const DEFAULT_MAX_AIRCRAFT = 180;
const FETCH_TIMEOUT_MS = 15_000;

export interface LiveAircraft {
  id: string;
  icao24: string;
  callsign: string;
  originCountry: string;
  lat: number;
  lng: number;
  velocityKts: number | null;
  altitudeFt: number | null;
  headingDeg: number | null;
  onGround: boolean;
  lastContact: number;
  squawk: string | null;
}

export interface OpenSkySnapshot {
  source: "OpenSky Network";
  asOf: string | null;
  total: number;
  usingAuth: boolean;
  pollIntervalSeconds: number;
  message: string;
  aircraft: LiveAircraft[];
  stale: boolean;
  error: string | null;
}

interface OpenSkyCache {
  fetchedAt: number;
  asOf: string | null;
  usingAuth: boolean;
  message: string;
  aircraft: LiveAircraft[];
  error: string | null;
}

interface OpenSkyToken {
  accessToken: string;
  expiresAt: number;
}

const globalForOpenSky = globalThis as typeof globalThis & {
  __openSkyCache?: OpenSkyCache;
  __openSkyToken?: OpenSkyToken | null;
};

function getCache(): OpenSkyCache {
  if (!globalForOpenSky.__openSkyCache) {
    globalForOpenSky.__openSkyCache = {
      fetchedAt: 0,
      asOf: null,
      usingAuth: false,
      message:
        "OpenSky anonymous mode. Set OPENSKY_CLIENT_ID/OPENSKY_CLIENT_SECRET for faster refresh.",
      aircraft: [],
      error: null,
    };
  }
  return globalForOpenSky.__openSkyCache;
}

function getRefreshMs(usingAuth: boolean): number {
  return usingAuth ? OPEN_SKY_AUTH_REFRESH_MS : OPEN_SKY_ANON_REFRESH_MS;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function safeNumber(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function sampleEvenly<T>(items: T[], maxItems: number): T[] {
  if (items.length <= maxItems) return items;
  if (maxItems <= 0) return [];

  const step = items.length / maxItems;
  const out: T[] = [];
  for (let i = 0; i < maxItems; i += 1) {
    out.push(items[Math.floor(i * step)]);
  }
  return out;
}

function parseBbox() {
  const raw = process.env.OPENSKY_BBOX?.trim();
  if (!raw) return null;

  const parts = raw.split(",").map((v) => Number(v.trim()));
  if (parts.length !== 4 || parts.some((v) => !Number.isFinite(v))) return null;

  const [lamin, lamax, lomin, lomax] = parts;
  if (lamin >= lamax || lomin >= lomax) return null;

  return { lamin, lamax, lomin, lomax };
}

async function getAuthHeader(): Promise<{
  headers: HeadersInit;
  usingAuth: boolean;
  message: string;
}> {
  const clientId = process.env.OPENSKY_CLIENT_ID?.trim();
  const clientSecret = process.env.OPENSKY_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    return {
      headers: {},
      usingAuth: false,
      message:
        "OpenSky anonymous mode. Set OPENSKY_CLIENT_ID/OPENSKY_CLIENT_SECRET for faster refresh.",
    };
  }

  const existing = globalForOpenSky.__openSkyToken;
  if (existing && existing.expiresAt > Date.now() + 10_000) {
    return {
      headers: { Authorization: `Bearer ${existing.accessToken}` },
      usingAuth: true,
      message: "OpenSky authenticated mode.",
    };
  }

  const form = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  });

  const tokenController = new AbortController();
  const tokenTimer = setTimeout(() => tokenController.abort(), FETCH_TIMEOUT_MS);

  const tokenRes = await fetch(OPEN_SKY_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
    cache: "no-store",
    signal: tokenController.signal,
  });

  clearTimeout(tokenTimer);

  if (!tokenRes.ok) {
    throw new Error(`OpenSky token request failed (${tokenRes.status})`);
  }

  const tokenJson = (await tokenRes.json()) as {
    access_token?: string;
    expires_in?: number;
  };

  if (!tokenJson.access_token) {
    throw new Error("OpenSky token response did not include access_token.");
  }

  globalForOpenSky.__openSkyToken = {
    accessToken: tokenJson.access_token,
    expiresAt: Date.now() + Math.max((tokenJson.expires_in ?? 300) * 1000, 60_000),
  };

  return {
    headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    usingAuth: true,
    message: "OpenSky authenticated mode.",
  };
}

function parseAircraft(states: unknown): LiveAircraft[] {
  if (!Array.isArray(states)) return [];

  const parsed: LiveAircraft[] = [];
  for (const raw of states) {
    if (!Array.isArray(raw)) continue;

    const icao24 = typeof raw[0] === "string" ? raw[0].trim().toLowerCase() : "";
    const lng = safeNumber(raw[5]);
    const lat = safeNumber(raw[6]);
    if (!icao24 || lat === null || lng === null) continue;

    const callsign =
      typeof raw[1] === "string" && raw[1].trim()
        ? raw[1].trim()
        : `ICAO ${icao24.toUpperCase()}`;
    const originCountry = typeof raw[2] === "string" ? raw[2] : "Unknown";
    const velocityMs = safeNumber(raw[9]);
    const altitudeM = safeNumber(raw[13]) ?? safeNumber(raw[7]);
    const headingDeg = safeNumber(raw[10]);
    const lastContact = safeNumber(raw[4]) ?? Math.floor(Date.now() / 1000);
    const squawk = typeof raw[14] === "string" && raw[14].trim() ? raw[14].trim() : null;

    parsed.push({
      id: icao24,
      icao24,
      callsign,
      originCountry,
      lat,
      lng,
      velocityKts: velocityMs === null ? null : Math.round(velocityMs * 1.943844),
      altitudeFt: altitudeM === null ? null : Math.round(altitudeM * 3.28084),
      headingDeg: headingDeg === null ? null : Math.round(headingDeg),
      onGround: Boolean(raw[8]),
      lastContact,
      squawk,
    });
  }

  parsed.sort((a, b) => b.lastContact - a.lastContact);
  return parsed;
}

async function refreshCache(cache: OpenSkyCache) {
  let auth = {
    headers: {},
    usingAuth: false,
    message:
      "OpenSky anonymous mode. Set OPENSKY_CLIENT_ID/OPENSKY_CLIENT_SECRET for faster refresh.",
  };

  try {
    auth = await getAuthHeader();
  } catch {
    auth = {
      headers: {},
      usingAuth: false,
      message:
        "OpenSky auth failed. Falling back to anonymous mode. Check OPENSKY credentials.",
    };
    cache.error = "OpenSky authentication failed.";
  }

  const bbox = parseBbox();
  const url = new URL(OPEN_SKY_STATES_URL);
  if (bbox) {
    url.searchParams.set("lamin", String(bbox.lamin));
    url.searchParams.set("lamax", String(bbox.lamax));
    url.searchParams.set("lomin", String(bbox.lomin));
    url.searchParams.set("lomax", String(bbox.lomax));
  }

  const statesController = new AbortController();
  const statesTimer = setTimeout(() => statesController.abort(), FETCH_TIMEOUT_MS);

  const response = await fetch(url.toString(), {
    headers: auth.headers,
    cache: "no-store",
    signal: statesController.signal,
  });

  clearTimeout(statesTimer);

  if (!response.ok) {
    throw new Error(`OpenSky states request failed (${response.status})`);
  }

  const json = (await response.json()) as { time?: number; states?: unknown };
  const time = typeof json.time === "number" ? json.time : Math.floor(Date.now() / 1000);

  cache.fetchedAt = Date.now();
  cache.asOf = new Date(time * 1000).toISOString();
  cache.usingAuth = auth.usingAuth;
  cache.message = auth.message;
  cache.aircraft = parseAircraft(json.states);
  cache.error = null;
}

export async function getOpenSkySnapshot(maxAircraft = DEFAULT_MAX_AIRCRAFT): Promise<OpenSkySnapshot> {
  const cache = getCache();
  const requestedMax = clamp(Math.trunc(maxAircraft) || DEFAULT_MAX_AIRCRAFT, 50, 600);
  const refreshMs = getRefreshMs(cache.usingAuth);
  const ageMs = Date.now() - cache.fetchedAt;

  let stale = cache.fetchedAt === 0 || ageMs >= refreshMs;
  if (stale) {
    try {
      await refreshCache(cache);
      stale = false;
    } catch {
      cache.error = "Failed to fetch aircraft data.";
      stale = true;
    }
  }

  const activeRefreshMs = getRefreshMs(cache.usingAuth);

  return {
    source: "OpenSky Network",
    asOf: cache.asOf,
    total: cache.aircraft.length,
    usingAuth: cache.usingAuth,
    pollIntervalSeconds: Math.floor(activeRefreshMs / 1000),
    message: cache.message,
    aircraft: sampleEvenly(cache.aircraft, requestedMax),
    stale,
    error: cache.error,
  };
}
