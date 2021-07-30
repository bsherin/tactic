"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("../tactic_css/tactic.scss");

require("../tactic_css/tactic_table.scss");

require("../tactic_css/library_home.scss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _table = require("@blueprintjs/table");

var _modal_react = require("./modal_react.js");

var _blueprint_toolbar = require("./blueprint_toolbar.js");

var _tactic_socket = require("./tactic_socket.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _resource_viewer_context = require("./resource_viewer_context.js");

var _library_pane = require("./library_pane.js");

var _library_widgets = require("./library_widgets.js");

var _sizing_tools = require("./sizing_tools.js");

var _error_drawer = require("./error_drawer.js");

var _key_trap = require("./key_trap.js");

var _utilities_react = require("./utilities_react.js");

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

window.library_id = (0, _utilities_react.guid)();
window.page_id = window.library_id;
window.main_id = window.library_id;
var tsocket;

function _library_home_main() {
  tsocket = new LibraryTacticSocket("library", 5000);
  window.tsocket = tsocket;
  var LibraryHomeAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(LibraryHomeApp, tsocket), tsocket);
  var domContainer = document.querySelector('#library-home-root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(LibraryHomeAppPlus, {
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
        if (!(data["originator"] === window.library_id)) {
          window.close();
        }
      });
      this.socket.on('doflash', _toaster.doFlash);
    }
  }]);

  return LibraryTacticSocket;
}(_tactic_socket.TacticSocket);

var res_types = ["collection", "project", "tile", "list", "code"];
var tab_panes = ["collections-pane", "projects-pane", "tiles-pane", "lists-pane", "code-pane"]; // noinspection JSUnusedLocalSymbols,JSRemoveUnnecessaryParentheses

var LibraryHomeApp = /*#__PURE__*/function (_React$Component) {
  _inherits(LibraryHomeApp, _React$Component);

  var _super2 = _createSuper(LibraryHomeApp);

  function LibraryHomeApp(props) {
    var _this;

    _classCallCheck(this, LibraryHomeApp);

    _this = _super2.call(this, props);
    var aheight = (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
    var awidth = (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
    _this.state = {
      selected_tab_id: "collections-pane",
      usable_width: awidth,
      usable_height: aheight,
      dark_theme: props.initial_theme === "dark",
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
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(LibraryHomeApp, [{
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
      }, this._update_window_dimensions);
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
    key: "render",
    value: function render() {
      var tile_widget = /*#__PURE__*/_react["default"].createElement(_library_widgets.LoadedTileList, {
        tsocket: tsocket
      });

      var collection_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, this.props, {
        res_type: "collection",
        allow_search_inside: false,
        allow_search_metadata: false,
        ToolbarClass: CollectionToolbar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["collection"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        dark_theme: this.state.dark_theme,
        tsocket: tsocket
      }));

      var projects_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, this.props, {
        res_type: "project",
        allow_search_inside: false,
        allow_search_metadata: true,
        ToolbarClass: ProjectToolbar,
        updatePaneState: this._updatePaneState
      }, this.props.errorDrawerFuncs, this.state.pane_states["project"], {
        dark_theme: this.state.dark_theme,
        tsocket: tsocket
      }));

      var tiles_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, this.props, {
        res_type: "tile",
        allow_search_inside: true,
        allow_search_metadata: true,
        ToolbarClass: TileToolbar,
        updatePaneState: this._updatePaneState
      }, this.props.errorDrawerFuncs, this.state.pane_states["tile"], {
        tsocket: tsocket,
        aux_pane_title: "loaded tile list",
        dark_theme: this.state.dark_theme,
        aux_pane: tile_widget
      }));

      var lists_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, this.props, {
        res_type: "list",
        allow_search_inside: true,
        allow_search_metadata: true,
        ToolbarClass: ListToolbar
      }, this.props.errorDrawerFuncs, {
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["list"], {
        dark_theme: this.state.dark_theme,
        tsocket: tsocket
      }));

      var code_pane = /*#__PURE__*/_react["default"].createElement(_library_pane.LibraryPane, _extends({}, this.props, {
        res_type: "code",
        allow_search_inside: true,
        allow_search_metadata: true,
        ToolbarClass: CodeToolbar
      }, this.props.errorDrawerFuncs, {
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["code"], {
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
        outer_class = "".concat(outer_class, " bp3-dark");
      } else {
        outer_class = "".concat(outer_class, " light-theme");
      }

      var key_bindings = [[["tab"], this._goToNextPane], [["shift+tab"], this._goToPreviousPane]];
      return /*#__PURE__*/_react["default"].createElement(_resource_viewer_context.ViewerContext.Provider, {
        value: {
          readOnly: false
        }
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        selected: null,
        show_api_links: false,
        dark_theme: this.state.dark_theme,
        set_parent_theme: this._setTheme,
        user_name: window.username
      }), /*#__PURE__*/_react["default"].createElement("div", {
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
      })))))), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
        global: true,
        bindings: key_bindings
      }));
    }
  }]);

  return LibraryHomeApp;
}(_react["default"].Component);

