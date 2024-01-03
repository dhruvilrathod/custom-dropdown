// interface ITreeFieldsSrcConfigurations {
//     dataUniqueFieldSrc: string;
//     dataVisibleNameSrc: string;
//     dataTooltipSrc?: string;
//     dataExpandableSrc?: string;
//     dataChildrenSrc?: string;
//     dataFavouriteSrc?: string;
//     dataTotalDocsSrc?: string;
//     dataParentUniqueIdsSrc?: string;
//     dataDisabledSrc?: string;
//     dataReadOnlySrc?: string;
//     dataSearchFieldsSrc?: string[];
// }

// interface IOperatorFunction {
//     (node: TreeNode): void;
// }

// interface IStopperFunction {
//     (node: TreeNode): boolean;
// }

// interface ITree {
//     root: TreeNode;
//     config: ITreeFieldsSrcConfigurations;
//     preOrderTraversal(node?: TreeNode): Generator<TreeNode>
//     postOrderTraversal(node?: TreeNode): Generator<TreeNode>;
//     insert(dataUniqueFieldValue: string | number, value: any, inheritSelectionValueFromParent?: boolean, preselectedNodes?: TreeNode[]): boolean
//     remove(key: string | number): boolean;
//     findNodeFromId(dataUniqueFieldValue: string | number): TreeNode | undefined;
// }

// interface IDropDownTreeConfig extends ITreeFieldsSrcConfigurations {
//     isRequired?: boolean; // done
//     isDisabled?: boolean; // done
//     isSingularInput?: boolean; // done
//     isReadonly?: boolean; // UI
//     isCustomInputAllowed?: boolean; // UI
//     isSearchAllowed?: boolean; // done
//     isAsynchronousSearchAllowed?: boolean;
//     isClientSideSearchAllowed?: boolean; // done
//     isResetOptionVisible?: boolean; // UI
//     isSelectAllAvailable?: boolean; // UI
//     isMultipleLevel?: boolean; // done
//     isSectionSelectionAllowed?: boolean;
//     isSectionTitleVisible?: boolean;
//     isAsynchronouslyExpandable?: boolean;
//     isHierarchySelectionModificationAllowed?: boolean; // done
//     minSelectCount?: number; // done
//     maxSelectCount?: number; // done
// }

// interface IDropDownTree extends ITree {
//     validState: boolean;
//     selectAll(isReset?: boolean): void;
//     nodeSelection(dataUniqueFieldValue: string | number, selectionVal?: boolean): void;
//     changeNodeDisablility(isDisabled?: boolean): void;
// }

// interface ITreeNode {
//     isSelected?: boolean;
//     isDisabled?: boolean;
//     isActive: boolean;
//     isFavourite: boolean;
//     isInvalid: boolean;
//     isReadOnly?: boolean;
//     isExpanded?: boolean;
//     isChildernLoading?: boolean;
//     levelIndex?: number;
//     isPartiallySelected?: boolean;
//     isAllChildrenSelected?: boolean;
//     dataUniqueFieldValue: string | number;
//     dataVisibleNameValue: string;
//     dataTooltipValue?: string;
//     dataExpandableValue?: boolean;
//     dataFavouriteValue?: boolean;
//     dataTotalDocsValue?: number;
//     dataSearchFieldsValues: string[];
//     children: TreeNode[];
//     originalData?: any;
//     parent?: TreeNode;
//     isLeaf: boolean;
//     hasChildren: boolean;
//     onExpand: Function;
//     onCollaps: Function;
//     onSelect: Function;
//     onDeselect: Function;
// }

// class TreeNode implements ITreeNode {

//     isSelected?: boolean;
//     isDisabled?: boolean;
//     isActive: boolean;
//     isFavourite: boolean;
//     isInvalid: boolean;
//     isReadOnly?: boolean;
//     isExpanded?: boolean;
//     isChildernLoading?: boolean;
//     levelIndex?: number;
//     dataUniqueFieldValue: string | number;
//     dataVisibleNameValue: string;
//     dataTooltipValue?: string;
//     dataExpandableValue?: boolean;
//     dataFavouriteValue?: boolean;
//     dataTotalDocsValue?: number;
//     dataSearchFieldsValues: string[];
//     children: TreeNode[];
//     originalData?: any;
//     parent?: TreeNode;

//     onExpand!: Function;
//     onCollaps!: Function;
//     onSelect!: Function;
//     onDeselect!: Function;

