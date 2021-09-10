"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DragHandle = exports.HANDLE_WIDTH = exports.VerticalPanes = exports.HorizontalPanes = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _reactDraggable = require("react-draggable");

var _utilities_react = require("./utilities_react.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var MARGIN_SIZE = 17;
var HANDLE_WIDTH = 20;
exports.HANDLE_WIDTH = HANDLE_WIDTH;

var DragHandle = /*#__PURE__*/function (_React$Component) {
  _inherits(DragHandle, _React$Component);

  var _super = _createSuper(DragHandle);

  function DragHandle(props) {
    var _this;

    _classCallCheck(this, DragHandle);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.startX = null;
    _this.startY = null;
    _this.lastX = null;
    _this.lastY = null;
    return _this;
  }

  _createClass(DragHandle, [{
    key: "icon_dict",
    get: function get() {
      return {
        x: "drag-handle-vertical",
        y: "drag-handle-horizontal",
        both: "caret-right"
      };
    }
  }, {
    key: "_dragStart",
    value: function _dragStart(e, ui) {
      this.startX = this.getMouseX(e);
      this.startY = this.getMouseY(e);
      this.lastX = this.startX;
      this.lastY = this.startY;

      if (this.props.dragStart) {
        this.props.dragStart(e, ui, this.startX, this.startY);
      }

      e.preventDefault();
    }
  }, {
    key: "_onDrag",
    value: function _onDrag(e, ui) {
      if (this.props.direction == "y") {
        this.lastX = this.startX;
      } else {
        this.lastX = this.getMouseX(e);
      }

      if (this.props.direction == "x") {
        this.lastY = this.startY;
      } else {
        this.lastY = this.getMouseY(e);
      }

      var dx = this.lastX - this.startX;
      var dy = this.lastY - this.startY;

      if (this.props.onDrag) {
        this.props.onDrag(e, ui, this.lastX, this.lastY, dx, dy);
      }

      e.preventDefault();
    }
  }, {
    key: "_dragEnd",
    value: function _dragEnd(e, ui) {
      if (this.props.direction == "y") {
        this.lastX = this.startX;
      } else {
        this.lastX = this.getMouseX(e);
      }

      if (this.props.direction == "x") {
        this.lastY = this.startY;
      } else {
        this.lastY = this.getMouseY(e);
      }

      var dx = this.lastX - this.startX;
      var dy = this.lastY - this.startY;

      if (this.props.dragEnd) {
        this.props.dragEnd(e, ui, this.lastX, this.lastY, dx, dy);
      }

      e.preventDefault();
    }
  }, {
    key: "getMouseX",
    value: function getMouseX(e) {
      if (e.type == "touchend") return null;

      if (e.type == "touchmove" || e.type == "touchstart") {
        return e.touches[0].clientX;
      } else {
        return e.clientX;
      }
    }
  }, {
    key: "getMouseY",
    value: function getMouseY(e) {
      if (e.type == "touchend") return null;

      if (e.type == "touchmove" || e.type == "touchstart") {
        return e.touches[0].clientY;
      } else {
        return e.clientY;
      }
    }
  }, {
    key: "cursor_dict",
    get: function get() {
      return {
        x: "ew-resize",
        y: "ns-resize",
        both: "se-resize"
      };
    }
  }, {
    key: "render",
    value: function render() {
      var style = this.props.position_dict;
      style.cursor = this.cursor_dict[this.props.direction];

      if (this.props.direction == "both") {
        style.transform = "rotate(45deg)";
      }

      var wrappedElement;

      if (this.props.useVerticalBar) {
        wrappedElement = /*#__PURE__*/_react["default"].createElement("div", {
          className: "resize-border",
          style: style
        });
      } else {
        wrappedElement = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
          icon: this.icon_dict[this.props.direction],
          iconSize: this.props.iconSize,
          style: style
        });
      }

      return /*#__PURE__*/_react["default"].createElement(_reactDraggable.DraggableCore, {
        onStart: this._dragStart,
        onStop: this._dragEnd,
        onDrag: this._onDrag,
        grid: [5, 5],
        scale: 1
      }, wrappedElement);
    }
  }]);

  return DragHandle;
}(_react["default"].Component);