var LibraryToolbar = /*#__PURE__*/function (_React$Component2) {
  _inherits(LibraryToolbar, _React$Component2);

  var _super3 = _createSuper(LibraryToolbar);

  function LibraryToolbar() {
    _classCallCheck(this, LibraryToolbar);

    return _super3.apply(this, arguments);
  }

  _createClass(LibraryToolbar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (this.props.context_menu_items) {
        this.props.sendContextMenuItems(this.props.context_menu_items);
      }
    }
  }, {
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

                if (button.length > 7) {
                  new_button.show_text = button[7];
                } else {
                  new_button.show_text = false;
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
            resource_type: button[1],
            process_handler: button[2],
            allowed_file_types: button[3],
            icon_name: button[4],
            checkboxes: button[5],
            combine: button[6],
            tooltip: button[7],
            show_csv_options: button[8]
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
  sendContextMenuItems: _propTypes["default"].func,
  button_groups: _propTypes["default"].array,
  file_adders: _propTypes["default"].array,
  popup_buttons: _propTypes["default"].array,
  multi_select: _propTypes["default"].bool,
  left_position: _propTypes["default"].number,
  sendRef: _propTypes["default"].func
};
LibraryToolbar.defaultProps = {
  file_adders: null,
  popup_buttons: null,
  left_position: 175
};
var specializedToolbarPropTypes = {
  sendContextMenuItems: _propTypes["default"].func,
  view_func: _propTypes["default"].func,
  view_resource: _propTypes["default"].func,
  duplicate_func: _propTypes["default"].func,
  delete_func: _propTypes["default"].func,
  rename_func: _propTypes["default"].func,
  refresh_func: _propTypes["default"].func,
  send_repository_func: _propTypes["default"].func,
  selected_resource: _propTypes["default"].object,
  list_of_selected: _propTypes["default"].array,
  muti_select: _propTypes["default"].bool,
  add_new_row: _propTypes["default"].func
};

var CollectionToolbar = /*#__PURE__*/function (_React$Component3) {
  _inherits(CollectionToolbar, _React$Component3);

  var _super4 = _createSuper(CollectionToolbar);

  function CollectionToolbar(props) {
    var _this3;

    _classCallCheck(this, CollectionToolbar);

    _this3 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    _this3.upload_name = null;
    return _this3;
  }

  _createClass(CollectionToolbar, [{
    key: "_collection_duplicate",
    value: function _collection_duplicate() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.duplicate_func("/duplicate_collection", resource_name);
    }
  }, {
    key: "_collection_delete",
    value: function _collection_delete() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.delete_func("/delete_collection", resource_name);
    }
  }, {
    key: "_combineCollections",
    value: function _combineCollections() {
      var res_name = this.props.selected_resource.name;
      var self = this;

      if (!this.props.multi_select) {
        (0, _modal_react.showModalReact)("Name of collection to combine with " + res_name, "collection Name", function (other_name) {
          self.props.startSpinner(true);
          var target = "".concat($SCRIPT_ROOT, "/combine_collections/").concat(res_name, "/").concat(other_name);
          $.post(target, function (data) {
            self.props.stopSpinner();

            if (!data.success) {
              self.props.addErrorDrawerEntry({
                title: "Error combining collections",
                content: data.message
              });
            }

            {
              (0, _toaster.doFlash)(data);
            }
          });
        }, null, null, null, null);
      } else {
        $.getJSON("".concat($SCRIPT_ROOT, "get_resource_names/collection"), function (data) {
          (0, _modal_react.showModalReact)("Combine Collections", "Name for combined collection", CreateCombinedCollection, "NewCollection", data["resource_names"]);
        });
      }

      function CreateCombinedCollection(new_name) {
        (0, _communication_react.postAjaxPromise)("combine_to_new_collection", {
          "original_collections": self.props.list_of_selected,
          "new_name": new_name
        }).then(function (data) {
          self.props.refresh_func();
          data.new_row;
        })["catch"](function (data) {
          self.props.addErrorDrawerEntry({
            title: "Error combining collections",
            content: data.message
          });
        });
      }
    }
  }, {
    key: "_downloadCollection",
    value: function _downloadCollection() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var res_name = resource_name ? resource_name : this.props.selected_resource.name;
      (0, _modal_react.showModalReact)("Download Collection as Excel Notebook", "New File Name", function (new_name) {
        window.open("".concat($SCRIPT_ROOT, "/download_collection/") + res_name + "/" + new_name);
      }, res_name + ".xlsx");
    }
  }, {
    key: "_displayImportResults",
    value: function _displayImportResults(data) {
      var title = "Collection Created";
      var message = "";
      var number_of_errors;

      if (data.file_decoding_errors == null) {
        data.message = "No decoding errors were encounters";
        data.alert_type = "Success";
        (0, _toaster.doFlash)(data);
      } else {
        message = "<b>Decoding errors were enountered</b>";

        for (var filename in data.file_decoding_errors) {
          number_of_errors = String(data.file_decoding_errors[filename].length);
          message = message + "<br>".concat(filename, ": ").concat(number_of_errors, " errors");
        }

        this.props.addErrorDrawerEntry({
          title: title,
          content: message
        });
      }
    }
  }, {
    key: "_import_collection",
    value: function _import_collection(myDropZone, setCurrentUrl, new_name, check_results) {
      var _this4 = this;

      var csv_options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var doc_type;

      if (check_results["import_as_freeform"]) {
        doc_type = "freeform";
      } else {
        doc_type = "table";
      }

      (0, _communication_react.postAjaxPromise)("create_empty_collection", {
        "collection_name": new_name,
        "doc_type": doc_type,
        "library_id": window.library_id,
        "csv_options": csv_options
      }).then(function (data) {
        var new_url = "append_documents_to_collection/".concat(new_name, "/").concat(doc_type, "/").concat(window.library_id);
        myDropZone.options.url = new_url;
        setCurrentUrl(new_url);
        _this4.upload_name = new_name;
        myDropZone.processQueue();
      })["catch"](function (data) {});
    }
  }, {
    key: "button_groups",
    get: function get() {
      return [[["open", this.props.view_func, "document-open", false, "primary", ["space", "return", "ctrl+o"], "View"]], [["duplicate", this._collection_duplicate, "duplicate", false, "success", [], "Duplicate"], ["rename", this.props.rename_func, "edit", false, "warning", [], "Rename"], ["combine", this._combineCollections, "merge-columns", true, "success", [], "Combine collections"]], [["download", this._downloadCollection, "cloud-download", false, "regular", [], "Download collection"], ["share", this.props.send_repository_func, "share", false, "regular", [], "Share to repository"]], [["delete", this._collection_delete, "trash", true, "danger", [], "Delete"]], [["refresh", this.props.refresh_func, "refresh", false, "regular", [], "Refresh list"]], [["drawer", this.props.toggleErrorDrawer, "drawer-right", false, "regular", [], "Toggle Error Drawer"]]];
    }
  }, {
    key: "context_menu_items",
    get: function get() {
      return [{
        text: "open",
        icon: "document-open",
        onClick: this.props.view_resource
      }, {
        text: "__divider__"
      }, {
        text: "rename",
        icon: "edit",
        onClick: this.props.rename_func
      }, {
        text: "duplicate",
        icon: "duplicate",
        onClick: this._collection_duplicate
      }, {
        text: "__divider__"
      }, {
        text: "download",
        icon: "cloud-download",
        onClick: this._downloadCollection
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this._collection_delete,
        intent: "danger"
      }];
    }
  }, {
    key: "file_adders",
    get: function get() {
      return [["Upload", "collection", this._import_collection, ".csv,.tsv,.txt,.xls,.xlsx,.html", "cloud-upload", [{
        "checkname": "import_as_freeform",
        "checktext": "Import as freeform"
      }], true, "Import collection", true]];
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryToolbar, {
        sendContextMenuItems: this.props.sendContextMenuItems,
        context_menu_items: this.context_menu_items,
        button_groups: this.button_groups,
        file_adders: this.file_adders,
        left_position: this.props.left_position,
        sendRef: this.props.sendRef,
        multi_select: this.props.multi_select
      });
    }
  }]);

  return CollectionToolbar;
}(_react["default"].Component);

