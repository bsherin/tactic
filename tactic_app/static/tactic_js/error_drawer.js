"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.withErrorDrawer = withErrorDrawer;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _toaster = require("./toaster.js");

var _utilities_react = require("./utilities_react.js");

var _communication_react = require("./communication_react.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

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

function withErrorDrawer(WrappedComponent) {
  var tsocket = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var title = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var position = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "right";
  var size = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : "30%";
  return /*#__PURE__*/function (_React$Component) {
    _inherits(_class, _React$Component);

    var _super = _createSuper(_class);

    function _class(props) {
      var _this;

      _classCallCheck(this, _class);

      _this = _super.call(this, props);
      (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
      _this.tsocket = tsocket;
      _this.state = {
        show_drawer: false,
        contents: [],
        error_drawer_size: size,
        position: position,
        goToLineNumber: null
      };
      _this.socket_counter = null;
      return _this;
    }

    _createClass(_class, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        if (this.tsocket) {
          this.initSocket();
        }
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        if (this.tsocket && this.tsocket.counter != this.socket_counter) {
          this.initSocket();
        }
      }
    }, {
      key: "initSocket",
      value: function initSocket() {
        this.tsocket.socket.on('close-error-drawer', this._close);
        this.tsocket.socket.on('open-error-drawer', this._open);
        this.tsocket.socket.on('add-error-drawer-entry', this._addEntry);
        this.tsocket.socket.on("clear-error-drawer", this._clearAll);
        this.socket_counter = this.tsocket.counter;
      }
    }, {
      key: "_close",
      value: function _close() {
        this.setState({
          show_drawer: false
        });
      }
    }, {
      key: "_open",
      value: function _open() {
        this.setState({
          show_drawer: true
        });
      }
    }, {
      key: "_toggle",
      value: function _toggle() {
        this.setState({
          show_drawer: !this.state.show_drawer
        });
      }
    }, {
      key: "_addEntry",
      value: function _addEntry(entry) {
        var open = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
        this.setState({
          contents: [].concat(_toConsumableArray(this.state.contents), [entry]),
          show_drawer: open
        });
      }
    }, {
      key: "_postAjaxFailure",
      value: function _postAjaxFailure(qXHR, textStatus, errorThrown) {
        this._addEntry({
          title: "Post Ajax Failure: {}".format(textStatus),
          content: errorThrown
        });
      }
    }, {
      key: "_clearAll",
      value: function _clearAll() {
        this.setState({
          contents: [],
          show_drawer: false
        });
      }
    }, {
      key: "_onClose",
      value: function _onClose() {
        this.setState({
          "show_drawer": false
        });
      }
    }, {
      key: "_setGoToLineNumber",
      value: function _setGoToLineNumber(gtfunc) {
        this.setState({
          goToLineNumber: gtfunc
        });
      }
    }, {
      key: "render",
      value: function render() {
        var errorDrawerFuncs = {
          openErrorDrawer: this._open,
          closeErrorDrawer: this._close,
          clearErrorDrawer: this._clearAll,
          addErrorDrawerEntry: this._addEntry,
          postAjaxFailure: this._postAjaxFailure,
          toggleErrorDrawer: this._toggle,
          setGoToLineNumber: this._setGoToLineNumber
        };
        return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement(WrappedComponent, _extends({}, this.props, errorDrawerFuncs, {
          errorDrawerFuncs: errorDrawerFuncs
        })), /*#__PURE__*/_react["default"].createElement(ErrorDrawer, _extends({}, this.state, {
          goToLineNumberFunc: this.state.goToLineNumber,
          title: "Error Drawer",
          size: this.state.error_drawer_size,
          onClose: this._onClose,
          clearAll: this._clearAll
        })));
      }
    }]);

    return _class;
  }(_react["default"].Component);
}

