# Canonical Complex SAP Screens — PERFECT EXAMPLES (verified 2026-07-16)

> ⭐⭐⭐ These 4 screens are the user's designated **perfect examples of complex SAP screens**.
> Study them for structure, components, layout, tokens, and interaction before building anything similar.
> Extracted + adversarially verified from Figma file `E083sNBH7JNEOBFrG7Bqge` (From Claude to SAP Figma screen).
> **Raw screenshots are privacy-excluded from GitHub** (`docs/canonical-screens/_private-refs/`, gitignored).
> This structural knowledge IS the reference — study it, don't need the PNGs.

Source file: `E083sNBH7JNEOBFrG7Bqge`
Nodes: `68:2578` (yanatest Steps) · `42:2348` (Validate System) · `68:2928` (Activities View) · `68:3262` (Side Navigation)

---

## 1. Side Navigation Menu — `68:3262`

**Floorplan:** Side Navigation (app-shell left nav, `sap.tnt.SideNavigation`) — pairs with FCL / List Report content.
**Dimensions:** 260 × 808px (frame); items slot 244 × 788 at x=8,y=8.

### The signature pattern: "Two Click-Area" split-hit navigation
A vertical **Separator (12×22)** divides the label click-zone from the chevron expand-zone on **expandable parents only** — clicking the row navigates, clicking the chevron toggles children independently. The separator renders ONLY on the 4 expanded parents, NOT on collapsed right-chevron items.

### Structure (22 items, 4 expanded groups)
```
Overview                    [home icon, slim-arrow-right, collapsed]
Operations                  [icon + separator + slim-arrow-down, EXPANDED]
  Operations                [pl 40, Regular, no icon]
  Operation Templates
  Schedules
Automation Studio           [EXPANDED — 7 children]
  Content Management / Provider Definitions / Custom Operations /
  Custom Hooks / Custom Notifications / Custom Processes / Auto-Heal Configurations
UI Customizations           [EXPANDED — 2 children]
  Links / Menu Items
Monitoring [SELECTED]        [#EBF8FF fill + 3px #0064D9 left bar, EXPANDED]
  Activities / Logs
Configuration               [wrench, slim-arrow-right, collapsed]
Configuration Ex...         [wrench, truncated label, collapsed]
Infrastructure              [network icon, collapsed]
```

### Components
- `SideNavigation` (sapShellColor variant, base `30:2062`)
- `Navigation Item` (base `30:2230`) ×22 — 3 variants: top-level expandable / top-level non-expandable (arrow-right) / nested sub-item (pl 40, no icon)
- Navigation Indicator chevron: `slim-arrow-right` = collapsed, `slim-arrow-down` = expanded
- Two Click-Area, Separator (expanded parents only), Selection Highlight Bar (3px left), Scrollbar

### Tokens
| Token | Hex | Use |
|---|---|---|
| `sapList_Background` | `#FFFFFF` | panel + item bg |
| `sapList_TextColor` | `#131E29` | all labels |
| `sapList_SelectionBackgroundColor` | `#EBF8FF` | selected row fill |
| `sapList_HighlightColor` | `#0064D9` | 3px selected left bar |
| `sapScrollBar_FaceColor` | `#7B91A8` | scroll thumb |
| `sapButton_BorderCornerRadius` | 8px | nav item pill radius |

**Layout:** COLUMN, gap 4; item height 32, pitch 36px (32+4 gap); top-level pl 16/pr 6 gap 8; sub-items pl 40 (indent aligns under parent). Font: `72 Semibold Duplex` 600 (parents/selected), `72 Regular` 400 (sub-items), 14px.

---

## 2. yanatest Steps — `68:2578`

**Floorplan:** Object Page (mobile/narrow detail column, 320px) — Dynamic Page Header + IconTabBar + filterable list section (List Report nested in the Steps tab). An Object Page "Steps" facet as an FCL detail pane at phone width.
**Dimensions:** 320 × 808px (content top ~415px, rest empty page bg).

