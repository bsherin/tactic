"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.KeyTrap = KeyTrap;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _mousetrap = _interopRequireDefault(require("mousetrap"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function KeyTrap(props) {
  const mousetrap = (0, _react.useRef)(null);
  (0, _react.useEffect)(() => {
    _initializeMousetrap();
    return () => {
      if (mousetrap.current) {
        mousetrap.current.reset();
        mousetrap.current = null;
      }
    };
  }, []);
  (0, _react.useEffect)(() => {
    if (!mousetrap.current) {
      _initializeMousetrap();
    }
  });
  function _initializeMousetrap() {
    if (mousetrap.current) {
      mousetrap.current.reset();
    }
    if (!props.target_ref && !props.global) {
      mousetrap.current = null;
    } else {
      if (props.global) {
        mousetrap.current = new _mousetrap.default();
      } else {
        mousetrap.current = new _mousetrap.default(props.target_ref);
      }
      for (let binding of props.bindings) {
        mousetrap.current.bind(binding[0], e => {
          if (props.active) {
            binding[1](e);
          }
        });
      }
    }
  }
  return /*#__PURE__*/_react.default.createElement("div", null);
}
KeyTrap.propTypes = {
  active: _propTypes.default.bool,
  target_ref: _propTypes.default.object,
  bindings: _propTypes.default.array,
  global: _propTypes.default.bool
};
KeyTrap.defaultProps = {
  active: true,
  global: false
};
exports.KeyTrap = KeyTrap = /*#__PURE__*/(0, _react.memo)(KeyTrap);