# Initial Page Floorplan

## What It Is
An Initial Page is a **landing / entry page** — the first screen a user sees after logging in, or when they hit an area with no active task. Serves as a launcher: quick search + featured actions + recent items + navigation options.

## When to Choose Initial Page
- User arrives without a specific task in mind — they need help choosing
- The app has multiple entry paths (search / recent / favorite / new)
- Onboarding: first-time users need clear next steps
- Home screen for a role-based Fiori launchpad tile

## When NOT to Choose Initial Page
| Scenario | Use Instead |
|---|---|
| User arrives with a specific task | Skip — go straight to that task's floorplan |
| User needs to see metrics | **Overview Page** |
| User needs to search records | **List Report** |
| User needs monitoring dashboard | **Overview Page** |

## The Key Differentiator
The question: **"Is the user's next action ambiguous when they arrive?"**

- Yes, they need to choose → **Initial Page**
- No, task is known → jump to that floorplan directly

## Required Component Hierarchy
```
ShellBar
DynamicPage
  title:   DynamicPageTitle
             heading: Title ("Welcome, Nadia")
             subtitle: Text ("Choose what you'd like to do today")
  content: IllustratedMessage (welcome graphic — sapIllus-SuccessBalloon or sapIllus-Home)
           Panel "Search everything"
             SearchField
           Panel "Quick actions"
             Button × 3–5 (primary actions with Emphasized styling)
           Panel "Recent"
             List of StandardListItem × 5 (recent objects with type + timestamp)
           Panel "Favorites" (optional)
             List of StandardListItem
```

## Component Decisions
| Choice | Rules |
|---|---|
| Illustration | Always present — reduces text density on an otherwise sparse page |
| Quick actions | 3–5 Buttons max — this isn't a menu, it's a nudge to the most common paths |
| Recent list | 3–7 items; each links to the item's Object Page |
| Search | Prominent SearchField; typing triggers routing to List Report with pre-filled query |
| Density | Cozy (this is a "generous" landing page, not a compact work screen) |

## Empty State
- No recent items → IllustratedMessage inside the Recent panel: `sapIllus-NewMail` or similar
- New user → the whole page IS the empty-state welcome message

## SAP Guidelines Reference
- https://experience.sap.com/fiori-design-web/initial-page-floorplan/

<!-- part of the SAP Fiori knowledge base -->
