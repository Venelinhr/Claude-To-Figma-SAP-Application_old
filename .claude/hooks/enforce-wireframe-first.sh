#!/bin/bash
# enforce-wireframe-first.sh — UserPromptSubmit hook. MANDATORY PRESENTATION GATE.
#
# HARD RULE (confirmed 2026-07-20): whenever the user attaches a reference image,
# the agent MUST run the full Gate 0→3 pipeline and show the ASCII wireframe + L1-L5
# layer tree BEFORE writing any other response. This is MANDATORY — not optional,
# not skippable for clones, not skippable for "same screen". The wireframe IS the
# visual confirmation the user needs back when they share an image.
#
# Also fires for build/edit/improve requests without images.
# Skips only when .wireframe-approved already exists this session.
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty' | tr '[:upper:]' '[:lower:]')
PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"

[ -n "$PROMPT" ] || exit 0

# Skip if wireframe already approved this session
if [ -f "$PROJ/.claude/.wireframe-approved" ]; then
  exit 0
fi

IS_BUILD=false

# ── HARD RULE: reference image present → ALWAYS mandatory ───────────────────
# Any image attachment or image reference in a build/design context = mandatory
echo "$PROMPT" | grep -qiE "image|screenshot|reference|photo|sketch|wireframe|\.png|\.jpg|\.jpeg|\.webp" && IS_BUILD=true

# ── Build / edit / improve verbs ─────────────────────────────────────────────
echo "$PROMPT" | grep -qiE "build|create.*screen|make.*screen|design.*screen|implement|generate.*screen|new screen|sap screen" && IS_BUILD=true
echo "$PROMPT" | grep -qiE "save it here|save here|build this|build it here|place it|figma\.com/design" && IS_BUILD=true
echo "$PROMPT" | grep -qiE "improve|fix (this|the|it)|update (this|the|it)|edit (this|the|it)|next step|suggest improvement|improve this|suggest better" && IS_BUILD=true

if [ "$IS_BUILD" = "true" ]; then
  cat << 'DIRECTIVE'
<wireframe-first-gate>
⛔ HARD RULE — MANDATORY GATE 3 (RULE 19) — SHOW WIREFRAME BEFORE ANYTHING ELSE.

A reference image was shared OR a build/edit/improve request was detected.
Your FIRST and ONLY output before user approval MUST be:

  1. Gate 0 — Analyze reference: VDI sector-by-sector (A→B→C). Name every zone.
     Map every element to a real SAP component. State image quality tier.
  2. Gate 1 — Canonical search: state CLONE (with node ID) or BUILD. Never skip.
  3. Gate 2 — State the exact width.
  4. Full ASCII wireframe — every zone, every component, every row.
  5. Full L1–L5 layer tree — every level, every SAP instance named.
  6. ⚡ Suggestions — applicable entries from docs/SAP-SUGGESTION-CATALOG.md.
  7. STOP. WAIT for the user to type explicit approval.

THIS IS A HARD RULE — NO EXCEPTIONS:
  • Reference image attached → MANDATORY (even if you recognize the screen)
  • Clone of existing canonical → MANDATORY (wireframe = visual confirmation)
  • "Same screen as before" → MANDATORY
  • Small edit or improvement → MANDATORY
  • The wireframe IS the response to the image — it confirms you understood it

DO NOT: write implementation steps, call use_figma, describe build steps, or
propose anything else before the wireframe + STOP.

The .wireframe-approved marker is written ONLY by the user's approval words.
You cannot write it yourself.
</wireframe-first-gate>
DIRECTIVE
fi

exit 0
