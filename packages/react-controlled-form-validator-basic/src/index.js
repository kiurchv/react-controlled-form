import "core-js";

export default function createValidator(valueAdapter, errorAdapter) {
  function validator(formValidations, formValue) {
    return Object.entries(formValidations).reduce(
      (formErrors, [name, validations]) => {
        const value = valueAdapter.get(name, formValue);

        const validate = Array.isArray(validations)
          ? fieldValidator
          : groupValidator;

        const errors = validate(validations, value);

        return (
          errors
          ? errorAdapter.set(name, errors, formErrors)
          : formErrors
        );
      },
      errorAdapter.set()
    );
  }

  function fieldValidator(validations, value) {
    const errors = validations
      .map(validation => validation(value))
      .filter(Boolean);

    if (errors.length) return errors;
  }

  function groupValidator(validations, group = []) {
    const groupErrors = group.map(value => {
      const errors = validator(validations, value);

      if (!errorAdapter.isEqual(errorAdapter.set(), errors)) return errors;
    });

    if (groupErrors.some(Boolean)) return groupErrors;
  }

  return validator;
}
