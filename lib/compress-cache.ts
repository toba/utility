import { Cache, is, unzip, gzip, CachePolicy, Queue } from './index';

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
   private zipQueue: Queue<string, Buffer>;
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
   }

   /**
    * Add text value to cache and return its compressed bytes.
    */
   async addText(key: string, value: string) {
      if (is.empty(value)) {
         return;
      }
      const zipped = await this.zipQueue.resolve(key);
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
         return this.zipQueue.resolve(key);
         // const queue = this.zipQueue.get(key);
         // return new Promise<Buffer>(resolve => {
         //    queue.listeners.push(resolve);
         // });
      } else if (this.loadQueue.ready) {
         // wait for loader then zipping
         //return this.loader(key).then(text => this.addText(key, text));
         return this.loadQueue.pipe(key).to(this.zipQueue);
      } else {
         return Promise.resolve(null);
      }
   }

   async getText(key: string): Promise<string> {
      if (this.zipQueue.has(key)) {
         // text is being compressed and hasn't been cached yet -- return queue
         //return this.zipQueue.get(key);
      }

      if (this.loadQueue.has(key)) {
         return this.loadQueue.resolve(key);
      }

      const bytes = super.get(key);
      if (bytes === null) {
         if (this.loader !== null) {
            const value = await this.loader(key);
            this.addText(key, value);
            return value;
         } else {
            return null;
         }
      }
      return unzip(bytes);
   }
}
