(function(){
	'use strict';

	// API:
	LinkedList.prototype.getSize = getSize;

	LinkedList.prototype.addToStart = addToStart;
	LinkedList.prototype.unshift = LinkedList.prototype.addToStart;
	LinkedList.prototype.addAfter = addAfter;

	LinkedList.prototype.removeFromStart = removeFromStart;
	LinkedList.prototype.shift = LinkedList.prototype.removeFromStart;
	LinkedList.prototype.removeAfter = removeAfter;

	LinkedList.prototype.peek = peek;
	LinkedList.prototype.findNode = findNode;
	LinkedList.prototype.findNodeBefore = findNodeBefore;
	LinkedList.prototype.contains = contains;

	// Exit:
	export LinkedList;
	return LinkedList;


	// Functions:
	function LinkedList(config){ // Constructor:
		this.head = undefined;
		this.__size = 0;
	}

	function buildNode(element, next){ // Constructor:
		return {
			element: element,
			next: next,
		};
	}

	function getSize(){
		return this.__size;
	}

	function addToStart(element){
		return _abstractAdder.call(this, element, "head", this);
	}

	function addAfter(element, node){
		return _abstractAdder.call(this, element, "next", node);
	}

	function _abstractAdder(element, prop, parent){
		let addingNode = buildNode(element);

		addingNode.next = parent[prop];
		parent[prop] = addingNode;
		this.__size++;

		return addingNode;
	}

	function removeFromStart() {
		return _abstractRemover.call(this, "head", this);
	}

	function removeAfter(node) {
		return _abstractRemover.call(this, "next", node);
	}

	function _abstractRemover(prop, parent){
		let nodeBefore = parent[prop];
		if(nodeBefore){
			let element = nodeBefore.element;

			parent[prop] = nodeBefore.next;
			this.__size--;

			return element;
		}
	}

	function peek() {
		if(this.head){
			return this.head.element;
		}
	}

	function findNodeBefore(searchFuncton){
		let nodeBefore = null,
				node = this.head,
				i = 0;

		while(node){
			if(searchFuncton(node.element, i)) { return nodeBefore; } // FOUND / DONE

			i++;
			nodeBefore = node;
			node = node.next;
		}
	}

	function findNode(searchFuncton){ // Duplicatey. Maybe just use `findNodeBefore(fn).next` lol
		let node = this.head,
				i = 0;

		while(node){
			if(searchFuncton(node.element, i)) { return node; } // FOUND / DONE

			i++;
			node = node.next;
		}
	}

	function contains(elementToFind){
		return !!this.findNode((element)=> element === elementToFind);
	}
}());