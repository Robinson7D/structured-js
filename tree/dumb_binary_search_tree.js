'use strict';

// API:
DumbBinarySearchTree.prototype.getSize = getSize;

DumbBinarySearchTree.prototype.findNode = findNode;
DumbBinarySearchTree.prototype._findClosestNode = _findClosestNode;
DumbBinarySearchTree.prototype.contains = contains;

DumbBinarySearchTree.prototype.insert = insert;
DumbBinarySearchTree.prototype.remove = remove;

// Core logic related to moving the nodes around:
DumbBinarySearchTree.prototype._buildNode = _buildNode;
DumbBinarySearchTree.prototype._addNewNode = _addNewNode;
DumbBinarySearchTree.prototype._removeNode = _removeNode;


// Exit:
export default DumbBinarySearchTree;


// Functions:
function DumbBinarySearchTree(config){ // Constructor:
	this.head = undefined;
	this.__size = 0;
}

function _buildNode(element){ // Constructor:
	return {
		parent: null,
		element: element,
		leftChild: undefined,
		rightChild: undefined,
		count: 1,
	};
}

function getSize(){
	return this.__size;
}

function contains(element){
	return !!this.findNode(element);
}

function findNode(element){
	let closestNode = this._findClosestNode(element);

	if(closestNode.element == element){
		return closestNode;
	}
}

function _findClosestNode(searchElement){
	let node = this.head,
			currentElement;

	while(node){
		currentElement = node.element;

		if(searchElement < currentElement && node.leftChild !== undefined){
			node = node.leftChild;
		}
		else if(searchElement > currentElement && node.rightChild !== undefined) {
			node = node.rightChild;
		}
		else {
			return node;
		}
	}
}

function insert(element){
	if(this.head){
		let closestNode = this._findClosestNode(element);

		if(closestNode.element == element){
			closestNode.count++;
		}
		else {
			this._addNewNode(this._buildNode(element), closestNode);
		}
	}
	else {
		this.head = this._buildNode(element);
	}
	this.__size++;
}

function _addNewNode(node, closestNode){
	node.parent = closestNode;

	if(node.element < closestNode.element){
		closestNode.leftChild = node;
	}
	else {
		closestNode.rightChild = node;
	}
}

function remove(element){
	let node = this._findClosestNode(element);

	if(node.element == element){
		if(node.count === 1){
			this._removeNode(node)
		}
		else {
			node.count--;
		}

		this.__size--;
	}
}

function _removeNode(node){
	// LOL so biased to the left. Oh well, this is a _dumb_ tree.
	// Clever branch balancing or weighting will be saved for other trees
	if(node.rightChild){
		// Basically: remove the left sub-tree, but hold onto it.
		// Promote the right sub-tree to where the node was.
		// Finally, search the tree for the new node from which
		// the left sub-tree we're holding should now hang from.
		//
		// This is biased, and inefficient, but for a "DumbBinarySearchTree" it'll do.
		let oldLeftChild = node.leftChild;
		node.leftChild = undefined;
		promoteTo(node.rightChild, node);

		// Send subtree down to where it belongs
		// Can be more efficient by only searching down from
		if(oldLeftChild){
			this._addNewNode(oldLeftChild, this._findClosestNode(oldLeftChild.element));
		}
	}
	else if(node.leftChild) {
		promoteTo(node.leftChild, node);
		// No right subtree, so can just blow it away
	}
	else {
		if(node.parent){
			if (node.parent.leftChild === node){
				node.parent.leftChild = undefined;
			}
			else {
				node.parent.rightChild = undefined;
			}
		}
		else {
			this.head = undefined;
		}
	}
}

function promoteTo(node, oldParent){
	// TODO: consider using the `.parent` property for full Object swap instead
	oldParent.element = node.element;
	oldParent.count = node.count;

	oldParent.leftChild = node.leftChild;
	oldParent.rightChild = node.rightChild;

	// Clean up references:
	if(oldParent.leftChild){
		oldParent.leftChild.parent = oldParent;
	}
	if(oldParent.rightChild){
		oldParent.rightChild.parent = oldParent;
	}
}