

import React from "react";
import PropTypes from 'prop-types';

import { Icon, Card, EditableText, Spinner, TextArea } from "@blueprintjs/core";
import { Menu, MenuItem } from "@blueprintjs/core";

// The next line is an ugly workaround
// See blueprintjs issue 3891
import { ContextMenuTarget } from '@blueprintjs/core/lib/esnext/components/context-menu/contextMenuTarget.js';
import { SortableHandle, SortableElement } from 'react-sortable-hoc';
import markdownIt from 'markdown-it';
import 'markdown-it-latex/dist/index.css';
import markdownItLatex from 'markdown-it-latex';
const mdi = markdownIt({ html: true });
mdi.use(markdownItLatex);

import { GlyphButton } from "./blueprint_react_widgets.js";
import { ReactCodemirror } from "./react-codemirror.js";
import { SortableComponent } from "./sortable_container.js";
import { KeyTrap } from "./key_trap.js";
import { postWithCallback } from "./communication_react.js";
import { doFlash } from "./toaster.js";
import { doBinding, arrayMove } from "./utilities_react.js";
import { showConfirmDialogReact, showSelectResourceDialog } from "./modal_react.js";

export { ConsoleComponent };

const MAX_CONSOLE_WIDTH = 1800;
const BUTTON_CONSUMED_SPACE = 203;

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
            show_console_error_log: false
        };
        this.pseudo_tile_id = null;
    }

    componentDidMount() {
        this.setState({ "mounted": true });
        // It is necessary to delete and remake these callbacks
        // If I dont delete I end up with duplicatesSelectList
        // If I just keep the original one then I end up something with a handler linked
        // to an earlier state
        this.props.tsocket.socket.off("console-message");
        this.props.tsocket.socket.on("console-message", this._handleConsoleMessage);
    }

    _createTextEntry(unique_id, summary_text) {
        return {
            unique_id: unique_id,
            type: "text",
            am_shrunk: false,
            summary_text: summary_text,
            console_text: "",
            show_markdown: false
        };
    }

    addConsoleText(the_text) {
        let self = this;
        postWithCallback("host", "print_text_area_to_console", { "console_text": the_text, "user_id": window.user_id, "main_id": window.main_id }, function (data) {
            if (!data.success) {
                doFlash(data);
            }
        });
    }

    _addBlankText() {
        this.addConsoleText("");
    }

    _insertTextInCell(the_text) {
        let unique_id = this.state.console_item_saved_focus;
        let entry = this.get_console_item_entry(unique_id);
        this._setConsoleItemValue(unique_id, "console_text", entry.console_text + the_text);
    }

    _copyCell(unique_id = null) {
        if (!unique_id) {
            unique_id = this.state.console_item_saved_focus;
            if (!unique_id) return;
        }
        let entry = this.get_console_item_entry(unique_id);
        const result_dict = {
            "main_id": window.main_id,
            "console_item": entry,
            "user_id": window.user_id
        };
        postWithCallback("host", "copy_console_cell", result_dict);
    }

    _pasteCell(unique_id = null) {
        postWithCallback("host", "get_copied_console_cell", { user_id: window.user_id }, data => {
            if (!data.success) {
                doFlash(data);
            } else {
                this._addConsoleEntry(data.console_item, true, false, unique_id);
            }
        });
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
        };
        function build_link(type, selected_resource) {
            return `[\`${selected_resource}\`](${type_paths[type]}/${selected_resource})`;
        }
        showSelectResourceDialog("cancel", "insert link", result => {
            this._insertTextInCell(build_link(result.type, result.selected_resource));
        });
    }

    _addBlankCode(e) {
        this._addCodeArea("");
    }

    _addCodeArea(the_text) {
        let self = this;
        postWithCallback("host", "print_code_area_to_console", { "console_text": the_text, "user_id": window.user_id, "main_id": window.main_id }, function (data) {
            if (!data.success) {
                doFlash(data);
            }
        });
    }

    _resetConsole() {
        let new_console_items = [];
        for (let entry of this.props.console_items) {
            if (entry.type != "code") {
                new_console_items.push(entry);
            } else {
                let new_entry = Object.assign({}, entry);
                new_entry.output_text = "";
                new_entry.execution_count = 0;
                new_console_items.push(new_entry);
            }
        }
        this.props.setMainStateValue("console_items", new_console_items);
        postWithCallback(window.main_id, "clear_console_namespace", {});
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
            this.setState({ "show_console_error_log": false });
        } else {
            if (self.pseudo_tile_id == null) {
                postWithCallback(window.main_id, "get_pseudo_tile_id", {}, function (res) {
                    self.pseudo_tile_id = res.pseudo_tile_id;
                    if (self.pseudo_tile_id == null) {
                        self.setState({ "console_error_log_text": "pseudo-tile is initializing..." }, () => {
                            this.setState({ "show_console_error_log": true });
                        });
                    } else {
                        postWithCallback("host", "get_container_log", { "container_id": self.pseudo_tile_id }, function (res) {
                            let log_text = res.log_text;
                            if (log_text == "") {
                                log_text = "Got empty result. The pseudo-tile is probably starting up.";
                            }
                            self.setState({ "console_error_log_text": log_text }, () => {
                                self.setState({ "show_console_error_log": true });
                            });
                        });
                    }
                });
            } else {
                postWithCallback("host", "get_container_log", { "container_id": self.pseudo_tile_id }, function (res) {
                    self.setState({ "console_error_log_text": res.log_text }, () => {
                        self.setState({ "show_console_error_log": true });
                    });
                });
            }
        }
    }

    _toggleMainLog() {
        let self = this;
        if (this.state.show_console_error_log) {
            this.setState({ "show_console_error_log": false });
        } else {
            postWithCallback("host", "get_container_log", { "container_id": window.main_id }, function (res) {
                self.setState({ "console_error_log_text": res.log_text }, () => {
                    self.setState({ "show_console_error_log": true });
                });
            });
        }
    }

    _setFocusedItem(unique_id) {
        if (unique_id == null) {
            this.setState({ console_item_with_focus: unique_id });
        } else {
            this.setState({ console_item_with_focus: unique_id, console_item_saved_focus: unique_id });
        }
    }

    _zoomConsole() {
        this.props.setMainStateValue("console_is_zoomed", true);
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
        this.props.setMainStateValue("show_exports_pane", !this.props.show_exports_pane);
    }

    _setConsoleItemValue(unique_id, field, value, callback = null) {
        let entry = this.get_console_item_entry(unique_id);
        entry[field] = value;
        this.replace_console_item_entry(unique_id, entry, callback);
    }

    replace_console_item_entry(unique_id, new_entry, callback = null) {
        let new_console_items = [...this.props.console_items];
        let cindex = this._consoleItemIndex(unique_id);
        new_console_items.splice(cindex, 1, new_entry);
        this.props.setMainStateValue("console_items", new_console_items, callback);
    }

    get_console_item_entry(unique_id) {
        return Object.assign({}, this.props.console_items[this._consoleItemIndex(unique_id)]);
    }

    _consoleItemIndex(unique_id) {
        let counter = 0;
        for (let entry of this.props.console_items) {
            if (entry.unique_id == unique_id) {
                return counter;
            }
            ++counter;
        }
        return -1;
    }

    _resortConsoleItems({ oldIndex, newIndex }) {
        let old_console_items = [...this.props.console_items];
        let new_console_items = arrayMove(old_console_items, oldIndex, newIndex);
        this.props.setMainStateValue("console_items", new_console_items);
    }

    _goToNextCell(unique_id) {
        let next_index = this._consoleItemIndex(unique_id) + 1;
        if (next_index == this.props.console_items.length) return;
        let next_id = this.props.console_items[next_index].unique_id;
        this._setConsoleItemValue(next_id, "set_focus", true);
    }

    _closeConsoleItem(unique_id) {
        let cindex = this._consoleItemIndex(unique_id);
        let new_console_items = [...this.props.console_items];
        new_console_items.splice(cindex, 1);
        this.props.setMainStateValue("console_items", new_console_items);
    }

    _addConsoleEntry(new_entry, force_open = true, set_focus = false, unique_id = null) {
        new_entry.set_focus = set_focus;
        let insert_index;
        if (unique_id) {
            insert_index = this._consoleItemIndex(unique_id) + 1;
        } else if (this.state.console_item_saved_focus == null) {
            insert_index = this.props.console_items.length;
        } else {
            insert_index = this._consoleItemIndex(this.state.console_item_saved_focus) + 1;
        }
        let new_console_items = [...this.props.console_items];
        new_console_items.splice(insert_index, 0, new_entry);
        this.props.setMainStateValue("console_items", new_console_items);
        if (force_open) {
            this.props.setMainStateValue("console_is_shrunk", false);
        }
    }

    _stopConsoleSpinner(data) {
        let new_entry = this.get_console_item_entry(data.console_id);
        new_entry.show_spinner = false;
        new_entry.execution_count = data.execution_count;
        this.replace_console_item_entry(data.console_id, new_entry);
    }

    _appendConsoleItemOutput(data) {
        let current = this.get_console_item_entry(data.console_id).output_text;
        if (current != "") {
            current += "<br>";
        }
        this._setConsoleItemValue(data.console_id, "output_text", current + data.message);
    }

    _handleConsoleMessage(data) {
        let self = this;
        let handlerDict = {
            consoleLog: data => self._addConsoleEntry(data.message, data.force_open),
            stopConsoleSpinner: this._stopConsoleSpinner,
            consoleCodePrint: this._appendConsoleItemOutput
        };
        handlerDict[data.console_message](data);
    }

    _bodyHeight() {
        if (this.state.mounted) {
            return this.props.console_available_height - $(this.header_ref.current).outerHeight() - 2;
        } else {
            return this.props.console_available_height - 75;
        }
    }

    _bodyWidth() {
        if (this.props.console_available_width > MAX_CONSOLE_WIDTH) {
            return MAX_CONSOLE_WIDTH;
        } else {
            return this.props.console_available_width;
        }
    }

    renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return React.createElement(
            Menu,
            null,
            React.createElement(MenuItem, { icon: "new-text-box",
                onClick: this._addBlankText,
                text: "New Text Cell" }),
            React.createElement(MenuItem, { icon: "code",
                onClick: this._addBlankCode,
                text: "New Code Cell" }),
            React.createElement(MenuItem, { icon: "clipboard",
                onClick: () => {
                    this._pasteCell();
                },
                text: "Paste Cell" }),
            React.createElement(Menu.Divider, null),
            React.createElement(MenuItem, { icon: "reset",
                onClick: this._resetConsole,
                intent: "warning",
                text: "Clear output and reset" }),
            React.createElement(MenuItem, { icon: "trash",
                onClick: this._clearConsole,
                intent: "danger",
                text: "Erase everything" })
        );
    }

    _glif_text(show_glif_text, txt) {
        if (show_glif_text) {
            return txt;
        }
        return null;
    }

    render() {
        let gbstyle = { marginLeft: 1, marginTop: 2 };
        let console_class = this.props.console_is_shrunk ? "am-shrunk" : "not-shrunk";
        if (this.props.console_is_zoomed) {
            console_class = "am-zoomed";
        }
        let outer_style = Object.assign({}, this.props.style);
        outer_style.width = this._bodyWidth();
        let show_glif_text = outer_style.width > 800;
        let header_style = {};
        if (!this.props.shrinkable) {
            header_style["paddingLeft"] = 10;
        }
        return React.createElement(
            Card,
            { id: "console-panel", className: console_class, elevation: 2, style: outer_style },
            React.createElement(
                "div",
                { className: "d-flex flex-column justify-content-around" },
                React.createElement(
                    "div",
                    { id: "console-heading",
                        ref: this.header_ref,
                        style: header_style,
                        className: "d-flex flex-row justify-content-between" },
                    React.createElement(
                        "div",
                        { id: "console-header-left", className: "d-flex flex-row" },
                        this.props.console_is_shrunk && this.props.shrinkable && React.createElement(GlyphButton, { handleClick: this._expandConsole,
                            style: { marginLeft: 2 },
                            icon: "chevron-right" }),
                        !this.props.console_is_shrunk && this.props.shrinkable && React.createElement(GlyphButton, { handleClick: this._shrinkConsole,
                            style: { marginLeft: 2 },
                            icon: "chevron-down" }),
                        React.createElement(GlyphButton, { extra_glyph_text: this._glif_text(show_glif_text, "text"),
                            style: gbstyle,
                            intent: "primary",
                            tooltip: "Add new text area",
                            handleClick: this._addBlankText,
                            icon: "new-text-box" }),
                        React.createElement(GlyphButton, { extra_glyph_text: this._glif_text(show_glif_text, "code"),
                            handleClick: this._addBlankCode,
                            tooltip: "Add new code area",
                            intent: "primary",
                            style: gbstyle,
                            icon: "code" }),
                        React.createElement(GlyphButton, { extra_glyph_text: this._glif_text(show_glif_text, "link"),
                            handleClick: this._insertResourceLink,
                            tooltip: "Insert a resource link",
                            intent: "primary",
                            style: gbstyle,
                            icon: "link" }),
                        React.createElement(GlyphButton, { extra_glyph_text: this._glif_text(show_glif_text, "copy"),
                            handleClick: () => {
                                this._copyCell();
                            },
                            tooltip: "Copy cell",
                            intent: "primary",
                            style: gbstyle,
                            icon: "duplicate" }),
                        React.createElement(GlyphButton, { extra_glyph_text: this._glif_text(show_glif_text, "paste"),
                            handleClick: () => {
                                this._pasteCell();
                            },
                            tooltip: "Paste cell",
                            intent: "primary",
                            style: gbstyle,
                            icon: "clipboard" }),
                        React.createElement(GlyphButton, { handleClick: this._resetConsole,
                            style: gbstyle,
                            tooltip: "Clear all output and reset namespace",
                            intent: "warning",
                            extra_glyph_text: this._glif_text(show_glif_text, "reset"),
                            icon: "reset" }),
                        React.createElement(GlyphButton, { extra_glyph_text: this._glif_text(show_glif_text, "clear"),
                            style: gbstyle,
                            tooltip: "Totally erase everything",
                            handleClick: this._clearConsole,
                            intent: "danger",
                            icon: "trash" }),
                        React.createElement(GlyphButton, { extra_glyph_text: this._glif_text(show_glif_text, "log"),
                            style: gbstyle,
                            tooltip: "Show container log for the log",
                            handleClick: this._toggleConsoleLog,
                            icon: "console" }),
                        React.createElement(GlyphButton, { extra_glyph_text: this._glif_text(show_glif_text, "main"),
                            tooltip: "Show container log for the main project container",
                            style: gbstyle,
                            handleClick: this._toggleMainLog,
                            icon: "console" })
                    ),
                    React.createElement(
                        "div",
                        { id: "console-header-right",
                            className: "d-flex flex-row" },
                        React.createElement(GlyphButton, { extra_glyph_text: this._glif_text(show_glif_text, "exports"),
                            tooltip: "Show export browser",
                            small: true,
                            className: "show-exports-but",
                            style: { marginRight: 5, marginTop: 2 },
                            handleClick: this._toggleExports,
                            icon: "variable" }),
                        !this.props.console_is_zoomed && this.props.zoomable && React.createElement(GlyphButton, { handleClick: this._zoomConsole,
                            icon: "maximize" }),
                        this.props.console_is_zoomed && this.props.zoomable && React.createElement(GlyphButton, { handleClick: this._unzoomConsole,
                            icon: "minimize" })
                    )
                )
            ),
            !this.props.console_is_shrunk && React.createElement(
                "div",
                { id: "console",
                    ref: this.body_ref,
                    style: { height: this._bodyHeight() } },
                this.state.show_console_error_log && React.createElement(
                    "pre",
                    null,
                    this.state.console_error_log_text
                ),
                !this.state.show_console_error_log && React.createElement(SortableComponent, { id: "console-items-div",
                    ElementComponent: SSuperItem,
                    key_field_name: "unique_id",
                    item_list: this.props.console_items,
                    dark_theme: this.props.dark_theme,
                    handle: ".console-sorter",
                    onSortStart: (_, event) => event.preventDefault() // This prevents Safari weirdness
                    , onSortEnd: this._resortConsoleItems,
                    setConsoleItemValue: this._setConsoleItemValue,
                    console_available_width: this._bodyWidth(),
                    execution_count: 0,
                    handleDelete: this._closeConsoleItem,
                    goToNextCell: this._goToNextCell,
                    setFocus: this._setFocusedItem,
                    addNewTextItem: this._addBlankText,
                    addNewCodeItem: this._addBlankCode,
                    copyCell: this._copyCell,
                    pasteCell: this._pasteCell,
                    insertResourceLink: this._insertResourceLink,
                    useDragHandle: true,
                    axis: "y"
                }),
                React.createElement("div", { id: "padding-div", style: { height: 500 } })
            )
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

const ConsoleComponent = ContextMenuTarget(RawConsoleComponent);

class RawSortHandle extends React.Component {

    render() {
        return React.createElement(Icon, { icon: "drag-handle-vertical",
            style: { marginLeft: 0, marginRight: 6 },
            iconSize: 20,
            className: "console-sorter" });
    }
}

const Shandle = SortableHandle(RawSortHandle);

class SuperItem extends React.Component {

    render() {
        if (this.props.type == "text") {
            return React.createElement(ConsoleTextItem, this.props);
        } else if (this.props.type == "code") {
            return React.createElement(ConsoleCodeItem, this.props);
        } else if (this.props.type == "fixed") {
            return React.createElement(LogItem, this.props);
        }
        return null;
    }
}

const SSuperItem = SortableElement(SuperItem);

class RawLogItem extends React.Component {
    constructor(props) {
        super(props);
        this.ce_summary0ref = React.createRef();
        doBinding(this, "_", RawLogItem.prototype);
        this.update_props = ["is_error", "am_shrunk", "summary_text", "console_text", "console_available_width"];
        this.update_state_vars = [];
        this.state = { selected: false };
        this.last_output_text = "";
    }

    shouldComponentUpdate(nextProps, nextState) {
        for (let prop of this.update_props) {
            if (nextProps[prop] != this.props[prop]) {
                return true;
            }
        }
        return false;
    }

    componentDidMount() {
        this.executeEmbeddedScripts();
        this.makeTablesSortable();
    }

    componentDidUpdate() {
        this.executeEmbeddedScripts();
        this.makeTablesSortable();
    }

    _toggleShrink() {
        this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }

    _deleteMe() {
        this.props.handleDelete(this.props.unique_id);
    }

    _handleSummaryTextChange(value) {
        this.props.setConsoleItemValue(this.props.unique_id, "summary_text", value);
    }

    executeEmbeddedScripts() {
        if (this.props.output_text != this.last_output_text) {
            // to avoid doubles of bokeh images
            this.last_output_text = this.props.output_text;
            let scripts = $("#" + this.props.unique_id + " .log-code-output script").toArray();
            // $("#" + this.props.unique_id + " .bk-root").html(""); // This is a kluge to deal with bokeh double images
            for (let script of scripts) {
                try {
                    window.eval(script.text);
                } catch (e) {}
            }
        }
    }

    makeTablesSortable() {
        let tables = $("#" + this.props.unique_id + " table.sortable").toArray();
        for (let table of tables) {
            sorttable.makeSortable(table);
        }
    }

    _copyMe() {
        this.props.copyCell(this.props.unique_id);
    }

    _pasteCell() {
        this.props.pasteCell(this.props.unique_id);
    }

    renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return React.createElement(
            Menu,
            null,
            React.createElement(MenuItem, { icon: "duplicate",
                onClick: this._copyMe,
                text: "Copy Cell" }),
            React.createElement(MenuItem, { icon: "clipboard",
                onClick: this._pasteCell,
                text: "Paste Cell" }),
            React.createElement(Menu.Divider, null),
            React.createElement(MenuItem, { icon: "trash",
                onClick: this._deleteMe,
                intent: "danger",
                text: "Delete Cell" })
        );
    }

    render() {
        let converted_dict = { __html: this.props.console_text };
        let panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
        if (this.props.is_error) {
            panel_class += " error-log-panel";
        }
        let body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
        return React.createElement(
            "div",
            { className: panel_class + " d-flex flex-row", id: this.props.unique_id, style: { marginBottom: 10 } },
            React.createElement(
                "div",
                { className: "button-div shrink-expand-div d-flex flex-row" },
                React.createElement(Shandle, null),
                !this.props.am_shrunk && React.createElement(GlyphButton, { icon: "chevron-down",
                    handleClick: this._toggleShrink }),
                this.props.am_shrunk && React.createElement(GlyphButton, { icon: "chevron-right",
                    style: { marginTop: 5 },
                    handleClick: this._toggleShrink })
            ),
            this.props.am_shrunk && React.createElement(EditableText, { value: this.props.summary_text,
                onChange: this._handleSummaryTextChange,
                className: "log-panel-summary" }),
            !this.props.am_shrunk && React.createElement(
                "div",
                { className: "d-flex flex-column" },
                React.createElement(
                    "div",
                    { className: "log-panel-body d-flex flex-row" },
                    React.createElement("div", { style: { marginTop: 10, marginLeft: 30, padding: 8, width: body_width, border: "1px solid #c7c7c7" },
                        dangerouslySetInnerHTML: converted_dict }),
                    React.createElement(
                        "div",
                        { className: "button-div d-flex flex-row" },
                        React.createElement(GlyphButton, { handleClick: this._deleteMe,
                            tooltip: "Delete this item",
                            style: { marginLeft: 10, marginRight: 66 },
                            intent: "danger",
                            icon: "trash" })
                    )
                )
            )
        );
    }
}

RawLogItem.propTypes = {
    unique_id: PropTypes.string,
    is_error: PropTypes.bool,
    am_shrunk: PropTypes.bool,
    summary_text: PropTypes.string,
    console_text: PropTypes.string,
    setConsoleItemValue: PropTypes.func,
    handleDelete: PropTypes.func,
    console_available_width: PropTypes.number
};

const LogItem = ContextMenuTarget(RawLogItem);

class RawConsoleCodeItem extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this, "_", RawConsoleCodeItem.prototype);
        this.cmobject = null;
        this.update_props = ["am_shrunk", "set_focus", "summary_text", "console_text", "show_spinner", "execution_count", "output_text", "console_available_width", "dark_theme"];
        this.update_state_vars = [];
        this.state = {};
        this.last_output_text = "";
    }

    shouldComponentUpdate(nextProps, nextState) {
        for (let prop of this.update_props) {
            if (nextProps[prop] != this.props[prop]) {
                return true;
            }
        }
        return false;
    }

    componentDidMount() {
        if (this.props.set_focus) {
            if (this.cmobject != null) {
                this.cmobject.focus();
                this.cm_object.setCursor({ line: 0, ch: 0 });
            }
            this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false);
        }
        let self = this;
        if (this.cmobject != null) {
            this.cmobject.on("focus", () => {
                self.props.setFocus(this.props.unique_id);
            });
            this.cmobject.on("blur", () => {
                self.props.setFocus(null);
            });
        }
        this.executeEmbeddedScripts();
        this.makeTablesSortable();
    }

    componentDidUpdate() {
        this.executeEmbeddedScripts();
        this.makeTablesSortable();
        if (this.props.set_focus) {
            if (this.cmobject != null) {
                this.cmobject.focus();
                this.cmobject.setCursor({ line: 0, ch: 0 });
            }
            this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false);
        }
    }

    executeEmbeddedScripts() {
        if (this.props.output_text != this.last_output_text) {
            // to avoid doubles of bokeh images
            this.last_output_text = this.props.output_text;
            let scripts = $("#" + this.props.unique_id + " .log-code-output script").toArray();
            // $("#" + this.props.unique_id + " .bk-root").html(""); // This is a kluge to deal with bokeh double images
            for (let script of scripts) {
                try {
                    window.eval(script.text);
                } catch (e) {}
            }
        }
    }

    makeTablesSortable() {
        let tables = $("#" + this.props.unique_id + " table.sortable").toArray();
        for (let table of tables) {
            sorttable.makeSortable(table);
        }
    }
    _runMe(go_to_next = false) {
        this._startMySpinner();
        let self = this;
        this._clearOutput();
        postWithCallback(main_id, "exec_console_code", { "the_code": this.props.console_text, "console_id": this.props.unique_id }, function () {
            if (go_to_next) {
                self.props.goToNextCell(self.props.unique_id);
            }
        });
    }

    _startMySpinner(callback = null) {
        this.props.setConsoleItemValue(this.props.unique_id, "show_spinner", true, callback);
    }

    _stoptMySpinner() {
        this.props.setConsoleItemValue(this.props.unique_id, "show_spinner", false);
    }

    _handleChange(new_code) {
        this.props.setConsoleItemValue(this.props.unique_id, "console_text", new_code);
    }

    _handleSummaryTextChange(value) {
        this.props.setConsoleItemValue(this.props.unique_id, "summary_text", value);
    }

    _toggleShrink() {
        this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }

    _deleteMe() {
        this.props.handleDelete(this.props.unique_id);
    }

    _clearOutput() {
        this.props.setConsoleItemValue(this.props.unique_id, "output_text", "");
    }

    _extraKeys() {
        let self = this;
        return {
            'Ctrl-Enter': () => self._runMe(true),
            'Cmd-Enter': () => self._runMe(true),
            'Ctrl-Alt-C': self.props.addNewCodeItem,
            'Ctrl-Alt-T': self.props.addNewTextItem
        };
    }

    _setCMObject(cmobject) {
        this.cmobject = cmobject;
    }

    _getFirstLine() {
        let re = /^(.*)$/m;
        if (this.props.console_text == "") {
            return "empty text cell";
        } else {
            return re.exec(this.props.console_text)[0];
        }
    }

    _copyMe() {
        this.props.copyCell(this.props.unique_id);
    }

    _pasteCell() {
        this.props.pasteCell(this.props.unique_id);
    }

    renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return React.createElement(
            Menu,
            null,
            React.createElement(MenuItem, { icon: "play",
                intent: "success",
                onClick: this._runMe,
                text: "Run Cell" }),
            React.createElement(Menu.Divider, null),
            React.createElement(MenuItem, { icon: "duplicate",
                onClick: this._copyMe,
                text: "Copy Cell" }),
            React.createElement(MenuItem, { icon: "clipboard",
                onClick: this._pasteCell,
                text: "Paste Cell" }),
            React.createElement(Menu.Divider, null),
            React.createElement(MenuItem, { icon: "trash",
                onClick: this._deleteMe,
                intent: "danger",
                text: "Delete Cell" }),
            React.createElement(MenuItem, { icon: "clean",
                intent: "warning",
                onClick: this._clearOutput,
                text: "Clear Output" })
        );
    }

    render() {
        let panel_style = this.props.am_shrunk ? "log-panel log-panel-invisible" : "log-panel log-panel-visible";
        let output_dict = { __html: this.props.output_text };

        return React.createElement(
            "div",
            { className: panel_style + " d-flex flex-row", id: this.props.unique_id },
            React.createElement(
                "div",
                { className: "button-div shrink-expand-div d-flex flex-row" },
                React.createElement(Shandle, null),
                !this.props.am_shrunk && React.createElement(GlyphButton, { icon: "chevron-down",
                    handleClick: this._toggleShrink }),
                this.props.am_shrunk && React.createElement(GlyphButton, { icon: "chevron-right",
                    style: { marginTop: 5 },
                    handleClick: this._toggleShrink })
            ),
            this.props.am_shrunk && React.createElement(
                "div",
                { className: "log-panel-summary code-panel-summary" },
                this._getFirstLine()
            ),
            !this.props.am_shrunk && React.createElement(
                React.Fragment,
                null,
                React.createElement(
                    "div",
                    { className: "d-flex flex-column", style: { width: "100%" } },
                    React.createElement(
                        "div",
                        { className: "d-flex flex-row" },
                        React.createElement(
                            "div",
                            { className: "log-panel-body d-flex flex-row console-code" },
                            React.createElement(
                                "div",
                                { className: "button-div d-flex pr-1" },
                                React.createElement(GlyphButton, { handleClick: this._runMe,
                                    intent: "success",
                                    tooltip: "Execute this item",
                                    icon: "play" })
                            ),
                            React.createElement(ReactCodemirror, { handleChange: this._handleChange,
                                code_content: this.props.console_text,
                                setCMObject: this._setCMObject,
                                dark_theme: this.props.dark_theme,
                                extraKeys: this._extraKeys(),
                                code_container_width: this.props.console_available_width - BUTTON_CONSUMED_SPACE,
                                saveMe: null }),
                            React.createElement(
                                "div",
                                { className: "button-div d-flex flex-row" },
                                React.createElement(GlyphButton, { handleClick: this._deleteMe,
                                    intent: "danger",
                                    tooltip: "Delete this item",
                                    style: { marginLeft: 10, marginRight: 0 },
                                    icon: "trash" }),
                                React.createElement(GlyphButton, { handleClick: this._clearOutput,
                                    intent: "warning",
                                    tooltip: "Clear this item's output",
                                    style: { marginLeft: 10, marginRight: 0 },
                                    icon: "clean" })
                            )
                        ),
                        !this.props.show_spinner && React.createElement(
                            "div",
                            { className: "execution-counter" },
                            "[",
                            String(this.props.execution_count),
                            "]"
                        ),
                        this.props.show_spinner && React.createElement(
                            "div",
                            { style: { marginTop: 10, marginRight: 22 } },
                            React.createElement(Spinner, { size: 13 })
                        )
                    ),
                    React.createElement("div", { className: "log-code-output", dangerouslySetInnerHTML: output_dict })
                )
            )
        );
    }
}

