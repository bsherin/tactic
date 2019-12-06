

import { ReactCodemirror } from "./react-codemirror.js";
import { BpSelect, BpSelectAdvanced } from "./blueprint_mdata_fields.js";

export { TileForm };

let Bp = blueprint;

let selector_types = ["column_select", "tokenizer_select", "weight_function_select", "cluster_metric", "tile_select", "document_select", "list_select", "collection_select", "function_select", "class_select", "palette_select", "custom_list"];

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
        return !propsAreEqual(nextProps, this.props);
    }

    _updateValue(att_name, new_value) {
        this.props.updateValue(att_name, new_value);
    }

    _submitOptions(e) {
        this.props.handleSubmit(this.props.tile_id);
        e.preventDefault();
    }

    render() {
        var option_items = [];
        for (let option of this.props.options) {
            let att_name = option["name"];
            if (selector_types.includes(option["type"])) {
                option_items.push(React.createElement(SelectOption, { att_name: att_name,
                    key: att_name,
                    choice_list: option["option_list"],
                    value: option.starting_value,
                    buttonIcon: selector_type_icons[option["type"]],
                    updateValue: this._updateValue }));
            } else if (option["type"] == "pipe_select") {
                option_items.push(React.createElement(PipeOption, { att_name: att_name,
                    key: att_name,
                    value: _.cloneDeep(option.starting_value),
                    pipe_dict: _.cloneDeep(option["pipe_dict"]),
                    updateValue: this._updateValue
                }));
            } else if (option["type"] == "boolean") {
                option_items.push(React.createElement(BoolOption, { att_name: att_name,
                    key: att_name,
                    value: option.starting_value,
                    updateValue: this._updateValue
                }));
            } else if (option["type"] == "textarea") {
                option_items.push(React.createElement(TextAreaOption, { att_name: att_name,
                    key: att_name,
                    value: option.starting_value,
                    updateValue: this._updateValue
                }));
            } else if (option["type"] == "codearea") {
                option_items.push(React.createElement(CodeAreaOption, { att_name: att_name,
                    key: att_name,
                    value: option.starting_value,
                    updateValue: this._updateValue
                }));
            } else if (option["type"] == "text") {
                option_items.push(React.createElement(TextOption, { att_name: att_name,
                    key: att_name,
                    value: option.starting_value,
                    leftIcon: "paragraph",
                    updateValue: this._updateValue
                }));
            } else if (option["type"] == "int") {
                option_items.push(React.createElement(IntOption, { att_name: att_name,
                    key: att_name,
                    value: option.starting_value,
                    updateValue: this._updateValue
                }));
            } else if (option["type"] == "float") {
                option_items.push(React.createElement(FloatOption, { att_name: att_name,
                    key: att_name,
                    value: option.starting_value,
                    updateValue: this._updateValue
                }));
            }
        }
        return React.createElement(
            React.Fragment,
            null,
            React.createElement(
                "form",
                { className: "form-display-area", onSubmit: this._submitOptions },
                option_items
            ),
            React.createElement(Bp.Button, { text: "Submit", intent: "primary", onClick: this._submitOptions })
        );
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
        doBinding(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props);
    }

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.value);
    }
    render() {
        return React.createElement(
            Bp.FormGroup,
            { label: this.props.att_name },
            React.createElement(Bp.InputGroup, { type: "text", small: false, leftIcon: this.props.leftIcon,
                onChange: this._updateMe, value: this.props.value })
        );
    }
}

TextOption.propTypes = {
    att_name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateValue: PropTypes.func,
    leftIcon: PropTypes.string
};

class IntOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props);
    }

    _updateMe(att_name, val) {
        if (val.length == 0 || !isNaN(Number(val)) && !isNaN(parseInt(val))) {
            this.props.updateValue(this.props.att_name, val);
        }
    }

    render() {
        return React.createElement(TextOption, { att_name: this.props.att_name, leftIcon: "numerical",
            key: this.props.att_name,
            value: this.props.value,
            updateValue: this._updateMe
        });
    }
}

IntOption.propTypes = {
    att_name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateValue: PropTypes.func
};

class FloatOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props);
    }

    _updateMe(att_name, val) {
        if (val.length == 0 || val == "." || !isNaN(Number(val)) && !isNaN(parseFloat(val))) {
            this.props.updateValue(this.props.att_name, val);
        }
    }

    render() {
        return React.createElement(TextOption, { att_name: this.props.att_name, leftIcon: "numerical",
            key: this.props.att_name,
            value: this.props.value,
            updateValue: this._updateMe
        });
    }
}

