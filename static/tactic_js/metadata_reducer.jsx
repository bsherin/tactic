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
    }
}

function createMetaDataUndo(action, stateRef, stagedUndoEntryRef) {
    const field = field_lookup[action.type];
    if (!field) {
        return [null, false];
    }
    if (stateRef.current[field] === action.value) {
        return [null, false];
    }
    return [{
        type: action.type,
        value: stateRef.current[field]
    }, false, true];
}

function useMetadata(initial, undoStackRef = null, redoStackRef = null) {
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
    if (undoStackRef) {
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
