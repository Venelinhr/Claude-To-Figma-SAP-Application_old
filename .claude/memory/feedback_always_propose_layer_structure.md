---
name: always-propose-layer-structure
description: "Pre-build proposal MUST include the L1-L5 layer structure, not just ASCII wireframe + component list. User flagged this as a repeated miss."
metadata: 
  node_type: memory
  type: feedback
  severity: hard-rule
  see_also: 
    - feedback_layer_naming_standards
    - feedback_ascii_wireframe_mandatory
  originSessionId: 8f1e0953-d5bb-448c-8c6b-dc4220c65f91
---

# Always propose the L1–L5 layer structure before building

**Applies-to:** all-builds

**Signal:** "you missed layer structure to suggest! Don't forget about it — it's important"

**Mistake:** Presented the pre-build proposal with only the ASCII wireframe + a component table, omitting the explicit L1–L5 layer/naming hierarchy the build will produce.

**Why:** L1–L5 semantic naming is one of the 3 hard build rules. If the layer tree isn't agreed up front, the build produces generic/wrong names (Frame 1, Group) or an unclear hierarchy, and it can't be reviewed before it's built. The wireframe shows *what it looks like*; the layer structure shows *how it's named and nested* — both are required for approval.

**How-to-apply:** Every pre-build proposal (Step before RULE 19 approval) MUST include THREE things: (1) ASCII wireframe, (2) SAP component list with clone sources, (3) the full L1–L5 layer structure tree with semantic names. Never present the wireframe without the layer tree.

**Evidence:** 2026-07-16, user correction during procurement List Report build.
