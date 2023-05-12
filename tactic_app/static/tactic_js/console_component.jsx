
import React from "react";
import PropTypes from 'prop-types';

import 'codemirror/mode/markdown/markdown.js'

import { Icon, Card, EditableText, Spinner, ContextMenuTarget, MenuDivider, Divider } from "@blueprintjs/core";
import { Menu, MenuItem, ButtonGroup, Button} from "@blueprintjs/core";
import _ from 'lodash';

import { SortableHandle } from 'react-sortable-hoc';
import markdownIt from 'markdown-it'
import 'markdown-it-latex/dist/index.css'
import markdownItLatex from 'markdown-it-latex'
const mdi = markdownIt({html: true});
mdi.use(markdownItLatex);

import {GlyphButton} from "./blueprint_react_widgets.js";
import {ReactCodemirror} from "./react-codemirror.js";
import {SortableComponent} from "./sortable_container.js";
import {MySortableElement} from "./sortable_container.js";
import {KeyTrap} from "./key_trap.js";
import {postAjaxPromise, postWithCallback} from "./communication_react.js"
import {doFlash} from "./toaster.js"
import {doBinding} from "./utilities_react.js";
import {showConfirmDialogReact, showSelectResourceDialog} from "./modal_react.js";
import {icon_dict} from "./blueprint_mdata_fields.js";
import {view_views} from "./library_pane.js";
import {TacticMenubar} from "./menu_utilities.js";
import {FilterSearchForm} from "./search_form";
import {SearchableConsole} from "./searchable_console";

export {ConsoleComponent}

