---
name: canonical-complex-screens-18
description: ⭐⭐⭐ 18 canonical complex SAP screens fully extracted (structure/components/layout/tokens) as PERFECT EXAMPLES. In docs/canonical-screens/ COMPLEX-SCREENS-REFERENCE.md + CATALOG.md. Raw PNGs privacy-excluded. Use as source of truth for complex builds.
metadata: 
  node_type: memory
  type: reference
  originSessionId: 8f1e0953-d5bb-448c-8c6b-dc4220c65f91
---

# 18 Canonical Complex SAP Screens — Perfect Examples (2026-07-16)

User-designated **perfect examples of complex SAP screens**. Fully extracted (structure, components, layout, tokens, interaction) + adversarially verified via 2 extraction workflows. Shipped to GitHub as structural docs; raw screenshots privacy-excluded.

## Where
- `docs/canonical-screens/COMPLEX-SCREENS-REFERENCE.md` — first 4 (SideNav, yanatest, Validate System, Activities View)
- `docs/canonical-screens/COMPLEX-SCREENS-CATALOG.md` — 14 more (Schedule Op ×5, Flight Card, Outage List, SideNav ×2, Wizard ×3, Governance ×2)
- Raw PNGs: `docs/canonical-screens/_private-refs/*.png` — gitignored (privacy)

## The 18 screens by pattern
- **Schedule Operation dialog** (5 states A/B/B2/C/D) — `E083` 9:1470/1498/1696/1550/1609 — divider-driven form card, progressive disclosure, Monthly Pattern box, disabled=45% opacity
- **Flight Result Card** — `E083` 2:5355 — two-zone split card, flex-grow connector lines, semantic price coloring
- **Outage List Overview** — `E083` 30:2741 — desktop List Report, 4-variant status ObjectStatus, action in page header
- **Side Navigation** (3) — `p7zm` 688:37816, 699:38309 + `750:174158` — Two-Click-Area, sticky footer, slot placeholders, 3px absolute accent bar
- **Wizard Dialog** (3) — `p7zm` 143:98040, 136:15677, 190:100212 — numbered step circles (filled active/outline done), flex-grow connectors, active label Semibold
- **Design System Governance** (2) — `p7zm` 495:79506, 197:102160 — most complex: ShellBar+SideNav+DynamicPage+IconTabBar+Table+DynamicSideContent(Calendar+MessageStrip)+SplitButton
- **yanatest / Validate System / Activities View** — in COMPLEX-SCREENS-REFERENCE.md

## Key reusable patterns (see docs for full detail)
- Dialog card: 8px radius (12 for cards) + 1px sapList_BorderColor + Shadow1, NOT a page
- Divider-driven sections (zero root gap)
- Two-Click-Area SideNav; selected = #ebf8ff + 3px #0064d9 accent
- Wizard: filled-emphasized active circle vs outline; active label Semibold; flex-grow connectors
- Status colors: Success #256f3a · Information #0064d8 · Critical #b44f00 · Negative #aa0808
- Selects reuse Input control; all interactive = blue; Compact density for admin screens
- Named ⿻ slots with hidden placeholders — toggle by visibility

[[reference_canonical_sap_screens_750]] [[rule_29_visual_recovery_protocol]] [[july915_recovery_complete]]
