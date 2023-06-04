"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SearchableConsole = void 0;

var _utilities_react = require("./utilities_react");

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _search_form = require("./search_form");

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

var SearchableConsole = /*#__PURE__*/function (_React$PureComponent) {
  _inherits(SearchableConsole, _React$PureComponent);

  var _super = _createSuper(SearchableConsole);

  function SearchableConsole(props, context) {
    var _this;

    _classCallCheck(this, SearchableConsole);

    _this = _super.call(this, props, context);
    (0, _utilities_react.doBinding)(_assertThisInitialized(_this));
    _this.state = {
      search_string: null,
      search_helper_text: null,
      filter: false,
      console_command_value: "",
      livescroll: true
    };
    return _this;
  }

  _createClass(SearchableConsole, [{
    key: "_prepareText",
    value: function _prepareText() {
      var tlist = this.props.log_content.split(/\r?\n/); // let the_text = this.props.log_content.replace(/(?:\r\n|\r|\n)/g, '<br>');

      var the_text = "";

      if (this.state.search_string) {
        if (this.state.filter) {
          var new_tlist = [];

          var _iterator = _createForOfIteratorHelper(tlist),
              _step;

          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var t = _step.value;

              if (t.includes(this.state.search_string)) {
                new_tlist.push(t);
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }

          tlist = new_tlist;
        }

        var _iterator2 = _createForOfIteratorHelper(tlist),
            _step2;

        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var _t = _step2.value;
            the_text = the_text + _t + "<br>";
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }

        var regex = new RegExp(this.state.search_string, "gi");
        the_text = String(the_text).replace(regex, function (matched) {
          return "<mark>" + matched + "</mark>";
        });
      } else {
        var _iterator3 = _createForOfIteratorHelper(tlist),
            _step3;

        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var _t2 = _step3.value;
            the_text = the_text + _t2 + "<br>";
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      }

      return "<div style=\"white-space:pre\">".concat(the_text, "</div>");
    }
  }, {
    key: "_handleSearchFieldChange",
    value: function _handleSearchFieldChange(event) {
      this.setState({
        search_helper_text: null,
        search_string: event.target.value
      });
    }
  }, {
    key: "_handleFilter",
    value: function _handleFilter() {
      this.setState({
        filter: true
      });
    }
  }, {
    key: "_handleUnFilter",
    value: function _handleUnFilter() {
      this.setState({
        search_helper_text: null,
        search_string: null,
        filter: false
      });
    }
  }, {
    key: "_searchNext",
    value: function _searchNext() {}
  }, {
    key: "_structureText",
    value: function _structureText() {}
  }, {
    key: "_searchPrevious",
    value: function _searchPrevious() {}
  }, {
    key: "_setMaxConsoleLines",
    value: function _setMaxConsoleLines(event) {
      this.props.setMaxConsoleLines(parseInt(event.target.value));
    }
  }, {
    key: "_commandSubmit",
    value: function _commandSubmit(e) {
      var _this2 = this;

      e.preventDefault();
      this.props.commandExec(this.state.console_command_value, function () {
        _this2.setState({
          console_command_value: ""
        });
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.state.livescroll && this.props.inner_ref && this.props.inner_ref.current) {
        this.props.inner_ref.current.scrollTo(0, this.props.inner_ref.current.scrollHeight);
      }
    }
  }, {
    key: "_setLiveScroll",
    value: function _setLiveScroll(event) {
      this.setState({
        livescroll: event.target.checked
      });
    }
  }, {
    key: "render",
    value: function render() {
      var the_text = {
        __html: this._prepareText()
      };

      var the_style = _objectSpread({
        whiteSpace: "nowrap",
        fontSize: 12,
        fontFamily: "monospace"
      }, this.props.outer_style);

      if (this.props.commandExec) {
        the_style.height = the_style.height - 40;
      }

      var bottom_info = "575 lines";
      var self = this;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "searchable-console"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "d-flex flex-row",
        style: {
          justifyContent: "space-between"
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.ControlGroup, {
        vertical: false,
        style: {
          marginLeft: 15,
          marginTop: 10
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        onClick: this.props.clearConsole,
        style: {
          height: 30
        },
        minimal: true,
        small: true,
        icon: "trash"
      }), /*#__PURE__*/_react["default"].createElement(_core.HTMLSelect, {
        onChange: this._setMaxConsoleLines,
        large: false,
        minimal: true,
        value: this.props.max_console_lines,
        options: [100, 250, 500, 1000, 2000]
      }), /*#__PURE__*/_react["default"].createElement(_core.Switch, {
        label: "livescroll",
        large: false,
        checked: this.state.livescroll,
        onChange: this._setLiveScroll,
        style: {
          marginBottom: 0,
          marginTop: 5,
          alignSelf: "center",
          height: 30
        }
      })), /*#__PURE__*/_react["default"].createElement(_search_form.FilterSearchForm, {
        search_string: this.state.search_string,
        handleSearchFieldChange: this._handleSearchFieldChange,
        handleFilter: this._handleFilter,
        handleUnFilter: this._handleUnFilter,
        searchNext: null,
        searchPrevious: null,
        search_helper_text: this.state.search_helper_text,
        margin_right: 25
      })), /*#__PURE__*/_react["default"].createElement("div", {
        ref: this.props.inner_ref,
        style: the_style,
        dangerouslySetInnerHTML: the_text
      }), this.props.commandExec && /*#__PURE__*/_react["default"].createElement("form", {
        onSubmit: this._commandSubmit,
        style: {
          position: "relative",
          bottom: 8,
          margin: 10
        }
      }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
        type: "text",
        onChange: function onChange(event) {
          self.setState({
            console_command_value: event.target.value
          });
        },
        small: true,
        large: false,
        leftIcon: "chevron-right",
        fill: true,
        value: this.state.console_command_value
      })));
    }
  }]);

  return SearchableConsole;
}(_react["default"].PureComponent);

exports.SearchableConsole = SearchableConsole;
SearchableConsole.propTypes = {
  log_content: _propTypes["default"].string,
  outer_style: _propTypes["default"].object,
  inner_ref: _propTypes["default"].object,
  clearConsole: _propTypes["default"].func,
  setMaxConsoleLines: _propTypes["default"].func,
  commandExec: _propTypes["default"].func
};
SearchableConsole.defaultProps = {
  log_content: "",
  outer_style: {},
  inner_ref: null,
  setMaxConsoleLines: null,
  clearConsole: null,
  commandExec: null
};