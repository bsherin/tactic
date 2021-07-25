
import React from "react";
import PropTypes from 'prop-types';

import 'codemirror/mode/markdown/markdown.js'

import { Icon, Card, EditableText, Spinner, FormGroup} from "@blueprintjs/core";
import { Menu, MenuItem, InputGroup, ButtonGroup, Button} from "@blueprintjs/core";

// The next line is an ugly workaround
// See blueprintjs issue 3891
import {ContextMenuTarget} from '@blueprintjs/core/lib/esnext/components/context-menu/contextMenuTarget.js';
import { SortableHandle, SortableElement } from 'react-sortable-hoc';
import markdownIt from 'markdown-it'
import 'markdown-it-latex/dist/index.css'
import markdownItLatex from 'markdown-it-latex'
const mdi = markdownIt({html: true})
mdi.use(markdownItLatex)


import {GlyphButton} from "./blueprint_react_widgets.js";
import {ReactCodemirror} from "./react-codemirror.js";
import {SortableComponent} from "./sortable_container.js";
import {KeyTrap} from "./key_trap.js";
import {postWithCallback} from "./communication_react.js"
import {doFlash} from "./toaster.js"
import {doBinding, arrayMove} from "./utilities_react.js";
import {showConfirmDialogReact, showSelectResourceDialog} from "./modal_react.js";

export {ConsoleComponent}

