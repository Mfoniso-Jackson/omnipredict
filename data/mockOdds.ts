import type { Market, OddsHistoryPoint, OddsSnapshot } from "@/types";

export const mockMarkets: Market[] = [
  {
    id: "eng-bra-winner",
    matchId: "eng-bra",
    type: "winner",
    label: "Match Winner",
    outcomes: ["England", "Draw", "Brazil"]
  },
  {
    id: "eng-bra-total",
    matchId: "eng-bra",
    type: "total_goals",
    label: "Total Goals 2.5",
    outcomes: ["Over 2.5", "Under 2.5"]
  },
  {
    id: "arg-fra-winner",
    matchId: "arg-fra",
    type: "winner",
    label: "Match Winner",
    outcomes: ["Argentina", "Draw", "France"]
  },
  {
    id: "usa-esp-winner",
    matchId: "usa-esp",
    type: "winner",
    label: "Match Winner",
    outcomes: ["United States", "Draw", "Spain"]
  }
];

export const mockOddsSnapshots: OddsSnapshot[] = [
  {
    id: "odds-eng-bra-68",
    matchId: "eng-bra",
    marketId: "eng-bra-winner",
    capturedAt: "2026-07-07T21:18:00.000Z",
    source: "TxLINE Mock",
    odds: { England: 1.75, Draw: 12.5, Brazil: 4.25 },
    fairProbability: { England: 0.67, Draw: 0.07, Brazil: 0.26 },
    confidence: 0.91
  },
  {
    id: "odds-eng-bra-total-68",
    matchId: "eng-bra",
    marketId: "eng-bra-total",
    capturedAt: "2026-07-07T21:18:00.000Z",
    source: "TxLINE Mock",
    odds: { "Over 2.5": 1.58, "Under 2.5": 2.42 },
    fairProbability: { "Over 2.5": 0.69, "Under 2.5": 0.31 },
    confidence: 0.86
  },
  {
    id: "odds-arg-fra-44",
    matchId: "arg-fra",
    marketId: "arg-fra-winner",
    capturedAt: "2026-07-08T19:44:00.000Z",
    source: "TxLINE Mock",
    odds: { Argentina: 2.9, Draw: 2.72, France: 2.62 },
    fairProbability: { Argentina: 0.33, Draw: 0.34, France: 0.33 },
    confidence: 0.76
  },
  {
    id: "odds-usa-esp-pre",
    matchId: "usa-esp",
    marketId: "usa-esp-winner",
    capturedAt: "2026-07-09T17:30:00.000Z",
    source: "TxLINE Mock",
    odds: { "United States": 3.65, Draw: 3.42, Spain: 2.05 },
    fairProbability: { "United States": 0.29, Draw: 0.27, Spain: 0.44 },
    confidence: 0.68
  }
];

export const mockOddsHistory: OddsHistoryPoint[] = [
  {
    id: "hist-eng-bra-eng-12",
    matchId: "eng-bra",
    marketId: "eng-bra-winner",
    outcome: "England",
    minute: 12,
    capturedAt: "2026-07-07T20:12:00.000Z",
    odds: 2.28,
    modelProbability: 0.44
  },
  {
    id: "hist-eng-bra-eng-33",
    matchId: "eng-bra",
    marketId: "eng-bra-winner",
    outcome: "England",
    minute: 33,
    capturedAt: "2026-07-07T20:33:00.000Z",
    odds: 2.08,
    modelProbability: 0.51
  },
  {
    id: "hist-eng-bra-eng-51",
    matchId: "eng-bra",
    marketId: "eng-bra-winner",
    outcome: "England",
    minute: 51,
    capturedAt: "2026-07-07T21:06:00.000Z",
    odds: 1.92,
    modelProbability: 0.58
  },
  {
    id: "hist-eng-bra-eng-62",
    matchId: "eng-bra",
    marketId: "eng-bra-winner",
    outcome: "England",
    minute: 62,
    capturedAt: "2026-07-07T21:12:00.000Z",
    odds: 1.81,
    modelProbability: 0.64
  },
  {
    id: "hist-eng-bra-eng-68",
    matchId: "eng-bra",
    marketId: "eng-bra-winner",
    outcome: "England",
    minute: 68,
    capturedAt: "2026-07-07T21:18:00.000Z",
    odds: 1.75,
    modelProbability: 0.67
  },
  {
    id: "hist-arg-fra-draw-12",
    matchId: "arg-fra",
    marketId: "arg-fra-winner",
    outcome: "Draw",
    minute: 12,
    capturedAt: "2026-07-08T19:12:00.000Z",
    odds: 3.05,
    modelProbability: 0.3
  },
  {
    id: "hist-arg-fra-draw-28",
    matchId: "arg-fra",
    marketId: "arg-fra-winner",
    outcome: "Draw",
    minute: 28,
    capturedAt: "2026-07-08T19:28:00.000Z",
    odds: 2.88,
    modelProbability: 0.32
  },
  {
    id: "hist-arg-fra-draw-44",
    matchId: "arg-fra",
    marketId: "arg-fra-winner",
    outcome: "Draw",
    minute: 44,
    capturedAt: "2026-07-08T19:44:00.000Z",
    odds: 2.72,
    modelProbability: 0.34
  }
];
