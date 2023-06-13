"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ResourceViewerApp = void 0;
exports.copyToLibrary = copyToLibrary;
exports.sendToRepository = sendToRepository;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _tactic_omnibar = require("./tactic_omnibar");
var _key_trap = require("./key_trap");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");
var _modal_react = require("./modal_react.js");
var _resizing_layouts = require("./resizing_layouts.js");
var _communication_react = require("./communication_react.js");
var _utilities_react = require("./utilities_react.js");
var _menu_utilities = require("./menu_utilities.js");
var _toaster = require("./toaster.js");
var _sizing_tools = require("./sizing_tools.js");
var _library_widgets = require("./library_widgets");
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
function copyToLibrary(res_type, resource_name) {
  $.getJSON($SCRIPT_ROOT + "get_resource_names/".concat(res_type), function (data) {
    (0, _modal_react.showModalReact)("Import ".concat(res_type), "New ".concat(res_type, " Name"), ImportResource, resource_name, data["resource_names"]);
  });
  function ImportResource(new_name) {
    var result_dict = {
      "res_type": res_type,
      "res_name": resource_name,
      "new_res_name": new_name
    };
    (0, _communication_react.postAjax)("copy_from_repository", result_dict, _toaster.doFlashAlways);
  }
}
function sendToRepository(res_type, resource_name) {
  $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/".concat(res_type), function (data) {
    (0, _modal_react.showModalReact)("Share ".concat(res_type), "New ".concat(res_type, " Name"), ShareResource, resource_name, data["resource_names"]);
  });
  function ShareResource(new_name) {
    var result_dict = {
      "res_type": res_type,
      "res_name": resource_name,
      "new_res_name": new_name
    };
    (0, _communication_react.postAjax)("send_to_repository", result_dict, _toaster.doFlashAlways);
  }
}
var ResourceViewerApp = /*#__PURE__*/function (_React$Component) {
  _inherits(ResourceViewerApp, _React$Component);
  var _super = _createSuper(ResourceViewerApp);
  function ResourceViewerApp(props) {
    var _this;
    _classCallCheck(this, ResourceViewerApp);
    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.initSocket();
    _this.top_ref = /*#__PURE__*/_react["default"].createRef();
    _this.savedContent = props.the_content;
    _this.savedTags = props.tags;
    _this.savedNotes = props.notes;
    var self = _assertThisInitialized(_this);
    _this.state = {
      mounted: false
    };
    if (_this.props.registerOmniFunction) {
      _this.props.registerOmniFunction(_this._omniFunction);
    }
    _this.omniGetters = {};
    if (!window.in_context) {
      _this.key_bindings = [[["ctrl+space"], _this._showOmnibar]];
      _this.state.showOmnibar = false;
    }
    return _this;
  }
  _createClass(ResourceViewerApp, [{
    key: "initSocket",
    value: function initSocket() {
      var self = this;
      this.props.tsocket.attachListener('handle-callback', function (task_packet) {
        (0, _communication_react.handleCallback)(task_packet, self.props.resource_viewer_id);
      });
      this.props.tsocket.attachListener("doFlash", function (data) {
        (0, _toaster.doFlash)(data);
      });
      if (!this.props.controlled) {
        this.props.tsocket.attachListener('close-user-windows', function (data) {
          if (!(data["originator"] == self.props.resource_viewer_id)) {
            window.close();
          }
        });
        this.props.tsocket.attachListener("doFlashUser", function (data) {
          (0, _toaster.doFlash)(data);
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "mounted": true
      });
      // this._update_window_dimensions();
      this.props.stopSpinner();
    }
  }, {
    key: "_showOmnibar",
    value: function _showOmnibar() {
      this.setState({
        showOmnibar: true
      });
    }
  }, {
    key: "_closeOmnibar",
    value: function _closeOmnibar() {
      this.setState({
        showOmnibar: false
      });
    }
  }, {
    key: "_omniFunction",
    value: function _omniFunction() {
      var omni_items = [];
      for (var ogetter in this.omniGetters) {
        omni_items = omni_items.concat(this.omniGetters[ogetter]());
      }
      return omni_items;
    }
  }, {
    key: "_registerOmniGetter",
    value: function _registerOmniGetter(name, the_function) {
      this.omniGetters[name] = the_function;
    }
  }, {
    key: "render",
    value: function render() {
      var left_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, this.props.show_search && /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 5,
          marginTop: 15
        }
      }, /*#__PURE__*/_react["default"].createElement(_library_widgets.SearchForm, {
        update_search_state: this.props.update_search_state,
        search_string: this.props.search_string,
        regex: this.props.regex,
        search_ref: this.props.search_ref,
        allow_regex: this.props.allow_regex_search,
        number_matches: this.props.search_matches
      })), this.props.children);
      //let available_height = this.get_new_hp_height(this.hp_ref);

      var right_pane = /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
        tags: this.props.tags,
        outer_style: {
          marginTop: 0,
          marginLeft: 10,
          overflow: "auto",
          padding: 15,
          marginRight: 0,
          height: "100%"
        },
        created: this.props.created,
        notes: this.props.notes,
        icon: this.props.mdata_icon,
        readOnly: this.props.readOnly,
        handleChange: this.props.handleStateChange,
        pane_type: this.props.res_type
      }));
      return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_menu_utilities.TacticMenubar, {
        menu_specs: this.props.menu_specs,
        dark_theme: this.props.dark_theme,
        showRefresh: window.in_context,
        showClose: window.in_context,
        refreshTab: this.props.refreshTab,
        closeTab: this.props.closeTab,
        resource_name: this.props.resource_name,
        showErrorDrawerButton: this.props.showErrorDrawerButton,
        toggleErrorDrawer: this.props.toggleErrorDrawer,
        registerOmniGetter: this._registerOmniGetter
      }), /*#__PURE__*/_react["default"].createElement(_core.ResizeSensor, {
        onResize: this._handleResize,
        observeParents: true
      }, /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.top_ref,
        style: {
          width: this.props.usable_width,
          height: this.props.usable_height,
          marginLeft: 15,
          marginTop: 0
        }
      }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
        available_width: this.props.usable_width - _sizing_tools.SIDE_MARGIN,
        available_height: this.props.usable_height,
        left_pane: left_pane,
        show_handle: true,
        right_pane: right_pane,
        initial_width_fraction: .65,
        am_outer: true
      }))), !window.in_context && /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_tactic_omnibar.TacticOmnibar, {
        omniGetters: [this._omniFunction],
        showOmnibar: this.state.showOmnibar,
        closeOmnibar: this._closeOmnibar,
        is_authenticated: window.is_authenticated,
        dark_theme: this.props.dark_theme,
        setTheme: this.props.setTheme
      }), /*#__PURE__*/_react["default"].createElement(_key_trap.KeyTrap, {
        global: true,
        bindings: this.key_bindings
      })));
    }
  }]);
  return ResourceViewerApp;
}(_react["default"].Component);
exports.ResourceViewerApp = ResourceViewerApp;
ResourceViewerApp.propTypes = {
  resource_name: _propTypes["default"].string,
  search_string: _propTypes["default"].string,
  search_matches: _propTypes["default"].number,
  setResourceNameState: _propTypes["default"].func,
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func,
  res_type: _propTypes["default"].string,
  menu_specs: _propTypes["default"].object,
  created: _propTypes["default"].string,
  tags: _propTypes["default"].array,
  notes: _propTypes["default"].string,
  mdata_icon: _propTypes["default"].string,
  handleStateChange: _propTypes["default"].func,
  meta_outer: _propTypes["default"].string,
  dark_theme: _propTypes["default"].bool,
  tsocket: _propTypes["default"].object,
  saveMe: _propTypes["default"].func,
  children: _propTypes["default"].element,
  show_search: _propTypes["default"].bool,
  update_search_state: _propTypes["default"].func,
  search_ref: _propTypes["default"].object,
  showErrorDrawerButton: _propTypes["default"].bool,
  toggleErrorDrawer: _propTypes["default"].func,
  allow_regex_search: _propTypes["default"].bool,
  regex: _propTypes["default"].bool
};
ResourceViewerApp.defaultProps = {
  search_string: "",
  search_matches: null,
  showErrorDrawerButton: false,
  toggleErrorDrawer: null,
  dark_theme: false,
  am_selected: true,
  controlled: false,
  refreshTab: null,
  closeTab: null,
  search_ref: null,
  allow_regex_search: false,
  regex: false,
  mdata_icon: null
};