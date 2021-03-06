require("babel-polyfill");

export {
  BreadthFirstGenerator,
  BreadthFirstGenerator as fastTreeTraversal, // aliased, currently the fastest way if order doesn't matter
};

function *BreadthFirstGenerator(tree){
  let firstProp = 'leftChild',
      secondProp = 'rightChild',
      stack = [],
      currentNode;

  if(tree.head) { stack.push(tree.head); }
  else if(tree.value) { stack.push(tree); } // is already a node/sub-tree

  while(currentNode = stack.pop()){
    yield currentNode;

    if(currentNode.leftChild){ stack.push(currentNode.leftChild); }
    if(currentNode.rightChild){ stack.push(currentNode.rightChild); }
  }
}