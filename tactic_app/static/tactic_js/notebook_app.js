"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.notebook_props = notebook_props;
exports.NotebookApp = void 0;

require("../tactic_css/tactic.scss");

require("../tactic_css/tactic_console.scss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _blueprint_navbar = require("./blueprint_navbar.js");

var _main_menus_react = require("./main_menus_react.js");

var _tactic_socket = require("./tactic_socket.js");

var _console_component = require("./console_component.js");

var _toaster = require("./toaster.js");

var _utilities_react = require("./utilities_react.js");

var _communication_react = require("./communication_react.js");

var _export_viewer_react = require("./export_viewer_react");

var _resizing_layouts = require("./resizing_layouts");

var _error_drawer = require("./error_drawer.js");

var _tactic_context = require("./tactic_context.js");

var _sizing_tools = require("./sizing_tools.js");

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

var MARGIN_SIZE = 10;
var BOTTOM_MARGIN = 20;
var MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the conso

var USUAL_TOOLBAR_HEIGHT = 50;
var MENU_BAR_HEIGHT = 30; // will only appear when in context

var tsocket;
var ppi;

function main_main() {
  function gotProps(the_props) {
    var NotebookAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(NotebookApp));

    var the_element = /*#__PURE__*/_react["default"].createElement(NotebookAppPlus, _extends({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));

    var domContainer = document.querySelector('#main-root');
    ReactDOM.render(the_element, domContainer);
  }

  (0, _utilities_react.renderSpinnerMessage)("Starting up ...");
  var target = window.is_new_notebook ? "new_notebook_in_context" : "main_project_in_context";
  var resource_name = window.is_new_notebook ? "" : window.project_name;
  var post_data = {
    "resource_name": resource_name
  };

  if (window.is_new_notebook) {
    post_data.temp_data_id = window.temp_data_id;
  }

  (0, _communication_react.postAjaxPromise)(target, post_data).then(function (data) {
    notebook_props(data, null, gotProps);
  });
}

function notebook_props(data, registerDirtyMethod, finalCallback) {
  ppi = (0, _utilities_react.get_ppi)();
  var main_id = data.main_id;

  if (!window.in_context) {
    window.main_id = main_id;
  }

  var tsocket = new _tactic_socket.TacticSocket("main", 5000, main_id, function (response) {
    tsocket.socket.on("remove-ready-block", readyListener);
    tsocket.socket.emit('client-ready', {
      "room": main_id,
      "user_id": window.user_id,
      "participant": "client",
      "rb_id": data.ready_block_id,
      "main_id": main_id
    });
  });
  tsocket.socket.on('finish-post-load', _finish_post_load_in_context);

  function readyListener() {
    _everyone_ready_in_context(finalCallback);
  }

  var is_totally_new = !data.is_jupyter && !data.is_project && data.temp_data_id == "";
  var opening_from_temp_id = data.temp_data_id != "";
  window.addEventListener("unload", function sendRemove() {
    console.log("got the beacon");
    navigator.sendBeacon("/remove_mainwindow", JSON.stringify({
      "main_id": main_id
    }));
  });

  function _everyone_ready_in_context() {
    if (!window.in_context) {
      (0, _utilities_react.renderSpinnerMessage)("Everyone is ready, initializing...");
    }

    tsocket.socket.off("remove-ready-block", readyListener);
    tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, main_id);
    });
    var data_dict = {
      "doc_type": "notebook",
      "base_figure_url": data.base_figure_url,
      "user_id": window.user_id,
      "ppi": ppi
    };

    if (is_totally_new) {
      (0, _communication_react.postWithCallback)(main_id, "initialize_mainwindow", data_dict, _finish_post_load_in_context, null, main_id);
    } else {
      if (data.is_jupyter) {
        data_dict["doc_type"] = "jupyter";
        data_dict["project_name"] = data.project_name;
      } else if (data.is_project) {
        data_dict["project_name"] = data.project_name;
      } else {
        data_dict["unique_id"] = data.temp_data_id;
      }

      (0, _communication_react.postWithCallback)(main_id, "initialize_project_mainwindow", data_dict, null, null, main_id);
    }
  }

  function _finish_post_load_in_context(fdata) {
    if (!window.in_context) {
      (0, _utilities_react.renderSpinnerMessage)("Creating the page...");
    }

    tsocket.socket.off("finish-post-load", _finish_post_load_in_context);
    var interface_state;

    if (data.is_project || opening_from_temp_id) {
      interface_state = fdata.interface_state;
    }

    var domContainer = document.querySelector('#main-root');

    if (data.is_project || opening_from_temp_id) {
      finalCallback({
        is_project: true,
        main_id: main_id,
        resource_name: data.project_name,
        tsocket: tsocket,
        interface_state: interface_state,
        is_notebook: true,
        is_juptyer: data.is_jupyter,
        initial_theme: window.theme,
        registerDirtyMethod: registerDirtyMethod
      });
    } else {
      finalCallback({
        is_project: false,
        main_id: main_id,
        resource_name: data.project_name,
        tsocket: tsocket,
        interface_state: null,
        is_notebook: true,
        is_juptyer: data.is_jupyter,
        initial_theme: window.theme,
        registerDirtyMethod: registerDirtyMethod
      });
    }
  }
}

