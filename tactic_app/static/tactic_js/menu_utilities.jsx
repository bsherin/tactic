import React from "react";
import {Fragment, useEffect, memo, useContext} from "react";

import {Icon, MenuDivider, Menu, Navbar, Button, PopoverPosition, Classes, ButtonGroup} from "@blueprintjs/core";
import {Popover2, MenuItem2} from "@blueprintjs/popover2";

import {KeyTrap} from "./key_trap";
import {ThemeContext} from "./theme"
import {GlyphButton} from "./blueprint_react_widgets";
import {SelectedPaneContext, useStateAndRef} from "./utilities_react";
import {ErrorDrawerContext} from "./error_drawer";
import {AssistantContext} from "./assistant";

export {MenuComponent, ToolMenu, TacticMenubar, TopLeftButtons}

const name_style = {
    marginButton: 0,
    marginLeft: 10,
    marginRight: 10,
    display: "flex",
    alignItems: "center",
    fontWeight: "bold"
};

let top_icon_style = {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 0,
    paddingTop: 3,
    marginRight: 10,
};

const button_group_style = {
    position: "absolute",
    right: 10
};

const chat_status_style = {
    marginRight: 7,
    paddingTop: 7
};

function TacticMenubar(props) {
    props = {
        showClose: window.in_context,
        showRefresh: window.in_context,
        refreshTab: null,
        closeTab: null,
        menu_specs: null,
        menus: null,
        showErrorDrawerButton: false,
        showMetadataDrawerButton: false,
        resource_name: null,
        resource_icon: null,
        disabled_items: [],
        extraButtons: null,
        suggestionGlyphs: [],
        connection_status: null,
        ...props
    };
    const theme = useContext(ThemeContext);

    let menus;
    if (props.menu_specs == null) {
        menus = props.menus
    } else {
        menus = [];
        let mcounter = 0;
        for (let menu_name in props.menu_specs) {
            mcounter += 1;
            menus.push(<ToolMenu menu_name={menu_name}
                                 key={menu_name + String(mcounter)}
                                 disabled_items={props.disabled_items}
                                 menu_items={props.menu_specs[menu_name]}
                                 controlled={props.controlled}
            />)
        }
    }
    let sug_glyphs = [];
    let scounter = 0;
    for (let sg of props.suggestionGlyphs) {
        scounter += 1;
        sug_glyphs.push(<GlyphButton intent={sg.intent}
                                     key={sg.icon + String(scounter)}
                                     handleClick={sg.handleClick}
                                     icon={sg.icon}/>)
    }
    const theme_class = theme.dark_theme ? "bp5-dark" : "light-theme";

    return (
        <Navbar style={{paddingLeft: 3, height: 30, display: "flex"}} className={theme_class + " menu-bar"}>
            {(props.showClose || props.showRefresh) &&
                <TopLeftButtons showRefresh={props.showRefresh}
                                showClose={props.showClose}
                                refreshTab={props.refreshTab}
                                closeTab={props.closeTab}
                                extraButtons={props.extraButtons}
                />
            }
            {props.resource_icon &&
                <Icon style={{marginTop: 6}} icon={props.resource_icon} size={16} tabIndex={-1}/>
            }
            {props.resource_name &&
                <div style={name_style}>{props.resource_name}</div>
            }
            <div style={{height: 30}} className="bp5-navbar-group bp5-align-left">
                <Fragment>
                    {menus}
                    {sug_glyphs}
                </Fragment>
            </div>
            {props.connection_status &&
                <ConnectionIndicator connection_status={props.connection_status}/>
            }
            <DrawerButtonGroup showErrorDrawerButton={props.showErrorDrawerButton}
                               showMetadataDrawerButton={props.showMetadataDrawerButton}
                               showMetadata={props.showMetadata}/>
        </Navbar>
    )
}

TacticMenubar = memo(TacticMenubar);

function ConnectionIndicator(props) {
    let top_icon_style = {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 3,
        paddingTop: 3,
        marginRight: 20,
        opacity: .75
    };
    return (
        <div style={top_icon_style}>
            <Icon icon={props.connection_status == "up" ? "circle-arrow-up" : "offline"}
                  intent={props.connection_status == "up" ? null : "danger"}
                  size={18}/>
        </div>
    )
}

