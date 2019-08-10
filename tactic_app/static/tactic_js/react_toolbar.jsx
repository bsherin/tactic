

export {Toolbar, ToolbarButton, Namebutton, ResourceviewerToolbar}
import {showModalReact} from "./modal_react.js";

const default_button_class = "btn-outline-secondary";

var Rbs = window.ReactBootstrap;

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

        return (
            <Rbs.Button onClick={this.props.click_handler}
                    className={"btn btn-sm action-button toolbar-button " + this.props.button_class}>
                <span className={"far button-icon fa-" + this.props.icon_name}/>
                <span className="button-text">{this.props.name_text}</span>
            </Rbs.Button>
     )
  }
}

ToolbarButton.propTypes = {
    name: PropTypes.string,
    click_handler: PropTypes.func,
    button_class: PropTypes.string,
    name_text: PropTypes.string
};


class Toolbar extends React.Component {

    get_button_class(but) {
        if (but.button_class == undefined) {
            return  default_button_class
        }
        else {
            return but.button_class
        }
    }

    render() {
        const items = [];
        var group_counter = 0;
        for (let group of this.props.button_groups) {
            let group_items = group.map((button, index) =>
                <ToolbarButton name={button.name}
                               icon_name={button.icon_name}
                               click_handler={button.click_handler}
                               button_class={this.get_button_class(button)}
                               name_text={button.name_text}
                               key={index}
                />
            );
            items.push(
                <Rbs.ButtonGroup className="toolbar-button-group" role="group" key={group_counter}>
                    {group_items}
                </Rbs.ButtonGroup>
            );
            group_counter += 1
        }
        return (
            <Rbs.ButtonToolbar>
                {items}
            </Rbs.ButtonToolbar>
        )
    }
}

Toolbar.propTypes = {
    button_groups: PropTypes.array,
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
        return (<Rbs.Button id="rename-button"
                        className="btn btn-outline-secondary res-name-button"
                        onClick={this.rename_me}>
                    {name}
                </Rbs.Button>
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