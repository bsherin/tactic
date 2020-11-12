/**
 * Created by bls910
 */

import "../tactic_css/tactic.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import { ResizeSensor } from "@blueprintjs/core";

import {ResourceViewerSocket, ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app.js";
import {ReactCodemirror} from "./react-codemirror.js";
import {ViewerContext} from "./resource_viewer_context.js";
import {postAjax, postAjaxPromise, postWithCallback} from "./communication_react.js"
import {doFlash} from "./toaster.js"
import {withErrorDrawer} from "./error_drawer.js";
import {withStatus} from "./toaster.js";
import {doBinding} from "./utilities_react.js";

import {SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT, BOTTOM_MARGIN, getUsableDimensions} from "./sizing_tools.js";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";

window.resource_viewer_id = guid();
window.main_id = resource_viewer_id;

function module_viewer_main ()  {
    let get_url = window.is_repository ? "repository_get_module_code" : "get_module_code";
    let get_mdata_url = window.is_repository ? "grab_repository_metadata" : "grab_metadata";

    var tsocket = new ResourceViewerSocket("main", 5000);
    postAjaxPromise(`${get_url}/${window.resource_name}`, {})
        .then(function (data) {
            var the_content = data.the_content;
            let result_dict = {"res_type": "tile", "res_name": window.resource_name, "is_repository": false};
            let ModuleViewerAppPlus = withErrorDrawer(withStatus(ModuleViewerApp, tsocket), tsocket);
            let domContainer = document.querySelector('#root');
            postAjaxPromise(get_mdata_url, result_dict)
			        .then(function (data) {
			            let split_tags = data.tags == "" ? [] : data.tags.split(" ");
                        ReactDOM.render(<ModuleViewerAppPlus resource_name={window.resource_name}
                                                       the_content={the_content}
                                                       created={data.datestring}
                                                       tags={split_tags}
                                                       notes={data.notes}
                                                       readOnly={window.read_only}
                                                       initial_theme={window.theme}
                                                       is_repository={window.is_repository}
                                                       meta_outer="#right-div"/>, domContainer);
			        })
			        .catch(function () {
			            ReactDOM.render(<ModuleViewerAppPlus resource_name={window.resource_name}
                                                       the_content={the_content}
                                                       created=""
                                                       tags={[]}
                                                       notes=""
                                                       initial_theme={window.theme}
                                                       readOnly={window.read_only}
                                                       is_repository={window.is_repository}
                                                       meta_outer="#right-div"/>, domContainer);
			        })
        })
        .catch(doFlash);
}

class ModuleViewerApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.top_ref = React.createRef();
        this.cc_ref = React.createRef();
        this.savedContent = props.the_content;
        this.savedTags = props.tags;
        this.savedNotes = props.notes;
        let self = this;
        window.addEventListener("beforeunload", function (e) {
            if (self.dirty()) {
                e.preventDefault();
                e.returnValue = ''
            }
        });

        let aheight = getUsableDimensions().usable_height;
        let awidth = getUsableDimensions().usable_width;
        this.state = {
            code_content: props.the_content,
            notes: props.notes,
            tags: props.tags,
            usable_width: awidth,
            usable_height: aheight,
            dark_theme: this.props.initial_theme == "dark"
        };
    }

    componentDidMount() {
        window.addEventListener("resize", this._update_window_dimensions);
        this._update_window_dimensions();
        this.props.stopSpinner()
        this.props.setStatusTheme(this.state.dark_theme);
        window.dark_theme = this.state.dark_theme
    }

    _update_window_dimensions() {
        let uwidth = window.innerWidth - 2 * SIDE_MARGIN;
        let uheight = window.innerHeight - BOTTOM_MARGIN;
        if (this.top_ref && this.top_ref.current) {
            uheight = uheight - this.top_ref.current.offsetTop;
        }
        else {
            uheight = uheight - USUAL_TOOLBAR_HEIGHT
        }
        this.setState({usable_height: uheight, usable_width: uwidth})
    }

    _setTheme(dark_theme) {
        this.setState({dark_theme: dark_theme}, ()=> {
            this.props.setStatusTheme(dark_theme);
            window.dark_theme = this.state.dark_theme
        })
    }
    get button_groups() {
        let bgs;
        if (this.props.is_repository) {
            bgs = [
                    [{"name_text": "Copy", "icon_name": "share",
                        "click_handler": () => {copyToLibrary("modules", this.props.resource_name)}, tooltip: "Copy to library"}]
            ]
        }
        else {
            bgs = [
                    [{"name_text": "Save", "icon_name": "saved","click_handler": this._saveMe, tooltip: "Save"},
                     {"name_text": "Mark", "icon_name": "map-marker", "click_handler": this._saveAndCheckpoint, tooltip: "Save and checkpoint"},
                     {"name_text": "SaveAs", "icon_name": "floppy-disk", "click_handler": this._saveMeAs, tooltip: "Save as"},
                     {"name_text": "Load", "icon_name": "upload", "click_handler": this._loadModule, tooltip: "Load tile"},
                     {"name_text": "Share", "icon_name": "share",
                        "click_handler": () => {sendToRepository("tile", this.props.resource_name)}, tooltip: "Share to repository"}],
                    [{"name_text": "History", "icon_name": "history", "click_handler": this._showHistoryViewer, tooltip: "Show history viewer"},
                     {"name_text": "Compare", "icon_name": "comparison", "click_handler": this._showTileDiffer, tooltip: "Compare to another tile"}]
            ]
        }

        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs
    }

    _handleCodeChange(new_code) {
        this.setState({"code_content": new_code})
    }

    _handleStateChange(state_stuff) {
        this.setState(state_stuff)
    }

     _handleResize(entries) {
        for (let entry of entries) {
            if (entry.target.id == "root") {
                this.setState({usable_width: entry.contentRect.width,
                    usable_height: entry.contentRect.height - BOTTOM_MARGIN - entry.target.getBoundingClientRect().top
                });
                return
            }
        }
    }

    _doFlashStopSpinner(data) {
        this.props.stopSpinner();
        this.props.clearStatusMessage()
        doFlash(data)
    }


    get_new_cc_height () {
        if (this.cc_ref && this.cc_ref.current) {  // This will be true after the initial render
            return this.state.usable_height - this.cc_ref.current.offsetTop
        }
        else {
            return this.state.usable_height - 100
        }
    }

    render() {
        let the_context = {"readOnly": this.props.readOnly};
        let outer_style = {width: "100%",
            height: this.state.usable_height,
            paddingLeft: SIDE_MARGIN
        };
        let cc_height = this.get_new_cc_height();
        let outer_class = "resource-viewer-holder"
        if (this.state.dark_theme) {
            outer_class = outer_class + " bp3-dark";
        }
        else {
            outer_class = outer_class + " light-theme"
        }
        return (
            <ViewerContext.Provider value={the_context}>
                <TacticNavbar is_authenticated={window.is_authenticated}
                              selected={null}
                              show_api_links={true}
                              dark_theme={this.state.dark_theme}
                              set_parent_theme={this._setTheme}
                              user_name={window.username}/>
                <ResizeSensor onResize={this._handleResize} observeParents={true}>
                    <div className={outer_class} ref={this.top_ref} style={outer_style}>
                            <ResourceViewerApp {...this.props.statusFuncs}
                                               res_type="tile"
                                               resource_name={this.props.resource_name}
                                               button_groups={this.button_groups}
                                               handleStateChange={this._handleStateChange}
                                               created={this.props.created}
                                               notes={this.state.notes}
                                               tags={this.state.tags}
                                               saveMe={this._saveMe}
                                               dark_theme={this.state.dark_theme}
                                               meta_outer={this.props.meta_outer}>
                                <ReactCodemirror code_content={this.state.code_content}
                                                 handleChange={this._handleCodeChange}
                                                 saveMe={this._saveMe}
                                                 readOnly={this.props.readOnly}
                                                 dark_theme={this.state.dark_theme}
                                                 code_container_ref={this.cc_ref}
                                                 code_container_height={cc_height}
                                  />
                            </ResourceViewerApp>
                        </div>
                    </ResizeSensor>
            </ViewerContext.Provider>
        )
    }

    _saveMe() {
        this.props.startSpinner();
        this.props.statusMessage("Saving Module");
        let self = this;
        this.doSavePromise()
            .then(self._doFlashStopSpinner)
            .catch(self._doFlashStopSpinner);
        return false
    }

    doSavePromise() {
        let self = this;
        return new Promise (function (resolve, reject) {
            const new_code = self.state.code_content;
            const tagstring = self.state.tags.join(" ");
            const tags = self.state.tags;  // In case it's modified while saving
            const notes = self.state.notes;
            let result_dict;
            let category;
            category = null;
            result_dict = {
                "module_name": self.props.resource_name,
                "category": category,
                "tags": tagstring,
                "notes": notes,
                "new_code": new_code,
                "last_saved": "viewer"
            };
            postAjax("update_module", result_dict, function (data) {
                if (data.success) {
                    self.savedContent = new_code;
                    self.savedTags = tags;
                    self.savedNotes = notes;
                    data.timeout = 2000;
                    resolve(data)
                }
                else {
                    reject(data)
                }
            });
        })
    }

    _saveMeAs(e) {
        doFlash({"message": "not implemented yet", "timeout": 10});
        return false
    }

    _loadModule() {
        let self = this;
        this.props.startSpinner();
        this.doSavePromise()
            .then(function () {
                self.props.statusMessage("Loading Module");
                postWithCallback("host", "load_tile_module_task", {"tile_module_name": self.props.resource_name, "user_id": user_id}, load_success)
            })
            .catch(self._doFlashStopSpinner);

        function load_success(data) {
            if (data.success) {
                data.timeout = 2000;
            }
            self._doFlashStopSpinner(data);
            return false
        }
    }

    _saveAndCheckpoint() {
        this.props.startSpinner();
        let self = this;
        this.doSavePromise()
            .then(function (){
                statusMessage("Checkpointing");
                self.doCheckpointPromise()
                    .then(self._doFlashStopSpinner)
                    .catch(self._doFlashStopSpinner)
            })
            .catch(self._doFlashStopSpinner);
        return false

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

    _showHistoryViewer () {
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${this.props.resource_name}`)
    }

    _showTileDiffer () {
        window.open(`${$SCRIPT_ROOT}/show_tile_differ/${this.props.resource_name}`)
    }


    dirty() {
        let current_content = this.state.code_content;
        const tags = this.state.tags;
        const notes = this.state.notes;
        return !((current_content == this.savedContent) && (tags == this.savedTags) && (notes == this.savedNotes))
    }
}

ModuleViewerApp.propTypes = {
    resource_name: PropTypes.string,
    the_content: PropTypes.string,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    dark_theme: PropTypes.bool,
    readOnly: PropTypes.bool,
    is_repository: PropTypes.bool,
    meta_outer: PropTypes.string
};


module_viewer_main();