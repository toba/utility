/**
 * Identity checks.
 */
export namespace is {
   /**
    * EcmaScript type names.
    */
   export const type = {
      BOOLEAN: "boolean",
      FUNCTION: "function",
      NUMBER: "number",
      OBJECT: "object",
      STRING: "string",
      SYMBOL: "symbol",
      UNDEFINED: "undefined"
   };

   /** Whether variable is defined and not null. */
   export function value<T>(x: any): x is T {
      return x !== undefined && x !== null;
   }

   /** Whether named field is defined in the given object. */
   export const defined = (obj: any, field: string | number) =>
      value(obj) && obj.hasOwnProperty(field.toString()); // typeof(obj[field]) !== type.UNDEFINED;

   /** Whether value is null, undefined or an empty string. */
   export const empty = (x: any) => !value(x) || x === "";

   /** Whether value exists and is a type of number. */
   export function number(n: any): n is number {
      return value(n) && typeof n === type.NUMBER;
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
   export function array(x: any): x is any[] {
      return value(x) && Array.isArray(x);
   }
}

/**
 * Milliseconds per units of time.
 */
export enum Time {
   /** Milliseconds in a second */
   Second = 1000,
   /** Milliseconds in a minute */
   Minute = Second * 60,
   /** Milliseconds in an hour */
   Hour = Minute * 60,
   /** Milliseconds in a day */
   Day = Hour * 24,
   /** Milliseconds in a week */
   Week = Day * 7,
   /** Milliseconds in a year */
   Year = Day * 365
}

/**
 * Merge additions into a base object, only replacing base values if the
 * additions are not null or undefined. Arrays will not be merged but will be
 * treated as values meaning additions supersede the base.
 */
export function merge<T extends object>(base: T, ...additions: any[]): T {
   return additions.reduce(
      (existing, add: { [key: string]: any }) => {
         //for (const key of Reflect.ownKeys(add)) {
         for (const key of Object.keys(add)) {
            const v: any = add[key];
            const exists = is.defined(existing, key);
            if (is.value(v) || !exists) {
               // only replace base value if addition is non-null
               if (Array.isArray(v) || typeof v != is.type.OBJECT) {
                  existing[key] = v;
               } else {
                  existing[key] = merge(existing[key], v);
               }
            }
         }
         return existing;
      },
      Object.assign({}, base) as any
   );
}

/**
 * Replace dollar-sign variables with substitutions.
 */
export function format(text: string, ...insertions: any[]): string {
   return insertions.reduce(
      (out, insert, i) => out.replace("$" + (i + 1), insert),
      text
   );
}

/**
 * Remove item from an array.
 */
export function removeItem<T>(list: T[], item: T) {
   const i = list.indexOf(item);
   if (i >= 0) {
      list.splice(i, 1);
   }
}

/**
 * Coordinates for a mouse click or a touch depending on the event.
 */
export function eventCoord(
   e: MouseEvent | TouchEvent
): { x: number; y: number } {
   if (e) {
      if (e instanceof TouchEvent) {
         if (e.changedTouches && e.changedTouches.length > 0) {
            const touch = e.changedTouches[0];
            return { x: touch.clientX, y: touch.clientY };
         }
      } else if (e.pageX !== undefined) {
         return { x: e.pageX, y: e.pageY };
      }
   }
   return { x: 0, y: 0 };
}

/**
 * Combine parameters into a comma-delimited list.
 */
export function list(...items: (number | string)[]) {
   return items.join(", ");
}

/**
 * Generate random letter/number sequence.
 */
export function randomID(size: number = 7) {
   const chars = [];
   const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
   const length = possible.length;

   for (let i = 0; i < size; i++) {
      chars.push(possible.charAt(Math.floor(Math.random() * length)));
   }
   return chars.join("");
}
