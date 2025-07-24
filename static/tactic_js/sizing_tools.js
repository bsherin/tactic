"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SizeContext = exports.STATUS_BAR_HEIGHT = exports.SIDE_MARGIN = exports.MENU_BAR_HEIGHT = exports.INIT_CONTEXT_PANEL_WIDTH = exports.ICON_BAR_WIDTH = exports.BOTTOM_MARGIN = void 0;
exports.SizeProvider = SizeProvider;
exports.USUAL_NAVBAR_HEIGHT = exports.TOP_MARGIN = void 0;
exports.getUsableDimensions = getUsableDimensions;
exports.useElementSize = useElementSize;
exports.useSize = useSize;
exports.withSizeContext = withSizeContext;
var _react = _interopRequireWildcard(require("react"));
var _utilities_react = require("./utilities_react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var SIDE_MARGIN = exports.SIDE_MARGIN = 15;
var BOTTOM_MARGIN = exports.BOTTOM_MARGIN = 35;
var STATUS_BAR_HEIGHT = exports.STATUS_BAR_HEIGHT = 35;
var TOP_MARGIN = exports.TOP_MARGIN = 25;
var INITIAL_DECREMENT = 50;
var USUAL_NAVBAR_HEIGHT = exports.USUAL_NAVBAR_HEIGHT = 50;
var INIT_CONTEXT_PANEL_WIDTH = exports.INIT_CONTEXT_PANEL_WIDTH = 250;
var ICON_BAR_WIDTH = exports.ICON_BAR_WIDTH = 40;
var MENU_BAR_HEIGHT = exports.MENU_BAR_HEIGHT = 50;
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
var MIN_HEIGHT = 30;
function useSize() {
  var top_ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var iCounter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
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
      var relativeTop = rect.top - sizeInfo.topY;
      aheight = sizeInfo.availableHeight - relativeTop;
      setTopX(top_ref.current ? rect.left : sizeInfo.topX);
      setTopY(top_ref.current ? rect.top : sizeInfo.topY);
      if (name) {
        console.log("[".concat(name, "] rect.top: ").concat(rect.top, ", sizeInfo.topY: ").concat(sizeInfo.topY, ", usableHeight = ").concat(aheight));
        console.log("[".concat(name, "] rect.left: ").concat(rect.left, ", sizeInfo.topX = ").concat(sizeInfo.topX, " usableWidth = ").concat(awidth));
      }
    } else {
      setTopX(sizeInfo.topX);
      setTopY(sizeInfo.topY);
    }
    set_usable_width(awidth);
    if (aheight > MIN_HEIGHT) {
      set_usable_height(aheight);
    }
    return function () {
      set_usable_width(0);
      set_usable_height(0);
      setTopX(0);
      setTopY(0);
    };
  }, [sizeInfo.availableWidth, sizeInfo.availableHeight, sizeInfo.topX, sizeInfo.topY, selectedPane.selectedTabIdRef.current, iCounter]);
  return [usable_width, usable_height, topX, topY];
}
function withSizeContext(WrappedComponent) {
  function newFunc(props) {
    var _useState9 = (0, _react.useState)(window.innerHeight),
      _useState0 = _slicedToArray(_useState9, 2),
      usable_height = _useState0[0],
      set_usable_height = _useState0[1];
    var _useState1 = (0, _react.useState)(window.innerWidth - ICON_BAR_WIDTH),
      _useState10 = _slicedToArray(_useState1, 2),
      usable_width = _useState10[0],
      set_usable_width = _useState10[1];
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
function useElementSize(ref) {
  var _useState11 = (0, _react.useState)({
      width: 0,
      height: 0,
      top: 0,
      left: 0
    }),
    _useState12 = _slicedToArray(_useState11, 2),
    size = _useState12[0],
    setSize = _useState12[1];
  (0, _react.useEffect)(function () {
    if (!ref.current) return;
    var update = function update() {
      if (ref.current) {
        var rect = ref.current.getBoundingClientRect();
        console.log("ResizeObserver fired:", rect.width);
        setSize({
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left
        });
      }
    };
    var observer = new ResizeObserver(update);
    observer.observe(ref.current);

    // Run once after ref is set
    update();
    return function () {
      if (ref.current) observer.unobserve(ref.current);
      observer.disconnect();
    };
  }, [ref.current]);
  return [size.width, size.height, size.top, size.left];
}