# Schedule operation dialog — worked example

This is the canonical reference output for the sap-visual-reading skill.
Image source: high-res PNG screenshot, Tier 1 quality, dark Horizon theme.

---

## Reference images

### State 1 — Monthly recurrence active, end date hidden
![Schedule operation dialog — monthly recurrence selected, end date unchecked](../images/schedule-dialog/01-monthly-recurrence.png)

**What this shows:**
- Zone S1: Header — title + subtitle
- Zone S2: Timing — Start date (10.07.2026) + Start time (08:00), both required
- Zone S3: Recurrence checkbox checked + "Monthly" pill active + monthly pattern panel
- Zone S4: Monthly pattern — Row 1 active (Day 1 of every 1 month) + Row 2 inactive/dimmed
- Zone S5: End date checkbox unchecked — pickers hidden. Cancel + Save schedule buttons

---

### State 2 — End date checkbox checked, pickers revealed
![Schedule operation dialog — end date checked, showing dd.mm.yyyy + 23:59 fields](../images/schedule-dialog/02-end-date-revealed.png)

**What this shows:**
- End date checkbox now checked (blue fill)
- End date field: placeholder `dd.mm.yyyy` — not pre-populated (unlike Start date)
- End time field: pre-filled `23:59` — opinionated default (end of day)
- Dialog height expands dynamically — footer shifts down
- Layout reuses same 2-column SimpleForm pattern as Timing section

---

### State 3 — Zone annotations (red borders)
![Schedule operation dialog — five zones marked with red border annotations](../images/schedule-dialog/03-zones-annotated.png)

**What this shows:** Red borders mark the 5 section boundaries for documentation purposes. Same as State 1 but with zone markers added.

---

## Screen classification

**Type:** Dialog
**SAP floorplan:** sap.m.Dialog
**Justification ●:** Modal overlay, fixed width (~560px), footer with Cancel + primary action, task is atomic (define a schedule and save or cancel). User cannot interact with the background while this is open.
**Alternative considered:** sap.m.Page — rejected because the content fits within dialog width, the task is interruptive and modal, and no full-page navigation is needed.

---

## Component map

### S1 — Header ●

```
Element: Dialog title
Confidence: ●
Observation: "Schedule operation" — large bold text, leftmost and topmost element
SAP component: sap.m.Dialog property title="Schedule operation"
Web Component: ui5-dialog title-text="Schedule operation"
Framework: BOTH
Token: sapMFontHeader2Size + sapUiBaseText
```

```
Element: Dialog subtitle
Confidence: ●
Observation: "Define when and how often this operation runs automatically." — smaller, muted, below title
SAP component: sap.m.Dialog property subHeader → sap.m.Bar → sap.m.Text
Alternative ?: sap.m.Title level=H6 inside dialog content as first child
Note: sap.m.Dialog.subHeader is a toolbar — if subtitle-only, a VBox with Text in content is cleaner
```

---

### S2 — Timing ●

```
Element: Section label "TIMING"
Confidence: ●
Observation: Uppercase, small, muted — group header, not a form field label
SAP component: sap.m.Label text="TIMING" design=Bold
Token: sapMFontSmallSize + sapUiContentLabelColor + letter-spacing (CSS)
Note: SAP Fiori does not have a native uppercase section label component — sap.m.Label with custom CSS or sap.m.Title level=H6 are the two options
Options:
  A) sap.m.Label design=Bold with CSS text-transform:uppercase
  B) sap.m.Title level=H6 titleStyle=H6
  → Recommend A — Label is semantically correct for a non-navigational group header
```

```
Element: Start date field
Confidence: ●
Observation: Label "Start date" with red * required indicator, input shows "10.07.2026", trailing calendar icon
SAP component: sap.m.DatePicker
Properties: value="10.07.2026", displayFormat="dd.MM.yyyy", required=true, width="100%"
Web Component: ui5-date-picker value="2026-07-10" format-pattern="dd.MM.yyyy" required
Framework: BOTH
Token: sapUiFieldRequiredColor (red *), sapUiFieldBorderColor (input border)
State: enabled, populated
```

