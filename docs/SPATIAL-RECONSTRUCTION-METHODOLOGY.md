# Spatial Reconstruction Methodology
## RULE 18 · Source of Truth · added 2026-07-08

This document is the canonical full-text reference for RULE 18 — Spatial Reconstruction.
Formally registered in `skill/SYSTEM_PROMPT.md`. Operational step in `skill/SKILL.md` Step 0.5 Phase 0.

---

## Core Principle

When a reference image, screenshot, Figma frame, PDF, wireframe, or hand-drawn sketch is provided, the plugin must not generate layouts using arbitrary dimensions, spacing, or padding.

Instead, it should reconstruct the layout by **estimating the spatial relationships visible in the reference**.

The objective is to reproduce the **layout structure and proportions** as accurately as possible while implementing the interface with SAP components and Auto Layout.

---

## Measure Before Building

Before generating any SAP components, analyze the reference to estimate:

* Overall screen dimensions and proportions
* Width and height of major regions
* Margins (outer — space between screen edge and content)
* Internal padding (space inside containers)
* Gaps between components
* Alignment (left-edge, center, right-edge, baseline)
* Grid structure
* Column widths and distribution
* Row heights
* Relative positioning
* Visual hierarchy and nesting depth

Generation should only begin after this spatial analysis is complete.

---

## Relative Measurements

Infer relative measurements from the reference:

* Distance between neighboring components
* Padding inside containers
* Margins around sections
* Consistent spacing rhythm (multiples of 4, 8, or 16px is common in SAP)
* Component proportions
* Width distribution across columns (e.g. 28% / 28% / 44%)
* Height distribution across rows
* Alignment to shared edges and baselines

The goal is not pixel-perfect replication but a **faithful reconstruction of the layout**.

---

## Estimate Layout Geometry

Treat the reference as a measurable design. Estimate:

* Container boundaries
* Component bounding boxes
* Alignment guides
* Grid structure
* White space
* Visual grouping and nesting
* Nested containers

These estimates should drive the generated Auto Layout configuration.

---

## Auto Layout First

Reproduce the layout using Auto Layout rather than fixed positioning whenever possible.

Infer from the reference:

| Auto Layout property | What to infer |
|---|---|
| `layoutMode` | HORIZONTAL or VERTICAL |
| `itemSpacing` | Gap between children |
| `paddingTop/Bottom/Left/Right` | Internal space from container border to children |
| `counterAxisAlignItems` | CENTER, START, or END alignment |
| `primaryAxisSizingMode` | AUTO (hug) or FIXED |
| `counterAxisSizingMode` | AUTO (hug) or FIXED |
| `layoutSizingHorizontal/Vertical` | HUG, FILL, or FIXED per child |

**Avoid unnecessary spacer frames.** Use well-structured Auto Layout gap values instead.

Fixed dimensions only where the reference clearly shows a fixed-size element (e.g. a navigation rail with an explicit narrow width).

---

## SAP Components After Spatial Reconstruction

Once the spatial structure has been reconstructed:

1. Choose the appropriate SAP floorplan
2. Select official SAP component instances
3. Place them according to the inferred layout
4. Apply SAP spacing, typography, and design tokens
5. Refine the layout while preserving the proportions observed in the reference

SAP's default spacing values (compact: 8px gap, 16px padding; cozy: 16px gap, 24px padding) should be used as a baseline and adjusted only when the reference clearly deviates.

---

## Confidence-Based Estimation

Images rarely provide exact measurements. For every inferred dimension, document confidence:

| Level | Meaning | Example |
|---|---|---|
| **HIGH** | Clear spacing, alignment pattern, or repeated interval visible | "ShellBar height = 48px — matches SAP compact density standard exactly" |
| **MEDIUM** | Inferred from surrounding elements and proportions | "SideNav width estimated ~200px from ratio to total screen width" |
| **LOW** | Ambiguous due to image quality or incomplete information | "Column 2 width estimated ~28% but reference is partially cut off" |

