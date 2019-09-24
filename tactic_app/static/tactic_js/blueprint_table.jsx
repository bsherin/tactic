
export {BlueprintTable}

let Bpt = bptable;

const MAX_INITIAL_CELL_WIDTH = 400;
const EXTRA_TABLE_AREA_SPACE = 500;

class BlueprintTable extends React.Component {
    constructor(props) {
        super(props);
        this.table_ref = React.createRef();
        doBinding(this);
    }

    componentDidMount() {
        this.setState({mounted: true});
        this.computeColumnWidths();
        this._updateRowHeights();
    }

    componentDidUpdate() {
        // this.props.my_ref.current.scrollTop = this.props.scroll_top;
        if (this.props.column_widths == null) {
            this.computeColumnWidths()
        }
        this._updateRowHeights();
    }

    computeColumnWidths() {
        let cwidths = compute_initial_column_widths(this._filteredNames(), this.props.data_row_dict);
        this.props.updateTableSpec({column_widths: cwidths}, true)
    }

    haveRowData(rowIndex) {
        return this.props.data_row_dict.hasOwnProperty(rowIndex)
    }

    _updateRowHeights() {
        let fcnames = this._filteredNames();
        let self = this;
        this.table_ref.current.resizeRowsByApproximateHeight((rowIndex, colIndex)=>{
            if (!self.haveRowData(rowIndex)) {
                return "empty cell"
            }
            return self.props.data_row_dict[rowIndex][fcnames[colIndex]]
        });
    }

    _rowHeaderCellRenderer(rowIndex) {
        if (this.haveRowData(rowIndex))  {
            return (<Bpt.RowHeaderCell key={rowIndex}
                                        name={this.props.data_row_dict[rowIndex].__id__}/>)
        }
        else {
            return (<Bpt.RowHeaderCell key={rowIndex} loading={true} name={rowIndex}/>)
        }
    }

    _filteredNames() {
        let self = this;
        return this.props.column_names.filter((name)=>{
            return !(self.props.hidden_columns_list.includes(name) || (name == "__id__"));
        })
    }

    _text_to_color(colname) {
         if (this.props.text_color_dict && this.props.text_color_dict.hasOwnProperty(colname)) {
             return this.props.text_color_dict[colname]
         }
         else {
             return null
         }

    }

    _cellRendererCreator(column_name) {
        let self = this;
        return (rowIndex) => {
            if (!this.haveRowData(rowIndex)) {
                if (!self.props.awaiting_data) {
                    self.props.initiateDataGrab(rowIndex)
                }
                return (<Bpt.Cell key={column_name}
                              loading={true}>
                </Bpt.Cell>
                )
            }
            let the_text = self.props.data_row_dict[rowIndex][column_name];
            if ((self.props.search_text != null) && (self.props.search_text != "")) {
                const regex = new RegExp(self.props.search_text, "gi");
                the_text = String(the_text).replace(regex, function (matched) {
                        return "<mark>" + matched + "</mark>";
                    })
            }
            let converted_dict = {__html: the_text};
            // Wrapping the contents of the cell in React.Fragment prevent React from
            // generating a warning for reasons that are mysterious
            return (<Bpt.Cell key={column_name}
                              truncated={true}
                              wrapText={true}>
                    <React.Fragment>
                        <div dangerouslySetInnerHTML={converted_dict}/>
                    </React.Fragment>
                </Bpt.Cell>
            )
        };
    }
    _onSelection(regions) {
        console.log(regions.length)
    }

    render () {
        let self = this;
        let columns = this._filteredNames().map((column_name)=> {
            const cellRenderer = self._cellRendererCreator(column_name);
            return <Bpt.Column cellRenderer={cellRenderer}
                               enableColumnReordering={true}
                               key={column_name}
                               name={column_name}/>
        });
        let cwidths = this.props.column_widths == null ? null : this.props.column_widths;
        if ((cwidths != null) && (cwidths.length > this._filteredNames().length)) {
            cwidths = cwidths.slice(0, cwidths.length)
        }
        let style = {display: "block",
            overflowY: "auto",
            overflowX: "hidden",
            height: this.props.height
        };
        return (
            <div id="table-area" ref={this.props.my_ref} style={style}>
                <Bpt.Table ref={this.table_ref}
                           numRows={this.props.total_rows}
                           maxColumnWidth={400}
                           onSelection={this._onSelection}
                           enableMultipleSelection={false}
                           selectionModes={[Bpt.RegionCardinality.FULL_COLUMNS, Bpt.RegionCardinality.FULL_ROWS]}
                           minColumnWidth={75}
                           columnWidths={cwidths}
                           rowHeaderCellRenderer={this._rowHeaderCellRenderer}
                           >
                        {columns}
                </Bpt.Table>
            </div>
        );
    }
}

BlueprintTable.propTypes = {
    my_ref: PropTypes.object,
    height: PropTypes.number,
    column_names: PropTypes.array,
    updateTableSpec: PropTypes.func,
    data_row_dict: PropTypes.object,
    total_rows: PropTypes.number,
    initiateDataGrab: PropTypes.func,
    text_color_dict: PropTypes.object,
    column_widths: PropTypes.array,
    hidden_columns_list: PropTypes.array,
    search_text: PropTypes.string,
    alt_search_text: PropTypes.string
};

function compute_added_column_width(header_text) {
    const max_field_width = MAX_INITIAL_CELL_WIDTH;
    let header_cell = $($("#table-wrapper th")[0]);
    let header_font = header_cell.css("font");
    let canvas_element = document.getElementById("measure-canvas");
    let ctx = canvas_element.getContext("2d");
    let added_header_width = parseInt(header_cell.css("padding-right")) + parseInt(header_cell.css("padding-left")) + 2;
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
        columns_remaining.push(c)
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
            column_widths[c] = the_width
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
                cols_to_remove.push(c)
            }

            if (the_width > column_widths[c]) {
                column_widths[c] = the_width
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
        result.push(column_widths[c])
    }
    return result
}