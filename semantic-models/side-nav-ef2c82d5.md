<!-- vdiVersion: 1.0 | sha8: ef2c82d5 -->
# Side Navigation — Semantic Model

## Zones
- Full-height nav panel ~280px wide, white bg, scrollable

## Components
- SideNavigation panel (white bg, right scrollbar)
- 8 SideNavigationItem top-level rows (icon + bold label + | divider + chevron)
- SideNavigationSubItem rows (indented, regular weight, no icon)
- Active: "Monitoring" row — blue tint bg + 2px left blue border

## Items
Overview [icon:grid] collapsed
Operations [icon:workflow] expanded → Operations / Operation Templates / Schedules
Automation Studio [icon:gear-cog] expanded → Content Management / Provider Definitions / Custom Operations / Custom Hooks / Custom Notifications / Custom Processes / Auto-Heal Configurations
UI Customizations [icon:person-gear] expanded → Links / Menu Items
Monitoring [icon:bar-chart] expanded SELECTED → Activities / Logs
Configuration [icon:wrench] collapsed
Configuration Ex... [icon:wrench-plus] collapsed
Infrastructure [icon:network] collapsed

## Tokens
sapShellColor #FFFFFF — panel bg
sapList_SelectionBackgroundColor #EBF8FF — active row bg
sapList_SelectionBorderColor #0064D9 — active left border
sapList_TextColor #131E29 — all labels
sapShell_BorderColor #D9D9D9 — | divider + bottom border
sapTitleColor #1D2D3E — bold group labels