//     constructor(value: any, config: ITreeFieldsSrcConfigurations, parent?: TreeNode, levelIndex: number = 0) {

//         // fields which are related to identity of the node, possibly acquiring no changes at runtime
//         this.isDisabled = config.dataDisabledSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataDisabledSrc) || false : false;
//         this.isReadOnly = config.dataReadOnlySrc !== undefined ? TreeUtility.propertyAccess(value, config.dataReadOnlySrc) || false : false;
//         this.isFavourite = config.dataFavouriteSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataFavouriteSrc) || false : false;
//         this.dataUniqueFieldValue = TreeUtility.propertyAccess(value, config.dataUniqueFieldSrc) || "";
//         this.dataVisibleNameValue = TreeUtility.propertyAccess(value, config.dataVisibleNameSrc) || "";
//         this.dataTooltipValue = config.dataTooltipSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataTooltipSrc) || "" : TreeUtility.propertyAccess(value, config.dataVisibleNameSrc) || "";
//         this.dataExpandableValue = config.dataExpandableSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataExpandableSrc) || false : false;
//         this.dataFavouriteValue = config.dataFavouriteSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataFavouriteSrc) || false : false;
//         this.dataTotalDocsValue = config.dataTotalDocsSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataTotalDocsSrc) || 0 : 0;
//         this.dataSearchFieldsValues = config.dataSearchFieldsSrc && config.dataSearchFieldsSrc.length > 0 ? config.dataSearchFieldsSrc : [];
//         this.originalData = value;

//         // fields which are used to manage UI states and functionalities at the runtime
//         this.isSelected = value.isSelected || false;
//         this.isActive = value.isActive || false;
//         this.isInvalid = value.isInvalid || false;
//         this.isExpanded = value.isExpanded || false;
//         this.isChildernLoading = value.isChildernLoading || false;
//         this.levelIndex = parent && parent.levelIndex !== undefined ? parent.levelIndex + 1 : levelIndex;
//         this.parent = parent;
//         this.children = [];
//     }

//     get isLeaf(): boolean {
//         return this.children.length === 0;
//     }

//     get hasChildren(): boolean {
//         return !this.isLeaf;
//     }

//     get isPartiallySelected(): boolean {
//         return this.children.length > 0 ? this.children.some((val: TreeNode) => val.isSelected === false) && this.children.reduce<boolean>((acc: boolean, val: TreeNode) => val.isSelected !== undefined ? val.isSelected || acc : false, false) : false;
//     }

//     get isAllChildrenSelected(): boolean {
//         return this.children.length > 0 ? this.children.some((val: TreeNode) => val.isSelected === false) ? false : true : false;
//     }
// }

// class Tree implements ITree {

//     root: TreeNode;
//     config: ITreeFieldsSrcConfigurations;

//     constructor(config: ITreeFieldsSrcConfigurations, rootValue: any) {

//         this.config = config;

//         this.root = new TreeNode(rootValue, config);
//     }

//     *preOrderTraversal(node = this.root): Generator<TreeNode> {
//         yield node;
//         if (node.children.length) {
//             for (let child of node.children) {
//                 yield* this.preOrderTraversal(child);
//             }
//         }
//     }

//     *postOrderTraversal(node = this.root): Generator<TreeNode> {
//         if (node.children.length) {
//             for (let child of node.children) {
//                 yield* this.postOrderTraversal(child);
//             }
//         }
//         yield node;
//     }

//     insert(dataUniqueFieldValue: string | number, value: any, inheritValuesFromParent: boolean = false, preselectedNodes?: TreeNode[]): boolean {
//         for (let node of this.preOrderTraversal()) {
//             if (node.dataUniqueFieldValue === dataUniqueFieldValue) {
//                 let childNode = new TreeNode(value, this.config, node);

//                 if (preselectedNodes && preselectedNodes.length > 0) {

//                     let preSelectedNodeIndex: number = preselectedNodes.findIndex((val) => val.dataUniqueFieldValue === childNode.dataUniqueFieldValue);
//                     if (preSelectedNodeIndex > -1) {
//                         preselectedNodes.splice(preSelectedNodeIndex, 1);
//                         childNode.isSelected = true;
//                     }
//                 }

//                 if (inheritValuesFromParent) {
//                     childNode.isSelected = node.isSelected;
//                     if (node.isDisabled) {
//                         childNode.isDisabled = node.isDisabled;
//                     }
//                 }

