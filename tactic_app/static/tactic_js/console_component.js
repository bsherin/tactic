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

var _search_form = require("./search_form");

var _searchable_console = require("./searchable_console");

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
      main_log_since: null,
      max_console_lines: 100,
      pseudo_log_since: null,
      show_console_error_log: false,
      all_selected_items: [],
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
    key: "initSocket",
    value: function initSocket() {
      var self = this;

      function _handleConsoleMessage(data) {
        if (data.main_id == self.props.main_id) {
          var handlerDict = {
            consoleLog: function consoleLog(data) {
              return self._addConsoleEntry(data.message, data.force_open, true);
            },
            consoleLogMultiple: function consoleLogMultiple(data) {
              return self._addConsoleEntries(data.message, data.force_open, true);
            },
            createLink: function createLink(data) {
              var unique_id = data.message.unique_id;

              self._addConsoleEntry(data.message, data.force_open, false, null, function () {
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
            consoleCodeOverwrite: function consoleCodeOverwrite(data) {
              return self._setConsoleItemOutput(data);
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
        } else if (callback != null) {
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
    key: "_addConsoleDivider",
    value: function _addConsoleDivider(header_text) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      (0, _communication_react.postWithCallback)("host", "print_divider_area_to_console", {
        "header_text": header_text,
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
    key: "_addBlankDivider",
    value: function _addBlankDivider() {
      if (!this.props.am_selected) {
        return;
      }

      this._addConsoleDivider("");
    } // _insertTextInCell(the_text) {
    //     let unique_id = this.state.currently_selected_item;
    //     let entry = this.get_console_item_entry(unique_id);
    //     let replace_dicts = [];
    //     replace_dicts.push({unique_id: unique_id, field:"console_text", value: entry.console_text + the_text});
    //     replace_dicts.push({unique_id: unique_id, field: "force_sync_to_prop", value: true});
    //     this._multiple_console_item_updates(replace_dicts)
    // }

  }, {
    key: "_getSectionIds",
    value: function _getSectionIds(unique_id) {
      var cindex = this._consoleItemIndex(unique_id);

      var id_list = [unique_id];

      for (var i = cindex + 1; i < this.props.console_items.length; ++i) {
        var entry = this.props.console_items[i];

        if (entry.type == "divider") {
          break;
        } else {
          id_list.push(entry.unique_id);
        }
      }

      return id_list;
    }
  }, {
    key: "_deleteSection",
    value: function _deleteSection() {
      var _this3 = this;

      var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!unique_id) {
        if (this.state.all_selected_items.length != 1) {
          return;
        }

        unique_id = this.state.all_selected_items[0];
        var entry = this.get_console_item_entry(unique_id);

        if (entry.type != "divider") {
          return;
        }
      }

      var id_list = this._getSectionIds(unique_id);

      var cindex = this._consoleItemIndex(unique_id);

      var new_console_items = _toConsumableArray(this.props.console_items);

      new_console_items.splice(cindex, id_list.length);

      this._clear_all_selected_items(function () {
        _this3.props.setMainStateValue("console_items", new_console_items);
      });
    }
  }, {
    key: "_copySection",
    value: function _copySection() {
      var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!unique_id) {
        if (this.state.all_selected_items.length != 1) {
          return;
        }

        unique_id = this.state.all_selected_items[0];
        var entry = this.get_console_item_entry(unique_id);

        if (entry.type != "divider") {
          return;
        }
      }

      var id_list = this._getSectionIds(unique_id);

      this._copyItems(id_list);
    }
  }, {
    key: "_copyCell",
    value: function _copyCell() {
      var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var id_list;

      if (!unique_id) {
        id_list = this._sortSelectedItems();

        if (id_list.length == 0) {
          return;
        }
      } else {
        id_list = [unique_id];
      }

      this._copyItems(id_list);
    }
  }, {
    key: "_copyAll",
    value: function _copyAll() {
      var result_dict = {
        "main_id": this.props.main_id,
        "console_items": this.props.console_items,
        "user_id": window.user_id
      };
      (0, _communication_react.postWithCallback)("host", "copy_console_cells", result_dict, null, null, this.props.main_id);
    }
  }, {
    key: "_copyItems",
    value: function _copyItems(id_list) {
      var entry_list = [];

      var _iterator = _createForOfIteratorHelper(id_list),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var uid = _step.value;
          var entry = this.get_console_item_entry(uid);
          entry.am_selected = false;
          entry_list.push(entry);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var result_dict = {
        "main_id": this.props.main_id,
        "console_items": entry_list,
        "user_id": window.user_id
      };
      (0, _communication_react.postWithCallback)("host", "copy_console_cells", result_dict, null, null, this.props.main_id);
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      var _this4 = this;

      var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var self = this;
      (0, _communication_react.postWithCallback)("host", "get_copied_console_cells", {
        user_id: window.user_id
      }, function (data) {
        if (!data.success) {
          (0, _toaster.doFlash)(data);
        } else {
          _this4._addConsoleEntries(data.console_items, true, false, unique_id);
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
    key: "_currently_selected",
    value: function _currently_selected() {
      if (this.state.all_selected_items.length == 0) {
        return null;
      } else {
        return _lodash["default"].last(this.state.all_selected_items);
      }
    }
  }, {
    key: "_insertResourceLink",
    value: function _insertResourceLink() {
      if (!this._currently_selected()) {
        this._addConsoleTextLink();

        return;
      }

      var entry = this.get_console_item_entry(this._currently_selected());

      if (!entry || entry.type != "text") {
        this._addConsoleTextLink();

        return;
      }

      this._insertLinkInItem(this._currently_selected());
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

      var _iterator2 = _createForOfIteratorHelper(this.props.console_items),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var entry = _step2.value;

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
        _iterator2.e(err);
      } finally {
        _iterator2.f();
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
        self.setState({
          all_selected_items: []
        }, function () {
          self.props.setMainStateValue("console_items", []);
        });
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
                "container_id": self.pseudo_tile_id,
                "since": self.state.pseudo_log_since,
                "max_lines": self.state.max_console_lines
              }, function (res) {
                var log_text = res.log_text;

                if (log_text == "") {
                  log_text = "Got empty result. The pseudo-tile is probably starting up.";
                }

                self.setState({
                  "console_error_log_text": log_text,
                  console_log_showing: "pseudo"
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
            "container_id": self.pseudo_tile_id,
            "since": self.state.pseudo_log_since,
            "max_lines": self.state.max_console_lines
          }, function (res) {
            self.setState({
              "console_error_log_text": res.log_text,
              console_log_showing: "pseudo"
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
    key: "_setPseudoLogSince",
    value: function _setPseudoLogSince() {
      var _this5 = this;

      var now = new Date().getTime();
      var self = this;
      this.setState({
        pseudo_log_since: now
      }, function () {
        self._stopMainPseudoLogStreaming(function () {
          (0, _communication_react.postWithCallback)("host", "get_container_log", {
            container_id: self.pseudo_tile_id,
            since: self.state.pseudo_log_since,
            max_lines: self.state.max_console_lines
          }, function (res) {
            self.setState({
              console_error_log_text: res.log_text,
              console_log_showing: "pseudo"
            }, function () {
              self.setState({
                "show_console_error_log": true
              });

              self._startPseudoLogStreaming();
            });
          }, null, _this5.props.main_id);
        });
      });
    }
  }, {
    key: "_startPseudoLogStreaming",
    value: function _startPseudoLogStreaming() {
      (0, _communication_react.postWithCallback)(this.props.main_id, "StartPseudoLogStreaming", {}, null, null, this.props.main_id);
    }
  }, {
    key: "_setLogSince",
    value: function _setLogSince() {
      if (this.state.console_log_showing == "main") {
        this._setMainLogSince();
      } else {
        this._setPseudoLogSince();
      }
    }
  }, {
    key: "_setMaxConsoleLines",
    value: function _setMaxConsoleLines(max_lines) {
      if (this.state.console_log_showing == "main") {
        this._setMainMaxConsoleLines(max_lines);
      } else {
        this._setPseudoMaxConsoleLines(max_lines);
      }
    }
  }, {
    key: "_setMainLogSince",
    value: function _setMainLogSince() {
      var _this6 = this;

      var now = new Date().getTime();
      var self = this;
      this.setState({
        main_log_since: now
      }, function () {
        self._stopMainPseudoLogStreaming(function () {
          (0, _communication_react.postWithCallback)("host", "get_container_log", {
            container_id: self.props.main_id,
            since: self.state.main_log_since,
            max_lines: self.state.max_console_lines
          }, function (res) {
            self.setState({
              console_error_log_text: res.log_text,
              console_log_showing: "main"
            }, function () {
              self._startMainLogStreaming();

              self.setState({
                "show_console_error_log": true
              });
            });
          }, null, _this6.props.main_id);
        });
      });
    }
  }, {
    key: "_setMainMaxConsoleLines",
    value: function _setMainMaxConsoleLines(max_lines) {
      var _this7 = this;

      var self = this;
      this.setState({
        max_console_lines: max_lines
      }, function () {
        self._stopMainPseudoLogStreaming(function () {
          (0, _communication_react.postWithCallback)("host", "get_container_log", {
            container_id: self.props.main_id,
            since: self.state.main_log_since,
            max_lines: self.state.max_console_lines
          }, function (res) {
            self.setState({
              console_error_log_text: res.log_text,
              console_log_showing: "main"
            }, function () {
              self._startMainLogStreaming();

              self.setState({
                "show_console_error_log": true
              });
            });
          }, null, _this7.props.main_id);
        });
      });
    }
  }, {
    key: "_setPseudoMaxConsoleLines",
    value: function _setPseudoMaxConsoleLines(max_lines) {
      var _this8 = this;

      var self = this;
      this.setState({
        max_console_lines: max_lines
      }, function () {
        self._stopMainPseudoLogStreaming(function () {
          (0, _communication_react.postWithCallback)("host", "get_container_log", {
            container_id: self.pseudo_tile_id,
            since: self.state.pseudo_log_since,
            max_lines: self.state.max_console_lines
          }, function (res) {
            self.setState({
              console_error_log_text: res.log_text,
              console_log_showing: "pseudo"
            }, function () {
              self.setState({
                "show_console_error_log": true
              });

              self._startPseudoLogStreaming();
            });
          }, null, _this8.props.main_id);
        });
      });
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
          "container_id": this.props.main_id,
          "since": self.state.main_log_since,
          "max_lines": self.state.max_console_lines
        }, function (res) {
          self.setState({
            "console_error_log_text": res.log_text,
            console_log_showing: "main"
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
      (0, _communication_react.postWithCallback)(this.props.main_id, "StartMainLogStreaming", {}, null, null, this.props.main_id);
    }
  }, {
    key: "_stopMainPseudoLogStreaming",
    value: function _stopMainPseudoLogStreaming() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      (0, _communication_react.postWithCallback)(this.props.main_id, "StopMainPseudoLogStreaming", {}, callback, null, this.props.main_id);
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
    key: "_reOpenClosedDividers",
    value: function _reOpenClosedDividers() {
      if (this.temporarily_closed_items.length == 0) {
        return;
      }

      var new_console_items = _lodash["default"].cloneDeep(this.props.console_items);

      var _iterator3 = _createForOfIteratorHelper(new_console_items),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var entry = _step3.value;

          if (entry.type == "divider" && this.temporarily_closed_items.includes(entry.unique_id)) {
            entry.am_shrunk = false;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      this.temporarily_closed_items = [];
      this.props.setMainStateValue("console_items", new_console_items);
    }
  }, {
    key: "_closeAllDividers",
    value: function _closeAllDividers() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      var new_console_items = _lodash["default"].cloneDeep(this.props.console_items);

      var _iterator4 = _createForOfIteratorHelper(new_console_items),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var entry = _step4.value;

          if (entry.type == "divider") {
            if (!entry.am_shrunk) {
              entry.am_shrunk = true;
              this.temporarily_closed_items.push(entry.unique_id);
            }
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      this.props.setMainStateValue("console_items", new_console_items, callback);
    }
  }, {
    key: "_multiple_console_item_updates",
    value: function _multiple_console_item_updates(replace_dicts) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var new_console_items = _toConsumableArray(this.props.console_items);

      var _iterator5 = _createForOfIteratorHelper(replace_dicts),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var d = _step5.value;

          var cindex = this._consoleItemIndex(d["unique_id"]);

          new_console_items[cindex][d["field"]] = d["value"];
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      this.props.setMainStateValue("console_items", new_console_items, callback);
    }
  }, {
    key: "_clear_all_selected_items",
    value: function _clear_all_selected_items() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var self = this;

      var new_console_items = _toConsumableArray(this.props.console_items);

      var _iterator6 = _createForOfIteratorHelper(new_console_items),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var item = _step6.value;
          item.am_selected = false;
          item.search_string = null;
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      this.setState({
        all_selected_items: []
      }, function () {
        self.props.setMainStateValue("console_items", new_console_items, callback);
      });
    }
  }, {
    key: "_reduce_to_last_selected",
    value: function _reduce_to_last_selected() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var self = this;

      if (this.state.all_selected_items.length <= 1) {
        if (callback) {
          callback();
        }
      }

      var replace_dicts = [];

      var _iterator7 = _createForOfIteratorHelper(this.state.all_selected_items.slice(0, -1)),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var uid = _step7.value;
          replace_dicts.push({
            unique_id: uid,
            field: "am_selected",
            value: false
          });
          replace_dicts.push({
            unique_id: uid,
            field: "search_string",
            value: null
          });
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      this._multiple_console_item_updates(replace_dicts, function () {
        self.setState({
          all_selected_items: self.state.all_selected_items.slice(-1)
        }, callback);
      });
    }
  }, {
    key: "get_console_item_entry",
    value: function get_console_item_entry(unique_id) {
      return _lodash["default"].cloneDeep(this.props.console_items[this._consoleItemIndex(unique_id)]);
    }
  }, {
    key: "_dselectOneItem",
    value: function _dselectOneItem(unique_id) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var self = this;
      var replace_dicts = [];

      if (this.state.all_selected_items.includes(unique_id)) {
        replace_dicts.push({
          unique_id: unique_id,
          field: "am_selected",
          value: false
        });
        replace_dicts.push({
          unique_id: unique_id,
          field: "search_string",
          value: null
        });

        this._multiple_console_item_updates(replace_dicts, function () {
          var narray = _lodash["default"].cloneDeep(self.state.all_selected_items);

          var myIndex = narray.indexOf(unique_id);

          if (myIndex !== -1) {
            narray.splice(myIndex, 1);
          }

          self.setState({
            all_selected_items: narray
          }, callback);
        });
      } else {
        if (callback) {
          callback();
        }
      }
    }
  }, {
    key: "_selectConsoleItem",
    value: function _selectConsoleItem(unique_id) {
      var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var self = this;
      var replace_dicts = [];
      var shift_down = event != null && event.shiftKey;

      if (!shift_down) {
        if (this.state.all_selected_items.length > 0) {
          var _iterator8 = _createForOfIteratorHelper(this.state.all_selected_items),
              _step8;

          try {
            for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
              var uid = _step8.value;

              if (uid != unique_id) {
                replace_dicts.push({
                  unique_id: uid,
                  field: "am_selected",
                  value: false
                });
                replace_dicts.push({
                  unique_id: uid,
                  field: "search_string",
                  value: null
                });
              }
            }
          } catch (err) {
            _iterator8.e(err);
          } finally {
            _iterator8.f();
          }
        }

        if (!this.state.all_selected_items.includes(unique_id)) {
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
        }

        this._multiple_console_item_updates(replace_dicts, function () {
          self.setState({
            all_selected_items: [unique_id]
          }, callback);
        });
      } else {
        if (this.state.all_selected_items.includes(unique_id)) {
          this._dselectOneItem(unique_id);
        } else {
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
            var narray = _lodash["default"].cloneDeep(self.state.all_selected_items);

            narray.push(unique_id);
            self.setState({
              all_selected_items: narray
            }, callback);
          });
        }
      }
    }
  }, {
    key: "_sortSelectedItems",
    value: function _sortSelectedItems() {
      var self = this;

      var sitems = _lodash["default"].cloneDeep(this.state.all_selected_items);

      sitems.sort(function (firstEl, secondEl) {
        return self._consoleItemIndex(firstEl) < self._consoleItemIndex(secondEl) ? -1 : 1;
      });
      return sitems;
    }
  }, {
    key: "_clearSelectedItem",
    value: function _clearSelectedItem() {
      var self = this;
      var replace_dicts = [];

      var _iterator9 = _createForOfIteratorHelper(this.state.all_selected_items),
          _step9;

      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var uid = _step9.value;
          replace_dicts.push({
            unique_id: uid,
            field: "am_selected",
            value: false
          });
          replace_dicts.push({
            unique_id: uid,
            field: "search_string",
            value: null
          });
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }

      this._multiple_console_item_updates(replace_dicts, function () {
        self.setState({
          all_selected_items: [],
          console_item_with_focus: null
        });
      });
    }
  }, {
    key: "_consoleItemIndex",
    value: function _consoleItemIndex(unique_id) {
      var console_items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var counter = 0;

      if (console_items == null) {
        console_items = this.props.console_items;
      }

      var _iterator10 = _createForOfIteratorHelper(console_items),
          _step10;

      try {
        for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
          var entry = _step10.value;

          if (entry.unique_id == unique_id) {
            return counter;
          }

          ++counter;
        }
      } catch (err) {
        _iterator10.e(err);
      } finally {
        _iterator10.f();
      }

      return -1;
    }
  }, {
    key: "_moveSection",
    value: function _moveSection(_ref, filtered_items) {
      var oldIndex = _ref.oldIndex,
          newIndex = _ref.newIndex;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var move_entry = filtered_items[oldIndex];

      var move_index = this._consoleItemIndex(move_entry.unique_id);

      var section_ids = this._getSectionIds(move_entry.unique_id);

      var the_section = _lodash["default"].cloneDeep(this.props.console_items.slice(move_index, move_index + section_ids.length));

      var new_console_items = _toConsumableArray(this.props.console_items);

      new_console_items.splice(move_index, section_ids.length);
      var below_index;

      if (newIndex == 0) {
        below_index = 0;
      } else {
        // noinspection ES6ConvertIndexedForToForOf
        for (below_index = newIndex; below_index < new_console_items.length; ++below_index) {
          if (new_console_items[below_index].type == "divider") {
            break;
          }
        }

        if (below_index >= new_console_items.length) {
          below_index = new_console_items.length;
        }
      }

      new_console_items.splice.apply(new_console_items, [below_index, 0].concat(_toConsumableArray(the_section)));
      this.props.setMainStateValue("console_items", new_console_items, callback);
    }
  }, {
    key: "_moveEntryAfterEntry",
    value: function _moveEntryAfterEntry(move_id, above_id) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var new_console_items = _toConsumableArray(this.props.console_items);

      var move_entry = _lodash["default"].cloneDeep(this.get_console_item_entry(move_id));

      new_console_items.splice(this._consoleItemIndex(move_id), 1);
      var target_index;

      if (above_id == null) {
        target_index = 0;
      } else {
        target_index = this._consoleItemIndex(above_id, new_console_items) + 1;
      }

      new_console_items.splice(target_index, 0, move_entry);
      this.props.setMainStateValue("console_items", new_console_items, callback);
    }
  }, {
    key: "_resortConsoleItems",
    value: function _resortConsoleItems(_ref2, filtered_items) {
      var _this9 = this;

      var oldIndex = _ref2.oldIndex,
          newIndex = _ref2.newIndex;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var self = this;
      if (oldIndex == newIndex) return;
      var move_entry = filtered_items[oldIndex];

      if (move_entry.type == "divider") {
        this._moveSection({
          oldIndex: oldIndex,
          newIndex: newIndex
        }, filtered_items, callback);

        return;
      }

      var trueOldIndex = this._consoleItemIndex(move_entry.unique_id);

      var trueNewIndex;
      var above_entry;

      if (newIndex == 0) {
        above_entry = null;
      } else {
        if (newIndex > oldIndex) {
          above_entry = filtered_items[newIndex];
        } else {
          above_entry = filtered_items[newIndex - 1];
        }

        if (above_entry.type == "divider" && above_entry.am_shrunk) {
          this._setConsoleItemValue(above_entry.unique_id, "am_shrunk", false, function () {
            var lastIdInSection = _lodash["default"].last(_this9._getSectionIds(above_entry.unique_id));

            self._moveEntryAfterEntry(move_entry.unique_id, lastIdInSection, callback);
          });

          return;
        }
      }

      var target_id = above_entry == null ? null : above_entry.unique_id;

      this._moveEntryAfterEntry(move_entry.unique_id, target_id, callback);
    }
  }, {
    key: "_goToNextCell",
    value: function _goToNextCell(unique_id) {
      var _this10 = this;

      var next_index = this._consoleItemIndex(unique_id) + 1;

      var _loop = function _loop() {
        var next_id = _this10.props.console_items[next_index].unique_id;
        var next_item = _this10.props.console_items[next_index];

        if (!next_item.am_shrunk && (next_item.type == "code" || next_item.type == "text" && !next_item.show_markdown)) {
          if (!next_item.show_on_filtered) {
            _this10.setState({
              filter_console_items: false
            }, function () {
              _this10._setConsoleItemValue(next_id, "set_focus", true);
            });
          } else {
            _this10._setConsoleItemValue(next_id, "set_focus", true);
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
    key: "_deleteSelected",
    value: function _deleteSelected() {
      var _this11 = this;

      if (this._are_selected()) {
        var new_console_items = [];

        var _iterator11 = _createForOfIteratorHelper(this.props.console_items),
            _step11;

        try {
          for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
            var entry = _step11.value;

            if (!this.state.all_selected_items.includes(entry.unique_id)) {
              new_console_items.push(entry);
            }
          }
        } catch (err) {
          _iterator11.e(err);
        } finally {
          _iterator11.f();
        }

        this._clear_all_selected_items(function () {
          _this11.props.setMainStateValue("console_items", new_console_items);
        });
      }
    }
  }, {
    key: "_closeConsoleItem",
    value: function _closeConsoleItem(unique_id) {
      var _this12 = this;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      var cindex = this._consoleItemIndex(unique_id);

      var new_console_items = _toConsumableArray(this.props.console_items);

      new_console_items.splice(cindex, 1);

      this._dselectOneItem(unique_id, function () {
        _this12.props.setMainStateValue("console_items", new_console_items, callback);
      });
    }
  }, {
    key: "_addConsoleEntries",
    value: function _addConsoleEntries(new_entries) {
      var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var set_focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var unique_id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var self = this;
      _lodash["default"].last(new_entries).set_focus = set_focus;

      var last_id = _lodash["default"].last(new_entries).unique_id;

      var insert_index;

      if (unique_id) {
        insert_index = this._consoleItemIndex(unique_id) + 1;
      } else if (this.state.all_selected_items.length == 0) {
        insert_index = this.props.console_items.length;
      } else {
        insert_index = this._consoleItemIndex(this._currently_selected()) + 1;
      }

      var new_console_items = _toConsumableArray(this.props.console_items);

      new_console_items.splice.apply(new_console_items, [insert_index, 0].concat(_toConsumableArray(new_entries)));
      this.props.setMainStateValue("console_items", new_console_items, function () {
        if (force_open) {
          self.props.setMainStateValue("console_is_shrunk", false, function () {
            self._selectConsoleItem(last_id, null, callback);
          });
        } else {
          self._selectConsoleItem(last_id, null, callback);
        }
      });
    }
  }, {
    key: "_addConsoleEntry",
    value: function _addConsoleEntry(new_entry) {
      var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var set_focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var unique_id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

      this._addConsoleEntries([new_entry], force_open, set_focus, unique_id, callback);
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
    key: "_setConsoleItemOutput",
    value: function _setConsoleItemOutput(data) {
      this._setConsoleItemValue(data.console_id, "output_text", data.message);
    }
  }, {
    key: "_addToLog",
    value: function _addToLog(new_line) {
      var log_content = this.state.console_error_log_text;
      var log_list = log_content.split(/\r?\n/);
      var mlines = this.state.max_console_lines;

      if (log_list.length >= mlines) {
        log_list = log_list.slice(-1 * mlines + 1);
        log_content = log_list.join("\n");
      }

      this.setState({
        "console_error_log_text": log_content + new_line
      });
    }
  }, {
    key: "_bodyHeight",
    value: function _bodyHeight() {
      if (this.state.mounted && this.body_ref && this.body_ref.current) {
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
      var _this13 = this;

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
        icon: "header",
        onClick: this._addBlankDivider,
        text: "New Section Divider"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: function onClick() {
          _this13._pasteCell();
        },
        text: "Paste Cells"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
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
      this._clear_all_selected_items();

      e.stopPropagation();
    }
  }, {
    key: "_handleSearchFieldChange",
    value: function _handleSearchFieldChange(event) {
      var _this14 = this;

      if (this.state.search_helper_text) {
        this.setState({
          "search_helper_text": null
        }, function () {
          _this14._setSearchString(event.target.value);
        });
      } else {
        this._setSearchString(event.target.value);
      }
    }
  }, {
    key: "_are_selected",
    value: function _are_selected() {
      return this.state.all_selected_items.length > 0;
    }
  }, {
    key: "_setSearchString",
    value: function _setSearchString(val) {
      var _this15 = this;

      var self = this;
      var nval = val == "" ? null : val;
      var replace_dicts = [];
      this.setState({
        search_string: nval
      }, function () {
        if (self._are_selected()) {
          var _iterator12 = _createForOfIteratorHelper(_this15.state.all_selected_items),
              _step12;

          try {
            for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
              var uid = _step12.value;
              replace_dicts.push({
                unique_id: uid,
                field: "search_string",
                value: _this15.state.search_string
              });
            }
          } catch (err) {
            _iterator12.e(err);
          } finally {
            _iterator12.f();
          }

          _this15._multiple_console_item_updates(replace_dicts);
        }
      });
    }
  }, {
    key: "_handleUnFilter",
    value: function _handleUnFilter() {
      var _this16 = this;

      this.setState({
        filter_console_items: false,
        search_helper_text: null
      }, function () {
        _this16._setSearchString(null);
      });
    }
  }, {
    key: "_handleFilter",
    value: function _handleFilter() {
      var _this17 = this;

      var new_console_items = _toConsumableArray(this.props.console_items);

      var _iterator13 = _createForOfIteratorHelper(new_console_items),
          _step13;

      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var entry = _step13.value;

          if (entry.type == "code" || entry.type == "text") {
            entry["show_on_filtered"] = entry.console_text.toLowerCase().includes(this.state.search_string.toLowerCase());
          } else if (entry.type == "divider") {
            entry["show_on_filtered"] = true;
          }
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }

      this.props.setMainStateValue("console_items", new_console_items, function () {
        _this17.setState({
          filter_console_items: true
        });
      });
    }
  }, {
    key: "_searchNext",
    value: function _searchNext() {
      var _this18 = this;

      var current_index;
      var self = this;

      if (!this._are_selected()) {
        current_index = 0;
      } else {
        current_index = this._consoleItemIndex(this._currently_selected()) + 1;
      }

      var _loop2 = function _loop2() {
        var entry = _this18.props.console_items[current_index];

        if (entry.type == "code" || entry.type == "text") {
          if (_this18._selectIfMatching(entry, "console_text", function () {
            if (entry.type == "text") {
              self._setConsoleItemValue(entry.unique_id, "show_markdown", false);
            }
          })) {
            _this18.setState({
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
            self._selectConsoleItem(entry.unique_id, null, callback);
          });
        } else {
          this._selectConsoleItem(entry.unique_id, null, callback);
        }

        return true;
      }

      return false;
    }
  }, {
    key: "_searchPrevious",
    value: function _searchPrevious() {
      var _this19 = this;

      var current_index;
      var self = this;

      if (!this._are_selected()) {
        current_index = this.props.console_items.length - 1;
      } else {
        current_index = this._consoleItemIndex(this._currently_selected()) - 1;
      }

      var _loop3 = function _loop3() {
        var entry = _this19.props.console_items[current_index];

        if (entry.type == "code" || entry.type == "text") {
          if (_this19._selectIfMatching(entry, "console_text", function () {
            if (entry.type == "text") {
              self._setConsoleItemValue(entry.unique_id, "show_markdown", false);
            }
          })) {
            _this19.setState({
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
          name_text: "Section Divider",
          icon_name: "header",
          click_handler: this._addBlankDivider
        }, {
          name_text: "Resource Link",
          icon_name: "link",
          click_handler: this._insertResourceLink
        }],
        Edit: [{
          name_text: "Copy All",
          icon_name: "duplicate",
          click_handler: function click_handler() {
            self._copyAll();
          }
        }, {
          name_text: "Copy Selected",
          icon_name: "duplicate",
          click_handler: function click_handler() {
            self._copyCell();
          }
        }, {
          name_text: "Paste Cells",
          icon_name: "clipboard",
          click_handler: function click_handler() {
            self._pasteCell();
          }
        }, {
          name_text: "Delete Selected",
          icon_name: "trash",
          click_handler: function click_handler() {
            self._deleteSelected();
          }
        }, {
          name_text: "divider1",
          icon_name: null,
          click_handler: "divider"
        }, {
          name_text: "Copy Section",
          icon_name: "duplicate",
          click_handler: function click_handler() {
            self._copySection();
          }
        }, {
          name_text: "Delete Section",
          icon_name: "trash",
          click_handler: function click_handler() {
            self._deleteSection();
          }
        }, {
          name_text: "divider2",
          icon_name: null,
          click_handler: "divider"
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

      if (!this._are_selected() || this.state.all_selected_items.length != 1) {
        items.push("Run Selected");
        items.push("Copy Section");
        items.push("Delete Section");
      }

      if (this.state.all_selected_items.length == 1) {
        var unique_id = this.state.all_selected_items[0];
        var entry = this.get_console_item_entry(unique_id);

        if (entry.type != "divider") {
          items.push("Copy Section");
          items.push("Delete Section");
        }
      }

      if (!this._are_selected()) {
        items.push("Copy Selected");
        items.push("Delete Selected");
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

      if (this._are_selected() && this.state.all_selected_items.length == 1) {
        var entry = this.get_console_item_entry(this._currently_selected());

        if (entry.type == "code") {
          this._runCodeItem(this._currently_selected());
        } else if (entry.type == "text") {
          this._showTextItemMarkdown(this._currently_selected());
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
    key: "_logExec",
    value: function _logExec(command) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var self = this;
      (0, _communication_react.postWithCallback)(self.pseudo_tile_id, "os_command_exec", {
        "the_code": command
      }, callback);
    }
  }, {
    key: "_hideNonDividers",
    value: function _hideNonDividers() {
      var nodeList = document.querySelectorAll(".log-panel:not(.divider-log-panel)");

      for (var i = 0; i < nodeList.length; i++) {
        nodeList[i].style.height = 0;
      }
    }
  }, {
    key: "_showNonDividers",
    value: function _showNonDividers() {
      var nodeList = document.querySelectorAll(".log-panel:not(.divider-log-panel)");

      for (var i = 0; i < nodeList.length; i++) {
        nodeList[i].style.height = null;
      }
    }
  }, {
    key: "_sortStart",
    value: function _sortStart(data, event) {
      event.preventDefault();
      var self = this;
      var unique_id = data.node.id;

      var idx = this._consoleItemIndex(unique_id);

      var entry = this.props.console_items[idx];

      if (entry.type == "divider") {
        this._hideNonDividers();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this20 = this;

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

      var key_bindings = [[["escape"], function () {
        _this20._clear_all_selected_items();
      }]];
      var filtered_items = [];
      var in_closed_section = false;

      var _iterator14 = _createForOfIteratorHelper(this.props.console_items),
          _step14;

      try {
        for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
          var _entry = _step14.value;

          if (_entry.type == "divider" && _entry.am_shrunk) {
            in_closed_section = true;
            filtered_items.push(_entry);
          }

          if (_entry.type == "divider" && !_entry.am_shrunk) {
            in_closed_section = false;
            filtered_items.push(_entry);
          } else if (!in_closed_section) {
            filtered_items.push(_entry);
          }
        }
      } catch (err) {
        _iterator14.e(err);
      } finally {
        _iterator14.f();
      }

      if (this.state.filter_console_items) {
        var new_filtered_items = [];

        var _iterator15 = _createForOfIteratorHelper(filtered_items),
            _step15;

        try {
          for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
            var entry = _step15.value;

            if (entry.show_on_filtered) {
              new_filtered_items.push(entry);
            }
          }
        } catch (err) {
          _iterator15.e(err);
        } finally {
          _iterator15.f();
        }

        filtered_items = new_filtered_items;
      }

      var suggestionGlyphs = [];

      if (this.state.show_console_error_log) {
        suggestionGlyphs.push({
          intent: "primary",
          handleClick: this._toggleMainLog,
          icon: "console"
        });
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
        suggestionGlyphs: suggestionGlyphs,
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
      })))), !this.props.console_is_shrunk && !this.state.show_console_error_log && /*#__PURE__*/_react["default"].createElement(_search_form.FilterSearchForm, {
        search_string: this.state.search_string,
        handleSearchFieldChange: this._handleSearchFieldChange,
        handleFilter: this._handleFilter,
        handleUnFilter: this._handleUnFilter,
        searchNext: this._searchNext,
        searchPrevious: this._searchPrevious,
        search_helper_text: this.state.search_helper_text
      }), !this.props.console_is_shrunk && this.state.show_console_error_log && /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
        log_content: this.state.console_error_log_text,
        setMaxConsoleLines: this._setMaxConsoleLines,
        inner_ref: this.body_ref,
        outer_style: {
          overflowX: "auto",
          overflowY: "auto",
          height: this._bodyHeight(),
          marginLeft: 20,
          marginRight: 20
        },
        clearConsole: this._setLogSince,
        commandExec: this.state.console_log_showing == "pseudo" ? this._logExec : null
      }), !this.props.console_is_shrunk && !this.state.show_console_error_log && /*#__PURE__*/_react["default"].createElement("div", {
        id: "console",
        ref: this.body_ref,
        className: "contingent-scroll",
        onClick: this._clickConsoleBody,
        style: {
          height: this._bodyHeight()
        }
      }, !this.state.show_console_error_log && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_sortable_container.SortableComponent, {
        id: "console-items-div",
        main_id: this.props.main_id,
        ElementComponent: SSuperItem,
        key_field_name: "unique_id",
        item_list: filtered_items,
        helperClass: this.props.dark_theme ? "bp4-dark" : "light-theme",
        handle: ".console-sorter",
        onSortStart: this._sortStart // This prevents Safari weirdness
        ,
        onSortEnd: function onSortEnd(data, event) {
          _this20._resortConsoleItems(data, filtered_items, _this20._showNonDividers);
        },
        hideSortableGhost: true,
        pressDelay: 100,
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
        addNewDividerItem: this._addBlankDivider,
        copyCell: this._copyCell,
        pasteCell: this._pasteCell,
        copySection: this._copySection,
        deleteSection: this._deleteSection,
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
var ConsoleComponent = (0, _core.ContextMenuTarget)(RawConsoleComponent);
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
    value: function render() {
      switch (this.props.type) {
        case "text":
          return /*#__PURE__*/_react["default"].createElement(ConsoleTextItem, this.props);

        case "code":
          return /*#__PURE__*/_react["default"].createElement(ConsoleCodeItem, this.props);

        case "fixed":
          return /*#__PURE__*/_react["default"].createElement(LogItem, this.props);

        case "divider":
          return /*#__PURE__*/_react["default"].createElement(DividerItem, this.props);

        default:
          return null;
      }
    }
  }]);

  return SuperItem;
}(_react["default"].PureComponent);

var SSuperItem = (0, _sortable_container.MySortableElement)(SuperItem);
var divider_item_update_props = ["am_shrunk", "am_selected", "header_text", "console_available_width"];

var RawDividerItem = /*#__PURE__*/function (_React$Component) {
  _inherits(RawDividerItem, _React$Component);

  var _super4 = _createSuper(RawDividerItem);

  function RawDividerItem(props) {
    var _this21;

    _classCallCheck(this, RawDividerItem);

    _this21 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this21), "_", RawDividerItem.prototype);
    _this21.update_props = divider_item_update_props;
    _this21.update_state_vars = [];
    _this21.state = {};
    return _this21;
  }

  _createClass(RawDividerItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _iterator16 = _createForOfIteratorHelper(this.update_props),
          _step16;

      try {
        for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
          var prop = _step16.value;

          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator16.e(err);
      } finally {
        _iterator16.f();
      }

      return false;
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
    key: "_handleHeaderTextChange",
    value: function _handleHeaderTextChange(value) {
      this.props.setConsoleItemValue(this.props.unique_id, "header_text", value);
    }
  }, {
    key: "_copyMe",
    value: function _copyMe() {
      this.props.copyCell(this.props.unique_id);
    }
  }, {
    key: "_copySection",
    value: function _copySection() {
      this.props.copySection(this.props.unique_id);
    }
  }, {
    key: "_deleteSection",
    value: function _deleteSection() {
      this.props.deleteSection(this.props.unique_id);
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      this.props.pasteCell(this.props.unique_id);
    }
  }, {
    key: "_selectMe",
    value: function _selectMe() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.props.selectConsoleItem(this.props.unique_id, e, callback);
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      var self = this;

      this._selectMe(null, function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankDivider",
    value: function _addBlankDivider() {
      var self = this;

      this._selectMe(null, function () {
        self.props.addNewDividerItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;

      this._selectMe(null, function () {
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
        text: "Copy Divider"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "duplicate",
        onClick: this._copySection,
        text: "Copy Section"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: this._pasteCell,
        text: "Paste Cells"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "header",
        onClick: this._addBlankDivider,
        text: "New Section Divider"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteMe,
        intent: "danger",
        text: "Delete Divider"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteSection,
        intent: "danger",
        text: "Delete Whole Section"
      }));
    }
  }, {
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      this._selectMe(e);

      e.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var converted_dict = {
        __html: this.props.console_text
      };
      var panel_class = this.props.am_shrunk ? "log-panel divider-log-panel log-panel-invisible fixed-log-panel" : "log-panel divider-log-panel log-panel-visible fixed-log-panel";

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
      })), /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
        value: this.props.header_text,
        onChange: this._handleHeaderTextChange,
        className: "console-divider-text"
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._deleteMe,
        intent: "danger",
        tooltip: "Delete this item",
        style: {
          marginLeft: 10,
          marginRight: 66,
          minHeight: 0
        },
        icon: "trash"
      })));
    }
  }]);

  return RawDividerItem;
}(_react["default"].Component);

var DividerItem = (0, _core.ContextMenuTarget)(RawDividerItem);
var section_end_item_update_props = ["am_selected", "console_available_width"];

var RawSectionEndItem = /*#__PURE__*/function (_React$Component2) {
  _inherits(RawSectionEndItem, _React$Component2);

  var _super5 = _createSuper(RawSectionEndItem);

  function RawSectionEndItem(props) {
    var _this22;

    _classCallCheck(this, RawSectionEndItem);

    _this22 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this22), "_", RawDividerItem.prototype);
    _this22.update_props = section_end_item_update_props;
    _this22.update_state_vars = [];
    _this22.state = {};
    return _this22;
  }

  _createClass(RawSectionEndItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _iterator17 = _createForOfIteratorHelper(this.update_props),
          _step17;

      try {
        for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
          var prop = _step17.value;

          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator17.e(err);
      } finally {
        _iterator17.f();
      }

      return false;
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      this.props.pasteCell(this.props.unique_id);
    }
  }, {
    key: "_selectMe",
    value: function _selectMe() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.props.selectConsoleItem(this.props.unique_id, e, callback);
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      var self = this;

      this._selectMe(null, function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankDivider",
    value: function _addBlankDivider() {
      var self = this;

      this._selectMe(null, function () {
        self.props.addNewDividerItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;

      this._selectMe(null, function () {
        self.props.addNewCodeItem();
      });
    }
  }, {
    key: "renderContextMenu",
    value: function renderContextMenu() {
      // return a single element, or nothing to use default browser behavior
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: this._pasteCell,
        text: "Paste Cells"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "header",
        onClick: this._addBlankDivider,
        text: "New Section Divider"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null));
    }
  }, {
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      this._selectMe(e);

      e.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var panel_class = "log-panel section-end-log-panel log-panel-visible fixed-log-panel";

      if (this.props.am_selected) {
        panel_class += " selected";
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
      }), /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }));
    }
  }]);

  return RawSectionEndItem;
}(_react["default"].Component);

