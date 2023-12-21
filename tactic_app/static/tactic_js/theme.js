"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThemeContext = void 0;
exports.withTheme = withTheme;
var _react = _interopRequireWildcard(require("react"));
var _utilities_react = require("./utilities_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const ThemeContext = exports.ThemeContext = /*#__PURE__*/(0, _react.createContext)(null);
function withTheme(WrappedComponent) {
  function newFunc(props) {
    const [dark_theme, set_dark_theme] = (0, _react.useState)(() => {
      return props.initial_theme === "dark";
    });
    const pushCallback = (0, _utilities_react.useCallbackStack)();
    function setTheme(local_dark_theme) {
      set_dark_theme(local_dark_theme);
    }
    const ChildElement = props.wrapped_element;
    return /*#__PURE__*/_react.default.createElement(ThemeContext.Provider, {
      value: {
        dark_theme,
        setTheme
      }
    }, /*#__PURE__*/_react.default.createElement(WrappedComponent, props));
  }
  return /*#__PURE__*/(0, _react.memo)(newFunc);
}