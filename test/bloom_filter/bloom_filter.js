import BloomFilter from '../../src/bloom_filter/bloom_filter';
import itActsAsBloomFilter from './_acts_as_bloom_filter';

let expect = require('chai').expect;

describe('BloomFilter', function(){
  describe('bloominess', function(){
    itActsAsBloomFilter(BloomFilter);

    describe('passed hashing fn array', function(){
      it('allows passing arbitrary Array of hashing functions', function(){
        let hashers = [function(){ return 1; }, function(x){ return x; }]; // Not so great...
        let bloomFilter = new BloomFilter({
          hashingFnArr: hashers,
        });

        expect(bloomFilter._hashFnCount).to.equal(hashers.length);
        expect(bloomFilter._hashingFnArr.length).to.equal(hashers.length);

        expect(bloomFilter._hashingFnArr[0](9000)).to.equal(1);
        expect(bloomFilter._hashingFnArr[1](9000)).to.equal(9000);
      });

      it('depends on a good hashing function', function(){
        let poorBloom = new BloomFilter({
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

        let combinedBloom = new BloomFilter({ hashingFnArr: [fnA, fnB] });
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


    });
  });
});