/**
 * Manage event subscribers.
 *
 * @param T Event type enumeration
 * @param E Kind of event payload
 */
export class EventEmitter<T extends number, E> {
   listeners: Map<number, Set<(event: E | undefined) => void>>;

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
      return this.hasType(type) && this.listeners.get(type)!.size > 0;
   }

   /**
    * Invoke all listeners with an optional payload that are subscribed to an
    * event type.
    */
   emit(type: T, event?: E): boolean {
      if (this.hasType(type)) {
         this.listeners.get(type)!.forEach(fn => {
            fn(event);
         });
         return true;
      }
      return false;
   }

   /**
    * Supply function that should be called when a type of event is emitted.
    */
   subscribe(type: T, fn: (event: E) => void): (event: E) => void {
      if (!this.hasType(type)) {
         this.listeners.set(type, new Set());
      }
      this.listeners.get(type)!.add(fn);
      return fn;
   }

   /**
    * Alias for `subscribe`.
    */
   addEventListener = this.subscribe;

   /**
    * Remove listener method.
    */
   unsubscribe(type: T, fn: (event: E) => void): boolean {
      return this.hasType(type) ? this.listeners.get(type)!.delete(fn) : false;
   }

   /**
    * Alias for `unsubscribe`.
    */
   removeEventListener = this.unsubscribe;

   /**
    * Remove all listeners to an event type or all listeners for all event types
    * if no type given.
    */
   unsubscribeAll(type: T | null = null): boolean {
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
    * Alias for `unsubscribeAll`.
    */
   removeAll = this.unsubscribeAll;
}
