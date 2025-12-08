"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aiCompletionSource = aiCompletionSource;
exports.dotAccessCompletions = dotAccessCompletions;
exports.generalCompletionSource = generalCompletionSource;
exports.loadingSource = void 0;
exports.selfCompletionSource = selfCompletionSource;
exports.topLevelExtraCompletions = topLevelExtraCompletions;
var _communication_react = require("./communication_react");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var EXTRAWORDS_LIST = ["global_import", "escape_html", "xh", "ds", "Collection", "Collection", "Collection.document_names", "Collection.current_document", "Collection.column", "Collection.tokenize", "Collection.detach", "Collection.rewind", "Library", "Library.collections", "Library.lists", "Library.functions", "Library.classes", "Settings", "Settings.names", "Tiles", "Pipes"];
var self_commands = [];
function create_api() {
  var self = this;
  var re = /\([^\)]*?\)/g;
  (0, _communication_react.postAjax)("get_api_dict", {}, function (data) {
    var api_dict_by_category = data.api_dict_by_category;
    var api_dict_by_name = data.api_dict_by_name;
    var ordered_api_categories = data.ordered_api_categories;
    self_commands = [];
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
            var the_name = entry["name"];
            var arg_string = (entry["signature"].match(re) || [null])[0];
            self_commands.push({
              label: the_name,
              type: "tactic",
              section: "Tactic",
              info: entry["signature"]
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
    self_commands = _toConsumableArray(new Set(self_commands));
  });
}
var aiCompletionSection = {
  name: "AI",
  rank: -Infinity
};
function aiCompletionSource(aiText, aiTextLabel) {
  return function (context) {
    if (!aiText) {
      return {
        from: context.pos,
        to: context.pos,
        options: []
      };
    }
    var options = [{
      label: aiText,
      displayLabel: aiTextLabel,
      type: "suggestion",
      info: aiText,
      section: aiCompletionSection,
      boost: 99
    }];
    return {
      from: context.pos,
      to: context.pos,
      options: options,
      span: true
    };
  };
}
var loadingCompletion = {
  label: "Loading suggestions...",
  type: "suggestion",
  section: aiCompletionSection,
  boost: 99,
  // ensures it's always shown first
  apply: function apply() {} // do nothing on apply
};
var loadingSource = exports.loadingSource = function loadingSource(context) {
  return {
    from: context.pos,
    options: [loadingCompletion],
    validFor: function validFor() {
      return false;
    } // will auto-close when a real suggestion appears
  };
};
function selfCompletions(context, extraSelfCompletions) {
  var beforeCursor = context.matchBefore(/self\.\w*/);
  if (!beforeCursor || beforeCursor.from == beforeCursor.to && !context.explicit) return {
    from: context.pos,
    to: context.pos,
    options: []
  };
  return {
    from: beforeCursor.from + 5,
    // Skip "self."
    options: self_commands.concat(extraSelfCompletions),
    validFor: /^[\w$]*$/
  };
}
function selfCompletionSource(extraSelfCompletions) {
  return function (context) {
    return selfCompletions(context, extraSelfCompletions); // already returns from + options + validFor
  };
}
function generalCompletionSource() {
  return function (context) {
    var autocompleteSources = context.state.languageDataAt("autocomplete") || [];
    var localCompletions = autocompleteSources[0];
    var languageCompletions = autocompleteSources[1] || function () {
      return null;
    };
    var getOptions = function getOptions(source) {
      var _source$options, _source;
      return (_source$options = source === null || source === void 0 || (_source = source(context)) === null || _source === void 0 ? void 0 : _source.options) !== null && _source$options !== void 0 ? _source$options : [];
    };
    var match = context.matchBefore(/\w*/);
    var from = match ? match.from : context.pos;
    var localOptions = getOptions(localCompletions);
    // in every option in local_options, add a section "Local"
    localOptions = localOptions.map(function (option) {
      return _objectSpread(_objectSpread({}, option), {}, {
        section: "Local"
      });
    });
    var languageOptions = getOptions(languageCompletions);
    // in every option in language_options, add a section "Language"
    languageOptions = languageOptions.map(function (option) {
      return _objectSpread(_objectSpread({}, option), {}, {
        section: "Language"
      });
    });
    var options = [].concat(_toConsumableArray(localOptions), _toConsumableArray(languageOptions));
    return {
      from: from,
      to: context.pos,
      options: options,
      span: true
    };
  };
}
function topLevelExtraCompletions(context) {
  var match = context.matchBefore(/\w+/);
  if (!match || match.from === match.to && !context.explicit) {
    return {
      from: context.pos,
      to: context.pos,
      options: []
    };
  }
  var prefix = context.state.sliceDoc(match.from, context.pos);
  var options = EXTRAWORDS_LIST.filter(function (word) {
    return !word.includes('.') && word.startsWith(prefix);
  }).map(function (word) {
    return {
      label: word,
      type: "tactic",
      section: "Tactic"
    };
  });
  return {
    from: match.from,
    options: options,
    validFor: /\w*$/
  };
}
function dotAccessCompletions(context) {
  var match = context.matchBefore(/\b\w+\.\w*$/);
  if (!match || match.from === match.to && !context.explicit) {
    return {
      from: context.pos,
      to: context.pos,
      options: []
    };
  }
  var prefix = context.state.sliceDoc(match.from, context.pos);
  var options = EXTRAWORDS_LIST.filter(function (word) {
    return word.includes('.') && word.startsWith(prefix);
  }).map(function (word) {
    return {
      label: word,
      type: "tactic",
      section: "Tactic"
    };
  });
  return {
    from: match.from,
    options: options,
    validFor: /\w*$/
  };
}
create_api();