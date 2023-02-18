"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactCodemirror = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _core = require("@blueprintjs/core");

var _communication_react = require("./communication_react.js");

var _codemirror = _interopRequireDefault(require("codemirror/lib/codemirror.js"));

require("codemirror/mode/python/python.js");

require("codemirror/lib/codemirror.css");

require("codemirror/addon/merge/merge.js");

require("codemirror/addon/merge/merge.css");

require("codemirror/addon/hint/show-hint.js");

require("codemirror/addon/hint/show-hint.css");

require("codemirror/addon/fold/foldcode.js");

require("codemirror/addon/fold/foldgutter.js");

require("codemirror/addon/fold/indent-fold.js");

require("codemirror/addon/fold/foldgutter.css");

require("codemirror/addon/display/autorefresh.js");

require("codemirror/addon/dialog/dialog.js");

require("codemirror/addon/dialog/dialog.css");

require("codemirror/addon/edit/matchbrackets.js");

require("codemirror/addon/edit/closebrackets.js");

require("codemirror/addon/search/match-highlighter.js");

require("codemirror/theme/material.css");

require("codemirror/theme/nord.css");

require("codemirror/theme/oceanic-next.css");

require("codemirror/theme/pastel-on-dark.css");

require("codemirror/theme/elegant.css");

require("codemirror/theme/neat.css");

require("codemirror/theme/solarized.css");

require("codemirror/theme/juejin.css");

var _utilities_react = require("./utilities_react");

var _toaster = require("./toaster");

require("./autocomplete");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var REGEXTYPE = Object.getPrototypeOf(new RegExp("that"));

function isRegex(ob) {
  return Object.getPrototypeOf(ob) == REGEXTYPE;
}

