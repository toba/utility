import { session } from "./storage";

test("Save numbers", () => {
   session.save("test-key", 99);
   expect(sessionStorage.setItem).toHaveBeenLastCalledWith("test-key", "99");
   expect(sessionStorage.__STORE__["test-key"]).toBe("99");
   //expect(session.item("test-key")).toBe(99);
});
