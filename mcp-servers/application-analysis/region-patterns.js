/**
 * Region → SAP pattern mapping table
 *
 * The core knowledge that maps generic UI observations to SAP Fiori components.
 * Each entry: visual hints the AI might describe → SAP component + when to use it.
 *
 * This is intentionally pattern-based, not pixel-based. The caller (Claude)
 * does the vision work and produces structured descriptions; this table maps
 * descriptions to SAP components.
 *
 * Keys are "regionType" tokens the caller passes in (a controlled vocabulary).
 */

export const REGION_PATTERNS = {
  // ── Shell / app frame ────────────────────────────────────────────────────
  'app-shell-header': {
    sapComponents: ['ShellBar'],
    floorplanHint: 'any',
    description: 'Top app bar with brand, search, account avatar, notifications',
    visualCues: ['logo top-left', 'search bar center', 'avatar top-right', 'fixed 52px height'],
    confidence: 'high',
    notes: 'Always place as first hierarchy item.',
  },
  'side-navigation': {
    sapComponents: ['SideNavigation', 'NavigationItem'],
    floorplanHint: 'any',
    description: 'Vertical menu rail on the left',
    visualCues: ['vertical list of items', 'left-aligned', '224-256px wide', 'icons + labels'],
    confidence: 'high',
    notes: 'For 5+ top-level destinations. Use IconTabBar for ≤4.',
  },

  // ── Page header zones ────────────────────────────────────────────────────
  'page-header-with-title': {
    sapComponents: ['DynamicPage', 'DynamicPageTitle'],
    floorplanHint: 'object-page',
    description: 'Page-level header with title, breadcrumb, and action buttons',
    visualCues: ['large title text', 'breadcrumb above title', 'action buttons right'],
    confidence: 'high',
    notes: 'Use DynamicPage as container; DynamicPageTitle is sticky on scroll.',
  },
  'page-metadata-band': {
    sapComponents: ['DynamicPageHeader'],
    floorplanHint: 'object-page',
    description: 'Metadata strip below title (vendor / mode / version / status)',
    visualCues: ['key-value pairs', 'small text', 'horizontal layout', 'collapses on scroll'],
    confidence: 'high',
    notes: 'Goes inside DynamicPage as header slot.',
  },

  // ── Navigation between sections ──────────────────────────────────────────
  'tab-navigation': {
    sapComponents: ['IconTabBar', 'IconTabFilter'],
    floorplanHint: 'object-page',
    description: 'Horizontal tabs separating page sections',
    visualCues: ['horizontal row of labels', 'underline indicator on active', 'optional counter badges'],
    confidence: 'high',
    notes: 'Max ~7 tabs. Active tab text is bold + 3px bottom bar.',
  },
  'breadcrumb-trail': {
    sapComponents: ['Breadcrumb'],
    floorplanHint: 'any',
    description: 'Hierarchical navigation path "A / B / C"',
    visualCues: ['horizontal text with separators (/, ›)', 'each segment is a link except last'],
    confidence: 'high',
    notes: 'Goes inside DynamicPageTitle breadcrumbs slot.',
  },

  // ── Tabular data ─────────────────────────────────────────────────────────
  'data-table': {
    sapComponents: ['Table', 'Column', 'ColumnListItem'],
    floorplanHint: 'list-report',
    description: 'Tabular data with column headers and rows',
    visualCues: ['aligned columns', 'header row', 'multiple rows of same structure', 'optional row selection'],
    confidence: 'high',
    notes: 'Use ColumnListItem rows. Add OverflowToolbar above for title + actions.',
  },
  'table-toolbar': {
    sapComponents: ['OverflowToolbar', 'Title', 'Button', 'SearchField'],
    floorplanHint: 'list-report',
    description: 'Toolbar above table with title, filter, action buttons',
    visualCues: ['title text left', 'search input + buttons right', 'thin horizontal bar'],
    confidence: 'high',
    notes: 'OverflowToolbar wraps the children; Title left, ToolbarSpacer, then actions.',
  },
  'simple-list': {
    sapComponents: ['List', 'StandardListItem'],
    floorplanHint: 'any',
    description: 'Vertical list of similar items (not tabular)',
    visualCues: ['no column structure', 'each item has title + optional description', 'separators between items'],
    confidence: 'high',
    notes: 'Use for 3-20 items. For more, use Table or pagination.',
  },

  // ── Forms ─────────────────────────────────────────────────────────────────
  'form-section': {
    sapComponents: ['Form', 'Label'],
    floorplanHint: 'form-based',
    description: 'Grouped input fields with labels',
    visualCues: ['labels left or above fields', 'consistent spacing', 'section title above group'],
    confidence: 'high',
    notes: 'Pair every input with Label. Use Panel to group related fields.',
  },
  'input-field': {
    sapComponents: ['Input', 'Label'],
    floorplanHint: 'form-based',
    description: 'Single-line text input',
    visualCues: ['bordered rectangle', 'placeholder or value text', 'label associated'],
    confidence: 'high',
    notes: 'For email, phone, etc. use type variant for mobile keyboard hints.',
  },
  'dropdown-select': {
    sapComponents: ['Select', 'Label'],
    floorplanHint: 'form-based',
    description: 'Dropdown for choosing from fixed list (4-12 options)',
    visualCues: ['input field with chevron down', 'opens list when clicked', 'single value selected'],
    confidence: 'high',
    notes: 'For >12 options, use ComboBox; for multi, use MultiComboBox.',
  },
  'checkbox-field': {
    sapComponents: ['CheckBox'],
    floorplanHint: 'form-based',
    description: 'Binary or multi-select boolean choice',
    visualCues: ['16x16 square', 'optional checkmark', 'label right of box'],
    confidence: 'high',
    notes: 'Use Partial state for mixed children.',
  },
  'radio-group': {
    sapComponents: ['RadioButton'],
    floorplanHint: 'form-based',
    description: 'Mutually exclusive choice from small set',
    visualCues: ['circle indicators', 'only one selected at a time', 'grouped vertically'],
    confidence: 'high',
    notes: '2-6 options. For more, use Select.',
  },
  'toggle-switch': {
    sapComponents: ['Switch'],
    floorplanHint: 'any',
    description: 'On/off binary control with instant action',
    visualCues: ['oval pill with sliding indicator', 'colored when on', 'no save needed'],
    confidence: 'high',
    notes: 'For instant settings. If form needs Save button, use CheckBox.',
  },
  'date-input': {
    sapComponents: ['DatePicker'],
    floorplanHint: 'any',
    description: 'Single date entry with calendar popup',
    visualCues: ['input field with calendar icon', 'opens calendar when clicked'],
    confidence: 'high',
    notes: 'For date range use DateRangePicker; for date+time use DateTimePicker.',
  },

  // ── Actions and CTAs ─────────────────────────────────────────────────────
  'primary-action': {
    sapComponents: ['Button'],
    floorplanHint: 'any',
    description: 'Main call-to-action button (Save, Submit, Create)',
    visualCues: ['filled background', 'high-contrast text', 'prominent placement'],
    confidence: 'high',
    notes: 'Use type="Emphasized". One per screen — never multiple Emphasized buttons.',
    intent: 'primary-action',
  },
  'secondary-action': {
    sapComponents: ['Button'],
    floorplanHint: 'any',
    description: 'Supporting action (Cancel, Export, Back)',
    visualCues: ['outlined or transparent', 'left of primary action'],
    confidence: 'high',
    notes: 'Use type="Default" or "Transparent".',
    intent: 'secondary-action',
  },
  'destructive-action': {
    sapComponents: ['Button'],
    floorplanHint: 'any',
    description: 'Action that deletes or destroys data',
    visualCues: ['red color', 'often paired with confirmation dialog'],
    confidence: 'high',
    notes: 'Use type="Negative". Always confirm via Dialog before executing.',
    intent: 'destructive',
  },
  'icon-action': {
    sapComponents: ['IconButton'],
    floorplanHint: 'any',
    description: 'Icon-only action button (Edit, Delete, More)',
    visualCues: ['icon without label', 'tooltip on hover', 'in toolbars and tables'],
    confidence: 'high',
    notes: 'Always provide tooltip. Min 32×32 touch area.',
  },

  // ── Feedback / status ────────────────────────────────────────────────────
  'status-badge': {
    sapComponents: ['ObjectStatus'],
    floorplanHint: 'any',
    description: 'Semantic status indicator (Success/Warning/Error/Info)',
    visualCues: ['colored icon + text', 'short label like "Approved" or "Pending"'],
    confidence: 'high',
    notes: 'Always pair color with icon AND text. Never communicate status by color alone.',
  },
  'message-banner': {
    sapComponents: ['MessageStrip'],
    floorplanHint: 'any',
    description: 'Inline contextual message at top of page or section',
    visualCues: ['horizontal colored bar', 'icon + text', 'optional close button'],
    confidence: 'high',
    notes: 'Use type="Information/Positive/Warning/Error". For transient feedback use MessageToast.',
  },
  'kpi-tile': {
    sapComponents: ['ObjectNumber'],
    floorplanHint: 'overview-page',
    description: 'Prominent numeric KPI with unit',
    visualCues: ['large number', 'small unit text', 'optional semantic color'],
    confidence: 'high',
    notes: 'Pair with ObjectStatus when critical (over budget, low stock).',
  },
  'loading-indicator': {
    sapComponents: ['BusyIndicator'],
    floorplanHint: 'any',
    description: 'Spinner shown during async operations',
    visualCues: ['circular spinner animation', 'optional text below'],
    confidence: 'high',
    notes: 'Use only for ops >1 second. For empty states use IllustratedMessage.',
  },

  // ── Overlays ─────────────────────────────────────────────────────────────
  'confirmation-modal': {
    sapComponents: ['Dialog'],
    floorplanHint: 'any',
    description: 'Modal overlay blocking interaction until user acts',
    visualCues: ['dimmed backdrop', 'centered card', 'title + body + action buttons'],
    confidence: 'high',
    notes: 'Use state variant for semantic Dialogs. Always include Cancel + primary action.',
  },

  // ── Display / object identity ────────────────────────────────────────────
  'object-identifier': {
    sapComponents: ['ObjectIdentifier'],
    floorplanHint: 'list-report',
    description: 'Primary identifier of a row/object (title + subtitle)',
    visualCues: ['bold first line', 'lighter second line', 'in tables and lists'],
    confidence: 'high',
    notes: 'Use as first column in tables. Set titleActive=true if drilldown.',
  },
  'avatar-image': {
    sapComponents: ['Avatar'],
    floorplanHint: 'any',
    description: 'Person photo, product image, or initials placeholder',
    visualCues: ['circle for people', 'square for products', '24-128px'],
    confidence: 'high',
    notes: 'Always provide accessible label.',
  },
  'tag-label': {
    sapComponents: ['Tag'],
    floorplanHint: 'any',
    description: 'Categorical label (not semantic status)',
    visualCues: ['rounded pill', 'short text', 'subtle background'],
    confidence: 'medium',
    notes: 'For semantic status use ObjectStatus instead.',
  },

  // ── Filter / search ──────────────────────────────────────────────────────
  'filter-bar': {
    sapComponents: ['FilterBar', 'Input', 'Select', 'DateRangePicker'],
    floorplanHint: 'list-report',
    description: 'Horizontal panel of filter fields above a list/table',
    visualCues: ['horizontal row of filter inputs', 'Go button', 'optional "More Filters" link'],
    confidence: 'high',
    notes: 'Place in DynamicPageHeader. Show most important filters by default.',
  },
  'search-input': {
    sapComponents: ['SearchField'],
    floorplanHint: 'any',
    description: 'Search input with magnifying glass icon',
    visualCues: ['input with search icon', 'optional clear icon when filled'],
    confidence: 'high',
    notes: 'For filter-style search use FilterBar instead.',
  },
};

