#!/usr/bin/env python3
"""
Add composition rules to remaining 87 SAP components.

Source authority:
  - knowledge/components/registry/*.json `compatibleComponents` + `incompatiblePatterns`
  - knowledge/guidelines/*.json `compatibility.worksWith` + `incompatible` + `patterns`
  - SAP Fiori Design Guidelines (experience.sap.com) — cached in guidelines
  - SAPUI5 API reference (sdk.openui5.org) — cross-referenced for aggregations

Categories (95 components total — 8 already done, 87 remaining):
  ✓ Done already: Dialog, DynamicPage, Table, Form, FilterBar, ShellBar, SideNavigation, Panel
  · Buttons (4), Container (6 → 5 remaining), Data Display (5), Display (5),
    Feedback (9), Forms (3), Form (1 already done), Input (20),
    List (2), List Item (5), Navigation (8), Object Display (3),
    Overlay (3 → 2 remaining: Popover, QuickView), Page (4 → 3 remaining),
    Page Layout (5), Selection (3), Shell (1 already done),
    Status (1), Table (3 → 2 remaining: Column, ColumnListItem),
    Typography (4)
"""
import json, os, sys

REG = 'knowledge/components/registry'

# All containers that can hold "general" content
CONTAINERS_GENERIC = ['DynamicPage','ObjectPageLayout','Panel','Card','Dialog','Popover',
                     'IconTabBar','Form','SimpleForm','SapFormSection']

# Page-level containers (where you'd put a Table, List, etc.)
CONTAINERS_PAGE = ['DynamicPage','ObjectPageLayout','ObjectPageSection',
                   'ObjectPageSubSection','Panel','Card','Dialog']

# Common form-input parents
PARENTS_FORM_INPUT = ['Form','SimpleForm','FormContainer','FormElement',
                     'Panel','Dialog','Popover','FilterBar','SapFormSection',
                     'IconTabBar','ObjectPageSection']

# Toolbar-style containers (horizontal action bars)
CONTAINERS_TOOLBAR = ['Toolbar','OverflowToolbar','FilterBar','DynamicPageTitle',
                     'ShellBar','Footer']

# Components that can never be a child of anything (top-level only)
TOP_LEVEL = ['ShellBar','SideNavigation','NativeSideNav','DynamicPage',
             'ObjectPageLayout','Dialog','Popover','MessageBox','MessageToast',
             'BusyDialog','QuickView']

