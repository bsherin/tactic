"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyToLibrary = copyToLibrary;
exports.sendToRepository = sendToRepository;
exports.ResourceViewerSocket = exports.ResourceViewerApp = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _blueprint_toolbar = require("./blueprint_toolbar.js");

var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");

var _modal_react = require("./modal_react.js");

var _tactic_socket = require("./tactic_socket.js");

var _resizing_layouts = require("./resizing_layouts.js");

var _communication_react = require("./communication_react.js");

var _utilities_react = require("./utilities_react.js");

var _blueprint_react_widgets = require("./blueprint_react_widgets.js");

var _toaster = require("./toaster.js");

var _sizing_tools = require("./sizing_tools.js");

var _tactic_context = require("./tactic_context.js");

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

var ResourceViewerSocket = /*#__PURE__*/function (_TacticSocket) {
  _inherits(ResourceViewerSocket, _TacticSocket);

  var _super = _createSuper(ResourceViewerSocket);

  function ResourceViewerSocket() {
    _classCallCheck(this, ResourceViewerSocket);

    return _super.apply(this, arguments);
  }

  _createClass(ResourceViewerSocket, [{
    key: "initialize_socket_stuff",
    value: function initialize_socket_stuff() {
      var reconnect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      if (reconnect) {
        this.socket.emit('join', {
          "room": this.extra_args.resource_viewer_id
        });
      }

      if (!window.in_context) {
        this.socket.emit('join', {
          "room": window.user_id
        });
      }
    }
  }]);

  return ResourceViewerSocket;
}(_tactic_socket.TacticSocket);

exports.ResourceViewerSocket = ResourceViewerSocket;

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

  var _super2 = _createSuper(ResourceViewerApp);

  function ResourceViewerApp(props, context) {
    var _this;

    _classCallCheck(this, ResourceViewerApp);

    _this = _super2.call(this, props, context);
    context.tsocket.socket.emit('join', {
      "room": props.resource_viewer_id
    });
    context.tsocket.attachListener('handle-callback', function (task_packet) {
      (0, _communication_react.handleCallback)(task_packet, props.resource_viewer_id);
    });

    if (!context.controlled) {
      context.tsocket.attachListener('close-user-windows', function (data) {
        if (!(data["originator"] == props.resource_viewer_id)) {
          window.close();
        }
      });
      context.tsocket.attachListener("doFlash", function (data) {
        (0, _toaster.doFlash)(data);
      });
    }

    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.top_ref = /*#__PURE__*/_react["default"].createRef();
    _this.savedContent = props.the_content;
    _this.savedTags = props.tags;
    _this.savedNotes = props.notes;

    var self = _assertThisInitialized(_this);

    _this.mousetrap = new Mousetrap();

    _this.mousetrap.bind(['command+s', 'ctrl+s'], function (e) {
      if (self.context.am_selected) {
        self.props.saveMe();
        e.preventDefault();
      }
    });

    var aheight = (0, _sizing_tools.getUsableDimensions)().usable_height;
    var awidth = (0, _sizing_tools.getUsableDimensions)().usable_width - 170;
    _this.state = {
      available_height: aheight,
      available_width: awidth
    };
    _this.state.mounted = false;
    return _this;
  }

  _createClass(ResourceViewerApp, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      // window.addEventListener("resize", this._update_window_dimensions);
      this.setState({
        "mounted": true
      }); // this._update_window_dimensions();

      this.props.stopSpinner();
    }
  }, {
    key: "_handleResize",
    value: function _handleResize(entries) {
      if (this.resizing) return;
      var target;

      if (window.in_context) {
        target = "pane-holder";
      } else {
        target = "resource-viewer-holder";
      }

      var _iterator = _createForOfIteratorHelper(entries),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var entry = _step.value;

          if (entry.target.className.includes(target)) {
            this.setState({
              available_width: entry.contentRect.width - this.top_ref.current.offsetLeft - 30,
              available_height: entry.contentRect.height - this.top_ref.current.offsetTop
            });
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
    key: "render",
    value: function render() {
      var left_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(_blueprint_toolbar.ResourceviewerToolbar, {
        button_groups: this.props.button_groups,
        setResourceNameState: this.props.setResourceNameState,
        resource_name: this.props.resource_name,
        show_search: this.props.show_search,
        search_string: this.props.search_string,
        update_search_state: this.props.update_search_state,
        res_type: this.props.res_type
      }), this.props.children); //let available_height = this.get_new_hp_height(this.hp_ref);


      var right_pane = /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, window.in_context && /*#__PURE__*/_react["default"].createElement(_blueprint_react_widgets.TopRightButtons, {
        refreshTab: this.props.refreshTab,
        closeTab: this.props.closeTab
      }), /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.CombinedMetadata, {
        tags: this.props.tags,
        outer_style: {
          marginTop: 90,
          marginLeft: 20,
          overflow: "auto",
          padding: 15,
          marginRight: 20
        },
        created: this.props.created,
        notes: this.props.notes,
        handleChange: this.props.handleStateChange,
        res_type: this.props.res_type
      }));

      return /*#__PURE__*/_react["default"].createElement(_core.ResizeSensor, {
        onResize: this._handleResize,
        observeParents: true
      }, /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.top_ref,
        style: {
          width: this.state.available_width,
          height: this.state.available_height
        }
      }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
        available_width: this.state.available_width,
        available_height: this.state.available_height,
        left_pane: left_pane,
        show_handle: true,
        right_pane: right_pane,
        am_outer: true
      })));
    }
  }]);

  return ResourceViewerApp;
}(_react["default"].Component);

exports.ResourceViewerApp = ResourceViewerApp;
ResourceViewerApp.propTypes = {
  resource_name: _propTypes["default"].string,
  setResourceNameState: _propTypes["default"].func,
  refreshTab: _propTypes["default"].func,
  closeTab: _propTypes["default"].func,
  res_type: _propTypes["default"].string,
  button_groups: _propTypes["default"].array,
  created: _propTypes["default"].string,
  tags: _propTypes["default"].array,
  notes: _propTypes["default"].string,
  handleStateChange: _propTypes["default"].func,
  meta_outer: _propTypes["default"].string,
  dark_theme: _propTypes["default"].bool,
  tsocket: _propTypes["default"].object,
  saveMe: _propTypes["default"].func,
  children: _propTypes["default"].element
};
ResourceViewerApp.defaultProps = {
  dark_theme: false,
  am_selected: true,
  controlled: false,
  refreshTab: null,
  closeTab: null
};
ResourceViewerApp.contextType = _tactic_context.TacticContext;