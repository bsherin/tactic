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

var _blueprint_toolbar = require("./blueprint_toolbar.js");

var _tactic_socket = require("./tactic_socket.js");

var _modal_react = require("./modal_react.js");

var _toaster = require("./toaster.js");

var _blueprint_navbar = require("./blueprint_navbar.js");

var _communication_react = require("./communication_react.js");

var _administer_pane = require("./administer_pane.js");

var _sizing_tools = require("./sizing_tools.js");

var _resource_viewer_context = require("./resource_viewer_context.js");

var _error_drawer = require("./error_drawer.js");

var _utilities_react = require("./utilities_react.js");

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
var MARGIN_SIZE = 17;
var tsocket;

function _administer_home_main() {
  (0, _blueprint_navbar.render_navbar)("library");
  tsocket = new LibraryTacticSocket("library", 5000);
  var AdministerHomeAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(AdministerHomeApp, tsocket), tsocket);
  var domContainer = document.querySelector('#library-home-root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(AdministerHomeAppPlus, null), domContainer);
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
        "room": window.library_id
      });
      this.attachListener("window-open", function (data) {
        return window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
      });
      this.attachListener('handle-callback', _communication_react.handleCallback);
      this.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == window.library_id)) {
          window.close();
        }
      });
      this.attachListener('doflash', _toaster.doFlash);
    }
  }]);

  return LibraryTacticSocket;
}(_tactic_socket.TacticSocket);

var res_types = ["container", "user"];
var col_names = {
  container: ["Id", "Other_name", "Name", "Image", "Owner", "Status", "Uptime"],
  user: ["_id", "username", "full_name", "last_login", "email"]
};

function NamesToDict(acc, item) {
  acc[item] = "";
  return acc;
}

var AdministerHomeApp = /*#__PURE__*/function (_React$Component) {
  _inherits(AdministerHomeApp, _React$Component);

  var _super2 = _createSuper(AdministerHomeApp);

  function AdministerHomeApp(props) {
    var _this;

    _classCallCheck(this, AdministerHomeApp);

    _this = _super2.call(this, props);
    var aheight = (0, _sizing_tools.getUsableDimensions)().usable_height_no_bottom;
    var awidth = (0, _sizing_tools.getUsableDimensions)().usable_width - 170;
    _this.state = {
      selected_tab_id: "containers-pane",
      usable_width: awidth,
      usable_height: aheight,
      pane_states: {}
    };

    var _iterator = _createForOfIteratorHelper(res_types),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var res_type = _step.value;
        _this.state.pane_states[res_type] = {
          left_width_fraction: .65,
          selected_resource: col_names[res_type].reduce(NamesToDict, {}),
          tag_button_state: {
            expanded_tags: [],
            active_tag: "all",
            tree: []
          },
          console_text: "",
          search_from_field: false,
          search_from_tag: false,
          sorting_column: "updated",
          sorting_field: "updated_for_sort",
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

  _createClass(AdministerHomeApp, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      window.addEventListener("resize", this._update_window_dimensions);
      this.setState({
        "mounted": true
      });

      this._update_window_dimensions();

      this.props.stopSpinner();
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
      var container_pane = /*#__PURE__*/_react["default"].createElement(_administer_pane.AdminPane, _extends({}, this.props, {
        res_type: "container",
        allow_search_inside: false,
        allow_search_metadata: false,
        ToolbarClass: ContainerToolbar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["container"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        tsocket: tsocket,
        colnames: col_names.container,
        id_field: "Id"
      }));

      var user_pane = /*#__PURE__*/_react["default"].createElement(_administer_pane.AdminPane, _extends({}, this.props, {
        res_type: "user",
        allow_search_inside: false,
        allow_search_metadata: false,
        ToolbarClass: UserToolbar,
        updatePaneState: this._updatePaneState
      }, this.state.pane_states["user"], this.props.errorDrawerFuncs, {
        errorDrawerFuncs: this.props.errorDrawerFuncs,
        tsocket: tsocket,
        colnames: col_names.user,
        id_field: "_id"
      }));

      var outer_style = {
        width: this.state.usable_width,
        height: this.state.usable_height,
        paddingLeft: 0
      };
      return /*#__PURE__*/_react["default"].createElement(_resource_viewer_context.ViewerContext.Provider, {
        value: {
          readOnly: false
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "pane-holder",
        ref: this.top_ref,
        style: outer_style
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
        id: "containers-pane",
        panel: container_pane
      }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
        content: "Containers",
        position: _core.Position.RIGHT
      }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "box",
        iconSize: 20,
        tabIndex: -1,
        color: this.getIconColor("collections-pane")
      }))), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "users-pane",
        panel: user_pane
      }, /*#__PURE__*/_react["default"].createElement(_core.Tooltip, {
        content: "users",
        position: _core.Position.RIGHT
      }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "user",
        iconSize: 20,
        tabIndex: -1,
        color: this.getIconColor("collections-pane")
      }))))));
    }
  }]);

  return AdministerHomeApp;
}(_react["default"].Component);

