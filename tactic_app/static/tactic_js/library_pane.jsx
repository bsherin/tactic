
import React from "react";
import PropTypes from 'prop-types';

import { Menu, MenuItem, MenuDivider, RadioGroup, Radio } from "@blueprintjs/core";
import {Regions} from "@blueprintjs/table";
import _ from 'lodash';

import {TagButtonList} from "./tag_buttons_react.js";
import {CombinedMetadata} from "./blueprint_mdata_fields.js";
import {SearchForm, BpSelectorTable, LibraryOmnibar} from "./library_widgets.js";
import {HorizontalPanes} from "./resizing_layouts.js";
import {showModalReact, showConfirmDialogReact} from "./modal_react.js";
import {postAjax, postAjaxPromise, postWithCallback} from "./communication_react.js"
import {BOTTOM_MARGIN} from "./sizing_tools.js";

import {doFlash} from "./toaster.js"
import {KeyTrap} from "./key_trap.js";
import {doBinding} from "./utilities_react.js";
import {showFileImportDialog} from "./import_dialog";
import {showSelectDialog} from "./modal_react";

export {LibraryPane, view_views}

const res_types = ["collection", "project", "tile", "list", "code"];

function view_views(is_repository=false) {

    if (is_repository) {
        return {
            collection: null,
            project: null,
            tile: "/repository_view_module/",
            list: "/repository_view_list/",
            code: "/repository_view_code/"
        }
    }
    else {
        return {
            collection: "/main_collection/",
            project: "/main_project/",
            tile: "/last_saved_view/",
            list: "/view_list/",
            code: "/view_code/"
        }
    }
}

function duplicate_views(is_repository=false) {
    return {
        collection: "/duplicate_collection",
        project: "/duplicate_project",
        tile: "/create_duplicate_tile",
        list: "/create_duplicate_list",
        code: "/create_duplicate_code"
    }
}

class BodyMenu extends React.Component {

    getIntent(item) {
        return item.intent ? item.intent : null
    }

    render() {
        let menu_items = this.props.items.map((item, index)=> {
                if (item.text == "__divider__") {
                    return <MenuDivider key={index}/>
                }
                else {
                    let the_row = this.props.selected_rows[0];
                    let disabled = item.res_type && the_row.res_type != item.res_type;
                    return (<MenuItem icon={item.icon} disabled={disabled}
                                      onClick={() => item.onClick(the_row)}
                                     intent={this.getIntent(item)}
                                     key={item.text}
                                     text={item.text}/>)
                }
            }
        );
        return (
            <Menu>
                <MenuDivider title={this.props.selected_rows[0].name} className="context-menu-header"/>
                {menu_items}
            </Menu>
        )
    }
}

BodyMenu.propTypes = {
    items: PropTypes.array,
    selected_rows: PropTypes.array
};

class LibraryPane extends React.Component {

    constructor(props) {
        super(props);
        this.top_ref = React.createRef();
        this.table_ref = React.createRef();
        this.resizing = false;
        this.state = {
            data_dict: {},
            num_rows: 0,
            mounted: false,
            tag_list: [],
            auxIsOpen: false,
            showOmnibar: false,
            contextMenuItems: [],
            total_width: 500,
        };
        doBinding(this);
        this.toolbarRef = null;
        this.previous_search_spec = null;
        this.socket_counter = null;
        this.initSocket();
        this.blank_selected_resource = {};
        for (let col in this.props.columns) {
            this.blank_selected_resource[col] = ""
        }

    }

    initSocket() {
        if ((this.props.tsocket != null) && (!this.props.is_repository)) {
            if (this.props.pane_type == "all") {
                for (let res_type of res_types) {
                    this.props.tsocket.attachListener(`update-${res_type}-selector-row`, this._handleRowUpdate);
                    this.props.tsocket.attachListener(`refresh-${res_type}-selector`, this._refresh_func);
                }
            }
            else {
                this.props.tsocket.attachListener(`update-${this.props.pane_type}-selector-row`, this._handleRowUpdate);
                this.props.tsocket.attachListener(`refresh-${this.props.pane_type}-selector`, this._refresh_func);
            }

        }
    }


    _sendContextMenuItems(items) {
        this.setState({contextMenuItems: items})
    }

    _getSearchSpec(){
        return {
            active_tag: this.props.tag_button_state.active_tag == "all" ? null : this.props.tag_button_state.active_tag,
            search_string: this.props.search_string,
            search_inside: this.props.search_inside,
            search_metadata: this.props.search_metadata,
            sort_field: this.props.sort_field,
            sort_direction: this.props.sort_direction
        }
    }

    _renderBodyContextMenu(menu_context) {
        let regions = menu_context.regions;
        if (regions.length == 0) return null;  // Without this get an error when clicking on a body cell
        let selected_rows = [];
        for (let region of regions) {
            if (region.hasOwnProperty("rows")) {
                let first_row = region["rows"][0];
                let last_row = region["rows"][1];
                for (let i=first_row; i<=last_row; ++i) {
                    if (!selected_rows.includes(i)) {
                        selected_rows.push(this.state.data_dict[i]);
                    }
                }
            }
        }
        return (
            <BodyMenu items={this.state.contextMenuItems} selected_rows={selected_rows}/>
        )
    }