//                 node.children.push(childNode);
//                 return true;
//             }
//         }
//         return false;
//     }

//     remove(key: string | number): boolean {
//         for (let node of this.preOrderTraversal()) {
//             const filtered = node.children.filter(c => c.dataUniqueFieldValue !== key);
//             if (filtered.length !== node.children.length) {
//                 node.children = filtered;
//                 return true;
//             }
//         }
//         return false;
//     }

//     findNodeFromId(dataUniqueFieldValue: string | number): TreeNode | undefined {
//         for (let node of this.preOrderTraversal()) {
//             if (node.dataUniqueFieldValue === dataUniqueFieldValue) return node;
//         }
//         return undefined;
//     }

//     findNodes(searchValue: string): TreeNode[] {

//         if (!searchValue || typeof searchValue !== "string" || searchValue === "" || searchValue === null) {
//             return [];
//         }

//         let searchNodes: TreeNode[] = [];
//         const searchQuery = searchValue.toString().toLowerCase().trim();

//         for (let node of this.preOrderTraversal()) {
//             let dataSearchFieldsValuesLen = node.dataSearchFieldsValues.length;
//             if (dataSearchFieldsValuesLen > 0 && node.levelIndex !== undefined && node.levelIndex > 0) {
//                 for (let i = 0; i < dataSearchFieldsValuesLen; i++) {

//                     let accessedValue = TreeUtility.propertyAccess(node.originalData, node.dataSearchFieldsValues[i]).toString().toLowerCase().trim();
//                     if (!(!accessedValue || typeof accessedValue !== "string" || accessedValue === "" || accessedValue === null) && accessedValue.includes(searchQuery)) {
//                         searchNodes.push(node);
//                         break;
//                     }
//                 }
//             }
//         }

//         return searchNodes;
//     }
// }

// class TreeUtility {

//     constructor() { }

//     static propertyAccess(dataObj: any, path: string): any {

//         if (!path || typeof path !== "string" || path === "" || path === null) {
//             return '';
//         }
//         let pathArr: string[] = path.split("/");
//         let value;
//         if (pathArr.length === 1) {
//             value = dataObj[pathArr[0]];
//         }
//         else {
//             // value = structuredClone(dataObj); // for node > 17
//             value = JSON.parse(JSON.stringify(dataObj)); // for node < 17
//             for (let k = 0, pathArrLen = pathArr.length; k < pathArrLen; k++) {
//                 value = value[pathArr[k]];
//             }
//         }
//         return value;
//     }

//     static traverseAllNodes(tree: Tree, traversalOrder: "pre-order" | "post-order" = "pre-order", operatorFunction: IOperatorFunction, startNode?: TreeNode, stopperFunction?: IStopperFunction, stopWithLastOperationPerformed = true): void {

//         for (let node of traversalOrder === "post-order" ? tree.postOrderTraversal(startNode) : tree.preOrderTraversal(startNode)) {
//             if (stopperFunction && stopperFunction(node)) {
//                 stopWithLastOperationPerformed && operatorFunction && operatorFunction(node);
//                 return;
//             }
//             operatorFunction && operatorFunction(node);
//         }
//     }

//     static createExpliciteDropdownTreeNode(originalData: any, config: IDropDownTreeConfig, defaultSelectionValue: boolean = false): TreeNode {
//         originalData.isSelected = defaultSelectionValue;
//         return new TreeNode(originalData, config);
//     }

//     static createExpliciteDropdownTree(originalData: any, config: IDropDownTreeConfig, treeId: string | number): DropdownTree {
//         return new DropdownTree(config, originalData);
//     }
// }

// class DropdownTree extends Tree implements IDropDownTree {

//     config: IDropDownTreeConfig;
//     preSelectedDataUniqueFieldValues: TreeNode[];

//     constructor(config: IDropDownTreeConfig, rootValue: any, preSelectedDataUniqueFieldValues?: TreeNode[]) {
//         super(config, rootValue);

//         this.config = config;

