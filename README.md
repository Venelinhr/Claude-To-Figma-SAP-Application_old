# SAP Figma Design Agent

> Converts business requirements into real SAP Fiori screens in Figma.
> Claude reasons about the design, builds directly via `use_figma`, and the plugin binds live SAP tokens.

---

## What It Is

An AI-powered pipeline that produces complete SAP Fiori screens built from real SAP Web UI Kit instances — not mockups, not placeholders, not native frames painted to look like SAP.

The current workflow is **RULE 25 MCP-first**: Claude builds the screen directly in Figma via `use_figma`, then the plugin's **Bind SAP Tokens** step wires up live design tokens. A legacy JSON spec path exists for bulk standard floorplans but is not the daily workflow.

```
Business requirement (plain language / Jira ticket / screenshot)
    ↓
Claude reads SAP_BUILD_MANIFEST.md + reference image / cached VDI model
    ↓
ASCII wireframe presented — HARD GATE, user approves before build
    ↓
Claude calls use_figma: real SAP kit instances + L1–L5 semantic names + [sapToken] tags
    ↓
Select frame in Figma → run plugin → Bind SAP Tokens
    ↓
Live SAP Fiori screen with bound design tokens on your canvas
```

---

## Prerequisites

| Requirement | Notes |
|---|---|
| Claude Code CLI | `npm install -g @anthropic-ai/claude-code` (Node.js ≥ 20) |
| Figma desktop app | Plugin API requires desktop — browser version does not work |
| SAP Web UI Kit as team library | Figma Community: https://www.figma.com/community/file/1494295794601744471 — duplicate, publish, enable as library in your working file |
| Figma MCP configured | Required for Path 1. Add your Figma personal access token to `~/.claude/settings.json` under `mcpServers.figma` |
| 72 Typeface (optional but recommended) | SAP's proprietary font. Download from the SAP Fiori Resources page, install system-wide, restart Figma |

---

## Quick Setup

```bash
git clone https://github.com/Venelinhr/Claude-To-Figma-SAP-Application.git
cd Claude-To-Figma-SAP-Application
./install.sh
```

The installer copies the Claude skill to `~/.claude/skills/sap-figma-design-agent/`, installs custom MCP servers, and updates `~/.claude/settings.json`.

Restart Claude Code after running the installer so MCP servers load.

---

## Load the Figma Plugin

1. Open **Figma desktop app**
2. Menu → **Plugins → Development → Import plugin from manifest**
3. Navigate to `plugin/figma-builder/` and select `manifest.json`
4. The plugin appears under **Plugins → Development → Claude to Figma SAP Application**

The plugin has three functions: **Bind SAP Tokens**, **Harvest Icon Keys**, and **Export Variable Keys**. The old "Build Screen" button no longer exists — building is done via `use_figma` (Path 1 below).

---

## How to Use — Two Paths

### Path 1: MCP-First (DEFAULT — RULE 25)

Claude builds directly in Figma. The plugin only binds tokens afterward.

**Steps:**

1. Open Claude Code in the project directory
2. Describe your screen in plain language:
   ```
   Build me a SAP List Report for purchase orders.
   Columns: supplier, order date, amount, status.
   User needs to filter by date range and status, and approve in bulk.
   ```
3. Claude presents an ASCII wireframe — review it and approve (or ask for changes). This step is a hard gate; Claude cannot proceed without your approval.
4. Claude builds the screen in Figma via `use_figma` using real SAP kit instances
5. In Figma, select the built frame
6. Run the plugin → click **Bind SAP Tokens**
7. Done — the frame has live SAP design tokens bound

**What Claude guarantees on every build:**
- Real SAP kit instances only (no `createFrame()` for UI components)
- L1–L5 semantic layer naming (no `Frame 1`, `Group`, `Spacer`)
- No raw hex values — only the 80-token SAP semantic whitelist
- Parallel imports (`Promise.all`) for 3–4× faster builds
- §7 accessibility validators run automatically

---

### Path 2: JSON Spec (Legacy / Bulk Floorplans)

Use the `/sap-figma-design-agent` skill. Claude generates a validated JSON spec conforming to `spec-schema.json`.

**When to use this path:** Bulk generation of standard List Report / Worklist / Object Page screens where you want a spec artifact for review before building.

**Note:** The plugin's "Build Screen" button was removed on 2026-07-14. JSON specs are validated by the plugin but must be built via Path 1. This path is retained for spec generation and review only.

---

## Your Figma File

The canonical example screens live in the original developer's file `p7zm5EMBk5DRRZdxNeJ4f5`. You need your own Figma file for new builds.

**Setup:**
1. Create a new Figma design file
2. Assets panel (Shift+I) → Libraries → enable **SAP Web UI Kit**
3. Open Claude Code in the project directory, tell Claude your file URL
4. Claude will build into your file

---

## Canonical Reference Screens

These screens in file `p7zm5EMBk5DRRZdxNeJ4f5` are confirmed quality. Claude references them as ground truth before every build.

