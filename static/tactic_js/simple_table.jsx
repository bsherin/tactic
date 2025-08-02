import React, {Fragment, useState, useRef, useEffect} from "react";

import {
    Cell,
    Column,
    Table,
    ColumnHeaderCell, TruncatedFormat, Regions,
} from "@blueprintjs/table";

export {SimpleTable}

const DEFAULT_ROW_HEIGHT = 27;

function compute_initial_column_widths(table_selector, header_list, data_list, max_field_width = 400) {

    // set up a canvas so that we can use it to compute the width of text
    const element = document.querySelector(`${table_selector} .bp6-table-truncated-text`);
    const body_font = window.getComputedStyle(element).getPropertyValue("font");
    //let header_font = $($(".bp6-table-column-name-text")[0]).css("font");
    const header_element = document.querySelector(".bp6-table-column-name-text");
    const header_font = window.getComputedStyle(header_element).getPropertyValue("font");
    let canvas_element = document.getElementById("measure-canvas");
    let ctx = canvas_element.getContext("2d");
    let added_body_width = 20;
    let added_header_width = 30;

    let column_widths = {};
    let columns_remaining = [];
    ctx.font = header_font;
    for (let c of header_list) {
        let cstr = String(c);
        column_widths[cstr] = ctx.measureText(cstr).width + added_header_width;
        columns_remaining.push(cstr)
    }
    let the_row;
    let the_width;
    let the_text;

    // Find the width of each body cell
    // Keep track of the largest value for each column
    // Once a column has the max value can ignore that column in the future.
    ctx.font = body_font;
    for (const item of data_list) {
        if (columns_remaining.length == 0) {
            break;
        }
        the_row = item;
        let cols_to_remove = [];
        for (let c of columns_remaining) {
            the_text = String(the_row[c]);
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


function SimpleTable(props) {
    props = {
        data_dict_list: {},
        maxColumnWidth: null,
        columnWidths: null,
        uid: null,
        expandRows: false,
        className: "",
        ...props
    }

    const [columnWidths, setColumnWidths] = useState(null);

    const [fixedRowHeights, setFixedRowHeights] = useState(null);

    const table_ref = useRef(null);
    const didRender = useRef(false);

    useEffect(() => {
        if (props.expandRows) {
            _updateRowHeights();
        } else {
            if (didRender.current) {
                resetRowHeights();
                table_ref.current?.invalidateGrid?.();
            }
        }
        didRender.current = false;
    }, [props.expandRows]);

    function _cellRendererCreator(column_name) {
        return (rowIndex) => {
            let the_body;
            if (Object.keys(props.data_dict_list[rowIndex]).includes(column_name)) {
                let the_text = String(props.data_dict_list[rowIndex][column_name]);
                the_body = (<TruncatedFormat>
                    {the_text}
                </TruncatedFormat>)
            } else {
                the_body = ""
            }
            return (
                <Cell key={column_name}
                      interactive={false}
                      truncated={true}
                      tabIndex={-1}
                      wrapText={true}>
                    <Fragment>
                        <div>
                            {the_body}
                        </div>
                    </Fragment>
                </Cell>
            )
        };
    }

    function computeColumnWidths() {
        if (Object.keys(props.data_dict_list).length == 0) return;
        let cnames = Object.keys(props.data_dict_list[0] || {});
        let bcwidths = compute_initial_column_widths(`.table-${props.uid}`, cnames, props.data_dict_list);
        let cwidths = [];
        if (props.maxColumnWidth) {
            for (let c of bcwidths) {
                if (c > props.maxColumnWidth) {
                    cwidths.push(props.maxColumnWidth)
                } else {
                    cwidths.push(c)
                }
            }
        } else {
            cwidths = bcwidths
        }

        setColumnWidths(cwidths);
    }

    async function _onCompleteRender() {
        if (!didRender.current) {
            if (!props.columnWidths) {
                computeColumnWidths();
            }

            didRender.current = true;

            const lastColumnRegion = Regions.column(columnNames().length - 1);
            const firstColumnRegion = Regions.column(0);
            table_ref.current.scrollToRegion(lastColumnRegion);
            table_ref.current.scrollToRegion(firstColumnRegion)
        }
    }

    function columnNames() {
        return Object.keys(props.data_dict_list[0] || {});
    }


    function _updateRowHeights() {
        let cnames = columnNames();
        setFixedRowHeights(null);
        table_ref.current.resizeRowsByApproximateHeight((rowIndex, colIndex) => {
            return props.data_dict_list[rowIndex][cnames[colIndex]]
        }, {getNumBufferLines: 1});
    }

    function resetRowHeights() {
        setFixedRowHeights(Array(props.data_dict_list.length).fill(DEFAULT_ROW_HEIGHT));
    }

    function _columnHeaderNameRenderer(the_text) {
        let the_body;
        the_text = String(the_text);
        the_body = <div className="bp6-table-truncated-text">{the_text}</div>
        return the_body
    }

    let column_names = columnNames()
    let columns = column_names.map((column_name) => {
        const cellRenderer = _cellRendererCreator(column_name);
        const columnHeaderCellRenderer = () => <ColumnHeaderCell name={column_name}
                                                                 nameRenderer={_columnHeaderNameRenderer}
        />;

        return <Column cellRenderer={cellRenderer}
                       enableColumnReordering={false}
                       columnHeaderCellRenderer={columnHeaderCellRenderer}
                       key={column_name}
                       name={column_name}/>
    });
    return (
        <Table ref={table_ref}
               numRows={props.data_dict_list.length}
               columns={columns}
               rowHeights={fixedRowHeights}
               className={`table-${props.uid} ${props.className}`}
               cellRendererDependencies={[props.data_dict_list]}
               enableColumnReordering={false}
               enableColumnResizing={true}
               defaultRowHeight={27}
               columnWidths={props.columnWidths ? props.columnWidths : columnWidths}
               onCompleteRender={_onCompleteRender}
               enableRowHeader={false}
        >
            {columns}
        </Table>
    )
}