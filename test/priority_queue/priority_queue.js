import PriorityQueue from '../../src/priority_queue/priority_queue';
import {buildSmallDistributed} from '../../helpers/number_array_builders';

let expect = require('chai').expect;

describe('PriorityQueue', function(){
  describe('static methods', function(){
    describe('constructor', function(){
      it('sets an empty elements array', function(){
        let priorityQueue = new PriorityQueue();

        expect(priorityQueue.__elements).to.be.defined;
      });
    });
  });

  describe('method aliasing', function(){
    describe('add', function(){
      it('is an alias of enqueue', function(){
        expect(PriorityQueue.prototype.add).to.equal(PriorityQueue.prototype.enqueue);
      });
    });

    describe('remove', function(){
      it('is an alias of dequeue', function(){
        expect(PriorityQueue.prototype.remove).to.equal(PriorityQueue.prototype.dequeue);
      });
    });
  });

  describe('instance', function(){ // TODO: test more finely:
    let priorityQueue, elements;

    beforeEach(function(){
      priorityQueue = new PriorityQueue();
      elements = buildSmallDistributed(50);
      elements.forEach((val, i)=> priorityQueue.add(val, i)); // Index as priority
    });

    describe('peek', function(){
      it('returns undefined when called on an empty priority queue', function(){
        expect(new PriorityQueue().peek()).to.be.undefined;
      });

      it('does not affect size', function(){
        let initialSize = priorityQueue.getSize();

        priorityQueue.peek();
        expect(priorityQueue.getSize()).to.equal(initialSize);
      });

      it('does not remove the value', function(){
        let firstPeek = priorityQueue.peek();

        expect(priorityQueue.peek()).to.equal(firstPeek);
        expect(priorityQueue.peek()).to.equal(firstPeek);
        expect(priorityQueue.peek()).to.equal(firstPeek);
      });

      it('always returns what would be dequeued', function(){
        for(let i = 0, len = priorityQueue.getSize(); i < len; i++){
          expect(priorityQueue.peek()).to.equal(priorityQueue.dequeue());
        }

        expect(priorityQueue.getSize()).to.equal(0);
      });
    });

    describe('getSize', function(){
      let BASE_SIZE;
      beforeEach(function(){
        BASE_SIZE = elements.length;
      });

      it('returns 0 for empty trees', function(){
        expect(new PriorityQueue().getSize()).to.equal(0);
      });

      it('returns the number of items in the queue', function(){
        expect(priorityQueue.getSize()).to.equal(BASE_SIZE);
      });

      it('increases when items are added', function(){
        priorityQueue.enqueue("SOMETHING", 9001);
        expect(priorityQueue.getSize()).to.equal(BASE_SIZE + 1);
      });

      it('decreases when items are removed', function(){
        priorityQueue.dequeue();
        expect(priorityQueue.getSize()).to.equal(BASE_SIZE - 1);
      });
    });

    describe('dequeue', function(){
      it('returns undefined when called on an empty priority queue', function(){
        expect(new PriorityQueue().dequeue()).to.be.undefined;
      });

      it('decreases size', function(){
        let initialSize = priorityQueue.getSize();

        priorityQueue.dequeue();
        expect(priorityQueue.getSize()).to.equal(initialSize - 1);
      });

      it('removes the item of highest priority', function(){
        elements.reverse().forEach(function(element){ // Since the index was used as the priority
          expect(priorityQueue.dequeue()).to.equal(element);
        });
      });

      it('is not enqueue-order dependeant', function(){
        let priorityQueue = new PriorityQueue();

        priorityQueue.enqueue("K", 7);
        priorityQueue.enqueue("Y", 0);
        priorityQueue.enqueue("O", 90);
        priorityQueue.enqueue("A", 1);

        expect(priorityQueue.dequeue()).to.equal("O");
        expect(priorityQueue.dequeue()).to.equal("K");
        expect(priorityQueue.dequeue()).to.equal("A");
        expect(priorityQueue.dequeue()).to.equal("Y");
      });
    });

    describe('enqueue', function(){
      it('increases size', function(){
        let initialSize = priorityQueue.getSize();

        priorityQueue.enqueue("A", 1);
        expect(priorityQueue.getSize()).to.equal(initialSize + 1);
      });

      describe('highest priority', function(){
        it('becomes the next peek', function(){
          priorityQueue.enqueue("INFINITY", Infinity);

          expect(priorityQueue.peek()).to.equal("INFINITY");
        });

        it('becomes the next dequeue', function(){
          priorityQueue.enqueue("INFINITY", Infinity);

          expect(priorityQueue.dequeue()).to.equal("INFINITY");
        });
      });
    });
  });
});