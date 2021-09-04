"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceviewerToolbar = ResourceviewerToolbar;
exports.Namebutton = exports.ToolbarButton = exports.Toolbar = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

require("../css/dzcss/dropzone.css");

require("../css/dzcss/filepicker.css");

require("../css/dzcss/basic.css");

var _core = require("@blueprintjs/core");

var _key_trap = require("./key_trap.js");

var _blueprint_react_widgets = require("./blueprint_react_widgets.js");

var _utilities_react = require("./utilities_react.js");

var _library_widgets = require("./library_widgets");

var _modal_react = require("./modal_react.js");

var _import_dialog = require("./import_dialog.js");

var _toaster = require("./toaster.js");

var _communication_react = require("./communication_react.js");

var _tactic_context = require("./tactic_context.js");

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

var default_button_class = "btn-outline-secondary";
var intent_colors = {
  danger: "#c23030",
  warning: "#bf7326",
  primary: "#106ba3",
  success: "#0d8050",
  regular: "#5c7080"
};

function ResourceviewerToolbar(props, context) {
  var tstyle = {
    "marginTop": 20,
    "paddingRight": 20,
    "width": "100%"
  };
  var toolbar_outer_style = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 7,
    marginBottom: 8
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: tstyle,
    className: "d-flex flex-row justify-content-between"
  }, /*#__PURE__*/_react["default"].createElement(Namebutton, {
    resource_name: props.resource_name,
    setResourceNameState: props.setResourceNameState,
    res_type: props.res_type,
    large: false
  }), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(Toolbar, {
    button_groups: props.button_groups // controlled={props.controlled}
    // am_selected={props.am_selected}
    ,
    alternate_outer_style: toolbar_outer_style // tsocket={context.tsocket}
    // dark_theme={context.dark_theme}

  })), props.show_search && /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    update_search_state: props.update_search_state,
    search_string: props.search_string
  }), !props.show_search && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: 100
    }
  }));
}

ResourceviewerToolbar.propTypes = {
  controlled: _propTypes["default"].bool,
  am_selected: _propTypes["default"].bool,
  button_groups: _propTypes["default"].array,
  setResourceNameState: _propTypes["default"].func,
  resource_name: _propTypes["default"].string,
  show_search: _propTypes["default"].bool,
  search_string: _propTypes["default"].string,
  update_search_state: _propTypes["default"].func,
  res_type: _propTypes["default"].string,
  tsocket: _propTypes["default"].object,
  dark_theme: _propTypes["default"].bool
};
ResourceviewerToolbar.defaultProps = {
  controlled: false,
  am_selected: true
};

var ToolbarButton = /*#__PURE__*/function (_React$Component) {
  _inherits(ToolbarButton, _React$Component);

  var _super = _createSuper(ToolbarButton);

  function ToolbarButton(props) {
    _classCallCheck(this, ToolbarButton);

    return _super.call(this, props);
  }

  _createClass(ToolbarButton, [{
    key: "render",
    value: function render() {
      var _this = this;

      if (this.props.show_text) {
        return /*#__PURE__*/_react["default"].createElement(_core.Button, {
          text: this.props.name_text,
          icon: this.props.icon_name,
          large: false,
          minimal: false,
          onClick: function onClick() {
            return _this.props.click_handler();
          } // className="bp-toolbar-button bp3-elevation-0"

        });
      } else {
        return /*#__PURE__*/_react["default"].createElement(_core.Button, {
          icon: this.props.icon_name // intent={this.props.intent == "regular" ? "primary" : this.props.intent}
          ,
          large: false,
          minimal: false,
          onClick: function onClick() {
            return _this.props.click_handler();
          },
          className: "bp-toolbar-button bp3-elevation-0"
        });
      }
    }
  }]);

  return ToolbarButton;
}(_react["default"].Component);

exports.ToolbarButton = ToolbarButton;
ToolbarButton.propTypes = {
  show_text: _propTypes["default"].bool,
  icon_name: _propTypes["default"].string,
  click_handler: _propTypes["default"].func,
  button_class: _propTypes["default"].string,
  name_text: _propTypes["default"].string,
  small_size: _propTypes["default"].bool,
  intent: _propTypes["default"].string
};
ToolbarButton.defaultProps = {
  small_size: true,
  intent: "regular",
  show_text: false
};
exports.ToolbarButton = ToolbarButton = (0, _blueprint_react_widgets.withTooltip)(ToolbarButton);

var PopupButton = /*#__PURE__*/function (_React$Component2) {
  _inherits(PopupButton, _React$Component2);

  var _super2 = _createSuper(PopupButton);

  function PopupButton(props) {
    var _this2;

    _classCallCheck(this, PopupButton);

    _this2 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(PopupButton, [{
    key: "render",
    value: function render() {
      var menu_items = this.props.option_list.map(function (opt, index) {
        return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
          key: opt.opt_name,
          onClick: opt.opt_func,
          icon: opt.opt_icon,
          text: opt.opt_name
        });
      });

      var the_menu = /*#__PURE__*/_react["default"].createElement(_core.Menu, null, menu_items, " ");

      return /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, /*#__PURE__*/_react["default"].createElement(_core.Popover, {
        content: the_menu
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        id: this.props.name,
        text: this.props.name,
        icon: this.props.icon_name
      })));
    }
  }]);

  return PopupButton;
}(_react["default"].Component);

