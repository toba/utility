import { printf } from "../index";

test("formats text with substitutions", () => {
   expect(printf("this $1 thing", "one")).toBe("this one thing");
});