const MAX_CONSOLE_WIDTH = 1800;
const BUTTON_CONSUMED_SPACE = 208;
const SECTION_INDENT = 25;  // This is also hard coded into the css file at the moment

 class RawConsoleComponent extends React.PureComponent {
     constructor(props, context) {
         super(props, context);
         doBinding(this, "_", RawConsoleComponent.prototype);
         this.header_ref = React.createRef();
         this.body_ref = React.createRef();
         this.state = {
             hide_in_section: false,
             console_item_with_focus: null,
             console_item_saved_focus: null,
             console_error_log_text: "",
             main_log_since: null,
             max_console_lines: 100,
             pseudo_log_since: null,
             show_console_error_log: false,
             all_selected_items: [],
             search_string: null,
             filter_console_items: false,
             search_helper_text: null

         };
         this.pseudo_tile_id = null;
         this.socket_counter = null;
         this.initSocket();
     }

     componentDidMount() {
        let self = this;
         this.setState({"mounted": true}, ()=>{
             if (this.props.console_items.length == 0) {
                 self._addCodeArea("", false)
             }
             self._clear_all_selected_items()
         })
     }

     initSocket() {
         let self = this;
         function _handleConsoleMessage(data) {
             if (data.main_id == self.props.main_id) {
                 let handlerDict = {
                     consoleLog: (data) => self._addConsoleEntry(data.message, data.force_open, true),
                     consoleLogMultiple: (data) => self._addConsoleEntries(data.message, data.force_open, true),
                     createLink: (data) => {
                         let unique_id = data.message.unique_id;
                         self._addConsoleEntry(data.message, data.force_open, false, null, ()=>{
                             self._insertLinkInItem(unique_id)
                         })
                     },
                     stopConsoleSpinner: (data) => {
                         let execution_count = "execution_count" in data ? data.execution_count : null;
                         self._stopConsoleSpinner(data.console_id, execution_count)
                     },
                     consoleCodePrint: (data) => self._appendConsoleItemOutput(data),
                     consoleCodeOverwrite: (data) => self._setConsoleItemOutput(data),
                     consoleCodeRun: (data) => self._startSpinner(data.console_id),
                     updateLog: (data) => self._addToLog(data.new_line)
                 };
                 handlerDict[data.console_message](data)
             }
         }

         // We have to careful to get the very same instance of the listerner function
         // That requires storing it outside of this component since the console can be unmounted

         this.props.tsocket.attachListener("console-message", _handleConsoleMessage);
     }

     _createTextEntry(unique_id, summary_text) {
         return {
             unique_id: unique_id,
             type: "text",
             am_shrunk: false,
             summary_text: summary_text,
             console_text: "",
             show_markdown: false
         }
     }

     _addConsoleText(the_text, callback=null) {
         postWithCallback("host", "print_text_area_to_console",
             {"console_text": the_text, "user_id": window.user_id, "main_id": this.props.main_id}, function (data) {
                 if (!data.success) {
                     doFlash(data)
                 }
                 else if (callback != null) {
                     callback();
                 }
             }, null, this.props.main_id);
     }

     _addBlankText() {
         if (!this.props.am_selected) {
             return
         }
         this._addConsoleText("")
     }

     _addConsoleDivider(header_text, callback=null) {
         postWithCallback("host", "print_divider_area_to_console",
             {"header_text": header_text, "user_id": window.user_id, "main_id": this.props.main_id}, function (data) {
                 if (!data.success) {
                     doFlash(data)
                 }
                 else if (callback) {
                     callback()
                 }
             }, null, this.props.main_id);
     }

     _addBlankDivider() {
         if (!this.props.am_selected) {
             return
         }
         this._addConsoleDivider("")
     }

     // _insertTextInCell(the_text) {
     //     let unique_id = this.state.currently_selected_item;
     //     let entry = this.get_console_item_entry(unique_id);
     //     let replace_dicts = [];
     //     replace_dicts.push({unique_id: unique_id, field:"console_text", value: entry.console_text + the_text});
     //     replace_dicts.push({unique_id: unique_id, field: "force_sync_to_prop", value: true});
     //     this._multiple_console_item_updates(replace_dicts)
     // }

     _getSectionIds(unique_id) {
         let cindex = this._consoleItemIndex(unique_id);
         let id_list = [unique_id];
         for (let i=cindex + 1; i < this.props.console_items.length; ++i) {
             let entry = this.props.console_items[i];
             id_list.push(entry.unique_id);
             if (entry.type == "section-end") {
                 break
             }
         }
         return id_list
     }
     
     _deleteSection(unique_id=null) {
         if (!unique_id) {
             if (this.state.all_selected_items.length != 1) {
                 return
             }
             unique_id = this.state.all_selected_items[0];
             let entry = this.get_console_item_entry(unique_id);
             if (entry.type != "divider") {
                 return
             }
         }
         let id_list = this._getSectionIds(unique_id);
         let cindex = this._consoleItemIndex(unique_id);
         let new_console_items = [...this.props.console_items];
         new_console_items.splice(cindex, id_list.length);
         this._clear_all_selected_items(()=>{
             this.props.setMainStateValue("console_items", new_console_items);
         })
     }

     _copySection(unique_id=null) {
         if (!unique_id) {
             if (this.state.all_selected_items.length != 1) {
                 return
             }
             unique_id = this.state.all_selected_items[0];
             let entry = this.get_console_item_entry(unique_id);
             if (entry.type != "divider") {
                 return
             }
         }
         let id_list = this._getSectionIds(unique_id);
        this._copyItems(id_list)
     }

     _copyCell(unique_id = null) {
         let id_list;
         if (!unique_id) {
            id_list = this._sortSelectedItems();
            if (id_list.length == 0) {
                return
            }
         }
         else {
             id_list = [unique_id]
         }
         this._copyItems(id_list)
     }

     _copyAll() {
         const result_dict = {
             "main_id": this.props.main_id,
             "console_items": this.props.console_items,
             "user_id": window.user_id,
         };
         postWithCallback("host", "copy_console_cells", result_dict, null, null, this.props.main_id);
     }

     _copyItems(id_list) {
         let entry_list = [];
         for (let uid of id_list) {
             let entry = this.get_console_item_entry(uid);
             entry.am_selected = false;
             entry_list.push(entry)
         }
         const result_dict = {
             "main_id": this.props.main_id,
             "console_items": entry_list,
             "user_id": window.user_id,
         };
         postWithCallback("host", "copy_console_cells", result_dict, null, null, this.props.main_id);
     }

     _pasteCell(unique_id = null) {
         let self = this;
         postWithCallback("host", "get_copied_console_cells", {user_id: window.user_id}, (data) => {
             if (!data.success) {
                 doFlash(data)
             } else {
                 this._addConsoleEntries(data.console_items, true, false, unique_id)
             }
         }, null, self.props.main_id)
     }

     _addConsoleTextLink(callback=null) {
         postWithCallback("host", "print_link_area_to_console",
             {"user_id": window.user_id, "main_id": this.props.main_id}, function (data) {
                 if (!data.success) {
                     doFlash(data)
                 }
                 else if (callback) {
                     callback()
                 }
             }, null, this.props.main_id);
     }

     _currently_selected() {
         if (this.state.all_selected_items.length == 0) {
             return null
         }
         else {
             return _.last(this.state.all_selected_items)
         }
     }

     _insertResourceLink() {
         if (!this._currently_selected()) {
             this._addConsoleTextLink();
             return
         }
         let entry = this.get_console_item_entry(this._currently_selected());
         if (!entry || entry.type != "text") {
             this._addConsoleTextLink();
             return;
         }
         this._insertLinkInItem(this._currently_selected());
     }

     _insertLinkInItem(unique_id) {
         let self = this;
         let entry = this.get_console_item_entry(unique_id);
         showSelectResourceDialog("cancel", "insert link", (result) => {
             let new_links = "links" in entry ? [...entry.links] : [];
             new_links.push({res_type: result.type,res_name: result.selected_resource});
             self._setConsoleItemValue(entry.unique_id, "links", new_links)
         })
     }

     _addBlankCode(e) {
         if (!this.props.am_selected) {
             return
         }
         this._addCodeArea("");
     }

     _addCodeArea(the_text, force_open = true) {
         let self = this;
         postWithCallback("host", "print_code_area_to_console",
             {console_text: the_text, user_id: window.user_id, main_id: this.props.main_id, force_open: force_open},
             function (data) {
                 if (!data.success) {
                     doFlash(data)
                 }
             }, null, self.props.main_id);
     }

     _resetConsole() {
         let new_console_items = [];
         for (let entry of this.props.console_items) {
             if (entry.type != "code") {
                 new_console_items.push(entry)
             } else {
                 let new_entry = Object.assign({}, entry);
                 new_entry.output_text = "";
                 new_entry.execution_count = 0;
                 new_console_items.push(new_entry)
             }
         }
         this.props.setMainStateValue("console_items", new_console_items);
         postWithCallback(this.props.main_id, "clear_console_namespace", {}, null, null, this.props.main_id)
     }

     _stopAll() {
         postWithCallback(this.props.main_id, "stop_all_console_code", {}, null, null, this.props.main_id)
     }


     _clearConsole() {
         const confirm_text = "Are you sure that you want to erase everything in this log?";
         let self = this;
         showConfirmDialogReact("Clear entire log", confirm_text, "do nothing", "clear", function () {
             self.setState({all_selected_items: []}, ()=>{
                 self.props.setMainStateValue("console_items", [])
             })
         })
     }

     _toggleConsoleLog() {
         let self = this;
         if (this.state.show_console_error_log) {
             this.setState({"show_console_error_log": false});
             this._stopMainPseudoLogStreaming()
         } else {
             if (self.pseudo_tile_id == null) {
                 postWithCallback(this.props.main_id, "get_pseudo_tile_id", {}, function (res) {
                     self.pseudo_tile_id = res.pseudo_tile_id;
                     if (self.pseudo_tile_id == null) {
                         self.setState({"console_error_log_text": "pseudo-tile is initializing..."}, () => {
                             self.setState({"show_console_error_log": true});
                         });
                     } else {
                         postWithCallback("host", "get_container_log",
                             {"container_id": self.pseudo_tile_id, "since": self.state.pseudo_log_since, "max_lines": self.state.max_console_lines},
                             function (res) {
                             let log_text = res.log_text;
                             if (log_text == "") {
                                 log_text = "Got empty result. The pseudo-tile is probably starting up."
                             }
                             self.setState({"console_error_log_text": log_text, console_log_showing: "pseudo"}, () => {
                                 self.setState({"show_console_error_log": true});
                                 self._startPseudoLogStreaming()
                             });
                         }, null, self.props.main_id)
                     }
                 }, null, this.props.main_id)
             } else {
                 postWithCallback("host", "get_container_log",
                     {"container_id": self.pseudo_tile_id, "since": self.state.pseudo_log_since, "max_lines": self.state.max_console_lines},
                     function (res) {
                         self.setState({"console_error_log_text": res.log_text, console_log_showing: "pseudo"}, () => {
                                 self.setState({"show_console_error_log": true});
                                self._startPseudoLogStreaming()
                             }
                         );
                 }, null, this.props.main_id)
             }
         }
     }

     _setPseudoLogSince() {
        var now = new Date().getTime();
        const self = this;
        this.setState({pseudo_log_since: now}, ()=>{
            self._stopMainPseudoLogStreaming(()=>{
            postWithCallback("host", "get_container_log",
                    {container_id: self.pseudo_tile_id, since: self.state.pseudo_log_since, max_lines: self.state.max_console_lines}, function (res) {
                    self.setState({console_error_log_text: res.log_text, console_log_showing: "pseudo"}, () => {
                        self.setState({"show_console_error_log": true});
                        self._startPseudoLogStreaming();
                 });
             }, null, this.props.main_id)
            })
        })
    }

     _startPseudoLogStreaming() {
        postWithCallback(this.props.main_id, "StartPseudoLogStreaming", {}, null, null, this.props.main_id);
    }

    _setLogSince() {
         if (this.state.console_log_showing == "main") {
             this._setMainLogSince()
         }
         else {
             this._setPseudoLogSince()
         }
    }

    _setMaxConsoleLines(max_lines) {
         if (this.state.console_log_showing == "main") {
             this._setMainMaxConsoleLines(max_lines)
         }
         else {
             this._setPseudoMaxConsoleLines(max_lines)
         }
    }

    _setMainLogSince() {
        var now = new Date().getTime();
        const self = this;
        this.setState({main_log_since: now}, ()=>{
            self._stopMainPseudoLogStreaming(()=>{
                postWithCallback("host", "get_container_log",
                    {container_id: self.props.main_id, since: self.state.main_log_since, max_lines: self.state.max_console_lines}, function (res) {
                    self.setState({console_error_log_text: res.log_text, console_log_showing: "main"}, () => {
                        self._startMainLogStreaming();
                        self.setState({"show_console_error_log": true})
                 });
             }, null, this.props.main_id)
            })
        })
    }

    _setMainMaxConsoleLines(max_lines) {
        const self = this;
        this.setState({max_console_lines: max_lines}, ()=>{
            self._stopMainPseudoLogStreaming(()=>{
                postWithCallback("host", "get_container_log",
                    {container_id: self.props.main_id, since: self.state.main_log_since, max_lines: self.state.max_console_lines},
                    function (res) {
                    self.setState({console_error_log_text: res.log_text, console_log_showing: "main"}, () => {
                        self._startMainLogStreaming();
                        self.setState({"show_console_error_log": true})
                 });
             }, null, this.props.main_id)
            })
        })
    }

     _setPseudoMaxConsoleLines(max_lines) {
        const self = this;
        this.setState({max_console_lines: max_lines}, ()=>{
            self._stopMainPseudoLogStreaming(()=>{
            postWithCallback("host", "get_container_log",
                    {container_id: self.pseudo_tile_id, since: self.state.pseudo_log_since, max_lines: self.state.max_console_lines},
                    function (res) {
                    self.setState({console_error_log_text: res.log_text, console_log_showing: "pseudo"}, () => {
                        self.setState({"show_console_error_log": true});
                        self._startPseudoLogStreaming();
                 });
             }, null, this.props.main_id)
            })
        })
    }

     _toggleMainLog() {
         let self = this;
         if (this.state.show_console_error_log) {
             this.setState({"show_console_error_log": false});
             this._stopMainPseudoLogStreaming()
         } else {
             postWithCallback("host", "get_container_log", {
                 "container_id": this.props.main_id, "since": self.state.main_log_since, "max_lines": self.state.max_console_lines},
                 function (res) {
                     self.setState({"console_error_log_text": res.log_text, console_log_showing: "main"}, () => {
                         self._startMainLogStreaming();
                         self.setState({"show_console_error_log": true})
                     });
                }, null, this.props.main_id)
         }
     }

     _startMainLogStreaming() {
        postWithCallback(this.props.main_id, "StartMainLogStreaming", {}, null, null, this.props.main_id);
    }

    _stopMainPseudoLogStreaming(callback=null) {
        postWithCallback(this.props.main_id, "StopMainPseudoLogStreaming", {}, callback, null, this.props.main_id);
    }

     _setFocusedItem(unique_id, callback = null) {
         if (unique_id == null) {
             this.setState({console_item_with_focus: unique_id}, callback)
         } else {
             this.setState({console_item_with_focus: unique_id, console_item_saved_focus: unique_id}, callback)
         }
     }

     _zoomConsole() {
         this.props.setMainStateValue("console_is_zoomed", true)
     }

     _unzoomConsole() {
         this.props.setMainStateValue("console_is_zoomed", false);
     }

     _expandConsole() {
         this.props.setMainStateValue("console_is_shrunk", false);
     }

     _shrinkConsole() {
         this.props.setMainStateValue("console_is_shrunk", true);
         if (this.props.console_is_zoomed) {
             this._unzoomConsole();
         }
     }

     _toggleExports() {
         this.props.setMainStateValue("show_exports_pane", !this.props.show_exports_pane)
     }

     _setConsoleItemValue(unique_id, field, value, callback = null) {
         let entry = this.get_console_item_entry(unique_id);
         entry[field] = value;
         this.replace_console_item_entry(unique_id, entry, callback)
     }

     replace_console_item_entry(unique_id, new_entry, callback = null) {
         let new_console_items = _.cloneDeep(this.props.console_items);
         let cindex = this._consoleItemIndex(unique_id);
         new_console_items.splice(cindex, 1, new_entry);
         this.props.setMainStateValue("console_items", new_console_items, callback)
     }

     _reOpenClosedDividers() {
         if (this.temporarily_closed_items.length == 0) {
             return
         }
         let new_console_items = _.cloneDeep(this.props.console_items);
         for (let entry of new_console_items) {
             if (entry.type == "divider" && this.temporarily_closed_items.includes(entry.unique_id)) {
                 entry.am_shrunk = false;
             }
         }
         this.temporarily_closed_items = [];
         this.props.setMainStateValue("console_items", new_console_items)
     }

     _closeAllDividers(callback=null) {
         let new_console_items = _.cloneDeep(this.props.console_items);
         for (let entry of new_console_items) {
             if (entry.type == "divider") {
                 if (!entry.am_shrunk) {
                     entry.am_shrunk = true;
                     this.temporarily_closed_items.push(entry.unique_id)
                 }
             }
         }
         this.props.setMainStateValue("console_items", new_console_items, callback)
     }

     _multiple_console_item_updates(replace_dicts, callback = null) {
         let new_console_items = [...this.props.console_items];
         for (let d of replace_dicts) {
             let cindex = this._consoleItemIndex(d["unique_id"]);
             new_console_items[cindex][d["field"]] = d["value"]
         }
         this.props.setMainStateValue("console_items", new_console_items, callback)
     }

     _clear_all_selected_items(callback=null) {
         let self = this;
         let new_console_items = [...this.props.console_items];
         for (let item of new_console_items) {
             item.am_selected = false;
             item.search_string = null
         }
         this.setState({all_selected_items: []}, ()=>{
             self.props.setMainStateValue("console_items", new_console_items, callback)
         })
     }

     _reduce_to_last_selected(callback=null) {
         let self = this;
         if (this.state.all_selected_items.length <=1) {
             if (callback) {
                 callback()
             }
         }
         let replace_dicts = [];
         for (let uid of this.state.all_selected_items.slice(0, -1)) {
             replace_dicts.push({unique_id: uid, field: "am_selected", value: false});
             replace_dicts.push({unique_id: uid, field: "search_string", value: null})
         }
         this._multiple_console_item_updates(replace_dicts, () => {
             self.setState({all_selected_items: self.state.all_selected_items.slice(-1,)}, callback)
         })
     }

     get_console_item_entry(unique_id) {
         return _.cloneDeep(this.props.console_items[this._consoleItemIndex(unique_id)]);
     }

     _dselectOneItem(unique_id, callback=null) {
         let self = this;
         let replace_dicts = [];
         if (this.state.all_selected_items.includes(unique_id)) {
             replace_dicts.push({unique_id: unique_id, field: "am_selected", value: false});
             replace_dicts.push({unique_id: unique_id, field: "search_string", value: null});
             this._multiple_console_item_updates(replace_dicts, () => {
                 let narray = _.cloneDeep(self.state.all_selected_items);
                 var myIndex = narray.indexOf(unique_id);
                 if (myIndex !== -1) {
                     narray.splice(myIndex, 1);
                 }
                 self.setState({all_selected_items: narray}, callback)
             })
         }
         else {
             if (callback) {
                 callback()
             }
         }
     }

     _selectConsoleItem(unique_id, event=null, callback=null) {
         let self = this;
         let replace_dicts = [];
         let shift_down = event != null && event.shiftKey;
         if (!shift_down) {
             if (this.state.all_selected_items.length > 0) {
                 for (let uid of this.state.all_selected_items) {
                     if (uid != unique_id) {
                         replace_dicts.push({unique_id: uid, field: "am_selected", value: false});
                         replace_dicts.push({unique_id: uid, field: "search_string", value: null})
                     }
                 }

             }
            if (!this.state.all_selected_items.includes(unique_id)) {
                 replace_dicts.push({unique_id: unique_id, field: "am_selected", value: true});
                 replace_dicts.push({unique_id: unique_id,
                     field: "search_string",
                     value: this.state.search_string
                 });
             }

             this._multiple_console_item_updates(replace_dicts, () => {
                 self.setState({all_selected_items: [unique_id]}, callback)
             })
         }
         else {
             if (this.state.all_selected_items.includes(unique_id)) {
                 this._dselectOneItem(unique_id)
             }
             else {
                 replace_dicts.push({unique_id: unique_id, field: "am_selected", value: true});
                 replace_dicts.push({
                     unique_id: unique_id,
                     field: "search_string",
                     value: this.state.search_string
                 });
                 this._multiple_console_item_updates(replace_dicts, () => {
                     let narray = _.cloneDeep(self.state.all_selected_items);
                     narray.push(unique_id);
                     self.setState({all_selected_items: narray}, callback)
                 })
             }

         }
     }

     _sortSelectedItems() {
         let self = this;
         let sitems = _.cloneDeep(this.state.all_selected_items);
         sitems.sort((firstEl, secondEl) => {
             return self._consoleItemIndex(firstEl) < self._consoleItemIndex(secondEl) ? -1 : 1;
         });
         return sitems
     }

     _clearSelectedItem() {
         let self = this;
         let replace_dicts = [];
         for (let uid of this.state.all_selected_items) {
             replace_dicts.push({unique_id: uid, field: "am_selected", value: false});
             replace_dicts.push({unique_id: uid, field: "search_string", value: null});

         }
         this._multiple_console_item_updates(replace_dicts, () => {
             self.setState({all_selected_items: [], console_item_with_focus: null})
         })
    }

     _consoleItemIndex(unique_id, console_items=null) {
         let counter = 0;
         if (console_items == null) {
             console_items = this.props.console_items
         }
         for (let entry of console_items) {
             if (entry.unique_id == unique_id) {
                 return counter
             }
             ++counter;
         }
         return -1
     }

     _moveSection({oldIndex, newIndex}, filtered_items, callback=null) {

         let move_entry = filtered_items[oldIndex];
         let move_index = this._consoleItemIndex(move_entry.unique_id);
         let section_ids = this._getSectionIds(move_entry.unique_id);
         let the_section = _.cloneDeep(this.props.console_items.slice(move_index, move_index + section_ids.length));
         let new_console_items = [...this.props.console_items];
        new_console_items.splice(move_index, section_ids.length);

        let below_index;
        if (newIndex == 0) {
            below_index = 0
        }
        else {
             // noinspection ES6ConvertIndexedForToForOf
            for (below_index = newIndex; below_index < new_console_items.length; ++below_index) {
                 if (new_console_items[below_index].type == "divider") {
                     break
                 }
             }
             if (below_index >= new_console_items.length) {
                 below_index = new_console_items.length
             }
        }
        new_console_items.splice(below_index, 0, ...the_section);
        this.props.setMainStateValue("console_items", new_console_items, callback)
     }

     _moveEntryAfterEntry(move_id, above_id, callback=null) {
         let new_console_items = [...this.props.console_items];
         let move_entry = _.cloneDeep(this.get_console_item_entry(move_id));
         new_console_items.splice(this._consoleItemIndex(move_id), 1);
         let target_index;
         if (above_id == null) {
            target_index = 0
         }
         else {
             target_index = this._consoleItemIndex(above_id, new_console_items) + 1;
         }
         new_console_items.splice(target_index, 0, move_entry);
         this.props.setMainStateValue("console_items", new_console_items, callback)
     }

     _resortConsoleItems({oldIndex, newIndex}, filtered_items, callback=null) {
         let self = this;
         if (oldIndex == newIndex) return;
         let move_entry = filtered_items[oldIndex];
         if (move_entry.type == "divider") {
             this._moveSection({oldIndex, newIndex}, filtered_items, callback);
             return
         }
         let trueOldIndex = this._consoleItemIndex(move_entry.unique_id);
         let trueNewIndex;
         let above_entry;
         if (newIndex == 0) {
            above_entry = null
         }
         else {
             if (newIndex > oldIndex) {
                 above_entry = filtered_items[newIndex]
             }
             else {
                 above_entry = filtered_items[newIndex - 1];
             }

             if (above_entry.type == "divider" && above_entry.am_shrunk) {
                 let section_ids = this._getSectionIds(above_entry.unique_id);
                 let lastIdInSection = _.last(section_ids);
                self._moveEntryAfterEntry(move_entry.unique_id, lastIdInSection, callback);
                return
             }
         }
         let target_id = above_entry == null ? null : above_entry.unique_id;
         this._moveEntryAfterEntry(move_entry.unique_id, target_id, callback)
     }

     _goToNextCell(unique_id) {
         let next_index = this._consoleItemIndex(unique_id) + 1;
         while (next_index < this.props.console_items.length) {
             let next_id = this.props.console_items[next_index].unique_id;
             let next_item = this.props.console_items[next_index];
             if (!next_item.am_shrunk &&
                 ((next_item.type == "code") || ((next_item.type == "text") && (!next_item.show_markdown)))) {
                 if (!next_item.show_on_filtered) {
                    this.setState({filter_console_items: false},
                        ()=>{this._setConsoleItemValue(next_id, "set_focus", true)})
                 }
                 else {
                     this._setConsoleItemValue(next_id, "set_focus", true)
                 }
                 return
             }
             next_index += 1;
         }
         this._addCodeArea("");
         return
     }

     _deleteSelected() {
         if (this._are_selected()) {
             let new_console_items = [];
             for (let entry of this.props.console_items) {
                 if (!this.state.all_selected_items.includes(entry.unique_id)) {
                     new_console_items.push(entry)
                 }
             }
             this._clear_all_selected_items(()=>{
                 this.props.setMainStateValue("console_items", new_console_items);
             })
         }
     }

     _closeConsoleItem(unique_id, callback=null) {
         let cindex = this._consoleItemIndex(unique_id);
         let new_console_items = [...this.props.console_items];
         new_console_items.splice(cindex, 1);
         this._dselectOneItem(unique_id,()=>{
             this.props.setMainStateValue("console_items", new_console_items, callback);
        })
     }

     _getNextEndIndex(start_id) {
         let start_index = this._consoleItemIndex(start_id);
         for (let entry of this.props.console_items.slice(start_index,)) {
             if (entry.type == "section-end") {
                return this._consoleItemIndex(entry.unique_id)
             }
         }
         return this.props.console_items.length
     }

     _addConsoleEntries(new_entries, force_open = true, set_focus = false, unique_id = null, callback=null) {
         let self = this;
         _.last(new_entries).set_focus = set_focus;
         let inserting_divider = false;
         for (let entry of new_entries) {
            if (entry.type == "divider") {
                inserting_divider = true
            }
         }
         let last_id = _.last(new_entries).unique_id;
         let insert_index;
         if (unique_id) {
             if (inserting_divider) {
                 insert_index = this._getNextEndIndex(unique_id) + 1
             }
             else {
                 insert_index = this._consoleItemIndex(unique_id) + 1
             }

         } else if (this.state.all_selected_items.length == 0) {
             insert_index = this.props.console_items.length
         } else {
             let current_selected_id = this._currently_selected();
             if (inserting_divider) {
                 insert_index = this._getNextEndIndex(current_selected_id) + 1
             }
             else {
                 let selected_item = this.get_console_item_entry(current_selected_id);
                 if (selected_item.type == "divider") {
                     if (selected_item.am_shrunk) {
                        insert_index = this._getNextEndIndex(current_selected_id) + 1
                     }
                     else {
                         insert_index = this._consoleItemIndex(current_selected_id) + 1;
                     }
                 }
                 else {
                     insert_index = this._consoleItemIndex(this._currently_selected()) + 1
                 }
             }
         }
         let new_console_items = [...this.props.console_items];
         new_console_items.splice(insert_index, 0, ...new_entries);
         this.props.setMainStateValue("console_items", new_console_items, ()=>{
             if (force_open) {
                 self.props.setMainStateValue("console_is_shrunk", false, ()=>{
                     self._selectConsoleItem(last_id, null, callback)
                 })
             }
             else {
                 self._selectConsoleItem(last_id, null, callback)
             }
         });
     }

     _addConsoleEntry(new_entry, force_open = true, set_focus = false, unique_id = null, callback=null) {
         this._addConsoleEntries([new_entry], force_open, set_focus, unique_id, callback);
     }

     _startSpinner(console_id) {
         let new_entry = this.get_console_item_entry(console_id);
         new_entry.running = true;
         this.replace_console_item_entry(console_id, new_entry)
     }

     _stopConsoleSpinner(console_id, execution_count=null) {
         let new_entry = this.get_console_item_entry(console_id);
         new_entry.show_spinner = false;
         new_entry.running = false;
         if ("execution_count" != null) {
             new_entry.execution_count = execution_count
         }
         this.replace_console_item_entry(console_id, new_entry)
     }

     _appendConsoleItemOutput(data) {
         let current = this.get_console_item_entry(data.console_id).output_text;
         if (current != "") {
             current += "<br>"
         }
         this._setConsoleItemValue(data.console_id, "output_text", current + data.message)
     }

     _setConsoleItemOutput(data) {
         this._setConsoleItemValue(data.console_id, "output_text",  data.message)
     }

     _addToLog(new_line) {
         let log_content = this.state.console_error_log_text;
         let log_list = log_content.split(/\r?\n/);
         let mlines = this.state.max_console_lines;
         if (log_list.length >= mlines) {
            log_list = log_list.slice(-1 * mlines + 1);
            log_content = log_list.join("\n")
        }
         this.setState({"console_error_log_text": log_content + new_line})
     }

     _bodyHeight() {
         if (this.state.mounted && this.body_ref && this.body_ref.current) {
             return this.props.console_available_height - (this.body_ref.current.offsetTop - this.header_ref.current.offsetTop) - 2
         } else {
             return this.props.console_available_height - 75
         }
     }

     _bodyWidth() {
         if (this.props.console_available_width > MAX_CONSOLE_WIDTH) {
             return MAX_CONSOLE_WIDTH
         } else {
             return this.props.console_available_width
         }
     }

     renderContextMenu() {
         // return a single element, or nothing to use default browser behavior
         return (
             <Menu>
                 <MenuItem icon="new-text-box"
                           onClick={this._addBlankText}
                           text="New Text Cell"/>
                 <MenuItem icon="code"
                           onClick={this._addBlankCode}
                           text="New Code Cell"/>
                 <MenuItem icon="header"
                           onClick={this._addBlankDivider}
                           text="New Section Divider"/>
                 <MenuItem icon="clipboard"
                           onClick={() => {
                               this._pasteCell()
                           }}
                           text="Paste Cells"/>
                 <MenuDivider/>
                 <MenuItem icon="reset"
                           onClick={this._resetConsole}
                           intent="warning"
                           text="Clear output and reset"/>
                 <MenuItem icon="trash"
                           onClick={this._clearConsole}
                           intent="danger"
                           text="Erase everything"/>
             </Menu>
         );
     }

     _glif_text(show_glif_text, txt) {
         if (show_glif_text) {
             return txt
         }
         return null
     }

     _clickConsoleBody(e) {
         this._clear_all_selected_items();
         e.stopPropagation()
     }

     _handleSearchFieldChange(event) {
         if (this.state.search_helper_text) {
             this.setState({"search_helper_text": null}, ()=>{
                 this._setSearchString(event.target.value)
             })
         }
         else {
            this._setSearchString(event.target.value)
         }
     }

     _are_selected() {
         return this.state.all_selected_items.length > 0
     }

     
     _setSearchString(val) {
         let self = this;
         let nval = val == "" ? null : val;
         let replace_dicts = [];
         this.setState({search_string: nval}, ()=> {
             if (self._are_selected()) {
                 for (let uid of this.state.all_selected_items) {
                     replace_dicts.push({
                         unique_id: uid,
                         field: "search_string",
                         value: this.state.search_string
                     });
                 }
                 this._multiple_console_item_updates(replace_dicts)
             }
         })
     }
     
     _handleUnFilter() {
         this.setState({filter_console_items: false, search_helper_text: null},
             ()=>{this._setSearchString(null)})
     }

     _handleFilter() {
         let new_console_items = [...this.props.console_items];
         for (let entry of new_console_items) {
             if (entry.type == "code" || entry.type == "text") {
                 entry["show_on_filtered"] = entry.console_text.toLowerCase().includes(this.state.search_string.toLowerCase());
             }
             else if (entry.type == "divider") {
                 entry["show_on_filtered"] = true
             }
         }
         this.props.setMainStateValue("console_items", new_console_items, ()=>{
             this.setState({filter_console_items: true})
         })
     }
     
     _searchNext() {
         let current_index;
         let self = this;
         if (!this._are_selected()) {
             current_index = 0
         } else {
             current_index = this._consoleItemIndex(this._currently_selected()) + 1
         }

         while (current_index < this.props.console_items.length) {
             let entry = this.props.console_items[current_index];
             if (entry.type == "code" || entry.type == "text") {
                 if (this._selectIfMatching(entry, "console_text", ()=>{
                     if (entry.type == "text") {
                             self._setConsoleItemValue(entry.unique_id, "show_markdown", false)
                     }
                 })) {
                     this.setState({"search_helper_text": null});
                     return
                 }
             }
             current_index += 1
         }
         this.setState({"search_helper_text": "No more results"})
     }

     _selectIfMatching(entry, text_field, callback=null) {
         let self = this;
        if (entry[text_field].toLowerCase().includes(this.state.search_string.toLowerCase())) {
             if (entry.am_shrunk) {
                 this._setConsoleItemValue(entry.unique_id, "am_shrunk", false, ()=>{
                     self._selectConsoleItem(entry.unique_id, null, callback)
                 })
             }
             else {
                 this._selectConsoleItem(entry.unique_id, null, callback)
             }
             return true
         }
        return false
     }
     
     _searchPrevious() {
         let current_index;
         let self = this;
         if (!this._are_selected()) {
             current_index = this.props.console_items.length - 1
         }
         else {
             current_index = this._consoleItemIndex(this._currently_selected()) - 1
         }
         while (current_index >= 0) {
             let entry = this.props.console_items[current_index];
             if (entry.type == "code" || entry.type == "text") {
                 if (this._selectIfMatching(entry, "console_text", ()=>{
                     if (entry.type == "text") {
                             self._setConsoleItemValue(entry.unique_id, "show_markdown", false)
                     }
                 })) {
                     this.setState({"search_helper_text": null});
                     return
                 }
             }
             current_index -= 1;
         }
         this.setState({"search_helper_text": "No more results"})
     }

     _handleSubmit(e) {
         this._searchNext();
         e.preventDefault();
     }
     
     _shouldCancelSortStart() {
        return this.state.filter_console_items
     }

     get menu_specs() {
         let self = this;
        let ms = {
            Insert :[{name_text: "Text Cell", icon_name: "new-text-box", click_handler: this._addBlankText,
                key_bindings: ["ctrl+t"]},
                   {name_text: "Code Cell", icon_name: "code", click_handler: this._addBlankCode, key_bindings: ["ctrl+c"]},
                {name_text: "Section Divider", icon_name: "header", click_handler: this._addBlankDivider},
                   {name_text: "Resource Link", icon_name: "link", click_handler: this._insertResourceLink}],
            Edit: [{name_text: "Copy All", icon_name: "duplicate", click_handler: () => {self._copyAll()}},
                    {name_text: "Copy Selected", icon_name: "duplicate", click_handler: () => {self._copyCell()}},
                   {name_text: "Paste Cells", icon_name: "clipboard", click_handler: () => {self._pasteCell()}},
                    {name_text: "Delete Selected", icon_name: "trash", click_handler: () => {self._deleteSelected()}},
                    {name_text: "divider1", icon_name: null, click_handler: "divider"},
                    {name_text: "Copy Section", icon_name: "duplicate", click_handler: () => {self._copySection()}},
                    {name_text: "Delete Section", icon_name: "trash", click_handler: () => {self._deleteSection()}},
                    {name_text: "divider2", icon_name: null, click_handler: "divider"},
                   {name_text: "Clear Log", icon_name: "trash", click_handler: this._clearConsole}
            ],
            Execute: [{name_text: "Run Selected", icon_name: "play", click_handler: this._runSelected,
                key_bindings: ["ctrl+enter", "command+enter"]},
                      {name_text: "Stop All", icon_name: "stop", click_handler: this._stopAll},
                      {name_text: "Reset All", icon_name: "reset", click_handler: this._resetConsole}],
        };

        if (!this.state.show_console_error_log) {
            ms["Consoles"] = [{name_text: "Show Log Console", icon_name: "console", click_handler: this._toggleConsoleLog},
                      {name_text: "Show Main Console", icon_name: "console", click_handler: this._toggleMainLog}]
        }
        else {
            ms["Consoles"] = [{name_text: "Hide Console", icon_name: "console", click_handler: this._toggleMainLog}]
        }

        return ms

    }

    get disabled_items() {
         let items = [];
         if (!this._are_selected() || this.state.all_selected_items.length != 1) {
             items.push("Run Selected");
             items.push("Copy Section");
             items.push("Delete Section")
         }
         if (this.state.all_selected_items.length == 1) {
             let unique_id = this.state.all_selected_items[0];
             let entry = this.get_console_item_entry(unique_id);
             if (entry.type != "divider") {
                 items.push("Copy Section");
                 items.push("Delete Section")
             }
         }
         if (!this._are_selected()) {
            items.push("Copy Selected");
            items.push("Delete Selected");
         }
         return items
    }

    _clearCodeOutput(unique_id, callback=null) {
         this._setConsoleItemValue(unique_id, "output_text","", callback)
    }

    _runSelected() {
         if (!this.props.am_selected) {
             return
         }
         if (this._are_selected() && this.state.all_selected_items.length == 1) {
             let entry = this.get_console_item_entry(this._currently_selected());
             if (entry.type == "code") {
                 this._runCodeItem(this._currently_selected())
             }
             else if (entry.type == "text") {
                 this._showTextItemMarkdown(this._currently_selected())
             }
         }
    }

    _runCodeItem(unique_id, go_to_next = false) {
        let self = this;
        this._clearCodeOutput(unique_id,()=> {
            self._startSpinner(unique_id);
            let entry = self.get_console_item_entry(unique_id);
            postWithCallback(self.props.main_id, "exec_console_code", {
                "the_code": entry.console_text,
                "console_id": unique_id
            }, function () {
                if (go_to_next) {
                    self._goToNextCell(unique_id)
                }
            }, null, self.props.main_id)
        })
    }

    _showTextItemMarkdown(unique_id) {
        this._setConsoleItemValue(unique_id, "show_markdown", true);
    }

    _logExec(command, callback=null) {
        let self = this;
        postWithCallback(self.pseudo_tile_id, "os_command_exec", {
            "the_code": command,
        }, callback)
    }

    _hideNonDividers() {
         this.setState({hide_in_section: true});
        //  let nodeList = document.querySelectorAll(".in-section");
        //  for (let i = 0; i < nodeList.length; i++) {
        //     nodeList[i].style.height = 0;
        // }
    }

    _showNonDividers() {
          this.setState({hide_in_section: false});
        //  let nodeList = document.querySelectorAll(".in-section");
        //  for (let i = 0; i < nodeList.length; i++) {
        //     nodeList[i].style.height = null;
        // }
    }

    _sortStart(data, event) {
         event.preventDefault();
         let self = this;
         let unique_id = data.node.id;
         let idx = this._consoleItemIndex(unique_id);
         let entry = this.props.console_items[idx];
         if (entry.type == "divider") {
             this._hideNonDividers()
         }
    }

     render() {
         let gbstyle = {marginLeft: 1, marginTop: 2};
         let console_class = this.props.console_is_shrunk ? "am-shrunk" : "not-shrunk";
         if (this.props.console_is_zoomed) {
             console_class = "am-zoomed"
         }
         let outer_style = Object.assign({}, this.props.style);
         outer_style.width = this._bodyWidth();
         let show_glif_text = outer_style.width > 800;
         let header_style = {};
         if (!this.props.shrinkable) {
             header_style["paddingLeft"] = 10
         }
         if (!this.props.console_is_shrunk) {
             header_style["paddingRight"] = 15
         }
         let key_bindings = [[["escape"], ()=>{this._clear_all_selected_items()}]];
         let filtered_items = [];
         let in_closed_section = false;
         let in_section = false;
         for (let entry of this.props.console_items) {
             if (entry.type == "divider") {
                 in_section = true;
                 filtered_items.push(entry);
                 in_closed_section = entry.am_shrunk
             }
             else if (entry.type == "section-end") {
                 entry.in_section = true;
                 if (!in_closed_section) {
                     filtered_items.push(entry)
                 }
                 in_closed_section = false;
                 in_section = false;
             }
             else if (!in_closed_section) {
                 entry.in_section = in_section;
                 filtered_items.push(entry)
             }

         }

         if (this.state.filter_console_items) {
             let new_filtered_items = [];
             for (let entry of filtered_items) {
                 if (entry.show_on_filtered) {
                     new_filtered_items.push(entry)
                 }
             }
             filtered_items = new_filtered_items;
         }
         let suggestionGlyphs = [];
         if (this.state.show_console_error_log) {
             suggestionGlyphs.push({intent: "primary", handleClick: this._toggleMainLog, icon: "console"})
         }

         return (
             <Card id="console-panel" className={console_class} elevation={2} style={outer_style}>
                 <div className="d-flex flex-column justify-content-around">
                     <div id="console-heading"
                          ref={this.header_ref}
                          style={header_style}
                          className="d-flex flex-row justify-content-between">
                         <div id="console-header-left" className="d-flex flex-row">
                             {this.props.console_is_shrunk && this.props.shrinkable &&
                             <GlyphButton handleClick={this._expandConsole}
                                          style={{marginLeft: 2}}
                                          icon="chevron-right"/>
                             }
                             {!this.props.console_is_shrunk && this.props.shrinkable &&
                             <GlyphButton handleClick={this._shrinkConsole}
                                          style={{marginLeft: 2}}
                                          icon="chevron-down"/>
                             }

                             <TacticMenubar menu_specs={this.menu_specs}
                                            disabled_items={this.disabled_items}
                                            suggestionGlyphs={suggestionGlyphs}
                                            showRefresh={false}
                                            showClose={false}
                                            dark_theme={this.props.dark_theme}
                                            refreshTab={this.props.refreshTab}
                                            closeTab={null}
                                            controlled={false} // This doesn't matter
                                            am_selected={false} // Also doesn't matter
                                            />

                         </div>

                         <div id="console-header-right"
                              className="d-flex flex-row">
                             <GlyphButton extra_glyph_text={this._glif_text(show_glif_text, "exports")}
                                          tooltip="Show export browser"
                                          small={true}
                                          className="show-exports-but"
                                          style={{marginRight: 5, marginTop: 2}}
                                          handleClick={this._toggleExports}
                                          icon="variable"/>

                             {!this.props.console_is_zoomed && this.props.zoomable &&
                             <GlyphButton handleClick={this._zoomConsole}
                                          icon="maximize"/>
                             }
                             {this.props.console_is_zoomed && this.props.zoomable &&
                             <GlyphButton handleClick={this._unzoomConsole}
                                          icon="minimize"/>
                             }
                         </div>
                     </div>
                 </div>
                 {!this.props.console_is_shrunk && !this.state.show_console_error_log &&
                     <FilterSearchForm 
                         search_string={this.state.search_string}
                         handleSearchFieldChange={this._handleSearchFieldChange}
                         handleFilter={this._handleFilter}
                         handleUnFilter={this._handleUnFilter}
                         searchNext={this._searchNext}
                         searchPrevious={this._searchPrevious}
                         search_helper_text={this.state.search_helper_text}
                         />
                 }
                 {!this.props.console_is_shrunk && this.state.show_console_error_log &&
                         <SearchableConsole log_content={this.state.console_error_log_text}
                                            setMaxConsoleLines={this._setMaxConsoleLines}
                                            inner_ref={this.body_ref}
                                            outer_style={{
                                                overflowX: "auto",
                                                overflowY: "auto",
                                                height: this._bodyHeight(),
                                                marginLeft: 20,
                                                marginRight: 20
                                            }}
                                            clearConsole={this._setLogSince}
                                            commandExec={this.state.console_log_showing == "pseudo" ? this._logExec : null}
                         />
                 }
                 {!this.props.console_is_shrunk && !this.state.show_console_error_log &&
                     <div id="console"
                          ref={this.body_ref}
                          className="contingent-scroll"
                          onClick={this._clickConsoleBody}
                          style={{height: this._bodyHeight()}}>
                         {!this.state.show_console_error_log &&
                             <React.Fragment>
                             <SortableComponent id="console-items-div"
                                                main_id={this.props.main_id}
                                                ElementComponent={SSuperItem}
                                                key_field_name="unique_id"
                                                item_list={filtered_items}
                                                helperClass={this.props.dark_theme ? "bp4-dark" : "light-theme"}
                                                handle=".console-sorter"
                                                onSortStart={this._sortStart} // This prevents Safari weirdness
                                                onSortEnd={(data, event)=>{
                                                    this._resortConsoleItems(data, filtered_items, this._showNonDividers);
                                                }}
                                                hideSortableGhost={true}
                                                hide_in_section={this.state.hide_in_section}
                                                pressDelay={100}
                                                shouldCancelStart={this._shouldCancelSortStart}
                                                setConsoleItemValue={this._setConsoleItemValue}
                                                selectConsoleItem={this._selectConsoleItem}
                                                console_available_width={this._bodyWidth()}
                                                execution_count={0}
                                                runCodeItem={this._runCodeItem}
                                                handleDelete={this._closeConsoleItem}
                                                goToNextCell={this._goToNextCell}
                                                setFocus={this._setFocusedItem}
                                                addNewTextItem={this._addBlankText}
                                                addNewCodeItem={this._addBlankCode}
                                                addNewDividerItem={this._addBlankDivider}
                                                copyCell={this._copyCell}
                                                pasteCell={this._pasteCell}
                                                copySection={this._copySection}
                                                deleteSection={this._deleteSection}
                                                insertResourceLink={this._insertResourceLink}
                                                useDragHandle={true}
                                                dark_theme={this.props.dark_theme}
                                                handleCreateViewer={this.props.handleCreateViewer}
                                                axis="y"
                             />
                         </React.Fragment>
                         }
                         <div id="padding-div" style={{height: 500}}></div>
                     </div>
                 }
                 <KeyTrap global={true}
                          active={!this.props.controlled || this.props.am_selected}
                          bindings={key_bindings}/>
             </Card>
         );
     }
 }


