"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdminPane = AdminPane;
var _react = _interopRequireWildcard(require("react"));
var _table = require("@blueprintjs/table");
var _library_widgets = require("./library_widgets");
var _resizing_allotment = require("./resizing_allotment");
var _utilities_react = require("./utilities_react");
var _communication_react = require("./communication_react");
var _lodash = _interopRequireDefault(require("lodash"));
var _searchable_console = require("./searchable_console");
var _error_drawer = require("./error_drawer");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function AdminPane(props) {
  props = {
    is_repository: false,
    tsocket: null,
    extraControls: null,
    ...props
  };
  const table_ref = (0, _react.useRef)(null);
  const console_text_ref = (0, _react.useRef)(null);
  const previous_search_spec = (0, _react.useRef)(null);
  const get_task = `grab_${props.res_type}_list_chunk_task`;
  const [, set_data_dict, data_dict_ref] = (0, _utilities_react.useStateAndRef)({});
  const [num_rows, set_num_rows] = (0, _react.useState)(0);
  const [awaiting_data, set_awaiting_data] = (0, _react.useState)(false);
  const [, set_total_width] = (0, _react.useState)(500);
  const pushCallback = (0, _utilities_react.useCallbackStack)();
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  (0, _react.useEffect)(() => {
    initSocket();
    _grabNewChunkWithRow(0, true, null, true).then(() => {});
  }, []);
  function initSocket() {
    if (props.tsocket != null) {
      props.tsocket.attachListener(`update-${props.res_type}-selector-row`, _handleRowUpdate);
      props.tsocket.attachListener(`refresh-${props.res_type}-selector`, _refresh_func);
    }
  }
  function _getSearchSpec() {
    return {
      search_string: props.search_string,
      sort_field: props.sort_field,
      sort_direction: props.sort_direction
    };
  }
  async function _onTableSelection(regions) {
    if (regions.length == 0) return; // Without this get an error when clicking on a body cell
    let selected_rows = [];
    let revised_regions = [];
    for (let region of regions) {
      if (region.hasOwnProperty("rows")) {
        let first_row = region["rows"][0];
        revised_regions.push(_table.Regions.row(first_row));
        let last_row = region["rows"][1];
        for (let i = first_row; i <= last_row; ++i) {
          selected_rows.push(data_dict_ref.current[i]);
          revised_regions.push(_table.Regions.row(i));
        }
      }
    }
    await _handleRowSelection(selected_rows);
    _updatePaneState({
      selectedRegions: revised_regions
    });
  }
  async function _grabNewChunkWithRow(row_index, flush = false, spec_update = null, select = false, callback = null) {
    try {
      let search_spec = _getSearchSpec();
      if (spec_update) {
        search_spec = Object.assign(search_spec, spec_update);
      }
      let query = {
        search_spec: search_spec,
        row_number: row_index
      };
      let data = await (0, _communication_react.postPromise)("host", get_task, query);
      let new_data_dict;
      if (flush) {
        new_data_dict = data.chunk_dict;
      } else {
        new_data_dict = _lodash.default.cloneDeep(data_dict_ref.current);
        new_data_dict = Object.assign(new_data_dict, data.chunk_dict);
      }
      previous_search_spec.current = search_spec;
      set_data_dict(new_data_dict);
      set_num_rows(data.num_rows);
      pushCallback(() => {
        if (callback) {
          callback();
        } else if (select) {
          _selectRow(row_index);
        }
      });
    } catch (e) {
      errorDrawerFuncs.addFromError("Error grabbing row chunk", e);
    }
  }
  function _grabNewChunkWithRowPromise(row_index, flush = false, spec_update = null, select = false) {
    return new Promise(async resolve => {
      await _grabNewChunkWithRow(row_index, flush, spec_update, select, resolve);
    });
  }
  function _initiateDataGrab(row_index) {
    set_awaiting_data(true);
    pushCallback(async () => {
      await _grabNewChunkWithRow(row_index);
    });
  }
  function _handleRowUpdate(res_dict) {
    let res_idval = res_dict.Id;
    let ind = get_data_dict_index(res_idval);
    let new_data_dict = _lodash.default.cloneDeep(data_dict_ref.current);
    let the_row = new_data_dict[ind];
    for (let field in res_dict) {
      the_row[field] = res_dict[field];
    }
    if (res_name == props.selected_resource.name) {
      props.updatePaneState({
        "selected_resource": the_row
      });
    }
    set_data_dict(new_data_dict);
  }
  function _updatePaneState(new_state, callback) {
    props.updatePaneState(props.res_type, new_state, callback);
  }
  async function _updatePaneStatePromise(new_state) {
    await props.updatePaneStatePromise(props.res_type, new_state);
  }
  function get_data_dict_index(idval) {
    for (let index in data_dict_ref.current) {
      if (data_dict_ref.current[index].Id == idval) {
        return index;
      }
    }
    return null;
  }
  function _delete_row(idval) {
    let ind = get_data_dict_index(idval);
    let new_data_dict = {
      ...data_dict_ref.current
    };
    delete new_data_dict[ind];
    set_data_dict(new_data_dict);
  }
  function _handleSplitResize(left_width, right_width, width_fraction) {
    _updatePaneState({
      left_width_fraction: width_fraction
    });
  }
  async function _handleRowClick(row_dict) {
    await _updatePaneStatePromise({
      selected_resource: row_dict,
      multi_select: false,
      list_of_selected: [row_dict[props.id_field]]
    });
  }
  async function _handleRowSelection(selected_rows) {
    let row_dict = selected_rows[0];
    await _handleRowClick(row_dict);
  }
  async function _update_search_state(new_state) {
    await _updatePaneStatePromise(new_state);
    if (search_spec_changed(new_state)) {
      await _grabNewChunkWithRow(0, true, new_state, true);
    }
  }
  function search_spec_changed(new_spec) {
    if (!previous_search_spec.current) {
      return true;
    }
    for (let key in previous_search_spec.current) {
      if (new_spec.hasOwnProperty(key)) {
        // noinspection TypeScriptValidateTypes
        if (new_spec[key] != previous_search_spec.current[key]) {
          return true;
        }
      }
    }
    return false;
  }
  async function _set_sort_state(column_name, sort_field, direction) {
    let spec_update = {
      sort_field: column_name,
      sort_direction: direction
    };
    await _updatePaneState(spec_update);
    if (search_spec_changed(spec_update)) {
      await _grabNewChunkWithRow(0, true, spec_update, true);
    }
  }
  async function _selectRow(new_index) {
    if (!Object.keys(data_dict_ref.current).includes(String(new_index))) {
      await _grabNewChunkWithRowPromise(new_index, false, null, false);
      await _selectRow(new_index);
    } else {
      let new_regions = [_table.Regions.row(new_index)];
      _updatePaneState({
        selected_resource: data_dict_ref.current[new_index],
        list_of_selected: [data_dict_ref.current[new_index].name],
        selectedRegions: new_regions
      });
    }
  }
  async function _refresh_func(callback = null) {
    await _grabNewChunkWithRow(0, true, null, true, callback);
  }
  async function _setConsoleText(the_text) {
    await _updatePaneStatePromise({
      "console_text": the_text
    });
    if (console_text_ref && console_text_ref.current) {
      console_text_ref.current.scrollTop = console_text_ref.current.scrollHeight;
    }
  }
  function _communicateColumnWidthSum(total_width) {
    set_total_width(total_width + 50);
  }
  const primary_mdata_fields = ["name", "created", "created_for_sort", "updated", "updated_for_sort", "tags", "notes"];
  let additional_metadata = {};
  for (let field in props.selected_resource) {
    if (!primary_mdata_fields.includes(field)) {
      additional_metadata[field] = props.selected_resource[field];
    }
  }
  if (Object.keys(additional_metadata).length == 0) {
    additional_metadata = null;
  }
  let right_pane;
  if (props.res_type == "container") {
    right_pane = /*#__PURE__*/_react.default.createElement("div", {
      className: "d-flex d-inline",
      ref: console_text_ref,
      style: {
        height: "100%",
        overflow: "hidden",
        marginRight: 10,
        position: "relative"
      }
    }, /*#__PURE__*/_react.default.createElement(_searchable_console.SearchableConsole, {
      local_id: window.global_id,
      container_id: props.selected_resource.Id,
      ref: null,
      outer_style: {
        padding: 20
      },
      showCommandField: true
    }));
  } else {
    right_pane = /*#__PURE__*/_react.default.createElement("div", null);
  }
  let MenubarClass = props.MenubarClass;
  let left_pane = /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      "maxHeight": "100%",
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    ref: table_ref,
    style: {
      //flex: "1 1 0",
      minWidth: 0,
      overflowY: "auto",
      marginTop: 15,
      padding: 5,
      marginBottom: 15,
      display: "flex",
      flexDirection: "column"
    }
  }, /*#__PURE__*/_react.default.createElement(_library_widgets.SearchForm, {
    allow_search_inside: false,
    allow_search_metadata: false,
    update_search_state: _update_search_state,
    search_string: props.search_string
  }), /*#__PURE__*/_react.default.createElement(_library_widgets.BpSelectorTable, {
    data_dict: data_dict_ref.current,
    num_rows: num_rows,
    awaiting_data: awaiting_data,
    enableColumnResizing: true,
    sortColumn: _set_sort_state,
    selectedRegions: props.selectedRegions,
    communicateColumnWidthSum: _communicateColumnWidthSum,
    onSelection: _onTableSelection,
    initiateDataGrab: _initiateDataGrab,
    columns: props.columns,
    identifier_field: props.id_field
  })), props.extraControls && props.extraControls));
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(MenubarClass, {
    selected_resource: props.selected_resource,
    list_of_selected: props.list_of_selected,
    setConsoleText: _setConsoleText,
    delete_row: _delete_row,
    refresh_func: _refresh_func
  }), /*#__PURE__*/_react.default.createElement("div", {
    className: "admin-pane",
    style: {
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
      width: "100%",
      marginLeft: 15,
      marginTop: 0,
      position: "relative"
    }
  }, /*#__PURE__*/_react.default.createElement(_resizing_allotment.HorizontalPanes, {
    left_pane: left_pane,
    right_pane: right_pane,
    show_handle: true,
    initial_width_fraction: .65,
    handleSplitUpdate: _handleSplitResize
  })));
}
exports.AdminPane = AdminPane = /*#__PURE__*/(0, _react.memo)(AdminPane);