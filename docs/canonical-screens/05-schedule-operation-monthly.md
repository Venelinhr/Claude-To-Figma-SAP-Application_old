# 05 - Schedule Operation (Monthly) — Activities View

**Node ID:** 750:174290  
**File Key:** p7zm5EMBk5DRRZdxNeJ4f5  
**Screenshot:** 05-schedule-operation-monthly.png  
**Dimensions:** 320 x 764px

## Screen Description

Mobile/narrow panel view of the Activities list for an operation. Shows a filterable list of activities with progress tracking. Despite task label "Schedule Operation (Monthly)", actual Figma name is "Activities View".

## Key Components

- **DynamicPageHeader** — Title "Activities View" (bold black), information icon, subtitle showing latest server time
- **FilterBar** — Name input (string) + Status select dropdown with add/clear filter buttons
- **Dialog Header** — "Activities (6)" with sort and column-settings buttons
- **Column Header** — "Name" label
- **List Items** — 3 activity entries shown (yanatest, Validate Instance, Validate System), each with:
  - Green success ObjectStatus icon
  - Bold activity name
  - "Actions" dropdown button (secondary)
  - "›" breadcrumb separator
  - Activity Number, Progress (100% with green bar + success icon), Note, Start Time metadata

## Progress Row Pattern

Each list item shows:
- `Progress: 100%` (bold)
- Green pill/bar (40px x 12px, `--sapPositiveTextColor` green)
- Green success checkmark ObjectStatus

## Layout Structure

```
DynamicPageHeader
  [Activities View] [ℹ️]
  Latest Server Time: 2026-07-08 13:29:43 (UTC)
FilterBar
  Name: [String input]
  Status: [Typed Text v] [×] [+]
Dialog Header
  Activities (6)                    [↕] [≡]
Column Header
  Name
ListItem (selected, blue border)
  [✓] yanatest  [Actions v]  ›
      Activity Number: 765
      Progress: 100% ████ [✓]
      Note:
      Start Time: 2026-07-06 12:22:48
ListItem
  [✓] Validate Instance  [Actions v]  ›
      Activity Number: 426
      Progress: 100% ████ [✓]
      ...
ListItem
  [✓] Validate System  [Actions v]  ›
      ...
```

## SAP Components Used

- DynamicPageHeader (compact)
- Icon (information)
- Label (Name, Status)
- Input (Name filter)
- Select (Status dropdown)
- Button (icon-only: decline/clear, add; icon+text: sort, customize)
- ObjectStatus (Success)
- Button (secondary, "Actions" with menu icon)
- ObjectAttribute (Activity Number, Progress, Note, Start Time)

## Design Tokens

- Background: `--sapShellColor` (white)
- Title: `--sapObjectHeader_Title_TextColor` (#131e29)
- Subtitle: `--sapObjectHeader_Subtitle_TextColor` (#556b82)
- Selection: `--sapList_SelectionBackgroundColor` (#ebf8ff)
- Selection border: `--sapList_SelectionBorderColor` (#0064d9)
- Success border: `--sapPositiveTextColor` (#256f3a)
- Label: `--sapContent_LabelColor` (#556b82)
- Title text: `--sapTitleColor` (#131e29)
- Progress bar: `--sapPositiveTextColor` (#256f3a)
