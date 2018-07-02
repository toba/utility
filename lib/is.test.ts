import '@toba/test';
import { is } from './index';

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
   expect(is.array(new Uint8Array([1, 2, 3, 4]))).toBe(false);
   expect(is.array(new Uint16Array([1, 2, 3, 4]))).toBe(false);
});

test('identifies typed array', () => {
   expect(is.typedArray(u)).toBe(false);
   expect(is.typedArray([])).toBe(false);
   expect(is.typedArray(null)).toBe(false);
   expect(is.typedArray(new Uint8Array([1, 2, 3, 4]))).toBe(true);
   expect(is.typedArray(new Uint16Array([1, 2, 3, 4]))).toBe(true);
});

test('identifies arrays with required length', () => {
   expect(is.array([], 1)).toBe(false);
   expect(is.array(['one'], 1)).toBe(true);
   expect(is.array(['one', 'two', 'three'], 3)).toBe(true);
});

test('identifies functions', () => {
   const fn = () => false;
   expect(is.callable(fn)).toBe(true);
   expect(is.callable(u)).toBe(false);

   const mockFn = jest.fn();
   expect(is.callable(mockFn)).toBe(true);
});

test('identifies async functions', () => {
   const fn = () => false;
   expect(is.async(fn)).toBe(false);
   const fn2 = async () => false;
   expect(is.async(fn2)).toBe(true);
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

test('identifies members', () => {
   const thing = {
      first: 2,
      2: 4
   };

   enum Type {
      Zero,
      One,
      Two
   }

   expect(is.defined(thing, 'first')).toBe(true);
   expect(is.defined(thing, 2)).toBe(true);
   expect(is.defined(thing, 'second')).toBe(false);
   expect(is.defined(thing, Type.Two)).toBe(true);
   expect(is.defined(u, Type.Two)).toBe(false);
});
