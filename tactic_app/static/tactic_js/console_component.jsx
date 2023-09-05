// noinspection JSConstructorReturnsPrimitive

import React from "react";
import {Fragment, useState, useEffect, useRef, useCallback, memo, useMemo, useContext} from "react";
import PropTypes from 'prop-types';

import 'codemirror/mode/markdown/markdown.js'

import {Icon, Card, ContextMenu, EditableText, Spinner, MenuDivider, Divider} from "@blueprintjs/core";
import {Menu, MenuItem, ButtonGroup, Button} from "@blueprintjs/core";
import _ from 'lodash';

import markdownIt from 'markdown-it'
import 'markdown-it-latex/dist/index.css'
import markdownItLatex from 'markdown-it-latex'

const mdi = markdownIt({html: true});
mdi.use(markdownItLatex);

import {GlyphButton} from "./blueprint_react_widgets";
import {ReactCodemirror} from "./react-codemirror";
import {SortableComponent} from "./sortable_container";
import {KeyTrap} from "./key_trap";
import {postAjaxPromise, postWithCallback} from "./communication_react"
import {doFlash} from "./toaster"
import {showConfirmDialogReact, showSelectResourceDialog} from "./modal_react";
import {icon_dict} from "./blueprint_mdata_fields";
import {view_views} from "./library_pane";
import {TacticMenubar} from "./menu_utilities";
import {FilterSearchForm} from "./search_form";
import {SearchableConsole} from "./searchable_console";
import {ThemeContext} from "./theme";

import {useCallbackStack, useStateAndRef, useConstructor} from "./utilities_react";

export {ConsoleComponent}

const MAX_CONSOLE_WIDTH = 1800;
const BUTTON_CONSUMED_SPACE = 208;
const SECTION_INDENT = 25;  // This is also hard coded into the css file at the moment

