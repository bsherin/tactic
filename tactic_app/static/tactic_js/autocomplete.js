"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderAutoCompleteElement = renderAutoCompleteElement;
var _react = _interopRequireDefault(require("react"));
var _client = require("react-dom/client");
var _communication_react = require("./communication_react");
var _codemirror = _interopRequireDefault(require("codemirror/lib/codemirror.js"));
var _core = require("@blueprintjs/core");
const EXTRAWORDS_LIST = ["global_import", "Collection", "Collection", "Collection.document_names", "Collection.current_docment", "Collection.column", "Collection.tokenize", "Collection.detach", "Collection.rewind", "Library", "Library.collections", "Library.lists", "Library.functions", "Library.classes", "Settings", "Settings.names", "Tiles", "Pipes"];
var EXTRAWORDS = [];
for (let w of EXTRAWORDS_LIST) {
  EXTRAWORDS.push({
    text: w,
    render: renderAutoCompleteApiElement
  });
}
const WORD = /[\w\.$]+/;
const RANGE = 500;
var tactic_commands = [];
function _anyWord(editor, options) {
  function ffunc(el, curWord) {
    return typeof el == "string" ? el.startsWith(curWord || '') : el.text.startsWith(curWord || '');
  }
  var word = options && options.word || WORD;
  var range = options && options.range || RANGE;
  var extraWords = options && options.extraWords || EXTRAWORDS;
  var commands = options && options.commands || [];
  var extra_autocomplete_list = editor.getOption("extra_autocomplete_list");
  var cur = editor.getCursor(),
    curLine = editor.getLine(cur.line);
  var end = cur.ch,
    start = end;
  while (start && word.test(curLine.charAt(start - 1))) --start;
  var curWord = start != end && curLine.slice(start, end);
  var list = options && options.list || [],
    seen = {};
  var re = new RegExp(word.source, "g");
  for (var dir = -1; dir <= 1; dir += 2) {
    var line = cur.line,
      endLine = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
    for (; line != endLine; line += dir) {
      var text = editor.getLine(line),
        m;
      // noinspection AssignmentResultUsedJS
      while (m = re.exec(text)) {
        if (line == cur.line && m[0] === curWord) continue;
        if ((!curWord || m[0].lastIndexOf(curWord, 0) == 0) && !Object.prototype.hasOwnProperty.call(seen, m[0])) {
          seen[m[0]] = true;
          list.push({
            text: m[0],
            icon: "code",
            render: renderAutoCompleteElement
          });
        }
      }
    }
  }
  list.push(...extraWords.filter(el => ffunc(el, curWord)));
  list.push(...extra_autocomplete_list.filter(el => ffunc(el, curWord)));
  list.push(...tactic_commands.filter(el => ffunc(el, curWord)));
  return {
    list: list,
    from: _codemirror.default.Pos(cur.line, start),
    to: _codemirror.default.Pos(cur.line, end)
  };
}
_codemirror.default.registerHelper("hint", "anyword", _anyWord);
//noinspection JSUnresolvedVariable
_codemirror.default.commands.autocomplete = function (cm) {
  //noinspection JSUnresolvedFunction
  cm.showHint({
    hint: _codemirror.default.hint.anyword,
    completeSingle: false,
    closeOnUnfocus: false
  });
};
_codemirror.default.defineOption("extra_autocomplete_list", [], null);
function tactic_icon(size) {
  return /*#__PURE__*/_react.default.createElement("svg", {
    version: "1.1",
    width: size,
    height: size,
    viewBox: "0 0 16.0 16.0",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react.default.createElement("defs", null, /*#__PURE__*/_react.default.createElement("clipPath", {
    id: "1049712011010711210611912053"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: ""
  }))), /*#__PURE__*/_react.default.createElement("g", {
    transform: "translate(0.60595454723647 0.14764492223537928)"
  }, /*#__PURE__*/_react.default.createElement("g", {
    clipPath: "url(#1049712011010711210611912053)"
  }, /*#__PURE__*/_react.default.createElement("polygon", {
    points: "0,1 9.41725866,1 9.41725866,1 0,1 0,1",
    stroke: "none",
    fill: "#5C7680"
  })), /*#__PURE__*/_react.default.createElement("path", {
    d: "M0,1 C8.34761826,1 11.1456334,1 8.39404545,1",
    stroke: "#000000",
    strokeWidth: "2",
    fill: "none",
    strokeMiterlimit: "10"
  })), /*#__PURE__*/_react.default.createElement("g", {
    transform: "translate(4.814583879706461 2.1476449222353775)"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M0.5,0 L0.68541612,13.3523551",
    stroke: "#000000",
    strokeWidth: "2",
    fill: "none",
    strokeMiterlimit: "10"
  })), /*#__PURE__*/_react.default.createElement("g", {
    transform: "translate(11.01030508595289 2.5)"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M0,0 L0,10.2925681 C0.00170293536,11.1010433 0.252019565,11.6152185 0.750949889,11.8350936 C1.24988021,12.0549688 2.16630554,12.0549688 3.50022587,11.8350936",
    stroke: "#000000",
    strokeWidth: "2",
    fill: "none",
    strokeMiterlimit: "10"
  })), /*#__PURE__*/_react.default.createElement("g", {
    transform: "translate(7.034263272927987 5.950228861138258)"
  }, /*#__PURE__*/_react.default.createElement("path", {
    d: "M0.465736727,0.549771139 L7.46573673,0.549771139",
    stroke: "#000000",
    strokeWidth: "1.5",
    fill: "none",
    strokeMiterlimit: "10"
  })));
}
function renderAutoCompleteApiElement(elt, data, cur) {
  const root = (0, _client.createRoot)(elt);
  root.render( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("span", {
    className: "mr-1"
  }, /*#__PURE__*/_react.default.createElement(_core.Icon, {
    icon: tactic_icon(10)
  })), /*#__PURE__*/_react.default.createElement("span", {
    className: "api-hint-name"
  }, cur.text), cur.argString && /*#__PURE__*/_react.default.createElement("span", {
    className: "api-hint-args"
  }, cur.argString)));
}
function renderAutoCompleteElement(elt, data, cur) {
  const root = (0, _client.createRoot)(elt);
  root.render( /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("span", {
    className: "mr-1"
  }, /*#__PURE__*/_react.default.createElement(_core.Icon, {
    icon: cur.icon,
    size: 10
  })), /*#__PURE__*/_react.default.createElement("span", null, cur.text)));
}
function create_api() {
  let self = this;
  let re = /\([^\)]*?\)/g;
  (0, _communication_react.postAjax)("get_api_dict", {}, function (data) {
    let api_dict_by_category = data.api_dict_by_category;
    let api_dict_by_name = data.api_dict_by_name;
    let ordered_api_categories = data.ordered_api_categories;
    tactic_commands = [];
    for (let cat of ordered_api_categories) {
      for (let entry of api_dict_by_category[cat]) {
        let the_name = "self." + entry["name"];
        let arg_string = (entry["signature"].match(re) || [null])[0];
        // let the_sig = "self." + entry["signature"];
        tactic_commands.push({
          text: the_name,
          argString: arg_string,
          render: renderAutoCompleteApiElement
        });
      }
    }
    tactic_commands = [...new Set(tactic_commands)];
  });
}
create_api();