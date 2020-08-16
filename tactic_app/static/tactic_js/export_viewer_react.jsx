

import React from "react";
import PropTypes from 'prop-types';
import { HTMLSelect, Card, Button, InputGroup, Spinner } from "@blueprintjs/core";

import {GlyphButton, SelectList} from "./blueprint_react_widgets.js";
import {postWithCallback} from "./communication_react.js"
import {doFlash} from "./toaster.js"
import {doBinding} from "./utilities_react.js";

export {ExportsViewer}

class ExportListSelect extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.select_ref = null;
        this.export_index = {}
    }

    _updateMe(event) {
        let fullname = event.target.value;
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

    create_groups() {
        let groups = [];
        for (let group in this.props.pipe_dict) {
            let group_items = [];
            for (let entry of this.props.pipe_dict[group]) {
                let fullname = entry[0];
                let shortname = entry[1];
                this.export_index[fullname] = {tilename: group, shortname: shortname}
                group_items.push(<option key={fullname} value={fullname}>
                    {shortname}
                </option>)
            }
            groups.push(
                <optgroup key={group} label={group}>
                    {group_items}
                </optgroup>
            )
        }
        return groups
    }

    _handleSelectRef(the_ref) {
        this.select_ref = the_ref;
    }

    render() {
        return (
            <HTMLSelect elementRef={this._handleSelectRef}
                           onChange={this._updateMe}
                           minimal={true}
                            name="exportlist"
                           value={this.props.value}>
                {this.create_groups()}
            </HTMLSelect>
        )
    }
}

ExportListSelect.propTypes = {
    pipe_dict: PropTypes.object,
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
        this.state = {
            selected_export: "",
            selected_export_tilename: null,
            key_list: null,
            key_list_value: null,
            tail_value: "",
            exports_info_value: null,
            selected_export_short_name: null,
            show_spinner: false,
            exports_body_value: "",
            type: null,
            pipe_dict: {},
        }
    }

    componentDidMount(){
        this.props.setUpdate(this._updateExportsList);
        this.props.tsocket.socket.off("export-viewer-message");
        this.props.tsocket.socket.on("export-viewer-message", this._handleExportViewerMessage);
        this._updateExportsList()
    }

    _handleExportViewerMessage(data) {
        let self = this;
        let handlerDict = {
            update_exports_popup: ()=>self._updateExportsList()
        };
        handlerDict[data.export_viewer_message](data)
    }

    _updateExportsList() {
        let self = this;
        postWithCallback(window.main_id, "get_full_pipe_dict", {}, function (data) {
            self.setState({pipe_dict: data.pipe_dict, pipe_dict_updated: true})
        })
    }

    _refresh() {
        this._handleExportListChange(this.state.selected_export, this.state.selected_export_short_name, true)
    }

    _eval(e = null) {
        this._startSpinner();
        let send_data = {"export_name": this.state.selected_export, "tail": this.state.tail_value};
        if (this.state.key_list) {
            send_data.key = this.state.key_list_value
        }
        let self = this;
        postWithCallback(main_id, "evaluate_export", send_data, function (data) {
            self.setState({exports_body_value: data.the_html, show_spinner: false})
        });
        if (e) e.preventDefault();
    }

    _startSpinner() {
        this.setState({show_spinner: true});
    }

    _handleExportListChange(fullname, shortname, tilename, force_refresh = false) {
        let self = this;
        if (!force_refresh && fullname == this.state.selected_export) return;
        this.setState({show_spinner: true,
            selected_export: fullname,
            selected_export_tilename: tilename,
            selected_export_short_name: shortname});
        postWithCallback(window.main_id, "get_export_info", {"export_name": fullname}, function (data) {
            let new_state = {
                type: data.type,
                exports_info_value: data.info_string,
                tail_value: "",
                show_spinner: false
            };
            if (data.hasOwnProperty("key_list")) {
                new_state.key_list = data.key_list
                if (data.hasOwnProperty("key_list_value")) {
                    new_state.key_list_value = data.key_list_value
                }
                else {
                    if (new_state.key_list.length > 0) {
                        new_state.key_list_value = data.key_list[0]
                    }
                }
            } else {
                new_state.key_list = null
                new_state.key_list_value = null
            }
            self.setState(new_state)
        })
    }

    _handleKeyListChange(new_value) {
        this.setState({key_list_value: new_value})
    }

    _handleTailChange(event) {
        this.setState({tail_value: event.target.value})
    }

    _bodyHeight() {
        if (this.header_ref && this.header_ref.current) {
            return this.props.available_height - $(this.header_ref.current).outerHeight()
        }
        else {
            return this.props.available_height - 75
        }
    }

    _sendToConsole() {
        const tail = this.state.tail_value;
        let tilename = this.state.selected_export_tilename
        let shortname = this.state.selected_export_short_name

        let key_string = "";
        if (!(this.state.key_list == null)) {
            key_string = `["${this.state.key_list_value}"]`;
        }

        let the_text = `Tiles["${tilename}"]["${shortname}"]`+ key_string + tail;

        let self = this;
        postWithCallback("host", "print_code_area_to_console",
            {"console_text": the_text, "user_id": window.user_id, "main_id": window.main_id}, function (data) {
            if (!data.success) {
                doFlash(data)
            }
        });
    }

    render () {
        let exports_body_dict = {__html: this.state.exports_body_value};
        let butclass = "notclose bottom-heading-element bottom-heading-element-button";
        let exports_class = this.props.console_is_shrunk ? "am-shrunk" : "not-shrunk";
        if (this.props.console_is_zoomed) {
            exports_class = "am-zoomed"
        }
        return (
             <Card id="exports-panel" elevation={2} className={"mr-3 " + exports_class}>
                 <div className="d-flex flex-column justify-content-around">
                     <div id="exports-heading"
                          ref={this.header_ref}
                         className="d-flex flex-row justify-content-start">
                         <GlyphButton handleClick={this._sendToConsole}
                                      intent="primary"
                                      tooltip="Send code to the console"
                                      style={{marginLeft: 6}}
                                      icon="direction-left"/>
                         <GlyphButton handleClick={this._refresh}
                                      intent="success"
                                      tooltip="Refresh the exports menu and info"
                                      style={{marginLeft: 0}}
                                      icon="refresh"/>
                          <Button onClick={this._eval}
                                     intent="success"
                                       style={{marginRight: 0, marginLeft: 0, padding: 0}}
                                       minimal={true}
                                       small={true}
                                       text="Eval"/>
                         {(Object.keys(this.state.pipe_dict).length > 0) && (
                             <form onSubmit={this._eval} className="d-flex flex-row">
                                 <ExportListSelect pipe_dict={this.state.pipe_dict}
                                                   value={this.state.selected_export}
                                                   handleChange={this._handleExportListChange}/>
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
                                 />
                             </form>
                             )
                         }
                         <span id="exports-info" className="bottom-heading-element ml-2">{this.state.exports_info_value}</span>
                         {this.state.show_spinner &&
                            <Spinner size={13} />
                         }


                     </div>
                     {!this.props.console_is_shrunk &&
                         <div style={{overflowY: "scroll", padding: 15, height: this._bodyHeight(), backgroundColor: "white"}}
                                    dangerouslySetInnerHTML={exports_body_dict}/>
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
    tsocket:PropTypes.object
};
