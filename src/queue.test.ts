import '@toba/test';
import { Queue, sayNumber, QueueEvent } from './index';
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
   const op = jest.fn<Promise<string>, any[]>(
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
   const op1 = jest.fn<Promise<number>, string[]>(
      _key =>
         new Promise(resolve => {
            setTimeout(() => resolve(9), 100);
         })
   );
   const op2 = jest.fn<Promise<string>, number[]>(
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

test('emits operation events', async () => {
   const key = 'whatever';
   const value = 'nothing';
   const onStart = jest.fn();
   const onEnd = jest.fn();
   const op = jest.fn<Promise<string>, any[]>(
      () =>
         new Promise(resolve => {
            setTimeout(() => resolve(value), 100);
         })
   );

   const queue = new Queue<string, string>(op);
   queue.events.subscribe(QueueEvent.OperationStart, onStart);
   queue.events.subscribe(QueueEvent.OperationEnd, onEnd);

   const out = await queue.process(key);
   expect(out).toBe(value);
   expect(onStart).toHaveBeenCalledTimes(1);
   expect(onEnd).toHaveBeenCalledTimes(1);
   expect(onStart).toHaveBeenCalledWith(key);
   expect(onEnd).toHaveBeenCalledWith(key);
});

test('cancels listeners if operation has errors', async () => {
   const op = jest.fn();
   const key = 'key';
   const oops = 'error';
   const queue = new Queue<string, string>(op);
   let out: string[] = [];
   let e: Error | undefined = undefined;

   op.mockReturnValue(
      new Promise((_resolve, reject) => {
         setTimeout(() => reject(oops), 200);
      })
   );

   try {
      out = await Promise.all([
         queue.process(key),
         queue.process(key),
         queue.process(key)
      ]);
   } catch (err) {
      e = err;
   }

   expect(out).toHaveLength(0);
   expect(e).toBe(oops);
   expect(op).toHaveBeenCalledTimes(1);
   expect(op).toHaveBeenCalledWith(key);
});
