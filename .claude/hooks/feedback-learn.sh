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
POS='bravo|perfect|excellent|great job|great result|well done|good job|exactly|nailed it|love it|this is good|looks good|\bcorrect\b|👏|🎉|💯'
CANON='canonical|use this as (a )?(reference|canonical)|this is the one|best result|ship it|rock solid|exactly right|save (this )?as canonical'
NEG='\bwrong\b|\bbad\b|no good|not good|\bmistake\b|do not|don'"'"'t|\bnever\b|stop doing|not acceptable|violated|fix this|that.?s not|incorrect|\bbroke\b|\bbroken\b|regression|disaster'
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
  echo "<feedback-signal type=\"positive\">The user expressed approval. A pending-learning entry was logged to .claude/pending-learnings.jsonl. Per the loop: if the approved action reflects a reusable pattern not already in memory, capture it as a 'feedback' memory (see skill/references/lesson-template.md — Applies-to / Signal / What-worked / Why / How-to-apply), add a MEMORY.md index line, then mark the ledger entry captured. Do NOT save one-off praise with no reusable lesson.</feedback-signal>"

elif [ "$NEG_HIT" = true ]; then
  log "correction"
  echo "<feedback-signal type=\"correction\">The user flagged a mistake or hedged correction. A pending-learning entry was logged to .claude/pending-learnings.jsonl. Per the loop: (1) identify the specific wrong action, (2) save a 'feedback' memory (skill/references/lesson-template.md — Applies-to / Signal / Mistake / Why / How-to-apply), (3) if it is a hard rule, update the relevant feedback memory or skill, then mark the ledger entry captured. Then correct the current work.</feedback-signal>"
fi

exit 0
