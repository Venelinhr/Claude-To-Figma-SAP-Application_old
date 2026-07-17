# Pattern: MCP Server Overview — Read-Only Detail with Header Actions

**References**: Figma nodes `138:116169` ("MCP HTTP"), `138:132462` ("Proxification of MCP Server")
**Studied**: 2026-06-27
**Floorplan**: Object Page detail (read-only / non-edit mode)

---

## Information Architecture

| Field | Value |
|---|---|
| Business goal | Show the configuration of an MCP server to the user without inviting edits; provide explicit Save/Cancel/Delete actions in the page header |
| User goal | Review server settings; act on the page (save, cancel, optionally delete) without scrolling |
| Primary workflow | Read → optionally Save/Cancel/Delete |
| Visual hierarchy | Shell → Side Nav → Page Header (Breadcrumb → H1 Title → action button group) → Section tab bar → Content section |
| Why this placement | Top-right action group is SAP convention for page-level actions on Object Pages |

## Composition

- **Container**: full-screen FRAME (1711×870)
- **Composition tree**:
  ```
  MCP Server Overview (FRAME)
  ├── ShellBar  (implicit via Base instance, top 52px)
  └── Container (FRAME — body, below ShellBar)
      ├── Side Navigation (INSTANCE — 256×818)
      └── Frame 2018776313 (FRAME — main content, 1452×548)
          └── Frame 2018776314 (FRAME — page header zone)
              ├── Frame 2018776271 (FRAME — header section 1: title + actions)
              │   ├── Frame 2018776270 (FRAME — title group)
              │   │   ├── Breadcrumb (INSTANCE)
              │   │   └── Title Text (FRAME → Title TEXT)
              │   └── Frame 2018776267 (FRAME — action group, top-right)
              │       └── Frame 2018776267 (FRAME — button row)
              │           ├── Save (INSTANCE)
              │           ├── Cancel (INSTANCE)
              │           └── [Delete (INSTANCE) — only in Proxification variant]
              └── Frame 2018776315 (FRAME — header section 2: subtitle / status)
                  └── ...
  ```

## Why This Composition

- **Rejected DynamicPageTitle with breadcrumb + actions** — the designer chose to compose the header manually because the action group sits at a specific 1310px-from-left position (top-right corner of the content area, not the page header)
- **Rejected DynamicPage** — would force the SAP page header pattern; the designer wants tighter control over the title/action group layout
- **Chose manual composition** because: (a) actions sit top-right of content (not in DPT.slots.actions), (b) breadcrumb is above title (not in DPT.slots.breadcrumbs), (c) the visual rhythm differs from standard DynamicPageTitle

## Layout Decisions

- **Side Navigation always 256px wide** — fixed; appears in 6 of 6 detail screens
- **Main content 1452px wide** — 1710 - 256 - 2 (gutter) = 1452. Matches in multiple references.
- **Header section 1 height 53px** — title + actions both 53px tall (the actions are 26px tall, vertically centered)
- **Action group top-right** — anchored at x=1310 or x=1210 (varies by button count, sized to fit)
- **Button gap**: 8px (Save 42 wide + 8 gap + Cancel 60 wide = 110 total; with 3 buttons 210 total)
- **Breadcrumb at y=0, Title at y=20** — 20px gap between

## Patterns Applied

| Pattern | SAP Guideline |
|---|---|
| Object Page with Save/Cancel top-right | https://experience.sap.com/fiori-design-web/draft-handling/ |
| Breadcrumb → H1 title hierarchy | https://experience.sap.com/fiori-design-web/breadcrumb/ |
| Side Navigation persistent at app level | https://experience.sap.com/fiori-design-web/side-navigation/ |

## Naming Convention Lesson

- **Outer screen named after the object identity**: `MCP Server Overview` (purpose-driven)
- **Variant in name**: `MCP Server Overview` (edit mode) vs `MCP Server Overview_Non Edit` — appending `_Non Edit` suffix names a state variant
- **Frame naming**: hierarchical containers use generic numbered names (`Frame 2018776313`); semantic instances use SAP component names. **The semantic content is in the instance names, not the container names.**
- **Button labels match the SAP component instance name**: `Save` / `Cancel` / `Delete` — designer reuses the same labeled Button instance from a master variant set

## Action Group Pattern

The right-aligned button cluster is **always inside two nested frames**:
```
Frame 2018776267 (anchored top-right of header)
└── Frame 2018776267 (auto-layout HORIZONTAL, gap 8px)
    ├── Save (primary instance)
    ├── Cancel (secondary instance)
    └── [Delete (destructive instance)]
```
The double-wrapping seems redundant but lets the designer **independently position** the cluster (outer frame) while **changing the button order/count** (inner frame). The plugin should mirror this — outer frame for positioning, inner frame for action layout.

## Implementation Mapping

For "Object Page with header actions" pattern, spec emission:

```json
{
  "screen": { "name": "MCP Server Overview", "viewport": "desktop" },
  "hierarchy": [
    { "id": "shell",   "component": "ShellBar" },
    { "id": "sidenav", "component": "NativeSideNav", "props": { "items": [ ... ] } },
    { "id": "page",    "component": "DynamicPage",
      "slots": {
        "title": [{
          "id": "page-title", "component": "DynamicPageTitle",
          "slots": {
            "breadcrumbs": [{ "id": "bc", "component": "Breadcrumb", "label": "Servers" }],
            "heading":     [{ "id": "h1", "component": "Title", "label": "MCP HTTP" }],
            "actions": [
              { "id": "btn-save",   "component": "Button", "intent": "primary-action",   "label": "Save" },
              { "id": "btn-cancel", "component": "Button", "intent": "secondary-action", "label": "Cancel" }
            ]
          }
        }],
        "content": [ ... ]
      }
    }
  ]
}
```

Plugin guidance:
- DynamicPageTitle.slots.actions already renders the right-aligned button cluster — this IS the correct abstraction
- Don't replicate the designer's manual frame-of-frame pattern in specs; specs use the DynamicPageTitle composition and the plugin renders the action group correctly
- The designer manually composed it because of historical Figma file conventions; the spec layer doesn't need that complexity

## Continuous-learning note

This is one of the **most stable, oft-repeated patterns** across the references. Object Page detail with action header appears in nearly every "detail screen" reference. The plugin's `DynamicPage` + `DynamicPageTitle.slots.actions` handler already supports this — the lesson is to USE that abstraction consistently and not reinvent the manual composition.

<!-- part of the SAP Fiori knowledge base -->
