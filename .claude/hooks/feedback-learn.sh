#!/bin/bash
# feedback-learn.sh — UserPromptSubmit hook.
#
# When the user's message contains a feedback signal (praise, correction, or a
# judgment on the last action), do TWO things:
#   1. DURABLE WRITE — append a pending-learning entry to
#      .claude/pending-learnings.jsonl so the signal survives even if the lesson
#      is not captured to memory in-session. This is the enforced part of the loop.
#   2. CONTEXT REMINDER — inject a reminder so Claude captures the lesson now.
#
# UserPromptSubmit input arrives as JSON on stdin (.prompt). Stdout is added to
# the agent's context (exit 0). It NEVER blocks.
INPUT=$(cat)
PROMPT=$(echo "$INPUT" | jq -r '.prompt // empty' | tr '[:upper:]' '[:lower:]')

# Resolve project dir (hook runs from project root; fall back to script location)
PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
LEDGER="$PROJ/.claude/pending-learnings.jsonl"
TS=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Positive-confirmation signals → capture WHAT worked so it becomes canonical
POS='bravo|perfect|excellent|great job|great result|well done|good job|exactly|nailed it|love it|this is good|looks good|correct|👏|🎉|💯'
# Correction / negative signals → capture the MISTAKE + the fix so it is not repeated
NEG='wrong|bad|no good|not good|mistake|do not|don'"'"'t|never|stop doing|not acceptable|violated|fix this|that.?s not|incorrect|broke|regression'

# Canonical-quality confirmation → the STRONG signal that should trigger Loop D
# (ground-truth capture of exact measurements from the confirmed screen).
CANON='perfect|canonical|use this as (reference|canonical)|this is the one|best result|ship it|rock solid|exactly right|great result|bravo|100%|💯'

# Truncate + JSON-escape the prompt for the ledger (first 200 chars)
SNIPPET=$(echo "$INPUT" | jq -rc '(.prompt // "") | .[0:200]')
SNIPPET_JSON=$(printf '%s' "$SNIPPET" | jq -Rsc .)

if echo "$PROMPT" | grep -qE "$POS"; then
  printf '{"ts":"%s","type":"positive","status":"pending","prompt":%s}\n' \
    "$TS" "$SNIPPET_JSON" >> "$LEDGER" 2>/dev/null
  echo "<feedback-signal type=\"positive\">The user expressed approval. A pending-learning entry was logged to .claude/pending-learnings.jsonl. Per the loop: if the approved action reflects a reusable pattern not already in memory, capture it as a 'feedback' memory (name, description, **Why:**, **How to apply:**), add a MEMORY.md index line, mark it canonical, then mark the ledger entry captured. Do NOT save one-off praise with no reusable lesson.</feedback-signal>"
fi

# Loop D — ground-truth: strong canonical confirmation logs a durable ground-truth task
if echo "$PROMPT" | grep -qE "$CANON"; then
  printf '{"ts":"%s","type":"ground-truth","status":"pending","prompt":%s}\n' \
    "$TS" "$SNIPPET_JSON" >> "$LEDGER" 2>/dev/null
  echo "<feedback-signal type=\"ground-truth\">The user confirmed a screen as canonical quality (RULE 27). A durable ground-truth task was logged to .claude/pending-learnings.jsonl. Run the ground-truth-updater: (1) get the confirmed Figma node ID, (2) call get_design_context to read EXACT measurements (padding/gap/font/token per element), (3) write the confirmed values into knowledge/guidelines/token-assignment-rules.md with the node ID + date, (4) mark the ledger entry captured. This is how the next build starts with confirmed values instead of re-deriving them.</feedback-signal>"
fi

if echo "$PROMPT" | grep -qE "$NEG"; then
  printf '{"ts":"%s","type":"correction","status":"pending","prompt":%s}\n' \
    "$TS" "$SNIPPET_JSON" >> "$LEDGER" 2>/dev/null
  echo "<feedback-signal type=\"correction\">The user flagged a mistake. A pending-learning entry was logged to .claude/pending-learnings.jsonl. Per the loop: (1) identify the specific wrong action, (2) save a 'feedback' memory with the mistake, **Why:**, and **How to apply:** the fix, (3) if it is a hard rule, update feedback_three_hard_build_rules.md or the relevant skill, then mark the ledger entry captured. Then correct the current work.</feedback-signal>"
fi

exit 0
