# structured-js
Common data structures implemented in Javascript.

This is a personal project to help myself retain knowledge of data structures - and learn more about their implementations in the process. I also plan to use this to decrease inertia on days when I wish to learn or practice languages that I have less practice with (i.e. pick up the language and begin reimplementing some of these in it, to get familiar with writing in the language's syntax).

Meaning: I advise against using this library for anything production, particularly in it's current (hardly benchmarked, not fully tested) state.

---

## Currently available structures:

- Binary Heap (+ Min variation)
- Priority Queue (based on underlying Binary Heap)
- AVL Tree
- (Naive) Binary Search Tree (use AVL instead... This was created more for fun)
- Linked List


## Build (How To, Commands):

Install dependencies: `npm install`
Test: `npm test`
Coverage: `npm run-script cover`
Compile to ES5: `npm run makeES5`


## TODO:

### Tests
Remaining test coverage required:

- Linked List: Require writing specs entirely
- Trees: Private method testing
- BloomFilter: Stress test probabilistic qualities

### Benchmarks
Benchmarks can be helpful for various reasons.
They help to demonstrate why and when a data structure is worth considering.
They can also help compare and contrast similar (or differently implemented) structures.

### Additional commenting
The initial implementations of data structures are commented very lightly; given that this library is primarily forcused on learning, some sets of steps could benefit from explanation.

### MORE DATA STRUCTURES! Some examples to implement soon:
* Tries!
* (More) Binary Search Trees. (Various, balancing)
* Suffix Tree, Radix Tree
* Suffix Array
* Graphs! (Adjacency list, Adjacency matrix)

### Other:
Consider a src/utilities.js file for common code (helpers to alias prototype functions, etc.)