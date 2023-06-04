"use strict";

require("../tactic_css/tactic.scss");

require("../tactic_css/context.scss");

require("../tactic_css/tactic_table.scss");

require("../tactic_css/library_home.scss");

require("../tactic_css/tile_creator.scss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _core = require("@blueprintjs/core");

var _tactic_socket = require("./tactic_socket");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _blueprint_navbar = require("./blueprint_navbar");

var _error_boundary = require("./error_boundary.js");

var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");

var _library_home_react = require("./library_home_react.js");

var _library_pane = require("./library_pane.js");

var _utilities_react = require("./utilities_react.js");

var _module_viewer_react = require("./module_viewer_react.js");

var _tile_creator_react = require("./tile_creator_react.js");

var _main_app = require("./main_app.js");

var _notebook_app = require("./notebook_app.js");

var _code_viewer_react = require("./code_viewer_react.js");

var _list_viewer_react = require("./list_viewer_react.js");

var _error_drawer = require("./error_drawer.js");

var _sizing_tools = require("./sizing_tools.js");

var _modal_react = require("./modal_react.js");

var _key_trap = require("./key_trap");

var _resizing_layouts = require("./resizing_layouts.js");

var _library_pane2 = require("./library_pane");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

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

_core.FocusStyleManager.onlyShowFocusOnTabs();

var spinner_panel = /*#__PURE__*/_react["default"].createElement("div", {
  style: {
    height: "100%",
    position: "absolute",
    top: "50%",
    left: "50%"
  }
}, /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
  size: 100
}));

var MIN_CONTEXT_WIDTH = 45;
var MIN_CONTEXT_SAVED_WIDTH = 100;
window.context_id = (0, _utilities_react.guid)();
window.main_id = window.context_id;
var tsocket = new _tactic_socket.TacticSocket("main", 5000, window.context_id);
var LibraryHomeAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(_library_home_react.LibraryHomeApp)); // const RepositoryHomeAppPlus = withErrorDrawer(withStatus(RepositoryHomeApp));

var ListViewerAppPlus = (0, _toaster.withStatus)(_list_viewer_react.ListViewerApp);
var CodeViewerAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(_code_viewer_react.CodeViewerApp));
var ModuleViewerAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(_module_viewer_react.ModuleViewerApp));
var CreatorAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(_tile_creator_react.CreatorApp));
var MainAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(_main_app.MainApp));
var NotebookAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(_notebook_app.NotebookApp));

function _context_main() {
  var ContextAppPlus = ContextApp;
  var domContainer = document.querySelector('#context-root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(ContextAppPlus, {
    initial_theme: window.theme,
    tsocket: tsocket
  }), domContainer);
} // noinspection JSValidateTypes,DuplicatedCode,JSUnusedLocalSymbols


