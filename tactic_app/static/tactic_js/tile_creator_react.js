"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.creator_props = creator_props;
exports.CreatorApp = void 0;

require("../tactic_css/tactic.scss");

require("../tactic_css/tactic_table.scss");

require("../tactic_css/tile_creator.scss");

require("codemirror/mode/javascript/javascript.js");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _tactic_socket = require("./tactic_socket.js");

var _menu_utilities = require("./menu_utilities.js");

var _resource_viewer_react_app = require("./resource_viewer_react_app.js");

var _reactCodemirror = require("./react-codemirror.js");

var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");

var _creator_modules_react = require("./creator_modules_react.js");

var _resizing_layouts = require("./resizing_layouts.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _sizing_tools = require("./sizing_tools.js");

var _error_drawer = require("./error_drawer.js");

var _utilities_react = require("./utilities_react.js");

var _blueprint_navbar = require("./blueprint_navbar.js");

var _library_widgets = require("./library_widgets");

var _modal_react = require("./modal_react");

var _error_boundary = require("./error_boundary");

var _autocomplete = require("./autocomplete");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

var BOTTOM_MARGIN = 50;
var MARGIN_SIZE = 17;

function tile_creator_main() {
  function gotProps(the_props) {
    var CreatorAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(CreatorApp));

    var the_element = /*#__PURE__*/_react["default"].createElement(CreatorAppPlus, _extends({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));

    var domContainer = document.querySelector('#creator-root');
    ReactDOM.render(the_element, domContainer);
  }

  (0, _utilities_react.renderSpinnerMessage)("Starting up ...", '#creator-root');
  (0, _communication_react.postAjaxPromise)("view_in_creator_in_context", {
    "resource_name": window.module_name
  }).then(function (data) {
    creator_props(data, null, gotProps);
  });
}

function creator_props(data, registerDirtyMethod, finalCallback) {
  var mdata = data.mdata;
  var split_tags = mdata.tags == "" ? [] : mdata.tags.split(" ");
  var module_name = data.resource_name;
  var module_viewer_id = data.module_viewer_id;
  window.name = module_viewer_id;

  function readyListener() {
    _everyone_ready_in_context(finalCallback);
  }

  var tsocket = new _tactic_socket.TacticSocket("main", 5000, module_viewer_id, function (response) {
    tsocket.socket.on("remove-ready-block", readyListener);
    tsocket.socket.emit('client-ready', {
      "room": data.module_viewer_id,
      "user_id": window.user_id,
      "participant": "client",
      "rb_id": data.ready_block_id,
      "main_id": data.module_viewer_id
    });
  });
  var tile_collection_name = data.tile_collection_name;

  function _everyone_ready_in_context(finalCallback) {
    if (!window.in_context) {
      (0, _utilities_react.renderSpinnerMessage)("Everyone is ready, initializing...", '#creator-root');
    }

    var the_content = {
      "module_name": module_name,
      "module_viewer_id": module_viewer_id,
      "tile_collection_name": tile_collection_name,
      "user_id": window.user_id,
      "version_string": window.version_string
    };
    window.addEventListener("unload", function sendRemove() {
      navigator.sendBeacon("/delete_container_on_unload", JSON.stringify({
        "container_id": module_viewer_id,
        "notify": false
      }));
    });
    tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, module_viewer_id);
    });
    (0, _communication_react.postWithCallback)(module_viewer_id, "initialize_parser", the_content, function (pdata) {
      return got_parsed_data_in_context(pdata);
    }, null, module_viewer_id);

    function got_parsed_data_in_context(data_object) {
      if (!window.in_context) {
        (0, _utilities_react.renderSpinnerMessage)("Creating the page...", '#creator-root');
      }

      tsocket.socket.off("remove-ready-block", readyListener);
      var parsed_data = data_object.the_content;
      var category = parsed_data.category ? parsed_data.category : "basic";
      var result_dict = {
        "res_type": "tile",
        "res_name": module_name,
        "is_repository": false
      };
      var odict = parsed_data.option_dict;
      var initial_line_number = !window.in_context && window.line_number ? window.line_number : null;
      var couple_save_attrs_and_exports = !("couple_save_attrs_and_exports" in mdata.additional_mdata) || mdata.additional_mdata.couple_save_attrs_and_exports;
      finalCallback({
        resource_name: module_name,
        tsocket: tsocket,
        module_viewer_id: module_viewer_id,
        main_id: module_viewer_id,
        is_mpl: parsed_data.is_mpl,
        is_d3: parsed_data.is_d3,
        render_content_code: parsed_data.render_content_code,
        render_content_line_number: parsed_data.render_content_line_number,
        extra_methods_line_number: parsed_data.extra_methods_line_number,
        draw_plot_line_number: parsed_data.draw_plot_line_number,
        initial_line_number: initial_line_number,
        category: category,
        extra_functions: parsed_data.extra_functions,
        draw_plot_code: parsed_data.draw_plot_code,
        jscript_code: parsed_data.jscript_code,
        tags: split_tags,
        notes: mdata.notes,
        icon: mdata.additional_mdata.icon,
        initial_theme: window.theme,
        option_list: (0, _creator_modules_react.correctOptionListTypes)(parsed_data.option_dict),
        export_list: parsed_data.export_list,
        additional_save_attrs: parsed_data.additional_save_attrs,
        couple_save_attrs_and_exports: couple_save_attrs_and_exports,
        created: mdata.datestring,
        registerDirtyMethod: registerDirtyMethod
      });
    }
  }
}

