"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.library_props = library_props;
exports.res_types = exports.LibraryHomeApp = void 0;

require("../tactic_css/tactic.scss");

require("../tactic_css/tactic_table.scss");

require("../tactic_css/library_home.scss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _table = require("@blueprintjs/table");

var _tactic_socket = require("./tactic_socket.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _library_pane = require("./library_pane.js");

var _sizing_tools = require("./sizing_tools.js");

var _error_drawer = require("./error_drawer.js");

var _key_trap = require("./key_trap.js");

var _utilities_react = require("./utilities_react.js");

var _blueprint_navbar = require("./blueprint_navbar");

var _library_menubars = require("./library_menubars.js");

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

var TAB_BAR_WIDTH = 50;

function _library_home_main() {
  // window.main_id = library_id;
  var LibraryHomeAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(LibraryHomeApp));
  var domContainer = document.querySelector('#library-home-root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(LibraryHomeAppPlus, _extends({}, library_props(), {
    controlled: false,
    initial_theme: window.theme,
    registerLibraryTabChanger: null
  })), domContainer);
}

function library_props() {
  var library_id = (0, _utilities_react.guid)();
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, library_id);
  return {
    library_id: library_id,
    tsocket: tsocket
  };
}

var res_types = ["collection", "project", "tile", "list", "code"];
exports.res_types = res_types;
var tab_panes = ["collections-pane", "projects-pane", "tiles-pane", "lists-pane", "code-pane"];
var controllable_props = ["usable_width", "usable_height"]; // noinspection JSUnusedLocalSymbols,JSRemoveUnnecessaryParentheses