var SectionEndItem = (0, _core.ContextMenuTarget)(RawSectionEndItem);
var log_item_update_props = ["is_error", "am_shrunk", "am_selected", "summary_text", "console_text", "console_available_width"];

var RawLogItem = /*#__PURE__*/function (_React$Component3) {
  _inherits(RawLogItem, _React$Component3);

  var _super6 = _createSuper(RawLogItem);

  function RawLogItem(props) {
    var _this23;

    _classCallCheck(this, RawLogItem);

    _this23 = _super6.call(this, props);
    _this23.ce_summary0ref = /*#__PURE__*/_react["default"].createRef();
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this23), "_", RawLogItem.prototype);
    _this23.update_props = log_item_update_props;
    _this23.update_state_vars = [];
    _this23.state = {
      selected: false
    };
    _this23.last_output_text = "";
    return _this23;
  }

  _createClass(RawLogItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _iterator18 = _createForOfIteratorHelper(this.update_props),
          _step18;

      try {
        for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
          var prop = _step18.value;

          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator18.e(err);
      } finally {
        _iterator18.f();
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

        var _iterator19 = _createForOfIteratorHelper(scripts),
            _step19;

        try {
          for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
            var script = _step19.value;

            try {
              window.eval(script.text);
            } catch (e) {}
          }
        } catch (err) {
          _iterator19.e(err);
        } finally {
          _iterator19.f();
        }
      }
    }
  }, {
    key: "makeTablesSortable",
    value: function makeTablesSortable() {
      var tables = $("#" + this.props.unique_id + " table.sortable").toArray();

      var _iterator20 = _createForOfIteratorHelper(tables),
          _step20;

      try {
        for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
          var table = _step20.value;
          sorttable.makeSortable(table);
        }
      } catch (err) {
        _iterator20.e(err);
      } finally {
        _iterator20.f();
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
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.props.selectConsoleItem(this.props.unique_id, e, callback);
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      var self = this;

      this._selectMe(null, function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankDivider",
    value: function _addBlankDivider() {
      var self = this;

      this._selectMe(null, function () {
        self.props.addNewDividerItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;

      this._selectMe(null, function () {
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
        text: "Paste Cells"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "header",
        onClick: this._addBlankDivider,
        text: "New Section Divider"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteMe,
        intent: "danger",
        text: "Delete Cell"
      }));
    }
  }, {
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      this._selectMe(e);

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
var LogItem = (0, _core.ContextMenuTarget)(RawLogItem);
var code_item_update_props = ["am_shrunk", "set_focus", "am_selected", "search_string", "summary_text", "console_text", "show_spinner", "execution_count", "output_text", "console_available_width", "dark_theme"];

var RawConsoleCodeItem = /*#__PURE__*/function (_React$Component4) {
  _inherits(RawConsoleCodeItem, _React$Component4);

  var _super7 = _createSuper(RawConsoleCodeItem);

  function RawConsoleCodeItem(props) {
    var _this24;

    _classCallCheck(this, RawConsoleCodeItem);

    _this24 = _super7.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this24), "_", RawConsoleCodeItem.prototype);
    _this24.cmobject = null;
    _this24.elRef = /*#__PURE__*/_react["default"].createRef();
    _this24.update_props = code_item_update_props;
    _this24.update_state_vars = [];
    _this24.state = {};
    _this24.last_output_text = "";
    return _this24;
  }

  _createClass(RawConsoleCodeItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _iterator21 = _createForOfIteratorHelper(this.update_props),
          _step21;

      try {
        for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
          var prop = _step21.value;

          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator21.e(err);
      } finally {
        _iterator21.f();
      }

      return false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this25 = this;

      if (this.props.set_focus) {
        if (this.cmobject != null) {
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
          self.props.setFocus(_this25.props.unique_id, self._selectMe);
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
          this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
        }
      }
    }
  }, {
    key: "executeEmbeddedScripts",
    value: function executeEmbeddedScripts() {
      if (this.props.output_text != this.last_output_text) {
        // to avoid doubles of bokeh images
        this.last_output_text = this.props.output_text;
        var scripts = $("#" + this.props.unique_id + " .log-code-output script").toArray(); // $("#" + this.props.unique_id + " .bk-root").html(""); // This is a kluge to deal with bokeh double images

        var _iterator22 = _createForOfIteratorHelper(scripts),
            _step22;

        try {
          for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
            var script = _step22.value;

            // noinspection EmptyCatchBlockJS,UnusedCatchParameterJS
            try {
              window.eval(script.text);
            } catch (e) {}
          }
        } catch (err) {
          _iterator22.e(err);
        } finally {
          _iterator22.f();
        }
      }
    }
  }, {
    key: "makeTablesSortable",
    value: function makeTablesSortable() {
      var tables = $("#" + this.props.unique_id + " table.sortable").toArray();

      var _iterator23 = _createForOfIteratorHelper(tables),
          _step23;

      try {
        for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
          var table = _step23.value;
          sorttable.makeSortable(table);
        }
      } catch (err) {
        _iterator23.e(err);
      } finally {
        _iterator23.f();
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
      var _this26 = this;

      var self = this;
      return {
        'Ctrl-Enter': function CtrlEnter() {
          return self.props.runCodeItem(_this26.props.unique_id, true);
        },
        'Cmd-Enter': function CmdEnter() {
          return self.props.runCodeItem(_this26.props.unique_id, true);
        },
        'Ctrl-C': self.props.addNewCodeItem,
        'Ctrl-T': self.props.addNewTextItem
      };
    }
  }, {
    key: "_setCMObject",
    value: function _setCMObject(cmobject) {
      this.cmobject = cmobject;

      if (this.props.set_focus) {
        this.cmobject.focus();
        this.cmobject.setCursor({
          line: 0,
          ch: 0
        });
        this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
      }
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
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.props.selectConsoleItem(this.props.unique_id, e, callback);
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      var self = this;

      this._selectMe(null, function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankDivider",
    value: function _addBlankDivider() {
      var self = this;

      this._selectMe(null, function () {
        self.props.addNewDividerItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;

      this._selectMe(null, function () {
        self.props.addNewCodeItem();
      });
    }
  }, {
    key: "renderContextMenu",
    value: function renderContextMenu() {
      var _this27 = this;

      // return a single element, or nothing to use default browser behavior
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, !this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "play",
        intent: "success",
        onClick: function onClick() {
          _this27.props.runCodeItem(_this27.props.unique_id);
        },
        text: "Run Cell"
      }), this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "stop",
        intent: "danger",
        onClick: this._stopMe,
        text: "Stop Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "header",
        onClick: this._addBlankDivider,
        text: "New Section Divider"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "duplicate",
        onClick: this._copyMe,
        text: "Copy Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: this._pasteCell,
        text: "Paste Cells"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteMe,
        intent: "danger",
        text: "Delete Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clean",
        intent: "warning",
        onClick: function onClick() {
          _this27._clearOutput();
        },
        text: "Clear Output"
      }));
    }
  }, {
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      this._selectMe(e);

      e.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var _this28 = this;

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
      })), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
        value: this.props.summary_text ? this.props.summary_text : this._getFirstLine(),
        onChange: this._handleSummaryTextChange,
        className: "log-panel-summary code-panel-summary"
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
          _this28.props.runCodeItem(_this28.props.unique_id);
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
        am_selected: this.props.am_selected,
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
          _this28._clearOutput();
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
  execution_count: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  console_available_width: _propTypes["default"].number,
  setConsoleItemValue: _propTypes["default"].func,
  selectConsoleItem: _propTypes["default"].func,
  handleDelete: _propTypes["default"].func,
  addNewTextItem: _propTypes["default"].func,
  addNewCodeItem: _propTypes["default"].func,
  addNewDividerItem: _propTypes["default"].func,
  goToNextCell: _propTypes["default"].func,
  setFocus: _propTypes["default"].func,
  runCodeItem: _propTypes["default"].func
};
RawConsoleCodeItem.defaultProps = {
  summary_text: null
};
var ConsoleCodeItem = (0, _core.ContextMenuTarget)(RawConsoleCodeItem);

