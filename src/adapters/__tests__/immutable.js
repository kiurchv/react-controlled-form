import { Map, fromJS } from "immutable";

import { get, set } from "../immutable";

const formValue = fromJS({
  a: {
    a: "b"
  }
});

describe("get", () => {
  it("should return value by name if present", () => {
    expect(get("a.a", formValue)).toBe("b");
  });

  it("should return undefined if value not found", () => {
    expect(get("b", formValue)).toBeUndefined();
  });
});

describe("set", () => {
  it("should return empty map if no args given", () => {
    expect(set()).toEqual(Map());
  });

  it("should return map with given name and value", () => {
    expect(set("a.a", "b")).toEqual(formValue);
  });

  it("should extend given map with given name and value", () => {
    expect(set("c", "d", formValue)).toEqual(fromJS({ a: { a: "b" }, c: "d" }));
  });
});