var ContextApp = /*#__PURE__*/function (_React$Component) {
  _inherits(ContextApp, _React$Component);

  var _super = _createSuper(ContextApp);

  function ContextApp(props) {
    var _this;

    _classCallCheck(this, ContextApp);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));

    _this.initSocket();

    _this.socket_counter = null;
    var library_panel_props = (0, _library_home_react.library_props)(); // let repository_panel_props = repository_props();

    var aheight = (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
    var awidth = (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
    _this.state = {
      tab_ids: [],
      library_panel_props: library_panel_props,
      // repository_panel_props: repository_panel_props,
      tab_panel_dict: {},
      open_resources: {},
      dirty_methods: {},
      dark_theme: props.initial_theme === "dark",
      selectedTabId: "library",
      theme_setters: [],
      lastSelectedTabId: null,
      selectedLibraryTab: "all",
      // selectedRepositoryTab: "collections",
      usable_width: awidth,
      usable_height: aheight,
      tabWidth: 150,
      show_repository: false,
      dragging_over: null,
      currently_dragging: null
    };
    _this.libraryTabChange = null;
    _this.saved_width = _this.state.tabWidth; // this.repositoryTabChange = null;

    _this.top_ref = /*#__PURE__*/_react["default"].createRef();
    _this.key_bindings = [[["tab"], _this._goToNextPane], [["shift+tab"], _this._goToPreviousPane], [["ctrl+w"], function () {
      _this._closeTab(_this.state.selectedTabId);
    }]];
    return _this;
  }

  _createClass(ContextApp, [{
    key: "_setTheme",
    value: function _setTheme(dark_theme) {
      window.theme = dark_theme ? "dark" : "light";
      this.setState({
        dark_theme: dark_theme
      });
    }
  }, {
    key: "get_tab_list_elem",
    value: function get_tab_list_elem() {
      return document.querySelector("#context-container .context-tab-list > .bp4-tab-list");
    }
  }, {
    key: "_togglePane",
    value: function _togglePane(pane_closed) {
      var w = pane_closed ? this.saved_width : MIN_CONTEXT_WIDTH;
      var tab_elem = this.get_tab_list_elem();
      tab_elem.setAttribute("style", "width:".concat(w, "px"));
    }
  }, {
    key: "_handleTabResize",
    value: function _handleTabResize(e, ui, lastX, lastY, dx, dy) {
      var tab_elem = this.get_tab_list_elem();
      var w = lastX > window.innerWidth / 2 ? window.innerWidth / 2 : lastX;
      w = w <= MIN_CONTEXT_WIDTH ? MIN_CONTEXT_WIDTH : w;
      tab_elem.setAttribute("style", "width:".concat(w, "px"));
    }
  }, {
    key: "_handleTabResizeStart",
    value: function _handleTabResizeStart(e, ui, lastX, lastY, dx, dy) {
      this.saved_width = Math.max(this.state.tabWidth, MIN_CONTEXT_SAVED_WIDTH);
    }
  }, {
    key: "_handleTabResizeEnd",
    value: function _handleTabResizeEnd(e, ui, lastX, lastY, dx, dy) {
      var tab_elem = this.get_tab_list_elem();

      if (tab_elem.offsetWidth > 45) {
        this.saved_width = Math.max(tab_elem.offsetWidth, MIN_CONTEXT_SAVED_WIDTH);
      }
    }
  }, {
    key: "_update_window_dimensions",
    value: function _update_window_dimensions() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var tab_list_elem = this.get_tab_list_elem();
      var uwidth;
      var uheight;
      var tabWidth;

      if (this.top_ref && this.top_ref.current) {
        uheight = window.innerHeight - this.top_ref.current.offsetTop;
      } else {
        uheight = window.innerHeight - _sizing_tools.USUAL_TOOLBAR_HEIGHT;
      }

      if (tab_list_elem) {
        uwidth = window.innerWidth - tab_list_elem.offsetWidth;
        tabWidth = tab_list_elem.offsetWidth;
      } else {
        uwidth = window.innerWidth - 150;
        tabWidth = 150;
      }

      this.setState({
        usable_height: uheight,
        usable_width: uwidth,
        tabWidth: tabWidth
      }, callback);
    }
  }, {
    key: "_registerThemeSetter",
    value: function _registerThemeSetter(setter) {
      this.setState({
        theme_setters: [].concat(_toConsumableArray(this.state.theme_setters), [setter])
      });
    }
  }, {
    key: "_registerDirtyMethod",
    value: function _registerDirtyMethod(tab_id, dirty_method) {
      var new_dirty_methods = _objectSpread({}, this.state.dirty_methods);

      new_dirty_methods[tab_id] = dirty_method;
      this.setState({
        dirty_methods: new_dirty_methods
      });
    }
  }, {
    key: "_registerLibraryTabChanger",
    value: function _registerLibraryTabChanger(handleTabChange) {
      this.libraryTabChange = handleTabChange;
    }
  }, {
    key: "_changeLibTab",
    value: function _changeLibTab(res_type) {
      this.libraryTabChange(res_type + "-pane");
      this.setState({
        selectedLibraryTab: res_type
      });
    }
  }, {
    key: "resTypes",
    get: function get() {
      return ["all", "collections", "projects", "tiles", "lists", "code"];
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.props.tsocket.disconnect();
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      window.dark_theme = this.state.dark_theme;
      window.addEventListener("resize", function () {
        return _this2._update_window_dimensions(null);
      });
      window.addEventListener("beforeunload", function (e) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to close? All changes will be lost.';
      });

      this._update_window_dimensions(null);

      var tab_list_elem = document.querySelector("#context-container .context-tab-list > .bp4-tab-list");
      var self = this;
      var resizeObserver = new ResizeObserver(function (entries) {
        self._update_window_dimensions(null);
      });

      if (tab_list_elem) {
        resizeObserver.observe(tab_list_elem);
      }
    }
  }, {
    key: "initSocket",
    value: function initSocket() {
      // It is necessary to delete and remake these callbacks
      // If I dont delete I end up with duplicatesSelectList
      // If I just keep the original one then I end up something with a handler linked
      // to an earlier state
      this.props.tsocket.attachListener("window-open", function (data) {
        window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
      });
      this.props.tsocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] === window.context_id)) {
          window.close();
        }
      });
      this.props.tsocket.attachListener("doFlash", function (data) {
        (0, _toaster.doFlash)(data);
      });
      this.props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
      this.props.tsocket.attachListener('handle-callback', function (task_packet) {
        (0, _communication_react.handleCallback)(task_packet, window.context_id);
      });
      this.props.tsocket.attachListener("create-viewer", this._handleCreateViewer);
    }
  }, {
    key: "_refreshTab",
    value: function _refreshTab(the_id) {
      var self = this;

      if (!(the_id in this.state.dirty_methods) || this.state.dirty_methods[the_id]()) {
        var title = this.state.tab_panel_dict[the_id].title;
        var confirm_text = "Are you sure that you want to reload the tab ".concat(title, "? Changes will be lost");

        var _self = this;

        (0, _modal_react.showConfirmDialogReact)("reload the tab ".concat(title), confirm_text, "do nothing", "reload", do_the_refresh);
      } else {
        do_the_refresh();
      }

      function do_the_refresh() {
        var old_tab_panel = _objectSpread({}, self.state.tab_panel_dict[the_id]);

        var resource_name = old_tab_panel.panel.resource_name;
        var res_type = old_tab_panel.res_type;
        var the_view;

        if (old_tab_panel.kind == "notebook-viewer" && !old_tab_panel.panel.is_project) {
          the_view = "/new_notebook_in_context/";
        } else {
          the_view = (0, _library_pane.view_views)()[res_type];
          var re = new RegExp("/$");
          the_view = the_view.replace(re, "_in_context");
        }

        var drmethod = function drmethod(dmethod) {
          self._registerDirtyMethod(the_id, dmethod);
        };

        self._updatePanel(the_id, {
          panel: "spinner"
        }, function () {
          (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + the_view, {
            context_id: window.context_id,
            resource_name: resource_name
          }).then(function (data) {
            var new_panel = self.propDict[data.kind](data, drmethod, function (new_panel) {
              self._updatePanel(the_id, {
                panel: new_panel,
                kind: data.kind
              });
            });
          })["catch"](_toaster.doFlash);
        });
      }
    }
  }, {
    key: "_closeATab",
    value: function _closeATab(the_id) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var idx = this.state.tab_ids.indexOf(the_id);

      var copied_tab_panel_dict = _objectSpread({}, this.state.tab_panel_dict);

      var copied_tab_ids = _toConsumableArray(this.state.tab_ids);

      var copied_dirty_methods = _objectSpread({}, this.state.dirty_methods);

      if (idx > -1) {
        copied_tab_ids.splice(idx, 1);
        delete copied_tab_panel_dict[the_id];
        delete copied_dirty_methods[the_id];
      }

      var new_state = {
        tab_panel_dict: copied_tab_panel_dict,
        tab_ids: copied_tab_ids,
        dirty_methods: copied_dirty_methods
      };
      var currentlySelected = this.state.selectedTabId;
      var stateUpdate;

      if (the_id == this.state.selectedTabId) {
        var newSelectedId;

        if (this.state.lastSelectedTabId && copied_tab_ids.includes(this.state.lastSelectedTabId)) {
          newSelectedId = this.state.lastSelectedTabId;
        } else {
          newSelectedId = "library";
        }

        stateUpdate = {
          selectedTabId: newSelectedId,
          lastSelectedTabId: "library"
        };
      } else {
        stateUpdate = {
          selectedTabId: currentlySelected
        };

        if (this.state.lastSelectedTabId == the_id) {
          stateUpdate.lastSelectedTabId = "library";
        }
      }

      var self = this;
      self.setState(new_state, function () {
        self.setState(stateUpdate, function () {
          self._updateOpenResources(function () {
            return self._update_window_dimensions(callback);
          });
        });
      });
    }
  }, {
    key: "_closeTab",
    value: function _closeTab(the_id) {
      var self = this;

      if (the_id == "library") {
        return;
      }

      if (!(the_id in this.state.dirty_methods) || this.state.dirty_methods[the_id]()) {
        var title = this.state.tab_panel_dict[the_id].title;
        var confirm_text = "Are you sure that you want to close the tab ".concat(title, "? Changes will be lost");
        (0, _modal_react.showConfirmDialogReact)("close the tab ".concat(title, "\""), confirm_text, "do nothing", "close", function () {
          self._closeATab(the_id);
        });
      } else {
        this._closeATab(the_id);
      }
    }
  }, {
    key: "iconDict",
    get: function get() {
      return {
        "module-viewer": "application",
        "code-viewer": "code",
        "list-viewer": "list",
        "creator-viewer": "application",
        "main-viewer": "projects",
        "notebook-viewer": "projects"
      };
    }
  }, {
    key: "libIconDict",
    get: function get() {
      return {
        all: _blueprint_mdata_fields.icon_dict["all"],
        collections: _blueprint_mdata_fields.icon_dict["collection"],
        projects: _blueprint_mdata_fields.icon_dict["project"],
        tiles: _blueprint_mdata_fields.icon_dict["tile"],
        lists: _blueprint_mdata_fields.icon_dict["list"],
        code: _blueprint_mdata_fields.icon_dict["code"]
      };
    }
  }, {
    key: "propDict",
    get: function get() {
      return {
        "module-viewer": _module_viewer_react.module_viewer_props,
        "code-viewer": _code_viewer_react.code_viewer_props,
        "list-viewer": _list_viewer_react.list_viewer_props,
        "creator-viewer": _tile_creator_react.creator_props,
        "main-viewer": _main_app.main_props,
        "notebook-viewer": _notebook_app.notebook_props
      };
    }
  }, {
    key: "classDict",
    get: function get() {
      return {
        "module-viewer": ModuleViewerAppPlus,
        "code-viewer": CodeViewerAppPlus,
        "list-viewer": ListViewerAppPlus,
        "creator-viewer": CreatorAppPlus,
        "main-viewer": MainAppPlus,
        "notebook-viewer": NotebookAppPlus
      };
    }
  }, {
    key: "panelRootDict",
    get: function get() {
      return {
        "module-viewer": "root",
        "code-viewer": "root",
        "list-viewer": "root",
        "creator-viewer": "creator-root",
        "main-viewer": "main-root",
        "notebook-viewer": "main-root"
      };
    }
  }, {
    key: "_addPanel",
    value: function _addPanel(new_id, viewer_kind, res_type, title, new_panel) {
      var callback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;

      var new_tab_panel_dict = _objectSpread({}, this.state.tab_panel_dict);

      new_tab_panel_dict[new_id] = {
        kind: viewer_kind,
        res_type: res_type,
        title: title,
        panel: new_panel
      };
      var self = this;
      this.setState({
        tab_panel_dict: new_tab_panel_dict,
        tab_ids: [].concat(_toConsumableArray(this.state.tab_ids), [new_id]),
        lastSelectedTabId: this.state.selectedTabId,
        selectedTabId: new_id
      }, function () {
        self._updateOpenResources(callback);
      });
    }
  }, {
    key: "_updatePanel",
    value: function _updatePanel(the_id, new_panel) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var new_tab_panel_dict = _objectSpread({}, this.state.tab_panel_dict);

      for (var k in new_panel) {
        if (k != "panel") {
          new_tab_panel_dict[the_id][k] = new_panel[k];
        }
      }

      if ("panel" in new_panel) {
        if (new_panel.panel == "spinner") {
          new_tab_panel_dict[the_id].panel = "spinner";
        } else if (new_tab_panel_dict[the_id].panel != "spinner") {
          for (var j in new_panel.panel) {
            new_tab_panel_dict[the_id].panel[j] = new_panel.panel[j];
          }
        } else {
          new_tab_panel_dict[the_id].panel = new_panel.panel;
        }
      }

      var self = this;
      this.setState({
        tab_panel_dict: new_tab_panel_dict
      }, function () {
        self._updateOpenResources(function () {
          return self._update_window_dimensions(callback);
        });
      });
    }
  }, {
    key: "_changeResourceName",
    value: function _changeResourceName(the_id, new_name) {
      var change_title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

      var new_tab_panel_dict = _objectSpread({}, this.state.tab_panel_dict);

      if (change_title) {
        new_tab_panel_dict[the_id].title = new_name;
      }

      new_tab_panel_dict[the_id].panel.resource_name = new_name;
      var self = this;
      this.setState({
        tab_panel_dict: new_tab_panel_dict
      }, function () {
        self._updateOpenResources(function () {
          return self._update_window_dimensions(callback);
        });
      });
    }
  }, {
    key: "_changeResourceTitle",
    value: function _changeResourceTitle(the_id, new_title) {
      var new_tab_panel_dict = _objectSpread({}, this.state.tab_panel_dict);

      new_tab_panel_dict[the_id].title = new_title;
      var self = this;
      this.setState({
        tab_panel_dict: new_tab_panel_dict
      }, function () {
        self._updateOpenResources(function () {
          return self._update_window_dimensions(null);
        });
      });
    }
  }, {
    key: "_changeResourceProps",
    value: function _changeResourceProps(the_id, new_props) {
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var new_tab_panel_dict = _objectSpread({}, this.state.tab_panel_dict);

      for (var prop in new_props) {
        new_tab_panel_dict[the_id].panel[prop] = new_props[prop];
      }

      this.setState({
        tab_panel_dict: new_tab_panel_dict
      }, function () {
        self._updateOpenResources(function () {
          return self._update_window_dimensions(callback);
        });
      });
    }
  }, {
    key: "_getResourceId",
    value: function _getResourceId(res_name, res_type) {
      var _iterator = _createForOfIteratorHelper(this.state.tab_ids),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var the_id = _step.value;
          var the_panel = this.state.tab_panel_dict[the_id];

          if (the_panel.panel.resource_name == res_name && the_panel.res_type == res_type) {
            return the_id;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return -1;
    }
  }, {
    key: "_handleCreateViewer",
    value: function _handleCreateViewer(data) {
      var _this3 = this;

      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var self = this; // const new_id = `${data.kind}: ${data.resource_name}`;

      var existing_id = this._getResourceId(data.resource_name, data.res_type);

      if (existing_id != -1) {
        this.setState({
          selectedTabId: existing_id
        });
        return;
      }

      var new_id = (0, _utilities_react.guid)();

      var drmethod = function drmethod(dmethod) {
        self._registerDirtyMethod(new_id, dmethod);
      };

      this._addPanel(new_id, data.kind, data.res_type, data.resource_name, "spinner", function () {
        var new_panel = self.propDict[data.kind](data, drmethod, function (new_panel) {
          _this3._updatePanel(new_id, {
            panel: new_panel
          }, callback);
        });
      });
    }
  }, {
    key: "_goToNextPane",
    value: function _goToNextPane(e) {
      var newId;

      if (this.state.selectedTabId == "library") {
        newId = this.state.tab_ids[0];
      } else {
        var tabIndex = this.state.tab_ids.indexOf(this.state.selectedTabId) + 1;
        newId = tabIndex === this.state.tab_ids.length ? "library" : this.state.tab_ids[tabIndex];
      }

      this._handleTabSelect(newId, this.state.selectedTabId);

      e.preventDefault();
    }
  }, {
    key: "_goToPreviousPane",
    value: function _goToPreviousPane(e) {
      var newId;

      if (this.state.selectedTabId == "library") {
        newId = this.state.tab_ids.at(-1);
      } else {
        var tabIndex = this.state.tab_ids.indexOf(this.state.selectedTabId) - 1;
        newId = tabIndex == -1 ? "library" : this.state.tab_ids[tabIndex];
      }

      this._handleTabSelect(newId, this.state.selectedTabId);

      e.preventDefault();
    }
  }, {
    key: "_handleTabSelect",
    value: function _handleTabSelect(newTabId, prevTabId) {
      var _this4 = this;

      var event = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      this.setState({
        selectedTabId: newTabId,
        lastSelectedTabId: prevTabId
      }, function () {
        return _this4._update_window_dimensions(callback);
      });
    }
  }, {
    key: "_goToModule",
    value: function _goToModule(module_name, line_number) {
      var _this5 = this;

      var _loop = function _loop(tab_id) {
        var pdict = _this5.state.tab_panel_dict[tab_id];

        if (pdict.kind == "creator-viewer" && pdict.panel.resource_name == module_name) {
          _this5._handleTabSelect(tab_id, _this5.state.selectedTabId, null, function () {
            if ("line_setter" in pdict) {
              pdict.line_setter(line_number);
            }
          });

          return {
            v: void 0
          };
        }
      };

      for (var tab_id in this.state.tab_panel_dict) {
        var _ret = _loop(tab_id);

        if (_typeof(_ret) === "object") return _ret.v;
      }

      var self = this;
      var the_view = (0, _library_pane.view_views)()["tile"];
      var re = new RegExp("/$");
      the_view = the_view.replace(re, "_in_context");
      (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + the_view, {
        context_id: window.context_id,
        resource_name: module_name
      }).then(function (data) {
        var new_id = "".concat(data.kind, ": ").concat(data.resource_name);

        var drmethod = function drmethod(dmethod) {
          self._registerDirtyMethod(new_id, dmethod);
        };

        _this5._addPanel(new_id, data.kind, data.res_type, data.resource_name, "spinner", function () {
          var new_panel = self.propDict[data.kind](data, drmethod, function (new_panel) {
            _this5._updatePanel(new_id, {
              panel: new_panel
            }, function () {
              var pdict = self.state.tab_panel_dict[new_id]; // pdict.line_setter(line_number)  // gives maximum depth exceeded error
            });
          });
        });
      })["catch"](_toaster.doFlash);
      return;
    }
  }, {
    key: "_registerLineSetter",
    value: function _registerLineSetter(tab_id, rfunc) {
      this._updatePanel(tab_id, {
        line_setter: rfunc
      });
    }
  }, {
    key: "_onDragStart",
    value: function _onDragStart(event, tab_id) {
      this.setState({
        currently_dragging: tab_id
      });
      event.stopPropagation();
    }
  }, {
    key: "_onDragEnd",
    value: function _onDragEnd(event) {
      this.setState({
        dragging_over: null,
        currently_dragging: null
      });
      event.stopPropagation();
      event.preventDefault();
    }
  }, {
    key: "_nextTab",
    value: function _nextTab(tab_id) {
      var tidx = this.state.tab_ids.indexOf(tab_id);
      if (tidx == -1) return null;
      if (tidx == this.state.tab_ids.length - 1) return "dummy";
      return this.state.tab_ids[tidx + 1];
    }
  }, {
    key: "_onDrop",
    value: function _onDrop(event, target_id) {
      if (this.state.currently_dragging == null || this.state.currently_dragging == target_id) return;
      var current_index = this.state.tab_ids.indexOf(this.state.currently_dragging);

      var new_tab_ids = _toConsumableArray(this.state.tab_ids);

      new_tab_ids.splice(current_index, 1);

      if (target_id == "dummy") {
        new_tab_ids.push(this.state.currently_dragging);
      } else {
        var target_index = new_tab_ids.indexOf(target_id);
        new_tab_ids.splice(target_index, 0, this.state.currently_dragging);
      }

      this.setState({
        "tab_ids": new_tab_ids,
        dragging_over: null
      });
      event.stopPropagation();
    }
  }, {
    key: "_onDragOver",
    value: function _onDragOver(event, target_id) {
      // this.setState({"dragging_over": target_id});
      event.stopPropagation();
      event.preventDefault();
    }
  }, {
    key: "_onDragEnter",
    value: function _onDragEnter(event, target_id) {
      if (target_id == this.state.currently_dragging || target_id == this._nextTab(this.state.currently_dragging)) {
        this.setState({
          "dragging_over": null
        });
      } else {
        this.setState({
          "dragging_over": target_id
        });
      }

      event.stopPropagation();
      event.preventDefault();
    }
  }, {
    key: "_onDragLeave",
    value: function _onDragLeave(event, target_id) {
      // this.setState({"dragging_over": null});
      event.stopPropagation();
      event.preventDefault();
    }
  }, {
    key: "_getOpenResources",
    value: function _getOpenResources() {
      var open_resources = {};

      var _iterator2 = _createForOfIteratorHelper(_library_pane2.res_types),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var res_type = _step2.value;
          open_resources[res_type] = [];
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      for (var the_id in this.state.tab_panel_dict) {
        var entry = this.state.tab_panel_dict[the_id];

        if (entry.panel != "spinner") {
          open_resources[entry.res_type].push(entry.panel.resource_name);
        }
      }

      open_resources["all"] = [];

      for (var rtype in open_resources) {
        open_resources["all"] = open_resources["all"].concat(open_resources[rtype]);
      }

      return open_resources;
    }
  }, {
    key: "_updateOpenResources",
    value: function _updateOpenResources() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.setState({
        open_resources: this._getOpenResources()
      }, callback);
    }
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      var unified = window.library_style == "unified";
      var bstyle = {
        paddingTop: 0,
        paddingBotton: 0
      };
      var lib_buttons = [];
      var selected_lib_button;
      var selected_bclass;
      selected_lib_button = this.state.selectedLibraryTab;
      selected_bclass = " selected-lib-tab-button"; // }

      if (!unified) {
        var _iterator3 = _createForOfIteratorHelper(this.resTypes),
            _step3;

        try {
          var _loop2 = function _loop2() {
            var rt = _step3.value;
            var cname = "lib-tab-button";

            if (rt == selected_lib_button) {
              cname += selected_bclass;
            }

            lib_buttons.push( /*#__PURE__*/_react["default"].createElement(_core.Button, {
              key: rt,
              icon: _this6.libIconDict[rt],
              className: cname,
              alignText: "left",
              style: {
                display: "flex"
              },
              small: true,
              minimal: true,
              onClick: function onClick() {
                _this6._changeLibTab(rt);
              }
            }, rt));
          };

          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            _loop2();
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      } else {
        var cname = "lib-tab-button";

        if (this.state.selectedTabId == "library") {
          cname += selected_bclass;
        }

        lib_buttons.push( /*#__PURE__*/_react["default"].createElement(_core.Button, {
          key: "all",
          icon: this.libIconDict["all"],
          className: cname,
          alignText: "left",
          small: true,
          minimal: true,
          onClick: function onClick() {
            _this6._changeLibTab("all");
          }
        }, "Library"));
      }

      var bclass = "context-tab-button-content";

      if (this.state.selectedTabId == "library") {
        bclass += " selected-tab-button";
      }

      var library_panel;
      library_panel = /*#__PURE__*/_react["default"].createElement("div", {
        id: "library-home-root"
      }, /*#__PURE__*/_react["default"].createElement(LibraryHomeAppPlus, _extends({}, this.state.library_panel_props, {
        library_style: window.library_style,
        controlled: true,
        am_selected: this.state.selectedTabId == "library",
        open_resources: this.state.open_resources,
        registerLibraryTabChanger: this._registerLibraryTabChanger,
        dark_theme: this.state.dark_theme,
        setTheme: this._setTheme,
        handleCreateViewer: this._handleCreateViewer,
        usable_width: this.state.usable_width,
        usable_height: this.state.usable_height
      }))); // }

      var mbot = unified ? 0 : 5;

      var ltab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "library",
        tabIndex: -1,
        key: "library",
        className: "context-tab",
        panel: library_panel
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: bclass,
        style: {
          display: "flex",
          flexDirection: "column"
        }
      }, window.library_style == "tabbed" && /*#__PURE__*/_react["default"].createElement(_core.Button, {
        minimal: true,
        alignText: "left",
        style: {
          display: "table-cell",
          overflow: "hidden"
        }
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "context-library-title"
      }, "Library")), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: "table-cell",
          flexDirection: "column",
          marginBottom: {
            mbot: mbot
          },
          textOverflow: "ellipsis",
          overflow: "hidden"
        }
      }, lib_buttons)));

      var all_tabs = [ltab];

      var _iterator4 = _createForOfIteratorHelper(this.state.tab_ids),
          _step4;

      try {
        var _loop3 = function _loop3() {
          var tab_id = _step4.value;
          var tab_entry = _this6.state.tab_panel_dict[tab_id];
          var bclass = "context-tab-button-content";

          if (_this6.state.selectedTabId == tab_id) {
            bclass += " selected-tab-button";
          }

          var visible_title = tab_entry.title;
          var wrapped_panel = void 0;

          if (tab_entry.panel == "spinner") {
            wrapped_panel = spinner_panel;
          } else {
            var TheClass = _this6.classDict[tab_entry.kind];

            var the_panel = /*#__PURE__*/_react["default"].createElement(TheClass, _extends({}, tab_entry.panel, {
              controlled: true,
              dark_theme: _this6.state.dark_theme // needed for error drawer and status
              ,
              handleCreateViewer: _this6._handleCreateViewer,
              setTheme: _this6._setTheme,
              am_selected: tab_id == _this6.state.selectedTabId,
              changeResourceName: function changeResourceName(new_name) {
                var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
                var change_title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

                _this6._changeResourceName(tab_id, new_name, change_title, callback);
              },
              changeResourceTitle: function changeResourceTitle(new_title) {
                return _this6._changeResourceTitle(tab_id, new_title);
              },
              changeResourceProps: function changeResourceProps(new_props) {
                var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                _this6._changeResourceProps(tab_id, new_props, callback);
              },
              updatePanel: function updatePanel(new_panel) {
                var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

                _this6._updatePanel(tab_id, new_panel, callback);
              },
              goToModule: _this6._goToModule,
              registerLineSetter: function registerLineSetter(rfunc) {
                return _this6._registerLineSetter(tab_id, rfunc);
              },
              refreshTab: function refreshTab() {
                _this6._refreshTab(tab_id);
              },
              closeTab: function closeTab() {
                _this6._closeTab(tab_id);
              },
              tsocket: tab_entry.panel.tsocket,
              usable_width: _this6.state.usable_width,
              usable_height: _this6.state.usable_height
            }));

            wrapped_panel = /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement("div", {
              id: tab_id + "-holder",
              className: _this6.panelRootDict[_this6.state.tab_panel_dict[tab_id].kind]
            }, the_panel));
          }

          var icon_style = {
            verticalAlign: "middle",
            paddingLeft: 4
          };

          if (tab_id == _this6.state.dragging_over) {
            bclass += " hovering";
          }

          if (tab_id == _this6.state.currently_dragging) {
            bclass += " currently-dragging";
          }

          var new_tab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
            id: tab_id,
            draggable: "true",
            onDragStart: function onDragStart(e) {
              _this6._onDragStart(e, tab_id);
            },
            onDrop: function onDrop(e) {
              _this6._onDrop(e, tab_id);
            },
            onDragEnter: function onDragEnter(e) {
              _this6._onDragEnter(e, tab_id);
            },
            onDragOver: function onDragOver(e) {
              _this6._onDragOver(e, tab_id);
            },
            onDragLeave: function onDragLeave(e) {
              _this6._onDragLeave(e, tab_id);
            },
            onDragEnd: function onDragEnd(e) {
              _this6._onDragEnd(e);
            },
            tabIndex: -1,
            key: tab_id,
            panelClassName: "context-tab",
            title: "",
            panel: wrapped_panel
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: bclass + " open-resource-tab",
            style: {
              display: "flex",
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between"
            }
          }, /*#__PURE__*/_react["default"].createElement("div", {
            style: {
              display: "table-cell",
              flexDirection: "row",
              justifyContent: "flex-start",
              textOverflow: "ellipsis",
              overflow: "hidden"
            }
          }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
            icon: _this6.iconDict[tab_entry.kind],
            style: {
              verticalAlign: "middle",
              marginRight: 5
            },
            iconSize: 16,
            tabIndex: -1
          }), /*#__PURE__*/_react["default"].createElement("span", null, visible_title)), /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
            icon: "reset",
            style: icon_style,
            iconSize: 13,
            className: "context-close-button",
            tabIndex: -1,
            onClick: function onClick() {
              _this6._refreshTab(tab_id);
            }
          }), /*#__PURE__*/_react["default"].createElement(_core.Icon, {
            icon: "delete",
            style: icon_style,
            iconSize: 13,
            className: "context-close-button",
            tabIndex: -1,
            onClick: function onClick() {
              _this6._closeTab(tab_id);
            }
          }))));

          all_tabs.push(new_tab);
        };

        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          _loop3();
        } // The purpose of the dummy tab is to make it possible to drag a tab to the bottom of the list

      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }

      bclass = "context-tab-button-content";

      if (this.state.dragging_over == "dummy") {
        bclass += " hovering";
      }

      var dummy_tab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: "dummy",
        draggable: "false",
        disabled: true,
        onDrop: function onDrop(e) {
          _this6._onDrop(e, "dummy");
        },
        onDragEnter: function onDragEnter(e) {
          _this6._onDragEnter(e, "dummy");
        },
        onDragOver: function onDragOver(e) {
          _this6._onDragOver(e, "dummy");
        },
        onDragLeave: function onDragLeave(e) {
          _this6._onDragLeave(e, "dummy");
        },
        tabIndex: -1,
        key: "dummy",
        panelClassName: "context-tab",
        title: "",
        panel: null
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: bclass,
        style: {
          height: 30,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between"
        }
      }));

      all_tabs.push(dummy_tab);
      var outer_class = "pane-holder ";

      if (this.state.dark_theme) {
        outer_class = "".concat(outer_class, " bp4-dark");
      } else {
        outer_class = "".concat(outer_class, " light-theme");
      }

      var outer_style = {
        width: "100%",
        height: this.state.usable_height,
        paddingLeft: 0
      };
      var tlclass = "context-tab-list";

      if (unified) {
        tlclass += " unified";
      }

      var pane_closed = this.state.tabWidth <= MIN_CONTEXT_WIDTH;

      if (pane_closed) {
        tlclass += " context-pane-closed";
      }

      var self = this;
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        dark_theme: this.state.dark_theme,
        setTheme: this._setTheme,
        selected: null,
        show_api_links: false,
        extra_text: window.database_type == "Local" ? "" : window.database_type,
        page_id: window.context_id,
        user_name: window.username
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: outer_class,
        style: outer_style,
        ref: this.top_ref
      }, /*#__PURE__*/_react["default"].createElement("div", {
        id: "context-container",
        style: outer_style
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        icon: /*#__PURE__*/_react["default"].createElement(_core.Icon, {
          icon: pane_closed ? "drawer-left-filled" : "drawer-right-filled",
          iconSize: 18
        }),
        style: {
          paddingLeft: 4,
          paddingRight: 0,
          position: "absolute",
          left: this.state.tabWidth - 30,
          bottom: 10,
          zIndex: 100
        },
        minimal: true,
        className: "context-close-button",
        small: true,
        tabIndex: -1,
        onClick: function onClick() {
          self._togglePane(pane_closed);
        }
      }), /*#__PURE__*/_react["default"].createElement(_resizing_layouts.DragHandle, {
        position_dict: {
          position: "absolute",
          left: this.state.tabWidth - 5
        },
        onDrag: this._handleTabResize,
        dragStart: this._handleTabResizeStart,
        dragEnd: this._handleTabResizeEnd,
        direction: "x",
        barHeight: "100%",
        useThinBar: true
      }), /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
        id: "context-tabs",
        selectedTabId: this.state.selectedTabId,
        className: tlclass,
        vertical: true,
        onChange: this._handleTabSelect
      }, all_tabs))), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
        global: true,
        bindings: this.key_bindings
      }));
    }
  }]);

  return ContextApp;
}(_react["default"].Component);

_context_main();