var ResourceLinkButton = /*#__PURE__*/function (_React$PureComponent4) {
  _inherits(ResourceLinkButton, _React$PureComponent4);

  var _super8 = _createSuper(ResourceLinkButton);

  function ResourceLinkButton(props) {
    var _this29;

    _classCallCheck(this, ResourceLinkButton);

    _this29 = _super8.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this29));
    _this29.my_view = (0, _library_pane.view_views)(false)[props.res_type];

    if (window.in_context) {
      var re = new RegExp("/$");
      _this29.my_view = _this29.my_view.replace(re, "_in_context");
    }

    return _this29;
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

var RawConsoleTextItem = /*#__PURE__*/function (_React$Component5) {
  _inherits(RawConsoleTextItem, _React$Component5);

  var _super9 = _createSuper(RawConsoleTextItem);

  function RawConsoleTextItem(props) {
    var _this30;

    _classCallCheck(this, RawConsoleTextItem);

    _this30 = _super9.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this30), "_", RawConsoleTextItem.prototype);
    _this30.cmobject = null;
    _this30.elRef = /*#__PURE__*/_react["default"].createRef();
    _this30.ce_summary_ref = /*#__PURE__*/_react["default"].createRef();
    _this30.update_props = text_item_update_props;
    _this30.update_state_vars = ["ce_ref"];
    _this30.previous_dark_theme = props.dark_theme;
    _this30.state = {
      ce_ref: null
    };
    return _this30;
  }

  _createClass(RawConsoleTextItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _iterator24 = _createForOfIteratorHelper(this.update_props),
          _step24;

      try {
        for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
          var prop = _step24.value;

          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator24.e(err);
      } finally {
        _iterator24.f();
      }

      var _iterator25 = _createForOfIteratorHelper(this.update_state_vars),
          _step25;

      try {
        for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
          var state_var = _step25.value;

          if (nextState[state_var] != this.state[state_var]) {
            return true;
          }
        }
      } catch (err) {
        _iterator25.e(err);
      } finally {
        _iterator25.f();
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
      var _this31 = this;

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
          self.props.setFocus(_this31.props.unique_id, self._selectMe);
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
          this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
        }
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
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.props.selectConsoleItem(this.props.unique_id, e, callback);
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

      this._selectMe(null, function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankDivider",
    value: function _addBlankDivider() {
      var self = this;

      this._selectMe(null, function () {
        self.props.addNewDividerItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;

      this._selectMe(null, function () {
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
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "header",
        onClick: this._addBlankDivider,
        text: "New Section Divider"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
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
        text: "Paste Cells"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteMe,
        intent: "danger",
        text: "Delete Cell"
      }));
    }
  }, {
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      this._selectMe(e);

      e.stopPropagation();
    }
  }, {
    key: "_setCMObject",
    value: function _setCMObject(cmobject) {
      this.cmobject = cmobject;

      if (this.props.set_focus) {
        this.cmobject.focus();
        this.cmobject.setCursor({
          line: 0,
          ch: 0
        });
        this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
      }
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
      var _this32 = this;

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
          handleCreateViewer: _this32.props.handleCreateViewer,
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
      })), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
        value: this.props.summary_text ? this.props.summary_text : this._getFirstLine(),
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
        am_selected: this.props.am_selected,
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
  summary_text: null,
  links: []
};
var ConsoleTextItem = (0, _core.ContextMenuTarget)(RawConsoleTextItem);
var all_update_props = {
  "text": text_item_update_props,
  "code": code_item_update_props,
  "fixed": log_item_update_props
};