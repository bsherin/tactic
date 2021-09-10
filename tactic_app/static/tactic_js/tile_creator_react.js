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

var _blueprint_toolbar = require("./blueprint_toolbar.js");

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

var _blueprint_navbar = require("./blueprint_navbar");

var _library_widgets = require("./library_widgets");

var _tactic_context = require("./tactic_context.js");

var _blueprint_react_widgets = require("./blueprint_react_widgets");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

      var _iterator = _createForOfIteratorHelper(odict),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var option = _step.value;

          for (var param in option) {
            if (Array.isArray(option[param])) {
              var nstring = "[";
              var isfirst = true;

              var _iterator2 = _createForOfIteratorHelper(option[param]),
                  _step2;

              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var item = _step2.value;

                  if (!isfirst) {
                    nstring += ", ";
                  } else {
                    isfirst = false;
                  }

                  nstring += "'" + String(item) + "'";
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
              }

              nstring += "]";
              option[param] = nstring;
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      finalCallback({
        resource_name: module_name,
        tsocket: tsocket,
        module_viewer_id: module_viewer_id,
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
        initial_theme: window.theme,
        option_list: parsed_data.option_dict,
        export_list: parsed_data.export_list,
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
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_toolbar.Namebutton, {
    resource_name: props.resource_name,
    setResourceNameState: props.setResourceNameState,
    res_type: props.res_type,
    large: false
  }), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_blueprint_toolbar.Toolbar, {
    button_groups: props.button_groups,
    alternate_outer_style: toolbar_outer_style
  })), /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    update_search_state: props.update_search_state,
    search_string: props.search_string,
    field_width: 200
  }));
}

