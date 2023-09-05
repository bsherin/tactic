"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DialogContext = void 0;
exports.SelectResourceDialog = SelectResourceDialog;
exports.showConfirmDialogReact = showConfirmDialogReact;
exports.showModalAddressSelector = showModalAddressSelector;
exports.showModalReact = showModalReact;
exports.showPresentationDialog = showPresentationDialog;
exports.showReportDialog = showReportDialog;
exports.showSelectDialog = showSelectDialog;
exports.showSelectResourceDialog = showSelectResourceDialog;
exports.withDialogs = withDialogs;
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _utilities_react = require("./utilities_react");
var _core = require("@blueprintjs/core");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _communication_react = require("./communication_react");
var _pool_tree = require("./pool_tree");
var _theme = require("./theme");
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
var DialogContext = /*#__PURE__*/(0, _react.createContext)(null);
exports.DialogContext = DialogContext;
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
    function hideModal() {
      setState({
        modalType: null,
        dialogProps: {},
        keyCounter: 0
      });
    }
    return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(DialogContext.Provider, {
      value: {
        showModal: showModal,
        hideModal: hideModal
      }
    }, /*#__PURE__*/_react["default"].createElement(WrappedComponent, props)), /*#__PURE__*/_react["default"].createElement("div", null, state.modalType == "ModalDialog" && /*#__PURE__*/_react["default"].createElement(ModalDialog, _extends({
      key: state.keyCounter,
      isOpen: state.modalType == "ModalDialog"
    }, state.dialogProps))));
  }
  return /*#__PURE__*/(0, _react.memo)(ModalFunc);
}
function ModalDialog(props) {
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
  var theme = (0, _react.useContext)(_theme.ThemeContext);
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
      props.handleSubmit(current_value_ref.current, checkbox_states);
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
    className: theme.dark_theme ? "bp5-dark" : "",
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
ModalDialog.propTypes = {
  handleSubmit: _propTypes["default"].func,
  handleClose: _propTypes["default"].func,
  title: _propTypes["default"].string,
  field_title: _propTypes["default"].string,
  default_value: _propTypes["default"].string,
  existing_names: _propTypes["default"].array,
  checkboxes: _propTypes["default"].array
};
ModalDialog.defaultProps = {
  existing_names: [],
  default_value: "",
  checkboxes: null
};
function showModalReact(modal_title, field_title, submit_function, default_value, existing_names) {
  var checkboxes = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var cancel_function = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;
  if (typeof existing_names == "undefined") {
    existing_names = [];
  }
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(ModalDialog, {
    handleSubmit: submit_function,
    handleCancel: cancel_function,
    handleClose: handle_close,
    initial_theme: window.dark_theme ? "dark" : "light",
    title: modal_title,
    field_title: field_title,
    default_value: default_value,
    checkboxes: checkboxes,
    existing_names: existing_names
  }), domContainer);
}
function PresentationDialog(props) {
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    show = _useState4[0],
    set_show = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    save_as_collection = _useState6[0],
    set_save_as_collection = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    collection_name = _useState8[0],
    set_collection_name = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = _slicedToArray(_useState9, 2),
    use_dark_theme = _useState10[0],
    set_use_dark_theme = _useState10[1];
  var _useState11 = (0, _react.useState)(""),
    _useState12 = _slicedToArray(_useState11, 2),
    warning_text = _useState12[0],
    set_warning_text = _useState12[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
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
    props.handleSubmit(use_dark_theme, save_as_collection, collection_name);
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
    className: theme.dark_theme ? "bp5-dark" : "",
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
PresentationDialog = /*#__PURE__*/(0, _react.memo)((0, _theme.withTheme)(PresentationDialog));
PresentationDialog.propTypes = {
  handleSubmit: _propTypes["default"].func,
  handleClose: _propTypes["default"].func,
  default_name: _propTypes["default"].string,
  existing_names: _propTypes["default"].array
};
PresentationDialog.defaultProps = {
  existing_names: [],
  default_name: ""
};
function showPresentationDialog(submit_function, existing_names) {
  var cancel_function = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (typeof existing_names == "undefined") {
    existing_names = [];
  }
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(PresentationDialog, {
    handleSubmit: submit_function,
    handleCancel: cancel_function,
    handleClose: handle_close,
    initial_theme: window.dark_theme ? "dark" : "light",
    default_name: "NewPresentation",
    existing_names: existing_names
  }), domContainer);
}
function ReportDialog(props) {
  var _useState13 = (0, _react.useState)(false),
    _useState14 = _slicedToArray(_useState13, 2),
    show = _useState14[0],
    set_show = _useState14[1];
  var _useState15 = (0, _react.useState)(false),
    _useState16 = _slicedToArray(_useState15, 2),
    save_as_collection = _useState16[0],
    set_save_as_collection = _useState16[1];
  var _useState17 = (0, _react.useState)(null),
    _useState18 = _slicedToArray(_useState17, 2),
    collection_name = _useState18[0],
    set_collection_name = _useState18[1];
  var _useState19 = (0, _react.useState)(null),
    _useState20 = _slicedToArray(_useState19, 2),
    use_dark_theme = _useState20[0],
    set_use_dark_theme = _useState20[1];
  var _useState21 = (0, _react.useState)(""),
    _useState22 = _slicedToArray(_useState21, 2),
    warning_text = _useState22[0],
    set_warning_text = _useState22[1];
  var _useState23 = (0, _react.useState)(false),
    _useState24 = _slicedToArray(_useState23, 2),
    collapsible = _useState24[0],
    set_collapsible = _useState24[1];
  var _useState25 = (0, _react.useState)(false),
    _useState26 = _slicedToArray(_useState25, 2),
    include_summaries = _useState26[0],
    set_include_summaries = _useState26[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
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
    props.handleSubmit(collapsible, include_summaries, use_dark_theme, save_as_collection, collection_name);
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
    className: theme.dark_theme ? "bp5-dark" : "",
    title: "Create Presentation",
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
ReportDialog = /*#__PURE__*/(0, _react.memo)((0, _theme.withTheme)(ReportDialog));
ReportDialog.propTypes = {
  handleSubmit: _propTypes["default"].func,
  handleClose: _propTypes["default"].func,
  default_name: _propTypes["default"].string,
  existing_names: _propTypes["default"].array
};
ReportDialog.defaultProps = {
  existing_names: [],
  default_name: "NewReport"
};
function showReportDialog(submit_function, existing_names) {
  var cancel_function = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  if (typeof existing_names == "undefined") {
    existing_names = [];
  }
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(ReportDialog, {
    handleSubmit: submit_function,
    handleCancel: cancel_function,
    handleClose: handle_close,
    initial_theme: window.dark_theme ? "dark" : "light",
    default_name: "NewReport",
    existing_names: existing_names
  }), domContainer);
}
function SelectDialog(props) {
  var _useState27 = (0, _react.useState)(false),
    _useState28 = _slicedToArray(_useState27, 2),
    show = _useState28[0],
    set_show = _useState28[1];
  var _useState29 = (0, _react.useState)(false),
    _useState30 = _slicedToArray(_useState29, 2),
    value = _useState30[0],
    set_value = _useState30[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  (0, _react.useEffect)(function () {
    set_show(true);
    set_value(props.option_list[0]);
  }, []);
  function _handleChange(val) {
    set_value(val);
  }
  function _submitHandler(event) {
    set_show(false);
    props.handleSubmit(value);
    props.handleClose();
  }
  function _cancelHandler() {
    set_show(false);
    props.handleClose();
  }
  return /*#__PURE__*/_react["default"].createElement(_core.Dialog, {
    isOpen: show,
    className: theme.dark_theme ? "bp5-dark" : "",
    title: props.title,
    onClose: _cancelHandler,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    title: props.select_label
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
    options: props.option_list,
    onChange: _handleChange,
    value: value
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
SelectDialog = /*#__PURE__*/(0, _react.memo)((0, _theme.withTheme)(SelectDialog));
SelectDialog.propTypes = {
  handleSubmit: _propTypes["default"].func,
  handleClose: _propTypes["default"].func,
  handleCancel: _propTypes["default"].func,
  title: _propTypes["default"].string,
  select_label: _propTypes["default"].string,
  option_list: _propTypes["default"].array,
  submit_text: _propTypes["default"].string,
  cancel_text: _propTypes["default"].string
};
function showSelectDialog(title, select_label, cancel_text, submit_text, submit_function, option_list) {
  var dark_theme = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(SelectDialog, {
    handleSubmit: submit_function,
    handleClose: handle_close,
    title: title,
    initial_theme: window.dark_theme ? "dark" : "light",
    select_label: select_label,
    submit_text: submit_text,
    option_list: option_list,
    cancel_text: cancel_text
  }), domContainer);
}
function SelectAddressDialog(props) {
  var _useState31 = (0, _react.useState)(false),
    _useState32 = _slicedToArray(_useState31, 2),
    show = _useState32[0],
    set_show = _useState32[1];
  var _useState33 = (0, _react.useState)(""),
    _useState34 = _slicedToArray(_useState33, 2),
    new_name = _useState34[0],
    set_new_name = _useState34[1];
  var _useState35 = (0, _react.useState)(),
    _useState36 = _slicedToArray(_useState35, 2),
    path = _useState36[0],
    set_path = _useState36[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
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
    className: theme.dark_theme ? "bp5-dark" : "",
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
SelectAddressDialog = /*#__PURE__*/(0, _react.memo)((0, _theme.withTheme)(SelectAddressDialog));
function showModalAddressSelector(title, submit_function) {
  var selectType = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "folder";
  var initial_address = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "mydisk";
  var initial_name = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "";
  var showName = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(SelectAddressDialog, {
    title: title,
    handleClose: handle_close,
    initial_theme: window.dark_theme ? "dark" : "light",
    handleSubmit: submit_function,
    showName: showName,
    selectType: selectType,
    initial_name: initial_name,
    initial_address: initial_address
  }), domContainer);
}
var res_types = ["collection", "project", "tile", "list", "code"];
function SelectResourceDialog(props) {
  var _useState37 = (0, _react.useState)(false),
    _useState38 = _slicedToArray(_useState37, 2),
    show = _useState38[0],
    set_show = _useState38[1];
  var _useState39 = (0, _react.useState)(null),
    _useState40 = _slicedToArray(_useState39, 2),
    value = _useState40[0],
    set_value = _useState40[1];
  var _useState41 = (0, _react.useState)("collection"),
    _useState42 = _slicedToArray(_useState41, 2),
    type = _useState42[0],
    set_type = _useState42[1];
  var _useState43 = (0, _react.useState)([]),
    _useState44 = _slicedToArray(_useState43, 2),
    option_names = _useState44[0],
    set_option_names = _useState44[1];
  var _useState45 = (0, _react.useState)(null),
    _useState46 = _slicedToArray(_useState45, 2),
    selected_resource = _useState46[0],
    set_selected_resource = _useState46[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    console.log("I'm in useEffect");
    _handleTypeChange("collection");
  }, []);
  function _handleTypeChange(val) {
    var get_url = "get_".concat(val, "_names");
    var dict_hash = "".concat(val, "_names");
    console.log("about to postWithCallback");
    (0, _communication_react.postWithCallback)("host", get_url, {
      "user_id": user_id
    }, function (data) {
      console.log("returned from post");
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
    className: window.dark_theme ? "bp5-dark" : "",
    title: "Select a library resource",
    onClose: _cancelHandler,
    canEscapeKeyClose: true
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: _core.Classes.DIALOG_BODY
  }, /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Resource Type"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
    options: res_types,
    onChange: _handleTypeChange,
    value: type
  })), /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Specific Resource"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
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
SelectDialog = /*#__PURE__*/(0, _react.memo)((0, _theme.withTheme)(SelectDialog));
SelectResourceDialog.propTypes = {
  handleSubmit: _propTypes["default"].func,
  handleClose: _propTypes["default"].func,
  handleCancel: _propTypes["default"].func,
  submit_text: _propTypes["default"].string,
  cancel_text: _propTypes["default"].string
};
function showSelectResourceDialog(cancel_text, submit_text, submit_function) {
  var dark_theme = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  var the_elem = /*#__PURE__*/_react["default"].createElement(SelectResourceDialog, {
    handleSubmit: submit_function,
    handleClose: handle_close,
    initial_theme: window.dark_theme ? "dark" : "light",
    submit_text: submit_text,
    cancel_text: cancel_text
  });
  ReactDOM.render(the_elem, domContainer);
}
function ConfirmDialog(props) {
  var _useState47 = (0, _react.useState)(false),
    _useState48 = _slicedToArray(_useState47, 2),
    show = _useState48[0],
    set_show = _useState48[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
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
    className: theme.dark_theme ? "bp5-dark" : "",
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
ConfirmDialog = /*#__PURE__*/(0, _react.memo)((0, _theme.withTheme)(ConfirmDialog));
ConfirmDialog.propTypes = {
  handleSubmit: _propTypes["default"].func,
  handleCancel: _propTypes["default"].func,
  handleClose: _propTypes["default"].func,
  title: _propTypes["default"].string,
  text_body: _propTypes["default"].string,
  submit_text: _propTypes["default"].string,
  cancel_text: _propTypes["default"].string
};
ConfirmDialog.defaultProps = {
  submit_text: "Submit",
  cancel_text: "Cancel",
  handleCancel: null
};
function showConfirmDialogReact(title, text_body, cancel_text, submit_text, submit_function) {
  var cancel_function = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
  var domContainer = document.querySelector('#modal-area');
  function handle_close() {
    ReactDOM.unmountComponentAtNode(domContainer);
  }
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(ConfirmDialog, {
    handleSubmit: submit_function,
    handleCancel: cancel_function,
    handleClose: handle_close,
    initial_theme: window.dark_theme ? "dark" : "light",
    title: title,
    text_body: text_body,
    submit_text: submit_text,
    cancel_text: cancel_text
  }), domContainer);
}