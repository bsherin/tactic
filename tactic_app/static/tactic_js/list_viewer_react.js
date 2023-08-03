"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListViewerApp = ListViewerApp;
exports.list_viewer_props = list_viewer_props;
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react");
var _toaster = require("./toaster");
var _sizing_tools = require("./sizing_tools");
var _error_drawer = require("./error_drawer");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _modal_react = require("./modal_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function list_viewer_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {
  var resource_viewer_id = (0, _utilities_react.guid)();
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "list_viewer", resource_viewer_id);
  finalCallback({
    resource_viewer_id: resource_viewer_id,
    main_id: resource_viewer_id,
    tsocket: tsocket,
    split_tags: data.mdata.tags == "" ? [] : data.mdata.tags.split(" "),
    created: data.mdata.datestring,
    resource_name: data.resource_name,
    the_content: data.the_content,
    notes: data.mdata.notes,
    readOnly: data.read_only,
    is_repository: data.is_repository,
    meta_outer: "#right-div",
    registerDirtyMethod: registerDirtyMethod,
    registerOmniFunction: registerOmniFunction
  });
}
var LIST_PADDING_TOP = 15;
function ListEditor(props) {
  var tastyle = {
    resize: "horizontal",
    margin: 2,
    height: props.height - LIST_PADDING_TOP
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    id: "listarea-container",
    ref: props.outer_ref,
    style: {
      margin: 0,
      paddingTop: LIST_PADDING_TOP
    }
  }, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
    cols: "50",
    style: tastyle,
    disabled: props.readOnly,
    onChange: props.handleChange,
    value: props.the_content
  }));
}
ListEditor = /*#__PURE__*/(0, _react.memo)(ListEditor);
ListEditor.propTypes = {
  the_content: _propTypes["default"].string,
  handleChange: _propTypes["default"].func,
  readOnly: _propTypes["default"].bool,
  outer_ref: _propTypes["default"].object,
  height: _propTypes["default"].number
};
function ListViewerApp(props) {
  var top_ref = (0, _react.useRef)(null);
  var cc_ref = (0, _react.useRef)(null);
  var search_ref = (0, _react.useRef)(null);
  var cc_offset_top = (0, _react.useRef)(null);
  var savedContent = (0, _react.useRef)(props.the_content);
  var savedTags = (0, _react.useRef)(props.split_tags);
  var savedNotes = (0, _react.useRef)(props.notes);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(props.the_content),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    list_content = _useStateAndRef2[0],
    set_list_content = _useStateAndRef2[1],
    list_content_ref = _useStateAndRef2[2];
  var _useStateAndRef3 = (0, _utilities_react.useStateAndRef)(props.notes),
    _useStateAndRef4 = _slicedToArray(_useStateAndRef3, 3),
    notes = _useStateAndRef4[0],
    set_notes = _useStateAndRef4[1],
    notes_ref = _useStateAndRef4[2];
  var _useStateAndRef5 = (0, _utilities_react.useStateAndRef)(props.split_tags),
    _useStateAndRef6 = _slicedToArray(_useStateAndRef5, 3),
    tags = _useStateAndRef6[0],
    set_tags = _useStateAndRef6[1],
    tags_ref = _useStateAndRef6[2];

  // The following only are used if not in context
  var _useState = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
    }),
    _useState2 = _slicedToArray(_useState, 2),
    usable_width = _useState2[0],
    set_usable_width = _useState2[1];
  var _useState3 = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    usable_height = _useState4[0],
    set_usable_height = _useState4[1];
  var _useState5 = (0, _react.useState)(function () {
      return props.initial_theme === "dark";
    }),
    _useState6 = _slicedToArray(_useState5, 2),
    dark_theme = _useState6[0],
    set_dark_theme = _useState6[1];
  var _useState7 = (0, _react.useState)(props.resource_name),
    _useState8 = _slicedToArray(_useState7, 2),
    resource_name = _useState8[0],
    set_resource_name = _useState8[1];
  (0, _react.useEffect)(function () {
    props.stopSpinner();
    if (cc_ref && cc_ref.current) {
      cc_offset_top.current = cc_ref.current.offsetTop;
    }
    if (!props.controlled) {
      window.dark_theme = dark_theme;
      window.addEventListener("resize", _update_window_dimensions);
      _update_window_dimensions();
    } else {
      props.registerDirtyMethod(_dirty);
    }
  }, []);
  var pushCallback = (0, _utilities_react.useCallbackStack)("code_viewer");
  (0, _utilities_react.useConstructor)(function () {
    if (!props.controlled) {
      window.addEventListener("beforeunload", function (e) {
        if (_dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }
  });
  function _setTheme(dark_theme) {
    set_dark_theme(dark_theme);
    if (!window.in_context) {
      pushCallback(function () {
        window.dark_theme = dark_theme;
      });
    }
  }
  function cPropGetters() {
    return {
      usable_width: usable_width,
      usable_height: usable_height,
      resource_name: resource_name
    };
  }
  function _cProp(pname) {
    return props.controlled ? props[pname] : cPropGetters()[pname];
  }
  function menu_specs() {
    var ms;
    if (props.is_repository) {
      ms = {
        Transfer: [{
          "name_text": "Copy to library",
          "icon_name": "import",
          "click_handler": function click_handler() {
            (0, _resource_viewer_react_app.copyToLibrary)("list", _cProp("resource_name"));
          },
          tooltip: "Copy to library"
        }]
      };
    } else {
      ms = {
        Save: [{
          name_text: "Save",
          icon_name: "saved",
          click_handler: _saveMe,
          key_bindings: ['ctrl+s'],
          tooltip: "Save"
        }, {
          name_text: "Save As...",
          icon_name: "floppy-disk",
          click_handler: _saveMeAs,
          tooltip: "Save as"
        }],
        Transfer: [{
          name_text: "Share",
          icon_name: "share",
          click_handler: function click_handler() {
            (0, _resource_viewer_react_app.sendToRepository)("list", _cProp("resource_name"));
          },
          tooltip: "Share to repository"
        }]
      };
    }
    for (var _i2 = 0, _Object$entries = Object.entries(ms); _i2 < _Object$entries.length; _i2++) {
      var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
        menu_name = _Object$entries$_i[0],
        menu = _Object$entries$_i[1];
      var _iterator = _createForOfIteratorHelper(menu),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var but = _step.value;
          but.click_handler = but.click_handler.bind(this);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return ms;
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
  function _handleMetadataChange(state_stuff) {
    for (var field in state_stuff) {
      switch (field) {
        case "tags":
          set_tags(state_stuff[field]);
          break;
        case "notes":
          set_notes(state_stuff[field]);
          break;
      }
    }
  }
  function _handleListChange(event) {
    set_list_content(event.target.value);
  }
  function _update_window_dimensions() {
    set_usable_width(window.innerWidth - top_ref.current.offsetLeft);
    set_usable_height(window.innerHeight - top_ref.current.offsetTop);
  }
  function get_new_cc_height() {
    var uheight = _cProp("usable_height");
    if (cc_offset_top.current) {
      return uheight - cc_offset_top.current - _sizing_tools.BOTTOM_MARGIN;
    } else if (cc_ref && cc_ref.current) {
      // This will be true after the initial render
      return uheight - cc_ref.current.offsetTop - _sizing_tools.BOTTOM_MARGIN;
    } else {
      return uheight - 100;
    }
  }
  function _saveMe() {
    if (!props.am_selected) {
      return false;
    }
    var new_list_as_string = list_content;
    var tagstring = tags.join(" ");
    var local_notes = notes;
    var local_tags = tags; // In case it's modified wile saving
    var result_dict = {
      "list_name": _cProp("resource_name"),
      "new_list_as_string": new_list_as_string,
      "tags": tagstring,
      "notes": notes
    };
    var self = this;
    (0, _communication_react.postAjax)("update_list", result_dict, update_success);
    function update_success(data) {
      if (data.success) {
        savedContent.current = new_list_as_string;
        savedTags.current = local_tags;
        savedNotes.current = local_notes;
        data.timeout = 2000;
      }
      (0, _toaster.doFlash)(data);
      return false;
    }
  }
  function _saveMeAs(e) {
    props.startSpinner();
    var self = this;
    (0, _communication_react.postWithCallback)("host", "get_list_names", {
      "user_id": window.user_id
    }, function (data) {
      var checkboxes;
      (0, _modal_react.showModalReact)("Save List As", "New List Name", CreateNewList, "NewList", data["list_names"], null, doCancel);
    }, null, props.main_id);
    function doCancel() {
      props.stopSpinner();
    }
    function CreateNewList(new_name) {
      var result_dict = {
        "new_res_name": new_name,
        "res_to_copy": _cProp("resource_name")
      };
      (0, _communication_react.postAjaxPromise)('/create_duplicate_list', result_dict).then(function (data) {
        _setResourceNameState(new_name, function () {
          _saveMe();
        });
      })["catch"](_toaster.doFlash);
    }
  }
  function _dirty() {
    return !(list_content_ref.current == savedContent.current && tags_ref.current == savedTags.current && notes_ref.current == savedNotes.current);
  }
  var actual_dark_theme = props.controlled ? props.dark_theme : dark_theme;
  var my_props = _objectSpread({}, props);
  if (!props.controlled) {
    my_props.resource_name = resource_name;
    my_props.usable_height = usable_height;
    my_props.usable_width = usable_width;
  }
  var outer_style = {
    width: "100%",
    height: my_props.usable_height,
    paddingLeft: 0,
    position: "relative"
  };
  var outer_class = "resource-viewer-holder";
  if (!props.controlled) {
    if (dark_theme) {
      outer_class = outer_class + " bp5-dark";
    } else {
      outer_class = outer_class + " light-theme";
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    dark_theme: dark_theme,
    setTheme: _setTheme,
    selected: null,
    show_api_links: true,
    page_id: props.resource_viewer_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(_resource_viewer_react_app.ResourceViewerApp, _extends({}, my_props, {
    dark_theme: dark_theme,
    setTheme: props.controlled ? null : _setTheme,
    resource_viewer_id: props.resource_viewer_id,
    setResourceNameState: _setResourceNameState,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "list",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs(),
    handleStateChange: _handleMetadataChange,
    created: props.created,
    meta_outer: props.meta_outer,
    notes: notes,
    tags: tags,
    showErrorDrawerButton: false,
    registerOmniFunction: props.registerOmniFunction,
    saveMe: _saveMe
  }), /*#__PURE__*/_react["default"].createElement(ListEditor, {
    the_content: list_content,
    readOnly: props.readOnly,
    outer_ref: cc_ref,
    height: get_new_cc_height(),
    handleChange: _handleListChange
  }))));
}
exports.ListViewerApp = ListViewerApp = /*#__PURE__*/(0, _react.memo)(ListViewerApp);
ListViewerApp.propTypes = {
  controlled: _propTypes["default"].bool,
  am_selected: _propTypes["default"].bool,
  changeResourceName: _propTypes["default"].func,
  changeResourceTitle: _propTypes["default"].func,
  changeResourceProps: _propTypes["default"].func,
  updatePanel: _propTypes["default"].func,
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func,
  the_content: _propTypes["default"].string,
  created: _propTypes["default"].string,
  tags: _propTypes["default"].array,
  notes: _propTypes["default"].string,
  readOnly: _propTypes["default"].bool,
  is_repository: _propTypes["default"].bool,
  meta_outer: _propTypes["default"].string,
  tsocket: _propTypes["default"].object,
  usable_height: _propTypes["default"].number,
  usable_width: _propTypes["default"].number
};
ListViewerApp.defaultProps = {
  am_selected: true,
  controlled: false,
  changeResourceName: null,
  changeResourceTitle: null,
  changeResourceProps: null,
  updatePanel: null,
  refreshTab: null,
  closeTab: null
};
function list_viewer_main() {
  function gotProps(the_props) {
    var ListViewerAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(ListViewerApp));
    var the_element = /*#__PURE__*/_react["default"].createElement(ListViewerAppPlus, _extends({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    var domContainer = document.querySelector('#root');
    ReactDOM.render(the_element, domContainer);
  }
  var target = window.is_repository ? "repository_view_list_in_context" : "view_list_in_context";
  (0, _communication_react.postAjaxPromise)(target, {
    "resource_name": window.resource_name
  }).then(function (data) {
    list_viewer_props(data, null, gotProps, null);
  });
}
if (!window.in_context) {
  list_viewer_main();
}