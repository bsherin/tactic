
import {Regions} from "@blueprintjs/table";

export {paneReducer, get_index, get_index_from_id, _match_row, _match_row_by_id, _match_any_row}

const blank_resource = {"name": "", "_id": "", "tags": "", "notes": "", "updated": "", "created": ""};

function _match_row(row1, row2) {
    return row1.name == row2.name && row1.res_type == row2.res_type
}

function _match_row_by_id(row1, row2) {
    return row1._id == row2._id
}

function _match_any_row(row1, row_list) {
    for (let row2 of row_list) {
        if (_match_row(row1, row2)) {
            return true
        }
    }
    return false
}

function get_index(name, res_type, data_dict) {
    for (let index in data_dict){
        if (_match_row(data_dict[index], {name: name, res_type: res_type})) {
            return index
        }
    }
    return null
}

function get_index_from_id(_id, data_dict) {
    for (let index in data_dict) {
        if (_match_row_by_id(data_dict[index], {_id: _id})) {
            return index
        }
    }
    return null
}

function paneReducer(draft, action) {

    let ind;
    let _id;
    let search_state_update;
    switch (action.type) {
        case "UPDATE_ROW":
            if (!action.index) return;
            let the_row = draft.data_dict[action.index];
            for (let field in action.res_dict) {
                the_row[field] = action.res_dict[field];
            }
            draft.rowChanged += 1;
            break;
        case "DELETE_ROW":
            delete draft.data_dict[String(action.index)];
            draft.num_rows = draft.num_rows - 1;
            draft.rowChanged += 1;
            break;
        case "SELECT_ROW":
            search_state_update = {
                selected_resource: draft.data_dict[action.index],
                list_of_selected: [draft.data_dict[action.index].name],
                selected_rows: [draft.data_dict[action.index]],
                multi_select: false,
                selectedRegions: [Regions.row(action.index)]
            };
            draft.select_state = {...draft.select_state, ...action.search_state_update};
            break;
        case "CLEAR_SELECTED":
            const select_state_update = {
                selected_resource: blank_resource,
                list_of_selected: [],
                selected_rows: [],
                multi_select: false,
                selectedRegions: [Regions.row(0)],
            };
            draft.select_state = {...draft.select_state, ...select_state_update};
            break;
        case "UPDATE_SELECT_STATE":
            draft.select_state = {...draft.select_state, ...action.select_state};
            break;
        case "UPDATE_SEARCH_STATE":
            draft.search_state = {...draft.search_state, ...action.search_state};
            break;
        case "SET_TAG_LIST":
            draft.tag_list = action.tag_list;
            break;
        case "INIT_DATA_DICT":
            draft.data_dict = action.data_dict;
            draft.num_rows = action.num_rows;
            draft.rowChanged += 1;
            break;
        case "UPDATE_DATA_DICT":
            draft.data_dict = {...draft.data_dict, ...action.data_dict};
            draft.num_rows = action.num_rows;
            draft.rowChanged += 1;
            break;
        case "SET_CONTEXT_MENU_ITEMS":
            draft.contextMenuItems = action.context_menu_items;
            break;
        default:
            console.log("Got Unknown action: " + action.type);
        return
    }
}

