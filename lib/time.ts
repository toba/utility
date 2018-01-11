import { leadingZeros } from "./number";
import { month } from "./constants";

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
 * Convert decimal hours to hours:minutes
 */
export function hoursAndMinutes(hours: number): string {
   const h = Math.floor(hours);
   const m = hours - h;

   return h + ":" + leadingZeros(Math.round(60 * m), 2);
}

/**
 * Whether daylight savings applies to date
 *
 * http://javascript.about.com/library/bldst.htm
 */
export function inDaylightSavings(date = new Date()): boolean {
   const jan = new Date(date.getFullYear(), 0, 1);
   const jul = new Date(date.getFullYear(), 6, 1);
   const nonDstOffset = Math.max(
      jan.getTimezoneOffset(),
      jul.getTimezoneOffset()
   );

   return date.getTimezoneOffset() < nonDstOffset;
}

export const timeString = (d: Date) => {
   let h = d.getHours();
   let a = " AM";
   if (h > 12) {
      a = " PM";
      h -= 12;
   }
   return h + ":" + d.getMinutes() + a;
};

/**
 * Return AM or PM
 */
export const hourOfDay = (h: number) => (h > 12 ? "PM " + (h - 12) : "AM " + h);

/**
 * Format date as Month Day, Year (March 15, 1973)
 */
export const toDateString = (d: Date) =>
   month[d.getMonth()] + " " + d.getDate() + ", " + d.getFullYear();
