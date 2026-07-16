# Build — Registry Bundle Pipeline

Generates `plugin/figma-builder/code.bundled.js` from the source code + the local registry.

This is the **single critical workflow** for keeping the Figma plugin in sync with the SAP Web UI Kit. After SAP republishes the library, you edit the registry JSONs and re-run this — no plugin code changes required.

---

## Files

| File | Purpose |
|---|---|
| `build-registry-bundle.js` | Build script — reads registry, writes bundle + bundled plugin |
| `../plugin/figma-builder/registry-bundle.js` | Standalone registry bundle (for inspection/debug) |
| `../plugin/figma-builder/code.bundled.js` | **The file `manifest.json` points to** — bundle + code.js + override shim |

---

## Flow

```
knowledge/components/registry/*.json   (152 source files, you edit these)
              ↓
       build-registry-bundle.js  (run after edits)
              ↓
   registry-bundle.js            (standalone, ~99KB)
              +
       plugin/figma-builder/code.js  (the source; unchanged)
              ↓
   code.bundled.js               (single file, ~278KB — what Figma loads)
```

## Override shim — how registry wins

The bundled output is:

```
[registry-bundle.js content]      ← defines SAP_KEYS_FROM_REGISTRY (38 keys today)
[code.js content]                 ← defines hardcoded SAP_KEYS (73 keys)
[override shim]                   ← merges SAP_KEYS_FROM_REGISTRY over SAP_KEYS
```

Result at runtime:
- Registry keys win for the 38 components with `figmaComponentId`
- Hardcoded values remain for the 35 not in registry (Tree, SegmentedButton, Toast, etc.)
- Console logs: `[SAP Plugin] Registry bundle loaded — 38 keys override hardcoded SAP_KEYS. Bundle version: 2026-06-25`

If the bundle is corrupt or missing, the shim's `try/catch` falls through silently — hardcoded values still work. No regression.

---

## Standard workflow

### After SAP republishes the Web UI Kit

```bash
# 1. Check which entries drifted
# (use sap-figma-community MCP from Claude: checkRegistryFreshness)

# 2. For each drifted component, fetch new metadata via figma MCP

# 3. Update the registry JSON
vim knowledge/components/registry/Button.json
# → change figmaComponentId / supportedVariants / supportedProperties

# 4. Rebuild
cd build
node build-registry-bundle.js

# 5. Re-import plugin in Figma:
#    Plugins → Development → Import plugin from manifest…
#    → select plugin/figma-builder/manifest.json
#    Or close & re-open the existing import
```

### Verify the change

In the plugin console (Figma → Plugins → Development → Show/Hide Console):

```
[SAP Plugin] Registry bundle loaded — 38 keys override hardcoded SAP_KEYS. Bundle version: 2026-06-25
```

If version date isn't today's, the bundle wasn't rebuilt.

---

## Testing the bundle without Figma

```bash
node -e "
global.figma = { showUI:()=>{}, ui:{postMessage:()=>{}}, loadFontAsync:()=>Promise.resolve(),
                 currentPage:{children:[]}, viewport:{center:{x:0,y:0}} };
global.__html__ = '';
const fs = require('fs');
const code = fs.readFileSync('plugin/figma-builder/code.bundled.js', 'utf8');
(new Function(code + ';global.SAP_KEYS=SAP_KEYS;'))();
console.log('SAP_KEYS has', Object.keys(global.SAP_KEYS).length, 'entries');
console.log('Button =', global.SAP_KEYS.Button);
"
```

Should print (counts vary as the registry grows — run `node build/check-manifest-sync.js`
to verify keys/tokens are in sync rather than matching an exact number here):

```
[SAP Plugin] Registry bundle loaded — <N> keys override hardcoded SAP_KEYS. Bundle version: <date>
SAP_KEYS has <N> entries
Button = 91805fa199b1fd247d76a9c08bbe0982b49065c4
```

---

## Bundle contents

`registry-bundle.js` emits three globals:

| Global | Type | Purpose |
|---|---|---|
| `SAP_REGISTRY` | `{ name → fullEntry }` | Complete metadata: variants, properties, color rules, typography, plugin notes |
| `SAP_KEYS_FROM_REGISTRY` | `{ name → figmaComponentId }` | Key map merged into `SAP_KEYS` by the override shim |
| `SAP_REGISTRY_VERSION` | ISO date string | When the bundle was last built |

Plugin code can read `SAP_REGISTRY` directly for richer queries (e.g. "what variants does Button expose?") — currently we use only `SAP_KEYS_FROM_REGISTRY`, but future enhancements can drop the hardcoded variant maps in favor of registry data.

---

## Why not load registry at runtime?

Figma plugins are **sandboxed** — no `fs`, no `fetch` to local files, no `require()`. The only way to make the registry available is to bundle it into the JS that `manifest.json` points to. This build script does that.

---

## Maintenance checklist

When you edit a registry JSON:

- [ ] Validate the schema (every required field present)
- [ ] Verify `figmaComponentId` is real (test via `figma` MCP `search_design_system`)
- [ ] Run `node build/build-registry-bundle.js`
- [ ] Re-import the plugin in Figma
- [ ] Open plugin console — verify version date is today
- [ ] Build a test screen — verify the changed component renders correctly

---

Generated 2026-06-25.
