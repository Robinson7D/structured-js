'use strict';

// API:
BinaryHeap.prototype.insert = insert;
BinaryHeap.prototype.push = BinaryHeap.prototype.insert;

BinaryHeap.prototype.remove = remove;
BinaryHeap.prototype.pop = BinaryHeap.prototype.remove;

BinaryHeap.prototype.peek = peek;
BinaryHeap.prototype.getSize = getSize;

BinaryHeap.prototype._comparator = defaultComparator; // Max Heap by deafult
BinaryHeap.prototype._sinkDownBalance = sinkDownBalance;
BinaryHeap.prototype._bubbleUpBalance = bubbleUpBalance;

// Exit
export default BinaryHeap;

// Functions:
function BinaryHeap(config){ // Constructor
	config = config || {};
	if(config.comparator){
		this._comparator = config.comparator;
	}
	this.__elements = [];
}

// Functions:
function peek() {
	return this.__elements[0];
}

function insert(element) {
	this.__elements[this.getSize()] = element;
	this._bubbleUpBalance();
	this._sinkDownBalance();
}

function remove() {
	var lastIndex = this.getSize() - 1;
	if(lastIndex !== -1){
		var element = this.__elements[0],
				last = this.__elements[lastIndex];

		this.__elements[0] = last;
		this.__elements.length = lastIndex; // Remove last item
		this._sinkDownBalance();

		return element;
	}
}

function getSize(){
	return this.__elements.length;
}

function defaultComparator(elementA, elementB){ // Max Heap by deafult
	return elementA > elementB;
}

function bubbleUpBalance(){
	var i = this.getSize() - 1,
			element = this.__elements[i],
			parentIndex = 0,
			parent = element;

	while (i > 0){
		parentIndex = getParentIndex(i);
		parent = this.__elements[parentIndex];
		// DONE!
		if(this._comparator(parent, element)) break;

		// Swap and keep going
		this.__elements[i] = parent;
		this.__elements[parentIndex] = element;
		i = parentIndex;
	}
}

function getParentIndex(i){
	return Math.floor((i - 1) / 2);
}

function sinkDownBalance(){
	var size = this.getSize(),
			elements = this.__elements,
			i = 0,
			element = this.__elements[0],
			comparedIndex = 0,
			compared = element,
			comparedIndexRight = 0,
			comparedRight = element;

	while ((comparedIndex = getLeftChildIndex(i)) < size){
		compared = elements[comparedIndex];
		comparedIndexRight = comparedIndex + 1;

		if(comparedIndexRight < size){
			comparedRight = elements[comparedIndexRight];

			if(this._comparator(comparedRight, compared)){ // Use right child!
				compared = comparedRight;
				comparedIndex = comparedIndexRight;
			}
		}

		if(!this._comparator(compared, element)) break; // Done; everything is settled.

		// Swap:
		elements[i] = compared;
		elements[comparedIndex] = element;
		i = comparedIndex; // Keep on bubblin'
	}
}

function getLeftChildIndex(i){
	return (2 * i) + 1;
}