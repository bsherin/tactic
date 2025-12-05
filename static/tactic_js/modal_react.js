"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogContext = void 0;
exports.withDialogs = withDialogs;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _selector_advanced = require("./selector_advanced");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _pool_tree = require("./pool_tree");
var _settings = require("./settings");
var _import_dialog = require("./import_dialog");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var DialogContext = exports.DialogContext = /*#__PURE__*/(0, _react.createContext)(null);
var dialogDict = {
  ModalDialog: ModalDialog,
  PresentationDialog: PresentationDialog,
  ReportDialog: ReportDialog,
  EndSessionDialog: EndSessionDialog,
  SelectDialog: SelectDialog,
  SelectAddressDialog: SelectAddressDialog,
  SelectResourceDialog: SelectResourceDialog,
  ConfirmDialog: ConfirmDialog,
  FileImportDialog: _import_dialog.FileImportDialog
};
function withDialogs(WrappedComponent) {
  function ModalFunc(props) {
    // When state was dealt with in this way updates weren't getting batched and
    // that was causinga ll sorts of problems
    var _useState = (0, _react.useState)({
        modalType: null,
        dialogProps: {},
        keyCounter: 0
      }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];
    function showModal(modalType, newDialogProps) {
      setState({
        modalType: modalType,
        dialogProps: newDialogProps,
        keyCounter: state.keyCounter + 1
      });
    }
    function showModalPromise(modalType, newDialogProps) {
      return new Promise(function (resolve, reject) {
        newDialogProps.handleSubmit = resolve;
        newDialogProps.handleCancel = function () {
          reject("canceled");
        };
        showModal(modalType, newDialogProps);
      });
    }
    function hideModal() {
      setState({
        modalType: null,
        dialogProps: {},
        keyCounter: 0
      });
    }
    var DialogComponent = null;
    if (state.modalType in dialogDict) {
      DialogComponent = dialogDict[state.modalType];
    }
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(DialogContext.Provider, {
      value: {
        showModal: showModal,
        hideModal: hideModal,
        showModalPromise: showModalPromise
      }
    }, /*#__PURE__*/_react["default"].createElement(WrappedComponent, props)), /*#__PURE__*/_react["default"].createElement("div", null, DialogComponent && /*#__PURE__*/_react["default"].createElement(DialogComponent, _extends({
      key: state.keyCounter,
      isOpen: state.modalType == state.modalType
    }, state.dialogProps))));
  }
  return /*#__PURE__*/(0, _react.memo)(ModalFunc);
}
function ModalDialog(props) {
  props = _objectSpread({
    existing_names: [],
    default_value: "",
    checkboxes: null
  }, props);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)({}),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    checkbox_states = _useStateAndRef2[0],
    set_checkbox_states = _useStateAndRef2[1],
    checkbox_states_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    warning_text = _useStateAndRef4[0],
    set_warning_text = _useStateAndRef4[1],
    warning_text_ref = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    current_value = _useStateAndRef6[0],
    set_current_value = _useStateAndRef6[1],
    current_value_ref = _useStateAndRef6[2];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var input_ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (props.checkboxes != null && props.checkboxes.length != 0) {
      var _checkbox_states = {};
      var _iterator = _createForOfIteratorHelper(props.checkboxes),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var checkbox = _step.value;
          _checkbox_states[checkbox.checkname] = false;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      set_checkbox_states(_checkbox_states);
    }
    var default_name = props.default_value;
    var name_counter = 1;
    while (_name_exists(default_name)) {
      name_counter += 1;
      default_name = props.default_value + String(name_counter);
    }
    set_current_value(default_name);
    set_warning_text(null);
  }, []);
  function _changeHandler(event) {
    set_current_value(event.target.value);
  }
  function _checkbox_change_handler(event) {
    var val = event.target.checked;
    var new_checkbox_states = Object.assign({}, checkbox_states);
    new_checkbox_states[event.target.id] = event.target.checked;
    set_checkbox_states(new_checkbox_states);
  }
  function _name_exists(name) {
    return props.existing_names.indexOf(name) > -1;
  }
  function _submitHandler(event) {
    var msg;
    if (current_value_ref.current == "") {
      msg = "An empty name is not allowed here.";
      set_warning_text(msg);
    } else if (_name_exists(current_value_ref.current)) {
      msg = "That name already exists";
      set_warning_text(msg);
    } else {
      if (props.checkboxes != null && props.checkboxes.length != 0) {
        props.handleSubmit([current_value_ref.current, checkbox_states]);
      } else {
        props.handleSubmit(current_value_ref.current);
      }
      props.handleClose();
    }
  }
  function _cancelHandler() {
    if (props.handleCancel) {
      props.handleCancel();
    }
    props.handleClose();
  }
  function _refHandler(the_ref) {
    input_ref.current = the_ref;
  }
  var checkbox_items = [];
  if (props.checkboxes != null && props.checkboxes.length != 0) {
    var _iterator2 = _createForOfIteratorHelper(props.checkboxes),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var checkbox = _step2.value;
        var new_item = /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
          checked: checkbox_states[checkbox.checkname],
          label: checkbox.checktext,
          id: checkbox.checkname,
          key: checkbox.checkname,
          onChange: _checkbox_change_handler
        });
        checkbox_items.push(new_item);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
    isOpen: props.isOpen,
    className: settingsContext.isDark() ? "bp6-dark" : "",
    title: props.title,
    onClose: _cancelHandler,
    onOpened: function onOpened() {
      input_ref.current.focus();
    },
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: _submitHandler
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: props.field_title,
    helperText: warning_text_ref.current
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    inputRef: _refHandler,
    onChange: _changeHandler,
    value: current_value_ref.current
  })), checkbox_items.length != 0 && checkbox_items), /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER_ACTIONS
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _cancelHandler
  }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _submitHandler
  }, "Submit")))));
}
ModalDialog = /*#__PURE__*/(0, _react.memo)(ModalDialog);
function PresentationDialog(props) {
  props = _objectSpread({
    existing_names: [],
    default_name: ""
  }, props);
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    show = _useState4[0],
    set_show = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    save_as_collection = _useState6[0],
    set_save_as_collection = _useState6[1];
  var _useStateAndRef7 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef8 = _slicedToArray(_useStateAndRef7, 3),
    collection_name = _useStateAndRef8[0],
    set_collection_name = _useStateAndRef8[1],
    collection_name_ref = _useStateAndRef8[2];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    use_dark_theme = _useState8[0],
    set_use_dark_theme = _useState8[1];
  var _useState9 = (0, _react.useState)(""),
    _useState0 = _slicedToArray(_useState9, 2),
    warning_text = _useState0[0],
    set_warning_text = _useState0[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var input_ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    set_show(true);
    var default_name = props.default_value;
    var name_counter = 1;
    while (_name_exists(default_name)) {
      name_counter += 1;
      default_name = props.default_value + String(name_counter);
    }
    set_collection_name(default_name);
  }, []);
  function _changeName(event) {
    set_collection_name(event.target.value);
  }
  function _changeDark(event) {
    set_use_dark_theme(event.target.checked);
  }
  function _changeSaveCollection(event) {
    set_save_as_collection(event.target.checked);
  }
  function _name_exists(name) {
    return props.existing_names.indexOf(name) > -1;
  }
  function _submitHandler(event) {
    var msg;
    if (save_as_collection) {
      if (collection_name == "") {
        msg = "An empty name is not allowed here.";
        set_warning_text(msg);
        return;
      } else if (_name_exists(collection_name)) {
        msg = "That name already exists";
        set_warning_text(msg);
        return;
      }
    }
    set_show(false);
    props.handleSubmit([use_dark_theme, save_as_collection, collection_name]);
    props.handleClose();
  }
  function _cancelHandler() {
    set_show(false);
    if (props.handleCancel) {
      props.handleCancel();
    }
    props.handleClose();
  }
  function _refHandler(the_ref) {
    input_ref.current = the_ref;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "bp6-dark" : "",
    title: "Create Presentation",
    onClose: _cancelHandler,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: _submitHandler
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
    checked: use_dark_theme,
    label: "Use Dark Theme",
    id: "use_dark_check",
    key: "use_dark_check",
    onChange: _changeDark
  }), /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
    checked: save_as_collection,
    label: "Save As Collection",
    id: "save_as_collection",
    key: "save_as_collection",
    onChange: _changeSaveCollection
  }), save_as_collection && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Collection Name",
    helperText: warning_text
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    inputRef: _refHandler,
    onChange: _changeName,
    value: collection_name_ref.current
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER_ACTIONS
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _cancelHandler
  }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _submitHandler
  }, "Submit")))));
}
PresentationDialog = /*#__PURE__*/(0, _react.memo)(PresentationDialog);
function ReportDialog(props) {
  props = _objectSpread({
    existing_names: [],
    default_name: "NewReport"
  }, props);
  var _useState1 = (0, _react.useState)(false),
    _useState10 = _slicedToArray(_useState1, 2),
    show = _useState10[0],
    set_show = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    save_as_collection = _useState12[0],
    set_save_as_collection = _useState12[1];
  var _useState13 = (0, _react.useState)(null),
    _useState14 = _slicedToArray(_useState13, 2),
    collection_name = _useState14[0],
    set_collection_name = _useState14[1];
  var _useState15 = (0, _react.useState)(null),
    _useState16 = _slicedToArray(_useState15, 2),
    use_dark_theme = _useState16[0],
    set_use_dark_theme = _useState16[1];
  var _useState17 = (0, _react.useState)(""),
    _useState18 = _slicedToArray(_useState17, 2),
    warning_text = _useState18[0],
    set_warning_text = _useState18[1];
  var _useState19 = (0, _react.useState)(false),
    _useState20 = _slicedToArray(_useState19, 2),
    collapsible = _useState20[0],
    set_collapsible = _useState20[1];
  var _useState21 = (0, _react.useState)(false),
    _useState22 = _slicedToArray(_useState21, 2),
    include_summaries = _useState22[0],
    set_include_summaries = _useState22[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var input_ref = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    set_show(true);
    var default_name = props.default_value;
    var name_counter = 1;
    while (_name_exists(default_name)) {
      name_counter += 1;
      default_name = props.default_value + String(name_counter);
    }
    set_collection_name(default_name);
  }, []);
  function _changeName(event) {
    set_collection_name(event.target.value);
  }
  function _changeDark(event) {
    set_use_dark_theme(event.target.checked);
  }
  function _changeCollapsible(event) {
    set_collapsible(event.target.checked);
  }
  function _changeIncludeSummaries(event) {
    set_include_summaries(event.target.checked);
  }
  function _changeSaveCollection(event) {
    set_save_as_collection(event.target.checked);
  }
  function _name_exists(name) {
    return props.existing_names.indexOf(name) > -1;
  }
  function _submitHandler(event) {
    var msg;
    if (save_as_collection) {
      if (collection_name == "") {
        msg = "An empty name is not allowed here.";
        set_warning_text(msg);
        return;
      } else if (_name_exists(collection_name)) {
        msg = "That name already exists";
        set_warning_text(msg);
        return;
      }
    }
    set_show(false);
    props.handleSubmit([collapsible, include_summaries, use_dark_theme, save_as_collection, collection_name]);
    props.handleClose();
  }
  function _cancelHandler() {
    set_show(false);
    if (props.handleCancel) {
      props.handleCancel();
    }
    props.handleClose();
  }
  function _refHandler(the_ref) {
    input_ref.current = the_ref;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "bp6-dark" : "",
    title: "Create Report",
    onClose: _cancelHandler,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react["default"].createElement("form", {
    onSubmit: _submitHandler
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
    checked: collapsible,
    label: "Collapsible Sections",
    id: "collapse_checked",
    key: "collapse_checked",
    onChange: _changeCollapsible
  }), /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
    checked: include_summaries,
    label: "Include Summaries",
    id: "include_summaries",
    key: "include_summaries",
    onChange: _changeIncludeSummaries
  }), /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
    checked: use_dark_theme,
    label: "Use Dark Theme",
    id: "use_dark_check",
    key: "use_dark_check",
    onChange: _changeDark
  }), /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
    checked: save_as_collection,
    label: "Save As Collection",
    id: "save_as_collection",
    key: "save_as_collection",
    onChange: _changeSaveCollection
  }), save_as_collection && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Collection Name",
    helperText: warning_text
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    inputRef: _refHandler,
    onChange: _changeName,
    value: collection_name
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER_ACTIONS
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _cancelHandler
  }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _submitHandler
  }, "Submit")))));
}
ReportDialog = /*#__PURE__*/(0, _react.memo)(ReportDialog);
function SelectDialog(props) {
  props = _objectSpread({
    checkboxes: null
  }, props);
  var _useState23 = (0, _react.useState)(false),
    _useState24 = _slicedToArray(_useState23, 2),
    show = _useState24[0],
    set_show = _useState24[1];
  var _useState25 = (0, _react.useState)(""),
    _useState26 = _slicedToArray(_useState25, 2),
    value = _useState26[0],
    set_value = _useState26[1];
  var _useStateAndRef9 = (0, _utilities_react.useStateAndRef)({}),
    _useStateAndRef0 = _slicedToArray(_useStateAndRef9, 3),
    checkbox_states = _useStateAndRef0[0],
    set_checkbox_states = _useStateAndRef0[1],
    checkbox_states_ref = _useStateAndRef0[2];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  (0, _react.useEffect)(function () {
    set_show(true);
    set_value(props.option_list[0]);
    if (props.checkboxes != null && props.checkboxes.length != 0) {
      var _checkbox_states2 = {};
      var _iterator3 = _createForOfIteratorHelper(props.checkboxes),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var checkbox = _step3.value;
          if ("checked" in checkbox) {
            _checkbox_states2[checkbox.checkname] = checkbox.checked;
          } else {
            _checkbox_states2[checkbox.checkname] = false;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      set_checkbox_states(_checkbox_states2);
    }
  }, []);
  function _handleChange(val) {
    set_value(val);
  }
  function _checkbox_change_handler(event) {
    var val = event.target.checked;
    var new_checkbox_states = Object.assign({}, checkbox_states);
    new_checkbox_states[event.target.id] = event.target.checked;
    set_checkbox_states(new_checkbox_states);
  }
  function _submitHandler(event) {
    set_show(false);
    if (props.checkboxes != null && props.checkboxes.length != 0) {
      props.handleSubmit([value, checkbox_states]);
    } else {
      props.handleSubmit(value);
    }
    props.handleClose();
  }
  function _cancelHandler() {
    set_show(false);
    props.handleClose();
  }
  var checkbox_items = [];
  if (props.checkboxes != null && props.checkboxes.length != 0) {
    var _iterator4 = _createForOfIteratorHelper(props.checkboxes),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var checkbox = _step4.value;
        var new_item = /*#__PURE__*/_react["default"].createElement(_core.Checkbox, {
          checked: checkbox_states[checkbox.checkname],
          label: checkbox.checktext,
          id: checkbox.checkname,
          key: checkbox.checkname,
          onChange: _checkbox_change_handler,
          disabled: checkbox.disabled
        });
        checkbox_items.push(new_item);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "bp6-dark" : "",
    title: props.title,
    onClose: _cancelHandler,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, props.option_list.length > 0 && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    title: props.select_label
  }, /*#__PURE__*/_react["default"].createElement(_selector_advanced.BpSelect, {
    options: props.option_list,
    onChange: _handleChange,
    value: value
  })), checkbox_items.length != 0 && checkbox_items), /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER_ACTIONS
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _cancelHandler
  }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _submitHandler
  }, "Submit"))));
}
SelectDialog = /*#__PURE__*/(0, _react.memo)(SelectDialog);
function SelectAddressDialog(props) {
  var _useState27 = (0, _react.useState)(false),
    _useState28 = _slicedToArray(_useState27, 2),
    show = _useState28[0],
    set_show = _useState28[1];
  var _useState29 = (0, _react.useState)(""),
    _useState30 = _slicedToArray(_useState29, 2),
    new_name = _useState30[0],
    set_new_name = _useState30[1];
  var _useState31 = (0, _react.useState)(),
    _useState32 = _slicedToArray(_useState31, 2),
    path = _useState32[0],
    set_path = _useState32[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  (0, _react.useEffect)(function () {
    set_show(true);
    set_path(props.initial_address);
    set_new_name(props.initial_name);
  }, []);
  function _changeName(event) {
    set_new_name(event.target.value);
  }
  function _submitHandler(event) {
    set_show(false);
    if (props.showName) {
      props.handleSubmit("".concat(path, "/").concat(new_name));
    } else {
      props.handleSubmit(path);
    }
    props.handleClose();
  }
  function _cancelHandler() {
    set_show(false);
    props.handleClose();
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "bp6-dark" : "",
    title: props.title,
    onClose: _cancelHandler,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Target Directory",
    inline: true
  }, /*#__PURE__*/_react["default"].createElement(_pool_tree.PoolAddressSelector, {
    value: path,
    tsocket: props.tsocket,
    select_type: props.selectType,
    setValue: set_path
  })), props.showName && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "New Name"
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    onChange: _changeName,
    value: new_name
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER_ACTIONS
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _cancelHandler
  }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _submitHandler
  }, "Submit"))));
}
SelectAddressDialog = /*#__PURE__*/(0, _react.memo)(SelectAddressDialog);
var res_types = ["collection", "project", "tile", "list", "code"];
function SelectResourceDialog(props) {
  var _useState33 = (0, _react.useState)(false),
    _useState34 = _slicedToArray(_useState33, 2),
    show = _useState34[0],
    set_show = _useState34[1];
  var _useState35 = (0, _react.useState)(null),
    _useState36 = _slicedToArray(_useState35, 2),
    value = _useState36[0],
    set_value = _useState36[1];
  var _useState37 = (0, _react.useState)("collection"),
    _useState38 = _slicedToArray(_useState37, 2),
    type = _useState38[0],
    set_type = _useState38[1];
  var _useState39 = (0, _react.useState)([]),
    _useState40 = _slicedToArray(_useState39, 2),
    option_names = _useState40[0],
    set_option_names = _useState40[1];
  var _useState41 = (0, _react.useState)(null),
    _useState42 = _slicedToArray(_useState41, 2),
    selected_resource = _useState42[0],
    set_selected_resource = _useState42[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    _handleTypeChange("collection");
  }, []);
  function _handleTypeChange(val) {
    var get_url = "get_".concat(val, "_names_task");
    var dict_hash = "".concat(val, "_names");
    (0, _communication_react.postWithCallback)("host", get_url, {
      "user_id": user_id
    }, function (data) {
      set_show(true);
      set_type(val);
      set_option_names(data[dict_hash]);
      set_selected_resource(data[dict_hash][0]);
    }, function (data) {
      console.log("got error callback");
    });
  }
  function _handleResourceChange(val) {
    set_selected_resource(val);
  }
  function _submitHandler(event) {
    set_show(false);
    pushCallback(function () {
      props.handleSubmit({
        type: type,
        selected_resource: selected_resource
      });
      props.handleClose();
    });
  }
  function _cancelHandler() {
    set_show(false);
    props.handleClose();
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "bp6-dark" : "",
    title: "Select a library resource",
    onClose: _cancelHandler,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Resource Type"
  }, /*#__PURE__*/_react["default"].createElement(_selector_advanced.BpSelect, {
    options: res_types,
    onChange: _handleTypeChange,
    value: type
  })), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Specific Resource"
  }, /*#__PURE__*/_react["default"].createElement(_selector_advanced.BpSelect, {
    options: option_names,
    onChange: _handleResourceChange,
    value: selected_resource
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_FOOTER_ACTIONS
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _cancelHandler
  }, "Cancel"), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    intent: _core.Intent.PRIMARY,
    onClick: _submitHandler
  }, "Submit"))));
}
SelectResourceDialog = /*#__PURE__*/(0, _react.memo)(SelectResourceDialog);
SelectResourceDialog.propTypes = {
  handleSubmit: _propTypes["default"].func,
  handleClose: _propTypes["default"].func,
  handleCancel: _propTypes["default"].func,
  submit_text: _propTypes["default"].string,
  cancel_text: _propTypes["default"].string
};
function ConfirmDialog(props) {
  props = _objectSpread({
    submit_text: "Submit",
    cancel_text: "Cancel",
    handleCancel: null
  }, props);
  var _useState43 = (0, _react.useState)(false),
    _useState44 = _slicedToArray(_useState43, 2),
    show = _useState44[0],
    set_show = _useState44[1];
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  (0, _react.useEffect)(function () {
    set_show(true);
  }, []);
  function _submitHandler(event) {
    set_show(false);
    props.handleSubmit();
    props.handleClose();
  }
  function _cancelHandler() {
    set_show(false);
    props.handleClose();
    if (props.handleCancel) {
      props.handleCancel();
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "bp6-dark" : "",
    title: props.title,
    onClose: _cancelHandler,
    autoFocus: true,
    enforceFocus: true,
    usePortal: false,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react["default"].createElement(_core.DialogBody, null, /*#__PURE__*/_react["default"].createElement("p", null, props.text_body)), /*#__PURE__*/_react["default"].createElement(_core.DialogFooter, {
    actions: /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
      onClick: _cancelHandler
    }, props.cancel_text), /*#__PURE__*/_react["default"].createElement(_core.Button, {
      type: "submit",
      intent: _core.Intent.PRIMARY,
      onClick: _submitHandler
    }, props.submit_text))
  }));
}
ConfirmDialog = /*#__PURE__*/(0, _react.memo)(ConfirmDialog);
function EndSessionDialog(props) {
  var _useState45 = (0, _react.useState)(false),
    _useState46 = _slicedToArray(_useState45, 2),
    show = _useState46[0],
    set_show = _useState46[1];
  (0, _react.useEffect)(function () {
    set_show(true);
  }, []);
  function _submitHandler(event) {
    set_show(false);
    window.open($SCRIPT_ROOT + "/logout/" + window.global_id, "_self");
  }
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
    isOpen: show,
    className: settingsContext.isDark() ? "bp6-dark" : "",
    title: props.title,
    autoFocus: true,
    enforceFocus: true,
    usePortal: false,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react["default"].createElement(_core.DialogBody, null, /*#__PURE__*/_react["default"].createElement("p", null, "Your session has timed out.")), /*#__PURE__*/_react["default"].createElement(_core.DialogFooter, {
    actions: /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
      type: "submit",
      intent: _core.Intent.PRIMARY,
      onClick: _submitHandler
    }, "Log out"))
  }));
}