

var Rbs = window.ReactBootstrap;

import {CombinedMetadata} from "./react_mdata_fields.js";
import {HorizontalPanes} from "./resizing_layouts.js";
import {Toolbar} from "./react_toolbar.js";
import {SearchForm, SelectorTable} from "./library_widgets.js";

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
        this.update_window_dimensions = this.update_window_dimensions.bind(this)
    }

    componentDidMount() {
        window.addEventListener("resize", this.update_window_dimensions);
        this.setState({"mounted": true});
        this.update_window_dimensions();
        stopSpinner()
    }

    update_window_dimensions() {
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
                                <Rbs.Nav.Item>
                                    <Rbs.Nav.Link eventKey="projects-pane">
                                        <span className="fas fa-project-diagram um-nav-icon"></span>
                                        <span className="um-nav-text">projects</span>
                                    </Rbs.Nav.Link>
                                </Rbs.Nav.Item>
                                <Rbs.Nav.Item>
                                    <Rbs.Nav.Link eventKey="tiles-pane">
                                        <span className="far fa-window um-nav-icon"></span>
                                        <span className="um-nav-text">tiles</span>
                                    </Rbs.Nav.Link>
                                </Rbs.Nav.Item>
                                <Rbs.Nav.Item>
                                    <Rbs.Nav.Link eventKey="lists-pane">
                                        <span className="far fa-list-alt um-nav-icon"></span>
                                        <span className="um-nav-text">lists</span>
                                    </Rbs.Nav.Link>
                                </Rbs.Nav.Item>
                                <Rbs.Nav.Item>
                                    <Rbs.Nav.Link eventKey="code-pane">
                                        <span className="far fa-file-code um-nav-icon"></span>
                                        <span className="um-nav-text">code</span>
                                    </Rbs.Nav.Link>
                                </Rbs.Nav.Item>
                              </Rbs.Nav>
                        </div>
                        <div className="d-flex flex-column">
                            <Rbs.Tab.Content>
                                <Rbs.Tab.Pane eventKey="collections-pane">
                                    <CollectionPane usable_height={this.state.usable_height}
                                                    usable_width={this.state.usable_width}/>
                                </Rbs.Tab.Pane>
                                <Rbs.Tab.Pane eventKey="projects-pane">
                                    <ProjectPane usable_height={this.state.usable_height}
                                                    usable_width={this.state.usable_width}/>
                                </Rbs.Tab.Pane>
                                <Rbs.Tab.Pane eventKey="tiles-pane">
                                    <TilePane usable_height={this.state.usable_height}
                                                    usable_width={this.state.usable_width}/>
                                </Rbs.Tab.Pane>
                                <Rbs.Tab.Pane eventKey="lists-pane">
                                    <ListPane usable_height={this.state.usable_height}
                                                    usable_width={this.state.usable_width}/>
                                </Rbs.Tab.Pane>
                                <Rbs.Tab.Pane eventKey="code-pane">
                                    <CodePane usable_height={this.state.usable_height}
                                                    usable_width={this.state.usable_width}/>
                                </Rbs.Tab.Pane>
                            </Rbs.Tab.Content>
                        </div>
                    </div>
                </Rbs.Tab.Container>
            </React.Fragment>

        )

    }
}


class LibraryPane extends React.Component {

    constructor(props) {
        super(props);
        this.top_ref = React.createRef();
        this.state = {
            selected_resource: {"name":"", "tags": "", "notes": "", "updated": "", "created": ""},
            data_list: [],
            mounted: false,
            left_width: this.props.usable_width / 2 - 25
        };
        this.handleSplitResize = this.handleSplitResize.bind(this);
        this.sortOnField = this.sortOnField.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this)
    }

    get_height_minus_top_offset (element_ref) {
        if (this.state.mounted) {  // This will be true after the initial render
            return this.props.usable_height - $(element_ref.current).offset().top
        }
        else {
            return this.props.usable_height - 50
        }
    }

    get_width_minus_left_offset (element_ref) {
        if (this.state.mounted) {  // This will be true after the initial render
            return this.props.usable_width - $(element_ref.current).offset().left
        }
        else {
            return this.props.usable_width - 50
        }
    }

    componentDidMount() {
        let self = this;
        this.setState({"mounted": true});
        postAjax(`resource_list_with_metadata/${this.props.res_type}`, {}, function(data) {
            self.setState({"data_list": data.data_list});
            self.sortOnField("updated_for_sort", "descending")
            }
        )
    }

    handleMetadataChange() {

    }

    handleClearSearch() {

    }
    sortOnField(sort_field, direction) {
        function compare_func (a, b) {
            let result;
            if (a[sort_field] < b[sort_field]) {
                result = -1
            }
            else if (a[sort_field] > b[sort_field]){
                result = 1
            }
            else {
                result = 0
            }
            if (direction == "descending") {
                result = -1 * result
            }
            return result
        }
        let new_data_list = this.state.data_list;
        new_data_list.sort(compare_func);
        this.setState({"data_list": new_data_list, "selected_resource": new_data_list[0]})
    }


    handleSplitResize(left_width, right_width, width_fraction) {
        this.setState({"left_width": left_width - 50})
    }

    handleRowClick(row_dict) {
        this.setState({"selected_resource": row_dict})
    }

    render() {
        let available_width = this.get_width_minus_left_offset(this.top_ref);
        let available_height = this.get_height_minus_top_offset(this.top_ref);

        let right_pane = (
                <CombinedMetadata tags={this.state.selected_resource.tags.split(" ")}
                      created={this.state.selected_resource.created}
                      notes={this.state.selected_resource.notes}
                      handleChange={this.handleMetadataChange}
                      res_type={this.props.res_type} />
        );
        let th_style= {
            "display": "inline-block",
            "verticalAlign": "top",
            "maxHeight": "100%",
            "overflowY": "scroll",
            "lineHeight": 1,
            "whiteSpace": "nowrap",
            "width": this.state.left_width,
            "overflowX": "hidden"
        };
        let left_pane = (
            <React.Fragment>
                <div className="d-flex flex-row" style={{"maxHeight": "100%"}}>
                    <div className="d-flex justify-content-around" style={{"width": 150}}>
                        tags
                    </div>
                    <div className="d-flex flex-column">
                        <Toolbar button_groups={this.props.button_groups}/>
                        <SearchForm res_type={this.props.res_type}
                                    handleClear={this.handleClearSearch}
                                    search_inside={this.props.search_inside}
                                    search_metadata={this.props.search_metadata}/>
                        <div style={th_style}>
                            <SelectorTable data_list={this.state.data_list}
                                           handleHeaderCellClick={this.sortOnField}
                                           selected_resource_name={this.state.selected_resource.name}
                                           handleRowClick={this.handleRowClick}

                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
        return (
            <div ref={this.top_ref} className="d-flex" >
                <HorizontalPanes
                    left_pane={left_pane}
                    right_pane={right_pane}
                    available_height={available_height}
                    available_width={available_width}
                    initial_width_fraction={.75}
                    handleSplitUpdate={this.handleSplitResize}
                />
            </div>
        )
    }
}