function ConsoleComponent(props) {
    const header_ref = useRef(null);
    const body_ref = useRef(null);
    const temporarily_closed_items = useRef([]);
    const filtered_items_ref = useRef([]);

    const [console_item_with_focus, set_console_item_with_focus] = useState(null);
    const [console_item_saved_focus, set_console_item_saved_focus] = useState(null);

    const [all_selected_items, set_all_selected_items, all_selected_items_ref] = useStateAndRef([]);
    const [search_string, set_search_string, search_string_ref] = useStateAndRef(null);
    const [filter_console_items, set_filter_console_items] = useState(false);
    const [search_helper_text, set_search_helper_text] = useState(null);

    const [show_main_log, set_show_main_log] = useState(false);
    const [show_pseudo_log, set_show_pseudo_log] = useState(false);

    const [pseudo_tile_id, set_pseudo_tile_id] = useState(null);

    const theme = useContext(ThemeContext);
    const pushCallback = useCallbackStack();

    useEffect(() => {
        initSocket();
        _requestPseudoTileId();
        if (props.console_items.current.length == 0) {
            _addCodeArea("", false)
        }
        _clear_all_selected_items(() => {
            if (props.console_items.current && props.console_items.current.length > 0) {
                _selectConsoleItem(props.console_items.current[0].unique_id)
            }
        });
    }, []);

    function initSocket() {
        function _handleConsoleMessage(data) {
            if (data.main_id == props.main_id) {
                // noinspection JSUnusedGlobalSymbols
                let handlerDict = {
                    consoleLog: (data) => _addConsoleEntry(data.message, data.force_open, true),
                    consoleLogMultiple: (data) => _addConsoleEntries(data.message, data.force_open, true),
                    createLink: (data) => {
                        let unique_id = data.message.unique_id;
                        _addConsoleEntry(data.message, data.force_open, false, null, () => {
                            _insertLinkInItem(unique_id)
                        })
                    },
                    stopConsoleSpinner: (data) => {
                        let execution_count = "execution_count" in data ? data.execution_count : null;
                        _stopConsoleSpinner(data.console_id, execution_count)
                    },
                    consoleCodePrint: (data) => _appendConsoleItemOutput(data),
                    consoleCodeOverwrite: (data) => _setConsoleItemOutput(data),
                    consoleCodeRun: (data) => _startSpinner(data.console_id),
                };
                handlerDict[data.console_message](data)
            }
        }

        // We have to careful to get the very same instance of the listerner function
        // That requires storing it outside of this component since the console can be unmounted

        props.tsocket.attachListener("console-message", _handleConsoleMessage);
    }

    function _requestPseudoTileId() {
        if (pseudo_tile_id == null) {
            postWithCallback(props.main_id, "get_pseudo_tile_id", {}, function (res) {
                set_pseudo_tile_id(res.pseudo_tile_id)
            })
        }
    }

    function _createTextEntry(unique_id, summary_text) {
        return {
            unique_id: unique_id,
            type: "text",
            am_shrunk: false,
            summary_text: summary_text,
            console_text: "",
            show_markdown: false
        }
    }

    function _pasteImage() {
        var clipboardContents;
        let blob = null;
        navigator.clipboard.read()
            .then((response) => {
                    clipboardContents = response;
                    for (const item of clipboardContents) {
                        if (item.types.includes("image/png")) {
                            item.getType("image/png")
                                .then((response) => {
                                    blob = response;
                                    if (blob == null) return;
                                    gotBlob(blob);
                                });
                            break;
                        }
                    }
                }
            );

        function gotBlob(blob) {
            const formData = new FormData();
            formData.append('image', blob, 'image.png');
            formData.append("main_id", props.main_id);
            $.ajax({
                url: '/print_blob_area_to_console',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function (response) {
                    console.log("");
                },
                error: function (xhr, status, error) {
                    console.log(xhr.responseText);
                }
            });
        }
    }

    function _addConsoleText(the_text, callback = null) {
        postWithCallback("host", "print_text_area_to_console",
            {"console_text": the_text, "user_id": window.user_id, "main_id": props.main_id}, function (data) {
                if (!data.success) {
                    doFlash(data)
                } else if (callback != null) {
                    callback();
                }
            }, null, props.main_id);
    }

    const _addBlankText = useCallback(() => {
        if (window.in_context && !props.am_selected) {
            return
        }
        _addConsoleText("")
    }, [props.am_selected]);

    function _addConsoleDivider(header_text, callback = null) {
        postWithCallback("host", "print_divider_area_to_console",
            {"header_text": header_text, "user_id": window.user_id, "main_id": props.main_id}, function (data) {
                if (!data.success) {
                    doFlash(data)
                } else if (callback) {
                    callback()
                }
            }, null, props.main_id);
    }

    const _addBlankDivider = useCallback(() => {
        if (window.in_context && !props.am_selected) {
            return
        }
        _addConsoleDivider("")
    }, [props.am_selected]);

    function _getSectionIds(unique_id) {
        let cindex = _consoleItemIndex(unique_id);
        let id_list = [unique_id];
        for (let i = cindex + 1; i < props.console_items.current.length; ++i) {
            let entry = props.console_items.current[i];
            id_list.push(entry.unique_id);
            if (entry.type == "section-end") {
                break
            }
        }
        return id_list
    }

    const _deleteSection = useCallback((unique_id) => {
        let centry = get_console_item_entry(unique_id);
        const confirm_text = `Delete section ${centry.header_text}?`;
        showConfirmDialogReact("Delete Section", confirm_text, "do nothing", "delete", function () {
            let id_list = _getSectionIds(unique_id);
            let cindex = _consoleItemIndex(unique_id);
            let new_console_items = [...props.console_items.current];
            new_console_items.splice(cindex, id_list.length);
            _clear_all_selected_items();
            props.dispatch({
                type: "delete_items",
                id_list: id_list,
            });
        })
    }, []);

    const _copySection = useCallback((unique_id = null) => {
        if (!unique_id) {
            if (all_selected_items_ref.current.length != 1) {
                return
            }
            unique_id = all_selected_items_ref.current[0];
            let entry = get_console_item_entry(unique_id);
            if (entry.type != "divider") {
                return
            }
        }
        let id_list = _getSectionIds(unique_id);
        _copyItems(id_list)
    }, []);

    const _copyCell = useCallback((unique_id = null) => {
        let id_list;
        if (!unique_id) {
            id_list = _sortSelectedItems();
            if (id_list.length == 0) {
                return
            }
        } else {
            id_list = [unique_id]
        }
        _copyItems(id_list)
    }, []);

    function _copyAll() {
        const result_dict = {
            "main_id": props.main_id,
            "console_items": props.console_items.current,
            "user_id": window.user_id,
        };
        postWithCallback("host", "copy_console_cells", result_dict, null, null, props.main_id);
    }

    function _copyItems(id_list) {
        let entry_list = [];
        let in_section = false;
        for (let entry of props.console_items.current) {
            if (in_section) {
                entry.am_selected = false;
                entry_list.push(entry);
                in_section = entry.type != "section-end";
            } else {
                if (id_list.includes(entry.unique_id)) {
                    entry.am_selected = false;
                    entry_list.push(entry);
                    if (entry.type == "divider") {
                        in_section = true
                    }
                }
            }
        }
        const result_dict = {
            "main_id": props.main_id,
            "console_items": entry_list,
            "user_id": window.user_id,
        };
        postWithCallback("host", "copy_console_cells", result_dict, null, null, props.main_id);
    }

    const _pasteCell = useCallback((unique_id = null) => {
        postWithCallback("host", "get_copied_console_cells", {user_id: window.user_id}, (data) => {
            if (!data.success) {
                doFlash(data)
            } else {
                _addConsoleEntries(data.console_items, true, false, unique_id)
            }
        }, null, props.main_id)
    }, []);

    function _addConsoleTextLink(callback = null) {
        postWithCallback("host", "print_link_area_to_console",
            {"user_id": window.user_id, "main_id": props.main_id}, function (data) {
                if (!data.success) {
                    doFlash(data)
                } else if (callback) {
                    callback()
                }
            }, null, props.main_id);
    }

    function _currently_selected() {
        if (all_selected_items_ref.current.length == 0) {
            return null
        } else {
            return _.last(all_selected_items_ref.current)
        }
    }

    const _insertResourceLink = useCallback(() => {
        if (!_currently_selected()) {
            _addConsoleTextLink();
            return
        }
        let entry = get_console_item_entry(_currently_selected());
        if (!entry || entry.type != "text") {
            _addConsoleTextLink();
            return;
        }
        _insertLinkInItem(_currently_selected());
    }, []);

    function _insertLinkInItem(unique_id) {
        let entry = get_console_item_entry(unique_id);
        showSelectResourceDialog("cancel", "insert link", (result) => {
            let new_links = "links" in entry ? [...entry.links] : [];
            new_links.push({res_type: result.type, res_name: result.selected_resource});
            _setConsoleItemValue(entry.unique_id, "links", new_links)
        })
    }

    const _addBlankCode = useCallback((e) => {
        if (window.in_context && !props.am_selected) {
            return
        }
        _addCodeArea("");
    }, [props.am_selected]);

    function _addCodeArea(the_text, force_open = true) {
        postWithCallback("host", "print_code_area_to_console",
            {console_text: the_text, user_id: window.user_id, main_id: props.main_id, force_open: force_open},
            function (data) {
                if (!data.success) {
                    doFlash(data)
                }
            }, null, props.main_id);
    }

    const _resetConsole = useCallback(() => {
        props.dispatch({type: "reset"});
        postWithCallback(props.main_id, "clear_console_namespace", {}, null, null, props.main_id)
    }, []);

    function _stopAll() {
        postWithCallback(props.main_id, "stop_all_console_code", {}, null, null, props.main_id)
    }

    const _clearConsole = useCallback(() => {
        const confirm_text = "Are you sure that you want to erase everything in this log?";
        showConfirmDialogReact("Clear entire log", confirm_text, "do nothing", "clear", function () {
            set_all_selected_items([]);
            pushCallback(() => {
                props.dispatch({type: "delete_all_items"})
            })
        })
    }, []);

    function _togglePseudoLog() {
        set_show_pseudo_log(!show_pseudo_log);
    }

    function _toggleMainLog() {
        set_show_main_log(!show_main_log);
    }

    const _setFocusedItem = useCallback((unique_id, callback = null) => {
        set_console_item_with_focus(unique_id);
        if (unique_id) {
            set_console_item_saved_focus(unique_id)
        }
        pushCallback(callback);
    }, []);

    function _zoomConsole() {
        props.setMainStateValue("console_is_zoomed", true)
    }

    function _unzoomConsole() {
        props.setMainStateValue("console_is_zoomed", false);
    }

    function _expandConsole() {
        props.setMainStateValue("console_is_shrunk", false);
    }

    function _shrinkConsole() {
        props.setMainStateValue("console_is_shrunk", true);
        if (props.mState.console_is_zoomed) {
            _unzoomConsole();
        }
    }

    function _toggleExports() {
        props.setMainStateValue("show_exports_pane", !props.mState.show_exports_pane)
    }

    const _setConsoleItemValue = useCallback((unique_id, field, new_value, callback = null) => {
        props.dispatch({
            type: "change_item_value",
            unique_id: unique_id,
            field: field,
            new_value: new_value
        });
        pushCallback(callback)
    }, []);

    function _reOpenClosedDividers() {
        if (temporarily_closed_items.current.length == 0) {
            return
        }
        props.dispatch({
            type: "open_listed_dividers",
            divider_list: temporarily_closed_items.current
        })
    }

    function _closeAllDividers(callback = null) {
        for (let entry of console_items.current) {
            if (entry.type == "divider") {
                if (!entry.am_shrunk) {
                    entry.am_shrunk = true;
                    temporarily_closed_items.current.push(entry.unique_id)
                }
            }
        }
        props.dispatch("close_all_divider")
    }

    function _multiple_console_item_updates(updates, callback = null) {
        props.dispatch({
            type: "update_items",
            updates: updates

        });
        pushCallback(callback);
    }

    function _clear_all_selected_items(callback = null) {
        set_all_selected_items([]);
        pushCallback(() => {
            props.dispatch({type: "clear_all_selected"})
        });
        pushCallback(callback)
    }

    function _reduce_to_last_selected(callback = null) {
        if (all_selected_items_ref.current.length <= 1) {
            if (callback) {
                callback()
            }
            return
        }
        let updates = {};
        for (let uid of all_selected_items_ref.current.slice(0, -1)) {
            updates[uid] = {am_selected: false, search_string: null};
        }
        _multiple_console_item_updates(updates, () => {
            set_all_selected_items(all_selected_items_ref.current.slice(-1,));
            pushCallback(callback)
        })
    }

    function get_console_item_entry(unique_id) {
        return _.cloneDeep(props.console_items.current[_consoleItemIndex(unique_id)]);
    }

    function _dselectOneItem(unique_id, callback = null) {
        let updates = {};
        if (all_selected_items_ref.current.includes(unique_id)) {

            updates[unique_id] = {am_selected: false, search_string: null};
            _multiple_console_item_updates(updates, () => {
                let narray = _.cloneDeep(all_selected_items_ref.current);
                var myIndex = narray.indexOf(unique_id);
                if (myIndex !== -1) {
                    narray.splice(myIndex, 1);
                }
                set_all_selected_items(narray);
                pushCallback(callback)
            })
        } else {
            pushCallback(callBack)
        }
    }

    const _selectConsoleItem = useCallback((unique_id, event = null, callback = null) => {
        let updates = {};
        let shift_down = event != null && event.shiftKey;
        if (!shift_down) {
            for (let uid of all_selected_items_ref.current) {
                if (uid != unique_id) {
                    updates[uid] = {am_selected: false, search_string: null};
                }
            }
            updates[unique_id] = {am_selected: true, search_string: search_string_ref.current};

            _multiple_console_item_updates(updates, () => {
                set_all_selected_items([unique_id]);
                pushCallback(callback);
            })
        } else {
            if (all_selected_items_ref.current.includes(unique_id)) {
                _dselectOneItem(unique_id)
            } else {
                updates[unique_id] = {am_selected: true, search_string: search_string_ref.current};
                _multiple_console_item_updates(updates, () => {
                    let narray = _.cloneDeep(all_selected_items_ref.current);
                    narray.push(unique_id);
                    set_all_selected_items(narray);
                    pushCallback(callback)
                })
            }

        }
    }, []);

    function _sortSelectedItems() {
        let sitems = _.cloneDeep(all_selected_items_ref.current);
        sitems.sort((firstEl, secondEl) => {
            return _consoleItemIndex(firstEl) < _consoleItemIndex(secondEl) ? -1 : 1;
        });
        return sitems
    }

    function _clearSelectedItem() {
        let updates = {};
        for (let uid of all_selected_items_ref.current) {
            updates[unique_id] = {am_selected: false, search_string: null};

        }
        _multiple_console_item_updates(updates, () => {
            set_all_selected_items({});
            set_console_item_with_focus(null)
        })
    }

    function _consoleItemIndex(unique_id, console_items = null) {
        let counter = 0;
        if (console_items == null) {
            console_items = props.console_items.current
        }
        for (let entry of console_items) {
            if (entry.unique_id == unique_id) {
                return counter
            }
            ++counter;
        }
        return -1
    }

    function _moveSection({oldIndex, newIndex}, filtered_items, callback = null) {
        if (newIndex > oldIndex) {
            newIndex += 1
        }

        let move_entry = filtered_items[oldIndex];
        let move_index = _consoleItemIndex(move_entry.unique_id);
        let section_ids = _getSectionIds(move_entry.unique_id);
        let the_section = _.cloneDeep(props.console_items.current.slice(move_index, move_index + section_ids.length));
        props.dispatch({
            type: "delete_items",
            id_list: section_ids
        });
        pushCallback(() => {
            let below_index;
            if (newIndex == 0) {
                below_index = 0
            } else {
                var trueNewIndex;
                if (newIndex >= filtered_items.length) {
                    trueNewIndex = -1
                } else
                    trueNewIndex = _consoleItemIndex(filtered_items[newIndex].unique_id);
                // noinspection ES6ConvertIndexedForToForOf
                if (trueNewIndex == -1) {
                    below_index = props.console_items.current.length
                } else {
                    for (below_index = trueNewIndex; below_index < props.console_items.current.length; ++below_index) {
                        if (props.console_items.current[below_index].type == "divider") {
                            break
                        }
                    }
                    if (below_index >= props.console_items.current.length) {
                        below_index = props.console_items.current.length
                    }
                }
            }
            console.log("Got below index " + String(below_index));
            props.dispatch({
                type: "add_at_index",
                new_items: the_section,
                insert_index: below_index
            });
            pushCallback(callback)

        })
    }

    function _moveEntryAfterEntry(move_id, above_id, callback = null) {
        let new_console_items = [...props.console_items.current];
        let move_entry = _.cloneDeep(get_console_item_entry(move_id));
        props.dispatch({
            type: "delete_item",
            unique_id: move_id
        });
        pushCallback(() => {
            let target_index;
            if (above_id == null) {
                target_index = 0
            } else {
                target_index = _consoleItemIndex(above_id) + 1;
            }
            props.dispatch({
                type: "add_at_index",
                insert_index: target_index,
                new_items: [move_entry]
            });
            pushCallback(callback)
        })
    }

    const _resortConsoleItems = useCallback(({destination, source}) => {
        const oldIndex = source.index;
        const newIndex = destination.index;
        filtered_items = filtered_items_ref.current;
        const callback = _showNonDividers;
        console.log(`Got oldIndex ${String(oldIndex)} newIndex ${String(newIndex)} ${filtered_items.length} items`);
        if (oldIndex == newIndex) {
            callback();
            return
        }
        let move_entry = filtered_items[oldIndex];
        if (move_entry.type == "divider") {
            _moveSection({oldIndex, newIndex}, filtered_items, callback);
            return
        }
        let trueOldIndex = _consoleItemIndex(move_entry.unique_id);
        let trueNewIndex;
        let above_entry;
        if (newIndex == 0) {
            above_entry = null
        } else {
            if (newIndex > oldIndex) {
                above_entry = filtered_items[newIndex]
            } else {
                above_entry = filtered_items[newIndex - 1];
            }

            if (above_entry.type == "divider" && above_entry.am_shrunk) {
                let section_ids = _getSectionIds(above_entry.unique_id);
                let lastIdInSection = _.last(section_ids);
                _moveEntryAfterEntry(move_entry.unique_id, lastIdInSection, callback);
                return
            }
        }
        let target_id = above_entry == null ? null : above_entry.unique_id;
        _moveEntryAfterEntry(move_entry.unique_id, target_id, callback)
    }, []);

    const _goToNextCell = useCallback((unique_id) => {
        let next_index = _consoleItemIndex(unique_id) + 1;
        while (next_index < props.console_items.current.length) {
            let next_id = props.console_items.current[next_index].unique_id;
            let next_item = props.console_items.current[next_index];
            if (!next_item.am_shrunk &&
                ((next_item.type == "code") || ((next_item.type == "text") && (!next_item.show_markdown)))) {
                if (!next_item.show_on_filtered) {
                    set_filter_console_items(false);
                    pushCallback(() => {
                        _setConsoleItemValue(next_id, "set_focus", true)
                    })
                } else {
                    _setConsoleItemValue(next_id, "set_focus", true)
                }
                return
            }
            next_index += 1;
        }
        _addCodeArea("");
        return
    }, []);

    function _isDividerSelected() {
        for (let uid of all_selected_items_ref.current) {
            let centry = get_console_item_entry(uid);
            if (centry.type == "divider") {
                return true
            }
        }
        return false
    }

    function _doDeleteSelected() {
        let new_console_items = [];
        let in_section = false;
        let to_delete = [];
        for (let entry of props.console_items.current) {
            if (in_section) {
                to_delete.push(entry.unique_id);
                in_section = entry.type != "section-end";
                continue
            }
            if (all_selected_items_ref.current.includes(entry.unique_id)) {
                to_delete.push(entry.unique_id);
                if (entry.type == "divider") {
                    in_section = true
                }
            }
        }
        _clear_all_selected_items(() => {
            props.dispatch({
                type: "delete_items",
                id_list: to_delete
            })
        })
    }

    function _deleteSelected() {
        if (_are_selected()) {
            let new_console_items = [];
            if (_isDividerSelected()) {
                const confirm_text = "The selection includes section dividers. " +
                    "The sections will be completed in their entirety. Do you want to continue";
                showConfirmDialogReact("Do Delete", confirm_text, "do nothing", "delete", function () {
                    _doDeleteSelected();
                })
            } else {
                _doDeleteSelected()
            }
        }
    }

    const _closeConsoleItem = useCallback((unique_id, callback = null) => {
        let centry = get_console_item_entry(unique_id);
        if (centry.type == "divider") {
            _deleteSection(unique_id)
        } else {
            _dselectOneItem(unique_id, () => {
                props.dispatch({
                    type: "delete_item",
                    unique_id: unique_id
                })
            })
        }
    }, []);

    function _getNextEndIndex(start_id) {
        let start_index = _consoleItemIndex(start_id);
        for (let entry of props.console_items.current.slice(start_index,)) {
            if (entry.type == "section-end") {
                return _consoleItemIndex(entry.unique_id)
            }
        }
        return props.console_items.current.length
    }

    function _isInSection(unique_id) {
        let idx = _consoleItemIndex(unique_id);
        for (let entry of props.console_items.current.slice(idx + 1,)) {
            if (entry.type == "divider") {
                return false
            } else {
                if (entry.type == "section-end") {
                    return true
                }
            }
        }
        return false
    }

    function _addConsoleEntries(new_entries, force_open = true, set_focus = false, unique_id = null, callback = null) {
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
            if (inserting_divider && _isInSection(unique_id)) {
                insert_index = _getNextEndIndex(unique_id) + 1
            } else {
                insert_index = _consoleItemIndex(unique_id) + 1
            }
        } else if (props.console_items.current.length == 0 || all_selected_items_ref.current.length == 0) {
            insert_index = props.console_items.current.length
        } else {
            let current_selected_id = _currently_selected();
            if (inserting_divider && _isInSection(current_selected_id)) {
                insert_index = _getNextEndIndex(current_selected_id) + 1
            } else {
                let selected_item = get_console_item_entry(current_selected_id);
                if (selected_item.type == "divider") {
                    if (selected_item.am_shrunk) {
                        insert_index = _getNextEndIndex(current_selected_id) + 1
                    } else {
                        insert_index = _consoleItemIndex(current_selected_id) + 1;
                    }
                } else {
                    insert_index = _consoleItemIndex(current_selected_id) + 1
                }
            }
        }
        props.dispatch({
            type: "add_at_index",
            insert_index: insert_index,
            new_items: new_entries
        });
        pushCallback(() => {
            if (force_open) {
                props.setMainStateValue("console_is_shrunk", false, () => {
                    _selectConsoleItem(last_id, null, callback)
                })
            } else {
                _selectConsoleItem(last_id, null, callback)
            }
        });
    }

    function _addConsoleEntry(new_entry, force_open = true, set_focus = false, unique_id = null, callback = null) {
        _addConsoleEntries([new_entry], force_open, set_focus, unique_id, callback);
    }

    function _startSpinner(unique_id) {
        var update_dict = {
            show_spinner: true,
            running: true
        };
        const updates = {};
        updates[unique_id] = update_dict;
        props.dispatch({
            type: "update_items",
            updates: updates
        })
    }

    function _stopConsoleSpinner(unique_id, execution_count = null) {
        var update_dict = {
            show_spinner: false,
            running: false
        };
        if ("execution_count" != null) {
            update_dict.execution_count = execution_count
        }
        const updates = {};
        updates[unique_id] = update_dict;
        props.dispatch({
            type: "update_items",
            updates: updates
        })
    }

    function _appendConsoleItemOutput(data) {
        let current = get_console_item_entry(data.console_id).output_text;
        if (current != "") {
            current += "<br>"
        }
        _setConsoleItemValue(data.console_id, "output_text", current + data.message)
    }

    function _setConsoleItemOutput(data) {
        _setConsoleItemValue(data.console_id, "output_text", data.message)
    }

    function _addToLog(new_line) {
        let log_content = console_error_log_text_ref.current;
        let log_list = log_content.split(/\r?\n/);
        let mlines = max_console_lines;
        if (log_list.length >= mlines) {
            log_list = log_list.slice(-1 * mlines + 1);
            log_content = log_list.join("\n")
        }
        set_console_error_log_text(log_content + new_line)
    }

    function _bodyHeight() {
        if (body_ref && body_ref.current) {
            return props.console_available_height - (body_ref.current.offsetTop - header_ref.current.offsetTop) - 2
        } else {
            return props.console_available_height - 75
        }
    }

    const _bodyWidth = useMemo(() => {
        if (props.console_available_width > MAX_CONSOLE_WIDTH) {
            return MAX_CONSOLE_WIDTH
        } else {
            return props.console_available_width
        }
    }, [props.console_available_width]);

    const renderContextMenu = useMemo(() => {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                <MenuItem icon="new-text-box"
                          onClick={_addBlankText}
                          text="New Text Cell"/>
                <MenuItem icon="code"
                          onClick={_addBlankCode}
                          text="New Code Cell"/>
                <MenuItem icon="header"
                          onClick={_addBlankDivider}
                          text="New Section"/>
                <MenuItem icon="clipboard"
                          onClick={() => {
                              _pasteCell()
                          }}
                          text="Paste Cells"/>
                <MenuDivider/>
                <MenuItem icon="reset"
                          onClick={_resetConsole}
                          intent="warning"
                          text="Clear output and reset"/>
                <MenuItem icon="trash"
                          onClick={_clearConsole}
                          intent="danger"
                          text="Erase everything"/>
            </Menu>
        );
    }, []);

    function _glif_text(show_glif_text, txt) {
        if (show_glif_text) {
            return txt
        }
        return null
    }

    function _clickConsoleBody(e) {
        _clear_all_selected_items();
        e.stopPropagation()
    }

    function _handleSearchFieldChange(event) {
        if (search_helper_text) {
            set_search_helper_text(null);
            pushCallback(() => {
                _setSearchString(event.target.value)
            })
        } else {
            _setSearchString(event.target.value)
        }
    }

    function _are_selected() {
        return all_selected_items_ref.current.length > 0
    }

    function _setSearchString(val) {
        let nval = val == "" ? null : val;
        let updates = {};
        set_search_string(nval);
        pushCallback(() => {
            if (_are_selected()) {
                for (let uid of all_selected_items_ref.current) {
                    updates[uid] = {search_string: search_string_ref.current}
                }
                _multiple_console_item_updates(updates)
            }
        })
    }

    function _handleUnFilter() {
        set_filter_console_items(false);
        set_search_helper_text(null);
        pushCallback(() => {
            _setSearchString(null)
        })
    }

    function _handleFilter() {
        let updates = {};
        for (let entry of props.console_items.current) {
            if (entry.type == "code" || entry.type == "text") {
                updates[entry.unique_id] = {
                    show_on_filtered: entry.console_text.toLowerCase().includes(search_string_ref.current.toLowerCase())
                }
            } else if (entry.type == "divider") {
                updates[entry.unique_id] = {
                    show_on_filtered: true
                }
            }

        }
        _multiple_console_item_updates(updates, () => {
            set_filter_console_items(true)
        })
    }

    function _searchNext() {
        let current_index;
        if (!_are_selected()) {
            current_index = 0
        } else {
            current_index = _consoleItemIndex(_currently_selected()) + 1
        }

        while (current_index < props.console_items.current.length) {
            let entry = props.console_items.current[current_index];
            if (entry.type == "code" || entry.type == "text") {
                if (_selectIfMatching(entry, "console_text", () => {
                    if (entry.type == "text") {
                        _setConsoleItemValue(entry.unique_id, "show_markdown", false)
                    }
                })) {
                    set_search_helper_text(null);
                    return
                }
            }
            current_index += 1
        }
        set_search_helper_text("No more results");
    }

    function _selectIfMatching(entry, text_field, callback = null) {
        if (entry[text_field].toLowerCase().includes(search_string_ref.current.toLowerCase())) {
            if (entry.am_shrunk) {
                _setConsoleItemValue(entry.unique_id, "am_shrunk", false, () => {
                    _selectConsoleItem(entry.unique_id, null, callback)
                })
            } else {
                _selectConsoleItem(entry.unique_id, null, callback)
            }
            return true
        }
        return false
    }

    function _searchPrevious() {
        let current_index;
        if (!_are_selected()) {
            current_index = props.console_items.current.length - 1
        } else {
            current_index = _consoleItemIndex(_currently_selected()) - 1
        }
        while (current_index >= 0) {
            let entry = props.console_items.current[current_index];
            if (entry.type == "code" || entry.type == "text") {
                if (_selectIfMatching(entry, "console_text", () => {
                    if (entry.type == "text") {
                        _setConsoleItemValue(entry.unique_id, "show_markdown", false)
                    }
                })) {
                    set_search_helper_text(null);
                    return
                }
            }
            current_index -= 1;
        }
        set_search_helper_text("No more results");
    }

    function _handleSubmit(e) {
        _searchNext();
        e.preventDefault();
    }

    function _shouldCancelSortStart() {
        return filter_console_items
    }

    function menu_specs() {
        let ms = {
            Insert: [{
                name_text: "Text Cell", icon_name: "new-text-box", click_handler: _addBlankText,
                key_bindings: ["ctrl+t"]
            },
                {name_text: "Code Cell", icon_name: "code", click_handler: _addBlankCode, key_bindings: ["ctrl+c"]},
                {name_text: "Section", icon_name: "header", click_handler: _addBlankDivider},
                {name_text: "Resource Link", icon_name: "link", click_handler: _insertResourceLink}],
            Edit: [{
                name_text: "Copy All", icon_name: "duplicate", click_handler: () => {
                    _copyAll()
                }
            },
                {
                    name_text: "Copy Selected", icon_name: "duplicate", click_handler: () => {
                        _copyCell()
                    }
                },
                {
                    name_text: "Paste Cells", icon_name: "clipboard", click_handler: () => {
                        _pasteCell()
                    }
                },
                {
                    name_text: "Paste Image", icon_name: "clipboard", click_handler: () => {
                        _pasteImage()
                    }
                },
                {
                    name_text: "Delete Selected", icon_name: "trash", click_handler: () => {
                        _deleteSelected()
                    }
                },
                {name_text: "divider2", icon_name: null, click_handler: "divider"},
                {name_text: "Clear Log", icon_name: "trash", click_handler: _clearConsole}
            ],
            Execute: [{
                name_text: "Run Selected", icon_name: "play", click_handler: _runSelected,
                key_bindings: ["ctrl+enter", "command+enter"]
            },
                {name_text: "Stop All", icon_name: "stop", click_handler: _stopAll},
                {name_text: "Reset All", icon_name: "reset", click_handler: _resetConsole}],
        };

        if (!(show_pseudo_log || show_main_log)) {
            ms["Consoles"] = [
                {name_text: "Show Log Console", icon_name: "console", click_handler: _togglePseudoLog},
                {name_text: "Show Main Console", icon_name: "console", click_handler: _toggleMainLog}]
        } else {
            ms["Consoles"] = [
                {
                    name_text: "Hide Console", icon_name: "console",
                    click_handler: show_main_log ? _toggleMainLog : _togglePseudoLog
                }]
        }

        return ms
    }

    function disabled_items() {
        let items = [];
        if (!_are_selected() || all_selected_items_ref.current.length != 1) {
            items.push("Run Selected");
            items.push("Copy Section");
            items.push("Delete Section")
        }
        if (all_selected_items_ref.current.length == 1) {
            let unique_id = all_selected_items_ref.current[0];
            let entry = get_console_item_entry(unique_id);
            if (!entry) {
                return []
            }
            if (entry.type != "divider") {
                items.push("Copy Section");
                items.push("Delete Section")
            }
        }
        if (!_are_selected()) {
            items.push("Copy Selected");
            items.push("Delete Selected");
        }
        return items
    }

    function _clearCodeOutput(unique_id, callback = null) {
        _setConsoleItemValue(unique_id, "output_text", "", callback)
    }

    function _runSelected() {
        if (window.in_context && !props.am_selected) {
            return
        }
        if (_are_selected() && all_selected_items_ref.current.length == 1) {
            let entry = get_console_item_entry(_currently_selected());
            if (entry.type == "code") {
                _runCodeItem(_currently_selected())
            } else if (entry.type == "text") {
                _showTextItemMarkdown(_currently_selected())
            }
        }
    }

    const _runCodeItem = useCallback((unique_id, go_to_next = false) => {
        _clearCodeOutput(unique_id, () => {
            _startSpinner(unique_id);
            let entry = get_console_item_entry(unique_id);
            postWithCallback(props.main_id, "exec_console_code", {
                "the_code": entry.console_text,
                "console_id": unique_id
            }, function () {
                if (go_to_next) {
                    _goToNextCell(unique_id)
                }
            }, null, props.main_id)
        })
    }, []);

    function _showTextItemMarkdown(unique_id) {
        _setConsoleItemValue(unique_id, "show_markdown", true);
    }

    function _hideNonDividers() {
        $(".in-section:not(.divider-log-panel)").css({opacity: "10%"})
    }

    function _showNonDividers() {
        $(".in-section:not(.divider-log-panel)").css({opacity: "100%"})
    }

    const _sortStart = useCallback(({draggableId, mode}) => {
        let idx = _consoleItemIndex(draggableId);
        let entry = props.console_items.current[idx];
        if (entry.type == "divider") {
            _hideNonDividers()
        }
    }, []);

    let gbstyle = {marginLeft: 1, marginTop: 2};
    let console_class = props.mState.console_is_shrunk ? "am-shrunk" : "not-shrunk";
    if (props.mState.console_is_zoomed) {
        console_class = "am-zoomed"
    }
    let outer_style = Object.assign({}, props.style);
    outer_style.width = _bodyWidth;
    let show_glif_text = outer_style.width > 800;
    let header_style = {};
    if (!props.shrinkable) {
        header_style["paddingLeft"] = 10
    }
    if (!props.mState.console_is_shrunk) {
        header_style["paddingRight"] = 15
    }
    let key_bindings = [[["escape"], () => {
        _clear_all_selected_items()
    }]];

    let in_closed_section = false;
    let in_section = false;
    let filtered_items = props.console_items.current.filter((entry) => {
        if (entry.type == "divider") {
            in_section = true;
            in_closed_section = entry.am_shrunk;
            return true
        } else if (entry.type == "section-end") {
            entry.in_section = true;
            let was_in_closed_section = in_closed_section;
            in_closed_section = false;
            in_section = false;
            return !was_in_closed_section
        } else if (!in_closed_section) {
            entry.in_section = in_section;
            return true
        }
    });

    if (filter_console_items) {
        filtered_items = filtered_items.filter(entry => entry.show_on_filtered);
    }
    filtered_items_ref.current = filtered_items;
    let suggestionGlyphs = [];
    if (show_pseudo_log || show_main_log) {
        suggestionGlyphs.push(
            {intent: "primary", icon: "console", handleClick: show_main_log ? _toggleMainLog : _togglePseudoLog})
    }

    const empty_style = useMemo(() => {
        return {}
    }, []);
    return (
        <Card id="console-panel" className={console_class} elevation={2} style={outer_style}>
            <div className="d-flex flex-column justify-content-around">
                <div id="console-heading"
                     ref={header_ref}
                     style={header_style}
                     className="d-flex flex-row justify-content-between">
                    <div id="console-header-left" className="d-flex flex-row">
                        {props.mState.console_is_shrunk && props.shrinkable &&
                            <GlyphButton handleClick={_expandConsole}
                                         style={{marginLeft: 2}}
                                         icon="chevron-right"/>
                        }
                        {!props.mState.console_is_shrunk && props.shrinkable &&
                            <GlyphButton handleClick={_shrinkConsole}
                                         style={{marginLeft: 2}}
                                         icon="chevron-down"/>
                        }

                        <TacticMenubar menu_specs={menu_specs()}
                                       disabled_items={disabled_items()}
                                       suggestionGlyphs={suggestionGlyphs}
                                       showRefresh={false}
                                       showClose={false}
                                       refreshTab={props.refreshTab}
                                       closeTab={null}
                                       controlled={false} // This doesn't matter
                                       am_selected={false} // Also doesn't matter
                        />

                    </div>

                    <div id="console-header-right"
                         className="d-flex flex-row">
                        <GlyphButton extra_glyph_text={_glif_text(show_glif_text, "exports")}
                                     tooltip="Show export browser"
                                     small={true}
                                     className="show-exports-but"
                                     style={{marginRight: 5, marginTop: 2}}
                                     handleClick={_toggleExports}
                                     icon="variable"/>

                        {!props.mState.console_is_zoomed && props.zoomable &&
                            <GlyphButton handleClick={_zoomConsole}
                                         icon="maximize"/>
                        }
                        {props.mState.console_is_zoomed && props.zoomable &&
                            <GlyphButton handleClick={_unzoomConsole}
                                         icon="minimize"/>
                        }
                    </div>
                </div>
            </div>
            {!props.mState.console_is_shrunk && !show_pseudo_log && !show_main_log &&
                <FilterSearchForm
                    search_string={search_string_ref.current}
                    handleSearchFieldChange={_handleSearchFieldChange}
                    handleFilter={_handleFilter}
                    handleUnFilter={_handleUnFilter}
                    searchNext={_searchNext}
                    searchPrevious={_searchPrevious}
                    search_helper_text={search_helper_text}
                />
            }
            {!props.mState.console_is_shrunk && show_main_log &&
                <SearchableConsole main_id={props.main_id}
                                   streaming_host={props.main_id}
                                   container_id={props.main_id}
                                   ref={body_ref}
                                   outer_style={{
                                       overflowX: "auto",
                                       overflowY: "auto",
                                       height: _bodyHeight(),
                                       marginLeft: 20,
                                       marginRight: 20
                                   }}
                                   showCommandField={false}
                />
            }
            {!props.mState.console_is_shrunk && show_pseudo_log &&
                <SearchableConsole main_id={props.main_id}
                                   streaming_host={props.main_id}
                                   container_id={pseudo_tile_id}
                                   ref={body_ref}
                                   outer_style={{
                                       overflowX: "auto",
                                       overflowY: "auto",
                                       height: _bodyHeight(),
                                       marginLeft: 20,
                                       marginRight: 20
                                   }}
                                   showCommandField={true}
                />
            }
            {!props.mState.console_is_shrunk && !show_pseudo_log && !show_main_log &&
                <div id="console"
                     ref={body_ref}
                     className="contingent-scroll"
                     onClick={_clickConsoleBody}
                     style={{height: _bodyHeight()}}>
                    <ContextMenu content={renderContextMenu}>
                        <SortableComponent id="console-items-div"
                                           style={empty_style}
                                           main_id={props.main_id}
                                           ElementComponent={SuperItem}
                                           key_field_name="unique_id"
                                           item_list={filtered_items}
                                           helperClass={theme.dark_theme ? "bp5-dark" : "light-theme"}
                                           handle=".console-sorter"
                                           onBeforeCapture={_sortStart}
                                           onDragEnd={_resortConsoleItems}
                                           setConsoleItemValue={_setConsoleItemValue}
                                           selectConsoleItem={_selectConsoleItem}
                                           console_available_width={_bodyWidth}
                                           execution_count={0}
                                           runCodeItem={_runCodeItem}
                                           handleDelete={_closeConsoleItem}
                                           goToNextCell={_goToNextCell}
                                           setFocus={_setFocusedItem}
                                           addNewTextItem={_addBlankText}
                                           addNewCodeItem={_addBlankCode}
                                           addNewDividerItem={_addBlankDivider}
                                           copyCell={_copyCell}
                                           pasteCell={_pasteCell}
                                           copySection={_copySection}
                                           deleteSection={_deleteSection}
                                           insertResourceLink={_insertResourceLink}
                                           useDragHandle={false}
                                           pseudo_tile_id={pseudo_tile_id}
                                           handleCreateViewer={props.handleCreateViewer}
                                           axis="y"
                        />
                    </ContextMenu>
                    <div id="padding-div" style={{height: 500}}></div>
                </div>
            }
            <KeyTrap global={true}
                     active={!props.controlled || props.am_selected}
                     bindings={key_bindings}/>
        </Card>
    );
}

