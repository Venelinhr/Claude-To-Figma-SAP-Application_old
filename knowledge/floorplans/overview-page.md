# Overview Page Floorplan

## What It Is
An Overview Page is a **KPI-first dashboard**. Multiple content cards (each showing a metric, a chart, or a short list) arranged in a responsive grid. The user glances at KPIs, then drills into whichever card catches their attention.

## When to Choose Overview Page
- Users need situational awareness across many data streams at once
- The primary task is monitoring, not searching or processing
- Each card summarizes a domain (revenue, orders, alerts, tasks) that can be drilled into
- Cards may have different sizes (headline KPI takes 2 columns; smaller lists take 1)

## When NOT to Choose Overview Page
| Scenario | Use Instead |
|---|---|
| User has a specific task queue to process | **Worklist** |
| User needs to search across a single dataset | **List Report** |
| User is examining one business object | **Object Page** |
| User needs analytical drill-down with filters | **Analytical List Page** |

## The Key Differentiator
The question: **"Does the user need a picture of the whole business, or one specific thing?"**

- A picture of the whole → **Overview Page**
- One specific thing → any other floorplan

## Required Component Hierarchy
```
ShellBar
DynamicPage
  title:   DynamicPageTitle
             heading: Title ("Executive Overview")
  header:  (optional — global filter bar)
  content: FilterBar (global filter for all cards)
           Card × N (KPI cards)
             header: Title + subtitle
             content: ObjectNumber (headline metric)
                    | Chart (SAP charts)
                    | List (top 5 items)
                    | IllustratedMessage (empty state)
             actions: Link ("See all →")
```

## Card Types (SAP Overview Page)
| Type | Purpose | Content |
|---|---|---|
| KPI Card | Show a headline metric | ObjectNumber + trend indicator |
| List Card | Top N items | List + StandardListItem + Link "See all" |
| Chart Card | Visual analytics | Chart (native SAP viz) |
| Analytical Card | KPI + supporting chart | ObjectNumber above a mini-chart |

## Component Decisions
| Choice | Rules |
|---|---|
| Card layout | Responsive grid — 3–4 cards per row on desktop, 1–2 on tablet |
| FilterBar | Global — filter applies to all cards simultaneously |
| Empty state | Each card shows its own IllustratedMessage when its data is empty |
| Drill-down | Every card has a "See all" Link routing to the detail floorplan (List Report / Object Page) |

## Empty State
When the whole overview has no data (e.g., new user / cold start), show a full-page IllustratedMessage.
- Illustration type: `sapIllus-NoData` or `sapIllus-BeforeSearch`

## SAP Guidelines Reference
- https://experience.sap.com/fiori-design-web/overview-page/