CollectionToolbar.propTypes = specializedToolbarPropTypes;

var ProjectToolbar = /*#__PURE__*/function (_React$Component4) {
  _inherits(ProjectToolbar, _React$Component4);

  var _super5 = _createSuper(ProjectToolbar);

  function ProjectToolbar(props) {
    var _this5;

    _classCallCheck(this, ProjectToolbar);

    _this5 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this5));
    return _this5;
  }

  _createClass(ProjectToolbar, [{
    key: "_project_duplicate",
    value: function _project_duplicate() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.duplicate_func('/duplicate_project', resource_name);
    }
  }, {
    key: "new_notebook",
    value: function new_notebook() {
      window.open("".concat($SCRIPT_ROOT, "/new_notebook"));
    }
  }, {
    key: "_downloadJupyter",
    value: function _downloadJupyter() {
      var res_name = this.props.selected_resource.name;
      (0, _modal_react.showModalReact)("Download Notebook as Jupyter Notebook", "New File Name", function (new_name) {
        window.open("".concat($SCRIPT_ROOT, "/download_jupyter/") + res_name + "/" + new_name);
      }, res_name + ".ipynb");
    }
  }, {
    key: "_import_jupyter",
    value: function _import_jupyter(myDropZone, setCurrentUrl) {
      var new_url = "import_jupyter/".concat(window.library_id);
      myDropZone.options.url = new_url;
      setCurrentUrl(new_url);
      myDropZone.processQueue();
    }
  }, {
    key: "_project_delete",
    value: function _project_delete() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.delete_func("/delete_project", resource_name);
    }
  }, {
    key: "context_menu_items",
    get: function get() {
      return [{
        text: "open",
        icon: "document-open",
        onClick: this.props.view_resource
      }, {
        text: "__divider__"
      }, {
        text: "rename",
        icon: "edit",
        onClick: this.props.rename_func
      }, {
        text: "duplicate",
        icon: "duplicate",
        onClick: this._project_duplicate
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this._project_delete,
        intent: "danger"
      }];
    }
  }, {
    key: "button_groups",
    get: function get() {
      return [[["notebook", this.new_notebook, "new-text-box", false, "regular", ["ctrl+n"], "New notebook", "Notebook"]], [["open", this.props.view_func, "document-open", false, "regular", ["space", "return", "ctrl+o"], "View"]], [["duplicate", this._project_duplicate, "duplicate", false, "regular", [], "Duplicate"], ["rename", this.props.rename_func, "edit", false, "regular", [], "Rename"]], [["toJupyter", this._downloadJupyter, "cloud-download", false, "regular", [], "Download as Jupyter Notebook"], ["share", this.props.send_repository_func, "share", false, "regular", [], "Share to repository"]], [["delete", this._project_delete, "trash", true, "regular", [], "Delete"]], [["refresh", this.props.refresh_func, "refresh", false, "regular", [], "Refresh list"]]];
    }
  }, {
    key: "file_adders",
    get: function get() {
      return [["Upload", "project", this._import_jupyter, ".ipynb", "cloud-upload", [], false, "Import Jupyter notebook", false]];
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryToolbar, {
        sendContextMenuItems: this.props.sendContextMenuItems,
        context_menu_items: this.context_menu_items,
        button_groups: this.button_groups,
        file_adders: this.file_adders,
        left_position: this.props.left_position,
        sendRef: this.props.sendRef,
        multi_select: this.props.multi_select
      });
    }
  }]);

  return ProjectToolbar;
}(_react["default"].Component);

