import { is, MimeType, CharSet } from './index';

interface Hash {
   [key: string]: any;
}

/**
 * Deep clone an object.
 * @param strict If true then null or undefined is returned
 * as such, otherwise an empty object may be returned.
 */
export function clone<T extends object | any[] | null | undefined>(
   thing: T,
   strict = true
): T {
   if (is.array<any>(thing)) {
      return thing.map(v => clone(v)) as T;
   }
   if (!is.value<object>(thing)) {
      return strict ? thing : ({} as T);
   }

   const copy: { [key: string]: any } = {};

   for (const i in thing) {
      const value: any = (thing as any)[i];
      if (value != null) {
         if (is.array<any>(value)) {
            copy[i] = value.map(v => clone(v));
         } else if (typeof value == is.Type.Object) {
            copy[i] = clone(value);
         } else {
            copy[i] = value;
         }
      } else {
         copy[i] = null;
      }
   }
   return copy as T;
}

export function mergeValues<T extends object, U>(base: T, additions: U): T & U;
export function mergeValues<T extends object, U, V>(
   base: T,
   add1: U,
   add2: V
): T & U & V;
export function mergeValues<T extends object, U, V, W>(
   base: T,
   add1: U,
   add2: V,
   add3: W
): T & U & V & W;
/**
 * Merge additions into a base object, only replacing base values if the
 * additions are not null or undefined. Arrays will not be merged but will be
 * treated as values meaning additions supersede the base.
 */
export function mergeValues<T extends object>(base: T, ...additions: any[]): T {
   return additions.reduce((existing, add: Hash) => {
      //for (const key of Reflect.ownKeys(add)) {
      if (is.value<Hash>(add)) {
         for (const key of Object.keys(add)) {
            const v: any = add[key];
            const exists = is.value(existing[key]);
            if (is.value(v) || !exists) {
               // only replace base value if addition is non-null
               if (
                  !exists ||
                  Array.isArray(v) ||
                  typeof v != is.Type.Object ||
                  typeof existing[key] != is.Type.Object
               ) {
                  existing[key] = v;
               } else {
                  existing[key] = mergeValues(existing[key], v);
               }
            }
         }
      }
      return existing;
   }, clone(base));
}

export function merge<T extends object, U>(base: T, add1: U): T & U;
export function merge<T extends object, U, V>(
   base: T,
   add1: U,
   add2: V
): T & U & V;
export function merge<T extends object, U, V, W>(
   base: T,
   add1: U,
   add2: V,
   add3: W
): T & U & V & W;
/**
 * Merge additions into base object, allowing `null` or `undefined` to replace
 * existing values.
 */
export function merge<T extends object>(base: T, ...additions: any[]) {
   return additions
      .filter(add => is.object(add))
      .reduce((existing, add) => {
         for (const key of Object.keys(add)) {
            const v = add[key];
            existing[key] = is.object(v, true) ? merge(existing[key], v) : v;
         }
         return existing;
      }, clone(base));
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
 * Generate random letter/number sequence.
 */
export function randomID(size: number = 7): string {
   const chars: string[] = [];
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
export function inferMimeType(fileName: string): MimeType | null {
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
      case 'rss':
         return MimeType.RSS;
      case 'atom':
         return MimeType.Atom;
      default:
         return null;
   }
}

export const addCharSet = (
   type: MimeType,
   charSet: CharSet = CharSet.UTF8
): string => `${type}; charset=${charSet}`;
