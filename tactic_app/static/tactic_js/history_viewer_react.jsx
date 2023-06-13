/**
 * Created by bls910
 */

import "../tactic_css/tactic.scss";

import React from "react";
import {Fragment} from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {MergeViewerApp} from "./merge_viewer_app.js";
import {doFlash} from "./toaster.js"
import {postAjax, postAjaxPromise} from "./communication_react.js"
import {withErrorDrawer} from "./error_drawer.js";
import {withStatus} from "./toaster.js";

import {doBinding, guid} from "./utilities_react.js";
import {TacticNavbar} from "./blueprint_navbar";
import {TacticSocket} from "./tactic_socket.js";

function history_viewer_main ()  {
    function gotProps(the_props) {
        let HistoryViewerAppPlus = withErrorDrawer(withStatus(HistoryViewerApp));
        let the_element = <HistoryViewerAppPlus {...the_props}
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
            postAjaxPromise("get_checkpoint_dates", {"module_name": window.resource_name})
                .then(function (data2) {
                    data.history_list = data2.checkpoints;
                    data.resource_name = window.resource_name,
                    history_viewer_props(data, null, gotProps)
                })
                .catch(doFlash)

            }
        )
        .catch(doFlash);
}

function history_viewer_props(data, registerDirtyMethod, finalCallback) {
    let resource_viewer_id = guid();
    var tsocket = new TacticSocket("main", 5000, resource_viewer_id);
    finalCallback({
        resource_viewer_id: resource_viewer_id,
        tsocket: tsocket,
        history_list: data.history_list,
        resource_name: data.resource_name,
        edit_content: data.the_content,
        is_repository: false,
        registerDirtyMethod: registerDirtyMethod
    })
}

class HistoryViewerApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        let self = this;

        this.state = {
            "edit_content": props.edit_content,
            "right_content": "",
            "history_popup_val": props.history_list[0]["updatestring"],
            "history_list": props.history_list,
        };
        this.handleEditChange = this.handleEditChange.bind(this);
        this.handleSelectChange = this.handleSelectChange.bind(this);
        this.checkpointThenSaveFromLeft = this.checkpointThenSaveFromLeft.bind(this);
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
        this.props.tsocket.attachListener('doflashUser', doFlash);
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
        this.state.history_popup_val = new_value;
        let self = this;
        for (let item of this.state.history_list) {
            if (item["updatestring"] == new_value){
                let updatestring_for_sort = item["updatestring_for_sort"];
                postAjaxPromise("get_checkpoint_code", {"module_name": self.state.resource_name, "updatestring_for_sort": updatestring_for_sort})
                    .then((data) => {
                            self.setState({"right_content": data.module_code});
                        })
                    .catch(doFlash);
                return
            }
        }
    }

    handleEditChange(new_code) {
        this.setState({"edit_content": new_code})
    }

    render() {
        let option_list = this.state.history_list.map((item) => item["updatestring"]);
        let dark_theme = this.props.controlled ? this.props.dark_theme : this.state.dark_theme;
        return (
                <Fragment>
                    {!this.props.controlled} {
                        <TacticNavbar is_authenticated={window.is_authenticated}
                                      registerOmniFunction={(register_func) => this._registerOmniFunction("navbar", register_func)}
                                      dark_theme={dark_theme}
                                      setTheme={this._setTheme}
                                      selected={null}
                                      show_api_links={true}
                                      page_id={this.props.resource_viewer_id}
                                      user_name={window.username}/>
                    }
                    <MergeViewerApp {...this.props.statusFuncs}
                                    setTheme={this.props.controlled ? null: this._setTheme}
                                    dark_theme={dark_theme}
                                    resource_viewer_id={this.props.resource_viewer_id}
                                    resource_name={this.props.resource_name}
                                    option_list={option_list}
                                    select_val={this.state.history_popup_val}
                                    edit_content={this.state.edit_content}
                                    right_content={this.state.right_content}
                                    handleSelectChange={this.handleSelectChange}
                                    handleEditChange={this.handleEditChange}
                                    saveHandler={this.checkpointThenSaveFromLeft}
                />
            </Fragment>
        )
    }

    doCheckpointPromise() {
        let self = this;
        return new Promise (function (resolve, reject) {
            postAjax("checkpoint_module", {"module_name": self.props.resource_name}, function (data) {
                if (data.success) {
                    resolve(data)
                }
                else {
                    reject(data)
                }
            });
        })
    }

    checkpointThenSaveFromLeft() {
        let self = this;
        let current_popup_val = this.state.history_popup_val;
        this.doCheckpointPromise()
            .then(function () {
                postAjaxPromise("get_checkpoint_dates", {"module_name": self.state.resource_name})
                    .then((data) => {
                        self.setState({"history_list": data.checkpoints})
                    })
                    .catch(doFlash);
                self.saveFromLeft()
            })
            .catch(doFlash)
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

HistoryViewerApp.propTypes = {
    resource_name: PropTypes.string,
    history_list: PropTypes.array,
    edit_content: PropTypes.string,
};

if (!window.in_context) {
    history_viewer_main();
}