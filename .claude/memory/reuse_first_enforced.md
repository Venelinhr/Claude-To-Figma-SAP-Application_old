---
name: reuse-first-enforced
description: "⭐⭐ 2026-07-17: reuse-first turned from advisory→ENFORCED. 6 audit-roadmap fixes: blocking gate (exit 2) + verified JSON marker, clone() detection, native-frame fallback linter, auto write-back reminder, integrity guard in test-build, Tier-2 privacy split. Canonical Pattern Library (RULE 31) now mechanical."
metadata:
  node_type: memory
  type: project
  severity: critical
  see_also:
    - rule_reuse_approved_screens
    - session_state_current
    - feedback_audit_fixes_workflow_quality
  originSessionId: 8f1e0953-d5bb-448c-8c6b-dc4220c65f91
---

# Reuse-First — Now ENFORCED (not prose)

**Why:** An 18-agent adversarial audit + a 10-area architecture audit both found the Canonical Pattern Library (RULE 31) was fully built but "never turned on" — the gate was advisory, the scorer opt-in, the flywheel stalled. All 6 roadmap fixes closed that.

## What's now mechanical (the 6 fixes)

1. **Blocking gate** — `.claude/hooks/guard-reuse-gate.sh` exits **2** (blocks the use_figma build) when a build is detected with no valid reuse decision. Marker is verified JSON: `{"level":N,"score":S,"baseCanonical":"id","deltaSpec":"path"}`. Hook re-validates level range, score↔level consistency, base exists, delta-spec passes validator.
2. **clone() detection** — gate detects `createInstance|createFrame|\.clone\(` (was blind to clone, RULE 28's main path). `clear-reuse-marker.sh` (SessionStart+Stop) resets the marker so a stale decision can't satisfy the next build.
3. **Native-frame fallback linter** — `build/lint-instance-ratio.js` flags a screen that's mostly plain FRAME/TEXT (wireframe, not SAP). RULE 31 FAIL-CLOSED strengthened.
4. **Auto write-back reminder** — `surface-canonical-record.sh` (Stop) fires when a build was confirmed but not recorded, printing the exact `record-canonical.js` command. Flywheel no longer stalls silently.
5. **Integrity guard** — `build/check-reuse-integrity.js` (wired into `test-build.sh`) fails if a ledger row lacks a matching canonical. Catches the "Schedule Activated" drift class.
6. **Privacy split** — personal Tier-2 node IDs moved OUT of tracked `canonical-index.json` into gitignored `canonical-index-tier2.json`. Scorer/record/integrity all merge it when present. Tracked index = Tier 1 only, zero personal node IDs.

## Key scripts (all in build/)
- `score-canonical.js` — deterministic scorer (floorplan 50 / regions 30 / components 20). USE THIS, don't hand-estimate.
- `validate-delta-spec.js` — checks delta-spec level↔score consistency.
- `record-canonical.js` — write-back: ledger row + Tier-2 entry (to the gitignored side file).
- `check-reuse-integrity.js` — CI drift guard.
- `lint-instance-ratio.js` — native-frame fallback detector.

## How to apply (every build)
1. Score: `node build/score-canonical.js --floorplan "<fp>" --regions <r1,r2> --components <c1,c2>`
2. Record decision: `echo '{"level":N,"score":S,"baseCanonical":"<id>","deltaSpec":null}' > .claude/.reuse-declared`
3. Build (gate now allows it). If blocked, the marker is missing/invalid — fix it.
4. On confirmation: `node build/record-canonical.js --node <id> --name "<n>" --base <c> --level N --score S --outcome "<word>" --date <YYYY-MM-DD>`

## Honest scope (from the audit)
These enforce STRUCTURAL consistency + selection reproducibility + library growth. They do NOT verify VISUAL fitness — a clone can be structurally perfect and still the wrong screen. Always take one verification screenshot vs the reference.

## Reference
Full audit: `audit-output.md` (10 focus areas, prioritized roadmap). The 3-5 highest-leverage items were exactly these fixes.

## Related
[[rule_reuse_approved_screens]] [[session_state_current]] [[feedback_audit_fixes_workflow_quality]]
