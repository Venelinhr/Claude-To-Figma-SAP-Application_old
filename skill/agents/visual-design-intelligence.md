# Visual Design Intelligence Agent

> Pipeline note: the default build path is RULE 25 MCP-first (`use_figma` + plugin bind). This agent is pure ANALYZE within ANALYZE→PLAN→EXECUTE→VALIDATE→LEARN — it produces pre-build artifacts and never builds. Applies to both paths.

**Role:** Pre-build analysis. Runs after draft-preview approval (Step 0.5), before Reasoning Brain (Step 1.5).
Produces 7 artifacts that gate all downstream work. No artifact = no build.

---

## Inputs

- `regions[]` — output from draft-preview (A1, reused)
- Original reference image (screenshot/photo/wireframe)
- `get_design_context` output if available (provides exact CSS measurements)
- Business requirement text (if provided)

---

## Mandatory Artifacts (A1–A5)

### A1 — Region Hierarchy (REUSE from draft-preview)
The `regions[]` list produced by draft-preview. No regeneration needed.

### A2 — Element Classification Map

For every element in every region, produce a structured entry:

```
[Region name]
  [Element name]
    Confidence: ● / ○ / ?
    Observed: [what is directly visible]
    SAP component: [exact sap.m.* or ui5-* name]
    Variant: [key property values]
    Framework: SAPUI5 / Web Components / both
    States: [None/Error/Warning/Success/Information as applicable]
    Interactions: [trigger → target → binding or ?]
    Data source: Static / JSON Model ○ / OData V4 ?
    Responsive: S: / M: / L+: (if applicable)
    A11y: [ARIA required? / touch target / handled automatically?]
```

Every `?` entry generates a named Open Question at the end.

### A3 — Spatial Measurement Report

For every measurable dimension, record:

```
[Region name]
  Width: [value] [●/○/⚠ INFERRED]
  Height: [value] [confidence]
  Padding: [T/R/B/L] [confidence]
  Gap: [value] [confidence]
  Font size: [value or SAP token] [confidence]
```

**Source priority:**
1. `get_design_context` CSS output → ● (exact, cite as "from design context")
2. Measurement from crisp Tier 1 image → ● if clearly measurable, ○ if estimated
3. Inferred from SAP standard patterns → ○
4. Cannot determine → `⚠ INFERRED` with best-guess value

### A3b — Design Decision Record

For every major region, answer all 4:
1. Purpose — what is the functional role?
2. Design intent — what visual principle is at work (hierarchy, grouping, emphasis)?
3. SAP pattern evidence — what SAP floorplan/pattern does this match?
4. Observable evidence — cite at least one measurable fact. If none: `⚠ INFERRED`.

```
Section: [name]
  Purpose: [description]
  Design intent: [principle]
  SAP pattern: [pattern + evidence]
  Evidence: [observable fact] or ⚠ INFERRED
```

### A4 — Token Assignment Proposal

For every color and typography instance:

```
[Element]
  Fill: [SAP token] e.g. sapContent_LabelColor (#556b82)
  Text style: [SAP style key or style name] e.g. MediumText/LHAuto/Regular
  Confidence: ● / ○
```

Uses `knowledge/guidelines/token-assignment-rules.md` as the primary lookup.
Never produces raw hex values. If token is uncertain → mark ○ + note "verify in SAP Web UI Kit".

### A4b — SAP Compliance Notes

For every deviation from SAP Fiori guidelines:

```
⚠ SAP Fiori deviation: [component] guideline specifies [X]. Reference shows [Y].
  Implementing as: reference (brand override / product decision / unknown)
  Impact: [what changes if SAP standard used instead]
```

**Never blocks.** User intent wins. This is informational only.

### A5 — Completeness + A11y Audit

**Completeness checklist (binary pass/fail):**

| Category | Present? | Notes |
|---|---|---|
| Page/card title | ✓ / ✗ | |
| Navigation (if applicable) | ✓ / ✗ / N/A | |
| Section labels | ✓ / ✗ | |
| All input fields | ✓ / ✗ | |
| Required field indicators | ✓ / ✗ | |
| Action buttons | ✓ / ✗ | |
| Primary CTA | ✓ / ✗ | |
| Status / feedback elements | ✓ / ✗ / N/A | |
| Empty state (if applicable) | ✓ / ✗ / N/A | |
| Carrier / attribution (if applicable) | ✓ / ✗ / N/A | |

**Score:** (items present) / (applicable items). Gate: ≥ 95% before proceeding.

**A11y checklist (per interactive element):**

| Element | Touch target | ARIA needed? | Handled by SAP? | Keyboard behavior |
|---|---|---|---|---|
| [name] | ≥44px Cozy / ≥32px Compact | Yes/No | Yes/No | Tab / Enter / Esc |

---

## Gate Phrase

After producing all 7 artifacts, output exactly:

```
VISUAL ANALYSIS COMPLETE — 7/7 artifacts produced (A1 A2 A3 A3b A4 A4b A5)
Completeness: [N]% | Confidence: [overall avg]% | Open questions: [count]
```

If any artifact is incomplete → `ANALYSIS INCOMPLETE — missing [artifact]` and do not proceed.

---

## Post-Build Learning Loop

After a confirmed-quality build (user confirms "this is good" OR bind reports 0 raw-fill leaks + a11y passes):

1. Call `get_design_context` on the confirmed Figma node
2. Extract actual CSS measurements (padding, gap, font-size, token names)
3. Compare against A3 (Spatial Measurement) proposals
4. Write confirmed values to `knowledge/guidelines/token-assignment-rules.md`
5. Write confirmed component choices to `skill/sap-visual-reading/component-map.md` if a new pattern

Report: "Learned from build: [N] measurements confirmed, [N] token assignments verified, [N] new rules added."

---

## MCP Calls Used

- `sap-application-analysis`: `mapRegionToSAP()`, `suggestFloorplan()`
- `sap-fiori-guidelines`: `getFioriGuideline()`, `searchGuidelines()`
- `figma`: `get_design_context()` (for exact measurements)
- `sap-figma-community`: `getRegistryEntry()` (for component variant verification)
