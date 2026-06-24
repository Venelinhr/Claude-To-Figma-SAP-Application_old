# Object Page Floorplan

## What It Is
The Object Page displays all information about a **single business object** — a purchase order, a supplier, an employee, a product. It uses a sticky header with object identity (name, status, key attributes) and scrollable sections below for related data.

## When to Choose Object Page
- The screen represents one specific entity (one PO, one supplier, one document)
- The entity has multiple aspects/groups of information (General, Line Items, Approval History, Attachments)
- The user needs to edit the entity or trigger actions on it
- The screen is reached by navigating from a List Report or Worklist (detail view)
- The entity has 3 or more logical sections of content

## When NOT to Choose Object Page
| Scenario | Use Instead |
|---|---|
| Browse/search across multiple entities | **List Report** |
| Process a task queue | **Worklist** |
| Simple form with 1 group of fields | **DynamicPage** with form content |
| KPI overview | **Overview Page** |

## Required Component Hierarchy
```
ShellBar (or none if inside FlexibleColumnLayout)
ObjectPageLayout
  headerTitle: ObjectPageDynamicHeaderTitle
                 objectTitle: "Purchase Order 4500012345"
                 objectSubtitle: "Office Supplies — Müller GmbH"
                 image: Avatar (or product image)
                 actions: [Button(Edit), Button(Delete)]
                 statusIndicator: ObjectStatus(text: "Approved", state: "Success")
  headerContent: [
    ObjectStatus(text: "EUR 1,250.00", title: "Amount"),
    ObjectStatus(text: "2026-06-15", title: "Requested"),
    ObjectStatus(text: "Approved", state: "Success", title: "Status")
  ]
  sections: [
    ObjectPageSection(title: "General Information")
      subSections: [
        ObjectPageSubSection(title: "Details")
          blocks: [SimpleForm(...)]
      ]
    ObjectPageSection(title: "Line Items")
      subSections: [
        ObjectPageSubSection
          blocks: [Table(...)]
      ]
    ObjectPageSection(title: "Approval History")
      subSections: [
        ObjectPageSubSection
          blocks: [Timeline(...)]
      ]
  ]
  footer: OverflowToolbar (draft save pattern)
    Button(Save, type: Emphasized)
    Button(Discard)
```

## Header: ObjectPageDynamicHeaderTitle vs ObjectPageHeader
Always use `ObjectPageDynamicHeaderTitle` in Horizon. The older `ObjectPageHeader` is deprecated.

## Section Navigation
| useIconTabBar | When |
|---|---|
| `false` (anchor navigation) | ≥5 sections, user needs to see section names while scrolling |
| `true` (tab bar) | ≤5 sections, navigation is primary UX (not scrolling) |

## Edit Mode
Object Page has two modes: **display** and **edit**. Key differences:
- Display: fields shown as `ObjectAttribute`, `Text`, `ObjectStatus`
- Edit: same fields shown as `Input`, `Select`, `DatePicker`
- Toggle via single `Edit` button in headerTitle actions
- Footer appears in edit mode with Save/Cancel (draft pattern) or Save/Discard (immediate save)

## Draft Save Pattern
For complex edit flows use the draft pattern:
- `showFooter: true`
- Footer: `Button(Save, type: Emphasized)`, `Button(Discard)`
- Object title shows "(Draft)" suffix
- Auto-save indicator in title area

## Component Decisions
| Choice | Rules |
|---|---|
| Edit trigger | Single `Edit` button in header actions — never inline edit on Object Page |
| Status display | `ObjectStatus` with semantic state colors in both header and sections |
| Related items | Table in a dedicated section — not mixed with form fields |
| Attachments | Dedicated section, always last |

## SAP Guidelines Reference
- https://experience.sap.com/fiori-design-web/v1-145/ui-elements/object-page/
