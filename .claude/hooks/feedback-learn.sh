#!/bin/bash
# feedback-learn.sh — UserPromptSubmit hook.
#
# Detects good/bad/canonical feedback and logs a DURABLE pending-learning entry
# to .claude/pending-learnings.jsonl (survives the session) plus a context reminder.
#
# Detection is order-aware and de-duplicated:
#   - negation guard: "not perfect" / "isn't right" does NOT log positive
#   - CANON supersedes POS (one strong confirmation → one ground-truth row, not two)
#   - NEG present → suppress POS unless clearly mixed
#   - mixed (real POS + real NEG) → single "mixed" row asking Claude to disambiguate
#   - hedged corrections ("close but", "not quite") caught as soft corrections
#   - word-boundaries on fragile stems (bad/broke/correct) kill badge/brokerage/correction
#
# UserPromptSubmit input arrives as JSON on stdin (.prompt). Stdout → context, exit 0, never blocks.
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty' | tr '[:upper:]' '[:lower:]')

PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
LEDGER="$PROJ/.claude/pending-learnings.jsonl"
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

SNIPPET=$(echo "$INPUT" | jq -rc '(.prompt // "") | .[0:200]')
SNIPPET_JSON=$(printf '%s' "$SNIPPET" | jq -Rsc .)

# ── Signal vocabularies (word-boundaried where a stem is ambiguous) ──
POS='bravo|perfect|excellent|great job|great result|well done|good job|good work|really good|nice work|nice one|i like it|love it|love this|looks great|looks good|looks perfect|nailed it|exactly right|exactly what|this is good|this is it|this is perfect|this is great|that.?s good|that.?s great|that.?s perfect|that.?s it|that.?s exactly|that.?s what i wanted|(it.?s|is now|is|looks|totally) correct|👏|🎉|💯|❤️|✅|🔥|👍'
CANON='canonical|use this as (a )?(reference|canonical)|this is the one|best result|ship it|rock solid|exactly right|save (this )?as canonical'
NEG='\bwrong\b|\bbad\b|no good|not good|terrible|terrable|horrible|awful|wtf|what the|not acceptable|this is wrong|this is bad|this is not|not what i|not right|\bmistake\b|do not|don'"'"'t|\bnever\b|stop doing|violated|fix this|that.?s not|incorrect|\bbroke\b|\bbroken\b|regression|disaster|not ok\b|not okay|poor result|disappointing|garbage|rubbish|please fix|not working|it.?s not sap|this is not sap|not a sap|not real sap|only sap|use only sap|must be sap|has to be sap|not sap component|not sap (token|style|instance|icon)|fake sap|custom (frame|component|nav|bar) instead|native frame|native component|👎|😤|😡|🤦'
HEDGE='close but|not quite|not there yet|almost|isn'"'"'t what|not what i (meant|wanted|asked)|needs work|not right|still off'
# Negation window: a negator within ~3 words before a positive word flips it
NEGATION='(not|isn.?t|wasn.?t|aren.?t|don.?t|no longer|far from|hardly|barely) (it |really |even |quite |very )?(perfect|great|good|correct|right|excellent|canonical|the one)'

has() { echo "$PROMPT" | grep -qE "$1"; }

# Evaluate raw hits
POS_HIT=false; NEG_HIT=false; CANON_HIT=false; HEDGE_HIT=false; NEGATED=false
has "$POS"    && POS_HIT=true
has "$CANON"  && CANON_HIT=true
has "$NEG"    && NEG_HIT=true
has "$HEDGE"  && HEDGE_HIT=true
has "$NEGATION" && NEGATED=true

# Negation guard: "not perfect" etc. → the positive is actually a correction
if [ "$NEGATED" = true ]; then
  POS_HIT=false; CANON_HIT=false; NEG_HIT=true
fi

# A hedge is a soft correction
[ "$HEDGE_HIT" = true ] && NEG_HIT=true

log() { printf '{"ts":"%s","type":"%s","status":"pending","prompt":%s}\n' "$TS" "$1" "$SNIPPET_JSON" >> "$LEDGER" 2>/dev/null; }

# ── Decide ONE primary classification (no double-fire) ──
if [ "$POS_HIT" = true -o "$CANON_HIT" = true ] && [ "$NEG_HIT" = true ]; then
  # genuine mixed feedback — one row, ask Claude to disambiguate
  log "mixed"
  echo "<feedback-signal type=\"mixed\">The user's message contains BOTH approval and a correction. A 'mixed' entry was logged to .claude/pending-learnings.jsonl. Do not assume: ask/confirm which part is the keeper and which is the fix, then capture the correction as a lesson and (if applicable) the good part as canonical. Resolve before continuing.</feedback-signal>"

elif [ "$CANON_HIT" = true ]; then
  # strong canonical confirmation — Loop D, supersedes generic positive (no double row)
  log "ground-truth"
  echo "<feedback-signal type=\"ground-truth\">The user confirmed a screen as canonical quality (RULE 27). A durable ground-truth task was logged to .claude/pending-learnings.jsonl. Run the ground-truth-updater: (1) get the confirmed Figma node ID, (2) get_design_context for EXACT measurements (padding/gap/font/token per element), (3) write confirmed values into knowledge/guidelines/token-assignment-rules.md with node ID + date, (4) also capture a canonical 'feedback' memory if the pattern is reusable, (5) mark the ledger entry captured.</feedback-signal>"

