# OmniPredict Deployment Guide

OmniPredict is ready for Vercel, Codespaces, or any Node 18+ host that can run Next.js.

Production domain: `https://omnipredict.network`

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
NEXT_PUBLIC_APP_URL=https://omnipredict.network
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

## Domain Setup

Add these domains to the Vercel project:

```text
omnipredict.network
www.omnipredict.network
```

Recommended DNS records:

```text
A     @     76.76.21.21
CNAME www   cname.vercel-dns.com
```

Wait for Vercel to issue HTTPS certificates before submitting the final URL.

## Post-Deploy Checks

```bash
curl https://omnipredict.network/api/health
curl https://omnipredict.network/api/txline/status
curl https://omnipredict.network/api/settlement
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
