import { NextResponse } from "next/server";
import { txlineClient } from "@/lib/txline/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = await txlineClient.getStatus();
  const matches = await txlineClient.getMatches();

  return NextResponse.json({
    status,
    summary: {
      matches: matches.length,
      liveMatches: matches.filter((match) => match.status === "live").length,
      source: status.source
    }
  });
}
