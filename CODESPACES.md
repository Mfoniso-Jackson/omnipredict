# Codespaces Guide

OmniPredict is optimized to run in GitHub Codespaces as a Next.js App Router project.

## Launch

1. Open the GitHub repo.
2. Select **Code** -> **Codespaces** -> **Create codespace on main**.
3. Wait for the dev container to finish `postCreateCommand`.
4. The dev server starts automatically on port `4173`.
5. Open the forwarded port preview labeled **OmniPredict dashboard**.

## Manual Commands

```bash
npm run dev:codespace
npm run check
npm run typecheck
```

The `dev:codespace` script binds to `0.0.0.0` so the forwarded port is reachable from the browser preview.

## Anchor Toolchain

Milestone 8 includes an optional Anchor/Solana bootstrap script:

```bash
npm run contracts:install
npm run contracts:doctor
npm run contracts:build
npm run contracts:test
```

The devcontainer runs the Anchor bootstrap after the app check, but treats toolchain installation as optional so the Next.js preview still opens if external installers are temporarily unavailable.

## What The Container Does

- Uses the official Node 22 devcontainer image.
- Installs GitHub CLI support through a devcontainer feature.
- Installs npm dependencies and runs type/lint checks after creation.
- Attempts to install Rust, Solana CLI, Anchor CLI, and contract dependencies.
- Starts the Next.js dev server on attach.
- Auto-forwards port `4173` and opens the preview.

## Troubleshooting

If the preview is blank, run:

```bash
npm run dev:codespace
```

If a port is already in use, run:

```bash
npm run dev -- --hostname 0.0.0.0 --port 4174
```

Then open the newly forwarded port from the Codespaces **Ports** tab.
