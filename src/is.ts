import { ValueType } from './constants';

type TypedArray =
   | Int8Array
   | Uint8Array
   | Uint8ClampedArray
   | Int16Array
   | Uint16Array
   | Int32Array
   | Uint32Array
   | Float32Array
   | Float64Array;

/**
 * Whether variable is defined and not null.
 */
const value = <T>(x: any): x is T => x !== undefined && x !== null;

/**
 * Whether named field is defined in the given object.
 * @param checker Method to execute against field value
 */
const defined = <T extends object, K extends keyof T>(
   obj: T | null | undefined,
   field: K,
   checker: (v: any) => boolean = v => true
) => value<T>(obj) && obj.hasOwnProperty(field) && checker(obj[field]); // typeof(obj[field]) !== type.UNDEFINED;

/**
 * Whether value is null, undefined or an empty string.
 */
const empty = (x: any): x is null | undefined => !value(x) || x === '';

/**
 * Whether value exists and is a type of number.
 */
const number = (n: any): n is number =>
   value(n) && typeof n === ValueType.Number;

/**
 * Whether value is an integer.
 */
const integer = (n: any): n is string | number =>
   value(n) && parseInt(n as string) === n;

/**
 * Whether value is numeric even if its type is a string.
 */
const numeric = (n: any): n is string | number => integer(n) || /^\d+$/.test(n);

const bigInt = (n: any): n is number => integer(n) && (n < -32768 || n > 32767);

/**
 * Whether value exists and is an array. This will return `false` for
 * `TypedArrays` such as `Uint8Array`. For those use `is.typedArray()`.
 * @param withLength Optionally require array be a certain size
 */
function array<T>(x: any, withLength = 0): x is T[] {
   if (value<T[]>(x) && Array.isArray(x)) {
      return withLength == 0 || x.length == withLength;
   }
   return false;
}

/**
 * Whether value exists and is a `TypedArray`. This will return `false` for
 * untyped arrays such as `[]`. For those use `is.array()`.
 * @param withByteLength Optionally require array have a specific byte count
 */
function typedArray<T extends TypedArray>(x: any, withByteLength = 0): x is T {
   if (value(x) && ArrayBuffer.isView(x)) {
      return withByteLength == 0 || x.byteLength == withByteLength;
   }
   return false;
}

/**
 * Whether value exists and is an object with keys and values, not any of the
 * array variants.
 * @param allowEmpty If `false` then objects without keys will be `false`
 */
function hash<T extends object>(v: object, allowEmpty = true): v is T {
   return (
      value(v) &&
      typeof v === ValueType.Object &&
      !(Array.isArray(v) || ArrayBuffer.isView(v)) &&
      (allowEmpty || Object.keys(v).length > 0)
   );
}

/**
 * Whether value is an object.
 * @param strict Whether to preclude arrays and subclasses (only allow plain objects)
 */
const object = <T extends object>(
   v: object | string | number,
   strict = false
): v is T =>
   value(v) &&
   typeof v === ValueType.Object &&
   (!strict || (!array(v) && v.constructor.name === 'Object'));

/**
 * Whether value is a date.
 */
const date = (v: any): v is Date => value(v) && v instanceof Date;

/**
 * Whether value is text.
 */
const text = (v: any): v is string => typeof v === ValueType.String;

/**
 * Whether value is a function.
 */
const callable = (v: any): v is Function =>
   value(v) && typeof v == ValueType.Function;

/**
 * Whether value is an asynchronous function.
 */
const async = (v: any): v is Function =>
   callable(v) && v.constructor.name === 'AsyncFunction';

/**
 * Whether value is a boolean.
 */
const boolean = (v: any): v is boolean =>
   value(v) && typeof v == ValueType.Boolean;

/**
 * Whether object is a promise.
 */
const promise = <T>(v: any): v is Promise<T> =>
   value<any>(v) && callable(v.then);

/**
 * Identity checks.
 */
export const is = {
   array,
   async,
   boolean,
   callable,
   date,
   defined,
   /**
    * Whether value exists and is an object with keys and values, not any of the
    * array variants. An alias for `is.hash()`.
    */
   dictionary: hash,
   empty,
   hash,
   number,
   numeric,
   object,
   promise,
   text,
   typedArray,
   value
};
