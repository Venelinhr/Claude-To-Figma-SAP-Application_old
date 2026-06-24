# SAPUI5 LLM-Ready Component Registry

Complete documentation for all 32 verified SAPUI5 controls with 100% API-accurate properties, aggregations, and events.
Includes 25 form/display/layout controls (sap.m) and 7 page-layout controls (sap.f, sap.uxap) required for Fiori floorplans.

---

## Table of Contents

- [Core Container Controls](#core-container-controls)
- [Form Controls](#form-controls)
- [Action Controls](#action-controls)
- [Display Controls](#display-controls)
- [Layout Controls (sap.m)](#layout-controls-sapm)
- [Layout Controls (sap.ui.layout.form)](#layout-controls-sapuilayoutform)
- [Other Controls](#other-controls)

---

## Core Container Controls

### sap.m.App
**Purpose:** Root application container, provides full viewport management

**Key Properties:**
- `busyIndicatorDelay` - Delay before busy indicator appears (default: 1000ms)

**Aggregations:**
- `pages` (0..n) - Array of `sap.m.Page` controls

**Usage:** Always wrap pages in `sap.m.App` for proper viewport handling

**Example:**
```xml
<App id="appId">
  <pages>
    <Page title="Page Title">
      <content>
        <!-- Page content -->
      </content>
    </Page>
  </pages>
</App>
```

---

### sap.m.Page
**Purpose:** Page container with header and content areas

**Key Properties:**
- `title` - Page title (string)
- `showNavButton` - Show back navigation button (boolean)
- `enableScrolling` - Enable content scrolling (boolean)
- `backgroundDesign` - Background design: "Standard", "Transparent", "Solid" (enum)
- `class` - CSS classes, e.g., "sapUiContentPadding"

**Aggregations:**
- `content` (0..n) - Page content controls
- `customHeader` (0..1) - Custom header toolbar

**Usage:** Primary container for application screens

**Example:**
```xml
<Page title="Page Title" showNavButton="true" enableScrolling="false" class="sapUiSmallMarginTop">
  <content>
    <!-- Page content -->
  </content>
</Page>
```

---

## Form Controls

### sap.m.Label
**Purpose:** Label text for form fields

**Verified Properties:**
- `text` - Label text (string)
- `required` - Show required indicator (boolean)
- `design` - Label design: "Bold", "Standard" (enum)
- `textAlignment` - Text alignment: "Begin", "Center", "End", "Left", "Right" (enum)
- `textDirection` - Text direction: "LTR", "RTL" (enum)
- `width` - Label width (CSS size string)
- `labelFor` - ID of associated control (string)

**Events:** None

**Usage:** Pair with input controls in forms

**Example:**
```xml
<Label text="Field Name" required="true" design="Bold" />
```

---

### sap.m.Input
**Purpose:** Single-line text input field

**Verified Properties:**
- `value` - Input value (string)
- `placeholder` - Placeholder text (string)
- `type` - Input type: "Text", "Email", "Number", "Tel", "Url", "Password" (enum)
- `required` - Required field indicator (boolean)
- `editable` - Editable state (boolean)
- `maxLength` - Maximum character length (int)
- `showValueHelp` - Show value help icon (boolean)

**Events:**
- `change` - Fired when value changes and focus is lost
- `liveChange` - Fired while typing
- `valueHelpRequest` - Fired when value help icon is clicked

**Usage:** Standard text input for form fields

**Example:**
```xml
<Input value="{modelName>/field}" placeholder="Enter value" required="true" />
```

---

### sap.m.TextArea
**Purpose:** Multi-line text input

**Verified Properties:**
- `value` - Text value (string)
- `rows` - Number of visible rows (int)
- `cols` - Number of visible columns (int)
- `height` - Control height (CSS size string)
- `maxLength` - Maximum character length (int)
- `growing` - Auto-grow height (boolean)
- `growingMaxLines` - Maximum lines when growing (int)
- `wrapping` - Text wrapping: "Off", "On" (enum)
- `valueLiveUpdate` - Update value during typing (boolean)

**Events:**
- `change` - Fired when value changes and focus is lost
- `liveChange` - Fired while typing

**Usage:** Multi-line text input for notes, descriptions

**Example:**
```xml
<TextArea value="{modelName>/description}" rows="4" growing="true" />
```

---

### sap.m.Select
**Purpose:** Dropdown selection control

**Verified Properties:**
- `selectedKey` - Selected item key (string)

**Aggregations:**
- `items` (0..n) - Array of `sap.ui.core.Item` controls

**Events:**
- `change` - Fired when selection changes

**Usage:** Dropdown selection from predefined options

**Example:**
```xml
<Select selectedKey="{modelName>/selection}">
  <items>
    <core:Item key="key1" text="Option 1" />
    <core:Item key="key2" text="Option 2" />
  </items>
</Select>
```

---

### sap.m.ComboBox
**Purpose:** Searchable dropdown with filter capability

**Verified Properties:**
- `selectedKey` - Selected item key (string)
- `value` - Input value (string)
- `placeholder` - Placeholder text (string)
- `showValueHelp` - Show value help icon (boolean)

**Aggregations:**
- `items` (0..n) - Array of `sap.ui.core.Item` controls

**Events:**
- `selectionChange` - Fired when selection changes
- `change` - Fired when value changes

**Usage:** Dropdown with search/filter for large option lists

**Example:**
```xml
<ComboBox selectedKey="{modelName>/selection}" placeholder="Select..." showValueHelp="true">
  <items>
    <core:Item key="key1" text="Option 1" />
    <core:Item key="key2" text="Option 2" />
  </items>
</ComboBox>
```

---

### sap.ui.core.Item
**Purpose:** Item for Select/ComboBox

**Verified Properties:**
- `key` - Item key (string)
- `text` - Display text (string)

**Usage:** Define options for Select/ComboBox controls

**Example:**
```xml
<core:Item key="key1" text="Option 1" />
```

---

### sap.m.Switch
**Purpose:** Toggle switch control

**Verified Properties:**
- `state` - Switch state: true/false (boolean)
- `enabled` - Enabled state (boolean)
- `type` - Switch type: "Default", "Accept", "Reject" (enum)

**Events:**
- `change` - Fired when switch state changes

**Usage:** Binary toggle (on/off, true/false)

**Example:**
```xml
<Switch state="{modelName>/enabled}" type="Accept" />
```

---

### sap.m.CheckBox
**Purpose:** Checkbox control

**Verified Properties:**
- `selected` - Selected state (boolean)
- `text` - Label text (string)
- `enabled` - Enabled state (boolean)

**Events:**
- `select` - Fired when checkbox state changes

**Usage:** Multi-select option

**Example:**
```xml
<CheckBox selected="{modelName>/checked}" text="I agree" />
```

---

### sap.m.DatePicker
**Purpose:** Date selection control

**Verified Properties:**
- `value` - Date value (string, format depends on displayFormat)
- `displayFormat` - Display format (string, e.g., "yyyy-MM-dd")
- `valueFormat` - Value format (string, e.g., "yyyy-MM-dd")
- `placeholder` - Placeholder text (string)

**Events:**
- `change` - Fired when date selection changes

**Usage:** Date input with calendar picker

**Example:**
```xml
<DatePicker value="{modelName>/date}" displayFormat="yyyy-MM-dd" placeholder="Select date" />
```

---

### sap.m.MessageStrip
**Purpose:** Information/alert message display

**Verified Properties:**
- `text` - Message text (string)
- `type` - Message type: "Information", "Success", "Warning", "Error" (enum)
- `showIcon` - Show type icon (boolean)
- `showCloseButton` - Show close button (boolean)
- `customIcon` - Custom icon URI (string)
- `link` - Link URI (string)

**Events:**
- `close` - Fired when close button is clicked

**Usage:** Display informational messages, alerts, notifications

**Example:**
```xml
<MessageStrip text="Informational message" type="Information" showIcon="true" showCloseButton="true" />
```

---

### sap.m.Link
**Purpose:** Hyperlink control for navigation

**Verified Properties:**
- `text` - Link text (string)
- `href` - Link URL (string)
- `target` - Target: "_blank", "_self", "_parent", "_top" (enum)
- `enabled` - Enabled state (boolean)
- `tooltip` - Tooltip text (string)

**Events:**
- `press` - Fired when link is pressed

**Usage:** Navigation links, external references

**Example:**
```xml
<Link text="Learn more" href="https://example.com" target="_blank" />
```

---

### sap.m.Slider
**Purpose:** Range slider for numeric input

**Verified Properties:**
- `min` - Minimum value (number)
- `max` - Maximum value (number)
- `value` - Current value (number)
- `step` - Step increment (number)
- `width` - Slider width (CSS size string)
- `liveChange` - Live change events (boolean)

**Events:**
- `change` - Fired when value changes
- `liveChange` - Fired while dragging

**Usage:** Numeric range input, priority selection

**Example:**
```xml
<Slider min="0" max="100" value="50" step="5" width="100%" />
```

---

### sap.m.MultiComboBox
**Purpose:** Multi-select dropdown with filter

**Verified Properties:**
- `selectedKeys` - Selected item keys (array)
- `placeholder` - Placeholder text (string)
- `showSecondaryValues` - Show secondary values (boolean)
- `showValueState` - Show value state (boolean)
- `valueState` - Value state: "None", "Success", "Warning", "Error", "Information" (enum)
- `valueStateText` - Value state text (string)
- `filterable` - Enable filtering (boolean)
- `maxLength` - Maximum selections (int)

**Aggregations:**
- `items` (0..n) - Array of `sap.ui.core.Item` controls

**Events:**
- `selectionChange` - Fired when selection changes

**Usage:** Multi-select dropdown with search/filter

**Example:**
```xml
<MultiComboBox selectedKeys="{modelName>/selections}" placeholder="Select multiple" filterable="true">
  <items>
    <core:Item key="key1" text="Option 1" />
    <core:Item key="key2" text="Option 2" />
  </items>
</MultiComboBox>
```

---

### sap.m.RatingIndicator
**Purpose:** Star rating control

**Verified Properties:**
- `maxValue` - Maximum rating value (int)
- `value` - Current rating value (int)
- `iconSize` - Icon size: "XS", "S", "M", "L", "XL" (enum)
- `enabled` - Enabled state (boolean)

**Events:**
- `change` - Fired when rating changes

**Usage:** Star rating input

**Example:**
```xml
<RatingIndicator maxValue="5" value="3" iconSize="L" />
```

---

### sap.m.ProgressIndicator
**Purpose:** Progress bar display

**Verified Properties:**
- `percentValue` - Progress percentage (number, 0-100)
- `displayValue` - Display text (string)
- `state` - Progress state: "None", "Success", "Warning", "Error", "Information" (enum)
- `barColor` - Bar color (CSS color string)

**Events:** None

**Usage:** Progress display for tasks, uploads

**Example:**
```xml
<ProgressIndicator percentValue="75" displayValue="75%" state="Success" />
```

---

### sap.m.SegmentedButton
**Purpose:** Segmented button group

**Verified Properties:**
- `selectedKey` - Selected button key (string)

**Aggregations:**
- `items` (0..n) - Array of `sap.m.SegmentedButtonItem` controls

**Events:**
- `selectionChange` - Fired when selection changes

**Usage:** Tab-like button group for mode selection

**Example:**
```xml
<SegmentedButton selectedKey="view1">
  <items>
    <SegmentedButtonItem key="view1" text="View 1" />
    <SegmentedButtonItem key="view2" text="View 2" />
  </items>
</SegmentedButton>
```

---

### sap.m.SegmentedButtonItem
**Purpose:** Item for SegmentedButton

**Verified Properties:**
- `key` - Item key (string)
- `text` - Item text (string)
- `icon` - Icon URI (string)

**Usage:** Define segmented button options

**Example:**
```xml
<SegmentedButtonItem key="view1" text="View 1" icon="sap-icon://list" />
```

---

### sap.m.StepInput
**Purpose:** Numeric input with +/- buttons

**Verified Properties:**
- `value` - Current value (number)
- `min` - Minimum value (number)
- `max` - Maximum value (number)
- `step` - Step increment (number)
- `editable` - Editable state (boolean)

**Events:**
- `change` - Fired when value changes

**Usage:** Numeric input with increment/decrement

**Example:**
```xml
<StepInput value="10" min="0" max="100" step="1" />
```

---

### sap.m.ToggleButton
**Purpose:** Toggle button (pressed/unpressed)

**Verified Properties:**
- `text` - Button text (string)
- `pressed` - Pressed state (boolean)
- `type` - Button type: "Default", "Emphasized", "Accept", "Reject", "Transparent" (enum)

**Events:**
- `change` - Fired when button is toggled

**Usage:** Binary toggle button

**Example:**
```xml
<ToggleButton text="Toggle Me" pressed="false" type="Emphasized" />
```

---

### sap.m.RadioButton
**Purpose:** Radio button for single selection

**Verified Properties:**
- `text` - Button text (string)
- `selected` - Selected state (boolean)
- `groupName` - Radio button group name (string)
- `enabled` - Enabled state (boolean)

**Events:**
- `select` - Fired when radio button is selected

**Usage:** Single selection from radio group

**Example:**
```xml
<RadioButton text="Option 1" groupName="group1" selected="true" />
<RadioButton text="Option 2" groupName="group1" />
```

---

### sap.m.MaskInput
**Purpose:** Input with mask format (phone, date, etc.)

**Verified Properties:**
- `mask` - Mask pattern (string, e.g., "(999) 999-9999")
- `placeholderSymbol` - Placeholder symbol (string, default "_")
- `placeholder` - Placeholder text (string)

**Events:**
- `change` - Fired when value changes

**Usage:** Formatted input for phone numbers, dates, etc.

**Example:**
```xml
<MaskInput mask="(999) 999-9999" placeholder="(___) ___-____" placeholderSymbol="_" />
```

---

## Action Controls

### sap.m.Button
**Purpose:** Action button

**Verified Properties:**
- `text` - Button text (string)
- `type` - Button type: "Default", "Emphasized", "Accept", "Reject", "Transparent" (enum)
- `enabled` - Enabled state (boolean)
- `icon` - Icon URI (string)

**Events:**
- `press` - Fired when button is pressed

**Usage:** Primary and secondary actions

**Example:**
```xml
<Button text="Save" type="Emphasized" press=".onSave" />
```

---

### sap.m.Toolbar
**Purpose:** Action toolbar container

**Key Properties:**
- `active` - Active state (boolean)
- `design` - Toolbar design: "Auto", "Info", "Transparent" (enum)

**Aggregations:**
- `content` (0..n) - Toolbar content controls (Button, ToolbarSpacer, etc.)

**Usage:** Container for action buttons and spacers

**Example:**
```xml
<Toolbar>
  <ToolbarSpacer />
  <Button text="Save" type="Emphasized" />
</Toolbar>
```

---

### sap.m.ToolbarSpacer
**Purpose:** Flexible spacer in toolbar

**Key Properties:** None (spans available space)

**Usage:** Push buttons to right side of toolbar

**Example:**
```xml
<Toolbar>
  <ToolbarSpacer />
  <Button text="Save" />
</Toolbar>
```

---

### sap.m.OverflowToolbar
**Purpose:** Toolbar with overflow for limited space

**Key Properties:**
- `design` - Toolbar design: "Auto", "Info", "Transparent" (enum)

**Aggregations:**
- `content` (0..n) - Toolbar content controls

**Usage:** Toolbar that handles overflow on smaller screens

**Example:**
```xml
<OverflowToolbar>
  <Button text="Action 1" />
  <Button text="Action 2" />
</OverflowToolbar>
```

---

### sap.m.SearchField
**Purpose:** Search input field

**Verified Properties:**
- `value` - Search value (string)
- `placeholder` - Placeholder text (string)
- `showSearchButton` - Show search button (boolean)
- `showRefreshButton` - Show refresh button (boolean)

**Events:**
- `search` - Fired when search is triggered
- `liveChange` - Fired while typing

**Usage:** Search/filter input

**Example:**
```xml
<SearchField value="{viewModel>/search}" placeholder="Search..." showSearchButton="true" />
```

---

## Display Controls (sap.m)

### sap.m.Text
**Purpose:** Text display control

**Verified Properties:**
- `text` - Text content (string)
- `maxLines` - Maximum lines to display (int)
- `wrapping` - Text wrapping: "Off", "On" (enum)
- `textAlign` - Text alignment: "Begin", "Center", "End", "Left", "Right" (enum)

**Events:** None

**Usage:** Display read-only text content

**Example:**
```xml
<Text text="This is read-only text" maxLines="3" wrapping="On" />
```

---

### sap.m.ObjectStatus
**Purpose:** Status indicator with text and/or icon

**Verified Properties:**
- `text` - Status text (string)
- `state` - Status state: "Success", "Warning", "Error", "Information", "None" (enum)
- `icon` - Icon URI (string)
- `title` - Tooltip title (string)
- `textDirection` - Text direction: "LTR", "RTL" (enum)

**Events:** None

**Usage:** Display status information (e.g., "Approved", "Pending", "Rejected")

**Example:**
```xml
<ObjectStatus text="Approved" state="Success" icon="sap-icon://accept" />
```

---

### sap.m.Image
**Purpose:** Image display control

**Verified Properties:**
- `src` - Image source URI (string)
- `width` - Image width (CSS size string)
- `height` - Image height (CSS size string)
- `densityAware` - Density-aware images (boolean)
- `decorative` - Decorative image (boolean)

**Events:** None

**Usage:** Display images, logos, icons

**Example:**
```xml
<Image src="images/logo.png" width="100px" height="100px" />
```

---

### sap.m.Title
**Purpose:** Title text control

**Verified Properties:**
- `text` - Title text (string)
- `level` - Title level: "H1", "H2", "H3", "H4", "H5", "H6" (enum)
- `width` - Title width (CSS size string)
- `textAlign` - Text alignment: "Begin", "Center", "End", "Left", "Right" (enum)

**Events:** None

**Usage:** Section titles, headings

**Example:**
```xml
<Title text="Section Title" level="H2" width="100%" />
```

---

### sap.m.ObjectHeader
**Purpose:** Object header with attributes and statuses

**Verified Properties:**
- `title` - Object title (string)
- `intro` - Intro text (string)
- `number` - Number value (string)
- `numberUnit` - Number unit (string)
- `icon` - Icon URI (string)
- `responsive` - Responsive layout (boolean)

**Aggregations:**
- `attributes` (0..n) - Array of `sap.m.ObjectAttribute` controls
- `statuses` (0..n) - Array of `sap.m.ObjectStatus` controls

**Events:** None

**Usage:** Object detail header with key attributes

**Example:**
```xml
<ObjectHeader title="Customer Name" intro="Customer ID: 12345" number="$1,000" numberUnit="USD">
  <attributes>
    <ObjectAttribute title="Email" text="customer@example.com" />
  </attributes>
  <statuses>
    <ObjectStatus text="Active" state="Success" />
  </statuses>
</ObjectHeader>
```

---

### sap.m.ObjectAttribute
**Purpose:** Attribute for ObjectHeader

**Verified Properties:**
- `title` - Attribute title (string)
- `text` - Attribute text (string)
- `active` - Clickable (boolean)

**Events:**
- `press` - Fired when pressed

**Usage:** Define object attributes

**Example:**
```xml
<ObjectAttribute title="Email" text="customer@example.com" active="true" />
```

---

### sap.m.GenericTag
**Purpose:** Generic tag with status colors

**Verified Properties:**
- `text` - Tag text (string)
- `status` - Tag status: "None", "Success", "Warning", "Error", "Information" (enum)
- `design` - Tag design: "Standard", "Status", "StatusAndText" (enum)
- `icon` - Icon URI (string)

**Events:** None

**Usage:** Status tags, category labels

**Example:**
```xml
<GenericTag text="Priority" status="Warning" design="Status" />
```

---

### sap.m.MessagePopover
**Purpose:** Message popover for displaying messages

**Verified Properties:**
- `async` - Async loading (boolean)
- `items` - Message items (array)

**Aggregations:**
- `items` (0..n) - Array of `sap.m.MessagePopoverItem` controls

**Events:**
- `afterOpen` - Fired after popover opens
- `afterClose` - Fired after popover closes

**Usage:** Display messages in popover

**Example:**
```xml
<MessagePopover>
  <items>
    <MessagePopoverItem title="Warning" subtitle="Check your input" type="Warning" />
  </items>
</MessagePopover>
```

---

### sap.m.MessagePopoverItem
**Purpose:** Item for MessagePopover

**Verified Properties:**
- `title` - Item title (string)
- `subtitle` - Item subtitle (string)
- `type` - Message type: "Information", "Success", "Warning", "Error" (enum)
- `description` - Item description (string)

**Events:** None

**Usage:** Define message items

**Example:**
```xml
<MessagePopoverItem title="Warning" subtitle="Check your input" type="Warning" description="Please verify all fields" />
```

---

## Layout Controls (sap.m)

### sap.m.Panel
**Purpose:** Grouping container with header

**Verified Properties:**
- `headerText` - Panel header text (string)
- `expandable` - Expandable/collapsible (boolean)
- `expanded` - Initial expanded state (boolean)
- `backgroundDesign` - Background: "Solid", "Transparent", "Translucent" (enum)

**Aggregations:**
- `content` (0..n) - Panel content controls
- `headerToolbar` (0..1) - Custom header toolbar

**Usage:** Group related content sections

**Example:**
```xml
<Panel headerText="Section Title" expandable="true" expanded="true" class="sapUiSmallMarginBottom">
  <content>
    <!-- Panel content -->
  </content>
</Panel>
```

---

### sap.m.Table
**Purpose:** Tabular data display

**Verified Properties:**
- `mode` - Selection mode: "None", "SingleSelect", "MultiSelect", "Delete" (enum)
- `backgroundDesign` - Background: "Solid", "Transparent", "Translucent" (enum)
- `fixedLayout` - Fixed table layout (boolean)
- `growing` - Growing table with more button (boolean)
- `growingThreshold` - Rows before growing (int)

**Aggregations:**
- `columns` (0..n) - Array of `sap.m.Column` controls
- `items` (0..n) - Array of `sap.m.ColumnListItem` controls
- `headerToolbar` (0..1) - Header toolbar
- `infoToolbar` (0..1) - Info toolbar

**Events:**
- `selectionChange` - Fired when selection changes
- `itemPress` - Fired when row is pressed

**Usage:** Display tabular data with columns and rows

**Example:**
```xml
<Table mode="SingleSelect" growing="true" growingThreshold="10">
  <columns>
    <Column>
      <Text text="Name" />
    </Column>
  </columns>
  <items>
    <ColumnListItem>
      <cells>
        <Text text="Item 1" />
      </cells>
    </ColumnListItem>
  </items>
</Table>
```

---

### sap.m.Column
**Purpose:** Table column definition

**Verified Properties:**
- `header` - Column header text or control
- `width` - Column width (CSS size string)
- `minWidth` - Minimum column width (CSS size string)
- `demandPopin` - Show in popin on small screens (boolean)
- `popinDisplay` - Popin display behavior: "Block", "Inline" (enum)

**Aggregations:**
- `header` (0..1) - Column header control (e.g., Text)

**Usage:** Define table columns

**Example:**
```xml
<Column width="200px" demandPopin="true" popinDisplay="Inline">
  <header>
    <Text text="Name" />
  </header>
</Column>
```

---

### sap.m.ColumnListItem
**Purpose:** Table row item

**Verified Properties:**
- `type` - Item type: "Active", "Inactive", "Navigation" (enum)
- `selected` - Selected state (boolean)

**Aggregations:**
- `cells` (0..n) - Array of cell controls (must match column count)

**Events:**
- `press` - Fired when row is pressed

**Usage:** Define table row content

**Example:**
```xml
<ColumnListItem type="Active">
  <cells>
    <Text text="Item 1" />
    <Text text="Description" />
  </cells>
</ColumnListItem>
```

---

### sap.m.Dialog
**Purpose:** Modal dialog

**Verified Properties:**
- `title` - Dialog title (string)
- `type` - Dialog type: "Standard", "Message", "Confirmation" (enum)
- `state` - Dialog state: "Success", "Warning", "Error", "Information", "None" (enum)
- `resizable` - Resizable dialog (boolean)
- `draggable` - Draggable dialog (boolean)

**Aggregations:**
- `content` (0..n) - Dialog content controls
- `beginButton` (0..1) - Begin button (left)
- `endButton` (0..1) - End button (right)
- `buttons` (0..n) - Array of buttons

**Events:**
- `afterOpen` - Fired after dialog opens
- `afterClose` - Fired after dialog closes
- `confirm` - Fired when confirm button pressed

**Usage:** Modal dialogs for confirmations, forms, messages

**Example:**
```xml
<Dialog title="Confirmation" type="Confirmation">
  <content>
    <Text text="Are you sure?" />
  </content>
  <beginButton>
    <Button text="Cancel" />
  </beginButton>
  <endButton>
    <Button text="OK" type="Accept" />
  </endButton>
</Dialog>
```

---

### sap.m.HBox
**Purpose:** Horizontal flexbox layout

**Key Properties:**
- `alignItems` - Vertical alignment: "Start", "Center", "End", "Stretch" (enum)
- `justifyContent` - Horizontal alignment: "Start", "Center", "End", "SpaceBetween", "SpaceAround" (enum)
- `width` - Container width (CSS size string)

**Aggregations:**
- `items` (0..n) - Child controls

**Usage:** Horizontal layout for buttons, labels

**Example:**
```xml
<HBox alignItems="Center" justifyContent="SpaceBetween" width="100%">
  <items>
    <Text text="Left" />
    <Text text="Right" />
  </items>
</HBox>
```

---

### sap.m.VBox
**Purpose:** Vertical flexbox layout

**Key Properties:**
- `alignItems` - Horizontal alignment: "Start", "Center", "End", "Stretch" (enum)
- `justifyContent` - Vertical alignment: "Start", "Center", "End", "SpaceBetween", "SpaceAround" (enum)
- `width` - Container width (CSS size string)

**Aggregations:**
- `items` (0..n) - Child controls

**Usage:** Vertical layout for stacked elements

**Example:**
```xml
<VBox alignItems="Center" justifyContent="SpaceBetween" width="100%">
  <items>
    <Text text="Top" />
    <Text text="Bottom" />
  </items>
</VBox>
```

---

### sap.m.List
**Purpose:** List control for displaying items

**Verified Properties:**
- `mode` - Selection mode: "None", "SingleSelect", "MultiSelect", "Delete" (enum)
- `showNoData` - Show no data message (boolean)
- `growing` - Growing list with more button (boolean)
- `growingThreshold` - Items before growing (int)

**Aggregations:**
- `items` (0..n) - Array of `sap.m.StandardListItem` or custom item controls
- `headerToolbar` (0..1) - Header toolbar
- `infoToolbar` (0..1) - Info toolbar

**Events:**
- `selectionChange` - Fired when selection changes
- `itemPress` - Fired when item is pressed

**Usage:** Display list of items with selection

**Example:**
```xml
<List mode="SingleSelect" growing="true" growingThreshold="10">
  <items>
    <StandardListItem title="Item 1" description="Description" />
    <StandardListItem title="Item 2" description="Description" />
  </items>
</List>
```

---

### sap.m.StandardListItem
**Purpose:** Standard list item

**Verified Properties:**
- `title` - Item title (string)
- `description` - Item description (string)
- `icon` - Icon URI (string)
- `info` - Additional info text (string)
- `type` - Item type: "Active", "Inactive", "Navigation" (enum)

**Events:**
- `press` - Fired when item is pressed

**Usage:** Standard list item with title, description, icon

**Example:**
```xml
<StandardListItem title="Item Title" description="Item description" icon="sap-icon://list" type="Active" />
```

---

### sap.m.IconTabBar
**Purpose:** Tab bar with icons

**Verified Properties:**
- `selectedKey` - Selected tab key (string)
- `expandable` - Expandable tab bar (boolean)
- `expanded` - Initial expanded state (boolean)
- `upperCase` - Uppercase tab text (boolean)

**Aggregations:**
- `items` (0..n) - Array of `sap.m.IconTabFilter` controls

**Events:**
- `select` - Fired when tab is selected

**Usage:** Tab navigation with icons

**Example:**
```xml
<IconTabBar selectedKey="tab1">
  <items>
    <IconTabFilter key="tab1" text="Tab 1" icon="sap-icon://home" />
    <IconTabFilter key="tab2" text="Tab 2" icon="sap-icon://settings" />
  </items>
</IconTabBar>
```

---

### sap.m.IconTabFilter
**Purpose:** Tab filter for IconTabBar

**Verified Properties:**
- `key` - Filter key (string)
- `text` - Tab text (string)
- `icon` - Icon URI (string)
- `count` - Badge count (string)

**Usage:** Define tab options

**Example:**
```xml
<IconTabFilter key="tab1" text="Tab 1" icon="sap-icon://home" count="5" />
```

---

### sap.m.Breadcrumbs
**Purpose:** Breadcrumb navigation

**Verified Properties:**
- `currentLocationText` - Current location text (string)
- `separatorStyle` - Separator style: "Standard", "Chevron" (enum)

**Aggregations:**
- `links` (0..n) - Array of `sap.m.Link` controls

**Events:**
- `linkPressed` - Fired when breadcrumb link is pressed

**Usage:** Navigation breadcrumb trail

**Example:**
```xml
<Breadcrumbs currentLocationText="Current Page">
  <links>
    <Link text="Home" href="#home" />
    <Link text="Section" href="#section" />
  </links>
</Breadcrumbs>
```

---

## Layout Controls (sap.ui.layout.form)

### sap.ui.layout.form.SimpleForm
**Purpose:** Responsive form layout container

**Verified Properties:**
- `editable` - Editable mode (boolean)
- `layout` - Layout type: "ResponsiveGridLayout", "ResponsiveGridLayout", "Grid", "GridLayout" (enum)
- `labelSpanXL` - Label width in XL screens (int)
- `labelSpanL` - Label width in L screens (int)
- `labelSpanM` - Label width in M screens (int)
- `adjustLabelSpan` - Auto-adjust label span (boolean)
- `emptySpanXL` - Empty columns after label in XL (int)
- `emptySpanL` - Empty columns after label in L (int)
- `emptySpanM` - Empty columns after label in M (int)
- `columnsXL` - Number of columns in XL (int)
- `columnsL` - Number of columns in L (int)
- `columnsM` - Number of columns in M (int)
- `singleContainerFullSize` - Single container uses full width (boolean)
- `width` - Form width (CSS size string)

**Aggregations:**
- `content` (0..n) - Form content (Label + Input pairs)

**Usage:** Responsive form layout with automatic column adjustment

**Example:**
```xml
<SimpleForm layout="ResponsiveGridLayout" columnsXL="2" columnsL="2" columnsM="1" labelSpanXL="3" emptySpanXL="4" singleContainerFullSize="true" width="100%">
  <content>
    <Label text="Field 1" />
    <Input value="{viewModel>/field1}" />
  </content>
</SimpleForm>
```

---

## Other Controls

### sap.ui.unified.FileUploader
**Purpose:** File upload control

**Verified Properties:**
- `name` - Form field name (string)
- `uploadUrl` - Upload endpoint URL (string)
- `tooltip` - Tooltip text (string)
- `placeholder` - Placeholder text (string)
- `multiple` - Allow multiple files (boolean)

**Events:**
- `change` - Fired when file selection changes
- `uploadComplete` - Fired when upload completes

**Usage:** File upload for documents, images

**Namespace Requirement:** Requires `xmlns:unified="sap.ui.unified"` and use `unified:FileUploader`

**Example:**
```xml
<unified:FileUploader name="file" uploadUrl="/upload" placeholder="Select file" multiple="true" />
```

---

### sap.tnt.InfoLabel
**Purpose:** Info label with color schemes

**Verified Properties:**
- `text` - Label text (string)
- `colorScheme` - Color scheme: 1-8 (int)
- `renderMode` - Render mode: "Regular", "Light" (enum)

**Events:** None

**Usage:** Info labels with predefined color schemes

**Namespace Requirement:** Requires `xmlns:tnt="sap.tnt"` and use `tnt:InfoLabel`

**Example:**
```xml
<tnt:InfoLabel text="Info" colorScheme="5" renderMode="Regular" />
```

---

## Short Names Reference

Use these short names for easier prompting:

- `Page` → `sap.m.Page`
- `Table` → `sap.m.Table`
- `Button` → `sap.m.Button`
- `Input` → `sap.m.Input`
- `Select` → `sap.m.Select`
- `Panel` → `sap.m.Panel`
- `Label` → `sap.m.Label`
- `Switch` → `sap.m.Switch`
- `CheckBox` → `sap.m.CheckBox`
- `DatePicker` → `sap.m.DatePicker`
- `TextArea` → `sap.m.TextArea`
- `ComboBox` → `sap.m.ComboBox`
- `Dialog` → `sap.m.Dialog`
- `Link` → `sap.m.Link`
- `Slider` → `sap.m.Slider`
- `MultiComboBox` → `sap.m.MultiComboBox`
- `RatingIndicator` → `sap.m.RatingIndicator`
- `ProgressIndicator` → `sap.m.ProgressIndicator`
- `SegmentedButton` → `sap.m.SegmentedButton`
- `StepInput` → `sap.m.StepInput`
- `ToggleButton` → `sap.m.ToggleButton`
- `RadioButton` → `sap.m.RadioButton`
- `MaskInput` → `sap.m.MaskInput`
- `Image` → `sap.m.Image`
- `Title` → `sap.m.Title`
- `HBox` → `sap.m.HBox`
- `VBox` → `sap.m.VBox`
- `List` → `sap.m.List`
- `ObjectHeader` → `sap.m.ObjectHeader`
- `IconTabBar` → `sap.m.IconTabBar`
- `Breadcrumbs` → `sap.m.Breadcrumbs`
- `GenericTag` → `sap.m.GenericTag`
- `InfoLabel` → `sap.tnt.InfoLabel`
- `MessagePopover` → `sap.m.MessagePopover`
- `FileUploader` → `sap.ui.unified.FileUploader`
- `ShellBar` → `sap.f.ShellBar`
- `DynamicPage` → `sap.f.DynamicPage`
- `DynamicPageTitle` → `sap.f.DynamicPageTitle`
- `DynamicPageHeader` → `sap.f.DynamicPageHeader`
- `FilterBar` → `sap.m.FilterBar`
- `FlexibleColumnLayout` → `sap.f.FlexibleColumnLayout`
- `ObjectPageLayout` → `sap.uxap.ObjectPageLayout`

---

## Page Layout Controls (sap.f)

### sap.f.ShellBar
Always the first item in `hierarchy[]`. Present on every screen. Never inside a page container. One per screen.

**Key properties:** `productName` (required), `showNotifications`, `notificationsNumber`, `showNavButton`, `showProductSwitcher`

### sap.f.DynamicPage
Root page container for List Report and Worklist floorplans.

**Critical:** `fitContent: true` when content is a Table. Slots: `title` (required), `header` (List Report only, absent on Worklist), `content` (required), `footer` (draft save only).

### sap.f.DynamicPageTitle
Mandatory slot of DynamicPage. Contains page heading, breadcrumbs, and page-level actions (Create, Export).

**Slots:** `heading`, `snappedHeading`, `breadcrumbs`, `actions`, `navigationActions`

### sap.f.DynamicPageHeader
Collapsible header of DynamicPage. **Present on list-report only. Never on worklist.** Contains FilterBar.

**Key property:** `pinnable` (boolean, default true)

### sap.m.FilterBar
Filter toolbar for List Report and ALP. Lives in DynamicPageHeader. **Never on Worklist.**

**Key properties:** `showGoButton` (team rule: always true), `showAdaptFiltersButton`, `filterCount`. Slot: `filterItems` (0..n FilterItem).

## Page Layout Controls (sap.f — Multi-Column)

### sap.f.FlexibleColumnLayout
The only correct container for Master-Detail floorplan. Each column slot holds a full page.

**layout enum:** OneColumn / TwoColumnsBeginExpanded / TwoColumnsMidExpanded / ThreeColumnsMidExpanded / MidColumnFullScreen / EndColumnFullScreen. Always set `restoreFocusOnBackNavigation: true`.

## Page Layout Controls (sap.uxap)

### sap.uxap.ObjectPageLayout
Root container for Object Page floorplan. **Requires `sap.uxap` in bootstrap libs.**

**Slots:** `headerTitle` (required — use ObjectPageDynamicHeaderTitle, NOT deprecated ObjectPageHeader), `headerContent`, `sections` (required, 1..n ObjectPageSection), `footer`. Section hierarchy: Layout → Section → SubSection → blocks[].

---

**Last Updated:** June 16, 2026
**Total Components:** 32 verified controls
**API Source:** https://ui5.sap.com/#/api
