/* tslint:disable:no-unused-expression */
import { expect } from "@toba/test";
import { is, merge, format } from "./utility";

type TestThing = { [key: string]: string | string[] | TestThing };

// https://journal.artfuldev.com/write-tests-for-typescript-projects-with-mocha-and-chai-in-typescript-86e053bdb2b6
describe("Utilities", () => {
   describe("Identity Checks", () => {
      const u: string = undefined;

      it("identifies undefined variables", () => {
         expect(is.value(u)).is.false;
         expect(is.value(null)).is.false;
         expect(is.value("whatever")).is.true;
      });
      it("identifies empty strings", () => {
         expect(is.empty(u)).is.true;
         expect(is.empty(" ")).is.false;
         expect(is.empty("")).is.true;
         expect(is.empty(null)).is.true;
      });
      it("identifies arrays", () => {
         expect(is.array(u)).is.false;
         expect(is.array([])).is.true;
         expect(is.array(new Array())).is.true;
         expect(is.array(null)).is.false;
      });
   });

   it("merges objects", () => {
      const base: TestThing = { key1: "value1", key2: "value2", key5: [] };
      const add1: TestThing = { key1: null, key3: "value3" };
      const add2: TestThing = { key1: "newValue1", key4: "value4", key5: ["one", "two"] };

      expect(merge(base, add1)).to.deep.equal({
         key1: "value1",
         key2: "value2",
         key3: "value3",
         key5: []
      });
      expect(merge(base, add1, add2)).to.deep.equal({
         key1: "newValue1",
         key2: "value2",
         key3: "value3",
         key4: "value4",
         key5: ["one", "two"]
      });
   });

   it("merges nested objects", () => {
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

      expect(merge(base, add1)).to.deep.equal({
         key1: "value1",
         key2: "value2",
         key3: "value3",
         key5: { key10: "value10", key11: "value11" }
      });
      expect(merge(base, add1, add2)).to.deep.equal({
         key1: "newValue1",
         key2: "value2",
         key3: "value3",
         key4: "value4",
         key5: { key10: "new-value10", key11: "value11", key12: "value12" }
      });
   });

   it("formats text with substitutions", () => {
      expect(format("this $1 thing", "one")).equals("this one thing");
   });
});