```
Element: Start time field
Confidence: ●
Observation: Label "Start time" with red * required indicator, input shows "08:00", trailing clock icon
SAP component: sap.m.TimePicker
Properties: value="08:00", displayFormat="HH:mm", required=true, width="100%"
Web Component: ui5-time-picker value="08:00" format-pattern="HH:mm" required
Framework: BOTH
Token: sapUiFieldRequiredColor, sapUiFieldBorderColor
State: enabled, populated
```

```
Element: Two-column layout for date + time
Confidence: ○
Observation: Fields side by side with equal width
Inferred: sap.ui.layout.form.SimpleForm layout=ResponsiveGridLayout columnsL=2 columnsM=1
Alternative: sap.m.HBox with two items, width="50%" each
→ Recommend SimpleForm for form semantics and built-in responsive collapse to single column on mobile
Token: sapUiMediumMargin between fields
```

```
Element: Horizontal divider below timing
Confidence: ●
Observation: Thin line separating timing section from recurrence section
SAP component: No dedicated divider component — use sap.m.VBox with borderTop CSS using sapUiGroupContentBorderColor
Alternative ?: sap.m.Toolbar height=1px — avoid, semantically incorrect
→ CSS border-top: 1px solid sapUiGroupContentBorderColor on the next VBox
```

---

### S3 — Recurrence ●/○

```
Element: Recurrence checkbox
Confidence: ●
Observation: Checkbox with blue fill (selected), bold label "Recurrence"
SAP component: sap.m.CheckBox
Properties: text="Recurrence", selected=true, select=".onRecurrenceToggle"
Web Component: ui5-checkbox text="Recurrence" checked
Framework: BOTH
Token: sapUiSelected (blue fill), sapMFontMediumSize bold
```

```
Element: Inline muted text after checkbox label
Confidence: ●
Observation: "— repeat this operation on a schedule" — muted, smaller, same line as checkbox
Options:
  A) sap.m.Label text="— repeat this operation on a schedule" in HBox after CheckBox
     Token: sapMFontSmallSize + sapUiContentForegroundTextColor
  B) sap.m.FormattedText htmlText="<span style='color:...'>— repeat…</span>"
  → Recommend A — simpler, no HTML, color handled via CSS token class
```

```
Element: Recurrence type label
Confidence: ●
Observation: "Recurrence type" — secondary label below checkbox, standard weight
SAP component: sap.m.Label text="Recurrence type"
Token: sapMFontSmallSize + sapUiContentLabelColor
```

```
Element: Pill button group — Hourly / Daily / Monthly / Yearly
Confidence: ●
Observation: 4 pill-shaped buttons in a row, "Monthly" has filled background + white text, others outlined
Options:
  A) sap.m.SegmentedButton
     items: sap.m.SegmentedButtonItem key="hourly" text="Hourly" etc.
     selectedKey="monthly"
     → Enforces single-select; use if exactly one type must always be active
  B) sap.m.ToggleButton ×4 in sap.m.HBox
     pressed=true on "Monthly" button
     → Independent toggle state; use if multi-select is possible or deselection allowed
  → Recommend A — standard scheduling behavior requires single active type
Web Component: ui5-segmented-button (BOTH)
Token (active): sapUiButtonEmphasizedBackground + sapUiButtonEmphasizedTextColor
Token (inactive): sapUiButtonLiteBackground + sapUiButtonTextColor
```

```
Element: Conditional expansion (recurrence options)
Confidence: ○
Observation: When CheckBox is unchecked, recurrence type + pattern should hide
Inferred: visible binding on VBox containing recurrence content, bound to CheckBox selected state
Implementation: visible="{/recurrenceEnabled}" — no animation, instant show/hide
Alternative ?: sap.m.Panel expandable=true — avoid, adds visual chrome not visible in reference
```

---

