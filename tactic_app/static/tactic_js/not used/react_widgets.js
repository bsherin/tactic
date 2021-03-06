
export { LabeledSelectList, LabeledFormField, SelectList, OrderableTable, DragThing, GlyphButton };

var Rbs = window.ReactBootstrap;

class GlyphButton extends React.Component {

    render() {
        return React.createElement(
            "button",
            { type: "button",
                style: this.props.style,
                className: this.props.butclass,
                onMouseDown: e => {
                    e.preventDefault();
                },
                onClick: this.props.handleClick },
            React.createElement("span", { className: this.props.icon_class }),
            this.props.extra_glyph_text && React.createElement(
                "span",
                { className: "extra-glyph-text" },
                this.props.extra_glyph_text
            )
        );
    }
}

GlyphButton.propTypes = {
    butclass: PropTypes.string,
    icon_class: PropTypes.string,
    extra_glyph_text: PropTypes.string,
    style: PropTypes.object,
    handleClick: PropTypes.func
};

GlyphButton.defaultProps = {
    style: {},
    extra_glyph_text: null
};

class DragThing extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.state = {
            xpos: 0,
            ypos: 0,
            initial_x: null,
            initial_y: null,
            active: false
        };
    }

    _dragStart(e) {
        this.setState({
            initial_x: e.clientX,
            initial_y: e.clientY,
            active: true
        });
    }

    _drag(e) {
        if (this.state.active) {
            let currentX = e.clientX - this.state.initial_x;
            let currentY = e.clientY - this.state.initial_y;
            // this.props.handleDrag(xpos, ypos);
            this.setState({
                xpos: currentX,
                ypos: currentY
            });
        }
    }

    _dragEnd(e) {
        this.setState({ active: false,
            xpos: 0,
            ypos: 0
        });
    }

    render() {
        let style = { fontSize: 25 };
        if (this.state.active) {
            style.transform = "translate3d(" + this.state.xpos + "px, " + this.state.ypos + "px, 0)";
        }
        return React.createElement("span", { style: style,
            onMouseDown: this._dragStart,
            onMouseMove: this._drag,
            onMouseUp: this._dragEnd,
            className: "fal fa-caret-right" });
    }
}

DragThing.propTypes = {
    handleDrag: PropTypes.func
};

class LabeledFormField extends React.Component {

    render() {
        let cname = this.props.show ? "form-group m-1" : "form-group m-1 d-none";
        return React.createElement(
            Rbs.Form.Group,
            { bsPrefix: cname },
            React.createElement(
                Rbs.Form.Label,
                { bsPrefix: "form-label m-1" },
                this.props.label
            ),
            React.createElement(Rbs.Form.Control, { as: "input", onChange: this.props.onChange, value: this.props.the_value })
        );
    }

}

LabeledFormField.propTypes = {
    show: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    the_value: PropTypes.string
};

LabeledFormField.defaultProps = {
    show: true
};

function LabeledSelectList(props) {
    return React.createElement(
        Rbs.Form.Group,
        { bsPrefix: "form-group m-1" },
        React.createElement(
            Rbs.Form.Label,
            { bsPrefix: "form-label m-1" },
            props.label
        ),
        React.createElement(SelectList, { option_list: props.option_list, onChange: props.onChange, the_value: props.the_value })
    );
}

class SelectList extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.onChange(event.target.value);
    }
    render() {
        let sstyle = { "marginBottom": 5, "width": "auto" };
        if (this.props.height != null) {
            sstyle["height"] = this.props.height;
        }
        if (this.props.maxWidth != null) {
            sstyle["maxWidth"] = this.props.maxWidth;
        }
        if (this.props.fontSize != null) {
            sstyle["fontSize"] = this.props.fontSize;
        }

        let option_items = this.props.option_list.map((opt, index) => React.createElement(
            "option",
            { key: index },
            opt
        ));
        return React.createElement(
            Rbs.Form.Control,
            { as: "select",
                style: sstyle,
                onChange: this.handleChange,
                value: this.props.value
            },
            option_items
        );
    }
}

SelectList.propTypes = {
    option_list: PropTypes.array,
    onChange: PropTypes.func,
    value: PropTypes.string,
    height: PropTypes.number,
    maxWidth: PropTypes.number,
    fontSize: PropTypes.number
};

SelectList.defaultProps = {
    height: null,
    maxWidth: null,
    fontSize: null
};

class SelectListNoRbs extends React.Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.props.handleChange(event.target.value);
    }
    render() {
        let sstyle = { "marginBottom": 5, "width": "auto" };
        let option_items = this.props.option_list.map((opt, index) => React.createElement(
            "option",
            { key: index },
            opt
        ));
        return React.createElement(
            "select",
            { style: sstyle,
                className: "form-control",
                onChange: this.handleChange,
                value: this.props.value
            },
            option_items
        );
    }
}

