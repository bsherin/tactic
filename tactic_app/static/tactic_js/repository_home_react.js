var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import { Toolbar } from "./blueprint_toolbar.js";
import { TacticSocket } from "./tactic_socket.js";

import { render_navbar } from "./blueprint_navbar.js";

import { handleCallback } from "./communication_react.js";

import { doFlash } from "./toaster.js";

let Bp = blueprint;

import { LibraryPane } from "./library_pane.js";
import { BOTTOM_MARGIN, getUsableDimensions, SIDE_MARGIN, USUAL_TOOLBAR_HEIGHT } from "./sizing_tools.js";
import { ViewerContext } from "./resource_viewer_context.js";
import { withStatus } from "./toaster.js";
import { withErrorDrawer } from "./error_drawer.js";

const MARGIN_SIZE = 17;

let tsocket;

function _repository_home_main() {
    render_navbar("repository");
    tsocket = new LibraryTacticSocket("library", 5000);
    let RepositoryHomeAppPlus = withErrorDrawer(withStatus(RepositoryHomeApp, tsocket), tsocket);
    let domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(React.createElement(RepositoryHomeAppPlus, null), domContainer);
}

class LibraryTacticSocket extends TacticSocket {

    initialize_socket_stuff() {

        this.socket.emit('join', { "user_id": window.user_id, "library_id": window.library_id });

        this.socket.on("window-open", data => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));

        this.socket.on('handle-callback', handleCallback);
        this.socket.on('close-user-windows', data => {
            if (!(data["originator"] == window.library_id)) {
                window.close();
            }
        });
        this.socket.on('doflash', doFlash);
    }
}

var res_types = ["collection", "project", "tile", "list", "code"];
class RepositoryHomeApp extends React.Component {

