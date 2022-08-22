import React from "react";
import PropTypes from 'prop-types';

import { Icon, MenuDivider, Menu, Navbar, Button, PopoverPosition, Classes } from "@blueprintjs/core";
import {Popover2, MenuItem2} from "@blueprintjs/popover2";

import {doBinding} from "./utilities_react.js";
import {KeyTrap} from "./key_trap";

export {MenuComponent, ToolMenu, TacticMenubar, TopLeftButtons}


class TacticMenubar extends React.Component {

    render () {
        let menus;
        if (this.props.menu_specs == null) {
            menus = this.props.menus
        }
        else {
            menus = [];
            for (let menu_name in this.props.menu_specs) {
                menus.push(<ToolMenu menu_name={menu_name}
                                     key={menu_name}
                                     disabled_items={this.props.disabled_items}
                                     menu_items={this.props.menu_specs[menu_name]}
                                     controlled={this.props.controlled}
                                     am_selected={this.props.am_selected}
                />)
            }
        }


        const theme_class = this.props.dark_theme ? "bp4-dark" : "light-theme";
        const name_style = {
            marginButton: 0,
            marginLeft: 10,
            marginRight: 10,
            display: "flex",
            alignItems: "center",
            fontWeight: "bold"
        };
        return (
            <Navbar style={{paddingLeft: 3, height: 30, display: "flex"}} className={theme_class + " menu-bar"}>
                {(this.props.showClose || this.props.showRefresh) &&
                    <TopLeftButtons showRefresh={this.props.showRefresh}
                                    showClose={this.props.showClose}
                                    refreshTab={this.props.refreshTab}
                                    closeTab={this.props.closeTab}
                                    extraButtons={this.props.extraButtons}
                    />
                }
                {this.props.resource_icon &&
                    <Icon style={{marginTop: 6}} icon={this.props.resource_icon} iconSize={16} tabIndex={-1}/>
                }
                {this.props.resource_name &&
                    <div style={name_style}>{this.props.resource_name}</div>
                }
                <div style={{height: 30}} className="bp4-navbar-group bp4-align-left">
                            <React.Fragment>
                                {menus}
                            </React.Fragment>
                </div>
                {this.props.showErrorDrawerButton &&
                    <ErrorDrawerButton toggleErrorDrawer={this.props.toggleErrorDrawer}/>
                }

            </Navbar>
        )
    }
}
TacticMenubar.propTypes = {
    refreshTab: PropTypes.func,
    closeTab: PropTypes.func,
    showClose: PropTypes.bool,
    showRefresh: PropTypes.bool,
    showErrorDrawerButton: PropTypes.bool,
    toggleErrorDrawer: PropTypes.func,
    menu_specs: PropTypes.object,
    dark_theme: PropTypes.bool,
    resource_name: PropTypes.string,
    resource_icon: PropTypes.string,
    controlled: PropTypes.bool,
    am_selected: PropTypes.bool,
    diabled_items: PropTypes.array,
    extraButtons: PropTypes.array
};

TacticMenubar.defaultProps = {
    showClose: window.in_context,
    showRefresh: window.in_context,
    refreshTab: null,
    closeTab: null,
    menu_specs: null,
    menus: null,
    showErrorDrawerButton: false,
    toggleErrorDrawer: null,
    resource_name: null,
    resource_icon: null,
    disabled_items: [],
    extraButtons: null
};

function ErrorDrawerButton (props) {
    let top_icon_style = {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 0,
        paddingTop: 3,
        marginRight: 20,
        position: "absolute",
        right: 10
    };
    return (<div style={top_icon_style}>
                <Button icon={<Icon icon="drawer-right" iconSize={18} />}
                        style={{paddingLeft: 4, paddingRight:0}}
                        minimal={true}
                        className="context-close-button"
                        small={true}
                        tabIndex={-1}
                        onClick={() => {
                             props.toggleErrorDrawer()
                        }}
                />
            </div>)
}

class TopLeftButtons extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }
    render() {
        let top_icon_style = {
            display: "flex",
            justifyContent: "flex-start",
            marginTop: 0,
            paddingTop: 0,
            marginRight: 8
        };
        let ebuttons = [];
        if (this.props.extraButtons != null) {
            this.props.extraButtons.map((but_info, index) => {
                ebuttons.push(
                    <Button icon={<Icon icon={but_info.icon} iconSize={14}/>}
                            style={{paddingLeft: 8}}
                            minimal={true}
                            className="context-close-button"
                            small={true}
                            key={index}
                            tabIndex={-1}
                            onClick={() => {
                             but_info.onClick()
                         }}
                />)

            })
        }
        return (
                <div style={top_icon_style}>
                    {this.props.showClose &&
                        <Button icon={<Icon icon="delete" iconSize={14}/>}
                                style={{paddingLeft: 4, paddingRight: 0}}
                                minimal={true}
                                className="context-close-button"
                                small={true}
                                tabIndex={-1}
                                intent="danger"
                                onClick={() => {
                                    this.props.closeTab()
                                }}
                        />}
                    {this.props.showRefresh &&
                        <Button icon={<Icon icon="reset" iconSize={14}/>}
                             style={{paddingLeft: 8}}
                             minimal={true}
                             className="context-close-button"
                             small={true}
                             tabIndex={-1} intent="danger"
                             onClick={() => {
                                 this.props.refreshTab()
                             }}
                    />}
                    {this.props.extraButtons &&
                        ebuttons
                    }
                </div>
        )
    }
}

