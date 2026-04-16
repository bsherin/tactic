// noinspection JSValidateTypes,JSDeprecatedSymbols

import React from "react";
import {Fragment, useRef, useEffect, memo, useContext, useMemo, useCallback} from "react";

import {Menu, MenuItem, MenuDivider, useHotkeys} from "@blueprintjs/core";
import {Regions} from "@blueprintjs/table";

import {CombinedMetadata} from "./combined_metadata";
import {HorizontalPanes} from "./resizing_allotment";
import {postPromise} from "./communication_react"

import {doFlash} from "./toaster"
import {useCallbackStack, useImmerReducerAndRef} from "./utilities_react";

import {DialogContext} from "./modal_react";
import {StatusContext} from "./toaster"
import {ErrorDrawerContext} from "./error_drawer";
import {LibraryTablePane} from "./library_table_pane";
import {paneReducer, get_index, get_index_from_id} from "./library_pane_reducer";
import {ColumnSelector, all_columns} from "./library_widgets";
import {useSocketListener} from "./tactic_socket";

export {LibraryPane, view_views, res_types}


const res_types = ["collection", "project", "tile", "list", "code", "metabook"];

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

const initial_state = {
    data_dict: {},
    num_rows: 0,
    tag_list: [],
    show_filter_bar: false,
    contextMenuItems: [],
    select_state: {
        selected_resource: {
            "name": "",
            "_id": "",
            "tags": "",
            "notes": "",
            "updated": "",
            "created": ""
        },
        selected_rows: [],
        multi_select: false,
        list_of_selected: [],
        list_of_selected_types: [],
        selectedRegions: [Regions.row(0)],
    },
    search_state: {
        sort_field: "updated",
        sort_direction: "descending",
        expanded_tags: [],
        active_tag: "all",
        tagRoot: "all",
        search_string: "",
        search_inside: false,
        search_metadata: false,
        filterType: [],
        show_hidden: false

    },
    rowChanged: 0
};

