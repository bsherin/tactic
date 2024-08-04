"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consoleItemsReducer = consoleItemsReducer;
function consoleItemsReducer(console_items, action) {
  var new_items;
  switch (action.type) {
    case "initialize":
      new_items = action.new_items;
      break;
    case "delete_item":
      new_items = console_items.filter(t => t.unique_id !== action.unique_id);
      break;
    case "delete_items":
      new_items = console_items.filter(t => !action.id_list.includes(t.unique_id));
      break;
    case "delete_all_items":
      new_items = [];
      break;
    case "reset":
      new_items = console_items.map(t => {
        if (t.type != "code") {
          return t;
        } else {
          let new_t = {
            ...t
          };
          new_t.output_text = "";
          new_t.execution_count = 0;
          return new_t;
        }
      });
      break;
    case "replace_item":
      new_items = console_items.map(t => {
        if (t.unique === action.unique_id) {
          return action.new_item;
        } else {
          return t;
        }
      });
      break;
    case "clear_all_selected":
      new_items = console_items.map(t => {
        let new_t = {
          ...t
        };
        new_t.am_selected = false;
        new_t.search_string = null;
        return new_t;
      });
      break;
    case "change_item_value":
      new_items = console_items.map(t => {
        if (t.unique_id === action.unique_id) {
          let new_t = {
            ...t
          };
          new_t[action.field] = action.new_value;
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "change_code_output_row":
      new_items = console_items.map(t => {
        if (t.unique_id === action.unique_id) {
          let new_t = {
            ...t
          };
          new_t["output_dict"][action.row] = action.new_value;
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
          return {
            ...t,
            ...update_dict
          };
        } else {
          return t;
        }
      });
      break;
    case "add_at_index":
      new_items = [...console_items];
      new_items.splice(action.insert_index, 0, ...action.new_items);
      break;
    case "open_listed_dividers":
      new_items = console_items.map(t => {
        if (t.type == "divider" && t.divider_list.includes(t.unique_id)) {
          let new_t = {
            ...t
          };
          new_t.am_shurnk = false;
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "close_all_dividers":
      new_items = console_items.map(t => {
        if (t.type == "divider") {
          let new_t = {
            ...t
          };
          new_t.am_shurnk = true;
          return new_t;
        } else {
          return t;
        }
      });
      break;
    default:
      console.log("Got Unknown action: " + action.type);
      return [...console_items];
  }
  return new_items;
}