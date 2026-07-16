# Architecture — Claude to Figma SAP Application

A deep-dive into how the pipeline works, what Claude validates, and how the Figma plugin builds real SAP screens.

---

## What Claude Checks & Validates Before Building

Every spec goes through these checks before the plugin receives it. All must pass — no exceptions.

| # | Check | What it means |
|---|---|---|
| ① | **Right floorplan** | Worklist vs List Report vs Object Page confirmed with user before proceeding. Wrong floorplan = rebuild from scratch. |
| ② | **Every component exists** | All 37 schemas checked — pipeline stops if any component is missing from the registry |
| ③ | **Correct component for the job** | SAP composition rules enforced: Button in Toolbar ✓, Button in ShellBar ✗ |
| ④ | **Only real SAP properties** | No invented props, no hardcoded colours, API values only |
| ⑤ | **ShellBar always first** | SAP Fiori structural mandate, enforced automatically |
| ✓ | **validationStatus: pass** | Plugin refuses to build any spec without this flag |

---

## The Complete User Flow

```
You describe a business need in plain language
        ↓
Claude reads requirement — extracts who, what, data, actions, scale
        ↓
Claude fetches live SAP documentation for every relevant component:
  ① UI5 API JSON      → properties, slots, events, uxGuidelinesLink
  ② Fiori Guidelines  → do/don't, when to use, variants (Chrome MCP)
  ③ DemoKit Samples   → real usage patterns
        ↓
Claude presents proposed structure:
  - Which components and why each one
  - What was excluded and why
  - Questions for you
        ↓
You confirm, refine, or request changes
  - Claude updates proposal, shows what changed
  - Back and forth until approved
        ↓
Claude generates validated JSON spec
  - Saves to ~/Downloads/{name}-spec.json
  - Copies to clipboard
        ↓
Paste into Figma plugin → Validate → Build Screen
        ↓
Real SAP Fiori screen — 1440px, correct density, live SAP kit instances
```

---

## Step 3 — What Claude Researches (automatically, before suggesting anything)

Claude fetches live SAP documentation for every component before recommending it. Three sources:

### Source 1 — UI5 API JSON (direct HTTP, always works)

```
https://ui5.sap.com/test-resources/sap/m/designtime/apiref/api.json   ← sap.m controls
https://ui5.sap.com/test-resources/sap/f/designtime/apiref/api.json   ← sap.f (DynamicPage, ShellBar)
https://ui5.sap.com/test-resources/sap/uxap/designtime/apiref/api.json ← ObjectPage
```

One file = all controls in the library. Returns for every component:
- All properties with types and defaults
- Slots / aggregations
- Events
- `uxGuidelinesLink` — the Fiori guidelines URL, auto-discovered

### Source 2 — SAP Fiori Design Guidelines (Chrome MCP, bypasses 403)

```javascript
navigate_page(ctrl.uxGuidelinesLink)  // URL from Source 1
wait_for(['When to Use', 'Do', "Don't"])
take_snapshot()  // returns full page text
```

Extracts: purpose, when to use, when NOT to use, do/don't, variants, responsive behavior, accessibility.

### Source 3 — UI5 DemoKit Samples (Chrome MCP)

```
navigate_page('https://ui5.sap.com/#/entity/sap.m.Table/samples')
take_snapshot()  // real usage patterns and examples
```

Results are cached to `knowledge/guidelines/{slug}.md` — never re-fetched in future sessions.

---

## Step 4 — What Claude Presents Before Generating

Claude explains its plan in full before producing any JSON:

```
FLOORPLAN: Worklist
WHY: Pre-scoped task queue — system already knows which records
belong to this user. No FilterBar or VariantManagement needed.

COMPONENTS I PLAN TO USE:

ShellBar
  Why: Required on every SAP Fiori screen
  Source: experience.sap.com/fiori-design-web/shell-bar/

Table (sap.m.Table, mode=MultiSelect)
  Why: MultiSelect enables bulk approve/reject/escalate actions
  Do: Use MultiSelect when bulk actions are the primary use case
  Don't: Use GridTable — sap.m.Table is correct for responsive layouts
  Source: experience.sap.com/fiori-design-web/responsive-table/

ObjectStatus
  Why: Semantic status colours per row (green/orange/red)
  Variants: Success, Warning, Error, Information, None
  Source: experience.sap.com/fiori-design-web/object-status/

NOT USING:
  FilterBar — pre-scoped by role, user does not need to filter
  DynamicPageHeader — no collapsible header needed for a task queue

QUESTIONS BEFORE I GENERATE:
  1. Should the table support bulk or single-row selection?
  2. What is the app name for the ShellBar?
  3. Are there status values beyond the ones you mentioned?
```

User can reply: confirm, change anything, ask why, request additions.