function countOccurrences(query, the_text) {
  if (isRegex(query)) {
    var split_text = the_text.split(/\r?\n/);
    var total = 0;

    var _iterator = _createForOfIteratorHelper(split_text),
        _step;

    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var str = _step.value;
        total += (str.match(query) || []).length;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    return total;
  } else {
    return the_text.split(query).length - 1;
  }
}

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
    _this._current_codemirror_theme = _this._current_codemirror_theme.bind(_assertThisInitialized(_this));
    _this._foldAll = _this._foldAll.bind(_assertThisInitialized(_this));
    _this._unfoldAll = _this._unfoldAll.bind(_assertThisInitialized(_this));
    _this.clearSelections = _this.clearSelections.bind(_assertThisInitialized(_this));
    _this.mousetrap = new Mousetrap();
    _this.saved_theme = null;
    _this.overlay = null;
    _this.matches = null;
    _this.search_focus_info = null;
    _this.first_render = true;
    return _this;
  }

  _createClass(ReactCodemirror, [{
    key: "_current_codemirror_theme",
    value: function _current_codemirror_theme() {
      return this.props.dark_theme ? this.preferred_themes.preferred_dark_theme : this.preferred_themes.preferred_light_theme;
    }
  }, {
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
        theme: this._current_codemirror_theme(),
        mode: this.props.mode,
        readOnly: this.props.readOnly,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
        foldOptions: {
          minFoldSize: 6
        },
        autoRefresh: true
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
      cmobject.setSize("100%", "100%");
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
      var _this2 = this;

      var self = this;
      (0, _communication_react.postAjaxPromise)('get_preferred_codemirror_themes', {}).then(function (data) {
        self.preferred_themes = data;
        self.cmobject = self.createCMArea(_this2.code_container_ref.current, _this2.props.first_line_number);
        self.cmobject.setValue(_this2.props.code_content);
        self.cmobject.setOption("extra_autocomplete_list", self.props.extra_autocomplete_list);
        self.create_keymap();

        if (self.props.setCMObject != null) {
          self.props.setCMObject(self.cmobject);
        }

        self.saved_theme = self.props.dark_theme;

        self._doHighlight();
      })["catch"](function (data) {
        (0, _toaster.doFlash)(data);
      });
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !(0, _utilities_react.propsAreEqual)(nextProps, this.props, ["extraKeys"]);
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this3 = this;

      if (!this.cmobject) {
        return;
      }

      var self = this;

      if (this.props.dark_theme != this.saved_theme) {
        (0, _communication_react.postAjax)("get_preferred_codemirror_themes", {}, function (data) {
          self.preferred_themes = data;
          self.cmobject.setOption("theme", self._current_codemirror_theme());
          self.saved_theme = _this3.props.dark_theme;
        });
      }

      if (this.props.soft_wrap != prevProps.soft_wrap) {
        this.cmobject.setOption("lineWrapping", this.props.soft_wrap);
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

      this.cmobject.setOption("extra_autocomplete_list", self.props.extra_autocomplete_list);

      this._doHighlight();

      this.set_keymap();
    }
  }, {
    key: "_searchMatcher",
    value: function _searchMatcher(term) {
      var global = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var matcher;

      if (this.props.regex_search) {
        try {
          matcher = global ? new RegExp(term, "g") : new RegExp(term);
        } catch (e) {
          matcher = term;
        }
      } else {
        matcher = term;
      }

      return matcher;
    }
  }, {
    key: "_lineNumberFromSearchNumber",
    value: function _lineNumberFromSearchNumber() {
      var lines = this.props.code_content.split("\n");
      var lnum = 0;
      var mnum = 0;

      var matcher = this._searchMatcher(this.props.search_term);

      var _iterator2 = _createForOfIteratorHelper(lines),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var line = _step2.value;
          var new_matches = (line.match(matcher) || []).length;

          if (new_matches + mnum - 1 >= this.props.current_search_number) {
            return {
              line: lnum,
              match: this.props.current_search_number - mnum
            };
          }

          mnum += new_matches;
          lnum += 1;
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }

      return null;
    }
  }, {
    key: "_doHighlight",
    value: function _doHighlight() {
      var self = this;

      try {
        if (this.props.search_term == null || this.props.search_term == "") {
          this.cmobject.operation(function () {
            self._removeOverlay();
          });
        } else {
          if (this.props.current_search_number != null) {
            this.search_focus_info = _objectSpread({}, this._lineNumberFromSearchNumber());

            if (this.search_focus_info) {
              this._scrollToLine(this.search_focus_info.line);
            }
          } else {
            this.search_focus_info = null;
          }

          this.cmobject.operation(function () {
            self._removeOverlay();

            self._addOverlay(self.props.search_term);
          });
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  }, {
    key: "_scrollToLine",
    value: function _scrollToLine(lnumber) {
      this.cmobject.scrollIntoView({
        line: lnumber,
        "char": 0
      }, 50);
      window.scrollTo(0, 0); // A kludge. Without it whole window can move when switching contexts
    }
  }, {
    key: "_addOverlay",
    value: function _addOverlay(query) {
      var hasBoundary = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var style = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "searchhighlight";
      var focus_style = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "focussearchhighlight";
      // var state = cm.state.matchHighlighter;
      var prev_matches = this.matches;

      var reg = this._searchMatcher(query, true);

      this.matches = countOccurrences(reg, this.props.code_content);

      if (this.props.setSearchMatches && this.matches != prev_matches) {
        this.props.setSearchMatches(this.matches);
      }

      this.overlay = this._makeOverlay(query, hasBoundary, style, focus_style);
      this.cmobject.addOverlay(this.overlay);
    }
  }, {
    key: "_makeOverlay",
    value: function _makeOverlay(query, hasBoundary, style, focus_style) {
      var self = this;
      var last_line = -1;
      var line_counter = -1;

      var matcher = this._searchMatcher(query);

      return {
        token: function token(stream) {
          if (stream.match(matcher) && (!hasBoundary || ReactCodemirror._boundariesAround(stream, hasBoundary))) {
            var lnum = stream.lineOracle.line;

            if (self.search_focus_info && lnum == self.search_focus_info.line) {
              if (lnum != last_line) {
                line_counter = 0;
                last_line = lnum;
              } else {
                line_counter += 1;
              }

              if (line_counter == self.search_focus_info.match) {
                return focus_style;
              }
            } else {
              last_line = -1;
              line_counter = -1;
            }

            return style;
          }

          stream.next();

          if (!isRegex(matcher)) {
            stream.skipTo(query.charAt(0)) || stream.skipToEnd();
          }
        }
      };
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
    key: "_foldAll",
    value: function _foldAll() {
      _codemirror["default"].commands.foldAll(this.cmobject);
    }
  }, {
    key: "_unfoldAll",
    value: function _unfoldAll() {
      _codemirror["default"].commands.unfoldAll(this.cmobject);
    }
  }, {
    key: "clearSelections",
    value: function clearSelections() {
      if (this.props.alt_clear_selections) {
        this.props.alt_clear_selections();
      } else {
        var self = this;
        var to = this.cmobject.getCursor("to");
        this.cmobject.setCursor(to);
      }

      if (this.props.update_search_state) {
        // this.props.update_search_state({search_string: ""}, ()=>{self.cmobject.setCursor(self.cmobject.getCursor())})
        this.props.update_search_state({
          search_string: ""
        });
      }
    }
  }, {
    key: "set_keymap",
    value: function set_keymap() {
      var self = this;

      if (self.props.am_selected) {
        _codemirror["default"].keyMap["default"]["Esc"] = function () {
          self.clearSelections();
        };
      } else {
        delete _codemirror["default"].keyMap["default"].esc;
      }
    }
  }, {
    key: "create_keymap",
    value: function create_keymap() {
      var self = this;
      this.set_keymap();

      var is_mac = _codemirror["default"].keyMap["default"].hasOwnProperty("Cmd-S");

      this.mousetrap.bind(['escape'], function (e) {
        if (!self.props.am_selected) {
          return false;
        }

        self.clearSelections();
        e.preventDefault();
      });
    }
  }, {
    key: "render",
    value: function render() {
      var ccstyle = {
        "height": this.props.code_container_height,
        "width": this.props.code_container_width,
        lineHeight: "21px" // fontSize: "14",
        // fontFamily: DEFAULT_FONT_FAMILY

      };
      var bgstyle = null;

      if (this.props.show_fold_button && this.code_container_ref && this.code_container_ref.current) {
        var cc_rect = this.code_container_ref.current.getBoundingClientRect();

        if (cc_rect.width > 175) {
          bgstyle = {
            position: "absolute",
            left: cc_rect.left + cc_rect.width - 135 - 15,
            top: cc_rect.top + cc_rect.height - 35
          };

          if (this.first_render) {
            bgstyle.top -= 10;
            this.first_render = false;
          }
        }
      }

      return /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, this.props.show_fold_button && bgstyle && /*#__PURE__*/_react["default"].createElement(_core.ButtonGroup, {
        minimal: false,
        style: bgstyle
      }, /*#__PURE__*/_react["default"].createElement(_core.Button, {
        small: true,
        icon: "collapse-all",
        text: "fold",
        onClick: this._foldAll
      }), /*#__PURE__*/_react["default"].createElement(_core.Button, {
        small: true,
        icon: "expand-all",
        text: "unfold",
        onClick: this._unfoldAll
      })), /*#__PURE__*/_react["default"].createElement("div", {
        className: "code-container",
        style: ccstyle,
        ref: this.code_container_ref
      }));
    }
  }], [{
    key: "_boundariesAround",
    value: function _boundariesAround(stream, re) {
      return (!stream.start || !re.test(stream.string.charAt(stream.start - 1))) && (stream.pos == stream.string.length || !re.test(stream.string.charAt(stream.pos)));
    }
  }]);

  return ReactCodemirror;
}(_react["default"].Component);

exports.ReactCodemirror = ReactCodemirror;
ReactCodemirror.propTypes = {
  am_selected: _propTypes["default"].bool,
  handleChange: _propTypes["default"].func,
  show_line_numbers: _propTypes["default"].bool,
  show_fold_button: _propTypes["default"].bool,
  soft_wrap: _propTypes["default"].bool,
  handleBlur: _propTypes["default"].func,
  code_content: _propTypes["default"].string,
  sync_to_prop: _propTypes["default"].bool,
  force_sync_to_prop: _propTypes["default"].bool,
  clear_force_sync: _propTypes["default"].func,
  mode: _propTypes["default"].string,
  saveMe: _propTypes["default"].func,
  first_line_number: _propTypes["default"].number,
  extraKeys: _propTypes["default"].object,
  setCMObject: _propTypes["default"].func,
  searchTerm: _propTypes["default"].string,
  update_search_state: _propTypes["default"].func,
  alt_clear_selections: _propTypes["default"].func,
  regex_search: _propTypes["default"].bool,
  code_container_ref: _propTypes["default"].object,
  code_container_width: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  code_container_height: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  setSearchMatches: _propTypes["default"].func,
  current_search_number: _propTypes["default"].number,
  extra_autocomplete_list: _propTypes["default"].array
};
ReactCodemirror.defaultProps = {
  am_selected: true,
  first_line_number: 1,
  show_line_numbers: true,
  show_fold_button: false,
  soft_wrap: false,
  code_container_height: "100%",
  searchTerm: null,
  update_search_state: null,
  alt_clear_selections: null,
  regex_search: false,
  handleChange: null,
  handleBlur: null,
  sync_to_prop: false,
  force_sync_to_prop: false,
  clear_force_sync: null,
  mode: "python",
  readOnly: false,
  extraKeys: {},
  setCMObject: null,
  code_container_ref: null,
  code_container_width: "100%",
  setSearchMatches: null,
  current_search_number: null,
  extra_autocomplete_list: []
};