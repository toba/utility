import { is, merge, format, removeItem } from "./utility";

type TestThing = { [key: string]: string | string[] | TestThing };
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

test("merges objects", () => {
   const base: TestThing = { key1: "value1", key2: "value2", key5: [] };
   const add1: TestThing = { key1: null, key3: "value3" };
   const add2: TestThing = {
      key1: "newValue1",
      key4: "value4",
      key5: ["one", "two"]
   };

   expect(merge(base, add1)).toEqual({
      key1: "value1",
      key2: "value2",
      key3: "value3",
      key5: []
   });
   expect(merge(base, add1, add2)).toEqual({
      key1: "newValue1",
      key2: "value2",
      key3: "value3",
      key4: "value4",
      key5: ["one", "two"]
   });
});

test("merges nested objects", () => {
   const base: TestThing = {
      key1: "value1",
      key2: "value2",
      key5: { key10: "value10", key11: "value11" }
   };
   const add1: TestThing = { key1: null, key3: "value3" };
   const add2: TestThing = {
      key1: "newValue1",
      key4: "value4",
      key5: { key10: "new-value10", key12: "value12" }
   };

   expect(merge(base, add1)).toEqual({
      key1: "value1",
      key2: "value2",
      key3: "value3",
      key5: { key10: "value10", key11: "value11" }
   });

   expect(merge(base, add1, add2)).toEqual({
      key1: "newValue1",
      key2: "value2",
      key3: "value3",
      key4: "value4",
      key5: { key10: "new-value10", key11: "value11", key12: "value12" }
   });
});

test("removes items from arrays", () => {
   const a = () => 1;
   const b = () => 2;
   const c = () => 3;
   const list = [a, b];

   expect(list).toHaveLength(2);

   removeItem(list, a);

   expect(list).toHaveLength(1);

   removeItem(list, c);

   expect(list).toHaveLength(1);
});

test("formats text with substitutions", () => {
   expect(format("this $1 thing", "one")).toBe("this one thing");
});
