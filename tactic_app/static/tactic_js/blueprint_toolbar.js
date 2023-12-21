"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToolbarButton = exports.Toolbar = void 0;
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _core = require("@blueprintjs/core");
var _key_trap = require("./key_trap.js");
var _blueprint_react_widgets = require("./blueprint_react_widgets.js");
const default_button_class = "btn-outline-secondary";
const intent_colors = {
  danger: "#c23030",
  warning: "#bf7326",
  primary: "#106ba3",
  success: "#0d8050",
  regular: "#5c7080"
};
class ToolbarButton extends _react.default.Component {
  constructor(props) {
    super(props);
  }
  render() {
    if (this.props.show_text) {
      return /*#__PURE__*/_react.default.createElement(_core.Button, {
        text: this.props.name_text,
        icon: this.props.icon_name,
        large: false,
        minimal: false,
        onClick: () => this.props.click_handler()
        // className="bp-toolbar-button bp5-elevation-0"
      });
    } else {
      return /*#__PURE__*/_react.default.createElement(_core.Button, {
        icon: this.props.icon_name
        // intent={this.props.intent == "regular" ? "primary" : this.props.intent}
        ,
        large: false,
        minimal: false,
        onClick: () => this.props.click_handler(),
        className: "bp-toolbar-button bp5-elevation-0"
      });
    }
  }
}
exports.ToolbarButton = ToolbarButton;
ToolbarButton.propTypes = {
  show_text: _propTypes.default.bool,
  icon_name: _propTypes.default.string,
  click_handler: _propTypes.default.func,
  button_class: _propTypes.default.string,
  name_text: _propTypes.default.string,
  small_size: _propTypes.default.bool,
  intent: _propTypes.default.string
};
ToolbarButton.defaultProps = {
  small_size: true,
  intent: "regular",
  show_text: false
};
exports.ToolbarButton = ToolbarButton = (0, _blueprint_react_widgets.withTooltip)(ToolbarButton);
class Toolbar extends _react.default.Component {
  constructor(props) {
    super(props);
    this.tb_ref = /*#__PURE__*/_react.default.createRef();
  }
  get_button_class(but) {
    if (but.button_class == undefined) {
      return default_button_class;
    } else {
      return but.button_class;
    }
  }
  componentDidMount() {
    if (this.props.sendRef) {
      this.props.sendRef(this.tb_ref);
    }
  }
  componentDidUpdate() {
    if (this.props.sendRef) {
      this.props.sendRef(this.tb_ref);
    }
  }
  getTooltip(item) {
    return item.tooltip ? item.tooltip : null;
  }
  getTooltipDelay(item) {
    return item.tooltipDelay ? item.tooltipDelay : null;
  }
  render() {
    const items = [];
    var group_counter = 0;
    for (let group of this.props.button_groups) {
      let group_items = group.map((button, index) => /*#__PURE__*/_react.default.createElement(ToolbarButton, {
        name_text: button.name_text,
        icon_name: button.icon_name,
        show_text: button.show_text,
        tooltip: this.getTooltip(button),
        tooltipDeleay: this.getTooltipDelay(button),
        click_handler: button.click_handler,
        intent: button.hasOwnProperty("intent") ? button.intent : "regular",
        key: index
      }));
      items.push( /*#__PURE__*/_react.default.createElement(_core.ButtonGroup, {
        large: false,
        style: {
          justifyContent: "center"
        },
        className: "toolbar-button-group",
        role: "group",
        key: group_counter
      }, group_items));
      group_counter += 1;
    }
    let key_bindings = [];
    for (let group of this.props.button_groups) {
      for (let button of group) {
        if (button.hasOwnProperty("key_bindings")) key_bindings.push([button.key_bindings, () => button.click_handler()]);
      }
    }
    let outer_style;
    if (this.props.alternate_outer_style) {
      outer_style = this.props.alternate_outer_style;
    } else {
      outer_style = {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 10,
        whiteSpace: "nowrap"
      };
    }
    return /*#__PURE__*/_react.default.createElement("div", {
      style: outer_style
    }, /*#__PURE__*/_react.default.createElement("div", {
      ref: this.tb_ref
    }, items), /*#__PURE__*/_react.default.createElement(_key_trap.KeyTrap, {
      global: true,
      active: !this.props.controlled || this.props.am_selected,
      bindings: key_bindings
    }));
  }
}
exports.Toolbar = Toolbar;
Toolbar.propTypes = {
  button_groups: _propTypes.default.array,
  alternate_outer_style: _propTypes.default.object,
  inputRef: _propTypes.default.func,
  tsocket: _propTypes.default.object,
  dark_theme: _propTypes.default.bool
};
Toolbar.defaultProps = {
  controlled: false,
  am_selected: true,
  alternate_outer_style: null,
  sendRef: null,
  tsocket: null
};