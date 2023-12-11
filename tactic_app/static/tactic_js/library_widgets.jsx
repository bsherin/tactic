import "../tactic_css/tactic_select.scss"

import React from "react";
import {Fragment, useState, useEffect, useRef, memo} from 'react';
import PropTypes from 'prop-types';
import hash from "object-hash"

import {
    InputGroup,
    HotkeysProvider,
    Menu,
    MenuItem,
    Icon,
    FormGroup,
    Switch,
    Button,
    ButtonGroup
} from "@blueprintjs/core";
import {Cell, Column, Table2, ColumnHeaderCell, RegionCardinality, TruncatedFormat, Regions} from "@blueprintjs/table";
import _ from 'lodash';

import { useCallbackStack, useStateAndRef, useDebounce } from "./utilities_react";

export {SearchForm}
export {BpSelectorTable}

function SearchForm(props) {
    const [temp_text, set_temp_text] = useState(null);
    const [waiting, doUpdate] = useDebounce((newval)=>{
        props.update_search_state({"search_string": newval});
    });

    function _handleSearchFieldChange(event) {
        doUpdate(event.target.value);
        set_temp_text(event.target.value)
    }

    function _handleClearSearch() {
        props.update_search_state({"search_string": ""});
    }

    function _handleSearchMetadataChange(event) {
        props.update_search_state({"search_metadata": event.target.checked});
    }

    function _handleSearchInsideChange(event) {
        props.update_search_state({"search_inside": event.target.checked});

    }

    function _handleShowHiddenChange(event) {
        props.update_search_state({"show_hidden": event.target.checked});
    }

    function _handleRegexChange(event) {
        props.update_search_state({"regex": event.target.checked});
    }

    function _handleSubmit(event) {
        event.preventDefault()
    }

    let match_text;
    if (props.number_matches != null && props.search_string && props.search_string != "") {
        switch (props.number_matches) {
            case 0:
                match_text = "no matches";
                break;
            case 1:
                match_text = "1 match";
                break;
            default:
                match_text = `${props.number_matches} matches`;
                break;
        }
    } else {
        match_text = null
    }
    let current_text = waiting.current ? temp_text : props.search_string;
    return (
        <Fragment>
            <FormGroup helperText={match_text} style={{marginBottom: 0}}>
                <div className="d-flex flex-row" style={{marginTop: 5, marginBottom: 5}}>
                    <InputGroup type="search"
                                className="search-input"
                                placeholder="Search"
                                leftIcon="search"
                                value={current_text}
                                onChange={_handleSearchFieldChange}
                                style={{"width": props.field_width}}
                                autoCapitalize="none"
                                autoCorrect="off"
                                small={true}
                                inputRef={props.search_ref}
                    />
                    {props.allow_regex &&
                        <Switch label="regexp"
                                className="ml-3 mb-0 mt-1"
                                large={false}
                                checked={props.regex}
                                onChange={_handleRegexChange}
                        />
                    }
                    {props.allow_search_metadata &&
                        <Switch label="metadata"
                                className="ml-3 mb-0 mt-1"
                                large={false}
                                checked={props.search_metadata}
                                onChange={_handleSearchMetadataChange}
                        />
                    }
                    {props.allow_search_inside &&
                        <Switch label="inside"
                                className="ml-3 mb-0 mt-1"
                                large={false}
                                checked={props.search_inside}
                                onChange={_handleSearchInsideChange}
                        />
                    }
                    {props.allow_show_hidden &&
                        <Switch label="show hidden"
                                className="ml-3 mb-0 mt-1"
                                large={false}
                                checked={props.show_hidden}
                                onChange={_handleShowHiddenChange}
                        />
                    }
                    {props.include_search_jumper &&
                        <ButtonGroup style={{marginLeft: 5, padding: 2}}>
                            <Button onClick={props.searchNext} icon="caret-down" text={undefined} small={true}/>
                            <Button onClick={props.searchPrev} icon="caret-up" text={undefined} small={true}/>
                        </ButtonGroup>

                    }
                </div>
            </FormGroup>
        </Fragment>
    )
}

SearchForm = memo(SearchForm);

SearchForm.propTypes = {
    allow_search_inside: PropTypes.bool,
    allow_search_metadata: PropTypes.bool,
    allow_show_hidden: PropTypes.bool,
    allow_regex: PropTypes.bool,
    regex: PropTypes.bool,
    update_search_state: PropTypes.func,
    search_string: PropTypes.string,
    search_inside: PropTypes.bool,
    search_metadata: PropTypes.bool,
    show_hidden: PropTypes.bool,
    field_with: PropTypes.number,
    include_search_jumper: PropTypes.bool,
    searchNext: PropTypes.func,
    searchPrev: PropTypes.func,
    search_ref: PropTypes.object,
    number_matches: PropTypes.number,
    update_delay: PropTypes.number
};

