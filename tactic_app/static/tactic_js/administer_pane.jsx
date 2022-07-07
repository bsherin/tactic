
import React from "react";
import PropTypes from 'prop-types';

import { ResizeSensor } from "@blueprintjs/core";
import {Regions} from "@blueprintjs/table";

import {SearchForm, BpSelectorTable} from "./library_widgets.js";
import {HorizontalPanes} from "./resizing_layouts.js";

import {postAjax} from "./communication_react.js";
import {getUsableDimensions} from "./sizing_tools.js";
import {doBinding} from "./utilities_react.js";
import _ from "../js/lodash";

export {AdminPane}

class AdminPane extends React.Component {

    constructor(props) {
        super(props);
        this.top_ref = React.createRef();
        this.table_ref = React.createRef();
        this.console_text_ref = React.createRef();
        let aheight = getUsableDimensions().usable_height_no_bottom;
        let awidth = getUsableDimensions().usable_width - 170;
        this.get_url = `grab_${props.res_type}_list_chunk`;
        this.state = {
            data_dict: {},
            num_rows: 0,
            awaiting_data: false,
            mounted: false,
            available_height: aheight,
            available_width: awidth,
            top_pane_height: aheight / 2 - 50,
            total_width: 500,
        };
        doBinding(this);
        this.previous_search_spec = null;
        this.socket_counter = null;
        this.initSocket()
    }

    initSocket() {
        if (this.props.tsocket != null) {
            this.props.tsocket.attachListener(`update-${this.props.res_type}-selector-row`, this._handleRowUpdate);
            this.props.tsocket.attachListener(`refresh-${this.props.res_type}-selector`, this._refresh_func);
        }
    }

    _getSearchSpec(){
        return {
            search_string: this.props.search_string,
            sort_field: this.props.sort_field,
            sort_direction: this.props.sort_direction
        }
    }

