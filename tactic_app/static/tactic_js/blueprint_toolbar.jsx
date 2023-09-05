
import React from "react";
import PropTypes from 'prop-types';

import { Button, ButtonGroup} from "@blueprintjs/core";

import {KeyTrap} from "./key_trap.js";
import {withTooltip} from "./blueprint_react_widgets.js";

export {Toolbar, ToolbarButton}

const default_button_class = "btn-outline-secondary";

const intent_colors = {
    danger: "#c23030",
    warning: "#bf7326",
    primary: "#106ba3",
    success: "#0d8050",
    regular: "#5c7080"
};


class ToolbarButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.show_text) {
            return (
                <Button
                          text={this.props.name_text}
                           icon={this.props.icon_name}
                           large={false}
                           minimal={false}
                           onClick={()=>this.props.click_handler()}
                           // className="bp-toolbar-button bp5-elevation-0"
                />
            )
        }
        else {
            return (
                <Button
                           icon={this.props.icon_name}
                           // intent={this.props.intent == "regular" ? "primary" : this.props.intent}
                           large={false}
                           minimal={false}
                           onClick={()=>this.props.click_handler()}
                           className="bp-toolbar-button bp5-elevation-0"
                />
            )
        }


    }
}

ToolbarButton.propTypes = {
    show_text: PropTypes.bool,
    icon_name: PropTypes.string,
    click_handler: PropTypes.func,
    button_class: PropTypes.string,
    name_text: PropTypes.string,
    small_size: PropTypes.bool,
    intent: PropTypes.string,
};

ToolbarButton.defaultProps = {
    small_size: true,
    intent: "regular",
    show_text: false
};

ToolbarButton = withTooltip(ToolbarButton);

class Toolbar extends React.Component {
    constructor(props) {
        super(props);
        this.tb_ref = React.createRef()
    }

    get_button_class(but) {
        if (but.button_class == undefined) {
            return  default_button_class
        }
        else {
            return but.button_class
        }
    }

    componentDidMount(){
        if (this.props.sendRef) {
            this.props.sendRef(this.tb_ref)
        }
    }

    componentDidUpdate(){
        if (this.props.sendRef) {
            this.props.sendRef(this.tb_ref)
        }
    }

    getTooltip(item) {
        return item.tooltip ? item.tooltip : null
    }

    getTooltipDelay(item) {
        return item.tooltipDelay ? item.tooltipDelay : null
    }

    render() {
        const items = [];
        var group_counter = 0;
        for (let group of this.props.button_groups) {
            let group_items = group.map((button, index) =>
                <ToolbarButton name_text={button.name_text}
                               icon_name={button.icon_name}
                               show_text={button.show_text}
                               tooltip={this.getTooltip(button)}
                               tooltipDeleay={this.getTooltipDelay(button)}
                               click_handler={button.click_handler}
                               intent={button.hasOwnProperty("intent") ? button.intent : "regular"}
                               key={index}/>
            );
            items.push(
                <ButtonGroup large={false} style={{justifyContent: "center"}} className="toolbar-button-group" role="group" key={group_counter}>
                    {group_items}
                </ButtonGroup>
            );
            group_counter += 1
        }
        let key_bindings = [];
        for (let group of this.props.button_groups) {
            for (let button of group) {
                if (button.hasOwnProperty("key_bindings"))
                    key_bindings.push([button.key_bindings, ()=>button.click_handler()])
            }
        }
        let outer_style;
        if (this.props.alternate_outer_style) {
            outer_style = this.props.alternate_outer_style
        }
        else {
            outer_style = {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                marginBottom: 10,
                whiteSpace: "nowrap"
            }
        }
        return (
            <div style={outer_style} >
                <div ref={this.tb_ref}>
                {items}
                </div>
                <KeyTrap global={true}
                         active={!this.props.controlled || this.props.am_selected}
                         bindings={key_bindings} />
            </div>
        )
    }
}

Toolbar.propTypes = {
    button_groups: PropTypes.array,
    alternate_outer_style: PropTypes.object,
    inputRef: PropTypes.func,
    tsocket: PropTypes.object,
    dark_theme: PropTypes.bool
};

Toolbar.defaultProps = {
    controlled: false,
    am_selected: true,
    alternate_outer_style: null,
    sendRef: null,
    tsocket: null
};

