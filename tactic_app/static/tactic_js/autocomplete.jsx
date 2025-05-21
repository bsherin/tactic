

import {postAjax} from "./communication_react";

export {aiCompletionSource, selfCompletionSource, generalCompletionSource, topLevelExtraCompletions, dotAccessCompletions};


const EXTRAWORDS_LIST = ["global_import", "escape_html", "xh", "ds", "Collection",
    "Collection", "Collection.document_names", "Collection.current_document", "Collection.column",
    "Collection.tokenize", "Collection.detach", "Collection.rewind",
    "Library", "Library.collections", "Library.lists", "Library.functions", "Library.classes",
    "Settings", "Settings.names",
    "Tiles", "Pipes"];

var self_commands = [];

function create_api() {
    let self = this;
    let re = /\([^\)]*?\)/g;
    postAjax("get_api_dict", {}, function (data) {
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
                })
            }
        }
        self_commands = [...new Set(self_commands)];
    })
}

function aiCompletionSource(aiText, aiTextLabel) {
  return (context) => {
    if (!aiText) {
      return { from: context.pos, to: context.pos, options: [] };
    }
    // Get the first line of aiText
    const firstLine = aiText.split('\n')[0];

   
    return {
      from: context.pos,
      to: context.pos,
      options: [{
            label: aiText,
            displayLabel: aiTextLabel,
            type: "suggestion",
            info: aiText,
            boost: 990
          },
          {
            label: firstLine,
            type: "suggestion",
            info: firstLine,
            boost: 999
          }
      ],
      span: true
    };
  };
}

function selfCompletions(context, extraSelfCompletions) {
  let beforeCursor = context.matchBefore(/self\.\w*/);
  if (!beforeCursor || (beforeCursor.from == beforeCursor.to && !context.explicit))
    return { from: context.pos, to: context.pos, options:[]};
  return {
    from: beforeCursor.from + 5, // Skip "self."
    options: self_commands.concat(extraSelfCompletions),
    validFor: /^[\w$]*$/
  };
}

function selfCompletionSource(extraSelfCompletions) {
  return (context) => {
    return selfCompletions(context, extraSelfCompletions);  // already returns from + options + validFor
  };
}

function generalCompletionSource() {
  return (context) => {
    const autocompleteSources = context.state.languageDataAt("autocomplete") || [];
    const localCompletions = autocompleteSources[0];
    const languageCompletions = autocompleteSources[1] || (() => null);

    const getOptions = (source) => source?.(context)?.options ?? [];
    const match = context.matchBefore(/\w*/);
    const from = match ? match.from : context.pos;

    const options = [
      ...getOptions(localCompletions),
      ...getOptions(languageCompletions),
    ];

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
  if (!match || (match.from === match.to && !context.explicit)) {
    return { from: context.pos, to: context.pos, options: [] };
  }

  const prefix = context.state.sliceDoc(match.from, context.pos);

  const options = EXTRAWORDS_LIST
    .filter(word => !word.includes('.') && word.startsWith(prefix))
    .map(word => ({ label: word, type: "tactic" }));

  return {
    from: match.from,
    options,
    validFor: /\w*$/
  };
}

function dotAccessCompletions(context) {
    const match = context.matchBefore(/\b\w+\.\w*$/);
    if (!match || (match.from === match.to && !context.explicit)) {
        return {from: context.pos, to: context.pos, options: []};
    }

    const prefix = context.state.sliceDoc(match.from, context.pos);

    const options = EXTRAWORDS_LIST
        .filter(word => word.includes('.') && word.startsWith(prefix))
        .map(word => ({
            label: word,
            type: "tactic"
        }));

    return {
        from: match.from,
        options,
        validFor: /\w*$/
    };
}

create_api();