FloatOption.propTypes = {
    att_name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateValue: PropTypes.func
};

class BoolOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props);
    }

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.checked);
    }

    boolify(the_var) {
        if (typeof the_var == "boolean") {
            return the_var;
        }
        return the_var == "True" || the_var == "true";
    }

    render() {
        return React.createElement(Bp.Switch, { label: this.props.att_name,
            checked: this.boolify(this.props.value),
            onChange: this._updateMe,
            innerLabel: "False",
            innerLabelChecked: "True",
            alignIndicator: "center"
        });
    }
}

BoolOption.propTypes = {
    att_name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    updateValue: PropTypes.func
};

class CodeAreaOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props);
    }

    _updateMe(newval) {
        this.props.updateValue(this.props.att_name, newval);
    }

    render() {
        return React.createElement(
            Bp.FormGroup,
            { label: this.props.att_name },
            React.createElement(ReactCodemirror, { handleChange: this._updateMe,
                code_content: this.props.value,
                saveMe: null,
                code_container_height: 100
            })
        );
    }
}

CodeAreaOption.propTypes = {
    att_name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateValue: PropTypes.func
};

class TextAreaOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props);
    }

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.value);
    }
    render() {
        return React.createElement(
            Bp.FormGroup,
            { label: this.props.att_name },
            React.createElement(Bp.TextArea, { onChange: this._updateMe,
                small: false, value: this.props.value })
        );
    }
}

TextAreaOption.propTypes = {
    att_name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateValue: PropTypes.func
};

class SelectOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props);
    }

    _updateMe(val) {
        this.props.updateValue(this.props.att_name, val);
    }

    render() {
        return React.createElement(
            Bp.FormGroup,
            { label: this.props.att_name },
            React.createElement(BpSelect, { onChange: this._updateMe,
                value: this.props.value,
                buttonIcon: this.props.buttonIcon,
                options: this.props.choice_list })
        );
    }
}

SelectOption.propTypes = {
    att_name: PropTypes.string,
    choice_list: PropTypes.array,
    buttonIcon: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateValue: PropTypes.func
};

class PipeOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !propsAreEqual(nextProps, this.props);
    }

    _updateMe(item) {
        this.props.updateValue(this.props.att_name, item["value"]);
    }

    create_choice_list() {
        let choice_list = [];
        for (let group in this.props.pipe_dict) {
            choice_list.push({ text: group, value: group + "_group", isgroup: true });
            for (let entry of this.props.pipe_dict[group]) {
                choice_list.push({ text: entry[1], value: entry[0], isgroup: false });
            }
        }
        return choice_list;
    }

    _value_dict() {
        let value_dict = {};
        for (let group in this.props.pipe_dict) {
            for (let entry of this.props.pipe_dict[group]) {
                value_dict[entry[0]] = entry[1];
            }
        }
        return value_dict;
    }

    render() {
        let vdict = this._value_dict();
        let full_value = { text: vdict[this.props.value], value: this.props.value, isgroup: false };
        return React.createElement(
            Bp.FormGroup,
            { label: this.props.att_name },
            React.createElement(BpSelectAdvanced, { onChange: this._updateMe,
                value: full_value,
                buttonIcon: "flow-end",
                options: this.create_choice_list() })
        );
    }
}

PipeOption.propTypes = {
    att_name: PropTypes.string,
    pipe_dict: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateValue: PropTypes.func
};

class PipeOptionOld extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.value);
    }

    create_groups() {
        let groups = [];
        for (let group in this.props.pipe_dict) {
            groups.push(React.createElement(
                "optgroup",
                { key: group, label: group },
                this.props.pipe_dict[group].map(entry => React.createElement(
                    "option",
                    { key: entry[1], value: entry[0] },
                    entry[1]
                ))
            ));
        }
        return groups;
    }

    render() {
        return React.createElement(
            Bp.FormGroup,
            { label: this.props.att_name },
            React.createElement(
                Bp.HTMLSelect,
                { onChange: this._updateMe,
                    value: this.props.value },
                this.create_groups()
            )
        );
    }
}

PipeOptionOld.propTypes = {
    att_name: PropTypes.string,
    pipe_dict: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateValue: PropTypes.func
};