RawConsoleComponent.propTypes = {
     console_items: PropTypes.array,
    console_is_shrunk: PropTypes.bool,
    show_exports_pane: PropTypes.bool,
    setMainStateValue: PropTypes.func,
    console_available_height: PropTypes.number,
    console_available_width: PropTypes.number,
    style: PropTypes.object,
    shrinkable: PropTypes.bool,
    zoomable: PropTypes.bool,
};

 RawConsoleComponent.defaultProps = {
     style: {},
     shrinkable: true,
     zoomable: true,
 };

const ConsoleComponent = ContextMenuTarget(RawConsoleComponent);

 class RawSortHandle extends React.PureComponent {

    render () {
        return (
            <Icon icon="drag-handle-vertical"
                             style={{marginLeft: 0, marginRight: 6}}
                             iconSize={20}
                             className="console-sorter"/>
        )
    }
}

const Shandle = SortableHandle(RawSortHandle);

class SuperItem extends React.PureComponent {
    render() {
        switch (this.props.type) {
            case "text":
                return <ConsoleTextItem {...this.props}/>;
            case "code":
                return <ConsoleCodeItem {...this.props}/>;
            case "fixed":
                return <LogItem {...this.props}/>;
            case "divider":
                return <DividerItem {...this.props}/>;
            case "section-end":
                return <SectionEndItem {...this.props}/>;
            default:
                return null
        }
    }
}

