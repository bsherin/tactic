import React from "react";
import {Fragment, useState, useEffect, useRef, memo} from "react";
import PropTypes from 'prop-types';

import {FormGroup, InputGroup, Button, Divider, Switch,
    TextArea, Collapse, Card, Elevation} from "@blueprintjs/core";
import _ from 'lodash';

import {ReactCodemirror} from "./react-codemirror";
import {BpSelect, BpSelectAdvanced} from "./blueprint_mdata_fields"
import {isInt} from "./utilities_react";

import {PoolAddressSelector} from "./pool_tree";

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

function TileForm(props) {

    function _updateValue(att_name, new_value, callback) {
        props.updateValue(att_name, new_value, callback)
    }

    function _submitOptions(e) {
        props.handleSubmit(props.tile_id);
        e.preventDefault()
    }

    var all_items = [];
    var section_items = null;
    var in_section = false;
    var option_items = all_items;
    var current_section_att_name = "";
    var current_section_display_text = "";
    var current_section_start_open = false;
    for (let option of props.options) {
        if ("visible" in option && !option["visible"]) continue;
        let att_name = option["name"];
        let display_text;
        if ("display_text" in option && option.display_text != null && option.display_text != "") {
            display_text = option["display_text"]
        } else {
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
            } else {
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
                                            updateValue={_updateValue}/>)
        } else switch (option["type"]) {
            case "pipe_select":
                option_items.push(<PipeOption att_name={att_name}
                                              display_text={display_text}
                                              key={att_name}
                                              value={_.cloneDeep(option.starting_value)}
                                              pipe_dict={_.cloneDeep(option["pipe_dict"])}
                                              updateValue={_updateValue}
                />);
                break;
            case "boolean":
                option_items.push(<BoolOption att_name={att_name}
                                              display_text={display_text}
                                              key={att_name}
                                              value={option.starting_value}
                                              updateValue={_updateValue}
                />);
                break;
            case "textarea":
                option_items.push(<TextAreaOption att_name={att_name}
                                                  display_text={display_text}
                                                  key={att_name}
                                                  value={option.starting_value}
                                                  updateValue={_updateValue}
                />);
                break;
            case "codearea":
                option_items.push(<CodeAreaOption att_name={att_name}
                                                  display_text={display_text}
                                                  key={att_name}
                                                  value={option.starting_value}
                                                  updateValue={_updateValue}
                />);
                break;
            case "text":
                option_items.push(<TextOption att_name={att_name}
                                              display_text={display_text}
                                              key={att_name}
                                              value={option.starting_value}
                                              leftIcon="paragraph"
                                              updateValue={_updateValue}
                />);
                break;
            case "int":
                option_items.push(<IntOption att_name={att_name}
                                             display_text={display_text}
                                             key={att_name}
                                             value={option.starting_value}
                                             updateValue={_updateValue}
                />);
                break;

            case "float":
                option_items.push(<FloatOption att_name={att_name}
                                               display_text={display_text}
                                               key={att_name}
                                               value={option.starting_value}
                                               updateValue={_updateValue}
                />);
                break;
            case "pool_select":
                option_items.push(<PoolOption att_name={att_name}
                                              tile_id={props.tile_id}
                                               display_text={display_text}
                                               key={att_name}
                                               value={option.starting_value}
                                               select_type={option.pool_select_type}
                                               updateValue={_updateValue}
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
        <Fragment>
            <form className="form-display-area" onSubmit={_submitOptions}>
                {all_items}
            </form>
            <Button text="Submit" intent="primary" style={{width: "100%"}} onClick={_submitOptions}/>
        </Fragment>
    )
}

TileForm.propTypes = {
    tile_id: PropTypes.string,
    dark_theme: PropTypes.bool,
    options: PropTypes.array,
    handleSubmit: PropTypes.func,
    updateValue: PropTypes.func
};

TileForm = memo(TileForm);

function FormSection(props) {
    props = {
        start_open: true,
        ...props
    };
    const [isOpen, setIsOpen] = useState(props.start_open);

    function _handleClick() {
        setIsOpen(!isOpen);
    }

    let label = props.display_text == null ? props.att_name : props.display_text;
    let but_bottom_margin = isOpen ? 10 : 20;
    return (
        <Fragment>
            <Button onClick={_handleClick}
                    text={label}
                    large={false}
                    outlined={true}
                    intent="primary"
                    style={{width: "fit-content", marginBottom: but_bottom_margin, marginTop: 10}}
            />
            <Collapse isOpen={isOpen}>
                <Card interactive={false}
                      elevation={Elevation.TWO}
                      style={{boxShadow: "none", marginBottom: 10, borderRadius: 10}}
                >
                    {props.section_items}
                </Card>
            </Collapse>
        </Fragment>
    )
}

FormSection = memo(FormSection);

function DividerOption(props) {

    let label = props.display_text == null ? props.att_name : props.display_text;
    return (
        <div className="tile-form-divider" style={{marginTop: 25, marginBottom: 15}}>

            <div style={{paddingLeft: 20, fontSize: 25}}>
                {label}
            </div>
            <Divider/>
        </div>
    )
}

DividerOption.propTypes = {
    att_name: PropTypes.string,
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
};

DividerOption = memo(DividerOption);

function TextOption(props) {

    const current_timer = useRef(null);
    const [temp_text, set_temp_text] = useState(null);

    function _updateMe(event) {
        if (current_timer.current) {
            clearTimeout(current_timer.current);
            current_timer.current = null;
        }
        current_timer.current = setTimeout(() => {
            current_timer.current = null;
            props.updateValue(props.att_name, event.target.value)
        }, 500);
        set_temp_text(event.target.value)
    }

    let label = props.display_text == null ? props.att_name : props.display_text;
    let val_to_show = current_timer.current ? temp_text : props.value;
    return (
        <FormGroup label={label}>
            <InputGroup asyncControl={false} type="text" small={false} leftIcon={props.leftIcon}
                        onChange={_updateMe} value={val_to_show}/>
        </FormGroup>
    )
}

TextOption.propTypes = {
    att_name: PropTypes.string,
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func,
    leftIcon: PropTypes.string
};

TextOption = memo(TextOption);

function IntOption(props) {

    const [am_empty, set_am_empty] = useState(props.value == "");

    function _updateMe(att_name, val) {
        if (val.length == 0) {
            set_am_empty(true)
        } else if (isInt(val)) {
            props.updateValue(props.att_name, val, () => {
                set_am_empty(false)
            })
        }
    }

    let label = props.display_text == null ? props.att_name : props.display_text;
    let val_to_show = am_empty ? "" : props.value;
    return (
        <TextOption att_name={label} leftIcon="numerical"
                    key={props.att_name}
                    value={val_to_show}
                    updateValue={_updateMe}
        />
    )
}

IntOption.propTypes = {
    att_name: PropTypes.string,
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};

IntOption = memo(IntOption);

function FloatOption(props) {

    const [temp_val, set_temp_val] = useState(null);

    function _updateMe(att_name, val) {

        if (val.length == 0) {
            set_temp_val("")
        } else if (val == ".") {
            set_temp_val(".")
        } else if (!isNaN(val)) {
            props.updateValue(props.att_name, val, () => {
                set_temp_val(null)
            })
        }
    }

    let val_to_show = temp_val == null ? props.value : temp_val;
    return (
        <TextOption att_name={props.att_name} leftIcon="numerical"
                    display_text={props.display_text}
                    key={props.att_name}
                    value={val_to_show}
                    updateValue={_updateMe}
        />
    )
}

FloatOption.propTypes = {
    att_name: PropTypes.string,
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};

FloatOption = memo(FloatOption);

function BoolOption(props) {

    function _updateMe(event) {
        props.updateValue(props.att_name, event.target.checked)
    }

    function boolify(the_var) {
        if (typeof the_var == "boolean") {
            return the_var
        }
        return (the_var == "True") || (the_var == "true");
    }

    let label = props.display_text == null ? props.att_name : props.display_text;
    return (
        <Switch label={label}
                checked={boolify(props.value)}
                onChange={_updateMe}
                innerLabel="False"
                innerLabelChecked="True"
                alignIndicator="center"
        />
    )
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

BoolOption = memo(BoolOption);

function CodeAreaOption(props) {

    function _updateMe(newval) {
        props.updateValue(props.att_name, newval)
    }

    let label = props.display_text == null ? props.att_name : props.display_text;
    return (
        <FormGroup label={label}>
            <ReactCodemirror handleChange={_updateMe}
                             code_content={props.value}
                             saveMe={null}
                             code_container_height={100}
            />
        </FormGroup>
    )
}

CodeAreaOption.propTypes = {
    att_name: PropTypes.string,
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    dark_theme: PropTypes.bool,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};

CodeAreaOption = memo(CodeAreaOption);

function TextAreaOption(props) {
    const inputRef = useRef(null);
    const [cursor, set_cursor] = useState(null);

    useEffect(() => {
        _setCursorPositions();
    });

    function _setCursorPositions() {
        //reset the cursor position for input
        inputRef.current.selectionStart = cursor;
        inputRef.current.selectionEnd = cursor;
    }

    function _updateMe(event) {
        set_cursor(event.target.selectionStart);
        props.updateValue(props.att_name, event.target.value)
    }

    let label = props.display_text == null ? props.att_name : props.display_text;
    return (
        <FormGroup label={label}>
            <TextArea onChange={_updateMe}
                      inputRef={inputRef}
                      small={false} value={props.value}/>
        </FormGroup>
    )
}

TextAreaOption.propTypes = {
    att_name: PropTypes.string,
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};

TextAreaOption = memo(TextAreaOption);

function SelectOption(props) {

    function _updateMe(val) {
        props.updateValue(props.att_name, val)
    }

    let label = props.display_text == null ? props.att_name : props.display_text;
    return (
        <FormGroup label={label}>
            <BpSelect onChange={_updateMe}
                      value={props.value}
                      buttonIcon={props.buttonIcon}
                      options={props.choice_list}/>
        </FormGroup>
    )
}

SelectOption.propTypes = {
    att_name: PropTypes.string,
    display_text: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    choice_list: PropTypes.array,
    buttonIcon: PropTypes.string,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    updateValue: PropTypes.func
};

SelectOption = memo(SelectOption);

function PoolOption(props) {
    const [isOpen, setIsOpen] = useState(false);

    function _updateMe(newval) {
        props.updateValue(props.att_name, newval)
    }

    let label = props.display_text == null ? props.att_name : props.display_text;
    return (
        <FormGroup label={label}>
            <PoolAddressSelector value={props.value}
                                 tsocket={null}
                                 select_type={props.select_type}
                                 setValue={_updateMe}
            />
        </FormGroup>
    )
}

PoolOption = memo(PoolOption);

function PipeOption(props) {

    function _updateMe(item) {
        props.updateValue(props.att_name, item["value"])
    }

    function create_choice_list() {
        let choice_list = [];
        for (let group in props.pipe_dict) {
            choice_list.push({text: group, value: group + "_group", isgroup: true});
            for (let entry of props.pipe_dict[group]) {
                choice_list.push({text: entry[1], value: entry[0], isgroup: false})
            }
        }
        return choice_list
    }

    function _value_dict() {
        let value_dict = {};
        for (let group in props.pipe_dict) {
            for (let entry of props.pipe_dict[group]) {
                value_dict[entry[0]] = entry[1];
            }
        }
        return value_dict
    }

    let vdict = _value_dict();
    let full_value = {text: vdict[props.value], value: props.value, isgroup: false};
    let label = props.display_text == null ? props.att_name : props.display_text;
    return (
        <FormGroup label={label}>
            <BpSelectAdvanced onChange={_updateMe}
                              readOnly={false}
                              value={full_value}
                              buttonIcon="flow-end"
                              options={create_choice_list()}/>
        </FormGroup>
    )
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

PipeOption = memo(PipeOption);


