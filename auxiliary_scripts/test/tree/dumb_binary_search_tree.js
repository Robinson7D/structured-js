import DumbBinarySearchTree from '../../../tree/dumb_binary_search_tree';
import itActsAsBinarySearchTree from './_binary_search_tree';

let expect = require('chai').expect;
var should = require('chai').should();

describe('DumbBinarySearchTree, a simple BST', function(){
	itActsAsBinarySearchTree(DumbBinarySearchTree);
});