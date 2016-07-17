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
function BinaryHeap(config = {}){ // Constructor
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
	this.__elements.push(element);
	this._bubbleUpBalance();
}

function remove() {
	if(this.getSize() <= 1){
		// Remove and return the only item in the heap (or undefined if there aren't any):
		return this.__elements.pop();
	}
	// Otherwise, for larger heaps:
	var element = this.__elements[0];

	this.__elements[0] = this.__elements.pop(); // Bring last item to the top
	this._sinkDownBalance(); // And then sink it back down

	return element;
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
		this.__elements[parentIndex] = element;
		this.__elements[i] = parent;
		i = parentIndex;
	}
}

function getParentIndex(i){
	/*
	 * TODO: consider Math.floor. Pros and cons for Math.floor below:
	 *       Pros:
	 *           - More readable (counter point: a comment)
	 *           - Allows negatives (counter point: not needed for indexes, duh)
	 *           - Allows > 2^32 elements
	 *							(2^31 because sign bit, but that's after dividing by 2, so 2^32)
	 *							(counter point: not needed)
	 *
	 *       Cons:
	 *           - ~~ is way faster in the benchmarks I've run here!
	*/
	return ~~((i - 1) / 2);
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
		compared = elements[comparedIndex]; // Assume left

		// Test to see if right side is a better candidate:
		comparedIndexRight = comparedIndex + 1;
		if(comparedIndexRight < size){
			comparedRight = elements[comparedIndexRight];

			if(this._comparator(comparedRight, compared)){ // Right child is, indeed, a better candidate than left.
				compared = comparedRight;
				comparedIndex = comparedIndexRight;
			}
		}

		// Neither is suitable (the parent is better than both children),
		// So everything is settled, and we're done.
		if(!this._comparator(compared, element)) break;

		// Swap - raise the stronger child, and demote the parent:
		elements[i] = compared;
		elements[comparedIndex] = element;
		i = comparedIndex; // Keep on sinkin' the parent down
	}
}

function getLeftChildIndex(i){
	return (2 * i) + 1;
}