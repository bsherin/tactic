// noinspection JSValidateTypes,JSDeprecatedSymbols

import React from "react";
import {Fragment, useState, useRef, useEffect, memo, useContext} from "react";
import PropTypes from 'prop-types';

import {Menu, MenuItem, MenuDivider, FormGroup, Button} from "@blueprintjs/core";
import {Tooltip2} from "@blueprintjs/popover2"
import {Regions} from "@blueprintjs/table";
import _ from 'lodash';

import {TagButtonList} from "./tag_buttons_react";
import {CombinedMetadata, icon_dict} from "./blueprint_mdata_fields";
import {SearchForm, BpSelectorTable} from "./library_widgets";
import {HorizontalPanes} from "./resizing_layouts";
import {postAjax, postAjaxPromise, postWithCallback} from "./communication_react"
import {BOTTOM_MARGIN} from "./sizing_tools";

import {doFlash} from "./toaster.js"
import {KeyTrap} from "./key_trap.js";
import {useCallbackStack, useConstructor, useStateAndRef} from "./utilities_react";
import {ThemeContext} from "./theme"

import {DialogContext} from "./modal_react";
import {StatusContext} from "./toaster"

export {LibraryPane, view_views, res_types}

const res_types = ["collection", "project", "tile", "list", "code"];

function view_views(is_repository = false) {

    if (is_repository) {
        return {
            collection: null,
            project: null,
            tile: "/repository_view_module/",
            list: "/repository_view_list/",
            code: "/repository_view_code/"
        }
    } else {
        return {
            collection: "/main_collection/",
            project: "/main_project/",
            tile: "/last_saved_view/",
            list: "/view_list/",
            code: "/view_code/"
        }
    }
}

function duplicate_views(is_repository = false) {
    return {
        collection: "/duplicate_collection",
        project: "/duplicate_project",
        tile: "/create_duplicate_tile",
        list: "/create_duplicate_list",
        code: "/create_duplicate_code"
    }
}

function BodyMenu(props) {
    function getIntent(item) {
        return item.intent ? item.intent : null
    }

    let menu_items = props.items.map((item, index) => {
        if (item.text == "__divider__") {
            return <MenuDivider key={index}/>
        } else {
            let the_row = props.selected_rows[0];
            let disabled = item.res_type && the_row.res_type != item.res_type;
            return (<MenuItem icon={item.icon} disabled={disabled}
                              onClick={() => item.onClick(the_row)}
                              intent={getIntent(item)}
                              key={item.text}
                              text={item.text}/>)
        }
    });
    return (
        <Menu>
            <MenuDivider title={props.selected_rows[0].name} className="context-menu-header"/>
            {menu_items}
        </Menu>
    )
}

BodyMenu.propTypes = {
    items: PropTypes.array,
    selected_rows: PropTypes.array
};

