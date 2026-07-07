# OmniPredict Hackathon Submission Notes

These notes align OmniPredict with the TxODDS World Cup TxLINE Prediction Markets and Settlement track on Superteam Earn.

## Track Fit

- Track: World Cup TxODDS Prediction Markets and Settlement.
- Sponsor: TxODDS.
- Submission deadline: July 19, 2026 at 23:59 UTC.
- Winner announcement: July 29, 2026 at 15:00 UTC.
- Required artifacts: demo video up to five minutes, public GitHub repo, working deployed app or functional API/devnet endpoint, brief technical documentation, and TxLINE API feedback.
- Submission support files: `DEMO.md`, `DEPLOYMENT.md`, `ARCHITECTURE.md`, and this `SUBMISSION.md`.

## Core Interpretation

OmniPredict is positioned as a prediction market intelligence dashboard rather than a wagering-only interface. It uses TxLINE-shaped World Cup data as the primary source for:

- Real-time match state.
- Scores and match events.
- Consensus odds snapshots.
- Implied probability calculations.
- Market movement detection.
- Settlement receipts and proof hashes.

## Judging Criteria Mapping

### Core Functionality

The app includes a `MockTxlineAdapter` that mirrors a live TxLINE SSE/World Cup endpoint shape. It can be switched to a live adapter through:

- `MOCK_MODE=true`
- `TXLINE_LIVE=false`
- `TXLINE_API_BASE`
- `TXLINE_SSE_URL`

Readiness checks:

```bash
curl /api/health
curl /api/txline/status
curl /api/settlement
```

### User Experience and Use Case

The UI is built around soccer fans, analysts, and builders who need to understand prediction markets:

- Live match dashboard.
- Implied probabilities.
- AI-style market explanations.
- Fair value and expected value panels.
- Kelly sizing with a 5% risk cap.
- Portfolio exposure and expected return.
- Settlement receipt screen.

### Code Quality and Logic

The deterministic market logic lives in `lib/analytics/market.ts` and is supported by strict TypeScript checks.

The master engineering brief is reflected in the repo through separate analytics, AI, portfolio, TxLINE client, settlement, and domain-contract modules. `ARCHITECTURE.md` documents the Next.js/TypeScript architecture and milestone plan.

## TxLINE Data Plan

The current demo uses realistic mock data with the same integration boundary a live TxLINE source should satisfy:

```js
listMatches()
listPositions()
subscribe(callback)
```

Live integration should wire:

- World Cup matches endpoint.
- Real-time SSE stream for scores, events, and odds.
- Odds snapshots endpoint or stream payload.
- Publicly verifiable proof or Merkle receipt endpoint, where available.

References from the bounty:

- Quickstart: https://txline.txodds.com/documentation/quickstart
- World Cup docs: https://txline.txodds.com/documentation/worldcup

## Settlement Plan

The bounty encourages custom on-chain settlement engines that use TxLINE proofs. OmniPredict includes a devnet-ready settlement simulation at `/api/settlement`, an Anchor workspace scaffold under `contracts/programs/omnipredict_settlement`, and the original Anchor-shaped reference under `contracts/anchor-stub/settlement-program.rs`.

Intended production settlement:

1. TxLINE publishes final outcome and proof hash.
2. A user or keeper submits the proof to the settlement program.
3. The program performs a CPI into TxLINE's `validate_stat` instruction.
4. The market is marked settled.
5. Escrow releases supported assets, such as USDC, to winning token accounts.

Important constraint: OmniPredict does not use the internal TxLINE credit token for peer-to-peer transfers, staking, wagering pools, or wallet transfers.

## Demo Video Outline

1. Problem: prediction markets move quickly, but users need explanations and trust.
2. Dashboard: show live TxLINE-style matches, score, time, odds, probabilities, and sentiment.
3. Match page: show event timeline, probability chart, AI explanation feed, EV table, and Kelly sizing.
4. Sharp movement detector: show unexplained market movement when odds move without a visible match event.
5. Portfolio: show simulated exposure, expected return, downside, and P/L.
6. Settlement: show TxLINE proof hash, verified outcome, market ID, payout math, receipt account, and simulated Solana devnet signature.
7. Technical close: explain mock-to-live TxLINE adapter, Anchor workspace scaffold, and settlement upgrade path.

See `DEMO.md` for the timed walkthrough and copy-paste API smoke tests.

## Feedback for Submission Form

What worked well:

- A single normalized JSON schema makes it straightforward to model dashboards, market analytics, and settlement receipts.
- SSE-style updates are a strong fit for live odds movement and probability dashboards.
- Solana-anchored proof receipts and the `/api/settlement` payload give the product a clear trust story.

Potential friction:

- Since submissions close before or around the final live review window, demo data and replay tooling are important for judges.
- Official endpoint examples for settlement proof payloads and `validate_stat` CPI accounts would make on-chain integration faster.
