# Pattern: AI Gateway — Popover Multi-Action Menu

**Reference**: Figma node `138:56893` ("AI Gateway - Proxification")
**Studied**: 2026-06-27
**Floorplan**: Overlay / Popover triggered from a row Actions column

---

## Information Architecture

| Field | Value |
|---|---|
| Business goal | Operationalize bulk row-actions (export, duplicate, archive) on items in an AI Gateway management table without cluttering the row UI |
| User goal | Apply a row-scoped action to a specific item without leaving the current table context |
| Primary workflow | Click row action icon → see action menu → pick one → execute |
| Visual hierarchy | Action label first (primary scan), trailing affordance icon second |
| Why this placement | Popover anchored to the trigger keeps the user's eye on the row they're acting on |

## Composition

- **Floorplan**: dialog → **Popover variant** (not modal Dialog; non-blocking overlay)
- **Container**: native FRAME named "Popovers" (172 × 295)
- **Composition tree**:
  ```
  Popovers (FRAME 172×295)
  ├── Rectangle 3 (boolean — clip-path for rounded corners)
  └── Frame 1511076959 (content FRAME)
      ├── List Item 01 (FRAME 172×29)
      │   ├── Title (TEXT)
      │   └── Trailing Container (INSTANCE — chevron icon button)
      └── List Item 2..6 (FRAME 172×29)
          └── Title (TEXT)
  ```

## Why This Composition (not alternatives)

- **Rejected Dialog** — modal Dialog would block all interaction; this is a peek menu, non-blocking
- **Rejected ActionListItem in a full List** — full sap.m.List has its own framing/borders; the Popover ships with its own elevation+border. Using bare `List Item` frames inside a Popover keeps the visual lighter.
- **Rejected MenuButton dropdown** — MenuButton renders a single button trigger; here the trigger is a row-action icon column, so an anchored Popover is more appropriate.

## Layout Decisions

- **Outer frame**: 172px wide × 295px tall — small, anchored, doesn't reach below the row's siblings
- **List Items**: 29px row height (compact density default)
- **Title text**: 16px x, 6.5px y inside the row — vertically centered to 29-row baseline
- **First item has a Trailing Container (icon)** to signal "this opens a sub-menu" — the other items are leaf actions

## Patterns Applied

| Pattern | SAP Guideline |
|---|---|
| Action Menu in Popover | https://experience.sap.com/fiori-design-web/popover/ |
| Row Actions overflow | https://experience.sap.com/fiori-design-web/responsive-table/ |

## Tokens Used (implicit from the layer naming)

- Popover bg: `sapShellColor` (white card)
- Popover border: `sapShell_BorderColor`
- List Item title: `sapList_TextColor`
- Trailing icon: `sapContent_LabelColor`

## Naming Convention Lesson

- The outer frame is named `Popovers` (plural) — the designer recognizes this is a reusable POPOVER family, not one specific popover
- List items are numbered `List Item 01`, `List Item 2..6` — when the action menu is dynamic (varies by row), numbering helps the spec emitter map item indices
- Internal frames have generic names (`Frame 1511076959`) — fine for one-off internal containers, but the OUTER frame and each List Item are named by role

## Implementation Mapping

Spec emission for this pattern:

```json
{
  "id": "row-actions",
  "component": "Popover",
  "props": { "anchor": "row-action-icon" },
  "children": [
    { "id": "act-1", "component": "ActionListItem", "label": "Add to AI Gateway", "props": { "hasMenu": true } },
    { "id": "act-2", "component": "ActionListItem", "label": "Edit" },
    { "id": "act-3", "component": "ActionListItem", "label": "Duplicate" },
    { "id": "act-4", "component": "ActionListItem", "label": "Export" },
    { "id": "act-5", "component": "ActionListItem", "label": "Archive" },
    { "id": "act-6", "component": "ActionListItem", "label": "Delete", "props": { "intent": "destructive" } }
  ]
}
```

Plugin renderer guidance:
- Popover must be a top-level child of the screen frame (composition.topLevelOnly=true)
- ActionListItem inside Popover renders as a flat row with Title (left) + optional Trailing Container (right) for items that open submenus
