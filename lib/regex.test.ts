import { re } from "../index";

const text = `some
text on more
than

one line`;

test("matches line breaks", () => {
   expect(text.replace(re.lineBreak, "-")).toBe(
      "some-text on more-than--one line"
   );
});

test("identifies numbers", () => {
   expect(re.numeric.test("1.3")).toBe(true);
   expect(re.numeric.test((-26.36).toString())).toBe(true);
   expect(re.numeric.test(".1.3")).toBe(false);
   expect(re.numeric.test("1.3654654654")).toBe(true);
   expect(re.numeric.test("1555553")).toBe(true);
});
