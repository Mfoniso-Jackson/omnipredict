# OmniPredict

OmniPredict is a TxLINE World Cup hackathon demo: Bloomberg-style market intelligence for prediction markets with implied probabilities, AI-style explanations, EV signals, Kelly sizing, portfolio simulation, and a Solana settlement receipt flow.

## Hackathon Context

Built for the TxODDS World Cup TxLINE Prediction Markets and Settlement track on Superteam Earn.

- Submission deadline: July 19, 2026 at 23:59 UTC.
- Winner announcement: July 29, 2026 at 15:00 UTC.
- Required submission assets: demo video, public repo, working deployed app or endpoint, technical documentation, and TxLINE API feedback.
- See `SUBMISSION.md` for judging criteria alignment and the demo video outline.

## Quick Start

```bash
npm run dev
```

Open `http://127.0.0.1:4173`.

This project is dependency-free for the demo build. It uses browser ES modules and Node's built-in HTTP server APIs.

## Scripts

```bash
npm run dev      # local static app server
npm run start    # same server pinned to 127.0.0.1:4173
npm run check    # JavaScript syntax checks
npm test         # analytics engine unit tests
```

## Project Structure

```text
app.js                         Browser UI and route rendering
styles.css                     Dashboard styling
src/adapters/txline-adapter.js Mock/live TxLINE adapter boundary
src/analytics/market-engine.js Probability, EV, Kelly, movement logic
src/data/mock-txline.js        Realistic World Cup mock data
tests/analytics.test.mjs       Dependency-free engine tests
contracts/                     Solana/Anchor settlement integration boundary
```

## Environment

Copy `.env.example` when wiring real services:

```bash
cp .env.example .env
```

Primary switches:

- `MOCK_MODE=true`
- `TXLINE_LIVE=false`
- `TXLINE_API_BASE`
- `TXLINE_SSE_URL`
- `OPENAI_API_KEY`
- `SOLANA_CLUSTER=devnet`

## Live TxLINE Upgrade Path

Replace `MockTxlineAdapter` in `src/adapters/txline-adapter.js` with calls to the official TxLINE World Cup REST/SSE endpoints. The UI already expects:

- `listMatches()`
- `listPositions()`
- `subscribe(callback)`

The mock data mirrors the requested hackathon primitives: World Cup scores, match events, consensus odds, odds movement, red cards, settlement outcomes, and Merkle proof placeholders.

## AI Upgrade Path

The current AI layer is deterministic and local via `explainMarketMove()`. For a production version, move that function behind a Next.js API route or FastAPI endpoint, pass the structured match and odds object to OpenAI, then cache insights by match ID and odds snapshot hash.

## Settlement Upgrade Path

The frontend settlement page displays a simulated receipt. `contracts/anchor-stub/settlement-program.rs` shows the intended Anchor program shape for devnet integration.

The intended production path is to CPI into TxLINE's `validate_stat` instruction, verify the submitted proof, mark the prediction market outcome, and release supported escrow assets such as USDC. OmniPredict does not use the internal TxLINE credit token for peer-to-peer transfers.
