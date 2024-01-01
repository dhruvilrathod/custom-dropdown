interface ITreeFieldsSrcConfigurations {
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

interface IOperatorFunction {
    (node: TreeNode): void;
}

interface IStopperFunction {
    (node: TreeNode): boolean;
}

interface ITree {
    root: TreeNode;
    config: ITreeFieldsSrcConfigurations;
    preOrderTraversal(node?: TreeNode): Generator<TreeNode>
    postOrderTraversal(node?: TreeNode): Generator<TreeNode>;
    insert(dataUniqueFieldValue: string | number, value: any): boolean;
    remove(key: string | number): boolean;
    findNodeFromId(dataUniqueFieldValue: string | number): TreeNode | undefined;
}

interface IDropDownTreeConfig extends ITreeFieldsSrcConfigurations {
    isRequired?: boolean;
    isDisabled?: boolean;
    isSingularInput?: boolean;
    isReadonly?: boolean;
    isCustomInputAllowed?: boolean;
    isSearchAllowed?: boolean;
    isAsynchronousSearch?: boolean;
    isClientSideSearchAllowed?: boolean;
    isResetOptionVisible?: boolean;
    isSelectAllAvailable?: boolean;
    isMultipleLevel?: boolean;
    isAsynchronouslyExpandable?: boolean;
    isHierarchySelectionModificationAllowed?: boolean; // done
    isCustomAllSelectOption?: boolean;
    minSelectCount?: number;
    maxSelectCount?: number;
}

interface IDropDownTree extends ITree {
    selectAll(isReset?: boolean): void;
    itemSelection(dataUniqueFieldValue: string | number, selectionVal?: boolean): void;
}

interface ITreeNode {
    isSelected?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isExpanded?: boolean;
    isChildernLoading?: boolean;
    levelIndex?: number;
    isPartiallySelected?: boolean;
    isAllChildrenSelected?: boolean;
    dataUniqueFieldValue: string | number;
    dataVisibleNameValue: string;
    dataTooltipValue?: string;
    dataExpandableValue?: boolean;
    dataFavouriteValue?: boolean;
    dataTotalDocsValue?: number;
    dataSearchFieldsValues: string[];
    children: TreeNode[];
    originalData?: any;
    parent?: TreeNode;
    isLeaf: boolean;
    hasChildren: boolean;
    onExpand: Function;
    onCollaps: Function;
    onSelect: Function;
    onDeselect: Function;
}

class TreeNode implements ITreeNode {

    isSelected?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isExpanded?: boolean;
    isChildernLoading?: boolean;
    levelIndex?: number;
    dataUniqueFieldValue: string | number;
    dataVisibleNameValue: string;
    dataTooltipValue?: string;
    dataExpandableValue?: boolean;
    dataFavouriteValue?: boolean;
    dataTotalDocsValue?: number;
    dataSearchFieldsValues: string[];
    children: TreeNode[];
    originalData?: any;
    parent?: TreeNode;

    onExpand!: Function;
    onCollaps!: Function;
    onSelect!: Function;
    onDeselect!: Function;

    constructor(value: any, config: ITreeFieldsSrcConfigurations, parent?: TreeNode, levelIndex: number = 0, nodeType = 2) {

        // fields which are related to identity of the node, possibly acquiring no changes at runtime
        this.isDisabled = config.dataDisabledSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataDisabledSrc) : false;
        this.isReadOnly = config.dataReadOnlySrc !== undefined ? TreeUtility.propertyAccess(value, config.dataReadOnlySrc) : false;
        this.dataUniqueFieldValue = TreeUtility.propertyAccess(value, config.dataUniqueFieldSrc);
        this.dataVisibleNameValue = TreeUtility.propertyAccess(value, config.dataVisibleNameSrc);
        this.dataTooltipValue = config.dataTooltipSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataTooltipSrc) : TreeUtility.propertyAccess(value, config.dataVisibleNameSrc);
        this.dataExpandableValue = config.dataExpandableSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataExpandableSrc) : false;
        this.dataFavouriteValue = config.dataFavouriteSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataFavouriteSrc) : false;
        this.dataTotalDocsValue = config.dataTotalDocsSrc !== undefined ? TreeUtility.propertyAccess(value, config.dataTotalDocsSrc) : 0;
        this.dataSearchFieldsValues = config.dataSearchFieldsSrc && config.dataSearchFieldsSrc.length > 0 ? config.dataSearchFieldsSrc : [];
        this.originalData = value;

        // fields which are used to manage UI states and functionalities at the runtime
        this.isSelected = value.isSelected || false;
        this.isExpanded = value.isExpanded || false;
        this.isChildernLoading = value.isChildernLoading || false;
        // this.isPartiallySelected = value.isPartiallySelected || false;
        // this.isAllChildrenSelected = value.isAllChildrenSelected || false;
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

