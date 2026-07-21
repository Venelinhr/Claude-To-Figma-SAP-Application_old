#!/bin/bash
# capture-approvals.sh — UserPromptSubmit hook. Writes INDEPENDENT approval markers.
#
# The core defect the invariant audit found: build gates validated markers CLAUDE wrote by hand,
# which Claude could fabricate to skip a gate. The fix: the approval markers must come from an
# INDEPENDENT event — the USER's own words — not from Claude. This hook is that independent source.
#
# It scans the user's prompt for two kinds of explicit approval and writes the matching marker:
#   1. Wireframe/plan approval  → .claude/.wireframe-approved   (satisfies Gate 3, RULE 19)
#   2. Build-from-scratch consent → .claude/.scratch-approved   (satisfies ask-before-scratch)
#
# Because ONLY this hook (fired by a real user prompt) writes these files, Claude cannot self-echo
# them to skip the gate. clear-reuse-marker.sh removes them at SessionStart so consent never leaks
# across sessions.
#
# Stdout → context, exit 0, never blocks.
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty' | tr '[:upper:]' '[:lower:]')
PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
[ -n "$PROMPT" ] || exit 0

# ── Architecture brief approval (Gate 0.5 — architect-first reasoning) ────────
# DISTINCT from the wireframe approval below: requires an architecture-specific keyword so a
# bare "approve" (which satisfies the wireframe gate) does NOT silently satisfy the architect
# gate. The user must consciously approve the business→IA→floorplan brief.
if echo "$PROMPT" | grep -qE "(architecture|information architecture|\bia\b|floorplan|architect brief|business statement).*(approve|approved|ok|good|yes|correct|right|proceed)" \
   || echo "$PROMPT" | grep -qE "(approve|approved|ok|yes|looks?).*(architecture|information architecture|\bia\b|floorplan|architect brief|business statement)"; then
  echo "{\"architectApprovedBy\":\"user-prompt\",\"at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || echo session)\"}" > "$PROJ/.claude/.architect-approved"
  echo "<approval-captured marker=\".architect-approved\">User approved the architecture brief — Gate 0.5 (architect-first reasoning) is satisfied. Next present the ASCII wireframe for wireframe approval, then build. Marker clears at session end.</approval-captured>"
fi

# ── Wireframe / plan approval ────────────────────────────────────────────────
# Short, deliberate approval phrases. Kept tight to avoid capturing incidental "ok".
if echo "$PROMPT" | grep -qE "(^|[^a-z])(approve|approved|go ahead|build it|looks good|lgtm|ship it|proceed|yes,? build|do it|make it)([^a-z]|$)" \
   || echo "$PROMPT" | grep -qE "wireframe.*(approve|ok|good|yes)|(approve|ok|yes).*wireframe" \
   || echo "$PROMPT" | grep -qE "layer structure.*(approve|ok|good|yes)|(approve|ok|yes).*layer structure"; then
  echo "{\"approvedBy\":\"user-prompt\",\"at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || echo session)\"}" > "$PROJ/.claude/.wireframe-approved"
  echo "<approval-captured marker=\".wireframe-approved\">User approval detected — the ASCII-wireframe gate (RULE 19 / Gate 3) is satisfied for the next build. If this was NOT a wireframe approval, ignore; the marker clears at session end.</approval-captured>"
fi

# ── Explicit consent to build from scratch (pure Figma frames, no canonical) ──
if echo "$PROMPT" | grep -qE "from scratch|from zero|build new|no reference|no canonical|pure figma|start fresh|nothing to clone|build it from" ; then
  echo "{\"scratchApprovedBy\":\"user-prompt\",\"at\":\"$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || echo session)\"}" > "$PROJ/.claude/.scratch-approved"
  echo "<approval-captured marker=\".scratch-approved\">User consent to build from scratch detected — the ask-before-scratch gate is satisfied. Still: prefer cloning an approved screen if one exists (RULE 28).</approval-captured>"
fi

exit 0
