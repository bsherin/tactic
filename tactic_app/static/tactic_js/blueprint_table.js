
export { BlueprintTable, compute_added_column_width };

let Bpt = bptable;

const MAX_INITIAL_CELL_WIDTH = 400;
const EXTRA_TABLE_AREA_SPACE = 500;

class ColoredWord extends React.Component {

    render() {
        let style = { backgroundColor: this.props.the_color };
        return React.createElement(
            "span",
            { style: style },
            this.props.the_word
        );
    }
}

ColoredWord.propTypes = {
    the_color: PropTypes.string,
    the_word: PropTypes.string
};

class BlueprintTable extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.mismatched_column_widths = false;
        this.table_ref = React.createRef();
    }

    componentDidMount() {
        this.setState({ mounted: true });
        this.computeColumnWidths();
        this._updateRowHeights();
    }

    componentDidUpdate() {
        // this.props.my_ref.current.scrollTop = this.props.scroll_top;
        if (this.props.column_widths == null || this.mismatched_column_widths) {
            this.computeColumnWidths();
        }
        this._updateRowHeights();
    }

    computeColumnWidths() {
        let cwidths = compute_initial_column_widths(this.props.filtered_column_names, this.props.data_row_dict);
        this.mismatched_column_widths = false;
        this.props.updateTableSpec({ column_widths: cwidths }, true);
    }

    haveRowData(rowIndex) {
        return this.props.data_row_dict.hasOwnProperty(rowIndex);
    }

    _scrollToRow(row_index) {
        if (this.table_ref && this.table_ref.current) {
            let singleCellRegion = Bpt.Regions.cell(row_index, 0);
            this.table_ref.current.scrollToRegion(singleCellRegion);
        }
    }

    _updateRowHeights() {
        let fcnames = this.props.filtered_column_names;
        let self = this;
        this.table_ref.current.resizeRowsByApproximateHeight((rowIndex, colIndex) => {
            if (!self.haveRowData(rowIndex)) {
                return "empty cell";
            }
            return self.props.data_row_dict[rowIndex][fcnames[colIndex]];
        }, { getNumBufferLines: 1 });
    }

    _rowHeaderCellRenderer(rowIndex) {
        if (this.haveRowData(rowIndex)) {
            return React.createElement(Bpt.RowHeaderCell, { key: rowIndex,
                name: this.props.data_row_dict[rowIndex].__id__ });
        } else {
            return React.createElement(Bpt.RowHeaderCell, { key: rowIndex, loading: true, name: rowIndex });
        }
    }

    _text_color_dict(row_id, colname) {
        if (this.props.cells_to_color_text.hasOwnProperty(row_id)) {
            let text_color_dict = this.props.cells_to_color_text[row_id];
            if (text_color_dict.hasOwnProperty(colname)) {
                return text_color_dict[colname];
            }
            return null;
        }
        return null;
    }

    _cellRendererCreator(column_name) {
        let self = this;
        return rowIndex => {
            if (!this.haveRowData(rowIndex)) {
                if (!self.props.awaiting_data) {
                    self.props.initiateDataGrab(rowIndex);
                }
                return React.createElement(Bpt.Cell, { key: column_name,
                    loading: true });
            }
            let text_color_dict = self._text_color_dict(rowIndex, column_name);
            if (text_color_dict) {
                let color_dict = text_color_dict.color_dict;
                let token_text = text_color_dict.token_text;
                let revised_text = [];
                let index = 0;
                for (let w of token_text) {
                    if (color_dict.hasOwnProperty(w)) {
                        revised_text.push(React.createElement(ColoredWord, { key: index, the_color: color_dict[w], the_word: w }));
                    } else {
                        revised_text.push(w + " ");
                    }
                    index += 1;
                }
                let converted_dict = { __html: revised_text };
                return React.createElement(
                    Bpt.Cell,
                    { key: column_name,
                        truncated: true,
                        wrapText: true },
                    revised_text
                );
            }
            let the_text = self.props.data_row_dict[rowIndex][column_name];
            if (this.props.alt_search_text != null && this.props.alt_search_text != "") {
                const regex = new RegExp(this.props.alt_search_text, "gi");
                the_text = String(the_text).replace(regex, function (matched) {
                    return "<mark>" + matched + "</mark>";
                });
                let converted_dict = { __html: the_text };
                return React.createElement(
                    Bpt.Cell,
                    { key: column_name,
                        truncated: true,
                        wrapText: true },
                    React.createElement("div", { dangerouslySetInnerHTML: converted_dict })
                );
            }
            if (self.props.search_text != null && self.props.search_text != "") {
                const regex = new RegExp(self.props.search_text, "gi");
                the_text = String(the_text).replace(regex, function (matched) {
                    return "<mark>" + matched + "</mark>";
                });
                let converted_dict = { __html: the_text };
                return React.createElement(
                    Bpt.Cell,
                    { key: column_name,
                        truncated: true,
                        wrapText: true },
                    React.createElement("div", { dangerouslySetInnerHTML: converted_dict })
                );
            }
            // Wrapping the contents of the cell in React.Fragment prevent React from
            // generating a warning for reasons that are mysterious
            return React.createElement(Bpt.EditableCell, { key: column_name,
                truncated: true,
                rowIndex: rowIndex,
                columnIndex: this.props.filtered_column_names.indexOf(column_name),
                wrapText: true,
                onConfirm: self._onConfirmCellEdit,
                value: the_text });
        };
    }

    _onConfirmCellEdit(value, rowIndex, columnIndex) {
        this.props.setCellContent(this.props.data_row_dict[rowIndex].__id__, this.props.filtered_column_names[columnIndex], value, true);
    }

    _onSelection(regions) {
        if (regions.length == 0) return; // Without this get an error when clicking on a body cell
        if (regions[0].hasOwnProperty("cols")) {
            this._setSelectedColumn(this.props.filtered_column_names[regions[0]["cols"][0]]);
        } else if (regions[0].hasOwnProperty("rows")) {
            this._setSelectedRow(regions[0]["rows"][0]);
        }
    }

    _setSelectedColumn(column_name) {
        this.props.setMainStateValue("selected_column", column_name);
    }

    _setSelectedRow(rowIndex) {
        this.props.setMainStateValue("selected_row", this.props.data_row_dict[rowIndex].__id__);
    }

    broadcast_column_widths(docname, cwidths) {
        this.props.broadcast_event_to_server("UpdateColumnWidths", { "doc_to_update": docname,
            "column_widths": cwidths }, null);
    }

    _onColumnWidthChanged(index, size) {
        let cwidths = this.props.column_widths;
        cwidths[index] = size;
        this.props.updateTableSpec({ column_widths: cwidths }, true);
    }

    _onColumnsReordered(oldIndex, newIndex, length) {
        let col_to_move = this.props.filtered_column_names[oldIndex];
        let cnames = [...this.props.filtered_column_names];
        cnames.splice(oldIndex, 1);
        let target_col = cnames[newIndex];
        this.props.moveColumn(col_to_move, target_col);
    }

    render() {
        let self = this;
        let columns = this.props.filtered_column_names.map(column_name => {
            const cellRenderer = self._cellRendererCreator(column_name);
            return React.createElement(Bpt.Column, { cellRenderer: cellRenderer,
                enableColumnReordering: true,
                key: column_name,
                name: column_name });
        });
        let cwidths = this.props.column_widths == null ? null : this.props.column_widths;
        if (cwidths != null && cwidths.length != this.props.filtered_column_names.length) {
            cwidths = null;
            this.mismatched_column_widths = true;
        }
        let style = { display: "block",
            overflowY: "auto",
            overflowX: "hidden",
            height: this.props.height
        };
        return React.createElement(
            "div",
            { id: "table-area", ref: this.props.my_ref, style: style },
            React.createElement(
                Bpt.Table,
                { ref: this.table_ref,
                    numRows: this.props.total_rows,
                    enableColumnReordering: true,
                    onColumnsReordered: this._onColumnsReordered,
                    onSelection: this._onSelection,
                    onColumnWidthChanged: this._onColumnWidthChanged,
                    enableMultipleSelection: false,
                    selectionModes: [Bpt.RegionCardinality.FULL_COLUMNS, Bpt.RegionCardinality.FULL_ROWS],
                    minColumnWidth: 75,
                    columnWidths: cwidths,
                    rowHeaderCellRenderer: this._rowHeaderCellRenderer
                },
                columns
            )
        );
    }
}

