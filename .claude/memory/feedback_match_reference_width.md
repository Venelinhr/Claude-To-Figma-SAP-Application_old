---
name: match-reference-width-not-default
description: "[hard-rule] Default width = 1440px, BUT measure the shared reference and build at ITS width (e.g. ~340/320px narrow). User instruction on width always wins."
metadata: 
  node_type: memory
  type: feedback
  severity: hard-rule
  see_also: 
    - reference_activities_view_canonical
    - reference_yanatest_canonical_build
  originSessionId: 8f1e0953-d5bb-448c-8c6b-dc4220c65f91
---

# Match the reference width — don't force the 1440 default

**Applies-to:** all-builds, list-report, object-page, dialog

**Signal:** "after user shares a reference image around 340px — measure this screen and build it with this size. 1440px is default, but you can and will follow references and user instruction. If user wants 1440 → do it."

**Mistake:** Building at the 1440px desktop default when the shared reference is clearly a narrow width (~320–390px), instead of measuring the reference and matching it. (Also seen as yanatest F2: assumed ~390px mobile, was 320px — should have measured, not assumed.)

**Why:** The reference is the source of intent. A screen designed at ~340px (narrow master column / mobile / FCL detail pane) rebuilt at 1440px is the wrong screen — wrong proportions, wrong component density, wrong layout. Width is a first-class measured property, not a default to apply blindly.

**How-to-apply:**
1. **No reference / nothing specified** → default 1440px (desktop).
2. **Reference image or Figma node shared** → MEASURE it (image dimensions, or `get_metadata`/`get_design_context` width) and build at THAT width. ~320–390px → narrow; ~768 → tablet; ~1440 → desktop.
3. **User states a width** ("make it 1440", "use 768", "tablet") → that ALWAYS wins over both the default and the measured reference. Do it.
4. Confirm the width in the ASCII wireframe proposal so it's agreed before building (part of the RULE 19 gate).
5. Precedent: Activities View + yanatest + Purchase Orders were all built at 320px because the references were narrow — matched, not defaulted.

**Evidence:** 2026-07-16, user directive; corroborated by yanatest F2 width-assumption failure.

## Related
[[reference_activities_view_canonical]] [[feedback_ascii_wireframe_mandatory]] [[feedback_always_propose_layer_structure]]
