"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t3 in e) "default" !== _t3 && {}.hasOwnProperty.call(e, _t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t3)) && (i.get || i.set) ? o(f, _t3, i) : f[_t3] = e[_t3]); return f; })(e, t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function TextIcon(props) {
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("span", {
    className: "bp6-icon",
    style: {
      fontWeight: 500
    }
  }, props.the_text));
}
TextIcon = /*#__PURE__*/(0, _react.memo)(TextIcon);
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
    onClick: _onPressed,
    key: props.fullname,
    active: props.active,
    size: "small",
    value: props.fullname,
    text: props.shortname
  });
}
ExportButtonListButton = /*#__PURE__*/(0, _react.memo)(ExportButtonListButton);
function ExportButtonList(props) {
  var top_ref = (0, _react.useRef)(null);
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
          group_items.push(/*#__PURE__*/_react["default"].createElement(ExportButtonListButton, {
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
        groups.unshift(/*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
          key: group,
          inline: false,
          label: null,
          className: "export-label"
        }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
          vertical: true,
          alignText: "left",
          key: group
        }, group_items)));
      } else {
        groups.push(/*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
          key: group,
          inline: false,
          label: group,
          className: "export-label"
        }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
          vertical: true,
          alignText: "left",
          key: group
        }, group_items)));
      }
    }
    return groups;
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    style: {
      flexDirection: "column",
      display: "flex",
      verticalAlign: "top",
      height: "100%",
      position: "relative"
    },
    className: "exports-button-list contingent-scroll"
  }, create_groups());
}
ExportButtonList = /*#__PURE__*/(0, _react.memo)(ExportButtonList);
function ExportsViewer(props) {
  props = _objectSpread({
    style: {}
  }, props);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
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
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(25),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    set_max_rows = _useStateAndRef4[1],
    max_rows_ref = _useStateAndRef4[2];
  var _useState9 = (0, _react.useState)(null),
    _useState0 = _slicedToArray(_useState9, 2),
    exports_info_value = _useState0[0],
    set_exports_info_value = _useState0[1];
  var _useState1 = (0, _react.useState)(null),
    _useState10 = _slicedToArray(_useState1, 2),
    selected_export_short_name = _useState10[0],
    set_selected_export_short_name = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    show_spinner = _useState12[0],
    set_show_spinner = _useState12[1];
  var _useState13 = (0, _react.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    running = _useState14[0],
    set_running = _useState14[1];
  var _useState15 = (0, _react.useState)(""),
    _useState16 = _slicedToArray(_useState15, 2),
    exports_body_value = _useState16[0],
    set_exports_body_value = _useState16[1];
  var _useState17 = (0, _react.useState)(null),
    _useState18 = _slicedToArray(_useState17, 2),
    set_type = _useState18[1];
  var _useState19 = (0, _react.useState)({}),
    _useState20 = _slicedToArray(_useState19, 2),
    pipe_dict = _useState20[0],
    set_pipe_dict = _useState20[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(function () {
    initSocket();
    props.setUpdate(_updateExportsList);
    _updateExportsList().then(function () {});
  }, []);
  function initSocket() {
    props.tsocket.attachListener("export-viewer-message", _handleExportViewerMessage);
  }
  function _handleExportViewerMessage(data) {
    if (data.main_id == props.main_id) {
      var handlerDict = {
        update_exports_popup: _updateExportsList,
        display_result: _displayResult,
        showMySpinner: _showMySpinner,
        stopMySpinner: _stopMySpinner,
        startMySpinner: _startMySpinner,
        got_export_info: _gotExportInfo
      };
      handlerDict[data["export_viewer_message"]](data);
    }
  }
  function _handleMaxRowsChange(new_value) {
    set_max_rows(parseInt(new_value));
    pushCallback(_eval);
  }
  function _updateExportsList() {
    return _updateExportsList2.apply(this, arguments);
  }
  function _updateExportsList2() {
    _updateExportsList2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var data, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            _context.p = 0;
            _context.n = 1;
            return (0, _communication_react.postPromise)(props.main_id, "get_full_pipe_dict", {}, props.main_id);
          case 1:
            data = _context.v;
            set_pipe_dict(data.pipe_dict);
            _context.n = 3;
            break;
          case 2:
            _context.p = 2;
            _t = _context.v;
            errorDrawerFuncs.addFromError("Error geting pipe didct", _t);
          case 3:
            return _context.a(2);
        }
      }, _callee, null, [[0, 2]]);
    }));
    return _updateExportsList2.apply(this, arguments);
  }
  function _displayResult(data) {
    set_exports_body_value(data["the_html"]);
    set_show_spinner(false);
    set_running(false);
  }
  function _eval() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    _showMySpinner();
    var send_data = {
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
    set_exports_info_value(data["info_string"]);
    set_tail_value("");
    set_show_spinner(false);
    set_running(false);
    set_key_list(new_key_list);
    set_key_list_value(new_key_list_value);
    pushCallback(_eval);
  }
  function _handleExportListChange(fullname, shortname, tilename) {
    var force_refresh = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
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
  function _sendToConsole() {
    return _sendToConsole2.apply(this, arguments);
  }
  function _sendToConsole2() {
    _sendToConsole2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var tail, tilename, shortname, key_string, the_text, _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            tail = tail_value;
            tilename = selected_export_tilename;
            shortname = selected_export_short_name;
            key_string = "";
            if (!(key_list == null)) {
              key_string = "[\"".concat(key_list_value, "\"]");
            }
            if (tilename == "__log__") {
              the_text = shortname + key_string + tail;
            } else {
              the_text = "Tiles[\"".concat(tilename, "\"][\"").concat(shortname, "\"]") + key_string + tail;
            }
            _context2.p = 1;
            _context2.n = 2;
            return (0, _communication_react.postPromise)("host", "print_code_area_to_console", {
              "console_text": the_text,
              "user_id": window.user_id,
              "main_id": props.main_id
            }, props.main_id);
          case 2:
            _context2.n = 4;
            break;
          case 3:
            _context2.p = 3;
            _t2 = _context2.v;
            errorDrawerFuncs.addFromError("Error creating code area", _t2);
          case 4:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 3]]);
    }));
    return _sendToConsole2.apply(this, arguments);
  }
  var exports_body_dict = {
    __html: exports_body_value
  };
  var exports_class = props.console_is_shrunk ? "am-shrunk" : "not-shrunk";
  var spinner_val = running ? null : 0;
  if (props.console_is_zoomed) {
    exports_class = "am-zoomed";
  }
  var outer_style = {
    width: "100%",
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    position: "relative",
    margin: 0
  };
  if (!props.console_is_shrunk) {
    outer_style.height = "100%";
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    elevation: props.console_is_shrunk ? 0 : 2,
    className: "exports-panel mr-3 " + exports_class,
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column justify-content-around",
    style: {
      flex: "1 1 0",
      position: "relative"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "exports-heading d-flex flex-row justify-content-start"
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
    className: "selected-export bottom-heading-element mr-2"
  }, selected_export_short_name), key_list && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.SelectList, {
    option_list: key_list,
    onChange: _handleKeyListChange,
    the_value: key_list_value,
    variant: "minimal",
    fontSize: 11
  }), /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    type: "text",
    size: "small",
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
  }))), !props.console_is_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flex: "1 1 0",
      minHeight: 0,
      display: "flex",
      flexDirection: "column",
      width: "100%",
      position: "relative",
      overflow: "auto"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: {
      flex: "1 1 0",
      minHeight: 0,
      width: "100%",
      position: "relative",
      overflow: "auto"
    }
  }, /*#__PURE__*/_react["default"].createElement(ExportButtonList, {
    pipe_dict: pipe_dict,
    value: selected_export_ref.current,
    handleChange: _handleExportListChange
  }), /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      flex: " 1 1 0",
      height: "100%",
      overflow: "auto"
    },
    className: "exports-body contingent-scroll",
    dangerouslySetInnerHTML: exports_body_dict
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "exports-footing d-flex flex-row justify-content-between"
  }, /*#__PURE__*/_react["default"].createElement("span", {
    className: "exports-info bottom-heading-element ml-2"
  }, exports_info_value), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "max rows",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.SelectList, {
    option_list: [25, 100, 250, 500],
    onChange: _handleMaxRowsChange,
    the_value: max_rows_ref.current,
    variant: "minimal",
    fontSize: 11
  }))))));
}
exports.ExportsViewer = ExportsViewer = /*#__PURE__*/(0, _react.memo)(ExportsViewer);