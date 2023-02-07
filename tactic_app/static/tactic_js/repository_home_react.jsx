

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React from "react";
import * as ReactDOM from 'react-dom'

import { Tabs, Tab, Tooltip, Icon, Position } from "@blueprintjs/core";
import {Regions} from "@blueprintjs/table";

import {TacticSocket} from "./tactic_socket.js"
import {handleCallback} from "./communication_react.js"
import {doFlash} from "./toaster.js"
import {LibraryPane} from "./library_pane.js"
import {getUsableDimensions, SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT} from "./sizing_tools.js";
import {withStatus} from "./toaster.js";
import {withErrorDrawer} from "./error_drawer.js";
import {doBinding} from "./utilities_react.js";
import {guid} from "./utilities_react";
import {TacticNavbar} from "./blueprint_navbar";

import {RepositoryCollectionMenubar, RepositoryProjectMenubar, RepositoryTileMenubar,
    RepositoryListMenubar, RepositoryCodeMenubar} from "./repository_menubars.js"

export {repository_props, RepositoryHomeApp}

const MARGIN_SIZE = 17;

let tsocket;

function _repository_home_main () {
    window.library_id = guid();
    tsocket = new TacticSocket(
        "main",
        5000,
        window.library_id
    );
     let RepositoryHomeAppPlus = withErrorDrawer(withStatus(RepositoryHomeApp));
    let domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(<RepositoryHomeAppPlus {...repository_props()}
                                           initial_theme={window.theme}
                                           controlled={false}
                                           tsocket={tsocket}
                                           registerLibraryTabChanger={null}/>, domContainer)
}

function repository_props() {
    return {library_id: guid()}
}

var res_types = ["collection", "project", "tile", "list", "code"];
const controllable_props = ["usable_height", "usable_width"];

