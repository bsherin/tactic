

import {ReactCodemirror} from "./react-codemirror.js";

export {TileForm}

var Rbs = window.ReactBootstrap;
let Bp = blueprint;

class TileForm extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.selector_types = ["column_select", "tokenizer_select", "weight_function_select",
            "cluster_metric", "tile_select", "document_select", "list_select", "collection_select",
            "function_select", "class_select", "palette_select", "custom_list"
        ]
    }

    _updateValue(att_name, new_value) {
        this.props.updateValue(att_name, new_value)
    }

    _submitOptions() {
        this.props.handleSubmit(this.props.tile_id)
    }

    render() {
        var option_items = [];
        for (let option of this.props.options) {
            let att_name = option["name"];
            if (this.selector_types.includes(option["type"])) {
                option_items.push(<SelectOption att_name={att_name}
                                                key={att_name}
                                                choice_list={option["option_list"]}
                                                value={option.starting_value}
                                                updateValue={this._updateValue}/>)
            }
            else if (option["type"] == "pipe_select") {
                option_items.push(<PipeOption att_name={att_name}
                                              key={att_name}
                                              value={option.starting_value}
                                              pipe_dict={option["pipe_dict"]}
                                              updateValue={this._updateValue}
                />)
            }
            else if (option["type"] == "textarea") {
                option_items.push(<TextAreaOption att_name={att_name}
                                                  key={att_name}
                                                  value={option.starting_value}
                                                  updateValue={this._updateValue}
                />)
            }
            else if (option["type"] == "codearea") {
                option_items.push(<TextAreaOption att_name={att_name}
                                                  key={att_name}
                                                  value={option.starting_value}
                                                  updateValue={this._updateValue}
                />)
            }
            else if ((option["type"] == "text") || (option["type"] == "int")) {
                option_items.push(<TextOption att_name={att_name}
                                              key={att_name}
                                              value={option.starting_value}
                                              updateValue={this._updateValue}
                />)
            }
        }
        return (
            <React.Fragment>
                <form className="form-display-area" onSubmit={this._submitOptions}>
                    {option_items}
                </form>
                <Bp.Button text="Submit" intent="primary" onClick={this._submitOptions}/>
            </React.Fragment>
        )
    }

}

TileForm.propTypes = {
    tile_id: PropTypes.string,
    options: PropTypes.array,
    handleSubmit: PropTypes.func,
    updateValue: PropTypes.func
};

class TextOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.value)
    }
    render() {
        return (
            <Bp.FormGroup label={this.props.att_name}>
                <Bp.InputGroup type="text" small={false} onChange={this._updateMe} value={this.props.value}/>
            </Bp.FormGroup>
        )
    }
}

TextOption.propTypes = {
    att_name: PropTypes.string,
    value:  PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};


class BoolOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.value)
    }
    render() {
        return (
            <Bp.Checkbox label={this.props.att_name}
                         value={this.props.value}
                         onChange={this._updateMe}
                         alignIndicator="right"
            />
        )
    }
}

BoolOption.propTypes = {
    att_name: PropTypes.string,
    value:  PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};

class CodeAreaOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _updateMe(newval) {
        this.props.updateValue(this.props.att_name, newval)
    }

    render() {
        return (
            <Bp.FormGroup label={this.props.att_name}>
                <ReactCodemirror handleChange={this._updateMe}
                                 code_content={this.props.value}
                                 saveMe={null}
                                 code_container_height={100}
                />
            </Bp.FormGroup>
        )
    }
}

CodeAreaOption.propTypes = {
    att_name: PropTypes.string,
    value:  PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};

class TextAreaOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.value)
    }
    render() {
        return (
            <Bp.FormGroup label={this.props.att_name}>
                <Bp.TextArea onChange={this._updateMe}
                              small={false} value={this.props.value}/>
            </Bp.FormGroup>
        )
    }
}

TextAreaOption.propTypes = {
    att_name: PropTypes.string,
    value:  PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};

class SelectOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.value)
    }

    render() {
        let option_items = this.props.choice_list.map((opt, index) =>
                <option key={index}>
                    {opt}
                </option>
        );
        return (
            <Bp.FormGroup label={this.props.att_name}>
                <Bp.HTMLSelect  onChange={this._updateMe}
                              value={this.props.value}>
                    {option_items}
                </Bp.HTMLSelect>
            </Bp.FormGroup>
        )
    }
}

SelectOption.propTypes = {
    att_name: PropTypes.string,
    choice_list: PropTypes.array,
    value:  PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};

class PipeOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.value)
    }

    create_groups() {
        let groups = [];
        for (let group in this.props.pipe_dict) {
            groups.push(
                <optgroup key={group} label={group}>
                    {this.props.pipe_dict[group].map((entry) => (
                        <option key={entry[1]} value={entry[0]}>{entry[1]}</option>)
                    )}
                </optgroup>
            )
        }
        return groups
    }

    render() {
        return (
        <Bp.FormGroup label={this.props.att_name}>
            <HTMLSelect onChange={this._updateMe}
                        value={this.props.value}>
                {this.create_groups()}
            </HTMLSelect>
        </Bp.FormGroup>
        )
    }
}

PipeOption.propTypes = {
    att_name: PropTypes.string,
    pipe_dict: PropTypes.object,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};


