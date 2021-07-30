"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("../tactic_css/tactic.scss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _resource_viewer_react_app = require("./resource_viewer_react_app.js");

var _reactCodemirror = require("./react-codemirror.js");

var _resource_viewer_context = require("./resource_viewer_context.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _error_drawer = require("./error_drawer.js");

var _utilities_react = require("./utilities_react.js");

var _sizing_tools = require("./sizing_tools.js");

var _utilities_react2 = require("./utilities_react");

var _blueprint_navbar = require("./blueprint_navbar");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

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

window.resource_viewer_id = (0, _utilities_react2.guid)();
window.main_id = resource_viewer_id;

function module_viewer_main() {
  var get_url = window.is_repository ? "repository_get_module_code" : "get_module_code";
  var get_mdata_url = window.is_repository ? "grab_repository_metadata" : "grab_metadata";
  var tsocket = new _resource_viewer_react_app.ResourceViewerSocket("main", 5000);
  (0, _communication_react.postAjaxPromise)("".concat(get_url, "/").concat(window.resource_name), {}).then(function (data) {
    var the_content = data.the_content;
    var result_dict = {
      "res_type": "tile",
      "res_name": window.resource_name,
      "is_repository": false
    };
    var ModuleViewerAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(ModuleViewerApp, tsocket), tsocket);
    var domContainer = document.querySelector('#root');
    (0, _communication_react.postAjaxPromise)(get_mdata_url, result_dict).then(function (data) {
      var split_tags = data.tags == "" ? [] : data.tags.split(" ");
      ReactDOM.render( /*#__PURE__*/_react["default"].createElement(ModuleViewerAppPlus, {
        the_content: the_content,
        created: data.datestring,
        tags: split_tags,
        notes: data.notes,
        readOnly: window.read_only,
        initial_theme: window.theme,
        is_repository: window.is_repository,
        meta_outer: "#right-div"
      }), domContainer);
    })["catch"](function () {
      ReactDOM.render( /*#__PURE__*/_react["default"].createElement(ModuleViewerAppPlus, {
        the_content: the_content,
        created: "",
        tags: [],
        notes: "",
        initial_theme: window.theme,
        readOnly: window.read_only,
        is_repository: window.is_repository,
        meta_outer: "#right-div"
      }), domContainer);
    });
  })["catch"](_toaster.doFlash);
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
    _this.savedTags = props.tags;
    _this.savedNotes = props.notes;

    var self = _assertThisInitialized(_this);

    window.addEventListener("beforeunload", function (e) {
      if (self.dirty()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
    var aheight = window.innerHeight - _sizing_tools.BOTTOM_MARGIN - _sizing_tools.USUAL_TOOLBAR_HEIGHT;
    var awidth = (0, _sizing_tools.getUsableDimensions)().usable_width;
    _this.state = {
      resource_name: window.resource_name,
      code_content: props.the_content,
      notes: props.notes,
      tags: props.tags,
      usable_width: awidth,
      usable_height: aheight,
      search_string: "",
      dark_theme: _this.props.initial_theme == "dark"
    };
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
      window.addEventListener("resize", this._update_window_dimensions);

      this._update_window_dimensions();

      this.props.stopSpinner();
      this.props.setStatusTheme(this.state.dark_theme);
      window.dark_theme = this.state.dark_theme;
    }
  }, {
    key: "_update_window_dimensions",
    value: function _update_window_dimensions() {
      var uwidth = window.innerWidth - 2 * _sizing_tools.SIDE_MARGIN;
      var uheight = window.innerHeight - _sizing_tools.BOTTOM_MARGIN - _sizing_tools.USUAL_TOOLBAR_HEIGHT;
      this.setState({
        usable_height: uheight,
        usable_width: uwidth
      });
    }
  }, {
    key: "_setTheme",
    value: function _setTheme(dark_theme) {
      var _this2 = this;

      this.setState({
        dark_theme: dark_theme
      }, function () {
        _this2.props.setStatusTheme(dark_theme);

        window.dark_theme = _this2.state.dark_theme;
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
          "icon_name": "share",
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
            (0, _resource_viewer_react_app.sendToRepository)("tile", _this3.state.resource_name);
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
    key: "_handleResize",
    value: function _handleResize(entries) {
      var _iterator3 = _createForOfIteratorHelper(entries),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var entry = _step3.value;

          if (entry.target.id == "root") {
            this.setState({
              usable_width: entry.contentRect.width,
              // usable_height: entry.contentRect.height - BOTTOM_MARGIN - entry.target.getBoundingClientRect().top
              usable_height: window.innerHeight - _sizing_tools.BOTTOM_MARGIN - _sizing_tools.USUAL_TOOLBAR_HEIGHT
            });
            return;
          }
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
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
      if (this.cc_ref && this.cc_ref.current) {
        // This will be true after the initial render
        return window.innerHeight - _sizing_tools.BOTTOM_MARGIN - this.cc_ref.current.offsetTop;
      } else {
        return this.state.usable_height - 100;
      }
    }
  }, {
    key: "_setResourceNameState",
    value: function _setResourceNameState(new_name) {
      this.setState({
        resource_name: new_name
      });
    }
  }, {
    key: "render",
    value: function render() {
      var the_context = {
        "readOnly": this.props.readOnly
      };
      var outer_style = {
        width: "100%",
        height: this.state.usable_height,
        paddingLeft: _sizing_tools.SIDE_MARGIN
      };
      var cc_height = this.get_new_cc_height();
      var outer_class = "resource-viewer-holder";

      if (this.state.dark_theme) {
        outer_class = outer_class + " bp3-dark";
      } else {
        outer_class = outer_class + " light-theme";
      }

      return /*#__PURE__*/_react["default"].createElement(_resource_viewer_context.ViewerContext.Provider, {
        value: the_context
      }, /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        selected: null,
        show_api_links: true,
        dark_theme: this.state.dark_theme,
        set_parent_theme: this._setTheme,
        user_name: window.username
      }), /*#__PURE__*/_react["default"].createElement(_core.ResizeSensor, {
        onResize: this._handleResize,
        observeParents: true
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: outer_class,
        ref: this.top_ref,
        style: outer_style
      }, /*#__PURE__*/_react["default"].createElement(_resource_viewer_react_app.ResourceViewerApp, _extends({}, this.props.statusFuncs, {
        setResourceNameState: this._setResourceNameState,
        res_type: "tile",
        resource_name: this.state.resource_name,
        button_groups: this.button_groups,
        handleStateChange: this._handleStateChange,
        created: this.props.created,
        notes: this.state.notes,
        tags: this.state.tags,
        saveMe: this._saveMe,
        show_search: true,
        update_search_state: this._update_search_state,
        dark_theme: this.state.dark_theme,
        meta_outer: this.props.meta_outer
      }), /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
        code_content: this.state.code_content,
        handleChange: this._handleCodeChange,
        saveMe: this._saveMe,
        readOnly: this.props.readOnly,
        search_term: this.state.search_string,
        dark_theme: this.state.dark_theme,
        code_container_ref: this.cc_ref,
        code_container_height: cc_height
      })))));
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
          "module_name": self.state.resource_name,
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
          "tile_module_name": self.state.resource_name,
          "user_id": user_id
        }, load_success);
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
        statusMessage("Checkpointing");
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
          "module_name": self.state.resource_name
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
      window.open("".concat($SCRIPT_ROOT, "/show_history_viewer/").concat(this.state.resource_name));
    }
  }, {
    key: "_showTileDiffer",
    value: function _showTileDiffer() {
      window.open("".concat($SCRIPT_ROOT, "/show_tile_differ/").concat(this.state.resource_name));
    }
  }, {
    key: "dirty",
    value: function dirty() {
      var current_content = this.state.code_content;
      var tags = this.state.tags;
      var notes = this.state.notes;
      return !(current_content == this.savedContent && tags == this.savedTags && notes == this.savedNotes);
    }
  }]);

  return ModuleViewerApp;
}(_react["default"].Component);

ModuleViewerApp.propTypes = {
  the_content: _propTypes["default"].string,
  created: _propTypes["default"].string,
  tags: _propTypes["default"].array,
  notes: _propTypes["default"].string,
  dark_theme: _propTypes["default"].bool,
  readOnly: _propTypes["default"].bool,
  is_repository: _propTypes["default"].bool,
  meta_outer: _propTypes["default"].string
};
module_viewer_main();