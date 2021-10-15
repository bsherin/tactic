// noinspection JSCheckFunctionSignatures

import React from "react";

import PropTypes from 'prop-types';


import {TacticMenubar} from "./menu_utilities.js";
import {doBinding} from "./utilities_react";
import {showModalReact} from "./modal_react";
import {doFlash} from "./toaster";
import {postAjaxPromise, postWithCallback} from "./communication_react";
import {showFileImportDialog} from "./import_dialog";

export {CollectionMenubar, ProjectMenubar, TileMenubar, ListMenubar, CodeMenubar, LibraryMenubar}

class LibraryMenubar extends React.Component {

    componentDidMount() {
        if (this.props.context_menu_items) {
            this.props.sendContextMenuItems(this.props.context_menu_items)
        }
    }

    render() {
        let outer_style = {
                display: "flex",
                flexDirection: "row",
                position: "relative",
                left: this.props.left_position,
                marginBottom: 10
        };
        let disabled_items = [];
        if (this.props.multi_select) {
            for (let menu_name in this.props.menu_specs) {
                for (let menu_item of this.props.menu_specs[menu_name]) {
                    if (!menu_item.multi_select){
                        disabled_items.push(menu_item.name_text)
                    }
                }
            }
        }
        return <TacticMenubar menu_specs={this.props.menu_specs}
                              dark_theme={this.props.dark_theme}
                              showRefresh={true}
                              showClose={false}
                              refreshTab={this.props.refreshTab}
                              closeTab={null}
                              disabled_items={disabled_items}
                              resource_name=""
                              showErrorDrawerButton={this.props.showErrorDrawerButton}
                              toggleErrorDrawer={this.props.toggleErrorDrawer}
                />
    }
}

LibraryMenubar.propTypes = {
    sendContextMenuItems: PropTypes.func,
    menu_specs: PropTypes.object,
    multi_select: PropTypes.bool,
    dark_theme: PropTypes.bool,
    refreshTab: PropTypes.func,
    showErrorDrawerButton: PropTypes.bool,
    toggleErrorDrawer: PropTypes.func
};

LibraryMenubar.defaultProps = {
    toggleErrorDrawer: null
};

