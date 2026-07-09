# OmniPredict Deployment Guide

OmniPredict is ready for Vercel, Codespaces, or any Node 18+ host that can run Next.js.

## Vercel

Recommended settings:

```text
Framework preset: Next.js
Build command: npm run build
Install command: npm install
Output directory: .next
Node.js: 18 or newer
```

The repo includes `vercel.json` with these defaults.

Environment variables:

```bash
MOCK_MODE=true
TXLINE_LIVE=false
TXLINE_API_BASE=https://api.txline.example
TXLINE_SSE_URL=https://api.txline.example/world-cup/events
TXLINE_API_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
SOLANA_CLUSTER=devnet
SETTLEMENT_PROGRAM_ID=Fg6PaFpoGXkYsidMpWxTWqkVg7j1j6x4VJ5L9XQ3o5y
TXLINE_ORACLE_ACCOUNT=TxLINEOracle111111111111111111111111111111111
SETTLEMENT_ESCROW_VAULT=OmniPredictEscrow11111111111111111111111111111
```

For the judging demo, keep `TXLINE_LIVE=false` unless official TxLINE credentials and stable endpoints are available.

## Post-Deploy Checks

Replace `APP_URL` with the deployed URL:

```bash
curl APP_URL/api/health
curl APP_URL/api/txline/status
curl APP_URL/api/settlement
```

Open these routes in a browser:

```text
/
/dashboard
/match/eng-bra
/portfolio
/settlement
/docs
```

## Production Notes

- The app uses deterministic mock data by default to keep the demo stable.
- Live TxLINE mode is enabled only when `TXLINE_LIVE=true` and `TXLINE_API_BASE` are present.
- AI calls remain server-side through `/api/insights`.
- Settlement is simulated until the Anchor workspace is compiled and deployed to devnet.
- Contract build/test commands live behind `npm run contracts:build` and `npm run contracts:test`; they require Anchor and Solana CLI.
