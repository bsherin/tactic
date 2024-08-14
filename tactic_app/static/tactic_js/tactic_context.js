"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TacticContext = void 0;
var _react = _interopRequireDefault(require("react"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var TacticContext = exports.TacticContext = /*#__PURE__*/_react["default"].createContext({
  readOnly: false,
  tsocket: null,
  setTheme: function setTheme() {},
  am_controlled: false,
  am_selected: true
});