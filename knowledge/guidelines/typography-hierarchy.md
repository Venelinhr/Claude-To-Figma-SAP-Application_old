# SAP Horizon Typography Hierarchy

> Single canonical reference for all SAP typography roles used across the design system.  
> Generated from `knowledge/components/registry/*.json` `typographyRules[]` entries, deduplicated by role.  
> Plugin function: `applyTypography(node, role)` — maps role → kit text style key → `setTextStyleIdAsync()`.  
> **NEVER hardcode `fontSize`, `fontName`, or `fontStyle` directly** — always use a role name from this table.

---

## Role Reference Table

| Role | Font Family | Font Style | Font Size | Line Height | SAP Style Name | Used By |
|---|---|---|---|---|---|---|
| `dialogTitle` | 72 | Black | 24px | Auto | `Main Header/sapObjectHeader_Title_FontSize` | Dialog header, DynamicPageTitle H1 |
| `objectPageTitle` | 72 | Bold | 28px | Auto | `Main Header/LHAuto/Bold` | ObjectPageLayout main title |
| `sectionHeading` | 72 | Bold | 16px | Auto | `MediumText/LHAuto/Bold` | Panel title, ObjectPageSection H2 |
| `toolbarTitle` | 72 | Regular | 16px | Auto | `MediumText/LHAuto/Regular` | OverflowToolbar / Toolbar title |
| `tableHeader` | 72 | Bold | 13px | Auto | `MediumText/LHAuto/Bold` | Table column headers, form label bold |
| `labelBold` | 72 | Bold | 14px | Auto | `MediumText/LHAuto/Bold` | Required field labels, key data points |
| `labelRegular` | 72 | Regular | 14px | Auto | `MediumText/LHAuto/Regular` | Optional field labels, body text, cell text |
| `formLabel` | 72 | Regular | 14px | Auto | `MediumText/LHAuto/Regular` | Form field labels (non-required) |
| `bodyText` | 72 | Regular | 14px | Auto | `MediumText/LHAuto/Regular` | General body content, descriptions |
| `subtitle` | 72 | Regular | 14px | Auto | `MediumText/LHAuto/Regular` | Page subtitle, secondary headings |
| `buttonLabel` | 72 | Bold | 14px | Auto | `MediumText/LHAuto/Bold` | Button text (Emphasized/Primary) |
| `buttonLabelSecondary` | 72 | Semibold Duplex | 14px | Auto | `MediumText/LHAuto/SemiboldDuplex` | Button text (Default/Secondary) |
| `linkText` | 72 | Regular | 14px | Auto | `MediumText/LHAuto/Regular` | Link labels, breadcrumb items |
| `stepNumber` | 72 | Bold | 14px | Auto | `MediumText/LHAuto/Bold` | Wizard step circle numbers |
| `stepLabel` | 72 | Bold | 12px | Auto | `SmallText/LHAuto/Bold` | Wizard step labels below circles |
| `caption` | 72 | Regular | 12px | Auto | `SmallText/LHAuto/Regular` | Metadata, helper text, ObjectAttribute |
| `placeholder` | 72 | Regular | 14px | Auto | `MediumText/LHAuto/Regular` | Input placeholder text |
| `inputValue` | 72 | Regular | 14px | Auto | `MediumText/LHAuto/Regular` | Input typed value |
| `navItem` | 72 | Regular | 14px | Auto | `MediumText/LHAuto/Regular` | SideNavigation item labels |
| `navItemSelected` | 72 | Bold | 14px | Auto | `MediumText/LHAuto/Bold` | SideNavigation selected item |
| `shellBarTitle` | 72 | Bold | 15px | Auto | `MediumText/LHAuto/Bold` | ShellBar product name |
| `objectNumber` | 72 | Bold | 20px | Auto | `LargeText/LHAuto/Bold` | KPI number (ObjectNumber) |
| `objectUnit` | 72 | Regular | 12px | Auto | `SmallText/LHAuto/Regular` | KPI unit label (EUR, %, etc.) |
| `objectStatusText` | 72 | Regular | 12px | Auto | `SmallText/LHAuto/Regular` | ObjectStatus label |
| `tableFooter` | 72 | Regular | 12px | Auto | `SmallText/LHAuto/Regular` | Table footer / count text |