    _handleTypeFilterChange(event) {
        if (event.currentTarget.value == this.props.filterType) return;
        this._updatePaneState({"filterType": event.currentTarget.value }, ()=>{
            this._grabNewChunkWithRow(0, true, null, true)
        })
    }

    _onTableSelection(regions) {
        if (regions.length == 0) return;  // Without this get an error when clicking on a body cell
        let selected_rows = [];
        let selected_row_indices = [];
        let revised_regions = [];
        for (let region of regions) {
            if (region.hasOwnProperty("rows")) {
                let first_row = region["rows"][0];
                revised_regions.push(Regions.row(first_row));
                let last_row = region["rows"][1];
                for (let i=first_row; i<=last_row; ++i) {
                    if (!selected_row_indices.includes(i)) {
                        selected_row_indices.push(i);
                        selected_rows.push(this.state.data_dict[i]);
                        revised_regions.push(Regions.row(i));
                    }
                }
            }
        }
        this._handleRowSelection(selected_rows);
        this._updatePaneState({selectedRegions: revised_regions});
    }

    componentDidMount() {
        let self = this;
        this.setState({"mounted": true});
        let path;
        this.setState({data_dict: {}, num_rows: 100, tag_list: []})
        // this._grabNewChunkWithRow(0, true, null, true, null)
    }

    _grabNewChunkWithRow(row_index, flush=false, spec_update=null, select=false, select_by_name=null, callback=null) {
        let search_spec = this._getSearchSpec();
        if (spec_update) {
            search_spec = Object.assign(search_spec, spec_update)
        }
        if (search_spec.active_tag && search_spec.active_tag[0] != "/") {
            search_spec.active_tag = "/" + search_spec.active_tag
        }
        let data = {pane_type: this.props.filterType,
            search_spec: search_spec,
            row_number: row_index,
            is_repository: this.props.is_repository};
        let self = this;
        postAjax("grab_all_list_chunk", data, function(data) {
            let new_data_dict;
            if (flush) {
                new_data_dict = data.chunk_dict
            }
            else {
                new_data_dict = _.cloneDeep(self.state.data_dict);
                new_data_dict = Object.assign(new_data_dict, data.chunk_dict)
            }
            self.previous_search_spec = search_spec;
            self.setState({data_dict: new_data_dict, num_rows: data.num_rows, tag_list: data.all_tags}, ()=>{
                if (callback) {
                    callback()
                }
                else if (select || self.props.selected_resource.name == "") {
                    self._selectRow(row_index)
                }
            });

        })
    }

    _initiateDataGrab(row_index) {
        this._grabNewChunkWithRow(row_index)
    }

    _handleRowUpdate(res_dict) {
        let res_name = res_dict.name;
        let ind = this.get_data_dict_index(res_name, res_dict.res_type);
        if (!ind) return;
        let new_data_dict = _.cloneDeep(this.state.data_dict);
        let the_row = new_data_dict[ind];

        for (let field in res_dict) {
            if ("new_name" in res_dict && field == "name") {}
            else if (field == "new_name") {
                the_row["name"] = res_dict[field]
            }
            else {
                the_row[field] = res_dict[field];
            }

        }
        if (res_name == this.props.selected_resource.name) {
            this.props.updatePaneState({"selected_resource": the_row})
        }
        let new_state = {"data_dict": new_data_dict };
        if ("tags" in res_dict) {
            let res_tags = res_dict.tags.split(" ");
            let new_tag_list = _.cloneDeep(this.state.tag_list);
            let new_tag_found = false;
            for (let tag of res_tags) {
                if (!new_tag_list.includes(tag)){
                    new_tag_list.push(tag);
                    new_tag_found = true;
                }
            }
            if (new_tag_found) {
                new_state["tag_list"] = new_tag_list;
            }
        }

        this.setState(new_state);
    }

    update_tag_list() {

    }

    delete_row(name) {
        let ind = this.get_data_list_index(name);
        let new_data_list = [...this.state.data_list];
        new_data_list.splice(ind, 1);
        let self = this;
        if (this.props.list_of_selected.includes(name)) {
            this._updatePaneState({list_of_selected: [], multi_select: false,
                selected_rows: [],
                selected_resource: self.blank_selected_resource});
        }
        this.setState({data_list: new_data_list}, this.update_tag_list);
    }

    get_data_dict_entry(name, res_type) {
        for (let index in this.state.data_dict) {
            let the_row = this.state.data_dict[index];
            if (the_row.name == name && the_row.res_type == res_type) {
                return this.state.data_dict[index]
            }
        }
        return null
    }

    _match_row(row1, row2) {
        return row1.name == row2.name && row1.res_type == row2.res_type
    }

    _match_any_row(row1, row_list) {
        for (let row2 of row_list) {
            if (this._match_row(row1, row2)) {
                return true
            }
        }
        return false
    }

    set_in_data_dict(old_rows, new_val_dict, data_dict) {
        let new_data_dict = {};

        for (let index in data_dict) {
            let entry = data_dict[index];
            if (this._match_any_row(entry, old_rows)){
                for (let k in new_val_dict) {
                    entry[k] = new_val_dict[k]
             }
            }
            new_data_dict[index] = entry
        }
        return new_data_dict
    }

