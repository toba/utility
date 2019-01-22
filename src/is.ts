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
 * Identity checks.
 */
export namespace is {
   /**
    * EcmaScript type names.
    */
   export enum Type {
      Boolean = 'boolean',
      Function = 'function',
      Number = 'number',
      Object = 'object',
      String = 'string',
      Symbol = 'symbol',
      Undefined = 'undefined'
   }

   /**
    * Whether variable is defined and not null.
    */
   export const value = <T>(x: any): x is T => x !== undefined && x !== null;

   /**
    * Whether named field is defined in the given object.
    * @param checker Method to execute against field value
    */
   export const defined = <T extends Object, K extends keyof T>(
      obj: T | null | undefined,
      field: K,
      checker: (v: any) => boolean = v => true
   ) => value<T>(obj) && obj.hasOwnProperty(field) && checker(obj[field]); // typeof(obj[field]) !== type.UNDEFINED;

   /**
    * Whether value is null, undefined or an empty string.
    */
   export const empty = (x: any): x is null | undefined =>
      !value(x) || x === '';

   /**
    * Whether value exists and is a type of number.
    */
   export const number = (n: any): n is number =>
      value(n) && typeof n === Type.Number;

   /**
    * Whether value is numeric even if its type is a string.
    */
   export const numeric = (n: any): n is string | number =>
      integer(n) || /^\d+$/.test(n);

   /**
    * Whether value is an integer.
    */
   export const integer = (n: any): n is string | number =>
      value(n) && parseInt(n as string) === n;

   export const bigInt = (n: any): n is number =>
      integer(n) && (n < -32768 || n > 32767);

   /**
    * Whether value exists and is an array. This will return `false` for
    * `TypedArrays` such as `Uint8Array`. For those use `is.typedArray()`.
    * @param withLength Optionally require array be a certain size
    */
   export function array<T>(x: any, withLength = 0): x is T[] {
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
   export function typedArray<T extends TypedArray>(
      x: any,
      withByteLength = 0
   ): x is T {
      if (is.value(x) && ArrayBuffer.isView(x)) {
         return withByteLength == 0 || x.byteLength == withByteLength;
      }
      return false;
   }

   /**
    * Whether value exists and is an object with keys and values, not any of the
    * array variants.
    * @param allowEmpty If `false` then objects without keys will be `false`
    */
   export function hash<T>(v: any, allowEmpty = true): v is T {
      return (
         is.value(v) &&
         typeof v === is.Type.Object &&
         !(Array.isArray(v) || ArrayBuffer.isView(v)) &&
         (allowEmpty || Object.keys(v).length > 0)
      );
   }

   /**
    * Whether value is an object.
    * @param strict Whether to preclude arrays and subclasses (only allow plain objects)
    */
   export const object = <T>(v: any, strict = false): v is T =>
      is.value(v) &&
      typeof v === is.Type.Object &&
      (!strict || (!array(v) && v.constructor.name === 'Object'));

   /**
    * Whether value exists and is an object with keys and values, not any of the
    * array variants. An alias for `is.hash()`.
    */
   export const dictionary = hash;

   /**
    * Whether value is a date.
    */
   export const date = (v: any): v is Date => value(v) && v instanceof Date;

   /**
    * Whether value is text.
    */
   export const text = (v: any): v is string => typeof v === Type.String;

   /**
    * Whether value is a function.
    */
   export const callable = (v: any): v is Function =>
      value(v) && typeof v == Type.Function;

   /**
    * Whether value is an asynchronous function.
    */
   export const async = (v: any): v is Function =>
      is.callable(v) && v.constructor.name === 'AsyncFunction';

   /**
    * Whether value is a boolean.
    */
   export const boolean = (v: any): v is boolean =>
      value(v) && typeof v == Type.Boolean;

   /**
    * Whether object is a promise.
    */
   export const promise = <T>(v: any): v is Promise<T> =>
      is.value<any>(v) && is.callable(v.then);
}
