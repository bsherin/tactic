"use strict";

require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _toaster = require("./toaster");
var _communication_react = require("./communication_react");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _settings = require("./settings");
var _account_fields = require("./account_fields");
var _tactic_socket = require("./tactic_socket");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
//comments

window.main_id = (0, _utilities_react.guid)();
function _account_main() {
  if (window._show_message) (0, _toaster.doFlash)(window._message);
  const domContainer = document.querySelector('#root');
  const root = (0, _client.createRoot)(domContainer);
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "code_viewer", window.main_id);
  let AccountAppPlus = (0, _settings.withSettings)(AccountApp);
  root.render(/*#__PURE__*/_react.default.createElement(AccountAppPlus, {
    controlled: false,
    tsocket: tsocket
  }));
}
const field_names = ["new_password", "confirm_new_password"];
function AccountApp(props) {
  const [fields, set_fields, fields_ref] = (0, _utilities_react.useStateAndRef)([]);
  const [password, set_password] = (0, _react.useState)("");
  const [confirm_password, set_confirm_password] = (0, _react.useState)("");
  const [password_helper, set_password_helper] = (0, _react.useState)(null);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(() => {
    (0, _communication_react.postAjax)("get_account_info", {}, data => {
      set_fields(data.field_list);
    });
  }, []);
  function _submitPassword() {
    let pwd = password;
    if (pwd != confirm_password) {
      set_password_helper("Passwords don't match");
      return;
    }
    if (pwd == "") {
      set_password_helper("Passwords can't be empty");
      return;
    }
    let data = {};
    data["password"] = pwd;
    (0, _communication_react.postAjax)("update_account_info", data, function (result) {
      if (result.success) {
        (0, _toaster.doFlash)({
          "message": "Password successfully updated",
          "alert_type": "alert-success"
        });
      } else {
        data.alert_type = "alert-warning";
        (0, _toaster.doFlash)(data);
      }
    });
  }
  function _onFieldChange(fname, value) {
    let submit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    if (fname == "password") {
      set_password(value);
    } else if (fname == "confirm_password") {
      set_confirm_password(value);
    } else {
      let new_fields = fields.map(fdict => {
        if (fdict.name == fname) {
          let ndict = {
            ...fdict
          };
          ndict.val = value;
          return ndict;
        } else {
          return fdict;
        }
      });
      set_fields(new_fields);
      pushCallback(() => {
        if (submit) {
          _submitUpdatedField(fname, value);
        }
      });
    }
  }
  function _clearHelperText(fname) {
    _setHelperText(fname, null);
  }
  function _setHelperText(fname, helper_text) {
    let timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    // Need to use fields_ref here because of the setTimeout in which it appears.
    let new_fields = fields_ref.current.map(fdict => {
      if (fdict.name == fname) {
        let ndict = {
          ...fdict
        };
        ndict.helper_text = helper_text;
        return ndict;
      } else {
        return fdict;
      }
    });
    set_fields(new_fields);
    pushCallback(() => {
      if (timeout) {
        setTimeout(() => {
          _clearHelperText(fname);
        }, 5000);
      }
    });
  }
  function _submitUpdatedField(fname, fvalue) {
    let data = {};
    data[fname] = fvalue;
    (0, _communication_react.postAjax)("update_account_info", data, function (result) {
      if (result.success) {
        if (fname == "password") {
          (0, _toaster.doFlash)({
            "message": "Password successfully updated",
            "alert_type": "alert-success"
          });
        } else {
          _setHelperText(fname, "value updated", true);
        }
      } else {
        data.alert_type = "alert-warning";
        (0, _toaster.doFlash)(data);
      }
    });
  }
  function _submit_account_info() {
    (0, _communication_react.postAjax)("update_account_info", fields_ref.current, function (result) {
      if (result.success) {
        (0, _toaster.doFlash)({
          "message": "Account successfully updated",
          "alert_type": "alert-success"
        });
      } else {
        data.alert_type = "alert-warning";
        (0, _toaster.doFlash)(data);
      }
    });
  }
  function _getFieldItems() {
    let info_items = [];
    let setting_items = [];
    for (let fdict of fields) {
      let new_item;
      if (fdict.type == "text") {
        new_item = /*#__PURE__*/_react.default.createElement(_account_fields.AccountTextField, {
          name: fdict.name,
          key: fdict.name,
          value: fdict.val,
          display_text: fdict.display_text,
          helper_text: fdict.helper_text,
          onBlur: _submitUpdatedField,
          onFieldChange: _onFieldChange
        });
      } else {
        new_item = /*#__PURE__*/_react.default.createElement(_account_fields.AccountSelectField, {
          name: fdict.name,
          key: fdict.name,
          value: fdict.val,
          display_text: fdict.display_text,
          options: fdict.options,
          helper_text: fdict.helper_text,
          onFieldChange: _onFieldChange
        });
      }
      if (fdict.info_type == "info") {
        info_items.push(new_item);
      } else {
        setting_items.push(new_item);
      }
    }
    return [info_items, setting_items];
  }
  let field_items = _getFieldItems();
  let outer_class = "account-settings";
  if (settingsContext.isDark()) {
    outer_class = outer_class + " bp5-dark";
  } else {
    outer_class = outer_class + " light-theme";
  }
  let self = this;
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: false,
    page_id: window.main_id,
    user_name: window.username
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: outer_class
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      overflowY: "scroll"
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "account-pane bp5-card"
  }, /*#__PURE__*/_react.default.createElement("h6", null, "User Info"), field_items[0]), /*#__PURE__*/_react.default.createElement("div", {
    className: "account-pane bp5-card"
  }, /*#__PURE__*/_react.default.createElement("h6", null, "User Settings"), field_items[1])), /*#__PURE__*/_react.default.createElement("div", {
    className: "account-pane bp5-card"
  }, /*#__PURE__*/_react.default.createElement("h6", null, "Change Password"), /*#__PURE__*/_react.default.createElement(_account_fields.AccountTextField, {
    name: "password",
    key: "password",
    value: password,
    helper_text: password_helper,
    onFieldChange: _onFieldChange
  }), /*#__PURE__*/_react.default.createElement(_account_fields.AccountTextField, {
    name: "confirm_password",
    key: "confirm_password",
    value: confirm_password,
    helper_text: password_helper,
    onFieldChange: _onFieldChange
  }), /*#__PURE__*/_react.default.createElement(_core.Button, {
    icon: "log-in",
    large: true,
    text: "Update Password",
    onClick: _submitPassword
  }))));
}
AccountApp = /*#__PURE__*/(0, _react.memo)(AccountApp);
_account_main();