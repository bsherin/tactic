import {SearchForm, BpSelectorTable} from "./library_widgets.js";
import {HorizontalPanes} from "./resizing_layouts.js";

import {postAjax} from "./communication_react.js";
import {getUsableDimensions} from "./sizing_tools.js";

export {AdminPane}

let Bp = blueprint;
let Bpt = bptable;

class AdminPane extends React.Component {

    constructor(props) {
        super(props);
        this.top_ref = React.createRef();
        this.table_ref = React.createRef();
        let aheight = getUsableDimensions().usable_height;
        let awidth = getUsableDimensions().usable_width - 170;
        this.state = {
            data_list: [],
            mounted: false,
            available_height: aheight,
            available_width: awidth,
            top_pane_height: aheight / 2 - 50,
            match_list: [],
        };
        doBinding(this);
        if (props.tsocket != null) {
            props.tsocket.socket.on(`update-${props.res_type}-selector-row`, this._handleRowUpdate);
            props.tsocket.socket.on(`refresh-${props.res_type}-selector`, this._refresh_func);
        }
    }

     _onTableSelection(regions) {
        if (regions.length == 0) return;  // Without this get an error when clicking on a body cell
        let selected_rows = [];
        let revised_regions = [];
        for (let region of regions) {
            if (region.hasOwnProperty("rows")) {
                let first_row = region["rows"][0];
                revised_regions.push(Bpt.Regions.row(first_row));
                let last_row = region["rows"][1];
                for (let i=first_row; i<=last_row; ++i) {
                    selected_rows.push(this.state.data_list[i]);
                    revised_regions.push(Bpt.Regions.row(i));
                }
            }
        }
        this._handleRowSelection(selected_rows);
        this._updatePaneState({selectedRegions: revised_regions});
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
        path = "admin_list_with_metadata";
        postAjax(`${path}/${this.props.res_type}`, {}, function(data) {
            self.setState({"data_list": data.data_list}, () => {
                self._update_match_lists();
                // I need the next line to force a resize update
                self._set_sort_state(self.props.sorting_column, self.props.sorting_field, self.props.sorting_direction)
            });

            }
        )
    }

