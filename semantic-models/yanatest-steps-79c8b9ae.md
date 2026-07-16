---
sourceImage: Screenshot 2026-07-08 at 22.47.57.png
imageSha1: 79c8b9ae
vdiVersion: "1.0"
floorplan: Object Page (mobile) — sap.f.DynamicPage + sap.m.IconTabBar
createdAt: 2026-07-14
---

# Yanatest Steps — semantic model

Mobile viewport (~390px). Object Page, Steps tab active.

## Zones
- A Object Header: title "yanatest" + subtitle "Activity | Activity Number 765" + ··· overflow
- B Tab Bar: General (inactive) | Steps (active, blue underline)
- C List Toolbar: "Steps (1)" + Hide Filters btn + sort + settings icons
- D Filter Bar (VBox, 2 fields): Status Select "Select Value" + Operation Input "String" + clear/add icon btns
- E Column Header: "Operation" bold
- F List Item: Validate System — selected=true + highlight=Success + type=Navigation

## Components
- DynamicPageHeader — zone A — [sapShellColor] bg, title [typo:heading], subtitle [typo:caption sapContent_LabelColor]
- IconTabBar — zone B — active tab underline [sapList_SelectionBorderColor]
- Toolbar — zone C — "Steps (1)" [typo:toolbarTitle]; Button (Hide Filters, Tertiary) + 2 IconButton (sort, settings)
- Select — zone D Status — [sapField_Background]/[sapField_BorderColor], placeholder [sapField_PlaceholderTextColor]
- Input — zone D Operation — same field tokens; + 2 IconButton (clear, add)
- Toolbar — zone E — "Operation" [typo:tableHeader]
- List + StandardListItem — zone F — bg [sapList_SelectionBackgroundColor], green left border [stroke:sapPositiveElementColor]
- ObjectStatus — zone F — Semantic=Success (icon only, no text)
- ObjectAttribute ×4 — zone F meta — ID:1 / Next: / Previous: / Hook for ID:

## Tokens
- sapShellColor (header/tab/toolbar/colheader bg) · sapBackgroundColor (filter bar bg)
- sapShell_BorderColor (section borders) · sapField_Background + sapField_BorderColor (inputs)
- sapList_SelectionBackgroundColor (selected row) · sapPositiveElementColor (success border/icon)
- sapList_SelectionBorderColor (active tab underline) · sapContent_LabelColor (meta/subtitle)
- sapTitleColor (title) · sapButton_TextColor (blue actions)

## States
- Tab Steps: active (blue text + 2px underline); General: inactive (label color)
- List item: selected=true (blue bg) + highlight=Success (green 3px left border) stack simultaneously
- Nav arrow › rendered via type=Navigation
- Select/Input: valueState=None (no validation shown)

## Notes
- Icons via ◆ICON placeholders only: filter, sort, customize, decline, add, sys-enter-2, slim-arrow-down
- Meta rows: label [sapContent_LabelColor] + value [sapList_TextColor], empty values keep a space for height
- Auto Layout only — no Spacer frames; use SPACE_BETWEEN / layoutGrow on real children
