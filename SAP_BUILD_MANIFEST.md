# SAP_BUILD_MANIFEST — the ONLY file a build reads

<!-- manifestVersion: 1.0.3 · verified production-ready 2026-07-17 -->
<!-- generatedFrom: knowledge/components/registry/*.json, knowledge/guidelines/horizon-variable-keys.json -->
<!-- lastSynced: 2026-07-16 -->

## ⭐ CANONICAL REFERENCE FILE — USE THIS BEFORE EVERY BUILD

**`docs/canonical-screens/Claude to Figma SAP Application.fig`**

This `.fig` file ships with the repo and is the ONLY approved ground truth.
Open it in Figma + connect SAP Web UI Kit library → clone from it for every build.

| Need to build... | Clone from |
|---|---|
| List Report (any width) | Activities View — node `615:36810` |
| Object Page narrow | yanatest Steps — node `560:36552` |
| SideNavigation | node `699:37890` (proto source) |
| Dialog / Form | Schedule Operation — node `750:174190` |
| Log / Message panel | Validate System — node `750:174814` |
| Desktop List Report | Outage List — node `750:174925` |
| FCL + SideNav + Table | Governance Console — node `750:177443` |

> This file overrides any other pattern reference. If anything conflicts — the `.fig` file wins.

---

**This is the ONLY knowledge file the build agent reads per build** — this manifest + the reference image (or its cached semantic model).

### ⛔ Enforcement contract

If you are about to open any of these files, STOP — everything you need is in this manifest:

| File | Why you must NOT read it | What to use instead |
|---|---|---|
| `plugin/figma-builder/code.js` | Plugin runtime, ~45k tokens, runs inside Figma — irrelevant to `use_figma` builds | §3 for component keys, §4 for token hexes |
| `knowledge/guidelines/component-property-reference.json` | 136 KB bulk reference | §3 has the 25 common keys; fallback = one `registry/<Component>.json` |
| `knowledge/guidelines/horizon-variable-keys.json` | 26 KB token file | §4 has the 25 common tokens |
| Multiple `registry/*.json` files | Bulk load | One file at most, only if component absent from §3 |

- kitFile (components/icons) = `SILcWzK5uFghKun9jx6D7c` · libraryFileId = `p7zm5EMBk5DRRZdxNeJ4f5`

### ⚠ If you are lost, guessing, or output is wrong — STOP and read the .fig file
```
get_design_context on the closest canonical node from §3b
+ read the PNG from docs/canonical-screens/
= ground truth. Build from that, not from memory.
```
RULE 29: Visual Recovery Protocol. The .fig file IS the answer.

---

## §1 — The 3 HARD RULES (never violate)

1. **Real SAP instances only** — every UI element via `importComponentSetByKeyAsync(key)` → `.defaultVariant.createInstance()`. NEVER `figma.createFrame()` for a real component (header, toolbar, button, input, select, label, icon, status, list item, tab bar).
   **⛔ FAIL-CLOSED (the #1 root cause):** if a component key 404s or `importComponentSetByKeyAsync` fails — **STOP and re-harvest the key**. NEVER silently substitute `figma.createFrame()`. A silent native-frame fallback is what produces "not SAP" disasters. Report the failed key; do not build past it.
2. **L1–L5 semantic naming always** — no `Frame 1`, `Group`, `Rectangle`, `Spacer`, `Container`, `Auto Layout`. No decorative chars or token tags in *final* layer names (tags are stripped at Bind).
3. **No Spacer frames** — space with `itemSpacing`, `paddingX`, `primaryAxisAlignItems:'SPACE_BETWEEN'`, or `layoutGrow:1` on a real child. Never an empty frame to push things apart. **⚠ Even a frame named `Toolbar Fill` or `Tab Fill` with `layoutGrow:1` is a spacer — banned.**

### §1b — Workflow gates (before you build)
- **When a reference image is present:** run VDI **Sector-Based Analysis** (divide into labeled sectors A/B/C… → analyze each independently → local recommendation → merge; skill/sap-visual-reading/sector-analysis.md, RULE 17/26). Then present ASCII wireframe + sector map + component list, get user approval (RULE 19 HARD GATE) BEFORE building. Use semantic components (ObjectIdentifier/ObjectNumber/ObjectAttribute/ObjectStatus), not raw text.
- **Field/input sizing:** set field/input/select/date-picker instances to `layoutSizingHorizontal='FILL'` AFTER stripping `minWidth`/`maxWidth` — otherwise they crop at their hardcoded ~272px. Parent column must be FIXED-width first (see figma-build-patterns.md §Form Field FILL).
- **Width (RULE 30):** default 1440 ONLY when nothing given. Reference shared → MEASURE it. If close to a breakpoint, SUGGEST snapping (mobile 375 / tablet 768 / desktop 1440); if deliberately non-standard (320 master col, 560 dialog), use the exact measured width. User can set/change width AT ANY MOMENT → always wins, execute immediately. State width + any snap suggestion in the wireframe.

---

## §2 — L1–L5 naming hierarchy

| Level | What | Examples |
|-------|------|---------|
| L1 | Screen / floorplan | `Purchase Order`, `Yanatest Steps` |
| L2 | Functional regions | `Dynamic Page Header`, `Filter Bar`, `Main Content` |
| L3 | SAP component instances | `Overflow Toolbar`, `Responsive Table`, `Object Status` |
| L4 | Logical groups | `Primary Actions`, `Entry Header`, `Meta Block` |
| L5 | Content elements | `Customer Name`, `Status`, `Time`, `Save Button` |

**Naming rules (all mandatory):**
- Never generic names: `Frame 1`, `Group`, `Rectangle`, `Spacer`, `Container`, `Auto Layout`
- Never decorative chars or token tags in final layer names (tags stripped at Bind)
- Never redundant single-child nesting: `Header → Header` (use the name once)
- Never suffix instance names with ` (SAP)` — preserve official SAP component names as-is
- Preserve official SAP kit instance names where possible (`Button`, `Object Status`, `Icon Tab Bar`)

```
Yanatest Steps                 ← L1
├── Dynamic Page Header         ← L2
│   ├── Title Row               ← L4
│   └── Subtitle                ← L5
├── Icon Tab Bar                ← L3
└── Message List                ← L3
    └── Log Entry ×N            ← L4
        ├── Entry Header         ← L5
        └── Meta Block           ← L5
```

---

## §3 — Common component keys (`importComponentSetByKeyAsync`)

Real instances only. Layout containers (DynamicPage, Column, ObjectPageLayout, FilterBar, OverflowToolbar) are auto-layout frames, not kit sets — build them natively but name them semantically (L2/L3). Aliases resolve to the listed base component.

| Component | figmaComponentId | Note |
|---|---|---|
| ShellBar | `169cfd74c0be329c56b4c79b9404c978ff10cb60` | |
| DynamicPageHeader | `dc90c8dbf7714f165ed79357e9ba6ade5b3701ae` | DPTitle/DPHeader share this |
| Button | `91805fa199b1fd247d76a9c08bbe0982b49065c4` | Type: Primary/Secondary/Accept/Reject/Attention/Tertiary — ⚠ re-harvest key if 404 |
| MenuButton | `1d667088d93c355c2bd9bafac57147286206e799` | |
| IconButton | `c1ee1ca76974c720ecd4b1888e1e23ac8a36ec63` | Icon via `◆ICON/` placeholder, NOT via key |
| Input | `0f4366cb3065919e8f3deb0462f1a5a3633d6b50` | SearchField = alias |
| Select | `5ce369ff7fb0cce28984eec8dd9973ccde82facb` | ComboBox = alias |
| CheckBox | `23b4a2ca030e4bd2ff3bdd5b97b70f646ec09071` | |
| RadioButton | `9308f27ef27fbb28bc7d167c52494aa41a21610f` | |
| DatePicker | `ad1f84e6293671f80ff8dd174b1da0cbacf0fa48` | |
| Label | `b38ac753648ad298c1e2dd02d71417566dd6095c` | Title = alias |
| Link | `2e67b5399e9f05950c6f6ea6f244a1a9736c8a56` | |
| Table | `03ea321822c4e99c27de4d9c2524bdec9c6e0972` | ResponsiveTable = alias |
| List | `4fb0a3e2fc56fb58d9904d68eb4ac58b9fb1bd25` | |
| StandardListItem | `f7bc6526a9f16608747a4141800146ebd3f4e835` | |
| ObjectStatus | `748d609ead5d4a246d7cd7c144b94b518c467e58` | prop `Semantic`: None/Success/Warning/Error/Information |
| ObjectNumber | `7b67d22ed19f246b708dc4664808a45f314a7414` | |
| ObjectAttribute | `080ead216322befe153704bf8f11373158fea34a` | |
| MessageStrip | `f0e77f8888796e35c0e791ddc0b38535eda6ec31` | |
| Toolbar | `58a258bf5813e59cec4dfc684c8cdb2a6ca6721f` | OverflowToolbar = alias |
| Dialog | `5b965b1eda133ac521b42fa20b201e9491f4bf83` | |
| Panel | `4d19c2a24896033fe5b04bcc5dfdf43e9626283d` | |
| IconTabBar | `4aafcbf55528c439876b314d155438884b614722` | |
| Avatar | `71a3389ecbd47822b3184700766e30963fc2f220` | |
| SegmentedButton | `308476a5285b5a132241dc1c118d09ecf8d82273` | Enable 3rd/4th Button booleans before injecting extra labels |

**Icon keys (harvested — use plugin Harvest Icon Keys for others):**
| Icon | Key |
|---|---|
| home | `ddf4537c2f792179f11f64cae869cd1241e5ec7e` |
| favorite-list | `54a20db7cb800219f99739af69d8195b2c7beedd` |
| gear | `265629e8409332355482d6b3cf1d03f664f3880d` |
| crm-sales | `3d74518d3f5035e8343bde96de99bd24a44fe079` |
| customer-and-contacts | `5b7cfcdaad20640db22b7b6396b8a744d3b1d9fd` |
| wrench | `75f0fa42efe3014f303b55ca1b4f37552f592af1` |
| slim-arrow-right | `3b6dbb6e00c7999da17b69d269c3ace5f9ccee6d` |
| slim-arrow-down | `d206a924630cb08c1b62f4c2ddef383b8142e519` |
| overflow / more (DPH overflow btn) | `6a0c2f0be4be541cc17870a7a633b19e3cb2d1df` |

Text = native `figma.createText()` with family `72`, tagged `[typo:role]` (see §5).

---

## §3b — Canonical Screen Nodes

> **Reference file:** `docs/canonical-screens/Claude to Figma SAP Application.fig`
> Open this file in Figma, connect SAP Web UI Kit as library, then use node IDs below as clone sources.
> The `.fig` file ships with the repo — no private Figma access needed.

Clone these — don't build from scratch. These nodes carry correct SAP tokens and slot structures.

| Screen | Node | Description |
|---|---|---|
| Activities View | `615:36810` | 320px List Report, DPH + Progress Row pattern — confirmed Jul 14 |
| yanatest Steps | `560:36552` | Object Page narrow, canonical DPH strip, IconTabBar — confirmed Jul 14 |
| Schedule Form Step 2 | `709:40690` | All SAP tokens, full Horizon theme — confirmed Jul 14 |
| Live Preview Panel | `709:41339` | Execution list + schedule summary — confirmed Jul 14 |
| SideNavigation (full) | `701:119633` | Complete slot-injection build — confirmed Jul 15 |
| SideNavigation (proto source) | `699:37890` | Use as prototype source for slot injection |
| Dialog Header (canonical) | `560:36171` | Clone for any Dialog Header — confirmed Jul 13 |

**750:174xxx benchmark screens (in the .fig file — the mandated quality bar):**

| Screen | Node | Clone for |
|---|---|---|
| Design System Governance Console | `750:177443` | FCL + SideNav + nested Table + DynamicSideContent |
| Side Navigation (full 20-item tree) | `750:174158` | Any SideNavigation |
| Schedule Operation — Daily | `750:174190` | Dialog / Form, SegmentedButton recurrence |
| Schedule Operation — Monthly pattern | `750:174290` | Dialog with Panel + RadioButton pattern |
| Activities View (List Report) | `750:174442` | List Report + Progress Rows |
| Schedule Operation — Monthly + End date | `750:174786` | Fully-expanded dialog state |
| Validate System Log Panel | `750:174814` | Log/message panel, severity pills, SegmentedButton filter |
| Schedule Operation Form (base) | `750:174866` | Collapsed dialog base state |
| Outage List Overview | `750:174925` | Desktop List Report, status pills, inline filter bar |
| Design System Governance (worklist) | `750:174960` | Worklist variant |
| Flight Result Card (cross-ref) | `472:34431` | Card build — spec in knowledge/, node here |

---

## §4 — Common token tags (`[sapToken]` name tag; plugin resolves key at Bind)

Tag any fill/stroke layer `<desc> [sapTokenName]`; set the hex below so the plugin's RGB→token match confirms it. Use the token NAME — never a raw untagged hex.

| Token | Hex | Use |
|---|---|---|
| sapBackgroundColor | `#F5F6F7` | App/page content bg |
| sapShellColor | `#FFFFFF` | Shell / white surface |
| sapObjectHeader_Background | `#FFFFFF` | Header / Dialog title bg |
| sapShell_BorderColor | `#D9D9D9` | Shell/section bottom border |
| sapGroup_TitleBorderColor | `#A8B3BD` | Section / table divider |
| sapField_Background | `#FFFFFF` | Input / Select bg |
| sapField_BorderColor | `#556B81` | Input / checkbox border |
| sapField_PlaceholderTextColor | `#556B82` | Input placeholder |
| sapButton_Background | `#FFFFFF` | Default button bg |
| sapButton_BorderColor | `#BCC3CA` | Default button border |
| sapButton_TextColor | `#0064D9` | Default button text |
| sapButton_Emphasized_Background | `#0070F2` | Primary CTA bg |
| sapButton_Emphasized_TextColor | `#FFFFFF` | Primary CTA text |
| sapList_Background | `#FFFFFF` | Row bg |
| sapList_TextColor | `#131E29` | List / table / body text |
| sapList_HeaderTextColor | `#1D2D3E` | Column header text |
| sapList_SelectionBackgroundColor | `#EBF8FF` | Selected row bg (blue tint) |
| sapList_SelectionBorderColor | `#0064D9` | Selected/active outline |
| sapTitleColor | `#1D2D3E` | Page title / H1 |
| sapContent_LabelColor | `#556B82` | Metadata labels |
| sapLinkColor | `#0064D9` | Links / breadcrumb |
| sapPositiveElementColor | `#1E8F56` | Success icon / green border |
| sapCriticalElementColor | `#DF7B01` | Warning icon |
| sapNegativeElementColor | `#BD2920` | Error icon |
| sapNeutralColor | `#788FA6` | Inactive / neutral |

Explicit stroke tag: `[stroke:sapTokenName]` when a border needs a different token than the fill.

---

## §5 — Typography role tags (`[typo:role]` on native text, family `72`)

| Role | Size | Weight |
|---|---|---|
| heading | 20 | Bold |
| title | 16 | Bold |
| subtitle | 14 | Regular |
| label | 14 | Regular |
| label-emphasized / labelBold | 14 | Bold |
| body / bodyText | 14 | Regular |
| caption | 12 | Regular |
| tableHeader | 13 | Bold |
| toolbarTitle | 16 | Regular |

---

## §6 — Placeholders, root frame, name-tag contract

- **Icons:** drop a 16×16 placeholder frame named `◆ICON/<icon-name>` (e.g. `◆ICON/filter`, `◆ICON/sort`, `◆ICON/sys-enter-2`). The agent NEVER swaps icons and NEVER reads icon keys — the plugin's **Bind** button imports + swaps them.
- **Root frame:** `◆SAP-UNBOUND/<ScreenName>` (L1). Position x ≥ 15000 (isolated) OR below existing content — never overlapping.
- **DEMO pill:** small purple pill top-left of the section.

| Layer | Name tag | Example |
|---|---|---|
| Fill/bg | `[sapToken]` | `Header [sapShellColor]` |
| Stroke (distinct) | `[stroke:sapToken]` | `Success Border [stroke:sapPositiveElementColor]` |
| Text | `[typo:role]` | `Title [typo:heading]` |
| Icon placeholder | `◆ICON/name` | `◆ICON/add` |
| Root | `◆SAP-UNBOUND/Name` | `◆SAP-UNBOUND/Yanatest Steps` |
| SAP instance | official kit name | `Button`, `Object Status`, `Icon Tab Bar` |
