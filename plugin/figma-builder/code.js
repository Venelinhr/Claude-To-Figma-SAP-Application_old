// Claude to Figma SAP Application — v6: Full Component Library
// 50+ SAP Web UI Kit components mapped with verified keys.
// Flat layout: every component stacked directly on screen frame.
// Keys verified via search_design_system MCP, 2026-06-22.

// ─────────────────────────────────────────────────────────────────────────────
// VERIFIED SAP LIBRARY COMPONENT KEYS (50 components)
// ─────────────────────────────────────────────────────────────────────────────
const SAP_KEYS = {
  // Navigation / Shell
  ShellBar:             '169cfd74c0be329c56b4c79b9404c978ff10cb60',
  Breadcrumb:           '5743166bac11fdf110a54fd7d85436fed186d3b2',
  SideNavigation:       'd680af6d72f9421fe3f8712bf0ce171308963d3a',
  ToolHeader:           '73a0370a9342211081a4ace445d10ab064963624',
  Header:               'd4560b56c7b5aa9476e6b23bfaf869166b7fff47',
  Footer:               'e563bc3291a07a5eb4d97b2083355cc54023c377',
  UserMenu:             'c9bbc83c501d55048df4f68df50d920a9e85002c',

  // Buttons
  Button:               '91805fa199b1fd247d76a9c08bbe0982b49065c4',
  IconButton:           'c1ee1ca76974c720ecd4b1888e1e23ac8a36ec63',
  MenuButton:           '1d667088d93c355c2bd9bafac57147286206e799',
  SegmentedButton:      '308476a5285b5a132241dc1c118d09ecf8d82273',
  SplitButton:          '8aba512152f89d81e9c9b804d8da3114b1a83a93',
  IconMenuButton:       'c455c46ed2cea345c534193c1598e5459aaadd11',

  // Toolbars
  Toolbar:              '58a258bf5813e59cec4dfc684c8cdb2a6ca6721f',
  ToolbarItems:         'ad45e5bf267d83ee320902263db8887f71e97026',

  // Page layout
  DynamicPageHeader:    'dc90c8dbf7714f165ed79357e9ba6ade5b3701ae',
  IconTabBar:           '4aafcbf55528c439876b314d155438884b614722',

  // Table
  Table:                '03ea321822c4e99c27de4d9c2524bdec9c6e0972',
  TableCell:            'e717737e98a40a8619e315ca1b4b04646b93b541',
  Tree:                 '93fca87e34305e0a8e036acdd51e7cdc870d4e0d',
  TreeItem:             '5142305385e26387daddd9af7b58a7da66a9f8fd',

  // Form inputs
  Input:                '0f4366cb3065919e8f3deb0462f1a5a3633d6b50',
  Select:               '5ce369ff7fb0cce28984eec8dd9973ccde82facb',
  MultiCombobox:        'cc0631141a7083096632c6161ee15448ced39ec3',
  MultiInput:           '1dac6b2be28e60c6ff7a5752182d97f5033d3fc8',
  CheckBox:             '23b4a2ca030e4bd2ff3bdd5b97b70f646ec09071',
  RadioButton:          '9308f27ef27fbb28bc7d167c52494aa41a21610f',
  Switch:               'c63509f642cdabbeb8c1878dd125ee006481631c',
  TextArea:             'bee4738dd5e5856a3b88eae341b47376a3269d87',
  DateRangePicker:      'ad1f84e6293671f80ff8dd174b1da0cbacf0fa48',
  DateTimePicker:       '377d76d309f4e5ee7e12132eba0df4e29686a4f7',
  TimePicker:           'f07044ee64f4abfc857543051806986d49a54b68',
  StepInput:            '69f0f7acf68766ac89890d0c119f64bfd50e693a',
  Slider:               'ee3b9995f1484c6d008bbac9dba2bd8a0026c160',
  RangeSlider:          '34d973fcb4c85d6517c8e5c3079e2b40d14d0fe8',
  Label:                'b38ac753648ad298c1e2dd02d71417566dd6095c',
  FileUploader:         'b7532a6da2cb7677348b5d4bbb81952c9224e984',

  // Display
  Link:                 '2e67b5399e9f05950c6f6ea6f244a1a9736c8a56',
  ObjectStatus:         '748d609ead5d4a246d7cd7c144b94b518c467e58',
  ObjectIdentifier:     '8e1e45c5a89b540f6ec53542279c7711d4020d81',
  ObjectNumber:         '7b67d22ed19f246b708dc4664808a45f314a7414',
  ObjectAttribute:      '080ead216322befe153704bf8f11373158fea34a',
  Avatar:               '71a3389ecbd47822b3184700766e30963fc2f220',
  Tag:                  '9b55bf702befd73b2e28f800ee4d0033bc0e0e95',
  ProgressIndicator:    'c355f86d77c4e5a8aa2366b83179896f7d172462',
  RatingIndicator:      '4e75dd8968be7061ba703e3f5fb4364b558acb04',
  BusyIndicator:        'e328630d6c564d1f312256254e0543d41bacbb84',
  Calendar:             '16743cba69c57792417e8f6b51d347cc29bd2d95',
  Card:                 '76fbadb97db272943b14aff18ee5809d0360795f',

  // Feedback / Overlays
  MessageStrip:         'f0e77f8888796e35c0e791ddc0b38535eda6ec31',
  IllustratedMessage:   'eba579505df21536654910797f94b3784248807b',
  Toast:                'bbe4c3f7114a2eb4286844102f42c909bf0798eb',
  Dialog:               '5b965b1eda133ac521b42fa20b201e9491f4bf83',
  Popover:              '5f472d6482ed33c9967694fa411c675e3b214d39',
  Menu:                 'ba51eb54cba79d6795057e5df5ff853d361ee799',
  Notifications:        'af1b29be8db435ed790d87721cff4d7efe2217bd',
  NotificationListItem: '6fe89ae5f6a512bebad2f9737ed134bccac1faed',
  NotificationBanner:   'aa8ef403a7c765acf86d2e6fc887a6cb496a3371',

  // Containers
  Panel:                '4d19c2a24896033fe5b04bcc5dfdf43e9626283d',
  Form:                 '6603eb3ebde2c1c763f2ae450df2cbb799ba640d',
  List:                 '4fb0a3e2fc56fb58d9904d68eb4ac58b9fb1bd25',
  ListItem:             'f7bc6526a9f16608747a4141800146ebd3f4e835',
  Carousel:             'bf174ffb841e4b27947d0be558656bb80238fe0d',
  Tokenizer:            'da76d0413ed1f1f40d6f23e7732c9aca0b17ef5b',
  Token:                '5664972429518d07040a3cadfa2d5a28cf19b8a7',
  ProductSwitch:        '22a7c83b19c183e92577ec43dd01eaa188739cd9',
  Settings:             'a337e8f637533682b7a0a8082f6db074c5082c81',
  ColorPicker:          'da4ac5fe23880bbdefabbf0059891eb289b5a52a',
  AIButton:             '6d9a69eec5a716375ccd5e7272c6193dbe8718ce',
  AIPromptInput:        '73c83eecc6edcaf572bca3c411b7345a5d398b3c',
};

