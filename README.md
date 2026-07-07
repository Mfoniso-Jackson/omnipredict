# OmniPredict

OmniPredict is a TxLINE World Cup hackathon demo: Bloomberg-style market intelligence for prediction markets with implied probabilities, AI-style explanations, EV signals, Kelly sizing, portfolio simulation, and a Solana settlement receipt flow.

## Hackathon Context

Built for the TxODDS World Cup TxLINE Prediction Markets and Settlement track on Superteam Earn.

- Submission deadline: July 19, 2026 at 23:59 UTC.
- Winner announcement: July 29, 2026 at 15:00 UTC.
- Required submission assets: demo video, public repo, working deployed app or endpoint, technical documentation, and TxLINE API feedback.
- See `SUBMISSION.md` and `DEMO.md` for judging criteria alignment and the demo video outline.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://127.0.0.1:4173`.

The current milestone makes OmniPredict submission-ready: demo runbook, deployment guide, health endpoint, polished docs, and stable judge-facing API checks.

Submission helpers:

- `DEMO.md` for the five-minute walkthrough.
- `DEPLOYMENT.md` for Vercel and post-deploy checks.
- `/api/health` for one-command runtime verification.

## GitHub Codespaces

This repo includes a devcontainer optimized for Codespaces. Create a codespace on `main`; it will run checks, start the dev server, forward port `4173`, and open the OmniPredict dashboard preview.

Manual Codespaces command:

```bash
npm run dev:codespace
```

See `CODESPACES.md` for details.

## Scripts

```bash
npm run dev        # Next.js dev server on port 4173
npm run build      # production build
npm run start      # serve production build on port 4173
npm run lint       # ESLint
npm run typecheck  # TypeScript checks
npm run check      # typecheck + lint
```

## Project Structure

```text
app/                            App Router pages and layout
components/                     Reusable UI and market components
lib/analytics/                  Probability, EV, Kelly, confidence, and odds movement logic
lib/ai/                         Structured mock insight helpers
lib/txline/                     TxLINE adapter, mock client, live REST client, and status types
lib/portfolio/                  Portfolio exposure and return logic
lib/settlement/                 Settlement receipt helpers and devnet-ready simulation engine
types/                          Shared TypeScript domain types
data/                           Mock TxLINE-style World Cup fixtures
contracts/                      Solana/Anchor settlement integration boundary
DEMO.md                         Five-minute demo runbook and API smoke tests
DEPLOYMENT.md                   Vercel and post-deploy verification guide
```

See `ARCHITECTURE.md` for the layered system design, module ownership, and milestone plan.

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
- `TXLINE_API_KEY`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `SOLANA_CLUSTER=devnet`
- `SETTLEMENT_PROGRAM_ID`
- `TXLINE_ORACLE_ACCOUNT`
- `SETTLEMENT_ESCROW_VAULT`

## TxLINE Adapter

The UI now depends on `lib/txline/client.ts`, not directly on fixture data. Local and judge demos stay on the mock adapter unless live mode is explicitly enabled:

```bash
TXLINE_LIVE=true
TXLINE_API_BASE=https://api.txline.example
```

The live adapter in `lib/txline/liveClient.ts` normalizes REST payloads into OmniPredict domain types and falls back to mock data if a live request is empty or unavailable. The UI expects:

- `getMatches()`
- match lookup by ID
- odds snapshots
- match events
- prediction positions
- settlement receipts

The mock data mirrors the requested hackathon primitives: World Cup scores, match events, consensus odds, odds movement, red cards, settlement outcomes, and Merkle proof placeholders.

Inspection endpoints:

```bash
curl http://127.0.0.1:4173/api/health
curl http://127.0.0.1:4173/api/txline/status
curl -N http://127.0.0.1:4173/api/txline/stream
```

## AI Intelligence Layer

The current AI layer lives in `lib/ai/insights.ts` and `app/api/insights/route.ts`.

- Without `OPENAI_API_KEY`, OmniPredict uses a deterministic fallback.
- With `OPENAI_API_KEY`, the API route is ready to request structured JSON from OpenAI.
- The UI surfaces the insight mode, drivers, risk notes, confidence, and recommendation.

Example:

```bash
curl -X POST http://127.0.0.1:4173/api/insights \
  -H "Content-Type: application/json" \
  -d '{"matchId":"eng-bra"}'
```

## Settlement Engine

Milestone 5 adds a functional settlement API and page flow without requiring a local Solana toolchain. The simulation creates the same receipt metadata the Anchor program should emit later: proof hash, validated outcome, payout amount, receipt account, keeper authority, TxLINE oracle account, escrow vault, transaction signature, and explorer URL.

Examples:

```bash
curl http://127.0.0.1:4173/api/settlement

curl -X POST http://127.0.0.1:4173/api/settlement \
  -H "Content-Type: application/json" \
  -d '{"matchId":"eng-bra","outcome":"England win","proofHash":"0x8d4a7e0cb782c14f19a5e3bcd91fae72942d7b32","stake":250,"odds":1.75,"asset":"USDC"}'
```

## Milestones

Completed:

1. Foundation: Next.js App Router, TypeScript, Tailwind, shadcn/ui-ready structure, mock TxLINE data, and starter routes.
2. Analytics depth: Kelly sizing, confidence scoring, movement detection, EV ranking, and probability history charts.
3. AI intelligence: structured insight generation, deterministic fallback, OpenAI-ready API route, and richer match explanations.
4. TxLINE integration: adapter contract, mock/live selection, REST normalization, fallback behavior, status endpoint, and SSE snapshot endpoint.
5. Settlement: proof request payloads, deterministic devnet-ready receipt simulation, payout math, settlement API route, and Anchor CPI documentation.
6. Submission readiness: demo runbook, deployment guide, health endpoint, in-app API docs, and production verification checks.

Planned next:

1. Anchor workspace: compile the settlement program and add program tests.
2. Live integration hardening: validate official TxLINE payloads, deploy, and record the final demo.

## Settlement Upgrade Path

The frontend settlement page displays a devnet-ready simulated receipt. `contracts/anchor-stub/settlement-program.rs` shows the intended Anchor program shape for devnet integration.

The intended production path is to CPI into TxLINE's `validate_stat` instruction, verify the submitted proof, mark the prediction market outcome, and release supported escrow assets such as USDC. OmniPredict does not use the internal TxLINE credit token for peer-to-peer transfers.