const SSuperItem = MySortableElement(SuperItem);


const divider_item_update_props = ["am_shrunk", "am_selected", "header_text", "console_available_width"];

class RawDividerItem extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this, "_", RawDividerItem.prototype);
        this.update_props = divider_item_update_props;
        this.update_state_vars = [];
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        for (let prop of this.update_props) {
            if (nextProps[prop] != this.props[prop]) {
                return true
            }
        }
        return false
    }

    _toggleShrink() {
        this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }

    _deleteMe() {
        this.props.handleDelete(this.props.unique_id)
    }

    _handleHeaderTextChange(value) {
        this.props.setConsoleItemValue(this.props.unique_id, "header_text", value)
    }

    _copyMe() {
        this.props.copyCell(this.props.unique_id)
    }
    
    _copySection() {
        this.props.copySection(this.props.unique_id)
    }

    _deleteSection() {
        this.props.deleteSection(this.props.unique_id)
    }

    _pasteCell() {
        this.props.pasteCell(this.props.unique_id)
    }

    _selectMe(e=null, callback=null) {
        this.props.selectConsoleItem(this.props.unique_id, e, callback)
    }

    _addBlankText() {
        let self = this;
        this._selectMe(null, ()=>{
            self.props.addNewTextItem()
        })
    }

    _addBlankDivider() {
        let self = this;
        this._selectMe(null, ()=>{
            self.props.addNewDividerItem()
        })
    }

    _addBlankCode() {
        let self = this;
        this._selectMe(null,()=>{
            self.props.addNewCodeItem()
        })
    }

    renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                <MenuItem icon="duplicate"
                          onClick={this._copyMe}
                          text="Copy Divider" />
                <MenuItem icon="duplicate"
                          onClick={this._copySection}
                          text="Copy Section" />
                <MenuItem icon="clipboard"
                          onClick={this._pasteCell}
                          text="Paste Cells" />
                <MenuDivider/>
                <MenuItem icon="new-text-box"
                           onClick={this._addBlankText}
                           text="New Text Cell"/>
                 <MenuItem icon="code"
                           onClick={this._addBlankCode}
                           text="New Code Cell"/>
                <MenuItem icon="header"
                           onClick={this._addBlankDivider}
                           text="New Section Divider"/>
                <MenuDivider/>
                <MenuItem icon="trash"
                          onClick={this._deleteMe}
                          intent="danger"
                          text="Delete Divider" />
                <MenuItem icon="trash"
                          onClick={this._deleteSection}
                          intent="danger"
                          text="Delete Whole Section" />
            </Menu>
        );
    }
    
    _consoleItemClick(e) {
        this._selectMe(e);
        e.stopPropagation()
    }

    render () {
        let converted_dict = {__html: this.props.console_text};
        let panel_class = this.props.am_shrunk ? "log-panel in-section divider-log-panel log-panel-invisible fixed-log-panel" : "log-panel divider-log-panel log-panel-visible fixed-log-panel";
        if (this.props.am_selected) {
            panel_class += " selected"
        }
        if (this.props.is_error) {
            panel_class += " error-log-panel"
        }
        let body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
        return (
            <div className={panel_class + " d-flex flex-row"} onClick={this._consoleItemClick} id={this.props.unique_id} style={{marginBottom: 10}}>
                <div className="button-div shrink-expand-div d-flex flex-row">
                    <Shandle/>
                        {!this.props.am_shrunk &&
                            <GlyphButton icon="chevron-down"
                                         handleClick={this._toggleShrink}/>
                        }
                        {this.props.am_shrunk &&
                            <GlyphButton icon="chevron-right"
                                         style={{marginTop: 5}}
                                         handleClick={this._toggleShrink}/>
                        }
                </div>
                <EditableText value={this.props.header_text}
                             onChange={this._handleHeaderTextChange}
                             className="console-divider-text"/>
                <div className="button-div d-flex flex-row">
                     <GlyphButton handleClick={this._deleteMe}
                                  intent="danger"
                                  tooltip="Delete this item"
                                  style={{marginLeft: 10, marginRight: 66, minHeight: 0}}
                                  icon="trash"/>
                </div>
            </div>
        )
    }
}