LibraryPane.propTypes = {
    usable_height: PropTypes.number,
    usable_width: PropTypes.number,
    res_type: PropTypes.string,
    button_groups: PropTypes.array,
    search_inside: PropTypes.bool,
    search_metadata: PropTypes.bool,
};

class CollectionPane extends React.Component {

    view_func() {

    }

    get button_groups() {
        let bgs = [
            [{"name_text": "open", "icon_name": "book-open", "multi_select": false, "click_handler": this.view_func},
                {"name_text": "rename", "icon_name": "edit", "multi_select": false, "click_handler": this.view_func}

            ]];

        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs
    }

    render() {
        return (
            <LibraryPane usable_height={this.props.usable_height}
                         usable_width={this.props.usable_width}
                         res_type="collection"
                         button_groups={this.button_groups}
                         search_inside={false}
                         search_metadata={false}
            />
        )
    }
}

CollectionPane.propTypes = {
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

class ProjectPane extends React.Component {

    view_func() {

    }

    get button_groups() {
        let bgs = [
            [{"name_text": "open", "icon_name": "book-open", "multi_select": false, "click_handler": this.view_func},
                {"name_text": "rename", "icon_name": "edit", "multi_select": false, "click_handler": this.view_func}

            ]];

        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs
    }

    render() {
        return (
            <LibraryPane usable_height={this.props.usable_height}
                         usable_width={this.props.usable_width}
                         res_type="project"
                         button_groups={this.button_groups}
                         search_inside={false}
                         search_metadata={false}
            />
        )
    }
}

ProjectPane.propTypes = {
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

class TilePane extends React.Component {

    view_func() {

    }

    get button_groups() {
        let bgs = [
            [{"name_text": "open", "icon_name": "book-open", "multi_select": false, "click_handler": this.view_func},
                {"name_text": "rename", "icon_name": "edit", "multi_select": false, "click_handler": this.view_func}

            ]];

        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs
    }

    render() {
        return (
            <LibraryPane usable_height={this.props.usable_height}
                         usable_width={this.props.usable_width}
                         res_type="tile"
                         button_groups={this.button_groups}
                         search_inside={false}
                         search_metadata={false}
            />
        )
    }
}

TilePane.propTypes = {
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

class ListPane extends React.Component {

    view_func() {

    }

    get button_groups() {
        let bgs = [
            [{"name_text": "open", "icon_name": "book-open", "multi_select": false, "click_handler": this.view_func},
                {"name_text": "rename", "icon_name": "edit", "multi_select": false, "click_handler": this.view_func}

            ]];

        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs
    }

    render() {
        return (
            <LibraryPane usable_height={this.props.usable_height}
                         usable_width={this.props.usable_width}
                         res_type="list"
                         button_groups={this.button_groups}
                         search_inside={false}
                         search_metadata={false}
            />
        )
    }
}

ListPane.propTypes = {
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

class CodePane extends React.Component {

    view_func() {

    }

    get button_groups() {
        let bgs = [
            [{"name_text": "open", "icon_name": "book-open", "multi_select": false, "click_handler": this.view_func},
                {"name_text": "rename", "icon_name": "edit", "multi_select": false, "click_handler": this.view_func}

            ]];

        for (let bg of bgs) {
            for (let but of bg) {
                but.click_handler = but.click_handler.bind(this)
            }
        }
        return bgs
    }

    render() {
        return (
            <LibraryPane usable_height={this.props.usable_height}
                         usable_width={this.props.usable_width}
                         res_type="code"
                         button_groups={this.button_groups}
                         search_inside={false}
                         search_metadata={false}
            />
        )
    }
}

CodePane.propTypes = {
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

_library_home_main();