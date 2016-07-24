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