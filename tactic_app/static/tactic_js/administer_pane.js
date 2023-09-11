"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdminPane = AdminPane;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _table = require("@blueprintjs/table");
var _library_widgets = require("./library_widgets");
var _resizing_layouts = require("./resizing_layouts");
var _communication_react = require("./communication_react");
var _sizing_tools = require("./sizing_tools");
var _utilities_react = require("./utilities_react");
var _lodash = _interopRequireDefault(require("lodash"));
var _searchable_console = require("./searchable_console");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function AdminPane(props) {
  var top_ref = (0, _react.useRef)(null);
  var table_ref = (0, _react.useRef)(null);
  var console_text_ref = (0, _react.useRef)(null);
  var previous_search_spec = (0, _react.useRef)(null);
  var _useState = (0, _react.useState)((0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom),
    _useState2 = _slicedToArray(_useState, 2),
    available_height = _useState2[0],
    set_available_height = _useState2[1];
  var _useState3 = (0, _react.useState)((0, _sizing_tools.getUsableDimensions)(true).usable_width - 170),
    _useState4 = _slicedToArray(_useState3, 2),
    available_width = _useState4[0],
    set_available_width = _useState4[1];
  var get_url = "grab_".concat(props.res_type, "_list_chunk");
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)({}),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    data_dict = _useStateAndRef2[0],
    set_data_dict = _useStateAndRef2[1],
    data_dict_ref = _useStateAndRef2[2];
  var _useState5 = (0, _react.useState)(0),
    _useState6 = _slicedToArray(_useState5, 2),
    num_rows = _useState6[0],
    set_num_rows = _useState6[1];
  var _useState7 = (0, _react.useState)(false),
    _useState8 = _slicedToArray(_useState7, 2),
    awaiting_data = _useState8[0],
    set_awaiting_data = _useState8[1];
  var _useState9 = (0, _react.useState)(false),
    _useState10 = _slicedToArray(_useState9, 2),
    mounted = _useState10[0],
    set_mounted = _useState10[1];
  var _useState11 = (0, _react.useState)((0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom / 2 - 50),
    _useState12 = _slicedToArray(_useState11, 2),
    top_pane_height = _useState12[0],
    set_top_pane_height = _useState12[1];
  var _useState13 = (0, _react.useState)(500),
    _useState14 = _slicedToArray(_useState13, 2),
    total_width = _useState14[0],
    set_total_width = _useState14[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    initSocket();
    _grabNewChunkWithRow(0, true, null, true, null);
  }, []);
  function initSocket() {
    if (props.tsocket != null) {
      props.tsocket.attachListener("update-".concat(props.res_type, "-selector-row"), _handleRowUpdate);
      props.tsocket.attachListener("refresh-".concat(props.res_type, "-selector"), _refresh_func);
    }
  }
  function _getSearchSpec() {
    return {
      search_string: props.search_string,
      sort_field: props.sort_field,
      sort_direction: props.sort_direction
    };
  }
  function _onTableSelection(regions) {
    if (regions.length == 0) return; // Without this get an error when clicking on a body cell
    var selected_rows = [];
    var revised_regions = [];
    var _iterator = _createForOfIteratorHelper(regions),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var region = _step.value;
        if (region.hasOwnProperty("rows")) {
          var first_row = region["rows"][0];
          revised_regions.push(_table.Regions.row(first_row));
          var last_row = region["rows"][1];
          for (var i = first_row; i <= last_row; ++i) {
            selected_rows.push(data_dict_ref.current[i]);
            revised_regions.push(_table.Regions.row(i));
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    _handleRowSelection(selected_rows);
    _updatePaneState({
      selectedRegions: revised_regions
    });
  }
  function get_height_minus_top_offset(element_ref) {
    if (mounted) {
      // This will be true after the initial render
      return props.usable_height - $(element_ref.current).offset().top;
    } else {
      return props.usable_height - 50;
    }
  }
  function _grabNewChunkWithRow(row_index) {
    var flush = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var spec_update = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var select = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    var select_by_name = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var callback = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    var search_spec = _getSearchSpec();
    if (spec_update) {
      search_spec = Object.assign(search_spec, spec_update);
    }
    var data = {
      search_spec: search_spec,
      row_number: row_index
    };
    (0, _communication_react.postAjax)(get_url, data, function (data) {
      var new_data_dict;
      if (flush) {
        new_data_dict = data.chunk_dict;
      } else {
        new_data_dict = _lodash["default"].cloneDeep(data_dict_ref.current);
        new_data_dict = Object.assign(new_data_dict, data.chunk_dict);
      }
      previous_search_spec.current = search_spec;
      set_data_dict(new_data_dict);
      set_num_rows(data.num_rows);
      pushCallback(function () {
        if (callback) {
          callback();
        } else if (select) {
          _selectRow(row_index);
        } else if (select_by_name) {
          var ind = get_data_dict_index(select_by_name);
          if (!ind) {
            ind = 0;
          }
          _selectRow(ind);
        }
      });
    });
  }
  function _initiateDataGrab(row_index) {
    set_awaiting_data(true);
    pushCallback(function () {
      _grabNewChunkWithRow(row_index);
    });
  }
  function _handleRowUpdate(res_dict) {
    var res_name = res_dict.name;
    var ind = get_data_dict_index(res_name);
    var new_data_dict = _lodash["default"].cloneDeep(data_dict_ref.current);
    var the_row = new_data_dict[ind];
    for (var field in res_dict) {
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
  function get_data_dict_index(name) {
    for (var index in data_dict_ref.current) {
      if (data_dict_ref.current[index].name == name) {
        return index;
      }
    }
    return null;
  }
  function _delete_row(idval) {
    var ind = get_data_list_index(idval);
    var new_data_list = _toConsumableArray(data_list);
    new_data_list.splice(ind, 1);
    set_ata_list(new_data_list);
  }
  function get_data_dict_entry(name) {
    for (var index in data_dict_ref.current) {
      if (data_dict_ref.current[index].name == name) {
        return data_dict_ref.current[index];
      }
    }
    return null;
  }
  function _handleSplitResize(left_width, right_width, width_fraction) {
    _updatePaneState({
      left_width_fraction: width_fraction
    });
  }
  function _handleRowClick(row_dict) {
    var shift_key_down = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    _updatePaneState({
      selected_resource: row_dict,
      multi_select: false,
      list_of_selected: [row_dict[props.id_field]]
    });
  }
  function _handleRowSelection(selected_rows) {
    var row_dict = selected_rows[0];
    _updatePaneState({
      selected_resource: row_dict,
      multi_select: false,
      list_of_selected: [row_dict.name]
    });
  }
  function _filter_func(resource_dict, search_string) {
    for (var key in resource_dict) {
      if (resource_dict[key].toLowerCase().search(search_string) != -1) {
        return true;
      }
    }
    return resource_dict[props.id_field].toLowerCase().search(search_string) != -1;
  }
  function _update_search_state(new_state) {
    _updatePaneState(new_state, function () {
      if (search_spec_changed(new_state)) {
        _grabNewChunkWithRow(0, true, new_state, true);
      }
    });
  }
  function search_spec_changed(new_spec) {
    if (!previous_search_spec.current) {
      return true;
    }
    for (var key in previous_search_spec.current) {
      if (new_spec.hasOwnProperty(key)) {
        // noinspection TypeScriptValidateTypes
        if (new_spec[key] != previous_search_spec.current[key]) {
          return true;
        }
      }
    }
    return false;
  }
  function _set_sort_state(column_name, sort_field, direction) {
    var spec_update = {
      sort_field: column_name,
      sort_direction: direction
    };
    _updatePaneState(spec_update, function () {
      if (search_spec_changed(spec_update)) {
        _grabNewChunkWithRow(0, true, spec_update, true);
      }
    });
  }
  function _handleArrowKeyPress(key) {
    var current_index = parseInt(get_data_dict_index(props.selected_resource.name));
    var new_index;
    var new_selected_res;
    if (key == "ArrowDown") {
      new_index = current_index + 1;
    } else {
      new_index = current_index - 1;
      if (new_index < 0) return;
    }
    _selectRow(new_index);
  }
  function _selectRow(new_index) {
    if (!Object.keys(data_dict_ref.current).includes(String(new_index))) {
      _grabNewChunkWithRow(new_index, false, null, false, null, function () {
        _selectRow(new_index);
      });
    } else {
      var new_regions = [_table.Regions.row(new_index)];
      _updatePaneState({
        selected_resource: data_dict_ref.current[new_index],
        list_of_selected: [data_dict_ref.current[new_index].name],
        selectedRegions: new_regions
      });
    }
  }
  function _refresh_func() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    _grabNewChunkWithRow(0, true, null, true, null, callback);
  }
  function _setConsoleText(the_text) {
    var self = this;
    _updatePaneState({
      "console_text": the_text
    }, function () {
      if (console_text_ref && console_text_ref.current) {
        console_text_ref.current.scrollTop = console_text_ref.current.scrollHeight;
      }
    });
  }
  function _communicateColumnWidthSum(total_width) {
    set_total_width(total_width + 50);
  }
  var new_button_groups;
  var left_width = props.usable_width * props.left_width_fraction;
  var primary_mdata_fields = ["name", "created", "created_for_sort", "updated", "updated_for_sort", "tags", "notes"];
  var additional_metadata = {};
  for (var field in props.selected_resource) {
    if (!primary_mdata_fields.includes(field)) {
      additional_metadata[field] = props.selected_resource[field];
    }
  }
  if (Object.keys(additional_metadata).length == 0) {
    additional_metadata = null;
  }
  var table_width;
  var table_height;
  if (table_ref && table_ref.current) {
    table_width = left_width - table_ref.current.offsetLeft;
    table_height = props.usable_height - table_ref.current.offsetTop;
  } else {
    table_width = left_width - 150;
    table_height = props.usable_height - 75;
  }
  var right_pane;
  if (props.res_type == "container") {
    right_pane = /*#__PURE__*/_react["default"].createElement("div", {
      className: "d-flex d-inline",
      ref: console_text_ref,
      style: {
        height: "100%",
        overflow: "hidden",
        marginRight: 50
      }
    }, /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
      main_id: window.library_id,
      streaming_host: "host",
      container_id: props.selected_resource.Id,
      ref: null,
      outer_style: {
        overflowX: "auto",
        overflowY: "auto",
        height: table_height - 35,
        width: "100%",
        marginTop: 0,
        marginLeft: 5,
        marginRight: 0,
        padding: 15
      },
      showCommandField: true
    }));
  } else {
    right_pane = /*#__PURE__*/_react["default"].createElement("div", null);
  }
  var th_style = {
    "display": "inline-block",
    "verticalAlign": "top",
    "maxHeight": "100%",
    "overflowY": "scroll",
    "lineHeight": 1,
    "whiteSpace": "nowrap",
    "overflowX": "hidden"
  };
  var MenubarClass = props.MenubarClass;
  var column_specs = {};
  var _iterator2 = _createForOfIteratorHelper(props.colnames),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var col = _step2.value;
      column_specs[col] = {
        "sort_field": col,
        "first_sort": "ascending"
      };
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  var left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: {
      "maxHeight": "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    ref: table_ref,
    style: {
      width: table_width,
      maxWidth: total_width,
      maxHeight: table_height,
      padding: 15,
      marginTop: 10
      // backgroundColor: "white"
    }
  }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    allow_search_inside: false,
    allow_search_metadata: false,
    update_search_state: _update_search_state,
    search_string: props.search_string
  }), /*#__PURE__*/_react["default"].createElement(_library_widgets.BpSelectorTable, {
    data_dict: data_dict_ref.current,
    num_rows: num_rows,
    awaiting_data: awaiting_data,
    enableColumnResizing: true
    // maxColumnWidth={225}
    ,
    sortColumn: _set_sort_state,
    selectedRegions: props.selectedRegions,
    communicateColumnWidthSum: _communicateColumnWidthSum,
    onSelection: _onTableSelection,
    initiateDataGrab: _initiateDataGrab,
    columns: column_specs,
    identifier_field: props.id_field
  }))));
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(MenubarClass, _extends({
    selected_resource: props.selected_resource,
    list_of_selected: props.list_of_selected,
    setConsoleText: _setConsoleText,
    delete_row: _delete_row,
    refresh_func: _refresh_func
  }, props.errorDrawerFuncs)), /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    className: "d-flex flex-column mt-3"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: props.usable_width,
      height: props.usable_height
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: left_pane,
    right_pane: right_pane,
    show_handle: true,
    available_width: props.usable_width,
    available_height: table_height,
    initial_width_fraction: .65,
    handleSplitUpdate: _handleSplitResize
  }))));
}
AdminPane.propTypes = {
  usable_height: _propTypes["default"].number,
  usable_width: _propTypes["default"].number,
  res_type: _propTypes["default"].string,
  allow_search_inside: _propTypes["default"].bool,
  allow_search_metadata: _propTypes["default"].bool,
  search_inside_view: _propTypes["default"].string,
  search_metadata_view: _propTypes["default"].string,
  MenubarClass: _propTypes["default"].func,
  is_repository: _propTypes["default"].bool,
  tsocket: _propTypes["default"].object,
  colnames: _propTypes["default"].array,
  id_field: _propTypes["default"].string
};
AdminPane.defaultProps = {
  is_repository: false,
  tsocket: null
};
exports.AdminPane = AdminPane = /*#__PURE__*/(0, _react.memo)(AdminPane);