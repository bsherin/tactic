// noinspection JSCheckFunctionSignatures

import React from "react";
import {useEffect, memo} from "react";
import PropTypes from 'prop-types';

import {TacticMenubar} from "./menu_utilities";
import {icon_dict} from "./blueprint_mdata_fields";

export {AllMenubar, CollectionMenubar, ProjectMenubar, TileMenubar, ListMenubar, CodeMenubar, LibraryMenubar}

function LibraryMenubar(props) {
    useEffect(() => {
        if (props.context_menu_items) {
            props.sendContextMenuItems(props.context_menu_items)
        }
    }, []);

    let outer_style = {
        display: "flex",
        flexDirection: "row",
        position: "relative",
        left: props.left_position,
        marginBottom: 10
    };
    let disabled_items = [];
    if (props.multi_select) {
        for (let menu_name in props.menu_specs) {
            for (let menu_item of props.menu_specs[menu_name]) {
                if (!menu_item.multi_select) {
                    disabled_items.push(menu_item.name_text)
                }
            }
        }
    }
    for (let menu_name in props.menu_specs) {
        if (props.multi_select) {
            for (let menu_item of props.menu_specs[menu_name]) {
                if (!menu_item.multi_select) {
                    disabled_items.push(menu_item.name_text)
                } else if (menu_item.res_type && props.selected_type == "multi") {
                    disabled_items.push(menu_item.name_text)
                }
            }
        } else {
            for (let menu_item of props.menu_specs[menu_name]) {
                if (menu_item.res_type && menu_item.res_type != props.selected_type) {
                    disabled_items.push(menu_item.name_text)
                } else if (menu_item.reqs) {
                    for (let param in menu_item.reqs) {
                        if (!(param in props.selected_resource) ||
                            !(props.selected_resource[param] == menu_item.reqs[param])) {
                            disabled_items.push(menu_item.name_text)
                        }
                    }
                }
            }
        }
    }
    return <TacticMenubar menu_specs={props.menu_specs}
                          registerOmniGetter={props.registerOmniGetter}
                          dark_theme={props.dark_theme}
                          showRefresh={true}
                          showClose={false}
                          refreshTab={props.refreshTab}
                          closeTab={null}
                          disabled_items={disabled_items}
                          resource_name=""
                          resource_icon={props.resource_icon}
                          showErrorDrawerButton={props.showErrorDrawerButton}
                          toggleErrorDrawer={props.toggleErrorDrawer}
    />
}

LibraryMenubar = memo(LibraryMenubar);

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

