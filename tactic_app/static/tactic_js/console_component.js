"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

require("codemirror/mode/markdown/markdown.js");

var _core = require("@blueprintjs/core");

var _lodash = _interopRequireDefault(require("lodash"));

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

var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");

var _library_pane = require("./library_pane.js");

var _menu_utilities = require("./menu_utilities.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

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
var BUTTON_CONSUMED_SPACE = 208;

var RawConsoleComponent = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(RawConsoleComponent, _React$PureComponent);

  var _super = _createSuper(RawConsoleComponent);

  function RawConsoleComponent(props, context) {
    var _this;

    _classCallCheck(this, RawConsoleComponent);

    _this = _super.call(this, props, context);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this), "_", RawConsoleComponent.prototype);
    _this.header_ref = /*#__PURE__*/_react["default"].createRef();
    _this.body_ref = /*#__PURE__*/_react["default"].createRef();
    _this.state = {
      console_item_with_focus: null,
      console_item_saved_focus: null,
      console_error_log_text: "",
      show_console_error_log: false,
      currently_selected_item: null,
      search_string: null,
      filter_console_items: false,
      search_helper_text: null
    };
    _this.pseudo_tile_id = null;
    _this.socket_counter = null;

    _this.initSocket();

    return _this;
  }

  _createClass(RawConsoleComponent, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      var self = this;
      this.setState({
        "mounted": true
      }, function () {
        if (_this2.props.console_items.length == 0) {
          self._addCodeArea("", false);
        }

        self._clear_all_selected_items();
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.state.show_console_error_log) {
        if (this.body_ref && this.body_ref.current) {
          var el = this.body_ref.current;
          this.body_ref.current.scrollTop = el.scrollHeight - 500 - el.offsetHeight + 45;
        }
      }
    }
  }, {
    key: "initSocket",
    value: function initSocket() {
      var self = this;

      function _handleConsoleMessage(data) {
        if (data.main_id == self.props.main_id) {
          var handlerDict = {
            consoleLog: function consoleLog(data) {
              return self._addConsoleEntry(data.message, data.force_open, true);
            },
            createLink: function createLink(data) {
              var unique_id = data.message.unique_id;

              self._addConsoleEntry(data.message, data.force_open, null, null, function () {
                self._insertLinkInItem(unique_id);
              });
            },
            stopConsoleSpinner: function stopConsoleSpinner(data) {
              var execution_count = "execution_count" in data ? data.execution_count : null;

              self._stopConsoleSpinner(data.console_id, execution_count);
            },
            consoleCodePrint: function consoleCodePrint(data) {
              return self._appendConsoleItemOutput(data);
            },
            consoleCodeRun: function consoleCodeRun(data) {
              return self._startSpinner(data.console_id);
            },
            updateLog: function updateLog(data) {
              return self._addToLog(data.new_line);
            }
          };
          handlerDict[data.console_message](data);
        }
      } // We have to careful to get the very same instance of the listerner function
      // That requires storing it outside of this component since the console can be unmounted


      this.props.tsocket.attachListener("console-message", _handleConsoleMessage);
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
    key: "_addConsoleText",
    value: function _addConsoleText(the_text) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      (0, _communication_react.postWithCallback)("host", "print_text_area_to_console", {
        "console_text": the_text,
        "user_id": window.user_id,
        "main_id": this.props.main_id
      }, function (data) {
        if (!data.success) {
          (0, _toaster.doFlash)(data);
        } else if (callback) {
          callback();
        }
      }, null, this.props.main_id);
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      if (!this.props.am_selected) {
        return;
      }

      this._addConsoleText("");
    }
  }, {
    key: "_insertTextInCell",
    value: function _insertTextInCell(the_text) {
      var unique_id = this.state.currently_selected_item;
      var entry = this.get_console_item_entry(unique_id);
      var replace_dicts = [];
      replace_dicts.push({
        unique_id: unique_id,
        field: "console_text",
        value: entry.console_text + the_text
      });
      replace_dicts.push({
        unique_id: unique_id,
        field: "force_sync_to_prop",
        value: true
      });

      this._multiple_console_item_updates(replace_dicts);
    }
  }, {
    key: "_copyCell",
    value: function _copyCell() {
      var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!unique_id) {
        unique_id = this.state.currently_selected_item;

        if (!unique_id) {
          return;
        }
      }

      var entry = this.get_console_item_entry(unique_id);
      var result_dict = {
        "main_id": this.props.main_id,
        "console_item": entry,
        "user_id": window.user_id
      };
      (0, _communication_react.postWithCallback)("host", "copy_console_cell", result_dict, null, null, this.props.main_id);
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      var _this3 = this;

      var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var self = this;
      (0, _communication_react.postWithCallback)("host", "get_copied_console_cell", {
        user_id: window.user_id
      }, function (data) {
        if (!data.success) {
          (0, _toaster.doFlash)(data);
        } else {
          _this3._addConsoleEntry(data.console_item, true, false, unique_id);
        }
      }, null, self.props.main_id);
    }
  }, {
    key: "_addConsoleTextLink",
    value: function _addConsoleTextLink() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      (0, _communication_react.postWithCallback)("host", "print_link_area_to_console", {
        "user_id": window.user_id,
        "main_id": this.props.main_id
      }, function (data) {
        if (!data.success) {
          (0, _toaster.doFlash)(data);
        } else if (callback) {
          callback();
        }
      }, null, this.props.main_id);
    }
  }, {
    key: "_insertResourceLink",
    value: function _insertResourceLink() {
      if (!this.state.currently_selected_item) {
        this._addConsoleTextLink();

        return;
      }

      var entry = this.get_console_item_entry(this.state.currently_selected_item);

      if (!entry || entry.type != "text") {
        this._addConsoleTextLink();

        return;
      }

      this._insertLinkInItem(this.state.currently_selected_item);
    }
  }, {
    key: "_insertLinkInItem",
    value: function _insertLinkInItem(unique_id) {
      var self = this;
      var entry = this.get_console_item_entry(unique_id);
      (0, _modal_react.showSelectResourceDialog)("cancel", "insert link", function (result) {
        var new_links = "links" in entry ? _toConsumableArray(entry.links) : [];
        new_links.push({
          res_type: result.type,
          res_name: result.selected_resource
        });

        self._setConsoleItemValue(entry.unique_id, "links", new_links);
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode(e) {
      if (!this.props.am_selected) {
        return;
      }

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
        main_id: this.props.main_id,
        force_open: force_open
      }, function (data) {
        if (!data.success) {
          (0, _toaster.doFlash)(data);
        }
      }, null, self.props.main_id);
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
      (0, _communication_react.postWithCallback)(this.props.main_id, "clear_console_namespace", {}, null, null, this.props.main_id);
    }
  }, {
    key: "_stopAll",
    value: function _stopAll() {
      (0, _communication_react.postWithCallback)(this.props.main_id, "stop_all_console_code", {}, null, null, this.props.main_id);
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

        this._stopMainPseudoLogStreaming();
      } else {
        if (self.pseudo_tile_id == null) {
          (0, _communication_react.postWithCallback)(this.props.main_id, "get_pseudo_tile_id", {}, function (res) {
            self.pseudo_tile_id = res.pseudo_tile_id;

            if (self.pseudo_tile_id == null) {
              self.setState({
                "console_error_log_text": "pseudo-tile is initializing..."
              }, function () {
                self.setState({
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

                  self._startPseudoLogStreaming();
                });
              }, null, self.props.main_id);
            }
          }, null, this.props.main_id);
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

              self._startPseudoLogStreaming();
            });
          }, null, this.props.main_id);
        }
      }
    }
  }, {
    key: "_startPseudoLogStreaming",
    value: function _startPseudoLogStreaming() {
      (0, _communication_react.postWithCallback)(this.props.main_id, "StartPseudoLogStreaming", {}, null, null, this.props.main_id);
    }
  }, {
    key: "_toggleMainLog",
    value: function _toggleMainLog() {
      var self = this;

      if (this.state.show_console_error_log) {
        this.setState({
          "show_console_error_log": false
        });

        this._stopMainPseudoLogStreaming();
      } else {
        (0, _communication_react.postWithCallback)("host", "get_container_log", {
          "container_id": this.props.main_id
        }, function (res) {
          self.setState({
            "console_error_log_text": res.log_text
          }, function () {
            self._startMainLogStreaming();

            self.setState({
              "show_console_error_log": true
            });
          });
        }, null, this.props.main_id);
      }
    }
  }, {
    key: "_startMainLogStreaming",
    value: function _startMainLogStreaming() {
      (0, _communication_react.postWithCallback)(this.props.main_id, "StartMainLogStreaming", {}), null, null, this.props.main_id;
    }
  }, {
    key: "_stopMainPseudoLogStreaming",
    value: function _stopMainPseudoLogStreaming() {
      (0, _communication_react.postWithCallback)(this.props.main_id, "StopMainPseudoLogStreaming", {}, null, null, this.props.main_id);
    }
  }, {
    key: "_setFocusedItem",
    value: function _setFocusedItem(unique_id) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (unique_id == null) {
        this.setState({
          console_item_with_focus: unique_id
        }, callback);
      } else {
        this.setState({
          console_item_with_focus: unique_id,
          console_item_saved_focus: unique_id
        }, callback);
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

      var new_console_items = _lodash["default"].cloneDeep(this.props.console_items);

      var cindex = this._consoleItemIndex(unique_id);

      new_console_items.splice(cindex, 1, new_entry);
      this.props.setMainStateValue("console_items", new_console_items, callback);
    }
  }, {
    key: "_multiple_console_item_updates",
    value: function _multiple_console_item_updates(replace_dicts) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var new_console_items = _toConsumableArray(this.props.console_items);

      var _iterator2 = _createForOfIteratorHelper(replace_dicts),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var d = _step2.value;

          var cindex = this._consoleItemIndex(d["unique_id"]);

          new_console_items[cindex][d["field"]] = d["value"];
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      this.props.setMainStateValue("console_items", new_console_items, callback);
    }
  }, {
    key: "_clear_all_selected_items",
    value: function _clear_all_selected_items() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var self = this;

      var new_console_items = _toConsumableArray(this.props.console_items);

      var _iterator3 = _createForOfIteratorHelper(new_console_items),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var item = _step3.value;
          item.am_selected = false;
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      this.setState({
        currently_selected_item: false
      }, function () {
        self.props.setMainStateValue("console_items", new_console_items, callback);
      });
    }
  }, {
    key: "get_console_item_entry",
    value: function get_console_item_entry(unique_id) {
      return _lodash["default"].cloneDeep(this.props.console_items[this._consoleItemIndex(unique_id)]);
    }
  }, {
    key: "_selectConsoleItem",
    value: function _selectConsoleItem(unique_id) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var self = this;
      var replace_dicts = [];

      if (this.state.currently_selected_item) {
        replace_dicts.push({
          unique_id: this.state.currently_selected_item,
          field: "am_selected",
          value: false
        });
        replace_dicts.push({
          unique_id: this.state.currently_selected_item,
          field: "search_string",
          value: null
        });
      }

      replace_dicts.push({
        unique_id: unique_id,
        field: "am_selected",
        value: true
      });
      replace_dicts.push({
        unique_id: unique_id,
        field: "search_string",
        value: this.state.search_string
      });

      this._multiple_console_item_updates(replace_dicts, function () {
        self.setState({
          currently_selected_item: unique_id
        }, callback);
      });
    }
  }, {
    key: "_clearSelectedItem",
    value: function _clearSelectedItem() {
      var self = this;
      var replace_dicts = [];

      if (this.state.currently_selected_item) {
        replace_dicts.push({
          unique_id: this.state.currently_selected_item,
          field: "am_selected",
          value: false
        });
        replace_dicts.push({
          unique_id: this.state.currently_selected_item,
          field: "search_string",
          value: null
        });

        this._multiple_console_item_updates(replace_dicts, function () {
          self.setState({
            currently_selected_item: null,
            console_item_with_focus: null
          });
        });
      }
    }
  }, {
    key: "_consoleItemIndex",
    value: function _consoleItemIndex(unique_id) {
      var counter = 0;

      var _iterator4 = _createForOfIteratorHelper(this.props.console_items),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var entry = _step4.value;

          if (entry.unique_id == unique_id) {
            return counter;
          }

          ++counter;
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
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
      var _this4 = this;

      var next_index = this._consoleItemIndex(unique_id) + 1;

      var _loop = function _loop() {
        var next_id = _this4.props.console_items[next_index].unique_id;
        var next_item = _this4.props.console_items[next_index];

        if (!next_item.am_shrunk && (next_item.type == "code" || next_item.type == "text" && !next_item.show_markdown)) {
          if (!next_item.show_on_filtered) {
            _this4.setState({
              filter_console_items: false
            }, function () {
              _this4._setConsoleItemValue(next_id, "set_focus", true);
            });
          } else {
            _this4._setConsoleItemValue(next_id, "set_focus", true);
          }

          return {
            v: void 0
          };
        }

        next_index += 1;
      };

      while (next_index < this.props.console_items.length) {
        var _ret = _loop();

        if (_typeof(_ret) === "object") return _ret.v;
      }

      this._addCodeArea("");

      return;
    }
  }, {
    key: "_closeConsoleItem",
    value: function _closeConsoleItem(unique_id) {
      var _this5 = this;

      var cindex = this._consoleItemIndex(unique_id);

      var new_console_items = _toConsumableArray(this.props.console_items);

      new_console_items.splice(cindex, 1);

      if (unique_id == this.state.currently_selected_item) {
        this.setState({
          currently_selected_item: null
        }, function () {
          _this5.props.setMainStateValue("console_items", new_console_items);
        });
      } else {
        this.props.setMainStateValue("console_items", new_console_items);
      }
    }
  }, {
    key: "_addConsoleEntry",
    value: function _addConsoleEntry(new_entry) {
      var _this6 = this;

      var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var set_focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var unique_id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      new_entry.set_focus = set_focus;
      var insert_index;

      if (unique_id) {
        insert_index = this._consoleItemIndex(unique_id) + 1;
      } else if (this.state.currently_selected_item == null) {
        insert_index = this.props.console_items.length;
      } else {
        insert_index = this._consoleItemIndex(this.state.currently_selected_item) + 1;
      }

      var new_console_items = _toConsumableArray(this.props.console_items);

      new_console_items.splice(insert_index, 0, new_entry);
      this.props.setMainStateValue("console_items", new_console_items, function () {
        if (force_open) {
          _this6.props.setMainStateValue("console_is_shrunk", false);
        }

        if (callback) {
          callback();
        }
      });
    }
  }, {
    key: "_startSpinner",
    value: function _startSpinner(console_id) {
      var new_entry = this.get_console_item_entry(console_id);
      new_entry.running = true;
      this.replace_console_item_entry(console_id, new_entry);
    }
  }, {
    key: "_stopConsoleSpinner",
    value: function _stopConsoleSpinner(console_id) {
      var execution_count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var new_entry = this.get_console_item_entry(console_id);
      new_entry.show_spinner = false;
      new_entry.running = false;

      if ("execution_count" != null) {
        new_entry.execution_count = execution_count;
      }

      this.replace_console_item_entry(console_id, new_entry);
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
    key: "_addToLog",
    value: function _addToLog(new_line) {
      this.setState({
        "console_error_log_text": this.state.console_error_log_text + new_line
      });
    }
  }, {
    key: "_bodyHeight",
    value: function _bodyHeight() {
      if (this.state.mounted) {
        return this.props.console_available_height - (this.body_ref.current.offsetTop - this.header_ref.current.offsetTop) - 2;
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
      var _this7 = this;

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
          _this7._pasteCell();
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
    key: "_clickConsoleBody",
    value: function _clickConsoleBody(e) {
      this._clearSelectedItem();

      e.stopPropagation();
    }
  }, {
    key: "_handleSearchFieldChange",
    value: function _handleSearchFieldChange(event) {
      var _this8 = this;

      if (this.state.search_helper_text) {
        this.setState({
          "search_helper_text": null
        }, function () {
          _this8._setSearchString(event.target.value);
        });
      } else {
        this._setSearchString(event.target.value);
      }
    }
  }, {
    key: "_setSearchString",
    value: function _setSearchString(val) {
      var _this9 = this;

      var nval = val == "" ? null : val;
      this.setState({
        search_string: nval
      }, function () {
        if (_this9.state.currently_selected_item) {
          _this9._setConsoleItemValue(_this9.state.currently_selected_item, "search_string", nval);
        }
      });
    }
  }, {
    key: "_handleUnFilter",
    value: function _handleUnFilter() {
      var _this10 = this;

      this.setState({
        filter_console_items: false,
        search_helper_text: null
      }, function () {
        _this10._setSearchString(null);
      });
    }
  }, {
    key: "_handleFilter",
    value: function _handleFilter() {
      var _this11 = this;

      var new_console_items = _toConsumableArray(this.props.console_items);

      var _iterator5 = _createForOfIteratorHelper(new_console_items),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var entry = _step5.value;

          if (entry.type == "code" || entry.type == "text") {
            entry["show_on_filtered"] = entry.console_text.toLowerCase().includes(this.state.search_string.toLowerCase());
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      this.props.setMainStateValue("console_items", new_console_items, function () {
        _this11.setState({
          filter_console_items: true
        });
      });
    }
  }, {
    key: "_searchNext",
    value: function _searchNext() {
      var _this12 = this;

      var current_index;
      var self = this;

      if (!this.state.currently_selected_item) {
        current_index = 0;
      } else {
        current_index = this._consoleItemIndex(this.state.currently_selected_item) + 1;
      }

      var _loop2 = function _loop2() {
        var entry = _this12.props.console_items[current_index];

        if (entry.type == "code" || entry.type == "text") {
          if (_this12._selectIfMatching(entry, "console_text", function () {
            if (entry.type == "text") {
              self._setConsoleItemValue(entry.unique_id, "show_markdown", false);
            }
          })) {
            _this12.setState({
              "search_helper_text": null
            });

            return {
              v: void 0
            };
          }
        }

        current_index += 1;
      };

      while (current_index < this.props.console_items.length) {
        var _ret2 = _loop2();

        if (_typeof(_ret2) === "object") return _ret2.v;
      }

      this.setState({
        "search_helper_text": "No more results"
      });
    }
  }, {
    key: "_selectIfMatching",
    value: function _selectIfMatching(entry, text_field) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var self = this;

      if (entry[text_field].toLowerCase().includes(this.state.search_string.toLowerCase())) {
        if (entry.am_shrunk) {
          this._setConsoleItemValue(entry.unique_id, "am_shrunk", false, function () {
            self._selectConsoleItem(entry.unique_id, callback);
          });
        } else {
          this._selectConsoleItem(entry.unique_id, callback);
        }

        return true;
      }

      return false;
    }
  }, {
    key: "_searchPrevious",
    value: function _searchPrevious() {
      var _this13 = this;

      var current_index;
      var self = this;

      if (!this.state.currently_selected_item) {
        current_index = this.props.console_items.length - 1;
      } else {
        current_index = this._consoleItemIndex(this.state.currently_selected_item) - 1;
      }

      var _loop3 = function _loop3() {
        var entry = _this13.props.console_items[current_index];

        if (entry.type == "code" || entry.type == "text") {
          if (_this13._selectIfMatching(entry, "console_text", function () {
            if (entry.type == "text") {
              self._setConsoleItemValue(entry.unique_id, "show_markdown", false);
            }
          })) {
            _this13.setState({
              "search_helper_text": null
            });

            return {
              v: void 0
            };
          }
        }

        current_index -= 1;
      };

      while (current_index >= 0) {
        var _ret3 = _loop3();

        if (_typeof(_ret3) === "object") return _ret3.v;
      }

      this.setState({
        "search_helper_text": "No more results"
      });
    }
  }, {
    key: "_handleSubmit",
    value: function _handleSubmit(e) {
      this._searchNext();

      e.preventDefault();
    }
  }, {
    key: "_shouldCancelSortStart",
    value: function _shouldCancelSortStart() {
      return this.state.filter_console_items;
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var self = this;
      var ms = {
        Insert: [{
          name_text: "Text Cell",
          icon_name: "new-text-box",
          click_handler: this._addBlankText,
          key_bindings: ["ctrl+t"]
        }, {
          name_text: "Code Cell",
          icon_name: "code",
          click_handler: this._addBlankCode,
          key_bindings: ["ctrl+c"]
        }, {
          name_text: "Resource Link",
          icon_name: "link",
          click_handler: this._insertResourceLink
        }],
        Edit: [{
          name_text: "Copy Cell",
          icon_name: "duplicate",
          click_handler: function click_handler() {
            self._copyCell();
          }
        }, {
          name_text: "Paste Cell",
          icon_name: "clipboard",
          click_handler: function click_handler() {
            self._pasteCell();
          }
        }, {
          name_text: "Clear Log",
          icon_name: "trash",
          click_handler: this._clearConsole
        }],
        Execute: [{
          name_text: "Run Selected",
          icon_name: "play",
          click_handler: this._runSelected,
          key_bindings: ["ctrl+enter", "command+enter"]
        }, {
          name_text: "Stop All",
          icon_name: "stop",
          click_handler: this._stopAll
        }, {
          name_text: "Reset All",
          icon_name: "reset",
          click_handler: this._resetConsole
        }]
      };

      if (!this.state.show_console_error_log) {
        ms["Consoles"] = [{
          name_text: "Show Log Console",
          icon_name: "console",
          click_handler: this._toggleConsoleLog
        }, {
          name_text: "Show Main Console",
          icon_name: "console",
          click_handler: this._toggleMainLog
        }];
      } else {
        ms["Consoles"] = [{
          name_text: "Hide Console",
          icon_name: "console",
          click_handler: this._toggleMainLog
        }];
      }

      return ms;
    }
  }, {
    key: "disabled_items",
    get: function get() {
      var items = [];

      if (!this.state.currently_selected_item) {
        items.push("Run Selected");
      }

      return items;
    }
  }, {
    key: "_clearCodeOutput",
    value: function _clearCodeOutput(unique_id) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      this._setConsoleItemValue(unique_id, "output_text", "", callback);
    }
  }, {
    key: "_runSelected",
    value: function _runSelected() {
      if (!this.props.am_selected) {
        return;
      }

      if (this.state.currently_selected_item) {
        var entry = this.get_console_item_entry(this.state.currently_selected_item);

        if (entry.type == "code") {
          this._runCodeItem(this.state.currently_selected_item);
        } else if (entry.type == "text") {
          this._showTextItemMarkdown(this.state.currently_selected_item);
        }
      }
    }
  }, {
    key: "_runCodeItem",
    value: function _runCodeItem(unique_id) {
      var go_to_next = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var self = this;

      this._clearCodeOutput(unique_id, function () {
        self._startSpinner(unique_id);

        var entry = self.get_console_item_entry(unique_id);
        (0, _communication_react.postWithCallback)(self.props.main_id, "exec_console_code", {
          "the_code": entry.console_text,
          "console_id": unique_id
        }, function () {
          if (go_to_next) {
            self._goToNextCell(unique_id);
          }
        }, null, self.props.main_id);
      });
    }
  }, {
    key: "_showTextItemMarkdown",
    value: function _showTextItemMarkdown(unique_id) {
      this._setConsoleItemValue(unique_id, "show_markdown", true);
    }
  }, {
    key: "render",
    value: function render() {
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

      if (!this.props.console_is_shrunk) {
        header_style["paddingRight"] = 15;
      }

      var key_bindings = [[["escape"], this._clearSelectedItem]];
      var filtered_items;

      if (this.state.filter_console_items) {
        filtered_items = [];

        var _iterator6 = _createForOfIteratorHelper(this.props.console_items),
            _step6;

        try {
          for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
            var entry = _step6.value;

            if (entry.show_on_filtered) {
              filtered_items.push(entry);
            }
          }
        } catch (err) {
          _iterator6.e(err);
        } finally {
          _iterator6.f();
        }
      } else {
        filtered_items = this.props.console_items;
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
      }), /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
        menu_specs: this.menu_specs,
        disabled_items: this.disabled_items,
        showRefresh: false,
        showClose: false,
        dark_theme: this.props.dark_theme,
        refreshTab: this.props.refreshTab,
        closeTab: null,
        controlled: false // This doesn't matter
        ,
        am_selected: false // Also doesn't matter

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
      })))), !this.props.console_is_shrunk && /*#__PURE__*/_react["default"].createElement("form", {
        onSubmit: this._handleSubmit,
        id: "console-search-form",
        className: "d-flex flex-row bp3-form-group",
        style: {
          justifyContent: "flex-end",
          marginRight: 116,
          marginBottom: 6,
          marginTop: 12
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-column"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        type: "search",
        leftIcon: "search",
        placeholder: "Search",
        small: true,
        value: !this.state.search_string ? "" : this.state.search_string,
        onChange: this._handleSearchFieldChange,
        autoCapitalize: "none",
        autoCorrect: "off",
        className: "mr-2"
      }), /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._handleFilter,
        small: true
      }, "Filter"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._handleUnFilter,
        small: true
      }, "Clear"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._searchNext,
        icon: "caret-down",
        text: undefined,
        small: true
      }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this._searchPrevious,
        icon: "caret-up",
        text: undefined,
        small: true
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "bp3-form-helper-text",
        style: {
          marginLeft: 10
        }
      }, this.state.search_helper_text))), !this.props.console_is_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
        id: "console",
        ref: this.body_ref,
        className: "contingent-scroll",
        onClick: this._clickConsoleBody,
        style: {
          height: this._bodyHeight()
        }
      }, this.state.show_console_error_log && /*#__PURE__*/_react["default"].createElement("pre", {
        style: {
          overflowX: "auto",
          whiteSpace: "pre-wrap",
          margin: 20
        }
      }, this.state.console_error_log_text), !this.state.show_console_error_log && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_sortable_container.SortableComponent, {
        id: "console-items-div",
        main_id: this.props.main_id,
        ElementComponent: SSuperItem,
        key_field_name: "unique_id",
        item_list: filtered_items,
        helperClass: this.props.dark_theme ? "bp3-dark" : "light-theme",
        handle: ".console-sorter",
        onSortStart: function onSortStart(_, event) {
          return event.preventDefault();
        } // This prevents Safari weirdness
        ,
        onSortEnd: this._resortConsoleItems,
        shouldCancelStart: this._shouldCancelSortStart,
        setConsoleItemValue: this._setConsoleItemValue,
        selectConsoleItem: this._selectConsoleItem,
        console_available_width: this._bodyWidth(),
        execution_count: 0,
        runCodeItem: this._runCodeItem,
        handleDelete: this._closeConsoleItem,
        goToNextCell: this._goToNextCell,
        setFocus: this._setFocusedItem,
        addNewTextItem: this._addBlankText,
        addNewCodeItem: this._addBlankCode,
        copyCell: this._copyCell,
        pasteCell: this._pasteCell,
        insertResourceLink: this._insertResourceLink,
        useDragHandle: true,
        dark_theme: this.props.dark_theme,
        handleCreateViewer: this.props.handleCreateViewer,
        axis: "y"
      })), /*#__PURE__*/_react["default"].createElement("div", {
        id: "padding-div",
        style: {
          height: 500
        }
      })), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
        global: true,
        active: !this.props.controlled || this.props.am_selected,
        bindings: key_bindings
      }));
    }
  }]);

  return RawConsoleComponent;
}(_react["default"].PureComponent);