     _onTableSelection(regions) {
        if (regions.length == 0) return;  // Without this get an error when clicking on a body cell
        let selected_rows = [];
        let revised_regions = [];
        for (let region of regions) {
            if (region.hasOwnProperty("rows")) {
                let first_row = region["rows"][0];
                revised_regions.push(Regions.row(first_row));
                let last_row = region["rows"][1];
                for (let i=first_row; i<=last_row; ++i) {
                    selected_rows.push(this.state.data_dict[i]);
                    revised_regions.push(Regions.row(i));
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
        this._grabNewChunkWithRow(0, true, null, true, null)
    }

    _grabNewChunkWithRow(row_index, flush=false, spec_update=null, select=false, select_by_name=null, callback=null) {
        let search_spec = this._getSearchSpec();
        if (spec_update) {
            search_spec = Object.assign(search_spec, spec_update)
        }
        let data = {search_spec: search_spec, row_number: row_index};
        let self = this;
        postAjax(this.get_url, data, function(data) {
            let new_data_dict;
            if (flush) {
                new_data_dict = data.chunk_dict
            }
            else {
                new_data_dict = _.cloneDeep(self.state.data_dict);
                new_data_dict = Object.assign(new_data_dict, data.chunk_dict)
            }
            self.previous_search_spec = search_spec;
            self.setState({data_dict: new_data_dict, num_rows: data.num_rows}, ()=>{
                if (callback) {
                    callback()
                }
                else if (select) {
                    self._selectRow(row_index)
                }
                else if (select_by_name) {
                    let ind = self.get_data_dict_index(select_by_name);
                    if (!ind) {
                        ind = 0
                    }
                    self._selectRow(ind)
                }
            });

        })
    }

    _initiateDataGrab(row_index) {
        this.setState({awaiting_data: true}, () => {this._grabNewChunkWithRow(row_index)})
    }

    _handleRowUpdate(res_dict) {
        let res_name = res_dict.name;
        let ind = this.get_data_dict_index(res_name);
        let new_data_dict = _.cloneDeep(this.state.data_dict);
        let the_row = new_data_dict[ind];
        for (let field in res_dict) {
            the_row[field] = res_dict[field];
        }
        if (res_name == this.props.selected_resource.name) {
            this.props.updatePaneState({"selected_resource": the_row})
        }
        let new_state = {"data_dict": new_data_dict };

        this.setState(new_state);
    }

    _updatePaneState(new_state, callback) {
        this.props.updatePaneState(this.props.res_type, new_state, callback)
    }

    set_in_data_dict(names, new_val_dict, data_dict) {
        let new_data_dict = {};

        for (let index in data_dict) {
            let entry = data_dict[index];
            if (names.includes(data_dict[index].name)){
                for (let k in new_val_dict) {
                    entry[k] = new_val_dict[k]
             }             }

            new_data_dict[index] = entry
        }
        return new_data_dict
    }

    get_data_dict_index(name) {
        for (let index in this.state.data_dict) {
            if (this.state.data_dict[index].name == name) {
                return index
            }
        }
        return null
    }

    _delete_row(idval) {
        let ind = this.get_data_list_index(idval);
        let new_data_list = [...this.state.data_list];
        new_data_list.splice(ind, 1);
        this.setState({data_list: new_data_list});
    }

    get_data_dict_entry(name) {
        for (let index in this.state.data_dict) {
            if (this.state.data_dict[index].name == name) {
                return this.state.data_dict[index]
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

    _filter_func(resource_dict, search_string) {
        for (let key in resource_dict) {
            if (resource_dict[key].toLowerCase().search(search_string) != -1){
                return true
            }
        }
        return resource_dict[this.props.id_field].toLowerCase().search(search_string) != -1
    }

    _update_search_state(new_state) {
        this._updatePaneState(new_state, ()=> {
            if (this.search_spec_changed(new_state)) {
                this._grabNewChunkWithRow(0, true, new_state, true)
            }
        })
    }

    search_spec_changed(new_spec) {
        if (!this.previous_search_spec) {
            return true
        }
        for (let key in this.previous_search_spec) {
            if(new_spec.hasOwnProperty(key)) {
                // noinspection TypeScriptValidateTypes
                if (new_spec[key] != this.previous_search_spec[key]) {
                    return true
                }
            }
        }
        return false
    }

    _set_sort_state(column_name, sort_field, direction) {
        let spec_update = {sort_field: column_name, sort_direction: direction};
        this._updatePaneState(spec_update, ()=>{
            if (this.search_spec_changed(spec_update)) {
                this._grabNewChunkWithRow(0, true, spec_update, true)
            }
        })
    }

    _handleArrowKeyPress(key) {
        let current_index = parseInt(this.get_data_dict_index(this.props.selected_resource.name));
        let new_index;
        let new_selected_res;
        if (key == "ArrowDown") {
            new_index =  current_index + 1;
        }
        else {
            new_index = current_index - 1;
            if (new_index < 0) return
        }
        this._selectRow(new_index)
    }

    _selectRow(new_index) {
        if (!Object.keys(this.state.data_dict).includes(String(new_index))) {
            this._grabNewChunkWithRow(new_index, false, null, false, null, ()=>{
                this._selectRow(new_index)
            })
        }
        else {
            let new_regions = [Regions.row(new_index)];
            this._updatePaneState({selected_resource: this.state.data_dict[new_index],
                list_of_selected: [this.state.data_dict[new_index].name],
                selectedRegions: new_regions
            })
        }

    }

    _refresh_func(callback=null) {
        this._grabNewChunkWithRow(0, true, null, true, callback)
    }

    _setConsoleText(the_text) {
        let self = this;
        this._updatePaneState({"console_text": the_text}, ()=>{
            if (self.console_text_ref && self.console_text_ref.current) {
                self.console_text_ref.current.scrollTop = self.console_text_ref.current.scrollHeight;
            }
        })
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

    _communicateColumnWidthSum(total_width) {
        this.setState({total_width: total_width + 50})
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
                <div className="d-flex d-inline" ref={this.console_text_ref}
                     style={{overflow: "auto", verticalAlign: "top", marginTop: 120, marginLeft: 10, width: "100%", height: 412}}>
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

        let MenubarClass = this.props.MenubarClass;

        let column_specs = {};
        for (let col of this.props.colnames) {
            column_specs[col] = {"sort_field": col, "first_sort": "ascending"}
        }

        let table_width;
        if (this.table_ref && this.table_ref.current) {
            table_width = left_width - this.table_ref.current.offsetLeft;
        }
        else {
            table_width = left_width - 150;
        }

        let left_pane = (
            <React.Fragment>
                <div className="d-flex flex-row" style={{"maxHeight": "100%"}}>
                    <div ref={this.table_ref}
                         style={{width: table_width, maxWidth: this.state.total_width, padding: 15, marginTop: 10, backgroundColor: "white"}}>
                        <SearchForm allow_search_inside={false}
                                    allow_search_metadata={false}
                                    update_search_state={this._update_search_state}
                                    search_string={this.props.search_string}
                        />
                        <BpSelectorTable data_dict={this.state.data_dict}
                                         num_rows={this.state.num_rows}
                                         awaiting_data={this.state.awaiting_data}
                                         enableColumnResizing={false}
                                         maxColumnWidth={225}
                                         sortColumn={this._set_sort_state}
                                         selectedRegions={this.props.selectedRegions}
                                         communicateColumnWidthSum={this._communicateColumnWidthSum}
                                         onSelection={this._onTableSelection}
                                         initiateDataGrab={this._initiateDataGrab}
                                         columns={column_specs}
                                         identifier_field={this.props.id_field}

                        />
                    </div>
                </div>
            </React.Fragment>
        );
        return (
            <React.Fragment>
                <MenubarClass selected_resource={this.props.selected_resource}
                              list_of_selected={this.props.list_of_selected}
                              setConsoleText={this._setConsoleText}
                              delete_row={this._delete_row}
                              refresh_func={this._refresh_func}
                              startSpinner={this.props.startSpinner}
                              stopSpinner={this.props.stopSpinner}
                              clearStatusMessage={this.props.clearStatusMessage}
                              {...this.props.errorDrawerFuncs}
                              />
                <ResizeSensor onResize={this._handleResize} observeParents={true}>
                    <div ref={this.top_ref} className="d-flex flex-column mt-3" >
                          <div style={{width: this.state.available_width, height: this.state.available_height}}>
                                <HorizontalPanes
                                    left_pane={left_pane}
                                    right_pane={right_pane}
                                    show_handle={true}
                                    available_width={this.state.available_width}
                                    available_height={this.state.available_height}
                                    initial_width_fraction={.65}
                                    handleSplitUpdate={this._handleSplitResize}
                                />
                          </div>
                    </div>
                </ResizeSensor>
            </React.Fragment>

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
    MenubarClass: PropTypes.func,
    is_repository: PropTypes.bool,
    tsocket: PropTypes.object,
    colnames: PropTypes.array,
    id_field: PropTypes.string
};

AdminPane.defaultProps = {
    is_repository: false,
    tsocket: null
};