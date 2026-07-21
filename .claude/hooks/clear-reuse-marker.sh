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

# Per-turn: reuse decision AND wireframe/scratch approval are cleared every Stop + SessionStart.
# Wireframe/scratch approval is single-use per turn (Fix #3c) — an approval cannot carry across
# turns to pre-satisfy a later, unrelated build. capture-approvals.sh re-writes it when the user
# approves the NEXT wireframe.
rm -f "$PROJ/.claude/.reuse-declared" "$PROJ/.claude/.delta-spec.json" \
      "$PROJ/.claude/.wireframe-approved" "$PROJ/.claude/.scratch-approved" \
      "$PROJ/.claude/.architect-approved" 2>/dev/null

# Per-session: other gate markers cleared only at an EXPLICIT SessionStart.
# NOTE: .workflow-loaded is intentionally NOT cleared here — it is owned by load-workflow-contract.sh
# (written at SessionStart). Clearing it after the loader writes it would deadlock the workflow gate.
if [ "$EVENT" = "SessionStart" ]; then
  rm -f "$PROJ/.claude/.inspect-done" "$PROJ/.claude/.canonical-selected" "$PROJ/.claude/.agent-turn1" 2>/dev/null
fi
exit 0