RawConsoleComponent.propTypes = {
  console_items: _propTypes["default"].array,
  console_is_shrunk: _propTypes["default"].bool,
  show_exports_pane: _propTypes["default"].bool,
  setMainStateValue: _propTypes["default"].func,
  console_available_height: _propTypes["default"].number,
  console_available_width: _propTypes["default"].number,
  style: _propTypes["default"].object,
  shrinkable: _propTypes["default"].bool,
  zoomable: _propTypes["default"].bool
};
RawConsoleComponent.defaultProps = {
  style: {},
  shrinkable: true,
  zoomable: true
};
var ConsoleComponent = (0, _contextMenuTarget.ContextMenuTarget)(RawConsoleComponent);
exports.ConsoleComponent = ConsoleComponent;

var RawSortHandle = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(RawSortHandle, _React$PureComponent2);

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
}(_react["default"].PureComponent);

var Shandle = (0, _reactSortableHoc.SortableHandle)(RawSortHandle);

var SuperItem = /*#__PURE__*/function (_React$PureComponent3) {
  _inherits(SuperItem, _React$PureComponent3);

  var _super3 = _createSuper(SuperItem);

  function SuperItem() {
    _classCallCheck(this, SuperItem);

    return _super3.apply(this, arguments);
  }

  _createClass(SuperItem, [{
    key: "render",
    value: // shouldComponentUpdate(nextProps, nextState) {
    //     let update_props = all_update_props[this.props.type];
    //     for (let prop of update_props) {
    //         if (nextProps[prop] != this.props[prop]) {
    //             return true
    //         }
    //     }
    //     return false
    // }
    function render() {
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
}(_react["default"].PureComponent);

var SSuperItem = (0, _sortable_container.MySortableElement)(SuperItem);
var log_item_update_props = ["is_error", "am_shrunk", "am_selected", "summary_text", "console_text", "console_available_width"];

var RawLogItem = /*#__PURE__*/function (_React$Component) {
  _inherits(RawLogItem, _React$Component);

  var _super4 = _createSuper(RawLogItem);

  function RawLogItem(props) {
    var _this14;

    _classCallCheck(this, RawLogItem);

    _this14 = _super4.call(this, props);
    _this14.ce_summary0ref = /*#__PURE__*/_react["default"].createRef();
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this14), "_", RawLogItem.prototype);
    _this14.update_props = log_item_update_props;
    _this14.update_state_vars = [];
    _this14.state = {
      selected: false
    };
    _this14.last_output_text = "";
    return _this14;
  }

  _createClass(RawLogItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _iterator7 = _createForOfIteratorHelper(this.update_props),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var prop = _step7.value;

          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
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

        var _iterator8 = _createForOfIteratorHelper(scripts),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var script = _step8.value;

            try {
              window.eval(script.text);
            } catch (e) {}
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      }
    }
  }, {
    key: "makeTablesSortable",
    value: function makeTablesSortable() {
      var tables = $("#" + this.props.unique_id + " table.sortable").toArray();

      var _iterator9 = _createForOfIteratorHelper(tables),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var table = _step9.value;
          sorttable.makeSortable(table);
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
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
    key: "_selectMe",
    value: function _selectMe() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.selectConsoleItem(this.props.unique_id, callback);
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      var self = this;

      this._selectMe(function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;

      this._selectMe(function () {
        self.props.addNewCodeItem();
      });
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
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.Menu.Divider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteMe,
        intent: "danger",
        text: "Delete Cell"
      }));
    }
  }, {
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      this._selectMe();

      e.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var converted_dict = {
        __html: this.props.console_text
      };
      var panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";

      if (this.props.am_selected) {
        panel_class += " selected";
      }

      if (this.props.is_error) {
        panel_class += " error-log-panel";
      }

      var body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: panel_class + " d-flex flex-row",
        onClick: this._consoleItemClick,
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
      })), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
        value: this.props.summary_text,
        onChange: this._handleSummaryTextChange,
        className: "log-panel-summary"
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
      }))), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
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
  selectConsoleItem: _propTypes["default"].func,
  am_selected: _propTypes["default"].bool,
  console_text: _propTypes["default"].string,
  setConsoleItemValue: _propTypes["default"].func,
  handleDelete: _propTypes["default"].func,
  console_available_width: _propTypes["default"].number
};
var LogItem = (0, _contextMenuTarget.ContextMenuTarget)(RawLogItem);
var code_item_update_props = ["am_shrunk", "set_focus", "am_selected", "search_string", "summary_text", "console_text", "show_spinner", "execution_count", "output_text", "console_available_width", "dark_theme"];

