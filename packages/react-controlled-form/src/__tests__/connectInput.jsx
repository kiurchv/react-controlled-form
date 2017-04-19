import React, { Component } from "react";
import { shallow } from "enzyme";

import connectInput from "../connectInput";

describe("connectInput", () => {
  function Input({ value, errors = [], onChange }) {
    const className = errors.length && "error";

    return (
      <input
        value={value}
        onChange={onChange}
        className={className}
      />
    );
  }

  const ConnectedInput = connectInput()(Input);

  const name = "foo";
  const value = "bar";
  const errors = ["has wrong value"];

  const props = {
    name,
    value,
    onChange() {},
    foo: "bar"
  };

  const form = {
    getValue() { return value },
    setValue() {},
    getErrors() { return errors }
  };

  it("should set the displayName correctly", () => {
    expect(ConnectedInput.displayName).toMatchSnapshot();
  });

  it("should expose the wrapped component as WrappedComponent", () => {
    expect(ConnectedInput.WrappedComponent).toBe(Input);
  });

  it("should hoist non-react statics from the wrapped component", () => {
    function Input({ props }) {
      return <input {...props} />;
    }

    Input.foo = "bar";
    Input.fooFn = () => "hi!";

    const ConnectedInput = connectInput()(Input);

    expect(ConnectedInput.foo).toBe(Input.foo);
    expect(ConnectedInput.fooFn).toBe(Input.fooFn);
    expect(ConnectedInput.fooFn()).toBe(Input.fooFn());
  });

  it("should pass given props to the wrapped component", () => {
    const wrapper = shallow(
      <ConnectedInput {...props} />
    );

    const inputProps = wrapper.find(Input).props();

    expect(inputProps).toMatchObject(props);
  });

  it("should prefer injected props over given props", () => {
    const wrapper = shallow(
      <ConnectedInput {...props} />,
      { context: { form } }
    );

    const inputProps = wrapper.find(Input).props();

    expect(inputProps).not.toMatchObject(props);
  });

  it("should not inject props to the wrapped component when the name prop is undefined", () => {
    const props = { foo: "bar" };

    const wrapper = shallow(
      <ConnectedInput {...props} />,
      { context: { form } }
    );

    const inputProps = wrapper.find(Input).props();

    expect(inputProps).toEqual(props);
  });

  it("should not get value and errors from the context when the name prop is undefined", () => {
    const getValue = jest.fn();
    const getErrors = jest.fn();

    const wrapper = shallow(
      <ConnectedInput />,
      { context: { form: { ...form, getValue, getErrors } } }
    );

    expect(getValue).not.toBeCalled();
    expect(getErrors).not.toBeCalled();
  });

  it("should get value from the context", () => {
    const getValue = jest.fn();

    const wrapper = shallow(
      <ConnectedInput name={name} />,
      { context: { form: { ...form, getValue } } }
    );

    expect(getValue).toBeCalledWith(name);
  });

  it("should get errors from the context", () => {
    const getErrors = jest.fn();

    const wrapper = shallow(
      <ConnectedInput name={name} />,
      { context: { form: { ...form, getErrors } } }
    );

    expect(getErrors).toBeCalledWith(name);
  });

  it("should pass value to the context on change", () => {
    const setValue = jest.fn();

    const wrapper = shallow(
      <ConnectedInput name={name} />,
      { context: { form: { ...form, setValue } } }
    );

    const inputInstance = wrapper.find(Input).get(0);

    inputInstance.props.onChange({ target: {} });

    expect(setValue).toBeCalledWith(name, undefined);
  });

  it("should map value to props with the mapValueToProps function", () => {
    let propsFromValue;
    const mapValueToProps = jest.fn(value => {
      propsFromValue = { foo: value };
      return propsFromValue;
    });

    const ConnectedInput = connectInput(
      mapValueToProps
    )(Input);

    const wrapper = shallow(
      <ConnectedInput {...props} />,
      { context: { form } }
    );

    const inputProps = wrapper.find(Input).props();

    expect(mapValueToProps).toBeCalledWith(value, props);
    expect(inputProps).toMatchObject(propsFromValue);
  });

  it("should map errors to props with the mapErrorsToProps function", () => {
    let propsFromErrors;
    const mapErrorsToProps = jest.fn(errors => {
      propsFromErrors = { bar: errors };
      return propsFromErrors;
    });

    const ConnectedInput = connectInput(
      undefined,
      mapErrorsToProps
    )(Input);

    const wrapper = shallow(
      <ConnectedInput {...props} />,
      { context: { form } }
    );

    const inputProps = wrapper.find(Input).props();

    expect(mapErrorsToProps).toBeCalledWith(errors, props);
    expect(inputProps).toMatchObject(propsFromErrors);
  });

  it("should get value from the change event with the getValueFromEvent function", () => {
    let valueFromEvent;
    const getValueFromEvent = jest.fn(event => {
      valueFromEvent = event.foo;
      return valueFromEvent
    });

    const ConnectedInput = connectInput(
      undefined,
      undefined,
      getValueFromEvent
    )(Input);

    const setValue = jest.fn();

    const wrapper = shallow(
      <ConnectedInput name={name} />,
      { context: { form: { ...form, setValue } } }
    );

    const inputInstance = wrapper.find(Input).get(0);

    const event = { foo: "bar" };

    inputInstance.props.onChange(event);

    expect(getValueFromEvent).toBeCalledWith(event);
    expect(setValue).toBeCalledWith(name, valueFromEvent);
  });

  it("should map value to the value prop", () => {
    const wrapper = shallow(
      <ConnectedInput name={name} />,
      { context: { form } }
    );

    const inputWrapper = wrapper.find(Input).at(0);

    expect(inputWrapper.prop("value")).toBe(value);
  });

  it("should map errors to the errors prop", () => {
    const wrapper = shallow(
      <ConnectedInput name={name} />,
      { context: { form } }
    );

    const inputWrapper = wrapper.find(Input).at(0);

    expect(inputWrapper.prop("errors")).toEqual(errors);
  });

  it("should use the value property from the input change event target as value", () => {
    const setValue = jest.fn();

    const wrapper = shallow(
      <ConnectedInput name={name} />,
      { context: { form: { ...form, setValue } } }
    );

    const inputInstance = wrapper.find(Input).get(0);
    const value = "baz";

    inputInstance.props.onChange({ target: { value } });

    expect(setValue).toBeCalledWith(name, value);
  });

  it("should use the checked property from the checkbox change event target as value", () => {
    const setValue = jest.fn();

    const wrapper = shallow(
      <ConnectedInput name={name} />,
      { context: { form: { ...form, setValue } } }
    );

    const inputInstance = wrapper.find(Input).get(0);
    const checked = true;

    inputInstance.props.onChange({ target: { type: "checkbox", checked } });

    expect(setValue).toBeCalledWith(name, checked);
  });
});
