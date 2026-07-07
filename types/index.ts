export type MatchStatus = "scheduled" | "live" | "halftime" | "final";

export type MarketType = "winner" | "total_goals" | "both_teams_score" | "first_scorer";

export type MatchEventType = "goal" | "red_card" | "yellow_card" | "substitution" | "odds_move" | "kickoff";

export type SettlementStatus = "pending" | "verified" | "paid";

export type SettlementMode = "simulated" | "devnet-ready";

export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  fifaRank: number;
}

export interface Match {
  id: string;
  competition: string;
  round: string;
  kickoffUtc: string;
  status: MatchStatus;
  minute: number;
  homeTeam: Team;
  awayTeam: Team;
  score: {
    home: number;
    away: number;
  };
  txlineMatchId: string;
  proofHash?: string;
}

export interface Market {
  id: string;
  matchId: string;
  type: MarketType;
  label: string;
  outcomes: string[];
}

export interface OddsSnapshot {
  id: string;
  matchId: string;
  marketId: string;
  capturedAt: string;
  source: "TxLINE Mock" | "TxLINE Live" | string;
  odds: Record<string, number>;
  fairProbability: Record<string, number>;
  confidence: number;
}

export interface OddsHistoryPoint {
  id: string;
  matchId: string;
  marketId: string;
  outcome: string;
  minute: number;
  capturedAt: string;
  odds: number;
  modelProbability: number;
}

export interface MarketMovementSignal {
  matchId: string;
  marketId: string;
  outcome: string;
  previousOdds: number;
  currentOdds: number;
  deltaPercent: number;
  direction: "shortened" | "drifted" | "flat";
  explained: boolean;
  label: string;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  minute: number;
  type: MatchEventType;
  teamId?: string;
  title: string;
  description: string;
  txlineEventHash: string;
}

export interface PredictionPosition {
  id: string;
  matchId: string;
  marketId: string;
  outcome: string;
  stake: number;
  odds: number;
  modelProbability: number;
  openedAt: string;
}

export interface AIInsight {
  id: string;
  matchId: string;
  generatedAt: string;
  mode: "mock" | "deterministic" | "openai";
  title: string;
  summary: string;
  sentiment: "bullish_home" | "bullish_away" | "balanced" | "volatile";
  confidence: number;
  drivers: string[];
  riskNotes: string[];
  recommendation: string;
}

export interface SettlementReceipt {
  id: string;
  matchId: string;
  marketId: string;
  verifiedOutcome: string;
  proofHash: string;
  status: SettlementStatus;
  validationPath: string[];
  settledAsset: "USDC" | "SOL" | "SIMULATED";
  mode?: SettlementMode;
  payoutAmount?: number;
  stake?: number;
  odds?: number;
  txSignature?: string;
  settledAt?: string;
  verifier?: string;
  cluster?: "devnet" | "testnet" | "mainnet-beta";
  explorerUrl?: string;
}

export interface SettlementProofRequest {
  matchId: string;
  marketId: string;
  outcome: string;
  proofHash: string;
  stake: number;
  odds: number;
  asset: "USDC" | "SOL";
  walletAddress?: string;
}

export interface SettlementSimulation {
  request: SettlementProofRequest;
  receipt: SettlementReceipt;
  proofValid: boolean;
  payoutAmount: number;
  programId: string;
  cluster: "devnet" | "testnet" | "mainnet-beta";
  accounts: {
    receipt: string;
    authority: string;
    txlineOracle: string;
    escrowVault: string;
  };
}
