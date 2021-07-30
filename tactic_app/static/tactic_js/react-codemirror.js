"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactCodemirror = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _communication_react = require("./communication_react.js");

var _codemirror = _interopRequireDefault(require("codemirror/lib/codemirror.js"));

require("codemirror/mode/python/python.js");

require("codemirror/lib/codemirror.css");

require("codemirror/addon/merge/merge.js");

require("codemirror/addon/merge/merge.css");

require("codemirror/addon/hint/show-hint.js");

require("codemirror/addon/hint/show-hint.css");

require("codemirror/addon/dialog/dialog.js");

require("codemirror/addon/dialog/dialog.css");

require("codemirror/addon/edit/matchbrackets.js");

require("codemirror/addon/edit/closebrackets.js");

require("codemirror/addon/search/match-highlighter.js");

require("codemirror/theme/material.css");

require("codemirror/theme/nord.css");

require("codemirror/theme/oceanic-next.css");

require("codemirror/theme/pastel-on-dark.css");

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

var DARK_THEME = window.dark_theme_name;

var ReactCodemirror = /*#__PURE__*/function (_React$Component) {
  _inherits(ReactCodemirror, _React$Component);

  var _super = _createSuper(ReactCodemirror);

  function ReactCodemirror(props) {
    var _this;

    _classCallCheck(this, ReactCodemirror);

    _this = _super.call(this, props);

    if (_this.props.code_container_ref) {
      _this.code_container_ref = _this.props.code_container_ref;
    } else {
      _this.code_container_ref = /*#__PURE__*/_react["default"].createRef();
    }

    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.handleBlur = _this.handleBlur.bind(_assertThisInitialized(_this));
    _this.mousetrap = new Mousetrap();

    _this.create_api();

    _this.saved_theme = null;
    _this.overlay = null;
    return _this;
  }

  _createClass(ReactCodemirror, [{
    key: "createCMArea",
    value: function createCMArea(codearea) {
      var first_line_number = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var cmobject = (0, _codemirror["default"])(codearea, {
        lineNumbers: this.props.show_line_numbers,
        lineWrapping: this.props.soft_wrap,
        matchBrackets: true,
        highlightSelectionMatches: true,
        autoCloseBrackets: true,
        indentUnit: 4,
        theme: this.props.dark_theme ? DARK_THEME : "default",
        mode: this.props.mode,
        readOnly: this.props.readOnly
      });

      if (first_line_number != 1) {
        cmobject.setOption("firstLineNumber", first_line_number);
      }

      var all_extra_keys = Object.assign(this.props.extraKeys, {
        Tab: function Tab(cm) {
          var spaces = new Array(5).join(" ");
          cm.replaceSelection(spaces);
        },
        "Ctrl-Space": "autocomplete"
      });
      cmobject.setOption("extraKeys", all_extra_keys);
      cmobject.setSize(null, "100%");
      cmobject.on("change", this.handleChange);
      cmobject.on("blur", this.handleBlur);
      return cmobject;
    }
  }, {
    key: "handleChange",
    value: function handleChange(cm, changeObject) {
      if (this.props.handleChange) {
        this.props.handleChange(cm.getDoc().getValue());
      }
    }
  }, {
    key: "handleBlur",
    value: function handleBlur(cm, changeObject) {
      if (this.props.handleBlur) {
        this.props.handleBlur(cm.getDoc().getValue());
      }
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.cmobject = this.createCMArea(this.code_container_ref.current, this.props.first_line_number);
      this.cmobject.setValue(this.props.code_content);
      this.create_keymap();

      if (this.props.setCMObject != null) {
        this.props.setCMObject(this.cmobject);
      }

      this.saved_theme = this.props.dark_theme;

      this._doHighlight(this.props.search_term);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.props.dark_theme != this.saved_theme) {
        if (this.props.dark_theme) {
          this.cmobject.setOption("theme", DARK_THEME);
        } else {
          this.cmobject.setOption("theme", "default");
        }

        this.saved_theme = this.props.dark_theme;
      }

      if (this.props.sync_to_prop || this.props.force_sync_to_prop) {
        this.cmobject.setValue(this.props.code_content);

        if (this.props.force_sync_to_prop) {
          this.props.clear_force_sync();
        }
      }

      if (this.props.first_line_number != 1) {
        this.cmobject.setOption("firstLineNumber", this.props.first_line_number);
      }

      this.cmobject.refresh();

      this._doHighlight(this.props.search_term);
    }
  }, {
    key: "_doHighlight",
    value: function _doHighlight() {
      var self = this;

      if (this.props.search_term == null || this.props.search_term == "") {
        this.cmobject.operation(function () {
          self._removeOverlay();
        });
      } else {
        this.cmobject.operation(function () {
          self._removeOverlay();

          self._addOverlay(self.props.search_term);
        });
      }
    }
  }, {
    key: "_addOverlay",
    value: function _addOverlay(query) {
      var hasBoundary = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "searchhighlight";
      // var state = cm.state.matchHighlighter;
      this.overlay = this._makeOverlay(query, hasBoundary, style);
      this.cmobject.addOverlay(this.overlay);
    }
  }, {
    key: "_makeOverlay",
    value: function _makeOverlay(query, hasBoundary, style) {
      var self = this;
      return {
        token: function token(stream) {
          if (stream.match(query) && (!hasBoundary || self._boundariesAround(stream, hasBoundary))) return style;
          stream.next();
          stream.skipTo(query.charAt(0)) || stream.skipToEnd();
        }
      };
    }
  }, {
    key: "_boundariesAround",
    value: function _boundariesAround(stream, re) {
      return (!stream.start || !re.test(stream.string.charAt(stream.start - 1))) && (stream.pos == stream.string.length || !re.test(stream.string.charAt(stream.pos)));
    }
  }, {
    key: "_removeOverlay",
    value: function _removeOverlay() {
      if (this.overlay) {
        this.cmobject.removeOverlay(this.overlay);
        this.overlay = null;
      }
    }
  }, {
    key: "searchCM",
    value: function searchCM() {
      _codemirror["default"].commands.find(this.cmobject);
    }
  }, {
    key: "clearSelections",
    value: function clearSelections() {
      _codemirror["default"].commands.clearSearch(this.cmobject);

      _codemirror["default"].commands.singleSelection(this.cmobject);
    }
  }, {
    key: "create_api",
    value: function create_api() {
      var self = this;
      (0, _communication_react.postAjax)("get_api_dict", {}, function (data) {
        self.api_dict_by_category = data.api_dict_by_category;
        self.api_dict_by_name = data.api_dict_by_name;
        self.ordered_api_categories = data.ordered_api_categories;
        self.api_list = [];

        var _iterator = _createForOfIteratorHelper(self.ordered_api_categories),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var cat = _step.value;

            var _iterator2 = _createForOfIteratorHelper(self.api_dict_by_category[cat]),
                _step2;

            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                var entry = _step2.value;
                self.api_list.push(entry["name"]);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
          } //noinspection JSUnresolvedVariable

        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        _codemirror["default"].commands.autocomplete = function (cm) {
          //noinspection JSUnresolvedFunction
          cm.showHint({
            hint: _codemirror["default"].hint.anyword,
            api_list: self.api_list,
            extra_autocomplete_list: self.extra_autocomplete_list
          });
        };
      });
    }
  }, {
    key: "create_keymap",
    value: function create_keymap() {
      var self = this;

      _codemirror["default"].keyMap["default"]["Esc"] = function () {
        self.clearSelections();
      };

      var is_mac = _codemirror["default"].keyMap["default"].hasOwnProperty("Cmd-S");

      this.mousetrap.bind(['escape'], function (e) {
        self.clearSelections();
        e.preventDefault();
      });

      if (is_mac) {
        _codemirror["default"].keyMap["default"]["Cmd-S"] = function () {
          self.props.saveMe();
        };

        this.mousetrap.bind(['command+l'], function (e) {
          // self.loadModule();
          e.preventDefault();
        });
        this.mousetrap.bind(['command+f'], function (e) {
          self.searchCM();
          e.preventDefault();
        });
      } else {
        _codemirror["default"].keyMap["default"]["Ctrl-S"] = function () {
          self.props.saveMe();
        };

        this.mousetrap.bind(['ctrl+l'], function (e) {
          // self.loadModule();
          e.preventDefault();
        });
        this.mousetrap.bind(['ctrl+f'], function (e) {
          self.searchCM();
          e.preventDefault();
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var ccstyle = {
        "height": this.props.code_container_height,
        "width": this.props.code_container_width,
        lineHeight: "21px"
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "code-container",
        style: ccstyle,
        ref: this.code_container_ref
      });
    }
  }]);

  return ReactCodemirror;
}(_react["default"].Component);