ProjectToolbar.propTypes = specializedToolbarPropTypes;

var TileToolbar = /*#__PURE__*/function (_React$Component5) {
  _inherits(TileToolbar, _React$Component5);

  var _super6 = _createSuper(TileToolbar);

  function TileToolbar(props) {
    var _this6;

    _classCallCheck(this, TileToolbar);

    _this6 = _super6.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this6));
    return _this6;
  }

  _createClass(TileToolbar, [{
    key: "_tile_view",
    value: function _tile_view() {
      this.props.view_func("/view_module/");
    }
  }, {
    key: "_view_named_tile",
    value: function _view_named_tile(resource_name) {
      this.props.view_resource(resource_name, "/view_module/");
    }
  }, {
    key: "_creator_view_named_tile",
    value: function _creator_view_named_tile(resource_name) {
      this.props.view_resource(resource_name, "/view_in_creator/");
    }
  }, {
    key: "_creator_view",
    value: function _creator_view() {
      this.props.view_func("/view_in_creator/");
    }
  }, {
    key: "_tile_duplicate",
    value: function _tile_duplicate() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.duplicate_func('/create_duplicate_tile', resource_name);
    }
  }, {
    key: "_compare_tiles",
    value: function _compare_tiles() {
      var res_names = this.props.list_of_selected;
      if (res_names.length == 0) return;

      if (res_names.length == 1) {
        window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/").concat(res_names[0]));
      } else if (res_names.length == 2) {
        window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/both_names/").concat(res_names[0], "/").concat(res_names[1]));
      } else {
        (0, _toaster.doFlash)({
          "alert-type": "alert-warning",
          "message": "Select only one or two tiles before launching compare"
        });
      }
    }
  }, {
    key: "_load_tile",
    value: function _load_tile() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var self = this;
      if (!resource_name) resource_name = this.props.list_of_selected[0];
      (0, _communication_react.postWithCallbackNoMain)("host", "load_tile_module_task", {
        "tile_module_name": resource_name,
        "user_id": window.user_id
      }, function (data) {
        if (!data.success) {
          self.props.addErrorDrawerEntry({
            title: "Error loading tile",
            content: data.message
          });
        } else {
          (0, _toaster.doFlash)(data);
        }
      });
    }
  }, {
    key: "_unload_all_tiles",
    value: function _unload_all_tiles() {
      $.getJSON("".concat($SCRIPT_ROOT, "/unload_all_tiles"), _toaster.doFlash);
    }
  }, {
    key: "_tile_delete",
    value: function _tile_delete() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.delete_func("/delete_tile_module", resource_name);
    }
  }, {
    key: "_new_tile",
    value: function _new_tile(template_name) {
      $.getJSON($SCRIPT_ROOT + "get_resource_names/tile", function (data) {
        (0, _modal_react.showModalReact)("New Tile", "New Tile Name", CreateNewTileModule, "NewTileModule", data["resource_names"]);
      });
      var self = this;

      function CreateNewTileModule(new_name) {
        var result_dict = {
          "template_name": template_name,
          "new_res_name": new_name,
          "last_saved": "viewer"
        };
        (0, _communication_react.postAjaxPromise)("/create_tile_module", result_dict).then(function (data) {
          self.props.refresh_func();
          window.open($SCRIPT_ROOT + "/view_module/" + String(new_name));
        })["catch"](function (data) {
          self.props.addErrorDrawerEntry({
            title: "Error creating new tile",
            content: data.message
          });
        });
      }
    }
  }, {
    key: "_new_in_creator",
    value: function _new_in_creator(template_name) {
      $.getJSON("".concat($SCRIPT_ROOT, "/get_resource_names/tile"), function (data) {
        (0, _modal_react.showModalReact)("New Tile", "New Tile Name", CreateNewTileModule, "NewTileModule", data["resource_names"]);
      });
      var self = this;

      function CreateNewTileModule(new_name) {
        var result_dict = {
          "template_name": template_name,
          "new_res_name": new_name,
          "last_saved": "creator"
        };
        (0, _communication_react.postAjaxPromise)("/create_tile_module", result_dict).then(function (data) {
          self.props.refresh_func();
          window.open($SCRIPT_ROOT + "/view_in_creator/" + String(new_name));
        })["catch"](function (data) {
          self.props.addErrorDrawerEntry({
            title: "Error creating new tile",
            content: data.message
          });
        });
      }
    }
  }, {
    key: "popup_buttons",
    get: function get() {
      var _this7 = this;

      return [["tile", "new-text-box", [["StandardTile", function () {
        _this7._new_in_creator("BasicTileTemplate");
      }, "code"], ["MatplotlibTile", function () {
        _this7._new_in_creator("MatplotlibTileTemplate");
      }, "timeline-line-chart"], ["D3Tile", function () {
        _this7._new_in_creator("D3TileTemplate");
      }, "timeline-area-chart"]]]];
    }
  }, {
    key: "context_menu_items",
    get: function get() {
      return [{
        text: "edit",
        icon: "edit",
        onClick: this._view_named_tile
      }, {
        text: "edit in creator",
        icon: "annotation",
        onClick: this._creator_view_named_tile
      }, {
        text: "__divider__"
      }, {
        text: "load",
        icon: "upload",
        onClick: this._load_tile
      }, {
        text: "__divider__"
      }, {
        text: "rename",
        icon: "edit",
        onClick: this.props.rename_func
      }, {
        text: "duplicate",
        icon: "duplicate",
        onClick: this._tile_duplicate
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this._tile_delete,
        intent: "danger"
      }];
    }
  }, {
    key: "button_groups",
    get: function get() {
      return [[["creator", this._creator_view, "document-open", false, "regular", ["space", "return", "ctrl+o"], "View in tile creator"], ["compare", this._compare_tiles, "comparison", true, "regular", [], "Compare tiles"], ["load", this._load_tile, "upload", false, "regular", [], "Load tile"], ["unload", this._unload_all_tiles, "clean", false, "regular", [], "Unload all tiles"]], [["duplicate", this._tile_duplicate, "duplicate", false, "regular", [], "Duplicate"], ["rename", this.props.rename_func, "edit", false, "regular", [], "Rename"]], [["share", this.props.send_repository_func, "share", false, "regular", [], "Share to repository"]], [["delete", this._tile_delete, "trash", true, "regular", [], "Delete"]], [["refresh", this.props.refresh_func, "refresh", false, "regular", [], "Refresh"]], [["drawer", this.props.toggleErrorDrawer, "drawer-right", false, "regular", [], "Toggle Error Drawer"]]];
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryToolbar, {
        sendContextMenuItems: this.props.sendContextMenuItems,
        context_menu_items: this.context_menu_items,
        button_groups: this.button_groups,
        popup_buttons: this.popup_buttons,
        left_position: this.props.left_position,
        sendRef: this.props.sendRef,
        multi_select: this.props.multi_select
      });
    }
  }]);

  return TileToolbar;
}(_react["default"].Component);

