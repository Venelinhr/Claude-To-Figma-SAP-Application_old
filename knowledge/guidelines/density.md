# Density & Spacing — SAP Fiori Horizon

## Two Density Modes

SAP Fiori has two density modes. Picking the wrong one is the most common design mistake.

| Mode | Class | Touch target | Row height | When |
|---|---|---|---|---|
| **Cozy** | default (no class needed) | 44px min | 3rem | Touch devices, consumer apps, general enterprise |
| **Compact** | `sapUiSizeCompact` on ancestor | 26px min | 2rem | Desktop power-users, back-office, information-dense screens |

### Decision Rule
- SAP back-office enterprise apps (ERP, SRM, procurement, HR): **Compact**
- Customer-facing or mixed device apps: **Cozy**
- When in doubt about our team's apps: **Compact** — all our apps are desktop-first back-office

### How Density Is Applied
Density is set on an **ancestor element**, never on individual controls:
```xml
<!-- Correct: set on body or Shell -->
<Shell class="sapUiSizeCompact">
  ...
</Shell>

<!-- Wrong: never set on individual controls -->
<Button class="sapUiSizeCompact" />
```

### Portal Exception (Critical)
`sap.m.Dialog`, `sap.m.MessageBox`, and `sap.m.BusyDialog` render outside the normal DOM tree (in a portal). They **do not inherit** the ancestor density class. Always set explicitly:
```xml
<Dialog class="sapUiSizeCompact" ...>
```

## Spacing Tokens (SAP Horizon)

### Base Unit
SAP Horizon uses **4px** as the base spacing unit. All spacing values are multiples of 4.

### Standard Spacing Scale
| Token | Value | Use |
|---|---|---|
| `--sapContent_FocusWidth` | 2px | Focus ring width |
| `4px` | 0.25rem | Extra tight (rarely used) |
| `8px` | 0.5rem | Tight spacing between related elements |
| `16px` | 1rem | Default content padding |
| `24px` | 1.5rem | Section spacing |
| `32px` | 2rem | Major section gaps |
| `48px` | 3rem | Page-level spacing |

### SAP Fiori Content Padding Classes
Use these CSS classes instead of hardcoded margin/padding:

| Class | Value | Use |
|---|---|---|
| `sapUiContentPadding` | 16px all sides | Standard page content padding |
| `sapUiSmallContentPadding` | 8px all sides | Compact panels |
| `sapUiResponsiveContentPadding` | Responsive | Adjusts based on screen size |
| `sapUiNoContentPadding` | 0 | Tables that should span full width |
| `sapUiSmallMarginTop` | 8px top | Small top margin |
| `sapUiMediumMarginTop` | 16px top | Standard top margin |
| `sapUiLargeMarginTop` | 32px top | Large section separation |
| `sapUiSmallMarginBegin` | 8px start | Small inline start margin |
| `sapUiMediumMarginBegin` | 16px start | Standard inline start margin |

## Design Token Rule
**Never hardcode pixel values** in Figma or code. Always use:
1. SAP design tokens via CSS custom properties (`var(--sapButton_Background)`)
2. SAP spacing classes (`sapUiContentPadding`)
3. Auto layout with SAP's standard spacing values (multiples of 4)

## Figma Auto Layout Settings
When building layouts in Figma spec, use these standard values:
- Page content padding: 16px (1rem) horizontal, 0 vertical (DynamicPage handles this)
- Toolbar height (Compact): 36px
- Toolbar height (Cozy): 44px  
- Table row height (Compact): 32px
- Table row height (Cozy): 48px
- ShellBar height: 44px (Cozy) / 36px (Compact)
