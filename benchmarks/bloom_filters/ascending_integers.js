import Benchmark from '../../node_modules/benchmark/benchmark';
import BloomFilter from '../../src/bloom_filter/bloom_filter';
import MicroOptimizedBloomFilter from '../../src/bloom_filter/micro_optimized';

function runTest(ds){
  for(var i = 0; i < 100000; i++){
    ds.add(i);
  }
  for(var i = 0; i < 1000000; i++){
    ds.test(i);
  }
}

new Benchmark.Suite().add('BloomFilter Integers', function() {
    runTest(new BloomFilter());
  })
  .add('MicroOptimizedBloomFilter Integers', function() {
    runTest(new MicroOptimizedBloomFilter());
  })
  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true });

/*
 * RECENT RESULTS:
 *
 * (INTEGER) NUMBERS:
 * (0...100,000) inserted, (0...1,000,000) tested
 *
 * ```
 * BloomFilter Integers x 1.10 ops/sec ±1.89% (7 runs sampled)
 * MicroOptimizedBloomFilter Integers x 2.10 ops/sec ±2.84% (10 runs sampled)
 * Fastest is MicroOptimizedBloomFilter Integers
 * ```
 *
 * ------
 *
 * (ENGLISH) WORDS:
 * Array of 100,000 words from `/usr/share/dict/words` (babel is too slow for more)
 * 20,000 inserts, 100,000 tests.
 *
 * ```
 * BloomFilter Words x 10.79 ops/sec ±1.14% (30 runs sampled)
 * MicroOptimizedBloomFilter Words x 26.27 ops/sec ±2.60% (47 runs sampled)
 * Fastest is MicroOptimizedBloomFilter Words
 * ```
*/