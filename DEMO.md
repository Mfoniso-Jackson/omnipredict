# OmniPredict Demo Runbook

Use this for a five-minute hackathon demo recording or live judge walkthrough.

## Demo Setup

```bash
npm install
npm run check
npm run dev
```

Open `http://127.0.0.1:4173`.

Recommended environment for the stable judge demo:

```bash
MOCK_MODE=true
TXLINE_LIVE=false
SOLANA_CLUSTER=devnet
```

Optional AI mode:

```bash
OPENAI_API_KEY=...
OPENAI_MODEL=gpt-4.1-mini
```

## Five-Minute Flow

1. Overview: open `/` and frame OmniPredict as market intelligence, not a betting interface.
2. Dashboard: open `/dashboard` and show live matches, TxLINE adapter mode, top EV, confidence, and sharp movement detection.
3. Match intelligence: open `/match/eng-bra` and show odds, model probability, EV, Kelly cap, probability history, AI explanation, drivers, risk notes, and TxLINE event hashes.
4. Portfolio: open `/portfolio` and show simulated exposure, expected return, max payout, and position-level EV.
5. Settlement: open `/settlement` and show proof hash, validate_stat path, payout, receipt account, oracle account, escrow vault, and simulated devnet transaction signature.
6. Technical close: open `/docs` and show API routes, adapter boundary, mock-to-live TxLINE plan, and Anchor upgrade path.

## API Checks

```bash
curl http://127.0.0.1:4173/api/health
curl http://127.0.0.1:4173/api/txline/status
curl -N http://127.0.0.1:4173/api/txline/stream
curl -X POST http://127.0.0.1:4173/api/insights \
  -H "Content-Type: application/json" \
  -d '{"matchId":"eng-bra"}'
curl -X POST http://127.0.0.1:4173/api/settlement \
  -H "Content-Type: application/json" \
  -d '{"matchId":"eng-bra","outcome":"England win","proofHash":"0x8d4a7e0cb782c14f19a5e3bcd91fae72942d7b32","stake":250,"odds":1.75,"asset":"USDC"}'
```

## Talking Points

- TxLINE is abstracted behind `lib/txline/client.ts`, so mock and live data use the same app contract.
- AI insight generation is deterministic by default and OpenAI-ready when an API key is present.
- Settlement is devnet-ready simulation today, with the Anchor CPI path documented in `contracts/anchor-stub/settlement-program.rs`.
- The product avoids internal TxLINE credit-token transfers and models supported settlement assets such as USDC.
