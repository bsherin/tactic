"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AllMenubar = AllMenubar;
exports.CodeMenubar = CodeMenubar;
exports.CollectionMenubar = CollectionMenubar;
exports.LibraryMenubar = LibraryMenubar;
exports.ListMenubar = ListMenubar;
exports.ProjectMenubar = ProjectMenubar;
exports.TileMenubar = TileMenubar;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _menu_utilities = require("./menu_utilities");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; } // noinspection JSCheckFunctionSignatures
function LibraryMenubar(props) {
  (0, _react.useEffect)(function () {
    if (props.context_menu_items) {
      props.sendContextMenuItems(props.context_menu_items);
    }
  }, []);
  var outer_style = {
    display: "flex",
    flexDirection: "row",
    position: "relative",
    left: props.left_position,
    marginBottom: 10
  };
  var disabled_items = [];
  if (props.multi_select) {
    for (var menu_name in props.menu_specs) {
      var _iterator = _createForOfIteratorHelper(props.menu_specs[menu_name]),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var menu_item = _step.value;
          if (!menu_item.multi_select) {
            disabled_items.push(menu_item.name_text);
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }
  for (var _menu_name in props.menu_specs) {
    if (props.multi_select) {
      var _iterator2 = _createForOfIteratorHelper(props.menu_specs[_menu_name]),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _menu_item = _step2.value;
          if (!_menu_item.multi_select) {
            disabled_items.push(_menu_item.name_text);
          } else if (_menu_item.res_type && props.selected_type == "multi") {
            disabled_items.push(_menu_item.name_text);
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    } else {
      var _iterator3 = _createForOfIteratorHelper(props.menu_specs[_menu_name]),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _menu_item2 = _step3.value;
          if (_menu_item2.res_type && _menu_item2.res_type != props.selected_type) {
            disabled_items.push(_menu_item2.name_text);
          } else if (_menu_item2.reqs) {
            for (var param in _menu_item2.reqs) {
              if (!(param in props.selected_resource) || !(props.selected_resource[param] == _menu_item2.reqs[param])) {
                disabled_items.push(_menu_item2.name_text);
              }
            }
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    menu_specs: props.menu_specs,
    registerOmniGetter: props.registerOmniGetter,
    dark_theme: props.dark_theme,
    showRefresh: true,
    showClose: false,
    refreshTab: props.refreshTab,
    closeTab: null,
    disabled_items: disabled_items,
    resource_name: "",
    resource_icon: props.resource_icon,
    showErrorDrawerButton: props.showErrorDrawerButton,
    toggleErrorDrawer: props.toggleErrorDrawer
  });
}
exports.LibraryMenubar = LibraryMenubar = /*#__PURE__*/(0, _react.memo)(LibraryMenubar);
LibraryMenubar.propTypes = {
  sendContextMenuItems: _propTypes["default"].func,
  menu_specs: _propTypes["default"].object,
  multi_select: _propTypes["default"].bool,
  selected_type: _propTypes["default"].string,
  dark_theme: _propTypes["default"].bool,
  refreshTab: _propTypes["default"].func,
  showErrorDrawerButton: _propTypes["default"].bool,
  toggleErrorDrawer: _propTypes["default"].func,
  resource_icon: _propTypes["default"].string
};
LibraryMenubar.defaultProps = {
  toggleErrorDrawer: null,
  resource_icon: null
};
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
function AllMenubar(props) {
  function context_menu_items() {
    var menu_items = [{
      text: "open",
      icon: "document-open",
      onClick: props.view_resource
    }];
    if (window.in_context) {
      menu_items.push({
        text: "open in separate tab",
        icon: "document-open",
        onClick: function onClick(resource) {
          props.view_resource(resource, null, true);
        }
      });
    }
    menu_items = menu_items.concat([{
      text: "__divider__"
    }, {
      text: "rename",
      icon: "edit",
      onClick: props.rename_func
    }, {
      text: "duplicate",
      icon: "duplicate",
      onClick: props.duplicate_func
    }, {
      text: "__divider__"
    }, {
      text: "load",
      icon: "upload",
      onClick: props.load_tile,
      res_type: "tile"
    }, {
      text: "unload",
      icon: "undo",
      onClick: props.unload_module,
      res_type: "tile"
    }, {
      text: "__divider__"
    }, {
      text: "delete",
      icon: "trash",
      onClick: props.delete_func,
      intent: "danger"
    }]);
    return menu_items;
  }
  function menu_specs() {
    var ms = {
      New: [{
        name_text: "New Notebook",
        icon_name: "new-text-box",
        click_handler: props.new_notebook
      }, {
        name_text: "divider1",
        icon_name: null,
        click_handler: "divider"
      }, {
        name_text: "Standard Tile",
        icon_name: "code",
        click_handler: function click_handler() {
          props.new_in_creator("BasicTileTemplate");
        }
      }, {
        name_text: "Matplotlib Tile",
        icon_name: "timeline-line-chart",
        click_handler: function click_handler() {
          props.new_in_creator("MatplotlibTileTemplate");
        }
      }, {
        name_text: "Javascript Tile",
        icon_name: "timeline-area-chart",
        click_handler: function click_handler() {
          props.new_in_creator("JSTileTemplate");
        }
      }, {
        name_text: "divider2",
        icon_name: null,
        click_handler: "divider"
      }, {
        name_text: "New List",
        icon_name: "new-text-box",
        click_handler: function click_handler() {
          props.new_list("nltk-english");
        }
      }, {
        name_text: "New Code",
        icon_name: "new-text-box",
        click_handler: function click_handler() {
          props.new_code("BasicCodeTemplate");
        }
      }],
      Open: [{
        name_text: "Open",
        icon_name: "document-open",
        click_handler: function click_handler() {
          props.view_func();
        },
        key_bindings: ["ctrl+o", "return"]
      }, {
        name_text: "Open In Separate Tab",
        icon_name: "document-share",
        click_handler: function click_handler() {
          props.view_resource(props.selected_resource, null, true);
        }
      }, {
        name_text: "Open As Raw Html",
        icon_name: "document-share",
        click_handler: function click_handler() {
          props.open_raw(props.selected_resource);
        },
        res_type: "collection"
      }, {
        name_text: "divider1",
        icon_name: null,
        click_handler: "divider"
      }, {
        name_text: "Open In Creator",
        icon_name: "document-open",
        click_handler: props.creator_view,
        res_type: "tile"
      }, {
        name_text: "Edit Raw Tile",
        icon_name: "document-open",
        click_handler: props.tile_view,
        res_type: "tile"
      }],
      Edit: [{
        name_text: "Rename Resource",
        icon_name: "edit",
        click_handler: function click_handler() {
          props.rename_func();
        }
      }, {
        name_text: "Duplicate Resource",
        icon_name: "duplicate",
        click_handler: function click_handler() {
          props.duplicate_func();
        }
      }, {
        name_text: "Delete Resources",
        icon_name: "trash",
        click_handler: function click_handler() {
          props.delete_func();
        },
        multi_select: true
      }, {
        name_text: "divider1",
        icon_name: null,
        click_handler: "divider"
      }, {
        name_text: "Combine Collections",
        icon_name: "merge-columns",
        click_handler: props.combineCollections,
        multi_select: true,
        res_type: "collection"
      }],
      Load: [{
        name_text: "Load",
        icon_name: "upload",
        click_handler: function click_handler() {
          props.load_tile();
        },
        res_type: "tile"
      }, {
        name_text: "Unload",
        icon_name: "undo",
        click_handler: function click_handler() {
          props.unload_module();
        },
        res_type: "tile"
      }, {
        name_text: "Reset",
        icon_name: "reset",
        click_handler: props.unload_all_tiles,
        res_type: "tile"
      }],
      Compare: [{
        name_text: "View History",
        icon_name: "history",
        click_handler: props.showHistoryViewer,
        res_type: "tile"
      }, {
        name_text: "Compare to Other Modules",
        icon_name: "comparison",
        click_handler: props.compare_tiles,
        multi_select: true,
        res_type: "tile"
      }],
      Transfer: [{
        name_text: "Import Data",
        icon_name: "cloud-upload",
        click_handler: props.showCollectionImport
      }, {
        name_text: "Download Collection",
        icon_name: "download",
        click_handler: function click_handler() {
          props.downloadCollection();
        },
        res_type: "collection"
      }, {
        name_text: "divider1",
        icon_name: null,
        click_handler: "divider"
      }, {
        name_text: "Import Jupyter Notebook",
        icon_name: "cloud-upload",
        click_handler: props.showJupyterImport
      }, {
        name_text: "Import List",
        icon_name: "cloud-upload",
        click_handler: props.showListImport
      }, {
        name_text: "Download As Jupyter Notebook",
        icon_name: "download",
        click_handler: props.downloadJupyter,
        res_type: "project",
        reqs: {
          type: "jupyter"
        }
      }, {
        name_text: "divider2",
        icon_name: null,
        click_handler: "divider"
      }, {
        name_text: "Share to repository",
        icon_name: "share",
        click_handler: props.send_repository_func,
        multi_select: true
      }]
    };
    for (var _i = 0, _Object$entries = Object.entries(ms); _i < _Object$entries.length; _i++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
        menu_name = _Object$entries$_i[0],
        menu = _Object$entries$_i[1];
      var _iterator4 = _createForOfIteratorHelper(menu),
        _step4;
      try {
        for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
          var but = _step4.value;
          if (!but.name_text.startsWith("divider")) {
            but.click_handler = but.click_handler.bind(this);
          }
        }
      } catch (err) {
        _iterator4.e(err);
      } finally {
        _iterator4.f();
      }
    }
    return ms;
  }
  return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
    sendContextMenuItems: props.sendContextMenuItems,
    registerOmniGetter: props.registerOmniGetter,
    context_menu_items: context_menu_items(),
    selected_rows: props.selected_rows,
    selected_type: props.selected_type,
    selected_resource: props.selected_resource,
    resource_icon: _blueprint_mdata_fields.icon_dict["all"],
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    dark_theme: props.dark_theme,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    showErrorDrawerButton: true,
    toggleErrorDrawer: props.toggleErrorDrawer
  });
}
exports.AllMenubar = AllMenubar = /*#__PURE__*/(0, _react.memo)(AllMenubar);
AllMenubar.propTypes = specializedMenubarPropTypes;
function CollectionMenubar(props) {
  function menu_specs() {
    var ms = {
      Open: [{
        name_text: "Open",
        icon_name: "document-open",
        click_handler: function click_handler() {
          props.view_func();
        },
        key_bindings: ["ctrl+o", "return"]
      }, {
        name_text: "Open In Separate Tab",
        icon_name: "document-share",
        click_handler: function click_handler() {
          props.view_resource(props.selected_resource, null, true);
        }
      }],
      Edit: [{
        name_text: "Rename Collection",
        icon_name: "edit",
        click_handler: function click_handler() {
          props.rename_func();
        }
      }, {
        name_text: "Duplicate Collection",
        icon_name: "duplicate",
        click_handler: function click_handler() {
          props.duplicate_func();
        }
      }, {
        name_text: "Combine Collections",
        icon_name: "merge-columns",
        click_handler: props.combineCollections,
        multi_select: true
      }, {
        name_text: "Delete Collections",
        icon_name: "trash",
        click_handler: function click_handler() {
          props.delete_func();
        },
        multi_select: true
      }],
      Transfer: [{
        name_text: "Import Data",
        icon_name: "cloud-upload",
        click_handler: props.showCollectionImport
      }, {
        name_text: "Download Collection",
        icon_name: "download",
        click_handler: function click_handler() {
          props.downloadCollection();
        }
      }, {
        name_text: "Share to repository",
        icon_name: "share",
        click_handler: props.send_repository_func,
        multi_select: true
      }]
    };
    for (var _i2 = 0, _Object$entries2 = Object.entries(ms); _i2 < _Object$entries2.length; _i2++) {
      var _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2),
        menu_name = _Object$entries2$_i[0],
        menu = _Object$entries2$_i[1];
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
  function context_menu_items() {
    var menu_items = [{
      text: "open",
      icon: "document-open",
      onClick: props.view_resource
    }];
    if (window.in_context) {
      menu_items.push({
        text: "open in separate tab",
        icon: "document-open",
        onClick: function onClick(resource) {
          props.view_resource(resource, null, true);
        }
      });
    }
    menu_items = menu_items.concat([{
      text: "__divider__"
    }, {
      text: "rename",
      icon: "edit",
      onClick: props.rename_func
    }, {
      text: "duplicate",
      icon: "duplicate",
      onClick: props.duplicate_func
    }, {
      text: "__divider__"
    }, {
      text: "download",
      icon: "cloud-download",
      onClick: props.downloadCollection
    }, {
      text: "__divider__"
    }, {
      text: "delete",
      icon: "trash",
      onClick: props.delete_func,
      intent: "danger"
    }]);
    return menu_items;
  }
  return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
    sendContextMenuItems: props.sendContextMenuItems,
    menu_specs: menu_specs(),
    resource_icon: _blueprint_mdata_fields.icon_dict["collection"],
    context_menu_items: context_menu_items(),
    multi_select: props.multi_select,
    selected_rows: props.selected_rows,
    selected_type: props.selected_type,
    dark_theme: props.dark_theme,
    controlled: props.controlled,
    am_selected: props.am_selected,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    showErrorDrawerButton: true,
    toggleErrorDrawer: props.toggleErrorDrawer
  });
}
exports.CollectionMenubar = CollectionMenubar = /*#__PURE__*/(0, _react.memo)(CollectionMenubar);
CollectionMenubar.propTypes = specializedMenubarPropTypes;
function ProjectMenubar(props) {
  function context_menu_items() {
    var menu_items = [{
      text: "open",
      icon: "document-open",
      onClick: props.view_resource
    }];
    if (window.in_context) {
      menu_items.push({
        text: "open in separate tab",
        icon: "document-open",
        onClick: function onClick(resource) {
          props.view_resource(resource, null, true);
        }
      });
    }
    menu_items = menu_items.concat([{
      text: "__divider__"
    }, {
      text: "rename",
      icon: "edit",
      onClick: props.rename_func
    }, {
      text: "duplicate",
      icon: "duplicate",
      onClick: props.duplicate_func
    }, {
      text: "__divider__"
    }, {
      text: "delete",
      icon: "trash",
      onClick: props.delete_func,
      intent: "danger"
    }]);
    return menu_items;
  }
  function menu_specs() {
    var ms = {
      Open: [{
        name_text: "Open",
        icon_name: "document-open",
        click_handler: function click_handler() {
          props.view_func();
        },
        key_bindings: ["ctrl+o", "return"]
      }, {
        name_text: "Open In Separate Tab",
        icon_name: "document-share",
        click_handler: function click_handler() {
          props.view_resource(props.selected_resource, null, true);
        }
      }, {
        name_text: "New Notebook",
        icon_name: "new-text-box",
        click_handler: props.new_notebook,
        key_bindings: ["ctrl+n"]
      }],
      Edit: [{
        name_text: "Rename Project",
        icon_name: "edit",
        click_handler: function click_handler() {
          props.rename_func();
        }
      }, {
        name_text: "Duplicate Project",
        icon_name: "duplicate",
        click_handler: function click_handler() {
          props.duplicate_func();
        }
      }, {
        name_text: "Delete Projects",
        icon_name: "trash",
        click_handler: function click_handler() {
          props.delete_func();
        },
        multi_select: true
      }],
      Transfer: [{
        name_text: "Import Jupyter Notebook",
        icon_name: "cloud-upload",
        click_handler: props.showJupyterImport
      }, {
        name_text: "Download As Jupyter Notebook",
        icon_name: "download",
        click_handler: props.downloadJupyter
      }, {
        name_text: "Share To Repository",
        icon_name: "share",
        click_handler: props.send_repository_func,
        multi_select: true
      }]
    };
    for (var _i3 = 0, _Object$entries3 = Object.entries(ms); _i3 < _Object$entries3.length; _i3++) {
      var _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2),
        menu_name = _Object$entries3$_i[0],
        menu = _Object$entries3$_i[1];
      var _iterator6 = _createForOfIteratorHelper(menu),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var but = _step6.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
    }
    return ms;
  }
  return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
    sendContextMenuItems: props.sendContextMenuItems,
    context_menu_items: context_menu_items(),
    resource_icon: _blueprint_mdata_fields.icon_dict["project"],
    menu_specs: menu_specs(),
    selected_rows: props.selected_rows,
    selected_type: props.selected_type,
    multi_select: props.multi_select,
    dark_theme: props.dark_theme,
    controlled: props.controlled,
    am_selected: props.am_selected,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    showErrorDrawerButton: true,
    toggleErrorDrawer: props.toggleErrorDrawer
  });
}
exports.ProjectMenubar = ProjectMenubar = /*#__PURE__*/(0, _react.memo)(ProjectMenubar);
ProjectMenubar.propTypes = specializedMenubarPropTypes;
function TileMenubar(props) {
  function context_menu_items() {
    var menu_items = [{
      text: "edit",
      icon: "edit",
      onClick: props.view_named_tile
    }, {
      text: "edit in creator",
      icon: "annotation",
      onClick: props.creator_view_named_tile
    }];
    if (window.in_context) {
      menu_items.push({
        text: "edit in separate tab",
        icon: "edit",
        onClick: function onClick(resource) {
          props.view_named_tile(resource, true);
        }
      });
      menu_items.push({
        text: "edit in creator in separate tab",
        icon: "annotation",
        onClick: function onClick(resource) {
          props.creator_view_named_tile(resource, true);
        }
      });
    }
    menu_items = menu_items.concat([{
      text: "__divider__"
    }, {
      text: "load",
      icon: "upload",
      onClick: props.load_tile
    }, {
      text: "unload",
      icon: "undo",
      onClick: props.unload_module
    }, {
      text: "__divider__"
    }, {
      text: "rename",
      icon: "edit",
      onClick: props.rename_func
    }, {
      text: "duplicate",
      icon: "duplicate",
      onClick: props.duplicate_func
    }, {
      text: "__divider__"
    }, {
      text: "delete",
      icon: "trash",
      onClick: props.delete_func,
      intent: "danger"
    }]);
    return menu_items;
  }
  function menu_specs() {
    var self = this;
    var ms = {
      New: [{
        name_text: "Standard Tile",
        icon_name: "code",
        click_handler: function click_handler() {
          props.new_in_creator("BasicTileTemplate");
        },
        key_bindings: ["ctrl+n"]
      }, {
        name_text: "Matplotlib Tile",
        icon_name: "timeline-line-chart",
        click_handler: function click_handler() {
          props.new_in_creator("MatplotlibTileTemplate");
        }
      }, {
        name_text: "Javascript Tile",
        icon_name: "timeline-area-chart",
        click_handler: function click_handler() {
          props.new_in_creator("JSTileTemplate");
        }
      }],
      Open: [{
        name_text: "Open In Creator",
        icon_name: "document-open",
        click_handler: props.creator_view,
        key_bindings: ["ctrl+o", "return"]
      }, {
        name_text: "Open In Viewer",
        icon_name: "document-open",
        click_handler: props.tile_view
      }, {
        name_text: "Open In Creator in New Tab",
        icon_name: "document-share",
        click_handler: function click_handler() {
          props.creator_view_named_tile(props.selected_resource.name, true);
        }
      }, {
        name_text: "Open in Viewer in New Tab",
        icon_name: "document-share",
        click_handler: function click_handler() {
          props.view_named_tile(props.selected_resource.name, true);
        }
      }],
      Edit: [{
        name_text: "Rename Tile",
        icon_name: "edit",
        click_handler: function click_handler() {
          props.rename_func();
        }
      }, {
        name_text: "Duplicate Tile",
        icon_name: "duplicate",
        click_handler: function click_handler() {
          props.duplicate_func();
        }
      }, {
        name_text: "Delete Tiles",
        icon_name: "trash",
        click_handler: function click_handler() {
          props.delete_func();
        },
        multi_select: true
      }],
      Load: [{
        name_text: "Load",
        icon_name: "upload",
        click_handler: function click_handler() {
          props.load_tile();
        }
      }, {
        name_text: "Unload",
        icon_name: "undo",
        click_handler: function click_handler() {
          props.unload_module();
        }
      }, {
        name_text: "Reset",
        icon_name: "reset",
        click_handler: props.unload_all_tiles
      }],
      Compare: [{
        name_text: "View History",
        icon_name: "history",
        click_handler: props.showHistoryViewer,
        tooltip: "Show history viewer"
      }, {
        name_text: "Compare to Other Modules",
        icon_name: "comparison",
        click_handler: props.compare_tiles,
        multi_select: true,
        tooltip: "Compare to another tile"
      }],
      Transfer: [{
        name_text: "Share To Repository",
        icon_name: "share",
        click_handler: props.send_repository_func,
        multi_select: true
      }]
    };
    for (var _i4 = 0, _Object$entries4 = Object.entries(ms); _i4 < _Object$entries4.length; _i4++) {
      var _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2),
        menu_name = _Object$entries4$_i[0],
        menu = _Object$entries4$_i[1];
      var _iterator7 = _createForOfIteratorHelper(menu),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var but = _step7.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    }
    return ms;
  }
  return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
    sendContextMenuItems: props.sendContextMenuItems,
    context_menu_items: context_menu_items(),
    resource_icon: _blueprint_mdata_fields.icon_dict["tile"],
    menu_specs: menu_specs(),
    selected_rows: props.selected_rows,
    selected_type: props.selected_type,
    multi_select: props.multi_select,
    dark_theme: props.dark_theme,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    showErrorDrawerButton: true,
    toggleErrorDrawer: props.toggleErrorDrawer
  });
}
exports.TileMenubar = TileMenubar = /*#__PURE__*/(0, _react.memo)(TileMenubar);
TileMenubar.propTypes = specializedMenubarPropTypes;
function ListMenubar(props) {
  function context_menu_items() {
    var menu_items = [{
      text: "edit",
      icon: "document-open",
      onClick: props.view_func
    }];
    if (window.in_context) {
      menu_items.push({
        text: "open in separate tab",
        icon: "document-open",
        onClick: function onClick(resource) {
          props.view_resource(resource, null, true);
        }
      });
    }
    menu_items = menu_items.concat([{
      text: "__divider__"
    }, {
      text: "rename",
      icon: "edit",
      onClick: props.rename_func
    }, {
      text: "duplicate",
      icon: "duplicate",
      onClick: props.duplicate_func
    }, {
      text: "__divider__"
    }, {
      text: "delete",
      icon: "trash",
      onClick: props.delete_func,
      intent: "danger"
    }]);
    return menu_items;
  }
  function menu_specs() {
    var self = this;
    var ms = {
      Open: [{
        name_text: "New",
        icon_name: "new-text-box",
        click_handler: function click_handler() {
          props.new_list("nltk-english");
        }
      }, {
        name_text: "Open",
        icon_name: "document-open",
        click_handler: function click_handler() {
          props.view_func();
        },
        key_bindings: ["ctrl+o", "return"]
      }, {
        name_text: "Open In Separate Tab",
        icon_name: "document-share",
        click_handler: function click_handler() {
          props.view_resource(props.selected_resource, null, true);
        }
      }],
      Edit: [{
        name_text: "Rename List",
        icon_name: "edit",
        click_handler: function click_handler() {
          props.rename_func();
        }
      }, {
        name_text: "Duplicate List",
        icon_name: "duplicate",
        click_handler: function click_handler() {
          props.duplicate_func();
        }
      }, {
        name_text: "Delete Lists",
        icon_name: "trash",
        click_handler: function click_handler() {
          props.delete_func();
        },
        multi_select: true
      }],
      Transfer: [{
        name_text: "Import List",
        icon_name: "cloud-upload",
        click_handler: props.showListImport
      }, {
        name_text: "Share to repository",
        icon_name: "share",
        click_handler: props.send_repository_func,
        multi_select: true
      }]
    };
    for (var _i5 = 0, _Object$entries5 = Object.entries(ms); _i5 < _Object$entries5.length; _i5++) {
      var _Object$entries5$_i = _slicedToArray(_Object$entries5[_i5], 2),
        menu_name = _Object$entries5$_i[0],
        menu = _Object$entries5$_i[1];
      var _iterator8 = _createForOfIteratorHelper(menu),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var but = _step8.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
    }
    return ms;
  }
  return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
    sendContextMenuItems: props.sendContextMenuItems,
    context_menu_items: context_menu_items(),
    selected_rows: props.selected_rows,
    selected_type: props.selected_type,
    resource_icon: _blueprint_mdata_fields.icon_dict["list"],
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    dark_theme: props.dark_theme,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    showErrorDrawerButton: true,
    toggleErrorDrawer: props.toggleErrorDrawer
  });
}
exports.ListMenubar = ListMenubar = /*#__PURE__*/(0, _react.memo)(ListMenubar);
ListMenubar.propTypes = specializedMenubarPropTypes;
function CodeMenubar(props) {
  function context_menu_items() {
    var menu_items = [{
      text: "edit",
      icon: "document-open",
      onClick: props.view_resource
    }];
    if (window.in_context) {
      menu_items.push({
        text: "open in separate tab",
        icon: "document-open",
        onClick: function onClick(resource) {
          props.view_resource(resource, null, true);
        }
      });
    }
    menu_items = menu_items.concat([{
      text: "__divider__"
    }, {
      text: "rename",
      icon: "edit",
      onClick: props.rename_func
    }, {
      text: "duplicate",
      icon: "duplicate",
      onClick: props.duplicate_func
    }, {
      text: "__divider__"
    }, {
      text: "delete",
      icon: "trash",
      onClick: props.delete_func,
      intent: "danger"
    }]);
    return menu_items;
  }
  function menu_specs() {
    var self = this;
    var ms = {
      Open: [{
        name_text: "New",
        icon_name: "new-text-box",
        click_handler: function click_handler() {
          props.new_code("BasicCodeTemplate");
        }
      }, {
        name_text: "Open",
        icon_name: "document-open",
        click_handler: function click_handler() {
          props.view_func();
        },
        key_bindings: ["ctrl+o", "return"]
      }, {
        name_text: "Open In Separate Tab",
        icon_name: "document-share",
        click_handler: function click_handler() {
          props.view_resource(props.selected_resource, null, true);
        }
      }],
      Edit: [{
        name_text: "Rename Code",
        icon_name: "edit",
        click_handler: function click_handler() {
          props.rename_func();
        }
      }, {
        name_text: "Duplicate Code",
        icon_name: "duplicate",
        click_handler: function click_handler() {
          props.duplicate_func();
        }
      }, {
        name_text: "Delete Code",
        icon_name: "trash",
        click_handler: function click_handler() {
          props.delete_func();
        },
        multi_select: true
      }],
      Transfer: [{
        name_text: "Share to repository",
        icon_name: "share",
        click_handler: props.send_repository_func,
        multi_select: true
      }]
    };
    for (var _i6 = 0, _Object$entries6 = Object.entries(ms); _i6 < _Object$entries6.length; _i6++) {
      var _Object$entries6$_i = _slicedToArray(_Object$entries6[_i6], 2),
        menu_name = _Object$entries6$_i[0],
        menu = _Object$entries6$_i[1];
      var _iterator9 = _createForOfIteratorHelper(menu),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var but = _step9.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
    }
    return ms;
  }
  return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
    sendContextMenuItems: props.sendContextMenuItems,
    context_menu_items: context_menu_items(),
    resource_icon: _blueprint_mdata_fields.icon_dict["code"],
    selected_rows: props.selected_rows,
    selected_type: props.selected_type,
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    dark_theme: props.dark_theme,
    controlled: props.controlled,
    am_selected: props.am_selected,
    tsocket: props.tsocket,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_name: "",
    showErrorDrawerButton: true,
    toggleErrorDrawer: props.toggleErrorDrawer
  });
}
exports.CodeMenubar = CodeMenubar = /*#__PURE__*/(0, _react.memo)(CodeMenubar);
CodeMenubar.propTypes = specializedMenubarPropTypes;