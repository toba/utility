import { merge, removeItem } from './utility';

type TestThing = { [key: string]: string | string[] | TestThing };

test('merges objects', () => {
   const base: TestThing = { key1: 'value1', key2: 'value2', key5: [] };
   const add1: TestThing = { key1: null, key3: 'value3' };
   const add2: TestThing = {
      key1: 'newValue1',
      key4: 'value4',
      key5: ['one', 'two']
   };

   expect(merge(base, add1)).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key5: []
   });
   expect(merge(base, add1, add2)).toEqual({
      key1: 'newValue1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
      key5: ['one', 'two']
   });
});

test('merges nested objects', () => {
   const base: TestThing = {
      key1: 'value1',
      key2: 'value2',
      key5: { key10: 'value10', key11: 'value11' }
   };
   const add1: TestThing = { key1: null, key3: 'value3' };
   const add2: TestThing = {
      key1: 'newValue1',
      key4: 'value4',
      key5: { key10: 'new-value10', key12: 'value12' }
   };

   expect(merge(base, add1)).toEqual({
      key1: 'value1',
      key2: 'value2',
      key3: 'value3',
      key5: { key10: 'value10', key11: 'value11' }
   });

   expect(merge(base, add1, add2)).toEqual({
      key1: 'newValue1',
      key2: 'value2',
      key3: 'value3',
      key4: 'value4',
      key5: { key10: 'new-value10', key11: 'value11', key12: 'value12' }
   });
});

test('removes items from arrays', () => {
   const a = () => 1;
   const b = () => 2;
   const c = () => 3;
   const list = [a, b];

   expect(list).toHaveLength(2);
   expect(removeItem(list, a)).toBe(true);
   expect(list).toHaveLength(1);
   expect(removeItem(list, c)).toBe(false);
   expect(list).toHaveLength(1);
});
