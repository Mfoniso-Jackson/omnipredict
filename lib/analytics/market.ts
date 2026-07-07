import type { MatchEvent, MarketMovementSignal, OddsHistoryPoint, OddsSnapshot } from "@/types";

export interface OutcomeAnalysis {
  outcome: string;
  decimalOdds: number;
  impliedProbability: number;
  marketProbability: number;
  modelProbability: number;
  edge: number;
  expectedValue: number;
  kellyFraction: number;
  confidenceScore: number;
}

export const KELLY_CAP = 0.05;

export function impliedProbability(decimalOdds: number): number {
  if (decimalOdds <= 1) {
    throw new Error("Decimal odds must be greater than 1.");
  }

  return 1 / decimalOdds;
}

export function expectedValue(modelProbability: number, decimalOdds: number): number {
  return modelProbability * decimalOdds - 1;
}

export function kellyCriterion(modelProbability: number, decimalOdds: number, cap = KELLY_CAP): number {
  const netOdds = decimalOdds - 1;
  if (netOdds <= 0) return 0;

  const fraction = (netOdds * modelProbability - (1 - modelProbability)) / netOdds;
  return Math.max(0, Math.min(fraction, cap));
}

export function confidenceScore(edge: number, sourceConfidence: number): number {
  const edgeWeight = Math.min(Math.abs(edge) / 0.08, 1);
  return Math.max(0, Math.min(sourceConfidence * (0.55 + edgeWeight * 0.45), 1));
}

export function normalizeOverround(odds: Record<string, number>): Record<string, number> {
  const raw = Object.fromEntries(
    Object.entries(odds).map(([outcome, decimalOdds]) => [outcome, impliedProbability(decimalOdds)])
  );
  const total = Object.values(raw).reduce((sum, probability) => sum + probability, 0);

  return Object.fromEntries(Object.entries(raw).map(([outcome, probability]) => [outcome, probability / total]));
}

export function analyzeOdds(snapshot: OddsSnapshot): OutcomeAnalysis[] {
  const marketProbabilities = normalizeOverround(snapshot.odds);

  return Object.entries(snapshot.odds).map(([outcome, decimalOdds]) => {
    const modelProbability = snapshot.fairProbability[outcome] ?? marketProbabilities[outcome] ?? 0;
    const marketProbability = marketProbabilities[outcome] ?? impliedProbability(decimalOdds);

    return {
      outcome,
      decimalOdds,
      impliedProbability: impliedProbability(decimalOdds),
      marketProbability,
      modelProbability,
      edge: modelProbability - marketProbability,
      expectedValue: expectedValue(modelProbability, decimalOdds),
      kellyFraction: kellyCriterion(modelProbability, decimalOdds),
      confidenceScore: confidenceScore(modelProbability - marketProbability, snapshot.confidence)
    };
  });
}

export function findBestOpportunity(snapshots: OddsSnapshot[]): OutcomeAnalysis | undefined {
  return snapshots.flatMap((snapshot) => analyzeOdds(snapshot)).sort((a, b) => b.expectedValue - a.expectedValue)[0];
}

export function detectMovement(
  history: OddsHistoryPoint[],
  events: MatchEvent[],
  threshold = 0.08
): MarketMovementSignal | undefined {
  if (history.length < 2) return undefined;

  const sorted = [...history].sort((a, b) => a.minute - b.minute);
  const previous = sorted[0];
  const current = sorted[sorted.length - 1];
  const deltaPercent = (current.odds - previous.odds) / previous.odds;
  const direction = Math.abs(deltaPercent) < 0.01 ? "flat" : deltaPercent < 0 ? "shortened" : "drifted";
  const relatedEvent = events.some((event) => Math.abs(event.minute - current.minute) <= 4 && event.type !== "odds_move");
  const isSharp = Math.abs(deltaPercent) >= threshold;

  if (!isSharp) return undefined;

  return {
    matchId: current.matchId,
    marketId: current.marketId,
    outcome: current.outcome,
    previousOdds: previous.odds,
    currentOdds: current.odds,
    deltaPercent,
    direction,
    explained: relatedEvent,
    label: relatedEvent ? "Event-linked sharp movement" : "Unexplained market movement"
  };
}

export function historyToProbabilitySeries(history: OddsHistoryPoint[]) {
  return [...history]
    .sort((a, b) => a.minute - b.minute)
    .map((point) => ({
      minute: point.minute,
      marketProbability: impliedProbability(point.odds),
      modelProbability: point.modelProbability
    }));
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function formatSignedPercent(value: number): string {
  const percent = value * 100;
  return `${percent >= 0 ? "+" : ""}${percent.toFixed(1)}%`;
}

export function formatMoney(value: number): string {
  return `$${Math.round(value).toLocaleString()}`;
}
