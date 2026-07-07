# OmniPredict Architecture

OmniPredict is designed as a production-quality MVP for the TxODDS World Cup hackathon. The current build includes Milestone 1 foundation work, Milestone 2 analytics depth, Milestone 3 AI intelligence, Milestone 4 TxLINE adapter integration, and Milestone 5 settlement simulation.

## Product Positioning

OmniPredict is not a betting application. It is an AI decision-support system for prediction market intelligence:

- Why did the market move?
- What probability is implied?
- Does the market appear efficient?
- Where is positive expected value?
- What is the risk-adjusted position size?
- Can settlement be verified?

## Layered System

```text
Presentation Layer
  app/, components/, app/globals.css

Business Logic Layer
  route composition and view orchestration

Analytics Layer
  lib/analytics/market.ts

AI Intelligence Layer
  lib/ai/insights.ts
  app/api/insights/route.ts

Market Data Layer
  lib/txline/client.ts
  lib/txline/liveClient.ts
  lib/txline/mockClient.ts
  app/api/txline/status/route.ts
  app/api/txline/stream/route.ts
  data/mockMatches.ts
  data/mockOdds.ts
  data/mockEvents.ts

Portfolio Layer
  lib/portfolio/portfolio.ts

Settlement Layer
  lib/settlement/receipts.ts
  lib/settlement/engine.ts
  app/api/settlement/route.ts
  contracts/anchor-stub/settlement-program.rs

Domain Contracts
  types/index.ts
```

Each layer should be replaceable without forcing a rewrite of the others. UI code must not call TxLINE endpoints directly; it should depend on adapter interfaces.

## Module Responsibilities

### Analytics

Pure, independently testable calculations:

- implied probability
- overround normalization
- expected value
- Kelly Criterion with risk cap
- odds movement severity
- market inefficiency ranking
- confidence scoring
- probability history series

### AI Intelligence

Structured explanation modules:

- Market Observer: tracks events, cards, substitutions, score, and odds deltas.
- Explanation Engine: generates concise natural-language movement summaries.
- Sentiment Classifier: turns probability gaps into market sentiment.

The current implementation is deterministic for demo reliability when `OPENAI_API_KEY` is absent. `app/api/insights/route.ts` is OpenAI-ready and returns the same `AIInsight` contract either way.

### TxLINE Adapter

All TxLINE integration belongs behind a client/service boundary:

```ts
getStatus(): Promise<TxlineAdapterStatus>
getMatches(): Promise<Match[]>
getMatch(id): Promise<Match | undefined>
getOddsForMatch(matchId): Promise<OddsSnapshot[]>
getEventsForMatch(matchId): Promise<MatchEvent[]>
```

The live adapter consumes World Cup REST payloads when `TXLINE_LIVE=true` and `TXLINE_API_BASE` is present. The mock adapter remains the default for judge demos and local tests. `/api/txline/status` exposes the active mode, and `/api/txline/stream` emits an SSE-compatible snapshot event for deployment checks.

### Portfolio

Calculates:

- exposure
- expected return
- worst case
- max payout
- position-level EV

### Settlement

The settlement pipeline is:

```text
Prediction -> Collateral -> TxLINE Validation -> Settlement -> Receipt
```

The MVP shows a devnet-ready simulated receipt and exposes `/api/settlement` for GET/POST proof settlement payloads. The Anchor path should CPI into TxLINE's `validate_stat` instruction, verify the proof, and release supported escrow assets such as USDC. The internal TxLINE credit token must not be used for peer-to-peer transfers.

## TypeScript

The app uses strict TypeScript and shared domain contracts in `types/index.ts`.

Recommended TypeScript settings:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true
  }
}
```

## Milestones

1. Foundation: project shell, repo, docs, scripts, mock data, and starter routes.
2. Analytics Engine: pure calculations, Kelly sizing, confidence scoring, movement detection, and charts.
3. AI Insights: structured explanation modules, deterministic fallback, OpenAI-ready API route.
4. TxLINE Integration: live REST/SSE adapter behind environment switches.
5. Settlement: proof request payloads, deterministic devnet-ready receipts, payout math, API route, and Anchor CPI documentation.
6. Anchor Implementation: compile the devnet program and add tests for valid, invalid, duplicate, and losing settlements.
7. Polish: accessibility, responsive QA, demo video script, Vercel deployment.

## Route Structure

Target structure:

```text
app/
  page.tsx
  dashboard/page.tsx
  match/[id]/page.tsx
  portfolio/page.tsx
  settlement/page.tsx
  docs/page.tsx
  api/insights/route.ts
  api/settlement/route.ts
  api/txline/status/route.ts
  api/txline/stream/route.ts
components/
  ui/
  market/
lib/
  analytics/
  ai/
  txline/
  portfolio/
  settlement/
types/
data/
```

Mock data remains the default. Live TxLINE and OpenAI integrations enter through `lib/` boundaries, not directly inside presentation components.

## Accessibility and Performance

- Prefer semantic HTML and named controls.
- Keep color contrast high.
- Use keyboard-friendly links, buttons, and form inputs.
- Memoize expensive calculations in React views after migration.
- Keep AI calls server-side and cache by match ID plus odds snapshot hash.
