"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepositoryAllMenubar = RepositoryAllMenubar;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _library_menubars = require("./library_menubars");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const resource_icon = window.is_remote ? "globe-network" : "map-marker";
const endpointDict = {
  tile: "/repository_view_module/",
  list: "/repository_view_list/",
  code: "/repository_view_code/"
};
function RepositoryAllMenubar(props) {
  const context_menu_items = [{
    text: "view",
    icon: "eye-open",
    onClick: _view_resource
  }, {
    text: "__divider__"
  }, {
    text: "copy To Library",
    icon: "import",
    onClick: props.repository_copy_func
  }];
  function _view_resource(e) {
    if (props.selectedTypeRef.current in endpointDict) {
      props.view_func(endpointDict[props.selectedTypeRef.current]);
    }
  }
  const menu_specs = {
    View: [{
      name_text: "View",
      icon_name: "eye-open",
      click_handler: _view_resource,
      res_type: ["tile", "list", "code"]
    }],
    Transfer: [{
      name_text: "Copy To Library",
      icon_name: "import",
      click_handler: props.repository_copy_func,
      multi_select: true
    }]
  };
  return /*#__PURE__*/_react.default.createElement(_library_menubars.LibraryMenubar, {
    menu_specs: menu_specs,
    sendContextMenuItems: props.sendContextMenuItems,
    connection_status: props.connection_status,
    context_menu_items: context_menu_items,
    multi_select: props.multi_select,
    selected_rows: props.selected_rows,
    selectedTypeRef: props.selectedTypeRef,
    controlled: false,
    tsocket: props.tsocket,
    refreshTab: props.refresh_func,
    closeTab: null,
    resource_icon: resource_icon
  });
}