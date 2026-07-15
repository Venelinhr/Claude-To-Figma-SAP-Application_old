# SAP Horizon design tokens

Use during Stage 7 — Typography and Color Mapping.

Never output raw hex, RGB, or px values as design decisions. Always use named tokens. If a token name is uncertain, say so and direct the designer to verify in the SAP Web UI Kit Figma file.

SAP Web UI Kit Figma: https://www.figma.com/design/SILcWzK5uFghKun9jx6D7c/SAP-Web-UI-Kit
SAP Fiori for Web UI Kit: https://www.figma.com/community/file/1494295794601744471/sap-fiori-for-web-ui-kit

---

## Typography tokens

### Font sizes

| Token | Usage | Approx size |
|-------|-------|-------------|
| sapMFontHeader1Size | Page / dialog title (H1) | 1.5rem |
| sapMFontHeader2Size | Section title (H2) | 1.25rem |
| sapMFontHeader3Size | Sub-section title (H3) | 1.125rem |
| sapMFontHeader4Size | Card title (H4) | 1rem bold |
| sapMFontHeader5Size | Small heading (H5) | 0.875rem bold |
| sapMFontHeader6Size | Smallest heading (H6) | 0.75rem bold |
| sapMFontLargeSize | Large body text | 1rem |
| sapMFontMediumSize | Standard body / field value | 0.875rem |
| sapMFontSmallSize | Label / helper / caption text | 0.75rem |

### Font weight
- Regular: sapFontFamily (400)
- Bold: use font-weight: bold or sapFontBoldFamily
- Never specify numeric weights — use SAP font weight tokens

### Component-level typography
- sap.m.Title: level property (H1–H6) sets semantic and visual hierarchy
- sap.m.Label: always uses sapMFontSmallSize + sapUiContentLabelColor
- sap.m.Text: sapMFontMediumSize by default
- sap.m.ObjectNumber: emphasized=true for large numeric display

---

## Color tokens — text

| Token | Usage |
|-------|-------|
| sapUiBaseText / sapTextColor | Primary body text |
| sapUiContentLabelColor | Field labels, section headers |
| sapUiContentForegroundTextColor | Secondary / muted text |
| sapUiContentDisabledTextColor | Disabled state text |
| sapUiPositiveText | Success / positive value |
| sapUiNegativeText | Error / negative value |
| sapUiCriticalText | Warning / critical value |
| sapUiNeutralText | Neutral / informational |
| sapUiSelected | Selected / active text |

---

## Color tokens — backgrounds

| Token | Usage |
|-------|-------|
| sapBackgroundColor | Page / app background |
| sapUiShellColor | Shell bar background |
| sapUiTileBackground | Card / tile background |
| sapUiFieldBackground | Input field background |
| sapUiFieldHoverBackground | Input hover state |
| sapUiFieldFocusBackground | Input focus state |
| sapUiButtonEmphasizedBackground | Emphasized button background |
| sapUiHighlight | Selection highlight background |
| sapUiListSelectionBackgroundColor | Table row selected background |

---

## Color tokens — semantic states

| Token | State | Usage |
|-------|-------|-------|
| sapUiFieldInvalidColor | Error | Field border, error icon |
| sapUiFieldInvalidBackground | Error | Field background |
| sapUiFieldWarningColor | Warning | Field border |
| sapUiFieldSuccessColor | Success | Field border |
| sapUiFieldRequiredColor | Required | * indicator color (red) |
| sapUiErrorBorder | Error | MessageStrip, inline error |
| sapUiPositiveBG | Success | MessageStrip success background |

---

## Color tokens — borders and dividers

| Token | Usage |
|-------|-------|
| sapUiFieldBorderColor | Standard input border |
| sapUiGroupContentBorderColor | Section / group divider |
| sapUiListBorderColor | Table row separator |
| sapUiTileBorderColor | Card border |
| sapUiButtonBorderColor | Default button border |

---

## Spacing tokens

Never specify margins or padding as raw px. Use these tokens:

| Token | Approx size | Usage |
|-------|-------------|-------|
| sapUiTinyMarginBeginEnd | 0.25rem | Inline micro gaps |
| sapUiTinyMargin | 0.25rem | Tight grouping |
| sapUiSmallMarginBeginEnd | 0.5rem | Compact spacing |
| sapUiSmallMargin | 0.5rem | Standard small gap |
| sapUiMediumMargin | 1rem | Standard section gap |
| sapUiLargeMargin | 2rem | Large section separation |
| sapUiContentPadding | 1rem | Standard content area padding |
| sapUiPageFooterHeight | — | Footer bar height reference |

---

## Icon tokens

Icons are referenced by name, never by glyph or image:

```
src="sap-icon://calendar"
src="sap-icon://clock-0"
src="sap-icon://search"
src="sap-icon://add"
src="sap-icon://edit"
src="sap-icon://delete"
src="sap-icon://download"
src="sap-icon://filter"
src="sap-icon://sort"
src="sap-icon://settings"
src="sap-icon://navigation-right-arrow"
src="sap-icon://slim-arrow-down"
```

Full icon library: https://sapui5.hana.ondemand.com/sdk/#/topic/21ea0ea94614480d9a910b2e93431291

---

## Horizon theme — dark mode

When an image shows a dark background (as in the Schedule operation dialog reference):

- Background: sapBackgroundColor — in Horizon Dark theme this renders as dark (#1d1d1e approx)
- Do NOT assume this is a custom dark theme — SAP Horizon ships with light and dark variants
- Always note: "Dark background observed — maps to Horizon Dark theme. Verify with sapUiExperience or theme toggle."
- All semantic tokens (sapUiFieldBorderColor, sapUiContentLabelColor, etc.) adapt automatically in Horizon Dark — no separate tokens needed

---

## Token verification

If uncertain whether a token exists or has been updated in Horizon:
1. Check the SAP Web UI Kit Figma file — all tokens are exposed as Figma variables
2. Check SAP Theming Parameters: https://sapui5.hana.ondemand.com/sdk/#/topic/d9c4dea8c51e4f62b66e5d1bfcfab68d
3. Flag in output as "? — verify token name in SAP Web UI Kit before implementation"
