"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MainApp = MainApp;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_main.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/tactic_console.scss");
require("../tactic_css/tactic_select.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _table = require("@blueprintjs/table");
var _lodash = _interopRequireDefault(require("lodash"));
var _main_support = require("./main_support");
var _blueprint_navbar = require("./blueprint_navbar");
var _menu_utilities = require("./menu_utilities");
var _table_react = require("./table_react");
var _blueprint_table = require("./blueprint_table");
var _resizing_layouts = require("./resizing_layouts2");
var _main_menus_react = require("./main_menus_react");
var _tile_react = require("./tile_react");
var _export_viewer_react = require("./export_viewer_react");
var _console_component = require("./console_component");
var _console_support = require("./console_support");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _sizing_tools = require("./sizing_tools");
var _error_boundary = require("./error_boundary");
var _settings = require("./settings");
var _pool_tree = require("./pool_tree");
var _assistant = require("./assistant");
var _modal_react = require("./modal_react");
var _metadata_drawer = require("./metadata_drawer");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// import { HotkeysProvider } from "@blueprintjs/core";

const MARGIN_SIZE = 0;
const BOTTOM_MARGIN = 30; // includes space for status messages at bottom
const MARGIN_ADJUSTMENT = 8; // This is the amount at the top of both the table and the console
const CONSOLE_HEADER_HEIGHT = 35;
const EXTRA_TABLE_AREA_SPACE = 500;
const MENU_BAR_HEIGHT = 30; // will only appear when in context
const TABLE_CONSOLE_GAP = 20; // handle width plus margin

const iStateDefaults = {
  table_is_shrunk: false,
  tile_list: [],
  console_items: [],
  console_width_fraction: .5,
  horizontal_fraction: .65,
  console_is_shrunk: true,
  height_fraction: .85,
  show_exports_pane: true,
  show_console_pane: true,
  console_is_zoomed: false
};
function MainApp(props) {
  props = {
    controlled: false,
    changeResourceName: null,
    refreshTab: null,
    closeTab: null,
    updatePanel: null,
    ...props
  };
  function iStateOrDefault(pname) {
    if (props.is_project) {
      if ("interface_state" in props && props.interface_state && pname in props.interface_state) {
        return props.interface_state[pname];
      }
    }
    return iStateDefaults[pname];
  }
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  const last_save = (0, _react.useRef)({});
  const resizing = (0, _react.useRef)(false);
  const updateExportsList = (0, _react.useRef)(null);
  const table_container_ref = (0, _react.useRef)(null);
  const main_outer_ref = (0, _react.useRef)(null);
  const set_table_scroll = (0, _react.useRef)(null);
  const [console_selected_items, set_console_selected_items, console_selected_items_ref] = (0, _utilities_react.useStateAndRef)([]);
  const [console_items, dispatch, console_items_ref] = (0, _utilities_react.useReducerAndRef)(_console_support.consoleItemsReducer, iStateOrDefault("console_items"));
  const [tile_list, tileDispatch, tile_list_ref] = (0, _utilities_react.useReducerAndRef)(_tile_react.tilesReducer, iStateOrDefault("tile_list"));
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  const [mState, mDispatch] = (0, _react.useReducer)(_main_support.mainReducer, {
    table_is_shrunk: props.doc_type == "none" || iStateOrDefault("table_is_shrunk"),
    console_width_fraction: iStateOrDefault("console_width_fraction"),
    horizontal_fraction: iStateOrDefault("horizontal_fraction"),
    height_fraction: iStateOrDefault("height_fraction"),
    console_is_shrunk: iStateOrDefault("console_is_shrunk"),
    console_is_zoomed: iStateOrDefault("console_is_zoomed"),
    show_exports_pane: iStateOrDefault("show_exports_pane"),
    show_console_pane: iStateOrDefault("show_console_pane"),
    show_metadata: false,
    table_spec: props.initial_table_spec,
    doc_type: props.doc_type,
    data_text: props.doc_type == "freeform" ? props.initial_data_text : "",
    data_row_dict: props.doc_type == "freeform" ? {} : props.initial_data_row_dict,
    total_rows: props.doc_type == "freeform" ? 0 : props.total_rows,
    doc_names: props.initial_doc_names,
    short_collection_name: props.short_collection_name,
    tile_types: props.initial_tile_types,
    tile_icon_dict: props.initial_tile_icon_dict,
    alt_search_text: null,
    selected_column: null,
    selected_row: null,
    selected_regions: [],
    table_is_filtered: false,
    search_text: "",
    soft_wrap: false,
    show_table_spinner: false,
    cells_to_color_text: {},
    spreadsheet_mode: false,
    // These will maybe only be used if not controlled
    resource_name: props.resource_name,
    is_project: props.is_project
  });
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(main_outer_ref, 0, "MainApp");
  const connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(() => {
    if (props.controlled) {
      props.registerDirtyMethod(_dirty);
    } else {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }
    _updateLastSave();
    statusFuncs.stopSpinner();
    if (!props.controlled) {
      document.title = mState.resource_name;
    }
    function sendRemove() {
      console.log("got the beacon");
      navigator.sendBeacon("/remove_mainwindow", JSON.stringify({
        "main_id": props.main_id
      }));
    }
    window.addEventListener("unload", sendRemove);
    return () => {
      delete_my_containers();
      window.removeEventListener("unload", sendRemove);
    };
  }, []);
  (0, _react.useEffect)(() => {
    const data = {
      active_row_id: mState.selected_row,
      doc_name: mState.table_spec.current_doc_name
    };
    _broadcast_event_to_server("MainTableRowSelect", data);
  }, [mState.selected_row]);
  function _filteredColumnNames() {
    return mState.table_spec.column_names.filter(name => {
      return !(mState.table_spec.hidden_columns_list.includes(name) || name == "__id__");
    });
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : mState[pname];
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  const save_state = {
    tile_list: tile_list,
    console_items: console_items,
    table_is_shrunk: mState.table_is_shrunk,
    console_width_fraction: mState.console_width_fraction,
    horizontal_fraction: mState.horizontal_fraction,
    console_is_shrunk: mState.console_is_shrunk,
    height_fraction: mState.height_fraction,
    show_exports_pane: mState.show_exports_pane,
    show_console_pane: mState.show_console_pane,
    console_is_zoomed: mState.console_is_zoomed
  };
  function _updateLastSave() {
    last_save.current = save_state;
  }
  function _dirty() {
    let current_state = save_state;
    for (let k in current_state) {
      if (current_state[k] != last_save.current[k]) {
        return true;
      }
    }
    return false;
  }
  function delete_my_containers() {
    (0, _communication_react.postAjax)("/remove_mainwindow", {
      "main_id": props.main_id
    });
  }
  async function _update_menus_listener() {
    let data = await (0, _communication_react.postPromise)("host", "get_tile_types", {
      "user_id": window.user_id
    }, props.main_id);
    mDispatch({
      type: "change_multiple_fields",
      newPartialState: {
        tile_types: data.tile_types,
        tile_icon_dict: data.icon_dict
      }
    });
  }
  async function _change_doc_listener(data) {
    if (data.main_id == props.main_id) {
      let row_id = data.hasOwnProperty("row_id") ? data.row_id : null;
      let scroll_to_row = data.hasOwnProperty("scroll_to_row") ? data.scroll_to_row : true;
      let select_row = data.hasOwnProperty("select_row") ? data.select_row : true;
      if (mState.table_is_shrunk) {
        _setMainStateValue("table_is_shrunk", false);
      }
      await _handleChangeDoc(data.doc_name, row_id, scroll_to_row, select_row);
    }
  }
  function _setTileValue(tile_id, field, value) {
    tileDispatch({
      type: "change_item_value",
      tile_id: tile_id,
      field: field,
      new_value: value
    });
  }
  function _handleTileFinishedLoading(data) {
    _setTileValue(data.tile_id, "finished_loading", true);
  }
  function initSocket() {
    props.tsocket.attachListener("window-open", data => {
      window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`);
    });
    if (!window.in_context) {
      props.tsocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == main_id)) {
          window.close();
        }
      });
      props.tsocket.attachListener("notebook-open", function (data) {
        window.open($SCRIPT_ROOT + "/new_notebook_with_data/" + data.temp_data_id);
      });
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
    } else {
      props.tsocket.attachListener("notebook-open", async function (data) {
        const the_view = `${$SCRIPT_ROOT}/new_notebook_in_context`;
        try {
          let createData = await (0, _communication_react.postAjaxPromise)(the_view, {
            temp_data_id: data.temp_data_id,
            resource_name: ""
          });
          props.handleCreateViewer(createData);
        } catch (e) {
          errorDrawerFuncs.addFromError(`Error saving list`, e);
        }
      });
    }
    props.tsocket.attachListener('table-message', _handleTableMessage);
    props.tsocket.attachListener("update-menus", _update_menus_listener);
    props.tsocket.attachListener("tile-finished-loading", _handleTileFinishedLoading);
    props.tsocket.attachListener('change-doc', _change_doc_listener);
    props.tsocket.attachListener('handle-callback', task_packet => {
      (0, _communication_react.handleCallback)(task_packet, props.main_id);
    });
  }
  function isFreeform() {
    return mState.doc_type == "freeform";
  }

  // Every item in tile_list is a list of this form
  function _createTileEntry(tile_name, tile_type, tile_id, form_data) {
    return {
      tile_name: tile_name,
      tile_type: tile_type,
      tile_id: tile_id,
      form_data: form_data,
      tile_height: 345,
      tile_width: 410,
      show_form: false,
      show_spinner: false,
      source_changed: false,
      javascript_code: null,
      javascript_arg_dict: null,
      show_log: false,
      log_content: "",
      // log_since: null,
      // max_console_lines: 100,
      shrunk: false,
      finished_loading: true,
      front_content: ""
    };
  }
  const _setMainStateValue = (0, _react.useCallback)(function (field_name) {
    let new_value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    if (typeof field_name == "object") {
      mDispatch({
        type: "change_multiple_fields",
        newPartialState: field_name
      });
      pushCallback(callback);
    } else {
      mDispatch({
        type: "change_field",
        field: field_name,
        new_value: new_value
      });
      pushCallback(callback);
    }
  });
  function _handleSearchFieldChange(lsearch_text) {
    mDispatch({
      type: "change_multiple_fields",
      newPartialState: {
        search_text: lsearch_text,
        alt_search_text: null
      }
    });
    if (lsearch_text == null && !isFreeform()) {
      _setMainStateValue("cells_to_color_text", {});
    }
  }
  function _handleSpreadsheetModeChange(event) {
    _setMainStateValue("spreadsheet_mode", event.target.checked);
  }
  function _handleSoftWrapChange(event) {
    _setMainStateValue("soft_wrap", event.target.checked);
  }
  function _setAltSearchText(the_text) {
    _setMainStateValue("alt_search_text", the_text);
  }
  async function _handleChangeDoc(new_doc_name) {
    let row_index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    let scroll_to_row = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    let select_row = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : true;
    _setMainStateValue("show_table_spinner", true);
    if (isFreeform()) {
      try {
        let data = await (0, _communication_react.postPromise)(props.main_id, "grab_freeform_data", {
          "doc_name": new_doc_name,
          "set_visible_doc": true
        }, props.main_id);
        statusFuncs.stopSpinner();
        statusFuncs.clearStatusMessage();
        let new_table_spec = {
          "current_doc_name": new_doc_name
        };
        mDispatch({
          type: "change_multiple_fields",
          newPartialState: {
            data_text: data.data_text,
            table_spec: new_table_spec,
            visible_doc: new_doc_name
          }
        });
        pushCallback(() => {
          _setMainStateValue("show_table_spinner", false);
        });
      } catch (e) {
        errorDrawerFuncs.addFromError("Error changing doc", e);
      }
    } else {
      try {
        const data_dict = {
          "doc_name": new_doc_name,
          "row_index": row_index,
          "set_visible_doc": true
        };
        let data = await (0, _communication_react.postPromise)(props.main_id, "grab_chunk_by_row_index", data_dict, props.main_id);
        _setStateFromDataObject(data, new_doc_name, () => {
          _setMainStateValue("show_table_spinner", false);
          if (select_row) {
            _setMainStateValue({
              selected_regions: [_table.Regions.row(row_index)],
              selected_row: row_index,
              selected_column: null
            }, null);
          }
          if (scroll_to_row) {
            set_table_scroll.current = row_index;
          }
        });
      } catch (e) {
        errorDrawerFuncs.addFromError("Error changing doc", e);
      }
    }
  }
  function _handleVerticalSplitUpdate(top_height, bottom_height, top_fraction) {
    _setMainStateValue("height_fraction", top_fraction);
  }
  function _updateTableSpec(spec_update) {
    let broadcast = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    mDispatch({
      type: "update_table_spec",
      spec_update: spec_update
    });
    if (broadcast) {
      spec_update["doc_name"] = mState.table_spec.current_doc_name;
      (0, _communication_react.postWithCallback)(props.main_id, "UpdateTableSpec", spec_update, null, null, props.main_id);
    }
  }
  const _broadcast_event_to_server = (0, _react.useCallback)(function (event_name, data_dict) {
    let callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    data_dict.main_id = props.main_id;
    data_dict.event_name = event_name;
    if (!("doc_name" in data_dict)) {
      data_dict.doc_name = mState.table_spec.current_doc_name;
    }
    (0, _communication_react.postWithCallback)(props.main_id, "distribute_events_stub", data_dict, callback, null, props.main_id);
  }, [props.main_id, mState.table_spec.current_doc_name]);
  function _broadcast_event_promise(event_name, data_dict) {
    data_dict.main_id = props.main_id;
    data_dict.event_name = event_name;
    if (!("doc_name" in data_dict)) {
      data_dict.doc_name = mState.table_spec.current_doc_name;
    }
    return (0, _communication_react.postPromise)(props.main_id, "distribute_events_stub", data_dict, props.main_id);
  }
  async function _tile_command(menu_id) {
    var existing_tile_names = [];
    for (let tile_entry of tile_list) {
      existing_tile_names.push(tile_entry.tile_name);
    }
    try {
      let tile_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: "Create " + menu_id,
        field_title: "New Tile Name",
        default_value: menu_id,
        existing_names: existing_tile_names,
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      statusFuncs.startSpinner();
      statusFuncs.statusMessage("Creating Tile " + tile_name);
      const data_dict = {
        tile_name: tile_name,
        tile_type: menu_id,
        user_id: window.user_id,
        parent: props.main_id
      };
      let create_data = await (0, _communication_react.postPromise)(props.main_id, "create_tile", data_dict, props.main_id);
      let new_tile_entry = _createTileEntry(tile_name, menu_id, create_data.tile_id, create_data.form_data);
      tileDispatch({
        type: "add_at_index",
        insert_index: tile_list.length,
        new_item: new_tile_entry
      });
      if (updateExportsList.current) updateExportsList.current();
      statusFuncs.clearStatusMessage();
      statusFuncs.stopSpinner();
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error creating tile}`, e);
      }
      statusFuncs.clearStatusMessage();
      statusFuncs.stopSpinner();
    }
  }
  function create_tile_menus() {
    let menu_items = [];
    let sorted_categories = [...Object.keys(mState.tile_types)];
    sorted_categories.sort();
    for (let category of sorted_categories) {
      let option_dict = {};
      let icon_dict = {};
      let sorted_types = [...mState.tile_types[category]];
      sorted_types.sort();
      for (let ttype of sorted_types) {
        option_dict[ttype] = () => _tile_command(ttype);
        icon_dict[ttype] = mState.tile_icon_dict[ttype];
      }
      menu_items.push( /*#__PURE__*/_react.default.createElement(_main_menus_react.MenuComponent, {
        menu_name: category,
        option_dict: option_dict,
        binding_dict: {},
        icon_dict: icon_dict,
        disabled_items: [],
        key: category
      }));
    }
    return menu_items;
  }
  function _toggleTableShrink() {
    _setMainStateValue("table_is_shrunk", !mState.table_is_shrunk);
  }
  function _handleHorizontalFractionChange(left_width, right_width, new_fraction) {
    _setMainStateValue("horizontal_fraction", new_fraction);
  }
  function _handleResizeStart() {
    resizing.current = true;
  }
  function _handleResizeEnd() {
    resizing.current = false;
  }
  function _handleConsoleFractionChange(left_width, right_width, new_fraction) {
    _setMainStateValue("console_width_fraction", new_fraction);
  }

  // Table doctype-only methods start here

  function _setFreeformDoc(doc_name, new_content) {
    if (doc_name == mState.table_spec.current_doc_name) {
      _setMainStateValue("data_text", new_content);
    }
  }
  function _handleTableMessage(data) {
    if (data.main_id == props.main_id) {
      let handlerDict = {
        refill_table: _refill_table,
        dehighlightAllText: data => _handleSearchFieldChange(null),
        highlightTxtInDocument: data => _setAltSearchText(data.text_to_find),
        updateNumberRows: data => _updateNumberRows(data.doc_name, data.number_rows),
        setCellContent: data => _setCellContent(data.row, data.column_header, data.new_content),
        colorTxtInCell: data => _colorTextInCell(data.row_id, data.column_header, data.token_text, data.color_dict),
        setFreeformContent: data => _setFreeformDoc(data.doc_name, data.new_content),
        updateDocList: data => _updateDocList(data.doc_names, data.visible_doc),
        setCellBackground: data => _setCellBackgroundColor(data.row, data.column_header, data.color)
      };
      handlerDict[data.table_message](data);
    }
  }
  const _setCellContent = (0, _react.useCallback)(function (row_id, column_header, new_content) {
    let broadcast = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    mDispatch({
      type: "set_cell_content",
      row_id: row_id,
      column_header: column_header,
      new_content: new_content
    });
    let data = {
      id: row_id,
      column_header: column_header,
      new_content: new_content,
      cellchange: false
    };
    if (broadcast) {
      _broadcast_event_to_server("SetCellContent", data, null);
    }
  }, []);
  function _setCellBackgroundColor(row_id, column_header, color) {
    mDispatch({
      type: "set_cell_background",
      row_id: row_id,
      column_header: column_header
    });
  }
  function _colorTextInCell(row_id, column_header, token_text, color_dict) {
    mDispatch({
      type: "set_cells_to_color_text",
      row_id: row_id,
      column_header: column_header,
      token_text: token_text,
      color_dict: color_dict
    });
  }
  function _refill_table(data_object) {
    _setStateFromDataObject(data_object, data_object.doc_name);
  }
  function _moveColumn(tag_to_move, place_to_move) {
    let colnames = [...mState.table_spec.column_names];
    let start_index = colnames.indexOf(tag_to_move);
    colnames.splice(start_index, 1);
    if (!place_to_move) {
      colnames.push(tag_to_move);
    } else {
      let end_index = colnames.indexOf(place_to_move);
      colnames.splice(end_index, 0, tag_to_move);
    }
    let fnames = _filteredColumnNames();
    start_index = fnames.indexOf(tag_to_move);
    fnames.splice(start_index, 1);
    let cwidths = [...mState.table_spec.column_widths];
    let width_to_move = cwidths[start_index];
    cwidths.splice(start_index, 1);
    if (!place_to_move) {
      cwidths.push(width_to_move);
    } else {
      let end_index = fnames.indexOf(place_to_move);
      cwidths.splice(end_index, 0, width_to_move);
    }
    _updateTableSpec({
      column_names: colnames,
      column_widths: cwidths
    }, true);
  }
  function _hideColumn() {
    let hc_list = [...mState.table_spec.hidden_columns_list];
    let fnames = _filteredColumnNames();
    let cname = mState.selected_column;
    let col_index = fnames.indexOf(cname);
    let cwidths = [...mState.table_spec.column_widths];
    cwidths.splice(col_index, 1);
    hc_list.push(cname);
    _updateTableSpec({
      hidden_columns_list: hc_list,
      column_widths: cwidths
    }, true);
  }
  async function _hideColumnInAll() {
    let hc_list = [...mState.table_spec.hidden_columns_list];
    let fnames = _filteredColumnNames();
    let cname = mState.selected_column;
    let col_index = fnames.indexOf(cname);
    let cwidths = [...mState.table_spec.column_widths];
    cwidths.splice(col_index, 1);
    hc_list.push(cname);
    const data_dict = {
      "column_name": mState.selected_column
    };
    await _broadcast_event_promise("HideColumnInAllDocs", data_dict, false);
    _updateTableSpec({
      hidden_columns_list: hc_list,
      column_widths: cwidths
    });
  }
  function _unhideAllColumns() {
    _updateTableSpec({
      hidden_columns_list: ["__filename__"]
    }, true);
  }
  const _clearTableScroll = (0, _react.useCallback)(() => {
    set_table_scroll.current = null;
  }, []);
  async function _deleteRow() {
    await (0, _communication_react.postPromise)(props.main_id, "delete_row", {
      "document_name": mState.table_spec.current_doc_name,
      "index": mState.selected_row
    });
  }
  async function _insertRow(index) {
    await (0, _communication_react.postPromise)(props.main_id, "insert_row", {
      "document_name": mState.table_spec.current_doc_name,
      "index": index,
      "row_dict": {}
    }, props.main_id);
  }
  async function _duplicateRow() {
    await (0, _communication_react.postPromise)(props.main_id, "insert_row", {
      "document_name": mState.table_spec.current_doc_name,
      "index": mState.selected_row,
      "row_dict": mState.data_text[mState.selected_row]
    }, props.main_id);
  }
  async function _deleteColumn() {
    let delete_in_all = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    let fnames = _filteredColumnNames();
    let cname = mState.selected_column;
    let col_index = fnames.indexOf(cname);
    let cwidths = [...mState.table_spec.column_widths];
    cwidths.splice(col_index, 1);
    let hc_list = _lodash.default.without(mState.table_spec.hidden_columns_list, cname);
    let cnames = _lodash.default.without(mState.table_spec.column_names, cname);
    _updateTableSpec({
      column_names: cnames,
      hidden_columns_list: hc_list,
      column_widths: cwidths
    }, false);
    const data_dict = {
      "column_name": cname,
      "doc_name": mState.table_spec.current_doc_name,
      "all_docs": delete_in_all
    };
    await (0, _communication_react.postPromise)(props.main_id, "DeleteColumn", data_dict, props.main_id);
  }
  async function _addColumn() {
    let add_in_all = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    try {
      let title = add_in_all ? "Create Column All Documents" : "Create Column This Document";
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: title,
        field_title: "New Column Name",
        default_value: "newcol",
        existing_names: mState.table_spec.column_names,
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      let cwidth = (0, _blueprint_table.compute_added_column_width)(new_name);
      _updateTableSpec({
        column_names: [...mState.table_spec.column_names, new_name],
        column_widths: [...mState.table_spec.column_widths, cwidth]
      }, false);
      const data_dict = {
        "column_name": new_name,
        "doc_name": mState.table_spec.current_doc_name,
        "column_width": cwidth,
        "all_docs": add_in_all
      };
      _broadcast_event_to_server("CreateColumn", data_dict);
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error adding column`, e);
      }
      return;
    }
  }
  function _setStateFromDataObject(data, doc_name) {
    let func = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    mDispatch({
      type: "change_multiple_fields",
      newPartialState: {
        data_row_dict: data.data_row_dict,
        total_rows: data.total_rows,
        table_spec: {
          column_names: data.table_spec.header_list,
          column_widths: data.table_spec.column_widths,
          hidden_columns_list: data.table_spec.hidden_columns_list,
          cell_backgrounds: data.table_spec.cell_backgrounds,
          current_doc_name: doc_name
        }
      }
    });
    pushCallback(func);
  }
  const _initiateDataGrab = (0, _react.useCallback)(async row_index => {
    await _grabNewChunkWithRow(row_index);
  }, []);
  async function _grabNewChunkWithRow(row_index) {
    try {
      let data = await (0, _communication_react.postPromise)(props.main_id, "grab_chunk_by_row_index", {
        doc_name: mState.table_spec.current_doc_name,
        row_index: row_index
      }, props.main_id);
      mDispatch({
        type: "update_data_row_dict",
        new_data_row_dict: data.data_row_dict
      });
    } catch (e) {
      errorDrawerFuncs.addFromError("Error grabbing data chunk", e);
    }
  }
  async function _removeCollection() {
    try {
      const result_dict = {
        "new_collection_name": null,
        "main_id": props.main_id
      };
      let data_object = await (0, _communication_react.postPromise)(props.main_id, "remove_collection_from_project", result_dict, props.main_id);
      let table_spec = {
        current_doc_name: ""
      };
      mDispatch({
        type: "change_multiple_fields",
        newPartialState: {
          doc_names: [],
          table_is_shrunk: true,
          short_collection_name: data_object.short_collection_name,
          doc_type: "none",
          table_spec: table_spec
        }
      });
    } catch (e) {
      errorDrawerFuncs.addFromError("Error removing collection", e);
    }
  }
  async function _changeCollection() {
    try {
      statusFuncs.startSpinner();
      let data = await (0, _communication_react.postPromise)("host", "get_collection_names", {
        "user_id": user_id
      }, props.main_id);
      let new_collection_name = await dialogFuncs.showModalPromise("SelectDialog", {
        title: "Select New Collection",
        select_label: "New Collection",
        cancel_text: "Cancel",
        submit_text: "Submit",
        option_list: data.collection_names,
        handleClose: dialogFuncs.hideModal
      });
      const result_dict = {
        "new_collection_name": new_collection_name,
        "main_id": props.main_id
      };
      let data_object = await (0, _communication_react.postPromise)(props.main_id, "change_collection", result_dict, props.main_id);
      if (!window.in_context && !_cProp("is_project")) document.title = new_collection_name;
      window._collection_name = data_object.collection_name;
      let table_spec;
      if (data_object.doc_type == "table") {
        table_spec = {
          column_names: data_object.table_spec.header_list,
          column_widths: data_object.table_spec.column_widths,
          cell_backgrounds: data_object.table_spec.cell_backgrounds,
          hidden_columns_list: data_object.table_spec.hidden_columns_list,
          current_doc_name: data_object.doc_names[0]
        };
      } else if (data_object.doc_type == "freeform") {
        table_spec = {
          current_doc_name: data_object.doc_names[0]
        };
      } else {
        table_spec = {
          current_doc_name: ""
        };
      }
      mDispatch({
        type: "change_multiple_fields",
        newPartialState: {
          doc_names: data_object.doc_names,
          table_is_shrunk: data_object.doc_type == "none",
          short_collection_name: data_object.short_collection_name,
          doc_type: data_object.doc_type,
          table_spec: table_spec
        }
      });
      pushCallback(() => {
        _handleChangeDoc(data_object.doc_names[0]);
      });
      statusFuncs.clearStatusMessage();
      statusFuncs.stopSpinner();
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error changing collection`, e);
      }
      statusFuncs.clearStatusMessage();
      statusFuncs.stopSpinner();
    }
  }
  function _updateDocList(doc_names, visible_doc) {
    _setMainStateValue("doc_names", doc_names);
    pushCallback(async () => {
      await _handleChangeDoc(visible_doc);
    });
  }
  function showMetadata() {
    _setMainStateValue("show_metadata", true);
  }
  function hideMetadata() {
    _setMainStateValue("show_metadata", false);
  }
  function _setProjectName(new_project_name) {
    let callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.controlled) {
      props.updatePanel({
        res_type: "project",
        title: new_project_name,
        panel: {
          resource_name: new_project_name,
          is_project: true
        }
      });
      pushCallback(() => {
        pushCallback(callback);
      });
    } else {
      mDispatch({
        type: "change_multiple_fields",
        newPartialState: {
          resource_name: new_project_name,
          is_project: true
        }
      });
      pushCallback(callback);
    }
  }
  let my_props = {
    ...props
  };
  if (!props.controlled) {
    my_props.is_project = mState.is_project;
    my_props.resource_name = mState.resource_name;
  }
  let disabled_column_items = [];
  if (mState.selected_column == null) {
    disabled_column_items = ["Shift Left", "Shift Right", "Hide", "Hide in All Docs", "Delete Column", "Delete Column In All Docs"];
  }
  let disabled_row_items = [];
  if (mState.selected_row == null) {
    disabled_row_items = ["Delete Row", "Insert Row Before", "Insert Row After", "Duplicate Row"];
  }
  let project_name = my_props.is_project ? props.resource_name : "";
  let disabled_project_items = [];
  if (!my_props.is_project) {
    disabled_project_items.push("Save");
  }
  if (mState.doc_type == "none") {
    disabled_project_items.push("Export Table as Collection");
    disabled_project_items.push("Remove Collection");
  }
  let menus = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_main_menus_react.ProjectMenu, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    setProjectName: _setProjectName,
    console_items: console_items_ref.current,
    tile_list: tile_list_ref.current,
    mState: mState,
    setMainStateValue: _setMainStateValue,
    updateLastSave: _updateLastSave,
    changeCollection: _changeCollection,
    removeCollection: _removeCollection,
    disabled_items: disabled_project_items,
    hidden_items: ["Export as Jupyter Notebook"]
  }), mState.doc_type != "none" && /*#__PURE__*/_react.default.createElement(_main_menus_react.DocumentMenu, {
    main_id: props.main_id,
    documentNames: mState.doc_names,
    currentDoc: mState.table_spec.current_doc_name
  }), !isFreeform() && mState.doc_type != "none" && /*#__PURE__*/_react.default.createElement(_main_menus_react.ColumnMenu, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    moveColumn: _moveColumn,
    table_spec: mState.table_spec,
    filtered_column_names: _filteredColumnNames(),
    selected_column: mState.selected_column,
    disabled_items: disabled_column_items,
    hideColumn: _hideColumn,
    hideInAll: _hideColumnInAll,
    unhideAllColumns: _unhideAllColumns,
    addColumn: _addColumn,
    deleteColumn: _deleteColumn
  }), !isFreeform() && mState.doc_type != "none" && /*#__PURE__*/_react.default.createElement(_main_menus_react.RowMenu, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    deleteRow: _deleteRow,
    insertRowBefore: async () => {
      await _insertRow(mState.selected_row);
    },
    insertRowAfter: async () => {
      await _insertRow(mState.selected_row + 1);
    },
    duplicateRow: _duplicateRow,
    selected_row: mState.selected_row,
    disabled_items: disabled_row_items
  }), /*#__PURE__*/_react.default.createElement(_main_menus_react.ViewMenu, {
    main_id: props.main_id,
    project_name: project_name,
    is_notebook: props.is_notebook,
    is_juptyer: props.is_jupyter,
    table_is_shrunk: mState.table_is_shrunk,
    toggleTableShrink: mState.doc_type == "none" ? null : _toggleTableShrink,
    show_exports_pane: mState.show_exports_pane,
    show_console_pane: mState.show_console_pane,
    show_metadata: mState.show_metadata,
    setMainStateValue: _setMainStateValue
  }), /*#__PURE__*/_react.default.createElement(_core.NavbarDivider, null), create_tile_menus());
  let card_body;
  let card_header;
  if (mState.doc_type != "none") {
    card_header = /*#__PURE__*/_react.default.createElement(_table_react.MainTableCardHeader, {
      main_id: props.main_id,
      toggleShrink: mState.doc_type == "none" ? null : _toggleTableShrink,
      mState: mState,
      setMainStateValue: _setMainStateValue,
      handleChangeDoc: _handleChangeDoc,
      handleSearchFieldChange: _handleSearchFieldChange,
      show_filter_button: !isFreeform(),
      handleSpreadsheetModeChange: _handleSpreadsheetModeChange,
      handleSoftWrapChange: _handleSoftWrapChange,
      is_freeform: isFreeform()
    });
    if (isFreeform()) {
      card_body = /*#__PURE__*/_react.default.createElement(_table_react.FreeformBody, {
        main_id: props.main_id,
        mState: mState,
        setMainStateValue: _setMainStateValue
      });
    } else {
      card_body = /*#__PURE__*/_react.default.createElement(_blueprint_table.BlueprintTable, {
        main_id: props.main_id,
        clearScroll: _clearTableScroll,
        initiateDataGrab: _initiateDataGrab,
        setCellContent: _setCellContent,
        filtered_column_names: _filteredColumnNames(),
        moveColumn: _moveColumn,
        updateTableSpec: _updateTableSpec,
        setMainStateValue: _setMainStateValue,
        mState: mState,
        set_scroll: set_table_scroll
      });
    }
  }
  let tile_pane = /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement(_tile_react.TileContainer, {
    main_id: props.main_id,
    tsocket: props.tsocket,
    tile_list: tile_list_ref,
    current_doc_name: mState.table_spec.current_doc_name,
    selected_row: mState.selected_row,
    table_is_shrunk: mState.table_is_shrunk,
    broadcast_event: _broadcast_event_to_server,
    goToModule: props.goToModule,
    tileDispatch: tileDispatch,
    setMainStateValue: _setMainStateValue
  }));
  let exports_pane;
  if (mState.show_exports_pane) {
    exports_pane = /*#__PURE__*/_react.default.createElement(_export_viewer_react.ExportsViewer, {
      main_id: props.main_id,
      tsocket: props.tsocket,
      setUpdate: ufunc => {
        updateExportsList.current = ufunc;
      },
      setMainStateValue: _setMainStateValue,
      console_is_shrunk: mState.console_is_shrunk,
      console_is_zoomed: mState.console_is_zoomed
    });
  } else {
    exports_pane = /*#__PURE__*/_react.default.createElement("div", null);
  }
  let console_pane;
  if (mState.show_console_pane) {
    console_pane = /*#__PURE__*/_react.default.createElement(_console_component.ConsoleComponent, {
      main_id: props.main_id,
      tsocket: props.tsocket,
      handleCreateViewer: props.handleCreateViewer,
      controlled: props.controlled,
      console_items: console_items_ref,
      console_selected_items_ref: console_selected_items_ref,
      set_console_selected_items: set_console_selected_items,
      dispatch: dispatch,
      mState: mState,
      setMainStateValue: _setMainStateValue,
      zoomable: true,
      shrinkable: true,
      style: null
    });
  } else {
    console_pane = /*#__PURE__*/_react.default.createElement("div", {
      style: {
        width: "100%"
      }
    });
  }
  let outer_hp_style = null;
  if (mState.console_is_shrunk) {
    outer_hp_style = {
      marginTop: TABLE_CONSOLE_GAP
    };
  }
  let bottom_pane = /*#__PURE__*/_react.default.createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: console_pane,
    right_pane: exports_pane,
    show_handle: true,
    fixed_height: mState.console_is_shrunk,
    initial_width_fraction: mState.console_width_fraction,
    dragIconSize: 15,
    outer_style: outer_hp_style,
    handleSplitUpdate: _handleConsoleFractionChange
  });
  let table_pane;
  if (mState.doc_type != "none") {
    table_pane = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      ref: table_container_ref
    }, /*#__PURE__*/_react.default.createElement(_table_react.MainTableCard, {
      card_body: card_body,
      card_header: card_header
    })));
  }
  let top_pane;
  if (mState.table_is_shrunk) {
    top_pane = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
      style: {
        paddingLeft: 10
      }
    }, tile_pane), mState.console_is_shrunk && bottom_pane);
  } else {
    top_pane = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_resizing_layouts.HorizontalPanes, {
      left_pane: table_pane,
      right_pane: tile_pane,
      show_handle: true,
      scrollAdjustSelectors: [".bp5-table-quadrant-scroll-container", ".tile-div"],
      initial_width_fraction: mState.horizontal_fraction,
      dragIconSize: 15,
      handleSplitUpdate: _handleHorizontalFractionChange,
      handleResizeStart: _handleResizeStart,
      handleResizeEnd: _handleResizeEnd
    }));
  }
  let extra_menubar_buttons = [];
  if (mState.doc_type != "none") {
    extra_menubar_buttons = [{
      onClick: _toggleTableShrink,
      icon: mState.table_is_shrunk ? "th" : "th-disconnect"
    }];
  }
  return /*#__PURE__*/_react.default.createElement(_error_boundary.ErrorBoundary, null, !window.in_context && /*#__PURE__*/_react.default.createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    user_name: window.username,
    menus: null,
    page_id: props.main_id
  }), /*#__PURE__*/_react.default.createElement(_menu_utilities.TacticMenubar, {
    connection_status: connection_status,
    menus: menus,
    showRefresh: true,
    showClose: true,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: _cProp("resource_name"),
    showIconBar: true,
    showErrorDrawerButton: true,
    showMetadataDrawerButton: true,
    showAssistantDrawerButton: true,
    showSettingsDrawerButton: true,
    showMetadata: showMetadata,
    extraButtons: extra_menubar_buttons
  }), /*#__PURE__*/_react.default.createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react.default.createElement("div", {
    className: `main-outer ${settingsContext.isDark() ? "bp5-dark" : "light-theme"}`,
    ref: main_outer_ref,
    style: {
      width: "100%",
      height: usable_height
    }
  }, mState.console_is_zoomed && /*#__PURE__*/_react.default.createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      availableWidth: usable_width,
      availableHeight: usable_height - BOTTOM_MARGIN,
      topX: topX,
      topY: topY
    }
  }, /*#__PURE__*/_react.default.createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: console_pane,
    right_pane: exports_pane,
    show_handle: true,
    fixed_height: mState.console_is_shrunk,
    initial_width_fraction: mState.console_width_fraction,
    dragIconSize: 15,
    outer_style: outer_hp_style,
    handleSplitUpdate: _handleConsoleFractionChange
  })), !mState.console_is_zoomed && mState.console_is_shrunk && /*#__PURE__*/_react.default.createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      availableWidth: usable_width,
      availableHeight: usable_height - CONSOLE_HEADER_HEIGHT - BOTTOM_MARGIN - 20,
      topX: topX,
      topY: topY
    }
  }, top_pane, /*#__PURE__*/_react.default.createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      topX: topX,
      topY: topY,
      availableWidth: usable_width,
      availableHeight: CONSOLE_HEADER_HEIGHT
    }
  }, bottom_pane)), !mState.console_is_zoomed && !mState.console_is_shrunk && /*#__PURE__*/_react.default.createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      availableWidth: usable_width,
      availableHeight: usable_height - BOTTOM_MARGIN,
      topX: topX,
      topY: topY
    }
  }, /*#__PURE__*/_react.default.createElement(_resizing_layouts.VerticalPanes, {
    top_pane: top_pane,
    bottom_pane: bottom_pane,
    show_handle: true,
    initial_height_fraction: mState.height_fraction,
    dragIconSize: 15,
    scrollAdjustSelectors: [".bp5-table-quadrant-scroll-container", ".tile-div"],
    handleSplitUpdate: _handleVerticalSplitUpdate,
    handleResizeStart: _handleResizeStart,
    handleResizeEnd: _handleResizeEnd,
    overflow: "hidden"
  }))), /*#__PURE__*/_react.default.createElement(_metadata_drawer.MetadataDrawer, {
    res_type: "project",
    res_name: _cProp("resource_name"),
    readOnly: false,
    is_repository: false,
    show_drawer: mState.show_metadata,
    position: "right",
    onClose: hideMetadata,
    size: "45%"
  })));
}
exports.MainApp = MainApp = /*#__PURE__*/(0, _react.memo)(MainApp);
function main_main() {
  function gotProps(the_props) {
    let MainAppPlus = (0, _pool_tree.withPool)((0, _sizing_tools.withSizeContext)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(MainApp)))))));
    let the_element = /*#__PURE__*/_react.default.createElement(MainAppPlus, (0, _extends2.default)({}, the_props, {
      controlled: false,
      changeName: null
    }));
    const domContainer = document.querySelector('#main-root');
    const root = (0, _client.createRoot)(domContainer);
    root.render(
    // <HotkeysProvider>
    the_element
    // </HotkeysProvider>
    );
  }
  (0, _utilities_react.renderSpinnerMessage)("Starting up ...");
  let target;
  if (window.project_name == "") {
    if (window.collection_name == "") {
      target = "new_project_in_context";
    } else {
      target = "main_collection_in_context";
    }
  } else {
    target = "main_project_in_context";
  }
  const resource_name = window.project_name == "" ? window.collection_name : window.project_name;
  (0, _communication_react.postAjaxPromise)(target, {
    "resource_name": resource_name
  }).then(data => {
    (0, _main_support.main_props)(data, null, gotProps, null);
  });
}
if (!window.in_context) {
  main_main();
}