
import { GlyphButton } from "./blueprint_react_widgets.js";
import { ReactCodemirror } from "./react-codemirror.js";
import { SortableComponent } from "./sortable_container.js";
import { KeyTrap } from "./key_trap.js";
import { postWithCallback } from "./communication_react.js";
import { doFlash } from "./toaster.js";

export { ConsoleComponent };

let Bp = blueprint;

class ConsoleComponent extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.header_ref = React.createRef();
        this.body_ref = React.createRef();
        this.state = {
            console_item_with_focus: null,
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

    _addBlankCode(e) {
        this._addCodeArea("");
        e.preventDefault();
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
        this.props.setMainStateValue("console_items", []);
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
        this.setState({ "console_item_with_focus": unique_id });
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
    }

    _toggleExports() {
        this.props.setMainStateValue("show_exports_pane", !this.props.show_exports_pane);
    }

    _setConsoleItemValue(unique_id, field, value) {
        let entry = this.get_console_item_entry(unique_id);
        entry[field] = value;
        this.replace_console_item_entry(unique_id, entry);
    }

    replace_console_item_entry(unique_id, new_entry) {
        let new_console_items = [...this.props.console_items];
        let cindex = this._consoleItemIndex(unique_id);
        new_console_items.splice(cindex, 1, new_entry);
        this.props.setMainStateValue("console_items", new_console_items);
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

    _resortConsoleItems(new_sort_list) {
        let new_console_items = [];
        for (let uid of new_sort_list) {
            let new_entry = this.get_console_item_entry(uid);
            new_console_items.push(new_entry);
        }
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

    _addConsoleEntry(new_entry, force_open = true, set_focus = false) {
        new_entry.set_focus = set_focus;
        let insert_index;
        if (this.state.console_item_with_focus == null) {
            insert_index = this.props.console_items.length;
        } else {
            insert_index = this._consoleItemIndex(this.state.console_item_with_focus) + 1;
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
            return this.props.console_available_height - $(this.header_ref.current).outerHeight();
        } else {
            return this.props.console_available_height - 75;
        }
    }

    render() {
        let gbstyle = { marginLeft: 1, marginTop: 1 };
        return React.createElement(
            Bp.Card,
            { id: "console-panel", elevation: 2, style: this.props.style },
            React.createElement(
                "div",
                { className: "d-flex flex-column justify-content-around" },
                React.createElement(
                    "div",
                    { id: "console-heading",
                        ref: this.header_ref,
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
                        this.props.shrinkable && React.createElement(
                            "b",
                            { style: { alignSelf: "center", marginRight: 5 } },
                            "Log"
                        ),
                        React.createElement(GlyphButton, { extra_glyph_text: "text",
                            style: gbstyle,
                            intent: "primary",
                            tooltip: "Add new text area",
                            handleClick: this._addBlankText,
                            icon: "new-text-box" }),
                        React.createElement(GlyphButton, { extra_glyph_text: "code",
                            handleClick: this._addBlankCode,
                            tooltip: "Add new code area",
                            intent: "primary",
                            style: gbstyle,
                            icon: "code" }),
                        React.createElement(GlyphButton, { handleClick: this._resetConsole,
                            style: gbstyle,
                            tooltip: "Clear all output and reset namespace",
                            intent: "warning",
                            extra_glyph_text: "reset",
                            icon: "reset" }),
                        React.createElement(GlyphButton, { extra_glyph_text: "clear",
                            style: gbstyle,
                            tooltip: "Totally erase everything",
                            handleClick: this._clearConsole,
                            intent: "danger",
                            icon: "trash" }),
                        React.createElement(GlyphButton, { extra_glyph_text: "log",
                            style: gbstyle,
                            tooltip: "Show container log for the log",
                            handleClick: this._toggleConsoleLog,
                            icon: "console" }),
                        React.createElement(GlyphButton, { extra_glyph_text: "main",
                            tooltip: "Show container log for the main project container",
                            style: gbstyle,
                            handleClick: this._toggleMainLog,
                            icon: "console" })
                    ),
                    React.createElement(
                        "div",
                        { id: "console-header-right", className: "d-flex flex-row" },
                        React.createElement(Bp.Button, { onClick: this._toggleExports,
                            style: { marginRight: 5 },
                            minimal: true,
                            small: true,
                            text: "exports" }),
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
                    style: { height: this._bodyHeight(), backgroundColor: "white" } },
                this.state.show_console_error_log && React.createElement(
                    "pre",
                    null,
                    this.state.console_error_log_text
                ),
                !this.state.show_console_error_log && React.createElement(SortableComponent, { id: "console-items-div",
                    ElementComponent: SuperItem,
                    key_field_name: "unique_id",
                    item_list: this.props.console_items,
                    handle: ".console-sorter",
                    resortFunction: this._resortConsoleItems,
                    setConsoleItemValue: this._setConsoleItemValue,
                    execution_count: 0,
                    handleDelete: this._closeConsoleItem,
                    goToNextCell: this._goToNextCell,
                    setFocus: this._setFocusedItem,
                    addNewTextItem: this._addBlankText,
                    addNewCodeItem: this._addBlankCode
                })
            )
        );
    }
}

ConsoleComponent.propTypes = {
    console_items: PropTypes.array,
    console_is_shrunk: PropTypes.bool,
    console_is_zoomed: PropTypes.bool,
    show_exports_pane: PropTypes.bool,
    setMainStateValue: PropTypes.func,
    console_available_height: PropTypes.number,
    tsocket: PropTypes.object,
    style: PropTypes.object,
    shrinkable: PropTypes.bool,
    zoomable: PropTypes.bool
};

ConsoleComponent.defaultProps = {
    style: {},
    shrinkable: true,
    zoomable: true
};

class SuperItem extends React.Component {

    render() {
        if (this.props.type == "text") {
            return React.createElement(ConsoleTextItem, this.props);
        } else if (this.props.type == "code") {
            return React.createElement(ConsoleCodeItem, this.props);
        } else if (this.props.type == "fixed") {
            return React.createElement(LogItem, this.props);
        }
    }

}

class LogItem extends React.Component {
    constructor(props) {
        super(props);
        this.ce_summary0ref = React.createRef();
        doBinding(this);
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
        let scripts = $("#" + this.props.unique_id + " .log-panel-body script").toArray();
        for (let script of scripts) {
            try {
                window.eval(script.text);
            } catch (e) {}
        }
    }

    makeTablesSortable() {
        let tables = $("#" + this.props.unique_id + " table.sortable").toArray();
        for (let table of tables) {
            sorttable.makeSortable(table);
        }
    }

    render() {
        let converted_dict = { __html: this.props.console_text };
        let panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
        if (this.props.is_error) {
            panel_class += " error-log-panel";
        }
        return React.createElement(
            "div",
            { className: panel_class + " d-flex flex-row", id: this.props.unique_id, style: { marginBottom: 10 } },
            React.createElement(
                "div",
                { className: "button-div shrink-expand-div d-flex flex-row" },
                React.createElement(Bp.Icon, { icon: "drag-handle-vertical",
                    style: { marginLeft: 0, marginRight: 6 },
                    iconSize: 20,
                    className: "console-sorter" }),
                !this.props.am_shrunk && React.createElement(GlyphButton, { icon: "chevron-down",
                    handleClick: this._toggleShrink }),
                this.props.am_shrunk && React.createElement(GlyphButton, { icon: "chevron-right",
                    handleClick: this._toggleShrink })
            ),
            this.props.am_shrunk && React.createElement(Bp.EditableText, { value: this.props.summary_text,
                onChange: this._handleSummaryTextChange,
                className: "log-panel-summary" }),
            !this.props.am_shrunk && React.createElement(
                "div",
                { className: "d-flex flex-column", style: { width: "100%" } },
                React.createElement(
                    "div",
                    { className: "log-panel-body d-flex flex-row" },
                    React.createElement("div", { style: { marginTop: 10, marginLeft: 30, padding: 8, width: "100%", border: "1px solid #c7c7c7" },
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

LogItem.propTypes = {
    unique_id: PropTypes.string,
    is_error: PropTypes.bool,
    am_shrunk: PropTypes.bool,
    summary_text: PropTypes.string,
    console_text: PropTypes.string,
    setConsoleItemValue: PropTypes.func,
    handleDelete: PropTypes.func
};

class ConsoleCodeItem extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.cmobject = null;
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
        let scripts = $("#" + this.props.unique_id + " .log-code-output script").toArray();
        for (let script of scripts) {
            try {
                window.eval(script.text);
            } catch (e) {}
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

    _startMySpinner() {
        this.props.setConsoleItemValue(this.props.unique_id, "show_spinner", true);
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

    render() {
        let panel_style = this.props.am_shrunk ? "log-panel log-panel-invisible" : "log-panel log-panel-visible";
        let output_dict = { __html: this.props.output_text };

        return React.createElement(
            "div",
            { className: panel_style + " d-flex flex-row", id: this.props.unique_id },
            React.createElement(
                "div",
                { className: "button-div shrink-expand-div d-flex flex-row" },
                React.createElement(Bp.Icon, { icon: "drag-handle-vertical",
                    style: { marginLeft: 0, marginRight: 6 },
                    iconSize: 20,
                    className: "console-sorter" }),
                !this.props.am_shrunk && React.createElement(GlyphButton, { icon: "chevron-down",
                    handleClick: this._toggleShrink }),
                this.props.am_shrunk && React.createElement(GlyphButton, { icon: "chevron-right",
                    handleClick: this._toggleShrink })
            ),
            this.props.am_shrunk && React.createElement(Bp.EditableText, { value: this.props.summary_text,
                onChange: this._handleSummaryTextChange,
                className: "log-panel-summary" }),
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
                                extraKeys: this._extraKeys(),
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
                            React.createElement(Bp.Spinner, { size: 13 })
                        )
                    ),
                    React.createElement("div", { className: "log-code-output", dangerouslySetInnerHTML: output_dict })
                )
            )
        );
    }
}

ConsoleCodeItem.propTypes = {
    unique_id: PropTypes.string,
    am_shrunk: PropTypes.bool,
    set_focus: PropTypes.bool,
    show_spinner: PropTypes.bool,
    summary_text: PropTypes.string,
    console_text: PropTypes.string,
    output_text: PropTypes.string,
    execution_count: PropTypes.number,
    setConsoleItemValue: PropTypes.func,
    handleDelete: PropTypes.func,
    addNewTextItem: PropTypes.func,
    addNewCodeItem: PropTypes.func,
    goToNextCell: PropTypes.func,
    setFocus: PropTypes.func
};

class ConsoleTextItem extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this, "_");
        this.ce_ref = null;
        this.ce_summary_ref = React.createRef();
        this.converter = new showdown.Converter();
    }

    componentDidMount() {
        if (this.props.set_focus) {
            if (this.props.show_markdown) {
                this._hideMarkdown();
            } else {
                $(this.ce_ref.current).focus();
                this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false);
            }
        }
    }

    componentDidUpdate() {
        if (this.props.set_focus) {
            if (this.props.show_markdown) {
                this._hideMarkdown();
            } else {
                $(this.ce_ref.current).focus();
                this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false);
            }
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
        this.ce_ref = the_ref;
    }

    render() {
        let really_show_markdown = this.hasOnlyWhitespace ? false : this.props.show_markdown;
        var converted_markdown;
        if (really_show_markdown) {
            converted_markdown = this.converter.makeHtml(this.props.console_text);
        }
        let key_bindings = [[["ctrl+enter", "command+enter"], this._gotEnter]];
        let converted_dict = { __html: converted_markdown };
        let panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible text-log-item" : "log-panel log-panel-visible text-log-item";
        let gbstyle = { marginLeft: 1 };
        return React.createElement(
            "div",
            { className: panel_class + " d-flex flex-row", id: this.props.unique_id, style: { marginBottom: 10 } },
            React.createElement(
                "div",
                { className: "button-div shrink-expand-div d-flex flex-row" },
                React.createElement(Bp.Icon, { icon: "drag-handle-vertical",
                    style: { marginLeft: 0, marginRight: 6 },
                    iconSize: 20,
                    className: "console-sorter" }),
                !this.props.am_shrunk && React.createElement(GlyphButton, { icon: "chevron-down",
                    handleClick: this._toggleShrink }),
                this.props.am_shrunk && React.createElement(GlyphButton, { icon: "chevron-right",
                    handleClick: this._toggleShrink })
            ),
            this.props.am_shrunk && React.createElement(Bp.EditableText, { value: this.props.summary_text,
                onChange: this._handleSummaryTextChange,
                className: "log-panel-summary" }),
            !this.props.am_shrunk && React.createElement(
                "div",
                { className: "d-flex flex-column", style: { width: "100%" } },
                React.createElement(
                    "div",
                    { className: "log-panel-body text-box d-flex flex-row" },
                    React.createElement(
                        "div",
                        { className: "button-div d-inline-flex pr-1" },
                        React.createElement(GlyphButton, { handleClick: this._showMarkdown,
                            intent: "success",
                            tooltip: "Convert to/from markdown",
                            icon: "paragraph" })
                    ),
                    !really_show_markdown && React.createElement(
                        React.Fragment,
                        null,
                        React.createElement(Bp.TextArea, { value: this.props.console_text,
                            onChange: this._handleChange,
                            onKeyDown: this._handleKeyDown,
                            growVertically: true,
                            onFocus: () => this.props.setFocus(this.props.unique_id),
                            onBlur: () => this.props.setFocus(null),
                            disabled: false,
                            className: "console-text",
                            style: {},
                            inputRef: this._notesRefHandler }),
                        React.createElement(KeyTrap, { target_ref: this.ce_ref, bindings: key_bindings })
                    ),
                    really_show_markdown && React.createElement("div", { className: "text-panel-output",
                        onClick: this._hideMarkdown,
                        style: { width: "100%", padding: 9 },
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

ConsoleTextItem.propTypes = {
    unique_id: PropTypes.string,
    am_shrunk: PropTypes.bool,
    set_focus: PropTypes.bool,
    show_markdown: PropTypes.bool,
    summary_text: PropTypes.string,
    console_text: PropTypes.string,
    setConsoleItemValue: PropTypes.func,
    handleDelete: PropTypes.func,
    goToNextCell: PropTypes.func,
    tsocket: PropTypes.object,
    setFocus: PropTypes.func
};