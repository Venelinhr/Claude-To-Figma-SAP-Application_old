# DynamicPage
<!-- sap.f.DynamicPage -->

## Identity
- **UI5 class:** `sap.f.DynamicPage`
- **Figma library name:** `"Dynamic Page/Default"`
- **Category:** layout / page container
- **DemoKit:** https://ui5.sap.com/#/entity/sap.f.DynamicPage
- **Design guidelines:** https://experience.sap.com/fiori-design-web/v1-145/ui-elements/dynamic-page-layout/
- **Internal wiki:** https://wiki.one.int.sap/wiki/spaces/visualcore/pages/2697896790/DynamicPage+Horizon

## When to Use
DynamicPage is the primary page container for List Report, Worklist, and Object Page floorplans. It provides the collapsible header pattern where the DynamicPageHeader (containing FilterBar or KPIs) collapses as the user scrolls, keeping the DynamicPageTitle always visible.

## When NOT to Use
- For wizard flows — use `sap.m.Wizard` instead.
- For simple forms without a collapsible header — `sap.m.Page` is sufficient.
- For Overview Page floorplan — use `sap.f.GridContainer`.

## Required parent
None — DynamicPage is the root page container. In the JSON spec it sits directly in `hierarchy[]` alongside ShellBar.

## Required / expected children (named slots)
| Slot | Type | Required | Notes |
|---|---|---|---|
| `title` | `sap.f.DynamicPageTitle` | **Yes** | Always present — sticky title bar |
| `header` | `sap.f.DynamicPageHeader` | No | Present on List Report; omit on Worklist |
| `content` | any control | **Yes** | The main content — usually a Table |
| `footer` | `sap.m.OverflowToolbar` | No | Sticky footer for draft save actions |

## Key properties for design decisions
| Property | Values | When to use |
|---|---|---|
| `headerExpanded` | `true` / `false` | Default `true`. Set `false` to start with collapsed header. |
| `toggleHeaderOnTitleClick` | `true` / `false` | Default `true` — user can tap title to expand/collapse header |
| `preserveHeaderStateOnScroll` | `true` / `false` | `true` pins the header open; `false` allows collapse on scroll |
| `showFooter` | `true` / `false` | `true` when draft save pattern is needed |
| `fitContent` | `true` / `false` | `true` for tables that should fill remaining height |

## States
| State | When | Notes |
|---|---|---|
| Header expanded | Default / initial load | Full header visible |
| Header collapsed | After scrolling down | Only title area visible |
| With footer | Draft save screens | Footer pinned at bottom |

## Figma variants and booleans

### Default state (what the plugin inserts)
```
Component: Dynamic Page/Default
headerExpanded: true
fitContent: false
showFooter: false
```

### Context-specific combinations
| Context | Variant / prop settings | Notes |
|---|---|---|
| Worklist | No `header` slot, `fitContent: true` | No FilterBar, Table fills height |
| List Report | `header` slot with DynamicPageHeader, `fitContent: true` | FilterBar in header |
| Draft-save screen | `showFooter: true` | Footer with Save/Discard buttons |
| Read-only display | `fitContent: false` | No table, content is a form |

### Never combine
- Never add a `header` slot on a Worklist screen — Worklist has no collapsible header
- Never set `fitContent: false` when content is a Table — table will appear truncated

---

## Example hierarchy position

```json
{
  "id": "page",
  "component": "DynamicPage",
  "props": {
    "fitContent": true
  },
  "slots": {
    "title": {
      "id": "page-title",
      "component": "DynamicPageTitle",
      "label": "Purchase Orders"
    },
    "header": {
      "id": "page-header",
      "component": "DynamicPageHeader",
      "children": [
        { "id": "filter-bar", "component": "FilterBar" }
      ]
    },
    "content": {
      "id": "main-table",
      "component": "Table",
      "props": { "mode": "MultiSelect" }
    }
  }
}
```

---

## States to document

| State | When it occurs | Figma variant setting | spec-schema `state` value |
|---|---|---|---|
| Header expanded | Page load, default | `headerExpanded: true` | `"default"` |
| Header collapsed | User scrolled down | `headerExpanded: false` | `"default"` (prop, not state) |
| Footer visible | Edit / draft-save mode | `showFooter: true` | `"default"` |
| Loading | Data fetch in progress | Set `busy: true` on the content Table | `"loading"` on Table node |

---


In Horizon, DynamicPageTitle has a subtle shadow when the header is collapsed — this is automatic in the library component. Do not manually add drop shadows to the title area.

The `fitContent` property is critical for tables — without it, the table does not fill the remaining viewport height and you get a short table with whitespace below.

## Team conventions
- Always include `DynamicPageTitle` even when there is no header — the title is required.
- For Worklist screens: no `DynamicPageHeader` slot (no FilterBar needed).
- For List Report screens: always include `DynamicPageHeader` with `FilterBar` inside it.

## Critical rules
- **Slots not children** — DynamicPage uses named aggregations (title, header, content, footer), not generic children. In the JSON spec, use `slots` not `children`.
- **DynamicPageTitle is mandatory** — the page renders incorrectly without it.
- **One DynamicPage per frame** — never nest DynamicPage inside DynamicPage.

## Common mistakes
- Putting FilterBar in the `content` slot instead of inside `DynamicPageHeader` in the `header` slot.
- Forgetting `fitContent: true` when the content is a Table — table appears truncated.
- Using `sap.m.Page` as a substitute — it lacks the collapsible header and sticky title behavior.

## Public sources
- DemoKit: https://ui5.sap.com/#/entity/sap.f.DynamicPage
- Guidelines: https://experience.sap.com/fiori-design-web/v1-145/ui-elements/dynamic-page-layout/
