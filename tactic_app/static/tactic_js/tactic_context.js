"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TacticContext = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var TacticContext = /*#__PURE__*/_react["default"].createContext({
  readOnly: false,
  tsocket: null,
  dark_theme: false,
  setTheme: function setTheme() {},
  am_controlled: false,
  am_selected: true
});

exports.TacticContext = TacticContext;