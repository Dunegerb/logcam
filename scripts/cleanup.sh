#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
rm -rf "$ROOT_DIR/.tmp"
if [ -d /dev/shm/portable-agent-$USER ]; then
  rm -rf /dev/shm/portable-agent-$USER
fi
echo "Memória temporária limpa."
