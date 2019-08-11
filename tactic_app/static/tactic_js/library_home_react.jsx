import {showModalReact} from "./modal_react.js";
import {Toolbar} from "./react_toolbar.js"


var Rbs = window.ReactBootstrap;

import {LibraryPane} from "./library_pane.js"

const MARGIN_SIZE = 17;

function _library_home_main () {
    let domContainer = document.querySelector('#library-home-root');
    ReactDOM.render(<LibraryHomeApp/>, domContainer)
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
        return (
            <React.Fragment>
                <Rbs.Tab.Container id="the_container" defaultActiveKey="collections-pane">
                    <div className="d-flex flex-row">
                        <div className="d-flex flex-column justify-content-between left-vertical-nav"
                             style={{"marginTop": 25}}>
                            <Rbs.Nav variant="pills" className="flex-column">
                                <Rbs.Nav.Item>
                                    <Rbs.Nav.Link eventKey="collections-pane">
                                        <span className="far fa-file-alt um-nav-icon"></span>
                                        <span className="um-nav-text">collections</span>
                                    </Rbs.Nav.Link>
                                </Rbs.Nav.Item>
                                {/*<Rbs.Nav.Item>*/}
                                {/*    <Rbs.Nav.Link eventKey="projects-pane">*/}
                                {/*        <span className="fas fa-project-diagram um-nav-icon"></span>*/}
                                {/*        <span className="um-nav-text">projects</span>*/}
                                {/*    </Rbs.Nav.Link>*/}
                                {/*</Rbs.Nav.Item>*/}
                                {/*<Rbs.Nav.Item>*/}
                                {/*    <Rbs.Nav.Link eventKey="tiles-pane">*/}
                                {/*        <span className="far fa-window um-nav-icon"></span>*/}
                                {/*        <span className="um-nav-text">tiles</span>*/}
                                {/*    </Rbs.Nav.Link>*/}
                                {/*</Rbs.Nav.Item>*/}
                                {/*<Rbs.Nav.Item>*/}
                                {/*    <Rbs.Nav.Link eventKey="lists-pane">*/}
                                {/*        <span className="far fa-list-alt um-nav-icon"></span>*/}
                                {/*        <span className="um-nav-text">lists</span>*/}
                                {/*    </Rbs.Nav.Link>*/}
                                {/*</Rbs.Nav.Item>*/}
                                {/*<Rbs.Nav.Item>*/}
                                {/*    <Rbs.Nav.Link eventKey="code-pane">*/}
                                {/*        <span className="far fa-file-code um-nav-icon"></span>*/}
                                {/*        <span className="um-nav-text">code</span>*/}
                                {/*    </Rbs.Nav.Link>*/}
                                {/*</Rbs.Nav.Item>*/}
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
                                                 view_view="/main/"
                                                 ToolbarClass={CollectionToolbar}

                                />
                                </Rbs.Tab.Pane>
                                {/*<Rbs.Tab.Pane eventKey="projects-pane">*/}
                                {/*    <ProjectPane usable_height={this.state.usable_height}*/}
                                {/*                    usable_width={this.state.usable_width}/>*/}
                                {/*</Rbs.Tab.Pane>*/}
                                {/*<Rbs.Tab.Pane eventKey="tiles-pane">*/}
                                {/*    <TilePane usable_height={this.state.usable_height}*/}
                                {/*                    usable_width={this.state.usable_width}/>*/}
                                {/*</Rbs.Tab.Pane>*/}
                                {/*<Rbs.Tab.Pane eventKey="lists-pane">*/}
                                {/*    <ListPane usable_height={this.state.usable_height}*/}
                                {/*                    usable_width={this.state.usable_width}/>*/}
                                {/*</Rbs.Tab.Pane>*/}
                                {/*<Rbs.Tab.Pane eventKey="code-pane">*/}
                                {/*    <CodePane usable_height={this.state.usable_height}*/}
                                {/*                    usable_width={this.state.usable_width}/>*/}
                                {/*</Rbs.Tab.Pane>*/}
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

    render() {
       return <Toolbar button_groups={this.prepare_button_groups()}/>
    }
}

LibraryToolbar.propTypes = {
    button_groups: PropTypes.array,
    multi_select: PropTypes.bool,
};

function CollectionToolbarFunc (selected_resource, multi_select, view_func, duplicate_func) {
    return (<CollectionToolbar selected_resource={selected_resource}
                               multi_select={multi_select}
                               view_func={view_func}
                               duplicate_func={duplicate_func}
                               />)
}

class CollectionToolbar extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    get button_groups() {
        return [
            [["open", this.props.view_func, "book-open", false]],
            [["duplicate", this.props.duplicate_func, "copy", false],
             ["rename",  this._rename_func, "edit", false],
             ["combine", this._combineCollections, "plus-square", true]],
            [["download", this._downloadCollection, "cloud-download", false],
             ["share", this._send_repository_func, "share", false]],
            [["delete", this._delete_func, "trash", true]],
            [["refresh", this._refresh_func, "sync-alt", false]]
        ];
     }

     render () {
        return <LibraryToolbar button_groups={this.button_groups} multi_select={this.props.multi_select} />
     }
}

