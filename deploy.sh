#!/usr/bin/env bash
# Production redeploy: pull, install, build, (re)start under pm2.
# Run from the repo root on the server.
set -euo pipefail

git pull --ff-only
npm ci
npm run build

echo "Deployed. Build output is in dist/."
