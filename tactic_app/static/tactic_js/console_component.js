"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _contextMenuTarget = require("@blueprintjs/core/lib/esnext/components/context-menu/contextMenuTarget.js");

var _reactSortableHoc = require("react-sortable-hoc");

var _markdownIt = _interopRequireDefault(require("markdown-it"));

require("markdown-it-latex/dist/index.css");

var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));

var _blueprint_react_widgets = require("./blueprint_react_widgets.js");

var _reactCodemirror = require("./react-codemirror.js");

var _sortable_container = require("./sortable_container.js");

var _key_trap = require("./key_trap.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _utilities_react = require("./utilities_react.js");

var _modal_react = require("./modal_react.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

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

var mdi = (0, _markdownIt["default"])({
  html: true
});
mdi.use(_markdownItLatex["default"]);
var MAX_CONSOLE_WIDTH = 1800;
var BUTTON_CONSUMED_SPACE = 203;

var RawConsoleComponent = /*#__PURE__*/function (_React$Component) {
  _inherits(RawConsoleComponent, _React$Component);

  var _super = _createSuper(RawConsoleComponent);

  function RawConsoleComponent(props) {
    var _this;

    _classCallCheck(this, RawConsoleComponent);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this), "_", RawConsoleComponent.prototype);
    _this.header_ref = /*#__PURE__*/_react["default"].createRef();
    _this.body_ref = /*#__PURE__*/_react["default"].createRef();
    _this.state = {
      console_item_with_focus: null,
      console_item_saved_focus: null,
      console_error_log_text: "",
      show_console_error_log: false
    };
    _this.pseudo_tile_id = null;
    _this.socket_counter = null;
    return _this;
  }

  _createClass(RawConsoleComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "mounted": true
      });
      this.initSocket();

      if (this.props.console_items.length == 0) {
        this._addCodeArea("", false);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.tsocket.counter != this.socket_counter) {
        this.initSocket();
      }
    }
  }, {
    key: "initSocket",
    value: function initSocket() {
      // It is necessary to delete and remake these callbacks
      // If I dont delete I end up with duplicatesSelectList
      // If I just keep the original one then I end up something with a handler linked
      // to an earlier state
      this.props.tsocket.socket.off("console-message");
      this.props.tsocket.socket.on("console-message", this._handleConsoleMessage);
      this.socket_counter = this.props.tsocket.counter;
    }
  }, {
    key: "_createTextEntry",
    value: function _createTextEntry(unique_id, summary_text) {
      return {
        unique_id: unique_id,
        type: "text",
        am_shrunk: false,
        summary_text: summary_text,
        console_text: "",
        show_markdown: false
      };
    }
  }, {
    key: "addConsoleText",
    value: function addConsoleText(the_text) {
      var self = this;
      (0, _communication_react.postWithCallback)("host", "print_text_area_to_console", {
        "console_text": the_text,
        "user_id": window.user_id,
        "main_id": window.main_id
      }, function (data) {
        if (!data.success) {
          (0, _toaster.doFlash)(data);
        }
      });
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      this.addConsoleText("");
    }
  }, {
    key: "_insertTextInCell",
    value: function _insertTextInCell(the_text) {
      var unique_id = this.state.console_item_saved_focus;
      var entry = this.get_console_item_entry(unique_id);

      this._setConsoleItemValue(unique_id, "console_text", entry.console_text + the_text);
    }
  }, {
    key: "_copyCell",
    value: function _copyCell() {
      var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!unique_id) {
        unique_id = this.state.console_item_saved_focus;
        if (!unique_id) return;
      }

      var entry = this.get_console_item_entry(unique_id);
      var result_dict = {
        "main_id": window.main_id,
        "console_item": entry,
        "user_id": window.user_id
      };
      (0, _communication_react.postWithCallback)("host", "copy_console_cell", result_dict);
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      var _this2 = this;

      var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      (0, _communication_react.postWithCallback)("host", "get_copied_console_cell", {
        user_id: window.user_id
      }, function (data) {
        if (!data.success) {
          (0, _toaster.doFlash)(data);
        } else {
          _this2._addConsoleEntry(data.console_item, true, false, unique_id);
        }
      });
    }
  }, {
    key: "_insertResourceLink",
    value: function _insertResourceLink() {
      var _this3 = this;

      if (!this.state.console_item_saved_focus) return;
      var entry = this.get_console_item_entry(this.state.console_item_saved_focus);
      if (!entry || entry.type != "text") return;
      var type_paths = {
        collection: "main_collection",
        project: "main_project",
        tile: "last_saved_view",
        list: "view_list",
        code: "view_code"
      };

      function build_link(type, selected_resource) {
        return "[`".concat(selected_resource, "`](").concat(type_paths[type], "/").concat(selected_resource, ")");
      }

      (0, _modal_react.showSelectResourceDialog)("cancel", "insert link", function (result) {
        _this3._insertTextInCell(build_link(result.type, result.selected_resource));
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode(e) {
      this._addCodeArea("");
    }
  }, {
    key: "_addCodeArea",
    value: function _addCodeArea(the_text) {
      var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var self = this;
      (0, _communication_react.postWithCallback)("host", "print_code_area_to_console", {
        console_text: the_text,
        user_id: window.user_id,
        main_id: window.main_id,
        force_open: force_open
      }, function (data) {
        if (!data.success) {
          (0, _toaster.doFlash)(data);
        }
      });
    }
  }, {
    key: "_resetConsole",
    value: function _resetConsole() {
      var new_console_items = [];

      var _iterator = _createForOfIteratorHelper(this.props.console_items),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;

          if (entry.type != "code") {
            new_console_items.push(entry);
          } else {
            var new_entry = Object.assign({}, entry);
            new_entry.output_text = "";
            new_entry.execution_count = 0;
            new_console_items.push(new_entry);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      this.props.setMainStateValue("console_items", new_console_items);
      (0, _communication_react.postWithCallback)(window.main_id, "clear_console_namespace", {});
    }
  }, {
    key: "_stopAll",
    value: function _stopAll() {
      (0, _communication_react.postWithCallback)(window.main_id, "stop_all_console_code", {});
    }
  }, {
    key: "_clearConsole",
    value: function _clearConsole() {
      var confirm_text = "Are you sure that you want to erase everything in this log?";
      var self = this;
      (0, _modal_react.showConfirmDialogReact)("Clear entire log", confirm_text, "do nothing", "clear", function () {
        self.props.setMainStateValue("console_items", []);
      });
    }
  }, {
    key: "_toggleConsoleLog",
    value: function _toggleConsoleLog() {
      var self = this;

      if (this.state.show_console_error_log) {
        this.setState({
          "show_console_error_log": false
        });
      } else {
        if (self.pseudo_tile_id == null) {
          (0, _communication_react.postWithCallback)(window.main_id, "get_pseudo_tile_id", {}, function (res) {
            var _this4 = this;

            self.pseudo_tile_id = res.pseudo_tile_id;

            if (self.pseudo_tile_id == null) {
              self.setState({
                "console_error_log_text": "pseudo-tile is initializing..."
              }, function () {
                _this4.setState({
                  "show_console_error_log": true
                });
              });
            } else {
              (0, _communication_react.postWithCallback)("host", "get_container_log", {
                "container_id": self.pseudo_tile_id
              }, function (res) {
                var log_text = res.log_text;

                if (log_text == "") {
                  log_text = "Got empty result. The pseudo-tile is probably starting up.";
                }

                self.setState({
                  "console_error_log_text": log_text
                }, function () {
                  self.setState({
                    "show_console_error_log": true
                  });
                });
              });
            }
          });
        } else {
          (0, _communication_react.postWithCallback)("host", "get_container_log", {
            "container_id": self.pseudo_tile_id
          }, function (res) {
            self.setState({
              "console_error_log_text": res.log_text
            }, function () {
              self.setState({
                "show_console_error_log": true
              });
            });
          });
        }
      }
    }
  }, {
    key: "_toggleMainLog",
    value: function _toggleMainLog() {
      var self = this;

      if (this.state.show_console_error_log) {
        this.setState({
          "show_console_error_log": false
        });
      } else {
        (0, _communication_react.postWithCallback)("host", "get_container_log", {
          "container_id": window.main_id
        }, function (res) {
          self.setState({
            "console_error_log_text": res.log_text
          }, function () {
            self.setState({
              "show_console_error_log": true
            });
          });
        });
      }
    }
  }, {
    key: "_setFocusedItem",
    value: function _setFocusedItem(unique_id) {
      if (unique_id == null) {
        this.setState({
          console_item_with_focus: unique_id
        });
      } else {
        this.setState({
          console_item_with_focus: unique_id,
          console_item_saved_focus: unique_id
        });
      }
    }
  }, {
    key: "_zoomConsole",
    value: function _zoomConsole() {
      this.props.setMainStateValue("console_is_zoomed", true);
    }
  }, {
    key: "_unzoomConsole",
    value: function _unzoomConsole() {
      this.props.setMainStateValue("console_is_zoomed", false);
    }
  }, {
    key: "_expandConsole",
    value: function _expandConsole() {
      this.props.setMainStateValue("console_is_shrunk", false);
    }
  }, {
    key: "_shrinkConsole",
    value: function _shrinkConsole() {
      this.props.setMainStateValue("console_is_shrunk", true);

      if (this.props.console_is_zoomed) {
        this._unzoomConsole();
      }
    }
  }, {
    key: "_toggleExports",
    value: function _toggleExports() {
      this.props.setMainStateValue("show_exports_pane", !this.props.show_exports_pane);
    }
  }, {
    key: "_setConsoleItemValue",
    value: function _setConsoleItemValue(unique_id, field, value) {
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var entry = this.get_console_item_entry(unique_id);
      entry[field] = value;
      this.replace_console_item_entry(unique_id, entry, callback);
    }
  }, {
    key: "replace_console_item_entry",
    value: function replace_console_item_entry(unique_id, new_entry) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var new_console_items = _toConsumableArray(this.props.console_items);

      var cindex = this._consoleItemIndex(unique_id);

      new_console_items.splice(cindex, 1, new_entry);
      this.props.setMainStateValue("console_items", new_console_items, callback);
    }
  }, {
    key: "get_console_item_entry",
    value: function get_console_item_entry(unique_id) {
      return Object.assign({}, this.props.console_items[this._consoleItemIndex(unique_id)]);
    }
  }, {
    key: "_consoleItemIndex",
    value: function _consoleItemIndex(unique_id) {
      var counter = 0;

      var _iterator2 = _createForOfIteratorHelper(this.props.console_items),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var entry = _step2.value;

          if (entry.unique_id == unique_id) {
            return counter;
          }

          ++counter;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return -1;
    }
  }, {
    key: "_resortConsoleItems",
    value: function _resortConsoleItems(_ref) {
      var oldIndex = _ref.oldIndex,
          newIndex = _ref.newIndex;

      var old_console_items = _toConsumableArray(this.props.console_items);

      var new_console_items = (0, _utilities_react.arrayMove)(old_console_items, oldIndex, newIndex);
      this.props.setMainStateValue("console_items", new_console_items);
    }
  }, {
    key: "_goToNextCell",
    value: function _goToNextCell(unique_id) {
      var next_index = this._consoleItemIndex(unique_id) + 1;

      while (next_index < this.props.console_items.length) {
        var next_id = this.props.console_items[next_index].unique_id;
        var next_item = this.props.console_items[next_index];

        if (!next_item.am_shrunk && (next_item.type == "code" || next_item.type == "text" && !next_item.show_markdown)) {
          this._setConsoleItemValue(next_id, "set_focus", true);

          return;
        }

        next_index += 1;
      }

      this._addCodeArea("");

      return;
    }
  }, {
    key: "_closeConsoleItem",
    value: function _closeConsoleItem(unique_id) {
      var cindex = this._consoleItemIndex(unique_id);

      var new_console_items = _toConsumableArray(this.props.console_items);

      new_console_items.splice(cindex, 1);
      this.props.setMainStateValue("console_items", new_console_items);
    }
  }, {
    key: "_addConsoleEntry",
    value: function _addConsoleEntry(new_entry) {
      var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var set_focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var unique_id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      new_entry.set_focus = set_focus;
      var insert_index;

      if (unique_id) {
        insert_index = this._consoleItemIndex(unique_id) + 1;
      } else if (this.state.console_item_saved_focus == null) {
        insert_index = this.props.console_items.length;
      } else {
        insert_index = this._consoleItemIndex(this.state.console_item_saved_focus) + 1;
      }

      var new_console_items = _toConsumableArray(this.props.console_items);

      new_console_items.splice(insert_index, 0, new_entry);
      this.props.setMainStateValue("console_items", new_console_items);

      if (force_open) {
        this.props.setMainStateValue("console_is_shrunk", false);
      }
    }
  }, {
    key: "_startSpinner",
    value: function _startSpinner(data) {
      var new_entry = this.get_console_item_entry(data.console_id);
      new_entry.running = true;
      this.replace_console_item_entry(data.console_id, new_entry);
    }
  }, {
    key: "_stopConsoleSpinner",
    value: function _stopConsoleSpinner(data) {
      var new_entry = this.get_console_item_entry(data.console_id);
      new_entry.show_spinner = false;
      new_entry.running = false;
      this.replace_console_item_entry(data.console_id, new_entry);
    }
  }, {
    key: "_appendConsoleItemOutput",
    value: function _appendConsoleItemOutput(data) {
      var current = this.get_console_item_entry(data.console_id).output_text;

      if (current != "") {
        current += "<br>";
      }

      this._setConsoleItemValue(data.console_id, "output_text", current + data.message);
    }
  }, {
    key: "_handleConsoleMessage",
    value: function _handleConsoleMessage(data) {
      var self = this;
      var handlerDict = {
        consoleLog: function consoleLog(data) {
          return self._addConsoleEntry(data.message, data.force_open);
        },
        stopConsoleSpinner: self._stopConsoleSpinner,
        consoleCodePrint: this._appendConsoleItemOutput,
        consoleCodeRun: this._startSpinner
      };
      handlerDict[data.console_message](data);
    }
  }, {
    key: "_bodyHeight",
    value: function _bodyHeight() {
      if (this.state.mounted) {
        return this.props.console_available_height - $(this.header_ref.current).outerHeight() - 2;
      } else {
        return this.props.console_available_height - 75;
      }
    }
  }, {
    key: "_bodyWidth",
    value: function _bodyWidth() {
      if (this.props.console_available_width > MAX_CONSOLE_WIDTH) {
        return MAX_CONSOLE_WIDTH;
      } else {
        return this.props.console_available_width;
      }
    }
  }, {
    key: "renderContextMenu",
    value: function renderContextMenu() {
      var _this5 = this;

      // return a single element, or nothing to use default browser behavior
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: function onClick() {
          _this5._pasteCell();
        },
        text: "Paste Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.Menu.Divider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "reset",
        onClick: this._resetConsole,
        intent: "warning",
        text: "Clear output and reset"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._clearConsole,
        intent: "danger",
        text: "Erase everything"
      }));
    }
  }, {
    key: "_glif_text",
    value: function _glif_text(show_glif_text, txt) {
      if (show_glif_text) {
        return txt;
      }

      return null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var gbstyle = {
        marginLeft: 1,
        marginTop: 2
      };
      var console_class = this.props.console_is_shrunk ? "am-shrunk" : "not-shrunk";

      if (this.props.console_is_zoomed) {
        console_class = "am-zoomed";
      }

      var outer_style = Object.assign({}, this.props.style);
      outer_style.width = this._bodyWidth();
      var show_glif_text = outer_style.width > 800;
      var header_style = {};

      if (!this.props.shrinkable) {
        header_style["paddingLeft"] = 10;
      }

      return /*#__PURE__*/_react["default"].createElement(_core.Card, {
        id: "console-panel",
        className: console_class,
        elevation: 2,
        style: outer_style
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-column justify-content-around"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        id: "console-heading",
        ref: this.header_ref,
        style: header_style,
        className: "d-flex flex-row justify-content-between"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        id: "console-header-left",
        className: "d-flex flex-row"
      }, this.props.console_is_shrunk && this.props.shrinkable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._expandConsole,
        style: {
          marginLeft: 2
        },
        icon: "chevron-right"
      }), !this.props.console_is_shrunk && this.props.shrinkable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._shrinkConsole,
        style: {
          marginLeft: 2
        },
        icon: "chevron-down"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        extra_glyph_text: this._glif_text(show_glif_text, "text"),
        style: gbstyle,
        intent: "primary",
        tooltip: "Add new text area",
        handleClick: this._addBlankText,
        icon: "new-text-box"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        extra_glyph_text: this._glif_text(show_glif_text, "code"),
        handleClick: this._addBlankCode,
        tooltip: "Add new code area",
        intent: "primary",
        style: gbstyle,
        icon: "code"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        extra_glyph_text: this._glif_text(show_glif_text, "link"),
        handleClick: this._insertResourceLink,
        tooltip: "Insert a resource link",
        intent: "primary",
        style: gbstyle,
        icon: "link"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        extra_glyph_text: this._glif_text(show_glif_text, "copy"),
        handleClick: function handleClick() {
          _this6._copyCell();
        },
        tooltip: "Copy cell",
        intent: "primary",
        style: gbstyle,
        icon: "duplicate"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        extra_glyph_text: this._glif_text(show_glif_text, "paste"),
        handleClick: function handleClick() {
          _this6._pasteCell();
        },
        tooltip: "Paste cell",
        intent: "primary",
        style: gbstyle,
        icon: "clipboard"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._resetConsole,
        style: gbstyle,
        tooltip: "Clear all output and reset namespace",
        intent: "warning",
        extra_glyph_text: this._glif_text(show_glif_text, "reset"),
        icon: "reset"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._stopAll,
        style: gbstyle,
        tooltip: "Stop all",
        intent: "warning",
        extra_glyph_text: this._glif_text(show_glif_text, "stop"),
        icon: "stop"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        extra_glyph_text: this._glif_text(show_glif_text, "clear"),
        style: gbstyle,
        tooltip: "Totally erase everything",
        handleClick: this._clearConsole,
        intent: "danger",
        icon: "trash"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        extra_glyph_text: this._glif_text(show_glif_text, "log"),
        style: gbstyle,
        tooltip: "Show container log for the log",
        handleClick: this._toggleConsoleLog,
        icon: "console"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        extra_glyph_text: this._glif_text(show_glif_text, "main"),
        tooltip: "Show container log for the main project container",
        style: gbstyle,
        handleClick: this._toggleMainLog,
        icon: "console"
      })), /*#__PURE__*/_react["default"].createElement("div", {
        id: "console-header-right",
        className: "d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        extra_glyph_text: this._glif_text(show_glif_text, "exports"),
        tooltip: "Show export browser",
        small: true,
        className: "show-exports-but",
        style: {
          marginRight: 5,
          marginTop: 2
        },
        handleClick: this._toggleExports,
        icon: "variable"
      }), !this.props.console_is_zoomed && this.props.zoomable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._zoomConsole,
        icon: "maximize"
      }), this.props.console_is_zoomed && this.props.zoomable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._unzoomConsole,
        icon: "minimize"
      })))), !this.props.console_is_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
        id: "console",
        ref: this.body_ref,
        className: "contingent-scroll",
        style: {
          height: this._bodyHeight()
        }
      }, this.state.show_console_error_log && /*#__PURE__*/_react["default"].createElement("pre", null, this.state.console_error_log_text), !this.state.show_console_error_log && /*#__PURE__*/_react["default"].createElement(_sortable_container.SortableComponent, {
        id: "console-items-div",
        ElementComponent: SSuperItem,
        key_field_name: "unique_id",
        item_list: this.props.console_items,
        dark_theme: this.props.dark_theme,
        handle: ".console-sorter",
        onSortStart: function onSortStart(_, event) {
          return event.preventDefault();
        } // This prevents Safari weirdness
        ,
        onSortEnd: this._resortConsoleItems,
        setConsoleItemValue: this._setConsoleItemValue,
        console_available_width: this._bodyWidth(),
        execution_count: 0,
        handleDelete: this._closeConsoleItem,
        goToNextCell: this._goToNextCell,
        setFocus: this._setFocusedItem,
        addNewTextItem: this._addBlankText,
        addNewCodeItem: this._addBlankCode,
        copyCell: this._copyCell,
        pasteCell: this._pasteCell,
        insertResourceLink: this._insertResourceLink,
        useDragHandle: true,
        axis: "y"
      }), /*#__PURE__*/_react["default"].createElement("div", {
        id: "padding-div",
        style: {
          height: 500
        }
      })));
    }
  }]);

  return RawConsoleComponent;
}(_react["default"].Component);

