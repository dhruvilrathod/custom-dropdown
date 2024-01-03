import { TreeNode } from "../utility/tree/TreeNode";

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
    (node: TreeNode): void;
}

export interface IStopperFunction {
    (node: TreeNode): boolean;
}

export interface ITree {
    root: TreeNode;
    config: ITreeFieldsSrcConfigurations;
    preOrderTraversal(node?: TreeNode): Generator<TreeNode>
    postOrderTraversal(node?: TreeNode): Generator<TreeNode>;
    insert(dataUniqueFieldValue: string | number, value: any, inheritSelectionValueFromParent?: boolean, preselectedNodes?: TreeNode[]): boolean
    remove(key: string | number): boolean;
    findNodeFromId(dataUniqueFieldValue: string | number): TreeNode | undefined;
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
    children: TreeNode[];
    originalData: any;
    parent?: TreeNode;
    isLeaf: boolean;
    hasChildren: boolean;
    onExpand: Function;
    onCollaps: Function;
    onSelect: Function;
    onDeselect: Function;
}
