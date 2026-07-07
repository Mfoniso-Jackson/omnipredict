import type { Match, MatchEvent, Market, OddsHistoryPoint, OddsSnapshot, PredictionPosition, SettlementReceipt } from "@/types";

export type TxlineMode = "mock" | "live" | "live-fallback";

export interface TxlineAdapterStatus {
  mode: TxlineMode;
  source: string;
  liveEnabled: boolean;
  apiBase?: string;
  sseUrl?: string;
  lastSyncAt: string;
  fallbackReason?: string;
}

export interface TxlineClient {
  getStatus(): Promise<TxlineAdapterStatus>;
  getMatches(): Promise<Match[]>;
  getMatch(id: string): Promise<Match | undefined>;
  getMarketsForMatch(matchId: string): Promise<Market[]>;
  getOddsForMatch(matchId: string): Promise<OddsSnapshot[]>;
  getOddsHistoryForMatch(matchId: string): Promise<OddsHistoryPoint[]>;
  getEventsForMatch(matchId: string): Promise<MatchEvent[]>;
  getPositions(): Promise<PredictionPosition[]>;
  getSettlementReceipts(): Promise<SettlementReceipt[]>;
}
