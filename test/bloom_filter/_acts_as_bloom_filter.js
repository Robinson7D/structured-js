let expect = require('chai').expect;

import {buildSmallDistributed} from '../../helpers/number_array_builders';
import {BreadthFirstGenerator} from '../../helpers/tree_traversals';

export default itActsAsBloomFilter;

function itActsAsBloomFilter(BloomFilterClass){
	let bloomFilterInstance;

	beforeEach(function(){
		bloomFilterInstance = new BloomFilterClass;
	});

	describe('static methods', function(){
		describe('constructor', function(){
			it('sets an empty buckets array', function(){
				expect(bloomFilterInstance.__buckets).to.be.defined;
			});

			it('defaults to a filter for 100,000 elements', function(){
				// ~9.6 bits per element, on average: https://en.wikipedia.org/wiki/Bloom_filter#Space_and_time_advantages
				var bitsAvailablePerElement = 9.6;
				var aproxElements = bloomFilterInstance._bitsAvailable / bitsAvailablePerElement;
				var elementsToAimFor = 100000;
				var proximityToTarget = Math.abs(1 - aproxElements / elementsToAimFor);

				 // These are approximations, so allowing 0.5% variance
				expect(proximityToTarget).to.be.below(0.005);
			});

			it('defaults number of hashing functions to 7', function(){
				expect(bloomFilterInstance._hashFnCount).to.equal(7);

				expect(bloomFilterInstance._hashingFnArr).to.be.instanceof(Array);
				expect(bloomFilterInstance._hashingFnArr.length).to.equal(7);
			});

			it('allows passing number of hashing functions', function(){
				var bloomFilterWithManyHashers = new BloomFilterClass({
					hashFnCount: 99,
				});
				expect(bloomFilterWithManyHashers._hashFnCount).to.equal(99);
				expect(bloomFilterWithManyHashers._hashingFnArr.length).to.equal(99);
			});

			it('allows passing arbitrary Array of hashing functions', function(){
				var hashers = [function(){ return 1; }, function(x){ return x; }]; // Not so great...
				var bloomFilter = new BloomFilterClass({
					hashingFnArr: hashers,
				});

				expect(bloomFilter._hashFnCount).to.equal(hashers.length);
				expect(bloomFilter._hashingFnArr.length).to.equal(hashers.length);

				expect(bloomFilter._hashingFnArr[0](9000)).to.equal(1);
				expect(bloomFilter._hashingFnArr[1](9000)).to.equal(9000);
			});
		});
	});

	describe('instance methods', function(){
		describe('insert', function(){
			it('is aliased to `add`', function(){
				expect(bloomFilterInstance.add).to.equal(bloomFilterInstance.insert);
			});

			it('makes a value test true', function(){
				expect(bloomFilterInstance.test("5")).to.be.false;
				bloomFilterInstance.add("5");
				expect(bloomFilterInstance.test("5")).to.be.true;
			});

			it('Stringifies Integers', function(){
				expect(bloomFilterInstance.test("5")).to.be.false;
				bloomFilterInstance.add(5);
				expect(bloomFilterInstance.test("5")).to.be.true;
			});
		});

		describe('test', function(){
			it('often returns false for missing elements', function(){
				// TODO: test probability. Add lots.
				//       Count false positives, make sure it's within acceptable range.
				expect(bloomFilterInstance.test("5")).to.be.false;
				bloomFilterInstance.add("5");
				expect(bloomFilterInstance.test("5")).to.be.true;
				expect(bloomFilterInstance.test("6")).to.be.false;
				expect(bloomFilterInstance.test("7")).to.be.false;
				expect(bloomFilterInstance.test("8")).to.be.false;
			});

			it('Stringifies Integers', function(){
				expect(bloomFilterInstance.test(5)).to.be.false;
				bloomFilterInstance.add("5");
				expect(bloomFilterInstance.test(5)).to.be.true;
			});
		});
	});
}