CollectionToolbar.propTypes = {
    view_func: PropTypes.func,
    duplicate_func: PropTypes.func,
    selected_resource: PropTypes.object,
    muti_select: PropTypes.bool
};


class OldCollectionPane extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            selected_resource: {"name": "", "tags": "", "notes": "", "updated": "", "created": ""},
            multi_select: false,
            list_of_selected: []
        }
    }

    _update_selected(state_update, callback=null) {
        let new_state = Object.assign(this.state, state_update);
        if (callback==null) {
            this.setState(new_state);
        }
        else {
            this.setState(new_state, callback)
        }
    }

    _view_func() {
        if (!this.state.multi_select) {
            window.open($SCRIPT_ROOT + "/main/" + String(this.state.selected_resource.name))
        }
    }

    _duplicate_func () {
        let res_type = this.props.res_type;
        let res_name = this.state.selected_resource.name;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + the_type, function(data) {
            showModalReact(`Duplicate ${res_type}`, "New Name",
                DuplicateResource, res_name, data.resource_name)
            }
        );
        function DuplicateResource(new_name) {
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": res_name
            };
            postAjaxPromise("/duplicate_collection", result_dict)
                .then((data) => {
                    manager.insert_new_row(data.new_row, 0);
                    manager.select_first_row();
                    resource_managers["all_module"].insert_new_row(data.new_all_row, 0)
                })
                .catch(doFlash)
        }
    }

     get button_groups() {
        return [
            [["open", this.view_func, "book-open", false]],
            [["duplicate", this._duplicate_func, "copy", false],
             ["rename",  this._rename_func, "edit", false],
             ["combine", this._combineCollections, "plus-square", true]],
            [["download", this._downloadCollection, "cloud-download", false],
             ["share", this._send_repository_func, "share", false]],
            [["delete", this._delete_func, "trash", true]],
            [["refresh", this._refresh_func, "sync-alt", false]]
        ];
     }

    render() {
        return (
            <LibraryPane usable_height={this.props.usable_height}
                         usable_width={this.props.usable_width}
                         res_type="collection"
                         button_groups={this.button_groups}
                         allow_search_inside={false}
                         allow_search_metadata={false}
                         selected_resource={this.state.selected_resource}
                         list_of_selected={this.state.list_of_selected}
                         multi_select={this.state.multi_select}
                         update_selected={this._update_selected}
            />
        )
    }
}

