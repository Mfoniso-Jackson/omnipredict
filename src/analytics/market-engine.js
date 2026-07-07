export const KELLY_CAP = 0.05;

export function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

export function formatMoney(value) {
  return `$${Math.round(value).toLocaleString()}`;
}

export function marketProbability(decimalOdds) {
  if (decimalOdds <= 1) {
    throw new Error("Decimal odds must be greater than 1.");
  }
  return 1 / decimalOdds;
}

export function normalizeBook(odds) {
  const raw = {
    home: marketProbability(odds.home),
    draw: marketProbability(odds.draw),
    away: marketProbability(odds.away)
  };
  const total = raw.home + raw.draw + raw.away;
  return {
    home: raw.home / total,
    draw: raw.draw / total,
    away: raw.away / total
  };
}

export function expectedValue(probability, decimalOdds) {
  return probability * decimalOdds - 1;
}

export function kellyFraction(probability, decimalOdds, cap = KELLY_CAP) {
  const edge = ((decimalOdds - 1) * probability - (1 - probability)) / (decimalOdds - 1);
  return Math.max(0, Math.min(edge, cap));
}

export function movementSeverity(previousOdds, currentOdds, threshold = 0.12) {
  const delta = Math.abs(previousOdds - currentOdds) / previousOdds;
  return {
    delta,
    isSharp: delta > threshold
  };
}

export function buildMarketRows(match) {
  const probabilities = normalizeBook(match.odds);
  return [
    ["Winner", match.home, probabilities.home, match.fair.home, match.odds.home],
    ["Winner", "Draw", probabilities.draw, match.fair.draw, match.odds.draw],
    ["Winner", match.away, probabilities.away, match.fair.away, match.odds.away],
    ["Total Goals", "Over 2.5", marketProbability(match.odds.over25), match.fair.over25, match.odds.over25],
    ["Total Goals", "Under 2.5", marketProbability(match.odds.under25), match.fair.under25, match.odds.under25]
  ];
}

export function bestSignal(match) {
  return buildMarketRows(match)
    .map((row) => ({
      market: row[0],
      name: row[1],
      marketProbability: row[2],
      modelProbability: row[3],
      odds: row[4],
      value: expectedValue(row[3], row[4])
    }))
    .sort((a, b) => b.value - a.value)[0];
}

export function explainMarketMove(match) {
  const probabilities = normalizeBook(match.odds);
  const diff = match.fair.home - probabilities.home;
  const event = match.events.at(-1)?.[1] || "fresh TxLINE market update";
  const tone = Math.abs(diff) > 0.035 ? "The model sees a tradable gap" : "The market is close to fair value";
  const side = diff >= 0 ? match.home : match.away;
  const direction = diff >= 0 ? "underpriced" : "overextended";

  return `${match.home}'s implied probability is ${formatPercent(probabilities.home)}, while OmniPredict fair value is ${formatPercent(match.fair.home)}. ${tone}: ${side} is ${Math.abs(diff * 100).toFixed(1)} percentage points ${direction} after ${event.toLowerCase()}`;
}

export function summarizePortfolio(positions) {
  const rows = positions.map((position) => ({
    ...position,
    evValue: expectedValue(position.model, position.odds),
    payout: position.stake * position.odds
  }));
  return {
    rows,
    exposure: rows.reduce((sum, position) => sum + position.stake, 0),
    expectedReturn: rows.reduce((sum, position) => sum + position.stake * position.evValue, 0)
  };
}
