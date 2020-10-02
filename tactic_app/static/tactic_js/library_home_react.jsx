import "../tactic_css/tactic.scss";
import "../tactic_css/tactic_table.scss";
import "../tactic_css/library_home.scss";

import React from "react";
import * as ReactDOM from 'react-dom'
import PropTypes from 'prop-types';

import { Tabs, Tab, Tooltip, Icon, Position } from "@blueprintjs/core";
import {Regions} from "@blueprintjs/table";

import {showModalReact} from "./modal_react.js";
import {Toolbar} from "./blueprint_toolbar.js"
import {TacticSocket} from "./tactic_socket.js"
import {render_navbar} from "./blueprint_navbar.js";
import {handleCallback, postAjaxPromise, postAjaxUploadPromise, postWithCallbackNoMain} from "./communication_react.js"
import {doFlash} from "./toaster.js"
import {ViewerContext} from "./resource_viewer_context.js";
import {LibraryPane} from "./library_pane.js"
import {LoadedTileList} from "./library_widgets.js";
import {SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT, getUsableDimensions} from "./sizing_tools.js";
import {withStatus} from "./toaster.js";
import {withErrorDrawer} from "./error_drawer.js";
import {KeyTrap} from "./key_trap.js";
import {doBinding, guid} from "./utilities_react.js";

window.library_id = guid();
window.page_id = window.library_id;
const MARGIN_SIZE = 17;

let tsocket;

function _library_home_main () {
    render_navbar("library");
    tsocket = new LibraryTacticSocket("library", 5000);
    let LibraryHomeAppPlus = withErrorDrawer(withStatus(LibraryHomeApp, tsocket), tsocket);
    let domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(<LibraryHomeAppPlus/>, domContainer)
}

class LibraryTacticSocket extends TacticSocket {

    initialize_socket_stuff() {

        this.socket.emit('join', {"user_id":  window.user_id, "library_id":  window.library_id});

        this.socket.on("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));
        this.socket.on('handle-callback', handleCallback);
        this.socket.on('close-user-windows', (data) => {
            if (!(data["originator"] == window.library_id)) {
                window.close()
            }
        });
        this.socket.on('doflash', doFlash);
    }
}

var res_types = ["collection", "project", "tile", "list", "code"];
const tab_panes = ["collections-pane", "projects-pane", "tiles-pane", "lists-pane", "code-pane"];

class LibraryHomeApp extends React.Component {