ConsoleComponent = memo(ConsoleComponent);

ConsoleComponent.propTypes = {
    console_items: PropTypes.object,
    mState: PropTypes.object,
    setMainStateValue: PropTypes.func,
    console_available_height: PropTypes.number,
    console_available_width: PropTypes.number,
    style: PropTypes.object,
    shrinkable: PropTypes.bool,
    zoomable: PropTypes.bool,
};

ConsoleComponent.defaultProps = {
    style: {},
    shrinkable: true,
    zoomable: true,
};


function Shandle(props) {
    return (
        <span {...props.dragHandleProps}>
                <Icon icon="drag-handle-vertical"
                      {...props.dragHandleProps}
                      style={{marginLeft: 0, marginRight: 6}}
                      size={20}
                      className="console-sorter"/>
            </span>
    )
}

function SuperItem(props) {
    switch (props.type) {
        case "text":
            return <ConsoleTextItem {...props}/>;
        case "code":
            return <ConsoleCodeItem {...props}/>;
        case "fixed":
            return <LogItem {...props}/>;
        case "figure":
            return <BlobItem {...props}/>;
        case "divider":
            return <DividerItem {...props}/>;
        case "section-end":
            return <SectionEndItem {...props}/>;
        default:
            return null
    }
}

SuperItem = memo(SuperItem);

