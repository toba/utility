import { is } from '../';

/**
 * Middle value or average of the two middle values among a list of numbers.
 * @param values Sorted numbers
 */
export const median = (...values: number[]) => {
   const half = Math.floor(values.length / 2);
   return values.length % 2 !== 0
      ? values[half]
      : (values[half - 1] + values[half]) / 2.0;
};

export interface Limits {
   min: number;
   max: number;
}

/**
 * Calculate Tukey fence values for a range of numbers. Values outside the
 * range are considered outliers.
 *
 * @param distance Constant used to calculate fence. Tukey proposed `1.5` for an
 * "outlier" and `3` for "far out". This method defaults to `3` if no value is
 * given.
 *
 * @see http://sphweb.bumc.bu.edu/otlt/MPH-Modules/BS/BS704_SummarizingData/BS704_SummarizingData7.html
 */
export const boundary = (values: number[], distance: number = 3): Limits => {
   if (!is.array(values) || values.length === 0) {
      return null;
   }

   // sort lowest to highest
   values.sort((d1, d2) => d1 - d2);

   const half = Math.floor(values.length / 2);
   /** first quartile */
   const q1 = median(...values.slice(0, half));
   /** third quartile */
   const q3 = median(...values.slice(half));
   /** interquartile range: range of the middle 50% of the data */
   const range = q3 - q1;

   return {
      min: (q1 - range * distance) as number,
      max: (q3 + range * distance) as number
   };
};
