#!/bin/bash
# guard-figma-code.sh — PreToolUse hook · Gate 5 (INVARIANT 1, code-semantics). BLOCKING.
#
# Fires before a use_figma build and inspects the CODE ITSELF for the #1 historical failure:
# native figma.createFrame() substituted for a real SAP Web UI Kit component.
#
# Two blocks (exit 2):
#   1. createFrame() present with ZERO instance-creation calls = a pure native wireframe, not SAP.
#   2. A createFrame() named after a SAP component (ShellBar/Button/Table/...) = a fake component.
#
# Read-only use_figma calls (get/find/inspect, no frame mutation) pass silently.
# This complements guard-reuse-gate.sh (reuse decision) and verify-invariants.js (post-build truth).
#
# Tool input arrives as JSON on stdin (.tool_name, .tool_input.code). exit 2 = block; exit 0 = allow.
INPUT=$(cat)
TOOL=$(echo "$INPUT" | jq -r '.tool_name // empty')
echo "$TOOL" | grep -qi "use_figma" || exit 0

CODE=$(echo "$INPUT" | jq -r '.tool_input.code // ""')

# Only inspect calls that mutate the canvas (build calls).
echo "$CODE" | grep -qE "createInstance|createFrame|importComponentSetByKeyAsync|\.clone\(" || exit 0

CF=$(echo "$CODE" | grep -oE "createFrame\(" | wc -l | tr -d ' ')
INST=$(echo "$CODE" | grep -oE "createInstance\(|importComponentSetByKeyAsync\(|\.clone\(" | wc -l | tr -d ' ')

# Block 1 — native-frame wireframe: createFrame present, zero SAP instances/clones.
# Exception: presentation/pitch slides are legitimate native-frame builds (they are
# not SAP application screens). If the code contains slide/presentation markers, allow.
IS_PRESENTATION=false
echo "$CODE" | grep -qiE "makeSlide|Pitch|PRESENTATION|1920.*1080|slide.*1920|\"[0-9]+ (Pitch|Slide|Hero|Closing)\"" && IS_PRESENTATION=true

if [ "$CF" -gt 0 ] && [ "$INST" -eq 0 ] && [ "$IS_PRESENTATION" = "false" ]; then
  echo "⛔ GATE 5 BLOCKED (INVARIANT 1) — this use_figma code calls figma.createFrame() with ZERO SAP instance/clone calls." >&2
  echo "That produces a native-frame wireframe, NOT a SAP screen. Every UI element must be a real SAP Web UI Kit instance:" >&2
  echo "  • importComponentSetByKeyAsync(<key>) → defaultVariant.createInstance()  (build new)" >&2
  echo "  • OR clone an approved canonical node: canonicalNode.clone()  (RULE 28 clone-first)" >&2
  echo "Native frames are allowed ONLY for documented primitives (divider, ◆ICON/ placeholder, progress-bar fill, layout container)." >&2
  exit 2
fi

# NOTE: We deliberately do NOT try to detect "createFrame named like a SAP component" here.
# At the code level we cannot reliably tell whether `.name = "Button"` sits on a createFrame
# (fake) or on a real createInstance() (correct — SAP instances keep official names). That
# distinction requires the node TYPE, which only exists post-build. verify-invariants.js
# (Gate 6/7) reads the real frame tree and catches any FRAME-named-as-a-SAP-component with
# zero false positives. This pre-build hook only blocks the unambiguous case (Block 1 above).

exit 0
