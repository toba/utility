import { url } from "../index";

test("extracts query string variables", () => {
   let qs = url.variables("http://path.com/?var1=value1");
   expect(qs["var1"]).toBe("value1");

   qs = url.variables("http://path.com/?var1=value1&var2=value2");
   expect(qs["var2"]).toBe("value2");

   qs = url.variables(
      "file:///D:/dev/src/github.com/toba/timeline/index.html?key=23"
   );
   expect(qs["key"]).toBe("23");
});

test("handles URLs without querystring values", () => {
   let qs = url.variables(null);
   expect(qs).toEqual({});

   qs = url.variables("http://path.com");
   expect(qs).toEqual({});
});