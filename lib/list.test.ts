import {
   removeItem,
   shuffle,
   addUnique,
   isEqualList,
   listDifference
} from '../index';
import { sayNumber } from '@toba/tools';

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

test('shuffles arrays', () => {
   const list = [];
   for (let i = 0; i < 40; i++) {
      list.push(sayNumber(i));
   }

   expect(shuffle(list)).not.toEqual(list);
   expect(shuffle(null)).toBeNull();
});

test('uniquely adds array items', () => {
   const list = ['one', 'two', 'three'];

   expect(addUnique(list, 'one')).toBe(0);
   expect(list).toHaveLength(3);

   expect(addUnique(list, 'four')).toBe(1);
   expect(list).toHaveLength(4);

   expect(addUnique(list, 'four', 'five', 'six')).toBe(2);
   expect(list).toHaveLength(6);
});

test('compares arrays', () => {
   const list1 = ['one', 'two', 'three'];

   expect(isEqualList(list1, ['one', 'three', 'two'])).toBe(true);
   expect(isEqualList(list1, ['one', 'three'])).toBe(false);
   expect(isEqualList(list1, null)).toBe(false);
   expect(isEqualList(list1, ['one', 'three', 'two', 'four'])).toBe(false);
});

test('shows array differences', () => {
   const list1 = ['one', 'two', 'three'];

   expect(listDifference(list1, ['one', 'three', 'two'])).toEqual([]);
   expect(listDifference(list1, ['one', 'three'])).toEqual(['two']);
   expect(listDifference(list1, null)).toEqual(list1);
   expect(listDifference(list1, ['one', 'three', 'two', 'four'])).toEqual([
      'four'
   ]);
   expect(listDifference(list1, ['four', 'five', 'six'])).toEqual([
      'one',
      'two',
      'three',
      'four',
      'five',
      'six'
   ]);
});
