import '@toba/test';
import { EventEmitter } from './index';

const emitter = new EventEmitter<MockEvent, string>();
const fn1 = jest.fn();
const fn2 = jest.fn();
const fn3 = jest.fn();

enum MockEvent {
   OneEvent,
   TwoEvent
}

beforeEach(() => {
   emitter.unsubscribeAll();
   fn1.mockClear();
   fn2.mockClear();
   fn3.mockClear();
});

test('add listeners to emitter', () => {
   expect(emitter).toBeDefined();

   // subscription should return listener
   expect(emitter.subscribe(MockEvent.OneEvent, fn1)).toBe(fn1);
   // successful emit should return true
   expect(emitter.emit(MockEvent.OneEvent, 'hi')).toBe(true);

   expect(fn1).toHaveBeenCalledWith('hi');

   emitter.subscribe(MockEvent.OneEvent, fn2);
   emitter.emit(MockEvent.OneEvent, 'hello');

   expect(fn1).toHaveBeenCalledTimes(2);
   expect(fn2).toHaveBeenCalledWith('hello');
});

test('add different listener types', () => {
   expect(fn1).toHaveBeenCalledTimes(0);

   emitter.subscribe(MockEvent.OneEvent, fn1);
   emitter.subscribe(MockEvent.TwoEvent, fn2);

   emitter.emit(MockEvent.OneEvent, 'one');
   expect(fn1).toHaveBeenCalledWith('one');
   expect(fn2).toHaveBeenCalledTimes(0);

   emitter.emit(MockEvent.TwoEvent, 'two');
   expect(fn2).toHaveBeenCalledWith('two');
   expect(fn1).toHaveBeenCalledTimes(1);
});

test('remove listeners from emitter', () => {
   emitter.subscribe(MockEvent.OneEvent, fn1);
   emitter.subscribe(MockEvent.OneEvent, fn2);
   emitter.addEventListener(MockEvent.TwoEvent, fn3);

   emitter.emit(MockEvent.OneEvent, 'first');

   expect(fn2).toHaveBeenCalledTimes(1);
   expect(emitter.unsubscribe(MockEvent.OneEvent, fn2)).toBe(true);
   expect(emitter.removeEventListener(MockEvent.OneEvent, fn3)).toBe(false);

   emitter.emit(MockEvent.OneEvent, 'second');
   expect(fn2).toHaveBeenCalledTimes(1);
});
