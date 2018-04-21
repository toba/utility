/**
 * Manage event subscribers.
 */
export class EventEmitter<T extends number, E> {
   listeners: Map<number, Set<(event: E) => void>>;

   constructor() {
      this.listeners = new Map();
   }

   /**
    * Whether a listener type is already defined.
    */
   private hasType(type: T): boolean {
      return this.listeners.has(type);
   }

   /**
    * Whether subscribers exist for an event type.
    */
   hasSubscribers(type: T): boolean {
      return this.hasType(type) && this.listeners.get(type).size > 0;
   }

   emit(type: T, event?: E): boolean {
      if (this.hasType(type)) {
         this.listeners.get(type).forEach(fn => {
            fn(event);
         });
         return true;
      }
      return false;
   }

   subscribe(type: T, fn: (event: E) => void): (event: E) => void {
      if (!this.hasType(type)) {
         this.listeners.set(type, new Set());
      }
      this.listeners.get(type).add(fn);
      return fn;
   }

   addEventListener(type: T, fn: (event: E) => void): (event: E) => void {
      return this.subscribe(type, fn);
   }

   /**
    * Remove listener method.
    */
   unsubscribe(type: T, fn: (event: E) => void): boolean {
      return this.hasType(type) ? this.listeners.get(type).delete(fn) : false;
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
         this.listeners = new Map();
         return true;
      }
      if (this.hasType(type)) {
         this.listeners.set(type, new Set());
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