function TileCreatorToolbar(props) {
  var tstyle = {
    "marginTop": window.in_context ? 0 : 20,
    "paddingRight": 20,
    "width": "100%"
  };
  var toolbar_outer_style = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 0,
    marginTop: 7,
    whiteSpace: "nowrap"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: tstyle,
    className: "d-flex flex-row justify-content-between"
  }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    update_search_state: props.update_search_state,
    search_string: props.search_string,
    field_width: 200,
    include_search_jumper: true,
    searchPrev: props.searchPrev,
    searchNext: props.searchNext,
    search_ref: props.search_ref,
    number_matches: props.search_matches
  }));
}

TileCreatorToolbar.proptypes = {
  button_groups: _propTypes["default"].array,
  setResourceNameState: _propTypes["default"].func,
  resource_name: _propTypes["default"].string,
  search_string: _propTypes["default"].string,
  update_search_state: _propTypes["default"].func,
  res_type: _propTypes["default"].string,
  search_ref: _propTypes["default"].object,
  search_matches: _propTypes["default"].number
};
TileCreatorToolbar.defaultProps = {};
var controllable_props = ["resource_name", "usable_width", "usable_height"];

var CreatorApp = /*#__PURE__*/function (_React$Component) {
  _inherits(CreatorApp, _React$Component);

  var _super = _createSuper(CreatorApp);

  function CreatorApp(props) {
    var _this;

    _classCallCheck(this, CreatorApp);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));

    _this.initSocket();

    _this.top_ref = /*#__PURE__*/_react["default"].createRef();
    _this.options_ref = /*#__PURE__*/_react["default"].createRef();
    _this.left_div_ref = /*#__PURE__*/_react["default"].createRef();
    _this.right_div_ref = /*#__PURE__*/_react["default"].createRef();
    _this.tc_span_ref = /*#__PURE__*/_react["default"].createRef();
    _this.rc_span_ref = /*#__PURE__*/_react["default"].createRef();
    _this.vp_ref = /*#__PURE__*/_react["default"].createRef();
    _this.hp_ref = /*#__PURE__*/_react["default"].createRef();
    _this.methods_ref = /*#__PURE__*/_react["default"].createRef();
    _this.commands_ref = /*#__PURE__*/_react["default"].createRef();
    _this.draw_plot_bounding_ref = /*#__PURE__*/_react["default"].createRef();
    _this.search_ref = /*#__PURE__*/_react["default"].createRef();
    _this.last_save = {};
    _this.dpObject = null;
    _this.rcObject = null;
    _this.emObject = null;
    _this.line_number = _this.props.initial_line_number;
    _this.socket_counter = null;
    _this.cm_list = _this.props.is_mpl || _this.props.is_d3 ? ["tc", "rc", "em"] : ["rc", "em"];
    _this.state = {
      foregrounded_panes: {
        "metadata": true,
        "options": false,
        "exports": false,
        "methods": false,
        "commands": false
      },
      search_string: "",
      render_content_code: _this.props.render_content_code,
      draw_plot_code: _this.props.draw_plot_code,
      jscript_code: _this.props.jscript_code,
      extra_functions: _this.props.extra_functions,
      render_content_line_number: _this.props.render_content_line_number,
      draw_plot_line_number: _this.props.draw_plot_line_number,
      extra_methods_line_number: _this.props.extra_methods_line_number,
      tags: _this.props.tags,
      notes: _this.props.notes,
      icon: _this.props.icon,
      option_list: _this.props.option_list,
      export_list: _this.props.export_list,
      additional_save_attrs: _this.props.additional_save_attrs || [],
      couple_save_attrs_and_exports: _this.props.couple_save_attrs_and_exports,
      category: _this.props.category,
      selectedTabId: "metadata",
      old_usable_width: 0,
      current_search_number: null,
      current_search_cm: _this.cm_list[0],
      regex: false,
      search_matches: 0
    };

    var self = _assertThisInitialized(_this);

    if (props.controlled) {
      props.registerDirtyMethod(_this._dirty);
    } else {
      _this.state.usable_height = (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
      _this.state.usable_width = (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
      _this.state.dark_theme = props.initial_theme === "dark";
      window.dark_theme = _this.state.dark_theme;
      _this.state.resource_name = props.resource_name;
      window.addEventListener("beforeunload", function (e) {
        if (self._dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }

    _this.cm_list = _this.props.is_mpl || _this.props.is_d3 ? ["tc", "rc", "em"] : ["rc", "em"];
    _this.state.top_pane_fraction = _this.props.is_mpl || _this.props.is_d3 ? .5 : 1;
    _this.state.left_pane_fraction = .5;
    _this._setResourceNameState = _this._setResourceNameState.bind(_assertThisInitialized(_this));
    _this.handleStateChange = _this.handleStateChange.bind(_assertThisInitialized(_this));
    _this.handleRenderContentChange = _this.handleRenderContentChange.bind(_assertThisInitialized(_this));
    _this.handleTopCodeChange = _this.handleTopCodeChange.bind(_assertThisInitialized(_this));
    _this.handleOptionsChange = _this.handleOptionsChange.bind(_assertThisInitialized(_this));
    _this.handleExportsChange = _this.handleExportsChange.bind(_assertThisInitialized(_this));
    _this.handleMethodsChange = _this.handleMethodsChange.bind(_assertThisInitialized(_this));
    _this.handleLeftPaneResize = _this.handleLeftPaneResize.bind(_assertThisInitialized(_this));
    _this.handleTopPaneResize = _this.handleTopPaneResize.bind(_assertThisInitialized(_this));
    _this.search_match_numbers = {
      tc: 0,
      rc: 0,
      em: 0
    };
    return _this;
  }

  _createClass(CreatorApp, [{
    key: "initSocket",
    value: function initSocket() {
      var _this2 = this;

      this.props.tsocket.attachListener('focus-me', function (data) {
        window.focus();

        _this2._selectLineNumber(data.line_number);
      });
      this.props.tsocket.attachListener("doFlash", function (data) {
        (0, _toaster.doFlash)(data);
      });

      if (!window.in_context) {
        this.props.tsocket.attachListener("doFlashUser", function (data) {
          (0, _toaster.doFlash)(data);
        });
        this.props.tsocket.attachListener('close-user-windows', function (data) {
          if (!(data["originator"] == props.resource_viewer_id)) {
            window.close();
          }
        });
      }
    }
  }, {
    key: "_cProp",
    value: function _cProp(pname) {
      return this.props.controlled ? this.props[pname] : this.state[pname];
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var _this3 = this;

      var ms = {
        Save: [{
          name_text: "Save",
          icon_name: "saved",
          click_handler: this._saveMe,
          key_bindings: ['ctrl+s']
        }, {
          name_text: "Save As...",
          icon_name: "floppy-disk",
          click_handler: this._saveModuleAs
        }, {
          name_text: "Save and Checkpoint",
          icon_name: "map-marker",
          click_handler: this._saveAndCheckpoint,
          key_bindings: ['ctrl+m']
        }],
        Load: [{
          name_text: "Save and Load",
          icon_name: "upload",
          click_handler: this._saveAndLoadModule,
          key_bindings: ['ctrl+l']
        }, {
          name_text: "Load",
          icon_name: "upload",
          click_handler: this._loadModule
        }],
        Compare: [{
          name_text: "View History",
          icon_name: "history",
          click_handler: this._showHistoryViewer
        }, {
          name_text: "Compare to Other Modules",
          icon_name: "comparison",
          click_handler: this._showTileDiffer
        }],
        Transfer: [{
          name_text: "Share",
          icon_name: "share",
          click_handler: function click_handler() {
            (0, _resource_viewer_react_app.sendToRepository)("tile", _this3._cProp("resource_name"));
          }
        }]
      };

      for (var menu in ms) {
        var _iterator = _createForOfIteratorHelper(ms[menu]),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var but = _step.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }

      return ms;
    }
  }, {
    key: "_extraKeys",
    value: function _extraKeys() {
      var self = this;
      return {
        'Ctrl-S': self._saveMe,
        'Ctrl-L': self._saveAndLoadModule,
        'Ctrl-M': self._saveAndCheckpoint,
        'Ctrl-F': function CtrlF() {
          self.search_ref.current.focus();
        },
        'Cmd-F': function CmdF() {
          self.search_ref.current.focus();
        }
      };
    }
  }, {
    key: "_searchNext",
    value: function _searchNext() {
      if (this.state.current_search_number >= this.search_match_numbers[this.state.current_search_cm] - 1) {
        var next_cm;

        if (this.state.current_search_cm == "rc") {
          next_cm = "em";

          this._handleTabSelect("methods");
        } else if (this.state.current_search_cm == "tc") {
          next_cm = "rc";
        } else {
          if (this.props.is_mpl || this.props.is_d3) {
            next_cm = "tc";
          } else {
            next_cm = "rc";
          }
        }

        if (next_cm == "em") {
          this._handleTabSelect("methods");
        }

        this.setState({
          current_search_cm: next_cm,
          current_search_number: 0
        });
      } else {
        this.setState({
          current_search_number: this.state.current_search_number + 1
        });
      }
    }
  }, {
    key: "_searchPrev",
    value: function _searchPrev() {
      var next_cm;
      var next_search_number;

      if (this.state.current_search_number <= 0) {
        if (this.state.current_search_cm == "em") {
          next_cm = "rc";
          next_search_number = this.search_match_numbers["rc"] - 1;
        } else if (this.state.current_search_cm == "tc") {
          next_cm = "em";
          next_search_number = this.search_match_numbers["em"] - 1;
        } else {
          if (this.props.is_mpl || this.props.is_d3) {
            next_cm = "tc";
            next_search_number = this.search_match_numbers["tc"] - 1;
          } else {
            next_cm = "em";
            next_search_number = this.search_match_numbers["em"] - 1;
          }
        }

        if (next_cm == "em") {
          this._handleTabSelect("methods");
        }

        this.setState({
          current_search_cm: next_cm,
          current_search_number: next_search_number
        });
      } else {
        this.setState({
          current_search_number: this.state.current_search_number - 1
        });
      }
    }
  }, {
    key: "_updateSearchState",
    value: function _updateSearchState(new_state) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      new_state.current_search_cm = this.cm_list[0];
      new_state.current_search_number = 0;
      this.setState(new_state, callback);
    }
  }, {
    key: "_noSearchResults",
    value: function _noSearchResults() {
      if (this.state.search_string == "" || this.state.search_string == null) {
        return true;
      } else {
        var _iterator2 = _createForOfIteratorHelper(this.cm_list),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var cm = _step2.value;

            if (this.search_match_numbers[cm]) {
              return false;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        return true;
      }
    }
  }, {
    key: "_setTheme",
    value: function _setTheme(dark_theme) {
      this.setState({
        dark_theme: dark_theme
      }, function () {
        if (!window.in_context) {
          window.dark_theme = dark_theme;
        }
      });
    }
  }, {
    key: "_showHistoryViewer",
    value: function _showHistoryViewer() {
      window.open("".concat($SCRIPT_ROOT, "/show_history_viewer/").concat(this._cProp("resource_name")));
    }
  }, {
    key: "_showTileDiffer",
    value: function _showTileDiffer() {
      window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/").concat(this._cProp("resource_name")));
    }
  }, {
    key: "_doFlashStopSpinner",
    value: function _doFlashStopSpinner(data) {
      this.props.clearStatus();
      (0, _toaster.doFlash)(data);
    }
  }, {
    key: "_selectLineNumber",
    value: function _selectLineNumber(lnumber) {
      this.line_number = lnumber;

      this._goToLineNumber();
    }
  }, {
    key: "_logErrorStopSpinner",
    value: function _logErrorStopSpinner(title) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.props.stopSpinner();
      var entry = {
        title: title,
        content: data.message
      };

      if ("line_number" in data) {
        entry.line_number = data.line_number;
      }

      this.props.addErrorDrawerEntry(entry, true);
      this.props.openErrorDrawer();
    }
  }, {
    key: "_dirty",
    value: function _dirty() {
      var current_state = this._getSaveDict();

      for (var k in current_state) {
        if (current_state[k] != this.last_save[k]) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "_saveAndLoadModule",
    value: function _saveAndLoadModule() {
      var self = this;
      this.props.startSpinner();
      this.doSavePromise().then(function () {
        self.props.statusMessage("Loading Module");
        (0, _communication_react.postWithCallback)("host", "load_tile_module_task", {
          "tile_module_name": self._cProp("resource_name"),
          "user_id": window.user_id
        }, load_success, null, self.props.module_viewer_id);
      })["catch"](function (data) {
        self._logErrorStopSpinner("Error loading module", data);
      });

      function load_success(data) {
        if (data.success) {
          data.timeout = 2000;
        }

        self._doFlashStopSpinner(data);

        return false;
      }
    }
  }, {
    key: "_loadModule",
    value: function _loadModule() {
      var self = this;
      this.props.startSpinner();
      self.props.statusMessage("Loading Module");
      (0, _communication_react.postWithCallback)("host", "load_tile_module_task", {
        "tile_module_name": self._cProp("resource_name"),
        "user_id": window.user_id
      }, load_success, null, self.props.module_viewer_id);

      function load_success(data) {
        if (data.success) {
          data.timeout = 2000;
        }

        self._doFlashStopSpinner(data);

        return false;
      }
    }
  }, {
    key: "_saveModuleAs",
    value: function _saveModuleAs() {
      this.props.startSpinner();
      var self = this;
      (0, _communication_react.postWithCallback)("host", "get_tile_names", {
        "user_id": window.user_id
      }, function (data) {
        var checkboxes;
        (0, _modal_react.showModalReact)("Save Module As", "New ModuleName Name", CreateNewModule, "NewModule", data["tile_names"], null, doCancel);
      }, null, this.props.main_id);

      function doCancel() {
        self.props.stopSpinner();
      }

      function CreateNewModule(new_name) {
        var result_dict = {
          "new_res_name": new_name,
          "res_to_copy": self._cProp("resource_name")
        };
        (0, _communication_react.postAjaxPromise)('/create_duplicate_tile', result_dict).then(function (data) {
          self._setResourceNameState(new_name, function () {
            self._saveMe();
          });
        })["catch"](_toaster.doFlash);
      }
    }
  }, {
    key: "_saveMe",
    value: function _saveMe() {
      var self = this;

      if (!self.props.am_selected) {
        return false;
      }

      this.props.startSpinner();
      this.props.statusMessage("Saving Module");
      this.doSavePromise().then(self._doFlashStopSpinner)["catch"](function (data) {
        self._logErrorStopSpinner("Error saving module", data);
      });
      return false;
    }
  }, {
    key: "_saveAndCheckpoint",
    value: function _saveAndCheckpoint() {
      this.props.startSpinner();
      var self = this;
      this.doSavePromise().then(function () {
        self.props.statusMessage("Checkpointing");
        self.doCheckpointPromise().then(self._doFlashStopSpinner)["catch"](function (data) {
          self._logErrorStopSpinner("Error checkpointing module", data);
        });
      })["catch"](function (data) {
        self._logErrorStopSpinner("Error saving module", data);
      });
      return false;
    }
  }, {
    key: "get_tags_string",
    value: function get_tags_string() {
      var taglist = this.state.tags;
      var tags = "";

      var _iterator3 = _createForOfIteratorHelper(taglist),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var tag = _step3.value;
          tags = tags + tag + " ";
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      return tags.trim();
    }
  }, {
    key: "_getSaveDict",
    value: function _getSaveDict() {
      return {
        "module_name": this._cProp("resource_name"),
        "category": this.state.category.length == 0 ? "basic" : this.state.category,
        "tags": this.get_tags_string(),
        "notes": this.state.notes,
        "icon": this.state.icon,
        "exports": this.state.export_list,
        "additional_save_attrs": this.state.additional_save_attrs,
        "couple_save_attrs_and_exports": this.state.couple_save_attrs_and_exports,
        "options": this.state.option_list,
        "extra_methods": this.state.extra_functions,
        "render_content_body": this.state.render_content_code,
        "is_mpl": this.props.is_mpl,
        "is_d3": this.props.is_d3,
        "draw_plot_body": this.state.draw_plot_code,
        "jscript_body": this.state.jscript_code,
        "last_saved": "creator"
      };
    }
  }, {
    key: "doSavePromise",
    value: function doSavePromise() {
      var self = this;
      return new Promise(function (resolve, reject) {
        var result_dict = self._getSaveDict();

        (0, _communication_react.postWithCallback)(self.props.module_viewer_id, "update_module", result_dict, function (data) {
          if (data.success) {
            self.save_success(data);
            resolve(data);
          } else {
            reject(data);
          }
        }, null, self.props.module_viewer_id);
      });
    }
  }, {
    key: "doCheckpointPromise",
    value: function doCheckpointPromise() {
      var self = this;
      return new Promise(function (resolve, reject) {
        (0, _communication_react.postAjax)("checkpoint_module", {
          "module_name": self._cProp("resource_name")
        }, function (data) {
          if (data.success) {
            resolve(data);
          } else {
            reject(data);
          }
        });
      });
    }
  }, {
    key: "save_success",
    value: function save_success(data) {
      var self = this;
      this.setState({
        "render_content_line_number": data.render_content_line_number,
        "extra_methods_line_number": data.extra_methods_line_number,
        "draw_plot_line_number": data.draw_plot_line_number
      });

      this._update_saved_state();
    }
  }, {
    key: "_update_window_dimensions",
    value: function _update_window_dimensions() {
      if (this.top_ref && this.top_ref.current) {
        this.setState({
          usable_width: window.innerWidth - this.top_ref.current.offsetLeft,
          usable_height: window.innerHeight - this.top_ref.current.offsetTop
        });
      }
    }
  }, {
    key: "_update_saved_state",
    value: function _update_saved_state() {
      this.last_save = this._getSaveDict();
    }
  }, {
    key: "_goToLineNumber",
    value: function _goToLineNumber() {
      if (this.line_number) {
        this.props.closeErrorDrawer();

        if (this.props.is_mpl || this.props.is_d3) {
          if (this.line_number < this.state.draw_plot_line_number) {
            if (this.emObject) {
              this._handleTabSelect("methods");

              CreatorApp._selectLine(this.emObject, this.line_number - this.state.extra_methods_line_number);

              this.line_number = null;
            } else {
              return;
            }
          } else if (this.line_number < this.state.render_content_line_number) {
            if (this.dpObject) {
              CreatorApp._selectLine(this.dpObject, this.line_number - this.state.draw_plot_line_number - 1);

              this.line_number = null;
            } else {
              return;
            }
          } else if (this.rcObject) {
            CreatorApp._selectLine(this.rcObject, this.line_number - this.state.render_content_line_number - 1);

            this.line_number = null;
          }
        } else {
          if (this.line_number < this.props.render_content_line_number) {
            if (this.emObject) {
              this._handleTabSelect("methods");

              CreatorApp._selectLine(this.emObject, this.line_number - this.state.extra_methods_line_number);

              this.line_number = null;
            } else {
              return;
            }
          } else {
            if (this.rcObject) {
              CreatorApp._selectLine(this.rcObject, this.line_number - this.state.render_content_line_number - 1);

              this.line_number = null;
            }
          }
        }
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "mounted": true
      });

      this._goToLineNumber();

      if (window.in_context) {
        this.props.registerLineSetter(this._selectLineNumber);
      }

      this.props.setGoToLineNumber(this._selectLineNumber);

      this._update_saved_state();

      this.props.stopSpinner();

      if (!this.props.controlled) {
        document.title = this.state.resource_name;
        window.addEventListener("resize", this._update_window_dimensions);

        this._update_window_dimensions();
      }
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      this._goToLineNumber();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.tsocket.disconnect();
      this.delete_my_container();
    }
  }, {
    key: "delete_my_container",
    value: function delete_my_container() {
      (0, _communication_react.postAjax)("/delete_container_on_unload", {
        "container_id": this.props.module_viewer_id,
        "notify": false
      });
    }
  }, {
    key: "_handleTabSelect",
    value: function _handleTabSelect(newTabId, prevTabid, event) {
      var _this4 = this;

      var new_fg = Object.assign({}, this.state.foregrounded_panes);
      new_fg[newTabId] = true;
      this.setState({
        selectedTabId: newTabId,
        foregrounded_panes: new_fg
      }, function () {
        _this4._update_window_dimensions();
      });
    }
  }, {
    key: "_handleNotesAppend",
    value: function _handleNotesAppend(new_text) {
      this.setState({
        "notes": this.state.notes + new_text
      });
    }
  }, {
    key: "_appendOptionText",
    value: function _appendOptionText() {
      var res_string = "\n\noptions: \n\n";

      var _iterator4 = _createForOfIteratorHelper(this.state.option_list),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var opt = _step4.value;
          res_string += " * `".concat(opt.name, "` (").concat(opt.type, "): \n");
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      this._handleNotesAppend(res_string);
    }
  }, {
    key: "_appendExportText",
    value: function _appendExportText() {
      var res_string = "\n\nexports: \n\n";

      var _iterator5 = _createForOfIteratorHelper(this.state.export_list),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var exp = _step5.value;
          res_string += " * `".concat(exp.name, "` : \n");
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      this._handleNotesAppend(res_string);
    }
  }, {
    key: "_metadataNotesButtons",
    value: function _metadataNotesButtons() {
      var self = this;
      return /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        style: {
          height: "fit-content",
          alignSelf: "start",
          marginTop: 10,
          fontSize: 12
        },
        text: "Add Options",
        small: true,
        minimal: true,
        intent: "primary",
        icon: "select",
        onClick: function onClick(e) {
          e.preventDefault();

          self._appendOptionText();
        }
      }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        style: {
          height: "fit-content",
          alignSelf: "start",
          marginTop: 10,
          fontSize: 12
        },
        text: "Add Exports",
        small: true,
        minimal: true,
        intent: "primary",
        icon: "export",
        onClick: function onClick(e) {
          e.preventDefault();

          self._appendExportText();
        }
      }));
    }
  }, {
    key: "handleStateChange",
    value: function handleStateChange(state_stuff) {
      this.setState(state_stuff);
    }
  }, {
    key: "handleOptionsChange",
    value: function handleOptionsChange(new_option_list) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.setState({
        "option_list": new_option_list
      }, callback);
    }
  }, {
    key: "handleExportsChange",
    value: function handleExportsChange(new_export_list) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.setState({
        "export_list": new_export_list
      }, callback);
    }
  }, {
    key: "handleMethodsChange",
    value: function handleMethodsChange(new_methods) {
      this.setState({
        "extra_functions": new_methods
      });
    }
  }, {
    key: "get_height_minus_top_offset",
    value: function get_height_minus_top_offset(element_ref) {
      var min_offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var default_offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 100;

      if (this.state.mounted && element_ref && element_ref.current) {
        // This will be true after the initial render
        var offset = element_ref.current.offsetTop;

        if (offset < min_offset) {
          offset = min_offset;
        }

        return this._cProp("usable_height") - offset;
      } else {
        return this._cProp("usable_height") - default_offset;
      }
    }
  }, {
    key: "get_new_tc_height",
    value: function get_new_tc_height() {
      if (this.state.mounted) {
        // This will be true after the initial render
        return this._cProp("usable_height") * this.state.top_pane_fraction - 35;
      } else {
        return this._cProp("usable_height") - 50;
      }
    }
  }, {
    key: "get_new_rc_height",
    value: function get_new_rc_height(outer_rc_height) {
      if (this.state.mounted && this.rc_span_ref && this.rc_span_ref.current) {
        return outer_rc_height - this.rc_span_ref.current.offsetHeight;
      } else {
        return outer_rc_height - 50;
      }
    }
  }, {
    key: "handleTopPaneResize",
    value: function handleTopPaneResize(top_height, bottom_height, top_fraction) {
      this.setState({
        "top_pane_fraction": top_fraction
      });
    }
  }, {
    key: "handleLeftPaneResize",
    value: function handleLeftPaneResize(left_width, right_width, left_fraction) {
      this.setState({
        "left_pane_fraction": left_fraction
      });
    }
  }, {
    key: "handleTopCodeChange",
    value: function handleTopCodeChange(new_code) {
      if (this.props.is_mpl) {
        this.setState({
          "draw_plot_code": new_code
        });
      } else {
        this.setState({
          "jscript_code": new_code
        });
      }
    }
  }, {
    key: "handleRenderContentChange",
    value: function handleRenderContentChange(new_code) {
      this.setState({
        "render_content_code": new_code
      });
    }
  }, {
    key: "_setResourceNameState",
    value: function _setResourceNameState(new_name) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      if (this.props.controlled) {
        this.props.changeResourceName(new_name, callback);
      } else {
        this.setState({
          resource_name: new_name
        }, callback);
      }
    }
  }, {
    key: "_clearAllSelections",
    value: function _clearAllSelections() {
      for (var _i = 0, _arr = [this.rcObject, this.dpObject, this.emObject]; _i < _arr.length; _i++) {
        var cm = _arr[_i];

        if (cm) {
          var to = cm.getCursor("to");
          cm.setCursor(to);
        }
      }
    }
  }, {
    key: "_setDpObject",
    value: function _setDpObject(cmobject) {
      this.dpObject = cmobject;
    }
  }, {
    key: "_setRcObject",
    value: function _setRcObject(cmobject) {
      this.rcObject = cmobject;
    }
  }, {
    key: "_setEmObject",
    value: function _setEmObject(cmobject) {
      this.emObject = cmobject;
    }
  }, {
    key: "_setSearchMatches",
    value: function _setSearchMatches(rc_name, num) {
      this.search_match_numbers[rc_name] = num;
      var current_matches = 0;

      for (var cname in this.search_match_numbers) {
        current_matches += this.search_match_numbers[cname];
      }

      this.setState({
        search_matches: current_matches
      });
    }
  }, {
    key: "_getOptionNames",
    value: function _getOptionNames() {
      var onames = [];

      var _iterator6 = _createForOfIteratorHelper(this.state.option_list),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var entry = _step6.value;
          onames.push(entry.name);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      return onames;
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var onames_for_autocomplete = [];

      var _iterator7 = _createForOfIteratorHelper(this._getOptionNames()),
          _step7;

      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var oname = _step7.value;
          var the_text = "self." + oname;
          onames_for_autocomplete.push({
            text: the_text,
            icon: "select",
            render: _autocomplete.renderAutoCompleteElement
          });
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }

      var dark_theme = this.props.controlled ? this.props.dark_theme : this.state.dark_theme; //let hp_height = this.get_height_minus_top_offset(this.hp_ref);

      var my_props = _objectSpread({}, this.props);

      if (!this.props.controlled) {
        var _iterator8 = _createForOfIteratorHelper(controllable_props),
            _step8;

        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var prop_name = _step8.value;
            my_props[prop_name] = this.state[prop_name];
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      }

      var vp_height = this.get_height_minus_top_offset(this.vp_ref);
      var uwidth = my_props.usable_width - 2 * _sizing_tools.SIDE_MARGIN;
      var uheight = my_props.usable_height;
      var code_width = uwidth * this.state.left_pane_fraction - 35;
      var ch_style = {
        "width": "100%"
      };
      var tc_item;

      if (my_props.is_mpl || my_props.is_d3) {
        var tc_height = this.get_new_tc_height();
        var mode = my_props.is_mpl ? "python" : "javascript";
        var code_content = my_props.is_mpl ? this.state.draw_plot_code : this.state.jscript_code;
        var first_line_number = my_props.is_mpl ? this.state.draw_plot_line_number + 1 : 1;
        var title_label = my_props.is_mpl ? "draw_plot" : "(selector, w, h, arg_dict, resizing) =>";
        tc_item = /*#__PURE__*/_react["default"].createElement("div", {
          key: "dpcode",
          style: ch_style,
          className: "d-flex flex-column align-items-baseline code-holder"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          style: {
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%"
          }
        }, /*#__PURE__*/_react["default"].createElement("span", {
          className: "bp4-ui-text",
          ref: this.tc_span_ref,
          style: {
            display: "flex",
            alignItems: "self-end"
          }
        }, title_label), /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
          update_search_state: this._updateSearchState,
          search_string: this.state.search_string,
          regex: this.state.regex,
          allow_regex: true,
          field_width: 200,
          include_search_jumper: true,
          searchPrev: this._searchPrev,
          searchNext: this._searchNext,
          search_ref: this.search_ref,
          number_matches: this.state.search_matches
        })), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
          code_content: code_content,
          mode: mode,
          am_selected: this.props.am_selected,
          extraKeys: this._extraKeys(),
          current_search_number: this.state.current_search_cm == "tc" ? this.state.current_search_number : null,
          handleChange: this.handleTopCodeChange,
          saveMe: this._saveAndCheckpoint,
          setCMObject: this._setDpObject,
          search_term: this.state.search_string,
          update_search_state: this._updateSearchState,
          alt_clear_selections: this._clearAllSelections,
          first_line_number: first_line_number,
          code_container_height: tc_height,
          dark_theme: dark_theme,
          readOnly: this.props.read_only,
          regex_search: this.state.regex,
          setSearchMatches: function setSearchMatches(num) {
            return _this5._setSearchMatches("tc", num);
          },
          extra_autocomplete_list: mode == "python" ? onames_for_autocomplete : []
        }));
      }

      var rc_height;

      if (my_props.is_mpl || my_props.is_d3) {
        var bheight = (1 - this.state.top_pane_fraction) * uheight - 35;
        rc_height = this.get_new_rc_height(bheight);
      } else {
        rc_height = this.get_new_rc_height(vp_height);
      }

      var bc_item = /*#__PURE__*/_react["default"].createElement("div", {
        key: "rccode",
        id: "rccode",
        style: ch_style,
        className: "d-flex flex-column align-items-baseline code-holder"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%"
        }
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "bp4-ui-text",
        style: {
          display: "flex",
          alignItems: "self-end"
        },
        ref: this.rc_span_ref
      }, "render_content"), !my_props.is_mpl && !my_props.is_d3 && /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
        update_search_state: this._updateSearchState,
        search_string: this.state.search_string,
        regex: this.state.regex,
        allow_regex: true,
        field_width: 200,
        include_search_jumper: true,
        searchPrev: this._searchPrev,
        searchNext: this._searchNext,
        search_ref: this.search_ref,
        number_matches: this.state.search_matches
      })), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        code_content: this.state.render_content_code,
        current_search_number: this.state.current_search_cm == "rc" ? this.state.current_search_number : null,
        am_selected: this.props.am_selected,
        handleChange: this.handleRenderContentChange,
        extraKeys: this._extraKeys(),
        saveMe: this._saveAndCheckpoint,
        setCMObject: this._setRcObject,
        search_term: this.state.search_string,
        update_search_state: this._updateSearchState,
        alt_clear_selections: this._clearAllSelections,
        first_line_number: this.state.render_content_line_number + 1,
        code_container_height: rc_height,
        dark_theme: dark_theme,
        readOnly: this.props.read_only,
        regex_search: this.state.regex,
        setSearchMatches: function setSearchMatches(num) {
          return _this5._setSearchMatches("rc", num);
        },
        extra_autocomplete_list: onames_for_autocomplete
      }));

      var left_pane;

      if (my_props.is_mpl || my_props.is_d3) {
        left_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
          ref: this.vp_ref
        }), /*#__PURE__*/_react["default"].createElement(_resizing_layouts.VerticalPanes, {
          top_pane: tc_item,
          bottom_pane: bc_item,
          show_handle: true,
          available_height: vp_height,
          available_width: this.state.left_pane_fraction * uwidth - 20,
          handleSplitUpdate: this.handleTopPaneResize,
          id: "creator-left"
        }));
      } else {
        left_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
          ref: this.vp_ref
        }, bc_item));
      }

      var default_module_height = this.get_height_minus_top_offset(null, 128, 128);
      var mdata_style = {
        marginLeft: 20,
        overflow: "auto",
        padding: 15,
        height: default_module_height
      };

      var mdata_panel = /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
        tags: this.state.tags,
        readOnly: this.props.readOnly,
        notes: this.state.notes,
        icon: this.state.icon,
        created: my_props.created,
        category: this.state.category,
        pane_type: "tile",
        notes_buttons: this._metadataNotesButtons,
        handleChange: this.handleStateChange
      });

      var option_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.OptionModule, {
        options_ref: this.options_ref,
        data_list: this.state.option_list,
        foregrounded: this.state.foregrounded_panes["options"],
        handleChange: this.handleOptionsChange,
        handleNotesAppend: this._handleNotesAppend,
        available_height: default_module_height
      });

      var export_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.ExportModule, {
        export_list: this.state.export_list,
        save_list: this.state.additional_save_attrs,
        couple_save_attrs_and_exports: this.state.couple_save_attrs_and_exports,
        foregrounded: this.state.foregrounded_panes["exports"],
        handleChange: this.handleStateChange,
        handleNotesAppend: this._handleNotesAppend,
        available_height: default_module_height
      });

      var methods_height = this.get_height_minus_top_offset(this.methods_ref, 128, 128);

      var methods_panel = /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          marginLeft: 5
        }
      }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        handleChange: this.handleMethodsChange,
        show_fold_button: true,
        am_selected: this.props.am_selected,
        current_search_number: this.state.current_search_cm == "em" ? this.state.current_search_number : null,
        dark_theme: dark_theme,
        extraKeys: this._extraKeys(),
        readOnly: this.props.readOnly,
        code_content: this.state.extra_functions,
        saveMe: this._saveAndCheckpoint,
        setCMObject: this._setEmObject,
        code_container_ref: this.methods_ref,
        code_container_height: methods_height,
        search_term: this.state.search_string,
        update_search_state: this._updateSearchState,
        alt_clear_selections: this._clearAllSelections,
        regex_search: this.state.regex,
        first_line_number: this.state.extra_methods_line_number,
        setSearchMatches: function setSearchMatches(num) {
          return _this5._setSearchMatches("em", num);
        },
        extra_autocomplete_list: onames_for_autocomplete
      }));

      var commands_height = this.get_height_minus_top_offset(this.commands_ref, 128, 128);

      var commands_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.CommandsModule, {
        foregrounded: this.state.foregrounded_panes["commands"],
        available_height: commands_height,
        commands_ref: this.commands_ref
      });

      var right_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        id: "creator-resources",
        className: "d-block"
      }, /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
        id: "resource_tabs",
        selectedTabId: this.state.selectedTabId,
        large: false,
        onChange: this._handleTabSelect
      }, /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "metadata",
        title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
          size: 12,
          icon: "manually-entered-data"
        }), " metadata"),
        panel: mdata_panel
      }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "options",
        title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
          size: 12,
          icon: "select"
        }), " options"),
        panel: option_panel
      }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "exports",
        title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
          size: 12,
          icon: "export"
        }), " exports"),
        panel: export_panel
      }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "methods",
        title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
          size: 12,
          icon: "code"
        }), " methods"),
        panel: methods_panel
      }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "commands",
        title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
          size: 12,
          icon: "manual"
        }), " documentation"),
        panel: commands_panel
      }))));

      var outer_style = {
        width: "100%",
        height: uheight,
        paddingLeft: this.props.controlled ? 5 : _sizing_tools.SIDE_MARGIN,
        paddingTop: 15
      };
      var outer_class = "resource-viewer-holder pane-holder";

      if (!window.in_context) {
        if (dark_theme) {
          outer_class = outer_class + " bp4-dark";
        } else {
          outer_class = outer_class + " light-theme";
        }
      }

      return /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, !window.in_context && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        dark_theme: dark_theme,
        setTheme: this.props.controlled ? this.props.setTheme : this._setTheme,
        selected: null,
        show_api_links: true,
        page_id: this.props.module_viewer_id,
        user_name: window.username
      }), /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
        menu_specs: this.menu_specs,
        showRefresh: window.in_context,
        showClose: window.in_context,
        dark_theme: dark_theme,
        refreshTab: this.props.refreshTab,
        closeTab: this.props.closeTab,
        resource_name: this._cProp("resource_name"),
        showErrorDrawerButton: true,
        toggleErrorDrawer: this.props.toggleErrorDrawer,
        controlled: this.props.controlled,
        am_selected: this.props.am_selected
      }), /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: outer_class,
        ref: this.top_ref,
        style: outer_style
      }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
        left_pane: left_pane,
        right_pane: right_pane,
        show_handle: true,
        available_height: uheight,
        available_width: uwidth,
        handleSplitUpdate: this.handleLeftPaneResize
      }))));
    }
  }], [{
    key: "_selectLine",
    value: function _selectLine(cm, lnumber) {
      var doc = cm.getDoc();

      if (doc.getLine(lnumber)) {
        doc.setSelection({
          line: lnumber,
          ch: 0
        }, {
          line: lnumber,
          ch: doc.getLine(lnumber).length
        }, {
          scroll: true
        });
      }
    }
  }]);

  return CreatorApp;
}(_react["default"].Component);

