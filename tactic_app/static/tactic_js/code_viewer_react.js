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
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactCodemirror = require("./react-codemirror");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react.js");
var _toaster = require("./toaster.js");
var _sizing_tools = require("./sizing_tools.js");
var _error_drawer = require("./error_drawer.js");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
var _error_drawer2 = require("./error_drawer");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
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
    meta_outer: "#right-div",
    registerDirtyMethod: registerDirtyMethod
  });
}
function CodeViewerApp(props) {
  const top_ref = (0, _react.useRef)(null);
  const cc_ref = (0, _react.useRef)(null);
  const search_ref = (0, _react.useRef)(null);
  const cc_bounding_top = (0, _react.useRef)(null);
  const savedContent = (0, _react.useRef)(props.the_content);
  const savedTags = (0, _react.useRef)(props.split_tags);
  const savedNotes = (0, _react.useRef)(props.notes);
  const [code_content, set_code_content, code_content_ref] = (0, _utilities_react.useStateAndRef)(props.the_content);
  const [notes, set_notes, notes_ref] = (0, _utilities_react.useStateAndRef)(props.notes);
  const [tags, set_tags, tags_ref] = (0, _utilities_react.useStateAndRef)(props.split_tags);
  const [search_string, set_search_string] = (0, _react.useState)("");
  const [regex, set_regex] = (0, _react.useState)(false);
  const [search_matches, set_search_matches] = (0, _react.useState)(props.null);

  // The following only are used if not in context
  const [usable_width, set_usable_width] = (0, _react.useState)(() => {
    return (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
  });
  const [usable_height, set_usable_height] = (0, _react.useState)(() => {
    return (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
  });
  const [resource_name, set_resource_name] = (0, _react.useState)(props.resource_name);
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer2.ErrorDrawerContext);
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
      usable_width: usable_width,
      usable_height: usable_height,
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
          key_bindings: ['ctrl+s'],
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
  function _update_window_dimensions() {
    set_usable_width(window.innerWidth - top_ref.current.offsetLeft);
    set_usable_height(window.innerHeight - top_ref.current.offsetTop);
  }
  function get_new_cc_height() {
    if (cc_bounding_top.current) {
      return window.innerHeight - cc_bounding_top.current - _sizing_tools.BOTTOM_MARGIN;
    } else if (cc_ref && cc_ref.current) {
      // This will be true after the initial render
      return window.innerHeight - cc_ref.current.getBoundingClientRect().top - _sizing_tools.BOTTOM_MARGIN;
    } else {
      return _cProp("usable_height") - 100;
    }
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
  async function _saveMe() {
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
    resource_viewer_id: props.resource_viewer_id,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "code",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs,
    handleStateChange: _handleMetadataChange,
    created: props.created,
    meta_outer: props.meta_outer,
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
    extraKeys: _extraKeys(),
    readOnly: props.readOnly,
    handleChange: _handleCodeChange,
    saveMe: _saveMe,
    search_term: search_string,
    update_search_state: _update_search_state,
    regex_search: regex,
    setSearchMatches: _setSearchMatches,
    code_container_height: get_new_cc_height(),
    ref: cc_ref
  }))));
}
exports.CodeViewerApp = CodeViewerApp = /*#__PURE__*/(0, _react.memo)(CodeViewerApp);
CodeViewerApp.propTypes = {
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
  tsocket: _propTypes.default.object,
  usable_height: _propTypes.default.number,
  usable_width: _propTypes.default.number
};
CodeViewerApp.defaultProps = {
  controlled: false,
  changeResourceName: null,
  updatePanel: null,
  refreshTab: null,
  closeTab: null
};
function code_viewer_main() {
  function gotProps(the_props) {
    let CodeViewerAppPlus = (0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(CodeViewerApp))));
    let the_element = /*#__PURE__*/_react.default.createElement(CodeViewerAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    let domContainer = document.querySelector('#root');
    ReactDOM.render(the_element, domContainer);
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