OldCollectionPane.propTypes = {
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

class ProjectPane extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            selected_resource: {"name": "", "tags": "", "notes": "", "updated": "", "created": ""},
            multi_select: false,
            list_of_selected: []
        }
    }

    _update_selected(state_update, callback=null) {
        let new_state = Object.assign(this.state, state_update);
        if (callback==null) {
            this.setState(new_state);
        }
        else {
            this.setState(new_state, callback)
        }
    }

    _view_func() {

    }

    get button_groups() {
        return [
            [["open", this._view_func, "book-open", false]]
            ];
    }

    render() {
        return (
            <LibraryPane usable_height={this.props.usable_height}
                         usable_width={this.props.usable_width}
                         res_type="project"
                         button_groups={this.button_groups}
                         allow_search_inside={false}
                         allow_search_metadata={true}
                         search_metadata_view="search_project_metadata"
                         selected_resource={this.state.selected_resource}
                         list_of_selected={this.state.list_of_selected}
                         multi_select={this.state.multi_select}
                         update_selected={this._update_selected}
            />
        )
    }
}

ProjectPane.propTypes = {
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

class TilePane extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            selected_resource: {"name": "", "tags": "", "notes": "", "updated": "", "created": ""},
            multi_select: false,
            list_of_selected: []
        }
    }

    _update_selected(state_update, callback=null) {
        let new_state = Object.assign(this.state, state_update);
        if (callback==null) {
            this.setState(new_state);
        }
        else {
            this.setState(new_state, callback)
        }
    }

    _view_func() {

    }

    get button_groups() {
        return [
            [["open", this._view_func, "book-open", false]]
            ];
    }

    render() {
        return (
            <LibraryPane usable_height={this.props.usable_height}
                         usable_width={this.props.usable_width}
                         res_type="tile"
                         button_groups={this.button_groups}
                         allow_search_inside={true}
                         allow_search_metadata={true}
                         search_inside_view="search_inside_tiles"
                         search_metadata_view="search_tile_metadata"
                         selected_resource={this.state.selected_resource}
                         list_of_selected={this.state.list_of_selected}
                         multi_select={this.state.multi_select}
                         update_selected={this._update_selected}
            />
        )
    }
}

TilePane.propTypes = {
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

class ListPane extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            selected_resource: {"name": "", "tags": "", "notes": "", "updated": "", "created": ""},
            multi_select: false,
            list_of_selected: []
        }
    }

    _update_selected(state_update, callback=null) {
        let new_state = Object.assign(this.state, state_update);
        if (callback==null) {
            this.setState(new_state);
        }
        else {
            this.setState(new_state, callback)
        }
    }

    view_func() {

    }

    get button_groups() {
        return [
            [["open", this._view_func, "book-open", false]]
            ];
    }

    render() {
        return (
            <LibraryPane usable_height={this.props.usable_height}
                         usable_width={this.props.usable_width}
                         res_type="list"
                         button_groups={this.button_groups}
                         allow_search_inside={true}
                         allow_search_metadata={true}
                         search_inside_view="search_inside_lists"
                         search_metadata_view="search_list_metadata"
                         selected_resource={this.state.selected_resource}
                         list_of_selected={this.state.list_of_selected}
                         multi_select={this.state.multi_select}
                         update_selected={this._update_selected}
            />
        )
    }
}

ListPane.propTypes = {
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

class CodePane extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            selected_resource: {"name": "", "tags": "", "notes": "", "updated": "", "created": ""},
            multi_select: false,
            list_of_selected: []
        }
    }

    _update_selected(state_update, callback=null) {
        let new_state = Object.assign(this.state, state_update);
        if (callback==null) {
            this.setState(new_state);
        }
        else {
            this.setState(new_state, callback)
        }
    }

    view_func() {

    }

    get button_groups() {
        return [
                [["open", this._view_func, "book-open", false]]
            ];
    }

    render() {
        return (
            <LibraryPane usable_height={this.props.usable_height}
                         usable_width={this.props.usable_width}
                         res_type="code"
                         button_groups={this.button_groups}
                         allow_search_inside={true}
                         allow_search_metadata={true}
                         search_inside_view="search_inside_code"
                         search_metadata_view="search_code_metadata"
                         selected_resource={this.state.selected_resource}
                         list_of_selected={this.state.list_of_selected}
                         multi_select={this.state.multi_select}
                         update_selected={this._update_selected}
            />
        )
    }
}

CodePane.propTypes = {
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

_library_home_main();