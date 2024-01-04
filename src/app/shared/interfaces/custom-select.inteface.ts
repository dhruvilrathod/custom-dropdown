import { TreeNode } from "../utility/tree/TreeNode";
import { ITreeFieldsSrcConfigurations, ITree } from "./tree.interface";

export interface IDropDownTreeConfig extends ITreeFieldsSrcConfigurations {
    isRequired?: boolean; // done
    isDisabled?: boolean; // done
    isSingularInput?: boolean; // done
    isReadonly?: boolean; // UI
    isCustomInputAllowed?: boolean; // UI
    isSearchAllowed?: boolean; // done
    isAsynchronousSearchAllowed?: boolean;
    isClientSideSearchAllowed?: boolean; // done
    isResetOptionVisible?: boolean; // UI
    isSelectAllAvailable?: boolean; // UI
    isSectionSelectionAllowed?: boolean;
    isSectionTitleVisible?: boolean;
    isMultipleLevel?: boolean; // done
    isAsynchronouslyExpandable?: boolean;
    isHierarchySelectionModificationAllowed?: boolean; // done
    minSelectCount?: number; // done
    maxSelectCount?: number; // done
    placeholderKey?: string;
    noDataMessageKey?: string;
    invalidMessageKey?: string;
}

export interface IDropdownTree extends ITree {
    config: IDropDownTreeConfig;
    validState: boolean;
    preSelectedFieldValues: TreeNode[];
    currentSelectedDataUniqueFieldValues: (string | number)[]; 
    isAllSelected: boolean;
    insert(dataUniqueFieldValue: string | number, value: any): boolean;
    selectAll(isReset?: boolean): void;
    getCurrentSelectedNodes(): Array<TreeNode>;
    findNodes(searchValue: string): TreeNode[];
    nodeSelection(dataUniqueFieldValue: string | number, selectionVal?: boolean): void;
    changeNodeDisablility(isDisabled?: boolean): void;
}

export interface IExternalDataRequest {
    originalNode?: TreeNode,
    searchVal?: string | number;
    onResult(...args: any): void;
    onError?(...args: any): void;
}

export interface IDropdownNodeChangeDetection<T = "add" | "remove" | "click" | "contextmenu"> {
    originalNode: TreeNode,
    eventType: T;
}