

import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import { Tabs, Tab, Tooltip, Icon, Position } from "@blueprintjs/core";
import {Regions} from "@blueprintjs/table";

import {Toolbar} from "./blueprint_toolbar.js"
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

export {repository_props, RepositoryHomeApp}

const MARGIN_SIZE = 17;

let tsocket;

function _repository_home_main () {
    window.library_id = guid();
    tsocket = new TacticSocket(
        "library",
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
                                     res_type="collection"
                                     allow_search_inside={false}
                                     allow_search_metadata={false}
                                     ToolbarClass={RepositoryCollectionToolbar}
                                     updatePaneState={this._updatePaneState}
                                     {...this.state.pane_states["collection"]}
                                     {...this.props.errorDrawerFuncs}
                                     errorDrawerFuncs={this.props.errorDrawerFuncs}
                                     is_repository={true}/>
        );
        let projects_pane = (<LibraryPane {...lib_props}
                                          res_type="project"
                                          allow_search_inside={false}
                                          allow_search_metadata={true}
                                          ToolbarClass={RepositoryProjectToolbar}
                                          updatePaneState={this._updatePaneState}
                                          {...this.state.pane_states["project"]}
                                          {...this.props.errorDrawerFuncs}
                                          errorDrawerFuncs={this.props.errorDrawerFuncs}
                                          is_repository={true}/>
        );
        let tiles_pane = (<LibraryPane {...lib_props}
                                       res_type="tile"
                                       allow_search_inside={true}
                                       allow_search_metadata={true}
                                       ToolbarClass={RepositoryTileToolbar}
                                       updatePaneState={this._updatePaneState}
                                       {...this.state.pane_states["tile"]}
                                       {...this.props.errorDrawerFuncs}
                                       errorDrawerFuncs={this.props.errorDrawerFuncs}
                                       is_repository={true}/>
        );
        let lists_pane = (<LibraryPane {...lib_props}
                                       res_type="list"
                                       allow_search_inside={true}
                                       allow_search_metadata={true}
                                       ToolbarClass={RepositoryListToolbar}
                                       updatePaneState={this._updatePaneState}
                                       {...this.state.pane_states["list"]}
                                       {...this.props.errorDrawerFuncs}
                                       errorDrawerFuncs={this.props.errorDrawerFuncs}
                                       is_repository={true}/>
        );
        let code_pane = (<LibraryPane {...lib_props}
                                      res_type="code"
                                      allow_search_inside={true}
                                      allow_search_metadata={true}
                                      ToolbarClass={RepositoryCodeToolbar}
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
                outer_class = `${outer_class} bp3-dark`;
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

class LibraryToolbar extends React.Component {

    prepare_button_groups() {
        let new_bgs = [];
        let new_group;
        let new_button;
        for (let group of this.props.button_groups) {
            new_group = [];
            for (let button of group) {
                if (!this.props.multi_select || button[3]) {
                    new_button = {name_text: button[0],
                        click_handler: button[1],
                        icon_name: button[2],
                        multi_select: button[3]};
                    if (button.length > 4) {
                        new_button.intent = button[4]
                    }
                    if (button.length > 5) {
                        new_button.key_bindings = button[5]
                    }
                    if (button.length > 6) {
                        new_button.tooltip = button[6]
                    }
                    new_group.push(new_button)
                }
            }
            if (new_group.length != 0) {
                new_bgs.push(new_group)
            }
        }
        return new_bgs
    }

    prepare_file_adders() {
        if ((this.props.file_adders == null) || (this.props.file_adders.length == 0)) return [];
        let file_adders = [];
        for (let button of this.props.file_adders) {
            let new_button = {name_text: button[0],
                resource_type: button[1],
                process_handler: button[2],
                allowed_file_types: button[3],
                icon_name: button[4],
                checkboxes: button[5],
                combine: button[6],
                tooltip: button[7],
                show_csv_options: button[8]
            };

            file_adders.push(new_button)
        }
        return file_adders
    }

    prepare_popup_buttons() {
         if ((this.props.popup_buttons == null) || (this.props.popup_buttons.length == 0)) return [];
         let popup_buttons = [];
         for (let button of this.props.popup_buttons) {
             let new_button = {name: button[0],
                icon_name: button[1]
             };
             let opt_list = [];
             for (let opt of button[2]) {
                 opt_list.push({opt_name: opt[0], opt_func: opt[1], opt_icon: opt[2]})
             }
             new_button["option_list"] = opt_list;
             popup_buttons.push(new_button);
         }
         return popup_buttons
    }

    render() {
        let outer_style = {
                display: "flex",
                flexDirection: "row",
                position: "relative",
                left: this.props.left_position,
                marginBottom: 10
        };
        let popup_buttons = this.prepare_popup_buttons();
       return <Toolbar button_groups={this.prepare_button_groups()}
                       file_adders={this.prepare_file_adders()}
                       alternate_outer_style={outer_style}
                       sendRef={this.props.sendRef}
                       popup_buttons={popup_buttons}
                       dark_theme={this.props.dark_theme}
                      controlled={this.props.controlled}
                      am_selected={this.props.am_selected}
                      tsocket={this.props.tsocket}
       />
    }
}

LibraryToolbar.propTypes = {
    button_groups: PropTypes.array,
    file_adders: PropTypes.array,
    popup_buttons: PropTypes.array,
    multi_select: PropTypes.bool,
    left_position: PropTypes.number,
    sendRef: PropTypes.func
};

LibraryToolbar.defaultProps = {
    file_adders: null,
    popup_buttons: null
};

let specializedToolbarPropTypes = {
    view_func: PropTypes.func,
    repository_copy_func: PropTypes.func,
    selected_resource: PropTypes.object,
    list_of_selected: PropTypes.array,
    muti_select: PropTypes.bool,
};

class RepositoryCollectionToolbar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    get button_groups() {
        return [
            [["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]
        ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               left_position={this.props.left_position}
                               sendRef={this.props.sendRef}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                              controlled={this.props.controlled}
                              am_selected={this.props.am_selected}
                              tsocket={this.props.tsocket}
        />
     }
}

RepositoryCollectionToolbar.propTypes = specializedToolbarPropTypes;


class RepositoryProjectToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }


    get button_groups() {
        return [
            [["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]
        ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               left_position={this.props.left_position}
                               sendRef={this.props.sendRef}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                              controlled={this.props.controlled}
                              am_selected={this.props.am_selected}
                              tsocket={this.props.tsocket}
        />
     }

}

RepositoryProjectToolbar.propTypes = specializedToolbarPropTypes;

class RepositoryTileToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _tile_view(e) {
        this.props.view_func("/repository_view_module/")
    }

    get button_groups() {
        return [
            [["view", this._tile_view, "eye-open", false, "regular", [], "view"],
                ["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]
            ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               left_position={this.props.left_position}
                               sendRef={this.props.sendRef}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                              controlled={this.props.controlled}
                              am_selected={this.props.am_selected}
                              tsocket={this.props.tsocket}
        />
     }

}

RepositoryTileToolbar.propTypes = specializedToolbarPropTypes;

class RepositoryListToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _list_view(e) {
        this.props.view_func("/repository_view_list/")
    }

    get button_groups() {
        return [
            [["view", this._list_view, "eye-open", false, "regular", [], "view"],
                ["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]
        ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               left_position={this.props.left_position}
                               sendRef={this.props.sendRef}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                              controlled={this.props.controlled}
                              am_selected={this.props.am_selected}
                              tsocket={this.props.tsocket}
        />
     }

}

RepositoryListToolbar.propTypes = specializedToolbarPropTypes;


class RepositoryCodeToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _code_view(e) {
        this.props.view_func("/repository_view_code/")
    }


    get button_groups() {
        return [
            [["view", this._code_view, "eye-open", false, "regular", [], "view"],
                ["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]
        ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               left_position={this.props.left_position}
                               sendRef={this.props.sendRef}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                              controlled={this.props.controlled}
                              am_selected={this.props.am_selected}
                              tsocket={this.props.tsocket}
        />
     }

}

RepositoryCodeToolbar.propTypes = specializedToolbarPropTypes;

if (!window.in_context) {
    _repository_home_main();
}