    constructor(props) {
        super(props);
        let aheight = getUsableDimensions().usable_height_no_bottom;
        let awidth = getUsableDimensions().usable_width - 170;
        this.state = {
            selected_tab_id: "collections-pane",
            usable_width: awidth,
            usable_height: aheight,
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
        doBinding(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this._update_window_dimensions);
        this.setState({"mounted": true});
        this._update_window_dimensions();
        this.props.stopSpinner()
    }

    _updatePaneState (res_type, state_update, callback=null) {
        let old_state = Object.assign({}, this.state.pane_states[res_type]);
        let new_pane_states = Object.assign({}, this.state.pane_states);
        new_pane_states[res_type] = Object.assign(old_state, state_update);
        this.setState({pane_states: new_pane_states}, callback)
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

    // This mechanism in _handleTabChange necessary in order to force the pane to change
    // before updating window dimensions (which seems to be necessary to get
    // the pane to be appropriately sized when it's shown
    _handleTabChange(newTabId, prevTabId, event) {
        this.setState({selected_tab_id: newTabId}, this._update_window_dimensions)
    }

    _goToNextPane() {
        let tabIndex = tab_panes.indexOf(this.state.selected_tab_id) + 1;
        if (tabIndex == tab_panes.length) {
            tabIndex = 0
        }
        this.setState({selected_tab_id: tab_panes[tabIndex]})
    }

    _goToPreviousPane() {
        let tabIndex = tab_panes.indexOf(this.state.selected_tab_id) - 1;
        if (tabIndex == -1) {
            tabIndex = tab_panes.length - 1
        }
        this.setState({selected_tab_id: tab_panes[tabIndex]})
    }

    getIconColor(paneId) {
        return paneId == this.state.selected_tab_id ? "white" : "#CED9E0"
    }

    render () {
        let tile_widget = <LoadedTileList tsocket={tsocket}/>;
        let collection_pane = (
                        <LibraryPane {...this.props}
                                     res_type="collection"
                                     allow_search_inside={false}
                                     allow_search_metadata={false}
                                     ToolbarClass={CollectionToolbar}
                                     updatePaneState={this._updatePaneState}
                                     {...this.state.pane_states["collection"]}
                                     {...this.props.errorDrawerFuncs}
                                     errorDrawerFuncs={this.props.errorDrawerFuncs}
                                     tsocket={tsocket}/>
        );
        let projects_pane = (<LibraryPane {...this.props}
                                          res_type="project"
                                          allow_search_inside={false}
                                          allow_search_metadata={true}
                                          ToolbarClass={ProjectToolbar}
                                          updatePaneState={this._updatePaneState}
                                          {...this.props.errorDrawerFuncs}
                                          {...this.state.pane_states["project"]}
                                          tsocket={tsocket}/>
        );
        let tiles_pane = (<LibraryPane {...this.props}
                                       res_type="tile"
                                       allow_search_inside={true}
                                       allow_search_metadata={true}
                                       ToolbarClass={TileToolbar}
                                       updatePaneState={this._updatePaneState}
                                       {...this.props.errorDrawerFuncs}
                                       {...this.state.pane_states["tile"]}
                                       tsocket={tsocket}
                                       aux_pane_title="loaded tile list"
                                       aux_pane={tile_widget}/>
        );
        let lists_pane = (<LibraryPane {...this.props}
                                       res_type="list"
                                       allow_search_inside={true}
                                       allow_search_metadata={true}
                                       ToolbarClass={ListToolbar}
                                       {...this.props.errorDrawerFuncs}
                                       updatePaneState={this._updatePaneState}
                                       {...this.state.pane_states["list"]}
                                       tsocket={tsocket}/>
        );
        let code_pane = (<LibraryPane {...this.props}
                                      res_type="code"
                                      allow_search_inside={true}
                                      allow_search_metadata={true}
                                      ToolbarClass={CodeToolbar}
                                      {...this.props.errorDrawerFuncs}
                                      updatePaneState={this._updatePaneState}
                                      {...this.state.pane_states["code"]}
                                      socket={tsocket}/>
        );
        let outer_style = {width: this.state.usable_width,
            height: this.state.usable_height,
            paddingLeft: 0
        };
        let key_bindings = [[["tab"], this._goToNextPane], [["shift+tab"], this._goToPreviousPane]];
        return (
            <ViewerContext.Provider value={{readOnly: false}}>
                <div className="pane-holder" ref={this.top_ref} style={outer_style}>
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
                <KeyTrap global={true} bindings={key_bindings} />
            </ViewerContext.Provider>
        )
    }
}

class LibraryToolbar extends React.Component {

    componentDidMount() {
        if (this.props.context_menu_items) {
            this.props.sendContextMenuItems(this.props.context_menu_items)
        }
    }

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
                    if (button.length > 7) {
                        new_button.show_text = button[7]
                    }
                    else {
                        new_button.show_text = false
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
                click_handler: button[1],
                icon_name: button[2],
                multiple: button[3]};
            if (button.length > 4) {
                new_button.tooltip = button[4]
            }
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
       />
    }
}

LibraryToolbar.propTypes = {
    sendContextMenuItems: PropTypes.func,
    button_groups: PropTypes.array,
    file_adders: PropTypes.array,
    popup_buttons: PropTypes.array,
    multi_select: PropTypes.bool,
    left_position: PropTypes.number,
    sendRef: PropTypes.func
};

LibraryToolbar.defaultProps = {
    file_adders: null,
    popup_buttons: null,
    left_position: 175
};

let specializedToolbarPropTypes = {
    sendContextMenuItems: PropTypes.func,
    view_func: PropTypes.func,
    view_resource: PropTypes.func,
    duplicate_func: PropTypes.func,
    delete_func: PropTypes.func,
    rename_func: PropTypes.func,
    refresh_func: PropTypes.func,
    send_repository_func: PropTypes.func,
    selected_resource: PropTypes.object,
    list_of_selected: PropTypes.array,
    muti_select: PropTypes.bool,
    add_new_row: PropTypes.func
};

class CollectionToolbar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    _collection_duplicate(resource_name=null) {
        this.props.duplicate_func("/duplicate_collection", resource_name)
    }

    _collection_delete(resource_name=null) {
        this.props.delete_func("/delete_collection", resource_name)
    }

