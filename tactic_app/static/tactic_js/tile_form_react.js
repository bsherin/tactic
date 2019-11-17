

import { ReactCodemirror } from "./react-codemirror.js";

export { TileForm };

let Bp = blueprint;

class TileForm extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.selector_types = ["column_select", "tokenizer_select", "weight_function_select", "cluster_metric", "tile_select", "document_select", "list_select", "collection_select", "function_select", "class_select", "palette_select", "custom_list"];
    }

    _updateValue(att_name, new_value) {
        this.props.updateValue(att_name, new_value);
    }

    _submitOptions() {
        this.props.handleSubmit(this.props.tile_id);
    }

    render() {
        var option_items = [];
        for (let option of this.props.options) {
            let att_name = option["name"];
            if (this.selector_types.includes(option["type"])) {
                option_items.push(React.createElement(SelectOption, { att_name: att_name,
                    key: att_name,
                    choice_list: option["option_list"],
                    value: option.starting_value,
                    updateValue: this._updateValue }));
            } else if (option["type"] == "pipe_select") {
                option_items.push(React.createElement(PipeOption, { att_name: att_name,
                    key: att_name,
                    value: option.starting_value,
                    pipe_dict: option["pipe_dict"],
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
                option_items.push(React.createElement(TextAreaOption, { att_name: att_name,
                    key: att_name,
                    value: option.starting_value,
                    updateValue: this._updateValue
                }));
            } else if (option["type"] == "text" || option["type"] == "int") {
                option_items.push(React.createElement(TextOption, { att_name: att_name,
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

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.value);
    }
    render() {
        return React.createElement(
            Bp.FormGroup,
            { label: this.props.att_name },
            React.createElement(Bp.InputGroup, { type: "text", small: false, onChange: this._updateMe, value: this.props.value })
        );
    }
}

TextOption.propTypes = {
    att_name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateValue: PropTypes.func
};

class BoolOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.checked);
    }
    render() {
        return React.createElement(Bp.Checkbox, { label: this.props.att_name,
            value: this.props.value,
            onChange: this._updateMe,
            alignIndicator: "right"
        });
    }
}

BoolOption.propTypes = {
    att_name: PropTypes.string,
    value: PropTypes.bool,
    updateValue: PropTypes.func
};

class CodeAreaOption extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
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

    _updateMe(event) {
        this.props.updateValue(this.props.att_name, event.target.value);
    }

    render() {
        let option_items = this.props.choice_list.map((opt, index) => React.createElement(
            "option",
            { key: index },
            opt
        ));
        return React.createElement(
            Bp.FormGroup,
            { label: this.props.att_name },
            React.createElement(
                Bp.HTMLSelect,
                { onChange: this._updateMe,
                    value: this.props.value },
                option_items
            )
        );
    }
}

SelectOption.propTypes = {
    att_name: PropTypes.string,
    choice_list: PropTypes.array,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateValue: PropTypes.func
};

class PipeOption extends React.Component {
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

PipeOption.propTypes = {
    att_name: PropTypes.string,
    pipe_dict: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateValue: PropTypes.func
};