"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorBoundary = void 0;
var _react = _interopRequireDefault(require("react"));
class ErrorBoundary extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      messagae: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error.message,
      stack: error.stack
    };
  }
  render() {
    if (this.state.hasError) {
      if (!("fallback" in this.props) || this.props.fallback == null) {
        let the_message = `${this.state.message}\n${this.state.stack})`;
        return /*#__PURE__*/_react.default.createElement("div", {
          style: {
            margin: 50
          }
        }, /*#__PURE__*/_react.default.createElement("pre", null, the_message));
      } else {
        if (typeof this.props.fallback == "string") {
          return /*#__PURE__*/_react.default.createElement("pre", null, this.props.fallback);
        }
        return this.props.fallback;
      }
    }
    return this.props.children;
  }
}
exports.ErrorBoundary = ErrorBoundary;