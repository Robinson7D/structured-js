import AVLTree from '../../src/tree/avl_tree';
import itActsAsBinarySearchTree from './_binary_search_tree';

import {buildSmallDistributed} from '../../helpers/number_array_builders';

let expect = require('chai').expect;

describe('AVLTree', function(){
	describe('binary-tree-fulness', function(){
		itActsAsBinarySearchTree(AVLTree);
	});

	describe('AVL specifics', function(){
		let bst;

		beforeEach(function(){
			bst = new AVLTree;
		});

		describe('balancing', function(){
			it('balances when right-heavy', function(){
				[10, 20, 30].forEach((val)=> bst.insert(val));

				expect(bst.head.value).to.equal(20);
				expect(bst.head.leftChild.value).to.equal(10);
				expect(bst.head.rightChild.value).to.equal(30);
			});

			it('balances when left-heavy', function(){
				[30, 20, 10].forEach((val)=> bst.insert(val));

				expect(bst.head.value).to.equal(20);
				expect(bst.head.leftChild.value).to.equal(10);
				expect(bst.head.rightChild.value).to.equal(30);
			});

			it('balances when right-left-heavy', function(){
				[10, 30, 20].forEach((val)=> bst.insert(val));

				expect(bst.head.value).to.equal(20);
				expect(bst.head.leftChild.value).to.equal(10);
				expect(bst.head.rightChild.value).to.equal(30);
			});

			it('balances when left-right-heavy', function(){
				[30, 10, 20].forEach((val)=> bst.insert(val));

				expect(bst.head.value).to.equal(20);
				expect(bst.head.leftChild.value).to.equal(10);
				expect(bst.head.rightChild.value).to.equal(30);
			});

			describe('on removal', function(){
				beforeEach(function(){
					[10, 20, 30, 40, 50, 60, 70, 80, 90].forEach((val)=> bst.insert(val));
					bst.remove(30);
					/*
					 *    Should now look like:
					 *            (40)
					 *           /   \
					 *          /     \
			  	 *       (20)    (60)
					 *      /       /   \
					 *     /       /     \
					 *   (10)    (50)   (80)
					 *                 /   \
					 *                /     \
					 *             (70)    (90)
					 *
					 *  Which works well for demonstratng various different removal situations
					*/
				});

				it('swaps relevant children when rotating', function(){
					expect(bst.findNode(70).parent).to.equal(bst.findNode(80));

					bst.remove(50);

					expect(bst.findNode(70).parent).to.equal(bst.findNode(60));
					/*
					 *    Should now look like:
					 *            (40)
					 *           /   \
					 *          /     \
			  	 *       (20)    (80)
					 *      /       /   \
					 *     /       /     \
					 *   (10)    (60)   (90)
					 *             \
					 *             \
					 *             (70)
					 *
					 *  When 50 was removed, a left rotation brought 80 up, 60 down,
					 *  and 80's inner-kid became 60's
					*/
				});

				it('balances ancestor nodes, and rotates higher up when needed', function(){
					expect(bst.head.value).to.equal(40);
					expect(bst.head.leftChild.value).to.equal(20);
					expect(bst.findNode(20).leftChild.value).to.equal(10);
					expect(bst.findNode(20).rightChild).to.not.exist; // Left side of head is all-left

					expect(bst.findNode(40).rightChild.value).to.equal(60); // Head's right child is 60

					bst.remove(10);

					expect(bst.head.value).to.equal(60);
					expect(bst.head.leftChild.value).to.equal(40); // Old head!
					expect(bst.findNode(40).rightChild.value).to.equal(50); // Swapped 60's inner child

					expect(bst.findNode(70).parent).to.equal(bst.findNode(80));
					/*
					 *    Should now look like:
					 *            (60)
					 *           /    \
					 *          /      \
			  	 *       (40)      (80)
					 *      /   \     /   \
					 *     /    \    /     \
					 *   (20) (50)  (70)   (90)
					*/
				});
			});
		});

		// TODO: Perhaps a stress-test of adding/removing tons of stuff too.
	});
});