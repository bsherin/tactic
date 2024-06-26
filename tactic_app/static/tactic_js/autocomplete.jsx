import React from "react";
import { createRoot } from 'react-dom/client';
import {postAjax} from "./communication_react";
import CodeMirror from 'codemirror/lib/codemirror.js';
import {Icon} from "@blueprintjs/core";
export {renderAutoCompleteElement}

const EXTRAWORDS_LIST = ["global_import", "Collection",
    "Collection", "Collection.document_names", "Collection.current_docment", "Collection.column",
    "Collection.tokenize", "Collection.detach", "Collection.rewind",
    "Library", "Library.collections", "Library.lists", "Library.functions", "Library.classes",
    "Settings", "Settings.names",
    "Tiles", "Pipes"];

var EXTRAWORDS = [];
for (let w of EXTRAWORDS_LIST) {
    EXTRAWORDS.push({text: w, render: renderAutoCompleteApiElement})
}

const WORD = /[\w\.$]+/;
const RANGE = 500;

var tactic_commands = [];

function _anyWord(editor, options) {
    function ffunc(el, curWord) {
        return typeof(el) == "string" ? el.startsWith(curWord || '') : el.text.startsWith(curWord || '');
    }
    var word = options && options.word || WORD;
    var range = options && options.range || RANGE;
    var extraWords = options && options.extraWords || EXTRAWORDS;
    var commands = options && options.commands || [];
    var extra_autocomplete_list = editor.getOption("extra_autocomplete_list");
    var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
    var end = cur.ch, start = end;
    while (start && word.test(curLine.charAt(start - 1))) --start;
    var curWord = start != end && curLine.slice(start, end);

    var list = options && options.list || [], seen = {};
    var re = new RegExp(word.source, "g");
    for (var dir = -1; dir <= 1; dir += 2) {
      var line = cur.line, endLine = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
      for (; line != endLine; line += dir) {
        var text = editor.getLine(line), m;
        // noinspection AssignmentResultUsedJS
          while (m = re.exec(text)) {
          if (line == cur.line && m[0] === curWord) continue;
          if ((!curWord || m[0].lastIndexOf(curWord, 0) == 0) && !Object.prototype.hasOwnProperty.call(seen, m[0])) {
            seen[m[0]] = true;
            list.push({text: m[0], icon: "code", render: renderAutoCompleteElement});
          }
        }
      }
    }
    list.push(...(extraWords.filter(el => ffunc(el, curWord))));
    list.push(...(extra_autocomplete_list.filter(el => ffunc(el, curWord))));
    list.push(...(tactic_commands.filter(el => ffunc(el, curWord))));
    return {list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end)};
  }


CodeMirror.registerHelper("hint", "anyword", _anyWord);
//noinspection JSUnresolvedVariable
CodeMirror.commands.autocomplete = function (cm) {
    //noinspection JSUnresolvedFunction
    cm.showHint({
        hint: CodeMirror.hint.anyword,
        completeSingle: false,
        closeOnUnfocus: false
    });
};
CodeMirror.defineOption("extra_autocomplete_list", [], null);

function tactic_icon(size) {
    return (
        <svg version="1.1" width={size} height={size} viewBox="0 0 16.0 16.0" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <clipPath id="1049712011010711210611912053">
                    <path d=""></path>
                </clipPath>
            </defs>
            <g transform="translate(0.60595454723647 0.14764492223537928)">
                <g clipPath="url(#1049712011010711210611912053)">
                    <polygon points="0,1 9.41725866,1 9.41725866,1 0,1 0,1" stroke="none" fill="#5C7680"></polygon>
                </g>
                <path d="M0,1 C8.34761826,1 11.1456334,1 8.39404545,1" stroke="#000000" strokeWidth="2" fill="none"
                      strokeMiterlimit="10"></path>
            </g>
            <g transform="translate(4.814583879706461 2.1476449222353775)">
                <path d="M0.5,0 L0.68541612,13.3523551" stroke="#000000" strokeWidth="2" fill="none"
                      strokeMiterlimit="10"></path>
            </g>
            <g transform="translate(11.01030508595289 2.5)">
                <path
                    d="M0,0 L0,10.2925681 C0.00170293536,11.1010433 0.252019565,11.6152185 0.750949889,11.8350936 C1.24988021,12.0549688 2.16630554,12.0549688 3.50022587,11.8350936"
                    stroke="#000000" strokeWidth="2" fill="none" strokeMiterlimit="10"></path>
            </g>
            <g transform="translate(7.034263272927987 5.950228861138258)">
                <path d="M0.465736727,0.549771139 L7.46573673,0.549771139" stroke="#000000" strokeWidth="1.5"
                      fill="none" strokeMiterlimit="10"></path>
            </g>
        </svg>
    )
}

function renderAutoCompleteApiElement(elt, data, cur) {
    const root = createRoot(elt);
    root.render(
        <React.Fragment>
            <span className="mr-1">
                <Icon icon={tactic_icon(10)}/>
            </span>
            <span className="api-hint-name">
                {cur.text}
            </span>
            {cur.argString &&
                <span className="api-hint-args">
                    {cur.argString}
                </span>
            }
        </React.Fragment>)
}

function renderAutoCompleteElement(elt, data, cur) {
    const root = createRoot(elt);
    root.render(
        <React.Fragment>
            <span className="mr-1">
                <Icon icon={cur.icon} size={10}/>
            </span>
            <span>
                {cur.text}
            </span>
        </React.Fragment>)
}

function create_api() {
    let self = this;
    let re = /\([^\)]*?\)/g;
    postAjax("get_api_dict", {}, function (data) {
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
                })
            }
        }
        tactic_commands = [...new Set(tactic_commands)];
    })
}
create_api();