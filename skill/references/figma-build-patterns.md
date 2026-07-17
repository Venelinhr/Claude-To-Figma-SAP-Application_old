# Figma Build Patterns

Read this file BEFORE any `use_figma` build — it is the pattern library for the RULE 25 / 28 / 29
MCP-first default path (Claude builds real SAP instances directly, plugin binds tokens). These are
hard-won lessons — each corresponds to a real failure mode in the Figma Plugin API or SAP library.
(Historically read by the figma-builder agent at Step 6 of the now-legacy JSON-spec path; still valid there.)

---

## ⭐ WHEN LOST — Visual Recovery Protocol (RULE 29)

**If output is wrong, guessing is happening, or user says "that's not right" — STOP and do this:**

```
1. STOP. Do not retry. Do not guess.
2. Open docs/canonical-screens/Claude to Figma SAP Application.fig in Figma
3. Call get_design_context on the closest canonical node (table below)
4. Read the reference PNG from docs/canonical-screens/
5. Extract ground truth: component names, layer structure, token names, slot frames
6. NOW build — clone from canonical, one use_figma call, never from scratch
```

| Building... | Read this node first |
|---|---|
| List Report / list items / progress | `615:36810` Activities View |
| Object Page narrow / DPH / IconTabBar | `560:36552` yanatest Steps |
| SideNavigation | `699:37890` |
| Dialog / Form / date+time fields | `750:174190` Schedule Op Daily |
| Log panel / severity pills | `750:174814` Validate System |
| Desktop List Report / status pills | `750:174925` Outage List |
| Full app / FCL + SideNav + Table | `750:177443` Governance Console |

**The .fig file IS the answer. Reading it takes 30 seconds. Re-building wrong takes 30 minutes.**

---

## ⭐ AFTER YOU CLONE — Post-Clone Rename & Cleanup Checklist (RULE 2 + RULE 28)

Cloning a canonical node inherits its **internal frame names verbatim**. When you repurpose those frames for a different screen, the names lie: on the Purchase Orders build (804:44859) cloned from Activities View, a frame still named `Progress Row` held an **Amount**, and `Activity Number Row` held a **Supplier**. A misleading layer name violates RULE 2 (semantic naming) and misleads the next person who opens the file.

**Run this checklist immediately after the clone's content pass, before reporting the node ID:**

1. **Rename the root** to the new screen's L1 name — never leave the source screen's name (`Activities View` → `Purchase Orders`).
2. **Walk every repurposed frame** and rename to its NEW role:
   - `Progress Row` holding an amount → `Amount Row`
   - `Activity Number Row` holding a supplier → `Supplier Row`
   - Any L4/L5 whose content changed → name for what it now shows.
3. **Leave untouched** frames that kept their original role AND real SAP component instances (`Object Status`, `Dynamic Page Header`, `Filter Bar` — preserve official kit names, RULE 2).
4. **Find by content, not by name.** Clone re-IDs internals, so target the frame via `findOne`/`findAll` on its text characters or child, not a stale name string.
5. **Verify:** every layer name reads true without opening the node. No `Frame N`, `Group`, `Rectangle`, no source-screen leftovers, no `[sapToken]`/`[typo:]` tags in final names.

> Skipping this = a technically-correct screen with lying layer names. It passes visually and fails the naming audit. Confirmed cost on 804:44859.

---

## Critical Figma Plugin API rules

These must be followed in the plugin's `code.js`. Violating them causes silent failures or
incorrect builds that look right but break on inspection.

### 1. Load fonts before setting text characters
```javascript
// WRONG — will silently fail or throw
textNode.characters = "My Label";

// CORRECT
await figma.loadFontAsync({ family: "72", style: "Regular" });
textNode.characters = "My Label";
```
The SAP Fiori kit uses the "72" font family. Load it before any `.characters` assignment.
For multiple text nodes, load all fonts in parallel before any assignment:
```javascript
await Promise.all([
  figma.loadFontAsync({ family: "72", style: "Regular" }),
  figma.loadFontAsync({ family: "72", style: "Bold" }),
  figma.loadFontAsync({ family: "72", style: "Semi Bold" }), // ← space required, not "SemiBold"
]);
```

