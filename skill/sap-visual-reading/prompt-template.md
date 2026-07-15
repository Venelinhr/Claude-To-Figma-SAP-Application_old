# Prompt template

Use this template when triggering the sap-visual-reading skill from a business requirement, image, or both.

Fill in the [BRACKETS]. Remove any section that doesn't apply.

---

## Template — image + business requirement (full)

```
This is a high-resolution screenshot of an SAP Fiori [SCREEN TYPE: Dialog / Page / List Report / Wizard / etc.].

Business context:
[Paste user story or acceptance criteria here]

Persona: [Who uses this screen — role and goal]

The screen is divided into [N] visually distinct sections, stacked [vertically / horizontally / in a grid].

For each section:
1. Describe what you observe with high confidence (●)
2. Note what you are inferring from visual pattern alone (○)
3. Map each element to its nearest SAP component (sap.m.* / sap.ui.layout.* / SAP Web Components)
4. When two valid SAP components could serve the same function, present 2–3 options and recommend one

End with:
— Floorplan recommendation with justification and layout tree
— Section-by-section spec with SAP Horizon tokens, states, and framework availability
— Open questions that cannot be resolved from the image or requirement alone
— Confidence table (Screen classification / Floorplan / Layout / Components / Typography / Color / States)

Only use real SAP components, SAP Horizon tokens, and SAP design system patterns.
No invented components. No raw hex or px values as design decisions.
```

---

## Template — image only

```
This is a [Tier 1 PNG screenshot / Tier 3 phone photo / Figma export] of an SAP Fiori screen.

Classify the screen type and describe its structure region by region, top to bottom.

For each region, map visible elements to SAP components with confidence tiers (● ○ ?).
When two components are valid options, present both.

End with floorplan recommendation, open questions, and confidence table.
SAP design system only — no invented components or raw values.
```

---

## Template — business requirement only (no image)

```
Plan an SAP Fiori screen for the following business requirement:

[Paste requirement / user story / acceptance criteria]

1. Classify the screen type and recommend the best SAP floorplan with justification
2. Divide the screen into named sections based on the requirement
3. Map each section's elements to SAP components with properties and states
4. Assign SAP Horizon tokens for typography, color, and spacing
5. Identify conditional states (show/hide, enabled/disabled, error, empty)
6. List open questions before implementation can begin
7. End with a confidence table

SAP design system only. No invented components. No raw values.
```

---

## Template — iteration / refinement

```
Based on the previous analysis of [SCREEN NAME]:

[Describe the specific change or question]

Update the component mapping / floorplan / token assignment for this section only:
[SECTION NAME]

Keep all other sections unchanged. Flag any downstream impacts.
```

---

## Output structure — always in this order

Every output from this skill follows this sequence:

```
# [Screen name] — SAP Fiori Design Plan

## Screen classification
[Type] | [Floorplan] | [Justification]

## Component map
[Region by region, element by element, with ● ○ ? tiers]

## Floorplan and layout
[Container hierarchy tree]
[Spacing and grid tokens]

## Section-by-section spec
[For each section: component, variant, properties, tokens, states, framework]

## Open questions
[Everything marked ? as a named, actionable question]

## Confidence table
[One row per area]
```

---

## What to include when sending an image

For best results, send:
1. A clean PNG screenshot (not a phone photo)
2. Cropped to the specific screen or component being analyzed
3. At full resolution — do not resize before sending
4. If the screen has a dense zone (table, pattern rows), send a second zoomed crop of that zone

Optional but helpful:
- The business requirement or user story alongside the image
- The persona name and role
- Any constraints ("this must work on mobile" / "this is a dialog, not a full page")
