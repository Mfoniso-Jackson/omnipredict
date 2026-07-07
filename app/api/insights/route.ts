import { NextResponse } from "next/server";
import { generateMarketInsight } from "@/lib/ai/insights";
import { txlineClient } from "@/lib/txline/client";

interface InsightRequestBody {
  matchId?: string;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as InsightRequestBody;
  const matchId = body.matchId ?? "eng-bra";

  return createInsightResponse(matchId);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const matchId = url.searchParams.get("matchId") ?? "eng-bra";

  return createInsightResponse(matchId);
}

async function createInsightResponse(matchId: string) {
  const match = await txlineClient.getMatch(matchId);

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const [odds, events, history] = await Promise.all([
    txlineClient.getOddsForMatch(match.id),
    txlineClient.getEventsForMatch(match.id),
    txlineClient.getOddsHistoryForMatch(match.id)
  ]);
  const insight = await generateMarketInsight({
    match,
    odds,
    events,
    history
  });

  return NextResponse.json({ insight });
}
