# 03 - Side Navigation

> Screenshot is kept private (local only). This .md is the source of truth — node ID, components, tokens, and layer structure are all here.


**Node ID:** 750:174158  
**File Key:** p7zm5EMBk5DRRZdxNeJ4f5  
**Screenshot:** 03-side-navigation.png  
**Dimensions:** 280 x 828px (isolated component view)

## Screen Description

Standalone SideNavigation component showing the full expanded navigation tree for the application. Shows the "Monitoring" section as currently selected (highlighted in blue).

## Navigation Structure

```
Overview                          >
Operations              |         v
  Operations
  Operation Templates
  Schedules
Automation Studio       |         v
  Content Management
  Provider Definitions
  Custom Operations
  Custom Hooks
  Custom Notifications
  Custom Processes
  Auto-Heal Configurations
UI Customizations       |         v
  Links
  Menu Items
[SELECTED] Monitoring   |         v   (blue highlight)
  Activities
  Logs
Configuration                     >
Configuration Ex...               >
Infrastructure                    >
```

## Key Properties

- Width: 260px (shown with 10px padding on each side = 280px total)
- Item height: 32px (compact)
- Nested items: 40px indent (16px → 40px left padding)
- Selected indicator: 3px solid `--sapList_HighlightColor` on left edge
- Selected background: `--sapList_SelectionBackgroundColor` (#ebf8ff)
- Group headers use SemiBold Duplex font, sub-items use Regular
- Two-click-area items (expandable groups) have separator + arrow on right side

## SAP Components Used

- SideNavigation
- NavigationItem (top-level, with icon + expand arrow)
- NavigationItem (sub-item, indented, no icon, Regular weight)
- Scrollbar

## Design Tokens

- Background: `--sapList_Background` (white)
- Text: `--sapList_TextColor` (#131e29)
- Selected BG: `--sapList_SelectionBackgroundColor` (#ebf8ff)
- Highlight: `--sapList_HighlightColor` (#0064d9)
- Border radius: `--sapButton_BorderCornerRadius` (8px)
- Shadow: `--sapContent_Shadow0`
- Font SemiBold: `Font/Weight/sapFontSemiboldDuplexFamily`
- Font Regular: `Font/Weight/sapFontFamily`
