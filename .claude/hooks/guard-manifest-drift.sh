#!/bin/bash
# guard-manifest-drift.sh — PreToolUse hook · Gate 4 (keys verified). BLOCKING.
#
# SAP_BUILD_MANIFEST.md §3 is the component-key source the build agent reads. If it has drifted
# from the registry (a stale/wrong figmaComponentId), a build's importComponentSetByKeyAsync will
# 404 at runtime — the exact fail-closed case that must NOT be reached silently. This gate runs the
# drift checker BEFORE a key-dependent use_figma build and blocks (exit 2) if the manifest is stale.
#
# Complements manifest-sync-check.sh (PostToolUse notice on manifest edit). This one is the hard
# pre-build gate. Read-only use_figma calls pass silently.
INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')
echo "$TOOL" | grep -qi "use_figma" || exit 0

CODE=$(echo "$INPUT" | jq -r '.tool_input.code // ""')
PROJ="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"

# Only gate builds that import SAP component keys (the drift-sensitive operation).
echo "$CODE" | grep -qE "importComponentSetByKeyAsync" || exit 0

cd "$PROJ" 2>/dev/null || exit 0
if ! node build/check-manifest-sync.js >/dev/null 2>&1; then
  echo "⛔ GATE 4 BLOCKED — SAP_BUILD_MANIFEST.md has drifted from the registry/token source." >&2
  echo "A build that imports component keys from a stale manifest will 404 at importComponentSetByKeyAsync." >&2
  echo "Fix: regenerate the manifest §3/§4 from source, then re-run:  node build/check-manifest-sync.js" >&2
  echo "(Details:  node build/check-manifest-sync.js )" >&2
  exit 2
fi

exit 0
