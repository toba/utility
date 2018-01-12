import { printf, wrapText } from "../index";

const longText =
   "Meeting Melissa after work, our recruiter sent your resume to her tech headhunter connection.";

test("formats text with substitutions", () => {
   expect(printf("this $1 thing", "one")).toBe("this one thing");
});

test("wraps text", () => {
   expect(wrapText("this thing", -2)).toBe("this thing");
   expect(wrapText("this thing", 5)).toBe("this\nthing");
   expect(wrapText("this thing", 5, null)).toBe("this thing");
   expect(wrapText("this thing", 5, "<br/>")).toBe("this<br/>thing");
   expect(wrapText("this thing")).toBe("this thing");
   expect(wrapText(longText, 40, "<br/>")).toBe(
      "Meeting Melissa after work, our<br/>recruiter sent your resume to her tech<br/>headhunter connection."
   );
});
