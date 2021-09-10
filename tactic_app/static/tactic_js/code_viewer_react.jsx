/**
 * Created by bls910
 */

import "../tactic_css/tactic.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import {ReactCodemirror} from "./react-codemirror.js";

import {ResourceViewerApp, copyToLibrary, sendToRepository} from "./resource_viewer_react_app.js";
import {TacticSocket} from "./tactic_socket.js";
import {postAjaxPromise, postWithCallback} from "./communication_react.js"
import {doFlash, withStatus} from "./toaster.js"

import {getUsableDimensions, SIDE_MARGIN} from "./sizing_tools.js";
import {withErrorDrawer} from "./error_drawer.js";
import {doBinding} from "./utilities_react.js";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";
import {TacticContext} from "./tactic_context.js";

export {code_viewer_props, CodeViewerApp}

function code_viewer_main () {
    function gotProps(the_props) {
        let CodeViewerAppPlus = withErrorDrawer(withStatus(CodeViewerApp));
        let the_element = <CodeViewerAppPlus {...the_props}
                                     controlled={false}
                                     initial_theme={window.theme}
                                     changeName={null}
        />;
        let domContainer = document.querySelector('#root');
        ReactDOM.render(the_element, domContainer)
    }
    let target = window.is_repository ? "repository_view_code_in_context" : "view_code_in_context";
    postAjaxPromise(target, {"resource_name": window.resource_name})
        .then((data)=>{
            code_viewer_props(data, null, gotProps);
        })
}

function code_viewer_props(data, registerDirtyMethod, finalCallback) {
    
    let resource_viewer_id = guid();
    var tsocket = new TacticSocket("main", 5000, resource_viewer_id);

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
const controllable_props = ["resource_name", "usable_height", "usable_width"];

class CodeViewerApp extends React.Component {

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
                          "click_handler": () => {sendToRepository("code", this._cProp("resource_name"))},
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

    _setResourceNameState(new_name) {
        if (this.props.controlled) {
            this.props.changeResourceName(new_name)
        }
        else {
            this.setState({resource_name: new_name})
        }
    }

    _handleStateChange(state_stuff) {
        this.setState(state_stuff)
    }

    _handleCodeChange(new_code) {
        this.setState({"code_content": new_code})
    }

    _update_window_dimensions() {
        this.setState({
            usable_width: window.innerWidth - this.top_ref.current.offsetLeft,
            usable_height: window.innerHeight - this.top_ref.current.offsetTop
        });
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
            paddingLeft: SIDE_MARGIN
        };
        let cc_height = this.get_new_cc_height();
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
                    <ResourceViewerApp {...my_props}
                                       resource_viewer_id={this.props.resource_viewer_id}
                                       setResourceNameState={this._setResourceNameState}
                                       refreshTab={this.props.refreshTab}
                                       closeTab={this.props.closeTab}
                                       res_type="code"
                                       resource_name={my_props.resource_name}
                                       button_groups={this.button_groups}
                                       handleStateChange={this._handleStateChange}
                                       created={this.props.created}
                                       meta_outer={this.props.meta_outer}
                                       notes={this.state.notes}
                                       tags={this.state.tags}
                                       saveMe={this._saveMe}
                                       show_search={true}
                                       update_search_state={this._update_search_state}>
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
        const new_code = this.state.code_content;
        const tagstring = this.state.tags.join(" ");
        const notes = this.state.notes;
        const tags = this.state.tags;  // In case it's modified wile saving
        const result_dict = {
            "code_name": this._cProp("resource_name"),
            "new_code": new_code,
            "tags": tagstring,
            "notes": notes,
            "user_id": window.user_id
        };
        let self = this;
        postWithCallback("host","update_code_task", result_dict,
            update_success, null, this.props.resource_viewer_id);
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


    _dirty() {
        let current_content = this.state.code_content;
        const tags = this.state.tags;
        const notes = this.state.notes;
        return !((current_content == this.savedContent) && (tags == this.savedTags) && (notes == this.savedNotes))
    }
}

CodeViewerApp.propTypes = {
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

CodeViewerApp.defaultProps = {
    am_selected: true,
    controlled: false,
    changeResourceName: null,
    changeResourceTitle: null,
    changeResourceProps: null,
    updatePanel: null,
    refreshTab: null,
    closeTab: null,
};

CodeViewerApp.contextType = TacticContext;


if (!window.in_context) {
    code_viewer_main();
}