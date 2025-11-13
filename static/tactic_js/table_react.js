"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FreeformBody = FreeformBody;
exports.MainTableCard = MainTableCard;
exports.MainTableCardHeader = MainTableCardHeader;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _reactCodemirror = require("./react-codemirror6");
var _selector_advanced = require("./selector_advanced");
var _communication_react = require("./communication_react");
var _searchable_console = require("./searchable_console");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t3 in e) "default" !== _t3 && {}.hasOwnProperty.call(e, _t3) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t3)) && (i.get || i.set) ? o(f, _t3, i) : f[_t3] = e[_t3]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function FreeformBody(props) {
  var top_ref = (0, _react.useRef)(null);
  var cmobject = (0, _react.useRef)(null);
  var overlay = (0, _react.useRef)(null);
  function _setCMObject(lcmobject) {
    cmobject.current = lcmobject;
  }
  function _clearSearch() {
    if (cmobject.current && overlay.current) {
      cmobject.current.removeOverlay(overlay.current);
      overlay.current = null;
    }
  }
  function _doSearch() {
    if (props.mState.alt_search_text && props.mState.alt_search_text != "" && cmobject.current) {
      overlay.current = mySearchOverlay(props.mState.alt_search_text, true);
      cmobject.current.addOverlay(overlay.current);
    } else if (props.mState.search_text && props.mState.search_text != "" && cmobject) {
      overlay.current = mySearchOverlay(props.mState.search_text, true);
      cmobject.current.addOverlay(overlay.current);
    }
  }
  function mySearchOverlay(query, caseInsensitive) {
    if (typeof query == "string") {
      // noinspection RegExpRedundantEscape
      query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
    } else if (!query.global) query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");
    return {
      token: function token(stream) {
        query.lastIndex = stream.pos;
        var match = query.exec(stream.string);
        if (match && match.index == stream.pos) {
          stream.pos += match[0].length || 1;
          return "searching"; // I believe this causes the style .cm-searching to be applied
        } else if (match) {
          stream.pos = match.index;
        } else {
          stream.skipToEnd();
        }
      }
    };
  }
  function _handleBlur(new_data_text) {
    (0, _communication_react.postWithCallbackMain)(props.local_id, "add_freeform_document", {
      document_name: props.mState.table_spec.current_doc_name,
      doc_text: new_data_text
    }, null);
  }
  _clearSearch();
  _doSearch();
  return /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref
  }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
    handleChange: null,
    handleBlur: _handleBlur,
    code_content: props.mState.data_text,
    sync_to_prop: true,
    soft_wrap: props.mState.soft_wrap,
    mode: "text",
    controlled: true,
    setCMObject: _setCMObject,
    readOnly: !props.mState.spreadsheet_mode
  }));
}
exports.FreeformBody = FreeformBody = /*#__PURE__*/(0, _react.memo)(FreeformBody);
function MainTableCardHeader(props) {
  props = _objectSpread({
    is_freeform: false,
    soft_wrap: false,
    handleSoftWrapChange: null
  }, props);
  function _handleSearchFieldChange(event) {
    props.handleSearchFieldChange(event.target.value);
  }
  function _handleFilter() {
    return _handleFilter2.apply(this, arguments);
  }
  function _handleFilter2() {
    _handleFilter2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var data_dict, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            data_dict = {
              "text_to_find": props.mState.search_text
            };
            _context.p = 1;
            _context.n = 2;
            return (0, _communication_react.postPromiseMain)(props.local_id, "UnfilterTable", data_dict);
          case 2:
            if (!(props.search_text !== "")) {
              _context.n = 4;
              break;
            }
            _context.n = 3;
            return (0, _communication_react.postPromiseMain)(props.local_id, "FilterTable", data_dict);
          case 3:
            props.setMainStateValue({
              "table_is_filtered": true,
              "selected_regions": null,
              "selected_row": null
            });
          case 4:
            _context.n = 6;
            break;
          case 5:
            _context.p = 5;
            _t = _context.v;
            errorDrawerFuncs.addFromError("Error filtering table", _t);
          case 6:
            return _context.a(2);
        }
      }, _callee, null, [[1, 5]]);
    }));
    return _handleFilter2.apply(this, arguments);
  }
  function _handleUnFilter() {
    return _handleUnFilter2.apply(this, arguments);
  }
  function _handleUnFilter2() {
    _handleUnFilter2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var _t2;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            props.handleSearchFieldChange(null);
            _context2.p = 1;
            if (!props.mState.table_is_filtered) {
              _context2.n = 3;
              break;
            }
            _context2.n = 2;
            return (0, _communication_react.postPromiseMain)(props.local_id, "UnfilterTable", {
              selected_row: props.mState.selected_row
            });
          case 2:
            props.setMainStateValue({
              "table_is_filtered": false,
              "selected_regions": null,
              "selected_row": null
            });
          case 3:
            _context2.n = 5;
            break;
          case 4:
            _context2.p = 4;
            _t2 = _context2.v;
            errorDrawerFuncs.addFromError("Error unfiltering table", _t2);
          case 5:
            return _context2.a(2);
        }
      }, _callee2, null, [[1, 4]]);
    }));
    return _handleUnFilter2.apply(this, arguments);
  }
  function _handleSubmit(e) {
    e.preventDefault();
  }
  function _onChangeDoc(value) {
    props.handleChangeDoc(value);
  }
  var select_style = {
    height: 30,
    maxWidth: 250
  };
  var doc_button_text = /*#__PURE__*/_react["default"].createElement(_core.Text, {
    ellipsize: true
  }, props.mState.table_spec.current_doc_name);
  var outer_style = {
    display: "flex",
    height: 50,
    width: "100%",
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
    position: "relative"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "main-heading",
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(_searchable_console.ResponsiveFlex, {
    leftContent: /*#__PURE__*/_react["default"].createElement("div", {
      className: "heading-left d-flex flex-row"
    }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
      handleClick: props.toggleShrink,
      icon: "minimize"
    }), /*#__PURE__*/_react["default"].createElement("form", {
      className: "d-flex flex-row"
    }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
      label: props.mState.short_collection_name,
      inline: true,
      style: {
        marginBottom: 0,
        marginLeft: 5,
        marginRight: 10
      }
    }, /*#__PURE__*/_react["default"].createElement(_selector_advanced.BpSelect, {
      options: props.mState.doc_names,
      onChange: _onChangeDoc,
      buttonStyle: select_style,
      buttonTextObject: doc_button_text,
      value: props.mState.table_spec.current_doc_name
    })), props.mState.show_table_spinner && /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
      size: 15
    }))),
    rightContent: /*#__PURE__*/_react["default"].createElement("form", {
      onSubmit: _handleSubmit,
      style: {
        alignItems: "center"
      },
      className: "heading-right d-flex flex-row"
    }, props.is_freeform && /*#__PURE__*/_react["default"].createElement(_core.Switch, {
      label: "soft wrap",
      className: "mr-2 mb-0",
      size: "medium",
      checked: props.mState.soft_wrap,
      onChange: props.handleSoftWrapChange
    }), /*#__PURE__*/_react["default"].createElement(_core.Switch, {
      label: "edit",
      className: "mr-4 mb-0",
      size: "medium",
      checked: props.mState.spreadsheet_mode,
      onChange: props.handleSpreadsheetModeChange
    }), /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
      type: "search",
      leftIcon: "search",
      placeholder: "Search",
      value: !props.mState.search_text ? "" : props.mState.search_text,
      onChange: _handleSearchFieldChange,
      autoCapitalize: "none",
      autoCorrect: "off",
      className: "mr-2"
    }), /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, props.show_filter_button && /*#__PURE__*/_react["default"].createElement(_core.Button, {
      onClick: _handleFilter
    }, "Filter"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
      onClick: _handleUnFilter
    }, "Clear")))
  }));
}
exports.MainTableCardHeader = MainTableCardHeader = /*#__PURE__*/(0, _react.memo)(MainTableCardHeader);
function MainTableCard(props) {
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    className: "main-panel",
    elevation: 2,
    style: {
      display: "flex",
      flexDirection: "column",
      position: "relative",
      height: "100%",
      width: "100%"
    }
  }, props.card_header, /*#__PURE__*/_react["default"].createElement("div", {
    className: "table-wrapper",
    style: {
      flex: "1 1 0",
      minWidth: 0,
      display: "flex",
      position: "relative"
    }
  }, props.card_body));
}
MainTableCard.propTypes = {
  card_body: _propTypes["default"].object,
  card_header: _propTypes["default"].object
};
exports.MainTableCard = MainTableCard = /*#__PURE__*/(0, _react.memo)(MainTableCard);