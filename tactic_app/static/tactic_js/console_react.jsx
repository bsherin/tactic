
import {GlyphButton} from "./react_widgets.js";
import {ReactCodemirror} from "./react-codemirror.js";

export {ConsoleComponent}

var ContentEditable = react_contenteditable.default;

var Rbs = window.ReactBootstrap;

class LogItem extends React.Component {
    constructor(props) {
        super(props);
        this.ce_summary0ref = React.createRef();
        doBinding(this);
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

    render () {
        let converted_dict = {__html: this.props.console_text};
        let panel_style = this.props.am_shrunk ? "log-panel log-panel-invisible fixed-log-panel" : "log-panel log-panel-visible fixed-log-panel";
        if (this.props.is_error) {
            panel_style += " error-log-panel"
        }
        // let header_class = this.props.is_error ? "bg-warning error-panel-heading" : "";
        // let bg = this.props.is_error ? "warning" : "light";
        return (
            <Rbs.Card className={panel_style} bg={bg} id={this.props.unique_id}>
                <Rbs.Card.Header>
                    <div className="button-div shrink-expand-div">
                        {!this.props.am_shrunk &&
                            <GlyphButton butclass="notclose shrink-log-button"
                                         icon_class="fas fa-chevron-circle-down"
                                         handleClick={this._toggleShrink}/>
                        }
                        {this.props.am_shrunk &&
                            <GlyphButton butclass="notclose expand-log-button"
                                         icon_class="fas fa-chevron-circle-right"
                                         handleClick={this._toggleShrink}/>
                        }
                    </div>
                    <div className="button-div">
                        <GlyphButton butclass="notclose close-log-button"
                                     handleClick={this._deleteMe}
                                     icon_class="fas fa-trash-alt"/>
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
                    <div className="log-panel-body"
                         dangerouslySetInnerHTML={converted_dict}/>
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
    }

    componentDidUpdate() {
         if (this.props.set_focus) {
            if (this.cmobject != null) {
                this.cmobject.focus();
                this.cmobject.setCursor({line: 0, ch: 0})
            }
            this.props.setConsoleItemValue(this.props.unique_id, "set_focus", false)
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
        return (
             <Rbs.Card className={panel_style} id={this.props.unique_id}>
                <Rbs.Card.Header>
                    <div className="button-div shrink-expand-div">
                        {!this.props.am_shrunk &&
                            <GlyphButton butclass="notclose"
                                         icon_class="fas fa-chevron-circle-down"
                                         handleClick={this._toggleShrink}/>
                        }
                        {this.props.am_shrunk &&
                            <GlyphButton butclass="notclose"
                                         icon_class="fas fa-chevron-circle-right"
                                         handleClick={this._toggleShrink}/>
                        }
                    </div>
                    <div className="button-div">
                        <GlyphButton butclass="notclose"
                                     handleClick={this._deleteMe}
                                     icon_class="fas fa-trash-alt"/>
                    </div>
                    <div className="button-div">
                        <GlyphButton butclass="notclose"
                                     handleClick={this._runMe}
                                     icon_class="fas fa-step-forward"/>
                    </div>
                    <div className="button-div spinner-div">
                        {!this.props.show_spinner &&
                            <GlyphButton butclass="notclose"
                                         handleClick={this._clearOutput}
                                         icon_class="fas fa-eraser"/>
                        }
                        {this.props.show_spinner &&
                            <button type="button" className="notclose">
                                <span className="console-spin-place">
                                    <span className="loader-console"></span>
                                </span>
                            </button>
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
                                    <ReactCodemirror handleChange={this._handleChange}
                                                     code_content={this.props.console_text}
                                                     setCMObject={this._setCMObject}
                                                     extraKeys={this._extraKeys()}
                                                     saveMe={null}/>
                                </div>
                                <div className='execution-counter'>[{String(this.props.execution_count)}]</div>
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
        doBinding(this);
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

    render () {
        let really_show_markdown =  this.hasOnlyWhitespace ? false : this.props.show_markdown;
        var converted_markdown;
        if (really_show_markdown) {
            converted_markdown = this.converter.makeHtml(this.props.console_text);
        }

        let converted_dict = {__html: converted_markdown};
        let panel_style = this.props.am_shrunk ? "log-panel log-panel-invisible text-log-item" : "log-panel log-panel-visible text-log-item";
        return (
            <Rbs.Card className={panel_style} id={this.props.unique_id}>
                <Rbs.Card.Header>
                    <div className="button-div shrink-expand-div">
                        {!this.props.am_shrunk &&
                            <GlyphButton butclass="notclose"
                                         icon_class="fas fa-chevron-circle-down"
                                         handleClick={this._toggleShrink}/>
                        }
                        {this.props.am_shrunk &&
                            <GlyphButton butclass="notclose"
                                         icon_class="fas fa-chevron-circle-right"
                                         handleClick={this._toggleShrink}/>
                        }
                    </div>
                    <div className="button-div">
                        <GlyphButton butclass="notclose"
                                     handleClick={this._deleteMe}
                                     icon_class="fas fa-trash-alt"/>
                    </div>
                    <div className="button-div">
                        <GlyphButton butclass="notclose"
                                     handleClick={this._showMarkdown}
                                     icon_class="fas fa-font"/>
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
                                    <div className="log-panel-body text-box">
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
                             dangerouslySetInnerHTML={converted_dict}/>
                    }
                    </div>
                }

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
    setFocus: PropTypes.func
};


class ConsoleComponent extends React.Component {

    constructor(props) {
        super(props);
        this.header_ref = React.createRef();
        this.body_ref = React.createRef();
        doBinding(this);
        this.state = {mounted: false};
        this.pseudo_tile_id = null
    }

    componentDidMount() {
        this.setState({mounted: true});
        let self = this;
        $(this.body_ref.current).sortable({
            handle: '.card-header',
            tolerance: 'pointer',
            revert: 'invalid',
            forceHelperSize: true,
            stop: function () {
                const new_sort_list = $(self.body_ref.current).sortable("toArray");
                self.props.resortConsoleItems(new_sort_list)
            }
        });
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
        this.props.setMainStateValue("console_items", [])
    }

    _toggleConsoleLog() {
        let self = this;
        if (this.props.show_error_log) {
            this.props.setMainStateValue("show_console_error_log", false)
        }
        else {
            if (self.pseudo_tile_id == null) {
                postWithCallback(window.main_id, "get_pseudo_tile_id", {}, function (res) {
                    self.pseudo_tile_id = res.pseudo_tile_id;
                    if (self.pseudo_tile_id == null) {
                        self.props.setMainStateValue("console_error_log_text", "pseudo-tile is initializing...", ()=>{
                            self.props.setMainStateValue("show_console_error_log", true)
                        });
                    }
                    else{
                        postWithCallback("host", "get_container_log", {"container_id": self.pseudo_tile_id}, function (res) {
                            let log_text = res.log_text;
                            if (log_text == "") {
                                log_text = "Got empty result. The pseudo-tile is probably starting up."
                            }
                            self.props.setMainStateValue("console_error_log_text", log_text, ()=>{
                                self.props.setMainStateValue("show_console_error_log", true)
                            });
                        })
                    }
                })
            }
            else {
                postWithCallback("host", "get_container_log", {"container_id": self.pseudo_tile_id}, function (res) {
                    self.props.setMainStateValue("console_error_log_text", res.log_text, () => {
                            self.props.setMainStateValue("show_console_error_log", true)
                        }
                    );
                })
            }
        }
    }

    _toggleMainLog () {
        let self = this;
        if (this.props.show_error_log) {
            this.props.setMainStateValue("show_console_error_log", false)
        }
        else {
            postWithCallback("host", "get_container_log", {"container_id": window.main_id}, function (res) {
                self.props.setMainStateValue("console_error_log_text", res.log_text, ()=>{
                    self.props.setMainStateValue("show_console_error_log", true)
                });
            })
        }
    }

    _setFocusedItem(unique_id) {
        this.props.setMainStateValue("console_item_with_focus", unique_id)
    }

    _zoomConsole () {
        this.props.setMainStateValue("console_is_zoomed", true)
    }

    _unzoomConsole () {
        this.props.setMainStateValue("console_is_zoomed", false)
    }

    _expandConsole () {
        this.props.setMainStateValue("console_is_shrunk", false)
    }

    _shrinkConsole () {
        this.props.setMainStateValue("console_is_shrunk", true)
    }

    _bodyHeight() {
        if (this.state.mounted) {
            return this.props.available_height - $(this.header_ref.current).outerHeight() - 35
        }
        else {
            return this.props.available_height - 75
        }
    }

    render () {
        let console_items = [];
        for (let entry of this.props.console_items) {
            if (entry.type == "text") {
                console_items.push(
                    <ConsoleTextItem unique_id={entry.unique_id}
                                     key={entry.unique_id}
                                     am_shrunk={entry.am_shrunk}
                                     show_markdown={entry.show_markdown}
                                     summary_text={entry.summary_text}
                                     console_text={entry.console_text}
                                     set_focus={entry.set_focus}
                                     setConsoleItemValue={this.props.setConsoleItemValue}
                                     handleDelete={this.props.handleItemDelete}
                                     goToNextCell={this.props.goToNextCell}
                                     setFocus={this._setFocusedItem}
                    />
                )
            }
            else if (entry.type == "code") {
                console_items.push(
                    <ConsoleCodeItem unique_id={entry.unique_id}
                                     key={entry.unique_id}
                                     am_shrunk={entry.am_shrunk}
                                     show_spinner={entry.show_spinner}
                                     summary_text={entry.summary_text}
                                     console_text={entry.console_text}
                                     output_text={entry.output_text}
                                     set_focus={entry.set_focus}
                                     execution_count={entry.execution_count}
                                     setConsoleItemValue={this.props.setConsoleItemValue}
                                     handleDelete={this.props.handleItemDelete}
                                     addNewTextItem={this._addBlankText}
                                     addNewCodeItem={this._addBlankCode}
                                     goToNextCell={this.props.goToNextCell}
                                     setFocus={this._setFocusedItem}
                    />
                )
            }
            else if (entry.type == "fixed") {
                console_items.push (
                    <LogItem unique_id={entry.unique_id}
                             key={entry.unique_id}
                             is_error={entry.is_error}
                             am_shrunk={entry.am_shrunk}
                             summary_text={entry.summary_text}
                             console_text={entry.console_text}
                             setConsoleItemValue={this.props.setConsoleItemValue}
                             handleDelete={this.props.handleItemDelete}
                    />
                )
            }
        }

        return (
            <Rbs.Card bg="light" id="console-panel">
                <Rbs.Card.Header id="console-heading" ref={this.header_ref}
                                 className="d-flex flex-row justify-content-between">
                    <div id="console-header-left" className="d-flex flex-row  align-items-baseline">
                        {this.props.am_shrunk &&
                            <GlyphButton butclass="notclose bottom-heading-element"
                                         handleClick={this._expandConsole}
                                         style={{paddingRight: 5, paddingTop: 0}}
                                         icon_class="far fa-chevron-circle-right"/>
                        }
                        {!this.props.am_shrunk &&
                            <GlyphButton butclass="notclose bottom-heading-element"
                                         handleClick={this._shrinkConsole}
                                         style={{paddingRight: 5, paddingTop: 0}}
                                         icon_class="far fa-chevron-circle-down"/>
                        }
                        <b>Log</b>
                        <GlyphButton butclass="notclose bottom-heading-element bottom-heading-element-button"
                                     extra_glyph_text="text"
                                     handleClick={this._addBlankText}
                                     icon_class="far fa-font"/>
                         <GlyphButton butclass="notclose bottom-heading-element bottom-heading-element-button"
                                      extra_glyph_text="code"
                                      handleClick={this._addBlankCode}
                                      icon_class="far fa-terminal"/>
                         <GlyphButton butclass="notclose bottom-heading-element bottom-heading-element-button"
                                      handleClick={this._resetConsole}
                                      extra_glyph_text="reset"
                                      icon_class="far fa-sync"/>
                         <GlyphButton butclass="notclose bottom-heading-element bottom-heading-element-button"
                                      extra_glyph_text="clear"
                                      handleClick={this._clearConsole}
                                      icon_class="far fa-trash"/>
                         <GlyphButton butclass="notclose bottom-heading-element bottom-heading-element-button"
                                      extra_glyph_text="log"
                                      handleClick={this._toggleConsoleLog}
                                      icon_class="far fa-exclamation-triangle"/>
                         <GlyphButton butclass="notclose bottom-heading-element bottom-heading-element-button"
                                      extra_glyph_text="main"
                                      handleClick={this._toggleMainLog}
                                      icon_class="far fa-exclamation-triangle"/>
                    </div>
                    <div id="console-header-right" className="d-flex flex-row  align-items-baseline">
                        <button type='button'
                                className='notclose tooltip-top bottom-heading-element'
                                onClick={this.props.toggleExports}
                                style={{marginRight: 12}}>exports
                        </button>
                        {!this.props.am_zoomed &&
                            <GlyphButton butclass="notclose bottom-heading-element"
                                         handleClick={this._zoomConsole}
                                         icon_class="far fa-expand-alt"/>
                        }
                        {this.props.am_zoome &&
                            <GlyphButton butclass="notclose bottom-heading-element"
                                         handleClick={this._unzoomConsole}
                                         icon_class="far fa-compress-alt"/>
                        }
                    </div>
                </Rbs.Card.Header>
                {!this.props.am_shrunk &&
                    <Rbs.Card.Body id="console"
                                   ref={this.body_ref}
                                   style={{height: this._bodyHeight(), backgroundColor: "white"}}>
                        {this.props.show_error_log &&
                            <pre>{this.props.error_log_text}</pre>
                        }
                        {!this.props.show_error_log &&
                            console_items
                        }
                    </Rbs.Card.Body>
                }

            </Rbs.Card>
        )
    }
}

ConsoleComponent.propTypes = {
    console_items: PropTypes.array,
    error_log_text: PropTypes.string,
    am_shrunk: PropTypes.bool,
    am_zoomed: PropTypes.bool,
    show_error_log: PropTypes.bool,
    available_height: PropTypes.number,
    setConsoleItemValue: PropTypes.func,
    setMainStateValue: PropTypes.func,
    handleItemDelete: PropTypes.func,
    goToNextCell: PropTypes.func,
    resortConsoleItems: PropTypes.func,
    toggleExports: PropTypes.func
};