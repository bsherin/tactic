"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SizeContext = exports.SIDE_MARGIN = exports.INIT_CONTEXT_PANEL_WIDTH = exports.BOTTOM_MARGIN = void 0;
exports.SizeProvider = SizeProvider;
exports.USUAL_NAVBAR_HEIGHT = exports.TOP_MARGIN = void 0;
exports.getUsableDimensions = getUsableDimensions;
exports.useSize = useSize;
exports.withSizeContext = withSizeContext;
var _react = _interopRequireWildcard(require("react"));
var _utilities_react = require("./utilities_react");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var SIDE_MARGIN = 15;
exports.SIDE_MARGIN = SIDE_MARGIN;
var BOTTOM_MARGIN = 35;
exports.BOTTOM_MARGIN = BOTTOM_MARGIN;
var TOP_MARGIN = 25;
exports.TOP_MARGIN = TOP_MARGIN;
var INITIAL_DECREMENT = 50;
var USUAL_NAVBAR_HEIGHT = 50;
exports.USUAL_NAVBAR_HEIGHT = USUAL_NAVBAR_HEIGHT;
var INIT_CONTEXT_PANEL_WIDTH = 150;
exports.INIT_CONTEXT_PANEL_WIDTH = INIT_CONTEXT_PANEL_WIDTH;
function getUsableDimensions() {
  return {
    usable_width: window.innerWidth - 2 * SIDE_MARGIN,
    usable_height: window.innerHeight - BOTTOM_MARGIN - USUAL_NAVBAR_HEIGHT,
    usable_height_no_bottom: window.innerHeight - USUAL_NAVBAR_HEIGHT,
    body_height: window.innerHeight - BOTTOM_MARGIN
  };
}
var SizeContext = /*#__PURE__*/_react["default"].createContext({
  topX: 0,
  topY: 0,
  availableWidth: 500,
  availableHeight: 500
});
exports.SizeContext = SizeContext;
function useSize() {
  var top_ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var iCounter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "noname";
  var _useState = (0, _react.useState)(window.innerWidth),
    _useState2 = _slicedToArray(_useState, 2),
    usable_width = _useState2[0],
    set_usable_width = _useState2[1];
  var _useState3 = (0, _react.useState)(window.innerHeight),
    _useState4 = _slicedToArray(_useState3, 2),
    usable_height = _useState4[0],
    set_usable_height = _useState4[1];
  var _useState5 = (0, _react.useState)(0),
    _useState6 = _slicedToArray(_useState5, 2),
    topX = _useState6[0],
    setTopX = _useState6[1];
  var _useState7 = (0, _react.useState)(0),
    _useState8 = _slicedToArray(_useState7, 2),
    topY = _useState8[0],
    setTopY = _useState8[1];
  var sizeInfo = (0, _react.useContext)(SizeContext);
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  (0, _react.useEffect)(function () {
    var awidth = sizeInfo.availableWidth;
    var aheight = sizeInfo.availableHeight;
    if (top_ref && top_ref.current) {
      var rect = top_ref.current.getBoundingClientRect();
      awidth = awidth - rect.left + sizeInfo.topX;
      aheight = aheight - rect.top + sizeInfo.topY;
      setTopX(top_ref.current ? rect.left : sizeInfo.topX);
      setTopY(top_ref.current ? rect.top : sizeInfo.topY);
    } else {
      setTopX(sizeInfo.topX);
      setTopY(sizeInfo.topY);
    }
    set_usable_width(awidth);
    set_usable_height(aheight);
  }, [sizeInfo.availableWidth, sizeInfo.availableHeight, top_ref.current, selectedPane.selectedTabIdRef.current, iCounter]);
  return [usable_width, usable_height, topX, topY];
}
function withSizeContext(WrappedComponent) {
  function newFunc(props) {
    var _useState9 = (0, _react.useState)(window.innerHeight),
      _useState10 = _slicedToArray(_useState9, 2),
      usable_height = _useState10[0],
      set_usable_height = _useState10[1];
    var _useState11 = (0, _react.useState)(window.innerWidth),
      _useState12 = _slicedToArray(_useState11, 2),
      usable_width = _useState12[0],
      set_usable_width = _useState12[1];
    (0, _react.useEffect)(function () {
      window.addEventListener("resize", _handleResize);
      _handleResize();
      return function () {
        window.removeEventListener('resize', _handleResize);
      };
    }, []);
    function _handleResize() {
      set_usable_width(window.innerWidth);
      set_usable_height(window.innerHeight);
    }
    return /*#__PURE__*/_react["default"].createElement(SizeContext.Provider, {
      value: {
        availableWidth: usable_width,
        availableHeight: usable_height,
        topX: 0,
        topY: 0
      }
    }, /*#__PURE__*/_react["default"].createElement(WrappedComponent, props));
  }
  return /*#__PURE__*/(0, _react.memo)(newFunc);
}
function SizeProvider(_ref) {
  var value = _ref.value,
    children = _ref.children;
  var newValue = (0, _react.useMemo)(function () {
    return _objectSpread({}, value);
  }, [value.availableWidth, value.availableHeight, value.topX, value.topY]);
  return /*#__PURE__*/_react["default"].createElement(SizeContext.Provider, {
    value: newValue
  }, children);
}
exports.SizeProvider = SizeProvider = /*#__PURE__*/(0, _react.memo)(SizeProvider);