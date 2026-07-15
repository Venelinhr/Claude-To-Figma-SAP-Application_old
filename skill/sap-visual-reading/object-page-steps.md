# Object Page — Steps tab (yanatest) — worked example

Screen: yanatest activity object, mobile viewport, Steps tab active.
Image quality: Tier 1 ● — clean PNG, all text legible.

---

## Reference images

### Image 1 — Steps tab, filter bar active, list item selected
![yanatest Object Page — Steps tab with filter active and Validate System selected](../images/object-page/01-steps-tab-filter-active.png)

**What this shows:**
- Zone A: Object header ("yanatest", subtitle, ··· overflow)
- Zone B: Tab bar (General / Steps active with blue underline)
- Zone C: Toolbar ("Steps (1)", "Hide Filters" button, sort + settings icons)
- Zone D: Filter bar expanded (Status dropdown + Operation input + clear/add icons)
- Zone E: Column header "Operation"
- Zone F: List item "Validate System" — green left border (highlight=Success) + blue background (selected=true) + navigation arrow

---

### Image 2 — Validate System log dialog (drill-down target)
![Validate System — log messages dialog with Trace/Debug/Information severity badges](../images/object-page/02-validate-system-log-dialog.png)

**What this shows (drill-down from Zone F):**
- This is the screen that opens when the user presses the "Validate System" list item
- Title: "Validate System" + subtitle "Step | ID 1 | Activity Number 765"
- Filter bar: Message (string input) + Severity (select) + clear/add filter icons
- Toolbar: "Messages (10)" count + "Hide Filters" button + "Plain Text / List" toggle + sort + settings icons
- Message list: Each item has a severity badge (Trace=pink, Debug=purple, Information=blue) + "Message Code: LVM/ValSchedule" + timestamp + message body
- Screen type: This maps to a **second sap.m.Dialog** or **sap.f.FlexibleColumnLayout mid-column** — not a full page
- The "×" close button and fullscreen icon (top right) confirm it is a Dialog/overlay

---

---

## Designer Reasoning Pass

### Zone A — Object header
1. Purpose: Identify the business object and provide top-level navigation/actions
2. Why designed this way: DynamicPage header collapses on scroll to give more vertical space to content — standard Object Page behavior
3. Visual principles: Hierarchy — title largest, subtitle muted; overflow menu deferred to ···
4. SAP pattern: Object Page header — sap.f.DynamicPageTitle
5. Components: sap.m.Title + sap.m.Label + sap.m.Button (overflow)
6. Evidence: Bold large title "yanatest", muted subtitle, ··· top-right

### Zone B — Tab bar
1. Purpose: Switch between General metadata and Steps workflow views
2. Why designed this way: Tabs separate concerns without requiring navigation — both views belong to the same object
3. Visual principles: Active tab blue underline = selected state; inactive = muted
4. SAP pattern: sap.m.IconTabBar — standard Object Page tab navigation
5. Components: sap.m.IconTabFilter ×2, selectedKey="steps"
6. Evidence: Blue underline under "Steps", "General" muted

### Zone C — List toolbar
1. Purpose: Communicate list count, allow filter toggle, sort, and column settings
2. Why designed this way: Toolbar above the list is standard Fiori List Report pattern — filter toggle keeps the UI clean by hiding filters when not needed
3. Visual principles: Count badge gives immediate context; actions right-aligned
4. SAP pattern: sap.m.Toolbar — standard list toolbar
5. Components: sap.m.Title + sap.m.Button (filter toggle) + icon buttons
6. Evidence: "Steps (1)" bold, "Hide Filters" with funnel icon, sort and gear icons

### Zone D — Filter bar
1. Purpose: Allow filtering the Steps list by Status or Operation name
2. Why designed this way: Inline filter (not sidebar) because mobile viewport; 2 fields only → custom VBox is simpler than FilterBar component
3. Visual principles: Vertical stack, labels above fields, filter action icons inline with input
4. SAP pattern: Custom VBox (not sap.ui.comp.filterbar.FilterBar — too heavy for 2 fields)
5. Components: sap.m.Select + sap.m.Input + icon buttons
6. Evidence: "Status" label + dropdown, "Operation" label + text input, filter clear/add icons

