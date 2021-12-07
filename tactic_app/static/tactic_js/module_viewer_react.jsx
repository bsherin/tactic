/**
 * Created by bls910
 */

import "../tactic_css/tactic.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app.js";
import {TacticSocket} from "./tactic_socket.js";
import {ReactCodemirror} from "./react-codemirror.js";
import {postAjax, postAjaxPromise, postWithCallback} from "./communication_react.js"
import {doFlash} from "./toaster.js"
import {withErrorDrawer} from "./error_drawer.js";
import {withStatus} from "./toaster.js";
import {doBinding} from "./utilities_react.js";

import {getUsableDimensions, BOTTOM_MARGIN} from "./sizing_tools.js";
import {guid} from "./utilities_react.js";
import {TacticNavbar} from "./blueprint_navbar.js";
import {showModalReact} from "./modal_react.js";

export {module_viewer_props, ModuleViewerApp}

function module_viewer_main () {
    function gotProps(the_props) {
        let ModuleViewerAppPlus = withErrorDrawer(withStatus(ModuleViewerApp));
        let the_element = <ModuleViewerAppPlus {...the_props}
                                     controlled={false}
                                     initial_theme={window.theme}
                                     changeName={null}
        />;
        let domContainer = document.querySelector('#root');
        ReactDOM.render(the_element, domContainer)
    }
    let target = window.is_repository ? "repository_view_module_in_context" : "view_module_in_context";
    postAjaxPromise(target, {"resource_name": window.resource_name})
        .then((data)=>{
            module_viewer_props(data, null, gotProps);

        })
}

const controllable_props = ["resource_name", "usable_height", "usable_width"];

function module_viewer_props(data, registerDirtyMethod, finalCallback) {

    let resource_viewer_id = guid();
    var tsocket = new TacticSocket("main", 5000, resource_viewer_id);

    finalCallback({
        resource_viewer_id: resource_viewer_id,
        main_id: resource_viewer_id,
        tsocket: tsocket,
        split_tags: data.mdata.tags == "" ? [] : data.mdata.tags.split(" "),
        created: data.mdata.datestring,
        resource_name: data.resource_name,
        the_content: data.the_content,
        notes: data.mdata.notes,
        readOnly: data.read_only,
        is_repository: data.is_repository,
        meta_outer: "#right-div",
        registerDirtyMethod: registerDirtyMethod
    })
}


class ModuleViewerApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.top_ref = React.createRef();
        this.cc_ref = React.createRef();
        this.search_ref = React.createRef();
        this.savedContent = props.the_content;
        this.savedTags = props.split_tags;
        this.savedNotes = props.notes;
        let self = this;

        this.state = {
            code_content: props.the_content,
            notes: props.notes,
            tags: props.split_tags,
            search_string: "",
        };

        if (props.controlled) {
            props.registerDirtyMethod(this._dirty)
        }

        if (!props.controlled) {
            const aheight = getUsableDimensions(true).usable_height_no_bottom;
            const awidth = getUsableDimensions(true).usable_width - 170;
            this.state.usable_height = aheight;
            this.state.usable_width = awidth;
            this.state.dark_theme = props.initial_theme === "dark";
            this.state.resource_name = props.resource_name;
            window.addEventListener("beforeunload", function (e) {
                if (self._dirty()) {
                    e.preventDefault();
                    e.returnValue = ''
                }
            });
        }
    }


    _update_search_state(nstate) {
        this.setState(nstate)
    }

    componentDidMount() {
        this.props.stopSpinner();
        if (!this.props.controlled) {
            window.dark_theme = this.state.dark_theme;
            window.addEventListener("resize", this._update_window_dimensions);
            this._update_window_dimensions();
        }
    }

    _cProp(pname) {
            return this.props.controlled ? this.props[pname] :  this.state[pname]
    }

    _update_window_dimensions() {
        this.setState({
            usable_width: window.innerWidth - this.top_ref.current.offsetLeft,
            usable_height: window.innerHeight - this.top_ref.current.offsetTop
        });
    }

    _setTheme(dark_theme) {
        this.setState({dark_theme: dark_theme}, ()=> {
            if (!window.in_context) {
                window.dark_theme = this.state.dark_theme
            }
        })
    }

    get menu_specs() {
        let ms;
        if (this.props.is_repository) {
            ms = {
                Transfer: [{
                    "name_text": "Copy to library", "icon_name": "import",
                    "click_handler": () => {
                        copyToLibrary("tile", this._cProp("resource_name"))
                    }, tooltip: "Copy to library"
                }]
            }
        }
        else {
            ms = {
                Save :[{"name_text": "Save", "icon_name": "saved","click_handler": this._saveMe, key_bindings: ['ctrl+s'], tooltip: "Save"},
                        {"name_text": "Save As...", "icon_name": "floppy-disk", "click_handler": this._saveModuleAs, tooltip: "Save as"},
                        {"name_text": "Save and Checkpoint", "icon_name": "map-marker", "click_handler": this._saveAndCheckpoint, key_bindings: ['ctrl+m'], tooltip: "Save and checkpoint"}],
                Load: [{"name_text": "Save and Load", "icon_name": "upload", "click_handler": this._saveAndLoadModule, key_bindings: ['ctrl+l'], tooltip: "Save and load module"},
                        {"name_text": "Load", "icon_name": "upload", "click_handler": this._loadModule, tooltip: "Load tile"}],
                Compare: [{"name_text": "View History", "icon_name": "history", "click_handler": this._showHistoryViewer, tooltip: "Show history viewer"},
                          {"name_text": "Compare to Other Modules", "icon_name": "comparison", "click_handler": this._showTileDiffer, tooltip: "Compare to another tile"}],
                Transfer: [{name_text: "Share",
                        icon_name: "share",
                        click_handler: () => {
                            sendToRepository("list", this._cProp("resource_name"))
                        },
                        tooltip: "Share to repository"
                    },]
            }
        }
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms
    }

    _handleCodeChange(new_code) {
        this.setState({"code_content": new_code})
    }

    _handleStateChange(state_stuff) {
        this.setState(state_stuff)
    }

    _doFlashStopSpinner(data) {
        this.props.stopSpinner();
        this.props.clearStatusMessage();
        doFlash(data)
    }


    get_new_cc_height () {
        let uheight = this._cProp("usable_height");
        if (this.cc_ref && this.cc_ref.current) {  // This will be true after the initial render
            return uheight - this.cc_ref.current.offsetTop - BOTTOM_MARGIN
        }
        else {
            return uheight - 100
        }
    }

    _setResourceNameState(new_name, callback=null) {
        if (this.props.controlled) {
            this.props.changeResourceName(new_name, callback)
        } else {
            this.setState({resource_name: new_name, callback})
        }
    }

    _extraKeys() {
        let self = this;
        return {
                'Ctrl-S': self._saveMe,
                'Ctrl-L': self._saveAndLoadModule,
                'Ctrl-M': self._saveAndCheckpoint,
                'Ctrl-F': ()=>{self.search_ref.current.focus()},
                'Cmd-F': ()=>{self.search_ref.current.focus()}
            }
    }

    _saveMe() {
        if (!this.props.am_selected) {
            return false
        }
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
                "module_name": self._cProp("resource_name"),
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

    _saveModuleAs() {
        this.props.startSpinner();
        let self = this;
        postWithCallback("host", "get_tile_names", {"user_id": window.user_id}, function (data) {
            let checkboxes;
            showModalReact("Save Module As", "New ModuleName Name", CreateNewModule,
                      "NewModule", data["tile_names"], null, doCancel)
        }, null, this.props.main_id);
        function doCancel() {
            self.props.stopSpinner()
        }
        function CreateNewModule(new_name) {
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": self._cProp("resource_name")
            };
            postAjaxPromise('/create_duplicate_tile', result_dict)
                .then((data) => {
                    self._setResourceNameState(new_name, () => {
                            self._saveMe()
                        })
                    }
                )
                .catch(doFlash)
        }

    }

    _saveAndLoadModule() {
        let self = this;
        this.props.startSpinner();
        this.doSavePromise()
            .then(function () {
                self.props.statusMessage("Loading Module");
                postWithCallback(
                    "host",
                    "load_tile_module_task",
                    {"tile_module_name": self._cProp("resource_name"), "user_id": window.user_id},
                    load_success,
                    null,
                    self.props.resource_viewer_id)
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

    _loadModule() {
        let self = this;
        this.props.startSpinner();
        self.props.statusMessage("Loading Module");
        postWithCallback(
            "host",
            "load_tile_module_task",
            {"tile_module_name": self._cProp("resource_name"), "user_id": window.user_id},
            load_success,
            null,
            self.props.resource_viewer_id
        );

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
                self.props.statusMessage("Checkpointing");
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
            postAjax("checkpoint_module", {"module_name": self._cProp("resource_name")}, function (data) {
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
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${this._cProp("resource_name")}`)
    }

    _showTileDiffer () {
        window.open(`${$SCRIPT_ROOT}/show_tile_differ/${this._cProp("resource_name")}`)
    }

    _dirty() {
        let current_content = this.state.code_content;
        const tags = this.state.tags;
        const notes = this.state.notes;
        return !((current_content == this.savedContent) && (tags == this.savedTags) && (notes == this.savedNotes))
    }

     render() {
        let dark_theme = this.props.controlled ? this.props.dark_theme : this.state.dark_theme;
        let the_context = {"readOnly": this.props.readOnly};
        let my_props = {...this.props};
        if (!this.props.controlled) {
            for (let prop_name of controllable_props) {
                my_props[prop_name] = this.state[prop_name]
            }
        }
        let outer_style = {
            width: "100%",
            height: my_props.usable_height,
            paddingLeft: 0,
            position: "relative"
        };
        let cc_height = this.get_new_cc_height();
        let outer_class = "resource-viewer-holder";
        if (!this.props.controlled) {
            // outer_class = "resource-viewer-holder";
            if (this.state.dark_theme) {
                outer_class = outer_class + " bp3-dark";
            } else {
                outer_class = outer_class + " light-theme"
            }
        }
        return (
            <React.Fragment>
                {!this.props.controlled &&
                    <TacticNavbar is_authenticated={window.is_authenticated}
                                  dark_theme={dark_theme}
                                  setTheme={this.props.controlled ? this.props.setTheme : this._setTheme}
                                  selected={null}
                                  show_api_links={true}
                                  page_id={this.props.resource_viewer_id}
                                  user_name={window.username}/>
                }
                <div className={outer_class} ref={this.top_ref} style={outer_style}>
                        <ResourceViewerApp {...my_props}
                                           resource_viewer_id={my_props.resource_viewer_id}
                                           setResourceNameState={this._setResourceNameState}
                                           refreshTab={this.props.refreshTab}
                                           closeTab={this.props.closeTab}
                                           res_type="tile"
                                           resource_name={my_props.resource_name}
                                           menu_specs={this.menu_specs}
                                           handleStateChange={this._handleStateChange}
                                           created={this.props.created}
                                           notes={this.state.notes}
                                           tags={this.state.tags}
                                           saveMe={this._saveMe}
                                           show_search={true}
                                           update_search_state={this._update_search_state}
                                           search_ref={this.search_ref}
                                           meta_outer={this.props.meta_outer}
                                           showErrorDrawerButton={true}
                                           toggleErrorDrawer={this.props.toggleErrorDrawer}
                        >
                            <ReactCodemirror code_content={this.state.code_content}
                                             dark_theme={dark_theme}
                                             extraKeys={this._extraKeys()}
                                             readOnly={this.props.readOnly}
                                             handleChange={this._handleCodeChange}
                                             saveMe={this._saveMe}
                                             search_term={this.state.search_string}
                                             code_container_ref={this.cc_ref}
                                             code_container_height={cc_height}
                              />
                        </ResourceViewerApp>
                    </div>
            </React.Fragment>
        )
    }
}

ModuleViewerApp.propTypes = {
    controlled: PropTypes.bool,
    am_selected: PropTypes.bool,
    changeResourceName: PropTypes.func,
    changeResourceTitle: PropTypes.func,
    changeResourceProps: PropTypes.func,
    updatePanel: PropTypes.func,
    refreshTab: PropTypes.func,
    closeTab: PropTypes.func,
    the_content: PropTypes.string,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    dark_theme: PropTypes.bool,
    readOnly: PropTypes.bool,
    is_repository: PropTypes.bool,
    meta_outer: PropTypes.string,
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

ModuleViewerApp.defaultProps = {
    am_selected: true,
    controlled: false,
    changeResourceName: null,
    changeResourceTitle: null,
    changeResourceProps: null,
    refreshTab: null,
    closeTab: null,
    updatePanel: null
};

if (!window.in_context) {
    module_viewer_main();
}
