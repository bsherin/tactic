import {guid} from "./utilities_react";
export {consoleItemsReducer, createConsoleUndoAction}

function fixOutputRowRecursively(wdict) {
    let new_wdict = wdict;

    if (typeof wdict == "string") {
        new_wdict = {widgetId: guid(), widgetKind: "rawHtml", widgetData: {value: wdict}};
    } else if ("widgets" in wdict.widgetData) {
        let new_wdict = {...wdict};
        new_wdict.widgetData.widgets = wdict.widgetData.widgets.map((w) => {
            return fixOutputRowRecursively(w)
        });
    }
    return new_wdict;
}

function fixCodeOutputs(item) {
    if (item.type == "code") {
        let new_item = {...item};
        try {
            let new_output_dict = {};
            const sortedOutputKeys = Object.keys(item["output_dict"]).map(Number).sort((a, b) => a - b);
            for (let key of sortedOutputKeys) {
                new_output_dict[key] = fixOutputRowRecursively(item["output_dict"][key]);
            }
            new_item["output_dict"] = new_output_dict;
        } catch (e) {
            console.log("Error fixing code outputs: " + e);
        }

        return new_item;
    }
    return item;
}

function fixLogItemBodyRecursively(console_text) {
    let new_body = console_text;
    if (typeof new_body == "string") {
        new_body = [{widgetId: guid(), widgetKind: "rawHtml", widgetData: {value: console_text}}];
    } else {
        new_body = console_text.map((wdict) => {
                if ("widgets" in wdict.widgetData) {
                    let new_wdict = {...wdict};
                    new_wdict.widgetData.widgets = fixLogItemBodyRecursively(new_wdict.widgetData.widgets);
                    return new_wdict;
                } else {
                    return wdict;
                }
            }
        );
    }
    return new_body;
}

function fixLogItem(item) {
    if (item.type == "fixed") {
        let new_item = {...item};
        new_item.console_text = fixLogItemBodyRecursively(item.console_text);
        return new_item;
    }
    return item;
}

function fixItem(item) {
    let new_item = fixCodeOutputs(item);
    new_item = fixLogItem(new_item);
    return new_item;
}

function createConsoleUndoAction(action, stateRef, stagedUndoEntryRef) {
    let undoAction = null;
    let doDebounce = false;
    let forceCommit = true;
    switch (action.type) {
        case "delete_item":
            undoAction = {
                type: "add_at_index",
                new_items: stateRef.current.filter(t => t.unique_id === action.unique_id),
                insert_index: stateRef.current.findIndex(t => t.unique_id === action.unique_id)
            };
            break;
        case "delete_items":
            undoAction = {
                type: "add_at_index",
                new_items: stateRef.current.filter(t => action.id_list.includes(t.unique_id)),
                insert_index: Math.min(...stateRef.current.map((t, i) => action.id_list.includes(t.unique_id) ? i : Infinity))
            };
            break;
        case "delete_all_items":
            undoAction = {
                type: "initialize",
                new_items: [...stateRef.current]
            };
            break;
        case "add_at_index":
            undoAction = {
                type: "delete_items",
                id_list: action.new_items.map(t => t.unique_id)
            }
            break;
        case "change_item_value":
            const old_item = stateRef.current.find(t => t.unique_id === action.unique_id);
            if (old_item && action.field in old_item && old_item[action.field] !== action.new_value) {
                if (stagedUndoEntryRef.current && stagedUndoEntryRef.current.undoAction.type === "change_item_value"
                    && stagedUndoEntryRef.current.undoAction.unique_id === action.unique_id) {
                    forceCommit = false;
                }
                undoAction = {
                    type: "change_item_value",
                    unique_id: action.unique_id,
                    field: action.field,
                    new_value: old_item[action.field]
                }
                doDebounce = true
            }
            break;
        case "change_code_output":
            const old_code_item = stateRef.current.find(t => t.unique_id === action.unique_id);
            if (old_code_item) {
                undoAction = {
                    type: "change_code_output",
                    unique_id: action.unique_id,
                    new_value: old_code_item["output_dict"]
                }
            }
            break;
        case "replace_code_output_row":
            const old_row_item = stateRef.current.find(t => t.unique_id === action.unique_id);
            if (old_row_item) {
                undoAction = {
                    type: "replace_code_output_row",
                    unique_id: action.unique_id,
                    row: action.row,
                    new_value: old_row_item["output_dict"][action.row]
                }
            }
            break;
        case "update_items":
            const old_items = stateRef.current.filter(t => t.unique_id in action.updates);
            if (old_items.length > 0) {
                let updates = {};
                for (let item of old_items) {
                    updates[item.unique_id] = {};
                    for (let field in action.updates[item.unique_id]) {
                        updates[item.unique_id][field] = item[field]
                    }
                }
                undoAction = {
                    type: "update_items",
                    updates: updates
                }
            }
            break;
        default:
            return [null, false];
    }
    return [undoAction, doDebounce, forceCommit];
}

