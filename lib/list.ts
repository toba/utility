import { is } from '../';

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
