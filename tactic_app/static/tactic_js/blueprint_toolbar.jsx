

import React from "react";
import PropTypes from 'prop-types';

import "../css/dzcss/dropzone.css";
import "../css/dzcss/filepicker.css";
import "../css/dzcss/basic.css";

import { Button, MenuItem, Menu, ButtonGroup, Popover} from "@blueprintjs/core";

import {KeyTrap} from "./key_trap.js";
import {withTooltip} from "./blueprint_react_widgets.js";
import {doBinding} from "./utilities_react.js";
import {SearchForm} from "./library_widgets";

import {showModalReact} from "./modal_react.js";
import {showFileImportDialog} from "./import_dialog.js"

import {postAjax} from "./communication_react.js"

export {Toolbar, ToolbarButton, Namebutton, ResourceviewerToolbar}

const default_button_class = "btn-outline-secondary";

const intent_colors = {
    danger: "#c23030",
    warning: "#bf7326",
    primary: "#106ba3",
    success: "#0d8050",
    regular: "#5c7080"
};

function ResourceviewerToolbar(props) {
    let tstyle = {"marginTop": 20, "paddingRight": 20, "width": "100%"};
    let toolbar_outer_style = {
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                marginBottom: 0,
                marginTop: 7,
                marginBottom: 8
    }

    return (
        <div style={tstyle} className="d-flex flex-row justify-content-between">
            <Namebutton resource_name={props.resource_name}
                        setResourceNameState={props.setResourceNameState}
                        res_type={props.res_type}
                        large={false}
            />
            <div>
                <Toolbar button_groups={props.button_groups}
                         alternate_outer_style={toolbar_outer_style}
                />
            </div>
            {props.show_search &&
                <SearchForm update_search_state={props.update_search_state}
                            search_string={props.search_string}/>
            }
            {!props.show_search &&
                <div style={{width: 100}}/>
            }

        </div>
    )
}


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
                           // className="bp-toolbar-button bp3-elevation-0"
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
                           className="bp-toolbar-button bp3-elevation-0"
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

class PopupButton extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    render() {
        let menu_items = this.props.option_list.map((opt, index) => (
            <MenuItem key={opt.opt_name} onClick={opt.opt_func} icon={opt.opt_icon} text={opt.opt_name}/>
        ));
        let the_menu = <Menu>{menu_items} </Menu>;
        return (
            <ButtonGroup>
                <Popover content={the_menu}>
                    <Button id={this.props.name} text={this.props.name} icon={this.props.icon_name}/>
                </Popover>
            </ButtonGroup>
        )
    }
}

PopupButton.propTypes = {
    button_class: PropTypes.string,
    name: PropTypes.string,
    icon_name: PropTypes.string,
    option_list: PropTypes.array,
    small_size: PropTypes.bool
};

PopupButton.defaultProps = {
    small_size: true
};

class FileAdderButton extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _showDialog () {
        showFileImportDialog(this.props.resource_type, this.props.allowed_file_types,
            this.props.checkboxes, this.props.process_handler, this.props.combine, this.props.show_csv_options)
    }

     render() {

         return (
                 <ToolbarButton name_text={this.props.name_text}
                                icon_name={this.props.icon_name}
                                large={false}
                                click_handler={this._showDialog}
                                tooltip={this.props.tooltip}
                    />

         )
     }
}

FileAdderButton.propTypes = {
    name_text: PropTypes.string,
    resource_type: PropTypes.string,
    process_handler: PropTypes.func,
    allowed_file_types: PropTypes.array,
    icon_name: PropTypes.string,
    checkboxes: PropTypes.array,
    combine: PropTypes.bool,
    tooltip: PropTypes.string,
    show_csv_options: PropTypes.bool
};

