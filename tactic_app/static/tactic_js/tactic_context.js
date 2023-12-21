"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TacticContext = void 0;
var _react = _interopRequireDefault(require("react"));
const TacticContext = exports.TacticContext = /*#__PURE__*/_react.default.createContext({
  readOnly: false,
  tsocket: null,
  dark_theme: false,
  setTheme: () => {},
  am_controlled: false,
  am_selected: true
});