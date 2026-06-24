# Worklist Floorplan

## What It Is
A Worklist is a **pre-scoped, task-oriented list** where the user has a defined set of items to process. The items are already curated — the user does not need to filter or search to find them. Think "my 20 pending approvals for today."

## When to Choose Worklist
- User has a known daily/recurring task queue
- Items are pre-filtered by role/assignment/status (the user only sees their own items)
- The list scope is clear without the user needing to set filters
- Count is manageable (typically <100 items at a time)
- The user's goal is to process each item, not discover them

## When NOT to Choose Worklist
| Scenario | Use Instead |
|---|---|
| User needs to search across all records | **List Report** |
| Large open-ended dataset | **List Report** |
| Multiple users with different filter needs | **List Report** with VariantManagement |
| Single object detail | **Object Page** |

## The Key Differentiator vs List Report
The question: **"Does the user need to specify what they want to see, or is it already defined for them?"**

- User sets their own filter to find records → **List Report**
- System already knows what the user should see → **Worklist**

Secondary signal: **Does the screen need VariantManagement?** Worklist does not. List Report does.

## Required Component Hierarchy
```
ShellBar
DynamicPage
  title:   DynamicPageTitle
             heading: Title ("My Purchase Order Approvals")
             actions: [Button(Approve All)]
             showVariantManagement: false  ← no variant management
  header:  (absent — no DynamicPageHeader, no FilterBar)
  content: Table (Responsive)
             headerToolbar: OverflowToolbar
               Title("Purchase Orders (20)")
               ToolbarSpacer
               Button(Approve, intent: primary-action)
               Button(Reject, intent: destructive)
             columns: [Column(PO Number), Column(Supplier), Column(Amount), Column(Status)]
             items: ColumnListItem[]
               cells: [ObjectIdentifier, Text, ObjectNumber, ObjectStatus]
```

## Key Differences from List Report
| | List Report | Worklist |
|---|---|---|
| DynamicPageHeader | Present (houses FilterBar) | Absent |
| FilterBar | Required | Not used |
| VariantManagement | Required | Not used |
| SearchField | Optional (in table toolbar) | Common (local search) |
| Item count | Large (100s–1000s) | Manageable (<100) |
| User intent | Discover/search | Process/complete |

## Empty State
When the worklist is empty, always show `IllustratedMessage` with a message appropriate to context:
- No pending items: "All done! No items require your attention."
- Illustration type: `sapIllus-AllDone` or `sapIllus-NoData`

## Component Decisions
| Choice | Rules |
|---|---|
| Table selection | MultiSelect — bulk approve/reject is the primary use case |
| Table toolbar | Actions (Approve, Reject) always in OverflowToolbar above table |
| Growing | `growing: true`, `growingScrollToLoad: true` for queues that may grow |
| ObjectStatus | Required for status column — shows semantic color (Warning/Success/Error) |

## SAP Guidelines Reference
- https://experience.sap.com/fiori-design-web/v1-145/ui-elements/worklist-floorplan/
