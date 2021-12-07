/**
 * Created by bls910
 */

import "../tactic_css/tactic.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import { TextArea } from "@blueprintjs/core";

import {ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app.js";
import {TacticSocket} from "./tactic_socket.js";
import {postAjax, postAjaxPromise, postWithCallback} from "./communication_react.js"
import {doFlash, withStatus} from "./toaster.js"

import {getUsableDimensions, BOTTOM_MARGIN} from "./sizing_tools.js";
import {withErrorDrawer} from "./error_drawer.js";
import {doBinding} from "./utilities_react.js";
import {guid} from "./utilities_react.js";
import {TacticNavbar} from "./blueprint_navbar";
import {showModalReact} from "./modal_react";

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

const LIST_PADDING_TOP = 15;

class ListEditor extends React.Component {

    render() {
        let tastyle = {
            resize: "horizontal",
            margin: 2,
            height: this.props.height - LIST_PADDING_TOP,
        };
        return (
            <div id="listarea-container"
                 ref={this.props.outer_ref}
                 style={{margin: 0, paddingTop: LIST_PADDING_TOP}}>
                <TextArea
                      cols="50"
                      style={tastyle}
                      disabled={this.props.readOnly}
                      onChange={this.props.handleChange}
                      value={this.props.the_content}
            />
            </div>
        )

    }
}

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

    get menu_specs() {
        let ms;
        if (this.props.is_repository) {
            ms = {
                Transfer: [{
                    "name_text": "Copy to library", "icon_name": "import",
                    "click_handler": () => {
                        copyToLibrary("list", this._cProp("resource_name"))
                    }, tooltip: "Copy to library"
                }]
            }
        }
        else {
            ms = {
                Save: [
                    {name_text: "Save",
                    icon_name: "saved",
                    click_handler: this._saveMe,
                    key_bindings: ['ctrl+s'],
                    tooltip: "Save"},
                    {name_text: "Save As...",
                        icon_name: "floppy-disk",
                        click_handler: this._saveMeAs,
                        tooltip: "Save as"},
                ],
                Transfer: [
                    {name_text: "Share",
                        icon_name: "share",
                        click_handler: () => {
                            sendToRepository("list", this._cProp("resource_name"))
                        },
                        tooltip: "Share to repository"
                    },
                ]

            }
        }
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms
    }

    _setResourceNameState(new_name, callback=null) {
        if (this.props.controlled) {
            this.props.changeResourceName(new_name, callback)
        }
        else {
            this.setState({resource_name: new_name}, callback)
        }
    }

    _handleStateChange(state_stuff) {
        this.setState(state_stuff)
    }

    _handleListChange(event) {
        this.setState({"list_content": event.target.value});
    }

    _update_window_dimensions() {
        this.setState({
            usable_width: window.innerWidth - this.top_ref.current.offsetLeft,
            usable_height: window.innerHeight - this.top_ref.current.offsetTop
        });
    }

    get_new_le_height () {
        let uheight = this._cProp("usable_height");
        if (this.le_ref && this.le_ref.current) {  // This will be true after the initial render
            return uheight - this.le_ref.current.offsetTop - BOTTOM_MARGIN
        }
        else {
            return uheight - 100
        }
    }

    _saveMe() {
        if (!this.props.am_selected) {
            return false
        }
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
        this.props.startSpinner();
        let self = this;
        postWithCallback("host", "get_list_names", {"user_id": window.user_id}, function (data) {
            let checkboxes;
            showModalReact("Save List As", "New List Name", CreateNewList,
                      "NewList", data["list_names"], null, doCancel)
        }, null, this.props.main_id);
        function doCancel() {
            self.props.stopSpinner()
        }
        function CreateNewList(new_name) {
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": self._cProp("resource_name")
            };
            postAjaxPromise('/create_duplicate_list', result_dict)
                .then((data) => {
                        self._setResourceNameState(new_name, () => {
                            self._saveMe()
                        })
                    }
                )
                .catch(doFlash)
        }
    }


    _dirty() {
        let current_content = this.state.list_content;
        const tags = this.state.tags;
        const notes = this.state.notes;
        return !((current_content == this.savedContent) && (tags == this.savedTags) && (notes == this.savedNotes))
    }

    render() {
        let dark_theme = this.props.controlled ? this.context.dark_theme : this.state.dark_theme;
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
        let outer_class = "resource-viewer-holder";
        if (!this.props.controlled) {
            if (dark_theme) {
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
                                       resource_viewer_id={this.props.resource_viewer_id}
                                       setResourceNameState={this._setResourceNameState}
                                       refreshTab={this.props.refreshTab}
                                       closeTab={this.props.closeTab}
                                       res_type="list"
                                       resource_name={my_props.resource_name}
                                       menu_specs={this.menu_specs}
                                       handleStateChange={this._handleStateChange}
                                       created={this.props.created}
                                       meta_outer={this.props.meta_outer}
                                       notes={this.state.notes}
                                       tags={this.state.tags}
                                       showErrorDrawerButton={false}
                                       saveMe={this._saveMe}>
                            <ListEditor the_content={this.state.list_content}
                                        readOnly={this.props.readOnly}
                                        outer_ref={this.le_ref}
                                        height={this.get_new_le_height()}
                                        handleChange={this._handleListChange}
                            />
                    </ResourceViewerApp>
                </div>
            </React.Fragment>
        )
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
    updatePanel: null,
    refreshTab: null,
    closeTab: null,
};


if (!window.in_context) {
    list_viewer_main();
}