### 2. Set auto layout sizing AFTER appending children
```javascript
// WRONG — sizing mode set before children exist
frame.layoutSizingHorizontal = "HUG";
frame.appendChild(child);

// CORRECT
frame.appendChild(child);
frame.layoutSizingHorizontal = "HUG"; // now it has content to hug
```
Apply `layoutSizingHorizontal` and `layoutSizingVertical` only after all children are appended.

### 3. Variable binding returns a new paint — never mutate in place
```javascript
// WRONG — mutation, the binding is lost
node.fills[0] = figma.variables.setBoundVariableForPaint(node.fills[0], 'color', variable);

// CORRECT — replace the entire fills array
node.fills = node.fills.map(paint =>
  figma.variables.setBoundVariableForPaint(paint, 'color', variable)
);
```

### 4. Set placeholder fill BEFORE binding a variable
```javascript
// WRONG — binding to a node with no fill
figma.variables.setBoundVariableForPaint(...);

// CORRECT — set a placeholder fill first, then bind
node.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }];
node.fills = node.fills.map(p => figma.variables.setBoundVariableForPaint(p, 'color', variable));
```

### 5. Disable layoutMode BEFORE repositioning component sets
```javascript
// WRONG — repositioning inside auto layout has no effect
componentSet.x = 100;

// CORRECT
componentSet.layoutMode = "NONE";
componentSet.x = 100;
componentSet.y = 200;
```

### 6. Focus rings: override the state layer, never detach
When a library component's focus ring appears incorrectly:
- Select the instance → right-click → "Edit component" is wrong
- Correct: select the instance → in the right panel find the boolean/state property → set `Focused: true`
- Never detach an instance to fix visual states — you lose library updates

### 7. Build top-down, not bottom-up
```
1. Create root frame (1440 × 900px for desktop)
2. Insert ShellBar (always first, always at root level)
3. Insert DynamicPage (always second)
4. Insert DynamicPageTitle into title slot
5. Insert DynamicPageHeader into header slot (if List Report)
6. Insert FilterBar into DynamicPageHeader (if List Report)
7. Insert Table into content slot
8. Insert OverflowToolbar into table headerToolbar slot
9. Insert columns, items last
```
Building bottom-up (columns before table, table before page) creates layout calculation errors.

### 8. Duplicate rows, don't regenerate
When building table rows with `repeat`:
```javascript
// WRONG — regenerate from scratch each time (slow, font reload required)
for (let i = 0; i < repeat; i++) { createRowFromScratch(i); }

// CORRECT — create one row, clone it, update content
const firstRow = await buildNode(rowSpec, screenConfig);
for (let i = 1; i < repeat; i++) {
  const clone = firstRow.clone();
  applySampleData(clone, rowSpec.sampleData, i);
  tableFrame.appendChild(clone);
}
```

---

## Canonical frame dimensions

| Viewport | Frame width | Frame height | ShellBar height |
|---|---|---|---|
| Desktop | 1440px | 900px | 44px |
| Tablet | 1024px | 768px | 44px |
| Mobile | 375px | 812px | 44px |

ShellBar height is **always 44px** — it does not change with density.

## Control heights by density

| Control type | Cozy | Compact |
|---|---|---|
| Input, Select, Button | 44px | 26px |
| Table row | 48px | 32px |
| Toolbar / OverflowToolbar | 44px | 36px |
| FilterBar | 48px (1 row) | 36px (1 row) |

## Content margins by breakpoint

| Breakpoint | Horizontal margin | Applied by |
|---|---|---|
| Desktop (≥1024px) | 2rem (32px) | DynamicPage automatically |
| Tablet (600–1023px) | 1rem (16px) | DynamicPage automatically |
| Mobile (<600px) | 0.5rem (8px) | DynamicPage automatically |

DynamicPage handles content margins automatically. Do not set manual padding on content frames.

---

## SAP spacing steps

Only use these values for spacing — never arbitrary pixel values:

`4px · 8px · 16px · 32px · 48px`

