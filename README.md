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
npm install
npm run dev
```

Open `http://127.0.0.1:4173`.

The current milestone adds the AI intelligence layer: structured deterministic explanations by default, OpenAI-ready generation when `OPENAI_API_KEY` is present, and a typed `/api/insights` route.

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
lib/txline/                     Mock TxLINE client boundary
lib/portfolio/                  Portfolio exposure and return logic
lib/settlement/                 Settlement receipt helpers
types/                          Shared TypeScript domain types
data/                           Mock TxLINE-style World Cup fixtures
contracts/                      Solana/Anchor settlement integration boundary
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
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `SOLANA_CLUSTER=devnet`

## Live TxLINE Upgrade Path

Replace the mock client in `lib/txline/mockClient.ts` with calls to the official TxLINE World Cup REST/SSE endpoints. The UI already expects:

- `listMatches()`
- match lookup by ID
- odds snapshots
- match events
- prediction positions
- settlement receipts

The mock data mirrors the requested hackathon primitives: World Cup scores, match events, consensus odds, odds movement, red cards, settlement outcomes, and Merkle proof placeholders.

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

## Milestones

Completed:

1. Foundation: Next.js App Router, TypeScript, Tailwind, shadcn/ui-ready structure, mock TxLINE data, and starter routes.
2. Analytics depth: Kelly sizing, confidence scoring, movement detection, EV ranking, and probability history charts.
3. AI intelligence: structured insight generation, deterministic fallback, OpenAI-ready API route, and richer match explanations.

Planned next:

1. TxLINE integration: live World Cup REST/SSE client behind environment switches.
2. Settlement: Solana devnet receipt flow and Anchor integration path.
3. Polish: responsive QA, accessibility pass, demo video flow, and Vercel deployment.

## Settlement Upgrade Path

The frontend settlement page displays a simulated receipt. `contracts/anchor-stub/settlement-program.rs` shows the intended Anchor program shape for devnet integration.

The intended production path is to CPI into TxLINE's `validate_stat` instruction, verify the submitted proof, mark the prediction market outcome, and release supported escrow assets such as USDC. OmniPredict does not use the internal TxLINE credit token for peer-to-peer transfers.
