# ObjectPageLayout
<!-- sap.uxap.ObjectPageLayout -->

## Identity
- **UI5 class:** `sap.uxap.ObjectPageLayout`
- **Figma library name:** `"Object Page/Default"`
- **Category:** layout / object detail page
- **DemoKit:** https://ui5.sap.com/#/entity/sap.uxap.ObjectPageLayout
- **Design guidelines:** https://experience.sap.com/fiori-design-web/v1-145/ui-elements/object-page/

## When to Use
Use for the **Object Page floorplan** — the detail view of a single business object (a purchase order, an employee record, a product). ObjectPageLayout provides the sticky header with object identity info, and scrollable section/subsection content below.

## When NOT to Use
- **List/Worklist** — those use DynamicPage.
- **Simple forms** — if there is only one section with no navigation, use DynamicPage instead.
- **Search result detail** — only use if the object is a first-class business entity.

## Required parent
None — ObjectPageLayout is the root container for the Object Page floorplan. It typically lives as the mid/detail column in FlexibleColumnLayout, or as a standalone DynamicPage replacement.

## Required / expected children (named slots)
| Slot | Type | Required | Notes |
|---|---|---|---|
| `headerTitle` | `sap.uxap.ObjectPageHeader` or `sap.uxap.ObjectPageDynamicHeaderTitle` | **Yes** | Object identity: title, subtitle, image |
| `headerContent` | `sap.ui.core.Control[]` | No | KPIs, attributes, status — collapsible |
| `sections` | `sap.uxap.ObjectPageSection[]` | **Yes** | At least one section required |

## Key properties for design decisions
| Property | Values | When to use |
|---|---|---|
| `showTitleInHeaderContent` | `true` / `false` | `false` when title is in `headerTitle` (default) |
| `alwaysShowContentHeader` | `true` / `false` | `true` pins the header content visible; `false` lets it collapse |
| `useIconTabBar` | `true` / `false` | `true` shows sections as tabs (icon tab bar); `false` shows as anchor navigation on the left. Use tabs for ≤5 sections, anchors for more. |
| `showFooter` | `true` / `false` | `true` for draft save pattern |
| `isChildPage` | `true` / `false` | `true` when inside FlexibleColumnLayout (adds back button) |

## Section structure
```
ObjectPageLayout
  └── sections[]
        └── ObjectPageSection  (top-level tab or anchor)
              └── subSections[]
                    └── ObjectPageSubSection
                          └── blocks[]  (actual content: Form, Table, etc.)
```

## Figma-specific notes
In Horizon, ObjectPageLayout uses `ObjectPageDynamicHeaderTitle` (not the older `ObjectPageHeader`) — the dynamic variant supports collapsing. The library component name is `"Object Page/Default"`.

## Figma variants and booleans

### Default state (what the plugin inserts)
```
Component: Object Page/Default
useIconTabBar: false      (anchor navigation — use for 5+ sections)
showFooter: false
isChildPage: false
alwaysShowContentHeader: false
```

### Context-specific combinations
| Context | Variant / prop settings | Notes |
|---|---|---|
| ≤5 sections (tab navigation) | `useIconTabBar: true` | Sections shown as icon tab bar at top |
| 5+ sections (anchor navigation) | `useIconTabBar: false` | Anchor links on left, all sections visible |
| Edit mode with draft | `showFooter: true` | Sticky footer with Save / Discard buttons |
| Inside FlexibleColumnLayout | `isChildPage: true` | Adds back-navigation button |
| KPIs always visible | `alwaysShowContentHeader: true` | Header content pinned open |

### Never combine
- Never use the deprecated `sap.uxap.ObjectPageHeader` — always use `ObjectPageDynamicHeaderTitle`
- Never nest ObjectPageLayout inside DynamicPage — they are peer containers
- Never set `useIconTabBar: true` for more than 5 sections — use anchor navigation instead

---

## Example hierarchy position

```json
{
  "id": "app-layout",
  "component": "FlexibleColumnLayout",
  "slots": {
    "midColumnPages": {
      "id": "detail-page",
      "component": "ObjectPageLayout",
      "props": {
        "useIconTabBar": true,
        "isChildPage": true
      },
      "slots": {
        "headerTitle": {
          "id": "obj-header",
          "component": "ObjectPageDynamicHeaderTitle",
          "props": {
            "objectTitle": "Purchase Order 4500012345",
            "objectSubtitle": "Office Supplies — Müller GmbH"
          }
        },
        "sections": [
          {
            "id": "general-section",
            "component": "ObjectPageSection",
            "label": "General Information"
          }
        ]
      }
    }
  }
}
```

ObjectPageLayout is typically the `midColumnPages` slot of FlexibleColumnLayout, or the second item in `hierarchy[]` after ShellBar for standalone Object Page screens.

---

## States to document

| State | When it occurs | Figma variant / prop | spec-schema `state` value |
|---|---|---|---|
| Display mode | Viewing entity | Default, no footer | `"default"` |
| Edit mode (draft) | User clicked Edit | `showFooter: true`, footer shows Save/Discard | `"default"` |
| Header expanded | Page load | Header content visible below title | `"default"` |
| Header collapsed | User scrolled | Header content hidden, title pinned | `"default"` (auto) |
| Loading | Entity data fetching | Set `busy: true` on the Layout | `"loading"` |

---


- **sections is mandatory** — ObjectPageLayout without sections renders empty.
- **Use ObjectPageDynamicHeaderTitle** — the older ObjectPageHeader is deprecated in Horizon.
- **One ObjectPageLayout per frame** — never nest.
- **Library: sap.uxap** — import `sap.uxap` in the bootstrap, not just `sap.m`.

## Common mistakes
- Using `sap.f.DynamicPage` for an Object Page — DynamicPage lacks sections/subsections/anchor navigation.
- Forgetting to import `sap.uxap` library in the bootstrap configuration.
- Using the old `sap.uxap.ObjectPageHeader` instead of `ObjectPageDynamicHeaderTitle` in Horizon.

## Public sources
- DemoKit: https://ui5.sap.com/#/entity/sap.uxap.ObjectPageLayout
- Guidelines: https://experience.sap.com/fiori-design-web/v1-145/ui-elements/object-page/