let specializedMenubarPropTypes = {
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

class CollectionMenubar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.upload_name = null
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
                    else {
                        doFlash(data);
                    }
                });
            }, null, null, null, null)
        }
        else {
            $.getJSON(`${$SCRIPT_ROOT}get_resource_names/collection`, function (data) {
                showModalReact("Combine Collections", "Name for combined collection",
                    CreateCombinedCollection, "NewCollection", data["resource_names"])
            });
        }

        function CreateCombinedCollection(new_name) {
            postAjaxPromise("combine_to_new_collection",
                {"original_collections": self.props.list_of_selected, "new_name": new_name})
                .then((data) => {
                    self.props.refresh_func();
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

    _displayImportResults(data) {
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

    _showImport() {
        showFileImportDialog("collection", ".csv,.tsv,.txt,.xls,.xlsx,.html",
            [{"checkname": "import_as_freeform", "checktext": "Import as freeform"}], this._import_collection,
                 this.props.tsocket, this.props.dark_theme, true, true)
    }

    _import_collection(myDropZone, setCurrentUrl, new_name, check_results, csv_options=null) {
        let doc_type;
        if (check_results["import_as_freeform"]) {
            doc_type = "freeform"
        } else {
            doc_type = "table"
        }
        postAjaxPromise("create_empty_collection",
            {"collection_name": new_name,
                "doc_type": doc_type,
                "library_id": this.props.library_id,
                "csv_options": csv_options
            })
            .then((data)=> {
                let new_url = `append_documents_to_collection/${new_name}/${doc_type}/${this.props.library_id}`;
                myDropZone.options.url = new_url;
                setCurrentUrl(new_url);
                this.upload_name = new_name;
                myDropZone.processQueue();
            })
            .catch((data)=>{})
    }

    get menu_specs() {
        let self = this;
        let ms = {
            Open: [
                {name_text: "Open", icon_name: "document-open",
                    click_handler: ()=>{self.props.view_func()},  key_bindings: ["space", "return", "ctrl+o"]},
                {name_text: "Open In Separate Tab", icon_name: "document-share",
                    click_handler: ()=>{self.props.view_resource(self.props.selected_resource.name, null, true)}},
            ],
            Edit: [
                {name_text: "Rename Collection", icon_name: "edit", click_handler: ()=>{self.props.rename_func()}},
                {name_text: "Duplicate Collection", icon_name: "duplicate", click_handler: ()=>{this._collection_duplicate()}},
                {name_text: "Combine Collections", icon_name: "merge-columns", click_handler: this._combineCollections,
                    multi_select: true},
                {name_text: "Delete Collections", icon_name: "trash", click_handler: ()=>{this._collection_delete()},
                    multi_select: true},
            ],
            Transfer: [
                {name_text: "Import Data", icon_name: "cloud-upload", click_handler: this._showImport},
                {name_text: "Download Collection", icon_name: "download", click_handler: ()=>{this._downloadCollection()}},
                {name_text: "Share to repository", icon_name: "share", click_handler: this.props.send_repository_func}
            ]


        };
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms
    }

     get context_menu_items() {
        let menu_items = [ {text: "open", icon: "document-open", onClick: this.props.view_resource}];
        if (window.in_context) {
            menu_items.push({text: "open in separate tab", icon: "document-open", onClick: (resource_name)=>{
                this.props.view_resource(resource_name, null, true)
                }
            })
        }
        menu_items = menu_items.concat([
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this._collection_duplicate},
            {text: "__divider__"},
            {text: "download", icon: "cloud-download", onClick: this._downloadCollection},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this._collection_delete, intent: "danger"}
        ]);
        return menu_items
     }

     render () {
        return <LibraryMenubar sendContextMenuItems={this.props.sendContextMenuItems}
                               menu_specs={this.menu_specs}
                               context_menu_items={this.context_menu_items}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                               controlled={this.props.controlled}
                               am_selected={this.props.am_selected}
                               refreshTab={this.props.refresh_func}
                               closeTab={null}
                               resource_name=""
                               showErrorDrawerButton={true}
                               toggleErrorDrawer={this.props.toggleErrorDrawer}
        />
     }
}

CollectionMenubar.propTypes = specializedMenubarPropTypes;

class ProjectMenubar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _project_duplicate(resource_name=null) {
        this.props.duplicate_func('/duplicate_project', resource_name)
    }

    _new_notebook () {
        let self = this;
        if (window.in_context) {
            const the_view = `${$SCRIPT_ROOT}/new_notebook_in_context`;
            postAjaxPromise(the_view, {resource_name: ""})
                .then(self.props.handleCreateViewer)
                .catch(doFlash);
        }
        else {
            window.open(`${$SCRIPT_ROOT}/new_notebook`)
        }

    }

    _downloadJupyter () {
        let res_name = this.props.selected_resource.name;
        showModalReact("Download Notebook as Jupyter Notebook", "New File Name", function (new_name) {
            window.open(`${$SCRIPT_ROOT}/download_jupyter/` + res_name + "/" + new_name)
        }, res_name + ".ipynb")
    };

    _showImport() {
        showFileImportDialog("project", ".ipynb",
            [], this._import_jupyter,
                 this.props.tsocket, this.props.dark_theme, false, false)
    }

   _import_jupyter (myDropZone, setCurrentUrl) {
        let new_url = `import_jupyter/${this.props.library_id}`;
        myDropZone.options.url = new_url;
        setCurrentUrl(new_url);
        myDropZone.processQueue();
    };

    _project_delete(resource_name=null) {
        this.props.delete_func("/delete_project", resource_name)
    }

    get context_menu_items() {
        let menu_items = [ {text: "open", icon: "document-open", onClick: this.props.view_resource}];
        if (window.in_context) {
            menu_items.push({text: "open in separate tab", icon: "document-open", onClick: (resource_name)=>{
                this.props.view_resource(resource_name, null, true)
                }
            })
        }
        menu_items = menu_items.concat([
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this._project_duplicate},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this._project_delete, intent: "danger"}
        ]);
        return menu_items
     }

     get menu_specs() {
        let self = this;
        let ms = {
            Open: [
                {name_text: "Open", icon_name: "document-open",
                    click_handler: ()=>{self.props.view_func()},  key_bindings: ["space", "return", "ctrl+o"]},
                {name_text: "Open In Separate Tab", icon_name: "document-share",
                    click_handler: ()=>{self.props.view_resource(self.props.selected_resource.name, null, true)}},
                {name_text: "New Notebook", icon_name: "new-text-box",
                    click_handler: this._new_notebook,  key_bindings: ["ctrl+n"]},
            ],
            Edit: [
                {name_text: "Rename Project", icon_name: "edit", click_handler: ()=>{self.props.rename_func()}},
                {name_text: "Duplicate Project", icon_name: "duplicate", click_handler: ()=>{this._project_duplicate()}},
                {name_text: "Delete Projets", icon_name: "trash", click_handler: ()=>{this._project_delete()},
                    multi_select: true},
            ],
            Transfer: [
                {name_text: "Import Jupyter Notebook", icon_name: "cloud-upload", click_handler: this._showImport},
                {name_text: "Download As Jupyter Notebook", icon_name: "download", click_handler: this._downloadJupyter},
                {name_text: "Share To Repository", icon_name: "share", click_handler: this.props.send_repository_func}
            ]
        };
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms
    }

     render () {
        return <LibraryMenubar sendContextMenuItems={this.props.sendContextMenuItems}
                               context_menu_items={this.context_menu_items}
                               menu_specs={this.menu_specs}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                               controlled={this.props.controlled}
                               am_selected={this.props.am_selected}
                               refreshTab={this.props.refresh_func}
                               closeTab={null}
                               resource_name=""
                               showErrorDrawerButton={true}
                               toggleErrorDrawer={this.props.toggleErrorDrawer}
        />
     }

}