const DividerItem = ContextMenuTarget(RawDividerItem);

const section_end_item_update_props = ["hide_in_section", "am_selected", "console_available_width"];

class RawSectionEndItem extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this, "_", RawSectionEndItem.prototype);
        this.update_props = section_end_item_update_props;
        this.update_state_vars = [];
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        for (let prop of this.update_props) {
            if (nextProps[prop] != this.props[prop]) {
                return true
            }
        }
        return false
    }

    _pasteCell() {
        this.props.pasteCell(this.props.unique_id)
    }

    _selectMe(e=null, callback=null) {
        this.props.selectConsoleItem(this.props.unique_id, e, callback)
    }

    _addBlankText() {
        let self = this;
        this._selectMe(null, ()=>{
            self.props.addNewTextItem()
        })
    }

    _addBlankDivider() {
        let self = this;
        this._selectMe(null, ()=>{
            self.props.addNewDividerItem()
        })
    }

    _addBlankCode() {
        let self = this;
        this._selectMe(null,()=>{
            self.props.addNewCodeItem()
        })
    }

    renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                <MenuItem icon="clipboard"
                          onClick={this._pasteCell}
                          text="Paste Cells" />
                <MenuDivider/>
                <MenuItem icon="new-text-box"
                           onClick={this._addBlankText}
                           text="New Text Cell"/>
                 <MenuItem icon="code"
                           onClick={this._addBlankCode}
                           text="New Code Cell"/>
                <MenuItem icon="header"
                           onClick={this._addBlankDivider}
                           text="New Section Divider"/>
                <MenuDivider/>
            </Menu>
        );
    }

    _consoleItemClick(e) {
        this._selectMe(e);
        e.stopPropagation()
    }

    render () {
        if (this.props.hide_in_section) {
            return (
                <div className="log-panel fixed-log-panel d-flex flex-row" id={this.props.unique_id} style={{height: 0}}/>
            )
        }
        let panel_class = "log-panel in-section section-end-log-panel log-panel-visible fixed-log-panel";
        if (this.props.am_selected) {
            panel_class += " selected"
        }
        let body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
        return (
            <div className={panel_class + " d-flex flex-row"} onClick={this._consoleItemClick} id={this.props.unique_id} style={{marginBottom: 10}}>
                <ButtonGroup minimal={true} vertical={true} style={{width: "100%"}}>
                <Divider style={{marginLeft: 85, marginRight: 85}}/>
                </ButtonGroup>
                <div className="button-div d-flex flex-row">
                </div>
            </div>
        )
    }
}

