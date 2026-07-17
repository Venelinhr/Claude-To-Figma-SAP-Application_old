#!/bin/bash
# lint-on-stop.sh — Stop hook (Loop B enforcement, both build paths).
#
# Loop B catches a bad build at turn-end without relying on Claude to remember.
# Two build paths, two checks:
#   1. LEGACY JSON path → lint the most-recent output/*-spec.json (build/lint-mcp-frame.js).
#   2. MCP-FIRST path (RULE 25, the DEFAULT) → produces NO spec file (it builds in Figma via
#      use_figma). A Stop hook can't query Figma, so we detect an UNBOUND build via a marker:
#      when a build reminder is issued, .claude/.last-build-node is written; if it exists and
#      hasn't been cleared by a bind confirmation, remind to Bind SAP Tokens + read the a11y report.
# Stop stdout is added to context; exit 0 never blocks.
PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
LINTER="$PROJ/build/lint-mcp-frame.js"
OUTDIR="$PROJ/output"
MARKER="$PROJ/.claude/.last-build-node"

# ── Path 1: legacy JSON spec lint ──
if [ -f "$LINTER" ] && [ -d "$OUTDIR" ]; then
  RECENT=$(find "$OUTDIR" -name '*-spec.json' -mmin -10 2>/dev/null | head -1)
  if [ -n "$RECENT" ]; then
    RESULT=$(node "$LINTER" "$RECENT" 2>&1)
    if [ $? -ne 0 ]; then
      echo "<lint-on-stop result=\"FAIL\" spec=\"$(basename "$RECENT")\">The RULE 25 tag-contract linter FAILED on the spec you just produced. Fix before handing off:
$RESULT</lint-on-stop>"
    fi
  fi
fi

# ── Path 2: MCP-first unbound-build reminder ──
# The marker holds the node ID of an MCP-built frame not yet confirmed bound.
if [ -f "$MARKER" ]; then
  NODE=$(cat "$MARKER" 2>/dev/null | head -1)
  echo "<mcp-build-unbound node=\"$NODE\">A screen was built this session via use_figma (RULE 25) but is not yet confirmed token-bound (Loop B). Before finishing: (1) select the frame in Figma and run the plugin \"Bind SAP Tokens\", (2) read the a11y report from the plugin status panel, (3) confirm 0 raw-fill leaks. Once the user confirms the bind, clear the marker: rm .claude/.last-build-node. An unbound MCP build has raw fills the plugin hasn't resolved — it is not done until bound.</mcp-build-unbound>"
fi

exit 0
