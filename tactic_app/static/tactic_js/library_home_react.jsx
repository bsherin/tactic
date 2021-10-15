// noinspection JSCheckFunctionSignatures

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import { Tabs, Tab, Tooltip, Icon, Position } from "@blueprintjs/core";
import {Regions} from "@blueprintjs/table";

import {TacticSocket} from "./tactic_socket.js"
import {handleCallback} from "./communication_react.js"
import {doFlash} from "./toaster.js"
import {LibraryPane} from "./library_pane.js"
import {LoadedTileList} from "./library_widgets.js";
import {SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT, getUsableDimensions} from "./sizing_tools.js";
import {withStatus} from "./toaster.js";
import {withErrorDrawer} from "./error_drawer.js";
import {KeyTrap} from "./key_trap.js";
import {doBinding, guid} from "./utilities_react.js";
import {TacticNavbar} from "./blueprint_navbar";
import {CollectionMenubar, ProjectMenubar, TileMenubar, ListMenubar, CodeMenubar} from "./library_menubars.js"

const TAB_BAR_WIDTH = 50;

export {library_props, LibraryHomeApp, res_types}

function _library_home_main () {
    // window.main_id = library_id;

    const LibraryHomeAppPlus = withErrorDrawer(withStatus(LibraryHomeApp));
    const domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(<LibraryHomeAppPlus {...library_props()}
                                        controlled={false}
                                        initial_theme={window.theme}
                                        registerLibraryTabChanger={null}/>, domContainer)
}

function library_props() {
    let library_id = guid();
    let tsocket = new TacticSocket("main", 5000, library_id);
    return {library_id: library_id, tsocket: tsocket}
}

const res_types = ["collection", "project", "tile", "list", "code"];
const tab_panes = ["collections-pane", "projects-pane", "tiles-pane", "lists-pane", "code-pane"];
const controllable_props = ["usable_width", "usable_height"];

