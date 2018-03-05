import { Cache, CachePolicy, EvictionListener } from '../index';

const cache = new Cache<string>();

beforeEach(() => {
   cache.clear();
});

test('add item to cache', () => {
   cache.add('key', 'value');
   expect(cache.get('key')).toBe('value');
});

test('report cache size', () => {
   expect(cache.size).toBe(0);

   for (let i = 1; i <= 20; i++) {
      cache.add('key' + i, 'value' + i);
   }
   expect(cache.size).toBe(20);
});

test('remove item from cache', () => {
   cache.add('remove', 'value');
   expect(cache.get('remove')).toBe('value');

   cache.remove('remove');
   expect(cache.get('remove')).toBe(null);

   // removing non-existent item should cause no error
   cache.remove('fake');
});

test('add and remove eviction listeners', () => {
   const listener: EvictionListener = (keys: string[]) => {};
   cache.onEvict(listener);
   expect(cache.removeEvictionListener(listener)).toBe(true);
});

test('eviction notification', () => {
   // cache pruning runs on a timer
   jest.useFakeTimers();

   const listener = jest.fn();
   cache.updatePolicy({ maxItems: 2 }, listener);

   cache.add('key1', 'value1');
   cache.add('key2', 'value2');
   expect(listener).toHaveBeenCalledTimes(0);

   cache.add('key3', 'value3');

   jest.runAllTimers();

   expect(listener).toHaveBeenCalledTimes(1);
   expect(listener).toHaveBeenCalledWith(['key1']);

   cache.add('key4', 'value4');
   cache.add('key5', 'value5');

   jest.runAllTimers();

   expect(listener).toHaveBeenCalledTimes(2);
   expect(listener).toHaveBeenCalledWith(['key2', 'key3']);
});
