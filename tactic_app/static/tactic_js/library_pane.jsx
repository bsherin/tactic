// noinspection JSValidateTypes,JSDeprecatedSymbols

import React from "react";
import {Fragment, useState, useRef, useEffect, memo, useContext, useMemo} from "react";

import {Menu, MenuItem, MenuDivider, Button, useHotkeys} from "@blueprintjs/core";
import {Tooltip2} from "@blueprintjs/popover2"
import {Regions} from "@blueprintjs/table";
import _ from 'lodash';

import {CombinedMetadata, icon_dict} from "./blueprint_mdata_fields";
import {HorizontalPanes} from "./resizing_layouts2";
import {postAjaxPromise, postPromise} from "./communication_react"
import {useSize} from "./sizing_tools";

import {doFlash} from "./toaster"
import {useCallbackStack, useConstructor, useStateAndRef} from "./utilities_react";
import {ThemeContext} from "./theme";

import {DialogContext} from "./modal_react";
import {StatusContext} from "./toaster"
import {ErrorDrawerContext} from "./error_drawer";
import {LibraryTablePane} from "./library_table_pane";

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

function LibraryPane(props) {
    props = {
        columns: {
            "name": {"first_sort": "ascending"},
            "created": {"first_sort": "descending"},
            "updated": {"first_sort": "ascending"},
            "tags": {"first_sort": "ascending"}
        },
        is_repository: false,
        tsocket: null,
        ...props
    };

    const hotkeys = useMemo(
        () => [
            {
                combo: "Enter",
                global: false,
                group: "Library",
                label: "Open Selected Resource",
                onKeyDown: async () => {
                    await _view_func()
                }
            },
            {
                combo: "ArrowDown",
                global: false,
                group: "Library",
                label: "Move Selection Down",
                onKeyDown: async ()=>{await _handleArrowKeyPress("ArrowDown")},
            },
            {
                combo: "ArrowUp",
                global: false,
                group: "Library",
                label: "Move Selection Up",
                onKeyDown: async ()=>{await _handleArrowKeyPress("ArrowUp")}
            },
            {
                combo: "Escape",
                global: false,
                group: "Library",
                label: "Undo Search",
                onKeyDown: _unsearch
            },
        ],
        [_handleArrowKeyPress, _unsearch],
    );

    const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);
    const top_ref = useRef(null);
    const previous_search_spec = useRef(null);
    const socket_counter = useRef(null);
    const blank_selected_resource = useRef({});

    const [data_dict, set_data_dict, data_dict_ref] = useStateAndRef({});
    const [num_rows, set_num_rows] = useState(0);
    const [tag_list, set_tag_list, tag_list_ref] = useStateAndRef([]);
    const [contextMenuItems, setContextMenuItems] = useState([]);
    
    const [selected_resource, set_selected_resource, selected_resource_ref] = useStateAndRef({
        "name": "",
        "_id": "",
        "tags": "",
        "notes": "",
        "updated": "",
        "created": ""
    });
    const [selected_rows, set_selected_rows, selected_rows_ref] = useStateAndRef([]);
    const [expanded_tags, set_expanded_tags, expanded_tags_ref] = useStateAndRef([]);
    const [active_tag, set_active_tag, active_tag_ref] = useStateAndRef("all");
    const [tagRoot, setTagRoot] = useState("all");

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
    const selectedTypeRef = useRef(null);

    const [usable_width, usable_height, topX, topY] = useSize(top_ref, 0, "LibraryPane");

    const theme = useContext(ThemeContext);
    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const stateSetters = {
        data_dict: set_data_dict,
        num_rows: set_num_rows,
        tag_list: set_tag_list,
        tagRoot: setTagRoot,
        contextMenuItems: setContextMenuItems,
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
        initSocket();
        _grabNewChunkWithRow(0).then(() => {});
    }, []);

    const pushCallback = useCallbackStack("library_home");

    function setState(new_state, callback = null) {
        for (let attr in new_state) {
            stateSetters[attr](new_state[attr])
        }
        pushCallback(callback)
    }

    function initSocket() {
        if ((props.tsocket != null) && (!props.is_repository)) {
            props.tsocket.attachListener(`update-selector-row`, _handleRowUpdate);
            props.tsocket.attachListener(`refresh-selector`, _refresh_func);
        } else if ((props.tsocket != null) && (props.is_repository)) {
            props.tsocket.attachListener(`update-repository-selector-row`, _handleRowUpdate);
            props.tsocket.attachListener(`refresh-repository-selector`, _refresh_func);
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

    async function _setFilterType(rtype) {
        if (rtype == filterTypeRef.current) return;
        if (!multi_select_ref.current) {
            let sres = selected_resource_ref.current;
            if (sres.name != "" && (sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
                await _saveFromSelectedResource()
            }
        }
        setFilterType(rtype);
        clearSelected();
        pushCallback(async () => {
            await _grabNewChunkWithRow(0, true, null, true)
        });
    }

    function clearSelected() {
        set_selected_resource({"name": "", "_id": "", "tags": "", "notes": "", "updated": "", "created": ""});
        set_list_of_selected([]);
        set_selected_rows([]);
    }

    async function _onTableSelection(regions) {
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
        await _handleRowSelection(selected_rows);
        setSelectedRegions(revised_regions);
    }

    async function _grabNewChunkWithRow(row_index, flush = false, spec_update = null, select = false, select_by_name = null, callback = null) {
        let search_spec = _getSearchSpec();
        if (spec_update) {
            search_spec = Object.assign(search_spec, spec_update)
        }
        if (search_spec.active_tag && search_spec.active_tag[0] != "/") {
            search_spec.active_tag = "/" + search_spec.active_tag
        }
        let args = {
            pane_type: filterTypeRef.current,
            search_spec: search_spec,
            row_number: row_index,
            is_repository: props.is_repository
        };
        let data;
        try {
            data = await postAjaxPromise("grab_all_list_chunk", args);
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
        } catch (e) {
            errorDrawerFuncs.addFromError("Error grabbing resource chunk", e);
        }
    }

    async function _handleRowUpdate(res_dict) {
        let res_name = res_dict.name;
        let ind;
        let new_data_dict;
        let new_state;
        let _id;
        let event_type = res_dict.event_type;
        delete res_dict.event_type;
        switch (event_type) {
            case "update":
                if ("_id" in res_dict) {
                    _id = res_dict._id;
                    ind = get_data_dict_index_from_id(res_dict._id);
                } else {
                    ind = get_data_dict_index(res_name, res_dict.res_type);
                    if (ind) {
                        _id = data_dict_ref.current[ind]._id
                    }
                }
                if (!ind) return;
                new_data_dict = _.cloneDeep(data_dict_ref.current);
                let the_row = new_data_dict[ind];
                for (let field in res_dict) {
                    the_row[field] = res_dict[field];
                }
                new_state = {data_dict: new_data_dict, rowChanged: rowChanged + 1};
                if ("tags" in res_dict) {
                    let data_dict = {
                        pane_type: props.pane_type,
                        is_repository: props.is_repository,
                        show_hidden: show_hidden_ref.current
                    };
                    let data = await postAjaxPromise("get_tag_list", data_dict);
                    let all_tags = data.tag_list;
                    set_tag_list(all_tags);
                }
                if (_id == selected_resource_ref.current._id) {
                    set_selected_resource(the_row);
                    pushCallback(() => setState(new_state))
                } else {
                    setState(new_state);
                }
                break;
            case "insert":
                await _grabNewChunkWithRow(0, true, null, false, res_name);
                break;
            case "delete":
                if ("_id" in res_dict) {
                    ind = parseInt(get_data_dict_index_from_id(res_dict._id));
                } else {
                    ind = parseInt(get_data_dict_index(res_name, res_dict.res_type));
                }
                new_data_dict = _.cloneDeep(data_dict_ref.current);
                let is_last = ind == new_data_dict.length - 1;

                let selected_ind = null;
                if ("_id" in selected_resource_ref.current) {
                    selected_ind = parseInt(get_data_dict_index_from_id(selected_resource_ref.current._id));
                }
                let is_selected_row = ind && ind == selected_ind;
                let new_selected_ind = selected_ind;
                if (selected_ind > ind) {
                    new_selected_ind = selected_ind - 1;
                }
                delete new_data_dict[String(ind)];
                new_state = {data_dict: new_data_dict, rowChanged: rowChanged + 1};
                setState(new_state, async () => {
                    await _grabNewChunkWithRow(ind, false, null, false, null, () => {
                        if (new_selected_ind) {
                            _selectRow(new_selected_ind)
                        } else {
                            clearSelected()
                        }
                    })
                });
                break;
            default:
                return;
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

    function _match_row_by_id(row1, row2) {
        return row1._id == row2._id
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
        for (let index in data_dict_ref.current) {
            if (_match_row(data_dict_ref.current[index], {name: name, res_type: res_type})) {
                return index
            }
        }
        return null
    }

    function get_data_dict_index_from_id(_id) {
        for (let index in data_dict_ref.current) {
            if (_match_row_by_id(data_dict_ref.current[index], {_id: _id})) {
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

    async function _saveFromSelectedResource() {
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
        try {
            await postAjaxPromise("save_metadata", result_dict)
        } catch (e) {
            errorDrawerFuncs.addFromError(`Error updating resource ${result_dict.res_name}`, e)
        }
    }

    async function _overwriteCommonTags() {
        const result_dict = {
            "selected_rows": selected_rows_ref.current,
            "tags": selected_resource_ref.current.tags,
        };
        let new_tags = _extractNewTags(selected_resource_ref.current.tags);
        try {
            await postAjaxPromise("overwrite_common_tags", result_dict)
        } catch (e) {
            errorDrawerFuncs.addFromError("Error overwriting tags", e)
        }
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

    function _handleRowDoubleClick(row_dict) {
        let view_view = view_views(props.is_repository)[row_dict.res_type];
        if (view_view == null) return;
        statusFuncs.setStatus({show_spinner: true, status_message: "Opening ..."});
        set_selected_resource(row_dict);
        set_multi_select(false);
        set_list_of_selected([row_dict.name]);
        set_selected_rows([row_dict]);
        pushCallback(async () => {
            if (window.in_context) {
                const re = new RegExp("/$");
                view_view = view_view.replace(re, "_in_context");
                let data;
                try {
                    data = await postAjaxPromise(view_view,
                        {context_id: context_id, resource_name: row_dict.name});
                    props.handleCreateViewer(data, statusFuncs.clearStatus);
                } catch (e) {
                    statusFuncs.clearStatus();
                    errorDrawerFuncs.addFromError(`Error handling double click with view ${view_view}`, e)
                }
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

    async function _handleRowSelection(selected_rows) {
        if (!multi_select_ref.current) {
            let sres = selected_resource_ref.current;
            if (sres.name != "" && get_data_dict_entry(sres.name, sres.res_type) &&
                (sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
                await _saveFromSelectedResource()
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

    async function _unsearch() {
        if (search_string_ref.current != "") {
            set_search_string("")
        } else if (active_tag_ref.current != "all") {
            _update_search_state({"active_tag": "all"})
        } else if (props.pane_type == "all" && filterTypeRef.current != "all") {
            await _setFilterType("all")
        }
    }

    function _update_search_state(new_state) {
        setState(new_state);
        pushCallback(async () => {
            if (search_spec_changed(new_state)) {
                clearSelected();
                await _grabNewChunkWithRow(0, true, new_state, true)
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

    function _set_sort_state(column_name, direction) {
        let spec_update = {sort_field: column_name, sort_direction: direction};
        set_sort_field(column_name);
        set_sort_direction(direction);
        pushCallback(async () => {
            if (search_spec_changed(spec_update)) {
                await _grabNewChunkWithRow(0, true, spec_update, true)
            }
        })
    }

    async function _handleArrowKeyPress(key) {
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
        await _selectRow(new_index)
    }

    async function _selectRow(new_index) {
        if (!Object.keys(data_dict_ref.current).includes(String(new_index))) {
            await _grabNewChunkWithRow(new_index, false, null, false, null, () => {
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

    async function _view_func(the_view = null) {
        if (the_view == null) {
            the_view = view_views(props.is_repository)[selected_resource_ref.current.res_type]
        }
        statusFuncs.setStatus({show_spinner: true, status_message: "Opening ..."});
        if (window.in_context) {
            const re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            let data;
            try {
                data = await postAjaxPromise(the_view, {
                    context_id: context_id,
                    resource_name: selected_resource_ref.current.name
                });
                props.handleCreateViewer(data, statusFuncs.clearStatus)
            } catch (e) {
                statusFuncs.clearstatus();
                errorDrawerFuncs.addFromError(`Error viewing with view ${the_view}`, e)
            }
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
            statusFuncs.statusMessage("Only Freeform documents can be raw opened", 5);
        }
    }

    async function _view_resource(selected_resource, the_view = null, force_new_tab = false) {
        let resource_name = selected_resource.name;
        if (the_view == null) {
            the_view = view_views(props.is_repository)[selected_resource.res_type]
        }
        statusFuncs.setStatus({show_spinner: true, status_message: "Opening ..."});
        if (window.in_context && !force_new_tab) {
            const re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            try {
                let data = await postAjaxPromise(the_view, {context_id: context_id, resource_name: resource_name});
                props.handleCreateViewer(data, statusFuncs.clearStatus);
            } catch (e) {
                statusFuncs.clearstatus();
                errorDrawerFuncs.addFromError(`Error viewing resource ${resource_name}`, e)

            }
        } else {
            statusFuncs.clearStatus();
            window.open($SCRIPT_ROOT + the_view + resource_name)
        }

    }

    async function _duplicate_func(row = null) {
        let the_row = row ? row : selected_resource_ref.current;
        let res_name = the_row.name;
        let res_type = the_row.res_type;
        try {
            let data = await postAjaxPromise("get_resource_names/" + res_type, {});
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: `Duplicate ${res_type}`,
                field_title: "New Name",
                default_value: res_name,
                existing_names: data.resource_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });

            let duplicate_view = duplicate_views()[res_type];
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": res_name,
                "library_id": props.library_id,
                "is_repository": false
            };
            await postAjaxPromise(duplicate_view, result_dict)
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error duplicating resource ${res_name}`, e)
            }
            return
        }
    }

    async function _delete_func(resource) {
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
        try {
            await dialogFuncs.showModalPromise("ConfirmDialog", {
                title: "Delete resources",
                text_body: confirm_text,
                cancel_text: "do nothing",
                submit_text: "delete",
                handleClose: dialogFuncs.hideModal,
            });
            await postAjaxPromise("delete_resource_list", {"resource_list": res_list})
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error duplicating resource ${res_name}`, e)
            }
            return
        }
    }

    async function _rename_func(row = null) {
        let res_type;
        let res_name;
        if (!row) {
            res_type = selected_resource_ref.current.res_type;
            res_name = selected_resource_ref.current.name;
        } else {
            res_type = row.res_type;
            res_name = row.name;
        }
        try {
            let data = await postAjaxPromise("get_resource_names/" + res_type, {});
            const res_names = data["resource_names"];
            const index = res_names.indexOf(res_name);
            if (index >= 0) {
                res_names.splice(index, 1);
            }
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: `Rename ${res_type}`,
                field_title: "New Name",
                handleClose: dialogFuncs.hideModal,
                default_value: res_name,
                existing_names: res_names,
                checkboxes: []
            });
            const the_data = {"new_name": new_name};
            await postAjaxPromise(`rename_resource/${res_type}/${res_name}`, the_data);
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error renaming resource ${res_name}`, e)
            }
            return
        }
    }

    async function _repository_copy_func() {
        if (!multi_select_ref.current) {
            let res_type = selected_resource_ref.current.res_type;
            let res_name = selected_resource_ref.current.name;
            try {
                let data = await postAjaxPromise("get_resource_names/" + res_type, {});
                let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                    title: `Import ${res_type}`,
                    field_title: "New Name",
                    default_value: res_name,
                    existing_names: data.resource_names,
                    checkboxes: [],
                    handleClose: dialogFuncs.hideModal,
                });
                const result_dict = {
                    "res_type": res_type,
                    "res_name": res_name,
                    "new_res_name": new_name
                };
                await postAjaxPromise("/copy_from_repository", result_dict);
                statusFuncs.statusMessage(`Imported Resource ${res_name}`);
                return res_name
            } catch (e) {
                if (e != "canceled") {
                    errorDrawerFuncs.addFromError("Error getting resources names", e)
                }
                return
            }
        } else {
            const result_dict = {
                "selected_rows": selected_rows_ref.current
            };
            try {
                await postAjaxPromise("/copy_from_repository", result_dict);
                statusFuncs.statusMessage(`Imported Resources`)
            } catch (e) {
                errorDrawerFuncs.addFromError("Error importing resources", e)
            }
            return ""
        }
    }

    async function _send_repository_func() {
        let pane_type = props.pane_type;
        if (!multi_select_ref.current) {
            let res_type = selected_resource_ref.current.res_type;
            let res_name = selected_resource_ref.current.name;
            try {
                let data = await postAjaxPromise("get_repository_resource_names/" + res_type, {});
                let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                    title: `Share ${res_type}`,
                    field_title: `New ${res_type} Name`,
                    default_value: res_name,
                    existing_names: data.resource_names,
                    checkboxes: [],
                    handleClose: dialogFuncs.hideModal,
                });
                const result_dict = {
                    "pane_type": pane_type,
                    "res_type": res_type,
                    "res_name": res_name,
                    "new_res_name": new_name
                };
                await postAjaxPromise('/send_to_repository', result_dict);
                statusFuncs.statusMessage(`Shared resource ${res_name}`)
            } catch (e) {
                if (e != "canceled") {
                    errorDrawerFuncs.addFromError(`Error sharing resource ${res_name}`, e)
                }
                return
            }
        } else {
            const result_dict = {
                "pane_type": pane_type,
                "selected_rows": selected_rows_ref.current,
            };
            try {
                await postAjaxPromise('/send_to_repository', result_dict);
                statusFuncs.statusMessage("Shared resources")
            } catch (e) {
                errorDrawerFuncs.addFromError("Error sharing resources", e)
            }
            return ""
        }
    }

    async function _refresh_func(callback = null) {
        await _grabNewChunkWithRow(0, true, null, true, callback)
    }

    async function _new_notebook() {
        if (window.in_context) {
            try {
                const the_view = "new_notebook_in_context";
                let data = await postAjaxPromise(the_view, {resource_name: ""});
                props.handleCreateViewer(data)
            } catch (e) {
                errorDrawerFuncs.addFromError("Error creating new notebook", e)
            }
        } else {
            window.open(`${$SCRIPT_ROOT}/new_notebook`)
        }
    }

    async function _new_project() {
        if (window.in_context) {
            try {
                const the_view = "new_project_in_context";
                let data = await postAjaxPromise(the_view, {resource_name: ""});
                props.handleCreateViewer(data)
            } catch (e) {
                errorDrawerFuncs.addFromError("Error creating new project", e)
            }
        } else {
            window.open(`${$SCRIPT_ROOT}/new_project`)
        }
    }

    async function _downloadJupyter() {
        let res_name = selected_resource_ref.current.name;
        try {
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: `Download Notebook as Jupyter Notebook`,
                field_title: "New File Name",
                default_value: res_name + ".ipynb",
                existing_names: [],
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            window.open(`${$SCRIPT_ROOT}/download_jupyter/` + res_name + "/" + new_name)
        } catch (e) {
            errorDrawerFuncs.addFromError("Error downloading jupyter notebook", e)
        }
    }

    function _showJupyterImport() {
        dialogFuncs.showModal("FileImportDialog", {
            res_type: "project",
            allowed_file_types: ".ipynb",
            checkboxes: [],
            chunking: false,
            chunkSize: null,
            forceChunking: false,
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

    async function _combineCollections() {
        var res_name = selected_resource_ref.current.name;
        if (!multi_select_ref.current) {
            try {
                let data = await postAjaxPromise("get_resource_names/collection", {});
                let other_name = await dialogFuncs.showModalPromise("SelectDialog", {
                    title: "Select a new collection to combine with " + res_name,
                    select_label: "Collection to Combine",
                    cancel_text: "Cancel",
                    submit_text: "Combine",
                    option_list: data.resource_names,
                    handleClose: dialogFuncs.hideModal,
                });
                statusFuncs.startSpinner(true);
                const target = `combine_collections/${res_name}/${other_name}`;
                await postAjaxPromise(target, {});
                statusFuncs.stopSpinner();
                statusFuncs.statusMessage("Combined Collections");

            } catch (e) {
                if (e != "canceled") {
                    errorDrawerFuncs.addFromError(`Error combining collections`, e)
                }
                statusFuncs.stopSpinner();
                return
            }
        } else {
            try {
                let data = await postAjaxPromise("get_resource_names/collection", {});
                let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                    title: "Combine Collections",
                    field_title: "Name for combined collection",
                    default_value: "NewCollection",
                    existing_names: data.resource_names,
                    checkboxes: [],
                    handleClose: dialogFuncs.hideModal,
                });
                await postAjaxPromise("combine_to_new_collection",
                    {"original_collections": list_of_selected_ref.current, "new_name": new_name});
            } catch (e) {
                if (e != "canceled") {
                    errorDrawerFuncs.addFromError(`Error combining collections`, e)
                }
                statusFuncs.stopSpinner();
                return
            }
        }
    }

    async function _downloadCollection(resource_name = null) {
        let res_name = resource_name ? resource_name : selected_resource_ref.current.name;
        try {
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "Download Collection",
                field_title: "New File Name",
                default_value: res_name,
                existing_names: [],
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            window.open(`${$SCRIPT_ROOT}/download_collection/` + res_name + "/" + new_name)
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error combing collections`, e)
            }
            return
        }
    }

    function _displayImportResults(data) {
        let title = "Collection Created";
        let message = "";
        let number_of_errors;
        if (data.file_decoding_errors == null) {
            statusFuncs.statusMessage("No import errors");
        } else {
            message = "<b>Decoding errors were enountered</b>";
            for (let filename in data.file_decoding_errors) {
                number_of_errors = String(data.file_decoding_errors[filename].length);
                message = message + `<br>${filename}: ${number_of_errors} errors`;
            }
            errorDrawerFuncs.addErrorDrawerEntry({title: title, content: message});
        }
    }

    function _showCollectionImport() {
        dialogFuncs.showModal("FileImportDialog", {
            res_type: "collection",
            allowed_file_types: ".csv,.tsv,.txt,.xls,.xlsx,.html",
            checkboxes: [{"checkname": "import_as_freeform", "checktext": "Import as freeform"}],
            process_handler: _import_collection,
            chunking: false,
            chunkSize: null,
            forceChunking: false,
            tsocket: props.tsocket,
            combine: true,
            show_csv_options: true,
            after_upload: null,
            show_address_selector: false,
            initial_address: null,
            handleClose: dialogFuncs.hideModal,
            handleCancel: null
        });
    }

    async function _import_collection(myDropZone, setCurrentUrl, new_name, check_results, csv_options = null) {
        let doc_type = check_results["import_as_freeform"] ? "freeform" : "table";
        try {
            await postAjaxPromise("create_empty_collection", {
                "collection_name": new_name,
                "doc_type": doc_type,
                "library_id": props.library_id,
                "csv_options": csv_options
            });
            let new_url = `append_documents_to_collection/${new_name}/${doc_type}/${props.library_id}`;
            myDropZone.options.url = new_url;
            setCurrentUrl(new_url);
            myDropZone.processQueue();

        } catch (e) {
            errorDrawerFuncs.addFromError("Error importing document", e);
        }
    }

    async function _tile_view() {
        await _view_func("/view_module/")
    }

    async function _view_named_tile(res, in_new_tab = false) {
        await _view_resource({name: res.name, res_type: "tile"}, "/view_module/", in_new_tab)
    }

    async function _creator_view_named_tile(res, in_new_tab = false) {
        await _view_resource({name: res.tile, res_type: "tile"}, "/view_in_creator/", in_new_tab)
    }

    async function _creator_view() {
        await _view_func("/view_in_creator/")
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

    async function _load_tile(resource = null) {
        let res_name = resource ? resource.name : selected_resource_ref.current.name;
        try {
            await postPromise("host", "load_tile_module_task",
                {"tile_module_name": res_name, "user_id": window.user_id});
            statusFuncs.statusMessage(`Loaded tile ${res_name}`)
        } catch (e) {
            errorDrawerFuncs.addFromError("Error loading tile", e);
        }
    }

    async function _unload_module(resource = null) {
        let res_name = resource ? resource.name : selected_resource_ref.current.name;
        try {
            await postAjaxPromise(`unload_one_module/${res_name}`, {});
            statusFuncs.statusMessage("Tile unloaded")
        } catch (e) {
            errorDrawerFuncs.addFromError("Error unloading tile", e);
        }
    }

    async function _unload_all_tiles() {
        try {
            await postAjaxPromise(`unload_all_tiles`, {});
            statusFuncs.statusMessage("Unloaded all tiles")
        } catch (e) {
            errorDrawerFuncs.addFromError("Error unloading tiles", e);
        }
    }

    async function _new_tile(template_name) {
        try {
            let data = await postAjaxPromise(`get_resource_names/tile`, {});
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "New Tile",
                field_title: "New Tile Name",
                default_value: "NewTileModule",
                existing_names: data.resource_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal
            });
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name,
                "last_saved": "viewer"
            };
            await postAjaxPromise("/create_tile_module", result_dict);
            await _view_resource({name: new_name, res_type: "tile"}, "/view_module/");
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError("Error creating tile module", e)
            }
            return
        }
    }

    async function _new_in_creator(template_name) {
        try {
            let data = await postAjaxPromise(`get_resource_names/tile`, {});
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "New Tile",
                field_title: "New Tile Name",
                default_value: "NewTileModule",
                existing_names: data.resource_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name,
                "last_saved": "creator"
            };
            await postAjaxPromise("/create_tile_module", result_dict);
            await _view_resource({name: String(new_name), res_type: "tile"}, "/view_in_creator/");
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError("Error creating tile module", e)
            }
        }
    }

    async function _new_list(template_name) {
        try {
            let data = await postAjaxPromise(`get_resource_names/list`, {});
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "New List Resource",
                field_title: "New List Name",
                default_value: "NewListResource",
                existing_names: data.resource_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name
            };
            await postAjaxPromise("/create_list", result_dict);
            await _view_resource({name: String(new_name), res_type: "list"}, "/view_list/")
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError("Error creating list resource", e)
            }
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
            chunking: false,
            chunkSize: null,
            forceChunking: false,
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

    async function _new_code(template_name) {
        try {
            let data = await postAjaxPromise(`get_resource_names/code`, {});
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "New code Resource",
                field_title: "New Code Resource Name",
                default_value: "NewCodeResource",
                existing_names: data.resource_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name
            };
            await postAjaxPromise("/create_code", result_dict);
            await _view_resource({name: String(new_name), res_type: "code"}, "/view_code/")
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError("Error creating code resource", e)
            }
        }
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
            new_project: _new_project,
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
            new_code: _new_code
        }
    }

    let new_button_groups;
    const primary_mdata_fields = ["name", "created",
        "updated", "tags", "notes"];
    const ignore_fields = ["doc_type", "res_type"];
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

    let split_tags = selected_resource_ref.current.tags == "" ? [] : selected_resource_ref.current.tags.split(" ");
    let outer_style = {marginTop: 0, marginLeft: 5, overflow: "auto", padding: 15, marginRight: 0, height: "100%"};
    let right_pane = (
        <CombinedMetadata tags={split_tags}
                          all_tags={tag_list}
                          elevation={0}
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
                        onClick={async () => {
                            await _setFilterType(rtype)
                        }}/>
            </Tooltip2>
        )
    }

    let left_pane = (
        <LibraryTablePane
            {...props}
            tag_list={tag_list}
            tagRoot={tagRoot}
            expanded_tags_ref={expanded_tags_ref}
            active_tag_ref={active_tag_ref}
            updateTagState={_update_search_state}
            filter_buttons={filter_buttons}
            update_search_state={_update_search_state}
            search_string_ref={search_string_ref}
            search_inside_ref={search_inside_ref}
            show_hidden_ref={show_hidden_ref}
            search_metadata_ref={search_metadata_ref}
            data_dict_ref={data_dict_ref}
            rowChanged={rowChanged}
            num_rows={num_rows}
            sortColumn={_set_sort_state}
            selectedRegionsRef={selectedRegionsRef}
            onSelection={_onTableSelection}
            keyHandler={null}
            initiateDataGrab={_grabNewChunkWithRow}
            renderBodyContextMenu={_renderBodyContextMenu}
            handleRowDoubleClick={_handleRowDoubleClick}
        />
    );

    let selected_types = _selectedTypes();
    selectedTypeRef.current = selected_types.length == 1 ? selected_resource_ref.current.res_type : "multi";

    return (
        <Fragment>
            <MenubarClass selected_resource={selected_resource_ref.current}
                          connection_status={props.connection_status}
                          multi_select={multi_select_ref.current}
                          list_of_selected={list_of_selected_ref.current}
                          selected_rows={selected_rows_ref.current}
                          selectedTypeRef={selectedTypeRef}
                          {..._menu_funcs()}
                          sendContextMenuItems={setContextMenuItems}
                          view_resource={_view_resource}
                          open_raw={_open_raw}
                          {...props.errorDrawerFuncs}
                          handleCreateViewer={props.handleCreateViewer}
                          library_id={props.library_id}
                          controlled={props.controlled}
                          tsocket={props.tsocket}
            />
            {/*tabIndex is needed to allow the div to get focus so that key events can be captured*/}
            <div ref={top_ref} tabIndex="0" className="d-flex flex-column" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                <div style={{width: "100%", height: usable_height}}>
                        <HorizontalPanes
                            show_handle={true}
                            left_pane={left_pane}
                            right_pane={right_pane}
                            right_pane_overflow="auto"
                            initial_width_fraction={.75}
                            scrollAdjustSelectors={[".bp5-table-quadrant-scroll-container"]}
                            handleSplitUpdate={null}
                            handleResizeStart={null}
                            handleResizeEnd={null}
                        />
                </div>

            </div>
        </Fragment>
    )
}

LibraryPane = memo(LibraryPane);