In the JSON spec, spacing is expressed semantically (density mode), not as pixel values.
The plugin resolves spacing from the connected SAP library tokens.

---

## Realistic content rules

**Never use:**
- Lorem ipsum text
- "Test", "Sample", "Example" as field values
- Sequential numbers (1, 2, 3) for IDs
- `user@email.com` as a sample email

**Always use:**
- PO numbers: `4500012345` format (10 digits, starts with 4 or 5)
- Supplier names: real-sounding German/European company names (`Müller GmbH`, `TechCorp AG`)
- Amounts: realistic EUR values with 2 decimal places (`1,250.00 EUR`)
- Dates: recent realistic dates in the right format for the locale
- Status values: a mix that shows the semantic range (`Pending`, `Approved`, `Rejected`)
- Names: diverse, realistic (`Maria Schmidt`, `James Park`, `Priya Nair`)

---

## Fallback: precise creation plan format

When the Figma plugin is unavailable or the library is not connected,
the figma-builder agent delivers this structured creation plan instead of a JSON spec:

```markdown
## Figma Creation Plan — [Screen Name]

**Frame:** 1440 × 900px, Fill: sapBackgroundColor

**Layer 1 — ShellBar**
- Library instance: Shell Bar/Default
- Props: productName="[App Name]", showNotifications=true
- Position: x=0, y=0, width=1440, height=44

**Layer 2 — DynamicPage**
- Library instance: Dynamic Page/Default
- Position: x=0, y=44, width=1440, height=856
- [continue for each layer...]

**Data to fill:**
- Table row 1: PO "4500012345", Supplier "Müller GmbH", Amount "1,250.00 EUR", Status "Pending" (Warning)
- Table row 2: ...
```

This plan format is human-executable in Figma and machine-parseable for future automation.

---

## Progress Row — Canonical Pattern (confirmed 2026-07-15, user: "Perfect")

**Screen:** Activities View `615:36810` · List Report, 320px

### ✅ CORRECT — native green frame (use this)
```js
const bar = figma.createFrame();
bar.name = 'Progress Bar';
bar.fills = [{type:'SOLID', color:{r:0.118, g:0.561, b:0.337}}]; // sapPositiveElementColor
bar.resize(40, 12);
bar.cornerRadius = 6;
```
Then add an `ObjectStatus` instance beside it for the checkmark:
```js
const osSet = await figma.importComponentSetByKeyAsync('748d609ead5d4a246d7cd7c144b94b518c467e58');
const os = osSet.defaultVariant.createInstance();
os.setProperties({'Semantic':'Success','Inverted':'No','Large Design':'No','Form Factor':'Compact'});
// hide all text nodes inside for icon-only display
const texts = os.findAll(n => n.type === 'TEXT');
for (const t of texts) { t.visible = false; }
```

### ❌ WRONG — do NOT use SAP ProgressIndicator composite
- Its internal bar is driven by `'✏️ Progress Bar'` text prop — unreliable via setProperties
- Internal fill percentage can't be resized via sublayer access
- Looks correct in kit but renders incorrectly when configured via API
- **Always use the native green frame above instead**

### Full Progress Row layout
```
Progress Row (HORIZONTAL auto-layout, FILL width, itemSpacing=8)
├── "Progress:" Label [typo:label]
├── "100%" Label [typo:label-emphasized]  
├── Progress Bar (native frame, 40×12, cornerRadius=6, green fill)
└── ObjectStatus (Semantic=Success, icon-only, text nodes hidden)
```

---

## ObjectStatus Icon-Only Pattern (confirmed 2026-07-14/15)

```js
// Import
const osSet = await figma.importComponentSetByKeyAsync('748d609ead5d4a246d7cd7c144b94b518c467e58');
const os = osSet.defaultVariant.createInstance();

// STEP 1: setProperties BEFORE reading sublayer nodes (P-023)
os.setProperties({'Semantic':'Success','Inverted':'No','Large Design':'No','Form Factor':'Compact'});

// STEP 2: hide all text nodes for icon-only display
const texts = os.findAll(n => n.type === 'TEXT');
for (const t of texts) { t.visible = false; }
// Result: green checkmark icon only, no label text
```

