import React from "react";
import {memo} from "react";
import PropTypes from 'prop-types';

import {LibraryMenubar} from "./library_menubars.js";

export {RepositoryCollectionMenubar, RepositoryProjectMenubar, RepositoryTileMenubar,
    RepositoryListMenubar, RepositoryCodeMenubar}

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

const resource_icon = window.is_remote ? "globe-network" : "map-marker";

function RepositoryCollectionMenubar(props) {

     function menu_specs() {
        let ms = {
            Transfer: [
                {name_text: "Copy To Library", icon_name: "import", click_handler: props.repository_copy_func,
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

    return <LibraryMenubar menu_specs={menu_specs()}
                           multi_select={props.multi_select}
                           dark_theme={props.dark_theme}
                           controlled={props.controlled}
                           am_selected={props.am_selected}
                           tsocket={props.tsocket}
                           refreshTab={props.refresh_func}
                           closeTab={null}
                           resource_name=""
                           resource_icon={resource_icon}
                           showErrorDrawerButton={false}
                           toggleErrorDrawer={null}

    />
}

RepositoryCollectionMenubar.propTypes = specializedMenubarPropTypes;

RepositoryCollectionMenubar = memo(RepositoryCollectionMenubar);

function RepositoryProjectMenubar(props) {

     function menu_specs() {
        let ms = {
            Transfer: [
                {name_text: "Copy To Library", icon_name: "import", click_handler: props.repository_copy_func,
                    multi_select: true},
            ]


        };
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms

     }

    return <LibraryMenubar menu_specs={menu_specs()}
                           multi_select={props.multi_select}
                           dark_theme={props.dark_theme}
                           controlled={props.controlled}
                           am_selected={props.am_selected}
                           tsocket={props.tsocket}
                           refreshTab={props.refresh_func}
                           closeTab={null}
                           resource_name=""
                           resource_icon={resource_icon}
                           showErrorDrawerButton={false}
                           toggleErrorDrawer={null}

    />
}

RepositoryProjectMenubar.propTypes = specializedMenubarPropTypes;

RepositoryProjectMenubar = memo(RepositoryProjectMenubar);

function RepositoryTileMenubar(props) {

    function _tile_view(e) {
        props.view_func("/repository_view_module/")
    }

     function  menu_specs() {
        let ms = {
            View: [
                {name_text: "View Tile", icon_name: "eye-open", click_handler: _tile_view},
            ],
            Transfer: [
                {name_text: "Copy To Library", icon_name: "import", click_handler: props.repository_copy_func,
                    multi_select: true},
            ]


        };
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms

     }

    return <LibraryMenubar menu_specs={menu_specs()}
                           multi_select={props.multi_select}
                           dark_theme={props.dark_theme}
                           controlled={props.controlled}
                           am_selected={props.am_selected}
                           tsocket={props.tsocket}
                           refreshTab={props.refresh_func}
                           closeTab={null}
                           resource_name=""
                           resource_icon={resource_icon}
                           showErrorDrawerButton={false}
                           toggleErrorDrawer={null}

    />
}

RepositoryTileMenubar.propTypes = specializedMenubarPropTypes;
RepositoryTileMenubar = memo(RepositoryTileMenubar);

function RepositoryListMenubar(props) {

    function _list_view(e) {
        props.view_func("/repository_view_list/")
    }

     function  menu_specs() {
        let self = this;
        let ms = {
            View: [
                {name_text: "View List", icon_name: "eye-open", click_handler: _list_view},
            ],
            Transfer: [
                {name_text: "Copy To Library", icon_name: "import", click_handler: props.repository_copy_func,
                multi_select: true},
            ]


        };
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms

     }

    return <LibraryMenubar menu_specs={menu_specs()}
                           multi_select={props.multi_select}
                           dark_theme={props.dark_theme}
                           controlled={props.controlled}
                           am_selected={props.am_selected}
                           tsocket={props.tsocket}
                           refreshTab={props.refresh_func}
                           closeTab={null}
                           resource_name=""
                           resource_icon={resource_icon}
                           showErrorDrawerButton={false}
                           toggleErrorDrawer={null}

    />
}

RepositoryListMenubar.propTypes = specializedMenubarPropTypes;
RepositoryListMenubar = memo(RepositoryListMenubar);

function RepositoryCodeMenubar(props) {

    function _code_view(e) {
        props.view_func("/repository_view_code/")
    }

     function menu_specs() {
        let self = this;
        let ms = {
            View: [
                {name_text: "View Code", icon_name: "eye-open", click_handler: _code_view},
            ],
            Transfer: [
                {name_text: "Copy To Library", icon_name: "import", click_handler: props.repository_copy_func,
                multi_select: true},
            ]


        };
        for (const [menu_name, menu] of Object.entries(ms)) {
            for (let but of menu) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return ms

     }

    return <LibraryMenubar menu_specs={menu_specs()}
                           multi_select={props.multi_select}
                           dark_theme={props.dark_theme}
                           controlled={props.controlled}
                           am_selected={props.am_selected}
                           tsocket={props.tsocket}
                           refreshTab={props.refresh_func}
                           closeTab={null}
                           resource_name=""
                           resource_icon={resource_icon}
                           showErrorDrawerButton={false}
                           toggleErrorDrawer={null}

    />
}

RepositoryCodeMenubar.propTypes = specializedMenubarPropTypes;
RepositoryCodeMenubar = memo(RepositoryCodeMenubar);