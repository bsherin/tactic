"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyToLibrary = copyToLibrary;
exports.sendToRepository = sendToRepository;
exports.ResourceViewerApp = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _blueprint_toolbar = require("./blueprint_toolbar.js");

var _blueprint_mdata_fields = require("./blueprint_mdata_fields.js");

var _modal_react = require("./modal_react.js");

var _resizing_layouts = require("./resizing_layouts.js");

var _communication_react = require("./communication_react.js");

var _utilities_react = require("./utilities_react.js");

var _blueprint_react_widgets = require("./blueprint_react_widgets.js");

var _toaster = require("./toaster.js");

var _sizing_tools = require("./sizing_tools.js");

var _tactic_context = require("./tactic_context.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

  function ResourceViewerApp(props, context) {
    var _this;

    _classCallCheck(this, ResourceViewerApp);

    _this = _super.call(this, props, context);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));

    _this.initSocket();

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

    _this.state = {
      mounted: false
    };
    return _this;
  }

  _createClass(ResourceViewerApp, [{
    key: "initSocket",
    value: function initSocket() {
      var self = this;
      this.context.tsocket.attachListener('handle-callback', function (task_packet) {
        (0, _communication_react.handleCallback)(task_packet, self.props.resource_viewer_id);
      });

      if (!this.context.controlled) {
        this.context.tsocket.attachListener('close-user-windows', function (data) {
          if (!(data["originator"] == self.props.resource_viewer_id)) {
            window.close();
          }
        });
        this.context.tsocket.attachListener("doFlash", function (data) {
          (0, _toaster.doFlash)(data);
        });
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.setState({
        "mounted": true
      }); // this._update_window_dimensions();

      this.props.stopSpinner();
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
          width: this.props.usable_width,
          height: this.props.usable_height
        }
      }, /*#__PURE__*/_react["default"].createElement(_resizing_layouts.HorizontalPanes, {
        available_width: this.props.usable_width - 2 * _sizing_tools.SIDE_MARGIN,
        available_height: this.props.usable_height,
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