# Canonical Similarity Rubric

> **Delta added 2026-07-16.** Extends `sap-visual-reading` Stage 4 (floorplan scoring) and RULE 28/29
> (clone-canonical). Purpose: turn "pick the closest canonical screen" from a judgment call into a
> **scored ranking** so the choice is justified and wrong-pattern picks are caught early.

## When to use
During ANALYZE → before choosing what to clone (RULE 28). After you've classified the requested screen's
floorplan + regions + components, score it against each candidate canonical screen and clone the highest.

## The score (0–100)

Weighted sum of three dimensions:

| Dimension | Weight | How to score |
|---|---|---|
| **Floorplan match** | 50% | Same SAP floorplan (List Report / Object Page / Dialog / FCL / Wizard / Worklist)? Exact = 50, adjacent variant = 30, different = 0 |
| **Region match** | 30% | Fraction of the request's major regions (header / nav / filter / table / footer / side content) that the canonical also has. `matched_regions / total_request_regions × 30` |
| **Component overlap** | 20% | Fraction of the request's key SAP components the canonical already uses. `shared_components / request_components × 20` |

**Score = floorplan + region + component.** Pick the highest. Cite it: *"Outage List 96% → clone `750:174925`."*

## Decision thresholds
- **≥ 85%** — clone that canonical directly, inject content (RULE 28). High confidence.
- **60–84%** — clone the closest, but expect to add/remove sections. Note the deltas in the plan.
- **< 60%** — no strong match. Combine two canonicals intentionally (cite both) OR build fresh from SAP components (only when genuinely no reference fits — RULE 12). Flag this in the plan.

## Candidate library (score against these)
Full breakdowns in `docs/canonical-screens/COMPLEX-SCREENS-REFERENCE.md` + `COMPLEX-SCREENS-CATALOG.md`.
Node-ID clone table in `SAP_BUILD_MANIFEST.md` §3b.

| Canonical | Floorplan | Node |
|---|---|---|
| Activities View | List Report (narrow) | `615:36810` / `750:174442` |
| Outage List Overview | List Report (desktop) | `750:174925` |
| yanatest Steps | Object Page (narrow) | `560:36552` |
| Schedule Operation (5 states) | Dialog / Form | `9:1470/1498/1696/1550/1609` |
| Side Navigation | SideNav | `699:37890` / `688:37816` |
| Wizard Dialog | Wizard-in-Dialog | `143:98040` / `136:15677` / `190:100212` |
| Validate System Log | Dialog / Log panel | `750:174814` |
| Design System Governance | FCL / DynamicPage | `750:177443` / `495:79506` / `197:102160` |
| Flight Result Card | List Report item card | `472:34431` / `2:5355` |

## Worked example
Request: "table of purchase orders with search, status filter, approve action, desktop."
- Floorplan: List Report desktop → matches Outage List (50)
- Regions: header + filter bar + table + status column → 4/4 in Outage List (30)
- Components: SearchField, Select, Table, ObjectStatus, Link, action Button → 5/6 shared (17)
- **Score = 97% → clone Outage List `750:174925`, swap outage content for PO content.**

## Cross-refs
RULE 28 (clone-canonical) · RULE 29 (visual recovery) · sap-visual-reading Stage 4 (floorplan scoring /30) · `SAP_BUILD_MANIFEST.md` §3b.
