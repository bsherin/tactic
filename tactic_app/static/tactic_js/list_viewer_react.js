"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ListViewerApp = void 0;
exports.list_viewer_props = list_viewer_props;
require("../tactic_css/tactic.scss");
var _react = _interopRequireWildcard(require("react"));
var ReactDOM = _interopRequireWildcard(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _resource_viewer_react_app = require("./resource_viewer_react_app.js");
var _tactic_socket = require("./tactic_socket.js");
var _communication_react = require("./communication_react.js");
var _toaster = require("./toaster.js");
var _sizing_tools = require("./sizing_tools.js");
var _error_drawer = require("./error_drawer.js");
var _utilities_react = require("./utilities_react.js");
var _blueprint_navbar = require("./blueprint_navbar");
var _modal_react = require("./modal_react");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
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
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /**
                                                                                                                                                                                                                                                                                                                                                     * Created by bls910
                                                                                                                                                                                                                                                                                                                                                     */
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
function list_viewer_props(data, registerDirtyMethod, finalCallback, registerOmniFunction) {
  var resource_viewer_id = (0, _utilities_react.guid)();
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, resource_viewer_id);
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
var ListEditor = /*#__PURE__*/function (_React$Component) {
  _inherits(ListEditor, _React$Component);
  var _super = _createSuper(ListEditor);
  function ListEditor() {
    _classCallCheck(this, ListEditor);
    return _super.apply(this, arguments);
  }
  _createClass(ListEditor, [{
    key: "render",
    value: function render() {
      var tastyle = {
        resize: "horizontal",
        margin: 2,
        height: this.props.height - LIST_PADDING_TOP
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        id: "listarea-container",
        ref: this.props.outer_ref,
        style: {
          margin: 0,
          paddingTop: LIST_PADDING_TOP
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
        cols: "50",
        style: tastyle,
        disabled: this.props.readOnly,
        onChange: this.props.handleChange,
        value: this.props.the_content
      }));
    }
  }]);
  return ListEditor;
}(_react["default"].Component);
ListEditor.propTypes = {
  the_content: _propTypes["default"].string,
  handleChange: _propTypes["default"].func,
  readOnly: _propTypes["default"].bool,
  outer_ref: _propTypes["default"].object,
  height: _propTypes["default"].number
};
var controllable_props = ["resource_name", "usable_height", "usable_width"];
var ListViewerApp = /*#__PURE__*/function (_React$Component2) {
  _inherits(ListViewerApp, _React$Component2);
  var _super2 = _createSuper(ListViewerApp);
  function ListViewerApp(props) {
    var _this;
    _classCallCheck(this, ListViewerApp);
    _this = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.top_ref = /*#__PURE__*/_react["default"].createRef();
    _this.le_ref = /*#__PURE__*/_react["default"].createRef();
    _this.savedContent = props.the_content;
    _this.savedTags = props.split_tags;
    _this.savedNotes = props.notes;
    var self = _assertThisInitialized(_this);
    _this.state = {
      list_content: props.the_content,
      notes: props.notes,
      tags: props.split_tags
    };
    if (props.controlled) {
      props.registerDirtyMethod(_this._dirty);
    }
    if (!props.controlled) {
      var aheight = (0, _sizing_tools.getUsableDimensions)(true).usable_height_no_bottom;
      var awidth = (0, _sizing_tools.getUsableDimensions)(true).usable_width - 170;
      _this.state.usable_height = aheight;
      _this.state.usable_width = awidth;
      _this.state.dark_theme = props.initial_theme === "dark";
      _this.state.resource_name = props.resource_name;
      window.addEventListener("beforeunload", function (e) {
        if (self._dirty()) {
          e.preventDefault();
          e.returnValue = '';
        }
      });
    }
    return _this;
  }
  _createClass(ListViewerApp, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.stopSpinner();
      if (!this.props.controlled) {
        window.dark_theme = this.state.dark_theme;
        window.addEventListener("resize", this._update_window_dimensions);
        this._update_window_dimensions();
      }
    }
  }, {
    key: "_setTheme",
    value: function _setTheme(dark_theme) {
      var _this2 = this;
      this.setState({
        dark_theme: dark_theme
      }, function () {
        if (!window.in_context) {
          window.dark_theme = _this2.state.dark_theme;
        }
      });
    }
  }, {
    key: "_cProp",
    value: function _cProp(pname) {
      return this.props.controlled ? this.props[pname] : this.state[pname];
    }
  }, {
    key: "menu_specs",
    get: function get() {
      var _this3 = this;
      var ms;
      if (this.props.is_repository) {
        ms = {
          Transfer: [{
            "name_text": "Copy to library",
            "icon_name": "import",
            "click_handler": function click_handler() {
              (0, _resource_viewer_react_app.copyToLibrary)("list", _this3._cProp("resource_name"));
            },
            tooltip: "Copy to library"
          }]
        };
      } else {
        ms = {
          Save: [{
            name_text: "Save",
            icon_name: "saved",
            click_handler: this._saveMe,
            key_bindings: ['ctrl+s'],
            tooltip: "Save"
          }, {
            name_text: "Save As...",
            icon_name: "floppy-disk",
            click_handler: this._saveMeAs,
            tooltip: "Save as"
          }],
          Transfer: [{
            name_text: "Share",
            icon_name: "share",
            click_handler: function click_handler() {
              (0, _resource_viewer_react_app.sendToRepository)("list", _this3._cProp("resource_name"));
            },
            tooltip: "Share to repository"
          }]
        };
      }
      for (var _i = 0, _Object$entries = Object.entries(ms); _i < _Object$entries.length; _i++) {
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2),
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
  }, {
    key: "_setResourceNameState",
    value: function _setResourceNameState(new_name) {
      var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      if (this.props.controlled) {
        this.props.changeResourceName(new_name, callback);
      } else {
        this.setState({
          resource_name: new_name
        }, callback);
      }
    }
  }, {
    key: "_handleStateChange",
    value: function _handleStateChange(state_stuff) {
      this.setState(state_stuff);
    }
  }, {
    key: "_handleListChange",
    value: function _handleListChange(event) {
      this.setState({
        "list_content": event.target.value
      });
    }
  }, {
    key: "_update_window_dimensions",
    value: function _update_window_dimensions() {
      this.setState({
        usable_width: window.innerWidth - this.top_ref.current.offsetLeft,
        usable_height: window.innerHeight - this.top_ref.current.offsetTop
      });
    }
  }, {
    key: "get_new_le_height",
    value: function get_new_le_height() {
      var uheight = this._cProp("usable_height");
      if (this.le_ref && this.le_ref.current) {
        // This will be true after the initial render
        return uheight - this.le_ref.current.offsetTop - _sizing_tools.BOTTOM_MARGIN;
      } else {
        return uheight - 100;
      }
    }
  }, {
    key: "_saveMe",
    value: function _saveMe() {
      if (!this.props.am_selected) {
        return false;
      }
      var new_list_as_string = this.state.list_content;
      var tagstring = this.state.tags.join(" ");
      var notes = this.state.notes;
      var tags = this.state.tags; // In case it's modified wile saving
      var result_dict = {
        "list_name": this._cProp("resource_name"),
        "new_list_as_string": new_list_as_string,
        "tags": tagstring,
        "notes": notes
      };
      var self = this;
      (0, _communication_react.postAjax)("update_list", result_dict, update_success);
      function update_success(data) {
        if (data.success) {
          self.savedContent = new_list_as_string;
          self.savedTags = tags;
          self.savedNotes = notes;
          data.timeout = 2000;
        }
        (0, _toaster.doFlash)(data);
        return false;
      }
    }
  }, {
    key: "_saveMeAs",
    value: function _saveMeAs(e) {
      this.props.startSpinner();
      var self = this;
      (0, _communication_react.postWithCallback)("host", "get_list_names", {
        "user_id": window.user_id
      }, function (data) {
        var checkboxes;
        (0, _modal_react.showModalReact)("Save List As", "New List Name", CreateNewList, "NewList", data["list_names"], null, doCancel);
      }, null, this.props.main_id);
      function doCancel() {
        self.props.stopSpinner();
      }
      function CreateNewList(new_name) {
        var result_dict = {
          "new_res_name": new_name,
          "res_to_copy": self._cProp("resource_name")
        };
        (0, _communication_react.postAjaxPromise)('/create_duplicate_list', result_dict).then(function (data) {
          self._setResourceNameState(new_name, function () {
            self._saveMe();
          });
        })["catch"](_toaster.doFlash);
      }
    }
  }, {
    key: "_dirty",
    value: function _dirty() {
      var current_content = this.state.list_content;
      var tags = this.state.tags;
      var notes = this.state.notes;
      return !(current_content == this.savedContent && tags == this.savedTags && notes == this.savedNotes);
    }
  }, {
    key: "render",
    value: function render() {
      var dark_theme = this.props.controlled ? this.context.dark_theme : this.state.dark_theme;
      var my_props = _objectSpread({}, this.props);
      if (!this.props.controlled) {
        for (var _i2 = 0, _controllable_props = controllable_props; _i2 < _controllable_props.length; _i2++) {
          var prop_name = _controllable_props[_i2];
          my_props[prop_name] = this.state[prop_name];
        }
      }
      var outer_style = {
        width: "100%",
        height: my_props.usable_height,
        paddingLeft: 0,
        position: "relative"
      };
      var outer_class = "resource-viewer-holder";
      if (!this.props.controlled) {
        if (dark_theme) {
          outer_class = outer_class + " bp4-dark";
        } else {
          outer_class = outer_class + " light-theme";
        }
      }
      return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, !this.props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        dark_theme: dark_theme,
        setTheme: this._setTheme,
        selected: null,
        show_api_links: true,
        page_id: this.props.resource_viewer_id,
        user_name: window.username
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: outer_class,
        ref: this.top_ref,
        style: outer_style
      }, /*#__PURE__*/_react["default"].createElement(_resource_viewer_react_app.ResourceViewerApp, _extends({}, my_props, {
        dark_theme: dark_theme,
        setTheme: this.props.controlled ? null : this._setTheme,
        resource_viewer_id: this.props.resource_viewer_id,
        setResourceNameState: this._setResourceNameState,
        refreshTab: this.props.refreshTab,
        closeTab: this.props.closeTab,
        res_type: "list",
        resource_name: my_props.resource_name,
        menu_specs: this.menu_specs,
        handleStateChange: this._handleStateChange,
        created: this.props.created,
        meta_outer: this.props.meta_outer,
        notes: this.state.notes,
        tags: this.state.tags,
        showErrorDrawerButton: false,
        registerOmniFunction: this.props.registerOmniFunction,
        saveMe: this._saveMe
      }), /*#__PURE__*/_react["default"].createElement(ListEditor, {
        the_content: this.state.list_content,
        readOnly: this.props.readOnly,
        outer_ref: this.le_ref,
        height: this.get_new_le_height(),
        handleChange: this._handleListChange
      }))));
    }
  }]);
  return ListViewerApp;
}(_react["default"].Component);
exports.ListViewerApp = ListViewerApp;
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
if (!window.in_context) {
  list_viewer_main();
}