exports.DragHandle = DragHandle;
DragHandle.propTypes = {
  position_dict: _propTypes["default"].object,
  onDrag: _propTypes["default"].func,
  dragStart: _propTypes["default"].func,
  dragEnd: _propTypes["default"].func,
  direction: _propTypes["default"].string,
  iconSize: _propTypes["default"].number,
  useVerticalBar: _propTypes["default"].bool
};
DragHandle.defaultProps = {
  direction: "x",
  iconSize: 20,
  onDrag: null,
  dragStart: null,
  dragEnd: null,
  useVerticalBar: false
};

var HorizontalPanes = /*#__PURE__*/function (_React$Component2) {
  _inherits(HorizontalPanes, _React$Component2);

  var _super2 = _createSuper(HorizontalPanes);

  function HorizontalPanes(props) {
    var _this2;

    _classCallCheck(this, HorizontalPanes);

    _this2 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    _this2.left_pane_ref = /*#__PURE__*/_react["default"].createRef();
    _this2.right_pane_ref = /*#__PURE__*/_react["default"].createRef();
    _this2.drag_handle_ref = /*#__PURE__*/_react["default"].createRef();
    _this2.scroll_bases = {};
    _this2.top_ref = _this2.props.top_ref == null ? /*#__PURE__*/_react["default"].createRef() : _this2.props.top_ref;
    _this2.old_left_width = 0;
    _this2.old_right_width = 0;
    _this2.unique_id = (0, _utilities_react.guid)();
    _this2.state = {
      "current_width_fraction": _this2.props.initial_width_fraction,
      "mounted": false,
      deltaPosition: {
        x: 0,
        y: 0
      }
    };
    return _this2;
  }

  _createClass(HorizontalPanes, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this3 = this;

      window.addEventListener("resize", this.resize_to_window);
      this.setState({
        "mounted": true
      }, function () {
        if (_this3.props.handleSplitUpdate) {
          _this3.props.handleSplitUpdate(_this3.left_width, _this3.right_width, _this3.state.current_width_fraction);
        }
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.notifySplitUpate();
    }
  }, {
    key: "left_width",
    get: function get() {
      if (this.props.show_handle) {
        return (this.props.available_width - HANDLE_WIDTH) * this.state.current_width_fraction;
      }

      return this.props.available_width * this.state.current_width_fraction;
    }
  }, {
    key: "right_width",
    get: function get() {
      if (this.props.show_handle) {
        return (1 - this.state.current_width_fraction) * (this.props.available_width - HANDLE_WIDTH);
      }

      return (1 - this.state.current_width_fraction) * this.props.available_width;
    }
  }, {
    key: "update_width_fraction",
    value: function update_width_fraction(new_width_fraction) {
      this.setState({
        "current_width_fraction": new_width_fraction
      });
    }
  }, {
    key: "width_has_changed",
    get: function get() {
      return this.left_width != this.old_left_width || this.right_width != this.old_right_width;
    }
  }, {
    key: "notifySplitUpate",
    value: function notifySplitUpate() {
      if (this.width_has_changed && this.props.handleSplitUpdate != null) {
        this.old_left_width = this.left_width;
        this.old_right_width = this.right_width;
        this.props.handleSplitUpdate(this.left_width, this.right_width, this.state.current_width_fraction);
      }
    }
  }, {
    key: "_handleDrag",
    value: function _handleDrag(e, ui, x, y, dx, dy) {
      var new_width_fraction = (x - this.left_pane_ref.current.offsetLeft) / this.props.available_width;
      this.update_width_fraction(new_width_fraction);

      this._resetScrolls();
    }
  }, {
    key: "_getSelectorElements",
    value: function _getSelectorElements() {
      var result = {};

      if (this.props.scrollAdjustSelectors && this.top_ref && this.top_ref.current) {
        var _iterator = _createForOfIteratorHelper(this.props.scrollAdjustSelectors),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var selector = _step.value;
            var els = $(this.top_ref.current).find(selector);

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
  }, {
    key: "_resetScrolls",
    value: function _resetScrolls() {
      var selector_element_dict = this._getSelectorElements();

      for (var selector in selector_element_dict) {
        var el = selector_element_dict[selector];
        el.scrollLeft = this.scroll_bases[selector].left;
        el.scrollTop = this.scroll_bases[selector].top;
      }
    }
  }, {
    key: "_handleDragStart",
    value: function _handleDragStart(e, ui, x, y, dx, dy) {
      var selector_element_dict = this._getSelectorElements();

      for (var selector in selector_element_dict) {
        var el = selector_element_dict[selector];
        this.scroll_bases[selector] = {
          left: el.scrollLeft,
          top: el.scrollTop
        };
      }

      if (this.props.handleResizeStart) {
        this.props.handleResizeStart(e, ui, x, y, dx, dy);
      }
    }
  }, {
    key: "_handleDragEnd",
    value: function _handleDragEnd(e, ui, x, y, dx, dy) {
      var new_width_fraction = (x - this.left_pane_ref.current.offsetLeft) / this.props.available_width;

      if (this.props.handleResizeEnd) {
        this.props.handleResizeEnd(new_width_fraction);
      }

      this._resetScrolls();
    }
  }, {
    key: "render",
    value: function render() {
      var left_div_style = {
        width: this.left_width,
        height: this.props.available_height - this.props.bottom_margin,
        flexDirection: "column",
        overflow: "hidden",
        paddingLeft: window.in_context ? 5 : 12
      }; // noinspection JSSuspiciousNameCombination

      var right_div_style = {
        width: this.right_width,
        height: this.props.available_height - this.props.bottom_margin,
        flexDirection: "column"
      };
      var cname = "";

      if (this.props.right_pane_overflow == "auto") {
        cname = "contingent-scroll";
      } else {
        right_div_style["overflowY"] = this.props.right_pane_overflow;
      }

      var dstyle = this.props.hide_me ? {
        display: "none"
      } : {};
      var position_dict = {
        position: "relative",
        left: 0,
        top: (this.props.available_height - this.props.bottom_margin) / 2
      };
      var outer_style = {
        width: "100%"
      };

      if (this.props.left_margin) {
        outer_style["marginLeft"] = this.props.left_margin;
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        id: this.unique_id,
        className: "d-flex flex-row horizontal-panes",
        style: outer_style,
        ref: this.top_ref
      }, /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.left_pane_ref,
        style: left_div_style,
        className: "res-viewer-resizer"
      }, this.props.left_pane), this.props.show_handle && /*#__PURE__*/_react["default"].createElement(DragHandle, {
        position_dict: position_dict,
        onDrag: this._handleDrag,
        dragStart: this._handleDragStart,
        dragEnd: this._handleDragEnd,
        direction: "x",
        iconSize: this.props.dragIconSize
      }), /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.right_pane_ref,
        className: cname,
        style: right_div_style
      }, this.props.right_pane));
    }
  }]);

  return HorizontalPanes;
}(_react["default"].Component);