var AdminToolbar = /*#__PURE__*/function (_React$Component2) {
  _inherits(AdminToolbar, _React$Component2);

  var _super3 = _createSuper(AdminToolbar);

  function AdminToolbar() {
    _classCallCheck(this, AdminToolbar);

    return _super3.apply(this, arguments);
  }

  _createClass(AdminToolbar, [{
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
                  multi_select: button[3],
                  tooltip: button[4]
                };
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
    key: "render",
    value: function render() {
      var outer_style = {
        display: "flex",
        flexDirection: "row",
        position: "relative",
        left: this.props.left_position,
        marginBottom: 10
      };
      return /*#__PURE__*/_react["default"].createElement(_blueprint_toolbar.Toolbar, {
        button_groups: this.prepare_button_groups(),
        file_adders: null,
        alternate_outer_style: outer_style,
        sendRef: this.props.sendRef,
        popup_buttons: null
      });
    }
  }]);

  return AdminToolbar;
}(_react["default"].Component);

AdminToolbar.propTypes = {
  button_groups: _propTypes["default"].array,
  left_position: _propTypes["default"].number,
  sendRef: _propTypes["default"].func
};

var ContainerToolbar = /*#__PURE__*/function (_React$Component3) {
  _inherits(ContainerToolbar, _React$Component3);

  var _super4 = _createSuper(ContainerToolbar);

  function ContainerToolbar(props) {
    var _this2;

    _classCallCheck(this, ContainerToolbar);

    _this2 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(ContainerToolbar, [{
    key: "_doFlashStopSpinner",
    value: function _doFlashStopSpinner(data) {
      this.props.stopSpinner();
      (0, _toaster.doFlash)(data);
    }
  }, {
    key: "_container_logs",
    value: function _container_logs() {
      var cont_id = this.props.selected_resource.Id;
      var self = this;
      $.getJSON($SCRIPT_ROOT + '/container_logs/' + cont_id, function (data) {
        self.props.setConsoleText(data.log_text);
      });
    }
  }, {
    key: "_clear_user_func",
    value: function _clear_user_func(event) {
      this.props.startSpinner();
      $.getJSON($SCRIPT_ROOT + '/clear_user_containers/' + window.library_id, this._doFlashStopSpinner);
    }
  }, {
    key: "_reset_server_func",
    value: function _reset_server_func(event) {
      this.props.startSpinner();
      $.getJSON($SCRIPT_ROOT + '/reset_server/' + library_id, this._doFlashStopSpinner);
    }
  }, {
    key: "_destroy_container",
    value: function _destroy_container() {
      this.props.startSpinner();
      var cont_id = this.props.selected_resource.Id;
      var self = this;
      $.getJSON($SCRIPT_ROOT + '/kill_container/' + cont_id, function (data) {
        self._doFlashStopSpinner(data);

        if (data.success) {
          self.props.delete_row(cont_id);
        }
      });
      this.props.stopSpinner();
    }
  }, {
    key: "button_groups",
    get: function get() {
      return [[["reset", this._reset_server_func, "reset", false, "Reset host container"], ["killall", this._clear_user_func, "clean", false, "Clear user containers"], ["killone", this._destroy_container, "delete", false, "Destroy one container"]], [["log", this._container_logs, "console", false, "Container logs"], ["refresh", this.props.refresh_func, "refresh", false, "Refresh"]]];
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(AdminToolbar, {
        button_groups: this.button_groups,
        left_position: this.props.left_position,
        sendRef: this.props.sendRef
      });
    }
  }]);

  return ContainerToolbar;
}(_react["default"].Component);

ContainerToolbar.propTypes = {
  selected_resource: _propTypes["default"].object,
  list_of_selected: _propTypes["default"].array,
  setConsoleText: _propTypes["default"].func,
  delete_row: _propTypes["default"].func,
  refresh_func: _propTypes["default"].func
};

var UserToolbar = /*#__PURE__*/function (_React$Component4) {
  _inherits(UserToolbar, _React$Component4);

  var _super5 = _createSuper(UserToolbar);

  function UserToolbar(props) {
    var _this3;

    _classCallCheck(this, UserToolbar);

    _this3 = _super5.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3));
    return _this3;
  }

  _createClass(UserToolbar, [{
    key: "_delete_user",
    value: function _delete_user() {
      var user_id = this.props.selected_resource._id;
      var confirm_text = "Are you sure that you want to delete user " + String(user_id) + "?";
      (0, _modal_react.showConfirmDialogReact)("Delete User", confirm_text, "do nothing", "delete", function () {
        $.getJSON($SCRIPT_ROOT + '/delete_user/' + user_id, _toaster.doFlash);
      });
    }
  }, {
    key: "_update_user_starters",
    value: function _update_user_starters(event) {
      var user_id = this.props.selected_resource._id;
      var confirm_text = "Are you sure that you want to update starter tiles for user " + String(user_id) + "?";
      (0, _modal_react.showConfirmDialogReact)("Update User", confirm_text, "do nothing", "update", function () {
        $.getJSON($SCRIPT_ROOT + '/update_user_starter_tiles/' + user_id, _toaster.doFlash);
      });
    }
  }, {
    key: "_migrate_user",
    value: function _migrate_user(event) {
      var user_id = this.props.selected_resource._id;
      var confirm_text = "Are you sure that you want to migrate user " + String(user_id) + "?";
      (0, _modal_react.showConfirmDialogReact)("Migrate User", confirm_text, "do nothing", "migrate", function () {
        $.getJSON($SCRIPT_ROOT + '/migrate_user/' + user_id, _toaster.doFlash);
      });
    }
  }, {
    key: "_create_user",
    value: function _create_user(event) {
      window.open($SCRIPT_ROOT + '/register');
    }
  }, {
    key: "_duplicate_user",
    value: function _duplicate_user(event) {
      var username = this.props.selected_resource.username;
      window.open($SCRIPT_ROOT + '/user_duplicate/' + username);
    }
  }, {
    key: "_update_all_collections",
    value: function _update_all_collections(event) {
      window.open($SCRIPT_ROOT + '/update_all_collections');
    }
  }, {
    key: "button_groups",
    get: function get() {
      return [[["create", this._create_user, "new-object", false, "Create user"], // ["duplicate", this._duplicate_user, "duplicate", false],
      ["delete", this._delete_user, "delete", false, "Delete user", "Delete user"], // ["update", this._update_user_starters, "automatic-updates", false, "],
      ["refresh", this.props.refresh_func, "refresh", false, "Refresh"]]];
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(AdminToolbar, {
        button_groups: this.button_groups,
        left_position: this.props.left_position,
        sendRef: this.props.sendRef
      });
    }
  }]);

  return UserToolbar;
}(_react["default"].Component);

UserToolbar.propTypes = {
  selected_resource: _propTypes["default"].object,
  list_of_selected: _propTypes["default"].array,
  setConsoleText: _propTypes["default"].func,
  delete_row: _propTypes["default"].func,
  refresh_func: _propTypes["default"].func
};

_administer_home_main();