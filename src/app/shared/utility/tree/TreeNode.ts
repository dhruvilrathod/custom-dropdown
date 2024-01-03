import { ITreeFieldsSrcConfigurations, ITreeNode } from "../../interfaces/tree.interface";
import { TreeUtility } from "./TreeUtility";

export class TreeNode implements ITreeNode {

    isSelected: boolean;
    isDisabled: boolean;
    isReadOnly: boolean;
    isExpanded: boolean;
    isCurrentNodeActive: boolean;
    isFavourite: boolean;
    isInvalid: boolean;
    isChildernLoading: boolean;
    levelIndex: number;
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

    onExpand!: Function;
    onCollaps!: Function;
    onSelect!: Function;
    onDeselect!: Function;

    constructor(value: any, config: ITreeFieldsSrcConfigurations, parent?: TreeNode, levelIndex: number = 0) {

        // fields which are related to identity of the node, possibly acquiring no changes at runtime
        this.isDisabled = config.dataDisabledSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataDisabledSrc) || false : false;
        this.isReadOnly = config.dataReadOnlySrc !== undefined ? TreeUtility.propertyAccess(value, config.dataReadOnlySrc) || false : false;
        this.isFavourite = config.dataFavouriteSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataFavouriteSrc) || false : false;
        this.dataUniqueFieldValue = TreeUtility.propertyAccess(value, config.dataUniqueFieldSrc) || "";
        this.dataVisibleNameValue = TreeUtility.propertyAccess(value, config.dataVisibleNameSrc) || "";
        this.dataTooltipValue = config.dataTooltipSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataTooltipSrc) || "" : TreeUtility.propertyAccess(value, config.dataVisibleNameSrc) || "";
        this.dataExpandableValue = config.dataExpandableSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataExpandableSrc) || false : false;
        this.dataFavouriteValue = config.dataFavouriteSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataFavouriteSrc) || false : false;
        this.dataTotalDocsValue = config.dataTotalDocsSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataTotalDocsSrc) || 0 : 0;
        this.dataSearchFieldsValues = config.dataSearchFieldsSrc && config.dataSearchFieldsSrc.length > 0 ? config.dataSearchFieldsSrc : [];
        this.originalData = value;

        // fields which are used to manage UI states and functionalities at the runtime
        this.isSelected = value.isSelected || false;
        this.isCurrentNodeActive = value.isCurrentNodeActive || false;
        this.isInvalid = value.isInvalid || false;
        this.isExpanded = value.isExpanded || false;
        this.isChildernLoading = value.isChildernLoading || false;
        this.levelIndex = parent && parent.levelIndex !== undefined ? parent.levelIndex + 1 : levelIndex;
        this.parent = parent;
        this.children = [];
    }

    get isLeaf(): boolean {
        return this.children.length === 0;
    }

    get hasChildren(): boolean {
        return !this.isLeaf;
    }

    get isPartiallySelected(): boolean {
        return this.children.length > 0 ? this.children.some((val: TreeNode) => val.isSelected === false) && this.children.reduce<boolean>((acc: boolean, val: TreeNode) => val.isSelected !== undefined ? val.isSelected || acc : false, false) : false;
    }

    get isAllChildrenSelected(): boolean {
        return this.children.length > 0 ? this.children.some((val: TreeNode) => val.isSelected === false) ? false : true : false;
    }
}
