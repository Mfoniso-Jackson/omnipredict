import assert from "node:assert/strict";
import {
  bestSignal,
  expectedValue,
  kellyFraction,
  marketProbability,
  movementSeverity,
  normalizeBook
} from "../src/analytics/market-engine.js";
import { explainMarketMove } from "../src/ai/explanation-engine.js";
import { matches, positions } from "../src/data/mock-txline.js";
import { summarizePortfolio } from "../src/portfolio/portfolio-engine.js";
import { canSettle, createSettlementReceipt } from "../src/settlement/settlement-engine.js";

const englandBrazil = matches[0];
const probabilities = normalizeBook(englandBrazil.odds);

assert.equal(Math.round(marketProbability(2) * 100), 50);
assert.equal(Math.round((probabilities.home + probabilities.draw + probabilities.away) * 1000), 1000);

const englandEv = expectedValue(englandBrazil.fair.home, englandBrazil.odds.home);
assert.ok(englandEv > 0.17 && englandEv < 0.18);

assert.equal(kellyFraction(0.99, 10), 0.05, "Kelly output should be capped at 5%.");
assert.equal(kellyFraction(0.1, 1.5), 0, "Negative Kelly output should floor at 0%.");

assert.equal(movementSeverity(2.08, 1.75).isSharp, true);
assert.equal(bestSignal(englandBrazil).name, "England");
assert.ok(explainMarketMove(englandBrazil).includes("implied probability"));

const portfolio = summarizePortfolio(positions);
assert.equal(portfolio.exposure, 715);
assert.ok(portfolio.expectedReturn > 60 && portfolio.expectedReturn < 62);

const receipt = createSettlementReceipt(englandBrazil);
assert.equal(receipt.asset, "USDC");
assert.equal(canSettle(receipt), true);

console.log("analytics tests passed");