TileCreatorToolbar.proptypes = {
  button_groups: _propTypes["default"].array,
  setResourceNameState: _propTypes["default"].func,
  resource_name: _propTypes["default"].string,
  search_string: _propTypes["default"].string,
  update_search_state: _propTypes["default"].func,
  res_type: _propTypes["default"].string
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
    _this.last_save = {};
    _this.dpObject = null;
    _this.rcObject = null;
    _this.emObject = null;
    _this.line_number = _this.props.initial_line_number;
    _this.socket_counter = null;
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
      option_list: _this.props.option_list,
      export_list: _this.props.export_list,
      category: _this.props.category,
      selectedTabId: "metadata",
      old_usable_width: 0,
      methodsTabRefreshRequired: true // This is toggled back and forth to force refresh

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

    _this.state.top_pane_fraction = _this.props.is_mpl || _this.props.is_d3 ? .5 : 1;
    _this.state.left_pane_fraction = .5; // this.state.left_pane_width = this._cProp("usable_width") / 2 - 25,
    // this.state.bheight = aheight;

    _this._setResourceNameState = _this._setResourceNameState.bind(_assertThisInitialized(_this));
    _this.handleStateChange = _this.handleStateChange.bind(_assertThisInitialized(_this));
    _this.handleRenderContentChange = _this.handleRenderContentChange.bind(_assertThisInitialized(_this));
    _this.handleTopCodeChange = _this.handleTopCodeChange.bind(_assertThisInitialized(_this));
    _this.handleOptionsChange = _this.handleOptionsChange.bind(_assertThisInitialized(_this));
    _this.handleExportsChange = _this.handleExportsChange.bind(_assertThisInitialized(_this));
    _this.handleMethodsChange = _this.handleMethodsChange.bind(_assertThisInitialized(_this));
    _this.handleLeftPaneResize = _this.handleLeftPaneResize.bind(_assertThisInitialized(_this));
    _this.handleTopPaneResize = _this.handleTopPaneResize.bind(_assertThisInitialized(_this));
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

      if (!window.in_context) {
        this.props.tsocket.attachListener("doFlash", function (data) {
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
    key: "button_groups",
    get: function get() {
      var _this3 = this;

      var bgs = [[{
        "name_text": "Save",
        "icon_name": "saved",
        "click_handler": this._saveMe,
        key_bindings: ['ctrl+s', "command+s"],
        tooltip: "Save"
      }, {
        "name_text": "Mark",
        "icon_name": "map-marker",
        "click_handler": this._saveAndCheckpoint,
        key_bindings: ['ctrl+m'],
        tooltip: "Save and checkpoint"
      }, {
        "name_text": "SaveAs",
        "icon_name": "floppy-disk",
        "click_handler": this._saveModuleAs,
        tooltip: "Save as"
      }, {
        "name_text": "Load",
        "icon_name": "upload",
        "click_handler": this._loadModule,
        key_bindings: ['ctrl+l'],
        tooltip: "Load tile"
      }, {
        "name_text": "Share",
        "icon_name": "share",
        "click_handler": function click_handler() {
          (0, _resource_viewer_react_app.sendToRepository)("tile", _this3._cProp("resource_name"));
        },
        tooltip: "Send to repository"
      }], [{
        "name_text": "History",
        "icon_name": "history",
        "click_handler": this._showHistoryViewer,
        tooltip: "Show history viewer"
      }, {
        "name_text": "Compare",
        "icon_name": "comparison",
        "click_handler": this._showTileDiffer,
        tooltip: "Compare to another tile"
      }], [{
        "name_text": "Drawer",
        "icon_name": "drawer-right",
        "click_handler": this.props.toggleErrorDrawer,
        tooltip: "Toggle error drawer"
      }]];

      for (var _i = 0, _bgs = bgs; _i < _bgs.length; _i++) {
        var bg = _bgs[_i];

        var _iterator3 = _createForOfIteratorHelper(bg),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var but = _step3.value;
            but.click_handler = but.click_handler.bind(this);
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }

      return bgs;
    }
  }, {
    key: "_updateSearchState",
    value: function _updateSearchState(new_state) {
      this.setState(new_state);
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
    key: "_loadModule",
    value: function _loadModule() {
      var self = this;
      this.props.startSpinner();
      this.doSavePromise().then(function () {
        self.props.statusMessage("Loading Module");
        (0, _communication_react.postWithCallback)("host", "load_tile_module_task", {
          "tile_module_name": self._cProp("resource_name"),
          "user_id": user_id
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
    key: "_saveModuleAs",
    value: function _saveModuleAs() {
      (0, _toaster.doFlash)({
        "message": "not implemented yet"
      });
      return false;
    }
  }, {
    key: "_saveMe",
    value: function _saveMe() {
      var self = this;
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

      var _iterator4 = _createForOfIteratorHelper(taglist),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var tag = _step4.value;
          tags = tags + tag + " ";
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
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
        "exports": this.state.export_list,
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
      this.setState({
        usable_width: window.innerWidth - this.top_ref.current.offsetLeft,
        usable_height: window.innerHeight - this.top_ref.current.offsetTop
      });
    }
  }, {
    key: "_update_saved_state",
    value: function _update_saved_state() {
      this.last_save = this._getSaveDict();
    }
  }, {
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
  }, {
    key: "_goToLineNumber",
    value: function _goToLineNumber() {
      if (this.line_number) {
        this.props.closeErrorDrawer();

        if (this.props.is_mpl || this.props.is_d3) {
          if (this.line_number < this.state.draw_plot_line_number) {
            if (this.emObject) {
              this._handleTabSelect("methods");

              this._selectLine(this.emObject, this.line_number - this.state.extra_methods_line_number);

              this.line_number = null;
            } else {
              return;
            }
          } else if (this.line_number < this.state.render_content_line_number) {
            if (this.dpObject) {
              this._selectLine(this.dpObject, this.line_number - this.state.draw_plot_line_number - 1);

              this.line_number = null;
            } else {
              return;
            }
          } else if (this.rcObject) {
            this._selectLine(this.rcObject, this.line_number - this.state.render_content_line_number - 1);

            this.line_number = null;
          }
        } else {
          if (this.line_number < this.props.render_content_line_number) {
            if (this.emObject) {
              this._handleTabSelect("methods");

              this._selectLine(this.emObject, this.line_number - this.state.extra_methods_line_number);

              this.line_number = null;
            } else {
              return;
            }
          } else {
            if (this.rcObject) {
              this._selectLine(this.rcObject, this.line_number - this.state.render_content_line_number - 1);

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
    value: function componentDidUpdate() {
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
    } // This toggles methodsTabRefreshRequired back and forth to force a refresh

  }, {
    key: "_refreshMethodsIfNecessary",
    value: function _refreshMethodsIfNecessary(newTabId) {
      if (newTabId == "methods") {
        this.setState({
          methodsTabRefreshRequired: !this.state.methodsTabRefreshRequired
        });
      }
    }
  }, {
    key: "_handleTabSelect",
    value: function _handleTabSelect(newTabId, prevTabid, event) {
      var _this4 = this;

      this._refreshMethodsIfNecessary(newTabId); // if (this.state.foregrounded_panes[newTabId]) return;


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
    key: "handleStateChange",
    value: function handleStateChange(state_stuff) {
      this.setState(state_stuff);
    }
  }, {
    key: "handleOptionsChange",
    value: function handleOptionsChange(new_option_list) {
      this.setState({
        "option_list": new_option_list
      });
    }
  }, {
    key: "handleExportsChange",
    value: function handleExportsChange(new_export_list) {
      this.setState({
        "export_list": new_export_list
      });
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

      if (this.state.mounted) {
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
        return this._cProp("usable_height") * top_fraction - 35;
      } else {
        return this._cProp("usable_height") - 50;
      }
    }
  }, {
    key: "get_new_rc_height",
    value: function get_new_rc_height(outer_rc_height) {
      if (this.state.mounted) {
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
      if (this.props.controlled) {
        this.props.changeResourceName(new_name);
      } else {
        this.setState({
          "resource_name": new_name
        });
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
    key: "render",
    value: function render() {
      var dark_theme = this.props.controlled ? this.props.dark_theme : this.state.dark_theme; //let hp_height = this.get_height_minus_top_offset(this.hp_ref);

      var my_props = _objectSpread({}, this.props);

      if (!this.props.controlled) {
        var _iterator5 = _createForOfIteratorHelper(controllable_props),
            _step5;

        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var prop_name = _step5.value;
            my_props[prop_name] = this.state[prop_name];
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
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
        var title_label = my_props.is_mpl ? "draw_plot" : "(selector, w, h, arg_dict) =>";
        tc_item = /*#__PURE__*/_react["default"].createElement("div", {
          key: "dpcode",
          style: ch_style,
          className: "d-flex flex-column align-items-baseline code-holder"
        }, /*#__PURE__*/_react["default"].createElement("span", {
          ref: this.tc_span_ref
        }, title_label), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
          code_content: code_content,
          mode: mode,
          handleChange: this.handleTopCodeChange,
          saveMe: this._saveAndCheckpoint,
          setCMObject: this._setDpObject,
          search_term: this.state.search_string,
          first_line_number: first_line_number,
          code_container_height: tc_height
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
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "bp3-ui-text",
        ref: this.rc_span_ref
      }, "render_content"), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        code_content: this.state.render_content_code,
        handleChange: this.handleRenderContentChange,
        saveMe: this._saveAndCheckpoint,
        setCMObject: this._setRcObject,
        search_term: this.state.search_string,
        first_line_number: this.state.render_content_line_number + 1,
        code_container_height: rc_height
      }));

      var left_pane;

      if (my_props.is_mpl || my_props.is_d3) {
        left_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(TileCreatorToolbar, {
          controlled: this.props.controlled,
          am_selected: this.props.am_selected,
          resource_name: my_props.resource_name,
          setResourceNameState: this._setResourceNameState,
          res_type: "tile",
          button_groups: this.button_groups,
          update_search_state: this._updateSearchState,
          search_string: this.state.search_string,
          key: "toolbar"
        }), /*#__PURE__*/_react["default"].createElement("div", {
          ref: this.vp_ref
        }), /*#__PURE__*/_react["default"].createElement(_resizing_layouts.VerticalPanes, {
          top_pane: tc_item,
          bottom_pane: bc_item,
          show_handle: true,
          available_height: vp_height,
          available_width: this.state.left_pane_fraction * uwidth - 25,
          handleSplitUpdate: this.handleTopPaneResize,
          id: "creator-left"
        }));
      } else {
        left_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(TileCreatorToolbar, {
          resource_name: my_props.resource_name,
          setResourceNameState: this._setResourceNameState,
          res_type: "tile",
          button_groups: this.button_groups,
          update_search_state: this._updateSearchState,
          search_string: this.state.search_string,
          key: "toolbar"
        }), /*#__PURE__*/_react["default"].createElement("div", {
          ref: this.vp_ref
        }, bc_item));
      }

      var mdata_panel = /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
        tags: this.state.tags,
        notes: this.state.notes,
        created: my_props.created,
        category: this.state.category,
        res_type: "tile",
        handleChange: this.handleStateChange
      });

      var option_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.OptionModule, {
        options_ref: this.options_ref,
        data_list: this.state.option_list,
        foregrounded: this.state.foregrounded_panes["options"],
        handleChange: this.handleOptionsChange,
        handleNotesAppend: this._handleNotesAppend
      });

      var export_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.ExportModule, {
        data_list: this.state.export_list,
        foregrounded: this.state.foregrounded_panes["exports"],
        handleChange: this.handleExportsChange,
        handleNotesAppend: this._handleNotesAppend
      });

      var methods_height = this.get_height_minus_top_offset(this.methods_ref, 128, 128);

      var methods_panel = /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          marginTop: 30
        }
      }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        handleChange: this.handleMethodsChange,
        code_content: this.state.extra_functions,
        saveMe: this._saveAndCheckpoint,
        setCMObject: this._setEmObject,
        code_container_ref: this.methods_ref,
        code_container_height: methods_height,
        search_term: this.state.search_string,
        first_line_number: this.state.extra_methods_line_number,
        refresh_required: this.state.methodsTabRefreshRequired
      }));

      var commands_height = this.get_height_minus_top_offset(this.commands_ref, 128, 128);

      var commands_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.CommandsModule, {
        foregrounded: this.state.foregrounded_panes["commands"],
        available_height: commands_height,
        commands_ref: this.commands_ref
      });

      var right_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        id: "creator-resources",
        className: window.in_context ? "d-block" : "d-block mt-2"
      }, /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
        id: "resource_tabs",
        selectedTabId: this.state.selectedTabId,
        large: true,
        onChange: this._handleTabSelect
      }, /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "metadata",
        title: "metadata",
        panel: mdata_panel
      }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "options",
        title: "options",
        panel: option_panel
      }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "exports",
        title: "exports",
        panel: export_panel
      }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "methods",
        title: "methods",
        panel: methods_panel
      }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "commands",
        title: "tactic api",
        panel: commands_panel
      }))));

      var outer_style = {
        width: "100%",
        height: uheight,
        paddingLeft: this.props.controlled ? 5 : _sizing_tools.SIDE_MARGIN
      };
      var outer_class = "resource-viewer-holder";

      if (!window.in_context) {
        if (dark_theme) {
          outer_class = outer_class + " bp3-dark";
        } else {
          outer_class = outer_class + " light-theme";
        }
      } // if (this.top_ref && this.top_ref.current) {
      //     my_props.usable_width = my_props.usable_width - this.top_ref.current.offsetLeft;
      // }


      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_tactic_context.TacticContext.Provider, {
        value: {
          readOnly: this.props.readOnly,
          tsocket: this.props.tsocket,
          dark_theme: dark_theme,
          setTheme: this.props.controlled ? this.context.setTheme : this._setTheme,
          controlled: this.props.controlled,
          am_selected: this.props.am_selected
        }
      }, !window.in_context && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        selected: null,
        show_api_links: true,
        page_id: this.props.module_viewer_id,
        user_name: window.username
      }), window.in_context && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.TopRightButtons, {
        refreshTab: this.props.refreshTab,
        closeTab: this.props.closeTab
      }), /*#__PURE__*/_react["default"].createElement(_core.ResizeSensor, {
        onResize: this._handleResize,
        observeParents: true
      }, /*#__PURE__*/_react["default"].createElement("div", {
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
      })))));
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
CreatorApp.contextType = _tactic_context.TacticContext;

if (!window.in_context) {
  tile_creator_main();
}