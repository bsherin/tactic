"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AllMenubar = AllMenubar;
exports.LibraryMenubar = LibraryMenubar;
var _react = _interopRequireWildcard(require("react"));
var _menu_utilities = require("./menu_utilities");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _error_drawer = require("./error_drawer");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// noinspection JSCheckFunctionSignatures

function LibraryMenubar(props) {
  props = {
    resource_icon: null,
    ...props
  };
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(() => {
    if (props.context_menu_items) {
      props.sendContextMenuItems(props.context_menu_items);
    }
  }, []);
  let outer_style = {
    display: "flex",
    flexDirection: "row",
    position: "relative",
    left: props.left_position,
    marginBottom: 10
  };
  let disabled_items = [];
  if (props.multi_select) {
    for (let menu_name in props.menu_specs) {
      for (let menu_item of props.menu_specs[menu_name]) {
        if (!menu_item.multi_select) {
          disabled_items.push(menu_item.name_text);
        }
      }
    }
  }
  for (let menu_name in props.menu_specs) {
    if (props.multi_select) {
      for (let menu_item of props.menu_specs[menu_name]) {
        if (!menu_item.multi_select) {
          disabled_items.push(menu_item.name_text);
        } else if (menu_item.res_type && props.selectedTypeRef.current == "multi") {
          disabled_items.push(menu_item.name_text);
        }
      }
    } else {
      for (let menu_item of props.menu_specs[menu_name]) {
        if (menu_item.res_type && Array.isArray(menu_item.res_type)) {
          if (!menu_item.res_type.includes(props.selectedTypeRef.current)) {
            disabled_items.push(menu_item.name_text);
          }
        } else if (menu_item.res_type && menu_item.res_type != props.selectedTypeRef.current) {
          disabled_items.push(menu_item.name_text);
        } else if (menu_item.reqs) {
          for (let param in menu_item.reqs) {
            if (!(param in props.selected_resource) || !(props.selected_resource[param] == menu_item.reqs[param])) {
              disabled_items.push(menu_item.name_text);
            }
          }
        }
      }
    }
  }
  return /*#__PURE__*/_react.default.createElement(_menu_utilities.TacticMenubar, {
    menu_specs: props.menu_specs,
    connection_status: props.connection_status,
    showRefresh: true,
    showClose: false,
    refreshTab: props.refreshTab,
    closeTab: null,
    disabled_items: disabled_items,
    resource_name: "",
    resource_icon: props.resource_icon,
    showErrorDrawerButton: props.showErrorDrawerButton
  });
}
exports.LibraryMenubar = LibraryMenubar = /*#__PURE__*/(0, _react.memo)(LibraryMenubar);
function AllMenubar(props) {
  function context_menu_items() {
    let menu_items = [{
      text: "open",
      icon: "document-open",
      onClick: props.view_resource
    }];
    if (window.in_context) {
      menu_items.push({
        text: "open in separate tab",
        icon: "document-open",
        onClick: resource => {
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
    let ms = {
      New: [{
        name_text: "New Notebook",
        icon_name: "new-text-box",
        click_handler: props.new_notebook
      }, {
        name_text: "New Project",
        icon_name: "new-text-box",
        click_handler: props.new_project
      }, {
        name_text: "divider1",
        icon_name: null,
        click_handler: "divider"
      }, {
        name_text: "Standard Tile",
        icon_name: "code",
        click_handler: () => {
          props.new_in_creator("BasicTileTemplate");
        }
      }, {
        name_text: "Matplotlib Tile",
        icon_name: "timeline-line-chart",
        click_handler: () => {
          props.new_in_creator("MatplotlibTileTemplate");
        }
      }, {
        name_text: "Javascript Tile",
        icon_name: "timeline-area-chart",
        click_handler: () => {
          props.new_in_creator("JSTileTemplate");
        }
      }, {
        name_text: "divider2",
        icon_name: null,
        click_handler: "divider"
      }, {
        name_text: "New List",
        icon_name: "new-text-box",
        click_handler: () => {
          props.new_list("nltk-english");
        }
      }, {
        name_text: "New Code",
        icon_name: "new-text-box",
        click_handler: () => {
          props.new_code("BasicCodeTemplate");
        }
      }],
      Open: [{
        name_text: "Open",
        icon_name: "document-open",
        click_handler: () => {
          props.view_func();
        },
        key_bindings: ["return"]
      }, {
        name_text: "Open In Separate Tab",
        icon_name: "document-share",
        click_handler: () => {
          props.view_resource(props.selected_resource, null, true);
        }
      }, {
        name_text: "Open As Raw Html",
        icon_name: "document-share",
        click_handler: () => {
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
        click_handler: () => {
          props.rename_func();
        }
      }, {
        name_text: "Duplicate Resource",
        icon_name: "duplicate",
        click_handler: () => {
          props.duplicate_func();
        }
      }, {
        name_text: "Delete Resources",
        icon_name: "trash",
        click_handler: () => {
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
        click_handler: () => {
          props.load_tile();
        },
        res_type: "tile"
      }, {
        name_text: "Unload",
        icon_name: "undo",
        click_handler: () => {
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
        click_handler: () => {
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
      let new_ms = {};
      for (const menu_name in ms) {
        new_ms[menu_name] = ms[menu_name].filter(b => !b.name_text.toLowerCase().includes("pool"));
      }
      ms = new_ms;
    }
    return ms;
  }
  return /*#__PURE__*/_react.default.createElement(LibraryMenubar, {
    sendContextMenuItems: props.sendContextMenuItems,
    connection_status: props.connection_status,
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
    showErrorDrawerButton: true
  });
}
exports.AllMenubar = AllMenubar = /*#__PURE__*/(0, _react.memo)(AllMenubar);