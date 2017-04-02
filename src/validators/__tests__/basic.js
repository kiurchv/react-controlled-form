import * as plainAdapter from "../../adapters/plain";

import createValidator from "../basic";

describe("validator", () => {
  function validatePresence(value) {
    if (!value) return "can't be blank";
  }

  let validator;

  beforeEach(() => {
    validator = createValidator(plainAdapter, plainAdapter);
  });

  it("should validate flat fields", () => {
    const value = {
      a: "",
      b: ""
    };

    const validations = {
      a: [validatePresence],
      b: [validatePresence]
    };

    const errors = {
      a: ["can't be blank"],
      b: ["can't be blank"]
    };

    expect(validator(validations, value)).toEqual(errors);
  });

  it("should validate nested fields", () => {
    const value = {
      c: [
        { d: "", e: "" },
        { d: "", e: "" }
      ],
      f: [
        { g: "" }
      ]
    };

    const validations = {
      c: {
        d: [validatePresence],
        e: [validatePresence]
      },
      f: {
        g: [validatePresence]
      }
    };

    const errors = {
      c: [
        { d: ["can't be blank"], e: ["can't be blank"] },
        { d: ["can't be blank"], e: ["can't be blank"] }
      ],
      f: [
        { g: ["can't be blank"] }
      ]
    };

    expect(validator(validations, value)).toEqual(errors);
  });

  it("should return initial errors when value is valid", () => {
    const validations = {
      a: [validatePresence],
      c: {
        d: [validatePresence]
      }
    };

    const value = {
      a: "1",
      c: [
        { d: "2" }
      ]
    };

    const errors = {};

    expect(validator(validations, value, errors)).toEqual(errors);
  });
});
