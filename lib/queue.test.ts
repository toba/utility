import '@toba/test';
import { Queue } from './index';
import { lipsum } from '@toba/test';

test('queues several listeners for one operation', async () => {
   const op = jest.fn();
   const key = 'key';
   const queue = new Queue<string, string>(op);

   op.mockReturnValue(
      new Promise(resolve => {
         setTimeout(() => resolve(lipsum), 200);
      })
   );

   const outs = await Promise.all([
      queue.resolve(key),
      queue.resolve(key),
      queue.resolve(key)
   ]);

   expect(outs[0]).toBe(lipsum);
   expect(outs[1]).toBe(lipsum);
   expect(outs[2]).toBe(lipsum);

   expect(op).toHaveBeenCalledTimes(1);
   expect(op).toHaveBeenCalledWith(key);
});

test('manages listeners for several key operations', async () => {
   const op = jest.fn(
      key =>
         new Promise(resolve => {
            setTimeout(() => resolve(key), 200);
         })
   );
   const key1 = 'key1';
   const key2 = 'key2';
   const queue = new Queue<string, string>(op);
   const outs = await Promise.all([
      queue.resolve(key1),
      queue.resolve(key1),
      queue.resolve(key2)
   ]);

   expect(outs[0]).toBe(key1);
   expect(outs[1]).toBe(key1);
   expect(outs[2]).toBe(key2);

   expect(op).toHaveBeenCalledTimes(2);
});