### Zone E — Column header
1. Purpose: Label the list column "Operation" — single-column list
2. Why designed this way: Single column means no multi-column table needed; bold label acts as section header
3. SAP pattern: sap.m.Toolbar with sap.m.Label design=Bold
4. Evidence: "Operation" bold, white background, bottom border

### Zone F — List item (selected, success)
1. Purpose: Display a single step — Validate System — with its metadata and navigation
2. Why designed this way: highlight=Success (green border) communicates the step passed; selected=true (blue bg) communicates current selection; type=Navigation (arrow) communicates drill-down is available
3. Visual principles: Two simultaneous state signals (success + selected) via border color + background
4. SAP pattern: sap.m.CustomListItem — standard Object Page list item
5. Components: ObjectStatus + Title + ObjectAttribute ×4
6. Evidence: Green left border, blue background, green checkmark, "Validate System" title, › arrow, ID/Next/Previous/Hook meta rows

---

## Screen classification

**Type:** Object Page — mobile viewport
**Floorplan:** sap.f.DynamicPage + sap.m.IconTabBar

| Candidate | Business fit | Interaction fit | SAP compliance | Total |
|-----------|-------------|----------------|----------------|-------|
| sap.f.DynamicPage | 10 | 10 | 10 | 30 |
| sap.m.Page | 7 | 8 | 8 | 23 |

Chosen: sap.f.DynamicPage (30/30) — header with identity fields, tab navigation, expandable content sections all match Object Page pattern.

---

## Zone overview

| Zone | Label | Content | Key SAP component |
|------|-------|---------|------------------|
| A | Object header | Title "yanatest", subtitle, overflow | sap.f.DynamicPageTitle |
| B | Tab bar | General / Steps (active) | sap.m.IconTabBar |
| C | List toolbar | Count, filter toggle, sort, settings | sap.m.Toolbar |
| D | Filter bar | Status select + Operation input | sap.m.VBox (conditional) |
| E | Column header | "Operation" label | sap.m.Toolbar |
| F | List item | Validate System — selected + success | sap.m.CustomListItem |

---

## Component map — zone by zone

### Zone A ●
- sap.f.DynamicPageTitle heading=sap.m.Title "yanatest" level=H1
- sap.f.DynamicPageTitle snappedContent=sap.m.Label "Activity | Activity Number 765"
- sap.m.Button icon=sap-icon://overflow type=Transparent → sap.m.ActionSheet (mobile)
- Token: sapMFontHeader2Size + sapUiBaseText (title), sapMFontSmallSize + sapUiContentLabelColor (subtitle)

### Zone B ●
- sap.m.IconTabBar selectedKey="steps"
  - sap.m.IconTabFilter key="general" text="General"
  - sap.m.IconTabFilter key="steps" text="Steps" count="1"
- Token: sapUiSelected (blue underline active tab), sapUiContentLabelColor (inactive)

### Zone C ●
- sap.m.Toolbar
  - sap.m.Title text="Steps (1)" level=H3
  - sap.m.Button icon=sap-icon://filter text="Hide Filters" type=Transparent press=".onToggleFilters"
  - sap.m.ToolbarSpacer
  - sap.m.Button icon=sap-icon://sort type=Transparent tooltip="Sort"
  - sap.m.Button icon=sap-icon://action-settings type=Transparent tooltip="Settings"

### Zone D ○
- sap.m.VBox visible="{/filtersVisible}"
  - sap.m.Label "Status"
  - sap.m.Select forceSelection=false width="100%"
    - sap.ui.core.Item key="" text="Select Value"
  - sap.m.Label "Operation"
  - sap.m.HBox
    - sap.m.Input placeholder="String" width="auto"
    - sap.m.Button icon=sap-icon://clear-filter type=Transparent tooltip="Clear filter"
    - sap.m.Button icon=sap-icon://filter type=Transparent tooltip="Add filter"