RawConsoleComponent.propTypes = {
  console_items: _propTypes["default"].array,
  console_is_shrunk: _propTypes["default"].bool,
  show_exports_pane: _propTypes["default"].bool,
  setMainStateValue: _propTypes["default"].func,
  console_available_height: _propTypes["default"].number,
  console_available_width: _propTypes["default"].number,
  tsocket: _propTypes["default"].object,
  style: _propTypes["default"].object,
  shrinkable: _propTypes["default"].bool,
  zoomable: _propTypes["default"].bool,
  dark_theme: _propTypes["default"].bool
};
RawConsoleComponent.defaultProps = {
  style: {},
  shrinkable: true,
  zoomable: true,
  dark_theme: false
};
var ConsoleComponent = (0, _contextMenuTarget.ContextMenuTarget)(RawConsoleComponent);
exports.ConsoleComponent = ConsoleComponent;

var RawSortHandle = /*#__PURE__*/function (_React$Component2) {
  _inherits(RawSortHandle, _React$Component2);

  var _super2 = _createSuper(RawSortHandle);

  function RawSortHandle() {
    _classCallCheck(this, RawSortHandle);

    return _super2.apply(this, arguments);
  }

  _createClass(RawSortHandle, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "drag-handle-vertical",
        style: {
          marginLeft: 0,
          marginRight: 6
        },
        iconSize: 20,
        className: "console-sorter"
      });
    }
  }]);

  return RawSortHandle;
}(_react["default"].Component);