SearchForm.defaultProps = {
    allow_search_inside: false,
    allow_search_metadata: false,
    allow_show_hidden: false,
    allow_regex: false,
    regex: false,
    search_inside: false,
    search_metadata: false,
    show_hidden: false,
    field_width: 265,
    include_search_jumper: false,
    current_search_number: null,
    searchNext: null,
    searchPrev: null,
    search_ref: null,
    number_matches: null,
    update_delay: 500
};

function BpSelectorTable(props) {
    const [columnWidths, setColumnWidths, columnWidthsRef] = useStateAndRef(null);
    const saved_data_dict = useRef(null);
    const data_update_required = useRef(null);
    const table_ref = useRef(null);

    useEffect(() => {
        computeColumnWidths();
        saved_data_dict.current = props.data_dict;
    }, []);

    useEffect(() => {
        if ((columnWidthsRef.current == null) || !_.isEqual(props.data_dict, saved_data_dict.current)) {
            computeColumnWidths();
            saved_data_dict.current = props.data_dict;
        }
    });

    const pushCallback = useCallbackStack();

    function computeColumnWidths() {
        if (Object.keys(props.data_dict).length == 0) return;
        let column_names = Object.keys(props.columns);
        let bcwidths = compute_initial_column_widths(column_names, Object.values(props.data_dict));
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
        pushCallback(() => {
            let the_sum = columnWidthsRef.current.reduce((a, b) => a + b, 0);
            props.communicateColumnWidthSum(the_sum)
        })
    }

    function _onCompleteRender() {
        if (data_update_required.current != null) {
            props.initiateDataGrab(data_update_required.current);
            data_update_required.current = null
        }
        const lastColumnRegion = Regions.column(Object.keys(props.columns).length - 1);
        const firstColumnRegion = Regions.column(0);
        table_ref.current.scrollToRegion(lastColumnRegion);
        table_ref.current.scrollToRegion(firstColumnRegion)
    }

    function haveRowData(rowIndex) {
        return props.data_dict.hasOwnProperty(rowIndex)
    }

    function _cellRendererCreator(column_name) {
        return (rowIndex) => {
            if (!haveRowData(rowIndex)) {
                if (data_update_required.current == null) {
                    data_update_required.current = rowIndex;
                }

                return (<Cell key={column_name}
                              loading={true}>
                    </Cell>
                )
            }
            let the_body;
            let the_class = "";
            if (Object.keys(props.data_dict[rowIndex]).includes(column_name)) {

                if ("hidden" in props.data_dict[rowIndex] && props.data_dict[rowIndex]["hidden"]) {
                    the_class = "hidden_cell"
                }
                let the_text = String(props.data_dict[rowIndex][column_name]);
                if (the_text.startsWith("icon:")) {
                    the_text = the_text.replace(/(^icon:)/gi, "");
                    the_body = <Icon icon={the_text} size={14}/>
                } else {
                    the_body = (<TruncatedFormat className={the_class}>
                        {the_text}
                    </TruncatedFormat>)
                }

            } else {
                the_body = ""
            }
            let tclass;
            if (props.open_resources_ref && props.open_resources_ref.current &&
                props.open_resources_ref.current.includes(props.data_dict[rowIndex][props.identifier_field])) {
                tclass = "open-selector-row";
            } else {
                tclass = ""
            }
            return (
                <Cell key={column_name}
                      interactive={true}
                      truncated={true}
                      tabIndex={-1}
                      onKeyDown={props.keyHandler}
                      wrapText={true}>
                    <Fragment>
                        <div className={tclass}
                             onDoubleClick={() => props.handleRowDoubleClick(props.data_dict[rowIndex])}>
                            {the_body}
                        </div>
                    </Fragment>
                </Cell>
            )
        };
    }

    function _renderMenu(sortColumn) {
        let sortAsc = () => {
            props.sortColumn(sortColumn, "ascending")
        };
        let sortDesc = () => {
            props.sortColumn(sortColumn, "descending")
        };
        return (
            <Menu>
                <MenuItem icon="sort-asc" onClick={sortAsc} text="Sort Asc"/>
                <MenuItem icon="sort-desc" onClick={sortDesc} text="Sort Desc"/>
            </Menu>
        );
    }

    function _columnHeaderNameRenderer(the_text) {
        let the_body;
        the_text = String(the_text);
        if (the_text.startsWith("icon:")) {
            the_text = the_text.replace(/(^icon:)/gi, "");
            the_body = <Icon icon={the_text} size={14}/>
        } else {
            the_body = <div className="bp5-table-truncated-text">{the_text}</div>
        }
        return the_body
    }

    let column_names = Object.keys(props.columns);
    let columns = column_names.map((column_name) => {
        const cellRenderer = _cellRendererCreator(column_name);
        const columnHeaderCellRenderer = () => <ColumnHeaderCell name={column_name}
                                                                 nameRenderer={_columnHeaderNameRenderer}
                                                                 menuRenderer={() => {
                                                                     return (_renderMenu(column_name))
                                                                 }}/>;

        return <Column cellRenderer={cellRenderer}
                       enableColumnReordering={false}
                       columnHeaderCellRenderer={columnHeaderCellRenderer}
                       key={column_name}
                       name={column_name}/>
    });
    let obj = {cwidths: columnWidths, nrows: props.num_rows};
    let hsh = hash(obj);
    let dependencies;
    if (props.open_resources_ref && props.open_resources_ref.current) {
        dependencies = [props.data_dict, props.open_resources_ref.current]
    }
    else {
        dependencies = [props.data_dict]
    }
    return (
        <HotkeysProvider>
            <Table2 numRows={props.num_rows}
                    ref={table_ref}
                    cellRendererDependencies={dependencies}
                    bodyContextMenuRenderer={props.renderBodyContextMenu}
                    enableColumnReordering={false}
                    enableColumnResizing={props.enableColumnResizing}
                    maxColumnWidth={props.maxColumnWidth}
                    enableMultipleSelection={true}
                    defaultRowHeight={23}
                    selectedRegions={props.selectedRegions}
                    enableRowHeader={false}
                    columnWidths={columnWidthsRef.current}
                    onCompleteRender={_onCompleteRender}
                    selectionModes={[RegionCardinality.FULL_ROWS, RegionCardinality.CELLS]}
                    onSelection={(regions) => props.onSelection(regions)}
            >
                {columns}
            </Table2>
        </HotkeysProvider>
    )
}

