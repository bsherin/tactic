"use strict";

require("../tactic_css/tactic.scss");
require("../tactic_css/context.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/library_home.scss");
require("../tactic_css/tile_creator.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _core = require("@blueprintjs/core");
var _tactic_socket = require("./tactic_socket");
var _TacticOmnibar = require("./TacticOmnibar");
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
var _utilities_react2 = require("./utilities_react");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } // noinspection XmlDeprecatedElement
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
var resTypes = ["all", "collections", "projects", "tiles", "lists", "code"];
var iconDict = {
  "module-viewer": "application",
  "code-viewer": "code",
  "list-viewer": "list",
  "creator-viewer": "application",
  "main-viewer": "projects",
  "notebook-viewer": "projects"
};
var libIconDict = {
  all: _blueprint_mdata_fields.icon_dict["all"],
  collections: _blueprint_mdata_fields.icon_dict["collection"],
  projects: _blueprint_mdata_fields.icon_dict["project"],
  tiles: _blueprint_mdata_fields.icon_dict["tile"],
  lists: _blueprint_mdata_fields.icon_dict["list"],
  code: _blueprint_mdata_fields.icon_dict["code"]
};
var propDict = {
  "module-viewer": _module_viewer_react.module_viewer_props,
  "code-viewer": _code_viewer_react.code_viewer_props,
  "list-viewer": _list_viewer_react.list_viewer_props,
  "creator-viewer": _tile_creator_react.creator_props,
  "main-viewer": _main_app.main_props,
  "notebook-viewer": _notebook_app.notebook_props
};
var panelRootDict = {
  "module-viewer": "root",
  "code-viewer": "root",
  "list-viewer": "root",
  "creator-viewer": "creator-root",
  "main-viewer": "main-root",
  "notebook-viewer": "main-root"
};
window.context_id = (0, _utilities_react.guid)();
window.main_id = window.context_id;
var tsocket = new _tactic_socket.TacticSocket("main", 5000, window.context_id);
var LibraryHomeAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(_library_home_react.LibraryHomeApp));
var ListViewerAppPlus = (0, _toaster.withStatus)(_list_viewer_react.ListViewerApp);
var CodeViewerAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(_code_viewer_react.CodeViewerApp));
var ModuleViewerAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(_module_viewer_react.ModuleViewerApp));
var CreatorAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(_tile_creator_react.CreatorApp));
var MainAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(_main_app.MainApp));
var NotebookAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(_notebook_app.NotebookApp));
var classDict = {
  "module-viewer": ModuleViewerAppPlus,
  "code-viewer": CodeViewerAppPlus,
  "list-viewer": ListViewerAppPlus,
  "creator-viewer": CreatorAppPlus,
  "main-viewer": MainAppPlus,
  "notebook-viewer": NotebookAppPlus
};
function _context_main() {
  var ContextAppPlus = ContextApp;
  var domContainer = document.querySelector('#context-root');
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(ContextAppPlus, {
    initial_theme: window.theme,
    tsocket: tsocket
  }), domContainer);
}
function ContextApp(props) {
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    didInit = _useState2[0],
    setDidInit = _useState2[1];
  var _useStateAndRef = (0, _utilities_react2.useStateAndRef)("library"),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    selectedTabId = _useStateAndRef2[0],
    setSelectedTabId = _useStateAndRef2[1],
    selectedTabIdRef = _useStateAndRef2[2];
  var _useState3 = (0, _react.useState)(150),
    _useState4 = _slicedToArray(_useState3, 2),
    saved_width = _useState4[0],
    set_saved_width = _useState4[1];
  var _useStateAndRef3 = (0, _utilities_react2.useStateAndRef)({}),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    tab_panel_dict = _useStateAndRef4[0],
    set_tab_panel_dict = _useStateAndRef4[1],
    tab_panel_dict_ref = _useStateAndRef4[2];
  var library_omni_function = (0, _react.useRef)(null);
  var _useStateAndRef5 = (0, _utilities_react2.useStateAndRef)([]),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    tab_ids = _useStateAndRef6[0],
    set_tab_ids = _useStateAndRef6[1],
    tab_ids_ref = _useStateAndRef6[2];
  var _useState5 = (0, _react.useState)({}),
    _useState6 = _slicedToArray(_useState5, 2),
    open_resources = _useState6[0],
    set_open_resources = _useState6[1];
  var _useState7 = (0, _react.useState)({}),
    _useState8 = _slicedToArray(_useState7, 2),
    dirty_methods = _useState8[0],
    set_dirty_methods = _useState8[1];
  var _useState9 = (0, _react.useState)(function () {
      return props.initial_theme === "dark";
    }),
    _useState10 = _slicedToArray(_useState9, 2),
    dark_theme = _useState10[0],
    set_dark_theme = _useState10[1];
  var _useState11 = (0, _react.useState)([]),
    _useState12 = _slicedToArray(_useState11, 2),
    theme_setters = _useState12[0],
    set_theme_setters = _useState12[1];
  var _useState13 = (0, _react.useState)(null),
    _useState14 = _slicedToArray(_useState13, 2),
    lastSelectedTabId = _useState14[0],
    setLastSelectedTabId = _useState14[1];
  var _useState15 = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
    }),
    _useState16 = _slicedToArray(_useState15, 2),
    usable_width = _useState16[0],
    set_usable_width = _useState16[1];
  var _useState17 = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
    }),
    _useState18 = _slicedToArray(_useState17, 2),
    usable_height = _useState18[0],
    set_usable_height = _useState18[1];
  var _useState19 = (0, _react.useState)(150),
    _useState20 = _slicedToArray(_useState19, 2),
    tabWidth = _useState20[0],
    setTabWidth = _useState20[1];
  var _useState21 = (0, _react.useState)(false),
    _useState22 = _slicedToArray(_useState21, 2),
    show_repository = _useState22[0],
    set_show_repository = _useState22[1];
  var _useState23 = (0, _react.useState)(false),
    _useState24 = _slicedToArray(_useState23, 2),
    dragging_over = _useState24[0],
    set_dragging_over = _useState24[1];
  var _useState25 = (0, _react.useState)(false),
    _useState26 = _slicedToArray(_useState25, 2),
    currently_dragging = _useState26[0],
    set_currently_dragging = _useState26[1];
  var _useState27 = (0, _react.useState)(false),
    _useState28 = _slicedToArray(_useState27, 2),
    showOmnibar = _useState28[0],
    setShowOmnibar = _useState28[1];
  var top_ref = (0, _react.useRef)(null);
  var key_bindings = [[["tab"], _goToNextPane], [["shift+tab"], _goToPreviousPane], [["ctrl+space"], _showOmnibar], [["ctrl+w"], function () {
    _closeTab(selectedTabIdRef.current);
  }]];
  var pushCallback = (0, _utilities_react2.useCallbackStack)("context");
  (0, _react.useEffect)(function () {
    // for unmount
    initSocket();
    return function () {
      tsocket.disconnect();
    };
  }, []);
  (0, _react.useEffect)(function () {
    // for mount
    window.dark_theme = dark_theme;
    window.addEventListener("resize", function () {
      return _update_window_dimensions(null);
    });
    window.addEventListener("beforeunload", function (e) {
      e.preventDefault();
      e.returnValue = 'Are you sure you want to close? All changes will be lost.';
    });
    _update_window_dimensions(null);
    var tab_list_elem = document.querySelector("#context-container .context-tab-list > .bp4-tab-list");
    var resizeObserver = new ResizeObserver(function (entries) {
      _update_window_dimensions(null);
    });
    if (tab_list_elem) {
      resizeObserver.observe(tab_list_elem);
    }
  }, []);
  function _setTheme(local_dark_theme) {
    window.theme = local_dark_theme ? "dark" : "light";
    set_dark_theme(local_dark_theme);
  }
  function get_tab_list_elem() {
    return document.querySelector("#context-container .context-tab-list > .bp4-tab-list");
  }
  function _togglePane(pane_closed) {
    var w = pane_closed ? saved_width : MIN_CONTEXT_WIDTH;
    var tab_elem = get_tab_list_elem();
    tab_elem.setAttribute("style", "width:".concat(w, "px"));
  }
  function _handleTabResize(e, ui, lastX, lastY, dx, dy) {
    var tab_elem = get_tab_list_elem();
    var w = lastX > window.innerWidth / 2 ? window.innerWidth / 2 : lastX;
    w = w <= MIN_CONTEXT_WIDTH ? MIN_CONTEXT_WIDTH : w;
    tab_elem.setAttribute("style", "width:".concat(w, "px"));
  }
  function _handleTabResizeStart(e, ui, lastX, lastY, dx, dy) {
    var new_width = Math.max(tabWidth, MIN_CONTEXT_SAVED_WIDTH);
    if (new_width != saved_width) {
      set_saved_width(new_width);
    }
  }
  function _handleTabResizeEnd(e, ui, lastX, lastY, dx, dy) {
    var tab_elem = get_tab_list_elem();
    if (tab_elem.offsetWidth > 45) {
      var new_width = Math.max(tab_elem.offsetWidth, MIN_CONTEXT_SAVED_WIDTH);
      if (new_width != saved_width) {
        set_saved_width(new_width);
      }
    }
  }
  function _update_window_dimensions() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var tab_list_elem = get_tab_list_elem();
    var uwidth;
    var uheight;
    var tabWidth;
    if (top_ref && top_ref.current) {
      uheight = window.innerHeight - top_ref.current.offsetTop;
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
    set_usable_height(uheight);
    set_usable_width(uwidth);
    setTabWidth(tabWidth);
    pushCallback(callback);
  }
  function _registerThemeSetter(setter) {
    set_theme_setters([].concat(_toConsumableArray(theme_setters), [setter]));
  }
  function _registerDirtyMethod(tab_id, dirty_method) {
    var new_dirty_methods = _objectSpread({}, dirty_methods);
    new_dirty_methods[tab_id] = dirty_method;
    set_dirty_methods(new_dirty_methods);
  }
  function initSocket() {
    props.tsocket.attachListener("window-open", function (data) {
      window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data["the_id"]));
    });
    props.tsocket.attachListener('close-user-windows', function (data) {
      if (!(data["originator"] === window.context_id)) {
        window.close();
      }
    });
    props.tsocket.attachListener("doFlash", function (data) {
      (0, _toaster.doFlash)(data);
    });
    props.tsocket.attachListener("doFlashUser", function (data) {
      (0, _toaster.doFlash)(data);
    });
    props.tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, window.context_id);
    });
    props.tsocket.attachListener("create-viewer", _handleCreateViewer);
  }
  function _refreshTab(the_id) {
    if (the_id == "library") {
      return;
    }
    if (!(the_id in dirty_methods) || dirty_methods[the_id]()) {
      var title = tab_panel_dict_ref.current[the_id].title;
      var confirm_text = "Are you sure that you want to reload the tab ".concat(title, "? Changes will be lost");
      (0, _modal_react.showConfirmDialogReact)("reload the tab ".concat(title), confirm_text, "do nothing", "reload", do_the_refresh);
    } else {
      do_the_refresh();
    }
    function do_the_refresh() {
      var old_tab_panel = _objectSpread({}, tab_panel_dict_ref.current[the_id]);
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
        _registerDirtyMethod(the_id, dmethod);
      };
      _updatePanel(the_id, {
        panel: "spinner"
      }, function () {
        (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + the_view, {
          context_id: window.context_id,
          resource_name: resource_name
        }).then(function (data) {
          var new_panel = propDict[data.kind](data, drmethod, function (new_panel) {
            _updatePanel(the_id, {
              panel: new_panel,
              kind: data.kind
            });
          });
        })["catch"](_toaster.doFlash);
      });
    }
  }
  function _closeATab(the_id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var idx = tab_ids_ref.current.indexOf(the_id);
    var copied_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
    var copied_tab_ids = _toConsumableArray(tab_ids_ref.current);
    var copied_dirty_methods = _objectSpread({}, dirty_methods);
    if (idx > -1) {
      copied_tab_ids.splice(idx, 1);
      delete copied_tab_panel_dict[the_id];
      delete copied_dirty_methods[the_id];
    }
    set_tab_panel_dict(copied_tab_panel_dict);
    set_tab_ids(copied_tab_ids);
    set_dirty_methods(copied_dirty_methods);
    set_tab_panel_dict(copied_tab_panel_dict);
    pushCallback(function () {
      if (the_id == selectedTabIdRef.current) {
        var newSelectedId;
        if (lastSelectedTabId && copied_tab_ids.includes(lastSelectedTabId)) {
          newSelectedId = lastSelectedTabId;
        } else {
          newSelectedId = "library";
        }
        setSelectedTabId(newSelectedId);
        setLastSelectedTabId("library");
      } else {
        setSelectedTabId(selectedTabId);
        if (lastSelectedTabId == the_id) {
          setLastSelectedTabId("library");
        }
      }
      pushCallback(function () {
        _updateOpenResources(function () {
          return _update_window_dimensions(callback);
        });
      });
    });
  }
  function _closeTab(the_id) {
    if (the_id == "library") {
      return;
    }
    if (!(the_id in dirty_methods) || dirty_methods[the_id]()) {
      var title = tab_panel_dict_ref.current[the_id].title;
      var confirm_text = "Are you sure that you want to close the tab ".concat(title, "? Changes will be lost");
      (0, _modal_react.showConfirmDialogReact)("close the tab ".concat(title, "\""), confirm_text, "do nothing", "close", function () {
        _closeATab(the_id);
      });
    } else {
      _closeATab(the_id);
    }
  }
  function _addPanel(new_id, viewer_kind, res_type, title, new_panel) {
    var callback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var new_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
    new_tab_panel_dict[new_id] = {
      kind: viewer_kind,
      res_type: res_type,
      title: title,
      panel: new_panel,
      omni_function: null
    };
    set_tab_panel_dict(new_tab_panel_dict);
    var new_tab_ids = [].concat(_toConsumableArray(tab_ids_ref.current), [new_id]);
    set_tab_ids(new_tab_ids);
    setLastSelectedTabId(selectedTabIdRef.current), setSelectedTabId(new_id);
    pushCallback(function () {
      _updateOpenResources(callback);
    });
  }
  function _updatePanel(the_id, new_panel) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var new_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
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
    set_tab_panel_dict(new_tab_panel_dict);
    pushCallback(function () {
      _updateOpenResources(function () {
        return _update_window_dimensions(callback);
      });
    });
  }
  function _changeResourceName(the_id, new_name) {
    var change_title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var new_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
    if (change_title) {
      new_tab_panel_dict[the_id].title = new_name;
    }
    new_tab_panel_dict[the_id].panel.resource_name = new_name;
    set_tab_panel_dict(new_tab_panel_dict);
    pushCallback(function () {
      _updateOpenResources(function () {
        return _update_window_dimensions(callback);
      });
    });
  }
  function _changeResourceTitle(the_id, new_title) {
    var new_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
    new_tab_panel_dict[the_id].title = new_title;
    set_tab_panel_dict(new_tab_panel_dict);
    pushCallback(function () {
      _updateOpenResources(function () {
        return _update_window_dimensions(null);
      });
    });
  }
  function _changeResourceProps(the_id, new_props) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var new_tab_panel_dict = _objectSpread({}, tab_panel_dict_ref.current);
    for (var prop in new_props) {
      new_tab_panel_dict[the_id].panel[prop] = new_props[prop];
    }
    set_tab_panel_dict(new_tab_panel_dict);
    pushCallback(function () {
      _updateOpenResources(function () {
        return _update_window_dimensions(null);
      });
    });
  }
  function _getResourceId(res_name, res_type) {
    var _iterator = _createForOfIteratorHelper(tab_ids_ref.current),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var the_id = _step.value;
        var the_panel = tab_panel_dict_ref.current[the_id];
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
  function _showOmnibar() {
    setShowOmnibar(true);
  }
  function _closeOmnibar() {
    setShowOmnibar(false);
  }
  function _registerOmniFunction(tab_id, the_function) {
    if (tab_id == "library") {
      library_omni_function.current = the_function;
    } else {
      _updatePanel(tab_id, {
        omni_function: the_function
      });
    }
  }
  function _handleCreateViewer(data) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var existing_id = _getResourceId(data.resource_name, data.res_type);
    if (existing_id != -1) {
      setSelectedTabId(existing_id);
      pushCallback(callback);
      return;
    }
    var new_id = (0, _utilities_react.guid)();
    var drmethod = function drmethod(dmethod) {
      _registerDirtyMethod(new_id, dmethod);
    };
    _addPanel(new_id, data.kind, data.res_type, data.resource_name, "spinner", function () {
      var new_panel = propDict[data.kind](data, drmethod, function (new_panel) {
        _updatePanel(new_id, {
          panel: new_panel
        }, callback);
      }, function (register_func) {
        return _registerOmniFunction(new_id, register_func);
      });
    });
  }
  function _goToNextPane(e) {
    var newId;
    if (selectedTabIdRef.current == "library") {
      newId = tab_ids_ref.current[0];
    } else {
      var tabIndex = tab_ids_ref.current.indexOf(selectedTabIdRef.current) + 1;
      newId = tabIndex === tab_ids_ref.current.length ? "library" : tab_ids_ref.current[tabIndex];
    }
    _handleTabSelect(newId, selectedTabIdRef.current);
    e.preventDefault();
  }
  function _goToPreviousPane(e) {
    var newId;
    if (selectedTabIdRef.current == "library") {
      newId = tab_ids_ref.current.at(-1);
    } else {
      var tabIndex = tab_ids_ref.current.indexOf(selectedTabIdRef.current) - 1;
      newId = tabIndex == -1 ? "library" : tab_ids_ref.current[tabIndex];
    }
    _handleTabSelect(newId, selectedTabIdRef.current);
    e.preventDefault();
  }
  function _handleTabSelect(newTabId, prevTabId) {
    var event = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    setSelectedTabId(newTabId);
    setLastSelectedTabId(prevTabId);
    pushCallback(function () {
      return _update_window_dimensions(callback);
    });
  }
  function _goToModule(module_name, line_number) {
    var _loop = function _loop() {
      var pdict = tab_panel_dict_ref.current[tab_id];
      if (pdict.kind == "creator-viewer" && pdict.panel.resource_name == module_name) {
        _handleTabSelect(tab_id, selectedTabIdRef.current, null, function () {
          if ("line_setter" in pdict) {
            pdict.line_setter(line_number);
          }
        });
        return {
          v: void 0
        };
      }
    };
    for (var tab_id in tab_panel_dict_ref.current) {
      var _ret = _loop();
      if (_typeof(_ret) === "object") return _ret.v;
    }
    var the_view = (0, _library_pane.view_views)()["tile"];
    var re = new RegExp("/$");
    the_view = the_view.replace(re, "_in_context");
    (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + the_view, {
      context_id: window.context_id,
      resource_name: module_name
    }).then(function (data) {
      var new_id = "".concat(data.kind, ": ").concat(data.resource_name);
      var drmethod = function drmethod(dmethod) {
        _registerDirtyMethod(new_id, dmethod);
      };
      _addPanel(new_id, data.kind, data.res_type, data.resource_name, "spinner", function () {
        var new_panel = propDict[data.kind](data, drmethod, function (new_panel) {
          _updatePanel(new_id, {
            panel: new_panel
          }, function () {
            var pdict = tab_panel_dict_ref.current[new_id];
          });
        }, function (register_func) {
          return _registerOmniFunction(new_id, register_func);
        });
      });
    })["catch"](_toaster.doFlash);
    return;
  }
  function _registerLineSetter(tab_id, rfunc) {
    _updatePanel(tab_id, {
      line_setter: rfunc
    });
  }
  function _onDragStart(event, tab_id) {
    set_currently_dragging(tab_id);
    event.stopPropagation();
  }
  function _onDragEnd(event) {
    set_dragging_over(null);
    set_currently_dragging(null);
    event.stopPropagation();
    event.preventDefault();
  }
  function _nextTab(tab_id) {
    var tidx = tab_ids_ref.current.indexOf(tab_id);
    if (tidx == -1) return null;
    if (tidx == tab_ids_ref.current.length - 1) return "dummy";
    return tab_ids_ref.current[tidx + 1];
  }
  function _onDrop(event, target_id) {
    if (currently_dragging == null || currently_dragging == target_id) return;
    var current_index = tab_ids_ref.current.indexOf(currently_dragging);
    var new_tab_ids = _toConsumableArray(tab_ids_ref.current);
    new_tab_ids.splice(current_index, 1);
    if (target_id == "dummy") {
      new_tab_ids.push(currently_dragging);
    } else {
      var target_index = new_tab_ids.indexOf(target_id);
      new_tab_ids.splice(target_index, 0, currently_dragging);
    }
    set_tab_ids(new_tab_ids);
    set_dragging_over(null);
    event.stopPropagation();
  }
  function _onDragOver(event, target_id) {
    // setState({"dragging_over": target_id});
    event.stopPropagation();
    event.preventDefault();
  }
  function _onDragEnter(event, target_id) {
    if (target_id == currently_dragging || target_id == _nextTab(currently_dragging)) {
      set_dragging_over(null);
    } else {
      set_dragging_over(target_id);
    }
    event.stopPropagation();
    event.preventDefault();
  }
  function _onDragLeave(event, target_id) {
    // this.setState({"dragging_over": null});
    event.stopPropagation();
    event.preventDefault();
  }
  function _getOpenResources() {
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
    for (var the_id in tab_panel_dict_ref.current) {
      var entry = tab_panel_dict_ref.current[the_id];
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
  function _updateOpenResources() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    set_open_resources(_getOpenResources());
    pushCallback(callback);
  }
  function _contextOmniItems() {
    if (tab_ids_ref.current.length == 0) return [];
    var omni_funcs = [["Go To Next Panel", "context", _goToNextPane, "arrow-right"], ["Go To Previous Panel", "context", _goToPreviousPane, "arrow-left"]];
    if (selectedTabIdRef.current != "library") {
      omni_funcs = omni_funcs.concat([["Close Current Panel", "context", function () {
        _closeTab(selectedTabIdRef.current);
      }, "delete"], ["Refresh Current Panel", "context", function () {
        _refreshTab(selectedTabIdRef.current);
      }, "reset"]]);
    }
    var omni_items = [];
    var _iterator3 = _createForOfIteratorHelper(omni_funcs),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var item = _step3.value;
        omni_items.push({
          category: item[1],
          display_text: item[0],
          search_text: item[0],
          icon_name: item[3],
          the_function: item[2]
        });
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return omni_items;
  }

  // Create the library tab
  var bclass = "context-tab-button-content";
  if (selectedTabIdRef.current == "library") {
    bclass += " selected-tab-button";
  }
  var library_id = (0, _utilities_react.guid)();
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, library_id);
  var library_panel = /*#__PURE__*/_react["default"].createElement("div", {
    id: "library-home-root"
  }, /*#__PURE__*/_react["default"].createElement(LibraryHomeAppPlus, {
    library_id: library_id,
    tsocket: tsocket,
    library_style: window.library_style,
    controlled: true,
    am_selected: selectedTabIdRef.current == "library",
    open_resources: open_resources,
    dark_theme: dark_theme,
    setTheme: _setTheme,
    registerOmniFunction: function registerOmniFunction(register_func) {
      return _registerOmniFunction("library", register_func);
    },
    handleCreateViewer: _handleCreateViewer,
    usable_width: usable_width,
    usable_height: usable_height
  }));
  var ltab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "library",
    tabIndex: -1,
    key: "library",
    style: {
      paddingLeft: 10,
      marginBottom: 0
    },
    panelClassName: "context-tab",
    title: "",
    panel: library_panel
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
    icon: libIconDict["all"],
    style: {
      verticalAlign: "middle",
      marginRight: 5
    },
    iconSize: 16,
    tabIndex: -1
  }), /*#__PURE__*/_react["default"].createElement("span", null, "Library"))));
  var all_tabs = [ltab];
  var _iterator4 = _createForOfIteratorHelper(tab_ids_ref.current),
    _step4;
  try {
    var _loop2 = function _loop2() {
      var tab_id = _step4.value;
      var tab_entry = tab_panel_dict_ref.current[tab_id];
      var bclass = "context-tab-button-content";
      if (selectedTabIdRef.current == tab_id) {
        bclass += " selected-tab-button";
      }
      var visible_title = tab_entry.title;
      var wrapped_panel;
      if (tab_entry.panel == "spinner") {
        wrapped_panel = spinner_panel;
      } else {
        var TheClass = classDict[tab_entry.kind];
        var the_panel = /*#__PURE__*/_react["default"].createElement(TheClass, _extends({}, tab_entry.panel, {
          controlled: true,
          dark_theme: dark_theme // needed for error drawer and status
          ,
          handleCreateViewer: _handleCreateViewer,
          setTheme: _setTheme,
          am_selected: tab_id == selectedTabIdRef.current,
          changeResourceName: function changeResourceName(new_name) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            var change_title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
            _changeResourceName(tab_id, new_name, change_title, callback);
          },
          changeResourceTitle: function changeResourceTitle(new_title) {
            return _changeResourceTitle(tab_id, new_title);
          },
          changeResourceProps: function changeResourceProps(new_props) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            _changeResourceProps(tab_id, new_props, callback);
          },
          updatePanel: function updatePanel(new_panel) {
            var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
            _updatePanel(tab_id, new_panel, callback);
          },
          goToModule: _goToModule,
          registerLineSetter: function registerLineSetter(rfunc) {
            return _registerLineSetter(tab_id, rfunc);
          },
          refreshTab: function refreshTab() {
            _refreshTab(tab_id);
          },
          closeTab: function closeTab() {
            _closeTab(tab_id);
          },
          tsocket: tab_entry.panel.tsocket,
          usable_width: usable_width,
          usable_height: usable_height
        }));
        wrapped_panel = /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement("div", {
          id: tab_id + "-holder",
          className: panelRootDict[tab_panel_dict_ref.current[tab_id].kind]
        }, the_panel));
      }
      var icon_style = {
        verticalAlign: "middle",
        paddingLeft: 4
      };
      if (tab_id == dragging_over) {
        bclass += " hovering";
      }
      if (tab_id == currently_dragging) {
        bclass += " currently-dragging";
      }
      var new_tab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
        id: tab_id,
        draggable: "true",
        onDragStart: function onDragStart(e) {
          _onDragStart(e, tab_id);
        },
        onDrop: function onDrop(e) {
          _onDrop(e, tab_id);
        },
        onDragEnter: function onDragEnter(e) {
          _onDragEnter(e, tab_id);
        },
        onDragOver: function onDragOver(e) {
          _onDragOver(e, tab_id);
        },
        onDragLeave: function onDragLeave(e) {
          _onDragLeave(e, tab_id);
        },
        onDragEnd: function onDragEnd(e) {
          _onDragEnd(e);
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
        icon: iconDict[tab_entry.kind],
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
          _refreshTab(tab_id);
        }
      }), /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "delete",
        style: icon_style,
        iconSize: 13,
        className: "context-close-button",
        tabIndex: -1,
        onClick: function onClick() {
          _closeTab(tab_id);
        }
      }))));
      all_tabs.push(new_tab);
    };
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      _loop2();
    }

    // The purpose of the dummy tab is to make it possible to drag a tab to the bottom of the list
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  bclass = "context-tab-button-content";
  if (dragging_over == "dummy") {
    bclass += " hovering";
  }
  var dummy_tab = /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "dummy",
    draggable: "false",
    disabled: true,
    onDrop: function onDrop(e) {
      _onDrop(e, "dummy");
    },
    onDragEnter: function onDragEnter(e) {
      _onDragEnter(e, "dummy");
    },
    onDragOver: function onDragOver(e) {
      _onDragOver(e, "dummy");
    },
    onDragLeave: function onDragLeave(e) {
      _onDragLeave(e, "dummy");
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
  if (dark_theme) {
    outer_class = "".concat(outer_class, " bp4-dark");
  } else {
    outer_class = "".concat(outer_class, " light-theme");
  }
  var outer_style = {
    width: "100%",
    height: usable_height,
    paddingLeft: 0
  };
  var tlclass = "context-tab-list";
  var pane_closed = tabWidth <= MIN_CONTEXT_WIDTH;
  if (pane_closed) {
    tlclass += " context-pane-closed";
  }
  var sid = selectedTabIdRef.current;
  var omniGetter;
  if (sid && sid in tab_panel_dict_ref.current) {
    var the_dict = tab_panel_dict_ref.current[sid];
    if ("omni_function" in the_dict) {
      omniGetter = the_dict.omni_function;
    } else {
      omniGetter = function omniGetter() {
        return [];
      };
    }
  } else if (sid == "library") {
    omniGetter = library_omni_function.current;
  } else {
    omniGetter = function omniGetter() {
      return [];
    }; // Should never get here
  }

  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    dark_theme: dark_theme,
    setTheme: _setTheme,
    selected: null,
    show_api_links: false,
    extra_text: window.database_type == "Local" ? "" : window.database_type,
    page_id: window.context_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    style: outer_style,
    ref: top_ref
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
      left: tabWidth - 30,
      bottom: 10,
      zIndex: 100
    },
    minimal: true,
    className: "context-close-button",
    small: true,
    tabIndex: -1,
    onClick: function onClick() {
      _togglePane(pane_closed);
    }
  }), /*#__PURE__*/_react["default"].createElement(_resizing_layouts.DragHandle, {
    position_dict: {
      position: "absolute",
      left: tabWidth - 5
    },
    onDrag: _handleTabResize,
    dragStart: _handleTabResizeStart,
    dragEnd: _handleTabResizeEnd,
    direction: "x",
    barHeight: "100%",
    useThinBar: true
  }), /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
    id: "context-tabs",
    selectedTabId: selectedTabIdRef.current,
    className: tlclass,
    vertical: true,
    onChange: _handleTabSelect
  }, all_tabs)), /*#__PURE__*/_react["default"].createElement(_TacticOmnibar.TacticOmnibar, {
    omniGetters: [omniGetter, _contextOmniItems],
    showOmnibar: showOmnibar,
    closeOmnibar: _closeOmnibar,
    is_authenticated: window.is_authenticated,
    dark_theme: dark_theme,
    setTheme: _setTheme
  })), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
    global: true,
    bindings: key_bindings
  }));
}
_context_main();