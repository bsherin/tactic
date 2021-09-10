
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
import {TacticNavbar} from "./blueprint_navbar.js";
import {TacticContext} from "./tactic_context.js";
import {TacticSocket} from "./tactic_socket.js";

function tile_differ_main ()  {
    function gotProps(the_props) {
        let TileDifferAppPlus = withErrorDrawer(withStatus(TileDifferApp));
        let the_element = <TileDifferAppPlus {...the_props}
                                             controlled={false}
                                             initial_theme={window.theme}
                                             changeName={null}
                    />;
        let domContainer = document.querySelector('#root');
        ReactDOM.render(the_element, domContainer)

    }
    let get_url = "get_module_code";

    postAjaxPromise(`${get_url}/${window.resource_name}`, {})
        .then(function (data) {
            var edit_content = data.the_content;
            postAjaxPromise("get_tile_names")
                .then(function (data2) {
                    data.tile_list = data2.tile_names;
                    data.resource_name = window.resource_name,
                    data.second_resource_name = window.second_resource_name;
                    tile_differ_props(data, null, gotProps)
                })
                .catch(doFlash)

            }
        )
        .catch(doFlash);
}

function tile_differ_props(data, registerDirtyMethod, finalCallback) {
    let resource_viewer_id = guid();
    var tsocket = new TacticSocket("main", 5000, resource_viewer_id);
    finalCallback({
        resource_viewer_id: resource_viewer_id,
        tsocket: tsocket,
        tile_list: data.tile_list,
        resource_name: data.resource_name,
        second_resource_name: data.second_resource_name,
        edit_content: data.the_content,
        is_repository: false,
        registerDirtyMethod: registerDirtyMethod
    })
}

class TileDifferApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        let self = this;
        this.state = {
            "edit_content": props.edit_content,
            "right_content": "",
            "tile_popup_val": props.second_resource_name == "none" ? props.resource_name : props.second_resource_name,
            "tile_list": props.tile_list,
        };
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.saveFromLeft = this.saveFromLeft.bind(this);
        this.savedContent = props.edit_content;

        if (!props.controlled) {
            this.state.dark_theme = props.initial_theme === "dark";
            this.state.resource_name = props.resource_name;
            window.addEventListener("beforeunload", function (e) {
                if (self._dirty()) {
                    e.preventDefault();
                    e.returnValue = ''
                }
            });
        }
        this.initSocket()
    }
    initSocket() {
        this.props.tsocket.attachListener("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        this.props.tsocket.attachListener('close-user-windows', (data) => {
            if (!(data["originator"] == window.library_id)) {
                window.close()
            }
        });
        this.props.tsocket.attachListener('doflash', doFlash);
    }
    componentDidMount() {
        if (!this.props.controlled) {
            window.dark_theme = this.state.dark_theme
        }
    }

    _setTheme(dark_theme) {
        this.setState({dark_theme: dark_theme}, ()=> {
            if (!window.in_context) {
                window.dark_theme = this.state.dark_theme
            }
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
        let dark_theme = this.props.controlled ? this.context.dark_theme : this.state.dark_theme;
        return (
            <TacticContext.Provider value={{
                    readOnly: this.props.readOnly,
                    tsocket: this.props.tsocket,
                    dark_theme: dark_theme,
                    setTheme:  this.props.controlled ? this.context.setTheme : this._setTheme,
                    controlled: this.props.controlled,
                    am_selected: this.props.am_selected
                }}>
                {!this.props.controlled} {
                    <TacticNavbar is_authenticated={window.is_authenticated}
                                  selected={null}
                                  show_api_links={true}
                                  page_id={this.props.resource_viewer_id}
                                  user_name={window.username}/>
                }

                <MergeViewerApp {...this.props.statusFuncs}
                                resource_viewer_id={this.props.resource_viewer_id}
                                resource_name={this.props.resource_name}
                                option_list={this.state.tile_list}
                                select_val={this.state.tile_popup_val}
                                edit_content={this.state.edit_content}
                                right_content={this.state.right_content}
                                handleSelectChange={this.handleSelectChange}
                                handleEditChange={this.handleEditChange}
                                saveHandler={this.saveFromLeft}
                />
            </TacticContext.Provider>
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

TileDifferApp.contextType = TacticContext;

if (!window.in_context) {
    tile_differ_main();
}