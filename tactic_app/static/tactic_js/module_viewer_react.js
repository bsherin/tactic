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
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _reactCodemirror = require("./react-codemirror");
var _communication_react = require("./communication_react");
var _error_drawer = require("./error_drawer");
var _toaster = require("./toaster");
var _sizing_tools = require("./sizing_tools");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/**
 * Created by bls910
 */

function module_viewer_props(data, registerDirtyMethod, finalCallback) {
  let resource_viewer_id = (0, _utilities_react.guid)();
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
    meta_outer: "#right-div",
    registerDirtyMethod: registerDirtyMethod
  });
}
function ModuleViewerApp(props) {
  const top_ref = (0, _react.useRef)(null);
  const cc_ref = (0, _react.useRef)(null);
  const search_ref = (0, _react.useRef)(null);
  const cc_bounding_top = (0, _react.useRef)(null);
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
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);

  // The following only are used if not in context
  const [usable_width, set_usable_width] = (0, _react.useState)(() => {
    return (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
  });
  const [usable_height, set_usable_height] = (0, _react.useState)(() => {
    return (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
  });
  const [resource_name, set_resource_name] = (0, _react.useState)(props.resource_name);
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  (0, _react.useEffect)(() => {
    statusFuncs.stopSpinner();
    if (cc_ref && cc_ref.current) {
      cc_bounding_top.current = cc_ref.current.getBoundingClientRect().top;
    }
    if (!props.controlled) {
      window.addEventListener("resize", _update_window_dimensions);
      _update_window_dimensions();
    } else {
      props.registerDirtyMethod(_dirty);
    }
  }, []);
  const pushCallback = (0, _utilities_react.useCallbackStack)("code_viewer");
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
  function _update_window_dimensions() {
    set_usable_width(window.innerWidth - top_ref.current.offsetLeft);
    set_usable_height(window.innerHeight - top_ref.current.offsetTop);
  }
  function cPropGetters() {
    return {
      usable_width: usable_width,
      usable_height: usable_height,
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
          key_bindings: ['ctrl+s'],
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
          key_bindings: ['ctrl+m'],
          tooltip: "Save and checkpoint"
        }],
        Load: [{
          "name_text": "Save and Load",
          "icon_name": "upload",
          "click_handler": _saveAndLoadModule,
          key_bindings: ['ctrl+l'],
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
  function get_new_cc_height() {
    if (cc_bounding_top.current) {
      return window.innerHeight - cc_bounding_top.current - _sizing_tools.BOTTOM_MARGIN;
    } else if (cc_ref && cc_ref.current) {
      return window.innerHeight - cc_ref.current.getBoundingClientRect().top - _sizing_tools.BOTTOM_MARGIN;
    } else {
      return _cProp("usable_height") - 100;
    }
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
  function _saveMe() {
    if (!am_selected()) {
      return false;
    }
    statusFuncs.startSpinner();
    statusFuncs.statusMessage("Saving nodule");
    doSavePromise().then(data => {
      statusFuncs.statusMessage("Saved module");
      statusFuncs.stopSpinner();
    }).catch(data => {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error saving module",
        content: "message" in data ? data.message : ""
      });
      statusFuncs.stopSpinner();
    });
    return false;
  }
  function doSavePromise() {
    return new Promise(function (resolve, reject) {
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
      (0, _communication_react.postAjax)("update_module", result_dict, function (data) {
        if (data.success) {
          savedContent.current = new_code;
          savedTags.current = local_tags;
          savedNotes.current = local_notes;
          savedIcon.current = local_icon;
          data.timeout = 2000;
          resolve(data);
        } else {
          reject(data);
        }
      });
    });
  }
  function _saveModuleAs() {
    statusFuncs.startSpinner();
    (0, _communication_react.postWithCallback)("host", "get_tile_names", {
      "user_id": window.user_id
    }, function (data) {
      let checkboxes;
      dialogFuncs.showModal("ModalDialog", {
        title: "Save Module As",
        field_title: "New Module Name",
        handleSubmit: CreateNewModule,
        default_value: "NewModule",
        existing_names: data.tile_names,
        checkboxes: [],
        handleCancel: doCancel,
        handleClose: dialogFuncs.hideModal
      });
    }, null, props.main_id);
    function doCancel() {
      statusFuncs.stopSpinner();
    }
    function CreateNewModule(new_name) {
      const result_dict = {
        "new_res_name": new_name,
        "res_to_copy": _cProp("resource_name")
      };
      (0, _communication_react.postAjaxPromise)('/create_duplicate_tile', result_dict).then(data => {
        _setResourceNameState(new_name, () => {
          _saveMe();
        });
      }).catch(data => {
        statusFuncs.stopSpinner();
        statusFuncs.clearstatus();
        errorDrawerFuncs.addErrorDrawerEntry({
          title: "Error saving module",
          content: "message" in data ? data.message : ""
        });
      });
    }
  }
  function _saveAndLoadModule() {
    if (!am_selected()) {
      return false;
    }
    statusFuncs.startSpinner();
    doSavePromise().then(function () {
      statusFuncs.statusMessage("Loading Module");
      (0, _communication_react.postWithCallback)("host", "load_tile_module_task", {
        "tile_module_name": _cProp("resource_name"),
        "user_id": window.user_id
      }, load_success, null, props.resource_viewer_id);
    }).catch(data => {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error saving and loading odule",
        content: "message" in data ? data.message : ""
      });
    });
    function load_success(data) {
      handleResult(data, "Saved and loaded module", "Failed to load module");
      return false;
    }
  }
  function _loadModule() {
    if (!am_selected()) {
      return false;
    }
    statusFuncs.startSpinner();
    statusFuncs.statusMessage("Loading Module");
    (0, _communication_react.postWithCallback)("host", "load_tile_module_task", {
      "tile_module_name": _cProp("resource_name"),
      "user_id": window.user_id
    }, load_success, null, props.resource_viewer_id);
    function load_success(data) {
      handleResult(data, "Loaded module", "Failure loading modules");
      return false;
    }
  }
  function _saveAndCheckpoint() {
    if (!am_selected()) {
      return false;
    }
    statusFuncs.startSpinner();
    statusFuncs.statusmessage("Saving...");
    doSavePromise().then(function () {
      statusFuncs.statusMessage("Checkpointing...");
      doCheckpointPromise().then(data => {
        statusFuncs.stopSpinner();
        statusFuncs.statusMessage("Saved and checkpointed");
      }).catch(data => {
        statusFuncs.clearStatusMessage();
        errorDrawerFuncs.addErrorDrawerEntry({
          title: "Error checkpointing",
          content: "message" in data ? data.message : ""
        });
      });
    }).catch(data => {
      errorDrawerFuncs.addErrorDrawerEntry({
        title: "Error saving and checkpointing",
        content: "message" in data ? data.message : ""
      });
    });
    return false;
  }
  function doCheckpointPromise() {
    return new Promise(function (resolve, reject) {
      (0, _communication_react.postAjax)("checkpoint_module", {
        "module_name": _cProp("resource_name")
      }, function (data) {
        if (data.success) {
          resolve(data);
        } else {
          reject(data);
        }
      });
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
    my_props.usable_height = usable_height;
    my_props.usable_width = usable_width;
  }
  let outer_style = {
    width: "100%",
    height: my_props.usable_height,
    paddingLeft: 0,
    position: "relative"
  };
  let cc_height = get_new_cc_height();
  let outer_class = "resource-viewer-holder";
  if (!props.controlled) {
    if (theme.dark_theme) {
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
    style: outer_style
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
    meta_outer: props.meta_outer,
    showErrorDrawerButton: true
  }), /*#__PURE__*/_react.default.createElement(_reactCodemirror.ReactCodemirror, {
    code_content: code_content,
    extraKeys: _extraKeys(),
    readOnly: props.readOnly,
    handleChange: _handleCodeChange,
    saveMe: _saveMe,
    search_term: search_string,
    update_search_state: _update_search_state,
    regex_search: regex,
    setSearchMatches: _setSearchMatches,
    code_container_height: cc_height,
    ref: cc_ref
  }))));
}
exports.ModuleViewerApp = ModuleViewerApp = /*#__PURE__*/(0, _react.memo)(ModuleViewerApp);
ModuleViewerApp.propTypes = {
  controlled: _propTypes.default.bool,
  changeResourceName: _propTypes.default.func,
  updatePanel: _propTypes.default.func,
  refreshTab: _propTypes.default.func,
  closeTab: _propTypes.default.func,
  the_content: _propTypes.default.string,
  created: _propTypes.default.string,
  tags: _propTypes.default.array,
  notes: _propTypes.default.string,
  readOnly: _propTypes.default.bool,
  is_repository: _propTypes.default.bool,
  meta_outer: _propTypes.default.string,
  usable_height: _propTypes.default.number,
  usable_width: _propTypes.default.number
};
ModuleViewerApp.defaultProps = {
  controlled: false,
  changeResourceName: null,
  refreshTab: null,
  closeTab: null,
  updatePanel: null
};
function module_viewer_main() {
  function gotProps(the_props) {
    let ModuleViewerAppPlus = (0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(ModuleViewerApp))));
    let the_element = /*#__PURE__*/_react.default.createElement(ModuleViewerAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    let domContainer = document.querySelector('#root');
    ReactDOM.render(the_element, domContainer);
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