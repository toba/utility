import { is } from './';

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
export function includesAll<T>(haystack: T[], ...needles: T[]): boolean {
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
export function isEqualList<T>(list1: T[], list2: T[]): boolean {
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
export function listDifference<T>(list1: T[], list2: T[]): T[] {
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
export function findInSet<T>(s: Set<T>, fn: (item: T) => boolean): T {
   for (const item of s) {
      if (fn(item)) {
         return item;
      }
   }
   return undefined;
}
