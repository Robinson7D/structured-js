import MicroOptimizedBloomFilter from '../../src/bloom_filter/micro_optimized';
import itActsAsBloomFilter from './_acts_as_bloom_filter';

let expect = require('chai').expect;

describe('MicroOptimizedBloomFilter', function(){
  describe('bloominess', function(){
    itActsAsBloomFilter(MicroOptimizedBloomFilter);
  });
});