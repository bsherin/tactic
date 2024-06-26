"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportsViewer = ExportsViewer;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _blueprint_react_widgets = require("./blueprint_react_widgets.js");
var _communication_react = require("./communication_react.js");
var _utilities_react = require("./utilities_react");
var _error_drawer = require("./error_drawer");
var _sizing_tools = require("./sizing_tools");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const FOOTING_HEIGHT = 23;
function TextIcon(props) {
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("span", {
    className: "bp5-icon",
    style: {
      fontWeight: 500
    }
  }, props.the_text));
}
TextIcon = /*#__PURE__*/(0, _react.memo)(TextIcon);
const export_icon_dict = {
  str: "font",
  list: "array",
  range: "array",
  dict: /*#__PURE__*/_react.default.createElement(TextIcon, {
    the_text: "{#}"
  }),
  set: /*#__PURE__*/_react.default.createElement(TextIcon, {
    the_text: "{..}"
  }),
  tuple: /*#__PURE__*/_react.default.createElement(TextIcon, {
    the_text: "(..)"
  }),
  bool: /*#__PURE__*/_react.default.createElement(TextIcon, {
    the_text: "tf"
  }),
  bytes: /*#__PURE__*/_react.default.createElement(TextIcon, {
    the_text: "b"
  }),
  NoneType: "small-cross",
  int: "numerical",
  float: "numerical",
  complex: "numerical",
  function: "function",
  TacticDocument: "th",
  DetachedTacticDocument: "th",
  TacticCollection: "database",
  DetachedTacticCollection: "database",
  DetachedTacticRow: "th-derived",
  TacticRow: "th-derived",
  ndarray: "array-numeric",
  DataFrame: /*#__PURE__*/_react.default.createElement(TextIcon, {
    the_text: "df"
  }),
  other: "cube",
  unknown: /*#__PURE__*/_react.default.createElement(TextIcon, {
    the_text: "?"
  })
};
function ExportButtonListButton(props) {
  function _onPressed() {
    props.buttonPress(props.fullname);
  }
  return /*#__PURE__*/_react.default.createElement(_core.Button, {
    className: "export-button",
    icon: export_icon_dict[props.type],
    minimal: false,
    onClick: _onPressed,
    key: props.fullname,
    active: props.active,
    small: true,
    value: props.fullname,
    text: props.shortname
  });
}
ExportButtonListButton = /*#__PURE__*/(0, _react.memo)(ExportButtonListButton);
function ExportButtonList(props) {
  const top_ref = (0, _react.useRef)(null);
  const select_ref = (0, _react.useRef)(null);
  const export_index_ref = (0, _react.useRef)({});
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, 0, "ExportButtonList");
  function _buttonPress(fullname) {
    props.handleChange(fullname, export_index_ref.current[fullname].shortname, export_index_ref.current[fullname].tilename);
  }
  function _compareEntries(a, b) {
    if (a[1].toLowerCase() == b[1].toLowerCase()) return 0;
    if (b[1].toLowerCase() > a[1].toLowerCase()) return -1;
    return 1;
  }
  function create_groups() {
    let groups = [];
    let group_names = Object.keys(props.pipe_dict);
    group_names.sort();
    let index = 0;
    for (let group of group_names) {
      let group_items = [];
      let entries = props.pipe_dict[group];
      entries.sort(_compareEntries);
      for (let entry of entries) {
        let fullname = entry[0];
        let shortname = entry[1];
        let type = entry.length == 3 ? entry[2] : "unknown";
        if (!(type in export_icon_dict)) {
          type = "other";
        }
        export_index_ref.current[fullname] = {
          tilename: group,
          shortname: shortname
        };
        group_items.push( /*#__PURE__*/_react.default.createElement(ExportButtonListButton, {
          fullname: fullname,
          key: fullname,
          shortname: shortname,
          type: type,
          active: props.value == fullname,
          buttonPress: _buttonPress
        }));
      }
      if (group == "__log__") {
        groups.unshift( /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
          key: group,
          inline: false,
          label: null,
          className: "export-label"
        }, /*#__PURE__*/_react.default.createElement(_core.ButtonGroup, {
          minimal: false,
          vertical: true,
          alignText: "left",
          key: group
        }, group_items)));
      } else {
        groups.push( /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
          key: group,
          inline: false,
          label: group,
          className: "export-label"
        }, /*#__PURE__*/_react.default.createElement(_core.ButtonGroup, {
          minimal: false,
          vertical: true,
          alignText: "left",
          key: group
        }, group_items)));
      }
    }
    return groups;
  }
  return /*#__PURE__*/_react.default.createElement("div", {
    id: "exports-button-list",
    ref: top_ref,
    style: {
      flexDirection: "column",
      display: "inline-block",
      verticalAlign: "top",
      padding: 15,
      height: usable_height - FOOTING_HEIGHT
    },
    className: "contingent-scroll"
  }, create_groups());
}
ExportButtonList = /*#__PURE__*/(0, _react.memo)(ExportButtonList);
const body_style = {
  padding: 15,
  width: "80%",
  height: "100%",
  display: "inline-block"
};
function ExportsViewer(props) {
  props = {
    style: {},
    ...props
  };
  const header_ref = (0, _react.useRef)(null);
  const footer_ref = (0, _react.useRef)(null);
  const body_ref = (0, _react.useRef)(null);
  const [selected_export, set_selected_export, selected_export_ref] = (0, _utilities_react.useStateAndRef)("");
  const [selected_export_tilename, set_selected_export_tilename] = (0, _react.useState)(null);
  const [key_list, set_key_list] = (0, _react.useState)(null);
  const [key_list_value, set_key_list_value] = (0, _react.useState)(null);
  const [tail_value, set_tail_value] = (0, _react.useState)("");
  const [max_rows, set_max_rows, max_rows_ref] = (0, _utilities_react.useStateAndRef)(25);
  const [exports_info_value, set_exports_info_value] = (0, _react.useState)(null);
  const [selected_export_short_name, set_selected_export_short_name] = (0, _react.useState)(null);
  const [show_spinner, set_show_spinner] = (0, _react.useState)(false);
  const [running, set_running] = (0, _react.useState)(false);
  const [exports_body_value, set_exports_body_value] = (0, _react.useState)("");
  const [type, set_type] = (0, _react.useState)(null);
  const [pipe_dict, set_pipe_dict] = (0, _react.useState)({});
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(() => {
    initSocket();
    props.setUpdate(_updateExportsList);
    _updateExportsList().then(() => {});
  }, []);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(body_ref, 0, "ExportsViewer");
  function initSocket() {
    props.tsocket.attachListener("export-viewer-message", _handleExportViewerMessage);
  }
  function _handleExportViewerMessage(data) {
    if (data.main_id == props.main_id) {
      let handlerDict = {
        update_exports_popup: _updateExportsList,
        display_result: _displayResult,
        showMySpinner: _showMySpinner,
        stopMySpinner: _stopMySpinner,
        startMySpinner: _startMySpinner,
        got_export_info: _gotExportInfo
      };
      handlerDict[data.export_viewer_message](data);
    }
  }
  function _handleMaxRowsChange(new_value) {
    set_max_rows(parseInt(new_value));
    pushCallback(_eval);
  }
  async function _updateExportsList() {
    try {
      let data = await (0, _communication_react.postPromise)(props.main_id, "get_full_pipe_dict", {}, props.main_id);
      set_pipe_dict(data.pipe_dict);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error geting pipe didct", e);
    }
  }
  function _refresh() {
    _handleExportListChange(selected_export_ref.current, selected_export_short_name, true);
  }
  function _displayResult(data) {
    set_exports_body_value(data.the_html);
    set_show_spinner(false);
    set_running(false);
  }
  function _eval() {
    let e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    _showMySpinner();
    let send_data = {
      "export_name": selected_export_ref.current,
      "tail": tail_value,
      "max_rows": max_rows_ref.current
    };
    if (key_list) {
      send_data.key = key_list_value;
    }
    (0, _communication_react.postWithCallback)(props.main_id, "evaluate_export", send_data, null, null, props.main_id);
    if (e) e.preventDefault();
  }
  function _stopMe() {
    _stopMySpinner();
    (0, _communication_react.postWithCallback)(props.main_id, "stop_evaluate_export", {}, null, null, props.main_id);
  }
  function _showMySpinner() {
    set_show_spinner(true);
  }
  function _startMySpinner() {
    set_show_spinner(true);
    set_running(true);
  }
  function _stopMySpinner() {
    set_show_spinner(false);
    set_running(false);
  }
  function _gotExportInfo(data) {
    var new_key_list = null;
    var new_key_list_value = null;
    if (data.hasOwnProperty("key_list")) {
      new_key_list = data.key_list;
      if (data.hasOwnProperty("key_list_value")) {
        new_key_list_value = data.key_list_value;
      } else {
        if (new_key_list.length > 0) {
          new_key_list_value = data.key_list[0];
        }
      }
    }
    set_type(data.type);
    set_exports_info_value(data.info_string);
    set_tail_value("");
    set_show_spinner(false);
    set_running(false);
    set_key_list(new_key_list);
    set_key_list_value(new_key_list_value);
    pushCallback(_eval);
  }
  function _handleExportListChange(fullname, shortname, tilename) {
    let force_refresh = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (!force_refresh && fullname == selected_export_ref.current) return;
    // set_show_spinner(true);
    set_selected_export(fullname);
    set_selected_export_tilename(tilename);
    set_selected_export_short_name(shortname);
    (0, _communication_react.postWithCallback)(props.main_id, "get_export_info", {
      "export_name": fullname
    }, null, null, props.main_id);
  }
  function _handleKeyListChange(new_value) {
    set_key_list_value(new_value);
    pushCallback(_eval);
  }
  function _handleTailChange(event) {
    set_tail_value(event.target.value);
  }
  async function _sendToConsole() {
    const tail = tail_value;
    let tilename = selected_export_tilename;
    let shortname = selected_export_short_name;
    let key_string = "";
    if (!(key_list == null)) {
      key_string = `["${key_list_value}"]`;
    }
    let the_text;
    if (tilename == "__log__") {
      the_text = shortname + key_string + tail;
    } else {
      the_text = `Tiles["${tilename}"]["${shortname}"]` + key_string + tail;
    }
    try {
      await (0, _communication_react.postPromise)("host", "print_code_area_to_console", {
        "console_text": the_text,
        "user_id": window.user_id,
        "main_id": props.main_id
      }, props.main_id);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error creating code area", e);
    }
  }
  let exports_body_dict = {
    __html: exports_body_value
  };
  let butclass = "notclose bottom-heading-element bottom-heading-element-button";
  let exports_class = props.console_is_shrunk ? "am-shrunk" : "not-shrunk";
  let spinner_val = running ? null : 0;
  if (props.console_is_zoomed) {
    exports_class = "am-zoomed";
  }
  const usable_height_style = (0, _react.useMemo)(() => {
    return {
      height: usable_height
    };
  });
  const height_minus_footing_style = (0, _react.useMemo)(() => {
    return {
      height: usable_height - FOOTING_HEIGHT
    };
  });
  return /*#__PURE__*/_react.default.createElement(_core.Card, {
    id: "exports-panel",
    elevation: 2,
    className: "mr-3 " + exports_class,
    style: props.style
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react.default.createElement("div", {
    id: "exports-heading",
    ref: header_ref,
    className: "d-flex flex-row justify-content-start"
  }, !show_spinner && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _eval,
    intent: "primary",
    tooltip: "Send code to the console",
    style: {
      marginLeft: 6,
      marginTop: 2
    },
    icon: "play"
  }), show_spinner && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _stopMe,
    intent: "danger",
    tooltip: "Send code to the console",
    style: {
      marginLeft: 6,
      marginTop: 2
    },
    icon: "stop"
  }), /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _sendToConsole,
    intent: "primary",
    tooltip: "Send code to the console",
    style: {
      marginLeft: 6,
      marginTop: 2
    },
    icon: "circle-arrow-left"
  }), Object.keys(pipe_dict).length > 0 && /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: _eval,
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react.default.createElement("span", {
    id: "selected-export",
    className: "bottom-heading-element mr-2"
  }, selected_export_short_name), key_list && /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.SelectList, {
    option_list: key_list,
    onChange: _handleKeyListChange,
    the_value: key_list_value,
    minimal: true,
    fontSize: 11
  }), /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    type: "text",
    small: true,
    onChange: _handleTailChange,
    onSubmit: _eval,
    value: tail_value,
    className: "export-tail"
  })), show_spinner && /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginTop: 7,
      marginRight: 10,
      marginLeft: 10
    }
  }, /*#__PURE__*/_react.default.createElement(_core.Spinner, {
    size: 13,
    value: spinner_val
  }))), !props.console_is_shrunk && /*#__PURE__*/_react.default.createElement("div", {
    ref: body_ref,
    style: usable_height_style
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-row",
    style: height_minus_footing_style
  }, /*#__PURE__*/_react.default.createElement(ExportButtonList, {
    pipe_dict: pipe_dict,
    value: selected_export_ref.current,
    handleChange: _handleExportListChange
  }), /*#__PURE__*/_react.default.createElement(_core.Divider, null), /*#__PURE__*/_react.default.createElement("div", {
    id: "exports-body",
    style: body_style,
    className: "contingent-scroll",
    dangerouslySetInnerHTML: exports_body_dict
  })), /*#__PURE__*/_react.default.createElement("div", {
    id: "exports-footing",
    ref: footer_ref,
    className: "d-flex flex-row justify-content-between"
  }, /*#__PURE__*/_react.default.createElement("span", {
    id: "exports-info",
    className: "bottom-heading-element ml-2"
  }, exports_info_value), /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: "max rows",
    inline: true
  }, /*#__PURE__*/_react.default.createElement(_blueprint_react_widgets.SelectList, {
    option_list: [25, 100, 250, 500],
    onChange: _handleMaxRowsChange,
    the_value: max_rows_ref.current,
    minimal: true,
    fontSize: 11
  }))))));
}
exports.ExportsViewer = ExportsViewer = /*#__PURE__*/(0, _react.memo)(ExportsViewer);