"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragHandle = DragHandle;
exports.HANDLE_WIDTH = void 0;
exports.HorizontalPanes = HorizontalPanes;
exports.VerticalPanes = VerticalPanes;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _reactDraggable = require("react-draggable");
var _utilities_react = require("./utilities_react.js");
var _utilities_react2 = require("./utilities_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var MARGIN_SIZE = 17;
var HANDLE_WIDTH = exports.HANDLE_WIDTH = 10;
function DragHandle(props) {
  var startX = (0, _react.useRef)(null);
  var startY = (0, _react.useRef)(null);
  var lastX = (0, _react.useRef)(null);
  var lastY = (0, _react.useRef)(null);
  var icon_dict = {
    x: "drag-handle-vertical",
    y: "drag-handle-horizontal",
    both: "caret-right"
  };
  function _dragStart(e, ui) {
    startX.current = getMouseX(e);
    startY.current = getMouseY(e);
    lastX.current = startX.current;
    lastY.current = startY.current;
    if (props.dragStart) {
      props.dragStart(e, ui, startX.current, startY.current);
    }
    e.preventDefault();
  }
  function _onDrag(e, ui) {
    if (props.direction == "y") {
      lastX.current = startX.current;
    } else {
      lastX.current = getMouseX(e);
    }
    if (props.direction == "x") {
      lastY.current = startY.current;
    } else {
      lastY.current = getMouseY(e);
    }
    var dx = lastX.current - startX.current;
    var dy = lastY.current - startY.current;
    if (props.onDrag) {
      props.onDrag(e, ui, lastX.current, lastY.current, dx, dy);
    }
    e.preventDefault();
  }
  function _dragEnd(e, ui) {
    if (props.direction == "y") {
      lastX.current = startX.current;
    } else {
      lastX.current = getMouseX(e);
    }
    if (props.direction == "x") {
      lastY.current = startY.current;
    } else {
      lastY.current = getMouseY(e);
    }
    var dx = lastX.current - startX.current;
    var dy = lastY.current - startY.current;
    if (props.dragEnd) {
      props.dragEnd(e, ui, lastX.current, lastY.current, dx, dy);
    }
    e.preventDefault();
  }
  function getMouseX(e) {
    if (e.type == "touchend") return null;
    if (e.type == "touchmove" || e.type == "touchstart") {
      return e.touches[0].clientX;
    } else {
      return e.clientX;
    }
  }
  function getMouseY(e) {
    if (e.type == "touchend") return null;
    if (e.type == "touchmove" || e.type == "touchstart") {
      return e.touches[0].clientY;
    } else {
      return e.clientY;
    }
  }
  var cursor_dict = {
    x: "ew-resize",
    y: "ns-resize",
    both: "se-resize"
  };
  var style = props.position_dict;
  style.cursor = cursor_dict[props.direction];
  if (props.direction == "both") {
    style.transform = "rotate(45deg)";
  }
  var wrappedElement;
  if (props.useThinBar) {
    var the_class = props.direction == "x" ? "resize-border" : "horizontal-resize-border";
    if (props.barHeight != null) {
      style.height = props.barHeight;
    }
    if (props.barWidth != null) {
      style.width = props.barWidth;
    }
    wrappedElement = /*#__PURE__*/_react["default"].createElement("div", {
      className: the_class,
      style: style
    });
  } else {
    wrappedElement = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      icon: icon_dict[props.direction],
      size: props.iconSize,
      style: style
    });
  }
  return /*#__PURE__*/_react["default"].createElement(_reactDraggable.DraggableCore, {
    onStart: _dragStart,
    onStop: _dragEnd,
    onDrag: _onDrag,
    grid: [5, 5],
    scale: 1
  }, wrappedElement);
}
exports.DragHandle = DragHandle = /*#__PURE__*/(0, _react.memo)(DragHandle);
DragHandle.propTypes = {
  position_dict: _propTypes["default"].object,
  onDrag: _propTypes["default"].func,
  dragStart: _propTypes["default"].func,
  dragEnd: _propTypes["default"].func,
  direction: _propTypes["default"].string,
  size: _propTypes["default"].number,
  useThinBar: _propTypes["default"].bool,
  barheight: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  barWidth: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])
};
DragHandle.defaultProps = {
  direction: "x",
  size: 20,
  onDrag: null,
  dragStart: null,
  dragEnd: null,
  useThinBar: false,
  barHeight: null,
  barWidth: null
};
function HorizontalPanes(props) {
  var left_pane_ref = (0, _react.useRef)(null);
  var right_pane_ref = (0, _react.useRef)(null);
  var scroll_bases = (0, _react.useRef)({});
  var top_ref = (0, _react.useRef)(props.top_ref == null ? (0, _react.useRef)(null) : props.top_ref);
  var old_left_width = (0, _react.useRef)(0);
  var old_right_width = (0, _react.useRef)(0);
  var unique_id = (0, _react.useRef)((0, _utilities_react.guid)());
  var _useState = (0, _react.useState)(props.initial_width_fraction),
    _useState2 = _slicedToArray(_useState, 2),
    current_width_fraction = _useState2[0],
    set_current_width_fraction = _useState2[1];
  var _useState3 = (0, _react.useState)({
      x: 0,
      y: 0
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    deltaPosition = _useState4[0],
    setDeltaPosition = _useState4[1];
  (0, _react.useEffect)(function () {
    if (props.handleSplitUpdate) {
      props.handleSplitUpdate(left_width(), right_width(), current_width_fraction);
    }
  }, []);
  (0, _react.useEffect)(function () {
    notifySplitUpdate();
  }, [current_width_fraction]);
  function left_width() {
    if (props.show_handle) {
      return (props.available_width - HANDLE_WIDTH) * current_width_fraction;
    }
    return props.available_width * current_width_fraction - 2.5;
  }
  function right_width() {
    if (props.show_handle) {
      return (1 - current_width_fraction) * (props.available_width - HANDLE_WIDTH);
    }
    return (1 - current_width_fraction) * props.available_width - 2.5;
  }
  function width_has_changed() {
    return left_width() != old_left_width.current || right_width() != old_right_width.current;
  }
  function notifySplitUpdate() {
    if (width_has_changed() && props.handleSplitUpdate != null) {
      old_left_width.current = left_width();
      old_right_width.current = right_width();
      props.handleSplitUpdate(left_width(), right_width(), current_width_fraction);
    }
  }
  function _handleDrag(e, ui, x, y, dx, dy) {
    var new_width_fraction = (x - left_pane_ref.current.getBoundingClientRect().left) / props.available_width;
    new_width_fraction = new_width_fraction > 1 ? 1 : new_width_fraction;
    new_width_fraction = new_width_fraction < 0 ? 0 : new_width_fraction;
    set_current_width_fraction(new_width_fraction);
    _resetScrolls();
  }
  function _getSelectorElements() {
    var result = {};
    if (props.scrollAdjustSelectors && top_ref && top_ref.current) {
      var _iterator = _createForOfIteratorHelper(props.scrollAdjustSelectors),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var selector = _step.value;
          var els = $(top_ref.current).find(selector);
          if (els.length > 0) {
            result[selector] = els[0];
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return result;
  }
  function _resetScrolls() {
    var selector_element_dict = _getSelectorElements();
    for (var selector in selector_element_dict) {
      var el = selector_element_dict[selector];
      el.scrollLeft = scroll_bases.current[selector].left;
      el.scrollTop = scroll_bases.current[selector].top;
    }
  }
  function _handleDragStart(e, ui, x, y, dx, dy) {
    var selector_element_dict = _getSelectorElements();
    for (var selector in selector_element_dict) {
      var el = selector_element_dict[selector];
      scroll_bases.current[selector] = {
        left: el.scrollLeft,
        top: el.scrollTop
      };
    }
    if (props.handleResizeStart) {
      props.handleResizeStart(e, ui, x, y, dx, dy);
    }
  }
  function _handleDragEnd(e, ui, x, y, dx, dy) {
    var new_width_fraction = (x - left_pane_ref.current.getBoundingClientRect().left) / props.available_width;
    new_width_fraction = new_width_fraction > 1 ? 1 : new_width_fraction;
    new_width_fraction = new_width_fraction < 0 ? 0 : new_width_fraction;
    if (props.handleResizeEnd) {
      props.handleResizeEnd(new_width_fraction);
    }
    _resetScrolls();
  }
  var handle_left;
  if (right_pane_ref && right_pane_ref.current) {
    handle_left = right_pane_ref.current.offsetLeft - 10;
  } else {
    handle_left = left_width() + 75;
  }
  var position_dict = {
    position: "absolute",
    left: handle_left
  };
  var left_div_style = {
    width: left_width(),
    height: props.available_height - props.bottom_margin,
    flexDirection: "column",
    overflow: "hidden",
    paddingLeft: window.in_context ? 5 : 12
  };
  // noinspection JSSuspiciousNameCombination
  var right_div_style = {
    width: right_width(),
    height: props.available_height - props.bottom_margin,
    flexDirection: "column",
    marginLeft: 10
  };
  var cname = "";
  if (props.right_pane_overflow == "auto") {
    cname = "contingent-scroll";
  } else {
    right_div_style["overflowY"] = props.right_pane_overflow;
  }
  var dstyle = props.hide_me ? {
    display: "none"
  } : {};
  var outer_hp_style;
  if (props.outer_style) {
    outer_hp_style = props.outer_hp_style;
  } else {
    outer_hp_style = {};
  }
  outer_hp_style["width"] = "100%";
  if (props.left_margin) {
    outer_hp_style["marginLeft"] = props.left_margin;
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: unique_id.current,
    className: "d-flex flex-row horizontal-panes",
    style: outer_hp_style,
    ref: top_ref
  }, /*#__PURE__*/_react["default"].createElement("div", {
    ref: left_pane_ref,
    style: left_div_style,
    className: "res-viewer-resizer"
  }, props.left_pane), props.show_handle && /*#__PURE__*/_react["default"].createElement(DragHandle, {
    position_dict: position_dict,
    onDrag: _handleDrag,
    dragStart: _handleDragStart,
    dragEnd: _handleDragEnd,
    direction: "x",
    size: props.dragIconSize,
    useThinBar: true,
    barHeight: props.available_height - props.bottom_margin
  }), /*#__PURE__*/_react["default"].createElement("div", {
    ref: right_pane_ref,
    className: cname,
    style: right_div_style
  }, props.right_pane));
}
exports.HorizontalPanes = HorizontalPanes = /*#__PURE__*/(0, _react.memo)(HorizontalPanes, function (prevProps, newProps) {
  (0, _utilities_react2.propsAreEqual)(prevProps, newProps, ["left_pane", "right_pane", "handleSplitUpdate", "handleResizeStart", "handleResizeEnd", "scrollAdjustSelectors", "initial_width_fraction", "top_ref", "bottom_margin", "show_handle", "dragIconSize", "outer_style"]);
});
HorizontalPanes.propTypes = {
  available_width: _propTypes["default"].number,
  available_height: _propTypes["default"].number,
  left_pane: _propTypes["default"].object,
  right_pane: _propTypes["default"].object,
  right_pane_overflow: _propTypes["default"].string,
  scrollAdjustSelectors: _propTypes["default"].array,
  handleSplitUpdate: _propTypes["default"].func,
  handleResizeStart: _propTypes["default"].func,
  handleResizeEnd: _propTypes["default"].func,
  initial_width_fraction: _propTypes["default"].number,
  top_ref: _propTypes["default"].object,
  bottom_margin: _propTypes["default"].number,
  show_handle: _propTypes["default"].bool,
  dragIconSize: _propTypes["default"].number
};
HorizontalPanes.defaultProps = {
  handleSplitUpdate: null,
  handleResizeStart: null,
  handleResizeEnd: null,
  scrollAdjustSelectors: null,
  initial_width_fraction: .5,
  hide_me: false,
  left_margin: null,
  right_margin: null,
  right_pane_overflow: "visible",
  top_ref: null,
  bottom_margin: 0,
  show_handle: true,
  dragIconSize: 20
};
function VerticalPanes(props) {
  var top_ref = (0, _react.useRef)(null);
  var top_pane_ref = (0, _react.useRef)(null);
  var bottom_pane_ref = (0, _react.useRef)(null);
  var scroll_bases = (0, _react.useRef)({});
  var old_bottom_height = (0, _react.useRef)(0);
  var old_top_height = (0, _react.useRef)(0);
  var unique_id = (0, _react.useRef)((0, _utilities_react.guid)());
  var _useState5 = (0, _react.useState)(props.initial_height_fraction),
    _useState6 = _slicedToArray(_useState5, 2),
    current_height_fraction = _useState6[0],
    set_current_height_fraction = _useState6[1];
  (0, _react.useEffect)(function () {
    notifySplitUpdate();
  }, [current_height_fraction]);
  function top_height() {
    return props.available_height * current_height_fraction - 2.5;
  }
  function bottom_height() {
    return (1 - current_height_fraction) * props.available_height - 2.5;
  }
  function notifySplitUpdate() {
    if (props.handleSplitUpdate != null && height_has_changed()) {
      old_top_height.current = top_height();
      old_bottom_height.current = bottom_height();
      props.handleSplitUpdate(top_height(), bottom_height(), current_height_fraction);
    }
  }
  function height_has_changed() {
    return top_height() != old_top_height.current || bottom_height() != old_bottom_height.current;
  }
  function _handleDrag(e, ui, x, y, dx, dy) {
    var new_height_fraction = (y - top_pane_ref.current.offsetTop) / props.available_height;
    new_height_fraction = new_height_fraction > 1 ? 1 : new_height_fraction;
    new_height_fraction = new_height_fraction < 0 ? 0 : new_height_fraction;
    set_current_height_fraction(new_height_fraction);
  }
  function _getSelectorElements() {
    var result = {};
    if (props.scrollAdjustSelectors && top_ref && top_ref.current) {
      var _iterator2 = _createForOfIteratorHelper(props.scrollAdjustSelectors),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var selector = _step2.value;
          var els = $(top_ref.current).find(selector);
          if (els.length > 0) {
            result[selector] = els[0];
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    return result;
  }
  function _resetScrolls() {
    var selector_element_dict = _getSelectorElements();
    for (var selector in selector_element_dict) {
      var el = selector_element_dict[selector];
      el.scrollLeft = scroll_bases.current[selector].left;
      el.scrollTop = scroll_bases.current[selector].top;
    }
  }
  function _handleDragStart(e, ui, x, y, dx, dy) {
    var selector_element_dict = _getSelectorElements();
    for (var selector in selector_element_dict) {
      var el = selector_element_dict[selector];
      scroll_bases.current[selector] = {
        left: el.scrollLeft,
        top: el.scrollTop
      };
    }
    if (props.handleResizeStart) {
      props.handleResizeStart(e, ui, x, y, dx, dy);
    }
  }
  function _handleDragEnd(e, ui, x, y, dx, dy) {
    var new_height_fraction = (y - top_pane_ref.current.offsetTop) / props.available_height;
    new_height_fraction = new_height_fraction > 1 ? 1 : new_height_fraction;
    new_height_fraction = new_height_fraction < 0 ? 0 : new_height_fraction;
    if (props.handleResizeEnd) {
      props.handleResizeEnd(new_height_fraction);
    }
    _resetScrolls();
  }
  var handle_top;
  if (bottom_pane_ref && bottom_pane_ref.current) {
    handle_top = bottom_pane_ref.current.offsetTop - 10;
  } else {
    handle_top = top_height() + 75;
  }
  var position_dict = {
    position: "absolute",
    top: handle_top
  };
  var top_div_style = {
    "width": props.available_width,
    "height": top_height(),
    overflowY: props.overflow
  };
  if (props.hide_top) {
    top_div_style.display = "none";
  }
  var bottom_div_style = {
    "width": props.available_width,
    "height": bottom_height(),
    overflowY: props.overflow,
    marginTop: 10
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: unique_id.current,
    className: "d-flex flex-column",
    ref: top_ref
  }, /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_pane_ref,
    style: top_div_style
  }, props.top_pane), props.show_handle && /*#__PURE__*/_react["default"].createElement(DragHandle, {
    position_dict: position_dict,
    onDrag: _handleDrag,
    direction: "y",
    size: props.dragIconSize,
    dragStart: _handleDragStart,
    dragEnd: _handleDragEnd,
    useThinBar: true,
    barWidth: props.available_width
  }), /*#__PURE__*/_react["default"].createElement("div", {
    ref: bottom_pane_ref,
    style: bottom_div_style
  }, props.bottom_pane));
}
exports.VerticalPanes = VerticalPanes = /*#__PURE__*/(0, _react.memo)(VerticalPanes);
VerticalPanes.propTypes = {
  available_width: _propTypes["default"].number,
  available_height: _propTypes["default"].number,
  top_pane: _propTypes["default"].object,
  hide_top: _propTypes["default"].bool,
  bottom_pane: _propTypes["default"].object,
  handleSplitUpdate: _propTypes["default"].func,
  handleResizeStart: _propTypes["default"].func,
  handleResizeEnd: _propTypes["default"].func,
  scrollAdjustSelectors: _propTypes["default"].array,
  initial_height_fraction: _propTypes["default"].number,
  overflow: _propTypes["default"].string,
  show_handle: _propTypes["default"].bool,
  dragIconSize: _propTypes["default"].number
};
VerticalPanes.defaultProps = {
  handleSplitUpdate: null,
  handleResizeStart: null,
  handleResizeEnd: null,
  scrollAdjustSelectors: null,
  initial_height_fraction: .5,
  hide_top: false,
  overflow: "scroll",
  show_handle: true,
  dragIconSize: 20
};