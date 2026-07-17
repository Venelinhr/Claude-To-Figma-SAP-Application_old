#!/bin/bash
# surface-canonical-record.sh — Stop hook. Closes the reuse learning loop (RULE 31 · flywheel).
#
# The flywheel already failed once: "Schedule Activated" is in reuse-outcomes-ledger.md but was
# never added to canonical-index.json Tier 2 — because record-canonical.js was invoked by nobody.
#
# A pure hook cannot know the confirmed node ID / screen name (only Claude does), so this hook
# does the next best thing MECHANICALLY: at turn end, if a build happened this session (marker
# .claude/.last-build-node present) AND a confirmation signal was logged this session
# (pending-learnings.jsonl has a "positive" or "ground-truth" row), it reminds Claude to run
# record-canonical.js with the exact command — so the library actually grows.
#
# It also runs the integrity check and warns if any ledger row lacks a Tier-2 entry (drift).
# Always exit 0 (Stop hooks never block).
PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
LEDGER_PENDING="$PROJ/.claude/pending-learnings.jsonl"
BUILD_MARKER="$PROJ/.claude/.last-build-node"

# Only fire when BOTH: a build occurred this session AND a positive/ground-truth signal was logged.
[ -f "$BUILD_MARKER" ] || exit 0
[ -f "$LEDGER_PENDING" ] || exit 0
grep -qE '"type":"(positive|ground-truth)"' "$LEDGER_PENDING" 2>/dev/null || exit 0

NODE=$(cat "$BUILD_MARKER" 2>/dev/null | head -1)

echo "<canonical-record-reminder>A build ($NODE) was confirmed this session but the canonical library grows ONLY when you run the write-back. Close the loop now (RULE 31 flywheel):

  node build/record-canonical.js --node \"$NODE\" --name \"<screen name>\" --base \"<canonical id or none>\" --level <N> --score <S> --outcome \"<perfect|bravo|...>\" --date \"<YYYY-MM-DD>\"

This appends the reuse-outcomes ledger AND adds the Tier 2 canonical entry in one step. Skipping it means the next similar request won't find this screen — the flywheel stalls (it already failed once on 'Schedule Activated').

Then clear the build marker: rm .claude/.last-build-node</canonical-record-reminder>"

# Integrity drift check — warn if a ledger row has no matching Tier-2 entry
if [ -f "$PROJ/build/check-reuse-integrity.js" ]; then
  DRIFT=$(node "$PROJ/build/check-reuse-integrity.js" 2>&1)
  if [ $? -ne 0 ]; then
    echo "<reuse-integrity-warning>$DRIFT</reuse-integrity-warning>"
  fi
fi

exit 0