const SectionEndItem = ContextMenuTarget(RawSectionEndItem);

const log_item_update_props = ["is_error", "am_shrunk", "am_selected", "hide_in_section",
    "in_section", "summary_text", "console_text", "console_available_width"];

class RawLogItem extends React.Component {
    constructor(props) {
        super(props);
        this.ce_summary0ref = React.createRef();
        doBinding(this, "_", RawLogItem.prototype);
        this.update_props = log_item_update_props;
        this.update_state_vars = [];
        this.state = {selected: false};
        this.last_output_text = "";
    }

    shouldComponentUpdate(nextProps, nextState) {
        for (let prop of this.update_props) {
            if (nextProps[prop] != this.props[prop]) {
                return true
            }
        }
        return false
    }

    componentDidMount() {
        this.executeEmbeddedScripts();
        this.makeTablesSortable()
    }

    componentDidUpdate() {
        this.executeEmbeddedScripts();
        this.makeTablesSortable()
    }

    _toggleShrink() {
        this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }

    _deleteMe() {
        this.props.handleDelete(this.props.unique_id)
    }

    _handleSummaryTextChange(value) {
        this.props.setConsoleItemValue(this.props.unique_id, "summary_text", value)
    }

     executeEmbeddedScripts() {
        if (this.props.output_text != this.last_output_text) {  // to avoid doubles of bokeh images
            this.last_output_text = this.props.output_text;
            let scripts = $("#" + this.props.unique_id + " .log-code-output script").toArray();
            // $("#" + this.props.unique_id + " .bk-root").html(""); // This is a kluge to deal with bokeh double images
            for (let script of scripts) {
                try {
                    window.eval(script.text)
                }
                catch (e) {

                }
            }
        }
    }

    makeTablesSortable() {
        let tables = $("#" + this.props.unique_id + " table.sortable").toArray();
        for (let table of tables) {
            sorttable.makeSortable(table)
        }
    }

    _copyMe() {
        this.props.copyCell(this.props.unique_id)
    }

    _pasteCell() {
        this.props.pasteCell(this.props.unique_id)
    }

    _selectMe(e=null, callback=null) {
        this.props.selectConsoleItem(this.props.unique_id, e, callback)
    }

    _addBlankText() {
        let self = this;
        this._selectMe(null, ()=>{
            self.props.addNewTextItem()
        })
    }

    _addBlankDivider() {
        let self = this;
        this._selectMe(null, ()=>{
            self.props.addNewDividerItem()
        })
    }

    _addBlankCode() {
        let self = this;
        this._selectMe(null,()=>{
            self.props.addNewCodeItem()
        })
    }

    renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                <MenuItem icon="duplicate"
                          onClick={this._copyMe}
                          text="Copy Cell" />
                <MenuItem icon="clipboard"
                          onClick={this._pasteCell}
                          text="Paste Cells" />
                <MenuDivider/>
                <MenuItem icon="new-text-box"
                           onClick={this._addBlankText}
                           text="New Text Cell"/>
                 <MenuItem icon="code"
                           onClick={this._addBlankCode}
                           text="New Code Cell"/>
                <MenuItem icon="header"
                           onClick={this._addBlankDivider}
                           text="New Section Divider"/>
                <MenuDivider/>
                <MenuItem icon="trash"
                          onClick={this._deleteMe}
                          intent="danger"
                          text="Delete Cell" />
            </Menu>
        );
    }

    _consoleItemClick(e) {
        this._selectMe(e);
        e.stopPropagation()
    }

    render () {
        let panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
        if (this.props.hide_in_section && this.props.in_section) {
            return (
                <div className="log-panel fixed-log-panel d-flex flex-row" id={this.props.unique_id} style={{height: 0}}/>
            )
        }
        let converted_dict = {__html: this.props.console_text};

        if (this.props.in_section) {
            panel_class += " in-section"
        }
        if (this.props.am_selected) {
            panel_class += " selected"
        }
        if (this.props.is_error) {
            panel_class += " error-log-panel"
        }
        let body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
        if (this.props.in_section) {
            body_width -= SECTION_INDENT / 2
        }
        return (
            <div className={panel_class + " d-flex flex-row"} onClick={this._consoleItemClick} id={this.props.unique_id} style={{marginBottom: 10}}>
                <div className="button-div shrink-expand-div d-flex flex-row">
                    <Shandle/>
                        {!this.props.am_shrunk &&
                            <GlyphButton icon="chevron-down"
                                         handleClick={this._toggleShrink}/>
                        }
                        {this.props.am_shrunk &&
                            <GlyphButton icon="chevron-right"
                                         style={{marginTop: 5}}
                                         handleClick={this._toggleShrink}/>
                        }
                </div>
                {this.props.am_shrunk &&
                    <React.Fragment>
                        <EditableText value={this.props.summary_text}
                                     onChange={this._handleSummaryTextChange}
                                     className="log-panel-summary"/>
                        <div className="button-div d-flex flex-row">
                             <GlyphButton handleClick={this._deleteMe}
                                          intent="danger"
                                          tooltip="Delete this item"
                                          style={{marginLeft: 10, marginRight: 66}}
                                          icon="trash"/>
                        </div>
                    </React.Fragment>
                }
                {!this.props.am_shrunk &&
                    <div className="d-flex flex-column">
                        <div className="log-panel-body d-flex flex-row">
                            <div style={{marginTop: 10, marginLeft: 30, padding: 8, width: body_width, border: "1px solid #c7c7c7"}}
                                 dangerouslySetInnerHTML={converted_dict}/>
                            <div className="button-div d-flex flex-row">
                                 <GlyphButton handleClick={this._deleteMe}
                                              tooltip="Delete this item"
                                              style={{marginLeft: 10, marginRight: 66}}
                                              intent="danger"
                                              icon="trash"/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}

RawLogItem.propTypes = {
    unique_id: PropTypes.string,
    in_section: PropTypes.bool,
    is_error: PropTypes.bool,
    am_shrunk: PropTypes.bool,
    summary_text: PropTypes.string,
    selectConsoleItem: PropTypes.func,
    am_selected: PropTypes.bool,
    console_text: PropTypes.string,
    setConsoleItemValue: PropTypes.func,
    handleDelete: PropTypes.func,
    console_available_width: PropTypes.number,
};

const LogItem = ContextMenuTarget(RawLogItem);

const code_item_update_props = ["am_shrunk", "set_focus", "am_selected", "search_string", "summary_text", "console_text",
            "in_section", "hide_in_section", "show_spinner", "execution_count", "output_text", "console_available_width", "dark_theme"];

class RawConsoleCodeItem extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this, "_", RawConsoleCodeItem.prototype);
        this.cmobject = null;
        this.elRef = React.createRef();
        this.update_props = code_item_update_props;
        this.update_state_vars = [];
        this.state = {};
        this.last_output_text = ""
    }

    shouldComponentUpdate(nextProps, nextState) {
        for (let prop of this.update_props) {
            if (nextProps[prop] != this.props[prop]) {
                return true
            }
        }

        return false
    }

    componentDidMount() {
        if (this.props.set_focus) {
            if (this.cmobject != null) {
                this.cmobject.focus();
                this.cmobject.setCursor({line: 0, ch: 0});
                this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe)
            }
        }
        let self = this;
        if (this.cmobject != null) {
            this.cmobject.on("focus", ()=>{
                self.props.setFocus(this.props.unique_id, self._selectMe)}
            );
            this.cmobject.on("blur", ()=>{self.props.setFocus(null)})
        }
        this.executeEmbeddedScripts();
        this.makeTablesSortable()
    }

    _scrollMeIntoView() {
        let my_element = this.elRef.current;
        let outer_element = my_element.parentNode.parentNode;
        let scrolled_element = my_element.parentNode;
        let outer_height = outer_element.offsetHeight;
        let distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
        if (distance_from_top > outer_height - 35) {
            let distance_to_move = distance_from_top - .5 * outer_height;
            outer_element.scrollTop += distance_to_move
        }
        else if (distance_from_top < 0) {
            let distance_to_move = .25 * outer_height - distance_from_top;
            outer_element.scrollTop -= distance_to_move
        }
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        this.executeEmbeddedScripts();
        this.makeTablesSortable();
        if (this.props.am_selected && !prevProps.am_selected && this.elRef && this.elRef.current){
            // this.elRef.current.scrollIntoView()
            this._scrollMeIntoView()
        }
         if (this.props.set_focus) {
            if (this.cmobject != null) {
                this.cmobject.focus();
                this.cmobject.setCursor({line: 0, ch: 0});
                this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe)
            }

        }
    }

    executeEmbeddedScripts() {
        if (this.props.output_text != this.last_output_text) {  // to avoid doubles of bokeh images
            this.last_output_text = this.props.output_text;
            let scripts = $("#" + this.props.unique_id + " .log-code-output script").toArray();
            // $("#" + this.props.unique_id + " .bk-root").html(""); // This is a kluge to deal with bokeh double images
            for (let script of scripts) {
                // noinspection EmptyCatchBlockJS,UnusedCatchParameterJS
                try {
                    window.eval(script.text)
                }
                catch (e) {

                }
            }
        }
    }

    makeTablesSortable() {
        let tables = $("#" + this.props.unique_id + " table.sortable").toArray();
        for (let table of tables) {
            sorttable.makeSortable(table)
        }
    }

    _stopMe() {
        this._stopMySpinner();
        postWithCallback(this.props.main_id, "stop_console_code", {"console_id": this.props.unique_id}, null, null, this.props.main_id)
    }

    _showMySpinner(callback=null) {
        this.props.setConsoleItemValue(this.props.unique_id, "show_spinner", true, callback)
    }

    _stopMySpinner() {
        this.props.setConsoleItemValue(this.props.unique_id, "show_spinner", false)
    }

    _handleChange(new_code) {
        this.props.setConsoleItemValue(this.props.unique_id, "console_text", new_code)
    }

    _handleSummaryTextChange(value) {
        this.props.setConsoleItemValue(this.props.unique_id, "summary_text", value)
    }

    _toggleShrink() {
        this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }

    _deleteMe() {
        if (this.props.show_spinner) {
            this._stopMe()
        }
        this.props.handleDelete(this.props.unique_id)
    }

    _clearOutput(callback=null) {
        this.props.setConsoleItemValue(this.props.unique_id, "output_text","", callback)
    }

    _extraKeys() {
        let self = this;
        return {
                'Ctrl-Enter': ()=>self.props.runCodeItem(this.props.unique_id, true),
                'Cmd-Enter': ()=>self.props.runCodeItem(this.props.unique_id, true),
                'Ctrl-C': self.props.addNewCodeItem,
                'Ctrl-T': self.props.addNewTextItem
            }
    }

    _setCMObject(cmobject) {
        this.cmobject = cmobject;
        if (this.props.set_focus) {
            this.cmobject.focus();
            this.cmobject.setCursor({line: 0, ch: 0});
            this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe)
        }
    }

    _getFirstLine() {
        let re = /^(.*)$/m;
        if (this.props.console_text == "") {
            return "empty text cell"
        }
        else{
            return re.exec(this.props.console_text)[0]
        }

    }

    _copyMe() {
        this.props.copyCell(this.props.unique_id)
    }

    _pasteCell() {
        this.props.pasteCell(this.props.unique_id)
    }

    _selectMe(e=null, callback=null) {
        this.props.selectConsoleItem(this.props.unique_id, e, callback)
    }
    
    _addBlankText() {
        let self = this;
        this._selectMe(null,()=>{
            self.props.addNewTextItem()
        })
    }

    _addBlankDivider() {
        let self = this;
        this._selectMe(null, ()=>{
            self.props.addNewDividerItem()
        })
    }
    
    _addBlankCode() {
        let self = this;
        this._selectMe(null,()=>{
            self.props.addNewCodeItem()
        })
    }

    renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                {!this.props.show_spinner &&
                    <MenuItem icon="play"
                              intent="success"
                              onClick={()=>{this.props.runCodeItem(this.props.unique_id)}}
                              text="Run Cell" />
                }
                {this.props.show_spinner &&
                    <MenuItem icon="stop"
                              intent="danger"
                              onClick={this._stopMe}
                              text="Stop Cell" />
                }
                <MenuDivider/>
                <MenuItem icon="new-text-box"
                           onClick={this._addBlankText}
                           text="New Text Cell"/>
                 <MenuItem icon="code"
                           onClick={this._addBlankCode}
                           text="New Code Cell"/>
                <MenuItem icon="header"
                           onClick={this._addBlankDivider}
                           text="New Section Divider"/>
                <MenuDivider/>
                <MenuItem icon="duplicate"
                          onClick={this._copyMe}
                          text="Copy Cell" />
                <MenuItem icon="clipboard"
                          onClick={this._pasteCell}
                          text="Paste Cells" />
                <MenuDivider/>
                <MenuItem icon="trash"
                          onClick={this._deleteMe}
                          intent="danger"
                          text="Delete Cell" />
                <MenuItem icon="clean"
                          intent={"warning"}
                          onClick={()=>{this._clearOutput()}}
                          text="Clear Output" />
            </Menu>
        );
    }

    _consoleItemClick(e) {
        this._selectMe(e);
        e.stopPropagation()
    }

    render () {
        if (this.props.hide_in_section && this.props.in_section) {
            return (
                <div className="log-panel fixed-log-panel d-flex flex-row" id={this.props.unique_id} style={{height: 0}}/>
            )
        }
        let panel_style = this.props.am_shrunk ? "log-panel log-panel-invisible" : "log-panel log-panel-visible";
        if (this.props.am_selected) {
            panel_style += " selected"
        }
        if (this.props.in_section) {
            panel_style += " in-section"
        }
        let output_dict = {__html: this.props.output_text};
        let spinner_val = this.props.running ? null : 0;
        let code_container_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
        if (this.props.in_section) {
            code_container_width -= SECTION_INDENT / 2
        }
        return (
             <div className={panel_style + " d-flex flex-row"}
                  ref={this.elRef}
                  onClick={this._consoleItemClick} id={this.props.unique_id}>
                    <div className="button-div shrink-expand-div d-flex flex-row">
                        <Shandle/>
                        {!this.props.am_shrunk &&
                            <GlyphButton icon="chevron-down"
                                         handleClick={this._toggleShrink}/>
                        }
                        {this.props.am_shrunk &&
                            <GlyphButton icon="chevron-right"
                                         style={{marginTop: 5}}
                                         handleClick={this._toggleShrink}/>
                        }
                    </div>
                {this.props.am_shrunk &&
                    <React.Fragment>
                        <EditableText value={this.props.summary_text ? this.props.summary_text : this._getFirstLine()}
                                     onChange={this._handleSummaryTextChange}
                                     className="log-panel-summary code-panel-summary"/>
                        <div className="button-div d-flex flex-row">
                             <GlyphButton handleClick={this._deleteMe}
                                          intent="danger"
                                          tooltip="Delete this item"
                                          style={{marginLeft: 10, marginRight: 66}}
                                          icon="trash"/>
                        </div>
                    </React.Fragment>

                }
                {!this.props.am_shrunk &&
                    <React.Fragment>
                            <div className="d-flex flex-column" style={{width: "100%"}}>
                                <div className="d-flex flex-row">
                                    <div className="log-panel-body d-flex flex-row console-code">
                                        <div className="button-div d-flex pr-1">
                                            {!this.props.show_spinner &&
                                                <GlyphButton handleClick={()=>{this.props.runCodeItem(this.props.unique_id)}}
                                                             intent="success"
                                                             tooltip="Execute this item"
                                                             icon="play"/>
                                            }
                                            {this.props.show_spinner &&
                                                <GlyphButton handleClick={this._stopMe}
                                                             intent="danger"
                                                             tooltip="Stop this item"
                                                             icon="stop"/>
                                            }
                                        </div>
                                        <ReactCodemirror handleChange={this._handleChange}
                                                         dark_theme={this.props.dark_theme}
                                                         am_selected={this.props.am_selected}
                                                         readOnly={false}
                                                         show_line_numbers={true}
                                                         code_content={this.props.console_text}
                                                         setCMObject={this._setCMObject}
                                                         extraKeys={this._extraKeys()}
                                                         search_term={this.props.search_string}
                                                         code_container_width={code_container_width}
                                                         saveMe={null}/>
                                         <div className="button-div d-flex flex-row">
                                             <GlyphButton handleClick={this._deleteMe}
                                                          intent="danger"
                                                          tooltip="Delete this item"
                                                          style={{marginLeft: 10, marginRight: 0}}
                                                          icon="trash"/>
                                            <GlyphButton handleClick={()=>{this._clearOutput()}}
                                                         intent="warning"
                                                         tooltip="Clear this item's output"
                                                         style={{marginLeft: 10, marginRight: 0}}
                                                         icon="clean"/>
                                        </div>
                                    </div>
                                    {!this.props.show_spinner &&
                                        <div className='execution-counter'>[{String(this.props.execution_count)}]</div>
                                    }
                                    {this.props.show_spinner &&
                                        <div style={{marginTop: 10, marginRight: 22}}>
                                            <Spinner size={13} value={spinner_val}/>
                                        </div>
                                    }
                                </div>
                                < div className='log-code-output' dangerouslySetInnerHTML={output_dict}/>
                            </div>

                    </React.Fragment>
                }
            </div>
        )
    }
}


