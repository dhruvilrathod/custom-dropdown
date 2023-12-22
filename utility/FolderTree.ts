// class TreeNode {

//     private _key: any;
//     private _value: any;
//     private _parent: any;
//     private _children: any;

//     constructor(key: any, value: any = key, parent: any = null) {
//         this._key = key;
//         this._value = value;
//         this._parent = parent;
//         this._children = [];
//     }

//     get isLeaf() {
//         return this._children.length === 0;
//     }

//     get hasChildren() {
//         return !this.isLeaf;
//     }
// }

// class Tree {

//     private _root: TreeNode;
    
//     constructor(key: any, value: any = key) {
//         this._root = new TreeNode(key, value);
//     }

//     *preOrderTraversal(node = this._root) {
//         yield node;
//         if (node.children.length) {
//             for (let child of node.children) {
//                 yield* this.preOrderTraversal(child);
//             }
//         }
//     }

//     *postOrderTraversal(node = this._root) {
//         if (node._children.length) {
//             for (let child of node.children) {
//                 yield* this.postOrderTraversal(child);
//             }
//         }
//         yield node;
//     }

//     insert(parentNodeKey: any, key: any, value = key) {
//         for (let node of this.preOrderTraversal()) {
//             if (node._key === parentNodeKey) {
//                 node._children.push(new TreeNode(key, value, node));
//                 return true;
//             }
//         }
//         return false;
//     }

//     remove(key: any) {
//         for (let node of this.preOrderTraversal()) {
//             const filtered = node._children.filter((c: any) => c._key !== key);
//             if (filtered.length !== node._children.length) {
//                 node._children = filtered;
//                 return true;
//             }
//         }
//         return false;
//     }

//     find(key: any) {
//         for (let node of this.preOrderTraversal()) {
//             if (node._key === key) return node;
//         }
//         return undefined;
//     }
// }