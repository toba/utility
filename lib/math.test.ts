import '@toba/test';
import { median, boundary } from './';

test('calculates median', () => {
   expect(median(1, 2, 3)).toBe(2);
   expect(median(3)).toBe(3);
   expect(median(4, 5, 6, 7)).toBe(5.5);
});

test('calculates Tukey fence boundaries', () => {
   expect(boundary([1, 2, 3, 9, 27, 36, 22])).toEqual({ min: -65.5, max: 92 });
});