// Spec component name → SAP_KEYS key
const KEY_MAP = {
  // Shell / Navigation
  ShellBar:             'ShellBar',
  Breadcrumbs:          'Breadcrumb',
  Breadcrumb:           'Breadcrumb',
  SideNavigation:       'SideNavigation',
  ToolHeader:           'ToolHeader',
  Footer:               'Footer',
  UserMenu:             'UserMenu',

  // Buttons
  Button:               'Button',
  IconButton:           'IconButton',
  MenuButton:           'MenuButton',
  SegmentedButton:      'SegmentedButton',
  SplitButton:          'SplitButton',
  IconMenuButton:       'IconMenuButton',

  // Toolbars
  Toolbar:              'Toolbar',
  OverflowToolbar:      'Toolbar',
  ToolbarSpacer:        'ToolbarItems',

  // Page layout
  DynamicPageHeader:    'DynamicPageHeader',
  DynamicPageTitle:     'DynamicPageHeader',
  FilterBar:            'DynamicPageHeader',
  ObjectHeader:         'DynamicPageHeader',
  IconTabBar:           'IconTabBar',
  TabBar:               'IconTabBar',

  // Table / Tree / List
  Table:                'Table',
  TableCell:            'TableCell',
  Tree:                 'Tree',
  TreeItem:             'TreeItem',
  List:                 'List',
  StandardListItem:     'ListItem',
  ListItem:             'ListItem',
  NotificationListItem: 'NotificationListItem',

  // Form inputs
  Input:                'Input',
  SearchField:          'Input',
  Select:               'Select',
  ComboBox:             'Select',
  MultiComboBox:        'MultiCombobox',
  MultiInput:           'MultiInput',
  CheckBox:             'CheckBox',
  RadioButton:          'RadioButton',
  Switch:               'Switch',
  TextArea:             'TextArea',
  DatePicker:           'DateRangePicker',
  DateRangeSelection:   'DateRangePicker',
  DateTimePicker:       'DateTimePicker',
  TimePicker:           'TimePicker',
  StepInput:            'StepInput',
  Slider:               'Slider',
  RangeSlider:          'RangeSlider',
  Label:                'Label',
  Title:                'Label',
  FileUploader:         'FileUploader',

  // Display
  Link:                 'Link',
  ObjectStatus:         'ObjectStatus',
  ObjectIdentifier:     'ObjectIdentifier',
  ObjectNumber:         'ObjectNumber',
  ObjectAttribute:      'ObjectAttribute',
  Avatar:               'Avatar',
  Tag:                  'Tag',
  InfoLabel:            'Tag',
  ProgressIndicator:    'ProgressIndicator',
  RatingIndicator:      'RatingIndicator',
  BusyIndicator:        'BusyIndicator',
  Calendar:             'Calendar',
  Card:                 'Card',
  Carousel:             'Carousel',

  // Feedback / Overlays
  MessageStrip:         'MessageStrip',
  IllustratedMessage:   'IllustratedMessage',
  Toast:                'Toast',
  Dialog:               'Dialog',
  Popover:              'Popover',
  Menu:                 'Menu',
  Notifications:        'Notifications',
  NotificationBanner:   'NotificationBanner',

  // Containers
  Panel:                'Panel',
  Form:                 'Form',
  Tokenizer:            'Tokenizer',
  Token:                'Token',
  ProductSwitch:        'ProductSwitch',
  Settings:             'Settings',
  ColorPicker:          'ColorPicker',
  AIButton:             'AIButton',
  AIPromptInput:        'AIPromptInput',
};

// Pure layout containers — transparent in Figma model
const LAYOUT_CONTAINERS = new Set([
  'DynamicPage', 'Page', 'ObjectPageLayout', 'FlexibleColumnLayout',
  'FlexBox', 'HBox', 'VBox',
  'Column', 'ColumnListItem',
  'Text',
  'Label',   // inline — only meaningful inside Form, skip when standalone
]);

// Opaque SAP instances — place the component itself but do NOT recurse into children.
// Their internal structure is self-contained; injecting children breaks the layout.
const OPAQUE_SAP = new Set(['Form']);

// ─────────────────────────────────────────────────────────────────────────────
// SAP COLOUR PALETTE (layout frames only — SAP kit instances carry their own colours)
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  pageBg:  { r: 0.961, g: 0.965, b: 0.969 },  // sapBackgroundColor
  white:   { r: 1,     g: 1,     b: 1     },
  border:  { r: 0.898, g: 0.898, b: 0.898 },  // sapSeparatorColor
  text:    { r: 0.196, g: 0.212, b: 0.227 },  // sapTextColor
  textSec: { r: 0.416, g: 0.427, b: 0.439 },  // sapContent_LabelColor
  accent:  { r: 0,     g: 0.439, b: 0.949 },  // sapSelectedColor
};

// ─────────────────────────────────────────────────────────────────────────────
// IMPORT CACHE
// ─────────────────────────────────────────────────────────────────────────────
const _cache = {};

async function importKey(key, name) {
  if (_cache[key]) return _cache[key];
  try {
    // Keys from search_design_system are component SET keys
    const compSet = await figma.importComponentSetByKeyAsync(key);
    // Get the default variant as the base component to instantiate
    const comp = compSet.defaultVariant;
    _cache[key] = comp;
    return comp;
  } catch(e) {
    const msg = 'Import failed: ' + (name || key.slice(0,12)) + ' - ' + String(e);
    console.warn(msg);
    figma.ui.postMessage({ type: 'warning', text: msg });
    return null;
  }
}

