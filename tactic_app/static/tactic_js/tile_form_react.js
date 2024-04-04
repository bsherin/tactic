"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TileForm = TileForm;
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _lodash = _interopRequireDefault(require("lodash"));
var _reactCodemirror = require("./react-codemirror");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _utilities_react = require("./utilities_react");
var _pool_tree = require("./pool_tree");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var selector_types = ["column_select", "tokenizer_select", "weight_function_select", "cluster_metric", "tile_select", "document_select", "list_select", "collection_select", "function_select", "class_select", "palette_select", "custom_list"];
var selector_type_icons = {
  column_select: "one-column",
  tokenizer_select: "function",
  weight_function_select: "function",
  cluster_metric: "function",
  tile_select: "application",
  document_select: "document",
  list_select: "properties",
  collection_select: "database",
  function_select: "function",
  class_select: "code",
  palette_select: "tint",
  custom_list: "property"
};
function TileForm(props) {
  function _updateValue(att_name, new_value, callback) {
    props.updateValue(att_name, new_value, callback);
  }
  function _submitOptions(e) {
    props.handleSubmit(props.tile_id);
    e.preventDefault();
  }
  var all_items = [];
  var section_items = null;
  var in_section = false;
  var option_items = all_items;
  var current_section_att_name = "";
  var current_section_display_text = "";
  var current_section_start_open = false;
  var _iterator = _createForOfIteratorHelper(props.options),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var option = _step.value;
      if ("visible" in option && !option["visible"]) continue;
      var att_name = option["name"];
      var display_text = void 0;
      if ("display_text" in option && option.display_text != null && option.display_text != "") {
        display_text = option["display_text"];
      } else {
        display_text = null;
      }
      if (option["type"] == "divider") {
        if (in_section) {
          all_items.push( /*#__PURE__*/_react["default"].createElement(FormSection, {
            att_name: current_section_att_name,
            key: current_section_att_name,
            display_text: current_section_display_text,
            section_items: section_items,
            start_open: current_section_start_open
          }));
        }
        section_items = [];
        option_items = section_items;
        in_section = true;
        current_section_att_name = att_name;
        current_section_display_text = display_text;
        if ("start_open" in option) {
          current_section_start_open = option["start_open"];
        } else {
          current_section_start_open = false;
        }
        continue;
      }
      if (selector_types.includes(option["type"])) {
        option_items.push( /*#__PURE__*/_react["default"].createElement(SelectOption, {
          att_name: att_name,
          display_text: display_text,
          key: att_name,
          choice_list: option["option_list"],
          value: option.starting_value,
          buttonIcon: selector_type_icons[option["type"]],
          updateValue: _updateValue
        }));
      } else switch (option["type"]) {
        case "pipe_select":
          option_items.push( /*#__PURE__*/_react["default"].createElement(PipeOption, {
            att_name: att_name,
            display_text: display_text,
            key: att_name,
            value: _lodash["default"].cloneDeep(option.starting_value),
            pipe_dict: _lodash["default"].cloneDeep(option["pipe_dict"]),
            updateValue: _updateValue
          }));
          break;
        case "boolean":
          option_items.push( /*#__PURE__*/_react["default"].createElement(BoolOption, {
            att_name: att_name,
            display_text: display_text,
            key: att_name,
            value: option.starting_value,
            updateValue: _updateValue
          }));
          break;
        case "textarea":
          option_items.push( /*#__PURE__*/_react["default"].createElement(TextAreaOption, {
            att_name: att_name,
            display_text: display_text,
            key: att_name,
            value: option.starting_value,
            updateValue: _updateValue
          }));
          break;
        case "codearea":
          option_items.push( /*#__PURE__*/_react["default"].createElement(CodeAreaOption, {
            att_name: att_name,
            display_text: display_text,
            key: att_name,
            value: option.starting_value,
            updateValue: _updateValue
          }));
          break;
        case "text":
          option_items.push( /*#__PURE__*/_react["default"].createElement(TextOption, {
            att_name: att_name,
            display_text: display_text,
            key: att_name,
            value: option.starting_value,
            leftIcon: "paragraph",
            updateValue: _updateValue
          }));
          break;
        case "int":
          option_items.push( /*#__PURE__*/_react["default"].createElement(IntOption, {
            att_name: att_name,
            display_text: display_text,
            key: att_name,
            value: option.starting_value,
            updateValue: _updateValue
          }));
          break;
        case "float":
          option_items.push( /*#__PURE__*/_react["default"].createElement(FloatOption, {
            att_name: att_name,
            display_text: display_text,
            key: att_name,
            value: option.starting_value,
            updateValue: _updateValue
          }));
          break;
        case "pool_select":
          option_items.push( /*#__PURE__*/_react["default"].createElement(PoolOption, {
            att_name: att_name,
            tile_id: props.tile_id,
            display_text: display_text,
            key: att_name,
            value: option.starting_value,
            select_type: option.pool_select_type,
            updateValue: _updateValue
          }));
          break;
        case "divider":
          option_items.push( /*#__PURE__*/_react["default"].createElement(DividerOption, {
            att_name: att_name,
            display_text: display_text,
            key: att_name
          }));
          break;
        default:
          break;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (in_section == true) {
    all_items.push( /*#__PURE__*/_react["default"].createElement(FormSection, {
      att_name: current_section_att_name,
      key: current_section_att_name,
      display_text: current_section_display_text,
      section_items: section_items,
      start_open: current_section_start_open
    }));
  }
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement("form", {
    className: "form-display-area",
    onSubmit: _submitOptions
  }, all_items), /*#__PURE__*/_react["default"].createElement(_core.Button, {
    text: "Submit",
    intent: "primary",
    style: {
      width: "100%"
    },
    onClick: _submitOptions
  }));
}
TileForm.propTypes = {
  tile_id: _propTypes["default"].string,
  dark_theme: _propTypes["default"].bool,
  options: _propTypes["default"].array,
  handleSubmit: _propTypes["default"].func,
  updateValue: _propTypes["default"].func
};
exports.TileForm = TileForm = /*#__PURE__*/(0, _react.memo)(TileForm);
function FormSection(props) {
  var _useState = (0, _react.useState)(props.start_open),
    _useState2 = _slicedToArray(_useState, 2),
    isOpen = _useState2[0],
    setIsOpen = _useState2[1];
  function _handleClick() {
    setIsOpen(!isOpen);
  }
  var label = props.display_text == null ? props.att_name : props.display_text;
  var but_bottom_margin = isOpen ? 10 : 20;
  return /*#__PURE__*/_react["default"].createElement(_react.Fragment, null, /*#__PURE__*/_react["default"].createElement(_core.Button, {
    onClick: _handleClick,
    text: label,
    large: false,
    outlined: true,
    intent: "primary",
    style: {
      width: "fit-content",
      marginBottom: but_bottom_margin,
      marginTop: 10
    }
  }), /*#__PURE__*/_react["default"].createElement(_core.Collapse, {
    isOpen: isOpen
  }, /*#__PURE__*/_react["default"].createElement(_core.Card, {
    interactive: false,
    elevation: _core.Elevation.TWO,
    style: {
      boxShadow: "none",
      marginBottom: 10,
      borderRadius: 10
    }
  }, props.section_items)));
}
FormSection.propTypes = {
  att_name: _propTypes["default"].string,
  section_items: _propTypes["default"].array,
  start_open: _propTypes["default"].bool,
  display_text: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])
};
FormSection.defaultProps = {
  start_open: true
};
FormSection = /*#__PURE__*/(0, _react.memo)(FormSection);
function DividerOption(props) {
  var label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "tile-form-divider",
    style: {
      marginTop: 25,
      marginBottom: 15
    }
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      paddingLeft: 20,
      fontSize: 25
    }
  }, label), /*#__PURE__*/_react["default"].createElement(_core.Divider, null));
}
DividerOption.propTypes = {
  att_name: _propTypes["default"].string,
  display_text: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number])
};
DividerOption = /*#__PURE__*/(0, _react.memo)(DividerOption);
function TextOption(props) {
  var current_timer = (0, _react.useRef)(null);
  var _useState3 = (0, _react.useState)(null),
    _useState4 = _slicedToArray(_useState3, 2),
    temp_text = _useState4[0],
    set_temp_text = _useState4[1];
  function _updateMe(event) {
    if (current_timer.current) {
      clearTimeout(current_timer.current);
      current_timer.current = null;
    }
    current_timer.current = setTimeout(function () {
      current_timer.current = null;
      props.updateValue(props.att_name, event.target.value);
    }, 500);
    set_temp_text(event.target.value);
  }
  var label = props.display_text == null ? props.att_name : props.display_text;
  var val_to_show = current_timer.current ? temp_text : props.value;
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: label
  }, /*#__PURE__*/_react["default"].createElement(_core.InputGroup, {
    asyncControl: false,
    type: "text",
    small: false,
    leftIcon: props.leftIcon,
    onChange: _updateMe,
    value: val_to_show
  }));
}
TextOption.propTypes = {
  att_name: _propTypes["default"].string,
  display_text: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func,
  leftIcon: _propTypes["default"].string
};
TextOption = /*#__PURE__*/(0, _react.memo)(TextOption);
function IntOption(props) {
  var _useState5 = (0, _react.useState)(props.value == ""),
    _useState6 = _slicedToArray(_useState5, 2),
    am_empty = _useState6[0],
    set_am_empty = _useState6[1];
  function _updateMe(att_name, val) {
    if (val.length == 0) {
      set_am_empty(true);
    } else if ((0, _utilities_react.isInt)(val)) {
      props.updateValue(props.att_name, val, function () {
        set_am_empty(false);
      });
    }
  }
  var label = props.display_text == null ? props.att_name : props.display_text;
  var val_to_show = am_empty ? "" : props.value;
  return /*#__PURE__*/_react["default"].createElement(TextOption, {
    att_name: label,
    leftIcon: "numerical",
    key: props.att_name,
    value: val_to_show,
    updateValue: _updateMe
  });
}
IntOption.propTypes = {
  att_name: _propTypes["default"].string,
  display_text: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func
};
IntOption = /*#__PURE__*/(0, _react.memo)(IntOption);
function FloatOption(props) {
  var _useState7 = (0, _react.useState)(null),
    _useState8 = _slicedToArray(_useState7, 2),
    temp_val = _useState8[0],
    set_temp_val = _useState8[1];
  function _updateMe(att_name, val) {
    if (val.length == 0) {
      set_temp_val("");
    } else if (val == ".") {
      set_temp_val(".");
    } else if (!isNaN(val)) {
      props.updateValue(props.att_name, val, function () {
        set_temp_val(null);
      });
    }
  }
  var val_to_show = temp_val == null ? props.value : temp_val;
  return /*#__PURE__*/_react["default"].createElement(TextOption, {
    att_name: props.att_name,
    leftIcon: "numerical",
    display_text: props.display_text,
    key: props.att_name,
    value: val_to_show,
    updateValue: _updateMe
  });
}
FloatOption.propTypes = {
  att_name: _propTypes["default"].string,
  display_text: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func
};
FloatOption = /*#__PURE__*/(0, _react.memo)(FloatOption);
function BoolOption(props) {
  function _updateMe(event) {
    props.updateValue(props.att_name, event.target.checked);
  }
  function boolify(the_var) {
    if (typeof the_var == "boolean") {
      return the_var;
    }
    return the_var == "True" || the_var == "true";
  }
  var label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react["default"].createElement(_core.Switch, {
    label: label,
    checked: boolify(props.value),
    onChange: _updateMe,
    innerLabel: "False",
    innerLabelChecked: "True",
    alignIndicator: "center"
  });
}
BoolOption.propTypes = {
  att_name: _propTypes["default"].string,
  display_text: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  value: _propTypes["default"].oneOfType([_propTypes["default"].bool, _propTypes["default"].string]),
  updateValue: _propTypes["default"].func
};
BoolOption = /*#__PURE__*/(0, _react.memo)(BoolOption);
function CodeAreaOption(props) {
  function _updateMe(newval) {
    props.updateValue(props.att_name, newval);
  }
  var label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: label
  }, /*#__PURE__*/_react["default"].createElement(_reactCodemirror.ReactCodemirror, {
    handleChange: _updateMe,
    code_content: props.value,
    saveMe: null,
    code_container_height: 100
  }));
}
CodeAreaOption.propTypes = {
  att_name: _propTypes["default"].string,
  display_text: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  dark_theme: _propTypes["default"].bool,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func
};
CodeAreaOption = /*#__PURE__*/(0, _react.memo)(CodeAreaOption);
function TextAreaOption(props) {
  var inputRef = (0, _react.useRef)(null);
  var _useState9 = (0, _react.useState)(null),
    _useState10 = _slicedToArray(_useState9, 2),
    cursor = _useState10[0],
    set_cursor = _useState10[1];
  (0, _react.useEffect)(function () {
    _setCursorPositions();
  });
  function _setCursorPositions() {
    //reset the cursor position for input
    inputRef.current.selectionStart = cursor;
    inputRef.current.selectionEnd = cursor;
  }
  function _updateMe(event) {
    set_cursor(event.target.selectionStart);
    props.updateValue(props.att_name, event.target.value);
  }
  var label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: label
  }, /*#__PURE__*/_react["default"].createElement(_core.TextArea, {
    onChange: _updateMe,
    inputRef: inputRef,
    small: false,
    value: props.value
  }));
}
TextAreaOption.propTypes = {
  att_name: _propTypes["default"].string,
  display_text: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func
};
TextAreaOption = /*#__PURE__*/(0, _react.memo)(TextAreaOption);
function SelectOption(props) {
  function _updateMe(val) {
    props.updateValue(props.att_name, val);
  }
  var label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: label
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelect, {
    onChange: _updateMe,
    value: props.value,
    buttonIcon: props.buttonIcon,
    options: props.choice_list
  }));
}
SelectOption.propTypes = {
  att_name: _propTypes["default"].string,
  display_text: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  choice_list: _propTypes["default"].array,
  buttonIcon: _propTypes["default"].string,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func
};
SelectOption = /*#__PURE__*/(0, _react.memo)(SelectOption);
function PoolOption(props) {
  var _useState11 = (0, _react.useState)(false),
    _useState12 = _slicedToArray(_useState11, 2),
    isOpen = _useState12[0],
    setIsOpen = _useState12[1];
  function _updateMe(newval) {
    props.updateValue(props.att_name, newval);
  }
  var label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: label
  }, /*#__PURE__*/_react["default"].createElement(_pool_tree.PoolAddressSelector, {
    value: props.value,
    tsocket: null,
    select_type: props.select_type,
    setValue: _updateMe
  }));
}
PoolOption = /*#__PURE__*/(0, _react.memo)(PoolOption);
function PipeOption(props) {
  function _updateMe(item) {
    props.updateValue(props.att_name, item["value"]);
  }
  function create_choice_list() {
    var choice_list = [];
    for (var group in props.pipe_dict) {
      choice_list.push({
        text: group,
        value: group + "_group",
        isgroup: true
      });
      var _iterator2 = _createForOfIteratorHelper(props.pipe_dict[group]),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var entry = _step2.value;
          choice_list.push({
            text: entry[1],
            value: entry[0],
            isgroup: false
          });
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    return choice_list;
  }
  function _value_dict() {
    var value_dict = {};
    for (var group in props.pipe_dict) {
      var _iterator3 = _createForOfIteratorHelper(props.pipe_dict[group]),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var entry = _step3.value;
          value_dict[entry[0]] = entry[1];
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
    }
    return value_dict;
  }
  var vdict = _value_dict();
  var full_value = {
    text: vdict[props.value],
    value: props.value,
    isgroup: false
  };
  var label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react["default"].createElement(_core.FormGroup, {
    label: label
  }, /*#__PURE__*/_react["default"].createElement(_blueprint_mdata_fields.BpSelectAdvanced, {
    onChange: _updateMe,
    readOnly: false,
    value: full_value,
    buttonIcon: "flow-end",
    options: create_choice_list()
  }));
}
PipeOption.propTypes = {
  att_name: _propTypes["default"].string,
  display_text: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  pipe_dict: _propTypes["default"].object,
  value: _propTypes["default"].oneOfType([_propTypes["default"].string, _propTypes["default"].number]),
  updateValue: _propTypes["default"].func
};
PipeOption = /*#__PURE__*/(0, _react.memo)(PipeOption);