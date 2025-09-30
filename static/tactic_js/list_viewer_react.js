"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListViewerApp = ListViewerApp;
exports.list_viewer_props = list_viewer_props;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _assistant = require("./assistant");
var _settings = require("./settings");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _modal_react = require("./modal_react");
var _sizing_tools = require("./sizing_tools");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
if (!window.in_context) {
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/tactic.scss")));
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/resource_viewer.scss")));
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/themeable.scss")));
}
function list_viewer_props(data, registerDirtyMethod, finalCallback) {
  if (!window.in_context) {
    window.global_id = data.local_id;
  }
  finalCallback({
    local_id: data.local_id,
    tsocket: data.tsocket,
    split_tags: [],
    created: "",
    resource_name: data.resource_name,
    the_content: [],
    notes: [],
    readOnly: false,
    is_repository: false,
    registerDirtyMethod: registerDirtyMethod
  });
}
function ListEditor(props) {
  const top_ref = (0, _react.useRef)(null);
  let tastyle = {
    resize: "horizontal",
    flexGrow: 1
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "listarea-container",
    ref: top_ref,
    style: {
      display: "flex",
      height: "100%"
    }
  }, /*#__PURE__*/_react.default.createElement(_core.TextArea, {
    cols: "50",
    style: tastyle,
    disabled: props.readOnly,
    onChange: props.handleChange,
    value: props.the_content
  }));
}
ListEditor = /*#__PURE__*/(0, _react.memo)(ListEditor);
ListEditor.propTypes = {
  the_content: _propTypes.default.string,
  handleChange: _propTypes.default.func,
  readOnly: _propTypes.default.bool,
  height: _propTypes.default.number
};
function ListViewerApp(props) {
  props = {
    controlled: false,
    changeResourceName: null,
    updatePanel: null,
    refreshTab: null,
    closeTab: null,
    ...props
  };
  const top_ref = (0, _react.useRef)(null);
  const savedContent = (0, _react.useRef)();
  const initialized = (0, _react.useRef)(false);
  const [list_content, set_list_content, list_content_ref] = (0, _utilities_react.useStateAndRef)("");
  const [resource_name, set_resource_name] = (0, _react.useState)(props.resource_name);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(() => {
    statusFuncs.stopSpinner();
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
      // This postPromise can't go to the local stack because it's not ready in time
    }
    (0, _communication_react.postPromise)("host", "get_list_content_with_metadata_task", {
      "list_name": props.resource_name
    }).then(data => {
      const the_list = data["the_list"];
      const metadata = data["metadata"];
      set_list_content(the_list);
      savedContent.current = the_list;
      initialized.current = true;
    });
  }, []);
  const pushCallback = (0, _utilities_react.useCallbackStack)("list_viewer");
  const hotkeys = (0, _react.useMemo)(() => [{
    combo: "Ctrl+S",
    global: false,
    group: "Module Viewer",
    label: "Save Code",
    onKeyDown: _saveMe
  }], [_saveMe]);
  const {
    handleKeyDown,
    handleKeyUp
  } = (0, _core.useHotkeys)(hotkeys);
  (0, _react.useEffect)(() => {
    if (!props.controlled) {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
        }
      });
    }
  }, []);
  function cPropGetters() {
    return {
      resource_name: resource_name
    };
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : cPropGetters()[pname];
  }
  function menu_specs() {
    let ms;
    if (props.is_repository) {
      ms = {
        Transfer: [{
          "name_text": "Copy to library",
          "icon_name": "import",
          "click_handler": async () => {
            await (0, _resource_viewer_react_app.copyToLibrary)("list", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
          },
          tooltip: "Copy to library"
        }]
      };
    } else {
      ms = {
        Save: [{
          name_text: "Save",
          icon_name: "saved",
          click_handler: _saveMe,
          key_bindings: ['Ctrl+S'],
          tooltip: "Save"
        }, {
          name_text: "Save As...",
          icon_name: "floppy-disk",
          click_handler: _saveMeAs,
          tooltip: "Save as"
        }],
        Transfer: [{
          name_text: "Share",
          icon_name: "share",
          click_handler: async () => {
            await (0, _resource_viewer_react_app.sendToRepository)("list", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
          },
          tooltip: "Share to repository"
        }]
      };
    }
    for (const [, menu] of Object.entries(ms)) {
      for (let but of menu) {
        but.click_handler = but.click_handler.bind(this);
      }
    }
    return ms;
  }
  function _setResourceNameState(new_name, callback = null) {
    if (props.controlled) {
      props.changeResourceName(new_name, callback);
    } else {
      set_resource_name(new_name);
      pushCallback(callback);
    }
  }
  function _handleListChange(event) {
    set_list_content(event.target.value);
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  async function _saveMe() {
    if (!am_selected()) {
      return false;
    }
    const new_list_as_string = list_content_ref.current;
    const result_dict = {
      "list_name": _cProp("resource_name"),
      "new_list_as_string": new_list_as_string
    };
    try {
      await (0, _communication_react.postPromise)("host", "update_list_task", result_dict, props.local_id);
      savedContent.current = new_list_as_string;
      statusFuncs.statusMessage(`Saved list ${result_dict.list_name}`);
    } catch (e) {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: `Error creating new notebook`,
        content: "message" in data ? data.message : ""
      });
    }
  }
  async function _saveMeAs() {
    if (!am_selected()) {
      return false;
    }
    try {
      let ln_result = await (0, _communication_react.postPromise)("host", "get_list_names_task", {}, props.local_id);
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: "Save List As",
        field_title: "New List Name",
        default_value: "NewList",
        existing_names: ln_result["list_names"],
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      const result_dict = {
        "new_res_name": new_name,
        "res_to_copy": _cProp("resource_name")
      };
      await (0, _communication_react.postPromise)("host", "create_duplicate_list_task", result_dict, props.local_id);
      _setResourceNameState(new_name, () => {
        _saveMe();
      });
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error saving listy`, e);
      }
    }
  }
  function _dirty() {
    return !(list_content_ref.current == savedContent.current);
  }
  let my_props = {
    ...props
  };
  let outer_style = {
    width: `calc(100% - ${_sizing_tools.ICON_BAR_WIDTH}px)`,
    height: "100%",
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingLeft: 0,
    position: "relative"
  };
  let outer_class = "resource-viewer-holder";
  if (!props.controlled) {
    my_props.resource_name = resource_name;
    outer_class = `${outer_class} pane-holder ${settingsContext.isDark() ? "bp6-dark" : "light-theme"}`;
  }
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, !props.controlled && /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    global_id: props.global_id,
    user_name: window.username
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style,
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react.default.createElement(_resource_viewer_react_app.ResourceViewerApp, (0, _extends2.default)({}, my_props, {
    padTop: true,
    local_id: props.local_id,
    setResourceNameState: _setResourceNameState,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "list",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs(),
    created: props.created,
    showErrorDrawerButton: false,
    saveMe: _saveMe
  }), /*#__PURE__*/_react.default.createElement(ListEditor, {
    the_content: list_content,
    readOnly: props.readOnly,
    handleChange: _handleListChange
  }))));
}
exports.ListViewerApp = ListViewerApp = /*#__PURE__*/(0, _react.memo)(ListViewerApp);
async function list_viewer_main() {
  let local_id = "a" + (0, _utilities_react.guid)();
  function gotProps(the_props) {
    let ListViewerAppPlus = (0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(ListViewerApp)))));
    let the_element = /*#__PURE__*/_react.default.createElement(ListViewerAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      changeName: null
    }));
    const domContainer = document.querySelector('#root');
    const root = (0, _client.createRoot)(domContainer);
    root.render(the_element);
  }
  let tsocket = new _tactic_socket.TacticSocket("main", 5000, "list_viewer", local_id, async () => {
    tsocket.attachListener('handle-callback', task_packet => {
      (0, _communication_react.handleCallback)(task_packet, local_id);
    });
    let data = {
      resource_name: resource_name,
      res_type: "list",
      local_id,
      tsocket
    };
    list_viewer_props(data, null, gotProps);
  });
}
if (!window.in_context) {
  list_viewer_main().then();
}