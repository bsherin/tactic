"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TileComponent = TileComponent;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _lodash = _interopRequireDefault(require("lodash"));
var _tile_form_react = require("./tile_form_react");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _drag_handle = require("./drag_handle");
var _communication_react = require("./communication_react");
var _utilities_react = require("./utilities_react");
var _error_boundary = require("./error_boundary");
var _menu_utilities = require("./menu_utilities");
var _searchable_console = require("./searchable_console");
var _modal_react = require("./modal_react");
var _error_drawer = require("./error_drawer");
var _widgets = require("./widgets");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t5 in e) "default" !== _t5 && {}.hasOwnProperty.call(e, _t5) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t5)) && (i.get || i.set) ? o(f, _t5, i) : f[_t5] = e[_t5]); return f; })(e, t); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); } // noinspection XmlDeprecatedElement
var using_touch = "ontouchend" in document;
var click_event = using_touch ? "touchstart" : "click";
var TILE_DISPLAY_AREA_MARGIN = 15;
var MIN_TILE_WIDTH = 150;
var MIN_TILE_HEIGHT = 100;
function SortHandle(props) {
  return /*#__PURE__*/_react["default"].createElement("span", _extends({
    className: "tile-name-div"
  }, props.dragHandleProps), /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: "drag-handle-vertical",
    size: 15
  }), props.tile_name);
}
SortHandle = /*#__PURE__*/(0, _react.memo)(SortHandle);
var menu_icons = {
  "Kill and reload": "refresh",
  "Kill, reload, and resubmit": "social-media",
  "Run me": "play",
  "Stop me": "stop",
  "Toggle console": "console",
  "Log me": "clipboard",
  "Log parameters": "th",
  "Edit my source": "edit",
  "Delete me": "trash"
};
var menu_button = /*#__PURE__*/_react["default"].createElement(_core.Button, {
  variant: "minimal",
  size: "small",
  icon: "more"
});
var alt_button = function alt_button() {
  return menu_button;
};
function TileComponent(props) {
  props = _objectSpread({
    log_since: null,
    max_console_lines: 100
  }, props);
  var my_ref = (0, _react.useRef)(null);
  var body_ref = (0, _react.useRef)(null);
  var inner_log_ref = (0, _react.useRef)(null);
  var tda_ref = (0, _react.useRef)(null);
  var log_ref = (0, _react.useRef)(null);
  var last_front_content = (0, _react.useRef)("");
  var _useState = (0, _react.useState)(34),
    _useState2 = _slicedToArray(_useState, 2),
    header_height = _useState2[0],
    set_header_height = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    resizing = _useState4[0],
    set_resizing = _useState4[1];
  var _useState5 = (0, _react.useState)(0),
    _useState6 = _slicedToArray(_useState5, 2),
    dwidth = _useState6[0],
    set_dwidth = _useState6[1];
  var _useState7 = (0, _react.useState)(0),
    _useState8 = _slicedToArray(_useState7, 2),
    dheight = _useState8[0],
    set_dheight = _useState8[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(function () {
    _broadcastTileSize(props.tile_width, props.tile_height);
    executeEmbeddedScripts();
    listen_for_clicks();
  }, []);
  (0, _react.useEffect)(function () {
    if (!resizing) {
      executeEmbeddedScripts();
    }
    listen_for_clicks();
    if (props.show_log) {
      if (log_ref && log_ref.current) {
        log_ref.current.scrollTo(0, log_ref.current.scrollHeight);
      }
    }
  });
  (0, _react.useEffect)(function () {
    _broadcastTileSize(props.tile_width, props.tile_height);
  }, [props.tile_width, props.tile_height]);

  // Broadcasting the tile size is necessary because some tiles (notably matplotlib tiles)
  // need to know the size of the display area.
  function _broadcastTileSize() {
    (0, _communication_react.postWithCallback)(props.tile_id, "TileSizeChange", {
      width: tdaWidth(),
      height: tdaHeight()
    }, null, null, props.local_id);
  }
  function _resizeTileArea(dx, dy) {
    var hheight = $(body_ref.current).position().top;
    set_header_height(hheight);
    var new_height = Math.max(MIN_TILE_HEIGHT, props.tile_height + dy);
    var new_width = Math.max(MIN_TILE_WIDTH, props.tile_width + dx);
    var new_state = {
      tile_height: new_height,
      tile_width: new_width
    };
    props.setTileState(props.tile_id, new_state);
  }
  function executeEmbeddedScripts() {
    if (props.front_content != last_front_content.current) {
      // to avoid doubles of bokeh images
      last_front_content.current = props.front_content;
      var scripts = $("#" + props.tile_id + " .tile-display-area script").toArray();
      var _iterator = _createForOfIteratorHelper(scripts),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var script = _step.value;
          try {
            window.eval(script.text);
          } catch (e) {}
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }

  // function makeTablesSortable() {
  //     let tables = $("#" + props.tile_id + " table.sortable").toArray();
  //     for (let table of tables) {
  //         sorttable.makeSortable(table)
  //     }
  // }

  function tdaWidth() {
    return props.tile_width + dwidth - TILE_DISPLAY_AREA_MARGIN * 2;
  }
  function tdaHeight() {
    return props.tile_height + dheight - header_height - TILE_DISPLAY_AREA_MARGIN * 2;
  }

  // function _executeJavascript() {
  //     try {
  //         if (!javascript_error_ref.current) {
  //             let selector = "[id='" + props.tile_id + "'] .jscript-target";
  //             eval(props.javascript_code)(selector, tdaWidth(), tdaHeight(), props.javascript_arg_dict, resizing)
  //         }
  //     } catch (err) {
  //         javascript_error_ref.current = true;
  //         errorDrawerFuncs.addErrorDrawerEntry({
  //             title: "Error evaluating javascript",
  //             content: err.message
  //         });
  //     }
  // }

  function _toggleTileLog() {
    props.setTileState(props.tile_id, {
      show_log: !props.show_log,
      show_form: false
    });
  }
  function _toggleShrunk() {
    props.setTileValue(props.tile_id, "shrunk", !props.shrunk);
  }
  function _closeTile() {
    return _closeTile2.apply(this, arguments);
  }
  function _closeTile2() {
    _closeTile2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
      var _t;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            _context4.p = 0;
            _context4.n = 1;
            return dialogFuncs.showModalPromise("ConfirmDialog", {
              title: "Delete Tile",
              text_body: "Delete tile ".concat(props.tile_name),
              cancel_text: "do nothing",
              submit_text: "delete",
              handleClose: dialogFuncs.hideModal
            });
          case 1:
            props.handleClose(props.tile_id);
            _context4.n = 3;
            break;
          case 2:
            _context4.p = 2;
            _t = _context4.v;
            if (_t != "canceled") {
              errorDrawerFuncs.addFromError("Error closing tile", _t);
            }
          case 3:
            return _context4.a(2);
        }
      }, _callee4, null, [[0, 2]]);
    }));
    return _closeTile2.apply(this, arguments);
  }
  function _standard_click_data() {
    return {
      tile_id: props.tile_id,
      local_id: props.local_id,
      doc_name: props.current_doc_name,
      active_row_id: props.selected_row
    };
  }
  function _updateOptionValue(_x, _x2) {
    return _updateOptionValue2.apply(this, arguments);
  }
  function _updateOptionValue2() {
    _updateOptionValue2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5(option_name, value) {
      var callback,
        data_dict,
        data,
        _args5 = arguments,
        _t2;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            callback = _args5.length > 2 && _args5[2] !== undefined ? _args5[2] : null;
            data_dict = {
              tile_id: props.tile_id,
              option_name: option_name,
              value: value
            };
            _context5.p = 1;
            _context5.n = 2;
            return (0, _communication_react.postPromise)(props.tile_id, "_update_single_option", data_dict);
          case 2:
            data = _context5.v;
            if (data && "form_data" in data) {
              props.setTileValue(props.tile_id, "form_data", data.form_data, callback);
            }
            _context5.n = 4;
            break;
          case 3:
            _context5.p = 3;
            _t2 = _context5.v;
            errorDrawerFuncs.addFromError("Error updating option value", _t2);
          case 4:
            return _context5.a(2);
        }
      }, _callee5, null, [[1, 3]]);
    }));
    return _updateOptionValue2.apply(this, arguments);
  }
  function _toggleBack() {
    props.setTileState(props.tile_id, {
      show_log: false,
      show_form: !props.show_form
    });
  }
  function _showTileBack() {
    props.setTileState(props.tile_id, {
      show_log: false,
      show_form: true
    });
  }
  function _handleSubmitOptions() {
    props.setTileState(props.tile_id, {
      show_form: false,
      show_spinner: true
    });
    var data = {};
    var _iterator2 = _createForOfIteratorHelper(props.form_data),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var opt = _step2.value;
        data[opt.name] = opt["starting_value"];
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    data.tile_id = props.tile_id;
    props.broadcast_event("UpdateOptions", data);
  }
  function _startSpinner() {
    props.setTileValue(props.tile_id, "show_spinner", true);
  }
  function _stopSpinner() {
    props.setTileValue(props.tile_id, "show_spinner", false);
  }
  function _displayFormContent(data) {
    props.setTileValue(props.tile_id, "form_data", data.form_data);
  }
  function spin_and_refresh() {
    return _spin_and_refresh.apply(this, arguments);
  }
  function _spin_and_refresh() {
    _spin_and_refresh = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _startSpinner();
            _context6.n = 1;
            return (0, _communication_react.postPromise)(props.tile_id, "RefreshTile", {}, props.local_id);
          case 1:
            _stopSpinner();
          case 2:
            return _context6.a(2);
        }
      }, _callee6);
    }));
    return _spin_and_refresh.apply(this, arguments);
  }
  function _reloadTile() {
    return _reloadTile2.apply(this, arguments);
  }
  function _reloadTile2() {
    _reloadTile2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
      var resubmit,
        data_dict,
        data,
        _args7 = arguments,
        _t3;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            resubmit = _args7.length > 0 && _args7[0] !== undefined ? _args7[0] : false;
            data_dict = {
              "tile_id": props.tile_id,
              "tile_name": props.tile_name
            };
            _context7.p = 1;
            _startSpinner();
            _context7.n = 2;
            return (0, _communication_react.postPromiseMain)(props.local_id, "reload_tile", data_dict, props.local_id);
          case 2:
            data = _context7.v;
            if (data.success) {
              _context7.n = 3;
              break;
            }
            errorDrawerFuncs.addErrorDrawerEntry({
              title: "Error reloading tile",
              content: data.message || "Unknown error"
            });
            return _context7.a(2);
          case 3:
            if (data.form_data) {
              _displayFormContent(data);
            }
            props.setTileValue(props.tile_id, "source_changed", false);
            if (!(data["options_changed"] || !resubmit)) {
              _context7.n = 4;
              break;
            }
            _stopSpinner();
            _showTileBack();
            _context7.n = 5;
            break;
          case 4:
            _context7.n = 5;
            return spin_and_refresh();
          case 5:
            _context7.n = 7;
            break;
          case 6:
            _context7.p = 6;
            _t3 = _context7.v;
            _stopSpinner();
            errorDrawerFuncs.addFromError("Error reloading tile", _t3);
          case 7:
            return _context7.a(2);
        }
      }, _callee7, null, [[1, 6]]);
    }));
    return _reloadTile2.apply(this, arguments);
  }
  function listen_for_clicks() {
    var selector = "#".concat(props.tile_id, " .raw-html-widget");
    $(selector).off();
    $(selector).on(click_event, '.element-clickable', function (e) {
      var data_dict = _standard_click_data();
      var dset = e.target.dataset;
      data_dict.dataset = {};
      for (var key in dset) {
        if (!dset.hasOwnProperty(key)) continue;
        data_dict.dataset[key] = dset[key];
      }
      (0, _communication_react.postWithCallback)(props.tile_id, "TileElementClick", data_dict, null, null, props.local_id);
      e.stopPropagation();
    });
    $(selector).on(click_event, '.word-clickable', function () {
      var data_dict = _standard_click_data();
      var s = window.getSelection();
      var range = s.getRangeAt(0);
      var node = s.anchorNode;
      while (range.toString().indexOf(' ') !== 0 && range.startOffset !== 0) {
        range.setStart(node, range.startOffset - 1);
      }
      var nlen = node.textContent.length;
      if (range.startOffset !== 0) {
        range.setStart(node, range.startOffset + 1);
      }
      do {
        range.setEnd(node, range.endOffset + 1);
      } while (range.toString().indexOf(' ') == -1 && range.toString().trim() !== '' && range.endOffset < nlen);
      data_dict.clicked_text = range.toString().trim();
      (0, _communication_react.postWithCallback)(props.tile_id, "TileWordClick", data_dict, null, null, props.local_id);
    });
    $(selector).on(click_event, '.cell-clickable', function () {
      var data_dict = _standard_click_data();
      data_dict.clicked_cell = $(this).text();
      (0, _communication_react.postWithCallback)(props.tile_id, "TileCellClick", data_dict, null, null, props.local_id);
    });
    $(selector).on(click_event, '.row-clickable', function () {
      var data_dict = _standard_click_data();
      var cells = $(this).children();
      var row_vals = [];
      cells.each(function () {
        row_vals.push($(this).text());
      });
      data_dict["clicked_row"] = row_vals;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileRowClick", data_dict, null, null, props.local_id);
    });
    $(selector).on(click_event, 'button', function (e) {
      var data_dict = _standard_click_data();
      data_dict["button_value"] = e.target.value;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileButtonClick", data_dict, null, null, props.local_id);
    });
    $(selector).on('submit', 'form', function (e) {
      var data_dict = _standard_click_data();
      var form_data = {};
      var the_form = e.target;
      for (var i = 0; i < the_form.length; i += 1) {
        form_data[the_form[i]["name"]] = the_form[i]["value"];
      }
      data_dict["form_data"] = form_data;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileFormSubmit", data_dict, null, null, props.local_id);
      return false;
    });
    $(selector).on("change", 'select', function (e) {
      var data_dict = _standard_click_data();
      data_dict.select_value = e.target.value;
      data_dict.select_name = e.target.name;
      (0, _communication_react.postWithCallback)(props.tile_id, "SelectChange", data_dict, null, null, props.local_id);
    });
    $(selector).on('change', 'textarea', function (e) {
      var data_dict = _standard_click_data();
      data_dict["text_value"] = e.target.value;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileTextAreaChange", data_dict, null, null, props.local_id);
    });
  }
  function logText() {
    (0, _communication_react.postWithCallback)(props.tile_id, "LogTile", {}, null, null, props.local_id);
  }
  function _stopMe() {
    (0, _communication_react.postWithCallback)("kill_" + props.tile_id, "StopMe", {}, null);
  }
  function _editMe() {
    return _editMe2.apply(this, arguments);
  }
  function _editMe2() {
    _editMe2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      var data, _t4;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            if (window.in_context) {
              _context8.n = 5;
              break;
            }
            window.blur();
            _context8.p = 1;
            _context8.n = 2;
            return (0, _communication_react.postPromise)("host", "go_to_module_viewer_if_exists", {
              user_id: window.user_id,
              tile_type: props.tile_type,
              line_number: 0
            }, props.local_id);
          case 2:
            data = _context8.v;
            window.open("", data["window_name"]);
            _context8.n = 4;
            break;
          case 3:
            _context8.p = 3;
            _t4 = _context8.v;
            window.open($SCRIPT_ROOT + "/view_location_in_creator/" + props.tile_type + "/" + "0");
          case 4:
            _context8.n = 6;
            break;
          case 5:
            props.goToModule(props.tile_type, 0);
          case 6:
            return _context8.a(2);
        }
      }, _callee8, null, [[1, 3]]);
    }));
    return _editMe2.apply(this, arguments);
  }
  function _logMe() {
    logText(props.front_content);
  }
  function _logParams() {
    var data_dict = {};
    data_dict["local_id"] = props.local_id;
    data_dict["tile_id"] = props.tile_id;
    data_dict["tile_name"] = props.tile_name;
    (0, _communication_react.postWithCallback)(props.tile_id, "LogParams", data_dict, null, null, props.local_id);
  }
  function _startResize() {
    set_resizing(true);
    set_dwidth(0);
    set_dheight(0);
  }
  function _onResize(e, ui, x, y, dx, dy) {
    set_dwidth(dx);
    set_dheight(dy);
  }
  function _stopResize(e, ui, x, y, dx, dy) {
    set_resizing(false);
    set_dwidth(0);
    set_dheight(0);
    pushCallback(function () {
      _resizeTileArea(dx, dy);
    });
  }
  var show_front = !props.show_form && !props.show_log;
  var outputWidgets = props.front_content.map(function (outputDict, idx) {
    var widgetKind = outputDict["widgetKind"];
    var widgetId = outputDict["widgetId"];
    var widgetData = outputDict["widgetData"];
    var the_widget;
    if (widgetKind in _widgets.widgetDict) {
      var WidgetComponent = _widgets.widgetDict[widgetKind];
      the_widget = /*#__PURE__*/_react["default"].createElement(WidgetComponent, {
        key: widgetId,
        widgetId: widgetId,
        local_id: props.local_id,
        console_id: null,
        tile_id: props.tile_id,
        row: idx,
        dispatch: null,
        tileWidth: tdaWidth(),
        tileHeight: tdaHeight(),
        resizing: resizing,
        widgetDict: _widgets.widgetDict,
        widgetData: widgetData,
        tsocket: props.tsocket
      });
    } else {
      var _WidgetComponent = _widgets.widgetDict["text"];
      the_widget = /*#__PURE__*/_react["default"].createElement(_WidgetComponent, {
        key: widgetId,
        widgetId: widgetId,
        local_id: props.local_id,
        row: idx,
        tile_id: props.tile_id,
        console_id: null,
        dispatch: null,
        resizing: resizing,
        widgetData: "Widget kind not found ".concat(widgetId, ", ").concat(widgetKind, " ").concat(widgetData)
      });
    }
    return the_widget;
  });
  var draghandle_position_dict = {
    position: "absolute",
    bottom: 2,
    right: 1
  };
  var tile_menu_options = {
    "Run me": _handleSubmitOptions,
    "Stop me": _stopMe,
    "divider99": "divider",
    "Kill and reload": function () {
      var _Kill_and_reload = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
        return _regenerator().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              _context.n = 1;
              return _reloadTile(false);
            case 1:
              return _context.a(2);
          }
        }, _callee);
      }));
      function Kill_and_reload() {
        return _Kill_and_reload.apply(this, arguments);
      }
      return Kill_and_reload;
    }(),
    "Kill, reload, and resubmit": function () {
      var _Kill_reload_and_resubmit = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
        return _regenerator().w(function (_context2) {
          while (1) switch (_context2.n) {
            case 0:
              _context2.n = 1;
              return _reloadTile(true);
            case 1:
              return _context2.a(2);
          }
        }, _callee2);
      }));
      function Kill_reload_and_resubmit() {
        return _Kill_reload_and_resubmit.apply(this, arguments);
      }
      return Kill_reload_and_resubmit;
    }(),
    "divider0": "divider",
    "Toggle console": _toggleTileLog,
    "divider1": "divider",
    "Log me": _logMe,
    "Log parameters": _logParams,
    "divider2": "divider",
    "Edit my source": _editMe,
    "divider3": "divider",
    "Delete me": _closeTile
  };
  var tile_height = props.shrunk ? header_height : props.tile_height;
  var tile_log_style = {
    overflow: "auto",
    width: "100%",
    height: "100%"
  };
  var main_style = {
    width: props.tile_width + dwidth,
    height: tile_height + dheight,
    display: "flex",
    flexDirection: "column",
    position: "relative"
  };
  if (!props.finished_loading) {
    main_style.opacity = .5;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    ref: my_ref,
    elevation: 2,
    style: main_style,
    className: "tile-panel",
    id: props.tile_id
  }, /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: props.source_changed ? "tile-panel-heading tile-source-changed" : "tile-panel-heading",
    style: {
      display: "flex",
      paddingRight: 10,
      flexDirection: "row",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "left-glyphs",
    style: {
      overflow: "hidden"
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, props.shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    handleClick: _toggleShrunk
  }), !props.shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrunk
  }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "primary",
    handleClick: _toggleBack,
    icon: "cog"
  }), /*#__PURE__*/_react["default"].createElement(SortHandle, {
    dragHandleProps: props.dragHandleProps,
    tile_name: props.tile_name
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "right-glyphs"
  }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, props.show_log && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "primary",
    handleClick: _toggleTileLog,
    icon: "console"
  }), props.source_changed && !props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "danger",
    handleClick: /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            _context3.n = 1;
            return _reloadTile(true);
          case 1:
            return _context3.a(2);
        }
      }, _callee3);
    })),
    icon: "social-media"
  }), props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "danger",
    handleClick: _stopMe,
    icon: "stop"
  }), props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 17
  }), /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
    option_dict: tile_menu_options,
    icon_dict: menu_icons,
    createOmniItems: false,
    item_class: "tile-menu-item",
    position: _core.PopoverPosition.BOTTOM_RIGHT,
    alt_button: alt_button
  })))), /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, !props.shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    ref: body_ref,
    style: {
      width: "100%",
      minHeight: 0,
      flex: "1 1 0",
      display: "flex",
      flexDirection: "column",
      padding: TILE_DISPLAY_AREA_MARGIN,
      overflow: "auto",
      position: "relative"
    },
    className: "tile-body"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "back ".concat(props.show_form ? "show-me" : "hide-me"),
    style: {
      width: "100%",
      height: "100%",
      overflow: "auto",
      position: "relative"
    }
  }, /*#__PURE__*/_react["default"].createElement(_tile_form_react.TileForm, {
    options: _lodash["default"].cloneDeep(props.form_data),
    tile_id: props.tile_id,
    updateValue: _updateOptionValue,
    handleSubmit: _handleSubmitOptions
  })), props.show_log && /*#__PURE__*/_react["default"].createElement("div", {
    className: "tile-log-area ".concat(props.show_log ? "show-me" : "hide-me"),
    style: {
      width: "100%",
      height: "100%",
      position: "relative"
    },
    ref: log_ref
  }, /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
    local_id: props.local_id,
    container_id: props.tile_id,
    ref: inner_log_ref,
    tsocket: props.tsocket,
    outer_style: tile_log_style,
    showCommandField: true
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "tile-display-area front ".concat(show_front ? "show-me" : "hide-me"),
    style: {
      width: "100%",
      position: "relative"
    },
    ref: tda_ref
  }, outputWidgets && outputWidgets.length > 0 ? outputWidgets : ""))), /*#__PURE__*/_react["default"].createElement(_drag_handle.DragHandle, {
    position_dict: draghandle_position_dict,
    dragStart: _startResize,
    onDrag: _onResize,
    dragEnd: _stopResize,
    direction: "both"
  })));
}
exports.TileComponent = TileComponent = /*#__PURE__*/(0, _react.memo)(TileComponent);