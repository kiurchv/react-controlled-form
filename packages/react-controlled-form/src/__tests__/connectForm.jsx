import React, { Component } from "react";
import { shallow, mount } from "enzyme";
import * as plainAdapter from "react-controlled-form-adapter-plain";
import createBasicValidator from "react-controlled-form-validator-basic";

import connectForm from "../connectForm";

describe("connectForm", () => {
  function Form(props) {
    return <form {...props} />;
  }

  const ConnectedForm = connectForm(
    plainAdapter,
    plainAdapter,
    createBasicValidator
  )(Form);

  const emptyValue = {};
  const emptyOnChange = () => {};

  const validValue = {
    a: "1",
    b: [2, "3"],
    c: [
      { d: "4" },
    ],
    e: "6"
  };

  const invalidValue = {
    a: "",
    b: [1, "2"],
    c: [
      { d: "" }
    ]
  };

  function validatePresence(value) {
    if (!value) return "can't be blank";
  }

  const validations = {
    a: [validatePresence],
    c: {
      d: [validatePresence]
    },
    e: [validatePresence]
  };

  const errors = {
    a: ["can't be blank"],
    c: [
      { d: ["can't be blank"] }
    ],
    e: ["can't be blank"]
  };

  it("should add form object to the child context when value and onChange props set", () => {
    const wrapper = shallow(
      <ConnectedForm value={emptyValue} onChange={emptyOnChange} />
    );

    const formInstance = wrapper.instance();

    expect(formInstance.getChildContext()).toMatchSnapshot();
  });

  it("should not change the child context when value and onChange props missing", () => {
    const wrapper = shallow(
      <ConnectedForm />
    );

    const formInstance = wrapper.instance();

    expect(formInstance.getChildContext()).toBeUndefined();
  });

  it("should pass value getter through the child context", () => {
    const wrapper = shallow(
      <ConnectedForm value={validValue} onChange={emptyOnChange} />
    );

    const formInstance = wrapper.instance();
    const { form } = formInstance.getChildContext();

    expect(form.getValue("a")).toBe(validValue.a);
  });

  it("should pass value setter through the child context", () => {
    const onChange = jest.fn();

    const wrapper = shallow(
      <ConnectedForm value={emptyValue} onChange={onChange} />
    );

    const formInstance = wrapper.instance();
    const { form } = formInstance.getChildContext();

    form.setValue("a", "b");

    expect(onChange).toBeCalledWith({ a: "b" });
  });

  it("should pass errors getter through the child context", () => {
    const wrapper = shallow(
      <ConnectedForm
        value={emptyValue}
        errors={errors}
        onChange={emptyOnChange}
      />
    );

    const formInstance = wrapper.instance();
    const { form } = formInstance.getChildContext();

    expect(form.getErrors("a")).toBe(errors.a);
  });

  it("should validate value", () => {
    const wrapper = shallow(
      <ConnectedForm
        value={invalidValue}
        validations={validations}
        onChange={emptyOnChange}
      />
    );

    const formInstance = wrapper.instance();

    expect(formInstance.validate()).toEqual(errors);
  });

  it("should validate value on change", done => {
    function onError(formErrors) {
      expect(formErrors).toEqual(errors);
      done();
    }

    const wrapper = shallow(
      <ConnectedForm
        value={validValue}
        validations={validations}
        onChange={emptyOnChange}
        onError={onError}
      />
    );

    wrapper.setProps({ value: invalidValue });
  });

  it("should validate value on submit", () => {
    const onError = jest.fn();

    const wrapper = mount(
      <ConnectedForm
        value={invalidValue}
        validations={validations}
        onChange={emptyOnChange}
        onError={onError}
      />
    );

    wrapper.simulate("submit");

    expect(onError).toBeCalledWith(errors);
  });

  it("should handle invalid value submission", () => {
    const onInvalidSubmit = jest.fn();

    const wrapper = mount(
      <ConnectedForm
        value={invalidValue}
        validations={validations}
        onChange={emptyOnChange}
        onInvalidSubmit={onInvalidSubmit}
      />
    );

    wrapper.simulate("submit");

    expect(onInvalidSubmit).toBeCalledWith(errors, invalidValue);
  });

  it("should handle valid value submission", () => {
    const onSubmit = jest.fn();

    const wrapper = mount(
      <ConnectedForm
        value={validValue}
        validations={validations}
        onChange={emptyOnChange}
        onSubmit={onSubmit}
      />
    );

    wrapper.simulate("submit");

    expect(onSubmit).toBeCalledWith(validValue);
  });
});
