# States and validation

Use during Stage 5 (component mapping) and Stage 8 (output — validation and error states section).

Every input control in an SAP Fiori screen has states. Document them all — not just the happy path.

---

## SAP field value states

All input controls (sap.m.Input, sap.m.Select, sap.m.DatePicker, sap.m.TimePicker, etc.) support:

| State | Property value | Visual | Token |
|-------|--------------|--------|-------|
| None (default) | valueState=None | Standard border | sapUiFieldBorderColor |
| Error | valueState=Error | Red border + error icon | sapUiFieldInvalidColor + sapUiFieldInvalidBackground |
| Warning | valueState=Warning | Orange border | sapUiFieldWarningColor |
| Success | valueState=Success | Green border | sapUiFieldSuccessColor |
| Information | valueState=Information | Blue border | sapUiFieldInformationColor |

Always add `valueStateText="[message]"` when valueState is not None — this is the tooltip/inline message shown to the user.

---

## Required field pattern

```
sap.m.Label text="Start date" required=true labelFor="startDatePicker"
sap.m.DatePicker id="startDatePicker" required=true
```

- Label `required=true` renders the red asterisk (*) via `sapUiFieldRequiredColor`
- Input `required=true` triggers validation on form submit
- Do NOT rely on color alone — `required=true` also adds ARIA required attribute

---

## Conditional visibility states

Document every show/hide pattern:

```
State: [section name] hidden
Condition: [checkbox/toggle] is unchecked/false
Binding: visible="{/flagName}"
Component affected: [VBox or container wrapping the hidden content]
Animation: none (instant) — SAP default; sap.m.Panel with expandable=true adds animation
```

Common patterns from this session:
- Recurrence section: visible="{/recurrenceEnabled}"
- End date pickers: visible="{/endDateEnabled}"
- Filter bar: visible="{/filtersVisible}"
- Monthly pattern: visible="{/isMonthly}" — nested inside recurrence section

---

## Disabled state pattern

When a control is inactive but visible (e.g. pattern row 2 in monthly selector):

```
sap.m.Select enabled=false → renders at ~40% opacity, not interactive
sap.m.RadioButton enabled=false → greyed out, not selectable
sap.m.Input enabled=false → greyed background, not editable
```

Token: `sapUiContentDisabledTextColor` on text labels adjacent to disabled controls
Note: Static text labels ("of every", "month(s)") adjacent to disabled controls should also appear muted — apply via CSS class or wrap in enabled=false container.

Do NOT use visible=false for disabled rows — the user needs to see the alternative option exists.

---

## Empty state pattern

When a list, table, or section has no data:

```
sap.m.IllustratedMessage
  illustrationType="NoData" / "NoSearchResults" / "UnableToLoad"
  title="No steps found"
  description="Try adjusting your filters."
  additionalContent: sap.m.Button "Clear filters"
```

Always provide:
- A clear title stating what is empty
- A description explaining why (filtered? no data yet? error?)
- An action to resolve (clear filters, create first item, retry)

---

## Loading state pattern

```
sap.m.BusyIndicator size="Large" — full section loading
sap.m.List busyIndicatorDelay=0 busy="{/isLoading}" — inline list loading
sap.m.Table busy="{/isLoading}" — table loading overlay
```

Never show empty state and loading state simultaneously. Loading takes priority.

---

## Error messaging patterns

| Scenario | Component | Placement |
|----------|-----------|-----------|
| Field-level validation | valueState=Error + valueStateText | Below the field |
| Form submit error (single) | sap.m.MessageBox.error() | Modal dialog |
| Form submit errors (multiple) | sap.m.MessagePopover | Toolbar button, opens list |
| Page-level error | sap.m.MessageStrip type=Error | Top of content area |
| Network/system error | sap.m.IllustratedMessage illustrationType="UnableToLoad" | Full section |

---

## List item states

| State | Property | Visual |
|-------|----------|--------|
| Default | — | Standard background |
| Selected | selected=true | sapUiListSelectionBackgroundColor |
| Highlighted success | highlight=Success | Green left border (3px) |
| Highlighted error | highlight=Error | Red left border |
| Highlighted warning | highlight=Warning | Orange left border |
| Navigation | type=Navigation | Right arrow › rendered automatically |
| Pressed/active | — | Handled by framework on press |

From yanatest session: selected=true + highlight=Success = blue background + green left border simultaneously. Both properties stack.

---

## Accessibility — mandatory for every interactive element

| Element | Required ARIA |
|---------|--------------|
| Icon-only button | tooltip + aria-label |
| CheckBox without visible label context | aria-describedby pointing to description |
| Custom list item | role="listitem" (automatic via sap.m.CustomListItem) |
| Required field | required=true on both Label and Input |
| Disabled control | enabled=false (framework adds aria-disabled automatically) |
| Error state | valueStateText (framework adds aria-describedby automatically) |
| Dialog | title property (framework adds aria-labelledby automatically) |

SAP Fiori components handle most ARIA automatically when used correctly.
Manual ARIA is only needed for custom HTML or non-standard patterns.
