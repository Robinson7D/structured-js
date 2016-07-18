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
				let bitsAvailablePerElement = 9.6;
				let aproxElements = bloomFilterInstance._bitsAvailable / bitsAvailablePerElement;
				let elementsToAimFor = 100000;
				let proximityToTarget = Math.abs(1 - aproxElements / elementsToAimFor);

				 // These are approximations, so allowing 0.5% variance
				expect(proximityToTarget).to.be.below(0.005);
			});

			it('defaults number of hashing functions to 7', function(){
				expect(bloomFilterInstance._hashFnCount).to.equal(7);

				expect(bloomFilterInstance._hashingFnArr).to.be.instanceof(Array);
				expect(bloomFilterInstance._hashingFnArr.length).to.equal(7);
			});

			it('allows passing number of hashing functions', function(){
				let bloomFilterWithManyHashers = new BloomFilterClass({
					hashFnCount: 99,
				});
				expect(bloomFilterWithManyHashers._hashFnCount).to.equal(99);
				expect(bloomFilterWithManyHashers._hashingFnArr.length).to.equal(99);
			});

			it('throws if passed a number of hashing functions less than 1', function(){
				let threwError = false;
				try {
					let badBloom = new BloomFilterClass({ hashFnCount: 0 });
				}
				catch(e){ threwError = true; }

				expect(threwError).to.be.true;
			});

			it('allows passing arbitrary Array of hashing functions', function(){
				let hashers = [function(){ return 1; }, function(x){ return x; }]; // Not so great...
				let bloomFilter = new BloomFilterClass({
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

	describe('probabilistic qualities', function(){
		it('depends on a good hashing function', function(){
			let poorBloom = new BloomFilterClass({
				hashingFnArr: [function(x){ return x.charCodeAt(0) % 2; }]
			});

			expect(poorBloom.test("A")).to.be.false;
			poorBloom.add("A");
			expect(poorBloom.test("A")).to.be.true;
			expect(poorBloom.test("Adshfjsgyr")).to.be.true; // Uh oh
			expect(poorBloom.test("B")).to.be.false;
			expect(poorBloom.test("C")).to.be.true; // -_- FML
		});

		// Explains why `k` (number of hashers) is important:
		it('combines hashing functions to avoid bias toward their individual collisions', function(){
			let primeA = 101,
					fnA = function(x){ return x.charCodeAt(0) % primeA; },
					primeB = 103,
					fnB = function(x){ return x.charCodeAt(0) % primeB; };

			let combinedBloom = new BloomFilterClass({ hashingFnArr: [fnA, fnB] });
			let collisions = 0, sampleSize = 50000;

			combinedBloom.add(String.fromCharCode(65)); // "A"

			for(let i = 0; i < sampleSize; i++){
				if(combinedBloom.test(String.fromCharCode(i))){ collisions++; }
			}

			expect(collisions / sampleSize).to.be.below(1 / primeA);
			expect(collisions / sampleSize).to.be.below(1 / primeB);

			// In fact, it's significantly better - more than 80 times better!:
			expect(collisions / sampleSize).to.be.below(1 / (primeA * 80));
			expect(collisions / sampleSize).to.be.below(1 / (primeB * 80));

			/*
			 * The lesson is that either of these (bad) functions would have failed on their own much earlier.
			 *
			 * fnA hits the same 101 values over and over, and in order.
			 * There would be no more than 100 false in a row; 1/101 would be collision.
			 * fnB is similar, but would allow 102 false in a row; 1/103 would be collision.
			 *
			 * By combining them, we got 5 collisions out of 50000 tests - 1/10,000 collided.
			 *
			 * Combined, it's only one average 4.8% chance of collision (but lower than 14.2% from 7)
			 *
			 * NOTE: not all combinations are improvements.
			 * The same test with 3 and 5 is worse than simply 5. By a large margin.
			 * This is a flaw with small primes, as well as with bad hashing functions.
			 * It is remedied by using better hashing functions. Or at the very least, higher primes.
			 *
			 * (But really... use better hashing functions. And utilize the whole input, too.)
			*/
		});

		it('by default, hits 1% false positives at 100,000 items', function(){
			let expectedSize = 100000;
			let collisions = 0;

			for(let i = 0; i < expectedSize; i++){
				bloomFilterInstance.add(i); // Insert the first 100,000
			}

			for(let i = expectedSize; i < (2 * expectedSize); i++){
				// Test the next 100,000 (good sample)
				if(bloomFilterInstance.test(i)){ collisions++; }
			}

			let percentCollided = collisions / expectedSize;

			// Within 1% of 1% accurate after sampling 100,000 distinct, new items...
			expect(percentCollided).to.be.above(0.0099);
			expect(percentCollided).to.be.below(0.0101);
		});

		it('has more false positives when provided less space', function(){
			// 1% accuracy is achieved at about 9.6 bits per element
			// Halving the bits available causes more than 10* the false positives.
			let bitsAvailable = BloomFilterClass.prototype._bitsAvailable * 0.5;
			let lessBitsBloom = new BloomFilterClass({ bitsAvailable: bitsAvailable });
			let expectedSize = 100000;
			let collisions = 0;

			for(let i = 0; i < expectedSize; i++){
				lessBitsBloom.add(i); // Insert the first 100,000
			}

			for(let i = expectedSize; i < (2 * expectedSize); i++){
				if(lessBitsBloom.test(i)){ collisions++; }
			}

			let percentCollided = collisions / expectedSize;

			// Within 1% of 1% accurate after sampling 100,000 distinct, new items...
			expect(percentCollided).to.be.above(0.015); // Worse than before
			expect(percentCollided).to.be.above(0.15); // Much, much worse than before
			expect(percentCollided).to.be.below(0.20); // I guess it's not so bad :/
		});
	});
}