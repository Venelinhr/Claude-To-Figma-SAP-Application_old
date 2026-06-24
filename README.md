# Claude to Figma SAP Application

> **Describe a business screen in plain language. Claude researches official SAP guidelines, proposes the right components, confirms with you, then generates a validated JSON spec. Paste it into the Figma plugin — real SAP library components appear on your canvas instantly.**

![Claude to Figma SAP Application](https://img.shields.io/badge/Claude%20to%20Figma-SAP%20Application-0070f2?style=flat-square) ![Plugin](https://img.shields.io/badge/Figma-Plugin-a259ff?style=flat-square) ![Claude](https://img.shields.io/badge/Claude-Skill-black?style=flat-square) ![Components](https://img.shields.io/badge/SAP%20Components-70-56d364?style=flat-square) ![Schemas](https://img.shields.io/badge/Registry%20Schemas-37-purple?style=flat-square)

---

## What This Is

A complete pipeline that connects AI reasoning with real SAP design system components in Figma.

**No manual drag-and-drop. No guessing which component to use. No design inconsistencies.**

```
You describe a business need in plain language
        ↓
Claude reads live SAP documentation (API + Guidelines + Samples)
        ↓
Claude proposes structure, explains every choice, asks questions
        ↓
You confirm, change, or refine — Claude updates and re-explains
        ↓
Claude generates a validated JSON spec
        ↓
Paste into the Figma plugin → Build Screen
        ↓
Real SAP Fiori screen with live library components on your canvas
```

---

---

## By the Numbers

These are verified numbers from the source code — not estimates.

| What | Count | Source |
|---|---|---|
| **SAP components the plugin can place** | **70** | `SAP_KEYS` in `plugin/figma-builder/code.js` |
| **Spec names Claude can use** | **81** | `KEY_MAP` in `plugin/figma-builder/code.js` |
| **Registry schemas (hard validation gate)** | **37** | `knowledge/schemas/` folder |
| **SAP Web UI Kit pages covered** | **56 of 65** | Component table in `ARCHITECTURE.md` |
| **Kit pages not applicable** | **9** | Text, Illustrations, Icons, Grid, Focus, Scrollbar, Color Palette, Hero Banner, AI Writing Assistant |

> **What this means for you:** When you describe a screen, Claude can place any of the **70 verified SAP components**. Every one has a confirmed library key tested against the real SAP Web UI Kit. If a component is not in the list, the pipeline stops and tells you — no surprises.

---

## Why This Exists

SAP Fiori has 65 component pages in its Web UI Kit, 70 verified components, strict usage rules, do/don't guidelines, and specific floorplan patterns (Worklist, List Report, Object Page, etc.). Getting these right manually is slow and error-prone.

This tool:
- Reads **official SAP Fiori Design Guidelines** before recommending any component
- Checks **UI5 API documentation** for correct properties and variants
- Validates every component against a **hard registry gate** — no hallucinated components
- **Asks clarifying questions** before generating anything
- Outputs screens using **real SAP Web UI Kit instances** — not screenshots or placeholders

---

## Setup — Step by Step

Follow these steps in order. All are required for the full pipeline to work.

---

### Step 1 — Install the 72 Typeface

The SAP Web UI Kit uses the proprietary **72** typeface. Without it, text in SAP components renders with the wrong font.

1. Download from: [SAP Fiori Resources — 72 Typeface](https://www.sap.com/design-system/fiori-design-web/v1-148/resources/libraries/sap-fiori-for-web-ui-kit#:~:text=you%20have%20the-,latest%20version,-of%20the%2072)
2. Install the font on your system (double-click the font files → Install)
3. **Restart Figma** after installing so it picks up the new font

---

### Step 2 — Get the SAP Web UI Kit in Figma

The plugin imports real SAP components from the SAP Web UI Kit Figma library. Choose your option:

#### Option A — Figma Community (free, for most users)

1. Open: **[SAP Web UI Kit on Figma Community](https://www.figma.com/community/file/1494295794601744471)**
2. Click **Open in Figma** or **Duplicate** to copy it to your drafts
3. In that file: File menu → **Publish styles and components** → Publish
4. In your working file: Assets panel (**Shift+I**) → Libraries → enable **SAP Web UI Kit**

#### Option B — SAP employees / partners

The kit is already available as a team library in your Figma org:
1. Open your working Figma file
2. Assets panel (**Shift+I**) → Libraries tab
3. Find **SAP Web UI Kit** → toggle ON

---

### Step 3 — Install Claude Code CLI

```bash
npm install -g @anthropic-ai/claude-code
claude --version
```

Sign in when prompted. Requires Node.js 18+.

---

### Step 4 — Clone the repo and run the installer

```bash
git clone https://github.com/Venelinhr/Claude-To-Figma-SAP-Application.git
cd claude-to-figma-sap
./install.sh
```

The installer:
- Copies the Claude skill to `~/.claude/skills/sap-figma-design-agent/`
- Installs Chrome DevTools MCP (for live SAP documentation fetching)
- Adds Chrome MCP to `~/.claude/settings.json`

> **No Figma API key needed.** The plugin imports components directly from the team library. A Figma API key is only needed if you want Claude to browse your Figma files (optional — add later to `~/.claude/settings.json` under `mcpServers.figma`).

---

### Step 5 — Load the Figma plugin

**Download the plugin folder first:**

1. Go to: [plugin/figma-builder on GitHub](https://github.com/Venelinhr/Claude-To-Figma-SAP-Application/tree/main/plugin/figma-builder)
2. Click the **green Code button** → **Download ZIP**, then extract it — or if you cloned the repo in Step 4, the folder is already at `claude-to-figma-sap/plugin/figma-builder/`

**Load it in Figma:**

3. Open **Figma desktop app** (not the browser — plugins require the desktop app)
4. Menu → **Plugins → Development → Import plugin from manifest**
5. Navigate to the `plugin/figma-builder/` folder and select: **`manifest.json`**
6. The plugin **Claude to Figma SAP Application** now appears under Plugins → Development

> **Note:** Figma must be the **desktop app**, not the browser. The plugin will not load in the browser version.

---

### Step 6 — Restart Claude Code

MCP servers load at startup. Close and reopen Claude Code after the installer runs:

```bash
cd claude-to-figma-sap
claude
```

---

## How to Use — Step by Step

Once setup is complete, this is your daily workflow.

---

### Step 1 — Describe your business need

Open Claude Code in the project folder and type your requirement in plain language. No SAP knowledge needed:

```
As a warehouse manager, I need to monitor incoming shipments and flag
exceptions. I need to see: shipment ID, supplier, expected delivery date,
current status, and number of items. I need to mark delays, approve
receipt, and escalate critical issues. I process around 40-50 shipments
per day.
```

Or try one of the built-in scenarios:

```
As a procurement manager, I review 20-30 pending purchase orders
daily and need to approve or reject them in bulk.
```

```
Our inventory team needs to see all stock across all warehouses.
They filter by warehouse, category, supplier, and stock status.
```

---

### Step 2 — Claude researches SAP documentation

Before recommending anything, Claude automatically fetches live documentation for every component it plans to use:

| Source | What Claude gets |
|---|---|
| UI5 API JSON (`ui5.sap.com/.../apiref/api.json`) | All properties, slots, events, auto-discovered guidelines URL |
| SAP Fiori Design Guidelines (`experience.sap.com/fiori-design-web/`) | When to use, do/don't, variants, accessibility — via Chrome MCP |
| UI5 DemoKit Samples (`ui5.sap.com/#/entity/...`) | Real usage patterns and examples |

Results are cached to `knowledge/guidelines/` — never re-fetched in future sessions.

---

### Step 3 — Claude presents its proposal

Claude explains what it plans to build **before generating anything**:

```
FLOORPLAN: Worklist
WHY: Pre-scoped task queue — the system already knows which shipments
belong to this manager. No FilterBar or VariantManagement needed.

COMPONENTS I PLAN TO USE:

ShellBar
  Why: Required on every SAP Fiori screen
  Source: experience.sap.com/fiori-design-web/shell-bar/

Table (sap.m.Table, mode=MultiSelect)
  Why: MultiSelect enables bulk Mark Delay / Approve / Escalate
  Do: Use MultiSelect when bulk actions are the primary use case
  Don't: Use GridTable — sap.m.Table is correct for mobile-responsive layouts
  Source: experience.sap.com/fiori-design-web/responsive-table/

ObjectStatus
  Why: Semantic status colours per row (Success/Warning/Error)
  Variants: Success (green), Warning (orange), Error (red), Information (blue)
  Source: experience.sap.com/fiori-design-web/object-status/

NOT USING:
  FilterBar — Worklist is pre-scoped by role, user does not need to filter
  DynamicPageHeader — no collapsible header needed for a task queue

QUESTIONS BEFORE I GENERATE:
  1. Should the table support bulk selection or single-row actions only?
  2. What is the app name for the ShellBar?
  3. Are there status values beyond On Time / Delayed / Critical?
```

---

### Step 4 — Confirm or refine

Reply to Claude's proposal. You can approve, change anything, or ask questions:

| You say | Claude does |
|---|---|
| `"yes"` / `"looks good"` / `"generate it"` | Generates the JSON spec immediately |
| `"add a search field"` | Adds SearchField to toolbar, shows updated structure |
| `"use Cozy density"` | Switches to Cozy (44px touch-friendly components), explains what changes |
| `"remove the footer"` | Removes Footer, confirms updated structure |
| `"why not List Report?"` | Explains the Worklist vs List Report decision with SAP guideline reference |
| `"add 2 more columns"` | Updates the Table spec, asks what data each column should show |
| `"make it mobile"` | Switches viewport to 375px, adjusts density and layout |

You can keep refining until you're happy. Claude updates the proposal each time.

---

### Step 5 — JSON spec is generated

After you confirm, Claude generates a validated spec, saves it, and copies it to clipboard:

```json
{
  "$schema": "https://claude-to-figma-sap/spec-schema.json",
  "meta": {
    "requirement": "Warehouse manager monitors incoming shipments...",
    "floorplan": "worklist",
    "validationStatus": "pass",
    "guidelinesChecked": [
      "https://experience.sap.com/fiori-design-web/shell-bar/",
      "https://experience.sap.com/fiori-design-web/responsive-table/",
      "https://experience.sap.com/fiori-design-web/object-status/"
    ]
  },
  "screen": {
    "name": "Incoming Shipments Monitor",
    "density": "compact",
    "viewport": "desktop"
  },
  "hierarchy": [
    { "id": "shell", "component": "ShellBar", "props": { "productName": "Warehouse Management" } },
    { "id": "page-title", "component": "DynamicPageTitle", "label": "Incoming Shipments" },
    { "id": "toolbar", "component": "OverflowToolbar", "children": [ ... ] },
    { "id": "table", "component": "Table", "props": { "mode": "MultiSelect" }, "slots": { ... } }
  ]
}
```

Saved to `~/Downloads/{screen-name}-spec.json`.

---

### Step 6 — Build in Figma

1. Open Figma → **Plugins → Development → Claude to Figma SAP Application**
2. Paste the JSON spec into the text area (it's already in your clipboard)
3. Click **Validate** — checks all components exist in the SAP library
4. Click **Build Screen**
5. Real SAP components stack on the canvas at 1440px width

---

### Step 7 — Review the result

The screen is built from real SAP Web UI Kit instances — not mockups. You can:
- Click any component to inspect its properties
- Swap variants directly in Figma (Form Factor, Type, State, etc.)
- Edit text content inside instances
- Use the screen directly in your design handoff

---

## About the Figma Plugin

### Why a plugin is needed

The Figma Plugin API is the **only way** to import real library component instances programmatically. The Figma REST API and MCP cannot do this — only a plugin running inside Figma can call `importComponentSetByKeyAsync()`.

### What the plugin does

```
JSON spec
    ↓
flatWalk() — reads SAPUI5 hierarchy, extracts visual order
    ↓
importComponentSetByKeyAsync(key) — imports real SAP kit instances
    ↓
setProperties({ 'Form Factor': 'Compact', 'Type': 'Primary' })
    ↓
screen.appendChild(instance) + resize to 1440px fill width
```

### Core principle

> SAP library components already know their own height, colours, typography, and internal structure. **The plugin's only job is to stack them.**

```
Screen Frame (1440px, vertical auto-layout)
  ├── ShellBar          ← real SAP instance, fills width
  ├── DynamicPageTitle  ← real SAP instance, fills width
  ├── OverflowToolbar   ← real SAP instance, fills width
  └── Table             ← real SAP instance, fills width
```

No nested frames. No custom colours. No hardcoded sizes. Just import and stack.

---

## What Claude Validates Before Building

Every spec goes through these checks before the plugin receives it:

| Check | What it means |
|---|---|
| ① Right floorplan | Worklist vs List Report vs Object Page — confirmed with you before proceeding |
| ② Every component exists | All 37 schemas checked — pipeline stops if anything is missing |
| ③ Correct component for the job | SAP composition rules enforced (Button in Toolbar ✓, in ShellBar ✗) |
| ④ Only real SAP properties | No invented props, no hardcoded colours, API values only |
| ⑤ ShellBar always first | SAP Fiori structural mandate, enforced automatically |
| ✓ validationStatus: pass | Plugin refuses to build without this flag |

---

## SAP Icons

The SAP Web UI Kit includes all icons as vectors inside the components. If you need to browse icons or download the icon font for development:

- **Browse all SAP icons:** [SAP Icon Explorer](https://ui5.sap.com/test-resources/sap/m/demokit/iconExplorer/webapp/index.html#/overview)
- **Download icon font:** Available on the [SAP Fiori Resources page](https://www.sap.com/design-system/fiori-design-web/v1-148/resources/libraries/sap-fiori-for-web-ui-kit)

---

## SAP Floorplan Reference

| Your scenario | Floorplan |
|---|---|
| Personal task queue, process assigned items, bulk actions | **Worklist** |
| Search across all records, user sets own filters | **List Report** |
| Full details of one business object, multiple sections | **Object Page** |
| KPIs + charts + multiple lists on one dashboard | **Overview Page** |
| List + detail side by side | **Master Detail (FCL)** |
| Multi-step guided process | **Wizard** |

**Most common mistake:** Using List Report for a personal task queue. If the system already knows what the user should see → Worklist, no FilterBar, no VariantManagement.

---

## 70 SAP Components Covered (56 of 65 kit pages)

| Category | Components |
|---|---|
| Navigation | ShellBar, Breadcrumb, SideNavigation, ToolHeader, UserMenu, IconTabBar |
| Buttons | Button (5 types), IconButton, MenuButton, SegmentedButton, SplitButton, AIButton |
| Toolbars | Toolbar, OverflowToolbar |
| Page Layout | DynamicPageHeader, DynamicPageTitle, FilterBar |
| Data | Table, Tree, List, StandardListItem |
| Form Inputs | Input, Select, ComboBox, MultiComboBox, MultiInput, CheckBox, RadioButton, Switch, TextArea, DatePicker, DateTimePicker, TimePicker, Slider, RangeSlider, StepInput, FileUploader, Label |
| Display | ObjectStatus, ObjectIdentifier, ObjectNumber, ObjectAttribute, Avatar, Tag, Link, ProgressIndicator, RatingIndicator, BusyIndicator |
| Feedback | MessageStrip, Toast, Dialog, Popover, Menu, Notifications, IllustratedMessage |
| Containers | Panel, Form, Card, Carousel, Calendar, Settings, ProductSwitch, ColorPicker |

---

## Example Scenarios

### Worklist — Procurement Approval Queue
```
As a procurement manager, I review 20-30 pending purchase orders
daily and need to approve or reject them in bulk.
```

### List Report — Inventory Overview
```
Our inventory team needs to see all stock across all warehouses.
They filter by warehouse, category, supplier, and stock status.
They export results and trigger stock movements directly.
```

### Object Page — IT Asset Request
```
As an IT coordinator, I review equipment requests for new employees.
I see employee details, requested items, and fulfilment status.
I can assign from stock, create a PO, or reject.
```

### Object Page — Supplier Profile
```
Procurement specialists need a supplier profile showing contact info,
payment terms, active POs, delivery performance, and contracts.
```

---

## Chrome MCP — How Claude Reads Live SAP Docs

Chrome DevTools MCP gives Claude a real browser that renders JavaScript SPA pages and bypasses 403 blocks on SAP's documentation sites:

```javascript
// Step 1: Fetch API JSON (direct HTTP — no browser needed)
const r = await fetch('https://ui5.sap.com/test-resources/sap/m/designtime/apiref/api.json');
const j = await r.json();
const ctrl = j.symbols.find(s => s.name === 'sap.m.Button');
// ctrl.uxGuidelinesLink → auto-discovered Fiori guidelines URL

// Step 2: Navigate to Fiori guidelines (Chrome MCP bypasses 403)
navigate_page(ctrl.uxGuidelinesLink)
wait_for(['When to Use', 'Do', "Don't"])
take_snapshot()  // returns full page text: do/don't, variants, accessibility
```

**Fix Chrome MCP stale lock:**
```bash
rm -f ~/.cache/chrome-devtools-mcp/chrome-profile/Default/LOCK \
       ~/.cache/chrome-devtools-mcp/chrome-profile/SingletonLock \
       ~/.cache/chrome-devtools-mcp/chrome-profile/SingletonSocket
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Import failed — component not found | SAP Web UI Kit not connected. Assets (Shift+I) → Libraries → enable SAP Web UI Kit |
| Components are 1150px wide | Select them → set Resizing to **Fill container** in Figma right panel |
| Wrong font in components | Install the 72 typeface (Step 1) and restart Figma |
| Pink `[swap slot]` boxes | Re-import plugin from manifest — Figma cached an old version |
| Syntax error when plugin runs | Remove plugin → re-import from manifest (`manifest.json`) |
| Chrome MCP stale lock error | Run the lock fix command above |

---

## Project Structure

```
claude-to-figma-sap/
├── install.sh                    ← one-command setup (Steps 3-4)
├── spec-schema.json              ← JSON contract: Claude output ↔ plugin input
├── ARCHITECTURE.html             ← full visual documentation (open in browser)
│
├── skill/                        ← Claude AI skill
│   ├── SKILL.md                  ← main pipeline orchestration
│   ├── agents/
│   │   ├── requirement-analyst.md
│   │   ├── component-architect.md
│   │   ├── figma-builder.md
│   │   └── component-guidance.md ← "guide me / which component" mode
│   └── references/
│       ├── floorplan-decision-matrix.md
│       ├── component-dependencies.md
│       └── validation-checklist.md
│
├── plugin/figma-builder/         ← Figma plugin (load manifest.json in Figma)
│   ├── manifest.json
│   ├── code.js                   ← 70 SAP component keys + importComponentSetByKeyAsync
│   └── ui.html                   ← plugin UI: paste spec → validate → build
│
├── knowledge/
│   ├── schemas/                  ← 37 JSON schemas (hard registry gate)
│   ├── floorplans/               ← 3 floorplan pattern docs
│   ├── components/               ← 7 component usage guides
│   └── guidelines/               ← SAP guidelines cache (populated by Chrome MCP)
│
└── tests/
    ├── prompts/                  ← example business requirements
    └── expected/                 ← expected JSON outputs for testing
```

---

## Full Documentation

For the complete technical deep-dive see **[ARCHITECTURE.md](ARCHITECTURE.md)** which covers:
- What Claude validates before building
- The complete user flow
- What Claude researches (SAP API + Guidelines + Samples)
- What Claude presents before generating
- Technical pipeline and architecture layers
- flatWalk — the translation layer
- Component coverage — all 65 SAP Web UI Kit pages
- Live example with full JSON (Warehouse Shipment Monitor)
- Troubleshooting guide

For a visual HTML version (local only):
- User flow diagram with live example (Warehouse Shipment Monitor)
- How Chrome MCP fetches SAP documentation
- The import API discovery story (3 attempts, what failed and why)
- All 70 components with verified library keys
- Figma screen results with analysis

---

## License

MIT — June 2026

*Claude Code + Figma Plugin API + SAP Web UI Kit + Chrome DevTools MCP*