| Screen | Node | Status |
|---|---|---|
| Activities View (List Report) | `615:36810` | 2026-07-15 — "Perfect" |
| yanatest Steps (Object Page) | `560:36552` | 2026-07-14 — "Great result!" |
| Schedule Form Step 2 | `709:40690` | 2026-07-14 — confirmed |
| Live Preview Panel | `709:41339` | 2026-07-14 — confirmed |
| SideNavigation (full) | `701:119633` | 2026-07-15 — confirmed |
| SideNavigation (proto source) | `699:37890` | 2026-07-15 — confirmed |

A broader set of 11 benchmark screens lives at nodes `750:174xxx` in the same file — see `docs/` for details.

---

## SAP Floorplan Reference

| Your scenario | Floorplan |
|---|---|
| Personal task queue, process assigned items, bulk actions | Worklist |
| Search across all records, user sets their own filters | List Report |
| Full detail view of one business object, multiple sections | Object Page |
| KPIs, charts, and multiple lists on one dashboard | Overview Page |
| List and detail side by side | Flexible Column Layout (FCL) |
| Multi-step guided process | Wizard |

**Common mistake:** Using List Report for a personal task queue. If the system already knows what the user should see, use Worklist — no FilterBar, no VariantManagement.

---

## Architecture

```
Claude-To-Figma-SAP-Application/
├── SAP_BUILD_MANIFEST.md         ← THE ONLY file a build reads
│                                    (component keys §3, token hex §4, canonical nodes §3b)
│
├── skill/                        ← AI pipeline
│   ├── SKILL.md                  ← main orchestration entry point
│   ├── SYSTEM_PROMPT.md          ← 28 mandatory RULEs + 80-token whitelist
│   ├── agents/                   ← 7 specialized agents
│   │   ├── requirement-analyst.md
│   │   ├── component-architect.md
│   │   ├── figma-builder.md
│   │   └── ...
│   ├── references/
│   │   └── figma-build-patterns.md   ← confirmed build patterns + API gotchas
│   └── sap-visual-reading/       ← Visual Design Intelligence skill (12 files, pinned)
│
├── plugin/figma-builder/         ← Figma plugin (load manifest.json in Figma)
│   ├── manifest.json
│   └── code.js                   ← 2,398 lines — bind tokens, harvest icon keys only
│
├── knowledge/
│   ├── components/registry/      ← 152-component registry (100% enriched)
│   ├── guidelines/               ← 154 guideline JSONs (100% coverage)
│   └── floorplans/
│
├── mcp-servers/                  ← 3 custom MCP servers
│   ├── fiori-guidelines/
│   ├── application-analysis/
│   └── sap-figma-community/
│
├── docs/                         ← Architecture docs
│   ├── HYBRID-MCP-FIRST.md       ← two-path architecture explained
│   ├── REPAIR-PATTERNS.md        ← 28 repair patterns from real failures (P-001–P-028)
│   └── HOOKS-REFERENCE.md
│
├── semantic-models/              ← VDI cache (96% token saving on repeat analysis)
│
├── build/                        ← Build tooling
│   ├── build-registry-bundle.js  ← rebuild plugin bundle after registry edits
│   ├── validate-spec.js
│   └── check-manifest-sync.js
│
└── install.sh                    ← one-command setup
```

**Key principle:** `SAP_BUILD_MANIFEST.md` is the single build knowledge source. Never read `code.js` (~45k tokens), `component-property-reference.json` (136 KB), or `horizon-variable-keys.json` (26 KB) — everything needed is in the manifest.

---

## Key Docs

| File | What it is |
|---|---|
| `SAP_BUILD_MANIFEST.md` | Component keys (§3), token hex values (§4), canonical nodes (§3b) — single build reference |
| `skill/SYSTEM_PROMPT.md` | 28 mandatory RULEs, 80-token whitelist, blocked behaviors |
| `docs/HYBRID-MCP-FIRST.md` | Technical explanation of the two-path architecture |
| `skill/references/figma-build-patterns.md` | All confirmed build patterns, clone-canonical method, API gotchas |
| `docs/REPAIR-PATTERNS.md` | 28 repair patterns from real failures |

---

## Project Health Checks

```bash
# Verify all MCP servers are connected
claude mcp list

# Validate a JSON spec
node build/validate-spec.js output/<spec>.json

# Check manifest vs registry drift
node build/check-manifest-sync.js

# Rebuild plugin bundle (only needed after registry edits)
cd build && node build-registry-bundle.js
# Then in Figma: re-import plugin from manifest.json
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| SAP Web UI Kit not found | Assets (Shift+I) → Libraries → enable SAP Web UI Kit. Must be in same org or duplicated and published. |
| Components render with wrong font | Install the 72 typeface and restart Figma. |
| Plugin not showing latest changes | Re-import from manifest: Plugins → Development → Import plugin from manifest → `plugin/figma-builder/manifest.json` |
| MCP servers not connected | Restart Claude Code after running `./install.sh`. Check `claude mcp list`. |
| Tokens not bound after Bind step | Ensure the SAP Web UI Kit library is connected to your file before binding. |
| `use_figma` builds land off-canvas | Always build below existing content or use x ≥ 15000 isolated zone. Never arbitrary coordinates. |

---

## License

MIT — 2026

*Claude Code + Figma Plugin API + SAP Web UI Kit + use_figma MCP*
