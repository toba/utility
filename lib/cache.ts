import { is, merge, removeItem } from '../index';

/**
 * Method to reload cache item.
 */
export type Reloader<T> = (key: string) => Promise<T>;

interface CacheItem<T> {
   key: string;
   /** Timestamp */
   added: number;
   value: T;
   /** Method to reload item if it has been evicted due to a `maxAge` policy. */
   reloader?: Reloader<T>;
}

/**
 * CachePolicy controls when items may be automatically evicted. Leave value
 * undefined or set to `-1` to disable a particular threshold.
 */
export interface CachePolicy {
   /** Maximum items before earliest is removed from cache. */
   maxItems?: number;
   /** Maximum age in milliseconds before item is removed from cache. */
   maxAge?: number;
   /**
    * This isn't implemented because a performant and correct means of measuring
    * JavaScript object memory isn't easily available.
    *
    * https://stackoverflow.com/questions/1248302/how-to-get-the-size-of-a-javascript-object
    */
   maxMemory?: number;
}

/**
 * Method that recieves list of evicted cache keys.
 */
export type EvictionListener = (keys: string[]) => void;

const defaultPolicy: CachePolicy = {
   maxItems: 0,
   maxAge: 0,
   maxMemory: 0
};

export class Cache<T> {
   private _items: { [key: string]: CacheItem<T> };
   private _policy: CachePolicy;
   private _evictListeners: EvictionListener[];
   private _evictTimer: number;
   /**
    * Method that can reload any cache item based on its key.
    */
   private _maxAgeReloader: Reloader<T>;

   constructor(policy: CachePolicy = {}, reloader: Reloader<T> = null) {
      this._items = {};
      this._policy = merge(defaultPolicy, policy);
      this._evictListeners = [];
      this._evictTimer = 0;
      this._maxAgeReloader = reloader;
   }

   get size(): number {
      return Object.keys(this._items).length;
   }

   add(key: string, value: T, reloader: Reloader<T> = null): Cache<T> {
      if (is.value(value)) {
         if (reloader === null) {
            // use common reloader if not given a specific reloader
            reloader = this._maxAgeReloader;
         }
         this._items[key] = {
            key,
            value,
            added: new Date().getTime(),
            reloader
         };
      }
      return this.schedulePrune();
   }

   /**
    * Asynchronous check for evictable items.
    */
   private schedulePrune(): Cache<T> {
      this.cancelPrune();
      this._evictTimer = setTimeout(this.prune.bind(this), 10);
      return this;
   }

   private cancelPrune(): Cache<T> {
      if (this._evictTimer > 0) {
         clearTimeout(this._evictTimer);
      }
      return this;
   }

   /**
    * Remove items per cache policy and notify listeners.
    */
   prune(): void {
      if (
         this.size > 0 &&
         (this._policy.maxAge != 0 || this._policy.maxItems != 0)
      ) {
         let sorted = Object.keys(this._items).map(key => this._items[key]);
         let remove: string[] = [];
         let reloaders: Reloader<T>[] = [];

         sorted.sort((a, b) => a.added - b.added);

         if (this._policy.maxAge > 0) {
            const oldest = new Date().getTime() - this._policy.maxAge;
            remove = remove.concat(
               sorted.filter(i => i.added < oldest).map(i => i.key)
            );
            sorted = sorted.filter(i => i.added >= oldest);
            reloaders = remove
               .map(key => this._items[key])
               .filter(i => i.reloader !== null)
               .map(i => i.reloader)
         }

         if (
            this._policy.maxItems > 0 &&
            sorted.length > this._policy.maxItems
         ) {
            const tooMany = sorted.length - this._policy.maxItems;
            remove = remove.concat(sorted.slice(0, tooMany).map(i => i.key));
         }

         if (remove.length > 0) {
            remove.forEach(key => {
               delete this._items[key];
            });

            this._evictListeners.forEach(fn => {
               fn(remove);
            });

            if ()
         }
      }
   }
   private reload(reloader: Reloader<T>): Promise<T> {
      return null;
   }

   get(key: string): T {
      const item = this._items[key];
      return is.value(item) ? item.value : null;
   }

   remove(key: string): Cache<T> {
      delete this._items[key];
      return this;
   }

   clear(): Cache<T> {
      this._items = {};
      return this.cancelPrune();
   }

   /**
    * Apply new cache policy and prune accordingly.
    */
   updatePolicy(
      policy: CachePolicy,
      listener: EvictionListener = null
   ): Cache<T> {
      this._policy = merge(defaultPolicy, policy);
      if (listener !== null) {
         this.onEvict(listener);
      }
      return this.schedulePrune();
   }

   /**
    * Listen for items pruned from cache for policy reasons.
    */
   onEvict(listener: EvictionListener): Cache<T> {
      this._evictListeners.push(listener);
      return this;
   }

   removeEvictionListener(listener: EvictionListener): boolean {
      return removeItem(this._evictListeners, listener);
   }
}
