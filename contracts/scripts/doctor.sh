#!/usr/bin/env bash
set -euo pipefail

missing=0

check() {
  local name="$1"
  local command="$2"

  if command -v "${command}" >/dev/null 2>&1; then
    echo "ok: ${name} -> $(${command} --version | head -n 1)"
  else
    echo "missing: ${name} (${command})"
    missing=1
  fi
}

check "Rust" "rustc"
check "Cargo" "cargo"
check "Solana CLI" "solana"
check "Anchor CLI" "anchor"

if [ "${missing}" -ne 0 ]; then
  echo
  echo "Run: npm run contracts:install"
  exit 1
fi

echo
echo "Contract toolchain is ready."