function consoleItemsReducer(console_items, action) {
    let new_items;
    switch (action.type) {
        case "initialize":
            // new_items = processOutputDicts(action.new_items);
            new_items = action.new_items.map(t => fixItem(t));
            break;
        case "delete_item":
            new_items = console_items.filter(t => t.unique_id !== action.unique_id);
            break;
        case "delete_items":
            new_items = console_items.filter(t => !(action.id_list.includes(t.unique_id)));
            break;
        case "delete_all_items":
            new_items = [];
            break;
        case "reset":
            new_items = console_items.map(t => {
                if (t.type != "code") {
                    return t
                } else {
                    let new_t = {...t};
                    new_t.output_dict = {};
                    new_t.output_text = "";
                    new_t.execution_count = 0;
                    return new_t
                }
            });
            break;
        case "clear_all_selected":
            new_items = console_items.map(t => {
                if (t.am_selected ) {
                    let new_t = {...t};
                    new_t.am_selected = false;
                    new_t.search_string = null;
                    return new_t
                } else {
                    return t;
                }
            });
            break;
        case "change_item_value":
            new_items = console_items.map(t => {
                if (t.unique_id === action.unique_id) {
                    let new_t = {...t};
                    new_t[action.field] = action.new_value;
                    new_t = fixItem(new_t);
                    return new_t;
                } else {
                    return t;
                }
            });
            break;

        case "change_code_output":
            new_items = console_items.map(t => {
                if (t.unique_id === action.unique_id) {
                    let new_t = {...t};
                    new_t["output_dict"] = action.new_value;
                    new_t = fixCodeOutputs(new_t);
                    return new_t
                    // return updateOutputText(new_t);
                } else {
                    return t;
                }
            });
            break;
        case "clear_code_output":
            new_items = console_items.map(t => {
                if (t.unique_id === action.unique_id) {
                    let new_t = {...t};
                    new_t["output_dict"] = {};
                    //return updateOutputText(new_t);
                    return new_t;
                } else {
                    return t;
                }
            });
            break;

        case "update_widget_data":
            new_items = console_items.map(t => {
                if (t.unique_id === action.unique_id) {
                    let new_t = {...t};
                    if (t.type == "code") {
                        const sortedOutputKeys = Object.keys(new_t["output_dict"]).map(Number).sort((a, b) => a - b);
                        new_t["output_dict"] = sortedOutputKeys.map(key => {
                            let d = new_t["output_dict"][key];
                            let new_d = {...d};
                            if (d.widgetId == action.widgetId) {
                                new_d.widgetData = {...new_t.widgetData, ...action.widgetData};
                                return new_d
                            } else {
                                return d
                            }
                        });
                        return new_t;
                    } else if (t.type == "fixed") {
                        new_t.console_text = new_t.console_text.map(d => {
                            let new_d = {...d};
                            if (d.widgetId == action.widgetId) {
                                new_d.widgetData = {...new_t.widgetData, ...action.widgetData};
                                return new_d
                            } else {
                                return d
                            }
                        });
                        return new_t;
                    }
                } else {
                    return t;
                }
            });
            break;

        case "replace_code_output_row":
            new_items = console_items.map(t => {
                if (t.unique_id === action.unique_id) {
                    let new_t = {...t};
                    const out = { ...new_t.output_dict };
                    out[action.row] = { ...out[action.row], ...action.new_value };
                    new_t.output_dict = out;
                    new_t = fixCodeOutputs(new_t);
                    // new_t = updateOutputText(new_t);
                    return new_t;
                } else {
                    return t;
                }
            });
            break;

        case "update_items":
            new_items = console_items.map(t => {
                if (t.unique_id in action.updates) {
                    const update_dict = action.updates[t.unique_id];
                    let new_t = {...t, ...update_dict};
                    new_t = fixItem(new_t);
                    return new_t;
                } else {
                    return t;
                }
            });
            break;
        case "add_at_index":
            new_items = [...console_items];
            let new_fixed_items = action.new_items.map(t => fixItem(t));
            new_items.splice(action.insert_index, 0, ...new_fixed_items);
            break;
        case "open_listed_dividers":
            new_items = console_items.map(t => {
                if (t.type == "divider" && t["divider_list"].includes(t.unique_id)) {
                    let new_t = {...t};
                    new_t.am_shrunk = false;
                    return new_t
                } else {
                    return t
                }
            });
            break;
        case "close_all_dividers":
            new_items = console_items.map(t => {
                if (t.type == "divider") {
                    let new_t = {...t};
                    new_t.am_shrunk = true;
                    return new_t
                } else {
                    return t
                }
            });
            break;
        case "open_all_dividers":
            new_items = console_items.map(t => {
                if (t.type == "divider") {
                    let new_t = {...t};
                    new_t.am_shrunk = false;
                    return new_t
                } else {
                    return t
                }
            });
            break;
        default:
            console.log("Got Unknown action: " + action.type);
            return [...console_items]
    }
    return new_items
}