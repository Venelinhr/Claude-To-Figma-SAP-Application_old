# SAP Web UI Kit — Complete Component Registry
<!-- VERIFIED 2026-07-21 · Kit file: SILcWzK5uFghKun9jx6D7c -->
<!-- All TEXT/BOOLEAN/SWAP keys harvested via use_figma — exact hashed form required by setProperties() -->
<!-- SINGLE SOURCE OF TRUTH: never look up property keys live for components listed here -->
<!-- Short names (no #hash) DO NOT WORK in setProperties() — always use the full key from this file -->

## Quick Usage Pattern

```js
// Import + instantiate
const set = await figma.importComponentSetByKeyAsync('KEY');
const inst = set.defaultVariant.createInstance();
parent.appendChild(inst);

// Set VARIANT / BOOLEAN (short names work here)
inst.setProperties({ 'Form Factor': 'Compact', 'Type': 'Secondary' });

// Set TEXT — MUST use full hashed key (e.g. "✏️ Text#145508:461")
inst.setProperties({ '✏️ Text#145508:461': 'My label' });

// INSTANCE_SWAP — pass icon component.id
inst.setProperties({ 'Icon#112533:584': myIcon.id });

// Components with NO TEXT prop → inject via sub-layer text node
const t = inst.findOne(n => n.type === 'TEXT');
if (t) { await figma.loadFontAsync(t.fontName); t.characters = 'Ready'; }

// After appendChild, set FILL width
inst.layoutSizingHorizontal = 'FILL';
```

## ⚠ NO `Form Factor` prop on these — do NOT setProperties Form Factor:
ObjectStatus · ObjectNumber · ObjectAttribute · ObjectIdentifier · Avatar · Tag · Link · Toast · Breadcrumb · Switch · Progress Indicator · Rating Indicator · Step Input · Slider · Text · Scrollbar

## ⚠ NO TEXT componentProperty — inject text via findOne(TEXT) sub-layer:
ObjectStatus · ObjectNumber · ObjectAttribute · MessageStrip (find n.name==="Text Message")

## ⛔ Dialog = NATIVE FRAME (not a component instance in MCP)
Never call importComponentSetByKeyAsync for a screen-level dialog.
Build: native VBOX + border(#E5E5E5) + cornerRadius:8 + dropShadow.
Clone source: node 727:42563 in file p7zm5EMBk5DRRZdxNeJ4f5.

---

## BUTTONS

### Button
**Key:** `91805fa199b1fd247d76a9c08bbe0982b49065c4`

| Prop | Type | Key / Options |
|---|---|---|
| Text | TEXT | `✏️ Text#145508:461` |
| Type | VARIANT | Primary / Secondary / Accept / Reject / Attention / Tertiary |
| Form Factor | VARIANT | **Compact** / Cozy |
| Interaction State | VARIANT | Regular / Hover / Down / Disabled |
| Toggled | VARIANT | False / True |
| Counter Badge | VARIANT | False / True |
| Icon Left | BOOLEAN | `Icon Left#112533:293` — enables left icon |
| Icon | INSTANCE_SWAP | `Icon#112533:487` — icon component.id |
| Attention Badge | BOOLEAN | `Attention Badge#269292:0` |

### IconButton
**Key:** `c1ee1ca76974c720ecd4b1888e1e23ac8a36ec63`
> Always use Type=Tertiary for toolbar/action icon buttons (RULE)

| Prop | Type | Key / Options |
|---|---|---|
| Icon | INSTANCE_SWAP | `Icon#112533:584` — icon component.id |
| Type | VARIANT | Primary / Secondary / **Tertiary** |
| Form Factor | VARIANT | **Compact** / Cozy |
| Interaction State | VARIANT | Regular / Hover / Down / Disabled |
| Toggled | VARIANT | False / True |
| Counter Badge | VARIANT | False / True |
| Attention Badge | BOOLEAN | `Attention Badge#112533:390` |

### MenuButton
**Key:** `1d667088d93c355c2bd9bafac57147286206e799`

| Prop | Type | Key / Options |
|---|---|---|
| Text | TEXT | `✏️ Text#145508:546` |
| Type | VARIANT | Primary / Secondary / Accept / Reject / Attention / Tertiary |
| Form Factor | VARIANT | **Compact** / Cozy |
| Interaction State | VARIANT | Regular / Hover / Down / Disabled |
| Icon Left | BOOLEAN | `Icon Left#112572:0` |
| Icon | INSTANCE_SWAP | `Icon#112572:97` |

### SegmentedButton
**Key:** `308476a5285b5a132241dc1c118d09ecf8d82273`
> Enable 3rd/4th Button booleans, then inject labels into slot frames

| Prop | Type | Key / Options |
|---|---|---|
| Form Factor | VARIANT | **Compact** / Cozy |
| Type | VARIANT | Text / Icon |
| 3rd Button | BOOLEAN | `3rd Button#167915:5` |
| 4th Button | BOOLEAN | `4th Button#167915:10` |
| 5th Button | BOOLEAN | `5th Button#167915:15` |
| ⿻ Text Segments Compact | SLOT | `⿻ Text Segments Compact#425845:10` |
| ⿻ Icon Segments Compact | SLOT | `⿻ Icon Segments Compact#425845:15` |

---

## INPUTS & FORM FIELDS

### Input
**Key:** `0f4366cb3065919e8f3deb0462f1a5a3633d6b50`

| Prop | Type | Key / Options |
|---|---|---|
| Typed Text | TEXT | `✏️ Typed Text#145437:221` |
| Placeholder | TEXT | `✏️ Placeholder#145437:156` |
| Description Text | TEXT | `✏️ Description Text#267656:0` |
| Form Factor | VARIANT | **Compact** / Cozy |
| Content | VARIANT | Placeholder / Typed Text |
| Value State | VARIANT | **None** / Negative / Critical / Positive / Information |
| Interaction State | VARIANT | Regular / Hover / Active / Read Only / Disabled |
| Trailing Action | BOOLEAN | `Trailing Action#144344:0` |
| 2nd Action | BOOLEAN | `2nd Action#144344:3` |
| Message Popover | BOOLEAN | `Message Popover#154602:0` |
| Description Text (show) | BOOLEAN | `Description Text#267637:0` |

### Select
**Key:** `5ce369ff7fb0cce28984eec8dd9973ccde82facb`

| Prop | Type | Key / Options |
|---|---|---|
| Form Factor | VARIANT | **Compact** / Cozy |
| Drop-Down | VARIANT | **False** / True |

### CheckBox
**Key:** `23b4a2ca030e4bd2ff3bdd5b97b70f646ec09071`

| Prop | Type | Key / Options |
|---|---|---|
| Text | TEXT | `✏️ Text#154638:49` |
| Form Factor | VARIANT | **Compact** / Cozy |
| Check | VARIANT | **Unchecked** / Checked / Tristate |
| Value State | VARIANT | None / Information / Positive / Critical / Negative |
| Interaction State | VARIANT | Regular / Hover / Disabled / Read Only / Display Only |
| Label | BOOLEAN | `Label#125545:8` — show label text |

### RadioButton
**Key:** `9308f27ef27fbb28bc7d167c52494aa41a21610f`

| Prop | Type | Key / Options |
|---|---|---|
| Text | TEXT | `✏️ Text#154638:0` |
| Form Factor | VARIANT | **Compact** / Cozy |
| Selected | VARIANT | **False** / True |
| Value State | VARIANT | None / Information / Positive / Critical / Negative |
| Interaction State | VARIANT | Regular / Hover / Disabled / Read Only |
| Label | BOOLEAN | `Label#125545:8` |

### DatePicker
**Key:** `ad1f84e6293671f80ff8dd174b1da0cbacf0fa48`
> Always set Calendar=false to hide the calendar overlay

| Prop | Type | Key / Options |
|---|---|---|
| Form Factor | VARIANT | **Compact** / Cozy |
| Type | VARIANT | **One-Month** / Two-Month |
| Orientation | VARIANT | **N/A** / Horizontal / Vertical |
| Calendar | BOOLEAN | `Calendar#165202:0` — **set false to hide** |

### Label
**Key:** `b38ac753648ad298c1e2dd02d71417566dd6095c`

| Prop | Type | Key / Options |
|---|---|---|
| Label Text | TEXT | `✏️ Label#237212:48` |
| Type | VARIANT | Regular |
| Required | BOOLEAN | `Required#104646:0` |

---

## DISPLAY COMPONENTS

### ObjectStatus
**Key:** `748d609ead5d4a246d7cd7c144b94b518c467e58`
> ⚠ No Form Factor prop · No TEXT prop — inject text via findOne(TEXT)

| Prop | Type | Key / Options |
|---|---|---|
| Semantic | VARIANT | **None** / Information / **Success** / Warning / Error |
| Inverted | VARIANT | **No** / Yes |
| Large Design | VARIANT | **No** / Yes |

### ObjectNumber
**Key:** `7b67d22ed19f246b708dc4664808a45f314a7414`
> ⚠ No Form Factor · No TEXT prop — inject via findOne(TEXT)

| Prop | Type | Key / Options |
|---|---|---|
| Type | VARIANT | **Regular** / Emphasized / Large / Inverted |
| Semantic | VARIANT | None / Information / Success / Warning / **Error** |

### ObjectAttribute
**Key:** `080ead216322befe153704bf8f11373158fea34a`
> ⚠ No Form Factor · No TEXT prop — inject via findOne(TEXT)

| Prop | Type | Key / Options |
|---|---|---|
| Type | VARIANT | **Regular** / Active |

### MessageStrip
**Key:** `f0e77f8888796e35c0e791ddc0b38535eda6ec31`
> ⚠ No TEXT prop — inject text via: inst.findOne(n => n.name === "Text Message")
> ⚠ No "Type" prop — use Value State. Warning = **Critical**

| Prop | Type | Key / Options |
|---|---|---|
| Value State | VARIANT | **Information** / **Critical** (=Warning) / Negative / Positive / Indication Color |
| Icon | VARIANT | **True** / False |
| Color | VARIANT | None / Indication 1–10 (+ b variants) |
| Close Button | BOOLEAN | `Close Button#102938:0` |

### Avatar
**Key:** `71a3389ecbd47822b3184700766e30963fc2f220`
> ⚠ No Form Factor prop

| Prop | Type | Key / Options |
|---|---|---|
| Initials | TEXT | `✏️ Initials#143938:0` |
| Type | VARIANT | **Image** / Icon / **Initials** |
| Size | VARIANT | XS / **S** / M / L / **XL** |
| Color | VARIANT | Image / 1 / 2 / 3 / 4 / 5 / 6 / 7 / 8 / 9 / 10 / Transparent / Tile / Placeholder |
| Content | VARIANT | **Person** / Object |
| Interaction State | VARIANT | Regular / Hover / Active / Toggled Hover / Disabled |
| Badge | BOOLEAN | `Badge#98694:0` |
| Optional Border | BOOLEAN | `Optional Border#98694:211` |
| Person Icon | INSTANCE_SWAP | `Person Icon#112262:148` |
| Object Icon | INSTANCE_SWAP | `Object Icon#114257:7` |

### Tag
**Key:** `20c3d78c97a2a1f8d63f8cdf85cba49a028a96ea`
> ⚠ No Form Factor prop

| Prop | Type | Key / Options |
|---|---|---|
| Value State | VARIANT | None / Information / Success / Warning / Error |
| Interaction State | VARIANT | Active / Hover / Regular |

### Link
**Key:** `2e67b5399e9f05950c6f6ea6f244a1a9736c8a56`
> ⚠ No Form Factor prop

| Prop | Type | Key / Options |
|---|---|---|
| Text | TEXT | `✏️ Text#142188:0` |
| Type | VARIANT | **Regular** / Emphasized / Subtle / Icon Link |
| Interaction State | VARIANT | Regular / Hover / Visited / Down / Disabled |
| Icon Position | VARIANT | Left / Right / **N/A** |
| Icon | INSTANCE_SWAP | `Icon#283747:121` |

---

## LAYOUT & NAVIGATION

### ShellBar
**Key:** `169cfd74c0be329c56b4c79b9404c978ff10cb60`

| Prop | Type | Key / Options |
|---|---|---|
| Size | VARIANT | S / M / L / **XL** / XXL |
| Hamburger | VARIANT | **False** / True |
| Overflow | BOOLEAN | `Overflow#285285:0` |
| Notification | BOOLEAN | `Notification#285285:11` |
| Help | BOOLEAN | `Help#285285:22` |
| Shell Search | BOOLEAN | `Shell Search#328265:0` |
| Product Switch | BOOLEAN | `Product Switch#285220:27` |
| Back Button | BOOLEAN | `Back Button#104186:9` |
| ⿻ Extra Left Area | SLOT | `⿻   Extra Left Area#422659:0` |
| ⿻ Extra Right Area | SLOT | `⿻ Extra Right Area#422659:11` |

### DynamicPageHeader
**Key:** `dc90c8dbf7714f165ed79357e9ba6ade5b3701ae`

| Prop | Type | Key / Options |
|---|---|---|
| Form Factor | VARIANT | **Compact** / Cozy |
| Size | VARIANT | S / M / L / **XL and XXL** |
| Collapsed | VARIANT | True / **False** |
| Interaction State | VARIANT | **Regular** / Hover |
| Expand and Pin Buttons | BOOLEAN | `Expand and Pin Buttons#416566:0` |
| Header Shadow | BOOLEAN | `Header Shadow#416566:18` |
| ⿻ Content | SLOT | `⿻ Content#416566:6` |
| ⿻ Header Area | SLOT | `⿻ Header Area#416566:9` |

### IconTabBar
**Key:** `4aafcbf55528c439876b314d155438884b614722`

| Prop | Type | Key / Options |
|---|---|---|
| Form Factor | VARIANT | Cozy / **Compact** / N/A |
| Type | VARIANT | **Inline Mode** / Icon Only / Process Tabs / Shell Navigation / Filter Tabs |
| Semantic | VARIANT | **No** / Yes |
| Size | VARIANT | **S** / M and L / XL |
| Overflow | BOOLEAN | `Overflow#103133:0` |
| ⿻ Tabs Inline Non Semantic | SLOT | `⿻ Tabs Inline, Non Semantic#425676:0` |
| ⿻ Tabs Inline Semantic | SLOT | `⿻ Tabs Inline, Semantic#426727:0` |
| ⿻ Tabs Icon Only Compact | SLOT | `⿻ Tabs Icon Only, Non Semantic, Compact#426736:0` |
| ⿻ Tabs Process Compact | SLOT | `⿻ Tabs Process, Non Semantic, Compact#426762:92` |
| ⿻ Tabs Filter Compact | SLOT | `⿻ Tabs Filter Tabs, Non Semantic, Compact#426762:184` |

### SideNavigation
**Key:** `a2c4e73b0d9f817f6e3b4a26f8d9e4c7b2a1c308`
> Clone from node 701:119633 (p7zm5EMBk5DRRZdxNeJ4f5) — slot injection method

### Panel
**Key:** `4d19c2a24896033fe5b04bcc5dfdf43e9626283d`

| Prop | Type | Key / Options |
|---|---|---|
| Title | TEXT | `✏️ Title#145524:0` |
| Form Factor | VARIANT | **Compact** / Cozy |
| Collapsed | VARIANT | **False** / True |
| Fixed | VARIANT | **False** / True |
| ⿻ Content | SLOT | `⿻  Content#422655:24` |
| 1st Action | BOOLEAN | `1st Action#146223:28` |
| 2nd Action | BOOLEAN | `2nd Action#146223:21` |
| 3rd Action | BOOLEAN | `3rd Action#146223:14` |
| 4th Action | BOOLEAN | `4th Action#146223:7` |

### Toolbar
**Key:** `58a258bf5813e59cec4dfc684c8cdb2a6ca6721f`

| Prop | Type | Key / Options |
|---|---|---|
| Title Text | TEXT | `✏️ Title Text#186490:0` |
| Form Factor | VARIANT | **Compact** / Cozy |
| Title | BOOLEAN | `Title#186167:0` |
| 1st Action | BOOLEAN | `1st Action#186482:6` |
| 2nd Action | BOOLEAN | `2nd Action#186482:9` |
| 3rd Action | BOOLEAN | `3rd Action#186464:3` |
| 4th–13th Action | BOOLEAN | `4th Action#186601:9` … `13th Action#186601:42` |
| Segmented Button | BOOLEAN | `Segmented Button#186514:15` |
| Input | BOOLEAN | `Input#186514:12` |
| ⿻ Actions Compact | SLOT | `⿻ Actions Compact#425685:6` |
| ⿻ Left Area | SLOT | `⿻ Left Area#425685:12` |
| ⿻ Actions Cozy | SLOT | `⿻ Actions Cozy#427338:3` |

---

## LISTS & TABLES

### Table
**Key:** `03ea321822c4e99c27de4d9c2524bdec9c6e0972`

| Prop | Type | Key / Options |
|---|---|---|
| Form Factor | VARIANT | **Compact** / Cozy |
| Structure | VARIANT | **Columns** / Rows |
| Highlight | BOOLEAN | `Highlight#200542:0` |
| ⿻ Columns Compact | SLOT | `⿻ Columns Compact#426001:0` |
| ⿻ Rows Compact | SLOT | `⿻ Rows Compact#426001:5` |
| ⿻ Columns Cozy | SLOT | `⿻ Columns Cozy#426001:10` |
| ⿻ Rows Cozy | SLOT | `⿻ Rows Cozy#426001:15` |

### List
**Key:** `4fb0a3e2fc56fb58d9904d68eb4ac58b9fb1bd25`

| Prop | Type | Key / Options |
|---|---|---|
| Form Factor | VARIANT | **Compact** / Cozy |
| ⿻ List Items Compact | SLOT | `⿻ List Items Compact#427968:0` |
| ⿻ List Items Cozy | SLOT | `⿻ List Items Cozy#427968:3` |

### StandardListItem
**Key:** `f7bc6526a9f16608747a4141800146ebd3f4e835`

| Prop | Type | Key / Options |
|---|---|---|
| Text | TEXT | `✏️ Text#152462:90` |
| Byline | TEXT | `✏️ Byline#152704:108` |
| Counter Value | TEXT | `✏️ Counter Value#152451:54` |
| Group Name | TEXT | `✏️ Group Name#152767:195` |
| Footer Text | TEXT | `✏️ Footer Text#152767:225` |
| Growing Text | TEXT | `✏️ Growing Text#155999:31` |
| Form Factor | VARIANT | **Compact** / Cozy / N/A |
| Type | VARIANT | **Single Line** / Byline / List Header / Group Header / Growing List Item / Footer |
| Interaction State | VARIANT | **Regular** / Hover / Down / N/A |
| Selected | VARIANT | **False** / True |
| Separator | BOOLEAN | `Separator#123475:0` |
| Leading Icon | BOOLEAN | `Leading Icon#147034:54` |
| Navigation Indicator | BOOLEAN | `Navigation Indicator#147034:36` |
| Selector | BOOLEAN | `Selector#147034:72` |
| Trailing Icon | BOOLEAN | `Trailing Icon#147034:144` |
| Object Status | BOOLEAN | `Object Status#155958:0` |
| Leading Icon Swap | INSTANCE_SWAP | `Leading Icon Swap#152431:18` |
| Trailing Icon Swap | INSTANCE_SWAP | `Trailing Icon Swap#155542:7` |
| ⿻ Content | SLOT | `⿻ Content#415971:0` |

---

## ICON KEYS (importComponentByKeyAsync — single component, not set)

| Icon name | Key |
|---|---|
| home | `ddf4537c2f792179f11f64cae869cd1241e5ec7e` |
| favorite-list | `54a20db7cb800219f99739af69d8195b2c7beedd` |
| gear | `265629e8409332355482d6b3cf1d03f664f3880d` |
| edit (pencil) | `b346b05bc52f9d648ead280cfbd17baacea391f2` |
| delete (trash) | `6da9bfb78bb57cc96d015531ac16e201423d8558` |
| show (eye) | `f4d889dde94203c7d563db1cde8ec8ae695395bd` |
| date-time | `f8211de35a7e07c14fa178fa3769db7b16306f11` |
| add-calendar | `035388107a60472d49a67c55e79c775c24239330` |
| slim-arrow-right | `3b6dbb6e00c7999da17b69d269c3ace5f9ccee6d` |
| slim-arrow-down | `d206a924630cb08c1b62f4c2ddef383b8142e519` |
| wrench | `75f0fa42efe3014f303b55ca1b4f37552f592af1` |
| overflow/more | `6a0c2f0be4be541cc17870a7a633b19e3cb2d1df` |
| crm-sales | `3d74518d3f5035e8343bde96de99bd24a44fe079` |
| customer-and-contacts | `5b7cfcdaad20640db22b7b6396b8a744d3b1d9fd` |

> For icons not listed: run plugin "Harvest Icon Keys" or use importComponentByKeyAsync with assetKey from SAP-COMPONENT-REGISTRY.md.

---

## SAP TOKENS — Horizon Light (exact hex for use_figma fills)

| Token name | Hex | r,g,b (0–1) | Use |
|---|---|---|---|
| sapBackgroundColor | #F5F6F7 | 0.961, 0.965, 0.969 | Page / dialog background |
| sapShellColor | #FFFFFF | 1, 1, 1 | Surface / section white |
| sapList_Background | #FFFFFF | 1, 1, 1 | Table / list rows |
| sapList_BorderColor | #E5E5E5 | 0.898, 0.898, 0.898 | Dividers / borders |
| sapTitleColor | #1D2D3E | 0.114, 0.176, 0.243 | Page titles H1 |
| sapList_TextColor | #131E29 | 0.075, 0.118, 0.161 | Body / table text |
| sapContent_LabelColor | #556B82 | 0.333, 0.420, 0.510 | Labels / captions |
| sapButton_Emphasized_Background | #0070F2 | 0, 0.439, 0.949 | Primary button bg |
| sapPositiveTextColor | #256F3A | 0.145, 0.435, 0.227 | Success text |
| sapCriticalTextColor | #A8650B | 0.659, 0.396, 0.043 | Warning text |
| sapNegativeTextColor | #BD2920 | 0.741, 0.161, 0.125 | Error text |
| sapInformativeTextColor | #0064D9 | 0, 0.392, 0.851 | Info text |
| sapLinkColor | #0064D9 | 0, 0.392, 0.851 | Links |

---

## TYPOGRAPHY ROLES — native createText() nodes

| Tag | Size | Weight | Use |
|---|---|---|---|
| `[typo:heading]` | 20px | Bold | Page title H1 |
| `[typo:title]` | 16px | Bold | Section heading |
| `[typo:subtitle]` | 14px | Regular | Subtitle |
| `[typo:labelBold]` | 14px | Bold | Values, emphasis |
| `[typo:label]` | 14px | Regular | Form labels |
| `[typo:body]` | 14px | Regular | Body text |
| `[typo:tableHeader]` | 13px | Bold | Column headers |
| `[typo:caption]` | 12px | Regular | Timestamps, meta |

> Every native createText() node name MUST include [typo:role] — Bind plugin uses this to apply SAP text styles.

