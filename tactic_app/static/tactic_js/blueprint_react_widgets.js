
export { LabeledSelectList, LabeledFormField, SelectList, OrderableTable, BpOrderableTable, DragThing, GlyphButton, withTooltip };

let Bp = blueprint;
let Bpt = bptable;

function withTooltip(WrappedComponent) {
    return class extends React.Component {
        render() {
            if (this.props.tooltip) {
                let delay = this.props.tooltipDelay ? this.props.tooltipDelay : 1000;
                return React.createElement(
                    Bp.Tooltip,
                    { content: this.props.tooltip, hoverOpenDelay: delay },
                    React.createElement(WrappedComponent, this.props)
                );
            } else {
                return React.createElement(WrappedComponent, this.props);
            }
        }
    };
}

class GlyphButton extends React.Component {

    render() {
        let style = this.props.style == null ? { paddingLeft: 2, paddingRight: 2 } : this.props.style;
        return React.createElement(
            Bp.Button,
            { type: "button",
                minimal: this.props.minimal,
                small: true,
                style: style,
                onMouseDown: e => {
                    e.preventDefault();
                },
                onClick: this.props.handleClick,
                intent: this.props.intent,
                icon: this.props.icon },
            this.props.extra_glyph_text && React.createElement(
                "span",
                { className: "extra-glyph-text" },
                this.props.extra_glyph_text
            )
        );
    }
}

GlyphButton.propTypes = {
    icon: PropTypes.string,
    minimal: PropTypes.bool,
    extra_glyph_text: PropTypes.string,
    style: PropTypes.object,
    handleClick: PropTypes.func,
    intent: PropTypes.string
};

GlyphButton.defaultProps = {
    style: null,
    extra_glyph_text: null,
    minimal: true,
    intent: "none"
};

GlyphButton = withTooltip(GlyphButton);

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
        return React.createElement(
            Bp.FormGroup,
            { label: this.props.label, style: { marginRight: 5 } },
            React.createElement(Bp.InputGroup, { onChange: this.props.onChange, value: this.props.the_value })
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
        Bp.FormGroup,
        { label: props.label, style: { marginRight: 5 } },
        React.createElement(Bp.HTMLSelect, { options: props.option_list, onChange: props.onChange, value: props.the_value })
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
            Bp.HTMLSelect,
            { style: sstyle,
                onChange: this.handleChange,
                minimal: this.props.minimal,
                value: this.props.value
            },
            option_items
        );
    }
}

SelectList.propTypes = {
    option_list: PropTypes.array,
    onChange: PropTypes.func,
    minimal: PropTypes.bool,
    value: PropTypes.string,
    height: PropTypes.number,
    maxWidth: PropTypes.number,
    fontSize: PropTypes.number
};

SelectList.defaultProps = {
    height: null,
    maxWidth: null,
    fontSize: null,
    minimal: false
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

class BpOrderableTable extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
    }

    _onRowsReordered(oldIndex, newIndex) {
        let new_data_list = [...this.props.data_array];
        let the_item = new_data_list[oldIndex];
        new_data_list.splice(oldIndex, 1);
        new_data_list.splice(newIndex, 0, the_item);
        this.props.handleChange(new_data_list);
    }

    _onConfirmCellEdit(value, rowIndex, columnIndex) {
        let new_data_list = [...this.props.data_array];
        new_data_list[rowIndex][this.props.columns[columnIndex]] = value;
        this.props.handleChange(new_data_list);
    }

    _onSelection(regions) {
        if (regions.length == 0) return; // Without this get an error when clicking on a body cell
        if (regions[0].hasOwnProperty("rows")) {
            this.props.handleActiveRowChange(regions[0]["rows"][0]);
        }
    }

    _cellRendererCreator(column_name) {
        let self = this;
        return rowIndex => {
            let the_text;
            if (Object.keys(self.props.data_array[rowIndex]).includes(column_name)) {
                the_text = self.props.data_array[rowIndex][column_name];
            } else {
                the_text = "";
            }
            return React.createElement(Bpt.EditableCell, { key: column_name,
                truncated: true,
                rowIndex: rowIndex,
                columnIndex: this.props.columns.indexOf(column_name),
                wrapText: true,
                onConfirm: self._onConfirmCellEdit,
                value: the_text });
        };
    }

    _rowHeaderCellRenderer(rowIndex) {
        return React.createElement(Bpt.RowHeaderCell, { key: rowIndex,
            name: rowIndex });
    }

    render() {
        let self = this;
        let columns = this.props.columns.map(column_name => {
            const cellRenderer = self._cellRendererCreator(column_name);
            return React.createElement(Bpt.Column, { cellRenderer: cellRenderer,
                enableColumnReordering: false,
                key: column_name,
                name: column_name });
        });
        return React.createElement(
            Bpt.Table,
            { enableFocusedCell: true,
                numRows: this.props.data_array.length,
                enableColumnReordering: false,
                selectionModes: [Bpt.RegionCardinality.FULL_COLUMNS, Bpt.RegionCardinality.FULL_ROWS],
                enableRowReordering: true,
                onRowsReordered: this._onRowsReordered,
                onSelection: this._onSelection,
                enableMultipleSelection: false
            },
            columns
        );
    }
}

BpOrderableTable.propTypes = {
    columns: PropTypes.array,
    data_array: PropTypes.array,
    handleActiveRowChange: PropTypes.func,
    handleChange: PropTypes.func
};

BpOrderableTable.defaultProps = {
    content_editable: false
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
            Bp.HTMLTable,
            { style: { fontSize: 12 }, bordered: true, condensed: true, interactive: true, striped: false },
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