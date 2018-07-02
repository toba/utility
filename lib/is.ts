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
   export function value<T>(x: any): x is T {
      return x !== undefined && x !== null;
   }

   /**
    * Whether named field is defined in the given object.
    */
   export const defined = <T extends Object, K extends keyof T>(
      obj: T,
      field: K
   ) => value<T>(obj) && obj.hasOwnProperty(field); // typeof(obj[field]) !== type.UNDEFINED;

   /**
    * Whether value is null, undefined or an empty string.
    */
   export const empty = (x: any) => !value(x) || x === '';

   /**
    * Whether value exists and is a type of number.
    */
   export function number(n: any): n is number {
      return value(n) && typeof n === Type.Number;
   }

   /**
    * Whether value is numeric even if its type is a string.
    */
   export function numeric(n: any): n is string | number {
      return integer(n) || /^\d+$/.test(n);
   }

   /**
    * Whether value is an integer.
    */
   export function integer(n: any): n is string | number {
      return value(n) && parseInt(n as string) === n;
   }

   export const bigInt = (n: any) => integer(n) && (n < -32768 || n > 32767);

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
    * Whether value is a date.
    */
   export function date(v: any): v is Date {
      return value(v) && v instanceof Date;
   }

   /**
    * Whether value is text.
    */
   export function text(v: any): v is string {
      return typeof v === Type.String;
   }

   /**
    * Whether value is a function.
    */
   export function callable(v: any): v is Function {
      return value(v) && typeof v == Type.Function;
   }

   /**
    * Whether value is an asynchronous function.
    */
   export function async(v: any): v is Function {
      return is.callable(v) && v.constructor.name === 'AsyncFunction';
   }
}
