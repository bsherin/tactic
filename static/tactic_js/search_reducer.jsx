import {arraysMatch, useReducerAndRef} from "./utilities_react";
import {useEffect} from "react";

export {useSearch, countOccurrences, _searchMatcher, isRegex};

function makePreview(line, matchIndex, matchLength, context = 45) {
    const start = Math.max(0, matchIndex - context);
    const end = Math.min(line.length, matchIndex + matchLength + context);

    const prefix = start > 0 ? "…" : "";
    const suffix = end < line.length ? "…" : "";

    return prefix + line.slice(start, end).trim() + suffix;
}

function getSearchResultsForItem(item, matcher, paneName = null) {
    if (!matcher || !item) {
        return [];
    }

    const results = [];
    let matchNumber = 0;

    const signatureText = getSignatureText(item);
    if (signatureText) {
        matcher.lastIndex = 0;

        let match;
        while ((match = matcher.exec(signatureText)) !== null) {
            results.push({
                identifier: item.identifier,
                paneName: paneName ?? item.name ?? item.identifier,
                matchNumber: null,
                kind: "signature",
                subLabel: "signature",
                lineNumber: item.firstLineNumber ?? 1,
                localLineNumber: 0,
                preview: signatureText,
            });

            if (match[0].length === 0) {
                matcher.lastIndex += 1;
            }
        }
    }

    if (!item.codeText) {
        return results;
    }

    const lines = item.codeText.split("\n");

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        matcher.lastIndex = 0;

        let match;
        while ((match = matcher.exec(line)) !== null) {
            results.push({
                identifier: item.identifier,
                paneName: paneName ?? item.name ?? item.identifier,
                matchNumber,
                kind: "code",
                subLabel: (item.firstLineNumber ?? 1) + i,
                lineNumber: (item.firstLineNumber ?? 1) + i,
                localLineNumber: i + 1,
                preview: makePreview(line, match.index, match[0].length),
            });

            matchNumber += 1;

            if (match[0].length === 0) {
                matcher.lastIndex += 1;
            }
        }
    }

    return results;
}

function getSignatureText(item) {
    if (!item || !item.name) {
        return "";
    }

    if (item.mode === "javascript") {
        return `function ${item.name}(selector, w, h, value, setValue, resizing)`;
    }

    // globals/render_content do not really have editable signatures
    if (item.name === "globals" || item.name === "render_content") {
        return "";
    }

    return `def ${item.name}(self, ${item.argString ?? ""}):`;
}

function getSearchableFieldsForFormItem(item, kind) {
    const skip = new Set([
        "identifier",
        "pane_height",
        "cmObject",
        "scrollTop"
    ]);

    const fields = [];

    for (let [key, value] of Object.entries(item)) {
        if (skip.has(key)) {
            continue;
        }

        if (value == null) {
            continue;
        }

        if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            fields.push({
                field: key,
                text: String(value)
            });
        } else if (Array.isArray(value)) {
            fields.push({
                field: key,
                text: value.join("\n")
            });
        } else if (typeof value === "object") {
            fields.push({
                field: key,
                text: JSON.stringify(value)
            });
        }
    }

    return fields;
}

