"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
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
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function ReactCodemirrorMergeView(props) {
  const code_container_ref = (0, _react.useRef)(null);
  const mousetrap = (0, _react.useRef)(new Mousetrap());
  const saved_theme = (0, _react.useRef)(null);
  const preferred_themes = (0, _react.useRef)(null);
  const cmobject = (0, _react.useRef)(null);
  const theme = (0, _react.useContext)(_theme.ThemeContext);
  (0, _react.useEffect)(() => {
    (0, _communication_react.postAjaxPromise)("get_preferred_codemirror_themes", {}).then(data => {
      preferred_themes.current = data;
      cmobject.current = createMergeArea(code_container_ref.current);
      resizeHeights(props.max_height);
      refreshAreas();
      create_keymap();
      saved_theme.current = theme.dark_theme;
    }).catch(e => {
      errorDrawerFuncs.addFromError("Error getting preferred theme", e);
      return;
    });
  }, []);
  (0, _react.useEffect)(() => {
    if (!cmobject.current) {
      return;
    }
    if (theme.dark_theme != saved_theme.current) {
      (0, _communication_react.postAjaxPromise)("get_preferred_codemirror_themes", {}).then(data => {
        preferred_themes.current = data;
        cmobject.current.editor().setOption("theme", _current_codemirror_theme());
        cmobject.current.rightOriginal().setOption("theme", _current_codemirror_theme());
        saved_theme.current = theme.dark_theme;
      }).catch(e => {
        errorDrawerFuncs.addFromError("Error getting preferred theme", e);
        return;
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
    _codemirror.default.commands.find(cmobject.current);
  }
  function clearSelections() {
    _codemirror.default.commands.clearSearch(cmobject.current.editor());
    _codemirror.default.commands.singleSelection(cmobject.current.editor());
  }
  function create_keymap() {
    let self = this;
    _codemirror.default.keyMap["default"]["Esc"] = function () {
      clearSelections();
    };
    let is_mac = _codemirror.default.keyMap["default"].hasOwnProperty("Cmd-S");
    mousetrap.current.bind(['escape'], function (e) {
      clearSelections();
      e.preventDefault();
    });
    if (is_mac) {
      _codemirror.default.keyMap["default"]["Cmd-S"] = function () {
        props.saveMe();
      };
      mousetrap.current.bind(['command+f'], function (e) {
        searchCM();
        e.preventDefault();
      });
    } else {
      _codemirror.default.keyMap["default"]["Ctrl-S"] = function () {
        props.saveMe();
      };
      mousetrap.current.bind(['ctrl+f'], function (e) {
        searchCM();
        e.preventDefault();
      });
    }
  }
  let ccstyle = {
    "height": "100%"
  };
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "code-container",
    style: ccstyle,
    ref: code_container_ref
  });
}
ReactCodemirrorMergeView.propTypes = {
  handleEditChange: _propTypes.default.func,
  editor_content: _propTypes.default.string,
  right_content: _propTypes.default.string,
  saveMe: _propTypes.default.func
};
exports.ReactCodemirrorMergeView = ReactCodemirrorMergeView = /*#__PURE__*/(0, _react.memo)(ReactCodemirrorMergeView);