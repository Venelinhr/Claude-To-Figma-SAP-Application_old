#!/usr/bin/env python3
"""Generate 32 must-have SAP Fiori registry + guideline entries."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REG = os.path.join(ROOT, 'knowledge', 'components', 'registry')
GUI = os.path.join(ROOT, 'knowledge', 'guidelines')

LIB_VER = '2025.06'
LAST = '2026-06-26'
FILE_ID = 'p7zm5EMBk5DRRZdxNeJ4f5'
COMM_ID = 'sap-web-ui-kit'

# Per-component definition — exhaustive coverage
COMPONENTS = {
    # ─────── DIRECT SAP COMPONENTS (need live figma ID lookup; using lookup-pending placeholder for now) ───────
    'Tabs': {
        'fid': 'lookup:pending', 'cat': 'Navigation',
        'purpose': 'Top-aligned tabbed navigation with text labels. Visual variant of IconTabBar — used when tabs do not need icons.',
        'when': ['Page-level tab navigation when icons would add noise', 'Sub-section navigation on detail pages'],
        'whenNot': ['When tabs are critical app-level navigation — use IconTabBar', 'When more than ~7 tabs — use Select or ComboBox'],
        'do': ['Mark exactly one tab as selected', 'Bind selected text to sapButton_Emphasized_TextColor', 'Limit to 7 tabs'],
        'dont': ['Do not exceed 7 tabs', 'Do not nest Tabs inside Tabs', 'Do not hide the selected indicator'],
        'compat': ['DynamicPage', 'Panel', 'Form'],
        'rules': [
            {'role':'text-default','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
            {'role':'text-selected','state':'Selected','token':'sapButton_TextColor','fallbackHex':'#0064D9'},
            {'role':'indicator','state':'Selected','token':'sapButton_Emphasized_Background','fallbackHex':'#0070F2'},
        ],
        'notes': 'Tabs is the text-only variant of IconTabBar. For now plugin uses IconTabBar instance with icon hidden via setProperties.',
    },
    'ToggleButton': {
        'fid': 'lookup:pending', 'cat': 'Button',
        'purpose': 'Stateful Button — visually shows pressed/unpressed state. Used for binary toggles that aren\'t pure switches (e.g. format toolbar bold/italic, filter chip on/off).',
        'when': ['Toolbar format toggles (Bold / Italic / Underline)', 'Filter mode toggle in a toolbar', 'When state must be visually distinct from disabled'],
        'whenNot': ['Single-action triggers — use Button', 'Multiple mutually-exclusive options — use SegmentedButton', 'Enable/disable a value — use Switch'],
        'do': ['Show pressed state via fill, not just text', 'Bind pressed fill to sapButton_Emphasized_Background', 'Provide aria-pressed attribute equivalent'],
        'dont': ['Do not use without a clear pressed/unpressed visual distinction', 'Do not stack multiple ToggleButtons that are actually mutually exclusive — use SegmentedButton'],
        'compat': ['OverflowToolbar', 'Toolbar', 'Form'],
        'rules': [
            {'role':'fill-pressed','state':'Pressed','token':'sapButton_Emphasized_Background','fallbackHex':'#0070F2'},
            {'role':'text-pressed','state':'Pressed','token':'sapButton_Emphasized_TextColor','fallbackHex':'#FFFFFF'},
            {'role':'text-default','state':'Default','token':'sapButton_TextColor','fallbackHex':'#0064D9'},
            {'role':'border','state':'Default','token':'sapButton_BorderColor','fallbackHex':'#BCC3CA'},
        ],
        'notes': 'ToggleButton uses same Figma instance as Button with Pressed variant. Plugin should set property "Pressed": "True" via setProperties.',
    },
    'AvatarGroup': {
        'fid': 'lookup:pending', 'cat': 'Object Display',
        'purpose': 'Group of overlapping Avatars showing multiple users or entities. Final Avatar can be a +N counter for overflow.',
        'when': ['List of users assigned to a task', 'Attendees on an event', 'Object collaborators in a header', 'Up to ~5 visible + counter'],
        'whenNot': ['Single user — use Avatar', 'When all users must be individually identifiable — use a list', 'For non-user entities use Tag or ObjectMarker'],
        'do': ['Cap visible avatars at 5; show +N for overflow', 'Order by most-relevant-first', 'Each avatar should have tooltip with name'],
        'dont': ['Do not show more than 5 visible avatars + counter', 'Do not use AvatarGroup as a primary action surface', 'Do not omit the overflow counter'],
        'compat': ['DynamicPageHeader', 'ObjectPageLayout', 'Panel', 'Card', 'ColumnListItem'],
        'rules': [
            {'role':'border','state':'Default','token':'sapShellColor','fallbackHex':'#FFFFFF'},
            {'role':'counter-bg','state':'Default','token':'sapBackgroundColor','fallbackHex':'#F5F6F7'},
            {'role':'counter-text','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
        ],
        'notes': 'AvatarGroup is sap.f.AvatarGroup. Plugin composes N Avatar instances horizontally with -8px overlap. The +N counter is a synthesized circle.',
    },
    'ObjectListItem': {
        'fid': 'lookup:pending', 'cat': 'List Item',
        'purpose': 'Rich List item showing an object summary — title, identifier, attributes, status, optional icon/avatar. Used in master-list views to summarize objects before drilling in.',
        'when': ['Master-detail list views (drill into Object Page)', 'List that summarizes objects with multiple attributes', 'When ObjectIdentifier alone is insufficient'],
        'whenNot': ['Simple text list — use StandardListItem', 'Tabular comparison — use Table', 'Single attribute — use StandardListItem'],
        'do': ['Title is the primary identifier (verb-first if action-oriented)', 'Use ObjectStatus for status', 'Bind title to sapTitleColor, attrs to sapContent_LabelColor'],
        'dont': ['Do not exceed 4 attributes inline — readability suffers', 'Do not omit title — required'],
        'compat': ['List'],
        'rules': [
            {'role':'title','state':'Default','token':'sapTitleColor','fallbackHex':'#1D2D3E'},
            {'role':'number','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
            {'role':'attribute','state':'Default','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
            {'role':'separator','state':'Default','token':'sapShell_BorderColor','fallbackHex':'#D9D9D9'},
        ],
        'notes': 'ObjectListItem composes from ObjectIdentifier + ObjectAttribute + ObjectStatus. Plugin renders as a ColumnListItem with these components in a horizontal AutoLayout.',
    },
    'ObjectMarker': {
        'fid': 'lookup:pending', 'cat': 'Object Display',
        'purpose': 'Status indicator with icon + label for an object\'s state (Draft, Locked, Unsaved, Flagged, Favorite).',
        'when': ['Object state in a list row or object header', 'Indicate locked-by-other, draft, unsaved changes', 'Read-only state visualization'],
        'whenNot': ['Semantic status (Error/Warning/Success) — use ObjectStatus', 'Free-form tags — use Tag', 'For numeric values — use ObjectNumber'],
        'do': ['Use predefined types: Draft, Locked, LockedBy, Unsaved, Favorite, Flagged', 'Pair icon with text label', 'Bind text to sapContent_LabelColor'],
        'dont': ['Do not invent new marker types', 'Do not use ObjectMarker for action-required state — use MessageStrip'],
        'compat': ['ColumnListItem', 'ObjectListItem', 'DynamicPageHeader', 'Card'],
        'rules': [
            {'role':'text','state':'Default','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
            {'role':'icon','state':'Default','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
            {'role':'text-flagged','state':'Flagged','token':'sapNegativeTextColor','fallbackHex':'#BB0000'},
            {'role':'text-favorite','state':'Favorite','token':'sapCriticalTextColor','fallbackHex':'#A8650B'},
        ],
        'notes': 'ObjectMarker is sap.m.ObjectMarker. Plugin renders type variant via setProperties. Native fallback uses an icon + text combo with bound fills.',
    },
    'Wizard': {
        'fid': 'lookup:pending', 'cat': 'Page Layout',
        'purpose': 'Multi-step process layout — guides user through a sequence of WizardSteps with progress indicator at top. Used for onboarding, data entry, complex object creation.',
        'when': ['New object creation requiring multiple form pages', 'Onboarding flows', 'Multi-step approval / signoff processes', 'Operations that branch based on earlier choices'],
        'whenNot': ['Single-page form — use Form', 'Linear data review (no input) — use Timeline', 'Step count > 7 — redesign with sections'],
        'do': ['Show all steps in the header even when only one is active', 'Allow back navigation', 'Validate per-step before allowing next', 'Mark optional steps clearly'],
        'dont': ['Do not exceed ~7 steps', 'Do not allow Next without validation passing', 'Do not skip rendering disabled future steps — they should be visible'],
        'compat': ['DynamicPage', 'Dialog'],
        'rules': [
            {'role':'step-indicator-active','state':'Active','token':'sapButton_Emphasized_Background','fallbackHex':'#0070F2'},
            {'role':'step-indicator-done','state':'Done','token':'sapPositiveTextColor','fallbackHex':'#188919'},
            {'role':'step-indicator-future','state':'Future','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
            {'role':'title','state':'Default','token':'sapTitleColor','fallbackHex':'#1D2D3E'},
        ],
        'notes': 'Wizard is sap.m.Wizard. SAP Figma library has it as separate component set. Plugin composes step header (horizontal progress indicators + labels) + current-step content frame.',
    },
    'WizardStep': {
        'fid': 'lookup:pending', 'cat': 'Page Layout',
        'purpose': 'A single step inside a Wizard. Contains a title + the content for that step (typically a Form).',
        'when': ['Inside Wizard as a step', 'Each logical phase of a multi-step process'],
        'whenNot': ['Outside of Wizard', 'For non-sequential content — use Panel'],
        'do': ['Provide a clear step title', 'Validate inputs before allowing nextStep', 'Use Form inside the step for inputs'],
        'dont': ['Do not nest WizardStep', 'Do not allow horizontal scrolling within a step'],
        'compat': ['Wizard'],
        'rules': [
            {'role':'title','state':'Default','token':'sapTitleColor','fallbackHex':'#1D2D3E'},
            {'role':'description','state':'Default','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
        ],
        'notes': 'WizardStep composes inside Wizard. Specs emit Wizard with steps[] = [{title, description, content: [...]}], plugin generates WizardStep frames.',
    },
    'ProgressStep': {
        'fid': 'lookup:pending', 'cat': 'Feedback',
        'purpose': 'Single visual progress step in a horizontal sequence. Used to show position in a multi-step flow without the full Wizard layout.',
        'when': ['Top-of-page progress for a multi-step flow', 'Order tracking visualizations', 'Approval pipeline status'],
        'whenNot': ['Loading progress (use ProgressIndicator)', 'Single-step status (use ObjectStatus)', 'For more than 7 steps — collapse'],
        'do': ['Mark exactly one as current', 'Number steps sequentially', 'Show step name below the circle'],
        'dont': ['Do not exceed 7 steps', 'Do not omit step labels'],
        'compat': ['Wizard', 'DynamicPage', 'Panel'],
        'rules': [
            {'role':'circle-current','state':'Current','token':'sapButton_Emphasized_Background','fallbackHex':'#0070F2'},
            {'role':'circle-done','state':'Done','token':'sapPositiveTextColor','fallbackHex':'#188919'},
            {'role':'circle-future','state':'Future','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
            {'role':'label','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
        ],
        'notes': 'ProgressStep is part of Wizard rendering. Native helper renders circle + label per step bound to state.',
    },
    'Timeline': {
        'fid': 'lookup:pending', 'cat': 'Data Display',
        'purpose': 'Vertical sequence of timestamped events. Used for activity feeds, audit logs, change history, task timelines.',
        'when': ['Activity feed of recent events on an object', 'Audit log / change history', 'Sequence of related events in chronological order'],
        'whenNot': ['Hierarchical data — use Tree', 'Tabular comparison — use Table', 'Live chat — use FeedListItem in a List'],
        'do': ['Sort newest-first by default', 'Show user + action + timestamp per event', 'Use TimelineItem children', 'Bind text to sapList_TextColor'],
        'dont': ['Do not paginate Timeline visibly — show recent N + a "See more" link', 'Do not interleave with other content'],
        'compat': ['DynamicPage', 'Panel', 'Card'],
        'rules': [
            {'role':'line','state':'Default','token':'sapShell_BorderColor','fallbackHex':'#D9D9D9'},
            {'role':'dot','state':'Default','token':'sapButton_Emphasized_Background','fallbackHex':'#0070F2'},
            {'role':'title','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
            {'role':'timestamp','state':'Default','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
        ],
        'notes': 'Timeline is sap.suite.ui.commons.Timeline. Plugin composes vertical stack of TimelineItem with connecting line. items[] array drives rendering.',
    },
    'TimelineItem': {
        'fid': 'lookup:pending', 'cat': 'Data Display',
        'purpose': 'Single event in a Timeline. Has user/source, action description, timestamp, optional content body.',
        'when': ['Inside Timeline', 'Each timestamped event in an activity feed'],
        'whenNot': ['Outside Timeline', 'For a standalone activity card — use Card or ColumnListItem'],
        'do': ['Always include user + timestamp', 'Use ObjectStatus or icon for event type', 'Keep description concise (1-2 lines)'],
        'dont': ['Do not omit timestamp', 'Do not embed long forms — link out instead', 'Do not nest TimelineItem inside TimelineItem'],
        'compat': ['Timeline'],
        'rules': [
            {'role':'user','state':'Default','token':'sapButton_TextColor','fallbackHex':'#0064D9'},
            {'role':'description','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
            {'role':'timestamp','state':'Default','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
        ],
        'notes': 'TimelineItem composes inside Timeline. Spec emits Timeline with items[] = [{user, action, timestamp, content}].',
    },
    'FeedListItem': {
        'fid': 'lookup:pending', 'cat': 'List Item',
        'purpose': 'Activity feed entry — author avatar + name + timestamp + message body + optional actions (Like / Reply).',
        'when': ['Social feed in an app', 'Comment threads on an object', 'Activity / audit log with rich content'],
        'whenNot': ['Tabular data — use Table', 'Hierarchical — use Tree', 'Simple list — use StandardListItem'],
        'do': ['Include Avatar + author + timestamp + body', 'Group consecutive items by same author', 'Bind body text to sapList_TextColor'],
        'dont': ['Do not omit timestamps', 'Do not embed forms in FeedListItem — link out', 'Do not use for tabular data'],
        'compat': ['List'],
        'rules': [
            {'role':'author','state':'Default','token':'sapTitleColor','fallbackHex':'#1D2D3E'},
            {'role':'timestamp','state':'Default','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
            {'role':'text','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
        ],
        'notes': 'FeedListItem is sap.m.FeedListItem. Plugin composes Avatar + native text nodes.',
    },
    'ActionListItem': {
        'fid': 'lookup:pending', 'cat': 'List Item',
        'purpose': 'List row that triggers an action when tapped, instead of navigating to a detail page. Used in setting menus, command palettes, action lists.',
        'when': ['Settings menus that toggle modes or run actions', 'Quick-access action palettes', 'Sub-menu rows that fire an event rather than navigate'],
        'whenNot': ['Navigation — use StandardListItem with arrow', 'Object summary — use ObjectListItem', 'Selection — use CheckBox list'],
        'do': ['Use verb-first labels (Action-oriented)', 'Add a leading icon for recognition', 'Bind label to sapList_TextColor or sapButton_TextColor if emphasized'],
        'dont': ['Do not use ActionListItem for navigation', 'Do not omit icons when icon-only ActionListItem siblings exist'],
        'compat': ['List', 'Popover'],
        'rules': [
            {'role':'label','state':'Default','token':'sapButton_TextColor','fallbackHex':'#0064D9'},
            {'role':'icon','state':'Default','token':'sapButton_TextColor','fallbackHex':'#0064D9'},
        ],
        'notes': 'ActionListItem is sap.m.ActionListItem. Plugin renders as ColumnListItem with link-styled text.',
    },
    'InputListItem': {
        'fid': 'lookup:pending', 'cat': 'List Item',
        'purpose': 'List row containing a Label + inline Input control. Used in settings screens, mobile form layouts, profile edit pages.',
        'when': ['Mobile-optimized form layouts', 'Settings screens (label + value)', 'Quick edit lists where each row contains one field'],
        'whenNot': ['Multi-field forms — use Form / SimpleForm', 'Read-only display — use DisplayListItem'],
        'do': ['Each row has exactly one Label + one Input', 'Bind Label color to sapContent_LabelColor', 'Validate inputs inline'],
        'dont': ['Do not stack multiple Inputs in one row', 'Do not omit the Label'],
        'compat': ['List'],
        'rules': [
            {'role':'label','state':'Default','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
            {'role':'input-text','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
        ],
        'notes': 'InputListItem composes Label + Input. Plugin builds as ColumnListItem with HORIZONTAL Auto Layout (Label on left, Input fills right).',
    },
    'GroupHeaderListItem': {
        'fid': 'lookup:pending', 'cat': 'List Item',
        'purpose': 'Section header within a List. Visually separates groups of items by category, status, or date.',
        'when': ['Grouped lists (group by date, status, category)', 'Long lists that benefit from sectional structure', 'Mobile contact-list-style alphabetical groupings'],
        'whenNot': ['Short lists (< 10 items) — no grouping needed', 'Tabular data — use Table with grouped Columns'],
        'do': ['Provide a concise group title', 'Bind title to sapContent_LabelColor', 'Always uppercase or title-case for visual hierarchy'],
        'dont': ['Do not omit the count when relevant ("Inbox (12)")', 'Do not nest GroupHeaderListItems'],
        'compat': ['List'],
        'rules': [
            {'role':'title','state':'Default','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
            {'role':'background','state':'Default','token':'sapBackgroundColor','fallbackHex':'#F5F6F7'},
        ],
        'notes': 'GroupHeaderListItem is sap.m.GroupHeaderListItem. Plugin renders as a styled header row at the top of each group.',
    },
    'MaskedInput': {
        'fid': 'lookup:pending', 'cat': 'Input',
        'purpose': 'Input that enforces a character mask (phone numbers, SSN, credit cards, postal codes). User can only enter characters matching the mask pattern.',
        'when': ['Phone numbers, SSN, credit card, postal code', 'Any structured numeric input with fixed formatting', 'When typo prevention via input format is needed'],
        'whenNot': ['Free-form text — use Input', 'Numeric with range — use StepInput', 'Currency — use Input with type=Number'],
        'do': ['Provide a clear placeholder showing the mask format', 'Use the correct mask character (9 for digit, A for letter, etc.)', 'Validate completeness before submit'],
        'dont': ['Do not use MaskedInput for variable-length data', 'Do not omit the mask placeholder', 'Do not localize without re-checking mask format'],
        'compat': ['Form', 'Dialog', 'Panel'],
        'rules': [
            {'role':'text','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
            {'role':'placeholder','state':'Default','token':'sapField_PlaceholderTextColor','fallbackHex':'#556B82'},
            {'role':'border','state':'Default','token':'sapField_BorderColor','fallbackHex':'#556B81'},
        ],
        'notes': 'MaskedInput is sap.m.MaskedInput. Plugin renders as Input instance with placeholder showing the mask format. Mask enforcement is runtime-only — Figma renders the visual.',
    },
    'FeedInput': {
        'fid': 'lookup:pending', 'cat': 'Input',
        'purpose': 'Input optimised for feed/comment posting — multi-line text area with submit button anchored to the bottom-right.',
        'when': ['Comment composers under FeedListItem', 'Reply boxes on activity items', 'Note-posting in object detail pages'],
        'whenNot': ['Simple text — use Input', 'Long-form documents — use TextArea', 'Form fields — use Input or TextArea per type'],
        'do': ['Include an Avatar showing current user', 'Submit button is right-bottom-aligned, Emphasized type', 'Auto-grow textarea up to ~5 lines, then scroll', 'Disable submit until non-empty'],
        'dont': ['Do not use FeedInput as a generic textarea', 'Do not omit the Avatar', 'Do not auto-submit on Enter (use Cmd+Enter or button click)'],
        'compat': ['List (FeedListItem context)', 'DynamicPage', 'Card'],
        'rules': [
            {'role':'text','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
            {'role':'border','state':'Default','token':'sapField_BorderColor','fallbackHex':'#556B81'},
            {'role':'submit-fill','state':'Default','token':'sapButton_Emphasized_Background','fallbackHex':'#0070F2'},
        ],
        'notes': 'FeedInput is sap.m.FeedInput. Plugin composes Avatar + TextArea + Button into a horizontal Auto Layout with bottom-right submit.',
    },
    'FormattedText': {
        'fid': 'lookup:pending', 'cat': 'Typography',
        'purpose': 'Text container that supports inline HTML-like markup — bold, italic, links, line breaks. Used for rich text in object descriptions, help content, formatted messages.',
        'when': ['Object descriptions with mixed formatting', 'Help text with inline links', 'Localized messages with bold/italic emphasis', 'Server-supplied formatted content'],
        'whenNot': ['Plain text — use Text', 'Headings — use Title', 'Lists — use List', 'Editable rich text — use TextArea + format toolbar'],
        'do': ['Sanitize HTML before rendering', 'Bind base text to sapList_TextColor', 'Use sapLinkColor for inline links'],
        'dont': ['Do not render unsanitized user-supplied HTML', 'Do not use FormattedText for layout (no positioned content)', 'Do not embed forms inside FormattedText'],
        'compat': ['Panel', 'Dialog', 'Card', 'MessageStrip'],
        'rules': [
            {'role':'text-default','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
            {'role':'text-link','state':'Default','token':'sapButton_TextColor','fallbackHex':'#0064D9'},
            {'role':'text-emphasis','state':'Emphasis','token':'sapTitleColor','fallbackHex':'#1D2D3E'},
        ],
        'notes': 'FormattedText is sap.m.FormattedText. Plugin renders as a single Text node with mixed font styles via setRangeFontName. Inline links bind to sapLinkColor.',
    },
    'IconTabSeparator': {
        'fid': 'lookup:pending', 'cat': 'Navigation',
        'purpose': 'Visual separator between groups of tabs inside an IconTabBar.',
        'when': ['Inside IconTabBar between logical tab groups', 'When tabs span multiple distinct categories'],
        'whenNot': ['Outside IconTabBar', 'For visual padding — adjust itemSpacing instead'],
        'do': ['Use to separate logically distinct tab groups (Process / Settings / Help)', 'Keep separator visually subtle'],
        'dont': ['Do not abuse separators to compensate for tab overcrowding (limit tabs instead)', 'Do not use multiple separators in a row'],
        'compat': ['IconTabBar'],
        'rules': [
            {'role':'line','state':'Default','token':'sapShell_BorderColor','fallbackHex':'#D9D9D9'},
        ],
        'notes': 'IconTabSeparator is sap.m.IconTabSeparator. Plugin renders as a 1px vertical divider inside IconTabBar.',
    },
    'IconTabHeader': {
        'fid': 'lookup:pending', 'cat': 'Navigation',
        'purpose': 'Header zone of IconTabBar — the strip that holds the tab filters. Used as a standalone navigation strip when the content panel is rendered separately.',
        'when': ['Standalone tab strip without IconTabBar content panel', 'Detached tab navigation in a custom layout'],
        'whenNot': ['Normal use — IconTabBar already includes its IconTabHeader', 'For top tabs without filters — use Tabs'],
        'do': ['Inherit visual styling from IconTabBar', 'Manage selected state same as IconTabBar'],
        'dont': ['Do not use IconTabHeader if IconTabBar is sufficient — duplication risk', 'Do not nest IconTabHeader'],
        'compat': ['IconTabBar', 'DynamicPage'],
        'rules': [
            {'role':'fill','state':'Default','token':'sapShellColor','fallbackHex':'#FFFFFF'},
            {'role':'border','state':'Default','token':'sapShell_BorderColor','fallbackHex':'#D9D9D9'},
        ],
        'notes': 'IconTabHeader is sap.m.IconTabHeader. Plugin treats it as a thin wrapper around the IconTabBar header zone.',
    },

    # ─────── ALIAS COMPONENTS (figmaComponentId = "alias:OtherComponent") ───────
    'ObjectPageHeader': {
        'fid': 'alias:DynamicPageHeader', 'cat': 'Page Layout',
        'purpose': 'Header of an ObjectPageLayout — visually identical to DynamicPageHeader. Holds title, subtitle, metadata, actions for an object.',
        'when': ['Inside ObjectPageLayout', 'Top of an Object Page detail screen'],
        'whenNot': ['DynamicPage screens — use DynamicPageHeader', 'List Report screens — use DynamicPageTitle'],
        'do': ['Same conventions as DynamicPageHeader', 'Include title, subtitle, key metadata'],
        'dont': ['Do not use outside ObjectPageLayout', 'Do not omit the title'],
        'compat': ['ObjectPageLayout'],
        'rules': [
            {'role':'fill','state':'Default','token':'sapShell_Background','fallbackHex':'#F5F6F7'},
            {'role':'border','state':'Default','token':'sapShell_BorderColor','fallbackHex':'#D9D9D9'},
            {'role':'title','state':'Default','token':'sapTitleColor','fallbackHex':'#1D2D3E'},
        ],
        'notes': 'ObjectPageHeader aliases to DynamicPageHeader in the SAP Web UI Kit. Plugin SAP_KEYS maps ObjectPageHeader → DynamicPageHeader.',
    },
    'ObjectPageSection': {
        'fid': 'alias:Panel', 'cat': 'Page Layout',
        'purpose': 'Major section of an ObjectPageLayout — has a title, optional anchor in the navigation menu, contains SubSections.',
        'when': ['Inside ObjectPageLayout', 'When detail page has multiple major themes (General / Schedule / Notes)'],
        'whenNot': ['Outside ObjectPageLayout', 'For minor groupings — use ObjectPageSubSection or Panel'],
        'do': ['Provide a clear, scoped title', 'Use 2-7 SubSections per Section', 'Make title navigable via the page anchor menu'],
        'dont': ['Do not nest Sections', 'Do not exceed 7 SubSections per Section', 'Do not omit the title'],
        'compat': ['ObjectPageLayout'],
        'rules': [
            {'role':'title','state':'Default','token':'sapTitleColor','fallbackHex':'#1D2D3E'},
            {'role':'separator','state':'Default','token':'sapShell_BorderColor','fallbackHex':'#D9D9D9'},
        ],
        'notes': 'ObjectPageSection aliases to Panel. Plugin renders as Panel with bold title at H2 size and visual divider above.',
    },
    'ObjectPageSubSection': {
        'fid': 'alias:Panel', 'cat': 'Page Layout',
        'purpose': 'Subsection within an ObjectPageSection. Carries title + content.',
        'when': ['Inside ObjectPageSection', 'When a Section needs to be divided into logical groups'],
        'whenNot': ['Outside ObjectPageSection', 'For top-level sections — use ObjectPageSection'],
        'do': ['Provide H3-level title', 'Group related Form fields or content here', 'Keep content focused'],
        'dont': ['Do not nest SubSections', 'Do not skip ObjectPageSection (always wrap in Section)'],
        'compat': ['ObjectPageSection'],
        'rules': [
            {'role':'title','state':'Default','token':'sapTitleColor','fallbackHex':'#1D2D3E'},
        ],
        'notes': 'ObjectPageSubSection aliases to Panel with H3 title. Plugin renders inside parent ObjectPageSection with reduced visual prominence.',
    },
    'ResponsiveTable': {
        'fid': 'alias:Table', 'cat': 'Data Display',
        'purpose': 'Alias for sap.m.Table — the responsive table that Fiori uses by default. NOT to be confused with sap.ui.table.Table (GridTable).',
        'when': ['Standard tabular data display', 'Anywhere Table is used'],
        'whenNot': ['For analytical / heavy data — use GridTable (out of scope)', 'For hierarchical — use Tree'],
        'do': ['Treat as Table — same conventions apply'],
        'dont': ['Do not confuse with sap.ui.table.Table (GridTable)'],
        'compat': ['DynamicPage', 'Panel', 'Dialog', 'OverflowToolbar (as headerToolbar)'],
        'rules': [
            {'role':'fill','state':'Default','token':'sapBackgroundColor','fallbackHex':'#F5F6F7'},
            {'role':'border','state':'Default','token':'sapShell_BorderColor','fallbackHex':'#D9D9D9'},
            {'role':'header-bg','state':'Default','token':'sapShellColor','fallbackHex':'#FFFFFF'},
        ],
        'notes': 'ResponsiveTable is the canonical SAP name for sap.m.Table. Plugin aliases it to Table in SAP_KEYS / KEY_MAP. Specs may use either name.',
    },
    'MessageBox': {
        'fid': 'alias:Dialog', 'cat': 'Feedback',
        'purpose': 'Modal dialog for confirming actions, showing errors, asking yes/no questions. Has predefined types: Confirm, Error, Warning, Information, Success.',
        'when': ['Destructive action confirmation (Delete X?)', 'Error notifications that need acknowledgment', 'Critical decisions before commit'],
        'whenNot': ['Non-blocking feedback — use MessageStrip', 'Toast-style ephemeral — use MessageToast', 'Multi-step interaction — use Dialog'],
        'do': ['Use predefined types (Confirm / Error / Warning / Information / Success)', 'Include explicit buttons (Yes / No, Cancel / OK)', 'Match button intent to action consequence'],
        'dont': ['Do not use MessageBox for non-critical info — use MessageToast', 'Do not omit confirm button on destructive actions', 'Do not nest MessageBox'],
        'compat': ['Triggered from any context'],
        'rules': [
            {'role':'fill','state':'Default','token':'sapShellColor','fallbackHex':'#FFFFFF'},
            {'role':'border','state':'Default','token':'sapShell_BorderColor','fallbackHex':'#D9D9D9'},
            {'role':'title','state':'Default','token':'sapTitleColor','fallbackHex':'#1D2D3E'},
            {'role':'icon-error','state':'Error','token':'sapNegativeTextColor','fallbackHex':'#BB0000'},
            {'role':'icon-warning','state':'Warning','token':'sapCriticalTextColor','fallbackHex':'#A8650B'},
            {'role':'icon-success','state':'Success','token':'sapPositiveTextColor','fallbackHex':'#188919'},
        ],
        'notes': 'MessageBox aliases to Dialog with predefined State variant (Error/Warning/Information/Success/Confirm). Plugin renders Dialog with appropriate icon + colored header bar.',
    },
    'MessageToast': {
        'fid': 'alias:Toast', 'cat': 'Feedback',
        'purpose': 'Transient bottom-of-screen toast notification. Auto-dismisses after a few seconds. Non-blocking.',
        'when': ['Successful save confirmation', 'Background action completed', 'Non-critical info that does not block workflow'],
        'whenNot': ['Critical errors — use MessageBox', 'Validation feedback — use MessageStrip', 'Permanent status — use ObjectStatus'],
        'do': ['Use short messages (5-10 words)', 'Position bottom-center by default', 'Set duration 3-5 seconds', 'Make dismissible by tap'],
        'dont': ['Do not use MessageToast for critical info', 'Do not stack multiple MessageToasts simultaneously', 'Do not include actions (use MessageStrip)'],
        'compat': ['Anywhere — appears as overlay'],
        'rules': [
            {'role':'fill','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
            {'role':'text','state':'Default','token':'sapButton_Emphasized_TextColor','fallbackHex':'#FFFFFF'},
        ],
        'notes': 'MessageToast aliases to Toast. Plugin renders as a centered overlay frame with dark fill and white text. Auto-dismiss is runtime-only — Figma shows the visual state.',
    },
    'MessagePopover': {
        'fid': 'alias:Popover', 'cat': 'Feedback',
        'purpose': 'Anchored Popover that displays validation messages from a Form. Lists errors/warnings/info from across the form so users can navigate to each.',
        'when': ['Form validation summaries', 'Aggregate error display from a multi-field form', 'When users need to jump to each error from a single trigger'],
        'whenNot': ['Inline field validation — use MessageStrip below the field', 'Critical errors — use MessageBox', 'Tooltips — use Popover with text'],
        'do': ['Anchor to a status button with error count', 'Group messages by severity (Errors / Warnings / Info)', 'Make each row navigable to the source field'],
        'dont': ['Do not use MessagePopover for non-form contexts', 'Do not omit the error count on the trigger button'],
        'compat': ['Form', 'Dialog'],
        'rules': [
            {'role':'fill','state':'Default','token':'sapShellColor','fallbackHex':'#FFFFFF'},
            {'role':'error-icon','state':'Error','token':'sapNegativeTextColor','fallbackHex':'#BB0000'},
            {'role':'warning-icon','state':'Warning','token':'sapCriticalTextColor','fallbackHex':'#A8650B'},
            {'role':'success-icon','state':'Success','token':'sapPositiveTextColor','fallbackHex':'#188919'},
        ],
        'notes': 'MessagePopover aliases to Popover with MessageView content. Plugin composes Popover + grouped message list.',
    },
    'BusyDialog': {
        'fid': 'alias:Dialog', 'cat': 'Feedback',
        'purpose': 'Modal dialog containing a BusyIndicator and optional message. Blocks UI during long operations.',
        'when': ['Operations > 2 seconds that block workflow (save, sync, batch process)', 'When user must wait before proceeding'],
        'whenNot': ['Short operations — use BusyIndicator inline', 'Non-blocking — use ProgressIndicator', 'Determinate progress — use ProgressIndicator'],
        'do': ['Include a clear message ("Saving...", "Syncing...")', 'Provide Cancel button for cancellable operations', 'Auto-dismiss when complete'],
        'dont': ['Do not use BusyDialog for trivial waits (< 2s)', 'Do not omit a descriptive message', 'Do not block UI unnecessarily'],
        'compat': ['Triggered from any context'],
        'rules': [
            {'role':'fill','state':'Default','token':'sapShellColor','fallbackHex':'#FFFFFF'},
            {'role':'message','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
        ],
        'notes': 'BusyDialog aliases to Dialog containing BusyIndicator. Plugin composes Dialog + BusyIndicator + native text message.',
    },
    'QuickView': {
        'fid': 'alias:Popover', 'cat': 'Overlay',
        'purpose': 'Object summary preview shown in a Popover anchored to a list row or link. Avatar + title + key facts + actions, without leaving the current page.',
        'when': ['Hover-preview of a user, customer, or object from a table row', 'Quick-glance detail without full navigation', 'Right-click context summaries'],
        'whenNot': ['Full editing — open Object Page', 'Static text — use Popover with text', 'Critical decisions — use Dialog'],
        'do': ['Include Avatar + title + 3-5 key attributes', 'Provide "Open" link to full detail page', 'Bind background to sapShellColor'],
        'dont': ['Do not embed forms in QuickView', 'Do not exceed 5 attributes', 'Do not nest QuickViews'],
        'compat': ['Triggered from List rows, Link, Avatar'],
        'rules': [
            {'role':'fill','state':'Default','token':'sapShellColor','fallbackHex':'#FFFFFF'},
            {'role':'title','state':'Default','token':'sapTitleColor','fallbackHex':'#1D2D3E'},
            {'role':'attribute','state':'Default','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
        ],
        'notes': 'QuickView aliases to Popover. Plugin composes Popover with Avatar + Title + ObjectAttribute list + action Link.',
    },
    'SimpleForm': {
        'fid': 'alias:Form', 'cat': 'Forms',
        'purpose': 'Simplified Form alternative — automatically lays out Label + Input pairs in responsive columns. Less verbose than Form, more rigid.',
        'when': ['Standard label-input form layouts', 'Settings pages', 'Object edit screens with mostly text/select fields'],
        'whenNot': ['Custom field layouts — use Form', 'Single-field input — use Input', 'Multi-line data entry — use multiple Forms'],
        'do': ['Group related fields with FormContainer', 'Use FormElement for each field row', 'Set responsive layout (1 col mobile, 2 col tablet, 3 col desktop)'],
        'dont': ['Do not mix SimpleForm with Form in the same screen', 'Do not omit Labels', 'Do not use SimpleForm for complex layouts'],
        'compat': ['DynamicPage', 'Panel', 'Dialog', 'ObjectPageSection'],
        'rules': [
            {'role':'label','state':'Default','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
            {'role':'input-text','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
        ],
        'notes': 'SimpleForm aliases to Form. Plugin composes the same Form layout with auto-generated FormContainer/FormElement wrappers.',
    },
    'FormContainer': {
        'fid': 'alias:Form', 'cat': 'Forms',
        'purpose': 'Logical grouping within a Form. Contains FormElements. Has optional title.',
        'when': ['Inside Form / SimpleForm', 'When fields should be grouped under a heading (Personal Info / Address / Preferences)'],
        'whenNot': ['Single-group form — direct FormElements are fine', 'For visual sections — use Panel inside Form'],
        'do': ['Provide a clear group title when appropriate', 'Group 3-7 FormElements per FormContainer', 'Use sentence-case titles'],
        'dont': ['Do not nest FormContainer', 'Do not exceed 7 FormElements per group'],
        'compat': ['Form', 'SimpleForm'],
        'rules': [
            {'role':'title','state':'Default','token':'sapTitleColor','fallbackHex':'#1D2D3E'},
        ],
        'notes': 'FormContainer is part of Form composition. Plugin renders as a vertical AutoLayout group with optional H3 title.',
    },
    'FormElement': {
        'fid': 'alias:Form', 'cat': 'Forms',
        'purpose': 'Single field row inside a FormContainer — a Label + one or more input fields.',
        'when': ['Inside FormContainer', 'Every input field in a Form'],
        'whenNot': ['Outside FormContainer', 'For non-form layouts'],
        'do': ['Always include a Label', 'Bind Label to its Input via labelFor', 'Use one main Input per FormElement'],
        'dont': ['Do not omit the Label', 'Do not stack multiple Labels per FormElement', 'Do not nest FormElements'],
        'compat': ['FormContainer'],
        'rules': [
            {'role':'label','state':'Default','token':'sapContent_LabelColor','fallbackHex':'#556B82'},
        ],
        'notes': 'FormElement is part of Form composition. Plugin renders as a HORIZONTAL row (Label on left, Input on right) inside FormContainer.',
    },

    # ─────── COMPOSED COMPONENT ───────
    'RadioButtonGroup': {
        'fid': 'composed:RadioButton[]', 'cat': 'Input',
        'purpose': 'Vertical group of mutually-exclusive RadioButton options. Composed at plugin-time from items[] — each item becomes a RadioButton instance.',
        'when': ['Single-select from 2-7 options where all should be visible', 'Form fields with discrete value choices', 'Survey-style questions'],
        'whenNot': ['More than 7 options — use Select or ComboBox', 'Multi-select — use CheckBox group', 'Single yes/no — use Switch'],
        'do': ['Show all options at once', 'Mark exactly one as selected', 'Provide clear, distinct labels', 'Use vertical layout for >3 options'],
        'dont': ['Do not allow zero-selected state when a default is reasonable', 'Do not exceed 7 options', 'Do not use RadioButtonGroup for binary toggles (use Switch)'],
        'compat': ['Form', 'Dialog', 'Panel', 'FormContainer'],
        'rules': [
            {'role':'border','state':'Default','token':'sapField_BorderColor','fallbackHex':'#556B81'},
            {'role':'selected-fill','state':'Selected','token':'sapButton_Emphasized_Background','fallbackHex':'#0070F2'},
            {'role':'label','state':'Default','token':'sapList_TextColor','fallbackHex':'#1D2D3E'},
        ],
        'notes': 'RadioButtonGroup is composed (no single Figma instance). Plugin builds VERTICAL Auto Layout containing N RadioButton instances. Spec emits { component:"RadioButtonGroup", props:{ items:[{label,selected?}] } }.',
    },
}

def slugify(name):
    """ Convert CamelCase to kebab-case """
    out = []
    for i, c in enumerate(name):
        if c.isupper() and i > 0 and name[i-1].islower():
            out.append('-')
        out.append(c.lower())
    return ''.join(out)

def make_registry(name, d):
    return {
        'componentName': name,
        'figmaCommunityId': COMM_ID,
        'figmaComponentId': d['fid'],
        'figmaLibraryFileId': FILE_ID,
        'componentCategory': d['cat'],
        'supportedVariants': [
            {'property': 'Form Factor', 'values': ['Compact', 'Cozy'], 'default': 'Compact'},
            {'property': 'Interaction State', 'values': ['Regular', 'Hover', 'Focused', 'Active', 'Disabled'], 'default': 'Regular'},
        ],
        'supportedProperties': [
            {'name': 'text', 'ui5Name': 'text', 'type': 'text', 'exposedInLibrary': True, 'default': ''},
        ],
        'supportedStates': ['Regular', 'Hover', 'Focused', 'Active', 'Disabled'],
        'typographyRules': [
            {'role': 'default', 'fontFamily': '72', 'fontStyle': 'Regular', 'fontSize': 14, 'sapStyleName': 'MediumText/LHAuto/Regular'},
        ],
        'colorTokenRules': d['rules'],
        'accessibilityRules': [
            {'category': 'contrast', 'requirement': 'Text contrast ≥ 4.5:1 against bg (WCAG AA)', 'wcag': '1.4.3'},
            {'category': 'tap-target', 'requirement': 'Min 32×32 Compact / 44×44 Cozy'},
            {'category': 'keyboard', 'requirement': 'Fully operable via keyboard'},
            {'category': 'focus', 'requirement': 'Visible focus indicator'},
        ],
        'doRules': d['do'],
        'dontRules': d['dont'],
        'compatibleComponents': d['compat'],
        'incompatiblePatterns': ['See doRules and dontRules for context-specific rules.'],
        'guidelineUrl': f"https://experience.sap.com/fiori-design-web/{slugify(name)}/",
        'demoKitUrl': f"https://sdk.openui5.org/entity/sap.m.{name}",
        'apiUrl': f"https://sdk.openui5.org/api/sap.m.{name}",
        'sampleUrls': [f"https://sdk.openui5.org/entity/sap.m.{name}/sample/sap.m.sample.{name}"],
        'libraryVersion': LIB_VER,
        'lastValidated': LAST,
        'pluginNotes': d['notes'],
    }

def make_guideline(name, d):
    return {
        'componentName': name,
        'slug': slugify(name),
        'sourceUrl': f"https://experience.sap.com/fiori-design-web/{slugify(name)}/",
        'purpose': d['purpose'],
        'whenToUse': d['when'],
        'whenNotToUse': d['whenNot'],
        'doRules': d['do'],
        'dontRules': d['dont'],
        'layoutGuidance': {
            'placement': f"Place {name} inside a compatible container ({', '.join(d['compat'][:3])}).",
            'sizing': 'Auto width unless explicitly sized; height matches density (Compact 26-32px, Cozy 36-44px).',
            'spacing': '8px gap from adjacent elements; 16px between groups.',
            'alignment': 'Inherits from parent Auto Layout.',
        },
        'contentGuidance': {
            'labelLength': 'See doRules for specific length guidance.',
            'contentRules': ['Use sentence case', 'Localize all text', 'Avoid jargon'],
            'examples': [],
        },
        'responsiveBehavior': {
            'XL': 'Full size and visibility.',
            'L':  'Full size and visibility.',
            'M':  'May condense — see Fiori responsive design guidelines.',
            'S':  'May convert to alternative pattern on narrow viewports.',
        },
        'accessibilityGuidance': {
            'ariaPattern': f"Maps to ARIA pattern appropriate for {d['cat'].lower()}.",
            'contrast': '≥ 4.5:1 for text, ≥ 3:1 for borders (WCAG AA).',
            'keyboard': 'Full keyboard support — Tab to focus, Enter/Space to activate.',
            'screenReader': 'Announced with role and state.',
        },
        'patterns': [f"Used inside {pat}" for pat in d['compat'][:3]],
        'compatibility': d['compat'],
        'exceptions': ['See pluginNotes for plugin-specific rendering caveats.'],
        'version': LIB_VER,
        'lastChecked': LAST,
    }

written = 0
for name, d in COMPONENTS.items():
    rpath = os.path.join(REG, f"{name}.json")
    gpath = os.path.join(GUI, f"{name}.json")
    with open(rpath, 'w') as f:
        json.dump(make_registry(name, d), f, indent=2); f.write('\n')
    with open(gpath, 'w') as f:
        json.dump(make_guideline(name, d), f, indent=2); f.write('\n')
    written += 1

print(f"Wrote {written} registry + {written} guideline entries.")
print(f"Categories represented: {set(d['cat'] for d in COMPONENTS.values())}")
