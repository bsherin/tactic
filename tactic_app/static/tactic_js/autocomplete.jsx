

import {postAjax} from "./communication_react";

export {combinedCompletions};


const EXTRAWORDS_LIST = ["global_import", "escape_html", "xh", "ds", "Collection",
    "Collection", "Collection.document_names", "Collection.current_docment", "Collection.column",
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
                    type: "method",
                    detail: "tactic",
                    info: entry["signature"]
                })
            }
        }
        self_commands = [...new Set(self_commands)];
    })
}

function selfCompletions(context, extraSelfCompletions) {
  let beforeCursor = context.matchBefore(/self\.\w*/);
  if (!beforeCursor || (beforeCursor.from == beforeCursor.to && !context.explicit))
    return {options:[]};
  return {
    from: beforeCursor.from + 5, // Skip "self."
    options: self_commands.concat(extraSelfCompletions),
    validFor: /^[\w$]*$/
  };
}

function periodCompletions(context) {
  let beforeCursor = context.matchBefore(/\b(\w+\.?\w*)$/);
  if (!beforeCursor || (beforeCursor.from == beforeCursor.to && !context.explicit))
    return {options:[]};

  let periodCompletions = [];
    for (let word of EXTRAWORDS_LIST) {
        periodCompletions.push({
        label: word,
        type: "property",
        detail: "tactic"
        });
    }

  return {
    from: beforeCursor.from,
    options: periodCompletions,
    validFor: /\w*$/
  };
}

function combinedCompletions(context, aiRCText=null, extraSelfCompletions=[]) {
    const localCompletions = context.state.languageDataAt("autocomplete")[0];
    const languageCompletions = context.state.languageDataAt("autocomplete")[1];

    const filterCompletions = (completions) => {
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
    if (aiRCText != null) {
        ai_comp = [{
            label: aiRCText,
            type: "suggestion",
            detail: "AI"
        }]
    }
    else {
        ai_comp = []
    }
    return {
        from: from,
        to: context.pos,
        options: [
            ...filterCompletions(localCompletions),
            ...filterCompletions(languageCompletions),
            ...selfCompletions(context, extraSelfCompletions).options,
            ...periodCompletions(context).options,
            ...ai_comp
        ],
        span: true
    };
}

create_api();