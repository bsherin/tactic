
import React from "react";
import PropTypes from 'prop-types';

import { Menu, MenuItem, Button, Collapse } from "@blueprintjs/core";
import {Regions} from "@blueprintjs/table";
import _ from 'lodash';

import {TagButtonList} from "./tag_buttons_react.js";
import {CombinedMetadata} from "./blueprint_mdata_fields.js";
import {SearchForm, BpSelectorTable, LibraryOmnibar} from "./library_widgets.js";
import {HorizontalPanes, HANDLE_WIDTH} from "./resizing_layouts.js";
import {showModalReact, showConfirmDialogReact} from "./modal_react.js";
import {postAjax, postAjaxPromise} from "./communication_react.js"
import {TacticContext} from "./tactic_context.js";
import {SIDE_MARGIN} from "./sizing_tools.js";

import {doFlash} from "./toaster.js"
import {KeyTrap} from "./key_trap.js";
import {doBinding} from "./utilities_react.js";

export {LibraryPane, view_views}

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


class BodyMenu extends React.Component {

    getIntent(item) {
        return item.intent ? item.intent : null
    }

    render() {
        let disabled = false;
        let menu_items = this.props.items.map((item, index)=> {
                if (item.text == "__divider__") {
                    return <Menu.Divider key={index}/>
                } else {
                    return (<MenuItem icon={item.icon} disabled={disabled}
                                         onClick={() => item.onClick(this.props.selected_rows[0].name)}
                                         intent={this.getIntent(item)}
                                         key={item.text}
                                         text={item.text}/>)
                }
            }
        );
        return (
            <Menu>
                <Menu.Divider title={this.props.selected_rows[0].name} className="context-menu-header"/>
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

    constructor(props, context) {
        super(props, context);
        this.top_ref = React.createRef();
        this.table_ref = React.createRef();
        this.resizing = false;
        this.get_url = `grab_${props.res_type}_list_chunk`;
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

    }

    initSocket() {
        if ((this.context.tsocket != null) && (!this.props.is_repository)) {
            this.context.tsocket.attachListener(`update-${this.props.res_type}-selector-row`, this._handleRowUpdate);
            this.context.tsocket.attachListener(`refresh-${this.props.res_type}-selector`, this._refresh_func);
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
            sort_field: this.props.sorting_column,
            sort_direction: this.props.sorting_direction
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

        this._grabNewChunkWithRow(0, true, null, true, null)
    }

    _grabNewChunkWithRow(row_index, flush=false, spec_update=null, select=false, select_by_name=null, callback=null) {
        let search_spec = this._getSearchSpec();
        if (spec_update) {
            search_spec = Object.assign(search_spec, spec_update)
        }
        if (search_spec.active_tag && search_spec.active_tag[0] != "/") {
            search_spec.active_tag = "/" + search_spec.active_tag
        }
        let data = {search_spec: search_spec, row_number: row_index, is_repository: this.props.is_repository};
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
            self.setState({data_dict: new_data_dict, num_rows: data.num_rows, tag_list: data.all_tags}, ()=>{
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
        this._grabNewChunkWithRow(row_index)
    }

    _handleRowUpdate(res_dict) {
        let res_name = res_dict.name;
        let res_tags = res_dict.tags.split(" ");
        let ind = this.get_data_dict_index(res_name);
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
        this.setState(new_state);
    }

    update_tag_list() {

    }


    delete_row(name) {
        let ind = this.get_data_list_index(name);
        let new_data_list = [...this.state.data_list];
        new_data_list.splice(ind, 1);
        if (this.props.list_of_selected.includes(name)) {
            this._updatePaneState({list_of_selected: [], multi_select: false,
                selected_resource: {"name": "", "tags": "", "notes": "", "updated": "", "created": ""}});
        }
        this.setState({data_list: new_data_list}, this.update_tag_list);
    }

    get_data_dict_entry(name) {
        for (let index in this.state.data_dict) {
            if (this.state.data_dict[index].name == name) {
                return this.state.data_dict[index]
            }
        }
        return null
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

    _saveFromSelectedResource() {
        const result_dict = {"res_type": this.props.res_type,
            "res_name": this.props.list_of_selected[0],
            "tags": this.props.selected_resource.tags,
            "notes": this.props.selected_resource.notes};
        let saved_selected_resource = Object.assign({}, this.props.selected_resource);
        let saved_list_of_selected = [...this.props.list_of_selected];

        let self = this;
        postAjaxPromise("save_metadata", result_dict)
            .then(function (data) {
                let new_data_list = self.set_in_data_dict(saved_list_of_selected,
                    saved_selected_resource,
                    self.state.data_dict);
                self.setState({"data_dict": new_data_list})
            })
        .catch(doFlash)
    }

    _overwriteCommonTags() {
        const result_dict = {"res_type": this.props.res_type,
                            "res_names": this.props.list_of_selected,
                             "tags": this.props.selected_resource.tags,};
        const self = this;
        postAjaxPromise("overwrite_common_tags", result_dict)
            .then(function(data) {
                let utags = data.updated_tags;
                let new_data_dict = _.cloneDeep(self.state.data_dict);
                for (let res_name in utags) {
                    new_data_dict = self.set_in_data_dict([res_name],
                        {tags: utags[res_name]}, new_data_dict);
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

    addOneTag(res_name, the_tag) {
        let dl_entry = this.get_data_dict_entry(res_name);
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

    _updatePaneState(new_state, callback) {
        this.props.updatePaneState(this.props.res_type, new_state, callback)
    }

    _updateTagState(new_state) {
        let old_tb_state = Object.assign({}, this.props.tag_button_state);
        let new_tb_state = Object.assign(old_tb_state, new_state);
        let new_pane_state = {tag_button_state: new_tb_state};

        this._update_search_state(new_pane_state)
    }

    _handleAddTag(res_name, the_tag) {
        if (this.props.list_of_selected.includes(res_name) && this.props.multi_select) {
            for (let the_name of this.props.list_of_selected) {
                this.addOneTag(the_name, the_tag)
            }
            let selected_tags = this.props.selected_resource.tags;
            if (!selected_tags.includes(the_tag)) {
                selected_tags = selected_tags + " " + the_tag;
                selected_tags = selected_tags.trim();
                let new_selected_resource = this.props.selected_resource;
                new_selected_resource["tags"] = selected_tags;
                this._updatePaneState({"selected_resource": new_selected_resource})
            }
        }
        else {
            this.addOneTag(res_name, the_tag)
        }

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
        const result_dict = {"res_type": this.props.res_type, "tag": tag};
        let self = this;
        postAjaxPromise("delete_tag", result_dict)
            .then(function(data) {
                self._refresh_func()
            })
            .catch(doFlash)
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
        let self = this;
        let view_view = view_views(this.props.is_repository)[this.props.res_type];
        if (view_view == null) return;
        this._updatePaneState({
                selected_resource: row_dict,
                multi_select: false,
                list_of_selected: [row_dict.name]
        });
        if (window.in_context) {
            const re = new RegExp("/$");
            view_view = view_view.replace(re, "_in_context");
            postAjaxPromise($SCRIPT_ROOT + view_view, {context_id: context_id,
                resource_name: row_dict.name})
                .then(self.context.handleCreateViewer)
                .catch(doFlash);
        }
        else {
            window.open($SCRIPT_ROOT + view_view + row_dict.name)
        }

    }

    _handleRowSelection(selected_rows) {
        if (!this.props.multi_select &&
            this.props.selected_resource.name != "" &&
            (this.props.selected_resource.notes != this.get_data_dict_entry(this.props.selected_resource.name).notes)) {
            this._saveFromSelectedResource()
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
                     common_tags = new_common_tags
                }
            }

            let multi_select_list = selected_rows.map((row_dict)=>row_dict.name);
            let new_selected_resource = {name: "__multiple__", tags: common_tags.join(" "), notes: ""};
            this._updatePaneState({multi_select: true,
                selected_resource: new_selected_resource,
                list_of_selected: multi_select_list
            })
        }

         else {
            let row_dict = selected_rows[0];
            this._updatePaneState({
                selected_resource: row_dict,
                multi_select: false,
                list_of_selected: [row_dict.name]
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
                multi_select: false,
                selectedRegions: new_regions
            })
        }

    }

    _view_func(the_view=null) {
        let self = this;
        if (the_view == null) {
            the_view = view_views(this.props.is_repository)[this.props.res_type]
        }
        if (window.in_context) {
            const re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            postAjaxPromise($SCRIPT_ROOT + the_view, {context_id: context_id, resource_name: this.props.selected_resource.name})
                .then(self.context.handleCreateViewer)
                .catch(doFlash);
        }
        else if (!this.state.multi_select) {
            window.open($SCRIPT_ROOT + the_view + this.props.selected_resource.name)
        }
    }

    _view_resource(resource_name, the_view=null, force_new_tab=false) {
        const self = this;
        if (the_view == null) {
            the_view = view_views(this.props.is_repository)[this.props.res_type]
        }
        if (window.in_context && !force_new_tab) {
            const re = new RegExp("/$");
            the_view = the_view.replace(re, "_in_context");
            postAjaxPromise($SCRIPT_ROOT + the_view, {context_id: context_id, resource_name: resource_name})
                .then(self.context.handleCreateViewer)
                .catch(doFlash);


        }
        else {
            window.open($SCRIPT_ROOT + the_view + resource_name)
        }

    }

    _duplicate_func (duplicate_view, resource_name=null) {
        let res_type = this.props.res_type;
        let res_name = resource_name ? resource_name : this.props.selected_resource.name;
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
                        self._grabNewChunkWithRow(0, true, null, false, new_name)
                    }
                )
                .catch(doFlash)
        }
    }

    _delete_func (delete_view, resource_name=null) {
        var res_type = this.props.res_type;
        let res_names = resource_name ? [resource_name] : this.props.list_of_selected;
        var confirm_text;
        if (res_names.length==1) {
            let res_name = res_names[0];
            confirm_text = `Are you sure that you want to delete ${res_name}?`;
        }
        else {
            confirm_text = `Are you sure that you want to delete multiple items?`;
        }
        let self = this;
        let first_index = 99999;
        for (let res of res_names) {
            let ind = parseInt(this.get_data_dict_index(res));
            if (ind < first_index) {
                first_index = ind
            }
        }
        showConfirmDialogReact(`Delete ${res_type}`, confirm_text, "do nothing", "delete", function () {
            postAjaxPromise(delete_view, {"resource_names": res_names})
                .then(() => {
                    let new_index = 0;
                    if (first_index > 0) {
                        new_index = first_index - 1;
                    }
                    self._grabNewChunkWithRow(new_index, true, null, true)
                })
                .catch(doFlash);
        })
    }

    _rename_func (resource_name=null) {
        let res_type = this.props.res_type;
        let res_name = resource_name ? resource_name : this.props.selected_resource.name;
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
                    let ind = self.get_data_dict_index(res_name);
                    let new_data_dict = _.cloneDeep(self.state.data_dict);
                    new_data_dict[ind].name = new_name;
                    self.setState({data_dict: new_data_dict}, ()=>{self._selectRow(ind)});
                    return true
                }
            }
        }
    }

    _repository_copy_func () {
        let res_type = this.props.res_type;
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

    _send_repository_func () {
        let res_type = this.props.res_type;
        let res_name = this.props.selected_resource.name;
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
        let the_view = view_views(this.props.is_repository)[this.props.res_type];
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
    
    _get_available_width() {
        let result;
        if (this.top_ref && this.top_ref.current) {
            result = window.innerWidth - this.top_ref.current.offsetLeft - SIDE_MARGIN;
        }
        else {
            result = window.innerWidth - 200
        }
        return result
    }

    render() {
        let new_button_groups;
        let uwidth = this.props.usable_width - 2 * SIDE_MARGIN;
        let left_width = (uwidth - HANDLE_WIDTH) * this.props.left_width_fraction;
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

        let right_pane;
        let split_tags = this.props.selected_resource.tags == "" ? [] : this.props.selected_resource.tags.split(" ");
        let outer_style = {marginLeft: 5, marginRight: 5, marginTop: 90, overflow: "auto",
            padding: 15};
        let mdata_element = (
                <CombinedMetadata tags={split_tags}
                                  elevation={2}
                                  name={this.props.selected_resource.name}
                                  created={this.props.selected_resource.created}
                                  updated={this.props.selected_resource.updated}
                                  notes={this.props.selected_resource.notes}
                                  handleChange={this._handleMetadataChange}
                                  res_type={this.props.res_type}
                                  outer_style={outer_style}
                                  handleNotesBlur={this.props.multi_select ? null : this._saveFromSelectedResource}
                                  additional_metadata={additional_metadata}
                />
         );

        if (this.props.aux_pane == null) {
            right_pane = mdata_element;
        }
        else {
            let button_base = this.state.auxIsOpen ? "Hide" : "Show";
            right_pane = (
                <React.Fragment>
                    {mdata_element}
                    <div  className="d-flex flex-row justify-content-around" style={{marginTop: 20}}>
                        <Button fill={false}
                                   small={true}
                                   minimal={false}
                                   onClick={this._toggleAuxVisibility}>
                            {button_base + " " + this.props.aux_pane_title}
                        </Button>
                    </div>
                    <Collapse isOpen={this.state.auxIsOpen} keepChildrenMounted={true}>
                        {this.props.aux_pane}
                    </Collapse>
                </React.Fragment>
            )
        }
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
        let ToolbarClass = this.props.ToolbarClass;

        let table_width;
        let toolbar_left;
        if (this.table_ref && this.table_ref.current) {
            table_width = left_width - this.table_ref.current.offsetLeft + this.top_ref.current.offsetLeft;
            if (this.toolbarRef && this.toolbarRef.current) {
                let tbwidth = this.toolbarRef.current.offsetWidth;
                toolbar_left = this.table_ref.current.offsetLeft + .5 * table_width - .5 * tbwidth;
                if (toolbar_left < 0) toolbar_left = 0
            }
            else {
                toolbar_left = 175
            }
        }
        else {
            table_width = left_width - 150;
            toolbar_left = 175
        }

        let key_bindings = [
            [["up"], ()=>this._handleArrowKeyPress("ArrowUp")],
            [["down"], ()=>this._handleArrowKeyPress("ArrowDown")],
            [["ctrl+space"], this._showOmnibar]
        ];

        let left_pane = (
            <React.Fragment>
                <div className="d-flex flex-row" style={{"maxHeight": "100%"}}>
                    <div className="d-flex justify-content-around" style={{paddingRight: 10}}>
                        <TagButtonList res_type={this.props.res_type}
                                       tag_list={this.state.tag_list}
                                       {...this.props.tag_button_state}
                                        updateTagState={this._updateTagState}
                                       handleAddTag={this._handleAddTag}
                                       doTagDelete={this._doTagDelete}
                                       doTagRename={this._doTagRename}
                        />
                    </div>
                    <div ref={this.table_ref}
                         // className="d-flex flex-column"
                         style={{width: table_width, maxWidth: this.state.total_width, padding: 5}}>
                        <SearchForm allow_search_inside={this.props.allow_search_inside}
                                    allow_search_metadata={this.props.allow_search_metadata}
                                    update_search_state={this._update_search_state}
                                    search_string={this.props.search_string}
                                    search_inside={this.props.search_inside}
                                    search_metadata={this.props.search_metadata}
                        />
                        {/*<div style={th_style} id={`${this.props.res_type}-table`}>*/}
                        <BpSelectorTable data_dict={this.state.data_dict}
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
                                         handleAddTag={this._handleAddTag}
                                    />
                        </div>
                    </div>
            </React.Fragment>
        );
        return (

                <div ref={this.top_ref} className="d-flex flex-column mt-3" >
                    <ToolbarClass selected_resource={this.props.selected_resource}
                                  multi_select={this.props.multi_select}
                                  list_of_selected={this.props.list_of_selected}
                                  view_func={this._view_func}
                                  send_repository_func={this._send_repository_func}
                                  repository_copy_func={this._repository_copy_func}
                                  duplicate_func={this._duplicate_func}
                                  refresh_func={this._refresh_func}
                                  delete_func={this._delete_func}
                                  rename_func={this._rename_func}
                                  startSpinner={this.props.startSpinner}
                                  stopSpinner={this.props.stopSpinner}
                                  clearStatusMessage={this.props.clearStatusMessage}
                                  left_position={toolbar_left}
                                  sendRef={this._sendToolbarRef}
                                  sendContextMenuItems={this._sendContextMenuItems}
                                  view_resource={this._view_resource}
                                  {...this.props.errorDrawerFuncs}
                                  handleCreateViewer={this.context.handleCreateViewer}
                                  library_id={this.props.library_id}
                                  />
                      <div style={{width: uwidth, height: this.props.usable_height}}>
                          <HorizontalPanes
                                 available_width={uwidth}
                                 available_height={this.props.usable_height - 100}
                                 show_handle={true}
                                 left_pane={left_pane}
                                 right_pane={right_pane}
                                 right_pane_overflow="auto"
                                 initial_width_fraction={.75}
                                 scrollAdjustSelectors={[".bp3-table-quadrant-scroll-container"]}
                                 handleSplitUpdate={this._handleSplitResize}
                                 handleResizeStart={this._handleSplitResizeStart}
                                 handleResizeEnd={this._handleSplitResizeEnd}
                            />
                        </div>
                    <KeyTrap global={true} bindings={key_bindings} />
                    <LibraryOmnibar res_type={this.props.res_type}
                                    onItemSelect={this._omnibarSelect}
                                    handleClose={this._closeOmnibar}
                                    showOmnibar={this.state.showOmnibar}/>
                </div>
        )
    }
}

LibraryPane.propTypes = {
    res_type: PropTypes.string,
    open_resources: PropTypes.array,
    allow_search_inside: PropTypes.bool,
    allow_search_metadata: PropTypes.bool,
    ToolbarClass: PropTypes.func,
    updatePaneState: PropTypes.func,
    is_repository: PropTypes.bool,
    aux_pane: PropTypes.object,
    left_width_fraction: PropTypes.number,
    selected_resource: PropTypes.object,
    sorting_column: PropTypes.string,
    sorting_field: PropTypes.string,
    sorting_direction: PropTypes.string,
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
    is_repository: false,
    tsocket: null,
    aux_pane: null,
    dark_theme: false
};

LibraryPane.contextType = TacticContext;

