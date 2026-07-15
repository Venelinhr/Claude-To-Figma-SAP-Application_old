# Visual pattern → SAP component map

Use during Stage 5 — Component Mapping.

For every visual pattern observed in an image or described in a requirement, look up the correct SAP component here. Never invent component names.

Framework availability key:
- **U5** = SAPUI5 only (sap.m.*, sap.ui.layout.*, sap.f.*)
- **WC** = SAP Web Components only (ui5-*)
- **BOTH** = available in both frameworks

---

## Input controls

| Visual pattern | SAP component | Variant / property | Framework |
|---------------|---------------|--------------------|-----------|
| Text input, single line | sap.m.Input | type=Text | BOTH (ui5-input) |
| Text input with calendar icon | sap.m.DatePicker | displayFormat, valueFormat | BOTH (ui5-date-picker) |
| Text input with clock icon | sap.m.TimePicker | displayFormat | BOTH (ui5-time-picker) |
| Date + time combined | sap.m.DateTimePicker | — | BOTH (ui5-datetime-picker) |
| Dropdown with chevron | sap.m.Select | items via sap.ui.core.Item | BOTH (ui5-select) |
| Dropdown searchable | sap.m.ComboBox | — | BOTH (ui5-combobox) |
| Dropdown multi-select | sap.m.MultiComboBox | — | BOTH (ui5-multi-combobox) |
| Checkbox | sap.m.CheckBox | selected, text | BOTH (ui5-checkbox) |
| Radio button | sap.m.RadioButton | selected, groupName | BOTH (ui5-radio-button) |
| Radio button group | sap.m.RadioButtonGroup | buttons aggregation | U5 only |
| Toggle switch | sap.m.Switch | state, customTextOn/Off | BOTH (ui5-switch) |
| Slider | sap.m.Slider | min, max, value | BOTH (ui5-slider) |
| Range slider | sap.m.RangeSlider | — | BOTH (ui5-range-slider) |
| Text area | sap.m.TextArea | rows, growing | BOTH (ui5-textarea) |
| Search field | sap.m.SearchField | placeholder, search event | BOTH (ui5-input type=Search) |
| File upload button | sap.ui.unified.FileUploader | — | U5 only |
| Step input (number +/-) | sap.m.StepInput | min, max, step | BOTH (ui5-step-input) |

---

## Buttons and actions

| Visual pattern | SAP component | Variant / property | Framework |
|---------------|---------------|--------------------|-----------|
| Primary/emphasized button | sap.m.Button | type=Emphasized | BOTH (ui5-button design=Emphasized) |
| Default/secondary button | sap.m.Button | type=Default | BOTH (ui5-button design=Default) |
| Ghost/transparent button | sap.m.Button | type=Transparent | BOTH (ui5-button design=Transparent) |
| Destructive/negative button | sap.m.Button | type=Negative | BOTH (ui5-button design=Negative) |
| Icon-only button | sap.m.Button | icon=, type=Transparent, tooltip required | BOTH |
| Pill/toggle button (single) | sap.m.ToggleButton | pressed=true/false | BOTH (ui5-toggle-button) |
| Pill group, single select | sap.m.SegmentedButton | selectedKey, items | BOTH (ui5-segmented-button) |
| Split button | sap.m.SplitButton | — | U5 only |
| Menu button | sap.m.MenuButton | — | U5 only |
| Link text | sap.m.Link | text, href, press event | BOTH (ui5-link) |

---

## Display / content

| Visual pattern | SAP component | Variant / property | Framework |
|---------------|---------------|--------------------|-----------|
| Large bold title | sap.m.Title | level=H1–H6, titleStyle | BOTH (ui5-title) |
| Body text | sap.m.Text | text, wrapping | BOTH (ui5-text) |
| Field label | sap.m.Label | text, required, labelFor | BOTH (ui5-label) |
| Muted / secondary text | sap.m.Text + CSS token | sapUiContentForegroundTextColor | BOTH |
| Status text (colored) | sap.m.ObjectStatus | text, state (Success/Error/Warning/Information) | BOTH (ui5-object-status) |
| Badge / tag (neutral) | sap.m.Tag (deprecated) → use sap.m.ObjectMarker or custom | — | ? verify in UI Kit |
| Avatar / user icon | sap.m.Avatar | initials, src, shape | BOTH (ui5-avatar) |
| Icon | sap.ui.core.Icon | src="sap-icon://[name]" | BOTH (ui5-icon) |
| Numeric KPI large | sap.m.ObjectNumber | number, unit, emphasized | U5 |
| Illustrated empty state | sap.m.IllustratedMessage | illustrationType, title, description | BOTH (ui5-illustrated-message) |
| Loading indicator | sap.m.BusyIndicator | size | BOTH (ui5-busy-indicator) |

---

## Layout containers

| Visual pattern | SAP component | Key properties | Framework |
|---------------|---------------|----------------|-----------|
| Horizontal row of elements | sap.m.HBox | alignItems, justifyContent | U5 |
| Vertical stack of elements | sap.m.VBox | alignItems | U5 |
| Two-column form | sap.ui.layout.form.SimpleForm | editable, layout=ResponsiveGridLayout, columnsL=2 | U5 |
| Responsive form | sap.ui.layout.form.Form + ResponsiveGridLayout | — | U5 |
| CSS grid | sap.ui.layout.cssgrid.CSSGrid | gridTemplateColumns | U5 |
| Card | sap.f.Card | header aggregation | BOTH (ui5-card) |
| Panel with header | sap.m.Panel | headerText, expandable | BOTH (ui5-panel) |
| Dialog overlay | sap.m.Dialog | title, contentWidth, beginButton, endButton | BOTH (ui5-dialog) |
| Toolbar | sap.m.Toolbar | content aggregation | BOTH (ui5-toolbar) |
| Page with header/footer | sap.m.Page | title, showHeader, footer=Bar | U5 |
| Dynamic page (collapsing header) | sap.f.DynamicPage | title, header, content | U5 |

