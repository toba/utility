import { session } from '../index';

/**
 * Jest testing uses `jest-localstorage-mock`.
 *
 * https://github.com/clarkbw/jest-localstorage-mock
 */
test('Save numbers', () => {
   session.save('test-key', 99);
   expect(sessionStorage.setItem).toHaveBeenLastCalledWith('test-key', '99');
   expect(sessionStorage.__STORE__['test-key']).toBe('99');
});
