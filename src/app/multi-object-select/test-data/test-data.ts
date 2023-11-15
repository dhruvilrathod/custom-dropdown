import { MultiObjectSelection, DropDownDataOption, DropDownDataSection, SelectionChip } from '../interfaces/multi-object-selection.interface'; // Update with the actual paths

export const sampleData: (DropDownDataOption | DropDownDataSection)[] = [
    {
        sectionId: 'section1',
        sectionNameKey: 'Section 1',
        children: [
            {
                dataUniqueFieldValue: 'option1',
                dataVisibleNameValue: 'Option 1',
                isExpanded: false,
                isSelected: false,
            },
            {
                dataUniqueFieldValue: 'option2',
                dataVisibleNameValue: 'Option 2',
                isExpanded: false,
                isSelected: false,
            },
        ],
    },
    {
        sectionId: 'section2',
        sectionNameKey: 'Section 2',
        children: [
            {
                dataUniqueFieldValue: 'option3',
                dataVisibleNameValue: 'Option 3',
                isExpanded: false,
                isSelected: false,
            },
        ],
    },
];

export const multiObjectData: MultiObjectSelection = {
    dropDownSections: [
        {
            sectionId: 'section1',
            sectionNameKey: 'Section 1',
            children: [
                {
                    dataUniqueFieldValue: 'option1',
                    dataVisibleNameValue: 'Option 1',
                    isSelected: true,
                },
                {
                    dataUniqueFieldValue: 'option2',
                    dataVisibleNameValue: 'Option 2',
                    isSelected: false,
                },
            ],
        },
        {
            sectionId: 'section2',
            sectionNameKey: 'Section 2',
            children: [
                {
                    dataUniqueFieldValue: 'option3',
                    dataVisibleNameValue: 'Option 3',
                    isSelected: true,
                },
            ],
        },
    ],
};

// SelectionChip array
export const customChipData: SelectionChip[] = [
    {
        dataUniqueFieldValue: 'customChip1',
        dataVisibleNameValue: 'Custom Chip 1',
        isSelected: true,
    },
    {
        dataUniqueFieldValue: 'customChip2',
        dataVisibleNameValue: 'Custom Chip 2',
        isSelected: false,
    },
];

// DropDownDataOption array
export const chipData: DropDownDataOption[] = [
    {
        dataUniqueFieldValue: 'chip1',
        dataVisibleNameValue: 'Chip 1',
        isSelected: true,
    },
    {
        dataUniqueFieldValue: 'chip2',
        dataVisibleNameValue: 'Chip 2',
        isSelected: false,
    },
];


// Sample data for the interfaces
export const dropDownOption1: DropDownDataOption = {
    isSelected: false,
    dataUniqueFieldValue: 1,
    dataVisibleNameValue: 'Option 1',
};

export const dropDownOption2: DropDownDataOption = {
    isSelected: false,
    dataUniqueFieldValue: 2,
    dataVisibleNameValue: 'Option 2',
};

export const dropDownSection: DropDownDataSection = {
    isSelected: false,
    sectionId: 1,
    sectionNameKey: 'Section 1',
    children: [dropDownOption1, dropDownOption2],
};

export const selectionChip: SelectionChip = {
    dataUniqueFieldValue: 1,
    dataVisibleNameValue: 'Selected Chip',
};

export const multiObjectSelection: MultiObjectSelection = {
    isSingularInput: false,
    dropDownSections: [dropDownSection],
};