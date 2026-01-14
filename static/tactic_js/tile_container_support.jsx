
import {arrayMove} from "./utilities_react"
import {guid} from "./utilities_react"

export {tilesReducer}

function fixFrontContentRecursively(front_content) {
    let front_list = [];

    if (typeof front_content == "string") {
        front_list.push({widgetId: guid(), widgetKind: "rawHtml", widgetData: {value: front_content}});
    }
    else if (!Array.isArray(front_content)) {
        let new_content = {...front_content};
        if ("widgets" in new_content.widgetData) {
            new_content.widgetData.widgets = fixFrontContentRecursively(new_content.widgetData.widgets);
        }
        front_list.push(new_content);
    }
    else {
        front_list = front_content.map((wdict) => {
            if ("widgets" in wdict.widgetData) {
                let new_content = {...wdict};
                new_content.widgetData.widgets = fixFrontContentRecursively(new_content.widgetData.widgets);
                return new_content
            }
            return wdict;
        })
    }
    return front_list
}

function fixTileFrontContent(tileDict) {
    tileDict["front_content"] = fixFrontContentRecursively(tileDict["front_content"]);
    return tileDict;
}

function recursivelySetWidgetData(widgetList, widgetId, widgetData) {
    return widgetList.map(d => {
        let new_d = {...d};
        if (d.widgetId == widgetId) {
            new_d.widgetData = {...new_d.widgetData, ...widgetData};
            if ("widgets" in new_d.widgetData) {
                new_d.widgetData.widgets = recursivelySetWidgetData(new_d.widgetData.widgets, widgetId, widgetData);
            }
            return new_d
        }
        else {
            if ("widgets" in new_d.widgetData) {
                new_d.widgetData.widgets = recursivelySetWidgetData(new_d.widgetData.widgets, widgetId, widgetData);
            }
            return new_d
        }
    })
}


function tilesReducer(tile_list, action) {
    let new_items;
    switch (action.type) {
        case "initialize":
            new_items = action.new_items.map(t => fixTileFrontContent(t));
            break;
        case "delete_item":
            new_items = tile_list.filter(t => t.tile_id !== action.tile_id);
            break;
        case "change_item_value":
            let new_value;
            if (action.field === "front_content") {
                new_value = fixFrontContentRecursively(action.new_value);
            } else {
                new_value = action.new_value;
            }
            new_items = tile_list.map(t => {
                if (t.tile_id === action.tile_id) {
                    let new_t = {...t};
                    new_t[action.field] = new_value;
                    return new_t;
                } else {
                    return t;
                }
            });
            break;

        case "change_item_state":
            new_items = tile_list.map(t => {
                if (t.tile_id === action.tile_id) {
                    let new_t = {...t};
                    for (let field in action.new_state) {
                        new_t[field] = action.new_state[field]
                    }
                    new_t = fixTileFrontContent(new_t);
                    return new_t;
                } else {
                    return t;
                }
            });
            break;

        case "change_items_value":  // Only used to mark source change
            new_items = tile_list.map(t => {
                if (action.id_list.includes(t.tile_id)) {
                    let new_t = {...t};
                    new_t[action.field] = action.new_value;
                    return new_t;
                } else {
                    return t;
                }
            });
            break;

        case "update_widget_data":
            new_items = tile_list.map(t => {
                if (t.tile_id === action.tile_id) {
                    let new_t = {...t};
                    new_t["front_content"] = recursivelySetWidgetData(t.front_content, action.widgetId, action.widgetData);
                    new_t = fixTileFrontContent(new_t);
                    return new_t;
                } else {
                    return t;
                }
            });
            break;
        case "move_item":
            let old_list = [...tile_list];
            new_items = arrayMove(old_list, action.oldIndex, action.newIndex);
            break;
        case "add_at_index":
            new_items = [...tile_list];
            let new_item = fixTileFrontContent(action.new_item);
            new_items.splice(action.insert_index, 0, new_item);
            break;
        default:
            console.log("Got Unknown action: " + action.type);
            return [...tile_list]
    }
    return new_items
}