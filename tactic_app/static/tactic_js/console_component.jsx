
import {GlyphButton} from "./react_widgets.js";
import {ReactCodemirror} from "./react-codemirror.js";
import {SortableComponent} from "./sortable_container.js";
import {KeyTrap} from "./key_trap.js";
import {postWithCallback} from "./communication_react.js"
import {doFlash} from "./toaster.js"

export {ConsoleComponent}

var ContentEditable = react_contenteditable.default;

var Rbs = window.ReactBootstrap;

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
        this.pseudo_tile_id = null
    }

    componentDidMount(){
        this.setState({"mounted": true});
        // It is necessary to delete and remake these callbacks
        // If I dont delete I end up with duplicates
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

    _addBlankCode(e) {
        this._addCodeArea("");
        e.preventDefault()
    }

    _addCodeArea(the_text) {
        let self = this;
        postWithCallback("host", "print_code_area_to_console",
            {"console_text": the_text, "user_id": window.user_id, "main_id": window.main_id}, function (data) {
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
            }
            else {
                let new_entry = Object.assign({}, entry);
                new_entry.output_text = "";
                new_console_items.push(new_entry)
            }
        }
        this.props.setMainStateValue("console_items", new_console_items);
        postWithCallback(window.main_id, "clear_console_namespace", {})
    }

    _clearConsole() {
        this.props.setMainStateValue("console_items", []);
    }
    _toggleConsoleLog() {
        let self = this;
        if (this.state.show_console_error_log) {
            this.setState({"show_console_error_log": false})
        }
        else {
            if (self.pseudo_tile_id == null) {
                postWithCallback(window.main_id, "get_pseudo_tile_id", {}, function (res) {
                    self.pseudo_tile_id = res.pseudo_tile_id;
                    if (self.pseudo_tile_id == null) {
                        self.setState({"console_error_log_text": "pseudo-tile is initializing..."}, ()=>{
                            this.setState({"show_console_error_log": true})
                        });
                    }
                    else{
                        postWithCallback("host", "get_container_log", {"container_id": self.pseudo_tile_id}, function (res) {
                            let log_text = res.log_text;
                            if (log_text == "") {
                                log_text = "Got empty result. The pseudo-tile is probably starting up."
                            }
                            self.setState({"console_error_log_text": log_text}, ()=>{
                                self.setState({"show_console_error_log": true})
                            });
                        })
                    }
                })
            }
            else {
                postWithCallback("host", "get_container_log", {"container_id": self.pseudo_tile_id}, function (res) {
                    self.setState({"console_error_log_text": res.log_text}, () => {
                            self.setState({"show_console_error_log": true})
                        }
                    );
                })
            }
        }
    }

    _toggleMainLog () {
        let self = this;
        if (this.state.show_console_error_log) {
            this.setState({"show_console_error_log": false})
        }
        else {
            postWithCallback("host", "get_container_log", {"container_id": window.main_id}, function (res) {
                self.setState({"console_error_log_text": res.log_text}, ()=>{
                    self.setState({"show_console_error_log": true})
                });
            })
        }
    }

    _setFocusedItem(unique_id) {
        this.setState({"console_item_with_focus": unique_id})
    }

    _zoomConsole () {
        this.props.setMainStateValue("console_is_zoomed", true)
    }

    _unzoomConsole () {
        this.props.setMainStateValue("console_is_zoomed", false);
    }

    _expandConsole () {
        this.props.setMainStateValue("console_is_shrunk", false);
    }

    _shrinkConsole () {
        this.props.setMainStateValue("console_is_shrunk", true);
    }

    _toggleExports() {
        this.props.setMainStateValue("show_exports_pane", !this.props.show_exports_pane)
    }

    _setConsoleItemValue(unique_id, field, value) {
        let entry = this.get_console_item_entry(unique_id);
        entry[field] = value;
        this.replace_console_item_entry(unique_id, entry)
    }

    replace_console_item_entry(unique_id, new_entry) {
        let new_console_items = [...this.props.console_items];
        let cindex = this._consoleItemIndex(unique_id);
        new_console_items.splice(cindex, 1, new_entry);
        this.props.setMainStateValue("console_items", new_console_items)
    }

    get_console_item_entry(unique_id) {
        return Object.assign({}, this.props.console_items[this._consoleItemIndex(unique_id)])
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

    _resortConsoleItems(new_sort_list) {
        let new_console_items = [];
        for (let uid of new_sort_list) {
            let new_entry = this.get_console_item_entry(uid);
            new_console_items.push(new_entry)
        }
        this.props.setMainStateValue("console_items", new_console_items)
    }

    _goToNextCell(unique_id) {
        let next_index = this._consoleItemIndex(unique_id) + 1;
        if (next_index == this.props.console_items.length) return;
        let next_id = this.props.console_items[next_index].unique_id;
        this._setConsoleItemValue(next_id, "set_focus", true)
    }

    _closeConsoleItem(unique_id) {
        let cindex = this._consoleItemIndex(unique_id);
        let new_console_items = [...this.props.console_items];
        new_console_items.splice(cindex, 1);
        this.props.setMainStateValue("console_items", new_console_items);
    }

    _addConsoleEntry(new_entry, force_open=true, set_focus=false) {
        new_entry.set_focus = set_focus;
        let insert_index;
        if (this.state.console_item_with_focus == null) {
            insert_index = this.props.console_items.length
        }
        else {
            insert_index = this._consoleItemIndex(this.state.console_item_with_focus) + 1
        }
        let new_console_items = [... this.props.console_items];
        new_console_items.splice(insert_index, 0, new_entry);
        this.props.setMainStateValue("console_items", new_console_items);
        if (force_open) {
            this.props.setMainStateValue("console_is_shrunk", false)
        }
    }

    _stopConsoleSpinner(data) {
        let new_entry = this.get_console_item_entry(data.console_id);
        new_entry.show_spinner = false;
        new_entry.execution_count = data.execution_count;
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
            consoleLog: (data)=>self._addConsoleEntry(data.message, data.force_open),
            stopConsoleSpinner: this._stopConsoleSpinner,
            consoleCodePrint: this._appendConsoleItemOutput
        };
        handlerDict[data.console_message](data)
    }


    _bodyHeight() {
        if (this.state.mounted) {
            return this.props.console_available_height - $(this.header_ref.current).outerHeight() - 35
        }
        else {
            return this.props.console_available_height - 75
        }
    }

    render() {"unquote('#f7d66b80')"
        let butclass_short = "notclose bottom-heading-element";
        let butclass_long = "notclose bottom-heading-element bottom-heading-element-button";
        return (
            <Rbs.Card bg="light" id="console-panel" style={this.props.style}>
                <Rbs.Card.Header id="console-heading" ref={this.header_ref}
                                 className="d-flex flex-row justify-content-between">
                    <div id="console-header-left" className="d-flex flex-row  align-items-baseline">
                        {this.props.console_is_shrunk &&
                        <GlyphButton butclass={butclass_short}
                                     handleClick={this._expandConsole}
                                     style={{paddingRight: 5, paddingTop: 0}}
                                     icon_class="far fa-chevron-circle-right"/>
                        }
                        {!this.props.console_is_shrunk &&
                        <GlyphButton butclass={butclass_short}
                                     handleClick={this._shrinkConsole}
                                     style={{paddingRight: 5, paddingTop: 0}}
                                     icon_class="far fa-chevron-circle-down"/>
                        }
                        <b>Log</b>
                        <GlyphButton butclass={butclass_long}
                                     extra_glyph_text="text"
                                     handleClick={this._addBlankText}
                                     icon_class="far fa-font"/>
                        <GlyphButton butclass={butclass_long}
                                     extra_glyph_text="code"
                                     handleClick={this._addBlankCode}
                                     icon_class="far fa-terminal"/>
                        <GlyphButton butclass={butclass_long}
                                     handleClick={this._resetConsole}
                                     extra_glyph_text="reset"
                                     icon_class="far fa-sync"/>
                        <GlyphButton butclass={butclass_long}
                                     extra_glyph_text="clear"
                                     handleClick={this._clearConsole}
                                     icon_class="far fa-trash"/>
                        <GlyphButton butclass={butclass_long}
                                     extra_glyph_text="log"
                                     handleClick={this._toggleConsoleLog}
                                     icon_class="far fa-exclamation-triangle"/>
                        <GlyphButton butclass={butclass_long}
                                     extra_glyph_text="main"
                                     handleClick={this._toggleMainLog}
                                     icon_class="far fa-exclamation-triangle"/>
                    </div>
                    <div id="console-header-right" className="d-flex flex-row  align-items-baseline">
                        <button type='button'
                                className={butclass_short}
                                onClick={this._toggleExports}
                                style={{marginRight: 12}}>exports
                        </button>
                        {!this.props.console_is_zoomed &&
                        <GlyphButton butclass={butclass_short}
                                     handleClick={this._zoomConsole}
                                     icon_class="far fa-expand-alt"/>
                        }
                        {this.props.console_is_zoomed &&
                        <GlyphButton butclass={butclass_short}
                                     handleClick={this._unzoomConsole}
                                     icon_class="far fa-compress-alt"/>
                        }
                    </div>
                </Rbs.Card.Header>
                {!this.props.console_is_shrunk &&
                <Rbs.Card.Body id="console"
                               ref={this.body_ref}
                               style={{height: this._bodyHeight(), backgroundColor: "white"}}>
                    {this.state.show_console_error_log &&
                    <pre>{this.state.error_log_text}</pre>
                    }
                    {!this.state.show_console_error_log &&
                    <SortableComponent id="console-items-div"
                                       ElementComponent={SuperItem}
                                       key_field_name="unique_id"
                                       item_list={this.props.console_items}
                                       handle=".console-sorter"
                                       resortFunction={this._resortConsoleItems}
                                       setConsoleItemValue={this._setConsoleItemValue}
                                       execution_count={0}
                                       handleDelete={this._closeConsoleItem}
                                       goToNextCell={this._goToNextCell}
                                       setFocus={this._setFocusedItem}
                                       addNewTextItem={this._addBlankText}
                                       addNewCodeItem={this._addBlankCode}
                    />
                    }
                </Rbs.Card.Body>
                }
            </Rbs.Card>
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
    style: PropTypes.object
};

 ConsoleComponent.defaultProps = {
     style: {}
 };

class SuperItem extends React.Component {

    render() {
        if (this.props.type == "text") {
            return <ConsoleTextItem {...this.props}/>
        }
         else if (this.props.type == "code") {
             return <ConsoleCodeItem {...this.props}/>
        }
         else if (this.props.type == "fixed") {
             return <LogItem {...this.props}/>
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
        this.executeEmbeddedScripts()
    }

    componentDidUpdate() {
        this.executeEmbeddedScripts()
    }

    _toggleShrink() {
        this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }

    _deleteMe() {
        this.props.handleDelete(this.props.unique_id)
    }

    _handleSummaryTextChange(event) {
        this.props.setConsoleItemValue(this.props.unique_id, "summary_text", event.target.value)
    }

     executeEmbeddedScripts() {
        let scripts = $("#" + this.props.unique_id + " .log-panel-body script").toArray();
        for (let script of scripts) {
            try {
                window.eval(script.text)
            }
            catch (e) {

            }
        }
    }

    render () {
        let converted_dict = {__html: this.props.console_text};
        let panel_style = this.props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
        if (this.props.is_error) {
            panel_style += " error-log-panel"
        }
        let butclass = "notclose";
        return (
            <Rbs.Card className={panel_style} id={this.props.unique_id} style={{marginBottom: 10}}>
                <Rbs.Card.Header>
                    <div className="button-div shrink-expand-div">
                        {!this.props.am_shrunk &&
                            <GlyphButton butclass={butclass + " shrink-log-button"}
                                         icon_class="fas fa-chevron-circle-down"
                                         handleClick={this._toggleShrink}/>
                        }
                        {this.props.am_shrunk &&
                            <GlyphButton butclass={butclass + " expand-log-button"}
                                         icon_class="fas fa-chevron-circle-right"
                                         handleClick={this._toggleShrink}/>
                        }
                    </div>
                </Rbs.Card.Header>
                {this.props.am_shrunk &&
                    <ContentEditable html={this.props.summary_text}
                                     onChange={this._handleSummaryTextChange}
                                     disabled={false}
                                     className="log-panel-summary"
                                     style={{}}
                                     tagName="div"
                                     innerRef={this.ce_summary_ref}/>
                }
                {!this.props.am_shrunk &&
                    <div className="log-panel-body">
                        <div style={{marginTop: 10, marginLeft: 35, width: "100%"}} dangerouslySetInnerHTML={converted_dict}/>
                        <div className="button-div d-inline-flex">
                             <GlyphButton butclass={butclass + " pl-2"}
                                 handleClick={this._deleteMe}
                                 icon_class="fas fa-trash-alt"/>
                            <span className="fas fa-align-justify console-sorter pl-2"
                                  style={{paddingTop: 10}}
                            />
                        </div>
                    </div>

                }
            </Rbs.Card>
        )
    }
}

LogItem.propTypes = {
    unique_id: PropTypes.string,
    is_error: PropTypes.bool,
    am_shrunk: PropTypes.bool,
    summary_text: PropTypes.string,
    console_text: PropTypes.string,
    setConsoleItemValue: PropTypes.func,
    handleDelete: PropTypes.func,
};


class ConsoleCodeItem extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.cmobject = null
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
            this.cmobject.on("focus", ()=>{self.props.setFocus(this.props.unique_id)});
            this.cmobject.on("blur", ()=>{self.props.setFocus(null)})
        }
        this.executeEmbeddedScripts()
    }

    componentDidUpdate() {
        this.executeEmbeddedScripts();
         if (this.props.set_focus) {
            if (this.cmobject != null) {
                this.cmobject.focus();
                this.cmobject.setCursor({line: 0, ch: 0})
            }
            this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false)
        }
    }

    executeEmbeddedScripts() {
        let scripts = $("#" + this.props.unique_id + " .log-code-output script").toArray();
        for (let script of scripts) {
            try {
                window.eval(script.text)
            }
            catch (e) {

            }
        }
    }

    _runMe(go_to_next = false) {
        this._startMySpinner();
        let self = this;
        postWithCallback(main_id, "exec_console_code", {"the_code": this.props.console_text, "console_id": this.props.unique_id}, function () {
            if (go_to_next) {
                self.props.goToNextCell(self.props.unique_id)
            }
        })
    }

    _startMySpinner() {
        this.props.setConsoleItemValue(this.props.unique_id, "show_spinner", true)
    }

    _stoptMySpinner() {
        this.props.setConsoleItemValue(this.props.unique_id, "show_spinner", false)
    }

    _handleChange(new_code) {
        this.props.setConsoleItemValue(this.props.unique_id, "console_text", new_code)
    }

    _handleSummaryTextChange(event) {
        this.props.setConsoleItemValue(this.props.unique_id, "summary_text", event.target.value)
    }

    _toggleShrink() {
        this.props.setConsoleItemValue(this.props.unique_id, "am_shrunk", !this.props.am_shrunk);
    }

    _deleteMe() {
        this.props.handleDelete(this.props.unique_id)
    }

    _clearOutput() {
        this.props.setConsoleItemValue(this.props.unique_id, "output_text","")
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

    render () {
        let panel_style = this.props.am_shrunk ? "log-panel log-panel-invisible" : "log-panel log-panel-visible";
        let output_dict = {__html: this.props.output_text};
        let butclass = "notclose";
        return (
             <Rbs.Card className={panel_style} id={this.props.unique_id}>
                <Rbs.Card.Header>
                    <div className="button-div shrink-expand-div">
                        {!this.props.am_shrunk &&
                            <GlyphButton butclass={butclass}
                                         icon_class="fas fa-chevron-circle-down"
                                         handleClick={this._toggleShrink}/>
                        }
                        {this.props.am_shrunk &&
                            <GlyphButton butclass={butclass}
                                         icon_class="fas fa-chevron-circle-right"
                                         handleClick={this._toggleShrink}/>
                        }
                    </div>
                </Rbs.Card.Header>
                {this.props.am_shrunk &&
                    <ContentEditable html={this.props.summary_text}
                                     onChange={this._handleSummaryTextChange}
                                     disabled={false}
                                     className="log-panel-summary"
                                     style={{}}
                                     tagName="div"
                                     innerRef={this.ce_summary_ref}/>
                }
                {!this.props.am_shrunk &&
                    <React.Fragment>
                            <div className="d-flex flex-row">
                                <div className="log-panel-body console-code">
                                    <div className="button-div d-inline-flex pr-1">
                                         <GlyphButton butclass={butclass}
                                             handleClick={this._runMe}
                                             icon_class="fas fa-step-forward"/>
                                    </div>
                                    <ReactCodemirror handleChange={this._handleChange}
                                                     code_content={this.props.console_text}
                                                     setCMObject={this._setCMObject}
                                                     extraKeys={this._extraKeys()}
                                                     saveMe={null}/>
                                     <div className="button-div d-inline-flex">
                                         <GlyphButton butclass={butclass + " pl-2"}
                                             handleClick={this._deleteMe}
                                             icon_class="fas fa-trash-alt"/>
                                        <GlyphButton butclass={butclass + " pl-2"}
                                                     handleClick={this._clearOutput}
                                                     icon_class="fas fa-eraser"/>
                                        <span className="fas fa-align-justify console-sorter pl-2"
                                              style={{paddingTop: 10}}
                                        />
                                    </div>
                                </div>
                                {!this.props.show_spinner &&
                                    <div className='execution-counter'>[{String(this.props.execution_count)}]</div>
                                }
                                {this.props.show_spinner &&
                                    <div style={{marginTop: 10, paddingRight: 22}}>
                                        <span className="console-spin-place">
                                            <span className="loader-console"></span>
                                        </span>
                                    </div>
                                }
                            </div>
                            < div className='log-code-output' dangerouslySetInnerHTML={output_dict}/>
                    </React.Fragment>
                }
            </Rbs.Card>
        )
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
        this.ce_ref = React.createRef();
        this.ce_summary_ref = React.createRef();
        this.converter = new showdown.Converter();
    }

    componentDidMount() {
        if (this.props.set_focus) {
            if (this.props.show_markdown) {
                this._hideMarkdown()
            }
            else {
                $(this.ce_ref.current).focus();
                this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false)
            }
        }
    }

    componentDidUpdate() {
        if (this.props.set_focus) {
            if (this.props.show_markdown) {
                this._hideMarkdown()
            }
            else {
                $(this.ce_ref.current).focus();
                this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false)
            }
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
    _hideMarkdown() {
        this.props.setConsoleItemValue(this.props.unique_id, "show_markdown", false);
    }

    _handleChange(event) {
        this.props.setConsoleItemValue(this.props.unique_id, "console_text", event.target.value)
    }

    _handleSummaryTextChange(event) {
        this.props.setConsoleItemValue(this.props.unique_id, "summary_text", event.target.value)
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

    render () {
        let really_show_markdown =  this.hasOnlyWhitespace ? false : this.props.show_markdown;
        var converted_markdown;
        if (really_show_markdown) {
            converted_markdown = this.converter.makeHtml(this.props.console_text);
        }
        let key_bindings = [[["ctrl+enter", "command+enter"], this._gotEnter]];
        let converted_dict = {__html: converted_markdown};
        let panel_class = this.props.am_shrunk ? "log-panel log-panel-invisible text-log-item" : "log-panel log-panel-visible text-log-item";
        let butclass = "notclose";
        return (
            <Rbs.Card className={panel_class} id={this.props.unique_id} style={{marginBottom: 10}}>
                <Rbs.Card.Header>
                    <div className="button-div shrink-expand-div">
                        {!this.props.am_shrunk &&
                            <GlyphButton butclass={butclass}
                                         icon_class="fas fa-chevron-circle-down"
                                         handleClick={this._toggleShrink}/>
                        }
                        {this.props.am_shrunk &&
                            <GlyphButton butclass={butclass}
                                         icon_class="fas fa-chevron-circle-right"
                                         handleClick={this._toggleShrink}/>
                        }
                    </div>
                </Rbs.Card.Header>
                {this.props.am_shrunk &&
                    <ContentEditable html={this.props.summary_text}
                                     onChange={this._handleSummaryTextChange}
                                     disabled={false}
                                     className="log-panel-summary"
                                     style={{}}
                                     tagName="div"
                                     innerRef={this.ce_summary_ref}/>
                }
                {!this.props.am_shrunk &&
                    <div className="log-panel-body text-box"  style={{"display": "inline-flex"}}>
                            <div className="button-div d-inline-flex pr-1">
                                <GlyphButton butclass={butclass}
                                             handleClick={this._showMarkdown}
                                             icon_class="fas fa-font"/>
                            </div>
                        {!really_show_markdown &&
                            <ContentEditable html={this.props.console_text}
                                             onChange={this._handleChange}
                                             onKeyDown={this._handleKeyDown}
                                             onFocus={()=>this.props.setFocus(this.props.unique_id)}
                                             onBlur={()=>this.props.setFocus(null)}
                                             disabled={false}
                                             className="console-text"
                                             style={{}}
                                             tagName="div"
                                             innerRef={this.ce_ref}/>
                        }
                        {really_show_markdown &&
                            <div className="text-panel-output"
                                 onClick={this._hideMarkdown}
                                 style={{width: "100%"}}
                                 dangerouslySetInnerHTML={converted_dict}/>
                        }

                        <div className="button-div d-inline-flex">
                             <GlyphButton butclass={butclass + " pl-2"}
                                 handleClick={this._deleteMe}
                                 icon_class="fas fa-trash-alt"/>
                            <span className="fas fa-align-justify console-sorter pl-2"
                                  style={{paddingTop: 10}}
                            />
                        </div>
                    </div>
                }
            <KeyTrap target_ref={this.ce_ref} bindings={key_bindings} />
            </Rbs.Card>
        )
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