    constructor(props) {
        super(props);
        let aheight = getUsableDimensions().usable_height_no_bottom;
        let awidth = getUsableDimensions().usable_width - 170;
        this.state = {
            selected_tab_id: "collections-pane",
            usable_width: awidth,
            usable_height: aheight,
            pane_states: {}
        };
        for (let res_type of res_types) {
            this.state.pane_states[res_type] = {
                left_width_fraction: .65,
                selected_resource: { "name": "", "tags": "", "notes": "", "updated": "", "created": "" },
                tag_button_state: {
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
                search_metadata_checked: false
            };
        }
        this.top_ref = React.createRef();
        doBinding(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this._update_window_dimensions);
        this.setState({ "mounted": true });
        this._update_window_dimensions();
        this.props.stopSpinner();
    }

    _updatePaneState(res_type, state_update, callback = null) {
        let old_state = Object.assign({}, this.state.pane_states[res_type]);
        let new_pane_states = Object.assign({}, this.state.pane_states);
        new_pane_states[res_type] = Object.assign(old_state, state_update);
        this.setState({ pane_states: new_pane_states }, callback);
    }

    _update_window_dimensions() {
        let uwidth = window.innerWidth - 2 * SIDE_MARGIN;
        let uheight = window.innerHeight;
        if (this.top_ref && this.top_ref.current) {
            uheight = uheight - this.top_ref.current.offsetTop;
        } else {
            uheight = uheight - USUAL_TOOLBAR_HEIGHT;
        }
        this.setState({ usable_height: uheight, usable_width: uwidth });
    }

    _handleTabChange(newTabId, prevTabId, event) {
        this.setState({ selected_tab_id: newTabId }, this._update_window_dimensions);
    }

    getIconColor(paneId) {
        return paneId == this.state.selected_tab_id ? "white" : "#CED9E0";
    }

    render() {
        let collection_pane = React.createElement(LibraryPane, _extends({
            res_type: "collection",
            allow_search_inside: false,
            allow_search_metadata: false,
            ToolbarClass: RepositoryCollectionToolbar,
            updatePaneState: this._updatePaneState
        }, this.state.pane_states["collection"], this.props.errorDrawerFuncs, {
            errorDrawerFuncs: this.props.errorDrawerFuncs,
            is_repository: true,
            tsocket: tsocket }));
        let projects_pane = React.createElement(LibraryPane, _extends({
            res_type: "project",
            allow_search_inside: false,
            allow_search_metadata: true,
            search_metadata_view: "search_project_metadata",
            ToolbarClass: RepositoryProjectToolbar,
            updatePaneState: this._updatePaneState
        }, this.state.pane_states["project"], this.props.errorDrawerFuncs, {
            errorDrawerFuncs: this.props.errorDrawerFuncs,
            is_repository: true,
            tsocket: tsocket }));
        let tiles_pane = React.createElement(LibraryPane, _extends({
            res_type: "tile",
            allow_search_inside: true,
            allow_search_metadata: true,
            search_inside_view: "search_inside_tiles",
            search_metadata_view: "search_tile_metadata",
            ToolbarClass: RepositoryTileToolbar,
            updatePaneState: this._updatePaneState
        }, this.state.pane_states["tile"], this.props.errorDrawerFuncs, {
            errorDrawerFuncs: this.props.errorDrawerFuncs,
            is_repository: true,
            tsocket: tsocket }));
        let lists_pane = React.createElement(LibraryPane, _extends({
            res_type: "list",
            allow_search_inside: true,
            allow_search_metadata: true,
            search_inside_view: "search_inside_lists",
            search_metadata_view: "search_list_metadata",
            ToolbarClass: RepositoryListToolbar,
            updatePaneState: this._updatePaneState
        }, this.state.pane_states["list"], this.props.errorDrawerFuncs, {
            errorDrawerFuncs: this.props.errorDrawerFuncs,
            is_repository: true,
            tsocket: tsocket }));
        let code_pane = React.createElement(LibraryPane, _extends({
            res_type: "code",
            allow_search_inside: true,
            allow_search_metadata: true,
            search_inside_view: "search_inside_code",
            search_metadata_view: "search_code_metadata",
            ToolbarClass: RepositoryCodeToolbar,
            updatePaneState: this._updatePaneState
        }, this.state.pane_states["code"], this.props.errorDrawerFuncs, {
            errorDrawerFuncs: this.props.errorDrawerFuncs,
            is_repository: true,
            tsocket: tsocket }));
        let outer_style = { width: this.state.usable_width,
            height: this.state.usable_height,
            paddingLeft: 0
        };
        return React.createElement(
            ViewerContext.Provider,
            { value: { readOnly: true } },
            React.createElement(
                "div",
                { id: "repository_container", className: "pane-holder", ref: this.top_ref, style: outer_style },
                React.createElement(
                    Bp.Tabs,
                    { id: "the_container", style: { marginTop: 100 },
                        selectedTabId: this.state.selected_tab_id,
                        renderActiveTabPanelOnly: true,
                        vertical: true, large: true, onChange: this._handleTabChange },
                    React.createElement(
                        Bp.Tab,
                        { id: "collections-pane", panel: collection_pane },
                        React.createElement(
                            Bp.Tooltip,
                            { content: "Collections", position: Bp.Position.RIGHT },
                            React.createElement(Bp.Icon, { icon: "box", iconSize: 20, tabIndex: -1, color: this.getIconColor("collections-pane") })
                        )
                    ),
                    React.createElement(
                        Bp.Tab,
                        { id: "projects-pane", panel: projects_pane },
                        React.createElement(
                            Bp.Tooltip,
                            { content: "Projects", position: Bp.Position.RIGHT },
                            React.createElement(Bp.Icon, { icon: "projects", iconSize: 20, tabIndex: -1, color: this.getIconColor("projects-pane") })
                        )
                    ),
                    React.createElement(
                        Bp.Tab,
                        { id: "tiles-pane", panel: tiles_pane },
                        React.createElement(
                            Bp.Tooltip,
                            { content: "Tiles", position: Bp.Position.RIGHT },
                            React.createElement(Bp.Icon, { icon: "application", iconSize: 20, tabIndex: -1, color: this.getIconColor("tiles-pane") })
                        )
                    ),
                    React.createElement(
                        Bp.Tab,
                        { id: "lists-pane", panel: lists_pane },
                        React.createElement(
                            Bp.Tooltip,
                            { content: "Lists", position: Bp.Position.RIGHT },
                            React.createElement(Bp.Icon, { icon: "list", iconSize: 20, tabIndex: -1, color: this.getIconColor("lists-pane") })
                        )
                    ),
                    React.createElement(
                        Bp.Tab,
                        { id: "code-pane", panel: code_pane },
                        React.createElement(
                            Bp.Tooltip,
                            { content: "Code", position: Bp.Position.RIGHT },
                            React.createElement(Bp.Icon, { icon: "code", tabIndex: -1, color: this.getIconColor("code-pane") })
                        )
                    )
                )
            )
        );
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
                    new_button = { name_text: button[0],
                        click_handler: button[1],
                        icon_name: button[2],
                        multi_select: button[3] };
                    if (button.length > 4) {
                        new_button.intent = button[4];
                    }
                    if (button.length > 5) {
                        new_button.key_bindings = button[5];
                    }
                    if (button.length > 6) {
                        new_button.tooltip = button[6];
                    }
                    new_group.push(new_button);
                }
            }
            if (new_group.length != 0) {
                new_bgs.push(new_group);
            }
        }
        return new_bgs;
    }

    prepare_file_adders() {
        if (this.props.file_adders == null || this.props.file_adders.length == 0) return [];
        let file_adders = [];
        for (let button of this.props.file_adders) {
            let new_button = { name_text: button[0],
                click_handler: button[1],
                icon_name: button[2],
                multiple: button[3] };
            file_adders.push(new_button);
        }
        return file_adders;
    }

    prepare_popup_buttons() {
        if (this.props.popup_buttons == null || this.props.popup_buttons.length == 0) return [];
        let popup_buttons = [];
        for (let button of this.props.popup_buttons) {
            let new_button = { name: button[0],
                icon_name: button[1]
            };
            let opt_list = [];
            for (let opt of button[2]) {
                opt_list.push({ opt_name: opt[0], opt_func: opt[1], opt_icon: opt[2] });
            }
            new_button["option_list"] = opt_list;
            popup_buttons.push(new_button);
        }
        return popup_buttons;
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
        return React.createElement(Toolbar, { button_groups: this.prepare_button_groups(),
            file_adders: this.prepare_file_adders(),
            alternate_outer_style: outer_style,
            sendRef: this.props.sendRef,
            popup_buttons: popup_buttons
        });
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
    muti_select: PropTypes.bool
};

