"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FileImportDialog = FileImportDialog;
var _react = _interopRequireWildcard(require("react"));
var _reactDropzoneComponent = _interopRequireDefault(require("react-dropzone-component"));
require("../css/dzcss/dropzone.css");
require("../css/dzcss/filepicker.css");
require("../css/dzcss/basic.css");
var _core = require("@blueprintjs/core");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _utilities_react = require("./utilities_react");
var _server = require("react-dom/server");
var _error_drawer = require("./error_drawer");
var _pool_tree = require("./pool_tree");
var _settings = require("./settings");
var _communication_react = require("./communication_react");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t2 in e) "default" !== _t2 && {}.hasOwnProperty.call(e, _t2) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t2)) && (i.get || i.set) ? o(f, _t2, i) : f[_t2] = e[_t2]); return f; })(e, t); }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
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
var defaultImportDialogWidth = 700;
function FileImportDialog(props) {
  props = _objectSpread({
    checkboxes: null,
    textoptions: null,
    popupoptions: null,
    after_upload: null,
    show_address_selector: false,
    initialFiles: []
  }, props);
  var name_counter = (0, _react.useRef)(1);
  var default_name = (0, _react.useRef)("new" + props.res_type);
  var picker_ref = (0, _react.useRef)(null);
  var existing_names = (0, _react.useRef)([]);
  var current_url = (0, _react.useRef)("dummy");
  var myDropzone = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    show = _useState2[0],
    set_show = _useState2[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(props.show_address_selector ? "mydisk" : "new" + props.res_type),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    current_value = _useStateAndRef2[0],
    set_current_value = _useStateAndRef2[1],
    current_value_ref = _useStateAndRef2[2];
  var _useState3 = (0, _react.useState)({}),
    _useState4 = _slicedToArray(_useState3, 2),
    checkbox_states = _useState4[0],
    set_checkbox_states = _useState4[1];
  var _useState5 = (0, _react.useState)("  "),
    _useState6 = _slicedToArray(_useState5, 2),
    warning_text = _useState6[0],
    set_warning_text = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    log_open = _useState8[0],
    set_log_open = _useState8[1];
  var _useState9 = (0, _react.useState)([]),
    _useState0 = _slicedToArray(_useState9, 2),
    log_contents = _useState0[0],
    set_log_contents = _useState0[1];
  var _useState1 = (0, _react.useState)(defaultImportDialogWidth - 100),
    _useState10 = _slicedToArray(_useState1, 2),
    current_picker_width = _useState10[0],
    set_current_picker_width = _useState10[1];

  // These will only matter if props.show_csv_options
  var _useState11 = (0, _react.useState)(","),
    _useState12 = _slicedToArray(_useState11, 2),
    delimiter = _useState12[0],
    set_delimiter = _useState12[1];
  var _useState13 = (0, _react.useState)("QUOTE_MINIMAL"),
    _useState14 = _slicedToArray(_useState13, 2),
    quoting = _useState14[0],
    set_quoting = _useState14[1];
  var _useState15 = (0, _react.useState)(true),
    _useState16 = _slicedToArray(_useState15, 2),
    skipinitialspace = _useState16[0],
    set_skipinitialspace = _useState16[1];
  var _useState17 = (0, _react.useState)(false),
    _useState18 = _slicedToArray(_useState17, 2),
    csv_options_open = _useState18[0],
    set_csv_options_open = _useState18[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _utilities_react.useConstructor)(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var data, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          _context.p = 0;
          _context.n = 1;
          return (0, _communication_react.postAjaxPromise)("get_resource_names/".concat(props.res_type));
        case 1:
          data = _context.v;
          existing_names.current = data.resource_names;
          while (_name_exists(default_name)) {
            name_counter.current += 1;
            default_name.current = "new" + props.res_type + String(name_counter.current);
          }
          set_show(true);
          _context.n = 3;
          break;
        case 2:
          _context.p = 2;
          _t = _context.v;
          errorDrawerFuncs.addFromError("Error getting existing names", _t);
        case 3:
          return _context.a(2);
      }
    }, _callee, null, [[0, 2]]);
  })));
  (0, _react.useEffect)(function () {
    if (props.checkboxes != null && props.checkboxes.length != 0) {
      var lcheckbox_states = {};
      var _iterator = _createForOfIteratorHelper(props.checkboxes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var checkbox = _step.value;
          lcheckbox_states[checkbox.checkname] = false;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      set_checkbox_states(lcheckbox_states);
    }
    if (props.show_address_selector && props.initial_address) {
      set_current_value(props.initial_address);
    }
    _updatePickerSize();
    initSocket();
  }, []);
  (0, _react.useEffect)(function () {
    _updatePickerSize();
  });
  function _handleResponse(entry) {
    if (entry.resource_name && entry["success"] in ["success", "partial"]) {
      existing_names.current.push(entry.resource_name);
    }
    set_log_contents([].concat(_toConsumableArray(log_contents), [entry]));
    set_log_open(true);
  }
  function _handleError(file, message) {
    var xhr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    _handleResponse({
      title: "Error for ".concat(file.name),
      "content": message
    });
  }
  function _updatePickerSize() {
    if (picker_ref && picker_ref.current) {
      var new_width = picker_ref.current.offsetWidth;
      if (new_width != current_picker_width) {
        set_current_picker_width(picker_ref.current.offsetWidth);
      }
    }
  }
  function initSocket() {
    props.tsocket.attachListener("upload-response", _handleResponse);
  }
  function _checkbox_change_handler(event) {
    var val = event.target.checked;
    var new_checkbox_states = Object.assign({}, checkbox_states);
    new_checkbox_states[event.target.id] = event.target.checked;
    set_checkbox_states(new_checkbox_states);
  }
  function _closeHandler() {
    set_show(false);
    props.handleClose();
  }
  function _do_submit() {
    var msg;
    if (myDropzone.current.getQueuedFiles().length == 0) {
      return;
    }
    if (current_value == "") {
      msg = "An empty name is not allowed here.";
      set_warning_text(msg);
    } else if (_name_exists(current_value)) {
      msg = "That name already exists";
      set_warning_text(msg);
    } else {
      var csv_options;
      if (props.show_csv_options && csv_options_open) {
        csv_options = {
          delimiter: delimiter,
          quoting: quoting,
          skipinitialspace: skipinitialspace
        };
      } else {
        csv_options = null;
      }
      props.process_handler(myDropzone.current, _setCurrentUrl, current_value, checkbox_states, csv_options);
    }
  }
  function _do_clear() {
    myDropzone.current.removeAllFiles();
  }
  function _initCallback(dropzone) {
    myDropzone.current = dropzone;
    if (props.initialFiles) {
      var _iterator2 = _createForOfIteratorHelper(props.initialFiles),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var theFile = _step2.value;
          dropzone.addFile(theFile);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }
  function _setCurrentUrl(new_url) {
    myDropzone.current.options.url = new_url;
    current_url.current = new_url;
  }

  // There's trickiness with setting the current url in the dropzone object.
  // If I don't set it below in uploadComplete, then the second file processed
  // gets the dummy url in some cases. It's related to the component re-rendering
  // I think, perhaps when messages are shown in the dialog.

  function _uploadComplete(f) {
    if (myDropzone.current.getQueuedFiles().length > 0) {
      myDropzone.current.options.url = current_url.current;
      myDropzone.current.processQueue();
    } else if (props.after_upload) {
      props.after_upload();
    }
  }
  function _onSending(f, xhr, formData) {
    f.previewElement.scrollIntoView(false);
    formData.append("extra_value", current_value_ref.current);
    if (props.chunking) {
      formData.append("dzuuid", f.upload.uuid);
    }
  }
  function _name_exists(name) {
    return existing_names.current.indexOf(name) > -1;
  }
  function _toggleLog() {
    set_log_open(!log_open);
  }
  function _clearLog() {
    set_log_contents([]);
  }
  function _handleDrop() {
    if (myDropzone.current.getQueuedFiles().length == 0) {
      _do_clear();
    }
  }
  function _nameChangeHandler(event) {
    set_current_value(event.target.value);
    set_warning_text("  ");
  }
  function _updateDelimiter(event) {
    set_delimiter(event.target.value);
  }
  function _updateSkipinitial(event) {
    set_skipinitialspace(event.target.checked);
  }
  function _toggleCSVOptions() {
    set_csv_options_open(!csv_options_open);
  }
  var half_width = .5 * current_picker_width - 10;
  var name_style = {
    display: "inline-block",
    maxWidth: half_width
  };
  var progress_style = {
    position: "relative",
    width: half_width - 100,
    marginRight: 5,
    marginLeft: "unset",
    left: "unset",
    right: "unset"
  };
  var size_style = {
    marginLeft: 5,
    width: 75
  };
  var componentConfig = {
    postUrl: current_url.current // Must have this even though will never be used
  };
  var djsConfig = {
    uploadMultiple: false,
    parallelUploads: 1,
    maxFilesize: 2000,
    timeout: 360000,
    chunking: props.chunking,
    forceChunking: props.forceChunking,
    chunkSize: props.chunkSize,
    autoProcessQueue: false,
    dictDefaultMessage: "Click or drop files here to upload",
    acceptedFiles: props.allowed_file_types,
    // addRemoveLinks: true,
    // dictRemoveFile: "x",
    previewTemplate: (0, _server.renderToStaticMarkup)(/*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-preview dz-file-preview"
    }, /*#__PURE__*/_react["default"].createElement("div", {
      style: name_style,
      "data-dz-name": "true"
    }), /*#__PURE__*/_react["default"].createElement("div", {
      style: {
        display: "flex",
        width: half_width,
        flexDirection: "row",
        justifyContent: "space-bewteen"
      }
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-progress",
      style: progress_style
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-upload",
      "data-dz-uploadprogress": "true"
    })), /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-success-mark",
      style: progress_style
    }, /*#__PURE__*/_react["default"].createElement("span", null, "\u2714")), /*#__PURE__*/_react["default"].createElement("div", {
      className: "dz-error-mark",
      style: progress_style
    }, /*#__PURE__*/_react["default"].createElement("span", null, "\u2718")), /*#__PURE__*/_react["default"].createElement("div", {
      style: size_style,
      "data-dz-size": "true"
    })))),
    headers: {
      'X-CSRF-TOKEN': window.csrftoken
    }
  };
  var eventHandlers;
  eventHandlers = {
    init: _initCallback,
    complete: _uploadComplete,
    sending: _onSending,
    drop: _handleDrop,
    error: _handleError
  };
  var checkbox_items = [];
  if (props.checkboxes != null && props.checkboxes.length != 0) {
    var _iterator3 = _createForOfIteratorHelper(props.checkboxes),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var checkbox = _step3.value;
        var new_item = /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
          checked: checkbox_states[checkbox.checkname],
          label: checkbox.checktext,
          id: checkbox.checkname,
          key: checkbox.checkname,
          inline: "true",
          alignIndicator: _core.Alignment.RIGHT,
          onChange: _checkbox_change_handler
        });
        checkbox_items.push(new_item);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
  }
  var log_items;
  if (log_open) {
    if (log_contents.length > 0) {
      log_items = log_contents.map(function (entry, index) {
        var content_dict = {
          __html: entry.content
        };
        var has_link = false;
        return /*#__PURE__*/_react["default"].createElement(_error_drawer.ErrorItem, {
          key: index,
          title: entry.title,
          content: entry.content,
          has_link: has_link
        });
      });
    } else {
      log_items = /*#__PURE__*/_react["default"].createElement("div", null, "Log is empty");
    }
  }
  var body_style = {
    marginTop: 25,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    minHeight: 101
  };
  var allowed_types_string;
  if (props.allowed_file_types) {
    allowed_types_string = props.allowed_file_types.replaceAll(",", " ");
  } else {
    allowed_types_string = "any";
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "import-dialog bp6-dark" : "import-dialog light-theme",
    title: props.title,
    onClose: _closeHandler,
    canOutsideClickClose: true,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    helperText: "allowed types: ".concat(allowed_types_string)
  }, /*#__PURE__*/_react["default"].createElement(_reactDropzoneComponent["default"], {
    config: componentConfig,
    eventHandlers: eventHandlers,
    djsConfig: djsConfig
  })), /*#__PURE__*/_react["default"].createElement("div", {
    style: body_style
  }, props.combine && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "New ".concat(props.res_type, " name"),
    labelFor: "name-input",
    inline: true,
    helperText: warning_text
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    onChange: _nameChangeHandler,
    fill: false,
    id: "name-input",
    value: current_value
  })), checkbox_items.length != 0 && checkbox_items, props.show_csv_options && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _toggleCSVOptions,
    variant: "minimal",
    intent: "primary",
    size: "large"
  }, "csv options: ", csv_options_open ? "manual" : "auto"), /*#__PURE__*/_react["default"].createElement(_core.Collapse, {
    isOpen: csv_options_open
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "delimiter",
    inline: true,
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    onChange: _updateDelimiter,
    value: delimiter
  })), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "quoting",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
    onChange: set_quoting,
    value: quoting,
    filterable: false,
    size: "small",
    options: ["QUOTE_MINIMAL", "QUOTE_ALL", "QUOTE_NONNUMERIC", "QUOTE_NONE"]
  })), /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
    checked: skipinitialspace,
    label: "skipinitialspace",
    inline: "true",
    alignIndicator: _core.Alignment.RIGHT,
    onChange: _updateSkipinitial
  })))), props.show_address_selector && /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Target Directory",
    labelFor: "name-input",
    inline: true,
    helperText: warning_text
  }, /*#__PURE__*/_react["default"].createElement(_pool_tree.PoolAddressSelector, {
    value: current_value,
    tsocket: props.tsocket,
    select_type: "folder",
    setValue: set_current_value
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-evenly"
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _do_submit
  }, "Upload"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _do_clear
  }, "Clear Files")))), /*#__PURE__*/_react["default"].createElement(_core.Divider, null), /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER,
    style: {
      marginTop: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _toggleLog
  }, log_open ? "Hide" : "Show", " log"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _clearLog
  }, "Clear log")), /*#__PURE__*/_react["default"].createElement(_core.Collapse, {
    isOpen: log_open
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "bp6-dialog-body"
  }, log_items))));
}