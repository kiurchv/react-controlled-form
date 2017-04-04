import { Map, fromJS } from "immutable";

export function get(name, formValue) {
  const keyPath = name.split(".");
  return formValue.getIn(name.split("."));
}

export function set(name, value, formValue = Map()) {
  if (!name) return formValue;

  const keyPath = name.split(".");
  return formValue.setIn(keyPath, fromJS(value));
}

export { is as isEqual } from "immutable";
