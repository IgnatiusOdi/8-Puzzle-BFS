// User defined class
// to store element and its priority
class QElement {
    constructor(element, priority)
    {
        this.element = element;
        this.priority = priority;
    }
}
 
/**
 * PriorityQueue class
 */
class PriorityQueue {
 
    /**
     * An array is used to implement priority
     */
    constructor()
    {
        this.items = [];
    }
 
    
    /**
     * enqueue function to add element to the queue as per priority
     * @param {*} element 
     * @param {Number} priority 
     */
    enqueue(element, priority)
    {
        // creating object from queue element
        var qElement = new QElement(element, priority);
        var contain = false;
    
        // iterating through the entire
        // item array to add element at the
        // correct location of the Queue
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > qElement.priority) {
                // Once the correct location is found it is
                // enqueued
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }
    
        // if the element have the highest priority
        // it is added at the end of the queue
        if (!contain) {
            this.items.push(qElement);
        }
    }

    
    /**
     * dequeue method to remove element from the queue
     * if the queue is empty returns Underflow
     * @returns element
     */
    dequeue()
    {
        // return the dequeued element
        // and remove it.
        // if the queue is empty
        // returns Underflow
        if (this.isEmpty)
            return "Underflow";
        return this.items.shift().element;
    }

    /**
     * returns the highest priority element in the Priority queue without removing it.
     * @returns element
     */
    front()
    {
        // returns the highest priority element
        // in the Priority queue without removing it.
        if (this.isEmpty)
            return "No elements in Queue";
        return this.items[0];
    }

    /**
     * returns the lowest priority element in the Priority queue without removing it.
     * @returns element
     */
    rear()
    {
        if (this.isEmpty)
            return "No elements in Queue";
        return this.items[this.items.length - 1];
    }

    /**
     * return true if the queue is empty.
     * @returns true\false
     */
    get isEmpty()
    {
        return this.items.length == 0;
    }

    
    /**
     * prints all the element of the queue
     * @returns String of all element
     */
    printPQueue()
    {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i].element + " ";
        return str;
    }
}