const divider_item_update_props = ["am_shrunk", "am_selected", "header_text", "console_available_width"];

function DividerItem(props) {
    function _toggleShrink() {
        props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
    }

    function _deleteMe() {
        props.handleDelete(props.unique_id)
    }

    function _handleHeaderTextChange(value) {
        props.setConsoleItemValue(props.unique_id, "header_text", value)
    }

    function _copyMe() {
        props.copyCell(props.unique_id)
    }

    function _copySection() {
        props.copySection(props.unique_id)
    }

    function _deleteSection() {
        props.deleteSection(props.unique_id)
    }

    function _pasteCell() {
        props.pasteCell(props.unique_id)
    }

    function _selectMe(e = null, callback = null) {
        props.selectConsoleItem(props.unique_id, e, callback)
    }

    function _addBlankText() {
        _selectMe(null, () => {
            props.addNewTextItem()
        })
    }

    function _addBlankDivider() {
        let self = this;
        _selectMe(null, () => {
            props.addNewDividerItem()
        })
    }

    function _addBlankCode() {
        _selectMe(null, () => {
            props.addNewCodeItem()
        })
    }

    function renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                <MenuItem icon="duplicate"
                          onClick={_copyMe}
                          text="Copy"/>
                <MenuItem icon="clipboard"
                          onClick={_pasteCell}
                          text="Paste Cells"/>
                <MenuDivider/>
                <MenuItem icon="new-text-box"
                          onClick={_addBlankText}
                          text="New Text Cell"/>
                <MenuItem icon="code"
                          onClick={_addBlankCode}
                          text="New Code Cell"/>
                <MenuItem icon="header"
                          onClick={_addBlankDivider}
                          text="New Section"/>
                <MenuDivider/>
                <MenuItem icon="trash"
                          onClick={_deleteMe}
                          intent="danger"
                          text="Delete Section"/>
            </Menu>
        );
    }

    function _consoleItemClick(e) {
        _selectMe(e);
        e.stopPropagation()
    }

    let converted_dict = {__html: props.console_text};
    let panel_class = props.am_shrunk ? "log-panel in-section divider-log-panel log-panel-invisible fixed-log-panel" : "log-panel divider-log-panel log-panel-visible fixed-log-panel";
    if (props.am_selected) {
        panel_class += " selected"
    }
    if (props.is_error) {
        panel_class += " error-log-panel"
    }
    let body_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
    return (
        <ContextMenu content={renderContextMenu()}>
            <div className={panel_class + " d-flex flex-row"} onClick={_consoleItemClick}
                 id={props.unique_id} style={{marginBottom: 10}}>
                <div className="button-div shrink-expand-div d-flex flex-row">
                    <Shandle dragHandleProps={props.dragHandleProps}/>
                    {!props.am_shrunk &&
                        <GlyphButton icon="chevron-down"
                                     handleClick={_toggleShrink}/>
                    }
                    {props.am_shrunk &&
                        <GlyphButton icon="chevron-right"
                                     style={{marginTop: 5}}
                                     handleClick={_toggleShrink}/>
                    }
                </div>
                <EditableText value={props.header_text}
                              onChange={_handleHeaderTextChange}
                              className="console-divider-text"/>
                <div className="button-div d-flex flex-row">
                    <GlyphButton handleClick={_deleteMe}
                                 intent="danger"
                                 tooltip="Delete this item"
                                 style={{marginLeft: 10, marginRight: 66, minHeight: 0}}
                                 icon="trash"/>
                </div>
            </div>
        </ContextMenu>
    )
}

