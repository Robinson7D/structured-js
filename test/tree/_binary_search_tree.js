let expect = require('chai').expect;

import {buildSmallDistributed} from '../../helpers/number_array_builders';
import {BreadthFirstGenerator} from '../../helpers/tree_traversals';

export default itActsAsBinarySearchTree;

function itActsAsBinarySearchTree(TreeClass){
	const BASE_VALUES = buildSmallDistributed(50),
				BASE_SIZE = BASE_VALUES.length,
				LARGEST_VAL = Math.max.apply([], BASE_VALUES),
				LEAF_VAL = LARGEST_VAL; // Aliased

	let bst, emptyBst;

	function findLeaf(_node){
		while(_node.leftChild || _node.rightChild){
			_node = _node.leftChild || _node.rightChild;
		}
		return _node;
	}

	beforeEach(function(){
		bst = new TreeClass;
		emptyBst = new TreeClass;

		BASE_VALUES.forEach((value)=> bst.insert(value));
	});

	describe('head property', function(){
		it('is undefined initially', function(){
			expect(emptyBst.head).not.to.exist;
		});

		it('is an Object when the tree is populated', function(){
			expect(bst.head).to.be.an('object');
		});

		it('can be added and removed', function(){
			emptyBst.insert(1);
			expect(bst.head).to.be.an('object');

			emptyBst.remove(1);
			expect(emptyBst.head).not.to.exist;
		});
	});

	describe('nodes', function(){
		let node;

		function itIsAValidNode(){
			it('should have a value', function(){
				expect(node.value).to.exist;
			});

			it('should have a count', function(){
				expect(node.count).to.be.above(0);
			});
		}

		describe('head node', function(){
			beforeEach(()=> node = bst.head);

			itIsAValidNode();

			it('should have no parent', function(){
				expect(bst.head.parent).not.to.exist;
			});
		});

		describe('non-head-non-leaf-nodes', function(){
			beforeEach(()=> node = bst.head.leftChild);

			itIsAValidNode();

			it('should have parent set correctly', function(){
				expect(node.leftChild.parent).to.equal(node);
				expect(node.rightChild.parent).to.equal(node);

				expect(node.rightChild.leftChild.parent).to.equal(node.rightChild);
			});

			describe('children', function(){
				function itPointsToANode(childProp){
					it('points to a node Object', function(){
						expect(node[childProp]).to.be.an('object');
					});
				}

				describe('leftChild', function(){
					itPointsToANode('leftChild');
				});

				describe('rightChild', function(){
					itPointsToANode('rightChild');
				});
			});
		});

		describe('leaves', function(){
			let leaf;
			beforeEach(() => {
				node = findLeaf(bst.head);
				leaf = node;
			});

			itIsAValidNode();

			it('should not have a leftChild', function(){
				expect(leaf.leftChild).not.to.exist;
			});

			it('should not have a rightChild', function(){
				expect(leaf.rightChild).not.to.exist;
			});

			it('should have a parent', function(){
				expect(leaf.parent).to.exist;
			});
		});

		describe('count', function(){
			it('increments as values are added', function(){
				const VALUE = 777;

				emptyBst.insert(VALUE);
				expect(emptyBst.head.count).to.equal(1);

				emptyBst.insert(VALUE);
				expect(emptyBst.head.count).to.equal(2);

				emptyBst.insert(VALUE);
				expect(emptyBst.head.count).to.equal(3);
			});

			it('decrements as values are removed', function(){
				const VALUE = 777;

				emptyBst.insert(VALUE);
				emptyBst.insert(VALUE);
				emptyBst.insert(VALUE);

				expect(emptyBst.head.count).to.equal(3);

				emptyBst.remove(VALUE);
				expect(emptyBst.head.count).to.equal(2);

				emptyBst.remove(VALUE);
				expect(emptyBst.head.count).to.equal(1);
			});
		});
	});


	describe('tree structure', function(){
		function getAllNodes(){
			return Array.from(new BreadthFirstGenerator(bst));
		}
		it('always places smaller values on the left', function(){
			let allNodesWithALeftChild = getAllNodes().filter((node)=> node.leftChild);

			expect(allNodesWithALeftChild.length).to.be.above(0);

			allNodesWithALeftChild.forEach(function(node){
				expect(node.leftChild.value).to.be.below(node.value);
			});
		});

		it('always places larger values on the right', function(){
			let allNodesWithARightChild = getAllNodes().filter((node)=> node.rightChild);

			expect(allNodesWithARightChild.length).to.be.above(0);

			allNodesWithARightChild.forEach(function(node){
				expect(node.rightChild.value).to.be.above(node.value);
			});
		});
	});

	describe('getSize', function(){
		it('returns 0 for empty trees', function(){
			expect(emptyBst.getSize()).to.equal(0);
		});

		it('returns the number of items in the BST', function(){
			expect(bst.getSize()).to.equal(BASE_SIZE);
		});

		it('increases when items are added', function(){
			bst.insert(-1);
			expect(bst.getSize()).to.equal(BASE_SIZE + 1);
		});

		it('decreases when items are removed', function(){
			bst.remove(BASE_VALUES[0]);
			expect(bst.getSize()).to.equal(BASE_SIZE - 1);
		});

		it('respects duplicate values (size includes counts)', function(){
			emptyBst.insert(1);
			expect(emptyBst.getSize()).to.equal(1);

			emptyBst.insert(1);
			expect(emptyBst.getSize()).to.equal(2);

			emptyBst.insert(1);
			expect(emptyBst.getSize()).to.equal(3);
		});
	});

	describe('findNode', function(){
		it('finds existing nodes', function(){
			let value = BASE_VALUES[8];
			let node = bst.findNode(value);

			expect(node).to.be.a('object');
			expect(node.value).to.equal(value);
		});

		it('finds the head node', function(){
			let node = bst.findNode(bst.head.value);

			expect(node).to.equal(bst.head);
		});

		it('finds leaves', function(){
			let node = bst.findNode(LEAF_VAL);

			expect(node).to.be.a('object');
			expect(node.value).to.equal(LEAF_VAL);
		});

		it('returns undefined for values not in the tree', function(){
			let node = bst.findNode(LARGEST_VAL + 7);

			expect(node).to.not.exist;
		});

		it('returns undefined for empty trees', function(){
			let node = emptyBst.findNode(BASE_VALUES[0]);

			expect(node).to.not.exist;
		});
	});

	describe('contains', function(){
		it('returns true for nodes in the tree', function(){
			expect(bst.contains(BASE_VALUES[5])).to.be.true;
		});

		it('returns true for the head node', function(){
			expect(bst.contains(bst.head.value)).to.be.true;
		});

		it('returns true for leaves', function(){
			expect(bst.contains(LEAF_VAL)).to.be.true;
		});

		it('returns false for empty trees', function(){
			expect(emptyBst.contains(BASE_VALUES[0])).to.be.false;
		});

		it('returns false for missing values', function(){
			expect(emptyBst.contains(LARGEST_VAL + 1)).to.be.false;
		});
	});

	describe('insert', function(){
		describe("chaining", function(){
			it("returns self to allow chaining", function(){
				expect(bst.insert(1)).to.equal(bst);
			});
		});

		describe('empty trees', function(){
			it('adds a head', function(){
				expect(emptyBst.head).to.not.exist;
				emptyBst.insert(1);
				expect(emptyBst.head).to.exist;
			});
		});

		describe('non-empty trees', function(){
			let singleItemTree,
					initialItem = 10;

			beforeEach(function(){
				singleItemTree = new TreeClass;
				singleItemTree.insert(initialItem);
			});

			it('sets nodes for smaller values to the leftChild', function(){
				let smaller = initialItem - 5;

				singleItemTree.insert(smaller);
				expect(singleItemTree.head.leftChild.value).to.equal(smaller);
			});

			it('sets nodes for larger values to the rightChild', function(){
				let larger = initialItem + 5;

				singleItemTree.insert(larger);
				expect(singleItemTree.head.rightChild.value).to.equal(larger);
			});

			it('increments existing values', function(){
				let initialCount = singleItemTree.head.count;

				singleItemTree.insert(singleItemTree.head.value);
				expect(singleItemTree.head.count).to.equal(initialCount + 1);
			});
		});
	});

	describe("remove", function(){
		describe("chaining", function(){
			it("returns self to allow chaining", function(){
				expect(bst.remove(1)).to.equal(bst);
			});
		});
		describe("missing values", function(){
		});
		describe("removing head", function(){
			let oldHead, oldHeadValue;
			beforeEach(function(){
				oldHead = bst.head;
				oldHeadValue = bst.head.value;
				bst.remove(oldHeadValue);
			});

			it("removes the head value", function(){
				expect(bst.findNode(oldHeadValue)).to.not.exist;
			});

			it("sets a new head value", function(){
				expect(bst.head).to.exist;
				expect(bst.head.value).to.not.equal(oldHeadValue);
			});

			it("promoted a descendent", function(){
				expect(BASE_VALUES).to.include(bst.head.value);
			});

			it("removed the old instance of the descendent", function(){
				let promotedValue = bst.head.value;

				bst.remove(promotedValue);
				expect(bst.findNode(promotedValue)).to.not.exist;
			});
		});

		describe("removing leaves", function(){
			const mid = 5, low = 2, high = 8;
			let simpleTree;
			beforeEach(function(){
				simpleTree = new TreeClass();

				simpleTree.insert(mid);
				simpleTree.insert(low);
				simpleTree.insert(high);
			});

			describe("left-most leaf removal", function(){
				beforeEach(()=> simpleTree.remove(low));

				it('removes the value', function(){
					expect(simpleTree.findNode(low)).to.not.exist;
				});

				it('updates the parent leftChild reference', function(){
					expect(simpleTree.head.leftChild).to.not.exist;
				});

				it('does not remove any other nodes', function(){
					expect(simpleTree.findNode(mid)).to.exist;
					expect(simpleTree.findNode(high)).to.exist;
				});
			});

			describe("right-most leaf removal", function(){
				beforeEach(()=> simpleTree.remove(high));

				it('removes the value', function(){
					expect(simpleTree.findNode(high)).to.not.exist;
				});

				it('updates the parent rightChild reference', function(){
					expect(simpleTree.head.rightChild).to.not.exist;
				});

				it('does not remove any other nodes', function(){
					expect(simpleTree.findNode(mid)).to.exist;
					expect(simpleTree.findNode(low)).to.exist;
				});
			});
		});

		describe("removing middle pieces", function(){
			describe("with two children", function(){
				let parent, removalSide, removalNode, removalValue;

				beforeEach(function(){
					parent = bst.head.leftChild;
					removalSide = "rightChild";
					removalNode = parent[removalSide];
					removalValue = removalNode.value;
				});

				it('is replaced in the parent', function(){
					bst.remove(removalValue);
					expect(parent[removalSide].value).to.exist;
					expect(parent[removalSide].value).not.to.equal(removalValue);
				});

				// TODO: check children reference new parent
			});
		});
	});

	/* TODO:
	 *  Private methods: _buildNode, _addNewNode, _removeNode
	*/
}