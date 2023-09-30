"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ConsoleComponent = ConsoleComponent;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
require("codemirror/mode/markdown/markdown.js");
var _core = require("@blueprintjs/core");
var _lodash = _interopRequireDefault(require("lodash"));
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _reactCodemirror = require("./react-codemirror");
var _sortable_container = require("./sortable_container");
var _key_trap = require("./key_trap");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _library_pane = require("./library_pane");
var _menu_utilities = require("./menu_utilities");
var _search_form = require("./search_form");
var _searchable_console = require("./searchable_console");
var _theme = require("./theme");
var _modal_react = require("./modal_react");
var _utilities_react = require("./utilities_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
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
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; } // noinspection JSConstructorReturnsPrimitive
var mdi = (0, _markdownIt["default"])({
  html: true
});
mdi.use(_markdownItLatex["default"]);
var MAX_CONSOLE_WIDTH = 1800;
var BUTTON_CONSUMED_SPACE = 208;
var SECTION_INDENT = 25; // This is also hard coded into the css file at the moment
var MAX_OUTPUT_LENGTH = 500000;
function ConsoleComponent(props) {
  var header_ref = (0, _react.useRef)(null);
  var body_ref = (0, _react.useRef)(null);
  var temporarily_closed_items = (0, _react.useRef)([]);
  var filtered_items_ref = (0, _react.useRef)([]);
  var _useState = (0, _react.useState)(null),
    _useState2 = _slicedToArray(_useState, 2),
    console_item_with_focus = _useState2[0],
    set_console_item_with_focus = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    console_item_saved_focus = _useState4[0],
    set_console_item_saved_focus = _useState4[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    all_selected_items = _useStateAndRef2[0],
    set_all_selected_items = _useStateAndRef2[1],
    all_selected_items_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(null),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    search_string = _useStateAndRef4[0],
    set_search_string = _useStateAndRef4[1],
    search_string_ref = _useStateAndRef4[2];
  var _useState5 = (0, _react.useState)(false),
    _useState6 = _slicedToArray(_useState5, 2),
    filter_console_items = _useState6[0],
    set_filter_console_items = _useState6[1];
  var _useState7 = (0, _react.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    search_helper_text = _useState8[0],
    set_search_helper_text = _useState8[1];
  var _useState9 = (0, _react.useState)(false),
    _useState10 = _slicedToArray(_useState9, 2),
    show_main_log = _useState10[0],
    set_show_main_log = _useState10[1];
  var _useState11 = (0, _react.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    show_pseudo_log = _useState12[0],
    set_show_pseudo_log = _useState12[1];
  var _useState13 = (0, _react.useState)(null),
    _useState14 = _slicedToArray(_useState13, 2),
    pseudo_tile_id = _useState14[0],
    set_pseudo_tile_id = _useState14[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    initSocket();
    _requestPseudoTileId();
    if (props.console_items.current.length == 0) {
      _addCodeArea("", false);
    }
    _clear_all_selected_items(function () {
      if (props.console_items.current && props.console_items.current.length > 0) {
        _selectConsoleItem(props.console_items.current[0].unique_id);
      }
    });
  }, []);
  function initSocket() {
    function _handleConsoleMessage(data) {
      if (data.main_id == props.main_id) {
        // noinspection JSUnusedGlobalSymbols
        var handlerDict = {
          consoleLog: function consoleLog(data) {
            return _addConsoleEntry(data.message, data.force_open, true);
          },
          consoleLogMultiple: function consoleLogMultiple(data) {
            return _addConsoleEntries(data.message, data.force_open, true);
          },
          createLink: function createLink(data) {
            var unique_id = data.message.unique_id;
            _addConsoleEntry(data.message, data.force_open, false, null, function () {
              _insertLinkInItem(unique_id);
            });
          },
          stopConsoleSpinner: function stopConsoleSpinner(data) {
            var execution_count = "execution_count" in data ? data.execution_count : null;
            _stopConsoleSpinner(data.console_id, execution_count);
          },
          consoleCodePrint: function consoleCodePrint(data) {
            return _appendConsoleItemOutput(data);
          },
          consoleCodeOverwrite: function consoleCodeOverwrite(data) {
            return _setConsoleItemOutput(data);
          },
          consoleCodeRun: function consoleCodeRun(data) {
            return _startSpinner(data.console_id);
          }
        };
        handlerDict[data.console_message](data);
      }
    }

    // We have to careful to get the very same instance of the listerner function
    // That requires storing it outside of this component since the console can be unmounted

    props.tsocket.attachListener("console-message", _handleConsoleMessage);
  }
  function _requestPseudoTileId() {
    if (pseudo_tile_id == null) {
      (0, _communication_react.postWithCallback)(props.main_id, "get_pseudo_tile_id", {}, function (res) {
        set_pseudo_tile_id(res.pseudo_tile_id);
      });
    }
  }
  function _createTextEntry(unique_id, summary_text) {
    return {
      unique_id: unique_id,
      type: "text",
      am_shrunk: false,
      summary_text: summary_text,
      console_text: "",
      show_markdown: false
    };
  }
  function _pasteImage() {
    var clipboardContents;
    var blob = null;
    navigator.clipboard.read().then(function (response) {
      clipboardContents = response;
      var _iterator = _createForOfIteratorHelper(clipboardContents),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          if (item.types.includes("image/png")) {
            item.getType("image/png").then(function (response) {
              blob = response;
              if (blob == null) return;
              gotBlob(blob);
            });
            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    });
    function gotBlob(blob) {
      var formData = new FormData();
      formData.append('image', blob, 'image.png');
      formData.append("main_id", props.main_id);
      $.ajax({
        url: '/print_blob_area_to_console',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function success(response) {
          console.log("");
        },
        error: function error(xhr, status, _error) {
          console.log(xhr.responseText);
        }
      });
    }
  }
  function _addConsoleText(the_text) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    (0, _communication_react.postWithCallback)("host", "print_text_area_to_console", {
      "console_text": the_text,
      "user_id": window.user_id,
      "main_id": props.main_id
    }, function (data) {
      if (!data.success) {
        (0, _toaster.doFlash)(data);
      } else if (callback != null) {
        callback();
      }
    }, null, props.main_id);
  }
  var _addBlankText = (0, _react.useCallback)(function () {
    if (window.in_context && !props.am_selected) {
      return;
    }
    _addConsoleText("");
  }, [props.am_selected]);
  function _addConsoleDivider(header_text) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    (0, _communication_react.postWithCallback)("host", "print_divider_area_to_console", {
      "header_text": header_text,
      "user_id": window.user_id,
      "main_id": props.main_id
    }, function (data) {
      if (!data.success) {
        (0, _toaster.doFlash)(data);
      } else if (callback) {
        callback();
      }
    }, null, props.main_id);
  }
  var _addBlankDivider = (0, _react.useCallback)(function () {
    if (window.in_context && !props.am_selected) {
      return;
    }
    _addConsoleDivider("");
  }, [props.am_selected]);
  function _getSectionIds(unique_id) {
    var cindex = _consoleItemIndex(unique_id);
    var id_list = [unique_id];
    for (var i = cindex + 1; i < props.console_items.current.length; ++i) {
      var entry = props.console_items.current[i];
      id_list.push(entry.unique_id);
      if (entry.type == "section-end") {
        break;
      }
    }
    return id_list;
  }
  var _deleteSection = (0, _react.useCallback)(function (unique_id) {
    var centry = get_console_item_entry(unique_id);
    var confirm_text = "Delete section ".concat(centry.header_text, "?");
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Delete Section",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "delete",
      handleSubmit: function handleSubmit() {
        var id_list = _getSectionIds(unique_id);
        var cindex = _consoleItemIndex(unique_id);
        var new_console_items = _toConsumableArray(props.console_items.current);
        new_console_items.splice(cindex, id_list.length);
        _clear_all_selected_items();
        props.dispatch({
          type: "delete_items",
          id_list: id_list
        });
      },
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }, []);
  var _copySection = (0, _react.useCallback)(function () {
    var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (!unique_id) {
      if (all_selected_items_ref.current.length != 1) {
        return;
      }
      unique_id = all_selected_items_ref.current[0];
      var entry = get_console_item_entry(unique_id);
      if (entry.type != "divider") {
        return;
      }
    }
    var id_list = _getSectionIds(unique_id);
    _copyItems(id_list);
  }, []);
  var _copyCell = (0, _react.useCallback)(function () {
    var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var id_list;
    if (!unique_id) {
      id_list = _sortSelectedItems();
      if (id_list.length == 0) {
        return;
      }
    } else {
      id_list = [unique_id];
    }
    _copyItems(id_list);
  }, []);
  function _copyAll() {
    var result_dict = {
      "main_id": props.main_id,
      "console_items": props.console_items.current,
      "user_id": window.user_id
    };
    (0, _communication_react.postWithCallback)("host", "copy_console_cells", result_dict, null, null, props.main_id);
  }
  function _copyItems(id_list) {
    var entry_list = [];
    var in_section = false;
    var _iterator2 = _createForOfIteratorHelper(props.console_items.current),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var entry = _step2.value;
        if (in_section) {
          entry.am_selected = false;
          entry_list.push(entry);
          in_section = entry.type != "section-end";
        } else {
          if (id_list.includes(entry.unique_id)) {
            entry.am_selected = false;
            entry_list.push(entry);
            if (entry.type == "divider") {
              in_section = true;
            }
          }
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    var result_dict = {
      "main_id": props.main_id,
      "console_items": entry_list,
      "user_id": window.user_id
    };
    (0, _communication_react.postWithCallback)("host", "copy_console_cells", result_dict, null, null, props.main_id);
  }
  var _pasteCell = (0, _react.useCallback)(function () {
    var unique_id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    (0, _communication_react.postWithCallback)("host", "get_copied_console_cells", {
      user_id: window.user_id
    }, function (data) {
      if (!data.success) {
        (0, _toaster.doFlash)(data);
      } else {
        _addConsoleEntries(data.console_items, true, false, unique_id);
      }
    }, null, props.main_id);
  }, []);
  function _addConsoleTextLink() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    (0, _communication_react.postWithCallback)("host", "print_link_area_to_console", {
      "user_id": window.user_id,
      "main_id": props.main_id
    }, function (data) {
      if (!data.success) {
        (0, _toaster.doFlash)(data);
      } else if (callback) {
        callback();
      }
    }, null, props.main_id);
  }
  function _currently_selected() {
    if (all_selected_items_ref.current.length == 0) {
      return null;
    } else {
      return _lodash["default"].last(all_selected_items_ref.current);
    }
  }
  var _insertResourceLink = (0, _react.useCallback)(function () {
    if (!_currently_selected()) {
      _addConsoleTextLink();
      return;
    }
    var entry = get_console_item_entry(_currently_selected());
    if (!entry || entry.type != "text") {
      _addConsoleTextLink();
      return;
    }
    _insertLinkInItem(_currently_selected());
  }, []);
  function _insertLinkInItem(unique_id) {
    var entry = get_console_item_entry(unique_id);
    dialogFuncs.showModal("SelectResourceDialog", {
      cancel_text: "cancel",
      submit_text: "insert link",
      handleSubmit: function handleSubmit(result) {
        var new_links = "links" in entry ? _toConsumableArray(entry.links) : [];
        new_links.push({
          res_type: result.type,
          res_name: result.selected_resource
        });
        _setConsoleItemValue(entry.unique_id, "links", new_links);
      },
      handleClose: dialogFuncs.hideModal
    });
  }
  var _addBlankCode = (0, _react.useCallback)(function (e) {
    if (window.in_context && !props.am_selected) {
      return;
    }
    _addCodeArea("");
  }, [props.am_selected]);
  function _addCodeArea(the_text) {
    var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    (0, _communication_react.postWithCallback)("host", "print_code_area_to_console", {
      console_text: the_text,
      user_id: window.user_id,
      main_id: props.main_id,
      force_open: force_open
    }, function (data) {
      if (!data.success) {
        (0, _toaster.doFlash)(data);
      }
    }, null, props.main_id);
  }
  var _resetConsole = (0, _react.useCallback)(function () {
    props.dispatch({
      type: "reset"
    });
    (0, _communication_react.postWithCallback)(props.main_id, "clear_console_namespace", {}, null, null, props.main_id);
  }, []);
  function _stopAll() {
    (0, _communication_react.postWithCallback)(props.main_id, "stop_all_console_code", {}, null, null, props.main_id);
  }
  var _clearConsole = (0, _react.useCallback)(function () {
    var confirm_text = "Are you sure that you want to erase everything in this log?";
    dialogFuncs.showModal("ConfirmDialog", {
      title: "Clear entire log",
      text_body: confirm_text,
      cancel_text: "do nothing",
      submit_text: "clear",
      handleSubmit: function handleSubmit() {
        set_all_selected_items([]);
        pushCallback(function () {
          props.dispatch({
            type: "delete_all_items"
          });
        });
      },
      handleClose: dialogFuncs.hideModal,
      handleCancel: null
    });
  }, []);
  function _togglePseudoLog() {
    set_show_pseudo_log(!show_pseudo_log);
  }
  function _toggleMainLog() {
    set_show_main_log(!show_main_log);
  }
  var _setFocusedItem = (0, _react.useCallback)(function (unique_id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    set_console_item_with_focus(unique_id);
    if (unique_id) {
      set_console_item_saved_focus(unique_id);
    }
    pushCallback(callback);
  }, []);
  function _zoomConsole() {
    props.setMainStateValue("console_is_zoomed", true);
  }
  function _unzoomConsole() {
    props.setMainStateValue("console_is_zoomed", false);
  }
  function _expandConsole() {
    props.setMainStateValue("console_is_shrunk", false);
  }
  function _shrinkConsole() {
    props.setMainStateValue("console_is_shrunk", true);
    if (props.mState.console_is_zoomed) {
      _unzoomConsole();
    }
  }
  function _toggleExports() {
    props.setMainStateValue("show_exports_pane", !props.mState.show_exports_pane);
  }
  var _setConsoleItemValue = (0, _react.useCallback)(function (unique_id, field, new_value) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    props.dispatch({
      type: "change_item_value",
      unique_id: unique_id,
      field: field,
      new_value: new_value
    });
    pushCallback(callback);
  }, []);
  function _reOpenClosedDividers() {
    if (temporarily_closed_items.current.length == 0) {
      return;
    }
    props.dispatch({
      type: "open_listed_dividers",
      divider_list: temporarily_closed_items.current
    });
  }
  function _closeAllDividers() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var _iterator3 = _createForOfIteratorHelper(console_items.current),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var entry = _step3.value;
        if (entry.type == "divider") {
          if (!entry.am_shrunk) {
            entry.am_shrunk = true;
            temporarily_closed_items.current.push(entry.unique_id);
          }
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    props.dispatch("close_all_divider");
  }
  function _multiple_console_item_updates(updates) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.dispatch({
      type: "update_items",
      updates: updates
    });
    pushCallback(callback);
  }
  function _clear_all_selected_items() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    set_all_selected_items([]);
    pushCallback(function () {
      props.dispatch({
        type: "clear_all_selected"
      });
    });
    pushCallback(callback);
  }
  function _reduce_to_last_selected() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    if (all_selected_items_ref.current.length <= 1) {
      if (callback) {
        callback();
      }
      return;
    }
    var updates = {};
    var _iterator4 = _createForOfIteratorHelper(all_selected_items_ref.current.slice(0, -1)),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var uid = _step4.value;
        updates[uid] = {
          am_selected: false,
          search_string: null
        };
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    _multiple_console_item_updates(updates, function () {
      set_all_selected_items(all_selected_items_ref.current.slice(-1));
      pushCallback(callback);
    });
  }
  function get_console_item_entry(unique_id) {
    return _lodash["default"].cloneDeep(props.console_items.current[_consoleItemIndex(unique_id)]);
  }
  function _dselectOneItem(unique_id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var updates = {};
    if (all_selected_items_ref.current.includes(unique_id)) {
      updates[unique_id] = {
        am_selected: false,
        search_string: null
      };
      _multiple_console_item_updates(updates, function () {
        var narray = _lodash["default"].cloneDeep(all_selected_items_ref.current);
        var myIndex = narray.indexOf(unique_id);
        if (myIndex !== -1) {
          narray.splice(myIndex, 1);
        }
        set_all_selected_items(narray);
        pushCallback(callback);
      });
    } else {
      pushCallback(callBack);
    }
  }
  var _selectConsoleItem = (0, _react.useCallback)(function (unique_id) {
    var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var updates = {};
    var shift_down = event != null && event.shiftKey;
    if (!shift_down) {
      var _iterator5 = _createForOfIteratorHelper(all_selected_items_ref.current),
        _step5;
      try {
        for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
          var uid = _step5.value;
          if (uid != unique_id) {
            updates[uid] = {
              am_selected: false,
              search_string: null
            };
          }
        }
      } catch (err) {
        _iterator5.e(err);
      } finally {
        _iterator5.f();
      }
      updates[unique_id] = {
        am_selected: true,
        search_string: search_string_ref.current
      };
      _multiple_console_item_updates(updates, function () {
        set_all_selected_items([unique_id]);
        pushCallback(callback);
      });
    } else {
      if (all_selected_items_ref.current.includes(unique_id)) {
        _dselectOneItem(unique_id);
      } else {
        updates[unique_id] = {
          am_selected: true,
          search_string: search_string_ref.current
        };
        _multiple_console_item_updates(updates, function () {
          var narray = _lodash["default"].cloneDeep(all_selected_items_ref.current);
          narray.push(unique_id);
          set_all_selected_items(narray);
          pushCallback(callback);
        });
      }
    }
  }, []);
  function _sortSelectedItems() {
    var sitems = _lodash["default"].cloneDeep(all_selected_items_ref.current);
    sitems.sort(function (firstEl, secondEl) {
      return _consoleItemIndex(firstEl) < _consoleItemIndex(secondEl) ? -1 : 1;
    });
    return sitems;
  }
  function _clearSelectedItem() {
    var updates = {};
    var _iterator6 = _createForOfIteratorHelper(all_selected_items_ref.current),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var uid = _step6.value;
        updates[unique_id] = {
          am_selected: false,
          search_string: null
        };
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    _multiple_console_item_updates(updates, function () {
      set_all_selected_items({});
      set_console_item_with_focus(null);
    });
  }
  function _consoleItemIndex(unique_id) {
    var console_items = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var counter = 0;
    if (console_items == null) {
      console_items = props.console_items.current;
    }
    var _iterator7 = _createForOfIteratorHelper(console_items),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var entry = _step7.value;
        if (entry.unique_id == unique_id) {
          return counter;
        }
        ++counter;
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
    return -1;
  }
  function _moveSection(_ref, filtered_items) {
    var oldIndex = _ref.oldIndex,
      newIndex = _ref.newIndex;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    if (newIndex > oldIndex) {
      newIndex += 1;
    }
    var move_entry = filtered_items[oldIndex];
    var move_index = _consoleItemIndex(move_entry.unique_id);
    var section_ids = _getSectionIds(move_entry.unique_id);
    var the_section = _lodash["default"].cloneDeep(props.console_items.current.slice(move_index, move_index + section_ids.length));
    props.dispatch({
      type: "delete_items",
      id_list: section_ids
    });
    pushCallback(function () {
      var below_index;
      if (newIndex == 0) {
        below_index = 0;
      } else {
        var trueNewIndex;
        if (newIndex >= filtered_items.length) {
          trueNewIndex = -1;
        } else trueNewIndex = _consoleItemIndex(filtered_items[newIndex].unique_id);
        // noinspection ES6ConvertIndexedForToForOf
        if (trueNewIndex == -1) {
          below_index = props.console_items.current.length;
        } else {
          for (below_index = trueNewIndex; below_index < props.console_items.current.length; ++below_index) {
            if (props.console_items.current[below_index].type == "divider") {
              break;
            }
          }
          if (below_index >= props.console_items.current.length) {
            below_index = props.console_items.current.length;
          }
        }
      }
      console.log("Got below index " + String(below_index));
      props.dispatch({
        type: "add_at_index",
        new_items: the_section,
        insert_index: below_index
      });
      pushCallback(callback);
    });
  }
  function _moveEntryAfterEntry(move_id, above_id) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var new_console_items = _toConsumableArray(props.console_items.current);
    var move_entry = _lodash["default"].cloneDeep(get_console_item_entry(move_id));
    props.dispatch({
      type: "delete_item",
      unique_id: move_id
    });
    pushCallback(function () {
      var target_index;
      if (above_id == null) {
        target_index = 0;
      } else {
        target_index = _consoleItemIndex(above_id) + 1;
      }
      props.dispatch({
        type: "add_at_index",
        insert_index: target_index,
        new_items: [move_entry]
      });
      pushCallback(callback);
    });
  }
  var _resortConsoleItems = (0, _react.useCallback)(function (_ref2) {
    var destination = _ref2.destination,
      source = _ref2.source;
    var oldIndex = source.index;
    var newIndex = destination.index;
    filtered_items = filtered_items_ref.current;
    var callback = _showNonDividers;
    console.log("Got oldIndex ".concat(String(oldIndex), " newIndex ").concat(String(newIndex), " ").concat(filtered_items.length, " items"));
    if (oldIndex == newIndex) {
      callback();
      return;
    }
    var move_entry = filtered_items[oldIndex];
    if (move_entry.type == "divider") {
      _moveSection({
        oldIndex: oldIndex,
        newIndex: newIndex
      }, filtered_items, callback);
      return;
    }
    var trueOldIndex = _consoleItemIndex(move_entry.unique_id);
    var trueNewIndex;
    var above_entry;
    if (newIndex == 0) {
      above_entry = null;
    } else {
      if (newIndex > oldIndex) {
        above_entry = filtered_items[newIndex];
      } else {
        above_entry = filtered_items[newIndex - 1];
      }
      if (above_entry.type == "divider" && above_entry.am_shrunk) {
        var section_ids = _getSectionIds(above_entry.unique_id);
        var lastIdInSection = _lodash["default"].last(section_ids);
        _moveEntryAfterEntry(move_entry.unique_id, lastIdInSection, callback);
        return;
      }
    }
    var target_id = above_entry == null ? null : above_entry.unique_id;
    _moveEntryAfterEntry(move_entry.unique_id, target_id, callback);
  }, []);
  var _goToNextCell = (0, _react.useCallback)(function (unique_id) {
    var next_index = _consoleItemIndex(unique_id) + 1;
    var _loop = function _loop() {
      var next_id = props.console_items.current[next_index].unique_id;
      var next_item = props.console_items.current[next_index];
      if (!next_item.am_shrunk && (next_item.type == "code" || next_item.type == "text" && !next_item.show_markdown)) {
        if (!next_item.show_on_filtered) {
          set_filter_console_items(false);
          pushCallback(function () {
            _setConsoleItemValue(next_id, "set_focus", true);
          });
        } else {
          _setConsoleItemValue(next_id, "set_focus", true);
        }
        return {
          v: void 0
        };
      }
      next_index += 1;
    };
    while (next_index < props.console_items.current.length) {
      var _ret = _loop();
      if (_typeof(_ret) === "object") return _ret.v;
    }
    _addCodeArea("");
    return;
  }, []);
  function _isDividerSelected() {
    var _iterator8 = _createForOfIteratorHelper(all_selected_items_ref.current),
      _step8;
    try {
      for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
        var uid = _step8.value;
        var centry = get_console_item_entry(uid);
        if (centry.type == "divider") {
          return true;
        }
      }
    } catch (err) {
      _iterator8.e(err);
    } finally {
      _iterator8.f();
    }
    return false;
  }
  function _doDeleteSelected() {
    var new_console_items = [];
    var in_section = false;
    var to_delete = [];
    var _iterator9 = _createForOfIteratorHelper(props.console_items.current),
      _step9;
    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var entry = _step9.value;
        if (in_section) {
          to_delete.push(entry.unique_id);
          in_section = entry.type != "section-end";
          continue;
        }
        if (all_selected_items_ref.current.includes(entry.unique_id)) {
          to_delete.push(entry.unique_id);
          if (entry.type == "divider") {
            in_section = true;
          }
        }
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }
    _clear_all_selected_items(function () {
      props.dispatch({
        type: "delete_items",
        id_list: to_delete
      });
    });
  }
  function _deleteSelected() {
    if (_are_selected()) {
      var new_console_items = [];
      if (_isDividerSelected()) {
        var confirm_text = "The selection includes section dividers. " + "The sections will be completed in their entirety. Do you want to continue";
        dialogFuncs.showModal("ConfirmDialog", {
          title: "Do Delete",
          text_body: confirm_text,
          cancel_text: "do nothing",
          submit_text: "delete",
          handleSubmit: function handleSubmit() {
            _doDeleteSelected();
          },
          handleClose: dialogFuncs.hideModal,
          handleCancel: null
        });
      } else {
        _doDeleteSelected();
      }
    }
  }
  var _closeConsoleItem = (0, _react.useCallback)(function (unique_id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var centry = get_console_item_entry(unique_id);
    if (centry.type == "divider") {
      _deleteSection(unique_id);
    } else {
      _dselectOneItem(unique_id, function () {
        props.dispatch({
          type: "delete_item",
          unique_id: unique_id
        });
      });
    }
  }, []);
  function _getNextEndIndex(start_id) {
    var start_index = _consoleItemIndex(start_id);
    var _iterator10 = _createForOfIteratorHelper(props.console_items.current.slice(start_index)),
      _step10;
    try {
      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
        var entry = _step10.value;
        if (entry.type == "section-end") {
          return _consoleItemIndex(entry.unique_id);
        }
      }
    } catch (err) {
      _iterator10.e(err);
    } finally {
      _iterator10.f();
    }
    return props.console_items.current.length;
  }
  function _isInSection(unique_id) {
    var idx = _consoleItemIndex(unique_id);
    var _iterator11 = _createForOfIteratorHelper(props.console_items.current.slice(idx + 1)),
      _step11;
    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var entry = _step11.value;
        if (entry.type == "divider") {
          return false;
        } else {
          if (entry.type == "section-end") {
            return true;
          }
        }
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
    }
    return false;
  }
  function _addConsoleEntries(new_entries) {
    var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var set_focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var unique_id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    _lodash["default"].last(new_entries).set_focus = set_focus;
    var inserting_divider = false;
    var _iterator12 = _createForOfIteratorHelper(new_entries),
      _step12;
    try {
      for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
        var entry = _step12.value;
        if (entry.type == "divider") {
          inserting_divider = true;
        }
      }
    } catch (err) {
      _iterator12.e(err);
    } finally {
      _iterator12.f();
    }
    var last_id = _lodash["default"].last(new_entries).unique_id;
    var insert_index;
    if (unique_id) {
      if (inserting_divider && _isInSection(unique_id)) {
        insert_index = _getNextEndIndex(unique_id) + 1;
      } else {
        insert_index = _consoleItemIndex(unique_id) + 1;
      }
    } else if (props.console_items.current.length == 0 || all_selected_items_ref.current.length == 0) {
      insert_index = props.console_items.current.length;
    } else {
      var current_selected_id = _currently_selected();
      if (inserting_divider && _isInSection(current_selected_id)) {
        insert_index = _getNextEndIndex(current_selected_id) + 1;
      } else {
        var selected_item = get_console_item_entry(current_selected_id);
        if (selected_item.type == "divider") {
          if (selected_item.am_shrunk) {
            insert_index = _getNextEndIndex(current_selected_id) + 1;
          } else {
            insert_index = _consoleItemIndex(current_selected_id) + 1;
          }
        } else {
          insert_index = _consoleItemIndex(current_selected_id) + 1;
        }
      }
    }
    props.dispatch({
      type: "add_at_index",
      insert_index: insert_index,
      new_items: new_entries
    });
    pushCallback(function () {
      if (force_open) {
        props.setMainStateValue("console_is_shrunk", false, function () {
          _selectConsoleItem(last_id, null, callback);
        });
      } else {
        _selectConsoleItem(last_id, null, callback);
      }
    });
  }
  function _addConsoleEntry(new_entry) {
    var force_open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var set_focus = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    var unique_id = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var callback = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
    _addConsoleEntries([new_entry], force_open, set_focus, unique_id, callback);
  }
  function _startSpinner(unique_id) {
    var update_dict = {
      show_spinner: true,
      running: true
    };
    var updates = {};
    updates[unique_id] = update_dict;
    props.dispatch({
      type: "update_items",
      updates: updates
    });
  }
  function _stopConsoleSpinner(unique_id) {
    var execution_count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var update_dict = {
      show_spinner: false,
      running: false
    };
    if ("execution_count" != null) {
      update_dict.execution_count = execution_count;
    }
    var updates = {};
    updates[unique_id] = update_dict;
    props.dispatch({
      type: "update_items",
      updates: updates
    });
  }
  function _appendConsoleItemOutput(data) {
    var current = get_console_item_entry(data.console_id).output_text;
    if (current != "") {
      current += "<br>";
    }
    current += data.result_text;
    if (current.length > MAX_OUTPUT_LENGTH) {
      current = current.slice(-1 * MAX_OUTPUT_LENGTH);
    }
    _setConsoleItemValue(data.console_id, "output_text", current);
  }
  function _setConsoleItemOutput(data) {
    var current = data.message;
    if (current.length > MAX_OUTPUT_LENGTH) {
      current = current.slice(-1 * MAX_OUTPUT_LENGTH);
    }
    _setConsoleItemValue(data.console_id, "output_text", current);
  }
  function _addToLog(new_line) {
    var log_content = console_error_log_text_ref.current;
    var log_list = log_content.split(/\r?\n/);
    var mlines = max_console_lines;
    if (log_list.length >= mlines) {
      log_list = log_list.slice(-1 * mlines + 1);
      log_content = log_list.join("\n");
    }
    set_console_error_log_text(log_content + new_line);
  }
  function _bodyHeight() {
    if (body_ref && body_ref.current) {
      return props.console_available_height - (body_ref.current.offsetTop - header_ref.current.offsetTop) - 2;
    } else {
      return props.console_available_height - 75;
    }
  }
  var _bodyWidth = (0, _react.useMemo)(function () {
    if (props.console_available_width > MAX_CONSOLE_WIDTH) {
      return MAX_CONSOLE_WIDTH;
    } else {
      return props.console_available_width;
    }
  }, [props.console_available_width]);
  var renderContextMenu = (0, _react.useMemo)(function () {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: function onClick() {
        _pasteCell();
      },
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "reset",
      onClick: _resetConsole,
      intent: "warning",
      text: "Clear output and reset"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _clearConsole,
      intent: "danger",
      text: "Erase everything"
    }));
  }, []);
  function _glif_text(show_glif_text, txt) {
    if (show_glif_text) {
      return txt;
    }
    return null;
  }
  function _clickConsoleBody(e) {
    _clear_all_selected_items();
    e.stopPropagation();
  }
  function _handleSearchFieldChange(event) {
    if (search_helper_text) {
      set_search_helper_text(null);
      pushCallback(function () {
        _setSearchString(event.target.value);
      });
    } else {
      _setSearchString(event.target.value);
    }
  }
  function _are_selected() {
    return all_selected_items_ref.current.length > 0;
  }
  function _setSearchString(val) {
    var nval = val == "" ? null : val;
    var updates = {};
    set_search_string(nval);
    pushCallback(function () {
      if (_are_selected()) {
        var _iterator13 = _createForOfIteratorHelper(all_selected_items_ref.current),
          _step13;
        try {
          for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
            var uid = _step13.value;
            updates[uid] = {
              search_string: search_string_ref.current
            };
          }
        } catch (err) {
          _iterator13.e(err);
        } finally {
          _iterator13.f();
        }
        _multiple_console_item_updates(updates);
      }
    });
  }
  function _handleUnFilter() {
    set_filter_console_items(false);
    set_search_helper_text(null);
    pushCallback(function () {
      _setSearchString(null);
    });
  }
  function _handleFilter() {
    var updates = {};
    var _iterator14 = _createForOfIteratorHelper(props.console_items.current),
      _step14;
    try {
      for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
        var entry = _step14.value;
        if (entry.type == "code" || entry.type == "text") {
          updates[entry.unique_id] = {
            show_on_filtered: entry.console_text.toLowerCase().includes(search_string_ref.current.toLowerCase())
          };
        } else if (entry.type == "divider") {
          updates[entry.unique_id] = {
            show_on_filtered: true
          };
        }
      }
    } catch (err) {
      _iterator14.e(err);
    } finally {
      _iterator14.f();
    }
    _multiple_console_item_updates(updates, function () {
      set_filter_console_items(true);
    });
  }
  function _searchNext() {
    var current_index;
    if (!_are_selected()) {
      current_index = 0;
    } else {
      current_index = _consoleItemIndex(_currently_selected()) + 1;
    }
    var _loop2 = function _loop2() {
      var entry = props.console_items.current[current_index];
      if (entry.type == "code" || entry.type == "text") {
        if (_selectIfMatching(entry, "console_text", function () {
          if (entry.type == "text") {
            _setConsoleItemValue(entry.unique_id, "show_markdown", false);
          }
        })) {
          set_search_helper_text(null);
          return {
            v: void 0
          };
        }
      }
      current_index += 1;
    };
    while (current_index < props.console_items.current.length) {
      var _ret2 = _loop2();
      if (_typeof(_ret2) === "object") return _ret2.v;
    }
    set_search_helper_text("No more results");
  }
  function _selectIfMatching(entry, text_field) {
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    if (entry[text_field].toLowerCase().includes(search_string_ref.current.toLowerCase())) {
      if (entry.am_shrunk) {
        _setConsoleItemValue(entry.unique_id, "am_shrunk", false, function () {
          _selectConsoleItem(entry.unique_id, null, callback);
        });
      } else {
        _selectConsoleItem(entry.unique_id, null, callback);
      }
      return true;
    }
    return false;
  }
  function _searchPrevious() {
    var current_index;
    if (!_are_selected()) {
      current_index = props.console_items.current.length - 1;
    } else {
      current_index = _consoleItemIndex(_currently_selected()) - 1;
    }
    var _loop3 = function _loop3() {
      var entry = props.console_items.current[current_index];
      if (entry.type == "code" || entry.type == "text") {
        if (_selectIfMatching(entry, "console_text", function () {
          if (entry.type == "text") {
            _setConsoleItemValue(entry.unique_id, "show_markdown", false);
          }
        })) {
          set_search_helper_text(null);
          return {
            v: void 0
          };
        }
      }
      current_index -= 1;
    };
    while (current_index >= 0) {
      var _ret3 = _loop3();
      if (_typeof(_ret3) === "object") return _ret3.v;
    }
    set_search_helper_text("No more results");
  }
  function _handleSubmit(e) {
    _searchNext();
    e.preventDefault();
  }
  function _shouldCancelSortStart() {
    return filter_console_items;
  }
  function menu_specs() {
    var ms = {
      Insert: [{
        name_text: "Text Cell",
        icon_name: "new-text-box",
        click_handler: _addBlankText,
        key_bindings: ["ctrl+t"]
      }, {
        name_text: "Code Cell",
        icon_name: "code",
        click_handler: _addBlankCode,
        key_bindings: ["ctrl+c"]
      }, {
        name_text: "Section",
        icon_name: "header",
        click_handler: _addBlankDivider
      }, {
        name_text: "Resource Link",
        icon_name: "link",
        click_handler: _insertResourceLink
      }],
      Edit: [{
        name_text: "Copy All",
        icon_name: "duplicate",
        click_handler: function click_handler() {
          _copyAll();
        }
      }, {
        name_text: "Copy Selected",
        icon_name: "duplicate",
        click_handler: function click_handler() {
          _copyCell();
        }
      }, {
        name_text: "Paste Cells",
        icon_name: "clipboard",
        click_handler: function click_handler() {
          _pasteCell();
        }
      }, {
        name_text: "Paste Image",
        icon_name: "clipboard",
        click_handler: function click_handler() {
          _pasteImage();
        }
      }, {
        name_text: "Delete Selected",
        icon_name: "trash",
        click_handler: function click_handler() {
          _deleteSelected();
        }
      }, {
        name_text: "divider2",
        icon_name: null,
        click_handler: "divider"
      }, {
        name_text: "Clear Log",
        icon_name: "trash",
        click_handler: _clearConsole
      }],
      Execute: [{
        name_text: "Run Selected",
        icon_name: "play",
        click_handler: _runSelected,
        key_bindings: ["ctrl+enter", "command+enter"]
      }, {
        name_text: "Stop All",
        icon_name: "stop",
        click_handler: _stopAll
      }, {
        name_text: "Reset All",
        icon_name: "reset",
        click_handler: _resetConsole
      }]
    };
    if (!(show_pseudo_log || show_main_log)) {
      ms["Consoles"] = [{
        name_text: "Show Log Console",
        icon_name: "console",
        click_handler: _togglePseudoLog
      }, {
        name_text: "Show Main Console",
        icon_name: "console",
        click_handler: _toggleMainLog
      }];
    } else {
      ms["Consoles"] = [{
        name_text: "Hide Console",
        icon_name: "console",
        click_handler: show_main_log ? _toggleMainLog : _togglePseudoLog
      }];
    }
    return ms;
  }
  function disabled_items() {
    var items = [];
    if (!_are_selected() || all_selected_items_ref.current.length != 1) {
      items.push("Run Selected");
      items.push("Copy Section");
      items.push("Delete Section");
    }
    if (all_selected_items_ref.current.length == 1) {
      var _unique_id = all_selected_items_ref.current[0];
      var entry = get_console_item_entry(_unique_id);
      if (!entry) {
        return [];
      }
      if (entry.type != "divider") {
        items.push("Copy Section");
        items.push("Delete Section");
      }
    }
    if (!_are_selected()) {
      items.push("Copy Selected");
      items.push("Delete Selected");
    }
    return items;
  }
  function _clearCodeOutput(unique_id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    _setConsoleItemValue(unique_id, "output_text", "", callback);
  }
  function _runSelected() {
    if (window.in_context && !props.am_selected) {
      return;
    }
    if (_are_selected() && all_selected_items_ref.current.length == 1) {
      var entry = get_console_item_entry(_currently_selected());
      if (entry.type == "code") {
        _runCodeItem(_currently_selected());
      } else if (entry.type == "text") {
        _showTextItemMarkdown(_currently_selected());
      }
    }
  }
  var _runCodeItem = (0, _react.useCallback)(function (unique_id) {
    var go_to_next = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    _clearCodeOutput(unique_id, function () {
      _startSpinner(unique_id);
      var entry = get_console_item_entry(unique_id);
      (0, _communication_react.postWithCallback)(props.main_id, "exec_console_code", {
        "the_code": entry.console_text,
        "console_id": unique_id
      }, function () {
        if (go_to_next) {
          _goToNextCell(unique_id);
        }
      }, null, props.main_id);
    });
  }, []);
  function _showTextItemMarkdown(unique_id) {
    _setConsoleItemValue(unique_id, "show_markdown", true);
  }
  function _hideNonDividers() {
    $(".in-section:not(.divider-log-panel)").css({
      opacity: "10%"
    });
  }
  function _showNonDividers() {
    $(".in-section:not(.divider-log-panel)").css({
      opacity: "100%"
    });
  }
  var _sortStart = (0, _react.useCallback)(function (_ref3) {
    var draggableId = _ref3.draggableId,
      mode = _ref3.mode;
    var idx = _consoleItemIndex(draggableId);
    var entry = props.console_items.current[idx];
    if (entry.type == "divider") {
      _hideNonDividers();
    }
  }, []);
  var gbstyle = {
    marginLeft: 1,
    marginTop: 2
  };
  var console_class = props.mState.console_is_shrunk ? "am-shrunk" : "not-shrunk";
  if (props.mState.console_is_zoomed) {
    console_class = "am-zoomed";
  }
  var outer_style = Object.assign({}, props.style);
  outer_style.width = _bodyWidth;
  var show_glif_text = outer_style.width > 800;
  var header_style = {};
  if (!props.shrinkable) {
    header_style["paddingLeft"] = 10;
  }
  if (!props.mState.console_is_shrunk) {
    header_style["paddingRight"] = 15;
  }
  var key_bindings = [[["escape"], function () {
    _clear_all_selected_items();
  }]];
  var in_closed_section = false;
  var in_section = false;
  var filtered_items = props.console_items.current.filter(function (entry) {
    if (entry.type == "divider") {
      in_section = true;
      in_closed_section = entry.am_shrunk;
      return true;
    } else if (entry.type == "section-end") {
      entry.in_section = true;
      var was_in_closed_section = in_closed_section;
      in_closed_section = false;
      in_section = false;
      return !was_in_closed_section;
    } else if (!in_closed_section) {
      entry.in_section = in_section;
      return true;
    }
  });
  if (filter_console_items) {
    filtered_items = filtered_items.filter(function (entry) {
      return entry.show_on_filtered;
    });
  }
  filtered_items_ref.current = filtered_items;
  var suggestionGlyphs = [];
  if (show_pseudo_log || show_main_log) {
    suggestionGlyphs.push({
      intent: "primary",
      icon: "console",
      handleClick: show_main_log ? _toggleMainLog : _togglePseudoLog
    });
  }
  var empty_style = (0, _react.useMemo)(function () {
    return {};
  }, []);
  return /*#__PURE__*/_react["default"].createElement(_core.Card, {
    id: "console-panel",
    className: console_class,
    elevation: 2,
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column justify-content-around"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "console-heading",
    ref: header_ref,
    style: header_style,
    className: "d-flex flex-row justify-content-between"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    id: "console-header-left",
    className: "d-flex flex-row"
  }, props.mState.console_is_shrunk && props.shrinkable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _expandConsole,
    style: {
      marginLeft: 2
    },
    icon: "chevron-right"
  }), !props.mState.console_is_shrunk && props.shrinkable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _shrinkConsole,
    style: {
      marginLeft: 2
    },
    icon: "chevron-down"
  }), /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
    menu_specs: menu_specs(),
    disabled_items: disabled_items(),
    suggestionGlyphs: suggestionGlyphs,
    showRefresh: false,
    showClose: false,
    refreshTab: props.refreshTab,
    closeTab: null,
    controlled: false // This doesn't matter
    ,
    am_selected: false // Also doesn't matter
  })), /*#__PURE__*/_react["default"].createElement("div", {
    id: "console-header-right",
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    extra_glyph_text: _glif_text(show_glif_text, "exports"),
    tooltip: "Show export browser",
    small: true,
    className: "show-exports-but",
    style: {
      marginRight: 5,
      marginTop: 2
    },
    handleClick: _toggleExports,
    icon: "variable"
  }), !props.mState.console_is_zoomed && props.zoomable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _zoomConsole,
    icon: "maximize"
  }), props.mState.console_is_zoomed && props.zoomable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _unzoomConsole,
    icon: "minimize"
  })))), !props.mState.console_is_shrunk && !show_pseudo_log && !show_main_log && /*#__PURE__*/_react["default"].createElement(_search_form.FilterSearchForm, {
    search_string: search_string_ref.current,
    handleSearchFieldChange: _handleSearchFieldChange,
    handleFilter: _handleFilter,
    handleUnFilter: _handleUnFilter,
    searchNext: _searchNext,
    searchPrevious: _searchPrevious,
    search_helper_text: search_helper_text
  }), !props.mState.console_is_shrunk && show_main_log && /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
    main_id: props.main_id,
    streaming_host: props.main_id,
    container_id: props.main_id,
    ref: body_ref,
    outer_style: {
      overflowX: "auto",
      overflowY: "auto",
      height: _bodyHeight(),
      marginLeft: 20,
      marginRight: 20
    },
    showCommandField: false
  }), !props.mState.console_is_shrunk && show_pseudo_log && /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
    main_id: props.main_id,
    streaming_host: props.main_id,
    container_id: pseudo_tile_id,
    ref: body_ref,
    outer_style: {
      overflowX: "auto",
      overflowY: "auto",
      height: _bodyHeight(),
      marginLeft: 20,
      marginRight: 20
    },
    showCommandField: true
  }), !props.mState.console_is_shrunk && !show_pseudo_log && !show_main_log && /*#__PURE__*/_react["default"].createElement("div", {
    id: "console",
    ref: body_ref,
    className: "contingent-scroll",
    onClick: _clickConsoleBody,
    style: {
      height: _bodyHeight()
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: renderContextMenu
  }, /*#__PURE__*/_react["default"].createElement(_sortable_container.SortableComponent, {
    id: "console-items-div",
    style: empty_style,
    main_id: props.main_id,
    ElementComponent: SuperItem,
    key_field_name: "unique_id",
    item_list: filtered_items,
    helperClass: theme.dark_theme ? "bp5-dark" : "light-theme",
    handle: ".console-sorter",
    onBeforeCapture: _sortStart,
    onDragEnd: _resortConsoleItems,
    setConsoleItemValue: _setConsoleItemValue,
    selectConsoleItem: _selectConsoleItem,
    console_available_width: _bodyWidth,
    execution_count: 0,
    runCodeItem: _runCodeItem,
    handleDelete: _closeConsoleItem,
    goToNextCell: _goToNextCell,
    setFocus: _setFocusedItem,
    addNewTextItem: _addBlankText,
    addNewCodeItem: _addBlankCode,
    addNewDividerItem: _addBlankDivider,
    copyCell: _copyCell,
    pasteCell: _pasteCell,
    copySection: _copySection,
    deleteSection: _deleteSection,
    insertResourceLink: _insertResourceLink,
    useDragHandle: false,
    pseudo_tile_id: pseudo_tile_id,
    handleCreateViewer: props.handleCreateViewer,
    axis: "y"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    id: "padding-div",
    style: {
      height: 500
    }
  })), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
    global: true,
    active: !props.controlled || props.am_selected,
    bindings: key_bindings
  }));
}
exports.ConsoleComponent = ConsoleComponent = /*#__PURE__*/(0, _react.memo)(ConsoleComponent);
ConsoleComponent.propTypes = {
  console_items: _propTypes["default"].object,
  mState: _propTypes["default"].object,
  setMainStateValue: _propTypes["default"].func,
  console_available_height: _propTypes["default"].number,
  console_available_width: _propTypes["default"].number,
  style: _propTypes["default"].object,
  shrinkable: _propTypes["default"].bool,
  zoomable: _propTypes["default"].bool
};
ConsoleComponent.defaultProps = {
  style: {},
  shrinkable: true,
  zoomable: true
};
function Shandle(props) {
  return /*#__PURE__*/_react["default"].createElement("span", props.dragHandleProps, /*#__PURE__*/_react["default"].createElement(_core.Icon, _extends({
    icon: "drag-handle-vertical"
  }, props.dragHandleProps, {
    style: {
      marginLeft: 0,
      marginRight: 6
    },
    size: 20,
    className: "console-sorter"
  })));
}
function SuperItem(props) {
  switch (props.type) {
    case "text":
      return /*#__PURE__*/_react["default"].createElement(ConsoleTextItem, props);
    case "code":
      return /*#__PURE__*/_react["default"].createElement(ConsoleCodeItem, props);
    case "fixed":
      return /*#__PURE__*/_react["default"].createElement(LogItem, props);
    case "figure":
      return /*#__PURE__*/_react["default"].createElement(BlobItem, props);
    case "divider":
      return /*#__PURE__*/_react["default"].createElement(DividerItem, props);
    case "section-end":
      return /*#__PURE__*/_react["default"].createElement(SectionEndItem, props);
    default:
      return null;
  }
}
SuperItem = /*#__PURE__*/(0, _react.memo)(SuperItem);
var divider_item_update_props = ["am_shrunk", "am_selected", "header_text", "console_available_width"];
function DividerItem(props) {
  function _toggleShrink() {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }
  function _deleteMe() {
    props.handleDelete(props.unique_id);
  }
  function _handleHeaderTextChange(value) {
    props.setConsoleItemValue(props.unique_id, "header_text", value);
  }
  function _copyMe() {
    props.copyCell(props.unique_id);
  }
  function _copySection() {
    props.copySection(props.unique_id);
  }
  function _deleteSection() {
    props.deleteSection(props.unique_id);
  }
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    var self = this;
    _selectMe(null, function () {
      props.addNewDividerItem();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  function renderContextMenu() {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Section"
    }));
  }
  function _consoleItemClick(e) {
    _selectMe(e);
    e.stopPropagation();
  }
  var converted_dict = {
    __html: props.console_text
  };
  var panel_class = props.am_shrunk ? "log-panel in-section divider-log-panel log-panel-invisible fixed-log-panel" : "log-panel divider-log-panel log-panel-visible fixed-log-panel";
  if (props.am_selected) {
    panel_class += " selected";
  }
  if (props.is_error) {
    panel_class += " error-log-panel";
  }
  var body_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: renderContextMenu()
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    id: props.unique_id,
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: {
      marginTop: 5
    },
    handleClick: _toggleShrink
  })), /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.header_text,
    onChange: _handleHeaderTextChange,
    className: "console-divider-text"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    intent: "danger",
    tooltip: "Delete this item",
    style: {
      marginLeft: 10,
      marginRight: 66,
      minHeight: 0
    },
    icon: "trash"
  }))));
}
DividerItem = /*#__PURE__*/(0, _react.memo)(DividerItem);
var section_end_item_update_props = ["am_selected", "console_available_width"];
function SectionEndItem(props) {
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDividerItem();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  function renderContextMenu() {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null));
  }
  function _consoleItemClick(e) {
    _selectMe(e);
    e.stopPropagation();
  }
  var panel_class = "log-panel in-section section-end-log-panel log-panel-visible fixed-log-panel";
  if (props.am_selected) {
    panel_class += " selected";
  }
  var body_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
  var line_style = {
    marginLeft: 65,
    marginRight: 85,
    marginTop: 10,
    borderBottomWidth: 2
  };
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: renderContextMenu()
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    id: props.unique_id,
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
    minimal: true,
    vertical: true,
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement("span", props.dragHandleProps), /*#__PURE__*/_react["default"].createElement(_core.Divider, {
    style: line_style
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  })));
}
SectionEndItem = /*#__PURE__*/(0, _react.memo)(SectionEndItem);
var log_item_update_props = ["is_error", "am_shrunk", "am_selected", "in_section", "summary_text", "console_text", "console_available_width"];
function LogItem(props) {
  var last_output_text = (0, _react.useRef)("");
  (0, _react.useEffect)(function () {
    executeEmbeddedScripts();
    makeTablesSortable();
  });
  function _toggleShrink() {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }
  function _deleteMe() {
    props.handleDelete(props.unique_id);
  }
  function _handleSummaryTextChange(value) {
    props.setConsoleItemValue(props.unique_id, "summary_text", value);
  }
  function executeEmbeddedScripts() {
    if (props.output_text != last_output_text.current) {
      // to avoid doubles of bokeh images
      last_output_text.current = props.output_text;
      var scripts = $("#" + props.unique_id + " .log-code-output script").toArray();
      var _iterator15 = _createForOfIteratorHelper(scripts),
        _step15;
      try {
        for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
          var script = _step15.value;
          try {
            window.eval(script.text);
          } catch (e) {}
        }
      } catch (err) {
        _iterator15.e(err);
      } finally {
        _iterator15.f();
      }
    }
  }
  function makeTablesSortable() {
    var tables = $("#" + props.unique_id + " table.sortable").toArray();
    var _iterator16 = _createForOfIteratorHelper(tables),
      _step16;
    try {
      for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
        var table = _step16.value;
        sorttable.makeSortable(table);
      }
    } catch (err) {
      _iterator16.e(err);
    } finally {
      _iterator16.f();
    }
  }
  function _copyMe() {
    props.copyCell(props.unique_id);
  }
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDividerItem();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  function renderContextMenu() {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Cell"
    }));
  }
  function _consoleItemClick(e) {
    _selectMe(e);
    e.stopPropagation();
  }
  var panel_class = props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
  var converted_dict = {
    __html: props.console_text
  };
  if (props.in_section) {
    panel_class += " in-section";
  }
  if (props.am_selected) {
    panel_class += " selected";
  }
  if (props.is_error) {
    panel_class += " error-log-panel";
  }
  var body_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
  if (props.in_section) {
    body_width -= SECTION_INDENT / 2;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: renderContextMenu()
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    id: props.unique_id,
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: {
      marginTop: 5
    },
    handleClick: _toggleShrink
  })), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.summary_text,
    onChange: _handleSummaryTextChange,
    className: "log-panel-summary"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    intent: "danger",
    tooltip: "Delete this item",
    style: {
      marginLeft: 10,
      marginRight: 66
    },
    icon: "trash"
  }))), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-panel-body d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginTop: 10,
      marginLeft: 30,
      padding: 8,
      width: body_width,
      border: "1px solid #c7c7c7"
    },
    dangerouslySetInnerHTML: converted_dict
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: {
      marginLeft: 10,
      marginRight: 66
    },
    intent: "danger",
    icon: "trash"
  }))))));
}
LogItem = /*#__PURE__*/(0, _react.memo)(LogItem);
var blob_item_update_props = ["is_error", "am_shrunk", "am_selected", "in_section", "summary_text", "image_data_str", "console_available_width"];
function BlobItem(props) {
  var last_output_text = (0, _react.useRef)("");
  (0, _react.useEffect)(function () {
    executeEmbeddedScripts();
    makeTablesSortable();
  });
  function _toggleShrink() {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }
  function _deleteMe() {
    props.handleDelete(props.unique_id);
  }
  function _handleSummaryTextChange(value) {
    props.setConsoleItemValue(props.unique_id, "summary_text", value);
  }
  function executeEmbeddedScripts() {
    if (props.output_text != last_output_text.current) {
      // to avoid doubles of bokeh images
      last_output_text.current = props.output_text;
      var scripts = $("#" + props.unique_id + " .log-code-output script").toArray();
      var _iterator17 = _createForOfIteratorHelper(scripts),
        _step17;
      try {
        for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
          var script = _step17.value;
          try {
            window.eval(script.text);
          } catch (e) {}
        }
      } catch (err) {
        _iterator17.e(err);
      } finally {
        _iterator17.f();
      }
    }
  }
  function makeTablesSortable() {
    var tables = $("#" + props.unique_id + " table.sortable").toArray();
    var _iterator18 = _createForOfIteratorHelper(tables),
      _step18;
    try {
      for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
        var table = _step18.value;
        sorttable.makeSortable(table);
      }
    } catch (err) {
      _iterator18.e(err);
    } finally {
      _iterator18.f();
    }
  }
  function _copyMe() {
    props.copyCell(props.unique_id);
  }
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDividerItem();
    });
  }
  function _addBlankCode() {
    var self = this;
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  function renderContextMenu() {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Cell"
    }));
  }
  function _consoleItemClick(e) {
    _selectMe(e);
    e.stopPropagation();
  }
  var panel_class = props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
  if (props.in_section) {
    panel_class += " in-section";
  }
  if (props.am_selected) {
    panel_class += " selected";
  }
  var body_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
  if (props.in_section) {
    body_width -= SECTION_INDENT / 2;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: renderContextMenu()
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    id: props.unique_id,
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: {
      marginTop: 5
    },
    handleClick: _toggleShrink
  })), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.summary_text,
    onChange: _handleSummaryTextChange,
    className: "log-panel-summary"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    intent: "danger",
    tooltip: "Delete this item",
    style: {
      marginLeft: 10,
      marginRight: 66
    },
    icon: "trash"
  }))), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-panel-body d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginTop: 10,
      marginLeft: 30,
      padding: 8,
      width: body_width,
      border: "1px solid #c7c7c7"
    }
  }, props.image_data_str && /*#__PURE__*/_react["default"].createElement("img", {
    src: props.image_data_str,
    alt: "An Image",
    width: body_width - 25
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    tooltip: "Delete this item",
    style: {
      marginLeft: 10,
      marginRight: 66
    },
    intent: "danger",
    icon: "trash"
  }))))));
}
BlobItem = /*#__PURE__*/(0, _react.memo)(BlobItem);
BlobItem.propTypes = {
  unique_id: _propTypes["default"].string,
  in_section: _propTypes["default"].bool,
  is_error: _propTypes["default"].bool,
  am_shrunk: _propTypes["default"].bool,
  summary_text: _propTypes["default"].string,
  selectConsoleItem: _propTypes["default"].func,
  am_selected: _propTypes["default"].bool,
  blob: _propTypes["default"].object,
  setConsoleItemValue: _propTypes["default"].func,
  handleDelete: _propTypes["default"].func,
  console_available_width: _propTypes["default"].number
};
var code_item_update_props = ["am_shrunk", "set_focus", "am_selected", "search_string", "summary_text", "console_text", "in_section", "show_spinner", "execution_count", "output_text", "console_available_width", "dark_theme"];
function ConsoleCodeItem(props) {
  var elRef = (0, _react.useRef)(null);
  var last_output_text = (0, _react.useRef)("");
  var am_selected_previous = (0, _react.useRef)(false);
  var setFocusFunc = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    executeEmbeddedScripts();
    makeTablesSortable();
    if (props.am_selected && !am_selected_previous.current && elRef && elRef.current) {
      scrollMeIntoView();
    }
    am_selected_previous.current = props.am_selected;
    if (props.set_focus && setFocusFunc.current) {
      setFocusFunc.current();
      props.setConsoleItemValue(props.unique_id, "set_focus", false, _selectMe);
    }
  });
  var registerSetFocusFunc = (0, _react.useCallback)(function (theFunc) {
    setFocusFunc.current = theFunc;
  }, []);
  function scrollMeIntoView() {
    var my_element = elRef.current;
    var outer_element = my_element.parentNode.parentNode;
    var scrolled_element = my_element.parentNode;
    var outer_height = outer_element.offsetHeight;
    var distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
    if (distance_from_top > outer_height - 35) {
      var distance_to_move = distance_from_top - .5 * outer_height;
      outer_element.scrollTop += distance_to_move;
    } else if (distance_from_top < 0) {
      var _distance_to_move = .25 * outer_height - distance_from_top;
      outer_element.scrollTop -= _distance_to_move;
    }
  }
  function executeEmbeddedScripts() {
    if (props.output_text != last_output_text.current) {
      // to avoid doubles of bokeh images
      last_output_text.current = props.output_text;
      var scripts = $("#" + props.unique_id + " .log-code-output script").toArray();
      var _iterator19 = _createForOfIteratorHelper(scripts),
        _step19;
      try {
        for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
          var script = _step19.value;
          // noinspection EmptyCatchBlockJS,UnusedCatchParameterJS
          try {
            window.eval(script.text);
          } catch (e) {}
        }
      } catch (err) {
        _iterator19.e(err);
      } finally {
        _iterator19.f();
      }
    }
  }
  function makeTablesSortable() {
    var tables = $("#" + props.unique_id + " table.sortable").toArray();
    var _iterator20 = _createForOfIteratorHelper(tables),
      _step20;
    try {
      for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
        var table = _step20.value;
        sorttable.makeSortable(table);
      }
    } catch (err) {
      _iterator20.e(err);
    } finally {
      _iterator20.f();
    }
  }
  function _stopMe() {
    _stopMySpinner();
    (0, _communication_react.postWithCallback)(props.main_id, "stop_console_code", {
      "console_id": props.unique_id
    }, null, null, props.main_id);
  }
  function _showMySpinner() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    props.setConsoleItemValue(props.unique_id, "show_spinner", true, callback);
  }
  function _stopMySpinner() {
    props.setConsoleItemValue(props.unique_id, "show_spinner", false);
  }
  var _handleChange = (0, _react.useCallback)(function (new_code) {
    props.setConsoleItemValue(props.unique_id, "console_text", new_code);
  }, []);
  function _handleSummaryTextChange(value) {
    props.setConsoleItemValue(props.unique_id, "summary_text", value);
  }
  function _toggleShrink() {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }
  function _deleteMe() {
    if (props.show_spinner) {
      _stopMe();
    }
    props.handleDelete(props.unique_id);
  }
  function _clearOutput() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    props.setConsoleItemValue(props.unique_id, "output_text", "", callback);
  }
  var _extraKeys = (0, _react.useMemo)(function () {
    return {
      'Ctrl-Enter': function CtrlEnter() {
        return props.runCodeItem(props.unique_id, true);
      },
      'Cmd-Enter': function CmdEnter() {
        return props.runCodeItem(props.unique_id, true);
      },
      'Ctrl-C': props.addNewCodeItem,
      'Ctrl-T': props.addNewTextItem
    };
  }, []);
  function _getFirstLine() {
    var re = /^(.*)$/m;
    if (props.console_text == "") {
      return "empty text cell";
    } else {
      return re.exec(props.console_text)[0];
    }
  }
  function _copyMe() {
    props.copyCell(props.unique_id);
  }
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDividerItem();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  function renderContextMenu() {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, !props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "play",
      intent: "success",
      onClick: function onClick() {
        props.runCodeItem(props.unique_id);
      },
      text: "Run Cell"
    }), props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "stop",
      intent: "danger",
      onClick: _stopMe,
      text: "Stop Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clean",
      intent: "warning",
      onClick: function onClick() {
        _clearOutput();
      },
      text: "Clear Output"
    }));
  }
  function _consoleItemClick(e) {
    _selectMe(e);
    e.stopPropagation();
  }
  var _handleFocus = (0, _react.useCallback)(function () {
    if (!props.am_selected) {
      _selectMe();
    }
  }, []);
  var panel_style = props.am_shrunk ? "log-panel log-panel-invisible" : "log-panel log-panel-visible";
  if (props.am_selected) {
    panel_style += " selected";
  }
  if (props.in_section) {
    panel_style += " in-section";
  }
  var output_dict = {
    __html: props.output_text
  };
  var spinner_val = props.running ? null : 0;
  var code_container_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
  if (props.in_section) {
    code_container_width -= SECTION_INDENT / 2;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: renderContextMenu()
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_style + " d-flex flex-row",
    ref: elRef,
    onClick: _consoleItemClick,
    id: props.unique_id
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: {
      marginTop: 5
    },
    handleClick: _toggleShrink
  })), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.summary_text ? props.summary_text : _getFirstLine(),
    onChange: _handleSummaryTextChange,
    className: "log-panel-summary code-panel-summary"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    intent: "danger",
    tooltip: "Delete this item",
    style: {
      marginLeft: 10,
      marginRight: 66
    },
    icon: "trash"
  }))), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column",
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-panel-body d-flex flex-row console-code"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex pr-1"
  }, !props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: function handleClick() {
      props.runCodeItem(props.unique_id);
    },
    intent: "success",
    tooltip: "Execute this item",
    icon: "play"
  }), props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _stopMe,
    intent: "danger",
    tooltip: "Stop this item",
    icon: "stop"
  })), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
    handleChange: _handleChange,
    handleFocus: _handleFocus,
    registerSetFocusFunc: registerSetFocusFunc,
    am_selected: props.am_selected,
    readOnly: false,
    show_line_numbers: true,
    code_content: props.console_text,
    extraKeys: _extraKeys,
    search_term: props.search_string,
    code_container_width: code_container_width,
    saveMe: null
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    intent: "danger",
    tooltip: "Delete this item",
    style: {
      marginLeft: 10,
      marginRight: 0
    },
    icon: "trash"
  }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: function handleClick() {
      _clearOutput();
    },
    intent: "warning",
    tooltip: "Clear this item's output",
    style: {
      marginLeft: 10,
      marginRight: 0
    },
    icon: "clean"
  }))), !props.show_spinner && /*#__PURE__*/_react["default"].createElement("div", {
    className: "execution-counter"
  }, "[", String(props.execution_count), "]"), props.show_spinner && /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      marginTop: 10,
      marginRight: 22
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.Spinner, {
    size: 13,
    value: spinner_val
  }))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-code-output",
    dangerouslySetInnerHTML: output_dict
  })))));
}
ConsoleCodeItem = /*#__PURE__*/(0, _react.memo)(ConsoleCodeItem);
ConsoleCodeItem.propTypes = {
  unique_id: _propTypes["default"].string,
  am_shrunk: _propTypes["default"].bool,
  set_focus: _propTypes["default"].bool,
  search_string: _propTypes["default"].string,
  show_spinner: _propTypes["default"].bool,
  running: _propTypes["default"].bool,
  summary_text: _propTypes["default"].string,
  console_text: _propTypes["default"].string,
  output_text: _propTypes["default"].string,
  execution_count: _propTypes["default"].oneOfType([_propTypes["default"].number, _propTypes["default"].string]),
  console_available_width: _propTypes["default"].number,
  setConsoleItemValue: _propTypes["default"].func,
  selectConsoleItem: _propTypes["default"].func,
  handleDelete: _propTypes["default"].func,
  addNewTextItem: _propTypes["default"].func,
  addNewCodeItem: _propTypes["default"].func,
  addNewDividerItem: _propTypes["default"].func,
  goToNextCell: _propTypes["default"].func,
  setFocus: _propTypes["default"].func,
  runCodeItem: _propTypes["default"].func
};
ConsoleCodeItem.defaultProps = {
  summary_text: null
};
function ResourceLinkButton(props) {
  var my_view = (0, _react.useRef)(null);
  (0, _utilities_react.useConstructor)(function () {
    my_view.current = (0, _library_pane.view_views)(false)[props.res_type];
    if (window.in_context) {
      var re = new RegExp("/$");
      my_view.current = my_view.current.replace(re, "_in_context");
    }
  });
  function _goToLink() {
    if (window.in_context) {
      (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + my_view.current, {
        context_id: window.context_id,
        resource_name: props.res_name
      }).then(props.handleCreateViewer)["catch"](_toaster.doFlash);
    } else {
      window.open($SCRIPT_ROOT + my_view.current + props.res_name);
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
    className: "link-button-group"
  }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    small: true,
    text: props.res_name,
    icon: _blueprint_mdata_fields.icon_dict[props.res_type],
    minimal: true,
    onClick: _goToLink
  }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    small: true,
    icon: "small-cross",
    minimal: true,
    onClick: function onClick(e) {
      props.deleteMe(props.my_index);
      e.stopPropagation();
    }
  }));
}
ResourceLinkButton = /*#__PURE__*/(0, _react.memo)(ResourceLinkButton);
ResourceLinkButton.propTypes = {
  res_type: _propTypes["default"].string,
  res_name: _propTypes["default"].string,
  deleteMe: _propTypes["default"].func
};
var text_item_update_props = ["am_shrunk", "set_focus", "serach_string", "am_selected", "show_markdown", "in_section", "summary_text", "console_text", "console_available_width", "links"];
function ConsoleTextItem(props) {
  var elRef = (0, _react.useRef)(null);
  var am_selected_previous = (0, _react.useRef)(false);
  var setFocusFunc = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    if (props.am_selected && !am_selected_previous.current && elRef && elRef.current) {
      scrollMeIntoView();
    }
    am_selected_previous.current = props.am_selected;
    if (props.set_focus) {
      if (props.show_markdown) {
        _hideMarkdown();
      } else if (setFocusFunc.current) {
        setFocusFunc.current();
        props.setConsoleItemValue(props.unique_id, "set_focus", false, _selectMe);
      }
    }
  });
  var registerSetFocusFunc = (0, _react.useCallback)(function (theFunc) {
    setFocusFunc.current = theFunc;
  }, []);
  function scrollMeIntoView() {
    var my_element = elRef.current;
    var outer_element = my_element.parentNode.parentNode;
    var scrolled_element = my_element.parentNode;
    var outer_height = outer_element.offsetHeight;
    var distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
    if (distance_from_top > outer_height - 35) {
      var distance_to_move = distance_from_top - .5 * outer_height;
      outer_element.scrollTop += distance_to_move;
    } else if (distance_from_top < 0) {
      var _distance_to_move2 = .25 * outer_height - distance_from_top;
      outer_element.scrollTop -= _distance_to_move2;
    }
  }
  function hasOnlyWhitespace() {
    return !props.console_text.trim().length;
  }
  function _showMarkdown() {
    props.setConsoleItemValue(props.unique_id, "show_markdown", true);
  }
  var _toggleMarkdown = (0, _react.useCallback)(function () {
    if (props.show_markdown) {
      _hideMarkdown();
    } else {
      _showMarkdown();
    }
  }, [props.show_markdown]);
  function _hideMarkdown() {
    props.setConsoleItemValue(props.unique_id, "show_markdown", false);
  }
  var _handleChange = (0, _react.useCallback)(function (new_text) {
    props.setConsoleItemValue(props.unique_id, "console_text", new_text);
  }, []);
  var _clearForceSync = (0, _react.useCallback)(function () {
    props.setConsoleItemValue(props.unique_id, "force_sync_to_prop", false);
  }, []);
  function _handleSummaryTextChange(value) {
    props.setConsoleItemValue(props.unique_id, "summary_text", value);
  }
  function _toggleShrink() {
    props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
  }
  function _deleteMe() {
    props.handleDelete(props.unique_id);
  }
  function _handleKeyDown(event) {
    if (event.key == "Tab") {
      props.goToNextCell(props.unique_id);
      event.preventDefault();
    }
  }
  function _gotEnter() {
    props.goToNextCell(props.unique_id);
    _showMarkdown();
  }
  function _getFirstLine() {
    var re = /^(.*)$/m;
    if (props.console_text == "") {
      return "empty text cell";
    } else {
      return re.exec(props.console_text)[0];
    }
  }
  function _copyMe() {
    props.copyCell(props.unique_id);
  }
  function _pasteCell() {
    props.pasteCell(props.unique_id);
  }
  function _selectMe() {
    var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    props.selectConsoleItem(props.unique_id, e, callback);
  }
  function _insertResourceLink() {
    dialogFuncs.showModal("SelectResourceDialog", {
      cancel_text: "cancel",
      submit_text: "insert link",
      handleSubmit: function handleSubmit(result) {
        var new_links = _toConsumableArray(props.links);
        new_links.push({
          res_type: result.type,
          res_name: result.selected_resource
        });
        props.setConsoleItemValue(props.unique_id, "links", new_links);
      },
      handleClose: dialogFuncs.hideModal
    });
  }
  function _deleteLinkButton(index) {
    var new_links = _lodash["default"].cloneDeep(props.links);
    new_links.splice(index, 1);
    var self = this;
    props.setConsoleItemValue(props.unique_id, "links", new_links, function () {
      console.log("i am here with nlinks " + String(props.links.length));
    });
  }
  function _addBlankText() {
    _selectMe(null, function () {
      props.addNewTextItem();
    });
  }
  function _addBlankDivider() {
    _selectMe(null, function () {
      props.addNewDividerItem();
    });
  }
  function _addBlankCode() {
    _selectMe(null, function () {
      props.addNewCodeItem();
    });
  }
  function renderContextMenu() {
    // return a single element, or nothing to use default browser behavior
    return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "paragraph",
      intent: "success",
      onClick: _showMarkdown,
      text: "Show Markdown"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "new-text-box",
      onClick: _addBlankText,
      text: "New Text Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "code",
      onClick: _addBlankCode,
      text: "New Code Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "header",
      onClick: _addBlankDivider,
      text: "New Section"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "link",
      onClick: _insertResourceLink,
      text: "Insert ResourceLink"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "duplicate",
      onClick: _copyMe,
      text: "Copy Cell"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "clipboard",
      onClick: _pasteCell,
      text: "Paste Cells"
    }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
      icon: "trash",
      onClick: _deleteMe,
      intent: "danger",
      text: "Delete Cell"
    }));
  }
  function _consoleItemClick(e) {
    _selectMe(e);
    e.stopPropagation();
  }
  var _handleFocus = (0, _react.useCallback)(function () {
    if (!props.am_selected) {
      _selectMe();
    }
  }, []);
  function _setCMObject(cmobject) {
    cmobject.current = cmobject;
    if (props.set_focus) {
      cmobject.current.focus();
      cmobject.current.setCursor({
        line: 0,
        ch: 0
      });
      props.setConsoleItemValue(props.unique_id, "set_focus", false, _selectMe);
    }
    if (cmobject.current != null) {
      cmobject.current.on("focus", function () {
        props.setFocus(props.unique_id, _selectMe);
      });
      cmobject.current.on("blur", function () {
        props.setFocus(null);
      });
    }
  }
  var _extraKeys = (0, _react.useMemo)(function () {
    return {
      'Ctrl-Enter': function CtrlEnter() {
        return _gotEnter();
      },
      'Cmd-Enter': function CmdEnter() {
        return _gotEnter();
      },
      'Ctrl-C': props.addNewCodeItem,
      'Ctrl-T': props.addNewTextItem
    };
  }, []);
  var really_show_markdown = hasOnlyWhitespace() && props.links.length == 0 ? false : props.show_markdown;
  var converted_markdown;
  if (really_show_markdown) {
    converted_markdown = mdi.render(props.console_text);
  }
  var converted_dict = {
    __html: converted_markdown
  };
  var panel_class = props.am_shrunk ? "log-panel log-panel-invisible text-log-item" : "log-panel log-panel-visible text-log-item";
  if (props.am_selected) {
    panel_class += " selected";
  }
  if (props.in_section) {
    panel_class += " in-section";
  }
  var gbstyle = {
    marginLeft: 1
  };
  var body_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
  var self = this;
  var link_buttons = props.links.map(function (link, index) {
    return /*#__PURE__*/_react["default"].createElement(ResourceLinkButton, {
      key: index,
      my_index: index,
      handleCreateViewer: props.handleCreateViewer,
      deleteMe: _deleteLinkButton,
      res_type: link.res_type,
      res_name: link.res_name
    });
  });
  var code_container_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
  if (props.in_section) {
    code_container_width -= SECTION_INDENT / 2;
  }
  return /*#__PURE__*/_react["default"].createElement(_core.ContextMenu, {
    content: renderContextMenu()
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: panel_class + " d-flex flex-row",
    onClick: _consoleItemClick,
    ref: elRef,
    id: props.unique_id,
    style: {
      marginBottom: 10
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div shrink-expand-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(Shandle, {
    dragHandleProps: props.dragHandleProps
  }), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-down",
    handleClick: _toggleShrink
  }), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    icon: "chevron-right",
    style: {
      marginTop: 5
    },
    handleClick: _toggleShrink
  })), props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
    value: props.summary_text ? props.summary_text : _getFirstLine(),
    onChange: _handleSummaryTextChange,
    className: "log-panel-summary"
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    intent: "danger",
    tooltip: "Delete this item",
    style: {
      marginLeft: 10,
      marginRight: 66
    },
    icon: "trash"
  }))), !props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column",
    style: {
      width: "100%"
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "log-panel-body text-box d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-inline-flex pr-1"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _toggleMarkdown,
    intent: "success",
    tooltip: "Convert to/from markdown",
    icon: "paragraph"
  })), /*#__PURE__*/_react["default"].createElement("div", {
    className: "d-flex flex-column"
  }, !really_show_markdown && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
    handleChange: _handleChange,
    am_selected: props.am_selected,
    readOnly: false,
    handleFocus: _handleFocus,
    registerSetFocusFunc: registerSetFocusFunc,
    show_line_numbers: false,
    soft_wrap: true,
    sync_to_prop: false,
    force_sync_to_prop: props.force_sync_to_prop,
    clear_force_sync: _clearForceSync,
    mode: "markdown",
    code_content: props.console_text,
    extraKeys: _extraKeys,
    search_term: props.search_string,
    code_container_width: code_container_width,
    saveMe: null
  })), really_show_markdown && !hasOnlyWhitespace() && /*#__PURE__*/_react["default"].createElement("div", {
    className: "text-panel-output",
    onDoubleClick: _hideMarkdown,
    style: {
      width: body_width,
      padding: 9
    },
    dangerouslySetInnerHTML: converted_dict
  }), link_buttons), /*#__PURE__*/_react["default"].createElement("div", {
    className: "button-div d-flex flex-row"
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _deleteMe,
    intent: "danger",
    tooltip: "Delete this item",
    style: {
      marginLeft: 10,
      marginRight: 66
    },
    icon: "trash"
  }))))));
}
ConsoleTextItem = /*#__PURE__*/(0, _react.memo)(ConsoleTextItem);
ConsoleTextItem.propTypes = {
  unique_id: _propTypes["default"].string,
  am_shrunk: _propTypes["default"].bool,
  set_focus: _propTypes["default"].bool,
  show_markdown: _propTypes["default"].bool,
  force_sync_to_prop: _propTypes["default"].bool,
  summary_text: _propTypes["default"].string,
  console_text: _propTypes["default"].string,
  console_available_width: _propTypes["default"].number,
  setConsoleItemValue: _propTypes["default"].func,
  selectConsoleItem: _propTypes["default"].func,
  am_selected: _propTypes["default"].bool,
  handleDelete: _propTypes["default"].func,
  goToNextCell: _propTypes["default"].func,
  setFocus: _propTypes["default"].func,
  links: _propTypes["default"].array
};
ConsoleTextItem.defaultProps = {
  force_sync_to_prop: false,
  summary_text: null,
  links: []
};
var all_update_props = {
  "text": text_item_update_props,
  "code": code_item_update_props,
  "fixed": log_item_update_props
};