SelectListNoRbs.propTypes = {
    option_list: PropTypes.array,
    handleChange: PropTypes.func,
    value: PropTypes.string
};

class TableCell extends React.Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.td_ref = React.createRef();
    }

    handleChange(event) {
        let myval = this.td_ref.current.innerHTML.trim();
        this.props.handleCellChange(this.props.theRow, this.props.theCol, myval);
    }

    render() {
        return React.createElement(
            "td",
            { contentEditable: this.props.content_editable,
                onBlur: this.handleChange,
                ref: this.td_ref,
                suppressContentEditableWarning: true
            },
            this.props.children
        );
    }
}

TableCell.propTypes = {
    content_editable: PropTypes.bool,
    handleCellChange: PropTypes.func,
    theRow: PropTypes.number,
    theColumn: PropTypes.string
};

class TableRow extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.props.handleRowClick(this.props.row_index);
    }

    render() {

        let cells = this.props.columns.map((col, index) => React.createElement(
            TableCell,
            { key: index,
                content_editable: this.props.content_editable,
                theRow: this.props.row_index,
                theCol: col,
                handleCellChange: this.props.handleCellChange
            },
            this.props.data_dict[col]
        ));
        cells.push(React.createElement(
            "td",
            { key: "999" },
            React.createElement("span", { className: "ui-icon ui-icon-arrowthick-2-n-s" })
        ));

        let cname = this.props.active ? 'selector-button active' : 'selector-button';
        return React.createElement(
            "tr",
            { className: cname, id: this.props.row_index, onClick: this.handleClick },
            cells
        );
    }
}

TableRow.propTypes = {
    columns: PropTypes.array,
    row_index: PropTypes.number,
    data_dict: PropTypes.object,
    active: PropTypes.bool,
    handleRowClick: PropTypes.func,
    content_editable: PropTypes.bool,
    handleCellChange: PropTypes.func
};

TableRow.defaultProps = {
    content_editable: false
};

class TableHeader extends React.Component {
    render() {

        let cells = this.props.columns.map((col, index) => React.createElement(
            "th",
            { key: index },
            col
        ));
        cells.push(React.createElement(
            "th",
            { key: "999" },
            " "
        ));
        return React.createElement(
            "thead",
            null,
            React.createElement(
                "tr",
                { className: "selector-button", key: "header" },
                cells
            )
        );
    }
}

TableHeader.propTypes = {
    columns: PropTypes.array
};

class OrderableTable extends React.Component {
    constructor(props) {
        super(props);
        this.tbody_ref = React.createRef();
        this.update_option_order = this.update_option_order.bind(this);
        this.handleCellChange = this.handleCellChange.bind(this);
    }

    componentDidMount() {
        let self = this;
        $(this.tbody_ref.current).sortable({
            handle: ".ui-icon",
            update: self.update_option_order
        });
    }

    handleCellChange(r, c, new_val) {
        let new_data_list = this.props.data_array;
        new_data_list[r][c] = new_val;
        this.props.handleChange(new_data_list);
    }

    update_option_order(event, ui) {
        let new_order = $(this.tbody_ref.current).sortable("toArray");
        let new_active_row = new_order.indexOf(String(this.props.active_row));
        let new_data_list = new_order.map((id, idx) => this.props.data_array[parseInt(id)]);
        this.props.handleChange(new_data_list);
        this.props.handleActiveRowChange(new_active_row);
    }

    render() {
        let trows = this.props.data_array.map((ddict, index) => React.createElement(TableRow, { columns: this.props.columns,
            data_dict: ddict,
            key: ddict[this.props.columns[0]],
            row_index: index,
            active: index == this.props.active_row,
            handleRowClick: this.props.handleActiveRowChange,
            content_editable: this.props.content_editable,
            handleCellChange: this.handleCellChange
        }));
        return React.createElement(
            "table",
            { className: "tile-table table sortable table-striped table-bordered table-sm" },
            React.createElement(TableHeader, { columns: this.props.columns }),
            React.createElement(
                "tbody",
                { ref: this.tbody_ref },
                trows
            )
        );
    }

}

OrderableTable.propTypes = {
    columns: PropTypes.array,
    data_array: PropTypes.array,
    active_row: PropTypes.number,
    handleActiveRowChange: PropTypes.func,
    handleChange: PropTypes.func,
    content_editable: PropTypes.bool
};

OrderableTable.defaultProps = {
    content_editable: false
};