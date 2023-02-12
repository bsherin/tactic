// noinspection JSCheckFunctionSignatures

import React from "react";
import PropTypes from 'prop-types';

import {TacticMenubar} from "./menu_utilities.js";
import {doBinding} from "./utilities_react";
import {icon_dict} from "./blueprint_mdata_fields";

export {AllMenubar, CollectionMenubar, ProjectMenubar, TileMenubar, ListMenubar, CodeMenubar, LibraryMenubar}

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
        for (let menu_name in this.props.menu_specs) {
            if (this.props.multi_select) {
                for (let menu_item of this.props.menu_specs[menu_name]) {
                    if (!menu_item.multi_select) {
                        disabled_items.push(menu_item.name_text)
                    }
                    else if (menu_item.res_type && this.props.selected_type == "multi") {
                        disabled_items.push(menu_item.name_text)
                    }
                }
            }
            else {
                for (let menu_item of this.props.menu_specs[menu_name]) {
                    if (menu_item.res_type && menu_item.res_type != this.props.selected_type) {
                        disabled_items.push(menu_item.name_text)
                    }
                    else if (menu_item.reqs) {
                        for (let param in menu_item.reqs) {
                            if (!(param in this.props.selected_resource) ||
                                !(this.props.selected_resource[param] == menu_item.reqs[param])) {
                                disabled_items.push(menu_item.name_text)
                            }
                        }
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
                              resource_icon={this.props.resource_icon}
                              showErrorDrawerButton={this.props.showErrorDrawerButton}
                              toggleErrorDrawer={this.props.toggleErrorDrawer}
                />
    }
}

LibraryMenubar.propTypes = {
    sendContextMenuItems: PropTypes.func,
    menu_specs: PropTypes.object,
    multi_select: PropTypes.bool,
    selected_type: PropTypes.string,
    dark_theme: PropTypes.bool,
    refreshTab: PropTypes.func,
    showErrorDrawerButton: PropTypes.bool,
    toggleErrorDrawer: PropTypes.func,
    resource_icon: PropTypes.string
};

LibraryMenubar.defaultProps = {
    toggleErrorDrawer: null,
    resource_icon: null
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

class AllMenubar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

     get context_menu_items() {
        let menu_items = [ {text: "open", icon: "document-open", onClick: this.props.view_resource}];
        if (window.in_context) {
            menu_items.push({text: "open in separate tab", icon: "document-open", onClick: (resource)=>{
                this.props.view_resource(resource, null, true)
                }
            })
        }
        menu_items = menu_items.concat([
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this.props.duplicate_func},
            {text: "__divider__"},
            {text: "load", icon: "upload", onClick: this.props.load_tile, res_type: "tile"},
            {text: "unload", icon: "undo", onClick: this.props.unload_module, res_type: "tile"},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this.props.delete_func, intent: "danger"}
        ]);
        return menu_items
     }

     get menu_specs() {
        let self = this;
        let ms = {
            New: [
                {name_text: "New Notebook", icon_name: "new-text-box",
                    click_handler: this.props.new_notebook},
                {name_text: "divider1", icon_name: null, click_handler: "divider"},
                {name_text: "Standard Tile", icon_name: "code",
                    click_handler: ()=>{this.props.new_in_creator("BasicTileTemplate")}},
                {name_text: "Matplotlib Tile", icon_name: "timeline-line-chart",
                    click_handler: ()=>{this.props.new_in_creator("MatplotlibTileTemplate")}},
                {name_text: "D3Tile Tile", icon_name: "timeline-area-chart",
                    click_handler: ()=>{this.props.new_in_creator("D3TileTemplate")}},
                {name_text: "divider2", icon_name: null, click_handler: "divider"},
                {name_text: "New List", icon_name: "new-text-box",
                    click_handler: ()=>{this.props.new_list("nltk-english")}},
                {name_text: "New Code", icon_name: "new-text-box",
                    click_handler: ()=>{this.props.new_code("BasicCodeTemplate")}},
            ],
            Open: [
                {name_text: "Open", icon_name: "document-open",
                    click_handler: ()=>{self.props.view_func()}, key_bindings: ["ctrl+o", "return"]},
                {name_text: "Open In Separate Tab", icon_name: "document-share",
                    click_handler: ()=>{self.props.view_resource(self.props.selected_resource, null, true)}},
                {name_text: "divider1", icon_name: null, click_handler: "divider"},
                {name_text: "Open In Creator", icon_name: "document-open",
                    click_handler: this.props.creator_view,  res_type: "tile"},
                {name_text: "Edit Raw Tile", icon_name: "document-open",
                    click_handler: this.props.tile_view, res_type: "tile"},
            ],
            Edit: [
                {name_text: "Rename Resource", icon_name: "edit", click_handler: ()=>{self.props.rename_func()}},
                {name_text: "Duplicate Resource", icon_name: "duplicate", click_handler: ()=>{self.props.duplicate_func()}},
                {name_text: "Delete Resources", icon_name: "trash", click_handler: ()=>{self.props.delete_func()},
                    multi_select: true},
                {name_text: "divider1", icon_name: null, click_handler: "divider"},
                {name_text: "Combine Collections", icon_name: "merge-columns", click_handler: self.props.combineCollections,
                    multi_select: true, res_type: "collection"},
            ],
            Load: [
                {name_text: "Load", icon_name: "upload",
                    click_handler: ()=>{this.props.load_tile()}, res_type: "tile"},
                {name_text: "Unload", icon_name: "undo",
                    click_handler: ()=>{this.props.unload_module()}, res_type: "tile"},
                {name_text: "Reset", icon_name: "reset",
                    click_handler: this.props.unload_all_tiles, res_type: "tile"},
            ],
            Compare: [
                {name_text: "View History", icon_name: "history",
                    click_handler: this.props.showHistoryViewer, res_type: "tile"},
                {name_text: "Compare to Other Modules", icon_name: "comparison",
                    click_handler: this.props.compare_tiles, multi_select: true, res_type: "tile"}],
            Transfer: [
                {name_text: "Import Data", icon_name: "cloud-upload", click_handler: self.props.showCollectionImport},
                {name_text: "Download Collection", icon_name: "download",
                    click_handler: ()=>{this.props.downloadCollection()}, res_type: "collection"},
                {name_text: "divider1", icon_name: null, click_handler: "divider"},
                {name_text: "Import Jupyter Notebook", icon_name: "cloud-upload", click_handler: self.props.showJupyterImport},
                {name_text: "Import List", icon_name: "cloud-upload", click_handler: this.props.showListImport},
                {name_text: "Download As Jupyter Notebook", icon_name: "download",
                    click_handler: self.props.downloadJupyter, res_type: "project", reqs: {type: "jupyter"}},
                {name_text: "divider2", icon_name: null, click_handler: "divider"},
                {name_text: "Share to repository", icon_name: "share", click_handler: this.props.send_repository_func,
                    multi_select: true},
            ]
        };
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                if (!but.name_text.startsWith("divider")) {
                    but.click_handler = but.click_handler.bind(this)
                }
            }
        }
        return ms
    }

     render () {
        return <LibraryMenubar sendContextMenuItems={this.props.sendContextMenuItems}
                               context_menu_items={this.context_menu_items}
                               selected_rows={this.props.selected_rows}
                               selected_type={this.props.selected_type}
                               selected_resource={this.props.selected_resource}
                               resource_icon={icon_dict["all"]}
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

AllMenubar.propTypes = specializedMenubarPropTypes;

class CollectionMenubar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.upload_name = null
    }

    get menu_specs() {
        let self = this;
        let ms = {
            Open: [
                {name_text: "Open", icon_name: "document-open",
                    click_handler: ()=>{self.props.view_func()},  key_bindings: ["ctrl+o", "return"]},
                {name_text: "Open In Separate Tab", icon_name: "document-share",
                    click_handler: ()=>{self.props.view_resource(self.props.selected_resource, null, true)}},
            ],
            Edit: [
                {name_text: "Rename Collection", icon_name: "edit", click_handler: ()=>{self.props.rename_func()}},
                {name_text: "Duplicate Collection", icon_name: "duplicate",
                    click_handler: ()=>{this.props.duplicate_func()}},
                {name_text: "Combine Collections", icon_name: "merge-columns", click_handler: this.props.combineCollections,
                    multi_select: true},
                {name_text: "Delete Collections", icon_name: "trash", click_handler: ()=>{this.delete_func()},
                    multi_select: true}
            ],
            Transfer: [
                {name_text: "Import Data", icon_name: "cloud-upload", click_handler: this.props.showCollectionImport},
                {name_text: "Download Collection", icon_name: "download", click_handler: ()=>{this.props.downloadCollection()}},
                {name_text: "Share to repository", icon_name: "share", click_handler: this.props.send_repository_func,
                multi_select: true}
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
            menu_items.push({text: "open in separate tab", icon: "document-open", onClick: (resource)=>{
                this.props.view_resource(resource, null, true)
                }
            })
        }
        menu_items = menu_items.concat([
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this.props.duplicate_func},
            {text: "__divider__"},
            {text: "download", icon: "cloud-download", onClick: this._downloadCollection},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this.delete_func, intent: "danger"}
        ]);
        return menu_items
     }

     render () {
        return <LibraryMenubar sendContextMenuItems={this.props.sendContextMenuItems}
                               menu_specs={this.menu_specs}
                               resource_icon={icon_dict["collection"]}
                               context_menu_items={this.context_menu_items}
                               multi_select={this.props.multi_select}
                               selected_rows={this.props.selected_rows}
                               selected_type={this.props.selected_type}
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
    get context_menu_items() {
        let menu_items = [ {text: "open", icon: "document-open", onClick: this.props.view_resource}];
        if (window.in_context) {
            menu_items.push({text: "open in separate tab", icon: "document-open", onClick: (resource)=>{
                this.props.view_resource(resource, null, true)
                }
            })
        }
        menu_items = menu_items.concat([
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this.props.duplicate_func},
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
                    click_handler: ()=>{self.props.view_func()},  key_bindings: ["ctrl+o", "return"]},
                {name_text: "Open In Separate Tab", icon_name: "document-share",
                    click_handler: ()=>{self.props.view_resource(self.props.selected_resource, null, true)}},
                {name_text: "New Notebook", icon_name: "new-text-box",
                    click_handler: this.props.new_notebook,  key_bindings: ["ctrl+n"]},
            ],
            Edit: [
                {name_text: "Rename Project", icon_name: "edit", click_handler: ()=>{self.props.rename_func()}},
                {name_text: "Duplicate Project", icon_name: "duplicate", click_handler: ()=>{self.props.duplicate_func()}},
                {name_text: "Delete Projects", icon_name: "trash", click_handler: ()=>{self.props.delete_func()},
                    multi_select: true},
            ],
            Transfer: [
                {name_text: "Import Jupyter Notebook", icon_name: "cloud-upload", click_handler: self.props.showJupyterImport},
                {name_text: "Download As Jupyter Notebook", icon_name: "download", click_handler: self.props.downloadJupyter},
                {name_text: "Share To Repository", icon_name: "share", click_handler: this.props.send_repository_func,
                multi_select: true}
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
                               resource_icon={icon_dict["project"]}
                               menu_specs={this.menu_specs}
                               selected_rows={this.props.selected_rows}
                               selected_type={this.props.selected_type}
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

    get context_menu_items() {
        let menu_items = [ {text: "edit", icon: "edit", onClick: this._view_named_tile},
            {text: "edit in creator", icon: "annotation", onClick: this._creator_view_named_tile},
        ];

        if (window.in_context) {
            menu_items.push({text: "edit in separate tab", icon: "edit", onClick: (resource)=>{
                this._view_named_tile(resource, true)
                }
            });
            menu_items.push({text: "edit in creator in separate tab", icon: "annotation", onClick: (resource)=>{
                this._creator_view_named_tile(resource, true)
                }
            })
        }
        menu_items = menu_items.concat([
            {text: "__divider__"},
            {text: "load", icon: "upload", onClick: this._load_tile},
            {text: "unload", icon: "undo", onClick: this._unload_module},
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this.props.duplicate_func},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this.props.delete_func, intent: "danger"}
        ]);
        return menu_items
     }
    get menu_specs() {
        let self = this;
        let ms = {
            New: [
                {name_text: "Standard Tile", icon_name: "code",
                    click_handler: ()=>{this.props.new_in_creator("BasicTileTemplate")},  key_bindings: ["ctrl+n"]},
                {name_text: "Matplotlib Tile", icon_name: "timeline-line-chart",
                    click_handler: ()=>{this.props.new_in_creator("MatplotlibTileTemplate")}},
                {name_text: "D3Tile Tile", icon_name: "timeline-area-chart",
                    click_handler: ()=>{this.props.new_in_creator("D3TileTemplate")}},
            ],
            Open: [
                {name_text: "Open In Creator", icon_name: "document-open",
                    click_handler: this.props.creator_view,  key_bindings: ["ctrl+o", "return"]},
                {name_text: "Open In Viewer", icon_name: "document-open",
                    click_handler: this.props.tile_view},
                {name_text: "Open In Creator in New Tab", icon_name: "document-share",
                    click_handler: ()=>{self.props.creator_view_named_tile(self.props.selected_resource.name, true)}},
                {name_text: "Open in Viewer in New Tab", icon_name: "document-share",
                    click_handler: ()=>{self.props.view_named_tile(self.props.selected_resource.name, true)}},
            ],
            Edit: [
                {name_text: "Rename Tile", icon_name: "edit", click_handler: ()=>{self.props.rename_func()}},
                {name_text: "Duplicate Tile", icon_name: "duplicate", click_handler: ()=>{self.props.duplicate_func()}},
                {name_text: "Delete Tiles", icon_name: "trash", click_handler: ()=>{self.props.delete_func()},
                    multi_select: true},
            ],
            Load: [{name_text: "Load", icon_name: "upload", click_handler: ()=>{this.props.load_tile()}},
                {name_text: "Unload", icon_name: "undo", click_handler: ()=>{this.props.unload_module()}},
                {name_text: "Reset", icon_name: "reset", click_handler: this.props.unload_all_tiles},
            ],
            Compare: [{name_text: "View History", icon_name: "history", click_handler: this.props.showHistoryViewer, tooltip: "Show history viewer"},
                      {name_text: "Compare to Other Modules", icon_name: "comparison", click_handler: this.props.compare_tiles,
                          multi_select: true, tooltip: "Compare to another tile"}],
            Transfer: [
                {name_text: "Share To Repository", icon_name: "share", click_handler: this.props.send_repository_func,
                multi_select: true}
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
                               resource_icon={icon_dict["tile"]}
                               menu_specs={this.menu_specs}
                               selected_rows={this.props.selected_rows}
                               selected_type={this.props.selected_type}
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

     get context_menu_items() {
        let menu_items = [ {text: "edit", icon: "document-open", onClick: this.props.view_func}];
        if (window.in_context) {
            menu_items.push({text: "open in separate tab", icon: "document-open", onClick: (resource)=>{
                this.props.view_resource(resource, null, true)
                }
            })
        }
        menu_items = menu_items.concat([
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this.props.duplicate_func},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this.props.delete_func, intent: "danger"}
        ]);
        return menu_items
     }

     get menu_specs() {
        let self = this;
        let ms = {
            Open: [
                {name_text: "New", icon_name: "new-text-box",
                    click_handler: ()=>{this.props.new_list("nltk-english")}},
                {name_text: "Open", icon_name: "document-open",
                    click_handler: ()=>{self.props.view_func()},  key_bindings: ["ctrl+o", "return"]},
                {name_text: "Open In Separate Tab", icon_name: "document-share",
                    click_handler: ()=>{self.props.view_resource(self.props.selected_resource, null, true)}},
            ],
            Edit: [
                {name_text: "Rename List", icon_name: "edit", click_handler: ()=>{self.props.rename_func()}},
                {name_text: "Duplicate List", icon_name: "duplicate", click_handler: ()=>{self.props.duplicate_func()}},
                {name_text: "Delete Lists", icon_name: "trash", click_handler: ()=>{self.props.delete_func()},
                    multi_select: true},
            ],
            Transfer: [
                {name_text: "Import List", icon_name: "cloud-upload", click_handler: this.props.showListImport},
                {name_text: "Share to repository", icon_name: "share", click_handler: this.props.send_repository_func,
                multi_select: true}
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
                               selected_rows={this.props.selected_rows}
                               selected_type={this.props.selected_type}
                               resource_icon={icon_dict["list"]}
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

     get context_menu_items() {
        let menu_items = [ {text: "edit", icon: "document-open", onClick: this.props.view_resource}];
        if (window.in_context) {
            menu_items.push({text: "open in separate tab", icon: "document-open", onClick: (resource)=>{
                this.props.view_resource(resource, null, true)
                }
            })
        }
        menu_items = menu_items.concat([
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: this.props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: this.props.duplicate_func},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: this.props.delete_func, intent: "danger"}
        ]);
        return menu_items
     }


     get menu_specs() {
        let self = this;
        let ms = {
            Open: [
                {name_text: "New", icon_name: "new-text-box",
                    click_handler: ()=>{this.props.new_code("BasicCodeTemplate")}},
                {name_text: "Open", icon_name: "document-open",
                    click_handler: ()=>{self.props.view_func()},  key_bindings: ["ctrl+o", "return"]},
                {name_text: "Open In Separate Tab", icon_name: "document-share",
                    click_handler: ()=>{self.props.view_resource(self.props.selected_resource, null, true)}},
            ],
            Edit: [
                {name_text: "Rename Code", icon_name: "edit", click_handler: ()=>{self.props.rename_func()}},
                {name_text: "Duplicate Code", icon_name: "duplicate", click_handler: ()=>{self.props.duplicate_func()}},
                {name_text: "Delete Code", icon_name: "trash", click_handler: ()=>{self.props.delete_func()},
                    multi_select: true},
            ],
            Transfer: [
                {name_text: "Share to repository", icon_name: "share", click_handler: self.props.send_repository_func,
                multi_select: true}
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
                               resource_icon={icon_dict["code"]}
                               selected_rows={this.props.selected_rows}
                               selected_type={this.props.selected_type}
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