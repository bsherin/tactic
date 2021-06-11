"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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
var BOTTOM_MARGIN = 20;
var USUAL_TOOLBAR_HEIGHT = 50;
var tsocket;
var ppi; // Note: it seems like the sendbeacon doesn't work if this callback has a line
// before the sendbeacon

window.addEventListener("unload", function sendRemove() {
  navigator.sendBeacon("/remove_mainwindow", JSON.stringify({
    "main_id": window.main_id
  }));
});

function _main_main() {
  //render_navbar();
  console.log("entering _notebook_main with flipped finish-post-load position");
  ppi = (0, _utilities_react.get_ppi)();
  tsocket = new MainTacticSocket("main", 5000);
  tsocket.socket.on('finish-post-load', _finish_post_load);
  tsocket.socket.on("remove-ready-block", _everyone_ready);
  tsocket.socket.emit('join-main', {
    "room": main_id,
    "user_id": window.user_id
  }, function (response) {
    console.log("emitting client-read");
    tsocket.socket.emit('client-ready', {
      "room": main_id,
      "user_id": window.user_id,
      "participant": "client",
      "rb_id": window.ready_block_id
    });
  });
  console.log("finishe main main");
}

function _everyone_ready() {
  console.log("entering everyone ready");
  var data_dict = {
    "doc_type": "notebook",
    "base_figure_url": window.base_figure_url,
    "user_id": window.user_id,
    "library_id": window.main_id,
    "ppi": ppi
  };

  if (window.is_totally_new) {
    console.log("about to intialize");
    (0, _communication_react.postWithCallback)(window.main_id, "initialize_mainwindow", data_dict, _finish_post_load);
  } else {
    if (window.is_jupyter) {
      data_dict["doc_type"] = "jupyter";
      data_dict["project_name"] = window._project_name;
    } else if (is_project) {
      data_dict["project_name"] = window._project_name;
    } else {
      data_dict["unique_id"] = window.temp_data_id;
    }

    (0, _communication_react.postWithCallback)(main_id, "initialize_project_mainwindow", data_dict);
  }
}

function _finish_post_load(data) {
  console.log("entering _finish_post_load");
  var NotebookAppPlus = (0, _toaster.withStatus)(NotebookApp, tsocket, true);
  var interface_state;

  if (window.is_project || window.opening_from_temp_id) {
    interface_state = data.interface_state;
  }

  var domContainer = document.querySelector('#main-root');

  if (window.is_project || window.opening_from_temp_id) {
    console.log("about to render");
    ReactDOM.render( /*#__PURE__*/_react["default"].createElement(NotebookAppPlus, {
      is_project: true,
      interface_state: interface_state,
      initial_theme: window.theme
    }), domContainer);
  } else {
    ReactDOM.render( /*#__PURE__*/_react["default"].createElement(NotebookAppPlus, {
      is_project: false,
      interface_state: null,
      initial_theme: window.theme
    }), domContainer);
  }
}

var save_attrs = ["console_items", "show_exports_pane", "console_width_fraction"];

