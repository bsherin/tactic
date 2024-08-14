"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consoleItemsReducer = consoleItemsReducer;
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function concatenateSortedValues(dict) {
  var sortedKeys = Object.keys(dict).map(Number).sort(function (a, b) {
    return a - b;
  });
  return sortedKeys.map(function (key) {
    return dict[key];
  }).join('<br>');
}
function processOutputDicts(items) {
  return items.map(function (t) {
    if (t.type == "code") {
      var new_t = _objectSpread({}, t);
      new_t["output_text"] = concatenateSortedValues(new_t["output_dict"]);
      return new_t;
    } else {
      return t;
    }
  });
}
function updateOutputText(item) {
  if (item.type == "code") {
    item["output_text"] = concatenateSortedValues(item["output_dict"]);
  }
  return item;
}
function consoleItemsReducer(console_items, action) {
  var _new_items;
  var new_items;
  switch (action.type) {
    case "initialize":
      new_items = processOutputDicts(action.new_items);
      break;
    case "delete_item":
      new_items = console_items.filter(function (t) {
        return t.unique_id !== action.unique_id;
      });
      break;
    case "delete_items":
      new_items = console_items.filter(function (t) {
        return !action.id_list.includes(t.unique_id);
      });
      break;
    case "delete_all_items":
      new_items = [];
      break;
    case "reset":
      new_items = console_items.map(function (t) {
        if (t.type != "code") {
          return t;
        } else {
          var new_t = _objectSpread({}, t);
          new_t.output_dict = {};
          new_t.output_text = "";
          new_t.execution_count = 0;
          return new_t;
        }
      });
      break;
    case "replace_item":
      new_items = console_items.map(function (t) {
        if (t.unique === action.unique_id) {
          var new_t = _objectSpread({}, action.new_item);
          updateOutputText(new_t);
        } else {
          return t;
        }
      });
      break;
    case "clear_all_selected":
      new_items = console_items.map(function (t) {
        var new_t = _objectSpread({}, t);
        new_t.am_selected = false;
        new_t.search_string = null;
        return new_t;
      });
      break;
    case "change_item_value":
      new_items = console_items.map(function (t) {
        if (t.unique_id === action.unique_id) {
          var new_t = _objectSpread({}, t);
          new_t[action.field] = action.new_value;
          new_t = updateOutputText(new_t);
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "change_code_output":
      new_items = console_items.map(function (t) {
        if (t.unique_id === action.unique_id) {
          var new_t = _objectSpread({}, t);
          new_t["output_dict"] = action.new_value;
          new_t = updateOutputText(new_t);
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "change_code_output_row":
      new_items = console_items.map(function (t) {
        if (t.unique_id === action.unique_id) {
          var new_t = _objectSpread({}, t);
          new_t["output_dict"][action.row] = action.new_value;
          new_t = updateOutputText(new_t);
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "update_items":
      new_items = console_items.map(function (t) {
        if (t.unique_id in action.updates) {
          var update_dict = action.updates[t.unique_id];
          return updateOutputText(_objectSpread(_objectSpread({}, t), update_dict));
        } else {
          return t;
        }
      });
      break;
    case "add_at_index":
      new_items = _toConsumableArray(console_items);
      (_new_items = new_items).splice.apply(_new_items, [action.insert_index, 0].concat(_toConsumableArray(processOutputDicts(action.new_items))));
      break;
    case "open_listed_dividers":
      new_items = console_items.map(function (t) {
        if (t.type == "divider" && t.divider_list.includes(t.unique_id)) {
          var new_t = _objectSpread({}, t);
          new_t.am_shurnk = false;
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "close_all_dividers":
      new_items = console_items.map(function (t) {
        if (t.type == "divider") {
          var new_t = _objectSpread({}, t);
          new_t.am_shurnk = true;
          return new_t;
        } else {
          return t;
        }
      });
      break;
    default:
      console.log("Got Unknown action: " + action.type);
      return _toConsumableArray(console_items);
  }
  return new_items;
}