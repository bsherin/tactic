
import {Toolbar} from "./react_toolbar.js"
import {TacticSocket} from "./tactic_socket.js"

import {render_navbar} from "./base_module.js";

var Rbs = window.ReactBootstrap;

import {LibraryPane} from "./library_pane.js"

const MARGIN_SIZE = 17;

let tsocket;

function _repository_home_main () {
    render_navbar();
    tsocket = new LibraryTacticSocket("library", 5000);
    let domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(<RepositoryHomeApp/>, domContainer)
}

class LibraryTacticSocket extends TacticSocket {

    initialize_socket_stuff() {

        this.socket.emit('join', {"user_id":  window.user_id, "library_id":  window.library_id});

        this.socket.on("window-open", (data) => window.open(`${$SCRIPT_ROOT}/load_temp_page/${data["the_id"]}`));

        // this.socket.on('update-selector-list', (data) => {
        //     const manager = resource_managers[data.module_id];
        //     manager.fill_content(data.html);
        //     manager.select_resource_button(data.select);
        //     manager.tag_button_list.refresh_from_selectors();
        // });
        //
        // this.socket.on('update-tag-list', (data) => {
        //     resource_managers[data.module_id].tag_button_list.refresh_given_taglist(data.tag_list)
        // });

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


class RepositoryHomeApp extends React.Component {

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
        return (
            <React.Fragment>
                <Rbs.Tab.Container id="the_container" defaultActiveKey="collections-pane">
                    <div id="repository_container" className="d-flex flex-row">
                        <div className="d-flex flex-column justify-content-between left-vertical-nav"
                             style={{"marginTop": 100}}>
                            <Rbs.Nav variant="pills" className="flex-column">
                                {nav_items}
                            </Rbs.Nav>
                        </div>
                        <div className="d-flex flex-column">
                            <Rbs.Tab.Content>
                                <Rbs.Tab.Pane eventKey="collections-pane">
                                    <LibraryPane usable_height={this.state.usable_height}
                                                 usable_width={this.state.usable_width}
                                                 res_type="collection"
                                                 allow_search_inside={false}
                                                 allow_search_metadata={false}
                                                 is_repository={true}
                                                 ToolbarClass={RepositoryCollectionToolbar}
                                />
                                </Rbs.Tab.Pane>
                                <Rbs.Tab.Pane eventKey="projects-pane">
                                    <LibraryPane usable_height={this.state.usable_height}
                                                 usable_width={this.state.usable_width}
                                                 res_type="project"
                                                 allow_search_inside={false}
                                                 allow_search_metadata={true}
                                                 search_metadata_view = "search_project_metadata"
                                                 is_repository={true}
                                                 ToolbarClass={RepositoryProjectToolbar}
                                    />
                                </Rbs.Tab.Pane>
                                <Rbs.Tab.Pane eventKey="tiles-pane">
                                    <LibraryPane usable_height={this.state.usable_height}
                                                 usable_width={this.state.usable_width}
                                                 res_type="tile"
                                                 allow_search_inside={true}
                                                 allow_search_metadata={true}
                                                 search_inside_view="search_inside_tiles"
                                                 search_metadata_view = "search_tile_metadata"
                                                 is_repository={true}
                                                 ToolbarClass={RepositoryTileToolbar}
                                    />
                                </Rbs.Tab.Pane>
                                <Rbs.Tab.Pane eventKey="lists-pane">
                                    <LibraryPane usable_height={this.state.usable_height}
                                                 usable_width={this.state.usable_width}
                                                 res_type="list"
                                                 allow_search_inside={true}
                                                 allow_search_metadata={true}
                                                 search_inside_view="search_inside_lists"
                                                 search_metadata_view = "search_list_metadata"
                                                 is_repository={true}
                                                 ToolbarClass={RepositoryListToolbar}
                                    />
                                </Rbs.Tab.Pane>
                                <Rbs.Tab.Pane eventKey="code-pane">
                                    <LibraryPane usable_height={this.state.usable_height}
                                                 usable_width={this.state.usable_width}
                                                 res_type="code"
                                                 allow_search_inside={true}
                                                 allow_search_metadata={true}
                                                 search_inside_view="search_inside_code"
                                                 search_metadata_view = "search_code_metadata"
                                                 is_repository={true}
                                                 ToolbarClass={RepositoryCodeToolbar}
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

    _collection_view() {
        this.props.view_func("/main/")
    }

    get button_groups() {
        return [
            [["copy", this.props.repository_copy_func, "share", false]]
        ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               multi_select={this.props.multi_select} />
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
            [["copy", this.props.repository_copy_func, "share", false]]
        ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups} multi_select={this.props.multi_select} />
     }

}

RepositoryProjectToolbar.propTypes = specializedToolbarPropTypes;

class RepositoryTileToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _tile_view() {
        this.props.view_func("/repository_view_module/")
    }

    get button_groups() {
        return [
            [["view", this._tile_view, "book-open", false],
                ["copy", this.props.repository_copy_func, "share", false]]
            ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               multi_select={this.props.multi_select} />
     }

}

RepositoryTileToolbar.propTypes = specializedToolbarPropTypes;

class RepositoryListToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _list_view() {
        this.props.view_func("/repository_view_list/")
    }

    get button_groups() {
        return [
            [["view", this._list_view, "book-open", false],
                ["copy", this.props.repository_copy_func, "share", false]]
        ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               multi_select={this.props.multi_select} />
     }

}

RepositoryListToolbar.propTypes = specializedToolbarPropTypes;


class RepositoryCodeToolbar extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _code_view() {
        this.props.view_func("/repository_view_code/")
    }


    get button_groups() {
        return [
            [["view", this._code_view, "book-open", false],
                ["copy", this.props.repository_copy_func, "share", false]]
        ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups}
                               multi_select={this.props.multi_select} />
     }

}

RepositoryCodeToolbar.propTypes = specializedToolbarPropTypes;


_repository_home_main();