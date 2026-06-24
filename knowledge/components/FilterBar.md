# FilterBar
<!-- sap.m.FilterBar -->

## Identity
- **UI5 class:** `sap.m.FilterBar`
- **Web Component tag:** `<ui5-filter-bar>`
- **Figma library name:** `"Filter Bar/Cozy/Default"`
- **Category:** action / filtering
- **DemoKit:** https://ui5.sap.com/#/entity/sap.m.FilterBar
- **Design guidelines:** https://www.sap.com/design-system/fiori-design-web/v1-145/ui-elements/header-toolbar#paging-layout
- **Web Components:** https://ui5.github.io/webcomponents/components/FilterBar/

## When to Use
On **List Report** floorplan only. FilterBar is the structured search and filter pattern for large datasets where the user needs to scope results before seeing the list. It lives in the DynamicPageHeader (collapsible area).

## When NOT to Use
- **Worklist** — no FilterBar; use SearchField in the table toolbar instead if needed.
- **Object Page** — filter is not applicable to a single entity's detail view.
- **Small datasets** — if all records fit on screen without filtering, a FilterBar is unnecessary.

## Required parent
`sap.f.DynamicPageHeader` → `sap.f.DynamicPage` (header slot). Never placed in content.

## Required / expected children
| Slot | Type | Notes |
|---|---|---|
| `filterItems` | `sap.m.FilterItem[]` | Each filter field. Each FilterItem has a `control` (Input, Select, DateRangeSelection) |

## Key properties for design decisions
| Property | Values | When to use |
|---|---|---|
| `showGoButton` | `true` / `false` | `true` when search must be explicitly triggered (large datasets). `false` for live search. |
| `filterBarExpanded` | `true` / `false` | Default `true`. Initial expansion state. |
| `useToolbar` | `true` / `false` | Default `true`. Shows the FilterBar toolbar with Go + Adapt Filters buttons. |
| `showAdaptFiltersButton` | `true` / `false` | `true` enables the Adapt Filters dialog for personalisation. |
| `filterCount` | integer | Number of active filters — shown as badge. Set via binding. |

## States
| State | When | Notes |
|---|---|---|
| Expanded | Header expanded | All filter fields visible |
| Collapsed | Header collapsed | Only filter summary shown in title area |

## Figma variants and booleans

### Default state (what the plugin inserts)
```
Component: Filter Bar/Compact/Default   (Compact for back-office — team convention)
showGoButton: true                       (team rule: always true)
filterBarExpanded: true
showAdaptFiltersButton: true
```

### Context-specific combinations
| Context | Variant settings | Notes |
|---|---|---|
| Back-office / desktop | `Filter Bar/Compact/Default` | Default for all our apps |
| Cozy / touch app | `Filter Bar/Cozy/Default` | Only for consumer-facing apps |
| With active filters | `filterCount: N` | Shows badge on Adapt Filters button |
| Collapsed on load | `filterBarExpanded: false` | Start with filter area hidden |

### Never combine
- Never use `Filter Bar/Cozy/Default` for back-office desktop apps — always use Compact variant
- Never set `showGoButton: false` for server-side filtering — backend cannot handle live queries
- Never place FilterBar in Table's `headerToolbar` slot — it belongs in DynamicPageHeader

---

## Example hierarchy position

```json
{
  "id": "page",
  "component": "DynamicPage",
  "slots": {
    "header": {
      "id": "page-header",
      "component": "DynamicPageHeader",
      "children": [
        {
          "id": "filter-bar",
          "component": "FilterBar",
          "props": {
            "showGoButton": true,
            "showAdaptFiltersButton": true
          },
          "slots": {
            "filterItems": [
              {
                "id": "status-filter",
                "component": "FilterItem",
                "props": { "label": "Status" },
                "children": [{ "id": "status-select", "component": "Select" }]
              }
            ]
          }
        }
      ]
    }
  }
}
```

FilterBar lives inside `DynamicPageHeader` → `DynamicPage` `header` slot. **Never in content.**

---

## States to document

| State | When it occurs | Figma variant setting | spec-schema `state` value |
|---|---|---|---|
| Expanded | Default, header visible | `filterBarExpanded: true` | `"default"` |
| Collapsed | Header collapsed / snapped | `filterBarExpanded: false` | `"default"` |
| With active filters | User applied filters | `filterCount: N` (badge shown) | `"default"` |

---


The Figma library component `"Filter Bar/Cozy/Default"` and `"Filter Bar/Compact/Default"` are separate components — pick based on density. Compact is far more common in back-office enterprise screens.

Filter fields inside FilterBar each map to `sap.m.FilterItem`. The control type (Input, Select, DateRangeSelection) is specified per field.

## Team conventions
- Always show `showGoButton: true` — our SAP backend calls are expensive; live filter is not appropriate.
- Maximum 7 filter fields visible by default; additional filters go into the Adapt Filters dialog.
- Mandatory filters (Status, Date Range) always appear in default view.

## Critical rules
- **List Report only** — never add FilterBar to Worklist, Object Page, or any other floorplan.
- **Inside DynamicPageHeader** — not in the content area, not in the toolbar.
- **Go button required for our use cases** — never set `showGoButton: false` for server-side filtering.

## Common mistakes
- Placing FilterBar in the table's `headerToolbar` slot instead of in DynamicPageHeader.
- Using SearchField as a substitute — SearchField is for local client-side search, not server-side filtering.
- Adding FilterBar to a Worklist screen — the distinction between Worklist and List Report is precisely the presence/absence of FilterBar.

## Public sources
- DemoKit: https://ui5.sap.com/#/entity/sap.m.FilterBar
- Web Components: https://ui5.github.io/webcomponents/components/FilterBar/
- Guidelines: https://experience.sap.com/fiori-design-web/v1-145/ui-elements/filter-bar/