exports.ReactCodemirror = ReactCodemirror;
ReactCodemirror.propTypes = {
  handleChange: _propTypes["default"].func,
  show_line_numbers: _propTypes["default"].bool,
  soft_wrap: _propTypes["default"].bool,
  handleBlur: _propTypes["default"].func,
  code_content: _propTypes["default"].string,
  sync_to_prop: _propTypes["default"].bool,
  force_sync_to_prop: _propTypes["default"].bool,
  clear_force_sync: _propTypes["default"].func,
  mode: _propTypes["default"].string,
  dark_theme: _propTypes["default"].bool,
  saveMe: _propTypes["default"].func,
  readOnly: _propTypes["default"].bool,
  first_line_number: _propTypes["default"].number,
  extraKeys: _propTypes["default"].object,
  setCMObject: _propTypes["default"].func,
  searchTerm: _propTypes["default"].string,
  code_container_ref: _propTypes["default"].object,
  code_container_width: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  code_container_height: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])
};
ReactCodemirror.defaultProps = {
  first_line_number: 1,
  show_line_numbers: true,
  soft_wrap: false,
  code_container_height: "100%",
  searchTerm: null,
  handleChange: null,
  handleBlur: null,
  sync_to_prop: false,
  force_sync_to_prop: false,
  clear_force_sync: null,
  dark_theme: false,
  mode: "python",
  readOnly: false,
  extraKeys: {},
  setCMObject: null,
  code_container_ref: null,
  code_container_width: "100%"
};