import {get_all_parent_tags, TagButtonList} from "./tag_buttons_react.js";
import {CombinedMetadata} from "./react_mdata_fields.js";
import {SearchForm, SelectorTable} from "./library_widgets.js";
import {HorizontalPanes} from "./resizing_layouts.js";
import {showModalReact} from "./modal_react.js";

export {LibraryPane}

class LibraryPane extends React.Component {

    constructor(props) {
        super(props);
        this.top_ref = React.createRef();
        this.state = {
            data_list: [],
            mounted: false,
            left_width: this.props.usable_width / 2 - 100,
            match_list: [],
            tag_list: [],
            selected_resource: {"name": "", "tags": "", "notes": "", "updated": "", "created": ""},
            multi_select: false,
            list_of_selected: []
        };
        doBinding(this);
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
            self.setState({"data_list": data.data_list}, () => {
                self._update_match_lists("", false, false);
                self._sortOnField("updated_for_sort", "descending");
                $.getJSON(`${$SCRIPT_ROOT}/request_update_tag_list/${self.props.res_type}`, function (data) {
                    self.setState({"tag_list": data.tag_list})
                })
            });

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

    _saveFromSelectedResource() {
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

    _handleMetadataChange(changed_state_elements) {
        if (!this.props.multi_select) {
            let revised_selected_resource = Object.assign({}, this.state.selected_resource);
            revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);
            if (Object.keys(changed_state_elements).includes("tags")) {
                revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");
                this.setState({selected_resource: revised_selected_resource},
                    this._saveFromSelectedResource)
            }
            else {
                this.props.update_selected({selected_resource: revised_selected_resource})
            }
        }
        else {
            let revised_selected_resource = Object.assign({}, this.state.selected_resource);
            revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);
            revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");
            this.setState({selected_resource: revised_selected_resource},
                    this.overwriteCommonTags);
        }
    }

    _sortOnField(sort_field, direction) {
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
        this.setState({
            selected_resource: new_data_list[0],
            list_of_selected: [new_data_list[0].name],
            multi_select: false}
        );
        this.setState({data_list: new_data_list})
    }

    _handleSplitResize(left_width, right_width, width_fraction) {
        this.setState({"left_width": left_width - 50})
    }