    _combineCollections () {
        var res_name = this.props.selected_resource.name;
        let self = this;
        if (!this.props.multi_select) {
            showModalReact("Name of collection to combine with " + res_name, "collection Name", function (other_name) {
                self.props.startSpinner(true);
                const target = `${$SCRIPT_ROOT}/combine_collections/${res_name}/${other_name}`;
                $.post(target, (data)=>{
                    self.props.stopSpinner();
                    if (!data.success) {
                        self.props.addErrorDrawerEntry({title: "Error combining collections", content: data.message})
                    }
                    {
                        doFlash(data);
                    }
                });
            })
        }
        else {
            $.getJSON(`${$SCRIPT_ROOT}get_resource_names/collection`, function (data) {
                showModalReact("Combine Collections", "Name for combined collection", CreateCombinedCollection, "NewCollection", data["resource_names"])
            });
        }

        function CreateCombinedCollection(new_name) {
            postAjaxPromise("combine_to_new_collection",
                {"original_collections": self.props.list_of_selected, "new_name": new_name})
                .then((data) => {
                    self.props.refresh_func()
               data.new_row })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error combining collections", content: data.message})})
        }
    }

    _downloadCollection (resource_name=null) {
        let res_name = resource_name ? resource_name : this.props.selected_resource.name;
        showModalReact("Download Collection as Excel Notebook", "New File Name", function (new_name) {
            window.open(`${$SCRIPT_ROOT}/download_collection/` + res_name  + "/" + new_name)
        }, res_name + ".xlsx")
    };

    displayImportResults(data) {
        let title = "Collection Created";
        let message = "";
        let number_of_errors;
        if (data.file_decoding_errors == null) {
            data.message = "No decoding errors were encounters";
            data.alert_type = "Success";
            doFlash(data);
        }
        else {
            message = "<b>Decoding errors were enountered</b>";
            for (let filename in data.file_decoding_errors) {
                number_of_errors = String(data.file_decoding_errors[filename].length);
                message = message + `<br>${filename}: ${number_of_errors} errors`;
            }
            this.props.addErrorDrawerEntry({title: title, content: message});
        }
    }

    _import_collection(file_list) {
        let the_data = new FormData();
        for (let f of file_list) {
            the_data.append('file', f);
        }

        let self = this;
        let checkboxes = [{"checkname": "import_as_freeform", "checktext": "Import as freeform"}];
        $.getJSON(`${$SCRIPT_ROOT}get_resource_names/collection`, function (data) {
                showModalReact("Import collection", "New collection Name",
                    CreateNewCollection, "NewCollection", data["resource_names"], checkboxes)
            }
        );
        function CreateNewCollection(new_name, check_results) {
            self.props.startSpinner(true);
            let url_base;
            if (check_results["import_as_freeform"]) {
                url_base = "import_as_freeform"
            }
            else {
                url_base = "import_as_table"
            }
            postAjaxUploadPromise(`${url_base}/${new_name}/${window.library_id}`, the_data)
                .then((data) => {
                        self.props.clearStatusMessage();
                        self.displayImportResults(data);
                        self.props.refresh_func();
                        self.props.stopSpinner();
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error importing documents", content: data.message})});
        }
    }

    get button_groups() {
        return [
            [["open", this.props.view_func, "document-open", false, "primary", ["space", "return", "ctrl+o"], "View"]],
            [["duplicate", this._collection_duplicate, "duplicate", false, "success", [], "Duplicate"],
             ["rename",  this.props.rename_func, "edit", false, "warning", [], "Rename"],
             ["combine", this._combineCollections, "merge-columns", true, "success", [], "Combine collections"]],
            [["download", this._downloadCollection, "cloud-download", false, "regular", [], "Download collection"],
             ["share", this.props.send_repository_func, "share", false, "regular", [], "Share to repository"]],
            [["delete", this._collection_delete, "trash", true, "danger", [], "Delete"]],
            [["refresh", this.props.refresh_func, "refresh", false, "regular", [], "Refresh list"]],
            [["drawer", this.props.toggleErrorDrawer, "drawer-right", false, "regular", [], "Toggle Error Drawer"]]
        ];
     }

     get context_menu_items() {
        return [ {text: "open", icon: "document-open", onClick: this.props.view_resource},
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this._collection_duplicate},
            {text: "__divider__"},
            {text: "download", icon: "cloud-download", onClick: this._downloadCollection},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this._collection_delete, intent: "danger"}
        ]
     }

     get file_adders() {
         return[
             [null, this._import_collection, "cloud-upload", true, "Import collection"]
         ]
     }

