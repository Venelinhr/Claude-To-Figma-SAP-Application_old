# Test: Procurement Manager — Worklist

## Requirement

As a procurement manager, I need to review and approve pending purchase orders.
I need to see: PO number, supplier name, amount, and current status.
I process about 20–30 per day and need to approve or reject items in bulk.

## Expected Floorplan

**Worklist** — not List Report.

Rationale: Pre-scoped task queue (the user's own 20–30 pending approvals). The dataset is bounded, pre-filtered by role assignment, and the user is processing rather than discovering. No open-ended search is needed.

Competing floorplan rejected: **List Report** — would require FilterBar and VariantManagement, which are unnecessary when the system already knows which records belong to this user.

## Expected Components

- ShellBar
- DynamicPage
  - DynamicPageTitle (with page title, no VariantManagement)
  - NO DynamicPageHeader (Worklist has no collapsible header/FilterBar)
  - Table (Responsive, MultiSelect)
    - OverflowToolbar with Approve (primary-action) + Reject (destructive) buttons
    - Columns: PO Number, Supplier, Amount, Status
    - Rows: ColumnListItem with ObjectIdentifier, Text, ObjectNumber, ObjectStatus
- IllustratedMessage (empty state)

## Expected meta

- validationStatus: "pass"
- unverifiedComponents: []
- floorplan: "worklist"
- density: "compact"
- theme: "sap_horizon"

## Scoring (sapui5-llm-ready criteria)

| Criterion | Points |
|---|---|
| Correct floorplan (Worklist not List Report) | 25 |
| No FilterBar / DynamicPageHeader | 10 |
| No VariantManagement | 5 |
| All components in registry | 20 |
| props = non-default only | 10 |
| Sample data realistic and varied | 10 |
| ObjectStatus with semantic states | 10 |
| IllustratedMessage for empty state | 5 |
| spec-schema.json valid | 5 |
| **Total** | **100** |

**Target: ≥ 85/100**
