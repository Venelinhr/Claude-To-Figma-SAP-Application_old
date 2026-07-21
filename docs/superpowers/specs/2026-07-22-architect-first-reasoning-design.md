# Architect-First Reasoning for Text Requests — Design Spec

**Date:** 2026-07-22
**Status:** approved-for-implementation (pending user spec review)
**Author:** brainstorming session (option A + reorder-existing)

## Problem

A plain **text** business request ("build an approvals screen for warehouse managers")
jumps too quickly to component selection. A senior SAP Product Designer would first
translate the request into an **information architecture**, then a **floorplan**, and only
then SAP components. Two concrete defects:

1. **Wrong order.** The 7 reasoning-brain artifacts (RULE 20) run at *Stage 1.5 — AFTER
   the floorplan is confirmed (Step 2) and the wireframe is approved (Step 3)*. Floorplan
   is thus an *input* to reasoning, not an *output* of it. Architect-first requires the
   reverse: reason about business + IA, and let the floorplan fall out of that.
2. **Image-shaped only.** Gate 0 is "analyze the reference via VDI." A text request has no
   image, so the front-end is weak — there is no equivalent "understand the business" step.

Enforcement was already fixed (2026-07-21, commit `3118bb9`): `guard-architect-gate.sh`
(Gate 0.5) BLOCKS a new-from-text build until `.architect-approved` exists. This spec
supplies the **content + ordering** that gate enforces.

## Scope (option A)

- **Text requests only.** Image/reference requests keep the existing Gate 0→3 VDI flow —
  the reference image already carries the architecture; VDI reads it. (User: "the steps
  are very similar and cover this for text.")
- **Reuse, don't replace (option A).** The 7 reasoning-brain artifacts already map 1:1 to
  the 8-phase methodology. We REORDER and re-scope them; we do NOT author a competing
  methodology doc (that is exactly the drift the SSOT work just eliminated).
- Gate 0.5 already skips canonical clones (`.reuse-declared` L1–4) and repairs.

## The reorder (artifact → phase → gate)

| Seq | Existing artifact (reused) | Methodology phase | Enforced at |
|---|---|---|---|
| 1 | Intent Card | Ph1 Understand the business | Gate 0.5 (brief) |
| 2 | Business Entity Model | Ph2 Functional requirements | Gate 0.5 (brief) |
| 3 | Layout Blueprint (region tree / IA) | Ph3 Information architecture | Gate 0.5 (brief) |
| 4 | Screen Classification → **Floorplan + rationale** | Ph4 Select floorplan | Gate 0.5 → `.architect-approved` |
| 5 | Component Planning Table | Ph5 Map to SAP components | Gate 3 (wireframe) |
| 6 | Relationship Graph | Ph6 Screen blueprint | Gate 3 |
| 7 | Composition Pre-check | Ph7 Validate | pre-build (Gate 4/5) |

**Key change:** artifacts 1–4 run and are approved (`.architect-approved`) BEFORE the
ASCII wireframe. The floorplan is produced by artifact 4 (Screen Classification driven by
the IA), not confirmed up front. Ph8 (implement) is the existing build path unchanged.

## Canonical flow (text request)

```
TEXT request (no image, no clone)
  → Gate 0.5a  Intent Card + Business Entity Model      (understand business + reqs)
  → Gate 0.5b  Layout Blueprint (region tree / IA)      (structure before components)
  → Gate 0.5c  Screen Classification → Floorplan + why  (floorplan falls out of IA)
  → USER APPROVES architecture  → .architect-approved   (guard-architect-gate.sh)
  → Gate 3     ASCII wireframe + L1–L5 (+ Component Planning Table, Relationship Graph)
  → USER APPROVES wireframe      → .wireframe-approved
  → Gate 4/5   Composition Pre-check → build (real SAP instances / clone)
```

Image request is unchanged: `Gate 0 (VDI) → Gate 1 → Gate 2 → Gate 3 → build`.

## Changes (files)

1. **`skill/agents/reasoning-brain.md`** — rewrite "When to Run": for a TEXT request the
   agent runs FIRST (before floorplan/wireframe) and its Screen Classification PRODUCES the
   floorplan. Reorder the artifact presentation so 1→4 form the architecture brief and
   5→7 follow at wireframe/pre-build. Add an explicit "text-request entry" note. Keep all 7
   artifact templates and the confidence machinery intact.
2. **`skill/SYSTEM_PROMPT.md`** — document Gate 0.5 in the canonical gate sequence for text
   requests (before Gate 3); note images enter at Gate 0. Cross-reference reasoning-brain.
   Do NOT restate the artifact templates (single source = reasoning-brain.md).
3. **`.claude/skills/sap-screen/SKILL.md`** — add the text-request front-end steps
   (Gate 0.5a/b/c → architecture approval) ahead of the wireframe step; point to
   reasoning-brain for the artifact templates.
4. **`CLAUDE.md`** — the Gate 0.5 section (added 2026-07-21) gets the artifact→phase map so
   the always-loaded doc reflects the ordering. Pointer only, no restatement.
5. **Enforcer** — `guard-architect-gate.sh` already built + wired (commit `3118bb9`). No
   code change; this spec makes the content it gates real.

## Non-goals (YAGNI)

- No new methodology document (option C rejected — would create a 6th source).
- No change to the image/VDI flow.
- No change to the enforcement hook (already done and tested 5/5).
- No auto-generation of the brief — the agent produces it; the USER approves it (the whole
  point is human sign-off on the architecture).

## Success criteria

- A text request produces Business Statement → IA → Floorplan+rationale, approved, BEFORE
  any component is named — and the build gate blocks otherwise.
- The floorplan is *justified from the IA*, never defaulted.
- Zero duplication: the 7 artifacts live only in reasoning-brain.md; every other doc points
  to it.
- Image builds are unaffected (regression suite + existing gates stay green).
- The screen "feels designed by a senior SAP Product Designer," not generated from keywords.

## Validation

- `guard-architect-gate.sh` 5/5 tests still pass (block text-new / skip clone / skip repair
  / pass approved / pass read-only).
- `ci-drift-gate.sh` green (no new hand-copied data introduced).
- Regression suite clean.
- Manual: a sample text request walks the new order end-to-end.