var NotebookApp = /*#__PURE__*/function (_React$Component) {
  _inherits(NotebookApp, _React$Component);

  var _super = _createSuper(NotebookApp);

  function NotebookApp(props) {
    var _this;

    _classCallCheck(this, NotebookApp);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.last_save = {};
    _this.state = {
      mounted: false,
      console_items: [],
      usable_width: window.innerWidth - 2 * MARGIN_SIZE,
      usable_height: window.innerHeight - BOTTOM_MARGIN,
      console_width_fraction: .5,
      show_exports_pane: true,
      dark_theme: _this.props.initial_theme == "dark"
    };

    if (_this.props.is_project) {
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

    var self = _assertThisInitialized(_this);

    window.addEventListener("beforeunload", function (e) {
      if (self.dirty()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
    return _this;
  }

  _createClass(NotebookApp, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "mounted": true
      });
      window.addEventListener("resize", this._update_window_dimensions);
      document.title = window.is_project ? window._project_name : "New Notebook";

      this._updateLastSave();

      this.props.stopSpinner();
      this.props.setStatusTheme(this.state.dark_theme);
      window.dark_theme = this.state.dark_theme;
    }
  }, {
    key: "_setTheme",
    value: function _setTheme(dark_theme) {
      var _this2 = this;

      this.setState({
        dark_theme: dark_theme
      }, function () {
        _this2.props.setStatusTheme(dark_theme);

        window.dark_theme = _this2.state.dark_theme;
      });
    }
  }, {
    key: "_update_window_dimensions",
    value: function _update_window_dimensions() {
      this.setState({
        "usable_width": window.innerWidth - 2 * MARGIN_SIZE,
        "usable_height": window.innerHeight - BOTTOM_MARGIN - USUAL_TOOLBAR_HEIGHT
      });
    }
  }, {
    key: "_handleConsoleFractionChange",
    value: function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
      this.setState({
        console_width_fraction: new_fraction
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
      data_dict.main_id = window.main_id;
      data_dict.event_name = event_name;
      (0, _communication_react.postWithCallback)(main_id, "distribute_events_stub", data_dict, callback);
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
    key: "_updateLastSave",
    value: function _updateLastSave() {
      this.last_save = this.interface_state;
    }
  }, {
    key: "dirty",
    value: function dirty() {
      var current_state = this.interface_state;

      for (var k in current_state) {
        if (current_state[k] != this.last_save[k]) {
          return true;
        }
      }

      return false;
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      console.log("entering render in notebook_app");
      var disabled_items = [];

      if (!window.is_project || window.is_jupyter) {
        disabled_items.push("Save");
      }

      var console_available_height = this.state.usable_height - USUAL_TOOLBAR_HEIGHT;
      console.log("creating menu");

      var menus = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_main_menus_react.ProjectMenu, _extends({}, this.props.statusFuncs, {
        postAjaxFailure: this.props.postAjaxFailure,
        console_items: this.state.console_items,
        interface_state: this.interface_state,
        updateLastSave: this._updateLastSave,
        changeCollection: null,
        disabled_items: disabled_items,
        hidden_items: ["Open Console as Notebook", "Export Table as Collection", "Change collection"]
      })));

      console.log("creating console component");

      var console_pane = /*#__PURE__*/_react["default"].createElement(_console_component.ConsoleComponent, _extends({}, this.props.statusFuncs, {
        console_items: this.state.console_items,
        console_is_shrunk: false,
        console_is_zoomed: true,
        show_exports_pane: this.state.show_exports_pane,
        setMainStateValue: this._setMainStateValue,
        console_available_height: console_available_height - MARGIN_SIZE,
        console_available_width: this.state.usable_width * this.state.console_width_fraction - 16,
        zoomable: false,
        shrinkable: false,
        tsocket: tsocket,
        dark_theme: this.state.dark_theme,
        style: {
          marginTop: MARGIN_SIZE
        }
      }));

      var exports_pane;

      if (this.state.show_exports_pane) {
        console.log("creating exports component");
        exports_pane = /*#__PURE__*/_react["default"].createElement(_export_viewer_react.ExportsViewer, {
          setUpdate: function setUpdate(ufunc) {
            return _this3.updateExportsList = ufunc;
          },
          available_height: console_available_height - MARGIN_SIZE,
          console_is_shrunk: false,
          console_is_zoomed: this.state.console_is_zoomed,
          tsocket: tsocket,
          style: {
            marginTop: MARGIN_SIZE
          }
        });
      } else {
        exports_pane = /*#__PURE__*/_react["default"].createElement("div", null);
      }

      var outer_class = "main-outer";

      if (this.state.dark_theme) {
        outer_class = outer_class + " bp3-dark";
      } else {
        outer_class = outer_class + " light-theme";
      }

      console.log("returning");
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        className: outer_class
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        user_name: window.username,
        menus: menus,
        dark_theme: this.state.dark_theme,
        set_parent_theme: this._setTheme,
        show_api_links: true
      }), /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
        left_pane: console_pane,
        right_pane: exports_pane,
        show_handle: true,
        available_height: console_available_height,
        available_width: this.state.usable_width,
        initial_width_fraction: this.state.console_width_fraction,
        controlled: true,
        left_margin: MARGIN_SIZE,
        dragIconSize: 15,
        handleSplitUpdate: this._handleConsoleFractionChange
      })));
    }
  }]);

  return NotebookApp;
}(_react["default"].Component);

NotebookApp.propTypes = {
  console_items: _propTypes["default"].array,
  console_component: _propTypes["default"].object,
  is_project: _propTypes["default"].bool,
  interface_state: _propTypes["default"].object
};

var MainTacticSocket = /*#__PURE__*/function (_TacticSocket) {
  _inherits(MainTacticSocket, _TacticSocket);

  var _super2 = _createSuper(MainTacticSocket);

  function MainTacticSocket() {
    _classCallCheck(this, MainTacticSocket);

    return _super2.apply(this, arguments);
  }

  _createClass(MainTacticSocket, [{
    key: "initialize_socket_stuff",
    value: function initialize_socket_stuff() {
      var reconnect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.socket.emit('join', {
        "room": user_id
      });

      if (reconnect) {
        this.socket.emit('join-main', {
          "room": main_id,
          "user_id": window.user_id
        }, function (response) {});
      }

      this.socket.on('handle-callback', _communication_react.handleCallback);
      var self = this;
      this.socket.on('forcedisconnect', function () {
        self.socket.disconnect();
      });
      this.socket.on('close-user-windows', function (data) {
        (0, _communication_react.postAsyncFalse)("host", "remove_mainwindow_task", {
          "main_id": main_id
        });

        if (!(data["originator"] == main_id)) {
          window.close();
        }
      });
      this.socket.on("window-open", function (data) {
        window.open($SCRIPT_ROOT + "/load_temp_page/" + data["the_id"]);
      });
      this.socket.on("notebook-open", function (data) {
        window.open($SCRIPT_ROOT + "/open_notebook/" + data["the_id"]);
      });
      this.socket.on("doFlash", function (data) {
        (0, _toaster.doFlash)(data);
      });
    }
  }]);

  return MainTacticSocket;
}(_tactic_socket.TacticSocket);

_main_main();