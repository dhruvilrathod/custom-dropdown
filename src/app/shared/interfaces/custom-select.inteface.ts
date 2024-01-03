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
    isMultipleLevel?: boolean; // done
    isAsynchronouslyExpandable?: boolean;
    isHierarchySelectionModificationAllowed?: boolean; // done
    minSelectCount?: number; // done
    maxSelectCount?: number; // done
}

export interface IDropDownTree extends ITree {
    validState: boolean;
    selectAll(isReset?: boolean): void;
    nodeSelection(dataUniqueFieldValue: string | number, selectionVal?: boolean): void;
    changeNodeDisablility(isDisabled?: boolean): void;
}

export interface IExternalDataRequest {
    originalNode?: TreeNode,
    searchVal?: string | number;
    onResult(...args: any): void;
    onError? (...args: any): void;
}

export interface IDropdownNodeChangeDetection <T = "add" | "remove" | "click" | "contextmenu"> {
    originalNode: TreeNode,
    eventType: T;
}