DividerItem = memo(DividerItem);

const section_end_item_update_props = ["am_selected", "console_available_width"];

function SectionEndItem(props) {
    function _pasteCell() {
        props.pasteCell(props.unique_id)
    }

    function _selectMe(e = null, callback = null) {
        props.selectConsoleItem(props.unique_id, e, callback)
    }

    function _addBlankText() {
        _selectMe(null, () => {
            props.addNewTextItem()
        })
    }

    function _addBlankDivider() {
        _selectMe(null, () => {
            props.addNewDividerItem()
        })
    }

    function _addBlankCode() {
        _selectMe(null, () => {
            props.addNewCodeItem()
        })
    }

    function renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                <MenuItem icon="clipboard"
                          onClick={_pasteCell}
                          text="Paste Cells"/>
                <MenuDivider/>
                <MenuItem icon="new-text-box"
                          onClick={_addBlankText}
                          text="New Text Cell"/>
                <MenuItem icon="code"
                          onClick={_addBlankCode}
                          text="New Code Cell"/>
                <MenuItem icon="header"
                          onClick={_addBlankDivider}
                          text="New Section"/>
                <MenuDivider/>
            </Menu>
        );
    }

    function _consoleItemClick(e) {
        _selectMe(e);
        e.stopPropagation()
    }

    let panel_class = "log-panel in-section section-end-log-panel log-panel-visible fixed-log-panel";
    if (props.am_selected) {
        panel_class += " selected"
    }
    let body_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
    let line_style = {
        marginLeft: 65,
        marginRight: 85,
        marginTop: 10,
        borderBottomWidth: 2
    };
    return (
        <ContextMenu content={renderContextMenu()}>
            <div className={panel_class + " d-flex flex-row"} onClick={_consoleItemClick}
                 id={props.unique_id} style={{marginBottom: 10}}>
                <ButtonGroup minimal={true} vertical={true} style={{width: "100%"}}>
                    <span {...props.dragHandleProps}/>
                    <Divider style={line_style}/>
                </ButtonGroup>
                <div className="button-div d-flex flex-row">
                </div>
            </div>
        </ContextMenu>
    )
}

SectionEndItem = memo(SectionEndItem);

const log_item_update_props = ["is_error", "am_shrunk", "am_selected",
    "in_section", "summary_text", "console_text", "console_available_width"];

