# Codespaces Guide

OmniPredict is optimized to run in GitHub Codespaces without installing project dependencies.

## Launch

1. Open the GitHub repo.
2. Select **Code** -> **Codespaces** -> **Create codespace on main**.
3. Wait for the dev container to finish `postCreateCommand`.
4. The dev server starts automatically on port `4173`.
5. Open the forwarded port preview labeled **OmniPredict dashboard**.

## Manual Commands

```bash
npm run dev -- --host 0.0.0.0 --port 4173
npm run check
npm test
```

Use `0.0.0.0` inside Codespaces so the forwarded port is reachable from the browser preview.

## What The Container Does

- Uses the official Node 22 devcontainer image.
- Installs GitHub CLI support through a devcontainer feature.
- Runs syntax checks and unit tests after creation.
- Starts the static OmniPredict server on attach.
- Auto-forwards port `4173` and opens the preview.

## Troubleshooting

If the preview is blank, run:

```bash
npm run dev -- --host 0.0.0.0 --port 4173
```

If a port is already in use, run:

```bash
npm run dev -- --host 0.0.0.0 --port 4174
```

Then open the newly forwarded port from the Codespaces **Ports** tab.
