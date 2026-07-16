# 06 - Activities View (Validate System Log Panel)

**Node ID:** 750:174442  
**File Key:** p7zm5EMBk5DRRZdxNeJ4f5  
**Screenshot:** 06-activities-view.png  
**Dimensions:** 694 x 793px

## Screen Description

A floating panel/dialog showing the "Validate System" step details with system validation log messages. This is a panel that overlays the main content — it has a shadow and rounded corners like a dialog. Despite the task label "Activities View", actual Figma name is "Validate System" log panel.

## Key Components

- **DynamicPageHeader** — Title "Validate System", subtitle "Step | ID 1 | Activity Number 765", toolbar (Hide Filters, full-screen, close)
- **FilterBar** — Message text input + Severity select + clear/add filter buttons
- **Dialog Header (sticky)** — "Messages (10)" + SegmentedButton (All/Platform/AI/Analytics) + sort + column-settings
- **Message List** — Log entries with severity badge + message code + timestamp + body text

## Severity Badge Colors

| Severity | Background | Text |
|---|---|---|
| Trace | `--sapIndicationColor_8b_Hover_Background` (#f4bcff) | Purple (#7b3d9e) |
| Debug | `--sapIndicationColor_7b_Hover_Background` (#cdc1ff) | Indigo (#5b44c0) |
| Information | `--sapIndicationColor_5b` (#d9ebff) | Blue (`--sapButton_Emphasized_Background`) |

## Log Entry Structure

Each entry:
```
[Severity Badge] | Message Code: <code>
Time: <timestamp> (blue, small)
<message body> (black, wrapping)
```

## Layout Structure

```
Panel (rounded 8px, shadow)
  DynamicPageHeader
    Title: Validate System
    Toolbar: [Hide Filters] [⛶] [×]
    Subtitle: Step | ID 1 | Activity Number 765
  FilterBar
    Message: [String]   Severity: [Select Value v]   [+filter] [×filter]
  Dialog (rounded top 8px, shadow)
    Dialog Header
      Messages (10)  [All] [Platform] [AI] [Analytics]  [↕] [⚙]
    Message List (7 entries shown)
      [Trace] | Message Code: LVM
      Time: 2026-07-06 12:22:48
      Serialized Trace ID: 5edcc166...
      ...
```

## SAP Components Used

- DynamicPageHeader
- Toolbar (Compact)
- Button (icon-only: full-screen, decline/close)
- Button (text: "Hide Filters")
- Label
- Input (Message filter)
- Select (Severity)
- Button (icon-only: clear-filter, add-filter)
- SegmentedButton (Compact, Text: All/Platform/AI/Analytics)
- Button (icon-only: sort, action-settings)
- Custom log entry rows (not standard SAP Table)

## Design Tokens

- Panel background: `--sapBackgroundColor` (#f5f6f7)
- Dialog background: `--sapShellColor` (white)
- Panel shadow: `Page Shadow` (0px 2px 8px rgba(0,0,0,0.15))
- Header text: `--sapObjectHeader_Title_TextColor` (#131e29)
- Header subtitle: `--sapObjectHeader_Subtitle_TextColor` (#556b82)
- H5 Bold: 16px font size header
- Timestamp: `--sapButton_Emphasized_Background` (#0070f2) blue
- Small text: `--sapFontSmallSize` (12px)
