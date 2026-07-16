# Wizard Floorplan

## What It Is
A Wizard breaks a complex task into **linear numbered steps** with a Next/Back navigation. Each step shows only what the user needs for that phase. Progress is always visible via a step indicator at the top.

## When to Choose Wizard
- Task has 3+ distinct phases with logical order (define → configure → confirm)
- Later steps depend on earlier decisions (branching allowed but linear)
- Users benefit from focused attention on one phase at a time (reduces overwhelm)
- Common in: create-new-object flows, onboarding, checkout, guided setup

## When NOT to Choose Wizard
| Scenario | Use Instead |
|---|---|
| Task is a single form (< 10 fields) | **Dialog** with the form directly |
| User needs to jump between sections freely | **Object Page** with anchor navigation |
| Task is a data entry table (spreadsheet-like) | **Table** with inline editing |
| Steps are optional / can be skipped | **Panel** sections that hide/show |

## The Key Differentiator
The question: **"Do the steps have a required order, and is each step distinct enough to isolate?"**

- Yes → **Wizard**
- No → free-form editing pattern

## Required Component Hierarchy
```
ShellBar
DynamicPage OR Dialog (Wizard can live in either)
  title:   DynamicPageTitle
             heading: Title ("Create Purchase Order")
  content: Wizard
             ProgressStep × N (step indicators at top — done / current / future)
             WizardStep × N (only current step visible)
               heading: Title ("Step 2 of 4 — Select Supplier")
               content: Form (fields specific to this step)
               validation: MessageStrip (if step has errors)
             footer: Toolbar
               Button "Back"  (disabled on step 1)
               ToolbarSpacer
               Button "Next"  (Emphasized on non-final steps)
               Button "Finish" (Emphasized on final step; disabled if unresolved errors)
               Button "Cancel"
```

## Component Decisions
| Choice | Rules |
|---|---|
| Step count | 3–7 steps ideal. > 7 → break into multiple wizards or convert to Object Page |
| Progress indicator | Always visible; shows step number, title, status (done / current / future / error) |
| Step validation | Each step validates on Next; blocks progression if errors |
| Back navigation | Preserves entered data; user can revise earlier decisions |
| Optional steps | Mark clearly in the ProgressStep label ("Optional"); allow skip |
| Save & Exit | For wizards that take > 10 minutes, offer save-and-resume-later |

## Empty State
Not typical for wizards — they're always populated by the current step's form. If no wizard is active, don't show the wizard component.

## SAP Guidelines Reference
- https://experience.sap.com/fiori-design-web/wizard-floorplan/
