import { TreeNode } from './TreeNode';
import { ITreeFieldsSrcConfigurations, ITreeNode } from '../../interfaces/tree.interface';

describe('TreeNode', () => {
    let mockConfig: ITreeFieldsSrcConfigurations;
    let mockParent: TreeNode;

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

        mockParent = new TreeNode({}, mockConfig);
    });

    it('should create TreeNode instance with default values', () => {
        const treeNode = new TreeNode({}, mockConfig);

        expect(treeNode.isSelected).toBe(false);
       
    });

    it('should create TreeNode instance with provided values', () => {
        const value = {
            isSelected: true,
            isCurrentNodeActive: true,
            isFavourite: true,
            isInvalid: true,
            isCustom: true,
            isExpanded: true,
            isChildernLoading: true,
        };

        const treeNode = new TreeNode(value, mockConfig, mockParent, 2);

        expect(treeNode.isSelected).toBe(true);
       
    });

    it('should calculate isPartiallySelected correctly', () => {
        const child1 = new TreeNode({ isSelected: false }, mockConfig);
        const child2 = new TreeNode({ isSelected: true }, mockConfig);

        const treeNode = new TreeNode({}, mockConfig, mockParent, 2);
        treeNode.children.push(child1, child2);

        expect(treeNode.isPartiallySelected).toBe(true);
    });

    it('should calculate isAllChildrenSelected correctly', () => {
        const child1 = new TreeNode({ isSelected: false }, mockConfig);
        const child2 = new TreeNode({ isSelected: true }, mockConfig);

        const treeNode = new TreeNode({}, mockConfig, mockParent, 2);
        treeNode.children.push(child1, child2);

        expect(treeNode.isAllChildrenSelected).toBe(false);
    });

    it('should return true when there are no children', () => {
        const treeNode = new TreeNode({}, mockConfig);
        expect(treeNode.isLeaf).toBe(true);
    });

    it('should return false when there are children', () => {
        const childNode = new TreeNode({}, mockConfig);
        const treeNode = new TreeNode({}, mockConfig);
        treeNode.children.push(childNode);

        expect(treeNode.isLeaf).toBe(false);
    });

    it('should return false when there are no children', () => {
        const treeNode = new TreeNode({}, mockConfig);
        expect(treeNode.hasChildren).toBe(false);
    });

    it('should return true when there are children', () => {
        const childNode = new TreeNode({}, mockConfig);
        const treeNode = new TreeNode({}, mockConfig);
        treeNode.children.push(childNode);

        expect(treeNode.hasChildren).toBe(true);
    });
   
});
