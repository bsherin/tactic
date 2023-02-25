

import React from "react";
import PropTypes from 'prop-types';

import { FormGroup, InputGroup, Button, Divider, Switch, HTMLSelect, TextArea, Collapse, Card, Elevation } from "@blueprintjs/core";
import _ from 'lodash';

import {ReactCodemirror} from "./react-codemirror.js";
import {BpSelect, BpSelectAdvanced} from "./blueprint_mdata_fields.js"
import {doBinding, propsAreEqual, isInt} from "./utilities_react.js";

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

    _updateValue(att_name, new_value, callback) {
        this.props.updateValue(att_name, new_value, callback)
    }

    _submitOptions(e) {
        this.props.handleSubmit(this.props.tile_id);
        e.preventDefault()
    }

    render() {
        var all_items = [];
        var section_items = null;
        var in_section = false;
        var option_items = all_items;
        var current_section_att_name = "";
        var current_section_display_text = "";
        var current_section_start_open = false;
        for (let option of this.props.options) {
            if ("visible" in option && !option["visible"]) continue;
            let att_name = option["name"];
            let display_text;
            if ("display_text" in option && option.display_text != null && option.display_text != "") {
                display_text = option["display_text"]
            }
            else {
                display_text = null
            }
            if (option["type"] == "divider") {
                if (in_section) {
                    all_items.push(
                        <FormSection att_name={current_section_att_name}
                                     key={current_section_att_name}
                                     display_text={current_section_display_text}
                                     section_items={section_items}
                                     start_open={current_section_start_open}/>
                    )
                }
                section_items = [];
                option_items = section_items;
                in_section = true;
                current_section_att_name = att_name;
                current_section_display_text = display_text;
                if ("start_open" in option) {
                    current_section_start_open = option["start_open"]
                }
                else {
                    current_section_start_open = false
                }
                continue;
            }
            if (selector_types.includes(option["type"])) {
                option_items.push(<SelectOption att_name={att_name}
                                                display_text={display_text}
                                                key={att_name}
                                                choice_list={option["option_list"]}
                                                value={option.starting_value}
                                                buttonIcon={selector_type_icons[option["type"]]}
                                                updateValue={this._updateValue}/>)
            }
            else switch (option["type"]) {
                case "pipe_select":
                    option_items.push(<PipeOption att_name={att_name}
                                                  display_text={display_text}
                                                  key={att_name}
                                                  value={_.cloneDeep(option.starting_value)}
                                                  pipe_dict={_.cloneDeep(option["pipe_dict"])}
                                                  updateValue={this._updateValue}
                    />);
                    break;
                case "boolean":
                    option_items.push(<BoolOption att_name={att_name}
                                                  display_text={display_text}
                                                  key={att_name}
                                                  value={option.starting_value}
                                                  updateValue={this._updateValue}
                    />);
                    break;
                case "textarea":
                    option_items.push(<TextAreaOption att_name={att_name}
                                                      display_text={display_text}
                                                      key={att_name}
                                                      value={option.starting_value}
                                                      updateValue={this._updateValue}
                    />);
                    break;
                case "codearea":
                    option_items.push(<CodeAreaOption att_name={att_name}
                                                      display_text={display_text}
                                                      dark_theme={this.props.dark_theme}
                                                      key={att_name}
                                                      value={option.starting_value}
                                                      updateValue={this._updateValue}
                    />);
                    break;
                case "text":
                    option_items.push(<TextOption att_name={att_name}
                                                  display_text={display_text}
                                                  key={att_name}
                                                  value={option.starting_value}
                                                  leftIcon="paragraph"
                                                  updateValue={this._updateValue}
                    />);
                    break;
                case "int":
                    option_items.push(<IntOption att_name={att_name}
                                                 display_text={display_text}
                                                 key={att_name}
                                                 value={option.starting_value}
                                                 updateValue={this._updateValue}
                    />);
                    break;

                case "float":
                    option_items.push(<FloatOption att_name={att_name}
                                                   display_text={display_text}
                                                   key={att_name}
                                                   value={option.starting_value}
                                                   updateValue={this._updateValue}
                    />);
                    break;
                case "divider":
                    option_items.push(<DividerOption att_name={att_name}
                                                     display_text={display_text}
                                                   key={att_name}
                    />);
                    break;
                default:
                    break;
            }
        }
        if (in_section == true) {
            all_items.push(
                <FormSection att_name={current_section_att_name}
                             key={current_section_att_name}
                             display_text={current_section_display_text}
                             section_items={section_items}
                             start_open={current_section_start_open}/>
            )
        }
        return (
            <React.Fragment>
                <form className="form-display-area" onSubmit={this._submitOptions}>
                    {all_items}
                </form>
                <Button text="Submit" intent="primary" onClick={this._submitOptions}/>
            </React.Fragment>
        )
    }

}

TileForm.propTypes = {
    tile_id: PropTypes.string,
    dark_theme: PropTypes.bool,
    options: PropTypes.array,
    handleSubmit: PropTypes.func,
    updateValue: PropTypes.func
};