**Valid Semantic values:** `None` / `Success` / `Warning` / `Error` / `Information`
**❌ WRONG props:** Do NOT pass `Form Factor` = anything except `Compact`/`Cozy`. Do NOT pass `State` — that prop doesn't exist.

---

## DynamicPageHeader (DPH) — Clone and Strip Pattern

**Context:** Real sap.f DPH ships heavy at 1440px with breadcrumbs, KPIs, toolbar rows. At 320px narrow it needs ~40–52 sublayer hides to clean to a simple title+subtitle header.

### ✅ CORRECT method
```js
// Clone from clean existing DPH (do NOT import fresh — the clone already has SAP tokens)
const srcDPH = figma.getNodeById('601:36910'); // clean yanatest DPH
const dph = srcDPH.clone();
screen.insertChild(0, dph);
dph.layoutSizingHorizontal = 'FILL';
```

### Strip steps (at 320px narrow)
1. Hide `Breadcrumb and Navigation` frame
2. Hide `Header Content Area` (collapsible tall zone)
3. Inside `Page Title and Actions`: hide `Toolbar` (renders as full-width row)
4. Inside `Title Area`: hide all Breadcrumb instances, KPI instances, action instances
5. Find H1 = **biggest `fontSize` text node** (NOT by name — find by `Math.max(fontSize)`)
6. Set H1 text → your title
7. Set subtitle text node
8. **Set `Title Area itemSpacing = 4`** — SAP standard rhythm. Default is 0 → causes title/subtitle overlap

### Overflow menu (three-dots top-right)
`appendChild` into a DPH instance throws: `"Cannot move node inside of an instance"`. The DPH's internals are locked.

**✅ CORRECT fix:**
```js
const ibSet = await figma.importComponentSetByKeyAsync('c1ee1ca76974c720ecd4b1888e1e23ac8a36ec63');
const btn = ibSet.defaultVariant.createInstance();
btn.setProperties({'Form Factor':'Compact','Interaction State':'Regular'});
// swap icon to overflow/more icon
const ico = await figma.importComponentByKeyAsync('6a0c2f0be4be541cc17870a7a633b19e3cb2d1df');
const swapProp = Object.keys(btn.componentProperties).find(k => k.includes('icon') || k.includes('Icon'));
if (swapProp) btn.setProperties({[swapProp]: ico.id});
// place as ABSOLUTE sibling of DPH inside screen frame
screen.appendChild(btn);
btn.layoutPositioning = 'ABSOLUTE';
btn.x = screenWidth - btn.width - 8;
btn.y = 10;
```

**❌ WRONG:** trying to appendChild inside the DPH instance, or using `figma.createFrame()` for this button.

---

## IconTabBar — Active Tab Selection (confirmed 2026-07-14)

**Failure:** First tab renders with blue underline; correct tab should be selected.
**Root cause:** Default DPH state has first tab active. Must explicitly set each tab's Interaction State.

### ✅ CORRECT
```js
// Find tab instances by walking up from their TEXT nodes
const allTexts = itb.findAll(n => n.type === 'TEXT');
for (const t of allTexts) {
  // walk up to find INSTANCE parent
  let node = t.parent;
  while (node && node.type !== 'INSTANCE') node = node.parent;
  if (!node) continue;
  
  if (t.characters === 'General') {
    node.setProperties({'Interaction State': 'Regular Inactive'});
  } else if (t.characters === 'Steps') {
    node.setProperties({'Interaction State': 'Regular Active'});
  }
}
```

**Valid Interaction State values:** `Regular Active` / `Regular Inactive` / `Hover` / `Focused`
**❌ WRONG:** setting text color, stroke, or background directly — use `Interaction State` only.

---

## SAP Toolbar Composite — WARNING (confirmed 2026-07-14)

**Problem:** Real `sap.m.Toolbar` / `sap.m.OverflowToolbar` component injects its own "Create / Copy / Paste" chrome and has no `title` prop accessible via setProperties.

