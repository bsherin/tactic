
import "../tactic_css/tactic.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {MergeViewerSocket, MergeViewerApp} from "./merge_viewer_app.js";
import {doFlash} from "./toaster.js"
import {postAjaxPromise} from "./communication_react.js"
import {withErrorDrawer} from "./error_drawer.js";
import {withStatus} from "./toaster.js";
import {doBinding, guid} from "./utilities_react.js";
import {TacticNavbar} from "./blueprint_navbar";

window.resource_viewer_id = guid();
window.main_id = window.resource_viewer_id;

function tile_differ_main ()  {
    let get_url = "get_module_code";
    var tsocket = new MergeViewerSocket("main", 5000);
    let TileDifferAppPlus = withErrorDrawer(withStatus(TileDifferApp, tsocket), tsocket);
    postAjaxPromise(`${get_url}/${window.resource_name}`, {})
        .then(function (data) {
            var edit_content = data.the_content;
            postAjaxPromise("get_tile_names")
                .then(function (data) {
                    let tile_list = data.tile_names;
                    let domContainer = document.querySelector('#root');
                    ReactDOM.render(<TileDifferAppPlus resource_name={window.resource_name}
                                                       tile_list={tile_list}
                                                       edit_content={edit_content}
                                                       initial_theme={window.theme}
                                                       second_resource_name={window.second_resource_name}
                    />, domContainer);
                })
                .catch(doFlash)

            }
        )
        .catch(doFlash);
}

class TileDifferApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        let self = this;
        window.onbeforeunload = function(e) {
            if (self.dirty()) {
                return "Any unsaved changes will be lost."
            }
        };

        this.state = {
            "edit_content": props.edit_content,
            "right_content": "",
            "tile_popup_val": props.second_resource_name == "none" ? props.resource_name : props.second_resource_name,
            "tile_list": props.tile_list,
            dark_theme: this.props.initial_theme == "dark"
        };
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.saveFromLeft = this.saveFromLeft.bind(this);
        this.savedContent = props.edit_content
    }
    componentDidMount() {
        this.props.setStatusTheme(this.state.dark_theme);
        window.dark_theme = this.state.dark_theme
    }

    _setTheme(dark_theme) {
        this.setState({dark_theme: dark_theme}, ()=> {
            this.props.setStatusTheme(dark_theme);
            window.dark_theme = this.state.dark_theme
        })
    }

    handleSelectChange(new_value) {
        this.state.tile_popup_val = new_value;
        let self = this;
        postAjaxPromise("get_module_code/" + new_value, {})
            .then((data) => {
                    self.setState({"right_content": data.the_content});
                })
            .catch(doFlash);
    }

    handleEditChange(new_code) {
        this.setState({"edit_content": new_code})
    }

    render() {
        return (
            <React.Fragment>
                <TacticNavbar is_authenticated={window.is_authenticated}
                                  selected={null}
                                  show_api_links={true}
                                  dark_theme={this.state.dark_theme}
                                  set_parent_theme={this._setTheme}
                                  user_name={window.username}/>
                <MergeViewerApp {...this.props.statusFuncs}
                                resource_name={this.props.resource_name}
                                option_list={this.state.tile_list}
                                select_val={this.state.tile_popup_val}
                                edit_content={this.state.edit_content}
                                right_content={this.state.right_content}
                                handleSelectChange={this.handleSelectChange}
                                handleEditChange={this.handleEditChange}
                                dark_theme={this.state.dark_theme}
                                saveHandler={this.saveFromLeft}
                />
        </React.Fragment>
        )
    }

    saveFromLeft() {
        let data_dict = {
            "module_name": this.props.resource_name,
            "module_code": this.state.edit_content
        };
        postAjaxPromise("update_from_left", data_dict)
            .then(doFlash)
            .catch(doFlash)
    }

    dirty() {
        return this.state.edit_content != this.savedContent
    }
}

TileDifferApp.propTypes = {
    resource_name: PropTypes.string,
    tile_list: PropTypes.array,
    edit_content: PropTypes.string,
    second_resource_name: PropTypes.string
};


tile_differ_main();