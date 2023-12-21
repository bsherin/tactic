"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const MARGIN_SIZE = 17;
const HANDLE_WIDTH = exports.HANDLE_WIDTH = 10;
function DragHandle(props) {
  const startX = (0, _react.useRef)(null);
  const startY = (0, _react.useRef)(null);
  const lastX = (0, _react.useRef)(null);
  const lastY = (0, _react.useRef)(null);
  const icon_dict = {
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
    let dx = lastX.current - startX.current;
    let dy = lastY.current - startY.current;
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
    let dx = lastX.current - startX.current;
    let dy = lastY.current - startY.current;
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
  const cursor_dict = {
    x: "ew-resize",
    y: "ns-resize",
    both: "se-resize"
  };
  let style = props.position_dict;
  style.cursor = cursor_dict[props.direction];
  if (props.direction == "both") {
    style.transform = "rotate(45deg)";
  }
  let wrappedElement;
  if (props.useThinBar) {
    let the_class = props.direction == "x" ? "resize-border" : "horizontal-resize-border";
    if (props.barHeight != null) {
      style.height = props.barHeight;
    }
    if (props.barWidth != null) {
      style.width = props.barWidth;
    }
    wrappedElement = /*#__PURE__*/_react.default.createElement("div", {
      className: the_class,
      style: style
    });
  } else {
    wrappedElement = /*#__PURE__*/_react.default.createElement(_core.Icon, {
      icon: icon_dict[props.direction],
      size: props.iconSize,
      style: style
    });
  }
  return /*#__PURE__*/_react.default.createElement(_reactDraggable.DraggableCore, {
    onStart: _dragStart,
    onStop: _dragEnd,
    onDrag: _onDrag,
    grid: [5, 5],
    scale: 1
  }, wrappedElement);
}
exports.DragHandle = DragHandle = /*#__PURE__*/(0, _react.memo)(DragHandle);
DragHandle.propTypes = {
  position_dict: _propTypes.default.object,
  onDrag: _propTypes.default.func,
  dragStart: _propTypes.default.func,
  dragEnd: _propTypes.default.func,
  direction: _propTypes.default.string,
  size: _propTypes.default.number,
  useThinBar: _propTypes.default.bool,
  barheight: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number]),
  barWidth: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number])
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
  const left_pane_ref = (0, _react.useRef)(null);
  const right_pane_ref = (0, _react.useRef)(null);
  const scroll_bases = (0, _react.useRef)({});
  const top_ref = (0, _react.useRef)(props.top_ref == null ? (0, _react.useRef)(null) : props.top_ref);
  const old_left_width = (0, _react.useRef)(0);
  const old_right_width = (0, _react.useRef)(0);
  const unique_id = (0, _react.useRef)((0, _utilities_react.guid)());
  const [current_width_fraction, set_current_width_fraction] = (0, _react.useState)(props.initial_width_fraction);
  const [deltaPosition, setDeltaPosition] = (0, _react.useState)({
    x: 0,
    y: 0
  });
  (0, _react.useEffect)(() => {
    if (props.handleSplitUpdate) {
      props.handleSplitUpdate(left_width(), right_width(), current_width_fraction);
    }
  }, []);
  (0, _react.useEffect)(() => {
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
    let new_width_fraction = (x - left_pane_ref.current.getBoundingClientRect().left) / props.available_width;
    new_width_fraction = new_width_fraction > 1 ? 1 : new_width_fraction;
    new_width_fraction = new_width_fraction < 0 ? 0 : new_width_fraction;
    set_current_width_fraction(new_width_fraction);
    _resetScrolls();
  }
  function _getSelectorElements() {
    let result = {};
    if (props.scrollAdjustSelectors && top_ref && top_ref.current) {
      for (let selector of props.scrollAdjustSelectors) {
        let els = $(top_ref.current).find(selector);
        if (els.length > 0) {
          result[selector] = els[0];
        }
      }
    }
    return result;
  }
  function _resetScrolls() {
    let selector_element_dict = _getSelectorElements();
    for (let selector in selector_element_dict) {
      let el = selector_element_dict[selector];
      el.scrollLeft = scroll_bases.current[selector].left;
      el.scrollTop = scroll_bases.current[selector].top;
    }
  }
  function _handleDragStart(e, ui, x, y, dx, dy) {
    let selector_element_dict = _getSelectorElements();
    for (let selector in selector_element_dict) {
      let el = selector_element_dict[selector];
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
    let new_width_fraction = (x - left_pane_ref.current.getBoundingClientRect().left) / props.available_width;
    new_width_fraction = new_width_fraction > 1 ? 1 : new_width_fraction;
    new_width_fraction = new_width_fraction < 0 ? 0 : new_width_fraction;
    if (props.handleResizeEnd) {
      props.handleResizeEnd(new_width_fraction);
    }
    _resetScrolls();
  }
  let handle_left;
  if (right_pane_ref && right_pane_ref.current) {
    handle_left = right_pane_ref.current.offsetLeft - 10;
  } else {
    handle_left = left_width() + 75;
  }
  let position_dict = {
    position: "absolute",
    left: handle_left
  };
  let left_div_style = {
    width: left_width(),
    height: props.available_height - props.bottom_margin,
    flexDirection: "column",
    overflow: "hidden",
    paddingLeft: window.in_context ? 5 : 12
  };
  // noinspection JSSuspiciousNameCombination
  let right_div_style = {
    width: right_width(),
    height: props.available_height - props.bottom_margin,
    flexDirection: "column",
    marginLeft: 10
  };
  let cname = "";
  if (props.right_pane_overflow == "auto") {
    cname = "contingent-scroll";
  } else {
    right_div_style["overflowY"] = props.right_pane_overflow;
  }
  let dstyle = props.hide_me ? {
    display: "none"
  } : {};
  let outer_hp_style;
  if (props.outer_style) {
    outer_hp_style = props.outer_hp_style;
  } else {
    outer_hp_style = {};
  }
  outer_hp_style["width"] = "100%";
  if (props.left_margin) {
    outer_hp_style["marginLeft"] = props.left_margin;
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    id: unique_id.current,
    className: "d-flex flex-row horizontal-panes",
    style: outer_hp_style,
    ref: top_ref
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: left_pane_ref,
    style: left_div_style,
    className: "res-viewer-resizer"
  }, props.left_pane), props.show_handle && /*#__PURE__*/_react.default.createElement(DragHandle, {
    position_dict: position_dict,
    onDrag: _handleDrag,
    dragStart: _handleDragStart,
    dragEnd: _handleDragEnd,
    direction: "x",
    size: props.dragIconSize,
    useThinBar: true,
    barHeight: props.available_height - props.bottom_margin
  }), /*#__PURE__*/_react.default.createElement("div", {
    ref: right_pane_ref,
    className: cname,
    style: right_div_style
  }, props.right_pane));
}
exports.HorizontalPanes = HorizontalPanes = /*#__PURE__*/(0, _react.memo)(HorizontalPanes);
HorizontalPanes.propTypes = {
  available_width: _propTypes.default.number,
  available_height: _propTypes.default.number,
  left_pane: _propTypes.default.object,
  right_pane: _propTypes.default.object,
  right_pane_overflow: _propTypes.default.string,
  scrollAdjustSelectors: _propTypes.default.array,
  handleSplitUpdate: _propTypes.default.func,
  handleResizeStart: _propTypes.default.func,
  handleResizeEnd: _propTypes.default.func,
  initial_width_fraction: _propTypes.default.number,
  top_ref: _propTypes.default.object,
  bottom_margin: _propTypes.default.number,
  show_handle: _propTypes.default.bool,
  dragIconSize: _propTypes.default.number
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
  const top_ref = (0, _react.useRef)(null);
  const top_pane_ref = (0, _react.useRef)(null);
  const bottom_pane_ref = (0, _react.useRef)(null);
  const scroll_bases = (0, _react.useRef)({});
  const old_bottom_height = (0, _react.useRef)(0);
  const old_top_height = (0, _react.useRef)(0);
  const unique_id = (0, _react.useRef)((0, _utilities_react.guid)());
  const [current_height_fraction, set_current_height_fraction] = (0, _react.useState)(props.initial_height_fraction);
  (0, _react.useEffect)(() => {
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
    let new_height_fraction = (y - top_pane_ref.current.offsetTop) / props.available_height;
    new_height_fraction = new_height_fraction > 1 ? 1 : new_height_fraction;
    new_height_fraction = new_height_fraction < 0 ? 0 : new_height_fraction;
    set_current_height_fraction(new_height_fraction);
  }
  function _getSelectorElements() {
    let result = {};
    if (props.scrollAdjustSelectors && top_ref && top_ref.current) {
      for (let selector of props.scrollAdjustSelectors) {
        let els = $(top_ref.current).find(selector);
        if (els.length > 0) {
          result[selector] = els[0];
        }
      }
    }
    return result;
  }
  function _resetScrolls() {
    let selector_element_dict = _getSelectorElements();
    for (let selector in selector_element_dict) {
      let el = selector_element_dict[selector];
      el.scrollLeft = scroll_bases.current[selector].left;
      el.scrollTop = scroll_bases.current[selector].top;
    }
  }
  function _handleDragStart(e, ui, x, y, dx, dy) {
    let selector_element_dict = _getSelectorElements();
    for (let selector in selector_element_dict) {
      let el = selector_element_dict[selector];
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
    let new_height_fraction = (y - top_pane_ref.current.offsetTop) / props.available_height;
    new_height_fraction = new_height_fraction > 1 ? 1 : new_height_fraction;
    new_height_fraction = new_height_fraction < 0 ? 0 : new_height_fraction;
    if (props.handleResizeEnd) {
      props.handleResizeEnd(new_height_fraction);
    }
    _resetScrolls();
  }
  let handle_top;
  if (bottom_pane_ref && bottom_pane_ref.current) {
    handle_top = bottom_pane_ref.current.offsetTop - 10;
  } else {
    handle_top = top_height() + 75;
  }
  let position_dict = {
    position: "absolute",
    top: handle_top
  };
  let top_div_style = {
    "width": props.available_width,
    "height": top_height(),
    overflowY: props.overflow
  };
  if (props.hide_top) {
    top_div_style.display = "none";
  }
  let bottom_div_style = {
    "width": props.available_width,
    "height": bottom_height(),
    overflowY: props.overflow,
    marginTop: 10
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    id: unique_id.current,
    className: "d-flex flex-column",
    ref: top_ref
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: top_pane_ref,
    style: top_div_style
  }, props.top_pane), props.show_handle && /*#__PURE__*/_react.default.createElement(DragHandle, {
    position_dict: position_dict,
    onDrag: _handleDrag,
    direction: "y",
    size: props.dragIconSize,
    dragStart: _handleDragStart,
    dragEnd: _handleDragEnd,
    useThinBar: true,
    barWidth: props.available_width
  }), /*#__PURE__*/_react.default.createElement("div", {
    ref: bottom_pane_ref,
    style: bottom_div_style
  }, props.bottom_pane));
}
exports.VerticalPanes = VerticalPanes = /*#__PURE__*/(0, _react.memo)(VerticalPanes);
VerticalPanes.propTypes = {
  available_width: _propTypes.default.number,
  available_height: _propTypes.default.number,
  top_pane: _propTypes.default.object,
  hide_top: _propTypes.default.bool,
  bottom_pane: _propTypes.default.object,
  handleSplitUpdate: _propTypes.default.func,
  handleResizeStart: _propTypes.default.func,
  handleResizeEnd: _propTypes.default.func,
  scrollAdjustSelectors: _propTypes.default.array,
  initial_height_fraction: _propTypes.default.number,
  overflow: _propTypes.default.string,
  show_handle: _propTypes.default.bool,
  dragIconSize: _propTypes.default.number
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