class RepositoryCollectionToolbar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    get button_groups() {
        return [[["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]];
    }

    render() {
        return React.createElement(LibraryToolbar, { button_groups: this.button_groups,
            left_position: this.props.left_position,
            sendRef: this.props.sendRef,
            multi_select: this.props.multi_select });
    }
}

RepositoryCollectionToolbar.propTypes = specializedToolbarPropTypes;

class RepositoryProjectToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    get button_groups() {
        return [[["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]];
    }

    render() {
        return React.createElement(LibraryToolbar, { button_groups: this.button_groups,
            left_position: this.props.left_position,
            sendRef: this.props.sendRef,
            multi_select: this.props.multi_select });
    }

}

RepositoryProjectToolbar.propTypes = specializedToolbarPropTypes;

class RepositoryTileToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _tile_view(e) {
        this.props.view_func("/repository_view_module/");
    }

    get button_groups() {
        return [[["view", this._tile_view, "eye-open", false, "regular", [], "view"], ["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]];
    }

    render() {
        return React.createElement(LibraryToolbar, { button_groups: this.button_groups,
            left_position: this.props.left_position,
            sendRef: this.props.sendRef,
            multi_select: this.props.multi_select });
    }

}

RepositoryTileToolbar.propTypes = specializedToolbarPropTypes;

class RepositoryListToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _list_view(e) {
        this.props.view_func("/repository_view_list/");
    }

    get button_groups() {
        return [[["view", this._list_view, "eye-open", false, "regular", [], "view"], ["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]];
    }

    render() {
        return React.createElement(LibraryToolbar, { button_groups: this.button_groups,
            left_position: this.props.left_position,
            sendRef: this.props.sendRef,
            multi_select: this.props.multi_select });
    }

}

RepositoryListToolbar.propTypes = specializedToolbarPropTypes;

class RepositoryCodeToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _code_view(e) {
        this.props.view_func("/repository_view_code/");
    }

    get button_groups() {
        return [[["view", this._code_view, "eye-open", false, "regular", [], "view"], ["copy", this.props.repository_copy_func, "import", false, "regular", [], "Copy to library"]]];
    }

    render() {
        return React.createElement(LibraryToolbar, { button_groups: this.button_groups,
            left_position: this.props.left_position,
            sendRef: this.props.sendRef,
            multi_select: this.props.multi_select });
    }

}

RepositoryCodeToolbar.propTypes = specializedToolbarPropTypes;

_repository_home_main();