PopupButton.propTypes = {
  button_class: _propTypes["default"].string,
  name: _propTypes["default"].string,
  icon_name: _propTypes["default"].string,
  option_list: _propTypes["default"].array,
  small_size: _propTypes["default"].bool
};
PopupButton.defaultProps = {
  small_size: true
};

var FileAdderButton = /*#__PURE__*/function (_React$Component3) {
  _inherits(FileAdderButton, _React$Component3);

  var _super3 = _createSuper(FileAdderButton);

  function FileAdderButton(props) {
    var _this3;

    _classCallCheck(this, FileAdderButton);

    _this3 = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(FileAdderButton, [{
    key: "_showDialog",
    value: function _showDialog() {
      (0, _import_dialog.showFileImportDialog)(this.props.resource_type, this.props.allowed_file_types, this.props.checkboxes, this.props.process_handler, this.context.tsocket, this.context.dark_theme, this.props.combine, this.props.show_csv_options);
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(ToolbarButton, {
        name_text: this.props.name_text,
        icon_name: this.props.icon_name,
        large: false,
        click_handler: this._showDialog,
        tooltip: this.props.tooltip
      });
    }
  }]);

  return FileAdderButton;
}(_react["default"].Component);

FileAdderButton.propTypes = {
  name_text: _propTypes["default"].string,
  resource_type: _propTypes["default"].string,
  process_handler: _propTypes["default"].func,
  allowed_file_types: _propTypes["default"].string,
  icon_name: _propTypes["default"].string,
  checkboxes: _propTypes["default"].array,
  combine: _propTypes["default"].bool,
  tooltip: _propTypes["default"].string,
  show_csv_options: _propTypes["default"].bool // tsocket: PropTypes.object,
  // dark_theme: PropTypes.bool,

};
FileAdderButton.defaultProps = {
  multiple: false
};
FileAdderButton.contextType = _tactic_context.TacticContext;

var Toolbar = /*#__PURE__*/function (_React$Component4) {
  _inherits(Toolbar, _React$Component4);

  var _super4 = _createSuper(Toolbar);

  function Toolbar(props) {
    var _this4;

    _classCallCheck(this, Toolbar);

    _this4 = _super4.call(this, props);
    _this4.tb_ref = /*#__PURE__*/_react["default"].createRef();
    return _this4;
  }

  _createClass(Toolbar, [{
    key: "get_button_class",
    value: function get_button_class(but) {
      if (but.button_class == undefined) {
        return default_button_class;
      } else {
        return but.button_class;
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.sendRef) {
        this.props.sendRef(this.tb_ref);
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.sendRef) {
        this.props.sendRef(this.tb_ref);
      }
    }
  }, {
    key: "getTooltip",
    value: function getTooltip(item) {
      return item.tooltip ? item.tooltip : null;
    }
  }, {
    key: "getTooltipDelay",
    value: function getTooltipDelay(item) {
      return item.tooltipDelay ? item.tooltipDelay : null;
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var items = [];
      var group_counter = 0;

      if (this.props.popup_buttons != null && this.props.popup_buttons.length != 0) {
        var popup_items = this.props.popup_buttons.map(function (button, index) {
          return /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
            className: "toolbar-button-group",
            role: "group",
            key: "popup_group" + String(index)
          }, /*#__PURE__*/_react["default"].createElement(PopupButton, {
            name: button.name,
            key: button.name,
            icon_name: button.icon_name,
            option_list: button.option_list,
            button_class: _this5.get_button_class(button)
          }));
        });
        items.push(popup_items);
      }

      var _iterator = _createForOfIteratorHelper(this.props.button_groups),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var group = _step.value;
          var group_items = group.map(function (button, index) {
            return /*#__PURE__*/_react["default"].createElement(ToolbarButton, {
              name_text: button.name_text,
              icon_name: button.icon_name,
              show_text: button.show_text,
              tooltip: _this5.getTooltip(button),
              tooltipDeleay: _this5.getTooltipDelay(button),
              click_handler: button.click_handler,
              intent: button.hasOwnProperty("intent") ? button.intent : "regular",
              key: index
            });
          });
          items.push( /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
            large: false,
            style: {
              justifyContent: "center"
            },
            className: "toolbar-button-group",
            role: "group",
            key: group_counter
          }, group_items));
          group_counter += 1;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var key_bindings = [];

      var _iterator2 = _createForOfIteratorHelper(this.props.button_groups),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _group = _step2.value;

          var _iterator3 = _createForOfIteratorHelper(_group),
              _step3;

          try {
            var _loop = function _loop() {
              var button = _step3.value;
              if (button.hasOwnProperty("key_bindings")) key_bindings.push([button.key_bindings, function () {
                return button.click_handler();
              }]);
            };

            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              _loop();
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      if (this.props.file_adders != null && this.props.file_adders.length != 0) {
        var file_adder_items = this.props.file_adders.map(function (button, index) {
          return /*#__PURE__*/_react["default"].createElement(FileAdderButton, {
            name_text: button.name_text,
            resource_type: button.resource_type,
            process_handler: button.process_handler,
            allowed_file_types: button.allowed_file_types,
            icon_name: button.icon_name,
            checkboxes: button.checkboxes,
            combine: button.combine,
            tooltip: _this5.getTooltip(button),
            tooltipDelay: _this5.getTooltipDelay(button),
            show_csv_options: button.show_csv_options,
            tsocket: _this5.context.tsocket,
            dark_theme: _this5.context.dark_theme,
            key: index
          });
        });
        items.push( /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
          style: {
            justifyContent: "center"
          },
          className: "toolbar-button-group",
          role: "group",
          key: group_counter
        }, file_adder_items));
      }

      var outer_style;

      if (this.props.alternate_outer_style) {
        outer_style = this.props.alternate_outer_style;
      } else {
        outer_style = {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          marginBottom: 10,
          whiteSpace: "nowrap"
        };
      }

      return /*#__PURE__*/_react["default"].createElement("div", {
        style: outer_style
      }, /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.tb_ref
      }, items), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
        global: true,
        active: !this.context.controlled || this.context.am_selected,
        bindings: key_bindings
      }));
    }
  }]);

  return Toolbar;
}(_react["default"].Component);

