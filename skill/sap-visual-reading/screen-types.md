# Screen types and SAP floorplans

Use this file during Stage 4 — Screen Classification.

Always state the chosen floorplan AND the alternative considered, with justification for each decision.

---

## Classification index

| Screen type | SAP floorplan | Key signals |
|-------------|--------------|-------------|
| Dialog | sap.m.Dialog | Modal, fixed width, overlay, footer with Cancel + primary action |
| Confirmation dialog | sap.m.MessageBox | Short message, 2 buttons only, no form fields |
| Full-page form | sap.m.Page + SimpleForm | Not modal, full width, scrollable |
| List with filters | List Report (sap.ui.comp.smartfilterbar + sap.m.Table) | Filter bar at top, table below, toolbar with actions |
| Object detail | Object Page (sap.f.DynamicPage) | Header with key fields, collapsing header, sections with subsections |
| Step-by-step task | Wizard (sap.m.Wizard) | Numbered steps, linear progression, Next/Back buttons |
| Dashboard | Analytical List Page / Overview Page | Cards, KPIs, charts, no direct data entry |
| Settings | sap.m.Page + sap.m.List grouped | Grouped list items, right-arrow navigation, no table |
| Master-detail | Flexible Column Layout (sap.f.FlexibleColumnLayout) | Left list + right detail, responsive column switching |
| Empty state | Illustrated Message (sap.m.IllustratedMessage) | No data, illustration, CTA button |
| Search results | Worklist (sap.m.Page + sap.m.Table) | No filter bar, simpler than List Report |
| Mobile screen | sap.m.Page with bottom nav | Full-bleed, touch targets ≥44px, bottom navigation bar |
| Shell / app frame | sap.f.ShellBar + sap.m.SideNavigation | Top shell bar, left nav, content area |

---

## Decision rules

### Dialog vs Page
Choose **sap.m.Dialog** when:
- The task is atomic and interruptive
- The user must complete or cancel before returning to the main workflow
- Content fits within ~560px width without scrolling (or with minimal scrolling)
- A footer with Cancel + primary action is present

Choose **sap.m.Page** when:
- The content is too complex or long for a dialog
- The user needs full browser width
- The screen is the primary destination, not an overlay

### Object Page vs Full-page form
Choose **sap.f.DynamicPage / Object Page** when:
- The screen represents a business object (order, employee, product)
- Header contains key identifying fields
- Content is divided into named sections and subsections
- Edit mode switches the whole page

Choose **sap.m.Page + SimpleForm** when:
- The screen is purely a creation or configuration form
- No object identity header is needed
- The user fills fields and submits

### List Report vs Worklist
Choose **List Report** when:
- A dedicated filter bar with multiple filter fields is present
- The table has a toolbar with batch actions
- The page is the main entry point for finding objects

Choose **Worklist** when:
- Filtering is minimal (search field only)
- The list is task-oriented, not object-oriented
- No SmartFilterBar is needed

---

## SAP Fiori floorplan documentation references

- List Report: https://experience.sap.com/fiori-design-web/list-report-floorplan/
- Object Page: https://experience.sap.com/fiori-design-web/object-page/
- Wizard: https://experience.sap.com/fiori-design-web/wizard/
- Flexible Column Layout: https://experience.sap.com/fiori-design-web/flexible-column-layout/
- Overview Page: https://experience.sap.com/fiori-design-web/overview-page/
- Analytical List Page: https://experience.sap.com/fiori-design-web/analytical-list-page/

---

## Filter bar decision rule (from session learning)

| Filter field count | Recommended component |
|-------------------|-----------------------|
| 1–3 fields | Custom sap.m.VBox with sap.m.Select / sap.m.Input |
| 4–8 fields | sap.ui.comp.filterbar.FilterBar (built-in Go/Clear/Adapt) |
| 8+ fields | sap.ui.comp.filterbar.FilterBar + AdaptFilters dialog |

---

## Mobile viewport signals

When the image shows a mobile viewport (narrow, <480px equivalent):

- Use sap.m.ActionSheet instead of sap.m.Menu for overflow actions
- Use sap.m.Page instead of sap.f.DynamicPage if no collapsing header is needed
- Assume touch targets ≥44px — flag any control that appears smaller
- sap.m.IconTabBar collapses to scrollable tabs on mobile — confirm overflow behavior
- sap.m.Dialog full-screen on mobile — contentWidth has no effect on S breakpoint