    get_data_dict_index(name, res_type) {
        let target = {name: name, res_type: res_type};
        for (let index in this.state.data_dict) {
            if (this._match_row(this.state.data_dict[index], {name: name, res_type: res_type})) {
                return index
            }
        }
        return null
    }

    _saveFromSelectedResource() {
        // This will only be called when there is a single row selected
        const result_dict = {
            "res_type": this.props.selected_rows[0].res_type,
            "res_name": this.props.list_of_selected[0],
            "tags": this.props.selected_resource.tags,
            "notes": this.props.selected_resource.notes};
        let saved_selected_resource = Object.assign({}, this.props.selected_resource);
        // let saved_list_of_selected = [...this.props.list_of_selected];
        let saved_selected_rows = [...this.props.selected_rows];

        let self = this;
        postAjaxPromise("save_metadata", result_dict)
            .then(function (data) {
                let new_data_list = self.set_in_data_dict(saved_selected_rows,
                    saved_selected_resource,
                    self.state.data_dict);
                self.setState({"data_dict": new_data_list})
            })
        .catch(doFlash)
    }

    _overwriteCommonTags() {
        const result_dict = {"selected_rows": this.props.selected_rows,
                             "tags": this.props.selected_resource.tags,};
        const self = this;
        postAjaxPromise("overwrite_common_tags", result_dict)
            .then(function(data) {
                let utags = data.updated_tags;
                let new_data_dict = _.cloneDeep(self.state.data_dict);
                for (let urow of utags) {
                    new_data_dict = self.set_in_data_dict([urow],
                        {tags: urow.tags}, new_data_dict);
                }
                self.setState({data_dict: new_data_dict}, () => {
                    self.update_tag_list();
                })
            })
            .catch(doFlash)
    }

