import { matches, positions } from "../data/mock-txline.js";

export const adapterMode = {
  MOCK_MODE: true,
  TXLINE_LIVE: false
};

export class MockTxlineAdapter {
  async listMatches() {
    return structuredClone(matches);
  }

  async listPositions() {
    return structuredClone(positions);
  }

  subscribe(callback) {
    let tick = 0;
    const interval = setInterval(() => {
      const match = structuredClone(matches[tick % matches.length]);
      match.minute = Math.min(90, match.minute + tick);
      callback({
        type: "txline.odds.snapshot",
        receivedAt: new Date().toISOString(),
        match
      });
      tick += 1;
    }, 5000);

    return () => clearInterval(interval);
  }
}

export class LiveTxlineAdapter {
  constructor({ apiBase, sseUrl } = {}) {
    this.apiBase = apiBase;
    this.sseUrl = sseUrl;
  }

  async listMatches() {
    throw new Error("Live TxLINE integration requires TXLINE_API_BASE and endpoint wiring.");
  }

  async listPositions() {
    return [];
  }

  subscribe() {
    throw new Error("Live TxLINE SSE integration requires TXLINE_SSE_URL.");
  }
}

export function createTxlineAdapter(env = adapterMode) {
  if (env.TXLINE_LIVE) {
    return new LiveTxlineAdapter({
      apiBase: env.TXLINE_API_BASE,
      sseUrl: env.TXLINE_SSE_URL
    });
  }
  return new MockTxlineAdapter();
}
