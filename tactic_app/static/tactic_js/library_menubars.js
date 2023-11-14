"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AllMenubar = AllMenubar;
exports.LibraryMenubar = LibraryMenubar;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _menu_utilities = require("./menu_utilities");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
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
          } else if (_menu_item.res_type && props.selectedTypeRef.current == "multi") {
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
          if (_menu_item2.res_type && Array.isArray(_menu_item2.res_type)) {
            if (!_menu_item2.res_type.includes(props.selectedTypeRef.current)) {
              disabled_items.push(_menu_item2.name_text);
            }
          } else if (_menu_item2.res_type && _menu_item2.res_type != props.selectedTypeRef.current) {
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
    connection_status: props.connection_status,
    registerOmniGetter: props.registerOmniGetter,
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
  selectedTypeRef: _propTypes["default"].object,
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
      },
      // {name_text: "Import To Pool", icon_name: "cloud-upload", click_handler: props.showPoolImport},
      {
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
    if (!window.has_pool) {
      var new_ms = {};
      for (var menu_name in ms) {
        new_ms[menu_name] = ms[menu_name].filter(function (b) {
          return !b.name_text.toLowerCase().includes("pool");
        });
      }
      ms = new_ms;
    }
    return ms;
  }
  return /*#__PURE__*/_react["default"].createElement(LibraryMenubar, {
    sendContextMenuItems: props.sendContextMenuItems,
    connection_status: props.connection_status,
    registerOmniGetter: props.registerOmniGetter,
    context_menu_items: context_menu_items(),
    selected_rows: props.selected_rows,
    selectedTypeRef: props.selectedTypeRef,
    selected_resource: props.selected_resource,
    resource_icon: _blueprint_mdata_fields.icon_dict["all"],
    menu_specs: menu_specs(),
    multi_select: props.multi_select,
    controlled: props.controlled,
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