class RepositoryHomeApp extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            selected_tab_id: "collections-pane",
            pane_states: {}
        };
         for (let res_type of res_types) {
            this.state.pane_states[res_type] = {
                left_width_fraction: .65,
                selected_resource: {"name": "", "tags": "", "notes": "", "updated": "", "created": ""},
                tag_button_state:{
                    expanded_tags: [],
                    active_tag: "all",
                    tree: []
                },
                sort_field: "updated",
                sort_direction: "descending",
                multi_select: false,
                list_of_selected: [],
                search_string: "",
                search_inside: false,
                search_metadata: false,
                selectedRegions: [Regions.row(0)]
            }
        }
        this.top_ref = React.createRef();
        doBinding(this);
        if (props.registerLibraryTabChanger) {
            props.registerLibraryTabChanger(this._handleTabChange)
        }
        if (!window.controlled) {
            const aheight = getUsableDimensions(true).usable_height_no_bottom;
            const awidth = getUsableDimensions(true).usable_width - 170;
            this.state.usable_height = aheight;
            this.state.usable_width = awidth;
            this.state.dark_theme = props.initial_theme === "dark"
        }
        this.initSocket();
    }
    
    initSocket() {
        let self = this;
        let tsocket = this.props.tsocket;
        if (!window.in_context) {
            tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
            tsocket.attachListener('handle-callback', (task_packet)=>{handleCallback(task_packet, self.extra_args.library_id)});
            tsocket.attachListener("doFlash", function(data) {
                doFlash(data)
            });
            tsocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == window.library_id)) {
                    window.close()
                }
            });
        }
    }

    componentDidMount() {
        this.setState({"mounted": true});
        this.props.stopSpinner();
        if (!this.props.controlled) {
            window.dark_theme = this.state.dark_theme;
            window.addEventListener("resize", this._update_window_dimensions);
            this._update_window_dimensions();
        }
    }

    _updatePaneState (res_type, state_update, callback=null) {
        let old_state = Object.assign({}, this.state.pane_states[res_type]);
        let new_pane_states = Object.assign({}, this.state.pane_states);
        new_pane_states[res_type] = Object.assign(old_state, state_update);
        this.setState({pane_states: new_pane_states}, callback)
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

    _setTheme(dark_theme) {
        this.setState({dark_theme: dark_theme}, ()=> {
            window.dark_theme = dark_theme
        })
    }

    _handleTabChange(newTabId, prevTabId, event) {
        this.setState({selected_tab_id: newTabId}, this._update_window_dimensions)
    }

    getIconColor(paneId) {
        return paneId == this.state.selected_tab_id ? "white" : "#CED9E0"
    }

    render () {
        let tsocket = this.props.tsocket;
        let dark_theme = this.props.controlled ? this.props.dark_theme : this.state.dark_theme;
        let lib_props = {...this.props};
        if (!this.props.controlled) {
            for (let prop_name of controllable_props) {
                lib_props[prop_name] = this.state[prop_name]
            }
        }
        let collection_pane = (
                        <LibraryPane {...lib_props}
                                     pane_type="collection"
                                     allow_search_inside={false}
                                     allow_search_metadata={false}
                                     MenubarClass={RepositoryCollectionMenubar}
                                     updatePaneState={this._updatePaneState}
                                     {...this.state.pane_states["collection"]}
                                     {...this.props.errorDrawerFuncs}
                                     errorDrawerFuncs={this.props.errorDrawerFuncs}
                                     is_repository={true}/>
        );
        let projects_pane = (<LibraryPane {...lib_props}
                                          pane_type="project"
                                          allow_search_inside={false}
                                          allow_search_metadata={true}
                                          MenubarClass={RepositoryProjectMenubar}
                                          updatePaneState={this._updatePaneState}
                                          {...this.state.pane_states["project"]}
                                          {...this.props.errorDrawerFuncs}
                                          errorDrawerFuncs={this.props.errorDrawerFuncs}
                                          is_repository={true}/>
        );
        let tiles_pane = (<LibraryPane {...lib_props}
                                       pane_type="tile"
                                       allow_search_inside={true}
                                       allow_search_metadata={true}
                                       MenubarClass={RepositoryTileMenubar}
                                       updatePaneState={this._updatePaneState}
                                       {...this.state.pane_states["tile"]}
                                       {...this.props.errorDrawerFuncs}
                                       errorDrawerFuncs={this.props.errorDrawerFuncs}
                                       is_repository={true}/>
        );
        let lists_pane = (<LibraryPane {...lib_props}
                                       pane_type="list"
                                       allow_search_inside={true}
                                       allow_search_metadata={true}
                                       MenubarClass={RepositoryListMenubar}
                                       updatePaneState={this._updatePaneState}
                                       {...this.state.pane_states["list"]}
                                       {...this.props.errorDrawerFuncs}
                                       errorDrawerFuncs={this.props.errorDrawerFuncs}
                                       is_repository={true}/>
        );
        let code_pane = (<LibraryPane {...lib_props}
                                      pane_type="code"
                                      allow_search_inside={true}
                                      allow_search_metadata={true}
                                      MenubarClass={RepositoryCodeMenubar}
                                      updatePaneState={this._updatePaneState}
                                      {...this.state.pane_states["code"]}
                                      {...this.props.errorDrawerFuncs}
                                      errorDrawerFuncs={this.props.errorDrawerFuncs}
                                      is_repository={true}/>
        );
        let outer_style = {width: "100%",
            height: this.state.usable_height,
            paddingLeft: 0
        };
        let outer_class = "";
        if (!this.props.controlled) {
            outer_class = "library-pane-holder  ";
            if (dark_theme) {
                outer_class = `${outer_class} bp4-dark`;
            }
            else {
                outer_class = `${outer_class} light-theme`;
            }
        }
        return (
            <React.Fragment>
                {!this.props.controlled &&
                    <TacticNavbar is_authenticated={window.is_authenticated}
                                  dark_theme={dark_theme}
                                  set_theme={this.props.controlled ? this.props.setTheme : this._setTheme}
                                  selected={null}
                                  page_id={this.props.library_id}
                                  show_api_links={false}
                                  extra_text={window.repository_type == "Local" ? "" : window.repository_type }
                                  user_name={window.username}/>
                }
                <div id="repository_container" className={outer_class} ref={this.top_ref} style={outer_style}>
                    <div style={{width: lib_props.usable_width}}>
                        <Tabs id="the_container" style={{marginTop: 100}}
                                 selectedTabId={this.state.selected_tab_id}
                                 renderActiveTabPanelOnly={true}
                                 vertical={true} large={true} onChange={this._handleTabChange}>
                            <Tab id="collections-pane" panel={collection_pane}>
                                <Tooltip content="Collections" position={Position.RIGHT}>
                                    <Icon icon="box" iconSize={20} tabIndex={-1} color={this.getIconColor("collections-pane")}/>
                                </Tooltip>
                            </Tab>
                            <Tab id="projects-pane" panel={projects_pane}>
                                <Tooltip content="Projects" position={Position.RIGHT}>
                                    <Icon icon="projects" iconSize={20} tabIndex={-1} color={this.getIconColor("projects-pane")}/>
                                </Tooltip>
                            </Tab>
                            <Tab id="tiles-pane" panel={tiles_pane}>
                                <Tooltip content="Tiles" position={Position.RIGHT}>
                                    <Icon icon="application" iconSize={20} tabIndex={-1} color={this.getIconColor("tiles-pane")}/>
                                </Tooltip>
                            </Tab>
                            <Tab id="lists-pane" panel={lists_pane}>
                                <Tooltip content="Lists" position={Position.RIGHT}>
                                    <Icon icon="list" iconSize={20} tabIndex={-1} color={this.getIconColor("lists-pane")}/>
                                </Tooltip>
                            </Tab>
                            <Tab id="code-pane" panel={code_pane}>
                                <Tooltip content="Code" position={Position.RIGHT}>
                                    <Icon icon="code" tabIndex={-1} color={this.getIconColor("code-pane")}/>
                                </Tooltip>
                            </Tab>
                        </Tabs>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

if (!window.in_context) {
    _repository_home_main();
}
