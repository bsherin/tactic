"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportsViewer = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _blueprint_react_widgets = require("./blueprint_react_widgets.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _utilities_react = require("./utilities_react.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

var TextIcon = /*#__PURE__*/function (_React$Component) {
  _inherits(TextIcon, _React$Component);

  var _super = _createSuper(TextIcon);

  function TextIcon() {
    _classCallCheck(this, TextIcon);

    return _super.apply(this, arguments);
  }

  _createClass(TextIcon, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("span", {
        className: "bp4-icon",
        style: {
          fontWeight: 500
        }
      }, this.props.the_text));
    }
  }]);

  return TextIcon;
}(_react["default"].Component);

TextIcon.propTypes = {
  the_text: _propTypes["default"].string
};
var export_icon_dict = {
  str: "font",
  list: "array",
  range: "array",
  dict: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "{#}"
  }),
  set: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "{..}"
  }),
  tuple: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "(..)"
  }),
  bool: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "tf"
  }),
  bytes: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "b"
  }),
  NoneType: "small-cross",
  "int": "numerical",
  "float": "numerical",
  complex: "numerical",
  "function": "function",
  TacticDocument: "th",
  DetachedTacticDocument: "th",
  TacticCollection: "database",
  DetachedTacticCollection: "database",
  DetachedTacticRow: "th-derived",
  TacticRow: "th-derived",
  ndarray: "array-numeric",
  DataFrame: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "df"
  }),
  other: "cube",
  unknown: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "?"
  })
};

var ExportButtonListButton = /*#__PURE__*/function (_React$Component2) {
  _inherits(ExportButtonListButton, _React$Component2);

  var _super2 = _createSuper(ExportButtonListButton);

  function ExportButtonListButton(props) {
    var _this;

    _classCallCheck(this, ExportButtonListButton);

    _this = _super2.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "return", void 0);

    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(ExportButtonListButton, [{
    key: "_onPressed",
    value: function _onPressed() {
      this.props.buttonPress(this.props.fullname);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.Button, {
        className: "export-button",
        icon: export_icon_dict[this.props.type],
        minimal: false,
        onClick: this._onPressed,
        key: this.props.fullname,
        active: this.props.active,
        small: true,
        value: this.props.fullname,
        text: this.props.shortname
      });
    }
  }]);

  return ExportButtonListButton;
}(_react["default"].Component);

ExportButtonListButton.propTypes = {
  fullname: _propTypes["default"].string,
  shortname: _propTypes["default"].string,
  type: _propTypes["default"].string,
  buttonPress: _propTypes["default"].func,
  active: _propTypes["default"].bool
};

