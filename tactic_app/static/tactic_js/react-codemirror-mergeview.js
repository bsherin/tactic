"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactCodemirrorMergeView = ReactCodemirrorMergeView;
var _propTypes = _interopRequireDefault(require("prop-types"));
var _react = _interopRequireWildcard(require("react"));
var _codemirror = _interopRequireDefault(require("codemirror/lib/codemirror"));
require("codemirror/mode/python/python");
require("codemirror/lib/codemirror.css");
require("codemirror/addon/merge/merge");
require("codemirror/addon/merge/merge.css");
require("codemirror/addon/hint/show-hint");
require("codemirror/addon/hint/show-hint.css");
require("codemirror/addon/dialog/dialog");
require("codemirror/addon/dialog/dialog.css");
require("codemirror/addon/edit/matchbrackets");
require("codemirror/addon/edit/closebrackets");
require("codemirror/addon/search/match-highlighter");
require("codemirror/theme/material.css");
require("codemirror/theme/nord.css");
require("codemirror/theme/oceanic-next.css");
require("codemirror/theme/pastel-on-dark.css");
require("codemirror/theme/elegant.css");
require("codemirror/theme/neat.css");
require("codemirror/theme/solarized.css");
require("codemirror/theme/juejin.css");
var _communication_react = require("./communication_react");
var _theme = require("./theme");
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ReactCodemirrorMergeView(props) {
  var code_container_ref = (0, _react.useRef)(null);
  var mousetrap = (0, _react.useRef)(new Mousetrap());
  var saved_theme = (0, _react.useRef)(null);
  var preferred_themes = (0, _react.useRef)(null);
  var cmobject = (0, _react.useRef)(null);
  var themer = (0, _react.useContext)(_theme.ThemeContext);
  (0, _react.useEffect)(function () {
    (0, _communication_react.postAjax)("get_preferred_codemirror_themes", {}, function (data) {
      preferred_themes.current = data;
      cmobject.current = createMergeArea(code_container_ref.current);
      resizeHeights(props.max_height);
      refreshAreas();
      create_keymap();
      saved_theme.current = theme.dark_theme;
    });
  }, []);
  (0, _react.useEffect)(function () {
    if (!cmobject.current) {
      return;
    }
    if (theme.dark_theme != saved_theme.current) {
      (0, _communication_react.postAjax)("get_preferred_codemirror_themes", {}, function (data) {
        preferred_themes.current = data;
        cmobject.current.editor().setOption("theme", _current_codemirror_theme());
        cmobject.current.rightOriginal().setOption("theme", _current_codemirror_theme());
        saved_theme.current = theme.dark_theme;
      });
    }
    if (cmobject.current.editor().getValue() != props.editor_content) {
      cmobject.current.editor().setValue(props.editor_content);
    }
    cmobject.current.rightOriginal().setValue(props.right_content);
    resizeHeights(props.max_height);
  });
  function _current_codemirror_theme() {
    return theme.dark_theme ? preferred_themes.current.preferred_dark_theme : preferred_themes.current.preferred_light_theme;
  }
  function createMergeArea(codearea) {
    var cmobject = _codemirror["default"].MergeView(codearea, {
      value: props.editor_content,
      lineNumbers: true,
      matchBrackets: true,
      highlightSelectionMatches: true,
      autoCloseBrackets: true,
      indentUnit: 4,
      theme: _current_codemirror_theme(),
      origRight: props.right_content
    });
    cmobject.editor().setOption("extraKeys", {
      Tab: function Tab(cm) {
        var spaces = new Array(5).join(" ");
        cm.replaceSelection(spaces);
      },
      "Ctrl-Space": "autocomplete"
    });
    cmobject.editor().on("change", handleChange);
    return cmobject;
  }
  function mergeViewHeight() {
    function editorHeight(editor) {
      return editor ? editor.getScrollInfo().height : 0;
    }
    return Math.max(editorHeight(cmobject.current.editor()), editorHeight(cmobject.current.rightOriginal()));
  }
  function resizeHeights(max_height) {
    var height = Math.min(mergeViewHeight(), max_height);
    cmobject.current.editor().setSize(null, height);
    if (cmobject.current.rightOriginal()) {
      cmobject.current.rightOriginal().setSize(null, height);
    }
    cmobject.current.wrap.style.height = height + "px";
  }
  function handleChange(cm, changeObject) {
    props.handleEditChange(cm.getValue());
    resizeHeights(props.max_height);
  }
  function refreshAreas() {
    cmobject.current.editor().refresh();
    cmobject.current.rightOriginal().refresh();
  }
  function create_api() {
    var self = this;
    (0, _communication_react.postAjax)("get_api_dict", {}, function (data) {
      var api_dict_by_category = data.api_dict_by_category;
      var api_dict_by_name = data.api_dict_by_name;
      var ordered_api_categories = data.ordered_api_categories;
      var api_list = [];
      var _iterator = _createForOfIteratorHelper(ordered_api_categories),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var cat = _step.value;
          var _iterator2 = _createForOfIteratorHelper(api_dict_by_category[cat]),
            _step2;
          try {
            for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
              var entry = _step2.value;
              api_list.push(entry["name"]);
            }
          } catch (err) {
            _iterator2.e(err);
          } finally {
            _iterator2.f();
          }
        }
        //noinspection JSUnresolvedVariable
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      _codemirror["default"].commands.autocomplete = function (cm) {
        //noinspection JSUnresolvedFunction
        cm.showHint({
          hint: _codemirror["default"].hint.anyword,
          api_list: api_list,
          extra_autocomplete_list: extra_autocomplete_list
        });
      };
    });
  }
  function searchCM() {
    _codemirror["default"].commands.find(cmobject.current);
  }
  function clearSelections() {
    _codemirror["default"].commands.clearSearch(cmobject.current.editor());
    _codemirror["default"].commands.singleSelection(cmobject.current.editor());
  }
  function create_keymap() {
    var self = this;
    _codemirror["default"].keyMap["default"]["Esc"] = function () {
      clearSelections();
    };
    var is_mac = _codemirror["default"].keyMap["default"].hasOwnProperty("Cmd-S");
    mousetrap.current.bind(['escape'], function (e) {
      clearSelections();
      e.preventDefault();
    });
    if (is_mac) {
      _codemirror["default"].keyMap["default"]["Cmd-S"] = function () {
        props.saveMe();
      };
      mousetrap.current.bind(['command+f'], function (e) {
        searchCM();
        e.preventDefault();
      });
    } else {
      _codemirror["default"].keyMap["default"]["Ctrl-S"] = function () {
        props.saveMe();
      };
      mousetrap.current.bind(['ctrl+f'], function (e) {
        searchCM();
        e.preventDefault();
      });
    }
  }
  var ccstyle = {
    "height": "100%"
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "code-container",
    style: ccstyle,
    ref: code_container_ref
  });
}
ReactCodemirrorMergeView.propTypes = {
  handleEditChange: _propTypes["default"].func,
  editor_content: _propTypes["default"].string,
  right_content: _propTypes["default"].string,
  saveMe: _propTypes["default"].func
};
exports.ReactCodemirrorMergeView = ReactCodemirrorMergeView = /*#__PURE__*/(0, _react.memo)(ReactCodemirrorMergeView);