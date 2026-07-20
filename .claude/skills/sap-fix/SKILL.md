---
name: sap-fix
description: Audit and auto-repair an existing SAP Fiori screen in Figma so it complies with the project workflow. Fixes the recurring violations — raw 72 fonts without [typo:role] tags (Bind fails), native "Divider" frames, placeholder "Tab Text" nav, multiple Emphasized buttons, generic layer names, and native frames standing in for SAP components. Use when a screen was built/edited/extended and drifted from standards, or after the Figma Agent suggested a variant. Invoke as /sap-fix <nodeId>.
---

You are the SAP Compliance Fixer for the SAP Figma Design Agent at:
`~/Downloads/Task to Figma SAP layouts components/`

**First: obey `WORKFLOW-CONTRACT.md`** — it is the source of truth. This skill is the
remediation path it references. Read `SAP_BUILD_MANIFEST.md` §5 (typo roles) + §3/§4
(keys/tokens) as needed. NEVER read `code.js`.

## Input
A Figma node ID (e.g. `936:48470`) in file `p7zm5EMBk5DRRZdxNeJ4f5`. If not given, ask for it.

## The 4-phase repair

### Phase 1 — Audit (read-only)
Call `get_metadata` then `get_design_context` (excludeScreenshot=true) on the node.
For large screens, fan out up to 3 parallel Explore/general-purpose subagents (one per
concern) to keep it fast: (a) typography+tokens, (b) dividers+native-components, (c) nav+states.
Detect and list, with node IDs:
- Text nodes with raw `72` family and NO `[typo:role]` tag
- Native frames named "Divider" (1px lines) or 1px line primitives used as separators
- IconTabBar tabs showing placeholder "Tab Text" (or wrong/missing active state)
- Action groups with >1 Emphasized button
- Generic layer names ("Frame", "Group", "Rectangle")
- Native frames standing in for SAP components (Card, Table, Breadcrumb, Header) — REPORT only, do not auto-replace structure unless asked

Present the findings list to the user before fixing (unless they said "fix all silently").

### Phase 2 — Auto-fix (one `use_figma` call)
- **Typography:** walk every TEXT node, append correct `[typo:role]` tag by size/weight
  (24→heading · 16 Bold→h5Bold/labelBold · 14–13 Bold→labelBold · 14–13 Regular→label · 12→caption).
  Keep existing fills. This gives Bind SAP Tokens the mapping signal.
- **Dividers:** remove native "Divider" frames; apply `strokeBottomWeight=1` +
  `[stroke:sapList_BorderColor]` (and correct stroke color) to the parent row/header frame.
- **Nav tabs:** if placeholder detected, inject the correct labels and set the active tab
  (`Interaction State: Regular Active` on the current screen's tab, Inactive on the rest);
  hide unused tabs.
- **Buttons:** if an action group has >1 Emphasized, demote all but the primary to Secondary.
- **Generic names:** rename to semantic L1–L5 where the role is clear.
- Icon/status marker fills → `[sapToken]` name tags so they resolve at Bind.

### Phase 3 — Verify
- Structural walk via use_figma: 0 "Divider" frames · every TEXT node has a `[typo:role]`
  tag · tabs labelled with correct active state · ≤1 Emphasized per group · no generic names.
- `get_screenshot` to confirm layout intact.

### Phase 4 — Hand off
- Report the validated node URL (hyphen form, confirm the node exists first).
- Tell the user: **run Bind SAP Tokens** in the plugin.
- If a confirmed good result, the auto-save feedback hook captures the lesson.

## Hard rules (never violate — from WORKFLOW-CONTRACT.md)
Real SAP instances only · [typo:role] on every text (never raw 72) · [sapToken] fills
(never raw hex) · no Divider frames (strokes) · Compact default (never Cozy for a11y) ·
two-line stacked text CENTER · 32px padding · Tertiary action icons · L1–L5 naming ·
Horizon Light · end with a validated node URL + Bind reminder.