/**
 * Floorplan suggestion heuristics — given a set of detected region types,
 * which SAP Fiori floorplan fits best.
 */
export const FLOORPLAN_HEURISTICS = [
  {
    floorplan: 'list-report',
    indicators: ['data-table', 'filter-bar', 'table-toolbar'],
    description: 'Search → filter → list of results. Object Page on row click.',
    requires: ['data-table'],
  },
  {
    floorplan: 'object-page',
    indicators: ['page-header-with-title', 'page-metadata-band', 'tab-navigation'],
    description: 'Detail view of a single business object across multiple sections.',
    requires: ['page-header-with-title'],
  },
  {
    floorplan: 'worklist',
    indicators: ['data-table', 'primary-action', 'status-badge'],
    description: 'Queue of items requiring user action. Bulk select + approve/reject.',
    requires: ['data-table', 'status-badge'],
  },
  {
    floorplan: 'overview-page',
    indicators: ['kpi-tile'],
    description: 'Dashboard of KPIs and analytics tiles. Drill-down on tile click.',
    requires: ['kpi-tile'],
  },
  {
    floorplan: 'wizard',
    indicators: ['form-section', 'primary-action', 'secondary-action'],
    description: 'Multi-step guided process. Step progress indicator + Next/Back.',
    requires: ['form-section'],
  },
  {
    floorplan: 'form-based',
    indicators: ['form-section', 'input-field'],
    description: 'Single-section form for create/edit. Save + Cancel.',
    requires: ['form-section'],
  },
];

/**
 * Score a set of detected regions against each floorplan heuristic.
 * Returns { floorplan, score, rationale } for each, sorted by score desc.
 */
export function scoreFloorplans(detectedRegions) {
  const detected = new Set(detectedRegions.map(r => r.regionType || r));
  const results = [];

  for (const h of FLOORPLAN_HEURISTICS) {
    const requiredMet = h.requires.every(r => detected.has(r));
    const indicatorMatches = h.indicators.filter(i => detected.has(i)).length;
    const score = requiredMet ? indicatorMatches * 10 : indicatorMatches;
    const missing = h.requires.filter(r => !detected.has(r));

    results.push({
      floorplan: h.floorplan,
      score,
      indicatorsMatched: indicatorMatches,
      totalIndicators: h.indicators.length,
      requiredMet,
      missingRequired: missing,
      description: h.description,
      rationale: requiredMet
        ? `Required regions present (${h.requires.join(', ')}); ${indicatorMatches}/${h.indicators.length} indicators match`
        : `Missing required: ${missing.join(', ')}`,
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}