var LibraryHomeApp = /*#__PURE__*/function (_React$Component) {
  _inherits(LibraryHomeApp, _React$Component);

  var _super = _createSuper(LibraryHomeApp);

  function LibraryHomeApp(props) {
    var _this;

    _classCallCheck(this, LibraryHomeApp);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.state = {
      selected_tab_id: "collections-pane",
      pane_states: {}
    };

    var _iterator = _createForOfIteratorHelper(res_types),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var res_type = _step.value;
        _this.state.pane_states[res_type] = {
          left_width_fraction: .65,
          selected_resource: {
            "name": "",
            "tags": "",
            "notes": "",
            "updated": "",
            "created": ""
          },
          tag_button_state: {
            expanded_tags: [],
            active_tag: "all",
            tree: []
          },
          sorting_column: "updated",
          sorting_direction: "descending",
          multi_select: false,
          list_of_selected: [],
          search_string: "",
          search_inside: false,
          search_metadata: false,
          selectedRegions: [_table.Regions.row(0)]
        };
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    _this.top_ref = /*#__PURE__*/_react["default"].createRef();

    _this.initSocket();

    if (props.registerLibraryTabChanger) {
      props.registerLibraryTabChanger(_this._handleTabChange);
    }

    if (!window.controlled) {
      var aheight = (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
      var awidth = (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
      _this.state.usable_height = aheight;
      _this.state.usable_width = awidth;
      _this.state.dark_theme = props.initial_theme === "dark";
    }

    return _this;
  }

  _createClass(LibraryHomeApp, [{
    key: "initSocket",
    value: function initSocket() {
      var self = this;
      this.props.tsocket.attachListener('handle-callback', function (task_packet) {
        (0, _communication_react.handleCallback)(task_packet, self.props.library_id);
      });

      if (!window.in_context) {
        this.props.tsocket.attachListener("window-open", function (data) {
          return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
        });
        this.props.tsocket.attachListener("doFlash", function (data) {
          (0, _toaster.doFlash)(data);
        });
        this.props.tsocket.attachListener('close-user-windows', function (data) {
          if (!(data["originator"] == library_id)) {
            window.close();
          }
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "mounted": true
      });
      this.props.stopSpinner(null); // this.props.setStatusTheme(this.props.dark_theme);

      if (!this.props.controlled) {
        window.dark_theme = this.state.dark_theme;
        window.addEventListener("resize", this._handleResize);

        this._handleResize();
      }
    }
  }, {
    key: "_updatePaneState",
    value: function _updatePaneState(res_type, state_update) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var old_state = Object.assign({}, this.state.pane_states[res_type]);
      var new_pane_states = Object.assign({}, this.state.pane_states);
      new_pane_states[res_type] = Object.assign(old_state, state_update);
      this.setState({
        pane_states: new_pane_states
      }, callback);
    }
  }, {
    key: "_update_window_dimensions",
    value: function _update_window_dimensions() {
      if (!this.props.controlled) {
        var uwidth = window.innerWidth - 2 * _sizing_tools.SIDE_MARGIN;
        var uheight = window.innerHeight;

        if (this.top_ref && this.top_ref.current) {
          uheight = uheight - this.top_ref.current.offsetTop;
        } else {
          uheight = uheight - _sizing_tools.USUAL_TOOLBAR_HEIGHT;
        }

        this.setState({
          usable_height: uheight,
          usable_width: uwidth
        });
      }
    }
  }, {
    key: "_setTheme",
    value: function _setTheme(dark_theme) {
      this.setState({
        dark_theme: dark_theme
      }, function () {
        window.dark_theme = dark_theme;
      });
    } // This mechanism in _handleTabChange necessary in order to force the pane to change
    // before updating window dimensions (which seems to be necessary to get
    // the pane to be appropriately sized when it's shown

  }, {
    key: "_handleTabChange",
    value: function _handleTabChange(newTabId, prevTabId, event) {
      this.setState({
        selected_tab_id: newTabId
      });
    }
  }, {
    key: "_goToNextPane",
    value: function _goToNextPane() {
      var tabIndex = tab_panes.indexOf(this.state.selected_tab_id) + 1;

      if (tabIndex === tab_panes.length) {
        tabIndex = 0;
      }

      this.setState({
        selected_tab_id: tab_panes[tabIndex]
      });
    }
  }, {
    key: "_goToPreviousPane",
    value: function _goToPreviousPane() {
      var tabIndex = tab_panes.indexOf(this.state.selected_tab_id) - 1;

      if (tabIndex === -1) {
        tabIndex = tab_panes.length - 1;
      }

      this.setState({
        selected_tab_id: tab_panes[tabIndex]
      });
    }
  }, {
    key: "getIconColor",
    value: function getIconColor(paneId) {
      return paneId === this.state.selected_tab_id ? "white" : "#CED9E0";
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.tsocket.disconnect();
    }
  }, {
    key: "_handleResize",
    value: function _handleResize(entires) {
      this.setState({
        usable_width: window.innerWidth - this.top_ref.current.offsetLeft,
        usable_height: window.innerHeight - this.top_ref.current.offsetTop
      });
    }
  }, {
    key: "render",
    value: function render() {
      var dark_theme = this.props.controlled ? this.props.dark_theme : this.state.dark_theme;

      var lib_props = _objectSpread({}, this.props);

      if (!this.props.controlled) {
        var _iterator2 = _createForOfIteratorHelper(controllable_props),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var prop_name = _step2.value;
            lib_props[prop_name] = this.state[prop_name];
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        lib_props.usable_width -= TAB_BAR_WIDTH;
      }

      var collection_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
        columns: {
          "icon:th": {
            "sort_field": "type",
            "first_sort": "ascending"
          },
          "name": {
            "sort_field": "name",
            "first_sort": "ascending"
          },
          "created": {
            "sort_field": "created_for_sort",
            "first_sort": "descending"
          },
          "updated": {
            "sort_field": "updated_for_sort",
            "first_sort": "ascending"
          },
          "tags": {
            "sort_field": "tags",
            "first_sort": "ascending"
          }
        },
        res_type: "collection",
        handleCreateViewer: this.props.handleCreateViewer,
        open_resources: this.props.open_resources ? this.props.open_resources["collection"] : null,
        allow_search_inside: false,
        allow_search_metadata: false,
        MenubarClass: _library_menubars.CollectionMenubar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["collection"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        library_id: this.props.library_id
      }));

      var projects_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
        columns: {
          "icon:projects": {
            "sort_field": "type",
            "first_sort": "ascending"
          },
          "name": {
            "sort_field": "name",
            "first_sort": "ascending"
          },
          "created": {
            "sort_field": "created_for_sort",
            "first_sort": "descending"
          },
          "updated": {
            "sort_field": "updated_for_sort",
            "first_sort": "ascending"
          },
          "tags": {
            "sort_field": "tags",
            "first_sort": "ascending"
          }
        },
        res_type: "project",
        handleCreateViewer: this.props.handleCreateViewer,
        open_resources: this.props.open_resources ? this.props.open_resources["project"] : null,
        allow_search_inside: false,
        allow_search_metadata: true,
        MenubarClass: _library_menubars.ProjectMenubar,
        updatePaneState: this._updatePaneState
      }, this.props.errorDrawerFuncs, this.state.pane_states["project"], {
        library_id: this.props.library_id
      }));

      var tiles_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
        columns: {
          "icon:code": {
            "sort_field": "type",
            "first_sort": "ascending"
          },
          "name": {
            "sort_field": "name",
            "first_sort": "ascending"
          },
          "icon:upload": {
            "sort_field": null,
            "first_sort": "ascending"
          },
          "created": {
            "sort_field": "created_for_sort",
            "first_sort": "descending"
          },
          "updated": {
            "sort_field": "updated_for_sort",
            "first_sort": "ascending"
          },
          "tags": {
            "sort_field": "tags",
            "first_sort": "ascending"
          }
        },
        res_type: "tile",
        handleCreateViewer: this.props.handleCreateViewer,
        open_resources: this.props.open_resources ? this.props.open_resources["tile"] : null,
        allow_search_inside: true,
        allow_search_metadata: true,
        MenubarClass: _library_menubars.TileMenubar,
        updatePaneState: this._updatePaneState
      }, this.props.errorDrawerFuncs, this.state.pane_states["tile"], {
        library_id: this.props.library_id
      }));

      var lists_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
        res_type: "list",
        open_resources: this.props.open_resources ? this.props.open_resources["list"] : null,
        allow_search_inside: true,
        allow_search_metadata: true,
        MenubarClass: _library_menubars.ListMenubar
      }, this.props.errorDrawerFuncs, {
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["list"], {
        library_id: this.props.library_id
      }));

      var code_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
        res_type: "code",
        handleCreateViewer: this.props.handleCreateViewer,
        open_resources: this.props.open_resources ? this.props.open_resources["code"] : null,
        allow_search_inside: true,
        allow_search_metadata: true,
        MenubarClass: _library_menubars.CodeMenubar
      }, this.props.errorDrawerFuncs, {
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["code"], {
        library_id: this.props.library_id
      }));

      var outer_style = {
        height: this.state.available_height,
        width: "100%",
        paddingLeft: 0
      };
      var outer_class = "";

      if (!this.props.controlled) {
        outer_class = "library-pane-holder  ";

        if (dark_theme) {
          outer_class = "".concat(outer_class, " bp3-dark");
        } else {
          outer_class = "".concat(outer_class, " light-theme");
        }
      }

      var key_bindings = [[["tab"], this._goToNextPane], [["shift+tab"], this._goToPreviousPane]];
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, !this.props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        dark_theme: dark_theme,
        set_theme: this.props.controlled ? this.props.setTheme : this._setTheme,
        selected: null,
        show_api_links: false,
        page_id: this.props.library_id,
        user_name: window.username
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: outer_class,
        ref: this.top_ref,
        style: outer_style
      }, /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
        id: "the_container",
        style: {
          marginTop: 100,
          height: "100%"
        },
        selectedTabId: this.state.selected_tab_id,
        renderActiveTabPanelOnly: true,
        vertical: true,
        large: true,
        onChange: this._handleTabChange
      }, /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "collections-pane",
        panel: collection_pane
      }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
        content: "Collections",
        position: _core.Position.RIGHT,
        intent: "warning"
      }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "database",
        iconSize: 20,
        tabIndex: -1,
        color: this.getIconColor("collections-pane")
      }))), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "projects-pane",
        panel: projects_pane
      }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
        content: "Projects",
        position: _core.Position.RIGHT,
        intent: "warning"
      }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "projects",
        iconSize: 20,
        tabIndex: -1,
        color: this.getIconColor("projects-pane")
      }))), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "tiles-pane",
        panel: tiles_pane
      }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
        content: "Tiles",
        position: _core.Position.RIGHT,
        intent: "warning"
      }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "application",
        iconSize: 20,
        tabIndex: -1,
        color: this.getIconColor("tiles-pane")
      }))), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "lists-pane",
        panel: lists_pane
      }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
        content: "Lists",
        position: _core.Position.RIGHT,
        intent: "warning"
      }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "list",
        iconSize: 20,
        tabIndex: -1,
        color: this.getIconColor("lists-pane")
      }))), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "code-pane",
        panel: code_pane
      }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
        content: "Code",
        position: _core.Position.RIGHT,
        intent: "warning"
      }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "code",
        iconSize: 20,
        tabIndex: -1,
        color: this.getIconColor("code-pane")
      }))))), !this.props.controlled && /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
        global: true,
        bindings: key_bindings
      }));
    }
  }]);

  return LibraryHomeApp;
}(_react["default"].Component);

exports.LibraryHomeApp = LibraryHomeApp;
LibraryHomeApp.propTypes = {
  open_resources: _propTypes["default"].object
};
LibraryHomeApp.defaultProps = {
  open_resources: null
};

if (!window.in_context) {
  _library_home_main();
}