function LogItem(props) {
    const last_output_text = useRef("");

    useEffect(() => {
        executeEmbeddedScripts();
        makeTablesSortable()
    });

    function _toggleShrink() {
        props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
    }

    function _deleteMe() {
        props.handleDelete(props.unique_id)
    }

    function _handleSummaryTextChange(value) {
        props.setConsoleItemValue(props.unique_id, "summary_text", value)
    }

    function executeEmbeddedScripts() {
        if (props.output_text != last_output_text.current) {  // to avoid doubles of bokeh images
            last_output_text.current = props.output_text;
            let scripts = $("#" + props.unique_id + " .log-code-output script").toArray();
            for (let script of scripts) {
                try {
                    window.eval(script.text)
                } catch (e) {

                }
            }
        }
    }

    function makeTablesSortable() {
        let tables = $("#" + props.unique_id + " table.sortable").toArray();
        for (let table of tables) {
            sorttable.makeSortable(table)
        }
    }

    function _copyMe() {
        props.copyCell(props.unique_id)
    }

    function _pasteCell() {
        props.pasteCell(props.unique_id)
    }

    function _selectMe(e = null, callback = null) {
        props.selectConsoleItem(props.unique_id, e, callback)
    }

    function _addBlankText() {
        _selectMe(null, () => {
            props.addNewTextItem()
        })
    }

    function _addBlankDivider() {
        _selectMe(null, () => {
            props.addNewDividerItem()
        })
    }

    function _addBlankCode() {
        _selectMe(null, () => {
            props.addNewCodeItem()
        })
    }

    function renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                <MenuItem icon="duplicate"
                          onClick={_copyMe}
                          text="Copy Cell"/>
                <MenuItem icon="clipboard"
                          onClick={_pasteCell}
                          text="Paste Cells"/>
                <MenuDivider/>
                <MenuItem icon="new-text-box"
                          onClick={_addBlankText}
                          text="New Text Cell"/>
                <MenuItem icon="code"
                          onClick={_addBlankCode}
                          text="New Code Cell"/>
                <MenuItem icon="header"
                          onClick={_addBlankDivider}
                          text="New Section"/>
                <MenuDivider/>
                <MenuItem icon="trash"
                          onClick={_deleteMe}
                          intent="danger"
                          text="Delete Cell"/>
            </Menu>
        );
    }

    function _consoleItemClick(e) {
        _selectMe(e);
        e.stopPropagation()
    }

    let panel_class = props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
    let converted_dict = {__html: props.console_text};

    if (props.in_section) {
        panel_class += " in-section"
    }
    if (props.am_selected) {
        panel_class += " selected"
    }
    if (props.is_error) {
        panel_class += " error-log-panel"
    }
    let body_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
    if (props.in_section) {
        body_width -= SECTION_INDENT / 2
    }
    return (
        <ContextMenu content={renderContextMenu()}>
            <div className={panel_class + " d-flex flex-row"} onClick={_consoleItemClick}
                 id={props.unique_id} style={{marginBottom: 10}}>
                <div className="button-div shrink-expand-div d-flex flex-row">
                    <Shandle dragHandleProps={props.dragHandleProps}/>
                    {!props.am_shrunk &&
                        <GlyphButton icon="chevron-down"
                                     handleClick={_toggleShrink}/>
                    }
                    {props.am_shrunk &&
                        <GlyphButton icon="chevron-right"
                                     style={{marginTop: 5}}
                                     handleClick={_toggleShrink}/>
                    }
                </div>
                {props.am_shrunk &&
                    <Fragment>
                        <EditableText value={props.summary_text}
                                      onChange={_handleSummaryTextChange}
                                      className="log-panel-summary"/>
                        <div className="button-div d-flex flex-row">
                            <GlyphButton handleClick={_deleteMe}
                                         intent="danger"
                                         tooltip="Delete this item"
                                         style={{marginLeft: 10, marginRight: 66}}
                                         icon="trash"/>
                        </div>
                    </Fragment>
                }
                {!props.am_shrunk &&
                    <div className="d-flex flex-column">
                        <div className="log-panel-body d-flex flex-row">
                            <div style={{
                                marginTop: 10,
                                marginLeft: 30,
                                padding: 8,
                                width: body_width,
                                border: "1px solid #c7c7c7"
                            }}
                                 dangerouslySetInnerHTML={converted_dict}/>
                            <div className="button-div d-flex flex-row">
                                <GlyphButton handleClick={_deleteMe}
                                             tooltip="Delete this item"
                                             style={{marginLeft: 10, marginRight: 66}}
                                             intent="danger"
                                             icon="trash"/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </ContextMenu>
    )
}

LogItem = memo(LogItem);

const blob_item_update_props = ["is_error", "am_shrunk", "am_selected",
    "in_section", "summary_text", "image_data_str", "console_available_width"];

function BlobItem(props) {
    const last_output_text = useRef("");

    useEffect(() => {
        executeEmbeddedScripts();
        makeTablesSortable()
    });

    function _toggleShrink() {
        props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
    }

    function _deleteMe() {
        props.handleDelete(props.unique_id)
    }

    function _handleSummaryTextChange(value) {
        props.setConsoleItemValue(props.unique_id, "summary_text", value)
    }

    function executeEmbeddedScripts() {
        if (props.output_text != last_output_text.current) {  // to avoid doubles of bokeh images
            last_output_text.current = props.output_text;
            let scripts = $("#" + props.unique_id + " .log-code-output script").toArray();
            for (let script of scripts) {
                try {
                    window.eval(script.text)
                } catch (e) {

                }
            }
        }
    }

    function makeTablesSortable() {
        let tables = $("#" + props.unique_id + " table.sortable").toArray();
        for (let table of tables) {
            sorttable.makeSortable(table)
        }
    }

    function _copyMe() {
        props.copyCell(props.unique_id)
    }

    function _pasteCell() {
        props.pasteCell(props.unique_id)
    }

    function _selectMe(e = null, callback = null) {
        props.selectConsoleItem(props.unique_id, e, callback)
    }

    function _addBlankText() {
        _selectMe(null, () => {
            props.addNewTextItem()
        })
    }

    function _addBlankDivider() {
        _selectMe(null, () => {
            props.addNewDividerItem()
        })
    }

    function _addBlankCode() {
        let self = this;
        _selectMe(null, () => {
            props.addNewCodeItem()
        })
    }

    function renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                <MenuItem icon="duplicate"
                          onClick={_copyMe}
                          text="Copy Cell"/>
                <MenuItem icon="clipboard"
                          onClick={_pasteCell}
                          text="Paste Cells"/>
                <MenuDivider/>
                <MenuItem icon="new-text-box"
                          onClick={_addBlankText}
                          text="New Text Cell"/>
                <MenuItem icon="code"
                          onClick={_addBlankCode}
                          text="New Code Cell"/>
                <MenuItem icon="header"
                          onClick={_addBlankDivider}
                          text="New Section"/>
                <MenuDivider/>
                <MenuItem icon="trash"
                          onClick={_deleteMe}
                          intent="danger"
                          text="Delete Cell"/>
            </Menu>
        );
    }

    function _consoleItemClick(e) {
        _selectMe(e);
        e.stopPropagation()
    }

    let panel_class = props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";


    if (props.in_section) {
        panel_class += " in-section"
    }
    if (props.am_selected) {
        panel_class += " selected"
    }
    let body_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
    if (props.in_section) {
        body_width -= SECTION_INDENT / 2
    }
    return (
        <ContextMenu content={renderContextMenu()}>
            <div className={panel_class + " d-flex flex-row"} onClick={_consoleItemClick}
                 id={props.unique_id} style={{marginBottom: 10}}>
                <div className="button-div shrink-expand-div d-flex flex-row">
                    <Shandle dragHandleProps={props.dragHandleProps}/>
                    {!props.am_shrunk &&
                        <GlyphButton icon="chevron-down"
                                     handleClick={_toggleShrink}/>
                    }
                    {props.am_shrunk &&
                        <GlyphButton icon="chevron-right"
                                     style={{marginTop: 5}}
                                     handleClick={_toggleShrink}/>
                    }
                </div>
                {props.am_shrunk &&
                    <Fragment>
                        <EditableText value={props.summary_text}
                                      onChange={_handleSummaryTextChange}
                                      className="log-panel-summary"/>
                        <div className="button-div d-flex flex-row">
                            <GlyphButton handleClick={_deleteMe}
                                         intent="danger"
                                         tooltip="Delete this item"
                                         style={{marginLeft: 10, marginRight: 66}}
                                         icon="trash"/>
                        </div>
                    </Fragment>
                }
                {!props.am_shrunk &&
                    <div className="d-flex flex-column">
                        <div className="log-panel-body d-flex flex-row">
                            <div style={{
                                marginTop: 10,
                                marginLeft: 30,
                                padding: 8,
                                width: body_width,
                                border: "1px solid #c7c7c7"
                            }}>
                                {props.image_data_str && (
                                    <img src={props.image_data_str}
                                         alt="An Image" width={body_width - 25}/>)
                                }
                            </div>
                            <div className="button-div d-flex flex-row">
                                <GlyphButton handleClick={_deleteMe}
                                             tooltip="Delete this item"
                                             style={{marginLeft: 10, marginRight: 66}}
                                             intent="danger"
                                             icon="trash"/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </ContextMenu>
    )

}

BlobItem = memo(BlobItem);

BlobItem.propTypes = {
    unique_id: PropTypes.string,
    in_section: PropTypes.bool,
    is_error: PropTypes.bool,
    am_shrunk: PropTypes.bool,
    summary_text: PropTypes.string,
    selectConsoleItem: PropTypes.func,
    am_selected: PropTypes.bool,
    blob: PropTypes.object,
    setConsoleItemValue: PropTypes.func,
    handleDelete: PropTypes.func,
    console_available_width: PropTypes.number,
};

const code_item_update_props = ["am_shrunk", "set_focus", "am_selected", "search_string", "summary_text", "console_text",
    "in_section", "show_spinner", "execution_count", "output_text", "console_available_width", "dark_theme"];

