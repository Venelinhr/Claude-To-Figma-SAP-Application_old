# Component Registry — Section 3 Layer 2

**Single source of truth for every SAP component used by the plugin.**

Populated by the MCP layer (Fiori Guidelines, OpenUI5 Demo Kit, SAP Figma Community ID), consumed by the plugin and the AI layer.

---

## Files

- `_schema.json` — JSON Schema defining the structure of every registry entry
- `{ComponentName}.json` — One file per SAP component

## Currently included (Group A — Launch, 28/28 ✓ + Group B — Next, 18/18 ✓)

All 46 components have registry entries as of 2026-06-25:

### Group A — Launch (28)

| Category | Components |
|---|---|
| **Shell** | ShellBar |
| **Navigation** | SideNavigation, NavigationItem, IconTabBar, IconTabFilter |
| **Button** | Button, IconButton, MenuButton |
| **Input** | Input, Select |
| **Selection** | CheckBox, RadioButton, Switch |
| **Typography** | Label, Link |
| **Table** | Table, Column, ColumnListItem |
| **List** | List, StandardListItem |
| **Page** | DynamicPage, DynamicPageTitle, DynamicPageHeader, ObjectPageLayout |
| **Container** | FilterBar, Form, Panel |
| **Overlay** | Dialog |

### Group B — Next Release (18)

| Category | Components |
|---|---|
| **Input** | MultiComboBox, MultiInput, DatePicker, DateRangePicker, DateTimePicker, TimePicker, StepInput, Slider, RangeSlider, TextArea, FileUploader |
| **Display** | Avatar, Tag, ObjectIdentifier, ObjectNumber |
| **Status** | ObjectStatus |
| **Feedback** | MessageStrip, BusyIndicator |

## To do — Group B (next release)

18 components: `MultiComboBox`, `MultiInput`, `DatePicker`, etc.

---

## How to populate a new entry

1. Use the UI5 MCP server: `get_api_reference` → component properties + types
2. Use Chrome MCP: fetch `https://experience.sap.com/fiori-design-web/{slug}/` → do/don't, when to use, accessibility
3. Use Figma MCP: `search_design_system` → get Figma component set key (figmaComponentId)
4. Verify all `colorTokenRules` use tokens from `MANDATORY_TOKENS` (plugin/figma-builder/code.js)
5. Set `lastValidated` to today's date
6. Set `libraryVersion` to the SAP Web UI Kit version checked

---

## Validation rules

Every entry MUST:

1. Have all 21 required fields per `_schema.json`
2. Use only tokens from `MANDATORY_TOKENS` in `colorTokenRules.token`
3. Have at least one `doRules` and one `dontRules` entry
4. Have at least one `accessibilityRules` entry
5. Include `figmaComponentId` that matches an entry in `SAP_KEYS` in `code.js`

---

## Consumers

- **Plugin** (`plugin/figma-builder/code.js`) — reads `figmaComponentId`, `supportedVariants`, `colorTokenRules` to import and render
- **AI Layer** (`skill/SYSTEM_PROMPT.md`) — reads `componentName`, `doRules`, `dontRules`, `compatibleComponents`, `accessibilityRules` to generate valid specs
- **Validator** (`skill/references/validation-checklist.md`) — reads `supportedProperties` to verify spec props are valid
- **MCP 3 (Fiori Guidelines)** — populates `guidelineUrl`, `doRules`, `dontRules`
- **MCP 2 (OpenUI5 Demo Kit)** — populates `apiUrl`, `supportedProperties`, `supportedVariants`, `supportedStates`
- **MCP 3 (SAP Figma Community)** — populates `figmaComponentId`, `figmaLibraryFileId`, `figmaCommunityId`
- **MCP 4 (Foundations & Tokens)** — populates `colorTokenRules`, `typographyRules`

---

Generated 2026-06-25. Schema version 1.