BpSelectorTable = memo(BpSelectorTable);

BpSelectorTable.propTypes = {
    columns: PropTypes.object,
    open_resources_ref: PropTypes.object,
    maxColumnWidth: PropTypes.number,
    enableColumnResizing: PropTypes.bool,
    selectedRegions: PropTypes.array,
    data_dict: PropTypes.object,
    num_rows: PropTypes.number,
    keyHandler: PropTypes.func,
    communicateColumnWidthSum: PropTypes.func,
    sortColumn: PropTypes.func,
    onSelection: PropTypes.func,
    handleRowDoubleClick: PropTypes.func,
    identifier_field: PropTypes.string,
    rowChanged: PropTypes.number
};

BpSelectorTable.defaultProps = {
    columns: {
        "name": {"sort_field": "name", "first_sort": "ascending"},
        "created": {"sort_field": "created_for_sort", "first_sort": "descending"},
        "updated": {"sort_field": "updated_for_sort", "first_sort": "ascending"},
        "tags": {"sort_field": "tags", "first_sort": "ascending"}
    },
    identifier_field: "name",
    enableColumnResigin: false,
    maxColumnWidth: null,
    active_row: 0,
    show_animations: false,
    handleSpaceBarPress: null,
    keyHandler: null,
    draggable: true,
    rowChanged: 0
};

const MAX_INITIAL_CELL_WIDTH = 300;
const ICON_WIDTH = 35;

function compute_initial_column_widths(header_list, data_list) {
    const ncols = header_list.length;
    const max_field_width = MAX_INITIAL_CELL_WIDTH;

    // Get sample header and body cells

    // set up a canvas so that we can use it to compute the width of text
    let body_font = $($(".bp5-table-truncated-text")[0]).css("font");
    let header_font = $($(".bp5-table-column-name-text")[0]).css("font");
    let canvas_element = document.getElementById("measure-canvas");
    let ctx = canvas_element.getContext("2d");
    let added_body_width = 20;
    let added_header_width = 30;

    let column_widths = {};
    let columns_remaining = [];
    ctx.font = header_font;
    for (let c of header_list) {
        let cstr = String(c);
        if (cstr.startsWith("icon:")) {
            column_widths[cstr] = ICON_WIDTH
        } else {
            column_widths[cstr] = ctx.measureText(cstr).width + added_header_width;
        }
        columns_remaining.push(cstr)
    }
    let the_row;
    let the_width;
    let the_text;
    let the_child;

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
            if (the_text.startsWith("icon:")) {
                the_width = ICON_WIDTH
            } else {
                the_width = ctx.measureText(the_text).width + added_body_width;
            }

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