COMPOSITIONS = {

    # ─────────── BUTTONS ───────────
    'Button': {
        'validParents': CONTAINERS_TOOLBAR + ['Form','SimpleForm','Panel','Dialog',
                        'Popover','Card','MessageStrip','MessagePopover','SapFormSection',
                        'DynamicPageTitle','OverflowToolbar','Toolbar','ColumnListItem',
                        'Wizard','WizardStep','Timeline','TimelineItem','Carousel',
                        'IconTabBar','ObjectPageSection','ObjectPageSubSection'],
        'topLevelOnly': False,
        'validChildren': [],  # Button is a leaf — text only via props
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['Button','MenuButton','IconButton','ToolbarSpacer','SearchField','Input']
    },
    'IconButton': {
        'validParents': CONTAINERS_TOOLBAR + ['Form','Panel','Dialog','Popover','Card',
                        'ColumnListItem','SapTableRow','OverflowToolbar','Toolbar',
                        'DynamicPageTitle','ShellBar','FilterBar','ListItem'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['Button','IconButton','MenuButton','ToolbarSpacer']
    },
    'MenuButton': {
        'validParents': CONTAINERS_TOOLBAR + ['Form','Panel','Dialog','OverflowToolbar',
                        'Toolbar','DynamicPageTitle','FilterBar','Card'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['Button','IconButton','ToolbarSpacer']
    },
    'ToggleButton': {
        'validParents': CONTAINERS_TOOLBAR + ['Form','Panel','OverflowToolbar','Toolbar'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['ToggleButton','Button','SegmentedButton']
    },

    # ─────────── CONTAINER (remaining: Card, Carousel, OverflowToolbar, Toolbar — Panel/FilterBar already done) ───────────
    'Card': {
        'validParents': ['DynamicPage','ObjectPageLayout','ObjectPageSection','Panel',
                        'Dialog','IconTabBar','Carousel'],
        'topLevelOnly': False,
        'validChildren': ['Title','Text','Label','Avatar','AvatarGroup','ObjectStatus',
                         'ObjectIdentifier','ObjectNumber','ObjectAttribute','Tag','Link',
                         'Button','IconButton','MessageStrip','ProgressIndicator',
                         'Form','SimpleForm','List','Table','SapColHeader','SapTableRow',
                         'Timeline','TimelineItem','IllustratedMessage'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','NativeSideNav','SideNavigation','DynamicPage',
                       'DynamicPageTitle','DynamicPageHeader','ObjectPageLayout','Dialog'],
        'commonSiblings': ['Card','Panel']
    },
    'Carousel': {
        'validParents': ['DynamicPage','ObjectPageLayout','ObjectPageSection','Panel','Card','Dialog'],
        'topLevelOnly': False,
        'validChildren': ['Card','Panel','Avatar','IllustratedMessage','*'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','NativeSideNav','DynamicPage','Dialog'],
        'commonSiblings': []
    },
    'OverflowToolbar': {
        'validParents': ['DynamicPage','ObjectPageLayout','ObjectPageSection','Panel','Card',
                        'Dialog','IconTabBar','DynamicPageTitle','FilterBar'],
        'topLevelOnly': False,
        'validChildren': ['Title','Label','Text','Button','IconButton','MenuButton','SplitButton',
                         'ToggleButton','SegmentedButton','Input','SearchField','Select',
                         'ComboBox','MultiComboBox','MultiInput','CheckBox','Switch',
                         'ToolbarSpacer','OverflowToolbar','Toolbar','Link'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','NativeSideNav','DynamicPage','Dialog','Table','Form'],
        'commonSiblings': ['Table','SapColHeader','SapTableRow','List','Form']
    },
    'Toolbar': {
        'validParents': ['DynamicPage','ObjectPageLayout','Panel','Card','Dialog',
                        'IconTabBar','Form','DynamicPageTitle','FilterBar'],
        'topLevelOnly': False,
        'validChildren': ['Title','Label','Text','Button','IconButton','MenuButton',
                         'SegmentedButton','ToggleButton','Input','SearchField','Select',
                         'ToolbarSpacer','Link'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','NativeSideNav','DynamicPage','Dialog'],
        'commonSiblings': ['Table','List','Form']
    },

    # ─────────── DATA DISPLAY ───────────
    'ResponsiveTable': {
        'validParents': CONTAINERS_PAGE + ['SapFormSection'],
        'topLevelOnly': False,
        'validChildren': ['SapColHeader','SapTableRow','Column','ColumnListItem','MessageStrip'],
        'mustInclude': ['SapColHeader'],
        'mustExclude': ['ShellBar','NativeSideNav','DynamicPage','Dialog','FilterBar'],
        'commonSiblings': ['OverflowToolbar','Toolbar','FilterBar','SearchField']
    },
    'Timeline': {
        'validParents': ['DynamicPage','ObjectPageLayout','ObjectPageSection','Panel','Card','Dialog'],
        'topLevelOnly': False,
        'validChildren': ['TimelineItem'],
        'mustInclude': ['TimelineItem'],
        'mustExclude': ['ShellBar','DynamicPage','Dialog','Table','Form'],
        'commonSiblings': ['Card','Panel']
    },
    'TimelineItem': {
        'validParents': ['Timeline'],
        'topLevelOnly': False,
        'validChildren': ['Avatar','Text','Title','Link','Button','ObjectStatus','Tag','Label'],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['TimelineItem']
    },
    'Tree': {
        'validParents': ['DynamicPage','ObjectPageLayout','Panel','Card','Dialog'],
        'topLevelOnly': False,
        'validChildren': ['TreeItem'],
        'mustInclude': ['TreeItem'],
        'mustExclude': ['ShellBar','NativeSideNav'],
        'commonSiblings': ['OverflowToolbar','SearchField','Toolbar']
    },
    'TreeItem': {
        'validParents': ['Tree','TreeItem'],
        'topLevelOnly': False,
        'validChildren': ['TreeItem','Text','Label','Icon','Link'],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['TreeItem']
    },

    # ─────────── DISPLAY ───────────
    'Avatar': {
        'validParents': ['DynamicPageTitle','DynamicPageHeader','ObjectPageHeader','Card',
                        'Panel','Dialog','Popover','AvatarGroup','SapTableRow','ColumnListItem',
                        'StandardListItem','FeedListItem','TimelineItem','MessagePopover',
                        'ShellBar','Toolbar','OverflowToolbar'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['Title','Text','Label','ObjectStatus','ObjectIdentifier']
    },
    'Link': {
        'validParents': ['Form','SimpleForm','FormContainer','FormElement','Panel','Card',
                        'Dialog','Popover','Toolbar','OverflowToolbar','MessageStrip',
                        'MessagePopover','ColumnListItem','SapTableRow','TimelineItem',
                        'FeedListItem','StandardListItem','Text','IconTabBar','Breadcrumb',
                        'DynamicPageTitle','ObjectPageSection'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['Text','Label','Button']
    },
    'ObjectIdentifier': {
        'validParents': ['Card','Panel','Dialog','SapTableRow','ColumnListItem','ObjectListItem',
                        'StandardListItem','FeedListItem','DynamicPageTitle','DynamicPageHeader',
                        'ObjectPageHeader','TimelineItem'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['ObjectStatus','ObjectNumber','ObjectAttribute','Avatar','Title']
    },
    'ObjectNumber': {
        'validParents': ['Card','Panel','Dialog','SapTableRow','ColumnListItem','ObjectListItem',
                        'StandardListItem','DynamicPageTitle','DynamicPageHeader','ObjectPageHeader'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['ObjectIdentifier','ObjectStatus','Title','Text']
    },
    'Tag': {
        'validParents': ['Card','Panel','Dialog','SapTableRow','ColumnListItem',
                        'DynamicPageHeader','ObjectPageHeader','Form','SimpleForm','Tokenizer',
                        'Toolbar','OverflowToolbar','TimelineItem'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['Tag','ObjectStatus']
    },

    # ─────────── FEEDBACK ───────────
    'BusyDialog': {
        'validParents': [],
        'topLevelOnly': True,
        'validChildren': ['BusyIndicator','Text','Label','Button'],
        'mustInclude': ['BusyIndicator'],
        'mustExclude': ['ShellBar','DynamicPage','Form','Table'],
        'commonSiblings': []
    },
    'BusyIndicator': {
        'validParents': ['Dialog','BusyDialog','Panel','Card','DynamicPage','ObjectPageLayout',
                        'Form','Table','List','IconTabBar','Popover','MessageStrip'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['Text','Label']
    },
    'IllustratedMessage': {
        'validParents': ['DynamicPage','ObjectPageLayout','ObjectPageSection','Panel','Card',
                        'Dialog','Table','List','IconTabBar'],
        'topLevelOnly': False,
        'validChildren': ['Title','Text','Button','Link'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','DynamicPage'],
        'commonSiblings': []
    },
    'MessageBox': {
        'validParents': [],
        'topLevelOnly': True,
        'validChildren': ['Title','Text','Label','Button','MessageStrip','Link'],
        'mustInclude': ['Button'],
        'mustExclude': ['ShellBar','DynamicPage','Table','Form','Panel'],
        'commonSiblings': []
    },
    'MessagePopover': {
        'validParents': ['Form','SimpleForm','OverflowToolbar','Toolbar','DynamicPageTitle'],
        'topLevelOnly': False,
        'validChildren': ['MessageStrip','Text','Title','Link','Button','List','StandardListItem'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','DynamicPage'],
        'commonSiblings': ['Button']
    },
    'MessageStrip': {
        'validParents': ['DynamicPage','ObjectPageLayout','ObjectPageSection','Panel','Card',
                        'Dialog','Popover','Form','SimpleForm','Table','List','IconTabBar',
                        'MessagePopover','SapFormSection','Wizard','WizardStep'],
        'topLevelOnly': False,
        'validChildren': ['Link','Button'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','DynamicPage','Dialog'],
        'commonSiblings': ['Form','Table','MessageStrip']
    },
    'MessageToast': {
        'validParents': [],
        'topLevelOnly': True,
        'validChildren': ['Text'],
        'mustInclude': [],
        'mustExclude': ['*'],
        'commonSiblings': []
    },
    'ProgressIndicator': {
        'validParents': ['DynamicPage','ObjectPageLayout','ObjectPageSection','Panel','Card',
                        'Dialog','Form','SimpleForm','SapTableRow','ColumnListItem','Wizard',
                        'WizardStep','IconTabBar'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['Label','Title','Text']
    },
    'ProgressStep': {
        'validParents': ['Wizard','DynamicPage','Panel'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['ProgressStep']
    },

    # ─────────── FORM (Form already done) ───────────

    # ─────────── FORMS ───────────
    'FormContainer': {
        'validParents': ['Form','SimpleForm','Panel','Dialog'],
        'topLevelOnly': False,
        'validChildren': ['FormElement','Label','Input','Select','ComboBox','MultiComboBox',
                         'MultiInput','DatePicker','DateTimePicker','DateRangePicker','TimePicker',
                         'TextArea','CheckBox','RadioButton','RadioButtonGroup','Switch','Slider',
                         'RangeSlider','StepInput','FileUploader','Title','Text','MessageStrip'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','DynamicPage'],
        'commonSiblings': ['FormContainer']
    },
    'FormElement': {
        'validParents': ['Form','SimpleForm','FormContainer'],
        'topLevelOnly': False,
        'validChildren': ['Label','Input','Select','ComboBox','MultiComboBox','MultiInput',
                         'DatePicker','DateTimePicker','DateRangePicker','TimePicker','TextArea',
                         'CheckBox','RadioButton','RadioButtonGroup','Switch','Slider','RangeSlider',
                         'StepInput','FileUploader','Link','Text','Button'],
        'mustInclude': ['Label'],
        'mustExclude': [],
        'commonSiblings': ['FormElement']
    },
    'SimpleForm': {
        'validParents': CONTAINERS_PAGE + ['IconTabBar','SapFormSection'],
        'topLevelOnly': False,
        'validChildren': ['Label','Input','Select','ComboBox','MultiComboBox','MultiInput',
                         'DatePicker','DateTimePicker','DateRangePicker','TimePicker','TextArea',
                         'CheckBox','RadioButton','RadioButtonGroup','Switch','Slider','RangeSlider',
                         'StepInput','FileUploader','FormContainer','FormElement','Title','Text',
                         'Link','MessageStrip','Button'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','DynamicPage','Table','SapTableRow'],
        'commonSiblings': ['MessageStrip','Toolbar']
    },

    # ─────────── INPUT (20 components) ───────────
    'DatePicker':       { 'validParents': PARENTS_FORM_INPUT + ['SapTableRow','ColumnListItem','InputListItem'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','Input','Select'] },
    'DateRangePicker':  { 'validParents': PARENTS_FORM_INPUT + ['SapTableRow','ColumnListItem','InputListItem'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','Input','Select'] },
    'DateTimePicker':   { 'validParents': PARENTS_FORM_INPUT + ['SapTableRow','ColumnListItem','InputListItem'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','Input','Select'] },
    'FeedInput':        { 'validParents': ['Panel','Card','Dialog','Popover','DynamicPage','ObjectPageSection','Form'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': ['Table','ShellBar'], 'commonSiblings': ['Avatar','Button','Link'] },
    'FileUploader':     { 'validParents': PARENTS_FORM_INPUT + ['Toolbar','OverflowToolbar'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','Button'] },
    'Input':            { 'validParents': PARENTS_FORM_INPUT + ['Toolbar','OverflowToolbar','SapTableRow','ColumnListItem','InputListItem'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','Select','Button','Input'] },
    'MaskedInput':      { 'validParents': PARENTS_FORM_INPUT, 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': ['ShellBar','Table'], 'commonSiblings': ['Label','Input'] },
    'MultiComboBox':    { 'validParents': PARENTS_FORM_INPUT + ['Toolbar','OverflowToolbar','SapTableRow','ColumnListItem','InputListItem'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','Tokenizer'] },
    'MultiInput':       { 'validParents': PARENTS_FORM_INPUT + ['Toolbar','OverflowToolbar','SapTableRow','InputListItem'], 'topLevelOnly': False, 'validChildren': ['Token','Tokenizer'], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','Tokenizer'] },
    'RadioButtonGroup': { 'validParents': PARENTS_FORM_INPUT, 'topLevelOnly': False, 'validChildren': ['RadioButton'], 'mustInclude': ['RadioButton'], 'mustExclude': ['ShellBar','Table'], 'commonSiblings': ['Label','CheckBox'] },
    'RangeSlider':      { 'validParents': PARENTS_FORM_INPUT, 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','Slider'] },
    'SearchField':      { 'validParents': ['OverflowToolbar','Toolbar','FilterBar','DynamicPageTitle','Panel','Card','Dialog','ShellBar','IconTabBar','Popover'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Button','Input'] },
    'SegmentedButton':  { 'validParents': ['OverflowToolbar','Toolbar','FilterBar','DynamicPageTitle','Form','SimpleForm','Panel','Card','Dialog'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Button','ToggleButton'] },
    'Select':           { 'validParents': PARENTS_FORM_INPUT + ['Toolbar','OverflowToolbar','SapTableRow','ColumnListItem','InputListItem','DynamicPageTitle'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','Input'] },
    'Slider':           { 'validParents': PARENTS_FORM_INPUT, 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','RangeSlider'] },
    'StepInput':        { 'validParents': PARENTS_FORM_INPUT + ['SapTableRow','ColumnListItem','InputListItem'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','Input'] },
    'TextArea':         { 'validParents': PARENTS_FORM_INPUT, 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label'] },
    'TimePicker':       { 'validParents': PARENTS_FORM_INPUT + ['SapTableRow','ColumnListItem','InputListItem'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','DatePicker'] },
    'Token':            { 'validParents': ['Tokenizer','MultiInput','MultiComboBox','FilterBar'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Token'] },
    'Tokenizer':        { 'validParents': PARENTS_FORM_INPUT + ['Toolbar','OverflowToolbar','FilterBar'], 'topLevelOnly': False, 'validChildren': ['Token'], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','Input'] },

    # ─────────── LIST ───────────
    'List': {
        'validParents': CONTAINERS_PAGE + ['IconTabBar','SapFormSection'],
        'topLevelOnly': False,
        'validChildren': ['StandardListItem','ColumnListItem','ActionListItem','InputListItem',
                         'FeedListItem','GroupHeaderListItem','ObjectListItem','MessageStrip',
                         'IllustratedMessage'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','DynamicPage','Dialog','Form'],
        'commonSiblings': ['OverflowToolbar','Toolbar','SearchField']
    },
    'StandardListItem': {
        'validParents': ['List','Popover','MessagePopover','Dialog'],
        'topLevelOnly': False,
        'validChildren': ['Icon','Avatar','ObjectStatus','Button','Link','Text','Label'],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['StandardListItem','GroupHeaderListItem']
    },

    # ─────────── LIST ITEM (5) ───────────
    'ActionListItem':      { 'validParents': ['List','Popover','MessagePopover','Dialog'], 'topLevelOnly': False, 'validChildren': ['Link','Button','Text'], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['ActionListItem','StandardListItem'] },
    'FeedListItem':        { 'validParents': ['List','Panel','Card','DynamicPageSection','Dialog'], 'topLevelOnly': False, 'validChildren': ['Avatar','Title','Text','Link','Button','MessageStrip'], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['FeedListItem','FeedInput'] },
    'GroupHeaderListItem': { 'validParents': ['List','Table'], 'topLevelOnly': False, 'validChildren': ['Title','Text','Label'], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['StandardListItem','ColumnListItem'] },
    'InputListItem':       { 'validParents': ['List','Dialog','Popover'], 'topLevelOnly': False, 'validChildren': ['Label','Input','Select','Switch','CheckBox','DatePicker'], 'mustInclude': ['Label'], 'mustExclude': [], 'commonSiblings': ['InputListItem'] },
    'ObjectListItem':      { 'validParents': ['List'], 'topLevelOnly': False, 'validChildren': ['ObjectIdentifier','ObjectStatus','ObjectNumber','ObjectAttribute','ObjectMarker','Avatar','Tag','Button'], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['ObjectListItem'] },

    # ─────────── NAVIGATION ───────────
    'Breadcrumb': {
        'validParents': ['DynamicPageTitle','ObjectPageHeader','Toolbar','OverflowToolbar'],
        'topLevelOnly': False,
        'validChildren': ['Link','Text'],
        'mustInclude': [],
        'mustExclude': ['Dialog','ShellBar'],
        'commonSiblings': ['Title']
    },
    'IconTabBar': {
        'validParents': ['DynamicPage','ObjectPageLayout','ObjectPageSection','Panel','Card','Dialog'],
        'topLevelOnly': False,
        'validChildren': ['IconTabFilter','IconTabSeparator','IconTabHeader','OverflowToolbar',
                         'Toolbar','Table','SapColHeader','SapTableRow','List','Form','SimpleForm',
                         'Panel','Card','MessageStrip','IllustratedMessage'],
        'mustInclude': ['IconTabFilter'],
        'mustExclude': ['ShellBar','NativeSideNav','DynamicPage'],
        'commonSiblings': ['Table','List','Form']
    },
    'IconTabFilter': {
        'validParents': ['IconTabBar','IconTabHeader'],
        'topLevelOnly': False,
        'validChildren': ['Text','Icon'],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['IconTabFilter','IconTabSeparator']
    },
    'IconTabHeader': {
        'validParents': ['IconTabBar','DynamicPage','Panel'],
        'topLevelOnly': False,
        'validChildren': ['IconTabFilter','IconTabSeparator'],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': []
    },
    'IconTabSeparator': {
        'validParents': ['IconTabBar','IconTabHeader'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['IconTabFilter']
    },
    'NavigationItem': {
        'validParents': ['SideNavigation','NavigationList','NavigationListItem'],
        'topLevelOnly': False,
        'validChildren': ['NavigationItem','Text','Icon'],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['NavigationItem']
    },
    'Tabs': {
        'validParents': ['DynamicPage','ObjectPageLayout','Panel','Card','Dialog'],
        'topLevelOnly': False,
        'validChildren': ['IconTabFilter','Text','Icon'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','NativeSideNav'],
        'commonSiblings': []
    },

    # ─────────── OBJECT DISPLAY ───────────
    'AvatarGroup': {
        'validParents': ['DynamicPageTitle','DynamicPageHeader','ObjectPageHeader','Panel','Card',
                        'Dialog','SapTableRow','ColumnListItem','ObjectListItem','TimelineItem',
                        'FeedListItem'],
        'topLevelOnly': False,
        'validChildren': ['Avatar'],
        'mustInclude': ['Avatar'],
        'mustExclude': [],
        'commonSiblings': ['Title','Text','ObjectStatus']
    },
    'ObjectAttribute': {
        'validParents': ['DynamicPageHeader','DynamicPageTitle','ObjectPageHeader','ObjectPageLayout',
                        'Panel','Card','Dialog','ColumnListItem','SapTableRow','ObjectListItem',
                        'TimelineItem','FeedListItem'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['ObjectAttribute','ObjectIdentifier','ObjectStatus']
    },
    'ObjectMarker': {
        'validParents': ['ColumnListItem','SapTableRow','ObjectListItem','DynamicPageHeader',
                        'Card','Panel'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['ObjectStatus','ObjectIdentifier']
    },

    # ─────────── OVERLAY (Dialog already done) ───────────
    'Popover': {
        'validParents': [],
        'topLevelOnly': True,
        'validChildren': ['Title','Text','Label','Button','Link','Form','SimpleForm','List',
                         'StandardListItem','ActionListItem','MessageStrip','IllustratedMessage',
                         'Input','Select','CheckBox','RadioButton','Switch','Avatar','Tag',
                         'ObjectStatus','ObjectIdentifier'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','NativeSideNav','DynamicPage','Dialog','Popover'],
        'commonSiblings': []
    },
    'QuickView': {
        'validParents': [],
        'topLevelOnly': True,
        'validChildren': ['Avatar','Title','Text','Label','Link','Button','ObjectAttribute',
                         'ObjectStatus','ObjectIdentifier','Tag'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','DynamicPage'],
        'commonSiblings': []
    },

    # ─────────── PAGE (DynamicPage already done) ───────────
    'DynamicPageHeader': {
        'validParents': ['DynamicPage','ObjectPageLayout'],
        'topLevelOnly': False,
        'validChildren': ['Title','Text','Label','Avatar','AvatarGroup','ObjectAttribute',
                         'ObjectStatus','ObjectIdentifier','ObjectNumber','ObjectMarker','Tag',
                         'Link','Breadcrumb','MessageStrip'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','NativeSideNav','Table','Form'],
        'commonSiblings': ['DynamicPageTitle']
    },
    'DynamicPageTitle': {
        'validParents': ['DynamicPage','ObjectPageLayout'],
        'topLevelOnly': False,
        'validChildren': ['Title','Text','Label','Avatar','Breadcrumb','Button','IconButton',
                         'MenuButton','Link','ObjectStatus','ObjectIdentifier','ObjectNumber',
                         'Tag','SearchField','Select','SegmentedButton'],
        'mustInclude': ['Title'],
        'mustExclude': ['Table','Form','ShellBar'],
        'commonSiblings': ['DynamicPageHeader']
    },
    'ObjectPageLayout': {
        'validParents': [],
        'topLevelOnly': True,
        'validChildren': ['DynamicPageTitle','DynamicPageHeader','ObjectPageHeader',
                         'ObjectPageSection','ObjectPageSubSection','IconTabBar','Panel','Card',
                         'Form','SimpleForm','Table','List','SapColHeader','SapTableRow',
                         'OverflowToolbar','MessageStrip','IllustratedMessage'],
        'mustInclude': ['DynamicPageTitle'],
        'mustExclude': ['Dialog','Popover'],
        'commonSiblings': ['ShellBar','NativeSideNav']
    },

    # ─────────── PAGE LAYOUT (5) ───────────
    'ObjectPageHeader': {
        'validParents': ['ObjectPageLayout'],
        'topLevelOnly': False,
        'validChildren': ['Title','Text','Avatar','AvatarGroup','ObjectAttribute','ObjectStatus',
                         'ObjectIdentifier','ObjectNumber','ObjectMarker','Tag','Link','Breadcrumb',
                         'Button','IconButton','MenuButton','MessageStrip'],
        'mustInclude': ['Title'],
        'mustExclude': ['ShellBar','Table','Form'],
        'commonSiblings': []
    },
    'ObjectPageSection': {
        'validParents': ['ObjectPageLayout'],
        'topLevelOnly': False,
        'validChildren': ['ObjectPageSubSection','Title','Text','Form','SimpleForm','Panel','Card',
                         'Table','List','SapColHeader','SapTableRow','MessageStrip',
                         'IllustratedMessage','Carousel','Timeline','IconTabBar','OverflowToolbar'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','DynamicPage','Dialog'],
        'commonSiblings': ['ObjectPageSection']
    },
    'ObjectPageSubSection': {
        'validParents': ['ObjectPageSection'],
        'topLevelOnly': False,
        'validChildren': ['Title','Text','Form','SimpleForm','Panel','Card','Table','List',
                         'SapColHeader','SapTableRow','MessageStrip','Button','Link'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','DynamicPage','Dialog'],
        'commonSiblings': ['ObjectPageSubSection']
    },
    'Wizard': {
        'validParents': ['DynamicPage','Dialog','ObjectPageLayout','Panel'],
        'topLevelOnly': False,
        'validChildren': ['WizardStep','ProgressStep'],
        'mustInclude': ['WizardStep'],
        'mustExclude': ['ShellBar','NativeSideNav'],
        'commonSiblings': ['Button']
    },
    'WizardStep': {
        'validParents': ['Wizard'],
        'topLevelOnly': False,
        'validChildren': ['Title','Text','Form','SimpleForm','Panel','MessageStrip','Input',
                         'Select','CheckBox','RadioButton','Switch','Button','Link','*'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','DynamicPage','Dialog'],
        'commonSiblings': ['WizardStep']
    },

    # ─────────── SELECTION (3) ───────────
    'CheckBox':    { 'validParents': PARENTS_FORM_INPUT + ['SapColHeader','SapTableRow','ColumnListItem','Toolbar','OverflowToolbar','InputListItem','DynamicPageTitle','Card'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','CheckBox','RadioButton'] },
    'RadioButton': { 'validParents': PARENTS_FORM_INPUT + ['RadioButtonGroup','InputListItem'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','RadioButton'] },
    'Switch':      { 'validParents': PARENTS_FORM_INPUT + ['Toolbar','OverflowToolbar','SapTableRow','ColumnListItem','InputListItem','Card'], 'topLevelOnly': False, 'validChildren': [], 'mustInclude': [], 'mustExclude': [], 'commonSiblings': ['Label','Switch'] },

    # ─────────── STATUS ───────────
    'ObjectStatus': {
        'validParents': ['Card','Panel','Dialog','SapTableRow','ColumnListItem','ObjectListItem',
                        'StandardListItem','FeedListItem','TimelineItem','DynamicPageTitle',
                        'DynamicPageHeader','ObjectPageHeader','MessagePopover','Toolbar',
                        'OverflowToolbar'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['ObjectIdentifier','ObjectNumber','ObjectAttribute','ObjectMarker','Tag']
    },

    # ─────────── TABLE (Table already done) ───────────
    'Column': {
        'validParents': ['Table','SapColHeader'],
        'topLevelOnly': False,
        'validChildren': ['Text','Label','Title'],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['Column']
    },
    'ColumnListItem': {
        'validParents': ['Table','SapTableRow'],
        'topLevelOnly': False,
        'validChildren': ['Text','Label','Link','Avatar','ObjectStatus','ObjectIdentifier',
                         'ObjectNumber','ObjectAttribute','ObjectMarker','Tag','Button','IconButton',
                         'MenuButton','CheckBox','Switch','Input','Select','ProgressIndicator',
                         'AvatarGroup'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','DynamicPage','Dialog','Form','Table'],
        'commonSiblings': ['ColumnListItem']
    },

    # ─────────── TYPOGRAPHY (4) ───────────
    'FormattedText': {
        'validParents': ['Panel','Card','Dialog','Popover','MessageStrip','Form','SimpleForm',
                        'ObjectPageSection','IconTabBar'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': ['ShellBar','Table'],
        'commonSiblings': ['Text','Title']
    },
    'Label': {
        'validParents': ['Form','SimpleForm','FormContainer','FormElement','Panel','Card','Dialog',
                        'Popover','Toolbar','OverflowToolbar','FilterBar','SapColHeader','SapTableRow',
                        'ColumnListItem','InputListItem','DynamicPageTitle','DynamicPageHeader',
                        'ObjectPageHeader','MessageStrip','Wizard','WizardStep','SapFormSection',
                        'IconTabBar','ObjectPageSection','*'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['Input','Select','CheckBox','RadioButton','Switch']
    },
    'Text': {
        'validParents': ['Panel','Card','Dialog','Popover','Form','SimpleForm','FormContainer',
                        'FormElement','Toolbar','OverflowToolbar','FilterBar','SapTableRow',
                        'ColumnListItem','InputListItem','DynamicPageHeader','DynamicPageTitle',
                        'ObjectPageHeader','MessageStrip','MessagePopover','Wizard','WizardStep',
                        'IconTabBar','ObjectPageSection','TimelineItem','FeedListItem','Carousel',
                        'StandardListItem','*'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['Label','Title','Link']
    },
    'Title': {
        'validParents': ['DynamicPage','DynamicPageTitle','ObjectPageLayout','ObjectPageHeader',
                        'ObjectPageSection','ObjectPageSubSection','Panel','Card','Dialog','Popover',
                        'Toolbar','OverflowToolbar','Form','SimpleForm','IconTabBar','MessageStrip',
                        'Wizard','WizardStep','SapFormSection','Carousel','Timeline','TimelineItem',
                        'Breadcrumb','*'],
        'topLevelOnly': False,
        'validChildren': [],
        'mustInclude': [],
        'mustExclude': [],
        'commonSiblings': ['Text','Label']
    },
}

# Skip components already done (the original 8)
ALREADY_DONE = {'Dialog','DynamicPage','Table','Form','FilterBar','ShellBar','SideNavigation','Panel'}

updated = 0
skipped = 0
missing = 0

for name, comp in COMPOSITIONS.items():
    if name in ALREADY_DONE:
        skipped += 1
        continue
    path = os.path.join(REG, f'{name}.json')
    if not os.path.exists(path):
        print(f'  ⚠ {name}.json not found — skipping')
        missing += 1
        continue
    j = json.load(open(path))
    j['composition'] = comp
    j['lastValidated'] = '2026-06-27'
    with open(path, 'w') as f:
        json.dump(j, f, indent=2); f.write('\n')
    updated += 1

print(f'\n=== SUMMARY ===')
print(f'Already done (skipped):  {skipped}')
print(f'Updated this pass:        {updated}')
print(f'Not found in registry:    {missing}')
print(f'Total composition rules:  {updated + skipped + (sum(1 for n in ALREADY_DONE if n in COMPOSITIONS))} of 95')

# Check which registry components STILL don't have composition rules
import sys
all_reg = {f.replace('.json','') for f in os.listdir(REG) if f.endswith('.json') and not f.startswith('_')}
still_missing = []
for n in sorted(all_reg):
    j = json.load(open(f'{REG}/{n}.json'))
    if 'composition' not in j:
        still_missing.append(n)
print(f'\nRegistry entries WITHOUT composition: {len(still_missing)}')
for n in still_missing:
    print(f'  · {n}')