var ErrorItem = /*#__PURE__*/function (_React$Component2) {
  _inherits(ErrorItem, _React$Component2);

  var _super2 = _createSuper(ErrorItem);

  function ErrorItem(props) {
    var _this2;

    _classCallCheck(this, ErrorItem);

    _this2 = _super2.call(this, props);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this2));
    return _this2;
  }

  _createClass(ErrorItem, [{
    key: "_openError",
    value: function _openError() {
      var _this3 = this;

      if (this.props.goToLineNumberFunc) {
        this.props.goToLineNumberFunc(this.props.line_number);
      } else {
        window.blur();
        (0, _communication_react.postWithCallback)("host", "go_to_module_viewer_if_exists", {
          user_id: window.user_id,
          tile_type: this.props.tile_type,
          line_number: this.props.line_number
        }, function (data) {
          if (!data.success) {
            window.open($SCRIPT_ROOT + "/view_location_in_creator/" + _this3.props.tile_type + "/" + _this3.props.line_number);
          } else {
            window.open("", data.window_name);
          }
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var content_dict = {
        __html: this.props.content
      };
      return /*#__PURE__*/_react["default"].createElement(_core.Card, {
        interactive: true,
        elevation: _core.Elevation.TWO,
        style: {
          marginBottom: 5
        }
      }, this.props.title && /*#__PURE__*/_react["default"].createElement("h6", {
        style: {
          overflow: "auto"
        }
      }, /*#__PURE__*/_react["default"].createElement("a", {
        href: "#"
      }, this.props.title)), /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          fontSize: 13,
          overflow: "auto"
        },
        dangerouslySetInnerHTML: content_dict
      }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        text: "show",
        icon: "eye-open",
        small: true,
        onClick: this._openError
      }));
    }
  }]);

  return ErrorItem;
}(_react["default"].Component);

ErrorItem.propTypes = {
  title: _propTypes["default"].string,
  content: _propTypes["default"].string,
  has_link: _propTypes["default"].bool,
  line_number: _propTypes["default"].number,
  goToLineNumberFunc: _propTypes["default"].func,
  tile_type: _propTypes["default"].string
};
ErrorItem.defaultProps = {
  title: null,
  has_link: false,
  line_number: null,
  goToLineNumberfunc: null,
  tile_type: null
};

var ErrorDrawer = /*#__PURE__*/function (_React$Component3) {
  _inherits(ErrorDrawer, _React$Component3);

  var _super3 = _createSuper(ErrorDrawer);

  function ErrorDrawer() {
    _classCallCheck(this, ErrorDrawer);

    return _super3.apply(this, arguments);
  }

  _createClass(ErrorDrawer, [{
    key: "render",
    value: function render() {
      var _this4 = this;

      var items = this.props.contents.map(function (entry, index) {
        var content_dict = {
          __html: entry.content
        };
        var has_link = false;

        if (entry.hasOwnProperty("line_number")) {
          has_link = true;
        }

        return /*#__PURE__*/_react["default"].createElement(ErrorItem, {
          key: index,
          title: entry.title,
          content: entry.content,
          has_link: has_link,
          goToLineNumberFunc: _this4.props.goToLineNumberFunc,
          line_number: entry.line_number,
          tile_type: entry.tile_type
        });
      });
      return /*#__PURE__*/_react["default"].createElement(_core.Drawer, {
        icon: "console",
        title: this.props.title,
        isOpen: this.props.show_drawer,
        position: this.props.position,
        canOutsideClickClose: true,
        onClose: this.props.onClose,
        size: this.props.size
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DRAWER_BODY
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-row justify-content-around mt-2"
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        text: "Clear All",
        onClick: this.props.clearAll
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: _core.Classes.DIALOG_BODY
      }, items)));
    }
  }]);

  return ErrorDrawer;
}(_react["default"].Component);

_toaster.Status.propTypes = {
  show_drawer: _propTypes["default"].bool,
  contents: _propTypes["default"].array,
  title: _propTypes["default"].string,
  onClose: _propTypes["default"].func,
  position: _propTypes["default"].string,
  clearAll: _propTypes["default"].func,
  goToLineNumberFunc: _propTypes["default"].func,
  size: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])
};
_toaster.Status.defaultProps = {
  show_drawer: false,
  contents: [],
  position: "right",
  title: null,
  size: "30%",
  goToLineNumberfunc: null
};