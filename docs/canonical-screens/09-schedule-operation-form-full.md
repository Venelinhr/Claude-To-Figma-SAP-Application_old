# 09 - Schedule Operation Form (Full) — State C (Recurring + End Date)

**Node ID:** 750:174866  
**File Key:** p7zm5EMBk5DRRZdxNeJ4f5  
**Screenshot:** 09-schedule-operation-form-full.png  
**Dimensions:** 560 x 632px

## Screen Description

"Schedule operation" form — State C, the fullest form state. Both "Recurrence" and "End date" checkboxes are checked, showing all sections expanded simultaneously. This is the most comprehensive schedule operation form state.

## Layout Structure

```
Card (white, border, rounded 8px)
  Header: "Schedule operation" + subtitle
  Divider
  Timing: TIMING + DateTimeRow (Start date*, Start time*)
  Divider
  RecurrenceExpanded (gap-12)
    ☑ Recurrence — repeat this operation on a schedule
    "Recurrence type" (label)
    SegmentedButton: [Hourly] [Daily] [Monthly✓] [Yearly]
    Monthly Pattern Box (gray)
      "Monthly pattern"
      DayRow: ○ Day [1 v] of every [1 v] month(s)
      RelativeDayRow (45% opacity): ○ [1st v] [Monday v] of every [1 v] month(s)
  Divider
  EndWrapExpanded (gap-12)
    ☑ End date — leave unchecked to run indefinitely
    EndDateTimeRow (64px tall)
      EndDateCol: "End date" + DatePicker [dd.mm.yyyy 📅]
      EndTimeCol: "End time" + TimePicker [23:59 🕐]
  Divider
  Footer: [Cancel] [Save schedule]
```

## State C Unique Elements

- End date section is EXPANDED (checkbox checked)
- Shows End date DatePicker (placeholder: "dd.mm.yyyy") + End time TimePicker (value: "23:59")
- This is the tallest form state: 632px vs 354px (State A) / 556px (State B)

## Key Differences from Other States

| State | Height | Recurrence | End Date |
|---|---|---|---|
| A (750:174786) | 354px | unchecked | unchecked |
| B (750:174814) | 556px | checked + monthly | unchecked |
| C (750:174866) | 632px | checked + monthly | checked + fields |
| D (750:174925) | 430px | unchecked | checked + fields |

## SAP Components Used

- Input (DatePicker x2: Start date, End date)
- Input (TimePicker x2: Start time, End time)
- Calendar (triggered by date icons)
- CheckBox (2x, both checked)
- SegmentedButton (Compact, Text: Hourly/Daily/Monthly/Yearly)
- RadioButton (2x)
- Select (DayOfMonth, Interval, Ordinal, Weekday, RelativeInterval)
- Button (Cancel, Save schedule emphasized)

## Design Tokens

Same as other schedule form states (nodes 174786, 174814):
- Background: `--sapGroup_ContentBackground` (white)
- Pattern area: `--sapBackgroundColor` (#f5f6f7)
- End date label (no required asterisk — optional field)