### Structure (sections stack, no gap — each owns its padding)
```
Dynamic Page Header (64)   Title "yanatest" (24px Black) + Subtitle "Activity | Activity Number 765"
                            + VISIBLE blue overflow (…) top-right
Icon Tab Bar (44)          General | Steps[SELECTED, blue 3px underline] — Inline Mode, size S
Dialog Header (40)         "Steps (1)" + Hide Filters btn (left) · Sort + Column Settings (right)
Filter Bar (132)           Status: Label + Select "Typed Text" · Operation: Label + Input "String" + clear/add filter
Section Header (35)        "Operation" label
List Item (122)            3px green success rail + ObjectStatus(Success) + "Validate System" + ›
                            Meta: ID:1 / Next: / Previous: / Hook for ID: (ObjectAttribute, empty values)
```

### Components
- `Dynamic Page Header` (`30:2115`) — Page Title + Subtitle + visible overflow (…)
- `Icon Tab Bar` (`49:2571`) Inline/S · `Tab` (`49:2636`) — Steps selected
- `Button` Transparent "Hide Filters" (filter icon + blue label) · `Icon Button` (`2:97`) Sort/Settings/Clear/Add — all Tertiary/Compact blue
- `Select` (`2:156`, Compact) · `Input` (`2:7`, Compact) · `Object Status`(Success, `sys-enter-2` green check) · `Object Attribute` (`49:2587`, key-only rows)
- List Item = custom composite "Validate System List Item" (3px success border, selected blue bg)

### Tokens
`sapBackgroundColor` #f5f6f7 (page/filter bg) · `sapObjectHeader_Background` #fff · `sapPositiveTextColor` #256f3a (success rail fill) · `sapPositiveElementColor` #30914c (rail stroke + green check) · `sapLinkColor` ≈#0064d9 (selected tab, Hide Filters, all action icons) · `sapContent_LabelColor` #556b82 · Content_Space_S 16px (header padding). Fonts: `72`; title 24px/900, Steps title 16px, subtitle/attr/tab 14px, tab 700, button 600.

---

## 3. Validate System — Message Log — `42:2348`

**Floorplan:** Dynamic Page (List Report variant) presenting a Message View / Log-Viewer inside a Dialog container.
**Dimensions:** 678 × 777px (header block 157h, dialog block 620h).

### The signature pattern: color-coded severity pills (SAP Indication tokens)
| Severity | Pill bg | Text | Token |
|---|---|---|---|
| Trace | `#f4bcff` (lavender) | `#7b3d9e` | sapIndicationColor_8b |
| Debug | `#cdc1ff` (periwinkle) | `#5b44c0` | sapIndicationColor_7b |
| Information | `#d9ebff` (light blue) | `#0070f2` | sapIndicationColor_5b |

### Structure
```
Dynamic Page Header (157)   Title "Validate System" + Subtitle "Step | ID 1 | Activity Number 765"
                            Right: Hide Filters (outlined blue) + Full Screen + Close X (all BLUE)
                            Filter Bar: Message search (300w) + Severity Select (224w) + clear/add filter (blue)
Dialog (620)               Header: "Messages (10)" + SegmentedButton All|Platform[SEL]|AI|Analytics + Sort + Settings
                            Message list (7 visible): [pill] | separator(#ccc) | "Message Code: LVM" |
                                                       blue "Time: 2026-07-06 12:22:48" | dark body text
```
Message mix: 5× Trace, 1× Debug, 1× Information. Entry 1 spans 3 lines (Serialized Trace ID).