var Shandle = (0, _reactSortableHoc.SortableHandle)(RawSortHandle);

var SuperItem = /*#__PURE__*/function (_React$Component3) {
  _inherits(SuperItem, _React$Component3);

  var _super3 = _createSuper(SuperItem);

  function SuperItem() {
    _classCallCheck(this, SuperItem);

    return _super3.apply(this, arguments);
  }

  _createClass(SuperItem, [{
    key: "render",
    value: function render() {
      if (this.props.type == "text") {
        return /*#__PURE__*/_react["default"].createElement(ConsoleTextItem, this.props);
      } else if (this.props.type == "code") {
        return /*#__PURE__*/_react["default"].createElement(ConsoleCodeItem, this.props);
      } else if (this.props.type == "fixed") {
        return /*#__PURE__*/_react["default"].createElement(LogItem, this.props);
      }

      return null;
    }
  }]);

  return SuperItem;
}(_react["default"].Component);

var SSuperItem = (0, _reactSortableHoc.SortableElement)(SuperItem);

var RawLogItem = /*#__PURE__*/function (_React$Component4) {
  _inherits(RawLogItem, _React$Component4);

  var _super4 = _createSuper(RawLogItem);

  function RawLogItem(props) {
    var _this7;

    _classCallCheck(this, RawLogItem);

    _this7 = _super4.call(this, props);
    _this7.ce_summary0ref = /*#__PURE__*/_react["default"].createRef();
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this7), "_", RawLogItem.prototype);
    _this7.update_props = ["is_error", "am_shrunk", "summary_text", "console_text", "console_available_width"];
    _this7.update_state_vars = [];
    _this7.state = {
      selected: false
    };
    _this7.last_output_text = "";
    return _this7;
  }

  _createClass(RawLogItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _iterator3 = _createForOfIteratorHelper(this.update_props),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var prop = _step3.value;

          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.executeEmbeddedScripts();
      this.makeTablesSortable();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.executeEmbeddedScripts();
      this.makeTablesSortable();
    }
  }, {
    key: "_toggleShrink",
    value: function _toggleShrink() {
      this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }
  }, {
    key: "_deleteMe",
    value: function _deleteMe() {
      this.props.handleDelete(this.props.unique_id);
    }
  }, {
    key: "_handleSummaryTextChange",
    value: function _handleSummaryTextChange(value) {
      this.props.setConsoleItemValue(this.props.unique_id, "summary_text", value);
    }
  }, {
    key: "executeEmbeddedScripts",
    value: function executeEmbeddedScripts() {
      if (this.props.output_text != this.last_output_text) {
        // to avoid doubles of bokeh images
        this.last_output_text = this.props.output_text;
        var scripts = $("#" + this.props.unique_id + " .log-code-output script").toArray(); // $("#" + this.props.unique_id + " .bk-root").html(""); // This is a kluge to deal with bokeh double images

        var _iterator4 = _createForOfIteratorHelper(scripts),
            _step4;

        try {
          for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
            var script = _step4.value;

            try {
              window.eval(script.text);
            } catch (e) {}
          }
        } catch (err) {
          _iterator4.e(err);
        } finally {
          _iterator4.f();
        }
      }
    }
  }, {
    key: "makeTablesSortable",
    value: function makeTablesSortable() {
      var tables = $("#" + this.props.unique_id + " table.sortable").toArray();

      var _iterator5 = _createForOfIteratorHelper(tables),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var table = _step5.value;
          sorttable.makeSortable(table);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
  }, {
    key: "_copyMe",
    value: function _copyMe() {
      this.props.copyCell(this.props.unique_id);
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      this.props.pasteCell(this.props.unique_id);
    }
  }, {
    key: "renderContextMenu",
    value: function renderContextMenu() {
      // return a single element, or nothing to use default browser behavior
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "duplicate",
        onClick: this._copyMe,
        text: "Copy Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: this._pasteCell,
        text: "Paste Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.Menu.Divider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteMe,
        intent: "danger",
        text: "Delete Cell"
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var converted_dict = {
        __html: this.props.console_text
      };
      var panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";

      if (this.props.is_error) {
        panel_class += " error-log-panel";
      }

      var body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: panel_class + " d-flex flex-row",
        id: this.props.unique_id,
        style: {
          marginBottom: 10
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div shrink-expand-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(Shandle, null), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-down",
        handleClick: this._toggleShrink
      }), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-right",
        style: {
          marginTop: 5
        },
        handleClick: this._toggleShrink
      })), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
        value: this.props.summary_text,
        onChange: this._handleSummaryTextChange,
        className: "log-panel-summary"
      }), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-column"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "log-panel-body d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          marginTop: 10,
          marginLeft: 30,
          padding: 8,
          width: body_width,
          border: "1px solid #c7c7c7"
        },
        dangerouslySetInnerHTML: converted_dict
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._deleteMe,
        tooltip: "Delete this item",
        style: {
          marginLeft: 10,
          marginRight: 66
        },
        intent: "danger",
        icon: "trash"
      })))));
    }
  }]);

  return RawLogItem;
}(_react["default"].Component);

