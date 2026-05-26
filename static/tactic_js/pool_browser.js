"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PoolBreadcrumbs = PoolBreadcrumbs;
exports.PoolBrowser = PoolBrowser;
require("../tactic_css/pool.scss");
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _utilities_react = require("./utilities_react");
var _combined_metadata = require("./combined_metadata");
var _pool_tree = require("./pool_tree");
var _pool_context_menu = require("./pool_context_menu");
var _resizing_allotment = require("./resizing_allotment");
var _communication_react = require("./communication_react");
var _sizing_tools = require("./sizing_tools");
var _settings = require("./settings");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function PoolBrowser(props) {
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)({
      name: "",
      tags: "",
      notes: "",
      updated: "",
      created: "",
      size: "",
      res_type: null
    }),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    set_selected_resource = _useStateAndRef2[1],
    selected_resource_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)("/mydisk"),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    setCurrentRootPath = _useStateAndRef4[1],
    currentRootPathRef = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    value = _useStateAndRef6[0],
    setValue = _useStateAndRef6[1],
    valueRef = _useStateAndRef6[2];
  var _useStateAndRef7 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef8 = _slicedToArray(_useStateAndRef7, 3),
    setSelectedNode = _useStateAndRef8[1],
    selectedNodeRef = _useStateAndRef8[2];
  var _useStateAndRef9 = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef0 = _slicedToArray(_useStateAndRef9, 3),
    multi_select_ref = _useStateAndRef0[2];
  var _useStateAndRef1 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef10 = _slicedToArray(_useStateAndRef1, 3),
    list_of_selected_ref = _useStateAndRef10[2];
  var _useState = (0, _react.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    setContextMenuItems = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    have_activated = _useState4[0],
    set_have_activated = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    showHidden = _useState6[0],
    setShowHidden = _useState6[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var treeRefreshFunc = (0, _react.useRef)(null);
  // Important note: The first mounting of the pool tree must happen after the pool pane
  // is first activated. Otherwise, I do GetPoolTree before everything is ready and I don't
  // get the callback for the post.

  (0, _react.useEffect)(function () {
    setCurrentRootPath(settingsContext.settings.workingDirectory);
  }, [settingsContext.settings.workingDirectory]);
  (0, _react.useEffect)(function () {
    if (props.am_selected && !have_activated) {
      set_have_activated(true);
    }
  }, [props.am_selected]);
  (0, _react.useEffect)(function () {
    if (selectedNodeRef.current) {
      set_selected_resource({
        name: (0, _pool_tree.getBasename)(value),
        tags: "",
        notes: "",
        updated: selectedNodeRef.current.updated,
        created: selectedNodeRef.current.created,
        size: String(selectedNodeRef.current.size),
        res_type: selectedNodeRef.current.isDirectory ? "poolDir" : "poolFile"
      });
    } else {
      set_selected_resource({
        name: "",
        tags: "",
        notes: "",
        updated: "",
        created: "",
        res_type: null
      });
    }
  }, [value]);
  function handleNodeClick(node) {
    setValue(node.fullpath);
    setSelectedNode(node);
    return true;
  }
  function setRoot() {
    var node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!node) {
      node = selectedNodeRef.current;
    }
    setCurrentRootPath(node.fullpath);
  }
  function setRootToBase() {
    setCurrentRootPath("/mydisk");
  }
  function registerTreeRefreshFunc(func) {
    treeRefreshFunc.current = func;
  }
  var fixed_data = {
    created: selected_resource_ref.current.created,
    updated: selected_resource_ref.current.updated,
    size: selected_resource_ref.current.size,
    path: valueRef.current
  };
  var right_pane = /*#__PURE__*/_react["default"].createElement(_combined_metadata.CombinedMetadata, {
    res_type: selected_resource_ref.current.res_type,
    res_name: selected_resource_ref.current.name,
    useFixedData: true,
    fixedData: fixed_data,
    elevation: 2,
    readOnly: true
  });
  var left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column resource-viewer-left-pane-holder top-padded",
    style: {
      maxHeight: "100%",
      position: "relative",
      overflow: "scroll"
    }
  }, (props.am_selected || have_activated) && /*#__PURE__*/_react["default"].createElement(_pool_tree.PoolContext.Provider, {
    value: {
      workingPath: null,
      setWorkingPath: function setWorkingPath() {}
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: {
      justifyContent: "space-between",
      marginBottom: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(PoolBreadcrumbs, {
    path: currentRootPathRef.current,
    setRoot: setRoot
  }), /*#__PURE__*/_react["default"].createElement(PoolHiddenSwitch, {
    showHidden: showHidden,
    setShowHidden: setShowHidden
  })), /*#__PURE__*/_react["default"].createElement(_pool_context_menu.PoolTreeWithContextMenu, {
    value: valueRef.current,
    setRoot: setRoot,
    currentRootPath: currentRootPathRef.current,
    selectedNode: selectedNodeRef.current,
    showHidden: showHidden,
    handleCreateViewer: props.handleCreateViewer,
    getOpenResources: props.getOpenResources,
    allow_import_and_download: true,
    select_type: "both",
    registerTreeRefreshFunc: registerTreeRefreshFunc,
    user_id: window.user_id,
    tsocket: props.tsocket,
    showSecondaryLabel: true,
    handleNodeClick: handleNodeClick
  }))));
  var outer_style = {
    width: "calc(100% - ".concat(_sizing_tools.ICON_BAR_WIDTH, "px)"),
    height: "100%",
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    position: "relative"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(_pool_context_menu.PoolMenubar, _extends({
    selected_resource: selected_resource_ref.current,
    value: valueRef.current,
    selectedNode: selectedNodeRef.current,
    connection_status: null,
    multi_select: multi_select_ref.current,
    list_of_selected: list_of_selected_ref.current,
    sendContextMenuItems: setContextMenuItems,
    setRootToBase: setRootToBase,
    setRoot: setRoot,
    getOpenResources: props.getOpenResources,
    refreshFunc: treeRefreshFunc.current,
    handleCreateViewer: props.handleCreateViewer
  }, props.errorDrawerFuncs, {
    controlled: props.controlled,
    tsocket: props.tsocket
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flex: "1 1 0",
      display: "flex",
      minHeight: 0,
      minWidth: 0,
      position: "relative"
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_allotment.HorizontalPanes, {
    outer_hp_style: {},
    show_handle: true,
    left_pane: left_pane,
    right_pane: right_pane,
    right_pane_overflow: "auto",
    initial_width_fraction: .75
  })));
}
exports.PoolBrowser = PoolBrowser = /*#__PURE__*/(0, _react.memo)(PoolBrowser);
function PoolBreadcrumb(props) {
  props = _objectSpread({
    crumbSize: "large"
  }, props);
  var iconSize = props.crumbSize == "small" ? 12 : 16;
  var theIcon = /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: props.icon,
    size: iconSize
  });
  var crumClassName = props.crumbSize == "small" ? "small-pool-breadcrumb" : "pool-breadcrumb";
  return /*#__PURE__*/_react["default"].createElement(_core.Breadcrumb, {
    className: crumClassName,
    key: props.path,
    icon: theIcon,
    onClick: props.onClick
  }, props.name);
}
function PoolHiddenSwitch(props) {
  function handleShowHiddenChange(event) {
    props.setShowHidden(event.target.checked);
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: "show hidden",
    size: "medium",
    checked: props.showHidden,
    onChange: handleShowHiddenChange
  });
}
var s3_prefix = "s3://tactic-user-storage/users";
function PoolBreadcrumbs(props) {
  props = _objectSpread({
    crumbSize: "large"
  }, props);
  function clickFunc(path) {
    return function () {
      props.setRoot({
        fullpath: path
      });
    };
  }
  function pathToCrumbs(path) {
    if (path === undefined || path === null) {
      return [];
    }
    var prefix = "";
    if (path.startsWith(s3_prefix)) {
      path = path.slice(s3_prefix.length);
      prefix = s3_prefix;
    }
    var crumbs = [];
    var parts = path.split("/");
    var new_path = prefix;
    var _iterator = _createForOfIteratorHelper(parts),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        if (item === "") {
          continue;
        }
        new_path += "/" + item;
        crumbs.push({
          name: item,
          icon: "folder-close",
          path: new_path,
          onClick: clickFunc(new_path)
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return crumbs;
  }
  function renderBreadcrumb(lprops) {
    return /*#__PURE__*/_react["default"].createElement(PoolBreadcrumb, _extends({}, lprops, {
      crumbSize: props.crumbSize
    }));
  }
  function setWorkingDirectory() {
    (0, _communication_react.postPromise)("host", "update_settings", {
      "workingDirectory": props.path
    }).then(function () {});
  }
  var crumbs = pathToCrumbs(props.path);
  var theClass = "pool-breadcrumbs";
  if (props.crumbSize == "small") {
    theClass = "pool-breadcrumbs-small";
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start"
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Breadcrumbs, {
    className: theClass,
    breadcrumbRenderer: renderBreadcrumb,
    items: crumbs
  }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    variant: "minimal",
    text: "Set Default",
    textClassName: "pool-breadcrumbs-button-text bp6-breadcrumb",
    onClick: setWorkingDirectory,
    size: "small"
  }));
}