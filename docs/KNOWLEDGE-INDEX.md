# Knowledge Index — What You Need → Where It Lives

> **Purpose:** one pointer map so you never re-search across scattered sources. This is an INDEX, not a
> copy — it tells you the authoritative location for each kind of knowledge. Do not duplicate content here.
> When lost, this + RULE 29 (Visual Recovery) get you to ground truth fast.

---

## Build-time knowledge (what a `use_figma` build needs)

| You need... | Authoritative source | Notes |
|---|---|---|
| Component key (`importComponentSetByKeyAsync`) | `SAP_BUILD_MANIFEST.md` §3 | 25 common keys inline; fallback = one `knowledge/components/registry/<Component>.json` |
| Canonical screen to clone from | `SAP_BUILD_MANIFEST.md` §3b | node-ID table + clone-source-by-floorplan |
| Token name + hex | `SAP_BUILD_MANIFEST.md` §4 | `[sapToken]` tags; 25 common tokens inline |
| Typography role → font/size | `SAP_BUILD_MANIFEST.md` §5 + `knowledge/guidelines/token-assignment-rules.md` | `[typo:role]`; all 10 text-style keys in token-assignment-rules |
| Naming hierarchy (L1–L5) | `SAP_BUILD_MANIFEST.md` §2 | + anti-patterns (no Frame 1, no (SAP) suffix) |
| Placeholder / root-frame / name-tag contract | `SAP_BUILD_MANIFEST.md` §6 | `◆ICON/`, `◆SAP-UNBOUND/`, DEMO pill |
| The 3 HARD RULES + FAIL-CLOSED | `SAP_BUILD_MANIFEST.md` §1 | real instances only; no silent createFrame fallback |
| Workflow gates before building | `SAP_BUILD_MANIFEST.md` §1b | VDI (RULE 26) + ASCII (RULE 19) + field FILL |

**The build agent reads `SAP_BUILD_MANIFEST.md` ONLY per build** (+ reference image / cached model). Never `code.js`.

---

## Reference / example knowledge (the quality bar)

| You need... | Authoritative source |
|---|---|
| Canonical `.fig` file (clone source) | `docs/canonical-screens/Claude to Figma SAP Application.fig` |
| 18 complex-screen full breakdowns | `docs/canonical-screens/COMPLEX-SCREENS-REFERENCE.md` (4) + `COMPLEX-SCREENS-CATALOG.md` (14) |
| Per-screen structure (11 numbered) | `docs/canonical-screens/0N-*.md` + `CANONICAL-SCREENS.md` |
| Which canonical to clone for a floorplan | `SAP_BUILD_MANIFEST.md` §3b table + `skill/references/canonical-similarity-rubric.md` (scoring) |
| Raw screenshots (privacy, local only) | `docs/canonical-screens/_private-refs/*.png` (gitignored) |

---

## Rules / methodology knowledge

| You need... | Authoritative source |
|---|---|
| The single operating manifest | `docs/OPERATING-MANIFEST.md` (cross-references everything below) |
| All 30 mandatory RULEs | `skill/SYSTEM_PROMPT.md` (RULE 1–30) |
| The reasoning pipeline (stages) | `docs/V2-REASONING-PIPELINE.md` |
| Visual analysis (8-stage) | `skill/sap-visual-reading/SKILL.md` |
| Sector-based reference reading | `skill/sap-visual-reading/sector-analysis.md` (divide → analyze A→B→C → merge) |
| Measure reference width (RULE 30) | `SAP_BUILD_MANIFEST.md` §1b + `skill/references/figma-build-patterns.md` |
| Floorplan decision | `skill/references/floorplan-decision-matrix.md` |
| Which canonical to clone (similarity score) | `skill/references/canonical-similarity-rubric.md` |
| Build patterns + API gotchas | `skill/references/figma-build-patterns.md` |
| Feedback-lesson template (the ONE contract) | `docs/FEEDBACK-MEMORY-TEMPLATE.md` (pointer: `skill/references/lesson-template.md`) |
| Validation checklist (legacy JSON path) | `skill/references/validation-checklist.md` |
| Repair patterns (P-001–P-028) | `docs/REPAIR-PATTERNS.md` |
| Session-start context | `CLAUDE.md` (gitignored, local) |

---

## Live / MCP knowledge (when local cache insufficient)

| You need... | MCP server | Location |
|---|---|---|
| Fiori design guidelines (154) | `sap-fiori-guidelines` | `mcp-servers/fiori-guidelines/` |
| Registry drift / stale keys | `sap-figma-community` | `mcp-servers/sap-figma-community/` |
| Screenshot → SAP pattern mapping | `sap-application-analysis` | `mcp-servers/application-analysis/` |
| Live Figma read/write | `figma` (official) | — |
| Live SAP Fiori guideline pages | `chrome-devtools` (official) | fallback scraping |

---

## Agents (skill/agents/)

`requirement-analyst` · `reasoning-brain` · `draft-preview` · `component-architect` · `figma-builder` · `qa-certification` · `component-guidance` · `visual-design-intelligence` (8 total).

---

## Validation gates (build/)

| Gate | Script |
|---|---|
| Spec validator (8 checks) | `build/validate-spec.js` |
| MCP frame lint (RULE 25 tag contract) | `build/lint-mcp-frame.js` |
| Regression suite | `build/test-build.sh` |
| Manifest drift | `build/check-manifest-sync.js` |

---

## Decision shortcut
1. Building? → `SAP_BUILD_MANIFEST.md` (the only per-build read)
2. Lost / wrong output? → RULE 29 + `docs/canonical-screens/` (clone the nearest)
3. Need a rule? → `docs/OPERATING-MANIFEST.md` → points to the RULE in SYSTEM_PROMPT.md
4. Need live SAP data? → the MCP servers above
