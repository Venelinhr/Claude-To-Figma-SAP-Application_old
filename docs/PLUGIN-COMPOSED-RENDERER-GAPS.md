# Plugin composed-renderer gaps · discovered 2026-07-08

While building two real specs (warehouse-shipments-worklist, sap-landscape-mgmt-activities) the plugin's composed-instance renderers revealed a consistent class of gap: **text/label injection into child items of composed SAP instances fails silently**.

The container instance renders. The child items render structurally. But per-item text bound to the spec's `label` or `props.text` doesn't reach the correct Text nodes inside the composed structure.

## The 6 known gaps

### 1. `ShellBar.title` — kit default "Product Identifier" persists
**Symptom:** ShellBar renders with "Product Identifier" instead of the spec's `props.title` value.
**Location:** `plugin/figma-builder/code.js` — ShellBar handler
**Fix:** After instantiating the ShellBar, `findOne(n => n.type === 'TEXT' && n.name matches title-text)` and inject `props.title`.
**Effort:** ~5 lines

### 2. `DynamicPageTitle` — kit default breadcrumbs pass through
**Symptom:** Renders "Parent item / 1st child item / Current item" even when spec has no `breadcrumbs` slot.
**Location:** DynamicPageTitle handler (line ~6533 in code.js)
**Fix:** When `slots.breadcrumbs` is absent OR explicitly `[]`, find + hide the default breadcrumb frame.
**Effort:** ~10 lines

### 3. `DynamicPageTitle` — kit default actions (Edit/Copy/share/fullscreen/close) pass through
**Symptom:** Renders SAP kit's default action row even when spec has no `actions` slot.
**Location:** Same as #2
**Fix:** When `slots.actions` is absent OR explicitly `[]`, find + hide the default action frame. Also: implement real `actions` slot injection to replace defaults with spec buttons.
**Effort:** ~30 lines (actions slot injection is the harder half)

### 4. `ProgressIndicator` — displayValue/percentValue ignored
**Symptom:** Bar shows "60%" regardless of spec's `percentValue: 100, displayValue: "100%"`.
**Location:** ProgressIndicator handler
**Fix:** Read `nodeSpec.props.percentValue` and `nodeSpec.props.displayValue`, apply via `setProperties({ 'Value': ..., 'Show Value': 'True' })` and inject the label text node.
**Effort:** ~15 lines

### 5. `IconTabBar` items — labels not injected
**Symptom:** Tabs render as "Tab Text · Tab Text · More" instead of spec's `IconTabFilter.label` values.
**Location:** IconTabBar composed renderer
**Fix:** After instantiating the IconTabBar, iterate `slots.items[]` and for each `IconTabFilter`:
- Find the corresponding tab's Text node inside the composed structure
- Inject the item's `label` value
- Apply `key` for selection state matching against `IconTabBar.props.selectedKey`
**Effort:** ~25 lines

### 6. `SegmentedButton` items — labels not injected
**Symptom:** Renders "Button · Button · Button · Button" (with extra kit-default items) instead of spec's 2 `SegmentedButtonItem.label` values.
**Location:** SegmentedButton composed renderer
**Fix:** Similar to #5 — iterate `slots.items[]` and inject each item's label. Also: hide kit-default extra items when spec provides fewer than the kit default.
**Effort:** ~20 lines

## The pattern

All 6 gaps share the same root: **composed SAP instances have default demo content that the plugin doesn't consistently override with spec data.** When a spec provides:
- No override (like breadcrumbs, actions) → default should be hidden
- Explicit override (like tab labels) → default text should be replaced

The SAP components with dedicated non-composed handlers (Panel, ObjectStatus, Text, Label, MessageStrip, Input, Select) all work correctly. The composed multi-item ones (ShellBar, DynamicPageTitle with slots, IconTabBar, SegmentedButton, ProgressIndicator) have this gap.

## Total effort to fix all 6

Roughly **1-2 hours of plugin code changes** in a single focused session. Each fix is small, similar in shape, and testable independently.

## Reproduction — the two specs that surfaced these

- `output/sap-landscape-mgmt-activities-spec.json` — surfaced gaps #1, #2, #3, #4, #5, #6
- `output/warehouse-shipments-worklist-spec.json` — surfaced gaps #2, #3 (DynamicPageTitle defaults showing)

Both specs are registry-compliant and token-compliant. The gaps are pure plugin-side issues, not spec issues.

## Priority ranking (if you fix these later)

1. **#5 IconTabBar labels** — very common in Fiori patterns
2. **#4 ProgressIndicator value** — safety-critical (a wrong percentage is misleading)
3. **#6 SegmentedButton labels** — very common in view-toggles
4. **#1 ShellBar title** — cosmetic but universally visible
5. **#2 + #3 DynamicPageTitle defaults** — cosmetic; workaround exists (provide empty slots explicitly in spec)

## What this means for future specs

Until fixed:
- Text-heavy composed instances will show kit defaults instead of spec values
- Specs should not rely on ShellBar title, IconTabBar labels, SegmentedButton labels, or ProgressIndicator numeric values for critical semantic communication
- The pattern IS the deliverable; the exact text may need Figma manual override after build

## Documented 2026-07-08 during LaMa Activities build (Option A shipped as mockup-quality).
