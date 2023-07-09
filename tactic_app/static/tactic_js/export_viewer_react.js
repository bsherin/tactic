"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ExportsViewer = ExportsViewer;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _blueprint_react_widgets = require("./blueprint_react_widgets.js");
var _communication_react = require("./communication_react.js");
var _toaster = require("./toaster.js");
var _utilities_react = require("./utilities_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function TextIcon(props) {
  return /*#__PURE__*/_react["default"].createElement("ragment", null, /*#__PURE__*/_react["default"].createElement("span", {
    className: "bp5-icon",
    style: {
      fontWeight: 500
    }
  }, props.the_text));
}
TextIcon = /*#__PURE__*/(0, _react.memo)(TextIcon);
TextIcon.propTypes = {
  the_text: _propTypes["default"].string
};
var export_icon_dict = {
  str: "font",
  list: "array",
  range: "array",
  dict: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "{#}"
  }),
  set: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "{..}"
  }),
  tuple: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "(..)"
  }),
  bool: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "tf"
  }),
  bytes: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "b"
  }),
  NoneType: "small-cross",
  "int": "numerical",
  "float": "numerical",
  complex: "numerical",
  "function": "function",
  TacticDocument: "th",
  DetachedTacticDocument: "th",
  TacticCollection: "database",
  DetachedTacticCollection: "database",
  DetachedTacticRow: "th-derived",
  TacticRow: "th-derived",
  ndarray: "array-numeric",
  DataFrame: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "df"
  }),
  other: "cube",
  unknown: /*#__PURE__*/_react["default"].createElement(TextIcon, {
    the_text: "?"
  })
};
function ExportButtonListButton(props) {
  function _onPressed() {
    props.buttonPress(props.fullname);
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Button, {
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
ExportButtonListButton.propTypes = {
  fullname: _propTypes["default"].string,
  shortname: _propTypes["default"].string,
  type: _propTypes["default"].string,
  buttonPress: _propTypes["default"].func,
  active: _propTypes["default"].bool
};
function ExportButtonList(props) {
  var select_ref = (0, _react.useRef)(null);
  var export_index_ref = (0, _react.useRef)({});
  function _buttonPress(fullname) {
    props.handleChange(fullname, export_index_ref.current[fullname].shortname, export_index_ref.current[fullname].tilename);
  }
  function _compareEntries(a, b) {
    if (a[1].toLowerCase() == b[1].toLowerCase()) return 0;
    if (b[1].toLowerCase() > a[1].toLowerCase()) return -1;
    return 1;
  }
  function create_groups() {
    var groups = [];
    var group_names = Object.keys(props.pipe_dict);
    group_names.sort();
    var index = 0;
    for (var _i = 0, _group_names = group_names; _i < _group_names.length; _i++) {
      var group = _group_names[_i];
      var group_items = [];
      var entries = props.pipe_dict[group];
      entries.sort(_compareEntries);
      var _iterator = _createForOfIteratorHelper(entries),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          var fullname = entry[0];
          var shortname = entry[1];
          var type = entry.length == 3 ? entry[2] : "unknown";
          if (!(type in export_icon_dict)) {
            type = "other";
          }
          export_index_ref.current[fullname] = {
            tilename: group,
            shortname: shortname
          };
          group_items.push( /*#__PURE__*/_react["default"].createElement(ExportButtonListButton, {
            fullname: fullname,
            key: fullname,
            shortname: shortname,
            type: type,
            active: props.value == fullname,
            buttonPress: _buttonPress
          }));
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      if (group == "__log__") {
        groups.unshift( /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
          key: group,
          inline: false,
          label: null,
          className: "export-label"
        }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
          minimal: false,
          vertical: true,
          alignText: "left",
          key: group
        }, group_items)));
      } else {
        groups.push( /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
          key: group,
          inline: false,
          label: group,
          className: "export-label"
        }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
          minimal: false,
          vertical: true,
          alignText: "left",
          key: group
        }, group_items)));
      }
    }
    return groups;
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "exports-button-list",
    style: {
      flexDirection: "column",
      display: "inline-block",
      verticalAlign: "top",
      padding: 15,
      height: props.body_height
    },
    className: "contingent-scroll"
  }, create_groups());
}
ExportButtonList = /*#__PURE__*/(0, _react.memo)(ExportButtonList);
ExportButtonList.propTypes = {
  pipe_dict: _propTypes["default"].object,
  body_height: _propTypes["default"].number,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  handleChange: _propTypes["default"].func
};
function ExportsViewer(props) {
  var header_ref = (0, _react.useRef)(null);
  var footer_ref = (0, _react.useRef)(null);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    selected_export = _useStateAndRef2[0],
    set_selected_export = _useStateAndRef2[1],
    selected_export_ref = _useStateAndRef2[2];
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    selected_export_tilename = _useState2[0],
    set_selected_export_tilename = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    key_list = _useState4[0],
    set_key_list = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    key_list_value = _useState6[0],
    set_key_list_value = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = _slicedToArray(_useState7, 2),
    tail_value = _useState8[0],
    set_tail_value = _useState8[1];
  var _useState9 = (0, _react.useState)(25),
    _useState10 = _slicedToArray(_useState9, 2),
    max_rows = _useState10[0],
    set_max_rows = _useState10[1];
  var _useState11 = (0, _react.useState)(null),
    _useState12 = _slicedToArray(_useState11, 2),
    exports_info_value = _useState12[0],
    set_exports_info_value = _useState12[1];
  var _useState13 = (0, _react.useState)(null),
    _useState14 = _slicedToArray(_useState13, 2),
    selected_export_short_name = _useState14[0],
    set_selected_export_short_name = _useState14[1];
  var _useState15 = (0, _react.useState)(false),
    _useState16 = _slicedToArray(_useState15, 2),
    show_spinner = _useState16[0],
    set_show_spinner = _useState16[1];
  var _useState17 = (0, _react.useState)(false),
    _useState18 = _slicedToArray(_useState17, 2),
    running = _useState18[0],
    set_running = _useState18[1];
  var _useState19 = (0, _react.useState)(""),
    _useState20 = _slicedToArray(_useState19, 2),
    exports_body_value = _useState20[0],
    set_exports_body_value = _useState20[1];
  var _useState21 = (0, _react.useState)(null),
    _useState22 = _slicedToArray(_useState21, 2),
    type = _useState22[0],
    set_type = _useState22[1];
  var _useState23 = (0, _react.useState)({}),
    _useState24 = _slicedToArray(_useState23, 2),
    pipe_dict = _useState24[0],
    set_pipe_dict = _useState24[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    initSocket();
    props.setUpdate(_updateExportsList);
    _updateExportsList();
    return function () {
      props.tsocket.disconnect();
    };
  }, []);
  function initSocket() {
    props.tsocket.attachListener("export-viewer-message", _handleExportViewerMessage);
  }
  function _handleExportViewerMessage(data) {
    if (data.main_id == props.main_id) {
      var self = this;
      var handlerDict = {
        update_exports_popup: function update_exports_popup() {
          return _updateExportsList();
        },
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
    setState({
      max_rows: new_value
    }, _eval);
  }
  function _updateExportsList() {
    (0, _communication_react.postWithCallback)(props.main_id, "get_full_pipe_dict", {}, function (data) {
      set_pipe_dict(data.pipe_dict);
    }, null, props.main_id);
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
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    console.log("entering eval with selected_export ".concat(selected_export_ref.current));
    _showMySpinner();
    var send_data = {
      "export_name": selected_export_ref.current,
      "tail": tail_value,
      "max_rows": max_rows
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
    var force_refresh = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    console.log("entering handlexportlistchange with fullname ".concat(fullname));
    if (!force_refresh && fullname == selected_export_ref.current) return;
    set_show_spinner(true);
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
  function _bodyHeight() {
    if (header_ref && header_ref.current && footer_ref && footer_ref.current) {
      return props.available_height - $(header_ref.current).outerHeight() - $(footer_ref.current).outerHeight();
    } else {
      return props.available_height - 75;
    }
  }
  function _sendToConsole() {
    var tail = tail_value;
    var tilename = selected_export_tilename;
    var shortname = selected_export_short_name;
    var key_string = "";
    if (!(key_list == null)) {
      key_string = "[\"".concat(key_list_value, "\"]");
    }
    var the_text;
    if (tilename == "__log__") {
      the_text = shortname + key_string + tail;
    } else {
      the_text = "Tiles[\"".concat(tilename, "\"][\"").concat(shortname, "\"]") + key_string + tail;
    }
    var self = this;
    (0, _communication_react.postWithCallback)("host", "print_code_area_to_console", {
      "console_text": the_text,
      "user_id": window.user_id,
      "main_id": props.main_id
    }, function (data) {
      if (!data.success) {
        (0, _toaster.doFlash)(data);
      }
    }, null, props.main_id);
  }
  var exports_body_dict = {
    __html: exports_body_value
  };
  var butclass = "notclose bottom-heading-element bottom-heading-element-button";
  var exports_class = props.console_is_shrunk ? "am-shrunk" : "not-shrunk";
  var spinner_val = running ? null : 0;
  if (props.console_is_zoomed) {
    exports_class = "am-zoomed";
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    id: "exports-panel",
    elevation: 2,
    className: "mr-3 " + exports_class,
    style: props.style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "exports-heading",
    ref: header_ref,
    className: "d-flex flex-row justify-content-start"
  }, !show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _eval,
    intent: "primary",
    tooltip: "Send code to the console",
    style: {
      marginLeft: 6,
      marginTop: 2
    },
    icon: "play"
  }), show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _stopMe,
    intent: "danger",
    tooltip: "Send code to the console",
    style: {
      marginLeft: 6,
      marginTop: 2
    },
    icon: "stop"
  }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _sendToConsole,
    intent: "primary",
    tooltip: "Send code to the console",
    style: {
      marginLeft: 6,
      marginTop: 2
    },
    icon: "circle-arrow-left"
  }), Object.keys(pipe_dict).length > 0 && /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: _eval,
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    id: "selected-export",
    className: "bottom-heading-element mr-2"
  }, selected_export_short_name), key_list && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.SelectList, {
    option_list: key_list,
    onChange: _handleKeyListChange,
    the_value: key_list_value,
    minimal: true,
    fontSize: 11
  }), /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "text",
    small: true,
    onChange: _handleTailChange,
    onSubmit: _eval,
    value: tail_value,
    className: "export-tail"
  })), show_spinner && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginTop: 7,
      marginRight: 10,
      marginLeft: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 13,
    value: spinner_val
  }))), !props.console_is_shrunk && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex_row"
  }, /*#__PURE__*/_react["default"].createElement(ExportButtonList, {
    pipe_dict: pipe_dict,
    body_height: _bodyHeight(),
    value: selected_export_ref.current,
    handleChange: _handleExportListChange
  }), /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement("div", {
    id: "exports-body",
    style: {
      padding: 15,
      width: "80%",
      height: _bodyHeight(),
      display: "inline-block"
    },
    className: "contingent-scroll",
    dangerouslySetInnerHTML: exports_body_dict
  })), /*#__PURE__*/_react["default"].createElement("div", {
    id: "exports-footing",
    ref: footer_ref,
    className: "d-flex flex-row justify-content-between"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    id: "exports-info",
    className: "bottom-heading-element ml-2"
  }, exports_info_value), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "max rows",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.SelectList, {
    option_list: [25, 100, 250, 500],
    onChange: _handleMaxRowsChange,
    the_value: max_rows,
    minimal: true,
    fontSize: 11
  }))))));
}
exports.ExportsViewer = ExportsViewer = /*#__PURE__*/(0, _react.memo)(ExportsViewer);
ExportsViewer.propTypes = {
  available_height: _propTypes["default"].number,
  console_is_shrunk: _propTypes["default"].bool,
  console_is_zoomed: _propTypes["default"].bool,
  setUpdate: _propTypes["default"].func,
  style: _propTypes["default"].object
};
ExportsViewer.defaultProps = {
  style: {}
};