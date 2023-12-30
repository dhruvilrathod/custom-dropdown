class TreeNode {

    isSelected;
    isDisabled;
    isReadOnly;
    isExpanded;
    isChildernLoading;
    levelIndex;
    isPartiallySelected;
    dataUniqueFieldValue;
    dataVisibleNameValue;
    dataTooltipValue;
    dataExpandableValue;
    dataFavouriteValue;
    dataTotalDocsValue;
    children;
    originalData;
    parent;
    onExpand;
    onCollaps;
    onSelect;
    onDeselect;

    constructor(value, config, parent = null, levelIndex = 0) {

        // fields which are related to identity of the node, possibly acquiring no changes at runtime
        this.isDisabled = TreeUtility.propertyAccess(value, config.dataDisabledSrc) || false;
        this.isReadOnly = TreeUtility.propertyAccess(value, config.dataReadOnlySrc) || false;
        this.dataUniqueFieldValue = TreeUtility.propertyAccess(value, config.dataUniqueFieldSrc);
        this.dataVisibleNameValue = TreeUtility.propertyAccess(value, config.dataVisibleNameSrc);
        this.dataTooltipValue = TreeUtility.propertyAccess(value, config.dataTooltipSrc);
        this.dataExpandableValue = TreeUtility.propertyAccess(value, config.dataExpandableSrc);
        this.dataFavouriteValue = TreeUtility.propertyAccess(value, config.dataFavouriteSrc);
        this.dataTotalDocsValue = TreeUtility.propertyAccess(value, config.dataTotalDocsSrc);
        this.originalData = value;
        
        // fields which are used to manage UI states and functionalities at the runtime
        this.isSelected = value.isSelected || false;
        this.isExpanded = value.isExpanded || false;
        this.isChildernLoading = value.isChildernLoading || false;
        this.isPartiallySelected = value.isPartiallySelected || false;

        this.levelIndex = parent ? (parent.levelIndex + 1) : levelIndex;
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

    root;

    config;

    dataUniqueFieldSrc;
    dataVisibleNameSrc;
    dataTooltipSrc;
    dataExpandableSrc;
    dataChildrenSrc;
    dataFavouriteSrc;
    dataTotalDocsSrc;
    dataParentUniqueIdsSrc;
    dataDisabledSrc;
    dataReadOnlySrc;


    constructor(config, rootValue) {

        this.dataUniqueFieldSrc = config.dataUniqueFieldSrc;
        this.dataVisibleNameSrc = config.dataVisibleNameSrc;
        this.dataTooltipSrc = config.dataTooltipSrc;
        this.dataExpandableSrc = config.dataExpandableSrc;
        this.dataChildrenSrc = config.dataChildrenSrc;
        this.dataFavouriteSrc = config.dataFavouriteSrc;
        this.dataTotalDocsSrc = config.dataTotalDocsSrc;
        this.dataParentUniqueIdsSrc = config.dataParentUniqueIdsSrc;
        this.dataDisabledSrc = config.dataDisabledSrc;
        this.dataReadOnlySrc = config.dataReadOnlySrc;

        this.config = config;

        this.root = new TreeNode({
            isSelected: rootValue.isSelected,
            isDisabled: rootValue.isDisabled,
            isExpanded: rootValue.isExpanded,
            isChildernLoading: rootValue.isChildernLoading,
            isPartiallySelected: rootValue.isPartiallySelected,
            dataUniqueFieldValue: rootValue.sectionId,
            dataVisibleNameValue: rootValue.sectionNameKey,
            dataTooltipValue: rootValue.sectionTooltipKey,
            dataExpandableValue: rootValue.isExpandable,
            dataFavouriteValue: rootValue.isFavourite,
            dataTotalDocsValue: rootValue.totalDocs,
        }, config);
    }

    *preOrderTraversal(node = this.root) {
        yield node;
        if (node.children.length) {
            for (let child of node.children) {
                yield* this.preOrderTraversal(child);
            }
        }
    }

    *postOrderTraversal(node = this.root) {
        if (node.children.length) {
            for (let child of node.children) {
                yield* this.postOrderTraversal(child);
            }
        }
        yield node;
    }

    insert(dataUniqueFieldValue, value) {
        for (let node of this.preOrderTraversal()) {
            if (node.dataUniqueFieldValue === dataUniqueFieldValue) {
                node.children.push(new TreeNode(value, this.config, node));
                return true;
            }
        }
        return false;
    }

    remove(key) {
        for (let node of this.preOrderTraversal()) {
            const filtered = node.children.filter(c => c.dataUniqueFieldValue !== key);
            if (filtered.length !== node.children.length) {
                node.children = filtered;
                return true;
            }
        }
        return false;
    }

    find(key) {
        for (let node of this.preOrderTraversal()) {
            if (node.dataUniqueFieldValue === key) return node;
        }
        return undefined;
    }
}

class TreeUtility {
    
    constructor() {}

    static propertyAccess(dataObj, path) {

        if (!path || typeof path !== "string" || path === "" || path === null) {
          return '';
        }
    
        path = path.split("/");

        let value;
    
        if (path.length === 1) {
          value = dataObj[path[0]];
        }
        else {
    
          value = cloneDeep(dataObj);
    
          for (let k = 0, pathLen = path.length; k < pathLen; k++) {
            value = value[path[k]];
          }
        }
    
        return value;
      }
}