//         this.config.isRequired = config.isRequired !== undefined ? config.isRequired : false;
//         this.config.isDisabled = config.isDisabled !== undefined ? config.isDisabled : false;
//         this.config.isSingularInput = config.isSingularInput !== undefined ? config.isSingularInput : false;
//         this.config.isReadonly = config.isReadonly !== undefined ? config.isReadonly : false;
//         this.config.isCustomInputAllowed = config.isCustomInputAllowed !== undefined ? config.isCustomInputAllowed : false;
//         this.config.isSearchAllowed = config.isSearchAllowed !== undefined ? config.isSearchAllowed : true;
//         this.config.isAsynchronousSearchAllowed = config.isAsynchronousSearchAllowed !== undefined ? config.isAsynchronousSearchAllowed : false;
//         this.config.isClientSideSearchAllowed = config.isClientSideSearchAllowed !== undefined ? config.isClientSideSearchAllowed : true;
//         this.config.isResetOptionVisible = config.isResetOptionVisible !== undefined ? config.isResetOptionVisible : false;
//         this.config.isSelectAllAvailable = config.isSelectAllAvailable !== undefined ? config.isSelectAllAvailable : false;
//         this.config.isMultipleLevel = config.isMultipleLevel !== undefined ? config.isMultipleLevel : true;
//         this.config.isSectionSelectionAllowed = config.isSectionSelectionAllowed !== undefined ? config.isSectionSelectionAllowed : false;
//         this.config.isSectionTitleVisible = config.isSectionTitleVisible !== undefined ? config.isSectionTitleVisible : true;
//         this.config.isAsynchronouslyExpandable = config.isAsynchronouslyExpandable !== undefined ? config.isAsynchronouslyExpandable : false;
//         this.config.isHierarchySelectionModificationAllowed = config.isHierarchySelectionModificationAllowed !== undefined ? config.isHierarchySelectionModificationAllowed : false;
//         this.config.minSelectCount = config.minSelectCount !== undefined ? config.minSelectCount : 1;
//         this.config.maxSelectCount = config.maxSelectCount !== undefined ? config.maxSelectCount : -1;

//         this.preSelectedDataUniqueFieldValues = preSelectedDataUniqueFieldValues || [];
//         if (this.config.maxSelectCount > -1 && this.config.maxSelectCount < this.config.minSelectCount) {
//             this.config.minSelectCount = this.config.maxSelectCount;
//         }

//         if (this.config.isRequired) {
//             this.config.minSelectCount = 1;
//         }

//         if (this.config.isSingularInput) {
//             this.config.minSelectCount = 1;
//             this.config.maxSelectCount = 1;
//         }
//     }

//     public get validState(): boolean {
//         let currentSelectedNodesLen = this.getCurrentSelectedNodes().length;
//         return (this.config.minSelectCount !== undefined && this.config.maxSelectCount !== undefined) && currentSelectedNodesLen >= this.config.minSelectCount && currentSelectedNodesLen <= this.config.maxSelectCount;
//     }

//     public get isAllSelected(): boolean {
//         let isAllSelected: boolean = true;

//         TreeUtility.traverseAllNodes(this, "pre-order", (node: TreeNode) => {
//             isAllSelected = isAllSelected && ((node.isDisabled === false && node.isSelected === true) || (node.isDisabled === true));
//         }, this.root, (node: TreeNode) => isAllSelected === false);

//         return isAllSelected;
//     }

//     public insert(dataUniqueFieldValue: string | number, value: any): boolean {
//         if (this.config.isMultipleLevel === true) {
//             return super.insert(dataUniqueFieldValue, value, this.config.isHierarchySelectionModificationAllowed, this.preSelectedDataUniqueFieldValues);
//         }
//         else {
//             let currentNode: TreeNode | undefined = this.findNodeFromId(dataUniqueFieldValue);

//             if (currentNode && currentNode.levelIndex !== undefined && currentNode.levelIndex === 0) {
//                 return super.insert(dataUniqueFieldValue, value, this.config.isHierarchySelectionModificationAllowed, this.preSelectedDataUniqueFieldValues);
//             }
//             else {
//                 return false;
//             }
//         }
//     }

//     public selectAll(isReset: boolean = false): void {

//         if (this.config.isSectionSelectionAllowed) {
//             this.root.isSelected = !isReset;
//         }

//         TreeUtility.traverseAllNodes(this, "pre-order", (node: TreeNode) => {
//             !(this.config.isDisabled || node?.isDisabled) && (node.isSelected = !isReset);
//         });
//     }

//     public getCurrentSelectedNodes(): Array<TreeNode> {
//         let selectedNodes: TreeNode[] = [];

