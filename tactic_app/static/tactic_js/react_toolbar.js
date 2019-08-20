

export { Toolbar, ToolbarButton, Namebutton, ResourceviewerToolbar };
import { showModalReact } from "./modal_react.js";

const default_button_class = "btn-outline-secondary";

var Rbs = window.ReactBootstrap;

function ResourceviewerToolbar(props) {
    let tstyle = { "marginTop": 20 };
    return React.createElement(
        "div",
        { style: tstyle },
        React.createElement(Toolbar, { button_groups: props.button_groups }),
        React.createElement(Namebutton, { resource_name: props.resource_name,
            res_type: props.res_type })
    );
}

class ToolbarButton extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let butclass;
        if (this.props.small_size) {
            butclass = "btn btn-sm action-button toolbar-button-sm " + this.props.button_class;
        } else {
            butclass = "btn btn-sm action-button toolbar-button " + this.props.button_class;
        }

        return React.createElement(
            Rbs.Button,
            { onClick: this.props.click_handler,
                className: butclass },
            React.createElement("span", { className: "far button-icon fa-" + this.props.icon_name }),
            React.createElement(
                "span",
                { className: "button-text" },
                this.props.name_text
            )
        );
    }
}

ToolbarButton.propTypes = {
    icon_name: PropTypes.string,
    click_handler: PropTypes.func,
    button_class: PropTypes.string,
    name_text: PropTypes.string,
    small_size: PropTypes.bool
};

ToolbarButton.defaultProps = {
    small_size: true
};

class PopupButton extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    render() {
        let butclass;
        if (this.props.small_size) {
            butclass = "btn btn-sm action-button toolbar-button-sm " + this.props.button_class;
        } else {
            butclass = "btn btn-sm action-button toolbar-button " + this.props.button_class;
        }
        let option_items = this.props.option_list.map((opt, index) => React.createElement(
            Rbs.Dropdown.Item,
            { key: opt.opt_name, onClick: opt.opt_func },
            opt.opt_name
        ));

        return React.createElement(
            Rbs.Dropdown,
            null,
            React.createElement(
                Rbs.Dropdown.Toggle,
                { id: this.props.name, className: butclass
                },
                React.createElement("span", { className: "far button-icon fa-" + this.props.icon_name }),
                React.createElement(
                    "span",
                    { className: "button-text" },
                    this.props.name
                )
            ),
            React.createElement(
                Rbs.Dropdown.Menu,
                null,
                option_items
            )
        );
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
        this.state = { file_list: null };
    }

    _handleFileChange(event) {
        this.setState({ file_list: event.target.files });
    }

    _do_submit(e) {
        e.preventDefault();
        this.props.click_handler(this.state.file_list);
    }

    render() {
        let butclass;
        if (this.props.small_size) {
            butclass = "btn btn-sm action-button toolbar-button-sm " + this.props.button_class;
        } else {
            butclass = "btn btn-sm action-button toolbar-button " + this.props.button_class;
        }
        let input_item = React.createElement(Rbs.Form.Control, { as: "input", type: "file", size: "sm", style: { width: 250, fontSize: 12 },
            onChange: this._handleFileChange,
            className: "form-control-sm " + this.props.button_class,
            multiple: this.props.multiple });
        return React.createElement(
            Rbs.Form,
            { inline: true },
            React.createElement(
                Rbs.Button,
                { onClick: this._do_submit, type: "submit", className: butclass },
                React.createElement("span", { className: "far button-icon fa-" + this.props.icon_name }),
                React.createElement(
                    "span",
                    { className: "button-text" },
                    this.props.name_text
                )
            ),
            input_item
        );
    }

}

FileAdderButton.propTypes = {
    click_handler: PropTypes.func,
    button_class: PropTypes.string,
    name_text: PropTypes.string,
    multiple: PropTypes.bool,
    icon_name: PropTypes.string,
    small_size: PropTypes.bool
};

FileAdderButton.defaultProps = {
    small_size: true,
    multiple: false
};

class Toolbar extends React.Component {

    get_button_class(but) {
        if (but.button_class == undefined) {
            return default_button_class;
        } else {
            return but.button_class;
        }
    }

    render() {
        const items = [];
        var group_counter = 0;
        if (this.props.popup_buttons != null && this.props.popup_buttons.length != 0) {
            let popup_items = this.props.popup_buttons.map((button, index) => React.createElement(
                Rbs.ButtonGroup,
                { className: "toolbar-button-group", role: "group", key: "popup_group" + String(index) },
                React.createElement(PopupButton, { name: button.name,
                    key: button.name,
                    icon_name: button.icon_name,
                    option_list: button.option_list,
                    button_class: this.get_button_class(button) })
            ));
            items.push(popup_items);
        }
        for (let group of this.props.button_groups) {
            let group_items = group.map((button, index) => React.createElement(ToolbarButton, { name: button.name,
                icon_name: button.icon_name,
                click_handler: button.click_handler,
                button_class: this.get_button_class(button),
                name_text: button.name_text,
                key: index
            }));
            items.push(React.createElement(
                Rbs.ButtonGroup,
                { className: "toolbar-button-group", role: "group", key: group_counter },
                group_items
            ));
            group_counter += 1;
        }
        if (this.props.file_adders != null && this.props.file_adders.length != 0) {
            let file_adder_items = this.props.file_adders.map((button, index) => React.createElement(FileAdderButton, { icon_name: button.icon_name,
                click_handler: button.click_handler,
                button_class: this.get_button_class(button),
                name_text: button.name_text,
                multiple: button.multiple,
                key: index
            }));
            items.push(React.createElement(
                Rbs.ButtonGroup,
                { className: "toolbar-button-group", role: "group", key: group_counter },
                file_adder_items
            ));
        }
        return React.createElement(
            Rbs.ButtonToolbar,
            { className: "mb-2" },
            items
        );
    }
}

Toolbar.propTypes = {
    button_groups: PropTypes.array,
    file_adders: PropTypes.array,
    popup_buttons: PropTypes.array
};

Toolbar.defaultProps = {
    file_adders: null,
    popup_buttons: null
};

class Namebutton extends React.Component {

    constructor(props) {
        super(props);
        this.state = { "current_name": props.resource_name };
        this.rename_me = this.rename_me.bind(this);
        this.RenameResource = this.props.handleRename == null ? this.defaultRenameResource.bind(this) : this.props.handleRename;
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
            showModalReact(`Rename ${res_type}`, `Name for this ${res_type}`, self.RenameResource, current_name, res_names);
        });
    }

    defaultRenameResource(new_name) {
        const the_data = { "new_name": new_name };
        var self = this;
        postAjax(`rename_resource/${this.props.res_type}/${this.state.current_name}`, the_data, renameSuccess);

        function renameSuccess(data) {
            if (data.success) {
                self.setState({ "current_name": new_name });
                doFlash(data);
            } else {
                doFlash(data);
                return false;
            }
        }
    }

    render() {
        let name = this.props.handleRename == null ? this.state.current_name : this.props.resource_name;
        return React.createElement(
            Rbs.Button,
            { id: "rename-button",
                className: "btn btn-outline-secondary res-name-button",
                onClick: this.rename_me },
            name
        );
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