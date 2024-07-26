"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReactCodemirrorMergeView = ReactCodemirrorMergeView;
var _react = _interopRequireWildcard(require("react"));
var _reactHelmet = require("react-helmet");
var _core = require("@blueprintjs/core");
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
var _communication_react = require("./communication_react");
var _settings = require("./settings");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ReactCodemirrorMergeView(props) {
  const code_container_ref = (0, _react.useRef)(null);
  const cmobject = (0, _react.useRef)(null);
  const settingsContext = (0, _react.useContext)(_settings.SettingsContext);
  const hotkeys = (0, _react.useMemo)(() => [{
    combo: "Ctrl+S",
    global: false,
    group: "Merge Viewer",
    label: "Save Code",
    onKeyDown: props.saveMe
  }, {
    combo: "Escape",
    global: false,
    group: "Merge Viewer",
    label: "Clear Selections",
    onKeyDown: e => {
      clearSelections();
      e.preventDefault();
    }
  }, {
    combo: "Ctrl+F",
    global: false,
    group: "Merge Viewer",
    label: "Search Code",
    onKeyDown: e => {
      searchCM();
      e.preventDefault();
    }
  }], [props.saveMe]);
  const {
    handleKeyDown,
    handleKeyUp
  } = (0, _core.useHotkeys)(hotkeys);
  (0, _react.useEffect)(() => {
    let current_theme = _current_codemirror_theme();
    cmobject.current = createMergeArea(code_container_ref.current);
    cmobject.current.editor().setOption("theme", current_theme);
    cmobject.current.rightOriginal().setOption("theme", current_theme);
    resizeHeights(props.max_height);
    refreshAreas();
    create_keymap();
  }, []);
  (0, _react.useEffect)(() => {
    if (!cmobject.current) {
      return;
    }
    if (cmobject.current.editor().getValue() != props.editor_content) {
      cmobject.current.editor().setValue(props.editor_content);
    }
    cmobject.current.rightOriginal().setValue(props.right_content);
    resizeHeights(props.max_height);
  });
  (0, _react.useEffect)(() => {
    if (!cmobject.current) {
      return;
    }
    let current_theme = _current_codemirror_theme();
    cmobject.current.editor().setOption("theme", current_theme);
    cmobject.current.rightOriginal().setOption("theme", current_theme);
  }, [settingsContext.settings.theme, settingsContext.settings.preferred_dark_theme, settingsContext.settings.preferred_light_theme]);
  function isDark() {
    return settingsContext.settingsRef.current.theme == "dark";
  }
  function _current_codemirror_theme() {
    return isDark() ? settingsContext.settingsRef.current.preferred_dark_theme : settingsContext.settingsRef.current.preferred_light_theme;
  }
  function createMergeArea(codearea) {
    let cmobject = _codemirror.default.MergeView(codearea, {
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
      Tab: function (cm) {
        let spaces = new Array(5).join(" ");
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
  async function create_api() {
    let data = await (0, _communication_react.postAjaxPromise)("get_api_dict", {});
    let api_dict_by_category = data.api_dict_by_category;
    let api_dict_by_name = data.api_dict_by_name;
    let ordered_api_categories = data.ordered_api_categories;
    let api_list = [];
    for (let cat of ordered_api_categories) {
      for (let entry of api_dict_by_category[cat]) {
        api_list.push(entry["name"]);
      }
    }
    //noinspection JSUnresolvedVariable
    _codemirror.default.commands.autocomplete = function (cm) {
      //noinspection JSUnresolvedFunction
      cm.showHint({
        hint: _codemirror.default.hint.anyword,
        api_list: api_list,
        extra_autocomplete_list: extra_autocomplete_list
      });
    };
  }
  function searchCM() {
    // CodeMirror.commands.find(cmobject.current)
  }
  function clearSelections() {
    cmobject.current.editor().setSelection({
      line: 0,
      ch: 0
    });
    cmobject.current.rightOriginal().setSelection({
      line: 0,
      ch: 0
    });
  }
  function create_keymap() {
    _codemirror.default.keyMap["default"]["Esc"] = function () {
      clearSelections();
    };
    let is_mac = _codemirror.default.keyMap["default"].hasOwnProperty("Cmd-S");
    if (is_mac) {
      _codemirror.default.keyMap["default"]["Ctrl-S"] = function () {
        props.saveMe();
      };
    } else {
      _codemirror.default.keyMap["default"]["Ctrl-S"] = function () {
        props.saveMe();
      };
    }
    _codemirror.default.keyMap["default"]["Ctrl-F"] = function (e) {
      searchCM();
    };
  }
  let ccstyle = {
    "height": "100%"
  };
  const tTheme = settingsContext.settingsRef.current.theme;
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_reactHelmet.Helmet, null, /*#__PURE__*/_react.default.createElement("link", {
    rel: "stylesheet",
    href: `/static/tactic_css/codemirror_${tTheme}/${_current_codemirror_theme()}.css`,
    type: "text/css"
  })), /*#__PURE__*/_react.default.createElement("div", {
    className: "code-container",
    style: ccstyle,
    ref: code_container_ref,
    tabIndex: "0",
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp
  }));
}
exports.ReactCodemirrorMergeView = ReactCodemirrorMergeView = /*#__PURE__*/(0, _react.memo)(ReactCodemirrorMergeView);