RawConsoleCodeItem.propTypes = {
    unique_id: PropTypes.string,
    am_shrunk: PropTypes.bool,
    set_focus: PropTypes.bool,
    search_string: PropTypes.string,
    show_spinner: PropTypes.bool,
    running: PropTypes.bool,
    summary_text: PropTypes.string,
    console_text: PropTypes.string,
    output_text: PropTypes.string,
    execution_count: PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string]),
    console_available_width: PropTypes.number,
    setConsoleItemValue: PropTypes.func,
    selectConsoleItem: PropTypes.func,
    handleDelete: PropTypes.func,
    addNewTextItem: PropTypes.func,
    addNewCodeItem: PropTypes.func,
    addNewDividerItem: PropTypes.func,
    goToNextCell: PropTypes.func,
    setFocus: PropTypes.func,
    runCodeItem: PropTypes.func
};

RawConsoleCodeItem.defaultProps = {
    summary_text: null
};

const ConsoleCodeItem = ContextMenuTarget(RawConsoleCodeItem);

class ResourceLinkButton extends React.PureComponent {
    constructor(props) {
        super(props);
        doBinding(this);
        this.my_view = view_views(false)[props.res_type];
        if (window.in_context) {
            const re = new RegExp("/$");
            this.my_view = this.my_view.replace(re, "_in_context");
        }
    }

    _goToLink() {
        let self = this;
        if (window.in_context) {
            postAjaxPromise($SCRIPT_ROOT + this.my_view, {context_id: window.context_id,
                resource_name: this.props.res_name})
                .then(self.props.handleCreateViewer)
                .catch(doFlash);""
        }
        else {
            window.open($SCRIPT_ROOT + this.my_view + this.props.res_name)
        }
    }

    render() {
        let self = this;
        return (
            <ButtonGroup className="link-button-group">
                <Button small={true}
                        text={this.props.res_name}
                        icon={icon_dict[this.props.res_type]}
                        minimal={true}
                        onClick={this._goToLink}/>
                <Button small={true}
                        icon="small-cross"
                        minimal={true}
                        onClick={(e)=>{
                            self.props.deleteMe(self.props.my_index);
                            e.stopPropagation()
                        }}
                />
            </ButtonGroup>
        )
    }
}

ResourceLinkButton.propTypes = {
    res_type: PropTypes.string,
    res_name: PropTypes.string,
    deleteMe: PropTypes.func
};

const text_item_update_props = ["am_shrunk", "set_focus", "serach_string", "am_selected", "show_markdown",
            "in_section", "hide_in_section", "summary_text", "console_text", "console_available_width", "links"];

