# Floorplan Decision Matrix

The requirement analyst reads this file at Step 2 to select the correct SAP Fiori floorplan.
Work through the questions in order — stop at the first match.

---

## Decision questions (in order)

**Q1 — Is this a single business object with multiple sections of related data?**
- Yes, and the user navigates between sections → **Object Page**
- Yes, but there is only one section / it's a simple form → DynamicPage (not a named floorplan)

**Q2 — Does the screen show a list?**
- Yes → continue to Q3
- No → Q6

**Q3 — Is the list the user's own pre-assigned task queue?**
- Yes (approvals, reviews, todos, items assigned to this person) → **Worklist**
- No (user searches or browses records across the organisation) → continue to Q4

**Q4 — Does the user need to filter across multiple dimensions before seeing results?**
- Yes (FilterBar needed, large open dataset) → **List Report**
- Yes + charts / KPI tiles alongside the list → **Analytical List Page**
- No → continue to Q5

**Q5 — Does the screen show multiple unrelated lists or KPI cards on one page?**
- Yes → **Overview Page**
- No → **Worklist** (scoped list, no filter needed)

**Q6 — Is this a sequential multi-step creation process?**
- Yes, genuinely sequential (each step depends on the previous) → **Wizard**
- No (steps are independent or just grouped) → use an Object Page with sections

**Q7 — Does the screen need to show master + detail side by side?**
- Yes (list on the left, detail on the right simultaneously) → **Master-Detail (FlexibleColumnLayout)**
- No → the detail screen is a standalone Object Page

**Q8 — Is this a home screen / launchpad with app tiles?**
- Yes → **Initial Page / Launchpad**

**Q9 — Is this a quick create or confirmation that fills the full viewport?**
- Yes → **Fullscreen Dialog**

---

## Floorplan reference table

| Floorplan | Key signal | FilterBar? | VariantMgmt? | Primary container |
|---|---|---|---|---|
| `list-report` | Open dataset, user searches/filters | Yes | Yes | DynamicPage |
| `worklist` | Pre-scoped task queue, own items | No | No | DynamicPage |
| `object-page` | Single entity, multiple sections | No | No | ObjectPageLayout |
| `overview-page` | Multiple lists + KPIs, no primary entity | No | No | OverviewPage |
| `analytical-list-page` | Charts + filtered table, analytical | Yes | Yes | AnalyticalListPage |
| `master-detail` | List + detail side by side | Optional | Optional | FlexibleColumnLayout |
| `initial-page` | App launchpad / home with tiles | No | No | Page |
| `wizard` | Sequential multi-step creation | No | No | Wizard |
| `fullscreen-dialog` | Quick create or confirmation | No | No | Dialog |

---

## The critical trap: List Report vs Worklist

This is the most common AI mistake. Both show a list of business objects. The difference:

| Signal | List Report | Worklist |
|---|---|---|
| Dataset scope | Open — all records in the system | Closed — only the user's own items |
| User intent | Search / discover / explore | Process / complete / review |
| FilterBar | Required | Never |
| VariantManagement | Required | Never |
| Typical count | Hundreds to thousands | Tens to low hundreds |
| Trigger | User navigates to search | System assigns items to user |
| Example | "Find all purchase orders for supplier X" | "Review my 20 pending approvals" |

**Test question:** "Does the system already know which records this user should see?"
- Yes → Worklist
- No, user has to specify → List Report

---

## Classification → floorplan shortcuts

From the requirement-analyst's task type classification:

| Classification | Most likely floorplan | Check |
|---|---|---|
| `list-reporting` | list-report | Is it pre-scoped? → worklist |
| `approval / workflow` | worklist | Is it organisation-wide search? → list-report |
| `object-management` | object-page | Multiple views needed? → master-detail |
| `analytical` | analytical-list-page | No charts? → list-report |
| `dashboard` | overview-page | Single entity? → object-page |
| `wizard` | wizard | Steps truly sequential? |
| `transactional` | object-page (edit mode) | List of items to process? → worklist |
| `administration` | object-page or settings page | Tile-based? → initial-page |

---

## Combination patterns

Screens that involve navigation between floorplans:

**List Report → Object Page**
Classic SAP enterprise flow. List Report shows the result set; clicking a row navigates to the Object Page for that entity. These are two separate screens.

**Worklist → Object Page (via FlexibleColumnLayout)**
Task queue on the left column; item detail on the right. Use `master-detail` floorplan (FCL) when both must be visible simultaneously. Use separate screens when mobile support is required.

**Object Page → Fullscreen Dialog**
Edit flows that don't warrant a full navigation. The Object Page stays in the background; a dialog confirms or captures a single action.

**Wizard → Object Page**
Multi-step creation (Wizard) results in a created entity whose detail is shown in the Object Page. The Wizard is the creation flow; the Object Page is the result.
