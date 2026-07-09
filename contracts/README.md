# OmniPredict Settlement Contracts

This folder is the integration boundary for a Solana devnet settlement program.

The current hackathon demo uses a deterministic devnet-ready settlement receipt in the frontend and `/api/settlement`. The intended production flow is:

1. TxLINE publishes final match outcome and proof hash.
2. A verifier validates the proof hash against the trusted TxLINE oracle account.
3. The settlement program marks the market outcome as final.
4. Escrow releases payouts to winning token accounts.

## Anchor Workspace

Milestone 7 adds an Anchor workspace scaffold:

```text
Anchor.toml
Cargo.toml
programs/omnipredict_settlement/src/lib.rs
tests/settlement.ts
```

The program source includes:

- `settle_market` instruction.
- TxLINE `validate_stat` CPI account placeholders.
- receipt, authority, oracle, and escrow vault account fields.
- payout calculation with overflow checks.
- duplicate-settlement guard.
- `MarketSettled` event.

The original `anchor-stub/settlement-program.rs` file remains as a dependency-free reference copy.

## Local Anchor Commands

Run these after installing the Anchor and Solana toolchains:

```bash
cd contracts
npm install
anchor build
anchor test
```

From the repo root, the same flow is:

```bash
npm run contracts:install
npm run contracts:doctor
npm run contracts:build
npm run contracts:test
```

The main Next.js app does not require Anchor dependencies to build or run.

If pnpm reports ignored native build scripts, run `pnpm approve-builds` in an interactive terminal and approve only the packages you trust.

## Devnet Readiness

Before deploying for real:

1. Generate a deploy keypair and fund it on devnet.
2. Run `anchor keys sync` after replacing the placeholder program id.
3. Run `anchor build` and inspect the generated IDL.
4. Run `anchor test` against local validator.
5. Run `anchor deploy --provider.cluster devnet`.
6. Copy the deployed program id into `SETTLEMENT_PROGRAM_ID`.
7. Replace the simulated `/settlement` signature with the real devnet transaction signature.

Recommended next steps:

- Replace the placeholder verifier with a real TxLINE `validate_stat` CPI.
- Add program tests for winning, losing, and mismatched outcome cases once TxLINE proof fixtures are available.
- Replace the deterministic simulated signature with the real devnet transaction signature in `/settlement`.