**✅ CORRECT for custom toolbar rows (title + icon buttons only):**
```js
// Use: real SAP Label + real SAP IconButtons in an auto-layout frame
const row = figma.createFrame();
row.name = 'Toolbar'; // L3 name
row.layoutMode = 'HORIZONTAL';
row.primaryAxisAlignItems = 'SPACE_BETWEEN';
row.layoutSizingHorizontal = 'FILL';
// Left: SAP Label instance
const lbl = lblSet.defaultVariant.createInstance();
// Right: SAP IconButton cluster
const actions = figma.createFrame();
actions.name = 'Toolbar Actions';
actions.layoutMode = 'HORIZONTAL';
```

**✅ Use REAL Toolbar component only when:** you need the full OverflowToolbar slot machinery (action items with overflow into "`...`" menu).

---

## Complex Screen Strategy — Skeleton + Content Split (confirmed 2026-07-14)

For screens with 8+ components, split into 2 `use_figma` calls:

**Call 1 — Skeleton (place zones):**
```js
// Import ALL components in one Promise.all (3-4× faster)
const [dphC, itbC, btnC, ibC, selC, inpC, lblC, osC, oaC] = await Promise.all([
  figma.importComponentSetByKeyAsync(K.DynamicPageHeader),
  figma.importComponentSetByKeyAsync(K.IconTabBar),
  figma.importComponentSetByKeyAsync(K.Button),
  figma.importComponentSetByKeyAsync(K.IconButton),
  figma.importComponentSetByKeyAsync(K.Select),
  figma.importComponentSetByKeyAsync(K.Input),
  figma.importComponentSetByKeyAsync(K.Label),
  figma.importComponentSetByKeyAsync(K.ObjectStatus),
  figma.importComponentSetByKeyAsync(K.ObjectAttribute),
]);
// Place instances with placeholder names — no text injection yet
```

**Call 2 — Content (inject text/variants):**
```js
// Read node IDs from Call 1 result, inject content
const h1 = figma.getNodeById(titleNodeId);
await figma.loadFontAsync({family:'72', style:'Bold'});
h1.characters = 'My Screen Title';
// set variant props, fill meta rows, etc.
```

**Why:** Smaller code blocks → fewer model token errors → less iteration. Confirmed ~25k→5k token reduction.

**Also:** Reuse pre-imported compSet for multiple instances:
```js
// ✅ CORRECT — reuse compSet
const inst1 = btnC.defaultVariant.createInstance();
const inst2 = btnC.defaultVariant.createInstance();
// ❌ WRONG — re-import per instance
const inst1 = (await figma.importComponentSetByKeyAsync(K.Button)).defaultVariant.createInstance();
const inst2 = (await figma.importComponentSetByKeyAsync(K.Button)).defaultVariant.createInstance();
```

---

## Form Field FILL Fix — Full 3-Level Procedure (confirmed 2026-07-11)

**Problem:** SAP kit field components (Input, DatePicker, Select, ComboBox) ship with hardcoded native width ~250–272px and `layoutSizingHorizontal='FIXED'`. Dropped into a narrower column they overflow — cropped sliver on right edge.

**Root cause of SILENT FAIL:** Setting `picker.layoutSizingHorizontal='FILL'` SILENTLY FAILS when the picker's parent column is `HUG`-width (`counterAxisSizingMode='AUTO'`). A HUG column has no fixed width to fill to, so FILL is rejected and picker stays at 272px.

### ✅ CORRECT — 3-level fix (order matters)
```js
// Level 1: Row must be FIXED width (gives columns a concrete width to fill into)
row.layoutSizingHorizontal = 'FIXED';
row.resize(contentWidth, row.height);

// Level 2: Column FILLs the row
col.layoutSizingHorizontal = 'FILL';
// VERIFY: console.assert(col.layoutSizingHorizontal === 'FILL')

// Level 3: Strip picker min/max, then FILL the now-fixed column
inst.minWidth = null;
inst.maxWidth = null;
inst.layoutSizingHorizontal = 'FILL';
// VERIFY: console.assert(Math.abs(inst.width - col.width) < 2)
```

**Always read back** `.width`/`.layoutSizingHorizontal` after — a silent no-op leaves the overflow bug.

