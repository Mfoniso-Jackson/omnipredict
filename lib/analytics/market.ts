import type { OddsSnapshot } from "@/types";

export interface OutcomeAnalysis {
  outcome: string;
  decimalOdds: number;
  impliedProbability: number;
  marketProbability: number;
  modelProbability: number;
  edge: number;
  expectedValue: number;
}

export function impliedProbability(decimalOdds: number): number {
  if (decimalOdds <= 1) {
    throw new Error("Decimal odds must be greater than 1.");
  }

  return 1 / decimalOdds;
}

export function expectedValue(modelProbability: number, decimalOdds: number): number {
  return modelProbability * decimalOdds - 1;
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
      expectedValue: expectedValue(modelProbability, decimalOdds)
    };
  });
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