---

## Navigation and structure

| Visual pattern | SAP component | Key properties | Framework |
|---------------|---------------|----------------|-----------|
| Horizontal tabs | sap.m.IconTabBar | items=IconTabFilter | BOTH (ui5-tabcontainer) |
| Breadcrumb | sap.m.Breadcrumbs | links aggregation | BOTH (ui5-breadcrumbs) |
| Side navigation | sap.f.SideNavigation | item aggregation | BOTH (ui5-side-navigation) |
| Shell bar (top) | sap.f.ShellBar | title, profile, logo | BOTH (ui5-shellbar) |
| Wizard steps | sap.m.Wizard + sap.m.WizardStep | — | BOTH (ui5-wizard) |
| Footer bar | sap.m.Bar | contentLeft, contentMiddle, contentRight | U5 |

---

## Tables and lists

| Visual pattern | SAP component | Key properties | Framework |
|---------------|---------------|----------------|-----------|
| Standard table | sap.m.Table | columns, items=ColumnListItem | BOTH (ui5-table) |
| Responsive table | sap.m.Table + sap.m.Column demandPopin=true | — | U5 |
| Grid table (many columns) | sap.ui.table.Table | — | U5 only |
| Analytical table | sap.ui.table.AnalyticalTable | — | U5 only |
| Simple list | sap.m.List | items=StandardListItem / CustomListItem | BOTH |
| List with detail arrow | sap.m.StandardListItem | type=Navigation | BOTH |
| Grouped list | sap.m.GroupHeaderListItem | — | U5 |

---

## Feedback and messaging

| Visual pattern | SAP component | Key properties | Framework |
|---------------|---------------|----------------|-----------|
| Toast / snackbar | sap.m.MessageToast | text, duration | U5 |
| Inline error on field | sap.m.Input valueState=Error | valueStateText | BOTH |
| Message strip (banner) | sap.m.MessageStrip | text, type (Error/Warning/Success/Information) | BOTH (ui5-message-strip) |
| Message popover | sap.m.MessagePopover | — | U5 |
| Confirmation dialog | sap.m.MessageBox | MessageBox.confirm() | U5 |

---

## Notes on ambiguous patterns

### Pill buttons — SegmentedButton vs ToggleButton
Present as options whenever you see a horizontal group of pill-style buttons:

- **sap.m.SegmentedButton** — enforces single selection; selectedKey property; use when exactly one option must always be active
- **sap.m.ToggleButton ×N in HBox** — each button has independent pressed state; use when multi-select is possible or buttons can all be deselected

### Colored tags / badges
SAP Fiori does not have a generic colored pill badge component equivalent to Material Chip. Closest options:
- **sap.m.ObjectStatus** with state=Success/Warning/Error/Information — semantic color only
- **sap.m.Token** — used inside MultiInput, not standalone
- Custom styled span with Horizon token background — flag as non-standard and require UI Kit verification

### Inline muted text after a label
Two valid approaches:
- **sap.m.Label** in an HBox alongside the main label — simpler, no HTML
- **sap.m.FormattedText** — allows mixed styling in one element; heavier

Always present both and let the designer decide.

---

## Avoid when — top 10 misuse patterns

| Component | Looks right when | Actually wrong because | Use instead |
|-----------|-----------------|----------------------|-------------|
| sap.m.Select | Only 2 options | Overkill; dropdown hides choice | sap.m.SegmentedButton or sap.m.Switch |
| sap.m.Panel | Any grouping | Adds visual chrome unless expand is needed | sap.m.VBox with margin |
| sap.m.Token | Standalone colored tag | Belongs inside MultiInput only | sap.m.ObjectStatus |
| sap.m.List | Many columns of data | List is single-column | sap.m.Table |
| sap.m.ToggleButton | Single-select group | Independent toggle per button | sap.m.SegmentedButton |
| sap.m.Dialog | Content > 560px or complex | Too cramped, needs scroll | sap.m.Page (full screen) |
| sap.m.Menu | Mobile overflow action | Bottom sheet is native mobile | sap.m.ActionSheet |
| Custom CSS | Disabled appearance | enabled=false handles it | enabled=false on component |
| visible=false | Inactive (but visible) row | Hides the option entirely | enabled=false on child controls |
| sap.ui.comp.filterbar.FilterBar | 1–3 filter fields | Too heavy; adds unnecessary chrome | Custom sap.m.VBox |

---

## List item states — confirmed from session

| State combination | Properties | Visual result |
|------------------|-----------|--------------|
| Selected only | selected=true | sapUiListSelectionBackgroundColor bg |
| Success only | highlight=Success | Green 3px left border |
| Selected + Success | selected=true + highlight=Success | Blue bg + green left border (stack) |
| Navigation | type=Navigation | Right arrow › rendered automatically |
| Error | highlight=Error | Red left border |
| Warning | highlight=Warning | Orange left border |

Note: selected=true and highlight=X stack — both render simultaneously on sap.m.CustomListItem.