function getSearchResultsForFormItem(item, matcher, kind) {
    if (!matcher || !item) {
        return [];
    }

    const results = [];
    const fields = getSearchableFieldsForFormItem(item, kind);

    for (let fieldEntry of fields) {
        const lines = fieldEntry.text.split("\n");

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            matcher.lastIndex = 0;

            let match;
            while ((match = matcher.exec(line)) !== null) {
                results.push({
                    identifier: item.identifier,
                    paneName: item.name ?? item.identifier,
                    matchNumber: null,
                    kind,
                    field: fieldEntry.field,
                    subLabel: fieldEntry.field,
                    lineNumber: null,
                    localLineNumber: i + 1,
                    preview: `${makePreview(line, match.index, match[0].length)}`,
                });

                if (match[0].length === 0) {
                    matcher.lastIndex += 1;
                }
            }
        }
    }

    return results;
}

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
            return {
                ...draft,
                search_string: action.payload,
                search_match_numbers: {},
                current_search_number: 0,
                current_search_cm: draft.id_list[0],
                search_matches: 0
            };
        case 'SET_REGEX':
            return {
                ...draft,
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
        case 'SET_SEARCH_RESULTS':
            const search_match_numbers = {};
            let search_matches = 0;

            for (let result of action.payload) {
                if (!(result.identifier in search_match_numbers)) {
                    search_match_numbers[result.identifier] = 0;
                }
                search_match_numbers[result.identifier] += 1;
                search_matches += 1;
            }

            let current_search_cm = draft.current_search_cm;
            let current_search_number = draft.current_search_number;

            if (
                current_search_cm == null ||
                !(current_search_cm in search_match_numbers) ||
                search_match_numbers[current_search_cm] === 0
            ) {
                const firstResult = action.payload[0];
                current_search_cm = firstResult ? firstResult.identifier : draft.id_list[0] ?? null;
                current_search_number = firstResult ? firstResult.matchNumber : 0;
            }

            return {
                ...draft,
                search_results: action.payload,
                search_match_numbers,
                search_matches,
                current_search_cm,
                current_search_number
            };
        case 'GOTO_SEARCH_MATCH':
            return {
                ...draft,
                current_search_cm: action.payload.identifier,
                current_search_number: action.payload.matchNumber ?? 0
            };
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
                (draft.current_search_number >= draft.search_match_numbers[draft.current_search_cm] - 1)) {
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
                return {...draft, current_search_cm: next_cm, current_search_number: next_search_number}
            } else {
                return {...draft, current_search_number: draft.current_search_number - 1};
            }
        case 'UPDATE_STATE':
            return {...draft, ...action.new_state, current_search_cm: draft.id_list[0], current_search_number: 0};
        default:
            return draft;
    }
}

function useSearch(directRefs, listRefs, formListRefs = []) {

    const searchState = {
        id_list: [],
        search_match_numbers: {},
        search_results: [],
        temp_search_string: "",
        search_string: "",
        current_search_number: 0,
        current_search_cm: null,
        use_regex: false,
        search_matches: 0
    };

    const [value, customDispatch, valueRef] = useReducerAndRef(searchReducer, searchState);

    useEffect(() => {
        getAllSearchMatches()

    }, [valueRef.current.search_string]);

    useEffect(() => {
        getAllSearchMatches();
    }, [valueRef.current.search_string, valueRef.current.use_regex]);


    useEffect(() => {
        const currentIds = getIds();
        if (!arraysMatch(currentIds, valueRef.current.id_list)) {
            customDispatch({type: "SET_ID_LIST", payload: currentIds});
        }
    }, [
        listRefs[0].current,
        listRefs[1].current,
        listRefs[2].current,
        ...formListRefs.map(entry => entry.ref.current)
    ]);


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
        for (let entry of formListRefs) {
            for (let item of entry.ref.current) {
                ids.push(item["identifier"]);
            }
        }
        return ids;
    }

    function getAllSearchMatches() {
        const searchString = valueRef.current.search_string;

        if (!searchString) {
            customDispatch({type: "SET_SEARCH_RESULTS", payload: []});
            return;
        }

        const allResults = [];
        let globalMatchNumber = 0;

        function addItemResults(item) {
            const reg = _searchMatcher(searchString, true, valueRef.current.use_regex);
            const itemResults = getSearchResultsForItem(item, reg, item.name);

            for (let result of itemResults) {
                allResults.push({
                    ...result,
                    globalMatchNumber
                });
                globalMatchNumber += 1;
            }
        }

        for (let itemRef of directRefs) {
            addItemResults(itemRef.current);
        }

        for (let entry of formListRefs) {
            for (let item of entry.ref.current) {
                const reg = _searchMatcher(searchString, true, valueRef.current.use_regex);
                const itemResults = getSearchResultsForFormItem(item, reg, entry.kind);

                for (let result of itemResults) {
                    allResults.push({
                        ...result,
                        globalMatchNumber
                    });
                    globalMatchNumber += 1;
                }
            }
        }

        for (let listRef of listRefs) {
            for (let item of listRef.current) {
                addItemResults(item);
            }
        }

        customDispatch({type: "SET_SEARCH_RESULTS", payload: allResults});
    }

    return [value, customDispatch, valueRef];
}