---

## Technical Pipeline — How the Plugin Works

```
Requirement (user story / ticket)
        ↓
SKILL.md — orchestrates the pipeline
        ↓
requirement-analyst.md  → floorplan + entity model + user confirmation
        ↓
component-architect.md  → component hierarchy + hard registry gate
        ↓
figma-builder.md        → serialize to spec-schema.json format
        ↓
spec-schema.json        → formal JSON contract
        ↓
plugin/figma-builder/code.js
  flatWalk()                        → extract visual order from SAPUI5 hierarchy
  importComponentSetByKeyAsync(key) → import real SAP kit instances
  setProperties({...})              → apply variant (Compact, Primary, etc.)
  screen.appendChild(inst)          → stack at 1440px fill width
        ↓
Figma canvas — real SAP library instances stacked vertically
```

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│  Claude Skill (skill/SKILL.md)                      │
│  + Knowledge Base (37 schemas, floorplan docs)      │
│  + Chrome MCP (live SAP API + guidelines)           │
└──────────────────────┬──────────────────────────────┘
                       │ produces
                       ▼
              JSON Spec (spec-schema.json)
              SAPUI5 hierarchy:
              DynamicPage → slots → Table → headerToolbar → Toolbar
                       │
                       │ plugin processes
                       ▼
┌─────────────────────────────────────────────────────┐
│  flatWalk()                                         │
│  Strips SAPUI5 slot structure                       │
│  Extracts visual order: [ShellBar, Title, Toolbar,  │
│  Table]                                             │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│  importComponentSetByKeyAsync(key)                  │
│  KEY_MAP["ShellBar"] → SAP_KEYS["ShellBar"]         │
│  → "169cfd74..." → ComponentSetNode                 │
│  → .defaultVariant.createInstance()                 │
│  → .setProperties({ 'Form Factor': 'Compact' })     │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
         Figma Canvas — Flat Stack
         Screen Frame (1440px vertical auto-layout)
           ├── ShellBar          Fill × 44px
           ├── DynamicPageTitle  Fill × 112px
           ├── OverflowToolbar   Fill × 32px
           └── Table             Fill × 556px
```

---

## flatWalk — The Translation Layer

The spec hierarchy is **SAPUI5 code structure**. Figma needs a **flat visual stack**. `flatWalk()` translates between them.

### Input — SAPUI5 spec (code model)

```json
[
  { "component": "ShellBar" },
  { "component": "DynamicPage",
    "slots": {
      "title": { "component": "DynamicPageTitle" },
      "content": {
        "component": "Table",
        "slots": {
          "headerToolbar": {
            "component": "OverflowToolbar",
            "children": [
              { "component": "Button", "intent": "approval", "label": "Approve" }
            ]
          }
        }
      }
    }
  }
]
```

### Output — visual order (Figma model)

```
[ShellBar, DynamicPageTitle, OverflowToolbar, Button(Approve), Table]

Canvas result:
Screen Frame (1440px vertical)
  ├── ShellBar
  ├── DynamicPageTitle
  ├── OverflowToolbar
  ├── Button (Approve)
  └── Table
