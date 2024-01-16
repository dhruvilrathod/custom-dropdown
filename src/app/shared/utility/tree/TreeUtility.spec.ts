import { TreeUtility } from './TreeUtility';
import { Tree } from './Tree';
import { TreeNode } from './TreeNode';
import { IDropDownTreeConfig } from '../../interfaces/custom-select.inteface';
import { DropdownTree } from './DropdownTree';
describe('TreeUtility', () => {
    let tree: Tree;
    let rootNode: TreeNode;
    let config: IDropDownTreeConfig;
    let originalData: any;
    let preSelectedDataValues: TreeNode[];
    beforeEach(() => {
        const treeConfig = {
            dataUniqueFieldSrc: 'id',
            dataVisibleNameSrc: 'name',
            dataTooltipSrc: 'tooltip',
            dataExpandableSrc: 'expandable',
            dataChildrenSrc: 'children',
        };
        config = {
            dataUniqueFieldSrc: 'id',
            dataVisibleNameSrc: 'name',
            dataTooltipSrc: 'tooltip',
            dataExpandableSrc: 'expandable',
            dataChildrenSrc: 'children',
            isRequired: true,
            isDisabled: false,
        };
        preSelectedDataValues = [
            new TreeNode({ id: 2, name: 'Node 2' }, config),
        ];

        originalData = {
            id: 1,
            name: 'Node 1',
            tooltip: 'Node 1 Tooltip',
            expandable: true,
            children: [],
        };
        const rootData = {
            id: 1,
            name: 'Root',
            children: [
                { id: 2, name: 'Child1', children: [] },
                { id: 3, name: 'Child2', children: [] },
            ],
        };
        tree = new Tree(treeConfig, rootData);
        rootNode = tree.root;
    });
    it('should add property at a single-level path', () => {
        const dataObj = {};
        const path = 'name';
        const value = 'John';
        const result = TreeUtility.propertyAdd(dataObj, path, value);
        expect(result).toEqual({ name: 'John' });
    });
    it('should add property at a multi-level path', () => {
        const dataObj = {};
        const path = 'person/name';
        const value = 'John';
        const result = TreeUtility.propertyAdd(dataObj, path, value);
        expect(result).toEqual({ person: { name: 'John' } });
    });
    it('should access property from a single-level path', () => {
        const dataObj = { name: 'John', age: 30 };
        const path = 'name';
        const result = TreeUtility.propertyAccess(dataObj, path);
        expect(result).toBe('John');
    });
    it('should access property from a multi-level path', () => {
        const dataObj = { person: { name: 'John', age: 30 } };
        const path = 'person/name';
        const result = TreeUtility.propertyAccess(dataObj, path);
        expect(result).toBe('John');
    });
    it('should return empty string for invalid path', () => {
        const dataObj = { name: 'John' };
        const path = null;
        const result = TreeUtility.propertyAccess(dataObj, path as any);
        expect(result).toBe('');
    });
    it('should traverse nodes in pre-order and call operatorFunction', () => {
        const operatorFunctionSpy = jasmine.createSpy('operatorFunction');
        TreeUtility.traverseAllNodes(tree, 'pre-order', operatorFunctionSpy);
        expect(operatorFunctionSpy).toHaveBeenCalledTimes(tree.root.children.length + 1);
    });
    it('should traverse nodes in post-order and call operatorFunction', () => {
        const operatorFunctionSpy = jasmine.createSpy('operatorFunction');
        TreeUtility.traverseAllNodes(tree, 'post-order', operatorFunctionSpy);
        expect(operatorFunctionSpy).toHaveBeenCalledTimes(tree.root.children.length + 1);
    });
    it('should stop traversal when stopperFunction returns true', () => {
        const operatorFunctionSpy = jasmine.createSpy('operatorFunction');
        const stopperFunction = (node: TreeNode) => node.dataUniqueFieldValue === 2;
        TreeUtility.traverseAllNodes(tree, 'pre-order', operatorFunctionSpy, undefined, stopperFunction);
        expect(operatorFunctionSpy).toHaveBeenCalled();
    });
    it('should stop traversal with last operation performed if stopWithLastOperationPerformed is true', () => {
        const operatorFunctionSpy = jasmine.createSpy('operatorFunction');
        const stopperFunction = (node: TreeNode) => node.dataUniqueFieldValue === 2;
        TreeUtility.traverseAllNodes(tree, 'pre-order', operatorFunctionSpy, undefined, stopperFunction, true);
        expect(operatorFunctionSpy).toHaveBeenCalled();
    });
    it('should continue traversal without last operation performed if stopWithLastOperationPerformed is false', () => {
        const operatorFunctionSpy = jasmine.createSpy('operatorFunction');
        const stopperFunction = (node: TreeNode) => node.dataUniqueFieldValue === 2;
        TreeUtility.traverseAllNodes(tree, 'pre-order', operatorFunctionSpy, undefined, stopperFunction, false);
        expect(operatorFunctionSpy).toHaveBeenCalled();
    });
    it('should call operatorFunction when stopperFunction returns true and stopWithLastOperationPerformed is true', () => {
        const operatorFunctionSpy = jasmine.createSpy('operatorFunction');
        const stopperFunctionSpy = jasmine.createSpy('stopperFunction').and.returnValue(true);
        TreeUtility.traverseAllNodes(tree, 'pre-order', operatorFunctionSpy, undefined, stopperFunctionSpy, true);
        expect(stopperFunctionSpy).toHaveBeenCalledOnceWith(rootNode);
        expect(operatorFunctionSpy).toHaveBeenCalledOnceWith(rootNode);
    });
    it('should create a TreeNode with default selection value as false', () => {
        const treeNode = TreeUtility.createExpliciteDropdownTreeNode(originalData, config);
        expect(treeNode.isSelected).toBeFalse();
        expect(treeNode.dataUniqueFieldValue).toBe(originalData.id);
        expect(treeNode.dataVisibleNameValue).toBe(originalData.name);
    });
    it('should create a TreeNode with custom selection value', () => {
        const customSelectionValue = true;
        const treeNode = TreeUtility.createExpliciteDropdownTreeNode(originalData, config, customSelectionValue);
        expect(treeNode.isSelected).toBe(customSelectionValue);
        expect(treeNode.dataUniqueFieldValue).toBe(originalData.id);
        expect(treeNode.dataVisibleNameValue).toBe(originalData.name);
    });
    it('should create a DropdownTree without pre-selected nodes', () => {
        const dropdownTree = TreeUtility.createExpliciteDropdownTree(originalData, config);
        expect(dropdownTree instanceof DropdownTree).toBeTrue();
        expect(dropdownTree.config).toEqual(config);
        expect(dropdownTree.root.dataUniqueFieldValue).toBe(1);
        expect(dropdownTree.root.dataVisibleNameValue).toBe('Node 1');
    });
    it('should create a DropdownTree with pre-selected nodes', () => {
        const dropdownTree = TreeUtility.createExpliciteDropdownTree(originalData, config, preSelectedDataValues);
        expect(dropdownTree instanceof DropdownTree).toBeTrue();
        expect(dropdownTree.config).toEqual(config);
        expect(dropdownTree.root.dataUniqueFieldValue).toBe(1);
        expect(dropdownTree.root.dataVisibleNameValue).toBe('Node 1');

    });
});
