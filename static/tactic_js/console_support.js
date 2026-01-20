"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.consoleItemsReducer = consoleItemsReducer;
var _utilities_react = require("./utilities_react");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function fixOutputRowRecursively(wdict) {
  var new_wdict = wdict;
  if (typeof wdict == "string") {
    new_wdict = {
      widgetId: (0, _utilities_react.guid)(),
      widgetKind: "rawHtml",
      widgetData: {
        value: wdict
      }
    };
  } else if ("widgets" in wdict.widgetData) {
    var _new_wdict = _objectSpread({}, wdict);
    _new_wdict.widgetData.widgets = wdict.widgetData.widgets.map(function (w) {
      return fixOutputRowRecursively(w);
    });
  }
  return new_wdict;
}
function fixCodeOutputs(item) {
  if (item.type == "code") {
    var new_item = _objectSpread({}, item);
    try {
      var new_output_dict = {};
      var sortedOutputKeys = Object.keys(item["output_dict"]).map(Number).sort(function (a, b) {
        return a - b;
      });
      var _iterator = _createForOfIteratorHelper(sortedOutputKeys),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var key = _step.value;
          new_output_dict[key] = fixOutputRowRecursively(item["output_dict"][key]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
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
  var new_body = console_text;
  if (typeof new_body == "string") {
    new_body = [{
      widgetId: (0, _utilities_react.guid)(),
      widgetKind: "rawHtml",
      widgetData: {
        value: console_text
      }
    }];
  } else {
    new_body = console_text.map(function (wdict) {
      if ("widgets" in wdict.widgetData) {
        var new_wdict = _objectSpread({}, wdict);
        new_wdict.widgetData.widgets = fixLogItemBodyRecursively(new_wdict.widgetData.widgets);
        return new_wdict;
      } else {
        return wdict;
      }
    });
  }
  return new_body;
}
function fixLogItem(item) {
  if (item.type == "fixed") {
    var new_item = _objectSpread({}, item);
    new_item.console_text = fixLogItemBodyRecursively(item.console_text);
    return new_item;
  }
  return item;
}
function fixItem(item) {
  var new_item = fixCodeOutputs(item);
  new_item = fixLogItem(new_item);
  return new_item;
}
function consoleItemsReducer(console_items, action) {
  var _new_items;
  var new_items;
  switch (action.type) {
    case "initialize":
      // new_items = processOutputDicts(action.new_items);
      new_items = action.new_items.map(function (t) {
        return fixItem(t);
      });
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
    case "clear_all_selected":
      new_items = console_items.map(function (t) {
        if (t.am_selected) {
          var new_t = _objectSpread({}, t);
          new_t.am_selected = false;
          new_t.search_string = null;
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "change_item_value":
      new_items = console_items.map(function (t) {
        if (t.unique_id === action.unique_id) {
          var new_t = _objectSpread({}, t);
          new_t[action.field] = action.new_value;
          new_t = fixItem(new_t);
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
          new_t = fixCodeOutputs(new_t);
          return new_t;
          // return updateOutputText(new_t);
        } else {
          return t;
        }
      });
      break;
    case "clear_code_output":
      new_items = console_items.map(function (t) {
        if (t.unique_id === action.unique_id) {
          var new_t = _objectSpread({}, t);
          new_t["output_dict"] = {};
          //return updateOutputText(new_t);
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "update_widget_data":
      new_items = console_items.map(function (t) {
        if (t.unique_id === action.unique_id) {
          var new_t = _objectSpread({}, t);
          if (t.type == "code") {
            var sortedOutputKeys = Object.keys(new_t["output_dict"]).map(Number).sort(function (a, b) {
              return a - b;
            });
            new_t["output_dict"] = sortedOutputKeys.map(function (key) {
              var d = new_t["output_dict"][key];
              var new_d = _objectSpread({}, d);
              if (d.widgetId == action.widgetId) {
                new_d.widgetData = _objectSpread(_objectSpread({}, new_t.widgetData), action.widgetData);
                return new_d;
              } else {
                return d;
              }
            });
            return new_t;
          } else if (t.type == "fixed") {
            new_t.console_text = new_t.console_text.map(function (d) {
              var new_d = _objectSpread({}, d);
              if (d.widgetId == action.widgetId) {
                new_d.widgetData = _objectSpread(_objectSpread({}, new_t.widgetData), action.widgetData);
                return new_d;
              } else {
                return d;
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
      new_items = console_items.map(function (t) {
        if (t.unique_id === action.unique_id) {
          var new_t = _objectSpread({}, t);
          var out = _objectSpread({}, new_t.output_dict);
          out[action.row] = _objectSpread(_objectSpread({}, out[action.row]), action.new_value);
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
      new_items = console_items.map(function (t) {
        if (t.unique_id in action.updates) {
          var update_dict = action.updates[t.unique_id];
          var new_t = _objectSpread(_objectSpread({}, t), update_dict);
          new_t = fixItem(new_t);
          return new_t;
        } else {
          return t;
        }
      });
      break;
    case "add_at_index":
      new_items = _toConsumableArray(console_items);
      var new_fixed_items = action.new_items.map(function (t) {
        return fixItem(t);
      });
      (_new_items = new_items).splice.apply(_new_items, [action.insert_index, 0].concat(_toConsumableArray(new_fixed_items)));
      break;
    case "open_listed_dividers":
      new_items = console_items.map(function (t) {
        if (t.type == "divider" && t["divider_list"].includes(t.unique_id)) {
          var new_t = _objectSpread({}, t);
          new_t.am_shrunk = false;
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
          new_t.am_shrunk = true;
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