exports.Toolbar = Toolbar;
Toolbar.propTypes = {
  button_groups: _propTypes["default"].array,
  file_adders: _propTypes["default"].array,
  popup_buttons: _propTypes["default"].array,
  alternate_outer_style: _propTypes["default"].object,
  inputRef: _propTypes["default"].func,
  tsocket: _propTypes["default"].object,
  dark_theme: _propTypes["default"].bool
};
Toolbar.defaultProps = {
  controlled: false,
  am_selected: true,
  file_adders: null,
  popup_buttons: null,
  alternate_outer_style: null,
  sendRef: null,
  tsocket: null
};
Toolbar.contextType = _tactic_context.TacticContext;

var Namebutton = /*#__PURE__*/function (_React$Component5) {
  _inherits(Namebutton, _React$Component5);

  var _super5 = _createSuper(Namebutton);

  function Namebutton(props) {
    var _this6;

    _classCallCheck(this, Namebutton);

    _this6 = _super5.call(this, props); // this.state = {"current_name": props.resource_name};

    _this6.rename_me = _this6.rename_me.bind(_assertThisInitialized(_this6));
    _this6.RenameResource = _this6.defaultRenameResource.bind(_assertThisInitialized(_this6));
    return _this6;
  }

  _createClass(Namebutton, [{
    key: "rename_me",
    value: function rename_me() {
      console.log("entering rename");
      var self = this;
      var res_type = this.props.res_type;
      var current_name = this.props.resource_name;
      $.getJSON($SCRIPT_ROOT + "get_resource_names/".concat(res_type), function (data) {
        var res_names = data["resource_names"];
        var index = res_names.indexOf(current_name);

        if (index >= 0) {
          res_names.splice(index, 1);
        }

        (0, _modal_react.showModalReact)("Rename ".concat(res_type), "Name for this ".concat(res_type), self.RenameResource, current_name, res_names);
      });
    }
  }, {
    key: "defaultRenameResource",
    value: function defaultRenameResource(new_name) {
      var the_data = {
        "new_name": new_name,
        "update_selector": "True"
      };
      var self = this;
      (0, _communication_react.postAjax)("rename_resource/".concat(this.props.res_type, "/").concat(this.props.resource_name), the_data, renameSuccess);

      function renameSuccess(data) {
        if (data.success) {
          // self.setState({"current_name": new_name});
          self.props.setResourceNameState(new_name);
          (0, _toaster.doFlash)(data);
          return true;
        } else {
          (0, _toaster.doFlash)(data);
          return false;
        }
      }
    }
  }, {
    key: "render",
    value: function render() {
      // let name = this.props.handleRename == null ? this.state.current_name : this.props.resource_name;
      var name = this.props.resource_name;
      var style = {
        fontSize: 18,
        fontWeight: 800
      };
      return /*#__PURE__*/_react["default"].createElement(_core.Button, {
        id: "rename-button",
        large: this.props.large,
        small: !this.props.large,
        minimal: true,
        style: style,
        tabIndex: -1,
        onClick: this.rename_me
      }, /*#__PURE__*/_react["default"].createElement("div", null, name));
    }
  }]);

  return Namebutton;
}(_react["default"].Component);

exports.Namebutton = Namebutton;
Namebutton.propTypes = {
  resource_name: _propTypes["default"].string,
  setResourceNameState: _propTypes["default"].func,
  res_type: _propTypes["default"].string,
  large: _propTypes["default"].bool
};
Namebutton.defaultProps = {
  handleRename: null,
  large: true
};