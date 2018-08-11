import '@toba/test';
import { retry } from './index';

const success = 'success';
const e1 = 'error 1';
const e2 = 'error 2';
const errors = e1 + '\n' + e2;

test('retries async function until success', () => {
   const failTwice = jest
      .fn(() => Promise.resolve(success))
      .mockImplementationOnce(() => Promise.reject(e1))
      .mockImplementationOnce(() => Promise.reject(e2));

   expect.assertions(2);

   return retry(failTwice, 5, 10).then(res => {
      expect(res).toBe(success);
      expect(failTwice).toHaveBeenCalledTimes(3);
   });
});

test('fails if max tries exceeded', () => {
   const prefix = 'Here is some context';
   const failTwice = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(e1))
      .mockImplementationOnce(() => Promise.reject(e2));

   expect.assertions(2);

   return retry(failTwice, 2, 10, prefix).catch(err => {
      expect(err).toEqual(prefix + ':\n' + errors);
      expect(failTwice).toHaveBeenCalledTimes(2);
   });
});

test('fails if bad arguments supplied', () => {
   const neverCalled = jest.fn(() => Promise.resolve());

   return retry(neverCalled, -2, 10).catch(err => {
      expect(err).toBe(`Invalid retry times (-2) or delay (10)`);
      expect(neverCalled).toHaveBeenCalledTimes(0);
   });
});
