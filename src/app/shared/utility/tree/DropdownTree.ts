import { IDropDownTree, IDropDownTreeConfig } from "../../interfaces/custom-select.inteface";
import { Tree } from "./Tree";
import { TreeNode } from "./TreeNode";
import { TreeUtility } from "./TreeUtility";

export class DropdownTree extends Tree implements IDropDownTree {

    config: IDropDownTreeConfig;
    preSelectedDataUniqueFieldValues: TreeNode[];

    constructor(config: IDropDownTreeConfig, rootValue: any, preSelectedDataUniqueFieldValues?: TreeNode[]) {
        super(config, rootValue);

        this.config = config;

        this.config.isRequired = config.isRequired !== undefined ? config.isRequired : false;
        this.config.isDisabled = config.isDisabled !== undefined ? config.isDisabled : false;
        this.config.isSingularInput = config.isSingularInput !== undefined ? config.isSingularInput : false;
        this.config.isReadonly = config.isReadonly !== undefined ? config.isReadonly : false;
        this.config.isCustomInputAllowed = config.isCustomInputAllowed !== undefined ? config.isCustomInputAllowed : false;
        this.config.isSearchAllowed = config.isSearchAllowed !== undefined ? config.isSearchAllowed : true;
        this.config.isAsynchronousSearchAllowed = config.isAsynchronousSearchAllowed !== undefined ? config.isAsynchronousSearchAllowed : false;
        this.config.isClientSideSearchAllowed = config.isClientSideSearchAllowed !== undefined ? config.isClientSideSearchAllowed : true;
        this.config.isResetOptionVisible = config.isResetOptionVisible !== undefined ? config.isResetOptionVisible : false;
        this.config.isSelectAllAvailable = config.isSelectAllAvailable !== undefined ? config.isSelectAllAvailable : false;
        this.config.isMultipleLevel = config.isMultipleLevel !== undefined ? config.isMultipleLevel : true;
        this.config.isAsynchronouslyExpandable = config.isAsynchronouslyExpandable !== undefined ? config.isAsynchronouslyExpandable : false;
        this.config.isHierarchySelectionModificationAllowed = config.isHierarchySelectionModificationAllowed !== undefined ? config.isHierarchySelectionModificationAllowed : false;
        this.config.minSelectCount = config.minSelectCount !== undefined ? config.minSelectCount : 1;
        this.config.maxSelectCount = config.maxSelectCount !== undefined ? config.maxSelectCount : -1;

        this.preSelectedDataUniqueFieldValues = preSelectedDataUniqueFieldValues || [];
        if (this.config.maxSelectCount > -1 && this.config.maxSelectCount < this.config.minSelectCount) {
            this.config.minSelectCount = this.config.maxSelectCount;
        }

        if (this.config.isRequired) {
            this.config.minSelectCount = 1;
        }

        if (this.config.isSingularInput) {
            this.config.minSelectCount = 1;
            this.config.maxSelectCount = 1;
        }
    }

    public get validState(): boolean {
        let currentSelectedNodesLen = this.getCurrentSelectedNodes().length;
        return (this.config.minSelectCount !== undefined && this.config.maxSelectCount !== undefined) && currentSelectedNodesLen >= this.config.minSelectCount && currentSelectedNodesLen <= this.config.maxSelectCount;
    }

    public get isAllSelected(): boolean {
        let isAllSelected: boolean = true;

        TreeUtility.traverseAllNodes(this, "pre-order", (node: TreeNode) => {
            isAllSelected = isAllSelected && ((node.isDisabled === false && node.isSelected === true) || (node.isDisabled === true));
        }, this.root, (node: TreeNode) => isAllSelected === false);

        return isAllSelected;
    }

    public insert(dataUniqueFieldValue: string | number, value: any): boolean {
        if (this.config.isMultipleLevel === true) {
            return super.insert(dataUniqueFieldValue, value, this.config.isHierarchySelectionModificationAllowed, this.preSelectedDataUniqueFieldValues);
        }
        else {
            let currentNode: TreeNode | undefined = this.findNodeFromId(dataUniqueFieldValue);

            if (currentNode && currentNode.levelIndex !== undefined && currentNode.levelIndex === 0) {
                return super.insert(dataUniqueFieldValue, value, this.config.isHierarchySelectionModificationAllowed, this.preSelectedDataUniqueFieldValues);
            }
            else {
                return false;
            }
        }
    }

    public selectAll(isReset: boolean = false): void {
        TreeUtility.traverseAllNodes(this, "pre-order", (node: TreeNode) => {
            !(this.config.isDisabled || node?.isDisabled) && (node.isSelected = !isReset);
        });
    }

    public getCurrentSelectedNodes(): Array<TreeNode> {
        let selectedNodes: TreeNode[] = [];

        TreeUtility.traverseAllNodes(this, "pre-order", (node: TreeNode) => {
            if (!this.config.isHierarchySelectionModificationAllowed && node.levelIndex !== undefined && node.levelIndex > 0 && node.isSelected === true) {
                selectedNodes.push(node);
            }
            else if (this.config.isHierarchySelectionModificationAllowed && node.levelIndex !== undefined && node.levelIndex > 0 && node.isAllChildrenSelected === true) {

                selectedNodes.push(node);
            }
            else if (this.config.isHierarchySelectionModificationAllowed && node.levelIndex !== undefined && node.levelIndex === 0 && node.isAllChildrenSelected === true) {
                selectedNodes.push(...this.root.children);
            }
        }, undefined, (node: TreeNode) => this.config.isHierarchySelectionModificationAllowed === true && node.isAllChildrenSelected === true);

        return selectedNodes;
    }

    public nodeSelection(dataUniqueFieldValue: string | number, selectionVal: boolean = true): void {

        let currentNode = this.findNodeFromId(dataUniqueFieldValue);

        if (this.config.isDisabled || currentNode?.isDisabled) {
            return;
        }

        if (currentNode) {

            if (selectionVal && this.config.maxSelectCount !== undefined && this.config.maxSelectCount > -1 && (this.getCurrentSelectedNodes().length === this.config.maxSelectCount)) {
                let removedNode: TreeNode | undefined = this.getCurrentSelectedNodes().pop();
                if (removedNode) {
                    this.nodeSelection(removedNode.dataUniqueFieldValue, false);
                }
            }

            !(this.config.isDisabled || currentNode?.isDisabled) && (currentNode.isSelected = selectionVal);

            if (this.config.isHierarchySelectionModificationAllowed) {
                TreeUtility.traverseAllNodes(this, "pre-order", (node: TreeNode) => {
                    !(this.config.isDisabled || node?.isDisabled) && (node.isSelected = selectionVal);
                }, currentNode);

                TreeUtility.traverseAllNodes(this, "post-order", (node: TreeNode) => {
                    node.isSelected = node.children.length > 0 ? node.children.some((val: TreeNode) => val.isSelected === false && val.isDisabled === false) ? false : true : node.isSelected;
                });
            }
        }
    }

    public findNodes(searchValue: string): TreeNode[] {
        if (this.config.isSearchAllowed) {
            if (this.config.isClientSideSearchAllowed) {
                return super.findNodes(searchValue);
            }
            if (this.config.isAsynchronousSearchAllowed) {
                return super.findNodes(searchValue); // TODO: write for aync logic
            }
        }
        return [];
    }

    public changeNodeDisablility(isDisabled: boolean = true): void {
        TreeUtility.traverseAllNodes(this, "pre-order", (node: TreeNode) => {
            node.isDisabled = isDisabled;
        });
    }

}