---

## Style Key Map (for `importStyleByKeyAsync`)

Plugin function `applyTypography(node, role)` maps role → 40-char style key.  
Keys are from the SAP Web UI Kit file `SILcWzK5uFghKun9jx6D7c`.

```javascript
// Current style keys in plugin (skill/SYSTEM_PROMPT.md RULE 11 + SAP_TYPOGRAPHY in code.js)
const SAP_TYPOGRAPHY = {
  sectionHeading:    { key: '<harvest>', fontFamily: '72', fontStyle: 'Bold',    fontSize: 16 },
  toolbarTitle:      { key: '<harvest>', fontFamily: '72', fontStyle: 'Regular', fontSize: 16 },
  labelBold:         { key: '<harvest>', fontFamily: '72', fontStyle: 'Bold',    fontSize: 14 },
  labelRegular:      { key: '<harvest>', fontFamily: '72', fontStyle: 'Regular', fontSize: 14 },
  stepLabel:         { key: '<harvest>', fontFamily: '72', fontStyle: 'Bold',    fontSize: 12 },
  caption:           { key: '<harvest>', fontFamily: '72', fontStyle: 'Regular', fontSize: 12 },
};
```

Style keys must be harvested live from a Figma file where the SAP Web UI Kit is connected:
```js
figma.getLocalTextStyles().map(s => ({ name: s.name, key: s.key }))
```

---

## Color Tokens by Typography Role

| Role | Token name | Hex fallback |
|---|---|---|
| `dialogTitle` / `sectionHeading` / `toolbarTitle` | `sapTitleColor` | `#1D2D3E` |
| `tableHeader` / `labelBold` | `Grey/Grey8` | `#223548` |
| `labelRegular` / `bodyText` / `formLabel` | `List/sapList_TextColor` | `#131E29` |
| `caption` / `objectUnit` / `objectStatusText` | `Text/sapContent_LabelColor` | `#556B82` |
| `placeholder` | `Input/sapField_PlaceholderTextColor` | `#556B82` |
| `linkText` | `Link/sapLinkColor` | `#0064D9` |
| `navItem` | `Shell/Navigation/sapShell_Navigation_TextColor` | `#1D2D3E` |
| `navItemSelected` | `Shell/Navigation/sapShell_Navigation_Selected_TextColor` | `#0064D9` |
| `shellBarTitle` | `Shell/sapShell_TextColor` | `#1D2D3E` |
| `buttonLabel` (Primary) | `Button/Emphasized/sapButton_Emphasized_TextColor` | `#FFFFFF` |
| `buttonLabel` (Secondary) | `sapButton_TextColor` | `#0064D9` |
| `objectNumber` | Role-based semantic (Success/Warning/Error/None) | varies |

---

## Density Adjustments

SAP Fiori supports two density modes. Font sizes are the same — only spacing/height changes.

| Density | Form Factor | Row height | Touch target | Toolbar height |
|---|---|---|---|---|
| Compact | Compact | 32px | 32px min | 40px |
| Cozy | Cozy | 44px | 44px min | 52px |

Font family **72** (SAP proprietary, licensed) is used for all roles. Fallback: **Arial** or system sans-serif.

---

## Notes

- **Font family `72`** must be loaded via `figma.loadFontAsync({ family: '72', style: 'Regular' })` before setting `node.characters`.
- **`applyTypography(node, role)`** in the plugin handles font loading, size, and style binding automatically.
- **RULE 11** in `skill/SYSTEM_PROMPT.md` defines the same table — this file is the canonical source; RULE 11 references it.
- **Never use font size 13px** — SAP Horizon does not use 13px; the minimum body text is 14px.
- **Bold vs Semibold Duplex**: Emphasized buttons use `Bold`, Default/Secondary buttons use `Semibold Duplex` (a SAP-specific variant with slightly reduced weight for long labels).