async function sapInstance(specName, variantProps) {
  variantProps = variantProps || {};
  const keyAlias = KEY_MAP[specName];
  if (!keyAlias) return null;
  const key = SAP_KEYS[keyAlias];
  if (!key) return null;
  const comp = await importKey(key, specName);
  if (!comp) return null;
  const inst = comp.createInstance();
  inst.name = specName;
  // Pre-load all fonts used by this instance before any text edits or appendChild
  try {
    const textNodes = inst.findAll(n => n.type === 'TEXT');
    const fonts = {};
    for (const t of textNodes) {
      const fn = t.fontName;
      if (fn && fn.family) {
        const k = fn.family + '|' + fn.style;
        if (!fonts[k]) { fonts[k] = fn; }
      }
    }
    await Promise.all(Object.values(fonts).map(fn => figma.loadFontAsync(fn).catch(() => null)));
  } catch(e) {}
  if (Object.keys(variantProps).length) {
    try {
      inst.setProperties(variantProps);
    } catch(e) {
      console.warn(specName + ' setProperties: ' + String(e));
    }
  }
  return inst;
}

async function setText(inst, searchName, value) {
  try {
    const node = searchName
      ? inst.findOne(n => n.type === 'TEXT' && n.name.toLowerCase().includes(searchName.toLowerCase()))
      : inst.findOne(n => n.type === 'TEXT');
    if (node && value) {
      await figma.loadFontAsync(node.fontName);
      node.characters = String(value);
    }
  } catch(e) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// VARIANT PROP HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function ff(density) { return density === 'cozy' ? 'Cozy' : 'Compact'; }

function buttonVariants(intent, density) {
  const t = { 'primary-action':'Primary', 'secondary-action':'Secondary',
               'destructive':'Negative', 'approval':'Positive', 'ghost':'Tertiary' };
  return { 'Form Factor': ff(density), 'Type': t[intent] || 'Secondary', 'Interaction State': 'Regular' };
}

function statusVariants(state) {
  const s = { Success:'Positive', Warning:'Critical', Error:'Negative', Information:'Informative', None:'None' };
  return { 'State': s[state] || 'None' };
}

function msgStripVariants(type) {
  const t = { Information:'Information', Warning:'Warning', Error:'Error', Success:'Positive' };
  return { 'Type': t[type] || 'Information' };
}

// ─────────────────────────────────────────────────────────────────────────────
// FONT LOAD (for layout frame text only)
// ─────────────────────────────────────────────────────────────────────────────
async function loadFonts() {
  await Promise.all([
    figma.loadFontAsync({ family: 'Inter', style: 'Regular' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Medium' }),
    figma.loadFontAsync({ family: 'Inter', style: 'Bold' }),
    figma.loadFontAsync({ family: '72', style: 'Regular' }),
    figma.loadFontAsync({ family: '72', style: 'Bold' }),
    figma.loadFontAsync({ family: '72', style: 'Italic' }),
    figma.loadFontAsync({ family: '72', style: 'Light' }),
    figma.loadFontAsync({ family: '72', style: 'Semibold' }),
    figma.loadFontAsync({ family: '72', style: 'Semibold Duplex' }),
  ].map(p => p.catch(() => null))); // ignore any font that isn't available
}

// ─────────────────────────────────────────────────────────────────────────────
// LAYOUT FRAME HELPERS (for containers only)
// ─────────────────────────────────────────────────────────────────────────────
function solid(color, opacity) {
  const p = { type: 'SOLID', color };
  if (opacity !== undefined) p.opacity = opacity;
  return p;
}

function makeFrame(name, opts = {}) {
  const f = figma.createFrame();
  f.name = name;
  if (opts.w !== undefined && opts.h !== undefined) f.resize(opts.w, opts.h);
  f.fills = opts.fills !== undefined ? opts.fills : [solid(C.white)];
  if (opts.layout) {
    f.layoutMode = opts.layout;
    f.primaryAxisSizingMode = opts.primarySize || 'AUTO';
    f.counterAxisSizingMode = opts.counterSize || 'AUTO';
    f.primaryAxisAlignItems = opts.primaryAlign || 'MIN';
    f.counterAxisAlignItems = opts.counterAlign || 'CENTER';
    f.itemSpacing = opts.gap || 0;
    f.paddingTop    = opts.pt || opts.pv || opts.p || 0;
    f.paddingBottom = opts.pb || opts.pv || opts.p || 0;
    f.paddingLeft   = opts.pl || opts.ph || opts.p || 0;
    f.paddingRight  = opts.pr || opts.ph || opts.p || 0;
  }
  if (opts.stroke) {
    f.strokes = [solid(opts.stroke)];
    f.strokeWeight = opts.strokeW || 1;
    f.strokeAlign = 'INSIDE';
  }
  if (opts.radius !== undefined) f.cornerRadius = opts.radius;
  return f;
}

function makeText(content, opts = {}) {
  const t = figma.createText();
  t.fontName = { family: 'Inter', style: opts.bold ? 'Bold' : opts.medium ? 'Medium' : 'Regular' };
  t.characters = String(content);
  t.fontSize = opts.size || 13;
  t.fills = [solid(opts.color || C.text)];
  return t;
}

// Set layout sizing so a child fits properly inside an auto-layout parent
function hugChild(node) {
  try { node.layoutSizingHorizontal = 'HUG'; } catch(e) {}
  try { node.layoutSizingVertical   = 'HUG'; } catch(e) {}
  try { node.layoutPositioning = 'AUTO'; } catch(e) {}
  try { node.constraints = { horizontal: 'MIN', vertical: 'CENTER' }; } catch(e) {}
}

function fillChild(node) {
  try { node.layoutSizingHorizontal = 'FILL'; } catch(e) {}
  try { node.layoutSizingVertical   = 'FILL'; } catch(e) {}
  try { node.layoutPositioning = 'AUTO'; } catch(e) {}
}
function fillWidth(node, width) {
  // 1. Set layout sizing to FILL (works when inside auto-layout)
  try { node.layoutSizingHorizontal = 'FILL'; } catch(e) {}
  // 2. Also explicitly resize — needed for instances with fixed constraints
  if (width) {
    try { node.resize(width, node.height); } catch(e) {}
  }
  // 3. Clear any absolute positioning that would override layout
  try { node.layoutPositioning = 'AUTO'; } catch(e) {}
  // 4. Set horizontal constraint to SCALE so it stretches with parent
  try {
    node.constraints = { horizontal: 'STRETCH', vertical: node.constraints.vertical };
  } catch(e) {}
}

// ─────────────────────────────────────────────────────────────────────────────
// FLAT WALK — extracts renderable SAP components from spec tree in visual order
// Skips pure layout containers AND also recurses into SAP containers that
// have meaningful sub-components (Table→headerToolbar, etc.)
// ─────────────────────────────────────────────────────────────────────────────
const SLOT_ORDER = ['title', 'header', 'headerToolbar', 'content', 'footer', 'columns', 'items'];

// Components that are themselves SAP instances but also contain
// sub-components we want to extract and place as siblings
const TRANSPARENT_SAP = new Set(['Table', 'Panel', 'List']);

// Toolbars — place instance, then recurse children as flat siblings
const TOOLBAR_SAP = new Set(['Toolbar', 'OverflowToolbar']);

function flatWalk(nodes) {
  const result = [];
  function walk(node) {
    if (!node || !node.component) return;
    const comp = node.component;

    if (LAYOUT_CONTAINERS.has(comp)) {
      // Pure layout / inline-only — skip self, recurse into slots/children
      if (node.slots) {
        const keys = SLOT_ORDER.filter(k => node.slots[k]).concat(
          Object.keys(node.slots).filter(k => SLOT_ORDER.indexOf(k) === -1 && node.slots[k])
        );
        for (const k of keys) {
          const val = node.slots[k];
          for (const c of (Array.isArray(val) ? val : [val])) walk(c);
        }
      }
      for (const c of (node.children || [])) walk(c);

    } else if (OPAQUE_SAP.has(comp)) {
      // Opaque SAP instance — place it, do NOT recurse into children
      result.push(node);

    } else if (TOOLBAR_SAP.has(comp)) {
      // Toolbar/OverflowToolbar — place instance, then each child as flat sibling
      result.push(node);
      // Children may be in slots.content OR children array
      const tbContent = (node.slots && node.slots.content) || [];
      const tbChildren = Array.isArray(tbContent) ? tbContent : [tbContent];
      for (const c of tbChildren) walk(c);
      for (const c of (node.children || [])) walk(c);

    } else if (TRANSPARENT_SAP.has(comp)) {
      // SAP container: extract headerToolbar first, then the instance itself, then children as siblings
      if (node.slots && node.slots.headerToolbar) {
        const tb = node.slots.headerToolbar;
        for (const c of (Array.isArray(tb) ? tb : [tb])) walk(c);
      }
      if (comp === 'Panel' || comp === 'List') {
        result.push(node);
        for (const c of (node.children || [])) walk(c);
        if (node.slots) {
          const keys = Object.keys(node.slots).filter(k => k !== 'headerToolbar');
          for (const k of keys) {
            const val = node.slots[k];
            for (const c of (Array.isArray(val) ? val : [val])) walk(c);
          }
        }
      } else {
        result.push(node); // Table: just the instance (toolbar already extracted above)
      }

    } else {
      // Leaf SAP component — collect it directly
      result.push(node);
    }
  }
  for (const n of (nodes || [])) walk(n);
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// SAP NODE BUILDER — builds a single SAP component instance
// ─────────────────────────────────────────────────────────────────────────────
async function buildSapNode(nodeSpec, density, width) {
  const comp = nodeSpec.component;
  const formFactor = ff(density);

  if (comp === 'ShellBar') {
    const inst = await sapInstance('ShellBar');
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'Button') {
    const inst = await sapInstance('Button', buttonVariants(nodeSpec.intent, density));
    if (inst) await setText(inst, null, nodeSpec.label);
    return inst;
  }

  if (comp === 'IconButton') {
    return sapInstance('IconButton', { 'Form Factor': formFactor, 'Interaction State': 'Regular' });
  }

  if (comp === 'SegmentedButton') {
    return sapInstance('SegmentedButton', { 'Form Factor': formFactor });
  }

  if (comp === 'Toolbar' || comp === 'OverflowToolbar') {
    // Toolbar default is 320px — resize to screen width
    const inst = await sapInstance('Toolbar', { 'Form Factor': formFactor });
    if (inst) {
      try { inst.resize(width, inst.height); } catch(e) {}
      fillWidth(inst, width);
    }
    return inst;
  }

  if (comp === 'ToolbarSpacer') {
    return sapInstance('ToolbarSpacer');
  }

  if (comp === 'DynamicPageTitle') {
    // DynamicPageTitle is the sticky title bar — skip placing a separate instance.
    // DynamicPageHeader (placed separately) already renders the full header area.
    return null;
  }

  if (comp === 'DynamicPageHeader' || comp === 'FilterBar' || comp === 'ObjectHeader') {
    const inst = await sapInstance('DynamicPageHeader', {});
    if (inst) {
      fillWidth(inst, width);
      const label = (nodeSpec.slots && nodeSpec.slots.heading && nodeSpec.slots.heading.label)
        || nodeSpec.label || (nodeSpec.props && nodeSpec.props.title);
      if (label) await setText(inst, 'title', label);
    }
    return inst;
  }

  if (comp === 'IconTabBar' || comp === 'TabBar') {
    const inst = await sapInstance('IconTabBar', { 'Form Factor': formFactor });
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'SideNavigation') {
    const inst = await sapInstance('SideNavigation');
    return inst;
  }

  if (comp === 'Footer') {
    const inst = await sapInstance('Footer');
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'ToolHeader') {
    const inst = await sapInstance('ToolHeader');
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'UserMenu') {
    return sapInstance('UserMenu');
  }

  if (comp === 'Toast') {
    const inst = await sapInstance('Toast');
    if (inst && nodeSpec.props && nodeSpec.props.text) await setText(inst, null, nodeSpec.props.text);
    return inst;
  }

  if (comp === 'Menu') {
    return sapInstance('Menu', { 'Form Factor': formFactor });
  }

  if (comp === 'Popover') {
    return sapInstance('Popover');
  }

  if (comp === 'Notifications') {
    const inst = await sapInstance('Notifications');
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'NotificationBanner') {
    const inst = await sapInstance('NotificationBanner');
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'NotificationListItem') {
    return sapInstance('NotificationListItem', { 'Form Factor': formFactor });
  }

  if (comp === 'Card') {
    return sapInstance('Card');
  }

  if (comp === 'Carousel') {
    const inst = await sapInstance('Carousel');
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'Calendar') {
    return sapInstance('Calendar', { 'Form Factor': formFactor });
  }

  if (comp === 'ProgressIndicator') {
    const inst = await sapInstance('ProgressIndicator', { 'Form Factor': formFactor });
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'RatingIndicator') {
    return sapInstance('RatingIndicator', { 'Form Factor': formFactor });
  }

  if (comp === 'BusyIndicator') {
    return sapInstance('BusyIndicator', { 'Form Factor': formFactor });
  }

  if (comp === 'Slider') {
    const inst = await sapInstance('Slider', { 'Form Factor': formFactor });
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'RangeSlider') {
    const inst = await sapInstance('RangeSlider', { 'Form Factor': formFactor });
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'StepInput') {
    return sapInstance('StepInput', { 'Form Factor': formFactor, 'Interaction State': 'Regular' });
  }

  if (comp === 'DateTimePicker') {
    return sapInstance('DateTimePicker', { 'Form Factor': formFactor, 'Interaction State': 'Regular' });
  }

  if (comp === 'TimePicker') {
    return sapInstance('TimePicker', { 'Form Factor': formFactor, 'Interaction State': 'Regular' });
  }

  if (comp === 'MultiComboBox') {
    return sapInstance('MultiCombobox', { 'Form Factor': formFactor, 'Interaction State': 'Regular' });
  }

  if (comp === 'MultiInput') {
    return sapInstance('MultiInput', { 'Form Factor': formFactor, 'Interaction State': 'Regular' });
  }

  if (comp === 'FileUploader') {
    return sapInstance('FileUploader', { 'Form Factor': formFactor });
  }

  if (comp === 'Tree') {
    const inst = await sapInstance('Tree', { 'Form Factor': formFactor });
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'TreeItem') {
    return sapInstance('TreeItem', { 'Form Factor': formFactor });
  }

  if (comp === 'SplitButton') {
    return sapInstance('SplitButton', { 'Form Factor': formFactor, 'Interaction State': 'Regular' });
  }

  if (comp === 'IconMenuButton') {
    return sapInstance('IconMenuButton', { 'Form Factor': formFactor, 'Interaction State': 'Regular' });
  }

  if (comp === 'Breadcrumbs' || comp === 'Breadcrumb') {
    const inst = await sapInstance('Breadcrumbs');
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'Table') {
    const inst = await sapInstance('Table', { 'Form Factor': formFactor, 'Structure': 'Columns' });
    if (inst) {
      fillWidth(inst, width);
      // Also resize internal Toolbar and Table Container children
      try {
        inst.findAll(n => n.name === 'Toolbar' || n.name === 'Table Container').forEach(function(child) {
          try { child.resize(width, child.height); } catch(e) {}
          try { child.layoutSizingHorizontal = 'FILL'; } catch(e) {}
        });
      } catch(e) {}
    }
    return inst;
  }

  if (comp === 'Input') {
    const inst = await sapInstance('Input', { 'Form Factor': formFactor, 'Interaction State': 'Regular' });
    if (inst && nodeSpec.props && nodeSpec.props.placeholder) await setText(inst, 'placeholder', nodeSpec.props.placeholder);
    return inst;
  }

  if (comp === 'SearchField') {
    const inst = await sapInstance('Input', { 'Form Factor': formFactor, 'Interaction State': 'Regular' });
    if (inst) inst.name = 'SearchField';
    return inst;
  }

  if (comp === 'Select' || comp === 'ComboBox') {
    return sapInstance('Select', { 'Form Factor': formFactor, 'Interaction State': 'Regular' });
  }

  if (comp === 'CheckBox') {
    const inst = await sapInstance('CheckBox', { 'Form Factor': formFactor });
    if (inst && nodeSpec.label) await setText(inst, null, nodeSpec.label);
    return inst;
  }

  if (comp === 'RadioButton') {
    const inst = await sapInstance('RadioButton', { 'Form Factor': formFactor });
    const rbLabel = nodeSpec.label || (nodeSpec.props && nodeSpec.props.text);
    if (inst && rbLabel) await setText(inst, null, rbLabel);
    return inst;
  }

  if (comp === 'Switch') {
    const inst = await sapInstance('Switch', { 'Form Factor': formFactor });
    const swOn = nodeSpec.props && nodeSpec.props.customTextOn;
    const swOff = nodeSpec.props && nodeSpec.props.customTextOff;
    if (inst && swOn) await setText(inst, 'on', swOn);
    if (inst && swOff) await setText(inst, 'off', swOff);
    return inst;
  }

  if (comp === 'TextArea') {
    return sapInstance('TextArea', { 'Form Factor': formFactor, 'Interaction State': 'Regular' });
  }

  if (comp === 'DatePicker' || comp === 'DateRangeSelection') {
    return sapInstance('DatePicker', { 'Form Factor': formFactor, 'Interaction State': 'Regular' });
  }

  if (comp === 'Label') {
    const inst = await sapInstance('Label', { 'Form Factor': formFactor });
    if (inst) await setText(inst, null, nodeSpec.label || (nodeSpec.props && nodeSpec.props.text));
    return inst;
  }

  if (comp === 'Title') {
    // Title has no SAP library component — render as a Label instance with bold text
    const inst = await sapInstance('Label', { 'Form Factor': formFactor });
    if (inst) await setText(inst, null, nodeSpec.label || (nodeSpec.props && nodeSpec.props.text));
    return inst;
  }

  if (comp === 'Link') {
    const inst = await sapInstance('Link', { 'Form Factor': formFactor });
    if (inst) await setText(inst, null, nodeSpec.label);
    return inst;
  }

  if (comp === 'ObjectStatus') {
    const sv = statusVariants(nodeSpec.props && nodeSpec.props.state);
    const inst = await sapInstance('ObjectStatus', { 'State': sv['State'], 'Form Factor': formFactor });
    if (inst && nodeSpec.props && nodeSpec.props.text) await setText(inst, null, nodeSpec.props.text);
    return inst;
  }

  if (comp === 'ObjectIdentifier') {
    const inst = await sapInstance('ObjectIdentifier', { 'Form Factor': formFactor });
    if (inst && nodeSpec.props && nodeSpec.props.title) await setText(inst, 'title', nodeSpec.props.title);
    return inst;
  }

  if (comp === 'ObjectNumber') {
    const state = nodeSpec.props && nodeSpec.props.state;
    const sv = state ? statusVariants(state) : {};
    const inst = await sapInstance('ObjectNumber', Object.assign({ 'Form Factor': formFactor }, sv['State'] ? { 'State': sv['State'] } : {}));
    if (inst) {
      if (nodeSpec.props && nodeSpec.props.number) await setText(inst, 'number', String(nodeSpec.props.number));
      if (nodeSpec.props && nodeSpec.props.unit)   await setText(inst, 'unit',   String(nodeSpec.props.unit));
    }
    return inst;
  }

  if (comp === 'ObjectAttribute') {
    const inst = await sapInstance('ObjectAttribute', { 'Form Factor': formFactor });
    if (inst && nodeSpec.props && nodeSpec.props.text) await setText(inst, null, nodeSpec.props.text);
    return inst;
  }

  if (comp === 'Avatar') {
    return sapInstance('Avatar', { 'Form Factor': formFactor, 'Shape': 'Circle' });
  }

  if (comp === 'Tag') {
    return sapInstance('Tag');
  }

  if (comp === 'MessageStrip') {
    const inst = await sapInstance('MessageStrip', msgStripVariants(nodeSpec.props && nodeSpec.props.type));
    if (inst) {
      if (nodeSpec.props && nodeSpec.props.text) await setText(inst, null, nodeSpec.props.text);
      fillWidth(inst, width);
    }
    return inst;
  }

  if (comp === 'IllustratedMessage') {
    const inst = await sapInstance('IllustratedMessage');
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'Panel') {
    const inst = await sapInstance('Panel');
    if (inst) {
      fillWidth(inst, width);
      if (nodeSpec.props && nodeSpec.props.headerText) await setText(inst, 'header', nodeSpec.props.headerText);
    }
    return inst;
  }

  if (comp === 'Dialog') {
    const inst = await sapInstance('Dialog');
    if (inst && nodeSpec.props && nodeSpec.props.title) await setText(inst, 'title', nodeSpec.props.title);
    return inst;
  }

  if (comp === 'Form') {
    const inst = await sapInstance('Form');
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'List') {
    const inst = await sapInstance('List');
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'StandardListItem' || comp === 'ListItem') {
    const inst = await sapInstance('StandardListItem', { 'Form Factor': formFactor });
    if (inst && nodeSpec.label) await setText(inst, null, nodeSpec.label);
    return inst;
  }

  if (comp === 'Tokenizer') {
    const inst = await sapInstance('Tokenizer', { 'Form Factor': formFactor });
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'Token') {
    return sapInstance('Token', { 'Form Factor': formFactor });
  }

  if (comp === 'ProductSwitch') {
    return sapInstance('ProductSwitch');
  }

  if (comp === 'Settings') {
    const inst = await sapInstance('Settings');
    if (inst) fillWidth(inst, width);
    return inst;
  }

  if (comp === 'ColorPicker') {
    return sapInstance('ColorPicker', { 'Form Factor': formFactor });
  }

  if (comp === 'AIButton') {
    return sapInstance('AIButton');
  }

  if (comp === 'AIPromptInput') {
    const inst = await sapInstance('AIPromptInput');
    if (inst) fillWidth(inst, width);
    return inst;
  }

  // Generic — try KEY_MAP
  const generic = await sapInstance(comp);
  if (generic) return generic;

  figma.ui.postMessage({ type: 'warning', text: 'No SAP mapping for: ' + comp });
  console.warn('Unhandled component: ' + comp);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// RECURSIVE TREE BUILDER
// ─────────────────────────────────────────────────────────────────────────────

const HORIZ_CONTAINERS = new Set(['Toolbar', 'OverflowToolbar']);

const SKIP_SELF = new Set([
  'DynamicPage','Page','ObjectPageLayout','FlexibleColumnLayout',
  'FlexBox','HBox','VBox','Column','ColumnListItem','Text','Label',
]);

const SLOT_ORDER_TREE = ['title','header','heading','actions','navigationActions',
                         'headerToolbar','filterItems','content','items','columns',
                         'cells','footer','snappedHeading','breadcrumbs'];

async function buildTree(nodeSpec, parentFrame, density, width) {
  if (!nodeSpec || !nodeSpec.component) return;
  const comp = nodeSpec.component;

  // Pure layout wrappers: skip self, recurse slots into parentFrame
  if (SKIP_SELF.has(comp)) {
    const slots = nodeSpec.slots || {};
    const ORDER = ['title','header','heading','actions','navigationActions','headerToolbar',
                   'filterItems','content','items','columns','cells','footer'];
    const keys = ORDER.filter(k => slots[k])
      .concat(Object.keys(slots).filter(k => !ORDER.includes(k) && slots[k]));
    for (const k of keys) {
      const val = slots[k];
      for (const c of (Array.isArray(val) ? val : [val])) await buildTree(c, parentFrame, density, width);
    }
    for (const c of (nodeSpec.children || [])) await buildTree(c, parentFrame, density, width);
    return;
  }

  // DynamicPageTitle: horizontal title bar, full width, fixed height
  if (comp === 'DynamicPageTitle') {
    const titleBar = figma.createFrame();
    titleBar.name = 'DynamicPageTitle';
    titleBar.resize(width, 48);
    titleBar.fills = [solid(C.white)];
    titleBar.strokes = [solid(C.border)]; titleBar.strokeWeight = 1; titleBar.strokeAlign = 'INSIDE';
    titleBar.layoutMode = 'HORIZONTAL';
    titleBar.primaryAxisSizingMode = 'FIXED';
    titleBar.counterAxisSizingMode = 'FIXED';
    titleBar.counterAxisAlignItems = 'CENTER';
    titleBar.itemSpacing = 8;
    titleBar.paddingLeft = 16; titleBar.paddingRight = 16;
    titleBar.paddingTop = 0; titleBar.paddingBottom = 0;
    parentFrame.appendChild(titleBar);

    const slots = nodeSpec.slots || {};
    if (slots.heading) await buildTree(slots.heading, titleBar, density, width);
    // Spacer
    const sp = figma.createFrame();
    sp.name = 'Spacer'; sp.fills = []; sp.resize(8, 1);
    sp.layoutGrow = 1;
    titleBar.appendChild(sp);
    // Actions
    for (const c of (Array.isArray(slots.actions||[]) ? slots.actions||[] : [])) await buildTree(c, titleBar, density, width);
    for (const c of (Array.isArray(slots.navigationActions||[]) ? slots.navigationActions||[] : [])) await buildTree(c, titleBar, density, width);
    return;
  }

  // Toolbar / OverflowToolbar: horizontal frame, full width
  if (HORIZ_CONTAINERS.has(comp)) {
    const bar = figma.createFrame();
    bar.name = comp;
    bar.resize(width, 44);
    bar.fills = [solid(C.white)];
    bar.strokes = [solid(C.border)]; bar.strokeWeight = 1; bar.strokeAlign = 'INSIDE';
    bar.layoutMode = 'HORIZONTAL';
    bar.primaryAxisSizingMode = 'FIXED';
    bar.counterAxisSizingMode = 'FIXED';
    bar.counterAxisAlignItems = 'CENTER';
    bar.itemSpacing = 8;
    bar.paddingLeft = 16; bar.paddingRight = 16;
    bar.paddingTop = 0; bar.paddingBottom = 0;
    parentFrame.appendChild(bar);
    const content = (nodeSpec.slots && nodeSpec.slots.content) || nodeSpec.children || [];
    for (const c of (Array.isArray(content) ? content : [content])) {
      if (c) await buildTree(c, bar, density, width);
    }
    return;
  }

  // ToolbarSpacer: grows to fill remaining space in toolbar
  if (comp === 'ToolbarSpacer') {
    const sp = figma.createFrame();
    sp.name = 'ToolbarSpacer'; sp.fills = []; sp.resize(8, 1);
    sp.layoutGrow = 1;
    parentFrame.appendChild(sp);
    return;
  }

  // FilterBar / DynamicPageHeader: native page header zone + filter input row
  if (comp === 'FilterBar' || comp === 'DynamicPageHeader') {
    // Render a native page header bar (replaces SAP DynamicPageHeader which has empty swap slots)
    const pageHeader = figma.createFrame();
    pageHeader.name = 'PageHeader';
    pageHeader.resize(width, 80);
    pageHeader.fills = [solid(C.white)];
    pageHeader.strokes = [solid(C.border)]; pageHeader.strokeWeight = 1; pageHeader.strokeAlign = 'INSIDE';
    pageHeader.layoutMode = 'VERTICAL';
    pageHeader.primaryAxisSizingMode = 'FIXED';
    pageHeader.counterAxisSizingMode = 'FIXED';
    pageHeader.itemSpacing = 4;
    pageHeader.paddingLeft = 16; pageHeader.paddingRight = 16;
    pageHeader.paddingTop = 12; pageHeader.paddingBottom = 12;
    // Breadcrumb line
    const breadcrumb = makeText('Inventory  /  Purchase Orders', { size: 12, color: C.accent });
    breadcrumb.name = 'Breadcrumb';
    pageHeader.appendChild(breadcrumb);
    // Page title row
    const titleRow = figma.createFrame();
    titleRow.name = 'PageHeader-title-row';
    titleRow.fills = [];
    titleRow.layoutMode = 'HORIZONTAL';
    titleRow.primaryAxisSizingMode = 'FIXED';
    titleRow.counterAxisSizingMode = 'AUTO';
    titleRow.counterAxisAlignItems = 'CENTER';
    titleRow.itemSpacing = 12;
    titleRow.resize(width - 32, 32);
    const titleTxt = makeText('Purchase Orders', { size: 22, bold: true, color: C.text });
    titleRow.appendChild(titleTxt);
    const sp = figma.createFrame(); sp.fills = []; sp.resize(8,1); sp.layoutGrow = 1;
    titleRow.appendChild(sp);
    pageHeader.appendChild(titleRow);
    parentFrame.appendChild(pageHeader);

    // Collect filterItems
    let filterItems = (nodeSpec.slots && nodeSpec.slots.filterItems) || [];
    if (!filterItems.length && nodeSpec.slots && nodeSpec.slots.content) {
      const ca = Array.isArray(nodeSpec.slots.content) ? nodeSpec.slots.content : [nodeSpec.slots.content];
      for (const c of ca) { if (c && c.slots && c.slots.filterItems) filterItems = c.slots.filterItems; }
    }
    if (filterItems.length > 0) {
      const filterRow = figma.createFrame();
      filterRow.name = 'FilterBar-inputs';
      filterRow.resize(width, 52);
      filterRow.fills = [solid(C.white)];
      filterRow.strokes = [solid(C.border)]; filterRow.strokeWeight = 1; filterRow.strokeAlign = 'INSIDE';
      filterRow.layoutMode = 'HORIZONTAL';
      filterRow.primaryAxisSizingMode = 'FIXED';
      filterRow.counterAxisSizingMode = 'FIXED';
      filterRow.counterAxisAlignItems = 'CENTER';
      filterRow.itemSpacing = 8;
      filterRow.paddingLeft = 16; filterRow.paddingRight = 16;
      parentFrame.appendChild(filterRow);
      for (const fi of filterItems) await buildTree(fi, filterRow, density, width);
    }
    return;
  }

  // Table: extract headerToolbar as a row above the SAP Table instance
  if (comp === 'Table') {
    if (nodeSpec.slots && nodeSpec.slots.headerToolbar) {
      await buildTree(nodeSpec.slots.headerToolbar, parentFrame, density, width);
    }
    const inst = await buildSapNode(nodeSpec, density, width);
    if (inst) {
      inst.resize(width, inst.height);
      try { inst.layoutSizingHorizontal = 'FILL'; } catch(e) {}
      parentFrame.appendChild(inst);
    }
    return;
  }

  // ObjectNumber: native KPI card with real values + semantic colour
  if (comp === 'ObjectNumber') {
    const num   = (nodeSpec.props && nodeSpec.props.number) || '-';
    const unit  = (nodeSpec.props && nodeSpec.props.unit)   || '';
    const state = (nodeSpec.props && nodeSpec.props.state)  || 'None';
    const stateColor = {
      Success:{ r:0.118,g:0.561,b:0.337 }, Warning:{ r:0.741,g:0.482,b:0.004 },
      Error:{ r:0.741,g:0.161,b:0.118 },   Information:{ r:0.000,g:0.439,b:0.949 },
      None:{ r:0.196,g:0.212,b:0.227 },
    };
    const card = figma.createFrame();
    card.name = 'KPI-' + unit.replace(/ /g,'-');
    card.fills = [];
    card.layoutMode = 'VERTICAL';
    card.primaryAxisSizingMode = 'AUTO';
    card.counterAxisSizingMode = 'AUTO';
    card.counterAxisAlignItems = 'MIN';
    card.itemSpacing = 2;
    card.paddingTop = 4; card.paddingBottom = 4;
    card.paddingLeft = 8; card.paddingRight = 8;
    card.appendChild(makeText(num,  { size: 20, bold: true, color: stateColor[state] || stateColor.None }));
    card.appendChild(makeText(unit, { size: 12, color: C.textSec }));
    parentFrame.appendChild(card);
    return;
  }

  // Title: native bold text label
  if (comp === 'Title') {
    const txt = nodeSpec.label || (nodeSpec.props && nodeSpec.props.text) || '';
    const t = makeText(txt, { size: 15, bold: true, color: C.text });
    t.name = 'Title';
    parentFrame.appendChild(t);
    return;
  }

  // Switch: SAP instance works; label comes from customTextOn shown beside it
  if (comp === 'Switch') {
    const inst = await buildSapNode(nodeSpec, density, width);
    if (inst) parentFrame.appendChild(inst);
    const onLabel = nodeSpec.props && nodeSpec.props.customTextOn;
    if (onLabel) {
      const lbl = makeText(onLabel, { size: 13, color: C.text });
      lbl.name = 'Switch-label';
      parentFrame.appendChild(lbl);
    }
    return;
  }

  // RadioButton: SAP instance + text label beside it
  if (comp === 'RadioButton') {
    const inst = await buildSapNode(nodeSpec, density, width);
    if (inst) parentFrame.appendChild(inst);
    const rbLabel = (nodeSpec.props && nodeSpec.props.text) || nodeSpec.label;
    if (rbLabel) {
      const lbl = makeText(rbLabel, { size: 13, color: C.text });
      lbl.name = 'RadioButton-label';
      parentFrame.appendChild(lbl);
    }
    return;
  }

  // All other SAP leaf components
  const inst = await buildSapNode(nodeSpec, density, width);
  if (inst) {
    parentFrame.appendChild(inst);
    const FULL_WIDTH_COMPS = new Set([
      'ShellBar','Table','List','Tree','Panel','Form','IllustratedMessage',
      'MessageStrip','Notifications','NotificationBanner','Carousel','Footer','ToolHeader',
    ]);
    if (FULL_WIDTH_COMPS.has(comp)) {
      inst.resize(width, inst.height);
      try { inst.layoutSizingHorizontal = 'FILL'; } catch(e) {}
    }
  }
}

// SCREEN BUILDER
// ─────────────────────────────────────────────────────────────────────────────
async function buildScreen(spec) {
  figma.ui.postMessage({ type: 'progress', text: 'Loading fonts...' });
  await loadFonts();

  const viewportWidths = { desktop: 1440, tablet: 768, mobile: 375 };
  const width = viewportWidths[(spec.screen && spec.screen.viewport) || 'desktop'];
  const density = (spec.screen && spec.screen.density) || 'compact';

  figma.ui.postMessage({ type: 'progress', text: 'Creating screen frame...' });

  const screen = makeFrame(spec.screen.name || 'SAP Fiori Screen', {
    w: width, h: 100,
    fills: [solid(C.pageBg)],
    layout: 'VERTICAL',
    primarySize: 'AUTO', counterSize: 'FIXED',
    gap: 0,
  });
  screen.resize(width, 100);

  const { x, y } = figma.viewport.center;
  screen.x = x - width / 2;
  screen.y = y - 200;
  figma.currentPage.appendChild(screen);

  let placed = 0;
  for (var i = 0; i < spec.hierarchy.length; i++) {
    const node = spec.hierarchy[i];
    figma.ui.postMessage({ type: 'progress', text: 'Building ' + node.component + '...' });
    await buildTree(node, screen, density, width);
  }

  // Count placed children
  placed = screen.children.length;

  figma.currentPage.selection = [screen];
  figma.viewport.scrollAndZoomIntoView([screen]);

  var msg = '"' + screen.name + '" built — ' + placed + ' layers placed.';

  figma.ui.postMessage({ type: 'success', text: msg });
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATE — check all components in spec are mapped
// ─────────────────────────────────────────────────────────────────────────────
function validateSpec(spec) {
  const found = [], unknown = [];

  function collect(nodes) {
    for (var i = 0; i < (nodes || []).length; i++) {
      var n = nodes[i];
      if (n.component) {
        if (KEY_MAP[n.component] || LAYOUT_CONTAINERS.has(n.component) ||
            SKIP_SELF.has(n.component) || HORIZ_CONTAINERS.has(n.component) ||
            n.component === 'ToolbarSpacer' || n.component === 'FilterBar' ||
            n.component === 'DynamicPageHeader' || n.component === 'Title') {
          found.push(n.component);
        } else {
          unknown.push(n.component);
        }
      }
      collect(n.children);
      if (n.slots) {
        var vals = Object.values(n.slots);
        for (var j = 0; j < vals.length; j++) {
          collect(Array.isArray(vals[j]) ? vals[j] : [vals[j]]);
        }
      }
    }
  }
  collect(spec.hierarchy);

  if (unknown.length > 0) {
    figma.ui.postMessage({
      type: 'validate-fail',
      found: found,
      unknown: unknown,
      message: 'Unknown components: ' + unknown.join(', '),
    });
  } else {
    figma.ui.postMessage({ type: 'validate-pass', found: found });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────
figma.showUI(__html__, { width: 380, height: 580 });

figma.ui.onmessage = async function(msg) {
  if (msg.type === 'build') {
    try {
      await buildScreen(msg.spec);
    } catch (err) {
      figma.ui.postMessage({ type: 'error', text: String(err) });
    }
  }
  if (msg.type === 'validate') {
    validateSpec(msg.spec);
  }
};
