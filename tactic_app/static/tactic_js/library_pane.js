"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibraryPane = LibraryPane;
exports.res_types = void 0;
exports.view_views = view_views;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _popover = require("@blueprintjs/popover2");
var _table = require("@blueprintjs/table");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _resizing_layouts = require("./resizing_layouts2");
var _communication_react = require("./communication_react");
var _sizing_tools = require("./sizing_tools");
var _toaster = require("./toaster");
var _utilities_react = require("./utilities_react");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
var _error_drawer = require("./error_drawer");
var _library_table_pane = require("./library_table_pane");
var _library_pane_reducer = require("./library_pane_reducer");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// noinspection JSValidateTypes,JSDeprecatedSymbols

const res_types = exports.res_types = ["collection", "project", "tile", "list", "code"];
function view_views() {
  let is_repository = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  if (is_repository) {
    return {
      collection: null,
      project: null,
      tile: "/repository_view_module/",
      list: "/repository_view_list/",
      code: "/repository_view_code/"
    };
  } else {
    return {
      collection: "/main_collection/",
      project: "/main_project/",
      tile: "/last_saved_view/",
      list: "/view_list/",
      code: "/view_code/"
    };
  }
}
function duplicate_views() {
  let is_repository = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  return {
    collection: "/duplicate_collection",
    project: "/duplicate_project",
    tile: "/create_duplicate_tile",
    list: "/create_duplicate_list",
    code: "/create_duplicate_code"
  };
}
function BodyMenu(props) {
  function getIntent(item) {
    return item.intent ? item.intent : null;
  }
  let menu_items = props.items.map((item, index) => {
    if (item.text == "__divider__") {
      return /*#__PURE__*/_react.default.createElement(_core.MenuDivider, {
        key: index
      });
    } else {
      let the_row = props.selected_rows[0];
      let disabled = item.res_type && the_row.res_type != item.res_type;
      return /*#__PURE__*/_react.default.createElement(_core.MenuItem, {
        icon: item.icon,
        disabled: disabled,
        onClick: () => item.onClick(the_row),
        intent: getIntent(item),
        key: item.text,
        text: item.text
      });
    }
  });
  return /*#__PURE__*/_react.default.createElement(_core.Menu, null, /*#__PURE__*/_react.default.createElement(_core.MenuDivider, {
    title: props.selected_rows[0].name,
    className: "context-menu-header"
  }), menu_items);
}
const metadata_outer_style = {
  marginTop: 0,
  marginLeft: 5,
  overflow: "auto",
  padding: 25,
  marginRight: 0,
  height: "100%"
};
const initial_state = {
  data_dict: {},
  num_rows: 0,
  tag_list: [],
  contextMenuItems: [],
  select_state: {
    selected_resource: {
      "name": "",
      "_id": "",
      "tags": "",
      "notes": "",
      "updated": "",
      "created": ""
    },
    selected_rows: [],
    multi_select: false,
    list_of_selected: [],
    selectedRegions: [_table.Regions.row(0)]
  },
  search_state: {
    sort_field: "updated",
    sort_direction: "descending",
    expanded_tags: [],
    active_tag: "all",
    tagRoot: "all",
    search_string: "",
    search_inside: false,
    search_metadata: false,
    filterType: "all",
    show_hidden: false
  },
  rowChanged: 0
};
function LibraryPane(props) {
  props = {
    columns: {
      "name": {
        "first_sort": "ascending"
      },
      "created": {
        "first_sort": "descending"
      },
      "updated": {
        "first_sort": "ascending"
      },
      "tags": {
        "first_sort": "ascending"
      }
    },
    is_repository: false,
    tsocket: null,
    ...props
  };
  const [pState, pDispatch, pStateRef] = (0, _utilities_react.useImmerReducerAndRef)(_library_pane_reducer.paneReducer, initial_state);
  const top_ref = (0, _react.useRef)(null);
  const previous_search_spec = (0, _react.useRef)(null);
  const socket_counter = (0, _react.useRef)(null);
  const blank_selected_resource = (0, _react.useRef)({});
  const selectedTypeRef = (0, _react.useRef)(null);
  const [usable_width, usable_height, topX, topY] = (0, _sizing_tools.useSize)(top_ref, 0, "LibraryPane");
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  const dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  const statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  const errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  const _handleArrowKeyPress = (0, _react.useCallback)(async key => {
    if (pStateRef.current.select_state.multi_select) return;
    let the_res = pStateRef.current.select_state.selected_resource;
    let current_index = parseInt((0, _library_pane_reducer.get_index)(the_res.name, the_res.res_type, pStateRef.current.data_dict));
    let new_index;
    let new_selected_res;
    if (key == "ArrowDown") {
      new_index = current_index + 1;
    } else {
      new_index = current_index - 1;
      if (new_index < 0) return;
    }
    await _selectRow(new_index);
  }, [pStateRef.current.select_state.multi_select, pStateRef.current.select_state.selected_resource, pStateRef.current.data_dict]);
  const _view_func = (0, _react.useCallback)(async function () {
    let the_view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (the_view == null) {
      the_view = view_views(props.is_repository)[pStateRef.current.select_state.selected_resource.res_type];
    }
    statusFuncs.setStatus({
      show_spinner: true,
      status_message: "Opening ..."
    });
    if (window.in_context) {
      const re = new RegExp("/$");
      the_view = the_view.replace(re, "_in_context");
      let data;
      try {
        data = await (0, _communication_react.postAjaxPromise)(the_view, {
          context_id: context_id,
          resource_name: pStateRef.current.select_state.selected_resource.name
        });
        props.handleCreateViewer(data, statusFuncs.clearStatus);
      } catch (e) {
        statusFuncs.clearstatus();
        errorDrawerFuncs.addFromError(`Error viewing with view ${the_view}`, e);
      }
    } else {
      statusFuncs.clearStatus();
      window.open($SCRIPT_ROOT + the_view + pStateRef.current.select_state.selected_resource.name);
    }
  }, [pStateRef.current.select_state.selected_resource]);
  async function _unsearch() {
    if (pStateRef.current.search_state.search_string != "") {
      _update_search_state({
        search_string: ""
      });
    } else if (pStateRef.current.search_state.active_tag != "all") {
      _update_search_state({
        active_tag: "all"
      });
    } else if (props.pane_type == "all" && pStateRef.current.search_state.filterType != "all") {
      await _setFilterType("all");
    }
  }
  const hotkeys = (0, _react.useMemo)(() => [{
    combo: "Enter",
    global: false,
    group: "Library",
    label: "Open Selected Resource",
    onKeyDown: async () => {
      await _view_func();
    }
  }, {
    combo: "ArrowDown",
    global: false,
    group: "Library",
    label: "Move Selection Down",
    onKeyDown: async () => {
      await _handleArrowKeyPress("ArrowDown");
    }
  }, {
    combo: "ArrowUp",
    global: false,
    group: "Library",
    label: "Move Selection Up",
    onKeyDown: async () => {
      await _handleArrowKeyPress("ArrowUp");
    }
  }, {
    combo: "Escape",
    global: false,
    group: "Library",
    label: "Undo Search",
    onKeyDown: _unsearch
  }], [_view_func, _handleArrowKeyPress, _unsearch]);
  const {
    handleKeyDown,
    handleKeyUp
  } = (0, _core.useHotkeys)(hotkeys);
  (0, _utilities_react.useConstructor)(() => {
    for (let col in props.columns) {
      blank_selected_resource.current[col] = "";
    }
  });
  (0, _react.useEffect)(() => {
    initSocket();
    _grabNewChunkWithRow(0).then(() => {});
  }, []);
  const pushCallback = (0, _utilities_react.useCallbackStack)("library_home");
  function initSocket() {
    if (props.tsocket != null && !props.is_repository) {
      props.tsocket.attachListener(`update-selector-row`, _handleRowUpdate);
      props.tsocket.attachListener(`refresh-selector`, _refresh_func);
    } else if (props.tsocket != null && props.is_repository) {
      props.tsocket.attachListener(`update-repository-selector-row`, _handleRowUpdate);
      props.tsocket.attachListener(`refresh-repository-selector`, _refresh_func);
    }
  }
  function _getSearchSpec() {
    return pStateRef.current.search_state;
  }
  function _renderBodyContextMenu(menu_context) {
    if (event) {
      event.preventDefault();
    }
    let regions = menu_context.regions;
    if (regions.length == 0) return null; // Without this get an error when clicking on a body cell
    let selected_rows = [];
    for (let region of regions) {
      if (region.hasOwnProperty("rows")) {
        let first_row = region["rows"][0];
        let last_row = region["rows"][1];
        for (let i = first_row; i <= last_row; ++i) {
          if (!selected_rows.includes(i)) {
            selected_rows.push(pStateRef.current.data_dict[i]);
          }
        }
      }
    }
    return /*#__PURE__*/_react.default.createElement(BodyMenu, {
      items: pStateRef.current.contextMenuItems,
      selected_rows: selected_rows
    });
  }
  async function _setFilterType(rtype) {
    if (rtype == pStateRef.current.search_state.filterType) return;
    if (!pStateRef.current.search_state.multi_select) {
      let sres = pStateRef.current.select_state.selected_resource;
      if (sres.name != "" && sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes) {
        await _saveFromSelectedResource();
      }
    }
    pDispatch({
      type: "UPDATE_SEARCH_STATE",
      search_state: {
        filterType: rtype
      }
    });
    clearSelected();
    pushCallback(async () => {
      await _grabNewChunkWithRow(0, true, null, true);
    });
  }
  function clearSelected() {
    pDispatch({
      type: "CLEAR_SELECTED"
    });
  }
  async function _onTableSelection(regions) {
    if (regions.length == 0) return; // Without this get an error when clicking on a body cell
    let selected_rows = [];
    let selected_row_indices = [];
    let revised_regions = [];
    for (let region of regions) {
      if (region.hasOwnProperty("rows")) {
        let first_row = region["rows"][0];
        revised_regions.push(_table.Regions.row(first_row));
        let last_row = region["rows"][1];
        for (let i = first_row; i <= last_row; ++i) {
          if (!selected_row_indices.includes(i)) {
            selected_row_indices.push(i);
            selected_rows.push(pStateRef.current.data_dict[i]);
            revised_regions.push(_table.Regions.row(i));
          }
        }
      }
    }
    await _handleRowSelection(selected_rows);
    pDispatch({
      type: "UPDATE_SELECT_STATE",
      select_state: {
        selectedRegions: revised_regions
      }
    });
  }
  async function _grabNewChunkWithRow(row_index) {
    let flush = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    let spec_update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    let select = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    let select_by_name = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    let callback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    let search_spec = {
      ...pStateRef.current.search_state
    };
    if (search_spec.active_tag == "all") {
      search_spec.active_tag = null;
    }
    if (spec_update) {
      search_spec = Object.assign(search_spec, spec_update);
    }
    if (search_spec.active_tag && search_spec.active_tag[0] != "/") {
      search_spec.active_tag = "/" + search_spec.active_tag;
    }
    let args = {
      pane_type: pStateRef.current.search_state.filterType,
      search_spec: search_spec,
      row_number: row_index,
      is_repository: props.is_repository
    };
    let data;
    try {
      data = await (0, _communication_react.postAjaxPromise)("grab_all_list_chunk", args);
      let new_data_dict;
      if (flush) {
        pDispatch({
          type: "INIT_DATA_DICT",
          data_dict: data.chunk_dict,
          num_rows: data.num_rows
        });
      } else {
        pDispatch({
          type: "UPDATE_DATA_DICT",
          data_dict: data.chunk_dict,
          num_rows: data.num_rows
        });
      }
      previous_search_spec.current = search_spec;
      set_tag_list(data.all_tags);
      if (callback) {
        pushCallback(callback);
      } else if (select || pStateRef.current.select_state.selected_resource.name == "") {
        pushCallback(() => {
          _selectRow(row_index);
        });
      }
    } catch (e) {
      errorDrawerFuncs.addFromError("Error grabbing resource chunk", e);
    }
  }
  function set_tag_list(tag_list) {
    pDispatch({
      type: "SET_TAG_LIST",
      tag_list: tag_list
    });
  }
  async function _handleRowUpdate(res_dict) {
    let res_name = res_dict.name;
    let ind;
    let _id;
    let event_type = res_dict.event_type;
    delete res_dict.event_type;
    switch (event_type) {
      case "update":
        if ("_id" in res_dict) {
          _id = res_dict._id;
          ind = (0, _library_pane_reducer.get_index_from_id)(res_dict._id, pStateRef.current.data_dict);
        } else {
          ind = (0, _library_pane_reducer.get_index)(res_name, res_dict.res_type, pStateRef.current.data_dict);
          if (ind) {
            _id = pStateRef.current.data_dict[ind]._id;
          }
        }
        if (!ind) return;
        let the_row = {
          ...pStateRef.current.data_dict[ind],
          ...res_dict
        };
        pDispatch({
          type: "UPDATE_ROW",
          index: ind,
          res_dict: res_dict
        });
        if ("tags" in res_dict) {
          let data_dict = {
            pane_type: props.pane_type,
            is_repository: props.is_repository,
            show_hidden: pStateRef.current.search_state.show_hidden
          };
          let data = await (0, _communication_react.postAjaxPromise)("get_tag_list", data_dict);
          let all_tags = data.tag_list;
          set_tag_list(all_tags);
        }
        if (_id == pStateRef.current.select_state.selected_resource._id) {
          let the_row = {
            ...pStateRef.current.data_dict[ind],
            ...res_dict
          };
          pDispatch({
            type: "UPDATE_SELECT_STATE",
            select_state: {
              selected_resource: the_row
            }
          });
        }
        break;
      case "insert":
        await _grabNewChunkWithRow(0, true, null, false, res_name);
        break;
      case "delete":
        if ("_id" in res_dict) {
          ind = parseInt((0, _library_pane_reducer.get_index_from_id)(res_dict._id, pStateRef.current.data_dict));
        } else {
          ind = parseInt((0, _library_pane_reducer.get_index)(res_name, res_dict.res_type, pStateRef.current.data_dict));
        }
        let is_last = ind == pStateRef.current.data_dict.length - 1;
        let selected_ind = null;
        if ("_id" in pStateRef.current.select_state.selected_resource) {
          selected_ind = parseInt((0, _library_pane_reducer.get_index_from_id)(pStateRef.current.select_state.selected_resource._id, pStateRef.current.data_dict));
        }
        let is_selected_row = ind && ind == selected_ind;
        let new_selected_ind = selected_ind;
        if (selected_ind > ind) {
          new_selected_ind = selected_ind - 1;
        }
        pDispatch({
          type: "DELETE_ROW",
          index: ind
        });
        pushCallback(async () => {
          await _grabNewChunkWithRow(ind, false, null, false, null, () => {
            if (new_selected_ind) {
              _selectRow(new_selected_ind);
            } else {
              clearSelected();
            }
          });
        });
        break;
      default:
        return;
    }
  }
  function get_data_dict_entry(name, res_type) {
    for (let index in pStateRef.current.data_dict) {
      let the_row = pStateRef.current.data_dict[index];
      if (the_row.name == name && the_row.res_type == res_type) {
        return pStateRef.current.data_dict[index];
      }
    }
    return null;
  }
  function _extractNewTags(tstring) {
    let tlist = tstring.split(" ");
    let new_tags = [];
    for (let tag of tlist) {
      if (!(tag.length == 0) && !(tag in pStateRef.current.tag_list)) {
        new_tags.push(tag);
      }
    }
    return new_tags;
  }
  async function _saveFromSelectedResource() {
    // This will only be called when there is a single row selected
    const result_dict = {
      "res_type": pStateRef.current.select_state.selected_rows[0].res_type,
      "res_name": pStateRef.current.select_state.list_of_selected[0],
      "tags": pStateRef.current.select_state.selected_resource.tags,
      "notes": pStateRef.current.select_state.selected_resource.notes
    };
    if (pStateRef.current.select_state.selected_rows[0].res_type == "tile" && "icon" in pStateRef.current.select_state.selected_resource) {
      result_dict["icon"] = pStateRef.current.select_state.selected_resource["icon"];
    }
    let saved_selected_resource = Object.assign({}, pStateRef.current.select_state.selected_resource);
    let saved_selected_rows = [...pStateRef.current.select_state.selected_rows];
    let new_tags = _extractNewTags(pStateRef.current.select_state.selected_resource.tags);
    try {
      await (0, _communication_react.postAjaxPromise)("save_metadata", result_dict);
    } catch (e) {
      errorDrawerFuncs.addFromError(`Error updating resource ${result_dict.res_name}`, e);
    }
  }
  async function _overwriteCommonTags() {
    const result_dict = {
      "selected_rows": pStateRef.current.select_state.selected_rows,
      "tags": pStateRef.current.select_state.selected_resource.tags
    };
    let new_tags = _extractNewTags(pStateRef.current.select_state.selected_resource.tags);
    try {
      await (0, _communication_react.postAjaxPromise)("overwrite_common_tags", result_dict);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error overwriting tags", e);
    }
  }
  function set_selected_resource(new_resource) {
    pDispatch({
      type: "UPDATE_SELECT_STATE",
      select_state: {
        selected_resource: new_resource
      }
    });
  }
  function _handleMetadataChange(changed_state_elements) {
    if (!pStateRef.current.select_state.multi_select) {
      let revised_selected_resource = Object.assign({}, pStateRef.current.select_state.selected_resource);
      revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);
      if (Object.keys(changed_state_elements).includes("tags")) {
        revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");
        set_selected_resource(revised_selected_resource);
        pushCallback(_saveFromSelectedResource);
      } else {
        set_selected_resource(revised_selected_resource);
        pushCallback(_saveFromSelectedResource);
      }
    } else {
      let revised_selected_resource = Object.assign({}, pStateRef.current.select_state.selected_resource);
      revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);
      revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");
      set_selected_resource(revised_selected_resource);
      pushCallback(_overwriteCommonTags);
    }
  }
  function set_multi_select(new_val) {
    pDispatch({
      type: "UPDATE_SELECT_STATE",
      select_state: {
        multi_select: new_val
      }
    });
  }
  function _handleRowDoubleClick(row_dict) {
    let view_view = view_views(props.is_repository)[row_dict.res_type];
    if (view_view == null) return;
    statusFuncs.setStatus({
      show_spinner: true,
      status_message: "Opening ..."
    });
    pDispatch({
      type: "UPDATE_SELECT_STATE",
      select_state: {
        selected_resource: row_dict,
        multi_select: false,
        list_of_selected: [row_dict.name],
        selected_rows: [row_dict]
      }
    });
    pushCallback(async () => {
      if (window.in_context) {
        const re = new RegExp("/$");
        view_view = view_view.replace(re, "_in_context");
        let data;
        try {
          data = await (0, _communication_react.postAjaxPromise)(view_view, {
            context_id: context_id,
            resource_name: row_dict.name
          });
          props.handleCreateViewer(data, statusFuncs.clearStatus);
        } catch (e) {
          statusFuncs.clearStatus();
          errorDrawerFuncs.addFromError(`Error handling double click with view ${view_view}`, e);
        }
      } else {
        statusFuncs.clearStatus();
        window.open($SCRIPT_ROOT + view_view + row_dict.name);
      }
    });
  }
  function _selectedTypes() {
    let the_types = pStateRef.current.select_state.selected_rows.map(function (row) {
      return row.res_type;
    });
    the_types = [...new Set(the_types)];
    return the_types;
  }
  async function _handleRowSelection(selected_rows) {
    if (!pStateRef.current.select_state.multi_select) {
      let sres = pStateRef.current.select_state.selected_resource;
      if (sres.name != "" && get_data_dict_entry(sres.name, sres.res_type) && sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes) {
        await _saveFromSelectedResource();
      }
    }
    if (selected_rows.length > 1) {
      let common_tags = selected_rows[0].tags.split(" ");
      let other_rows = selected_rows.slice(1, selected_rows.length);
      for (let row_dict of other_rows) {
        let new_common_tags = [];
        let new_tag_list = row_dict.tags.split(" ");
        for (let tag of new_tag_list) {
          if (common_tags.includes(tag)) {
            new_common_tags.push(tag);
          }
        }
        common_tags = new_common_tags;
      }
      let multi_select_list = selected_rows.map(row_dict => row_dict.name);
      let new_selected_resource = {
        name: "__multiple__",
        tags: common_tags.join(" "),
        notes: ""
      };
      pDispatch({
        type: "UPDATE_SELECT_STATE",
        select_state: {
          selected_resource: new_selected_resource,
          multi_select: true,
          list_of_selected: multi_select_list,
          selected_rows: selected_rows
        }
      });
    } else {
      let row_dict = selected_rows[0];
      pDispatch({
        type: "UPDATE_SELECT_STATE",
        select_state: {
          selected_resource: row_dict,
          multi_select: false,
          list_of_selected: [row_dict.name],
          selected_rows: selected_rows
        }
      });
    }
  }
  function _filter_func(resource_dict, search_string) {
    try {
      return resource_dict.name.toLowerCase().search(search_string) != -1;
    } catch (e) {
      return false;
    }
  }
  function _update_search_state(new_state) {
    pDispatch({
      type: "UPDATE_SEARCH_STATE",
      search_state: new_state
    });
    pushCallback(async () => {
      if (search_spec_changed(new_state)) {
        clearSelected();
        await _grabNewChunkWithRow(0, true, new_state, true);
      }
    });
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
  function _set_sort_state(column_name, direction) {
    let spec_update = {
      sort_field: column_name,
      sort_direction: direction
    };
    _update_search_state(spec_update);
  }
  async function _selectRow(new_index) {
    if (!Object.keys(pStateRef.current.data_dict).includes(String(new_index))) {
      await _grabNewChunkWithRow(new_index, false, null, false, null, () => {
        _selectRow(new_index);
      });
    } else {
      pDispatch({
        type: "UPDATE_SELECT_STATE",
        select_state: {
          selected_resource: pStateRef.current.data_dict[new_index],
          multi_select: false,
          list_of_selected: [pStateRef.current.data_dict[new_index].name],
          selected_rows: [pStateRef.current.data_dict[new_index]],
          selectedRegions: [_table.Regions.row(new_index)]
        }
      });
    }
  }
  function _open_raw(selected_resource) {
    statusFuncs.clearStatus();
    if (selected_resource.type == "freeform") {
      window.open($SCRIPT_ROOT + "/open_raw/" + selected_resource.name);
    } else {
      statusFuncs.statusMessage("Only Freeform documents can be raw opened", 5);
    }
  }
  async function _view_resource(selected_resource) {
    let the_view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    let force_new_tab = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    let resource_name = selected_resource.name;
    if (the_view == null) {
      the_view = view_views(props.is_repository)[selected_resource.res_type];
    }
    statusFuncs.setStatus({
      show_spinner: true,
      status_message: "Opening ..."
    });
    if (window.in_context && !force_new_tab) {
      const re = new RegExp("/$");
      the_view = the_view.replace(re, "_in_context");
      try {
        let data = await (0, _communication_react.postAjaxPromise)(the_view, {
          context_id: context_id,
          resource_name: resource_name
        });
        props.handleCreateViewer(data, statusFuncs.clearStatus);
      } catch (e) {
        statusFuncs.clearstatus();
        errorDrawerFuncs.addFromError(`Error viewing resource ${resource_name}`, e);
      }
    } else {
      statusFuncs.clearStatus();
      window.open($SCRIPT_ROOT + the_view + resource_name);
    }
  }
  async function _duplicate_func() {
    let row = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    let the_row = row ? row : pStateRef.current.select_state.selected_resource;
    let res_name = the_row.name;
    let res_type = the_row.res_type;
    try {
      let data = await (0, _communication_react.postAjaxPromise)("get_resource_names/" + res_type, {});
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: `Duplicate ${res_type}`,
        field_title: "New Name",
        default_value: res_name,
        existing_names: data.resource_names,
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      let duplicate_view = duplicate_views()[res_type];
      const result_dict = {
        "new_res_name": new_name,
        "res_to_copy": res_name,
        "library_id": props.library_id,
        "is_repository": false
      };
      await (0, _communication_react.postAjaxPromise)(duplicate_view, result_dict);
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error duplicating resource ${res_name}`, e);
      }
      return;
    }
  }
  async function _delete_func(resource) {
    let res_list = resource ? [resource] : pStateRef.current.select_state.selected_rows;
    var confirm_text;
    if (res_list.length == 1) {
      let res_name = res_list[0].name;
      confirm_text = `Are you sure that you want to delete ${res_name}?`;
    } else {
      confirm_text = `Are you sure that you want to delete multiple items?`;
    }
    let first_index = 99999;
    for (let row of pStateRef.current.select_state.selected_rows) {
      let ind = parseInt((0, _library_pane_reducer.get_index)(row.name, row.res_type, pStateRef.current.data_dict));
      if (ind < first_index) {
        first_index = ind;
      }
    }
    try {
      await dialogFuncs.showModalPromise("ConfirmDialog", {
        title: "Delete resources",
        text_body: confirm_text,
        cancel_text: "do nothing",
        submit_text: "delete",
        handleClose: dialogFuncs.hideModal
      });
      await (0, _communication_react.postAjaxPromise)("delete_resource_list", {
        "resource_list": res_list
      });
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error duplicating resource ${res_name}`, e);
      }
      return;
    }
  }
  async function _rename_func() {
    let row = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    let res_type;
    let res_name;
    if (!row) {
      res_type = pStateRef.current.select_state.selected_resource.res_type;
      res_name = pStateRef.current.select_state.selected_resource.name;
    } else {
      res_type = row.res_type;
      res_name = row.name;
    }
    try {
      let data = await (0, _communication_react.postAjaxPromise)("get_resource_names/" + res_type, {});
      const res_names = data["resource_names"];
      const index = res_names.indexOf(res_name);
      if (index >= 0) {
        res_names.splice(index, 1);
      }
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: `Rename ${res_type}`,
        field_title: "New Name",
        handleClose: dialogFuncs.hideModal,
        default_value: res_name,
        existing_names: res_names,
        checkboxes: []
      });
      const the_data = {
        "new_name": new_name
      };
      await (0, _communication_react.postAjaxPromise)(`rename_resource/${res_type}/${res_name}`, the_data);
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error renaming resource ${res_name}`, e);
      }
      return;
    }
  }
  async function _repository_copy_func() {
    if (!pStateRef.current.select_state.multi_select) {
      let res_type = pStateRef.current.select_state.selected_resource.res_type;
      let res_name = pStateRef.current.select_state.selected_resource.name;
      try {
        let data = await (0, _communication_react.postAjaxPromise)("get_resource_names/" + res_type, {});
        let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
          title: `Import ${res_type}`,
          field_title: "New Name",
          default_value: res_name,
          existing_names: data.resource_names,
          checkboxes: [],
          handleClose: dialogFuncs.hideModal
        });
        const result_dict = {
          "res_type": res_type,
          "res_name": res_name,
          "new_res_name": new_name
        };
        await (0, _communication_react.postAjaxPromise)("/copy_from_repository", result_dict);
        statusFuncs.statusMessage(`Imported Resource ${res_name}`);
        return res_name;
      } catch (e) {
        if (e != "canceled") {
          errorDrawerFuncs.addFromError("Error getting resources names", e);
        }
        return;
      }
    } else {
      const result_dict = {
        "selected_rows": pStateRef.current.select_state.selected_rows
      };
      try {
        await (0, _communication_react.postAjaxPromise)("/copy_from_repository", result_dict);
        statusFuncs.statusMessage(`Imported Resources`);
      } catch (e) {
        errorDrawerFuncs.addFromError("Error importing resources", e);
      }
      return "";
    }
  }
  async function _send_repository_func() {
    let pane_type = props.pane_type;
    if (!pStateRef.current.select_state.multi_select) {
      let res_type = pStateRef.current.select_state.selected_resource.res_type;
      let res_name = pStateRef.current.select_state.selected_resource.name;
      try {
        let data = await (0, _communication_react.postAjaxPromise)("get_repository_resource_names/" + res_type, {});
        let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
          title: `Share ${res_type}`,
          field_title: `New ${res_type} Name`,
          default_value: res_name,
          existing_names: data.resource_names,
          checkboxes: [],
          handleClose: dialogFuncs.hideModal
        });
        const result_dict = {
          "pane_type": pane_type,
          "res_type": res_type,
          "res_name": res_name,
          "new_res_name": new_name
        };
        await (0, _communication_react.postAjaxPromise)('/send_to_repository', result_dict);
        statusFuncs.statusMessage(`Shared resource ${res_name}`);
      } catch (e) {
        if (e != "canceled") {
          errorDrawerFuncs.addFromError(`Error sharing resource ${res_name}`, e);
        }
        return;
      }
    } else {
      const result_dict = {
        "pane_type": pane_type,
        "selected_rows": pStateRef.current.select_state.selected_rows
      };
      try {
        await (0, _communication_react.postAjaxPromise)('/send_to_repository', result_dict);
        statusFuncs.statusMessage("Shared resources");
      } catch (e) {
        errorDrawerFuncs.addFromError("Error sharing resources", e);
      }
      return "";
    }
  }
  async function _refresh_func() {
    let callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    await _grabNewChunkWithRow(0, true, null, true, callback);
  }
  async function _new_notebook() {
    if (window.in_context) {
      try {
        const the_view = "new_notebook_in_context";
        let data = await (0, _communication_react.postAjaxPromise)(the_view, {
          resource_name: ""
        });
        props.handleCreateViewer(data);
      } catch (e) {
        errorDrawerFuncs.addFromError("Error creating new notebook", e);
      }
    } else {
      window.open(`${$SCRIPT_ROOT}/new_notebook`);
    }
  }
  async function _new_project() {
    if (window.in_context) {
      try {
        const the_view = "new_project_in_context";
        let data = await (0, _communication_react.postAjaxPromise)(the_view, {
          resource_name: ""
        });
        props.handleCreateViewer(data);
      } catch (e) {
        errorDrawerFuncs.addFromError("Error creating new project", e);
      }
    } else {
      window.open(`${$SCRIPT_ROOT}/new_project`);
    }
  }
  async function _downloadJupyter() {
    let res_name = pStateRef.current.select_state.selected_resource.name;
    try {
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: `Download Notebook as Jupyter Notebook`,
        field_title: "New File Name",
        default_value: res_name + ".ipynb",
        existing_names: [],
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      window.open(`${$SCRIPT_ROOT}/download_jupyter/` + res_name + "/" + new_name);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error downloading jupyter notebook", e);
    }
  }
  function _showJupyterImport() {
    dialogFuncs.showModal("FileImportDialog", {
      res_type: "project",
      allowed_file_types: ".ipynb",
      checkboxes: [],
      chunking: false,
      chunkSize: null,
      forceChunking: false,
      process_handler: _import_jupyter,
      tsocket: props.tsocket,
      combine: false,
      show_csv_options: false,
      after_upload: null,
      show_address_selector: false,
      initial_address: null,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _import_jupyter(myDropZone, setCurrentUrl) {
    let new_url = `import_jupyter/${props.library_id}`;
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  async function _combineCollections() {
    var res_name = pStateRef.current.select_state.selected_resource.name;
    if (!pStateRef.current.select_state.multi_select) {
      try {
        let data = await (0, _communication_react.postAjaxPromise)("get_resource_names/collection", {});
        let other_name = await dialogFuncs.showModalPromise("SelectDialog", {
          title: "Select a new collection to combine with " + res_name,
          select_label: "Collection to Combine",
          cancel_text: "Cancel",
          submit_text: "Combine",
          option_list: data.resource_names,
          handleClose: dialogFuncs.hideModal
        });
        statusFuncs.startSpinner(true);
        const target = `combine_collections/${res_name}/${other_name}`;
        await (0, _communication_react.postAjaxPromise)(target, {});
        statusFuncs.stopSpinner();
        statusFuncs.statusMessage("Combined Collections");
      } catch (e) {
        if (e != "canceled") {
          errorDrawerFuncs.addFromError(`Error combining collections`, e);
        }
        statusFuncs.stopSpinner();
        return;
      }
    } else {
      try {
        let data = await (0, _communication_react.postAjaxPromise)("get_resource_names/collection", {});
        let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
          title: "Combine Collections",
          field_title: "Name for combined collection",
          default_value: "NewCollection",
          existing_names: data.resource_names,
          checkboxes: [],
          handleClose: dialogFuncs.hideModal
        });
        await (0, _communication_react.postAjaxPromise)("combine_to_new_collection", {
          "original_collections": pStateRef.current.select_state.list_of_selected,
          "new_name": new_name
        });
      } catch (e) {
        if (e != "canceled") {
          errorDrawerFuncs.addFromError(`Error combining collections`, e);
        }
        statusFuncs.stopSpinner();
        return;
      }
    }
  }
  async function _downloadCollection() {
    let resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    let res_name = resource_name ? resource_name : pStateRef.current.select_state.selected_resource.name;
    try {
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: "Download Collection",
        field_title: "New File Name",
        default_value: res_name,
        existing_names: [],
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      window.open(`${$SCRIPT_ROOT}/download_collection/` + res_name + "/" + new_name);
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError(`Error combing collections`, e);
      }
      return;
    }
  }
  function _displayImportResults(data) {
    let title = "Collection Created";
    let message = "";
    let number_of_errors;
    if (data.file_decoding_errors == null) {
      statusFuncs.statusMessage("No import errors");
    } else {
      message = "<b>Decoding errors were enountered</b>";
      for (let filename in data.file_decoding_errors) {
        number_of_errors = String(data.file_decoding_errors[filename].length);
        message = message + `<br>${filename}: ${number_of_errors} errors`;
      }
      errorDrawerFuncs.addErrorDrawerEntry({
        title: title,
        content: message
      });
    }
  }
  function _showCollectionImport() {
    dialogFuncs.showModal("FileImportDialog", {
      res_type: "collection",
      allowed_file_types: ".csv,.tsv,.txt,.xls,.xlsx,.html",
      checkboxes: [{
        "checkname": "import_as_freeform",
        "checktext": "Import as freeform"
      }],
      process_handler: _import_collection,
      chunking: false,
      chunkSize: null,
      forceChunking: false,
      tsocket: props.tsocket,
      combine: true,
      show_csv_options: true,
      after_upload: null,
      show_address_selector: false,
      initial_address: null,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  async function _import_collection(myDropZone, setCurrentUrl, new_name, check_results) {
    let csv_options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    let doc_type = check_results["import_as_freeform"] ? "freeform" : "table";
    try {
      await (0, _communication_react.postAjaxPromise)("create_empty_collection", {
        "collection_name": new_name,
        "doc_type": doc_type,
        "library_id": props.library_id,
        "csv_options": csv_options
      });
      let new_url = `append_documents_to_collection/${new_name}/${doc_type}/${props.library_id}`;
      myDropZone.options.url = new_url;
      setCurrentUrl(new_url);
      myDropZone.processQueue();
    } catch (e) {
      errorDrawerFuncs.addFromError("Error importing document", e);
    }
  }
  async function _tile_view() {
    await _view_func("/view_module/");
  }
  async function _view_named_tile(res) {
    let in_new_tab = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    await _view_resource({
      name: res.name,
      res_type: "tile"
    }, "/view_module/", in_new_tab);
  }
  async function _creator_view_named_tile(res) {
    let in_new_tab = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    await _view_resource({
      name: res.tile,
      res_type: "tile"
    }, "/view_in_creator/", in_new_tab);
  }
  async function _creator_view() {
    await _view_func("/view_in_creator/");
  }
  function _showHistoryViewer() {
    window.open(`${$SCRIPT_ROOT}/show_history_viewer/${pStateRef.current.select_state.selected_resource.name}`);
  }
  function _compare_tiles() {
    let res_names = pStateRef.current.select_state.list_of_selected;
    if (res_names.length == 0) return;
    if (res_names.length == 1) {
      window.open(`${$SCRIPT_ROOT}/show_tile_differ/${res_names[0]}`);
    } else if (res_names.length == 2) {
      window.open(`${$SCRIPT_ROOT}/show_tile_differ/both_names/${res_names[0]}/${res_names[1]}`);
    } else {
      (0, _toaster.doFlash)({
        "alert-type": "alert-warning",
        "message": "Select only one or two tiles before launching compare"
      });
    }
  }
  async function _load_tile() {
    let resource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    let res_name = resource ? resource.name : pStateRef.current.select_state.selected_resource.name;
    try {
      await (0, _communication_react.postPromise)("host", "load_tile_module_task", {
        "tile_module_name": res_name,
        "user_id": window.user_id
      });
      statusFuncs.statusMessage(`Loaded tile ${res_name}`);
    } catch (e) {
      errorDrawerFuncs.addFromError("Error loading tile", e);
    }
  }
  async function _unload_module() {
    let resource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    let res_name = resource ? resource.name : pStateRef.current.select_state.selected_resource.name;
    try {
      await (0, _communication_react.postAjaxPromise)(`unload_one_module/${res_name}`, {});
      statusFuncs.statusMessage("Tile unloaded");
    } catch (e) {
      errorDrawerFuncs.addFromError("Error unloading tile", e);
    }
  }
  async function _unload_all_tiles() {
    try {
      await (0, _communication_react.postAjaxPromise)(`unload_all_tiles`, {});
      statusFuncs.statusMessage("Unloaded all tiles");
    } catch (e) {
      errorDrawerFuncs.addFromError("Error unloading tiles", e);
    }
  }
  async function _new_tile(template_name) {
    try {
      let data = await (0, _communication_react.postAjaxPromise)(`get_resource_names/tile`, {});
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: "New Tile",
        field_title: "New Tile Name",
        default_value: "NewTileModule",
        existing_names: data.resource_names,
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      const result_dict = {
        "template_name": template_name,
        "new_res_name": new_name,
        "last_saved": "viewer"
      };
      await (0, _communication_react.postAjaxPromise)("/create_tile_module", result_dict);
      await _view_resource({
        name: new_name,
        res_type: "tile"
      }, "/view_module/");
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError("Error creating tile module", e);
      }
      return;
    }
  }
  async function _new_in_creator(template_name) {
    try {
      let data = await (0, _communication_react.postAjaxPromise)(`get_resource_names/tile`, {});
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: "New Tile",
        field_title: "New Tile Name",
        default_value: "NewTileModule",
        existing_names: data.resource_names,
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      const result_dict = {
        "template_name": template_name,
        "new_res_name": new_name,
        "last_saved": "creator"
      };
      await (0, _communication_react.postAjaxPromise)("/create_tile_module", result_dict);
      await _view_resource({
        name: String(new_name),
        res_type: "tile"
      }, "/view_in_creator/");
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError("Error creating tile module", e);
      }
    }
  }
  async function _new_list(template_name) {
    try {
      let data = await (0, _communication_react.postAjaxPromise)(`get_resource_names/list`, {});
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: "New List Resource",
        field_title: "New List Name",
        default_value: "NewListResource",
        existing_names: data.resource_names,
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      const result_dict = {
        "template_name": template_name,
        "new_res_name": new_name
      };
      await (0, _communication_react.postAjaxPromise)("/create_list", result_dict);
      await _view_resource({
        name: String(new_name),
        res_type: "list"
      }, "/view_list/");
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError("Error creating list resource", e);
      }
    }
  }
  function _add_list(myDropZone, setCurrentUrl) {
    let new_url = `import_list/${props.library_id}`;
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _showListImport() {
    dialogFuncs.showModal("FileImportDialog", {
      res_type: "list",
      allowed_file_types: "text/*",
      checkboxes: [],
      chunking: false,
      chunkSize: null,
      forceChunking: false,
      process_handler: _add_list,
      tsocket: props.tsocket,
      combine: false,
      show_csv_options: false,
      after_upload: null,
      show_address_selector: false,
      initial_address: null,
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _add_to_pool(myDropZone, setCurrentUrl, current_value) {
    let new_url = `import_pool/${props.library_id}`;
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  async function _new_code(template_name) {
    try {
      let data = await (0, _communication_react.postAjaxPromise)(`get_resource_names/code`, {});
      let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
        title: "New code Resource",
        field_title: "New Code Resource Name",
        default_value: "NewCodeResource",
        existing_names: data.resource_names,
        checkboxes: [],
        handleClose: dialogFuncs.hideModal
      });
      const result_dict = {
        "template_name": template_name,
        "new_res_name": new_name
      };
      await (0, _communication_react.postAjaxPromise)("/create_code", result_dict);
      await _view_resource({
        name: String(new_name),
        res_type: "code"
      }, "/view_code/");
    } catch (e) {
      if (e != "canceled") {
        errorDrawerFuncs.addFromError("Error creating code resource", e);
      }
    }
  }
  function setContextMenuItems(context_menu_items) {
    pDispatch({
      type: "SET_CONTEXT_MENU_ITEMS",
      context_menu_items: context_menu_items
    });
  }
  function _menu_funcs() {
    return {
      view_func: _view_func,
      send_repository_func: _send_repository_func,
      repository_copy_func: _repository_copy_func,
      duplicate_func: _duplicate_func,
      refresh_func: _refresh_func,
      delete_func: _delete_func,
      rename_func: _rename_func,
      new_notebook: _new_notebook,
      new_project: _new_project,
      downloadJupyter: _downloadJupyter,
      showJupyterImport: _showJupyterImport,
      combineCollections: _combineCollections,
      showCollectionImport: _showCollectionImport,
      downloadCollection: _downloadCollection,
      new_in_creator: _new_in_creator,
      creator_view: _creator_view,
      tile_view: _tile_view,
      creator_view_named_tile: _creator_view_named_tile,
      view_named_tile: _view_named_tile,
      load_tile: _load_tile,
      unload_module: _unload_module,
      unload_all_tiles: _unload_all_tiles,
      showHistoryViewer: _showHistoryViewer,
      compare_tiles: _compare_tiles,
      new_list: _new_list,
      showListImport: _showListImport,
      new_code: _new_code
    };
  }
  let new_button_groups;
  const primary_mdata_fields = ["name", "created", "updated", "tags", "notes"];
  const ignore_fields = ["doc_type", "res_type"];
  let additional_metadata = {};
  let selected_resource_icon = null;
  for (let field in pStateRef.current.select_state.selected_resource) {
    if (pStateRef.current.select_state.selected_rows.length == 1 && pStateRef.current.select_state.selected_resource.res_type == "tile" && field == "icon") {
      selected_resource_icon = pStateRef.current.select_state.selected_resource["icon"];
    }
    if (!primary_mdata_fields.includes(field) && !ignore_fields.includes(field) && !field.startsWith("icon:")) {
      additional_metadata[field] = pStateRef.current.select_state.selected_resource[field];
    }
  }
  if (Object.keys(additional_metadata).length == 0) {
    additional_metadata = null;
  }
  let split_tags = pStateRef.current.select_state.selected_resource.tags == "" ? [] : pStateRef.current.select_state.selected_resource.tags.split(" ");
  let right_pane = /*#__PURE__*/_react.default.createElement(_blueprint_mdata_fields.CombinedMetadata, {
    tags: split_tags,
    all_tags: pStateRef.current.tag_list,
    elevation: 0,
    name: pStateRef.current.select_state.selected_resource.name,
    created: pStateRef.current.select_state.selected_resource.created,
    updated: pStateRef.current.select_state.selected_resource.updated,
    notes: pStateRef.current.select_state.selected_resource.notes,
    icon: selected_resource_icon,
    handleChange: _handleMetadataChange,
    res_type: pStateRef.current.select_state.selected_resource.res_type,
    pane_type: props.pane_type,
    outer_style: metadata_outer_style,
    handleNotesBlur: null,
    additional_metadata: additional_metadata,
    readOnly: props.is_repository
  });
  let th_style = {
    "display": "inline-block",
    "verticalAlign": "top",
    "maxHeight": "100%",
    "overflowY": "scroll",
    "overflowX": "scroll",
    "lineHeight": 1,
    "whiteSpace": "nowrap"
  };
  let MenubarClass = props.MenubarClass;
  let filter_buttons = [];
  for (let rtype of ["all"].concat(res_types)) {
    filter_buttons.push( /*#__PURE__*/_react.default.createElement(_popover.Tooltip2, {
      content: rtype,
      key: rtype,
      placement: "top",
      hoverOpenDelay: 700,
      intent: "warning"
    }, /*#__PURE__*/_react.default.createElement(_core.Button, {
      icon: _blueprint_mdata_fields.icon_dict[rtype],
      minimal: true,
      active: rtype == pState.search_state.filterType,
      onClick: async () => {
        await _setFilterType(rtype);
      }
    })));
  }
  let left_pane = /*#__PURE__*/_react.default.createElement(_library_table_pane.LibraryTablePane, (0, _extends2.default)({}, props, {
    pStateRef: pStateRef,
    filter_buttons: filter_buttons,
    update_search_state: _update_search_state,
    updateTagState: _update_search_state,
    sortColumn: _set_sort_state,
    onSelection: _onTableSelection,
    keyHandler: null,
    initiateDataGrab: _grabNewChunkWithRow,
    renderBodyContextMenu: _renderBodyContextMenu,
    handleRowDoubleClick: _handleRowDoubleClick
  }));
  let selected_types = _selectedTypes();
  selectedTypeRef.current = selected_types.length == 1 ? pState.select_state.selected_resource.res_type : "multi";
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(MenubarClass, (0, _extends2.default)({
    selected_resource: pStateRef.current.select_state.selected_resource,
    connection_status: props.connection_status,
    multi_select: pStateRef.current.select_state.multi_select,
    list_of_selected: pStateRef.current.select_state.list_of_selected,
    selected_rows: pStateRef.current.select_state.selected_rows,
    selectedTypeRef: selectedTypeRef
  }, _menu_funcs(), {
    sendContextMenuItems: setContextMenuItems,
    view_resource: _view_resource,
    open_raw: _open_raw
  }, props.errorDrawerFuncs, {
    handleCreateViewer: props.handleCreateViewer,
    library_id: props.library_id,
    controlled: props.controlled,
    tsocket: props.tsocket
  })), /*#__PURE__*/_react.default.createElement("div", {
    ref: top_ref,
    tabIndex: "0",
    className: "d-flex flex-column",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      width: "100%",
      height: usable_height
    }
  }, /*#__PURE__*/_react.default.createElement(_resizing_layouts.HorizontalPanes, {
    show_handle: true,
    left_pane: left_pane,
    right_pane: right_pane,
    right_pane_overflow: "auto",
    initial_width_fraction: .75,
    scrollAdjustSelectors: [".bp5-table-quadrant-scroll-container"],
    handleSplitUpdate: null,
    handleResizeStart: null,
    handleResizeEnd: null
  }))));
}
exports.LibraryPane = LibraryPane = /*#__PURE__*/(0, _react.memo)(LibraryPane);