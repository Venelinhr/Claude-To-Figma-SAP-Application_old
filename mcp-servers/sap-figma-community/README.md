# SAP Figma Community MCP Server (MCP 3)

**Drift detection and registry maintenance for the SAP Web UI Kit Figma file.**

The SAP Web UI Kit is republished regularly. Component keys, variant property names, exposed text properties, and library version all change. This MCP server detects when the local registry is stale and provides tools to reconcile it with the live Figma library.

---

## Status

- **Installed**: ✓ Registered with Claude Code as `sap-figma-community`
- **Connected**: ✓ Health check passes
- **Registry**: 46/46 components loaded
- **Tools**: 9 exposed

## Why this exists

The plugin's `SAP_KEYS` hardcoded map breaks silently when SAP republishes:

| What changes | Consequence |
|---|---|
| Component set keys | `importComponentSetByKeyAsync()` returns null |
| Variant property names | `setProperties()` throws |
| Variant values | UI looks broken (e.g. `Tertiary` → `Transparent`) |
| Exposed text properties | Text injection fails |
| Component additions | New SAP components missing from registry |
| Component removals | Deprecated entries still tried |
| Library file ID | Whole link breaks |

MCP 3 detects these changes and offers tools to fix them.

## Architecture

```
mcp-servers/sap-figma-community/
├── package.json           — npm metadata; MCP SDK dependency
├── server.js              — stdio MCP server
├── .sync-state.json       — last-known version + sync timestamps
├── node_modules/
└── README.md              — this file

../../knowledge/components/registry/
├── _schema.json
├── Button.json            — 46 component entries
├── …
```

## Architecture flow

```
SAP republishes Web UI Kit Figma file
            ↓
checkRegistryFreshness  ← Claude calls this
            ↓
Detects stale / missing entries
            ↓
listMissingFigmaIds  →  Claude uses figma MCP (search_design_system)
                        to fetch live data for each missing component
            ↓
recordLiveData(componentName, liveData)
  ← MCP 3 diffs against existing entry
            ↓
applySync({ componentName, updates })
  ← MCP 3 writes updated JSON to disk
            ↓
markSynced  → MCP 3 updates lastValidated dates
```

## Tools

| Tool | What it does |
|---|---|
| `getCurrentLibraryVersion` | Last-known SAP Web UI Kit version + sync state |
| `getSAPFigmaFileId` | Canonical Figma file ID for use with figma MCP |
| `getRegistryEntry({ componentName })` | One component's local data + staleness |
| `checkRegistryFreshness({ thresholdDays? })` | List fresh / stale / missing across all 46 |
| `listKnownComponents` | All 46 with freshness icons |
| `listMissingFigmaIds` | Entries needing figmaComponentId lookup |
| `recordLiveData({ componentName, liveData })` | Diff live Figma data against registry |
| `applySync({ componentName, updates, dryRun })` | Write updates to registry JSON |
| `markSynced({ componentName? })` | Set lastValidated; if no name, marks all |

## Example workflow (Claude uses these together)

```
1. Claude: getCurrentLibraryVersion
   → "Last sync: never. SAP Figma file: p7zm5EMBk5...
      Use the figma MCP to check live state."

2. Claude: checkRegistryFreshness
   → "Fresh: 38, Stale: 0, Missing: 8 (Column, ColumnListItem, DynamicPage, ...)"

3. Claude: listMissingFigmaIds
   → "Missing figmaComponentId: Column, ColumnListItem, ..."

4. For each missing → use figma MCP:
   search_design_system(fileKey: "p7zm5EMBk5...", query: "Column")
   → returns componentKey, variants, properties

5. Claude: recordLiveData(componentName: "Column", liveData: {...})
   → "Drift detected: figmaComponentId was empty, now '5142...'
      Variants old vs new..."

6. Claude: applySync(componentName: "Column", updates: {...})
   → "✓ Updated Column.json. Registry reloaded."

7. Claude: markSynced
   → "✓ All 46 entries marked synced."
```

## How it differs from the other 4 MCPs

| MCP | Role |
|---|---|
| `figma` (Figma's official) | Fetch live data from any Figma file (raw access) |
| `ui5-mcp-server` | Get UI5 component API contract (sap.m.Button properties) |
| `sap-fiori-guidelines` | Get design guidance (do/don't, accessibility, when-to-use) |
| `sap-figma-community` (this) | **Track SAP Web UI Kit drift; maintain the local registry** |

Each has a single responsibility. `sap-figma-community` is the only one that **writes** to local files.

## Run manually

```bash
cd mcp-servers/sap-figma-community
node server.js
# stderr:
# [sap-figma-community-mcp] Started.
# [sap-figma-community-mcp] Registry: /…/knowledge/components/registry
# [sap-figma-community-mcp] Loaded 46 components.
# [sap-figma-community-mcp] SAP Figma file ID: p7zm5EMBk5DRRZdxNeJ4f5
```

## When to use

- **Per session**: Claude calls `checkRegistryFreshness` early in a build flow
- **Monthly**: User asks Claude to run a full sync against live Figma
- **After SAP release**: User points Claude at a release note URL; Claude reconciles

## Sync state

`.sync-state.json` (auto-created) tracks:
- `figmaFileId` — the canonical file
- `lastFullSync` — date of last "mark all synced"
- `lastKnownLibraryVersion` — e.g. "1.149.0"
- `lastSeenFingerprint` — a hash representing library state (future use)

## Limitations

This server **does not make HTTP requests to Figma**. That's the figma MCP's job. This server:

1. Reads local registry JSON
2. Provides diff logic
3. Writes updates the caller passes in

The caller (Claude) orchestrates: figma MCP for fetching, this MCP for storage and diff.

## Removal

```bash
claude mcp remove sap-figma-community
```

---

Generated 2026-06-25. Server version 0.1.0.
