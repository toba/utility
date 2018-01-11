import {
   hoursAndMinutes,
   hourOfDay,
   timeString,
   toDateString,
   inDaylightSavings
} from "../index";

test("display date as MMM d, YYYY", () => {
   // month value is zero-based
   expect(toDateString(new Date(1973, 2, 15))).toBe("March 15, 1973");
});

test("shows AM or PM for hour of day", () => {
   expect(hourOfDay(2)).toBe("AM 2");
   expect(hourOfDay(14)).toBe("PM 2");
});

test("creates time string", () => {
   expect(timeString(new Date(2000, 1, 1, 5, 12))).toBe("5:12 AM");
   expect(timeString(new Date(2000, 1, 1, 13, 12))).toBe("1:12 PM");
});

test("shows hours:minutes for fractional hour", () => {
   expect(hoursAndMinutes(5.5)).toBe("5:30");
});

test("detects if Daylight Savings Time is active", () => {
   expect(inDaylightSavings(new Date(2010, 1, 1))).toBe(false);
   // Can't detect true case when test runs in locale that doesn't have DST
   //expect(util.date.inDaylightSavings(new Date(2010, 8, 1))).is.true;
});
