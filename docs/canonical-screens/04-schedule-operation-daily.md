# 04 - Schedule Operation (Daily) — yanatest Steps

**Node ID:** 750:174190  
**File Key:** p7zm5EMBk5DRRZdxNeJ4f5  
**Screenshot:** 04-schedule-operation-daily.png  
**Dimensions:** 320 x 808px

## Screen Description

Mobile/narrow panel view showing the Steps tab of an activity called "yanatest". Shows a list of operation steps with filter controls and a single selected step item with metadata.

## Key Components

- **DynamicPageHeader** — Title "yanatest", subtitle "Activity | Activity Number 765", overflow button (...)
- **IconTabBar** — Inline mode, 2 tabs: "General" and "Steps" (active/selected, shown with underline)
- **Dialog Header** — "Steps (1)" heading with filter toggle ("Hide Filters"), sort and column-settings icon buttons
- **FilterBar** — Status select dropdown + Operation string input with add/clear filter buttons
- **Section Header** — "Operation" section label
- **List Item (selected)** — "Validate System" with:
  - Green success ObjectStatus icon
  - Metadata: ID: 1, Next:, Previous:, Hook for ID:
  - Blue left selection border (3px)

## Layout Structure

```
DynamicPageHeader (compact)
  Title: yanatest
  Subtitle: Activity | Activity Number 765
  Overflow (...)
IconTabBar
  General | [Steps]
Dialog Header (sticky)
  Steps (1) | [Hide Filters] | sort | settings
FilterBar
  Status [Select v]
  Operation [String input] [+ filter] [x filter]
Section Header: Operation
ListItem (selected, blue border)
  [✓] Validate System >
      ID: 1
      Next:
      Previous:
      Hook for ID:
```

## SAP Components Used

- DynamicPageHeader (small/compact variant)
- IconTabBar (Inline, Non-Semantic)
- Label
- Select (Status dropdown)
- Input (Operation string filter)
- Button (icon-only: sort, action-settings, add-filter, clear-filter)
- ObjectStatus (Success/green)
- ObjectAttribute (ID, Next, Previous, Hook for ID labels)

## Design Tokens

- Background: `--sapBackgroundColor` (#f5f6f7)
- Object header: `--sapObjectHeader_Background` (white)
- Object header title: `--sapObjectHeader_Title_TextColor` (#131e29)
- Object header subtitle: `--sapObjectHeader_Subtitle_TextColor` (#556b82)
- Selected item: `--sapList_SelectionBackgroundColor` (#ebf8ff)
- Success border: `--sapPositiveTextColor` (#256f3a)
- Header shadow: `sapContent_HeaderShadow`
- Font H5 Bold: 16px, `Font/Weight/sapFontBoldFamily`
