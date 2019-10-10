var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { MergeViewerSocket, MergeViewerApp } from "./merge_viewer_app.js";
import { doFlash } from "./toaster.js";
import { render_navbar } from "./blueprint_navbar.js";
import { postAjax, postAjaxPromise } from "./communication_react.js";
import { withErrorDrawer } from "./error_drawer";
import { withStatus } from "./toaster";

function tile_differ_main() {
    render_navbar();
    let get_url = "get_module_code";
    var tsocket = new MergeViewerSocket("main", 5000);
    let TileDifferAppPlus = withErrorDrawer(withStatus(TileDifferApp, tsocket), tsocket);
    postAjaxPromise(`${get_url}/${window.resource_name}`, {}).then(function (data) {
        var edit_content = data.the_content;
        postAjaxPromise("get_tile_names").then(function (data) {
            let tile_list = data.tile_names;
            let domContainer = document.querySelector('#root');
            ReactDOM.render(React.createElement(TileDifferAppPlus, { resource_name: window.resource_name,
                tile_list: tile_list,
                edit_content: edit_content,
                second_resource_name: window.second_resource_name
            }), domContainer);
        }).catch(doFlash);
    }).catch(doFlash);
}

class TileDifferApp extends React.Component {

    constructor(props) {
        super(props);
        let self = this;
        window.onbeforeunload = function (e) {
            if (self.dirty()) {
                return "Any unsaved changes will be lost.";
            }
        };

        this.state = {
            "edit_content": props.edit_content,
            "right_content": "",
            "tile_popup_val": props.second_resource_name == "none" ? props.tile_list[0] : props.second_resource_name,
            "tile_list": props.tile_list
        };
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.saveFromLeft = this.saveFromLeft.bind(this);
        this.savedContent = props.edit_content;
    }

    handleSelectChange(event) {
        let new_value = event.currentTarget.value;
        this.state.tile_popup_val = new_value;
        let self = this;
        postAjaxPromise("get_module_code/" + new_value, {}).then(data => {
            self.setState({ "right_content": data.the_content });
        }).catch(doFlash);
    }

    handleEditChange(new_code) {
        this.setState({ "edit_content": new_code });
    }

    render() {
        return React.createElement(MergeViewerApp, _extends({}, this.props.statusFuncs, {
            resource_name: this.props.resource_name,
            option_list: this.state.tile_list,
            select_val: this.state.tile_popup_val,
            edit_content: this.state.edit_content,
            right_content: this.state.right_content,
            handleSelectChange: this.handleSelectChange,
            handleEditChange: this.handleEditChange,
            saveHandler: this.saveFromLeft
        }));
    }

    saveFromLeft() {
        let data_dict = {
            "module_name": this.props.resource_name,
            "module_code": this.state.edit_content
        };
        postAjaxPromise("update_from_left", data_dict).then(doFlash).catch(doFlash);
    }

    dirty() {
        return this.state.edit_content != this.savedContent;
    }
}

TileDifferApp.propTypes = {
    resource_name: PropTypes.string,
    tile_list: PropTypes.array,
    edit_content: PropTypes.string,
    second_resource_name: PropTypes.string
};

tile_differ_main();