/**
 * Created by bls910
 */

import "../tactic_css/tactic.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import { TextArea } from "@blueprintjs/core";

import {ResourceViewerSocket, ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app.js";
import {ViewerContext} from "./resource_viewer_context.js";
import {postAjax, postAjaxPromise} from "./communication_react.js"
import {doFlash} from "./toaster.js"

import {SIDE_MARGIN, getUsableDimensions, USUAL_TOOLBAR_HEIGHT} from "./sizing_tools.js";
import {withErrorDrawer} from "./error_drawer.js";
import {withStatus} from "./toaster.js";
import {doBinding} from "./utilities_react.js";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";

export {list_viewer_in_context}

function list_viewer_main () {
    function gotElement(the_element) {
        let domContainer = document.querySelector('#root');
        ReactDOM.render(the_element, domContainer)
    }

    postAjaxPromise("view_list_in_context", {"resource_name": window.resource_name})
        .then((data)=>{
            list_viewer_in_context(data, null, gotElement)
        })

}

function list_viewer_in_context(data, registerThemeSetter, finalCallback, ref=null) {
    let resource_viewer_id = guid();
    if (!window.in_context) {
        window.resource_viewer_id = guid();
        window.main_id = resource_viewer_id;  // needed for postWithCallback
    }
    var tsocket = new ResourceViewerSocket("main", 5000, {resource_viewer_id: resource_viewer_id});
    let ListViewerAppPlus = withErrorDrawer(withStatus(ListViewerApp, tsocket, false, ref));
    let split_tags = data.mdata.tags == "" ? [] : data.mdata.tags.split(" ");
    finalCallback(
        <div id="resource-viewer-root">
            <ListViewerAppPlus resource_name={data.resource_name}
                               the_content={data.the_content}
                               registerThemeSetter={registerThemeSetter}
                               created={data.mdata.datestring}
                               initial_theme={window.theme}
                               tags={split_tags}
                               notes={data.mdata.notes}
                               readOnly={data.read_only}
                               is_repository={false}
                               meta_outer="#right-div"/>)
        </div>)
}

class ListEditor extends React.Component {

    render() {
        let tastyle = {resize: "horizontal", height: this.props.height, margin: 2};
        return (
            <div id="listarea-container" ref={this.props.outer_ref}>
                <TextArea
                      cols="50"
                      style={tastyle}
                      disabled={this.context.readOnly}
                      onChange={this.props.handleChange}
                      value={this.props.the_content}
            />
            </div>
        )

    }
}
ListEditor.contextType = ViewerContext;

ListEditor.propTypes = {
    the_content: PropTypes.string,
    handleChange: PropTypes.func,
    readOnly: PropTypes.bool,
    outer_ref: PropTypes.object,
    height: PropTypes.number
};

class ListViewerApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.top_ref = React.createRef();
        this.le_ref = React.createRef();
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
        let aheight = getUsableDimensions().usable_height_no_bottom;
        let awidth = getUsableDimensions().usable_width - 170;
        this.state = {
            resource_name: props.resource_name,
            list_content: props.the_content,
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
        this.props.stopSpinner();
        if (window.in_context) {
            this.props.registerThemeSetter(this._setTheme);
        }
        // window.dark_theme = this.state.dark_theme
    }

    _setTheme(dark_theme) {
        this.setState({dark_theme: dark_theme}, ()=> {
            this.props.setStatusTheme(dark_theme);
            if (!window.in_context) {
                window.dark_theme = this.state.dark_theme
            }
        })
    }
    get button_groups() {
        let bgs;
        if (this.props.is_repository) {
            bgs = [[{"name_text": "Copy", "icon_name": "share",
                        "click_handler": () => {copyToLibrary("list", this.state.resource_name)}, tooltip: "Copy to library"}]
            ]
        }
        else {
            bgs = [[{"name_text": "Save", "icon_name": "saved", "click_handler": this._saveMe, tooltip: "Save"},
                    {"name_text": "SaveAs", "icon_name": "floppy-disk", "click_handler": this._saveMeAs, tooltip: "Save As"},
                    {"name_text": "Share", "icon_name": "share",
                          "click_handler": () => {sendToRepository("list", this.state.resource_name)},
                        tooltip: "Share to repository"}]
            ]
        }
        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs
    }

    _handleStateChange(state_stuff) {
        this.setState(state_stuff)
    }

    _handleListChange(event) {
        this.setState({"list_content": event.target.value});
    }

    _update_window_dimensions() {
        let uwidth = window.innerWidth - 2 * SIDE_MARGIN;
        let uheight = window.innerHeight;
        if (this.top_ref && this.top_ref.current) {
            uheight = uheight - this.top_ref.current.offsetTop;
        }
        else {
            uheight = uheight - USUAL_TOOLBAR_HEIGHT
        }
        this.setState({usable_height: uheight, usable_width: uwidth})
    }

    get_new_le_height () {
        if (this.le_ref && this.le_ref.current) {  // This will be true after the initial render
            return this.state.usable_height - this.le_ref.current.offsetTop
        }
        else {
            return this.state.usable_height - 100
        }
    }

    _setResourceNameState(new_name) {
        this.setState({resource_name: new_name})
    }

    render() {

        let the_context = {"readOnly": this.props.readOnly};
        let outer_style = {width: "100%",
            height: this.state.usable_height,
            paddingLeft: window.in_context ? 0 : SIDE_MARGIN
        };
        let outer_class = "resource-viewer-holder";
        if (!window.in_context) {
            if (this.state.dark_theme) {
                outer_class = outer_class + " bp3-dark";
            } else {
                outer_class = outer_class + " light-theme"
            }
        }
        return (
            <ViewerContext.Provider value={the_context}>
                {!window.in_context &&
                    <TacticNavbar is_authenticated={window.is_authenticated}
                          selected={null}
                          show_api_links={true}
                          dark_theme={this.state.dark_theme}
                          set_parent_theme={this._setTheme}
                          user_name={window.username}/>
                }
                <div className={outer_class} ref={this.top_ref} style={outer_style}>
                    <ResourceViewerApp {...this.props.statusFuncs}
                                       setResourceNameState={this._setResourceNameState}
                                       resource_name={this.state.resource_name}
                                       created={this.props.created}
                                       meta_outer={this.props.meta_outer}
                                       readOnly={window.read_only}
                                       res_type="list"
                                       button_groups={this.button_groups}
                                       handleStateChange={this._handleStateChange}
                                       notes={this.state.notes}
                                       tags={this.state.tags}
                                       dark_theme={this.state.dark_theme}
                                       saveMe={this._saveMe}>

                            <ListEditor the_content={this.state.list_content}
                                        outer_ref={this.le_ref}
                                        height={this.get_new_le_height()}
                                        handleChange={this._handleListChange}
                            />
                    </ResourceViewerApp>
                </div>
            </ViewerContext.Provider>
        )
    }

    _saveMe() {
        const new_list_as_string = this.state.list_content;
        const tagstring = this.state.tags.join(" ");
        const notes = this.state.notes;
        const tags = this.state.tags;  // In case it's modified wile saving
        const result_dict = {
            "list_name": this.state.resource_name,
            "new_list_as_string": new_list_as_string,
            "tags": tagstring,
            "notes": notes
        };
        let self = this;
        postAjax("update_list", result_dict, update_success);
        function update_success(data) {
            if (data.success) {
                self.savedContent = new_list_as_string;
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
        let current_content = this.state.list_content;
        const tags = this.state.tags;
        const notes = this.state.notes;
        return !((current_content == this.savedContent) && (tags == this.savedTags) && (notes == this.savedNotes))
    }
}

ListViewerApp.propTypes = {
    the_content: PropTypes.string,
    created: PropTypes.string,
    tags: PropTypes.array,
    notes: PropTypes.string,
    readOnly: PropTypes.bool,
    is_repository: PropTypes.bool,
    meta_outer: PropTypes.string
};

if (!window.in_context) {
    list_viewer_main();
}