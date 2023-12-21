"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListViewerApp = ListViewerApp;
exports.list_viewer_props = list_viewer_props;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _sizing_tools = require("./sizing_tools");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function list_viewer_props(data, registerDirtyMethod, finalCallback) {
  let resource_viewer_id = (0, _utilities_react.guid)();
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "list_viewer", resource_viewer_id);
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
const LIST_PADDING_TOP = 15;
function ListEditor(props) {
  let tastyle = {
    resize: "horizontal",
    margin: 2,
    height: props.height - LIST_PADDING_TOP
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    id: "listarea-container",
    ref: props.outer_ref,
    style: {
      margin: 0,
      paddingTop: LIST_PADDING_TOP
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
  outer_ref: _propTypes.default.object,
  height: _propTypes.default.number
};
function ListViewerApp(props) {
  const top_ref = (0, _react.useRef)(null);
  const cc_ref = (0, _react.useRef)(null);
  const search_ref = (0, _react.useRef)(null);
  const cc_offset_top = (0, _react.useRef)(null);
  const savedContent = (0, _react.useRef)(props.the_content);
  const savedTags = (0, _react.useRef)(props.split_tags);
  const savedNotes = (0, _react.useRef)(props.notes);
  const [list_content, set_list_content, list_content_ref] = (0, _utilities_react.useStateAndRef)(props.the_content);
  const [notes, set_notes, notes_ref] = (0, _utilities_react.useStateAndRef)(props.notes);
  const [tags, set_tags, tags_ref] = (0, _utilities_react.useStateAndRef)(props.split_tags);

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
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(() => {
    statusFuncs.stopSpinner();
    if (cc_ref && cc_ref.current) {
      cc_offset_top.current = cc_ref.current.offsetTop;
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
    for (const [menu_name, menu] of Object.entries(ms)) {
      for (let but of menu) {
        but.click_handler = but.click_handler.bind(this);
      }
    }
    return ms;
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
  function _handleListChange(event) {
    set_list_content(event.target.value);
  }
  function _update_window_dimensions() {
    set_usable_width(window.innerWidth - top_ref.current.offsetLeft);
    set_usable_height(window.innerHeight - top_ref.current.offsetTop);
  }
  function get_new_cc_height() {
    let uheight = _cProp("usable_height");
    if (cc_offset_top.current) {
      return uheight - cc_offset_top.current - _sizing_tools.BOTTOM_MARGIN;
    } else if (cc_ref && cc_ref.current) {
      // This will be true after the initial render
      return uheight - cc_ref.current.offsetTop - _sizing_tools.BOTTOM_MARGIN;
    } else {
      return uheight - 100;
    }
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  function _saveMe() {
    if (!am_selected()) {
      return false;
    }
    const new_list_as_string = list_content;
    const tagstring = tags.join(" ");
    const local_notes = notes;
    const local_tags = tags; // In case it's modified wile saving
    const result_dict = {
      "list_name": _cProp("resource_name"),
      "new_list_as_string": new_list_as_string,
      "tags": tagstring,
      "notes": notes
    };
    let self = this;
    (0, _communication_react.postAjax)("update_list", result_dict, update_success);
    function update_success(data) {
      if (data.success) {
        savedContent.current = new_list_as_string;
        savedTags.current = local_tags;
        savedNotes.current = local_notes;
        statusFuncs.statusMessage(`Saved list ${result_dict.list_name}`);
      } else {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: `Error creating new notebook`,
          content: "message" in data ? data.message : ""
        });
      }
    }
  }
  function _saveMeAs(e) {
    if (!am_selected()) {
      return false;
    }
    statusFuncs.startSpinner();
    let self = this;
    (0, _communication_react.postWithCallback)("host", "get_list_names", {
      "user_id": window.user_id
    }, function (data) {
      let checkboxes;
      dialogFuncs.showModal("ModalDialog", {
        title: "Save List As",
        field_title: "New List Name",
        handleSubmit: CreateNewList,
        default_value: "NewList",
        existing_names: data.list_names,
        checkboxes: [],
        handleCancel: doCancel,
        handleClose: dialogFuncs.hideModal
      });
    }, null, props.main_id);
    function doCancel() {
      statusFuncs.stopSpinner();
      dialogFuncs.hideModal();
    }
    function CreateNewList(new_name) {
      const result_dict = {
        "new_res_name": new_name,
        "res_to_copy": _cProp("resource_name")
      };
      (0, _communication_react.postAjaxPromise)('/create_duplicate_list', result_dict).then(data => {
        _setResourceNameState(new_name, () => {
          _saveMe();
        });
      }).catch(data => {
        errorDrawerFuncs.addErrorDrawerEntry({
          title: `Error saving list`,
          content: "message" in data ? data.message : ""
        });
      });
    }
  }
  function _dirty() {
    return !(list_content_ref.current == savedContent.current && tags_ref.current == savedTags.current && notes_ref.current == savedNotes.current);
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
    setResourceNameState: _setResourceNameState,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "list",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs(),
    handleStateChange: _handleMetadataChange,
    created: props.created,
    meta_outer: props.meta_outer,
    notes: notes,
    tags: tags,
    showErrorDrawerButton: false,
    saveMe: _saveMe
  }), /*#__PURE__*/_react.default.createElement(ListEditor, {
    the_content: list_content,
    readOnly: props.readOnly,
    outer_ref: cc_ref,
    height: get_new_cc_height(),
    handleChange: _handleListChange
  }))));
}
exports.ListViewerApp = ListViewerApp = /*#__PURE__*/(0, _react.memo)(ListViewerApp);
ListViewerApp.propTypes = {
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
ListViewerApp.defaultProps = {
  controlled: false,
  changeResourceName: null,
  updatePanel: null,
  refreshTab: null,
  closeTab: null
};
function list_viewer_main() {
  function gotProps(the_props) {
    let ListViewerAppPlus = (0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(ListViewerApp))));
    let the_element = /*#__PURE__*/_react.default.createElement(ListViewerAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    let domContainer = document.querySelector('#root');
    ReactDOM.render(the_element, domContainer);
  }
  let target = window.is_repository ? "repository_view_list_in_context" : "view_list_in_context";
  (0, _communication_react.postAjaxPromise)(target, {
    "resource_name": window.resource_name
  }).then(data => {
    list_viewer_props(data, null, gotProps, null);
  });
}
if (!window.in_context) {
  list_viewer_main();
}