exports.HorizontalPanes = HorizontalPanes;
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

var VerticalPanes = /*#__PURE__*/function (_React$Component3) {
  _inherits(VerticalPanes, _React$Component3);

  var _super3 = _createSuper(VerticalPanes);

  function VerticalPanes(props) {
    var _this4;

    _classCallCheck(this, VerticalPanes);

    _this4 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this4));
    _this4.top_ref = /*#__PURE__*/_react["default"].createRef();
    _this4.top_pane_ref = /*#__PURE__*/_react["default"].createRef();
    _this4.bottom_pane_ref = /*#__PURE__*/_react["default"].createRef();
    _this4.scroll_bases = {};
    _this4.old_bottom_height = 0;
    _this4.old_top_height = 0;
    _this4.unique_id = (0, _utilities_react.guid)();
    _this4.state = {
      "current_height_fraction": _this4.props.initial_height_fraction,
      "mounted": false
    };
    return _this4;
  }

  _createClass(VerticalPanes, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "mounted": true
      });
      window.addEventListener("resize", this.resize_to_window);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.notifySplitUpate();
    }
  }, {
    key: "top_height",
    get: function get() {
      return this.props.available_height * this.state.current_height_fraction;
    }
  }, {
    key: "bottom_height",
    get: function get() {
      return (1 - this.state.current_height_fraction) * this.props.available_height;
    }
  }, {
    key: "notifySplitUpate",
    value: function notifySplitUpate() {
      if (this.props.handleSplitUpdate != null && this.height_has_changed) {
        this.old_top_height = this.top_height;
        this.old_bottom_height = this.bottom_height;
        this.props.handleSplitUpdate(this.top_height, this.bottom_height, this.state.current_height_fraction);
      }
    }
  }, {
    key: "update_height_fraction",
    value: function update_height_fraction(new_height_fraction) {
      this.setState({
        "current_height_fraction": new_height_fraction
      });
    }
  }, {
    key: "height_has_changed",
    get: function get() {
      return this.top_height != this.old_top_height || this.bottom_height != this.old_bottom_height;
    }
  }, {
    key: "_handleDrag",
    value: function _handleDrag(e, ui, x, y, dx, dy) {
      var new_height_fraction = (y - this.top_pane_ref.current.offsetTop) / this.props.available_height;
      this.update_height_fraction(new_height_fraction);
    }
  }, {
    key: "_getSelectorElements",
    value: function _getSelectorElements() {
      var result = {};

      if (this.props.scrollAdjustSelectors && this.top_ref && this.top_ref.current) {
        var _iterator2 = _createForOfIteratorHelper(this.props.scrollAdjustSelectors),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var selector = _step2.value;
            var els = $(this.top_ref.current).find(selector);

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
  }, {
    key: "_resetScrolls",
    value: function _resetScrolls() {
      var selector_element_dict = this._getSelectorElements();

      for (var selector in selector_element_dict) {
        var el = selector_element_dict[selector];
        el.scrollLeft = this.scroll_bases[selector].left;
        el.scrollTop = this.scroll_bases[selector].top;
      }
    }
  }, {
    key: "_handleDragStart",
    value: function _handleDragStart(e, ui, x, y, dx, dy) {
      var selector_element_dict = this._getSelectorElements();

      for (var selector in selector_element_dict) {
        var el = selector_element_dict[selector];
        this.scroll_bases[selector] = {
          left: el.scrollLeft,
          top: el.scrollTop
        };
      }

      if (this.props.handleResizeStart) {
        this.props.handleResizeStart(e, ui, x, y, dx, dy);
      }
    }
  }, {
    key: "_handleDragEnd",
    value: function _handleDragEnd(e, ui, x, y, dx, dy) {
      var new_height_fraction = (y - this.top_pane_ref.current.offsetTop) / this.props.available_height;

      if (this.props.handleResizeEnd) {
        this.props.handleResizeEnd(new_height_fraction);
      }

      this._resetScrolls();
    }
  }, {
    key: "render",
    value: function render() {
      var top_div_style = {
        "width": this.props.available_width,
        "height": this.top_height,
        // borderBottom: "0.5px solid rgb(238, 238, 238)",
        overflowY: this.props.overflow
      };

      if (this.props.hide_top) {
        top_div_style.display = "none";
      }

      var bottom_div_style = {
        "width": this.props.available_width,
        "height": this.bottom_height,
        overflowY: this.props.overflow
      };
      var position_dict = {
        position: "relative",
        left: this.props.available_width / 2,
        top: 0
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        id: this.unique_id,
        className: "d-flex flex-column",
        ref: this.top_ref
      }, /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.top_pane_ref,
        style: top_div_style
      }, this.props.top_pane), this.props.show_handle && /*#__PURE__*/_react["default"].createElement(DragHandle, {
        position_dict: position_dict,
        onDrag: this._handleDrag,
        direction: "y",
        iconSize: this.props.dragIconSize,
        dragStart: this._handleDragStart,
        dragEnd: this._handleDragEnd
      }), /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.bottom_pane_ref,
        style: bottom_div_style
      }, this.props.bottom_pane));
    }
  }]);

  return VerticalPanes;
}(_react["default"].Component);

exports.VerticalPanes = VerticalPanes;
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