     render () {
        return <LibraryToolbar sendContextMenuItems={this.props.sendContextMenuItems}
                               context_menu_items={this.context_menu_items}
                              button_groups={this.button_groups}
                               file_adders={this.file_adders}
                               left_position={this.props.left_position}
                               sendRef={this.props.sendRef}
                               multi_select={this.props.multi_select} />
     }
}

CollectionToolbar.propTypes = specializedToolbarPropTypes;


class ProjectToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _project_duplicate(resource_name=null) {
        this.props.duplicate_func('/duplicate_project', resource_name)
    }

    new_notebook () {
        window.open(`${$SCRIPT_ROOT}/new_notebook`)
    }

    _downloadJupyter () {
        let res_name = this.props.selected_resource.name;
        showModalReact("Download Notebook as Jupyter Notebook", "New File Name", function (new_name) {
            window.open(`${$SCRIPT_ROOT}/download_jupyter/` + res_name + "/" + new_name)
        }, res_name + ".ipynb")
    };

   _import_jupyter (file_list) {
        let the_data = new FormData();
        for (let f of file_list) {
            the_data.append('file', f);
        }
        let self = this;
        $.getJSON(`${$SCRIPT_ROOT}get_resource_names/project`, function (data) {
                showModalReact("Import jupyter", "New Jupyter Name", CreateNewJupyter, "NewJupyterNotebook", data["resource_names"], [])
            }
        );
        function CreateNewJupyter(new_name, check_results) {
            self.props.startSpinner(true);
            postAjaxUploadPromise(`import_as_jupyter/${new_name}/${library_id}`, the_data)
                .then((data) => {
                        self.props.clearStatusMessage();
                        self.props.refresh_func();
                        self.props.stopSpinner();
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error importing jupyter notebook", content: data.message})});
        }
    };


    _project_delete(resource_name=null) {
        this.props.delete_func("/delete_project", resource_name)
    }

    get context_menu_items() {
        return [ {text: "open", icon: "document-open", onClick: this.props.view_resource},
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this._project_duplicate},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this._project_delete, intent: "danger"}
        ]
     }

    get button_groups() {
        return [
            [["notebook", this.new_notebook,"new-text-box", false, "regular", ["ctrl+n"], "New notebook", "Notebook"]],
            [["open", this.props.view_func, "document-open", false, "regular", ["space", "return", "ctrl+o"], "View"]],
            [["duplicate", this._project_duplicate, "duplicate", false, "regular", [], "Duplicate"],
             ["rename", this.props.rename_func, "edit", false, "regular", [], "Rename"]],
            [["toJupyter", this._downloadJupyter, "cloud-download", false, "regular", [], "Download as Jupyter Notebook"],
             ["share", this.props.send_repository_func, "share", false, "regular", [], "Share to repository"]],
            [["delete", this._project_delete, "trash", true, "regular", [], "Delete"]],
            [["refresh", this.props.refresh_func, "refresh", false, "regular", [], "Refresh list"]]
        ];
     }

    get file_adders() {
         return[
             [null, this._import_jupyter, "cloud-upload", false, "Import Jupyter notebook"]
         ]
     }

     render () {
        return <LibraryToolbar sendContextMenuItems={this.props.sendContextMenuItems}
                               context_menu_items={this.context_menu_items}
                               button_groups={this.button_groups}
                               file_adders={this.file_adders}
                               left_position={this.props.left_position}
                               sendRef={this.props.sendRef}
                               multi_select={this.props.multi_select} />
     }

}

ProjectToolbar.propTypes = specializedToolbarPropTypes;

class TileToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _tile_view() {
        this.props.view_func("/view_module/")
    }

    _view_named_tile(resource_name) {
        this.props.view_resource(resource_name, "/view_module/")
    }

    _creator_view_named_tile(resource_name) {
        this.props.view_resource(resource_name, "/view_in_creator/")
    }

    _creator_view() {
        this.props.view_func("/view_in_creator/")
    }

    _tile_duplicate(resource_name=null) {
        this.props.duplicate_func('/create_duplicate_tile', resource_name)
    }

    _compare_tiles() {
        let res_names = this.props.list_of_selected;
        if (res_names.length == 0) return;
        if (res_names.length == 1) {
            window.open(`${$SCRIPT_ROOT}/show_tile_differ/${res_names[0]}`)
        }
        else if (res_names.length == 2){
            window.open(`${$SCRIPT_ROOT}/show_tile_differ/both_names/${res_names[0]}/${res_names[1]}`)
        }
        else {
            doFlash({"alert-type": "alert-warning",
                "message": "Select only one or two tiles before launching compare"})
        }
    }
    
    _load_tile(resource_name=null) {
        let self = this;
        if (!resource_name) resource_name = this.props.list_of_selected[0];
        postWithCallbackNoMain("host", "load_tile_module_task",
            {"tile_module_name": resource_name, "user_id": window.user_id},
            (data)=>{
            if (!data.success) {
                self.props.addErrorDrawerEntry({title: "Error loading tile", content: data.message})
            }
            else {
                doFlash(data)
            }
        })
    }
    
    _unload_all_tiles() {
        $.getJSON(`${$SCRIPT_ROOT}/unload_all_tiles`, doFlash)
    }
    
    _tile_delete(resource_name=null) {
        this.props.delete_func("/delete_tile_module", resource_name)
    }

    _new_tile (template_name) {
        $.getJSON($SCRIPT_ROOT + "get_resource_names/tile", function (data) {
                showModalReact("New Tile", "New Tile Name", CreateNewTileModule, "NewTileModule", data["resource_names"])
            }
        );
        let self = this;
        function CreateNewTileModule(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name,
                "last_saved": "viewer"
            };
            postAjaxPromise("/create_tile_module", result_dict)
                .then((data) => {
                    self.props.refresh_func();
                    window.open($SCRIPT_ROOT + "/view_module/" + String(new_name))
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error creating new tile", content: data.message})})
            }
    }

    _new_in_creator (template_name) {
        $.getJSON(`${$SCRIPT_ROOT}/get_resource_names/tile`, function (data) {
                showModalReact("New Tile", "New Tile Name", CreateNewTileModule, "NewTileModule", data["resource_names"])
            }
        );
        let self = this;
        function CreateNewTileModule(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name,
                "last_saved": "creator"
            };
            postAjaxPromise("/create_tile_module", result_dict)
                .then((data) => {
                    self.props.refresh_func();
                    window.open($SCRIPT_ROOT + "/view_in_creator/" + String(new_name))
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error creating new tile", content: data.message})})
            }
    }

    get popup_buttons() {
        return [
            ["tile", "new-text-box", [
                ["StandardTile", ()=>{this._new_in_creator("BasicTileTemplate")}, "code"],
                ["MatplotlibTile", ()=>{this._new_in_creator("MatplotlibTileTemplate")}, "timeline-line-chart"],
                ["D3Tile", ()=>{this._new_in_creator("D3TileTemplate")}, "timeline-area-chart"]]
            ]
        ]
    }

    get context_menu_items() {
        return [ {text: "edit", icon: "edit", onClick: this._view_named_tile},
            {text: "edit in creator", icon: "annotation", onClick: this._creator_view_named_tile},
            {text: "__divider__"},
            {text: "load", icon: "upload", onClick: this._load_tile},
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this._tile_duplicate},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this._tile_delete, intent: "danger"}
        ]
     }

    get button_groups() {
        return [
            [
             ["creator", this._creator_view, "document-open", false, "regular", ["space", "return", "ctrl+o"], "View in tile creator"],
                ["compare", this._compare_tiles, "comparison", true, "regular", [], "Compare tiles"],
                ["load", this._load_tile, "upload", false, "regular", [], "Load tile"],
                ["unload", this._unload_all_tiles, "clean", false, "regular", [], "Unload all tiles"]],
            [["duplicate", this._tile_duplicate, "duplicate", false, "regular", [], "Duplicate"],
             ["rename", this.props.rename_func, "edit", false, "regular", [], "Rename"]],
            [["share", this.props.send_repository_func, "share", false, "regular", [], "Share to repository"]],
            [["delete", this._tile_delete, "trash", true, "regular", [], "Delete"]],
            [["refresh", this.props.refresh_func, "refresh", false, "regular", [], "Refresh"]],
            [["drawer", this.props.toggleErrorDrawer, "drawer-right", false, "regular", [], "Toggle Error Drawer"]]
        ];
     }

     render () {
        return <LibraryToolbar sendContextMenuItems={this.props.sendContextMenuItems}
                               context_menu_items={this.context_menu_items}
                               button_groups={this.button_groups}
                               popup_buttons={this.popup_buttons}
                               left_position={this.props.left_position}
                               sendRef={this.props.sendRef}
                               multi_select={this.props.multi_select} />
     }
}

