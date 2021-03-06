"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("../tactic_css/tactic.scss");

require("../tactic_css/tactic_table.scss");

require("../tactic_css/library_home.scss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _blueprint_toolbar = require("./blueprint_toolbar.js");

var _tactic_socket = require("./tactic_socket.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _library_pane = require("./library_pane.js");

var _sizing_tools = require("./sizing_tools.js");

var _resource_viewer_context = require("./resource_viewer_context.js");

var _error_drawer = require("./error_drawer.js");

var _utilities_react = require("./utilities_react.js");

var _utilities_react2 = require("./utilities_react");

var _blueprint_navbar = require("./blueprint_navbar");

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

window.library_id = (0, _utilities_react2.guid)();
window.page_id = window.library_id;
var MARGIN_SIZE = 17;
var tsocket;

function _repository_home_main() {
  tsocket = new LibraryTacticSocket("library", 5000);
  var RepositoryHomeAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(RepositoryHomeApp, tsocket), tsocket);
  var domContainer = document.querySelector('#library-home-root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(RepositoryHomeAppPlus, {
    initial_theme: window.theme
  }), domContainer);
}

var LibraryTacticSocket = /*#__PURE__*/function (_TacticSocket) {
  _inherits(LibraryTacticSocket, _TacticSocket);

  var _super = _createSuper(LibraryTacticSocket);

  function LibraryTacticSocket() {
    _classCallCheck(this, LibraryTacticSocket);

    return _super.apply(this, arguments);
  }

  _createClass(LibraryTacticSocket, [{
    key: "initialize_socket_stuff",
    value: function initialize_socket_stuff() {
      var reconnect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      this.socket.emit('join', {
        "user_id": window.user_id,
        "library_id": window.library_id
      });
      this.socket.on("window-open", function (data) {
        return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
      });
      this.socket.on('handle-callback', _communication_react.handleCallback);
      this.socket.on('close-user-windows', function (data) {
        if (!(data["originator"] == window.library_id)) {
          window.close();
        }
      });
      this.socket.on('doflash', _toaster.doFlash);
    }
  }]);

  return LibraryTacticSocket;
}(_tactic_socket.TacticSocket);

var res_types = ["collection", "project", "tile", "list", "code"];

