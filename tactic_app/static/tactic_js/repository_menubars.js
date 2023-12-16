"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RepositoryAllMenubar = RepositoryAllMenubar;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _library_menubars = require("./library_menubars");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var resource_icon = window.is_remote ? "globe-network" : "map-marker";
var endpointDict = {
  tile: "/repository_view_module/",
  list: "/repository_view_list/",
  code: "/repository_view_code/"
};
function RepositoryAllMenubar(props) {
  var context_menu_items = [{
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
  var menu_specs = {
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
  return /*#__PURE__*/_react["default"].createElement(_library_menubars.LibraryMenubar, {
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