ProjectMenubar.propTypes = specializedMenubarPropTypes;

class TileMenubar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _tile_view() {
        this.props.view_func("/view_module/")
    }

    _view_named_tile(resource_name, in_new_tab=false) {
        this.props.view_resource(resource_name, "/view_module/", in_new_tab)
    }

    _creator_view_named_tile(resource_name, in_new_tab=false) {
        this.props.view_resource(resource_name, "/view_in_creator/", in_new_tab)
    }

    _creator_view() {
        this.props.view_func("/view_in_creator/")
    }

    _showHistoryViewer () {
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${this.props.selected_resource.name}`)
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
        postWithCallback("host", "load_tile_module_task",
            {"tile_module_name": resource_name, "user_id": window.user_id},
            (data)=>{
            if (!data.success) {
                self.props.addErrorDrawerEntry({title: "Error loading tile", content: data.message})
            }
            else {
                doFlash(data)
            }
        }, null, this.props.library_id)
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
                    self.props.view_resource(String(new_name), "/view_module/");
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
                    self.props.view_resource(String(new_name), "/view_in_creator/");
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error creating new tile", content: data.message})})
            }
    }


    get context_menu_items() {
        let menu_items = [ {text: "edit", icon: "edit", onClick: this._view_named_tile},
            {text: "edit in creator", icon: "annotation", onClick: this._creator_view_named_tile},
        ];

        if (window.in_context) {
            menu_items.push({text: "edit in separate tab", icon: "edit", onClick: (resource_name)=>{
                this._view_named_tile(resource_name, true)
                }
            });
            menu_items.push({text: "edit in creator in separate tab", icon: "annotation", onClick: (resource_name)=>{
                this._creator_view_named_tile(resource_name, true)
                }
            })
        }
        menu_items = menu_items.concat([
            {text: "__divider__"},
            {text: "load", icon: "upload", onClick: this._load_tile},
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this._tile_duplicate},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this._tile_delete, intent: "danger"}
        ]);
        return menu_items
     }
    get menu_specs() {
        let self = this;
        let ms = {
            New: [
                {name_text: "Standard Tile", icon_name: "code",
                    click_handler: ()=>{this._new_in_creator("BasicTileTemplate")},  key_bindings: ["ctrl+n"]},
                {name_text: "Matplotlib Tile", icon_name: "timeline-line-chart",
                    click_handler: ()=>{this._new_in_creator("MatplotlibTileTemplate")}},
                {name_text: "D3Tile Tile", icon_name: "timeline-area-chart",
                    click_handler: ()=>{this._new_in_creator("D3TileTemplate")}},
            ],
            Open: [
                {name_text: "Open In Creator", icon_name: "document-open",
                    click_handler: this._creator_view,  key_bindings: ["space", "return", "ctrl+o"]},
                {name_text: "Open In Viewer", icon_name: "document-open",
                    click_handler: this._tile_view},
                {name_text: "Open In Creator in New Tab", icon_name: "document-share",
                    click_handler: ()=>{self._creator_view_named_tile(self.props.selected_resource.name, true)}},
                {name_text: "Open in Viewer in New Tab", icon_name: "document-share",
                    click_handler: ()=>{self._view_named_tile(self.props.selected_resource.name, true)}},
            ],
            Edit: [
                {name_text: "Rename Tile", icon_name: "edit", click_handler: ()=>{self.props.rename_func()}},
                {name_text: "Duplicate Tile", icon_name: "duplicate", click_handler: ()=>{this._tile_duplicate()}},
                {name_text: "Delete Tiles", icon_name: "trash", click_handler: ()=>{this._tile_delete()},
                    multi_select: true},
            ],
            Load: [{name_text: "Load", icon_name: "upload", click_handler: ()=>{this._load_tile()}},
                {name_text: "Unload All Tiles", icon_name: "clean", click_handler: this._unload_all_tiles},

            ],
            Compare: [{name_text: "View History", icon_name: "history", click_handler: this._showHistoryViewer, tooltip: "Show history viewer"},
                      {name_text: "Compare to Other Modules", icon_name: "comparison", click_handler: this._compare_tiles,
                          multi_select: true, tooltip: "Compare to another tile"}],
            Transfer: [
                {name_text: "Share To Repository", icon_name: "share", click_handler: this.props.send_repository_func}
            ]
        };
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms
    }

     render () {
        return <LibraryMenubar sendContextMenuItems={this.props.sendContextMenuItems}
                               context_menu_items={this.context_menu_items}
                               menu_specs={this.menu_specs}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                               controlled={this.props.controlled}
                               am_selected={this.props.am_selected}
                               tsocket={this.props.tsocket}
                               refreshTab={this.props.refresh_func}
                               closeTab={null}
                               resource_name=""
                               showErrorDrawerButton={true}
                               toggleErrorDrawer={this.props.toggleErrorDrawer}
        />
     }
}

TileMenubar.propTypes = specializedMenubarPropTypes;

class ListMenubar extends React.Component {
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

    _add_list (myDropZone, setCurrentUrl) {
        let new_url = `import_list/${this.props.library_id}`;
        myDropZone.options.url = new_url;
        setCurrentUrl(new_url);
        myDropZone.processQueue();
    }

     get context_menu_items() {
        let menu_items = [ {text: "edit", icon: "document-open", onClick: this.props.view_resource}];
        if (window.in_context) {
            menu_items.push({text: "open in separate tab", icon: "document-open", onClick: (resource_name)=>{
                this.props.view_resource(resource_name, null, true)
                }
            })
        }
        menu_items = menu_items.concat([
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this._list_duplicate},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this._list_delete, intent: "danger"}
        ]);
        return menu_items
     }

     _showImport() {
        showFileImportDialog("list", "text/*",
            [], this._add_list,
                 this.props.tsocket, this.props.dark_theme, false, false)
    }

     get menu_specs() {
        let self = this;
        let ms = {
            Open: [
                {name_text: "Open", icon_name: "document-open",
                    click_handler: ()=>{self.props.view_func()},  key_bindings: ["space", "return", "ctrl+o"]},
                {name_text: "Open In Separate Tab", icon_name: "document-share",
                    click_handler: ()=>{self.props.view_resource(self.props.selected_resource.name, null, true)}},
            ],
            Edit: [
                {name_text: "Rename List", icon_name: "edit", click_handler: ()=>{self.props.rename_func()}},
                {name_text: "Duplicate List", icon_name: "duplicate", click_handler: ()=>{this._list_duplicate()}},
                {name_text: "Delete Lists", icon_name: "trash", click_handler: ()=>{this._list_delete()},
                    multi_select: true},
            ],
            Transfer: [
                {name_text: "Import List", icon_name: "cloud-upload", click_handler: this._showImport},
                {name_text: "Share to repository", icon_name: "share", click_handler: this.props.send_repository_func}
            ]


        };
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms
    }

     render () {
        return <LibraryMenubar sendContextMenuItems={this.props.sendContextMenuItems}
                               context_menu_items={this.context_menu_items}
                               menu_specs={this.menu_specs}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                               controlled={this.props.controlled}
                               am_selected={this.props.am_selected}
                               tsocket={this.props.tsocket}
                               refreshTab={this.props.refresh_func}
                               closeTab={null}
                               resource_name=""
                               showErrorDrawerButton={true}
                               toggleErrorDrawer={this.props.toggleErrorDrawer}
        />
     }

}

ListMenubar.propTypes = specializedMenubarPropTypes;


class CodeMenubar extends React.Component {
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
                    self.props.view_resource(String(new_name), "/view_code/")
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
        let menu_items = [ {text: "edit", icon: "document-open", onClick: this.props.view_resource}];
        if (window.in_context) {
            menu_items.push({text: "open in separate tab", icon: "document-open", onClick: (resource_name)=>{
                this.props.view_resource(resource_name, null, true)
                }
            })
        }
        menu_items = menu_items.concat([
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this._code_duplicate},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this._code_delete, intent: "danger"}
        ]);
        return menu_items
     }


     get menu_specs() {
        let self = this;
        let ms = {
            Open: [
                {name_text: "Open", icon_name: "document-open",
                    click_handler: ()=>{self.props.view_func()},  key_bindings: ["space", "return", "ctrl+o"]},
                {name_text: "Open In Separate Tab", icon_name: "document-share",
                    click_handler: ()=>{self.props.view_resource(self.props.selected_resource.name, null, true)}},
            ],
            Edit: [
                {name_text: "Rename Code", icon_name: "edit", click_handler: ()=>{self.props.rename_func()}},
                {name_text: "Duplicate Code", icon_name: "duplicate", click_handler: ()=>{this._code_duplicate()}},
                {name_text: "Delete Code", icon_name: "trash", click_handler: ()=>{this._code_delete()},
                    multi_select: true},
            ],
            Transfer: [
                {name_text: "Share to repository", icon_name: "share", click_handler: this.props.send_repository_func}
            ]


        };
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms
    }

     render () {
        return <LibraryMenubar sendContextMenuItems={this.props.sendContextMenuItems}
                               context_menu_items={this.context_menu_items}
                               menu_specs={this.menu_specs}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                               controlled={this.props.controlled}
                               am_selected={this.props.am_selected}
                               tsocket={this.props.tsocket}
                               refreshTab={this.props.refresh_func}
                               closeTab={null}
                               resource_name=""
                               showErrorDrawerButton={true}
                               toggleErrorDrawer={this.props.toggleErrorDrawer}
        />
     }

}

CodeMenubar.propTypes = specializedMenubarPropTypes;