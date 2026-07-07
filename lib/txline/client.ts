import { createMockStatus, isTxlineLiveEnabled } from "@/lib/txline/config";
import { TxlineLiveClient } from "@/lib/txline/liveClient";
import { txlineMockClient } from "@/lib/txline/mockClient";
import type { TxlineClient } from "@/lib/txline/types";

const liveClient =
  isTxlineLiveEnabled() && process.env.TXLINE_API_BASE
    ? new TxlineLiveClient(process.env.TXLINE_API_BASE, process.env.TXLINE_SSE_URL)
    : undefined;

export const txlineClient: TxlineClient = liveClient ? withMockFallback(liveClient) : txlineMockClient;

function withMockFallback(live: TxlineClient): TxlineClient {
  return {
    async getStatus() {
      try {
        const [status, matches] = await Promise.all([live.getStatus(), live.getMatches()]);

        if (matches.length === 0) {
          return createMockStatus("Live TxLINE adapter returned no matches");
        }

        return status;
      } catch (error) {
        return createMockStatus(getErrorMessage(error));
      }
    },
    async getMatches() {
      return fallback(() => live.getMatches(), () => txlineMockClient.getMatches());
    },
    async getMatch(id) {
      return fallback(() => live.getMatch(id), () => txlineMockClient.getMatch(id));
    },
    async getMarketsForMatch(matchId) {
      return fallback(() => live.getMarketsForMatch(matchId), () => txlineMockClient.getMarketsForMatch(matchId));
    },
    async getOddsForMatch(matchId) {
      return fallback(() => live.getOddsForMatch(matchId), () => txlineMockClient.getOddsForMatch(matchId));
    },
    async getOddsHistoryForMatch(matchId) {
      return fallback(() => live.getOddsHistoryForMatch(matchId), () => txlineMockClient.getOddsHistoryForMatch(matchId));
    },
    async getEventsForMatch(matchId) {
      return fallback(() => live.getEventsForMatch(matchId), () => txlineMockClient.getEventsForMatch(matchId));
    },
    async getPositions() {
      return fallback(() => live.getPositions(), () => txlineMockClient.getPositions());
    },
    async getSettlementReceipts() {
      return fallback(() => live.getSettlementReceipts(), () => txlineMockClient.getSettlementReceipts());
    }
  };
}

async function fallback<T>(liveRead: () => Promise<T>, mockRead: () => Promise<T>) {
  try {
    const result = await liveRead();

    if (Array.isArray(result) && result.length === 0) {
      return mockRead();
    }

    return result;
  } catch {
    return mockRead();
  }
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown TxLINE adapter error";
}