RawLogItem.propTypes = {
  unique_id: _propTypes["default"].string,
  is_error: _propTypes["default"].bool,
  am_shrunk: _propTypes["default"].bool,
  summary_text: _propTypes["default"].string,
  console_text: _propTypes["default"].string,
  setConsoleItemValue: _propTypes["default"].func,
  handleDelete: _propTypes["default"].func,
  console_available_width: _propTypes["default"].number
};
var LogItem = (0, _contextMenuTarget.ContextMenuTarget)(RawLogItem);

var RawConsoleCodeItem = /*#__PURE__*/function (_React$Component5) {
  _inherits(RawConsoleCodeItem, _React$Component5);

  var _super5 = _createSuper(RawConsoleCodeItem);

  function RawConsoleCodeItem(props) {
    var _this8;

    _classCallCheck(this, RawConsoleCodeItem);

    _this8 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this8), "_", RawConsoleCodeItem.prototype);
    _this8.cmobject = null;
    _this8.update_props = ["am_shrunk", "set_focus", "summary_text", "console_text", "show_spinner", "execution_count", "output_text", "console_available_width", "dark_theme"];
    _this8.update_state_vars = [];
    _this8.state = {};
    _this8.last_output_text = "";
    return _this8;
  }

  _createClass(RawConsoleCodeItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _iterator6 = _createForOfIteratorHelper(this.update_props),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var prop = _step6.value;

          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      return false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this9 = this;

      if (this.props.set_focus) {
        if (this.cmobject != null) {
          this.cmobject.focus();
          this.cm_object.setCursor({
            line: 0,
            ch: 0
          });
        }

        this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false);
      }

      var self = this;

      if (this.cmobject != null) {
        this.cmobject.on("focus", function () {
          self.props.setFocus(_this9.props.unique_id);
        });
        this.cmobject.on("blur", function () {
          self.props.setFocus(null);
        });
      }

      this.executeEmbeddedScripts();
      this.makeTablesSortable();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.executeEmbeddedScripts();
      this.makeTablesSortable();

      if (this.props.set_focus) {
        if (this.cmobject != null) {
          this.cmobject.focus();
          this.cmobject.setCursor({
            line: 0,
            ch: 0
          });
        }

        this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false);
      }
    }
  }, {
    key: "executeEmbeddedScripts",
    value: function executeEmbeddedScripts() {
      if (this.props.output_text != this.last_output_text) {
        // to avoid doubles of bokeh images
        this.last_output_text = this.props.output_text;
        var scripts = $("#" + this.props.unique_id + " .log-code-output script").toArray(); // $("#" + this.props.unique_id + " .bk-root").html(""); // This is a kluge to deal with bokeh double images

        var _iterator7 = _createForOfIteratorHelper(scripts),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var script = _step7.value;

            try {
              window.eval(script.text);
            } catch (e) {}
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      }
    }
  }, {
    key: "makeTablesSortable",
    value: function makeTablesSortable() {
      var tables = $("#" + this.props.unique_id + " table.sortable").toArray();

      var _iterator8 = _createForOfIteratorHelper(tables),
          _step8;

      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var table = _step8.value;
          sorttable.makeSortable(table);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }
  }, {
    key: "_runMe",
    value: function _runMe() {
      var _this10 = this;

      var go_to_next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      this._clearOutput(function () {
        _this10._showMySpinner();

        var self = _this10;
        (0, _communication_react.postWithCallback)(main_id, "exec_console_code", {
          "the_code": _this10.props.console_text,
          "console_id": _this10.props.unique_id
        }, function () {
          if (go_to_next) {
            self.props.goToNextCell(self.props.unique_id);
          }
        });
      });
    }
  }, {
    key: "_stopMe",
    value: function _stopMe() {
      this._stopMySpinner();

      (0, _communication_react.postWithCallback)(main_id, "stop_console_code", {
        "console_id": this.props.unique_id
      });
    }
  }, {
    key: "_showMySpinner",
    value: function _showMySpinner() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.setConsoleItemValue(this.props.unique_id, "show_spinner", true, callback);
    }
  }, {
    key: "_stopMySpinner",
    value: function _stopMySpinner() {
      this.props.setConsoleItemValue(this.props.unique_id, "show_spinner", false);
    }
  }, {
    key: "_handleChange",
    value: function _handleChange(new_code) {
      this.props.setConsoleItemValue(this.props.unique_id, "console_text", new_code);
    }
  }, {
    key: "_handleSummaryTextChange",
    value: function _handleSummaryTextChange(value) {
      this.props.setConsoleItemValue(this.props.unique_id, "summary_text", value);
    }
  }, {
    key: "_toggleShrink",
    value: function _toggleShrink() {
      this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }
  }, {
    key: "_deleteMe",
    value: function _deleteMe() {
      if (this.props.show_spinner) {
        this._stopMe();
      }

      this.props.handleDelete(this.props.unique_id);
    }
  }, {
    key: "_clearOutput",
    value: function _clearOutput() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.setConsoleItemValue(this.props.unique_id, "output_text", "", callback);
    }
  }, {
    key: "_extraKeys",
    value: function _extraKeys() {
      var self = this;
      return {
        'Ctrl-Enter': function CtrlEnter() {
          return self._runMe(true);
        },
        'Cmd-Enter': function CmdEnter() {
          return self._runMe(true);
        },
        'Ctrl-Alt-C': self.props.addNewCodeItem,
        'Ctrl-Alt-T': self.props.addNewTextItem
      };
    }
  }, {
    key: "_setCMObject",
    value: function _setCMObject(cmobject) {
      this.cmobject = cmobject;
    }
  }, {
    key: "_getFirstLine",
    value: function _getFirstLine() {
      var re = /^(.*)$/m;

      if (this.props.console_text == "") {
        return "empty text cell";
      } else {
        return re.exec(this.props.console_text)[0];
      }
    }
  }, {
    key: "_copyMe",
    value: function _copyMe() {
      this.props.copyCell(this.props.unique_id);
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      this.props.pasteCell(this.props.unique_id);
    }
  }, {
    key: "renderContextMenu",
    value: function renderContextMenu() {
      var _this11 = this;

      // return a single element, or nothing to use default browser behavior
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, !this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "play",
        intent: "success",
        onClick: this._runMe,
        text: "Run Cell"
      }), this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "stop",
        intent: "danger",
        onClick: this._stopMe,
        text: "Stop Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.Menu.Divider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "duplicate",
        onClick: this._copyMe,
        text: "Copy Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: this._pasteCell,
        text: "Paste Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.Menu.Divider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteMe,
        intent: "danger",
        text: "Delete Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clean",
        intent: "warning",
        onClick: function onClick() {
          _this11._clearOutput();
        },
        text: "Clear Output"
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this12 = this;

      var panel_style = this.props.am_shrunk ? "log-panel log-panel-invisible" : "log-panel log-panel-visible";
      var output_dict = {
        __html: this.props.output_text
      };
      var spinner_val = this.props.running ? null : 0;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: panel_style + " d-flex flex-row",
        id: this.props.unique_id
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div shrink-expand-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(Shandle, null), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-down",
        handleClick: this._toggleShrink
      }), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-right",
        style: {
          marginTop: 5
        },
        handleClick: this._toggleShrink
      })), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
        className: "log-panel-summary code-panel-summary"
      }, this._getFirstLine()), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-column",
        style: {
          width: "100%"
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "log-panel-body d-flex flex-row console-code"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex pr-1"
      }, !this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._runMe,
        intent: "success",
        tooltip: "Execute this item",
        icon: "play"
      }), this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._stopMe,
        intent: "danger",
        tooltip: "Stop this item",
        icon: "stop"
      })), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        handleChange: this._handleChange,
        code_content: this.props.console_text,
        setCMObject: this._setCMObject,
        dark_theme: this.props.dark_theme,
        extraKeys: this._extraKeys(),
        code_container_width: this.props.console_available_width - BUTTON_CONSUMED_SPACE,
        saveMe: null
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._deleteMe,
        intent: "danger",
        tooltip: "Delete this item",
        style: {
          marginLeft: 10,
          marginRight: 0
        },
        icon: "trash"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: function handleClick() {
          _this12._clearOutput();
        },
        intent: "warning",
        tooltip: "Clear this item's output",
        style: {
          marginLeft: 10,
          marginRight: 0
        },
        icon: "clean"
      }))), !this.props.show_spinner && /*#__PURE__*/_react["default"].createElement("div", {
        className: "execution-counter"
      }, "[", String(this.props.execution_count), "]"), this.props.show_spinner && /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          marginTop: 10,
          marginRight: 22
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
        size: 13,
        value: spinner_val
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "log-code-output",
        dangerouslySetInnerHTML: output_dict
      }))));
    }
  }]);

  return RawConsoleCodeItem;
}(_react["default"].Component);

