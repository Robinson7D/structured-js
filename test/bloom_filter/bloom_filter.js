import BloomFilter from '../../src/bloom_filter/bloom_filter';
import itActsAsBloomFilter from './_acts_as_bloom_filter';

let expect = require('chai').expect;

describe('BloomFilter', function(){
	describe('bloominess', function(){
		itActsAsBloomFilter(BloomFilter);
	});
});