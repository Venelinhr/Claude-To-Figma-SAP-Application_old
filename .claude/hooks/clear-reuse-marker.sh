#!/bin/bash
# clear-reuse-marker.sh — SessionStart + Stop hook.
#
# The reuse decision marker (.claude/.reuse-declared) is per-build. It must NOT leak across
# builds — a decision made for screen A must not silently satisfy the gate for unrelated screen B.
# This clears the marker at session start (fresh session) and at turn end (build finished).
# The guard-reuse-gate.sh then forces a fresh reuse decision for the next build.
#
# Runs on SessionStart and Stop. Always exit 0 (never blocks).
#
# Gate markers (.inspect-done / .wireframe-approved / .canonical-selected — INVARIANT architecture):
# cleared at SessionStart only, so a wireframe approved in one turn can still build in the next turn
# within the same session. A fresh session always starts with a clean slate.
PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"

INPUT=$(cat 2>/dev/null)
EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // empty' 2>/dev/null)

# Per-turn: reuse decision is cleared every Stop + SessionStart.
rm -f "$PROJ/.claude/.reuse-declared" "$PROJ/.claude/.delta-spec.json" 2>/dev/null

# Per-session: gate markers cleared only at SessionStart (or when event is unknown).
if [ "$EVENT" = "SessionStart" ] || [ -z "$EVENT" ]; then
  rm -f "$PROJ/.claude/.inspect-done" "$PROJ/.claude/.wireframe-approved" "$PROJ/.claude/.canonical-selected" 2>/dev/null
fi
exit 0
