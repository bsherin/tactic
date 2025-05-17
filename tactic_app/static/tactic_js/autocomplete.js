"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.combinedCompletions = combinedCompletions;
var _communication_react = require("./communication_react");
const EXTRAWORDS_LIST = ["global_import", "escape_html", "xh", "ds", "Collection", "Collection", "Collection.document_names", "Collection.current_docment", "Collection.column", "Collection.tokenize", "Collection.detach", "Collection.rewind", "Library", "Library.collections", "Library.lists", "Library.functions", "Library.classes", "Settings", "Settings.names", "Tiles", "Pipes"];
var self_commands = [];
function create_api() {
  let self = this;
  let re = /\([^\)]*?\)/g;
  (0, _communication_react.postAjax)("get_api_dict", {}, function (data) {
    let api_dict_by_category = data.api_dict_by_category;
    let api_dict_by_name = data.api_dict_by_name;
    let ordered_api_categories = data.ordered_api_categories;
    self_commands = [];
    for (let cat of ordered_api_categories) {
      for (let entry of api_dict_by_category[cat]) {
        let the_name = entry["name"];
        let arg_string = (entry["signature"].match(re) || [null])[0];
        self_commands.push({
          label: the_name,
          type: "tactic",
          section: "Tactic",
          info: entry["signature"]
        });
      }
    }
    self_commands = [...new Set(self_commands)];
  });
}
function selfCompletions(context, extraSelfCompletions) {
  let beforeCursor = context.matchBefore(/self\.\w*/);
  if (!beforeCursor || beforeCursor.from == beforeCursor.to && !context.explicit) return {
    options: []
  };
  return {
    from: beforeCursor.from + 5,
    // Skip "self."
    options: self_commands.concat(extraSelfCompletions),
    validFor: /^[\w$]*$/
  };
}
function periodCompletions(context) {
  let beforeCursor = context.matchBefore(/\b(\w+\.?\w*)$/);
  if (!beforeCursor || beforeCursor.from == beforeCursor.to && !context.explicit) return {
    options: []
  };
  let periodCompletions = [];
  for (let word of EXTRAWORDS_LIST) {
    periodCompletions.push({
      label: word,
      type: "tactic",
      section: "Tactic"
    });
  }
  return {
    from: beforeCursor.from,
    options: periodCompletions,
    validFor: /\w*$/
  };
}
function combinedCompletions(context) {
  let aiText = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  let aiTextLabel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  let mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "python";
  let extraSelfCompletions = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : [];
  const localCompletions = context.state.languageDataAt("autocomplete")[0];
  const autocompleteSources = context.state.languageDataAt("autocomplete");
  // This next line is needed for the case with markdown and there isn't a source.
  const languageCompletions = autocompleteSources?.[1] || (() => null);
  const filterCompletions = completions => {
    let comps = completions(context);
    if (!comps) {
      return [];
    }
    return completions(context).options.filter(option => {
      const match = context.matchBefore(/\w*/);
      return match && option.label.startsWith(match.text);
    });
  };
  const match = context.matchBefore(/\w*/);
  const from = match ? match.from : context.pos;
  let ai_comp;
  if (aiText != null) {
    ai_comp = [{
      label: aiText,
      displayLabel: aiTextLabel,
      type: "suggestion",
      info: aiText,
      boost: 99,
      section: {
        name: "AI Suggestion",
        rank: -99
      }
    }];
  } else {
    ai_comp = [];
  }
  if (mode == "python") {
    return {
      from: context.pos,
      to: context.pos,
      options: [...ai_comp, ...filterCompletions(localCompletions), ...filterCompletions(languageCompletions), ...selfCompletions(context, extraSelfCompletions).options, ...periodCompletions(context).options],
      span: true
    };
  } else {
    return {
      from: context.pos,
      to: context.pos,
      options: [...ai_comp, ...filterCompletions(localCompletions), ...filterCompletions(languageCompletions)],
      span: true
    };
  }
}
create_api();