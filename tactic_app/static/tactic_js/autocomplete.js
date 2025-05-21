"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.aiCompletionSource = aiCompletionSource;
exports.dotAccessCompletions = dotAccessCompletions;
exports.generalCompletionSource = generalCompletionSource;
exports.selfCompletionSource = selfCompletionSource;
exports.topLevelExtraCompletions = topLevelExtraCompletions;
var _communication_react = require("./communication_react");
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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
function aiCompletionSource(aiText, aiTextLabel) {
  return function (context) {
    if (!aiText) {
      return {
        from: context.pos,
        to: context.pos,
        options: []
      };
    }
    // Get the first line of aiText
    var firstLine = aiText.split('\n')[0];
    return {
      from: context.pos,
      to: context.pos,
      options: [{
        label: aiText,
        displayLabel: aiTextLabel,
        type: "suggestion",
        info: aiText,
        boost: 990
      }, {
        label: firstLine,
        type: "suggestion",
        info: firstLine,
        boost: 999
      }],
      span: true
    };
  };
}
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
    var options = [].concat(_toConsumableArray(getOptions(localCompletions)), _toConsumableArray(getOptions(languageCompletions)));
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
      type: "tactic"
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
      type: "tactic"
    };
  });
  return {
    from: match.from,
    options: options,
    validFor: /\w*$/
  };
}
create_api();