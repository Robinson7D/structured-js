import BinaryHeap from '../../src/heap/binary_heap';
import {buildSmallDistributed} from '../../helpers/number_array_builders';

let expect = require('chai').expect;

describe('BinaryHeap', function(){
	describe('static methods', function(){
		describe('constructor', function(){
			it('accepts a comparator function', function(){
				let comparatorFn = function(){};
				let heap = new BinaryHeap({comparator: comparatorFn});

				expect(heap._comparator).to.equal(comparatorFn);
			});
			it('sets an empty elements array', function(){
				let heap = new BinaryHeap();

				expect(heap.__elements).to.be.instanceof(Array);
				expect(heap.__elements).to.be.empty;
			});
		});
	});

	describe('method aliasing', function(){
		describe('remove', function(){
			it('is an alias of pop', function(){
				expect(BinaryHeap.prototype.remove).to.equal(BinaryHeap.prototype.pop);
			});
		});

		describe('insert', function(){
			it('is an alias of push', function(){
				expect(BinaryHeap.prototype.insert).to.equal(BinaryHeap.prototype.push);
			});
		});
	});

	describe('instance', function(){ // TODO: test more finely:
		let heap, elements;

		beforeEach(function(){
			heap = new BinaryHeap();
			elements = buildSmallDistributed(50);
			elements.forEach((val)=> heap.push(val));
		});

		it('is a heap', function(){
			elements.sort(numberSortDesc).forEach(function(nextExpected){
				expect(heap.pop()).to.equal(nextExpected);
			});
		});

		describe('peek', function(){
			it('does not affect size', function(){
				let initialSize = heap.getSize();

				heap.peek();
				expect(heap.getSize()).to.equal(initialSize);
			});

			it('does not remove the value', function(){
				let firstPeek = heap.peek();

				expect(heap.peek()).to.equal(firstPeek);
				expect(heap.peek()).to.equal(firstPeek);
				expect(heap.peek()).to.equal(firstPeek);
			});

			it('always returns what would be popped', function(){
				for(let i = 0, len = heap.getSize(); i < len; i++){
					expect(heap.peek()).to.equal(heap.pop());
				}

				expect(heap.getSize()).to.equal(0);
			});
		});

		describe('pop', function(){
			it('returns undefined when called on an empty heap', function(){
				let emptyHeap = new BinaryHeap;

				expect(emptyHeap.pop()).to.be.undefined;
			});

			it('decreases size', function(){
				let initialSize = heap.getSize();

				heap.pop();
				expect(heap.getSize()).to.equal(initialSize - 1);
			});

			it('removes the largest element', function(){
				let largest = heap.pop();

				let largestRemaining = Math.max.apply([], heap.__elements);
				expect(largest).to.be.above(largestRemaining);
			});
		});
	});

	describe('comparator', function(){
		let heap, people;

		beforeEach(function(){
			heap = new BinaryHeap({ comparator: (a, b)=> a.age < b.age });

			people = [
				{ name: "Ted", age: 25 },
				{ name: "Sally", age: 31 },
				{ name: "Bob", age: 17 },
				{ name: "Murray", age: 80 },
				{ name: "Beth", age: 45 },
				{ name: "Alice", age: 18 },
			];

			people.forEach((person)=> heap.push(person));
		});

		it('uses the passed comparator', function(){
			let sortedPeople = people.sort((one, another)=> one.age - another.age);

			sortedPeople.forEach(function(expectedPerson){
				expect(heap.pop()).to.equal(expectedPerson);
			});
		});
	});

	// TODO: test the heap's tree structuring
});

function numberSortDesc(a, b){
	return b - a;
}