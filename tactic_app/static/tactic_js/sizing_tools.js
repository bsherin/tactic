"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SizeContext = exports.SIDE_MARGIN = exports.INIT_CONTEXT_PANEL_WIDTH = exports.ICON_BAR_WIDTH = exports.BOTTOM_MARGIN = void 0;
exports.SizeProvider = SizeProvider;
exports.USUAL_NAVBAR_HEIGHT = exports.TOP_MARGIN = void 0;
exports.getUsableDimensions = getUsableDimensions;
exports.useSize = useSize;
exports.withSizeContext = withSizeContext;
var _react = _interopRequireWildcard(require("react"));
var _utilities_react = require("./utilities_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var SIDE_MARGIN = exports.SIDE_MARGIN = 15;
var BOTTOM_MARGIN = exports.BOTTOM_MARGIN = 35;
var TOP_MARGIN = exports.TOP_MARGIN = 25;
var INITIAL_DECREMENT = 50;
var USUAL_NAVBAR_HEIGHT = exports.USUAL_NAVBAR_HEIGHT = 50;
var INIT_CONTEXT_PANEL_WIDTH = exports.INIT_CONTEXT_PANEL_WIDTH = 150;
var ICON_BAR_WIDTH = exports.ICON_BAR_WIDTH = 40;
function getUsableDimensions() {
  return {
    usable_width: window.innerWidth - 2 * SIDE_MARGIN,
    usable_height: window.innerHeight - BOTTOM_MARGIN - USUAL_NAVBAR_HEIGHT,
    usable_height_no_bottom: window.innerHeight - USUAL_NAVBAR_HEIGHT,
    body_height: window.innerHeight - BOTTOM_MARGIN
  };
}
var SizeContext = exports.SizeContext = /*#__PURE__*/_react["default"].createContext({
  topX: 0,
  topY: 0,
  availableWidth: 500,
  availableHeight: 500
});
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
    var _useState11 = (0, _react.useState)(window.innerWidth - ICON_BAR_WIDTH),
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
      set_usable_width(window.innerWidth - ICON_BAR_WIDTH);
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