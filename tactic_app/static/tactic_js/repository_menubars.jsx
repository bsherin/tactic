import React from "react";

import PropTypes from 'prop-types';

import {LibraryMenubar} from "./library_menubars.js";
import {doBinding} from "./utilities_react";

export {RepositoryCollectionMenubar, RepositoryProjectMenubar, RepositoryTileMenubar, RepositoryListMenubar, RepositoryCodeMenubar}

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


class RepositoryCollectionMenubar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

     get menu_specs() {
        let self = this;
        let ms = {
            Transfer: [
                {name_text: "Copy To Library", icon_name: "import", click_handler: this.props.repository_copy_func}
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
        return <LibraryMenubar menu_specs={this.menu_specs}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                               controlled={this.props.controlled}
                               am_selected={this.props.am_selected}
                               tsocket={this.props.tsocket}
                               refreshTab={this.props.refresh_func}
                               closeTab={null}
                               resource_name=""
                               showErrorDrawerButton={false}
                               toggleErrorDrawer={null}

        />
     }
}

RepositoryCollectionMenubar.propTypes = specializedMenubarPropTypes;

class RepositoryProjectMenubar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

     get menu_specs() {
        let self = this;
        let ms = {
            Transfer: [
                {name_text: "Copy To Library", icon_name: "import", click_handler: this.props.repository_copy_func},
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
        return <LibraryMenubar menu_specs={this.menu_specs}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                               controlled={this.props.controlled}
                               am_selected={this.props.am_selected}
                               tsocket={this.props.tsocket}
                               refreshTab={this.props.refresh_func}
                               closeTab={null}
                               resource_name=""
                               showErrorDrawerButton={false}
                               toggleErrorDrawer={null}

        />
     }
}

RepositoryProjectMenubar.propTypes = specializedMenubarPropTypes;

class RepositoryTileMenubar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    _tile_view(e) {
        this.props.view_func("/repository_view_module/")
    }

     get menu_specs() {
        let self = this;
        let ms = {
            View: [
                {name_text: "View Tile", icon_name: "eye-open", click_handler: this._tile_view},
            ],
            Transfer: [
                {name_text: "Copy To Library", icon_name: "import", click_handler: this.props.repository_copy_func},
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
        return <LibraryMenubar menu_specs={this.menu_specs}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                               controlled={this.props.controlled}
                               am_selected={this.props.am_selected}
                               tsocket={this.props.tsocket}
                               refreshTab={this.props.refresh_func}
                               closeTab={null}
                               resource_name=""
                               showErrorDrawerButton={false}
                               toggleErrorDrawer={null}

        />
     }
}

RepositoryTileMenubar.propTypes = specializedMenubarPropTypes;

class RepositoryListMenubar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    _list_view(e) {
        this.props.view_func("/repository_view_list/")
    }

     get menu_specs() {
        let self = this;
        let ms = {
            View: [
                {name_text: "View List", icon_name: "eye-open", click_handler: this._list_view},
            ],
            Transfer: [
                {name_text: "Copy To Library", icon_name: "import", click_handler: this.props.repository_copy_func},
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
        return <LibraryMenubar menu_specs={this.menu_specs}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                               controlled={this.props.controlled}
                               am_selected={this.props.am_selected}
                               tsocket={this.props.tsocket}
                               refreshTab={this.props.refresh_func}
                               closeTab={null}
                               resource_name=""
                               showErrorDrawerButton={false}
                               toggleErrorDrawer={null}

        />
     }
}

RepositoryListMenubar.propTypes = specializedMenubarPropTypes;

class RepositoryCodeMenubar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    _code_view(e) {
        this.props.view_func("/repository_view_code/")
    }

     get menu_specs() {
        let self = this;
        let ms = {
            View: [
                {name_text: "View Code", icon_name: "eye-open", click_handler: this._code_view},
            ],
            Transfer: [
                {name_text: "Copy To Library", icon_name: "import", click_handler: this.props.repository_copy_func},
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
        return <LibraryMenubar menu_specs={this.menu_specs}
                               multi_select={this.props.multi_select}
                               dark_theme={this.props.dark_theme}
                               controlled={this.props.controlled}
                               am_selected={this.props.am_selected}
                               tsocket={this.props.tsocket}
                               refreshTab={this.props.refresh_func}
                               closeTab={null}
                               resource_name=""
                               showErrorDrawerButton={false}
                               toggleErrorDrawer={null}

        />
     }
}

RepositoryCodeMenubar.propTypes = specializedMenubarPropTypes;