**If critical dimensions cannot be estimated reliably:**
- State the assumption explicitly in `meta.decisions.layout`
- Use SAP's canonical defaults (they are usually correct)
- Inform the user only when the ambiguity would significantly affect usability

---

## Document in Spec's meta.decisions.layout

Every spec generated from a reference image must include a `layout` section in `meta.decisions`:

```json
"layout": {
  "autoLayoutDirection": "HORIZONTAL (main layout) · VERTICAL (column interiors)",
  "sizingStrategy": "explicitWidth=2000; SideNav 200px (10%); FCL splits 28/28/44 (528/528/704px)",
  "paddingRationale": "16px internal panel padding (SAP compact default); 8px inter-item gap; 1px dividers between FCL columns",
  "groupingStrategy": "Left rail (persistent nav) → Column 1 (master) → Column 2 (detail) → Column 3 (sub-detail)",
  "confidence": {
    "overallWidth": "HIGH — reference shows full 1920px desktop viewport",
    "columnRatio": "MEDIUM — 28/28/44% estimated from visual proportions of the reference",
    "sideNavWidth": "HIGH — clearly ~200px, matches SAP standard SideNav width",
    "rowHeight": "HIGH — compact density = 32px row height per SAP spec",
    "filterCardHeight": "MEDIUM — estimated ~180px from reference visual proportion"
  }
}
```

---

## Validation Before Generation

Before generating components, verify:

- [ ] Major region proportions match the reference
- [ ] Component spacing is consistent (not random mix of 8/17/23px)
- [ ] Margins are coherent
- [ ] Alignment follows the inferred grid
- [ ] Auto Layout values reflect measured relationships, not guesses
- [ ] SAP components fit naturally within the reconstructed layout
- [ ] Every inferred dimension has a documented confidence level

No section should rely on arbitrary spacing or random dimensions.

---

## Worked Example: SAP LaMa Layout Reconstruction

**Reference:** SAP Landscape Management Activities screen (2000px desktop)

| Region | Width | Method | Confidence |
|---|---|---|---|
| Full screen | 2000px | estimated from desktop viewport | HIGH |
| ShellBar | 2000px × 48px | SAP compact standard | HIGH |
| Warning strip | 2000px × 40px | MessageStrip compact height | HIGH |
| SideNavigation | 200px | visual proportion ~10% of total | MEDIUM |
| FlexibleColumnLayout | 1800px total | 2000 − 200 | HIGH |
| Column 1 (master) | 504px (~28%) | visual proportion from reference | MEDIUM |
| Column 2 (detail) | 504px (~28%) | matches Col 1 width visually | MEDIUM |
| Column 3 (sub-detail) | 792px (~44%) | wider — houses the messages panel | MEDIUM |
| Panel internal padding | 16px | SAP compact default | HIGH |
| Row height (activity rows) | 80px | hug — contains 5 label rows | HIGH |
| Message card height | ~100px | hug — 3 text lines visible | MEDIUM |
| Gap between panels | 8px | SAP compact inter-item gap | HIGH |

**Auto Layout decisions:**
- `FlexibleColumnLayout` → HORIZONTAL, gap=1 (dividers), fill=parent
- Each `FCL-Column` → VERTICAL, AUTO sizing, white fill
- Each activity row `Panel` → VERTICAL, AUTO height, padding=16px
- Filter card `Panel` → VERTICAL, AUTO height, gap=8px, padding=16px
- Message card `Panel` → VERTICAL, AUTO height, padding=12px, gap=4px

---

## Success Criteria

The generated SAP screen should preserve the spatial intent of the reference:

* Layout proportions closely resemble the reference
* Component placement follows measured relationships rather than guesswork
* Padding, margins, and spacing are inferred from the source instead of assigned arbitrarily
* Auto Layout reflects the reconstructed geometry
* The final result feels structurally faithful to the original while remaining fully compliant with SAP design principles

The plugin should treat every reference as a design that can be **measured, interpreted, and reconstructed** — not merely copied visually.

---

*Document created 2026-07-08. Formally registered as RULE 18 in `skill/SYSTEM_PROMPT.md`. Operational step in `skill/SKILL.md` Step 0.5 Phase 0.*