var RepositoryHomeApp = /*#__PURE__*/function (_React$Component) {
  _inherits(RepositoryHomeApp, _React$Component);

  var _super2 = _createSuper(RepositoryHomeApp);

  function RepositoryHomeApp(props) {
    var _this;

    _classCallCheck(this, RepositoryHomeApp);

    _this = _super2.call(this, props);
    var aheight = (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
    var awidth = (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
    _this.state = {
      selected_tab_id: "collections-pane",
      usable_width: awidth,
      usable_height: aheight,
      dark_theme: props.initial_theme == "dark",
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
          search_from_field: false,
          search_from_tag: false,
          sorting_column: "updated",
          sorting_field: "updated_for_sort",
          sorting_direction: "descending",
          multi_select: false,
          list_of_selected: [],
          search_string: "",
          search_inside: false,
          search_metadata: false
        };
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    _this.top_ref = /*#__PURE__*/_react["default"].createRef();
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(RepositoryHomeApp, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener("resize", this._update_window_dimensions);
      this.setState({
        "mounted": true
      });

      this._update_window_dimensions();

      this.props.stopSpinner();
      this.props.setStatusTheme(this.state.dark_theme);
      window.dark_theme = this.state.dark_theme;
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
      var collection_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({
        res_type: "collection",
        allow_search_inside: false,
        allow_search_metadata: false,
        ToolbarClass: RepositoryCollectionToolbar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["collection"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        is_repository: true,
        dark_theme: this.state.dark_theme,
        tsocket: tsocket
      }));

      var projects_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({
        res_type: "project",
        allow_search_inside: false,
        allow_search_metadata: true,
        ToolbarClass: RepositoryProjectToolbar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["project"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        is_repository: true,
        dark_theme: this.state.dark_theme,
        tsocket: tsocket
      }));

      var tiles_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({
        res_type: "tile",
        allow_search_inside: true,
        allow_search_metadata: true,
        ToolbarClass: RepositoryTileToolbar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["tile"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        is_repository: true,
        dark_theme: this.state.dark_theme,
        tsocket: tsocket
      }));

      var lists_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({
        res_type: "list",
        allow_search_inside: true,
        allow_search_metadata: true,
        ToolbarClass: RepositoryListToolbar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["list"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        is_repository: true,
        dark_theme: this.state.dark_theme,
        tsocket: tsocket
      }));

      var code_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({
        res_type: "code",
        allow_search_inside: true,
        allow_search_metadata: true,
        ToolbarClass: RepositoryCodeToolbar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["code"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        is_repository: true,
        dark_theme: this.state.dark_theme,
        tsocket: tsocket
      }));

      var outer_style = {
        width: "100%",
        height: this.state.usable_height,
        paddingLeft: 0
      };
      var outer_class = "pane-holder  ";

      if (this.state.dark_theme) {
        outer_class = outer_class + " bp3-dark";
      } else {
        outer_class = outer_class + " light-theme";
      }

      return /*#__PURE__*/_react["default"].createElement(_resource_viewer_context.ViewerContext.Provider, {
        value: {
          readOnly: true
        }
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        selected: null,
        show_api_links: false,
        dark_theme: this.state.dark_theme,
        set_parent_theme: this._setTheme,
        user_name: window.username
      }), /*#__PURE__*/_react["default"].createElement("div", {
        id: "repository_container",
        className: outer_class,
        ref: this.top_ref,
        style: outer_style
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          width: this.state.usable_width
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

var LibraryToolbar = /*#__PURE__*/function (_React$Component2) {
  _inherits(LibraryToolbar, _React$Component2);

  var _super3 = _createSuper(LibraryToolbar);

  function LibraryToolbar() {
    _classCallCheck(this, LibraryToolbar);

    return _super3.apply(this, arguments);
  }

  _createClass(LibraryToolbar, [{
    key: "prepare_button_groups",
    value: function prepare_button_groups() {
      var new_bgs = [];
      var new_group;
      var new_button;

      var _iterator2 = _createForOfIteratorHelper(this.props.button_groups),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var group = _step2.value;
          new_group = [];

          var _iterator3 = _createForOfIteratorHelper(group),
              _step3;

          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var button = _step3.value;

              if (!this.props.multi_select || button[3]) {
                new_button = {
                  name_text: button[0],
                  click_handler: button[1],
                  icon_name: button[2],
                  multi_select: button[3]
                };

                if (button.length > 4) {
                  new_button.intent = button[4];
                }

                if (button.length > 5) {
                  new_button.key_bindings = button[5];
                }

                if (button.length > 6) {
                  new_button.tooltip = button[6];
                }

                new_group.push(new_button);
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }

          if (new_group.length != 0) {
            new_bgs.push(new_group);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return new_bgs;
    }
  }, {
    key: "prepare_file_adders",
    value: function prepare_file_adders() {
      if (this.props.file_adders == null || this.props.file_adders.length == 0) return [];
      var file_adders = [];

      var _iterator4 = _createForOfIteratorHelper(this.props.file_adders),
          _step4;

      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var button = _step4.value;
          var new_button = {
            name_text: button[0],
            click_handler: button[1],
            icon_name: button[2],
            multiple: button[3]
          };
          file_adders.push(new_button);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      return file_adders;
    }
  }, {
    key: "prepare_popup_buttons",
    value: function prepare_popup_buttons() {
      if (this.props.popup_buttons == null || this.props.popup_buttons.length == 0) return [];
      var popup_buttons = [];

      var _iterator5 = _createForOfIteratorHelper(this.props.popup_buttons),
          _step5;

      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var button = _step5.value;
          var new_button = {
            name: button[0],
            icon_name: button[1]
          };
          var opt_list = [];

          var _iterator6 = _createForOfIteratorHelper(button[2]),
              _step6;

          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var opt = _step6.value;
              opt_list.push({
                opt_name: opt[0],
                opt_func: opt[1],
                opt_icon: opt[2]
              });
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }

          new_button["option_list"] = opt_list;
          popup_buttons.push(new_button);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }

      return popup_buttons;
    }
  }, {
    key: "render",
    value: function render() {
      var outer_style = {
        display: "flex",
        flexDirection: "row",
        position: "relative",
        left: this.props.left_position,
        marginBottom: 10
      };
      var popup_buttons = this.prepare_popup_buttons();
      return /*#__PURE__*/_react["default"].createElement(_blueprint_toolbar.Toolbar, {
        button_groups: this.prepare_button_groups(),
        file_adders: this.prepare_file_adders(),
        alternate_outer_style: outer_style,
        sendRef: this.props.sendRef,
        popup_buttons: popup_buttons
      });
    }
  }]);

  return LibraryToolbar;
}(_react["default"].Component);

LibraryToolbar.propTypes = {
  button_groups: _propTypes["default"].array,
  file_adders: _propTypes["default"].array,
  popup_buttons: _propTypes["default"].array,
  multi_select: _propTypes["default"].bool,
  left_position: _propTypes["default"].number,
  sendRef: _propTypes["default"].func
};
LibraryToolbar.defaultProps = {
  file_adders: null,
  popup_buttons: null
};
var specializedToolbarPropTypes = {
  view_func: _propTypes["default"].func,
  repository_copy_func: _propTypes["default"].func,
  selected_resource: _propTypes["default"].object,
  list_of_selected: _propTypes["default"].array,
  muti_select: _propTypes["default"].bool
};

var RepositoryCollectionToolbar = /*#__PURE__*/function (_React$Component3) {
  _inherits(RepositoryCollectionToolbar, _React$Component3);

  var _super4 = _createSuper(RepositoryCollectionToolbar);

  function RepositoryCollectionToolbar(props) {
    var _this3;

    _classCallCheck(this, RepositoryCollectionToolbar);

    _this3 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(RepositoryCollectionToolbar, [{
    key: "button_groups",
    get: function get() {
      return [[["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]];
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryToolbar, {
        button_groups: this.button_groups,
        left_position: this.props.left_position,
        sendRef: this.props.sendRef,
        multi_select: this.props.multi_select
      });
    }
  }]);

  return RepositoryCollectionToolbar;
}(_react["default"].Component);

RepositoryCollectionToolbar.propTypes = specializedToolbarPropTypes;

var RepositoryProjectToolbar = /*#__PURE__*/function (_React$Component4) {
  _inherits(RepositoryProjectToolbar, _React$Component4);

  var _super5 = _createSuper(RepositoryProjectToolbar);

  function RepositoryProjectToolbar(props) {
    var _this4;

    _classCallCheck(this, RepositoryProjectToolbar);

    _this4 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this4));
    return _this4;
  }

  _createClass(RepositoryProjectToolbar, [{
    key: "button_groups",
    get: function get() {
      return [[["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]];
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryToolbar, {
        button_groups: this.button_groups,
        left_position: this.props.left_position,
        sendRef: this.props.sendRef,
        multi_select: this.props.multi_select
      });
    }
  }]);

  return RepositoryProjectToolbar;
}(_react["default"].Component);

RepositoryProjectToolbar.propTypes = specializedToolbarPropTypes;

var RepositoryTileToolbar = /*#__PURE__*/function (_React$Component5) {
  _inherits(RepositoryTileToolbar, _React$Component5);

  var _super6 = _createSuper(RepositoryTileToolbar);

  function RepositoryTileToolbar(props) {
    var _this5;

    _classCallCheck(this, RepositoryTileToolbar);

    _this5 = _super6.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this5));
    return _this5;
  }

  _createClass(RepositoryTileToolbar, [{
    key: "_tile_view",
    value: function _tile_view(e) {
      this.props.view_func("/repository_view_module/");
    }
  }, {
    key: "button_groups",
    get: function get() {
      return [[["view", this._tile_view, "eye-open", false, "regular", [], "view"], ["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]];
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryToolbar, {
        button_groups: this.button_groups,
        left_position: this.props.left_position,
        sendRef: this.props.sendRef,
        multi_select: this.props.multi_select
      });
    }
  }]);

  return RepositoryTileToolbar;
}(_react["default"].Component);

RepositoryTileToolbar.propTypes = specializedToolbarPropTypes;

var RepositoryListToolbar = /*#__PURE__*/function (_React$Component6) {
  _inherits(RepositoryListToolbar, _React$Component6);

  var _super7 = _createSuper(RepositoryListToolbar);

  function RepositoryListToolbar(props) {
    var _this6;

    _classCallCheck(this, RepositoryListToolbar);

    _this6 = _super7.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this6));
    return _this6;
  }

  _createClass(RepositoryListToolbar, [{
    key: "_list_view",
    value: function _list_view(e) {
      this.props.view_func("/repository_view_list/");
    }
  }, {
    key: "button_groups",
    get: function get() {
      return [[["view", this._list_view, "eye-open", false, "regular", [], "view"], ["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]];
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryToolbar, {
        button_groups: this.button_groups,
        left_position: this.props.left_position,
        sendRef: this.props.sendRef,
        multi_select: this.props.multi_select
      });
    }
  }]);

  return RepositoryListToolbar;
}(_react["default"].Component);

RepositoryListToolbar.propTypes = specializedToolbarPropTypes;

var RepositoryCodeToolbar = /*#__PURE__*/function (_React$Component7) {
  _inherits(RepositoryCodeToolbar, _React$Component7);

  var _super8 = _createSuper(RepositoryCodeToolbar);

  function RepositoryCodeToolbar(props) {
    var _this7;

    _classCallCheck(this, RepositoryCodeToolbar);

    _this7 = _super8.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this7));
    return _this7;
  }

  _createClass(RepositoryCodeToolbar, [{
    key: "_code_view",
    value: function _code_view(e) {
      this.props.view_func("/repository_view_code/");
    }
  }, {
    key: "button_groups",
    get: function get() {
      return [[["view", this._code_view, "eye-open", false, "regular", [], "view"], ["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]];
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryToolbar, {
        button_groups: this.button_groups,
        left_position: this.props.left_position,
        sendRef: this.props.sendRef,
        multi_select: this.props.multi_select
      });
    }
  }]);

  return RepositoryCodeToolbar;
}(_react["default"].Component);

RepositoryCodeToolbar.propTypes = specializedToolbarPropTypes;

_repository_home_main();