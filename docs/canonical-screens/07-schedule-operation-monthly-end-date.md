# 07 - Schedule Operation (Monthly + End date) — State A Collapsed

**Node ID:** 750:174786  
**File Key:** p7zm5EMBk5DRRZdxNeJ4f5  
**Screenshot:** 07-schedule-operation-monthly-end-date.png  
**Dimensions:** 560 x 354px

## Screen Description

Minimal "Schedule operation" modal/card form — State A (collapsed, no recurrence selected, no end date). Shows just the essential timing fields with two unchecked options below.

## Layout Structure

```
Card (white, border, rounded 8px)
  Header (pt-20 pb-16 px-24)
    "Schedule operation" (Bold, 16px)
    "Define when and how often this operation runs" (Regular, 14px, muted)
  Divider
  Timing Section (px-24 py-16)
    "TIMING" (label, 12px, muted, uppercase)
    DateTimeRow (64px tall, gap-16)
      StartDateCol
        "Start date *" (label with red *)
        DatePicker [e.g. Jul 15, 2026 📅]
      StartTimeCol
        "Start time *" (label with red *)
        TimePicker [4:30 PM 🕐]
  Divider
  RecWrap (px-24 py-16)
    ☐ Recurrence — repeat this operation on a schedule
  Divider
  EndWrap (px-24 py-16)
    ☐ End date — leave unchecked to run indefinitely
  Divider
  Footer (h-60 px-24 py-12, justify-end)
    [Cancel]  [Save schedule]
```

## Key Measurements

- Card: white background, `--sapList_BorderColor` border, 8px rounded corners
- Header: padding 20/24/16/24 (top/right/bottom/left)
- Dividers: 1px horizontal line, `--sapList_BorderColor`
- DateTimeRow: 64px tall, two equal columns, gap 16px
- Label + required asterisk: 14px, asterisk red `--sapNegativeColor`
- Footer: 60px height, gap 12px, right-aligned
- DatePicker/TimePicker: Compact form factor

## SAP Components Used

- Input (DatePicker with trailing action icon)
- Calendar (hidden, triggered by date icon)
- Input (TimePicker with trailing action)
- CheckBox (2x, unchecked state)
- Button (default "Cancel")
- Button (emphasized "Save schedule")

## Design Tokens

- Background: `--sapGroup_ContentBackground` (white)
- Border: `--sapList_BorderColor` (#e5e5e5)
- Title: `--sapTitleColor` (#131e29)
- Label: `--sapContent_LabelColor` (#556b82)
- Required: `--sapNegativeColor` (#aa0808)
- Divider: `--sapList_BorderColor` (#e5e5e5)
- Button emphasized: `sapButton_Emphasized_FontFamily`
- Shadow: `sapContent_Shadow1`