class Tree implements ITree {

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

    insert(dataUniqueFieldValue: string | number, value: any): boolean {
        for (let node of this.preOrderTraversal()) {
            if (node.dataUniqueFieldValue === dataUniqueFieldValue) {
                node.children.push(new TreeNode(value, this.config, node));
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
            if(dataSearchFieldsValuesLen > 0) {
                for (let i = 0; i < dataSearchFieldsValuesLen; i++) {
                    console.log(node.dataSearchFieldsValues[i]);
                    
                    let accessedValue = TreeUtility.propertyAccess(node.originalData, node.dataSearchFieldsValues[i]).toString().toLowerCase().trim();
                    if(!(!accessedValue || typeof accessedValue !== "string" || accessedValue === "" || accessedValue === null) && accessedValue.includes(searchQuery)) {
                        searchNodes.push(node);
                    }
                }
            }
        }

        return searchNodes;
    }
}

class TreeUtility {

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
            value = structuredClone(dataObj);
            for (let k = 0, pathArrLen = pathArr.length; k < pathArrLen; k++) {
                value = value[pathArr[k]];
            }
        }
        console.log(dataObj);
        
        return value;
    }

    static traverseAllNodesPreOrder(tree: Tree, operatorFunction: IOperatorFunction, startNode?: TreeNode, stopperFunction?: IStopperFunction, stopWithLastOperationPerformed = true): void {

        for (let node of tree.preOrderTraversal(startNode)) {
            if (stopperFunction && stopperFunction(node)) {
                stopWithLastOperationPerformed && operatorFunction && operatorFunction(node);
                return;
            }
            operatorFunction && operatorFunction(node);
        }
    }

    static traverseAllNodesPostOrder(tree: Tree, operatorFunction: IOperatorFunction, startNode?: TreeNode, stopperFunction?: IStopperFunction, stopWithLastOperationPerformed = true): void {
        for (let node of tree.postOrderTraversal()) {
            if (stopperFunction && stopperFunction(node)) {
                stopWithLastOperationPerformed && operatorFunction && operatorFunction(node);
                return;
            }
            operatorFunction && operatorFunction(node);
        }
    }
}

class DropdownTree extends Tree implements IDropDownTree {

    config: IDropDownTreeConfig;

    constructor(config: IDropDownTreeConfig, rootValue: any) {
        super(config, rootValue);

        this.config = config;

        this.config.isRequired = config.isRequired !== undefined ? config.isRequired : false;
        this.config.isDisabled = config.isDisabled !== undefined ? config.isDisabled : false;
        this.config.isSingularInput = config.isSingularInput !== undefined ? config.isSingularInput : false;
        this.config.isReadonly = config.isReadonly !== undefined ? config.isReadonly : false;
        this.config.isCustomInputAllowed = config.isCustomInputAllowed !== undefined ? config.isCustomInputAllowed : false;
        this.config.isSearchAllowed = config.isSearchAllowed !== undefined ? config.isSearchAllowed : false;
        this.config.isAsynchronousSearch = config.isAsynchronousSearch !== undefined ? config.isAsynchronousSearch : false;
        this.config.isClientSideSearchAllowed = config.isClientSideSearchAllowed !== undefined ? config.isClientSideSearchAllowed : false;
        this.config.isResetOptionVisible = config.isResetOptionVisible !== undefined ? config.isResetOptionVisible : false;
        this.config.isSelectAllAvailable = config.isSelectAllAvailable !== undefined ? config.isSelectAllAvailable : false;
        this.config.isMultipleLevel = config.isMultipleLevel !== undefined ? config.isMultipleLevel : false;
        this.config.isAsynchronouslyExpandable = config.isAsynchronouslyExpandable !== undefined ? config.isAsynchronouslyExpandable : false;
        this.config.isHierarchySelectionModificationAllowed = config.isHierarchySelectionModificationAllowed !== undefined ? config.isHierarchySelectionModificationAllowed : false;
        this.config.isCustomAllSelectOption = config.isCustomAllSelectOption !== undefined ? config.isCustomAllSelectOption : false;
        this.config.minSelectCount = config.minSelectCount !== undefined ? config.minSelectCount : -1;
        this.config.maxSelectCount = config.maxSelectCount !== undefined ? config.maxSelectCount : -1;
    }


