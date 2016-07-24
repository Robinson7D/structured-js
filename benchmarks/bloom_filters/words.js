import Benchmark from '../../node_modules/benchmark/benchmark';
import BloomFilter from '../../src/bloom_filter/bloom_filter';
import MicroOptimizedBloomFilter from '../../src/bloom_filter/micro_optimized';
var fs = require('fs'); // Load fs module for node.

fs.readFile('/usr/share/dict/words', "utf8", function(err, data) {
  if (err) { throw err; }

  let words = data.split('\n');

  new Benchmark.Suite().add('BloomFilter vs English Words', function() {
      runTest(new BloomFilter());
    })
    .add('MicroOptimizedBloomFilter vs English Words', function() {
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

  function runTest(instance){
    for(var i = 0; i < 20000; i++){
      instance.add(words[i]);
    }
    for(var i = 0; i < 100000; i++){
      instance.test(words[i]);
    }
  }
});