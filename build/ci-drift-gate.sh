#!/bin/bash
# ci-drift-gate.sh — the structural "no drift can ship" guarantee (audit permanent fix, 2026-07-21).
#
# Composes the two halves of drift protection into one gate:
#   1. GENERATE-side (prevent):  generate-derived.js --check
#        → fails if any GENERATED region (manifest §4 hex, §5 typo size) is stale vs its
#          authoritative source. This is the "generate, don't duplicate" half: the derived
#          values must equal what the generator would produce from source.
#   2. LINT-side (detect):       check-manifest-sync.js
#        → fails if any HAND-CURATED table that can't be generated (component keys vs registry,
#          RULE 25 hex table, registry variant vocab, MCP mapping vocab, typography cross-check)
#          has drifted. This covers the data that lives in no single source.
#
# Together: every class of build-data drift the audit found is now blocked by ONE command.
#
# EXIT: 0 = no drift anywhere · 1 = drift detected (message tells the dev exactly what to do)
#
# WIRE-IN (least friction, actually blocks):
#   • Manual / Makefile:  bash build/ci-drift-gate.sh   (run before committing build-data)
#   • Git pre-commit:     ln -s ../../build/ci-drift-gate.sh .git/hooks/pre-commit  (optional)
#   • CI:                 add `bash build/ci-drift-gate.sh` as a required check
#
# It does NOT git-push or mutate anything — read-only verification.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1

FAIL=0

echo "── CI drift gate ─────────────────────────────────────────────"

# 1. GENERATE-side: derived regions must match source (no --write, just verify)
echo "· generate-side (derived tables vs source)…"
if ! node build/generate-derived.js --check; then
  FAIL=1
  echo "  ↑ FIX: run \`node build/generate-derived.js\` then commit the updated SAP_BUILD_MANIFEST.md"
fi

# 2. LINT-side: hand-curated tables must not have drifted from source
echo "· lint-side (curated tables · keys · variants · vocab · typography)…"
if ! node build/check-manifest-sync.js; then
  FAIL=1
  echo "  ↑ FIX: reconcile the flagged table(s) to the authoritative source, then re-run."
fi

echo "──────────────────────────────────────────────────────────────"
if [ "$FAIL" != "0" ]; then
  echo "✗ DRIFT GATE FAILED — build-data is out of sync with its source of truth. Do not ship."
  exit 1
fi
echo "✓ DRIFT GATE PASSED — all build-data consistent with source (generated + curated)."
exit 0
