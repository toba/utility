import { is } from './is';

const alwaysLower = [
   'a',
   'at',
   'how',
   'have',
   'in',
   'not',
   'of',
   'on',
   'the',
   'to',
   'when',
   'who'
];
const alwaysUpper = ['blm', 'fs', 'i'];

/**
 * Replace numerical, bracketed placeholders with arbitrary arguments. The same
 * value can be substituted in more than one position. Example:
 *
 *    format('I like {0}, {1} and {0}', 'chocolate', 'peanut butter');
 *
 * Note the logger uses `printf` syntax instead.
 */
export function format(
   text: string,
   ...insertions: (string | number)[]
): string {
   for (let i = 0; i < insertions.length; i++) {
      text = text.replace('{' + i + '}', insertions[i] as string);
   }
   return text;
}

/**
 * Replace dollar-sign variables with substitutions.
 */
export function printf(text: string, ...insertions: any[]): string {
   return insertions.reduce(
      (out, insert, i) => out.replace('$' + (i + 1), insert),
      text
   );
}

export const capitalize = (text: string) =>
   is.empty(text)
      ? ''
      : text.substr(0, 1).toUpperCase() + text.substr(1).toLowerCase();

/**
 * Capitalize individual words.
 */
export const titleCase = (text: string) =>
   is.empty(text)
      ? ''
      : text
           // only lowercase actual words, not addresses with numbers
           .replace(
              /(^|\s)([a-zA-z]+('[a-zA-Z]{1,2})?)(\b|$)/g,
              (_match, before, word, _apostrophe, _after, _index) => {
                 return before + word.toLocaleLowerCase();
              }
           )
           .replace(/\b[a-z]+('[a-z]{1,2})?/g, (match, _apostrophe, index) => {
              let word = match;
              if (alwaysUpper.indexOf(word) >= 0) {
                 word = word.toLocaleUpperCase();
              } else if (index == 0 || alwaysLower.indexOf(word) == -1) {
                 word = word.substr(0, 1).toUpperCase() + word.substr(1);
              }
              return word;
           })
           // lone trailing letter is probably a label
           .replace(/\b[a-z]$/, match => match.toLocaleUpperCase());

/**
 * http://stackoverflow.com/questions/617647/where-is-my-one-line-implementation-of-rot13-in-javascript-going-wrong
 */
export const rot13 = (text: string) =>
   is.empty(text)
      ? null
      : text.replace(/[a-zA-Z]/g, chr => {
           const start = chr <= 'Z' ? 65 : 97;
           return String.fromCharCode(
              start + (chr.charCodeAt(0) - start + 13) % 26
           );
        });

/**
 * Make URL slug.
 */
export const slug = (text: string) =>
   is.empty(text)
      ? null
      : text
           .toLowerCase()
           .replace(/[\s\/-]+/g, '-')
           .replace('à', 'a')
           .replace(/[^\-a-z0-9]/g, '');

export const wrapText = (
   text: string,
   lineLength = 80,
   lineBreak = '\n'
): string => {
   let length = 0;

   return is.empty(text) ||
      lineLength < 2 ||
      is.empty(lineBreak) ||
      text.length <= lineLength
      ? text
      : text.split(/\s+/).reduce((lines, word) => {
           // add one for the removed space
           const l = word.length + 1;
           if (length + l > lineLength) {
              lines += lineBreak;
              length = 0;
           } else if (length > 0) {
              lines += ' ';
           }
           length += l;
           return lines + word;
        }, '');
};
