# OmniPredict Settlement Contracts

This folder is the integration boundary for a Solana devnet settlement program.

The current hackathon demo uses a mocked settlement receipt in the frontend. The intended production flow is:

1. TxLINE publishes final match outcome and proof hash.
2. A verifier validates the proof hash against the trusted TxLINE oracle account.
3. The settlement program marks the market outcome as final.
4. Escrow releases payouts to winning token accounts.

## Anchor Stub

The `anchor-stub/settlement-program.rs` file is pseudocode shaped like an Anchor program. It is not compiled yet because this dependency-free demo does not install Anchor or Solana toolchains.

Recommended next steps:

- Initialize an Anchor workspace under `contracts/`.
- Replace the pseudocode verifier with a real oracle/proof account check.
- Add program tests for winning, losing, duplicate settlement, and invalid proof cases.
- Surface the devnet transaction signature in `/settlement`.
