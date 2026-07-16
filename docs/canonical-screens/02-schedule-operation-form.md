# 02 - Schedule Operation Form (Outage List Overview)

**Node ID:** 750:174556  
**File Key:** p7zm5EMBk5DRRZdxNeJ4f5  
**Screenshot:** 02-schedule-operation-form.png  
**Dimensions:** 1440 x 776px

## Screen Description

List report showing outage incidents. Despite the task label "Schedule Operation Form", the actual Figma frame name and content is "Outage List Overview" — a full-page list report with sidebar navigation, filter bar, and a data table of outage records.

## Key Components

- **SideNavigation** — 224px sidebar with 3 nav items: "New Outage Checklist Form", "Outage List Overview" (active/selected), "Tool Registry"
- **DynamicPageHeader** — Title "Outage List Overview", subtitle "10 records total", Toolbar with "Manage Teams", "Tool Registry", "+ New Outage" (emphasized) actions
- **FilterBar** — SearchField + 2 Select dropdowns (All tools, All statuses) + 2 DatePicker inputs (From date, To date)
- **Table** — 8 columns: ID (Link), TOOL, OUTAGE TYPE, STARTED AT (UTC), RECEIVED AT (UTC), STATUS (ObjectStatus), UPDATED AT, UPDATED BY
- **ObjectStatus** — colored status indicators: Success (green), NEW (blue), UPDATED (blue/orange), CLOSED (blue), ERROR (red)

## Table Data Sample

| ID | TOOL | TYPE | STATUS |
|---|---|---|---|
| OC-SPC001 | SPC (NZA) | Disruption | Success |
| OC-TIC002 | Plato / TIC | Disruption | NEW |
| OC-LAM005 | LAMA (LVP, LV2…) | Disruption | UPDATED |
| OC-WTS003 | ECS WTS | Degradation | NEW |

## Layout Structure

```
AppLayout (1440 x 776)
  Sidebar (224px)
    SideNavigation (3 items, "Outage List Overview" selected)
  Content (1216px)
    DynamicPageHeader
      PageTitle "Outage List Overview"
      Toolbar (Manage Teams, Tool Registry, + New Outage)
      Subtitle "10 records total"
    FilterBar (60px)
      SearchField + Select x2 + DatePicker x2
    ContentArea
      Table
        Header Row (8 columns)
        10 data rows with ObjectStatus
```

## SAP Components Used

- SideNavigation + NavigationItem
- DynamicPageHeader
- Toolbar (Compact)
- FilterBar (custom, not sap.ui.comp.filterbar)
- SearchField
- Select (2x)
- Input / DatePicker (2x)
- Table + ColumnListItem
- Link
- ObjectStatus

## Design Tokens

- Background: `--sapBackgroundColor` (#f5f6f7)
- Shell: `--sapShellColor` (white)
- Link: `--sapLinkColor` (#0064d9)
- Positive: `--sapPositiveTextColor` (#256f3a)
- Informative: `--sapInformativeTextColor` (#0064d8)
- Critical: `--sapCriticalTextColor` (#b44f00)
- Negative: `--sapNegativeTextColor` (#aa0808)
- Selection BG: `--sapList_SelectionBackgroundColor` (#ebf8ff)
