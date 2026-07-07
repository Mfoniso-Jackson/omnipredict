import { expectedValue } from "../analytics/market-engine.js";

export function summarizePortfolio(positions) {
  const rows = positions.map((position) => ({
    ...position,
    evValue: expectedValue(position.model, position.odds),
    payout: position.stake * position.odds
  }));

  return {
    rows,
    exposure: rows.reduce((sum, position) => sum + position.stake, 0),
    expectedReturn: rows.reduce((sum, position) => sum + position.stake * position.evValue, 0),
    worstCase: rows.reduce((sum, position) => sum + position.stake, 0),
    maxPayout: rows.reduce((sum, position) => sum + position.payout, 0)
  };
}
