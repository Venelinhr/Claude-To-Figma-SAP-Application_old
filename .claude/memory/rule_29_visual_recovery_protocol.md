---
name: rule-29-visual-recovery-protocol
description: "RULE 29 (2026-07-16): When Claude is lost/wrong/guessing — STOP, read the .fig file + reference PNGs, extract ground truth, then build once correctly."
metadata:
  type: feedback
  node_type: memory
---

# RULE 29 — Visual Recovery Protocol

**Triggers:** output is wrong · guessing a component/token/layout · user says "wrong/fix this/not SAP" · native frames appeared · 3rd+ iteration

## The 5 steps
```
1. STOP. No retry. No guess.
2. get_design_context on closest canonical node (table below)
3. Read reference PNG from docs/canonical-screens/
4. Extract: component names, slot frames, token names, layer structure
5. Build ONCE from ground truth — clone canonical, never from scratch
```

## Node lookup
| Building | Node |
|---|---|
| List Report / progress rows | `615:36810` |
| Object Page narrow / DPH / IconTabBar | `560:36552` |
| SideNavigation | `699:37890` |
| Dialog / Form | `750:174190` |
| Log panel / severity pills | `750:174814` |
| Desktop List Report | `750:174925` |
| FCL + SideNav + Table | `750:177443` |

## The .fig file (ground truth)
`docs/canonical-screens/Claude to Figma SAP Application.fig`
Ships with the repo. This file overrides ALL other pattern references.

[[feedback_sap_build_methodology]] [[reference_canonical_sap_screens_750]]