**Standing instruction (2026-07-11):** Proactively fix field FILL/overflow on every MCP form build — don't wait to be told.

---

## SegmentedButton Label Injection (confirmed 2026-07-10, Schedule Op v3)

**Recurring failure:** SegmentedButton renders as "Hourly / Button / Button / Button" — extra segments show placeholder "Button" labels.

**Root cause:** (1) Extra segments disabled by default, (2) raw `findAll(TEXT)` order hits hidden 5th segment text node first, offsetting all labels.

### ✅ CORRECT
```js
const sbSet = await figma.importComponentSetByKeyAsync('308476a5285b5a132241dc1c118d09ecf8d82273');
const sb = sbSet.defaultVariant.createInstance();

// Step 1: Enable extra segments
sb.setProperties({
  '3rd Button#167915:5': true,
  '4th Button#167915:10': true,
  // '5th Button#167915:15': true  // if needed
});

// Step 2: Find VISIBLE text nodes only, sorted by X position
const texts = sb.findAll(n => n.type === 'TEXT').filter(t => {
  let p = t.parent;
  while (p && p.id !== sb.id) {
    if (p.visible === false) return false;
    p = p.parent;
  }
  return t.visible !== false;
}).sort((a, b) => a.absoluteBoundingBox.x - b.absoluteBoundingBox.x);

// Step 3: Inject labels
const labels = ['Hourly', 'Daily', 'Monthly', 'Yearly'];
for (let i = 0; i < Math.min(texts.length, labels.length); i++) {
  await figma.loadFontAsync(texts[i].fontName);
  texts[i].characters = labels[i];
}
```

**❌ WRONG:** `sb.findAll(n => n.type==='TEXT')` without visible filtering → hits hidden 5th node → "Hourly/Button/Button/Button" bug.

---

## SideNavigation — Exact setProperties Key Names (confirmed 2026-07-15)

Component set key: `699:37890` (canonical ref) / `701:119633` (full confirmed build)

```js
inst.setProperties({
  '✏️ Text#283293:137': 'Operations',           // item label
  'Icon#328810:0': iconComponentId,              // icon (use importComponentByKeyAsync(key).id)
  'Navigation Indicator / External Link Icon#283293:50': arrowComponentId, // right arrow
  'Navigation Indicator / External Link#283218:12': true,  // show divider + arrow
  'Two Click-Area#283293:112': true,             // enable expand/collapse
  'Selected': 'True',                            // selected state (string, not boolean)
});
```

**Width calibration:** After content injection, resize to minimum 260px if labels truncate.

---

## Figma API Gotchas (confirmed July 2026)

| # | Symptom | Root cause | ✅ Fix |
|---|---|---|---|
| 1 | `setProperties` runs, slot items unchanged | Prior overrides on clone resist writes | Clear slot, use fresh prototypes from ORIGINAL (P-028) |
| 2 | `t.characters` on nested instance text fails silently | Text inside nested instance = read-only | Use `setProperties` on the instance, not the text node |
| 3 | `layoutSizingHorizontal='FILL'` silently ignored | Parent is HUG-width — no concrete width to fill | Set parent to FIXED first, then FILL child |
| 4 | `individualStrokeWeights` throws | Not supported in `use_figma` context | Use `strokeWeight` only |
| 5 | `counterAxisAlignItems='STRETCH'` throws | Invalid value | Use `'MIN'`, `'MAX'`, or `'CENTER'` |
| 6 | Screenshot returns stale/cached result | Screenshot API caches parent nodes | Screenshot a CHILD node instead for fresh render |
| 7 | `appendChild` into INSTANCE throws | Instance internals are locked | Insert into parent frame, not the instance |
| 8 | `resize()` freezes auto-layout frame dimensions | Overrides auto-layout sizing | Use `layoutSizingHorizontal/Vertical` instead |
| 9 | `setProperties` sees wrong sublayer structure | Sublayers shift after property change | Call `setProperties` BEFORE reading sublayer nodes (P-023) |
| 10 | ObjectStatus shows text when icon-only needed | Text nodes not hidden | `findAll(TEXT)` after setProperties, set `visible=false` |
| 11 | `importComponentByKeyAsync` throws "not found" | Called on a COMPONENT SET key, not a single component | Use `importComponentSetByKeyAsync` then `.defaultVariant` |
| 12 | ObjectAttribute text clips short | Component has hardcoded ~74px max width | Use native text rows for long labels instead |
| 13 | Fill-override on SAP instance has no effect | Library instances own their fills | Never set `.fills` on a SAP kit instance — use `setProperties` for variants |

