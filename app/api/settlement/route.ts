import { NextResponse } from "next/server";
import { createSettlementRequest, simulateSettlement } from "@/lib/settlement/engine";
import { txlineClient } from "@/lib/txline/client";
import type { SettlementProofRequest } from "@/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const matches = await txlineClient.getMatches();
  const [match] = matches;

  if (!match) {
    return NextResponse.json({ error: "No match data available" }, { status: 404 });
  }

  const request = createSettlementRequest(match);
  return NextResponse.json(simulateSettlement(request));
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as Partial<SettlementProofRequest>;

  if (!body.matchId) {
    return NextResponse.json({ error: "matchId is required" }, { status: 400 });
  }

  const match = await txlineClient.getMatch(body.matchId);
  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const settlementRequest = createSettlementRequest(match, body);
  return NextResponse.json(simulateSettlement(settlementRequest));
}
