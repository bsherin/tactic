
import React from "react";
import PropTypes from 'prop-types';
import { Card, Button, InputGroup, Spinner, ButtonGroup, FormGroup, Divider} from "@blueprintjs/core";

import {GlyphButton, SelectList} from "./blueprint_react_widgets.js";
import {postWithCallback} from "./communication_react.js"
import {doFlash} from "./toaster.js"
import {doBinding} from "./utilities_react.js";

export {ExportsViewer}

class TextIcon extends React.Component {
    render() {
        return(
            <React.Fragment>
                <span className="bp3-icon" style={{fontWeight: 500}}>
                    {this.props.the_text}
                </span>
            </React.Fragment>
        )
    }
}

TextIcon.propTypes = {
    the_text: PropTypes.strin
};

const export_icon_dict = {
    str: "font",
    list: "array",
    range: "array",
    dict: <TextIcon the_text="{#}"/>,
    set: <TextIcon the_text="{..}"/>,
    tuple: <TextIcon the_text="(..)"/>,
    bool: <TextIcon the_text="tf"/>,
    bytes: <TextIcon the_text="b"/>,
    NoneType: "small-cross",
    int: "numerical",
    float: "numerical",
    complex: "numerical",
    function: "function",
    TacticDocument: "th",
    DetachedTacticDocument: "th",
    TacticCollection: "database",
    DetachedTacticCollection: "database",
    DetachedTacticRow: "th-derived",
    TacticRow: "th-derived",
    ndarray: "array-numeric",
    DataFrame: <TextIcon the_text="df"/>,
    other: "cube",
    unknown: <TextIcon the_text="?"/>
};



class ExportButtonListButton extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _onPressed() {
        this.props.buttonPress(this.props.fullname)
    }

    render() {
        return (
            <Button className="export-button" icon={export_icon_dict[this.props.type]} minimal={false}
                    onClick={this._onPressed} key={this.props.fullname}
                    active={this.props.active} small={true} value={this.props.fullname} text={this.props.shortname}/>
        )
    }

    return
}

ExportButtonListButton.propTypes = {
    fullname: PropTypes.string,
    shortname: PropTypes.string,
    type: PropTypes.string,
    buttonPress: PropTypes.func,
    active: PropTypes.bool

};

class ExportButtonList extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.select_ref = null;
        this.export_index = {}
    }

    _buttonPress(fullname) {
        this.props.handleChange(fullname, this.export_index[fullname].shortname, this.export_index[fullname].tilename)
    }

    componentDidUpdate() {
        if (this.select_ref) {
            let currently_selected = this.select_ref.value;
            if (currently_selected && (currently_selected != this.props.value)) {
                this.props.handleChange(currently_selected,
                    this.export_index[currently_selected].shortname,
                    this.export_index[currently_selected].tilename)
            }
        }
    }

    _compareEntries(a, b) {
        if (a[1].toLowerCase() == b[1].toLowerCase()) return 0;
        if (b[1].toLowerCase() > a[1].toLowerCase()) return -1;
        return 1
    }

    create_groups() {
        let groups = [];
        let group_names = Object.keys(this.props.pipe_dict);
        group_names.sort();
        for (let group of group_names) {
            let group_items = [];
            let entries = this.props.pipe_dict[group];
            entries.sort(this._compareEntries);
            for (let entry of entries) {
                let fullname = entry[0];
                let shortname = entry[1];
                let type = entry.length == 3 ? entry[2] : "unknown";
                if (!(type in export_icon_dict)) {
                    type = "other"
                }
                this.export_index[fullname] = {tilename: group, shortname: shortname};
                group_items.push(
                    <ExportButtonListButton fullname={fullname}
                                            shortname={shortname}
                                            type={type}
                                            active={this.props.value == fullname}
                                            buttonPress={this._buttonPress}
                    />
            )
            }
            if (group == "__log__") {
                groups.unshift(
                    <FormGroup inline={false} label={null} className="export-label">
                        <ButtonGroup minimal={false} vertical={true} alignText="left" key={group} >
                            {group_items}
                        </ButtonGroup>
                    </FormGroup>
                )
            }
            else {
                groups.push(
                    <FormGroup inline={false} label={group} className="export-label">
                        <ButtonGroup minimal={false} vertical={true} alignText="left" key={group} >
                            {group_items}
                        </ButtonGroup>
                    </FormGroup>
                )
            }

        }
        return groups
    }

    _handleSelectRef(the_ref) {
        this.select_ref = the_ref;
    }
    render() {
        return (
            <div id="exports-button-list" style={{flexDirection: "column", display: "inline-block", verticalAlign: "top", padding: 15, height:this.props.body_height}}
                className="contingent-scroll">
                {this.create_groups()}
            </div>
        )
    }
}

