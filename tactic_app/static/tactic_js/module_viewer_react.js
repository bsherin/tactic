"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.module_viewer_props = module_viewer_props;
exports.ModuleViewerApp = void 0;

require("../tactic_css/tactic.scss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _resource_viewer_react_app = require("./resource_viewer_react_app.js");

var _tactic_socket = require("./tactic_socket.js");

var _reactCodemirror = require("./react-codemirror.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _error_drawer = require("./error_drawer.js");

var _utilities_react = require("./utilities_react.js");

var _sizing_tools = require("./sizing_tools.js");

var _blueprint_navbar = require("./blueprint_navbar.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function module_viewer_main() {
  function gotProps(the_props) {
    var ModuleViewerAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(ModuleViewerApp));

    var the_element = /*#__PURE__*/_react["default"].createElement(ModuleViewerAppPlus, _extends({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));

    var domContainer = document.querySelector('#root');
    ReactDOM.render(the_element, domContainer);
  }

  var target = window.is_repository ? "repository_view_module_in_context" : "view_module_in_context";
  (0, _communication_react.postAjaxPromise)(target, {
    "resource_name": window.resource_name
  }).then(function (data) {
    module_viewer_props(data, null, gotProps);
  });
}

var controllable_props = ["resource_name", "usable_height", "usable_width"];

function module_viewer_props(data, registerDirtyMethod, finalCallback) {
  var resource_viewer_id = (0, _utilities_react.guid)();
  var tsocket = new _tactic_socket.TacticSocket("main", 5000, resource_viewer_id);
  finalCallback({
    resource_viewer_id: resource_viewer_id,
    tsocket: tsocket,
    split_tags: data.mdata.tags == "" ? [] : data.mdata.tags.split(" "),
    resource_name: data.resource_name,
    the_content: data.the_content,
    notes: data.mdata.notes,
    readOnly: data.read_only,
    is_repository: data.is_repository,
    meta_outer: "#right-div",
    registerDirtyMethod: registerDirtyMethod
  });
}

var ModuleViewerApp = /*#__PURE__*/function (_React$Component) {
  _inherits(ModuleViewerApp, _React$Component);

  var _super = _createSuper(ModuleViewerApp);

  function ModuleViewerApp(props) {
    var _this;

    _classCallCheck(this, ModuleViewerApp);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.top_ref = /*#__PURE__*/_react["default"].createRef();
    _this.cc_ref = /*#__PURE__*/_react["default"].createRef();
    _this.savedContent = props.the_content;
    _this.savedTags = props.split_tags;
    _this.savedNotes = props.notes;

    var self = _assertThisInitialized(_this);

    _this.state = {
      code_content: props.the_content,
      notes: props.notes,
      tags: props.split_tags,
      search_string: ""
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

  _createClass(ModuleViewerApp, [{
    key: "_update_search_state",
    value: function _update_search_state(nstate) {
      this.setState(nstate);
    }
  }, {
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
    key: "_cProp",
    value: function _cProp(pname) {
      return this.props.controlled ? this.props[pname] : this.state[pname];
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
    key: "button_groups",
    get: function get() {
      var _this3 = this;

      var bgs;

      if (this.props.is_repository) {
        bgs = [[{
          "name_text": "Copy",
          "icon_name": "import",
          "click_handler": function click_handler() {
            (0, _resource_viewer_react_app.copyToLibrary)("modules", _this3.state.resource_name);
          },
          tooltip: "Copy to library"
        }]];
      } else {
        bgs = [[{
          "name_text": "Save",
          "icon_name": "saved",
          "click_handler": this._saveMe,
          tooltip: "Save"
        }, {
          "name_text": "Mark",
          "icon_name": "map-marker",
          "click_handler": this._saveAndCheckpoint,
          tooltip: "Save and checkpoint"
        }, {
          "name_text": "SaveAs",
          "icon_name": "floppy-disk",
          "click_handler": this._saveMeAs,
          tooltip: "Save as"
        }, {
          "name_text": "Load",
          "icon_name": "upload",
          "click_handler": this._loadModule,
          tooltip: "Load tile"
        }, {
          "name_text": "Share",
          "icon_name": "share",
          "click_handler": function click_handler() {
            (0, _resource_viewer_react_app.sendToRepository)("tile", _this3._cProp("resource_name"));
          },
          tooltip: "Share to repository"
        }], [{
          "name_text": "History",
          "icon_name": "history",
          "click_handler": this._showHistoryViewer,
          tooltip: "Show history viewer"
        }, {
          "name_text": "Compare",
          "icon_name": "comparison",
          "click_handler": this._showTileDiffer,
          tooltip: "Compare to another tile"
        }]];
      }

      var _iterator = _createForOfIteratorHelper(bgs),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var bg = _step.value;

          var _iterator2 = _createForOfIteratorHelper(bg),
              _step2;

          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var but = _step2.value;
              but.click_handler = but.click_handler.bind(this);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      return bgs;
    }
  }, {
    key: "_handleCodeChange",
    value: function _handleCodeChange(new_code) {
      this.setState({
        "code_content": new_code
      });
    }
  }, {
    key: "_handleStateChange",
    value: function _handleStateChange(state_stuff) {
      this.setState(state_stuff);
    }
  }, {
    key: "_doFlashStopSpinner",
    value: function _doFlashStopSpinner(data) {
      this.props.stopSpinner();
      this.props.clearStatusMessage();
      (0, _toaster.doFlash)(data);
    }
  }, {
    key: "get_new_cc_height",
    value: function get_new_cc_height() {
      var uheight = this._cProp("usable_height");

      if (this.cc_ref && this.cc_ref.current) {
        // This will be true after the initial render
        return uheight - this.cc_ref.current.offsetTop;
      } else {
        return uheight - 100;
      }
    }
  }, {
    key: "_setResourceNameState",
    value: function _setResourceNameState(new_name) {
      if (this.props.controlled) {
        this.props.changeResourceName(new_name);
      } else {
        this.setState({
          resource_name: new_name
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var dark_theme = this.props.controlled ? this.props.dark_theme : this.state.dark_theme;
      var the_context = {
        "readOnly": this.props.readOnly
      };

      var my_props = _objectSpread({}, this.props);

      if (!this.props.controlled) {
        var _iterator3 = _createForOfIteratorHelper(controllable_props),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var prop_name = _step3.value;
            my_props[prop_name] = this.state[prop_name];
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }

      var outer_style = {
        width: "100%",
        height: my_props.usable_height,
        paddingLeft: _sizing_tools.SIDE_MARGIN
      };
      var cc_height = this.get_new_cc_height();
      var outer_class = "resource-viewer-holder";

      if (!this.props.controlled) {
        // outer_class = "resource-viewer-holder";
        if (this.state.dark_theme) {
          outer_class = outer_class + " bp3-dark";
        } else {
          outer_class = outer_class + " light-theme";
        }
      }

      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, !this.props.controlled && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        dark_theme: dark_theme,
        setTheme: this.props.controlled ? this.props.setTheme : this._setTheme,
        selected: null,
        show_api_links: true,
        page_id: this.props.resource_viewer_id,
        user_name: window.username
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: outer_class,
        ref: this.top_ref,
        style: outer_style
      }, /*#__PURE__*/_react["default"].createElement(_resource_viewer_react_app.ResourceViewerApp, _extends({}, my_props, {
        resource_viewer_id: my_props.resource_viewer_id,
        setResourceNameState: this._setResourceNameState,
        refreshTab: this.props.refreshTab,
        closeTab: this.props.closeTab,
        res_type: "tile",
        resource_name: my_props.resource_name,
        button_groups: this.button_groups,
        handleStateChange: this._handleStateChange,
        created: this.props.created,
        notes: this.state.notes,
        tags: this.state.tags,
        saveMe: this._saveMe,
        show_search: true,
        update_search_state: this._update_search_state,
        meta_outer: this.props.meta_outer
      }), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        code_content: this.state.code_content,
        dark_theme: dark_theme,
        readOnly: this.props.readOnly,
        handleChange: this._handleCodeChange,
        saveMe: this._saveMe,
        search_term: this.state.search_string,
        code_container_ref: this.cc_ref,
        code_container_height: cc_height
      }))));
    }
  }, {
    key: "_saveMe",
    value: function _saveMe() {
      this.props.startSpinner();
      this.props.statusMessage("Saving Module");
      var self = this;
      this.doSavePromise().then(self._doFlashStopSpinner)["catch"](self._doFlashStopSpinner);
      return false;
    }
  }, {
    key: "doSavePromise",
    value: function doSavePromise() {
      var self = this;
      return new Promise(function (resolve, reject) {
        var new_code = self.state.code_content;
        var tagstring = self.state.tags.join(" ");
        var tags = self.state.tags; // In case it's modified while saving

        var notes = self.state.notes;
        var result_dict;
        var category;
        category = null;
        result_dict = {
          "module_name": self._cProp("resource_name"),
          "category": category,
          "tags": tagstring,
          "notes": notes,
          "new_code": new_code,
          "last_saved": "viewer"
        };
        (0, _communication_react.postAjax)("update_module", result_dict, function (data) {
          if (data.success) {
            self.savedContent = new_code;
            self.savedTags = tags;
            self.savedNotes = notes;
            data.timeout = 2000;
            resolve(data);
          } else {
            reject(data);
          }
        });
      });
    }
  }, {
    key: "_saveMeAs",
    value: function _saveMeAs(e) {
      (0, _toaster.doFlash)({
        "message": "not implemented yet",
        "timeout": 10
      });
      return false;
    }
  }, {
    key: "_loadModule",
    value: function _loadModule() {
      var self = this;
      this.props.startSpinner();
      this.doSavePromise().then(function () {
        self.props.statusMessage("Loading Module");
        (0, _communication_react.postWithCallback)("host", "load_tile_module_task", {
          "tile_module_name": self._cProp("resource_name"),
          "user_id": user_id
        }, load_success, self.props.resource_viewer_id);
      })["catch"](self._doFlashStopSpinner);

      function load_success(data) {
        if (data.success) {
          data.timeout = 2000;
        }

        self._doFlashStopSpinner(data);

        return false;
      }
    }
  }, {
    key: "_saveAndCheckpoint",
    value: function _saveAndCheckpoint() {
      this.props.startSpinner();
      var self = this;
      this.doSavePromise().then(function () {
        self.props.statusMessage("Checkpointing");
        self.doCheckpointPromise().then(self._doFlashStopSpinner)["catch"](self._doFlashStopSpinner);
      })["catch"](self._doFlashStopSpinner);
      return false;
    }
  }, {
    key: "doCheckpointPromise",
    value: function doCheckpointPromise() {
      var self = this;
      return new Promise(function (resolve, reject) {
        (0, _communication_react.postAjax)("checkpoint_module", {
          "module_name": self._cProp("resource_name")
        }, function (data) {
          if (data.success) {
            resolve(data);
          } else {
            reject(data);
          }
        });
      });
    }
  }, {
    key: "_showHistoryViewer",
    value: function _showHistoryViewer() {
      window.open("".concat($SCRIPT_ROOT, "/show_history_viewer/").concat(this._cProp("resource_name")));
    }
  }, {
    key: "_showTileDiffer",
    value: function _showTileDiffer() {
      window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/").concat(this._cProp("resource_name")));
    }
  }, {
    key: "_dirty",
    value: function _dirty() {
      var current_content = this.state.code_content;
      var tags = this.state.tags;
      var notes = this.state.notes;
      return !(current_content == this.savedContent && tags == this.savedTags && notes == this.savedNotes);
    }
  }]);

  return ModuleViewerApp;
}(_react["default"].Component);

exports.ModuleViewerApp = ModuleViewerApp;
ModuleViewerApp.propTypes = {
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
  dark_theme: _propTypes["default"].bool,
  readOnly: _propTypes["default"].bool,
  is_repository: _propTypes["default"].bool,
  meta_outer: _propTypes["default"].string,
  usable_height: _propTypes["default"].number,
  usable_width: _propTypes["default"].number
};
ModuleViewerApp.defaultProps = {
  am_selected: true,
  controlled: false,
  changeResourceName: null,
  changeResourceTitle: null,
  changeResourceProps: null,
  refreshTab: null,
  closeTab: null,
  updatePanel: null
};

if (!window.in_context) {
  module_viewer_main();
}