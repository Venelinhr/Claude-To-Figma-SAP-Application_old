# SAP Figma Design Agent

**From any reference to a verified, token-bound SAP Fiori screen.**
30 Rules · 5 core MCPs (+3 optional) · 152 Components · 2,391 Plugin LOC · ~3k tokens/build · Self-optimizing

---

## Quick Setup

```bash
git clone https://github.com/Venelinhr/Claude-To-Figma-SAP-Application.git
cd Claude-To-Figma-SAP-Application
./install.sh
```

**After install:**
1. Add Figma API token to `~/.claude/settings.json` → `mcpServers.figma.env.FIGMA_API_TOKEN` — **REQUIRED**
2. Figma → Plugins → Development → Import plugin from manifest → `plugin/figma-builder/manifest.json`
3. Enable SAP Web UI Kit as a library ([free community copy](https://www.figma.com/community/file/1494295794601744471))
4. Restart Claude Code → `claude mcp list` (should show 5+ servers)

> **Your own Figma file:** Canonical screens live in `p7zm5EMBk5DRRZdxNeJ4f5`. Create your own file, connect the SAP Web UI Kit library, and work there.

---

## ANALYZE → PLAN → EXECUTE → VALIDATE → LEARN

The mandatory methodology for every build. 14 consecutive failed iterations traced to one root cause: building without analysis.

| Stage | What | Key rule |
|---|---|---|
| **ANALYZE** | `get_design_context` on closest working node — reveals slot frames, nesting depth, property keys | Never skip |
| **PLAN** | Map content to slot structure, list property keys, identify prototype source (ORIGINAL only) | Before writing any code |
| **EXECUTE** | Single `use_figma` call. Clone-Clear-Repopulate. Parallel imports. Real SAP instances only. | One shot |
| **VALIDATE** | One screenshot. Compare vs reference. Resize if truncated. | One shot |
| **LEARN** | "Bingo / 100% / perfect" → save canonical to memory immediately | Freeze positive feedback |

### 3 Hard Build Rules
1. **Real SAP instances only** — `importComponentSetByKeyAsync` → `.defaultVariant.createInstance()`. Never `createFrame()` for UI.
2. **L1–L5 semantic naming** — No `Frame 1`, no `(SAP)` suffix, no redundant nesting.
3. **No Spacer frames** — use `itemSpacing`, `SPACE_BETWEEN`, `layoutGrow` on real children. Even `Toolbar Fill` = banned.

### SAP Composite Pattern (Clone-Clear-Repopulate)
```js
const ref = figma.getNodeById('699:37890'); // canonical SideNavigation
const clone = ref.clone();
const slot = clone.findOne(n => n.name === '⿻ Navigation Items');
const proto = ref.findOne(n => n.name === 'Navigation Item'); // from ORIGINAL
[...slot.children].forEach(n => n.remove());
const inst = proto.clone();
slot.appendChild(inst);
inst.layoutSizingHorizontal = 'FILL';
inst.setProperties({ '✏️ Text#283293:137': 'Overview', 'Icon#328810:0': iconKey });
```

---

## System Overview

Three layers, each doing only what it uniquely can:

**Layer 1 — Claude (Reasoning):** Reads references, runs 30 rules, runs VDI skill, selects floorplan + components, builds via Figma MCP, QA + self-repair.

**Layer 2 — Figma MCP (Execution):** Inserts real SAP kit instances via parallel `Promise.all` imports, sets variant properties, tags fills `[sapToken]` · text `[typo:role]` · drops `◆ICON/` placeholders.

**Layer 3 — Plugin (Token Bridge):** The ONLY actor with `teamlibrary` permission. Reads tags → binds real SAP Horizon variables. Swaps icon placeholders. Binds text styles. Runs 4 §7 a11y validators.

> **Why this split?** `use_figma` runs in a sandbox without `teamlibrary` permission — it returns 0 variable collections from the SAP kit. Only a real Figma plugin can bind SAP token variables (theme-switchable, audit-clean). Claude+MCP build the structure; the plugin does the one thing only it can do.

---

## How Claude Communicates With Figma

**READ** → `get_design_context(nodeId)` — exact CSS, bound token names, layer tree  
**DECIDE** → VDI analysis + confidence tiers ● confirmed / ○ inferred / ? ambiguous  
**EXECUTE** → `use_figma` one-shot with parallel imports + SAP tag contract  
**VERIFY** → `get_screenshot` — one shot, compare vs reference  
**BIND** → User clicks "Bind SAP Tokens" in plugin

---

## Triggers — How It Starts

| Input | What happens |
|---|---|
| **Text** — user story, Jira, description | Stage 3: extracts persona · task · data · actions · states |
| **Reference image** — screenshot, wireframe | RULE 26 VDI + Stage 2 visual reading. Image quality tier 1–4 assessed first. |
| **Figma URL** — `?node-id=355-39080` | `get_design_context` → exact measurements, the ● confirmed source |
| **Document** — PDF spec, markdown | Parsed via Stage 3, merged with Stage 4 |

The skill adapts: image only → Stage 2 · text only → Stage 3 · image + text → run both, merge at Stage 4.

---

## Token Optimization — ~25k → ~3k per build

~88% reduction. Measured and verified.

| Cost source | Before | After | How |
|---|---|---|---|
| Reading `code.js` | ~45k (×2) | **0** | Hook blocks read · manifest has all keys |
| VDI reference bundle | ~8k/build | ~2k | 6 files → `VDI_REFERENCE.md` (−76%) |
| VDI analysis (repeat image) | ~13.5k | ~0.7k | SHA-1 cache in `semantic-models/` (−96%) |
| Build knowledge (scattered) | ~15–20k | ~2k | Single `SAP_BUILD_MANIFEST.md` |
| Iterative live-fixing | 8 calls + 6 shots | 1 call + 1 shot | Analyze before executing |
| Sequential imports | ~2.1s+ | ~0.5s | `Promise.all` — 3–4× faster |

The waste was never stable rules. It was reading huge files that weren't needed, re-analyzing the same images, and iterating live in Figma. Fix: one small manifest + SHA-1 cache + build right once.

---

## MCP Servers — What Each Does & Why

**5 servers are registered automatically by `install.sh`** (2 official + 3 custom local). 3 more are optional add-ons.

| MCP | Type | Installed by install.sh? | What | Why |
|---|---|---|---|---|
| `figma` | Official | ✅ (needs your token) | Live Figma read/write — `get_design_context`, `use_figma`, `get_screenshot` | The execution engine. Without it there is no build. |
| `chrome-devtools` | Official | ✅ | Web scraping fallback — fetches live SAP Fiori guideline pages | When local cache is stale — fetch the authoritative live source. |
| `sap-fiori-guidelines` | Custom (local) | ✅ | 154 cached Fiori guidelines: when/how to use each component | Powers SAP Compliance check — offline, fast, official |
| `sap-figma-community` | Custom (local) | ✅ | Registry drift detection — detects stale component keys | The SAP kit gets republished. Catches stale keys before build-time failures. |
| `sap-application-analysis` | Custom (local) | ✅ | Screenshot/wireframe → SAP pattern mapping. 30+ region types | Turns a raw image into SAP vocabulary. Powers wireframe gate. |
| `sapui5` | Optional | ➖ add manually | Live UI5 API reference — properties, aggregations, enums | Prevents hallucinated properties. ObjectStatus uses `Semantic` not `State`. |
| `context7` | Optional | ➖ add manually | Live library documentation for correct API signatures | Correct method signatures when writing UI5 code. |
| `fundamental-styles` | Optional | ➖ add manually | 120+ CSS components, 1,522 design tokens | Fallback for edge cases the SAP Web UI Kit registry doesn't cover. |

> The 3 optional servers are not required for the core workflow — the 5 auto-installed servers cover the full build pipeline. Add the optional ones to `~/.claude/settings.json` if you want live UI5 API lookups.

---

## Skills

| Skill | What | Why |
|---|---|---|
| `/sap-vdi` | 8-stage Visual Design Intelligence analysis. 12-part output with confidence tiers, floorplan scoring, interaction model, RCA. | MANDATORY pre-build analysis (RULE 26). Prevents generic output and wrong-floorplan rebuilds. |
| `/sap-bind` | End-to-end MCP-first build: VDI + cache → wireframe gate → manifest-only → one-shot `use_figma` → screenshot → bind reminder. | Orchestrates the whole RULE 25 pipeline with token discipline baked in. |
| `/sap-spec-validate` | Runs `validate-spec.js` headless: registry gate, composition rules, token whitelist, no raw hex. | Pre-flight quality gate before any build. |
| `/sap-registry-update` | Edit component registry JSON, rebuild bundle, run regression tests. | The ONLY correct way to change a component key. |

**Skill pinned to project (2026-07-14):** `skill/sap-visual-reading/` — 12 files, single source of truth. Global `/sap-vdi` points here.

---

## The Plugin — Token Bind Bridge

**2,391 lines. MCP-bind-only. The ONLY teamlibrary actor.**

Three tools:
- **Bind SAP Tokens** — binds `[sapToken]` → SAP Horizon variables, swaps `◆ICON/` → kit icons, binds `[typo:role]` → text styles, runs 4 §7 a11y validators
- **Harvest Icon Keys** — extracts 40-char keys from SAP icon instances on canvas
- **Export Var Keys** — exports Horizon variable keys to `horizon-variable-keys.json`

A11y validators run automatically on every bind: WCAG AA contrast · heading hierarchy · tap targets (44px Cozy / 32px Compact) · not-color-only status.

Plugin LOC history: 10,767 (legacy) → 9,136 (MCP-first migration) → 3,534 (bind-only) → **2,391** (dead-code audit, −33%)

---

## The Loop — Learning · Improving · Better Ecosystem

**A. Per-Edit Loop:** Edit registry JSON → `registry-rebuild.sh` hook fires → bundle rebuilt, tests green.

**B. Per-Build Loop:** New frame → spec-validator + `lint-mcp-frame.js` → RULE 25 tag contract checked → Build → Bind → a11y report.

**C. Feedback Learning Loop (the key one):**
```
User: "bravo" / "wrong" / "not acceptable"
    → feedback-learn.sh hook detects signal
    → Lesson captured to memory (Why + How to apply)
    → Promoted to hard rule if pattern repeats
    → Next build starts with the lesson baked in
```
Every correction becomes a durable memory. The 3 hard rules exist *because* they were corrected repeatedly, then captured. Positive feedback promotes a result to **canonical reference** that seeds future builds.

**D. Post-Build Ground-Truth Loop:** User confirms quality → `get_design_context(nodeId)` reads exact measurements → updates `token-assignment-rules.md` → next session starts smarter.

---

## Canonical Reference Screens — Ground Truth

**Reference file included in this repo:** `docs/canonical-screens/Claude to Figma SAP Application.fig`

Open it in Figma, connect SAP Web UI Kit as a library → use these screens as clone sources for every build.
No private Figma access needed — everything ships with the repo.

The file contains approved SAP Fiori screen examples demonstrating:
- List Report with Progress Rows, DPH, Filter Bar
- Object Page narrow (DPH + IconTabBar + Dialog Header)
- Side Navigation (full tree, expandable groups, active state)
- Log/message panel with severity pills and SegmentedButton filter

### All canonical node IDs (for Claude to reference)

| Screen | Node |
|---|---|
| Design System Governance Console (FCL + SideNav + Table) | `750:177443` |
| Side Navigation (full tree, 20 items, Monitoring selected) | `750:174158` |
| Schedule Operation — Daily / Monthly / Monthly+End / Base | `750:174190/290/786/866` |
| Activities View (List Report + Progress Rows) — *"Perfect"* | `750:174442` / `615:36810` |
| Validate System Log Panel (severity pills) | `750:174814` |
| Outage List Overview (desktop List Report) | `750:174925` |
| yanatest Steps (Object Page narrow) — *"Great result!"* | `560:36552` |
| SideNavigation proto source | `699:37890` |

> Clone source by floorplan: SideNav → `750:174158` · List Report 320px → `615:36810` · Object Page → `560:36552` · Dialog/Form → `750:174190` · Desktop List Report → `750:174925` · FCL + SideNav → `750:177443`

---

## Project Structure

```
/
├── install.sh                      ← one-command setup
├── SAP_BUILD_MANIFEST.md           ← the ONLY file a build reads (~2k tokens)
├── skill/
│   ├── SKILL.md + SYSTEM_PROMPT.md ← 28 RULEs + 80-token whitelist
│   ├── agents/                     ← 7 specialized agents
│   ├── sap-visual-reading/         ← VDI skill, 12 files (pinned 2026-07-14)
│   └── references/figma-build-patterns.md  ← all confirmed patterns + 13 API gotchas
├── plugin/figma-builder/
│   ├── manifest.json               ← load this in Figma
│   └── code.bundled.js             ← pre-built, ready to use
├── mcp-servers/                    ← 3 custom MCP servers
├── knowledge/                      ← 152 registry JSONs, 154 guidelines
├── docs/
│   ├── canonical-screens/          ← 11 PNGs + .md files
│   ├── REPAIR-PATTERNS.md          ← 28 patterns from real failures
│   ├── HOOKS-REFERENCE.md          ← 5 hooks, stdin format, restart note
│   └── HYBRID-MCP-FIRST.md         ← architecture explanation
└── semantic-models/                ← VDI cache (96% saving on repeat)
```

---

## 5 Automation Hooks

| Hook | When fires | Purpose |
|---|---|---|
| `block-codejs-read.sh` | PreToolUse(Read) | Blocks reading `code.js` — redirects to manifest |
| `block-generated-files.sh` | PreToolUse(Edit) | Blocks edits to auto-generated files |
| `registry-rebuild.sh` | PostToolUse(Edit) | Auto-rebuilds bundle on registry change |
| `manifest-sync-check.sh` | PostToolUse(Edit) | Drift check on manifest edit |
| `feedback-learn.sh` | UserPromptSubmit | Detects praise/correction → captures lesson |

Hooks use stdin JSON (`.tool_input.file_path`). Activate on Claude Code restart.

---

## Health Check

```bash
claude mcp list                               # 5+ servers
node build/validate-spec.js output/any.json   # validate a spec
bash build/test-build.sh                      # regression suite
node build/check-manifest-sync.js            # manifest drift
```

---

## Prerequisites

- Node.js ≥ 20 · Claude Code CLI · Figma desktop app
- Figma personal access token ([get one](https://www.figma.com/settings))
- SAP Web UI Kit connected as library ([free](https://www.figma.com/community/file/1494295794601744471))

---

## Key Docs

| Doc | What's in it |
|---|---|
| `SAP_BUILD_MANIFEST.md` | Component keys, token hexes, canonical nodes, naming rules |
| `docs/canonical-screens/CANONICAL-SCREENS.md` | All 11 screens — structure, components, patterns, code |
| `skill/references/figma-build-patterns.md` | Progress Row, DPH clone, SegmentedButton, Form FILL fix, 13 API gotchas |
| `docs/REPAIR-PATTERNS.md` | 28 repair patterns (P-001 to P-028) |
| `docs/HYBRID-MCP-FIRST.md` | Technical architecture explanation |
| `docs/HOOKS-REFERENCE.md` | Hook stdin format, restart requirement |