function LibraryPane(props) {
    props = {
        columns: all_columns,
        is_repository: false,
        tsocket: null,
        ...props
    };

    const [pState, pDispatch, pStateRef] = useImmerReducerAndRef(paneReducer, initial_state);

    const top_ref = useRef(null);
    const previous_search_spec = useRef(null);
    
    const selectedTypeRef = useRef(null);

    const dialogFuncs = useContext(DialogContext);
    const statusFuncs = useContext(StatusContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    const _handleArrowKeyPress = useCallback(async (key) =>{
        if (pStateRef.current.select_state.multi_select) return;
        let the_res = pStateRef.current.select_state.selected_resource;
        let current_index = parseInt(get_index(the_res.name, the_res.res_type, pStateRef.current.data_dict));
        let new_index;
        if (key == "ArrowDown") {
            new_index = current_index + 1;
        } else {
            new_index = current_index - 1;
            if (new_index < 0) return
        }
        await _selectRow(new_index)
    }, [pStateRef.current.select_state.multi_select, pStateRef.current.select_state.selected_resource, pStateRef.current.data_dict]);

    const _view_func = useCallback(async (the_view = null) => {
        const res_type = pStateRef.current.select_state.selected_resource.res_type;
        if (!res_type) return;
        if (res_type == "metabook") {
            if (!window.in_context) return;
            props.setCurrentMetabook(pStateRef.current.select_state.selected_resource._id);
            return
        }
        statusFuncs.setStatus({show_spinner: true, status_message: "Opening ..."});
        if (window.in_context) {
            try {
                props.handleCreateViewer(res_type, pStateRef.current.select_state.selected_resource.name,
                    statusFuncs.clearStatus)
            } catch (e) {
                statusFuncs.clearStatus();
                errorDrawerFuncs.addFromError(`Error viewing with view ${the_view}`, e)
            }
        } else {
            if (the_view == null) {
                the_view = view_views(props.is_repository)[pStateRef.current.select_state.selected_resource.res_type]
            }
            statusFuncs.clearStatus();
            if (the_view == null) return;
            window.open($SCRIPT_ROOT + the_view + pStateRef.current.select_state.selected_resource.name)
        }
    }, [pStateRef.current.select_state.selected_resource]);

   async function _unsearch () {
        if (pStateRef.current.search_state.search_string != "") {
            _update_search_state({search_string: ""})
        } else if (pStateRef.current.search_state.active_tag != "all") {
            _update_search_state({active_tag: "all"})
        } else if (!_.isEqual(pStateRef.current.search_state.filterType, res_types)) {
            await _setFilterType(res_types)
        }
    }

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
        [_view_func, _handleArrowKeyPress, _unsearch],
    );

   const { handleKeyDown, handleKeyUp } = useHotkeys(hotkeys);

    useEffect(() => {
        _grabNewChunkWithRow(0).then(() => {});
    }, [props.columns]);

    const pushCallback = useCallbackStack("library_home");

    useSocketListener(props.tsocket, "update-selector-row", _handleRowUpdate,
        props.tsocket && !props.is_repository);
    useSocketListener(props.tsocket, "refresh-selector", _refresh_func,
        props.tsocket != null && !props.is_repository);
    useSocketListener(props.tsocket, "update-repository-selector-row", _handleRowUpdate,
        props.tsocket != null && props.is_repository)
    useSocketListener(props.tsocket, "refresh-repository-selector", _refresh_func,
        props.tsocket != null && props.is_repository)

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
                        selected_rows.push(pStateRef.current.data_dict[i]);
                    }
                }
            }
        }
        return (
            <BodyMenu items={pStateRef.current.contextMenuItems} selected_rows={selected_rows}/>
        )
    }

    async function _setFilterType(rtypes) {
        if (_.isEqual(rtypes, pStateRef.current.search_state.filterType)) return;

        if (!pStateRef.current.search_state.multi_select) {
            let sres = pStateRef.current.select_state.selected_resource;
            if (sres.name != "" && (sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
                await _saveFromSelectedResource()
            }
        }
        pDispatch({type: "UPDATE_SEARCH_STATE", search_state: {filterType: rtypes}});
        clearSelected();
        pushCallback(async () => {
            await _grabNewChunkWithRow(0, true, null, true)
        });
    }


    function clearSelected() {
        pDispatch({type: "CLEAR_SELECTED"});
    }

    function compactRowsToRegions(rowIndices) {
        if (rowIndices.length === 0) return [];

        const regions = [];
        let start = rowIndices[0];
        let end = rowIndices[0];

        for (const current of rowIndices) {
            if (current === end + 1) {
                end = current;
            } else {
                regions.push({ rows: [start, end] });
                start = current;
                end = current;
            }
        }
        regions.push({ rows: [start, end] });

        return regions;
    }

    async function _onTableSelection(regions) {
        // This was modified, with help from chatGPT, so that I don't get over emphasis of selected rows on
        // multi select.
        if (regions.length === 0) return;
        let selected_rows = [];
        let selected_row_indices = new Set();
        for (let region of regions) {
            if (region.hasOwnProperty("rows")) {
                const [first_row, last_row] = region.rows;
                for (let i = first_row; i <= last_row; ++i) {
                    if (!selected_row_indices.has(i)) {
                        selected_row_indices.add(i);
                        selected_rows.push(pStateRef.current.data_dict[i]);
                    }
                }
            }
        }
        const sortedIndices = Array.from(selected_row_indices).sort((a, b) => a - b);
        const revised_regions = compactRowsToRegions(sortedIndices);
        await _handleRowSelection(selected_rows);
        pDispatch({type: "UPDATE_SELECT_STATE", select_state: {selectedRegions: revised_regions}});
    }

    async function _grabNewChunkWithRow(row_index, flush = false, spec_update = null, select = false, select_by_name = null, callback = null) {
        let search_spec = {...pStateRef.current.search_state};
        if (search_spec.active_tag == "all") {
            search_spec.active_tag = null
        }
        if (spec_update) {
            search_spec = Object.assign(search_spec, spec_update)
        }
        if (search_spec.active_tag && search_spec.active_tag[0] != "/") {
            search_spec.active_tag = "/" + search_spec.active_tag
        }
        let args = {
            res_types: pStateRef.current.search_state.filterType,
            search_spec: search_spec,
            row_number: row_index,
            is_repository: props.is_repository,
            columns: props.columns
        };


        /** @type {{ chunk_dict: object, all_tags: array, num_rows: int }} */
        let data;
        try {
            data = await postPromise("host", "grab_all_list_chunk_task", args);
            if (flush) {
                pDispatch({type: "INIT_DATA_DICT", data_dict: data.chunk_dict, num_rows: data.num_rows});
            } else {
                pDispatch({type: "UPDATE_DATA_DICT", data_dict: data.chunk_dict, num_rows: data.num_rows});
            }
            previous_search_spec.current = search_spec;

            set_tag_list(data.all_tags);
            if (callback) {
                pushCallback(callback)
            }
            else if (select || pStateRef.current.select_state.selected_resource.name == "") {
                pushCallback(() => {
                    _selectRow(row_index)
                })
            }
        } catch (e) {
            errorDrawerFuncs.addFromError("Error grabbing resource chunk", e);
        }
    }

    function set_tag_list(tag_list){
        pDispatch({type: "SET_TAG_LIST", tag_list: tag_list})
    }

    async function _handleRowUpdate(res_dict) {
        let res_name = res_dict.name;
        let ind;
        let _id;
        let event_type = res_dict.event_type;
        delete res_dict.event_type;
        switch (event_type) {
            case "update":
                if ("_id" in res_dict) {
                    _id = res_dict._id;
                    ind = get_index_from_id(res_dict._id, pStateRef.current.data_dict);
                } else {
                    ind = get_index(res_name, res_dict.res_type, pStateRef.current.data_dict);
                    if (ind) {
                        _id = pStateRef.current.data_dict[ind]._id
                    }
                }
                if (!ind) return;
                pDispatch({type: "UPDATE_ROW", index: ind, res_dict: res_dict});
                if (_id == pStateRef.current.select_state.selected_resource._id) {
                    let the_row = {...pStateRef.current.data_dict[ind], ...res_dict};
                    pDispatch({type: "UPDATE_SELECT_STATE", select_state: {selected_resource: the_row}});
                }
                break;
            case "insert":
                await _grabNewChunkWithRow(0, true, null, false, res_name);
                break;
            case "delete":
                if ("_id" in res_dict) {
                    ind = parseInt(get_index_from_id(res_dict._id, pStateRef.current.data_dict));
                } else {
                    ind = parseInt(get_index(res_name, res_dict.res_type, pStateRef.current.data_dict));
                }

                let selected_ind = null;
                if ("_id" in pStateRef.current.select_state.selected_resource) {
                    selected_ind = parseInt(get_index_from_id(pStateRef.current.select_state.selected_resource._id,
                        pStateRef.current.data_dict));
                }
                let new_selected_ind = selected_ind;
                if (selected_ind > ind) {
                    new_selected_ind = selected_ind - 1;
                }
                pDispatch({type: "DELETE_ROW", index: ind});
                pushCallback(async () => {
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
        for (let index in pStateRef.current.data_dict) {
            let the_row = pStateRef.current.data_dict[index];
            if (the_row.name == name && the_row.res_type == res_type) {
                return pStateRef.current.data_dict[index]
            }
        }
        return null
    }

    async function _saveFromSelectedResource() {
        // This will only be called when there is a single row selected
        const result_dict = {
            "res_type": pStateRef.current.select_state.selected_rows[0].res_type,
            "res_name": pStateRef.current.select_state.list_of_selected[0],
            "metadata": {
                "tags": pStateRef.current.select_state.selected_resource.tags,
                "notes": pStateRef.current.select_state.selected_resource.notes
            }
        };
        if (pStateRef.current.select_state.selected_rows[0].res_type == "tile" && "icon" in pStateRef.current.select_state.selected_resource) {
            result_dict["metadata"]["icon"] = pStateRef.current.select_state.selected_resource["icon"]
        }
        try {
            await postPromise("host", "save_metadata_task", result_dict)
        } catch (e) {
            errorDrawerFuncs.addFromError(`Error updating resource ${result_dict.res_name}`, e)
        }
    }

    function _handleRowDoubleClick(row_dict) {
        statusFuncs.setStatus({show_spinner: true, status_message: "Opening ..."});
        pDispatch({
            type: "UPDATE_SELECT_STATE",
            select_state: {
                selected_resource: row_dict,
                multi_select: false,
                list_of_selected: [row_dict.name],
                list_of_selected_types: [row_dict.res_type],
                selected_rows: [row_dict]
            }

        });
        pushCallback(async () => {
            if (window.in_context) {
                try {
                    props.handleCreateViewer(row_dict.res_type, row_dict.name, statusFuncs.clearStatus);
                } catch (e) {
                    statusFuncs.clearStatus();
                    errorDrawerFuncs.addFromError(`Error handling double click with view ${view_view}`, e)
                }
            } else {
                let view_view = view_views(props.is_repository)[row_dict.res_type];
                statusFuncs.clearStatus();
                if (view_view == null) return;
                window.open($SCRIPT_ROOT + view_view + row_dict.name)
            }
        });
    }

    function _selectedTypes() {
        let the_types = pStateRef.current.select_state.selected_rows.map(function (row) {
            return row.res_type
        });
        the_types = [...new Set(the_types)];
        return the_types
    }

    async function _handleRowSelection(selected_rows) {
        if (!pStateRef.current.select_state.multi_select) {
            let sres = pStateRef.current.select_state.selected_resource;
            if (sres.name != "" && get_data_dict_entry(sres.name, sres.res_type) &&
                (sres.notes != get_data_dict_entry(sres.name, sres.res_type).notes)) {
                await _saveFromSelectedResource()
            }
        }
        if (selected_rows.length > 1) {
            // I think the common_tags stuff doesn't currently do anything
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
            let multi_select_types = selected_rows.map((row_dict) => row_dict.res_type)
            let new_selected_resource = {name: "__multiple__", tags: common_tags.join(" "), notes: ""};
            pDispatch({
                type: "UPDATE_SELECT_STATE",
                select_state: {
                    selected_resource: new_selected_resource,
                    multi_select: true,
                    list_of_selected: multi_select_list,
                    list_of_selected_types: multi_select_types,
                    selected_rows: selected_rows
                }

            });
        } else {
            let row_dict = selected_rows[0];
            pDispatch({
                type: "UPDATE_SELECT_STATE",
                select_state: {
                    selected_resource: row_dict,
                    multi_select: false,
                    list_of_selected: [row_dict.name],
                    list_of_selected_types: [row_dict.res_type],
                    selected_rows: selected_rows
                }

            });
        }
    }

    function _update_search_state(new_state) {
        pDispatch({type: "UPDATE_SEARCH_STATE", search_state: new_state});
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
        _update_search_state(spec_update);
    }

    async function _selectRow(new_index) {
        if (!Object.keys(pStateRef.current.data_dict).includes(String(new_index))) {
            await _grabNewChunkWithRow(new_index, false, null, false, null, () => {
                _selectRow(new_index)
            })
        } else {
            pDispatch({
                type: "UPDATE_SELECT_STATE",
                select_state: {
                    selected_resource: pStateRef.current.data_dict[new_index],
                    multi_select: false,
                    list_of_selected: [pStateRef.current.data_dict[new_index].name],
                    list_of_selected_types: [pStateRef.current.data_dict[new_index].res_type],
                    selected_rows: [pStateRef.current.data_dict[new_index]],
                    selectedRegions: [Regions.row(new_index)]
                }

            })
        }

    }

    async function _open_raw(selected_resource) {
        statusFuncs.clearStatus();
        if (selected_resource.type == "freeform") {
            let data = await postPromise("host", "open_raw", {collection_name: selected_resource.name});
            const html = data["the_html"];
            const blob = new Blob([html], { type: "text/html" });
            const url = URL.createObjectURL(blob)
            window.open(url, "_blank");
            // window.open($SCRIPT_ROOT + "/open_raw/" + selected_resource.name)
        } else {
            statusFuncs.statusMessage("Only Freeform documents can be raw opened", 5);
        }
    }

    async function _view_resource(selected_resource, the_view = null, force_new_tab = false) {
        let resource_name = selected_resource.name;

        statusFuncs.setStatus({show_spinner: true, status_message: "Opening ..."});
        if (window.in_context && !force_new_tab) {
            try {
                props.handleCreateViewer(selected_resource.res_type, resource_name, statusFuncs.clearStatus);
            } catch (e) {
                statusFuncs.clearStatus();
                errorDrawerFuncs.addFromError(`Error viewing resource ${resource_name}`, e)

            }
        } else {
            if (the_view == null) {
                the_view = view_views(props.is_repository)[selected_resource.res_type]
            }
            statusFuncs.clearStatus();
            if (the_view == null) return;
            window.open($SCRIPT_ROOT + the_view + resource_name)
        }
    }

    async function _duplicate_func(row = null) {
        let the_row = row ? row : pStateRef.current.select_state.selected_resource;
        let res_name = the_row.name;
        let res_type = the_row.res_type;
        try {
            let data = await postPromise("host", "get_resource_names_task", {res_type});
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: `Duplicate ${res_type}`,
                field_title: "New Name",
                default_value: res_name,
                existing_names: data.res_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });

            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": res_name,
                "is_repository": false,
                "res_type": res_type
            };
            await postPromise("host", "create_duplicate_resource_task", result_dict)
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error duplicating resource ${res_name}`, e)
            }
        }
    }

    async function _delete_func(resource) {
        let res_list = resource ? [resource] : pStateRef.current.select_state.selected_rows;
        var confirm_text;
        if (res_list.length == 1) {
            let res_name = res_list[0].name;
            confirm_text = `Are you sure that you want to delete ${res_name}?`;
        } else {
            confirm_text = `Are you sure that you want to delete multiple items?`;
        }
        let first_index = 99999;
        for (let row of pStateRef.current.select_state.selected_rows) {
            let ind = parseInt(get_index(row.name, row.res_type, pStateRef.current.data_dict));
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
            await postPromise("host", "delete_resource_list_task", {"resource_list": res_list})
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error duplicating resource ${res_name}`, e)
            }
        }
    }

    async function _rename_func(row = null) {
        let res_type;
        let res_name;
        if (!row) {
            res_type = pStateRef.current.select_state.selected_resource.res_type;
            res_name = pStateRef.current.select_state.selected_resource.name;
        } else {
            res_type = row.res_type;
            res_name = row.name;
        }
        try {
            let data = await postPromise("host", "get_resource_names_task", {res_type});
            const res_names = data["res_names"];
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
            await postPromise("host", "rename_resource_task", {old_name: res_name, res_type, new_name});
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError(`Error renaming resource ${res_name}`, e)
            }
        }
    }

    async function _repository_copy_func() {
        if (!pStateRef.current.select_state.multi_select) {
            let res_type = pStateRef.current.select_state.selected_resource.res_type;
            let res_name = pStateRef.current.select_state.selected_resource.name;
            try {
                let data = await postPromise("host", "get_resource_names_task", {res_type});
                let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                    title: `Import ${res_type}`,
                    field_title: "New Name",
                    default_value: res_name,
                    existing_names: data.res_names,
                    checkboxes: [],
                    handleClose: dialogFuncs.hideModal,
                });
                const result_dict = {
                    "res_type": res_type,
                    "res_name": res_name,
                    "new_res_name": new_name
                };
                await postPromise("host", "copy_from_repository_task", result_dict);
                statusFuncs.statusMessage(`Imported Resource ${res_name}`);
                return res_name
            } catch (e) {
                if (e != "canceled") {
                    errorDrawerFuncs.addFromError("Error getting resources names", e)
                }
            }
        } else {
            const result_dict = {
                "selected_rows": pStateRef.current.select_state.selected_rows
            };
            try {
                await postPromise("host", "copy_from_repository_task", result_dict);
                statusFuncs.statusMessage(`Imported Resources`)
            } catch (e) {
                errorDrawerFuncs.addFromError("Error importing resources", e)
            }
            return ""
        }
    }

    async function _send_repository_func() {
        if (!pStateRef.current.select_state.multi_select) {
            let res_type = pStateRef.current.select_state.selected_resource.res_type;
            let res_name = pStateRef.current.select_state.selected_resource.name;
            try {
                let data = await postPromise("host", "get_resource_names_task", {res_type, is_repository: true});
                let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                    title: `Share ${res_type}`,
                    field_title: `New ${res_type} Name`,
                    default_value: res_name,
                    existing_names: data.res_names,
                    checkboxes: [],
                    handleClose: dialogFuncs.hideModal,
                });
                const result_dict = {
                    "res_type": res_type,
                    "res_name": res_name,
                    "new_res_name": new_name
                };
                await postPromise("host", 'send_to_repository_task', result_dict);
                statusFuncs.statusMessage(`Shared resource ${res_name}`)
            } catch (e) {
                if (e != "canceled") {
                    errorDrawerFuncs.addFromError(`Error sharing resource ${res_name}`, e)
                }
            }
        } else {
            const result_dict = {
                "selected_rows": pStateRef.current.select_state.selected_rows,
            };
            try {
                await postPromise("host", 'send_to_repository_task', result_dict);
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
                props.handleCreateViewer("new-notebook")
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
                props.handleCreateViewer("new-project")
            } catch (e) {
                errorDrawerFuncs.addFromError("Error creating new project", e)
            }
        } else {
            window.open(`${$SCRIPT_ROOT}/new_project`)
        }
    }

    async function _downloadJupyter() {
        let res_name = pStateRef.current.select_state.selected_resource.name;
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
        var res_name = pStateRef.current.select_state.selected_resource.name;
        if (!pStateRef.current.select_state.multi_select) {
            try {
                let data = await postPromise("host", "get_resource_names_tasks", {res_type: "collection"});
                let other_name = await dialogFuncs.showModalPromise("SelectDialog", {
                    title: "Select a new collection to combine with " + res_name,
                    select_label: "Collection to Combine",
                    cancel_text: "Cancel",
                    submit_text: "Combine",
                    option_list: data.res_names,
                    handleClose: dialogFuncs.hideModal,
                });
                statusFuncs.startSpinner();
                // const target = `combine_collections/${res_name}/${other_name}`;
                await postPromise("host", "combine_collections_task",
                    {base_collection_name: res_name, collection_to_add: other_name});
                statusFuncs.stopSpinner();
                statusFuncs.statusMessage("Combined Collections");

            } catch (e) {
                if (e != "canceled") {
                    errorDrawerFuncs.addFromError(`Error combining collections`, e)
                }
                statusFuncs.stopSpinner();
            }
        } else {
            try {
                let data = await postPromise("host", "get_resource_names_tasks", {res_type: "collection"});
                let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                    title: "Combine Collections",
                    field_title: "Name for combined collection",
                    default_value: "NewCollection",
                    existing_names: data.res_names,
                    checkboxes: [],
                    handleClose: dialogFuncs.hideModal,
                });
                await postPromise("host", "combine_to_new_collection",
                    {"original_collections": pStateRef.current.select_state.list_of_selected, "new_name": new_name});
            } catch (e) {
                if (e != "canceled") {
                    errorDrawerFuncs.addFromError(`Error combining collections`, e)
                }
                statusFuncs.stopSpinner();
            }
        }
    }

    async function _downloadCollection(resource_name = null) {
        let res_name = resource_name ? resource_name : pStateRef.current.select_state.selected_resource.name;
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
            let data = await postPromise("host", "create_empty_collection_task", {
                "collection_name": new_name,
                "doc_type": doc_type,
                "library_id": props.library_id,
                "csv_options": csv_options
            });
            if (!data.success) {
                errorDrawerFuncs.addErrorDrawerEntry({
                    title: "Error creating collection",
                    content: data.message
                });
                return
            }
            let new_url = `append_documents_to_collection/${new_name}/${doc_type}/${props.library_id}`;
            myDropZone.options.url = new_url;
            setCurrentUrl(new_url);
            myDropZone.processQueue();

        } catch (e) {
            errorDrawerFuncs.addFromError("Error importing document", e);
        }
    }

    function _showHistoryViewer() {
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${pStateRef.current.select_state.selected_resource.name}`)
    }

    function _compare_tiles() {
        let res_names = pStateRef.current.select_state.list_of_selected;
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
        let res_name = resource ? resource.name : pStateRef.current.select_state.selected_resource.name;
        try {
            await postPromise("host", "load_tile_module_task",
                {"tile_module_name": res_name, "user_id": window.user_id});
            statusFuncs.statusMessage(`Loaded tile ${res_name}`)
        } catch (e) {
            errorDrawerFuncs.addFromError("Error loading tile", e);
        }
    }

    async function _unload_module(resource = null) {
        let res_name = resource ? resource.name : pStateRef.current.select_state.selected_resource.name;
        try {
            await postPromise("host", "unload_one_module_task", {"tile_module_name": res_name});
            statusFuncs.statusMessage("Tile unloaded")
        } catch (e) {
            errorDrawerFuncs.addFromError("Error unloading tile", e);
        }
    }

    async function _unload_all_tiles() {
        try {
            await postPromise("host", "unload_all_tiles_task", {});
            statusFuncs.statusMessage("Unloaded all tiles")
        } catch (e) {
            errorDrawerFuncs.addFromError("Error unloading tiles", e);
        }
    }

    async function _new_in_creator(template_name) {
        try {
            let data = await postPromise("host", "get_tile_names_task", {});
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "New Tile",
                field_title: "New Tile Name",
                default_value: "NewTileModule",
                existing_names: data.tile_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            const result_dict = {
                "template_name": template_name,
                "new_tile_name": new_name,
                "last_saved": "creator"
            };
            await postPromise("host", "create_tile_from_repository_template", result_dict);
            await _view_resource({name: String(new_name), res_type: "tile"});
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError("Error creating tile module", e)
            }
        }
    }

    async function _new_metabook() {
        try {
            let data = await postPromise("host", "get_metabook_names_task", {});
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "New Metabook Resource",
                field_title: "New Metabook Name",
                default_value: "NewMetabookResource",
                existing_names: data.res_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            const result_dict = {
                "metabook_name": new_name
            };
            let new_metabook_data = await postPromise("host", "create_empty_metabook", result_dict);
            props.setCurrentMetabook(new_metabook_data._id);
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError("Error creating metabook resource", e)
            }
        }
    }

    async function _new_list(template_name) {
        try {
            let data = await postPromise("host", "get_list_names_task", {});
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "New List Resource",
                field_title: "New List Name",
                default_value: "NewListResource",
                existing_names: data.list_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            const result_dict = {
                "template_name": template_name,
                "new_list_name": new_name
            };
            await postPromise("host", "create_list_from_repository_template", result_dict);
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

    async function _new_code(template_name) {
        try {
            let data = await postPromise("host", "get_code_names_task", {});
            let new_name = await dialogFuncs.showModalPromise("ModalDialog", {
                title: "New code Resource",
                field_title: "New Code Resource Name",
                default_value: "NewCodeResource",
                existing_names: data.code_names,
                checkboxes: [],
                handleClose: dialogFuncs.hideModal,
            });
            const result_dict = {
                "template_name": template_name,
                "new_code_name": new_name
            };
            await postPromise("host", "create_code_from_repository_template", result_dict);
            await _view_resource({name: String(new_name), res_type: "code"}, "/view_code/")
        } catch (e) {
            if (e != "canceled") {
                errorDrawerFuncs.addFromError("Error creating code resource", e)
            }
        }
    }

    function setContextMenuItems(context_menu_items) {
        pDispatch({type: "SET_CONTEXT_MENU_ITEMS", context_menu_items: context_menu_items})
    }

    function toggleFilterBar() {
        pDispatch({type: "TOGGLE_FILTER_BAR"})
    }

    function _menu_funcs() {
        return {
            view_func: _view_func,
            setCurrentMetabook: props.setCurrentMetabook,
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
            load_tile: _load_tile,
            unload_module: _unload_module,
            unload_all_tiles: _unload_all_tiles,
            showHistoryViewer: _showHistoryViewer,
            compare_tiles: _compare_tiles,
            new_metabook: _new_metabook,
            new_list: _new_list,
            showListImport: _showListImport,
            new_code: _new_code
        }
    }

    let res_type = pStateRef.current.select_state.selected_resource.res_type;
    let res_name = pStateRef.current.select_state.selected_resource.name;
    let right_pane = (
        <CombinedMetadata key="combined-metadata-library"
                          elevation={0}
                          tsocket={props.tsocket}
                          res_name={res_name}
                          res_type={res_type}
                          list_of_selected={pStateRef.current.select_state.list_of_selected}
                          list_of_selected_types={pStateRef.current.select_state.list_of_selected_types}
                          multi_select={pStateRef.current.select_state.multi_select}
                          expandWidth={true}
                          search_string={pStateRef.current.search_state.search_string}
                          search_inside={pStateRef.current.search_state.search_inside}
                          readOnly={props.is_repository}
        />
    );

    let MenubarClass = props.MenubarClass;

    let column_selector = props.updateColumns ?
        (<ColumnSelector icon_dict={[]}
                         selectedColumns={props.columns}
                         onColumnChange={props.updateColumns}/>) : null;


    let left_pane = (
        <LibraryTablePane
            {...props}
            pStateRef={pStateRef}
            res_types={res_types}
            setFilterType={_setFilterType}
            toggleFilterBar={toggleFilterBar}
            column_selector={column_selector}
            update_search_state={_update_search_state}
            show_filter_bar={pStateRef.current.show_filter_bar}
            updateTagState={_update_search_state}
            sortColumn={_set_sort_state}
            onSelection={_onTableSelection}
            keyHandler={null}
            initiateDataGrab={_grabNewChunkWithRow}
            renderBodyContextMenu={_renderBodyContextMenu}
            handleRowDoubleClick={_handleRowDoubleClick}
        />
    );

    let selected_types = _selectedTypes();
    selectedTypeRef.current = selected_types.length == 1 ? pState.select_state.selected_resource.res_type : "multi";

    return (
        <Fragment>
            <MenubarClass selected_resource={pStateRef.current.select_state.selected_resource}
                          connection_status={props.connection_status}
                          multi_select={pStateRef.current.select_state.multi_select}
                          list_of_selected={pStateRef.current.select_state.list_of_selected}
                          selected_rows={pStateRef.current.select_state.selected_rows}
                          selectedTypeRef={selectedTypeRef}
                          {..._menu_funcs()}
                          sendContextMenuItems={setContextMenuItems}
                          view_resource={_view_resource}
                          open_raw={_open_raw}
                          {...props.errorDrawerFuncs}
                          handleCreateViewer={props.handleCreateViewer}
                          library_id={props.library_id}  // Does this do anything
                          controlled={props.controlled}
                          tsocket={props.tsocket}
            />
            {/*tabIndex is needed to allow the div to get focus so that key events can be captured*/}
            <div ref={top_ref}
                 style={{
                     display: "flex",
                     flexGrow: 1,
                     width: "100%",
                     overflow: "hidden",
                     minHeight: 0,
                     minWidth: 0,
                     position: "relative"
                 }}
                 tabIndex="0" className="d-flex flex-column" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
                    <HorizontalPanes
                        show_handle={true}
                        left_pane={left_pane}
                        right_pane={right_pane}
                        right_pane_overflow="auto"
                        initial_width_fraction={.75}
                    />
            </div>
        </Fragment>
    )
}

LibraryPane = memo(LibraryPane);



