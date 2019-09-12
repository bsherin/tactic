import {showModalReact} from "./modal_react.js";
import {Toolbar} from "./react_toolbar.js"
import {TacticSocket} from "./tactic_socket.js"

import {render_navbar} from "./base_module.js";

import {handleCallback, postAjaxPromise, postAjaxUploadPromise, postWithCallbackNoMain} from "./communication_react.js"

var Rbs = window.ReactBootstrap;

import {LibraryPane} from "./library_pane.js"
import {LoadedTileList} from "./library_widgets.js";

const MARGIN_SIZE = 17;

let tsocket;

function _library_home_main () {
    render_navbar();
    tsocket = new LibraryTacticSocket("library", 5000);
    let domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(<LibraryHomeApp/>, domContainer)
}



class LibraryTacticSocket extends TacticSocket {

    initialize_socket_stuff() {

        this.socket.emit('join', {"user_id":  window.user_id, "library_id":  window.library_id});

        this.socket.on("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));

        this.socket.on('handle-callback', handleCallback);
        this.socket.on('stop-spinner', stopSpinner);
        this.socket.on('start-spinner', startSpinner);
        this.socket.on('show-status-msg', statusMessage);
        this.socket.on("clear-status-msg", clearStatusMessage);
        this.socket.on('close-user-windows', (data) => {
            if (!(data["originator"] == window.library_id)) {
                window.close()
            }
        });
        this.socket.on('doflash', doFlash);
    }
}


class LibraryHomeApp extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            "usable_width": window.innerWidth - 2 * MARGIN_SIZE - 30,
            "usable_height": window.innerHeight - 50
        };
        doBinding(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this._update_window_dimensions);
        this.setState({"mounted": true});
        this._update_window_dimensions();
        stopSpinner()
    }

    _update_window_dimensions() {
        this.setState({
            "usable_width": window.innerWidth - 2 * MARGIN_SIZE - 30,
            "usable_height": window.innerHeight - 50
        });
    }

    render () {
        let nav_items = [["collections", "file-alt"], ["projects", "project-diagram"],
            ["tiles", "window"], ["lists", "list-alt"], ["code", "file-code"]].map((data)=>(
            <Rbs.Nav.Item key={data[0]}>
                <Rbs.Nav.Link eventKey={data[0] + "-pane"}>
                    <span className={"far um-nav-icon fa-" + data[1]}></span>
                    <span className="um-nav-text">{data[0]}</span>
                </Rbs.Nav.Link>
            </Rbs.Nav.Item>
        ));
        let tile_widget = <LoadedTileList tsocket={tsocket}/>;
        return (
            <React.Fragment>
                <Rbs.Tab.Container id="the_container" defaultActiveKey="collections-pane">
                    <div className="d-flex flex-row">
                        <div className="d-flex flex-column justify-content-between left-vertical-nav"
                             style={{"marginTop": 100}}>
                            <Rbs.Nav variant="pills" className="flex-column mr-2">
                                {nav_items}
                            </Rbs.Nav>
                        </div>
                        <div className="d-flex flex-column">
                            <Rbs.Tab.Content>
                                <Rbs.Tab.Pane eventKey="collections-pane" onEnter={this._update_window_dimensions}>
                                    <LibraryPane usable_height={this.state.usable_height}
                                                 usable_width={this.state.usable_width}
                                                 res_type="collection"
                                                 allow_search_inside={false}
                                                 allow_search_metadata={false}
                                                 ToolbarClass={CollectionToolbar}
                                                 tsocket={tsocket}
                                />
                                </Rbs.Tab.Pane>
                                <Rbs.Tab.Pane eventKey="projects-pane" onEnter={this._update_window_dimensions}>
                                    <LibraryPane usable_height={this.state.usable_height}
                                                 usable_width={this.state.usable_width}
                                                 res_type="project"
                                                 allow_search_inside={false}
                                                 allow_search_metadata={true}
                                                 search_metadata_view = "search_project_metadata"
                                                 ToolbarClass={ProjectToolbar}
                                                 tsocket={tsocket}
                                    />
                                </Rbs.Tab.Pane>
                                <Rbs.Tab.Pane eventKey="tiles-pane" onEnter={this._update_window_dimensions}>
                                    <LibraryPane usable_height={this.state.usable_height}
                                                 usable_width={this.state.usable_width}
                                                 res_type="tile"
                                                 allow_search_inside={true}
                                                 allow_search_metadata={true}
                                                 search_inside_view="search_inside_tiles"
                                                 search_metadata_view = "search_tile_metadata"
                                                 ToolbarClass={TileToolbar}
                                                 tsocket={tsocket}
                                                 aux_pane={tile_widget}
                                    />
                                </Rbs.Tab.Pane>
                                <Rbs.Tab.Pane eventKey="lists-pane" onEnter={this._update_window_dimensions}>
                                    <LibraryPane usable_height={this.state.usable_height}
                                                 usable_width={this.state.usable_width}
                                                 res_type="list"
                                                 allow_search_inside={true}
                                                 allow_search_metadata={true}
                                                 search_inside_view="search_inside_lists"
                                                 search_metadata_view = "search_list_metadata"
                                                 ToolbarClass={ListToolbar}
                                                 tsocket={tsocket}
                                    />
                                </Rbs.Tab.Pane>
                                <Rbs.Tab.Pane eventKey="code-pane" onEnter={this._update_window_dimensions}>
                                    <LibraryPane usable_height={this.state.usable_height}
                                                 usable_width={this.state.usable_width}
                                                 res_type="code"
                                                 allow_search_inside={true}
                                                 allow_search_metadata={true}
                                                 search_inside_view="search_inside_code"
                                                 search_metadata_view = "search_code_metadata"
                                                 ToolbarClass={CodeToolbar}
                                                 tsocket={tsocket}
                                    />
                                </Rbs.Tab.Pane>
                            </Rbs.Tab.Content>
                        </div>
                    </div>
                </Rbs.Tab.Container>
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
                 opt_list.push({opt_name: opt[0], opt_func: opt[1]})
             }
             new_button["option_list"] = opt_list;
             popup_buttons.push(new_button);
         }
         return popup_buttons
    }

    render() {
        let popup_buttons = this.prepare_popup_buttons();
       return <Toolbar button_groups={this.prepare_button_groups()}
                       file_adders={this.prepare_file_adders()}
                       popup_buttons={popup_buttons}
       />
    }
}

