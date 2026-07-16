---
name: procurement-list-report-canonical
description: "⭐ CONFIRMED 'perfect, bravo' — Purchase Orders List Report (804:44859, 320px). Clone from Activities View, adapt to PO. Exact tokens/measurements. READ BEFORE any procurement/PO/approval List Report build."
metadata: 
  node_type: memory
  type: feedback
  severity: canonical
  see_also: 
    - reference_activities_view_canonical
    - canonical_complex_screens_18
  originSessionId: 8f1e0953-d5bb-448c-8c6b-dc4220c65f91
---

# Purchase Orders List Report — Canonical (2026-07-16, user: "This is perfect! Bravo")

**Applies-to:** list-report, procurement, purchase-order, approval, table

**Signal:** "This is perfect! Bravo" — confirmed on node `804:44859` in file `p7zm5EMBk5DRRZdxNeJ4f5`.

**What-worked:** Cloned the canonical Activities View (`615:36810`), then adapted content to procurement. Cloning preserved all real SAP instances + token bindings automatically (RULE 28) — no native frames, no re-derivation. Repurposed the list-item meta rows to PO semantics.

**Why:** A List Report for "approve pending POs daily" is structurally identical to Activities View (DPH + Filter Bar + Dialog Header + list items with status). Cloning the confirmed-canonical node and swapping content is faster and higher-quality than building fresh, and inherits the exact spacing/tokens that were already approved.

**How-to-apply (procurement List Report recipe):**
1. Clone `615:36810` (Activities View, 320px). Rename L1 → the screen name.
2. Header: Page Title text → "Purchase Orders"; subtitle → count + timestamp.
3. Filter Bar: relabel to your filters (Supplier / Status).
4. Dialog Header title → "Purchase Orders (N)"; **widen Header Start frame (~150px) + set title textAutoResize=WIDTH** or it truncates to "Purchase Orders (...".
5. Per list item, repurpose the meta rows:
   - Entry title text → PO number (72:Bold 14px, `sapTitleColor` #131e29, w≥90)
   - "Activity Number Row" → **Supplier:** (label `sapContent_LabelColor` #556b82 w60) + value (72:Bold `sapTitleColor` w160)
   - "Progress Row" → **Amount:** (label w50) + € value (72:Bold w110); **hide the Progress Bar frame + hide the row-level ObjectStatus checkmark** (status lives in the entry header)
   - "Note Row" → **Dept:** + value
   - "Start Time Row" → **Requested:** + date
6. Entry-header ObjectStatus semantics: `setProperties({Semantic:'Warning'})` for Pending, `'Success'` for Approved. Rename instance accordingly.
7. Actions = MenuButton (Secondary, Compact) — already in the clone.

**Confirmed tokens/measurements (from get_design_context on 804:44882):**
- List item: `bg sapList_SelectionBackgroundColor #ebf8ff` (selected) · bottom border `sapList_SelectionBorderColor #0064d9`
- Success rail: 3px, `sapPositiveTextColor #256f3a`
- Item Content: flex-col, gap 6px, padding 12px
- Entry Header: flex-row, gap 8px, items-center
- Meta Block: flex-col, gap 4px, pl 26px, text 13px
- Meta label: `72:Regular` `sapContent_LabelColor #556b82`; value: `72:Bold` `sapTitleColor #131e29`
- Fonts: MediumText/LHAuto/Regular (400) + Bold (700), sapFontSize 14; Button `72 Semibold Duplex` 600

**Evidence:** 2026-07-16, node 804:44859 (saved next to 197:102160), confirmed "perfect, bravo", canonical confidence.

## Related
[[reference_activities_view_canonical]] [[canonical_complex_screens_18]] [[feedback_always_use_sap_instances]] [[feedback_always_propose_layer_structure]]