// noinspection JSUnusedLocalSymbols,JSRemoveUnnecessaryParentheses
class LibraryHomeApp extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);

        this.state = {
            selected_tab_id: "collections-pane",
            pane_states: {},
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
                sorting_column: "updated",
                sorting_direction: "descending",
                multi_select: false,
                list_of_selected: [],
                search_string: "",
                search_inside: false,
                search_metadata: false,
                selectedRegions: [Regions.row(0)]
            }
        }
        this.top_ref = React.createRef();
        this.initSocket();
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
    }
    initSocket() {
        let self = this;
        this.props.tsocket.attachListener('handle-callback', (task_packet)=>{
            handleCallback(task_packet, self.props.library_id)
        });
        if (!window.in_context) {
            this.props.tsocket.attachListener("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
            this.props.tsocket.attachListener("doFlash", function(data) {
                doFlash(data)
            });
            this.props.tsocket.attachListener('close-user-windows', (data) => {
                if (!(data["originator"] == library_id)) {
                    window.close()
                }
            });
        }
    }

    componentDidMount() {
        this.setState({"mounted": true});
        this.props.stopSpinner(null);
        // this.props.setStatusTheme(this.props.dark_theme);
        if (!this.props.controlled) {
            window.dark_theme = this.state.dark_theme;
            window.addEventListener("resize", this._handleResize);
            this._handleResize();
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
        this.setState({dark_theme}, ()=> {
            window.dark_theme = dark_theme
        })
    }

    // This mechanism in _handleTabChange necessary in order to force the pane to change
    // before updating window dimensions (which seems to be necessary to get
    // the pane to be appropriately sized when it's shown
    _handleTabChange(newTabId, prevTabId, event) {
        this.setState({selected_tab_id: newTabId})
    }

    _goToNextPane() {
        let tabIndex = tab_panes.indexOf(this.state.selected_tab_id) + 1;
        if (tabIndex === tab_panes.length) {
            tabIndex = 0
        }
        this.setState({selected_tab_id: tab_panes[tabIndex]})
    }

    _goToPreviousPane() {
        let tabIndex = tab_panes.indexOf(this.state.selected_tab_id) - 1;
        if (tabIndex === -1) {
            tabIndex = tab_panes.length - 1
        }
        this.setState({selected_tab_id: tab_panes[tabIndex]})
    }

    getIconColor(paneId) {
        return paneId === this.state.selected_tab_id ? "white" : "#CED9E0"
    }

    componentWillUnmount() {
        this.props.tsocket.disconnect();
    }

    _handleResize(entires) {
        this.setState({
            usable_width: window.innerWidth - this.top_ref.current.offsetLeft,
            usable_height: window.innerHeight - this.top_ref.current.offsetTop
        });
    }

    render () {
        let dark_theme = this.props.controlled ? this.props.dark_theme : this.state.dark_theme;
        let tile_widget = <LoadedTileList tsocket={this.props.tsocket}/>;
        let lib_props = {...this.props};
        if (!this.props.controlled) {
            for (let prop_name of controllable_props) {
                lib_props[prop_name] = this.state[prop_name]
            }
            lib_props.usable_width -= TAB_BAR_WIDTH;
        }
        let collection_pane = (
                        <LibraryPane {...lib_props}
                                     res_type="collection"
                                     handleCreateViewer={this.props.handleCreateViewer}
                                     open_resources={this.props.open_resources ? this.props.open_resources["collection"] : null}
                                     allow_search_inside={false}
                                     allow_search_metadata={false}
                                     MenubarClass={CollectionMenubar}
                                     updatePaneState={this._updatePaneState}
                                     {...this.state.pane_states["collection"]}
                                     {...this.props.errorDrawerFuncs}
                                     errorDrawerFuncs={this.props.errorDrawerFuncs}
                                     library_id={this.props.library_id}
                        />
        );
        let projects_pane = (<LibraryPane {...lib_props}
                                          res_type="project"
                                          handleCreateViewer={this.props.handleCreateViewer}
                                          open_resources={this.props.open_resources ? this.props.open_resources["project"] : null}
                                          allow_search_inside={false}
                                          allow_search_metadata={true}
                                          MenubarClass={ProjectMenubar}
                                          updatePaneState={this._updatePaneState}
                                          {...this.props.errorDrawerFuncs}
                                          {...this.state.pane_states["project"]}
                                          library_id={this.props.library_id}
            />
        );
        let tiles_pane = (<LibraryPane {...lib_props}
                                       res_type="tile"
                                       handleCreateViewer={this.props.handleCreateViewer}
                                       open_resources={this.props.open_resources ? this.props.open_resources["tile"] : null}
                                       allow_search_inside={true}
                                       allow_search_metadata={true}
                                       MenubarClass={TileMenubar}
                                       updatePaneState={this._updatePaneState}
                                       {...this.props.errorDrawerFuncs}
                                       {...this.state.pane_states["tile"]}
                                       library_id={this.props.library_id}
                                       aux_pane_title="loaded tile list"
                                       aux_pane={tile_widget}
            />
        );
        let lists_pane = (<LibraryPane {...lib_props}
                                       res_type="list"
                                       open_resources={this.props.open_resources ? this.props.open_resources["list"] : null}
                                       allow_search_inside={true}
                                       allow_search_metadata={true}
                                       MenubarClass={ListMenubar}
                                       {...this.props.errorDrawerFuncs}
                                       updatePaneState={this._updatePaneState}
                                       {...this.state.pane_states["list"]}
                                       library_id={this.props.library_id}
            />
        );
        let code_pane = (<LibraryPane {...lib_props}
                                      res_type="code"
                                      handleCreateViewer={this.props.handleCreateViewer}
                                      open_resources={this.props.open_resources ? this.props.open_resources["code"] : null}
                                      allow_search_inside={true}
                                      allow_search_metadata={true}
                                      MenubarClass={CodeMenubar}
                                      {...this.props.errorDrawerFuncs}
                                      updatePaneState={this._updatePaneState}
                                      {...this.state.pane_states["code"]}
                                      library_id={this.props.library_id}
            />
        );
        let outer_style = {
            height: this.state.available_height,
            width: "100%",
            paddingLeft: 0
        };
        let outer_class = "";
        if (!this.props.controlled) {
            outer_class = "library-pane-holder  ";
            if (dark_theme) {
                outer_class = `${outer_class} bp3-dark`;
            }
            else {
                outer_class = `${outer_class} light-theme`;
            }
        }

        let key_bindings = [[["tab"], this._goToNextPane], [["shift+tab"], this._goToPreviousPane]];
        return (
            <React.Fragment>
                {!this.props.controlled &&
                    <TacticNavbar is_authenticated={window.is_authenticated}
                                  dark_theme={dark_theme}
                                  set_theme={this.props.controlled ? this.props.setTheme : this._setTheme}
                                  selected={null}
                                  show_api_links={false}
                                  page_id={this.props.library_id}
                                  user_name={window.username}/>
                }
                <div className={outer_class} ref={this.top_ref} style={outer_style}>
                    <Tabs id="the_container" style={{marginTop: 100, height: "100%"}}
                             selectedTabId={this.state.selected_tab_id}
                             renderActiveTabPanelOnly={true}
                             vertical={true} large={true} onChange={this._handleTabChange}>
                        <Tab id="collections-pane" panel={collection_pane}>
                            <Tooltip content="Collections" position={Position.RIGHT} intent="warning">
                                <Icon icon="database" iconSize={20} tabIndex={-1} color={this.getIconColor("collections-pane")}/>
                            </Tooltip>
                        </Tab>
                        <Tab id="projects-pane" panel={projects_pane}>
                            <Tooltip content="Projects" position={Position.RIGHT} intent="warning">
                                <Icon icon="projects" iconSize={20} tabIndex={-1} color={this.getIconColor("projects-pane")}/>
                            </Tooltip>
                        </Tab>
                        <Tab id="tiles-pane" panel={tiles_pane}>
                            <Tooltip content="Tiles" position={Position.RIGHT} intent="warning">
                                <Icon icon="application" iconSize={20} tabIndex={-1} color={this.getIconColor("tiles-pane")}/>
                            </Tooltip>
                        </Tab>
                        <Tab id="lists-pane" panel={lists_pane}>
                            <Tooltip content="Lists" position={Position.RIGHT} intent="warning">
                                <Icon icon="list" iconSize={20} tabIndex={-1} color={this.getIconColor("lists-pane")}/>
                            </Tooltip>
                        </Tab>
                        <Tab id="code-pane" panel={code_pane}>
                            <Tooltip content="Code" position={Position.RIGHT} intent="warning">
                                <Icon icon="code" iconSize={20} tabIndex={-1} color={this.getIconColor("code-pane")}/>
                            </Tooltip>
                        </Tab>
                    </Tabs>
                </div>

                {!this.props.controlled &&
                    <KeyTrap global={true} bindings={key_bindings}/>
                }
            </React.Fragment>
        )
    }
}

LibraryHomeApp.propTypes = {
    open_resources: PropTypes.object
};

LibraryHomeApp.defaultProps = {
    open_resources: null
};


if (!window.in_context) {
    _library_home_main();
}

