export type MatchStatus = "Live" | "Upcoming" | "Final";
export type SettlementStatus = "Pending" | "Verified" | "Paid";

export interface DecimalOdds {
  home: number;
  draw: number;
  away: number;
  over25: number;
  under25: number;
}

export interface FairProbabilities {
  home: number;
  draw: number;
  away: number;
  over25: number;
  under25: number;
}

export interface TxlineMatch {
  id: string;
  home: string;
  away: string;
  group: string;
  status: MatchStatus;
  minute: number;
  score: [number, number];
  xg: [number, number];
  bankrollDefault: number;
  odds: DecimalOdds;
  fair: FairProbabilities;
  previousOdds: Pick<DecimalOdds, "home" | "draw" | "away">;
  sentiment: string;
  confidence: number;
  events: Array<[string, string]>;
  snapshots: number[];
  proofHash: string;
}

export interface PortfolioPosition {
  matchId: string;
  market: string;
  stake: number;
  odds: number;
  model: number;
}

export interface SettlementReceipt {
  verifiedOutcome: string;
  proofHash: string;
  matchId: string;
  marketId: string;
  asset: string;
  status: SettlementStatus;
  validationPath: string;
}

export interface TxlineAdapter {
  listMatches(): Promise<TxlineMatch[]>;
  listPositions(): Promise<PortfolioPosition[]>;
  subscribe(callback: (event: { type: string; receivedAt: string; match: TxlineMatch }) => void): () => void;
}