function ConsoleCodeItem(props) {
    const elRef = useRef(null);
    const last_output_text = useRef("");
    const am_selected_previous = useRef(false);
    const setFocusFunc = useRef(null);

    useEffect(() => {
        executeEmbeddedScripts();
        makeTablesSortable();
        if (props.am_selected && !am_selected_previous.current && elRef && elRef.current) {
            scrollMeIntoView()
        }
        am_selected_previous.current = props.am_selected;
        if (props.set_focus && setFocusFunc.current) {
            setFocusFunc.current();
            props.setConsoleItemValue(props.unique_id, "set_focus", false, _selectMe)
        }
    });

    const registerSetFocusFunc = useCallback((theFunc) => {
        setFocusFunc.current = theFunc;
    }, []);

    function scrollMeIntoView() {
        let my_element = elRef.current;
        let outer_element = my_element.parentNode.parentNode;
        let scrolled_element = my_element.parentNode;
        let outer_height = outer_element.offsetHeight;
        let distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
        if (distance_from_top > outer_height - 35) {
            let distance_to_move = distance_from_top - .5 * outer_height;
            outer_element.scrollTop += distance_to_move
        } else if (distance_from_top < 0) {
            let distance_to_move = .25 * outer_height - distance_from_top;
            outer_element.scrollTop -= distance_to_move
        }
    }

    function executeEmbeddedScripts() {
        if (props.output_text != last_output_text.current) {  // to avoid doubles of bokeh images
            last_output_text.current = props.output_text;
            let scripts = $("#" + props.unique_id + " .log-code-output script").toArray();
            for (let script of scripts) {
                // noinspection EmptyCatchBlockJS,UnusedCatchParameterJS
                try {
                    window.eval(script.text)
                } catch (e) {

                }
            }
        }
    }

    function makeTablesSortable() {
        let tables = $("#" + props.unique_id + " table.sortable").toArray();
        for (let table of tables) {
            sorttable.makeSortable(table)
        }
    }

    function _stopMe() {
        _stopMySpinner();
        postWithCallback(props.main_id, "stop_console_code", {"console_id": props.unique_id}, null, null, props.main_id)
    }

    function _showMySpinner(callback = null) {
        props.setConsoleItemValue(props.unique_id, "show_spinner", true, callback)
    }

    function _stopMySpinner() {
        props.setConsoleItemValue(props.unique_id, "show_spinner", false)
    }

    const _handleChange = useCallback((new_code) => {
        props.setConsoleItemValue(props.unique_id, "console_text", new_code)
    }, []);

    function _handleSummaryTextChange(value) {
        props.setConsoleItemValue(props.unique_id, "summary_text", value)
    }

    function _toggleShrink() {
        props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
    }

    function _deleteMe() {
        if (props.show_spinner) {
            _stopMe()
        }
        props.handleDelete(props.unique_id)
    }

    function _clearOutput(callback = null) {
        props.setConsoleItemValue(props.unique_id, "output_text", "", callback)
    }

    const _extraKeys = useMemo(() => {
        return {
            'Ctrl-Enter': () => props.runCodeItem(props.unique_id, true),
            'Cmd-Enter': () => props.runCodeItem(props.unique_id, true),
            'Ctrl-C': props.addNewCodeItem,
            'Ctrl-T': props.addNewTextItem
        }
    }, []);

    function _getFirstLine() {
        let re = /^(.*)$/m;
        if (props.console_text == "") {
            return "empty text cell"
        } else {
            return re.exec(props.console_text)[0]
        }
    }

    function _copyMe() {
        props.copyCell(props.unique_id)
    }

    function _pasteCell() {
        props.pasteCell(props.unique_id)
    }

    function _selectMe(e = null, callback = null) {
        props.selectConsoleItem(props.unique_id, e, callback)
    }

    function _addBlankText() {
        _selectMe(null, () => {
            props.addNewTextItem()
        })
    }

    function _addBlankDivider() {
        _selectMe(null, () => {
            props.addNewDividerItem()
        })
    }

    function _addBlankCode() {
        _selectMe(null, () => {
            props.addNewCodeItem()
        })
    }

    function renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                {!props.show_spinner &&
                    <MenuItem icon="play"
                              intent="success"
                              onClick={() => {
                                  props.runCodeItem(props.unique_id)
                              }}
                              text="Run Cell"/>
                }
                {props.show_spinner &&
                    <MenuItem icon="stop"
                              intent="danger"
                              onClick={_stopMe}
                              text="Stop Cell"/>
                }
                <MenuDivider/>
                <MenuItem icon="new-text-box"
                          onClick={_addBlankText}
                          text="New Text Cell"/>
                <MenuItem icon="code"
                          onClick={_addBlankCode}
                          text="New Code Cell"/>
                <MenuItem icon="header"
                          onClick={_addBlankDivider}
                          text="New Section"/>
                <MenuDivider/>
                <MenuItem icon="duplicate"
                          onClick={_copyMe}
                          text="Copy Cell"/>
                <MenuItem icon="clipboard"
                          onClick={_pasteCell}
                          text="Paste Cells"/>
                <MenuDivider/>
                <MenuItem icon="trash"
                          onClick={_deleteMe}
                          intent="danger"
                          text="Delete Cell"/>
                <MenuItem icon="clean"
                          intent={"warning"}
                          onClick={() => {
                              _clearOutput()
                          }}
                          text="Clear Output"/>
            </Menu>
        );
    }

    function _consoleItemClick(e) {
        _selectMe(e);
        e.stopPropagation()
    }

    const _handleFocus = useCallback(() => {
        if (!props.am_selected) {
            _selectMe()
        }
    }, []);

    let panel_style = props.am_shrunk ? "log-panel log-panel-invisible" : "log-panel log-panel-visible";
    if (props.am_selected) {
        panel_style += " selected"
    }
    if (props.in_section) {
        panel_style += " in-section"
    }
    let output_dict = {__html: props.output_text};
    let spinner_val = props.running ? null : 0;
    let code_container_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
    if (props.in_section) {
        code_container_width -= SECTION_INDENT / 2
    }
    return (
        <ContextMenu content={renderContextMenu()}>
            <div className={panel_style + " d-flex flex-row"}
                 ref={elRef}
                 onClick={_consoleItemClick} id={props.unique_id}>
                <div className="button-div shrink-expand-div d-flex flex-row">
                    <Shandle dragHandleProps={props.dragHandleProps}/>
                    {!props.am_shrunk &&
                        <GlyphButton icon="chevron-down"
                                     handleClick={_toggleShrink}/>
                    }
                    {props.am_shrunk &&
                        <GlyphButton icon="chevron-right"
                                     style={{marginTop: 5}}
                                     handleClick={_toggleShrink}/>
                    }
                </div>
                {props.am_shrunk &&
                    <Fragment>
                        <EditableText
                            value={props.summary_text ? props.summary_text : _getFirstLine()}
                            onChange={_handleSummaryTextChange}
                            className="log-panel-summary code-panel-summary"/>
                        <div className="button-div d-flex flex-row">
                            <GlyphButton handleClick={_deleteMe}
                                         intent="danger"
                                         tooltip="Delete this item"
                                         style={{marginLeft: 10, marginRight: 66}}
                                         icon="trash"/>
                        </div>
                    </Fragment>

                }
                {!props.am_shrunk &&
                    <Fragment>
                        <div className="d-flex flex-column" style={{width: "100%"}}>
                            <div className="d-flex flex-row">
                                <div className="log-panel-body d-flex flex-row console-code">
                                    <div className="button-div d-flex pr-1">
                                        {!props.show_spinner &&
                                            <GlyphButton handleClick={() => {
                                                props.runCodeItem(props.unique_id)
                                            }}
                                                         intent="success"
                                                         tooltip="Execute this item"
                                                         icon="play"/>
                                        }
                                        {props.show_spinner &&
                                            <GlyphButton handleClick={_stopMe}
                                                         intent="danger"
                                                         tooltip="Stop this item"
                                                         icon="stop"/>
                                        }
                                    </div>
                                    <ReactCodemirror handleChange={_handleChange}
                                                     handleFocus={_handleFocus}
                                                     registerSetFocusFunc={registerSetFocusFunc}
                                                     am_selected={props.am_selected}
                                                     readOnly={false}
                                                     show_line_numbers={true}
                                                     code_content={props.console_text}
                                                     extraKeys={_extraKeys}
                                                     search_term={props.search_string}
                                                     code_container_width={code_container_width}
                                                     saveMe={null}/>
                                    <div className="button-div d-flex flex-row">
                                        <GlyphButton handleClick={_deleteMe}
                                                     intent="danger"
                                                     tooltip="Delete this item"
                                                     style={{marginLeft: 10, marginRight: 0}}
                                                     icon="trash"/>
                                        <GlyphButton handleClick={() => {
                                            _clearOutput()
                                        }}
                                                     intent="warning"
                                                     tooltip="Clear this item's output"
                                                     style={{marginLeft: 10, marginRight: 0}}
                                                     icon="clean"/>
                                    </div>
                                </div>
                                {!props.show_spinner &&
                                    <div className='execution-counter'>[{String(props.execution_count)}]</div>
                                }
                                {props.show_spinner &&
                                    <div style={{marginTop: 10, marginRight: 22}}>
                                        <Spinner size={13} value={spinner_val}/>
                                    </div>
                                }
                            </div>
                            < div className='log-code-output' dangerouslySetInnerHTML={output_dict}/>
                        </div>

                    </Fragment>
                }
            </div>
        </ContextMenu>
    )
}

ConsoleCodeItem = memo(ConsoleCodeItem);

