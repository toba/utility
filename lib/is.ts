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

   /** Whether variable is defined and not null. */
   export function value<T>(x: any): x is T {
      return x !== undefined && x !== null;
   }

   /** Whether named field is defined in the given object. */
   export const defined = <T extends Object>(obj: T, field: string | number) =>
      value<T>(obj) && obj.hasOwnProperty(field.toString()); // typeof(obj[field]) !== type.UNDEFINED;

   /** Whether value is null, undefined or an empty string. */
   export const empty = (x: any) => !value(x) || x === '';

   /** Whether value exists and is a type of number. */
   export function number(n: any): n is number {
      return value(n) && typeof n === Type.Number;
   }

   /** Whether value is numeric even if its type is a string. */
   export function numeric(n: any): n is string | number {
      return integer(n) || /^\d+$/.test(n);
   }

   /** Whether value is an integer. */
   export function integer(n: any): n is string | number {
      return value(n) && parseInt(n as string) === n;
   }

   export const bigInt = (n: any) => integer(n) && (n < -32768 || n > 32767);

   /** Whether value exists and is an array. */
   export function array<T>(x: any): x is T[] {
      return value<T[]>(x) && Array.isArray(x);
   }

   export function date(v: any): v is Date {
      return value(v) && v instanceof Date;
   }

   export function text(v: any): v is string {
      return typeof v === Type.String;
   }

   export function callable(v: any): v is Function {
      return value(v) && typeof v == Type.Functon;
   }
}