RawConsoleCodeItem.propTypes = {
  unique_id: _propTypes["default"].string,
  am_shrunk: _propTypes["default"].bool,
  set_focus: _propTypes["default"].bool,
  show_spinner: _propTypes["default"].bool,
  running: _propTypes["default"].bool,
  summary_text: _propTypes["default"].string,
  console_text: _propTypes["default"].string,
  output_text: _propTypes["default"].string,
  dark_theme: _propTypes["default"].bool,
  execution_count: _propTypes["default"].number,
  console_available_width: _propTypes["default"].number,
  setConsoleItemValue: _propTypes["default"].func,
  handleDelete: _propTypes["default"].func,
  addNewTextItem: _propTypes["default"].func,
  addNewCodeItem: _propTypes["default"].func,
  goToNextCell: _propTypes["default"].func,
  setFocus: _propTypes["default"].func
};
var ConsoleCodeItem = (0, _contextMenuTarget.ContextMenuTarget)(RawConsoleCodeItem);

var RawConsoleTextItem = /*#__PURE__*/function (_React$Component6) {
  _inherits(RawConsoleTextItem, _React$Component6);

  var _super6 = _createSuper(RawConsoleTextItem);

  function RawConsoleTextItem(props) {
    var _this13;

    _classCallCheck(this, RawConsoleTextItem);

    _this13 = _super6.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this13), "_", RawConsoleTextItem.prototype);
    _this13.ce_summary_ref = /*#__PURE__*/_react["default"].createRef();
    _this13.update_props = ["am_shrunk", "set_focus", "show_markdown", "summary_text", "console_text", "console_available_width"];
    _this13.update_state_vars = ["ce_ref"];
    _this13.state = {
      ce_ref: null
    };
    return _this13;
  }

  _createClass(RawConsoleTextItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _iterator9 = _createForOfIteratorHelper(this.update_props),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var prop = _step9.value;

          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      var _iterator10 = _createForOfIteratorHelper(this.update_state_vars),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var state_var = _step10.value;

          if (nextState[state_var] != this.state[state_var]) {
            return true;
          }
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }

      return false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.set_focus) {
        if (this.props.show_markdown) {
          this._hideMarkdown();
        } else if (this.state.ce_ref) {
          $(this.state.ce_ref).focus();
          this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false);
        }
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.set_focus) {
        if (this.props.show_markdown) {
          this._hideMarkdown();
        } else if (this.state.ce_ref) {
          $(this.state.ce_ref).focus();
        }

        this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false);
      }
    }
  }, {
    key: "hasOnlyWhitespace",
    get: function get() {
      return !this.props.console_text.trim().length;
    }
  }, {
    key: "_showMarkdown",
    value: function _showMarkdown() {
      if (!this.hasOnlyWhitespace) {
        this.props.setConsoleItemValue(this.props.unique_id, "show_markdown", true);
      }
    }
  }, {
    key: "_toggleMarkdown",
    value: function _toggleMarkdown() {
      if (this.props.show_markdown) {
        this._hideMarkdown();
      } else {
        this._showMarkdown();
      }
    }
  }, {
    key: "_hideMarkdown",
    value: function _hideMarkdown() {
      this.props.setConsoleItemValue(this.props.unique_id, "show_markdown", false);
    }
  }, {
    key: "_handleChange",
    value: function _handleChange(event) {
      this.props.setConsoleItemValue(this.props.unique_id, "console_text", event.target.value);
    }
  }, {
    key: "_handleSummaryTextChange",
    value: function _handleSummaryTextChange(value) {
      this.props.setConsoleItemValue(this.props.unique_id, "summary_text", value);
    }
  }, {
    key: "_toggleShrink",
    value: function _toggleShrink() {
      this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }
  }, {
    key: "_deleteMe",
    value: function _deleteMe() {
      this.props.handleDelete(this.props.unique_id);
    }
  }, {
    key: "_handleKeyDown",
    value: function _handleKeyDown(event) {
      if (event.key == "Tab") {
        this.props.goToNextCell(this.props.unique_id);
        event.preventDefault();
      }
    }
  }, {
    key: "_gotEnter",
    value: function _gotEnter() {
      this.props.goToNextCell(this.props.unique_id);

      this._showMarkdown();
    }
  }, {
    key: "_notesRefHandler",
    value: function _notesRefHandler(the_ref) {
      this.setState({
        ce_ref: the_ref
      });
    }
  }, {
    key: "_getFirstLine",
    value: function _getFirstLine() {
      var re = /^(.*)$/m;

      if (this.props.console_text == "") {
        return "empty text cell";
      } else {
        return re.exec(this.props.console_text)[0];
      }
    }
  }, {
    key: "_copyMe",
    value: function _copyMe() {
      this.props.copyCell(this.props.unique_id);
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      this.props.pasteCell(this.props.unique_id);
    }
  }, {
    key: "renderContextMenu",
    value: function renderContextMenu() {
      // return a single element, or nothing to use default browser behavior
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "paragraph",
        intent: "success",
        onClick: this._showMarkdown,
        text: "Show Markdown"
      }), /*#__PURE__*/_react["default"].createElement(_core.Menu.Divider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "link",
        onClick: this.props.insertResourceLink,
        text: "Insert ResourceLink"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "duplicate",
        onClick: this._copyMe,
        text: "Copy Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: this._pasteCell,
        text: "Paste Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.Menu.Divider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteMe,
        intent: "danger",
        text: "Delete Cell"
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var _this14 = this;

      var really_show_markdown = this.hasOnlyWhitespace ? false : this.props.show_markdown;
      var converted_markdown;

      if (really_show_markdown) {
        // converted_markdown = this.converter.makeHtml(this.props.console_text);
        converted_markdown = mdi.render(this.props.console_text);
      }

      var key_bindings = [[["ctrl+enter", "command+enter"], this._gotEnter]];
      var converted_dict = {
        __html: converted_markdown
      };
      var panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible text-log-item" : "log-panel log-panel-visible text-log-item";
      var gbstyle = {
        marginLeft: 1
      };
      var body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: panel_class + " d-flex flex-row",
        id: this.props.unique_id,
        style: {
          marginBottom: 10
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div shrink-expand-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(Shandle, null), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-down",
        handleClick: this._toggleShrink
      }), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-right",
        style: {
          marginTop: 5
        },
        handleClick: this._toggleShrink
      })), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
        className: "log-panel-summary"
      }, this._getFirstLine()), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-column",
        style: {
          width: "100%"
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "log-panel-body text-box d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-inline-flex pr-1"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._toggleMarkdown,
        intent: "success",
        tooltip: "Convert to/from markdown",
        icon: "paragraph"
      })), !really_show_markdown && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
        value: this.props.console_text,
        onChange: this._handleChange,
        onKeyDown: this._handleKeyDown,
        growVertically: true,
        onFocus: function onFocus() {
          return _this14.props.setFocus(_this14.props.unique_id);
        },
        onBlur: function onBlur() {
          return _this14.props.setFocus(null);
        },
        disabled: false,
        className: "console-text contingent-scroll",
        style: {
          width: body_width
        },
        inputRef: this._notesRefHandler
      }), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
        target_ref: this.state.ce_ref,
        bindings: key_bindings
      })), really_show_markdown && /*#__PURE__*/_react["default"].createElement("div", {
        className: "text-panel-output",
        onDoubleClick: this._hideMarkdown,
        style: {
          width: body_width,
          padding: 9
        },
        dangerouslySetInnerHTML: converted_dict
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._deleteMe,
        intent: "danger",
        tooltip: "Delete this item",
        style: {
          marginLeft: 10,
          marginRight: 66
        },
        icon: "trash"
      })))));
    }
  }]);

  return RawConsoleTextItem;
}(_react["default"].Component);

RawConsoleTextItem.propTypes = {
  unique_id: _propTypes["default"].string,
  am_shrunk: _propTypes["default"].bool,
  set_focus: _propTypes["default"].bool,
  show_markdown: _propTypes["default"].bool,
  summary_text: _propTypes["default"].string,
  console_text: _propTypes["default"].string,
  console_available_width: _propTypes["default"].number,
  setConsoleItemValue: _propTypes["default"].func,
  handleDelete: _propTypes["default"].func,
  goToNextCell: _propTypes["default"].func,
  tsocket: _propTypes["default"].object,
  setFocus: _propTypes["default"].func
};
var ConsoleTextItem = (0, _contextMenuTarget.ContextMenuTarget)(RawConsoleTextItem);