class RawConsoleTextItem extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this, "_", RawConsoleTextItem.prototype);
        this.cmobject = null;
        this.elRef = React.createRef();

        this.ce_summary_ref = React.createRef();
        this.update_props = text_item_update_props;
        this.update_state_vars = ["ce_ref"];
        this.previous_dark_theme = props.dark_theme;
        this.state = {ce_ref: null}
    }


    shouldComponentUpdate(nextProps, nextState) {
        for (let prop of this.update_props) {
            if (nextProps[prop] != this.props[prop]) {
                return true
            }
        }
        for (let state_var of this.update_state_vars) {
            if (nextState[state_var] != this.state[state_var]) {
                return true
            }
        }
        if (this.props.dark_theme != this.previous_dark_theme) {
            this.previous_dark_theme = this.props.dark_theme;
            return true
        }
        return false
    }

    componentDidMount() {
        if (this.props.set_focus) {
            if (this.props.show_markdown) {
                this._hideMarkdown()
            }
            else if (this.cmobject != null) {
                this.cmobject.focus();
                this.cmobject.setCursor({line: 0, ch: 0});
                this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe)
            }
        }
        let self = this;
        if (this.cmobject != null) {
            this.cmobject.on("focus", ()=>{
                self.props.setFocus(this.props.unique_id, self._selectMe)}
            );
            this.cmobject.on("blur", ()=>{self.props.setFocus(null)})
        }
    }

    _scrollMeIntoView() {
        let my_element = this.elRef.current;
        let outer_element = my_element.parentNode.parentNode;
        let scrolled_element = my_element.parentNode;
        let outer_height = outer_element.offsetHeight;
        let distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
        if (distance_from_top > (outer_height - 35)) {
            let distance_to_move = distance_from_top - .5 * outer_height;
            outer_element.scrollTop += distance_to_move
        }
        else if (distance_from_top < 0) {
            let distance_to_move = .25 * outer_height - distance_from_top;
            outer_element.scrollTop -= distance_to_move
        }
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.am_selected && !prevProps.am_selected && this.elRef && this.elRef.current){
            this._scrollMeIntoView()
        }
        if (this.props.set_focus) {
            if (this.props.show_markdown) {
                this._hideMarkdown()
            }
            else if (this.cmobject != null) {
                this.cmobject.focus();
                this.cmobject.setCursor({line: 0, ch: 0});
                this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe)
            }

        }
    }

    get hasOnlyWhitespace() {
        return !this.props.console_text.trim().length
    }

    _showMarkdown() {
        this.props.setConsoleItemValue(this.props.unique_id, "show_markdown", true);
    }

    _toggleMarkdown() {
        if (this.props.show_markdown) {
            this._hideMarkdown()
        }
        else {
            this._showMarkdown()
        }
    }

    _hideMarkdown() {
        this.props.setConsoleItemValue(this.props.unique_id, "show_markdown", false);
    }

    _handleChange(new_text) {
        this.props.setConsoleItemValue(this.props.unique_id, "console_text", new_text)
    }

    _clearForceSync() {
        this.props.setConsoleItemValue(this.props.unique_id, "force_sync_to_prop", false)
    }

    _handleSummaryTextChange(value) {
        this.props.setConsoleItemValue(this.props.unique_id, "summary_text", value)
    }

    _toggleShrink() {
        this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }

    _deleteMe() {
        this.props.handleDelete(this.props.unique_id)
    }
    _handleKeyDown(event) {
        if (event.key == "Tab") {
            this.props.goToNextCell(this.props.unique_id);
            event.preventDefault()
        }
    }

    _gotEnter() {
        this.props.goToNextCell(this.props.unique_id);
        this._showMarkdown();
    }

    _getFirstLine() {
        let re = /^(.*)$/m;
        if (this.props.console_text == "") {
            return "empty text cell"
        }
        else{
            return re.exec(this.props.console_text)[0]
        }

    }

    _copyMe() {
        this.props.copyCell(this.props.unique_id)
    }

    _pasteCell() {
        this.props.pasteCell(this.props.unique_id)
    }

    _selectMe(e=null, callback=null) {
        this.props.selectConsoleItem(this.props.unique_id, e, callback)
    }

    _insertResourceLink() {
        let self = this;
         showSelectResourceDialog("cancel", "insert link", (result) => {
             let new_links = [...self.props.links];
             new_links.push({res_type: result.type,res_name: result.selected_resource});
             self.props.setConsoleItemValue(self.props.unique_id, "links", new_links)
         })
     }

    _deleteLinkButton(index) {
        let new_links = _.cloneDeep(this.props.links);
        new_links.splice(index, 1);
        let self = this;
        this.props.setConsoleItemValue(this.props.unique_id, "links", new_links, ()=>{
            console.log("i am here with nlinks " + String(self.props.links.length))
        });

    }

    _addBlankText() {
        let self = this;
        this._selectMe(null,()=>{
            self.props.addNewTextItem()
        })
    }

    _addBlankDivider() {
        let self = this;
        this._selectMe(null, ()=>{
            self.props.addNewDividerItem()
        })
    }

    _addBlankCode() {
        let self = this;
        this._selectMe(null,()=>{
            self.props.addNewCodeItem()
        })
    }

    renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                <MenuItem icon="paragraph"
                          intent="success"
                          onClick={this._showMarkdown}
                          text="Show Markdown" />
                <MenuDivider/>
                <MenuItem icon="new-text-box"
                           onClick={this._addBlankText}
                           text="New Text Cell"/>
                 <MenuItem icon="code"
                           onClick={this._addBlankCode}
                           text="New Code Cell"/>
                <MenuItem icon="header"
                           onClick={this._addBlankDivider}
                           text="New Section Divider"/>
                <MenuDivider/>
                <MenuItem icon="link"
                          onClick={this._insertResourceLink}
                          text="Insert ResourceLink" />
                <MenuItem icon="duplicate"
                          onClick={this._copyMe}
                          text="Copy Cell" />
                <MenuItem icon="clipboard"
                          onClick={this._pasteCell}
                          text="Paste Cells" />
                <MenuDivider/>
                <MenuItem icon="trash"
                          onClick={this._deleteMe}
                          intent="danger"
                          text="Delete Cell" />
            </Menu>
        );
    }

    _consoleItemClick(e) {
        this._selectMe(e);
        e.stopPropagation()
    }

    _setCMObject(cmobject) {
        this.cmobject = cmobject;
        if (this.props.set_focus) {
            this.cmobject.focus();
            this.cmobject.setCursor({line: 0, ch: 0});
            this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe)
        }
    }

    _extraKeys() {
        let self = this;
        return {
                'Ctrl-Enter': ()=>self._gotEnter(),
                'Cmd-Enter': ()=>self._gotEnter(),
                'Ctrl-C': self.props.addNewCodeItem,
                'Ctrl-T': self.props.addNewTextItem
            }
    }

    render () {
        if (this.props.hide_in_section && this.props.in_section) {
            return (
                <div className="log-panel fixed-log-panel d-flex flex-row" id={this.props.unique_id} style={{height: 0}}/>
            )
        }
        let really_show_markdown =  this.hasOnlyWhitespace && this.props.links.length == 0 ? false : this.props.show_markdown;
        var converted_markdown;
        if (really_show_markdown) {
            converted_markdown = mdi.render(this.props.console_text)
        }
        // let key_bindings = [[["ctrl+enter", "command+enter"], this._gotEnter]];
        let converted_dict = {__html: converted_markdown};
        let panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible text-log-item" : "log-panel log-panel-visible text-log-item";
        if (this.props.am_selected) {
            panel_class += " selected"
        }
        if (this.props.in_section) {
            panel_class += " in-section"
        }
        let gbstyle={marginLeft: 1};
        let body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
        let self = this;
        let link_buttons = this.props.links.map((link, index) =>
            <ResourceLinkButton key={index}
                                my_index={index}
                                handleCreateViewer={this.props.handleCreateViewer}
                                deleteMe={self._deleteLinkButton}
                                res_type={link.res_type}
                                res_name={link.res_name}/>
        );
        let code_container_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
        if (this.props.in_section) {
            code_container_width -= SECTION_INDENT / 2
        }
        return (
            <div className={panel_class + " d-flex flex-row"} onClick={this._consoleItemClick}
                 ref={this.elRef} id={this.props.unique_id} style={{marginBottom: 10}}>
                <div className="button-div shrink-expand-div d-flex flex-row">
                        <Shandle/>
                        {!this.props.am_shrunk &&
                            <GlyphButton icon="chevron-down"
                                         handleClick={this._toggleShrink}/>
                        }
                        {this.props.am_shrunk &&
                            <GlyphButton icon="chevron-right"
                                         style={{marginTop: 5}}
                                         handleClick={this._toggleShrink}/>
                        }
                </div>
                {this.props.am_shrunk &&
                    <React.Fragment>
                        <EditableText value={this.props.summary_text ? this.props.summary_text : this._getFirstLine()}
                                     onChange={this._handleSummaryTextChange}
                                     className="log-panel-summary"/>
                        <div className="button-div d-flex flex-row">
                             <GlyphButton handleClick={this._deleteMe}
                                          intent="danger"
                                          tooltip="Delete this item"
                                          style={{marginLeft: 10, marginRight: 66}}
                                          icon="trash"/>
                        </div>
                    </React.Fragment>
                }
                {!this.props.am_shrunk &&
                    <div className="d-flex flex-column" style={{width: "100%"}}>
                        <div className="log-panel-body text-box d-flex flex-row">
                                <div className="button-div d-inline-flex pr-1">
                                    <GlyphButton handleClick={this._toggleMarkdown}
                                                 intent="success"
                                                 tooltip="Convert to/from markdown"
                                                 icon="paragraph"/>
                                </div>
                            <div className="d-flex flex-column">
                                {!really_show_markdown &&
                                    <React.Fragment>
                                    <ReactCodemirror handleChange={this._handleChange}
                                                     dark_theme={this.props.dark_theme}
                                                     am_selected={this.props.am_selected}
                                                     readOnly={false}
                                                     show_line_numbers={false}
                                                     soft_wrap={true}
                                                     sync_to_prop={false}
                                                     force_sync_to_prop={this.props.force_sync_to_prop}
                                                     clear_force_sync={this._clearForceSync}
                                                     mode="markdown"
                                                     code_content={this.props.console_text}
                                                     setCMObject={this._setCMObject}
                                                     extraKeys={this._extraKeys()}
                                                     search_term={this.props.search_string}
                                                     code_container_width={code_container_width}
                                                     saveMe={null}/>
                                         {/*<KeyTrap target_ref={this.state.ce_ref} bindings={key_bindings} />*/}
                                     </React.Fragment>
                                }
                                {really_show_markdown && !this.hasOnlyWhitespace &&
                                    <div className="text-panel-output"
                                         onDoubleClick={this._hideMarkdown}
                                         style={{width: body_width, padding: 9}}
                                         dangerouslySetInnerHTML={converted_dict}/>
                                }
                                    {link_buttons}
                            </div>

                            <div className="button-div d-flex flex-row">
                                 <GlyphButton handleClick={this._deleteMe}
                                              intent="danger"
                                              tooltip="Delete this item"
                                              style={{marginLeft: 10, marginRight: 66}}
                                              icon="trash"/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}


RawConsoleTextItem.propTypes = {
    unique_id: PropTypes.string,
    am_shrunk: PropTypes.bool,
    set_focus: PropTypes.bool,
    show_markdown: PropTypes.bool,
    force_sync_to_prop: PropTypes.bool,
    summary_text: PropTypes.string,
    console_text: PropTypes.string,
    console_available_width: PropTypes.number,
    setConsoleItemValue: PropTypes.func,
    selectConsoleItem: PropTypes.func,
    am_selected: PropTypes.bool,
    handleDelete: PropTypes.func,
    goToNextCell: PropTypes.func,
    setFocus: PropTypes.func,
    links: PropTypes.array
};

RawConsoleTextItem.defaultProps = {
    force_sync_to_prop: false,
    summary_text: null,
    links: []
};

const ConsoleTextItem = ContextMenuTarget(RawConsoleTextItem);

 const all_update_props = {
     "text": text_item_update_props,
     "code": code_item_update_props,
     "fixed": log_item_update_props
 };




