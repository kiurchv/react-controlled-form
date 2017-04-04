import { Component, PropTypes, createElement } from "react";
import { wrapDisplayName } from "recompose";
import hoistStatics from "hoist-non-react-statics";

export default function connectInput(
  valueToProps = (value, props) => ({ value }),
  errorsToProps = (errors, props) => ({ errors }),
  eventToValue = ({ target }) => (
    target.type === "checkbox"
    ? target.checked
    : target.value
  )
) {
  return (WrappedComponent) => {
    class ConnectInput extends Component {
      static displayName = wrapDisplayName(WrappedComponent, "ConnectInput")

      static contextTypes = {
        form: PropTypes.object
      }

      render() {
        return createElement(
          WrappedComponent,
          { ...this.props, ...this.getInjectedProps() }
        );
      }

      getInjectedProps() {
        const { form } = this.context;
        const { name } = this.props;

        if (!form || !name) return {};

        const { getValue, getErrors, setValue } = form;

        return {
          ...valueToProps(getValue(name), this.props),
          ...errorsToProps(getErrors(name), this.props),
          onChange(event) {
            const value = eventToValue(event);
            setValue(name, value);
          }
        };
      }
    }

    return hoistStatics(ConnectInput, WrappedComponent);
  }
}
