# FlexibleColumnLayout
<!-- sap.f.FlexibleColumnLayout -->

## Identity
- **UI5 class:** `sap.f.FlexibleColumnLayout`
- **Figma library name:** `"Flexible Column Layout/Two Columns/Begin Expanded"`
- **Category:** layout / multi-column
- **DemoKit:** https://ui5.sap.com/#/entity/sap.f.FlexibleColumnLayout
- **Design guidelines:** https://experience.sap.com/fiori-design-web/v1-145/ui-elements/flexible-column-layout/

## When to Use
Use for **Master-Detail** floorplan. FlexibleColumnLayout provides the responsive 1–3 column layout where a list (master) and detail view (object page) are shown side-by-side. It replaces the old Split App pattern.

## When NOT to Use
- **List Report** — use DynamicPage instead.
- **Object Page standalone** — if there is no master list alongside it, use DynamicPage directly.
- **Mobile-only screens** — FCL is primarily a desktop/tablet pattern.

## Required parent
None — FCL is the root layout container. It replaces DynamicPage when the floorplan is Master-Detail.

## Layout modes (LayoutType enum)
| Mode | Columns visible | When |
|---|---|---|
| `OneColumn` | List only | Mobile, or no item selected |
| `TwoColumnsBeginExpanded` | List (wide) + Detail (narrow) | Default two-column |
| `TwoColumnsMidExpanded` | List (narrow) + Detail (wide) | Item requires more space |
| `ThreeColumnsMidExpanded` | List + Detail + Sub-detail | Three-level drill-down |
| `MidColumnFullScreen` | Detail only (fullscreen) | Focus mode |
| `EndColumnFullScreen` | Sub-detail only | Deep focus |

## Key properties for design decisions
| Property | Values | When to use |
|---|---|---|
| `layout` | `LayoutType` enum | Controls current column distribution |
| `defaultTransitionNameBeginColumn` | `"slide"` / `"fade"` / `"show"` | Transition animation. `"slide"` is standard. |
| `restoreFocusOnBackNavigation` | `true` / `false` | Always `true` for accessibility |

## Named slots
| Slot | Content |
|---|---|
| `beginColumnPages` | List/worklist page (the master) |
| `midColumnPages` | Object page (the detail) |
| `endColumnPages` | Sub-detail (third level, rarely needed) |

## Figma variants and booleans

### Default state (what the plugin inserts)
```
Component: Flexible Column Layout/Two Columns/Begin Expanded
layout: TwoColumnsBeginExpanded
restoreFocusOnBackNavigation: true
```

### Context-specific combinations
| Context | Variant / layout setting | Notes |
|---|---|---|
| Initial load, no item selected | `OneColumn` | Only the master list visible |
| Item selected (standard) | `TwoColumnsBeginExpanded` | List (wide) + Detail (narrow) — default |
| Detail needs more space | `TwoColumnsMidExpanded` | List (narrow) + Detail (wide) |
| Three-level drill-down | `ThreeColumnsMidExpanded` | Master + Detail + Sub-detail |
| Full-screen detail (focus mode) | `MidColumnFullScreen` | Only detail visible |

### Never combine
- Never simulate with HBox/VBox — FCL is the only correct Master-Detail container
- Never place individual components directly in column slots — each slot must hold a full Page or DynamicPage

---

## Example hierarchy position

```json
{
  "id": "app-layout",
  "component": "FlexibleColumnLayout",
  "props": {
    "layout": "TwoColumnsBeginExpanded",
    "restoreFocusOnBackNavigation": true
  },
  "slots": {
    "beginColumnPages": {
      "id": "master-page",
      "component": "DynamicPage",
      "slots": {
        "title": { "id": "master-title", "component": "DynamicPageTitle", "label": "Purchase Orders" },
        "content": { "id": "master-table", "component": "Table", "props": { "mode": "SingleSelectLeft" } }
      }
    },
    "midColumnPages": {
      "id": "detail-page",
      "component": "ObjectPageLayout",
      "props": { "isChildPage": true }
    }
  }
}
```

FlexibleColumnLayout sits at the root — it is the **second item** in `hierarchy[]` after ShellBar, replacing DynamicPage for Master-Detail screens.

---

## States to document

| State | When it occurs | Figma variant / layout | spec-schema `state` value |
|---|---|---|---|
| One column | Mobile or no item selected | `layout: OneColumn` | `"default"` |
| Two columns (begin wide) | Item selected, standard | `layout: TwoColumnsBeginExpanded` | `"default"` |
| Two columns (mid wide) | Detail needs more space | `layout: TwoColumnsMidExpanded` | `"default"` |
| Full screen detail | Focus mode | `layout: MidColumnFullScreen` | `"default"` |

---


- **FCL is the only correct container for Master-Detail** — never simulate with HBox/VBox.
- **Each column contains a full page** — DynamicPage or sap.m.Page inside each column slot.
- **Layout is controlled programmatically** — the `layout` property changes as user navigates.

## Common mistakes
- Using FCL for a List Report with a side panel — if the side panel is a detail view, use FCL. If it is a filter panel, use DynamicPage with DynamicPageHeader.
- Putting multiple pages in `beginColumnPages` — each slot holds one page (or a NavContainer for navigation within that column).

## Public sources
- DemoKit: https://ui5.sap.com/#/entity/sap.f.FlexibleColumnLayout
- Guidelines: https://experience.sap.com/fiori-design-web/v1-145/ui-elements/flexible-column-layout/
