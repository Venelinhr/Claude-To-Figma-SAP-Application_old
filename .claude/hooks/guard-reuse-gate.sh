#!/bin/bash
# guard-reuse-gate.sh — PreToolUse hook for the Canonical Pattern Library gate (RULE 31).
#
# Fires before a use_figma build. RULE 31 requires that BEFORE building, Claude has:
#   1. Scored the request against canonical-index.json (ideally via build/score-canonical.js)
#   2. Declared a reuse level (1-5) + base canonical
#   3. Produced a delta-spec for Level 1-4
#
# A Stop hook cannot query Figma, so this PreToolUse reminder is the enforcement point:
# it fires the moment a use_figma build is attempted and reminds Claude to confirm the
# reuse decision was made and (if a delta-spec file was written) validated.
#
# The marker file .claude/.reuse-declared holds the current build's declared reuse level.
# If it's absent when use_figma is about to run, the gate reminds. Advisory (exit 0, never blocks).
#
# Tool input arrives as JSON on stdin (.tool_name, .tool_input). Stdout -> context.
INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')

# Only care about the Figma write tool (MCP tool name contains "use_figma")
echo "$TOOL" | grep -qi "use_figma" || exit 0

PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
MARKER="$PROJ/.claude/.reuse-declared"

# Is this a build (creating a screen) vs a small fix? Heuristic: look for importComponentSetByKeyAsync
# or createInstance in the code — those signal a real build, not a tweak.
CODE=$(echo "$INPUT" | jq -r '.tool_input.code // ""')
IS_BUILD=false
echo "$CODE" | grep -qE "importComponentSetByKeyAsync|createInstance|createFrame" && IS_BUILD=true

[ "$IS_BUILD" = true ] || exit 0

if [ -f "$MARKER" ]; then
  LEVEL=$(cat "$MARKER" 2>/dev/null | head -1)
  echo "<reuse-gate status=\"declared\">Reuse decision on record for this build: $LEVEL. Proceeding. (RULE 31 satisfied.)</reuse-gate>"
else
  echo "<reuse-gate status=\"missing\">RULE 31 — Canonical Pattern Library gate: this is a use_figma BUILD but no reuse decision is on record.

Before building you must have:
1. Scored the request against the canonical library — run: node build/score-canonical.js --floorplan \"<fp>\" --regions <r1,r2> --components <c1,c2>
2. Chosen a reuse level (1-5) and base canonical from the top match
3. For Level 1-4: produced a delta-spec (preserve/replace/add/remove) — validate it: node build/validate-delta-spec.js <spec.json>
4. Recorded the decision: echo \"Level N — <canonical>\" > .claude/.reuse-declared

If you already scored and this is a genuine Level 5 (no match ≥60%), write: echo \"Level 5 — new build (no canonical ≥60%)\" > .claude/.reuse-declared

Do NOT rebuild from scratch a screen that a canonical could satisfy. Reuse > rebuild.</reuse-gate>"
fi

exit 0
