"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

require("../tactic_css/tactic.scss");

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _merge_viewer_app = require("./merge_viewer_app.js");

var _toaster = require("./toaster.js");

var _communication_react = require("./communication_react.js");

var _error_drawer = require("./error_drawer.js");

var _utilities_react = require("./utilities_react.js");

var _blueprint_navbar = require("./blueprint_navbar");

var _tactic_context = require("./tactic_context.js");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

window.resource_viewer_id = (0, _utilities_react.guid)();
window.main_id = window.resource_viewer_id;

function history_viewer_main() {
  function gotProps(the_props) {
    var HistoryViewerAppPlus = (0, _error_drawer.withErrorDrawer)((0, _toaster.withStatus)(HistoryViewerApp));

    var the_element = /*#__PURE__*/_react["default"].createElement(HistoryViewerAppPlus, _extends({}, the_props, {
      controlled: false,
      initial_theme: window.theme,
      changeName: null
    }));

    var domContainer = document.querySelector('#root');
    ReactDOM.render(the_element, domContainer);
  }

  var get_url = "get_module_code";
  var tsocket = new _merge_viewer_app.MergeViewerSocket("main", 5000);
  (0, _communication_react.postAjaxPromise)("".concat(get_url, "/").concat(window.resource_name), {}).then(function (data) {
    var edit_content = data.the_content;
    (0, _communication_react.postAjaxPromise)("get_checkpoint_dates", {
      "module_name": window.resource_name
    }).then(function (data2) {
      data.history_list = data2.checkpoints;
      data.resource_name = window.resource_name, history_viewer_props(data, null, gotProps);
    })["catch"](_toaster.doFlash);
  })["catch"](_toaster.doFlash);
}

function history_viewer_props(data, registerDirtyMethod, finalCallback) {
  var resource_viewer_id = (0, _utilities_react.guid)();
  var tsocket = new _merge_viewer_app.MergeViewerSocket("main", 5000, {
    resource_viewer_id: resource_viewer_id
  });
  finalCallback({
    resource_viewer_id: resource_viewer_id,
    tsocket: tsocket,
    history_list: data.history_list,
    resource_name: data.resource_name,
    edit_content: data.the_content,
    is_repository: false,
    registerDirtyMethod: registerDirtyMethod
  });
}

var HistoryViewerApp = /*#__PURE__*/function (_React$Component) {
  _inherits(HistoryViewerApp, _React$Component);

  var _super = _createSuper(HistoryViewerApp);

  function HistoryViewerApp(props) {
    var _this;

    _classCallCheck(this, HistoryViewerApp);

    _this = _super.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));

    var self = _assertThisInitialized(_this);

    _this.state = {
      "edit_content": props.edit_content,
      "right_content": "",
      "history_popup_val": props.history_list[0]["updatestring"],
      "history_list": props.history_list
    };
    _this.handleEditChange = _this.handleEditChange.bind(_assertThisInitialized(_this));
    _this.handleSelectChange = _this.handleSelectChange.bind(_assertThisInitialized(_this));
    _this.checkpointThenSaveFromLeft = _this.checkpointThenSaveFromLeft.bind(_assertThisInitialized(_this));
    _this.savedContent = props.edit_content;

    if (!props.controlled) {
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

  _createClass(HistoryViewerApp, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.props.controlled) {
        window.dark_theme = this.state.dark_theme;
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
    key: "handleSelectChange",
    value: function handleSelectChange(new_value) {
      this.state.history_popup_val = new_value;
      var self = this;

      var _iterator = _createForOfIteratorHelper(this.state.history_list),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;

          if (item["updatestring"] == new_value) {
            var updatestring_for_sort = item["updatestring_for_sort"];
            (0, _communication_react.postAjaxPromise)("get_checkpoint_code", {
              "module_name": self.state.resource_name,
              "updatestring_for_sort": updatestring_for_sort
            }).then(function (data) {
              self.setState({
                "right_content": data.module_code
              });
            })["catch"](_toaster.doFlash);
            return;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
  }, {
    key: "handleEditChange",
    value: function handleEditChange(new_code) {
      this.setState({
        "edit_content": new_code
      });
    }
  }, {
    key: "render",
    value: function render() {
      var option_list = this.state.history_list.map(function (item) {
        return item["updatestring"];
      });
      var dark_theme = this.props.controlled ? this.context.dark_theme : this.state.dark_theme;
      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_tactic_context.TacticContext.Provider, {
        value: {
          readOnly: this.props.readOnly,
          tsocket: this.props.tsocket,
          dark_theme: dark_theme,
          setTheme: this.props.controlled ? this.context.setTheme : this._setTheme,
          controlled: this.props.controlled,
          am_selected: this.props.am_selected
        }
      }, !this.props.controlled, " ", /*#__PURE__*/_react["default"].createElement(_blueprint_navbar.TacticNavbar, {
        is_authenticated: window.is_authenticated,
        selected: null,
        show_api_links: true,
        page_id: this.props.resource_viewer_id,
        user_name: window.username
      }), /*#__PURE__*/_react["default"].createElement(_merge_viewer_app.MergeViewerApp, _extends({}, this.props.statusFuncs, {
        resource_viewer_id: this.props.resource_viewer_id,
        resource_name: this.props.resource_name,
        option_list: option_list,
        select_val: this.state.history_popup_val,
        edit_content: this.state.edit_content,
        right_content: this.state.right_content,
        handleSelectChange: this.handleSelectChange,
        handleEditChange: this.handleEditChange,
        dark_theme: this.state.dark_theme,
        saveHandler: this.checkpointThenSaveFromLeft
      }))));
    }
  }, {
    key: "doCheckpointPromise",
    value: function doCheckpointPromise() {
      var self = this;
      return new Promise(function (resolve, reject) {
        (0, _communication_react.postAjax)("checkpoint_module", {
          "module_name": self.props.resource_name
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
    key: "checkpointThenSaveFromLeft",
    value: function checkpointThenSaveFromLeft() {
      var self = this;
      var current_popup_val = this.state.history_popup_val;
      this.doCheckpointPromise().then(function () {
        (0, _communication_react.postAjaxPromise)("get_checkpoint_dates", {
          "module_name": self.state.resource_name
        }).then(function (data) {
          self.setState({
            "history_list": data.checkpoints
          });
        })["catch"](_toaster.doFlash);
        self.saveFromLeft();
      })["catch"](_toaster.doFlash);
    }
  }, {
    key: "saveFromLeft",
    value: function saveFromLeft() {
      var data_dict = {
        "module_name": this.props.resource_name,
        "module_code": this.state.edit_content
      };
      (0, _communication_react.postAjaxPromise)("update_from_left", data_dict).then(_toaster.doFlash)["catch"](_toaster.doFlash);
    }
  }, {
    key: "dirty",
    value: function dirty() {
      return this.state.edit_content != this.savedContent;
    }
  }]);

  return HistoryViewerApp;
}(_react["default"].Component);

HistoryViewerApp.propTypes = {
  resource_name: _propTypes["default"].string,
  history_list: _propTypes["default"].array,
  edit_content: _propTypes["default"].string
};
HistoryViewerApp.contextType = _tactic_context.TacticContext;

if (!window.in_context) {
  history_viewer_main();
}