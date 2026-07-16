---
name: operating-manifest
description: "⭐ Single authoritative rule map: docs/OPERATING-MANIFEST.md — Purpose/Workflow/Component Policy/Reference-First/Improvement/Success Criteria, all cross-referencing the 29 RULEs (no duplication). + 4 deltas: similarity rubric, Design Quality Score ≥95%, Reference Coverage Map, Knowledge Index."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 8f1e0953-d5bb-448c-8c6b-dc4220c65f91
---

# SAP Operating Manifest + v2 Deltas (2026-07-16)

Consolidated the user's 5-part rule document into ONE authoritative map + built 4 genuine deltas.
Key principle: **no duplication** — the manifest cross-references existing RULEs, never restates them
(a 6th contradictory source = the project's #1 documented failure).

## What was created
1. `docs/OPERATING-MANIFEST.md` — the single rule map. 6 sections (Purpose · Workflow · Component Policy · Reference-First · Continuous Improvement · Success Criteria), each with "→ Authoritative source" pointers to SYSTEM_PROMPT.md RULEs / SAP_BUILD_MANIFEST / canonical-screens. Read this to know WHERE a rule lives.
2. `docs/KNOWLEDGE-INDEX.md` (delta 4) — what-you-need → where-it-lives pointer map (build knowledge / references / rules / MCP / agents / gates).
3. `skill/references/canonical-similarity-rubric.md` (delta 1) — numeric score to pick which canonical to clone: floorplan 50% + region 30% + component 20% → %. ≥85% clone direct, 60–84% clone+deltas, <60% combine/fresh. Cross-linked from sap-visual-reading Stage 4.
4. `skill/agents/qa-certification.md` (deltas 2+3):
   - **Design Quality Score ≥95%** — single weighted gate rolling up completeness/coverage/compliance/reuse/layout/a11y/similarity. Sits ON TOP of existing sub-thresholds, doesn't replace them.
   - **Reference Coverage Map** — per-region table (reference region → SAP component → covered ✓/✗). Anti-omission artifact; every ✗ repaired or logged as exception.

## What was NOT rebuilt (already existed — ~90% of the proposal)
Mandatory workflow (RULE 28 + Step 0–7), MCP-first + fail-closed (RULE 25 + MANIFEST §1), reference-first (RULE 12/28/29), 12-phase pipeline (V2-REASONING-PIPELINE + 8-stage sap-visual-reading), component confidence, Exception Engine (RULE 16/21), canonical quality bar (docs/canonical-screens), learning loop (REPAIR-PATTERNS).

## Verification
`bash build/test-build.sh` exit 0 · counts consistent (29 RULEs / 8 agents / 18 canonical) · 17 cross-ref pointers · no 6th pipeline.

[[july915_recovery_complete]] [[canonical_complex_screens_18]] [[rule_29_visual_recovery_protocol]]
