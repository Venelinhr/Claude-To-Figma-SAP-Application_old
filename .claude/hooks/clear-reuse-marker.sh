#!/bin/bash
# clear-reuse-marker.sh — SessionStart + Stop hook.
#
# The reuse decision marker (.claude/.reuse-declared) is per-build. It must NOT leak across
# builds — a decision made for screen A must not silently satisfy the gate for unrelated screen B.
# This clears the marker at session start (fresh session) and at turn end (build finished).
# The guard-reuse-gate.sh then forces a fresh reuse decision for the next build.
#
# Runs on SessionStart and Stop. Always exit 0 (never blocks).
PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
rm -f "$PROJ/.claude/.reuse-declared" "$PROJ/.claude/.delta-spec.json" 2>/dev/null
exit 0
