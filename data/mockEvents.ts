import type { AIInsight, MatchEvent, PredictionPosition, SettlementReceipt } from "@/types";

export const mockEvents: MatchEvent[] = [
  {
    id: "event-eng-bra-12",
    matchId: "eng-bra",
    minute: 12,
    type: "goal",
    teamId: "brazil",
    title: "Brazil goal",
    description: "Brazil opened the scoring from a transition chance.",
    txlineEventHash: "0xe12a9f"
  },
  {
    id: "event-eng-bra-51",
    matchId: "eng-bra",
    minute: 51,
    type: "red_card",
    teamId: "brazil",
    title: "Brazil red card",
    description: "TxLINE event hash captured after a last-defender foul.",
    txlineEventHash: "0x51baf0"
  },
  {
    id: "event-eng-bra-67",
    matchId: "eng-bra",
    minute: 67,
    type: "odds_move",
    title: "Unexplained odds drift",
    description: "Brazil price drifted without a matching visible match event.",
    txlineEventHash: "0x67c0de"
  },
  {
    id: "event-arg-fra-41",
    matchId: "arg-fra",
    minute: 41,
    type: "odds_move",
    title: "Draw probability rising",
    description: "The market is pricing a tighter first-half state.",
    txlineEventHash: "0x41d1a7"
  }
];

export const mockInsights: AIInsight[] = [
  {
    id: "insight-eng-bra-68",
    matchId: "eng-bra",
    generatedAt: "2026-07-07T21:18:02.000Z",
    title: "England remains slightly underpriced",
    mode: "mock",
    summary:
      "England's implied probability increased after Brazil's red card. The move is directionally justified, but OmniPredict still sees a modest gap between market price and fair value.",
    sentiment: "bullish_home",
    confidence: 0.91,
    drivers: ["Brazil red card", "England goal pressure", "Positive expected value gap"],
    riskNotes: ["Late-match volatility remains high", "Mock data is not a live trading signal"],
    recommendation: "Monitor the England winner market, but cap sizing with Kelly risk controls."
  },
  {
    id: "insight-arg-fra-44",
    matchId: "arg-fra",
    generatedAt: "2026-07-08T19:44:02.000Z",
    title: "Market is close to efficient",
    mode: "mock",
    summary:
      "Argentina and France are trading near model fair value. The draw is gaining as the first half closes without a goal.",
    sentiment: "balanced",
    confidence: 0.76,
    drivers: ["Low-scoring first half", "Balanced xG profile", "Draw probability rising"],
    riskNotes: ["One goal can quickly reprice all outcomes", "No high-conviction edge detected"],
    recommendation: "Treat this as a watchlist market rather than a high-priority opportunity."
  }
];

export const mockPositions: PredictionPosition[] = [
  {
    id: "position-1",
    matchId: "eng-bra",
    marketId: "eng-bra-winner",
    outcome: "England",
    stake: 410,
    odds: 1.75,
    modelProbability: 0.67,
    openedAt: "2026-07-07T21:19:00.000Z"
  },
  {
    id: "position-2",
    matchId: "arg-fra",
    marketId: "arg-fra-winner",
    outcome: "Draw",
    stake: 180,
    odds: 2.72,
    modelProbability: 0.34,
    openedAt: "2026-07-08T19:45:00.000Z"
  }
];

export const mockSettlementReceipts: SettlementReceipt[] = [
  {
    id: "receipt-eng-bra",
    matchId: "eng-bra",
    marketId: "eng-bra-winner",
    verifiedOutcome: "England win",
    proofHash: "0x8d4a7e0cb782c14f19a5e3bcd91fae72942d7b32",
    status: "verified",
    validationPath: ["TxLINE proof", "validate_stat CPI", "settlement program", "USDC payout"],
    settledAsset: "USDC",
    explorerUrl: "https://explorer.solana.com/?cluster=devnet"
  }
];
