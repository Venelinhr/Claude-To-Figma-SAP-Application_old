#!/usr/bin/env python3
"""Add composition rules to 8 high-impact registry entries."""
import json, os

REG = 'knowledge/components/registry'

COMPOSITIONS = {
    'Dialog': {
        'validParents': [],
        'topLevelOnly': True,
        'validChildren': [
            'Form','SimpleForm','Panel','Table','SapColHeader','SapTableRow','List',
            'StandardListItem','ColumnListItem','MessageStrip','IllustratedMessage',
            'BusyIndicator','Button','SearchField','Input','Select','ComboBox',
            'CheckBox','RadioButton','Switch','Label','Text','Title','Wizard',
            'IconTabBar','IconTabFilter','ProgressIndicator'
        ],
        'mustInclude': ['Button'],
        'mustExclude': [
            'ShellBar','NativeSideNav','SideNavigation','DynamicPage','DynamicPageTitle',
            'DynamicPageHeader','ObjectPageLayout','FlexibleColumnLayout','UserMenu',
            'NotificationListItem','Notifications','ProductSwitch'
        ],
        'commonSiblings': []
    },
    'DynamicPage': {
        'validParents': [],
        'topLevelOnly': True,
        'validChildren': [
            'DynamicPageTitle','DynamicPageHeader','IconTabBar','OverflowToolbar',
            'Toolbar','FilterBar','SapColHeader','SapTableRow','Table','List',
            'Card','Carousel','Panel','Form','SimpleForm','MessageStrip',
            'IllustratedMessage','ProgressIndicator'
        ],
        'mustInclude': ['DynamicPageTitle'],
        'mustExclude': ['Dialog','Popover','Menu'],
        'commonSiblings': ['ShellBar','NativeSideNav']
    },
    'Table': {
        'validParents': [
            'DynamicPage','ObjectPageLayout','Panel','Card','Dialog','SapFormSection'
        ],
        'topLevelOnly': False,
        'validChildren': ['SapColHeader','SapTableRow','Column','ColumnListItem','MessageStrip'],
        'mustInclude': ['SapColHeader'],
        'mustExclude': ['ShellBar','NativeSideNav','DynamicPage','Dialog','FilterBar'],
        'commonSiblings': ['OverflowToolbar','Toolbar','FilterBar','SearchField']
    },
    'Form': {
        'validParents': [
            'DynamicPage','ObjectPageLayout','Panel','Dialog','SapFormSection',
            'Card','IconTabBar'
        ],
        'topLevelOnly': False,
        'validChildren': [
            'Label','Input','Select','ComboBox','MultiComboBox','MultiInput',
            'DatePicker','DateTimePicker','DateRangePicker','TimePicker','TextArea',
            'CheckBox','RadioButton','RadioButtonGroup','Switch','Slider','RangeSlider',
            'StepInput','FileUploader','FormContainer','FormElement','MessageStrip'
        ],
        'mustInclude': [],
        'mustExclude': ['ShellBar','NativeSideNav','DynamicPage','Table','SapTableRow'],
        'commonSiblings': ['MessageStrip','Toolbar']
    },
    'FilterBar': {
        'validParents': ['DynamicPage','ObjectPageLayout','Panel'],
        'topLevelOnly': False,
        'validChildren': [
            'Input','Select','ComboBox','MultiComboBox','DatePicker','DateRangePicker',
            'SearchField','Tokenizer','Token','Button','Label'
        ],
        'mustInclude': [],
        'mustExclude': ['ShellBar','DynamicPage','Dialog','Table','Form'],
        'commonSiblings': ['Table','SapColHeader','OverflowToolbar']
    },
    'ShellBar': {
        'validParents': [],
        'topLevelOnly': True,
        'validChildren': ['ProductSwitch','UserMenu','Notifications','SearchField'],
        'mustInclude': [],
        'mustExclude': ['DynamicPage','Dialog','Table','Form','Panel'],
        'commonSiblings': ['NativeSideNav','DynamicPage']
    },
    'SideNavigation': {
        'validParents': [],
        'topLevelOnly': True,
        'validChildren': ['NavigationItem','NavigationList','NavigationListItem'],
        'mustInclude': [],
        'mustExclude': ['DynamicPage','Dialog','Table','Form','ShellBar'],
        'commonSiblings': ['ShellBar','DynamicPage']
    },
    'Panel': {
        'validParents': [
            'DynamicPage','ObjectPageLayout','Dialog','IconTabBar','Card','SapFormSection'
        ],
        'topLevelOnly': False,
        'validChildren': ['*'],
        'mustInclude': [],
        'mustExclude': ['ShellBar','NativeSideNav','DynamicPage'],
        'commonSiblings': []
    },
}

updated = 0
for name, comp in COMPOSITIONS.items():
    path = os.path.join(REG, f'{name}.json')
    if not os.path.exists(path):
        print(f'  ✗ {name}.json not found')
        continue
    j = json.load(open(path))
    j['composition'] = comp
    j['lastValidated'] = '2026-06-27'
    with open(path, 'w') as f:
        json.dump(j, f, indent=2); f.write('\n')
    updated += 1
    print(f'  ✓ {name}.json — added composition block')

print(f'\nUpdated {updated} registry entries with composition rules.')
