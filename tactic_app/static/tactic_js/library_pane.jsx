import {get_all_parent_tags, TagButtonList} from "./tag_buttons_react.js";
import {CombinedMetadata} from "./react_mdata_fields.js";
import {SearchForm, SelectorTable} from "./library_widgets.js";
import {HorizontalPanes, VerticalPanes} from "./resizing_layouts.js";
import {showModalReact, showConfirmDialogReact} from "./modal_react.js";

export {LibraryPane}

class LibraryPane extends React.Component {

    constructor(props) {
        super(props);
        this.top_ref = React.createRef();
        this.state = {
            data_list: [],
            mounted: false,
            left_width: this.props.usable_width / 2 - 100,
            top_pane_height: this.props.usable_height / 2 - 50,
            match_list: [],
            tag_list: [],
            sorting_column: null,
            sorting_field: null,
            sorting_direction: null,
            selected_resource: {"name": "", "tags": "", "notes": "", "updated": "", "created": ""},
            multi_select: false,
            list_of_selected: [],
            list_of_selected_funcs: [],
            search_field_value: "",
            search_inside_checked: false,
            search_metadata_checked: false,
            show_animations: false
        };
        doBinding(this);
        if (props.tsocket != null) {
            props.tsocket.socket.on(`update-${props.res_type}-selector-row`, this._handleRowUpdate);
            props.tsocket.socket.on(`refresh-${props.res_type}-selector`, this._refresh_func);
        }
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
        let path;
        if (this.props.is_repository) {
            path = "repository_resource_list_with_metadata"
        }
        else {
            path = "resource_list_with_metadata"
        }
        postAjax(`${path}/${this.props.res_type}`, {}, function(data) {
            self.setState({"data_list": data.data_list}, () => {
                self.update_tag_list();
                self._update_match_lists();
                self._set_sort_state("updated", "updated_for_sort", "descending", true);
            });

            }
        )
    }

    _handleRowUpdate(res_dict) {
        let res_name = res_dict.name;
        let ind = this.get_data_list_index(res_name);
        if (ind == -1) {
            this._animation_phase(() => {this._add_new_row(res_dict)})
        }
        else {
            let new_data_list = [...this.state.data_list];
            let the_row = new_data_list[ind];
            for (let field in res_dict) {
                the_row[field] = res_dict[field];
            }
            if (res_name == this.state.selected_resource.name) {
                this.setState({"selected_resource": the_row})
            }
            this.setState({ "data_list": new_data_list }, () => {
                this._update_match_lists();
                this.update_tag_list();
            });
        }
    }

    delete_row(name) {
        let ind = this.get_data_list_index(name);
        let new_data_list = [...this.state.data_list];
        new_data_list.splice(ind, 1);
        this.setState({data_list: new_data_list}, this.update_tag_list);
    }