function DrawerButtonGroup(props) {
    const [visible, setVisible, visibleRef] = useStateAndRef(false);

    const assistantDrawerFuncs = useContext(AssistantContext);

    useEffect(() => {
        const handleMouseMove = (event) => {
            const {clientX} = event;
            const windowWidth = window.innerWidth;
            if (windowWidth - clientX < 50) { // Show buttons when near the right edge (50px threshold)
                if (!visibleRef.current) setVisible(true);
            } else {
                if (visibleRef.current) setVisible(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <ButtonGroup className={`floating-button-group ${visible ? 'visible' : ''}`}
                     large={true}
                     alignText={"left"}
                     vertical={false}>
            {props.showErrorDrawerButton &&
                <ErrorDrawerButton/>
            }
            {assistantDrawerFuncs && assistantDrawerFuncs.showAssistantDrawerButton &&
                <AssistantDrawerButton/>
            }
            {props.showMetadataDrawerButton &&
                <MetadataDrawerButton showMetadata={props.showMetadata}/>
            }

        </ButtonGroup>

    )
}

function ErrorDrawerButton(props) {
    const errorDrawerFuncs = useContext(ErrorDrawerContext);
    return (
        // <div style={top_icon_style}>
        <Button icon={<Icon icon="bug" size={18}/>}
            //style={{paddingLeft: 4, paddingRight: 0}}
                minimal={false}
                className="context-close-button"
                small={false}
                text="Errors"
                tabIndex={-1}
                onClick={() => {
                    errorDrawerFuncs.toggleErrorDrawer()
                }}
        />
        // </div>
    )
}

ErrorDrawerButton = memo(ErrorDrawerButton);

function AssistantDrawerButton(props) {
    const assistantDrawerFuncs = useContext(AssistantContext);
    return (
        //div style={top_icon_style}>
        <Button icon={<Icon icon="chat" size={18}/>}
            //style={{paddingLeft: 4, paddingRight: 0}}
                minimal={false}
                className="context-close-button"
                text={"Assistant"}
                small={false}
                tabIndex={-1}
                onClick={() => {
                    assistantDrawerFuncs.toggleAssistantDrawer()
                }}
        />
        //</div>
    )
}

AssistantDrawerButton = memo(AssistantDrawerButton);

function MetadataDrawerButton(props) {
    return (
        //<div style={top_icon_style}>
        <Button icon={<Icon icon="list-columns" size={18}/>}
            //style={{paddingLeft: 4, paddingRight: 0}}
                minimal={false}
                className="context-close-button"
                small={false}
                text={"Metadata"}
                tabIndex={-1}
                onClick={() => {
                    props.showMetadata()
                }}
        />
        //</div>
    )
}

MetadataDrawerButton = memo(MetadataDrawerButton);

function TopLeftButtons(props) {
    props = {
        extraButtons: null,
        ...props
    };
    let top_icon_style = {
        display: "flex",
        justifyContent: "flex-start",
        marginTop: 0,
        paddingTop: 0,
        marginRight: 8
    };
    let ebuttons = [];
    if (props.extraButtons != null) {
        props.extraButtons.map((but_info, index) => {
            ebuttons.push(
                <Button icon={<Icon icon={but_info.icon} size={14}/>}
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
            {props.showClose &&
                <Button icon={<Icon icon="delete" size={14}/>}
                        style={{paddingLeft: 4, paddingRight: 0}}
                        minimal={true}
                        className="context-close-button"
                        small={true}
                        tabIndex={-1}
                        intent="danger"
                        onClick={() => {
                            props.closeTab()
                        }}
                />}
            {props.showRefresh &&
                <Button icon={<Icon icon="reset" size={14}/>}
                        style={{paddingLeft: 8}}
                        minimal={true}
                        className="context-close-button"
                        small={true}
                        tabIndex={-1} intent="danger"
                        onClick={() => {
                            props.refreshTab()
                        }}
                />}
            {props.extraButtons &&
                ebuttons
            }
        </div>
    )
}

TopLeftButtons = memo(TopLeftButtons);

function MenuComponent(props) {
    props = {
        menu_name: null,
        item_class: "",
        disabled_items: [],
        binding_dict: {},
        disable_all: false,
        hidden_items: [],
        icon_dict: {},
        alt_button: null,
        position: PopoverPosition.BOTTOM_LEFT,
        createOmniItems: true,
        ...props
    };
    const replacers = [
        ["CTRL+", "^"],
        ["COMMAND+", "⌘"]
    ];

    const selectedPane = useContext(SelectedPaneContext);

    useEffect(() => {
        if (props.createOmniItems && window.in_context && "addOmniItems" in selectedPane) {
            selectedPane.addOmniItems(_getOmniItems())
        }
    }, []);

    function _filter_on_match_list(opt_name) {
        return !props.hidden_items.includes(opt_name)
    }

    function _filter_on_disabled_list(opt_name) {
        return !props.disable_all && !props.disabled_items.includes(opt_name)
    }

    function _bindingsToString(binding_list) {
        if (binding_list == null) {
            return null
        }

        let new_binding = binding_list[0];

        for (let rep of replacers) {
            // noinspection JSCheckFunctionSignatures
            new_binding = new_binding.toUpperCase().replace(rep[0], rep[1])
        }

        return <span style={{fontFamily: "system-ui"}}>{new_binding}</span>
    }

    function _getOmniItems() {
        let omni_items = [];
        let pruned_list = Object.keys(props.option_dict).filter(_filter_on_match_list);
        pruned_list = pruned_list.filter(_filter_on_disabled_list);
        for (let choice of pruned_list) {
            if (choice.startsWith("divider")) continue;
            let icon_name = props.icon_dict.hasOwnProperty(choice) ? props.icon_dict[choice] : null;
            omni_items.push(
                {
                    category: "Menu Option",
                    display_text: choice,
                    search_text: choice,
                    icon_name: icon_name,
                    item_type: "command",
                    the_function: props.option_dict[choice]
                }
            );
        }
        return omni_items
    }

    let pruned_list = Object.keys(props.option_dict).filter(_filter_on_match_list);
    let choices = pruned_list.map((opt_name, index) => {
            if (opt_name.startsWith("divider")) {
                return <MenuDivider key={index}/>
            }
            let icon = null;
            if (props.icon_dict.hasOwnProperty(opt_name)) {
                icon = <Icon icon={props.icon_dict[opt_name]} size={14}/>
            }
            let label = null;
            if (opt_name in props.binding_dict) {
                label = _bindingsToString(props.binding_dict[opt_name])
            }
            return (
                <MenuItem2 disabled={props.disable_all || props.disabled_items.includes(opt_name)}
                           onClick={props.option_dict[opt_name]}
                           icon={icon}
                           labelElement={label}
                           key={opt_name}
                           text={opt_name}
                           className={props.item_class}
                >
                </MenuItem2>
            )
        }
    );
    let the_menu = (
        <Menu className={Classes.ELEVATION_1}>
            {choices}
        </Menu>
    );
    if (props.alt_button) {
        let AltButton = props.alt_button;
        return (<Popover2 minimal={true}
                          content={the_menu}
                          transitionDuration={150}
                          position={props.position}>
            <AltButton/>
        </Popover2>)
    } else {
        return (
            <Popover2 minimal={true}
                      content={the_menu}
                      transitionDuration={150}
                      position={props.position}>
                <Button text={props.menu_name} small={true} minimal={true}/>
            </Popover2>
        )
    }
}

MenuComponent = memo(MenuComponent);

function ToolMenu(props) {
    props = {
        disabled_items: [],
        ...props
    };
    const selectedPane = useContext(SelectedPaneContext);

    function option_dict() {
        let opt_dict = {};
        for (let but of props.menu_items) {
            opt_dict[but.name_text] = but.click_handler
        }
        return opt_dict
    }

    function icon_dict() {
        let icon_dict = {};
        for (let but of props.menu_items) {
            icon_dict[but.name_text] = but.icon_name
        }
        return icon_dict
    }

    function binding_dict() {
        let binding_dict = {};
        for (let but of props.menu_items) {
            if ("key_bindings" in but) {
                binding_dict[but.name_text] = but.key_bindings
            } else {
                binding_dict[but.name_text] = null
            }

        }
        return binding_dict
    }

    let key_bindings = [];
    for (let button of props.menu_items) {
        if (button.hasOwnProperty("key_bindings"))
            key_bindings.push([button.key_bindings, () => button.click_handler()])
    }
    return (
        <Fragment>
            <MenuComponent menu_name={props.menu_name}
                           option_dict={option_dict()}
                           icon_dict={icon_dict()}
                           binding_dict={binding_dict()}
                           disabled_items={props.disabled_items}
                           hidden_items={[]}
            />
            <KeyTrap global={true}
                     active={selectedPane.amSelected(selectedPane.tab_id, selectedPane.selectedTabIdRef)}
                     bindings={key_bindings}/>
        </Fragment>
    )
}

ToolMenu = memo(ToolMenu);
