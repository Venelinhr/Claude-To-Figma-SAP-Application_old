---
name: july17-session-complete
description: "⭐ 2026-07-17: Full session summary — audit fixes (H1/H2/M1/M2/L2/L3), GitHub cleanup, README overhaul, 30 rules dropdowns, gallery, installation guide, snapshot saved."
metadata:
  node_type: memory
  type: project
  severity: critical
  see_also:
    - july915_recovery_complete
    - feedback_audit_fixes_20260717
    - feedback_procurement_list_report_canonical
  originSessionId: 8f1e0953-d5bb-448c-8c6b-dc4220c65f91
---

# July 17 Session — Complete Summary

**Why:** Prevent the July 9-15 gap from recurring. Everything is documented here.

## What was done (in order)

### 1. Audit fixes executed (all from `/code-review`)
- **H1:** `lint-on-stop.sh` — was dead on MCP-first path (only checked legacy `output/*-spec.json`). Fixed with `.last-build-node` marker.
- **H2:** `recall-lessons.sh` — missing procurement/PO/outage keywords. Added.
- **M1:** `docs/KNOWLEDGE-INDEX.md` — updated to 30 RULEs, added sector-analysis, FEEDBACK-MEMORY-TEMPLATE, width entries.
- **M2:** `docs/OPERATING-MANIFEST.md` — added RULE 30 + sector-based reading, state now "30 RULEs".
- **L2:** `.gitignore` flipped blacklist→allowlist (private-by-default). Added `guard-private-screens.sh` PreToolUse hook.
- **L3:** Post-clone rename checklist added to `figma-build-patterns.md`.
- **Bonus:** `feedback-learn.sh` — fixed `\bcorrect\b` false-positive on imperative "correct the padding".

### 2. GitHub cleanup
- Removed `ARCHITECTURE.html`, `COMPLETE-REFERENCE.html`, `MANAGER-PITCH.html` (junk/orphans).
- Archived 7 stale component prose guides → `knowledge/components/_archive/` (gitignored).
- Force-replaced stale `origin/main` skeleton (month-old, unrelated history) with real 47-commit project.
- Pushed to both `origin` (SAP internal) and `github` (public).
- Added READMEs to `knowledge/design-patterns/`, `knowledge/floorplans/`, `mcp-servers/`, `test-fixtures/`, `docs/`, `knowledge/`.
- Renamed `PROJECT_CONSTITUTION.md` → `CONTRIBUTING.md`.

### 3. README complete overhaul
- Title: `SAP Figma Design Agent` → `Claude to Figma SAP Application`
- Gallery: 3 example screens (Schedule Op, Flight Card, Governance Console) at the top
- Installation: 6-step guide (clone → token → plugin → SAP library → .fig file → verify)
  - Explains WHY Figma token is needed
  - Split Step 4 for external vs internal SAP users (org library vs community duplicate)
  - Step 5: explains the canonical .fig file and how Claude uses it automatically
- Pipeline: merged ANALYZE table into "How It Works", removed duplicate section
- The Loop: removed internal hook code, plain 4-point A/B/C/D format
- 30 Mandatory Rules: full collapsible `<details>` dropdowns, one per rule, plain explanation
- L1-L5 layer tree: proper `├──/└──` tree characters, no redundant nesting
- Removed all internal jargon: node IDs, `[sapToken]` tags, `§7`, `.tool_input.file_path`, JS code snippets
- Added Flight Card as new public PNG (`12-flight-result-card.png`)
- Replaced Schedule Operation thumbnail with higher quality version

### 4. Snapshot saved
`snapshot-20260717-092316-july17-readme-github-cleanup`

### 5. Both remotes in sync
- `origin` = `github.tools.sap/C5408360/sap-fiori-ai-designer`
- `github` = `github.com/Venelinhr/Claude-To-Figma-SAP-Application`
- Both at commit `89e1c83`

## Current system state (verified 2026-07-17)
- 30 mandatory RULEs (highest = RULE 30)
- 152 component registry JSONs
- 154 Fiori guideline caches
- 8 canonical confirmed screens (incl. Purchase Orders 804:44859)
- 10 automation hooks wired in `.claude/settings.json`
- Plugin: 2,391 LOC, MCP-bind-only
- `test-build.sh` exit 0 (3 pass, 0 fail)
- Private PNGs: allowlist model (6 public, rest private by default)

## Key file locations
- Build manifest: `SAP_BUILD_MANIFEST.md`
- All 30 rules: `skill/SYSTEM_PROMPT.md`
- Canonical screens: `docs/canonical-screens/Claude to Figma SAP Application.fig`
- Knowledge index: `docs/KNOWLEDGE-INDEX.md`
- Operating manifest: `docs/OPERATING-MANIFEST.md`
- Hook settings: `.claude/settings.json`
- Repair patterns: `docs/REPAIR-PATTERNS.md` (P-001–P-028)

## How to apply
**Start here** at the next session. All rules, hooks, memory, and canonical screens are in place.
Read `CLAUDE.md` → check `docs/KNOWLEDGE-INDEX.md` → build with `/sap-bind`.