### S4 — Monthly pattern ●/○

```
Element: Monthly pattern container
Confidence: ●
Observation: Bordered box containing two rows, slightly darker background
Options:
  A) sap.m.Panel headerText="" expandable=false — adds border and slight background
  B) sap.m.VBox with CSS border using sapUiGroupContentBorderColor
  → Recommend A — Panel provides semantic grouping and consistent Fiori styling
```

```
Element: Pattern row 1 (active) — Fixed day
Confidence: ●
Observation: RadioButton selected (blue), "Day" label, Select(1), "of every", Select(1), "month(s)"
Layout: sap.m.HBox alignItems=Center
Components:
  — sap.m.RadioButton selected=true groupName="monthlyPattern" text=""
  — sap.m.Label text="Day"
  — sap.m.Select selectedKey="1" width="80px"
      items: 1–31 as sap.ui.core.Item
  — sap.m.Label text="of every"
  — sap.m.Select selectedKey="1" width="80px"
      items: 1–12 as sap.ui.core.Item
  — sap.m.Label text="month(s)"
Framework: BOTH for RadioButton and Select
Token (active): all controls enabled, sapUiFieldBorderColor
```

```
Element: Pattern row 2 (inactive) — Relative day
Confidence: ●/○
Observation ●: RadioButton unselected, "1st" Select, "Monday" Select, "of every", "1" Select, "month(s)" — all dimmed
Inferred ○: enabled=false on all child controls when RadioButton is unselected
Layout: sap.m.HBox alignItems=Center
Components:
  — sap.m.RadioButton selected=false groupName="monthlyPattern" text=""
  — sap.m.Select enabled=false selectedKey="1st" width="80px"
      items: 1st, 2nd, 3rd, Last
  — sap.m.Select enabled=false selectedKey="monday" width="120px"
      items: Monday–Sunday, Weekday, Weekend day
  — sap.m.Label text="of every" enabled=false (use labelFor or CSS opacity)
  — sap.m.Select enabled=false selectedKey="1" width="80px"
  — sap.m.Label text="month(s)"
Token (inactive): sapUiContentDisabledTextColor on labels, enabled=false handles field styling
Note ?: Whether "of every" and "month(s)" static labels also dim — verify in implementation
```

---

### S5 — End date + footer ●

```
Element: End date checkbox
Confidence: ●
Observation: Unchecked checkbox, bold label "End date", muted inline text
SAP component: sap.m.CheckBox
Properties: text="End date", selected=false, select=".onEndDateToggle"
Web Component: ui5-checkbox text="End date"
Framework: BOTH
```

```
Element: End date inline description
Confidence: ●
Observation: "— leave unchecked to run indefinitely"
Same pattern as Recurrence inline text — use sap.m.Label in HBox
Token: sapMFontSmallSize + sapUiContentForegroundTextColor
```

```
Element: End date/time pickers (hidden state)
Confidence: ○
Observation: Not visible in current state (checkbox unchecked)
Inferred: Same layout as S2 — DatePicker + TimePicker in 2-column SimpleForm
Controlled by: visible="{/endDateEnabled}" binding on container VBox
```

```
Element: Footer — Cancel button
Confidence: ●
Observation: "Cancel" — default/outline button, right-aligned
SAP component: sap.m.Button type=Default text="Cancel" press=".onCancel"
Web Component: ui5-button design=Default
Token: sapUiButtonBorderColor, sapUiButtonTextColor
```

```
Element: Footer — Save schedule button
Confidence: ●
Observation: "Save schedule" — filled/emphasized button, dark background, white text
SAP component: sap.m.Button type=Emphasized text="Save schedule" press=".onSave"
Web Component: ui5-button design=Emphasized
Token: sapUiButtonEmphasizedBackground + sapUiButtonEmphasizedTextColor
Note ●: Color matches SAP Horizon Emphasized (dark/black in Horizon Dark theme) — no custom token needed
```

