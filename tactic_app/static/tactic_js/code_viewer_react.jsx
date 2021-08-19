/**
 * Created by bls910
 */

import "../tactic_css/tactic.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {ResourceViewerSocket, ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app.js";
import {ReactCodemirror} from "./react-codemirror.js";
import {ViewerContext} from "./resource_viewer_context.js";
import {postAjaxPromise, postWithCallback} from "./communication_react.js"
import {doFlash, withStatus} from "./toaster.js"

import {getUsableDimensions, BOTTOM_MARGIN, SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT} from "./sizing_tools.js";
import {withErrorDrawer} from "./error_drawer.js";
import {doBinding} from "./utilities_react.js";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";

window.resource_viewer_id = guid();
window.main_id = resource_viewer_id;

function code_viewer_main ()  {
    let get_url = window.is_repository ? "repository_get_code_code" : "get_code_code";
    let get_mdata_url = window.is_repository ? "grab_repository_metadata" : "grab_metadata";

    var tsocket = new ResourceViewerSocket("main", 5000);
    postAjaxPromise(`${get_url}/${window.resource_name}`, {})
        .then(function (data) {
            var the_content = data.the_content;
            let result_dict = {"res_type": "code", "res_name": window.resource_name, "is_repository": false};
            let CodeViewerAppPlus = withErrorDrawer(withStatus(CodeViewerApp, tsocket), tsocket);
            let domContainer = document.querySelector('#root');
            postAjaxPromise(get_mdata_url, result_dict)
			        .then(function (data) {
			            let split_tags = data.tags == "" ? [] : data.tags.split(" ");
                        ReactDOM.render(<CodeViewerAppPlus
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
			            ReactDOM.render(<CodeViewerAppPlus
                                                       the_content={the_content}
                                                       created=""
                                                       tags={[]}
                                                       notes=""
                                                       readOnly={window.read_only}
                                                       initial_theme={window.theme}
                                                       is_repository={window.is_repository}
                                                       meta_outer="#right-div"/>, domContainer);
			        })
        })
        .catch(doFlash);
}

class CodeViewerApp extends React.Component {

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
            resource_name: window.resource_name,
            code_content: props.the_content,
            notes: props.notes,
            tags: props.tags,
            usable_width: awidth,
            usable_height: aheight,
            search_string: "",
            dark_theme: this.props.initial_theme == "dark"
        };
    }

    _update_search_state(nstate) {
        this.setState(nstate)
    }

    componentDidMount() {
        window.addEventListener("resize", this._update_window_dimensions);
        this._update_window_dimensions();
        this.props.stopSpinner();
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
             bgs =[[{"name_text": "Copy", "icon_name": "share",
                        "click_handler": () => {copyToLibrary("code", this.state.resource_name)}, tooltip: "Copy to library"}]
            ]
        }
        else {
            bgs = [[{"name_text": "Save", "icon_name": "saved", "click_handler": this._saveMe, tooltip: "Save"},
                    {"name_text": "SaveAs", "icon_name": "floppy-disk", "click_handler": this._saveMeAs, tooltip: "Save as"},
                    {"name_text": "Share", "icon_name": "share",
                          "click_handler": () => {sendToRepository("code", this.state.resource_name)}, tooltip: "Share to repository"}]
            ]
        }

        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs

    }

    _setResourceNameState(new_name) {
        this.setState({resource_name: new_name})
    }

    _handleCodeChange(new_code) {
        this.setState({"code_content": new_code})
    }

    _handleStateChange(state_stuff) {
        this.setState(state_stuff)
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
        let outer_class = "resource-viewer-holder";
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
                <div className={outer_class} ref={this.top_ref} style={outer_style}>
                    <ResourceViewerApp {...this.props.statusFuncs}
                                       setResourceNameState={this._setResourceNameState}
                                       res_type="code"
                                       resource_name={this.state.resource_name}
                                       button_groups={this.button_groups}
                                       handleStateChange={this._handleStateChange}
                                       created={this.props.created}
                                       notes={this.state.notes}
                                       tags={this.state.tags}
                                       saveMe={this._saveMe}
                                       show_search={true}
                                       update_search_state={this._update_search_state}
                                       dark_theme={this.state.dark_theme}
                                       meta_outer={this.props.meta_outer}>
                        <ReactCodemirror code_content={this.state.code_content}
                                         handleChange={this._handleCodeChange}
                                         saveMe={this._saveMe}
                                         readOnly={this.props.readOnly}
                                         search_term={this.state.search_string}
                                         dark_theme={this.state.dark_theme}
                                         code_container_ref={this.cc_ref}
                                         code_container_height={cc_height}
                          />
                    </ResourceViewerApp>
                </div>
            </ViewerContext.Provider>
        )
    }

    _saveMe() {
        const new_code = this.state.code_content;
        const tagstring = this.state.tags.join(" ");
        const notes = this.state.notes;
        const tags = this.state.tags;  // In case it's modified wile saving
        const result_dict = {
            "code_name": this.state.resource_name,
            "new_code": new_code,
            "tags": tagstring,
            "notes": notes,
            "user_id": window.user_id
        };
        let self = this;
        postWithCallback("host","update_code_task", result_dict, update_success);
        function update_success(data) {
            if (data.success) {
                self.savedContent = new_code;
                self.savedTags = tags;
                self.savedNotes = notes;
                data.timeout = 2000;
            }
            doFlash(data);
            return false
        }
    }

    _saveMeAs(e) {
        doFlash({"message": "not implemented yet", "timeout": 10});
        return false
    }


    dirty() {
        let current_content = this.state.code_content;
        const tags = this.state.tags;
        const notes = this.state.notes;
        return !((current_content == this.savedContent) && (tags == this.savedTags) && (notes == this.savedNotes))
    }
}

CodeViewerApp.propTypes = {
    the_content: PropTypes.string,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    dark_theme: PropTypes.bool,
    readOnly: PropTypes.bool,
    is_repository: PropTypes.bool,
    meta_outer: PropTypes.string
};


code_viewer_main();