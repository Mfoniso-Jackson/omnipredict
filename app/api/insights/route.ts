import { NextResponse } from "next/server";
import { generateMarketInsight } from "@/lib/ai/insights";
import { txlineMockClient } from "@/lib/txline/mockClient";

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
  const match = txlineMockClient.getMatch(matchId);

  if (!match) {
    return NextResponse.json({ error: "Match not found" }, { status: 404 });
  }

  const insight = await generateMarketInsight({
    match,
    odds: txlineMockClient.getOddsForMatch(match.id),
    events: txlineMockClient.getEventsForMatch(match.id),
    history: txlineMockClient.getOddsHistoryForMatch(match.id)
  });

  return NextResponse.json({ insight });
}
