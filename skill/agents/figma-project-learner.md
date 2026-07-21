# Figma Project Learner — Agent Spec

> Pipeline note: the default build path is RULE 25 MCP-first (`use_figma` + plugin bind). This agent's role fits within ANALYZE→PLAN→EXECUTE→VALIDATE→LEARN — it is the LEARN phase (canonical-library discovery), not a build path.

## Purpose

Runs when a user connects their own Figma file for the first time (or when they want to refresh their canonical library). Analyzes the project, discovers approved screens, and builds a personal canonical library in `canonical-index.json` Tier 2.

**Trigger:** User runs `/sap-learn <figma-file-url>` or provides a Figma file URL during first setup.

---

## When to Run

- First-time setup after cloning the repo
- When the user says "learn from my Figma file", "analyze my project", or "connect my design file"
- When `/sap-learn` is invoked with a file URL
- When Tier 2 of `canonical-index.json` is empty and the user wants to build screens

---

## Workflow

### Step 1 — Parse the file URL
Extract `fileKey` from the Figma URL: `https://www.figma.com/design/<fileKey>/...`

### Step 2 — Get file structure
```
get_metadata(fileKey)  → list of pages
```
For each page: `get_metadata(pageId)` → list of top-level frames.

### Step 3 — Analyze each top-level frame
For each frame (limit to frames ≥ 300px wide to skip small components):
```
get_design_context(nodeId)  → exact CSS, components, tokens, layer tree
```

Extract:
- Floorplan type (List Report, Object Page, Dialog, FCL, Card, etc.)
- Width and density (Cozy/Compact)
- Regions present (ShellBar, DynamicPageHeader, FilterBar, Table, etc.)
- Key SAP components used
- Naming conventions
- Token usage patterns
- Auto Layout structure

### Step 4 — Score against Tier 1 canonicals
Using the formula from `canonical-similarity-rubric.md`, score each frame against Tier 1 entries. *(This is the cataloging decision — variant vs. new index entry — distinct from the build-time reuse level emitted by `build/score-canonical.js`: ≥85 L1 · 70-84 L2 · 60-69 L3 · <60 L5.)*
- ≥70% match → identify as a variant of that Tier 1 canonical
- <70% → new pattern (add as standalone Tier 2 entry)

### Step 5 — Build Tier 2 entries
Write discovered canonicals to `canonical-index.json` Tier 2:
```json
{
  "id": "<nodeId>",
  "name": "<frame name>",
  "figmaNode": "<nodeId>",
  "fileKey": "<fileKey>",
  "discoveredDate": "<date>",
  "confirmedBy": "project-learner",
  "floorplan": "<detected>",
  "regions": ["<detected>"],
  "keyComponents": ["<detected>"],
  "width": <measured>,
  "density": "<detected>",
  "inheritsFrom": "<tier1-id or null>"
}
```

### Step 6 — Produce Project Knowledge Summary
Write to `semantic-models/project-knowledge-<fileKey>.md`:

```markdown
# Project Knowledge — <fileKey>

Analyzed: <date>

## Floorplans found
- List Report (N screens)
- Object Page (N screens)
- Dialog (N screens)

## Naming conventions
- L1 naming: <observed pattern>
- Component naming: <observed>

## Token usage
- Background: <token>
- Text: <token>
...

## Approved screens discovered
| Screen | Node | Floorplan | Match |
|--------|------|-----------|-------|
| ... | ... | ... | ...% |

## Canonical library built
N Tier 2 entries written to canonical-index.json
```

### Step 7 — Report to user
```
✅ Project learning complete

Found N screens in <fileKey>
Built N Tier 2 canonical entries

Top canonicals discovered:
• <Name> (node <id>) — <floorplan>, ~<score>% match to <tier1-name>
• ...

Your canonical library is ready. Future builds will:
1. Score your request against these N canonicals via `build/score-canonical.js`
2. Clone the closest match (Level 1–3: ≥85 direct · 70-84 delta · 60-69 floorplan)
3. Only build from scratch (Level 5) when no match ≥60 exists

Next: describe a screen to build, or share a reference image.
```

---

## Token Budget

- `get_metadata` calls: cheap (~100 tokens each)
- `get_design_context` per frame: ~2–5k tokens
- For a typical file with 10–20 frames: ~30–100k tokens total
- Use the VDI SHA-1 cache where possible (`semantic-models/`) to avoid re-analyzing known frames

---

## Output Files

| File | Description |
|------|-------------|
| `skill/references/canonical-index.json` (Tier 2 section) | Personal canonical library |
| `semantic-models/project-knowledge-<fileKey>.md` | Project knowledge summary |

Both files are **gitignored** — personal project knowledge stays local.

---

## Relationship to RULE 31

The Figma Project Learner is the bootstrap step for RULE 31. Without it, RULE 31 falls back to Tier 1 canonicals. After running the learner, RULE 31 uses the user's own project as the canonical library — giving much higher similarity scores and more accurate delta-specs.
