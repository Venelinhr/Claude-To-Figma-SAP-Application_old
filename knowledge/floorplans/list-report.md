# List Report Floorplan

## What It Is
A List Report is a search-and-browse screen for **large, open-ended datasets**. The user has no prior knowledge of what they'll find — they need to filter, search, and explore. Think "search for purchase orders across all suppliers and time ranges."

## When to Choose List Report
- Large dataset (hundreds to thousands of records)
- User needs to discover/search, not process a known queue
- Multiple filter dimensions required (Status + Supplier + Date Range + Amount)
- User persona is varied — different people use this screen for different purposes
- VariantManagement is needed (saved filter sets per user)

## When NOT to Choose List Report
| Scenario | Use Instead |
|---|---|
| User processes a daily queue of known items | **Worklist** |
| Result of clicking a related items link | **Worklist** (scoped list) |
| Single object detail view | **Object Page** |
| KPI overview with multiple list types | **Overview Page** |
| Analytical breakdown with charts | **Analytical List Page** |

## The Key Trap
**"List of things" does not mean List Report.**

A procurement manager reviewing today's 20 pending approvals is a **Worklist**. They are not searching — they have a pre-defined queue. The List Report distinction is the need for open-ended filter-driven search.

Ask: "Does the user know what they're looking for, or are they searching?" If they know → Worklist. If they're searching → List Report.

## Required Component Hierarchy
```
ShellBar
DynamicPage
  title:   DynamicPageTitle
             heading: Title ("Purchase Orders")
             actions: [Button(Create), Button(Export)]
             showVariantManagement: true  ← required on List Report
  header:  DynamicPageHeader              ← present on List Report
             FilterBar
               filterItems: [FilterItem(Status), FilterItem(Supplier), FilterItem(Date)]
  content: Table (Responsive or Grid)
             headerToolbar: OverflowToolbar
               Title("Purchase Orders")
               ToolbarSpacer
               Button(Export)
             columns: [Column...]
             items: ColumnListItem[]
```

## What Belongs in the Header (DynamicPageTitle)
- Page title
- Variant management (saved filter views)
- Page-level create/export buttons

## What Belongs in the Collapsible Header (DynamicPageHeader)
- FilterBar — always and only here

## What Belongs in Content
- The table (Responsive, Grid, or Analytical)
- Table toolbar (above the table, inside headerToolbar slot)
- Empty state illustration (IllustratedMessage when no results)

## Component Decisions
| Choice | Rules |
|---|---|
| Table type | Responsive Table for ≤8 columns, heterogeneous data. Grid Table for analytical, fixed columns, virtual scroll. Analytical Table for charts/aggregations. |
| Selection mode | MultiSelect for bulk actions. SingleSelectLeft for drill-down navigation. None for display-only. |
| Table toolbar actions | Always in OverflowToolbar. Actions apply to selected rows. |
| Filter count | Show badge on FilterBar with active filter count. |

## SAP Guidelines Reference
- https://experience.sap.com/fiori-design-web/v1-145/ui-elements/list-report-floorplan/

<!-- part of the SAP Fiori knowledge base -->
