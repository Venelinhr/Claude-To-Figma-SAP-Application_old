# VDI_REFERENCE — compact analysis reference

Single file replacing: confidence-system.md · screen-types.md · component-map.md · tokens.md · image-quality.md · prompt-template.md
Color/token data removed — use SAP_BUILD_MANIFEST.md §4 instead (single source of truth).

---

## Confidence tiers

| Tier | Symbol | When | Example |
|------|--------|------|---------|
| Confirmed | ● | Directly visible, unambiguous | CheckBox checked (blue fill visible) ● |
| Inferred | ○ | Strongly implied by pattern/convention | Row appears dimmed → `enabled=false` ○ |
| Ambiguous | ? | Two valid options, cannot decide from image | SegmentedButton vs ToggleButton × 4 ? |

End every output with a confidence table (Screen classification / Floorplan / Layout / Components / Typography / Color / States). Anything below 80% → add an open question.

---

## Image quality

| Tier | Signal | Default confidence | Action |
|------|--------|--------------------|--------|
| 1 — PNG screenshot | All text sharp, borders visible | ● | Full pipeline |
| 2 — High-res JPEG / Figma export | Minor compression, colors may shift | ● layout, ○ colors | Full pipeline, flag colors |
| 3 — Phone photo / angled | Blur, distortion, glare | All ○, unclear → ? | Add quality notice, proceed anyway |
| 4 — Sketch / whiteboard | No pixel data | ○ structure, ? components | Skip layout+color stages |

Dense zone strategy: if a region is Tier 3 quality in an otherwise Tier 1 image, request a separate zoomed crop for that zone only — don't downgrade the whole screen.

---

## Screen classification

| Screen type | SAP floorplan | Key signals |
|-------------|--------------|-------------|
| Object detail | sap.f.DynamicPage | Header + collapsing + sections + tabs |
| List with filters | List Report | Filter bar + table + toolbar |
| Step-by-step task | sap.m.Wizard | Numbered steps + Next/Back |
| Modal task | sap.m.Dialog | Overlay + fixed width + footer Cancel+primary |
| Dashboard | ALP / OVP | Cards + KPIs |
| Full-page form | sap.m.Page + SimpleForm | No object header, fields + submit |
| Master-detail | sap.f.FCL | Left list + right detail, column split |
| Settings | sap.m.Page + List grouped | Grouped list, right-arrow nav |
| Mobile screen | sap.m.Page | Full-bleed, touch targets ≥44px |

**Filter bar rule:** 1–3 fields → `sap.m.VBox` with Label+Input. 4–8 fields → `sap.ui.comp.filterbar.FilterBar`. 8+ → FilterBar + AdaptFilters.

**Mobile signals:** use ActionSheet not Menu for overflow; Dialog full-screen on S breakpoint; IconTabBar collapses to scrollable.

---

## Visual pattern → SAP component map

### Input controls
| Pattern | SAP component | Key prop |
|---------|---------------|----------|
| Text input | sap.m.Input | type=Text |
| Date picker | sap.m.DatePicker | displayFormat |
| Time picker | sap.m.TimePicker | displayFormat |
| Date+time | sap.m.DateTimePicker | — |
| Dropdown | sap.m.Select | items via sap.ui.core.Item |
| Searchable dropdown | sap.m.ComboBox | — |
| Multi-select dropdown | sap.m.MultiComboBox | — |
| Checkbox | sap.m.CheckBox | selected, text |
| Radio button | sap.m.RadioButton | selected, groupName |
| Toggle switch | sap.m.Switch | state |
| Search field | sap.m.SearchField | placeholder |
| Step input +/- | sap.m.StepInput | min, max, step |
| Text area | sap.m.TextArea | rows, growing |

### Buttons and actions
| Pattern | SAP component | Key prop |
|---------|---------------|----------|
| Primary/emphasized | sap.m.Button | type=Emphasized |
| Default/secondary | sap.m.Button | type=Default |
| Ghost/transparent | sap.m.Button | type=Transparent |
| Destructive | sap.m.Button | type=Negative |
| Icon-only button | sap.m.Button | icon=, type=Transparent, tooltip required |
| Pill/toggle single | sap.m.ToggleButton | pressed=true/false |
| Pill group single-select | sap.m.SegmentedButton | selectedKey |
| Menu button | sap.m.MenuButton | — |
| Link | sap.m.Link | text, press |

