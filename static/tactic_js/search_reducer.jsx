import {useReducerAndRef} from "./utilities_react";

export {useSearch};

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
            return {...draft, ...action.new_state, current_search_cm: draft.cm_list[0], current_search_number: 0};
        default:
            return draft;
    }
}

function useSearch(is_mpl, is_d3) {
    let cm_list = ["render_content", "user_methods", "globals"]
    if (is_mpl) {
        cm_list.unshift("draw_plot");
    } else if (is_d3) {
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