var ExportButtonList = /*#__PURE__*/function (_React$Component3) {
  _inherits(ExportButtonList, _React$Component3);

  var _super3 = _createSuper(ExportButtonList);

  function ExportButtonList(props) {
    var _this2;

    _classCallCheck(this, ExportButtonList);

    _this2 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    _this2.select_ref = null;
    _this2.export_index = {};
    return _this2;
  }

  _createClass(ExportButtonList, [{
    key: "_buttonPress",
    value: function _buttonPress(fullname) {
      this.props.handleChange(fullname, this.export_index[fullname].shortname, this.export_index[fullname].tilename);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.select_ref) {
        var currently_selected = this.select_ref.value;

        if (currently_selected && currently_selected != this.props.value) {
          this.props.handleChange(currently_selected, this.export_index[currently_selected].shortname, this.export_index[currently_selected].tilename);
        }
      }
    }
  }, {
    key: "_compareEntries",
    value: function _compareEntries(a, b) {
      if (a[1].toLowerCase() == b[1].toLowerCase()) return 0;
      if (b[1].toLowerCase() > a[1].toLowerCase()) return -1;
      return 1;
    }
  }, {
    key: "create_groups",
    value: function create_groups() {
      var groups = [];
      var group_names = Object.keys(this.props.pipe_dict);
      group_names.sort();
      var index = 0;

      for (var _i = 0, _group_names = group_names; _i < _group_names.length; _i++) {
        var group = _group_names[_i];
        var group_items = [];
        var entries = this.props.pipe_dict[group];
        entries.sort(this._compareEntries);

        var _iterator = _createForOfIteratorHelper(entries),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var entry = _step.value;
            var fullname = entry[0];
            var shortname = entry[1];
            var type = entry.length == 3 ? entry[2] : "unknown";

            if (!(type in export_icon_dict)) {
              type = "other";
            }

            this.export_index[fullname] = {
              tilename: group,
              shortname: shortname
            };
            group_items.push( /*#__PURE__*/_react["default"].createElement(ExportButtonListButton, {
              fullname: fullname,
              key: fullname,
              shortname: shortname,
              type: type,
              active: this.props.value == fullname,
              buttonPress: this._buttonPress
            }));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        if (group == "__log__") {
          groups.unshift( /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
            key: group,
            inline: false,
            label: null,
            className: "export-label"
          }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
            minimal: false,
            vertical: true,
            alignText: "left",
            key: group
          }, group_items)));
        } else {
          groups.push( /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
            key: group,
            inline: false,
            label: group,
            className: "export-label"
          }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
            minimal: false,
            vertical: true,
            alignText: "left",
            key: group
          }, group_items)));
        }
      }

      return groups;
    }
  }, {
    key: "_handleSelectRef",
    value: function _handleSelectRef(the_ref) {
      this.select_ref = the_ref;
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        id: "exports-button-list",
        style: {
          flexDirection: "column",
          display: "inline-block",
          verticalAlign: "top",
          padding: 15,
          height: this.props.body_height
        },
        className: "contingent-scroll"
      }, this.create_groups());
    }
  }]);

  return ExportButtonList;
}(_react["default"].Component);

ExportButtonList.propTypes = {
  pipe_dict: _propTypes["default"].object,
  body_height: _propTypes["default"].number,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  handleChange: _propTypes["default"].func
};

