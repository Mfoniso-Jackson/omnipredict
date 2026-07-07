import { mockEvents, mockPositions, mockSettlementReceipts } from "@/data/mockEvents";
import { mockMatches } from "@/data/mockMatches";
import { mockMarkets, mockOddsSnapshots } from "@/data/mockOdds";

export const txlineMockClient = {
  getMatches: () => mockMatches,
  getMatch: (id: string) => mockMatches.find((match) => match.id === id),
  getMarketsForMatch: (matchId: string) => mockMarkets.filter((market) => market.matchId === matchId),
  getOddsForMatch: (matchId: string) => mockOddsSnapshots.filter((snapshot) => snapshot.matchId === matchId),
  getEventsForMatch: (matchId: string) => mockEvents.filter((event) => event.matchId === matchId),
  getPositions: () => mockPositions,
  getSettlementReceipts: () => mockSettlementReceipts
};
