# Validation Checklist

The orchestrator runs this checklist at Step 5 — the hard gate between component design and spec generation.
Every item must pass before `meta.validationStatus` can be set to `"pass"`.
A single failure sends the pipeline back to the responsible agent with the specific failure listed.

---

## 0. Pre-flight (Step 2.5 draft approval)

- [ ] User saw the ASCII wireframe + structured region map in chat before any JSON was generated
- [ ] User replied with an approval phrase (`approved` / `looks good` / `go` / `ship it` / `build it` / `yes do it` / ✅)
- [ ] All refine-loop mutations were applied to `regions[]` and re-rendered before approval
- [ ] No refine request was silently dropped — any pushed-back changes have a logged reason

**If draft approval is missing → return to draft-preview.md and complete Step 2.5 first.**

---

## 1. Pattern integrity

- [ ] The selected floorplan matches the requirement (use `references/floorplan-decision-matrix.md` to verify)
- [ ] No non-SAP patterns used (no Material UI, Ant Design, Bootstrap, custom components)
- [ ] Every component name resolves to a file in `knowledge/components/registry/` or `knowledge/sapui5-verified-controls.md`
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

---

## 8. Reference Analysis (when a visual reference was provided)

- [ ] **Step 0 ran**: the 12-step analysis pipeline completed before any generation started
- [ ] **Zero-Omission**: every meaningful element in the reference has been detected and classified
- [ ] **7 passes complete**: Detection → Classification → SAP Mapping → Composition → Layout → Tokens → Accessibility all passed
- [ ] **Container-First (RULE 14)**: generation started from the highest-level SAP container, not individual elements
- [ ] **SAP documentation consulted**: official SAP docs read for every container component before building its children
- [ ] **Instance-first**: all SAP components are inserted as linked instances (purple diamond icons in Figma layers)
- [ ] **Detach exceptions documented**: any detached component has a reason recorded in `meta.decisions.composition.childRationale[]`
- [ ] **Designer improvements suggested**: any deviations from SAP Fiori best practices in the reference are noted and improvements proposed
- [ ] **Positive feedback respected**: if user confirmed a prior result as correct, that approach was preserved (RULE 15)
- [ ] **Draft approved by user before Step 3 began** (Step 2.5)

---

## 9. Engineering Principle (RULE 13)

- [ ] No failing code path has been patched more than once with additional try/catch, retries, or diagnostics without a root-cause fix
- [ ] When a working code path exists, it has been adopted as canonical rather than maintaining competing implementations
- [ ] Text nodes and other direct-render elements use the **proven inline call-site pattern**, not the generic buildTree dispatch when that pattern has failed

---

## 10. Pre-Generation Fidelity Audit (mandatory — Zero-Omission Policy)

This checklist must be completed **before** any spec is generated. Every item is a defect if failed.

### Pass 1 — Visual Detection
- [ ] Every visible component detected (containers, fields, buttons, icons, dividers, badges)
- [ ] Every header element classified: title, subtitle, actions, icons, overflow menus, avatars, notifications

### Pass 2 — OCR / Text Extraction
- [ ] Every visible text extracted: headings, labels, values, placeholders, helper text, status text, metadata
- [ ] No text replaced with "Placeholder" unless the reference itself contains "Placeholder"
- [ ] No business label replaced with generic content

### Pass 3 — Semantic Classification
Each text element classified as: Heading | Label | Value | Placeholder | Helper text | Status | Action | Metadata | Description

### Pass 4 — SAP Mapping
- [ ] Every field analyzed with its full context: label, required indicator (*), placeholder, default value, helper text, validation state
- [ ] Every button analyzed: variant, emphasis, enabled/disabled state, icon, label, placement
- [ ] Every icon identified and mapped to SAP icon name (`sap-icon://...`)
- [ ] No visual styling invented — every border, color, shadow must be justified by SAP guidelines or the reference

### Pass 5 — Layout Validation
- [ ] Alignment, spacing, grouping, reading order, Auto Layout all verified
- [ ] No panel/section border present in spec unless it exists in the reference

### Pass 6 — Completeness Audit (compare generated vs reference)
- [ ] No header elements missing (title, subtitle, actions, icons)
- [ ] No field labels missing
- [ ] No icons missing
- [ ] No actions missing
- [ ] No sections missing
- [ ] No business text replaced with generic placeholders
- [ ] No unsupported decorative styling introduced
- [ ] Typography matches SAP semantic role (heading level, token-linked)

### Permanent Rules encoded from this audit
- **Never invent borders** not present in the reference or justified by SAP guidelines
- **Never replace business labels** (API, Name, ID, MCP Path, Virtual Host, etc.) with generic text
- **Never skip header actions** — scan the full header region including top-right icons
- **Typography must match semantic role** — determine role first, then apply SAP typography token
- **Button state must be explicit** — enabled:false when reference shows disabled/greyed
- **Every field must carry**: label (if visible in reference), required marker (if asterisk visible), placeholder (exact text from reference), default value (exact text from reference)

Generation succeeds only when all 6 passes complete with zero failures.