var RawConsoleCodeItem = /*#__PURE__*/function (_React$Component2) {
  _inherits(RawConsoleCodeItem, _React$Component2);

  var _super5 = _createSuper(RawConsoleCodeItem);

  function RawConsoleCodeItem(props) {
    var _this15;

    _classCallCheck(this, RawConsoleCodeItem);

    _this15 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this15), "_", RawConsoleCodeItem.prototype);
    _this15.cmobject = null;
    _this15.elRef = /*#__PURE__*/_react["default"].createRef();
    _this15.update_props = code_item_update_props;
    _this15.update_state_vars = [];
    _this15.state = {};
    _this15.last_output_text = "";
    return _this15;
  }

  _createClass(RawConsoleCodeItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _iterator10 = _createForOfIteratorHelper(this.update_props),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var prop = _step10.value;

          if (nextProps[prop] != this.props[prop]) {
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
      var _this16 = this;

      if (this.props.set_focus) {
        if (this.cmobject != null) {
          this.cmobject.focus();
          this.cmobject.setCursor({
            line: 0,
            ch: 0
          });
        }

        this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
      }

      var self = this;

      if (this.cmobject != null) {
        this.cmobject.on("focus", function () {
          self.props.setFocus(_this16.props.unique_id, self._selectMe);
        });
        this.cmobject.on("blur", function () {
          self.props.setFocus(null);
        });
      }

      this.executeEmbeddedScripts();
      this.makeTablesSortable();
    }
  }, {
    key: "_scrollMeIntoView",
    value: function _scrollMeIntoView() {
      var my_element = this.elRef.current;
      var outer_element = my_element.parentNode.parentNode;
      var scrolled_element = my_element.parentNode;
      var outer_height = outer_element.offsetHeight;
      var distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;

      if (distance_from_top > outer_height - 35) {
        var distance_to_move = distance_from_top - .5 * outer_height;
        outer_element.scrollTop += distance_to_move;
      } else if (distance_from_top < 0) {
        var _distance_to_move = .25 * outer_height - distance_from_top;

        outer_element.scrollTop -= _distance_to_move;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapShot) {
      this.executeEmbeddedScripts();
      this.makeTablesSortable();

      if (this.props.am_selected && !prevProps.am_selected && this.elRef && this.elRef.current) {
        // this.elRef.current.scrollIntoView()
        this._scrollMeIntoView();
      }

      if (this.props.set_focus) {
        if (this.cmobject != null) {
          this.cmobject.focus();
          this.cmobject.setCursor({
            line: 0,
            ch: 0
          });
        }

        this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
      }
    }
  }, {
    key: "executeEmbeddedScripts",
    value: function executeEmbeddedScripts() {
      if (this.props.output_text != this.last_output_text) {
        // to avoid doubles of bokeh images
        this.last_output_text = this.props.output_text;
        var scripts = $("#" + this.props.unique_id + " .log-code-output script").toArray(); // $("#" + this.props.unique_id + " .bk-root").html(""); // This is a kluge to deal with bokeh double images

        var _iterator11 = _createForOfIteratorHelper(scripts),
            _step11;

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var script = _step11.value;

            // noinspection EmptyCatchBlockJS,UnusedCatchParameterJS
            try {
              window.eval(script.text);
            } catch (e) {}
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }
      }
    }
  }, {
    key: "makeTablesSortable",
    value: function makeTablesSortable() {
      var tables = $("#" + this.props.unique_id + " table.sortable").toArray();

      var _iterator12 = _createForOfIteratorHelper(tables),
          _step12;

      try {
        for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
          var table = _step12.value;
          sorttable.makeSortable(table);
        }
      } catch (err) {
        _iterator12.e(err);
      } finally {
        _iterator12.f();
      }
    }
  }, {
    key: "_stopMe",
    value: function _stopMe() {
      this._stopMySpinner();

      (0, _communication_react.postWithCallback)(this.props.main_id, "stop_console_code", {
        "console_id": this.props.unique_id
      }, null, null, this.props.main_id);
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
      var _this17 = this;

      var self = this;
      return {
        'Ctrl-Enter': function CtrlEnter() {
          return self.props.runCodeItem(_this17.props.unique_id, true);
        },
        'Cmd-Enter': function CmdEnter() {
          return self.props.runCodeItem(_this17.props.unique_id, true);
        },
        'Ctrl-C': self.props.addNewCodeItem,
        'Ctrl-T': self.props.addNewTextItem
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
    key: "_selectMe",
    value: function _selectMe() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.selectConsoleItem(this.props.unique_id, callback);
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      var self = this;

      this._selectMe(function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;

      this._selectMe(function () {
        self.props.addNewCodeItem();
      });
    }
  }, {
    key: "renderContextMenu",
    value: function renderContextMenu() {
      var _this18 = this;

      // return a single element, or nothing to use default browser behavior
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, !this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "play",
        intent: "success",
        onClick: function onClick() {
          _this18.props.runCodeItem(_this18.props.unique_id);
        },
        text: "Run Cell"
      }), this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "stop",
        intent: "danger",
        onClick: this._stopMe,
        text: "Stop Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.Menu.Divider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
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
          _this18._clearOutput();
        },
        text: "Clear Output"
      }));
    }
  }, {
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      this._selectMe();

      e.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var _this19 = this;

      var panel_style = this.props.am_shrunk ? "log-panel log-panel-invisible" : "log-panel log-panel-visible";

      if (this.props.am_selected) {
        panel_style += " selected";
      }

      var output_dict = {
        __html: this.props.output_text
      };
      var spinner_val = this.props.running ? null : 0;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: panel_style + " d-flex flex-row",
        ref: this.elRef,
        onClick: this._consoleItemClick,
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
      })), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "log-panel-summary code-panel-summary"
      }, this._getFirstLine()), /*#__PURE__*/_react["default"].createElement("div", {
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
      }))), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
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
        handleClick: function handleClick() {
          _this19.props.runCodeItem(_this19.props.unique_id);
        },
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
        dark_theme: this.props.dark_theme,
        readOnly: false,
        show_line_numbers: true,
        code_content: this.props.console_text,
        setCMObject: this._setCMObject,
        extraKeys: this._extraKeys(),
        search_term: this.props.search_string,
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
          _this19._clearOutput();
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
  search_string: _propTypes["default"].string,
  show_spinner: _propTypes["default"].bool,
  running: _propTypes["default"].bool,
  summary_text: _propTypes["default"].string,
  console_text: _propTypes["default"].string,
  output_text: _propTypes["default"].string,
  execution_count: _propTypes["default"].number,
  console_available_width: _propTypes["default"].number,
  setConsoleItemValue: _propTypes["default"].func,
  selectConsoleItem: _propTypes["default"].func,
  handleDelete: _propTypes["default"].func,
  addNewTextItem: _propTypes["default"].func,
  addNewCodeItem: _propTypes["default"].func,
  goToNextCell: _propTypes["default"].func,
  setFocus: _propTypes["default"].func,
  runCodeItem: _propTypes["default"].func
};
var ConsoleCodeItem = (0, _contextMenuTarget.ContextMenuTarget)(RawConsoleCodeItem);

