# Out-of-Scope SAP Fiori Components — DO NOT EMIT IN SPECS

Last updated: 2026-06-26

This list documents SAP Fiori for Web component names that the design agent
**does not support** and must not appear in any generated spec. They come from
SAP namespaces outside the SAP Web UI Kit Figma library OR are runtime-only
constructs that have no static Figma representation.

Spec emitters (Claude / future model layers) treat anything in this list as a
**registry-gate violation** equivalent to an invented component.

When the AI sees a requirement that would normally use one of these, **substitute
the documented alternative below**.

---

## Charts & Visualization (13 — `sap.suite.ui.microchart.*` namespace)

These are part of `sap.suite.ui.commons` / `sap.suite.ui.microchart` — a
separate UI5 library NOT shipped in the SAP Web UI Kit Figma file.

| Forbidden | Why | Substitute |
|---|---|---|
| `MicroChart` | Base class only | Use a specific concrete chart name; if not available, use Card with custom content |
| `AreaMicroChart` | Not in Figma library | Card + native AreaChart frame (manual layout) |
| `BulletMicroChart` | Not in Figma library | Card + ProgressIndicator (single dimension) |
| `ColumnMicroChart` | Not in Figma library | Card + native bar chart frame |
| `ComparisonMicroChart` | Not in Figma library | Card + side-by-side ProgressIndicators |
| `DeltaMicroChart` | Not in Figma library | Card + ObjectNumber with delta arrow icon |
| `LineMicroChart` | Not in Figma library | Card + native line chart frame |
| `RadialMicroChart` | Not in Figma library | Card + ProgressIndicator (radial style) |
| `InteractiveBarChart` | Not in Figma library | Card + List of items with ProgressIndicators |
| `InteractiveLineChart` | Not in Figma library | Card + native chart frame |
| `InteractiveDonutChart` | Not in Figma library | Card + Avatar (donut shape) + Legend |
| `HarveyBallMicroChart` | Not in Figma library | Card + ObjectNumber + ProgressIndicator |
| `StackedBarMicroChart` | Not in Figma library | Card + multiple ProgressIndicators stacked |

**Substitution policy**: when a requirement says "show a sales chart", emit a Card containing a placeholder frame named "Chart placeholder — N×N px" with a comment noting the data source. The plugin renders a styled empty frame. Real chart rendering is out of scope; the spec layer is for layout, not data viz.

---

## Heavyweight Tables (3 — `sap.ui.table.*` namespace)

These are the heavy framework tables (virtualization, locked columns, analytics) — not in SAP Web UI Kit Figma library.

| Forbidden | Why | Substitute |
|---|---|---|
| `GridTable` | sap.ui.table.Table — JS-heavy table | Use `Table` (sap.m.Table) with SapColHeader + SapTableRow renderers |
| `AnalyticalTable` | sap.ui.table.AnalyticalTable — drill-down analytics | Use `Table` with grouping headers and totals row |
| `TreeTable` | sap.ui.table.TreeTable — hierarchical table | Use `Tree` for hierarchy OR `Table` with indented Name column |

---

## Runtime / Framework constructs (8)

These have no static Figma representation — they're runtime container/wrappers.

| Forbidden | Why | Substitute |
|---|---|---|
| `App` | sap.m.App — runtime app container | The plugin always wraps in a screen frame; never emit App in spec |
| `Shell` | sap.m.Shell — legacy shell | Use `ShellBar` (current Fiori shell) |
| `Page` | sap.m.Page — minimal wrapper | Use `DynamicPage` for modern Fiori screens |
| `SplitContainer` | sap.m.SplitContainer — runtime master-detail | Build two columns explicitly with NativeSideNav + content frame |
| `FlexibleColumnLayout` | sap.f.FlexibleColumnLayout — 1/2/3 column responsive | Build the column count explicitly in the hierarchy |
| `MessageView` | Runtime-only — internal to MessagePopover | Use `MessagePopover` directly |
| `ScrollContainer` | sap.m.ScrollContainer — runtime scrolling | Figma frames are inherently scrollable; no wrapper needed |
| `Splitter` | sap.ui.layout.Splitter — runtime resizable split panel | Build two side-by-side frames explicitly |

---

## Layout Primitives (6 — `sap.m.*` / `sap.ui.layout.*` flex containers)

These are Figma Auto Layout in disguise. The plugin uses Figma's native Auto Layout instead of importing these.

| Forbidden | Why | Substitute |
|---|---|---|
| `FlexBox` | Plugin uses Figma Auto Layout (`layoutMode: 'HORIZONTAL'` / `'VERTICAL'`) | Native frame with appropriate layoutMode |
| `HBox` | Same — horizontal flex | Native HORIZONTAL Auto Layout frame |
| `VBox` | Same — vertical flex | Native VERTICAL Auto Layout frame |
| `Grid` | sap.ui.layout.Grid — CSS Grid wrapper | Native frame with grid layout (manual columns) |
| `ResponsiveGridLayout` | Same as Grid | Same |
| `ToolbarSeparator` | Thin visual separator | Native 1-px frame with `sapShell_BorderColor` fill |

---

## How spec emitters MUST handle this list

1. Before emitting a component name, check this file.
2. If the name appears here, emit the substitute instead.
3. If the requirement genuinely requires a forbidden component (e.g. real chart rendering), the spec author should:
   - Use the closest substitute from the table
   - Add a comment in `meta.rationale` explaining the substitution
   - Recommend the user implement the runtime piece outside the design agent

## Verification

This list is enforced by:
- `skill/SYSTEM_PROMPT.md` RULE 2 (never emit components outside the registry)
- `skill/references/validation-checklist.md` Section 0 (pre-flight)
- The plugin's registry gate at validation time

**An out-of-scope component in a spec = validationStatus: "fail" + entry in unverifiedComponents[].**
