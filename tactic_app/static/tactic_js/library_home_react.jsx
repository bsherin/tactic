
import {showModalReact} from "./modal_react.js";
import {Toolbar} from "./blueprint_toolbar.js"
import {TacticSocket} from "./tactic_socket.js"
import {render_navbar} from "./blueprint_navbar.js";
import {handleCallback, postAjaxPromise, postAjaxUploadPromise, postWithCallbackNoMain} from "./communication_react.js"
import {doFlash} from "./toaster.js"
import {ViewerContext} from "./resource_viewer_context.js";

var Bp = blueprint;
let Bpt = bptable;

import {LibraryPane} from "./library_pane.js"
import {LoadedTileList} from "./library_widgets.js";
import {SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT, getUsableDimensions} from "./sizing_tools.js";
import {withStatus} from "./toaster.js";
import {withErrorDrawer} from "./error_drawer.js";
import {KeyTrap} from "./key_trap.js";

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
                search_from_field: false,
                search_from_tag: false,
                sorting_column: "updated",
                sorting_field: "updated_for_sort",
                sorting_direction: "descending",
                multi_select: false,
                list_of_selected: [],
                search_field_value: "",
                search_inside_checked: false,
                search_metadata_checked: false,
                selectedRegions: [Bpt.Regions.row(0)]
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
                                         search_metadata_view = "search_project_metadata"
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
                                     search_inside_view="search_inside_tiles"
                                     search_metadata_view = "search_tile_metadata"
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
                                     search_inside_view="search_inside_lists"
                                     search_metadata_view = "search_list_metadata"
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
                                search_inside_view="search_inside_code"
                                search_metadata_view = "search_code_metadata"
                                ToolbarClass={CodeToolbar}
                               {...this.props.errorDrawerFuncs}
                                updatePaneState={this._updatePaneState}
                                {...this.state.pane_states["code"]}
                                tsocket={tsocket}/>
        );
        let outer_style = {width: this.state.usable_width,
            height: this.state.usable_height,
            paddingLeft: 0
        };
        let key_bindings = [[["tab"], this._goToNextPane], [["shift+tab"], this._goToPreviousPane]];
        return (
            <ViewerContext.Provider value={{readOnly: false}}>
                <div className="pane-holder" ref={this.top_ref} style={outer_style}>
                    <Bp.Tabs id="the_container" style={{marginTop: 100}}
                             selectedTabId={this.state.selected_tab_id}
                             renderActiveTabPanelOnly={true}
                             vertical={true} large={true} onChange={this._handleTabChange}>
                        <Bp.Tab id="collections-pane" panel={collection_pane}>
                            <Bp.Tooltip content="Collections" position={Bp.Position.RIGHT}>
                                <Bp.Icon icon="database" iconSize={20} tabIndex={-1} color={this.getIconColor("collections-pane")}/>
                            </Bp.Tooltip>
                        </Bp.Tab>
                        <Bp.Tab id="projects-pane" panel={projects_pane}>
                            <Bp.Tooltip content="Projects" position={Bp.Position.RIGHT}>
                                <Bp.Icon icon="projects" iconSize={20} tabIndex={-1} color={this.getIconColor("projects-pane")}/>
                            </Bp.Tooltip>
                        </Bp.Tab>
                        <Bp.Tab id="tiles-pane" panel={tiles_pane}>
                            <Bp.Tooltip content="Tiles" position={Bp.Position.RIGHT}>
                                <Bp.Icon icon="application" iconSize={20} tabIndex={-1} color={this.getIconColor("tiles-pane")}/>
                            </Bp.Tooltip>
                        </Bp.Tab>
                        <Bp.Tab id="lists-pane" panel={lists_pane}>
                            <Bp.Tooltip content="Lists" position={Bp.Position.RIGHT}>
                                <Bp.Icon icon="numbered-list" iconSize={20} tabIndex={-1} color={this.getIconColor("lists-pane")}/>
                            </Bp.Tooltip>
                        </Bp.Tab>
                        <Bp.Tab id="code-pane" panel={code_pane}>
                            <Bp.Tooltip content="Code" position={Bp.Position.RIGHT}>
                                <Bp.Icon icon="code" iconSize={20} tabIndex={-1} color={this.getIconColor("code-pane")}/>
                            </Bp.Tooltip>
                        </Bp.Tab>
                    </Bp.Tabs>
                </div>
                <KeyTrap global={true} bindings={key_bindings} />
            </ViewerContext.Provider>
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
    view_func: PropTypes.func,
    duplicate_func: PropTypes.func,
    delete_func: PropTypes.func,
    rename_func: PropTypes.func,
    refresh_func: PropTypes.func,
    send_repository_func: PropTypes.func,
    selected_resource: PropTypes.object,
    list_of_selected: PropTypes.array,
    muti_select: PropTypes.bool,
    add_new_row: PropTypes.func,
    animation_phase: PropTypes.func
};

