# Claude to Figma SAP Application

> Describe a business screen in plain language — or attach a sketch, screenshot, or Figma reference. Claude reads official SAP guidelines, measures the reference, selects components, previews the layout as an ASCII wireframe for your approval, then builds a real SAP Fiori screen directly in Figma — real library components, live tokens, zero manual drag-and-drop. **ANALYZE → PLAN → EXECUTE → VALIDATE → LEARN.**

![Claude to Figma](https://img.shields.io/badge/Claude_to_Figma-SAP_Application-0070F2?style=flat-square)
![Components](https://img.shields.io/badge/SAP_Components-152-brightgreen?style=flat-square)
![Rules](https://img.shields.io/badge/Rules-30_mandatory-orange?style=flat-square)
![Plugin](https://img.shields.io/badge/Plugin-2%2C391_LOC-purple?style=flat-square)
![Tokens/build](https://img.shields.io/badge/~3k_tokens%2Fbuild-88%25_reduction-blue?style=flat-square)

---

## Installation

### What you get after setup

| What | Count | Purpose |
|------|-------|---------|
| MCP servers (auto-wired) | 5 | Claude's eyes and hands — reads SAP guidelines, writes to Figma, analyses references |
| Component registry | 152 JSON files | Every SAP Web UI Kit component: keys, variants, tokens, do/don't rules |
| Fiori guideline cache | 154 files | Offline SAP design guidelines — no internet needed per build |
| Figma plugin | 1 file | The only piece that binds real SAP Horizon token variables — Claude can't do this without it |
| Canonical screen library | `.fig` file | 8 confirmed SAP screens to clone from — the quality baseline |
| Reasoning skill | 30 mandatory rules | The brain: ANALYZE → PLAN → EXECUTE → VALIDATE → LEARN |

---

### Step 1 — Clone and install

```bash
git clone https://github.com/Venelinhr/Claude-To-Figma-SAP-Application.git
cd Claude-To-Figma-SAP-Application
./install.sh
```

`install.sh` does three things automatically:
- Installs Node.js dependencies
- Registers all 5 MCP servers in `~/.claude/settings.json`
- Verifies the registry bundle is up to date

**Prerequisites:** Node.js ≥ 20 · Claude Code CLI · Figma desktop app

---

### Step 2 — Add your Figma API token

Claude needs permission to read and write to your Figma files.

1. Get a token at **figma.com → Settings → Personal access tokens** → Create new token (scopes: Files read + write)
2. Open `~/.claude/settings.json` and set:

```json
"mcpServers": {
  "figma": {
    "env": {
      "FIGMA_API_TOKEN": "your-token-here"
    }
  }
}
```

Then restart Claude Code and verify:
```bash
claude mcp list   # should show 5+ servers including "figma"
```

---

### Step 3 — Load the Figma plugin

**Why the plugin is required:** Claude builds screen structure via the Figma MCP, but MCP runs in a sandbox — it has no access to your SAP library's private token variables. The plugin is the only piece that can bind live SAP Horizon tokens (theme-switchable colours, spacing, typography) to every element. Without it, you get structure but no real SAP tokens.

**How to load it:**

1. Open Figma desktop
2. Menu → **Plugins** → **Development** → **Import plugin from manifest...**
3. Navigate to `plugin/figma-builder/manifest.json` in this repo and select it

The plugin will appear under **Plugins → Development → SAP Figma Builder**.

**What the plugin does on each build:**
- Reads `[sapToken]` name tags Claude placed → binds real SAP Horizon variables
- Reads `[typo:role]` tags → binds SAP text styles
- Swaps `◆ICON/name` placeholders → real SAP kit icons
- Runs 4 accessibility validators (WCAG AA contrast · heading hierarchy · tap targets · not-colour-only status)

---

### Step 4 — Connect the SAP Web UI Kit library

**What is a Figma library and why does it matter?**

The SAP Web UI Kit is a Figma file published by SAP containing every official UI component — buttons, tables, headers, status indicators, icons, and the full Horizon token system (colours, spacing, typography). When you enable it as a library in your file, Claude and the plugin can pull real, live components directly from it onto your canvas. Without it, there are no real SAP components to build with — just empty frames.

**How to set it up (one time only):**

1. Open this link and click **"Duplicate to your drafts"**:
   [SAP Web UI Kit — Figma Community](https://www.figma.com/community/file/1494295794601744471)
   *(It's free. Duplicating gives you your own copy in your Figma account.)*

2. Open your copy of the SAP Web UI Kit file in Figma desktop

3. Click the file name at the top → **"Publish styles and components"** → Publish
   *(This makes it available as a library across your files)*

4. In your working Figma file → open the **Assets panel** (grid icon, left sidebar) → click the **book icon** (Libraries) → find SAP Web UI Kit → toggle it **ON**

Now every file where you work has access to the full SAP component set. Claude imports components from it automatically on every build.

> **Most common setup issue:** if Claude reports a component import failure, the SAP Web UI Kit library is either not enabled in the current file or not published. Go back to step 3–4.

---

### Step 5 — Open the canonical screen file

The repo includes `docs/canonical-screens/Claude to Figma SAP Application.fig` — 8 confirmed SAP Fiori screens used as the quality baseline and clone source for every build.

1. Open the `.fig` file in Figma (File → Open → select the file from the repo)
2. Enable the SAP Web UI Kit library in that file (same as Step 4)

Claude uses these screens automatically as reference when building similar screens.

---

### You're ready

Open Claude Code, navigate to this project folder, and describe what you want to build:

> *"Build a Purchase Orders approval screen for desktop"*
> *"Create a mobile list report for field service tasks"*
> *"Design an Object Page for a supplier profile"*

Attach a screenshot or wireframe as reference if you have one. Claude handles the rest — analysis, wireframe for approval, build, token binding.

---


## How It Works — the full pipeline

```
You: "Build a Purchase Orders approval screen"
           │
           ▼
  ┌─────────────────────────────────────────────────┐
  │  ANALYZE                                        │
  │  • Measure reference width (default 1440px)     │
  │  • Sector-by-sector visual reading (A→B→C)      │
  │  • Floorplan scored + confirmed with you        │
  │  • VDI: 7 artifacts, confidence tiers ●○?       │
  └────────────────────┬────────────────────────────┘
                       │
                       ▼
  ┌─────────────────────────────────────────────────┐
  │  PLAN                                           │
  │  • ASCII wireframe — every region, every        │
  │    component. You approve before any build.     │
  │  • L1–L5 layer structure proposed               │
  │  • Clone source selected from canonical .fig    │
  └────────────────────┬────────────────────────────┘
                       │ "approved" ◄─── iterate here (free, instant)
                       ▼
  ┌─────────────────────────────────────────────────┐
  │  EXECUTE  (one use_figma call)                  │
  │  • Parallel import all SAP components           │
  │  • Clone canonical → clear slot → repopulate   │
  │  • Name-tag fills [sapToken] · text [typo:role] │
  │  • Real SAP instances only — never createFrame()│
  └────────────────────┬────────────────────────────┘
                       │
                       ▼
  ┌─────────────────────────────────────────────────┐
  │  VALIDATE  (one screenshot)                     │
  │  • Compare vs reference                         │
  │  • You click "Bind SAP Tokens" in the plugin    │
  │    → live SAP Horizon variables bound           │
  │    → 4 §7 a11y validators run automatically     │
  └────────────────────┬────────────────────────────┘
                       │
                       ▼
  ┌─────────────────────────────────────────────────┐
  │  LEARN                                          │
  │  • "bravo / perfect" → canonical saved          │
  │  • "not right / fix this" → lesson captured     │
  │  • Next similar build recalls the right lesson  │
  └─────────────────────────────────────────────────┘
```

**Nothing gets generated until you say "approved".**
Refinements happen on the ASCII wireframe — free and instant — not after the plugin already built the screen.

---

## Example — what Claude shows you at the PLAN stage

After analysis, Claude presents an ASCII wireframe + component breakdown for your approval **before writing a single line of Figma code.**

```
┌─────────────────────────────────────────────────────────────────┐
│  ShellBar                                                       │
│  [≡]  Purchase Orders          [Search]  [?]  [👤 User ▾]      │
├─────────────────────────────────────────────────────────────────┤
│  DynamicPageTitle                                               │
│  Purchase Orders (142)          [Approve]  [Reject]  [Export ▾] │
├─────────────────────────────────────────────────────────────────┤
│  FilterBar                                                       │
│  [Supplier ▾]  [Status ▾]  [Date range ▾]  [Go]  [Adapt]       │
├─────────────────────────────────────────────────────────────────┤
│  Responsive Table                                               │
│  ☐  │ PO Number  │ Supplier        │ Amount       │ Status      │
│─────┼────────────┼─────────────────┼──────────────┼────────────│
│  ☐  │ 4500012891 │ Acme Corp       │ € 24,500.00  │ ● Pending  │
│  ☐  │ 4500012892 │ GlobalX GmbH    │ € 8,200.00   │ ● Pending  │
│  ☐  │ 4500012893 │ FastLog Ltd     │ € 61,750.00  │ ✔ Approved │
│  ☐  │ 4500012894 │ NordSupply AG   │ € 3,400.00   │ ✘ Rejected │
├─────────────────────────────────────────────────────────────────┤
│  Pagination   [◀]  1 of 12  [▶]                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Components Claude will use to build this screen:**

| Region | SAP Component | Why |
|--------|--------------|-----|
| App shell | `ShellBar` | Top-level navigation, branding, user menu |
| Page title + actions | `DynamicPageTitle` | Title with item count + primary action buttons |
| Filter row | `FilterBar` | Standard SAP filter pattern with Go + Adapt |
| Data | `ResponsiveTable` with `MultiSelectMode` | Best for tabular list data with bulk actions |
| Status column | `ObjectStatus` (`Semantic=Warning/Success/Error`) | Semantic color + icon, theme-switchable token |
| Amount column | `ObjectNumber` | Right-aligned number with currency, SAP typography |
| Row actions | `Button` (Accept / Reject) | Type=Accept / Type=Reject — correct SAP affordance |
| Pagination | `PaginationBar` | Standard SAP paging pattern |

**L1–L5 layer structure:**
```
Purchase Orders
├── Shell Bar                            L2  SAP ShellBar
├── Page Header                          L2  region
│   └── Dynamic Page Title               L3  SAP DynamicPageTitle
│       └── Primary Actions              L4  group
│           ├── Approve Button           L5  SAP Button · Type=Accept
│           ├── Reject Button            L5  SAP Button · Type=Reject
│           └── Export Button            L5  SAP Button · Type=Secondary
├── Filters                              L2  region
│   └── Filter Bar                       L3  SAP FilterBar
│       ├── Supplier Filter              L4  SAP FilterGroupItem
│       ├── Status Filter                L4  SAP FilterGroupItem
│       └── Date Range Filter            L4  SAP FilterGroupItem
├── Main Content                         L2  region
│   └── Responsive Table                 L3  SAP ResponsiveTable
│       ├── PO Number Column             L4  column
│       ├── Supplier Column              L4  column
│       ├── Amount Column                L4  column · SAP ObjectNumber
│       ├── Status Column                L4  column · SAP ObjectStatus
│       └── Row 1                        L4  data row
│           ├── PO Number                L5  text cell
│           ├── Supplier Name            L5  text cell
│           ├── Amount                   L5  SAP ObjectNumber
│           └── Status                   L5  SAP ObjectStatus
└── Footer                               L2  region
    └── Pagination Bar                   L3  SAP PaginationBar
```

You can iterate on any part — change the floorplan, add a column, switch to mobile — before Claude builds anything.

---

## ANALYZE → PLAN → EXECUTE → VALIDATE → LEARN

The methodology behind every build. 14 consecutive failed iterations traced to one root cause: building without analysis first.

| Stage | What happens | Key rule |
|---|---|---|
| **ANALYZE** | `get_design_context` on nearest canonical node · sector-by-sector visual reading · measure reference width · floorplan scored | Never skip |
| **PLAN** | Map content to slot structure · list property keys · identify clone source · propose L1–L5 layer tree | Before any code |
| **EXECUTE** | Single `use_figma` call · Clone-Clear-Repopulate · parallel imports · real SAP instances only | One shot |
| **VALIDATE** | One screenshot · compare vs reference · plugin binds tokens · 4 a11y validators | One shot |
| **LEARN** | Approval → save canonical · correction → capture lesson · next build recalls matching lesson | Every build |

### 3 Hard Build Rules
1. **Real SAP instances only** — every UI element is a real SAP Web UI Kit component. Never a plain frame.
2. **L1–L5 semantic naming** — No `Frame 1`, no `(SAP)` suffix, no redundant nesting. Layers readable without opening any node.
3. **No Spacer frames** — spacing via Auto Layout only (`itemSpacing`, `SPACE_BETWEEN`, `layoutGrow`).

---

## Three-Layer Architecture

Each layer does only what it uniquely can:

```
┌────────────────────────────────────────────────────────────────┐
│  Layer 1 — Claude (Reasoning)                                  │
│  Reads references · runs 30 rules · visual analysis            │
│  Selects floorplan + components · builds via Figma MCP         │
│  QA + self-repair · captures lessons                           │
└───────────────────────────┬────────────────────────────────────┘
                            │ builds screen (one call)
                            ▼
┌────────────────────────────────────────────────────────────────┐
│  Layer 2 — Figma MCP (Execution)                               │
│  Inserts real SAP kit instances                                │
│  Sets variant properties · marks fills and text for binding    │
└───────────────────────────┬────────────────────────────────────┘
                            │ you click "Bind SAP Tokens"
                            ▼
┌────────────────────────────────────────────────────────────────┐
│  Layer 3 — Plugin (Token Bridge)                               │
│  The only piece with access to SAP library variables           │
│  Binds real SAP Horizon tokens (theme-switchable)              │
│  Swaps icon placeholders · binds text styles                   │
│  Runs 4 accessibility validators automatically                 │
└────────────────────────────────────────────────────────────────┘
```

> **Why three layers?** The Figma MCP runs in a sandbox — it can read and write structure, but it cannot access your SAP library's private token variables. Only a real Figma plugin can do that. So Claude builds the structure, the plugin binds the tokens. Each does the one thing only it can do.

---

## Inputs Claude Accepts

| Input | What happens |
|---|---|
| **Text** — user story, Jira ticket, description | Stage 3: extracts persona · task · data · actions · states |
| **Reference image** — screenshot, wireframe, sketch | VDI 7-artifact analysis + sector-by-sector reading (A→B→C). Quality tier assessed first. |
| **Figma URL** — `?node-id=355-39080` | `get_design_context` → exact measurements, the ● confirmed source |
| **Document** — PDF spec, markdown, requirements list | Parsed at Stage 3, merged with Stage 4 |

Image + text → both run, merged. Image only → Stage 2. Text only → Stage 3.

---

## Token Optimization — ~25k → ~3k per build (~88% reduction)

| Cost source | Before | After | How |
|---|---|---|---|
| Reading `code.js` | ~45k tokens | **0** | Hook blocks read · manifest has all keys |
| VDI reference bundle | ~8k/build | ~2k | Consolidated `VDI_REFERENCE.md` (−76%) |
| VDI analysis (repeat image) | ~13.5k | ~0.7k | SHA-1 cache in `semantic-models/` (−96%) |
| Build knowledge | ~15–20k | ~2k | Single `SAP_BUILD_MANIFEST.md` |
| Live iteration loop | 8 calls + 6 shots | 1 call + 1 shot | Analyze before executing |
| Sequential imports | ~2.1s | ~0.5s | `Promise.all` — 3–4× faster |

---

## The Loop — Learning · Improving · Better Ecosystem

The system gets smarter with every session.

```
User: "bravo" / "not perfect" / "close but…" / "great but you broke X"
  │
  ▼ feedback-learn.sh (UserPromptSubmit hook — fires automatically)
  │   • negation guard  ("not perfect" → correction, not praise)
  │   • hedged detection  ("close but", "not quite", "isn't what I meant")
  │   • mixed handling  (praise + correction → one row, asked to disambiguate)
  │   • word-boundaries  ("bad" ≠ "badge", "broke" ≠ "brokerage")
  │
  ▼ writes durable entry → .claude/pending-learnings.jsonl  (survives session)
  │
  ▼ verify-learnings.sh (Stop hook) — re-reminds at turn end if uncaptured
  │
  ▼ surface-learnings.sh (SessionStart) — resurfaces across sessions
  │
  ▼ recall-lessons.sh (UserPromptSubmit) — surfaces the MATCHING lesson
      "build a SideNav" → pulls the SideNav lesson, not all 60 flat
      "purchase order"  → pulls the PO canonical, not generic list-report
```

**Four loops:**
- **A — Per-Edit** `[enforced]` Registry JSON edited → `registry-rebuild.sh` auto-rebuilds the bundle.
- **B — Per-Build** `[enforced]` Turn ends → `lint-on-stop.sh` checks the MCP-first build for unbound state; `manifest-sync-check.sh` guards drift.
- **C — Feedback** `[enforced trigger + durable ledger + guided capture]` Detection, durable write, and cross-session re-reminders are mechanical. Writing the memory file is guided by a persistent, self-surfacing reminder.
- **D — Ground-Truth** `[enforced trigger + guided capture]` Canonical confirmation → `ground-truth-updater` writes exact measurements into `knowledge/guidelines/token-assignment-rules.md`.

> **Honest status:** Loops A & B fully mechanical. C & D have mechanical detection + durable ledger + task-matched recall. The final memory-write is guided — not silent, not fully autonomous.

---

## Canonical Reference Screens

**Included in this repo:** `docs/canonical-screens/Claude to Figma SAP Application.fig`

Open in Figma, enable the SAP Web UI Kit library, and use these screens as clone sources for every build. No private Figma access needed — everything ships with the repo.

| Screen | Confirmed |
|---|---|
| Design System Governance Console (FCL + SideNav + Table) | ✅ |
| Side Navigation (full tree, 20 items) | ✅ |
| Schedule Operation — Daily / Monthly / Monthly+End / Base | ✅ |
| Activities View (List Report + Progress Rows) | ✅ "Perfect" |
| Purchase Orders List Report | ✅ "Bravo" |
| Validate System Log Panel (severity pills) | ✅ |
| Outage List Overview (desktop List Report) | ✅ |
| yanatest Steps (Object Page narrow) | ✅ "Great result!" |

---

## Project Structure

```
/
├── install.sh                      ← one-command setup
├── SAP_BUILD_MANIFEST.md           ← the ONLY file a build reads (~2k tokens)
├── skill/
│   ├── SKILL.md + SYSTEM_PROMPT.md ← 30 RULEs + 80-token whitelist
│   ├── agents/                     ← 8 specialized agents
│   ├── sap-visual-reading/         ← VDI skill: 8 stages + sector-analysis
│   └── references/                 ← figma-build-patterns, canonical-similarity-rubric
├── plugin/figma-builder/
│   ├── manifest.json               ← load this in Figma
│   └── code.bundled.js             ← pre-built, ready to use
├── mcp-servers/                    ← 3 custom MCP servers
├── knowledge/
│   ├── components/registry/        ← 152 component JSONs (source of truth)
│   └── guidelines/                 ← 154 Fiori guideline caches
├── docs/
│   ├── canonical-screens/          ← .fig + .md files + 6 public reference PNGs
│   ├── REPAIR-PATTERNS.md          ← 28 patterns from real failures
│   ├── KNOWLEDGE-INDEX.md          ← what lives where
│   └── OPERATING-MANIFEST.md       ← single authoritative rule map
└── semantic-models/                ← VDI SHA-1 cache (−96% on repeat images)
```

---

## MCP Servers

**5 servers auto-installed by `install.sh`.** 3 optional add-ons.

| MCP | What | Auto? |
|---|---|---|
| `figma` | Live Figma read/write — `get_design_context`, `use_figma`, `get_screenshot` | ✅ (needs token) |
| `chrome-devtools` | Fetch live SAP Fiori guideline pages when local cache is stale | ✅ |
| `sap-fiori-guidelines` | 154 cached Fiori guidelines — offline, fast, official | ✅ |
| `sap-figma-community` | Registry drift detection — catches stale component keys before build failures | ✅ |
| `sap-application-analysis` | Screenshot/wireframe → SAP region types + floorplan scoring | ✅ |
| `sapui5` | Live UI5 API reference — properties, enums (`Semantic` not `State`) | ➖ optional |
| `context7` | Live library docs for correct API signatures | ➖ optional |
| `fundamental-styles` | 120+ CSS components, 1,522 design tokens (edge-case fallback) | ➖ optional |

---

## Skills

| Skill | What |
|---|---|
| `/sap-vdi` | 8-stage Visual Design Intelligence: sector reading, confidence tiers, floorplan scoring, 12-part output |
| `/sap-bind` | End-to-end MCP-first pipeline: VDI cache → wireframe gate → one-shot `use_figma` → bind reminder |
| `/sap-spec-validate` | Registry gate + token whitelist + no raw hex — pre-flight before any build |
| `/sap-registry-update` | Edit registry JSON → rebuild bundle → run regression tests (the ONLY correct way) |

---

## Automation Hooks

Background scripts that keep quality high without manual effort.

| Hook | When | What it does |
|---|---|---|
| `block-codejs-read.sh` | Before any file read | Prevents reading large internal files — keeps builds fast |
| `block-generated-files.sh` | Before any file edit | Prevents accidental edits to auto-generated files |
| `guard-private-screens.sh` | Before any git command | Warns if a private reference screenshot is about to be committed |
| `registry-rebuild.sh` | After registry edit | Auto-rebuilds the component bundle — no manual step needed |
| `manifest-sync-check.sh` | After manifest edit | Catches drift between manifest and registry |
| `feedback-learn.sh` | On every message | Detects approval or correction → logs a durable lesson entry |
| `recall-lessons.sh` | On every message | Surfaces the relevant past lesson when a build task is detected |
| `lint-on-stop.sh` | End of turn | Checks the last build hasn't been left without token binding |
| `verify-learnings.sh` | End of turn | Re-reminds if a captured lesson wasn't written this turn |
| `surface-learnings.sh` | Session start | Resurfaces lessons from previous sessions |

Hooks activate on Claude Code restart.

---

## Health Check

```bash
claude mcp list                              # expect 5+ servers
node build/validate-spec.js output/any.json  # validate a spec
bash build/test-build.sh                     # regression suite (must exit 0)
node build/check-manifest-sync.js           # manifest drift check
```

---

## Key Docs

| Doc | What's in it |
|---|---|
| `SAP_BUILD_MANIFEST.md` | Component keys, token hexes, canonical nodes, naming rules — the only build read |
| `docs/canonical-screens/CANONICAL-SCREENS.md` | All confirmed screens — node IDs, structure, components, patterns |
| `skill/references/figma-build-patterns.md` | Progress Row, DPH clone, post-clone rename checklist, 13+ API gotchas |
| `docs/REPAIR-PATTERNS.md` | 28 repair patterns (P-001 to P-028) from real failures |
| `docs/KNOWLEDGE-INDEX.md` | What lives where — authoritative index |
| `docs/OPERATING-MANIFEST.md` | Single rule map cross-referencing all 30 RULEs |
| `docs/HOOKS-REFERENCE.md` | Hook stdin format, restart requirement |
