import AVLTree from '../../src/tree/avl_tree';
import itActsAsBinarySearchTree from './_binary_search_tree';

let expect = require('chai').expect;
var should = require('chai').should();

describe('AVLTree', function(){
	itActsAsBinarySearchTree(AVLTree);

	// TODO: test the proper AVL stuff. That the tree is balanced, height value on nodes are all good, etc.
	//       perhaps a stress-test of adding/removing tons of stuff too.
});