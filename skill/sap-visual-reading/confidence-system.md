# Confidence system

Every component mapping, layout inference, and token assignment in this skill carries one of three confidence tiers. This is mandatory — not optional.

---

## The three tiers

### ● Confirmed
Directly visible and unambiguous in the image, or explicitly stated in the business requirement or document.

No reasonable alternative interpretation exists.

Examples:
- CheckBox is checked (blue fill visible) ●
- Button label reads "Save schedule" ●
- Required indicator `*` is red ●
- DatePicker shows value "10.07.2026" ●
- "Monthly" pill button is active (filled background, white text) ●

---

### ○ Inferred
Not directly visible, but strongly implied by visual pattern, standard SAP behavior, or design convention.

A reasonable designer would make the same inference, but it is not confirmed by the image or text alone.

Examples:
- Row 2 of monthly pattern is disabled — controls appear dimmed, but `enabled=false` is the inferred implementation ○
- Sections separated by spacing only — no explicit `sap.m.Panel` wrappers visible, VBox with margin inferred ○
- Dialog has fixed width ~560px — estimated from proportional comparison, not measured ○
- Footer bar is right-aligned — standard SAP Dialog behavior, not explicitly shown ○

---

### ? Ambiguous
Two or more valid SAP component choices exist, or the image/requirement does not provide enough information to decide.

When this tier is assigned, always present 2–3 options and let the designer choose. Never pick silently.

Examples:
- Pill buttons for recurrence type: sap.m.SegmentedButton vs sap.m.ToggleButton ×4 ?
- Inline muted text after CheckBox label: sap.m.Label in HBox vs sap.m.FormattedText ?
- Section divider: sap.m.Toolbar separator vs CSS border vs sapUiTinyMargin spacing only ?
- Monthly pattern container: sap.m.Panel with border vs styled VBox ?

---

## How to apply in output

Every element entry must look like this:

```
Element: Recurrence checkbox
Confidence: ●
Observation: CheckBox with blue fill, bold label "Recurrence", checked state visible
SAP component: sap.m.CheckBox
Properties: text="Recurrence", selected=true, select=".onRecurrenceToggle"
Framework: SAPUI5 + Web Components (ui5-checkbox)
```

```
Element: Pattern row disabled state
Confidence: ○
Observation: Row 2 controls appear at lower opacity
Inferred: enabled=false on all child sap.m.Select and sap.m.RadioButton controls
Note: Actual implementation may use CSS class or binding expression — verify with developer
```

```
Element: Recurrence type selector
Confidence: ?
Observation: 4 pill-shaped buttons, one active (Monthly), others inactive
Options:
  A) sap.m.SegmentedButton — selectedKey binding, single-select enforced by component
  B) sap.m.ToggleButton ×4 in sap.m.HBox — independent pressed state per button
  → Recommend A if only one type can be active at a time (standard scheduling behavior)
  → Use B if the requirement ever allows multiple types simultaneously
```

---

## Confidence in the confidence table

At the end of every output, the confidence table summarizes by area:

| Area | Confidence | Notes |
|------|-----------|-------|
| Screen classification | 99% | Clearly a sap.m.Dialog |
| Floorplan selection | 97% | Dialog confirmed; Page alternative noted |
| Layout reconstruction | 88% | Column layout inferred; spacing estimated |
| Component mapping | 94% | 2 ambiguous elements noted as ? |
| Typography tokens | 85% | Font sizes estimated; verify in Figma UI Kit |
| Color tokens | 90% | Dark background = sapBackgroundColor confirmed |
| States and variants | 82% | Disabled state inferred, not confirmed |

Anything below 80% gets a corresponding open question in the output.

---

## What happens when image quality is low

If the image is a photo (not a screenshot), compressed JPEG, or taken at an angle:

- Downgrade all ● reads to ○ unless text is fully legible
- Downgrade all ○ reads to ?
- Add a note at the top of the output: "Image quality limited — readings below 80% confidence. Recommend a clean PNG screenshot for higher accuracy."
- List which elements could not be read and why