    public selectAll(isReset: boolean = false): void {
        TreeUtility.traverseAllNodesPreOrder(this, (node: TreeNode) => {
            node.isSelected = !isReset;
        });
    }

    public getCurrentSelectedNodesArray(): Array<TreeNode> {
        let selectedNodes: TreeNode[] = [];

        TreeUtility.traverseAllNodesPreOrder(this, (node: TreeNode) => {
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

    public itemSelection(dataUniqueFieldValue: string | number, selectionVal: boolean = true): void {
        let currentNode = this.findNodeFromId(dataUniqueFieldValue);

        if (currentNode) {
            currentNode.isSelected = selectionVal;
        }

        if (this.config.isHierarchySelectionModificationAllowed) {
            TreeUtility.traverseAllNodesPreOrder(this, (node: TreeNode) => {
                node.isSelected = selectionVal;
            }, currentNode);

            TreeUtility.traverseAllNodesPostOrder(this, (node: TreeNode) => {
                node.isSelected = node.children.length > 0 ? node.children.some((val: TreeNode) => val.isSelected === false) ? false : true : node.isSelected;
            });
        }
    }

}

let data: any[] = [
    {
        folder_id: "1",
        folderName: "aaa",
        folderPath: "myFolder/ff-asssffdf",
    },
    {
        folder_id: "2",
        folderName: "bbb sdffsd",
        folderPath: "myFolder/ff-asssffdf",
    }
];

let data1: any[] = [
    {
        folder_id: "11",
        folderName: "1aaa daddcc",
        folderPath: "myFolder/ff-dfdfd",
    }
];

let data11: any[] = [
    {
        folder_id: "111",
        folderName: "11aaa dffrfrf",
        folderPath: "myFolder/ff-sdfsd",
    }
];

let data2: any[] = [
    {
        folder_id: "21",
        folderName: "2aaa ffgfgf",
        folderPath: "myFolder/ff-fffffff",
    },
    {
        folder_id: "22",
        folderName: "2bbb ffgnfjgnbf",
        folderPath: "myFolder/ff-fffff",
    }
];


let mySection: DropdownTree = new DropdownTree({
    dataUniqueFieldSrc: "folder_id",
    dataVisibleNameSrc: "folderName",
    dataTooltipSrc: "folderPath",
    dataSearchFieldsSrc: ["folderName", "folderPath"],
    isHierarchySelectionModificationAllowed: false
}, {
    folder_id: "0",
    folderName: "Folders",
    folderPath: "myFolder/ff-asssffdf",
});

data.forEach((val) => mySection.insert("0", val));
data2.forEach((val) => mySection.insert("2", val));

data1.forEach((val) => mySection.insert("1", val));
data11.forEach((val) => mySection.insert("11", val));

// mySection.findNodeFromId("1") && (mySection.findNodeFromId("1")!.isSelected = false);
// mySection.findNodeFromId("21") && (mySection.findNodeFromId("21")!.isSelected = true);
// mySection.findNodeFromId("21") && (mySection.findNodeFromId("22")!.isSelected = true);

// mySection.itemSelection("2", false);

// mySection.itemSelection("21", true);
// mySection.itemSelection("22", true);

// console.log(mySection.findNodeFromId("21")?.isSelected);
// console.log(mySection.findNodeFromId("22")?.isSelected);
// console.log(mySection.findNodeFromId("2")?.isAllChildrenSelected, "sdf");
// console.log(mySection.findNodeFromId("21")?.isSelected);
// console.log(mySection.findNodeFromId("22")?.isSelected);

// mySection.selectAll();

// console.log(mySection.getCurrentSelectedNodesArray()[0].dataVisibleNameValue);
// console.log(mySection.getCurrentSelectedNodesArray()[1].dataVisibleNameValue);
// console.log(mySection.getCurrentSelectedNodesArray()[0].dataVisibleNameValue);

// mySection.itemSelection("111");
// console.log(mySection.findNodeFromId("111")?.dataVisibleNameValue, mySection.findNodeFromId("111")?.isSelected);
// console.log(mySection.findNodeFromId("11")?.dataVisibleNameValue, mySection.findNodeFromId("11")?.isSelected);
// console.log(mySection.findNodeFromId("11")?.dataVisibleNameValue, mySection.findNodeFromId("11")?.isSelected);
// console.log(mySection.findNodeFromId("1")?.dataVisibleNameValue, mySection.findNodeFromId("1")?.isSelected);
// console.log(mySection.getCurrentSelectedNodesArray().length);

// console.log(mySection.findNodeFromId("1")?.dataSearchFieldsValues);
console.log(mySection.findNodes("2bbb").length);


