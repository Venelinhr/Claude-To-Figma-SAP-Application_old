# SAP Fiori Horizon — Team Wiki

## Horizon vs Previous Themes

SAP Horizon (sap_horizon) is the current theme as of 2023+. If you see references to `sap_belize`, `sap_quartz`, or `sap_fiori_3` — those are outdated. All new screens use Horizon.

### Key Visual Differences in Horizon
- Rounded corners on cards, panels, dialogs (8px radius)
- Softer shadows and elevation
- Updated color palette — more muted, accessible
- Typography uses "72" font family
- ShellBar background: `sapShellColor` (dark blue-gray, not configurable)
- Increased white space compared to Quartz

## Design Token Naming (Horizon)
SAP Horizon uses semantic token names. Always use these — never hardcode hex values.

### Common Tokens
| Token | Purpose |
|---|---|
| `sapPrimary1` | Primary brand color (buttons, links) |
| `sapPrimary2` | Secondary brand color |
| `sapBackgroundColor` | Page background |
| `sapContent_ForegroundColor` | Default text color |
| `sapButton_Emphasized_Background` | Emphasized button fill |
| `sapNegativeColor` | Error / reject color |
| `sapPositiveColor` | Success / accept color |
| `sapCriticalColor` | Warning color |
| `sapInformationColor` | Info color |
| `sapNeutralColor` | Neutral indicator color |
| `sapShellColor` | ShellBar background |

### Status / State Colors
Always use `ObjectStatus` semantic states, never hardcode colors:
| State | Token | Color |
|---|---|---|
| `Success` | `sapPositiveColor` | Green |
| `Warning` | `sapCriticalColor` | Orange/Amber |
| `Error` | `sapNegativeColor` | Red |
| `Information` | `sapInformationColor` | Blue |
| `None` | `sapNeutralColor` | Gray |

## SAP Fiori for Web Figma Kit — Library Notes

The official SAP Fiori for Web Figma design system kit is the source of truth for component instances. It is maintained by the SAP Design team.

### Connecting the Library
1. Figma → Main menu → Files → View all libraries
2. Search "SAP Fiori for Web" or "SAP UI Kit"
3. Add to your team/workspace
4. In target file: Assets panel → Libraries → enable SAP Fiori kit

### Component Naming Convention in the Kit
Components use this pattern: `ComponentName/Variant/State`
Examples:
- `Button/Emphasized/Default`
- `Button/Emphasized/Hover`
- `Filter Bar/Compact/Default`
- `Shell Bar/Default`

### Form Factor Variants
All interactive components exist in two form factor variants:
- `*/Cozy/*` — touch-friendly, 44px height
- `*/Compact/*` — desktop-dense, 26px height

When density is Compact, use Compact variants. When Cozy, use Cozy variants. Never mix.

## Decision Log — Team-Specific Choices

### All our apps use Compact density
Decision: All enterprise back-office apps in our portfolio default to Compact. This is set globally on the Shell, never on individual components.

### showGoButton is always true for FilterBar
Decision: Our SAP backend does not support live filtering. FilterBar must always have an explicit Go button. Never set `showGoButton: false`.

### Worklist is preferred over List Report for task-based screens
Decision: When a screen processes a user's own assigned items (approvals, reviews, todos), default to Worklist. Only use List Report when the user needs to search across organizational data.

### Maximum 7 visible filters on FilterBar by default
Decision: More than 7 filter fields overwhelms the header. Additional filters go into the Adapt Filters dialog. The 7 visible filters are: Status, Supplier/Vendor, Document Date (from/to), Amount (from/to), Company Code.

### Draft save pattern for all edit-heavy Object Pages
Decision: Any Object Page with a complex form (>5 fields) uses the draft save pattern with a visible footer (Save / Discard buttons). Simple attribute edits can use immediate save.

## Known Figma Kit Quirks (Horizon)

- **Auto-layout on DynamicPage**: The library component uses absolute positioning for the title/header/content regions. Do not set auto-layout on the DynamicPage frame itself.
- **FilterBar height**: The Figma component has a fixed height that does not auto-resize with multiple rows of filters. Use the "Expanded Multi-Row" variant explicitly for >3 filters.
- **ShellBar height**: 44px in both Cozy and Compact — ShellBar does not change height with density.
- **Font "72"**: The Figma kit uses the "72" font family. This font requires a separate license for non-SAP use. In our Figma environment it is already available.

<!-- part of the SAP Fiori knowledge base -->
