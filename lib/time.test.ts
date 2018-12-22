import '@toba/test';
import {
   Duration,
   TimeUnit,
   hoursAndMinutes,
   timeString,
   dateString,
   parseDuration,
   durationString,
   inDaylightSavings
} from './index';

test('display date as MMM d, YYYY', () => {
   // month value is zero-based
   expect(dateString(new Date(1973, 2, 15))).toBe('March 15, 1973');
});

test('creates time string', () => {
   expect(timeString(new Date(2000, 1, 1, 5, 12))).toBe('5:12 AM');
   expect(timeString(new Date(2000, 1, 1, 13, 12))).toBe('1:12 PM');
   expect(timeString(new Date(2000, 1, 1, 13, 7))).toBe('1:07 PM');
   expect(timeString(new Date(2000, 1, 1, 12, 1))).toBe('12:01 PM');
   expect(timeString(new Date(2000, 1, 1, 0, 23))).toBe('12:23 AM');
});

test('shows hours:minutes for fractional hour', () => {
   expect(hoursAndMinutes(5.5)).toBe('5:30');
});

test('builds duration string from milliseconds', () => {
   expect(durationString(Duration.Day)).toBe('1d');
   expect(durationString(Duration.Day * -1)).toBe('1d');
   expect(durationString(Duration.Day + Duration.Hour * 4)).toBe('1d4h');
   expect(durationString(Duration.Hour * 2 + Duration.Minute * 20)).toBe(
      '2h20m'
   );
   // rounding
   expect(
      durationString(Duration.Hour * 2 + Duration.Minute * 20, TimeUnit.Hour)
   ).toBe('2h');
   expect(
      durationString(
         Duration.Hour * 4 + Duration.Minute * 20 + Duration.Second * 45,
         TimeUnit.Minute
      )
   ).toBe('4h20m');
});

test('builds duration string from date range', () => {
   expect(durationString(new Date(2017, 1, 1), new Date(2017, 1, 2))).toBe(
      '1d'
   );
   expect(
      durationString(new Date(2017, 1, 1, 2, 30), new Date(2017, 1, 2, 4))
   ).toBe('1d1h30m');
});

test('parse duration string', () => {
   expect(parseDuration('12')).toBe(0);
   expect(parseDuration('2' + TimeUnit.Hour)).toBe(2 * Duration.Hour);
   expect(parseDuration('4' + TimeUnit.Day + '2' + TimeUnit.Hour)).toBe(
      4 * Duration.Day + 2 * Duration.Hour
   );
});

test('detects if Daylight Savings Time is active', () => {
   expect(inDaylightSavings(new Date(2010, 1, 1))).toBe(false);
   // Can't detect true case when test runs in locale that doesn't have DST
   //expect(util.date.inDaylightSavings(new Date(2010, 8, 1))).is.true;
});
