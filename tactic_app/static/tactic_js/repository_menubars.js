"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepositoryCodeMenubar = RepositoryCodeMenubar;
exports.RepositoryCollectionMenubar = RepositoryCollectionMenubar;
exports.RepositoryListMenubar = RepositoryListMenubar;
exports.RepositoryProjectMenubar = RepositoryProjectMenubar;
exports.RepositoryTileMenubar = RepositoryTileMenubar;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _library_menubars = require("./library_menubars");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var specializedMenubarPropTypes = {
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
var resource_icon = window.is_remote ? "globe-network" : "map-marker";
function RepositoryCollectionMenubar(props) {
  function menu_specs() {
    var ms = {
      Transfer: [{
        name_text: "Copy To Library",
        icon_name: "import",
        click_handler: props.repository_copy_func,
        multi_select: true
      }]
    };
    for (var _i = 0, _Object$entries = Object.entries(ms); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        menu_name = _Object$entries$_i[0],
        menu = _Object$entries$_i[1];
      var _iterator = _createForOfIteratorHelper(menu),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var but = _step.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return ms;
  }
  return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    resource_icon: resource_icon,
    showErrorDrawerButton: false,
    toggleErrorDrawer: null
  });
}
RepositoryCollectionMenubar.propTypes = specializedMenubarPropTypes;
exports.RepositoryCollectionMenubar = RepositoryCollectionMenubar = /*#__PURE__*/(0, _react.memo)(RepositoryCollectionMenubar);
function RepositoryProjectMenubar(props) {
  function menu_specs() {
    var ms = {
      Transfer: [{
        name_text: "Copy To Library",
        icon_name: "import",
        click_handler: props.repository_copy_func,
        multi_select: true
      }]
    };
    for (var _i2 = 0, _Object$entries2 = Object.entries(ms); _i2 < _Object$entries2.length; _i2++) {
      var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
        menu_name = _Object$entries2$_i[0],
        menu = _Object$entries2$_i[1];
      var _iterator2 = _createForOfIteratorHelper(menu),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var but = _step2.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    return ms;
  }
  return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    resource_icon: resource_icon,
    showErrorDrawerButton: false,
    toggleErrorDrawer: null
  });
}
RepositoryProjectMenubar.propTypes = specializedMenubarPropTypes;
exports.RepositoryProjectMenubar = RepositoryProjectMenubar = /*#__PURE__*/(0, _react.memo)(RepositoryProjectMenubar);
function RepositoryTileMenubar(props) {
  function _tile_view(e) {
    props.view_func("/repository_view_module/");
  }
  function menu_specs() {
    var ms = {
      View: [{
        name_text: "View Tile",
        icon_name: "eye-open",
        click_handler: _tile_view
      }],
      Transfer: [{
        name_text: "Copy To Library",
        icon_name: "import",
        click_handler: props.repository_copy_func,
        multi_select: true
      }]
    };
    for (var _i3 = 0, _Object$entries3 = Object.entries(ms); _i3 < _Object$entries3.length; _i3++) {
      var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
        menu_name = _Object$entries3$_i[0],
        menu = _Object$entries3$_i[1];
      var _iterator3 = _createForOfIteratorHelper(menu),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var but = _step3.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
    return ms;
  }
  return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    resource_icon: resource_icon,
    showErrorDrawerButton: false,
    toggleErrorDrawer: null
  });
}
RepositoryTileMenubar.propTypes = specializedMenubarPropTypes;
exports.RepositoryTileMenubar = RepositoryTileMenubar = /*#__PURE__*/(0, _react.memo)(RepositoryTileMenubar);
function RepositoryListMenubar(props) {
  function _list_view(e) {
    props.view_func("/repository_view_list/");
  }
  function menu_specs() {
    var self = this;
    var ms = {
      View: [{
        name_text: "View List",
        icon_name: "eye-open",
        click_handler: _list_view
      }],
      Transfer: [{
        name_text: "Copy To Library",
        icon_name: "import",
        click_handler: props.repository_copy_func,
        multi_select: true
      }]
    };
    for (var _i4 = 0, _Object$entries4 = Object.entries(ms); _i4 < _Object$entries4.length; _i4++) {
      var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
        menu_name = _Object$entries4$_i[0],
        menu = _Object$entries4$_i[1];
      var _iterator4 = _createForOfIteratorHelper(menu),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var but = _step4.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
    return ms;
  }
  return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    resource_icon: resource_icon,
    showErrorDrawerButton: false,
    toggleErrorDrawer: null
  });
}
RepositoryListMenubar.propTypes = specializedMenubarPropTypes;
exports.RepositoryListMenubar = RepositoryListMenubar = /*#__PURE__*/(0, _react.memo)(RepositoryListMenubar);
function RepositoryCodeMenubar(props) {
  function _code_view(e) {
    props.view_func("/repository_view_code/");
  }
  function menu_specs() {
    var self = this;
    var ms = {
      View: [{
        name_text: "View Code",
        icon_name: "eye-open",
        click_handler: _code_view
      }],
      Transfer: [{
        name_text: "Copy To Library",
        icon_name: "import",
        click_handler: props.repository_copy_func,
        multi_select: true
      }]
    };
    for (var _i5 = 0, _Object$entries5 = Object.entries(ms); _i5 < _Object$entries5.length; _i5++) {
      var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i5], 2),
        menu_name = _Object$entries5$_i[0],
        menu = _Object$entries5$_i[1];
      var _iterator5 = _createForOfIteratorHelper(menu),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var but = _step5.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
    }
    return ms;
  }
  return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    resource_icon: resource_icon,
    showErrorDrawerButton: false,
    toggleErrorDrawer: null
  });
}
RepositoryCodeMenubar.propTypes = specializedMenubarPropTypes;
exports.RepositoryCodeMenubar = RepositoryCodeMenubar = /*#__PURE__*/(0, _react.memo)(RepositoryCodeMenubar);