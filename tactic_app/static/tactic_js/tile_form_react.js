"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TileForm = TileForm;
var _react = _interopRequireWildcard(require("react"));
var _core = require("@blueprintjs/core");
var _lodash = _interopRequireDefault(require("lodash"));
var _reactCodemirror = require("./react-codemirror");
var _blueprint_mdata_fields = require("./blueprint_mdata_fields");
var _utilities_react = require("./utilities_react");
var _pool_tree = require("./pool_tree");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
let selector_types = ["column_select", "tokenizer_select", "weight_function_select", "cluster_metric", "tile_select", "document_select", "list_select", "collection_select", "function_select", "class_select", "palette_select", "custom_list"];
let selector_type_icons = {
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
  for (let option of props.options) {
    if ("visible" in option && !option["visible"]) continue;
    let att_name = option["name"];
    let display_text;
    if ("display_text" in option && option.display_text != null && option.display_text != "") {
      display_text = option["display_text"];
    } else {
      display_text = null;
    }
    if (option["type"] == "divider") {
      if (in_section) {
        all_items.push( /*#__PURE__*/_react.default.createElement(FormSection, {
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
      option_items.push( /*#__PURE__*/_react.default.createElement(SelectOption, {
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
        option_items.push( /*#__PURE__*/_react.default.createElement(PipeOption, {
          att_name: att_name,
          display_text: display_text,
          key: att_name,
          value: _lodash.default.cloneDeep(option.starting_value),
          pipe_dict: _lodash.default.cloneDeep(option["pipe_dict"]),
          updateValue: _updateValue
        }));
        break;
      case "boolean":
        option_items.push( /*#__PURE__*/_react.default.createElement(BoolOption, {
          att_name: att_name,
          display_text: display_text,
          key: att_name,
          value: option.starting_value,
          updateValue: _updateValue
        }));
        break;
      case "textarea":
        option_items.push( /*#__PURE__*/_react.default.createElement(TextAreaOption, {
          att_name: att_name,
          display_text: display_text,
          key: att_name,
          value: option.starting_value,
          updateValue: _updateValue
        }));
        break;
      case "codearea":
        option_items.push( /*#__PURE__*/_react.default.createElement(CodeAreaOption, {
          att_name: att_name,
          display_text: display_text,
          key: att_name,
          value: option.starting_value,
          updateValue: _updateValue
        }));
        break;
      case "text":
        option_items.push( /*#__PURE__*/_react.default.createElement(TextOption, {
          att_name: att_name,
          display_text: display_text,
          key: att_name,
          value: option.starting_value,
          leftIcon: "paragraph",
          updateValue: _updateValue
        }));
        break;
      case "int":
        option_items.push( /*#__PURE__*/_react.default.createElement(IntOption, {
          att_name: att_name,
          display_text: display_text,
          key: att_name,
          value: option.starting_value,
          updateValue: _updateValue
        }));
        break;
      case "float":
        option_items.push( /*#__PURE__*/_react.default.createElement(FloatOption, {
          att_name: att_name,
          display_text: display_text,
          key: att_name,
          value: option.starting_value,
          updateValue: _updateValue
        }));
        break;
      case "pool_select":
        option_items.push( /*#__PURE__*/_react.default.createElement(PoolOption, {
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
        option_items.push( /*#__PURE__*/_react.default.createElement(DividerOption, {
          att_name: att_name,
          display_text: display_text,
          key: att_name
        }));
        break;
      default:
        break;
    }
  }
  if (in_section == true) {
    all_items.push( /*#__PURE__*/_react.default.createElement(FormSection, {
      att_name: current_section_att_name,
      key: current_section_att_name,
      display_text: current_section_display_text,
      section_items: section_items,
      start_open: current_section_start_open
    }));
  }
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("form", {
    className: "form-display-area",
    onSubmit: _submitOptions
  }, all_items), /*#__PURE__*/_react.default.createElement(_core.Button, {
    text: "Submit",
    intent: "primary",
    style: {
      width: "100%"
    },
    onClick: _submitOptions
  }));
}
exports.TileForm = TileForm = /*#__PURE__*/(0, _react.memo)(TileForm);
function FormSection(props) {
  props = {
    start_open: true,
    ...props
  };
  const [isOpen, setIsOpen] = (0, _react.useState)(props.start_open);
  function _handleClick() {
    setIsOpen(!isOpen);
  }
  let label = props.display_text == null ? props.att_name : props.display_text;
  let but_bottom_margin = isOpen ? 10 : 20;
  return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_core.Button, {
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
  }), /*#__PURE__*/_react.default.createElement(_core.Collapse, {
    isOpen: isOpen
  }, /*#__PURE__*/_react.default.createElement(_core.Card, {
    interactive: false,
    elevation: _core.Elevation.TWO,
    style: {
      boxShadow: "none",
      marginBottom: 10,
      borderRadius: 10
    }
  }, props.section_items)));
}
FormSection = /*#__PURE__*/(0, _react.memo)(FormSection);
function DividerOption(props) {
  let label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "tile-form-divider",
    style: {
      marginTop: 25,
      marginBottom: 15
    }
  }, /*#__PURE__*/_react.default.createElement("div", {
    style: {
      paddingLeft: 20,
      fontSize: 25
    }
  }, label), /*#__PURE__*/_react.default.createElement(_core.Divider, null));
}
DividerOption = /*#__PURE__*/(0, _react.memo)(DividerOption);
function TextOption(props) {
  const current_timer = (0, _react.useRef)(null);
  const [temp_text, set_temp_text] = (0, _react.useState)(null);
  function _updateMe(event) {
    if (current_timer.current) {
      clearTimeout(current_timer.current);
      current_timer.current = null;
    }
    current_timer.current = setTimeout(() => {
      current_timer.current = null;
      props.updateValue(props.att_name, event.target.value);
    }, 500);
    set_temp_text(event.target.value);
  }
  let label = props.display_text == null ? props.att_name : props.display_text;
  let val_to_show = current_timer.current ? temp_text : props.value;
  return /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: label
  }, /*#__PURE__*/_react.default.createElement(_core.InputGroup, {
    asyncControl: false,
    type: "text",
    small: false,
    leftIcon: props.leftIcon,
    onChange: _updateMe,
    value: val_to_show
  }));
}
TextOption = /*#__PURE__*/(0, _react.memo)(TextOption);
function IntOption(props) {
  const [am_empty, set_am_empty] = (0, _react.useState)(props.value == "");
  function _updateMe(att_name, val) {
    if (val.length == 0) {
      set_am_empty(true);
    } else if ((0, _utilities_react.isInt)(val)) {
      props.updateValue(props.att_name, val, () => {
        set_am_empty(false);
      });
    }
  }
  let label = props.display_text == null ? props.att_name : props.display_text;
  let val_to_show = am_empty ? "" : props.value;
  return /*#__PURE__*/_react.default.createElement(TextOption, {
    att_name: label,
    leftIcon: "numerical",
    key: props.att_name,
    value: val_to_show,
    updateValue: _updateMe
  });
}
IntOption = /*#__PURE__*/(0, _react.memo)(IntOption);
function FloatOption(props) {
  const [temp_val, set_temp_val] = (0, _react.useState)(null);
  function _updateMe(att_name, val) {
    if (val.length == 0) {
      set_temp_val("");
    } else if (val == ".") {
      set_temp_val(".");
    } else if (!isNaN(val)) {
      props.updateValue(props.att_name, val, () => {
        set_temp_val(null);
      });
    }
  }
  let val_to_show = temp_val == null ? props.value : temp_val;
  return /*#__PURE__*/_react.default.createElement(TextOption, {
    att_name: props.att_name,
    leftIcon: "numerical",
    display_text: props.display_text,
    key: props.att_name,
    value: val_to_show,
    updateValue: _updateMe
  });
}
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
  let label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react.default.createElement(_core.Switch, {
    label: label,
    checked: boolify(props.value),
    onChange: _updateMe,
    innerLabel: "False",
    innerLabelChecked: "True",
    alignIndicator: "center"
  });
}
BoolOption = /*#__PURE__*/(0, _react.memo)(BoolOption);
function CodeAreaOption(props) {
  function _updateMe(newval) {
    props.updateValue(props.att_name, newval);
  }
  let label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: label
  }, /*#__PURE__*/_react.default.createElement(_reactCodemirror.ReactCodemirror, {
    handleChange: _updateMe,
    no_width: true,
    no_height: true,
    code_content: props.value,
    saveMe: null,
    tsocket: null,
    code_container_height: 100
  }));
}
CodeAreaOption = /*#__PURE__*/(0, _react.memo)(CodeAreaOption);
function TextAreaOption(props) {
  const inputRef = (0, _react.useRef)(null);
  const [cursor, set_cursor] = (0, _react.useState)(null);
  (0, _react.useEffect)(() => {
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
  let label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: label
  }, /*#__PURE__*/_react.default.createElement(_core.TextArea, {
    onChange: _updateMe,
    inputRef: inputRef,
    small: false,
    value: props.value
  }));
}
TextAreaOption = /*#__PURE__*/(0, _react.memo)(TextAreaOption);
function SelectOption(props) {
  function _updateMe(val) {
    props.updateValue(props.att_name, val);
  }
  let label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: label
  }, /*#__PURE__*/_react.default.createElement(_blueprint_mdata_fields.BpSelect, {
    onChange: _updateMe,
    value: props.value,
    buttonIcon: props.buttonIcon,
    options: props.choice_list
  }));
}
SelectOption = /*#__PURE__*/(0, _react.memo)(SelectOption);
function PoolOption(props) {
  const [isOpen, setIsOpen] = (0, _react.useState)(false);
  function _updateMe(newval) {
    props.updateValue(props.att_name, newval);
  }
  let label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: label
  }, /*#__PURE__*/_react.default.createElement(_pool_tree.PoolAddressSelector, {
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
    let choice_list = [];
    for (let group in props.pipe_dict) {
      choice_list.push({
        text: group,
        value: group + "_group",
        isgroup: true
      });
      for (let entry of props.pipe_dict[group]) {
        choice_list.push({
          text: entry[1],
          value: entry[0],
          isgroup: false
        });
      }
    }
    return choice_list;
  }
  function _value_dict() {
    let value_dict = {};
    for (let group in props.pipe_dict) {
      for (let entry of props.pipe_dict[group]) {
        value_dict[entry[0]] = entry[1];
      }
    }
    return value_dict;
  }
  let vdict = _value_dict();
  let full_value = {
    text: vdict[props.value],
    value: props.value,
    isgroup: false
  };
  let label = props.display_text == null ? props.att_name : props.display_text;
  return /*#__PURE__*/_react.default.createElement(_core.FormGroup, {
    label: label
  }, /*#__PURE__*/_react.default.createElement(_blueprint_mdata_fields.BpSelectAdvanced, {
    onChange: _updateMe,
    readOnly: false,
    value: full_value,
    buttonIcon: "flow-end",
    options: create_choice_list()
  }));
}
PipeOption = /*#__PURE__*/(0, _react.memo)(PipeOption);