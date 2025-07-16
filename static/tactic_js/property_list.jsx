import {arrayMove, guid} from "./utilities_react";
import {useEffect, useReducer, useRef} from "react";
import debounce from "lodash/debounce";

export {usePropertyList, propertyListReducer, makeUndoableDispatch};

function propertyListReducer(state, action) {
    const prop_list = state.items;
    const defaults = state.default_values || {};
    let new_items;
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
            return { items: new_items, default_values: initDefaults };
        case "delete_item":
            new_items = prop_list.filter(t => t.identifier !== action.identifier);
            return { ...state, items: new_items }
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
            return { ...state, items: new_items }
        case "move_item_over":
            const active_id = action["active_identifier"];
            const over_id = action["over_identifier"];
            const oldIndex = prop_list.findIndex((i) => i.identifier === active_id);
            const newIndex = prop_list.findIndex((i) => i.identifier === over_id);
            if (oldIndex !== -1 && newIndex !== -1) {
                new_items = arrayMove([...prop_list], oldIndex, newIndex);
                return { ...state, items: new_items };
            }
            return state
        case "move_item":
            new_items = arrayMove(prop_list, action.oldIndex, action.newIndex);
            return { ...state, items: new_items };
        case "add_at_index":
            new_items = [...prop_list];
            let new_item_at_index = { ...defaults, ...action.new_item };
            new_item_at_index.identifier = guid();
            new_items.splice(action.insert_index, 0, new_item_at_index);
            return { ...state, items: new_items };
        case "add_at_end":
            new_items = [...prop_list];
            let new_item_at_end = { ...defaults, ...action.new_item };
            if (!new_item_at_end.hasOwnProperty("identifier")) {
                new_item_at_end.identifier = guid();
            }
            new_items.push(new_item_at_end);
            return { ...state, items: new_items };
        case "clear_all":
            return { ...state, items: [] };
        default:
            console.log("Got Unknown action: " + action.type);
            return state
    }
}


function usePropertyList(initial, initial_pane_height = 330, default_values = {}) {

    const [state, propListDispatch] = useReducer(propertyListReducer,
        { items: [], defaults: default_values }
    );
    const propListRef = useRef(state.items);
    propListRef.current = state.items;
    default_values["pane_height"] = initial_pane_height;
    useEffect(() => {
        propListDispatch({
            type: "initialize",
            new_items: initial,
            initial_pane_height,
            default_values});
    }, []);

    return [state.items, propListDispatch, propListRef]
}

function makeUndoableDispatch(dispatch, listRef, listName, undoStackRef) {
    let stagedUndoEntry = null;

    const commitUndoEntry = () => {
        if (stagedUndoEntry) {
            undoStackRef.current.push(stagedUndoEntry);
            stagedUndoEntry = null;
        }
    };

    const scheduleCommit = debounce(commitUndoEntry, 1000);  // 1s idle = finalize

    return function (action) {
        const listBefore = [...listRef.current]; // <— now accessing `.items`
        let undoEntry = null;

        switch (action.type) {
            case "update_item": {
                const oldItem = listBefore.find(t => t.identifier === action.identifier);
                if (oldItem && !stagedUndoEntry) {
                    undoEntry = {
                        dispatch,
                        undoAction: {
                            type: "update_item",
                            identifier: action.identifier,
                            new_item: { ...oldItem }
                        },
                        description: `${listName}: Undo item update`
                    };
                    stagedUndoEntry = undoEntry;
                }
                scheduleCommit();
                break;
            }

            case "delete_item": {
                const deletedItem = listBefore.find(t => t.identifier === action.identifier);
                if (deletedItem) {
                    undoEntry = {
                        dispatch,
                        undoAction: {
                            type: "add_at_end",
                            new_item: { ...deletedItem }
                        },
                        description: `${listName}: Undo delete`
                    };
                }
                break;
            }

            case "add_at_end": {
                const addedId = action.new_item.identifier;
                if (addedId) {
                    undoEntry = {
                        dispatch,
                        undoAction: {
                            type: "delete_item",
                            identifier: addedId
                        },
                        description: `${listName}: Undo add at end`
                    };
                }
                break;
            }

            case "move_item": {
                undoEntry = {
                    dispatch,
                    undoAction: {
                        type: "move_item",
                        oldIndex: action.newIndex,
                        newIndex: action.oldIndex
                    },
                    description: `${listName}: Undo move`
                };
                break;
            }

            case "add_at_index": {
                const insertIndex = action.insert_index;
                const insertedItem = listBefore[insertIndex];
                if (insertedItem) {
                    undoEntry = {
                        dispatch,
                        undoAction: {
                            type: "delete_item",
                            identifier: insertedItem.identifier
                        },
                        description: `${listName}: Undo insert at index`
                    };
                }
                break;
            }

            default:
                break;
        }

        dispatch(action);
        if (undoEntry) {
            undoStackRef.current.push(undoEntry);
        }
    };
}