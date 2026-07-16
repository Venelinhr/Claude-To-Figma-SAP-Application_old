---
name: sector-based-reference-reading
description: "VDI skill step (NOT a rule): when a reference is shared, divide into labeled sectors A/B/C, analyze each independently (A→B→C…), local recommendation per sector, then merge. Lives in sap-visual-reading, not SYSTEM_PROMPT rules."
metadata: 
  node_type: memory
  type: feedback
  severity: guidance
  see_also: 
    - reference_activities_view_canonical
  originSessionId: 8f1e0953-d5bb-448c-8c6b-dc4220c65f91
---

# Sector-Based Reference Reading (VDI skill step)

**Applies-to:** all-builds, reference-analysis, image, figma-node

**Signal:** "when user refers to an image — divide into sectors, read each and propose floorplan + components, then move on (A→B→C…) — makes reading less complex. This is for the VDI skill and step — DON'T add a new RULE for it."

**What-worked:** Reading a complex reference sector-by-sector instead of all-at-once. Divide → analyze one sector fully → local recommendation → next sector → merge. Understand each part before the whole.

**Why:** A complex enterprise screen read as one flat image causes missed elements, generic component choices, and wrong floorplans. Breaking it into labeled sectors (A/B/C…) makes each unit manageable, improves recognition accuracy, and prevents omissions. Confirmed by user's own illustrated examples (flight card A/B/C/D, Schedule dialog bands, SAP LaMa A→B→C→D→E).

**How-to-apply:**
- This is a **VDI skill step, NOT a RULE.** It lives in `skill/sap-visual-reading/SKILL.md` Stage 2 + `skill/sap-visual-reading/sector-analysis.md`. RULE 17 only cross-references it. Do not create a new numbered RULE for it.
- Phase 1 divide into labeled sectors (natural structure, not fixed grid).
- Phase 2 analyze ONE sector at a time in reading order (top-left → A→B→C → next row → bottom-right); finish each before the next.
- Phase 3 local recommendation per sector (floorplan contribution, components, layout, interaction, a11y).
- Phase 4 merge: connect regions, resolve dependencies, build hierarchy, pick overall floorplan, validate coherence — then plan.
- Output a labeled sector map before the ASCII wireframe.

**Evidence:** 2026-07-16, user directive + 3 illustrated reference examples. Placed in VDI skill (no new rule), highest RULE stays 30.

## Related
[[feedback_match_reference_width]] [[feedback_always_propose_layer_structure]] [[reference_activities_view_canonical]]
