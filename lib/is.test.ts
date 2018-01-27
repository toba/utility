import { is } from '../index';

const u: string = undefined;

test('identifies undefined variables', () => {
   expect(is.value(u)).toBe(false);
   expect(is.value(null)).toBe(false);
   expect(is.value('whatever')).toBe(true);
});

test('identifies empty strings', () => {
   expect(is.empty(u)).toBe(true);
   expect(is.empty(' ')).toBe(false);
   expect(is.empty('')).toBe(true);
   expect(is.empty(null)).toBe(true);
});

test('identifies arrays', () => {
   expect(is.array(u)).toBe(false);
   expect(is.array([])).toBe(true);
   expect(is.array(new Array())).toBe(true);
   expect(is.array(null)).toBe(false);
});

test('identifies functions', () => {
   const fn = () => false;
   expect(is.callable(fn)).toBe(true);
   expect(is.callable(u)).toBe(false);
});

test('identifies dates', () => {
   const now = new Date();
   expect(is.date(now)).toBe(true);
   expect(is.date(u)).toBe(false);
});

test('identifies text', () => {
   expect(is.text('hello')).toBe(true);
   expect(is.text(u)).toBe(false);
   expect(is.text(new Date())).toBe(false);
   expect(is.text(() => false)).toBe(false);
});