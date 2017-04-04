import { Component, PropTypes, createElement } from "react";
import { wrapDisplayName } from "recompose";
import { debounce } from "lodash";
import hoistStatics from "hoist-non-react-statics";

const DEFAULT_OPTIONS = {
  validateOnChange: true,
  validationDelay: 250,
  injectSubmitHandler: true
};

export default function connectForm(
  valueAdapter,
  errorAdapter,
  createValidator,
  options
) {
  options = { ...DEFAULT_OPTIONS, ...options };

  return (WrappedComponent) => {
    class ConnectForm extends Component {
      static displayName = wrapDisplayName(WrappedComponent, "ConnectForm")

      static childContextTypes = {
        form: PropTypes.object
      }

      static defaultProps = {
        errors: {},
        validations: {},
        onError: () => {},
        onInvalidSubmit: () => {},
        onSubmit: () => {}
      }

      constructor(props) {
        super(props);

        this.valueAdapter = typeof valueAdapter === "function"
          ? valueAdapter(props)
          : valueAdapter;

        this.errorAdapter = typeof errorAdapter === "function"
          ? errorAdapter(props)
          : errorAdapter;

        this.validator = createValidator(this.valueAdapter, this.errorAdapter);

        this.debouncedValidate = debounce(
          this.validate,
          options.validationDelay
        );

        this.onSubmit = this.onSubmit.bind(this);
      }

      getChildContext() {
        const { value, errors, onChange } = this.props;

        if (!value || !onChange) return;

        return {
          form: {
            getValue: (name) => this.valueAdapter.get(name, value),
            getErrors: (name) => this.errorAdapter.get(name, errors),
            setValue: (name, value) => onChange(
              this.valueAdapter.set(name, value)
            )
          }
        };
      }

      componentWillReceiveProps({ value }) {
        if (
          options.validateOnChange &&
          !this.valueAdapter.isEqual(this.props.value, value)
        ) {
          this.debouncedValidate(value);
        }
      }

      render() {
        const {
          value,
          errors,
          validations,
          onChange,
          onError,
          onInvalidSubmit,
          onSubmit,
          ...props
        } = this.props;

        return createElement(
          WrappedComponent,
          { ...props, ...this.getInjectedProps() }
        );
      }

      getInjectedProps() {
        const { value, onChange } = this.props;
        const { onSubmit } = this;

        return (
          value && onChange && options.injectSubmitHandler
          ? { onSubmit }
          : {}
        );
      }

      onSubmit(event) {
        event.preventDefault();

        const { value, onSubmit, onInvalidSubmit } = this.props;

        const errors = this.validate();

        if (
          this.errorAdapter.isEqual(this.errorAdapter.set(), errors)
        ) {
          onSubmit(value);
        } else {
          onInvalidSubmit(errors, value);
        }
      }

      validate(value = this.props.value) {
        const { validations, onError } = this.props;

        const errors = this.validator(validations, value);

        onError(errors);
        return errors;
      }
    }

    return hoistStatics(ConnectForm, WrappedComponent);
  }
}
