

import React from "react";
import PropTypes from 'prop-types';

import { Button, MenuItem, Menu, ButtonGroup, Popover, ControlGroup, FileInput} from "@blueprintjs/core";

import {KeyTrap} from "./key_trap.js";
import {withTooltip} from "./blueprint_react_widgets.js";
import {doBinding} from "./utilities_react.js";

export {Toolbar, ToolbarButton, Namebutton, ResourceviewerToolbar}
import {showModalReact} from "./modal_react.js";

import {postAjax} from "./communication_react.js"

const default_button_class = "btn-outline-secondary";

const intent_colors = {
    danger: "#c23030",
    warning: "#bf7326",
    primary: "#106ba3",
    success: "#0d8050",
    regular: "#5c7080"
};

function ResourceviewerToolbar(props) {
    let tstyle = {"marginTop": 20};
    return (
        <div style={tstyle}>
            <Toolbar button_groups={props.button_groups}/>
            <Namebutton resource_name={props.resource_name}
                        res_type={props.res_type}/>
        </div>
    )
}

class ToolbarButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (this.props.show_text) {
            // let style = {flexDirection: "column", fontSize: 8, padding: "5px 8px", width: 42, height: 42};
            return (
                <Button
                          text={this.props.name_text}
                           icon={this.props.icon_name}
                           // intent={this.props.intent == "regular" ? "primary" : this.props.intent}
                          // style={style}
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
        this.state = {file_list: null,
            hasSelection: false,
            the_text: "Choose file..."
        }
    }

    _handleFileChange(event) {
        let file_list = event.target.files;
        if (file_list.length == 0) return;
        let the_text;
        if (file_list.length == 1) {
            the_text = file_list[0].name
        }
        else {
            the_text = "<multiple>"
        }
        this.setState({file_list: file_list, hasSelection: true, the_text: the_text})
    }
    
    _do_submit() {
        this.props.click_handler(this.state.file_list)
    }

     render() {
         // let style = {flexDirection: "column", fontSize: 8, marginRight: 4, width: 42, height: 42};
         let file_input_style = {width: 200, fontSize: 12, marginBottom: 0};
         return (
             <React.Fragment>
                 <ControlGroup>
             <ToolbarButton name_text={this.props.name_text}
                            icon_name={this.props.icon_name}
                            // style={style}
                            large={false}
                            click_handler={this._do_submit}
                            tooltip={this.props.tooltip}
                />
                 <FileInput large={false}
                               text={this.state.the_text}
                               style={file_input_style}
                               hasSelection={this.state.hasSelection}
                               onInputChange={this._handleFileChange}
                               inputProps={{multiple: this.props.multiple}}/>
                 </ControlGroup>

            </React.Fragment>

         )
     }

}

FileAdderButton.propTypes = {
    click_handler: PropTypes.func,
    button_class: PropTypes.string,
    name_text: PropTypes.string,
    multiple: PropTypes.bool,
    icon_name: PropTypes.string,
    small_size: PropTypes.bool,
    tooltip: PropTypes.string
};

FileAdderButton.defaultProps = {
    small_size: true,
    multiple: false,
    tooltip: null
};


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
                <FileAdderButton icon_name={button.icon_name}
                                 click_handler={button.click_handler}
                                 button_class={this.get_button_class(button)}
                                 name_text={button.name_text}
                                 multiple={button.multiple}
                                 tooltip={this.getTooltip(button)}
                                 tooltipDeleay={this.getTooltipDelay(button)}
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
        this.state = {"current_name": props.resource_name};
        this.rename_me = this.rename_me.bind(this);
        this.RenameResource = this.props.handleRename == null ? this.defaultRenameResource.bind(this) : this.props.handleRename
    }

    rename_me() {
        console.log("entering rename");
        var self = this;
        var res_type = this.props.res_type;
        var current_name = this.state.current_name;
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
        const the_data = {"new_name": new_name};
        var self = this;
        postAjax(`rename_resource/${this.props.res_type}/${this.state.current_name}`, the_data, renameSuccess);

        function renameSuccess(data) {
            if (data.success) {
                self.setState({"current_name": new_name});
                doFlash(data)
            } else {
                doFlash(data);
                return false
            }

        }
    }

    render() {
        let name = this.props.handleRename == null ? this.state.current_name : this.props.resource_name;
        let style = {fontSize: 20};
        return (
            <Button id="rename-button"
                           large={true}
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
    res_type: PropTypes.string,
    handleRename: PropTypes.func
};

Namebutton.defaultProps = {
    handleRename: null
};