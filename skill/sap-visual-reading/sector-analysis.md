# Sector-Based Reference Reading — the VDI analysis method

> The mandatory way to read ANY reference (image, screenshot, Figma frame, PDF, sketch, wireframe,
> whiteboard). **Never analyze the whole screen as one unit.** Divide into sectors, read each
> independently, then synthesize. Operationalizes RULE 17. Invoked from Stage 2 of `SKILL.md`.
>
> **Guiding principle: understand each PART before understanding the whole.**

Reduces cognitive complexity · prevents missed UI elements · improves component recognition · more
accurate floorplan selection · better parent-child relationships · more reliable layout reconstruction.

---

## Phase 1 — Divide the reference

Before identifying any SAP component, partition the screen into logical sectors following the
interface's **natural structure** (not a fixed grid). Label each with a letter.

```
Simple:                 Complex:
A | B                   A → Header       E → Main Content
-----                   B → Navigation   F → Side Panel
C | D                   C → Toolbar      G → Footer
                        D → Filters
```
Goal: manageable analysis units.

## Phase 2 — Analyze one sector at a time

Process sectors sequentially in a consistent reading order:
```
Top-Left
   ↓
A → B → C
   ↓
D → E → F
   ↓
Bottom-Right
```
For EACH sector determine, before moving on:
- Business purpose
- Information hierarchy
- Candidate SAP floorplan / layout pattern
- SAP Web UI Kit components
- Parent-child relationships
- Auto Layout structure
- Spacing and alignment
- Typography and tokens
- User interactions
- Dependencies on neighboring sectors

Complete the analysis before moving to the next sector.

## Phase 3 — Local recommendation (per sector)

For every sector, produce an internal recommendation:
- Best SAP floorplan contribution
- Recommended SAP components
- Layout strategy
- Grouping / containment
- Interaction patterns
- Accessibility considerations

Think locally before thinking globally.

## Phase 4 — Merge into a unified architecture

Only after ALL sectors are analyzed:
1. Connect related regions.
2. Resolve dependencies between sectors.
3. Build the complete screen hierarchy.
4. Select the overall SAP floorplan.
5. Validate the assembled architecture is a coherent SAP Fiori app.

Only then begin implementation planning.

---

## Worked examples (from user references, 2026-07-16)

**Flight result card** → A: checkboxes + flight legs · B: badges + stop type · C: duration · D: price + CTA.
**Schedule dialog** → A: header · B: timing (start date/time) · C: recurrence + type · D: monthly pattern · E: end date + footer.
**SAP Landscape Mgmt (wide)** → A: ShellBar · B: side navigation · C: activities list · D: steps detail · E: messages/log panel.

Each sector was read + mapped independently (A→B→C→…), then merged.

## Required output
A labeled sector map (A/B/C…) with each sector's local recommendation, produced BEFORE the merged
architecture and BEFORE the ASCII wireframe. Every sector accounted for — Zero-Omission (RULE 17).

Cross-refs: RULE 17 (divide-and-conquer), RULE 18 (spatial measure), RULE 30 (measure width), SKILL.md Stage 2.
