"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.main_props = main_props;
exports.MainApp = void 0;

require("../tactic_css/tactic.scss");

require("../tactic_css/tactic_main.scss");

require("../tactic_css/tactic_table.scss");

require("../tactic_css/tactic_console.scss");

require("../tactic_css/tactic_select.scss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _lodash = _interopRequireDefault(require("lodash"));

var _blueprint_navbar = require("./blueprint_navbar.js");

var _table_react = require("./table_react.js");

var _blueprint_table = require("./blueprint_table.js");

var _tactic_socket = require("./tactic_socket.js");

var _resizing_layouts = require("./resizing_layouts.js");

var _main_menus_react = require("./main_menus_react.js");

var _tile_react = require("./tile_react.js");

var _export_viewer_react = require("./export_viewer_react.js");

var _modal_react = require("./modal_react.js");

var _console_component = require("./console_component.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _error_drawer = require("./error_drawer.js");

var _utilities_react = require("./utilities_react.js");

var _sizing_tools = require("./sizing_tools.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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

var MARGIN_SIZE = 0;
var BOTTOM_MARGIN = 30; // includes space for status messages at bottom

var MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the console

var CONSOLE_HEADER_HEIGHT = 35;
var EXTRA_TABLE_AREA_SPACE = 500;
var USUAL_TOOLBAR_HEIGHT = 50;
var MENU_BAR_HEIGHT = 30; // will only appear when in context

var ppi;

function main_main() {
  function gotProps(the_props) {
    var MainAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(MainApp));

    var the_element = /*#__PURE__*/_react["default"].createElement(MainAppPlus, _extends({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));

    var domContainer = document.querySelector('#main-root');
    ReactDOM.render(the_element, domContainer);
  }

  (0, _utilities_react.renderSpinnerMessage)("Starting up ...");
  var target = window.project_name == "" ? "main_collection_in_context" : "main_project_in_context";
  var resource_name = window.project_name == "" ? window.collection_name : window.project_name;
  (0, _communication_react.postAjaxPromise)(target, {
    "resource_name": resource_name
  }).then(function (data) {
    main_props(data, null, gotProps);
  });
}

function main_props(data, registerDirtyMethod, finalCallback) {
  ppi = (0, _utilities_react.get_ppi)();
  var main_id = data.main_id;

  if (!window.in_context) {
    window.main_id = main_id;
  }

  var initial_tile_types;
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, main_id, function (response) {
    tsocket.socket.on("remove-ready-block", readyListener);
    initial_tile_types = response.tile_types;
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

  window.addEventListener("unload", function sendRemove(event) {
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

    if (data.is_project) {
      var data_dict = {
        "project_name": data.project_name,
        "doc_type": data.doc_type,
        "base_figure_url": data.base_figure_url,
        "user_id": window.user_id,
        "ppi": ppi
      };
      (0, _communication_react.postWithCallback)(main_id, "initialize_project_mainwindow", data_dict, null, null, main_id);
    } else {
      var _data_dict = {
        "collection_name": data.collection_name,
        "doc_type": data.doc_type,
        "base_figure_url": data.base_figure_url,
        "user_id": window.user_id,
        "ppi": ppi
      };
      (0, _communication_react.postWithCallback)(main_id, "initialize_mainwindow", _data_dict, _finish_post_load_in_context, null, main_id);
    }
  }

  function _finish_post_load_in_context(fdata) {
    if (!window.in_context) {
      (0, _utilities_react.renderSpinnerMessage)("Creating the page...");
    }

    tsocket.socket.off("finish-post-load", _finish_post_load_in_context);
    var interface_state;

    if (data.is_project) {
      interface_state = fdata.interface_state; // legacy below lines needed for older saves

      if (!("show_exports_pane" in interface_state)) {
        interface_state["show_exports_pane"] = true;
      }

      if (!("show_console_pane" in interface_state)) {
        interface_state["show_console_pane"] = true;
      }
    }

    if (data.is_freeform) {
      finalCallback({
        is_project: data.is_project,
        main_id: main_id,
        is_freeform: true,
        resource_name: data.is_project ? data.project_name : data.short_collection_name,
        is_notebook: false,
        is_jupyter: false,
        tsocket: tsocket,
        short_collection_name: data.short_collection_name,
        initial_tile_types: initial_tile_types,
        interface_state: interface_state,
        initial_data_text: fdata.data_text,
        initial_theme: window.theme,
        initial_doc_names: fdata.doc_names,
        registerDirtyMethod: registerDirtyMethod
      });
    } else {
      finalCallback({
        is_project: data.is_project,
        main_id: main_id,
        is_freeform: false,
        is_notebook: false,
        is_jupyter: false,
        tsocket: tsocket,
        resource_name: data.is_project ? data.project_name : data.short_collection_name,
        short_collection_name: data.short_collection_name,
        initial_tile_types: initial_tile_types,
        interface_state: interface_state,
        total_rows: fdata.total_rows,
        initial_theme: window.theme,
        initial_column_names: fdata.table_spec.header_list,
        initial_data_row_dict: fdata.data_row_dict,
        initial_column_widths: fdata.table_spec.column_widths,
        initial_hidden_columns_list: fdata.table_spec.hidden_columns_list,
        initial_cell_backgrounds: fdata.table_spec.cell_backgrounds,
        initial_doc_names: fdata.doc_names,
        registerDirtyMethod: registerDirtyMethod
      });
    }
  }
}

var save_attrs = ["tile_list", "table_is_shrunk", "console_width_fraction", "horizontal_fraction", "pipe_dict", "console_items", "console_is_shrunk", "height_fraction", "show_exports_pane", "show_console_pane", 'console_is_zoomed'];
var controllable_props = ["is_project", "resource_name", "usable_width", "usable_height"];

var MainApp = /*#__PURE__*/function (_React$Component) {
  _inherits(MainApp, _React$Component);

  var _super = _createSuper(MainApp);

  function MainApp(props) {
    var _this;

    _classCallCheck(this, MainApp);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));

    _this.initSocket();

    _this.table_container_ref = /*#__PURE__*/_react["default"].createRef();
    _this.tile_div_ref = /*#__PURE__*/_react["default"].createRef();
    _this.tbody_ref = /*#__PURE__*/_react["default"].createRef();
    _this.table_ref = /*#__PURE__*/_react["default"].createRef();
    _this.main_outer_ref = /*#__PURE__*/_react["default"].createRef();
    _this.last_save = {};
    _this.resizing = false;
    _this.socket_counter = null;
    var base_state = {
      mounted: false,
      doc_names: props.initial_doc_names,
      short_collection_name: _this.props.short_collection_name,
      console_items: [],
      console_is_shrunk: true,
      show_exports_pane: true,
      show_console_pane: true,
      console_is_zoomed: false,
      tile_types: _this.props.initial_tile_types,
      tile_list: [],
      search_text: "",
      height_fraction: .85,
      alt_search_text: null,
      table_is_shrunk: false,
      console_width_fraction: .5,
      horizontal_fraction: .65
    };
    var additions;

    if (_this.props.is_freeform) {
      additions = {
        data_text: props.initial_data_text,
        table_spec: {
          current_doc_name: props.initial_doc_names[0]
        }
      };
    } else {
      additions = {
        show_table_spinner: false,
        data_row_dict: props.initial_data_row_dict,
        total_rows: props.total_rows,
        cells_to_color_text: {},
        force_row_to_top: null,
        selected_column: null,
        selected_row: null,
        selected_regions: null,
        table_is_filtered: false,
        spreadsheet_mode: false,
        table_spec: {
          column_names: _this.props.initial_column_names,
          column_widths: _this.props.initial_column_widths,
          cell_backgrounds: _this.props.initial_cell_backgrounds,
          hidden_columns_list: _this.props.initial_hidden_columns_list,
          current_doc_name: props.initial_doc_names[0]
        }
      };
    }

    _this.state = Object.assign(base_state, additions);

    var self = _assertThisInitialized(_this);

    if (_this.props.controlled) {
      props.registerDirtyMethod(_this._dirty);
      _this.height_adjustment = MENU_BAR_HEIGHT;
    } else {
      _this.height_adjustment = 0;
      _this.state.dark_theme = props.initial_theme === "dark";
      _this.state.usable_height = (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
      _this.state.usable_width = (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
      _this.state.resource_name = props.resource_name;
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

      var _iterator2 = _createForOfIteratorHelper(_this.state.tile_list),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var entry = _step2.value;
          entry.finished_loading = false;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }

    _this.updateExportsList = null;
    return _this;
  }

  _createClass(MainApp, [{
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
    key: "_update_menus_listener",
    value: function _update_menus_listener(data) {
      var self = this;
      (0, _communication_react.postWithCallback)("host", "get_tile_types", {
        "user_id": window.user_id
      }, function (data) {
        self.setState({
          tile_types: data.tile_types
        });
      }), null, self.props.main_id;
    }
  }, {
    key: "_change_doc_listener",
    value: function _change_doc_listener(data) {
      var self = this;

      if (data.main_id == this.props.main_id) {
        var row_id = data.hasOwnProperty("row_id") ? data.row_id : null;

        if (self.state.table_is_shrunk) {
          self.setState({
            table_is_shrunk: false
          });
        }

        self._handleChangeDoc(data.doc_name, row_id);
      }
    }
  }, {
    key: "initSocket",
    value: function initSocket() {
      var _this2 = this;

      var self = this;

      if (!window.in_context) {
        this.props.tsocket.attachListener("window-open", function (data) {
          window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
        });
        this.props.tsocket.attachListener('close-user-windows', function (data) {
          if (!(data["originator"] == main_id)) {
            window.close();
          }
        });
        this.props.tsocket.attachListener("notebook-open", function (data) {
          window.open($SCRIPT_ROOT + "/new_notebook_with_data/" + data.temp_data_id);
        });
        this.props.tsocket.attachListener("doFlash", function (data) {
          (0, _toaster.doFlash)(data);
        });
      } else {
        this.props.tsocket.attachListener("notebook-open", function (data) {
          var the_view = "".concat($SCRIPT_ROOT, "/new_notebook_in_context");
          (0, _communication_react.postAjaxPromise)(the_view, {
            temp_data_id: data.temp_data_id,
            resource_name: ""
          }).then(self.props.handleCreateViewer)["catch"](_toaster.doFlash);
        });
      }

      this.props.tsocket.attachListener('forcedisconnect', function () {
        self.props.tsocket.socket.disconnect();
      });
      this.props.tsocket.attachListener('table-message', this._handleTableMessage);
      this.props.tsocket.attachListener("update-menus", this._update_menus_listener);
      this.props.tsocket.attachListener('change-doc', this._change_doc_listener);
      this.props.tsocket.attachListener('handle-callback', function (task_packet) {
        (0, _communication_react.handleCallback)(task_packet, _this2.props.main_id);
      });
    }
  }, {
    key: "_setTheme",
    value: function _setTheme(dark_theme) {
      var _this3 = this;

      this.setState({
        dark_theme: dark_theme
      }, function () {
        if (!window.in_context) {
          window.dark_theme = _this3.state.dark_theme;
        }
      });
    } // Every item in tile_list is a list of this form

  }, {
    key: "_createTileEntry",
    value: function _createTileEntry(tile_name, tile_type, tile_id, form_data) {
      return {
        tile_name: tile_name,
        tile_type: tile_type,
        tile_id: tile_id,
        form_data: form_data,
        tile_height: 345,
        tile_width: 410,
        show_form: false,
        show_spinner: false,
        source_changed: false,
        javascript_code: null,
        javascript_arg_dict: null,
        show_log: false,
        log_content: "",
        shrunk: false,
        finished_loading: true,
        front_content: ""
      };
    }
  }, {
    key: "_setMainStateValue",
    value: function _setMainStateValue(field_name) {
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      if (_typeof(field_name) == "object") {
        this.setState(field_name, callback);
      } else {
        var new_state = {};
        new_state[field_name] = value;
        this.setState(new_state, callback);
      }
    }
  }, {
    key: "_handleSearchFieldChange",
    value: function _handleSearchFieldChange(search_text) {
      this.setState({
        search_text: search_text,
        alt_search_text: null
      });

      if (search_text == null && !this.props.is_freeform) {
        this.setState({
          cells_to_color_text: {}
        });
      }
    }
  }, {
    key: "_handleSpreadsheetModeChange",
    value: function _handleSpreadsheetModeChange(event) {
      this.setState({
        "spreadsheet_mode": event.target.checked
      });
    }
  }, {
    key: "_setAltSearchText",
    value: function _setAltSearchText(the_text) {
      this.setState({
        alt_search_text: the_text
      });
    }
  }, {
    key: "set_visible_doc",
    value: function set_visible_doc(doc_name, func) {
      var data_dict = {
        "doc_name": doc_name
      };

      if (func === null) {
        (0, _communication_react.postWithCallback)(this.props.main_id, "set_visible_doc", data_dict, null, null, this.props.main_id);
      } else {
        (0, _communication_react.postWithCallback)(this.props.main_id, "set_visible_doc", data_dict, func, null, this.props.main_id);
      }
    }
  }, {
    key: "_handleChangeDoc",
    value: function _handleChangeDoc(new_doc_name) {
      var row_index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      var self = this;
      this.setState({
        show_table_spinner: true
      });

      if (this.props.is_freeform) {
        (0, _communication_react.postWithCallback)(this.props.main_id, "grab_freeform_data", {
          "doc_name": new_doc_name,
          "set_visible_doc": true
        }, function (data) {
          self.props.stopSpinner();
          self.props.clearStatusMessage();
          var new_table_spec = {
            "current_doc_name": new_doc_name
          };
          self.setState({
            "data_text": data.data_text,
            "table_spec": new_table_spec
          }, function () {
            self.setState({
              show_table_spinner: false
            });
          });
          self.set_visible_doc(new_doc_name);
        }, null, self.props.main_id);
      } else {
        var data_dict = {
          "doc_name": new_doc_name,
          "row_index": row_index,
          "set_visible_doc": true
        };
        (0, _communication_react.postWithCallback)(this.props.main_id, "grab_chunk_by_row_index", data_dict, function (data) {
          self._setStateFromDataObject(data, new_doc_name, function () {
            self.setState({
              show_table_spinner: false
            });

            self.table_ref.current._scrollToRow(row_index);
          });
        }, null, this.props.main_id);
      }
    }
  }, {
    key: "_handleVerticalSplitUpdate",
    value: function _handleVerticalSplitUpdate(top_height, bottom_height, top_fraction) {
      this.setState({
        height_fraction: top_fraction
      });
    }
  }, {
    key: "_updateTableSpec",
    value: function _updateTableSpec(spec_update) {
      var broadcast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var new_tspec = _lodash["default"].cloneDeep(this.state.table_spec);

      new_tspec = Object.assign(new_tspec, spec_update);
      this.setState({
        table_spec: new_tspec
      });

      if (broadcast) {
        spec_update["doc_name"] = this.state.table_spec.current_doc_name;
        (0, _communication_react.postWithCallback)(this.props.main_id, "UpdateTableSpec", spec_update, null, null, this.props.main_id); // this._broadcast_event_to_server("UpdateTableSpec", spec_update)
      }
    }
  }, {
    key: "_broadcast_event_to_server",
    value: function _broadcast_event_to_server(event_name, data_dict, callback) {
      data_dict.main_id = this.props.main_id;
      data_dict.event_name = event_name;
      data_dict.doc_name = this.state.table_spec.current_doc_name;
      (0, _communication_react.postWithCallback)(this.props.main_id, "distribute_events_stub", data_dict, callback, null, this.props.main_id);
    }
  }, {
    key: "_tile_command",
    value: function _tile_command(menu_id) {
      var existing_tile_names = [];

      var _iterator3 = _createForOfIteratorHelper(this.state.tile_list),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var tile_entry = _step3.value;
          existing_tile_names.push(tile_entry.tile_name);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      var self = this;
      (0, _modal_react.showModalReact)("Create " + menu_id, "New Tile Name", createNewTile, menu_id, existing_tile_names);

      function createNewTile(tile_name) {
        self.props.startSpinner();
        self.props.statusMessage("Creating Tile " + tile_name);
        var data_dict = {};
        var tile_type = menu_id;
        data_dict["tile_name"] = tile_name;
        data_dict["tile_type"] = tile_type;
        data_dict["user_id"] = window.user_id;
        data_dict["parent"] = self.props.main_id;
        (0, _communication_react.postWithCallback)(self.props.main_id, "create_tile", data_dict, function (create_data) {
          if (create_data.success) {
            var new_tile_entry = self._createTileEntry(tile_name, menu_id, create_data.tile_id, create_data.form_data);

            var new_tile_list = _toConsumableArray(self.state.tile_list);

            new_tile_list.push(new_tile_entry);
            self.setState({
              "tile_list": new_tile_list
            });
            if (self.updateExportsList) self.updateExportsList();
            self.props.clearStatusMessage();
            self.props.stopSpinner();
          } else {
            self.props.addErrorDrawerEntry({
              title: "Error creating tile",
              content: create_data
            });
          }
        }, null, self.props.main_id);
      }
    }
  }, {
    key: "create_tile_menus",
    value: function create_tile_menus() {
      var _this4 = this;

      var menu_items = [];

      var sorted_categories = _toConsumableArray(Object.keys(this.state.tile_types));

      sorted_categories.sort();

      var _iterator4 = _createForOfIteratorHelper(sorted_categories),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var category = _step4.value;
          var option_dict = {};

          var sorted_types = _toConsumableArray(this.state.tile_types[category]);

          sorted_types.sort();

          var _iterator5 = _createForOfIteratorHelper(sorted_types),
              _step5;

          try {
            var _loop = function _loop() {
              var ttype = _step5.value;

              option_dict[ttype] = function () {
                return _this4._tile_command(ttype);
              };
            };

            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              _loop();
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }

          menu_items.push( /*#__PURE__*/_react["default"].createElement(_main_menus_react.MenuComponent, {
            menu_name: category,
            option_dict: option_dict,
            disabled_items: [],
            key: category
          }));
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return menu_items;
    }
  }, {
    key: "_toggleTableShrink",
    value: function _toggleTableShrink() {
      this.setState({
        table_is_shrunk: !this.state.table_is_shrunk,
        tile_sorter_exists: false
      });
    }
  }, {
    key: "_handleHorizontalFractionChange",
    value: function _handleHorizontalFractionChange(left_width, right_width, new_fraction) {
      this.setState({
        horizontal_fraction: new_fraction
      });
    }
  }, {
    key: "_handleResizeStart",
    value: function _handleResizeStart() {
      this.resizing = true;
    }
  }, {
    key: "_handleResizeEnd",
    value: function _handleResizeEnd() {
      this.resizing = false;
    }
  }, {
    key: "_handleConsoleFractionChange",
    value: function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
      this.setState({
        console_width_fraction: new_fraction
      });
    } // Table doctype-only methods start here

  }, {
    key: "_getTableBodyHeight",
    value: function _getTableBodyHeight(table_available_height) {
      if (!this.state.mounted || !this.tbody_ref.current) {
        return table_available_height - 50;
      } else {
        var top_offset = this.tbody_ref.current.getBoundingClientRect().top - this.table_container_ref.current.getBoundingClientRect().top;
        var madjust = this.state.console_is_shrunk ? 2 * MARGIN_ADJUSTMENT : MARGIN_ADJUSTMENT;
        return table_available_height - top_offset - madjust;
      }
    }
  }, {
    key: "_setFreeformDoc",
    value: function _setFreeformDoc(doc_name, new_content) {
      if (doc_name == this.state.table_spec.current_doc_name) {
        this.setState({
          data_text: new_content
        });
      }
    }
  }, {
    key: "_handleTableMessage",
    value: function _handleTableMessage(data) {
      if (data.main_id == this.props.main_id) {
        var self = this;
        var handlerDict = {
          refill_table: self._refill_table,
          dehighlightAllText: function dehighlightAllText(data) {
            return self._handleSearchFieldChange(null);
          },
          highlightTxtInDocument: function highlightTxtInDocument(data) {
            return self._setAltSearchText(data.text_to_find);
          },
          updateNumberRows: function updateNumberRows(data) {
            return self._updateNumberRows(data.doc_name, data.number_rows);
          },
          setCellContent: function setCellContent(data) {
            return self._setCellContent(data.row, data.column_header, data.new_content);
          },
          colorTxtInCell: function colorTxtInCell(data) {
            return self._colorTextInCell(data.row_id, data.column_header, data.token_text, data.color_dict);
          },
          setFreeformContent: function setFreeformContent(data) {
            return self._setFreeformDoc(data.doc_name, data.new_content);
          },
          updateDocList: function updateDocList(data) {
            return self._updateDocList(data.doc_names, data.visible_doc);
          },
          setCellBackground: function setCellBackground(data) {
            return self._setCellBackgroundColor(data.row, data.column_header, data.color);
          }
        };
        handlerDict[data.table_message](data);
      }
    }
  }, {
    key: "_setCellContent",
    value: function _setCellContent(row_id, column_header, new_content) {
      var broadcast = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var new_data_row_dict = Object.assign({}, this.state.data_row_dict);
      var the_row = Object.assign({}, new_data_row_dict[row_id]);
      the_row[column_header] = new_content;
      new_data_row_dict[row_id] = the_row;
      this.setState({
        data_row_dict: new_data_row_dict
      });
      var data = {
        id: row_id,
        column_header: column_header,
        new_content: new_content,
        cellchange: false
      };

      if (broadcast) {
        this._broadcast_event_to_server("SetCellContent", data, null);
      }
    }
  }, {
    key: "_setCellBackgroundColor",
    value: function _setCellBackgroundColor(row_id, column_header, color) {
      var new_table_spec = _lodash["default"].cloneDeep(this.state.table_spec);

      if (!new_table_spec.cell_backgrounds.hasOwnProperty(row_id)) {
        new_table_spec.cell_backgrounds[row_id] = {};
      }

      new_table_spec.cell_backgrounds[row_id][column_header] = color;

      this._updateTableSpec(new_table_spec);
    }
  }, {
    key: "_colorTextInCell",
    value: function _colorTextInCell(row_id, column_header, token_text, color_dict) {
      var ccd = Object.assign({}, this.state.cells_to_color_text);
      var entry;

      if (ccd.hasOwnProperty(row_id)) {
        entry = Object.assign({}, ccd[row_id]);
      } else {
        entry = {};
      }

      entry[column_header] = {
        token_text: token_text,
        color_dict: color_dict
      };
      ccd[row_id] = entry;
      this.setState({
        cells_to_color_text: ccd
      });
    }
  }, {
    key: "_refill_table",
    value: function _refill_table(data_object) {
      this._setStateFromDataObject(data_object, data_object.doc_name);
    }
  }, {
    key: "_moveColumn",
    value: function _moveColumn(tag_to_move, place_to_move) {
      var colnames = _toConsumableArray(this.state.table_spec.column_names);

      var start_index = colnames.indexOf(tag_to_move);
      colnames.splice(start_index, 1);

      if (!place_to_move) {
        colnames.push(tag_to_move);
      } else {
        var end_index = colnames.indexOf(place_to_move);
        colnames.splice(end_index, 0, tag_to_move);
      }

      var fnames = this._filteredColumnNames();

      start_index = fnames.indexOf(tag_to_move);
      fnames.splice(start_index, 1);

      var cwidths = _toConsumableArray(this.state.table_spec.column_widths);

      var width_to_move = cwidths[start_index];
      cwidths.splice(start_index, 1);

      if (!place_to_move) {
        cwidths.push(width_to_move);
      } else {
        var _end_index = fnames.indexOf(place_to_move);

        cwidths.splice(_end_index, 0, width_to_move);
      }

      this._updateTableSpec({
        column_names: colnames,
        column_widths: cwidths
      }, true);
    }
  }, {
    key: "_hideColumn",
    value: function _hideColumn() {
      var hc_list = _toConsumableArray(this.state.table_spec.hidden_columns_list);

      var fnames = this._filteredColumnNames();

      var cname = this.state.selected_column;
      var col_index = fnames.indexOf(cname);

      var cwidths = _toConsumableArray(this.state.table_spec.column_widths);

      cwidths.splice(col_index, 1);
      hc_list.push(cname);

      this._updateTableSpec({
        hidden_columns_list: hc_list,
        column_widths: cwidths
      }, true);
    }
  }, {
    key: "_hideColumnInAll",
    value: function _hideColumnInAll() {
      var hc_list = _toConsumableArray(this.state.table_spec.hidden_columns_list);

      var fnames = this._filteredColumnNames();

      var cname = this.state.selected_column;
      var col_index = fnames.indexOf(cname);

      var cwidths = _toConsumableArray(this.state.table_spec.column_widths);

      cwidths.splice(col_index, 1);
      hc_list.push(cname);

      this._updateTableSpec({
        hidden_columns_list: hc_list,
        column_widths: cwidths
      }, false);

      var data_dict = {
        "column_name": this.state.selected_column
      };

      this._broadcast_event_to_server("HideColumnInAllDocs", data_dict);
    }
  }, {
    key: "_unhideAllColumns",
    value: function _unhideAllColumns() {
      this._updateTableSpec({
        hidden_columns_list: ["__filename__"]
      }, true);
    }
  }, {
    key: "_deleteRow",
    value: function _deleteRow() {
      (0, _communication_react.postWithCallback)(this.props.main_id, "delete_row", {
        "document_name": this.state.table_spec.current_doc_name,
        "index": this.state.selected_row
      });
    }
  }, {
    key: "_insertRow",
    value: function _insertRow(index) {
      (0, _communication_react.postWithCallback)(this.props.main_id, "insert_row", {
        "document_name": this.state.table_spec.current_doc_name,
        "index": index,
        "row_dict": {}
      }, null, null, this.props.main_id);
    }
  }, {
    key: "_duplicateRow",
    value: function _duplicateRow() {
      (0, _communication_react.postWithCallback)(this.props.main_id, "insert_row", {
        "document_name": this.state.table_spec.current_doc_name,
        "index": this.state.selected_row,
        "row_dict": this.state.data_row_dict[this.state.selected_row]
      }, null, null, this.props.main_id);
    }
  }, {
    key: "_deleteColumn",
    value: function _deleteColumn() {
      var delete_in_all = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var fnames = this._filteredColumnNames();

      var cname = this.state.selected_column;
      var col_index = fnames.indexOf(cname);

      var cwidths = _toConsumableArray(this.state.table_spec.column_widths);

      cwidths.splice(col_index, 1);

      var hc_list = _lodash["default"].without(this.state.table_spec.hidden_columns_list, cname);

      var cnames = _lodash["default"].without(this.state.table_spec.column_names, cname);

      this._updateTableSpec({
        column_names: cnames,
        hidden_columns_list: hc_list,
        column_widths: cwidths
      }, false);

      var data_dict = {
        "column_name": cname,
        "doc_name": this.state.table_spec.current_doc_name,
        "all_docs": delete_in_all
      };
      (0, _communication_react.postWithCallback)(this.props.main_id, "DeleteColumn", data_dict, null, null, this.props.main_id);
    }
  }, {
    key: "_addColumn",
    value: function _addColumn() {
      var add_in_all = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      var self = this;
      var title = add_in_all ? "Create Column All Documents" : "Create Column This Document";
      (0, _modal_react.showModalReact)(title, "New Column Name", function (new_name) {
        var cwidth = (0, _blueprint_table.compute_added_column_width)(new_name);

        self._updateTableSpec({
          column_names: [].concat(_toConsumableArray(self.state.table_spec.column_names), [new_name]),
          column_widths: [].concat(_toConsumableArray(self.state.table_spec.column_widths), [cwidth])
        }, false);

        var data_dict = {
          "column_name": new_name,
          "doc_name": self.state.table_spec.current_doc_name,
          "column_width": cwidth,
          "all_docs": add_in_all
        };

        self._broadcast_event_to_server("CreateColumn", data_dict);
      });
    }
  }, {
    key: "_setStateFromDataObject",
    value: function _setStateFromDataObject(data, doc_name) {
      var func = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      this.setState({
        data_row_dict: data.data_row_dict,
        total_rows: data.total_rows,
        table_spec: {
          column_names: data.table_spec.header_list,
          column_widths: data.table_spec.column_widths,
          hidden_columns_list: data.table_spec.hidden_columns_list,
          cell_backgrounds: data.table_spec.cell_backgrounds,
          current_doc_name: doc_name
        }
      }, func);
    }
  }, {
    key: "_initiateDataGrab",
    value: function _initiateDataGrab(row_index) {
      this._grabNewChunkWithRow(row_index);
    }
  }, {
    key: "_grabNewChunkWithRow",
    value: function _grabNewChunkWithRow(row_index) {
      var self = this;
      (0, _communication_react.postWithCallback)(this.props.main_id, "grab_chunk_by_row_index", {
        doc_name: this.state.table_spec.current_doc_name,
        row_index: row_index
      }, function (data) {
        var new_data_row_dict = Object.assign(self.state.data_row_dict, data.data_row_dict);
        self.setState({
          data_row_dict: new_data_row_dict
        });
      }, null, this.props.main_id);
    }
  }, {
    key: "_changeCollection",
    value: function _changeCollection() {
      this.props.startSpinner();
      var self = this;
      (0, _communication_react.postWithCallback)("host", "get_collection_names", {
        "user_id": user_id
      }, function (data) {
        var option_names = data["collection_names"];
        (0, _modal_react.showSelectDialog)("Select New Collection", "New Collection", "Cancel", "Submit", changeTheCollection, option_names);
      }, null, this.props.main_id);

      function changeTheCollection(new_collection_name) {
        var result_dict = {
          "new_collection_name": new_collection_name,
          "main_id": this.props.main_id
        };
        (0, _communication_react.postWithCallback)(self.props.main_id, "change_collection", result_dict, changeCollectionResult, null, self.props.main_id);

        function changeCollectionResult(data_object) {
          if (data_object.success) {
            if (!window.in_context && !this.state.is_project) document.title = new_collection_name;
            window._collection_name = data_object.collection_name;
            self.setState({
              doc_names: data_object.doc_names,
              short_collection_name: data_object.short_collection_name
            }, function () {
              self._handleChangeDoc(data_object.doc_names[0]);
            });
            self.props.stopSpinner();
          } else {
            self.props.clearStatusMessage();
            self.props.stopSpinner();
            self.props.addErrorDrawerEntry({
              title: "Error changing collection",
              content: data_object.message
            });
          }
        }
      }
    }
  }, {
    key: "_updateDocList",
    value: function _updateDocList(doc_names, visible_doc) {
      var self = this;
      this.setState({
        doc_names: doc_names
      }, function () {
        self._handleChangeDoc(visible_doc);
      });
    }
  }, {
    key: "interface_state",
    get: function get() {
      var interface_state = {};

      var _iterator6 = _createForOfIteratorHelper(save_attrs),
          _step6;

      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var attr = _step6.value;
          interface_state[attr] = this.state[attr];
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }

      return interface_state;
    }
  }, {
    key: "get_hp_height",
    value: function get_hp_height() {
      if (this.state.mounted && this.tile_div_ref.current) {
        if (this.state.console_is_shrunk) {
          // return this._cProp("usable_height") - this.tile_div_ref.current.getBoundingClientRect().top - CONSOLE_HEADER_HEIGHT;
          return this._cProp("usable_height") - CONSOLE_HEADER_HEIGHT - BOTTOM_MARGIN - this.height_adjustment;
        } else {
          return (this._cProp("usable_height") - BOTTOM_MARGIN - this.height_adjustment) * this.state.height_fraction;
        }
      } else {
        return this._cProp("usable_height") - 100;
      }
    }
  }, {
    key: "get_vp_height",
    value: function get_vp_height() {
      if (this.state.mounted && this.tile_div_ref.current) {
        return this._cProp("usable_height") - this.height_adjustment - BOTTOM_MARGIN;
      } else {
        return this._cProp("usable_height") - this.height_adjustment - 50;
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
    key: "_filteredColumnNames",
    value: function _filteredColumnNames() {
      var self = this;
      return this.state.table_spec.column_names.filter(function (name) {
        return !(self.state.table_spec.hidden_columns_list.includes(name) || name == "__id__");
      });
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
          "resource_name": new_project_name,
          "is_project": true
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this5 = this;

      var dark_theme = this.props.controlled ? this.props.dark_theme : this.state.dark_theme;
      var vp_height;
      var hp_height;
      var console_available_height;

      var my_props = _objectSpread({}, this.props);

      if (!this.props.controlled) {
        var _iterator7 = _createForOfIteratorHelper(controllable_props),
            _step7;

        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var prop_name = _step7.value;
            my_props[prop_name] = this.state[prop_name];
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      }

      var true_usable_width = my_props.usable_width;

      if (this.state.console_is_zoomed) {
        console_available_height = this.get_zoomed_console_height() - MARGIN_ADJUSTMENT;
      } else {
        vp_height = this.get_vp_height();
        hp_height = this.get_hp_height();

        if (this.state.console_is_shrunk) {
          console_available_height = CONSOLE_HEADER_HEIGHT;
        } else {
          console_available_height = vp_height - hp_height - MARGIN_ADJUSTMENT - 3;
        }
      }

      var disabled_column_items = [];

      if (this.state.selected_column == null) {
        disabled_column_items = ["Shift Left", "Shift Right", "Hide", "Hide in All Docs", "Delete Column", "Delete Column In All Docs"];
      }

      var disabled_row_items = [];

      if (this.state.selected_row == null) {
        disabled_row_items = ["Delete Row", "Insert Row Before", "Insert Row After", "Duplicate Row"];
      }

      var project_name = my_props.is_project ? this.props.resource_name : "";

      var menus = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_main_menus_react.ProjectMenu, _extends({}, this.props.statusFuncs, {
        main_id: this.props.main_id,
        project_name: project_name,
        is_notebook: this.props.is_notebook,
        is_juptyer: this.props.is_jupyter,
        setMainStateValue: this._setMainStateValue,
        setProjectName: this._setProjectName,
        postAjaxFailure: this.props.postAjaxFailure,
        console_items: this.state.console_items,
        interface_state: this.interface_state,
        changeCollection: this._changeCollection,
        updateLastSave: this._updateLastSave,
        disabled_items: my_props.is_project ? [] : ["Save"],
        hidden_items: ["Export as Jupyter Notebook"]
      })), /*#__PURE__*/_react["default"].createElement(_main_menus_react.DocumentMenu, _extends({}, this.props.statusFuncs, {
        documentNames: this.state.doc_names,
        currentDoc: this.state.table_spec.current_doc_name
      })), !this.props.is_freeform && /*#__PURE__*/_react["default"].createElement(_main_menus_react.ColumnMenu, _extends({}, this.props.statusFuncs, {
        main_id: this.props.main_id,
        project_name: project_name,
        is_notebook: this.props.is_notebook,
        is_juptyer: this.props.is_jupyter,
        moveColumn: this._moveColumn,
        table_spec: this.state.table_spec,
        filtered_column_names: this._filteredColumnNames(),
        selected_column: this.state.selected_column,
        disabled_items: disabled_column_items,
        hideColumn: this._hideColumn,
        hideInAll: this._hideColumnInAll,
        unhideAllColumns: this._unhideAllColumns,
        addColumn: this._addColumn,
        deleteColumn: this._deleteColumn
      })), !this.props.is_freeform && /*#__PURE__*/_react["default"].createElement(_main_menus_react.RowMenu, _extends({}, this.props.statusFuncs, {
        main_id: this.props.main_id,
        project_name: project_name,
        is_notebook: this.props.is_notebook,
        is_juptyer: this.props.is_jupyter,
        deleteRow: this._deleteRow,
        insertRowBefore: function insertRowBefore() {
          _this5._insertRow(_this5.state.selected_row);
        },
        insertRowAfter: function insertRowAfter() {
          _this5._insertRow(_this5.state.selected_row + 1);
        },
        duplicateRow: this._duplicateRow,
        selected_row: this.state.selected_row,
        disabled_items: disabled_row_items
      })), /*#__PURE__*/_react["default"].createElement(_main_menus_react.ViewMenu, _extends({}, this.props.statusFuncs, {
        main_id: this.props.main_id,
        project_name: project_name,
        is_notebook: this.props.is_notebook,
        is_juptyer: this.props.is_jupyter,
        table_is_shrunk: this.state.table_is_shrunk,
        toggleTableShrink: this._toggleTableShrink,
        openErrorDrawer: this.props.openErrorDrawer,
        show_exports_pane: this.state.show_exports_pane,
        show_console_pane: this.state.show_console_pane,
        setMainStateValue: this._setMainStateValue
      })), /*#__PURE__*/_react["default"].createElement(_core.NavbarDivider, null), this.create_tile_menus());

      var table_available_height = hp_height;

      var card_header = /*#__PURE__*/_react["default"].createElement(_table_react.MainTableCardHeader, {
        main_id: this.props.main_id,
        toggleShrink: this._toggleTableShrink,
        short_collection_name: this.state.short_collection_name,
        handleChangeDoc: this._handleChangeDoc,
        doc_names: this.state.doc_names,
        current_doc_name: this.state.table_spec.current_doc_name,
        show_table_spinner: this.state.show_table_spinner,
        selected_row: this.state.selected_row,
        handleSearchFieldChange: this._handleSearchFieldChange,
        search_text: this.state.search_text,
        setMainStateValue: this._setMainStateValue,
        table_is_filtered: this.state.table_is_filtered,
        show_filter_button: !this.props.is_freeform,
        spreadsheet_mode: this.state.spreadsheet_mode,
        handleSpreadsheetModeChange: this._handleSpreadsheetModeChange,
        broadcast_event_to_server: this._broadcast_event_to_server
      });

      var card_body;

      if (this.props.is_freeform) {
        card_body = /*#__PURE__*/_react["default"].createElement(_table_react.FreeformBody, {
          main_id: this.props.main_id,
          my_ref: this.tbody_ref,
          document_name: this.state.table_spec.current_doc_name,
          data_text: this.state.data_text,
          code_container_height: this._getTableBodyHeight(table_available_height),
          search_text: this.state.search_text,
          setMainStateValue: this._setMainStateValue,
          alt_search_text: this.state.alt_search_text
        });
      } else {
        card_body = /*#__PURE__*/_react["default"].createElement(_blueprint_table.BlueprintTable, {
          main_id: this.props.main_id,
          my_ref: this.tbody_ref,
          ref: this.table_ref,
          initiateDataGrab: this._initiateDataGrab,
          height: this._getTableBodyHeight(table_available_height),
          column_names: this.state.table_spec.column_names,
          setCellContent: this._setCellContent,
          filtered_column_names: this._filteredColumnNames(),
          moveColumn: this._moveColumn,
          column_widths: this.state.table_spec.column_widths,
          hidden_columns_list: this.state.table_spec.hidden_columns_list,
          updateTableSpec: this._updateTableSpec,
          setMainStateValue: this._setMainStateValue,
          selected_regions: this.state.selected_regions,
          selected_column: this.state.selected_column,
          selected_row: this.state.selected_row,
          search_text: this.state.search_text,
          alt_search_text: this.state.alt_search_text,
          cells_to_color_text: this.state.cells_to_color_text,
          cell_backgrounds: this.state.table_spec.cell_backgrounds,
          total_rows: this.state.total_rows,
          broadcast_event_to_server: this._broadcast_event_to_server,
          spreadsheet_mode: this.state.spreadsheet_mode,
          data_row_dict: this.state.data_row_dict
        });
      }

      var tile_container_height = this.state.console_is_shrunk ? table_available_height - MARGIN_ADJUSTMENT : table_available_height;

      var tile_pane = /*#__PURE__*/_react["default"].createElement(_tile_react.TileContainer, {
        main_id: this.props.main_id,
        tsocket: this.props.tsocket,
        dark_theme: this.props.dark_theme,
        height: tile_container_height,
        tile_div_ref: this.tile_div_ref,
        tile_list: _lodash["default"].cloneDeep(this.state.tile_list),
        current_doc_name: this.state.table_spec.current_doc_name,
        table_is_shrunk: this.state.table_is_shrunk,
        selected_row: this.state.selected_row,
        broadcast_event: this._broadcast_event_to_server,
        setMainStateValue: this._setMainStateValue
      });

      var exports_pane;

      if (this.state.show_exports_pane) {
        exports_pane = /*#__PURE__*/_react["default"].createElement(_export_viewer_react.ExportsViewer, {
          main_id: this.props.main_id,
          tsocket: this.props.tsocket,
          setUpdate: function setUpdate(ufunc) {
            _this5.updateExportsList = ufunc;
          },
          setMainStateValue: this._setMainStateValue,
          available_height: console_available_height,
          console_is_shrunk: this.state.console_is_shrunk,
          console_is_zoomed: this.state.console_is_zoomed
        });
      } else {
        exports_pane = /*#__PURE__*/_react["default"].createElement("div", null);
      }

      var console_pane;

      if (this.state.show_console_pane) {
        console_pane = /*#__PURE__*/_react["default"].createElement(_console_component.ConsoleComponent, {
          main_id: this.props.main_id,
          tsocket: this.props.tsocket,
          dark_theme: dark_theme,
          handleCreateViewer: this.props.handleCreateViewer,
          controlled: this.props.controlled,
          am_selected: this.props.am_selected,
          console_items: this.state.console_items,
          console_is_shrunk: this.state.console_is_shrunk,
          console_is_zoomed: this.state.console_is_zoomed,
          show_exports_pane: this.state.show_exports_pane,
          setMainStateValue: this._setMainStateValue,
          console_available_height: console_available_height,
          console_available_width: true_usable_width * this.state.console_width_fraction - 16
        });
      } else {
        var console_available_width = true_usable_width * this.state.console_width_fraction - 16;
        console_pane = /*#__PURE__*/_react["default"].createElement("div", {
          style: {
            width: console_available_width
          }
        });
      }

      var bottom_pane = /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
        left_pane: console_pane,
        right_pane: exports_pane,
        show_handle: !this.state.console_is_shrunk,
        available_height: console_available_height,
        available_width: true_usable_width,
        initial_width_fraction: this.state.console_width_fraction,
        dragIconSize: 15,
        handleSplitUpdate: this._handleConsoleFractionChange
      });

      var table_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.table_container_ref
      }, /*#__PURE__*/_react["default"].createElement(_table_react.MainTableCard, {
        main_id: this.props.main_id,
        card_body: card_body,
        card_header: card_header,
        table_spec: this.state.table_spec,
        broadcast_event_to_server: this._broadcast_event_to_server,
        updateTableSpec: this._updateTableSpec
      })));

      var top_pane;

      if (this.state.table_is_shrunk) {
        top_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, tile_pane, this.state.console_is_shrunk && bottom_pane);
      } else {
        top_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
          left_pane: table_pane,
          right_pane: tile_pane,
          available_height: hp_height,
          show_handle: true,
          scrollAdjustSelectors: [".bp3-table-quadrant-scroll-container", "#tile-div"],
          available_width: true_usable_width,
          initial_width_fraction: this.state.horizontal_fraction,
          dragIconSize: 15,
          handleSplitUpdate: this._handleHorizontalFractionChange,
          handleResizeStart: this._handleResizeStart,
          handleResizeEnd: this._handleResizeEnd
        }), this.state.console_is_shrunk && bottom_pane);
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
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        dark_theme: dark_theme,
        setTheme: this.props.controlled ? this.props.setTheme : this._setTheme,
        user_name: window.username,
        menus: menus,
        page_id: this.props.main_id,
        min_navbar: window.in_context,
        refreshTab: this.props.refreshTab,
        closeTab: this.props.closeTab
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: outer_class,
        ref: this.main_outer_ref,
        style: outer_style
      }, this.state.console_is_zoomed && bottom_pane, !this.state.console_is_zoomed && this.state.console_is_shrunk && top_pane, !this.state.console_is_zoomed && !this.state.console_is_shrunk && /*#__PURE__*/_react["default"].createElement(_resizing_layouts.VerticalPanes, {
        top_pane: top_pane,
        bottom_pane: bottom_pane,
        show_handle: true,
        available_width: true_usable_width,
        available_height: vp_height,
        initial_height_fraction: this.state.height_fraction,
        dragIconSize: 15,
        scrollAdjustSelectors: [".bp3-table-quadrant-scroll-container", "#tile-div"],
        handleSplitUpdate: this._handleVerticalSplitUpdate,
        handleResizeStart: this._handleResizeStart,
        handleResizeEnd: this._handleResizeEnd,
        overflow: "hidden"
      })));
    }
  }]);

  return MainApp;
}(_react["default"].Component);

exports.MainApp = MainApp;
MainApp.propTypes = {
  controlled: _propTypes["default"].bool,
  am_selected: _propTypes["default"].bool,
  changeResourceName: _propTypes["default"].func,
  changeResourceTitle: _propTypes["default"].func,
  changeResourceProps: _propTypes["default"].func,
  updatePanel: _propTypes["default"].func,
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func,
  interface_state: _propTypes["default"].object,
  initial_doc_names: _propTypes["default"].array,
  initial_column_names: _propTypes["default"].array,
  initial_data_row_dict: _propTypes["default"].object,
  initial_column_widths: _propTypes["default"].array,
  initial_hidden_columns_list: _propTypes["default"].array,
  doc_names: _propTypes["default"].array
};
MainApp.defaultProps = {
  am_selected: true,
  controlled: false,
  changeResourceName: null,
  changeResourceTitle: null,
  changeResourceProps: null,
  refreshTab: null,
  closeTab: null,
  updatePanel: null
};

if (!window.in_context) {
  main_main();
}