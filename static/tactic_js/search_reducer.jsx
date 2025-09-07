import {arraysMatch, useReducerAndRef} from "./utilities_react";
import {useEffect} from "react";

export {useSearch, countOccurrences, _searchMatcher, isRegex};

const REGEXTYPE = Object.getPrototypeOf(new RegExp("that"));

   function countOccurrences(query, the_text) {
        if (isRegex(query)) {
            const split_text = the_text.split(/\r?\n/);
            let total = 0;
            for (let str of split_text) {
                total += (str.match(query) || []).length;
            }
            return total;
        } else {
            return the_text.split(query).length - 1;
        }
    }

    function isRegex(ob) {
        return Object.getPrototypeOf(ob) === REGEXTYPE;
    }

     function _searchMatcher(term, global = false, use_regex = false, ignore_case = true) {
        let regex;
        let flags = "";
        if (global) {
            flags += "g"
        }
        if (ignore_case) {
            flags += "i"
        }
        try {
            if (!use_regex) {
                // Escape special characters for literal search
                const escapedSearchTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                regex = new RegExp(escapedSearchTerm, flags);
            } else {
                try {
                    regex = new RegExp(term, flags)
                } catch (e) {
                    console.log("Error creating regex, trying escaping");
                    const escapedSearchTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    regex = new RegExp(escapedSearchTerm, flags);
                }
                return regex
            }
        } catch (e) {
            console.log("Error creating regex", e);
            return null
        }
        return regex
    }


function searchReducer(draft, action) {
    switch (action.type) {
        case 'SET_SEARCH_STRING':
            return {...draft,
                search_string: action.payload,
                search_match_numbers: {},
                current_search_number: 0,
                current_search_cm: draft.id_list[0],
                search_matches: 0
            };
        case 'SET_REGEX':
            return {...draft,
                use_regex: action.payload,
                search_match_numbers: {},
                current_search_number: 0,
                current_search_cm: draft.id_list[0],
                search_matches: 0
        };
        case 'SET_TEMP_SEARCH_STRING':
            return {...draft, temp_search_string: action.payload};
        case 'SET_SEARCH_NUMBER':
            return {...draft, current_search_number: action.payload};
        case 'SET_SEARCH_MATCH_NUMBERS':
            let newNumbers = {...draft.search_match_numbers};
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
        case 'SET_ID_LIST':
            let new_state = {
                id_list: action.payload,
            };
            if (!action.payload.includes(draft.current_search_cm)) {
                if (action.payload.length > 0) {
                    new_state.current_search_cm = action.payload[0];
                } else {
                    new_state.current_search_cm = null;
                    new_state.search_matches = 0;
                    new_state.search_match_numbers = {}
                }
            }
            return {...draft, ...new_state};
        case 'SEARCH_NEXT':
            if ((draft.search_match_numbers[draft.current_search_cm] == 0) ||
                (draft.current_search_number >= draft.search_match_numbers[draft.current_search_cm] - 1)){
                let index = draft.id_list.indexOf(draft.current_search_cm);
                let start_index = index;
                let next_cm = null;
                let next_id;
                while (next_cm == null) {
                    index += 1;
                    if (index == start_index) {
                        return {...draft}
                    }
                    next_id = draft.id_list[(index) % draft.id_list.length];
                    if (next_id in draft.search_match_numbers) {
                        if (draft.search_match_numbers[next_id] > 0) {
                            next_cm = next_id;
                        }
                    }
                }
                return {...draft, current_search_cm: next_cm, current_search_number: 0};

            } else {
                return {...draft, current_search_number: draft.current_search_number + 1};
            }

        case 'SEARCH_PREVIOUS':
            if (draft.current_search_number <= 0) {
                let pindex = draft.id_list.indexOf(draft.current_search_cm);
                let start_index = pindex;
                let next_cm = null;
                let next_id;
                while (next_cm == null) {
                    pindex -= 1;
                    if (pindex == start_index) {
                        return {...draft}
                    }
                    next_id = draft.id_list[(pindex + draft.id_list.length) % draft.id_list.length];
                    if (next_id in draft.search_match_numbers) {
                        if (draft.search_match_numbers[next_id] > 0) {
                            next_cm = next_id;
                        }
                    }
                }
                let next_search_number = draft.search_match_numbers[next_id] - 1;
                return {...draft,  current_search_cm: next_cm, current_search_number: next_search_number}
            } else {
                return {...draft, current_search_number: draft.current_search_number - 1};
            }
        case 'UPDATE_STATE':
            return {...draft, ...action.new_state, current_search_cm: draft.id_list[0], current_search_number: 0};
        default:
            return draft;
    }
}

function useSearch(directRefs, listRefs) {

    const searchState = {
        id_list: [],
        search_match_numbers: {},
        temp_search_string: "",
        search_string: "",
        current_search_number: 0,
        current_search_cm: null,
        use_regex: false,
        search_matches: 0
    };

    const [value, customDispatch, valueRef] = useReducerAndRef(searchReducer, searchState);

    useEffect(()=>{
        getAllSearchMatches()

    }, [valueRef.current.search_string]);

    useEffect(() => {
        const currentIds = getIds();
        if (!arraysMatch(currentIds, valueRef.current.id_list)) {
            customDispatch({type: "SET_ID_LIST", payload: getIds()});
        }
    }, [listRefs[0].current, listRefs[1].current, listRefs[2].current]);


    function getIds() {
        let ids = [];
        for (let itemRef of directRefs) {
            ids.push(itemRef.current["identifier"]);
        }
        for (let listRef of listRefs) {
            for (let item of listRef.current) {
                ids.push(item["identifier"]);
            }
        }
        return ids;
    }

    function getAllSearchMatches() {
        const reg = _searchMatcher(valueRef.current.search_string, true, valueRef.current.use_regex);
        for (let itemRef of directRefs) {
            setSearchMatches(itemRef.current, reg);
        }
        for (let listRef of listRefs) {
            for (let item of listRef.current) {
                setSearchMatches(item, reg);
            }
        }
    }

    function setSearchMatches(item, reg) {
        let matches;
        if (!reg || !item.codeText) {
            matches = 0
        } else {
            matches = countOccurrences(reg, item.codeText);
        }
        customDispatch({type: "SET_SEARCH_MATCH_NUMBERS", payload: {"identifier": item.identifier, "num": matches}});
    }

    return [value, customDispatch, valueRef];
}
