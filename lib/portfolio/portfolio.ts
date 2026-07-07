import type { PredictionPosition } from "@/types";
import { expectedValue } from "@/lib/analytics/market";

export function summarizePortfolio(positions: PredictionPosition[]) {
  const enriched = positions.map((position) => ({
    ...position,
    expectedValue: expectedValue(position.modelProbability, position.odds),
    potentialPayout: position.stake * position.odds
  }));

  return {
    positions: enriched,
    exposure: enriched.reduce((sum, position) => sum + position.stake, 0),
    expectedReturn: enriched.reduce((sum, position) => sum + position.stake * position.expectedValue, 0),
    maxPayout: enriched.reduce((sum, position) => sum + position.potentialPayout, 0)
  };
}
