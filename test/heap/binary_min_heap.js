import BinaryMinHeap from '../../src/heap/binary_min_heap';
import {buildSmallDistributed} from '../../helpers/number_array_builders';
import itBehavesLikeAHeap from './_binary_heap';

let expect = require('chai').expect;

describe('BinaryMinHeap', function(){
  itBehavesLikeAHeap(BinaryMinHeap);

  describe('Max-Heap (which this is) properties', function(){
    let heap, elements;
    beforeEach(function(){
      heap = new BinaryMinHeap();
      elements = buildSmallDistributed(50);
      elements.forEach((val)=> heap.push(val));
    });

    it('removes the smallest element', function(){
      let largest = heap.pop();

      let largestRemaining = Math.min.apply([], heap.__elements);
      expect(largest).to.be.below(largestRemaining);
    });

    it('is ordered to provide from smallest to largest', function(){
      elements.sort(numberSortAsc).forEach(function(nextExpected){
        expect(heap.pop()).to.equal(nextExpected);
      });
    });
  });
  // TODO: test the heap's tree structuring
});

function numberSortAsc(a, b){
  return a - b;
}