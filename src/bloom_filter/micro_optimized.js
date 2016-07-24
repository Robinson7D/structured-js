'use strict';

/*
 * Ewww. Gross.
 * Basically just inlined a ton of stuff bloom_filter.js
 * Using a benchmark of 100,000 inserts + 1,000,000 tests (of increasing Integers)
 * this version takes < 300ms, where before it took ~625ms.
 * A similar (slightly better, even) gain was observed on a test of English words
 * (20,000 inserts, 100,000 tests @ 2.9x speed of the plain BloomFilter)
 *
 * This appears mostly to be due to less garbage collection (not creating arrays for every insert or test)
 * As well as V8 and other engines working well when functions are tiny.
 *
 * Still though, I apologize.
*/

// Dependencies:
import BloomFilter from "./bloom_filter";
import murmur2 from "../../helpers/hash";

MicroOptimizedBloomFilter.prototype = Object.create(BloomFilter.prototype); // Defaults
MicroOptimizedBloomFilter.prototype.constructor = MicroOptimizedBloomFilter;

// Overrides:
MicroOptimizedBloomFilter.prototype.test = test;
MicroOptimizedBloomFilter.prototype.insert = insert;
MicroOptimizedBloomFilter.prototype.add = MicroOptimizedBloomFilter.prototype.insert;

export default MicroOptimizedBloomFilter;

// Functions:
function MicroOptimizedBloomFilter(config = {}){ // Constructor
  BloomFilter.apply(this, arguments); // Not optimized, because no.
  this.__buckets = new Uint32Array( Math.ceil(this._bitsAvailable / 32) );
}

function test(element) {
  for(var i = 0, len = this._hashFnCount; i < len; i++){
    var hashedResult = murmur2(i, ""+element) % this._bitsAvailable;
    if(!(this.__buckets[hashedResult >>> 5] & (1 << (hashedResult % 32)))) return false; // Was NOT ON, so not a match.
  }
  return true;
}

function insert(element) {
  for(var i = 0, len = this._hashFnCount; i < len; i++){
    var hashedResult = murmur2(i, ""+element) % this._bitsAvailable;
    this.__buckets[hashedResult >>> 5] |= (1 << (hashedResult % 32)); // set bit ON
  }
}