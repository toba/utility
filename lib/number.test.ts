import '@toba/test';
import {
   sayNumber,
   leadingZeros,
   parseNumber,
   maybeNumber,
   monetize
} from './index';

test('adds leading zeros to reach total digit length', () => {
   expect(leadingZeros(2, 0)).toBe('2');
   expect(leadingZeros(2, 1)).toBe('2');
   expect(leadingZeros(2, 2)).toBe('02');
   expect(leadingZeros(99, 2)).toBe('99');
});

test('converts number to words for number', () => {
   expect(sayNumber(3)).toBe('Three');
   expect(sayNumber(4, false)).toBe('four');
   expect(sayNumber(-14)).toBe('-14');
   expect(sayNumber(20)).toBe('Twenty');
   expect(sayNumber(21)).toBe('21');
});

test('extracts numbers from strings', () => {
   expect(parseNumber('hey 34')).toBe(34);
   expect(parseNumber('wow 28.9')).toBe(28.9);
   expect(parseNumber('nothing')).toBeNaN();
   expect(parseNumber('nothing', 0)).toBe(0);
});

test('converts eligible strings to numbers', () => {
   expect(maybeNumber('3.5')).toBe(3.5);
   expect(maybeNumber('3.5')).not.toBe('3.5');
   expect(maybeNumber('-3.25')).toBe(-3.25);
   expect(maybeNumber('563')).toBe(563);
   expect(maybeNumber('asdfds')).toBe('asdfds');
});

test('formats numbers as currency', () => {
   expect(monetize(1000)).toBe('$1,000.00');
   expect(monetize(2000, false)).toBe('$2,000');
   expect(monetize('3000')).toBe('$3,000.00');
   expect(monetize(123456.22)).toBe('$123,456.22');
   expect(monetize(1234567.234)).toBe('$1,234,567.23');
   expect(monetize('no numbers')).toBe(NaN);
});
