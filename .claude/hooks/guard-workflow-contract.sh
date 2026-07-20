#!/bin/bash
# guard-workflow-contract.sh — PreToolUse hook on mcp__figma__use_figma. BLOCKING (advisory-once).
#
# Ensures the WORKFLOW-CONTRACT is acknowledged before ANY use_figma call — build, edit,
# improvement, or variant. This closes the drift gap where follow-up "improve this screen"
# edits skipped the rules (raw 72 fonts, native dividers, placeholder tabs, native components).
#
# Enforcement is "once per session": the FIRST use_figma call of a session is blocked with the
# contract reminder unless the .workflow-loaded marker exists. The agent acknowledges by writing
# the marker (it states it has loaded WORKFLOW-CONTRACT.md), then all subsequent calls pass. This
# gates edits AND builds without blocking rapid iteration within a session.
#
# capture-approvals.sh writes .workflow-loaded when the user's own words acknowledge the workflow,
# OR the agent writes it after loading the contract. Cleared at SessionStart by clear-reuse-marker.sh.
#
# Registered under mcp__figma__use_figma AFTER guard-agent-turn1 and BEFORE guard-wireframe-gate.
# Exit 2 blocks; stderr is the agent's feedback. Exit 0 passes.
INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')
echo "$TOOL" | grep -qi "use_figma" || exit 0

PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
MARKER="$PROJ/.claude/.workflow-loaded"

if [ ! -f "$MARKER" ]; then
  echo "⛔ WORKFLOW CONTRACT NOT ACKNOWLEDGED — no use_figma until you load it." >&2
  echo "" >&2
  echo "Before building, editing, improving, or proposing a variant of any SAP screen you MUST:" >&2
  echo "  1. Read WORKFLOW-CONTRACT.md (project root) — 31 rules + 10-step flow + hard rules + skills + lessons." >&2
  echo "  2. Analyze the source screen's SAP tokens / instances / states first." >&2
  echo "  3. Confirm compliance: real SAP instances · [typo:role] text (no raw 72) · [sapToken] fills (no raw hex) ·" >&2
  echo "     no Divider frames (strokes) · Compact · correct nav labels · L1–L5 naming." >&2
  echo "" >&2
  echo "Then acknowledge by writing the marker:  echo ack > .claude/.workflow-loaded" >&2
  echo "(For existing non-compliant screens, run /sap-fix <nodeId>.)" >&2
  exit 2
fi

exit 0