class CollectionToolbar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    _collection_duplicate() {
        this.props.duplicate_func("/duplicate_collection")
    }

    _collection_delete() {
        this.props.delete_func("/delete_collection")
    }

    _combineCollections () {
        var res_names;
        let self = this;
        if (!this.props.multi_select) {
            showModalReact("Name of collection to combine with " + this.props.selected_resource.name, "collection Name", function (other_name) {
                self.props.startSpinner(true);
                const target = `${$SCRIPT_ROOT}/combine_collections/${res_names[0]}/${other_name}`;
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
                    self.props.add_new_row(data.new_row)
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error combining collections", content: data.message})})
        }
    }

    _downloadCollection () {
        let res_name = this.props.selected_resource.name;
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
                        self.props.add_new_row(data.new_row);
                        self.props.stopSpinner();
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error importing documents", content: data.message})});
        }
    }

    get button_groups() {
        return [
            [["open", this.props.view_func, "document-open", false, "primary"]],
            [["duplicate", this._collection_duplicate, "duplicate", false, "success"],
             ["rename",  this.props.rename_func, "edit", false, "warning"],
             ["combine", this._combineCollections, "merge-columns", true, "success"]],
            [["download", this._downloadCollection, "cloud-download", false, "regular"],
             ["share", this.props.send_repository_func, "share", false, "regular"]],
            [["delete", this._collection_delete, "trash", true, "danger"]],
            [["refresh", this.props.refresh_func, "refresh", false]]
        ];
     }

     get file_adders() {
         return[
             [null, this._import_collection, "cloud-upload", true]
         ]
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
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

    _project_duplicate() {
        this.props.duplicate_func('/duplicate_project')
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
                        self.props.add_new_row(data.new_row);
                        self.props.stopSpinner();
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error importing jupyter notebook", content: data.message})});
        }
    };


    _project_delete() {
        this.props.delete_func("/delete_project")
    }

    get button_groups() {
        return [
            [["notebook", this.new_notebook,"book", false],
                ["open", this.props.view_func, "document-open", false]],
            [["duplicate", this._project_duplicate, "duplicate", false],
             ["rename", this.props.rename_func, "edit", false]],
            [["toJupyter", this._downloadJupyter, "cloud-download", false],
             ["share", this.props.send_repository_func, "share", false]],
            [["delete", this._project_delete, "trash", true]],
            [["refresh", this.props.refresh_func, "refresh", false]]
        ];
     }

    get file_adders() {
         return[
             [null, this._import_jupyter, "cloud-upload", false]
         ]
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
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

    _tile_view(e) {
        this.props.view_func(e, "/view_module/")
    }

    _creator_view(e) {
        this.props.view_func(e, "/view_in_creator/")
    }

    _tile_duplicate() {
        this.props.duplicate_func('/create_duplicate_tile')
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
    
    _load_tile() {
        let self = this;
        postWithCallbackNoMain("host", "load_tile_module_task",
            {"tile_module_name": this.props.list_of_selected[0], "user_id": window.user_id},
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
    
    _tile_delete() {
        this.props.delete_func("/delete_tile_module")
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
                    self.props.add_new_row(data.new_row);
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
                    self.props.add_new_row(data.new_row);
                    window.open($SCRIPT_ROOT + "/view_in_creator/" + String(new_name))
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error creating new tile", content: data.message})})
            }
    }

    get popup_buttons() {
        return [
            ["new", "new-text-box", [
                ["BasicTileTemplate", ()=>{this._new_tile("BasicTileTemplate")}, "code"],
                ["ExpandedTileTemplate", ()=>{this._new_tile("ExpandedTileTemplate")}, "code"],
                ["MatplotlibTileTemplate", ()=>{this._new_tile("MatplotlibTileTemplate")}, "timeline-line-chart"]]
            ],
            ["creator", "new-text-box", [
                ["StandardTile", ()=>{this._new_in_creator("BasicTileTemplate")}, "code"],
                ["MatplotlibTile", ()=>{this._new_in_creator("MatplotlibTileTemplate")}, "timeline-line-chart"],
                ["D3Tile", ()=>{this._new_in_creator("D3TileTemplate")}, "timeline-area-chart"]]
            ]
        ]
    }

    get button_groups() {
        return [
            [["edit", this._tile_view, "edit", false],
                ["creator", this._creator_view, "annotation", false],
                ["compare", this._compare_tiles, "comparison", true],
                ["load", this._load_tile, "upload", false],
                ["unload", this._unload_all_tiles, "clean", false]],
            [["duplicate", this._tile_duplicate, "duplicate", false],
             ["rename", this.props.rename_func, "edit", false]],
            [["share", this.props.send_repository_func, "share", false]],
            [["delete", this._tile_delete, "trash", true]],
            [["refresh", this.props.refresh_func, "refresh", false]],
            [["drawer", this.props.toggleErrorDrawer, "console", false]]
        ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
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

    _list_duplicate() {
        this.props.duplicate_func('/create_duplicate_list')
    }

    _list_delete() {
        this.props.delete_func("/delete_list")
    }

    _add_list (file_list) {
        let the_data = new FormData();
        for (let f of file_list) {
            the_data.append('file', f);
        }
        let self = this;
        postAjaxUploadPromise("add_list", the_data)
            .then((data) => {
                    self.props.add_new_row(data.new_row)
            })
            .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error creating new list", content: data.message})});
    }

    get button_groups() {
        return [
            [["edit", this.props.view_func, "document-open", false]],
            [["duplicate", this._list_duplicate, "duplicate", false],
             ["rename", this.props.rename_func, "edit", false]],
            [["share", this.props.send_repository_func, "share", false]],
            [["delete", this._list_delete, "trash", true]],
            [["refresh", this.props.refresh_func, "refresh", false]]
        ];
     }


     get file_adders() {
         return[
             [null, this._add_list, "cloud-upload", true]
         ]
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
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
                    self.props.add_new_row(data.new_row);
                    window.open($SCRIPT_ROOT + "/view_code/" + String(new_name))
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error creating new code resource", content: data.message})})
        }
    }

    _code_duplicate() {
        this.props.duplicate_func('/create_duplicate_code')
    }

    _code_delete() {
        this.props.delete_func("/delete_code")
    }


    get popup_buttons() {
        return [
            ["new", "new-text-box", [
                ["BasicCodeTemplate", ()=>{this._new_code("BasicCodeTemplate")}, "code"]]
            ]
        ]
    }

    get button_groups() {
        return [
            [["edit", this.props.view_func, "document-open", false]],
            [["duplicate", this._code_duplicate, "duplicate", false],
             ["rename", this.props.rename_func, "edit", false]],
            [["share", this.props.send_repository_func, "share", false]],
            [["delete", this._code_delete, "trash", true]],
            [["refresh", this.props.refresh_func, "refresh", false]]
        ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               popup_buttons={this.popup_buttons}
                               left_position={this.props.left_position}
                               sendRef={this.props.sendRef}
                               multi_select={this.props.multi_select} />
     }

}

CodeToolbar.propTypes = specializedToolbarPropTypes;


_library_home_main();