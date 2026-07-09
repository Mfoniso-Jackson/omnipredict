#!/usr/bin/env bash
set -euo pipefail

ANCHOR_VERSION="${ANCHOR_VERSION:-0.30.1}"
SOLANA_VERSION="${SOLANA_VERSION:-stable}"

if ! command -v rustup >/dev/null 2>&1; then
  curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
fi

export PATH="${HOME}/.cargo/bin:${HOME}/.local/share/solana/install/active_release/bin:${PATH}"

rustup component add rustfmt clippy

if ! command -v solana >/dev/null 2>&1; then
  sh -c "$(curl -sSfL "https://release.solana.com/${SOLANA_VERSION}/install")"
fi

if ! command -v avm >/dev/null 2>&1; then
  cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
fi

if ! command -v anchor >/dev/null 2>&1 || ! anchor --version | grep -q "${ANCHOR_VERSION}"; then
  avm install "${ANCHOR_VERSION}"
  avm use "${ANCHOR_VERSION}"
fi

solana config set --url devnet

npm --prefix contracts install

echo "Anchor $(anchor --version)"
echo "Solana $(solana --version)"
