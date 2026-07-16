# SAP Web UI Kit — Canonical Source of Truth (icons + everything)

**File key:** `SILcWzK5uFghKun9jx6D7c` — the SAP Web UI Kit (published library).
**Iconography page:** `2:4` (`❖ Iconography` → `SAP Icons` frame, 1000+ icon components).

The SAP Web UI Kit is the **single source of truth** for the whole pipeline:
components, properties, tokens, variables, variants, AND icons. Never invent a
component, property, token, or icon that isn't in the kit. Verify against the kit
before mapping.

---

## Icons — how the swap works

SAP icons are published library **COMPONENT**s. Each has:
- a **node ID** in the kit file (e.g. `wrench` = `1096:2325`)
- a **40-char component key** (needed by `figma.importComponentByKeyAsync`)

A Button / Navigation Item exposes its icon as an **INSTANCE_SWAP** component
property (e.g. Button `Icon#112533:487`, Navigation Item `Icon#328810:0`).
To set an icon you:

```js
const comp = await figma.importComponentByKeyAsync(ICON_KEYS[name].key);
hostInstance.setProperties({ 'Icon#112533:487': comp.id });   // swap
```

This is implemented in `plugin/figma-builder/code.js`:
- `ICON_KEYS` — `name → { key, kitNode }` map (the icon registry)
- `resolveKitIcon(iconRef)` — imports the kit icon by key, cached per build
- `swapKitIcon(hostInstance, iconRef)` — finds the INSTANCE_SWAP prop, enables
  the `Icon Left` boolean, swaps to the resolved kit icon. **Single canonical
  icon path — every handler that sets an icon goes through it.**

Both the SideNavigation menu-item handler and the DynamicPageTitle button
builder call `swapKitIcon()`; if the key is unknown they fall back to the alias
table and log `icon-key-unknown`.

---

## The KEY constraint (important)

The Figma MCP read tools (`get_design_context`, `get_metadata`,
`get_code_connect_map`) and the `teamLibrary` API in the `use_figma` plugin
context **do NOT expose component keys** for library nodes. Remote library
components import as leaf nodes with no parent, so siblings can't be enumerated.

**The only way to obtain a key is from an INSTANCE already present in a file:**
```js
const mc = await instance.getMainComponentAsync();
mc.key   // ← the published component key
```

### Harvest workflow (permanent fix path)
1. In Figma, drop one instance of each needed icon onto the canvas (Assets panel
   → search the kit → drag). Or build a screen that already uses them.
2. Click the **"Harvest Icon Keys"** button in the plugin UI (or send
   `{ type: 'harvest-icon-keys' }`). The plugin scans every `Icon` instance on
   the page, reads `getMainComponentAsync().key`, and posts a ready-to-paste
   `name: { key: '…', kitNode: null }` block.
3. Paste those lines into `ICON_KEYS` in `code.js`, rebuild the bundle.
4. From then on, `sap-icon://<name>` in any spec resolves to the real kit icon
   automatically on every build.

---

## Confirmed icon node IDs (from kit page 2:4) — keys harvested as available

| Icon          | Kit node ID | Key status |
|---------------|-------------|------------|
| wrench        | 1096:2325   | ✅ `75f0fa42efe3014f303b55ca1b4f37552f592af1` |
| legend        | 1105:2456   | ⏳ needs harvest |
| multi-select  | 1105:2511   | ⏳ needs harvest |
| group         | 1095:2441   | ⏳ needs harvest |
| add           | 1016:2382   | ⏳ needs harvest |
| globe         | (n/a)       | ✅ `ff1de89f036f7aef09afe2d157fc3bd9206cee7f` |
| home          | (n/a)       | ✅ `ddf4537c2f792179f11f64cae869cd1241e5ec7e` |

To re-harvest a node's key by hand: instantiate that icon in the file, run
Harvest Icon Keys.

---

## Outage List Overview — required icons
- Menu (top→bottom): **legend**, **multi-select**, **wrench**
- Header buttons (left→right): **group**, **wrench**, **add**

Related: [[reference_sap_variant_property_names]] · `docs/REPAIR-PATTERNS.md`
P-024/P-025 · `knowledge/guidelines/figma-library-map.md`.
