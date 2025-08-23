import {guid} from "./utilities_react";

export {consoleItemsReducer}

function concatenateSortedValues(dict) {
    const sortedKeys = Object.keys(dict).map(Number).sort((a, b) => a - b);
    return sortedKeys.map(key => dict[key]).join('<br>');
}

function processOutputDicts(items) {
    return items.map(t => {
        if (t.type == "code") {
            let new_t = {...t};
            new_t["output_text"] = concatenateSortedValues(new_t["output_dict"]);
            return new_t;
        } else {
            return t;
        }
    })
}

function updateOutputText(item) {
    if (item.type == "code") {
        item["output_text"] = concatenateSortedValues(item["output_dict"]);
    }
    return item
}

function fixOutputRow(orow) {
    let new_row = orow;

    if (typeof orow == "string") {
        new_row = {widgetId: guid(), widgetKind: "rawHtml", widgetData: {value: orow}};
    }
    return new_row;
}

function fixCodeOutputs(item) {
    if (item.type == "code") {
        let new_item = {...item};
        let new_output_dict = {};
        for (let key in item["output_dict"]) {
            new_output_dict[key] = fixOutputRow(item["output_dict"][key]);
        }
        new_item["output_dict"] = new_output_dict;
        return new_item;
    }
    return item;
}

function consoleItemsReducer(console_items, action) {
    let new_items;
    switch (action.type) {
        case "initialize":
            // new_items = processOutputDicts(action.new_items);
            new_items = action.new_items.map(t => fixCodeOutputs(t));
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
        case "replace_item":
            new_items = console_items.map(t => {
                if (t.unique === action.unique_id) {
                    let new_t = {...action.new_item};
                    new_t = fixCodeOutputs(new_t);
                    return new_t
                    // return updateOutputText(new_t);
                }else {
                        return t;
                    }
                }
            );
            break;
        case "clear_all_selected":
            new_items = console_items.map(t => {
                let new_t = {...t};
                new_t.am_selected = false;
                new_t.search_string = null;
                return new_t
            });
            break;
        case "change_item_value":
            console.log(`change item_value ${action.field} ${String(action.new_value)}`);
            new_items = console_items.map(t => {
                if (t.unique_id === action.unique_id) {
                    let new_t = {...t};
                    new_t[action.field] = action.new_value;
                    new_t = fixCodeOutputs(new_t);
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
                    new_t["output_dict"] = action.new_value
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
                    new_t["output_dict"] = {}
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
                    const sortedOutputKeys = Object.keys(new_t["output_dict"]).map(Number).sort((a, b) => a - b);
                    new_t["output_dict"] = sortedOutputKeys.map(key => {
                        let d = new_t["output_dict"][key]
                        let new_d = {...d};
                        if (d.widgetId == action.widgetId) {
                            new_d.widgetData = {...new_t.widgetData, ...action.widgetData};
                            return new_d
                        }
                        else {
                            return d
                        }
                    })
                    return new_t;
                } else {
                    return t;
                }
            });
            break;

        case "replace_code_output_row":
            new_items = console_items.map(t => {
                if (t.unique_id === action.unique_id) {
                    let new_t = {...t};
                    new_t["output_dict"][action.row] = {...new_t["output_dict"][action.row], ...action.new_value};
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
                    new_t = fixCodeOutputs(new_t);
                    return new_t;
                    // return updateOutputText({...t, ...update_dict});
                } else {
                    return t;
                }
            });
            break;
        case "add_at_index":
            new_items = [...console_items];
            // new_items.splice(action.insert_index, 0, ...processOutputDicts(action.new_items));
            let new_fixed_items = action.new_items.map(t => fixCodeOutputs(t));
            new_items.splice(action.insert_index, 0, ...new_fixed_items);
            break;
        case "open_listed_dividers":
            new_items = console_items.map(t => {
                if (t.type == "divider" && t.divider_list.includes(t.unique_id)) {
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
        default:
            console.log("Got Unknown action: " + action.type);
            return [...console_items]
    }
    return new_items
}