TileToolbar.propTypes = specializedToolbarPropTypes;

var ListToolbar = /*#__PURE__*/function (_React$Component6) {
  _inherits(ListToolbar, _React$Component6);

  var _super7 = _createSuper(ListToolbar);

  function ListToolbar(props) {
    var _this8;

    _classCallCheck(this, ListToolbar);

    _this8 = _super7.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this8));
    return _this8;
  }

  _createClass(ListToolbar, [{
    key: "_list_duplicate",
    value: function _list_duplicate() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.duplicate_func('/create_duplicate_list', resource_name);
    }
  }, {
    key: "_list_delete",
    value: function _list_delete() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.delete_func("/delete_list", resource_name);
    }
  }, {
    key: "_add_list",
    value: function _add_list(myDropZone, setCurrentUrl) {
      var new_url = "import_list/".concat(window.library_id);
      myDropZone.options.url = new_url;
      setCurrentUrl(new_url);
      myDropZone.processQueue();
    }
  }, {
    key: "context_menu_items",
    get: function get() {
      return [{
        text: "edit",
        icon: "document-open",
        onClick: this.props.view_resource
      }, {
        text: "__divider__"
      }, {
        text: "rename",
        icon: "edit",
        onClick: this.props.rename_func
      }, {
        text: "duplicate",
        icon: "duplicate",
        onClick: this._list_duplicate
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this._list_delete,
        intent: "danger"
      }];
    }
  }, {
    key: "button_groups",
    get: function get() {
      return [[["edit", this.props.view_func, "document-open", false, "regular", ["space", "return", "ctrl+o"], "View"]], [["duplicate", this._list_duplicate, "duplicate", false, "regular", [], "Duplicate"], ["rename", this.props.rename_func, "edit", false, "regular", [], "Rename"]], [["share", this.props.send_repository_func, "share", false, "regular", [], "Share to repository"]], [["delete", this._list_delete, "trash", true, "regular", [], "Delete"]], [["refresh", this.props.refresh_func, "refresh", false, "regular", [], "Refresh list"]]];
    }
  }, {
    key: "file_adders",
    get: function get() {
      return [["Upload", "list", this._add_list, "text/*", "cloud-upload", [], false, "Import list", false]];
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryToolbar, {
        sendContextMenuItems: this.props.sendContextMenuItems,
        context_menu_items: this.context_menu_items,
        button_groups: this.button_groups,
        file_adders: this.file_adders,
        popup_buttons: this.popup_buttons,
        left_position: this.props.left_position,
        sendRef: this.props.sendRef,
        multi_select: this.props.multi_select
      });
    }
  }]);

  return ListToolbar;
}(_react["default"].Component);

