

import React from "react";
import PropTypes from 'prop-types';

import { FormGroup, InputGroup, Button, Divider, Switch, HTMLSelect, TextArea } from "@blueprintjs/core";
import _ from 'lodash';

import {ReactCodemirror} from "./react-codemirror.js";
import {BpSelect, BpSelectAdvanced} from "./blueprint_mdata_fields.js"
import {doBinding, propsAreEqual} from "./utilities_react.js";

export {TileForm}

let selector_types = ["column_select", "tokenizer_select", "weight_function_select",
            "cluster_metric", "tile_select", "document_select", "list_select", "collection_select",
            "function_select", "class_select", "palette_select", "custom_list"];

let selector_type_icons = {
    column_select: "one-column",
    tokenizer_select: "function",
    weight_function_select: "function",
    cluster_metric: "function",
    tile_select: "application",
    document_select: "document",
    list_select: "properties",
    collection_select: "database",
    function_select: "function",
    class_select: "code",
    palette_select: "tint",
    custom_list: "property"
};

class TileForm extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    _updateValue(att_name, new_value) {
        this.props.updateValue(att_name, new_value)
    }

    _submitOptions(e) {
        this.props.handleSubmit(this.props.tile_id);
        e.preventDefault()
    }

    render() {
        var option_items = [];
        for (let option of this.props.options) {
            if ("visible" in option && !option["visible"]) continue;
            let att_name = option["name"];
            if (selector_types.includes(option["type"])) {
                option_items.push(<SelectOption att_name={att_name}
                                                key={att_name}
                                                choice_list={option["option_list"]}
                                                value={option.starting_value}
                                                buttonIcon={selector_type_icons[option["type"]]}
                                                updateValue={this._updateValue}/>)
            }
            else switch (option["type"]) {
                case "pipe_select":
                    option_items.push(<PipeOption att_name={att_name}
                                                  key={att_name}
                                                  value={_.cloneDeep(option.starting_value)}
                                                  pipe_dict={_.cloneDeep(option["pipe_dict"])}
                                                  updateValue={this._updateValue}
                    />);
                    break;
                case "boolean":
                    option_items.push(<BoolOption att_name={att_name}
                                                  key={att_name}
                                                  value={option.starting_value}
                                                  updateValue={this._updateValue}
                    />);
                    break;
                case "textarea":
                    option_items.push(<TextAreaOption att_name={att_name}
                                                      key={att_name}
                                                      value={option.starting_value}
                                                      updateValue={this._updateValue}
                    />);
                    break;
                case "codearea":
                    option_items.push(<CodeAreaOption att_name={att_name}
                                                      key={att_name}
                                                      value={option.starting_value}
                                                      updateValue={this._updateValue}
                    />);
                    break;
                case "text":
                    option_items.push(<TextOption att_name={att_name}
                                                  key={att_name}
                                                  value={option.starting_value}
                                                  leftIcon="paragraph"
                                                  updateValue={this._updateValue}
                    />);
                    break;
                case "int":
                    option_items.push(<IntOption att_name={att_name}
                                                 key={att_name}
                                                 value={option.starting_value}
                                                 updateValue={this._updateValue}
                    />);
                    break;

                case "float":
                    option_items.push(<FloatOption att_name={att_name}
                                                   key={att_name}
                                                   value={option.starting_value}
                                                   updateValue={this._updateValue}
                    />);
                    break;
                case "divider":
                    option_items.push(<DividerOption att_name={att_name}
                                                   key={att_name}
                    />);
                    break;
                default:
                    break;
            }
        }
        return (
            <React.Fragment>
                <form className="form-display-area" onSubmit={this._submitOptions}>
                    {option_items}
                </form>
                <Button text="Submit" intent="primary" onClick={this._submitOptions}/>
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

class DividerOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    render() {
        return (
            <div className="tile-form-divider" style={{marginTop: 25, marginBottom: 15}}>

                <div style={{paddingLeft: 20, fontSize: 25}}>
                    {this.props.att_name}
                </div>
                <Divider/>
            </div>
        )
    }
}

DividerOption.propTypes = {
    att_name: PropTypes.string
};

class TextOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.value)
    }

    render() {
        return (
            <FormGroup label={this.props.att_name}>
                <InputGroup asyncControl={true} type="text" small={false} leftIcon={this.props.leftIcon}
                            onChange={this._updateMe} value={this.props.value}/>
            </FormGroup>
        )
    }
}

TextOption.propTypes = {
    att_name: PropTypes.string,
    value:  PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func,
    leftIcon: PropTypes.string
};

class IntOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    _updateMe(att_name, val) {
        if ((val.length == 0) || ((!isNaN(Number(val))) && (!isNaN(parseInt(val))))) {
            this.props.updateValue(this.props.att_name, val)
        }

    }

    render () {
        return (
            <TextOption att_name={this.props.att_name} leftIcon="numerical"
                                  key={this.props.att_name}
                                  value={this.props.value}
                                  updateValue={this._updateMe}
                />
        )
    }
}

IntOption.propTypes = {
    att_name: PropTypes.string,
    value:  PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};

class FloatOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    _updateMe(att_name, val) {
        if ((val.length == 0) || (val == ".") || ((!isNaN(Number(val))) && (!isNaN(parseFloat(val))))) {
            this.props.updateValue(this.props.att_name, val)
        }

    }

    render () {
        return (
            <TextOption att_name={this.props.att_name} leftIcon="numerical"
                                  key={this.props.att_name}
                                  value={this.props.value}
                                  updateValue={this._updateMe}
                />
        )
    }
}

FloatOption.propTypes = {
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

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.checked)
    }

    boolify(the_var) {
        if (typeof the_var == "boolean") {
            return the_var
        }
        return (the_var == "True") || (the_var == "true");
    }

    render() {
        return (
            <Switch label={this.props.att_name}
                       checked={this.boolify(this.props.value)}
                       onChange={this._updateMe}
                       innerLabel="False"
                       innerLabelChecked="True"
                       alignIndicator="center"
            />
        )
    }
}

BoolOption.propTypes = {
    att_name: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.string]),
    updateValue: PropTypes.func
};

class CodeAreaOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    _updateMe(newval) {
        this.props.updateValue(this.props.att_name, newval)
    }

    render() {
        return (
            <FormGroup label={this.props.att_name}>
                <ReactCodemirror handleChange={this._updateMe}
                                 code_content={this.props.value}
                                 saveMe={null}
                                 code_container_height={100}
                />
            </FormGroup>
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
        doBinding(this);
        this.inputRef = React.createRef();
        this.cursor = null;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    componentDidUpdate() {
        this._setCursorPositions();
      }

      _setCursorPositions = () => {
        //reset the cursor position for input
        this.inputRef.current.selectionStart = this.cursor;
        this.inputRef.current.selectionEnd = this.cursor;
      };

    _updateMe(event) {
        this.cursor = event.target.selectionStart;
        this.props.updateValue(this.props.att_name, event.target.value)
    }
    render() {
        return (
            <FormGroup label={this.props.att_name}>
                <TextArea  onChange={this._updateMe}
                           inputRef={this.inputRef}
                              small={false} value={this.props.value}/>
            </FormGroup>
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

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    _updateMe(val) {
        this.props.updateValue(this.props.att_name, val)
    }

    render() {
        return (
            <FormGroup label={this.props.att_name}>
                <BpSelect  onChange={this._updateMe}
                          value={this.props.value}
                           buttonIcon={this.props.buttonIcon}
                            options={this.props.choice_list}/>
            </FormGroup>
        )
    }
}

SelectOption.propTypes = {
    att_name: PropTypes.string,
    choice_list: PropTypes.array,
    buttonIcon: PropTypes.string,
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

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props)
    }

    _updateMe(item) {
        this.props.updateValue(this.props.att_name, item["value"])
    }

    create_choice_list() {
        let choice_list = [];
        for (let group in this.props.pipe_dict) {
            choice_list.push({text: group, value: group + "_group", isgroup: true});
            for (let entry of this.props.pipe_dict[group]) {
                choice_list.push({text: entry[1], value: entry[0], isgroup: false})
            }
        }
        return choice_list
    }

    _value_dict() {
        let value_dict = {};
        for (let group in this.props.pipe_dict) {
            for (let entry of this.props.pipe_dict[group]) {
                value_dict[entry[0]] = entry[1];
            }
        }
        return value_dict
    }

    render() {
        let vdict = this._value_dict();
        let full_value = {text: vdict[this.props.value], value: this.props.value, isgroup: false};
        return (
            <FormGroup label={this.props.att_name}>
                <BpSelectAdvanced  onChange={this._updateMe}
                                   value={full_value}
                                   buttonIcon="flow-end"
                                   options={this.create_choice_list()}/>
            </FormGroup>
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

class PipeOptionOld extends React.Component {
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
        <FormGroup label={this.props.att_name}>
            <HTMLSelect onChange={this._updateMe}
                        value={this.props.value}>
                {this.create_groups()}
            </HTMLSelect>
        </FormGroup>
        )
    }
}

PipeOptionOld.propTypes = {
    att_name: PropTypes.string,
    pipe_dict: PropTypes.object,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};


