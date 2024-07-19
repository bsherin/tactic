"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodeViewerApp = CodeViewerApp;
exports.code_viewer_props = code_viewer_props;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _reactCodemirror = require("./react-codemirror");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react.js");
var _toaster = require("./toaster.js");
var _error_drawer = require("./error_drawer.js");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
var _error_drawer2 = require("./error_drawer");
var _sizing_tools = require("./sizing_tools");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
//import { HotkeysProvider } from "@blueprintjs/core";

function code_viewer_props(data, registerDirtyMethod, finalCallback) {
  let resource_viewer_id = (0, _utilities_react.guid)();
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "code_viewer", resource_viewer_id);
  finalCallback({
    resource_viewer_id: resource_viewer_id,
    main_id: resource_viewer_id,
    tsocket: tsocket,
    split_tags: data.mdata.tags == "" ? [] : data.mdata.tags.split(" "),
    created: data.mdata.datestring,
    resource_name: data.resource_name,
    the_content: data.the_content,
    notes: data.mdata.notes,
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
    ...props
  };
  const top_ref = (0, _react.useRef)(null);
  const search_ref = (0, _react.useRef)(null);
  const savedContent = (0, _react.useRef)(props.the_content);
  const savedTags = (0, _react.useRef)(props.split_tags);
  const savedNotes = (0, _react.useRef)(props.notes);
  const [code_content, set_code_content, code_content_ref] = (0, _utilities_react.useStateAndRef)(props.the_content);
  const [notes, set_notes, notes_ref] = (0, _utilities_react.useStateAndRef)(props.notes);
  const [tags, set_tags, tags_ref] = (0, _utilities_react.useStateAndRef)(props.split_tags);
  const [search_string, set_search_string] = (0, _react.useState)("");
  const [regex, set_regex] = (0, _react.useState)(false);
  const [search_matches, set_search_matches] = (0, _react.useState)(props.null);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, 0, "CodeViewer");
  const [resource_name, set_resource_name] = (0, _react.useState)(props.resource_name);
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer2.ErrorDrawerContext);
  const sizeInfo = (0, _react.useContext)(_sizing_tools.SizeContext);
  (0, _react.useEffect)(() => {
    statusFuncs.stopSpinner();
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
    }
  }, []);
  const pushCallback = (0, _utilities_react.useCallbackStack)("code_viewer");
  const _saveMe = (0, _react.useCallback)(async () => {
    if (!am_selected()) {
      return false;
    }
    const new_code = code_content;
    const tagstring = tags.join(" ");
    const local_notes = notes;
    const local_tags = tags; // In case it's modified wile saving
    const result_dict = {
      "code_name": _cProp("resource_name"),
      "new_code": new_code,
      "tags": tagstring,
      "notes": local_notes,
      "user_id": window.user_id
    };
    try {
      await (0, _communication_react.postPromise)("host", "update_code_task", result_dict, props.resource_viewer_id);
      savedContent.current = new_code;
      savedTags.current = local_tags;
      savedNotes.current = local_notes;
      statusFuncs.statusMessage(`Updated code resource ${_cProp("resource_name")}`, 7);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error saving code", e);
    }
    return false;
  }, [code_content, tags, notes]);
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
          e.returnValue = '';
        }
      });
    }
  });
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
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
  function cPropGetters() {
    return {
      resource_name: resource_name
    };
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : cPropGetters()[pname];
  }
  const menu_specs = (0, _react.useMemo)(() => {
    var ms;
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
    return ms;
  });
  function _setResourceNameState(new_name) {
    let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.controlled) {
      props.changeResourceName(new_name, callback);
    } else {
      set_resource_name(new_name);
      pushCallback(callback);
    }
  }
  async function _setResourceNameStatePromise(new_name) {
    return new Promise((resolve, reject) => {
      _setResourceNameState(new_name, resolve);
    });
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
      }
    }
  }
  function _handleCodeChange(new_code) {
    set_code_content(new_code);
  }
  function _setSearchMatches(nmatches) {
    set_search_matches(nmatches);
  }
  function _extraKeys() {
    return {
      'Ctrl-S': _saveMe,
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
  async function _saveMeAs(e) {
    if (!am_selected()) {
      return false;
    }
    statusFuncs.startSpinner();
    try {
      let data = await (0, _communication_react.postPromise)("host", "get_code_names", {
        "user_id": window.user_id
      }, props.main_id);
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: "Save Code As",
        field_title: "New Code Name",
        default_value: "NewCode",
        existing_names: data.code_names,
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      const result_dict = {
        "new_res_name": new_name,
        "res_to_copy": _cProp("resource_name")
      };
      await (0, _communication_react.postAjaxPromise)('/create_duplicate_code', result_dict);
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
    return !(code_content_ref.current == savedContent.current && tags_ref.current == savedTags.current && notes_ref.current == savedNotes.current);
  }
  let my_props = {
    ...props
  };
  let outer_style = {
    width: "100%",
    height: sizeInfo.availableHeight,
    paddingLeft: 0,
    position: "relative"
  };
  let outer_class = "resource-viewer-holder";
  if (!props.controlled) {
    my_props.resource_name = resource_name;
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
    style: outer_style,
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react.default.createElement(_resource_viewer_react_app.ResourceViewerApp, (0, _extends2.default)({}, my_props, {
    resource_viewer_id: props.resource_viewer_id,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "code",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs,
    handleStateChange: _handleMetadataChange,
    created: props.created,
    notes: notes,
    tags: tags,
    saveMe: _saveMe,
    search_ref: search_ref,
    show_search: true,
    update_search_state: _update_search_state,
    search_string: search_string,
    search_matches: search_matches,
    regex: regex,
    allow_regex_search: true,
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
exports.CodeViewerApp = CodeViewerApp = /*#__PURE__*/(0, _react.memo)(CodeViewerApp);
function code_viewer_main() {
  function gotProps(the_props) {
    let CodeViewerAppPlus = (0, _sizing_tools.withSizeContext)((0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(CodeViewerApp)))));
    let the_element = /*#__PURE__*/_react.default.createElement(CodeViewerAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    const domContainer = document.querySelector('#root');
    const root = (0, _client.createRoot)(domContainer);
    root.render( /*#__PURE__*/_react.default.createElement(HotkeysProvider, null, the_element));
  }
  let target = window.is_repository ? "repository_view_code_in_context" : "view_code_in_context";
  (0, _communication_react.postAjaxPromise)(target, {
    "resource_name": window.resource_name
  }).then(data => {
    code_viewer_props(data, null, gotProps, null);
  });
}
if (!window.in_context) {
  code_viewer_main();
}