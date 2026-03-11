import {useImmerReducerAndRef} from "./utilities_react";
import { makeUndoable } from "./undo";

export {useMetadata, metadataReducer, createMetaDataUndo}

const field_lookup = {
    "set_tags": "tags",
    "set_notes": "notes",
    "set_icon": "icon",
    "set_category": "category",
    "set_all_tags": "allTags",
    "set_created": "created",
    "set_updated": "updated",
    "set_couple": "couple_save_attrs_and_exports"
}

function metadataReducer(draft, action) {
    if (field_lookup.hasOwnProperty(action.type)) {
        draft[field_lookup[action.type]] = action.value;
    } else {
        switch (action.type) {
            case "append_to_notes":
                draft.notes = draft.notes + action.value;
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
}

function createMetaDataUndo(action, stateRef, stagedUndoEntryRef) {
    const field = field_lookup[action.type];
    let doDebounce = false;
    let forceCommit = true;
    let undoAction = null;
    if (!field) {
        return [null, false, false];
    }
    if (stateRef.current[field] === action.value) {
        return [null, false, false];
    }
    if (field == "notes") {
        if (stagedUndoEntryRef.current
            && (stagedUndoEntryRef.current.undoAction.type === "set_notes" ||
                stagedUndoEntryRef.current.undoAction.type === "append_to_notes")) {
            forceCommit = false
        }
        undoAction = {
            type: action.type,
            value: stateRef.current[field]
        }
        doDebounce = true;
    } else if (field == "update_item") {
        undoAction = {
            type: "update_item",
            new_item: stateRef.current
        }
    }
    else {
        undoAction = {
            type: action.type,
            value: stateRef.current[field]
        }
    }
    return [undoAction, doDebounce, forceCommit];
}

function useMetadata(initial, doUndo = true) {
    if (!initial.hasOwnProperty("pane_height")) {
        initial.pane_height = "unset";
    }
    if (!initial.hasOwnProperty("couple_save_attrs_and_exports")) {
        initial.couple_save_attrs_and_exports = true;
    }
    if (initial["additional_mdata"].icon) {
        initial.icon = initial["additional_mdata"].icon
    }
    else {
        initial.icon = "application";
    }
    if (initial["additional_mdata"].category) {
        initial.category = initial["additional_mdata"].category;
    }



    const [metadata, metadataDispatch, metadataRef] = useImmerReducerAndRef(metadataReducer, initial);
    if (doUndo) {
        return [
            metadata,
            makeUndoable(metadataDispatch, metadataRef, createMetaDataUndo),
            metadataRef
        ];
    }
    else {
        return [metadata, metadataDispatch, metadataRef];
    }

}
