# 11 - Design System Governance (FCL) — Schedule Operation Hourly (State B1)

**Node ID:** 750:174960  
**File Key:** p7zm5EMBk5DRRZdxNeJ4f5  
**Screenshot:** 11-design-system-governance-fcl.png  
**Dimensions:** 560 x 420px

## Screen Description

"Schedule operation" form — State B1 (Recurrence checked, Hourly tab selected). The recurrence section is expanded but shows no sub-pattern panel (unlike Monthly which shows "Monthly pattern" box). Hourly is the simplest recurrence option — just select the frequency type. Despite task label "Design System Governance (FCL)", actual Figma name and content is "Schedule Operation — State B1 Hourly".

Note: The Design System Governance FCL screen may refer to the multi-column layout variant in a different frame. This node shows the Hourly schedule operation state.

## Layout Structure

```
Card (white, border, rounded 8px)
  Header: "Schedule operation" + subtitle
  Divider
  Timing: TIMING + DateTimeRow
    Start date* [e.g. Jul 15, 2026 📅]    Start time* [4:30 PM 🕐]
  Divider
  RecurrenceExpanded (gap-12)
    ☑ Recurrence — repeat this operation on a schedule
    "Recurrence type" (label, muted)
    SegmentedButton: [Hourly✓] [Daily] [Monthly] [Yearly]
    (No sub-pattern box — Hourly has no additional parameters)
  Divider
  EndWrap: ☐ End date — leave unchecked to run indefinitely
  Divider
  Footer: [Cancel] [Save schedule]
```

## State B1 Unique Features

- Hourly tab is selected (leftmost/first in SegmentedButton)
- No sub-pattern section visible (Hourly = just interval, no day/weekday selectors)
- Height: 420px — shorter than Monthly states

## Recurrence Type SegmentedButton States

| State | Node | Selected Tab | Pattern Box |
|---|---|---|---|
| B (Monthly) | 750:174814 | Monthly | Monthly pattern box |
| C (Monthly+End) | 750:174866 | Monthly | Monthly pattern box + end date |
| B1 (Hourly) | 750:174960 | Hourly | No pattern box |

## SAP Components Used

- Input (DatePicker, TimePicker)
- Calendar (hidden)
- CheckBox (2x: Recurrence checked, End date unchecked)
- SegmentedButton (Compact, Text: Hourly/Daily/Monthly/Yearly)
- Button (Cancel, Save schedule emphasized)

## Design Tokens

Same as other schedule form states:
- Card: `--sapGroup_ContentBackground` (white)
- Border: `--sapList_BorderColor` (#e5e5e5)
- Title: `--sapTitleColor` (#131e29)
- Label: `--sapContent_LabelColor` (#556b82)
- SegmentedButton selected uses emphasized styling
