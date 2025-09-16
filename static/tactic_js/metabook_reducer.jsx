import {arrayMove} from "./utilities_react";
import debounce from "lodash/debounce";

export {metabookReducer, makeUndoableDispatch, getNodeFromidentifier};

function getNodeFromidentifier(identifier, node_list) {
    for (let node of node_list) {
        if (node._id === identifier) {
            return node
        }
    }
    return null
}

const text_defaults = {
    show_markdown: true,
    am_shrunk: false,
    node_text: ""
};

const divider_defaults = {};

const defaults = {
    text: text_defaults,
    divider: divider_defaults
};

function metabookReducer(state, action) {
    const nodeList = state.nodes;
    const selectedNode = state.selectedNode || null;
    let new_nodes;
    switch (action.type) {
        case "initialize":
            if (action.new_nodes == null || action.new_nodes.length === 0) {
                new_nodes = [];
            }
            else {
                new_nodes = action.new_nodes.map(t => {
                    return {...defaults[t.type], ...t};
                })
            }
            return {selectedNode: null, nodes: new_nodes};

        case "select_node":
            const selected_id = action._id;
            return {...state, selectedNode: selected_id};

        case "delete_node":
            new_nodes = nodeList.filter(t => t.identifier !== action.identifier);
            return {...state, nodes: new_nodes};
        case "update_node":
            const identifier = action._id;
            new_nodes = nodeList.map(t => {
                if (t._id == identifier) {
                    const update_dict = action.new_node;
                    return {...t, ...update_dict};
                } else {
                    return t;
                }
            });
            return {...state, nodes: new_nodes};
        case "move_node_over":
            const active_id = action["active_identifier"];
            const over_id = action["over_identifier"];
            const oldIndex = nodeList.findIndex((i) => i._id === active_id);
            const newIndex = nodeList.findIndex((i) => i._id === over_id);
            if (oldIndex !== -1 && newIndex !== -1) {
                new_nodes = arrayMove([...nodeList], oldIndex, newIndex);
                return {...state, nodes: new_nodes};
            }
            return state;
        case "move_node":
            new_nodes = arrayMove(nodeList, action.oldIndex, action.newIndex);
            return {...state, nodes: new_nodes};
        case "add_at_index":
            new_nodes = [...nodeList];
            let new_node_at_index = {...defaults, ...action.new_node};
            new_nodes.splice(action.insert_index, 0, new_node_at_index);
            return {...state, nodes: new_nodes};
        case "add_at_end":
            new_nodes = [...nodeList];
            let new_node_at_end = {...action.new_node};
            new_nodes.push(new_node_at_end);
            return {...state, nodes: new_nodes};
        case "clear_all":
            return {...state, nodes: []};
        default:
            console.log("Got Unknown action: " + action.type);
            return state
    }
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
            case "update_node":
                const oldnode = listBefore.find(t => t._id === action._id);
                if (oldnode && !stagedUndoEntry) {
                    undoEntry = {
                        dispatch,
                        undoAction: {
                            type: "update_node",
                            _id: action._id,
                            new_node: {...oldnode}
                        },
                        description: `${listName}: Undo node update`
                    };
                    stagedUndoEntry = undoEntry;
                }
                scheduleCommit();
                break;

            case "delete_node":
                const deletednode = listBefore.find(t => t._id === action._id);
                if (deletednode) {
                    undoEntry = {
                        dispatch,
                        undoAction: {
                            type: "add_at_end",
                            new_node: {...deletednode}
                        },
                        description: `${listName}: Undo delete`
                    };
                }
                break;

            case "add_at_end":
                const addedId = action.new_node._id;
                if (addedId) {
                    undoEntry = {
                        dispatch,
                        undoAction: {
                            type: "delete_node",
                            _id: addedId
                        },
                        description: `${listName}: Undo add at end`
                    };
                }
                break;

            case "move_node":
                undoEntry = {
                    dispatch,
                    undoAction: {
                        type: "move_node",
                        oldIndex: action.newIndex,
                        newIndex: action.oldIndex
                    },
                    description: `${listName}: Undo move`
                };
                break;

            case "add_at_index":
                const insertIndex = action.insert_index;
                const insertednode = listBefore[insertIndex];
                if (insertednode) {
                    undoEntry = {
                        dispatch,
                        undoAction: {
                            type: "delete_node",
                            _id: insertednode._id
                        },
                        description: `${listName}: Undo insert at index`
                    };
                }
                break;

            default:
                break;
        }

        dispatch(action);
        if (undoEntry) {
            undoStackRef.current.push(undoEntry);
        }
    };
}