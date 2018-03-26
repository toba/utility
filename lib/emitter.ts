import { is, removeItem } from '../index';

/**
 * Manage event subscribers.
 */
export class EventEmitter<T extends number, E> {
   listeners: { [key: number]: ((event: E) => void)[] };

   constructor() {
      this.listeners = {};
   }

   /**
    * Whether a listener type is already defined.
    */
   private hasType(type: T): boolean {
      return is.defined(this.listeners, type);
   }

   /**
    * Whether subscribers exist for an event type.
    */
   hasSubscribers(type: T): boolean {
      return this.hasType(type) && this.listeners[type].length > 0;
   }

   emit(type: T, event?: E): boolean {
      if (this.hasType(type)) {
         this.listeners[type].forEach(fn => {
            fn(event);
         });
         return true;
      }
      return false;
   }

   subscribe(type: T, fn: (event: E) => void): (event: E) => void {
      if (!this.hasType(type)) {
         this.listeners[type] = [];
      }
      this.listeners[type].push(fn);
      return fn;
   }

   addEventListener(type: T, fn: (event: E) => void): (event: E) => void {
      return this.subscribe(type, fn);
   }

   /**
    * Remove listener method.
    */
   unsubscribe(type: T, fn: (event: E) => void): boolean {
      return this.hasType(type) ? removeItem(this.listeners[type], fn) : false;
   }

   /**
    * Remove listener method.
    */
   removeEventListener(type: T, fn: (event: E) => void): boolean {
      return this.unsubscribe(type, fn);
   }

   /**
    * Remove all listeners to an event type or all listeners for all event types
    * if no type given.
    */
   unsubscribeAll(type: T = null): boolean {
      if (type == null) {
         this.listeners = {};
         return true;
      }
      if (this.hasType(type)) {
         this.listeners[type] = [];
         return true;
      }
      return false;
   }

   /**
    * Remove all listeners to an event type or all listeners for all event types
    * if no type given.
    */
   removeAll(type: T = null): boolean {
      return this.unsubscribeAll(type);
   }
}
