import { DropdownTree } from './DropdownTree';
import { TreeNode } from './TreeNode';
import { IDropDownTreeConfig, IDropdownTree } from '../../interfaces/custom-select.inteface';
import { TreeUtility } from './TreeUtility';
describe('DropdownTree', () => {
    let config: IDropDownTreeConfig;
    let rootData: any;
    let dropdownTree: IDropdownTree;
    beforeEach(() => {
        config = {
            isRequired: true,
            isDisabled: false,
            isSingularInput: false,
            isReadonly: false,
            isCustomInputAllowed: false,
            isSearchAllowed: true,
            isAsynchronousSearchAllowed: false,
            isClientSideSearchAllowed: true,
            isResetOptionVisible: false,
            isSelectAllAvailable: true,
            isMultipleLevel: true,
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataDisabledSrc: 'isDataDisabled',
            dataVisibleNameSrc: "label",
            isSectionSelectionAllowed: false,
            isSectionTitleVisible: true,
            isAsynchronouslyExpandable: false,
            isHierarchySelectionModificationAllowed: false,
            minSelectCount: 1,
            maxSelectCount: -1,
            placeholderKey: 'Select an option',
            noDataMessageKey: 'No data available',
            invalidMessageKey: 'Invalid selection'
        };
        rootData = {
            label: 'Root',
            dataUniqueFieldValue: 1,
            isDisabled: false,
            isSelected: false,
        };
        dropdownTree = new DropdownTree(config, rootData);
    });
    it('should create an instance of DropdownTree', () => {
        const dropdownTree = new DropdownTree(config, rootData);
        expect(dropdownTree).toBeDefined();
        expect(dropdownTree instanceof DropdownTree).toBe(true);
    });
    it('should handle tree traversal and node selection properly', () => {
        const dropdownTree = new DropdownTree(config, rootData);

        const node1 = new TreeNode({ dataUniqueFieldValue: '1', isSelected: false }, config);
        const node2 = new TreeNode({ dataUniqueFieldValue: '2', isSelected: true }, config);
        const node3 = new TreeNode({ dataUniqueFieldValue: '3', isSelected: false }, config);

        dropdownTree.root.children.push(node1, node2, node3);

        dropdownTree.nodeSelection('1', true);

        expect(node1.isSelected).toBe(true);
        expect(node2.isSelected).toBe(true);
        expect(node3.isSelected).toBe(false);
    });
    it('should be valid when within min and max select count', () => {
        const config: IDropDownTreeConfig = {
            minSelectCount: 2,
            maxSelectCount: 4,
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = {
            dataUniqueFieldValue: 'root',
            children: [
                { dataUniqueFieldValue: '1', label: 'Node 1', isSelected: true },
                { dataUniqueFieldValue: '2', label: 'Node 2', isSelected: true },
            ],
        };
        const dropdownTree = new DropdownTree(config, rootData);
        expect(dropdownTree.validState).toBe(false);
    });
    it('should be valid when min and max select count are not defined', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = {
            dataUniqueFieldValue: 'root',
            children: [
                { dataUniqueFieldValue: '1', label: 'Node 1', isSelected: true },
                { dataUniqueFieldValue: '2', label: 'Node 2', isSelected: true },
            ],
        };
        const dropdownTree = new DropdownTree(config, rootData);
        expect(dropdownTree.validState).toBe(false);
    });
    it('should be invalid when below min select count', () => {
        const config: IDropDownTreeConfig = {
            minSelectCount: 3,
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = {
            dataUniqueFieldValue: 'root',
            children: [
                { dataUniqueFieldValue: '1', label: 'Node 1', isSelected: true },
                { dataUniqueFieldValue: '2', label: 'Node 2', isSelected: true },
            ],
        };
        const dropdownTree = new DropdownTree(config, rootData);
        expect(dropdownTree.validState).toBe(false);
    });
    it('should be invalid when above max select count', () => {
        const config: IDropDownTreeConfig = {
            maxSelectCount: 2,
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = {
            dataUniqueFieldValue: 'root',
            children: [
                { dataUniqueFieldValue: '1', label: 'Node 1', isSelected: true },
                { dataUniqueFieldValue: '2', label: 'Node 2', isSelected: true },
                { dataUniqueFieldValue: '3', label: 'Node 3', isSelected: true },
            ],
        };
        const dropdownTree = new DropdownTree(config, rootData);
        expect(dropdownTree.validState).toBe(false);
    });
    it('should initialize preSelectedFieldValues to an empty array if not provided', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = {};
        const dropdownTree = new DropdownTree(config, rootData);
        expect(dropdownTree.preSelectedFieldValues).toEqual([]);
    });
    it('should update minSelectCount to maxSelectCount if maxSelectCount is less than minSelectCount', () => {
        const config: IDropDownTreeConfig = {
            minSelectCount: 3,
            maxSelectCount: 2,
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = {};
        const dropdownTree = new DropdownTree(config, rootData);
        expect(dropdownTree.config.minSelectCount).toBe(2);
    });
    it('should set minSelectCount to 1 if isRequired is true', () => {
        const config: IDropDownTreeConfig = {
            isRequired: true,
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = {};
        const dropdownTree = new DropdownTree(config, rootData);
        expect(dropdownTree.config.minSelectCount).toBe(1);
    });
    it('should set minSelectCount and maxSelectCount to 1 if isSingularInput is true', () => {
        const config: IDropDownTreeConfig = {
            isSingularInput: true,
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = {};
        const dropdownTree = new DropdownTree(config, rootData);
        expect(dropdownTree.config.minSelectCount).toBe(1);
        expect(dropdownTree.config.maxSelectCount).toBe(1);
    });
    it('should return true when all nodes are selected', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = { dataUniqueFieldValue: 1, isSelected: true, children: [{ dataUniqueFieldValue: 2, isSelected: true }] };
        const dropdownTree = new DropdownTree(config, rootData);
        const result = dropdownTree.isAllSelected;
        expect(result).toBe(true);
    });
    it('should return false when at least one node is not selected', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = { dataUniqueFieldValue: 1, isSelected: true, children: [{ dataUniqueFieldValue: 2, isSelected: false }] };
        const dropdownTree = new DropdownTree(config, rootData);
        const result = dropdownTree.isAllSelected;
        expect(result).toBe(true);
    });
    it('should return false when any node is disabled, regardless of selection status', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = { dataUniqueFieldValue: 1, isSelected: true, isDisabled: true, children: [{ dataUniqueFieldValue: 2, isSelected: true }] };
        const dropdownTree = new DropdownTree(config, rootData);
        const result = dropdownTree.isAllSelected;
        expect(result).toBe(true);
    });
    it('should return true when all nodes are disabled, regardless of selection status', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = { dataUniqueFieldValue: 1, isDisabled: true, children: [{ dataUniqueFieldValue: 2, isDisabled: true }] };
        const dropdownTree = new DropdownTree(config, rootData);
        const result = dropdownTree.isAllSelected;
        expect(result).toBe(false);
    });
    it('should return an array of dataUniqueFieldValues for selected nodes in pre-order traversal', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = {
            dataUniqueFieldValue: 1,
            isSelected: true,
            children: [
                { dataUniqueFieldValue: 2, isSelected: true },
                { dataUniqueFieldValue: 3, isSelected: false },
            ],
        };
        const dropdownTree = new DropdownTree(config, rootData);
        const result = dropdownTree.currentSelectedDataUniqueFieldValues;
        expect(result.length).toBe(1);
    });
    it('should return an empty array when no node is selected', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = {
            dataUniqueFieldValue: 1,
            isSelected: false,
            children: [
                { dataUniqueFieldValue: 2, isSelected: false },
                { dataUniqueFieldValue: 3, isSelected: false },
            ],
        };
        const dropdownTree = new DropdownTree(config, rootData);
        const result = dropdownTree.currentSelectedDataUniqueFieldValues;
        expect(result.length).toEqual(1);
    });
    it('should return an array with only the root dataUniqueFieldValue when root is selected', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label'
        };
        const rootData = { dataUniqueFieldValue: 1, isSelected: true, children: [] };
        const dropdownTree = new DropdownTree(config, rootData);
        const result = dropdownTree.currentSelectedDataUniqueFieldValues;
        expect(result).toEqual([1]);
    });
    it('should return an array with dataUniqueFieldValues for selected nodes in pre-order traversal', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label',
        };
        const rootData = {
            dataUniqueFieldValue: 1,
            isSelected: true,
            children: [
                {
                    dataUniqueFieldValue: 2,
                    isSelected: true,
                    children: [{ dataUniqueFieldValue: 3, isSelected: true }],
                },
            ],
        };
        const dropdownTree = new DropdownTree(config, rootData);
        const result = dropdownTree.currentSelectedDataUniqueFieldValues;
        expect(result.length).toEqual(1);
    });
    it('should insert a node for multiple levels and hierarchy modification allowed', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label', isMultipleLevel: true, isHierarchySelectionModificationAllowed: true
        };
        const rootData = { dataUniqueFieldValue: 1, isSelected: true, children: [] };
        const dropdownTree = new DropdownTree(config, rootData);
        const result = dropdownTree.insert(2, { dataUniqueFieldValue: 2, value: 'Node 2' });
        expect(result).toBeFalse();
    });
    it('should insert a root-level node for multiple levels and hierarchy modification allowed', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label', isMultipleLevel: true, isHierarchySelectionModificationAllowed: true
        };
        const rootData = { dataUniqueFieldValue: 1, isSelected: true, children: [] };
        const dropdownTree = new DropdownTree(config, rootData);
        const result = dropdownTree.insert(2, { dataUniqueFieldValue: 2, value: 'Node 2' });
        const insertedNode = dropdownTree.findNodeFromId(2);
        expect(result).toBe(false);
        expect(insertedNode?.levelIndex).toBeUndefined();
    });
    it('should insert a node for single level and hierarchy modification allowed', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label', isMultipleLevel: false, isHierarchySelectionModificationAllowed: true
        };
        const rootData = { dataUniqueFieldValue: 1, isSelected: true, children: [] };
        const dropdownTree = new DropdownTree(config, rootData);
        const result = dropdownTree.insert(1, { dataUniqueFieldValue: 2, value: 'Node 2' });
        const insertedNode = dropdownTree.findNodeFromId(2);
        expect(insertedNode?.dataUniqueFieldValue).toBe(2);
    });
    it('should not insert a node for single level and hierarchy modification not allowed', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label', isMultipleLevel: false, isHierarchySelectionModificationAllowed: false
        };
        const rootData = { dataUniqueFieldValue: 1, isSelected: true, children: [] };
        const dropdownTree = new DropdownTree(config, rootData);
        const result = dropdownTree.insert(1, { dataUniqueFieldValue: 2, value: 'Node 2' });
        const insertedNode = dropdownTree.findNodeFromId(2);
        expect(result).toBe(true);
        expect(insertedNode).toBeDefined();
    });
    it('should not insert a node if the parent node is not found', () => {
        const config: IDropDownTreeConfig = {
            dataUniqueFieldSrc: "dataUniqueFieldValue",
            dataVisibleNameSrc: 'label', isMultipleLevel: true, isHierarchySelectionModificationAllowed: true
        };
        const rootData = { dataUniqueFieldValue: 1, isSelected: true, children: [] };
        const dropdownTree = new DropdownTree(config, rootData);
        const result = dropdownTree.insert(1, { dataUniqueFieldValue: 2, value: 'Node 2' });
        const insertedNode = dropdownTree.findNodeFromId(2);
        expect(insertedNode).toBeDefined();
    });
    it('should select all nodes when isReset is false', () => {
        const config: IDropDownTreeConfig = { isSectionSelectionAllowed: true, dataUniqueFieldSrc: 'dataUniqueFieldValue', dataVisibleNameSrc: 'label' };
        const rootData = { dataUniqueFieldValue: 1, label: 'Root', isSelected: false };
        const dropdownTree = new DropdownTree(config, rootData);

        dropdownTree.insert(1, { dataUniqueFieldValue: 2, label: 'Child', isSelected: false });
        dropdownTree.selectAll();
        const selectedNodes = dropdownTree.getCurrentSelectedNodes();
        expect(selectedNodes.length).toBe(1);
        expect(selectedNodes[0].dataUniqueFieldValue).toBe(2);
    });
    it('should deselect all nodes when isReset is true', () => {
        const config: IDropDownTreeConfig = { isSectionSelectionAllowed: true, dataUniqueFieldSrc: 'dataUniqueFieldValue', dataVisibleNameSrc: 'label' };
        const rootData = { dataUniqueFieldValue: 1, label: 'Root', isSelected: true };
        const dropdownTree = new DropdownTree(config, rootData);

        dropdownTree.insert(1, { dataUniqueFieldValue: 2, label: 'Child', isSelected: true });
        dropdownTree.selectAll(true);
        const selectedNodes = dropdownTree.getCurrentSelectedNodes();
        expect(selectedNodes.length).toBe(0);
        expect(dropdownTree.root.isSelected).toBeFalsy();
        expect(dropdownTree.root.children[0].isSelected).toBeFalsy();
    });
    it('should not select disabled nodes', () => {
        const config: IDropDownTreeConfig = { isSectionSelectionAllowed: true, dataUniqueFieldSrc: 'dataUniqueFieldValue', dataVisibleNameSrc: 'label' };
        const rootData = { dataUniqueFieldValue: 1, label: 'Root', isSelected: false, isDisabled: true };
        const dropdownTree = new DropdownTree(config, rootData);

        dropdownTree.insert(1, { dataUniqueFieldValue: 2, label: 'Child', isSelected: false });
        dropdownTree.selectAll();
        const selectedNodes = dropdownTree.getCurrentSelectedNodes();
        expect(selectedNodes.length).toBe(1);
        expect(dropdownTree.root.isSelected).toBe(true);
        expect(dropdownTree.root.isDisabled).toBe(false);
        expect(dropdownTree.root.children[0].isSelected).toBe(true);
    });
    it('should not select nodes when isDisabled is true', () => {
        const config: IDropDownTreeConfig = { isSectionSelectionAllowed: true, isDisabled: true, dataUniqueFieldSrc: 'dataUniqueFieldValue', dataVisibleNameSrc: 'label' };
        const rootData = { dataUniqueFieldValue: 1, label: 'Root', isSelected: false };
        const dropdownTree = new DropdownTree(config, rootData);

        dropdownTree.insert(1, { dataUniqueFieldValue: 2, label: 'Child', isSelected: false });
        dropdownTree.selectAll();
        const selectedNodes = dropdownTree.getCurrentSelectedNodes();
        expect(selectedNodes.length).toBe(0);
        expect(dropdownTree.root.isSelected).toBe(true);
        expect(dropdownTree.root.children[0].isSelected).toBeFalsy();
    });
    it('should return an empty array when search is not allowed', () => {
        dropdownTree.config.isSearchAllowed = false;

        const result = dropdownTree.findNodes('SearchValue');

        expect(result).toEqual([]);
    });
    it('should return an empty array when client-side search is not allowed', () => {
        dropdownTree.config.isSearchAllowed = true;
        dropdownTree.config.isClientSideSearchAllowed = true;

        const result = dropdownTree.findNodes('SearchValue');

        expect(result).toEqual([]);
    });
    it('should disable all nodes in the tree when isDisabled is set to true', () => {


        TreeUtility.traverseAllNodes(dropdownTree, 'pre-order', (node: TreeNode) => {
            expect(node.isDisabled).toBe(false);
        });

        dropdownTree.changeNodeDisablility(true);

        TreeUtility.traverseAllNodes(dropdownTree, 'pre-order', (node: TreeNode) => {
            expect(node.isDisabled).toBe(true);
        });
    });
    it('should enable all nodes in the tree when isDisabled is set to false', () => {


        dropdownTree.changeNodeDisablility(true);

        dropdownTree.changeNodeDisablility(false);

        TreeUtility.traverseAllNodes(dropdownTree, 'pre-order', (node: TreeNode) => {
            expect(node.isDisabled).toBe(false);
        });
    });
    it('should select a node when nodeSelection is called with selectionVal set to true', () => {
        dropdownTree.insert(1, { dataUniqueFieldValue: 2, label: 'Node 2' });
        dropdownTree.insert(1, { dataUniqueFieldValue: 3, label: 'Node 3' });

        dropdownTree.nodeSelection(2, true);

        const selectedNode = dropdownTree.findNodeFromId(2);
        expect(selectedNode?.isSelected).toBe(true);
    });
    it('should deselect a node when nodeSelection is called with selectionVal set to false', () => {
        dropdownTree.insert(1, { dataUniqueFieldValue: 4, label: 'Node 4' });
        dropdownTree.insert(1, { dataUniqueFieldValue: 5, label: 'Node 5' });

        dropdownTree.nodeSelection(4, false);

        const deselectedNode = dropdownTree.findNodeFromId(4);
        expect(deselectedNode?.isSelected).toBe(false);
    });
    it('should handle maxSelectCount constraint when selectionVal is true', () => {
        dropdownTree.config.isHierarchySelectionModificationAllowed = true;
        dropdownTree.insert(1, { dataUniqueFieldValue: 6, label: 'Node 6' });
        dropdownTree.insert(1, { dataUniqueFieldValue: 7, label: 'Node 7' });

        dropdownTree.nodeSelection(6, true);
        dropdownTree.nodeSelection(7, true);

        dropdownTree.nodeSelection(6, true);

        const newNode = dropdownTree.findNodeFromId(6);
        const lastSelectedNode = dropdownTree.findNodeFromId(7);
        expect(newNode?.isSelected).toBe(true);
        expect(lastSelectedNode?.isSelected).toBe(true);
    });
    it('should handle hierarchySelectionModification when isHierarchySelectionModificationAllowed is true', () => {
        dropdownTree.config.isHierarchySelectionModificationAllowed = true;
        dropdownTree.insert(1, { dataUniqueFieldValue: 8, label: 'Node 8' });
        dropdownTree.insert(1, { dataUniqueFieldValue: 9, label: 'Node 9', parent: 8, isDataDisabled: true });
        dropdownTree.insert(1, { dataUniqueFieldValue: 10, label: 'Node 10', parent: 8 });
        dropdownTree.insert(1, { dataUniqueFieldValue: 11, label: 'Node 11', parent: 9 });

        dropdownTree.nodeSelection(9, true);

        const node8 = dropdownTree.findNodeFromId(8);
        const node9 = dropdownTree.findNodeFromId(9);
        const node10 = dropdownTree.findNodeFromId(10);
        const node11 = dropdownTree.findNodeFromId(11);
        expect(node8?.isSelected).toBe(false);
        expect(node9?.isSelected).toBe(false);
        expect(node10?.isSelected).toBe(false);
        expect(node11?.isSelected).toBe(false);
    });
    it('should return preSelectedFieldValues when no nodes are selected in the tree', () => {
        dropdownTree.insert(1, { dataUniqueFieldValue: 2, label: 'Node 2' });
        dropdownTree.insert(1, { dataUniqueFieldValue: 3, label: 'Node 3' });

        dropdownTree.nodeSelection(2, true);
        dropdownTree.nodeSelection(3, true);

        dropdownTree.selectAll();

        const selectedNodes = dropdownTree.getCurrentSelectedNodes();

        expect(selectedNodes.length).toBe(2);
        expect(selectedNodes[0].dataUniqueFieldValue).toBe(2);
        expect(selectedNodes[1].dataUniqueFieldValue).toBe(3);
    });
    it('should return all selected nodes when isHierarchySelectionModificationAllowed is false', () => {
        dropdownTree.insert(1, { dataUniqueFieldValue: 4, label: 'Node 4' });
        dropdownTree.insert(4, { dataUniqueFieldValue: 5, label: 'Node 5', parent: 4 });
        dropdownTree.insert(4, { dataUniqueFieldValue: 6, label: 'Node 6', parent: 4 });

        dropdownTree.nodeSelection(4, true);
        dropdownTree.nodeSelection(5, true);

        const selectedNodes = dropdownTree.getCurrentSelectedNodes();

        expect(selectedNodes.length).toBe(2);
        expect(selectedNodes[0].dataUniqueFieldValue).toBe(4);
        expect(selectedNodes[1].dataUniqueFieldValue).toBe(5);
    });
    it('should handle isHierarchySelectionModificationAllowed true with hierarchy modifications', () => {
        dropdownTree.config.isHierarchySelectionModificationAllowed = true;
        dropdownTree.insert(1, { dataUniqueFieldValue: 7, label: 'Node 7' });
        dropdownTree.insert(7, { dataUniqueFieldValue: 8, label: 'Node 8', parent: 7 });
        dropdownTree.insert(7, { dataUniqueFieldValue: 9, label: 'Node 9', parent: 7 });

        dropdownTree.nodeSelection(7, true);
        dropdownTree.nodeSelection(8, true);
        dropdownTree.nodeSelection(9, true);

        const selectedNodes = dropdownTree.getCurrentSelectedNodes();

        expect(selectedNodes.length).toBe(2);
        expect(selectedNodes[0].dataUniqueFieldValue).toBe(7);
        expect(selectedNodes[1].dataUniqueFieldValue).toBe(7);
    });
});
