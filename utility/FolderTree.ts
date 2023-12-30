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
}

interface ITreeUtility {

}

interface TreeUtility {
    propertyAccess: typeof TreeUtility.propertyAccess;
    traverseAllNodes: typeof TreeUtility.traverseAllNodes;
}


interface IOperatorFunction {
    (node: TreeNode): void;
}

interface ITree {
    root: TreeNode;
    config: ITreeFieldsSrcConfigurations;
    preOrderTraversal(node?: TreeNode): Generator<TreeNode>
    postOrderTraversal(node?: TreeNode): Generator<TreeNode>;
    insert(dataUniqueFieldValue: string | number, value: any): boolean;
    remove(key: string | number): boolean;
    find(dataUniqueFieldValue: string | number): TreeNode | undefined;
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
    isHierarchySelectionModificationAllowed?: boolean;
    isCustomAllSelectOption?: boolean;
    minSelectCount?: number;
    maxSelectCount?: number;
}

interface IDropDownTree extends ITree {
    selectAll(isReset?: boolean): void;
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
    isPartiallySelected?: boolean;
    isAllChildrenSelected?: boolean;
    dataUniqueFieldValue: string | number;
    dataVisibleNameValue: string;
    dataTooltipValue?: string;
    dataExpandableValue?: boolean;
    dataFavouriteValue?: boolean;
    dataTotalDocsValue?: number;
    children: TreeNode[];
    originalData?: any;
    parent?: TreeNode;

    onExpand!: Function;
    onCollaps!: Function;
    onSelect!: Function;
    onDeselect!: Function;

    constructor(value: any, config: ITreeFieldsSrcConfigurations, parent?: TreeNode, levelIndex: number = 0, nodeType = 2) {        

        // fields which are related to identity of the node, possibly acquiring no changes at runtime
        this.isDisabled = config.dataDisabledSrc ? TreeUtility.propertyAccess(value, config.dataDisabledSrc) : false;
        this.isReadOnly = config.dataReadOnlySrc ? TreeUtility.propertyAccess(value, config.dataReadOnlySrc) : false;
        this.dataUniqueFieldValue = TreeUtility.propertyAccess(value, config.dataUniqueFieldSrc);
        this.dataVisibleNameValue = TreeUtility.propertyAccess(value, config.dataVisibleNameSrc);
        this.dataTooltipValue = config.dataTooltipSrc ? TreeUtility.propertyAccess(value, config.dataTooltipSrc) : TreeUtility.propertyAccess(value, config.dataVisibleNameSrc);
        this.dataExpandableValue = config.dataExpandableSrc ? TreeUtility.propertyAccess(value, config.dataExpandableSrc) : false;
        this.dataFavouriteValue = config.dataFavouriteSrc ? TreeUtility.propertyAccess(value, config.dataFavouriteSrc) : false;
        this.dataTotalDocsValue = config.dataTotalDocsSrc ? TreeUtility.propertyAccess(value, config.dataTotalDocsSrc) : 0;
        this.originalData = value;

        // fields which are used to manage UI states and functionalities at the runtime
        this.isSelected = value.isSelected || false;
        this.isExpanded = value.isExpanded || false;
        this.isChildernLoading = value.isChildernLoading || false;
        this.isPartiallySelected = value.isPartiallySelected || false;
        this.isAllChildrenSelected = value.isAllChildrenSelected || false;
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

    find(dataUniqueFieldValue: string | number): TreeNode | undefined {
        for (let node of this.preOrderTraversal()) {
            if (node.dataUniqueFieldValue === dataUniqueFieldValue) return node;
        }
        return undefined;
    }
}

class TreeUtility implements ITreeUtility {

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
        return value;
    }

    static traverseAllNodes(tree: Tree, operatorFunction?: IOperatorFunction): void {
        for (let node of tree.preOrderTraversal()) {
            operatorFunction && operatorFunction(node);
            console.log(node.dataUniqueFieldValue, node.dataVisibleNameValue, node.isSelected);
        }
    }
}

class DropdownTree extends Tree implements IDropDownTree {


    constructor(config: IDropDownTreeConfig, rootValue: any) {

        super(config, rootValue);

    }


    public selectAll(isReset: boolean = false): void {        
        TreeUtility.traverseAllNodes(this, (node: TreeNode) => {
            node.isSelected = !isReset;
            node.children && node.children.length > 0 && (node.isAllChildrenSelected = !isReset);
        });
    }

    public getCurrentSelectedNodesArray(): Array<TreeNode> {
        let selectedNodes: TreeNode[] = []
        
        TreeUtility.traverseAllNodes(this, (node: TreeNode) => {
            if(node.levelIndex && node.levelIndex > 0 && node.isSelected === true) {
                selectedNodes.push(node);
            }
        });

        return selectedNodes;
    }

}

let data: any[] = [
    {
        folder_id: "1",
        folderName: "aaa"
    },
    {
        folder_id: "2",
        folderName: "bbb"
    }
];

let data2: any[] = [
    {
        folder_id: "21",
        folderName: "2aaa"
    },
    {
        folder_id: "22",
        folderName: "2bbb"
    }
];


let mySection: DropdownTree = new DropdownTree({
    dataUniqueFieldSrc: "folder_id",
    dataVisibleNameSrc: "folderName",
}, {
    folder_id: "0",
    folderName: "Folders",
});

data.forEach((val) => mySection.insert("0", val));
data2.forEach((val) => mySection.insert("2", val));

mySection.find("1") && (mySection.find("1")!.isSelected = true);
mySection.find("21") && (mySection.find("21")!.isSelected = true);
console.log(mySection.getCurrentSelectedNodesArray().length);

// console.log(mySection.find("2")?.dataVisibleNameValue, mySection.find("2")?.isSelected);
