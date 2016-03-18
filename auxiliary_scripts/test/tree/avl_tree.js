import AVLTree from '../../../tree/avl_tree';
import itActsAsBinarySearchTree from './_binary_search_tree';

let expect = require('chai').expect;
var should = require('chai').should();

describe('AVLTree', function(){
	itActsAsBinarySearchTree(AVLTree);
});