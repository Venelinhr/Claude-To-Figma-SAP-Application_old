# Hybrid MCP-First Architecture

**Status:** Phase 1 proven 2026-07-10 (demo frame `313:38059` + Schedule Operation `304:38107`: 132 fills bound, 0 raw leaks). RULE 25 is the default execution path.

## Why

The plugin's native renderers (FlexibleColumnLayout, Dialog fallback, SimpleForm, Native*) repeatedly failed to match reference layouts. Building directly via the Figma MCP (`use_figma`) is faster and pixel-accurate. But `use_figma` runs in a sandbox **without `teamlibrary` permission** — it cannot bind SAP token variables, kit icons, or text styles (verified: `figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()` returns **0 collections** from the MCP sandbox). Only the plugin has that permission.

So responsibilities split by capability:

| Layer | Role | Can bind tokens? |
|---|---|---|
| **Claude** | Reason, plan, build structure via `use_figma`, tag layers | — |
| **Figma MCP** | Execute `use_figma` — frames, layout, text, raw hex | ❌ (no teamlibrary) |
| **Plugin** | Read tags, bind SAP variables/icons/text-styles, a11y | ✅ (only actor that can) |

## The bridge: layer names, not JSON

Claude and the plugin never exchange JSON. **The Figma document is the message.** Claude builds real frames and encodes intent in layer names — the only metadata the REST-based `use_figma` can write (`setPluginData` is plugin-sandbox-only, unavailable to MCP).

```
Claude ──use_figma──> frames (raw hex + [tag] names) ──> Figma doc ──> Plugin reads tags ──> binds
```

## Marker conventions

| Marker | On | Meaning | Plugin function |
|---|---|---|---|
| `◆SAP-UNBOUND/<screen>` | root frame name | "bind me" — scan target | `discoverMcpFrames` |
| `<desc> [sapTokenName]` | any node name | bind this exact SAP token | `resolveNameAnnotations` |
| `◆ICON/<icon-name>` | 16×16 FRAME | swap for real kit icon | `swapIconPlaceholders` |
| `<desc> [typo:<role>]` | TEXT node name | bind this SAP text style | `bindTypographyMarkers` |

Icon names ∈ `ICON_KEYS`; typography roles ∈ `SAP_TYPOGRAPHY`; token names ∈ `MANDATORY_TOKENS`.

## The bind pass (`bind-mcp-frame` command)

`plugin/figma-builder/code.js` → `bindMcpFrames()`:

1. `discoverMcpFrames()` — selection first, else scan page for `◆SAP-UNBOUND/` prefix
2. `resolveNameAnnotations(frame)` — bind `[sapToken]` tags directly, strip the tag
3. `enforceTokensAndLayout(frame)` — existing enforcer; RGB→token reverse-lookup for anything untagged
4. `swapIconPlaceholders(frame)` — `◆ICON/` frames → `resolveKitIcon()` instances
5. `bindTypographyMarkers(frame)` — `[typo:]` text → `applyTypography()`
6. Strip `◆SAP-UNBOUND/` prefix, stamp `sapFigmaBuilder.screen` sentinel
7. Report `{ rebound, icons, typographyNodes, rawFills leaks }`

Idempotent: already-bound fills are skipped; re-running is safe.

## The flow (two actions per screen)

```
1. Claude builds via use_figma (exact SAP hex + tags)   ← RULE 25 build contract
2. User selects frame, clicks "Bind SAP Tokens"          ← plugin binds everything
   → every fill = real SAP variable, theme-switchable, audit-clean
```

## Critical rule: real components + exact hex

**Real SAP components, not fake frames (most important).** `use_figma` CAN insert real kit component instances via `figma.importComponentSetByKeyAsync(key)` → `set.defaultVariant.createInstance()` → `inst.setProperties({...})` (verified 2026-07-10). Every interactive/data element (Input, Button, CheckBox, Select, DatePicker, etc.) MUST be a real instance. Plain frames + tags are for layout containers, dividers, and static text only. Note: most kit components are variant SETS — use `importComponentSetByKeyAsync`, not `importComponentByKeyAsync`. Read `inst.componentProperties` to get exact property names (`'Type'`, `'✏️ Text#…'`, `'Check'`, `'Content'`) before setting — never guess.

**Exact hex only.** `use_figma` builds fills with raw hex; the plugin reverse-maps RGB→token by **exact match**. Approximate hex (`#131E26` instead of `#131E29`) becomes a raw-fill leak the plugin cannot bind. Claude MUST use exact `MANDATORY_TOKENS` hex (see RULE 25 table, verified against the live kit) AND tag each node. The tag pass binds even when RGB is off; the exact hex is the belt-and-suspenders.

**Token-tag regex:** `[sapToken]` tags may appear anywhere in a layer name (the plugin's `MCP_TOKEN_TAG = /\[(sap[a-zA-Z0-9_]+)\]/` matches `sap`-prefixed tags anywhere, so a node can carry both `[sapTitleColor] [typo:sectionHeading]`). Fixed 2026-07-10 (was `$`-anchored, missed tokens followed by a typo tag).

## What was deleted / kept (Phase 3)

- **Delete:** FlexibleColumnLayout renderer, Dialog native fallback, Native* renderers, Figma*/Ref79*/Package* custom renderers (~3,500 lines) — MCP builds these better.
- **Keep:** token binding core (`applyFill`, `getVariable`, `enforceTokensAndLayout`, `_rgbToTokenIndex`), icon swap, typography, a11y validators, `checkLibraryConnectivity`, `indexLibraryVariablesOnce`, harvest/scan tools, `SideNavigation` SAP-instance renderer.

## Source of truth

SAP Web UI Kit Figma file `SILcWzK5uFghKun9jx6D7c` + Community `1494295794601744471`. Every token/component/icon/variant verified against it, never guessed (RULE 23).
