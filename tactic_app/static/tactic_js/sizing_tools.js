"use strict";

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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const SIDE_MARGIN = exports.SIDE_MARGIN = 15;
const BOTTOM_MARGIN = exports.BOTTOM_MARGIN = 35;
const TOP_MARGIN = exports.TOP_MARGIN = 25;
const INITIAL_DECREMENT = 50;
const USUAL_NAVBAR_HEIGHT = exports.USUAL_NAVBAR_HEIGHT = 50;
const INIT_CONTEXT_PANEL_WIDTH = exports.INIT_CONTEXT_PANEL_WIDTH = 150;
function getUsableDimensions() {
  return {
    usable_width: window.innerWidth - 2 * SIDE_MARGIN,
    usable_height: window.innerHeight - BOTTOM_MARGIN - USUAL_NAVBAR_HEIGHT,
    usable_height_no_bottom: window.innerHeight - USUAL_NAVBAR_HEIGHT,
    body_height: window.innerHeight - BOTTOM_MARGIN
  };
}
const SizeContext = exports.SizeContext = /*#__PURE__*/_react.default.createContext({
  topX: 0,
  topY: 0,
  availableWidth: 500,
  availableHeight: 500
});
function useSize() {
  let top_ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  let iCounter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let name = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "noname";
  const [usable_width, set_usable_width] = (0, _react.useState)(window.innerWidth);
  const [usable_height, set_usable_height] = (0, _react.useState)(window.innerHeight);
  const [topX, setTopX] = (0, _react.useState)(0);
  const [topY, setTopY] = (0, _react.useState)(0);
  const sizeInfo = (0, _react.useContext)(SizeContext);
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  (0, _react.useEffect)(() => {
    let awidth = sizeInfo.availableWidth;
    let aheight = sizeInfo.availableHeight;
    if (top_ref && top_ref.current) {
      let rect = top_ref.current.getBoundingClientRect();
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
    const [usable_height, set_usable_height] = (0, _react.useState)(window.innerHeight);
    const [usable_width, set_usable_width] = (0, _react.useState)(window.innerWidth);
    (0, _react.useEffect)(() => {
      window.addEventListener("resize", _handleResize);
      _handleResize();
      return () => {
        window.removeEventListener('resize', _handleResize);
      };
    }, []);
    function _handleResize() {
      set_usable_width(window.innerWidth);
      set_usable_height(window.innerHeight);
    }
    return /*#__PURE__*/_react.default.createElement(SizeContext.Provider, {
      value: {
        availableWidth: usable_width,
        availableHeight: usable_height,
        topX: 0,
        topY: 0
      }
    }, /*#__PURE__*/_react.default.createElement(WrappedComponent, props));
  }
  return /*#__PURE__*/(0, _react.memo)(newFunc);
}
function SizeProvider(_ref) {
  let {
    value,
    children
  } = _ref;
  const newValue = (0, _react.useMemo)(() => {
    return {
      ...value
    };
  }, [value.availableWidth, value.availableHeight, value.topX, value.topY]);
  return /*#__PURE__*/_react.default.createElement(SizeContext.Provider, {
    value: newValue
  }, children);
}
exports.SizeProvider = SizeProvider = /*#__PURE__*/(0, _react.memo)(SizeProvider);