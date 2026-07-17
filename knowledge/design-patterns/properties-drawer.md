# Pattern: AI Orchestration — Properties Drawer (Bottom Sheet)

**Reference**: Figma node `138:54412` ("AI Gateway Grounding")
**Studied**: 2026-06-27
**Floorplan**: Inspector / Properties Drawer (anchored to bottom of canvas)

---

## Information Architecture

| Field | Value |
|---|---|
| Business goal | Configure an AI Orchestration node's properties (model selection, parameters, prompts) inline without leaving the canvas/flow |
| User goal | Edit the selected node's properties while keeping the flow visible above |
| Primary workflow | Click a node in the orchestration canvas → properties drawer opens below → edit values → see changes propagate |
| Visual hierarchy | Tab Bar selects property category → form inputs scroll within the drawer → flow above stays visible |
| Why this placement | Bottom-anchored drawer is the SAP pattern for inspector/details panels when the canvas is the primary content |

## Composition

- **Container**: native FRAME named "AI - Orchestration" (1711 × 870 — full screen)
- **Composition tree**:
  ```
  AI - Orchestration (FRAME — full screen)
  ├── Base (INSTANCE — Shell+SideNav backdrop)
  ├── Orchestration Flow (INSTANCE — the editable flow canvas)
  ├── Properties Drawer (FRAME 1457×381 — bottom-anchored)
  │   ├── Header (INSTANCE — drawer title bar with close)
  │   ├── Icon Tab Bar (INSTANCE — property category tabs)
  │   └── Properties Panel (FRAME — scrollable content)
  │       ├── Text (INSTANCE — section title)
  │       └── Enable (FRAME — single-line property row)
  │           └── Check Box (INSTANCE)
  └── Menu (INSTANCE — context menu overlay)
  ```

## Why This Composition (not alternatives)

- **Rejected Dialog** — modal Dialog would block the flow; user can't see node positions while editing
- **Rejected Popover** — Popover is too small for property forms with N inputs
- **Rejected DynamicPage with header inspector** — page-level navigation would replace the canvas, breaking the user's spatial mental model
- **Chose Drawer because** — the SAP pattern for "edit selected node properties" on a canvas/flow context is a persistent bottom-anchored panel; user keeps both context (top) and edit surface (bottom)

## Layout Decisions

- **Drawer width**: 1457px (full canvas width minus the side nav)
- **Drawer height**: 381px or 334px (sized by content; resize handle implicit)
- **Header**: 40px tall — SAP standard drawer header
- **Icon Tab Bar**: 44px tall — compact (not the page-level 60px IconTabBar)
- **Properties Panel**: fills remaining height with scroll
- **Property row**: 16px y / 32px y / 44px y — incrementing pattern suggests Auto Layout VERTICAL with 12-16px gap

## Patterns Applied

| Pattern | SAP Guideline |
|---|---|
| Object Page header collapse with inline inspector | https://experience.sap.com/fiori-design-web/object-page/ |
| Properties panel as bottom drawer | (SAP internal pattern — Web Studio / Integration Suite) |
| Icon Tab Bar inside a panel | https://experience.sap.com/fiori-design-web/icon-tab-bar/ |

## Tokens Used (implicit)

- Drawer bg: `sapShellColor`
- Drawer header border: `sapShell_BorderColor`
- Section title text: `sapTitleColor`
- Form labels: `sapContent_LabelColor`

## Naming Convention Lesson

- The outer screen is named after the **app/feature** (`AI - Orchestration`) — not generic ("Screen 1")
- The drawer is named `Properties Drawer` (not "Panel" or "Bottom Sheet") — the **role/function** names it
- Property rows are named by the property they control (`Enable`) — even when the row is just a label+checkbox
- The Header is a SAP `Header` instance — same component reused from Dialog patterns

## Implementation Mapping

Spec emission for inspector/drawer pattern (NEW floorplan idea):

```json
{
  "screen": { "name": "AI Orchestration", "viewport": "desktop" },
  "hierarchy": [
    { "id": "shell", "component": "ShellBar", "props": { ... } },
    { "id": "sidenav", "component": "NativeSideNav", "props": { ... } },
    { "id": "main", "component": "DynamicPage", "slots": {
      "content": [
        { "id": "flow", "component": "Card", "props": { "title": "Orchestration Flow" }, "children": [ ... ] },
        { "id": "drawer", "component": "PropertiesDrawer", "props": {
          "anchorPosition": "bottom",
          "height": 381,
          "tabs": ["General", "Inputs", "Outputs"]
        }, "slots": {
          "content": [
            { "id": "p1", "component": "Text", "label": "Properties" },
            { "id": "p2", "component": "CheckBox", "label": "Enable" }
          ]
        }}
      ]
    }}
  ]
}
```

Plugin renderer guidance:
- **NEW component to register**: `PropertiesDrawer` — composed renderer with SAP `Header` + `IconTabBar` + scroll content FRAME
- Renders at bottom of canvas, full width minus SideNav, height by content
- Currently the plugin doesn't have this — captured as a future-add

<!-- part of the SAP Fiori knowledge base -->