### Zone E ●
- sap.m.Toolbar
  - sap.m.Label text="Operation" design=Bold
- Token: sapUiTableColumnHeaderBackground + sapMFontSmallSize Bold

### Zone F ●/○
- sap.m.CustomListItem type=Navigation highlight=Success selected=true press=".onStepPress"
  - sap.m.VBox
    - sap.m.HBox alignItems=Center justifyContent=SpaceBetween
      - sap.m.HBox alignItems=Center gap=8px
        - sap.m.ObjectStatus state=Success icon=sap-icon://sys-enter-2
        - sap.m.Title text="Validate System" level=H5
      - [navigation arrow — rendered automatically by type=Navigation]
    - sap.m.VBox paddingLeft=26px
      - sap.m.ObjectAttribute title="ID" text="1"
      - sap.m.ObjectAttribute title="Next" text=""
      - sap.m.ObjectAttribute title="Previous" text=""
      - sap.m.ObjectAttribute title="Hook for ID" text=""

---

## Full component architecture tree

```
sap.f.DynamicPage
├── title: sap.f.DynamicPageTitle
│     ├── heading: sap.m.Title "yanatest"
│     ├── snappedContent: sap.m.Label "Activity | Activity Number 765"
│     └── actions: sap.m.Button (overflow ···) → sap.m.ActionSheet
│
└── content: sap.f.DynamicPageContent
      └── sap.m.IconTabBar selectedKey="steps"
            ├── sap.m.IconTabFilter key="general" [content: General tab — not visible]
            └── sap.m.IconTabFilter key="steps" count="1"
                  content: sap.m.VBox
                    ├── Zone C: sap.m.Toolbar
                    │     ├── sap.m.Title "Steps (1)"
                    │     ├── sap.m.Button "Hide Filters"
                    │     ├── sap.m.ToolbarSpacer
                    │     ├── sap.m.Button (sort)
                    │     └── sap.m.Button (settings)
                    ├── Zone D: sap.m.VBox visible="{/filtersVisible}"
                    │     ├── sap.m.Label "Status"
                    │     ├── sap.m.Select
                    │     ├── sap.m.Label "Operation"
                    │     └── sap.m.HBox
                    │           ├── sap.m.Input
                    │           ├── sap.m.Button (clear)
                    │           └── sap.m.Button (add)
                    ├── Zone E: sap.m.Toolbar → sap.m.Label "Operation"
                    └── sap.m.List mode=SingleSelectMaster
                          └── Zone F: sap.m.CustomListItem
                                type=Navigation highlight=Success selected=true
                                └── sap.m.VBox
                                      ├── sap.m.HBox
                                      │     ├── sap.m.ObjectStatus state=Success
                                      │     └── sap.m.Title "Validate System"
                                      └── sap.m.VBox [meta]
                                            ├── sap.m.ObjectAttribute "ID: 1"
                                            ├── sap.m.ObjectAttribute "Next:"
                                            ├── sap.m.ObjectAttribute "Previous:"
                                            └── sap.m.ObjectAttribute "Hook for ID:"
```

---

## Token mapping

| Element | Token |
|---------|-------|
| Title "yanatest" | sapMFontHeader2Size + sapUiBaseText bold |
| Subtitle | sapMFontSmallSize + sapUiContentLabelColor |
| Active tab underline | sapUiSelected |
| Inactive tab | sapUiContentLabelColor |
| Filter button | sapUiButtonTextColor (blue) |
| Status select border | sapUiFieldBorderColor |
| Input placeholder | sapUiContentForegroundTextColor italic |
| Column header label | sapMFontSmallSize bold + sapUiContentLabelColor |
| List item bg (selected) | sapUiListSelectionBackgroundColor |
| List item left border | sapUiSuccessBorderColor (via highlight=Success) |
| Success icon | sapUiPositiveText |
| Item title | sapMFontMediumSize 500 + sapUiBaseText |
| Meta labels | sapMFontSmallSize + sapUiContentLabelColor |

