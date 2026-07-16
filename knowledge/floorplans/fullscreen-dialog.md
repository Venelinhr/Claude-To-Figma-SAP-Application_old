# Fullscreen Dialog Floorplan

## What It Is
A Fullscreen Dialog is a **modal dialog that fills the screen** — used for focused tasks that need the user's undivided attention, like editing complex records, running a guided flow, or completing a checkout. Unlike a standard Dialog, it takes the whole viewport (no visible background page).

## When to Choose Fullscreen Dialog
- The task requires >50% of the viewport to fit its content
- User must complete OR cancel — no partial progress state
- Complex forms with many fields spread across sections
- Multi-step flows where the underlying page shouldn't be visible
- Mobile: any modal task (mobile Dialogs are always fullscreen)

## When NOT to Choose Fullscreen Dialog
| Scenario | Use Instead |
|---|---|
| Task is small (single input, confirmation) | **Dialog** (standard modal) |
| User needs context from underlying page | **Popover** (anchored to source) |
| Task is a multi-step wizard | Wrap **Wizard** in Fullscreen Dialog if needed |
| Task is a full-page workflow | **Object Page** (not modal) |

## The Key Differentiator
The question: **"Does the task need the whole screen AND full user attention?"**

- Yes to both → **Fullscreen Dialog**
- Yes to attention but small → **Dialog**
- No to attention → **Popover** or inline pattern

## Required Component Hierarchy
```
Dialog (state: Fullscreen)
  header: Bar (design: Header)
    Button "×"  (close, positioned left in header)
    Title "Edit Purchase Order — PO-48865"
    ToolbarSpacer
    Button "Save"  (Emphasized)
    Button "Cancel" (Transparent)
  content: (scrollable region — full viewport minus header + footer)
    IconTabBar (optional — for grouping content into sections)
      Tab "Details"  → Form
      Tab "Items"    → Table
      Tab "History"  → Timeline
    OR
    Panel × N (single scrolling column)
  footer: Bar (design: Footer) — OPTIONAL when actions in header cover it
    ToolbarSpacer
    Button "Save Draft"
    Button "Submit" (Emphasized)
```

## Component Decisions
| Choice | Rules |
|---|---|
| Close affordance | Always in header, top-left (matches iOS / Fiori mobile convention) |
| Primary action | Emphasized button in header OR footer, right-aligned |
| Scrollable content | Content region scrolls; header and footer stay fixed |
| Cancel behavior | Confirms if user has unsaved changes; discards otherwise |
| Escape key | Triggers cancel/close (with unsaved-changes prompt) |
| Height | 100vh on mobile; ~90vh on desktop with slight backdrop showing |

## Empty State
If the fullscreen dialog opens on an empty resource (rare — usually opened with pre-loaded data), show a Panel with IllustratedMessage explaining what to do next.

## SAP Guidelines Reference
- https://experience.sap.com/fiori-design-web/dialog/
- https://experience.sap.com/fiori-design-web/fullscreen-dialog/