```
Element: Footer layout
Confidence: ○
Observation: Buttons right-aligned at bottom of dialog
Inferred: sap.m.Dialog endButton + beginButton properties, or sap.m.Bar contentRight aggregation
→ Recommend: sap.m.Dialog endButton=SaveButton beginButton=CancelButton
   Fiori convention places Cancel left (begin), primary action right (end)
```

---

## Floorplan and layout tree

```
sap.m.Dialog
  contentWidth="560px"
  title="Schedule operation"
  subHeader → sap.m.Bar → sap.m.Text "Define when and how often…"
  content →
    sap.m.VBox
      ├── S2: sap.m.Label "TIMING"
      ├── S2: sap.ui.layout.form.SimpleForm (2 cols)
      │     ├── sap.m.DatePicker (Start date)
      │     └── sap.m.TimePicker (Start time)
      ├── [divider: border-top sapUiGroupContentBorderColor]
      ├── S3: sap.m.HBox
      │     ├── sap.m.CheckBox (Recurrence)
      │     └── sap.m.Label (muted inline text)
      ├── S3: sap.m.VBox visible="{/recurrenceEnabled}"
      │     ├── sap.m.Label "Recurrence type"
      │     ├── sap.m.SegmentedButton (Hourly/Daily/Monthly/Yearly)
      │     └── S4: sap.m.Panel "Monthly pattern" visible="{/isMonthly}"
      │           ├── sap.m.HBox (Row 1 — fixed day)
      │           └── sap.m.HBox (Row 2 — relative day)
      ├── [divider: border-top sapUiGroupContentBorderColor]
      └── S5: sap.m.HBox
            ├── sap.m.CheckBox (End date)
            └── sap.m.Label (muted inline text)
            sap.m.VBox visible="{/endDateEnabled}"
              └── sap.ui.layout.form.SimpleForm (2 cols)
                    ├── sap.m.DatePicker (End date)
                    └── sap.m.TimePicker (End time)
  beginButton → sap.m.Button "Cancel" type=Default
  endButton   → sap.m.Button "Save schedule" type=Emphasized
```

---

## Open questions

**Q1 ?** Is the subtitle below the title inside `sap.m.Dialog.subHeader` or the first element of `content`? SubHeader renders as a toolbar — if it contains only static text, a Text node inside content VBox is cleaner. Decide before implementation.

**Q2 ?** Recurrence type: `sap.m.SegmentedButton` vs `sap.m.ToggleButton ×4`? Depends on whether multi-select is ever needed. If not → SegmentedButton. Confirm with PM.

**Q3 ?** Inline muted text after checkbox label: `sap.m.Label` in HBox vs `sap.m.FormattedText`? Label is simpler. FormattedText allows bold/italic within the string. Confirm copy requirements.

**Q4 ?** Monthly pattern container: `sap.m.Panel` vs styled `VBox`? Panel adds header area — if "Monthly pattern" label sits above the box (not inside it), VBox with border CSS is cleaner. Verify in Figma.

**Q5 ?** Do the static text labels "of every" and "month(s)" also grey out when Row 2 is inactive? If yes, wrap them in HBox with `enabled` binding. If no, leave as plain Label.

**Q6 ?** "TIMING" uppercase label — CSS text-transform or actual uppercase string in the `text` property? Text-transform is preferred (allows localization without ALL CAPS in translation strings).

---

## Confidence table

| Area | Confidence | Notes |
|------|-----------|-------|
| Screen classification | 99% | Clearly sap.m.Dialog |
| Floorplan selection | 97% | Dialog confirmed; Page rejected with justification |
| Layout reconstruction | 88% | Column layout inferred; spacing estimated as tokens |
| Component mapping | 94% | 2 ambiguous elements (Q2, Q3) |
| Typography tokens | 85% | Sizes estimated; verify in SAP Web UI Kit Figma |
| Color tokens | 92% | Dark theme = Horizon Dark confirmed; token names verified |
| States and variants | 84% | Disabled state inferred (Q5); conditional visibility inferred |
