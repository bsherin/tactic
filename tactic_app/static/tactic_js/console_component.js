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
var _reactSortableHoc = require("react-sortable-hoc");
var _markdownIt = _interopRequireDefault(require("markdown-it"));
require("markdown-it-latex/dist/index.css");
var _markdownItLatex = _interopRequireDefault(require("markdown-it-latex"));
var _blueprint_react_widgets = require("./blueprint_react_widgets");
var _reactCodemirror = require("./react-codemirror");
var _sortable_container = require("./sortable_container");
var _key_trap = require("./key_trap");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _utilities_react = require("./utilities_react");
var _modal_react = require("./modal_react");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _library_pane = require("./library_pane");
var _menu_utilities = require("./menu_utilities");
var _search_form = require("./search_form");
var _searchable_console = require("./searchable_console");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }
function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
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
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var mdi = (0, _markdownIt["default"])({
  html: true
});
mdi.use(_markdownItLatex["default"]);
var MAX_CONSOLE_WIDTH = 1800;
var BUTTON_CONSUMED_SPACE = 208;
var SECTION_INDENT = 25; // This is also hard coded into the css file at the moment

function ConsoleComponent(props) {
  var header_ref = (0, _react.useRef)(null);
  var body_ref = (0, _react.useRef)(null);
  var temporarily_closed_items = (0, _react.useRef)([]);
  var _useState = (0, _react.useState)(false),
    _useState2 = _slicedToArray(_useState, 2),
    hide_in_section = _useState2[0],
    set_hide_in_section = _useState2[1];
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    console_item_with_focus = _useState4[0],
    set_console_item_with_focus = _useState4[1];
  var _useState5 = (0, _react.useState)(null),
    _useState6 = _slicedToArray(_useState5, 2),
    console_item_saved_focus = _useState6[0],
    set_console_item_saved_focus = _useState6[1];
  var _useState7 = (0, _react.useState)(""),
    _useState8 = _slicedToArray(_useState7, 2),
    console_error_log_text = _useState8[0],
    set_console_error_log_text = _useState8[1];
  var _useState9 = (0, _react.useState)(null),
    _useState10 = _slicedToArray(_useState9, 2),
    console_log_showing = _useState10[0],
    set_console_log_showing = _useState10[1];
  var _useState11 = (0, _react.useState)(null),
    _useState12 = _slicedToArray(_useState11, 2),
    pseudo_tile_id = _useState12[0],
    set_pseudo_tile_id = _useState12[1];
  var _useState13 = (0, _react.useState)(null),
    _useState14 = _slicedToArray(_useState13, 2),
    main_log_since = _useState14[0],
    set_main_log_since = _useState14[1];
  var _useState15 = (0, _react.useState)(100),
    _useState16 = _slicedToArray(_useState15, 2),
    max_console_lines = _useState16[0],
    set_max_console_lines = _useState16[1];
  var _useState17 = (0, _react.useState)(null),
    _useState18 = _slicedToArray(_useState17, 2),
    pseudo_log_since = _useState18[0],
    set_pseudo_log_since = _useState18[1];
  var _useState19 = (0, _react.useState)(false),
    _useState20 = _slicedToArray(_useState19, 2),
    show_console_error_log = _useState20[0],
    set_show_console_error_log = _useState20[1];
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)([]),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    all_selected_items = _useStateAndRef2[0],
    set_all_selected_items = _useStateAndRef2[1],
    all_selected_items_ref = _useStateAndRef2[2];
  var _useState21 = (0, _react.useState)(null),
    _useState22 = _slicedToArray(_useState21, 2),
    search_string = _useState22[0],
    set_search_string = _useState22[1];
  var _useState23 = (0, _react.useState)(false),
    _useState24 = _slicedToArray(_useState23, 2),
    filter_console_items = _useState24[0],
    set_filter_console_items = _useState24[1];
  var _useState25 = (0, _react.useState)(null),
    _useState26 = _slicedToArray(_useState25, 2),
    search_helper_text = _useState26[0],
    set_search_helper_text = _useState26[1];
  var pushCallback = (0, _utilities_react.useCallbackStack)();
  (0, _react.useEffect)(function () {
    initSocket();
    _requestPseudoTileId();
    if (props.console_items.current.length == 0) {
      _addCodeArea("", false);
    }
    _clear_all_selected_items();
    return function () {
      props.tsocket.disconnect();
    };
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
          },
          updateLog: function updateLog(data) {
            return _addToLog(data.new_line);
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
  function _addBlankText() {
    if (!props.am_selected) {
      return;
    }
    _addConsoleText("");
  }
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
  function _addBlankDivider() {
    if (!props.am_selected) {
      return;
    }
    _addConsoleDivider("");
  }
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
  function _deleteSection(unique_id) {
    var centry = get_console_item_entry(unique_id);
    var confirm_text = "Delete section ".concat(centry.header_text, "?");
    (0, _modal_react.showConfirmDialogReact)("Delete Section", confirm_text, "do nothing", "delete", function () {
      var id_list = _getSectionIds(unique_id);
      var cindex = _consoleItemIndex(unique_id);
      var new_console_items = _toConsumableArray(props.console_items.current);
      new_console_items.splice(cindex, id_list.length);
      _clear_all_selected_items();
      props.dispatch({
        type: "delete_items",
        id_list: id_list
      });
    });
  }
  function _copySection() {
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
  }
  function _copyCell() {
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
  }
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
  function _pasteCell() {
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
  }
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
  function _insertResourceLink() {
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
  }
  function _insertLinkInItem(unique_id) {
    var entry = get_console_item_entry(unique_id);
    (0, _modal_react.showSelectResourceDialog)("cancel", "insert link", function (result) {
      var new_links = "links" in entry ? _toConsumableArray(entry.links) : [];
      new_links.push({
        res_type: result.type,
        res_name: result.selected_resource
      });
      _setConsoleItemValue(entry.unique_id, "links", new_links);
    });
  }
  function _addBlankCode(e) {
    if (!props.am_selected) {
      return;
    }
    _addCodeArea("");
  }
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
  function _resetConsole() {
    props.dispatch({
      type: "reset"
    });
    (0, _communication_react.postWithCallback)(props.main_id, "clear_console_namespace", {}, null, null, props.main_id);
  }
  function _stopAll() {
    (0, _communication_react.postWithCallback)(props.main_id, "stop_all_console_code", {}, null, null, props.main_id);
  }
  function _clearConsole() {
    var confirm_text = "Are you sure that you want to erase everything in this log?";
    (0, _modal_react.showConfirmDialogReact)("Clear entire log", confirm_text, "do nothing", "clear", function () {
      set_all_selected_items([]);
      pushCallback(function () {
        props.dispatch({
          type: "delete_all_tiems"
        });
      });
    });
  }
  function _getContainerLog() {
    if (pseudo_tile_id == null) {
      set_console_error_log_text("pseudo-tile is initializing...");
      pushCallback(function () {
        set_show_console_error_log(true);
      });
    } else {
      (0, _communication_react.postWithCallback)("host", "get_container_log", {
        "container_id": pseudo_tile_id,
        "since": pseudo_log_since,
        "max_lines": max_console_lines
      }, function (res) {
        var log_text = res.log_text;
        if (log_text == "") {
          log_text = "Got empty result. The pseudo-tile is probably starting up.";
        }
        set_console_error_log_text(log_text);
        set_console_log_showing("pseudo");
        pushCallback(function () {
          set_show_console_error_log(true);
          _startPseudoLogStreaming();
        });
      }, null, props.main_id);
    }
  }
  function _toggleConsoleLog() {
    if (show_console_error_log) {
      set_show_console_error_log(false);
      _stopMainPseudoLogStreaming();
    } else {
      if (pseudo_tile_id == null) {
        (0, _communication_react.postWithCallback)(props.main_id, "get_pseudo_tile_id", {}, function (res) {
          set_pseudo_tile_id(res.pseudo_tile_id);
          pushCallback(_getContainerLog);
        }, null, props.main_id);
      } else {
        _getContainerLog();
      }
    }
  }
  function _setPseudoLogSince() {
    var now = new Date().getTime();
    set_pseudo_log_since(now);
    pushCallback(function () {
      _stopMainPseudoLogStreaming(function () {
        (0, _communication_react.postWithCallback)("host", "get_container_log", {
          container_id: pseudo_tile_id_id,
          since: pseudo_log_since,
          max_lines: max_console_lines
        }, function (res) {
          set_console_error_log_text(res.log_text);
          set_console_log_showing("pseudo");
          pushCallback(function () {
            set_show_console_error_log(true);
            startPseudoLogStreaming();
          });
        }, null, props.main_id);
      });
    });
  }
  function _startPseudoLogStreaming() {
    (0, _communication_react.postWithCallback)(props.main_id, "StartPseudoLogStreaming", {}, null, null, props.main_id);
  }
  function _setLogSince() {
    if (console_log_showing == "main") {
      _setMainLogSince();
    } else {
      _setPseudoLogSince();
    }
  }
  function _setMaxConsoleLines(max_lines) {
    if (console_log_showing == "main") {
      _setMainMaxConsoleLines(max_lines);
    } else {
      _setPseudoMaxConsoleLines(max_lines);
    }
  }
  function _setMainLogSince() {
    var now = new Date().getTime();
    set_main_log_since(now);
    pushCallback(function () {
      _stopMainPseudoLogStreaming(function () {
        (0, _communication_react.postWithCallback)("host", "get_container_log", {
          container_id: props.main_id,
          since: main_log_since,
          max_lines: max_console_lines
        }, function (res) {
          set_console_error_log_text(rel.log_text);
          set_console_log_showing("main");
          pushCallback(function () {
            _startMainLogStreaming();
            set_show_console_error_log(true);
          });
        }, null, props.main_id);
      });
    });
  }
  function _setMainMaxConsoleLines(max_lines) {
    set_max_console_lines(max_lines);
    pushCallback(function () {
      _stopMainPseudoLogStreaming(function () {
        (0, _communication_react.postWithCallback)("host", "get_container_log", {
          container_id: props.main_id,
          since: main_log_since,
          max_lines: max_console_lines
        }, function (res) {
          set_console_error_log_text(res.log_text);
          set_console_log_showing("main");
          pushCallback(function () {
            _startMainLogStreaming();
            set_show_console_error_log(true);
          });
        }, null, props.main_id);
      });
    });
  }
  function _setPseudoMaxConsoleLines(max_lines) {
    set_max_console_lines(max_lines);
    pushCallback(function () {
      _stopMainPseudoLogStreaming(function () {
        (0, _communication_react.postWithCallback)("host", "get_container_log", {
          container_id: pseudo_tile_id,
          since: pseudo_log_since,
          max_lines: max_console_lines
        }, function (res) {
          set_console_error_log_text(res.log_text);
          set_console_log_showing("pseudo");
          pushCallback(function () {
            _startPseudoLogStreaming();
            set_show_console_error_log(true);
          });
        }, null, props.main_id);
      });
    });
  }
  function _toggleMainLog() {
    if (show_console_error_log) {
      set_show_console_error_log(false);
      _stopMainPseudoLogStreaming();
    } else {
      (0, _communication_react.postWithCallback)("host", "get_container_log", {
        "container_id": props.main_id,
        "since": main_log_since,
        "max_lines": max_console_lines
      }, function (res) {
        set_console_error_log_text(res.log_text);
        set_console_log_showing("main");
        pushCallback(function () {
          _startMainLogStreaming();
          set_show_console_error_log(true);
        });
      }, null, props.main_id);
    }
  }
  function _startMainLogStreaming() {
    (0, _communication_react.postWithCallback)(props.main_id, "StartMainLogStreaming", {}, null, null, props.main_id);
  }
  function _stopMainPseudoLogStreaming() {
    var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
    (0, _communication_react.postWithCallback)(props.main_id, "StopMainPseudoLogStreaming", {}, callback, null, props.main_id);
  }
  function _setFocusedItem(unique_id) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    set_console_item_with_focus(unique_id);
    if (unique_id) {
      set_console_item_saved_focus(unique_id);
    }
    pushCallback(callback);
  }
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
    if (props.console_is_zoomed) {
      _unzoomConsole();
    }
  }
  function _toggleExports() {
    props.setMainStateValue("show_exports_pane", !props.show_exports_pane);
  }
  function _setConsoleItemValue(unique_id, field, new_value) {
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    props.dispatch({
      type: "change_item_value",
      unique_id: unique_id,
      field: field,
      new_value: new_value
    });
    pushCallback(callback);
  }
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
      if (callback) {
        callback();
      }
    }
  }
  function _selectConsoleItem(unique_id) {
    var event = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var updates = {};
    var shift_down = event != null && event.shiftKey;
    if (!shift_down) {
      if (all_selected_items_ref.current.length > 0) {
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
      }
      if (!all_selected_items_ref.current.includes(unique_id)) {
        updates[unique_id] = {
          am_selected: true,
          search_string: search_string
        };
      }
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
          search_string: search_string
        };
        _multiple_console_item_updates(updates, function () {
          var narray = _lodash["default"].cloneDeep(all_selected_items_ref.current);
          narray.push(unique_id);
          set_all_selected_items(narray);
          pushCallback(callback);
        });
      }
    }
  }
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
        var trueNewIndex = _consoleItemIndex(filtered_items[newIndex].unique_id);
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
  function _resortConsoleItems(_ref2, filtered_items) {
    var oldIndex = _ref2.oldIndex,
      newIndex = _ref2.newIndex;
    var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
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
  }
  function _goToNextCell(unique_id) {
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
  }
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
        (0, _modal_react.showConfirmDialogReact)("Do Delete", confirm_text, "do nothing", "delete", function () {
          _doDeleteSelected();
        });
      } else {
        _doDeleteSelected();
      }
    }
  }
  function _closeConsoleItem(unique_id) {
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
  }
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
    } else if (props.console_items.current.length == 0) {
      insert_index = 0;
    } else if (all_selected_items_ref.length == 0) {
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
    console.log("in appendconsoleitem output with ".concat(data.console_id));
    var current = get_console_item_entry(data.console_id).output_text;
    if (current != "") {
      current += "<br>";
    }
    _setConsoleItemValue(data.console_id, "output_text", current + data.message);
  }
  function _setConsoleItemOutput(data) {
    _setConsoleItemValue(data.console_id, "output_text", data.message);
  }
  function _addToLog(new_line) {
    var log_content = console_error_log_text;
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
  function _bodyWidth() {
    if (props.console_available_width > MAX_CONSOLE_WIDTH) {
      return MAX_CONSOLE_WIDTH;
    } else {
      return props.console_available_width;
    }
  }
  function renderContextMenu() {
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
  }
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
              search_string: search_string
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
            show_on_filtered: entry.console_text.toLowerCase().includes(search_string.toLowerCase())
          };
        } else if (entry.type == "divider") {
          updates[entry.unique_id] = {
            show_on_filtered: true
          };
        }
        _multiple_console_item_updates(updates);
      }
    } catch (err) {
      _iterator14.e(err);
    } finally {
      _iterator14.f();
    }
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
    if (entry[text_field].toLowerCase().includes(search_string.toLowerCase())) {
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
    if (!show_console_error_log) {
      ms["Consoles"] = [{
        name_text: "Show Log Console",
        icon_name: "console",
        click_handler: _toggleConsoleLog
      }, {
        name_text: "Show Main Console",
        icon_name: "console",
        click_handler: _toggleMainLog
      }];
    } else {
      ms["Consoles"] = [{
        name_text: "Hide Console",
        icon_name: "console",
        click_handler: _toggleMainLog
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
    if (!props.am_selected) {
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
  function _runCodeItem(unique_id) {
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
  }
  function _showTextItemMarkdown(unique_id) {
    _setConsoleItemValue(unique_id, "show_markdown", true);
  }
  function _logExec(command) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    (0, _communication_react.postWithCallback)(pseudo_tile_id, "os_command_exec", {
      "the_code": command
    }, callback);
  }
  function _hideNonDividers() {
    set_hide_in_section(true);
  }
  function _showNonDividers() {
    set_hide_in_section(false);
  }
  function _sortStart(data, event) {
    event.preventDefault();
    var unique_id = data.node.id;
    var idx = _consoleItemIndex(unique_id);
    var entry = props.console_items.current[idx];
    if (entry.type == "divider") {
      _hideNonDividers();
    }
  }
  var gbstyle = {
    marginLeft: 1,
    marginTop: 2
  };
  var console_class = props.console_is_shrunk ? "am-shrunk" : "not-shrunk";
  if (props.console_is_zoomed) {
    console_class = "am-zoomed";
  }
  var outer_style = Object.assign({}, props.style);
  outer_style.width = _bodyWidth();
  var show_glif_text = outer_style.width > 800;
  var header_style = {};
  if (!props.shrinkable) {
    header_style["paddingLeft"] = 10;
  }
  if (!props.console_is_shrunk) {
    header_style["paddingRight"] = 15;
  }
  var key_bindings = [[["escape"], function () {
    _clear_all_selected_items();
  }]];
  var filtered_items = [];
  var in_closed_section = false;
  var in_section = false;
  var _iterator15 = _createForOfIteratorHelper(props.console_items.current),
    _step15;
  try {
    for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
      var _entry = _step15.value;
      if (_entry.type == "divider") {
        in_section = true;
        filtered_items.push(_entry);
        in_closed_section = _entry.am_shrunk;
      } else if (_entry.type == "section-end") {
        _entry.in_section = true;
        if (!in_closed_section) {
          filtered_items.push(_entry);
        }
        in_closed_section = false;
        in_section = false;
      } else if (!in_closed_section) {
        _entry.in_section = in_section;
        filtered_items.push(_entry);
      }
    }
  } catch (err) {
    _iterator15.e(err);
  } finally {
    _iterator15.f();
  }
  if (filter_console_items) {
    var new_filtered_items = [];
    var _iterator16 = _createForOfIteratorHelper(filtered_items),
      _step16;
    try {
      for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
        var entry = _step16.value;
        if (entry.show_on_filtered) {
          new_filtered_items.push(entry);
        }
      }
    } catch (err) {
      _iterator16.e(err);
    } finally {
      _iterator16.f();
    }
    filtered_items = new_filtered_items;
  }
  var suggestionGlyphs = [];
  if (show_console_error_log) {
    suggestionGlyphs.push({
      intent: "primary",
      handleClick: _toggleMainLog,
      icon: "console"
    });
  }
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
  }, props.console_is_shrunk && props.shrinkable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _expandConsole,
    style: {
      marginLeft: 2
    },
    icon: "chevron-right"
  }), !props.console_is_shrunk && props.shrinkable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
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
    dark_theme: props.dark_theme,
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
  }), !props.console_is_zoomed && props.zoomable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _zoomConsole,
    icon: "maximize"
  }), props.console_is_zoomed && props.zoomable && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
    handleClick: _unzoomConsole,
    icon: "minimize"
  })))), !props.console_is_shrunk && !show_console_error_log && /*#__PURE__*/_react["default"].createElement(_search_form.FilterSearchForm, {
    search_string: search_string,
    handleSearchFieldChange: _handleSearchFieldChange,
    handleFilter: _handleFilter,
    handleUnFilter: _handleUnFilter,
    searchNext: _searchNext,
    searchPrevious: _searchPrevious,
    search_helper_text: search_helper_text
  }), !props.console_is_shrunk && show_console_error_log && /*#__PURE__*/_react["default"].createElement(_searchable_console.SearchableConsole, {
    log_content: console_error_log_text,
    setMaxConsoleLines: _setMaxConsoleLines,
    inner_ref: body_ref,
    outer_style: {
      overflowX: "auto",
      overflowY: "auto",
      height: _bodyHeight(),
      marginLeft: 20,
      marginRight: 20
    },
    clearConsole: _setLogSince,
    commandExec: console_log_showing == "pseudo" ? _logExec : null
  }), !props.console_is_shrunk && !show_console_error_log && /*#__PURE__*/_react["default"].createElement("div", {
    id: "console",
    ref: body_ref,
    className: "contingent-scroll",
    onClick: _clickConsoleBody,
    style: {
      height: _bodyHeight()
    }
  }, !show_console_error_log && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_sortable_container.SortableComponent, {
    id: "console-items-div",
    main_id: props.main_id,
    ElementComponent: SSuperItem,
    key_field_name: "unique_id",
    item_list: filtered_items,
    helperClass: props.dark_theme ? "bp5-dark" : "light-theme",
    handle: ".console-sorter",
    onSortStart: _sortStart // This prevents Safari weirdness
    ,
    onSortEnd: function onSortEnd(data, event) {
      _resortConsoleItems(data, filtered_items, _showNonDividers);
    },
    hideSortableGhost: true,
    hide_in_section: hide_in_section,
    pressDelay: 100,
    shouldCancelStart: _shouldCancelSortStart,
    setConsoleItemValue: _setConsoleItemValue,
    selectConsoleItem: _selectConsoleItem,
    console_available_width: _bodyWidth(),
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
    dark_theme: props.dark_theme,
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
// ConsoleComponent = ContextMenuTarget(memo(ConsoleComponent));

ConsoleComponent.propTypes = {
  console_items: _propTypes["default"].object,
  console_is_shrunk: _propTypes["default"].bool,
  show_exports_pane: _propTypes["default"].bool,
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
var RawSortHandle = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(RawSortHandle, _React$PureComponent);
  var _super = _createSuper(RawSortHandle);
  function RawSortHandle() {
    _classCallCheck(this, RawSortHandle);
    return _super.apply(this, arguments);
  }
  _createClass(RawSortHandle, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement(_core.Icon, {
        icon: "drag-handle-vertical",
        style: {
          marginLeft: 0,
          marginRight: 6
        },
        iconSize: 20,
        className: "console-sorter"
      });
    }
  }]);
  return RawSortHandle;
}(_react["default"].PureComponent);
var Shandle = (0, _reactSortableHoc.SortableHandle)(RawSortHandle);
var SuperItem = /*#__PURE__*/function (_React$PureComponent2) {
  _inherits(SuperItem, _React$PureComponent2);
  var _super2 = _createSuper(SuperItem);
  function SuperItem() {
    _classCallCheck(this, SuperItem);
    return _super2.apply(this, arguments);
  }
  _createClass(SuperItem, [{
    key: "render",
    value: function render() {
      switch (this.props.type) {
        case "text":
          return /*#__PURE__*/_react["default"].createElement(ConsoleTextItem, this.props);
        case "code":
          return /*#__PURE__*/_react["default"].createElement(ConsoleCodeItem, this.props);
        case "fixed":
          return /*#__PURE__*/_react["default"].createElement(LogItem, this.props);
        case "figure":
          return /*#__PURE__*/_react["default"].createElement(BlobItem, this.props);
        case "divider":
          return /*#__PURE__*/_react["default"].createElement(DividerItem, this.props);
        case "section-end":
          return /*#__PURE__*/_react["default"].createElement(SectionEndItem, this.props);
        default:
          return null;
      }
    }
  }]);
  return SuperItem;
}(_react["default"].PureComponent);
var SSuperItem = (0, _sortable_container.MySortableElement)(SuperItem);
var divider_item_update_props = ["am_shrunk", "am_selected", "header_text", "console_available_width"];
var RawDividerItem = /*#__PURE__*/function (_React$Component) {
  _inherits(RawDividerItem, _React$Component);
  var _super3 = _createSuper(RawDividerItem);
  function RawDividerItem(props) {
    var _this;
    _classCallCheck(this, RawDividerItem);
    _this = _super3.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this), "_", RawDividerItem.prototype);
    _this.update_props = divider_item_update_props;
    _this.update_state_vars = [];
    _this.state = {};
    return _this;
  }
  _createClass(RawDividerItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      var _iterator17 = _createForOfIteratorHelper(this.update_props),
        _step17;
      try {
        for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
          var prop = _step17.value;
          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator17.e(err);
      } finally {
        _iterator17.f();
      }
      return false;
    }
  }, {
    key: "_toggleShrink",
    value: function _toggleShrink() {
      this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }
  }, {
    key: "_deleteMe",
    value: function _deleteMe() {
      this.props.handleDelete(this.props.unique_id);
    }
  }, {
    key: "_handleHeaderTextChange",
    value: function _handleHeaderTextChange(value) {
      this.props.setConsoleItemValue(this.props.unique_id, "header_text", value);
    }
  }, {
    key: "_copyMe",
    value: function _copyMe() {
      this.props.copyCell(this.props.unique_id);
    }
  }, {
    key: "_copySection",
    value: function _copySection() {
      this.props.copySection(this.props.unique_id);
    }
  }, {
    key: "_deleteSection",
    value: function _deleteSection() {
      this.props.deleteSection(this.props.unique_id);
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      this.props.pasteCell(this.props.unique_id);
    }
  }, {
    key: "_selectMe",
    value: function _selectMe() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.props.selectConsoleItem(this.props.unique_id, e, callback);
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankDivider",
    value: function _addBlankDivider() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewDividerItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewCodeItem();
      });
    }
  }, {
    key: "renderContextMenu",
    value: function renderContextMenu() {
      // return a single element, or nothing to use default browser behavior
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "duplicate",
        onClick: this._copyMe,
        text: "Copy"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: this._pasteCell,
        text: "Paste Cells"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "header",
        onClick: this._addBlankDivider,
        text: "New Section"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteMe,
        intent: "danger",
        text: "Delete Section"
      }));
    }
  }, {
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      this._selectMe(e);
      e.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var converted_dict = {
        __html: this.props.console_text
      };
      var panel_class = this.props.am_shrunk ? "log-panel in-section divider-log-panel log-panel-invisible fixed-log-panel" : "log-panel divider-log-panel log-panel-visible fixed-log-panel";
      if (this.props.am_selected) {
        panel_class += " selected";
      }
      if (this.props.is_error) {
        panel_class += " error-log-panel";
      }
      var body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: panel_class + " d-flex flex-row",
        onClick: this._consoleItemClick,
        id: this.props.unique_id,
        style: {
          marginBottom: 10
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div shrink-expand-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(Shandle, null), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-down",
        handleClick: this._toggleShrink
      }), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-right",
        style: {
          marginTop: 5
        },
        handleClick: this._toggleShrink
      })), /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
        value: this.props.header_text,
        onChange: this._handleHeaderTextChange,
        className: "console-divider-text"
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._deleteMe,
        intent: "danger",
        tooltip: "Delete this item",
        style: {
          marginLeft: 10,
          marginRight: 66,
          minHeight: 0
        },
        icon: "trash"
      })));
    }
  }]);
  return RawDividerItem;
}(_react["default"].Component); // const DividerItem = ContextMenuTarget(RawDividerItem);
var DividerItem = RawDividerItem;
var section_end_item_update_props = ["hide_in_section", "am_selected", "console_available_width"];
var RawSectionEndItem = /*#__PURE__*/function (_React$Component2) {
  _inherits(RawSectionEndItem, _React$Component2);
  var _super4 = _createSuper(RawSectionEndItem);
  function RawSectionEndItem(props) {
    var _this2;
    _classCallCheck(this, RawSectionEndItem);
    _this2 = _super4.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2), "_", RawSectionEndItem.prototype);
    _this2.update_props = section_end_item_update_props;
    _this2.update_state_vars = [];
    _this2.state = {};
    return _this2;
  }
  _createClass(RawSectionEndItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      var _iterator18 = _createForOfIteratorHelper(this.update_props),
        _step18;
      try {
        for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
          var prop = _step18.value;
          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator18.e(err);
      } finally {
        _iterator18.f();
      }
      return false;
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      this.props.pasteCell(this.props.unique_id);
    }
  }, {
    key: "_selectMe",
    value: function _selectMe() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.props.selectConsoleItem(this.props.unique_id, e, callback);
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankDivider",
    value: function _addBlankDivider() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewDividerItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewCodeItem();
      });
    }
  }, {
    key: "renderContextMenu",
    value: function renderContextMenu() {
      // return a single element, or nothing to use default browser behavior
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: this._pasteCell,
        text: "Paste Cells"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "header",
        onClick: this._addBlankDivider,
        text: "New Section"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null));
    }
  }, {
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      this._selectMe(e);
      e.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      if (this.props.hide_in_section) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "log-panel fixed-log-panel d-flex flex-row",
          id: this.props.unique_id,
          style: {
            height: 0
          }
        });
      }
      var panel_class = "log-panel in-section section-end-log-panel log-panel-visible fixed-log-panel";
      if (this.props.am_selected) {
        panel_class += " selected";
      }
      var body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
      var line_style = {
        marginLeft: 65,
        marginRight: 85,
        marginTop: 10,
        borderBottomWidth: 2
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: panel_class + " d-flex flex-row",
        onClick: this._consoleItemClick,
        id: this.props.unique_id,
        style: {
          marginBottom: 10
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
        minimal: true,
        vertical: true,
        style: {
          width: "100%"
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.Divider, {
        style: line_style
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }));
    }
  }]);
  return RawSectionEndItem;
}(_react["default"].Component); // const SectionEndItem = ContextMenuTarget(RawSectionEndItem);
var SectionEndItem = RawSectionEndItem;
var log_item_update_props = ["is_error", "am_shrunk", "am_selected", "hide_in_section", "in_section", "summary_text", "console_text", "console_available_width"];
var RawLogItem = /*#__PURE__*/function (_React$Component3) {
  _inherits(RawLogItem, _React$Component3);
  var _super5 = _createSuper(RawLogItem);
  function RawLogItem(props) {
    var _this3;
    _classCallCheck(this, RawLogItem);
    _this3 = _super5.call(this, props);
    _this3.ce_summary0ref = /*#__PURE__*/_react["default"].createRef();
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this3), "_", RawLogItem.prototype);
    _this3.update_props = log_item_update_props;
    _this3.update_state_vars = [];
    _this3.state = {
      selected: false
    };
    _this3.last_output_text = "";
    return _this3;
  }
  _createClass(RawLogItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      var _iterator19 = _createForOfIteratorHelper(this.update_props),
        _step19;
      try {
        for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
          var prop = _step19.value;
          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator19.e(err);
      } finally {
        _iterator19.f();
      }
      return false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.executeEmbeddedScripts();
      this.makeTablesSortable();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapshot) {
      this.executeEmbeddedScripts();
      this.makeTablesSortable();
    }
  }, {
    key: "_toggleShrink",
    value: function _toggleShrink() {
      this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }
  }, {
    key: "_deleteMe",
    value: function _deleteMe() {
      this.props.handleDelete(this.props.unique_id);
    }
  }, {
    key: "_handleSummaryTextChange",
    value: function _handleSummaryTextChange(value) {
      this.props.setConsoleItemValue(this.props.unique_id, "summary_text", value);
    }
  }, {
    key: "executeEmbeddedScripts",
    value: function executeEmbeddedScripts() {
      if (this.props.output_text != this.last_output_text) {
        // to avoid doubles of bokeh images
        this.last_output_text = this.props.output_text;
        var scripts = $("#" + this.props.unique_id + " .log-code-output script").toArray();
        // $("#" + this.props.unique_id + " .bk-root").html(""); // This is a kluge to deal with bokeh double images
        var _iterator20 = _createForOfIteratorHelper(scripts),
          _step20;
        try {
          for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
            var script = _step20.value;
            try {
              window.eval(script.text);
            } catch (e) {}
          }
        } catch (err) {
          _iterator20.e(err);
        } finally {
          _iterator20.f();
        }
      }
    }
  }, {
    key: "makeTablesSortable",
    value: function makeTablesSortable() {
      var tables = $("#" + this.props.unique_id + " table.sortable").toArray();
      var _iterator21 = _createForOfIteratorHelper(tables),
        _step21;
      try {
        for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
          var table = _step21.value;
          sorttable.makeSortable(table);
        }
      } catch (err) {
        _iterator21.e(err);
      } finally {
        _iterator21.f();
      }
    }
  }, {
    key: "_copyMe",
    value: function _copyMe() {
      this.props.copyCell(this.props.unique_id);
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      this.props.pasteCell(this.props.unique_id);
    }
  }, {
    key: "_selectMe",
    value: function _selectMe() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.props.selectConsoleItem(this.props.unique_id, e, callback);
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankDivider",
    value: function _addBlankDivider() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewDividerItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewCodeItem();
      });
    }
  }, {
    key: "renderContextMenu",
    value: function renderContextMenu() {
      // return a single element, or nothing to use default browser behavior
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "duplicate",
        onClick: this._copyMe,
        text: "Copy Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: this._pasteCell,
        text: "Paste Cells"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "header",
        onClick: this._addBlankDivider,
        text: "New Section"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteMe,
        intent: "danger",
        text: "Delete Cell"
      }));
    }
  }, {
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      this._selectMe(e);
      e.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
      if (this.props.hide_in_section && this.props.in_section) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "log-panel fixed-log-panel d-flex flex-row",
          id: this.props.unique_id,
          style: {
            height: 0
          }
        });
      }
      var converted_dict = {
        __html: this.props.console_text
      };
      if (this.props.in_section) {
        panel_class += " in-section";
      }
      if (this.props.am_selected) {
        panel_class += " selected";
      }
      if (this.props.is_error) {
        panel_class += " error-log-panel";
      }
      var body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
      if (this.props.in_section) {
        body_width -= SECTION_INDENT / 2;
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: panel_class + " d-flex flex-row",
        onClick: this._consoleItemClick,
        id: this.props.unique_id,
        style: {
          marginBottom: 10
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div shrink-expand-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(Shandle, null), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-down",
        handleClick: this._toggleShrink
      }), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-right",
        style: {
          marginTop: 5
        },
        handleClick: this._toggleShrink
      })), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
        value: this.props.summary_text,
        onChange: this._handleSummaryTextChange,
        className: "log-panel-summary"
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._deleteMe,
        intent: "danger",
        tooltip: "Delete this item",
        style: {
          marginLeft: 10,
          marginRight: 66
        },
        icon: "trash"
      }))), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
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
        handleClick: this._deleteMe,
        tooltip: "Delete this item",
        style: {
          marginLeft: 10,
          marginRight: 66
        },
        intent: "danger",
        icon: "trash"
      })))));
    }
  }]);
  return RawLogItem;
}(_react["default"].Component);
RawLogItem.propTypes = {
  unique_id: _propTypes["default"].string,
  in_section: _propTypes["default"].bool,
  is_error: _propTypes["default"].bool,
  am_shrunk: _propTypes["default"].bool,
  summary_text: _propTypes["default"].string,
  selectConsoleItem: _propTypes["default"].func,
  am_selected: _propTypes["default"].bool,
  console_text: _propTypes["default"].string,
  setConsoleItemValue: _propTypes["default"].func,
  handleDelete: _propTypes["default"].func,
  console_available_width: _propTypes["default"].number
};

