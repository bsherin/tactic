import {arrayMove, guid} from "./utilities_react";
import {useEffect, useReducer, useRef} from "react";
import debounce from "lodash/debounce";

export {usePropertyList, propertyListReducer, makeUndoableDispatch};

function propertyListReducer(prop_list, action) {
    var new_items;
    switch (action.type) {
        case "initialize":
            if (prop_list == null || prop_list.length === 0) {
                new_items = [];
            } else {
                new_items = action.new_items.map(t => {
                    let new_t = {...t};
                    new_t.identifier = guid();
                    if (!new_t.hasOwnProperty("pane_height")) {
                        new_t.pane_height = action.initial_pane_height;
                    }
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


function usePropertyList(initial, initial_pane_height = 330) {

    const [propList, propListDispatch] = useReducer(propertyListReducer, initial);
    const propListRef = useRef(propList);
    propListRef.current = propList;
    useEffect(() => {
        propListDispatch({type: "initialize", new_items: initial, initial_pane_height});
    }, []);

    return [propList, propListDispatch, propListRef]
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
        const listBefore = [...listRef.current];
        let undoEntry = null;

        switch (action.type) {
            case "update_item": {
                let oldItem = listBefore.find(t => t.identifier === action.identifier);
                if (oldItem && !stagedUndoEntry) {
                    undoEntry = {
                        dispatch,
                        undoAction: {
                            type: "update_item",
                            identifier: action.identifier,
                            new_item: {...oldItem}
                        },
                        description: `${listName}: Undo item update`
                    };
                    stagedUndoEntry = undoEntry;
                }
                scheduleCommit()
                break;
            }

            case "delete_item": {
                const deletedItem = listBefore.find(t => t.identifier === action.identifier);
                if (deletedItem) {
                    undoEntry = {
                        dispatch,
                        undoAction: {
                            type: "add_at_end",
                            new_item: {...deletedItem}
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