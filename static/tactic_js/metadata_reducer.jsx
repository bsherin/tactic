import {useEffect, useRef} from "react";
import {useImmerReducer} from "use-immer";

export {useMetadata}

const INITIAL_PANE_HEIGHT = 400

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
        case "update_item":
            for (let field in action.new_item) {
                draft[field] = action.new_item[field]
            }
            break;
        default:
            break;
    }
}

function useMetadata(initial) {
    if (!initial.hasOwnProperty("pane_height")) {
        initial.pane_height = 424;
    }
    if (!initial.hasOwnProperty("couple_save_attrs_and_exports")) {
        initial.couple_save_attrs_and_exports = true;
    }
    const [metadata, metadataDispatch] = useImmerReducer(metadataReducer, initial);
    const metadataRef = useRef(metadata);
    metadataRef.current = metadata;

    return [metadata, metadataDispatch, metadataRef]
}
