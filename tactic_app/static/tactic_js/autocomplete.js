"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.renderAutoCompleteElement = renderAutoCompleteElement;

var _react = _interopRequireDefault(require("react"));

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _communication_react = require("./communication_react");

var _codemirror = _interopRequireDefault(require("codemirror/lib/codemirror.js"));

var _core = require("@blueprintjs/core");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var EXTRAWORDS_LIST = ["global_import", "Collection", "Collection", "Collection.document_names", "Collection.current_docment", "Collection.column", "Collection.tokenize", "Collection.detach", "Collection.rewind", "Library", "Library.collections", "Library.lists", "Library.functions", "Library.classes", "Settings", "Settings.names", "Tiles", "Pipes"];
var EXTRAWORDS = [];

for (var _i = 0, _EXTRAWORDS_LIST = EXTRAWORDS_LIST; _i < _EXTRAWORDS_LIST.length; _i++) {
  var w = _EXTRAWORDS_LIST[_i];
  EXTRAWORDS.push({
    text: w,
    render: renderAutoCompleteApiElement
  });
}

var WORD = /[\w\.$]+/;
var RANGE = 500;
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

  while (start && word.test(curLine.charAt(start - 1))) {
    --start;
  }

  var curWord = start != end && curLine.slice(start, end);
  var list = options && options.list || [],
      seen = {};
  var re = new RegExp(word.source, "g");

  for (var dir = -1; dir <= 1; dir += 2) {
    var line = cur.line,
        endLine = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;

    for (; line != endLine; line += dir) {
      var text = editor.getLine(line),
          m; // noinspection AssignmentResultUsedJS

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

  list.push.apply(list, _toConsumableArray(extraWords.filter(function (el) {
    return ffunc(el, curWord);
  })));
  list.push.apply(list, _toConsumableArray(extra_autocomplete_list.filter(function (el) {
    return ffunc(el, curWord);
  })));
  list.push.apply(list, _toConsumableArray(tactic_commands.filter(function (el) {
    return ffunc(el, curWord);
  })));
  return {
    list: list,
    from: _codemirror["default"].Pos(cur.line, start),
    to: _codemirror["default"].Pos(cur.line, end)
  };
}

_codemirror["default"].registerHelper("hint", "anyword", _anyWord); //noinspection JSUnresolvedVariable


_codemirror["default"].commands.autocomplete = function (cm) {
  //noinspection JSUnresolvedFunction
  cm.showHint({
    hint: _codemirror["default"].hint.anyword,
    completeSingle: false,
    closeOnUnfocus: false
  });
};

_codemirror["default"].defineOption("extra_autocomplete_list", [], null);

function tactic_icon(size) {
  return /*#__PURE__*/_react["default"].createElement("svg", {
    version: "1.1",
    width: size,
    height: size,
    viewBox: "0 0 16.0 16.0",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/_react["default"].createElement("defs", null, /*#__PURE__*/_react["default"].createElement("clipPath", {
    id: "1049712011010711210611912053"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: ""
  }))), /*#__PURE__*/_react["default"].createElement("g", {
    transform: "translate(0.60595454723647 0.14764492223537928)"
  }, /*#__PURE__*/_react["default"].createElement("g", {
    clipPath: "url(#1049712011010711210611912053)"
  }, /*#__PURE__*/_react["default"].createElement("polygon", {
    points: "0,1 9.41725866,1 9.41725866,1 0,1 0,1",
    stroke: "none",
    fill: "#5C7680"
  })), /*#__PURE__*/_react["default"].createElement("path", {
    d: "M0,1 C8.34761826,1 11.1456334,1 8.39404545,1",
    stroke: "#000000",
    strokeWidth: "2",
    fill: "none",
    strokeMiterlimit: "10"
  })), /*#__PURE__*/_react["default"].createElement("g", {
    transform: "translate(4.814583879706461 2.1476449222353775)"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: "M0.5,0 L0.68541612,13.3523551",
    stroke: "#000000",
    strokeWidth: "2",
    fill: "none",
    strokeMiterlimit: "10"
  })), /*#__PURE__*/_react["default"].createElement("g", {
    transform: "translate(11.01030508595289 2.5)"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: "M0,0 L0,10.2925681 C0.00170293536,11.1010433 0.252019565,11.6152185 0.750949889,11.8350936 C1.24988021,12.0549688 2.16630554,12.0549688 3.50022587,11.8350936",
    stroke: "#000000",
    strokeWidth: "2",
    fill: "none",
    strokeMiterlimit: "10"
  })), /*#__PURE__*/_react["default"].createElement("g", {
    transform: "translate(7.034263272927987 5.950228861138258)"
  }, /*#__PURE__*/_react["default"].createElement("path", {
    d: "M0.465736727,0.549771139 L7.46573673,0.549771139",
    stroke: "#000000",
    strokeWidth: "1.5",
    fill: "none",
    strokeMiterlimit: "10"
  })));
}

function renderAutoCompleteApiElement(elt, data, cur) {
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("span", {
    className: "mr-1"
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: tactic_icon(10)
  })), /*#__PURE__*/_react["default"].createElement("span", {
    className: "api-hint-name"
  }, cur.text), cur.argString && /*#__PURE__*/_react["default"].createElement("span", {
    className: "api-hint-args"
  }, cur.argString)), elt);
}

function renderAutoCompleteElement(elt, data, cur) {
  ReactDOM.render( /*#__PURE__*/_react["default"].createElement(_react["default"].Fragment, null, /*#__PURE__*/_react["default"].createElement("span", {
    className: "mr-1"
  }, /*#__PURE__*/_react["default"].createElement(_core.Icon, {
    icon: cur.icon,
    iconSize: 10
  })), /*#__PURE__*/_react["default"].createElement("span", null, cur.text)), elt);
}

function create_api() {
  var self = this;
  var re = /\([^\)]*?\)/g;
  (0, _communication_react.postAjax)("get_api_dict", {}, function (data) {
    var api_dict_by_category = data.api_dict_by_category;
    var api_dict_by_name = data.api_dict_by_name;
    var ordered_api_categories = data.ordered_api_categories;
    tactic_commands = [];

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
            var the_name = "self." + entry["name"];
            var arg_string = (entry["signature"].match(re) || [null])[0]; // let the_sig = "self." + entry["signature"];

            tactic_commands.push({
              text: the_name,
              argString: arg_string,
              render: renderAutoCompleteApiElement
            });
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    tactic_commands = _toConsumableArray(new Set(tactic_commands));
  });
}

create_api();