BlueprintTable.propTypes = {
    my_ref: PropTypes.object,
    height: PropTypes.number,
    setCellContent: PropTypes.func,
    column_names: PropTypes.array,
    filtered_column_names: PropTypes.array,
    moveColumn: PropTypes.func,
    updateTableSpec: PropTypes.func,
    data_row_dict: PropTypes.object,
    total_rows: PropTypes.number,
    initiateDataGrab: PropTypes.func,
    setMainStateValue: PropTypes.func,
    broadcast_event_to_server: PropTypes.func,
    cells_to_color_text: PropTypes.object,
    column_widths: PropTypes.array,
    hidden_columns_list: PropTypes.array,
    search_text: PropTypes.string,
    alt_search_text: PropTypes.string
};

function compute_added_column_width(header_text) {
    const max_field_width = MAX_INITIAL_CELL_WIDTH;
    let header_font = $($(".bp3-table-truncated-text")[0]).css("font");
    let canvas_element = document.getElementById("measure-canvas");
    let ctx = canvas_element.getContext("2d");
    let added_header_width = 40;
    ctx.font = header_font;
    return ctx.measureText(header_text).width + added_header_width;
}

function compute_initial_column_widths(header_list, data_row_dict) {
    const ncols = header_list.length;
    const max_field_width = MAX_INITIAL_CELL_WIDTH;

    // Get sample header and body cells

    // set up a canvas so that we can use it to compute the width of text
    let body_font = $($(".bp3-table-truncated-text")[0]).css("font");
    let header_font = body_font;
    let canvas_element = document.getElementById("measure-canvas");
    let ctx = canvas_element.getContext("2d");
    let added_header_width = 40;
    let added_body_width = 40;

    let column_widths = {};
    let columns_remaining = [];
    for (let c of header_list) {
        column_widths[c] = 0;
        columns_remaining.push(c);
    }
    // Get the width for each header column
    ctx.font = header_font;
    let the_row;
    let the_width;
    let the_text;
    let the_child;
    for (let c of columns_remaining) {
        the_text = header_list[c];
        the_width = ctx.measureText(the_text).width + added_header_width;

        if (the_width > max_field_width) {
            the_width = max_field_width;
            let index = columns_remaining.indexOf(c);
            if (index !== -1) {
                columns_remaining.splice(index, 1);
            }
        }
        if (the_width > column_widths[c]) {
            column_widths[c] = the_width;
        }
    }

    // Find the width of each body cell
    // Keep track of the largest value for each column
    // Once a column has the max value can ignore that column in the future.
    ctx.font = body_font;
    let dkeys = Object.keys(data_row_dict);
    for (let r = 0; r < dkeys.length; ++r) {
        if (columns_remaining.length == 0) {
            break;
        }
        the_row = data_row_dict[dkeys[r]];
        let cols_to_remove = [];
        for (let c of columns_remaining) {
            the_text = the_row[c];
            the_width = ctx.measureText(the_text).width + added_body_width;

            if (the_width > max_field_width) {
                the_width = max_field_width;
                cols_to_remove.push(c);
            }

            if (the_width > column_widths[c]) {
                column_widths[c] = the_width;
            }
        }
        for (let c of cols_to_remove) {
            let index = columns_remaining.indexOf(c);
            if (index !== -1) {
                columns_remaining.splice(index, 1);
            }
        }
    }
    let result = [];
    for (let c of header_list) {
        result.push(column_widths[c]);
    }
    return result;
}