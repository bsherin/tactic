"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactCodemirrorMergeView = void 0;

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

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

var DARK_THEME = window.dark_theme_name;

var ReactCodemirrorMergeView = /*#__PURE__*/function (_React$Component) {
  _inherits(ReactCodemirrorMergeView, _React$Component);

  var _super = _createSuper(ReactCodemirrorMergeView);

  function ReactCodemirrorMergeView(props) {
    var _this;

    _classCallCheck(this, ReactCodemirrorMergeView);

    _this = _super.call(this, props);
    _this.code_container_ref = /*#__PURE__*/_react["default"].createRef();
    _this.handleChange = _this.handleChange.bind(_assertThisInitialized(_this));
    _this.mousetrap = new Mousetrap();
    _this.saved_theme = null;
    return _this;
  }

  _createClass(ReactCodemirrorMergeView, [{
    key: "createMergeArea",
    value: function createMergeArea(codearea) {
      var cmobject = _codemirror["default"].MergeView(codearea, {
        value: this.props.editor_content,
        lineNumbers: true,
        matchBrackets: true,
        highlightSelectionMatches: true,
        autoCloseBrackets: true,
        indentUnit: 4,
        theme: this.context.dark_theme ? DARK_THEME : "default",
        origRight: this.props.right_content
      });

      cmobject.editor().setOption("extraKeys", {
        Tab: function Tab(cm) {
          var spaces = new Array(5).join(" ");
          cm.replaceSelection(spaces);
        },
        "Ctrl-Space": "autocomplete"
      });
      cmobject.editor().on("change", this.handleChange);
      return cmobject;
    }
  }, {
    key: "mergeViewHeight",
    value: function mergeViewHeight() {
      function editorHeight(editor) {
        return editor ? editor.getScrollInfo().height : 0;
      }

      return Math.max(editorHeight(this.cmobject.editor()), editorHeight(this.cmobject.rightOriginal()));
    }
  }, {
    key: "resizeHeights",
    value: function resizeHeights(max_height) {
      var height = Math.min(this.mergeViewHeight(), max_height);
      this.cmobject.editor().setSize(null, height);

      if (this.cmobject.rightOriginal()) {
        this.cmobject.rightOriginal().setSize(null, height);
      }

      this.cmobject.wrap.style.height = height + "px";
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.context.dark_theme != this.saved_theme) {
        if (this.context.dark_theme) {
          this.cmobject.editor().setOption("theme", DARK_THEME);
          this.cmobject.rightOriginal().setOption("theme", DARK_THEME);
        } else {
          this.cmobject.editor().setOption("theme", "default");
          this.cmobject.rightOriginal().setOption("theme", "default");
        }

        this.saved_theme = this.context.dark_theme;
      }

      if (this.cmobject.editor().getValue() != this.props.editor_content) {
        this.cmobject.editor().setValue(this.props.editor_content);
      }

      this.cmobject.rightOriginal().setValue(this.props.right_content);
      this.resizeHeights(this.props.max_height);
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.cmobject = this.createMergeArea(this.code_container_ref.current);
      this.resizeHeights(this.props.max_height);
      this.refreshAreas();
      this.create_keymap();
      this.saved_theme = this.context.dark_theme;
    }
  }, {
    key: "handleChange",
    value: function handleChange(cm, changeObject) {
      this.props.handleEditChange(cm.getValue());
      this.resizeHeights(this.props.max_height);
    }
  }, {
    key: "refreshAreas",
    value: function refreshAreas() {
      this.cmobject.editor().refresh();
      this.cmobject.rightOriginal().refresh();
    }
  }, {
    key: "create_api",
    value: function create_api() {
      var self = this;
      postAjax("get_api_dict", {}, function (data) {
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
    key: "searchCM",
    value: function searchCM() {
      _codemirror["default"].commands.find(this.cmobject);
    }
  }, {
    key: "clearSelections",
    value: function clearSelections() {
      _codemirror["default"].commands.clearSearch(this.cmobject.editor());

      _codemirror["default"].commands.singleSelection(this.cmobject.editor());
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

        this.mousetrap.bind(['command+f'], function (e) {
          self.searchCM();
          e.preventDefault();
        });
      } else {
        _codemirror["default"].keyMap["default"]["Ctrl-S"] = function () {
          self.props.saveMe();
        };

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
        "height": "100%"
      };
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "code-container",
        style: ccstyle,
        ref: this.code_container_ref
      });
    }
  }]);

  return ReactCodemirrorMergeView;
}(_react["default"].Component);

exports.ReactCodemirrorMergeView = ReactCodemirrorMergeView;
ReactCodemirrorMergeView.propTypes = {
  handleEditChange: _propTypes["default"].func,
  editor_content: _propTypes["default"].string,
  right_content: _propTypes["default"].string,
  dark_theme: _propTypes["default"].bool,
  saveMe: _propTypes["default"].func
};
ReactCodemirrorMergeView.contextType = _tactic_context.TacticContext;