ConsoleCodeItem.propTypes = {
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

ConsoleCodeItem.defaultProps = {
    summary_text: null
};

function ResourceLinkButton(props) {
    const my_view = useRef(null);

    useConstructor(() => {
        my_view.current = view_views(false)[props.res_type];
        if (window.in_context) {
            const re = new RegExp("/$");
            my_view.current = my_view.current.replace(re, "_in_context");
        }
    });

    function _goToLink() {
        if (window.in_context) {
            postAjaxPromise($SCRIPT_ROOT + my_view.current, {
                context_id: window.context_id,
                resource_name: props.res_name
            })
                .then(props.handleCreateViewer)
                .catch(doFlash);
        } else {
            window.open($SCRIPT_ROOT + my_view.current + props.res_name)
        }
    }

    return (
        <ButtonGroup className="link-button-group">
            <Button small={true}
                    text={props.res_name}
                    icon={icon_dict[props.res_type]}
                    minimal={true}
                    onClick={_goToLink}/>
            <Button small={true}
                    icon="small-cross"
                    minimal={true}
                    onClick={(e) => {
                        props.deleteMe(props.my_index);
                        e.stopPropagation()
                    }}
            />
        </ButtonGroup>
    )
}

ResourceLinkButton = memo(ResourceLinkButton);

ResourceLinkButton.propTypes = {
    res_type: PropTypes.string,
    res_name: PropTypes.string,
    deleteMe: PropTypes.func
};

const text_item_update_props = ["am_shrunk", "set_focus", "serach_string", "am_selected", "show_markdown",
    "in_section", "summary_text", "console_text", "console_available_width", "links"];

function ConsoleTextItem(props) {
    const elRef = useRef(null);
    const am_selected_previous = useRef(false);
    const setFocusFunc = useRef(null);

    useEffect(() => {
        if (props.am_selected && !am_selected_previous.current && elRef && elRef.current) {
            scrollMeIntoView()
        }
        am_selected_previous.current = props.am_selected;
        if (props.set_focus) {
            if (props.show_markdown) {
                _hideMarkdown()
            } else if (setFocusFunc.current) {
                setFocusFunc.current();
                props.setConsoleItemValue(props.unique_id, "set_focus", false, _selectMe)
            }

        }
    });

    const registerSetFocusFunc = useCallback((theFunc) => {
        setFocusFunc.current = theFunc;
    }, []);

    function scrollMeIntoView() {
        let my_element = elRef.current;
        let outer_element = my_element.parentNode.parentNode;
        let scrolled_element = my_element.parentNode;
        let outer_height = outer_element.offsetHeight;
        let distance_from_top = my_element.offsetTop - outer_element.scrollTop - scrolled_element.offsetTop;
        if (distance_from_top > (outer_height - 35)) {
            let distance_to_move = distance_from_top - .5 * outer_height;
            outer_element.scrollTop += distance_to_move
        } else if (distance_from_top < 0) {
            let distance_to_move = .25 * outer_height - distance_from_top;
            outer_element.scrollTop -= distance_to_move
        }
    }

    function hasOnlyWhitespace() {
        return !props.console_text.trim().length
    }

    function _showMarkdown() {
        props.setConsoleItemValue(props.unique_id, "show_markdown", true);
    }

    const _toggleMarkdown = useCallback(() => {
        if (props.show_markdown) {
            _hideMarkdown()
        } else {
            _showMarkdown()
        }
    }, [props.show_markdown]);

    function _hideMarkdown() {
        props.setConsoleItemValue(props.unique_id, "show_markdown", false);
    }

    const _handleChange = useCallback((new_text) => {
        props.setConsoleItemValue(props.unique_id, "console_text", new_text)
    }, []);

    const _clearForceSync = useCallback(() => {
        props.setConsoleItemValue(props.unique_id, "force_sync_to_prop", false)
    }, []);

    function _handleSummaryTextChange(value) {
        props.setConsoleItemValue(props.unique_id, "summary_text", value)
    }

    function _toggleShrink() {
        props.setConsoleItemValue(props.unique_id, "am_shrunk", !props.am_shrunk);
    }

    function _deleteMe() {
        props.handleDelete(props.unique_id)
    }

    function _handleKeyDown(event) {
        if (event.key == "Tab") {
            props.goToNextCell(props.unique_id);
            event.preventDefault()
        }
    }

    function _gotEnter() {
        props.goToNextCell(props.unique_id);
        _showMarkdown();
    }

    function _getFirstLine() {
        let re = /^(.*)$/m;
        if (props.console_text == "") {
            return "empty text cell"
        } else {
            return re.exec(props.console_text)[0]
        }

    }

    function _copyMe() {
        props.copyCell(props.unique_id)
    }

    function _pasteCell() {
        props.pasteCell(props.unique_id)
    }

    function _selectMe(e = null, callback = null) {
        props.selectConsoleItem(props.unique_id, e, callback)
    }

    function _insertResourceLink() {
        showSelectResourceDialog("cancel", "insert link", (result) => {
            let new_links = [...props.links];
            new_links.push({res_type: result.type, res_name: result.selected_resource});
            props.setConsoleItemValue(props.unique_id, "links", new_links)
        })
    }

    function _deleteLinkButton(index) {
        let new_links = _.cloneDeep(props.links);
        new_links.splice(index, 1);
        let self = this;
        props.setConsoleItemValue(props.unique_id, "links", new_links, () => {
            console.log("i am here with nlinks " + String(props.links.length))
        });

    }

    function _addBlankText() {
        _selectMe(null, () => {
            props.addNewTextItem()
        })
    }

    function _addBlankDivider() {
        _selectMe(null, () => {
            props.addNewDividerItem()
        })
    }

    function _addBlankCode() {
        _selectMe(null, () => {
            props.addNewCodeItem()
        })
    }

    function renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return (
            <Menu>
                <MenuItem icon="paragraph"
                          intent="success"
                          onClick={_showMarkdown}
                          text="Show Markdown"/>
                <MenuDivider/>
                <MenuItem icon="new-text-box"
                          onClick={_addBlankText}
                          text="New Text Cell"/>
                <MenuItem icon="code"
                          onClick={_addBlankCode}
                          text="New Code Cell"/>
                <MenuItem icon="header"
                          onClick={_addBlankDivider}
                          text="New Section"/>
                <MenuDivider/>
                <MenuItem icon="link"
                          onClick={_insertResourceLink}
                          text="Insert ResourceLink"/>
                <MenuItem icon="duplicate"
                          onClick={_copyMe}
                          text="Copy Cell"/>
                <MenuItem icon="clipboard"
                          onClick={_pasteCell}
                          text="Paste Cells"/>
                <MenuDivider/>
                <MenuItem icon="trash"
                          onClick={_deleteMe}
                          intent="danger"
                          text="Delete Cell"/>
            </Menu>
        );
    }

    function _consoleItemClick(e) {
        _selectMe(e);
        e.stopPropagation()
    }

    const _handleFocus = useCallback(() => {
        if (!props.am_selected) {
            _selectMe()
        }
    }, []);

    function _setCMObject(cmobject) {
        cmobject.current = cmobject;
        if (props.set_focus) {
            cmobject.current.focus();
            cmobject.current.setCursor({line: 0, ch: 0});
            props.setConsoleItemValue(props.unique_id, "set_focus", false, _selectMe)
        }
        if (cmobject.current != null) {
            cmobject.current.on("focus", () => {
                    props.setFocus(props.unique_id, _selectMe)
                }
            );
            cmobject.current.on("blur", () => {
                props.setFocus(null)
            })
        }
    }

    const _extraKeys = useMemo(() => {
        return {
            'Ctrl-Enter': () => _gotEnter(),
            'Cmd-Enter': () => _gotEnter(),
            'Ctrl-C': props.addNewCodeItem,
            'Ctrl-T': props.addNewTextItem
        }
    }, []);

    let really_show_markdown = hasOnlyWhitespace() && props.links.length == 0 ? false : props.show_markdown;
    var converted_markdown;
    if (really_show_markdown) {
        converted_markdown = mdi.render(props.console_text)
    }

    let converted_dict = {__html: converted_markdown};
    let panel_class = props.am_shrunk ? "log-panel log-panel-invisible text-log-item" : "log-panel log-panel-visible text-log-item";
    if (props.am_selected) {
        panel_class += " selected"
    }
    if (props.in_section) {
        panel_class += " in-section"
    }
    let gbstyle = {marginLeft: 1};
    let body_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
    let self = this;
    let link_buttons = props.links.map((link, index) =>
        <ResourceLinkButton key={index}
                            my_index={index}
                            handleCreateViewer={props.handleCreateViewer}
                            deleteMe={_deleteLinkButton}
                            res_type={link.res_type}
                            res_name={link.res_name}/>
    );
    let code_container_width = props.console_available_width - BUTTON_CONSUMED_SPACE;
    if (props.in_section) {
        code_container_width -= SECTION_INDENT / 2
    }
    return (
        <ContextMenu content={renderContextMenu()}>
            <div className={panel_class + " d-flex flex-row"} onClick={_consoleItemClick}
                 ref={elRef} id={props.unique_id} style={{marginBottom: 10}}>
                <div className="button-div shrink-expand-div d-flex flex-row">
                    <Shandle dragHandleProps={props.dragHandleProps}/>
                    {!props.am_shrunk &&
                        <GlyphButton icon="chevron-down"
                                     handleClick={_toggleShrink}/>
                    }
                    {props.am_shrunk &&
                        <GlyphButton icon="chevron-right"
                                     style={{marginTop: 5}}
                                     handleClick={_toggleShrink}/>
                    }
                </div>
                {props.am_shrunk &&
                    <Fragment>
                        <EditableText
                            value={props.summary_text ? props.summary_text : _getFirstLine()}
                            onChange={_handleSummaryTextChange}
                            className="log-panel-summary"/>
                        <div className="button-div d-flex flex-row">
                            <GlyphButton handleClick={_deleteMe}
                                         intent="danger"
                                         tooltip="Delete this item"
                                         style={{marginLeft: 10, marginRight: 66}}
                                         icon="trash"/>
                        </div>
                    </Fragment>
                }
                {!props.am_shrunk &&
                    <div className="d-flex flex-column" style={{width: "100%"}}>
                        <div className="log-panel-body text-box d-flex flex-row">
                            <div className="button-div d-inline-flex pr-1">
                                <GlyphButton handleClick={_toggleMarkdown}
                                             intent="success"
                                             tooltip="Convert to/from markdown"
                                             icon="paragraph"/>
                            </div>
                            <div className="d-flex flex-column">
                                {!really_show_markdown &&
                                    <Fragment>
                                        <ReactCodemirror handleChange={_handleChange}
                                                         am_selected={props.am_selected}
                                                         readOnly={false}
                                                         handleFocus={_handleFocus}
                                                         registerSetFocusFunc={registerSetFocusFunc}
                                                         show_line_numbers={false}
                                                         soft_wrap={true}
                                                         sync_to_prop={false}
                                                         force_sync_to_prop={props.force_sync_to_prop}
                                                         clear_force_sync={_clearForceSync}
                                                         mode="markdown"
                                                         code_content={props.console_text}
                                                         extraKeys={_extraKeys}
                                                         search_term={props.search_string}
                                                         code_container_width={code_container_width}
                                                         saveMe={null}/>
                                    </Fragment>
                                }
                                {really_show_markdown && !hasOnlyWhitespace() &&
                                    <div className="text-panel-output"
                                         onDoubleClick={_hideMarkdown}
                                         style={{width: body_width, padding: 9}}
                                         dangerouslySetInnerHTML={converted_dict}/>
                                }
                                {link_buttons}
                            </div>

                            <div className="button-div d-flex flex-row">
                                <GlyphButton handleClick={_deleteMe}
                                             intent="danger"
                                             tooltip="Delete this item"
                                             style={{marginLeft: 10, marginRight: 66}}
                                             icon="trash"/>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </ContextMenu>
    )
}

ConsoleTextItem = memo(ConsoleTextItem);

ConsoleTextItem.propTypes = {
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

ConsoleTextItem.defaultProps = {
    force_sync_to_prop: false,
    summary_text: null,
    links: []
};

const all_update_props = {
    "text": text_item_update_props,
    "code": code_item_update_props,
    "fixed": log_item_update_props
};




