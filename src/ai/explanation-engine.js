import { formatPercent, normalizeBook } from "../analytics/market-engine.js";

export function explainMarketMove(match) {
  const probabilities = normalizeBook(match.odds);
  const diff = match.fair.home - probabilities.home;
  const event = match.events.at(-1)?.[1] || "fresh TxLINE market update";
  const tone = Math.abs(diff) > 0.035 ? "The model sees a tradable gap" : "The market is close to fair value";
  const side = diff >= 0 ? match.home : match.away;
  const direction = diff >= 0 ? "underpriced" : "overextended";

  return `${match.home}'s implied probability is ${formatPercent(probabilities.home)}, while OmniPredict fair value is ${formatPercent(match.fair.home)}. ${tone}: ${side} is ${Math.abs(diff * 100).toFixed(1)} percentage points ${direction} after ${event.toLowerCase()}`;
}

export function classifyMarketSentiment(match) {
  const probabilities = normalizeBook(match.odds);
  const homeGap = match.fair.home - probabilities.home;

  if (homeGap > 0.035) return `Bullish ${match.home}`;
  if (homeGap < -0.035) return `Bullish ${match.away}`;
  return "Balanced, efficient";
}
