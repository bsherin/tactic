"use strict";

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
const EXTRAWORDS_LIST = ["global_import", "escape_html", "xh", "ds", "Collection", "Collection", "Collection.document_names", "Collection.current_document", "Collection.column", "Collection.tokenize", "Collection.detach", "Collection.rewind", "Library", "Library.collections", "Library.lists", "Library.functions", "Library.classes", "Settings", "Settings.names", "Tiles", "Pipes"];
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
const aiCompletionSection = {
  name: "AI",
  rank: -Infinity
};
function aiCompletionSource(aiText, aiTextLabel) {
  return context => {
    if (!aiText) {
      return {
        from: context.pos,
        to: context.pos,
        options: []
      };
    }
    // Get the first line of aiText
    let aiLines = aiText.split('\n');
    const firstLine = aiLines[0];
    let options = [{
      label: firstLine,
      type: "suggestion",
      info: firstLine,
      section: aiCompletionSection,
      boost: 99
    }];
    if (aiLines.length > 1) {
      options.push({
        label: aiText,
        displayLabel: aiTextLabel,
        type: "suggestion",
        info: aiText,
        section: aiCompletionSection,
        boost: 99
      });
    }
    return {
      from: context.pos,
      to: context.pos,
      options: options,
      span: true
    };
  };
}
const loadingCompletion = {
  label: "Loading suggestions...",
  type: "suggestion",
  section: aiCompletionSection,
  boost: 99,
  // ensures it's always shown first
  apply: () => {} // do nothing on apply
};
const loadingSource = context => {
  return {
    from: context.pos,
    options: [loadingCompletion],
    validFor: () => false // will auto-close when a real suggestion appears
  };
};
exports.loadingSource = loadingSource;
function selfCompletions(context, extraSelfCompletions) {
  let beforeCursor = context.matchBefore(/self\.\w*/);
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
  return context => {
    return selfCompletions(context, extraSelfCompletions); // already returns from + options + validFor
  };
}
function generalCompletionSource() {
  return context => {
    const autocompleteSources = context.state.languageDataAt("autocomplete") || [];
    const localCompletions = autocompleteSources[0];
    const languageCompletions = autocompleteSources[1] || (() => null);
    const getOptions = source => source?.(context)?.options ?? [];
    const match = context.matchBefore(/\w*/);
    const from = match ? match.from : context.pos;
    let localOptions = getOptions(localCompletions);
    // in every option in local_options, add a section "Local"
    localOptions = localOptions.map(option => ({
      ...option,
      section: "Local"
    }));
    let languageOptions = getOptions(languageCompletions);
    // in every option in language_options, add a section "Language"
    languageOptions = languageOptions.map(option => ({
      ...option,
      section: "Language"
    }));
    const options = [...localOptions, ...languageOptions];
    return {
      from,
      to: context.pos,
      options,
      span: true
    };
  };
}
function topLevelExtraCompletions(context) {
  const match = context.matchBefore(/\w+/);
  if (!match || match.from === match.to && !context.explicit) {
    return {
      from: context.pos,
      to: context.pos,
      options: []
    };
  }
  const prefix = context.state.sliceDoc(match.from, context.pos);
  const options = EXTRAWORDS_LIST.filter(word => !word.includes('.') && word.startsWith(prefix)).map(word => ({
    label: word,
    type: "tactic",
    section: "Tactic"
  }));
  return {
    from: match.from,
    options,
    validFor: /\w*$/
  };
}
function dotAccessCompletions(context) {
  const match = context.matchBefore(/\b\w+\.\w*$/);
  if (!match || match.from === match.to && !context.explicit) {
    return {
      from: context.pos,
      to: context.pos,
      options: []
    };
  }
  const prefix = context.state.sliceDoc(match.from, context.pos);
  const options = EXTRAWORDS_LIST.filter(word => word.includes('.') && word.startsWith(prefix)).map(word => ({
    label: word,
    type: "tactic",
    section: "Tactic"
  }));
  return {
    from: match.from,
    options,
    validFor: /\w*$/
  };
}
create_api();