function LibraryPane(props) {

    const top_ref = useRef(null);
    const table_ref = useRef(null);
    const tr_bounding_top = useRef(null);
    const resizing = useRef(false);
    const previous_search_spec = useRef(null);
    const socket_counter = useRef(null);
    const blank_selected_resource = useRef({});

    const [data_dict, set_data_dict, data_dict_ref] = useStateAndRef({});
    const [num_rows, set_num_rows] = useState(0);
    const [tag_list, set_tag_list] = useState([]);
    const [showOmnibar, setShowOmnibar] = useState(false);
    const [contextMenuItems, setContextMenuItems] = useState([]);
    const [total_width, set_total_width] = useState(500);
    const [left_width_fraction, set_left_width_fraction, left_width_fraction_ref] = useStateAndRef(.65);
    const [selected_resource, set_selected_resource, selected_resource_ref] = useStateAndRef({
        "name": "",
        "tags": "",
        "notes": "",
        "updated": "",
        "created": ""
    });
    const [selected_rows, set_selected_rows, selected_rows_ref] = useStateAndRef([]);
    const [expanded_tags, set_expanded_tags, expanded_tags_ref] = useStateAndRef([]);
    const [active_tag, set_active_tag, active_tag_ref] = useStateAndRef("all");

    const [sort_field, set_sort_field, sort_field_ref] = useStateAndRef("updated");
    const [sort_direction, set_sort_direction, sort_direction_ref] = useStateAndRef("descending");
    const [filterType, setFilterType, filterTypeRef] = useStateAndRef(props.pane_type);
    const [multi_select, set_multi_select, multi_select_ref] = useStateAndRef(false);
    const [list_of_selected, set_list_of_selected, list_of_selected_ref] = useStateAndRef([]);
    const [search_string, set_search_string, search_string_ref] = useStateAndRef("");
    const [search_inside, set_search_inside, search_inside_ref] = useStateAndRef(false);
    const [search_metadata, set_search_metadata, search_metadata_ref] = useStateAndRef(false);
    const [show_hidden, set_show_hidden, show_hidden_ref] = useStateAndRef(false);
    const [selectedRegions, setSelectedRegions, selectedRegionsRef] = useStateAndRef([Regions.row(0)]);

    const [rowChanged, setRowChanged] = useState(0);

    const theme = useContext(ThemeContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);

    const stateSetters = {
        data_dict: set_data_dict,
        num_rows: set_num_rows,
        tag_list: set_tag_list,
        showOmnibar: setShowOmnibar,
        contextMenuItems: setContextMenuItems,
        total_width: set_total_width,
        left_width_fraction: set_left_width_fraction,
        selected_resource: set_selected_resource,
        selected_rows: set_selected_rows,
        expanded_tags: set_expanded_tags,
        active_tag: set_active_tag,
        sort_field: set_sort_field,
        sort_direction: set_sort_direction,
        filterType: setFilterType,
        multi_select: set_multi_select,
        list_of_selected: set_list_of_selected,
        search_string: set_search_string,
        search_inside: set_search_inside,
        search_metadata: set_search_metadata,
        show_hidden: set_show_hidden,
        selectedRegions: setSelectedRegions,
        rowChanged: setRowChanged
    };

    useConstructor(() => {

        for (let col in props.columns) {
            blank_selected_resource.current[col] = ""
        }
    });

    useEffect(() => {
        tr_bounding_top.current = table_ref.current.getBoundingClientRect().top;
        initSocket();
        _grabNewChunkWithRow(0)
    }, []);

    const pushCallback = useCallbackStack("library_home");

    function setState(new_state, callback=null) {
        for (let attr in new_state) {
            stateSetters[attr](new_state[attr])
        }
        pushCallback(callback)
    }

    function initSocket() {
        if ((props.tsocket != null) && (!props.is_repository)) {
            if (props.pane_type == "all") {
                for (let res_type of res_types) {
                    props.tsocket.attachListener(`update-${res_type}-selector-row`, _handleRowUpdate);
                    props.tsocket.attachListener(`refresh-${res_type}-selector`, _refresh_func);
                }
            } else {
                props.tsocket.attachListener(`update-${props.pane_type}-selector-row`, _handleRowUpdate);
                props.tsocket.attachListener(`refresh-${props.pane_type}-selector`, _refresh_func);
            }

        }
    }

    function _getSearchSpec() {
        return {
            active_tag: active_tag_ref.current == "all" ? null : active_tag_ref.current,
            search_string: search_string_ref.current,
            search_inside: search_inside_ref.current,
            search_metadata: search_metadata_ref.current,
            show_hidden: show_hidden_ref.current,
            sort_field: sort_field_ref.current,
            sort_direction: sort_direction_ref.current
        }
    }

    function _renderBodyContextMenu(menu_context) {
        if (event) {
            event.preventDefault();
        }
        let regions = menu_context.regions;
        if (regions.length == 0) return null;  // Without this get an error when clicking on a body cell
        let selected_rows = [];
        for (let region of regions) {
            if (region.hasOwnProperty("rows")) {
                let first_row = region["rows"][0];
                let last_row = region["rows"][1];
                for (let i = first_row; i <= last_row; ++i) {
                    if (!selected_rows.includes(i)) {
                        selected_rows.push(data_dict_ref.current[i]);
                    }
                }
            }
        }
        return (
            <BodyMenu items={contextMenuItems} selected_rows={selected_rows}/>
        )
    }

    function _setFilterType(rtype) {
        if (rtype == filterTypeRef.current) return;
        if (!multi_select_ref.current) {
            let sres = selected_resource_ref.current;
            if (sres.name != "" && (sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
                _saveFromSelectedResource()
            }
        }
        setFilterType(rtype);
        clearSelected();
        pushCallback(() => {
            _grabNewChunkWithRow(0, true, null, true)
        });
    }

    function clearSelected() {
        set_selected_resource({"name": "", "tags": "", "notes": "", "updated": "", "created": ""});
        set_list_of_selected([]);
        set_selected_rows([]);
    }

    function _onTableSelection(regions) {
        if (regions.length == 0) return;  // Without this get an error when clicking on a body cell
        let selected_rows = [];
        let selected_row_indices = [];
        let revised_regions = [];
        for (let region of regions) {
            if (region.hasOwnProperty("rows")) {
                let first_row = region["rows"][0];
                revised_regions.push(Regions.row(first_row));
                let last_row = region["rows"][1];
                for (let i = first_row; i <= last_row; ++i) {
                    if (!selected_row_indices.includes(i)) {
                        selected_row_indices.push(i);
                        selected_rows.push(data_dict_ref.current[i]);
                        revised_regions.push(Regions.row(i));
                    }
                }
            }
        }
        _handleRowSelection(selected_rows);
        setSelectedRegions(revised_regions);
    }

    function _grabNewChunkWithRow(row_index, flush = false, spec_update = null, select = false, select_by_name = null, callback = null) {
        let search_spec = _getSearchSpec();
        if (spec_update) {
            search_spec = Object.assign(search_spec, spec_update)
        }
        if (search_spec.active_tag && search_spec.active_tag[0] != "/") {
            search_spec.active_tag = "/" + search_spec.active_tag
        }
        let data = {
            pane_type: filterTypeRef.current,
            search_spec: search_spec,
            row_number: row_index,
            is_repository: props.is_repository
        };
        postAjax("grab_all_list_chunk", data, function (data) {
            let new_data_dict;
            if (flush) {
                new_data_dict = data.chunk_dict
            } else {
                new_data_dict = _.cloneDeep(data_dict_ref.current);
                new_data_dict = Object.assign(new_data_dict, data.chunk_dict)
            }
            previous_search_spec.current = search_spec;
            set_data_dict(new_data_dict);
            set_num_rows(data.num_rows);
            set_tag_list(data.all_tags);
            if (callback) {
                pushCallback(callback)
            } else if (select || selected_resource_ref.current.name == "") {
                pushCallback(() => {
                    _selectRow(row_index)
                })
            }
        })
    }

    function _handleRowUpdate(res_dict) {
        let res_name = res_dict.name;
        let ind = get_data_dict_index(res_name, res_dict.res_type);
        if (!ind) return;
        let new_data_dict = _.cloneDeep(data_dict_ref.current);
        let the_row = new_data_dict[ind];

        for (let field in res_dict) {
            if ("new_name" in res_dict && field == "name") {
            } else if (field == "new_name") {
                the_row["name"] = res_dict[field]
            } else {
                the_row[field] = res_dict[field];
            }

        }

        let new_state = {data_dict: new_data_dict, rowChanged: rowChanged + 1};
        if ("tags" in res_dict) {
            let res_tags = res_dict.tags.split(" ");
            let new_tag_list = _.cloneDeep(tag_list);
            let new_tag_found = false;
            for (let tag of res_tags) {
                if (!new_tag_list.includes(tag)) {
                    new_tag_list.push(tag);
                    new_tag_found = true;
                }
            }
            if (new_tag_found) {
                new_state["tag_list"] = new_tag_list;
            }
        }
        if (res_name == selected_resource_ref.current.name) {
            set_selected_resource(the_row);
            pushCallback(() => setState(new_state))
        } else {
            setState(new_state);
        }
    }

    function get_data_dict_entry(name, res_type) {
        for (let index in data_dict_ref.current) {
            let the_row = data_dict_ref.current[index];
            if (the_row.name == name && the_row.res_type == res_type) {
                return data_dict_ref.current[index]
            }
        }
        return null
    }

    function _match_row(row1, row2) {
        return row1.name == row2.name && row1.res_type == row2.res_type
    }

    function _match_any_row(row1, row_list) {
        for (let row2 of row_list) {
            if (_match_row(row1, row2)) {
                return true
            }
        }
        return false
    }

    function set_in_data_dict(old_rows, new_val_dict, data_dict) {
        let new_data_dict = {};

        for (let index in data_dict_ref.current) {
            let entry = data_dict_ref.current[index];
            if (_match_any_row(entry, old_rows)) {
                for (let k in new_val_dict) {
                    entry[k] = new_val_dict[k]
                }
            }
            new_data_dict[index] = entry
        }
        return new_data_dict
    }

    function get_data_dict_index(name, res_type) {
        let target = {name: name, res_type: res_type};
        for (let index in data_dict_ref.current) {
            if (_match_row(data_dict_ref.current[index], {name: name, res_type: res_type})) {
                return index
            }
        }
        return null
    }

    function _extractNewTags(tstring) {
        let tlist = tstring.split(" ");
        let new_tags = [];
        for (let tag of tlist) {
            if (!(tag.length == 0) && !(tag in tag_list)) {
                new_tags.push(tag)
            }
        }
        return new_tags
    }

    function _saveFromSelectedResource() {
        // This will only be called when there is a single row selected
        const result_dict = {
            "res_type": selected_rows_ref.current[0].res_type,
            "res_name": list_of_selected_ref.current[0],
            "tags": selected_resource_ref.current.tags,
            "notes": selected_resource_ref.current.notes
        };
        if (selected_rows_ref.current[0].res_type == "tile" && "icon" in selected_resource_ref.current) {
            result_dict["icon"] = selected_resource_ref.current["icon"]
        }
        let saved_selected_resource = Object.assign({}, selected_resource_ref.current);
        let saved_selected_rows = [...selected_rows_ref.current];
        let new_tags = _extractNewTags(selected_resource_ref.current.tags);
        postAjaxPromise("save_metadata", result_dict)
            .then(function (data) {
                let new_data_dict = set_in_data_dict(saved_selected_rows,
                    saved_selected_resource,
                    data_dict_ref.current);
                if (new_tags.length > 0) {
                    let new_tag_list = [...tag_list, ...new_tags];
                    set_data_dict(new_data_dict);
                    set_tag_list(new_tag_list)
                } else {
                    set_data_dict(new_data_dict);
                }
            })
            .catch(doFlash)
    }

    function _overwriteCommonTags() {
        const result_dict = {
            "selected_rows": selected_rows_ref.current,
            "tags": selected_resource_ref.current.tags,
        };
        let new_tags = _extractNewTags(selected_resource_ref.current.tags);
        postAjaxPromise("overwrite_common_tags", result_dict)
            .then(function (data) {
                let utags = data.updated_tags;
                let new_data_dict = _.cloneDeep(data_dict_ref.current);
                for (let urow of utags) {
                    new_data_dict = set_in_data_dict([urow],
                        {tags: urow.tags}, new_data_dict);
                }
                if (new_tags.length > 0) {
                    let new_tag_list = [...tag_list, ...new_tags];
                    set_data_dict(new_data_dict);
                    set_tag_list(new_tag_list)
                } else {
                    set_data_dict(new_data_dict);
                }
            })
            .catch(doFlash)
    }

    function _handleMetadataChange(changed_state_elements) {
        if (!multi_select_ref.current) {
            let revised_selected_resource = Object.assign({}, selected_resource_ref.current);
            revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);
            if (Object.keys(changed_state_elements).includes("tags")) {
                revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");
                set_selected_resource(revised_selected_resource);
                pushCallback(_saveFromSelectedResource);
            } else {
                set_selected_resource(revised_selected_resource);
                pushCallback(_saveFromSelectedResource);
            }
        } else {
            let revised_selected_resource = Object.assign({}, selected_resource_ref.current);
            revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);
            revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");
            set_selected_resource(revised_selected_resource);
            pushCallback(_overwriteCommonTags)
        }
    }

    function _handleSplitResize(left_width, right_width, width_fraction) {
        if (!resizing.current) {
            set_left_width_fraction(width_fraction);
        }
    }

    function _handleSplitResizeStart() {
        resizing.current = true;
    }

    function _handleSplitResizeEnd(width_fraction) {
        resizing.current = false;
        set_left_width_fraction(width_fraction);
    }

    function _doTagDelete(tag) {
        const result_dict = {"pane_type": props.pane_type, "tag": tag};
        postAjaxPromise("delete_tag", result_dict)
            .then(function (data) {
                _refresh_func()
            })
            .catch(doFlash)
    }

    function _doTagRename(tag_changes) {
        const result_dict = {"pane_type": props.pane_type, "tag_changes": tag_changes};
        postAjaxPromise("rename_tag", result_dict)
            .then(function (data) {
                _refresh_func()
            })
            .catch(doFlash)
    }

    function _handleRowDoubleClick(row_dict) {
        let view_view = view_views(props.is_repository)[row_dict.res_type];
        if (view_view == null) return;
        statusFuncs.setStatus({show_spinner: true, status_message: "Opening ..."});
        set_selected_resource(row_dict);
        set_multi_select(false);
        set_list_of_selected([row_dict.name]);
        set_selected_rows([row_dict]);
        pushCallback(() => {
            if (window.in_context) {
                const re = new RegExp("/$");
                view_view = view_view.replace(re, "_in_context");
                postAjaxPromise($SCRIPT_ROOT + view_view, {
                    context_id: context_id,
                    resource_name: row_dict.name
                })
                    .then((data) => {
                        props.handleCreateViewer(data, statusFuncs.clearStatus);
                    })
                    .catch((data) => {
                            doFlash(data);
                            statusFuncs.clearStatus()
                        }
                    );
            } else {
                statusFuncs.clearStatus();
                window.open($SCRIPT_ROOT + view_view + row_dict.name)
            }
        });
    }

    function _selectedTypes() {
        let the_types = selected_rows_ref.current.map(function (row) {
            return row.res_type
        });
        the_types = [...new Set(the_types)];
        return the_types
    }

    function _handleRowSelection(selected_rows) {
        if (!multi_select_ref.current) {
            let sres = selected_resource_ref.current;
            if (sres.name != "" && (sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
                _saveFromSelectedResource()
            }
        }
        if (selected_rows.length > 1) {
            let common_tags = selected_rows[0].tags.split(" ");
            let other_rows = selected_rows.slice(1, selected_rows.length);
            for (let row_dict of other_rows) {
                let new_common_tags = [];
                let new_tag_list = row_dict.tags.split(" ");
                for (let tag of new_tag_list) {
                    if (common_tags.includes(tag)) {
                        new_common_tags.push(tag)
                    }
                }
                common_tags = new_common_tags
            }

            let multi_select_list = selected_rows.map((row_dict) => row_dict.name);
            let new_selected_resource = {name: "__multiple__", tags: common_tags.join(" "), notes: ""};
            set_selected_resource(new_selected_resource);
            set_multi_select(true);
            set_list_of_selected(multi_select_list);
            set_selected_rows(selected_rows);
        } else {
            let row_dict = selected_rows[0];
            set_selected_resource(row_dict);
            set_multi_select(false);
            set_list_of_selected([row_dict.name]);
            set_selected_rows(selected_rows);
        }
    }

    function _filter_func(resource_dict, search_string) {
        try {
            return resource_dict.name.toLowerCase().search(search_string) != -1
        } catch (e) {
            return false
        }
    }

    function _unsearch() {
        if (search_string_ref.current != "") {
            set_search_string("")
        } else if (active_tag_ref.current != "all") {
            _update_search_state({"active_tag": "all"})
        } else if (props.pane_type == "all" && filterTypeRef.current != "all") {
            _setFilterType("all")
        }
    }

    function _update_search_state(new_state) {
        setState(new_state);
        pushCallback(() => {
            if (search_spec_changed(new_state)) {
                clearSelected();
                _grabNewChunkWithRow(0, true, new_state, true)
            }
        })
    }

    function search_spec_changed(new_spec) {
        if (!previous_search_spec.current) {
            return true
        }
        for (let key in previous_search_spec.current) {
            if (new_spec.hasOwnProperty(key)) {
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
        set_sort_field(column_name);
        set_sort_direction(direction);
        pushCallback(() => {
            if (search_spec_changed(spec_update)) {
                _grabNewChunkWithRow(0, true, spec_update, true)
            }
        })
    }

    function _handleArrowKeyPress(key) {
        if (multi_select_ref.current) return;
        let the_res = selected_resource_ref.current;
        let current_index = parseInt(get_data_dict_index(the_res.name, the_res.res_type));
        let new_index;
        let new_selected_res;
        if (key == "ArrowDown") {
            new_index = current_index + 1;
        } else {
            new_index = current_index - 1;
            if (new_index < 0) return
        }
        _selectRow(new_index)
    }

    function _handleTableKeyPress(key) {
        if (key.code == "ArrowUp") {
            _handleArrowKeyPress("ArrowUp")
        } else if (key.code == "ArrowDown") {
            _handleArrowKeyPress("ArrowDown")
        }
    }

    function _selectRow(new_index) {
        if (!Object.keys(data_dict_ref.current).includes(String(new_index))) {
            _grabNewChunkWithRow(new_index, false, null, false, null, () => {
                _selectRow(new_index)
            })
        } else {
            let new_regions = [Regions.row(new_index)];
            setState({
                selected_resource: data_dict_ref.current[new_index],
                list_of_selected: [data_dict_ref.current[new_index].name],
                selected_rows: [data_dict_ref.current[new_index]],
                multi_select: false,
                selectedRegions: new_regions
            })
        }

    }

    function _view_func(the_view = null) {
        if (the_view == null) {
            the_view = view_views(props.is_repository)[selected_resource_ref.current.res_type]
        }
        statusFuncs.setStatus({show_spinner: true, status_message: "Opening ..."});
        if (window.in_context) {
            const re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            postAjaxPromise($SCRIPT_ROOT + the_view, {
                context_id: context_id,
                resource_name: selected_resource_ref.current.name
            })
                .then((data) => {
                    props.handleCreateViewer(data, statusFuncs.clearStatus);
                })
                .catch((data) => {
                        doFlash(data);
                        statusFuncs.clearstatus()
                    }
                );
        } else {
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + the_view + selected_resource_ref.current.name)
        }
    }

    function _open_raw(selected_resource) {
        statusFuncs.clearStatus();
        if (selected_resource.type == "freeform") {
            window.open($SCRIPT_ROOT + "/open_raw/" + selected_resource.name)
        } else {
            // doFlash("Only Freeform documents can be raw opened")
            statusFuncs.statusMessage("Only Freeform documents can be raw opened", 5);
        }
    }

    function _view_resource(selected_resource, the_view = null, force_new_tab = false) {
        let resource_name = selected_resource.name;
        if (the_view == null) {
            the_view = view_views(props.is_repository)[selected_resource.res_type]
        }
        statusFuncs.setStatus({show_spinner: true, status_message: "Opening ..."});
        if (window.in_context && !force_new_tab) {
            const re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            postAjaxPromise($SCRIPT_ROOT + the_view, {context_id: context_id, resource_name: resource_name})
                .then((data) => {
                    props.handleCreateViewer(data, statusFuncs.clearStatus);
                })
                .catch((data) => {
                        doFlash(data);
                        statusFuncs.clearstatus()
                    }
                );
        } else {
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + the_view + resource_name)
        }

    }

    function _duplicate_func(row = null) {
        let the_row = row ? row : selected_resource_ref.current;
        let res_name = the_row.name;
        let res_type = the_row.res_type;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function (data) {
                dialogFuncs.showModal("ModalDialog", {
                    title: `Duplicate ${res_type}`,
                    field_title: "New Name",
                    handleSubmit: DuplicateResource,
                    default_value: res_name,
                    existing_names: data.resource_names,
                    checkboxes: [],
                    handleCancel: null,
                    handleClose: dialogFuncs.hideModal,
                })
            }
        );
        let duplicate_view = duplicate_views()[res_type];

        function DuplicateResource(new_name) {
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": res_name,
                "library_id": props.library_id,
                "is_repository": false
            };
            postAjaxPromise(duplicate_view, result_dict)
                .then((data) => {
                        _grabNewChunkWithRow(0, true, null, false, new_name)
                    }
                )
            // .catch(doFlash)
        }
    }

    function _delete_func(resource) {
        let res_list = resource ? [resource] : selected_rows_ref.current;
        var confirm_text;
        if (res_list.length == 1) {
            let res_name = res_list[0].name;
            confirm_text = `Are you sure that you want to delete ${res_name}?`;
        } else {
            confirm_text = `Are you sure that you want to delete multiple items?`;
        }
        let first_index = 99999;
        for (let row of selected_rows_ref.current) {
            let ind = parseInt(get_data_dict_index(row.name, row.res_type));
            if (ind < first_index) {
                first_index = ind
            }
        }
        dialogFuncs.showModal("ConfirmDialog", {
            title: "Delete resources",
            text_body: confirm_text,
            cancel_text: "do nothing",
            submit_text: "delete",
            handleSubmit: ()=>{
            postAjaxPromise("delete_resource_list", {"resource_list": res_list})
                .then(() => {
                    let new_index = 0;
                    if (first_index > 0) {
                        new_index = first_index - 1;
                    }
                    _grabNewChunkWithRow(new_index, true, null, true)
                })
            },
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });
    }

    function _rename_func(row = null) {
        let res_type;
        let res_name;
        if (!row) {
            res_type = selected_resource_ref.current.res_type;
            res_name = selected_resource_ref.current.name;
        } else {
            res_type = row.res_type;
            res_name = row.name;
        }
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function (data) {
                const res_names = data["resource_names"];
                const index = res_names.indexOf(res_name);
                if (index >= 0) {
                    res_names.splice(index, 1);
                }
                dialogFuncs.showModal("ModalDialog", {
                    title: `Rename ${res_type}`,
                    field_title: "New Name",
                    handleSubmit: RenameResource,
                    handleCancel: null,
                    handleClose: dialogFuncs.hideModal,
                    default_value: res_name,
                    existing_names: res_names,
                    checkboxes: []
                })
            }
        );

        function RenameResource(new_name) {
            const the_data = {"new_name": new_name};
            postAjax(`rename_resource/${res_type}/${res_name}`, the_data, renameSuccess);

            function renameSuccess(data) {
                if (!data.success) {
                    doFlash(data);
                    return false
                } else {
                    let ind = get_data_dict_index(res_name, res_type);
                    let new_data_dict = _.cloneDeep(data_dict_ref.current);
                    new_data_dict[ind].name = new_name;
                    setState({data_dict: new_data_dict}, () => {
                        _selectRow(ind)
                    });
                    return true
                }
            }
        }
    }

    function _repository_copy_func() {
        if (!multi_select_ref.current) {
            let res_type = selected_resource_ref.current.res_type;
            let res_name = selected_resource_ref.current.name;
            $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function (data) {
                    dialogFuncs.showModal("ModalDialog", {
                        title: `Import ${res_type}`,
                        field_title: "New Name",
                        handleSubmit: ImportResource,
                        default_value: res_name,
                        existing_names: data.resource_names,
                        checkboxes: [],
                        handleCancel: null,
                        handleClose: dialogFuncs.hideModal,
                    })
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
        } else {
            const result_dict = {
                "selected_rows": selected_rows_ref.current
            };
            postAjaxPromise("/copy_from_repository", result_dict)
                .then(doFlash)
                .catch(doFlash);
            return ""
        }
    }

    function _send_repository_func() {
        let pane_type = props.pane_type;
        if (!multi_select_ref.current) {
            let res_type = selected_resource_ref.current.res_type;
            let res_name = selected_resource_ref.current.name;
            $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/" + res_type, function (data) {
                    dialogFuncs.showModal("ModalDialog", {
                        title: `Share ${res_type}`,
                        field_title: `New ${res_type} Name`,
                        handleSubmit: ShareResource,
                        default_value: res_name,
                        existing_names: data.resource_names,
                        checkboxes: [],
                        handleCancel: null,
                        handleClose: dialogFuncs.hideModal,
                    })
                }
            );

            function ShareResource(new_name) {
                const result_dict = {
                    "pane_type": pane_type,
                    "res_type": res_type,
                    "res_name": res_name,
                    "new_res_name": new_name
                };
                postAjaxPromise('/send_to_repository', result_dict)
                    .then(doFlash)
                    .catch(doFlash);
            }

            return res_name
        } else {
            const result_dict = {
                "pane_type": pane_type,
                "selected_rows": selected_rows_ref.current,
            };
            postAjaxPromise('/send_to_repository', result_dict)
                .then(doFlash)
                .catch(doFlash);
            return ""
        }
    }

    function _refresh_func(callback = null) {
        _grabNewChunkWithRow(0, true, null, true, callback)
    }

    function _showOmnibar() {
        setShowOmnibar(true)
    }

    function _omnibarSelect(item) {
        let the_view = view_views(props.is_repository)[item.res_type];
        window.open($SCRIPT_ROOT + the_view + item);
        _closeOmnibar()
    }

    function _closeOmnibar() {
        setShowOmnibar(false)
    }

    function _new_notebook() {
        if (window.in_context) {
            const the_view = `${$SCRIPT_ROOT}/new_notebook_in_context`;
            postAjaxPromise(the_view, {resource_name: ""})
                .then(props.handleCreateViewer)
                .catch(doFlash);
        } else {
            window.open(`${$SCRIPT_ROOT}/new_notebook`)
        }
    }

    function _downloadJupyter() {
        let res_name = selected_resource_ref.current.name;
        dialogFuncs.showModal("ModalDialog", {
            title: `Download Notebook as Jupyter Notebook`,
            field_title: "New File Name",
            handleSubmit: (new_name) => {
                window.open(`${$SCRIPT_ROOT}/download_jupyter/` + res_name + "/" + new_name)
            },
            default_value: res_name + ".ipynb",
            existing_names: [],
            checkboxes: [],
            handleCancel: null,
            handleClose: dialogFuncs.hideModal,
        })
    }

    function _showJupyterImport() {
        dialogFuncs.showModal("FileImportDialog", {
            res_type: "project",
            allowed_file_types: ".ipynb",
            checkboxes: [],
            process_handler: _import_jupyter,
            tsocket: props.tsocket,
            combine: false,
            show_csv_options: false,
            after_upload: null,
            show_address_selector: false,
            initial_address: null,
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });
    }

    function _import_jupyter(myDropZone, setCurrentUrl) {
        let new_url = `import_jupyter/${props.library_id}`;
        myDropZone.options.url = new_url;
        setCurrentUrl(new_url);
        myDropZone.processQueue();
    }

    function _combineCollections() {
        var res_name = selected_resource_ref.current.name;
        if (!multi_select_ref.current) {
            $.getJSON(`${$SCRIPT_ROOT}get_resource_names/collection`, function (data) {
                dialogFuncs.showModal("SelectDialog", {
                    title: "Select a new collection to combine with " + res_name,
                    select_label: "Collection to Combine",
                    cancel_text: "Cancel",
                    submit_text: "Combine",
                    handleSubmit: doTheCombine,
                    option_list: data.resource_names,
                    handleClose: dialogFuncs.hideModal,
                })
            });

            function doTheCombine(other_name) {
                statusFuncs.startSpinner(true);
                const target = `${$SCRIPT_ROOT}/combine_collections/${res_name}/${other_name}`;
                $.post(target, (data) => {
                    statusFuncs.stopSpinner();
                    if (!data.success) {
                        props.addErrorDrawerEntry({title: "Error combining collections", content: data.message})
                    } else {
                        doFlash(data);
                    }
                });
            }
        } else {
            $.getJSON(`${$SCRIPT_ROOT}get_resource_names/collection`, function (data) {
                dialogFuncs.showModal("ModalDialog", {
                    title: "Combine Collections",
                    field_title: "Name for combined collection",
                    handleSubmit: CreateCombinedCollection,
                    default_value: "NewCollection",
                    existing_names: data.resource_names,
                    checkboxes: [],
                    handleCancel: null,
                    handleClose: dialogFuncs.hideModal,
                })
            });
        }

        function CreateCombinedCollection(new_name) {
            postAjaxPromise("combine_to_new_collection",
                {"original_collections": list_of_selected_ref.current, "new_name": new_name})
                .then((data) => {
                    _refresh_func();
                    data.new_row
                })
                .catch((data) => {
                    props.addErrorDrawerEntry({title: "Error combining collections", content: data.message})
                })
        }
    }

    function _downloadCollection(resource_name = null) {
        let res_name = resource_name ? resource_name : selected_resource_ref.current.name;
        dialogFuncs.showModal("ModalDialog", {
            title: "Download Collection",
            field_title: "New File Name",
            handleSubmit: (new_name) => {
                window.open(`${$SCRIPT_ROOT}/download_collection/` + res_name + "/" + new_name)
            },
            default_value: res_name,
            existing_names: [],
            checkboxes: [],
            handleCancel: null,
            handleClose: dialogFuncs.hideModal,
        })
    }

    function _displayImportResults(data) {
        let title = "Collection Created";
        let message = "";
        let number_of_errors;
        if (data.file_decoding_errors == null) {
            data.message = "No decoding errors were encounters";
            data.alert_type = "Success";
            doFlash(data);
        } else {
            message = "<b>Decoding errors were enountered</b>";
            for (let filename in data.file_decoding_errors) {
                number_of_errors = String(data.file_decoding_errors[filename].length);
                message = message + `<br>${filename}: ${number_of_errors} errors`;
            }
            props.addErrorDrawerEntry({title: title, content: message});
        }
    }

    function _showCollectionImport() {
        dialogFuncs.showModal("FileImportDialog", {
            res_type: "collection",
            allowed_file_types: ".csv,.tsv,.txt,.xls,.xlsx,.html",
            checkboxes: [{"checkname": "import_as_freeform", "checktext": "Import as freeform"}],
            process_handler: _import_collection,
            tsocket: props.tsocket,
            combine: true,
            show_csv_options: true,
            after_upload: _refresh_func,
            show_address_selector: false,
            initial_address: null,
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });
    }

    function _import_collection(myDropZone, setCurrentUrl, new_name, check_results, csv_options = null) {
        let doc_type;
        if (check_results["import_as_freeform"]) {
            doc_type = "freeform"
        } else {
            doc_type = "table"
        }
        postAjaxPromise("create_empty_collection",
            {
                "collection_name": new_name,
                "doc_type": doc_type,
                "library_id": props.library_id,
                "csv_options": csv_options
            })
            .then((data) => {
                let new_url = `append_documents_to_collection/${new_name}/${doc_type}/${props.library_id}`;
                myDropZone.options.url = new_url;
                setCurrentUrl(new_url);
                myDropZone.processQueue();
            })
            .catch((data) => {
            })
    }

    function _tile_view() {
        _view_func("/view_module/")
    }

    function _view_named_tile(res, in_new_tab = false) {
        _view_resource({name: res.name, res_type: "tile"}, "/view_module/", in_new_tab)
    }

    function _creator_view_named_tile(res, in_new_tab = false) {
        _view_resource({name: res.tile, res_type: "tile"}, "/view_in_creator/", in_new_tab)
    }

    function _creator_view() {
        _view_func("/view_in_creator/")
    }

    function _showHistoryViewer() {
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${selected_resource_ref.current.name}`)
    }

    function _compare_tiles() {
        let res_names = list_of_selected_ref.current;
        if (res_names.length == 0) return;
        if (res_names.length == 1) {
            window.open(`${$SCRIPT_ROOT}/show_tile_differ/${res_names[0]}`)
        } else if (res_names.length == 2) {
            window.open(`${$SCRIPT_ROOT}/show_tile_differ/both_names/${res_names[0]}/${res_names[1]}`)
        } else {
            doFlash({
                "alert-type": "alert-warning",
                "message": "Select only one or two tiles before launching compare"
            })
        }
    }

    function _load_tile(resource = null) {
        let res_name = resource ? resource.name : selected_resource_ref.current.name;
        postWithCallback("host", "load_tile_module_task",
            {"tile_module_name": res_name, "user_id": window.user_id},
            load_tile_response, null, props.library_id);

        function load_tile_response(data) {
            if (!data.success) {
                props.addErrorDrawerEntry({title: "Error loading tile", content: data.message})
            } else {
                doFlash(data)
            }
        }
    }

    function _unload_module(resource = null) {
        let res_name = resource ? resource.name : selected_resource_ref.current.name;
        $.getJSON(`${$SCRIPT_ROOT}/unload_one_module/${res_name}`, doFlash)
    }

    function _unload_all_tiles() {
        $.getJSON(`${$SCRIPT_ROOT}/unload_all_tiles`, doFlash)
    }

    function _new_tile(template_name) {
        $.getJSON($SCRIPT_ROOT + "get_resource_names/tile", function (data) {
                dialogFuncs.showModal("ModalDialog", {
                    title: "New Tile",
                    field_title: "New Tile Name",
                    handleSubmit: CreateNewTileModule,
                    default_value: "NewTileModule",
                    existing_names: data.resource_names,
                    checkboxes: [],
                    handleCancel: null,
                    handleClose: dialogFuncs.hideModal,
                })
            }
        );

        function CreateNewTileModule(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name,
                "last_saved": "viewer"
            };
            postAjaxPromise("/create_tile_module", result_dict)
                .then((data) => {
                    _refresh_func();
                    _.view_resource({name: new_name, res_type: "tile"}, "/view_module/");
                })
                .catch((data) => {
                    props.addErrorDrawerEntry({title: "Error creating new tile", content: data.message})
                })
        }
    }

    function _new_in_creator(template_name) {
        $.getJSON(`${$SCRIPT_ROOT}/get_resource_names/tile`, function (data) {
                dialogFuncs.showModal("ModalDialog", {
                    title: "New Tile",
                    field_title: "New Tile Name",
                    handleSubmit: CreateNewTileModule,
                    default_value: "NewTileModule",
                    existing_names: data.resource_names,
                    checkboxes: [],
                    handleCancel: null,
                    handleClose: dialogFuncs.hideModal,
                })
            }
        );

        function CreateNewTileModule(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name,
                "last_saved": "creator"
            };
            postAjaxPromise("/create_tile_module", result_dict)
                .then((data) => {
                    _refresh_func();
                    _view_resource({name: String(new_name), res_type: "tile"}, "/view_in_creator/");
                })
                .catch((data) => {
                    props.addErrorDrawerEntry({title: "Error creating new tile", content: data.message})
                })
        }
    }

    function _new_list(template_name) {
        $.getJSON(`${$SCRIPT_ROOT}/get_resource_names/list`, function (data) {
                dialogFuncs.showModal("ModalDialog", {
                    title: "New List Resource",
                    field_title: "New List Name",
                    handleSubmit: CreateNewListResource,
                    default_value: "NewListResource",
                    existing_names: data.resource_names,
                    checkboxes: [],
                    handleCancel: null,
                    handleClose: dialogFuncs.hideModal,
                })
            }
        );

        function CreateNewListResource(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name
            };
            postAjaxPromise("/create_list", result_dict)
                .then((data) => {
                    _refresh_func();
                    _view_resource({name: String(new_name), res_type: "list"}, "/view_list/")
                })
                .catch((data) => {
                    props.addErrorDrawerEntry({title: "Error creating new list resource", content: data.message})
                })
        }
    }

    function _add_list(myDropZone, setCurrentUrl) {
        let new_url = `import_list/${props.library_id}`;
        myDropZone.options.url = new_url;
        setCurrentUrl(new_url);
        myDropZone.processQueue();
    }

    function _showListImport() {
        dialogFuncs.showModal("FileImportDialog", {
            res_type: "list",
            allowed_file_types: "text/*",
            checkboxes: [],
            process_handler: _add_list,
            tsocket: props.tsocket,
            combine: false,
            show_csv_options: false,
            after_upload: null,
            show_address_selector: false,
            initial_address: null,
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });
    }

    function _add_to_pool(myDropZone, setCurrentUrl, current_value) {
        let new_url = `import_pool/${props.library_id}`;
        myDropZone.options.url = new_url;
        setCurrentUrl(new_url);
        myDropZone.processQueue();
    }

    // function _showPoolImport() {
    //     dialogFuncs.showModal("FileImportDialog", {
    //         res_type: "pool",
    //         allowed_file_types: null,
    //         checkboxes: [],
    //         process_handler: _add_to_pool,
    //         tsocket: props.tsocket,
    //         combine: false,
    //         show_csv_options: false,
    //         after_upload: null,
    //         show_address_selector: true,
    //         initial_address: "/mydisk",
    //         handleClose: dialogFuncs.hideModal,
    //         handleCancel: null
    //     });
    // }

    function _new_code(template_name) {
        $.getJSON(`${$SCRIPT_ROOT}/get_resource_names/code`, function (data) {
                dialogFuncs.showModal("ModalDialog", {
                    title: "New Code Resource",
                    field_title: "New Code Resource Name",
                    handleSubmit: CreateNewCodeResource,
                    default_value: "NewCodeResource",
                    existing_names: data.resource_names,
                    checkboxes: [],
                    handleCancel: null,
                    handleClose: dialogFuncs.hideModal,
                })
            }
        );

        function CreateNewCodeResource(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name
            };
            postAjaxPromise("/create_code", result_dict)
                .then((data) => {
                    _refresh_func();
                    _view_resource({name: String(new_name), res_type: "code"}, "/view_code/")
                })
                .catch((data) => {
                    props.addErrorDrawerEntry({title: "Error creating new code resource", content: data.message})
                })
        }
    }

    function get_left_pane_height() {
        let left_pane_height;
        if (tr_bounding_top.current) {
            left_pane_height = window.innerHeight - tr_bounding_top.current - BOTTOM_MARGIN
        } else if (table_ref && table_ref.current) {
            left_pane_height = window.innerHeight - table_ref.current.getBoundingClientRect().top - BOTTOM_MARGIN
        } else {
            table_width = left_width - 150;
            left_pane_height = props.usable_height - 100
        }
        return left_pane_height
    }

    function _menu_funcs() {
        return {
            view_func: _view_func,
            send_repository_func: _send_repository_func,
            repository_copy_func: _repository_copy_func,
            duplicate_func: _duplicate_func,
            refresh_func: _refresh_func,
            delete_func: _delete_func,
            rename_func: _rename_func,
            new_notebook: _new_notebook,
            downloadJupyter: _downloadJupyter,
            showJupyterImport: _showJupyterImport,
            combineCollections: _combineCollections,
            showCollectionImport: _showCollectionImport,
            downloadCollection: _downloadCollection,
            new_in_creator: _new_in_creator,
            creator_view: _creator_view,
            tile_view: _tile_view,
            creator_view_named_tile: _creator_view_named_tile,
            view_named_tile: _view_named_tile,
            load_tile: _load_tile,
            unload_module: _unload_module,
            unload_all_tiles: _unload_all_tiles,
            showHistoryViewer: _showHistoryViewer,
            compare_tiles: _compare_tiles,
            new_list: _new_list,
            showListImport: _showListImport,
            // showPoolImport: _showPoolImport,
            new_code: _new_code
        }
    }

    let new_button_groups;
    let uwidth = props.usable_width;
    let left_width = (uwidth) * left_width_fraction_ref.current;
    const primary_mdata_fields = ["name", "created", "created_for_sort",
        "updated", "updated_for_sort", "tags", "notes"];
    const ignore_fields = ["doc_type", "size_for_sort", "res_type"];
    let additional_metadata = {};
    let selected_resource_icon = null;
    for (let field in selected_resource_ref.current) {
        if (selected_rows_ref.current.length == 1 && selected_resource_ref.current.res_type == "tile" && field == "icon") {
            selected_resource_icon = selected_resource_ref.current["icon"]
        }
        if (!primary_mdata_fields.includes(field) && !ignore_fields.includes(field)
            && !field.startsWith("icon:")) {
            additional_metadata[field] = selected_resource_ref.current[field]
        }
    }
    if (Object.keys(additional_metadata).length == 0) {
        additional_metadata = null
    }

// let right_pane;
    let split_tags = selected_resource_ref.current.tags == "" ? [] : selected_resource_ref.current.tags.split(" ");
    let outer_style = {marginTop: 0, marginLeft: 5, overflow: "auto", padding: 15, marginRight: 0, height: "100%"};
    let right_pane = (
        <CombinedMetadata tags={split_tags}
                          elevation={2}
                          name={selected_resource_ref.current.name}
                          created={selected_resource_ref.current.created}
                          updated={selected_resource_ref.current.updated}
                          notes={selected_resource_ref.current.notes}
                          icon={selected_resource_icon}
                          handleChange={_handleMetadataChange}
                          res_type={selected_resource_ref.current.res_type}
                          pane_type={props.pane_type}
                          outer_style={outer_style}
                          handleNotesBlur={null}
                          additional_metadata={additional_metadata}
                          readOnly={props.is_repository}
        />
    );

    let th_style = {
        "display": "inline-block",
        "verticalAlign": "top",
        "maxHeight": "100%",
        "overflowY": "scroll",
        "overflowX": "scroll",
        "lineHeight": 1,
        "whiteSpace": "nowrap",
    };

    let MenubarClass = props.MenubarClass;

    let table_width;
    const left_pane_height = get_left_pane_height();
    if (table_ref && table_ref.current) {
        table_width = left_width - table_ref.current.offsetLeft + top_ref.current.offsetLeft;
    } else {
        table_width = left_width - 150;
    }

    let key_bindings = [
        [["up"], () => _handleArrowKeyPress("ArrowUp")],
        [["down"], () => _handleArrowKeyPress("ArrowDown")],
        [["esc"], _unsearch]
    ];

    let filter_buttons = [];
    for (let rtype of ["all"].concat(res_types)) {
        filter_buttons.push(
            <Tooltip2 content={rtype}
                      key={rtype}
                      placement="top"
                      hoverOpenDelay={700}
                      intent="warning">
                <Button icon={icon_dict[rtype]}
                        minimal={true}
                        active={rtype == filterTypeRef.current}
                        onClick={() => {
                            _setFilterType(rtype)
                        }}/>
            </Tooltip2>
        )
    }

    let left_pane = (
        <Fragment>
            <div className="d-flex flex-row" style={{maxHeight: "100%", position: "relative"}}>
                <div className="d-flex justify-content-around"
                     style={{
                         paddingRight: 10,
                         maxHeight: left_pane_height
                     }}>
                    <TagButtonList tag_list={tag_list}
                                   expanded_tags={expanded_tags_ref.current}
                                   active_tag={active_tag_ref.current}
                                   updateTagState={_update_search_state}
                                   doTagDelete={_doTagDelete}
                                   doTagRename={_doTagRename}
                    />
                </div>
                <div ref={table_ref}
                     className={props.pane_type + "-pane"}
                     style={{
                         width: table_width,
                         maxWidth: total_width,
                         maxHeight: left_pane_height - 20, // The 20 is for the marginTop and padding
                         overflowY: "clip",
                         marginTop: 15,
                         padding: 5
                     }}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        {props.pane_type == "all" &&
                            <FormGroup label="Filter:" inline={true} style={{marginBottom: 0}}>
                                {filter_buttons}
                            </FormGroup>
                        }
                        <SearchForm allow_search_inside={props.allow_search_inside}
                                    allow_search_metadata={props.allow_search_metadata}
                                    allow_show_hidden={true}
                                    update_search_state={_update_search_state}
                                    search_string={search_string_ref.current}
                                    search_inside={search_inside_ref.current}
                                    show_hidden={show_hidden_ref.current}
                                    search_metadata={search_metadata_ref.current}
                        />
                    </div>
                    <BpSelectorTable data_dict={data_dict_ref.current}
                                     rowChanged={rowChanged}
                                     columns={props.columns}
                                     num_rows={num_rows}
                                     open_resources={props.open_resources}
                                     sortColumn={_set_sort_state}
                                     selectedRegions={selectedRegionsRef.current}
                                     communicateColumnWidthSum={set_total_width}
                                     onSelection={_onTableSelection}
                                     keyHandler={_handleTableKeyPress}
                                     initiateDataGrab={_grabNewChunkWithRow}
                                     renderBodyContextMenu={_renderBodyContextMenu}
                                     handleRowDoubleClick={_handleRowDoubleClick}
                    />
                </div>
            </div>
        </Fragment>
    );
    let selected_types = _selectedTypes();
    let selected_type = selected_types.length == 1 ? selected_resource_ref.current.res_type : "multi";
    return (
        <Fragment>
            <MenubarClass selected_resource={selected_resource_ref.current}
                          connection_status={props.connection_status}
                          registerOmniGetter={props.registerOmniGetter}
                          multi_select={multi_select_ref.current}
                          list_of_selected={list_of_selected_ref.current}
                          selected_rows={selected_rows_ref.current}
                          selected_type={selected_type}
                          {..._menu_funcs()}
                          sendContextMenuItems={setContextMenuItems}
                          view_resource={_view_resource}
                          open_raw={_open_raw}
                          {...props.errorDrawerFuncs}
                          handleCreateViewer={props.handleCreateViewer}
                          library_id={props.library_id}
                          controlled={props.controlled}
                          am_selected={props.am_selected}
                          tsocket={props.tsocket}
            />

            <div ref={top_ref} className="d-flex flex-column">
                <div style={{width: uwidth, height: props.usable_height}}>
                    <HorizontalPanes
                        available_width={uwidth}
                        available_height={props.usable_height}
                        show_handle={true}
                        left_pane={left_pane}
                        right_pane={right_pane}
                        right_pane_overflow="auto"
                        initial_width_fraction={.75}
                        scrollAdjustSelectors={[".bp5-table-quadrant-scroll-container"]}
                        handleSplitUpdate={_handleSplitResize}
                        handleResizeStart={_handleSplitResizeStart}
                        handleResizeEnd={_handleSplitResizeEnd}
                    />
                </div>
                <KeyTrap global={true} bindings={key_bindings}/>
            </div>
        </Fragment>
    )
}

LibraryPane = memo(LibraryPane);

LibraryPane.propTypes = {
    columns: PropTypes.object,
    pane_type: PropTypes.string,
    open_resources: PropTypes.array,
    allow_search_inside: PropTypes.bool,
    allow_search_metadata: PropTypes.bool,
    MenubarClass: PropTypes.object,
    updatePaneState: PropTypes.func,
    is_repository: PropTypes.bool,
    left_width_fraction: PropTypes.number,
    selected_resource: PropTypes.object,
    selected_rows: PropTypes.array,
    sort_field: PropTypes.string,
    sorting_field: PropTypes.string,
    sort_direction: PropTypes.string,
    filterType: PropTypes.string,
    multi_select: PropTypes.bool,
    list_of_selected: PropTypes.array,
    search_string: PropTypes.string,
    search_inside: PropTypes.bool,
    search_metadata: PropTypes.bool,
    show_hidden: PropTypes.bool,
    search_tag: PropTypes.string,
    tag_button_state: PropTypes.object,
    contextItems: PropTypes.array,
    library_id: PropTypes.string

};

LibraryPane.defaultProps = {
    columns: {
        "name": {"sort_field": "name", "first_sort": "ascending"},
        "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
        "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
        "tags": {"sort_field": "tags", "first_sort": "ascending"}
    },
    is_repository: false,
    tsocket: null,
};