    _handleRowClick(row_dict, shift_key_down=false) {
        if (!this.state.multi_select &&
            (this.state.selected_resource.notes != this.get_data_list_entry(this.state.selected_resource.name).notes)) {
            this._saveFromSelectedResource()
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

    _handleMatchListUpdate(match_list) {
        this.setState({"match_list": match_list})
    }

    _filter_func(resource_dict, search_field_value) {
            return resource_dict.name.toLowerCase().search(search_field_value) != -1
    }

    get all_names() {
        return this.state.data_list.map((rec) => rec.name);
    }

    match_all() {
        let new_match_list = this.all_names;
        this.setState({"match_list": new_match_list})
    }

    _update_match_lists(search_field_value, search_inside, search_metadata) {
        if (search_field_value == "") {
            this.match_all()
        }
        else if (search_inside) {
                this.doSearchInside(search_field_value, search_metadata)
            }
        else if (search_metadata){
            this.doSearchMetadata(search_field_value)
        }
        else {
            let new_match_list = [];
            for (let rec of this.state.data_list) {
                if (this._filter_func(rec, search_field_value)) {
                    new_match_list.push(rec.name)
                }
            }
            this.setState({"match_list": new_match_list})
        }
    }

    doSearchMetadata(search_field_value) {
        let self = this;
        let search_info ={"search_text": search_field_value};
        postAjaxPromise(this.props.search_metadata_view, search_info)
            .then((data) => {
                var match_list = data.match_list;
                self.setState({"match_list": match_list})
            })
            .catch(doFlash);
    }

    doSearchInside(search_field_value, search_metadata_also) {
        let search_info ={"search_text": search_field_value};
        let self = this;
        postAjaxPromise(this.props.search_inside_view, search_info)
            .then((data) => {
                var match_list = data.match_list;
                if (search_metadata_also) {
                    postAjaxPromise(self.props.search_metadata_view, search_info)
                        .then((data) => {
                            match_list = match_list.concat(data.match_list);
                            self.props._handleMatchListUpdate(match_list);
                            self.setState({"match_list": match_list})
                        })
                        .catch(doFlash);
                }
                else {
                    self.setState({"match_list": match_list})
                }
            })
            .catch(doFlash);
    }

    _filter_on_match_list(resource_dict) {
        return this.state.match_list.includes(resource_dict.name)
    }

    tagMatch(search_tag, item_tags) {
        let tags_to_match = item_tags.concat(get_all_parent_tags(item_tags));
        return tags_to_match.includes(search_tag)
    }

    _handleSearchFromTag(search_tag) {
        if (search_tag == "all") {
            this.match_all();
        }
        else {
            let new_match_list = [];
            for (let rec of this.state.data_list) {
                let rtags = rec.tags.toLowerCase().split(" ");
                if (this.tagMatch(search_tag, rtags)) {
                    new_match_list.push(rec.name)
                }
            }
            this.setState({"match_list": new_match_list})
        }

    }

    _handleArrowKeyPress(key) {
        if (this.state.multi_select) return;
        let anames = this.all_names;
        let current_index = anames.indexOf(this.state.selected_resource.name);
        let new_index;
        let new_selected_res;
        if (key == "ArrowDown") {
            new_index =  current_index + 1;
            while (!this.state.match_list.includes(anames[new_index])) {
                new_index += 1;
                if (new_index >= anames.length) return
            }
        }
        else {
            new_index = current_index - 1;
            while (!this.state.match_list.includes(anames[new_index])) {
                new_index -= 1;
                if (new_index < 0) return
            }
        }
        this.setState({"selected_resource": this.state.data_list[new_index],
            "list_of_selected": [anames[new_index]]
        })
    }

    _view_func() {
        if (!this.state.multi_select) {
            window.open($SCRIPT_ROOT + this.props.view_view + this.state.selected_resource.name)
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

    render() {
        let available_width = this.get_width_minus_left_offset(this.top_ref);
        let available_height = this.get_height_minus_top_offset(this.top_ref);
        let new_button_groups;

        let right_pane = (
                <CombinedMetadata tags={this.state.selected_resource.tags.split(" ")}
                                  name={this.state.selected_resource.name}
                                  created={this.state.selected_resource.created}
                                  updated={this.state.selected_resource.updated}
                                  notes={this.state.selected_resource.notes}
                                  handleChange={this._handleMetadataChange}
                                  res_type={this.props.res_type}
                                  outer_style={{"marginLeft": 20, "marginTop": 120}}
                                  handleNotesBlur={this.state.multi_select ? null : this._saveFromSelectedResource}
                />
        );
        let th_style= {
            "display": "inline-block",
            "verticalAlign": "top",
            "maxHeight": "100%",
            "overflowY": "scroll",
            "lineHeight": 1,
            "whiteSpace": "nowrap",
            "width": this.state.left_width - 150,
            "overflowX": "hidden"
        };

        let filtered_data_list = this.state.data_list.filter(this._filter_on_match_list);
        let ToolbarClass = this.props.ToolbarClass;

        let left_pane = (
            <React.Fragment>
                <div className="d-flex flex-row" style={{"maxHeight": "100%"}}>
                    <div className="d-flex justify-content-around" style={{"width": 150}}>
                        <TagButtonList res_type={this.props.res_type}
                                       tag_list={this.state.tag_list}
                                       handleSearchFromTag={this._handleSearchFromTag}/>
                    </div>
                    <div className="d-flex flex-column">
                        <ToolbarClass selected_resource={this.state.selected_resource}
                                      multi_select={this.state.multi_select}
                                      view_func={this._view_func}
                                      duplicate_func={this._duplicate_func}
                                      />
                        <SearchForm allow_search_inside={this.props.allow_search_inside}
                                    allow_search_metadata={this.props.allow_search_metadata}
                                    _update_match_lists={this._update_match_lists}
                        />
                        <div style={th_style}>
                            <SelectorTable data_list={filtered_data_list}
                                           handleHeaderCellClick={this._sortOnField}
                                           selected_resource_names={this.state.list_of_selected}
                                           handleRowClick={this._handleRowClick}
                                           handleArrowKeyPress={this._handleArrowKeyPress}
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
                    initial_width_fraction={.65}
                    handleSplitUpdate={this._handleSplitResize}
                />
            </div>
        )
    }
}

LibraryPane.propTypes = {
    usable_height: PropTypes.number,
    usable_width: PropTypes.number,
    res_type: PropTypes.string,
    allow_search_inside: PropTypes.bool,
    allow_search_metadata: PropTypes.bool,
    search_inside_view: PropTypes.string,
    search_metadata_view: PropTypes.string,
    view_view: PropTypes.string,
    ToolbarClass: PropTypes.func
};