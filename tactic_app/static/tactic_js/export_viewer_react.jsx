
import {GlyphButton} from "./react_widgets.js";
import {SelectList} from "./react_widgets.js";

export {ExportsViewer}

var Rbs = window.ReactBootstrap;

class ExportListSelect extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.export_index = {}
    }

    _updateMe(event) {
        let fullname = event.target.value;
        this.props.handleChange(fullname, this.export_index[fullname])
    }

    create_groups() {
        let groups = [];
        for (let group in this.props.pipe_dict) {
            let group_items = [];
            for (let fullname in this.props.pipe_dict[group]) {
                let short_name = this.props.pipe_dict[group][fullname].export_name;
                this.export_index[fullname] = short_name;
                group_items.push(<option key={fullname} value={fullname}>
                    {short_name}
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

    render() {
        return (
            <select className="form-control form-control-sm"
                    onChange={this._updateMe}
                    value={this.props.value}>
                {this.create_groups()}
            </select>
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
            key_list: null,
            key_list_value: null,
            tail_value: "",
            exports_info_value: null,
            selected_export_short_name: null,
            show_spinner: false,
            exports_body_value: "",
            type: null
        }
    }

    _refresh() {
        this._handleExportListChange(this.state.selected_export, this.state.selected_export_short_name, true)
    }

    _eval() {
        this._startSpinner();
        let send_data = {"export_name": this.state.selected_export, "tail": this.state.tail_value};
        if (this.state.key_list) {
            send_data.key = this.state.key_list_value
        }
        let self = this;
        postWithCallback(main_id, "evaluate_export", send_data, function (data) {
            self.setState({exports_body_value: data.the_html, show_spinner: false})
        })
    }

    _startSpinner() {
        this.setState({show_spinner: true});
    }

    _handleExportListChange(fullname, shortname, force_refresh = false) {
        let self = this;
        if (!force_refresh && fullname == this.state.selected_export) return;
        this.setState({show_spinner: true, selected_export: fullname, selected_export_short_name: shortname});
        postWithCallback(window.main_id, "get_export_info", {"export_name": fullname}, function (data) {
            let new_state = {
                type: data.type,
                exports_info_value: data.info_string,
                tail_value: "",
                show_spinner: false
            };
            if (data.hasOwnProperty("key_list")) {
                new_state.key_list = data.key_list
            } else {
                new_state.key_list = null
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
        if (this.state.mounted) {
            return this.props.available_height - $(this.header_ref.current).outerHeight() - 35
        }
        else {
            return this.props.available_height - 75
        }
    }


    _sendToConsole() {
        const tail = this.state.tail_value;
        let full_export_name = this.state.selected_export;
        let key_string = "";
        if (!(this.state.key_list == null)) {
            key_string = `["${this.state.key_list_value}"]`;
        }
        let the_text = `self.get_pipe_value("${full_export_name}")` + key_string + tail;

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

        return (
             <Rbs.Card bg="light" id="exports-panel">
                 <Rbs.Card.Header id="exports-heading"
                                 className="align-items-center">
                     <GlyphButton butclass="notclose bottom-heading-element bottom-heading-element-button"
                                  handleClick={this._sendToConsole}
                                  icon_class="far fa-arrow-to-left"/>
                     <GlyphButton butclass="notclose bottom-heading-element bottom-heading-element-button"
                                  handleClick={this._refresh}
                                  icon_class="far fa-redo"/>
                     <button type='button' id="exports-show-button"
                             onClick={this._eval}
                             className='notclose bottom-heading-element bottom-heading-element-button'> Eval
                     </button>
                     <Rbs.Form inline={true} onSubmit={this._eval}>
                        <ExportListSelect pipe_dict={this.props.pipe_dict}
                                          value={this.state.selected_export}
                                          handleChange={this._handleExportListChange}/>
                         {this.state.key_list && <SelectList option_list={this.state.key_list}
                                                               onChange={this._handleKeyListChange}
                                                               the_value={this.state.key_list_value}
                                                               fontSize={11}
                         />
                         }
                         <Rbs.Form.Control as="input" size="sm"
                                           className="bottom-heading-element"
                                           onChange={this._handleTailChange}
                                           value={this.state.tail_value}
                         />
                     </Rbs.Form>
                     <span id="exports-info" className="bottom-heading-element ml-2">{this.state.exports_info_value}</span>
                     {this.state.show_spinner &&
                        <span id="exports-spin-place"><span className="loader-small"></span></span>
                     }

                 </Rbs.Card.Header>
                 <Rbs.Card.Body style={{overflowY: "scroll", height: this._bodyHeight(), backgroundColor: "white"}}
                                dangerouslySetInnerHTML={exports_body_dict}/>
             </Rbs.Card>
        )
    }
}

ExportsViewer.propTypes = {
    pipe_dict: PropTypes.object,
    pipe_dict_updated: PropTypes.bool,
    available_height: PropTypes.number,
};