    _handleRowUpdate(res_dict) {
        let res_name = res_dict[this.props.id_field];
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
            if (res_name == this.props.selected_resource[this.props.id_field]) {
                this.props.updatePaneState({"selected_resource": the_row})
            }
            this.setState({ "data_list": new_data_list }, () => {
                this._update_match_lists();
            });
        }
    }

    _updatePaneState(new_state, callback) {
        this.props.updatePaneState(this.props.res_type, new_state, callback)
    }

    set_in_data_list(names, new_val_dict, data_list) {
        let new_data_list = [];

        for (let it of data_list) {
            if (names.includes(it[this.props.id_field])){
                for (let k in new_val_dict) {
                    it[k] = new_val_dict[k]
                }
            }
            new_data_list.push(it)
        }
        return new_data_list
    }

    get_data_list_index(name) {
        return this.state.data_list.findIndex((rec) => (rec[this.props.id_field] == name))
    }

    _delete_row(idval) {
        let ind = this.get_data_list_index(idval);
        let new_data_list = [...this.state.data_list];
        new_data_list.splice(ind, 1);
        this.setState({data_list: new_data_list});
    }

    get_data_list_entry(Id) {
        for (let it of this.state.data_list) {
            if (it[this.props.id_field] == Id) {
                return it
            }
        }
        return null
    }


    _handleSplitResize(left_width, right_width, width_fraction) {
        this._updatePaneState({left_width_fraction: width_fraction})
    }

    _handleRowClick(row_dict, shift_key_down=false) {
        this._updatePaneState({
            selected_resource: row_dict,
            multi_select: false,
            list_of_selected: [row_dict[this.props.id_field]]
        })

    }

    _handleRowSelection(selected_rows) {
         let row_dict = selected_rows[0];
        this._updatePaneState({
            selected_resource: row_dict,
            multi_select: false,
            list_of_selected: [row_dict.name]
        })
    }

    _filter_func(resource_dict, search_field_value) {
        for (let key in resource_dict) {
            if (resource_dict[key].toLowerCase().search(search_field_value) != -1){
                return true
            }
        }
        return resource_dict[this.props.id_field].toLowerCase().search(search_field_value) != -1
    }

    get all_ids() {
        return this.state.data_list.map((rec) => rec[this.props.id_field]);
    }

    match_all() {
        let new_match_list = this.all_ids;
        this.setState({"match_list": new_match_list})
    }

    _update_search_state(new_state) {
        new_state.search_from_field = true;
        new_state.search_from_tags = false;
        this._updatePaneState(new_state, this._update_match_lists)
    }

    _update_match_lists() {
        if (this.props.search_field_value == "") {
            this.match_all()
        }
        else {
            let new_match_list = [];
            for (let rec of this.state.data_list) {
                if (this._filter_func(rec, this.props.search_field_value)) {
                    new_match_list.push(rec[this.props.id_field])
                }
            }
            this.setState({"match_list": new_match_list})
        }
    }

    _sort_data_list() {
        if (this.props.sorting_field == null) return this.state.data_list;
        let sort_field = this.props.sorting_field;
        let direction = this.props.sorting_direction;
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

        this._updatePaneState({
            selected_resource: new_data_list[0],
            list_of_selected: [new_data_list[0][this.props.id_field]],
            multi_select: false}
        );

     this.setState({data_list: new_data_list})
    }

    _set_sort_state(column_name, sort_field, direction,) {

        this._updatePaneState({sorting_column: column_name, sorting_field: sort_field, sorting_direction: direction},
            this._sort_data_list)
    }

    _refresh_for_new_data_list() {
        this._update_match_lists();
        this._sort_data_list();
    }

    _filter_on_match_list(resource_dict) {
        return this.state.match_list.includes(resource_dict[this.props.id_field])
    }

    _add_new_row(new_row) {
        let new_data_list = [...this.state.data_list];
        new_data_list.push(new_row);
        this.setState({data_list: new_data_list}, this._refresh_for_new_data_list)
    }

    _animation_phase(func_to_animate) {
        this.setState({"show_animations": true});
        func_to_animate();
        this.setState({"show_animations": false})
    }

    _refresh_func() {
        this.componentDidMount()
    }

    _setConsoleText(the_text) {
        this._updatePaneState({"console_text": the_text})
    }

     _handleResize(entries) {
        for (let entry of entries) {
            if (entry.target.className == "pane-holder") {
                this.setState({available_width: entry.contentRect.width - this.top_ref.current.offsetLeft,
                    available_height: entry.contentRect.height - this.top_ref.current.offsetTop
                });
                return
            }
        }

    }

    render() {
        let new_button_groups;
        let left_width = this.state.available_width * this.props.left_width_fraction;
        const primary_mdata_fields = ["name", "created", "created_for_sort", "updated",  "updated_for_sort", "tags", "notes"];
        let additional_metadata = {};
        for (let field in this.props.selected_resource) {
            if (!primary_mdata_fields.includes(field)) {
                additional_metadata[field] = this.props.selected_resource[field]
            }
        }
        if (Object.keys(additional_metadata).length == 0) {
            additional_metadata = null
        }

        let right_pane = (
                <div className="d-flex d-inline"
                     style={{verticalAlign: "top", marginTop: 120, marginLeft: 10, width: "100%", height: 412}}>
                    <pre><small>{this.props.console_text}</small></pre>
                </div>
        );
        let th_style= {
            "display": "inline-block",
            "verticalAlign": "top",
            "maxHeight": "100%",
            "overflowY": "scroll",
            "lineHeight": 1,
            "whiteSpace": "nowrap",
            "overflowX": "hidden"
        };

        let filtered_data_list = this.state.data_list.filter(this._filter_on_match_list);
        let ToolbarClass = this.props.ToolbarClass;

        let column_specs = {};
        for (let col of this.props.colnames) {
            column_specs[col] = {"sort_field": col, "first_sort": "ascending"}
        }

        let table_width;
        if (this.table_ref && this.table_ref.current) {
            table_width = left_width - this.table_ref.current.offsetLeft
        }
        else {
            table_width = left_width - 150
        }

        let left_pane = (
            <React.Fragment>
                <div className="d-flex flex-row" style={{"maxHeight": "100%"}}>
                    <div ref={this.table_ref}
                         className="d-flex flex-column"
                         style={{width: table_width, padding: 15, marginTop: 10, backgroundColor: "white"}}>
                        <SearchForm allow_search_inside={false}
                                    allow_search_metadata={false}
                                    update_search_state={this._update_search_state}
                                    search_field_value={this.props.search_field_value}
                        />
                        <BpSelectorTable data_list={filtered_data_list}
                                          sortColumn={this._set_sort_state}
                                          selectedRegions={this.props.selectedRegions}
                                          onSelection={this._onTableSelection}
                                          columns={column_specs}
                                          identifier_field={this.props.id_field}

                        />
                    </div>
                </div>
            </React.Fragment>
        );
        return (
            <Bp.ResizeSensor onResize={this._handleResize} observeParents={true}>
                <div ref={this.top_ref} className="d-flex flex-column mt-4" >
                    <ToolbarClass selected_resource={this.props.selected_resource}
                                          list_of_selected={this.props.list_of_selected}
                                          setConsoleText={this._setConsoleText}
                                          animation_phase={this._animation_phase}
                                          delete_row={this._delete_row}
                                          refresh_func={this._refresh_func}
                                          />
                    <HorizontalPanes
                        left_pane={left_pane}
                        right_pane={right_pane}
                        available_width={this.state.available_width}
                        available_height={this.state.available_height}
                        initial_width_fraction={.65}
                        handleSplitUpdate={this._handleSplitResize}
                    />
                </div>
            </Bp.ResizeSensor>
        )
    }
}

AdminPane.propTypes = {
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
    colnames: PropTypes.array,
    id_field: PropTypes.string
};

AdminPane.defaultProps = {
    is_repository: false,
    tsocket: null
};