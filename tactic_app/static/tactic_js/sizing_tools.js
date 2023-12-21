"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.USUAL_TOOLBAR_HEIGHT = exports.TOP_MARGIN = exports.SizeContext = exports.SIDE_MARGIN = exports.BOTTOM_MARGIN = void 0;
exports.getUsableDimensions = getUsableDimensions;
var _react = _interopRequireDefault(require("react"));
const SIDE_MARGIN = exports.SIDE_MARGIN = 15;
const BOTTOM_MARGIN = exports.BOTTOM_MARGIN = 35;
const TOP_MARGIN = exports.TOP_MARGIN = 25;
const INITIAL_DECREMENT = 50;
const USUAL_TOOLBAR_HEIGHT = exports.USUAL_TOOLBAR_HEIGHT = 50;
function getUsableDimensions() {
  return {
    "usable_width": window.innerWidth - 2 * SIDE_MARGIN,
    "usable_height": window.innerHeight - BOTTOM_MARGIN - USUAL_TOOLBAR_HEIGHT,
    usable_height_no_bottom: window.innerHeight - USUAL_TOOLBAR_HEIGHT,
    body_height: window.innerHeight - BOTTOM_MARGIN
  };
}
const SizeContext = exports.SizeContext = /*#__PURE__*/_react.default.createContext({
  available_height: 500,
  available_width: 500
});