ExportButtonList.propTypes = {
    pipe_dict: PropTypes.object,
    body_height:PropTypes.number,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    handleChange: PropTypes.func
};

class ExportsViewer extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.header_ref = React.createRef();
        this.footer_ref = React.createRef();
        this.state = {
            selected_export: "",
            selected_export_tilename: null,
            key_list: null,
            key_list_value: null,
            tail_value: "",
            max_rows: 25,
            exports_info_value: null,
            selected_export_short_name: null,
            show_spinner: false,
            running: false,
            exports_body_value: "",
            type: null,
            pipe_dict: {},
        };
        this.socket_counter = null;
    }

    componentDidMount(){
        this.props.setUpdate(this._updateExportsList);
        this.initSocket();
        this._updateExportsList()
    }

    componentDidUpdate () {
        if (this.props.tsocket.counter != this.socket_counter) {
            this.initSocket();
        }
    }

    initSocket() {
        this.props.tsocket.socket.off("export-viewer-message");
        this.props.tsocket.socket.on("export-viewer-message", this._handleExportViewerMessage);
        this.socket_counter = this.props.tsocket.counter;
    }

    _handleExportViewerMessage(data) {
        let self = this;
        let handlerDict = {
            update_exports_popup: ()=>self._updateExportsList(),
            display_result: self._displayResult,
            showMySpinner: self._showMySpinner,
            stopMySpinner: self._stopMySpinner,
            startMySpinner: self._startMySpinner,
            got_export_info: self._gotExportInfo
        };
        handlerDict[data.export_viewer_message](data)
    }

    _handleMaxRowsChange(new_value){
        this.setState({max_rows: new_value}, this._eval)

    }

    _updateExportsList() {
        let self = this;
        postWithCallback(this.props.main_id, "get_full_pipe_dict", {}, function (data) {
            self.setState({pipe_dict: data.pipe_dict, pipe_dict_updated: true})
        })
    }

    _refresh() {
        this._handleExportListChange(this.state.selected_export, this.state.selected_export_short_name, true)
    }

    _displayResult(data) {
        this.setState({exports_body_value: data.the_html, show_spinner: false, running: false})
    }

    _eval(e = null) {
        this._showMySpinner();
        let send_data = {
            "export_name": this.state.selected_export,
            "tail": this.state.tail_value,
            "max_rows": this.state.max_rows
        };
        if (this.state.key_list) {
            send_data.key = this.state.key_list_value
        }
        postWithCallback(this.props.main_id, "evaluate_export", send_data);
        if (e) e.preventDefault();
    }

    _stopMe() {
        this._stopMySpinner();
        postWithCallback(this.props.main_id, "stop_evaluate_export", {})
    }

    _showMySpinner() {
        this.setState({show_spinner: true});
    }

    _startMySpinner() {
        this.setState({show_spinner: true, running: true});
    }

    _stopMySpinner() {
        this.setState({show_spinner: false, running: false});
    }

    _gotExportInfo(data) {
        let new_state = {
            type: data.type,
            exports_info_value: data.info_string,
            tail_value: "",
            show_spinner: false,
            running: false
        };
        if (data.hasOwnProperty("key_list")) {
            new_state.key_list = data.key_list;
            if (data.hasOwnProperty("key_list_value")) {
                new_state.key_list_value = data.key_list_value
            }
            else {
                if (new_state.key_list.length > 0) {
                    new_state.key_list_value = data.key_list[0]
                }
            }
        } else {
            new_state.key_list = null;
            new_state.key_list_value = null
        }
        this.setState(new_state, this._eval)
    }

    _handleExportListChange(fullname, shortname, tilename, force_refresh = false) {
        let self = this;
        if (!force_refresh && fullname == this.state.selected_export) return;
        this.setState({show_spinner: true,
            selected_export: fullname,
            selected_export_tilename: tilename,
            selected_export_short_name: shortname});
        postWithCallback(this.props.main_id, "get_export_info", {"export_name": fullname})
    }

    _handleKeyListChange(new_value) {
        this.setState({key_list_value: new_value}, this._eval)
    }

    _handleTailChange(event) {
        this.setState({tail_value: event.target.value})
    }

    _bodyHeight() {
        if (this.header_ref && this.header_ref.current && this.footer_ref && this.footer_ref.current) {
            return this.props.available_height - $(this.header_ref.current).outerHeight() - $(this.footer_ref.current).outerHeight()
        }
        else {
            return this.props.available_height - 75
        }
    }

    _sendToConsole() {
        const tail = this.state.tail_value;
        let tilename = this.state.selected_export_tilename;
        let shortname = this.state.selected_export_short_name;

        let key_string = "";
        if (!(this.state.key_list == null)) {
            key_string = `["${this.state.key_list_value}"]`;
        }

        let the_text;
        if (tilename == "__log__") {
            the_text = shortname + key_string + tail
        }
        else {
            the_text = `Tiles["${tilename}"]["${shortname}"]`+ key_string + tail;
        }

        let self = this;
        postWithCallback("host", "print_code_area_to_console",
            {"console_text": the_text, "user_id": window.user_id, "main_id": this.props.main_id}, function (data) {
            if (!data.success) {
                doFlash(data)
            }
        });
    }

    render () {
        let exports_body_dict = {__html: this.state.exports_body_value};
        let butclass = "notclose bottom-heading-element bottom-heading-element-button";
        let exports_class = this.props.console_is_shrunk ? "am-shrunk" : "not-shrunk";
        let spinner_val = this.state.running ? null : 0;
        if (this.props.console_is_zoomed) {
            exports_class = "am-zoomed"
        }
        return (
             <Card id="exports-panel" elevation={2} className={"mr-3 " + exports_class} style={this.props.style}>
                 <div className="d-flex flex-column justify-content-around">
                     <div id="exports-heading"
                          ref={this.header_ref}
                         className="d-flex flex-row justify-content-start">
                         {!this.state.show_spinner &&
                            <GlyphButton handleClick={this._eval}
                                          intent="primary"
                                          tooltip="Send code to the console"
                                          style={{marginLeft: 6, marginTop: 2}}
                                          icon="play"/>
                         }
                         {this.state.show_spinner &&
                            <GlyphButton handleClick={this._stopMe}
                                              intent="danger"
                                              tooltip="Send code to the console"
                                              style={{marginLeft: 6, marginTop: 2}}
                                              icon="stop"/>

                         }

                         <GlyphButton handleClick={this._sendToConsole}
                                      intent="primary"
                                      tooltip="Send code to the console"
                                      style={{marginLeft: 6, marginTop: 2}}
                                      icon="circle-arrow-left"/>
                         {(Object.keys(this.state.pipe_dict).length > 0) && (
                             <form onSubmit={this._eval} className="d-flex flex-row">
                                   <span id="selected-export"
                                         className="bottom-heading-element mr-2">{this.state.selected_export_short_name}</span>
                                   {this.state.key_list && <SelectList option_list={this.state.key_list}
                                                                         onChange={this._handleKeyListChange}
                                                                         the_value={this.state.key_list_value}
                                                                         minimal={true}
                                                                         fontSize={11}
                                     />
                                    }
                                 <InputGroup type="text"
                                             small={true}
                                             onChange={this._handleTailChange}
                                             onSubmit={this._eval}
                                             value={this.state.tail_value}
                                             className="export-tail"
                                 />
                             </form>
                             )
                         }

                         {this.state.show_spinner &&
                             <div style={{marginTop: 7, marginRight: 10, marginLeft: 10}}>
                                <Spinner size={13} value={spinner_val}/>
                             </div>
                         }


                     </div>
                     {!this.props.console_is_shrunk &&
                         <React.Fragment>
                             <div className="d-flex flex_row">
                                 <ExportButtonList pipe_dict={this.state.pipe_dict}
                                                   body_height={this._bodyHeight()}
                                                   value={this.state.selected_export}
                                                   handleChange={this._handleExportListChange}
                                 />
                                 <Divider/>
                                 <div id="exports-body" style={{padding: 15, width: "80%", height: this._bodyHeight(), display: "inline-block"}}
                                      className="contingent-scroll" dangerouslySetInnerHTML={exports_body_dict}/>
                             </div>
                             <div id="exports-footing"
                                  ref={this.footer_ref}
                                  className="d-flex flex-row justify-content-between">
                                 <span id="exports-info" className="bottom-heading-element ml-2">{this.state.exports_info_value}</span>
                                 <FormGroup label="max rows" inline={true}>
                                     <SelectList option_list={[25, 100, 250, 500]}
                                                 onChange={this._handleMaxRowsChange}
                                                 the_value={this.state.max_rows}
                                                 minimal={true}
                                                 fontSize={11}
                                         />
                                 </FormGroup>
                             </div>
                         </React.Fragment>
                 }
                 </div>
             </Card>
        )
    }
}

ExportsViewer.propTypes = {
    available_height: PropTypes.number,
    console_is_shrunk: PropTypes.bool,
    console_is_zoomed: PropTypes.bool,
    setUpdate: PropTypes.func,
    tsocket:PropTypes.object,
    style: PropTypes.object
};

ExportsViewer.defaultProps = {
    style: {}
};


