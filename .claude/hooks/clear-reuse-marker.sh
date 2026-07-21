#!/bin/bash
# clear-reuse-marker.sh — SessionStart + Stop hook.
PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"

INPUT=$(cat 2>/dev/null)
EVENT=$(echo "$INPUT" | jq -r '.hook_event_name // empty' 2>/dev/null)

# SAP_BRIDGE_TURN2=1 means this is the resumed Turn 2 child — gates were already
# validated in Turn 1 and the user approved. Skip all marker clearing.
if [ "${SAP_BRIDGE_TURN2}" = "1" ]; then
  exit 0
fi

# Per-turn: reuse decision is cleared every Stop + SessionStart.
rm -f "$PROJ/.claude/.reuse-declared" "$PROJ/.claude/.delta-spec.json" 2>/dev/null

# Per-session: gate markers cleared only at an EXPLICIT SessionStart.
if [ "$EVENT" = "SessionStart" ]; then
  rm -f "$PROJ/.claude/.inspect-done" "$PROJ/.claude/.wireframe-approved" "$PROJ/.claude/.canonical-selected" "$PROJ/.claude/.workflow-loaded" "$PROJ/.claude/.scratch-approved" "$PROJ/.claude/.agent-turn1" 2>/dev/null
fi
exit 0
