export interface ITreeFieldsSrcConfigurations {
    dataUniqueFieldSrc: string;
    dataVisibleNameSrc: string;
    dataTooltipSrc?: string;
    dataExpandableSrc?: string;
    dataChildrenSrc?: string;
    dataFavouriteSrc?: string;
    dataTotalDocsSrc?: string;
    dataParentUniqueIdsSrc?: string;
    dataDisabledSrc?: string;
    dataReadOnlySrc?: string;
    dataSearchFieldsSrc?: string[];
}

export interface IOperatorFunction {
    (node: ITreeNode): void;
}

export interface IStopperFunction {
    (node: ITreeNode): boolean;
}

export interface ITree {
    root: ITreeNode;
    config: ITreeFieldsSrcConfigurations;
    preOrderTraversal(node?: ITreeNode): Generator<ITreeNode>
    postOrderTraversal(node?: ITreeNode): Generator<ITreeNode>;
    insert(dataUniqueFieldValue: string | number, value: any, inheritSelectionValueFromParent?: boolean, preselectedNodes?: ITreeNode[]): boolean
    remove(key: string | number): boolean;
    findNodeFromId(dataUniqueFieldValue: string | number): ITreeNode | undefined;
}

export interface ITreeNode {
    isSelected: boolean;
    isCurrentNodeActive: boolean;
    isFavourite: boolean;
    isInvalid: boolean;
    isCustom?: boolean;
    isDisabled: boolean;
    isReadOnly: boolean;
    isExpanded: boolean;
    isChildernLoading: boolean;
    levelIndex: number;
    isPartiallySelected: boolean;
    isAllChildrenSelected: boolean;
    dataUniqueFieldValue: string | number;
    dataVisibleNameValue: string;
    dataTooltipValue: string;
    dataExpandableValue: boolean;
    dataFavouriteValue: boolean;
    dataTotalDocsValue: number;
    dataSearchFieldsValues: string[];
    children: ITreeNode[];
    originalData: any;
    parent?: ITreeNode;
    isLeaf: boolean;
    hasChildren: boolean;
}
