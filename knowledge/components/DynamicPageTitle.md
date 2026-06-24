# DynamicPageTitle
<!-- sap.f.DynamicPageTitle -->

## Identity
- **UI5 class:** `sap.f.DynamicPageTitle`
- **Figma library name:** `"Dynamic Page Title/Default"`
- **Category:** layout / page title area
- **DemoKit:** https://ui5.sap.com/#/entity/sap.f.DynamicPageTitle

## When to Use
Always — DynamicPageTitle is a mandatory slot of DynamicPage. It is the sticky title bar that remains visible when the DynamicPageHeader collapses. It contains the page title, breadcrumb, variant management, and primary page-level actions.

## When NOT to Use
Never use standalone — only as the `title` slot of `sap.f.DynamicPage`.

## Required parent
`sap.f.DynamicPage` (title slot).

## Required / expected children (named slots)
| Slot | Type | Notes |
|---|---|---|
| `heading` | `sap.m.Title` | The main page title |
| `breadcrumbs` | `sap.m.Breadcrumbs` | Navigation path (optional) |
| `snappedHeading` | `sap.m.Title` | Title shown when header is collapsed (can differ) |
| `actions` | `sap.m.Button[]` via OverflowToolbar | Page-level actions |
| `navigationActions` | `sap.m.Button[]` | Secondary navigation actions |
| `content` | any | Shown only when header is expanded |
| `snappedContent` | any | Shown only when header is collapsed |
| `expandedContent` | any | Shown only when header is expanded |

## Key properties for design decisions
| Property | Values | When to use |
|---|---|---|
| `showVariantManagement` | `true` / `false` | `true` on List Report screens (view save). `false` on Worklist. |
| `primaryArea` | `Begin` / `Middle` | Controls title placement. Default `Begin`. |
| `areasHrPaddingClass` | CSS class | Rarely needed — use only for non-standard layouts |

## Figma variants and booleans

### Default state (what the plugin inserts)
```
Component: Dynamic Page Title/Default
primaryArea: Begin
```

### Context-specific combinations
| Context | Variant / prop settings | Notes |
|---|---|---|
| List Report | `actions` slot with Create + Export buttons, VariantManagement in heading slot | Standard List Report title |
| Worklist | Simple `heading` slot only, no VariantManagement, minimal actions | No saved filters needed |
| Object Page | Not used — ObjectPageLayout uses ObjectPageDynamicHeaderTitle instead | Different container |
| With breadcrumbs | `breadcrumbs` slot with sap.m.Breadcrumbs | For navigated-to screens |

### Never combine
- Never add VariantManagement to a Worklist screen title — Worklist has no saved filter views
- Never place row-level or list-level actions here — `actions` slot is for page-level only (Create, Export all)
- Never omit the `heading` slot — an empty title area fails SAP Fiori guidelines

---

## Example hierarchy position

```json
{
  "id": "page",
  "component": "DynamicPage",
  "slots": {
    "title": {
      "id": "page-title",
      "component": "DynamicPageTitle",
      "slots": {
        "heading": {
          "id": "page-heading",
          "component": "Title",
          "label": "Purchase Orders",
          "props": { "level": "H1" }
        },
        "actions": [
          {
            "id": "create-btn",
            "component": "Button",
            "intent": "primary-action",
            "label": "Create"
          }
        ]
      }
    }
  }
}
```

DynamicPageTitle is always the `title` slot of DynamicPage — never standalone, never in `content`.

---

## States to document

| State | When it occurs | Figma variant setting | spec-schema `state` value |
|---|---|---|---|
| Expanded title | Header is visible | Full title bar with all content | `"default"` |
| Snapped title | Header collapsed | Shows `snappedHeading` content | `"default"` (auto-triggered by DynamicPage) |

---


- **Actions go here, not in the header** — Page-level actions (Create, Export) belong in DynamicPageTitle's `actions` slot, not inside DynamicPageHeader.
- **Variant Management on List Report only** — Worklist screens do not have variant management.
- **Always set heading** — an empty title area fails SAP Fiori guidelines.

## Common mistakes
- Putting Create/Export buttons in DynamicPageHeader instead of DynamicPageTitle actions.
- Adding VariantManagement to Worklist screens — it belongs only on List Report/ALP.
- Omitting `snappedHeading` — when header collapses, the title area should still show the page name.

## Public sources
- DemoKit: https://ui5.sap.com/#/entity/sap.f.DynamicPageTitle