const MAX_CONSOLE_WIDTH = 1800;
const BUTTON_CONSUMED_SPACE = 208;

 class RawConsoleComponent extends React.Component {
     constructor(props) {
         super(props);
         doBinding(this, "_", RawConsoleComponent.prototype);
         this.header_ref = React.createRef();
         this.body_ref = React.createRef();
         this.state = {
             console_item_with_focus: null,
             console_item_saved_focus: null,
             console_error_log_text: "",
             show_console_error_log: false,
             currently_selected_item: null,
             search_string: null,
             filter_console_items: false,
             search_helper_text: null

         };
         this.pseudo_tile_id = null;
         this.socket_counter = null;
     }

     componentDidMount() {
         this.setState({"mounted": true});
         this.initSocket()
         if (this.props.console_items.length == 0) {
             this._addCodeArea("", false)
         }
     }

     componentDidUpdate() {
         if (this.props.tsocket.counter != this.socket_counter) {
             this.initSocket();
         }
     }

     initSocket() {
         // It is necessary to delete and remake these callbacks
         // If I dont delete I end up with duplicatesSelectList
         // If I just keep the original one then I end up something with a handler linked
         // to an earlier state
         this.props.tsocket.socket.off("console-message");
         this.props.tsocket.socket.on("console-message", this._handleConsoleMessage);
         this.socket_counter = this.props.tsocket.counter
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

     addConsoleText(the_text) {
         let self = this;
         postWithCallback("host", "print_text_area_to_console",
             {"console_text": the_text, "user_id": window.user_id, "main_id": window.main_id}, function (data) {
                 if (!data.success) {
                     doFlash(data)
                 }
             });
     }

     _addBlankText() {
         this.addConsoleText("")
     }

     _insertTextInCell(the_text) {
         let unique_id = this.state.console_item_saved_focus
         let entry = this.get_console_item_entry(unique_id);
         this._setConsoleItemValue(unique_id, "console_text", entry.console_text + the_text)
     }

     _copyCell(unique_id = null) {
         if (!unique_id) {
             unique_id = this.state.currently_selected_item
             if (!unique_id) return;
         }
         let entry = this.get_console_item_entry(unique_id);
         const result_dict = {
             "main_id": window.main_id,
             "console_item": entry,
             "user_id": window.user_id,
         }
         postWithCallback("host", "copy_console_cell", result_dict)
     }

     _pasteCell(unique_id = null) {
         postWithCallback("host", "get_copied_console_cell", {user_id: window.user_id}, (data) => {
             if (!data.success) {
                 doFlash(data)
             } else {
                 this._addConsoleEntry(data.console_item, true, false, unique_id)
             }
         })
     }

     _insertResourceLink() {
         if (!this.state.console_item_saved_focus) return;
         let entry = this.get_console_item_entry(this.state.console_item_saved_focus);
         if (!entry || entry.type != "text") return;
         const type_paths = {
             collection: "main_collection",
             project: "main_project",
             tile: "last_saved_view",
             list: "view_list",
             code: "view_code"
         }

         function build_link(type, selected_resource) {
             return `[\`${selected_resource}\`](${type_paths[type]}/${selected_resource})`
         }

         showSelectResourceDialog("cancel", "insert link", (result) => {
             this._insertTextInCell(build_link(result.type, result.selected_resource))
         })
     }

     _addBlankCode(e) {
         this._addCodeArea("");
     }

     _addCodeArea(the_text, force_open = true) {
         let self = this;
         postWithCallback("host", "print_code_area_to_console",
             {console_text: the_text, user_id: window.user_id, main_id: window.main_id, force_open: force_open},
             function (data) {
                 if (!data.success) {
                     doFlash(data)
                 }
             });
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
         postWithCallback(window.main_id, "clear_console_namespace", {})
     }

     _stopAll() {
         postWithCallback(window.main_id, "stop_all_console_code", {})
     }


     _clearConsole() {
         const confirm_text = "Are you sure that you want to erase everything in this log?";
         let self = this;
         showConfirmDialogReact("Clear entire log", confirm_text, "do nothing", "clear", function () {
             self.props.setMainStateValue("console_items", []);
         });
     }

     _toggleConsoleLog() {
         let self = this;
         if (this.state.show_console_error_log) {
             this.setState({"show_console_error_log": false})
         } else {
             if (self.pseudo_tile_id == null) {
                 postWithCallback(window.main_id, "get_pseudo_tile_id", {}, function (res) {
                     self.pseudo_tile_id = res.pseudo_tile_id;
                     if (self.pseudo_tile_id == null) {
                         self.setState({"console_error_log_text": "pseudo-tile is initializing..."}, () => {
                             this.setState({"show_console_error_log": true})
                         });
                     } else {
                         postWithCallback("host", "get_container_log", {"container_id": self.pseudo_tile_id}, function (res) {
                             let log_text = res.log_text;
                             if (log_text == "") {
                                 log_text = "Got empty result. The pseudo-tile is probably starting up."
                             }
                             self.setState({"console_error_log_text": log_text}, () => {
                                 self.setState({"show_console_error_log": true})
                             });
                         })
                     }
                 })
             } else {
                 postWithCallback("host", "get_container_log", {"container_id": self.pseudo_tile_id}, function (res) {
                     self.setState({"console_error_log_text": res.log_text}, () => {
                             self.setState({"show_console_error_log": true})
                         }
                     );
                 })
             }
         }
     }

     _toggleMainLog() {
         let self = this;
         if (this.state.show_console_error_log) {
             this.setState({"show_console_error_log": false})
         } else {
             postWithCallback("host", "get_container_log", {"container_id": window.main_id}, function (res) {
                 self.setState({"console_error_log_text": res.log_text}, () => {
                     self.setState({"show_console_error_log": true})
                 });
             })
         }
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
         let new_console_items = [...this.props.console_items];
         let cindex = this._consoleItemIndex(unique_id);
         new_console_items.splice(cindex, 1, new_entry);
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

     get_console_item_entry(unique_id) {
         return Object.assign({}, this.props.console_items[this._consoleItemIndex(unique_id)])
     }

     _selectConsoleItem(unique_id) {
         let self = this;
         let replace_dicts = [];
         if (this.state.currently_selected_item) {
             replace_dicts.push({unique_id: this.state.currently_selected_item, field: "am_selected", value: false});
             replace_dicts.push({unique_id: this.state.currently_selected_item, field: "search_string", value: null})
         }
         replace_dicts.push({unique_id: unique_id, field: "am_selected", value: true})
         replace_dicts.push({unique_id: unique_id, field: "search_string", value: this.state.search_string})
         this._multiple_console_item_updates(replace_dicts, () => {
             self.setState({currently_selected_item: unique_id})
         })
     }

     _clearSelectedItem() {
         let self = this;
         let replace_dicts = [];
         if (this.state.currently_selected_item) {
             replace_dicts.push({unique_id: this.state.currently_selected_item, field: "am_selected", value: false});
             replace_dicts.push({unique_id: this.state.currently_selected_item, field: "search_string", value: null})
             this._multiple_console_item_updates(replace_dicts, () => {
                 self.setState({currently_selected_item: null, console_item_with_focus: null})
             })
         }
     }

     _consoleItemIndex(unique_id) {
         let counter = 0;
         for (let entry of this.props.console_items) {
             if (entry.unique_id == unique_id) {
                 return counter
             }
             ++counter;
         }
         return -1
     }

     _resortConsoleItems({oldIndex, newIndex}) {
         let old_console_items = [...this.props.console_items];
         let new_console_items = arrayMove(old_console_items, oldIndex, newIndex);
         this.props.setMainStateValue("console_items", new_console_items)
     }


     _goToNextCell(unique_id) {
         let next_index = this._consoleItemIndex(unique_id) + 1;
         while (next_index < this.props.console_items.length) {
             let next_id = this.props.console_items[next_index].unique_id;
             let next_item = this.props.console_items[next_index]
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

     _closeConsoleItem(unique_id) {
         let cindex = this._consoleItemIndex(unique_id);
         let new_console_items = [...this.props.console_items];
         new_console_items.splice(cindex, 1);
         if (unique_id == this.state.currently_selected_item) {
             this.setState({currently_selected_item: null}, ()=>{
                 this.props.setMainStateValue("console_items", new_console_items);
             })
         }
         else {
            this.props.setMainStateValue("console_items", new_console_items);
         }

     }

     _addConsoleEntry(new_entry, force_open = true, set_focus = false, unique_id = null) {
         new_entry.set_focus = set_focus;
         let insert_index;
         if (unique_id) {
             insert_index = this._consoleItemIndex(unique_id) + 1
         } else if (this.state.currently_selected_item == null) {
             insert_index = this.props.console_items.length
         } else {
             insert_index = this._consoleItemIndex(this.state.currently_selected_item) + 1
         }
         let new_console_items = [...this.props.console_items];
         new_console_items.splice(insert_index, 0, new_entry);
         this.props.setMainStateValue("console_items", new_console_items);
         if (force_open) {
             this.props.setMainStateValue("console_is_shrunk", false)
         }
     }

     _startSpinner(data) {
         let new_entry = this.get_console_item_entry(data.console_id);
         new_entry.running = true;
         this.replace_console_item_entry(data.console_id, new_entry)
     }

     _stopConsoleSpinner(data) {
         let new_entry = this.get_console_item_entry(data.console_id);
         new_entry.show_spinner = false;
         new_entry.running = false;
         if ("execution_count" in data) {
             new_entry.execution_count = data.execution_count
         }
         this.replace_console_item_entry(data.console_id, new_entry)
     }

     _appendConsoleItemOutput(data) {
         let current = this.get_console_item_entry(data.console_id).output_text;
         if (current != "") {
             current += "<br>"
         }
         this._setConsoleItemValue(data.console_id, "output_text", current + data.message)
     }

     _handleConsoleMessage(data) {
         let self = this;
         let handlerDict = {
             consoleLog: (data) => self._addConsoleEntry(data.message, data.force_open),
             stopConsoleSpinner: self._stopConsoleSpinner,
             consoleCodePrint: this._appendConsoleItemOutput,
             consoleCodeRun: this._startSpinner
         };
         handlerDict[data.console_message](data)
     }


     _bodyHeight() {
         if (this.state.mounted) {
             return this.props.console_available_height - $(this.header_ref.current).outerHeight() - 2
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
                 <MenuItem icon="clipboard"
                           onClick={() => {
                               this._pasteCell()
                           }}
                           text="Paste Cell"/>
                 <Menu.Divider/>
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
         this._clearSelectedItem()
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
     
     _setSearchString(val) {
         let nval = val == "" ? null : val
         this.setState({search_string: nval}, ()=>{
             if (this.state.currently_selected_item) {
                 this._setConsoleItemValue(this.state.currently_selected_item, "search_string", nval)
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
         }
         this.props.setMainStateValue("console_items", new_console_items, ()=>{
             this.setState({filter_console_items: true})
         })
     }
     
     _searchNext() {
         let current_index;
         if (!this.state.currently_selected_item) {
             current_index = 0
         } else {
             current_index = this._consoleItemIndex(this.state.currently_selected_item) + 1
         }

         while (current_index < this.props.console_items.length) {
             let entry = this.props.console_items[current_index];
             if (entry.type == "code" || entry.type == "text") {
                 if (this._selectIfMatching(entry, "console_text")) {
                     this.setState({"search_helper_text": null})
                     return
                 }
             }
             current_index += 1
         }
         this.setState({"search_helper_text": "No more results"})
     }

     _selectIfMatching(entry, text_field) {
        if (entry[text_field].toLowerCase().includes(this.state.search_string.toLowerCase())) {
             if (entry.am_shrunk) {
                 let self = this;
                 this._setConsoleItemValue(entry.unique_id, "am_shrunk", false, ()=>{
                     self._selectConsoleItem(entry.unique_id)
                 })
             }
             else {
                 this._selectConsoleItem(entry.unique_id)
             }
             return true
         }
        return false
     }
     
     _searchPrevious() {
         let current_index;
         if (!this.state.currently_selected_item) {
             current_index = this.props.console_items.length - 1
         }
         else {
             current_index = this._consoleItemIndex(this.state.currently_selected_item) - 1
         }
         while (current_index >= 0) {
             let entry = this.props.console_items[current_index];
             if (entry.type == "code" || entry.type == "text") {
                 if (this._selectIfMatching(entry, "console_text")) {
                     this.setState({"search_helper_text": null})
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
         let key_bindings = [[["escape"], this._clearSelectedItem]]
         let filtered_items;
         if (this.state.filter_console_items) {
             filtered_items = []
             for (let entry of this.props.console_items) {
                 if (entry.show_on_filtered) {
                     filtered_items.push(entry)
                 }
             }
         }
         else {
             filtered_items = this.props.console_items
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

                             <GlyphButton extra_glyph_text={this._glif_text(show_glif_text, "text")}
                                          style={gbstyle}
                                          intent="primary"
                                          tooltip="Add new text area"
                                          handleClick={this._addBlankText}
                                          icon="new-text-box"/>
                             <GlyphButton extra_glyph_text={this._glif_text(show_glif_text, "code")}
                                          handleClick={this._addBlankCode}
                                          tooltip="Add new code area"
                                          intent="primary"
                                          style={gbstyle}
                                          icon="code"/>
                             <GlyphButton extra_glyph_text={this._glif_text(show_glif_text, "link")}
                                          handleClick={this._insertResourceLink}
                                          tooltip="Insert a resource link"
                                          intent="primary"
                                          style={gbstyle}
                                          icon="link"/>
                             <GlyphButton extra_glyph_text={this._glif_text(show_glif_text, "copy")}
                                          handleClick={() => {
                                              this._copyCell()
                                          }}
                                          tooltip="Copy cell"
                                          intent="primary"
                                          style={gbstyle}
                                          icon="duplicate"/>
                             <GlyphButton extra_glyph_text={this._glif_text(show_glif_text, "paste")}
                                          handleClick={() => {
                                              this._pasteCell()
                                          }}
                                          tooltip="Paste cell"
                                          intent="primary"
                                          style={gbstyle}
                                          icon="clipboard"/>
                             <GlyphButton handleClick={this._resetConsole}
                                          style={gbstyle}
                                          tooltip="Clear all output and reset namespace"
                                          intent="warning"
                                          extra_glyph_text={this._glif_text(show_glif_text, "reset")}
                                          icon="reset"/>
                             <GlyphButton handleClick={this._stopAll}
                                          style={gbstyle}
                                          tooltip="Stop all"
                                          intent="warning"
                                          extra_glyph_text={this._glif_text(show_glif_text, "stop")}
                                          icon="stop"/>
                             <GlyphButton extra_glyph_text={this._glif_text(show_glif_text, "clear")}
                                          style={gbstyle}
                                          tooltip="Totally erase everything"
                                          handleClick={this._clearConsole}
                                          intent="danger"
                                          icon="trash"/>
                             <GlyphButton extra_glyph_text={this._glif_text(show_glif_text, "log")}
                                          style={gbstyle}
                                          tooltip="Show container log for the log"
                                          handleClick={this._toggleConsoleLog}
                                          icon="console"/>
                             <GlyphButton extra_glyph_text={this._glif_text(show_glif_text, "main")}
                                          tooltip="Show container log for the main project container"
                                          style={gbstyle}
                                          handleClick={this._toggleMainLog}
                                          icon="console"/>
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
                 {!this.props.console_is_shrunk &&
                     <form onSubmit={this._handleSubmit} id="console-search-form" 
                           className="d-flex flex-row bp3-form-group" style={{
                                           justifyContent: "flex-end", marginRight: 116,
                                           marginBottom: 6, marginTop: 12
                           }}>
                         <div className="d-flex flex-column">
                             <div className="d-flex flex-row">
                                 <InputGroup type="search"
                                             leftIcon="search"
                                             placeholder="Search"
                                             small={true}
                                             value={!this.state.search_string ? "" : this.state.search_string}
                                             onChange={this._handleSearchFieldChange}
                                             autoCapitalize="none"
                                             autoCorrect="off"
                                             className="mr-2"/>
                                 <ButtonGroup>
                                     <Button onClick={this._handleFilter} small={true}>
                                         Filter
                                     </Button>
                                     <Button onClick={this._handleUnFilter} small={true}>
                                         Clear
                                     </Button>
                                     <Button onClick={this._searchNext} icon="caret-down" text={undefined} small={true}/>
                                     <Button onClick={this._searchPrevious} icon="caret-up" text={undefined} small={true}/>
                                 </ButtonGroup>
                             </div>
                             <div className="bp3-form-helper-text" style={{marginLeft: 10}}>{this.state.search_helper_text}</div>
                         </div>
                     </form>
                 }
                 {!this.props.console_is_shrunk &&
                     <div id="console"
                          ref={this.body_ref}
                          className="contingent-scroll"
                          onClick={this._clickConsoleBody}
                          style={{height: this._bodyHeight()}}>
                         {this.state.show_console_error_log &&
                            <pre style={{overflowX: "auto", whiteSpace: "pre-wrap", margin: 20}}>
                                {this.state.console_error_log_text}
                            </pre>
                         }
                         {!this.state.show_console_error_log &&
                         <SortableComponent id="console-items-div"
                                            ElementComponent={SSuperItem}
                                            key_field_name="unique_id"
                                            item_list={filtered_items}
                                            dark_theme={this.props.dark_theme}
                                            handle=".console-sorter"
                                            onSortStart={(_, event) => event.preventDefault()} // This prevents Safari weirdness
                                            onSortEnd={this._resortConsoleItems}
                                            shouldCancelStart={this._shouldCancelSortStart}
                                            setConsoleItemValue={this._setConsoleItemValue}
                                            selectConsoleItem={this._selectConsoleItem}
                                            console_available_width={this._bodyWidth()}
                                            execution_count={0}
                                            handleDelete={this._closeConsoleItem}
                                            goToNextCell={this._goToNextCell}
                                            setFocus={this._setFocusedItem}
                                            addNewTextItem={this._addBlankText}
                                            addNewCodeItem={this._addBlankCode}
                                            copyCell={this._copyCell}
                                            pasteCell={this._pasteCell}
                                            insertResourceLink={this._insertResourceLink}
                                            useDragHandle={true}
                                            axis="y"
                         />
                         }
                         <div id="padding-div" style={{height: 500}}></div>
                     </div>
                 }
                 <KeyTrap global={true} bindings={key_bindings}/>
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
    tsocket: PropTypes.object,
    style: PropTypes.object,
    shrinkable: PropTypes.bool,
    zoomable: PropTypes.bool,
    dark_theme: PropTypes.bool
};

 RawConsoleComponent.defaultProps = {
     style: {},
     shrinkable: true,
     zoomable: true,
     dark_theme: false
 };

const ConsoleComponent = ContextMenuTarget(RawConsoleComponent)

 class RawSortHandle extends React.Component {

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

class SuperItem extends React.Component {
    render() {
        if (this.props.type == "text") {
            return <ConsoleTextItem {...this.props}/>
        } else if (this.props.type == "code") {
            return <ConsoleCodeItem {...this.props}/>
        } else if (this.props.type == "fixed") {
            return <LogItem {...this.props}/>
        }
        return null
    }
}

const SSuperItem = SortableElement(SuperItem);

class RawLogItem extends React.Component {
    constructor(props) {
        super(props);
        this.ce_summary0ref = React.createRef();
        doBinding(this, "_", RawLogItem.prototype);
        this.update_props = ["is_error", "am_shrunk", "am_selected", "summary_text", "console_text", "console_available_width"];
        this.update_state_vars = [];
        this.state = {selected: false};
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

    _selectMe() {
        this.props.selectConsoleItem(this.props.unique_id)
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
                          text="Paste Cell" />
                <Menu.Divider/>
                <MenuItem icon="trash"
                          onClick={this._deleteMe}
                          intent="danger"
                          text="Delete Cell" />
            </Menu>
        );
    }

    _consoleItemClick(e) {
        this._selectMe()
        e.stopPropagation()
    }

    render () {
        let converted_dict = {__html: this.props.console_text};
        let panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
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
                {this.props.am_shrunk &&
                    <EditableText value={this.props.summary_text}
                                     onChange={this._handleSummaryTextChange}
                                     className="log-panel-summary"/>
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


class RawConsoleCodeItem extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this, "_", RawConsoleCodeItem.prototype);
        this.cmobject = null;
        this.elRef = React.createRef();
        this.update_props = ["am_shrunk", "set_focus", "am_selected", "search_string", "summary_text", "console_text",
            "show_spinner", "execution_count", "output_text", "console_available_width", "dark_theme"];
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
                this.cm_object.setCursor({line: 0, ch: 0})
            }
            this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false)
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
        let my_element = this.elRef.current
        let outer_element = my_element.parentNode.parentNode;
        let scrolled_element = my_element.parentNode
        let outer_height = outer_element.offsetHeight
        let distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
        if (distance_from_top > (outer_height - 35)) {
            let distance_to_move = distance_from_top - .5 * outer_height
            outer_element.scrollTop += distance_to_move
        }
        else if (distance_from_top < 0) {
            let distance_to_move = .25 * outer_height - distance_from_top
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
                this.cmobject.setCursor({line: 0, ch: 0})
            }
            this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe)
        }
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
    _runMe(go_to_next = false) {
        this._clearOutput(()=> {
            this._showMySpinner();
            let self = this;
            postWithCallback(main_id, "exec_console_code", {
                "the_code": this.props.console_text,
                "console_id": this.props.unique_id
            }, function () {
                if (go_to_next) {
                    self.props.goToNextCell(self.props.unique_id)
                }
            })
        })
    }

    _stopMe() {
        this._stopMySpinner();
        postWithCallback(main_id, "stop_console_code", {"console_id": this.props.unique_id})
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
                'Ctrl-Enter': ()=>self._runMe(true),
                'Cmd-Enter': ()=>self._runMe(true),
                'Ctrl-Alt-C': self.props.addNewCodeItem,
                'Ctrl-Alt-T': self.props.addNewTextItem
            }
    }

    _setCMObject(cmobject) {
        this.cmobject = cmobject
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

    _selectMe() {
        this.props.selectConsoleItem(this.props.unique_id)
    }

    renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                {!this.props.show_spinner &&
                    <MenuItem icon="play"
                              intent="success"
                              onClick={this._runMe}
                              text="Run Cell" />
                }
                {this.props.show_spinner &&
                    <MenuItem icon="stop"
                              intent="danger"
                              onClick={this._stopMe}
                              text="Stop Cell" />
                }
                <Menu.Divider/>
                <MenuItem icon="duplicate"
                          onClick={this._copyMe}
                          text="Copy Cell" />
                <MenuItem icon="clipboard"
                          onClick={this._pasteCell}
                          text="Paste Cell" />
                <Menu.Divider/>
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
        this._selectMe();
        e.stopPropagation()
    }

    render () {
        let panel_style = this.props.am_shrunk ? "log-panel log-panel-invisible" : "log-panel log-panel-visible";
        if (this.props.am_selected) {
            panel_style += " selected"
        }
        let output_dict = {__html: this.props.output_text};
        let spinner_val = this.props.running ? null : 0;

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
                     <div className="log-panel-summary code-panel-summary">{this._getFirstLine()}</div>
                }
                {!this.props.am_shrunk &&
                    <React.Fragment>
                            <div className="d-flex flex-column" style={{width: "100%"}}>
                                <div className="d-flex flex-row">
                                    <div className="log-panel-body d-flex flex-row console-code">
                                        <div className="button-div d-flex pr-1">
                                            {!this.props.show_spinner &&
                                                <GlyphButton handleClick={this._runMe}
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
                                                         show_line_numbers={true}
                                                         code_content={this.props.console_text}
                                                         setCMObject={this._setCMObject}
                                                         dark_theme={this.props.dark_theme}
                                                         extraKeys={this._extraKeys()}
                                                         search_term={this.props.search_string}
                                                         code_container_width={this.props.console_available_width - BUTTON_CONSUMED_SPACE}
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
    dark_theme: PropTypes.bool,
    execution_count: PropTypes.number,
    console_available_width: PropTypes.number,
    setConsoleItemValue: PropTypes.func,
    selectConsoleItem: PropTypes.func,
    am_selected: PropTypes.bool,
    handleDelete: PropTypes.func,
    addNewTextItem: PropTypes.func,
    addNewCodeItem: PropTypes.func,
    goToNextCell: PropTypes.func,
    setFocus: PropTypes.func
};

const ConsoleCodeItem = ContextMenuTarget(RawConsoleCodeItem);

class RawConsoleTextItem extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this, "_", RawConsoleTextItem.prototype);
        this.cmobject = null;
        this.elRef = React.createRef();

        this.ce_summary_ref = React.createRef();
        this.update_props = ["am_shrunk", "set_focus", "serach_string", "am_selected", "show_markdown",
            "summary_text", "dark_theme", "console_text", "console_available_width"];
        this.update_state_vars = ["ce_ref"];
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
        return false
    }

    componentDidMount() {
        if (this.props.set_focus) {
            if (this.props.show_markdown) {
                this._hideMarkdown()
            }
            else if (this.cmobject != null) {
                this.cmobject.focus();
                this.cm_object.setCursor({line: 0, ch: 0})
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
        let my_element = this.elRef.current
        let outer_element = my_element.parentNode.parentNode;
        let scrolled_element = my_element.parentNode
        let outer_height = outer_element.offsetHeight
        let distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
        if (distance_from_top > (outer_height - 35)) {
            let distance_to_move = distance_from_top - .5 * outer_height
            outer_element.scrollTop += distance_to_move
        }
        else if (distance_from_top < 0) {
            let distance_to_move = .25 * outer_height - distance_from_top
            outer_element.scrollTop -= distance_to_move
        }
    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        if (this.props.set_focus) {
            if (this.props.show_markdown) {
                this._hideMarkdown()
            }
            else if (this.cmobject != null) {
                this.cmobject.focus();
                this.cmobject.setCursor({line: 0, ch: 0})

            }
            this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false, this._selectMe)
        }
    }

    get hasOnlyWhitespace() {
        return !this.props.console_text.trim().length
    }

    _showMarkdown() {
        if (!this.hasOnlyWhitespace) {
            this.props.setConsoleItemValue(this.props.unique_id, "show_markdown", true);
        }
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

    // _notesRefHandler(the_ref) {
    //     this.setState({ce_ref: the_ref});
    // }

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

    _selectMe() {
        this.props.selectConsoleItem(this.props.unique_id)
    }

    renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                <MenuItem icon="paragraph"
                          intent="success"
                          onClick={this._showMarkdown}
                          text="Show Markdown" />
                <Menu.Divider/>
                <MenuItem icon="link"
                          onClick={this.props.insertResourceLink}
                          text="Insert ResourceLink" />
                <MenuItem icon="duplicate"
                          onClick={this._copyMe}
                          text="Copy Cell" />
                <MenuItem icon="clipboard"
                          onClick={this._pasteCell}
                          text="Paste Cell" />
                <Menu.Divider/>
                <MenuItem icon="trash"
                          onClick={this._deleteMe}
                          intent="danger"
                          text="Delete Cell" />
            </Menu>
        );
    }

    _consoleItemClick(e) {
        this._selectMe();
        e.stopPropagation()
    }

    _setCMObject(cmobject) {
        this.cmobject = cmobject
    }

    _extraKeys() {
        let self = this;
        return {
                'Ctrl-Enter': ()=>self._gotEnter(),
                'Cmd-Enter': ()=>self._gotEnter(),
                'Ctrl-Alt-C': self.props.addNewCodeItem,
                'Ctrl-Alt-T': self.props.addNewTextItem
            }
    }

    render () {
        let really_show_markdown =  this.hasOnlyWhitespace ? false : this.props.show_markdown;
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
        let gbstyle={marginLeft: 1};
        let body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
        return (
            <div className={panel_class + " d-flex flex-row"} onClick={this._consoleItemClick}
                 id={this.props.unique_id} style={{marginBottom: 10}}>
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
                    <div className="log-panel-summary">{this._getFirstLine()}</div>
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
                            {!really_show_markdown &&
                                <React.Fragment>
                                <ReactCodemirror handleChange={this._handleChange}
                                                 show_line_numbers={false}
                                                 soft_wrap={true}
                                                 mode="markdown"
                                                 code_content={this.props.console_text}
                                                 setCMObject={this._setCMObject}
                                                 dark_theme={this.props.dark_theme}
                                                 extraKeys={this._extraKeys()}
                                                 search_term={this.props.search_string}
                                                 code_container_width={this.props.console_available_width - BUTTON_CONSUMED_SPACE}
                                                 saveMe={null}/>
                                     {/*<KeyTrap target_ref={this.state.ce_ref} bindings={key_bindings} />*/}
                                 </React.Fragment>
                            }
                            {really_show_markdown &&
                                <div className="text-panel-output"
                                     onDoubleClick={this._hideMarkdown}
                                     style={{width: body_width, padding: 9}}
                                     dangerouslySetInnerHTML={converted_dict}/>
                            }

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
    summary_text: PropTypes.string,
    console_text: PropTypes.string,
    console_available_width: PropTypes.number,
    setConsoleItemValue: PropTypes.func,
    selectConsoleItem: PropTypes.func,
    am_selected: PropTypes.bool,
    handleDelete: PropTypes.func,
    goToNextCell: PropTypes.func,
    tsocket: PropTypes.object,
    setFocus: PropTypes.func,
};

const ConsoleTextItem = ContextMenuTarget(RawConsoleTextItem);