### Components
`Dynamic Page Header` (`42:2386`) · `Toolbar` Compact · `Button` outlined "Hide Filters" (blue filter icon) · `Button` Tertiary Icon Full Screen / Close (blue) · `Input` Compact (Message) · `Select` Compact (Severity "Select Value") · `Segmented Button` (View Toggle All/Platform/AI/Analytics, Platform selected, all blue text) · Message List + Log Entry rows + severity pills + vertical Separator (#ccc).

### Critical color note
**All action buttons + segmented labels render SAP emphasized BLUE `#0070f2`, NOT neutral grey/tertiary.** (Verify-phase correction.)

---

## 4. Activities View — `68:2928`

**Floorplan:** List Report / Worklist (narrow master column) — suitable as FCL master pane.
**Dimensions:** 320 × 764px (every row full-width, 16px h-padding).

### The signature pattern: Progress Row + success rail
```
Progress Row = "Progress:" label + bold "100%" + green pill bar (40×12, #30914c, 6px radius) + 16px green success icon
Each list item = 3px vertical success rail (#256f3a, sapPositiveTextColor) signalling complete/positive
Selected row (yanatest) = #ebf8ff bg + #0064d9 bottom border
```

### Structure
```
Dynamic Page Header    Title "Activities View" (24px Black) + Subtitle "Latest Server Time: 2026-07-08 13:29:43 (UTC)"
                       + overflow (…) top-right
Filter Bar (150)       Name: Label + Input · Status: Label + Select (200) + clear/add (36×36 blue)
Dialog Header          "Activities (6)" + Sort + Column Settings (blue icons)
Column Header (100)    "Name" — top+bottom borders #e0e1e3
List Items ×3          yanatest[SELECTED] / Validate Instance / Validate System
                       each: Actions menu button (Secondary, blue text+outline, Compact 84×26) + › chevron
                       Meta: Activity Number 765/426/425 · Progress 100% + green pill + success icon · Note: · Start Time
```

### Components
`Dynamic Page Header` (`68:2988`) · `Object Status`(Success) ×6 (`sys-enter-2` green) · custom Progress Bar (40×12 pill) ×3 · `Menu Button` "Actions" (Secondary, blue text+outline, Compact) ×3 · `Icon Button` Sort/Settings/Clear/Add/Overflow (blue) · List Item composite (Success Border + Item Content + Entry Header + Meta Block) ×3.

### Tokens
`sapShellColor` white (page/items) · `sapList_SelectionBackgroundColor` #ebf8ff (selected) · `sapList_SelectionBorderColor` #0064d9 (selected bottom border) · `sapPositiveTextColor` #256f3a (3px rail) · `sapPositiveElementColor` #30914c (progress fill + success icons) · `sapButton_Lite_TextColor` #0064d9 (all interactive). Title 24px/900, section 16px Bold, meta 13-14px Regular, Actions button `72 Semibold Duplex` 600.

---

## Cross-cutting patterns (apply to ALL complex SAP screens)

1. **Success rail** — 3px left vertical bar, fill `sapPositiveTextColor` #256f3a / stroke `sapPositiveElementColor` #30914c, marks positive/complete list items.
2. **Progress combo** — green pill bar (40×12, 6px radius, #30914c) + 16px `ObjectStatus`(Success, `sys-enter-2`) icon-only.
3. **Selected row** — `sapList_SelectionBackgroundColor` #ebf8ff bg + either 3px left `sapList_HighlightColor` (SideNav) or `sapList_SelectionBorderColor` bottom border (list).
4. **All interactive icons/buttons render BLUE** (#0064d9 lite / #0070f2 emphasized), never neutral grey.
5. **Sections stack with NO gap** — each section owns its own padding (px 16 mobile).
6. **DPH title = 24px `72 Black`/900**; section titles 16px Bold; meta 13-14px Regular.
7. **Overflow (…) is a VISIBLE blue action** top-right of the Dynamic Page Header (not hidden).

## Where these live
- Structural knowledge: THIS FILE (`docs/canonical-screens/COMPLEX-SCREENS-REFERENCE.md`) — in git, ships with repo
- Raw screenshots: `docs/canonical-screens/_private-refs/*.png` — gitignored, privacy-excluded
- Source Figma: `E083sNBH7JNEOBFrG7Bqge` (may be deleted — this doc is the permanent record)
