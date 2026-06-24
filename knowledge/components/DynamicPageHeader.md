# DynamicPageHeader
<!-- sap.f.DynamicPageHeader -->

## Identity
- **UI5 class:** `sap.f.DynamicPageHeader`
- **Figma library name:** `"Dynamic Page Header/Default"`
- **Category:** layout / collapsible header
- **DemoKit:** https://ui5.sap.com/#/entity/sap.f.DynamicPageHeader

## When to Use
Use as the `header` slot of DynamicPage on **List Report** screens to house the FilterBar. Also used on Object Page when the header contains KPIs, attribute groups, or an image/avatar.

## When NOT to Use
- **Worklist screens** — Worklist has no FilterBar and therefore no DynamicPageHeader.
- **Simple forms** — use sap.m.Page instead of DynamicPage if you don't need a collapsible header.

## Required parent
`sap.f.DynamicPage` (header slot). Never standalone.

## Required / expected children
On List Report: `sap.m.FilterBar` (the only content in the header).
On Object Page: attribute groups, `sap.m.ObjectStatus`, `sap.m.Avatar`, KPI tiles.

## Key properties for design decisions
| Property | Values | When to use |
|---|---|---|
| `pinnable` | `true` / `false` | `true` allows user to pin the header open permanently |

## Figma variants and booleans

### Default state (what the plugin inserts)
```
Component: Dynamic Page Header/Default
pinnable: true
```

### Context-specific combinations
| Context | Variant / prop settings | Notes |
|---|---|---|
| List Report | Contains FilterBar as child | Standard usage — FilterBar is the only content |
| Object Page header | Contains ObjectStatus, Avatar, KPI tiles | Attribute/KPI area, no FilterBar |
| Non-pinnable | `pinnable: false` | Removes the pin affordance from the header |

### Never combine
- Never add DynamicPageHeader to a Worklist screen — Worklist has no collapsible header
- Never place FilterBar anywhere other than inside DynamicPageHeader

---

## Example hierarchy position

```json
{
  "id": "page",
  "component": "DynamicPage",
  "slots": {
    "title": {
      "id": "page-title",
      "component": "DynamicPageTitle"
    },
    "header": {
      "id": "page-header",
      "component": "DynamicPageHeader",
      "props": { "pinnable": true },
      "children": [
        {
          "id": "filter-bar",
          "component": "FilterBar",
          "props": { "showGoButton": true }
        }
      ]
    },
    "content": {
      "id": "results-table",
      "component": "Table"
    }
  }
}
```

DynamicPageHeader occupies the `header` slot of DynamicPage — **never** in `content`.

---

## States to document

| State | When it occurs | Figma variant setting | spec-schema `state` value |
|---|---|---|---|
| Expanded | Default on page load | Header is visible below title | `"default"` |
| Collapsed | User scrolled or clicked title | Header hidden, only title bar visible | `"default"` (controlled by DynamicPage) |
| Pinned | User clicked pin icon | `pinnable: true` and user pinned it | `"default"` (runtime behaviour) |

---


- **FilterBar goes here** — on List Report, FilterBar is always inside DynamicPageHeader, never in content.
- **Present on List Report, absent on Worklist** — this is the structural difference between the two floorplans.

## Common mistakes
- Including DynamicPageHeader on a Worklist screen — there is nothing to put in it.
- Putting search/filter controls in the content area instead of here.

## Public sources
- DemoKit: https://ui5.sap.com/#/entity/sap.f.DynamicPageHeader
