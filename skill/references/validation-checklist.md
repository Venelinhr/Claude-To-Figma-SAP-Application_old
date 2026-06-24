# Validation Checklist

The orchestrator runs this checklist at Step 5 — the hard gate between component design and spec generation.
Every item must pass before `meta.validationStatus` can be set to `"pass"`.
A single failure sends the pipeline back to the responsible agent with the specific failure listed.

---

## 1. Pattern integrity

- [ ] The selected floorplan matches the requirement (use `references/floorplan-decision-matrix.md` to verify)
- [ ] No non-SAP patterns used (no Material UI, Ant Design, Bootstrap, custom components)
- [ ] Every component name resolves to a file in `knowledge/schemas/` or `knowledge/sapui5-verified-controls.md`
- [ ] `meta.unverifiedComponents` is empty — if not, pipeline must loop back to component architect
- [ ] All component dependencies are satisfied (use `references/component-dependencies.md`)
- [ ] No forbidden combinations are present

**If any item fails → return to component-architect.md with the specific failure list.**

---

## 2. Structural rules

- [ ] ShellBar is the **first** item in `hierarchy[]`
- [ ] DynamicPage or ObjectPageLayout or FlexibleColumnLayout is the **second** item
- [ ] DynamicPage has a `title` slot (DynamicPageTitle) — always present
- [ ] DynamicPage has a `header` slot **only if** the floorplan is `list-report` or `analytical-list-page`
- [ ] DynamicPage has **no** `header` slot on `worklist` floorplan
- [ ] FilterBar is **inside** DynamicPageHeader, **never** in content
- [ ] ObjectPageLayout has at least one `ObjectPageSection`
- [ ] Table has a `headerToolbar` slot with OverflowToolbar containing a Title and ToolbarSpacer
- [ ] Named slots used for named aggregations (DynamicPage, FilterBar, Table) — not generic `children`

---

## 3. Layout, spacing, density

- [ ] `screen.density` is set — `compact` for all back-office/desktop apps (team convention)
- [ ] `screen.theme` is `sap_horizon`
- [ ] No pixel values anywhere in the spec (no `"width": 1440`, no `"height": 44`)
- [ ] No hardcoded color values (no `"#0a6ed1"`, no `"rgb(...)"`)
- [ ] `props` contains **only non-default values** — nothing that matches the SAP default

---

## 4. Content

- [ ] All `Button` nodes that are user-visible have a `label`
- [ ] All `Button` nodes that trigger a specific type of action have `intent` set
- [ ] Table rows use `repeat` + `sampleData` — no enumeration of identical nodes
- [ ] `sampleData` arrays have ≥ 3 varied values when `repeat` ≥ 3
- [ ] Sample data is realistic enterprise data — no lorem ipsum, no "Test", no sequential numbers
- [ ] `ObjectStatus` nodes have `sampleData.state` values from the semantic set (Warning/Success/Error/Information)
- [ ] Column count in `columns` slot matches cell count in `ColumnListItem.children`

---

## 5. Accessibility

- [ ] Icon-only buttons have a `note` field with tooltip description (or `label` is set as tooltip)
- [ ] Status values are not conveyed by color alone — `ObjectStatus` carries both `text` and `state`
- [ ] No content that relies solely on position ("the button on the left") — labels identify everything

---

## 6. Enterprise workflow rules

- [ ] If `screen.density` is `compact`, no Cozy-specific components or variant names
- [ ] Bulk actions (Approve, Reject, Delete) are in the table toolbar — never in row cells
- [ ] Draft save actions (Save, Discard) are in DynamicPage `footer` slot — never in content area
- [ ] Destructive actions (Delete, Reject) have `intent: "destructive"` — never `intent: "primary-action"`
- [ ] At most one `intent: "primary-action"` button per screen region (one primary per toolbar)
- [ ] Error handling: if the table can be empty, there is an `IllustratedMessage` sibling node

---

## 7. Spec-schema compliance

- [ ] `$schema` field is present and set to `"https://claude-to-figma-sap/spec-schema.json"`
- [ ] `meta.requirement` contains the original requirement text (not paraphrased)
- [ ] `meta.floorplan` is one of the 9 enum values
- [ ] `meta.floorplanRationale` explains the floorplan choice in one sentence
- [ ] `meta.rationale` summarises the 2–3 key design decisions
- [ ] All node `id` values are unique kebab-case strings within the spec
- [ ] No empty arrays (`"children": []`, `"slots": {}`) — omit the field if unused

---

## Sign-off format

When all items pass, the orchestrator writes this two-line summary before proceeding to Step 6:

```
VALIDATION PASS
[Screen name] | Floorplan: [floorplan] | Components: [N] verified | Density: [compact/cozy] | Ready for spec generation.
```

When any item fails, the orchestrator writes:

```
VALIDATION FAIL — returning to [agent name]
Failed items:
- [Item from checklist]
- [Item from checklist]
Action required: [specific instruction for the agent]
```
