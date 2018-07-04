import { Cache, is, unzip, gzip, CachePolicy, Queue } from './index';
import { EventType } from './cache';
import { QueueEvent } from './queue';

/**
 * Method to populate missing cache value.
 */
type CacheLoader<T> = (key: string) => Promise<T>;

/**
 * Cache variant that only accepts text that it GZips internally.
 */
export class CompressCache extends Cache<Buffer> {
   /**
    * Optional method to automatically load key value when not present in cache.
    * This has the potential to create an infinite loop if there's also a cache
    * policy that limits item count.
    */
   private loader: CacheLoader<string>;
   /** Queue operation that GZips text. */
   private zipQueue: Queue<string, Buffer>;
   /** Queue operation that loads text if a `loader` is defined. */
   private loadQueue: Queue<string, string>;

   constructor();
   constructor(loader: CacheLoader<string>);
   constructor(policy: CachePolicy);
   constructor(loader: CacheLoader<string>, policy: CachePolicy);
   constructor(
      loaderOrPolicy?: CachePolicy | CacheLoader<string>,
      policy?: CachePolicy
   ) {
      let loader: CacheLoader<string> = null;

      if (is.callable(loaderOrPolicy)) {
         loader = loaderOrPolicy;
      } else if (is.value(loaderOrPolicy)) {
         policy = loaderOrPolicy;
      } else {
         policy = {};
      }

      super(policy);
      this.loader = loader;
      this.zipQueue = new Queue(gzip);
      this.loadQueue = new Queue(this.loader);
      // the load queue executes whenever kay is not found in cache
      this.loadQueue.events.subscribe(QueueEvent.OperationStart, key => {
         this.events.emit(EventType.KeyNotFound, key);
      });
   }

   clear(): this {
      super.clear();
      this.zipQueue.clear();
      this.loadQueue.clear();
      return this;
   }

   remove(key: string): this {
      super.remove(key);
      this.zipQueue.cancel(key);
      this.loadQueue.cancel(key);
      return this;
   }

   /**
    * Add text value to cache and return its compressed bytes.
    */
   async addText(key: string, value: string) {
      if (is.empty(value)) {
         return;
      }
      const zipped = await this.zipQueue.process(key, value);
      return super.add(key, zipped);
   }

   /**
    * Get the GZip bytes (`Buffer`) for cached text.
    */
   getZip(key: string): Promise<Buffer> {
      if (this.contains(key)) {
         // return existing value
         return Promise.resolve<Buffer>(super.get(key));
      } else if (this.zipQueue.has(key)) {
         // wait for zipping to complete then resolve
         return this.zipQueue.process(key);
      } else if (this.loadQueue.ready) {
         // wait for loader then zipping
         return this.loadQueue.pipe(key).to(this.zipQueue);
      } else {
         this.events.emit(EventType.KeyNotFound, key);
         return Promise.resolve(null);
      }
   }

   async getText(key: string): Promise<string> {
      if (this.zipQueue.has(key)) {
         // return zip queue input which is the plain text we want
         return this.zipQueue.get(key).input;
      }

      if (this.loadQueue.has(key)) {
         // if key is in load queue then text isn't ready yet -- enter queue
         return this.loadQueue.process(key);
      }

      // otherwise load cached bytes for text
      const bytes = super.get(key, true);

      if (bytes === null) {
         // nothing in cache -- try to load
         if (this.loadQueue.ready) {
            const value = await this.loadQueue.process(key);
            this.addText(key, value);
            return value;
         } else {
            this.events.emit(EventType.KeyNotFound, key);
            return null;
         }
      }
      // if compressed bytes are in cache then unzip them
      return unzip(bytes);
   }
}
