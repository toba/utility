import '@toba/test';
import { is } from './index';

const u: string | undefined = undefined;

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

test('identifies objects that are not arrays', () => {
   //expect(is.hash(null)).toBe(false);
   expect(is.hash([])).toBe(false);
   expect(is.hash(new Uint8Array([1, 2, 3, 4]))).toBe(false);
   expect(is.hash({ key: 'value' })).toBe(true);
   expect(is.hash({ key: { nested: 'value' } })).toBe(true);
   expect(is.hash({})).toBe(true);
   expect(is.hash({}, false)).toBe(false);
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

test('identifies objects', () => {
   //expect(is.object(null)).toBe(false);
   expect(is.object('nope')).toBe(false);
   expect(is.object(23)).toBe(false);
   expect(is.object({})).toBe(true);
   expect(is.object(new Date())).toBe(true);
   expect(is.object([])).toBe(true);
   expect(is.object(() => {})).toBe(false);
   // strict check is only true for plain objects
   expect(is.object(new Date(), true)).toBe(false);
   expect(is.object([], true)).toBe(false);
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
   //expect(is.defined(thing, 'second')).toBe(false);
   //expect(is.defined(thing, Type.Two)).toBe(true);
   //expect(is.defined(u, Type.Two)).toBe(false);
});

test('verifies member types', () => {
   const thing = {
      first: 2,
      2: 4
   };

   expect(is.defined(thing, 'first', is.number)).toBe(true);
   expect(is.defined(thing, 'first', is.date)).toBe(false);
});

test('identifies booleans', () => {
   expect(is.boolean(3)).toBe(false);
   expect(is.boolean(new Date())).toBe(false);
   expect(is.boolean(true)).toBe(true);
   expect(is.boolean(false)).toBe(true);
});

test('identifies promises', () => {
   expect(is.promise(2)).toBe(false);
   expect(is.promise(new Date())).toBe(false);
   expect(is.promise(Promise.resolve(2))).toBe(true);
});