//         TreeUtility.traverseAllNodes(this, "pre-order", (node: TreeNode) => {

//             if (!this.config.isHierarchySelectionModificationAllowed && node.levelIndex !== undefined && node.levelIndex > 0 && node.isSelected === true) {
//                 selectedNodes.push(node);
//             }

//             else if (this.config.isHierarchySelectionModificationAllowed && node.levelIndex !== undefined && node.levelIndex > 0) {

//                 if (node.children.length > 0 && node.isAllChildrenSelected === true && node.isSelected === true) {
//                     node.children.forEach((val: TreeNode) => {
//                         let deleteIndex = selectedNodes.indexOf(val);
//                         deleteIndex > -1 && selectedNodes.splice(deleteIndex, 1);
//                     });
//                     selectedNodes.push(node);
//                 }

//                 else if (node.children.length === 0 && node.isSelected === true && node.parent && node.parent.isAllChildrenSelected === false) {
//                     selectedNodes.push(node);
//                 }
//             }

//             else if (this.config.isHierarchySelectionModificationAllowed && node.levelIndex !== undefined && node.levelIndex === 0 && node.isAllChildrenSelected === true) {
//                 selectedNodes.push(...this.root.children);
//             }
//         }, undefined, (node: TreeNode) => this.config.isHierarchySelectionModificationAllowed === true && node.isAllChildrenSelected === true && node.parent !== undefined && node.parent.isAllChildrenSelected === true);

//         return selectedNodes;
//     }

//     public nodeSelection(dataUniqueFieldValue: string | number, selectionVal: boolean = true): void {

//         let currentNode = this.findNodeFromId(dataUniqueFieldValue);

//         if (this.config.isDisabled || currentNode?.isDisabled) {
//             return;
//         }

//         if (currentNode) {

//             if (selectionVal && this.config.maxSelectCount !== undefined && this.config.maxSelectCount > -1 && (this.getCurrentSelectedNodes().length === this.config.maxSelectCount)) {
//                 let removedNode: TreeNode | undefined = this.getCurrentSelectedNodes().pop();
//                 if (removedNode) {
//                     this.nodeSelection(removedNode.dataUniqueFieldValue, false);
//                 }
//             }

//             !(this.config.isDisabled || currentNode?.isDisabled) && (currentNode.isSelected = selectionVal);

//             if (this.config.isHierarchySelectionModificationAllowed) {
//                 TreeUtility.traverseAllNodes(this, "pre-order", (node: TreeNode) => {
//                     console.log("->>", node.dataUniqueFieldValue, node.isDisabled);
//                     !(this.config.isDisabled || node?.isDisabled) && (node.isSelected = selectionVal);
//                 }, currentNode);

//                 TreeUtility.traverseAllNodes(this, "post-order", (node: TreeNode) => {
//                     node.isSelected = node.children.length > 0 ? node.children.some((val: TreeNode) => val.isSelected === false && val.isDisabled === false) ? false : true : node.isSelected;
//                 });
//             }
//         }
//     }

//     public findNodes(searchValue: string): TreeNode[] {
//         if (this.config.isSearchAllowed) {
//             if (this.config.isClientSideSearchAllowed) {
//                 return super.findNodes(searchValue);
//             }
//             if (this.config.isAsynchronousSearchAllowed) {
//                 return super.findNodes(searchValue); // write for aync logic
//             }
//         }
//         return [];
//     }

//     public changeNodeDisablility(isDisabled: boolean = true): void {
//         TreeUtility.traverseAllNodes(this, "pre-order", (node: TreeNode) => {
//             node.isDisabled = isDisabled;
//         });
//     }
// }

// let data: any[] = [
//     {
//         folder_id: "1",
//         folderName: "aaa",
//         folderPath: "myFolder/ff-asssffdf",
//     },
//     {
//         folder_id: "2",
//         folderName: "bbb sdffsd",
//         folderPath: "myFolder/ff-asssffdf",
//     }
// ];

// let data1: any[] = [
//     {
//         folder_id: "11",
//         folderName: "1aaa daddcc",
//         folderPath: "myFolder/ff-dfdfd",
//     }
// ];

// let preselectedData: any[] = [
//     {
//         resourceId: "111",
//         resourceName: "aaa",
//     },
//     {
//         resourceId: "2",
//         resourceName: "bbb sdffsd",
//     }
// ];