var ResourceLinkButton = /*#__PURE__*/function (_React$PureComponent4) {
  _inherits(ResourceLinkButton, _React$PureComponent4);

  var _super6 = _createSuper(ResourceLinkButton);

  function ResourceLinkButton(props) {
    var _this20;

    _classCallCheck(this, ResourceLinkButton);

    _this20 = _super6.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this20));
    _this20.my_view = (0, _library_pane.view_views)(false)[props.res_type];

    if (window.in_context) {
      var re = new RegExp("/$");
      _this20.my_view = _this20.my_view.replace(re, "_in_context");
    }

    return _this20;
  }

  _createClass(ResourceLinkButton, [{
    key: "_goToLink",
    value: function _goToLink() {
      var self = this;

      if (window.in_context) {
        (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + this.my_view, {
          context_id: window.context_id,
          resource_name: this.props.res_name
        }).then(self.props.handleCreateViewer)["catch"](_toaster.doFlash);
      } else {
        window.open($SCRIPT_ROOT + this.my_view + this.props.res_name);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var self = this;
      return /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
        className: "link-button-group"
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        small: true,
        text: this.props.res_name,
        icon: _blueprint_mdata_fields.icon_dict[this.props.res_type],
        minimal: true,
        onClick: this._goToLink
      }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        small: true,
        icon: "small-cross",
        minimal: true,
        onClick: function onClick(e) {
          self.props.deleteMe(self.props.my_index);
          e.stopPropagation();
        }
      }));
    }
  }]);

  return ResourceLinkButton;
}(_react["default"].PureComponent);

