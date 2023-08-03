"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consoleItemsReducer = consoleItemsReducer;
function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function consoleItemsReducer(console_items, action) {
  var _new_items;
  var new_items;
  switch (action.type) {
    case "initialize":
      new_items = action.new_items;
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
          new_t.output_text = "";
          new_t.execution_count = 0;
          return new_t;
        }
      });
      break;
    case "replace_item":
      new_items = console_items.map(function (t) {
        if (t.unique === action.unique_id) {
          return action.new_item;
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
          return _objectSpread(_objectSpread({}, t), update_dict);
        } else {
          return t;
        }
      });
      break;
    case "add_at_index":
      new_items = _toConsumableArray(console_items);
      (_new_items = new_items).splice.apply(_new_items, [action.insert_index, 0].concat(_toConsumableArray(action.new_items)));
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