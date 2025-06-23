import React, {createContext, useEffect, useReducer, useRef} from "react";
import {arrayMove, guid, useReducerAndRef} from "./utilities_react";

export {useCmData, usePropertyList, useSearch, MakerPaneContext}

const MakerPaneContext = createContext(null);

function cmDataReducer(draft, action) {
    switch (action.type) {
        case 'SET_FIRST_LINE_NUMBER':
            return {...draft, firstLineNumber: action.payload};
        case 'set_code_text':
            return {...draft, codeText: action.payload};
        case 'SET_HAS_ACTIVATED':
            return {...draft, hasActivated: action.payload};
        case 'set_func_name':
            return {...draft, name: action.payload};
        case 'set_arg_string':
            return {...draft, argString: action.payload};
        default:
            return draft;
    }
}
// This hasActivated machinery is necessary because cleanup of codemirror areas doesn't work
// properly if the component is unmounted before the codemirror area is activated.
function useCmData(initialCode, initialLineNumber, initialHasActivated,
                   initialFuncName, initialArgString, signatureIsEditable=false, mode="python") {
    const elemRef = useRef(null);
    const cmObjectRef = useRef(null);
    const iState = {
        firstLineNumber: initialLineNumber || 1,
        codeText: initialCode || '',
        hasActivated: initialHasActivated || false,
        name: initialFuncName || '',
        argString: initialArgString || '',
        signatureIsEditable: signatureIsEditable,
        mode: mode,
    };
    const [value, customDispatch] = useReducer(cmDataReducer, iState);
    return [value, customDispatch, elemRef, cmObjectRef];
}

function searchReducer(draft, action) {
    switch (action.type) {
        case 'SET_SEARCH_STRING':
            return {...draft, search_string: action.payload};
        case 'SET_SEARCH_NUMBER':
            return {...draft, current_search_number: action.payload};
        case 'SET_SEARCH_MATCH_NUMBERS':
            let newNumbers = {...draft.search_match_numbers}
            newNumbers[action.payload.identifier] = action.payload.num;
            let current_matches = 0;
            for (let cname in newNumbers) {
                current_matches += newNumbers[cname]
            }
            return {...draft, search_match_numbers: newNumbers, search_matches: current_matches};
        case 'SET_SEARCH_CM':
            return {...draft, current_search_cm: action.payload};
        case 'SET_USE_REGEX':
            return {...draft, use_regex: action.payload};
        case 'SET_SEARCH_MATCHES':
            return {...draft, search_matches: action.payload};
        case 'SEARCH_NEXT':
            if (draft.current_search_number >= draft.search_match_numbers[draft.current_search_cm] - 1) {
                let next_cm;
                switch (draft.current_search_cm) {
                    case "rc":
                        next_cm = "em";
                        break;
                    case "tc":
                        next_cm = "rc";
                        break;
                    case "em":
                        next_cm = "gp";
                        break;
                    default:
                        if (props.is_mpl || props.is_d3) {
                            next_cm = "tc"
                        } else {
                            next_cm = "rc"
                        }
                        break
                }
                return {...draft, currentsearch_cm: next_cm, current_search_number: 0};

            } else {
                return {...draft, current_search_number: draft.current_search_number + 1};
            }
        case 'SEARCH_PREVIOUS':
            let next_cm;
            let next_search_number;
            if (draft.current_search_number <= 0) {
                if (draft.current_search_cm == "em") {
                    next_cm = "rc";
                    next_search_number = drat.search_match_numbers["rc"] - 1
                } else if (draft.current_search_cm_ref == "tc") {
                    next_cm = "em";
                    next_search_number = draft.search_match_numbers["em"] - 1
                } else {
                    if (props.is_mpl || props.is_d3) {
                        next_cm = "tc";
                        next_search_number = draft.search_match_numbers["tc"] - 1
                    } else {
                        next_cm = "em";
                        next_search_number = draft.search_match_numbers["em"] - 1
                    }
                }
                if (next_search_number < 0) {
                    next_search_number = 0
                }
                return {...draft, currentsearch_cm: next_cm, current_search_number: next_search_number};
            } else {
                return {...draft, curent_search_number: draft.current_search_number - 1};
            }
        case 'UPDATE_STATE':
            return {...draft, ...action.new_state, current_search_cm: draft.cm_list[0], current_search_number: 0 };
        default:
            return draft;
    }
}

function useSearch(is_mpl, is_d3) {
    let cm_list = ["render_content", "user_methods", "globals"]
    if (is_mpl) {
        cm_list.unshift("draw_plot");
    } else if(is_d3) {
        cm_list.unshift("jscript");
    }
    let sm_numbers = {};
    cm_list.forEach(cm => {
        sm_numbers[cm] = 0;
    });
    const searchState = {
        cm_list: cm_list,
        search_match_numbers: sm_numbers,
        search_string: "",
        current_search_number: null,
        current_search_cm: cm_list[0],
        use_regex: false,
        search_matches: null
    };
    const [value, customDispatch, valueRef] = useReducerAndRef(searchReducer, searchState);
    return [value, customDispatch, valueRef];
}

function propertyListReducer(prop_list, action) {
    var new_items;
    switch (action.type) {
        case "initialize":
            if (prop_list == null || prop_list.length === 0) {
                new_items = [];
            }
            else {
                new_items = action.new_items.map(t => {
                    let new_t = {...t};
                    new_t.identifier = guid();
                    return new_t
                });
            }
            break;
        case "delete_item":
            new_items = prop_list.filter(t => t.identifier !== action.identifier);
            break;
        case "update_item":
            const identifier = action.identifier;
            new_items = prop_list.map(t => {
                if (t.identifier == identifier) {
                    const update_dict = action.new_item;
                    return {...t, ...update_dict};
                } else {
                    return t;
                }
            });
            break;
        case "move_item":
            let old_list = [...prop_list];
            new_items = arrayMove(prop_list, action.oldIndex, action.newIndex);
            break;
        case "add_at_index":
            new_items = [...prop_list];
            let new_t = {...action.new_item};
            new_t.identifier = guid();
            new_items.splice(action.insert_index, 0, new_t);
            break;
        case "add_at_end":
            new_items = [...prop_list];
            let new_te = {...action.new_item};
            //check if new_te has property "identifier"
            if (!new_te.hasOwnProperty("identifier")) {
                new_te.identifier = guid();
            }
            new_items.push(new_te);
            break;
        default:
            console.log("Got Unknown action: " + action.type);
            return [...prop_list]
    }
    return new_items;
}


function usePropertyList(initial) {

    const [propList, propListDispatch] = useReducer(propertyListReducer, initial);
    const propListRef = useRef(propList);
    propListRef.current = propList;
    useEffect(() => {
        propListDispatch({type: "initialize", new_items: initial});
    }, []);

    return [propList, propListDispatch, propListRef]
}