---

## SAP Composite Slot Injection — Clone-Canonical Method

**Applies to:** SideNavigation, Dialog, DynamicPageHeader, FilterBar, OverflowToolbar, and any SAP composite with named `⿻` slot frames.

**Rule:** NEVER build SAP composites from scratch. ALWAYS clone an existing correctly-built node.

### Why
- Cloning preserves all SAP token bindings (`var(--sapXxx)` fills, font tokens) automatically
- Cloning preserves the internal `⿻` slot frame structure that slot injection requires
- Building from scratch produces instances with no slots → items land outside slots → `setProperties` silently fails

### The 8-step method (confirmed 2026-07-15, 100% satisfaction)

```javascript
// 1. Find an existing correctly-built composite node on canvas
const ref = figma.getNodeById('699:37890'); // canonical SideNavigation

// 2. Clone it — inherits all slot frames + SAP token bindings
const nav = ref.clone();
figma.currentPage.appendChild(nav);

// 3. Find the ⿻ slot frame inside the clone
const slot = nav.findOne(n => n.name === '⿻ Navigation Items');

// 4. Save prototype references from the ORIGINAL ref BEFORE any modification
const itemProto = ref.findOne(n => n.name === 'Navigation Item');

// 5. Clear all existing slot children
[...slot.children].forEach(n => n.remove());

// 6. For each item: clone fresh prototype from ORIGINAL, inject, configure
for (const item of navItems) {
  const inst = itemProto.clone();      // fresh from original — no overrides
  slot.appendChild(inst);
  inst.layoutSizingHorizontal = 'FILL';
  inst.setProperties({
    '✏️ Text#283293:137': item.label,
    'Icon#328810:0': item.iconKey,
  });
}
```

### Critical rules
- **Save prototypes BEFORE clearing slot** — once children are removed, those nodes are gone
- **Never clone prototypes from the modified clone** — inherited overrides block `setProperties` silently (P-028)
- **`setProperties` only works on DIRECT children of the slot frame** — double-nested items resist writes (P-027)
- Resize to 260px minimum if text truncates after build

### Canonical reference nodes (file `p7zm5EMBk5DRRZdxNeJ4f5`)
| Node | What it is |
|---|---|
| `699:37890` | SideNavigation — confirmed slot structure |
| `701:119633` | SideNavigation — complete confirmed build |
| `709:40690` | Schedule Form Step 2 — all-SAP-token reference |
| `709:41339` | Live Preview Panel — execution list + summary |

### General principle
Applies to ALL SAP composite screens — clone existing correctly-built node, update text nodes (`t.characters`), use `setProperties` for variant/icon changes. Never use raw hex — clone inherits correct `var(--sapXxx)` fills automatically.

---

## Prototype Motion Defaults (confirmed 2026-07-14)

When building an interactive prototype (section expand/collapse, page transitions):

| Interaction | Easing | Duration |
|---|---|---|
| Micro (hover, toggle, checkbox) | Ease-In-Out | 150–200ms |
| Section expand / collapse | Ease-In-Out `cubic-bezier(0.4, 0, 0.2, 1)` → Figma `EASE_IN_AND_OUT` | ~300ms |
| Page / full-screen transition | Ease-In-Out | ~400ms |

- Default easing for SAP Fiori = **Ease-In-Out** (`EASE_IN_AND_OUT` in Figma reactions), NOT linear.
- Add a small **purple DEMO pill** at the top-left of every prototype frame so it's clear the frame is a demo, not production.
- Prototype NAVIGATE reactions still require top-level frames (a frame inside a group won't bind a reaction).

