import { mockInsights } from "@/data/mockEvents";
import {
  analyzeOdds,
  detectMovement,
  findBestOpportunity,
  formatPercent,
  formatSignedPercent
} from "@/lib/analytics/market";
import type { AIInsight, Match, MatchEvent, OddsHistoryPoint, OddsSnapshot } from "@/types";

export interface MarketInsightContext {
  match: Match;
  odds: OddsSnapshot[];
  events: MatchEvent[];
  history: OddsHistoryPoint[];
}

interface OpenAIInsightResponse {
  title?: string;
  summary?: string;
  sentiment?: AIInsight["sentiment"];
  confidence?: number;
  drivers?: string[];
  riskNotes?: string[];
  recommendation?: string;
}

interface OpenAIResponsePayload {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
    }>;
  }>;
}

export function buildInsightContext(match: Match, odds: OddsSnapshot[], events: MatchEvent[], history: OddsHistoryPoint[]) {
  const opportunity = findBestOpportunity(odds);
  const movement = detectMovement(history, events);
  const markets = odds.map((snapshot) => ({
    marketId: snapshot.marketId,
    confidence: snapshot.confidence,
    outcomes: analyzeOdds(snapshot).map((row) => ({
      outcome: row.outcome,
      odds: row.decimalOdds,
      marketProbability: row.marketProbability,
      modelProbability: row.modelProbability,
      expectedValue: row.expectedValue,
      kellyFraction: row.kellyFraction,
      confidenceScore: row.confidenceScore
    }))
  }));

  return {
    match: {
      id: match.id,
      status: match.status,
      minute: match.minute,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      score: match.score,
      round: match.round
    },
    markets,
    topOpportunity: opportunity
      ? {
          outcome: opportunity.outcome,
          expectedValue: opportunity.expectedValue,
          kellyFraction: opportunity.kellyFraction,
          confidenceScore: opportunity.confidenceScore
        }
      : null,
    movement,
    events: events.map((event) => ({
      minute: event.minute,
      type: event.type,
      title: event.title,
      description: event.description
    }))
  };
}

export function getInsightForMatch(match: Match): AIInsight {
  return (
    mockInsights.find((insight) => insight.matchId === match.id) ?? {
      id: `insight-${match.id}`,
      matchId: match.id,
      generatedAt: new Date().toISOString(),
      mode: "deterministic",
      title: "Market state is being monitored",
      summary:
        "OmniPredict is tracking score, odds, and event movement. No high-conviction inefficiency has been detected in the latest mock snapshot.",
      sentiment: "balanced",
      confidence: 0.64,
      drivers: ["Mock TxLINE match state", "Consensus odds snapshot", "No major event-linked repricing"],
      riskNotes: ["Use this as decision support only", "Live TxLINE integration is not enabled yet"],
      recommendation: "Keep monitoring until a clearer probability gap appears."
    }
  );
}

export function generateDeterministicInsight({ match, odds, events, history }: MarketInsightContext): AIInsight {
  const existing = mockInsights.find((insight) => insight.matchId === match.id);
  const opportunity = findBestOpportunity(odds);
  const movement = detectMovement(history, events);
  const latestEvent = [...events].sort((a, b) => b.minute - a.minute)[0];

  if (!opportunity) {
    return existing ?? getInsightForMatch(match);
  }

  const sentiment = opportunity.expectedValue > 0.08 ? inferSentiment(match, opportunity.outcome) : "balanced";
  const movementText = movement
    ? `${movement.label.toLowerCase()} moved ${movement.outcome} odds ${movement.direction}`
    : "no sharp unexplained movement is above threshold";

  return {
    id: `insight-${match.id}-deterministic`,
    matchId: match.id,
    generatedAt: new Date().toISOString(),
    mode: "deterministic",
    title: `${opportunity.outcome} is the top model edge`,
    summary: `${opportunity.outcome} shows ${formatSignedPercent(opportunity.expectedValue)} expected value with ${formatPercent(
      opportunity.confidenceScore
    )} confidence. ${movementText}. The latest event context is ${latestEvent?.title.toLowerCase() ?? "limited"}.`,
    sentiment,
    confidence: opportunity.confidenceScore,
    drivers: [
      `${formatSignedPercent(opportunity.expectedValue)} expected value`,
      `${formatPercent(opportunity.kellyFraction)} Kelly allocation after cap`,
      movement ? movement.label : "Stable market movement"
    ],
    riskNotes: [
      "Mock data only; live TxLINE is not connected in this milestone",
      "Late match events can invalidate apparent edges quickly"
    ],
    recommendation:
      opportunity.kellyFraction > 0
        ? `If simulated, keep stake at or below ${formatPercent(opportunity.kellyFraction)} of bankroll.`
        : "No simulated allocation is recommended from the current snapshot."
  };
}

export async function generateMarketInsight(context: MarketInsightContext): Promise<AIInsight> {
  if (!process.env.OPENAI_API_KEY) {
    return generateDeterministicInsight(context);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
        input: [
          {
            role: "system",
            content:
              "You are OmniPredict's market intelligence analyst. Return concise JSON only. Do not encourage reckless betting. Explain probability, edge, risk, and confidence."
          },
          {
            role: "user",
            content: JSON.stringify(buildInsightContext(context.match, context.odds, context.events, context.history))
          }
        ],
        text: {
          format: {
            type: "json_object"
          }
        }
      })
    });

    if (!response.ok) {
      return generateDeterministicInsight(context);
    }

    const payload = (await response.json()) as OpenAIResponsePayload;
    const parsed = parseOpenAIInsight(extractOutputText(payload));
    if (!parsed) {
      return generateDeterministicInsight(context);
    }

    return {
      id: `insight-${context.match.id}-openai`,
      matchId: context.match.id,
      generatedAt: new Date().toISOString(),
      mode: "openai",
      title: parsed.title ?? "AI market insight",
      summary: parsed.summary ?? generateDeterministicInsight(context).summary,
      sentiment: parsed.sentiment ?? "balanced",
      confidence: clampProbability(parsed.confidence ?? generateDeterministicInsight(context).confidence),
      drivers: parsed.drivers ?? generateDeterministicInsight(context).drivers,
      riskNotes: parsed.riskNotes ?? generateDeterministicInsight(context).riskNotes,
      recommendation: parsed.recommendation ?? generateDeterministicInsight(context).recommendation
    };
  } catch {
    return generateDeterministicInsight(context);
  }
}

function parseOpenAIInsight(outputText?: string): OpenAIInsightResponse | undefined {
  if (!outputText) return undefined;

  try {
    return JSON.parse(outputText) as OpenAIInsightResponse;
  } catch {
    return undefined;
  }
}

function extractOutputText(payload: OpenAIResponsePayload): string | undefined {
  return payload.output_text ?? payload.output?.flatMap((item) => item.content ?? []).find((content) => content.text)?.text;
}

function inferSentiment(match: Match, outcome: string): AIInsight["sentiment"] {
  if (outcome === match.homeTeam.name) return "bullish_home";
  if (outcome === match.awayTeam.name) return "bullish_away";
  return "balanced";
}

function clampProbability(value: number): number {
  return Math.max(0, Math.min(value, 1));
}
