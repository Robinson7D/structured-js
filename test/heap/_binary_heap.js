let expect = require('chai').expect;

import {buildSmallDistributed} from '../../helpers/number_array_builders';

export default itBehavesLikeAHeap;

function itBehavesLikeAHeap(HeapClass){
	describe('static methods', function(){
		describe('constructor', function(){
			it('accepts a comparator function', function(){
				let comparatorFn = function(){};
				let heap = new HeapClass({comparator: comparatorFn});

				expect(heap._comparator).to.equal(comparatorFn);
			});
			it('sets an empty elements array', function(){
				let heap = new HeapClass();

				expect(heap.__elements).to.be.instanceof(Array);
				expect(heap.__elements).to.be.empty;
			});
		});
	});

	describe('method aliasing', function(){
		describe('remove', function(){
			it('is an alias of pop', function(){
				expect(HeapClass.prototype.remove).to.equal(HeapClass.prototype.pop);
			});
		});

		describe('insert', function(){
			it('is an alias of push', function(){
				expect(HeapClass.prototype.insert).to.equal(HeapClass.prototype.push);
			});
		});
	});

	describe('instance', function(){ // TODO: test more finely:
		let heap, elements;

		beforeEach(function(){
			heap = new HeapClass();
			elements = buildSmallDistributed(50);
			elements.forEach((val)=> heap.push(val));
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
				let emptyHeap = new HeapClass;

				expect(emptyHeap.pop()).to.be.undefined;
			});

			it('decreases size', function(){
				let initialSize = heap.getSize();

				heap.pop();
				expect(heap.getSize()).to.equal(initialSize - 1);
			});
		});
	});

	describe('comparator', function(){
		let heap, people;

		beforeEach(function(){
			heap = new HeapClass({ comparator: (a, b)=> a.age < b.age });

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
}