### Display / content
| Pattern | SAP component | Key prop |
|---------|---------------|----------|
| Page title | sap.m.Title | level=H1 |
| Body text | sap.m.Text | text, wrapping |
| Field label | sap.m.Label | text, required, labelFor |
| Status text (colored) | sap.m.ObjectStatus | state=Success/Error/Warning/Information |
| Key–value pair | sap.m.ObjectAttribute | title, text |
| Large number/KPI | sap.m.ObjectNumber | number, unit |
| Avatar | sap.m.Avatar | initials, src |
| Empty state | sap.m.IllustratedMessage | illustrationType, title |
| Loading | sap.m.BusyIndicator | size |
| Progress bar | sap.m.ProgressIndicator | percentValue |
| Info strip | sap.m.MessageStrip | type, text |

### Layout containers
| Pattern | SAP component | Key prop |
|---------|---------------|----------|
| Horizontal row | sap.m.HBox | alignItems, justifyContent |
| Vertical stack | sap.m.VBox | alignItems |
| Two-column form | sap.ui.layout.form.SimpleForm | columnsL=2 |
| Page shell | sap.f.DynamicPage | title, header, content |
| Object header | sap.f.DynamicPageTitle + sap.f.DynamicPageHeader | — |
| Toolbar row | sap.m.OverflowToolbar | — |
| Tab navigation | sap.m.IconTabBar | selectedKey, items |
| Tab item | sap.m.IconTabFilter | key, text, count |
| Side nav | sap.m.SideNavigation | — |
| Panel/card | sap.m.Panel | headerText, expandable |
| Master–detail | sap.f.FlexibleColumnLayout | layout, columns |

### Tables and lists
| Pattern | SAP component | Key prop |
|---------|---------------|----------|
| Responsive table | sap.m.Table | columns, items |
| Table column | sap.m.Column | header, width |
| Standard row | sap.m.ColumnListItem | cells |
| Simple list | sap.m.List | mode, items |
| Simple list row | sap.m.StandardListItem | title, description, icon |
| Custom list row | sap.m.CustomListItem | content |
| Tree | sap.m.Tree | items |

### Feedback and overlay
| Pattern | SAP component | Key prop |
|---------|---------------|----------|
| Modal dialog | sap.m.Dialog | title, content, buttons |
| Confirmation | sap.m.MessageBox | type, message |
| Toast | sap.m.MessageToast | message, duration |
| Popover | sap.m.Popover | placement, content |
| Action sheet (mobile) | sap.m.ActionSheet | buttons |

### Ambiguous patterns — always flag as ?
| Pattern | Options | Recommendation |
|---------|---------|----------------|
| Pill group (single-select) | SegmentedButton vs ToggleButton×N | SegmentedButton unless multi-select needed |
| Inline muted text after label | Label in HBox vs FormattedText | Label in HBox (simpler) |
| Section divider | Toolbar separator vs border vs spacing | CSS border unless section needs a title |
| Container for a group | Panel with border vs styled VBox | Panel if expandable or titled |

---

## List item states (stack simultaneously)
| State | Property | Visual |
|-------|----------|--------|
| Selected | `selected=true` | `sapUiListSelectionBackgroundColor` bg |
| Success highlight | `highlight=Success` | Green 3px left border |
| Navigation | `type=Navigation` | Right arrow › auto-rendered |
| Error highlight | `highlight=Error` | Red left border |

`selected=true` + `highlight=Success` = blue bg + green border simultaneously.

---

## Output structure (always this order)

```
# [Screen name]
## Screen classification — type + floorplan + justification
## Component map — region by region, ● ○ ? tiers
## Layout tree — container hierarchy
## Open questions — all ? items as named questions
## Confidence table — one row per area
```

Prompt addition when image attached:
> Classify this SAP Fiori screen region by region. For each element: confidence tier (● ○ ?), SAP component, key properties, token. End with open questions and confidence table. SAP design system only — no invented components or raw values.