    _handleMetadataChange(changed_state_elements) {
        if (!this.props.multi_select) {
            let revised_selected_resource = Object.assign({}, this.props.selected_resource);
            revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);
            if (Object.keys(changed_state_elements).includes("tags")) {
                revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");
                this._updatePaneState({selected_resource: revised_selected_resource},
                    this._saveFromSelectedResource)
            }
            else {
                this._updatePaneState({selected_resource: revised_selected_resource})
            }
        }
        else {
            let revised_selected_resource = Object.assign({}, this.props.selected_resource);
            revised_selected_resource = Object.assign(revised_selected_resource, changed_state_elements);
            revised_selected_resource["tags"] = revised_selected_resource["tags"].join(" ");
            this._updatePaneState({selected_resource: revised_selected_resource},
                    this._overwriteCommonTags);
        }
    }

    _updatePaneState(new_state, callback) {
        this.props.updatePaneState(this.props.pane_type, new_state, callback)
    }

    _updateTagState(new_state) {
        let old_tb_state = Object.assign({}, this.props.tag_button_state);
        let new_tb_state = Object.assign(old_tb_state, new_state);
        let new_pane_state = {tag_button_state: new_tb_state};

        this._update_search_state(new_pane_state)
    }

    _handleSplitResize(left_width, right_width, width_fraction) {
        if (!this.resizing) {
            this._updatePaneState({left_width_fraction: width_fraction})
        }
    }

    _handleSplitResizeStart() {
        this.resizing = true;
    }

    _handleSplitResizeEnd(width_fraction) {
        this.resizing = false;
        this._updatePaneState({left_width_fraction: width_fraction});
    }

    _doTagDelete(tag) {
        const result_dict = {"pane_type": this.props.pane_type, "tag": tag};
        let self = this;
        postAjaxPromise("delete_tag", result_dict)
            .then(function(data) {
                self._refresh_func()
            })
            .catch(doFlash)
    }

      _doTagRename(tag_changes) {
        const result_dict = {"pane_type": this.props.pane_type, "tag_changes": tag_changes};
        let self = this;
        postAjaxPromise("rename_tag", result_dict)
            .then(function (data) {
                self._refresh_func()
            })
            .catch(doFlash)
    }

    _handleRowDoubleClick(row_dict) {
        let self = this;
        let view_view = view_views(this.props.is_repository)[row_dict.res_type];
        if (view_view == null) return;
        this._updatePaneState({
                selected_resource: row_dict,
                multi_select: false,
                list_of_selected: [row_dict.name],
                seleced_rows: [row_dict]
        });
        if (window.in_context) {
            const re = new RegExp("/$");
            view_view = view_view.replace(re, "_in_context");
            postAjaxPromise($SCRIPT_ROOT + view_view, {context_id: context_id,
                resource_name: row_dict.name})
                .then(self.props.handleCreateViewer)
                .catch(doFlash);
        }
        else {
            window.open($SCRIPT_ROOT + view_view + row_dict.name)
        }

    }

    _selectedTypes() {
        let the_types = this.props.selected_rows.map(function (row) {
          return row.res_type
        });
        the_types = [...new Set(the_types)];
        return the_types
    }
    _handleRowSelection(selected_rows) {
        if (!this.props.multi_select) {
            let sres = this.props.selected_resource;
            if (sres.name != "" && (sres.notes != this.get_data_dict_entry(sres.name, sres.res_type).notes)) {
                this._saveFromSelectedResource()
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

            let multi_select_list = selected_rows.map((row_dict)=>row_dict.name);
            let new_selected_resource = {name: "__multiple__", tags: common_tags.join(" "), notes: ""};
            this._updatePaneState({multi_select: true,
                selected_resource: new_selected_resource,
                list_of_selected: multi_select_list,
                selected_rows: selected_rows
            })
        }

         else {
            let row_dict = selected_rows[0];
            this._updatePaneState({
                selected_resource: row_dict,
                multi_select: false,
                list_of_selected: [row_dict.name],
                selected_rows: selected_rows
            })
        }
    }

    _filter_func(resource_dict, search_string) {
        try {
            return resource_dict.name.toLowerCase().search(search_string) != -1
        }
        catch(e) {
            return false
        }
    }

    _update_search_state(new_state) {
        //new_state.search_from_tags = false;
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
            if (key == "active_tag") {
                if (new_spec.hasOwnProperty("tag_button_state")) {
                    if (new_spec.tag_button_state.active_tag != this.previous_search_spec.active_tag) {
                        return true
                    }
                }
            }
            else if(new_spec.hasOwnProperty(key)) {
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
        if (this.props.multi_select) return;
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

    _handleTableKeyPress(key) {
        if (key.code == "ArrowUp") {
            this._handleArrowKeyPress("ArrowUp")
        }
        else if  (key.code == "ArrowDown") {
            this._handleArrowKeyPress("ArrowDown")
        }
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
                selected_rows: [this.state.data_dict[new_index]],
                multi_select: false,
                selectedRegions: new_regions
            })
        }

    }

    _view_func(the_view=null) {
        let self = this;
        if (the_view == null) {
            the_view = view_views(this.props.is_repository)[this.props.selected_resource.res_type]
        }
        if (window.in_context) {
            const re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            postAjaxPromise($SCRIPT_ROOT + the_view, {context_id: context_id, resource_name: this.props.selected_resource.name})
                .then(self.props.handleCreateViewer)
                .catch(doFlash);
        }
        else {
            window.open($SCRIPT_ROOT + the_view + this.props.selected_resource.name)
        }
    }

    _view_resource(selected_resource, the_view=null, force_new_tab=false) {
        const self = this;
        let resource_name = selected_resource.name;
        if (the_view == null) {
            the_view = view_views(this.props.is_repository)[selected_resource.res_type]
        }
        if (window.in_context && !force_new_tab) {
            const re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            postAjaxPromise($SCRIPT_ROOT + the_view, {context_id: context_id, resource_name: resource_name})
                .then(self.props.handleCreateViewer)
                .catch(doFlash);
        }
        else {
            window.open($SCRIPT_ROOT + the_view + resource_name)
        }

    }

    _duplicate_func (row=null) {
        let the_row = row ? row : this.props.selected_resource;
        let res_name = the_row.name;
        let res_type = the_row.res_type;
        $.getJSON($SCRIPT_ROOT + "get_resource_names/" + res_type, function(data) {
            showModalReact(`Duplicate ${res_type}`, "New Name",
                DuplicateResource, res_name, data.resource_names)
            }
        );
        let self = this;
        let duplicate_view = duplicate_views()[res_type];
        function DuplicateResource(new_name) {
            const result_dict = {
                "new_res_name": new_name,
                "res_to_copy": res_name,
                "library_id": self.props.library_id
            };
            postAjaxPromise(duplicate_view, result_dict)
                .then((data) => {
                        self._grabNewChunkWithRow(0, true, null, false, new_name)
                    }
                )
                // .catch(doFlash)
        }
    }

    _delete_func (resource) {
        let res_list = resource ? [resource] : this.props.selected_rows;
        var confirm_text;
        if (res_list.length==1) {
            let res_name = res_list[0].name;
            confirm_text = `Are you sure that you want to delete ${res_name}?`;
        }
        else {
            confirm_text = `Are you sure that you want to delete multiple items?`;
        }
        let self = this;
        let first_index = 99999;
        for (let row of this.props.selected_rows) {
            let ind = parseInt(this.get_data_dict_index(row.name, row.res_type));
            if (ind < first_index) {
                first_index = ind
            }
        }
        showConfirmDialogReact(`Delete resources`, confirm_text, "do nothing", "delete", function () {
            postAjaxPromise("delete_resource_list", {"resource_list": res_list})
                .then(() => {
                    let new_index = 0;
                    if (first_index > 0) {
                        new_index = first_index - 1;
                    }
                    self._grabNewChunkWithRow(new_index, true, null, true)
                })
                // .catch(doFlash);
        })
    }

    _rename_func (row=null) {
        let res_type;
        let res_name;
        if (!row) {
            res_type = this.props.selected_resource.res_type;
            res_name = this.props.selected_resource.name;
        }
        else {
            res_type = row.res_type;
            res_name = row.name;
        }
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
                    let ind = self.get_data_dict_index(res_name, res_type);
                    let new_data_dict = _.cloneDeep(self.state.data_dict);
                    new_data_dict[ind].name = new_name;
                    self.setState({data_dict: new_data_dict}, ()=>{self._selectRow(ind)});
                    return true
                }
            }
        }
    }

    _repository_copy_func () {
        if (!this.props.multi_select) {
            let res_type = this.props.selected_resource.res_type;
            let res_name = this.props.selected_resource.name;
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
        else {
            const result_dict = {
                "selected_rows": this.props.selected_rows
            };
            postAjaxPromise("/copy_from_repository", result_dict)
                .then(doFlash)
                .catch(doFlash);
            return ""
        }
    }

    _send_repository_func () {
        let pane_type = this.props.pane_type;
        if (!this.props.multi_select) {
            let res_type = this.props.selected_resource.res_type;
            let res_name = this.props.selected_resource.name;
            $.getJSON($SCRIPT_ROOT + "get_repository_resource_names/" + res_type, function (data) {
                    showModalReact(`Share ${res_type}`, `New ${res_type} Name`, ShareResource, res_name, data["resource_names"])
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
        }
        else {
            const result_dict = {
                "pane_type": pane_type,
                "selected_rows": this.props.selected_rows,
            };
            postAjaxPromise('/send_to_repository', result_dict)
                    .then(doFlash)
                    .catch(doFlash);
            return ""
        }
    }

    _refresh_func(callback=null) {
        this._grabNewChunkWithRow(0, true, null, true, callback)
    }

    _toggleAuxVisibility() {
        this.setState({auxIsOpen: !this.state.auxIsOpen})
    }

    _showOmnibar() {
        this.setState({showOmnibar: true})
    }

    _omnibarSelect(item) {
        let the_view = view_views(this.props.is_repository)[item.res_type];
        window.open($SCRIPT_ROOT + the_view + item);
        this._closeOmnibar()
    }

    _closeOmnibar() {
        this.setState({showOmnibar: false})
    }

    _sendToolbarRef(the_ref) {
        this.toolbarRef = the_ref;
    }

    // This total_width machinery is all part of a trick to get the table to fully render all rows
    // It seems to matter that the containing box is very tight.
    _communicateColumnWidthSum(total_width) {
        this.setState({total_width: total_width})
    }

    _new_notebook () {
        let self = this;
        if (window.in_context) {
            const the_view = `${$SCRIPT_ROOT}/new_notebook_in_context`;
            postAjaxPromise(the_view, {resource_name: ""})
                .then(self.props.handleCreateViewer)
                .catch(doFlash);
        }
        else {
            window.open(`${$SCRIPT_ROOT}/new_notebook`)
        }
    }

    _downloadJupyter () {
        let res_name = this.props.selected_resource.name;
        showModalReact("Download Notebook as Jupyter Notebook", "New File Name", function (new_name) {
            window.open(`${$SCRIPT_ROOT}/download_jupyter/` + res_name + "/" + new_name)
        }, res_name + ".ipynb")
    };

    _showJupyterImport() {
        showFileImportDialog("project", ".ipynb",
            [], this._import_jupyter,
                 this.props.tsocket, this.props.dark_theme, false, false)
    }

   _import_jupyter (myDropZone, setCurrentUrl) {
        let new_url = `import_jupyter/${this.props.library_id}`;
        myDropZone.options.url = new_url;
        setCurrentUrl(new_url);
        myDropZone.processQueue();
    };

    _combineCollections () {
        var res_name = this.props.selected_resource.name;
        let self = this;
        if (!this.props.multi_select) {
             $.getJSON(`${$SCRIPT_ROOT}get_resource_names/collection`, function (data) {
                 showSelectDialog("Select a new collection to combine with " + res_name, "Collection to Combine",
                     "Cancel", "Combine", doTheCombine, data["resource_names"])
             });

           function doTheCombine(other_name) {
                self.props.startSpinner(true);
                const target = `${$SCRIPT_ROOT}/combine_collections/${res_name}/${other_name}`;
                $.post(target, (data)=>{
                    self.props.stopSpinner();
                    if (!data.success) {
                        self.props.addErrorDrawerEntry({title: "Error combining collections", content: data.message})
                    }
                    else {
                        doFlash(data);
                    }
                });
            }
        }
        else {
            $.getJSON(`${$SCRIPT_ROOT}get_resource_names/collection`, function (data) {
                showModalReact("Combine Collections", "Name for combined collection",
                    CreateCombinedCollection, "NewCollection", data["resource_names"])
            });
        }

        function CreateCombinedCollection(new_name) {
            postAjaxPromise("combine_to_new_collection",
                {"original_collections": self.props.list_of_selected, "new_name": new_name})
                .then((data) => {
                    self._refresh_func();
                    data.new_row })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error combining collections", content: data.message})})
        }
    }

    _downloadCollection (resource_name=null) {
        let res_name = resource_name ? resource_name : this.props.selected_resource.name;
        showModalReact("Download Collection as Excel Notebook", "New File Name", function (new_name) {
            window.open(`${$SCRIPT_ROOT}/download_collection/` + res_name  + "/" + new_name)
        }, res_name + ".xlsx")
    };

    _displayImportResults(data) {
        let title = "Collection Created";
        let message = "";
        let number_of_errors;
        if (data.file_decoding_errors == null) {
            data.message = "No decoding errors were encounters";
            data.alert_type = "Success";
            doFlash(data);
        }
        else {
            message = "<b>Decoding errors were enountered</b>";
            for (let filename in data.file_decoding_errors) {
                number_of_errors = String(data.file_decoding_errors[filename].length);
                message = message + `<br>${filename}: ${number_of_errors} errors`;
            }
            this.props.addErrorDrawerEntry({title: title, content: message});
        }
    }

    _showCollectionImport() {
        showFileImportDialog("collection", ".csv,.tsv,.txt,.xls,.xlsx,.html",
            [{"checkname": "import_as_freeform", "checktext": "Import as freeform"}], this._import_collection,
                 this.props.tsocket, this.props.dark_theme, true, true)
    }

    _import_collection(myDropZone, setCurrentUrl, new_name, check_results, csv_options=null) {
        let doc_type;
        if (check_results["import_as_freeform"]) {
            doc_type = "freeform"
        } else {
            doc_type = "table"
        }
        postAjaxPromise("create_empty_collection",
            {"collection_name": new_name,
                "doc_type": doc_type,
                "library_id": this.props.library_id,
                "csv_options": csv_options
            })
            .then((data)=> {
                let new_url = `append_documents_to_collection/${new_name}/${doc_type}/${this.props.library_id}`;
                myDropZone.options.url = new_url;
                setCurrentUrl(new_url);
                this.upload_name = new_name;
                myDropZone.processQueue();
            })
            .catch((data)=>{})
    }

    _tile_view() {
        this._view_func("/view_module/")
    }

    _view_named_tile(res, in_new_tab=false) {
        this._view_resource({name: res.name, res_type: "tile"}, "/view_module/", in_new_tab)
    }

    _creator_view_named_tile(res, in_new_tab=false) {
        this._view_resource({name: res.tile, res_type: "tile"}, "/view_in_creator/", in_new_tab)
    }

    _creator_view() {
        this._view_func("/view_in_creator/")
    }

    _showHistoryViewer () {
        window.open(`${$SCRIPT_ROOT}/show_history_viewer/${this.props.selected_resource.name}`)
    }

    _compare_tiles() {
        let res_names = this.props.list_of_selected;
        if (res_names.length == 0) return;
        if (res_names.length == 1) {
            window.open(`${$SCRIPT_ROOT}/show_tile_differ/${res_names[0]}`)
        }
        else if (res_names.length == 2){
            window.open(`${$SCRIPT_ROOT}/show_tile_differ/both_names/${res_names[0]}/${res_names[1]}`)
        }
        else {
            doFlash({"alert-type": "alert-warning",
                "message": "Select only one or two tiles before launching compare"})
        }
    }

    _load_tile(resource=null) {
        let self = this;
        let res_name = resource ? resource.name : this.props.selected_resource.name;
        postWithCallback("host", "load_tile_module_task",
            {"tile_module_name": res_name, "user_id": window.user_id},
            (data)=>{
            if (!data.success) {
                self.props.addErrorDrawerEntry({title: "Error loading tile", content: data.message})
            }
            else {
                doFlash(data)
            }
        }, null, this.props.library_id)
    }

    _unload_all_tiles() {
        $.getJSON(`${$SCRIPT_ROOT}/unload_all_tiles`, doFlash)
    }

    _unload_module(resource=null) {
        let res_name = resource ? resource.name : this.props.selected_resource.name;
        $.getJSON(`${$SCRIPT_ROOT}/unload_one_module/${res_name}`, doFlash)
    }

    _new_tile (template_name) {
        $.getJSON($SCRIPT_ROOT + "get_resource_names/tile", function (data) {
                showModalReact("New Tile", "New Tile Name", CreateNewTileModule, "NewTileModule", data["resource_names"])
            }
        );
        let self = this;
        function CreateNewTileModule(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name,
                "last_saved": "viewer"
            };
            postAjaxPromise("/create_tile_module", result_dict)
                .then((data) => {
                    self._refresh_func();
                    self._.view_resource({name: new_name, res_type: "tile"}, "/view_module/");
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error creating new tile", content: data.message})})
            }
    }

    _new_in_creator (template_name) {
        $.getJSON(`${$SCRIPT_ROOT}/get_resource_names/tile`, function (data) {
                showModalReact("New Tile", "New Tile Name", CreateNewTileModule, "NewTileModule", data["resource_names"])
            }
        );
        let self = this;
        function CreateNewTileModule(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name,
                "last_saved": "creator"
            };
            postAjaxPromise("/create_tile_module", result_dict)
                .then((data) => {
                    self._refresh_func();
                    self._view_resource({name: String(new_name), res_type: "tile"}, "/view_in_creator/");
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error creating new tile", content: data.message})})
            }
    }

    _new_list (template_name) {
        $.getJSON(`${$SCRIPT_ROOT}/get_resource_names/list`, function (data) {
                showModalReact("New List Resource", "New List Resource Name", CreateNewListResource, "NewListResource", data["resource_names"])
            }
        );
        let self = this;

        function CreateNewListResource(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name
            };
            postAjaxPromise("/create_list", result_dict)
                .then((data) => {
                    self._refresh_func();
                    self._view_resource({name: String(new_name), res_type: "list"}, "/view_list/")
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error creating new list resource", content: data.message})})
        }
    }

    _add_list (myDropZone, setCurrentUrl) {
        let new_url = `import_list/${this.props.library_id}`;
        myDropZone.options.url = new_url;
        setCurrentUrl(new_url);
        myDropZone.processQueue();
    }

     _showListImport() {
        showFileImportDialog("list", "text/*",
            [], this._add_list,
                 this.props.tsocket, this.props.dark_theme, false, false)
    }

    _new_code (template_name) {
        $.getJSON(`${$SCRIPT_ROOT}/get_resource_names/code`, function (data) {
                showModalReact("New Code Resource", "New Code Resource Name", CreateNewCodeResource, "NewCodeResource", data["resource_names"])
            }
        );
        let self = this;

        function CreateNewCodeResource(new_name) {
            const result_dict = {
                "template_name": template_name,
                "new_res_name": new_name
            };
            postAjaxPromise("/create_code", result_dict)
                .then((data) => {
                    self._refresh_func();
                    self._view_resource({name: String(new_name), res_type: "code"}, "/view_code/")
                })
                .catch((data)=>{self.props.addErrorDrawerEntry({title: "Error creating new code resource", content: data.message})})
        }
    }

    _menu_funcs() {
        return {
            view_func: this._view_func,
            send_repository_func: this._send_repository_func,
            repository_copy_func: this._repository_copy_func,
            duplicate_func: this._duplicate_func,
            refresh_func: this._refresh_func,
            delete_func: this._delete_func,
            rename_func: this._rename_func,
            new_notebook: this._new_notebook,
            downloadJupyter: this._downloadJupyter,
            showJupyterImport: this._showJupyterImport,
            combineCollections: this._combineCollections,
            showCollectionImport: this._showCollectionImport,
            downloadCollection: this._downloadCollection,
            new_in_creator: this._new_in_creator,
            creator_view: this._creator_view,
            tile_view: this._tile_view,
            creator_view_named_tile: this._creator_view_named_tile,
            view_named_tile: this._view_named_tile,
            load_tile: this._load_tile,
            unload_module: this._unload_module,
            unload_all_tiles: this._unload_all_tiles,
            showHistoryViewer: this._showHistoryViewer,
            compare_tiles: this._compare_tiles,
            new_list: this._new_list,
            showListImport: this._showListImport,
            new_code: this._new_code
        }
    }

    render() {
        let new_button_groups;
        let uwidth = this.props.usable_width;
        let left_width = (uwidth) * this.props.left_width_fraction;
        const primary_mdata_fields = ["name", "created", "created_for_sort",
            "updated",  "updated_for_sort", "tags", "notes"];
        const ignore_fields = ["doc_type", "size_for_sort", "res_type"];
        let additional_metadata = {};
        for (let field in this.props.selected_resource) {
            if (!primary_mdata_fields.includes(field) && !ignore_fields.includes(field)
                && !field.startsWith("icon")) {
                additional_metadata[field] = this.props.selected_resource[field]
            }
        }
        if (Object.keys(additional_metadata).length == 0) {
            additional_metadata = null
        }

        // let right_pane;
        let split_tags = this.props.selected_resource.tags == "" ? [] : this.props.selected_resource.tags.split(" ");
        let outer_style = {marginTop: 0, marginLeft: 5, overflow: "auto", padding: 15, marginRight: 0, height: "100%"};
        let right_pane = (
                <CombinedMetadata tags={split_tags}
                                  elevation={2}
                                  name={this.props.selected_resource.name}
                                  created={this.props.selected_resource.created}
                                  updated={this.props.selected_resource.updated}
                                  notes={this.props.selected_resource.notes}
                                  handleChange={this._handleMetadataChange}
                                  res_type={this.props.selected_resource.res_type}
                                  pane_type={this.props.pane_type}
                                  outer_style={outer_style}
                                  handleNotesBlur={this.props.multi_select ? null : this._saveFromSelectedResource}
                                  additional_metadata={additional_metadata}
                                  aux_pane={this.props.aux_pane}
                                  aux_pane_title={this.props.aux_pane_title}
                                  readOnly={this.props.is_repository}
                />
         );

        let th_style= {
            "display": "inline-block",
            "verticalAlign": "top",
            "maxHeight": "100%",
            "overflowY": "scroll",
            "overflowX": "scroll",
            "lineHeight": 1,
            "whiteSpace": "nowrap",
        };

        // let filtered_data_list = _.cloneDeep(this.state.data_list.filter(this._filter_on_match_list));
        let MenubarClass = this.props.MenubarClass;

        let table_width;
        let left_pane_height;
        if (this.table_ref && this.table_ref.current) {
            table_width = left_width - this.table_ref.current.offsetLeft + this.top_ref.current.offsetLeft;
            left_pane_height = this.props.usable_height - this.table_ref.current.offsetTop - BOTTOM_MARGIN
        }
        else {
            table_width = left_width - 150;
            left_pane_height = this.props.usable_height - 100
        }

        let key_bindings = [
            [["up"], ()=>this._handleArrowKeyPress("ArrowUp")],
            [["down"], ()=>this._handleArrowKeyPress("ArrowDown")],
            [["ctrl+space"], this._showOmnibar]
        ];

        let left_pane = (
            <React.Fragment>
                <div className="d-flex flex-row" style={{maxHeight: "100%", position: "relative"}}>
                    <div className="d-flex justify-content-around"
                         style={{paddingRight: 10,
                             maxHeight: left_pane_height
                         }}>
                        <TagButtonList tag_list={this.state.tag_list}
                                       {...this.props.tag_button_state}
                                        updateTagState={this._updateTagState}
                                       doTagDelete={this._doTagDelete}
                                       doTagRename={this._doTagRename}
                        />
                    </div>
                    <div ref={this.table_ref}
                         className={this.props.pane_type + "-pane"}
                         style={{width: table_width,
                             maxWidth: this.state.total_width,
                             maxHeight: left_pane_height - 20, // The 20 is for the marginTop and padding
                             overflowY: "clip",
                             marginTop: 15,
                             padding: 5}}>
                        <SearchForm allow_search_inside={this.props.allow_search_inside}
                                    allow_search_metadata={this.props.allow_search_metadata}
                                    update_search_state={this._update_search_state}
                                    search_string={this.props.search_string}
                                    search_inside={this.props.search_inside}
                                    search_metadata={this.props.search_metadata}
                        />
                        {this.props.pane_type == "all" &&
                            <RadioGroup
                                inline={true}
                                onChange={this._handleTypeFilterChange}
                                selectedValue={this.props.filterType}>
                                <Radio label="All" value="all" />
                                <Radio label="Collections" value="collection" />
                                <Radio label="Projects" value="project" />
                                <Radio label="Tiles" value="tile" />
                                <Radio label="Lists" value="list" />
                                <Radio label="Code" value="code" />
                            </RadioGroup>
                        }
                        <BpSelectorTable data_dict={this.state.data_dict}
                                         columns={this.props.columns}
                                         num_rows={this.state.num_rows}
                                         open_resources={this.props.open_resources}
                                         sortColumn={this._set_sort_state}
                                         selectedRegions={this.props.selectedRegions}
                                         communicateColumnWidthSum={this._communicateColumnWidthSum}
                                         onSelection={this._onTableSelection}
                                         keyHandler={this._handleTableKeyPress}
                                         initiateDataGrab={this._initiateDataGrab}
                                         renderBodyContextMenu={this._renderBodyContextMenu}
                                         handleRowDoubleClick={this._handleRowDoubleClick}
                                    />
                        </div>
                    </div>
            </React.Fragment>
        );
        let selected_types = this._selectedTypes();
        let selected_type = selected_types.length == 1 ? this.props.selected_resource.res_type : "multi";
        return (
            <React.Fragment>
                <MenubarClass selected_resource={this.props.selected_resource}
                              multi_select={this.props.multi_select}
                              list_of_selected={this.props.list_of_selected}
                              selected_rows={this.props.selected_rows}
                              selected_type={selected_type}
                              {...this._menu_funcs()}
                              startSpinner={this.props.startSpinner}
                              stopSpinner={this.props.stopSpinner}
                              clearStatusMessage={this.props.clearStatusMessage}
                              sendRef={this._sendToolbarRef}
                              sendContextMenuItems={this._sendContextMenuItems}
                              view_resource={this._view_resource}
                              {...this.props.errorDrawerFuncs}
                              handleCreateViewer={this.props.handleCreateViewer}
                              library_id={this.props.library_id}
                              dark_theme={this.props.dark_theme}
                              controlled={this.props.controlled}
                              am_selected={this.props.am_selected}
                              tsocket={this.props.tsocket}
                          />

                <div ref={this.top_ref} className="d-flex flex-column" >
                      <div style={{width: uwidth, height: this.props.usable_height}}>
                          <HorizontalPanes
                                 available_width={uwidth}
                                 available_height={this.props.usable_height}
                                 show_handle={true}
                                 left_pane={left_pane}
                                 right_pane={right_pane}
                                 right_pane_overflow="auto"
                                 initial_width_fraction={.75}
                                 scrollAdjustSelectors={[".bp4-table-quadrant-scroll-container"]}
                                 handleSplitUpdate={this._handleSplitResize}
                                 handleResizeStart={this._handleSplitResizeStart}
                                 handleResizeEnd={this._handleSplitResizeEnd}
                            />
                        </div>
                    <KeyTrap global={true} bindings={key_bindings} />
                    <LibraryOmnibar res_type={this.props.pane_type}
                                    onItemSelect={this._omnibarSelect}
                                    handleClose={this._closeOmnibar}
                                    showOmnibar={this.state.showOmnibar}/>
                </div>
            </React.Fragment>
        )
    }
}

LibraryPane.propTypes = {
    columns: PropTypes.object,
    pane_type: PropTypes.string,
    open_resources: PropTypes.array,
    allow_search_inside: PropTypes.bool,
    allow_search_metadata: PropTypes.bool,
    MenubarClass: PropTypes.func,
    updatePaneState: PropTypes.func,
    is_repository: PropTypes.bool,
    aux_pane: PropTypes.object,
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
    search_tag: PropTypes.string,
    tag_button_state: PropTypes.object,
    contextItems: PropTypes.array,
    library_id: PropTypes.string

};

LibraryPane.defaultProps = {
    columns: {"name": {"sort_field": "name", "first_sort": "ascending"},
             "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
            "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
            "tags": {"sort_field": "tags", "first_sort": "ascending"}},
    is_repository: false,
    tsocket: null,
    aux_pane: null,
    dark_theme: false
};


