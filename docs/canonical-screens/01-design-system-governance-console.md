# 01 - Design System Governance Console

**Node ID:** 750:177443  
**File Key:** p7zm5EMBk5DRRZdxNeJ4f5  
**Screenshot:** 01-design-system-governance-console.png  
**Dimensions:** 1440 x 825px

## Screen Description

Full-page governance console for managing design system component proposals. Uses a side navigation + DynamicPage header layout with an IconTabBar for tab navigation.

## Key Components

- **ShellBar** — top application header with search, notifications, help, avatar
- **SideNavigation** — 224px fixed sidebar with 11 navigation items (grouped under headings with expand/collapse)
- **DynamicPageHeader** — breadcrumb + page title "Design System Governance" + toolbar actions (SplitButton)
- **IconTabBar** — 3 tabs: first tab, second tab (Component Proposals), third tab
- **DynamicSideContent** — two-column layout:
  - Main (848px): Panel "Pending Component Proposals" with OverflowToolbar + SAP Table (searchfield, multi-column data)
  - Side (320px): Panel "Review Focus — This Week" with Calendar + MessageStrip

## Layout Structure

```
ShellBar (1440 x 52)
AppLayout (1440 x 773)
  Sidebar (224px)
    SideNavigation
      Navigation Items (11 visible)
      Footer (Quick Create + Settings)
  Content (1216px)
    DynamicPageHeader (104px tall)
      Breadcrumb
      PageTitle + Toolbar Actions
    Bar (44px) — filter bar
    IconTabBar (44px)
    DynamicSideContent (557px)
      Main Content (848px) — Table with proposals
      Side Content (320px) — Calendar + status
```

## SAP Components Used

- ShellBar
- SideNavigation + NavigationItem
- DynamicPageHeader
- Breadcrumb
- Toolbar (Compact)
- IconTabBar + Tab
- DynamicSideContent
- Table + TableCell
- SearchField
- Calendar / DatePicker
- MessageStrip
- SplitButton

## Design Tokens

- Background: `--sapBackgroundColor` (#f5f6f7)
- Shell: `--sapShellColor` (white)
- List: `--sapList_Background`, `--sapList_BorderColor`
- Text: `--sapList_TextColor` (#131e29)
- Label: `--sapContent_LabelColor` (#556b82)
- Title: `--sapObjectHeader_Title_TextColor`
- Highlight: `--sapList_HighlightColor` (#0064d9)
