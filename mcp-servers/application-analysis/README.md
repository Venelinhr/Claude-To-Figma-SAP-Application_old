# SAP Application Analysis MCP Server (MCP 5)

**Maps user-provided UI references (screenshots, wireframes, sketches) to SAP Fiori patterns, floorplans, and spec drafts.**

The hardest of the five custom MCPs in the project spec — converts loose visual intent into structured SAP specs.

---

## Status — Phase 1

- **Installed**: ✓ Registered with Claude Code as `sap-application-analysis`
- **Connected**: ✓ Health check passes
- **Region patterns**: 30+ region types in controlled vocabulary
- **Floorplan heuristics**: 6 floorplans with scored matching
- **Tools**: 6 exposed
- **Vision integration**: Deferred to phase 2 — caller does vision; this MCP does mapping

## Why phase 1 has no vision model

The original master spec called for "Application Analysis MCP" to identify UI regions from images. We deliberately scoped phase 1 to **not** include vision because:

1. **Claude already has vision** through the standard API — adding another vision model in the MCP duplicates capability
2. **Vision in stdio MCP is hard** — image handling over JSON-RPC is impractical for large images
3. **The mapping logic is the real value** — turning "this looks like a header" into "use ShellBar component" is what the SAP-specific intelligence does
4. **Faster iteration** — text-based contract means we can refine the mapping table without retraining anything

So phase 1: Claude looks at the image and emits controlled-vocabulary region tokens; this MCP maps those to SAP components, suggests floorplans, and assembles a spec draft.

Phase 2 (later): integrate native vision if the controlled-vocabulary handoff proves too lossy.

---

## Tools

| Tool | Purpose |
|---|---|
| `describeWorkflow` | Step-by-step instructions for callers — read this first |
| `listRegionTypes` | The 30+ controlled-vocabulary tokens (e.g. `app-shell-header`, `data-table`) |
| `listFloorplanHeuristics` | All 6 floorplans + required/indicator regions |
| `mapRegionToSAP` | One region → SAP component(s) + visual cues + intent + notes |
| `suggestFloorplan` | Score all floorplans against a region set |
| `buildSpecDraft` | Assemble a partial spec-schema.json from regions |

## Region vocabulary

30+ tokens grouped by floorplan affinity:

- **App shell**: `app-shell-header`, `side-navigation`
- **Page header**: `page-header-with-title`, `page-metadata-band`
- **Navigation**: `tab-navigation`, `breadcrumb-trail`
- **Data**: `data-table`, `table-toolbar`, `simple-list`
- **Forms**: `form-section`, `input-field`, `dropdown-select`, `checkbox-field`, `radio-group`, `toggle-switch`, `date-input`
- **Actions**: `primary-action`, `secondary-action`, `destructive-action`, `icon-action`
- **Feedback**: `status-badge`, `message-banner`, `kpi-tile`, `loading-indicator`
- **Overlays**: `confirmation-modal`
- **Display**: `object-identifier`, `avatar-image`, `tag-label`
- **Filter/search**: `filter-bar`, `search-input`

Each region maps to:
- 1+ SAP components from the registry
- Visual cues (how to recognize it)
- Confidence level (high / medium)
- Plugin notes (where to place, what to watch out for)
- For buttons: the `intent` field (primary-action / secondary-action / destructive)

## Floorplan heuristics

Six SAP Fiori floorplans with scoring rules:

| Floorplan | Required | Strong indicators |
|---|---|---|
| `list-report` | data-table | filter-bar, table-toolbar |
| `object-page` | page-header-with-title | page-metadata-band, tab-navigation |
| `worklist` | data-table, status-badge | primary-action |
| `overview-page` | kpi-tile | (additional kpi-tiles) |
| `wizard` | form-section | primary-action, secondary-action |
| `form-based` | form-section | input-field |

Scoring: required regions present → 10× points per indicator. Missing required → 1× points per indicator (effectively excluded).

## Example workflow

```
User: "Build a screen like this Purchase Order page I'm showing you"
       [pastes screenshot]

Claude (vision): "I see a SAP shell header, page title 'Purchase Order' with breadcrumb
'Integration and APIs', metadata strip with Vendor/Mode/Version, four action
buttons (Save Export Cancel Delete Package), tabs for Header/Overview/
Artifacts(2)/Documents/Tags, then a toolbar 'Artifacts (2)' and a table."

Claude → sap-application-analysis.suggestFloorplan({
  regions: [
    { regionType: "app-shell-header", label: "SAP Integration Suite" },
    { regionType: "page-header-with-title", label: "Purchase Order" },
    { regionType: "page-metadata-band", label: "Vendor: SAP · Mode: Editable · Version: 1.0.0" },
    { regionType: "primary-action", label: "Save" },
    { regionType: "secondary-action", label: "Export" },
    { regionType: "secondary-action", label: "Cancel" },
    { regionType: "destructive-action", label: "Delete Package" },
    { regionType: "tab-navigation", label: "Header / Overview / Artifacts (2) / Documents / Tags" },
    { regionType: "table-toolbar", label: "Artifacts (2)" },
    { regionType: "data-table", label: "Artifacts table" }
  ]
})
→ "[STRONG] object-page — score 30. Required: page-header-with-title; 3/3 indicators match"

Claude: "I'm going to build this as an object-page floorplan. Confirm?"
User: "Yes"

Claude → sap-application-analysis.buildSpecDraft({ regions: [...], screenName: "Purchase Order — Package Detail" })
→ Returns spec-schema.json-shaped draft with hierarchy

Claude → refines the draft (adds slots, props, intent, applies token whitelist)
Claude → presents final spec to user
User pastes to plugin → Validate → Build Screen
```

## How it composes with the other MCPs

| MCP | Used here for |
|---|---|
| `figma` | Reading user's existing Figma file (alternative input) |
| `chrome-devtools` | If user references a live competitor URL |
| `ui5-mcp-server` | Verify SAPUI5 property names while refining the draft |
| `sap-fiori-guidelines` | Look up do/don't rules per component during refinement |
| `sap-figma-community` | Verify Figma keys before plugin build |
| `sap-application-analysis` (this) | Map regions to SAP patterns + draft assembly |

## Limitations

- **No image processing** — caller must describe regions in plain text
- **Controlled vocabulary is fixed** — adding a region type requires editing `region-patterns.js`
- **Floorplan scoring is heuristic** — not ML-based; works well for clear cases, may need user override for hybrid layouts
- **Draft only** — output is a starting point, not a finished spec; caller must refine
- **No nested region awareness** — phase 1 treats regions as a flat list; phase 2 could handle containment hierarchy

## File layout

```
mcp-servers/application-analysis/
├── package.json              — npm metadata, MCP SDK dependency
├── server.js                 — stdio MCP server, 6 tools
├── region-patterns.js        — REGION_PATTERNS + FLOORPLAN_HEURISTICS + scoreFloorplans()
├── node_modules/
└── README.md                 — this file
```

## Phase 2 ideas

- Integrate vision: accept base64 PNG via tool parameter
- Containment hierarchy: regions can have children
- Confidence per region: surface uncertainty for caller to ask user
- Learn from accepted specs: when user accepts a draft, log the mapping for future calibration
- Custom-pattern registration: let teams add region types via JSON config

## Removal

```bash
claude mcp remove sap-application-analysis
```

---

Generated 2026-06-25. Server version 0.1.0 (phase 1).
