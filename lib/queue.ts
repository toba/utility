import { is } from './index';

/**
 * Manage operations that take time to complete. If a key value is requested
 * while its operation is pending then `Promise` resolution will be made a
 * listener to be invoked when the operation completes.
 *
 * If the operation isn't already pending then the operation's own `Promise`
 * will be returned.
 */
export class Queue<K, V> {
   /** Operation that returns value for key. */
   op: (key: K) => Promise<V>;
   /** Methods to be notified when a key operation completes. */
   listeners: Map<K, Set<(value: V) => void>>;
   /** Keys to operations that are already running. */
   pending: Set<K>;
   waitsFor: Queue<K, V>;

   constructor(operation: (key: K) => Promise<V>) {
      this.op = operation;
      this.listeners = new Map();
      this.pending = new Set();
   }

   /**
    * Whether queue is ready for requests.
    */
   get ready() {
      return is.callable(this.op);
   }

   /**
    * Enter queue for a key operation.
    */
   resolve(key: K): Promise<V> {
      if (this.pending.has(key)) {
         return new Promise<V>(resolve => this.listeners.get(key).add(resolve));
      }
      this.pending.add(key);
      this.listeners.set(key, new Set());

      return this.op(key).then(value => {
         if (this.listeners.has(key)) {
            this.listeners.get(key).forEach(fn => fn(value));
            this.listeners.delete(key);
         }
         this.pending.delete(key);
         return value;
      });
   }

   pipe(key: K) {
      return {
         to: <U>(queue: Queue<K, U>): Promise<U> => {
            return this.resolve(key).then(_value => {
               return queue.resolve(key);
            });
         }
      };
   }

   has(key: K): boolean {
      return this.pending.has(key);
   }
}
