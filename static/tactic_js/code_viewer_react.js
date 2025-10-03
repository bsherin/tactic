"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodeViewerApp = CodeViewerApp;
exports.code_viewer_props = code_viewer_props;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _reactCodemirror = require("./react-codemirror6");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _error_drawer = require("./error_drawer.js");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _settings = require("./settings");
var _assistant = require("./assistant");
var _modal_react = require("./modal_react");
var _error_drawer2 = require("./error_drawer");
var _sizing_tools = require("./sizing_tools");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
if (!window.in_context) {
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/tactic.scss")));
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/resource_viewer.scss")));
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/themeable.scss")));
}
function code_viewer_props(data, registerDirtyMethod, finalCallback) {
  const local_id = data.local_id || (0, _utilities_react.guid)();
  let tsocket = data.tsocket;
  if (!window.in_context) {
    window.global_id = local_id;
  }
  finalCallback({
    local_id: local_id,
    tsocket: tsocket,
    split_tags: [],
    created: "",
    resource_name: data.resource_name,
    the_content: "",
    notes: "",
    readOnly: data.read_only,
    is_repository: data.is_repository,
    registerDirtyMethod: registerDirtyMethod
  });
}
function CodeViewerApp(props) {
  props = {
    controlled: false,
    changeResourceName: null,
    updatePanel: null,
    refreshTab: null,
    closeTab: null,
    the_content: "",
    ...props
  };
  const top_ref = (0, _react.useRef)(null);
  const search_ref = (0, _react.useRef)(null);
  const cmObjectRef = (0, _react.useRef)(null);
  const savedContent = (0, _react.useRef)("");
  const initialized = (0, _react.useRef)(false);
  const [code_content, set_code_content, code_content_ref] = (0, _utilities_react.useStateAndRef)("");
  const [current_search_number, set_current_search_number, current_search_number_ref] = (0, _utilities_react.useStateAndRef)(null);
  const [search_string, set_search_string] = (0, _react.useState)("");
  const [regex, set_regex] = (0, _react.useState)(false);
  const [search_matches, set_search_matches, search_matches_ref] = (0, _utilities_react.useStateAndRef)(null);
  const [resource_name, set_resource_name] = (0, _react.useState)(props.resource_name);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer2.ErrorDrawerContext);
  (0, _react.useEffect)(() => {
    statusFuncs.stopSpinner();
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
    }
    (0, _communication_react.postPromise)("host", "get_code_content_with_metadata_task", {
      "code_name": props.resource_name
    }).then(data => {
      if (!data["success"]) {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: "Error getting code content",
          content: "Code not found"
        });
        props.closeTab();
      } else {
        const the_code = data["the_code"];
        const metadata = data["metadata"];
        set_code_content(the_code);
        savedContent.current = the_code;
        initialized.current = true;
      }
    });
    return () => {
      cmObjectRef.current = null;
      set_code_content(null);
      if (!props.controlled) {
        window.removeEventListener("beforeunload", function (e) {
          if (_dirty()) {
            e.preventDefault();
          }
        });
      }
    };
  }, []);
  const pushCallback = (0, _utilities_react.useCallbackStack)("code_viewer");
  const _saveMe = (0, _react.useCallback)(async () => {
    if (!am_selected()) {
      return false;
    }
    const new_code = code_content_ref.current;
    const result_dict = {
      "code_name": _cProp("resource_name"),
      "new_code": new_code,
      "user_id": window.user_id
    };
    try {
      await (0, _communication_react.postPromise)("host", "update_code_task", result_dict, props.local_id);
      savedContent.current = new_code;
      statusFuncs.statusMessage(`Updated code resource ${_cProp("resource_name")}`, 7);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error saving code", e);
    }
    return false;
  }, [code_content]);
  const hotkeys = (0, _react.useMemo)(() => [{
    combo: "Ctrl+S",
    global: false,
    group: "Code Viewer",
    label: "Save Code",
    onKeyDown: _saveMe
  }], [_saveMe]);
  const {
    handleKeyDown,
    handleKeyUp
  } = (0, _core.useHotkeys)(hotkeys);
  (0, _utilities_react.useConstructor)(() => {
    if (!props.controlled) {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
        }
      });
    }
  });
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  function _update_search_state(nstate) {
    set_current_search_number(0);
    for (let field in nstate) {
      switch (field) {
        case "regex":
          set_regex(nstate[field]);
          break;
        case "search_string":
          set_search_string(nstate[field]);
          break;
      }
    }
  }
  function cPropGetters() {
    return {
      resource_name: resource_name
    };
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : cPropGetters()[pname];
  }
  const menu_specs = (0, _react.useMemo)(() => {
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
            await (0, _resource_viewer_react_app.sendToRepository)("code", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
          },
          tooltip: "Share to repository"
        }]
      };
    }
    return ms;
  });
  function _handleCodeChange(new_code) {
    set_code_content(new_code);
  }
  function _setResourceNameState(new_name, callback = null) {
    if (props.controlled) {
      props.changeResourceName(new_name, callback);
    } else {
      set_resource_name(new_name);
      pushCallback(callback);
    }
  }
  async function _setResourceNameStatePromise(new_name) {
    return new Promise(resolve => {
      _setResourceNameState(new_name, resolve);
    });
  }
  function _setSearchMatches(nmatches) {
    set_search_matches(nmatches);
  }
  function _searchNext() {
    if (current_search_number_ref.current < search_matches_ref.current - 1) {
      set_current_search_number(current_search_number_ref.current + 1);
    }
  }
  function _searchPrev() {
    if (current_search_number_ref.current > 0) {
      set_current_search_number(current_search_number_ref.current - 1);
    }
  }
  function _setCmObject(cm) {
    cmObjectRef.current = cm;
  }
  function _extraKeys() {
    return [{
      key: 'Ctrl-s',
      run: _saveMe
    }, {
      key: 'Ctrl-f',
      run: () => {
        search_ref.current.focus();
      },
      preventDefault: true
    }, {
      key: 'Cmd-f',
      run: () => {
        search_ref.current.focus();
      },
      preventDefault: true
    }, {
      key: 'Ctrl-g',
      run: () => {
        _searchNext();
      },
      preventDefault: true
    }, {
      key: 'Cmd-g',
      run: () => {
        _searchNext();
      },
      preventDefault: true
    }, {
      key: 'Ctrl-Shift-g',
      run: () => {
        _searchPrev();
      },
      preventDefault: true
    }, {
      key: 'Cmd-Shift-g',
      run: () => {
        _searchPrev();
      },
      preventDefault: true
    }];
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  async function _saveMeAs() {
    if (!am_selected()) {
      return false;
    }
    statusFuncs.startSpinner();
    try {
      let data = await (0, _communication_react.postPromise)("host", "get_code_names_task", {
        "user_id": window.user_id
      }, props.local_id);
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: "Save Code As",
        field_title: "New Code Name",
        default_value: "NewCode",
        existing_names: data["code_names"],
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      const result_dict = {
        "new_res_name": new_name,
        "res_to_copy": _cProp("resource_name")
      };
      await (0, _communication_react.postPromise)("host", "create_duplicate_code_task", result_dict, props.local_id);
      await _setResourceNameStatePromise(new_name);
      await _saveMe();
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error saving code`, e);
      }
    }
    statusFuncs.stopSpinner();
  }
  function _dirty() {
    return !(code_content_ref.current == savedContent.current);
  }
  let my_props = {
    ...props
  };
  let outer_style = {
    width: `calc(100% - ${_sizing_tools.ICON_BAR_WIDTH}px)`,
    height: "100%",
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
    local_id: props.local_id,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "code",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs,
    created: props.created,
    show_search: false,
    showErrorDrawerButton: true
  }), /*#__PURE__*/_react.default.createElement(_reactCodemirror.ReactCodemirror6, {
    code_content: code_content,
    controlled: true,
    show_fold_button: true,
    flex_size: true,
    extraKeys: _extraKeys(),
    readOnly: props.readOnly,
    handleChange: _handleCodeChange,
    saveMe: _saveMe,
    show_search: true,
    setCMObject: _setCmObject,
    search_term: search_string,
    search_ref: search_ref,
    search_matches: search_matches,
    updateSearchState: _update_search_state,
    regex_search: regex,
    searchPrev: _searchPrev,
    searchNext: _searchNext,
    highlight_active_line: true,
    current_search_number: current_search_number,
    setSearchMatches: _setSearchMatches
  }))));
}
exports.CodeViewerApp = CodeViewerApp = /*#__PURE__*/(0, _react.memo)(CodeViewerApp);
function code_viewer_main() {
  let local_id = "a" + (0, _utilities_react.guid)();
  function gotProps(the_props) {
    let CodeViewerAppPlus = (0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(CodeViewerApp)))));
    let the_element = /*#__PURE__*/_react.default.createElement(CodeViewerAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      changeName: null
    }));
    const domContainer = document.querySelector('#root');
    const root = (0, _client.createRoot)(domContainer);
    root.render(the_element);
  }
  let tsocket = new _tactic_socket.TacticSocket("main", 5000, "code_viewer", local_id, async () => {
    tsocket.attachListener('handle-callback', task_packet => {
      (0, _communication_react.handleCallback)(task_packet, local_id);
    });
    let data = {
      resource_name: resource_name,
      res_type: "code",
      local_id,
      tsocket
    };
    data.read_only = window.read_only;
    data.is_repository = window.is_repository;
    code_viewer_props(data, null, gotProps);
  });
}
if (!window.in_context) {
  code_viewer_main();
}