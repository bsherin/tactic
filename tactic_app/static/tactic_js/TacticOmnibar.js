"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenOmnibar = OpenOmnibar;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _select = require("@blueprintjs/select");
var _core = require("@blueprintjs/core");
var _communication_react = require("./communication_react");
var _settings = require("./settings");
var _utilities_react = require("./utilities_react");
var _assistant = require("./assistant");
var _error_drawer = require("./error_drawer");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const context_url = $SCRIPT_ROOT + '/context';
const library_url = $SCRIPT_ROOT + '/library';
const repository_url = $SCRIPT_ROOT + '/repository';
const account_url = $SCRIPT_ROOT + '/account_info';
const login_url = $SCRIPT_ROOT + "/login";
let icon_dict = {
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
  return /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
    icon: icon_dict[props.item.res_type],
    active: props.modifiers.active,
    text: props.item.name,
    label: props.item.res_type,
    key: props.item.search_text,
    onClick: _handleClick,
    shouldDismissPopover: true
  });
}
const resources_to_grab = 20;
function OpenOmnibar(props) {
  // const [commandItems, setCommandItems] = useState([]);
  const [item_list, set_item_list] = (0, _react.useState)([]);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const old_search_string = (0, _react.useRef)("");
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  const assistantDrawerFuncs = (0, _react.useContext)(_assistant.AssistantContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(() => {
    set_item_list([]);
  }, [selectedPane.tab_id]);
  const grabChunk = (0, _react.useCallback)(async search_string => {
    let search_spec = {
      active_tag: null,
      search_string: search_string,
      search_inside: false,
      search_metadata: false,
      show_hidden: false,
      sort_field: "updated",
      sort_direction: "descending"
    };
    let data = {
      pane_type: "all",
      search_spec: search_spec,
      row_number: 0,
      number_to_get: 20,
      is_repository: false
    };
    try {
      let result_data = await (0, _communication_react.postAjaxPromise)("grab_all_list_chunk", data);
      let fItems = props.commandItems.filter(item => {
        return commandItemPredicate(search_string, item);
      });
      let gItems = _globalOmniItems().filter(item => {
        return commandItemPredicate(search_string, item);
      });
      fItems = fItems.concat(gItems);
      let rItems = Object.values(result_data.chunk_dict);
      for (let the_item of rItems) {
        the_item.item_type = "resource";
      }
      fItems = fItems.concat(rItems);
      set_item_list(fItems);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error grabbing resource chunk", e);
    }
  });
  const [waiting, doUpdate] = (0, _utilities_react.useDebounce)(grabChunk);
  function commandItemPredicate(query, item) {
    if (query.length == 0) {
      return false;
    }
    let lquery = query.toLowerCase();
    let re = new RegExp(lquery);
    return re.test(item.search_text.toLowerCase());
  }
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
    let {
      modifiers,
      handleClick
    } = _ref;
    if (item.item_type == "command") {
      return /*#__PURE__*/_react.default.createElement(TacticOmnibarItem, {
        key: item.search_text,
        modifiers: modifiers,
        item: item,
        handleClick: handleClick
      });
    }
    return /*#__PURE__*/_react.default.createElement(OpenOmnibarItem, {
      key: item.search_text,
      modifiers: modifiers,
      item: item,
      handleClick: handleClick
    });
  }
  function _onItemSelect(item) {
    if (item.item_type == "command") {
      item.the_function();
    } else {
      props.openFunc(item);
    }
    props.closeOmnibar();
  }
  function renderQueryList(listProps) {
    const {
      handleKeyDown,
      handleKeyUp
    } = listProps;
    const handlers = props.showOmnibar ? {
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp
    } : {};
    return /*#__PURE__*/_react.default.createElement(_core.Overlay, {
      hasBackdrop: true,
      isOpen: props.showOmnibar,
      className: _select.Classes.OMNIBAR_OVERLAY,
      onClose: props.closeOmnibar
    }, /*#__PURE__*/_react.default.createElement("div", (0, _extends2.default)({
      className: `${_select.Classes.OMNIBAR} ${listProps.className}`
    }, handlers), /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
      autoFocus: true,
      large: true,
      leftIcon: "cube",
      placeholder: "Search resources...",
      onChange: listProps.handleQueryChange,
      value: listProps.query
    }), listProps.itemList));
  }
  function _handle_signout() {
    window.open($SCRIPT_ROOT + "/logout/" + props.page_id, "_self");
    return false;
  }
  function _showSettings() {
    settingsContext.setShowSettingsDrawer(true);
  }
  function _globalOmniItems() {
    function wopenfunc(the_url) {
      return () => {
        window.open(the_url);
      };
    }
    let omni_funcs = [["Toggle Theme", "account", _toggleTheme, "contrast"], ["Settings", "account", _showSettings, "cog"], ["Errors", "account", errorDrawerFuncs.openErrorDrawer, "bug"], ["Docs", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"), "log-out"], ["Tile Commands", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Tile-Commands.html"), "code-block"], ["Object Api", "documentation", wopenfunc("https://tactic.readthedocs.io/en/latest/Object-Oriented-API.html"), "code-block"]];
    if (props.is_authenticated) {
      let new_funcs = [["New Context Tab", "window", wopenfunc(context_url), "add"], ["New Tabbed Window", "window", wopenfunc(library_url), "add"], ["Show Repository", "window", wopenfunc(repository_url), "database"], ["Show Account Info", "account", wopenfunc(account_url), "person"], ["Logout", "account", _handle_signout, "log-out"]];
      omni_funcs = omni_funcs.concat(new_funcs);
      if (window.has_openapi_key) {
        omni_funcs.push(["Show Assistant", "blah", assistantDrawerFuncs.openAssistantDrawer, "chat"]);
      }
    }
    let omni_items = [];
    for (let item of omni_funcs) {
      omni_items.push({
        category: "Global",
        display_text: item[0],
        search_text: item[0],
        icon_name: item[3],
        the_function: item[2],
        item_type: "command"
      });
    }
    return omni_items;
  }
  function _toggleTheme() {
    const new_theme = settingsContext.isDark() ? "light" : "dark";
    (0, _communication_react.postAjax)("update_settings", {
      theme: new_theme
    }, null);
  }
  return /*#__PURE__*/_react.default.createElement(_select.QueryList, {
    items: item_list,
    className: settingsContext.isDark() ? "bp5-dark" : "",
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
  return /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
    icon: props.item.icon_name,
    active: props.modifiers.active,
    text: props.item.display_text,
    label: props.item.category,
    key: props.item.search_text,
    onClick: _handleClick,
    shouldDismissPopover: true
  });
}
TacticOmnibarItem = /*#__PURE__*/(0, _react.memo)(TacticOmnibarItem);