# Pattern: MCP Server Config — Configurable Tab Section with Form

**References**: Figma nodes `138:94508`, `138:104652` ("Multi-Source Selection")
**Studied**: 2026-06-27
**Floorplan**: Object Page detail with Tab-driven form sections

---

## Information Architecture

| Field | Value |
|---|---|
| Business goal | Configure an MCP Server's source types (API / Database / Vector Store / etc.) in a single overview page |
| User goal | Pick a source-type tab → fill the specific config for that source → save once |
| Primary workflow | Tab switching to scope the form; form fills are typed per-tab |
| Visual hierarchy | Tab Bar (top, primary) → Section Title ("Source Type: API") → Single inline Form row → bottom of viewport reserved for further sections |
| Why this placement | Tabs at top is the SAP convention for scoping; the form sits in a clear card-like region below |

## Composition

- **Container**: native FRAME (1711×870 — full screen)
- **Composition tree**:
  ```
  MCP Server Config (FRAME)
  ├── Base (INSTANCE — Shell + SideNav backdrop)
  └── Frame 2018776310 (FRAME — tab section wrapper)
      └── Frame 2018776311 (FRAME)
          ├── Inner Tab Bar (INSTANCE — sub-tabs scoped to this section)
          └── Frame 2018776331 (FRAME — current tab's content)
              ├── Source Type: API (TEXT — section sub-heading)
              └── Frame 2018776331 (FRAME — inline form row)
                  ├── API: (TEXT — label, 26px wide)
                  └── Multi Combobox (INSTANCE — value selector, 280px wide)
  ```

## Why This Composition

- **Rejected DynamicPageHeader + FilterBar** — that pattern is for list-report filters; here the user isn't filtering, they're typing a configuration
- **Rejected separate Dialogs per source type** — would force modal context-switching; the user wants to compare/switch quickly via tabs
- **Rejected Wizard** — Wizard implies sequence; source-type selection isn't sequential, it's user-choice
- **Chose Inner Tab Bar + inline Form section** because the user is selecting WHICH config to fill (tab as discriminator), then filling it (form below)

## Layout Decisions

- **Inner Tab Bar** vs page-level IconTabBar: this is a SECTION-level tab bar (44px tall, ~1387 wide), nested INSIDE the page content area. Different from the page header tabs.
- **Inline Form pattern**: Label (`API:` 26px wide, fixed) + Input/Combobox (280px wide). The 26px label is auto-sized to text content; the field is fixed width. This is the SAP "Form Item (horizontal)" pattern.
- **Section sub-heading**: `Source Type: API` is a separate text node above the form row — gives the form section a contextual title

## Patterns Applied

| Pattern | SAP Guideline |
|---|---|
| Inner Tab Bar for section scoping | https://experience.sap.com/fiori-design-web/icon-tab-bar/ |
| Horizontal inline Form item (Label + Input side-by-side) | https://experience.sap.com/fiori-design-web/form/ |
| MultiComboBox for typed multi-select | https://experience.sap.com/fiori-design-web/multi-combobox/ |

## Naming Convention Lesson

- The text **"Source Type: API"** is the section heading — pattern is `<Category>: <Value>` so the user can scan which tab is active
- The form row uses **generic frame numbers** (`Frame 2018776331`) — this is OK for one-off layout frames; the **SAP component instances** inside carry the semantic names
- **`Inner Tab Bar`** name — distinguishes from a page-level IconTabBar. Suggests there's a hierarchy: outer IconTabBar (page sections) vs inner Tab Bar (section sub-divisions)

## Implementation Mapping

This is a NEW floorplan variant — **Object Page with nested tab section**:

```json
{
  "id": "config-section",
  "component": "Panel",
  "props": { "headerText": "Source Type Configuration" },
  "children": [
    { "id": "inner-tabs", "component": "IconTabBar", "props": { "subTab": true },
      "children": [
        { "id": "tab-api",      "component": "IconTabFilter", "props": { "text": "API", "selected": true } },
        { "id": "tab-db",       "component": "IconTabFilter", "props": { "text": "Database" } },
        { "id": "tab-vector",   "component": "IconTabFilter", "props": { "text": "Vector Store" } },
        { "id": "tab-storage",  "component": "IconTabFilter", "props": { "text": "Object Storage" } }
      ]
    },
    { "id": "section-heading", "component": "Text", "label": "Source Type: API", "props": { "size": 16, "subtle": true } },
    { "id": "form-row", "component": "SimpleForm", "props": { "layout": "horizontal-inline" },
      "children": [
        { "id": "f-api", "component": "Label", "label": "API:" },
        { "id": "i-api", "component": "MultiComboBox", "props": { "selectedKeys": [] } }
      ]
    }
  ]
}
```

Plugin guidance:
- IconTabBar with `subTab: true` should render at 44px height (not the page-level 60px) and without the bottom shadow
- SimpleForm with `layout: 'horizontal-inline'` should NOT right-align the label column — it should AUTO-size the label to its text width with 16px gap before the field

## Continuous-learning note

The two references at `138:94508` and `138:104652` are **near-identical** — second one likely a copy with minor edits. This pattern is mature in the designer's library. Plugin should treat horizontal-inline form layout as a first-class variant of SimpleForm.

<!-- part of the SAP Fiori knowledge base -->
