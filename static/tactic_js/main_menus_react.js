"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ColumnMenu = ColumnMenu;
exports.DocumentMenu = DocumentMenu;
Object.defineProperty(exports, "MenuComponent", {
  enumerable: true,
  get: function get() {
    return _menu_utilities.MenuComponent;
  }
});
exports.ProjectMenu = ProjectMenu;
exports.RowMenu = RowMenu;
exports.ViewMenu = ViewMenu;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _server = require("react-dom/server");
var _communication_react = require("./communication_react");
var _menu_utilities = require("./menu_utilities");
var _modal_react = require("./modal_react");
var _toaster = require("./toaster");
var _error_drawer = require("./error_drawer");
var _widgets = require("./widgets");
var _error_boundary = require("./error_boundary");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t14 in e) "default" !== _t14 && {}.hasOwnProperty.call(e, _t14) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t14)) && (i.get || i.set) ? o(f, _t14, i) : f[_t14] = e[_t14]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var mdi = (0, _markdownIt["default"])({
  html: true
});
mdi.use(_markdownItLatex["default"]);
function ProjectMenu(props) {
  props = _objectSpread({
    disabled_items: []
  }, props);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var save_state;
  if (props.is_notebook) save_state = {
    console_items: props.console_items,
    show_exports_pane: props.mState.show_exports_pane,
    console_width_fraction: props.mState.console_width_fraction
  };else {
    save_state = {
      console_items: props.console_items,
      tile_list: props.tile_list,
      table_is_shrunk: props.mState.table_is_shrunk,
      horizontal_fraction: props.mState.horizontal_fraction,
      console_is_shrunk: props.mState.console_is_shrunk,
      height_fraction: props.mState.height_fraction,
      show_console_pane: props.mState.show_console_pane,
      console_is_zoomed: props.mState.console_is_zoomed,
      show_exports_pane: props.mState.show_exports_pane,
      console_width_fraction: props.mState.console_width_fraction
    };
  }
  function _saveProjectAs() {
    return _saveProjectAs2.apply(this, arguments);
  }
  function _saveProjectAs2() {
    _saveProjectAs2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
      var data, checkboxes, _yield$dialogFuncs$sh, _yield$dialogFuncs$sh2, new_name, checkbox_states, lite_save, result_dict, data_object, title, _t;
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            statusFuncs.startSpinner();
            _context3.n = 1;
            return (0, _communication_react.postPromise)("host", "get_project_names_task", {
              "user_id": window.user_id
            }, props.local_id);
          case 1:
            data = _context3.v;
            checkboxes = null;
            if (window.allow_heavy_saves) {
              checkboxes = [{
                checkname: "lite_save",
                checktext: "create lite save"
              }];
            }
            _context3.p = 2;
            _context3.n = 3;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Save Project As",
              field_title: "New Project Name",
              default_value: "NewProject",
              existing_names: data.project_names,
              checkboxes: checkboxes,
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            _yield$dialogFuncs$sh = _context3.v;
            _yield$dialogFuncs$sh2 = _slicedToArray(_yield$dialogFuncs$sh, 2);
            new_name = _yield$dialogFuncs$sh2[0];
            checkbox_states = _yield$dialogFuncs$sh2[1];
            if (window.allow_heavy_saves) {
              lite_save = checkbox_states["lite_save"];
            } else {
              lite_save = true;
            }
            result_dict = {
              "project_name": new_name,
              "local_id": props.local_id,
              "doc_type": "table",
              "purgetiles": true,
              "lite_save": lite_save
            };
            result_dict.interface_state = save_state;
            if (!props.is_notebook) {
              _context3.n = 5;
              break;
            }
            _context3.n = 4;
            return (0, _communication_react.postPromiseMain)(props.local_id, "save_new_notebook_project_task", result_dict, props.local_id);
          case 4:
            _context3.n = 6;
            break;
          case 5:
            result_dict["purgetiles"] = true;
            _context3.n = 6;
            return (0, _communication_react.postPromiseMain)(props.local_id, "save_new_project_task", result_dict, props.local_id);
          case 6:
            props.setProjectName(new_name, function () {
              if (!window.in_context) {
                document.title = new_name;
              }
              statusFuncs.clearStatusMessage();
              props.updateLastSave();
              statusFuncs.stopSpinner();
              statusFuncs.statusMessage("Saved project ".concat(new_name));
            });
            _context3.n = 8;
            break;
          case 7:
            _context3.p = 7;
            _t = _context3.v;
            if (_t != "canceled") {
              title = "title" in _t ? _t.title : "Error saving project";
              errorDrawerFuncs.addFromError(title, _t);
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
          case 8:
            return _context3.a(2);
        }
      }, _callee3, null, [[2, 7]]);
    }));
    return _saveProjectAs2.apply(this, arguments);
  }
  function _saveProject(_x) {
    return _saveProject2.apply(this, arguments);
  }
  function _saveProject2() {
    _saveProject2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(lite_save) {
      var result_dict, title, _t2;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            _context4.p = 0;
            result_dict = {
              local_id: props.local_id,
              project_name: props.project_name,
              lite_save: lite_save
            };
            result_dict.interface_state = save_state;
            statusFuncs.startSpinner();
            _context4.n = 1;
            return (0, _communication_react.postPromiseMain)(props.local_id, "update_project_task", result_dict, props.local_id);
          case 1:
            props.updateLastSave();
            statusFuncs.statusMessage("Saved project ".concat(props.project_name));
            statusFuncs.stopSpinner();
            _context4.n = 3;
            break;
          case 2:
            _context4.p = 2;
            _t2 = _context4.v;
            title = "title" in _t2 ? _t2.title : "Error saving project";
            errorDrawerFuncs.addFromError(title, _t2);
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
          case 3:
            return _context4.a(2);
        }
      }, _callee4, null, [[0, 2]]);
    }));
    return _saveProject2.apply(this, arguments);
  }
  function _exportAsPresentation() {
    return _exportAsPresentation2.apply(this, arguments);
  }
  function _exportAsPresentation2() {
    _exportAsPresentation2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var data, _yield$dialogFuncs$sh3, _yield$dialogFuncs$sh4, use_dark_theme, save_as_collection, collection_name, cell_list, _iterator2, _step2, entry, new_entry, container, target, fcontainer, ftarget, result_dict, data_object, title, _t3, _t4, _t5;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            _context5.p = 0;
            _context5.n = 1;
            return (0, _communication_react.postPromise)("host", "get_collection_names_task", {
              "user_id": user_id
            }, props.local_id);
          case 1:
            data = _context5.v;
            _context5.n = 2;
            return dialogFuncs.showModalPromise("PresentationDialog", {
              default_value: "NewPresentation",
              existing_names: data.collection_names,
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            _yield$dialogFuncs$sh3 = _context5.v;
            _yield$dialogFuncs$sh4 = _slicedToArray(_yield$dialogFuncs$sh3, 3);
            use_dark_theme = _yield$dialogFuncs$sh4[0];
            save_as_collection = _yield$dialogFuncs$sh4[1];
            collection_name = _yield$dialogFuncs$sh4[2];
            cell_list = [];
            _iterator2 = _createForOfIteratorHelper(props.console_items);
            _context5.p = 3;
            _iterator2.s();
          case 4:
            if ((_step2 = _iterator2.n()).done) {
              _context5.n = 13;
              break;
            }
            entry = _step2.value;
            new_entry = {};
            new_entry.type = entry.type;
            _t3 = entry.type;
            _context5.n = _t3 === "text" ? 5 : _t3 === "code" ? 6 : _t3 === "fixed" ? 7 : _t3 === "divider" ? 8 : _t3 === "figure" ? 9 : 10;
            break;
          case 5:
            new_entry.console_text = mdi.render(entry.console_text);
            new_entry.raw_text = entry.console_text;
            new_entry.summary_text = entry.summary_text;
            return _context5.a(3, 11);
          case 6:
            new_entry.console_text = entry.console_text;
            new_entry.output_text = entry.output_text;
            container = document.getElementById(entry.unique_id);
            target = container.querySelector(".log-code-output");
            new_entry.output_text = target ? exportStyledSubtree(target) : "";
            new_entry.summary_text = entry.summary_text;
            return _context5.a(3, 11);
          case 7:
            fcontainer = document.getElementById(entry.unique_id);
            ftarget = fcontainer.querySelector(".log-panel-body");
            new_entry.output_text = ftarget ? exportStyledSubtree(ftarget) : "";
            new_entry.summary_text = entry.summary_text;
            return _context5.a(3, 11);
          case 8:
            new_entry.header_text = entry.header_text;
            new_entry.summary_text = "";
            return _context5.a(3, 11);
          case 9:
            new_entry.image_data_str = entry.image_data_str;
            new_entry.summary_text = entry.summary_text;
            return _context5.a(3, 11);
          case 10:
            new_entry.console_text = entry.console_text;
            new_entry.summary_text = entry.summary_text;
            return _context5.a(3, 11);
          case 11:
            cell_list.push(new_entry);
          case 12:
            _context5.n = 4;
            break;
          case 13:
            _context5.n = 15;
            break;
          case 14:
            _context5.p = 14;
            _t4 = _context5.v;
            _iterator2.e(_t4);
          case 15:
            _context5.p = 15;
            _iterator2.f();
            return _context5.f(15);
          case 16:
            result_dict = {
              "project_name": props.project_name,
              "collection_name": collection_name,
              "save_as_collection": save_as_collection,
              "use_dark_theme": use_dark_theme,
              "presentation": true,
              "local_id": props.local_id,
              "cell_list": cell_list
            };
            _context5.n = 17;
            return (0, _communication_react.postPromiseMain)(props.local_id, "export_as_presentation", result_dict, props.local_id);
          case 17:
            data_object = _context5.v;
            statusFuncs.clearStatusMessage();
            if (save_as_collection) {
              statusFuncs.statusMessage("Exported presentation");
            } else {
              window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data_object["temp_id"]));
            }
            _context5.n = 19;
            break;
          case 18:
            _context5.p = 18;
            _t5 = _context5.v;
            if (_t5 != "canceled") {
              title = "title" in _t5 ? _t5.title : "Error exporting presentation";
              errorDrawerFuncs.addFromError(title, _t5);
            }
          case 19:
            return _context5.a(2);
        }
      }, _callee5, null, [[3, 14, 15, 16], [0, 18]]);
    }));
    return _exportAsPresentation2.apply(this, arguments);
  }
  function exportStyledSubtree(rootEl) {
    var clone = rootEl.cloneNode(true);
    function copyComputedStyle(src, dest) {
      var cs = window.getComputedStyle(src);

      // Copy every computed property as inline style
      dest.style.cssText = Array.from(cs).map(function (prop) {
        return "".concat(prop, ":").concat(cs.getPropertyValue(prop), ";");
      }).join("");

      // If you rely on pseudo-elements, you may need a separate strategy (see notes).
      var srcKids = Array.from(src.children);
      var destKids = Array.from(dest.children);
      for (var i = 0; i < srcKids.length; i++) {
        copyComputedStyle(srcKids[i], destKids[i]);
      }
    }
    copyComputedStyle(rootEl, clone);
    return clone.outerHTML;
  }
  function _exportAsReport() {
    return _exportAsReport2.apply(this, arguments);
  }
  function _exportAsReport2() {
    _exportAsReport2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
      var data, _yield$dialogFuncs$sh5, _yield$dialogFuncs$sh6, collapsible, include_summaries, use_dark_theme, save_as_collection, collection_name, cell_list, _iterator3, _step3, entry, new_entry, container, target, fcontainer, ftarget, result_dict, data_object, title, _t6, _t7, _t8;
      return _regenerator().w(function (_context6) {
        while (1) switch (_context6.n) {
          case 0:
            _context6.p = 0;
            _context6.n = 1;
            return (0, _communication_react.postPromise)("host", "get_collection_names_task", {
              "user_id": user_id
            }, props.local_id);
          case 1:
            data = _context6.v;
            _context6.n = 2;
            return dialogFuncs.showModalPromise("ReportDialog", {
              default_value: "NewReport",
              existing_names: data.collection_names,
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            _yield$dialogFuncs$sh5 = _context6.v;
            _yield$dialogFuncs$sh6 = _slicedToArray(_yield$dialogFuncs$sh5, 5);
            collapsible = _yield$dialogFuncs$sh6[0];
            include_summaries = _yield$dialogFuncs$sh6[1];
            use_dark_theme = _yield$dialogFuncs$sh6[2];
            save_as_collection = _yield$dialogFuncs$sh6[3];
            collection_name = _yield$dialogFuncs$sh6[4];
            cell_list = [];
            _iterator3 = _createForOfIteratorHelper(props.console_items);
            _context6.p = 3;
            _iterator3.s();
          case 4:
            if ((_step3 = _iterator3.n()).done) {
              _context6.n = 13;
              break;
            }
            entry = _step3.value;
            new_entry = {};
            new_entry.type = entry.type;
            _t6 = entry.type;
            _context6.n = _t6 === "text" ? 5 : _t6 === "code" ? 6 : _t6 === "fixed" ? 7 : _t6 === "divider" ? 8 : _t6 === "figure" ? 9 : 10;
            break;
          case 5:
            new_entry.console_text = mdi.render(entry.console_text);
            new_entry.raw_text = entry.console_text;
            new_entry.summary_text = entry.summary_text;
            return _context6.a(3, 11);
          case 6:
            new_entry.console_text = entry.console_text;
            container = document.getElementById(entry.unique_id);
            target = container.querySelector(".log-code-output");
            new_entry.output_text = target ? exportStyledSubtree(target) : "";
            new_entry.summary_text = entry.summary_text;
            return _context6.a(3, 11);
          case 7:
            fcontainer = document.getElementById(entry.unique_id);
            ftarget = fcontainer.querySelector(".log-panel-body");
            new_entry.output_text = ftarget ? exportStyledSubtree(ftarget) : "";
            new_entry.summary_text = entry.summary_text;
            return _context6.a(3, 11);
          case 8:
            new_entry.header_text = entry.header_text;
            return _context6.a(3, 11);
          case 9:
            new_entry.image_data_str = entry.image_data_str;
            new_entry.summary_text = entry.summary_text;
            return _context6.a(3, 11);
          case 10:
            new_entry.console_text = entry.console_text;
            new_entry.summary_text = entry.summary_text;
            return _context6.a(3, 11);
          case 11:
            cell_list.push(new_entry);
          case 12:
            _context6.n = 4;
            break;
          case 13:
            _context6.n = 15;
            break;
          case 14:
            _context6.p = 14;
            _t7 = _context6.v;
            _iterator3.e(_t7);
          case 15:
            _context6.p = 15;
            _iterator3.f();
            return _context6.f(15);
          case 16:
            result_dict = {
              "project_name": props.project_name,
              "collection_name": collection_name,
              "save_as_collection": save_as_collection,
              "use_dark_theme": use_dark_theme,
              "collapsible": collapsible,
              "include_summaries": include_summaries,
              "local_id": props.local_id,
              "cell_list": cell_list
            };
            _context6.n = 17;
            return (0, _communication_react.postPromiseMain)(props.local_id, "export_as_report", result_dict, props.local_id);
          case 17:
            data_object = _context6.v;
            statusFuncs.clearStatusMessage();
            if (save_as_collection) {
              data_object.alert_type = "alert-success";
              data_object.timeout = 2000;
              statusFuncs.statusMessage("Exported report");
            } else {
              window.open("".concat($SCRIPT_ROOT, "/load_temp_page/").concat(data_object["temp_id"]));
            }
            _context6.n = 19;
            break;
          case 18:
            _context6.p = 18;
            _t8 = _context6.v;
            if (_t8 != "canceled") {
              title = "title" in _t8 ? _t8.title : "Error exporting report";
              errorDrawerFuncs.addFromError(title, _t8);
            }
            statusFuncs.clearStatusMessage();
          case 19:
            return _context6.a(2);
        }
      }, _callee6, null, [[3, 14, 15, 16], [0, 18]]);
    }));
    return _exportAsReport2.apply(this, arguments);
  }
  function _exportAsJupyter() {
    return _exportAsJupyter2.apply(this, arguments);
  }
  function _exportAsJupyter2() {
    _exportAsJupyter2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
      var data, new_name, cell_list, _iterator4, _step4, entry, new_cell, result_dict, data_object, title, _t9, _t0;
      return _regenerator().w(function (_context7) {
        while (1) switch (_context7.n) {
          case 0:
            statusFuncs.startSpinner();
            _context7.p = 1;
            _context7.n = 2;
            return (0, _communication_react.postPromise)("host", "get_project_names_task", {
              "user_id": user_id
            }, props.local_id);
          case 2:
            data = _context7.v;
            _context7.n = 3;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Export Notebook in Jupyter Format",
              field_title: "New Project Name",
              default_value: "NewJupyter",
              existing_names: data.project_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 3:
            new_name = _context7.v;
            cell_list = [];
            _iterator4 = _createForOfIteratorHelper(props.console_items);
            _context7.p = 4;
            _iterator4.s();
          case 5:
            if ((_step4 = _iterator4.n()).done) {
              _context7.n = 8;
              break;
            }
            entry = _step4.value;
            if (!(entry.type == "section-end")) {
              _context7.n = 6;
              break;
            }
            return _context7.a(3, 7);
          case 6:
            new_cell = {};
            if (entry.type == "divider") {
              new_cell.cell_type = "markdown";
              new_cell.source = "# " + entry.header_text;
            } else {
              new_cell.source = entry.console_text;
              new_cell.cell_type = entry.type == "code" ? "code" : "markdown";
              if (entry.type == "code") {
                new_cell.outputs = [];
              }
            }
            cell_list.push(new_cell);
          case 7:
            _context7.n = 5;
            break;
          case 8:
            _context7.n = 10;
            break;
          case 9:
            _context7.p = 9;
            _t9 = _context7.v;
            _iterator4.e(_t9);
          case 10:
            _context7.p = 10;
            _iterator4.f();
            return _context7.f(10);
          case 11:
            result_dict = {
              "project_name": new_name,
              "local_id": props.local_id,
              "cell_list": cell_list
            };
            _context7.n = 12;
            return (0, _communication_react.postPromiseMain)(props.local_id, "export_to_jupyter_notebook", result_dict, props.local_id);
          case 12:
            data_object = _context7.v;
            statusFuncs.statusMessage("Exported jupyter notebook");
            statusFuncs.stopSpinner();
            _context7.n = 14;
            break;
          case 13:
            _context7.p = 13;
            _t0 = _context7.v;
            if (_t0 != "canceled") {
              title = "title" in _t0 ? _t0.title : "Error exporting as Jupyter notebook";
              errorDrawerFuncs.addFromError(title, _t0);
            }
            statusFuncs.clearStatusMessage();
            statusFuncs.stopSpinner();
          case 14:
            return _context7.a(2);
        }
      }, _callee7, null, [[4, 9, 10, 11], [1, 13]]);
    }));
    return _exportAsJupyter2.apply(this, arguments);
  }
  function _exportDataTable() {
    return _exportDataTable2.apply(this, arguments);
  }
  function _exportDataTable2() {
    _exportDataTable2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
      var data, new_name, result_dict, _t1;
      return _regenerator().w(function (_context8) {
        while (1) switch (_context8.n) {
          case 0:
            _context8.p = 0;
            _context8.n = 1;
            return (0, _communication_react.postPromise)("host", "get_collection_names_task", {
              "user_id": user_id
            });
          case 1:
            data = _context8.v;
            _context8.n = 2;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Export Data",
              field_title: "New Collection NameName",
              default_value: "new collection",
              existing_names: data.collection_names,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 2:
            new_name = _context8.v;
            result_dict = {
              "export_name": new_name,
              "local_id": props.local_id,
              "user_id": window.user_id
            };
            _context8.n = 3;
            return (0, _communication_react.postAjaxPromise)("export_data", result_dict);
          case 3:
            statusFuncs.statusMessage("Exported table as collection");
            _context8.n = 5;
            break;
          case 4:
            _context8.p = 4;
            _t1 = _context8.v;
            if (_t1 != "canceled") {
              errorDrawerFuncs.addFromError("Error exporting table", _t1);
            }
          case 5:
            return _context8.a(2);
        }
      }, _callee8, null, [[0, 4]]);
    }));
    return _exportDataTable2.apply(this, arguments);
  }
  function _consoleToNotebook() {
    return _consoleToNotebook2.apply(this, arguments);
  }
  function _consoleToNotebook2() {
    _consoleToNotebook2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
      var result_dict, _t10;
      return _regenerator().w(function (_context9) {
        while (1) switch (_context9.n) {
          case 0:
            _context9.p = 0;
            result_dict = {
              "local_id": props.local_id,
              "console_items": props.console_items,
              "user_id": window.user_id
            };
            _context9.n = 1;
            return (0, _communication_react.postPromiseMain)(props.local_id, "console_to_notebook", result_dict, props.local_id);
          case 1:
            _context9.n = 3;
            break;
          case 2:
            _context9.p = 2;
            _t10 = _context9.v;
            errorDrawerFuncs.addFromError("Error converting to notebook", _t10);
          case 3:
            return _context9.a(2);
        }
      }, _callee9, null, [[0, 2]]);
    }));
    return _consoleToNotebook2.apply(this, arguments);
  }
  function menu_items() {
    var cc_name;
    var cc_icon;
    if (props.mState.doc_type == "none") {
      cc_name = "Add Collection";
      cc_icon = "add";
    } else {
      cc_name = "Change Collection";
      cc_icon = "exchange";
    }
    var items = [{
      name_text: "Save As...",
      icon_name: "floppy-disk",
      click_handler: _saveProjectAs
    }, {
      name_text: "Save",
      icon_name: "saved",
      click_handler: function () {
        var _click_handler = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
          return _regenerator().w(function (_context) {
            while (1) switch (_context.n) {
              case 0:
                _context.n = 1;
                return _saveProject(!window.allow_heavy_saves);
              case 1:
                return _context.a(2);
            }
          }, _callee);
        }));
        function click_handler() {
          return _click_handler.apply(this, arguments);
        }
        return click_handler;
      }()
    }];
    if (window.allow_heavy_saves) {
      items.push({
        name_text: "Save Lite",
        icon_name: "saved",
        click_handler: function () {
          var _click_handler2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
            return _regenerator().w(function (_context2) {
              while (1) switch (_context2.n) {
                case 0:
                  _context2.n = 1;
                  return _saveProject(true);
                case 1:
                  return _context2.a(2);
              }
            }, _callee2);
          }));
          function click_handler() {
            return _click_handler2.apply(this, arguments);
          }
          return click_handler;
        }()
      });
    }
    items = items.concat([{
      name_text: "divider1",
      icon_name: null,
      click_handler: "divider"
    }, {
      name_text: "Export as Jupyter Notebook",
      icon_name: "export",
      click_handler: _exportAsJupyter
    }, {
      name_text: "Create Report From Notebook",
      icon_name: "document",
      click_handler: _exportAsReport
    }, {
      name_text: "Create Presentation from Notebook",
      icon_name: "presentation",
      click_handler: _exportAsPresentation
    }, {
      name_text: "Export Table as Collection",
      icon_name: "export",
      click_handler: _exportDataTable
    }, {
      name_text: "Open Console as Notebook",
      icon_name: "console",
      click_handler: _consoleToNotebook
    }, {
      name_text: "divider2",
      icon_name: null,
      click_handler: "divider"
    }, {
      name_text: cc_name,
      icon_name: cc_icon,
      click_handler: props.changeCollection
    }, {
      name_text: "Remove Collection",
      icon_name: "cross-circle",
      click_handler: props.removeCollection
    }]);
    var reduced_items = [];
    var _iterator = _createForOfIteratorHelper(items),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var item = _step.value;
        if (!props.hidden_items.includes(item.name_text)) {
          reduced_items.push(item);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return reduced_items;
  }
  return /*#__PURE__*/_react["default"].createElement(_menu_utilities.ToolMenu, {
    menu_name: "Project",
    menu_items: menu_items(),
    binding_dict: {},
    disabled_items: props.disabled_items,
    disable_all: false
  });
}
exports.ProjectMenu = ProjectMenu = /*#__PURE__*/(0, _react.memo)(ProjectMenu);
function DocumentMenu(props) {
  props = _objectSpread({
    disabled_items: []
  }, props);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  function _newDocument() {
    return _newDocument2.apply(this, arguments);
  }
  function _newDocument2() {
    _newDocument2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
      var new_name, _t11;
      return _regenerator().w(function (_context0) {
        while (1) switch (_context0.n) {
          case 0:
            _context0.p = 0;
            statusFuncs.startSpinner();
            _context0.n = 1;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "New Document",
              field_title: "New Document Name",
              default_value: props.currentDoc,
              existing_names: props.documentNames,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 1:
            new_name = _context0.v;
            _context0.n = 2;
            return (0, _communication_react.postPromiseMain)(props.local_id, "new_blank_document", {
              model_document_name: props.currentDoc,
              new_document_name: new_name
            }, props.local_id);
          case 2:
            statusFuncs.stopSpinner();
            _context0.n = 4;
            break;
          case 3:
            _context0.p = 3;
            _t11 = _context0.v;
            if (_t11 != "canceled") {
              errorDrawerFuncs.addFromError("Error adding new document", _t11);
            }
            statusFuncs.stopSpinner();
          case 4:
            return _context0.a(2);
        }
      }, _callee0, null, [[0, 3]]);
    }));
    return _newDocument2.apply(this, arguments);
  }
  function _duplicateDocument() {
    return _duplicateDocument2.apply(this, arguments);
  }
  function _duplicateDocument2() {
    _duplicateDocument2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
      var new_name, _t12;
      return _regenerator().w(function (_context1) {
        while (1) switch (_context1.n) {
          case 0:
            _context1.p = 0;
            statusFuncs.startSpinner();
            _context1.n = 1;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Duplicate Document",
              field_title: "New Document Name",
              default_value: props.currentDoc,
              existing_names: props.documentNames,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 1:
            new_name = _context1.v;
            _context1.n = 2;
            return (0, _communication_react.postPromiseMain)(props.local_id, "duplicate_document", {
              original_document_name: props.currentDoc,
              new_document_name: new_name
            }, props.local_id);
          case 2:
            statusFuncs.stopSpinner();
            _context1.n = 4;
            break;
          case 3:
            _context1.p = 3;
            _t12 = _context1.v;
            if (_t12 != "canceled") {
              errorDrawerFuncs.addFromError("Error duplicating document", _t12);
            }
            statusFuncs.stopSpinner();
          case 4:
            return _context1.a(2);
        }
      }, _callee1, null, [[0, 3]]);
    }));
    return _duplicateDocument2.apply(this, arguments);
  }
  function _renameDocument() {
    return _renameDocument2.apply(this, arguments);
  }
  function _renameDocument2() {
    _renameDocument2 = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee10() {
      var new_name, _t13;
      return _regenerator().w(function (_context10) {
        while (1) switch (_context10.n) {
          case 0:
            _context10.p = 0;
            statusFuncs.startSpinner();
            _context10.n = 1;
            return dialogFuncs.showModalPromise("ModalDialog", {
              title: "Rename Document",
              field_title: "New Document Name",
              default_value: props.currentDoc,
              existing_names: props.documentNames,
              checkboxes: [],
              handleClose: dialogFuncs.hideModal
            });
          case 1:
            new_name = _context10.v;
            _context10.n = 2;
            return (0, _communication_react.postPromiseMain)(props.local_id, "rename_document", {
              old_document_name: props.currentDoc,
              new_document_name: new_name
            }, props.local_id);
          case 2:
            statusFuncs.stopSpinner();
            _context10.n = 4;
            break;
          case 3:
            _context10.p = 3;
            _t13 = _context10.v;
            if (_t13 != "canceled") {
              errorDrawerFuncs.addFromError("Error renaming document", _t13);
            }
            statusFuncs.stopSpinner();
          case 4:
            return _context10.a(2);
        }
      }, _callee10, null, [[0, 3]]);
    }));
    return _renameDocument2.apply(this, arguments);
  }
  var option_dict = {
    "New": _newDocument,
    "Duplicate": _duplicateDocument,
    "Rename": _renameDocument
  };
  var icon_dict = {
    "New": "document",
    "Duplicate": "duplicate",
    "Rename": "edit"
  };
  return /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
    menu_name: "Document",
    option_dict: option_dict,
    icon_dict: icon_dict,
    binding_dict: {},
    disabled_items: props.disabled_items,
    hidden_items: []
  });
}
exports.DocumentMenu = DocumentMenu = /*#__PURE__*/(0, _react.memo)(DocumentMenu);
function ColumnMenu(props) {
  props = _objectSpread({
    disabled_items: []
  }, props);
  function _shift_column_left() {
    var cnum = props.filtered_column_names.indexOf(props.selected_column);
    if (cnum == 0) return;
    var target_col = props.filtered_column_names[cnum - 1];
    props.moveColumn(props.selected_column, target_col);
  }
  function _shift_column_to_start() {
    var cnum = props.filtered_column_names.indexOf(props.selected_column);
    if (cnum == 0) return;
    var target_col = props.filtered_column_names[0];
    props.moveColumn(props.selected_column, target_col);
  }
  function _shift_column_right() {
    var cnum = props.table_spec.column_names.indexOf(props.selected_column);
    if (cnum == props.table_spec.column_names.length - 1) return;
    var target_col = props.table_spec.column_names[cnum + 2];
    props.moveColumn(props.selected_column, target_col);
  }
  function _shift_column_to_end() {
    var cnum = props.table_spec.column_names.indexOf(props.selected_column);
    if (cnum == props.table_spec.column_names.length - 1) return;
    props.moveColumn(props.selected_column, null);
  }
  var option_dict = {
    "Shift Left": _shift_column_left,
    "Shift Right": _shift_column_right,
    "Shift to Start": _shift_column_to_start,
    "Shift to End": _shift_column_to_end,
    "divider1": "divider",
    "Hide": props.hideColumn,
    "Hide in All Docs": props.hideInAll,
    "Unhide All": props.unhideAllColumns,
    "divider2": "divider",
    "Add Column": function Add_Column() {
      return props.addColumn(false);
    },
    "Add Column In All Docs": function Add_Column_In_All_Docs() {
      return props.addColumn(true);
    },
    "Delete Column": function Delete_Column() {
      return props.deleteColumn(false);
    },
    "Delete Column In All Docs": function Delete_Column_In_All_Docs() {
      return props.deleteColumn(true);
    }
  };
  var icon_dict = {
    "Shift Left": "direction-left",
    "Shift Right": "direction-right",
    "Shift to Start": "double-chevron-left",
    "Shift to End": "double-chevron-right",
    "Hide": "eye-off",
    "Hide in All Docs": "eye-off",
    "Unhide All": "eye-on",
    "Add Column": "add-column-right",
    "Add Column In All Docs": "add-column-right",
    "Delete Column": "remove-column",
    "Delete Column In All Docs": "remove-column"
  };
  return /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
    menu_name: "Column",
    option_dict: option_dict,
    icon_dict: icon_dict,
    binding_dict: {},
    disabled_items: props.disabled_items,
    hidden_items: []
  });
}
ColumnMenu.propTypes = {
  moveColumn: _propTypes["default"].func,
  table_spec: _propTypes["default"].object,
  filtered_column_names: _propTypes["default"].array,
  selected_column: _propTypes["default"].string,
  hideColumn: _propTypes["default"].func,
  hideInAll: _propTypes["default"].func,
  unhideAllColumns: _propTypes["default"].func,
  addColumn: _propTypes["default"].func,
  deleteColumn: _propTypes["default"].func,
  disabled_items: _propTypes["default"].array
};
exports.ColumnMenu = ColumnMenu = /*#__PURE__*/(0, _react.memo)(ColumnMenu);
function RowMenu(props) {
  props = _objectSpread({
    disabled_items: []
  }, props);
  var option_dict = {
    "Insert Row Before": props.insertRowBefore,
    "Insert Row After": props.insertRowAfter,
    "Duplicate Row": props.duplicateRow,
    "Delete Row": props.deleteRow
  };
  var icon_dict = {
    "Insert Row Before": "add-row-top",
    "Insert Row After": "add-row-bottom",
    "Duplicate Row": "add-row-bottom",
    "Delete Row": "remove-row-bottom"
  };
  return /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
    menu_name: "Row",
    option_dict: option_dict,
    icon_dict: icon_dict,
    binding_dict: {},
    disabled_items: props.disabled_items,
    hidden_items: []
  });
}
exports.RowMenu = RowMenu = /*#__PURE__*/(0, _react.memo)(RowMenu);
function ViewMenu(props) {
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  function _shift_column_left() {
    var cnum = props.table_spec.column_names.indexOf(props.selected_column);
    if (cnum == 0) return;
    var target_col = props.table_spec.column_names[cnum - 1];
    _moveColumn(props.selected_column, target_col);
  }
  function _shift_column_right() {
    var cnum = props.table_spec.column_names.indexOf(props.selected_column);
    if (cnum == props.table_spec.column_names.length - 1) return;
    var target_col = props.table_spec.column_names[cnum + 2];
    _moveColumn(props.selected_column, target_col);
  }
  function _toggleExports() {
    props.setMainStateValue("show_exports_pane", !props.show_exports_pane);
  }
  function _toggleConsole() {
    props.setMainStateValue("show_console_pane", !props.show_console_pane);
  }
  function _toggleMetadata() {
    props.setMainStateValue("show_metadata", !props.show_metadata);
  }
  function option_dict() {
    var result = {};
    if (!props.is_notebook) {
      if (props.toggleTableShrink) {
        var table_opt_name = props.table_is_shrunk ? "Maximize Table" : "Minimize Table";
        result[table_opt_name] = props.toggleTableShrink;
        result["divider1"] = "divider";
      }
      var console_opt_name = props.show_console_pane ? "Hide Notebook" : "Show Notebook";
      result[console_opt_name] = _toggleConsole;
    }
    var exports_opt_name = props.show_exports_pane ? "Hide Exports" : "Show Exports";
    result[exports_opt_name] = _toggleExports;
    result["divider2"] = "divider";
    result["Show Error Drawer"] = errorDrawerFuncs.openErrorDrawer;
    result["Show Metadata"] = _toggleMetadata;
    return result;
  }
  function icon_dict() {
    var result = {};
    if (!props.is_notebook) {
      if (props.toggleTableShrink) {
        var opt_name = props.table_is_shrunk ? "Maximize Table" : "Minimize Table";
        result[opt_name] = props.table_is_shrunk ? "maximize" : "minimize";
      }
      var console_opt_name = props.show_console_pane ? "Hide Notebook" : "Show Notebook";
    }
    var exports_opt_name = props.show_exports_pane ? "Hide Exports" : "Show Exports";
    result[exports_opt_name] = "variable";
    result["Show Error Drawer"] = "panel-stats";
    result["Show Metadata"] = "panel-stats";
    return result;
  }
  return /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
    menu_name: "View",
    option_dict: option_dict(),
    icon_dict: icon_dict(),
    disabled_items: [],
    binding_dict: {},
    disable_all: props.disable_all,
    hidden_items: []
  });
}
ViewMenu.propTypes = {
  table_is_shrunk: _propTypes["default"].bool,
  toggleTableShrink: _propTypes["default"].func,
  openErrorDrawer: _propTypes["default"].func,
  show_exports_pane: _propTypes["default"].bool,
  show_console_pane: _propTypes["default"].bool,
  setMainStateValue: _propTypes["default"].func
};
exports.ViewMenu = ViewMenu = /*#__PURE__*/(0, _react.memo)(ViewMenu);