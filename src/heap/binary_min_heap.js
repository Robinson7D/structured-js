'use strict';

// Dependencies:
import BinaryHeap from "binary_heap";

// Inherit prototype:
BinaryMinHeap.prototype = new BinaryHeap();
BinaryMinHeap.prototype.constructor = BinaryMinHeap;
BinaryMinHeap.prototype._comparator = minComparitor;

// Exit
export BinaryMinHeap;

// Functions:
function BinaryMinHeap(config){ // Constructor
	BinaryHeap.apply(this, arguments);
}

function minComparitor(elementA, elementB){
	return elementA < elementB;
}