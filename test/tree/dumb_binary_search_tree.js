import DumbBinarySearchTree from '../../tree/dumb_binary_search_tree';
var expect = require('chai').expect;

describe('DumbBinarySearchTree, a simple BST', function(){
	const BASE_NUMBER = 100,
				BASE_SIZE = 10;

	let bst;

	beforeEach(function(){
		bst = new DumbBinarySearchTree;

		for(var i = 0; i < BASE_SIZE; i++){
			bst.insert(BASE_NUMBER + (i * 10));
		}
	});

	describe('getSize', function(){
		it('returns the number of items in the BST', function(){
			expect(bst.getSize()).to.equal(BASE_SIZE);
		});

		it('increases when items are added', function(){
			bst.insert(-1);
			expect(bst.getSize()).to.equal(BASE_SIZE + 1);
		});

		it('decreases when items are removed', function(){
			bst.remove(BASE_NUMBER);
			expect(bst.getSize()).to.equal(BASE_SIZE - 1);
		});
	});
});