exports.CreatorApp = CreatorApp;
CreatorApp.propTypes = {
  controlled: _propTypes["default"].bool,
  am_selected: _propTypes["default"].bool,
  changeResourceName: _propTypes["default"].func,
  changeResourceTitle: _propTypes["default"].func,
  changeResourceProps: _propTypes["default"].func,
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func,
  registerLineSetter: _propTypes["default"].func,
  updatePanel: _propTypes["default"].func,
  is_mpl: _propTypes["default"].bool,
  render_content_code: _propTypes["default"].string,
  render_content_line_number: _propTypes["default"].number,
  extra_methods_line_number: _propTypes["default"].number,
  category: _propTypes["default"].string,
  extra_functions: _propTypes["default"].string,
  draw_plot_code: _propTypes["default"].string,
  jscript_code: _propTypes["default"].string,
  tags: _propTypes["default"].array,
  notes: _propTypes["default"].string,
  icon: _propTypes["default"].string,
  option_list: _propTypes["default"].array,
  export_list: _propTypes["default"].array,
  created: _propTypes["default"].string,
  tsocket: _propTypes["default"].object,
  usable_height: _propTypes["default"].number,
  usable_width: _propTypes["default"].number
};
CreatorApp.defaultProps = {
  am_selected: true,
  controlled: false,
  changeResourceName: null,
  changeResourceTitle: null,
  changeResourceProps: null,
  registerLineSetter: null,
  refreshTab: null,
  closeTab: null,
  updatePanel: null
};

if (!window.in_context) {
  tile_creator_main();
}