
export {withConsole}

function withConsole(WrappedComponent, tsocket) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            doBinding(this);
            this.state = {
                console_items: [],
                console_item_with_focus: null,
                console_is_shrunk: true
            };
            if (this.props.is_project) {
                this.state.console_items = this.props.interface_state.console_items;
                this.state.console_is_shrunk = this.props.console_is_shrunk
            }
        }

        componentDidMount(){
            tsocket.socket.on("console-message", this._handleConsoleMessage);
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
        render() {
            return (
                <WrappedComponent console_items={this.state.console_items}
                                  console_is_shrunk={this.state.console_is_shrunk}
                                  setConsoleFieldValue={this._setConsoleFieldValue}
                                  setConsoleState={this._setConsoleState}
                                  setConsoleItemValue={this._setConsoleItemValue}
                                  goToNextConsoleCell={this._goToNextCell}
                                  handleConsoleItemDelete={this._closeConsoleItem}
                                  resortConsoleItems={this._resortConsoleItems}
                                  {...this.props}/>
            )
        }
    }

}