FileAdderButton.defaultProps = {
    multiple: false
}

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
        if ((this.props.popup_buttons != null) && (this.props.popup_buttons.length != 0)) {
            let popup_items = this.props.popup_buttons.map((button, index) =>
                <ButtonGroup className="toolbar-button-group" role="group" key={"popup_group" + String(index)}>
                    <PopupButton name={button.name}
                                 key={button.name}
                                 icon_name={button.icon_name}
                                 option_list={button.option_list}
                                 button_class={this.get_button_class(button)}/>
                 </ButtonGroup>
            );
            items.push(popup_items)
        }
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

        if ((this.props.file_adders != null) && (this.props.file_adders.length != 0)) {
            let file_adder_items = this.props.file_adders.map((button, index) =>
                <FileAdderButton name_text={button.name_text}
                                 resource_type={button.resource_type}
                                 process_handler={button.process_handler}
                                 allowed_file_types={button.allowed_file_types}
                                 icon_name={button.icon_name}
                                 checkboxes={button.checkboxes}
                                 combine={button.combine}
                                 tooltip={this.getTooltip(button)}
                                 tooltipDelay={this.getTooltipDelay(button)}
                                 show_csv_options={button.show_csv_options}
                                 key={index}
                />
            );
            items.push(
                <ButtonGroup style={{justifyContent: "center"}} className="toolbar-button-group" role="group" key={group_counter}>
                    {file_adder_items}
                </ButtonGroup>
            );
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
                marginBottom: 10
            }
        }
        return (
            <div style={outer_style} >
                <div ref={this.tb_ref}>
                {items}
                </div>
                <KeyTrap global={true} bindings={key_bindings} />
            </div>
        )
    }
}

Toolbar.propTypes = {
    button_groups: PropTypes.array,
    file_adders: PropTypes.array,
    popup_buttons: PropTypes.array,
    alternate_outer_style: PropTypes.object,
    inputRef: PropTypes.func,
};

Toolbar.defaultProps = {
    file_adders: null,
    popup_buttons: null,
    alternate_outer_style: null,
    sendRef: null
};

class Namebutton extends React.Component {

    constructor(props) {
        super(props);
        // this.state = {"current_name": props.resource_name};
        this.rename_me = this.rename_me.bind(this);
        this.RenameResource = this.defaultRenameResource.bind(this)
    }

    rename_me() {
        console.log("entering rename");
        var self = this;
        var res_type = this.props.res_type;
        var current_name = this.props.resource_name;
        $.getJSON($SCRIPT_ROOT + `get_resource_names/${res_type}`, function (data) {
                const res_names = data["resource_names"];
                const index = res_names.indexOf(current_name);
                if (index >= 0) {
                    res_names.splice(index, 1);
                }
                showModalReact(`Rename ${res_type}`, `Name for this ${res_type}`, self.RenameResource, current_name, res_names)
            }
        );
    }

    defaultRenameResource(new_name) {
        const the_data = {"new_name": new_name, "update_selector": "True"};
        var self = this;
        postAjax(`rename_resource/${this.props.res_type}/${this.props.resource_name}`, the_data, renameSuccess);

        function renameSuccess(data) {
            if (data.success) {
                // self.setState({"current_name": new_name});
                self.props.setResourceNameState(new_name)
                doFlash(data)
            } else {
                doFlash(data);
                return false
            }

        }
    }

    render() {
        // let name = this.props.handleRename == null ? this.state.current_name : this.props.resource_name;
        let name = this.props.resource_name;
        let style = {fontSize: 20};
        return (
            <Button id="rename-button"
                           large={this.props.large}
                           small={!this.props.large}
                           minimal={true}
                           style={style}
                           tabIndex={-1}
                           onClick={this.rename_me}>
                <h5>{name}</h5>
            </Button>
        )
    }
}

Namebutton.propTypes = {
    resource_name: PropTypes.string,
    setResourceNameState: PropTypes.func,
    res_type: PropTypes.string,
    large: PropTypes.bool,
};

Namebutton.defaultProps = {
    handleRename: null,
    large: true
};