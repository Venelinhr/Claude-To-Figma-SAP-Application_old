# SAP Fiori Design Guidelines Cache

This directory stores fetched SAP Fiori Design Guidelines summaries per component.
Populated on-demand by the `component-guidance` skill when a designer asks for guidance.

## How it works

1. Designer asks Claude: "Guide me on which button to use in a form"
2. `component-guidance.md` skill runs
3. Claude fetches `https://experience.sap.com/fiori-design-web/button/` (or the redirected URL)
4. Extracts: purpose, when to use, when not to use, variants, do/don't, a11y, responsive
5. Writes summary here as `button.md`
6. Next session: reads cached file instead of re-fetching

## Fetch strategy

SAP design guidelines may redirect or block automated fetching. Try in order:
1. `https://www.sap.com/design-system/fiori-design-web/ui-elements/{slug}/`
2. `https://experience.sap.com/fiori-design-web/{slug}/`
3. `https://ui5.sap.com/#/entity/{SAPClass}` (DemoKit — JS SPA, may not load)
4. Knowledge from `knowledge/schemas/{Component}.json` (fallback — always available)

## URL slug mapping

| Component | Slug |
|---|---|
| Button | `button` |
| Input | `input-field` |
| Select | `select` |
| Table | `responsive-table` |
| List | `list` |
| Form | `simple-form` |
| Dialog | `dialog` |
| MessageStrip | `message-strip` |
| ShellBar | `shell-bar` |
| DynamicPageHeader | `dynamic-page-header` |
| FilterBar | `filter-bar` |
| ObjectStatus | `object-status` |
| ObjectIdentifier | `object-identifier` |
| ObjectNumber | `object-number` |
| Panel | `panel` |
| CheckBox | `checkbox` |
| RadioButton | `radio-button` |
| Switch | `switch` |
| DatePicker | `date-picker` |
| TextArea | `text-area` |
| Label | `label` |
| Link | `link` |
| Breadcrumb | `breadcrumb` |
| IconTabBar | `icon-tab-bar` |
| Tree | `tree` |
| Toolbar | `toolbar` |
| OverflowToolbar | `overflow-toolbar` |
| Toast | `message-toast` |
| Popover | `popover` |
| Card | `cards` |
| ProgressIndicator | `progress-indicator` |
| Avatar | `avatar` |
| Tag | `tag` |
| SideNavigation | `side-navigation` |
| Notifications | `notifications` |
| IllustratedMessage | `illustrated-message` |
| Carousel | `carousel` |

## File format

Each cached file follows this structure:

```markdown
# {Component} — SAP Fiori Design Guidelines
Source: {URL}
Fetched: {date}

## Purpose
{1-2 sentence description}

## When to Use
- {scenario 1}
- {scenario 2}

## When NOT to Use
- {anti-pattern 1}
- {anti-pattern 2}

## Variants
- {Variant 1} — {description}
- {Variant 2} — {description}

## Do ✓
- {do item 1}
- {do item 2}

## Don't ✗
- {dont item 1}
- {dont item 2}

## Responsive Behavior
{notes}

## Accessibility
- Role: {ARIA role}
- Keyboard: {keyboard support}
- {other a11y notes}

## Related Components
- {Component 1}: {when to use instead}
- {Component 2}: {when to use instead}
```
