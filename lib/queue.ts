import { is } from './index';

/**
 * Operation that returns value either for a string key or other parameter
 * (currently limited to accepting a single parameter).
 */
type Operation<T, V> = (input: T | string) => Promise<V>;

interface QueueItem<T, V> {
   /** Functions to call with result when operation is complete. */
   listeners: Set<(value: V) => void>;
   /** Original operation input. */
   input: T;
}

/**
 * Manage operations that take time to complete. If a key value is requested
 * while the operation is pending then `Promise` resolution will be made a
 * listener to be invoked when the operation completes.
 *
 * If the operation isn't already pending then the operation's own `Promise`
 * will be returned.
 */
export class Queue<T, V> {
   /**
    * Operation that returns value either for a string key or other parameter.
    */
   private op: Operation<T, V>;
   private items: Map<string, QueueItem<T, V>>;

   /**
    * @param operation Method that transforms input to output value
    */
   constructor(operation: Operation<T, V>) {
      this.op = operation;
      this.items = new Map();
   }

   /**
    * Whether queue is ready for requests.
    */
   get ready() {
      return is.callable(this.op);
   }

   /**
    * Cancel operation for `key` and remove listeners.
    */
   cancel(key: string): this {
      if (this.items.has(key)) {
         const item = this.items.get(key);
         item.listeners.clear();
         this.items.delete(key);
      }
      return this;
   }

   /**
    * Cancel all operations and remove listeners.
    */
   clear(): this {
      this.items.forEach(item => {
         item.listeners.clear();
      });
      this.items.clear();
      return this;
   }

   /**
    * Resolve queue operation.
    */
   process(key: string, input?: T): Promise<V> {
      if (this.items.has(key)) {
         // add to existing queue to be notified when operation completes
         const item = this.items.get(key);
         return new Promise<V>(resolve => item.listeners.add(resolve));
      }
      // create new queue and begin operation
      this.items.set(key, {
         input,
         listeners: new Set()
      });

      // pass key as operation argument if no input defined
      const fn: Promise<V> =
         input === undefined ? this.op(key) : this.op(input);

      return fn.then(value => {
         if (this.items.has(key)) {
            // notify listeners and delete from queue
            const item = this.items.get(key);
            item.listeners.forEach(fn => fn(value));
            this.items.delete(key);
         }
         return value;
      });
   }

   get(key: string): QueueItem<T, V> {
      return this.items.get(key);
   }

   /**
    * Pipe output to another queue.
    */
   pipe(key: string, input?: T) {
      return {
         /**
          * Resolve current queue and pass its output to the input of another
          * queue.
          */
         to: <U>(queue: Queue<V, U>): Promise<U> =>
            this.process(key, input).then(value => queue.process(key, value))
      };
   }

   has(key: string): boolean {
      return this.items.has(key);
   }
}