// const LogItem = ContextMenuTarget(RawLogItem);
var LogItem = RawLogItem;
var blob_item_update_props = ["is_error", "am_shrunk", "am_selected", "hide_in_section", "in_section", "summary_text", "image_data_str", "console_available_width"];
var RawBlobItem = /*#__PURE__*/function (_React$Component4) {
  _inherits(RawBlobItem, _React$Component4);
  var _super6 = _createSuper(RawBlobItem);
  function RawBlobItem(props) {
    var _this4;
    _classCallCheck(this, RawBlobItem);
    _this4 = _super6.call(this, props);
    _this4.ce_summary0ref = /*#__PURE__*/_react["default"].createRef();
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this4), "_", RawLogItem.prototype);
    _this4.update_props = blob_item_update_props;
    _this4.update_state_vars = [];
    _this4.state = {
      selected: false,
      image_data_str: null
    };
    _this4.last_output_text = "";
    return _this4;
  }
  _createClass(RawBlobItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      var _iterator22 = _createForOfIteratorHelper(this.update_props),
        _step22;
      try {
        for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
          var prop = _step22.value;
          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator22.e(err);
      } finally {
        _iterator22.f();
      }
      return false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.executeEmbeddedScripts();
      this.makeTablesSortable();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProp, prevState, snapshot) {
      this.executeEmbeddedScripts();
      this.makeTablesSortable();
    }
  }, {
    key: "_toggleShrink",
    value: function _toggleShrink() {
      this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }
  }, {
    key: "_deleteMe",
    value: function _deleteMe() {
      this.props.handleDelete(this.props.unique_id);
    }
  }, {
    key: "_handleSummaryTextChange",
    value: function _handleSummaryTextChange(value) {
      this.props.setConsoleItemValue(this.props.unique_id, "summary_text", value);
    }
  }, {
    key: "executeEmbeddedScripts",
    value: function executeEmbeddedScripts() {
      if (this.props.output_text != this.last_output_text) {
        // to avoid doubles of bokeh images
        this.last_output_text = this.props.output_text;
        var scripts = $("#" + this.props.unique_id + " .log-code-output script").toArray();
        // $("#" + this.props.unique_id + " .bk-root").html(""); // This is a kluge to deal with bokeh double images
        var _iterator23 = _createForOfIteratorHelper(scripts),
          _step23;
        try {
          for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
            var script = _step23.value;
            try {
              window.eval(script.text);
            } catch (e) {}
          }
        } catch (err) {
          _iterator23.e(err);
        } finally {
          _iterator23.f();
        }
      }
    }
  }, {
    key: "makeTablesSortable",
    value: function makeTablesSortable() {
      var tables = $("#" + this.props.unique_id + " table.sortable").toArray();
      var _iterator24 = _createForOfIteratorHelper(tables),
        _step24;
      try {
        for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
          var table = _step24.value;
          sorttable.makeSortable(table);
        }
      } catch (err) {
        _iterator24.e(err);
      } finally {
        _iterator24.f();
      }
    }
  }, {
    key: "_copyMe",
    value: function _copyMe() {
      this.props.copyCell(this.props.unique_id);
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      this.props.pasteCell(this.props.unique_id);
    }
  }, {
    key: "_selectMe",
    value: function _selectMe() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.props.selectConsoleItem(this.props.unique_id, e, callback);
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankDivider",
    value: function _addBlankDivider() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewDividerItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewCodeItem();
      });
    }
  }, {
    key: "renderContextMenu",
    value: function renderContextMenu() {
      // return a single element, or nothing to use default browser behavior
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "duplicate",
        onClick: this._copyMe,
        text: "Copy Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: this._pasteCell,
        text: "Paste Cells"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "header",
        onClick: this._addBlankDivider,
        text: "New Section"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteMe,
        intent: "danger",
        text: "Delete Cell"
      }));
    }
  }, {
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      this._selectMe(e);
      e.stopPropagation();
    }
  }, {
    key: "render",
    value: function render() {
      var panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
      if (this.props.hide_in_section && this.props.in_section) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "log-panel fixed-log-panel d-flex flex-row",
          id: this.props.unique_id,
          style: {
            height: 0
          }
        });
      }
      if (this.props.in_section) {
        panel_class += " in-section";
      }
      if (this.props.am_selected) {
        panel_class += " selected";
      }
      var body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
      if (this.props.in_section) {
        body_width -= SECTION_INDENT / 2;
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: panel_class + " d-flex flex-row",
        onClick: this._consoleItemClick,
        id: this.props.unique_id,
        style: {
          marginBottom: 10
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div shrink-expand-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(Shandle, null), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-down",
        handleClick: this._toggleShrink
      }), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-right",
        style: {
          marginTop: 5
        },
        handleClick: this._toggleShrink
      })), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
        value: this.props.summary_text,
        onChange: this._handleSummaryTextChange,
        className: "log-panel-summary"
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._deleteMe,
        intent: "danger",
        tooltip: "Delete this item",
        style: {
          marginLeft: 10,
          marginRight: 66
        },
        icon: "trash"
      }))), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
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
      }, this.props.image_data_str && /*#__PURE__*/_react["default"].createElement("img", {
        src: this.props.image_data_str,
        alt: "An Image",
        width: body_width - 25
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._deleteMe,
        tooltip: "Delete this item",
        style: {
          marginLeft: 10,
          marginRight: 66
        },
        intent: "danger",
        icon: "trash"
      })))));
    }
  }]);
  return RawBlobItem;
}(_react["default"].Component);
RawBlobItem.propTypes = {
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

// const BlobItem = ContextMenuTarget(RawBlobItem);
var BlobItem = RawBlobItem;
var code_item_update_props = ["am_shrunk", "set_focus", "am_selected", "search_string", "summary_text", "console_text", "in_section", "hide_in_section", "show_spinner", "execution_count", "output_text", "console_available_width", "dark_theme"];
var RawConsoleCodeItem = /*#__PURE__*/function (_React$Component5) {
  _inherits(RawConsoleCodeItem, _React$Component5);
  var _super7 = _createSuper(RawConsoleCodeItem);
  function RawConsoleCodeItem(props) {
    var _this5;
    _classCallCheck(this, RawConsoleCodeItem);
    _this5 = _super7.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this5), "_", RawConsoleCodeItem.prototype);
    _this5.cmobject = null;
    _this5.elRef = /*#__PURE__*/_react["default"].createRef();
    _this5.update_props = code_item_update_props;
    _this5.update_state_vars = [];
    _this5.state = {};
    _this5.last_output_text = "";
    return _this5;
  }
  _createClass(RawConsoleCodeItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      var _iterator25 = _createForOfIteratorHelper(this.update_props),
        _step25;
      try {
        for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
          var prop = _step25.value;
          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator25.e(err);
      } finally {
        _iterator25.f();
      }
      return false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this6 = this;
      if (this.props.set_focus) {
        if (this.cmobject != null) {
          this.cmobject.focus();
          this.cmobject.setCursor({
            line: 0,
            ch: 0
          });
          this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
        }
      }
      var self = this;
      if (this.cmobject != null) {
        this.cmobject.on("focus", function () {
          self.props.setFocus(_this6.props.unique_id, self._selectMe);
        });
        this.cmobject.on("blur", function () {
          self.props.setFocus(null);
        });
      }
      this.executeEmbeddedScripts();
      this.makeTablesSortable();
    }
  }, {
    key: "_scrollMeIntoView",
    value: function _scrollMeIntoView() {
      var my_element = this.elRef.current;
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
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapShot) {
      this.executeEmbeddedScripts();
      this.makeTablesSortable();
      if (this.props.am_selected && !prevProps.am_selected && this.elRef && this.elRef.current) {
        // this.elRef.current.scrollIntoView()
        this._scrollMeIntoView();
      }
      if (this.props.set_focus) {
        if (this.cmobject != null) {
          this.cmobject.focus();
          this.cmobject.setCursor({
            line: 0,
            ch: 0
          });
          this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
        }
      }
    }
  }, {
    key: "executeEmbeddedScripts",
    value: function executeEmbeddedScripts() {
      if (this.props.output_text != this.last_output_text) {
        // to avoid doubles of bokeh images
        this.last_output_text = this.props.output_text;
        var scripts = $("#" + this.props.unique_id + " .log-code-output script").toArray();
        // $("#" + this.props.unique_id + " .bk-root").html(""); // This is a kluge to deal with bokeh double images
        var _iterator26 = _createForOfIteratorHelper(scripts),
          _step26;
        try {
          for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {
            var script = _step26.value;
            // noinspection EmptyCatchBlockJS,UnusedCatchParameterJS
            try {
              window.eval(script.text);
            } catch (e) {}
          }
        } catch (err) {
          _iterator26.e(err);
        } finally {
          _iterator26.f();
        }
      }
    }
  }, {
    key: "makeTablesSortable",
    value: function makeTablesSortable() {
      var tables = $("#" + this.props.unique_id + " table.sortable").toArray();
      var _iterator27 = _createForOfIteratorHelper(tables),
        _step27;
      try {
        for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {
          var table = _step27.value;
          sorttable.makeSortable(table);
        }
      } catch (err) {
        _iterator27.e(err);
      } finally {
        _iterator27.f();
      }
    }
  }, {
    key: "_stopMe",
    value: function _stopMe() {
      this._stopMySpinner();
      (0, _communication_react.postWithCallback)(this.props.main_id, "stop_console_code", {
        "console_id": this.props.unique_id
      }, null, null, this.props.main_id);
    }
  }, {
    key: "_showMySpinner",
    value: function _showMySpinner() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.setConsoleItemValue(this.props.unique_id, "show_spinner", true, callback);
    }
  }, {
    key: "_stopMySpinner",
    value: function _stopMySpinner() {
      this.props.setConsoleItemValue(this.props.unique_id, "show_spinner", false);
    }
  }, {
    key: "_handleChange",
    value: function _handleChange(new_code) {
      this.props.setConsoleItemValue(this.props.unique_id, "console_text", new_code);
    }
  }, {
    key: "_handleSummaryTextChange",
    value: function _handleSummaryTextChange(value) {
      this.props.setConsoleItemValue(this.props.unique_id, "summary_text", value);
    }
  }, {
    key: "_toggleShrink",
    value: function _toggleShrink() {
      this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }
  }, {
    key: "_deleteMe",
    value: function _deleteMe() {
      if (this.props.show_spinner) {
        this._stopMe();
      }
      this.props.handleDelete(this.props.unique_id);
    }
  }, {
    key: "_clearOutput",
    value: function _clearOutput() {
      var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.props.setConsoleItemValue(this.props.unique_id, "output_text", "", callback);
    }
  }, {
    key: "_extraKeys",
    value: function _extraKeys() {
      var _this7 = this;
      var self = this;
      return {
        'Ctrl-Enter': function CtrlEnter() {
          return self.props.runCodeItem(_this7.props.unique_id, true);
        },
        'Cmd-Enter': function CmdEnter() {
          return self.props.runCodeItem(_this7.props.unique_id, true);
        },
        'Ctrl-C': self.props.addNewCodeItem,
        'Ctrl-T': self.props.addNewTextItem
      };
    }
  }, {
    key: "_setCMObject",
    value: function _setCMObject(cmobject) {
      this.cmobject = cmobject;
      if (this.props.set_focus) {
        this.cmobject.focus();
        this.cmobject.setCursor({
          line: 0,
          ch: 0
        });
        this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
      }
    }
  }, {
    key: "_getFirstLine",
    value: function _getFirstLine() {
      var re = /^(.*)$/m;
      if (this.props.console_text == "") {
        return "empty text cell";
      } else {
        return re.exec(this.props.console_text)[0];
      }
    }
  }, {
    key: "_copyMe",
    value: function _copyMe() {
      this.props.copyCell(this.props.unique_id);
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      this.props.pasteCell(this.props.unique_id);
    }
  }, {
    key: "_selectMe",
    value: function _selectMe() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.props.selectConsoleItem(this.props.unique_id, e, callback);
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankDivider",
    value: function _addBlankDivider() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewDividerItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewCodeItem();
      });
    }
  }, {
    key: "renderContextMenu",
    value: function renderContextMenu() {
      var _this8 = this;
      // return a single element, or nothing to use default browser behavior
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, !this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "play",
        intent: "success",
        onClick: function onClick() {
          _this8.props.runCodeItem(_this8.props.unique_id);
        },
        text: "Run Cell"
      }), this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "stop",
        intent: "danger",
        onClick: this._stopMe,
        text: "Stop Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "header",
        onClick: this._addBlankDivider,
        text: "New Section"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "duplicate",
        onClick: this._copyMe,
        text: "Copy Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: this._pasteCell,
        text: "Paste Cells"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteMe,
        intent: "danger",
        text: "Delete Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clean",
        intent: "warning",
        onClick: function onClick() {
          _this8._clearOutput();
        },
        text: "Clear Output"
      }));
    }
  }, {
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      if (!this.props.am_selected) {
        this._selectMe(e);
      }
      e.stopPropagation();
    }
  }, {
    key: "_handleFocus",
    value: function _handleFocus() {
      if (!this.props.am_selected) {
        this._selectMe();
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this9 = this;
      if (this.props.hide_in_section && this.props.in_section) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "log-panel fixed-log-panel d-flex flex-row",
          id: this.props.unique_id,
          style: {
            height: 0
          }
        });
      }
      var panel_style = this.props.am_shrunk ? "log-panel log-panel-invisible" : "log-panel log-panel-visible";
      if (this.props.am_selected) {
        panel_style += " selected";
      }
      if (this.props.in_section) {
        panel_style += " in-section";
      }
      var output_dict = {
        __html: this.props.output_text
      };
      var spinner_val = this.props.running ? null : 0;
      var code_container_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
      if (this.props.in_section) {
        code_container_width -= SECTION_INDENT / 2;
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: panel_style + " d-flex flex-row",
        ref: this.elRef,
        onClick: this._consoleItemClick,
        id: this.props.unique_id
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div shrink-expand-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(Shandle, null), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-down",
        handleClick: this._toggleShrink
      }), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-right",
        style: {
          marginTop: 5
        },
        handleClick: this._toggleShrink
      })), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
        value: this.props.summary_text ? this.props.summary_text : this._getFirstLine(),
        onChange: this._handleSummaryTextChange,
        className: "log-panel-summary code-panel-summary"
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._deleteMe,
        intent: "danger",
        tooltip: "Delete this item",
        style: {
          marginLeft: 10,
          marginRight: 66
        },
        icon: "trash"
      }))), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("div", {
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
      }, !this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: function handleClick() {
          _this9.props.runCodeItem(_this9.props.unique_id);
        },
        intent: "success",
        tooltip: "Execute this item",
        icon: "play"
      }), this.props.show_spinner && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._stopMe,
        intent: "danger",
        tooltip: "Stop this item",
        icon: "stop"
      })), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        handleChange: this._handleChange,
        handleFocus: this._handleFocus,
        dark_theme: this.props.dark_theme,
        am_selected: this.props.am_selected,
        readOnly: false,
        show_line_numbers: true,
        code_content: this.props.console_text,
        setCMObject: this._setCMObject,
        extraKeys: this._extraKeys(),
        search_term: this.props.search_string,
        code_container_width: code_container_width,
        saveMe: null
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._deleteMe,
        intent: "danger",
        tooltip: "Delete this item",
        style: {
          marginLeft: 10,
          marginRight: 0
        },
        icon: "trash"
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: function handleClick() {
          _this9._clearOutput();
        },
        intent: "warning",
        tooltip: "Clear this item's output",
        style: {
          marginLeft: 10,
          marginRight: 0
        },
        icon: "clean"
      }))), !this.props.show_spinner && /*#__PURE__*/_react["default"].createElement("div", {
        className: "execution-counter"
      }, "[", String(this.props.execution_count), "]"), this.props.show_spinner && /*#__PURE__*/_react["default"].createElement("div", {
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
      }))));
    }
  }]);
  return RawConsoleCodeItem;
}(_react["default"].Component);
RawConsoleCodeItem.propTypes = {
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
RawConsoleCodeItem.defaultProps = {
  summary_text: null
};

// const ConsoleCodeItem = ContextMenuTarget(RawConsoleCodeItem);
var ConsoleCodeItem = RawConsoleCodeItem;
var ResourceLinkButton = /*#__PURE__*/function (_React$PureComponent3) {
  _inherits(ResourceLinkButton, _React$PureComponent3);
  var _super8 = _createSuper(ResourceLinkButton);
  function ResourceLinkButton(props) {
    var _this10;
    _classCallCheck(this, ResourceLinkButton);
    _this10 = _super8.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this10));
    _this10.my_view = (0, _library_pane.view_views)(false)[props.res_type];
    if (window.in_context) {
      var re = new RegExp("/$");
      _this10.my_view = _this10.my_view.replace(re, "_in_context");
    }
    return _this10;
  }
  _createClass(ResourceLinkButton, [{
    key: "_goToLink",
    value: function _goToLink() {
      var self = this;
      if (window.in_context) {
        (0, _communication_react.postAjaxPromise)($SCRIPT_ROOT + this.my_view, {
          context_id: window.context_id,
          resource_name: this.props.res_name
        }).then(self.props.handleCreateViewer)["catch"](_toaster.doFlash);
      } else {
        window.open($SCRIPT_ROOT + this.my_view + this.props.res_name);
      }
    }
  }, {
    key: "render",
    value: function render() {
      var self = this;
      return /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
        className: "link-button-group"
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        small: true,
        text: this.props.res_name,
        icon: _blueprint_mdata_fields.icon_dict[this.props.res_type],
        minimal: true,
        onClick: this._goToLink
      }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        small: true,
        icon: "small-cross",
        minimal: true,
        onClick: function onClick(e) {
          self.props.deleteMe(self.props.my_index);
          e.stopPropagation();
        }
      }));
    }
  }]);
  return ResourceLinkButton;
}(_react["default"].PureComponent);
ResourceLinkButton.propTypes = {
  res_type: _propTypes["default"].string,
  res_name: _propTypes["default"].string,
  deleteMe: _propTypes["default"].func
};
var text_item_update_props = ["am_shrunk", "set_focus", "serach_string", "am_selected", "show_markdown", "in_section", "hide_in_section", "summary_text", "console_text", "console_available_width", "links"];
var RawConsoleTextItem = /*#__PURE__*/function (_React$Component6) {
  _inherits(RawConsoleTextItem, _React$Component6);
  var _super9 = _createSuper(RawConsoleTextItem);
  function RawConsoleTextItem(props) {
    var _this11;
    _classCallCheck(this, RawConsoleTextItem);
    _this11 = _super9.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this11), "_", RawConsoleTextItem.prototype);
    _this11.cmobject = null;
    _this11.elRef = /*#__PURE__*/_react["default"].createRef();
    _this11.ce_summary_ref = /*#__PURE__*/_react["default"].createRef();
    _this11.update_props = text_item_update_props;
    _this11.update_state_vars = ["ce_ref"];
    _this11.previous_dark_theme = props.dark_theme;
    _this11.state = {
      ce_ref: null
    };
    return _this11;
  }
  _createClass(RawConsoleTextItem, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState, nextContext) {
      var _iterator28 = _createForOfIteratorHelper(this.update_props),
        _step28;
      try {
        for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {
          var prop = _step28.value;
          if (nextProps[prop] != this.props[prop]) {
            return true;
          }
        }
      } catch (err) {
        _iterator28.e(err);
      } finally {
        _iterator28.f();
      }
      var _iterator29 = _createForOfIteratorHelper(this.update_state_vars),
        _step29;
      try {
        for (_iterator29.s(); !(_step29 = _iterator29.n()).done;) {
          var state_var = _step29.value;
          if (nextState[state_var] != this.state[state_var]) {
            return true;
          }
        }
      } catch (err) {
        _iterator29.e(err);
      } finally {
        _iterator29.f();
      }
      if (this.props.dark_theme != this.previous_dark_theme) {
        this.previous_dark_theme = this.props.dark_theme;
        return true;
      }
      return false;
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this12 = this;
      if (this.props.set_focus) {
        if (this.props.show_markdown) {
          this._hideMarkdown();
        } else if (this.cmobject != null) {
          this.cmobject.focus();
          this.cmobject.setCursor({
            line: 0,
            ch: 0
          });
          this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
        }
      }
      var self = this;
      if (this.cmobject != null) {
        this.cmobject.on("focus", function () {
          self.props.setFocus(_this12.props.unique_id, self._selectMe);
        });
        this.cmobject.on("blur", function () {
          self.props.setFocus(null);
        });
      }
    }
  }, {
    key: "_scrollMeIntoView",
    value: function _scrollMeIntoView() {
      var my_element = this.elRef.current;
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
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState, snapShot) {
      if (this.props.am_selected && !prevProps.am_selected && this.elRef && this.elRef.current) {
        this._scrollMeIntoView();
      }
      if (this.props.set_focus) {
        if (this.props.show_markdown) {
          this._hideMarkdown();
        } else if (this.cmobject != null) {
          this.cmobject.focus();
          this.cmobject.setCursor({
            line: 0,
            ch: 0
          });
          this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
        }
      }
    }
  }, {
    key: "hasOnlyWhitespace",
    get: function get() {
      return !this.props.console_text.trim().length;
    }
  }, {
    key: "_showMarkdown",
    value: function _showMarkdown() {
      this.props.setConsoleItemValue(this.props.unique_id, "show_markdown", true);
    }
  }, {
    key: "_toggleMarkdown",
    value: function _toggleMarkdown() {
      if (this.props.show_markdown) {
        this._hideMarkdown();
      } else {
        this._showMarkdown();
      }
    }
  }, {
    key: "_hideMarkdown",
    value: function _hideMarkdown() {
      this.props.setConsoleItemValue(this.props.unique_id, "show_markdown", false);
    }
  }, {
    key: "_handleChange",
    value: function _handleChange(new_text) {
      this.props.setConsoleItemValue(this.props.unique_id, "console_text", new_text);
    }
  }, {
    key: "_clearForceSync",
    value: function _clearForceSync() {
      this.props.setConsoleItemValue(this.props.unique_id, "force_sync_to_prop", false);
    }
  }, {
    key: "_handleSummaryTextChange",
    value: function _handleSummaryTextChange(value) {
      this.props.setConsoleItemValue(this.props.unique_id, "summary_text", value);
    }
  }, {
    key: "_toggleShrink",
    value: function _toggleShrink() {
      this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }
  }, {
    key: "_deleteMe",
    value: function _deleteMe() {
      this.props.handleDelete(this.props.unique_id);
    }
  }, {
    key: "_handleKeyDown",
    value: function _handleKeyDown(event) {
      if (event.key == "Tab") {
        this.props.goToNextCell(this.props.unique_id);
        event.preventDefault();
      }
    }
  }, {
    key: "_gotEnter",
    value: function _gotEnter() {
      this.props.goToNextCell(this.props.unique_id);
      this._showMarkdown();
    }
  }, {
    key: "_getFirstLine",
    value: function _getFirstLine() {
      var re = /^(.*)$/m;
      if (this.props.console_text == "") {
        return "empty text cell";
      } else {
        return re.exec(this.props.console_text)[0];
      }
    }
  }, {
    key: "_copyMe",
    value: function _copyMe() {
      this.props.copyCell(this.props.unique_id);
    }
  }, {
    key: "_pasteCell",
    value: function _pasteCell() {
      this.props.pasteCell(this.props.unique_id);
    }
  }, {
    key: "_selectMe",
    value: function _selectMe() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      this.props.selectConsoleItem(this.props.unique_id, e, callback);
    }
  }, {
    key: "_insertResourceLink",
    value: function _insertResourceLink() {
      var self = this;
      (0, _modal_react.showSelectResourceDialog)("cancel", "insert link", function (result) {
        var new_links = _toConsumableArray(self.props.links);
        new_links.push({
          res_type: result.type,
          res_name: result.selected_resource
        });
        self.props.setConsoleItemValue(self.props.unique_id, "links", new_links);
      });
    }
  }, {
    key: "_deleteLinkButton",
    value: function _deleteLinkButton(index) {
      var new_links = _lodash["default"].cloneDeep(this.props.links);
      new_links.splice(index, 1);
      var self = this;
      this.props.setConsoleItemValue(this.props.unique_id, "links", new_links, function () {
        console.log("i am here with nlinks " + String(self.props.links.length));
      });
    }
  }, {
    key: "_addBlankText",
    value: function _addBlankText() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewTextItem();
      });
    }
  }, {
    key: "_addBlankDivider",
    value: function _addBlankDivider() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewDividerItem();
      });
    }
  }, {
    key: "_addBlankCode",
    value: function _addBlankCode() {
      var self = this;
      this._selectMe(null, function () {
        self.props.addNewCodeItem();
      });
    }
  }, {
    key: "renderContextMenu",
    value: function renderContextMenu() {
      // return a single element, or nothing to use default browser behavior
      return /*#__PURE__*/_react["default"].createElement(_core.Menu, null, /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "paragraph",
        intent: "success",
        onClick: this._showMarkdown,
        text: "Show Markdown"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "new-text-box",
        onClick: this._addBlankText,
        text: "New Text Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "code",
        onClick: this._addBlankCode,
        text: "New Code Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "header",
        onClick: this._addBlankDivider,
        text: "New Section"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "link",
        onClick: this._insertResourceLink,
        text: "Insert ResourceLink"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "duplicate",
        onClick: this._copyMe,
        text: "Copy Cell"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "clipboard",
        onClick: this._pasteCell,
        text: "Paste Cells"
      }), /*#__PURE__*/_react["default"].createElement(_core.MenuDivider, null), /*#__PURE__*/_react["default"].createElement(_core.MenuItem, {
        icon: "trash",
        onClick: this._deleteMe,
        intent: "danger",
        text: "Delete Cell"
      }));
    }
  }, {
    key: "_consoleItemClick",
    value: function _consoleItemClick(e) {
      this._selectMe(e);
      e.stopPropagation();
    }
  }, {
    key: "_handleFocus",
    value: function _handleFocus() {
      if (!this.props.am_selected) {
        this._selectMe();
      }
    }
  }, {
    key: "_setCMObject",
    value: function _setCMObject(cmobject) {
      this.cmobject = cmobject;
      if (this.props.set_focus) {
        this.cmobject.focus();
        this.cmobject.setCursor({
          line: 0,
          ch: 0
        });
        this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe);
      }
    }
  }, {
    key: "_extraKeys",
    value: function _extraKeys() {
      var self = this;
      return {
        'Ctrl-Enter': function CtrlEnter() {
          return self._gotEnter();
        },
        'Cmd-Enter': function CmdEnter() {
          return self._gotEnter();
        },
        'Ctrl-C': self.props.addNewCodeItem,
        'Ctrl-T': self.props.addNewTextItem
      };
    }
  }, {
    key: "render",
    value: function render() {
      var _this13 = this;
      if (this.props.hide_in_section && this.props.in_section) {
        return /*#__PURE__*/_react["default"].createElement("div", {
          className: "log-panel fixed-log-panel d-flex flex-row",
          id: this.props.unique_id,
          style: {
            height: 0
          }
        });
      }
      var really_show_markdown = this.hasOnlyWhitespace && this.props.links.length == 0 ? false : this.props.show_markdown;
      var converted_markdown;
      if (really_show_markdown) {
        converted_markdown = mdi.render(this.props.console_text);
      }
      // let key_bindings = [[["ctrl+enter", "command+enter"], this._gotEnter]];
      var converted_dict = {
        __html: converted_markdown
      };
      var panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible text-log-item" : "log-panel log-panel-visible text-log-item";
      if (this.props.am_selected) {
        panel_class += " selected";
      }
      if (this.props.in_section) {
        panel_class += " in-section";
      }
      var gbstyle = {
        marginLeft: 1
      };
      var body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
      var self = this;
      var link_buttons = this.props.links.map(function (link, index) {
        return /*#__PURE__*/_react["default"].createElement(ResourceLinkButton, {
          key: index,
          my_index: index,
          handleCreateViewer: _this13.props.handleCreateViewer,
          deleteMe: self._deleteLinkButton,
          res_type: link.res_type,
          res_name: link.res_name
        });
      });
      var code_container_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
      if (this.props.in_section) {
        code_container_width -= SECTION_INDENT / 2;
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: panel_class + " d-flex flex-row",
        onClick: this._consoleItemClick,
        ref: this.elRef,
        id: this.props.unique_id,
        style: {
          marginBottom: 10
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div shrink-expand-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(Shandle, null), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-down",
        handleClick: this._toggleShrink
      }), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        icon: "chevron-right",
        style: {
          marginTop: 5
        },
        handleClick: this._toggleShrink
      })), this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.EditableText, {
        value: this.props.summary_text ? this.props.summary_text : this._getFirstLine(),
        onChange: this._handleSummaryTextChange,
        className: "log-panel-summary"
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._deleteMe,
        intent: "danger",
        tooltip: "Delete this item",
        style: {
          marginLeft: 10,
          marginRight: 66
        },
        icon: "trash"
      }))), !this.props.am_shrunk && /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-column",
        style: {
          width: "100%"
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "log-panel-body text-box d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-inline-flex pr-1"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._toggleMarkdown,
        intent: "success",
        tooltip: "Convert to/from markdown",
        icon: "paragraph"
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-column"
      }, !really_show_markdown && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        handleChange: this._handleChange,
        dark_theme: this.props.dark_theme,
        am_selected: this.props.am_selected,
        readOnly: false,
        handleFocus: this._handleFocus,
        show_line_numbers: false,
        soft_wrap: true,
        sync_to_prop: false,
        force_sync_to_prop: this.props.force_sync_to_prop,
        clear_force_sync: this._clearForceSync,
        mode: "markdown",
        code_content: this.props.console_text,
        setCMObject: this._setCMObject,
        extraKeys: this._extraKeys(),
        search_term: this.props.search_string,
        code_container_width: code_container_width,
        saveMe: null
      })), really_show_markdown && !this.hasOnlyWhitespace && /*#__PURE__*/_react["default"].createElement("div", {
        className: "text-panel-output",
        onDoubleClick: this._hideMarkdown,
        style: {
          width: body_width,
          padding: 9
        },
        dangerouslySetInnerHTML: converted_dict
      }), link_buttons), /*#__PURE__*/_react["default"].createElement("div", {
        className: "button-div d-flex flex-row"
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.GlyphButton, {
        handleClick: this._deleteMe,
        intent: "danger",
        tooltip: "Delete this item",
        style: {
          marginLeft: 10,
          marginRight: 66
        },
        icon: "trash"
      })))));
    }
  }]);
  return RawConsoleTextItem;
}(_react["default"].Component);
RawConsoleTextItem.propTypes = {
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
RawConsoleTextItem.defaultProps = {
  force_sync_to_prop: false,
  summary_text: null,
  links: []
};

// const ConsoleTextItem = ContextMenuTarget(RawConsoleTextItem);
var ConsoleTextItem = RawConsoleTextItem;
var all_update_props = {
  "text": text_item_update_props,
  "code": code_item_update_props,
  "fixed": log_item_update_props
};