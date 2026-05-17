#!/bin/bash
# FREYRAUM — Update Gallery (macOS)
#
# Double-click this file to import the pictures you placed in
# customer-artworks/inbox/ into the gallery preview.
#
# First-run note: macOS Gatekeeper may block the first double-click. If
# nothing happens or you see a warning, right-click this file → Open → Open.
# After that one-time approval, normal double-click works.

set -e

cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  osascript -e 'display alert "Node.js not found" message "Please install Node.js (LTS) from https://nodejs.org and try again."' >/dev/null 2>&1 || \
    echo "Node.js is required. Please install it from https://nodejs.org and try again."
  exit 1
fi

node scripts/import-artworks.mjs
STATUS=$?

if [ -f "customer-artworks/last-import-report.txt" ]; then
  open "customer-artworks/last-import-report.txt" 2>/dev/null || true
fi

exit $STATUS