RawConsoleCodeItem.propTypes = {
    unique_id: PropTypes.string,
    am_shrunk: PropTypes.bool,
    set_focus: PropTypes.bool,
    show_spinner: PropTypes.bool,
    summary_text: PropTypes.string,
    console_text: PropTypes.string,
    output_text: PropTypes.string,
    dark_theme: PropTypes.bool,
    execution_count: PropTypes.number,
    console_available_width: PropTypes.number,
    setConsoleItemValue: PropTypes.func,
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
        this.ce_summary_ref = React.createRef();
        this.update_props = ["am_shrunk", "set_focus", "show_markdown", "summary_text", "console_text", "console_available_width"];
        this.update_state_vars = ["ce_ref"];
        this.state = { ce_ref: null };
    }

    shouldComponentUpdate(nextProps, nextState) {
        for (let prop of this.update_props) {
            if (nextProps[prop] != this.props[prop]) {
                return true;
            }
        }
        for (let state_var of this.update_state_vars) {
            if (nextState[state_var] != this.state[state_var]) {
                return true;
            }
        }
        return false;
    }

    componentDidMount() {
        if (this.props.set_focus) {
            if (this.props.show_markdown) {
                this._hideMarkdown();
            } else if (this.state.ce_ref) {
                $(this.state.ce_ref).focus();
                this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false);
            }
        }
    }

    componentDidUpdate() {
        if (this.props.set_focus) {
            if (this.props.show_markdown) {
                this._hideMarkdown();
            } else if (this.state.ce_ref) {
                $(this.state.ce_ref).focus();
            }
            this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false);
        }
    }

    get hasOnlyWhitespace() {
        return !this.props.console_text.trim().length;
    }

    _showMarkdown() {
        if (!this.hasOnlyWhitespace) {
            this.props.setConsoleItemValue(this.props.unique_id, "show_markdown", true);
        }
    }

    _toggleMarkdown() {
        if (this.props.show_markdown) {
            this._hideMarkdown();
        } else {
            this._showMarkdown();
        }
    }

    _hideMarkdown() {
        this.props.setConsoleItemValue(this.props.unique_id, "show_markdown", false);
    }

    _handleChange(event) {
        this.props.setConsoleItemValue(this.props.unique_id, "console_text", event.target.value);
    }

    _handleSummaryTextChange(value) {
        this.props.setConsoleItemValue(this.props.unique_id, "summary_text", value);
    }

    _toggleShrink() {
        this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }

    _deleteMe() {
        this.props.handleDelete(this.props.unique_id);
    }
    _handleKeyDown(event) {
        if (event.key == "Tab") {
            this.props.goToNextCell(this.props.unique_id);
            event.preventDefault();
        }
    }

    _gotEnter() {
        this.props.goToNextCell(this.props.unique_id);
        this._showMarkdown();
    }

    _notesRefHandler(the_ref) {
        this.setState({ ce_ref: the_ref });
    }

    _getFirstLine() {
        let re = /^(.*)$/m;
        if (this.props.console_text == "") {
            return "empty text cell";
        } else {
            return re.exec(this.props.console_text)[0];
        }
    }

    _copyMe() {
        this.props.copyCell(this.props.unique_id);
    }

    _pasteCell() {
        this.props.pasteCell(this.props.unique_id);
    }

    renderContextMenu() {
        // return a single element, or nothing to use default browser behavior
        return React.createElement(
            Menu,
            null,
            React.createElement(MenuItem, { icon: "paragraph",
                intent: "success",
                onClick: this._showMarkdown,
                text: "Show Markdown" }),
            React.createElement(Menu.Divider, null),
            React.createElement(MenuItem, { icon: "link",
                onClick: this.props.insertResourceLink,
                text: "Insert ResourceLink" }),
            React.createElement(MenuItem, { icon: "duplicate",
                onClick: this._copyMe,
                text: "Copy Cell" }),
            React.createElement(MenuItem, { icon: "clipboard",
                onClick: this._pasteCell,
                text: "Paste Cell" }),
            React.createElement(Menu.Divider, null),
            React.createElement(MenuItem, { icon: "trash",
                onClick: this._deleteMe,
                intent: "danger",
                text: "Delete Cell" })
        );
    }

    render() {
        let really_show_markdown = this.hasOnlyWhitespace ? false : this.props.show_markdown;
        var converted_markdown;
        if (really_show_markdown) {
            // converted_markdown = this.converter.makeHtml(this.props.console_text);
            converted_markdown = mdi.render(this.props.console_text);
        }
        let key_bindings = [[["ctrl+enter", "command+enter"], this._gotEnter]];
        let converted_dict = { __html: converted_markdown };
        let panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible text-log-item" : "log-panel log-panel-visible text-log-item";
        let gbstyle = { marginLeft: 1 };
        let body_width = this.props.console_available_width - BUTTON_CONSUMED_SPACE;
        return React.createElement(
            "div",
            { className: panel_class + " d-flex flex-row", id: this.props.unique_id, style: { marginBottom: 10 } },
            React.createElement(
                "div",
                { className: "button-div shrink-expand-div d-flex flex-row" },
                React.createElement(Shandle, null),
                !this.props.am_shrunk && React.createElement(GlyphButton, { icon: "chevron-down",
                    handleClick: this._toggleShrink }),
                this.props.am_shrunk && React.createElement(GlyphButton, { icon: "chevron-right",
                    style: { marginTop: 5 },
                    handleClick: this._toggleShrink })
            ),
            this.props.am_shrunk && React.createElement(
                "div",
                { className: "log-panel-summary" },
                this._getFirstLine()
            ),
            !this.props.am_shrunk && React.createElement(
                "div",
                { className: "d-flex flex-column", style: { width: "100%" } },
                React.createElement(
                    "div",
                    { className: "log-panel-body text-box d-flex flex-row" },
                    React.createElement(
                        "div",
                        { className: "button-div d-inline-flex pr-1" },
                        React.createElement(GlyphButton, { handleClick: this._toggleMarkdown,
                            intent: "success",
                            tooltip: "Convert to/from markdown",
                            icon: "paragraph" })
                    ),
                    !really_show_markdown && React.createElement(
                        React.Fragment,
                        null,
                        React.createElement(TextArea, { value: this.props.console_text,
                            onChange: this._handleChange,
                            onKeyDown: this._handleKeyDown,
                            growVertically: true,
                            onFocus: () => this.props.setFocus(this.props.unique_id),
                            onBlur: () => this.props.setFocus(null),
                            disabled: false,
                            className: "console-text",
                            style: { width: body_width },
                            inputRef: this._notesRefHandler }),
                        React.createElement(KeyTrap, { target_ref: this.state.ce_ref, bindings: key_bindings })
                    ),
                    really_show_markdown && React.createElement("div", { className: "text-panel-output",
                        onDoubleClick: this._hideMarkdown,
                        style: { width: body_width, padding: 9 },
                        dangerouslySetInnerHTML: converted_dict }),
                    React.createElement(
                        "div",
                        { className: "button-div d-flex flex-row" },
                        React.createElement(GlyphButton, { handleClick: this._deleteMe,
                            intent: "danger",
                            tooltip: "Delete this item",
                            style: { marginLeft: 10, marginRight: 66 },
                            icon: "trash" })
                    )
                )
            )
        );
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
    handleDelete: PropTypes.func,
    goToNextCell: PropTypes.func,
    tsocket: PropTypes.object,
    setFocus: PropTypes.func
};

const ConsoleTextItem = ContextMenuTarget(RawConsoleTextItem);