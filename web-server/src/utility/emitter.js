/**
 * @author code-crash
 */

import EventEmitter from 'events';

class EventManagement {

    /**
     * @description - We will initialize the event emitter here
     */
	constructor() {
		this.eventEmitter = new EventEmitter();
	}

    /**
     * @description - Adds the @listener function to the end of the listeners array
     * 			 	for the event named @eventName
     * 				Will ensure that only one time the listener added for the event
     *
     * @param {string} eventName
     * @param {function} listener
     */
	on(eventName, listener) {
		// console.log('EventManagement: called: on', eventName, listener);
		this.eventEmitter.on(eventName, listener);
	}

    /**
     * @description - Will remove the specified @listener from @eventname list
     *
     * @param {string} eventName
     * @param {function} listener
     */
	removeEventListener(eventName, listener) {
		// console.log('EventManagement: called: removeEventListener', eventName, listener);
		this.eventEmitter.removeListener(eventName, listener);
	}

	/**
	 * @description - Will emit the event on the event name with the @payload
	 * and if its an error set the @error value
	 *
	 * @param {string} event
	 * @param {object} payload
	 * @param {boolean} error
	 */
	emit(event, payload, error = false) {
		// console.log('EventManagement: called: emit', event, payload);
		this.eventEmitter.emit(event, payload, error);
	}


    /**
     * @description - Returns the event emitter instance. we can perform the operations based on this event emitter
     * 				  
     */
	getEventEmitter() {
		// console.log('EventManagement: called: getEventEmitter');
		return this;
	}
}

const _em = new EventManagement(); // Create immediate instance
export default _em.getEventEmitter(); // Return the event to listen or emit
