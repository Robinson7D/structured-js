'use strict';

// Dependencies:
import BinaryHeap from "../heap/binary_heap";

// API:
PriorityQueue.prototype.enqueue = insertWithPriority;
PriorityQueue.prototype.add = PriorityQueue.prototype.enqueue;

PriorityQueue.prototype.dequeue = dequeueHighestPriority;
PriorityQueue.prototype.remove = PriorityQueue.prototype.dequeue;

PriorityQueue.prototype.peek = peek;
PriorityQueue.prototype.getSize = getSize;

// Exit:
export default PriorityQueue;


// Functions:
function PriorityQueue(config){ // Constructor:
  this.__elements = new BinaryHeap({
    comparator: priorityQueueComparitor
  });
}

function priorityQueueComparitor(elementA, elementB){
  return elementA.priority > elementB.priority;
}

function insertWithPriority(element, priority) {
  this.__elements.push({ element, priority });
}

function dequeueHighestPriority() {
  if(this.getSize()){ // Otherwise, undefined...
    return this.__elements.pop()['element'];
  }
}

function peek() {
  if(this.getSize()){ // Otherwise, undefined...
    return this.__elements.peek()['element'];
  }
}

function getSize(){
  return this.__elements.getSize();
}