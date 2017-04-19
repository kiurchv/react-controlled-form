import { Component, PropTypes, createElement } from "react";
import { wrapDisplayName } from "recompose";
import hoistStatics from "hoist-non-react-statics";

export default function connectInput(
  mapValueToProps = (value, props) => ({ value }),
  mapErrorsToProps = (errors, props) => ({ errors }),
  getValueFromEvent = ({ target }) => (
    target.type === "checkbox"
    ? target.checked
    : target.value
  )
) {
  return (WrappedComponent) => {
    class ConnectInput extends Component {
      static displayName = wrapDisplayName(WrappedComponent, "ConnectInput");

      static WrappedComponent = WrappedComponent;

      static contextTypes = {
        form: PropTypes.object
      };

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
          ...mapValueToProps(getValue(name), this.props),
          ...mapErrorsToProps(getErrors(name), this.props),
          onChange(event) {
            const value = getValueFromEvent(event);
            setValue(name, value);
          }
        };
      }
    }

    return hoistStatics(ConnectInput, WrappedComponent);
  }
}
