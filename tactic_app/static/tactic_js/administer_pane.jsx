
import React from "react";
import {Fragment, useState, useRef, useEffect, memo} from "react";
import PropTypes from 'prop-types';

import {Regions} from "@blueprintjs/table";

import {SearchForm, BpSelectorTable} from "./library_widgets";
import {HorizontalPanes} from "./resizing_layouts";

import {postAjax} from "./communication_react";
import {getUsableDimensions} from "./sizing_tools";
import {useCallbackStack, useStateAndRef} from "./utilities_react";

import _ from 'lodash';

export {AdminPane}

function AdminPane(props) {
    const top_ref = useRef(null);
    const table_ref = useRef(null);
    const console_text_ref = useRef(null);
    const previous_search_spec = useRef(null);

    const [available_height, set_available_height] = useState(getUsableDimensions(true).usable_height_no_bottom);
    const [available_width, set_available_width] = useState(getUsableDimensions(true).usable_width - 170);

    const get_url = `grab_${props.res_type}_list_chunk`;

    const [data_dict, set_data_dict, data_dict_ref] = useStateAndRef({});
    const [num_rows, set_num_rows] = useState(0);
    const [awaiting_data, set_awaiting_data] = useState(false);
    const [mounted, set_mounted] = useState(false);
    const [top_pane_height, set_top_pane_height] =
        useState(getUsableDimensions(true).usable_height_no_bottom / 2 - 50);
    const [total_width, set_total_width] = useState(500);

    const pushCallback = useCallbackStack();

    useEffect(() => {
        initSocket();
        _grabNewChunkWithRow(0, true, null, true, null);
        return (() => {
            props.tsocket.disconnect()
        })
    }, []);

    function initSocket() {
        if (props.tsocket != null) {
            props.tsocket.attachListener(`update-${props.res_type}-selector-row`, _handleRowUpdate);
            props.tsocket.attachListener(`refresh-${props.res_type}-selector`, _refresh_func);
        }
    }

    function _getSearchSpec(){
        return {
            search_string: props.search_string,
            sort_field: props.sort_field,
            sort_direction: props.sort_direction
        }
    }

     function _onTableSelection(regions) {
        if (regions.length == 0) return;  // Without this get an error when clicking on a body cell
        let selected_rows = [];
        let revised_regions = [];
        for (let region of regions) {
            if (region.hasOwnProperty("rows")) {
                let first_row = region["rows"][0];
                revised_regions.push(Regions.row(first_row));
                let last_row = region["rows"][1];
                for (let i=first_row; i<=last_row; ++i) {
                    selected_rows.push(data_dict_ref.current[i]);
                    revised_regions.push(Regions.row(i));
                }
            }
        }
        _handleRowSelection(selected_rows);
        _updatePaneState({selectedRegions: revised_regions});
    }

    function get_height_minus_top_offset (element_ref) {
        if (mounted) {  // This will be true after the initial render
            return props.usable_height - $(element_ref.current).offset().top
        }
        else {
            return props.usable_height - 50
        }
    }

    function _grabNewChunkWithRow(row_index, flush=false, spec_update=null, select=false, select_by_name=null, callback=null) {
        let search_spec = _getSearchSpec();
        if (spec_update) {
            search_spec = Object.assign(search_spec, spec_update)
        }
        let data = {search_spec: search_spec, row_number: row_index};
        postAjax(get_url, data, (data) => {
            let new_data_dict;
            if (flush) {
                new_data_dict = data.chunk_dict
            }
            else {
                new_data_dict = _.cloneDeep(data_dict_ref.current);
                new_data_dict = Object.assign(new_data_dict, data.chunk_dict)
            }
            previous_search_spec.current = search_spec;
            set_data_dict(new_data_dict);
            set_num_rows(data.num_rows);
            pushCallback(()=>{
                if (callback) {
                    callback()
                }
                else if (select) {
                    _selectRow(row_index)
                }
                else if (select_by_name) {
                    let ind = get_data_dict_index(select_by_name);
                    if (!ind) {
                        ind = 0
                    }
                    _selectRow(ind)
                }
            });
        })
    }

    function _initiateDataGrab(row_index) {
        set_awaiting_data(true);
        pushCallback(() => {_grabNewChunkWithRow(row_index)});
    }

    function _handleRowUpdate(res_dict) {
        let res_name = res_dict.name;
        let ind = get_data_dict_index(res_name);
        let new_data_dict = _.cloneDeep(data_dict_ref.current);
        let the_row = new_data_dict[ind];
        for (let field in res_dict) {
            the_row[field] = res_dict[field];
        }
        if (res_name == props.selected_resource.name) {
            props.updatePaneState({"selected_resource": the_row})
        }
        set_data_dict(new_data_dict);
    }

    function _updatePaneState(new_state, callback) {
        props.updatePaneState(props.res_type, new_state, callback)
    }

    function get_data_dict_index(name) {
        for (let index in data_dict_ref.current) {
            if (data_dict_ref.current[index].name == name) {
                return index
            }
        }
        return null
    }

    function _delete_row(idval) {
        let ind = get_data_list_index(idval);
        let new_data_list = [...data_list];
        new_data_list.splice(ind, 1);
        set_ata_list(new_data_list);
    }

    function get_data_dict_entry(name) {
        for (let index in data_dict_ref.current) {
            if (data_dict_ref.current[index].name == name) {
                return data_dict_ref.current[index]
            }
        }
        return null
    }


    function _handleSplitResize(left_width, right_width, width_fraction) {
        _updatePaneState({left_width_fraction: width_fraction})
    }

    function _handleRowClick(row_dict, shift_key_down=false) {
        _updatePaneState({
            selected_resource: row_dict,
            multi_select: false,
            list_of_selected: [row_dict[props.id_field]]
        })

    }

    function _handleRowSelection(selected_rows) {
         let row_dict = selected_rows[0];
        _updatePaneState({
            selected_resource: row_dict,
            multi_select: false,
            list_of_selected: [row_dict.name]
        })
    }

    function _filter_func(resource_dict, search_string) {
        for (let key in resource_dict) {
            if (resource_dict[key].toLowerCase().search(search_string) != -1){
                return true
            }
        }
        return resource_dict[props.id_field].toLowerCase().search(search_string) != -1
    }

    function _update_search_state(new_state) {
        _updatePaneState(new_state, ()=> {
            if (search_spec_changed(new_state)) {
                _grabNewChunkWithRow(0, true, new_state, true)
            }
        })
    }

    function search_spec_changed(new_spec) {
        if (!previous_search_spec.current) {
            return true
        }
        for (let key in previous_search_spec.current) {
            if(new_spec.hasOwnProperty(key)) {
                // noinspection TypeScriptValidateTypes
                if (new_spec[key] != previous_search_spec.current[key]) {
                    return true
                }
            }
        }
        return false
    }

    function _set_sort_state(column_name, sort_field, direction) {
        let spec_update = {sort_field: column_name, sort_direction: direction};
        _updatePaneState(spec_update, ()=>{
            if (search_spec_changed(spec_update)) {
                _grabNewChunkWithRow(0, true, spec_update, true)
            }
        })
    }

    function _handleArrowKeyPress(key) {
        let current_index = parseInt(get_data_dict_index(props.selected_resource.name));
        let new_index;
        let new_selected_res;
        if (key == "ArrowDown") {
            new_index =  current_index + 1;
        }
        else {
            new_index = current_index - 1;
            if (new_index < 0) return
        }
        _selectRow(new_index)
    }

    function _selectRow(new_index) {
        if (!Object.keys(data_dict_ref.current).includes(String(new_index))) {
            _grabNewChunkWithRow(new_index, false, null, false, null, ()=>{
                _selectRow(new_index)
            })
        }
        else {
            let new_regions = [Regions.row(new_index)];
            _updatePaneState({selected_resource: data_dict_ref.current[new_index],
                list_of_selected: [data_dict_ref.current[new_index].name],
                selectedRegions: new_regions
            })
        }

    }

    function _refresh_func(callback=null) {
        _grabNewChunkWithRow(0, true, null, true, null, callback)
    }

    function _setConsoleText(the_text) {
        let self = this;
        _updatePaneState({"console_text": the_text}, ()=>{
            if (console_text_ref && console_text_ref.current) {
                console_text_ref.current.scrollTop = console_text_ref.current.scrollHeight;
            }
        })
    }

    function _communicateColumnWidthSum(total_width) {
        set_total_width(total_width + 50)
    }

    let new_button_groups;
    let left_width = props.usable_width * props.left_width_fraction;
    const primary_mdata_fields = ["name", "created", "created_for_sort", "updated",  "updated_for_sort", "tags", "notes"];
    let additional_metadata = {};
    for (let field in props.selected_resource) {
        if (!primary_mdata_fields.includes(field)) {
            additional_metadata[field] = props.selected_resource[field]
        }
    }
    if (Object.keys(additional_metadata).length == 0) {
        additional_metadata = null
    }

    let right_pane = (
            <div className="d-flex d-inline" ref={console_text_ref}
                 style={{
                     overflow: "auto", verticalAlign: "top", marginTop: 12, marginLeft: 10,
                     width: "100%", height: "100%", border: "1px solid black", padding: 10}}>
                <pre><small>{props.console_text}</small></pre>
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

    let MenubarClass = props.MenubarClass;

    let column_specs = {};
    for (let col of props.colnames) {
        column_specs[col] = {"sort_field": col, "first_sort": "ascending"}
    }

    let table_width;
    let table_height;
    if (table_ref && table_ref.current) {
        table_width = left_width - table_ref.current.offsetLeft;
        table_height = props.usable_height - table_ref.current.offsetTop
    }
    else {
        table_width = left_width - 150;
        table_height = props.usable_height - 75
    }

    let left_pane = (
        <Fragment>
            <div className="d-flex flex-row" style={{"maxHeight": "100%"}}>
                <div ref={table_ref}
                     style={{
                         width: table_width,
                         maxWidth: total_width,
                         maxHeight: table_height,
                         padding: 15,
                         marginTop: 10,
                         backgroundColor: "white"}}>
                    <SearchForm allow_search_inside={false}
                                allow_search_metadata={false}
                                update_search_state={_update_search_state}
                                search_string={props.search_string}
                    />
                    <BpSelectorTable data_dict={data_dict_ref.current}
                                     num_rows={num_rows}
                                     awaiting_data={awaiting_data}
                                     enableColumnResizing={false}
                                     maxColumnWidth={225}
                                     sortColumn={_set_sort_state}
                                     selectedRegions={props.selectedRegions}
                                     communicateColumnWidthSum={_communicateColumnWidthSum}
                                     onSelection={_onTableSelection}
                                     initiateDataGrab={_initiateDataGrab}
                                     columns={column_specs}
                                     identifier_field={props.id_field}

                    />
                </div>
            </div>
        </Fragment>
    );
    return (
        <Fragment>
            <MenubarClass selected_resource={props.selected_resource}
                          list_of_selected={props.list_of_selected}
                          setConsoleText={_setConsoleText}
                          delete_row={_delete_row}
                          refresh_func={_refresh_func}
                          startSpinner={props.startSpinner}
                          stopSpinner={props.stopSpinner}
                          clearStatusMessage={props.clearStatusMessage}
                          {...props.errorDrawerFuncs}
                          />
            <div ref={top_ref} className="d-flex flex-column mt-3" >
                  <div style={{width: props.usable_width, height: props.usable_height}}>
                        <HorizontalPanes
                            left_pane={left_pane}
                            right_pane={right_pane}
                            show_handle={true}
                            available_width={props.usable_width - 50}
                            available_height={table_height}
                            initial_width_fraction={.65}
                            handleSplitUpdate={_handleSplitResize}
                        />
                  </div>
            </div>
        </Fragment>

    )
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

AdminPane = memo(AdminPane);