TileToolbar.propTypes = specializedToolbarPropTypes;

class ListToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _list_duplicate(resource_name=null) {
        this.props.duplicate_func('/create_duplicate_list', resource_name)
    }

    _list_delete(resource_name=null) {
        this.props.delete_func("/delete_list", resource_name)
    }

    _add_list (file_list) {
        let the_data = new FormData();
        for (let f of file_list) {
            the_data.append('file', f);
        }
        let self = this;
        postAjaxUploadPromise("add_list", the_data)
            .then((data) => {
                    self.props.refresh_func()
            })
            .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error creating new list", content: data.message})});
    }

     get context_menu_items() {
        return [ {text: "edit", icon: "document-open", onClick: this.props.view_resource},
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this._list_duplicate},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this._list_delete, intent: "danger"}
        ]
     }

    get button_groups() {
        return [
            [["edit", this.props.view_func, "document-open", false, "regular", ["space", "return", "ctrl+o"], "View"]],
            [["duplicate", this._list_duplicate, "duplicate", false, "regular", [], "Duplicate"],
             ["rename", this.props.rename_func, "edit", false, "regular", [], "Rename"]],
            [["share", this.props.send_repository_func, "share", false, "regular", [], "Share to repository"]],
            [["delete", this._list_delete, "trash", true, "regular", [], "Delete"]],
            [["refresh", this.props.refresh_func, "refresh", false, "regular", [], "Refresh list"]]
        ];
     }

     get file_adders() {
         return[
             [null, this._add_list, "cloud-upload", true, "Import list"]
         ]
     }

     render () {
        return <LibraryToolbar sendContextMenuItems={this.props.sendContextMenuItems}
                               context_menu_items={this.context_menu_items}
                               button_groups={this.button_groups}
                               file_adders={this.file_adders}
                               popup_buttons={this.popup_buttons}
                               left_position={this.props.left_position}
                               sendRef={this.props.sendRef}
                               multi_select={this.props.multi_select} />
     }

}

ListToolbar.propTypes = specializedToolbarPropTypes;


class CodeToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _new_code (template_name) {
        $.getJSON(`${$SCRIPT_ROOT}/get_resource_names/code`, function (data) {
                showModalReact("New Code Resource", "New Code Resource Name", CreateNewCodeResource, "NewCodeResource", data["resource_names"])
            }
        );
        let self = this;

        function CreateNewCodeResource(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name
            };
            postAjaxPromise("/create_code", result_dict)
                .then((data) => {
                    self.props.refresh_func();
                    window.open($SCRIPT_ROOT + "/view_code/" + String(new_name))
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error creating new code resource", content: data.message})})
        }
    }

    _code_duplicate(resource_name=null) {
        this.props.duplicate_func('/create_duplicate_code', resource_name)
    }

    _code_delete(resource_name=null) {
        this.props.delete_func("/delete_code", resource_name)
    }


    get popup_buttons() {
        return [
            ["code", "new-text-box", [
                ["BasicCodeTemplate", ()=>{this._new_code("BasicCodeTemplate")}, "code"]]
            ]
        ]
    }

     get context_menu_items() {
        return [ {text: "edit", icon: "document-open", onClick: this.props.view_resource},
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this._code_duplicate},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this._code_delete, intent: "danger"}
        ]
     }

    get button_groups() {
        return [
            [["edit", this.props.view_func, "document-open", false, "regular", ["space", "return", "ctrl+o"], "View"]],
            [["duplicate", this._code_duplicate, "duplicate", false, "regular", [], "Duplicate"],
             ["rename", this.props.rename_func, "edit", false, "regular", [], "Rename"]],
            [["share", this.props.send_repository_func, "share", false, "regular", [], "Share to repository"]],
            [["delete", this._code_delete, "trash", true, "regular", [], "Delete"]],
            [["refresh", this.props.refresh_func, "refresh", false, "regular", [], "Refresh list"]]
        ];
     }

     render () {
        return <LibraryToolbar sendContextMenuItems={this.props.sendContextMenuItems}
                               context_menu_items={this.context_menu_items}
                               button_groups={this.button_groups}
                               popup_buttons={this.popup_buttons}
                               left_position={this.props.left_position}
                               sendRef={this.props.sendRef}
                               multi_select={this.props.multi_select} />
     }

}

CodeToolbar.propTypes = specializedToolbarPropTypes;


_library_home_main();