# Master-Detail Floorplan

## What It Is
A Master-Detail layout puts a **list on the left and the currently-selected item's detail on the right**. Users skim the list, click an item, and see its full detail without leaving the screen. Modern implementations use `FlexibleColumnLayout` which supports two OR three columns (master → detail → sub-detail).

## When to Choose Master-Detail
- Users switch between many items rapidly — the persistent list keeps context
- Each item's detail is small-to-medium (fits comfortably in a 60–70% right pane)
- The list itself needs to stay filterable / searchable while browsing details
- Common in: email clients, message centers, ticket-review flows, contact lists

## When NOT to Choose Master-Detail
| Scenario | Use Instead |
|---|---|
| Each item has extensive detail (many sections) | **Object Page** (dedicated detail view) |
| User processes items sequentially without needing the list open | **Worklist** |
| User needs to search across a large dataset first | **List Report** |
| Wide detail with charts and tables | **Analytical List Page** |

## The Key Differentiator
The question: **"Does the user need to keep the list visible while examining detail?"**

- Yes → **Master-Detail**
- No, single-object focus → **Object Page**
- No, just processing → **Worklist**

## Required Component Hierarchy
```
ShellBar
FlexibleColumnLayout
  beginColumn: (Master)
    DynamicPage
      title:   DynamicPageTitle (list title + count)
      header:  FilterBar (optional)
      content: SearchField
               List (mode: SingleSelectMaster)
                 StandardListItem × N
  midColumn: (Detail)
    DynamicPage
      title:   DynamicPageTitle (selected item's name)
                 actions: [Button("Save"), Button("Delete")]
      content: Panel + Form (item details)
  endColumn: (Sub-detail — OPTIONAL for 3-column layouts)
    Panel (related record, timeline, comments)
```

## Component Decisions
| Choice | Rules |
|---|---|
| List mode | SingleSelectMaster — one item highlighted at a time |
| List item | StandardListItem for simple, ObjectListItem for rich (icon + status + counts) |
| Column widths | Master 25–35% · Detail 65–75% (or 40/35/25 for 3-column) |
| Responsive | On mobile: master hides when detail opens; back button returns to master |
| Empty state | Detail column: `sapIllus-NoActivities` "Select an item to see details" |

## Empty State
- Master empty → IllustratedMessage in the list ("No items yet")
- No selection → IllustratedMessage in the detail column ("Select an item to see details")

## SAP Guidelines Reference
- https://experience.sap.com/fiori-design-web/flexible-column-layout/
