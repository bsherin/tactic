"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleViewerApp = ModuleViewerApp;
exports.module_viewer_props = module_viewer_props;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _reactCodemirror = require("./react-codemirror6");
var _communication_react = require("./communication_react");
var _error_drawer = require("./error_drawer");
var _toaster = require("./toaster");
var _assistant = require("./assistant");
var _sizing_tools = require("./sizing_tools");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
if (!window.in_context) {
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/tactic.scss")));
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/resource_viewer.scss")));
  Promise.resolve().then(() => _interopRequireWildcard(require("../tactic_css/themeable.scss")));
}
function module_viewer_props(data, registerDirtyMethod, finalCallback) {
  let resource_viewer_id = (0, _utilities_react.guid)();
  if (!window.in_context) {
    window.main_id = resource_viewer_id;
  }
  const tsocket = new _tactic_socket.TacticSocket("main", 5000, "module_viewer", resource_viewer_id, () => {
    finalCallback({
      resource_viewer_id: resource_viewer_id,
      main_id: resource_viewer_id,
      tsocket: tsocket,
      split_tags: [],
      created: "",
      resource_name: data.resource_name,
      the_content: "",
      notes: "",
      readOnly: false,
      is_repository: false,
      registerDirtyMethod: registerDirtyMethod
    });
  });
}
function ModuleViewerApp(props) {
  props = {
    controlled: false,
    changeResourceName: null,
    refreshTab: null,
    closeTab: null,
    updatePanel: null,
    ...props
  };
  const top_ref = (0, _react.useRef)(null);
  const search_ref = (0, _react.useRef)(null);
  const savedContent = (0, _react.useRef)(props.the_content);
  const [code_content, set_code_content, code_content_ref] = (0, _utilities_react.useStateAndRef)("");
  const [current_search_number, set_current_search_number, current_search_number_ref] = (0, _utilities_react.useStateAndRef)(null);
  const [search_string, set_search_string] = (0, _react.useState)("");
  const [regex, set_regex] = (0, _react.useState)(false);
  const [search_matches, set_search_matches, search_matches_ref] = (0, _utilities_react.useStateAndRef)(null);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  const [resource_name, set_resource_name] = (0, _react.useState)(props.resource_name);
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  (0, _react.useEffect)(() => {
    statusFuncs.stopSpinner();
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
    }
  }, []);
  const pushCallback = (0, _utilities_react.useCallbackStack)("module_viewer");
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
    statusFuncs.stopSpinner();
    if (!props.controlled) {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
    }
    (0, _communication_react.postPromise)("host", "get_tile_content_with_metadata_task", {
      "tile_module_name": props.resource_name
    }).then(data => {
      if (!data["success"]) {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: "Error getting tile content",
          content: "Tile module not found"
        });
        props.closeTab();
      } else {
        const the_code = data["tile_module"];
        set_code_content(the_code);
        savedContent.current = the_code;
      }
    });
  }, []);
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
  function menu_specs() {
    let ms;
    if (props.is_repository) {
      ms = {
        Transfer: [{
          "name_text": "Copy to library",
          "icon_name": "import",
          "click_handler": async () => {
            await (0, _resource_viewer_react_app.copyToLibrary)("tile", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
          },
          tooltip: "Copy to library"
        }]
      };
    } else {
      ms = {
        Save: [{
          "name_text": "Save",
          "icon_name": "saved",
          "click_handler": _saveMe,
          key_bindings: ['Ctrl+S'],
          tooltip: "Save"
        }, {
          "name_text": "Save As...",
          "icon_name": "floppy-disk",
          "click_handler": _saveModuleAs,
          tooltip: "Save as"
        }, {
          "name_text": "Save and Checkpoint",
          "icon_name": "map-marker",
          "click_handler": _saveAndCheckpoint,
          key_bindings: ['Ctrl+M'],
          tooltip: "Save and checkpoint"
        }],
        Load: [{
          "name_text": "Save and Load",
          "icon_name": "upload",
          "click_handler": _saveAndLoadModule,
          key_bindings: ['Ctrl+L'],
          tooltip: "Save and load module"
        }, {
          "name_text": "Load",
          "icon_name": "upload",
          "click_handler": _loadModule,
          tooltip: "Load tile"
        }],
        Compare: [{
          "name_text": "View History",
          "icon_name": "history",
          "click_handler": _showHistoryViewer,
          tooltip: "Show history viewer"
        }, {
          "name_text": "Compare to Other Modules",
          "icon_name": "comparison",
          "click_handler": _showTileDiffer,
          tooltip: "Compare to another tile"
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
    return ms;
  }
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
  function _extraKeys() {
    const ekeys = {
      'Ctrl-s': _saveMe,
      'Ctrl-l': _saveAndLoadModule,
      'Ctrl-m': _saveAndCheckpoint,
      'Ctrl-f': () => {
        search_ref.current.focus();
      },
      'Cmd-f': () => {
        search_ref.current.focus();
      }
    };
    let convertedKeys = (0, _utilities_react.convertExtraKeys)(ekeys);
    let moreKeys = [{
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
    return [...convertedKeys, ...moreKeys];
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  async function _saveMe() {
    if (!am_selected()) {
      return false;
    }
    statusFuncs.startSpinner();
    statusFuncs.statusMessage("Saving nodule");
    try {
      await doSavePromise();
      statusFuncs.stopSpinner();
      statusFuncs.statusMessage("Saved module");
    } catch (e) {
      errorDrawerFuncs.addFromError("Error saving module", e);
      statusFuncs.stopSpinner();
    }
    return false;
  }
  function doSavePromise() {
    return new Promise(async function (resolve, reject) {
      const new_code = code_content_ref.current;
      let result_dict;
      result_dict = {
        "module_name": _cProp("resource_name"),
        "new_tile_module": new_code,
        "last_saved": "viewer"
      };
      try {
        let data = await (0, _communication_react.postPromise)("host", "update_tile_task", result_dict, props.resource_viewer_id);
        savedContent.current = new_code;
        data.timeout = 2000;
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }
  async function _saveModuleAs() {
    statusFuncs.startSpinner();
    try {
      let data = await (0, _communication_react.postPromise)("host", "get_tile_names", {
        "user_id": window.user_id
      }, props.main_id);
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: "Save Module As",
        field_title: "New Module Name",
        default_value: "NewModule",
        existing_names: data["tile_names"],
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      const result_dict = {
        "new_res_name": new_name,
        "res_to_copy": _cProp("resource_name")
      };
      await (0, _communication_react.postPromise)("host", 'create_duplicate_tile_task', result_dict);
      _setResourceNameState(new_name, () => {
        _saveMe();
      });
      statusFuncs.stopSpinner();
    } catch (e) {
      statusFuncs.stopSpinner();
      statusFuncs.clearstatus();
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error saving module`, e);
      }
    }
  }
  async function _saveAndLoadModule() {
    if (!am_selected()) {
      return false;
    }
    statusFuncs.startSpinner();
    try {
      await doSavePromise();
      statusFuncs.statusMessage("Loading Module");
      await (0, _communication_react.postPromise)("host", "load_tile_module_task", {
        "tile_module_name": _cProp("resource_name"),
        "user_id": window.user_id
      }, props.resource_viewer_id);
      statusFuncs.statusMessage("Saved and loaded module");
      statusFuncs.stopSpinner();
    } catch (e) {
      errorDrawerFuncs.addFromError("Error saving and loading module", e);
      statusFuncs.clearStatusMessage();
      statusFuncs.stopSpinner();
    }
  }
  async function _loadModule() {
    if (!am_selected()) {
      return false;
    }
    try {
      statusFuncs.startSpinner();
      statusFuncs.statusMessage("Loading Module");
      await (0, _communication_react.postPromise)("host", "load_tile_module_task", {
        "tile_module_name": _cProp("resource_name"),
        "user_id": window.user_id
      }, props.resource_viewer_id);
      statusFuncs.statusMessage("Loaded module");
      statusFuncs.stopSpinner();
    } catch (e) {
      errorDrawerFuncs.addFromError("Error loading module", e);
      statusFuncs.clearStatusMessage();
      statusFuncs.stopSpinner();
    }
  }
  async function _saveAndCheckpoint() {
    if (!am_selected()) {
      return false;
    }
    try {
      statusFuncs.startSpinner();
      statusFuncs.statusMessage("Saving...");
      await doSavePromise();
      statusFuncs.statusMessage("Checkpointing...");
      await doCheckpointPromise();
      statusFuncs.stopSpinner();
      statusFuncs.statusMessage("Saved and checkpointed");
    } catch (e) {
      errorDrawerFuncs.addFromError("Error saving and checkpointing", e);
      statusFuncs.clearStatusMessage();
      statusFuncs.stopSpinner();
    }
  }
  function doCheckpointPromise() {
    return (0, _communication_react.postPromise)("host", "checkpoint_module_task", {
      "module_name": _cProp("resource_name")
    });
  }
  function _showHistoryViewer() {
    window.open(`${$SCRIPT_ROOT}/show_history_viewer/${_cProp("resource_name")}`);
  }
  function _showTileDiffer() {
    window.open(`${$SCRIPT_ROOT}/show_tile_differ/${_cProp("resource_name")}`);
  }
  function _dirty() {
    return !(code_content_ref.current == savedContent.current);
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
  let my_props = {
    ...props
  };
  if (!props.controlled) {
    my_props.resource_name = resource_name;
  }
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
    outer_class = `${outer_class} pane-holder ${settingsContext.isDark() ? "bp6-dark" : "light-theme"}`;
  }
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, !props.controlled && /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    page_id: props.resource_viewer_id,
    user_name: window.username
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style,
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react.default.createElement(_resource_viewer_react_app.ResourceViewerApp, (0, _extends2.default)({}, my_props, {
    resource_viewer_id: my_props.resource_viewer_id,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "tile",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs(),
    created: props.created,
    show_search: false,
    showErrorDrawerButton: true
  }), /*#__PURE__*/_react.default.createElement(_reactCodemirror.ReactCodemirror6, {
    code_content: code_content_ref.current,
    controlled: true,
    show_fold_button: true,
    flex_size: true,
    extraKeys: _extraKeys(),
    readOnly: props.readOnly,
    handleChange: _handleCodeChange,
    saveMe: _saveMe,
    show_search: true,
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
exports.ModuleViewerApp = ModuleViewerApp = /*#__PURE__*/(0, _react.memo)(ModuleViewerApp);
function module_viewer_main() {
  function gotProps(the_props) {
    let ModuleViewerAppPlus = (0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(ModuleViewerApp)))));
    let the_element = /*#__PURE__*/_react.default.createElement(ModuleViewerAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      changeName: null
    }));
    let domContainer = document.querySelector('#root');
    const root = (0, _client.createRoot)(domContainer);
    root.render(the_element);
  }
  let data = {
    resource_name: window.resource_name,
    res_type: "list"
  };
  module_viewer_props(data, null, gotProps, null);
}
if (!window.in_context) {
  module_viewer_main();
}