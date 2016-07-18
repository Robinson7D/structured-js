import NaiveBinarySearchTree from '../../src/tree/naive_binary_search_tree';
import itActsAsBinarySearchTree from './_binary_search_tree';

let expect = require('chai').expect;

describe('NaiveBinarySearchTree, a simple BST', function(){
  itActsAsBinarySearchTree(NaiveBinarySearchTree);
});