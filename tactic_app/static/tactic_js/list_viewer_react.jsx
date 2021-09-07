/**
 * Created by bls910
 */

import "../tactic_css/tactic.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import { TextArea } from "@blueprintjs/core";

import {ResourceViewerSocket, ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app.js";
import {postAjax, postAjaxPromise} from "./communication_react.js"
import {doFlash} from "./toaster.js"

import {SIDE_MARGIN, getUsableDimensions, USUAL_TOOLBAR_HEIGHT} from "./sizing_tools.js";
import {withErrorDrawer} from "./error_drawer.js";
import {withStatus} from "./toaster.js";
import {doBinding} from "./utilities_react.js";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {TacticContext} from "./tactic_context.js";

export {list_viewer_props, ListViewerApp}

function list_viewer_main () {

    function gotProps(the_props) {
        let ListViewerAppPlus = withErrorDrawer(withStatus(ListViewerApp));
        let the_element = <ListViewerAppPlus {...the_props}
                                     controlled={false}
                                     initial_theme={window.theme}
                                     changeName={null}
        />;
        let domContainer = document.querySelector('#root');
        ReactDOM.render(the_element, domContainer)
    }
    let target = window.is_repository ? "repository_view_list_in_context" : "view_list_in_context";
    postAjaxPromise(target, {"resource_name": window.resource_name})
        .then((data)=>{
            list_viewer_props(data, null, gotProps);
        })

}

function list_viewer_props(data, registerDirtyMethod, finalCallback) {

    let resource_viewer_id = guid();
    var tsocket = new ResourceViewerSocket("main", 5000);

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
ListEditor.contextType = TacticContext;

ListEditor.propTypes = {
    the_content: PropTypes.string,
    handleChange: PropTypes.func,
    readOnly: PropTypes.bool,
    outer_ref: PropTypes.object,
    height: PropTypes.number
};

const controllable_props = ["resource_name", "usable_height", "usable_width"];

class ListViewerApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.top_ref = React.createRef();
        this.le_ref = React.createRef();
        this.savedContent = props.the_content;
        this.savedTags = props.split_tags;
        this.savedNotes = props.notes;
        let self = this;

        this.state = {
            list_content: props.the_content,
            notes: props.notes,
            tags: props.split_tags,
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

    componentDidMount() {
        this.props.stopSpinner();
        if (!this.props.controlled) {
            window.dark_theme = this.state.dark_theme;
            window.addEventListener("resize", this._update_window_dimensions);
            this._update_window_dimensions();
        }
    }

    _setTheme(dark_theme) {
        this.setState({dark_theme: dark_theme}, ()=> {
            if (!window.in_context) {
                window.dark_theme = this.state.dark_theme
            }
        })
    }
    _cProp(pname) {
            return this.props.controlled ? this.props[pname] :  this.state[pname]
    }

    get button_groups() {
        let bgs;
        if (this.props.is_repository) {
            bgs = [[{"name_text": "Copy", "icon_name": "import",
                        "click_handler": () => {copyToLibrary("list", this._cProp("resource_name"))}, tooltip: "Copy to library"}]
            ]
        }
        else {
            bgs = [[{"name_text": "Save", "icon_name": "saved", "click_handler": this._saveMe, tooltip: "Save"},
                    {"name_text": "Share", "icon_name": "share",
                          "click_handler": () => {sendToRepository("list", this._cProp("resource_name"))},
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
        if (!this.props.controlled) {
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
    }

    get_new_le_height () {
        let uheight = this._cProp("usable_height");
        if (this.le_ref && this.le_ref.current) {  // This will be true after the initial render
            return uheight - this.le_ref.current.offsetTop
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
        let my_props = {...this.props};
        if (!this.props.controlled) {
            for (let prop_name of controllable_props) {
                my_props[prop_name] = this.state[prop_name]
            }
        }
        let outer_style = {width: "100%",
            height: my_props.usable_height,
            paddingLeft: window.in_context ? 0 : SIDE_MARGIN
        };
        let outer_class = "resource-viewer-holder";
        if (!this.props.controlled) {
            if (dark_theme) {
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
                                       resource_viewer_id={this.props.resource_viewer_id}
                                       setResourceNameState={this._setResourceNameState}
                                       refreshTab={this.props.refreshTab}
                                       closeTab={this.props.closeTab}
                                       resource_name={my_props.resource_name}
                                       created={this.props.created}
                                       meta_outer={this.props.meta_outer}
                                       res_type="list"
                                       button_groups={this.button_groups}
                                       handleStateChange={this._handleStateChange}
                                       notes={this.state.notes}
                                       tags={this.state.tags}
                                       saveMe={this._saveMe}>

                            <ListEditor the_content={this.state.list_content}
                                        outer_ref={this.le_ref}
                                        height={this.get_new_le_height()}
                                        handleChange={this._handleListChange}
                            />
                    </ResourceViewerApp>
                </div>
            </TacticContext.Provider>
        )
    }

    _saveMe() {
        const new_list_as_string = this.state.list_content;
        const tagstring = this.state.tags.join(" ");
        const notes = this.state.notes;
        const tags = this.state.tags;  // In case it's modified wile saving
        const result_dict = {
            "list_name": this._cProp("resource_name"),
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


    _dirty() {
        let current_content = this.state.list_content;
        const tags = this.state.tags;
        const notes = this.state.notes;
        return !((current_content == this.savedContent) && (tags == this.savedTags) && (notes == this.savedNotes))
    }
}

ListViewerApp.propTypes = {
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
    readOnly: PropTypes.bool,
    is_repository: PropTypes.bool,
    meta_outer: PropTypes.string,
    tsocket: PropTypes.object,
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

ListViewerApp.defaultProps = {
    am_selected: true,
    controlled: false,
    changeResourceName: null,
    changeResourceTitle: null,
    changeResourceProps: null,
    refreshTab: null,
    closeTab: null,
    updatePanel: null
};

ListViewerApp.contextType = TacticContext;


if (!window.in_context) {
    list_viewer_main();
}