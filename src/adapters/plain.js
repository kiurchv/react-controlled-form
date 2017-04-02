export function get(name, formValue) {
  return formValue[name];
}

export function set(name, value, formValue = {}) {
  return Object.assign(
    formValue,
    name
    ? { [name]: value }
    : undefined
  );
}

export { isEqual } from "lodash";
