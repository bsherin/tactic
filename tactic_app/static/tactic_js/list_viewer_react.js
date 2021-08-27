"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list_viewer_in_context = list_viewer_in_context;

require("../tactic_css/tactic.scss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _resource_viewer_react_app = require("./resource_viewer_react_app.js");

var _resource_viewer_context = require("./resource_viewer_context.js");

var _communication_react = require("./communication_react.js");

var _toaster = require("./toaster.js");

var _sizing_tools = require("./sizing_tools.js");

var _error_drawer = require("./error_drawer.js");

var _utilities_react = require("./utilities_react.js");

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

function list_viewer_main() {
  function gotElement(the_element) {
    var domContainer = document.querySelector('#root');
    ReactDOM.render(the_element, domContainer);
  }

  (0, _communication_react.postAjaxPromise)("view_list_in_context", {
    "resource_name": window.resource_name
  }).then(function (data) {
    list_viewer_in_context(data, null, gotElement);
  });
}

function list_viewer_in_context(data, registerThemeSetter, finalCallback) {
  var resource_viewer_id = (0, _utilities_react2.guid)();

  if (!window.in_context) {
    window.resource_viewer_id = (0, _utilities_react2.guid)();
    window.main_id = resource_viewer_id; // needed for postWithCallback
  }

  var tsocket = new _resource_viewer_react_app.ResourceViewerSocket("main", 5000, {
    resource_viewer_id: resource_viewer_id
  });
  var ListViewerAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(ListViewerApp, tsocket));
  var split_tags = data.mdata.tags == "" ? [] : data.mdata.tags.split(" ");
  finalCallback( /*#__PURE__*/_react["default"].createElement(ListViewerAppPlus, {
    resource_name: data.resource_name,
    the_content: data.the_content,
    registerThemeSetter: registerThemeSetter,
    created: data.mdata.datestring,
    initial_theme: window.theme,
    tags: split_tags,
    notes: data.mdata.notes,
    readOnly: data.read_only,
    is_repository: false,
    meta_outer: "#right-div"
  }));
}

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
        height: this.props.height,
        margin: 2
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        id: "listarea-container",
        ref: this.props.outer_ref
      }, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
        cols: "50",
        style: tastyle,
        disabled: this.context.readOnly,
        onChange: this.props.handleChange,
        value: this.props.the_content
      }));
    }
  }]);

  return ListEditor;
}(_react["default"].Component);

ListEditor.contextType = _resource_viewer_context.ViewerContext;
ListEditor.propTypes = {
  the_content: _propTypes["default"].string,
  handleChange: _propTypes["default"].func,
  readOnly: _propTypes["default"].bool,
  outer_ref: _propTypes["default"].object,
  height: _propTypes["default"].number
};

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
    _this.savedTags = props.tags;
    _this.savedNotes = props.notes;

    var self = _assertThisInitialized(_this);

    window.addEventListener("beforeunload", function (e) {
      if (self.dirty()) {
        e.preventDefault();
        e.returnValue = '';
      }
    });
    var aheight = (0, _sizing_tools.getUsableDimensions)().usable_height;
    var awidth = (0, _sizing_tools.getUsableDimensions)().usable_width;
    _this.state = {
      resource_name: props.resource_name,
      list_content: props.the_content,
      notes: props.notes,
      tags: props.tags,
      usable_width: awidth,
      usable_height: aheight,
      dark_theme: _this.props.initial_theme == "dark"
    };
    return _this;
  }

  _createClass(ListViewerApp, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.stopSpinner();

      if (window.in_context) {
        this.props.registerThemeSetter(this._setTheme);
      } // window.dark_theme = this.state.dark_theme

    }
  }, {
    key: "_setTheme",
    value: function _setTheme(dark_theme) {
      var _this2 = this;

      this.setState({
        dark_theme: dark_theme
      }, function () {
        _this2.props.setStatusTheme(dark_theme);

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
          "icon_name": "share",
          "click_handler": function click_handler() {
            (0, _resource_viewer_react_app.copyToLibrary)("list", _this3.state.resource_name);
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
          "name_text": "SaveAs",
          "icon_name": "floppy-disk",
          "click_handler": this._saveMeAs,
          tooltip: "Save As"
        }, {
          "name_text": "Share",
          "icon_name": "share",
          "click_handler": function click_handler() {
            (0, _resource_viewer_react_app.sendToRepository)("list", _this3.state.resource_name);
          },
          tooltip: "Share to repository"
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
              usable_height: entry.contentRect.height - _sizing_tools.BOTTOM_MARGIN - entry.target.getBoundingClientRect().top
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
    key: "get_new_le_height",
    value: function get_new_le_height() {
      if (this.le_ref && this.le_ref.current) {
        // This will be true after the initial render
        return this.state.usable_height - this.le_ref.current.offsetTop;
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
      var outer_class = "resource-viewer-holder";

      if (!window.in_context) {
        if (this.state.dark_theme) {
          outer_class = outer_class + " bp3-dark";
        } else {
          outer_class = outer_class + " light-theme";
        }
      }

      return /*#__PURE__*/_react["default"].createElement(_resource_viewer_context.ViewerContext.Provider, {
        value: the_context
      }, !window.in_context && /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
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
        resource_name: this.state.resource_name,
        created: this.props.created,
        meta_outer: this.props.meta_outer,
        readOnly: window.read_only,
        res_type: "list",
        button_groups: this.button_groups,
        handleStateChange: this._handleStateChange,
        notes: this.state.notes,
        tags: this.state.tags,
        dark_theme: this.state.dark_theme,
        saveMe: this._saveMe
      }), /*#__PURE__*/_react["default"].createElement(ListEditor, {
        the_content: this.state.list_content,
        outer_ref: this.le_ref,
        height: this.get_new_le_height(),
        handleChange: this._handleListChange
      })))));
    }
  }, {
    key: "_saveMe",
    value: function _saveMe() {
      var new_list_as_string = this.state.list_content;
      var tagstring = this.state.tags.join(" ");
      var notes = this.state.notes;
      var tags = this.state.tags; // In case it's modified wile saving

      var result_dict = {
        "list_name": this.state.resource_name,
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
      (0, _toaster.doFlash)({
        "message": "not implemented yet",
        "timeout": 10
      });
      return false;
    }
  }, {
    key: "dirty",
    value: function dirty() {
      var current_content = this.state.list_content;
      var tags = this.state.tags;
      var notes = this.state.notes;
      return !(current_content == this.savedContent && tags == this.savedTags && notes == this.savedNotes);
    }
  }]);

  return ListViewerApp;
}(_react["default"].Component);

ListViewerApp.propTypes = {
  the_content: _propTypes["default"].string,
  created: _propTypes["default"].string,
  tags: _propTypes["default"].array,
  notes: _propTypes["default"].string,
  readOnly: _propTypes["default"].bool,
  is_repository: _propTypes["default"].bool,
  meta_outer: _propTypes["default"].string
};

if (!window.in_context) {
  list_viewer_main();
}