import '@toba/test';
import { Queue, sayNumber } from './index';
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
      queue.process(key),
      queue.process(key),
      queue.process(key)
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
      queue.process(key1),
      queue.process(key1),
      queue.process(key2)
   ]);

   expect(outs[0]).toBe(key1);
   expect(outs[1]).toBe(key1);
   expect(outs[2]).toBe(key2);

   expect(op).toHaveBeenCalledTimes(2);
});

test('supports queue chaining', async () => {
   const key = 'key';
   const op1 = jest.fn(
      _key =>
         new Promise(resolve => {
            setTimeout(() => resolve(9), 100);
         })
   );
   const op2 = jest.fn(
      number =>
         new Promise(resolve => {
            setTimeout(() => resolve(sayNumber(number)), 100);
         })
   );
   const queue1 = new Queue<string, number>(op1);
   const queue2 = new Queue<number, string>(op2);
   // mixture of waiting for first and second queues
   const out = await Promise.all([
      queue1.process(key),
      queue1.pipe(key).to(queue2)
   ]);

   expect(out[0]).toBe(9);
   expect(out[1]).toBe('Nine');
   expect(queue1.has(key)).toBe(false);
   expect(queue2.has(key)).toBe(false);

   // each operation should only be called once for the single key
   expect(op1).toHaveBeenCalledTimes(1);
   expect(op2).toHaveBeenCalledTimes(1);
});
