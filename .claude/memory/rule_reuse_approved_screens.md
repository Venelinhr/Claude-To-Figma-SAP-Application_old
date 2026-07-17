---
name: rule-reuse-approved-screens
description: "⭐⭐ MANDATORY: Never rebuild from scratch when an approved screen exists. Clone → inject content → swap components. 5-level hierarchy: Exact Match → Similar → Floorplan → Component → New. Canonical node list for file p7zm5EMBk5DRRZdxNeJ4f5."
metadata:
  node_type: memory
  type: feedback
  severity: critical
  see_also:
    - feedback_sap_build_methodology
    - feedback_procurement_list_report_canonical
  originSessionId: 8f1e0953-d5bb-448c-8c6b-dc4220c65f91
---

# Mandatory Rule — Reuse Approved Implementations Before Rebuilding

**Applies-to:** all-builds, every SAP screen request

**Signal:** user requests a screen — BEFORE analyzing or building, check if an approved version exists.

---

## Core Principle

**Never solve the same design problem twice.**

Every approved SAP Fiori screen is a reusable canonical asset. Future requests must first determine whether an existing pattern can satisfy the requirements.

## Workflow

```
User Request
      ↓
Search for Approved Canonical Screen (file p7zm5EMBk5DRRZdxNeJ4f5)
      ↓
Level 1: Exact Match → Clone + inject content
Level 2: Similar Match → Clone closest + adapt
Level 3: Floorplan Match → Reuse floorplan template
Level 4: Component Pattern → Reuse validated compositions
Level 5: Build New → Only when nothing else fits
```

Always start at Level 1 and move down only when necessary.

## Build by Transformation, Not Recreation

**Instead of:** Reference → Analyze → Design → Build

**Use:** Approved Screen → Clone → Replace Content → Swap Components → Validate → Deliver

## What to reuse (preserve unchanged)
- Floorplan
- Layout structure
- Component hierarchy
- Auto Layout
- SAP Web UI Kit instances
- SAP tokens, typography, spacing, accessibility

## What to change (inject/swap)
- Business content, labels, titles, descriptions
- Icons, variants, states
- Table columns, form fields, navigation items
- Actions, images, business data

## Canonical Node Reference (file `p7zm5EMBk5DRRZdxNeJ4f5`)

| Screen | Node | Use for |
|--------|------|---------|
| Design System Governance Console | `750:177443` | FCL + SideNav + nested tables |
| Activities View (List Report) | `750:174556` | List Report with progress rows |
| Side Navigation | `750:174158` | Full SideNav tree |
| Schedule Op — Daily | `750:174190` | Dialog/form, date+time |
| Schedule Op — Monthly | `750:174290` | Dialog with recurrence pattern |
| Schedule Op — Activities | `750:174442` | List Report variant |
| Schedule Op — State B2 | `750:174786` | Dialog variant |
| Validate System | `750:174814` | Log panel, severity pills |
| Schedule Op — State D | `750:174866` | Dialog end-date variant |
| Outage List Overview | `750:174925` | Desktop List Report, 8 columns |
| Schedule Op — State E | `750:174960` | Dialog final state |

## Exceptions — build new only when
- No approved reference exists
- Information architecture changes significantly
- Different SAP floorplan required
- Business workflow fundamentally differs
- User explicitly requests a redesign

Even then: find the closest approved implementation and reuse as much architecture as possible.

## Why (the comparison)

| | Build from Scratch | Reuse & Inject |
|--|--|--|
| Speed | ❌ Slow | ✅ Fast |
| Tokens | ❌ High | ✅ Low |
| Consistency | ⚠️ Variable | ✅ Proven |
| SAP compliance | ⚠️ Rediscovered | ✅ Already validated |
| Quality | ⚠️ Depends | ✅ Consistent |
| Regressions | ❌ High risk | ✅ Low risk |

**Evidence:** 2026-07-17. User mandate + comparison table confirmed. Every approved screen becomes a reusable production asset, not a one-time result.

## Related
[[feedback_sap_build_methodology]] [[feedback_procurement_list_report_canonical]] [[feedback_sap_sidenav_canonical_method]]

## Mechanical enforcement (added 2026-07-17 — the 4 gaps closed)

Reuse-first is no longer prose-only. The following make it enforced:
- **Score deterministically:** `node build/score-canonical.js --floorplan "<fp>" --regions <r1,r2> --components <c1,c2>` — reads canonical-index.json, returns exact ranked scores + reuse level. Don't hand-estimate.
- **Validate the plan:** `node build/validate-delta-spec.js <spec.json>` — checks level↔score consistency + base canonical exists.
- **Gate before build:** `guard-reuse-gate.sh` (PreToolUse on mcp__figma__use_figma) reminds if no reuse decision recorded. Write it: `echo "Level N — <canonical>" > .claude/.reuse-declared`.
- **Grow the library mechanically:** on confirmation, `node build/record-canonical.js --node <id> --name "<n>" --base <c> --level <N> --score <S> --outcome "<word>" --date <YYYY-MM-DD>` — appends ledger + adds Tier 2 entry.
- **Scoring conflict fixed:** floorplan adjacent = 30 in BOTH canonical-similarity-rubric.md and SYSTEM_PROMPT RULE 31 (was 30 vs 25).

**Honest scope:** these enforce STRUCTURAL consistency + selection reproducibility. They do NOT verify VISUAL fitness — a clone can be structurally perfect and still the wrong screen. Always take one verification screenshot and compare vs reference.