ResourceLinkButton.propTypes = {
  res_type: _propTypes["default"].string,
  res_name: _propTypes["default"].string,
  deleteMe: _propTypes["default"].func
};
var text_item_update_props = ["am_shrunk", "set_focus", "serach_string", "am_selected", "show_markdown", "summary_text", "console_text", "console_available_width", "links"];

var RawConsoleTextItem = /*#__PURE__*/function (_React$Component3) {
  _inherits(RawConsoleTextItem, _React$Component3);

  var _super7 = _createSuper(RawConsoleTextItem);

  function RawConsoleTextItem(props) {
    var _this21;

    _classCallCheck(this, RawConsoleTextItem);

    _this21 = _super7.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this21), "_", RawConsoleTextItem.prototype);
    _this21.cmobject = null;
    _this21.elRef = /*#__PURE__*/_react["default"].createRef();
    _this21.ce_summary_ref = /*#__PURE__*/_react["default"].createRef();
    _this21.update_props = text_item_update_props;
    _this21.update_state_vars = ["ce_ref"];
    _this21.previous_dark_theme = props.dark_theme;
    _this21.state = {
      ce_ref: null
    };
    return _this21;
  }

  _createClass(RawConsoleTextItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _iterator13 = _createForOfIteratorHelper(this.update_props),
          _step13;

      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var prop = _step13.value;

          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }

      var _iterator14 = _createForOfIteratorHelper(this.update_state_vars),
          _step14;

      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var state_var = _step14.value;

          if (nextState[state_var] != this.state[state_var]) {
            return true;
          }
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }

      if (this.props.dark_theme != this.previous_dark_theme) {
        this.previous_dark_theme = this.props.dark_theme;
        return true;
      }

      return false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this22 = this;

      if (this.props.set_focus) {
        if (this.props.show_markdown) {
          this._hideMarkdown();
        } else if (this.cmobject != null) {
          this.cmobject.focus();
          this.cmobject.setCursor({
            line: 0,
            ch: 0
          });
          this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
        }
      }

      var self = this;

      if (this.cmobject != null) {
        this.cmobject.on("focus", function () {
          self.props.setFocus(_this22.props.unique_id, self._selectMe);
        });
        this.cmobject.on("blur", function () {
          self.props.setFocus(null);
        });
      }
    }
  }, {
    key: "_scrollMeIntoView",
    value: function _scrollMeIntoView() {
      var my_element = this.elRef.current;
      var outer_element = my_element.parentNode.parentNode;
      var scrolled_element = my_element.parentNode;
      var outer_height = outer_element.offsetHeight;
      var distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;

      if (distance_from_top > outer_height - 35) {
        var distance_to_move = distance_from_top - .5 * outer_height;
        outer_element.scrollTop += distance_to_move;
      } else if (distance_from_top < 0) {
        var _distance_to_move2 = .25 * outer_height - distance_from_top;

        outer_element.scrollTop -= _distance_to_move2;
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapShot) {
      if (this.props.am_selected && !prevProps.am_selected && this.elRef && this.elRef.current) {
        this._scrollMeIntoView();
      }

      if (this.props.set_focus) {
        if (this.props.show_markdown) {
          this._hideMarkdown();
        } else if (this.cmobject != null) {
          this.cmobject.focus();
          this.cmobject.setCursor({
            line: 0,
            ch: 0
          });
        }

        this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
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
      this.props.setConsoleItemValue(this.props.unique_id, "show_markdown", true);
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
    value: function _handleChange(new_text) {
      this.props.setConsoleItemValue(this.props.unique_id, "console_text", new_text);
    }
  }, {
    key: "_clearForceSync",
    value: function _clearForceSync() {
      this.props.setConsoleItemValue(this.props.unique_id, "force_sync_to_prop", false);
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
    key: "_selectMe",
    value: function _selectMe() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.selectConsoleItem(this.props.unique_id, callback);
    }
  }, {
    key: "_insertResourceLink",
    value: function _insertResourceLink() {
      var self = this;
      (0, _modal_react.showSelectResourceDialog)("cancel", "insert link", function (result) {
        var new_links = _toConsumableArray(self.props.links);

        new_links.push({
          res_type: result.type,
          res_name: result.selected_resource
        });
        self.props.setConsoleItemValue(self.props.unique_id, "links", new_links);
      });
    }
  }, {
    key: "_deleteLinkButton",
    value: function _deleteLinkButton(index) {
      var new_links = _lodash["default"].cloneDeep(this.props.links);

      new_links.splice(index, 1);
      var self = this;
      this.props.setConsoleItemValue(this.props.unique_id, "links", new_links, function () {
        console.log("i am here with nlinks " + String(self.props.links.length));
      });
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      var self = this;

      this._selectMe(function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;

      this._selectMe(function () {
        self.props.addNewCodeItem();
      });
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
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.Menu.Divider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "link",
        onClick: this._insertResourceLink,
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
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      this._selectMe();

      e.stopPropagation();
    }
  }, {
    key: "_setCMObject",
    value: function _setCMObject(cmobject) {
      this.cmobject = cmobject;
    }
  }, {
    key: "_extraKeys",
    value: function _extraKeys() {
      var self = this;
      return {
        'Ctrl-Enter': function CtrlEnter() {
          return self._gotEnter();
        },
        'Cmd-Enter': function CmdEnter() {
          return self._gotEnter();
        },
        'Ctrl-C': self.props.addNewCodeItem,
        'Ctrl-T': self.props.addNewTextItem
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this23 = this;

      var really_show_markdown = this.hasOnlyWhitespace && this.props.links.length == 0 ? false : this.props.show_markdown;
      var converted_markdown;

      if (really_show_markdown) {
        converted_markdown = mdi.render(this.props.console_text);
      } // let key_bindings = [[["ctrl+enter", "command+enter"], this._gotEnter]];


      var converted_dict = {
        __html: converted_markdown
      };
      var panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible text-log-item" : "log-panel log-panel-visible text-log-item";

      if (this.props.am_selected) {
        panel_class += " selected";
      }

      var gbstyle = {
        marginLeft: 1
      };
      var body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
      var self = this;
      var link_buttons = this.props.links.map(function (link, index) {
        return /*#__PURE__*/_react["default"].createElement(ResourceLinkButton, {
          key: index,
          my_index: index,
          handleCreateViewer: _this23.props.handleCreateViewer,
          deleteMe: self._deleteLinkButton,
          res_type: link.res_type,
          res_name: link.res_name
        });
      });
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: panel_class + " d-flex flex-row",
        onClick: this._consoleItemClick,
        ref: this.elRef,
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
      })), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "log-panel-summary"
      }, this._getFirstLine()), /*#__PURE__*/_react["default"].createElement("div", {
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
      }))), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
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
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-column"
      }, !really_show_markdown && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        handleChange: this._handleChange,
        dark_theme: this.props.dark_theme,
        readOnly: false,
        show_line_numbers: false,
        soft_wrap: true,
        sync_to_prop: false,
        force_sync_to_prop: this.props.force_sync_to_prop,
        clear_force_sync: this._clearForceSync,
        mode: "markdown",
        code_content: this.props.console_text,
        setCMObject: this._setCMObject,
        extraKeys: this._extraKeys(),
        search_term: this.props.search_string,
        code_container_width: this.props.console_available_width - BUTTON_CONSUMED_SPACE,
        saveMe: null
      })), really_show_markdown && !this.hasOnlyWhitespace && /*#__PURE__*/_react["default"].createElement("div", {
        className: "text-panel-output",
        onDoubleClick: this._hideMarkdown,
        style: {
          width: body_width,
          padding: 9
        },
        dangerouslySetInnerHTML: converted_dict
      }), link_buttons), /*#__PURE__*/_react["default"].createElement("div", {
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
  force_sync_to_prop: _propTypes["default"].bool,
  summary_text: _propTypes["default"].string,
  console_text: _propTypes["default"].string,
  console_available_width: _propTypes["default"].number,
  setConsoleItemValue: _propTypes["default"].func,
  selectConsoleItem: _propTypes["default"].func,
  am_selected: _propTypes["default"].bool,
  handleDelete: _propTypes["default"].func,
  goToNextCell: _propTypes["default"].func,
  setFocus: _propTypes["default"].func,
  links: _propTypes["default"].array
};
RawConsoleTextItem.defaultProps = {
  force_sync_to_prop: false,
  links: []
};
var ConsoleTextItem = (0, _contextMenuTarget.ContextMenuTarget)(RawConsoleTextItem);
var all_update_props = {
  "text": text_item_update_props,
  "code": code_item_update_props,
  "fixed": log_item_update_props
};