    get_data_list_entry(name) {
        for (let it of this.state.data_list) {
            if (it.name == name) {
                return it
            }
        }
        return null
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

    get_data_list_index(name) {
        return this.state.data_list.findIndex((rec) => (rec.name == name))
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
                self.setState({"data_list": new_data_list}, () => {
                    self._update_match_lists();
                    self.update_tag_list();
                })
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
                self.setState({data_list: new_data_list}, () => {
                    self._update_match_lists();
                    self.update_tag_list();
                })
            })
            .catch(doFlash)
    }

    _handleMetadataChange(changed_state_elements) {
        if (!this.state.multi_select) {
            let revised_selected_resource = Object.assign({}, this.state.selected_resource);
            revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);
            if (Object.keys(changed_state_elements).includes("tags")) {
                revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");
                this.setState({selected_resource: revised_selected_resource},
                    this._saveFromSelectedResource)
            }
            else {
                this.setState({selected_resource: revised_selected_resource})
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

    addOneTag(res_name, the_tag) {
        let dl_entry = this.get_data_list_entry(res_name);
        if (dl_entry.tags.split(' ').includes(the_tag)) return;
        let new_tags = dl_entry.tags + " " + the_tag;
        new_tags = new_tags.trim();
        let result_dict = {"res_type": this.props.res_type,
            "res_name": res_name,
            "tags": new_tags,
            "notes": dl_entry.notes};

        let self = this;
        postAjaxPromise("save_metadata", result_dict)
            .then(function () {
                self._handleRowUpdate({"name": res_name, "tags": new_tags})
                })
            .catch(doFlash)
    }

    _handleAddTag(res_name, the_tag) {
        if (this.state.list_of_selected.includes(res_name) && this.state.multi_select) {
            for (let the_name of this.state.list_of_selected) {
                this.addOneTag(the_name, the_tag)
            }
            let selected_tags = this.state.selected_resource.tags;
            if (!selected_tags.includes(the_tag)) {
                selected_tags = selected_tags + " " + the_tag;
                selected_tags = selected_tags.trim();
                let new_selected_resource = this.state.selected_resource;
                new_selected_resource["tags"] = selected_tags;
                this.setState({"selected_resource": new_selected_resource})
            }
        }
        else {
            this.addOneTag(res_name, the_tag)
        }

    }

    _handleSplitResize(left_width, right_width, width_fraction) {
        this.setState({"left_width": left_width - 50})
    }

    _doTagDelete(tag) {
        const result_dict = {"res_type": this.props.res_type, "tag": tag};
        let self = this;
        postAjaxPromise("delete_tag", result_dict)
            .then(function(data) {
                self._refresh_func()
            })
            .catch(doFlash)
    }

    get view_views() {
        return {collection: "/main/",
            project: "/main_project/",
            tile: "/last_saved_view/",
            list: "/view_list/",
            code: "/view_code/"
        }
    }

      _doTagRename(tag_changes) {
        const result_dict = {"res_type": this.props.res_type, "tag_changes": tag_changes};
        let self = this;
        postAjaxPromise("rename_tag", result_dict)
            .then(function (data) {
                self._refresh_func()
            })
            .catch(doFlash)
    }

    _handleRowDoubleClick(row_dict) {
        let view_view = this.view_views[this.props.res_type];
        this.setState({
                selected_resource: row_dict,
                multi_select: false,
                list_of_selected: [row_dict.name]
        });
        window.open($SCRIPT_ROOT + view_view + row_dict.name)
    }

    _handleRowClick(row_dict, shift_key_down=false) {
        if (!this.state.multi_select &&
            this.state.selected_resource.name != "" &&
            (this.state.selected_resource.notes != this.get_data_list_entry(this.state.selected_resource.name).notes)) {
            this._saveFromSelectedResource()
        }
        if (shift_key_down && (row_dict.name != this.state.selected_resource.name)) {
            window.getSelection().removeAllRanges();  // Without this intervening text is highlighted.
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
                multi_select_list = [this.state.selected_resource.name, row_dict.name];
            }

            let new_selected_resource = {name: "__multiple__", tags: common_tags.join(" "), notes: ""};
            this.setState({multi_select: true,
                selected_resource: new_selected_resource,
                list_of_selected: multi_select_list
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

    _update_search_state(new_state) {
        this.setState(new_state, this._update_match_lists)
    }

    update_tag_list() {
        let tag_list = [];
        for (let rec of this.state.data_list) {
            if (rec.tags == "") continue;
            let rtags = rec.tags.split(" ");
            for (let tag of rtags) {
                if (!tag_list.includes(tag)) {
                    tag_list.push(tag)
                }
            }
        }
        this.setState({"tag_list": tag_list})
    }

    _update_match_lists() {
        if (this.state.search_field_value == "") {
            this.match_all()
        }
        else if (this.state.search_inside_checked) {
            this.doSearchInside(this.state.search_field_value, this.state.search_metadata_checked)
        }
        else if (this.state.search_metadata_checked){
            this.doSearchMetadata(this.state.search_field_value)
        }
        else {
            let new_match_list = [];
            for (let rec of this.state.data_list) {
                if (this._filter_func(rec, this.state.search_field_value)) {
                    new_match_list.push(rec.name)
                }
            }
            this.setState({"match_list": new_match_list})
        }
    }

    _sort_data_list() {
        if (this.state.data_list.length == 0) return;
        if (this.state.sorting_field == null) return this.state.data_list;
        let sort_field = this.state.sorting_field;
        let direction = this.state.sorting_direction;
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

    _set_sort_state(column_name, sort_field, direction,) {

        this.setState({sorting_column: column_name, sorting_field: sort_field, sorting_direction: direction},
            this._sort_data_list)
    }

    _refresh_for_new_data_list() {
        this._update_match_lists();
        this._sort_data_list();
        this.update_tag_list();
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

    _view_func(e, the_view=null) {
        if (the_view == null) {
            the_view = this.view_views[this.props.res_type]
        }
        if (!this.state.multi_select) {
            window.open($SCRIPT_ROOT + the_view + this.state.selected_resource.name)
        }
    }

    _add_new_row(new_row) {
        let new_data_list = [...this.state.data_list];
        new_data_list.push(new_row);
        this.setState({data_list: new_data_list}, this._refresh_for_new_data_list)
    }

    _duplicate_func (duplicate_view) {
        let res_type = this.props.res_type;
        let res_name = this.state.selected_resource.name;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function(data) {
            showModalReact(`Duplicate ${res_type}`, "New Name",
                DuplicateResource, res_name, data.resource_names)
            }
        );
        let self = this;
        function DuplicateResource(new_name) {
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": res_name
            };
            postAjaxPromise(duplicate_view, result_dict)
                .then((data) => {
                    self._animation_phase(() => {self._add_new_row(data.new_row)})
                })
                .catch(doFlash)
        }
    }

    _animation_phase(func_to_animate) {
        this.setState({"show_animations": true});
        func_to_animate();
        this.setState({"show_animations": false})
    }

    _delete_func (delete_view) {
        var res_type = this.props.res_type;
        var res_names = this.state.list_of_selected;
        var confirm_text;
        if (res_names.length==1) {
            let res_name = res_names[0];
            confirm_text = `Are you sure that you want to delete ${res_name}?`;
        }
        else {
            confirm_text = `Are you sure that you want to delete multiple items?`;
        }
        let self = this;
        showConfirmDialogReact(`Delete ${res_type}`, confirm_text, "do nothing", "delete", function () {
            postAjaxPromise(delete_view, {"resource_names": res_names})
                .then(() => {
                    for (let i = 0; i < res_names.length; ++i) {
                        self._animation_phase(() => {
                                self.delete_row(res_names[i]);
                            })
                    }
                    self._refresh_for_new_data_list()
                })
                .catch(doFlash);
        })
    }

    _rename_func () {
        let res_type = this.props.res_type;
        let res_name = this.state.selected_resource.name;
        let self = this;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function(data) {
                const res_names = data["resource_names"];
                const index = res_names.indexOf(res_name);
                if (index >= 0) {
                    res_names.splice(index, 1);
                }
                showModalReact(`Rename ${res_type}`, "New Name", RenameResource, res_name, res_names)
            }
        );
        function RenameResource(new_name) {
            const the_data = {"new_name": new_name};
            postAjax(`rename_resource/${res_type}/${res_name}`, the_data, renameSuccess);
            function renameSuccess(data) {
                if (!data.success) {
                    doFlash(data);
                    return false
                }
                else {
                    let ind = self.get_data_list_index(res_name);
                    let new_data_list = [...self.state.data_list];
                    new_data_list[ind].name = new_name;
                    self.setState({data_list: new_data_list}, self._refresh_for_new_data_list)
                }
            }
        }
    }

    _repository_copy_func () {
        let res_type = this.props.res_type;
        let res_name = this.state.selected_resource.name;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function (data) {
                showModalReact("Import " + res_type, "New Name", ImportResource, res_name, data["resource_names"])
            }
        );
        function ImportResource(new_name) {
            const result_dict = {
                "res_type": res_type,
                "res_name": res_name,
                "new_res_name": new_name
            };
            postAjaxPromise("/copy_from_repository", result_dict)
                .then(doFlash)
                .catch(doFlash);
        }

        return res_name
    }

    send_repository_func () {
        let res_type = this.props.res_type;

        $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/" + res_type, function(data) {
            showModalReact(`Share ${res_type}`, `New ${res_type} Name`, ShareResource, res_name, data["resource_names"])
            }
        );
        function ShareResource(new_name) {
            const result_dict = {
                "res_type": res_type,
                "res_name": res_name,
                "new_res_name": new_name
            };
            postAjaxPromise('/send_to_repository', result_dict)
                .then(doFlash)
                .catch(doFlash);
        }
        return res_name
    }

    _refresh_func() {
        this.componentDidMount()
    }

    _handleTopRightPaneResize (top_height, bottom_height, top_fraction) {
        this.setState({"top_pane_height": top_height
        })
    }

    render() {
        let available_width = this.get_width_minus_left_offset(this.top_ref);
        let available_height = this.get_height_minus_top_offset(this.top_ref);
        let new_button_groups;

        const primary_mdata_fields = ["name", "created", "created_for_sort", "updated",  "updated_for_sort", "tags", "notes"];
        let additional_metadata = {};
        for (let field in this.state.selected_resource) {
            if (!primary_mdata_fields.includes(field)) {
                additional_metadata[field] = this.state.selected_resource[field]
            }
        }
        if (Object.keys(additional_metadata).length == 0) {
            additional_metadata = null
        }

        let right_pane;
        let mdata_element = (
                <CombinedMetadata tags={this.state.selected_resource.tags.split(" ")}
                                  name={this.state.selected_resource.name}
                                  created={this.state.selected_resource.created}
                                  updated={this.state.selected_resource.updated}
                                  notes={this.state.selected_resource.notes}
                                  handleChange={this._handleMetadataChange}
                                  res_type={this.props.res_type}
                                  outer_style={{"marginLeft": 20, "marginTop": 120}}
                                  handleNotesBlur={this.state.multi_select ? null : this._saveFromSelectedResource}
                                  additional_metadata={additional_metadata}
                />
         );

        if (this.props.aux_pane == null) {
            right_pane = mdata_element;
        }
        else {
            right_pane = (
                <VerticalPanes available_height={available_height}
                               available_width={available_width - this.state.left_width - 25}
                               top_pane={mdata_element}
                               bottom_pane={this.props.aux_pane}
                               handleSplitUpdate={this._handleTopRightPaneResize}
                >
                </VerticalPanes>

            )
        }
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
                                       handleSearchFromTag={this._handleSearchFromTag}
                                       handleAddTag={this._handleAddTag}
                                       doTagDelete={this._doTagDelete}
                                       doTagRename={this._doTagRename}
                        />
                    </div>
                    <div className="d-flex flex-column">
                        <ToolbarClass selected_resource={this.state.selected_resource}
                                      multi_select={this.state.multi_select}
                                      list_of_selected={this.state.list_of_selected}
                                      view_func={this._view_func}
                                      repository_copy_func={this._repository_copy_func}
                                      duplicate_func={this._duplicate_func}
                                      refresh_func={this._refresh_func}
                                      delete_func={this._delete_func}
                                      rename_func={this._rename_func}
                                      animation_phase={this._animation_phase}
                                      add_new_row={this._add_new_row}
                                      />
                        <SearchForm allow_search_inside={this.props.allow_search_inside}
                                    allow_search_metadata={this.props.allow_search_metadata}
                                    update_search_state={this._update_search_state}
                                    search_field_value={this.state.search_field_value}
                                    search_inside_checked={this.state.search_inside_checked}
                                    search_metadata_checked={this.state.search_metadata_checked}
                        />
                        <div style={th_style} id={`${this.props.res_type}-table`}>
                            <SelectorTable data_list={filtered_data_list}
                                           sorting_column={this.state.sorting_column}
                                           handleHeaderCellClick={this._set_sort_state}
                                           selected_resource_names={this.state.list_of_selected}
                                           handleRowClick={this._handleRowClick}
                                           handleRowDoubleClick={this._handleRowDoubleClick}
                                           handleArrowKeyPress={this._handleArrowKeyPress}
                                           handleAddTag={this._handleAddTag}
                                           show_animations={this.state.show_animations}
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
    ToolbarClass: PropTypes.func,
    is_repository: PropTypes.bool,
    tsocket: PropTypes.object,
    aux_pane: PropTypes.object
};

LibraryPane.defaultProps = {
    is_repository: false,
    tsocket: null,
    aux_pane: null
};