import '@toba/test';
import { median, boundary, round } from './index';
import { numberLiteralTypeAnnotation } from '@babel/types';

test('rounds to given precision', () => {
   const n = 12.234567;
   [12, 12.2, 12.23, 12.235, 12.2346, 12.23457, 12.234567].forEach(
      (a: number, i: number) => {
         expect(round(n, i)).toBe(a);
      }
   );

   expect(round(n, 20)).toBe(n);
});

test('calculates median', () => {
   expect(median(1, 2, 3)).toBe(2);
   expect(median(3)).toBe(3);
   expect(median(4, 5, 6, 7)).toBe(5.5);
});

test('calculates Tukey fence boundaries', () => {
   expect(boundary([1, 2, 3, 9, 27, 36, 22])).toEqual({ min: -65.5, max: 92 });
});