---

## Interaction model

| Trigger | Element | Target | Binding |
|---------|---------|--------|---------|
| Press "Hide Filters" | Zone C button | Zone D VBox | visible="{/filtersVisible}" toggles false |
| Press "Show Filters" | Same button (text toggles) | Zone D VBox | visible="{/filtersVisible}" toggles true |
| Change Status select | Zone D sap.m.Select | List filtered results | filter applied to list binding |
| Type in Operation | Zone D sap.m.Input | List filtered results | liveChange or search event → filter |
| Press clear filter icon | Zone D clear button | Operation input | value="" |
| Press list item | Zone F CustomListItem | Navigate to Step detail | .onStepPress → routing |
| Press ··· | Zone A overflow button | sap.m.ActionSheet | opens bottom sheet |

---

## Validation and error states

| Element | State | Component property | Token |
|---------|-------|-------------------|-------|
| Status select (no value) | None (optional) | valueState=None | sapUiFieldBorderColor |
| Operation input (no match) | None (not required) | valueState=None | sapUiFieldBorderColor |
| List — no results after filter | Empty state | sap.m.IllustratedMessage | illustrationType=NoSearchResults |
| List — loading | Busy | sap.m.List busy=true | sap.m.BusyIndicator |

---

## Open questions

| # | Question | Root cause | Resolution |
|---|----------|-----------|-----------|
| Q1 | Green left border — highlight=Success or custom CSS? | Both produce same visual | Confirm with dev — highlight=Success is correct SAP property |
| Q2 | Filter bar — VBox or sap.ui.comp.filterbar.FilterBar? | FilterBar adds Go/Clear/Adapt | Use VBox for ≤3 fields; FilterBar for 4+ |
| Q3 | "···" overflow — sap.m.Menu or sap.m.ActionSheet? | Mobile favors ActionSheet | Confirm target device |
| Q4 | Count "(1)" in tab — count property or text append? | Both work visually | Use count="1" — semantically correct |
| Q5 | Operation filter — liveChange or search button? | Performance vs UX tradeoff | Confirm with IxD and backend team |
| Q6 | Empty meta fields — show or hide? | UX decision, not visible | Confirm with PM |

---

## RCA block

```
RCA: Green left border implementation (Q1)
What is uncertain: highlight=Success vs custom CSS class
Why: Both produce identical visual output; cannot distinguish from image
Affects other screens: yes — any list item with status indication
Resolution:
  Immediate: use highlight=Success (SAP-native, no CSS needed)
  Rule update: add to component-map.md "List item states" — highlight= is always preferred over CSS
```

```
RCA: Filter bar component choice (Q2)
What is uncertain: Custom VBox vs sap.ui.comp.filterbar.FilterBar
Why: FilterBar is heavier but provides built-in Go/Clear/Adapt — worth it above 3 fields
Affects other screens: yes — all List Report filter areas
Resolution:
  Immediate: use VBox (2 fields visible — below threshold)
  Rule update: add decision rule to screen-types.md — VBox ≤3 fields, FilterBar 4+
```

---

## Confidence table

| Area | Confidence | Notes |
|------|-----------|-------|
| Screen classification | 98% | Object Page mobile — confirmed |
| Floorplan selection | 95% | DynamicPage + IconTabBar confirmed |
| Layout reconstruction | 90% | Single-column mobile layout confirmed |
| Component mapping | 89% | Filter bar implementation ambiguous (Q2) |
| Typography tokens | 86% | Sizes estimated from visual proportions |
| Color tokens | 92% | Blue ≈ sapUiButtonTextColor; green = sapUiSuccessColor |
| States and variants | 88% | highlight+selected confirmed; filter trigger inferred |
| Interaction model | 80% | Filter trigger and navigation inferred, not confirmed |
