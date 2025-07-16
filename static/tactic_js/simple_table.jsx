import React, {Fragment} from "react";;

import {
    Cell,
    Column,
    Table,
    ColumnHeaderCell, TruncatedFormat, SelectionModes
} from "@blueprintjs/table";

export {SimpleTable}

function SimpleTable(props) {
    props = {
        data_dict_list: {},
        ...props
    }

    function _cellRendererCreator(column_name) {
        return (rowIndex) => {
            let the_body;
            let the_class = "";
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

    function _columnHeaderNameRenderer(the_text) {
        let the_body;
        the_text = String(the_text);
        the_body = <div className="bp6-table-truncated-text">{the_text}</div>
        return the_body
    }

    let column_names = Object.keys(props.data_dict_list[0] || {});
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
        <Table numRows={props.num_rows}
                cellRendererDependencies={[props.data_dict_list]}
                enableColumnReordering={false}
                enableColumnResizing={true}
                defaultRowHeight={27}
                enableRowHeader={false}
        >
            {columns}
        </Table>
    )
}