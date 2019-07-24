import { leadingZeros, month, is } from './index';
/**
 * Milliseconds per units of time.
 */
export const enum Duration {
   Millisecond = 1,
   /** Milliseconds in a second */
   Second = 1000,
   /** Milliseconds in a minute */
   Minute = 60000,
   /** Milliseconds in an hour */
   Hour = 3600000, //Minute * 60,
   /** Milliseconds in a day */
   Day = 86400000, //Hour * 24,
   /** Milliseconds in a week */
   Week = 604800000, //Day * 7,
   /** Milliseconds in a year */
   Year = 220752000000, //Day * 365,
   /** Average milliseconds per quarter */
   Quarter = 55188000000, //Duration.Year / 4,
   /** Average milliseconds per month */
   Month = 220752000000 //Duration.Year / 12
}

/**
 * Abbreviations for units of time.
 */
export const enum TimeUnit {
   Second = 's',
   Minute = 'm',
   Hour = 'h',
   Day = 'd',
   Month = 'M',
   Quarter = 'q',
   Year = 'y'
}

const unitDuration: { [index: string]: number } = {
   [TimeUnit.Second]: Duration.Second,
   [TimeUnit.Minute]: Duration.Minute,
   [TimeUnit.Hour]: Duration.Hour,
   [TimeUnit.Day]: Duration.Day,
   [TimeUnit.Year]: Duration.Year
};

/**
 * Convert decimal hours to hours:minutes
 */
export function hoursAndMinutes(hours: number): string {
   const h = Math.floor(hours);
   const m = hours - h;

   return h + ':' + leadingZeros(Math.round(60 * m), 2);
}

/**
 * Whether daylight savings applies to date. If no date given then response
 * applies to current date.
 *
 * @see http://javascript.about.com/library/bldst.htm
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

/**
 * Format time portion of date as h:mm AM/PM
 */
export const timeString = (d: Date) => {
   let h = d.getHours();
   let a = ' AM';
   if (h >= 12) {
      a = ' PM';
      if (h > 12) {
         h -= 12;
      }
   } else if (h == 0) {
      h = 12;
   }
   return h + ':' + leadingZeros(d.getMinutes(), 2) + a;
};

export function durationString(ms: number, roundTo?: TimeUnit): string;
export function durationString(
   start: Date,
   end: Date,
   roundTo?: TimeUnit
): string;

/**
 * Duration in typical project format:
 *    y=year
 *    d=day
 *    h=hour
 *    m=minute
 *    s=second
 *
 * Examples:
 *    4 hours 10 minutes -> 4h10m
 *    1 day, 6 hours -> 1d6h
 */
export function durationString(
   startOrMs: number | Date,
   endOrRoundTo?: TimeUnit | Date,
   roundTo?: TimeUnit
): string {
   if (is.number(startOrMs)) {
      return durationStringFromNumber(startOrMs, endOrRoundTo as TimeUnit);
   } else if (is.date(endOrRoundTo)) {
      return durationStringFromDates(startOrMs, endOrRoundTo, roundTo);
   } else {
      return '';
   }
}

const durationStringFromNumber = (
   ms: number,
   roundTo: TimeUnit | null = null
) => {
   let d = '';

   const units = [
      TimeUnit.Year,
      TimeUnit.Day,
      TimeUnit.Hour,
      TimeUnit.Minute,
      TimeUnit.Second
   ];
   const add = (unit: number, letter: TimeUnit) => {
      if (ms >= unit) {
         const c = Math.floor(ms / unit);
         d += c + letter;
         ms -= c * unit;
      }
   };

   ms = Math.abs(ms);

   for (let i = 0; i < units.length; i++) {
      const u = units[i];
      add(unitDuration[u], u);
      if (roundTo === u) {
         return d;
      }
   }

   return d;
};

const durationStringFromDates = (start: Date, end: Date, roundTo?: TimeUnit) =>
   is.empty(start) || is.empty(end)
      ? ''
      : durationStringFromNumber(end.getTime() - start.getTime(), roundTo);

/**
 * Milliseconds for duration string.
 */
export const parseDuration = (d: string): number => {
   if (is.empty(d)) {
      return 0;
   }
   const matches = d.match(/\d+[ydmhs]/g);
   if (matches === null) {
      return 0;
   }

   return matches.reduce((total, m) => {
      const u = m.slice(-1);
      const n = parseInt(m.replace(u, ''));
      return total + n * unitDuration[u];
   }, 0);
};

/**
 * Format date as Month Day, Year (March 15, 1973)
 */
export const dateString = (d: Date) =>
   month[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
