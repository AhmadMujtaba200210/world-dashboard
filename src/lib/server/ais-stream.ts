import WebSocket from "ws";

const AIS_STREAM_URL = "wss://stream.aisstream.io/v0/stream";
const DEFAULT_MAX_VESSELS = 240;
const MAX_STORED_VESSELS = 5000;
const STALE_VESSEL_MS = 15 * 60 * 1000;
const CLEANUP_INTERVAL_MS = 60 * 1000;

type AnyRecord = Record<string, unknown>;

export interface LiveVessel {
  id: string;
  mmsi: string;
  name: string;
  shipType: string;
  navStatus: string;
  lat: number;
  lng: number;
  sogKnots: number | null;
  cogDeg: number | null;
  headingDeg: number | null;
  lastReport: number;
}

export interface VesselSnapshot {
  source: "AISStream";
  configured: boolean;
  connected: boolean;
  connecting: boolean;
  asOf: string | null;
  total: number;
  message: string;
  vessels: LiveVessel[];
  stale: boolean;
  error: string | null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function asRecord(value: unknown): AnyRecord | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as AnyRecord;
}

function toNumber(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function toString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
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

function navStatusLabel(code: number | null): string {
  if (code === null) return "Unknown";
  const MAP: Record<number, string> = {
    0: "Under way",
    1: "At anchor",
    2: "Not under command",
    3: "Restricted maneuverability",
    4: "Constrained by draft",
    5: "Moored",
    6: "Aground",
    7: "Fishing",
    8: "Sailing",
    9: "Reserved",
    10: "Reserved",
    11: "Reserved",
    12: "Reserved",
    13: "Reserved",
    14: "AIS-SART",
    15: "Undefined",
  };
  return MAP[code] ?? `Status ${code}`;
}

function parseBoundingBoxes() {
  const fromEnv = process.env.AISSTREAM_BOUNDING_BOXES?.trim();
  if (!fromEnv) {
    return [[[-90, -180], [90, 180]]];
  }

  const boxes = fromEnv
    .split("|")
    .map((box) => box.split(",").map((v) => Number(v.trim())))
    .filter((parts) => parts.length === 4 && parts.every((n) => Number.isFinite(n)))
    .map(([lat1, lon1, lat2, lon2]) => [[lat1, lon1], [lat2, lon2]]);

  if (boxes.length === 0) {
    return [[[-90, -180], [90, 180]]];
  }

  return boxes;
}

function normalizeVesselMessage(payload: unknown): LiveVessel | null {
  const root = asRecord(payload);
  if (!root) return null;

  const meta = asRecord(root.MetaData) ?? {};
  const msg = asRecord(root.Message) ?? {};
  const report =
    asRecord(msg.PositionReport) ??
    asRecord(msg.StandardClassBPositionReport) ??
    asRecord(msg.ExtendedClassBPositionReport) ??
    asRecord(root.PositionReport) ??
    {};

  const lat =
    toNumber(report.Latitude) ??
    toNumber(report.latitude) ??
    toNumber(meta.latitude) ??
    toNumber(meta.Latitude);
  const lng =
    toNumber(report.Longitude) ??
    toNumber(report.longitude) ??
    toNumber(meta.longitude) ??
    toNumber(meta.Longitude);

  if (lat === null || lng === null) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  const mmsiRaw = meta.MMSI ?? root.MMSI ?? report.UserID ?? report.MMSI;
  const mmsi = mmsiRaw === undefined || mmsiRaw === null ? null : String(mmsiRaw).trim();
  if (!mmsi) return null;

  const name =
    toString(meta.ShipName) ??
    toString(meta.Shipname) ??
    toString(meta.VesselName) ??
    `MMSI ${mmsi}`;

  const shipType =
    toString(meta.ShipType) ??
    toString(meta.Type) ??
    toString(report.ShipType) ??
    "Unknown";

  const sogKnots =
    toNumber(report.Sog) ??
    toNumber(report.SOG) ??
    toNumber(report.SpeedOverGround) ??
    toNumber(report.Speed);
  const cogDeg =
    toNumber(report.Cog) ??
    toNumber(report.COG) ??
    toNumber(report.CourseOverGround);
  const headingDeg =
    toNumber(report.TrueHeading) ??
    toNumber(report.Heading) ??
    toNumber(report.HeadingDegrees);

  const navCode =
    toNumber(report.NavigationalStatus) ??
    toNumber(report.NavigationStatus) ??
    toNumber(meta.NavigationalStatus);

  const timestampSec =
    toNumber(meta.time_utc) ??
    toNumber(meta.Timestamp) ??
    toNumber(report.Timestamp) ??
    toNumber(report.TimeStamp);

  let timestampMs = Date.now();
  if (timestampSec !== null) {
    if (timestampSec > 1_000_000_000_000) {
      timestampMs = Math.round(timestampSec);
    } else if (timestampSec > 1_000_000_000) {
      timestampMs = Math.round(timestampSec * 1000);
    }
  }

  return {
    id: mmsi,
    mmsi,
    name,
    shipType,
    navStatus: navStatusLabel(navCode),
    lat,
    lng,
    sogKnots: sogKnots === null ? null : Number(sogKnots.toFixed(1)),
    cogDeg: cogDeg === null ? null : Math.round(cogDeg),
    headingDeg: headingDeg === null ? null : Math.round(headingDeg),
    lastReport: timestampMs,
  };
}

class AISStreamManager {
  private readonly apiKey = process.env.AISSTREAM_API_KEY?.trim() ?? "";
  private readonly boundingBoxes = parseBoundingBoxes();
  private vessels = new Map<string, LiveVessel>();
  private ws: WebSocket | null = null;
  private started = false;
  private connected = false;
  private connecting = false;
  private lastError: string | null = null;
  private lastMessageAt = 0;
  private reconnectDelay = 2_000;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private cleanupTimer: NodeJS.Timeout | null = null;

  start() {
    if (this.started) return;
    this.started = true;

    if (!this.apiKey) {
      this.lastError = "AISSTREAM_API_KEY not set.";
      return;
    }

    this.connect();
    this.cleanupTimer = setInterval(() => this.pruneStale(), CLEANUP_INTERVAL_MS);
    this.cleanupTimer.unref?.();
  }

  getSnapshot(maxVessels = DEFAULT_MAX_VESSELS): VesselSnapshot {
    const max = clamp(Math.trunc(maxVessels) || DEFAULT_MAX_VESSELS, 20, 800);
    this.pruneStale();

    const sorted = Array.from(this.vessels.values()).sort((a, b) => b.lastReport - a.lastReport);
    const sampled = sampleEvenly(sorted, max);
    const stale = this.lastMessageAt > 0 && Date.now() - this.lastMessageAt > STALE_VESSEL_MS;

    let message = "AIS stream connected.";
    if (!this.apiKey) message = "Set AISSTREAM_API_KEY to enable live vessels.";
    else if (this.connected) message = "AIS stream live.";
    else if (this.connecting) message = "Connecting to AIS stream...";
    else message = "Reconnecting to AIS stream...";

    return {
      source: "AISStream",
      configured: Boolean(this.apiKey),
      connected: this.connected,
      connecting: this.connecting,
      asOf: this.lastMessageAt ? new Date(this.lastMessageAt).toISOString() : null,
      total: sorted.length,
      message,
      vessels: sampled,
      stale,
      error: this.lastError,
    };
  }

  private connect() {
    if (!this.apiKey || this.connecting || this.connected) return;
    this.connecting = true;

    const ws = new WebSocket(AIS_STREAM_URL);
    this.ws = ws;

    ws.on("open", () => {
      this.connecting = false;
      this.connected = true;
      this.lastError = null;
      this.reconnectDelay = 2_000;

      ws.send(
        JSON.stringify({
          APIKey: this.apiKey,
          BoundingBoxes: this.boundingBoxes,
          FilterMessageTypes: [
            "PositionReport",
            "StandardClassBPositionReport",
            "ExtendedClassBPositionReport",
          ],
        })
      );
    });

    ws.on("message", (data: WebSocket.RawData) => {
      try {
        const message = JSON.parse(data.toString());
        const vessel = normalizeVesselMessage(message);
        if (!vessel) return;

        this.vessels.set(vessel.id, vessel);
        this.lastMessageAt = vessel.lastReport;

        if (this.vessels.size > MAX_STORED_VESSELS) {
          this.trimOldest(MAX_STORED_VESSELS);
        }
      } catch {
        // Ignore malformed payloads from stream.
      }
    });

    ws.on("error", () => {
      this.lastError = "AIS websocket connection error.";
    });

    ws.on("close", () => {
      this.connected = false;
      this.connecting = false;
      this.scheduleReconnect();
    });
  }

  private scheduleReconnect() {
    if (!this.apiKey || this.reconnectTimer) return;

    const delay = this.reconnectDelay;
    this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30_000);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
    this.reconnectTimer.unref?.();
  }

  private pruneStale() {
    const cutoff = Date.now() - STALE_VESSEL_MS;
    for (const [id, vessel] of this.vessels.entries()) {
      if (vessel.lastReport < cutoff) this.vessels.delete(id);
    }
  }

  private trimOldest(limit: number) {
    if (this.vessels.size <= limit) return;

    const entries = Array.from(this.vessels.values()).sort((a, b) => a.lastReport - b.lastReport);
    const removeCount = entries.length - limit;
    for (let i = 0; i < removeCount; i += 1) {
      this.vessels.delete(entries[i].id);
    }
  }
}

const globalForAIS = globalThis as typeof globalThis & { __aisStreamManager?: AISStreamManager };

export function getAISStreamManager(): AISStreamManager {
  if (!globalForAIS.__aisStreamManager) {
    globalForAIS.__aisStreamManager = new AISStreamManager();
  }
  return globalForAIS.__aisStreamManager;
}
