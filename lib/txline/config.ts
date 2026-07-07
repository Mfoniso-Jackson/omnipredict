import type { TxlineAdapterStatus } from "@/lib/txline/types";

export function isTxlineLiveEnabled() {
  return process.env.TXLINE_LIVE === "true" && Boolean(process.env.TXLINE_API_BASE);
}

export function createMockStatus(fallbackReason?: string): TxlineAdapterStatus {
  return {
    mode: fallbackReason ? "live-fallback" : "mock",
    source: fallbackReason ? "Mock fallback after live adapter miss" : "TxLINE Mock",
    liveEnabled: isTxlineLiveEnabled(),
    apiBase: process.env.TXLINE_API_BASE,
    sseUrl: process.env.TXLINE_SSE_URL,
    lastSyncAt: new Date().toISOString(),
    fallbackReason
  };
}
