
import {GlyphButton} from "./react_widgets.js";
import {ReactCodemirror} from "./react-codemirror.js";
import {SortableComponent} from "./sortable_container.js";
import {KeyTrap} from "./key_trap.js";

export {withConsole, console_attrs}

var ContentEditable = react_contenteditable.default;

var Rbs = window.ReactBootstrap;

const MARGIN_SIZE = 17;
const BOTTOM_MARGIN = 35;

const console_attrs = ["console_items", "console_is_shrunk", "height_fraction", "show_exports_pane", 'console_is_zoomed'];

function withConsole(WrappedComponent, tsocket) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            doBinding(this);
            this.header_ref = React.createRef();
            this.body_ref = React.createRef();
            this.tile_div_ref = React.createRef();
            this.state = {
                console_items: [],
                console_item_with_focus: null,
                console_is_shrunk: true,
                show_console_error_log: false,
                console_error_log_text: "",
                console_is_zoomed: false,
                show_exports_pane: false,
                short_collection_name: window.short_collection_name,
                usable_width: window.innerWidth - 2 * MARGIN_SIZE - 30,
                usable_height: window.innerHeight - BOTTOM_MARGIN,
                height_fraction: .85,
            };
            if (window.is_notebook) {
                this.state.console_is_shrunk = false
            }
            if (this.props.is_project) {
                for (let attr of console_attrs) {
                    this.state[attr] = this.props.interface_state[attr]
                }
            }
            this.pseudo_tile_id = null
        }

        componentDidMount(){
            this.setState({"mounted": true});
            window.addEventListener("resize", this._update_window_dimensions);
            tsocket.socket.on("console-message", this._handleConsoleMessage);
            // this.createConsoleSorter()
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
            for (let entry of this.state.console_items) {
                if (entry.type != "code") {
                    new_console_items.push(entry)
                }
                else {
                    let new_entry = Object.assign({}, entry);
                    new_entry.output_text = "";
                    new_console_items.push(new_entry)
                }
            }
            this.setState({"console_items": new_console_items});
            postWithCallback(window.main_id, "clear_console_namespace", {})
        }

        _clearConsole() {
            this.setState({"console_items": []});
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
            this.setState({"console_is_zoomed": true})
        }

        _unzoomConsole () {
            this.setState({"console_is_zoomed": false})
        }

        _expandConsole () {
             this.setState({"console_is_shrunk": false})
        }

        _shrinkConsole () {
            this.setState({"console_is_shrunk": true})
        }

        _bodyHeight(available_height) {
            if (this.state.mounted) {
                return available_height - $(this.header_ref.current).outerHeight() - 35
            }
            else {
                return available_height - 75
            }
        }

         _update_window_dimensions() {
            this.setState({
                "usable_width": window.innerWidth - 2 * MARGIN_SIZE - 30,
                "usable_height": window.innerHeight - BOTTOM_MARGIN
            });
        }

        _toggleExports() {
            this.setState({show_exports_pane: !this.state.show_exports_pane})
        }

        _setConsoleItemValue(unique_id, field, value) {
            let entry = this.get_console_item_entry(unique_id);
            entry[field] = value;
            this.replace_console_item_entry(unique_id, entry)
        }

        _setConsoleFieldValue(field_name, value, callback=null) {
            let new_state = {};
            new_state[field_name] = value;
            this.setState(new_state, callback)
        }

        _setConsoleState(new_state, callback) {
            this.setState(new_state, callback)
        }

        replace_console_item_entry(unique_id, new_entry) {
            let new_console_items = [...this.state.console_items];
            let cindex = this._consoleItemIndex(unique_id);
            new_console_items.splice(cindex, 1, new_entry);
            this.setState({console_items: new_console_items})
        }

        get_console_item_entry(unique_id) {
            return Object.assign({}, this.state.console_items[this._consoleItemIndex(unique_id)])
        }

        _consoleItemIndex(unique_id) {
            let counter = 0;
            for (let entry of this.state.console_items) {
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
            this.setState({console_items: new_console_items})
        }

        _goToNextCell(unique_id) {
            let next_index = this._consoleItemIndex(unique_id) + 1;
            if (next_index == this.state.console_items.length) return;
            let next_id = this.state.console_items[next_index].unique_id;
            this._setConsoleItemValue(next_id, "set_focus", true)
        }

        _closeConsoleItem(unique_id) {
            let cindex = this._consoleItemIndex(unique_id);
            let new_console_items = [...this.state.console_items];
            new_console_items.splice(cindex, 1);
            this.setState({console_items: new_console_items});
        }

        _addConsoleEntry(new_entry, force_open=true, set_focus=false) {
            new_entry.set_focus = set_focus;
            let insert_index;
            if (this.state.console_item_with_focus == null) {
                insert_index = this.state.console_items.length
            }
            else {
                insert_index = this._consoleItemIndex(this.state.console_item_with_focus) + 1
            }
            let new_console_items = [... this.state.console_items];
            new_console_items.splice(insert_index, 0, new_entry);
            let new_state = {console_items: new_console_items};
            if (force_open) {
                new_state.console_is_shrunk = false
            }

            this.setState(new_state)
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

        get_hp_height () {
            if (this.state.mounted && this.tile_div_ref.current) {
                let top_fraction = this.state.console_is_shrunk ? 1 : this.state.height_fraction;
                return (this.state.usable_height - this.tile_div_ref.current.getBoundingClientRect().top) * top_fraction - 30;
            }
            else {
                return this.state.usable_height - 100
            }
        }

        get_vp_height () {
            if (this.state.mounted && this.tile_div_ref.current) {
                return this.state.usable_height - this.tile_div_ref.current.getBoundingClientRect().top;
            }
            else {
                return this.state.usable_height - 50
            }
        }

        render() {
            let vp_height;
            let hp_height;
            let console_available_height;
            if (this.state.console_is_zoomed || window.is_notebook) {
                console_available_height = this.state.usable_height - 50
            }
            else {
                vp_height = this.get_vp_height();
                hp_height = this.get_hp_height();
                console_available_height = vp_height - hp_height
            }

            let console_component = (
                <Rbs.Card bg="light" id="console-panel">
                    <Rbs.Card.Header id="console-heading" ref={this.header_ref}
                                     className="d-flex flex-row justify-content-between">
                        <div id="console-header-left" className="d-flex flex-row  align-items-baseline">
                            {this.state.console_is_shrunk &&
                                <GlyphButton butclass="notclose bottom-heading-element"
                                             handleClick={this._expandConsole}
                                             style={{paddingRight: 5, paddingTop: 0}}
                                             icon_class="far fa-chevron-circle-right"/>
                            }
                            {!this.state.console_is_shrunk &&
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
                                    onClick={this._toggleExports}
                                    style={{marginRight: 12}}>exports
                            </button>
                            {!this.state.am_zoomed &&
                                <GlyphButton butclass="notclose bottom-heading-element"
                                             handleClick={this._zoomConsole}
                                             icon_class="far fa-expand-alt"/>
                            }
                            {this.state.am_zoomed &&
                                <GlyphButton butclass="notclose bottom-heading-element"
                                             handleClick={this._unzoomConsole}
                                             icon_class="far fa-compress-alt"/>
                            }
                        </div>
                    </Rbs.Card.Header>
                    {!this.state.console_is_shrunk &&
                        <Rbs.Card.Body id="console"
                                       ref={this.body_ref}
                                       style={{height: this._bodyHeight(console_available_height), backgroundColor: "white"}}>
                            {this.state.show_console_error_log &&
                                <pre>{this.state.error_log_text}</pre>
                            }
                            {!this.state.show_console_error_log &&
                                <SortableComponent id="console-items-div"
                                                   ElementComponent={SuperItem}
                                                   key_field_name="unique_id"
                                                   item_list={this.state.console_items}
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
            return (
                <WrappedComponent console_component={console_component}
                                  console_items={this.state.console_items}
                                  console_is_shrunk={this.state.console_is_shrunk}
                                  console_is_zoomed={this.state.console_is_zoomed}
                                  show_exports_pane={this.state.show_exports_pane}
                                  height_fraction={this.state.height_fraction}
                                  usable_height={this.state.usable_height}
                                  usable_width={this.state.usable_width}
                                  setConsoleFieldValue={this._setConsoleFieldValue}
                                  console_available_height={console_available_height}
                                  tile_div_ref={this.tile_div_ref}
                                  hp_height={hp_height}
                                  vp_height={vp_height}
                                  {...this.props}/>
            )
        }
    }
}

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
        // let header_class = this.props.is_error ? "bg-warning error-panel-heading" : "";
        // let bg = this.props.is_error ? "warning" : "light";
        return (
            <Rbs.Card className={panel_style} id={this.props.unique_id}>
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
                    <div className="log-panel-body">
                        <div dangerouslySetInnerHTML={converted_dict}/>
                        <span className="fas fa-align-justify console-sorter pt-2 pl-1" />
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
        return (
             <Rbs.Card className={panel_style} id={this.props.unique_id}>
                <Rbs.Card.Header>
                    <div className="button-div shrink-expand-div">
                        {!this.props.am_shrunk  && !window.is_notebook &&
                            <GlyphButton butclass="notclose"
                                         icon_class="fas fa-chevron-circle-down"
                                         handleClick={this._toggleShrink}/>
                        }
                        {this.props.am_shrunk && !window.is_notebook &&
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
                                     <span className="fas fa-align-justify console-sorter pt-2 pl-1" />
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
                    <div className="log-panel-body text-box"  style={{"display": "inline-flex"}}>
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
                        <span className="fas fa-align-justify console-sorter pt-2 pl-1" />
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
    setFocus: PropTypes.func
};
