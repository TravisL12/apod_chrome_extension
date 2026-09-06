#!/usr/bin/env sh
# Captures and composes the Chrome Web Store screenshots.
#
# The extension build is pinned to Node 14 (node-sass), but puppeteer-core
# needs 18+. npm puts its own Node 14 bin dir first on PATH, so the shim in
# this directory is bypassed -- resolve the newer Node explicitly instead.
set -e
cd "$(dirname "$0")"

if command -v nodenv >/dev/null 2>&1; then
  # nodenv resolves the version from NODENV_DIR, which npm has already set
  # to the repo root (Node 14); point it at this directory instead.
  NODE="$(NODENV_DIR="$PWD" NODENV_VERSION= nodenv which node)"
else
  NODE=node
fi

if [ ! -d node_modules ]; then
  echo "Installing screenshot tooling deps..."
  npm install --silent
fi

if [ "$1" = "--seed-only" ]; then
  "$NODE" fetch-seed.js
  exit 0
fi

"$NODE" capture.js
"$NODE" compose.js
