import { is } from "./is";

const u: string = undefined;

test("identifies undefined variables", () => {
   expect(is.value(u)).toBe(false);
   expect(is.value(null)).toBe(false);
   expect(is.value("whatever")).toBe(true);
});

test("identifies empty strings", () => {
   expect(is.empty(u)).toBe(true);
   expect(is.empty(" ")).toBe(false);
   expect(is.empty("")).toBe(true);
   expect(is.empty(null)).toBe(true);
});

test("identifies arrays", () => {
   expect(is.array(u)).toBe(false);
   expect(is.array([])).toBe(true);
   expect(is.array(new Array())).toBe(true);
   expect(is.array(null)).toBe(false);
});