TopLeftButtons.propTypes = {
    showRefresh: PropTypes.bool,
    showClose: PropTypes.bool,
    refreshTab: PropTypes.func,
    closeTab: PropTypes.func,
    extraButtons: PropTypes.array,
};

TopLeftButtons.defaultProps = {
    extraButtons: null
};

class MenuComponent extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.replacers = [
            ["CTRL+", "^"],
            ["COMMAND+", "⌘"]
        ]
    }

     _filter_on_match_list(opt_name) {
        return !this.props.hidden_items.includes(opt_name)
    }

    _bindingsToString(binding_list) {
        if (binding_list == null) {
            return null
        }

        let new_binding = binding_list[0];

        for (let rep of this.replacers) {
            new_binding = new_binding.toUpperCase().replace(rep[0], rep[1])
        }

        return <span style={{fontFamily: "system-ui"}}>{new_binding}</span>
    }

    render () {
        let pruned_list = Object.keys(this.props.option_dict).filter(this._filter_on_match_list);
        let choices = pruned_list.map((opt_name, index) => {
                if (opt_name.startsWith("divider")) {
                    return <MenuDivider key={index}/>
                }
                let icon = null;
                if (this.props.icon_dict.hasOwnProperty(opt_name)) {
                    icon = <Icon icon={this.props.icon_dict[opt_name]} size={14} />
                }
                let label = null;
                if (opt_name in this.props.binding_dict) {
                    label = this._bindingsToString(this.props.binding_dict[opt_name])
                }
                return (
                    <MenuItem2 disabled={this.props.disable_all || this.props.disabled_items.includes(opt_name)}
                              onClick={this.props.option_dict[opt_name]}
                              icon={icon}
                              labelElement={label}
                              key={opt_name}
                              text={opt_name}
                              className={this.props.item_class}
                    >
                    </MenuItem2>
                )
            }
        );
        let the_menu = (
            <Menu className={Classes.ELEVATION_1} >
                {choices}
            </Menu>
        );
        if (this.props.alt_button) {
            let AltButton = this.props.alt_button;
            return (<Popover2 minimal={true}
                              content={the_menu}
                              transitionDuration={150}
                              position={this.props.position}>
                <AltButton/>
            </Popover2>)
        } else {
            return (
                <Popover2 minimal={true}
                          content={the_menu}
                          transitionDuration={150}
                          position={this.props.position}>
                    <Button text={this.props.menu_name} small={true} minimal={true}/>
                </Popover2>
            )
        }
    }
}

MenuComponent.propTypes = {
    menu_name: PropTypes.string,
    item_class: PropTypes.string,
    option_dict: PropTypes.object,
    icon_dict: PropTypes.object,
    binding_dict: PropTypes.object,
    disabled_items: PropTypes.array,
    disable_all: PropTypes.bool,
    hidden_items: PropTypes.array,
    alt_button: PropTypes.func,
    position: PropTypes.string
};

MenuComponent.defaultProps = {
    menu_name: null,
    item_class: "",
    disabled_items: [],
    binding_dict: {},
    disable_all: false,
    hidden_items: [],
    icon_dict: {},
    alt_button: null,
    position: PopoverPosition.BOTTOM_LEFT
};

class ToolMenu extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    get option_dict () {
        let opt_dict = {};
        for (let but of this.props.menu_items) {
            opt_dict[but.name_text] = but.click_handler
        }
        return opt_dict
    }

    get icon_dict () {
        let icon_dict = {};
        for (let but of this.props.menu_items) {
            icon_dict[but.name_text] = but.icon_name
        }
        return icon_dict
    }

    get binding_dict() {
        let binding_dict = {};
        for (let but of this.props.menu_items) {
            if ("key_bindings" in but) {
                binding_dict[but.name_text] = but.key_bindings
            }
            else {
                binding_dict[but.name_text] = null
            }

        }
        return binding_dict
    }

    render () {
        let key_bindings = [];
        for (let button of this.props.menu_items) {
                if (button.hasOwnProperty("key_bindings"))
                    key_bindings.push([button.key_bindings, ()=>button.click_handler()])
        }
        return (
            <React.Fragment>
                <MenuComponent menu_name={this.props.menu_name}
                               option_dict={this.option_dict}
                               icon_dict={this.icon_dict}
                               binding_dict={this.binding_dict}
                               disabled_items={this.props.disabled_items}
                               hidden_items={[]}
                />
                <KeyTrap global={true}
                         active={!this.props.controlled || this.props.am_selected}
                         bindings={key_bindings} />
            </React.Fragment>
        )
    }
}

ToolMenu.propTypes = {
    menu_name: PropTypes.string,
    menu_items: PropTypes.array,
    disabled_items: PropTypes.array,
    controlled: PropTypes.bool,
    am_selected: PropTypes.bool
};

ToolMenu.defaultProps = {
    disabled_items: [],
};