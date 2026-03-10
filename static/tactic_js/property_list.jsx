import {arrayMove, guid} from "./utilities_react";
import {useContext, useEffect, useReducer, useRef} from "react";
import {makeUndoable, UndoContext} from "./undo";
export {usePropertyList, usePropertyListNoUndo, propertyListReducer, createPropertyListUndoAction,
    getListItemFromidentifier};

function getListItemFromidentifier(identifier, item_list) {
    for (let item of item_list) {
        if (item.identifier === identifier) {
            return item
        }
    }
    return null
}

function propertyListReducer(state, action) {
    const prop_list = state.items;
    const defaults = state.default_values || {};
    let new_items;
    console.log(`propertyListReducer received action: ${action.type}`);
    switch (action.type) {
        case "initialize":
            const initDefaults = action["default_values"] || defaults;
            if (action.new_items == null || action.new_items.length === 0) {
                new_items = [];
            } else {
                new_items = action.new_items.map(t => {
                    let new_t = {...initDefaults, ...t};
                    if (!new_t.hasOwnProperty("identifier")) {
                        new_t.identifier = guid();
                    }
                    if (!new_t.hasOwnProperty("pane_height")) {
                        new_t.pane_height = action.initial_pane_height;
                    }
                    return new_t
                });
            }
            return {items: new_items, default_values: initDefaults};
        case "delete_item":
            new_items = prop_list.filter(t => t.identifier !== action.identifier);
            return {...state, items: new_items};
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
            return {...state, items: new_items};
        case "move_item_over":
            const active_id = action["active_identifier"];
            const over_id = action["over_identifier"];
            const oldIndex = prop_list.findIndex((i) => i.identifier === active_id);
            const newIndex = prop_list.findIndex((i) => i.identifier === over_id);
            if (oldIndex !== -1 && newIndex !== -1) {
                new_items = arrayMove([...prop_list], oldIndex, newIndex);
                return {...state, items: new_items};
            }
            return state;
        case "move_item":
            new_items = arrayMove(prop_list, action.oldIndex, action.newIndex);
            return {...state, items: new_items};
        case "add_at_index":
            new_items = [...prop_list];
            let new_item_at_index = {...defaults, ...action.new_item};
            new_item_at_index.identifier = guid();
            new_items.splice(action.insert_index, 0, new_item_at_index);
            return {...state, items: new_items};
        case "add_at_end":
            new_items = [...prop_list];
            let new_item_at_end = {...defaults, ...action.new_item};
            if (!new_item_at_end.hasOwnProperty("identifier")) {
                new_item_at_end.identifier = guid();
            }
            new_items.push(new_item_at_end);
            return {...state, items: new_items};
        case "clear_all":
            return {...state, items: []};
        default:
            console.log("Got Unknown action: " + action.type);
            return state
    }
}

function usePropertyListNoUndo(initial, initial_pane_height = 330, default_values = {}) {

    const [state, propListDispatch] = useReducer(propertyListReducer,
        {items: [], defaults: default_values}
    );
    const propListRef = useRef(state.items);
    propListRef.current = state.items;
    default_values["pane_height"] = initial_pane_height;
    useEffect(() => {
        propListDispatch({
            type: "initialize",
            new_items: initial,
            initial_pane_height,
            default_values
        });
    }, []);

    return [state.items, propListDispatch, propListRef]
}


function usePropertyList(initial, initial_pane_height = 330, default_values = {}, useUndo = false) {

    const [state, propListDispatch] = useReducer(propertyListReducer,
        {items: [], defaults: default_values}
    );
    const {undoHandler, redoHandler, undoStackRef, redoStackRef, stagedUndoEntryRef, commitUndoEntry} = useContext(UndoContext);
    const propListRef = useRef(state.items);
    propListRef.current = state.items;
    default_values["pane_height"] = initial_pane_height;
    let modDispatch = propListDispatch;
    if (undoStackRef) {
        modDispatch = makeUndoable(propListDispatch, propListRef, createPropertyListUndoAction);
    }
    useEffect(() => {
        modDispatch({
            type: "initialize",
            new_items: initial,
            initial_pane_height,
            default_values
        });
    }, []);

    return [state.items, modDispatch, propListRef]
}

function createPropertyListUndoAction(action, stateRef, stagedUndoEntryRef) {
    let listBefore = stateRef.current;
    let undoAction = null;
    let doDebounce = false;
    let forceCommit = true;
    switch (action.type) {
        case "update_item":
            const oldItem = listBefore.find(t => t.identifier === action.identifier);
            if (!oldItem) {
                break;
            }
            if (stagedUndoEntryRef.current
                && stagedUndoEntryRef.current.undoAction.identifier === action.identifier
                && stagedUndoEntryRef.current.undoAction.type === "update_item") {
                forceCommit = false
            }
            for (let field in action.new_item) {
                if (oldItem && oldItem.hasOwnProperty(field) && oldItem[field] !== action.new_item[field]) {
                    undoAction = {
                        type: "update_item",
                        identifier: action.identifier,
                        new_item: {...oldItem}
                    }
                    doDebounce = true;
                    break;
                }
            }
            break;

        case "delete_item":
            const deletedItem = listBefore.find(t => t.identifier === action.identifier);
            if (deletedItem) {
                undoAction = {
                    type: "add_at_end",
                    new_item: {...deletedItem}
                }
            }
            break;

        case "add_at_end":
            const addedId = action.new_item.identifier;
            if (addedId) {
                undoAction = {
                    type: "delete_item",
                    identifier: addedId
                }
            }
            break;

        case "move_item":
            undoAction = {
                type: "move_item",
                oldIndex: action.newIndex,
                newIndex: action.oldIndex
            };
            break;

        case "add_at_index":
            const insertIndex = action.insert_index;
            const insertedItem = listBefore[insertIndex];
            if (insertedItem) {
                undoAction = {
                    type: "delete_item",
                    identifier: insertedItem.identifier
                }
            }
            break;

        default:
            break;
    }
    return [undoAction, doDebounce, forceCommit];
}
