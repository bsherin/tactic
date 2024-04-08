"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreatorApp = CreatorApp;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/tile_creator.scss");
require("codemirror/mode/javascript/javascript");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _tile_creator_support = require("./tile_creator_support");
var _key_trap = require("./key_trap");
var _menu_utilities = require("./menu_utilities");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _reactCodemirror = require("./react-codemirror");
var _creator_modules_react = require("./creator_modules_react");
var _resizing_layouts = require("./resizing_layouts2");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _sizing_tools = require("./sizing_tools");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _error_boundary = require("./error_boundary");
var _autocomplete = require("./autocomplete");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const BOTTOM_MARGIN = 50;
const MARGIN_SIZE = 17;
function CreatorApp(props) {
  const top_ref = (0, _react.useRef)(null);
  const rc_span_ref = (0, _react.useRef)(null);
  const vp_ref = (0, _react.useRef)(null);
  const methods_ref = (0, _react.useRef)(null);
  const commands_ref = (0, _react.useRef)(null);
  const search_ref = (0, _react.useRef)(null);
  const globals_ref = (0, _react.useRef)(null);
  const last_save = (0, _react.useRef)({});
  const dpObject = (0, _react.useRef)(null);
  const rcObject = (0, _react.useRef)(null);
  const emObject = (0, _react.useRef)(null);
  const globalObject = (0, _react.useRef)(null);
  const rline_number = (0, _react.useRef)(props.initial_line_number);
  const cm_list = (0, _react.useRef)(props.is_mpl || props.is_d3 ? ["tc", "rc", "em", "gp"] : ["rc", "em", "gp"]);
  const search_match_numbers = (0, _react.useRef)({
    tc: 0,
    rc: 0,
    em: 0,
    gp: 0
  });
  const key_bindings = (0, _react.useRef)([]);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, 0, "TileCreator");
  const [tabSelectCounter, setTabSelectCounter] = (0, _react.useState)(0);

  // This hasActivated machinery is necessary because cleanup of codemirror areas doesn't work
  // properly if the component is unmounted before the codemirror area is activated.
  const [methodsHasActivated, setMethodsHasActivated] = (0, _react.useState)(false);
  const [globalsHasActivated, setGlobalsHasActivated] = (0, _react.useState)(false);
  const [foregrounded_panes, set_foregrounded_panes] = (0, _react.useState)({
    "metadata": true,
    "options": false,
    "exports": false,
    "methods": false
  });
  const [search_string, set_search_string] = (0, _react.useState)("");
  const [current_search_number, set_current_search_number] = (0, _react.useState)(null);
  const [current_search_cm, set_current_search_cm] = (0, _react.useState)(cm_list.current[0]);
  const [regex, set_regex] = (0, _react.useState)(false);
  const [search_matches, set_search_matches] = (0, _react.useState)(0);
  const [render_content_code, set_render_content_code, render_content_code_ref] = (0, _utilities_react.useStateAndRef)(props.render_content_code);
  const [draw_plot_code, set_draw_plot_code, draw_plot_code_ref] = (0, _utilities_react.useStateAndRef)(props.draw_plot_code);
  const [jscript_code, set_jscript_code, jscript_code_ref] = (0, _utilities_react.useStateAndRef)(props.jscript_code);
  const [extra_functions, set_extra_functions, extra_functions_ref] = (0, _utilities_react.useStateAndRef)(props.extra_functions);
  const [globals_code, set_globals_code, globals_code_ref] = (0, _utilities_react.useStateAndRef)(props.globals_code);
  const [option_list, set_option_list, option_list_ref] = (0, _utilities_react.useStateAndRef)(props.option_list);
  const [export_list, set_export_list, export_list_ref] = (0, _utilities_react.useStateAndRef)(props.export_list);
  const [render_content_line_number, set_render_content_line_number, render_content_line_number_ref] = (0, _utilities_react.useStateAndRef)(props.render_content_line_number);
  const [draw_plot_line_number, set_draw_plot_line_number, draw_plot_line_number_ref] = (0, _utilities_react.useStateAndRef)(props.draw_plot_line_number);
  const [extra_methods_line_number, set_extra_methods_line_number, extra_methods_line_number_ref] = (0, _utilities_react.useStateAndRef)(props.extra_methods_line_number);
  const [notes, set_notes, notes_ref] = (0, _utilities_react.useStateAndRef)(props.notes);
  const [tags, set_tags, tags_ref] = (0, _utilities_react.useStateAndRef)(props.tags);
  const [icon, set_icon, icon_ref] = (0, _utilities_react.useStateAndRef)(props.icon);
  const [category, set_category, category_ref] = (0, _utilities_react.useStateAndRef)(props.category);
  const [additional_save_attrs, set_additional_save_attrs, additional_save_attrs_ref] = (0, _utilities_react.useStateAndRef)(props.additional_save_attrs || []);
  const [couple_save_attrs_and_exports, set_couple_save_attrs_and_exports, couple_save_attrs_and_exports_ref] = (0, _utilities_react.useStateAndRef)(props.couple_save_attrs_and_exports);
  const [selectedTabId, setSelectedTabId] = (0, _react.useState)("metadata");
  const [top_pane_fraction, set_top_pane_fraction] = (0, _react.useState)(props.is_mpl || props.is_d3 ? .5 : 1);
  const [left_pane_fraction, set_left_pane_fraction] = (0, _react.useState)(.5);
  const [all_tags, set_all_tags] = (0, _react.useState)([]);
  const [has_key, set_has_key] = (0, _react.useState)(false);
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  const sizeInfo = (0, _react.useContext)(_sizing_tools.SizeContext);
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  const [resource_name, set_resource_name] = (0, _react.useState)(props.resource_name);
  const connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  (0, _react.useEffect)(() => {
    let data_dict = {
      pane_type: "tile",
      is_repository: false,
      show_hidden: true
    };
    let data;
    (0, _communication_react.postPromise)(props.module_viewer_id, "has_openai_key", {}).then(data => {
      if (data.has_key) {
        set_has_key(true);
      } else {
        set_has_key(false);
      }
    }).catch(e => {
      set_has_key(false);
    });
    (0, _communication_react.postAjaxPromise)("get_tag_list", data_dict).then(data => {
      set_all_tags(data.tag_list);
    }).catch(e => {
      errorDrawerFuncs.addFromError("Error getting tag list", e);
    });
  }, []);
  (0, _react.useEffect)(() => {
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
      props.registerLineSetter(_selectLineNumber);
    } else {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
      document.title = resource_name;
    }
    _goToLineNumber();
    _update_saved_state();
    errorDrawerFuncs.setGoToLineNumber(_selectLineNumber);
    function sendRemove() {
      navigator.sendBeacon("/delete_container_on_unload", JSON.stringify({
        "container_id": props.module_viewer_id,
        "notify": false
      }));
    }
    window.addEventListener("unload", sendRemove);
    statusFuncs.stopSpinner();
    return () => {
      dpObject.current = null;
      rcObject.current = null;
      emObject.current = null;
      globalObject.current = null;
      delete_my_container();
      window.removeEventListener("unload", sendRemove);
      errorDrawerFuncs.setGoToLineNumber(null);
    };
  }, []);
  (0, _react.useEffect)(() => {
    _goToLineNumber();
  });
  function initSocket() {
    props.tsocket.attachListener('focus-me', data => {
      window.focus();
      _selectLineNumber(data.line_number);
    });
    if (!window.in_context) {
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
      props.tsocket.attachListener('close-user-windows', data => {
        if (!(data["originator"] == props.resource_viewer_id)) {
          window.close();
        }
      });
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
    let ms = {
      Save: [{
        name_text: "Save",
        icon_name: "saved",
        click_handler: _saveMe,
        key_bindings: ['ctrl+s']
      }, {
        name_text: "Save As...",
        icon_name: "floppy-disk",
        click_handler: _saveModuleAs
      }, {
        name_text: "Save and Checkpoint",
        icon_name: "map-marker",
        click_handler: _saveAndCheckpoint,
        key_bindings: ['ctrl+m']
      }],
      Load: [{
        name_text: "Save and Load",
        icon_name: "upload",
        click_handler: _saveAndLoadModule,
        key_bindings: ['ctrl+l']
      }, {
        name_text: "Load",
        icon_name: "upload",
        click_handler: _loadModule
      }],
      Compare: [{
        name_text: "View History",
        icon_name: "history",
        click_handler: _showHistoryViewer
      }, {
        name_text: "Compare to Other Modules",
        icon_name: "comparison",
        click_handler: _showTileDiffer
      }],
      Transfer: [{
        name_text: "Share",
        icon_name: "share",
        click_handler: async () => {
          await (0, _resource_viewer_react_app.sendToRepository)("tile", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
        }
      }]
    };
    for (let menu in ms) {
      for (let but of ms[menu]) {
        but.click_handler = but.click_handler.bind(this);
      }
    }
    return ms;
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
  function _searchNext() {
    if (current_search_number >= search_match_numbers.current[current_search_cm] - 1) {
      let next_cm;
      switch (current_search_cm) {
        case "rc":
          next_cm = "em";
          break;
        case "tc":
          next_cm = "rc";
          break;
        case "em":
          next_cm = "gp";
          break;
        default:
          if (props.is_mpl || props.is_d3) {
            next_cm = "tc";
          } else {
            next_cm = "rc";
          }
          break;
      }
      if (next_cm == "em") {
        _handleTabSelect("methods");
      } else if (next_cm == "gp") {
        _handleTabSelect("globals");
      }
      set_current_search_cm(next_cm);
      set_current_search_number(0);
    } else {
      set_current_search_number(current_search_number + 1);
    }
  }
  function _searchPrev() {
    let next_cm;
    let next_search_number;
    if (current_search_number <= 0) {
      if (current_search_cm == "em") {
        next_cm = "rc";
        next_search_number = search_match_numbers.current["rc"] - 1;
      } else if (current_search_cm == "tc") {
        next_cm = "em";
        next_search_number = search_match_numbers.current["em"] - 1;
      } else {
        if (props.is_mpl || props.is_d3) {
          next_cm = "tc";
          next_search_number = search_match_numbers.current["tc"] - 1;
        } else {
          next_cm = "em";
          next_search_number = search_match_numbers.current["em"] - 1;
        }
      }
      if (next_cm == "em") {
        _handleTabSelect("methods");
      }
      set_current_search_cm(next_cm);
      set_current_search_number(next_search_number);
    } else {
      set_current_search_number(current_search_number - 1);
    }
  }
  function _updateSearchState(new_state) {
    let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    set_current_search_cm(cm_list.current[0]);
    set_current_search_number(0);
    for (let field in new_state) {
      switch (field) {
        case "regex":
          set_regex(new_state[field]);
          break;
        case "search_string":
          set_search_string(new_state[field]);
          break;
      }
    }
  }
  function _noSearchResults() {
    if (search_string == "" || search_string == null) {
      return true;
    } else {
      for (let cm of cm_list.current) {
        if (search_match_numbers.current[cm]) {
          return false;
        }
      }
      return true;
    }
  }
  function _showHistoryViewer() {
    window.open(`${$SCRIPT_ROOT}/show_history_viewer/${_cProp("resource_name")}`);
  }
  function _showTileDiffer() {
    window.open(`${$SCRIPT_ROOT}/show_tile_differ/${_cProp("resource_name")}`);
  }
  function _selectLineNumber(lnumber) {
    rline_number.current = lnumber;
    _goToLineNumber();
  }
  function _logErrorStopSpinner(title, data) {
    statusFuncs.stopSpinner();
    let entry = {
      title: title,
      content: data.message
    };
    if ("line_number" in data) {
      entry.line_number = data.line_number;
    }
    errorDrawerFuncs.addErrorDrawerEntry(entry, true);
    errorDrawerFuncs.openErrorDrawer();
  }
  function _dirty() {
    let current_state = _getSaveDict();
    for (let k in current_state) {
      if (current_state[k] != last_save.current[k]) {
        return true;
      }
    }
    return false;
  }
  async function _saveAndLoadModule() {
    if (!am_selected()) {
      return false;
    }
    statusFuncs.startSpinner();
    let data;
    try {
      await doSavePromise();
      statusFuncs.statusMessage("Loading Module");
      await (0, _communication_react.postPromise)("host", "load_tile_module_task", {
        "tile_module_name": _cProp("resource_name"),
        "user_id": window.user_id
      }, props.module_viewer_id);
      statusFuncs.statusMessage("Loaded successfully");
      statusFuncs.stopSpinner();
    } catch (e) {
      _logErrorStopSpinner("Error saving and loading module", e);
    }
  }
  async function _loadModule() {
    if (!am_selected()) {
      return false;
    }
    statusFuncs.startSpinner();
    statusFuncs.statusMessage("Loading module...");
    try {
      await (0, _communication_react.postPromise)("host", "load_tile_module_task", {
        "tile_module_name": _cProp("resource_name"),
        "user_id": window.user_id
      }, props.module_viewer_id);
      statusFuncs.statusMessage("Loaded successfully");
      statusFuncs.stopSpinner();
    } catch (e) {
      _logErrorStopSpinner("Error saving and loading module", e);
    }
  }
  async function _saveModuleAs() {
    statusFuncs.startSpinner();
    let data;
    try {
      data = await (0, _communication_react.postPromise)("host", "get_tile_names", {
        "user_id": window.user_id
      }, props.main_id);
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
    } catch (e) {
      _logErrorStopSpinner("Error saving module", e);
    }
    function doCancel() {
      statusFuncs.stopSpinner();
    }
    async function CreateNewModule(new_name) {
      const result_dict = {
        "new_res_name": new_name,
        "res_to_copy": _cProp("resource_name")
      };
      try {
        data = await (0, _communication_react.postAjaxPromise)('/create_duplicate_tile', result_dict);
        _setResourceNameState(new_name, () => {
          _saveMe();
        });
      } catch (e) {
        _logErrorStopSpinner("Error saving module", e);
      }
    }
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  async function _saveMe() {
    if (!am_selected()) {
      return false;
    }
    statusFuncs.startSpinner();
    statusFuncs.statusMessage("Saving module...");
    try {
      await doSavePromise();
      statusFuncs.statusMessage("Saved module");
      statusFuncs.stopSpinner();
    } catch (e) {
      _logErrorStopSpinner("Error saving module", e);
    }
    return false;
  }
  async function _saveAndCheckpoint() {
    if (!am_selected()) {
      return false;
    }
    statusFuncs.startSpinner();
    statusFuncs.statusMessage("Checkpointing");
    let data;
    try {
      await doSavePromise();
      await doCheckpointPromise();
      statusFuncs.statusMessage("Saved and checkpointed");
      statusFuncs.stopSpinner();
    } catch (e) {
      _logErrorStopSpinner("Error in save and checkpoint", e);
    }
    return false;
  }
  function get_tags_string() {
    let taglist = tags_ref.current;
    let local_tags = "";
    for (let tag of taglist) {
      local_tags = local_tags + tag + " ";
    }
    return local_tags.trim();
  }
  function _getSaveDict() {
    return {
      "module_name": _cProp("resource_name"),
      "category": category.length == 0 ? "basic" : category_ref.current,
      "tags": get_tags_string(),
      "notes": notes_ref.current,
      "icon": icon_ref.current,
      "exports": export_list_ref.current,
      "additional_save_attrs": additional_save_attrs_ref.current,
      "couple_save_attrs_and_exports": couple_save_attrs_and_exports_ref.current,
      "options": option_list_ref.current,
      "extra_methods": extra_functions_ref.current,
      "globals_code": globals_code_ref.current,
      "render_content_body": render_content_code_ref.current,
      "is_mpl": props.is_mpl,
      "is_d3": props.is_d3,
      "draw_plot_body": draw_plot_code_ref.current,
      "jscript_body": jscript_code_ref.current,
      "last_saved": "creator"
    };
  }
  function doSavePromise() {
    return new Promise(async (resolve, reject) => {
      let result_dict = _getSaveDict();
      let data;
      try {
        data = await (0, _communication_react.postPromise)(props.module_viewer_id, "update_module", result_dict, props.module_viewer_id);
        save_success(data);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  }
  function doCheckpointPromise() {
    return (0, _communication_react.postAjaxPromise)("checkpoint_module", {
      "module_name": _cProp("resource_name")
    });
  }
  function save_success(data) {
    set_render_content_line_number(data.render_content_line_number);
    set_extra_methods_line_number(data.extra_methods_line_number);
    set_draw_plot_line_number(data.draw_plot_line_number);
    _update_saved_state();
  }
  function _update_saved_state() {
    last_save.current = _getSaveDict();
  }
  function _selectLine(cm, lnumber) {
    let doc = cm.getDoc();
    if (doc.getLine(lnumber)) {
      doc.setSelection({
        line: lnumber,
        ch: 0
      }, {
        line: lnumber,
        ch: doc.getLine(lnumber).length
      }, {
        scroll: true
      });
    }
  }
  function _goToLineNumber() {
    if (rline_number.current) {
      errorDrawerFuncs.closeErrorDrawer();
      if (props.is_mpl || props.is_d3) {
        if (rline_number.current < draw_plot_line_number_ref.current) {
          if (emObject.current) {
            _handleTabSelect("methods");
            _selectLine(emObject.current, rline_number.current - extra_methods_line_number_ref.current);
            rline_number.current = null;
          } else {
            return;
          }
        } else if (rline_number.current < render_content_line_number_ref.current) {
          if (dpObject.current) {
            _selectLine(dpObject.current, rline_number.current - draw_plot_line_number_ref.current - 1);
            rline_number.current = null;
          } else {
            return;
          }
        } else if (rcObject.current) {
          _selectLine(rcObject.current, rline_number.current - render_content_line_number_ref.current - 1);
          rline_number.current = null;
        }
      } else {
        if (rline_number.current < props.render_content_line_number) {
          if (emObject.current) {
            _handleTabSelect("methods");
            _selectLine(emObject.current, rline_number.current - extra_methods_line_number_ref.current);
            rline_number.current = null;
          } else {
            return;
          }
        } else {
          if (rcObject.current) {
            _selectLine(rcObject.current, rline_number.current - render_content_line_number_ref.current - 1);
            rline_number.current = null;
          }
        }
      }
    }
  }
  function delete_my_container() {
    (0, _communication_react.postAjax)("/delete_container_on_unload", {
      "container_id": props.module_viewer_id,
      "notify": false
    });
  }
  function _handleTabSelect(newTabId, prevTabid, event) {
    let new_fg = Object.assign({}, foregrounded_panes);
    new_fg[newTabId] = true;
    setSelectedTabId(newTabId);
    if (newTabId == "methods" && !methodsHasActivated) {
      setMethodsHasActivated(true);
    }
    if (newTabId == "globals" && !globalsHasActivated) {
      setGlobalsHasActivated(true);
    }
    set_foregrounded_panes(new_fg);
    pushCallback(() => {
      if (newTabId == "methods") {
        if (emObject.current) {
          emObject.current.refresh();
        }
      } else if (newTabId == "globals") {
        if (globalObject.current) {
          globalObject.current.refresh();
        }
      }
      setTabSelectCounter(tabSelectCounter + 1);
    });
  }
  function _handleNotesAppend(new_text) {
    set_notes(notes_ref.current + new_text);
  }
  function _appendOptionText() {
    let res_string = "\n\noptions: \n\n";
    for (let opt of option_list_ref.current) {
      res_string += ` * \`${opt.name}\` (${opt.type}): \n`;
    }
    _handleNotesAppend(res_string);
  }
  function _appendExportText() {
    let res_string = "\n\nexports: \n\n";
    for (let exp of export_list_ref.current) {
      res_string += ` * \`${exp.name}\` : \n`;
    }
    _handleNotesAppend(res_string);
  }
  function _metadataNotesButtons() {
    return /*#__PURE__*/_react.default.createElement(_core.ButtonGroup, null, /*#__PURE__*/_react.default.createElement(_core.Button, {
      style: {
        height: "fit-content",
        alignSelf: "start",
        marginTop: 10,
        fontSize: 12
      },
      text: "Add Options",
      small: true,
      minimal: true,
      intent: "primary",
      icon: "select",
      onClick: e => {
        e.preventDefault();
        _appendOptionText();
      }
    }), /*#__PURE__*/_react.default.createElement(_core.Button, {
      style: {
        height: "fit-content",
        alignSelf: "start",
        marginTop: 10,
        fontSize: 12
      },
      text: "Add Exports",
      small: true,
      minimal: true,
      intent: "primary",
      icon: "export",
      onClick: e => {
        e.preventDefault();
        _appendExportText();
      }
    }));
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
        case "category":
          set_category(state_stuff[field]);
          break;
      }
    }
  }
  function handleExportsStateChange(state_stuff) {
    for (let field in state_stuff) {
      switch (field) {
        case "export_list":
          set_export_list([...state_stuff[field]]);
          break;
        case "additional_save_attrs":
          set_additional_save_attrs([...state_stuff[field]]);
          break;
        case "couple_save_attrs_and_exports":
          set_couple_save_attrs_and_exports(state_stuff[field]);
          break;
      }
    }
  }
  function handleOptionsListChange(new_option_list) {
    let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    set_option_list([...new_option_list]);
    pushCallback(callback);
  }
  function handleMethodsChange(new_methods) {
    set_extra_functions(new_methods);
  }
  function handleGlobalsChange(new_globals) {
    set_globals_code(new_globals);
  }
  function handleTopCodeChange(new_code) {
    if (props.is_mpl) {
      set_draw_plot_code(new_code);
    } else {
      set_jscript_code(new_code);
    }
  }
  function handleRenderContentChange(new_code) {
    set_render_content_code(new_code);
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
  function _clearAllSelections() {
    for (let cm of [rcObject.current, dpObject.current, emObject.current]) {
      if (cm) {
        let to = cm.getCursor("to");
        cm.setCursor(to);
      }
    }
  }
  function _setDpObject(cmobject) {
    dpObject.current = cmobject;
  }
  function _setRcObject(cmobject) {
    rcObject.current = cmobject;
  }
  function _setEmObject(cmobject) {
    emObject.current = cmobject;
  }
  function _setGlobalObject(cmobject) {
    globalObject.current = cmobject;
  }
  function _setSearchMatches(rc_name, num) {
    search_match_numbers.current[rc_name] = num;
    let current_matches = 0;
    for (let cname in search_match_numbers.current) {
      current_matches += search_match_numbers.current[cname];
    }
    set_search_matches(current_matches);
  }
  function _getOptionNames() {
    let onames = [];
    for (let entry of option_list_ref.current) {
      onames.push(entry.name);
    }
    return onames;
  }
  let onames_for_autocomplete = [];
  for (let oname of _getOptionNames()) {
    let the_text = "" + oname;
    onames_for_autocomplete.push({
      text: the_text,
      icon: "select",
      render: _autocomplete.renderAutoCompleteElement
    });
  }
  let my_props = {
    ...props
  };
  if (!props.controlled) {
    my_props.resource_name = resource_name;
  }
  let ch_style = {
    "width": "100%"
  };
  let tc_item;
  if (my_props.is_mpl || my_props.is_d3) {
    let mode = my_props.is_mpl ? "python" : "javascript";
    let code_content = my_props.is_mpl ? draw_plot_code_ref.current : jscript_code_ref.current;
    let first_line_number = my_props.is_mpl ? draw_plot_line_number_ref.current + 1 : 1;
    let title_label = my_props.is_mpl ? "draw_plot" : "(selector, w, h, arg_dict, resizing) =>";
    tc_item = /*#__PURE__*/_react.default.createElement(_reactCodemirror.ReactCodemirror, {
      code_content: code_content,
      title_label: title_label,
      show_search: true,
      mode: mode,
      extraKeys: _extraKeys(),
      current_search_number: current_search_cm == "tc" ? current_search_number : null,
      handleChange: handleTopCodeChange,
      saveMe: _saveAndCheckpoint,
      setCMObject: _setDpObject,
      search_term: search_string,
      updateSearchState: _updateSearchState,
      alt_clear_selections: _clearAllSelections,
      first_line_number: first_line_number,
      readOnly: props.read_only,
      regex_search: regex,
      search_ref: search_ref,
      searchPrev: _searchPrev,
      searchNext: _searchNext,
      search_matches: search_matches,
      setSearchMatches: num => _setSearchMatches("tc", num),
      extra_autocomplete_list: mode == "python" ? onames_for_autocomplete : []
    });
  }
  let bc_item = /*#__PURE__*/_react.default.createElement("div", {
    key: "rccode",
    id: "rccode",
    style: ch_style,
    className: "d-flex flex-column align-items-baseline code-holder"
  }, /*#__PURE__*/_react.default.createElement(_reactCodemirror.ReactCodemirror, {
    code_content: render_content_code_ref.current,
    title_label: "render_content",
    show_search: !(my_props.is_mpl || my_props.is_d3),
    updateSearchState: _updateSearchState,
    current_search_number: current_search_cm == "rc" ? current_search_number : null,
    handleChange: handleRenderContentChange,
    extraKeys: _extraKeys(),
    saveMe: _saveAndCheckpoint,
    setCMObject: _setRcObject,
    search_term: search_string,
    update_search_state: _updateSearchState,
    alt_clear_selections: _clearAllSelections,
    first_line_number: render_content_line_number_ref.current + 1,
    readOnly: props.read_only,
    regex_search: regex,
    searchPrev: _searchPrev,
    searchNext: _searchNext,
    search_matches: search_matches,
    setSearchMatches: num => _setSearchMatches("rc", num),
    extra_autocomplete_list: onames_for_autocomplete
  }));
  let left_pane;
  if (my_props.is_mpl || my_props.is_d3) {
    left_pane = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      ref: vp_ref
    }), /*#__PURE__*/_react.default.createElement(_resizing_layouts.VerticalPanes, {
      top_pane: tc_item,
      bottom_pane: bc_item,
      show_handle: true,
      id: "creator-left"
    }));
  } else {
    left_pane = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      ref: vp_ref
    }, bc_item));
  }
  let mdata_panel = /*#__PURE__*/_react.default.createElement(_creator_modules_react.MetadataModule, {
    tags: tags_ref.current,
    expandWidth: false,
    all_tags: all_tags,
    readOnly: props.readOnly,
    notes: notes_ref.current,
    icon: icon_ref.current,
    created: my_props.created,
    category: category_ref.current,
    pane_type: "tile",
    notes_buttons: _metadataNotesButtons,
    handleChange: _handleMetadataChange,
    tabSelectCounter: tabSelectCounter
  });
  let option_panel = /*#__PURE__*/_react.default.createElement(_creator_modules_react.OptionModule, {
    data_list_ref: option_list_ref,
    foregrounded: foregrounded_panes["options"],
    handleChange: handleOptionsListChange,
    handleNotesAppend: _handleNotesAppend,
    tabSelectCounter: tabSelectCounter
  });
  let export_panel = /*#__PURE__*/_react.default.createElement(_creator_modules_react.ExportModule, {
    export_list: export_list_ref.current,
    save_list: additional_save_attrs_ref.current,
    couple_save_attrs_and_exports: couple_save_attrs_and_exports_ref.current,
    foregrounded: foregrounded_panes["exports"],
    handleChange: handleExportsStateChange,
    handleNotesAppend: _handleNotesAppend,
    tabSelectCounter: tabSelectCounter
  });
  let methods_panel = /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginLeft: 10
    }
  }, methodsHasActivated && /*#__PURE__*/_react.default.createElement(_reactCodemirror.ReactCodemirror, {
    handleChange: handleMethodsChange,
    show_fold_button: true,
    current_search_number: current_search_cm == "em" ? current_search_number : null,
    extraKeys: _extraKeys(),
    readOnly: props.readOnly,
    code_content: extra_functions_ref.current,
    saveMe: _saveAndCheckpoint,
    setCMObject: _setEmObject,
    code_container_ref: methods_ref,
    search_term: search_string,
    update_search_state: _updateSearchState,
    alt_clear_selections: _clearAllSelections,
    regex_search: regex,
    first_line_number: extra_methods_line_number_ref.current,
    setSearchMatches: num => _setSearchMatches("em", num),
    extra_autocomplete_list: onames_for_autocomplete,
    iCounter: tabSelectCounter
  }));
  let globals_panel = /*#__PURE__*/_react.default.createElement("div", {
    style: {
      marginLeft: 10
    }
  }, globalsHasActivated && /*#__PURE__*/_react.default.createElement(_reactCodemirror.ReactCodemirror, {
    handleChange: handleGlobalsChange,
    show_fold_button: true,
    current_search_number: current_search_cm == "gp" ? current_search_number : null,
    extraKeys: _extraKeys(),
    readOnly: props.readOnly,
    code_content: globals_code_ref.current,
    saveMe: _saveAndCheckpoint,
    setCMObject: _setGlobalObject,
    code_container_ref: globals_ref,
    search_term: search_string,
    update_search_state: _updateSearchState,
    alt_clear_selections: _clearAllSelections,
    regex_search: regex,
    first_line_number: 1,
    setSearchMatches: num => _setSearchMatches("gp", num),
    extra_autocomplete_list: onames_for_autocomplete,
    iCounter: tabSelectCounter
  }));
  // let commands_panel = (
  //     <CommandsModule foregrounded={foregrounded_panes["commands"]}
  //                     tabSelectCounter={tabSelectCounter}
  //     />
  // );
  let right_pane = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    id: "creator-resources",
    className: "d-block"
  }, /*#__PURE__*/_react.default.createElement(_core.Tabs, {
    id: "resource_tabs",
    selectedTabId: selectedTabId,
    large: false,
    onChange: _handleTabSelect
  }, /*#__PURE__*/_react.default.createElement(_core.Tab, {
    id: "metadata",
    title: /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_core.Icon, {
      size: 12,
      icon: "manually-entered-data"
    }), " metadata"),
    panel: mdata_panel
  }), /*#__PURE__*/_react.default.createElement(_core.Tab, {
    id: "options",
    title: /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_core.Icon, {
      size: 12,
      icon: "select"
    }), " options"),
    panel: option_panel
  }), /*#__PURE__*/_react.default.createElement(_core.Tab, {
    id: "exports",
    title: /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_core.Icon, {
      size: 12,
      icon: "export"
    }), " exports"),
    panel: export_panel
  }), /*#__PURE__*/_react.default.createElement(_core.Tab, {
    id: "methods",
    title: /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_core.Icon, {
      size: 12,
      icon: "code"
    }), " methods"),
    panel: methods_panel
  }), /*#__PURE__*/_react.default.createElement(_core.Tab, {
    id: "globals",
    title: /*#__PURE__*/_react.default.createElement("span", null, /*#__PURE__*/_react.default.createElement(_core.Icon, {
      size: 12,
      icon: "code"
    }), " globals"),
    panel: globals_panel
  }))));
  let outer_style = {
    width: "100%",
    height: sizeInfo.availableHeight,
    paddingLeft: props.controlled ? 5 : _sizing_tools.SIDE_MARGIN,
    paddingTop: 15
  };
  let outer_class = "resource-viewer-holder pane-holder";
  if (!window.in_context) {
    if (theme.dark_theme) {
      outer_class = outer_class + " bp5-dark";
    } else {
      outer_class = outer_class + " light-theme";
    }
  }
  let uwidth = usable_width - 2 * _sizing_tools.SIDE_MARGIN;
  return /*#__PURE__*/_react.default.createElement(_error_boundary.ErrorBoundary, null, !window.in_context && /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    page_id: props.module_viewer_id,
    user_name: window.username
  }), /*#__PURE__*/_react.default.createElement(_menu_utilities.TacticMenubar, {
    menu_specs: menu_specs(),
    connection_status: connection_status,
    showRefresh: window.in_context,
    showClose: window.in_context,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: _cProp("resource_name"),
    showErrorDrawerButton: true,
    controlled: props.controlled
  }), /*#__PURE__*/_react.default.createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react.default.createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, /*#__PURE__*/_react.default.createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      availableWidth: uwidth,
      availableHeight: usable_height,
      topX: topX,
      topY: topY
    }
  }, /*#__PURE__*/_react.default.createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: left_pane,
    right_pane: right_pane,
    show_handle: true,
    initial_width_fraction: .5,
    handleSplitUpdate: null,
    bottom_margin: BOTTOM_MARGIN,
    right_margin: _sizing_tools.SIDE_MARGIN
  }))), !window.in_context && /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_key_trap.KeyTrap, {
    global: true,
    bindings: key_bindings.current
  }))));
}
exports.CreatorApp = CreatorApp = /*#__PURE__*/(0, _react.memo)(CreatorApp);
CreatorApp.propTypes = {
  controlled: _propTypes.default.bool,
  changeResourceName: _propTypes.default.func,
  refreshTab: _propTypes.default.func,
  closeTab: _propTypes.default.func,
  registerLineSetter: _propTypes.default.func,
  updatePanel: _propTypes.default.func,
  is_mpl: _propTypes.default.bool,
  render_content_code: _propTypes.default.string,
  render_content_line_number: _propTypes.default.number,
  extra_methods_line_number: _propTypes.default.number,
  category: _propTypes.default.string,
  extra_functions: _propTypes.default.string,
  draw_plot_code: _propTypes.default.string,
  jscript_code: _propTypes.default.string,
  tags: _propTypes.default.array,
  notes: _propTypes.default.string,
  icon: _propTypes.default.string,
  option_list: _propTypes.default.array,
  export_list: _propTypes.default.array,
  created: _propTypes.default.string,
  tsocket: _propTypes.default.object,
  usable_height: _propTypes.default.number,
  usable_width: _propTypes.default.number
};
CreatorApp.defaultProps = {
  controlled: false,
  changeResourceName: null,
  changeResourceTitle: null,
  changeResourceProps: null,
  registerLineSetter: null,
  refreshTab: null,
  closeTab: null,
  updatePanel: null
};
function tile_creator_main() {
  function gotProps(the_props) {
    let CreatorAppPlus = (0, _sizing_tools.withSizeContext)((0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(CreatorApp)))));
    let the_element = /*#__PURE__*/_react.default.createElement(CreatorAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    const domContainer = document.querySelector('#creator-root');
    ReactDOM.render(the_element, domContainer);
  }
  (0, _utilities_react.renderSpinnerMessage)("Starting up ...", '#creator-root');
  (0, _communication_react.postAjaxPromise)("view_in_creator_in_context", {
    "resource_name": window.module_name
  }).then(data => {
    (0, _tile_creator_support.creator_props)(data, null, gotProps, null);
  });
}
if (!window.in_context) {
  tile_creator_main();
}