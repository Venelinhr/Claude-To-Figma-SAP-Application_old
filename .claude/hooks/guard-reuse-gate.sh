#!/bin/bash
# guard-reuse-gate.sh — PreToolUse hook · Canonical Pattern Library gate (RULE 31). BLOCKING.
#
# Fires before a use_figma build. RULE 31 requires that BEFORE building, Claude has:
#   1. Scored the request against the canonical library (build/score-canonical.js)
#   2. Recorded a VALID reuse decision (level 1-5 + base canonical) to .claude/.reuse-declared
#   3. For Level 1-4: a delta-spec that passes build/validate-delta-spec.js
#
# The marker .claude/.reuse-declared is a JSON artifact:
#   {"level":1,"score":94,"baseCanonical":"750:174925","deltaSpec":".claude/.delta-spec.json"}
# The hook re-validates it (level range, score consistency, base exists, delta-spec valid for L1-4).
# If a BUILD is detected (createInstance / createFrame / .clone()) and the marker is missing or
# invalid → BLOCK (exit 2, stderr message to Claude). Read-only use_figma calls pass silently.
#
# Tool input arrives as JSON on stdin (.tool_name, .tool_input). exit 2 = block; exit 0 = allow.
INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')
echo "$TOOL" | grep -qi "use_figma" || exit 0

PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
MARKER="$PROJ/.claude/.reuse-declared"

CODE=$(echo "$INPUT" | jq -r '.tool_input.code // ""')

# ── Detect a BUILD (vs a read-only inspect / tweak) ──
# Includes .clone( — RULE 28's preferred clone-canonical path (was previously blind to it).
IS_BUILD=false
echo "$CODE" | grep -qE "importComponentSetByKeyAsync|createInstance|createFrame|\.clone\(" && IS_BUILD=true
[ "$IS_BUILD" = true ] || exit 0

blockmsg() {
  # exit 2 with stderr feedback is the documented PreToolUse "block" behavior.
  echo "$1" >&2
  exit 2
}

# ── No marker → block ──
if [ ! -f "$MARKER" ]; then
  blockmsg "⛔ RULE 31 BLOCKED — use_figma BUILD attempted with no reuse decision on record.

Before building you MUST:
1. Score the request:   node build/score-canonical.js --floorplan \"<fp>\" --regions <r1,r2> --components <c1,c2>
2. Pick the top match + reuse level (1-5).
3. For Level 1-4, write a delta-spec and validate it:  node build/validate-delta-spec.js <spec.json>
4. Record the decision as JSON:
   echo '{\"level\":<N>,\"score\":<S>,\"baseCanonical\":\"<id-or-none>\",\"deltaSpec\":\"<path-or-null>\"}' > .claude/.reuse-declared

If this is a genuine Level 5 (no canonical scored >=60):
   echo '{\"level\":5,\"score\":0,\"baseCanonical\":\"none\",\"deltaSpec\":null}' > .claude/.reuse-declared

Reuse > rebuild. Do not rebuild a screen a canonical could satisfy."
fi

# ── Marker exists — validate it as JSON ──
LEVEL=$(jq -r '.level // empty' "$MARKER" 2>/dev/null)
SCORE=$(jq -r '.score // empty' "$MARKER" 2>/dev/null)
BASE=$(jq -r '.baseCanonical // empty' "$MARKER" 2>/dev/null)
DELTA=$(jq -r '.deltaSpec // empty' "$MARKER" 2>/dev/null)

if [ -z "$LEVEL" ]; then
  blockmsg "⛔ RULE 31 BLOCKED — .claude/.reuse-declared is not valid JSON (no .level).
Rewrite it: echo '{\"level\":<N>,\"score\":<S>,\"baseCanonical\":\"<id>\",\"deltaSpec\":\"<path-or-null>\"}' > .claude/.reuse-declared"
fi

# level 1-5
case "$LEVEL" in
  1|2|3|4|5) ;;
  *) blockmsg "⛔ RULE 31 BLOCKED — reuse level '$LEVEL' invalid (must be 1-5)." ;;
esac

# Level ↔ score consistency (matches score-canonical.js thresholds)
if [ "$LEVEL" = "1" ] && [ -n "$SCORE" ]; then
  awk "BEGIN{exit !($SCORE < 85)}" && blockmsg "⛔ RULE 31 BLOCKED — Level 1 needs score >=85, got $SCORE. Re-score or drop to Level 2/3."
fi
if [ "$LEVEL" = "5" ] && [ -n "$SCORE" ]; then
  awk "BEGIN{exit !($SCORE >= 60)}" && blockmsg "⛔ RULE 31 BLOCKED — Level 5 (new build) but score $SCORE >=60. A canonical likely exists — reuse it."
fi

# Level 1-4 must name a base canonical and (if a delta-spec path is given) validate it
if [ "$LEVEL" != "5" ]; then
  if [ -z "$BASE" ] || [ "$BASE" = "none" ]; then
    blockmsg "⛔ RULE 31 BLOCKED — Level $LEVEL requires a baseCanonical (got '$BASE'). Set it or use Level 5."
  fi
  if [ -n "$DELTA" ] && [ "$DELTA" != "null" ] && [ -f "$PROJ/$DELTA" ]; then
    if ! node "$PROJ/build/validate-delta-spec.js" "$PROJ/$DELTA" >/dev/null 2>&1; then
      blockmsg "⛔ RULE 31 BLOCKED — delta-spec $DELTA failed validation. Run: node build/validate-delta-spec.js $DELTA"
    fi
  fi
fi

# All checks pass — allow, with a confirming note
echo "<reuse-gate status=\"passed\">RULE 31 satisfied: Level $LEVEL · base $BASE · score ${SCORE:-—}. Building.</reuse-gate>"
exit 0
