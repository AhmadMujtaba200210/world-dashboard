import { NextRequest, NextResponse } from "next/server";
import { getOpenSkySnapshot } from "@/lib/server/opensky";

const DEFAULT_MAX = 180;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseMax(raw: string | null): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_MAX;
  return Math.min(Math.max(Math.trunc(parsed), 1), 600);
}

export async function GET(request: NextRequest) {
  const max = parseMax(request.nextUrl.searchParams.get("max"));
  const snapshot = await getOpenSkySnapshot(max);

  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
