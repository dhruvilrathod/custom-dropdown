import { IDropDownTreeConfig } from "../../interfaces/custom-select.inteface";
import { IOperatorFunction, IStopperFunction } from "../../interfaces/tree.interface";
import { DropdownTree } from "./DropdownTree";
import { Tree } from "./Tree";
import { TreeNode } from "./TreeNode";

export class TreeUtility {

    constructor() { }

    static propertyAccess(dataObj: any, path: string): any {

        if (!path || typeof path !== "string" || path === "" || path === null) {
            return '';
        }
        let pathArr: string[] = path.split("/");
        let value;
        if (pathArr.length === 1) {
            value = dataObj[pathArr[0]];
        }
        else {
            // value = structuredClone(dataObj); // for node > 17
            value = JSON.parse(JSON.stringify(dataObj)); // for node < 17
            for (let k = 0, pathArrLen = pathArr.length; k < pathArrLen; k++) {
                value = value[pathArr[k]];
            }
        }
        return value;
    }

    static propertyAdd(dataObj: any, path: string, value: any) {
        let pathArr: string[] = path.split("/");

        let currentLevel = dataObj;

        for (let k = 0, pathArrLen = pathArr.length; k < pathArrLen; k++) {
            if (k < pathArrLen - 1) {
                if (!currentLevel[pathArr[k]]) {
                    currentLevel[pathArr[k]] = {}
                }
                currentLevel = currentLevel[pathArr[k]];
            }
            else {
                dataObj[pathArr[k]] = value;
            }
        }

        return dataObj;
    }

    static traverseAllNodes(tree: Tree, traversalOrder: "pre-order" | "post-order" = "pre-order", operatorFunction: IOperatorFunction, startNode?: TreeNode, stopperFunction?: IStopperFunction, stopWithLastOperationPerformed = true): void {

        for (let node of traversalOrder === "post-order" ? tree.postOrderTraversal(startNode) : tree.preOrderTraversal(startNode)) {
            if (stopperFunction && stopperFunction(node)) {
                stopWithLastOperationPerformed && operatorFunction && operatorFunction(node);
                return;
            }
            operatorFunction && operatorFunction(node);
        }
    }

    static createExpliciteDropdownTreeNode(originalData: any, config: IDropDownTreeConfig, defaultSelectionValue: boolean = false): TreeNode {
        originalData.isSelected = defaultSelectionValue;
        return new TreeNode(originalData, config);
    }

    static createExpliciteDropdownTree(originalData: any, config: IDropDownTreeConfig, treeId: string | number): DropdownTree {
        return new DropdownTree(config, originalData);
    }
}
