'use strict';

// Dependencies:
import BinaryHeap from "./binary_heap";

// Inherit prototype:
BinaryMinHeap.prototype = Object.create(BinaryHeap.prototype);
BinaryMinHeap.prototype.constructor = BinaryMinHeap;

BinaryMinHeap.prototype.constructor = BinaryMinHeap;
BinaryMinHeap.prototype._comparator = minComparitor;

// Exit
export default BinaryMinHeap;

// Functions:
function BinaryMinHeap(config){ // Constructor
  return BinaryHeap.apply(this, arguments);
}

function minComparitor(elementA, elementB){
  return elementA < elementB;
}