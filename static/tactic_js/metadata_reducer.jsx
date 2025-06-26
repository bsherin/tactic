import {useEffect, useRef} from "react";
import {useImmerReducer} from "use-immer";

export {useMetadata}

const initial_state = {
    allTags: [],
    tags: null,
    created: null,
    updated: null,
    notes: null,
    icon: null,
    category: null,
    additional_metadata: null
};

function metadataReducer(draft, action) {
    switch (action.type) {
        case "set_tags":
            draft.tags = action.value;
            break;
        case "set_notes":
            draft.notes = action.value;
            break;
        case "append_to_notes":
            draft.notes = draft.notes + action.value;
            break;
        case "set_icon":
            draft.icon = action.value;
            break;
        case "set_category":
            draft.category = action.value;
            break;
        case "set_all_tags":
            draft.allTags = action.value;
            break;
        case "set_created":
            draft.created = action.value;
            break;
        case "set_updated":
            draft.updated = action.value;
            break;
        case "set_couple":
            draft.couple_save_attrs_and_exports = action.value;
            break;
        case "multi_update":
            for (let field in action.value) {
                draft[field] = action.value[field]
            }
            break;
        default:
            break;
    }
}

function useMetadata(initial) {

    const [metadata, metadataDispatch] = useImmerReducer(metadataReducer, initial);
    const metadataRef = useRef(metadata);
    metadataRef.current = metadata;
    useEffect(() => {
        metadataDispatch({type: "initialize", new_items: initial});
    }, []);

    return [metadata, metadataDispatch, metadataRef]
}
