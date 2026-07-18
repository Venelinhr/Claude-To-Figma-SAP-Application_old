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

# ── Path 3: invariant reality gate (Gate 9) ──
# The truth of a build is the produced frame. If a recent verify.json exists and FAILED,
# block hand-off. If a build was marked but produced NO verify artifact, that is itself a FAIL
# (the reality gate was skipped — the exact root cause the invariant architecture fixes).
if [ -d "$OUTDIR" ]; then
  RECENT_VERIFY=$(find "$OUTDIR" -name '*-verify.json' -mmin -10 2>/dev/null | head -1)
  if [ -n "$RECENT_VERIFY" ]; then
    if command -v jq >/dev/null 2>&1 && [ "$(jq -r '.overallPass' "$RECENT_VERIFY" 2>/dev/null)" != "true" ]; then
      FAILS=$(jq -r '.fails[]? | "  [INV \(.invariant)] \(.verdict) — \(.why)"' "$RECENT_VERIFY" 2>/dev/null | head -20)
      echo "<invariant-gate result=\"FAIL\" file=\"$(basename "$RECENT_VERIFY")\">The post-build reality gate (verify-invariants.js) FAILED. This build contains native frames, raw hex, or non-SAP fonts and MUST NOT be handed off. Fix the frame, re-dump the tree, and re-run verify-invariants.js until overallPass:true. Violations:
$FAILS</invariant-gate>"
    fi
  elif [ -f "$MARKER" ]; then
    echo "<invariant-gate result=\"MISSING\">A build was marked this session (.last-build-node exists) but produced NO output/<node>-verify.json. The invariant reality gate was skipped — this is the root-cause failure mode. Before hand-off: dump the built frame tree via use_figma (root.findAll(()=>true) → output/<node>-tree.json) and run: node build/verify-invariants.js output/<node>-tree.json --pre-bind --out output/<node>-verify.json — hand off only when overallPass:true.</invariant-gate>"
  fi
fi

exit 0
