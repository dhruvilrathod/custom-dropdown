interface TreeFieldsSrcConfigurations {
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

class TreeNode {

    isSelected?: boolean;
    isDisabled?: boolean;
    isReadOnly?: boolean;
    isExpanded?: boolean;
    isChildernLoading?: boolean;
    levelIndex?: number;
    isPartiallySelected?: boolean;
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

    constructor(value: any, config: TreeFieldsSrcConfigurations, parent?: TreeNode, levelIndex: number = 0) {

        // fields which are related to identity of the node, possibly acquiring no changes at runtime
        this.isDisabled = config.dataDisabledSrc ? TreeUtility.propertyAccess(value, config.dataDisabledSrc) : false;
        this.isReadOnly = config.dataReadOnlySrc ? TreeUtility.propertyAccess(value, config.dataReadOnlySrc) : false;
        this.dataUniqueFieldValue = TreeUtility.propertyAccess(value, config.dataUniqueFieldSrc);
        this.dataVisibleNameValue = TreeUtility.propertyAccess(value, config.dataVisibleNameSrc);
        this.dataTooltipValue = config.dataTooltipSrc ? TreeUtility.propertyAccess(value, config.dataTooltipSrc) : TreeUtility.propertyAccess(value, config.dataVisibleNameSrc);
        this.dataExpandableValue = config.dataExpandableSrc ? TreeUtility.propertyAccess(value, config.dataExpandableSrc) : false;
        this.dataFavouriteValue = config.dataFavouriteSrc ? TreeUtility.propertyAccess(value, config.dataFavouriteSrc) : false;
        this.dataTotalDocsValue = config.dataTotalDocsSrc ? TreeUtility.propertyAccess(value, config.dataTotalDocsSrc) : false;
        this.originalData = value;

        // fields which are used to manage UI states and functionalities at the runtime
        this.isSelected = value.isSelected || false;
        this.isExpanded = value.isExpanded || false;
        this.isChildernLoading = value.isChildernLoading || false;
        this.isPartiallySelected = value.isPartiallySelected || false;

        this.levelIndex = parent && parent.levelIndex ? (parent.levelIndex + 1) : levelIndex;
        this.parent = parent;
        this.children = [];
    }

    get isLeaf() {
        return this.children.length === 0;
    }

    get hasChildren() {
        return !this.isLeaf;
    }
}

class Tree {

    root: TreeNode;
    config: TreeFieldsSrcConfigurations;

    constructor(config: TreeFieldsSrcConfigurations, rootValue: any) {

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
        return value;
    }

    static traverseAllNodes(tree: Tree): void {
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


let mySection: Tree = new Tree({
    dataUniqueFieldSrc: "folder_id",
    dataVisibleNameSrc: "folderName",
}, {
    folder_id: "0",
    folderName: "Folders",
});

data.forEach((val) => mySection.insert("0", val));
data2.forEach((val) => mySection.insert("2", val));

mySection.find("1") && (mySection.find("1")!.isSelected = true);

console.log(mySection.find("2")?.dataVisibleNameValue, mySection.find("2")?.isSelected);
