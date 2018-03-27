import * as compress from 'zlib';
import { is, MimeType, Encoding } from '../index';

type Hash = { [key: string]: any };

/**
 * Merge additions into a base object, only replacing base values if the
 * additions are not null or undefined. Arrays will not be merged but will be
 * treated as values meaning additions supersede the base.
 */
export function merge<T extends object>(base: T, ...additions: any[]): T {
   return additions.reduce(
      (existing, add: Hash) => {
         //for (const key of Reflect.ownKeys(add)) {
         if (is.value<Hash>(add)) {
            for (const key of Object.keys(add)) {
               const v: any = add[key];
               const exists = is.defined(existing, key);
               if (is.value(v) || !exists) {
                  // only replace base value if addition is non-null
                  if (Array.isArray(v) || typeof v != is.Type.Object) {
                     existing[key] = v;
                  } else {
                     existing[key] = merge(existing[key], v);
                  }
               }
            }
         }
         return existing;
      },
      Object.assign({}, base) as any
   );
}

/**
 * GZip compress a string.
 */
export async function gzip(text: string) {
   return new Promise<Buffer>((resolve, reject) => {
      compress.gzip(Buffer.from(text), (err, buffer) => {
         if (is.value(err)) {
            reject(err);
         } else {
            resolve(buffer);
         }
      });
   });
}

/**
 * GZip decompress a string.
 */
export async function unzip(value: Buffer) {
   return new Promise<string>((resolve, reject) => {
      compress.unzip(value, (err, buffer) => {
         if (is.value(err)) {
            reject(err);
         } else {
            resolve(buffer.toString(Encoding.UTF8));
         }
      });
   });
}

/**
 * Only handling the very simple cases of strings and Buffers.
 *
 * https://stackoverflow.com/questions/1248302/how-to-get-the-size-of-a-javascript-object
 */
export function byteSize(obj: any): number {
   if (typeof obj === is.Type.String) {
      return obj.length;
   }
   if (obj instanceof Buffer) {
      return obj.length;
   }
   return -1;
}

/**
 * Remove item from an array.
 */
export function removeItem<T>(list: T[], item: T): boolean {
   const i = list.indexOf(item);
   if (i >= 0) {
      list.splice(i, 1);
      return true;
   }
   return false;
}

/**
 * Add item to array only if it's not already included. Return number of added
 * items.
 */
export function addUnique<T>(list: T[], ...item: T[]): number {
   let added = 0;
   item.forEach(i => {
      const index = list.indexOf(i);
      if (index < 0) {
         list.push(i);
         added++;
      }
   });
   return added;
}

/**
 * Coordinates for a mouse click or a touch depending on the event.
 */
export function eventCoord(
   e: MouseEvent | TouchEvent
): { x: number; y: number } {
   if (e) {
      if (e instanceof TouchEvent) {
         if (e.changedTouches && e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            return { x: touch.clientX, y: touch.clientY };
         }
      } else if (e.pageX !== undefined) {
         return { x: e.pageX, y: e.pageY };
      }
   }
   return { x: 0, y: 0 };
}

/**
 * Combine parameters into a comma-delimited list.
 */
export function list(...items: (number | string)[]) {
   return items.join(', ');
}

/**
 * Shuffle an array into new array.
 *
 * http://sroucheray.org/blog/2009/11/array-sort-should-not-be-used-to-shuffle-an-array/
 */
export function shuffle<T>(source: T[]): T[] {
   if (!is.array(source) || source.length === 0) {
      return null;
   }

   let i = source.length;
   // clone source array
   const out = source.slice(0);

   while (--i) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = out[i];
      out[i] = out[j];
      out[j] = temp;
   }
   return out;
}

/**
 * Generate random letter/number sequence.
 */
export function randomID(size: number = 7) {
   const chars = [];
   const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   const length = possible.length;

   for (let i = 0; i < size; i++) {
      chars.push(possible.charAt(Math.floor(Math.random() * length)));
   }
   return chars.join('');
}

/**
 * Infer MIME type from file extension.
 */
export function inferMimeType(fileName: string): MimeType {
   if (!fileName.includes('.')) {
      return null;
   }
   const parts = fileName.split('.');
   const ext = parts[parts.length - 1].toLowerCase();

   switch (ext) {
      case 'png':
         return MimeType.PNG;
      case 'jpg':
      case 'jpeg':
         return MimeType.JPEG;
      case 'txt':
      case 'text':
         return MimeType.Text;
      case 'xml':
         return MimeType.XML;
      case 'gpx':
         return MimeType.GPX;
      case 'zip':
         return MimeType.Zip;
      case 'htm':
      case 'html':
         return MimeType.HTML;
      case 'json':
         return MimeType.JSON;
      case 'pdf':
         return MimeType.PDF;
      case 'gif':
         return MimeType.GIF;
      case 'css':
         return MimeType.CSS;
      case 'svg':
         return MimeType.SVG;
      default:
         return null;
   }
}
