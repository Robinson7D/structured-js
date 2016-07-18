'use strict';

// Dependencies:
import NaiveBinarySearchTree from "./naive_binary_search_tree";

// API:
// Most methods can utilize the generic NaiveBinarySearchTree's methods.
// Searching, getting the size, and updating counts, are all exactly the same.
//
// However, anything related to actually adding/removing nodes from the
// tree will have to override in order to utilize AVL tree balancing.
AVLTree.prototype = Object.create(NaiveBinarySearchTree.prototype);
AVLTree.prototype.constructor = AVLTree;

AVLTree.prototype._buildNode = _buildNode;
AVLTree.prototype._addNewNode = _addNewNode;
AVLTree.prototype._removeNode = _removeNode;

AVLTree.prototype._rotateLeft = buildRotationFn("rightChild", "leftChild");
AVLTree.prototype._rotateRight = buildRotationFn("leftChild", "rightChild");
AVLTree.prototype._updateParentReference = _updateParentReference;

// Exit:
export default AVLTree;

// Functions:
function AVLTree(config){ // Constructor:
  return NaiveBinarySearchTree.apply(this, arguments);
}

function _buildNode(value){ // Constructor:
  return {
    parent: null,
    value: value,
    leftChild: undefined,
    rightChild: undefined,
    count: 1,

    // AVL Tree properties:
    height: 1,
    balancingFactor: 0, // Number of levels below (and including) this
  };
}

function _addNewNode(node, closestNode){
  node.parent = closestNode;

  if(node.value < closestNode.value){
    closestNode.leftChild = node;
  }
  else {
    closestNode.rightChild = node;
  }

  rebalanceUp.call(this, closestNode); // AVL TIME!
}

function _removeNode(node){
  if(node.leftChild && node.rightChild){
    let weighedLeft = (node.balancingFactor >= 0);
    let side = weighedLeft ? 'leftChild' : 'rightChild';
    let replacement = weighedLeft ? _largestDescendent(node[side]) : _smallestDescendent(node[side]);
    let replacementsParent = replacement.parent;
    let replacementsChild = replacement[side]; // If it exists

    this._updateParentReference(replacement, replacementsChild);

    // Update references of node-being-removed's children to point to its replacement
    setChild(replacement, 'leftChild', node.leftChild);
    setChild(replacement, 'rightChild', node.rightChild);

    // Update the node's parent to hold the replacement as its child
    this._updateParentReference(node, replacement);
    rebalanceUp.call(this, replacementsChild || replacementsParent); // Lowest relevant node
  }
  else {
    let child = node.leftChild || node.rightChild;
    let parent = node.parent;

    this._updateParentReference(node, child); // So I'm lazy...
    rebalanceUp.call(this, parent);
  }
}

function _largestDescendent(node){
  while(node.rightChild){ node = node.rightChild; }
  return node;
}

function _smallestDescendent(node){
  while(node.leftChild){ node = node.leftChild; }
  return node;
}

function rebalanceUp(closestNode){
  while(closestNode){
    updateHeightAndBalance(closestNode);

    if(closestNode.balancingFactor > 1) { // Pivot up the left side:
      if(closestNode.leftChild.balancingFactor < 0){ // Double right:
        this._rotateLeft(closestNode.leftChild);
      }
      this._rotateRight(closestNode);
    }
    else if(closestNode.balancingFactor < -1) { // Pivot up the right:
      if(closestNode.rightChild.balancingFactor > 0){ // Double left:
        this._rotateRight(closestNode.rightChild);
      }
      this._rotateLeft(closestNode);
    }

    closestNode = closestNode.parent;
  }
}

function updateHeightAndBalance(node){
  let leftChildHeight = node.leftChild ? node.leftChild.height : 0;
  let rightChildHeight = node.rightChild ? node.rightChild.height : 0;

  node.height = Math.max(leftChildHeight, rightChildHeight) + 1;
  node.balancingFactor = leftChildHeight - rightChildHeight;
}

function buildRotationFn(liftedProp, otherProp){
  return function (node){
    let liftedChild = node[liftedProp];

    setChild(node, liftedProp, liftedChild[otherProp])
    liftedChild[otherProp] = node;
    this._updateParentReference(node, liftedChild);
    node.parent = liftedChild;

    // Update heights and balances:
    // TODO: I expect there's a more clever way to do this,
    //      (e.g. liftedChild height -1 or -2 based on if otherProp was lifted, etc.)
    updateHeightAndBalance(node);
    updateHeightAndBalance(liftedChild);

    return liftedChild;
  }
}

function _updateParentReference(node, newChild){
  let parent = node.parent;

  if(parent){
    let childProperty = (parent.rightChild === node) ? "rightChild" : "leftChild";

    setChild(parent, childProperty, newChild);
  }
  else {
    this.head = newChild;

    if(newChild){
      newChild.parent = null;
    }
  }
}

function setChild(node, prop, child){
  node[prop] = child; // Do this part regardless to allow overwriting with undefined values
  if(child){
    child.parent = node;
  }
}