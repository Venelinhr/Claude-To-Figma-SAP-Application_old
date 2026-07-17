# Analytical List Page Floorplan

## What It Is
An Analytical List Page (ALP) combines **filter + chart + drillable table** in one screen. Users configure filters, see the aggregate visualization (KPIs + chart) update in real time, and drill from the chart into the underlying data table.

## When to Choose Analytical List Page
- The primary task is **analysis** — spot trends, outliers, distributions across a large dataset
- Users need aggregations (sum, average, count) AND detail rows in the same screen
- Chart-table interaction: clicking a chart segment filters the table
- KPI header updates as filters change

## When NOT to Choose Analytical List Page
| Scenario | Use Instead |
|---|---|
| User just needs a list to search / process | **List Report** |
| Users watch metrics but don't drill into rows | **Overview Page** |
| Detail work on ONE business object | **Object Page** |
| No filter interaction — pre-scoped queue | **Worklist** |

## The Key Differentiator
The question: **"Does the user need to explore data via filters + visualization?"**

- Explore + slice + drill → **Analytical List Page**
- Just search → **List Report**
- Just monitor → **Overview Page**

## Required Component Hierarchy
```
ShellBar
DynamicPage
  title:   DynamicPageTitle
             heading: Title ("Sales Order Analysis")
             actions: [Button("Export"), Button("Adapt Filters")]
  header:  DynamicPageHeader
             VisualFilterBar OR FilterBar
             KPI band (3–5 ObjectNumber tiles that update on filter change)
  content: IconTabBar
             Tab "Chart"  → Chart component (bar/line/donut)
             Tab "Table"  → Responsive Table
             Tab "Chart+Table" → split view (Chart above, Table below)
```

## Component Decisions
| Choice | Rules |
|---|---|
| FilterBar | Rich — Select, MultiComboBox, DatePicker, RangeSlider, DateRangePicker |
| KPIs | Auto-recompute on filter change; use ObjectNumber with `state` for trend |
| Chart | Native SAP chart (bar / column / line / donut) — clicking a segment filters the table below |
| Table | ResponsiveTable with growing scroll; supports drill into Object Page |
| VariantManagement | Required — users save their favorite filter configurations |
| Chart-table sync | Clicking a chart data point filters the table; clearing filter clears both |

## Empty State
- No filter applied → show `sapIllus-BeforeSearch` illustration in the chart region
- Filter applied but no matches → `sapIllus-NoFilterResults` in both chart AND table

## SAP Guidelines Reference
- https://experience.sap.com/fiori-design-web/analytical-list-page/

<!-- part of the SAP Fiori knowledge base -->
