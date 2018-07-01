import { is, merge, EventEmitter, byteSize, gzip, unzip } from './index';

export interface CacheItem<T> {
   key: string;
   /** Timestamp */
   added: number;
   value: T;
   /** Byte size of value */
   size: number;
}

type CacheLoader = (key: string) => Promise<string>;

/**
 * CachePolicy controls when items may be automatically evicted. Leave value
 * undefined or set to `-1` to disable a particular threshold.
 */
export interface CachePolicy {
   /** Maximum items before earliest is removed from cache. */
   maxItems?: number;
   /** Maximum age in milliseconds before item is removed from cache. */
   maxAge?: number;
   maxBytes?: number;
}

export enum EventType {
   /** Notify when items are removed from the cache (sends list of keys) */
   ItemsEvicted
}

/**
 * Iterate cache items to report total size.
 *
 * @param except Optional list of item keys to exclude from the result
 */
export const totalSize = <T>(
   items: Map<string, CacheItem<T>>,
   except: string[] = []
): number =>
   Array.from(items.values())
      .filter(i => except.indexOf(i.key) < 0)
      .reduce((total, i) => total + i.size, 0);

const defaultPolicy: CachePolicy = {
   maxItems: 0,
   maxAge: 0,
   maxBytes: 0
};

export class Cache<T> {
   private _items: Map<string, CacheItem<T>>;
   private _policy: CachePolicy;
   private _evictTimer: number;
   /**
    * Whether stored item types can have their byte size measured.
    */
   private _canMeasureSize: boolean = true;

   events: EventEmitter<EventType, any>;

   constructor(policy: CachePolicy = {}) {
      this._items = new Map();
      this._policy = merge(defaultPolicy, policy);
      this._evictTimer = 0;
      this.events = new EventEmitter();
   }

   /**
    * Number of items in cache.
    */
   get length(): number {
      return this._items.size;
   }

   /**
    * Total byte size of items or -1 if size can't be measured.
    */
   get size(): number {
      return this._canMeasureSize ? totalSize(this._items) : -1;
   }

   /**
    * Whether cache contains a key.
    */
   contains(key: string, allowEmpty: boolean = false): boolean {
      return (
         this._items.has(key) && (allowEmpty || !is.empty(this._items.get(key)))
      );
   }

   add(key: string, value: T) {
      if (is.value<T>(value)) {
         let size = 0;
         if (this._canMeasureSize) {
            size = byteSize(value);
            if (size == -1) {
               this._canMeasureSize = false;
               size = 0;
            }
         }

         this._items.set(key, {
            key,
            value,
            added: new Date().getTime(),
            size
         });
      }
      this.schedulePrune();
      return this;
   }

   /**
    * Asynchronous check for evictable items.
    */
   private schedulePrune(): Cache<T> {
      if (this._evictTimer > 0) {
         clearTimeout(this._evictTimer);
      }
      this._evictTimer = setTimeout(this.prune.bind(this), 10);
      return this;
   }

   /**
    * Remove items per cache policy and notify listeners.
    */
   prune(): void {
      if (
         this.length > 0 &&
         (this._policy.maxAge != 0 ||
            this._policy.maxItems != 0 ||
            this._policy.maxBytes != 0)
      ) {
         /** Sorted objects allow removal of oldest */
         let sorted: CacheItem<T>[] = Array.from(this._items.values());
         /** List of item keys to be removed */
         let remove: string[] = [];

         sorted.sort((a, b) => a.added - b.added);

         // first remove those that exceed maximum age
         if (this._policy.maxAge > 0) {
            const oldest = new Date().getTime() - this._policy.maxAge;
            remove = remove.concat(
               sorted.filter(i => i.added < oldest).map(i => i.key)
            );
            sorted = sorted.filter(i => remove.indexOf(i.key) == -1);
         }

         // then remove items beyond the maximum count
         if (
            this._policy.maxItems > 0 &&
            sorted.length > this._policy.maxItems
         ) {
            const tooMany = sorted.length - this._policy.maxItems;
            remove = remove.concat(sorted.slice(0, tooMany).map(i => i.key));
            // only keep sorted items that aren't in the remove list
            sorted = sorted.filter(i => remove.indexOf(i.key) == -1);
         }

         // finally remove as many as are needed to go below maximum byte size
         if (this._policy.maxBytes > 0 && this._canMeasureSize) {
            let remainingSize = totalSize(this._items, remove);

            while (remainingSize > this._policy.maxBytes) {
               const item = sorted.shift();
               remainingSize -= item.size;
               remove.push(item.key);
            }
         }

         if (remove.length > 0) {
            remove.forEach(key => {
               this._items.delete(key);
            });

            this.events.emit(EventType.ItemsEvicted, remove);
         }
      }
   }

   get(key: string): T {
      const item = this._items.get(key);
      return is.value(item) ? item.value : null;
   }

   remove(key: string): Cache<T> {
      this._items.delete(key);
      return this;
   }

   clear(): Cache<T> {
      this._items.clear();
      return this;
   }

   /**
    * Apply new cache policy and prune accordingly.
    */
   updatePolicy(policy: CachePolicy): Cache<T> {
      this._policy = merge(defaultPolicy, policy);
      return this.schedulePrune();
   }
}

/**
 * Cache variant that only accepts text that it then compresses.
 */
export class CompressCache extends Cache<Buffer> {
   /**
    * Optional method to automatically load key value when not present in cache.
    * This has the potential to create an infinite loop if there's also a cache
    * policy that limits item count.
    */

   private loader: CacheLoader;

   constructor();
   constructor(loader: CacheLoader);
   constructor(policy: CachePolicy);
   constructor(loader: CacheLoader, policy: CachePolicy);
   constructor(
      loaderOrPolicy?: CachePolicy | CacheLoader,
      policy?: CachePolicy
   ) {
      let loader: CacheLoader = null;

      if (is.callable(loaderOrPolicy)) {
         loader = loaderOrPolicy;
      } else if (is.value(loaderOrPolicy)) {
         policy = loaderOrPolicy;
      } else {
         policy = {};
      }

      super(policy);
      this.loader = loader;
   }

   async addText(key: string, value: string) {
      if (is.empty(value)) {
         return;
      }
      const zipped = await gzip(value);
      return super.add(key, zipped);
   }

   /**
    * GZip buffer.
    */
   getZip(key: string): Buffer {
      return super.get(key);
   }

   async getText(key: string): Promise<string> {
      const buffer = this.getZip(key);
      if (buffer === null) {
         if (this.loader !== null) {
            const value = await this.loader(key);
            if (is.value<string>(value)) {
               this.addText(key, value);
            }
            return value;
         } else {
            return null;
         }
      }
      return unzip(buffer);
   }
}
