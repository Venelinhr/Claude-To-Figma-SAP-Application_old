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
#
# ROOT CAUSE (found 2026-07-20): guard-wireframe-gate.sh blocks the use_figma BUILD CALL
# but NOT the agent's TEXT RESPONSE. Claude skips the ASCII wireframe ("it's a clone / same
# screen"), the gate blocks the build — but the wireframe was NEVER PRESENTED to the user.
#
# This hook closes that gap by injecting a HARD directive BEFORE Claude writes anything,
# whenever a build/edit/improve request is detected — including:
#   - New builds from description or image
#   - Clone/reuse of an existing canonical screen  ← "even if similar, show it"
#   - Improvements or next-step requests
#   - ANY time the user shares an image or Figma URL alongside a build/edit request
#     (the image IS a visual confirmation request — the wireframe IS the response to it)
#
# Stdout → context, exit 0, never blocks.
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty' | tr '[:upper:]' '[:lower:]')
PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"

[ -n "$PROMPT" ] || exit 0

# If .wireframe-approved already exists from THIS session, skip (user already approved)
if [ -f "$PROJ/.claude/.wireframe-approved" ]; then
  exit 0
fi

# ── Detect a build / edit / improve request ──────────────────────────────────
IS_BUILD=false

# Direct build verbs
echo "$PROMPT" | grep -qiE "build|create.*screen|make.*screen|design.*screen|implement|generate.*screen|new screen|sap screen" && IS_BUILD=true

# Save/place to Figma
echo "$PROMPT" | grep -qiE "save it here|save here|build this|build it here|place it|figma\.com/design" && IS_BUILD=true

# Improve / fix / edit / suggest
echo "$PROMPT" | grep -qiE "improve|fix (this|the|it)|update (this|the|it)|edit (this|the|it)|next step|suggest improvement|improve this|suggest better" && IS_BUILD=true

# User shares an image reference alongside any action word — this IS a wireframe request
# (the image is the visual input; the ASCII wireframe is the required visual confirmation back)
echo "$PROMPT" | grep -qiE "image|reference|screenshot|wireframe|sketch|figma url|node.id|node-id" && echo "$PROMPT" | grep -qiE "build|create|make|design|save|place|improve|fix|update|edit|suggest|screen|layout" && IS_BUILD=true

if [ "$IS_BUILD" = "true" ]; then
  cat << 'DIRECTIVE'
<wireframe-first-gate>
⛔ MANDATORY — GATE 3 (RULE 19) — SHOW WIREFRAME BEFORE ANYTHING ELSE.

Your FIRST and ONLY output before user approval MUST be:

  1. Gate 0: Analyze the reference (VDI sector-by-sector if image provided).
  2. Gate 1: Search canonical screens → state CLONE or BUILD + which canonical (if any).
  3. Gate 2: State the width.
  4. ASCII wireframe of the FULL screen (every zone, every element).
  5. L1–L5 layer tree (every level, every component, every SAP instance).
  6. ⚡ Suggestions from docs/SAP-SUGGESTION-CATALOG.md (any applicable "suggest X not Y").
  7. STOP. WAIT for the user to type explicit approval before proceeding.

THIS APPLIES EVEN WHEN:
  - You recognize the screen as an existing canonical (clone still requires wireframe)
  - The user says "same screen as before" (still show it — it IS the visual confirmation)
  - The user shares an image or Figma URL — showing the wireframe IS your response to the image
  - It seems "obvious" what to build — the wireframe is the contract, not a formality
  - It is a small edit or improvement — still show before changing

DO NOT: write implementation steps, call use_figma, describe the build, or start any analysis
without ending in the wireframe + STOP.

The approval marker (.wireframe-approved) is written ONLY by the user's approval words.
You cannot write it. The gate (guard-wireframe-gate.sh) still blocks use_figma without it.
This hook enforces the PRESENTATION step the gate cannot catch.
</wireframe-first-gate>
DIRECTIVE
fi

exit 0
