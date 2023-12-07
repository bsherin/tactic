"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenOmnibar = OpenOmnibar;
exports.TacticOmnibar = TacticOmnibar;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _select = require("@blueprintjs/select");
var _core = require("@blueprintjs/core");
var _communication_react = require("./communication_react");
var _theme = require("./theme");
var _utilities_react = require("./utilities_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var context_url = $SCRIPT_ROOT + '/context';
var library_url = $SCRIPT_ROOT + '/library';
var repository_url = $SCRIPT_ROOT + '/repository';
var account_url = $SCRIPT_ROOT + '/account_info';
var login_url = $SCRIPT_ROOT + "/login";
var icon_dict = {
  collection: "database",
  project: "projects",
  tile: "application",
  list: "list",
  code: "code"
};
function OpenOmnibarItem(props) {
  function _handleClick() {
    props.handleClick(props.item);
    return null;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    icon: icon_dict[props.item.res_type],
    active: props.modifiers.active,
    text: props.item.name,
    label: props.item.res_type,
    key: props.item.name,
    onClick: _handleClick,
    shouldDismissPopover: true
  });
}
function OpenOmnibar(props) {
  var old_search_string = (0, _react.useRef)("");
  var grabChunk = (0, _react.useCallback)(function (search_string) {
    var search_spec = {
      active_tag: null,
      search_string: search_string,
      search_inside: false,
      search_metadata: false,
      show_hidden: false,
      sort_field: "updated_for_sort",
      sort_direction: "descending"
    };
    var data = {
      pane_type: "all",
      search_spec: search_spec,
      row_number: 0,
      is_repository: false
    };
    (0, _communication_react.postAjax)("grab_all_list_chunk", data, function (data) {
      set_item_list(Object.values(data.chunk_dict));
    });
  });
  var _useState = (0, _react.useState)([]),
    _useState2 = _slicedToArray(_useState, 2),
    item_list = _useState2[0],
    set_item_list = _useState2[1];
  var _useDebounce = (0, _utilities_react.useDebounce)(grabChunk),
    _useDebounce2 = _slicedToArray(_useDebounce, 2),
    waiting = _useDebounce2[0],
    doUpdate = _useDebounce2[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  function openItemListPredicate(search_string, items) {
    if (!props.showOmnibar) return [];
    if (search_string == "" && !waiting.current) {
      old_search_string.current = "";
      return [];
    }
    if (search_string == old_search_string.current) {
      return items;
    }
    old_search_string.current = search_string;
    doUpdate(search_string);
    return item_list;
  }
  function openItemRenderer(item, _ref) {
    var modifiers = _ref.modifiers,
      handleClick = _ref.handleClick;
    return /*#__PURE__*/_react["default"].createElement(OpenOmnibarItem, {
      modifiers: modifiers,
      item: item,
      handleClick: handleClick
    });
  }
  function _onItemSelect(item) {
    props.openFunc(item);
    props.closeOmnibar();
  }
  function _onActiveItemChange(item) {
    console.log(String(item));
  }
  function renderQueryList(listProps) {
    var handleKeyDown = listProps.handleKeyDown,
      handleKeyUp = listProps.handleKeyUp;
    var handlers = props.showOmnibar ? {
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp
    } : {};
    return /*#__PURE__*/_react["default"].createElement(_core.Overlay, {
      hasBackdrop: true,
      isOpen: props.showOmnibar,
      className: _select.Classes.OMNIBAR_OVERLAY,
      onClose: props.closeOmnibar
    }, /*#__PURE__*/_react["default"].createElement("div", _extends({
      className: "".concat(_select.Classes.OMNIBAR, " ").concat(listProps.className)
    }, handlers), /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
      autoFocus: true,
      large: true,
      leftIcon: "cube",
      placeholder: "Search resources...",
      onChange: listProps.handleQueryChange,
      value: listProps.query
    }), listProps.itemList));
  }
  return /*#__PURE__*/_react["default"].createElement(_select.QueryList, {
    items: item_list,
    className: theme.dark_theme ? "bp5-dark" : "",
    isOpen: props.showOmnibar,
    onItemSelect: _onItemSelect,
    itemRenderer: openItemRenderer,
    itemListPredicate: openItemListPredicate,
    resetOnSelect: true,
    resetOnQuery: false,
    renderer: renderQueryList,
    onClose: props.closeOmnibar
  });
}
exports.OpenOmnibar = OpenOmnibar = /*#__PURE__*/(0, _react.memo)(OpenOmnibar);
function TacticOmnibarItem(props) {
  function _handleClick() {
    props.handleClick(props.item);
  }
  return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
    icon: props.item.icon_name,
    active: props.modifiers.active,
    text: props.item.display_text,
    label: props.item.category,
    key: props.item.search_text,
    onClick: _handleClick,
    shouldDismissPopover: true
  });
}
TacticOmnibarItem.propTypes = {
  item: _propTypes["default"].object,
  modifiers: _propTypes["default"].object,
  handleClick: _propTypes["default"].func
};
TacticOmnibarItem = /*#__PURE__*/(0, _react.memo)(TacticOmnibarItem);
function _itemRenderer(item, _ref2) {
  var modifiers = _ref2.modifiers,
    handleClick = _ref2.handleClick;
  return /*#__PURE__*/_react["default"].createElement(TacticOmnibarItem, {
    modifiers: modifiers,
    item: item,
    handleClick: handleClick
  });
}
function _itemPredicate(query, item) {
  if (query.length == 0) {
    return false;
  }
  var lquery = query.toLowerCase();
  var re = new RegExp(query);
  return re.test(item.search_text.toLowerCase()) || re.test(item.category.toLowerCase());
}
function TacticOmnibar(props) {
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  function _onItemSelect(item) {
    item.the_function();
    props.closeOmnibar();
  }
  function _handle_signout() {
    window.open($SCRIPT_ROOT + "/logout/" + props.page_id, "_self");
    return false;
  }
  function _globalOmniItems() {
    function wopenfunc(the_url) {
      return function () {
        window.open(the_url);
      };
    }
    var omni_funcs = [["Toggle Theme", "account", _toggleTheme, "contrast"], ["Docs", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"), "log-out"], ["Tile Commands", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Tile-Commands.html"), "code-block"], ["Object Api", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"), "code-block"]];
    if (props.is_authenticated) {
      var new_funcs = [["New Context Tab", "window", wopenfunc(context_url), "add"], ["New Tabbed Window", "window", wopenfunc(library_url), "add"], ["Show Repository", "window", wopenfunc(repository_url), "database"], ["Show Account Info", "account", wopenfunc(account_url), "person"], ["Logout", "account", _handle_signout, "log-out"]];
      omni_funcs = omni_funcs.concat(new_funcs);
    }
    var omni_items = [];
    var _iterator = _createForOfIteratorHelper(omni_funcs),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        omni_items.push({
          category: item[1],
          display_text: item[0],
          search_text: item[0],
          icon_name: item[3],
          the_function: item[2]
        });
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return omni_items;
  }
  function _toggleTheme() {
    var result_dict = {
      "user_id": window.user_id,
      "theme": !theme.dark_theme ? "dark" : "light"
    };
    (0, _communication_react.postWithCallback)("host", "set_user_theme", result_dict, null, null);
    theme.setTheme(!theme.dark_theme);
  }
  var the_items = [];
  if (props.showOmnibar) {
    var _iterator2 = _createForOfIteratorHelper(props.omniGetters),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var ogetter = _step2.value;
        the_items = the_items.concat(ogetter());
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    the_items = the_items.concat(_globalOmniItems());
  }
  return /*#__PURE__*/_react["default"].createElement(_select.Omnibar, {
    items: the_items,
    className: theme.dark_theme ? "bp5-dark" : "",
    isOpen: props.showOmnibar,
    onItemSelect: _onItemSelect,
    itemRenderer: _itemRenderer,
    itemPredicate: _itemPredicate,
    resetOnSelect: true,
    onClose: props.closeOmnibar
  });
}
TacticOmnibar.propTypes = {
  omniGetters: _propTypes["default"].array,
  showOmniBar: _propTypes["default"].bool,
  closeOmniBar: _propTypes["default"].func
};
TacticOmnibar.defaultProps = {
  showOmnibar: false,
  omniGetters: null
};
exports.TacticOmnibar = TacticOmnibar = /*#__PURE__*/(0, _react.memo)(TacticOmnibar);