"use strict";

require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _core = require("@blueprintjs/core");
var _blueprint_navbar = require("./blueprint_navbar");
var _toaster = require("./toaster");
var _communication_react = require("./communication_react");
var _utilities_react = require("./utilities_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
window.page_id = (0, _utilities_react.guid)();
function _duplicate_main() {
  (0, _blueprint_navbar.render_navbar)("account");
  let domContainer = document.querySelector('#root');
  ReactDOM.render( /*#__PURE__*/_react.default.createElement(DuplicateApp, null), domContainer);
}
const field_names = ["username", "password", "confirm_password"];
var initial_fields = {};
for (let field of field_names) {
  initial_fields[field] = "";
}
var initial_helper_text = {};
for (let field of field_names) {
  initial_helper_text[field] = null;
}
function DuplicateApp(props) {
  const [fields, set_fields, fields_ref] = (0, _utilities_react.useStateAndRef)(initial_fields);
  const [helper_text, set_helper_text, helper_text_ref] = (0, _utilities_react.useStateAndRef)(initial_helper_text);
  function _onFieldChange(field, value) {
    let new_fields = {
      ...fields_ref.current
    };
    new_fields[field] = value;
    set_fields(new_fields);
  }
  function _submit_duplicate_info() {
    let pwd = fields_ref.current.password;
    let pwd2 = fields_ref.current.confirm_password;
    const data = {};
    if (pwd == "" || pwd2 == "") {
      let new_helper_text = {
        ...helper_text_ref.current,
        confirm_password: "Passwords cannot be empty"
      };
      set_helper_text(new_helper_text);
      return;
    }
    if (pwd != pwd2) {
      let new_helper_text = {
        ...helper_text_ref.current,
        confirm_password: "Passwords don't match"
      };
      set_helper_text(new_helper_text);
      return;
    }
    data.password = pwd;
    let fields = {
      ...fields_ref.current
    };
    fields.old_username = window.old_username;
    (0, _communication_react.postAjax)("attempt_duplicate", fields, function (result) {
      if (result.success) {
        (0, _toaster.doFlash)({
          "message": "Account successfully duplicated",
          "alert_type": "alert-success"
        });
      } else {
        data.alert_type = "alert-warning";
        (0, _toaster.doFlash)(data);
      }
    });
  }
  let field_items = Object.keys(fields_ref.current).map(field_name => /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    key: field_name,
    inline: true,
    style: {
      padding: 10
    },
    label: field_name,
    helperText: helper_text_ref.current[field_name]
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    type: "text",
    onChange: event => _onFieldChange(field_name, event.target.value),
    style: {
      width: 250
    },
    large: true,
    fill: false,
    placeholder: field_name,
    value: fields_ref.current[field_name]
  })));
  let outer_style = {
    textAlign: "center",
    marginLeft: 50,
    marginTop: 50,
    height: "100%"
  };
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-column",
    style: outer_style
  }, /*#__PURE__*/_react.default.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      _submit_duplicate_info();
    }
  }, field_items, /*#__PURE__*/_react.default.createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react.default.createElement(_core.Button, {
    icon: "log-in",
    large: true,
    text: "Submit",
    onClick: _submit_duplicate_info
  })))));
}
DuplicateApp = /*#__PURE__*/(0, _react.memo)(DuplicateApp);
_duplicate_main();