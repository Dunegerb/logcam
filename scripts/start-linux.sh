#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RAM_TMP="/dev/shm/portable-agent-$USER"

mkdir -p "$RAM_TMP"
export AGENT_TMP_DIR="$RAM_TMP"
export AGENT_LOW_RAM=1

cd "$ROOT_DIR"
if [ ! -d node_modules ]; then
  npm install
fi

node src/main.js
