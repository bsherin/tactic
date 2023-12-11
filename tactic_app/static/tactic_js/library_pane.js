"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LibraryPane = LibraryPane;
exports.res_types = void 0;
exports.view_views = view_views;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _popover = require("@blueprintjs/popover2");
var _table = require("@blueprintjs/table");
var _lodash = _interopRequireDefault(require("lodash"));
var _tag_buttons_react = require("./tag_buttons_react");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _library_widgets = require("./library_widgets");
var _resizing_layouts = require("./resizing_layouts");
var _communication_react = require("./communication_react");
var _sizing_tools = require("./sizing_tools");
var _toaster = require("./toaster.js");
var _key_trap = require("./key_trap.js");
var _utilities_react = require("./utilities_react");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
var _toaster2 = require("./toaster");
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
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } // noinspection JSValidateTypes,JSDeprecatedSymbols
var res_types = ["collection", "project", "tile", "list", "code"];
exports.res_types = res_types;
function view_views() {
  var is_repository = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
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
  var is_repository = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
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
  var menu_items = props.items.map(function (item, index) {
    if (item.text == "__divider__") {
      return /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
        key: index
      });
    } else {
      var the_row = props.selected_rows[0];
      var disabled = item.res_type && the_row.res_type != item.res_type;
      return /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: item.icon,
        disabled: disabled,
        onClick: function onClick() {
          return item.onClick(the_row);
        },
        intent: getIntent(item),
        key: item.text,
        text: item.text
      });
    }
  });
  return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, {
    title: props.selected_rows[0].name,
    className: "context-menu-header"
  }), menu_items);
}
BodyMenu.propTypes = {
  items: _propTypes["default"].array,
  selected_rows: _propTypes["default"].array
};
function LibraryPane(props) {
  var top_ref = (0, _react.useRef)(null);
  var table_ref = (0, _react.useRef)(null);
  var tr_bounding_top = (0, _react.useRef)(null);
  var resizing = (0, _react.useRef)(false);
  var previous_search_spec = (0, _react.useRef)(null);
  var socket_counter = (0, _react.useRef)(null);
  var blank_selected_resource = (0, _react.useRef)({});
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)({}),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    data_dict = _useStateAndRef2[0],
    set_data_dict = _useStateAndRef2[1],
    data_dict_ref = _useStateAndRef2[2];
  var _useState = (0, _react.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    num_rows = _useState2[0],
    set_num_rows = _useState2[1];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    tag_list = _useStateAndRef4[0],
    set_tag_list = _useStateAndRef4[1],
    tag_list_ref = _useStateAndRef4[2];
  var _useState3 = (0, _react.useState)([]),
    _useState4 = _slicedToArray(_useState3, 2),
    contextMenuItems = _useState4[0],
    setContextMenuItems = _useState4[1];
  var _useState5 = (0, _react.useState)(500),
    _useState6 = _slicedToArray(_useState5, 2),
    total_width = _useState6[0],
    set_total_width = _useState6[1];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(.65),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    left_width_fraction = _useStateAndRef6[0],
    set_left_width_fraction = _useStateAndRef6[1],
    left_width_fraction_ref = _useStateAndRef6[2];
  var _useStateAndRef7 = (0, _utilities_react.useStateAndRef)({
      "name": "",
      "_id": "",
      "tags": "",
      "notes": "",
      "updated": "",
      "created": ""
    }),
    _useStateAndRef8 = _slicedToArray(_useStateAndRef7, 3),
    selected_resource = _useStateAndRef8[0],
    set_selected_resource = _useStateAndRef8[1],
    selected_resource_ref = _useStateAndRef8[2];
  var _useStateAndRef9 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef10 = _slicedToArray(_useStateAndRef9, 3),
    selected_rows = _useStateAndRef10[0],
    set_selected_rows = _useStateAndRef10[1],
    selected_rows_ref = _useStateAndRef10[2];
  var _useStateAndRef11 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef12 = _slicedToArray(_useStateAndRef11, 3),
    expanded_tags = _useStateAndRef12[0],
    set_expanded_tags = _useStateAndRef12[1],
    expanded_tags_ref = _useStateAndRef12[2];
  var _useStateAndRef13 = (0, _utilities_react.useStateAndRef)("all"),
    _useStateAndRef14 = _slicedToArray(_useStateAndRef13, 3),
    active_tag = _useStateAndRef14[0],
    set_active_tag = _useStateAndRef14[1],
    active_tag_ref = _useStateAndRef14[2];
  var _useStateAndRef15 = (0, _utilities_react.useStateAndRef)("updated"),
    _useStateAndRef16 = _slicedToArray(_useStateAndRef15, 3),
    sort_field = _useStateAndRef16[0],
    set_sort_field = _useStateAndRef16[1],
    sort_field_ref = _useStateAndRef16[2];
  var _useStateAndRef17 = (0, _utilities_react.useStateAndRef)("descending"),
    _useStateAndRef18 = _slicedToArray(_useStateAndRef17, 3),
    sort_direction = _useStateAndRef18[0],
    set_sort_direction = _useStateAndRef18[1],
    sort_direction_ref = _useStateAndRef18[2];
  var _useStateAndRef19 = (0, _utilities_react.useStateAndRef)(props.pane_type),
    _useStateAndRef20 = _slicedToArray(_useStateAndRef19, 3),
    filterType = _useStateAndRef20[0],
    setFilterType = _useStateAndRef20[1],
    filterTypeRef = _useStateAndRef20[2];
  var _useStateAndRef21 = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef22 = _slicedToArray(_useStateAndRef21, 3),
    multi_select = _useStateAndRef22[0],
    set_multi_select = _useStateAndRef22[1],
    multi_select_ref = _useStateAndRef22[2];
  var _useStateAndRef23 = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef24 = _slicedToArray(_useStateAndRef23, 3),
    list_of_selected = _useStateAndRef24[0],
    set_list_of_selected = _useStateAndRef24[1],
    list_of_selected_ref = _useStateAndRef24[2];
  var _useStateAndRef25 = (0, _utilities_react.useStateAndRef)(""),
    _useStateAndRef26 = _slicedToArray(_useStateAndRef25, 3),
    search_string = _useStateAndRef26[0],
    set_search_string = _useStateAndRef26[1],
    search_string_ref = _useStateAndRef26[2];
  var _useStateAndRef27 = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef28 = _slicedToArray(_useStateAndRef27, 3),
    search_inside = _useStateAndRef28[0],
    set_search_inside = _useStateAndRef28[1],
    search_inside_ref = _useStateAndRef28[2];
  var _useStateAndRef29 = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef30 = _slicedToArray(_useStateAndRef29, 3),
    search_metadata = _useStateAndRef30[0],
    set_search_metadata = _useStateAndRef30[1],
    search_metadata_ref = _useStateAndRef30[2];
  var _useStateAndRef31 = (0, _utilities_react.useStateAndRef)(false),
    _useStateAndRef32 = _slicedToArray(_useStateAndRef31, 3),
    show_hidden = _useStateAndRef32[0],
    set_show_hidden = _useStateAndRef32[1],
    show_hidden_ref = _useStateAndRef32[2];
  var _useStateAndRef33 = (0, _utilities_react.useStateAndRef)([_table.Regions.row(0)]),
    _useStateAndRef34 = _slicedToArray(_useStateAndRef33, 3),
    selectedRegions = _useStateAndRef34[0],
    setSelectedRegions = _useStateAndRef34[1],
    selectedRegionsRef = _useStateAndRef34[2];
  var _useState7 = (0, _react.useState)(0),
    _useState8 = _slicedToArray(_useState7, 2),
    rowChanged = _useState8[0],
    setRowChanged = _useState8[1];
  var selectedTypeRef = (0, _react.useRef)(null);
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster2.StatusContext);
  var stateSetters = {
    data_dict: set_data_dict,
    num_rows: set_num_rows,
    tag_list: set_tag_list,
    contextMenuItems: setContextMenuItems,
    total_width: set_total_width,
    left_width_fraction: set_left_width_fraction,
    selected_resource: set_selected_resource,
    selected_rows: set_selected_rows,
    expanded_tags: set_expanded_tags,
    active_tag: set_active_tag,
    sort_field: set_sort_field,
    sort_direction: set_sort_direction,
    filterType: setFilterType,
    multi_select: set_multi_select,
    list_of_selected: set_list_of_selected,
    search_string: set_search_string,
    search_inside: set_search_inside,
    search_metadata: set_search_metadata,
    show_hidden: set_show_hidden,
    selectedRegions: setSelectedRegions,
    rowChanged: setRowChanged
  };
  (0, _utilities_react.useConstructor)(function () {
    for (var col in props.columns) {
      blank_selected_resource.current[col] = "";
    }
  });
  (0, _react.useEffect)(function () {
    tr_bounding_top.current = table_ref.current.getBoundingClientRect().top;
    initSocket();
    _grabNewChunkWithRow(0);
  }, []);
  var pushCallback = (0, _utilities_react.useCallbackStack)("library_home");
  function setState(new_state) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    for (var attr in new_state) {
      stateSetters[attr](new_state[attr]);
    }
    pushCallback(callback);
  }
  function initSocket() {
    if (props.tsocket != null && !props.is_repository) {
      props.tsocket.attachListener("update-selector-row", _handleRowUpdate);
      props.tsocket.attachListener("refresh-selector", _refresh_func);
    } else if (props.tsocket != null && props.is_repository) {
      props.tsocket.attachListener("update-repository-selector-row", _handleRowUpdate);
      props.tsocket.attachListener("refresh-repository-selector", _refresh_func);
    }
  }
  function _getSearchSpec() {
    return {
      active_tag: active_tag_ref.current == "all" ? null : active_tag_ref.current,
      search_string: search_string_ref.current,
      search_inside: search_inside_ref.current,
      search_metadata: search_metadata_ref.current,
      show_hidden: show_hidden_ref.current,
      sort_field: sort_field_ref.current,
      sort_direction: sort_direction_ref.current
    };
  }
  function _renderBodyContextMenu(menu_context) {
    if (event) {
      event.preventDefault();
    }
    var regions = menu_context.regions;
    if (regions.length == 0) return null; // Without this get an error when clicking on a body cell
    var selected_rows = [];
    var _iterator = _createForOfIteratorHelper(regions),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var region = _step.value;
        if (region.hasOwnProperty("rows")) {
          var first_row = region["rows"][0];
          var last_row = region["rows"][1];
          for (var i = first_row; i <= last_row; ++i) {
            if (!selected_rows.includes(i)) {
              selected_rows.push(data_dict_ref.current[i]);
            }
          }
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return /*#__PURE__*/_react["default"].createElement(BodyMenu, {
      items: contextMenuItems,
      selected_rows: selected_rows
    });
  }
  function _setFilterType(rtype) {
    if (rtype == filterTypeRef.current) return;
    if (!multi_select_ref.current) {
      var sres = selected_resource_ref.current;
      if (sres.name != "" && sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes) {
        _saveFromSelectedResource();
      }
    }
    setFilterType(rtype);
    clearSelected();
    pushCallback(function () {
      _grabNewChunkWithRow(0, true, null, true);
    });
  }
  function clearSelected() {
    set_selected_resource({
      "name": "",
      "_id": "",
      "tags": "",
      "notes": "",
      "updated": "",
      "created": ""
    });
    set_list_of_selected([]);
    set_selected_rows([]);
  }
  function _onTableSelection(regions) {
    if (regions.length == 0) return; // Without this get an error when clicking on a body cell
    var selected_rows = [];
    var selected_row_indices = [];
    var revised_regions = [];
    var _iterator2 = _createForOfIteratorHelper(regions),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var region = _step2.value;
        if (region.hasOwnProperty("rows")) {
          var first_row = region["rows"][0];
          revised_regions.push(_table.Regions.row(first_row));
          var last_row = region["rows"][1];
          for (var i = first_row; i <= last_row; ++i) {
            if (!selected_row_indices.includes(i)) {
              selected_row_indices.push(i);
              selected_rows.push(data_dict_ref.current[i]);
              revised_regions.push(_table.Regions.row(i));
            }
          }
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    _handleRowSelection(selected_rows);
    setSelectedRegions(revised_regions);
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
    if (search_spec.active_tag && search_spec.active_tag[0] != "/") {
      search_spec.active_tag = "/" + search_spec.active_tag;
    }
    var data = {
      pane_type: filterTypeRef.current,
      search_spec: search_spec,
      row_number: row_index,
      is_repository: props.is_repository
    };
    (0, _communication_react.postAjax)("grab_all_list_chunk", data, function (data) {
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
      set_tag_list(data.all_tags);
      if (callback) {
        pushCallback(callback);
      } else if (select || selected_resource_ref.current.name == "") {
        pushCallback(function () {
          _selectRow(row_index);
        });
      }
    });
  }
  function _handleRowUpdate(res_dict) {
    var res_name = res_dict.name;
    var ind;
    var new_data_dict;
    var new_state;
    var _id;
    var event_type = res_dict.event_type;
    delete res_dict.event_type;
    switch (event_type) {
      case "update":
        if ("_id" in res_dict) {
          _id = res_dict._id;
          ind = get_data_dict_index_from_id(res_dict._id);
        } else {
          ind = get_data_dict_index(res_name, res_dict.res_type);
          if (ind) {
            _id = data_dict_ref.current[ind]._id;
          }
        }
        if (!ind) return;
        new_data_dict = _lodash["default"].cloneDeep(data_dict_ref.current);
        var the_row = new_data_dict[ind];
        for (var field in res_dict) {
          the_row[field] = res_dict[field];
        }
        new_state = {
          data_dict: new_data_dict,
          rowChanged: rowChanged + 1
        };
        if ("tags" in res_dict) {
          var _data_dict = {
            pane_type: props.pane_type,
            is_repository: props.is_repository,
            show_hidden: show_hidden_ref.current
          };
          (0, _communication_react.postAjaxPromise)("get_tag_list", _data_dict).then(function (data) {
            var all_tags = data.tag_list;
            set_tag_list(all_tags);
          });
        }
        if (_id == selected_resource_ref.current._id) {
          set_selected_resource(the_row);
          pushCallback(function () {
            return setState(new_state);
          });
        } else {
          setState(new_state);
        }
        break;
      case "insert":
        _grabNewChunkWithRow(0, true, null, false, res_name);
        break;
      case "delete":
        if ("_id" in res_dict) {
          ind = parseInt(get_data_dict_index_from_id(res_dict._id));
        } else {
          ind = parseInt(get_data_dict_index(res_name, res_dict.res_type));
        }
        new_data_dict = _lodash["default"].cloneDeep(data_dict_ref.current);
        var is_last = ind == new_data_dict.length - 1;
        var selected_ind = null;
        if ("_id" in selected_resource_ref.current) {
          selected_ind = parseInt(get_data_dict_index_from_id(selected_resource_ref.current._id));
        }
        var is_selected_row = ind && ind == selected_ind;
        var new_selected_ind = selected_ind;
        if (selected_ind > ind) {
          new_selected_ind = selected_ind - 1;
        }
        delete new_data_dict[String(ind)];
        new_state = {
          data_dict: new_data_dict,
          rowChanged: rowChanged + 1
        };
        setState(new_state, function () {
          _grabNewChunkWithRow(ind, false, null, false, null, function () {
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
    for (var index in data_dict_ref.current) {
      var the_row = data_dict_ref.current[index];
      if (the_row.name == name && the_row.res_type == res_type) {
        return data_dict_ref.current[index];
      }
    }
    return null;
  }
  function _match_row(row1, row2) {
    return row1.name == row2.name && row1.res_type == row2.res_type;
  }
  function _match_row_by_id(row1, row2) {
    return row1._id == row2._id;
  }
  function _match_any_row(row1, row_list) {
    var _iterator3 = _createForOfIteratorHelper(row_list),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var row2 = _step3.value;
        if (_match_row(row1, row2)) {
          return true;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    return false;
  }
  function set_in_data_dict(old_rows, new_val_dict, data_dict) {
    var new_data_dict = {};
    for (var index in data_dict_ref.current) {
      var entry = data_dict_ref.current[index];
      if (_match_any_row(entry, old_rows)) {
        for (var k in new_val_dict) {
          entry[k] = new_val_dict[k];
        }
      }
      new_data_dict[index] = entry;
    }
    return new_data_dict;
  }
  function get_data_dict_index(name, res_type) {
    for (var index in data_dict_ref.current) {
      if (_match_row(data_dict_ref.current[index], {
        name: name,
        res_type: res_type
      })) {
        return index;
      }
    }
    return null;
  }
  function get_data_dict_index_from_id(_id) {
    for (var index in data_dict_ref.current) {
      if (_match_row_by_id(data_dict_ref.current[index], {
        _id: _id
      })) {
        return index;
      }
    }
    return null;
  }
  function _extractNewTags(tstring) {
    var tlist = tstring.split(" ");
    var new_tags = [];
    var _iterator4 = _createForOfIteratorHelper(tlist),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var tag = _step4.value;
        if (!(tag.length == 0) && !(tag in tag_list)) {
          new_tags.push(tag);
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    return new_tags;
  }
  function _saveFromSelectedResource() {
    // This will only be called when there is a single row selected
    var result_dict = {
      "res_type": selected_rows_ref.current[0].res_type,
      "res_name": list_of_selected_ref.current[0],
      "tags": selected_resource_ref.current.tags,
      "notes": selected_resource_ref.current.notes
    };
    if (selected_rows_ref.current[0].res_type == "tile" && "icon" in selected_resource_ref.current) {
      result_dict["icon"] = selected_resource_ref.current["icon"];
    }
    var saved_selected_resource = Object.assign({}, selected_resource_ref.current);
    var saved_selected_rows = _toConsumableArray(selected_rows_ref.current);
    var new_tags = _extractNewTags(selected_resource_ref.current.tags);
    (0, _communication_react.postAjaxPromise)("save_metadata", result_dict).then(function (data) {})["catch"](_toaster.doFlash);
  }
  function _overwriteCommonTags() {
    var result_dict = {
      "selected_rows": selected_rows_ref.current,
      "tags": selected_resource_ref.current.tags
    };
    var new_tags = _extractNewTags(selected_resource_ref.current.tags);
    (0, _communication_react.postAjaxPromise)("overwrite_common_tags", result_dict).then(function (data) {})["catch"](_toaster.doFlash);
  }
  function _handleMetadataChange(changed_state_elements) {
    if (!multi_select_ref.current) {
      var revised_selected_resource = Object.assign({}, selected_resource_ref.current);
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
      var _revised_selected_resource = Object.assign({}, selected_resource_ref.current);
      _revised_selected_resource = Object.assign(_revised_selected_resource, changed_state_elements);
      _revised_selected_resource["tags"] = _revised_selected_resource["tags"].join(" ");
      set_selected_resource(_revised_selected_resource);
      pushCallback(_overwriteCommonTags);
    }
  }
  function _handleSplitResize(left_width, right_width, width_fraction) {
    if (!resizing.current) {
      set_left_width_fraction(width_fraction);
    }
  }
  function _handleSplitResizeStart() {
    resizing.current = true;
  }
  function _handleSplitResizeEnd(width_fraction) {
    resizing.current = false;
    set_left_width_fraction(width_fraction);
  }
  function _doTagDelete(tag) {
    var result_dict = {
      "pane_type": props.pane_type,
      "tag": tag
    };
    (0, _communication_react.postAjaxPromise)("delete_tag", result_dict).then(function (data) {
      _refresh_func();
    })["catch"](_toaster.doFlash);
  }
  function _doTagRename(tag_changes) {
    var result_dict = {
      "pane_type": props.pane_type,
      "tag_changes": tag_changes
    };
    (0, _communication_react.postAjaxPromise)("rename_tag", result_dict).then(function (data) {
      _refresh_func();
    })["catch"](_toaster.doFlash);
  }
  function _handleRowDoubleClick(row_dict) {
    var view_view = view_views(props.is_repository)[row_dict.res_type];
    if (view_view == null) return;
    statusFuncs.setStatus({
      show_spinner: true,
      status_message: "Opening ..."
    });
    set_selected_resource(row_dict);
    set_multi_select(false);
    set_list_of_selected([row_dict.name]);
    set_selected_rows([row_dict]);
    pushCallback(function () {
      if (window.in_context) {
        var re = new RegExp("/$");
        view_view = view_view.replace(re, "_in_context");
        (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + view_view, {
          context_id: context_id,
          resource_name: row_dict.name
        }).then(function (data) {
          props.handleCreateViewer(data, statusFuncs.clearStatus);
        })["catch"](function (data) {
          (0, _toaster.doFlash)(data);
          statusFuncs.clearStatus();
        });
      } else {
        statusFuncs.clearStatus();
        window.open($SCRIPT_ROOT + view_view + row_dict.name);
      }
    });
  }
  function _selectedTypes() {
    var the_types = selected_rows_ref.current.map(function (row) {
      return row.res_type;
    });
    the_types = _toConsumableArray(new Set(the_types));
    return the_types;
  }
  function _handleRowSelection(selected_rows) {
    if (!multi_select_ref.current) {
      var sres = selected_resource_ref.current;
      if (sres.name != "" && get_data_dict_entry(sres.name, sres.res_type) && sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes) {
        _saveFromSelectedResource();
      }
    }
    if (selected_rows.length > 1) {
      var common_tags = selected_rows[0].tags.split(" ");
      var other_rows = selected_rows.slice(1, selected_rows.length);
      var _iterator5 = _createForOfIteratorHelper(other_rows),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var row_dict = _step5.value;
          var new_common_tags = [];
          var new_tag_list = row_dict.tags.split(" ");
          var _iterator6 = _createForOfIteratorHelper(new_tag_list),
            _step6;
          try {
            for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
              var tag = _step6.value;
              if (common_tags.includes(tag)) {
                new_common_tags.push(tag);
              }
            }
          } catch (err) {
            _iterator6.e(err);
          } finally {
            _iterator6.f();
          }
          common_tags = new_common_tags;
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      var multi_select_list = selected_rows.map(function (row_dict) {
        return row_dict.name;
      });
      var new_selected_resource = {
        name: "__multiple__",
        tags: common_tags.join(" "),
        notes: ""
      };
      set_selected_resource(new_selected_resource);
      set_multi_select(true);
      set_list_of_selected(multi_select_list);
      set_selected_rows(selected_rows);
    } else {
      var _row_dict = selected_rows[0];
      set_selected_resource(_row_dict);
      set_multi_select(false);
      set_list_of_selected([_row_dict.name]);
      set_selected_rows(selected_rows);
    }
  }
  function _filter_func(resource_dict, search_string) {
    try {
      return resource_dict.name.toLowerCase().search(search_string) != -1;
    } catch (e) {
      return false;
    }
  }
  function _unsearch() {
    if (search_string_ref.current != "") {
      set_search_string("");
    } else if (active_tag_ref.current != "all") {
      _update_search_state({
        "active_tag": "all"
      });
    } else if (props.pane_type == "all" && filterTypeRef.current != "all") {
      _setFilterType("all");
    }
  }
  function _update_search_state(new_state) {
    setState(new_state);
    pushCallback(function () {
      if (search_spec_changed(new_state)) {
        clearSelected();
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
  function _set_sort_state(column_name, direction) {
    var spec_update = {
      sort_field: column_name,
      sort_direction: direction
    };
    set_sort_field(column_name);
    set_sort_direction(direction);
    pushCallback(function () {
      if (search_spec_changed(spec_update)) {
        _grabNewChunkWithRow(0, true, spec_update, true);
      }
    });
  }
  function _handleArrowKeyPress(key) {
    if (multi_select_ref.current) return;
    var the_res = selected_resource_ref.current;
    var current_index = parseInt(get_data_dict_index(the_res.name, the_res.res_type));
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
  function _handleTableKeyPress(key) {
    if (key.code == "ArrowUp") {
      _handleArrowKeyPress("ArrowUp");
    } else if (key.code == "ArrowDown") {
      _handleArrowKeyPress("ArrowDown");
    }
  }
  function _selectRow(new_index) {
    if (!Object.keys(data_dict_ref.current).includes(String(new_index))) {
      _grabNewChunkWithRow(new_index, false, null, false, null, function () {
        _selectRow(new_index);
      });
    } else {
      var new_regions = [_table.Regions.row(new_index)];
      setState({
        selected_resource: data_dict_ref.current[new_index],
        list_of_selected: [data_dict_ref.current[new_index].name],
        selected_rows: [data_dict_ref.current[new_index]],
        multi_select: false,
        selectedRegions: new_regions
      });
    }
  }
  function _view_func() {
    var the_view = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (the_view == null) {
      the_view = view_views(props.is_repository)[selected_resource_ref.current.res_type];
    }
    statusFuncs.setStatus({
      show_spinner: true,
      status_message: "Opening ..."
    });
    if (window.in_context) {
      var re = new RegExp("/$");
      the_view = the_view.replace(re, "_in_context");
      (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + the_view, {
        context_id: context_id,
        resource_name: selected_resource_ref.current.name
      }).then(function (data) {
        props.handleCreateViewer(data, statusFuncs.clearStatus);
      })["catch"](function (data) {
        (0, _toaster.doFlash)(data);
        statusFuncs.clearstatus();
      });
    } else {
      statusFuncs.clearStatus();
      window.open($SCRIPT_ROOT + the_view + selected_resource_ref.current.name);
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
  function _view_resource(selected_resource) {
    var the_view = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var force_new_tab = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var resource_name = selected_resource.name;
    if (the_view == null) {
      the_view = view_views(props.is_repository)[selected_resource.res_type];
    }
    statusFuncs.setStatus({
      show_spinner: true,
      status_message: "Opening ..."
    });
    if (window.in_context && !force_new_tab) {
      var re = new RegExp("/$");
      the_view = the_view.replace(re, "_in_context");
      (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + the_view, {
        context_id: context_id,
        resource_name: resource_name
      }).then(function (data) {
        props.handleCreateViewer(data, statusFuncs.clearStatus);
      })["catch"](function (data) {
        (0, _toaster.doFlash)(data);
        statusFuncs.clearstatus();
      });
    } else {
      statusFuncs.clearStatus();
      window.open($SCRIPT_ROOT + the_view + resource_name);
    }
  }
  function _duplicate_func() {
    var row = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var the_row = row ? row : selected_resource_ref.current;
    var res_name = the_row.name;
    var res_type = the_row.res_type;
    $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function (data) {
      dialogFuncs.showModal("ModalDialog", {
        title: "Duplicate ".concat(res_type),
        field_title: "New Name",
        handleSubmit: DuplicateResource,
        default_value: res_name,
        existing_names: data.resource_names,
        checkboxes: [],
        handleCancel: null,
        handleClose: dialogFuncs.hideModal
      });
    });
    var duplicate_view = duplicate_views()[res_type];
    function DuplicateResource(new_name) {
      var result_dict = {
        "new_res_name": new_name,
        "res_to_copy": res_name,
        "library_id": props.library_id,
        "is_repository": false
      };
      (0, _communication_react.postAjaxPromise)(duplicate_view, result_dict).then(function (data) {
        // _grabNewChunkWithRow(0, true, null, false, new_name)
      });
      // .catch(doFlash)
    }
  }

  function _delete_func(resource) {
    var res_list = resource ? [resource] : selected_rows_ref.current;
    var confirm_text;
    if (res_list.length == 1) {
      var res_name = res_list[0].name;
      confirm_text = "Are you sure that you want to delete ".concat(res_name, "?");
    } else {
      confirm_text = "Are you sure that you want to delete multiple items?";
    }
    var first_index = 99999;
    var _iterator7 = _createForOfIteratorHelper(selected_rows_ref.current),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var row = _step7.value;
        var ind = parseInt(get_data_dict_index(row.name, row.res_type));
        if (ind < first_index) {
          first_index = ind;
        }
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Delete resources",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "delete",
      handleSubmit: function handleSubmit() {
        (0, _communication_react.postAjaxPromise)("delete_resource_list", {
          "resource_list": res_list
        }).then(function () {
          // let new_index = 0;
          // if (first_index > 0) {
          //     new_index = first_index - 1;
          // }
          // _grabNewChunkWithRow(new_index, true, null, true)
        });
      },
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _rename_func() {
    var row = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var res_type;
    var res_name;
    if (!row) {
      res_type = selected_resource_ref.current.res_type;
      res_name = selected_resource_ref.current.name;
    } else {
      res_type = row.res_type;
      res_name = row.name;
    }
    $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function (data) {
      var res_names = data["resource_names"];
      var index = res_names.indexOf(res_name);
      if (index >= 0) {
        res_names.splice(index, 1);
      }
      dialogFuncs.showModal("ModalDialog", {
        title: "Rename ".concat(res_type),
        field_title: "New Name",
        handleSubmit: RenameResource,
        handleCancel: null,
        handleClose: dialogFuncs.hideModal,
        default_value: res_name,
        existing_names: res_names,
        checkboxes: []
      });
    });
    function RenameResource(new_name) {
      var the_data = {
        "new_name": new_name
      };
      (0, _communication_react.postAjax)("rename_resource/".concat(res_type, "/").concat(res_name), the_data, renameSuccess);
      function renameSuccess(data) {
        if (!data.success) {
          (0, _toaster.doFlash)(data);
          return false;
        }
      }
    }
  }
  function _repository_copy_func() {
    if (!multi_select_ref.current) {
      var ImportResource = function ImportResource(new_name) {
        var result_dict = {
          "res_type": res_type,
          "res_name": res_name,
          "new_res_name": new_name
        };
        (0, _communication_react.postAjaxPromise)("/copy_from_repository", result_dict).then(_toaster.doFlash)["catch"](_toaster.doFlash);
      };
      var res_type = selected_resource_ref.current.res_type;
      var res_name = selected_resource_ref.current.name;
      $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function (data) {
        dialogFuncs.showModal("ModalDialog", {
          title: "Import ".concat(res_type),
          field_title: "New Name",
          handleSubmit: ImportResource,
          default_value: res_name,
          existing_names: data.resource_names,
          checkboxes: [],
          handleCancel: null,
          handleClose: dialogFuncs.hideModal
        });
      });
      return res_name;
    } else {
      var result_dict = {
        "selected_rows": selected_rows_ref.current
      };
      (0, _communication_react.postAjaxPromise)("/copy_from_repository", result_dict).then(_toaster.doFlash)["catch"](_toaster.doFlash);
      return "";
    }
  }
  function _send_repository_func() {
    var pane_type = props.pane_type;
    if (!multi_select_ref.current) {
      var ShareResource = function ShareResource(new_name) {
        var result_dict = {
          "pane_type": pane_type,
          "res_type": res_type,
          "res_name": res_name,
          "new_res_name": new_name
        };
        (0, _communication_react.postAjaxPromise)('/send_to_repository', result_dict).then(_toaster.doFlash)["catch"](_toaster.doFlash);
      };
      var res_type = selected_resource_ref.current.res_type;
      var res_name = selected_resource_ref.current.name;
      $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/" + res_type, function (data) {
        dialogFuncs.showModal("ModalDialog", {
          title: "Share ".concat(res_type),
          field_title: "New ".concat(res_type, " Name"),
          handleSubmit: ShareResource,
          default_value: res_name,
          existing_names: data.resource_names,
          checkboxes: [],
          handleCancel: null,
          handleClose: dialogFuncs.hideModal
        });
      });
      return res_name;
    } else {
      var result_dict = {
        "pane_type": pane_type,
        "selected_rows": selected_rows_ref.current
      };
      (0, _communication_react.postAjaxPromise)('/send_to_repository', result_dict).then(_toaster.doFlash)["catch"](_toaster.doFlash);
      return "";
    }
  }
  function _refresh_func() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    _grabNewChunkWithRow(0, true, null, true, callback);
  }
  function _new_notebook() {
    if (window.in_context) {
      var the_view = "".concat($SCRIPT_ROOT, "/new_notebook_in_context");
      (0, _communication_react.postAjaxPromise)(the_view, {
        resource_name: ""
      }).then(props.handleCreateViewer)["catch"](_toaster.doFlash);
    } else {
      window.open("".concat($SCRIPT_ROOT, "/new_notebook"));
    }
  }
  function _new_project() {
    if (window.in_context) {
      var the_view = "".concat($SCRIPT_ROOT, "/new_project_in_context");
      (0, _communication_react.postAjaxPromise)(the_view, {
        resource_name: ""
      }).then(props.handleCreateViewer)["catch"](_toaster.doFlash);
    } else {
      window.open("".concat($SCRIPT_ROOT, "/new_project"));
    }
  }
  function _downloadJupyter() {
    var res_name = selected_resource_ref.current.name;
    dialogFuncs.showModal("ModalDialog", {
      title: "Download Notebook as Jupyter Notebook",
      field_title: "New File Name",
      handleSubmit: function handleSubmit(new_name) {
        window.open("".concat($SCRIPT_ROOT, "/download_jupyter/") + res_name + "/" + new_name);
      },
      default_value: res_name + ".ipynb",
      existing_names: [],
      checkboxes: [],
      handleCancel: null,
      handleClose: dialogFuncs.hideModal
    });
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
    var new_url = "import_jupyter/".concat(props.library_id);
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _combineCollections() {
    var res_name = selected_resource_ref.current.name;
    if (!multi_select_ref.current) {
      var doTheCombine = function doTheCombine(other_name) {
        statusFuncs.startSpinner(true);
        var target = "".concat($SCRIPT_ROOT, "/combine_collections/").concat(res_name, "/").concat(other_name);
        $.post(target, function (data) {
          statusFuncs.stopSpinner();
          if (!data.success) {
            props.addErrorDrawerEntry({
              title: "Error combining collections",
              content: data.message
            });
          } else {
            (0, _toaster.doFlash)(data);
          }
        });
      };
      $.getJSON("".concat($SCRIPT_ROOT, "get_resource_names/collection"), function (data) {
        dialogFuncs.showModal("SelectDialog", {
          title: "Select a new collection to combine with " + res_name,
          select_label: "Collection to Combine",
          cancel_text: "Cancel",
          submit_text: "Combine",
          handleSubmit: doTheCombine,
          option_list: data.resource_names,
          handleClose: dialogFuncs.hideModal
        });
      });
    } else {
      $.getJSON("".concat($SCRIPT_ROOT, "get_resource_names/collection"), function (data) {
        dialogFuncs.showModal("ModalDialog", {
          title: "Combine Collections",
          field_title: "Name for combined collection",
          handleSubmit: CreateCombinedCollection,
          default_value: "NewCollection",
          existing_names: data.resource_names,
          checkboxes: [],
          handleCancel: null,
          handleClose: dialogFuncs.hideModal
        });
      });
    }
    function CreateCombinedCollection(new_name) {
      (0, _communication_react.postAjaxPromise)("combine_to_new_collection", {
        "original_collections": list_of_selected_ref.current,
        "new_name": new_name
      }).then(function (data) {
        _refresh_func();
        data.new_row;
      })["catch"](function (data) {
        props.addErrorDrawerEntry({
          title: "Error combining collections",
          content: data.message
        });
      });
    }
  }
  function _downloadCollection() {
    var resource_name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var res_name = resource_name ? resource_name : selected_resource_ref.current.name;
    dialogFuncs.showModal("ModalDialog", {
      title: "Download Collection",
      field_title: "New File Name",
      handleSubmit: function handleSubmit(new_name) {
        window.open("".concat($SCRIPT_ROOT, "/download_collection/") + res_name + "/" + new_name);
      },
      default_value: res_name,
      existing_names: [],
      checkboxes: [],
      handleCancel: null,
      handleClose: dialogFuncs.hideModal
    });
  }
  function _displayImportResults(data) {
    var title = "Collection Created";
    var message = "";
    var number_of_errors;
    if (data.file_decoding_errors == null) {
      data.message = "No decoding errors were encounters";
      data.alert_type = "Success";
      (0, _toaster.doFlash)(data);
    } else {
      message = "<b>Decoding errors were enountered</b>";
      for (var filename in data.file_decoding_errors) {
        number_of_errors = String(data.file_decoding_errors[filename].length);
        message = message + "<br>".concat(filename, ": ").concat(number_of_errors, " errors");
      }
      props.addErrorDrawerEntry({
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
  function _import_collection(myDropZone, setCurrentUrl, new_name, check_results) {
    var csv_options = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    var doc_type;
    if (check_results["import_as_freeform"]) {
      doc_type = "freeform";
    } else {
      doc_type = "table";
    }
    (0, _communication_react.postAjaxPromise)("create_empty_collection", {
      "collection_name": new_name,
      "doc_type": doc_type,
      "library_id": props.library_id,
      "csv_options": csv_options
    }).then(function (data) {
      var new_url = "append_documents_to_collection/".concat(new_name, "/").concat(doc_type, "/").concat(props.library_id);
      myDropZone.options.url = new_url;
      setCurrentUrl(new_url);
      myDropZone.processQueue();
    })["catch"](function (data) {});
  }
  function _tile_view() {
    _view_func("/view_module/");
  }
  function _view_named_tile(res) {
    var in_new_tab = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    _view_resource({
      name: res.name,
      res_type: "tile"
    }, "/view_module/", in_new_tab);
  }
  function _creator_view_named_tile(res) {
    var in_new_tab = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    _view_resource({
      name: res.tile,
      res_type: "tile"
    }, "/view_in_creator/", in_new_tab);
  }
  function _creator_view() {
    _view_func("/view_in_creator/");
  }
  function _showHistoryViewer() {
    window.open("".concat($SCRIPT_ROOT, "/show_history_viewer/").concat(selected_resource_ref.current.name));
  }
  function _compare_tiles() {
    var res_names = list_of_selected_ref.current;
    if (res_names.length == 0) return;
    if (res_names.length == 1) {
      window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/").concat(res_names[0]));
    } else if (res_names.length == 2) {
      window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/both_names/").concat(res_names[0], "/").concat(res_names[1]));
    } else {
      (0, _toaster.doFlash)({
        "alert-type": "alert-warning",
        "message": "Select only one or two tiles before launching compare"
      });
    }
  }
  function _load_tile() {
    var resource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var res_name = resource ? resource.name : selected_resource_ref.current.name;
    (0, _communication_react.postWithCallback)("host", "load_tile_module_task", {
      "tile_module_name": res_name,
      "user_id": window.user_id
    }, load_tile_response, null, props.library_id);
    function load_tile_response(data) {
      if (!data.success) {
        props.addErrorDrawerEntry({
          title: "Error loading tile",
          content: data.message
        });
      } else {
        (0, _toaster.doFlash)(data);
      }
    }
  }
  function _unload_module() {
    var resource = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var res_name = resource ? resource.name : selected_resource_ref.current.name;
    $.getJSON("".concat($SCRIPT_ROOT, "/unload_one_module/").concat(res_name), _toaster.doFlash);
  }
  function _unload_all_tiles() {
    $.getJSON("".concat($SCRIPT_ROOT, "/unload_all_tiles"), _toaster.doFlash);
  }
  function _new_tile(template_name) {
    $.getJSON($SCRIPT_ROOT + "get_resource_names/tile", function (data) {
      dialogFuncs.showModal("ModalDialog", {
        title: "New Tile",
        field_title: "New Tile Name",
        handleSubmit: CreateNewTileModule,
        default_value: "NewTileModule",
        existing_names: data.resource_names,
        checkboxes: [],
        handleCancel: null,
        handleClose: dialogFuncs.hideModal
      });
    });
    function CreateNewTileModule(new_name) {
      var result_dict = {
        "template_name": template_name,
        "new_res_name": new_name,
        "last_saved": "viewer"
      };
      (0, _communication_react.postAjaxPromise)("/create_tile_module", result_dict).then(function (data) {
        _refresh_func();
        _lodash["default"].view_resource({
          name: new_name,
          res_type: "tile"
        }, "/view_module/");
      })["catch"](function (data) {
        props.addErrorDrawerEntry({
          title: "Error creating new tile",
          content: data.message
        });
      });
    }
  }
  function _new_in_creator(template_name) {
    $.getJSON("".concat($SCRIPT_ROOT, "/get_resource_names/tile"), function (data) {
      dialogFuncs.showModal("ModalDialog", {
        title: "New Tile",
        field_title: "New Tile Name",
        handleSubmit: CreateNewTileModule,
        default_value: "NewTileModule",
        existing_names: data.resource_names,
        checkboxes: [],
        handleCancel: null,
        handleClose: dialogFuncs.hideModal
      });
    });
    function CreateNewTileModule(new_name) {
      var result_dict = {
        "template_name": template_name,
        "new_res_name": new_name,
        "last_saved": "creator"
      };
      (0, _communication_react.postAjaxPromise)("/create_tile_module", result_dict).then(function (data) {
        _refresh_func();
        _view_resource({
          name: String(new_name),
          res_type: "tile"
        }, "/view_in_creator/");
      })["catch"](function (data) {
        props.addErrorDrawerEntry({
          title: "Error creating new tile",
          content: data.message
        });
      });
    }
  }
  function _new_list(template_name) {
    $.getJSON("".concat($SCRIPT_ROOT, "/get_resource_names/list"), function (data) {
      dialogFuncs.showModal("ModalDialog", {
        title: "New List Resource",
        field_title: "New List Name",
        handleSubmit: CreateNewListResource,
        default_value: "NewListResource",
        existing_names: data.resource_names,
        checkboxes: [],
        handleCancel: null,
        handleClose: dialogFuncs.hideModal
      });
    });
    function CreateNewListResource(new_name) {
      var result_dict = {
        "template_name": template_name,
        "new_res_name": new_name
      };
      (0, _communication_react.postAjaxPromise)("/create_list", result_dict).then(function (data) {
        _refresh_func();
        _view_resource({
          name: String(new_name),
          res_type: "list"
        }, "/view_list/");
      })["catch"](function (data) {
        props.addErrorDrawerEntry({
          title: "Error creating new list resource",
          content: data.message
        });
      });
    }
  }
  function _add_list(myDropZone, setCurrentUrl) {
    var new_url = "import_list/".concat(props.library_id);
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
    var new_url = "import_pool/".concat(props.library_id);
    myDropZone.options.url = new_url;
    setCurrentUrl(new_url);
    myDropZone.processQueue();
  }
  function _new_code(template_name) {
    $.getJSON("".concat($SCRIPT_ROOT, "/get_resource_names/code"), function (data) {
      dialogFuncs.showModal("ModalDialog", {
        title: "New Code Resource",
        field_title: "New Code Resource Name",
        handleSubmit: CreateNewCodeResource,
        default_value: "NewCodeResource",
        existing_names: data.resource_names,
        checkboxes: [],
        handleCancel: null,
        handleClose: dialogFuncs.hideModal
      });
    });
    function CreateNewCodeResource(new_name) {
      var result_dict = {
        "template_name": template_name,
        "new_res_name": new_name
      };
      (0, _communication_react.postAjaxPromise)("/create_code", result_dict).then(function (data) {
        _refresh_func();
        _view_resource({
          name: String(new_name),
          res_type: "code"
        }, "/view_code/");
      })["catch"](function (data) {
        props.addErrorDrawerEntry({
          title: "Error creating new code resource",
          content: data.message
        });
      });
    }
  }
  function get_left_pane_height() {
    var left_pane_height;
    if (tr_bounding_top.current) {
      left_pane_height = window.innerHeight - tr_bounding_top.current - _sizing_tools.BOTTOM_MARGIN;
    } else if (table_ref && table_ref.current) {
      left_pane_height = window.innerHeight - table_ref.current.getBoundingClientRect().top - _sizing_tools.BOTTOM_MARGIN;
    } else {
      table_width = left_width - 150;
      left_pane_height = props.usable_height - 100;
    }
    return left_pane_height;
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
      // showPoolImport: _showPoolImport,
      new_code: _new_code
    };
  }
  var new_button_groups;
  var uwidth = props.usable_width;
  var left_width = uwidth * left_width_fraction_ref.current;
  var primary_mdata_fields = ["name", "created", "updated", "tags", "notes"];
  var ignore_fields = ["doc_type", "res_type"];
  var additional_metadata = {};
  var selected_resource_icon = null;
  for (var field in selected_resource_ref.current) {
    if (selected_rows_ref.current.length == 1 && selected_resource_ref.current.res_type == "tile" && field == "icon") {
      selected_resource_icon = selected_resource_ref.current["icon"];
    }
    if (!primary_mdata_fields.includes(field) && !ignore_fields.includes(field) && !field.startsWith("icon:")) {
      additional_metadata[field] = selected_resource_ref.current[field];
    }
  }
  if (Object.keys(additional_metadata).length == 0) {
    additional_metadata = null;
  }

  // let right_pane;
  var split_tags = selected_resource_ref.current.tags == "" ? [] : selected_resource_ref.current.tags.split(" ");
  var outer_style = {
    marginTop: 0,
    marginLeft: 5,
    overflow: "auto",
    padding: 15,
    marginRight: 0,
    height: "100%"
  };
  var right_pane = /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
    tags: split_tags,
    all_tags: tag_list,
    elevation: 2,
    name: selected_resource_ref.current.name,
    created: selected_resource_ref.current.created,
    updated: selected_resource_ref.current.updated,
    notes: selected_resource_ref.current.notes,
    icon: selected_resource_icon,
    handleChange: _handleMetadataChange,
    res_type: selected_resource_ref.current.res_type,
    pane_type: props.pane_type,
    outer_style: outer_style,
    handleNotesBlur: null,
    additional_metadata: additional_metadata,
    readOnly: props.is_repository
  });
  var th_style = {
    "display": "inline-block",
    "verticalAlign": "top",
    "maxHeight": "100%",
    "overflowY": "scroll",
    "overflowX": "scroll",
    "lineHeight": 1,
    "whiteSpace": "nowrap"
  };
  var MenubarClass = props.MenubarClass;
  var table_width;
  var left_pane_height = get_left_pane_height();
  if (table_ref && table_ref.current) {
    table_width = left_width - table_ref.current.offsetLeft + top_ref.current.offsetLeft;
  } else {
    table_width = left_width - 150;
  }
  var key_bindings = [[["up"], function () {
    return _handleArrowKeyPress("ArrowUp");
  }], [["down"], function () {
    return _handleArrowKeyPress("ArrowDown");
  }], [["esc"], _unsearch]];
  var filter_buttons = [];
  var _iterator8 = _createForOfIteratorHelper(["all"].concat(res_types)),
    _step8;
  try {
    var _loop = function _loop() {
      var rtype = _step8.value;
      filter_buttons.push( /*#__PURE__*/_react["default"].createElement(_popover.Tooltip2, {
        content: rtype,
        key: rtype,
        placement: "top",
        hoverOpenDelay: 700,
        intent: "warning"
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        icon: _blueprint_mdata_fields.icon_dict[rtype],
        minimal: true,
        active: rtype == filterTypeRef.current,
        onClick: function onClick() {
          _setFilterType(rtype);
        }
      })));
    };
    for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator8.e(err);
  } finally {
    _iterator8.f();
  }
  var left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row",
    style: {
      maxHeight: "100%",
      position: "relative"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex justify-content-around",
    style: {
      paddingRight: 10,
      maxHeight: left_pane_height
    }
  }, /*#__PURE__*/_react["default"].createElement(_tag_buttons_react.TagButtonList, {
    tag_list: tag_list,
    expanded_tags: expanded_tags_ref.current,
    active_tag: active_tag_ref.current,
    updateTagState: _update_search_state,
    doTagDelete: _doTagDelete,
    doTagRename: _doTagRename
  })), /*#__PURE__*/_react["default"].createElement("div", {
    ref: table_ref,
    className: props.pane_type + "-pane",
    style: {
      width: table_width,
      maxWidth: total_width,
      maxHeight: left_pane_height - 20,
      // The 20 is for the marginTop and padding
      overflowY: "scroll",
      marginTop: 15,
      padding: 5
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column"
    }
  }, props.pane_type == "all" && /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: "Filter:",
    inline: true,
    style: {
      marginBottom: 0
    }
  }, filter_buttons), /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
    allow_search_inside: props.allow_search_inside,
    allow_search_metadata: props.allow_search_metadata,
    allow_show_hidden: true,
    update_search_state: _update_search_state,
    search_string: search_string_ref.current,
    search_inside: search_inside_ref.current,
    show_hidden: show_hidden_ref.current,
    search_metadata: search_metadata_ref.current
  })), /*#__PURE__*/_react["default"].createElement(_library_widgets.BpSelectorTable, {
    data_dict: data_dict_ref.current,
    rowChanged: rowChanged,
    columns: props.columns,
    num_rows: num_rows,
    open_resources_ref: props.open_resources_ref,
    sortColumn: _set_sort_state,
    selectedRegions: selectedRegionsRef.current,
    communicateColumnWidthSum: set_total_width,
    onSelection: _onTableSelection,
    keyHandler: _handleTableKeyPress,
    initiateDataGrab: _grabNewChunkWithRow,
    renderBodyContextMenu: _renderBodyContextMenu,
    handleRowDoubleClick: _handleRowDoubleClick
  }))));
  var selected_types = _selectedTypes();
  selectedTypeRef.current = selected_types.length == 1 ? selected_resource_ref.current.res_type : "multi";
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(MenubarClass, _extends({
    selected_resource: selected_resource_ref.current,
    connection_status: props.connection_status,
    multi_select: multi_select_ref.current,
    list_of_selected: list_of_selected_ref.current,
    selected_rows: selected_rows_ref.current,
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
  })), /*#__PURE__*/_react["default"].createElement("div", {
    ref: top_ref,
    className: "d-flex flex-column"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      width: uwidth,
      height: props.usable_height
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    available_width: uwidth,
    available_height: props.usable_height,
    show_handle: true,
    left_pane: left_pane,
    right_pane: right_pane,
    right_pane_overflow: "auto",
    initial_width_fraction: .75,
    scrollAdjustSelectors: [".bp5-table-quadrant-scroll-container"],
    handleSplitUpdate: _handleSplitResize,
    handleResizeStart: _handleSplitResizeStart,
    handleResizeEnd: _handleSplitResizeEnd
  })), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
    global: true,
    bindings: key_bindings
  })));
}
exports.LibraryPane = LibraryPane = /*#__PURE__*/(0, _react.memo)(LibraryPane);
LibraryPane.propTypes = {
  columns: _propTypes["default"].object,
  pane_type: _propTypes["default"].string,
  open_resources_ref: _propTypes["default"].object,
  allow_search_inside: _propTypes["default"].bool,
  allow_search_metadata: _propTypes["default"].bool,
  updatePaneState: _propTypes["default"].func,
  is_repository: _propTypes["default"].bool,
  left_width_fraction: _propTypes["default"].number,
  selected_resource: _propTypes["default"].object,
  selected_rows: _propTypes["default"].array,
  sort_field: _propTypes["default"].string,
  sorting_field: _propTypes["default"].string,
  sort_direction: _propTypes["default"].string,
  filterType: _propTypes["default"].string,
  multi_select: _propTypes["default"].bool,
  list_of_selected: _propTypes["default"].array,
  search_string: _propTypes["default"].string,
  search_inside: _propTypes["default"].bool,
  search_metadata: _propTypes["default"].bool,
  show_hidden: _propTypes["default"].bool,
  search_tag: _propTypes["default"].string,
  tag_button_state: _propTypes["default"].object,
  contextItems: _propTypes["default"].array,
  library_id: _propTypes["default"].string
};
LibraryPane.defaultProps = {
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
  tsocket: null
};