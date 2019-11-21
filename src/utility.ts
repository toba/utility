import { is, MimeType, CharSet, ValueType } from './index';

interface Hash {
   [key: string]: any;
}

/**
 * Deep clone an object.
 * @param strict If true then null or undefined are returned unchanged,
 * otherwise they are replaced with an empty object (`{}`)
 * @param done Map of keys that have already been cloned, used to avoid infinite
 * loops on circular references
 *
 * @see https://stackoverflow.com/questions/40291987/javascript-deep-clone-object-with-circular-references
 */
export function clone<T extends object | any[] | Date>(
   thing: T,
   strict = true,
   done = new WeakMap<T, T>()
): T {
   if (Object(thing) !== thing || thing instanceof Function) {
      // do not clone primitives or functions
      return thing;
   }
   if (!is.value<T>(thing)) {
      return strict ? thing : ({} as T);
   }
   if (is.date(thing)) {
      return new Date(thing) as T;
   }
   if (done.has(thing)) {
      return done.get(thing)!;
   }
   let copy: T;

   try {
      // attempt to make new instance
      copy = new (thing as any).constructor();
   } catch (e) {
      // if unable to construct then just make it
      copy = Object.create(Object.getPrototypeOf(thing));
   }

   if (thing instanceof Map)
      Array.from(thing, ([key, val]) =>
         (copy as Map<any, any>).set(
            clone(key, strict, done),
            clone(val, strict, done)
         )
      );
   else if (thing instanceof Set)
      Array.from(thing, key =>
         (copy as Set<any>).add(clone(key, strict, done))
      );

   done.set(thing, copy);

   return Object.assign(
      copy,
      ...Object.keys(thing).map(key => ({
         [key]: clone((thing as { [key: string]: any })[key], strict, done)
      }))
   );
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
export function mergeValues<T extends object>(
   base: T,
   ...additions: any[]
): any;

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
                  typeof v != ValueType.Object ||
                  typeof existing[key] != ValueType.Object
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

/**
 * Merge additions into base object, allowing `null` or `undefined` to replace
 * existing values (simple approach).
 */
export function merge<T extends object, U>(base: T, add1: U): T & U;

/**
 * Merge additions into base object, allowing `null` or `undefined` to replace
 * existing values (simple approach).
 */
export function merge<T extends object, U, V>(
   base: T,
   add1: U,
   add2: V
): T & U & V;

/**
 * Merge additions into base object, allowing `null` or `undefined` to replace
 * existing values (simple approach).
 */
export function merge<T extends object, U, V, W>(
   base: T,
   add1: U,
   add2: V,
   add3: W
): T & U & V & W;

/**
 * Merge additions into base object, allowing `null` or `undefined` to replace
 * existing values (simple approach).
 */
export function merge<T extends object>(base: T, ...additions: any[]): any;

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
