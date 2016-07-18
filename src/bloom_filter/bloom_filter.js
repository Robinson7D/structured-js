'use strict';

// Dependencies:
import {getHashingFn} from "../../helpers/hash";

const SIZE_OF_INT = 32;

// API:
BloomFilter.prototype.insert = insert;
BloomFilter.prototype.add = BloomFilter.prototype.insert;

BloomFilter.prototype.test = test;
BloomFilter.prototype._runHashers = _runHashers;

// Config:
// Numbers in here are for a collection of 100,000 with 1% false positive rate.
// Configure to your own needs!
BloomFilter.prototype._bitsAvailable = 958528; // About 120 kilobytes
BloomFilter.prototype._hashFnCount = 7;

// Exit
export default BloomFilter;

// Functions:
function BloomFilter(config = {}){ // Constructor
	if(config.bitsAvailable){ // Optional
		this._bitsAvailable = config.bitsAvailable;
	}

	this._hashingFnArr = config.hashingFnArr || getHashingFnArr.call(this, config);
	this._hashFnCount = this._hashingFnArr.length;

	this.__buckets = prepareBuckets.call(this);
}

function test(element) {
	let buckets = this.__buckets,
			currentBucket = 0,
			currentBitShifted = 0,
			hashedResults = this._runHashers("" + element);

	for(var i = 0, len = hashedResults.length; i < len; i++){
		currentBucket = Math.floor(hashedResults[i] / SIZE_OF_INT);
		currentBitShifted = 1 << (hashedResults[i] % SIZE_OF_INT);

		if(!(buckets[currentBucket] & currentBitShifted)) return false; // Bit is turned OFF
	}
	return true;
}

function insert(element) {
	let buckets = this.__buckets,
			currentBucket = 0,
			currentBitShifted = 0,
			hashedResults = this._runHashers("" + element);

	for(var i = 0, len = hashedResults.length; i < len; i++){
		currentBucket = Math.floor(hashedResults[i] / SIZE_OF_INT);
		currentBitShifted = 1 << (hashedResults[i] % SIZE_OF_INT);

		buckets[currentBucket] = buckets[currentBucket] || 0; // Not really necessary, but feels safer
		buckets[currentBucket] |= currentBitShifted; // Turn relevant bit ON
	}
}

function _runHashers(element){
	let arr = [],
			len = this._hashingFnArr.length,
			hashedResult = 0;

	for(var i = 0; i < len; i++){
		hashedResult = this._hashingFnArr[i](element);

		arr.push(hashedResult % this._bitsAvailable);
	}
	return arr;
}

function prepareBuckets(){
	return [];
}

function getHashingFnArr(config){
	var hashFnCount = config.hashFnCount == null ? this._hashFnCount : config.hashFnCount;

	if(hashFnCount < 1) {
		throw new Error(
			'BloomFilters require a positive number of hashing functions, recieved count: ',
			hashFnCount
		);
	}

	// Generate enough different functions:
	let hashingFns = [];

	for(var i = 0; i < hashFnCount; i++){
		hashingFns.push(getHashingFn(i));
	}
	return hashingFns;
}

/*
 * TODO:
 * 1) Consider a micro-optimized sub-class that basically uses typed arrays (Uint32Array),
 *    and inline all of the `_runHashers` code so as not to generate new Arrays on
 *    every `insert` and `test`.
 *    -> On initial tests of 100,000 inserts and 1,000,000 tests of increasing Integers
 *       the current code takes around 850ms - 1000ms
 *       the micro-optimized version takes 300ms -> 350ms
 *    As much as I oppose such a version, it may make sense to have it live in another file
 *    since it's only ~20 lines of code.
 *
 * 2) Add size approximation code: https://en.wikipedia.org/wiki/Bloom_filter#Approximating_the_number_of_items_in_a_Bloom_filter
 *
 * 3) Experiment with other hashing functions
 *
 * 4) Consider extending with group operations (batch insert?), serializing, and reloading.
*/