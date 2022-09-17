"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.repository_props = repository_props;
exports.RepositoryHomeApp = void 0;

require("../tactic_css/tactic.scss");

require("../tactic_css/tactic_table.scss");

require("../tactic_css/library_home.scss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _core = require("@blueprintjs/core");

var _table = require("@blueprintjs/table");

var _tactic_socket = require("./tactic_socket.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _library_pane = require("./library_pane.js");

var _sizing_tools = require("./sizing_tools.js");

var _error_drawer = require("./error_drawer.js");

var _utilities_react = require("./utilities_react.js");

var _utilities_react2 = require("./utilities_react");

var _blueprint_navbar = require("./blueprint_navbar");

var _repository_menubars = require("./repository_menubars.js");

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

var MARGIN_SIZE = 17;
var tsocket;

function _repository_home_main() {
  window.library_id = (0, _utilities_react2.guid)();
  tsocket = new _tactic_socket.TacticSocket("main", 5000, window.library_id);
  var RepositoryHomeAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(RepositoryHomeApp));
  var domContainer = document.querySelector('#library-home-root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(RepositoryHomeAppPlus, _extends({}, repository_props(), {
    initial_theme: window.theme,
    controlled: false,
    tsocket: tsocket,
    registerLibraryTabChanger: null
  })), domContainer);
}

function repository_props() {
  return {
    library_id: (0, _utilities_react2.guid)()
  };
}

var res_types = ["collection", "project", "tile", "list", "code"];
var controllable_props = ["usable_height", "usable_width"];

var RepositoryHomeApp = /*#__PURE__*/function (_React$Component) {
  _inherits(RepositoryHomeApp, _React$Component);

  var _super = _createSuper(RepositoryHomeApp);

  function RepositoryHomeApp(props, context) {
    var _this;

    _classCallCheck(this, RepositoryHomeApp);

    _this = _super.call(this, props, context);
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
          sort_field: "updated",
          sort_direction: "descending",
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
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));

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

    _this.initSocket();

    return _this;
  }

  _createClass(RepositoryHomeApp, [{
    key: "initSocket",
    value: function initSocket() {
      var self = this;
      var tsocket = this.props.tsocket;

      if (!window.in_context) {
        tsocket.attachListener("window-open", function (data) {
          return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
        });
        tsocket.attachListener('handle-callback', function (task_packet) {
          (0, _communication_react.handleCallback)(task_packet, self.extra_args.library_id);
        });
        tsocket.attachListener("doFlash", function (data) {
          (0, _toaster.doFlash)(data);
        });
        tsocket.attachListener('close-user-windows', function (data) {
          if (!(data["originator"] == window.library_id)) {
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
      this.props.stopSpinner();

      if (!this.props.controlled) {
        window.dark_theme = this.state.dark_theme;
        window.addEventListener("resize", this._update_window_dimensions);

        this._update_window_dimensions();
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
    }
  }, {
    key: "_handleTabChange",
    value: function _handleTabChange(newTabId, prevTabId, event) {
      this.setState({
        selected_tab_id: newTabId
      }, this._update_window_dimensions);
    }
  }, {
    key: "getIconColor",
    value: function getIconColor(paneId) {
      return paneId == this.state.selected_tab_id ? "white" : "#CED9E0";
    }
  }, {
    key: "render",
    value: function render() {
      var tsocket = this.props.tsocket;
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
      }

      var collection_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
        res_type: "collection",
        allow_search_inside: false,
        allow_search_metadata: false,
        MenubarClass: _repository_menubars.RepositoryCollectionMenubar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["collection"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        is_repository: true
      }));

      var projects_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
        res_type: "project",
        allow_search_inside: false,
        allow_search_metadata: true,
        MenubarClass: _repository_menubars.RepositoryProjectMenubar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["project"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        is_repository: true
      }));

      var tiles_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
        res_type: "tile",
        allow_search_inside: true,
        allow_search_metadata: true,
        MenubarClass: _repository_menubars.RepositoryTileMenubar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["tile"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        is_repository: true
      }));

      var lists_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
        res_type: "list",
        allow_search_inside: true,
        allow_search_metadata: true,
        MenubarClass: _repository_menubars.RepositoryListMenubar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["list"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        is_repository: true
      }));

      var code_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, lib_props, {
        res_type: "code",
        allow_search_inside: true,
        allow_search_metadata: true,
        MenubarClass: _repository_menubars.RepositoryCodeMenubar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["code"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        is_repository: true
      }));

      var outer_style = {
        width: "100%",
        height: this.state.usable_height,
        paddingLeft: 0
      };
      var outer_class = "";

      if (!this.props.controlled) {
        outer_class = "library-pane-holder  ";

        if (dark_theme) {
          outer_class = "".concat(outer_class, " bp4-dark");
        } else {
          outer_class = "".concat(outer_class, " light-theme");
        }
      }

      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, !this.props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        dark_theme: dark_theme,
        set_theme: this.props.controlled ? this.props.setTheme : this._setTheme,
        selected: null,
        page_id: this.props.library_id,
        show_api_links: false,
        user_name: window.username
      }), /*#__PURE__*/_react["default"].createElement("div", {
        id: "repository_container",
        className: outer_class,
        ref: this.top_ref,
        style: outer_style
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          width: lib_props.usable_width
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
        id: "the_container",
        style: {
          marginTop: 100
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
        position: _core.Position.RIGHT
      }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "box",
        iconSize: 20,
        tabIndex: -1,
        color: this.getIconColor("collections-pane")
      }))), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "projects-pane",
        panel: projects_pane
      }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
        content: "Projects",
        position: _core.Position.RIGHT
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
        position: _core.Position.RIGHT
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
        position: _core.Position.RIGHT
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
        position: _core.Position.RIGHT
      }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "code",
        tabIndex: -1,
        color: this.getIconColor("code-pane")
      })))))));
    }
  }]);

  return RepositoryHomeApp;
}(_react["default"].Component);

exports.RepositoryHomeApp = RepositoryHomeApp;

if (!window.in_context) {
  _repository_home_main();
}