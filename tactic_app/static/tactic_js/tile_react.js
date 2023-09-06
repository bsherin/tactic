"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TileContainer = TileContainer;
exports.tilesReducer = tilesReducer;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _reactTransitionGroup = require("react-transition-group");
var _lodash = _interopRequireDefault(require("lodash"));
var _tile_form_react = require("./tile_form_react");
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _resizing_layouts = require("./resizing_layouts");
var _sortable_container = require("./sortable_container");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _utilities_react = require("./utilities_react");
var _error_boundary = require("./error_boundary");
var _menu_utilities = require("./menu_utilities");
var _searchable_console = require("./searchable_console");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); } // noinspection XmlDeprecatedElement
var using_touch = ("ontouchend" in document);
var click_event = using_touch ? "touchstart" : "click";
var TILE_DISPLAY_AREA_MARGIN = 15;
var ANI_DURATION = 300;
function composeObjs(base_style, new_style) {
  return Object.assign(Object.assign({}, base_style), new_style);
}
function tilesReducer(tile_list, action) {
  var new_items;
  switch (action.type) {
    case "initialize":
      new_items = action.new_items;
      break;
    case "delete_item":
      new_items = tile_list.filter(function (t) {
        return t.tile_id !== action.tile_id;
      });
      break;
    case "change_item_value":
      new_items = tile_list.map(function (t) {
        if (t.tile_id === action.tile_id) {
          var new_t = _objectSpread({}, t);
          new_t[action.field] = action.new_value;
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "change_item_state":
      new_items = tile_list.map(function (t) {
        if (t.tile_id === action.tile_id) {
          var new_t = _objectSpread({}, t);
          for (var field in action.new_state) {
            new_t[field] = action.new_state[field];
          }
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "change_items_value":
      new_items = tile_list.map(function (t) {
        if (action.id_list.includes(t.tile_id)) {
          var new_t = _objectSpread({}, t);
          new_t[action.field] = action.new_value;
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "update_items":
      new_items = tile_list.map(function (t) {
        if (t.unique_id in action.updates) {
          var update_dict = action.updates[t.unique_id];
          return _objectSpread(_objectSpread({}, t), update_dict);
        } else {
          return t;
        }
      });
      break;
    case "move_item":
      var old_list = _toConsumableArray(tile_list);
      new_items = (0, _utilities_react.arrayMove)(old_list, action.oldIndex, action.newIndex);
      break;
    case "add_at_index":
      new_items = _toConsumableArray(tile_list);
      new_items.splice(action.insert_index, 0, action.new_item);
      break;
    default:
      console.log("Got Unknown action: " + action.type);
      return _toConsumableArray(tile_list);
  }
  return new_items;
}
function TileContainer(props) {
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  (0, _react.useEffect)(function () {
    initSocket();
  }, []);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  function _handleTileFinishedLoading(data) {
    _setTileValue(data.tile_id, "finished_loading", true);
  }
  function _handleTileSourceChange(data) {
    _markSourceChange(data.tile_type);
  }
  function initSocket() {
    props.tsocket.attachListener("tile-message", _handleTileMessage);
    props.tsocket.attachListener("tile-finished-loading", _handleTileFinishedLoading);
    props.tsocket.attachListener('tile-source-change', _handleTileSourceChange);
  }
  function _resortTiles(_ref) {
    var destination = _ref.destination,
      source = _ref.source;
    props.tileDispatch({
      type: "move_item",
      oldIndex: source.index,
      newIndex: destination.index
    });
  }
  function _markSourceChange(tile_type) {
    var change_list = [];
    var _iterator = _createForOfIteratorHelper(props.tile_list.current),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var entry = _step.value;
        if (entry.tile_type == tile_type) {
          change_list.push(entry.tile_id);
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    props.tileDispatch({
      type: "change_items_value",
      id_list: change_list,
      field: "source_changed",
      new_value: true
    });
  }
  function get_tile_entry(tile_id) {
    var tindex = tileIndex(tile_id);
    if (tindex == -1) return null;
    return _lodash["default"].cloneDeep(props.tile_list.current[tileIndex(tile_id)]);
  }
  function tileIndex(tile_id) {
    var counter = 0;
    var _iterator2 = _createForOfIteratorHelper(props.tile_list.current),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var entry = _step2.value;
        if (entry.tile_id == tile_id) {
          return counter;
        }
        ++counter;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return -1;
  }
  function _closeTile(tile_id) {
    props.tileDispatch({
      type: "delete_item",
      tile_id: tile_id
    });
    var data_dict = {
      main_id: props.main_id,
      tile_id: tile_id
    };
    (0, _communication_react.postWithCallback)(props.main_id, "RemoveTile", data_dict, null, null, props.main_id);
  }
  function _setTileValue(tile_id, field, value) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    props.tileDispatch({
      type: "change_item_value",
      tile_id: tile_id,
      field: field,
      new_value: value
    });
    pushCallback(callback);
  }
  function _setTileState(tile_id, new_state) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    props.tileDispatch({
      type: "change_item_state",
      tile_id: tile_id,
      new_state: new_state
    });
    pushCallback(callback);
  }
  function _displayTileContentWithJavascript(tile_id, data) {
    _setTileState(tile_id, {
      front_content: data.html,
      javascript_code: data.javascript_code,
      javascript_arg_dict: data.arg_dict
    });
  }
  function _displayTileContent(tile_id, data) {
    _setTileState(tile_id, {
      front_content: data.html,
      javascript_code: null,
      javascript_arg_dict: null
    });
  }
  function _handleTileMessage(data) {
    var tile_id = data.tile_id;
    if (tileIndex(tile_id) != -1) {
      var handlerDict = {
        hideOptions: function hideOptions(tile_id, data) {
          return _setTileValue(tile_id, "show_form", false);
        },
        startSpinner: function startSpinner(tile_id, data) {
          return _setTileValue(tile_id, "show_spinner", true);
        },
        stopSpinner: function stopSpinner(tile_id, data) {
          return _setTileValue(tile_id, "show_spinner", false);
        },
        displayTileContent: _displayTileContent,
        displayFormContent: function displayFormContent(tile_id, data) {
          return _setTileValue(tile_id, "form_data", data.form_data);
        },
        displayTileContentWithJavascript: _displayTileContentWithJavascript
      };
      if (data.tile_message in handlerDict) {
        handlerDict[data.tile_message](tile_id, data);
      }
    }
  }
  var outer_style = {
    height: props.height
  };
  return /*#__PURE__*/_react["default"].createElement(_sortable_container.SortableComponent, {
    id: "tile-div",
    main_id: props.main_id,
    style: outer_style,
    helperClass: theme.dark_theme ? "bp5-dark" : "light-theme",
    goToModule: props.goToModule,
    ElementComponent: TileComponent,
    key_field_name: "tile_name",
    item_list: _lodash["default"].cloneDeep(props.tile_list.current),
    handle: ".tile-name-div",
    onSortStart: function onSortStart(_, event) {
      return event.preventDefault();
    } // This prevents Safari weirdness
    ,
    onDragEnd: _resortTiles,
    handleClose: _closeTile,
    setTileValue: _setTileValue,
    tsocket: props.tsocket,
    setTileState: _setTileState,
    table_is_shrunk: props.table_is_shrunk,
    current_doc_name: props.current_doc_name,
    selected_row: props.selected_row,
    broadcast_event: props.broadcast_event,
    useDragHandle: true,
    axis: "xy"
  });
}
TileContainer.propTypes = {
  setMainStateValue: _propTypes["default"].func,
  table_is_shrunk: _propTypes["default"].bool,
  tile_list: _propTypes["default"].object,
  tile_div_ref: _propTypes["default"].object,
  current_doc_name: _propTypes["default"].string,
  height: _propTypes["default"].number,
  broadcast_event: _propTypes["default"].func,
  selected_row: _propTypes["default"].number,
  goToModule: _propTypes["default"].func
};
exports.TileContainer = TileContainer = /*#__PURE__*/(0, _react.memo)(TileContainer);
function SortHandle(props) {
  return /*#__PURE__*/_react["default"].createElement("span", _extends({
    className: "tile-name-div"
  }, props.dragHandleProps), /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: "drag-handle-vertical",
    size: 15
  }), props.tile_name);
}
SortHandle.propTypes = {
  tile_name: _propTypes["default"].string
};
SortHandle = /*#__PURE__*/(0, _react.memo)(SortHandle);
function TileComponent(props) {
  var my_ref = (0, _react.useRef)(null);
  var body_ref = (0, _react.useRef)(null);
  var inner_log_ref = (0, _react.useRef)(null);
  var tda_ref = (0, _react.useRef)(null);
  var log_ref = (0, _react.useRef)(null);
  var left_glyphs_ref = (0, _react.useRef)(null);
  var right_glyphs_ref = (0, _react.useRef)(null);
  var last_front_content = (0, _react.useRef)("");
  var _useState = (0, _react.useState)(34),
    _useState2 = _slicedToArray(_useState, 2),
    header_height = _useState2[0],
    set_header_height = _useState2[1];
  var _useState3 = (0, _react.useState)(1000),
    _useState4 = _slicedToArray(_useState3, 2),
    max_name_width = _useState4[0],
    set_max_name_width = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    resizing = _useState6[0],
    set_resizing = _useState6[1];
  var _useState7 = (0, _react.useState)(0),
    _useState8 = _slicedToArray(_useState7, 2),
    dwidth = _useState8[0],
    set_dwidth = _useState8[1];
  var _useState9 = (0, _react.useState)(0),
    _useState10 = _slicedToArray(_useState9, 2),
    dheight = _useState10[0],
    set_dheight = _useState10[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  (0, _react.useEffect)(function () {
    _broadcastTileSize(props.tile_width, props.tile_height);
    executeEmbeddedScripts();
    makeTablesSortable();
    if (props.javascript_code) {
      _executeJavascript();
    }
    listen_for_clicks();
  }, []);
  (0, _react.useEffect)(function () {
    if (!resizing) {
      executeEmbeddedScripts();
    }
    makeTablesSortable();
    if (props.javascript_code) {
      _executeJavascript();
    }
    listen_for_clicks();
    if (props.show_log) {
      if (log_ref && log_ref.current) {
        log_ref.current.scrollTo(0, log_ref.current.scrollHeight);
      }
    }
  });
  (0, _react.useEffect)(function () {
    _broadcastTileSize(props.tile_width, props.tile_height);
  }, [props.tile_width, props.tile_height]);
  var menu_component = _createMenu();

  // Broadcasting the tile size is necessary because some tiles (notably matplotlib tiles)
  // need to know the size of the display area.
  function _broadcastTileSize() {
    (0, _communication_react.postWithCallback)(props.tile_id, "TileSizeChange", {
      width: tdaWidth(),
      height: tdaHeight()
    }, null, null, props.main_id);
  }
  function _resizeTileArea(dx, dy) {
    var hheight = $(body_ref.current).position().top;
    set_header_height(hheight);
    var new_state = {
      tile_height: props.tile_height + dy,
      tile_width: props.tile_width + dx
    };
    props.setTileState(props.tile_id, new_state);
  }
  function executeEmbeddedScripts() {
    if (props.front_content != last_front_content.current) {
      // to avoid doubles of bokeh images
      last_front_content.current = props.front_content;
      var scripts = $("#" + props.tile_id + " .tile-display-area script").toArray();
      var _iterator3 = _createForOfIteratorHelper(scripts),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var script = _step3.value;
          try {
            window.eval(script.text);
          } catch (e) {}
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
  }
  function makeTablesSortable() {
    var tables = $("#" + props.tile_id + " table.sortable").toArray();
    var _iterator4 = _createForOfIteratorHelper(tables),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var table = _step4.value;
        sorttable.makeSortable(table);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
  }
  function tdaWidth() {
    return props.tile_width + dwidth - TILE_DISPLAY_AREA_MARGIN * 2;
  }
  function tdaHeight() {
    return props.tile_height + dheight - header_height - TILE_DISPLAY_AREA_MARGIN * 2;
  }
  function _executeJavascript() {
    try {
      var selector = "[id='" + props.tile_id + "'] .jscript-target";
      eval(props.javascript_code)(selector, tdaWidth(), tdaHeight(), props.javascript_arg_dict, resizing);
    } catch (err) {
      (0, _toaster.doFlash)({
        "alert-type": "alert-warning",
        "message": "Error evaluating javascript: " + err.message
      });
    }
  }
  function _toggleTileLog() {
    props.setTileState(props.tile_id, {
      show_log: !props.show_log,
      show_form: false
    });
  }
  function _toggleShrunk() {
    props.setTileValue(props.tile_id, "shrunk", !props.shrunk);
  }
  function _closeTile() {
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Delete Tile",
      text_body: "Delete tile ".concat(props.tile_name),
      cancel_text: "do nothing",
      submit_text: "delete",
      handleSubmit: function handleSubmit() {
        props.handleClose(props.tile_id);
      },
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }
  function _standard_click_data() {
    return {
      tile_id: props.tile_id,
      main_id: props.main_id,
      doc_name: props.current_doc_name,
      active_row_id: props.selected_row
    };
  }
  function _updateOptionValue(option_name, value) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var data_dict = {
      tile_id: props.tile_id,
      option_name: option_name,
      value: value
    };
    (0, _communication_react.postWithCallback)(props.tile_id, "_update_single_option", data_dict, function (data) {
      if (data && "form_data" in data) {
        props.setTileValue(props.tile_id, "form_data", data.form_data, callback);
      }
    });
  }
  function _toggleBack() {
    props.setTileState(props.tile_id, {
      show_log: false,
      show_form: !props.show_form
    });
  }
  function _setTileBack(show_form) {
    props.setTileValue(props.tile_id, "show_form", show_form);
  }
  function _handleSubmitOptions() {
    props.setTileState(props.tile_id, {
      show_form: false,
      show_spinner: true
    });
    var data = {};
    var _iterator5 = _createForOfIteratorHelper(props.form_data),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var opt = _step5.value;
        data[opt.name] = opt.starting_value;
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    data.tile_id = props.tile_id;
    props.broadcast_event("UpdateOptions", data);
  }
  function _startSpinner() {
    props.setTileValue(props.tile_id, "show_spinner", true);
  }
  function _stopSpinner() {
    props.setTileValue(props.tile_id, "show_spinner", false);
  }
  function _displayFormContent(data) {
    props.setTileValue(props.tile_id, "form_data", data.form_data);
  }
  function spin_and_refresh() {
    _startSpinner();
    (0, _communication_react.postWithCallback)(props.tile_id, "RefreshTile", {}, function () {
      _stopSpinner();
    }, null, props.main_id);
  }
  function _reloadTile() {
    var resubmit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    var data_dict = {
      "tile_id": props.tile_id,
      "tile_name": props.tile_name
    };
    _startSpinner();
    (0, _communication_react.postWithCallback)(props.main_id, "reload_tile", data_dict, reload_success, null, props.main_id);
    function reload_success(data) {
      if (data.success) {
        _displayFormContent(data);
        props.setTileValue(props.tile_id, "source_changed", false);
        if (data.options_changed || !resubmit) {
          _stopSpinner();
          _setTileBack(true);
        } else {
          spin_and_refresh();
        }
      }
    }
  }
  function listen_for_clicks() {
    $(body_ref.current).off();
    $(body_ref.current).on(click_event, '.element-clickable', function (e) {
      var data_dict = _standard_click_data();
      var dset = e.target.dataset;
      data_dict.dataset = {};
      for (var key in dset) {
        if (!dset.hasOwnProperty(key)) continue;
        data_dict.dataset[key] = dset[key];
      }
      (0, _communication_react.postWithCallback)(props.tile_id, "TileElementClick", data_dict, null, null, props.main_id);
      e.stopPropagation();
    });
    $(body_ref.current).on(click_event, '.word-clickable', function (e) {
      var data_dict = _standard_click_data();
      var s = window.getSelection();
      var range = s.getRangeAt(0);
      var node = s.anchorNode;
      while (range.toString().indexOf(' ') !== 0 && range.startOffset !== 0) {
        range.setStart(node, range.startOffset - 1);
      }
      var nlen = node.textContent.length;
      if (range.startOffset !== 0) {
        range.setStart(node, range.startOffset + 1);
      }
      do {
        range.setEnd(node, range.endOffset + 1);
      } while (range.toString().indexOf(' ') == -1 && range.toString().trim() !== '' && range.endOffset < nlen);
      data_dict.clicked_text = range.toString().trim();
      (0, _communication_react.postWithCallback)(props.tile_id, "TileWordClick", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on(click_event, '.cell-clickable', function (e) {
      var data_dict = _standard_click_data();
      data_dict.clicked_cell = $(this).text();
      (0, _communication_react.postWithCallback)(props.tile_id, "TileCellClick", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on(click_event, '.row-clickable', function (e) {
      var data_dict = _standard_click_data();
      var cells = $(this).children();
      var row_vals = [];
      cells.each(function () {
        row_vals.push($(this).text());
      });
      data_dict["clicked_row"] = row_vals;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileRowClick", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on(click_event, '.front button', function (e) {
      var data_dict = _standard_click_data();
      data_dict["button_value"] = e.target.value;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileButtonClick", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on('submit', '.front form', function (e) {
      var data_dict = _standard_click_data();
      var form_data = {};
      var the_form = e.target;
      for (var i = 0; i < the_form.length; i += 1) {
        form_data[the_form[i]["name"]] = the_form[i]["value"];
      }
      data_dict["form_data"] = form_data;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileFormSubmit", data_dict, null, null, props.main_id);
      return false;
    });
    $(body_ref.current).on("change", '.front select', function (e) {
      var data_dict = _standard_click_data();
      data_dict.select_value = e.target.value;
      data_dict.select_name = e.target.name;
      (0, _communication_react.postWithCallback)(props.tile_id, "SelectChange", data_dict, null, null, props.main_id);
    });
    $(body_ref.current).on('change', '.front textarea', function (e) {
      var data_dict = _standard_click_data();
      data_dict["text_value"] = e.target.value;
      (0, _communication_react.postWithCallback)(props.tile_id, "TileTextAreaChange", data_dict, null, null, props.main_id);
    });
  }
  var front_style;
  var tda_style;
  var back_style;
  var tile_log_style;
  var panel_body_style;
  var main_style;
  var transitionStylesAltUp;
  var transitionStylesAltDown;
  var transitionFadeStyles;
  var lg_style;
  function compute_styles() {
    var the_margin = 15;
    var tile_height = props.shrunk ? header_height : props.tile_height;
    front_style = {
      width: props.tile_width,
      height: tile_height - header_height
    };
    tda_style = {
      width: props.tile_width - TILE_DISPLAY_AREA_MARGIN * 2,
      height: tile_height - header_height - TILE_DISPLAY_AREA_MARGIN * 2
    };
    if (left_glyphs_ref.current && right_glyphs_ref.current) {
      var lg_rect = left_glyphs_ref.current.getBoundingClientRect();
      var rg_rect = right_glyphs_ref.current.getBoundingClientRect();
      var lg_width = rg_rect.x - lg_rect.x - 10;
      lg_style = {
        width: lg_width,
        overflow: "hidden"
      };
    } else {
      lg_style = {};
    }
    back_style = Object.assign({}, front_style);
    tile_log_style = {
      overflow: "auto",
      marginLeft: 20,
      marginRight: 20,
      marginTop: 10,
      marginBottom: 10,
      width: props.tile_width - 40,
      height: tile_height - header_height - 50
    };
    panel_body_style = {
      "width": props.tile_width
    };
    main_style = {
      width: props.tile_width + dwidth,
      height: tile_height + dheight,
      position: "relative"
    };
    if (!props.finished_loading) {
      main_style.opacity = .5;
    }
    front_style.transition = "top ".concat(ANI_DURATION, "ms ease-in-out");
    back_style.transition = "top ".concat(ANI_DURATION, "ms ease-in-out");
    transitionStylesAltUp = {
      transition: "top ".concat(ANI_DURATION, "ms ease-in-out"),
      entering: {
        top: header_height
      },
      entered: {
        top: header_height
      },
      exiting: {
        top: -1 * tile_height
      },
      exited: {
        top: -1 * tile_height
      }
    };
    transitionStylesAltDown = {
      entering: {
        top: header_height,
        opacity: 1
      },
      entered: {
        top: header_height,
        opacity: 1
      },
      exiting: {
        top: tile_height + 50
      },
      exited: {
        top: tile_height + 50,
        opacity: 0
      }
    };
    tile_log_style.transition = "opacity ".concat(ANI_DURATION, "ms ease-in-out");
    transitionFadeStyles = {
      entering: {
        opacity: 1
      },
      entered: {
        opacity: 1
      },
      exiting: {
        opacity: 0,
        width: 0,
        height: 0,
        padding: 0
      },
      exited: {
        opacity: 0,
        width: 0,
        height: 0,
        padding: 0
      }
    };
  }
  function logText(the_text) {
    (0, _communication_react.postWithCallback)(props.tile_id, "LogTile", {}, null, null, props.main_id);
  }
  function _stopMe() {
    (0, _communication_react.postWithCallback)("kill_" + props.tile_id, "StopMe", {}, null);
  }
  function _editMe() {
    if (!window.in_context) {
      window.blur();
      (0, _communication_react.postWithCallback)("host", "go_to_module_viewer_if_exists", {
        user_id: window.user_id,
        tile_type: props.tile_type,
        line_number: 0
      }, function (data) {
        if (!data.success) {
          window.open($SCRIPT_ROOT + "/view_location_in_creator/" + props.tile_type + "/" + "0");
        } else {
          window.open("", data.window_name);
        }
      }, null, props.main_id);
    } else {
      props.goToModule(props.tile_type, 0);
    }
  }
  function _logMe() {
    logText(props.front_content);
  }
  function _logParams() {
    var data_dict = {};
    data_dict["main_id"] = props.main_id;
    data_dict["tile_id"] = props.tile_id;
    data_dict["tile_name"] = props.tile_name;
    (0, _communication_react.postWithCallback)(props.tile_id, "LogParams", data_dict, null, null, props.main_id);
  }
  function _startResize(e, ui, startX, startY) {
    set_resizing(true);
    set_dwidth(0);
    set_dheight(0);
  }
  function _onResize(e, ui, x, y, dx, dy) {
    set_dwidth(dx);
    set_dheight(dy);
  }
  function _stopResize(e, ui, x, y, dx, dy) {
    set_resizing(false);
    set_dwidth(0);
    set_dheight(0);
    pushCallback(function () {
      _resizeTileArea(dx, dy);
    });
  }
  function _createMenu() {
    var tile_menu_options = {
      "Run me": _handleSubmitOptions,
      "Stop me": _stopMe,
      "divider99": "divider",
      "Kill and reload": function KillAndReload() {
        _reloadTile(false);
      },
      "Kill, reload, and resubmit": function KillReloadAndResubmit() {
        _reloadTile(true);
      },
      "divider0": "divider",
      "Toggle console": _toggleTileLog,
      "divider1": "divider",
      "Log me": _logMe,
      "Log parameters": _logParams,
      "divider2": "divider",
      "Edit my source": _editMe,
      "divider3": "divider",
      "Delete me": _closeTile
    };
    var menu_icons = {
      "Kill and reload": "refresh",
      "Kill, reload, and resubmit": "social-media",
      "Run me": "play",
      "Stop me": "stop",
      "Toggle console": "console",
      "Log me": "clipboard",
      "Log parameters": "th",
      "Edit my source": "edit",
      "Delete me": "trash"
    };
    var menu_button = /*#__PURE__*/_react["default"].createElement(_core.Button, {
      minimal: true,
      small: true,
      icon: "more"
    });
    return /*#__PURE__*/_react["default"].createElement(_menu_utilities.MenuComponent, {
      option_dict: tile_menu_options,
      icon_dict: menu_icons,
      item_class: "tile-menu-item",
      position: _core.PopoverPosition.BOTTOM_RIGHT,
      alt_button: function alt_button() {
        return menu_button;
      }
    });
  }
  var show_front = !props.show_form && !props.show_log;
  var front_dict = {
    __html: props.front_content
  };
  compute_styles();
  var tile_class = props.table_is_shrunk ? "tile-panel tile-panel-float" : "tile-panel";
  var tph_class = props.source_changed ? "tile-panel-heading tile-source-changed" : "tile-panel-heading";
  var draghandle_position_dict = {
    position: "absolute",
    bottom: 2,
    right: 1
  };
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    ref: my_ref,
    elevation: 2,
    style: main_style,
    className: tile_class,
    id: props.tile_id
  }, /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: tph_class
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "left-glyphs",
    ref: left_glyphs_ref,
    style: lg_style
  }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, props.shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    handleClick: _toggleShrunk
  }), !props.shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrunk
  }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "primary",
    handleClick: _toggleBack,
    icon: "cog"
  }), /*#__PURE__*/_react["default"].createElement(SortHandle, {
    dragHandleProps: props.dragHandleProps,
    tile_name: props.tile_name
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "right-glyphs",
    style: {
      marginRight: 10
    },
    ref: right_glyphs_ref
  }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, props.show_log && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "primary",
    handleClick: _toggleTileLog,
    icon: "console"
  }), props.source_changed && !props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "danger",
    handleClick: function handleClick() {
      _reloadTile(true);
    },
    icon: "social-media"
  }), props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    intent: "danger",
    handleClick: _stopMe,
    icon: "stop"
  }), props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 17
  }), menu_component))), !props.shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    ref: body_ref,
    style: panel_body_style,
    className: "tile-body"
  }, /*#__PURE__*/_react["default"].createElement(_reactTransitionGroup.Transition, {
    "in": props.show_form,
    timeout: ANI_DURATION
  }, function (state) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "back",
      style: composeObjs(back_style, transitionStylesAltUp[state])
    }, /*#__PURE__*/_react["default"].createElement(_tile_form_react.TileForm, {
      options: _lodash["default"].cloneDeep(props.form_data),
      tile_id: props.tile_id,
      updateValue: _updateOptionValue,
      handleSubmit: _handleSubmitOptions
    }));
  }), props.show_log && /*#__PURE__*/_react["default"].createElement("div", {
    className: "tile-log",
    ref: log_ref
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "tile-log-area"
  }, /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
    main_id: props.main_id,
    streaming_host: props.main_id,
    container_id: props.tile_id,
    ref: inner_log_ref,
    outer_style: tile_log_style,
    showCommandField: true
  }))), /*#__PURE__*/_react["default"].createElement(_reactTransitionGroup.Transition, {
    "in": show_front,
    timeout: ANI_DURATION
  }, function (state) {
    return /*#__PURE__*/_react["default"].createElement("div", {
      className: "front",
      style: composeObjs(front_style, transitionStylesAltDown[state])
    }, /*#__PURE__*/_react["default"].createElement("div", {
      className: "tile-display-area",
      style: tda_style,
      ref: tda_ref,
      dangerouslySetInnerHTML: front_dict
    }));
  })), /*#__PURE__*/_react["default"].createElement(_resizing_layouts.DragHandle, {
    position_dict: draghandle_position_dict,
    dragStart: _startResize,
    onDrag: _onResize,
    dragEnd: _stopResize,
    direction: "both",
    size: 15
  })));
}
TileComponent.propTypes = {
  tile_name: _propTypes["default"].string,
  tile_id: _propTypes["default"].string,
  form_data: _propTypes["default"].array,
  front_content: _propTypes["default"].string,
  javascript_code: _propTypes["default"].string,
  javascript_arg_dict: _propTypes["default"].object,
  max_console_lines: _propTypes["default"].number,
  source_changed: _propTypes["default"].bool,
  tile_width: _propTypes["default"].number,
  tile_height: _propTypes["default"].number,
  show_form: _propTypes["default"].bool,
  show_spinner: _propTypes["default"].bool,
  shrunk: _propTypes["default"].bool,
  show_log: _propTypes["default"].bool,
  log_content: _propTypes["default"].string,
  log_since: _propTypes["default"].number,
  current_doc_name: _propTypes["default"].string,
  setTileValue: _propTypes["default"].func,
  setTileState: _propTypes["default"].func,
  broadcast_event: _propTypes["default"].func,
  handleReload: _propTypes["default"].string,
  handleClose: _propTypes["default"].func,
  goToModule: _propTypes["default"].func
};
TileComponent.defaultProps = {
  javascript_code: null,
  log_since: null,
  max_console_lines: 100
};
TileComponent = /*#__PURE__*/(0, _react.memo)(TileComponent);