import { is } from './is';
import { re } from './regex';

/**
 * Pad integer with leading zeroes.
 */
export function leadingZeros(d: number, count: number): string {
   return d.toString().padStart(count, '0');
}

/**
 *
 * @param capitalize Whether to capitalize the word
 */
export function sayNumber(n: number, capitalize = true): string {
   let word = n.toString();
   switch (n) {
      case 1:
         word = 'One';
         break;
      case 2:
         word = 'Two';
         break;
      case 3:
         word = 'Three';
         break;
      case 4:
         word = 'Four';
         break;
      case 5:
         word = 'Five';
         break;
      case 6:
         word = 'Six';
         break;
      case 7:
         word = 'Seven';
         break;
      case 8:
         word = 'Eight';
         break;
      case 9:
         word = 'Nine';
         break;
      case 10:
         word = 'Ten';
         break;
      case 11:
         word = 'Eleven';
         break;
      case 12:
         word = 'Twelve';
         break;
      case 13:
         word = 'Thirteen';
         break;
      case 14:
         word = 'Fourteen';
         break;
      case 15:
         word = 'Fifteen';
         break;
      case 16:
         word = 'Sixteen';
         break;
      case 17:
         word = 'Seventeen';
         break;
      case 18:
         word = 'Eighteen';
         break;
      case 19:
         word = 'Nineteen';
         break;
      case 20:
         word = 'Twenty';
         break;
   }
   return capitalize ? word : word.toLowerCase();
}

/**
 * Remove non-numeric characters from string.
 *
 * @param {number} not Optional number to return if none found in text
 */
export function parseNumber(text: string, not = NaN): number {
   text = (text ? text : '').replace(/[^\d\.]/g, '');
   return is.empty(text) ? not : parseFloat(text);
}

/**
 * Return text parsed as number if it contains only numeric values otherwise
 * return the text unchanged.
 */
export function maybeNumber(text: string): number | string {
   return re.numeric.test(text) ? parseFloat(text) : text;
}

/**
 * Simplisitc currency formatting (USD only).
 * @see https://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-dollars-currency-string-in-javascript
 */
export const monetize = (d: number | string, includeDecimals = true) => {
   if (!is.value(d)) {
      return d;
   }

   if (is.text(d)) {
      d = parseNumber(d);
      // let caller decide how to handle NaN
      if (isNaN(d)) {
         return d;
      }
   }
   const re = includeDecimals
      ? /(\d)(?=(\d{3})+\.)/g
      : /(\d)(?=(\d{3})+(,|$))/g;

   return '$' + d.toFixed(includeDecimals ? 2 : 0).replace(re, '$1,');
};
