class _Node {
  constructor(value, next, prev) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
  }
  insertFirst(item) {
    this.head = new _Node(item, null);
  }
  insertLast(item) {
    if (this.head === null) this.insertFirst(item);
    else {
      let tempNode = this.head;
      while (tempNode.next !== null) tempNode = tempNode.next;
      tempNode.next = new _Node(item, null);
    }
  }
  remove(item) {
    if (!this.head) return null;
    if (this.head.value === item) {
      this.head = this.head.next;
      return;
    }
    let currNode = this.head;
    let previousNode = this.head;
    while (currNode !== null && currNode.value !== item) {
      previousNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      return;
    }
    previousNode.next = currNode.next;
  }
  find(item) {
    let currNode = this.head;
    if (!this.head) {
      return null;
    }
    while (currNode.value !== item) {
      if (currNode.next === null) {
        return null;
      } else {
        currNode = currNode.next;
      }
    }
    return currNode;
  }
  insertBefore(item, key) {
    if (this.head === null) {
      return null;
    }
    let currNode = this.head;
    let prevNode = this.head;
    while (currNode.value !== key && currNode !== null) {
      prevNode = currNode;
      currNode = currNode.next;
    }
    if (currNode === null) {
      return;
    }
    prevNode.next = new _Node(item, currNode);
  }
  insertAfter(item, key) {
    if (this.head === null) {
      return null;
    }
    let currNode = this.head;
    while (currNode.value !== key && currNode !== null) {
      currNode = currNode.next;
    }
    if (currNode === null) {
      return;
    }
    let tempNode = currNode.next;
    currNode.next = new _Node(item, tempNode);
  }
  
  insertAt(itemToInsert, nthPosition) { 
    
    if (nthPosition < 0) { 
      throw new Error('Position error'); 
    } 
    if (nthPosition === 0) { 
      this.insertFirst(itemToInsert); 
    }else { 
      const node = this._findNthElement(nthPosition - 1); 
      const newNode = new _Node(itemToInsert, null); 
      newNode.next = node.next; 
      node.next = newNode; 
    } 
  }
  
  _findNthElement(position) { 
    let node = this.head; 
    for (let i=0; i<position; i++) { 
      node = node.next; 
    } 
    return node; 
  }
}


module.exports = { LinkedList};