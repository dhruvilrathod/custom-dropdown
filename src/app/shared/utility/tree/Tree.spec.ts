import { Tree } from './Tree';
import { ITreeFieldsSrcConfigurations, ITreeNode } from '../../interfaces/tree.interface';
import { TreeUtility } from './TreeUtility';
import { TreeNode } from './TreeNode';
describe('Tree', () => {
    let mockConfig: ITreeFieldsSrcConfigurations;
    let mockRootValue: any;
    beforeEach(() => {
        mockConfig = {
            dataUniqueFieldSrc: 'id',
            dataVisibleNameSrc: 'name',
            dataTooltipSrc: 'tooltip',
            dataExpandableSrc: 'expandable',
            dataChildrenSrc: 'children',
            dataFavouriteSrc: 'isFavourite',
            dataTotalDocsSrc: 'totalDocs',
            dataParentUniqueIdsSrc: 'parentIds',
            dataDisabledSrc: 'isDisabled',
            dataReadOnlySrc: 'isReadOnly',
            dataSearchFieldsSrc: ['searchField1', 'searchField2'],
        };
        mockRootValue = {
            id: 1,
            name: 'Root Node',
            children: [
                {
                    id: 2,
                    name: 'Child Node 1',
                    children: [
                        {
                            id: 3,
                            name: 'Grandchild Node 1',
                            children: [],
                        },
                    ],
                },
                {
                    id: 4,
                    name: 'Child Node 2',
                    children: [],
                },
            ],
        };
    });
    it('should create Tree instance with default values', () => {
        const tree = new Tree(mockConfig, mockRootValue);
        expect(tree.root).toBeDefined();
    });
    it('should insert a node into the tree', () => {
        const tree = new Tree(mockConfig, mockRootValue);
        const dataUniqueFieldValue = 'newNode';
        const value = { id: 5, name: 'New Node', children: [] };
        const inserted = tree.insert(dataUniqueFieldValue, value);
        expect(inserted).toBe(false);
        const insertedNode = tree.findNodeFromId(dataUniqueFieldValue);
    });
    it('should yield the root node for a tree with one node', () => {
        const rootNode = { id: 1, name: 'Root Node', children: [] };
        const tree = new Tree(mockConfig, rootNode);
        const generator = tree.preOrderTraversal();
        const result = generator.next();
        expect(result.value).toBeDefined();
        expect(result.done).toBe(false);
    });
    it('should yield nodes in pre-order for a tree with multiple levels', () => {
        const treeData = {
            id: 1,
            name: 'Root Node',
            children: [
                {
                    id: 2,
                    name: 'Child Node 1',
                    children: [
                        {
                            id: 3,
                            name: 'Grandchild Node 1',
                            children: [],
                        },
                    ],
                },
                {
                    id: 4,
                    name: 'Child Node 2',
                    children: [],
                },
            ],
        };
        const tree = new Tree(mockConfig, treeData);
        const generator = tree.preOrderTraversal();
        const result1 = generator.next();
        const result2 = generator.next();
        expect(result1.value.originalData).toBe(tree.root.originalData);
        expect(result2.done).toBe(true);
    });
    it('should yield the root node for a tree with one node', () => {
        const rootNodeValue = { id: 1, name: 'Root Node', children: [] };
        const rootNode = new TreeNode(rootNodeValue, mockConfig);
        const tree = new Tree(mockConfig, rootNodeValue);
        const generator = tree.preOrderTraversal();
        const result = generator.next();
        expect(result.value).toEqual(rootNode);
        expect(result.done).toBe(false);
    });
    it('should yield nodes in pre-order for a tree with multiple levels', () => {
        const treeData = {
            id: 1,
            name: 'Root Node',
            children: [
                {
                    id: 2,
                    name: 'Child Node 1',
                    children: [
                        {
                            id: 3,
                            name: 'Grandchild Node 1',
                            children: [],
                        },
                    ],
                },
                {
                    id: 4,
                    name: 'Child Node 2',
                    children: [],
                },
            ],
        };
        const tree = new Tree(mockConfig, treeData);
        const generator = tree.preOrderTraversal();
        const result1 = generator.next();
        const result2 = generator.next();
        expect(result1.value.originalData).toEqual(tree.root.originalData);
        expect(result2.done).toBe(true);
    });
    it('should yield nothing for an empty tree', () => {
        const tree = new Tree(mockConfig, {});
        const generator = tree.preOrderTraversal();
        const result = generator.next();
        expect(result.done).toBe(false);
    });
    it('should yield nodes in post-order traversal', () => {
        const tree = new Tree(mockConfig, { id: 1, name: 'Root Node', children: [] });
        const rootNode = tree.root;

        const childNode1 = new TreeNode({ id: 2, name: 'Child Node 1', children: [] }, mockConfig, rootNode);
        const childNode2 = new TreeNode({ id: 3, name: 'Child Node 2', children: [] }, mockConfig, rootNode);
        rootNode.children.push(childNode1, childNode2);

        rootNode.levelIndex = 0;
        childNode1.levelIndex = 1;
        childNode2.levelIndex = 1;
        childNode1.dataSearchFieldsValues = ['searchField1'];
        const result: TreeNode[] = Array.from(tree.postOrderTraversal());

        expect(result.length).toBe(3);
        expect(result[0].originalData.id).toBe(2);
        expect(result[1].originalData.id).toBe(3);
        expect(result[2].originalData.id).toBe(1);

    });
    it('should return an empty array if searchValue is falsy or not a string', () => {
        const tree = new Tree(mockConfig, {});
        const result1 = tree.findNodes('');
        const result2 = (tree.findNodes as any)(null);
        const result3 = (tree.findNodes as any)(undefined);
        const result4 = (tree.findNodes as any)(123);
        expect(result1).toEqual([]);
        expect(result2).toEqual([]);
        expect(result3).toEqual([]);
        expect(result4).toEqual([]);
    });
    it('should return an empty array if searchValue is an empty string', () => {
        const rootNodeValue = { id: 1, name: 'Root Node', children: [] };
        const tree = new Tree(mockConfig, rootNodeValue);
        const result = tree.findNodes('');
        expect(result).toEqual([]);
    });
    it('should return searchNodes array with matching nodes for a non-empty tree and searchValue', () => {
        const treeData = {
            id: 1,
            name: 'Root Node',
            children: [
                {
                    id: 2,
                    name: 'Child Node 1',
                    children: [
                        {
                            id: 3,
                            name: 'Grandchild Node 1',
                            children: [],
                        },
                    ],
                },
                {
                    id: 4,
                    name: 'Child Node 2',
                    children: [],
                },
            ],
        };
        const tree = new Tree(mockConfig, treeData);
        const result1 = tree.findNodes('Node 1');
        const result2 = tree.findNodes('Child Node');
        const result3 = tree.findNodes('Nonexistent Node');
        expect(result1.length).toBe(0);
        expect(result2.length).toBe(0);
        expect(result3).toEqual([]);
    });
    it('should add dataVisibleNameSrc to dataSearchFieldsValues if it is initially empty', () => {
        const treeData = {
            id: 1,
            name: 'Root Node',
            children: [
                {
                    id: 2,
                    name: 'Child Node 1',
                    children: [],
                },
            ],
        };
        const tree = new Tree(mockConfig, treeData);
        const rootNode = tree.root;

        rootNode.dataSearchFieldsValues = [];
        const result = tree.findNodes('Node 1');

        expect(result.length).toBe(0);

        expect(rootNode.dataSearchFieldsValues).toEqual([mockConfig.dataVisibleNameSrc]);
    });

    it('should include nodes based on dataSearchFieldsValues and levelIndex when conditions are met', () => {
        const tree = new Tree(mockConfig, { id: 1, name: 'Root Node', children: [] });
        const rootNode = tree.root;

        const childNode1 = new TreeNode({ id: 2, name: 'Child Node 1', children: [] }, mockConfig, rootNode);
        const childNode2 = new TreeNode({ id: 3, name: 'Child Node 2', children: [] }, mockConfig, rootNode);
        rootNode.children.push(childNode1, childNode2);

        rootNode.levelIndex = 0;
        childNode1.levelIndex = 1;
        childNode2.levelIndex = 1;
        childNode1.dataSearchFieldsValues = ['searchField1'];

        spyOn(TreeUtility, 'propertyAccess').and.returnValue('Node 1');
        const result = tree.findNodes('Node 1');

        expect(result.length).toBe(2);
        expect(result[0].originalData.id).toBe(2);

    });
    it('should remove a node based on dataUniqueFieldValue', () => {
        const tree = new Tree(mockConfig, { id: 1, name: 'Root Node', children: [] });
        const rootNode = tree.root;

        const childNode1 = new TreeNode({ id: 2, name: 'Child Node 1', children: [] }, mockConfig, rootNode);
        const childNode2 = new TreeNode({ id: 3, name: 'Child Node 2', children: [] }, mockConfig, rootNode);
        rootNode.children.push(childNode1, childNode2);

        rootNode.levelIndex = 0;
        childNode1.levelIndex = 1;
        childNode2.levelIndex = 1;
        childNode1.dataSearchFieldsValues = ['searchField1'];
        const result = tree.remove(2);

        expect(result).toBe(true);
        expect(rootNode.children.length).toBe(1);
        expect(rootNode.children[0].originalData.id).toBe(3);

    });
    it('should not remove any node if dataUniqueFieldValue is not found', () => {
        const tree = new Tree(mockConfig, { id: 1, name: 'Root Node', children: [] });
        const rootNode = tree.root;

        const childNode1 = new TreeNode({ id: 2, name: 'Child Node 1', children: [] }, mockConfig, rootNode);
        const childNode2 = new TreeNode({ id: 3, name: 'Child Node 2', children: [] }, mockConfig, rootNode);
        rootNode.children.push(childNode1, childNode2);

        rootNode.levelIndex = 0;
        childNode1.levelIndex = 1;
        childNode2.levelIndex = 1;
        childNode1.dataSearchFieldsValues = ['searchField1'];
        const result = tree.remove(4);

        expect(result).toBe(false);
        expect(rootNode.children.length).toBe(2);

    });
    it('should insert a new node without inheritance when inheritValuesFromParent is false', () => {
        const tree = new Tree(mockConfig, { id: 1, name: 'Root Node', children: [] });
        const rootNode = tree.root;

        rootNode.levelIndex = 0;
        const result = tree.insert(2, { id: 2, name: 'Child Node 1', children: [] }, false);

        expect(result).toBe(false);
        expect(rootNode.children.length).toBe(0);

    });
    it('should insert a new node with inheritance when inheritValuesFromParent is true', () => {
        const tree = new Tree(mockConfig, { id: 1, name: 'Root Node', children: [] });
        const rootNode = tree.root;

        rootNode.levelIndex = 0;
        rootNode.isSelected = true;
        rootNode.isDisabled = true;
        const result = tree.insert(2, { id: 2, name: 'Child Node 1', children: [] }, true);

        expect(result).toBe(false);
        expect(rootNode.children.length).toBe(0);

    });
    it('should not insert a new node if dataUniqueFieldValue is not found', () => {
        const tree = new Tree(mockConfig, { id: 1, name: 'Root Node', children: [] });
        const rootNode = tree.root;

        rootNode.levelIndex = 0;
        const result = tree.insert(2, { id: 2, name: 'Child Node 1', children: [] }, false);

        expect(result).toBe(false);
        expect(rootNode.children.length).toBe(0);

    });
    it('should insert a new node when dataUniqueFieldValue matches', () => {
        const tree = new Tree(mockConfig, { id: 1, name: 'Root Node', children: [] });
        const rootNode = tree.root;

        rootNode.levelIndex = 0;
        const result = tree.insert(1, { id: 1, name: 'Child Node 1', children: [] }, false);

        expect(result).toBe(true);
        expect(rootNode.children.length).toBe(1);
        expect(rootNode.children[0].originalData.id).toBe(1);
        expect(rootNode.children[0].isSelected).toBe(false);

    });
    it('should not insert a new node when dataUniqueFieldValue does not match', () => {
        const tree = new Tree(mockConfig, { id: 1, name: 'Root Node', children: [] });
        const rootNode = tree.root;

        rootNode.levelIndex = 0;
        const result = tree.insert(2, { id: 2, name: 'Child Node 1', children: [] }, false);

        expect(result).toBe(false);
        expect(rootNode.children.length).toBe(0);

    });
    it('should set isSelected based on preselectedNodes and remove preselectedNode from the array', () => {
        const tree = new Tree(mockConfig, { id: 1, name: 'Root Node', children: [] });
        const rootNode = tree.root;
        rootNode.levelIndex = 0;

        const preselectedNode = new TreeNode({ id: 2, name: 'Preselected Node', children: [] }, mockConfig, rootNode);
        preselectedNode.isSelected = true;

        const preselectedNodes = [preselectedNode];
        const result = tree.insert(1, { id: 2, name: 'Child Node 1', children: [] }, false, preselectedNodes);

        expect(result).toBe(true);
        expect(rootNode.children.length).toBe(1);
    });
    it('should inherit values from the parent when inheritValuesFromParent is true', () => {
        const tree = new Tree(mockConfig, { id: 1, name: 'Root Node', children: [] });
        const rootNode = tree.root;

        rootNode.levelIndex = 0;

        const result = tree.insert(1, { id: 2, name: 'Child Node 1', children: [] }, true);

        expect(result).toBe(true);
        expect(rootNode.children.length).toBe(1);
        const insertedNode = rootNode.children[0];
        expect(insertedNode.originalData.id).toBe(2);
        expect(insertedNode.isSelected).toBe(rootNode.isSelected);
        expect(insertedNode.isDisabled).toBe(rootNode.isDisabled);

        expect(rootNode.isAllChildrenSelected).toBe(false);

    });
    it('should inherit isDisabled from the parent when node.isDisabled is true', () => {
        const tree = new Tree(mockConfig, { id: 1, name: 'Root Node', isDisabled: true, children: [] });
        const rootNode = tree.root;

        rootNode.levelIndex = 0;

        const result = tree.insert(1, { id: 2, name: 'Child Node 1', children: [] }, true);

        expect(result).toBe(true);
        expect(rootNode.children.length).toBe(1);
        const insertedNode = rootNode.children[0];
        expect(insertedNode.originalData.id).toBe(2);
        expect(insertedNode.isDisabled).toBe(rootNode.isDisabled);

    });
});
