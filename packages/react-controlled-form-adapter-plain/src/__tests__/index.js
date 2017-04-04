import { get, set } from "../index";

const formValue = { a: "b" };

describe("get", () => {
  it("should return value by name if present", () => {
    expect(get("a", formValue)).toBe("b");
  });

  it("should return undefined if value not found", () => {
    expect(get("b", formValue)).toBeUndefined();
  });
});

describe("set", () => {
  it("should return empty object if no args given", () => {
    expect(set()).toEqual({});
  });

  it("should return object with given name and value", () => {
    expect(set("a", "b")).toEqual(formValue);
  });

  it("should extend given object with given name and value", () => {
    expect(set("c", "d", formValue)).toEqual({ a: "b", c: "d" });
  });
});
