/**
 * Created by bls910
 */

import "../tactic_css/tactic.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {ResourceViewerSocket, ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app.js";
import {ReactCodemirror} from "./react-codemirror.js";
import {postAjax, postAjaxPromise, postWithCallback} from "./communication_react.js"
import {doFlash} from "./toaster.js"
import {withErrorDrawer} from "./error_drawer.js";
import {withStatus} from "./toaster.js";
import {doBinding} from "./utilities_react.js";

import {SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT, getUsableDimensions} from "./sizing_tools.js";
import {guid} from "./utilities_react.js";
import {TacticNavbar} from "./blueprint_navbar.js";

export {module_viewer_props, ModuleViewerApp}
import {TacticContext} from "./tactic_context.js";

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
    var tsocket = new ResourceViewerSocket("main", 5000, {resource_viewer_id: resource_viewer_id});
    finalCallback({
        resource_viewer_id: resource_viewer_id,
        tsocket: tsocket,
        split_tags: data.mdata.tags == "" ? [] : data.mdata.tags.split(" "),
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
        if (!this.props.controlled) {
            let uwidth = window.innerWidth - 2 * SIDE_MARGIN;
            let uheight = window.innerHeight;
            if (this.top_ref && this.top_ref.current) {
                uheight = uheight - this.top_ref.current.offsetTop;
            } else {
                uheight = uheight - USUAL_TOOLBAR_HEIGHT
            }
            this.setState({usable_height: uheight, usable_width: uwidth})
        }
    }

    _setTheme(dark_theme) {
        this.setState({dark_theme: dark_theme}, ()=> {
            if (!window.in_context) {
                window.dark_theme = this.state.dark_theme
            }
        })
    }
    get button_groups() {
        let bgs;
        if (this.props.is_repository) {
            bgs = [
                    [{"name_text": "Copy", "icon_name": "import",
                        "click_handler": () => {copyToLibrary("modules", this.state.resource_name)}, tooltip: "Copy to library"}]
            ]
        }
        else {
            bgs = [
                    [{"name_text": "Save", "icon_name": "saved","click_handler": this._saveMe, tooltip: "Save"},
                     {"name_text": "Mark", "icon_name": "map-marker", "click_handler": this._saveAndCheckpoint, tooltip: "Save and checkpoint"},
                     {"name_text": "SaveAs", "icon_name": "floppy-disk", "click_handler": this._saveMeAs, tooltip: "Save as"},
                     {"name_text": "Load", "icon_name": "upload", "click_handler": this._loadModule, tooltip: "Load tile"},
                     {"name_text": "Share", "icon_name": "share",
                        "click_handler": () => {sendToRepository("tile", this._cProp("resource_name"))}, tooltip: "Share to repository"}],
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

    _doFlashStopSpinner(data) {
        this.props.stopSpinner();
        this.props.clearStatusMessage();
        doFlash(data)
    }


    get_new_cc_height () {
        let uheight = this._cProp("usable_height");
        if (this.cc_ref && this.cc_ref.current) {  // This will be true after the initial render
            return uheight - this.cc_ref.current.offsetTop
        }
        else {
            return uheight - 100
        }
    }

    _setResourceNameState(new_name) {
        if (this.props.controlled) {
            this.props.changeResourceName(new_name)
        }
        else {
            this.setState({resource_name: new_name})
        }
    }

    render() {
        let dark_theme = this.props.controlled ? this.context.dark_theme : this.state.dark_theme;
        let the_context = {"readOnly": this.props.readOnly};
        let my_props = {...this.props};
        if (!this.props.controlled) {
            for (let prop_name of controllable_props) {
                my_props[prop_name] = this.state[prop_name]
            }
        }
        let outer_style = {width: "100%",
            height: my_props.usable_height,
            paddingLeft: SIDE_MARGIN
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
            <TacticContext.Provider value={{
                    readOnly: this.props.readOnly,
                    tsocket: this.props.tsocket,
                    dark_theme: dark_theme,
                    setTheme:  this.props.controlled ? this.context.setTheme : this._setTheme,
                    controlled: this.props.controlled,
                    am_selected: this.props.am_selected
                }}>
                {!this.props.controlled &&
                    <TacticNavbar is_authenticated={window.is_authenticated}
                                  selected={null}
                                  show_api_links={true}
                                  page_id={this.props.resource_viewer_id}
                                  user_name={window.username}/>
                }
                <div className={outer_class} ref={this.top_ref} style={outer_style}>
                        <ResourceViewerApp {...this.props.statusFuncs}
                                           resource_viewer_id={my_props.resource_viewer_id}
                                           setResourceNameState={this._setResourceNameState}
                                           refreshTab={this.props.refreshTab}
                                           closeTab={this.props.closeTab}
                                           res_type="tile"
                                           resource_name={my_props.resource_name}
                                           button_groups={this.button_groups}
                                           handleStateChange={this._handleStateChange}
                                           created={this.props.created}
                                           notes={this.state.notes}
                                           tags={this.state.tags}
                                           saveMe={this._saveMe}
                                           show_search={true}
                                           update_search_state={this._update_search_state}
                                           meta_outer={this.props.meta_outer}>
                            <ReactCodemirror code_content={this.state.code_content}
                                             handleChange={this._handleCodeChange}
                                             saveMe={this._saveMe}
                                             search_term={this.state.search_string}
                                             code_container_ref={this.cc_ref}
                                             code_container_height={cc_height}
                              />
                        </ResourceViewerApp>
                    </div>
            </TacticContext.Provider>
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
                postWithCallback("host", "load_tile_module_task", {"tile_module_name": self._cProp("resource_name"), "user_id": user_id},
                    load_success, self.props.resource_viewer_id)
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

ModuleViewerApp.contextType = TacticContext;

if (!window.in_context) {
    module_viewer_main();
}
