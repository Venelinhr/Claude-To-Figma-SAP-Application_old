#!/bin/bash
# verify-learnings.sh — Stop hook (capture verification).
#
# At the end of a turn, if any feedback signal is still status:"pending" in
# .claude/pending-learnings.jsonl, re-inject a HARD reminder so the lesson cannot
# silently evaporate. This closes the capture gap: the durable ledger entry exists,
# but the actual memory-write is guided — this makes "still uncaptured" impossible
# to ignore at turn end (not just at next session start).
#
# Stop stdout is added to context; exit 0 never blocks.
PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
LEDGER="$PROJ/.claude/pending-learnings.jsonl"

[ -f "$LEDGER" ] || exit 0

PENDING=$(jq -c 'select(.status=="pending")' "$LEDGER" 2>/dev/null)
COUNT=$(printf '%s\n' "$PENDING" | grep -c .)

[ "$COUNT" -gt 0 ] || exit 0

LIST=$(printf '%s\n' "$PENDING" | jq -r '"  · [\(.type)] \(.ts): \(.prompt)"' 2>/dev/null | head -10)
echo "<uncaptured-learnings count=\"$COUNT\">⚠ $COUNT feedback signal(s) are still PENDING and were NOT captured this turn. Before finishing: for each, either (a) capture it as a feedback memory (skill/references/lesson-template.md) and set its ledger status to \"captured\", or (b) if it has no reusable lesson, set status to \"dismissed\". To mark one, edit its line in .claude/pending-learnings.jsonl changing \"status\":\"pending\" → \"captured\"/\"dismissed\". Do not leave lessons to evaporate.
$LIST</uncaptured-learnings>"

exit 0
