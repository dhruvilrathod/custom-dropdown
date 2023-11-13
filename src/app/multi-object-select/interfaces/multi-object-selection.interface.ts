export interface MultiObjectSelection {
    isRequired?: boolean;
    isDisabled?: boolean;
    minSelectCount?: number;
    maxSelectCount?: number;
    isSingularInput?: boolean;
    readOnlyChips?: boolean;
    isCustomInputAllowed?: boolean;
    isSearchAllowed?: boolean;
    isAsynchronousSearch?: boolean;
    isResetOptionVisible?: boolean;
    isSelectAllAvailable?: boolean;
    placeholderKey?: string;
    noDataMessageKey?: string;
    isMultipleLevel?: boolean;
    isAsynchronouslyExpandable?: boolean;
    isCustomAllSelectOption?: boolean,
    customAllSelectOptionUniqueId?: string | number,
    customAllSelectOptionNameKey?: string,
    [key: string]: any;
    dropDownSections: DropDownDataSection[];
}

export interface DropDownDataSection {
    isVisible?: boolean;
    isSelected?: boolean;
    allowSectionSelection?: boolean;
    sectionId?: number | string;
    sectionTooltipKey?: string;
    sectionNameKey?: string;
    dataUniqueFieldSrc?: string[];
    dataVisibleNameSrc?: string[];
    dataTooltipSrc?: string[];
    dataExpandableSrc?: string[];
    dataChildrenSrc?: string[];
    dataFavouriteSrc?: string[];
    dataTotalDocsSrc?: string[];
    dataParentUniqueIdsSrc?: string[];
    children?: DropDownDataOption[];
    [key: string]: any;
}

export interface DropDownDataOption {
    sectionId?: number | string;
    isSelected?: boolean;
    isDisabled?: boolean;
    isExpanded?: boolean;
    isSingular?: boolean;
    isChildernLoading?: boolean;
    levelIndex?: number;
    isPartiallySelected?: boolean;
    isVisible?: boolean;
    dataUniqueFieldValue?: string | number;
    dataVisibleNameValue?: any;
    dataTooltipValue?: any;
    dataExpandableValue?: boolean;
    dataFavouriteValue?: any;
    dataTotalDocsValue?: number;
    parentUniqueIdsValue?: (string | number)[];
    children?: DropDownDataOption[];
    onExpand?: Function;
    onCollaps?: Function;
    onSelect?: Function;
    onDeselect?: Function;
    [key: string]: any;
}

export interface SelectionChip {
    sectionId?: number | string;
    isDisabled?: boolean;
    canDelete?: boolean;
    isHighlighted?: boolean;
    isFavourite?: boolean;
    isActive?: boolean;
    isCustom?: boolean;
    isHidden?: boolean;
    isSingular?: boolean;
    dataUniqueFieldValue?: string | number;
    dataVisibleNameValue?: string | number;
    dataTooltipValue?: string | number;
    dataExpandableValue?: boolean;
    dataFavouriteValue?: boolean;
    dataTotalDocsValue?: number;
    parentUniqueIdsValue?: (string | number)[];
    originalData?: DropDownDataOption;
    [key: string]: any;
}

export interface DataRequester {
    preparedData: {
        sectionData?: DropDownDataSection;
        optionData?: DropDownDataOption;
        [key: string]: any
    };
    onResult: Function;
    onError?: Function;
}

export interface ChipChangeTrigger {
    data: DropDownDataSection | DropDownDataOption | SelectionChip;
    section?: DropDownDataSection
}