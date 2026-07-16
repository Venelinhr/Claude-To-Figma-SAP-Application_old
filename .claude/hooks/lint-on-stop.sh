#!/bin/bash
# lint-on-stop.sh — Stop hook (Loop B enforcement).
#
# When Claude finishes a turn, if any MCP-built spec was produced this session,
# run the RULE 25 tag-contract linter automatically so a bad frame/spec is caught
# without Claude having to remember to invoke the validator manually.
#
# Lints the most recently modified output/*.json spec (if newer than 10 min) using
# build/lint-mcp-frame.js. Stop stdout is added to context; exit 0 never blocks.
PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
LINTER="$PROJ/build/lint-mcp-frame.js"
OUTDIR="$PROJ/output"

[ -f "$LINTER" ] || exit 0
[ -d "$OUTDIR" ] || exit 0

# Find the most-recently-modified spec touched in the last 10 minutes
RECENT=$(find "$OUTDIR" -name '*-spec.json' -mmin -10 2>/dev/null | head -1)
[ -n "$RECENT" ] || exit 0

RESULT=$(node "$LINTER" "$RECENT" 2>&1)
CODE=$?
if [ "$CODE" -ne 0 ]; then
  echo "<lint-on-stop result=\"FAIL\" spec=\"$(basename "$RECENT")\">The RULE 25 tag-contract linter FAILED on the spec you just produced. Fix before handing off:
$RESULT</lint-on-stop>"
fi

exit 0
