

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
            selected_resource: {"name": "", "tags": "", "notes": "", "updated": "", "created": ""},
            data_list: [],
            mounted: false,
            multi_select: false,
            list_of_selected: [],
            left_width: this.props.usable_width / 2 - 25,
            match_list: [],
            search_field_value: "",
            search_inside_checked: false,
            search_metadata_checked: false
        };
        this.handleSplitResize = this.handleSplitResize.bind(this);
        this.sortOnField = this.sortOnField.bind(this);
        this.handleRowClick = this.handleRowClick.bind(this);
        this.handleMetadataChange = this.handleMetadataChange.bind(this);
        this.saveFromSelectedResource = this.saveFromSelectedResource.bind(this);
        this.handleSearchFieldChange = this.handleSearchFieldChange.bind(this);
        this.handleClearSearch = this.handleClearSearch.bind(this);
        this.handleSearchInsideChange = this.handleSearchInsideChange.bind(this);
        this.handleSearchMetadataChange = this.handleSearchMetadataChange.bind(this);
        this.filter_func = this.filter_func.bind(this);
        this.filter_on_match_list = this.filter_on_match_list.bind(this)
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

    set_in_data_list(names, new_val_dict, data_list) {
        let new_data_list = [];

        for (let it of data_list) {
            if (names.includes(it.name)){
                for (let k in new_val_dict) {
                    it[k] = new_val_dict[k]
                }
            }
            new_data_list.push(it)
        }
        return new_data_list
    }

    get_data_list_entry(name) {
        for (let it of this.state.data_list) {
            if (it.name == name) {
                return it
            }
        }
        return null
    }

    saveFromSelectedResource() {
        const result_dict = {"res_type": this.props.res_type,
            "res_name": this.state.list_of_selected[0],
            "tags": this.state.selected_resource.tags,
            "notes": this.state.selected_resource.notes};
        let saved_selected_resource = Object.assign({}, this.state.selected_resource);
        let saved_list_of_selected = [...this.state.list_of_selected];

        let self = this;
        postAjaxPromise("save_metadata", result_dict)
            .then(function (data) {
                let new_data_list = self.set_in_data_list(saved_list_of_selected,
                    saved_selected_resource,
                    self.state.data_list);
                self.setState({"data_list": new_data_list})
            })
        .catch(doFlash)
    }

    overwriteCommonTags() {
        const result_dict = {"res_type": this.props.res_type,
                            "res_names": this.state.list_of_selected,
                             "tags": this.state.selected_resource.tags,};
        const self = this;
        postAjaxPromise("overwrite_common_tags", result_dict)
            .then(function(data) {
                let utags = data.updated_tags;
                let new_data_list = [...self.state.data_list];
                for (let res_name in utags) {
                    new_data_list = self.set_in_data_list([res_name],
                        {tags: utags[res_name]}, new_data_list);
                }
                self.setState({data_list: new_data_list})
            })
            .catch(doFlash)
    }

    handleMetadataChange(changed_state_elements) {
        if (!this.state.multi_select) {
            let revised_selected_resource = Object.assign({}, this.state.selected_resource);
            revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);
            if (Object.keys(changed_state_elements).includes("tags")) {
                revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");
                this.setState({selected_resource: revised_selected_resource}, this.saveFromSelectedResource)
            }
            else {
                this.setState({selected_resource: revised_selected_resource})
            }
        }
        else {
            let revised_selected_resource = Object.assign({}, this.state.selected_resource);
            revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);
            revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");
            this.setState({selected_resource: revised_selected_resource}, this.overwriteCommonTags)
        }
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
        let new_data_list = [...this.state.data_list];
        new_data_list.sort(compare_func);
        this.setState({data_list: new_data_list, selected_resource: new_data_list[0],
            list_of_selected: [new_data_list[0].name],
            multi_select: false
        })
    }

    handleSplitResize(left_width, right_width, width_fraction) {
        this.setState({"left_width": left_width - 50})
    }

    handleRowClick(row_dict, shift_key_down=false) {
        if (!this.state.multi_select &&
            (this.state.selected_resource.notes != this.get_data_list_entry(this.state.selected_resource.name).notes)) {
            this.saveFromSelectedResource()
        }
        if (shift_key_down && (row_dict.name != this.state.selected_resource.name)) {
            let common_tags = [];
            let new_tag_list = row_dict.tags.split(" ");
            let old_tag_list = this.state.selected_resource.tags.split(" ");
            for (let tag of new_tag_list) {
                if (old_tag_list.includes(tag)) {
                    common_tags.push(tag)
                }
            }
            let multi_select_list;
            if (this.state.multi_select) {
                multi_select_list = [...this.state.list_of_selected, row_dict.name];
            }
            else {
                multi_select_list = [this.state.selected_resource.name, row_dict.name]
            }

            let new_selected_resource = {name: "__multiple__", tags: common_tags.join(" "), notes: ""};
            this.setState({multi_select: true,
                selected_resource: new_selected_resource,
                list_of_selected: multi_select_list,
            })
        }
        else {
            this.setState({
                selected_resource: row_dict,
                multi_select: false,
                list_of_selected: [row_dict.name]
            })
        }


    }

    update_match_lists() {
        if (this.state.search_inside_checked) {
                this.doSearchInside(this.state.search_metadata_checked)
            }
        else if (this.state.search_metadata_checked){
            this.doSearchMetadata()
        }
        else {
            this.setState({"match_list": []})
        }
    }

    handleSearchFieldChange(event) {
        this.setState({"search_field_value": event.target.value}, this.update_match_lists);

    }


    handleClearSearch() {
        this.setState({"search_field_value": ""}, this.update_match_lists)
    }

    doSearchMetadata() {
        let self = this;
        let search_info ={"search_text": this.state.search_field_value};
        postAjaxPromise(this.props.search_metadata_view, search_info)
            .then((data) => {
                var match_list = data.match_list;
                self.setState({
                    "match_list": match_list,
                    "search_metadata_checked": true
                })
            })
            .catch(doFlash);
    }

    handleSearchMetadataChange(event) {
        let search_info ={"search_text": this.state.search_field_value};
        let self = this;
        this.setState({"search_metadata_checked": event.target.checked},
            this.update_match_lists
        )
    }

    doSearchInside(search_metadata_also) {
        let search_info ={"search_text": this.state.search_field_value};
        let self = this;
        postAjaxPromise(this.props.search_inside_view, search_info)
            .then((data) => {
                var match_list = data.match_list;
                if (search_metadata_also) {
                    postAjaxPromise(self.props.search_metadata_view, search_info)
                        .then((data) => {
                            match_list = match_list.concat(data.match_list);
                            self.setState({"match_list": match_list,
                                "search_inside_checked": true,
                                "search_metadata_checked": true})
                            })
                        .catch(doFlash);
                }
                else {
                    self.setState({
                        "match_list": match_list,
                        "search_inside_checked": true,
                        "search_metadata_checked": false
                    })
                }
            })
            .catch(doFlash);
    }

    handleSearchInsideChange(event) {
        this.setState({"search_inside_checked": event.target.checked},
            this.update_match_lists)
    }

    filter_func(resource_dict) {
        return resource_dict.name.toLowerCase().search(this.state.search_field_value) != -1
    }

    filter_on_match_list(resource_dict) {
        return this.state.match_list.includes(resource_dict.name)
    }

    render() {
        let available_width = this.get_width_minus_left_offset(this.top_ref);
        let available_height = this.get_height_minus_top_offset(this.top_ref);

        let right_pane = (
                <CombinedMetadata tags={this.state.selected_resource.tags.split(" ")}
                                  created={this.state.selected_resource.created}
                                  notes={this.state.selected_resource.notes}
                                  handleChange={this.handleMetadataChange}
                                  res_type={this.props.res_type}
                                  handleNotesBlur={this.state.multi_select ? null : this.saveFromSelectedResource}
                />
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
        let filtered_data_list;
        if (this.state.filter_view_value == "") {
            filtered_data_list = this.state.data_list
        }
        else if (this.state.search_metadata_checked || this.state.search_inside_checked) {
            filtered_data_list = this.state.data_list.filter(this.filter_on_match_list)
        }
        else {
            filtered_data_list = this.state.data_list.filter(this.filter_func)
        }

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
                                    allow_search_inside={this.props.allow_search_inside}
                                    allow_search_metadata={this.props.allow_search_metadata}
                                    onChange={this.handleSearchFieldChange}
                                    handleSearchInsideChange={this.handleSearchInsideChange}
                                    handleSearchMetadataChange={this.handleSearchMetadataChange}
                                    search_field_value={this.state.search_field_value}
                        />
                        <div style={th_style}>
                            <SelectorTable data_list={filtered_data_list}
                                           handleHeaderCellClick={this.sortOnField}
                                           selected_resource_names={this.state.list_of_selected}
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
    allow_search_inside: PropTypes.bool,
    allow_search_metadata: PropTypes.bool,
    search_inside_view: PropTypes.string,
    search_metadata_view: PropTypes.string
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
                         allow_search_inside={false}
                         allow_search_metadata={false}
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
                         allow_search_inside={false}
                         allow_search_metadata={true}
                         search_metadata_view="search_project_metadata"
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
                         allow_search_inside={true}
                         allow_search_metadata={true}
                         search_inside_view="search_inside_tiles"
                         search_metadata_view="search_tile_metadata"
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
                         allow_search_inside={true}
                         allow_search_metadata={true}
                         search_inside_view="search_inside_lists"
                         search_metadata_view="search_list_metadata"
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
                         allow_search_inside={true}
                         allow_search_metadata={true}
                         search_inside_view="search_inside_code"
                         search_metadata_view="search_code_metadata"
            />
        )
    }
}

CodePane.propTypes = {
    usable_height: PropTypes.number,
    usable_width: PropTypes.number
};

_library_home_main();