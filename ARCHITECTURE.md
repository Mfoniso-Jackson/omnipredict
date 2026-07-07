# OmniPredict Architecture

OmniPredict is designed as a production-quality MVP for the TxODDS World Cup hackathon. The current build is Milestone 1: a Next.js App Router, TypeScript, Tailwind CSS, ESLint, and shadcn/ui-ready foundation powered by mock TxLINE-style World Cup data.

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

Market Data Layer
  lib/txline/mockClient.ts
  data/mockMatches.ts
  data/mockOdds.ts
  data/mockEvents.ts

Portfolio Layer
  lib/portfolio/portfolio.ts

Settlement Layer
  lib/settlement/receipts.ts
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

### AI Intelligence

Structured explanation modules:

- Market Observer: tracks events, cards, substitutions, score, and odds deltas.
- Explanation Engine: generates concise natural-language movement summaries.
- Sentiment Classifier: turns probability gaps into market sentiment.

The current implementation is deterministic for demo reliability. A production version should move this behind an App Router API route and call OpenAI with structured match snapshots.

### TxLINE Adapter

All TxLINE integration belongs behind a client/service boundary:

```ts
getMatches(): Match[]
getMatch(id): Match | undefined
getOddsForMatch(matchId): OddsSnapshot[]
getEventsForMatch(matchId): MatchEvent[]
```

The live adapter should consume the World Cup REST/SSE feed, while the mock adapter should remain available for judge demos and local tests.

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

The MVP shows a simulated receipt. The Anchor path should CPI into TxLINE's `validate_stat` instruction, verify the proof, and release supported escrow assets such as USDC. The internal TxLINE credit token must not be used for peer-to-peer transfers.

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

1. Foundation: project shell, repo, docs, scripts, mock data, tests.
2. Analytics Engine: pure calculations and unit tests.
3. Dashboard: live match cards, probability bars, EV, sentiment, confidence.
4. AI Insights: structured explanation modules, then OpenAI API route.
5. TxLINE Integration: live REST/SSE adapter behind environment switches.
6. Settlement: mocked receipt, then Anchor devnet program and TxLINE `validate_stat` CPI.
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

Milestone 1 intentionally uses mock data only. Live TxLINE and OpenAI integrations should enter through `lib/` boundaries, not directly inside pages.

## Accessibility and Performance

- Prefer semantic HTML and named controls.
- Keep color contrast high.
- Use keyboard-friendly links, buttons, and form inputs.
- Memoize expensive calculations in React views after migration.
- Keep AI calls server-side and cache by match ID plus odds snapshot hash.