class FormSection extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            isOpen: this.props.start_open
        }
    }

    _handleClick() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render() {
        let label = this.props.display_text == null ? this.props.att_name : this.props.display_text;
        let but_bottom_margin = this.state.isOpen ? 10 : 20;
        return (
            <React.Fragment>
                <Button onClick={this._handleClick}
                        text={label}
                        large={false}
                        outlined={true}
                        intent="primary"
                        style={{width: "fit-content", marginBottom: but_bottom_margin, marginTop: 10}}
                    />
                <Collapse isOpen={this.state.isOpen}>
                    <Card interactive={false}
                          elevation={Elevation.TWO}
                          style={{boxShadow: "none", marginBottom: 10, borderRadius: 10}}
                    >
                        {this.props.section_items}
                    </Card>
                </Collapse>
            </React.Fragment>
        )
    }
}

FormSection.propTypes = {
    att_name: PropTypes.string,
    section_items: PropTypes.array,
    start_open: PropTypes.bool,
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
};

FormSection.defaultProps = {
    start_open: true
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
        let label = this.props.display_text == null ? this.props.att_name : this.props.display_text;
        return (
            <div className="tile-form-divider" style={{marginTop: 25, marginBottom: 15}}>

                <div style={{paddingLeft: 20, fontSize: 25}}>
                    {label}
                </div>
                <Divider/>
            </div>
        )
    }
}

DividerOption.propTypes = {
    att_name: PropTypes.string,
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
};

class TextOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.current_timer = null;
        this.state = {
            temp_text: null
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props) || nextState.temp_text != this.state.temp_text
    }

    _updateMe(event) {
        if (this.current_timer) {
            clearTimeout(this.current_timer);
            this.current_timer = null;
        }
        let self = this;
        this.current_timer = setTimeout(() => {
            self.current_timer = null;
            self.props.updateValue(this.props.att_name, event.target.value)
        }, 500);
        this.setState({temp_text: event.target.value})
    }

    render() {
        let label = this.props.display_text == null ? this.props.att_name : this.props.display_text;
        let val_to_show = this.current_timer ? this.state.temp_text : this.props.value;
        return (
            <FormGroup label={label}>
                <InputGroup asyncControl={false} type="text" small={false} leftIcon={this.props.leftIcon}
                            onChange={this._updateMe} value={val_to_show}/>
            </FormGroup>
        )
    }
}

TextOption.propTypes = {
    att_name: PropTypes.string,
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    value:  PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func,
    leftIcon: PropTypes.string
};

class IntOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            am_empty: props.value == "",
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props) || nextState.am_empty != this.state.am_empty;
    }

    _updateMe(att_name, val) {
        let self = this;
        if (val.length == 0) {
            this.setState({am_empty: true})
        }
        else if (isInt(val)) {
            self.props.updateValue(this.props.att_name, val, ()=>{
                this.setState({am_empty: false})
            })
        }
    }

    render () {
        let label = this.props.display_text == null ? this.props.att_name : this.props.display_text;
        let val_to_show = this.state.am_empty ? "" : this.props.value;
        return (
            <TextOption att_name={label} leftIcon="numerical"
                                  key={this.props.att_name}
                                  value={val_to_show}
                                  updateValue={this._updateMe}
                />
        )
    }
}

IntOption.propTypes = {
    att_name: PropTypes.string,
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    value:  PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};

class FloatOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            temp_val: null
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props) || nextState.temp_val != this.state.temp_val
    }

    _updateMe(att_name, val) {
        let self = this;
        if (val.length == 0) {
            this.setState({temp_val: ""})
        }
        else if (val == ".") {
            this.setState({temp_val: "."})
        }
        else if (!isNaN(val)) {
            self.props.updateValue(this.props.att_name, val, ()=> {
                this.setState({temp_val: null})
            })
        }
    }

    render () {
        let val_to_show = this.state.temp_val == null ? this.props.value : this.state.temp_val;
        return (
            <TextOption att_name={this.props.att_name} leftIcon="numerical"
                        display_text={this.props.display_text}
                                  key={this.props.att_name}
                                  value={val_to_show}
                                  updateValue={this._updateMe}
                />
        )
    }
}

FloatOption.propTypes = {
    att_name: PropTypes.string,
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
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
        let label = this.props.display_text == null ? this.props.att_name : this.props.display_text;
        return (
            <Switch label={label}
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
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
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
        let label = this.props.display_text == null ? this.props.att_name : this.props.display_text;
        return (
            <FormGroup label={label}>
                <ReactCodemirror handleChange={this._updateMe}
                                 dark_theme={this.props.dark_theme}
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
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    dark_theme: PropTypes.bool,
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
        let label = this.props.display_text == null ? this.props.att_name : this.props.display_text;
        return (
            <FormGroup label={label}>
                <TextArea  onChange={this._updateMe}
                           inputRef={this.inputRef}
                              small={false} value={this.props.value}/>
            </FormGroup>
        )
    }
}

TextAreaOption.propTypes = {
    att_name: PropTypes.string,
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
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
        let label = this.props.display_text == null ? this.props.att_name : this.props.display_text;
        return (
            <FormGroup label={label}>
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
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
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
        let label = this.props.display_text == null ? this.props.att_name : this.props.display_text;
        return (
            <FormGroup label={label}>
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
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
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


