import { mockEvents, mockPositions, mockSettlementReceipts } from "@/data/mockEvents";
import { mockMatches } from "@/data/mockMatches";
import { mockMarkets, mockOddsHistory, mockOddsSnapshots } from "@/data/mockOdds";
import { createMockStatus } from "@/lib/txline/config";
import type { TxlineClient } from "@/lib/txline/types";

export const txlineMockClient: TxlineClient = {
  getStatus: async () => createMockStatus(),
  getMatches: async () => mockMatches,
  getMatch: async (id: string) => mockMatches.find((match) => match.id === id),
  getMarketsForMatch: async (matchId: string) => mockMarkets.filter((market) => market.matchId === matchId),
  getOddsForMatch: async (matchId: string) => mockOddsSnapshots.filter((snapshot) => snapshot.matchId === matchId),
  getOddsHistoryForMatch: async (matchId: string) => mockOddsHistory.filter((point) => point.matchId === matchId),
  getEventsForMatch: async (matchId: string) => mockEvents.filter((event) => event.matchId === matchId),
  getPositions: async () => mockPositions,
  getSettlementReceipts: async () => mockSettlementReceipts
};
