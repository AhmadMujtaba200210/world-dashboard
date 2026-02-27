import { NextRequest, NextResponse } from "next/server";
import { getAISStreamManager } from "@/lib/server/ais-stream";

const DEFAULT_MAX = 240;

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function parseMax(raw: string | null): number {
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return DEFAULT_MAX;
  return Math.trunc(parsed);
}

export async function GET(request: NextRequest) {
  const manager = getAISStreamManager();
  manager.start();

  const max = parseMax(request.nextUrl.searchParams.get("max"));
  const snapshot = manager.getSnapshot(max);

  return NextResponse.json(snapshot, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
