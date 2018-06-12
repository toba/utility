import '@toba/test';
import { retry } from './index';

const success = 'success';
const errors = ['error 1', 'error 2'];

test('retries async function until success', () => {
   const failTwice = jest
      .fn(() => Promise.resolve(success))
      .mockImplementationOnce(() => Promise.reject(errors[0]))
      .mockImplementationOnce(() => Promise.reject(errors[1]));

   expect.assertions(2);

   return retry(failTwice, 5, 10).then(res => {
      expect(res).toBe(success);
      expect(failTwice).toHaveBeenCalledTimes(3);
   });
});

test('fails if max tries exceeded', () => {
   const failTwice = jest
      .fn()
      .mockImplementationOnce(() => Promise.reject(errors[0]))
      .mockImplementationOnce(() => Promise.reject(errors[1]));

   expect.assertions(2);

   return retry(failTwice, 2, 10).catch(err => {
      expect(err).toEqual(errors);
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