ListToolbar.propTypes = specializedToolbarPropTypes;

var CodeToolbar = /*#__PURE__*/function (_React$Component7) {
  _inherits(CodeToolbar, _React$Component7);

  var _super8 = _createSuper(CodeToolbar);

  function CodeToolbar(props) {
    var _this9;

    _classCallCheck(this, CodeToolbar);

    _this9 = _super8.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this9));
    return _this9;
  }

  _createClass(CodeToolbar, [{
    key: "_new_code",
    value: function _new_code(template_name) {
      $.getJSON("".concat($SCRIPT_ROOT, "/get_resource_names/code"), function (data) {
        (0, _modal_react.showModalReact)("New Code Resource", "New Code Resource Name", CreateNewCodeResource, "NewCodeResource", data["resource_names"]);
      });
      var self = this;

      function CreateNewCodeResource(new_name) {
        var result_dict = {
          "template_name": template_name,
          "new_res_name": new_name
        };
        (0, _communication_react.postAjaxPromise)("/create_code", result_dict).then(function (data) {
          self.props.refresh_func();
          window.open($SCRIPT_ROOT + "/view_code/" + String(new_name));
        })["catch"](function (data) {
          self.props.addErrorDrawerEntry({
            title: "Error creating new code resource",
            content: data.message
          });
        });
      }
    }
  }, {
    key: "_code_duplicate",
    value: function _code_duplicate() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.duplicate_func('/create_duplicate_code', resource_name);
    }
  }, {
    key: "_code_delete",
    value: function _code_delete() {
      var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.delete_func("/delete_code", resource_name);
    }
  }, {
    key: "popup_buttons",
    get: function get() {
      var _this10 = this;

      return [["code", "new-text-box", [["BasicCodeTemplate", function () {
        _this10._new_code("BasicCodeTemplate");
      }, "code"]]]];
    }
  }, {
    key: "context_menu_items",
    get: function get() {
      return [{
        text: "edit",
        icon: "document-open",
        onClick: this.props.view_resource
      }, {
        text: "__divider__"
      }, {
        text: "rename",
        icon: "edit",
        onClick: this.props.rename_func
      }, {
        text: "duplicate",
        icon: "duplicate",
        onClick: this._code_duplicate
      }, {
        text: "__divider__"
      }, {
        text: "delete",
        icon: "trash",
        onClick: this._code_delete,
        intent: "danger"
      }];
    }
  }, {
    key: "button_groups",
    get: function get() {
      return [[["edit", this.props.view_func, "document-open", false, "regular", ["space", "return", "ctrl+o"], "View"]], [["duplicate", this._code_duplicate, "duplicate", false, "regular", [], "Duplicate"], ["rename", this.props.rename_func, "edit", false, "regular", [], "Rename"]], [["share", this.props.send_repository_func, "share", false, "regular", [], "Share to repository"]], [["delete", this._code_delete, "trash", true, "regular", [], "Delete"]], [["refresh", this.props.refresh_func, "refresh", false, "regular", [], "Refresh list"]]];
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(LibraryToolbar, {
        sendContextMenuItems: this.props.sendContextMenuItems,
        context_menu_items: this.context_menu_items,
        button_groups: this.button_groups,
        popup_buttons: this.popup_buttons,
        left_position: this.props.left_position,
        sendRef: this.props.sendRef,
        multi_select: this.props.multi_select
      });
    }
  }]);

  return CodeToolbar;
}(_react["default"].Component);

CodeToolbar.propTypes = specializedToolbarPropTypes;

_library_home_main();