```

**Rule:** `DynamicPage`, `Page`, `FlexBox`, `HBox`, `VBox` → transparent (skip, recurse into children). `Panel`, `List`, `Table` → place instance, then recurse children as siblings. `Form` → opaque (place instance only).

---

## Component Coverage — SAP Web UI Kit (65 kit pages · 70 components mapped · 9 N/A)

| Kit Page | Plugin Name | Status |
|---|---|---|
| Shell Bar | `ShellBar` | ✓ |
| Breadcrumb | `Breadcrumb` | ✓ |
| Side Navigation | `SideNavigation` | ✓ |
| Tool Header | `ToolHeader` | ✓ |
| Bars (Header/Footer) | `Header / Footer` | ✓ |
| User Menu | `UserMenu` | ✓ |
| Buttons | `Button, IconButton, MenuButton, SplitButton, SegmentedButton` | ✓ |
| Toolbar | `Toolbar, OverflowToolbar, ToolbarItems` | ✓ |
| Dynamic Page Header | `DynamicPageHeader / FilterBar / DynamicPageTitle` | ✓ |
| Tab Bar | `IconTabBar` | ✓ |
| Table | `Table, TableCell` | ✓ |
| Tree | `Tree, TreeItem` | ✓ |
| List | `List, ListItem, StandardListItem` | ✓ |
| Input | `Input, SearchField` | ✓ |
| Select | `Select, ComboBox` | ✓ |
| Multi Combobox | `MultiComboBox` | ✓ |
| Multi Input | `MultiInput` | ✓ |
| Check Box | `CheckBox` | ✓ |
| Radio Button | `RadioButton` | ✓ |
| Switch | `Switch` | ✓ |
| Text Area | `TextArea` | ✓ |
| Date (Range) Picker | `DatePicker, DateRangeSelection` | ✓ |
| Date Time Picker | `DateTimePicker` | ✓ |
| Time Picker | `TimePicker` | ✓ |
| Step Input | `StepInput` | ✓ |
| Slider | `Slider, RangeSlider` | ✓ |
| Label | `Label` | ✓ |
| File Uploader | `FileUploader` | ✓ |
| Link | `Link` | ✓ |
| Object Status | `ObjectStatus` | ✓ |
| Object Identifier | `ObjectIdentifier` | ✓ |
| Object Number | `ObjectNumber` | ✓ |
| Object Attribute | `ObjectAttribute` | ✓ |
| Avatar | `Avatar` | ✓ |
| Tag | `Tag, InfoLabel` | ✓ |
| Progress Indicator | `ProgressIndicator` | ✓ |
| Rating Indicator | `RatingIndicator` | ✓ |
| Busy Indicator | `BusyIndicator` | ✓ |
| Calendar | `Calendar` | ✓ |
| Card | `Card` | ✓ |
| Carousel | `Carousel` | ✓ |
| Message Strip | `MessageStrip` | ✓ |
| Illustrated Message | `IllustratedMessage` | ✓ |
| Toast | `Toast` | ✓ |
| Dialog | `Dialog` | ✓ |
| Popover | `Popover` | ✓ |
| Menu | `Menu` | ✓ |
| Notifications | `Notifications, NotificationListItem, NotificationBanner` | ✓ |
| Panel | `Panel` | ✓ |
| Form | `Form` | ✓ |
| Tokenizer | `Tokenizer, Token` | ✓ |
| Product Switch | `ProductSwitch` | ✓ |
| Settings | `Settings` | ✓ |
| Color Picker | `ColorPicker` | ✓ |
| Al Buttons | `AIButton` | ✓ |
| AI Prompt Input | `AIPromptInput` | ✓ |
| Text | — | N/A (native text) |
| Illustrations | — | N/A (assets) |
| Iconography | — | N/A (icons) |
| Grid | — | N/A (layout) |
| Focus | — | N/A (a11y) |
| Scrollbar | — | N/A (browser) |
| Color Palette | — | N/A (design tool) |
| Homepage Hero Banner | — | N/A (marketing) |
| AI Writing Assistant | — | N/A (no component set) |

---

## Step 3 — Generate a Screen Spec

Two paths depending on what you need:

### Path A — Screen Building (you have a requirement)

```bash
cd Claude-To-Figma-SAP-Application
claude
```

Then type your requirement. Claude runs the full pipeline and outputs a JSON spec.

### Path B — Component Guidance (you want advice)

```
Guide me on which button to use in a procurement approval form.
Which input component should I use for multiple email addresses?
What are the do/don'ts for the SAP Table?
```

Claude fetches guidelines, explains do/don't, proposes structure, answers questions.

### Invocation options

**Option 1 — In the Claude Code session (simplest)**

Just type your requirement directly. Claude detects intent and runs the right path.

**Option 2 — Via CLI skill**

```
Use skill/SKILL.md.
Requirement: As a warehouse manager, I need to monitor incoming shipments...
```

---

## Live Example — Warehouse Shipment Monitor

### Requirement

```
As a warehouse manager, I need to monitor incoming shipments and flag
exceptions. I need to see: shipment ID, supplier, expected delivery date,
current status, and number of items. I need to mark delays, approve
receipt, and escalate critical issues. I process around 40-50 shipments
per day.
```

### Step 1 — Claude parses

| Field | Value |
|---|---|
| User | Warehouse manager |
| Goal | Monitor shipments, flag exceptions, take action |
| Data | Shipment ID, Supplier, Expected Delivery, Status, Items |
| Actions | Mark Delay, Approve Receipt, Escalate |
| Volume | 40–50/day — medium, process queue |
| Task type | Process queue — pre-scoped, not open search |

### Step 2 — Floorplan selected

**Worklist** — system already scopes the list by role. No FilterBar. No VariantManagement.

Claude asks: *"Does this match your intent? Reply yes to proceed."*

### Step 3 — Claude researches and proposes

```
ShellBar     → guidelines checked ✓
Table        → guidelines checked ✓  mode=MultiSelect (bulk actions)
ObjectStatus → guidelines checked ✓  Success/Warning/Error states
OverflowToolbar → guidelines checked ✓  Mark Delay + Approve + Escalate
```

### Step 4 — JSON generated

```json
{
  "$schema": "https://sap-fiori-ai-designer/spec-schema.json",
  "meta": {
    "requirement": "Warehouse manager monitors incoming shipments...",
    "floorplan": "worklist",
    "validationStatus": "pass",
    "guidelinesChecked": [
      "https://experience.sap.com/fiori-design-web/shell-bar/",
      "https://experience.sap.com/fiori-design-web/responsive-table/"
    ]
  },
  "screen": { "name": "Incoming Shipments Monitor", "density": "compact", "viewport": "desktop" },
  "hierarchy": [
    { "id": "shell", "component": "ShellBar", "props": { "productName": "Warehouse Management" } },
    { "id": "page", "component": "DynamicPage", "slots": {
        "title": { "id": "page-title", "component": "DynamicPageTitle", "label": "Incoming Shipments" },
        "content": { "id": "table", "component": "Table", "props": { "mode": "MultiSelect" },
          "slots": {
            "headerToolbar": { "id": "toolbar", "component": "OverflowToolbar", "children": [
              { "id": "t1", "component": "Title", "label": "Shipments (48)" },
              { "id": "sp", "component": "ToolbarSpacer" },
              { "id": "b1", "component": "Button", "intent": "secondary-action", "label": "Mark Delay" },
              { "id": "b2", "component": "Button", "intent": "approval", "label": "Approve Receipt" },
              { "id": "b3", "component": "Button", "intent": "destructive", "label": "Escalate" }
            ]},
            "columns": [
              { "id": "c1", "component": "Column", "label": "Shipment ID" },
              { "id": "c2", "component": "Column", "label": "Supplier" },
              { "id": "c3", "component": "Column", "label": "Expected Delivery" },
              { "id": "c4", "component": "Column", "label": "Status" },
              { "id": "c5", "component": "Column", "label": "Items" }
            ],
            "items": { "id": "row", "component": "ColumnListItem", "repeat": 5, "children": [
              { "id": "shipid", "component": "ObjectIdentifier",
                "sampleData": { "title": ["SHP-00441","SHP-00442","SHP-00443","SHP-00444","SHP-00445"] } },
              { "id": "supplier", "component": "Text",
                "sampleData": { "text": ["Acme Logistics","FastFreight GmbH","Global Parts AG","SAP SE","Delta Supply"] } },
              { "id": "date", "component": "Text",
                "sampleData": { "text": ["23.06.2026","23.06.2026","24.06.2026","25.06.2026","25.06.2026"] } },
              { "id": "status", "component": "ObjectStatus",
                "sampleData": { "text": ["On Time","Delayed","On Time","Critical","On Time"],
                                "state": ["Success","Warning","Success","Error","Success"] } },
              { "id": "items", "component": "ObjectNumber",
                "sampleData": { "number": ["142","38","205","17","89"] } }
            ]}
          }
        }
      }
    }
  ]
}
```

Paste into the plugin → Validate → Build Screen → real SAP components on canvas.

---

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| **Import failed errors** | SAP Web UI Kit not connected as library | Assets (Shift+I) → Libraries → enable SAP Web UI Kit |
| **Components are 1150px wide** | SAP Table default width is 1150px | Select → set Resizing to **Fill container** in Figma right panel |
| **Wrong font in components** | 72 typeface not installed | Install 72 typeface and restart Figma |
| **Pink `[swap slot]` boxes** | Old plugin version cached by Figma | Remove plugin → re-import from `manifest.json` |
| **Syntax error on plugin run** | Figma cached old `code.js` | Remove plugin → re-import from manifest |
| **Chrome MCP stale lock** | Previous session left lock files | `rm -f ~/.cache/chrome-devtools-mcp/chrome-profile/Default/LOCK ~/.cache/chrome-devtools-mcp/chrome-profile/SingletonLock` |
| **403 on SAP guidelines** | SAP site blocks automated fetch | Chrome MCP is required — run `./install.sh` to configure it |
| **"Component not in registry"** | Component missing from `knowledge/components/registry/` | Add schema file + key to `code.js` SAP_KEYS — see README |

---

## The Winning Technical Discovery

After 3 attempts, the correct Figma Plugin API for importing team library components:

```javascript
// ✅ CORRECT — component SET keys → importComponentSetByKeyAsync
const compSet = await figma.importComponentSetByKeyAsync('169cfd74c0be...');
const inst = compSet.defaultVariant.createInstance();
inst.setProperties({ 'Form Factor': 'Compact', 'Type': 'Primary' });
screen.appendChild(inst);

// ❌ WRONG — returns 404 for component set keys
await figma.importComponentByKeyAsync(key);

// ❌ WRONG — this function does not exist
await figma.teamLibrary.importComponentSetByKeyAsync(key);
```

The `componentKey` values in `code.js` were verified by querying the SAP Web UI Kit team library directly via the Figma `search_design_system` MCP tool.

