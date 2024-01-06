import { ITree, ITreeFieldsSrcConfigurations } from "../../interfaces/tree.interface";
import { TreeNode } from "./TreeNode";
import { TreeUtility } from "./TreeUtility";

export class Tree implements ITree {

    root: TreeNode;
    config: ITreeFieldsSrcConfigurations;

    constructor(config: ITreeFieldsSrcConfigurations, rootValue: any) {

        this.config = config;

        this.root = new TreeNode(rootValue, config);
    }

    *preOrderTraversal(node = this.root): Generator<TreeNode> {
        yield node;
        if (node.children.length) {
            for (let child of node.children) {
                yield* this.preOrderTraversal(child);
            }
        }
    }

    *postOrderTraversal(node = this.root): Generator<TreeNode> {
        if (node.children.length) {
            for (let child of node.children) {
                yield* this.postOrderTraversal(child);
            }
        }
        yield node;
    }

    insert(dataUniqueFieldValue: string | number, value: any, inheritValuesFromParent: boolean = false, preselectedNodes?: TreeNode[]): boolean {

        for (let node of this.preOrderTraversal()) {

            if (node.dataUniqueFieldValue === dataUniqueFieldValue) {

                let childNode = new TreeNode(value, this.config, node);
                let preSelectedNodeIndex: number = -1;

                if (preselectedNodes && preselectedNodes.length > 0) {

                    preSelectedNodeIndex = preselectedNodes.findIndex((val) => val.dataUniqueFieldValue === childNode.dataUniqueFieldValue);
                    if (preSelectedNodeIndex > -1) {
                        childNode.isSelected = preselectedNodes[preSelectedNodeIndex].isSelected;
                        preselectedNodes.splice(preSelectedNodeIndex, 1);
                    }
                }

                if (inheritValuesFromParent) {

                    if (preSelectedNodeIndex === -1) {
                        childNode.isSelected = node.isSelected;

                        if (node.isDisabled) {
                            childNode.isDisabled = node.isDisabled;
                        }
                    }


                    if (node.isAllChildrenSelected) {
                        node.isSelected = true;
                    }

                }

                node.children.push(childNode);
                return true;
            }
        }
        return false;
    }

    remove(key: string | number): boolean {
        for (let node of this.preOrderTraversal()) {
            const filtered = node.children.filter(c => c.dataUniqueFieldValue !== key);
            if (filtered.length !== node.children.length) {
                node.children = filtered;
                return true;
            }
        }
        return false;
    }

    findNodeFromId(dataUniqueFieldValue: string | number): TreeNode | undefined {
        for (let node of this.preOrderTraversal()) {
            if (node.dataUniqueFieldValue === dataUniqueFieldValue) return node;
        }
        return undefined;
    }

    findNodes(searchValue: string): TreeNode[] {

        if (!searchValue || typeof searchValue !== "string" || searchValue === "" || searchValue === null) {
            return [];
        }

        let searchNodes: TreeNode[] = [];
        const searchQuery = searchValue.toString().toLowerCase().trim();

        for (let node of this.preOrderTraversal()) {
            let dataSearchFieldsValuesLen = node.dataSearchFieldsValues.length;
            if (dataSearchFieldsValuesLen === 0) {
                node.dataSearchFieldsValues.push(this.config.dataVisibleNameSrc);
                dataSearchFieldsValuesLen++;
            }
            if (dataSearchFieldsValuesLen > 0 && node.levelIndex !== undefined && node.levelIndex > 0) {
                for (let i = 0; i < dataSearchFieldsValuesLen; i++) {

                    let accessedValue = TreeUtility.propertyAccess(node.originalData, node.dataSearchFieldsValues[i])?.toString().toLowerCase().trim();
                    if (!(!accessedValue || typeof accessedValue !== "string" || accessedValue === "" || accessedValue === null) && accessedValue.includes(searchQuery)) {
                        searchNodes.push(node);
                        break;
                    }
                }
            }
        }

        return searchNodes;
    }
}