function AllMenubar(props) {

    function context_menu_items() {
        let menu_items = [{text: "open", icon: "document-open", onClick: props.view_resource}];
        if (window.in_context) {
            menu_items.push({
                text: "open in separate tab", icon: "document-open", onClick: (resource) => {
                    props.view_resource(resource, null, true)
                }
            })
        }
        menu_items = menu_items.concat([
            {text: "__divider__"},
            {text: "rename", icon: "edit", onClick: props.rename_func},
            {text: "duplicate", icon: "duplicate", onClick: props.duplicate_func},
            {text: "__divider__"},
            {text: "load", icon: "upload", onClick: props.load_tile, res_type: "tile"},
            {text: "unload", icon: "undo", onClick: props.unload_module, res_type: "tile"},
            {text: "__divider__"},
            {text: "delete", icon: "trash", onClick: props.delete_func, intent: "danger"}
        ]);
        return menu_items
    }

    function menu_specs() {
        let ms = {
            New: [
                {
                    name_text: "New Notebook", icon_name: "new-text-box",
                    click_handler: props.new_notebook
                },
                {name_text: "divider1", icon_name: null, click_handler: "divider"},
                {
                    name_text: "Standard Tile", icon_name: "code",
                    click_handler: () => {
                        props.new_in_creator("BasicTileTemplate")
                    }
                },
                {
                    name_text: "Matplotlib Tile", icon_name: "timeline-line-chart",
                    click_handler: () => {
                        props.new_in_creator("MatplotlibTileTemplate")
                    }
                },
                {
                    name_text: "Javascript Tile", icon_name: "timeline-area-chart",
                    click_handler: () => {
                        props.new_in_creator("JSTileTemplate")
                    }
                },
                {name_text: "divider2", icon_name: null, click_handler: "divider"},
                {
                    name_text: "New List", icon_name: "new-text-box",
                    click_handler: () => {
                        props.new_list("nltk-english")
                    }
                },
                {
                    name_text: "New Code", icon_name: "new-text-box",
                    click_handler: () => {
                        props.new_code("BasicCodeTemplate")
                    }
                },
            ],
            Open: [
                {
                    name_text: "Open", icon_name: "document-open",
                    click_handler: () => {
                        props.view_func()
                    }, key_bindings: ["ctrl+o", "return"]
                },
                {
                    name_text: "Open In Separate Tab", icon_name: "document-share",
                    click_handler: () => {
                        props.view_resource(props.selected_resource, null, true)
                    }
                },
                {
                    name_text: "Open As Raw Html", icon_name: "document-share",
                    click_handler: () => {
                        props.open_raw(props.selected_resource)
                    }, res_type: "collection"
                },
                {name_text: "divider1", icon_name: null, click_handler: "divider"},
                {
                    name_text: "Open In Creator", icon_name: "document-open",
                    click_handler: props.creator_view, res_type: "tile"
                },
                {
                    name_text: "Edit Raw Tile", icon_name: "document-open",
                    click_handler: props.tile_view, res_type: "tile"
                },
            ],
            Edit: [
                {
                    name_text: "Rename Resource", icon_name: "edit", click_handler: () => {
                        props.rename_func()
                    }
                },
                {
                    name_text: "Duplicate Resource", icon_name: "duplicate", click_handler: () => {
                        props.duplicate_func()
                    }
                },
                {
                    name_text: "Delete Resources", icon_name: "trash", click_handler: () => {
                        props.delete_func()
                    },
                    multi_select: true
                },
                {name_text: "divider1", icon_name: null, click_handler: "divider"},
                {
                    name_text: "Combine Collections",
                    icon_name: "merge-columns",
                    click_handler: props.combineCollections,
                    multi_select: true,
                    res_type: "collection"
                },
            ],
            Load: [
                {
                    name_text: "Load", icon_name: "upload",
                    click_handler: () => {
                        props.load_tile()
                    }, res_type: "tile"
                },
                {
                    name_text: "Unload", icon_name: "undo",
                    click_handler: () => {
                        props.unload_module()
                    }, res_type: "tile"
                },
                {
                    name_text: "Reset", icon_name: "reset",
                    click_handler: props.unload_all_tiles, res_type: "tile"
                },
            ],
            Compare: [
                {
                    name_text: "View History", icon_name: "history",
                    click_handler: props.showHistoryViewer, res_type: "tile"
                },
                {
                    name_text: "Compare to Other Modules", icon_name: "comparison",
                    click_handler: props.compare_tiles, multi_select: true, res_type: "tile"
                }],
            Transfer: [
                {name_text: "Import Data", icon_name: "cloud-upload", click_handler: props.showCollectionImport},
                {
                    name_text: "Download Collection", icon_name: "download",
                    click_handler: () => {
                        props.downloadCollection()
                    }, res_type: "collection"
                },
                {name_text: "divider1", icon_name: null, click_handler: "divider"},
                {
                    name_text: "Import Jupyter Notebook",
                    icon_name: "cloud-upload",
                    click_handler: props.showJupyterImport
                },
                {name_text: "Import List", icon_name: "cloud-upload", click_handler: props.showListImport},
                {
                    name_text: "Download As Jupyter Notebook", icon_name: "download",
                    click_handler: props.downloadJupyter, res_type: "project", reqs: {type: "jupyter"}
                },
                {name_text: "divider2", icon_name: null, click_handler: "divider"},
                {
                    name_text: "Share to repository", icon_name: "share", click_handler: props.send_repository_func,
                    multi_select: true
                },
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

    return <LibraryMenubar sendContextMenuItems={props.sendContextMenuItems}
                           registerOmniGetter={props.registerOmniGetter}
                           context_menu_items={context_menu_items()}
                           selected_rows={props.selected_rows}
                           selected_type={props.selected_type}
                           selected_resource={props.selected_resource}
                           resource_icon={icon_dict["all"]}
                           menu_specs={menu_specs()}
                           multi_select={props.multi_select}
                           dark_theme={props.dark_theme}
                           controlled={props.controlled}
                           am_selected={props.am_selected}
                           tsocket={props.tsocket}
                           refreshTab={props.refresh_func}
                           closeTab={null}
                           resource_name=""
                           showErrorDrawerButton={true}
                           toggleErrorDrawer={props.toggleErrorDrawer}
    />
}

AllMenubar = memo(AllMenubar);

AllMenubar.propTypes = specializedMenubarPropTypes;
