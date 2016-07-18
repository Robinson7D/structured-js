import BinaryHeap from '../../src/heap/binary_heap';
import {buildSmallDistributed} from '../../helpers/number_array_builders';
import itBehavesLikeAHeap from './_binary_heap';

let expect = require('chai').expect;

describe('BinaryHeap', function(){
  itBehavesLikeAHeap(BinaryHeap);

  describe('Max-Heap (which this is) properties', function(){
    let heap, elements;
    beforeEach(function(){
      heap = new BinaryHeap();
      elements = buildSmallDistributed(50);
      elements.forEach((val)=> heap.push(val));
    });

    it('removes the largest element', function(){
      let largest = heap.pop();

      let largestRemaining = Math.max.apply([], heap.__elements);
      expect(largest).to.be.above(largestRemaining);
    });

    it('is ordered to provide from largest to smallest', function(){
      elements.sort(numberSortDesc).forEach(function(nextExpected){
        expect(heap.pop()).to.equal(nextExpected);
      });
    });
  });
  // TODO: test the heap's tree structuring
});

function numberSortDesc(a, b){
  return b - a;
}