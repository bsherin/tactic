

import React from "react";
import PropTypes from 'prop-types';

import {Cell, EditableCell, RowHeaderCell, Column, Table, Regions, RegionCardinality} from "@blueprintjs/table";
import hash from "object-hash"

import {doBinding, propsAreEqual} from "./utilities_react.js";

export {BlueprintTable, compute_added_column_width}

const MAX_INITIAL_CELL_WIDTH = 400;
const EXTRA_TABLE_AREA_SPACE = 500;

class ColoredWord extends React.Component {


    render() {
        let style = {backgroundColor: this.props.the_color};
        return (
            <span style={style}>{this.props.the_word}</span>
        )
    }
}

ColoredWord.propTypes = {
    the_color: PropTypes.string,
    the_word: PropTypes.string,
};

class BlueprintTable extends React.Component {
    constructor(props) {
        super(props);
        doBinding(this);
        this.mismatched_column_widths = false;
        this.table_ref = React.createRef();
        this.set_scroll = null;
        this.data_update_required = null;
        this.state = {focusedCell: null}
    }

    get hash_value() {
        let obj = {
            cwidths: this.props.column_widths,
            nrows: this.props.total_rows
            // sscroll: this.set_scroll
        };
        return hash(obj)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.set_scroll || this.data_update_required) {
            return true
        }
        return !propsAreEqual(nextProps, this.props) || !propsAreEqual(nextState, this.state)
    }

    componentDidMount() {
        this.setState({mounted: true});
        this.computeColumnWidths();
        this._updateRowHeights();
    }

    componentDidUpdate() {
        if ((this.props.column_widths == null) || (this.mismatched_column_widths)) {
            this.computeColumnWidths()
        }
        this._updateRowHeights();
    }

    computeColumnWidths() {
        let cwidths = compute_initial_column_widths(this.props.filtered_column_names, this.props.data_row_dict);
        this.mismatched_column_widths = false;
        this.props.updateTableSpec({column_widths: cwidths}, true)

    }

    haveRowData(rowIndex) {
        return this.props.data_row_dict.hasOwnProperty(rowIndex)
    }

    _doScroll() {
        if (this.data_update_required != null) {
            let rindex = this.data_update_required;
            this.data_update_required = null;
            this.props.initiateDataGrab(rindex);
        }
        else if ((this.set_scroll != null) && this.table_ref && this.table_ref.current) {
            try {
                let singleCellRegion = Regions.cell(this.set_scroll, 0);
                this.table_ref.current.scrollToRegion(singleCellRegion);
                this.set_scroll = null
            }
            catch (e) {
                console.log(e.message)
            }
        }
    }

    _scrollToRow(row_index) {
        this.set_scroll = row_index
    }

    _updateRowHeights() {
        let fcnames = this.props.filtered_column_names;
        let self = this;
        this.table_ref.current.resizeRowsByApproximateHeight((rowIndex, colIndex)=>{
            if (!self.haveRowData(rowIndex)) {
                return "empty cell"
            }
            return self.props.data_row_dict[rowIndex][fcnames[colIndex]]
        }, {getNumBufferLines: 1});
    }

    _rowHeaderCellRenderer(rowIndex) {
        if (this.haveRowData(rowIndex))  {
            return (<RowHeaderCell key={rowIndex}
                                        name={this.props.data_row_dict[rowIndex].__id__}/>)
        }
        else {
            return (<RowHeaderCell key={rowIndex} loading={true} name={rowIndex}/>)
        }
    }

    _text_color_dict(row_id, colname) {
        if (this.props.cells_to_color_text.hasOwnProperty(row_id)) {
            let text_color_dict = this.props.cells_to_color_text[row_id];
            if (text_color_dict.hasOwnProperty(colname)) {
                return text_color_dict[colname]
            }
            return null
        }
        return null
    }

    _cell_background_color(row_id, colname) {
        if (this.props.cell_backgrounds.hasOwnProperty(row_id)) {
            let cell_background_dict = this.props.cell_backgrounds[row_id];
            if (cell_background_dict.hasOwnProperty(colname)) {
                return cell_background_dict[colname]
            }
            return null
        }
        return null
    }

    _cellRendererCreator(column_name) {
        let self = this;
        return (rowIndex) => {
            let the_text;
            let cell_bg_color;
            try {
                if (!this.haveRowData(rowIndex)) {
                    if (self.data_update_required == null) {
                        self.data_update_required = rowIndex;
                    }
                    return (<Cell key={column_name}
                                  loading={true}>
                        </Cell>
                    )
                }
                let text_color_dict = self._text_color_dict(rowIndex, column_name);
                if (text_color_dict) {
                    let color_dict = text_color_dict.color_dict;
                    let token_text = text_color_dict.token_text;
                    let revised_text = [];
                    let index = 0;
                    for (let w of token_text) {
                        if (color_dict.hasOwnProperty(w)) {
                            revised_text.push(<ColoredWord key={index} the_color={color_dict[w]} the_word={w}/>)
                        } else {
                            revised_text.push(w + " ")
                        }
                        index += 1;
                    }
                    let converted_dict = {__html: revised_text};
                    return (<Cell key={column_name}
                                  truncated={true}
                                  wrapText={true}>
                            {revised_text}
                        </Cell>
                    )
                }
                cell_bg_color = self._cell_background_color(rowIndex, column_name);
                the_text = self.props.data_row_dict[rowIndex][column_name];
                if ((this.props.alt_search_text != null) && (this.props.alt_search_text != "")) {
                    const regex = new RegExp(this.props.alt_search_text, "gi");
                    the_text = String(the_text).replace(regex, function (matched) {
                        return "<mark>" + matched + "</mark>";
                    });
                    let converted_dict = {__html: the_text};
                    return (<Cell key={column_name}
                                  style={{backgroundColor: cell_bg_color}}
                                  truncated={true}
                                  wrapText={true}>
                            <div dangerouslySetInnerHTML={converted_dict}></div>
                        </Cell>
                    )
                }
                if ((self.props.search_text != null) && (self.props.search_text != "")) {
                    const regex = new RegExp(self.props.search_text, "gi");
                    the_text = String(the_text).replace(regex, function (matched) {
                        return "<mark>" + matched + "</mark>";
                    });
                    let converted_dict = {__html: the_text};
                    return (<Cell key={column_name}
                                  style={{backgroundColor: cell_bg_color}}
                                  truncated={true}
                                  wrapText={true}>
                            <div dangerouslySetInnerHTML={converted_dict}></div>
                        </Cell>
                    )
                }
                if (!self.props.spreadsheet_mode) {
                    return (<Cell key={column_name}
                                  style={{backgroundColor: cell_bg_color}}
                                  truncated={true}
                                  wrapText={true}>
                            {the_text}
                        </Cell>
                    )
                }
            }
            catch (e) {
                console.log(e.message);
                the_text = ""
            }
            // Wrapping the contents of the cell in React.Fragment prevent React from
            // generating a warning for reasons that are mysterious
            return (<EnhancedEditableCell key={column_name}
                                          truncated={true}
                                          rowIndex={rowIndex}
                                          className="cell-class"
                                          interactive={false}
                                          columnIndex={this.props.filtered_column_names.indexOf(column_name)}
                                          columnHeader={column_name}
                                          wrapText={true}
                                          setCellContent={this.props.setCellContent}
                                          bgColor={cell_bg_color}
                                          value={the_text}/>
            )
        };
    }

    _onSelection(regions) {
        if (regions.length == 0) return;  // Without this get an error when clicking on a body cell
        this.props.setMainStateValue("selected_regions", regions);
        if (regions[0].hasOwnProperty("cols")) {
            this._setSelectedColumn(this.props.filtered_column_names[regions[0]["cols"][0]])
        }
        else if (regions[0].hasOwnProperty("rows")) {
            this._setSelectedRow(regions[0]["rows"][0])
        }
    }

    _setSelectedColumn(column_name) {
        this.props.setMainStateValue({"selected_column": column_name, "selected_row": null})
    }

    _setSelectedRow(rowIndex) {
        this.props.setMainStateValue({"selected_row": this.props.data_row_dict[rowIndex].__id__,
            "selected_column": null}
        )
    }

    broadcast_column_widths(docname, cwidths) {
        this.props.broadcast_event_to_server("UpdateColumnWidths", {"doc_to_update": docname,
            "column_widths": cwidths}, null)
    }

    _onColumnWidthChanged(index, size) {
        let cwidths = this.props.column_widths;
        cwidths[index] = size;
        this.props.updateTableSpec({column_widths: cwidths}, true);
    }

    _onColumnsReordered(oldIndex, newIndex, length) {
        let col_to_move = this.props.filtered_column_names[oldIndex];
        let cnames = [...this.props.filtered_column_names];
        cnames.splice(oldIndex, 1);
        let target_col = cnames[newIndex];
        this.props.moveColumn(col_to_move, target_col)
    }

    _onFocusedCell(focusedCell) {
        this.setState({focusedCell: focusedCell})
    }

    render () {
        let self = this;
        let columns = this.props.filtered_column_names.map((column_name)=> {
            const cellRenderer = self._cellRendererCreator(column_name);
            return <Column cellRenderer={cellRenderer}
                               enableColumnReordering={true}
                               key={column_name}
                               name={column_name}/>
        });
        let cwidths;
        if ((this.props.column_widths == null) || (this.props.column_widths.length == 0)) {
            cwidths = null
        }
        else {
            cwidths = this.props.column_widths
        }
        if ((cwidths != null) && (cwidths.length != this.props.filtered_column_names.length)) {
            cwidths = null;
            this.mismatched_column_widths = true
        }
        let style = {display: "block",
            overflowY: "auto",
            overflowX: "hidden",
            height: this.props.height
        };
        return (
            <div id="table-area" ref={this.props.my_ref} style={style}>
                <Table ref={this.table_ref}
                       key={this.hash_value}  // kludge: Having this prevents partial row rendering
                       numRows={this.props.total_rows}
                       enableColumnReordering={true}
                       onColumnsReordered={this._onColumnsReordered}
                       onSelection={this._onSelection}
                       selectedRegions={this.props.selected_regions}
                       onCompleteRender={this._doScroll}
                       onColumnWidthChanged={this._onColumnWidthChanged}
                       onFocusedCell={this._onFocusedCell}
                       focusedCell={this.state.focusedCell}
                       enableMultipleSelection={false}
                       enableFocusedCell={this.props.spreadsheet_mode}
                       selectionModes={[RegionCardinality.FULL_COLUMNS, RegionCardinality.FULL_ROWS]}
                       minColumnWidth={75}
                       columnWidths={cwidths}
                       rowHeaderCellRenderer={this._rowHeaderCellRenderer}
                >
                    {columns}
                </Table>
            </div>
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
    cell_backgrounds: PropTypes.object,
    column_widths: PropTypes.array,
    hidden_columns_list: PropTypes.array,
    search_text: PropTypes.string,
    spreadsheet_mode: PropTypes.bool,
    alt_search_text: PropTypes.string
};

class EnhancedEditableCell extends React.Component {

    constructor(props) {
        super(props);
        doBinding(this);
        this.cell_ref = React.createRef();
        this.state = {am_editing: false, saved_text: ""}
    }

    _handleKeyDown(event) {
        if (this.cell_ref && this.cell_ref.current) {
            this.cell_ref.current.handleEdit();
            this.setState({am_editing: true, saved_text: this.props.value})
        }
    }

    _onChange(value, rowIndex, columnIndex) {
        this.props.setCellContent(this.props.rowIndex, this.props.columnHeader, value, false)
    }

    _onCancel() {
        this.props.setCellContent(this.props.rowIndex, this.props.columnHeader, this.state.saved_text, false);
        this.setState({am_editing: false})
    }

    _onConfirmCellEdit(value, rowIndex, columnIndex) {
        let self = this;
        this.setState({am_editing: false}, ()=> {
            self.props.setCellContent(this.props.rowIndex, this.props.columnHeader, value, true);
        })
    }

    render() {

        return (
            <EditableCell ref={this.cell_ref}
                          onConfirm={this._onConfirmCellEdit}
                          onChange={this._onChange}
                          onCancel={this._onCancel}
                          style={{backgroundColor: this.props.bgColor}}
                          onKeyDown={this.state.am_editing ? null : this._handleKeyDown}
                          {...this.props}/>
        )
    }
}

function compute_added_column_width(header_text) {
    const max_field_width = MAX_INITIAL_CELL_WIDTH;
    let header_font = $($(".bp4-table-truncated-text")[0]).css("font");
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
    let body_font = $($(".bp4-table-truncated-text")[0]).css("font");
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
    for (const item of dkeys) {
        if (columns_remaining.length == 0) {
            break;
        }
        the_row = data_row_dict[item];
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