var save_attrs = ["console_items", "show_exports_pane", "console_width_fraction"];
var controllable_props = ["is_project", "resource_name", "usable_width", "usable_height"];

var NotebookApp = /*#__PURE__*/function (_React$Component) {
  _inherits(NotebookApp, _React$Component);

  var _super = _createSuper(NotebookApp);

  function NotebookApp(props) {
    var _this;

    _classCallCheck(this, NotebookApp);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.last_save = {};
    _this.main_outer_ref = /*#__PURE__*/_react["default"].createRef();
    _this.socket_counter = null;
    _this.state = {
      mounted: false,
      console_items: [],
      console_width_fraction: .5,
      show_exports_pane: true
    };

    var self = _assertThisInitialized(_this);

    if (_this.props.controlled) {
      props.registerDirtyMethod(_this._dirty);
      _this.height_adjustment = MENU_BAR_HEIGHT;
    } else {
      _this.height_adjustment = 0;
      _this.state.dark_theme = props.initial_theme === "dark";
      _this.state.resource_name = props.resource_name;
      _this.state.usable_height = (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
      _this.state.usable_width = (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
      _this.state.is_project = props.is_project;
      window.addEventListener("beforeunload", function (e) {
        if (self._dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }

    if (props.is_project) {
      var _iterator = _createForOfIteratorHelper(save_attrs),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var attr = _step.value;
          _this.state[attr] = _this.props.interface_state[attr];
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    return _this;
  }

  _createClass(NotebookApp, [{
    key: "_cProp",
    value: function _cProp(pname) {
      return this.props.controlled ? this.props[pname] : this.state[pname];
    }
  }, {
    key: "_update_window_dimensions",
    value: function _update_window_dimensions() {
      var uwidth;
      var uheight;

      if (this.main_outer_ref && this.main_outer_ref.current) {
        uheight = window.innerHeight - this.main_outer_ref.current.offsetTop;
        uwidth = window.innerWidth - this.main_outer_ref.current.offsetLeft;
      } else {
        uheight = window.innerHeight - USUAL_TOOLBAR_HEIGHT;
        uwidth = window.innerWidth - 2 * MARGIN_SIZE;
      }

      this.setState({
        usable_height: uheight,
        usable_width: uwidth
      });
    }
  }, {
    key: "_updateLastSave",
    value: function _updateLastSave() {
      this.last_save = this.interface_state;
    }
  }, {
    key: "_dirty",
    value: function _dirty() {
      var current_state = this.interface_state;

      for (var k in current_state) {
        if (current_state[k] != this.last_save[k]) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "mounted": true
      });

      this._updateLastSave();

      this.props.stopSpinner();

      if (!this.props.controlled) {
        document.title = this.state.resource_name;
        window.dark_theme = this.state.dark_theme;
        window.addEventListener("resize", this._update_window_dimensions);

        this._update_window_dimensions();
      }
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.tsocket.disconnect();
      this.delete_my_containers();
    }
  }, {
    key: "delete_my_containers",
    value: function delete_my_containers() {
      (0, _communication_react.postAjax)("/remove_mainwindow", {
        "main_id": this.props.main_id
      });
    }
  }, {
    key: "initSocket",
    value: function initSocket() {
      var self = this;
      this.props.tsocket.attachListener('forcedisconnect', function () {
        this.props.tsocket.socket.disconnect();
      });

      if (!window.in_context) {
        this.props.tsocket.attachListener("window-open", function (data) {
          window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
        });
        this.props.tsocket.attachListener("doFlash", function (data) {
          (0, _toaster.doFlash)(data);
        });
        this.props.tsocket.attachListener('close-user-windows', function (data) {
          if (!(data["originator"] == main_id)) {
            window.close();
          }
        });
      }
    }
  }, {
    key: "_setTheme",
    value: function _setTheme(dark_theme) {
      var _this2 = this;

      this.setState({
        dark_theme: dark_theme
      }, function () {
        window.dark_theme = _this2.state.dark_theme;
      });
    }
  }, {
    key: "_setMainStateValue",
    value: function _setMainStateValue(field_name, value) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var new_state = {};
      new_state[field_name] = value;
      this.setState(new_state, callback);
    }
  }, {
    key: "_broadcast_event_to_server",
    value: function _broadcast_event_to_server(event_name, data_dict, callback) {
      data_dict.main_id = this.props.main_id;
      data_dict.event_name = event_name;
      (0, _communication_react.postWithCallback)(this.props.main_id, "distribute_events_stub", data_dict, callback, null, this.props.main - id);
    }
  }, {
    key: "_handleConsoleFractionChange",
    value: function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
      this.setState({
        console_width_fraction: new_fraction
      });
    }
  }, {
    key: "interface_state",
    get: function get() {
      var interface_state = {};

      var _iterator2 = _createForOfIteratorHelper(save_attrs),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var attr = _step2.value;
          interface_state[attr] = this.state[attr];
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return interface_state;
    }
  }, {
    key: "_setProjectName",
    value: function _setProjectName(new_project_name) {
      var self = this;

      if (this.props.controlled) {
        this.props.updatePanel({
          res_type: "project",
          title: new_project_name,
          panel: {
            resource_name: new_project_name,
            is_project: true
          }
        }, function () {
          self.setState({
            is_jupyter: false
          });
        });
      } else {
        this.setState({
          resource_name: new_project_name,
          is_project: true,
          is_jupyter: false
        });
      }
    }
  }, {
    key: "get_zoomed_console_height",
    value: function get_zoomed_console_height() {
      if (this.state.mounted && this.main_outer_ref.current) {
        return this._cProp("usable_height") - this.height_adjustment - BOTTOM_MARGIN;
      } else {
        return this._cProp("usable_height") - this.height_adjustment - 50;
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var dark_theme = this.props.controlled ? this.context.dark_theme : this.state.dark_theme;

      var my_props = _objectSpread({}, this.props);

      if (!this.props.controlled) {
        var _iterator3 = _createForOfIteratorHelper(controllable_props),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var prop_name = _step3.value;
            my_props[prop_name] = this.state[prop_name];
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }

      var true_usable_width = my_props.usable_width;
      var console_available_height = this.get_zoomed_console_height() - MARGIN_ADJUSTMENT;
      var project_name = my_props.is_project ? this.props.resource_name : "";

      var menus = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_main_menus_react.ProjectMenu, _extends({}, this.props.statusFuncs, {
        main_id: this.props.main_id,
        project_name: project_name,
        is_notebook: true,
        is_juptyer: this.props.is_jupyter,
        setProjectName: this._setProjectName,
        postAjaxFailure: this.props.postAjaxFailure,
        console_items: this.state.console_items,
        interface_state: this.interface_state,
        updateLastSave: this._updateLastSave,
        changeCollection: null,
        disabled_items: my_props.is_project ? [] : ["Save"],
        hidden_items: ["Open Console as Notebook", "Export Table as Collection", "Change collection"]
      })));

      var console_pane = /*#__PURE__*/_react["default"].createElement(_console_component.ConsoleComponent, _extends({}, this.props.statusFuncs, {
        main_id: this.props.main_id,
        console_items: this.state.console_items,
        console_is_shrunk: false,
        console_is_zoomed: true,
        show_exports_pane: this.state.show_exports_pane,
        setMainStateValue: this._setMainStateValue,
        console_available_height: console_available_height - MARGIN_SIZE,
        console_available_width: true_usable_width * this.state.console_width_fraction - 16,
        zoomable: false,
        shrinkable: false,
        style: {
          marginTop: MARGIN_SIZE
        }
      }));

      var exports_pane;

      if (this.state.show_exports_pane) {
        exports_pane = /*#__PURE__*/_react["default"].createElement(_export_viewer_react.ExportsViewer, {
          main_id: this.props.main_id,
          setUpdate: function setUpdate(ufunc) {
            _this3.updateExportsList = ufunc;
          },
          setMainStateValue: this._setMainStateValue,
          available_height: console_available_height - MARGIN_SIZE,
          console_is_shrunk: false,
          console_is_zoomed: true,
          style: {
            marginTop: MARGIN_SIZE
          }
        });
      } else {
        exports_pane = /*#__PURE__*/_react["default"].createElement("div", null);
      }

      var outer_class = "main-outer";

      if (dark_theme) {
        outer_class = outer_class + " bp3-dark";
      } else {
        outer_class = outer_class + " light-theme";
      }

      var outer_style = {
        width: "100%",
        height: my_props.usable_height - this.height_adjustment
      };
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_tactic_context.TacticContext.Provider, {
        value: {
          readOnly: this.props.readOnly,
          tsocket: this.props.tsocket,
          dark_theme: dark_theme,
          setTheme: this.props.controlled ? this.context.setTheme : this._setTheme,
          controlled: this.props.controlled,
          am_selected: this.props.am_selected,
          handleCreateViewer: this.context.handleCreateViewer
        }
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        user_name: window.username,
        menus: menus,
        show_api_links: true,
        page_id: this.props.main_id,
        min_navbar: window.in_context,
        refreshTab: this.props.refreshTab,
        closeTab: this.props.closeTab
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: outer_class,
        ref: this.main_outer_ref,
        style: outer_style
      }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
        left_pane: console_pane,
        right_pane: exports_pane,
        show_handle: true,
        available_height: console_available_height,
        available_width: true_usable_width,
        initial_width_fraction: this.state.console_width_fraction,
        controlled: true,
        dragIconSize: 15,
        handleSplitUpdate: this._handleConsoleFractionChange
      }))));
    }
  }]);

  return NotebookApp;
}(_react["default"].Component);

exports.NotebookApp = NotebookApp;
NotebookApp.propTypes = {
  console_items: _propTypes["default"].array,
  console_component: _propTypes["default"].object,
  is_project: _propTypes["default"].bool,
  interface_state: _propTypes["default"].object,
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func
};
NotebookApp.defaultProps = {
  refreshTab: null,
  closeTab: null
};
NotebookApp.contextType = _tactic_context.TacticContext;

if (!window.in_context) {
  main_main();
}