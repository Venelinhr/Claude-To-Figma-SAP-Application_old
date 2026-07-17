# Claude to Figma SAP Application

> Describe a business screen in plain language — or attach a sketch, screenshot, or Figma reference. Claude reads official SAP guidelines, measures the reference, selects components, previews the layout as an ASCII wireframe for your approval, then builds a real SAP Fiori screen directly in Figma — real library components, live tokens, zero manual drag-and-drop. **ANALYZE → PLAN → EXECUTE → VALIDATE → LEARN.**

![Claude to Figma](https://img.shields.io/badge/Claude_to_Figma-SAP_Application-0070F2?style=flat-square)
![Components](https://img.shields.io/badge/SAP_Components-152-brightgreen?style=flat-square)
![Rules](https://img.shields.io/badge/Rules-30_mandatory-orange?style=flat-square)
![Plugin](https://img.shields.io/badge/Plugin-2%2C391_LOC-purple?style=flat-square)
![Tokens/build](https://img.shields.io/badge/~3k_tokens%2Fbuild-88%25_reduction-blue?style=flat-square)

---

## Quick Setup

```bash
git clone https://github.tools.sap/C5408360/sap-fiori-ai-designer.git
cd sap-fiori-ai-designer
./install.sh
```

**Three things to do after install:**

| # | What | Where |
|---|---|---|
| 1 | Add your Figma API token | `~/.claude/settings.json` → `mcpServers.figma.env.FIGMA_API_TOKEN` |
| 2 | Load the plugin in Figma | Plugins → Development → Import from manifest → `plugin/figma-builder/manifest.json` |
| 3 | Enable SAP Web UI Kit as library | [Free community copy](https://www.figma.com/community/file/1494295794601744471) |

Then restart Claude Code and run `claude mcp list` — you should see 5+ servers.

> **Your own Figma file:** Canonical screens live in file `p7zm5EMBk5DRRZdxNeJ4f5`. Create your own file, connect the SAP Web UI Kit library, and work there.

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
  Width: 1440px · Floorplan: List Report · Density: Compact
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
L1  Purchase Orders
L2    Shell Bar                         ← SAP ShellBar instance
L2    Page Header                       ← region
L3      Dynamic Page Title              ← SAP instance
L4        Primary Actions               ← group
L5          Approve Button              ← SAP Button (Type=Accept)
L5          Reject Button               ← SAP Button (Type=Reject)
L5          Export Button               ← SAP Button (Type=Secondary)
L2    Filters                           ← region
L3      Filter Bar                      ← SAP FilterBar instance
L4        Supplier Filter               ← SAP FilterGroupItem
L4        Status Filter                 ← SAP FilterGroupItem
L4        Date Range Filter             ← SAP FilterGroupItem
L2    Main Content                      ← region
L3      Responsive Table                ← SAP instance
L4        PO Number Column              ← column group
L4        Supplier Column               ← column group
L4        Amount Column                 ← column group (ObjectNumber)
L4        Status Column                 ← column group (ObjectStatus)
L4        Row 1                         ← data row
L5          PO Number                   ← text cell
L5          Supplier Name               ← text cell
L5          Amount                      ← SAP ObjectNumber
L5          Status                      ← SAP ObjectStatus
L2    Footer                            ← region
L3      Pagination Bar                  ← SAP PaginationBar instance
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
│  Reads references · runs 30 RULEs · VDI visual analysis        │
│  Selects floorplan + components · builds via Figma MCP         │
│  QA + self-repair · captures lessons                           │
└───────────────────────────┬────────────────────────────────────┘
                            │ use_figma (one-shot)
                            ▼
┌────────────────────────────────────────────────────────────────┐
│  Layer 2 — Figma MCP (Execution)                               │
│  Inserts real SAP kit instances via parallel Promise.all       │
│  Sets variant properties · tags fills [sapToken]               │
│  Tags text [typo:role] · drops ◆ICON/ placeholders            │
└───────────────────────────┬────────────────────────────────────┘
                            │ user clicks "Bind SAP Tokens"
                            ▼
┌────────────────────────────────────────────────────────────────┐
│  Layer 3 — Plugin (Token Bridge)                               │
│  ONLY actor with teamlibrary permission                        │
│  Reads tags → binds SAP Horizon variables (theme-switchable)   │
│  Swaps ◆ICON/ placeholders → kit icons                        │
│  Binds [typo:role] → text styles                               │
│  Runs 4 §7 a11y validators automatically                       │
└────────────────────────────────────────────────────────────────┘
```

> **Why the split?** `use_figma` runs in a sandbox without `teamlibrary` permission — it can't access SAP token variables. Only a real Figma plugin can bind Horizon variables (theme-switchable, audit-clean). Claude+MCP build the structure; the plugin does the one thing only it can do.

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

Open in Figma, connect SAP Web UI Kit as a library → use as clone sources for every build. No private Figma access needed.

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

| Hook | Fires on | Purpose |
|---|---|---|
| `block-codejs-read.sh` | PreToolUse(Read) | Blocks reading `code.js` — saves 45k tokens, redirects to manifest |
| `block-generated-files.sh` | PreToolUse(Edit) | Blocks edits to auto-generated files |
| `guard-private-screens.sh` | PreToolUse(Bash) | Warns when `git add -f` would stage a private canonical PNG |
| `registry-rebuild.sh` | PostToolUse(Edit) | Auto-rebuilds plugin bundle on registry change |
| `manifest-sync-check.sh` | PostToolUse(Edit) | Drift check when manifest is edited |
| `feedback-learn.sh` | UserPromptSubmit | Detects praise/correction → durable lesson entry |
| `recall-lessons.sh` | UserPromptSubmit | Surfaces matching lesson when a build task is detected |
| `lint-on-stop.sh` | Stop | Checks MCP-first build for unbound state (Loop B) |
| `verify-learnings.sh` | Stop | Re-reminds if pending lessons weren't captured this turn |
| `surface-learnings.sh` | SessionStart | Surfaces uncaptured lessons from previous sessions |

Hooks use stdin JSON (`.tool_input.file_path`). Activate on Claude Code restart.

---

## Health Check

```bash
claude mcp list                              # expect 5+ servers
node build/validate-spec.js output/any.json  # validate a spec
bash build/test-build.sh                     # regression suite (must exit 0)
node build/check-manifest-sync.js           # manifest drift check
```

---

## Prerequisites

- Node.js ≥ 20 · Claude Code CLI · Figma desktop app
- Figma personal access token ([get one](https://www.figma.com/settings))
- SAP Web UI Kit connected as library ([free community file](https://www.figma.com/community/file/1494295794601744471))

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
