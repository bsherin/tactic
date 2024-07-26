"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ModuleViewerApp = ModuleViewerApp;
exports.module_viewer_props = module_viewer_props;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _reactCodemirror = require("./react-codemirror");
var _communication_react = require("./communication_react");
var _error_drawer = require("./error_drawer");
var _toaster = require("./toaster");
var _assistant = require("./assistant");
var _sizing_tools = require("./sizing_tools");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _settings = require("./settings");
var _modal_react = require("./modal_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// import {HotkeysProvider} from "@blueprintjs/core";

function module_viewer_props(data, registerDirtyMethod, finalCallback) {
  let resource_viewer_id = (0, _utilities_react.guid)();
  if (!window.in_context) {
    window.main_id = resource_viewer_id;
  }
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "module_viewer", resource_viewer_id);
  finalCallback({
    resource_viewer_id: resource_viewer_id,
    main_id: resource_viewer_id,
    tsocket: tsocket,
    split_tags: data.mdata.tags == "" ? [] : data.mdata.tags.split(" "),
    created: data.mdata.datestring,
    resource_name: data.resource_name,
    the_content: data.the_content,
    notes: data.mdata.notes,
    icon: data.mdata.additional_mdata.icon,
    readOnly: data.read_only,
    is_repository: data.is_repository,
    registerDirtyMethod: registerDirtyMethod
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
  const savedTags = (0, _react.useRef)(props.split_tags);
  const savedNotes = (0, _react.useRef)(props.notes);
  const savedIcon = (0, _react.useRef)(props.icon);
  const [code_content, set_code_content, code_content_ref] = (0, _utilities_react.useStateAndRef)(props.the_content);
  const [notes, set_notes, notes_ref] = (0, _utilities_react.useStateAndRef)(props.notes);
  const [tags, set_tags, tags_ref] = (0, _utilities_react.useStateAndRef)(props.split_tags);
  const [icon, set_icon, icon_ref] = (0, _utilities_react.useStateAndRef)(props.icon);
  const [search_string, set_search_string] = (0, _react.useState)("");
  const [regex, set_regex] = (0, _react.useState)(false);
  const [search_matches, set_search_matches] = (0, _react.useState)(props.null);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  const sizeInfo = (0, _react.useContext)(_sizing_tools.SizeContext);
  const [resource_name, set_resource_name] = (0, _react.useState)(props.resource_name);
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, 0, "ModuleViewer");
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
  (0, _utilities_react.useConstructor)(() => {
    if (!props.controlled) {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }
  });
  function cPropGetters() {
    return {
      resource_name: resource_name
    };
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : cPropGetters()[pname];
  }
  function _update_search_state(nstate) {
    let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
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
    for (const [menu_name, menu] of Object.entries(ms)) {
      for (let but of menu) {
        but.click_handler = but.click_handler.bind(this);
      }
    }
    return ms;
  }
  function _handleCodeChange(new_code) {
    set_code_content(new_code);
  }
  function _handleMetadataChange(state_stuff) {
    for (let field in state_stuff) {
      switch (field) {
        case "tags":
          set_tags(state_stuff[field]);
          break;
        case "notes":
          set_notes(state_stuff[field]);
          break;
        case "icon":
          set_icon(state_stuff[field]);
          break;
      }
    }
  }
  function handleResult(data, success_message, failure_tiltle) {
    if (!data.success) {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: failur_title,
        content: "message" in data ? data.message : ""
      });
    } else {
      statusFuncs.statusMessage(success_message);
    }
    statusFuncs.stopSpinner();
    statusFuncs.clearStatusMessage();
  }
  function _setResourceNameState(new_name) {
    let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.controlled) {
      props.changeResourceName(new_name, callback);
    } else {
      set_resource_name(new_name);
      pushCallback(callback);
    }
  }
  function _extraKeys() {
    return {
      'Ctrl-S': _saveMe,
      'Ctrl-L': _saveAndLoadModule,
      'Ctrl-M': _saveAndCheckpoint,
      'Ctrl-F': () => {
        search_ref.current.focus();
      },
      'Cmd-F': () => {
        search_ref.current.focus();
      }
    };
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
      const new_code = code_content;
      const tagstring = tags.join(" ");
      const local_notes = notes;
      const local_tags = tags; // In case it's modified wile saving
      const local_icon = icon;
      let result_dict;
      let category;
      category = null;
      result_dict = {
        "module_name": _cProp("resource_name"),
        "category": category,
        "tags": tagstring,
        "notes": local_notes,
        "icon": local_icon,
        "new_code": new_code,
        "last_saved": "viewer"
      };
      try {
        let data = await (0, _communication_react.postAjaxPromise)("update_module", result_dict);
        savedContent.current = new_code;
        savedTags.current = local_tags;
        savedNotes.current = local_notes;
        savedIcon.current = local_icon;
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
        existing_names: data.tile_names,
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      const result_dict = {
        "new_res_name": new_name,
        "res_to_copy": _cProp("resource_name")
      };
      await (0, _communication_react.postAjaxPromise)('/create_duplicate_tile', result_dict);
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
      return;
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
      let data = await (0, _communication_react.postPromise)("host", "load_tile_module_task", {
        "tile_module_name": _cProp("resource_name"),
        "user_id": window.user_id
      }, props.resource_viewer_id);
      statusFuncs.statusMessage("Saved and loaded module");
      statusFuncs.stopSpinner();
    } catch (e) {
      errorDrawerFuncs.addFromError("Error saving and loading module", e);
      statusFuncs.clearStatusMessage();
      statusFuncs.stopSpinner();
      return;
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
      return;
    }
  }
  function doCheckpointPromise() {
    return (0, _communication_react.postAjaxPromise)("checkpoint_module", {
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
    return !(code_content_ref.current == savedContent.current && icon_ref.current == savedIcon.current && tags_ref.current == savedTags.current && notes_ref.current == savedNotes.current);
  }
  function _setSearchMatches(nmatches) {
    set_search_matches(nmatches);
  }
  let my_props = {
    ...props
  };
  if (!props.controlled) {
    my_props.resource_name = resource_name;
  }
  let outer_style = {
    width: "100%",
    height: sizeInfo.availableHeight,
    paddingLeft: 0,
    position: "relative"
  };
  // let cc_height = get_new_cc_height();
  let outer_class = "resource-viewer-holder";
  if (!props.controlled) {
    if (settingsContext.isDark()) {
      outer_class = outer_class + " bp5-dark";
    } else {
      outer_class = outer_class + " light-theme";
    }
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
    setResourceNameState: _setResourceNameState,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "tile",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs(),
    handleStateChange: _handleMetadataChange,
    created: props.created,
    notes: notes,
    tags: tags,
    mdata_icon: icon,
    saveMe: _saveMe,
    show_search: true,
    update_search_state: _update_search_state,
    search_string: search_string,
    search_matches: search_matches,
    regex: regex,
    allow_regex_search: true,
    search_ref: search_ref,
    showErrorDrawerButton: true
  }), /*#__PURE__*/_react.default.createElement(_reactCodemirror.ReactCodemirror, {
    code_content: code_content,
    no_width: true,
    extraKeys: _extraKeys(),
    readOnly: props.readOnly,
    handleChange: _handleCodeChange,
    saveMe: _saveMe,
    search_term: search_string,
    update_search_state: _update_search_state,
    regex_search: regex,
    setSearchMatches: _setSearchMatches
  }))));
}
exports.ModuleViewerApp = ModuleViewerApp = /*#__PURE__*/(0, _react.memo)(ModuleViewerApp);
function module_viewer_main() {
  function gotProps(the_props) {
    let ModuleViewerAppPlus = (0, _sizing_tools.withSizeContext)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(ModuleViewerApp))))));
    let the_element = /*#__PURE__*/_react.default.createElement(ModuleViewerAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      changeName: null
    }));
    let domContainer = document.querySelector('#root');
    const root = (0, _client.createRoot)(domContainer);
    root.render(
    //<HotkeysProvider>
    the_element
    //</HotkeysProvider>
    );
  }
  let target = window.is_repository ? "repository_view_module_in_context" : "view_module_in_context";
  (0, _communication_react.postAjaxPromise)(target, {
    "resource_name": window.resource_name
  }).then(data => {
    module_viewer_props(data, null, gotProps, null);
  });
}
if (!window.in_context) {
  module_viewer_main();
}