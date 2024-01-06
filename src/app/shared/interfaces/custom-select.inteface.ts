import { ITreeFieldsSrcConfigurations, ITree, ITreeNode } from "./tree.interface";

export interface IDropDownTreeConfig extends ITreeFieldsSrcConfigurations {
    isRequired?: boolean;
    isDisabled?: boolean;
    isSingularInput?: boolean;
    isReadonly?: boolean;
    isCustomInputAllowed?: boolean;
    isSearchAllowed?: boolean;
    isAsynchronousSearchAllowed?: boolean;
    isClientSideSearchAllowed?: boolean;
    isResetOptionVisible?: boolean;
    isSelectAllAvailable?: boolean;
    isSectionSelectionAllowed?: boolean;
    isSectionTitleVisible?: boolean;
    isMultipleLevel?: boolean;
    isAsynchronouslyExpandable?: boolean;
    isHierarchySelectionModificationAllowed?: boolean;
    minSelectCount?: number;
    maxSelectCount?: number;
    placeholderKey?: string;
    noDataMessageKey?: string;
    invalidMessageKey?: string;
}

export interface IDropdownTree extends ITree {
    config: IDropDownTreeConfig;
    validState: boolean;
    preSelectedFieldValues: ITreeNode[];
    currentSelectedDataUniqueFieldValues: (string | number)[];
    isAllSelected: boolean;
    insert(dataUniqueFieldValue: string | number, value: any): boolean;
    selectAll(isReset?: boolean): void;
    getCurrentSelectedNodes(): Array<ITreeNode>;
    findNodes(searchValue: string): ITreeNode[];
    nodeSelection(dataUniqueFieldValue: string | number, selectionVal?: boolean): void;
    changeNodeDisablility(isDisabled?: boolean): void;
}

export interface IExternalDataRequest {
    originalNode?: ITreeNode,
    searchVal?: string | number;
    onResult(...args: any): void;
    onError?(...args: any): void;
}