// let data11: any[] = [
//     {
//         folder_id: "111",
//         folderName: "11aaa dffrfrf",
//         folderPath: "myFolder/ff-sdfsd",
//         // isRecordDisabled: true
//     },
//     {
//         folder_id: "112",
//         folderName: "112aaa dffrfrf",
//         folderPath: "myFolder/ff-sdfsd",
//     }
// ];

// let data2: any[] = [
//     {
//         folder_id: "21",
//         folderName: "2aaa ffgfgf",
//         folderPath: "myFolder/ff-fffffff",
//     },
//     {
//         folder_id: "22",
//         folderName: "2bbb ffgnfjgnbf",
//         folderPath: "myFolder/ff-fffff",
//     }
// ];


// let mySectionConfig: IDropDownTreeConfig = {
//     dataUniqueFieldSrc: "folder_id",
//     dataVisibleNameSrc: "folderName",
//     dataTooltipSrc: "folderPath",
//     dataSearchFieldsSrc: ["folderName", "folderPath"],
//     dataDisabledSrc: "isRecordDisabled",
//     isHierarchySelectionModificationAllowed: true,
// }

// let mySection: DropdownTree = new DropdownTree(mySectionConfig, {
//     folder_id: "0",
//     folderName: "Folders",
// });

// // mySection.preSelectedDataUniqueFieldValues = preselectedData.map((val) => TreeUtility.createExpliciteTreeNode(val, {
// //     dataUniqueFieldSrc: "resourceId",
// //     dataVisibleNameSrc: "resourceName",
// // }, true));

// data.forEach((val) => mySection.insert("0", val));
// data1.forEach((val) => mySection.insert("1", val));
// data2.forEach((val) => mySection.insert("2", val));
// // console.log(mySection.findNodeFromId("1"));
// // mySection.nodeSelection("1");

// data11.forEach((val) => mySection.insert("11", val));
// mySection.nodeSelection("111");
// // mySection.changeNodeDisablility();
// mySection.selectAll();
// console.log(mySection.isAllSelected);

// console.log(mySection.findNodeFromId("1")?.isSelected);
// console.log(mySection.findNodeFromId("11")?.isSelected);
// console.log(mySection.findNodeFromId("111")?.isSelected);
// console.log(mySection.getCurrentSelectedNodes().length);
// // console.log(mySection.validState);

// // console.log(mySection.getCurrentSelectedNodes()[0].dataUniqueFieldValue);


// // mySection.findNodeFromId("1") && (mySection.findNodeFromId("1")!.isSelected = false);
// // mySection.findNodeFromId("21") && (mySection.findNodeFromId("21")!.isSelected = true);
// // mySection.findNodeFromId("21") && (mySection.findNodeFromId("22")!.isSelected = true);

// // mySection.itemSelection("2", false);

// // mySection.itemSelection("21", true);
// // mySection.itemSelection("22", true);

// // console.log(mySection.findNodeFromId("21")?.isSelected);
// // console.log(mySection.findNodeFromId("22")?.isSelected);
// // console.log(mySection.findNodeFromId("2")?.isAllChildrenSelected, "sdf");
// // console.log(mySection.findNodeFromId("21")?.isSelected);
// // console.log(mySection.findNodeFromId("22")?.isSelected);

// // mySection.selectAll();

// // console.log(mySection.getCurrentSelectedNodesArray()[0].dataVisibleNameValue);
// // console.log(mySection.getCurrentSelectedNodesArray()[1].dataVisibleNameValue);
// // console.log(mySection.getCurrentSelectedNodesArray()[0].dataVisibleNameValue);

// // mySection.itemSelection("111");
// // console.log(mySection.findNodeFromId("111")?.dataVisibleNameValue, mySection.findNodeFromId("111")?.isSelected);
// // console.log(mySection.findNodeFromId("11")?.dataVisibleNameValue, mySection.findNodeFromId("11")?.isSelected);
// // console.log(mySection.findNodeFromId("11")?.dataVisibleNameValue, mySection.findNodeFromId("11")?.isSelected);
// // console.log(mySection.findNodeFromId("1")?.dataVisibleNameValue, mySection.findNodeFromId("1")?.isSelected);
// // console.log(mySection.getCurrentSelectedNodesArray().length);

// // console.log(mySection.findNodeFromId("1")?.dataSearchFieldsValues);
// // console.log(mySection.findNodes("f").length);
// // console.log(mySection.findNodeFromId("22")?.isSelected);