var ExportsViewer = /*#__PURE__*/function (_React$Component4) {
  _inherits(ExportsViewer, _React$Component4);

  var _super4 = _createSuper(ExportsViewer);

  function ExportsViewer(props) {
    var _this3;

    _classCallCheck(this, ExportsViewer);

    _this3 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    _this3.header_ref = /*#__PURE__*/_react["default"].createRef();
    _this3.footer_ref = /*#__PURE__*/_react["default"].createRef();
    _this3.state = {
      selected_export: "",
      selected_export_tilename: null,
      key_list: null,
      key_list_value: null,
      tail_value: "",
      max_rows: 25,
      exports_info_value: null,
      selected_export_short_name: null,
      show_spinner: false,
      running: false,
      exports_body_value: "",
      type: null,
      pipe_dict: {}
    };

    _this3.initSocket();

    return _this3;
  }

  _createClass(ExportsViewer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.setUpdate(this._updateExportsList);

      this._updateExportsList();
    }
  }, {
    key: "initSocket",
    value: function initSocket() {
      this.props.tsocket.attachListener("export-viewer-message", this._handleExportViewerMessage);
    }
  }, {
    key: "_handleExportViewerMessage",
    value: function _handleExportViewerMessage(data) {
      if (data.main_id == this.props.main_id) {
        var self = this;
        var handlerDict = {
          update_exports_popup: function update_exports_popup() {
            return self._updateExportsList();
          },
          display_result: self._displayResult,
          showMySpinner: self._showMySpinner,
          stopMySpinner: self._stopMySpinner,
          startMySpinner: self._startMySpinner,
          got_export_info: self._gotExportInfo
        };
        handlerDict[data.export_viewer_message](data);
      }
    }
  }, {
    key: "_handleMaxRowsChange",
    value: function _handleMaxRowsChange(new_value) {
      this.setState({
        max_rows: new_value
      }, this._eval);
    }
  }, {
    key: "_updateExportsList",
    value: function _updateExportsList() {
      var self = this;
      (0, _communication_react.postWithCallback)(this.props.main_id, "get_full_pipe_dict", {}, function (data) {
        self.setState({
          pipe_dict: data.pipe_dict,
          pipe_dict_updated: true
        });
      }, null, this.props.main_id);
    }
  }, {
    key: "_refresh",
    value: function _refresh() {
      this._handleExportListChange(this.state.selected_export, this.state.selected_export_short_name, true);
    }
  }, {
    key: "_displayResult",
    value: function _displayResult(data) {
      this.setState({
        exports_body_value: data.the_html,
        show_spinner: false,
        running: false
      });
    }
  }, {
    key: "_eval",
    value: function _eval() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      this._showMySpinner();

      var send_data = {
        "export_name": this.state.selected_export,
        "tail": this.state.tail_value,
        "max_rows": this.state.max_rows
      };

      if (this.state.key_list) {
        send_data.key = this.state.key_list_value;
      }

      (0, _communication_react.postWithCallback)(this.props.main_id, "evaluate_export", send_data, null, null, this.props.main_id);
      if (e) e.preventDefault();
    }
  }, {
    key: "_stopMe",
    value: function _stopMe() {
      this._stopMySpinner();

      (0, _communication_react.postWithCallback)(this.props.main_id, "stop_evaluate_export", {}, null, null, this.props.main_id);
    }
  }, {
    key: "_showMySpinner",
    value: function _showMySpinner() {
      this.setState({
        show_spinner: true
      });
    }
  }, {
    key: "_startMySpinner",
    value: function _startMySpinner() {
      this.setState({
        show_spinner: true,
        running: true
      });
    }
  }, {
    key: "_stopMySpinner",
    value: function _stopMySpinner() {
      this.setState({
        show_spinner: false,
        running: false
      });
    }
  }, {
    key: "_gotExportInfo",
    value: function _gotExportInfo(data) {
      var new_state = {
        type: data.type,
        exports_info_value: data.info_string,
        tail_value: "",
        show_spinner: false,
        running: false
      };

      if (data.hasOwnProperty("key_list")) {
        new_state.key_list = data.key_list;

        if (data.hasOwnProperty("key_list_value")) {
          new_state.key_list_value = data.key_list_value;
        } else {
          if (new_state.key_list.length > 0) {
            new_state.key_list_value = data.key_list[0];
          }
        }
      } else {
        new_state.key_list = null;
        new_state.key_list_value = null;
      }

      this.setState(new_state, this._eval);
    }
  }, {
    key: "_handleExportListChange",
    value: function _handleExportListChange(fullname, shortname, tilename) {
      var force_refresh = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var self = this;
      if (!force_refresh && fullname == this.state.selected_export) return;
      this.setState({
        show_spinner: true,
        selected_export: fullname,
        selected_export_tilename: tilename,
        selected_export_short_name: shortname
      });
      (0, _communication_react.postWithCallback)(this.props.main_id, "get_export_info", {
        "export_name": fullname
      }, null, null, this.props.main_id);
    }
  }, {
    key: "_handleKeyListChange",
    value: function _handleKeyListChange(new_value) {
      this.setState({
        key_list_value: new_value
      }, this._eval);
    }
  }, {
    key: "_handleTailChange",
    value: function _handleTailChange(event) {
      this.setState({
        tail_value: event.target.value
      });
    }
  }, {
    key: "_bodyHeight",
    value: function _bodyHeight() {
      if (this.header_ref && this.header_ref.current && this.footer_ref && this.footer_ref.current) {
        return this.props.available_height - $(this.header_ref.current).outerHeight() - $(this.footer_ref.current).outerHeight();
      } else {
        return this.props.available_height - 75;
      }
    }
  }, {
    key: "_sendToConsole",
    value: function _sendToConsole() {
      var tail = this.state.tail_value;
      var tilename = this.state.selected_export_tilename;
      var shortname = this.state.selected_export_short_name;
      var key_string = "";

      if (!(this.state.key_list == null)) {
        key_string = "[\"".concat(this.state.key_list_value, "\"]");
      }

      var the_text;

      if (tilename == "__log__") {
        the_text = shortname + key_string + tail;
      } else {
        the_text = "Tiles[\"".concat(tilename, "\"][\"").concat(shortname, "\"]") + key_string + tail;
      }

      var self = this;
      (0, _communication_react.postWithCallback)("host", "print_code_area_to_console", {
        "console_text": the_text,
        "user_id": window.user_id,
        "main_id": this.props.main_id
      }, function (data) {
        if (!data.success) {
          (0, _toaster.doFlash)(data);
        }
      }, null, this.props.main_id);
    }
  }, {
    key: "render",
    value: function render() {
      var exports_body_dict = {
        __html: this.state.exports_body_value
      };
      var butclass = "notclose bottom-heading-element bottom-heading-element-button";
      var exports_class = this.props.console_is_shrunk ? "am-shrunk" : "not-shrunk";
      var spinner_val = this.state.running ? null : 0;

      if (this.props.console_is_zoomed) {
        exports_class = "am-zoomed";
      }

      return /*#__PURE__*/_react["default"].createElement(_core.Card, {
        id: "exports-panel",
        elevation: 2,
        className: "mr-3 " + exports_class,
        style: this.props.style
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-column justify-content-around"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        id: "exports-heading",
        ref: this.header_ref,
        className: "d-flex flex-row justify-content-start"
      }, !this.state.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._eval,
        intent: "primary",
        tooltip: "Send code to the console",
        style: {
          marginLeft: 6,
          marginTop: 2
        },
        icon: "play"
      }), this.state.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._stopMe,
        intent: "danger",
        tooltip: "Send code to the console",
        style: {
          marginLeft: 6,
          marginTop: 2
        },
        icon: "stop"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._sendToConsole,
        intent: "primary",
        tooltip: "Send code to the console",
        style: {
          marginLeft: 6,
          marginTop: 2
        },
        icon: "circle-arrow-left"
      }), Object.keys(this.state.pipe_dict).length > 0 && /*#__PURE__*/_react["default"].createElement("form", {
        onSubmit: this._eval,
        className: "d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        id: "selected-export",
        className: "bottom-heading-element mr-2"
      }, this.state.selected_export_short_name), this.state.key_list && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.SelectList, {
        option_list: this.state.key_list,
        onChange: this._handleKeyListChange,
        the_value: this.state.key_list_value,
        minimal: true,
        fontSize: 11
      }), /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        type: "text",
        small: true,
        onChange: this._handleTailChange,
        onSubmit: this._eval,
        value: this.state.tail_value,
        className: "export-tail"
      })), this.state.show_spinner && /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          marginTop: 7,
          marginRight: 10,
          marginLeft: 10
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
        size: 13,
        value: spinner_val
      }))), !this.props.console_is_shrunk && /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex_row"
      }, /*#__PURE__*/_react["default"].createElement(ExportButtonList, {
        pipe_dict: this.state.pipe_dict,
        body_height: this._bodyHeight(),
        value: this.state.selected_export,
        handleChange: this._handleExportListChange
      }), /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement("div", {
        id: "exports-body",
        style: {
          padding: 15,
          width: "80%",
          height: this._bodyHeight(),
          display: "inline-block"
        },
        className: "contingent-scroll",
        dangerouslySetInnerHTML: exports_body_dict
      })), /*#__PURE__*/_react["default"].createElement("div", {
        id: "exports-footing",
        ref: this.footer_ref,
        className: "d-flex flex-row justify-content-between"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        id: "exports-info",
        className: "bottom-heading-element ml-2"
      }, this.state.exports_info_value), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
        label: "max rows",
        inline: true
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.SelectList, {
        option_list: [25, 100, 250, 500],
        onChange: this._handleMaxRowsChange,
        the_value: this.state.max_rows,
        minimal: true,
        fontSize: 11
      }))))));
    }
  }]);

  return ExportsViewer;
}(_react["default"].Component);

exports.ExportsViewer = ExportsViewer;
ExportsViewer.propTypes = {
  available_height: _propTypes["default"].number,
  console_is_shrunk: _propTypes["default"].bool,
  console_is_zoomed: _propTypes["default"].bool,
  setUpdate: _propTypes["default"].func,
  style: _propTypes["default"].object
};
ExportsViewer.defaultProps = {
  style: {}
};