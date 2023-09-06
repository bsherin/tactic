"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CodeViewerApp = CodeViewerApp;
exports.code_viewer_props = code_viewer_props;
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _reactCodemirror = require("./react-codemirror");
var _resource_viewer_react_app = require("./resource_viewer_react_app");
var _tactic_socket = require("./tactic_socket");
var _communication_react = require("./communication_react.js");
var _toaster = require("./toaster.js");
var _sizing_tools = require("./sizing_tools.js");
var _error_drawer = require("./error_drawer.js");
var _utilities_react = require("./utilities_react");
var _blueprint_navbar = require("./blueprint_navbar");
var _theme = require("./theme");
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
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function code_viewer_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {
  var resource_viewer_id = (0, _utilities_react.guid)();
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, "code_viewer", resource_viewer_id);
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
function CodeViewerApp(props) {
  var top_ref = (0, _react.useRef)(null);
  var cc_ref = (0, _react.useRef)(null);
  var search_ref = (0, _react.useRef)(null);
  var cc_bounding_top = (0, _react.useRef)(null);
  var savedContent = (0, _react.useRef)(props.the_content);
  var savedTags = (0, _react.useRef)(props.split_tags);
  var savedNotes = (0, _react.useRef)(props.notes);
  var _useStateAndRef = (0, _utilities_react.useStateAndRef)(props.the_content),
    _useStateAndRef2 = _slicedToArray(_useStateAndRef, 3),
    code_content = _useStateAndRef2[0],
    set_code_content = _useStateAndRef2[1],
    code_content_ref = _useStateAndRef2[2];
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
  var _useState = (0, _react.useState)(""),
    _useState2 = _slicedToArray(_useState, 2),
    search_string = _useState2[0],
    set_search_string = _useState2[1];
  var _useState3 = (0, _react.useState)(false),
    _useState4 = _slicedToArray(_useState3, 2),
    regex = _useState4[0],
    set_regex = _useState4[1];
  var _useState5 = (0, _react.useState)(props["null"]),
    _useState6 = _slicedToArray(_useState5, 2),
    search_matches = _useState6[0],
    set_search_matches = _useState6[1];

  // The following only are used if not in context
  var _useState7 = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
    }),
    _useState8 = _slicedToArray(_useState7, 2),
    usable_width = _useState8[0],
    set_usable_width = _useState8[1];
  var _useState9 = (0, _react.useState)(function () {
      return (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
    }),
    _useState10 = _slicedToArray(_useState9, 2),
    usable_height = _useState10[0],
    set_usable_height = _useState10[1];
  var _useState11 = (0, _react.useState)(props.resource_name),
    _useState12 = _slicedToArray(_useState11, 2),
    resource_name = _useState12[0],
    set_resource_name = _useState12[1];
  var theme = (0, _react.useContext)(_theme.ThemeContext);
  var dialogFuncs = (0, _react.useContext)(_modal_react.DialogContext);
  var statusFuncs = (0, _react.useContext)(_toaster.StatusContext);
  (0, _react.useEffect)(function () {
    statusFuncs.stopSpinner();
    if (cc_ref && cc_ref.current) {
      cc_bounding_top.current = cc_ref.current.getBoundingClientRect().top;
    }
    if (!props.controlled) {
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
  function _update_search_state(nstate) {
    var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    for (var field in nstate) {
      switch (field) {
        case "regex":
          set_regex(nstate[field]);
          break;
        case "search_string":
          set_search_string(nstate[field]);
          break;
      }
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
  var menu_specs = (0, _react.useMemo)(function () {
    var ms;
    if (props.is_repository) {
      ms = {
        Transfer: [{
          "name_text": "Copy to library",
          "icon_name": "import",
          "click_handler": function click_handler() {
            (0, _resource_viewer_react_app.copyToLibrary)("list", _cProp("resource_name"), dialogFuncs);
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
            (0, _resource_viewer_react_app.sendToRepository)("list", _cProp("resource_name"), dialogFuncs);
          },
          tooltip: "Share to repository"
        }]
      };
    }
    return ms;
  });
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
  function _handleCodeChange(new_code) {
    set_code_content(new_code);
  }
  function _update_window_dimensions() {
    set_usable_width(window.innerWidth - top_ref.current.offsetLeft);
    set_usable_height(window.innerHeight - top_ref.current.offsetTop);
  }
  function get_new_cc_height() {
    if (cc_bounding_top.current) {
      return window.innerHeight - cc_bounding_top.current - _sizing_tools.BOTTOM_MARGIN;
    } else if (cc_ref && cc_ref.current) {
      // This will be true after the initial render
      return window.innerHeight - cc_ref.current.getBoundingClientRect().top - _sizing_tools.BOTTOM_MARGIN;
    } else {
      return _cProp("usable_height") - 100;
    }
  }
  function _setSearchMatches(nmatches) {
    set_search_matches(nmatches);
  }
  function _extraKeys() {
    return {
      'Ctrl-S': _saveMe,
      'Ctrl-F': function CtrlF() {
        search_ref.current.focus();
      },
      'Cmd-F': function CmdF() {
        search_ref.current.focus();
      }
    };
  }
  function _saveMe() {
    if (!props.am_selected) {
      return false;
    }
    var new_code = code_content;
    var tagstring = tags.join(" ");
    var local_notes = notes;
    var local_tags = tags; // In case it's modified wile saving
    var result_dict = {
      "code_name": _cProp("resource_name"),
      "new_code": new_code,
      "tags": tagstring,
      "notes": local_notes,
      "user_id": window.user_id
    };
    (0, _communication_react.postWithCallback)("host", "update_code_task", result_dict, update_success, null, props.resource_viewer_id);
    function update_success(data) {
      if (data.success) {
        savedContent.current = new_code;
        savedTags.current = local_tags;
        savedNotes.current = local_notes;
        data.timeout = 2000;
      }
      (0, _toaster.doFlash)(data);
      return false;
    }
  }
  function _saveMeAs(e) {
    statusFuncs.startSpinner();
    (0, _communication_react.postWithCallback)("host", "get_code_names", {
      "user_id": window.user_id
    }, function (data) {
      var checkboxes;
      dialogFuncs.showModal("ModalDialog", {
        title: "Save Code As",
        field_title: "New Code Name",
        handleSubmit: CreateNewList,
        default_value: "NewCode",
        existing_names: data.code_names,
        checkboxes: [],
        handleCancel: doCancel,
        handleClose: dialogFuncs.hideModal
      });
    }, null, props.main_id);
    function doCancel() {
      statusFuncs.stopSpinner();
    }
    function CreateNewList(new_name) {
      var result_dict = {
        "new_res_name": new_name,
        "res_to_copy": _cProp("resource_name")
      };
      (0, _communication_react.postAjaxPromise)('/create_duplicate_code', result_dict).then(function (data) {
        _setResourceNameState(new_name, function () {
          _saveMe();
        });
      })["catch"](_toaster.doFlash);
    }
  }
  function _dirty() {
    return !(code_content_ref.current == savedContent.current && tags_ref.current == savedTags.current && notes_ref.current == savedNotes.current);
  }
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
    if (theme.dark_theme) {
      outer_class = outer_class + " bp5-dark";
    } else {
      outer_class = outer_class + " light-theme";
    }
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
    is_authenticated: window.is_authenticated,
    selected: null,
    show_api_links: true,
    page_id: props.resource_viewer_id,
    user_name: window.username
  }), /*#__PURE__*/_react["default"].createElement("div", {
    className: outer_class,
    ref: top_ref,
    style: outer_style
  }, /*#__PURE__*/_react["default"].createElement(_resource_viewer_react_app.ResourceViewerApp, _extends({}, my_props, {
    resource_viewer_id: props.resource_viewer_id,
    setResourceNameState: _setResourceNameState,
    refreshTab: props.refreshTab,
    closeTab: props.closeTab,
    res_type: "code",
    resource_name: my_props.resource_name,
    menu_specs: menu_specs,
    handleStateChange: _handleMetadataChange,
    created: props.created,
    meta_outer: props.meta_outer,
    notes: notes,
    tags: tags,
    saveMe: _saveMe,
    search_ref: search_ref,
    show_search: true,
    update_search_state: _update_search_state,
    search_string: search_string,
    search_matches: search_matches,
    regex: regex,
    allow_regex_search: true,
    showErrorDrawerButton: true,
    toggleErrorDrawer: props.toggleErrorDrawer,
    registerOmniFunction: props.registerOmniFunction
  }), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
    code_content: code_content,
    am_selected: props.am_selected,
    extraKeys: _extraKeys(),
    readOnly: props.readOnly,
    handleChange: _handleCodeChange,
    saveMe: _saveMe,
    search_term: search_string,
    update_search_state: _update_search_state,
    regex_search: regex,
    setSearchMatches: _setSearchMatches,
    code_container_height: get_new_cc_height(),
    ref: cc_ref
  }))));
}
exports.CodeViewerApp = CodeViewerApp = /*#__PURE__*/(0, _react.memo)(CodeViewerApp);
CodeViewerApp.propTypes = {
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
CodeViewerApp.defaultProps = {
  am_selected: true,
  controlled: false,
  changeResourceName: null,
  changeResourceTitle: null,
  changeResourceProps: null,
  updatePanel: null,
  refreshTab: null,
  closeTab: null
};
function code_viewer_main() {
  function gotProps(the_props) {
    var CodeViewerAppPlus = (0, _theme.withTheme)((0, _modal_react.withDialogs)((0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(CodeViewerApp))));
    var the_element = /*#__PURE__*/_react["default"].createElement(CodeViewerAppPlus, _extends({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));
    var domContainer = document.querySelector('#root');
    ReactDOM.render(the_element, domContainer);
  }
  var target = window.is_repository ? "repository_view_code_in_context" : "view_code_in_context";
  (0, _communication_react.postAjaxPromise)(target, {
    "resource_name": window.resource_name
  }).then(function (data) {
    code_viewer_props(data, null, gotProps, null);
  });
}
if (!window.in_context) {
  code_viewer_main();
}