elif [ "$POS_HIT" = true ]; then
  log "positive"

  # ── AUTO-SAVE positive canonical feedback immediately ─────────────────
  SAVESIG=$(echo "$PROMPT" | grep -cE 'save|learn|remember|use (it|this) as|add (it|this)|canonical|bravo|great result|perfect')
  if [ "$SAVESIG" -gt 0 ]; then
    MEM_DIR="$HOME/.claude/projects/-Users-C5408360/memory"
    MEM_INDEX="$MEM_DIR/MEMORY.md"
    SLUG="feedback_auto_pos_$(date -u +%Y%m%d_%H%M%S)"
    MEM_FILE="$MEM_DIR/${SLUG}.md"
    FULL_PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty' | head -c 800)
    cat > "$MEM_FILE" << MEMEOF
---
name: $SLUG
description: "[auto-saved positive] $(echo "$FULL_PROMPT" | head -c 120 | tr '\n' ' ')"
metadata:
  type: feedback
  severity: high
  auto_saved: true
---

**Auto-saved from positive feedback ($(date -u +%Y-%m-%d)):**

$FULL_PROMPT

**How to apply:** This pattern was confirmed as good/canonical. Reuse it in future builds.
MEMEOF
    if [ -f "$MEM_INDEX" ]; then
      TMPFILE=$(mktemp)
      head -1 "$MEM_INDEX" > "$TMPFILE"
      echo "- [${SLUG}.md](${SLUG}.md) — ⭐ [auto-saved positive] $(echo "$FULL_PROMPT" | head -c 100 | tr '\n' ' ')" >> "$TMPFILE"
      tail -n +2 "$MEM_INDEX" >> "$TMPFILE"
      mv "$TMPFILE" "$MEM_INDEX"
    fi
  fi
  # ── END auto-save ─────────────────────────────────────────────────────

  echo "<feedback-signal type=\"positive\">The user expressed approval. A pending-learning entry was logged to .claude/pending-learnings.jsonl. Per the loop: if the approved action reflects a reusable pattern not already in memory, capture it as a 'feedback' memory (see skill/references/lesson-template.md — Applies-to / Signal / What-worked / Why / How-to-apply), add a MEMORY.md index line, then mark the ledger entry captured. Do NOT save one-off praise with no reusable lesson.</feedback-signal>"

elif [ "$NEG_HIT" = true ]; then
  log "correction"

  # ── AUTO-SAVE hard rules to memory immediately ───────────────────────
  # If user uses "hard rule", "never", "always", "save" imperatives → write
  # a feedback memory file directly without waiting for Claude to do it.
  HARDRULE=$(echo "$PROMPT" | grep -cE 'hard rule|never (do|use|repeat|build|make)|always (use|make|do|add|end|build)|save (this|it|all|and learn|to memory)|remember (this|it|from now)|don.?t (do|use|repeat|make) this again|learn from (this|it|feedback)|add (this )?to (memory|rules)|put this in (memory|rules)|fix and (save|learn)|and (never|always) (do|use|repeat)')
  if [ "$HARDRULE" -gt 0 ]; then
    MEM_DIR="$HOME/.claude/projects/-Users-C5408360/memory"
    MEM_INDEX="$MEM_DIR/MEMORY.md"
    SLUG="feedback_auto_$(date -u +%Y%m%d_%H%M%S)"
    MEM_FILE="$MEM_DIR/${SLUG}.md"
    FULL_PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty' | head -c 800)
    # Write the memory file
    cat > "$MEM_FILE" << MEMEOF
---
name: $SLUG
description: "[auto-saved hard rule] $(echo "$FULL_PROMPT" | head -c 120 | tr '\n' ' ')"
metadata:
  type: feedback
  severity: critical
  auto_saved: true
---

**Auto-saved from user feedback ($(date -u +%Y-%m-%d)):**

$FULL_PROMPT

**How to apply:** Read this rule before every build and apply it immediately. This was saved automatically because the user gave critical/hard-rule feedback.
MEMEOF
    # Add to MEMORY.md index at the top
    if [ -f "$MEM_INDEX" ]; then
      TMPFILE=$(mktemp)
      head -1 "$MEM_INDEX" > "$TMPFILE"
      echo "- [${SLUG}.md](${SLUG}.md) — ⛔ [auto-saved] $(echo "$FULL_PROMPT" | head -c 100 | tr '\n' ' ')" >> "$TMPFILE"
      tail -n +2 "$MEM_INDEX" >> "$TMPFILE"
      mv "$TMPFILE" "$MEM_INDEX"
    fi
  fi
  # ── END auto-save ─────────────────────────────────────────────────────

  echo "<feedback-signal type=\"correction\">The user flagged a mistake or hedged correction. A pending-learning entry was logged to .claude/pending-learnings.jsonl. Per the loop: (1) identify the specific wrong action, (2) save a 'feedback' memory (skill/references/lesson-template.md — Applies-to / Signal / Mistake / Why / How-to-apply), (3) if it is a hard rule, update the relevant feedback memory or skill, then mark the ledger entry captured. Then correct the current work.</feedback-signal>"
fi

exit 0
