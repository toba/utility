import { is } from './index';

/**
 * Combine parameters into a comma-delimited list.
 */
export function list(...items: (number | string)[]) {
   return items.join(', ');
}

/**
 * Return scalar for variables that can be either discrete or an array.
 *
 * @param useLastIfList By default, the first element is returned if variable
 * is an array. Set this `true` to instead return the last item.
 */
export function unlist<T>(list: T[] | T, useLastIfList = false): T {
   if (is.array<T>(list)) {
      const index = useLastIfList ? list.length - 1 : 0;
      return list[index];
   }
   return list;
}

/**
 * Shuffle an array into new array.
 *
 * @see http://sroucheray.org/blog/2009/11/array-sort-should-not-be-used-to-shuffle-an-array/
 */
export function shuffle<T>(source: T[] | null): T[] | null {
   if (!is.array<T>(source) || source.length === 0) {
      return null;
   }

   let i = source.length;
   // clone source array
   const out = source.slice(0);

   while (--i !== 0) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = out[i];
      out[i] = out[j];
      out[j] = temp;
   }
   return out;
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
 * Whether a list (haystack) contains all items (needles).
 * @param hastack List to search
 * @param needles Items that should all be in the list
 */
export function includesAll<T>(haystack: T[] | null, ...needles: T[]): boolean {
   if (haystack === null || needles === null) {
      return false;
   }
   if (needles.length > haystack.length) {
      return false;
   }
   // haystack must contain all needles if we can't find any not indexed there
   return needles.find(n => haystack.indexOf(n) == -1) === undefined;
}

/**
 * Shallow comparison of two lists.
 */
export function isEqualList<T>(list1: T[] | null, list2: T[] | null): boolean {
   if (list1 === null || list2 === null) {
      return false;
   }
   if (list1.length != list2.length) {
      return false;
   }
   // must be equal if we can find no members that aren't also members of the
   // other list
   return list1.find(i => list2.indexOf(i) == -1) === undefined;
}

/**
 * List elements that are different between two lists.
 */
export function listDifference<T>(
   list1: T[] | null,
   list2: T[] | null
): T[] | null {
   if (list1 === null || list1.length == 0) {
      return list2;
   }
   if (list2 === null || list2.length == 0) {
      return list1;
   }
   return list1
      .filter(i => list2.indexOf(i) == -1)
      .concat(list2.filter(i => list1.indexOf(i) == -1));
}

/**
 * Map set items to an array.
 */
export function mapSet<T, U>(s: Set<T>, fn: (item: T) => U): U[] {
   return Array.from(s).map(fn);
}

/**
 * Filter set items to a subset of the same type.
 */
export function filterSet<T>(s: Set<T>, fn: (item: T) => boolean): Set<T> {
   const out = new Set<T>();
   s.forEach(v => {
      if (fn(v)) {
         out.add(v);
      }
   });
   return out;
}

/**
 * Find set item matching predicate.
 */
export function findInSet<T>(
   s: Set<T>,
   fn: (item: T) => boolean
): T | undefined {
   // eslint-disable-next-line
   for (const item of s) {
      if (fn(item)) {
         return item;
      }
   }
   return undefined;
}

/** Method to call for each item in an array */
export type ArrayCallback<T, R> = (item: T, index: number) => R;

/**
 * Execute method for each item in an array (more than twice as fast as
 * built-in array `forEach`).
 *
 * @see https://jsperf.com/toba-array
 */
export function forEach<T>(list: T[], fn: ArrayCallback<T, void>) {
   const length = list.length;
   for (let i = 0; i < length; i++) {
      fn(list[i], i);
   }
}

export type ObjectCallback<V> = (key: string, value: V) => void;

export function forEachKeyValue<V>(
   hash: { [key: string]: V },
   fn: ObjectCallback<V>
) {
   forEach(Object.keys(hash), key => fn(key, hash[key]));
}

/**
 * @param filter Method that returns `true` if the array item should be processed
 * @param fn Method applied to array item
 */
export function filterEach<T>(
   list: T[],
   filter: ArrayCallback<T, boolean>,
   fn: ArrayCallback<T, void>
) {
   forEach(list, (item, index) => {
      if (filter(item, index)) {
         fn(item, index);
      }
   });
}

/**
 * Whether any items in `list1` are also in `list2`.
 */
export function intersects<T>(list1: T[], list2: T[]): boolean {
   if (list1.length == 0 || list2.length == 0) {
      return false;
   }
   for (let i = 0; i < list1.length; i++) {
      if (list2.includes(list1[i])) {
         return true;
      }
   }
   return false;
}

/**
 * Reverse a list.
 */
export function reverse<T>(list: T[]): T[] {
   const out = new Array(list.length) as T[];
   for (let i = list.length - 1, j = 0; i >= 0; i--, j++) {
      out[j] = list[i];
   }
   return out;
}