LibraryToolbar.propTypes = {
    button_groups: PropTypes.array,
    file_adders: PropTypes.array,
    popup_buttons: PropTypes.array,
    multi_select: PropTypes.bool,
};

LibraryToolbar.defaultProps = {
    file_adders: null,
    popup_buttons: null
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
                startSpinner();
                const target = `${$SCRIPT_ROOT}/combine_collections/${res_names[0]}/${other_name}`;
                $.post(target, doFlashStopSpinner);
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
                    self.props.animation_phase(() => {self.props.add_new_row(data.new_row)})
                })
                .catch(doFlash)
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
            message = "No decoding errors were encounters"
        }
        else {
            message = "<b>Decoding errors were enountered</b>";
            for (let filename in data.file_decoding_errors) {
                number_of_errors = String(data.file_decoding_errors[filename].length);
                message = message + `<br>${filename}: ${number_of_errors} errors`;
            }
        }
        alertify.alert(title, message).set({'pinnable': false, 'modal':false})
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
            startSpinner();
            let url_base;
            if (check_results["import_as_freeform"]) {
                url_base = "import_as_freeform"
            }
            else {
                url_base = "import_as_table"
            }

            postAjaxUploadPromise(`${url_base}/${new_name}/${window.library_id}`, the_data)
                .then((data) => {
                        clearStatusMessage();
                        self.displayImportResults(data);
                        self.props.animation_phase(() => {self.props.add_new_row(data.new_row)});
                        stopSpinner();
                })
                .catch(doFlash);
        }
    }

    get button_groups() {
        return [
            [["open", this.props.view_func, "book-open", false]],
            [["duplicate", this._collection_duplicate, "copy", false],
             ["rename",  this.props.rename_func, "edit", false],
             ["combine", this._combineCollections, "plus-square", true]],
            [["download", this._downloadCollection, "cloud-download", false],
             ["share", this.props.send_repository_func, "share", false]],
            [["delete", this._collection_delete, "trash", true]],
            [["refresh", this.props.refresh_func, "sync-alt", false]]
        ];
     }

     get file_adders() {
         return[
             ["import", this._import_collection, "cloud-upload", true]
         ]
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               file_adders={this.file_adders}
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
            startSpinner();
            postAjaxUploadPromise(`import_as_jupyter/${new_name}/${library_id}`, the_data)
                .then((data) => {
                        clearStatusMessage();
                        self.props.animation_phase(() => {self.props.add_new_row(data.new_row)});
                        stopSpinner();
                })
                .catch(doFlash);
        }
    };


    _project_delete() {
        this.props.delete_func("/delete_project")
    }

    get button_groups() {
        return [
            [["notebook", this.new_notebook,"book", false],
                ["open", this.props.view_func, "book-open", false]],
            [["duplicate", this._project_duplicate, "copy", false],
             ["rename", this.props.rename_func, "edit", false]],
            [["toJupyter", this._downloadJupyter, "cloud-download", false],
             ["share", this.props.send_repository_func, "share", false]],
            [["delete", this._project_delete, "trash", true]],
            [["refresh", this.props.refresh_func, "sync-alt", false]]
        ];
     }

    get file_adders() {
         return[
             ["import", this._import_jupyter, "cloud-upload", false]
         ]
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               file_adders={this.file_adders}
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
        postWithCallbackNoMain("host", "load_tile_module_task",
            {"tile_module_name": this.props.list_of_selected[0], "user_id": window.user_id}, doFlash)
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
                    self.props.animation_phase(() => {self.props.add_new_row(data.new_row)});
                    window.open($SCRIPT_ROOT + "/view_module/" + String(new_name))
                })
                .catch(doFlash)
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
                    self.props.animation_phase(() => {self.props.add_new_row(data.new_row)});
                    window.open($SCRIPT_ROOT + "/view_in_creator/" + String(new_name))
                })
                .catch(doFlash)
            }
    }

    get popup_buttons() {
        return [
            ["new", "plus-circle", [
                ["BasicTileTemplate", ()=>{this._new_tile("BasicTileTemplate")}],
                ["ExpandedTileTemplate", ()=>{this._new_tile("ExpandedTileTemplate")}],
                ["MatplotlibTileTemplate", ()=>{this._new_tile("MatplotlibTileTemplate")}]]
            ],
            ["creator", "plus-circle", [
                ["StandardTile", ()=>{this._new_in_creator("BasicTileTemplate")}],
                ["MatplotlibTile", ()=>{this._new_in_creator("MatplotlibTileTemplate")}],
                ["D3Tile", ()=>{this._new_in_creator("D3TileTemplate")}]]
            ]
        ]
    }

    get button_groups() {
        return [
            [["edit", this._tile_view, "pencil", false],
                ["creator", this._creator_view, "pencil-alt", false],
                ["compare", this._compare_tiles, "code-branch", true],
                ["load", this._load_tile, "arrow-from-bottom", false],
                ["unload", this._unload_all_tiles, "ban", false]],
            [["duplicate", this._tile_duplicate, "copy", false],
             ["rename", this.props.rename_func, "edit", false]],
            [["share", this.props.send_repository_func, "share", false]],
            [["delete", this._tile_delete, "trash", true]],
            [["refresh", this.props.refresh_func, "sync-alt", false]]
        ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               popup_buttons={this.popup_buttons}
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
                    self.props.animation_phase(() => {self.props.add_new_row(data.new_row)})
            })
            .catch(doFlash);
    }

    get button_groups() {
        return [
            [["edit", this.props.view_func, "pencil", false]],
            [["duplicate", this._list_duplicate, "copy", false],
             ["rename", this.props.rename_func, "edit", false]],
            [["share", this.props.send_repository_func, "share", false]],
            [["delete", this._list_delete, "trash", true]],
            [["refresh", this.props.refresh_func, "sync-alt", false]]
        ];
     }


     get file_adders() {
         return[
             ["import", this._add_list, "cloud-upload", true]
         ]
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               popup_buttons={this.popup_buttons}
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
                    self.props.animation_phase(() => {self.props.add_new_row(data.new_row)});
                    window.open($SCRIPT_ROOT + "/view_code/" + String(new_name))
                })
                .catch(doFlash)
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
            ["new", "plus-circle", [
                ["BasicCodeTemplate", ()=>{this._new_code("BasicCodeTemplate")}]]
            ]
        ]
    }

    get button_groups() {
        return [
            [["edit", this.props.view_func, "pencil", false]],
            [["duplicate", this._code_duplicate, "copy", false],
             ["rename", this.props.rename_func, "edit", false]],
            [["share", this.props.send_repository_func, "share", false]],
            [["delete", this._code_delete, "trash", true]],
            [["refresh", this.props.refresh_func, "sync-alt", false]]
        ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               popup_buttons={this.popup_buttons}
                               multi_select={this.props.multi_select} />
     }

}

CodeToolbar.propTypes = specializedToolbarPropTypes;


_library_home_main();