# OmniPredict Settlement Contracts

This folder is the integration boundary for a Solana devnet settlement program.

The current hackathon demo uses a deterministic devnet-ready settlement receipt in the frontend and `/api/settlement`. The intended production flow is:

1. TxLINE publishes final match outcome and proof hash.
2. A verifier validates the proof hash against the trusted TxLINE oracle account.
3. The settlement program marks the market outcome as final.
4. Escrow releases payouts to winning token accounts.

## Anchor Stub

The `anchor-stub/settlement-program.rs` file is pseudocode shaped like an Anchor program. It includes the intended `validate_stat` CPI accounts, payout fields, and duplicate-settlement guard. It is not compiled yet because this dependency-free demo does not install Anchor or Solana toolchains.

Recommended next steps:

- Initialize an Anchor workspace under `contracts/`.
- Replace the pseudocode verifier with a real oracle/proof account check.
- Add program tests for winning, losing, duplicate settlement, and invalid proof cases.
- Replace the deterministic simulated signature with the real devnet transaction signature in `/settlement`.
