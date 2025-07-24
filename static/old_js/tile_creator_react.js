"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CreatorApp = CreatorApp;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
require("../tactic_css/tactic.scss");
require("../tactic_css/tactic_table.scss");
require("../tactic_css/tile_creator.scss");
var _react = _interopRequireWildcard(require("react"));
var _client = require("react-dom/client");
var _core = require("@blueprintjs/core");
var _view = require("@codemirror/view");
var _state = require("@codemirror/state");
var _tile_creator_support = require("../tactic_js/tile_creator_support");
var _menu_utilities = require("../tactic_js/menu_utilities");
var _resource_viewer_react_app = require("../tactic_js/resource_viewer_react_app");
var _reactCodemirror = require("../tactic_js/react-codemirror6");
var _creator_modules_react = require("../tactic_js/creator_modules_react");
var _resizing_layouts = require("./resizing_layouts2");
var _communication_react = require("../tactic_js/communication_react");
var _toaster = require("../tactic_js/toaster");
var _assistant = require("../tactic_js/assistant");
var _sizing_tools = require("../tactic_js/sizing_tools");
var _error_drawer = require("../tactic_js/error_drawer");
var _utilities_react = require("../tactic_js/utilities_react");
var _blueprint_navbar = require("../tactic_js/blueprint_navbar");
var _error_boundary = require("../tactic_js/error_boundary");
var _settings = require("../tactic_js/settings");
var _modal_react = require("../tactic_js/modal_react");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t8 in e) "default" !== _t8 && {}.hasOwnProperty.call(e, _t8) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t8)) && (i.get || i.set) ? o(f, _t8, i) : f[_t8] = e[_t8]); return f; })(e, t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; } //comment
var BOTTOM_MARGIN = 50;
function optionListReducer(option_list, action) {
  var new_items;
  switch (action.type) {
    case "initialize":
      new_items = action.new_items.map(function (t) {
        var new_t = _objectSpread({}, t);
        new_t.option_id = (0, _utilities_react.guid)();
        return new_t;
      });
      break;
    case "delete_item":
      new_items = option_list.filter(function (t) {
        return t.option_id !== action.option_id;
      });
      break;
    case "update_item":
      var option_id = action.new_item.option_id;
      new_items = option_list.map(function (t) {
        if (t.option_id == option_id) {
          var update_dict = action.new_item;
          return _objectSpread(_objectSpread({}, t), update_dict);
        } else {
          return t;
        }
      });
      break;
    case "move_item":
      var old_list = (0, _toConsumableArray2["default"])(option_list);
      new_items = (0, _utilities_react.arrayMove)(old_list, action.oldIndex, action.newIndex);
      break;
    case "add_at_index":
      new_items = (0, _toConsumableArray2["default"])(option_list);
      var new_t = _objectSpread({}, action.new_item);
      new_t.option_id = (0, _utilities_react.guid)();
      new_items.splice(action.insert_index, 0, new_t);
      break;
    case "clear_highlights":
      new_items = option_list.map(function (t) {
        return _objectSpread(_objectSpread({}, t), {}, {
          className: ""
        });
      });
      break;
    default:
      console.log("Got Unknown action: " + action.type);
      return (0, _toConsumableArray2["default"])(option_list);
  }
  return new_items;
}
function CreatorApp(props) {
  props = _objectSpread({
    controlled: false,
    changeResourceName: null,
    changeResourceTitle: null,
    changeResourceProps: null,
    registerLineSetter: null,
    refreshTab: null,
    closeTab: null,
    updatePanel: null
  }, props);
  var top_ref = (0, _react.useRef)(null);
  var vp_ref = (0, _react.useRef)(null);
  var methods_ref = (0, _react.useRef)(null);
  var search_ref = (0, _react.useRef)(null);
  var globals_ref = (0, _react.useRef)(null);
  var last_save = (0, _react.useRef)({});
  var dpObject = (0, _react.useRef)(null);
  var rcObject = (0, _react.useRef)(null);
  var emObject = (0, _react.useRef)(null);
  var globalObject = (0, _react.useRef)(null);
  var rline_number = (0, _react.useRef)(props.initial_line_number);
  var cm_list = (0, _react.useRef)(props.is_mpl || props.is_d3 ? ["tc", "rc", "em", "gp"] : ["rc", "em", "gp"]);
  var search_match_numbers = (0, _react.useRef)({
    tc: 0,
    rc: 0,
    em: 0,
    gp: 0
  });
  var _useSize = (0, _sizing_tools.useSize)(top_ref, 0, "TileCreator"),
    _useSize2 = (0, _slicedToArray2["default"])(_useSize, 4),
    usable_width = _useSize2[0],
    usable_height = _useSize2[1],
    topX = _useSize2[2],
    topY = _useSize2[3];
  var _useState = (0, _react.useState)(0),
    _useState2 = (0, _slicedToArray2["default"])(_useState, 2),
    tabSelectCounter = _useState2[0],
    setTabSelectCounter = _useState2[1];

  // This hasActivated machinery is necessary because cleanup of codemirror areas doesn't work
  // properly if the component is unmounted before the codemirror area is activated.
  var _useState3 = (0, _react.useState)(false),
    _useState4 = (0, _slicedToArray2["default"])(_useState3, 2),
    methodsHasActivated = _useState4[0],
    setMethodsHasActivated = _useState4[1];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = (0, _slicedToArray2["default"])(_useState5, 2),
    globalsHasActivated = _useState6[0],
    setGlobalsHasActivated = _useState6[1];
  var _useState7 = (0, _react.useState)({
      "metadata": true,
      "options": false,
      "exports": false,
      "methods": false
    }),
    _useState8 = (0, _slicedToArray2["default"])(_useState7, 2),
    foregrounded_panes = _useState8[0],
    set_foregrounded_panes = _useState8[1];
  var _useState9 = (0, _react.useState)(""),
    _useState0 = (0, _slicedToArray2["default"])(_useState9, 2),
    search_string = _useState0[0],
    set_search_string = _useState0[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef2 = (0, _slicedToArray2["default"])(_useStateAndRef, 3),
    current_search_number = _useStateAndRef2[0],
    set_current_search_number = _useStateAndRef2[1],
    current_search_number_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(cm_list.current[0]),
    _useStateAndRef4 = (0, _slicedToArray2["default"])(_useStateAndRef3, 3),
    current_search_cm = _useStateAndRef4[0],
    set_current_search_cm = _useStateAndRef4[1],
    current_search_cm_ref = _useStateAndRef4[2];
  var _useState1 = (0, _react.useState)(false),
    _useState10 = (0, _slicedToArray2["default"])(_useState1, 2),
    regex = _useState10[0],
    set_regex = _useState10[1];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef6 = (0, _slicedToArray2["default"])(_useStateAndRef5, 2),
    search_matches = _useStateAndRef6[0],
    set_search_matches = _useStateAndRef6[1];
  var _useStateAndRef7 = (0, _utilities_react.useStateAndRef)(props.render_content_code),
    _useStateAndRef8 = (0, _slicedToArray2["default"])(_useStateAndRef7, 3),
    set_render_content_code = _useStateAndRef8[1],
    render_content_code_ref = _useStateAndRef8[2];
  var _useStateAndRef9 = (0, _utilities_react.useStateAndRef)(props.draw_plot_code),
    _useStateAndRef0 = (0, _slicedToArray2["default"])(_useStateAndRef9, 3),
    set_draw_plot_code = _useStateAndRef0[1],
    draw_plot_code_ref = _useStateAndRef0[2];
  var _useStateAndRef1 = (0, _utilities_react.useStateAndRef)(props.jscript_code),
    _useStateAndRef10 = (0, _slicedToArray2["default"])(_useStateAndRef1, 3),
    set_jscript_code = _useStateAndRef10[1],
    jscript_code_ref = _useStateAndRef10[2];
  var _useStateAndRef11 = (0, _utilities_react.useStateAndRef)(props.extra_functions),
    _useStateAndRef12 = (0, _slicedToArray2["default"])(_useStateAndRef11, 3),
    set_extra_functions = _useStateAndRef12[1],
    extra_functions_ref = _useStateAndRef12[2];
  var _useStateAndRef13 = (0, _utilities_react.useStateAndRef)(props.globals_code),
    _useStateAndRef14 = (0, _slicedToArray2["default"])(_useStateAndRef13, 3),
    set_globals_code = _useStateAndRef14[1],
    globals_code_ref = _useStateAndRef14[2];
  var _useReducerAndRef = (0, _utilities_react.useReducerAndRef)(optionListReducer, []),
    _useReducerAndRef2 = (0, _slicedToArray2["default"])(_useReducerAndRef, 3),
    optionDispatch = _useReducerAndRef2[1],
    option_list_ref = _useReducerAndRef2[2];
  var _useStateAndRef15 = (0, _utilities_react.useStateAndRef)(props.export_list),
    _useStateAndRef16 = (0, _slicedToArray2["default"])(_useStateAndRef15, 3),
    set_export_list = _useStateAndRef16[1],
    export_list_ref = _useStateAndRef16[2];
  var _useStateAndRef17 = (0, _utilities_react.useStateAndRef)(props.render_content_line_number),
    _useStateAndRef18 = (0, _slicedToArray2["default"])(_useStateAndRef17, 3),
    set_render_content_line_number = _useStateAndRef18[1],
    render_content_line_number_ref = _useStateAndRef18[2];
  var _useStateAndRef19 = (0, _utilities_react.useStateAndRef)(props.draw_plot_line_number),
    _useStateAndRef20 = (0, _slicedToArray2["default"])(_useStateAndRef19, 3),
    set_draw_plot_line_number = _useStateAndRef20[1],
    draw_plot_line_number_ref = _useStateAndRef20[2];
  var _useStateAndRef21 = (0, _utilities_react.useStateAndRef)(props.extra_methods_line_number),
    _useStateAndRef22 = (0, _slicedToArray2["default"])(_useStateAndRef21, 3),
    set_extra_methods_line_number = _useStateAndRef22[1],
    extra_methods_line_number_ref = _useStateAndRef22[2];

  // const [category, set_category, category_ref] = useStateAndRef(props.category);

  var _useStateAndRef23 = (0, _utilities_react.useStateAndRef)(props.additional_save_attrs || []),
    _useStateAndRef24 = (0, _slicedToArray2["default"])(_useStateAndRef23, 3),
    set_additional_save_attrs = _useStateAndRef24[1],
    additional_save_attrs_ref = _useStateAndRef24[2];
  var _useStateAndRef25 = (0, _utilities_react.useStateAndRef)(props.couple_save_attrs_and_exports),
    _useStateAndRef26 = (0, _slicedToArray2["default"])(_useStateAndRef25, 3),
    set_couple_save_attrs_and_exports = _useStateAndRef26[1],
    couple_save_attrs_and_exports_ref = _useStateAndRef26[2];
  var _useState11 = (0, _react.useState)("metadata"),
    _useState12 = (0, _slicedToArray2["default"])(_useState11, 2),
    selectedTabId = _useState12[0],
    setSelectedTabId = _useState12[1];
  var extraSelfCompletionsRef = (0, _react.useRef)([]);
  var settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  var errorDrawerFuncs = (0, _react.useContext)(_error_drawer.ErrorDrawerContext);
  var sizeInfo = (0, _react.useContext)(_sizing_tools.SizeContext);
  var selectedPane = (0, _react.useContext)(_utilities_react.SelectedPaneContext);
  var hotkeys = (0, _react.useMemo)(function () {
    return [{
      combo: "Ctrl+S",
      global: false,
      group: "Tile Creator",
      label: "Save Code",
      onKeyDown: _saveMe
    }, {
      combo: "Ctrl+L",
      global: false,
      group: "Tile Creator",
      label: "Save And Load",
      onKeyDown: _saveAndLoadModule
    }, {
      combo: "Ctrl+M",
      global: false,
      group: "Tile Creator",
      label: "Save and Checkpoint",
      onKeyDown: _saveAndCheckpoint
    }];
  }, [_saveMe, _saveAndLoadModule, _saveAndCheckpoint]);
  var _useHotkeys = (0, _core.useHotkeys)(hotkeys),
    handleKeyDown = _useHotkeys.handleKeyDown,
    handleKeyUp = _useHotkeys.handleKeyUp;
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  var _useState13 = (0, _react.useState)(props.resource_name),
    _useState14 = (0, _slicedToArray2["default"])(_useState13, 2),
    resource_name = _useState14[0],
    set_resource_name = _useState14[1];
  var connection_status = (0, _utilities_react.useConnection)(props.tsocket, initSocket);
  (0, _react.useEffect)(function () {
    optionDispatch({
      type: "initialize",
      new_items: props.option_list
    });
  }, []);
  (0, _react.useEffect)(function () {
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
    return function () {
      dpObject.current = null;
      rcObject.current = null;
      emObject.current = null;
      globalObject.current = null;
      delete_my_container();
      window.removeEventListener("unload", sendRemove);
      errorDrawerFuncs.setGoToLineNumber(null);
    };
  }, []);
  (0, _react.useEffect)(function () {
    _goToLineNumber();
  });
  (0, _react.useEffect)(function () {
    function _getOptionNames() {
      var onames = [];
      var _iterator = _createForOfIteratorHelper(option_list_ref.current),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;
          onames.push(entry.name);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return onames;
    }
    extraSelfCompletionsRef.current = [];
    var _iterator2 = _createForOfIteratorHelper(_getOptionNames()),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var oname = _step2.value;
        var the_text = "" + oname;
        extraSelfCompletionsRef.current.push({
          label: the_text,
          type: "variable",
          section: "Options"
        });
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
  }, [option_list_ref.current]);
  function initSocket() {
    props.tsocket.attachListener('focus-me', function (data) {
      window.focus();
      _selectLineNumber(data.line_number);
    });
    if (!window.in_context) {
      props.tsocket.attachListener("doFlashUser", function (data) {
        (0, _toaster.doFlash)(data);
      });
      props.tsocket.attachListener('close-user-windows', function (data) {
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
    var ms = {
      Save: [{
        name_text: "Save",
        icon_name: "saved",
        click_handler: _saveMe,
        key_bindings: ['Ctrl+S']
      }, {
        name_text: "Save As...",
        icon_name: "floppy-disk",
        click_handler: _saveModuleAs
      }, {
        name_text: "Save and Checkpoint",
        icon_name: "map-marker",
        click_handler: _saveAndCheckpoint,
        key_bindings: ['Ctrl+M']
      }],
      Load: [{
        name_text: "Save and Load",
        icon_name: "upload",
        click_handler: _saveAndLoadModule,
        key_bindings: ['Ctrl+L']
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
        click_handler: function () {
          var _click_handler = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
            return _regenerator["default"].wrap(function (_context) {
              while (1) switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 1;
                  return (0, _resource_viewer_react_app.sendToRepository)("tile", _cProp("resource_name"), dialogFuncs, statusFuncs, errorDrawerFuncs);
                case 1:
                case "end":
                  return _context.stop();
              }
            }, _callee);
          }));
          function click_handler() {
            return _click_handler.apply(this, arguments);
          }
          return click_handler;
        }()
      }]
    };
    for (var menu in ms) {
      var _iterator3 = _createForOfIteratorHelper(ms[menu]),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var but = _step3.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
    return ms;
  }
  function _extraKeys() {
    var ekeys = {
      'Ctrl-s': _saveMe,
      'Ctrl-l': _saveAndLoadModule,
      'Ctrl-m': _saveAndCheckpoint,
      'Ctrl-f': function CtrlF() {
        search_ref.current.focus();
      },
      'Cmd-f': function CmdF() {
        search_ref.current.focus();
      }
    };
    var convertedKeys = (0, _utilities_react.convertExtraKeys)(ekeys);
    var moreKeys = [{
      key: 'Ctrl-g',
      run: function run() {
        _searchNext();
      },
      preventDefault: true
    }, {
      key: 'Cmd-g',
      run: function run() {
        _searchNext();
      },
      preventDefault: true
    }, {
      key: 'Ctrl-Shift-g',
      run: function run() {
        _searchPrev();
      },
      preventDefault: true
    }, {
      key: 'Cmd-Shift-g',
      run: function run() {
        _searchPrev();
      },
      preventDefault: true
    }];
    return [].concat((0, _toConsumableArray2["default"])(convertedKeys), moreKeys);
  }
  function _searchNext() {
    if (current_search_number_ref.current >= search_match_numbers.current[current_search_cm] - 1) {
      var next_cm;
      switch (current_search_cm_ref.current) {
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
      set_current_search_number(current_search_number_ref.current + 1);
    }
  }
  function _searchPrev() {
    var next_cm;
    var next_search_number;
    if (current_search_number_ref.current <= 0) {
      if (current_search_cm_ref.current == "em") {
        next_cm = "rc";
        next_search_number = search_match_numbers.current["rc"] - 1;
      } else if (current_search_cm_ref.current == "tc") {
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
      if (next_search_number < 0) {
        next_search_number = 0;
      }
      set_current_search_number(next_search_number);
    } else {
      set_current_search_number(current_search_number_ref.current - 1);
    }
  }
  function _updateSearchState(new_state) {
    set_current_search_cm(cm_list.current[0]);
    set_current_search_number(0);
    for (var field in new_state) {
      switch (field) {
        case "regex":
          set_regex(new_state[field]);
          break;
        case "search_string":
          set_search_string(new_state[field]);
          break;
      }
    }
    var currentTab = selectedTabId;
    if (!methodsHasActivated) {
      _handleTabSelect("methods");
    }
    if (!globalsHasActivated) {
      _handleTabSelect("globals");
    }
    _handleTabSelect(currentTab);
  }
  function _showHistoryViewer() {
    window.open("".concat($SCRIPT_ROOT, "/show_history_viewer/").concat(_cProp("resource_name")));
  }
  function _showTileDiffer() {
    window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/").concat(_cProp("resource_name")));
  }
  function _selectLineNumber(lnumber) {
    rline_number.current = lnumber;
    _goToLineNumber();
  }
  function _logErrorStopSpinner(title, data) {
    statusFuncs.stopSpinner();
    var entry = {
      title: title,
      content: data.message,
      tile_type: resource_name
    };
    if ("line_number" in data) {
      entry.line_number = data.line_number;
    }
    errorDrawerFuncs.addErrorDrawerEntry(entry, true);
    errorDrawerFuncs.openErrorDrawer();
  }
  function _dirty() {
    var current_state = _getSaveDict();
    for (var k in current_state) {
      if (current_state[k] != last_save.current[k]) {
        return true;
      }
    }
    return false;
  }
  function _saveAndLoadModule() {
    return _saveAndLoadModule2.apply(this, arguments);
  }
  function _saveAndLoadModule2() {
    _saveAndLoadModule2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var _t2;
      return _regenerator["default"].wrap(function (_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (am_selected()) {
              _context3.next = 1;
              break;
            }
            return _context3.abrupt("return", false);
          case 1:
            statusFuncs.startSpinner();
            _context3.prev = 2;
            _context3.next = 3;
            return doSavePromise();
          case 3:
            statusFuncs.statusMessage("Loading Module");
            _context3.next = 4;
            return (0, _communication_react.postPromise)("host", "load_tile_module_task", {
              "tile_module_name": _cProp("resource_name"),
              "user_id": window.user_id
            }, props.module_viewer_id);
          case 4:
            statusFuncs.statusMessage("Loaded successfully");
            statusFuncs.stopSpinner();
            _context3.next = 6;
            break;
          case 5:
            _context3.prev = 5;
            _t2 = _context3["catch"](2);
            _logErrorStopSpinner("Error saving and loading module", _t2);
          case 6:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[2, 5]]);
    }));
    return _saveAndLoadModule2.apply(this, arguments);
  }
  function _loadModule() {
    return _loadModule2.apply(this, arguments);
  }
  function _loadModule2() {
    _loadModule2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var _t3;
      return _regenerator["default"].wrap(function (_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (am_selected()) {
              _context4.next = 1;
              break;
            }
            return _context4.abrupt("return", false);
          case 1:
            statusFuncs.startSpinner();
            statusFuncs.statusMessage("Loading module...");
            _context4.prev = 2;
            _context4.next = 3;
            return (0, _communication_react.postPromise)("host", "load_tile_module_task", {
              "tile_module_name": _cProp("resource_name"),
              "user_id": window.user_id
            }, props.module_viewer_id);
          case 3:
            statusFuncs.statusMessage("Loaded successfully");
            statusFuncs.stopSpinner();
            _context4.next = 5;
            break;
          case 4:
            _context4.prev = 4;
            _t3 = _context4["catch"](2);
            _logErrorStopSpinner("Error saving and loading module", _t3);
          case 5:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[2, 4]]);
    }));
    return _loadModule2.apply(this, arguments);
  }
  function _saveModuleAs() {
    return _saveModuleAs2.apply(this, arguments);
  }
  function _saveModuleAs2() {
    _saveModuleAs2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var data, doCancel, CreateNewModule, _CreateNewModule, _t5;
      return _regenerator["default"].wrap(function (_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _CreateNewModule = function _CreateNewModule3() {
              _CreateNewModule = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee5(new_name) {
                var result_dict, _t4;
                return _regenerator["default"].wrap(function (_context5) {
                  while (1) switch (_context5.prev = _context5.next) {
                    case 0:
                      result_dict = {
                        "new_res_name": new_name,
                        "res_to_copy": _cProp("resource_name")
                      };
                      _context5.prev = 1;
                      _context5.next = 2;
                      return (0, _communication_react.postAjaxPromise)('/create_duplicate_tile', result_dict);
                    case 2:
                      data = _context5.sent;
                      _setResourceNameState(new_name, function () {
                        _saveMe();
                      });
                      _context5.next = 4;
                      break;
                    case 3:
                      _context5.prev = 3;
                      _t4 = _context5["catch"](1);
                      _logErrorStopSpinner("Error saving module", _t4);
                    case 4:
                    case "end":
                      return _context5.stop();
                  }
                }, _callee5, null, [[1, 3]]);
              }));
              return _CreateNewModule.apply(this, arguments);
            };
            CreateNewModule = function _CreateNewModule2(_x3) {
              return _CreateNewModule.apply(this, arguments);
            };
            doCancel = function _doCancel() {
              statusFuncs.stopSpinner();
            };
            statusFuncs.startSpinner();
            _context6.prev = 1;
            _context6.next = 2;
            return (0, _communication_react.postPromise)("host", "get_tile_names", {
              "user_id": window.user_id
            }, props.main_id);
          case 2:
            data = _context6.sent;
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
            _context6.next = 4;
            break;
          case 3:
            _context6.prev = 3;
            _t5 = _context6["catch"](1);
            _logErrorStopSpinner("Error saving module", _t5);
          case 4:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[1, 3]]);
    }));
    return _saveModuleAs2.apply(this, arguments);
  }
  function am_selected() {
    return selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef);
  }
  function _saveMe() {
    return _saveMe2.apply(this, arguments);
  }
  function _saveMe2() {
    _saveMe2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var _t6;
      return _regenerator["default"].wrap(function (_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            if (am_selected()) {
              _context7.next = 1;
              break;
            }
            return _context7.abrupt("return", false);
          case 1:
            statusFuncs.startSpinner();
            statusFuncs.statusMessage("Saving module...");
            _context7.prev = 2;
            _context7.next = 3;
            return doSavePromise();
          case 3:
            statusFuncs.statusMessage("Saved module");
            statusFuncs.stopSpinner();
            _context7.next = 5;
            break;
          case 4:
            _context7.prev = 4;
            _t6 = _context7["catch"](2);
            _logErrorStopSpinner("Error saving module", _t6);
          case 5:
            return _context7.abrupt("return", false);
          case 6:
          case "end":
            return _context7.stop();
        }
      }, _callee7, null, [[2, 4]]);
    }));
    return _saveMe2.apply(this, arguments);
  }
  function _saveAndCheckpoint() {
    return _saveAndCheckpoint2.apply(this, arguments);
  }
  function _saveAndCheckpoint2() {
    _saveAndCheckpoint2 = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var _t7;
      return _regenerator["default"].wrap(function (_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            if (am_selected()) {
              _context8.next = 1;
              break;
            }
            return _context8.abrupt("return", false);
          case 1:
            statusFuncs.startSpinner();
            statusFuncs.statusMessage("Checkpointing");
            _context8.prev = 2;
            _context8.next = 3;
            return doSavePromise();
          case 3:
            _context8.next = 4;
            return doCheckpointPromise();
          case 4:
            statusFuncs.statusMessage("Saved and checkpointed");
            statusFuncs.stopSpinner();
            _context8.next = 6;
            break;
          case 5:
            _context8.prev = 5;
            _t7 = _context8["catch"](2);
            _logErrorStopSpinner("Error in save and checkpoint", _t7);
          case 6:
            return _context8.abrupt("return", false);
          case 7:
          case "end":
            return _context8.stop();
        }
      }, _callee8, null, [[2, 5]]);
    }));
    return _saveAndCheckpoint2.apply(this, arguments);
  }
  function _getSaveDict() {
    return {
      "module_name": _cProp("resource_name"),
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
    return new Promise(/*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(resolve, reject) {
        var result_dict, data, _t;
        return _regenerator["default"].wrap(function (_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              result_dict = _getSaveDict();
              _context2.prev = 1;
              _context2.next = 2;
              return (0, _communication_react.postPromise)(props.module_viewer_id, "update_module", result_dict, props.module_viewer_id);
            case 2:
              data = _context2.sent;
              save_success(data);
              resolve(data);
              _context2.next = 4;
              break;
            case 3:
              _context2.prev = 3;
              _t = _context2["catch"](1);
              reject(_t);
            case 4:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[1, 3]]);
      }));
      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
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
    try {
      var line = cm.state.doc.line(lnumber + 1);
      cm.dispatch({
        selection: _state.EditorSelection.single(line.from, line.to),
        effects: _view.EditorView.scrollIntoView(line.from, {
          y: "center" // Center the line in the view
        })
      });
    } catch (e) {
      console.log("Error in selectLine", e);
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
          }
        } else if (rline_number.current < render_content_line_number_ref.current) {
          if (dpObject.current) {
            _selectLine(dpObject.current, rline_number.current - draw_plot_line_number_ref.current - 1);
            rline_number.current = null;
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
  function _handleTabSelect(newTabId) {
    var new_fg = Object.assign({}, foregrounded_panes);
    new_fg[newTabId] = true;
    setSelectedTabId(newTabId);
    if (newTabId == "methods" && !methodsHasActivated) {
      setMethodsHasActivated(true);
    }
    if (newTabId == "globals" && !globalsHasActivated) {
      setGlobalsHasActivated(true);
    }
    set_foregrounded_panes(new_fg);
    pushCallback(function () {
      setTabSelectCounter(tabSelectCounter + 1);
    });
  }
  function _appendOptionText(appendToNotes) {
    var res_string = "\n\noptions: \n\n";
    var _iterator4 = _createForOfIteratorHelper(option_list_ref.current),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var opt = _step4.value;
        res_string += " * `".concat(opt.name, "` (").concat(opt.type, "): \n");
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    appendToNotes(res_string);
  }
  function _appendExportText(appendToNotes) {
    var res_string = "\n\nexports: \n\n";
    var _iterator5 = _createForOfIteratorHelper(export_list_ref.current),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var exp = _step5.value;
        res_string += " * `".concat(exp.name, "` : \n");
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    appendToNotes(res_string);
  }
  function MetadataNotesButtons(props) {
    return /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
      style: {
        height: "fit-content",
        alignSelf: "start",
        marginTop: 10,
        fontSize: 12
      },
      text: "Add Options",
      size: "small",
      variant: "minimal",
      intent: "primary",
      icon: "select",
      onClick: function onClick(e) {
        e.preventDefault();
        _appendOptionText(props.appendToNotes);
      }
    }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
      style: {
        height: "fit-content",
        alignSelf: "start",
        marginTop: 10,
        fontSize: 12
      },
      text: "Add Exports",
      size: "small",
      variant: "minimal",
      intent: "primary",
      icon: "export",
      onClick: function onClick(e) {
        e.preventDefault();
        _appendExportText(props.appendToNotes);
      }
    }));
  }
  function handleExportsStateChange(state_stuff) {
    for (var field in state_stuff) {
      switch (field) {
        case "export_list":
          set_export_list((0, _toConsumableArray2["default"])(state_stuff[field]));
          break;
        case "additional_save_attrs":
          set_additional_save_attrs((0, _toConsumableArray2["default"])(state_stuff[field]));
          break;
        case "couple_save_attrs_and_exports":
          set_couple_save_attrs_and_exports(state_stuff[field]);
          break;
      }
    }
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
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    if (props.controlled) {
      props.changeResourceName(new_name, callback);
    } else {
      set_resource_name(new_name);
      pushCallback(callback);
    }
  }
  function _clearAllSelections() {}
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
    var current_matches = 0;
    for (var cname in search_match_numbers.current) {
      current_matches += search_match_numbers.current[cname];
    }
    set_search_matches(current_matches);
  }
  var my_props = _objectSpread({}, props);
  if (!props.controlled) {
    my_props.resource_name = resource_name;
  }
  var ch_style = {
    "width": "100%"
  };
  var tc_item;
  if (my_props.is_mpl || my_props.is_d3) {
    var mode = my_props.is_mpl ? "python" : "javascript";
    var code_content = my_props.is_mpl ? draw_plot_code_ref.current : jscript_code_ref.current;
    var first_line_number = my_props.is_mpl ? draw_plot_line_number_ref.current + 1 : 1;
    var title_label = my_props.is_mpl ? "draw_plot" : "(selector, w, h, arg_dict, resizing) =>";
    tc_item = /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
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
      setSearchMatches: function setSearchMatches(num) {
        return _setSearchMatches("tc", num);
      },
      tsocket: props.tsocket,
      extraSelfCompletions: mode == "python" ? extraSelfCompletionsRef.current : [],
      container_id: props.module_viewer_id,
      highlight_active_line: true
    });
  }
  var bc_item = /*#__PURE__*/_react["default"].createElement("div", {
    key: "rccode",
    id: "rccode",
    style: ch_style,
    className: "d-flex flex-column align-items-baseline code-holder"
  }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
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
    search_ref: search_ref,
    searchPrev: _searchPrev,
    searchNext: _searchNext,
    search_matches: search_matches,
    setSearchMatches: function setSearchMatches(num) {
      return _setSearchMatches("rc", num);
    },
    tsocket: props.tsocket,
    extraSelfCompletions: extraSelfCompletionsRef.current,
    highlight_active_line: true,
    container_id: props.module_viewer_id
  }));
  var left_pane;
  if (my_props.is_mpl || my_props.is_d3) {
    left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
      ref: vp_ref
    }), /*#__PURE__*/_react["default"].createElement(_resizing_layouts.VerticalPanes, {
      top_pane: tc_item,
      bottom_pane: bc_item,
      show_handle: true,
      id: "creator-left"
    }));
  } else {
    left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
      ref: vp_ref
    }, bc_item));
  }
  var mdata_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.MetadataModule, {
    expandWidth: false,
    alt_category: props.category,
    notes_buttons: MetadataNotesButtons,
    tsocket: props.tsocket,
    readOnly: props.readOnly,
    res_name: _cProp("resource_name"),
    res_type: "tile",
    tabSelectCounter: tabSelectCounter
  });
  var option_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.OptionModule, {
    data_list_ref: option_list_ref,
    foregrounded: foregrounded_panes["options"],
    optionDispatch: optionDispatch,
    tabSelectCounter: tabSelectCounter
  });
  var export_panel = /*#__PURE__*/_react["default"].createElement(_creator_modules_react.ExportModule, {
    export_list: export_list_ref.current,
    save_list: additional_save_attrs_ref.current,
    couple_save_attrs_and_exports: couple_save_attrs_and_exports_ref.current,
    foregrounded: foregrounded_panes["exports"],
    handleChange: handleExportsStateChange,
    tabSelectCounter: tabSelectCounter
  });
  var methods_panel = /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginLeft: 10
    }
  }, methodsHasActivated && /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
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
    setSearchMatches: function setSearchMatches(num) {
      return _setSearchMatches("em", num);
    },
    tsocket: props.tsocket,
    highlight_active_line: true,
    extraSelfCompletions: extraSelfCompletionsRef.current,
    iCounter: tabSelectCounter,
    container_id: props.module_viewer_id
  }));
  var globals_panel = /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginLeft: 10
    }
  }, globalsHasActivated && /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror6, {
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
    setSearchMatches: function setSearchMatches(num) {
      return _setSearchMatches("gp", num);
    },
    tsocket: props.tsocket,
    highlight_active_line: true,
    iCounter: tabSelectCounter,
    container_id: props.module_viewer_id
  }));
  // let commands_panel = (
  //     <CommandsModule foregrounded={foregrounded_panes["commands"]}
  //                     tabSelectCounter={tabSelectCounter}
  //     />
  // );
  var right_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    id: "creator-resources",
    className: "d-block"
  }, /*#__PURE__*/_react["default"].createElement(_core.Tabs, {
    id: "resource_tabs",
    selectedTabId: selectedTabId,
    size: "large",
    onChange: _handleTabSelect
  }, /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "metadata",
    title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      size: 12,
      icon: "manually-entered-data"
    }), " metadata"),
    panel: mdata_panel
  }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "options",
    title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      size: 12,
      icon: "select"
    }), " options"),
    panel: option_panel
  }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "exports",
    title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      size: 12,
      icon: "export"
    }), " exports"),
    panel: export_panel
  }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "methods",
    title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      size: 12,
      icon: "code"
    }), " methods"),
    panel: methods_panel
  }), /*#__PURE__*/_react["default"].createElement(_core.Tab, {
    id: "globals",
    title: /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
      size: 12,
      icon: "code"
    }), " globals"),
    panel: globals_panel
  }))));
  var outer_style = {
    width: "100%",
    height: sizeInfo.availableHeight,
    paddingLeft: props.controlled ? 5 : _sizing_tools.SIDE_MARGIN,
    paddingTop: 15
  };
  var outer_class = "resource-viewer-holder pane-holder";
  if (!window.in_context) {
    if (settingsContext.isDark()) {
      outer_class = outer_class + " bp6-dark";
    } else {
      outer_class = outer_class + " light-theme";
    }
  }
  var uwidth = usable_width - 2 * _sizing_tools.SIDE_MARGIN;
  return /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, !window.in_context && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    page_id: props.module_viewer_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    menu_specs: menu_specs(),
    connection_status: connection_status,
    showRefresh: window.in_context,
    showClose: window.in_context,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    resource_name: _cProp("resource_name"),
    showIconBar: true,
    showErrorDrawerButton: true,
    showMetadataDrawerButton: false,
    showAssistantDrawerButton: true,
    showSettingsDrawerButton: true,
    controlled: props.controlled
  }), /*#__PURE__*/_react["default"].createElement(_error_boundary.ErrorBoundary, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style,
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }, /*#__PURE__*/_react["default"].createElement(_sizing_tools.SizeContext.Provider, {
    value: {
      availableWidth: uwidth,
      availableHeight: usable_height,
      topX: topX,
      topY: topY
    }
  }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
    left_pane: left_pane,
    right_pane: right_pane,
    show_handle: true,
    initial_width_fraction: .5,
    handleSplitUpdate: null,
    bottom_margin: BOTTOM_MARGIN,
    right_margin: _sizing_tools.SIDE_MARGIN
  })))));
}
exports.CreatorApp = CreatorApp = /*#__PURE__*/(0, _react.memo)(CreatorApp);
function tile_creator_main() {
  function gotProps(the_props) {
    var CreatorAppPlus = (0, _sizing_tools.withSizeContext)((0, _settings.withSettings)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)((0, _assistant.withAssistant)(CreatorApp))))));
    var the_element = /*#__PURE__*/_react["default"].createElement(CreatorAppPlus, (0, _extends2["default"])({}, the_props, {
      controlled: false,
      changeName: null
    }));
    var domContainer = document.querySelector('#creator-root');
    var root = (0, _client.createRoot)(domContainer);
    root.render(
    //<HotkeysProvider>
    the_element
    //</HotkeysProvider>
    );
  }
  (0, _utilities_react.renderSpinnerMessage)("Starting up ...", '#creator-root');
  (0, _communication_react.postAjaxPromise)("view_in_creator_in_context", {
    "resource_name": window.module_name
  }).then(function (data) {
    (0, _tile_creator_support.creator_props)(data, null, gotProps, null);
  });
}
if (!window.in_context) {
  tile_creator_main();
}