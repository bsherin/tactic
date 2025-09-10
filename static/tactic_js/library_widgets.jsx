import React from "react";
import {Fragment, useState, useEffect, useRef, memo, useMemo} from 'react';

import {
    InputGroup,
    Menu,
    MenuItem,
    Icon,
    FormGroup,
    Switch,
    Button,
    ButtonGroup,
    Popover,
    Checkbox,
    MenuDivider,
    Alignment
} from "@blueprintjs/core";
import {Cell, Column, Table, ColumnHeaderCell, SelectionModes, TruncatedFormat, Regions} from "@blueprintjs/table";

import {useDebounce} from "./utilities_react";

export {SearchForm}
export {BpSelectorTable}
export {compute_initial_column_widths};
export {ResourceFilter};
export {ColumnSelector};
export {base_columns, all_columns}

const DEFAULT_ROW_HEIGHT = 35;
const MAX_INITIAL_CELL_WIDTH = 300;
const ICON_WIDTH = 35;

function SearchForm(props) {
    props = {
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
        update_delay: 500,
        update_search_state: null,
        search_string: "",
        ...props
    };
    const [temp_text, set_temp_text] = useState(null);
    const [waiting, doUpdate] = useDebounce((newval) => {
        props.update_search_state({"search_string": newval});
    });

    function _handleSearchFieldChange(event) {
        doUpdate(event.target.value);
        set_temp_text(event.target.value)
    }

    function _handleSearchMetadataChange(event) {
        update_search_state({"search_metadata": event.target.checked});
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
                                size="small"
                                inputRef={props.search_ref}
                    />
                    {props.allow_regex &&
                        <Switch label="regexp"
                                className="ml-3 mb-0 mt-1"
                                size="medium"
                                checked={props.regex}
                                onChange={_handleRegexChange}
                        />
                    }
                    {props.allow_search_metadata &&
                        <Switch label="metadata"
                                className="ml-3 mb-0 mt-1"
                                size="medium"
                                checked={props.search_metadata}
                                onChange={_handleSearchMetadataChange}
                        />
                    }
                    {props.allow_search_inside &&
                        <Switch label="inside"
                                className="ml-3 mb-0 mt-1"
                                size="medium"
                                checked={props.search_inside}
                                onChange={_handleSearchInsideChange}
                        />
                    }
                    {props.allow_show_hidden &&
                        <Switch label="show hidden"
                                className="ml-3 mb-0 mt-1"
                                size="medium"
                                checked={props.show_hidden}
                                onChange={_handleShowHiddenChange}
                        />
                    }
                    {props.include_search_jumper &&
                        <ButtonGroup style={{marginLeft: 5, padding: 2}}>
                            <Button onClick={props.searchNext} icon="caret-down" text={undefined} size="small"/>
                            <Button onClick={props.searchPrev} icon="caret-up" text={undefined} size="small"/>
                        </ButtonGroup>

                    }
                </div>
            </FormGroup>
        </Fragment>
    )
}

SearchForm = memo(SearchForm);

const all_columns = ["icon:th", "name", "icon:upload", "created", "updated", "size"];
const base_columns = ["icon:th", "name", "icon:upload"];

function ColumnSelector({
                            icon_dict,
                            selectedColumns,
                            onColumnChange,
                        }) {

    const toggleColumn = (k) => {
        const next = new Set(selectedColumns);
        if (next.has(k)) next.delete(k);
        else next.add(k);
        onColumnChange([...next]);
    };

    return (
        <Popover
            placement="bottom-start"
            content={
                <Menu>
                    {all_columns.map((k) => (
                        <MenuItem
                            key={k}
                            shouldDismissPopover={false}
                            // icon={icon_dict[k]}
                            text={
                                <Checkbox
                                    checked={selectedColumns.includes(k)}
                                    label={k}
                                    className="menu-control"
                                    disabled={base_columns.includes(k)}
                                    alignIndicator={Alignment.END}
                                    onChange={() => toggleColumn(k)}
                                />
                            }
                        />
                    ))}
                </Menu>
            }
        >
            <Button icon="list-columns"/>
        </Popover>
    );
}

function ResourceFilter({
                            kinds,
                            icon_dict,
                            selectedKinds,
                            onKindChange,
                            update_search_state,
                            search_inside = false,
                            search_metadata = false,
                            show_hidden = false,
                            showSummary = false
                        }) {
    const allSelected = selectedKinds.size === kinds.length;
    const noneSelected = selectedKinds.size === 0;



    const toggleKind = (k) => {
        const next = new Set(selectedKinds);
        if (next.has(k)) next.delete(k);
        else next.add(k);
        onKindChange([...next]);
    };

    ///const selectAll = () => onKindChange(kinds);
    const selectNone = () => onKindChange([]);

    const summary = useMemo(() => {
        if (!showSummary) return "";
        if (allSelected) return "All kinds";
        if (noneSelected) return "None";
        return Array.from(selectedKinds).join(", ");
    }, [allSelected, noneSelected, selectedKinds]);

    function _handleSearchMetadataChange(event) {
        update_search_state({"search_metadata": event.target.checked});
    }

    function _handleSearchInsideChange(event) {
        update_search_state({"search_inside": event.target.checked});

    }

    function _handleShowHiddenChange(event) {
        update_search_state({"show_hidden": event.target.checked});
    }

    return (
        <Popover
            placement="bottom-start"
            content={
                <Menu>
                    <div onClick={selectNone}
                         style={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <MenuItem
                            text="Clear"
                            key="clear"
                            shouldDismissPopover={false}
                            disabled={noneSelected}
                        />
                        <Icon icon="circle" className="bp6-menu-item"/>
                    </div>
                    <MenuDivider/>
                    {kinds.map((k) => (
                        <MenuItem
                            key={k}
                            shouldDismissPopover={false}
                            icon={icon_dict[k]}
                            text={
                                <Checkbox
                                    checked={selectedKinds.includes(k)}
                                    label={k}
                                    className="menu-control"
                                    alignIndicator={Alignment.END}
                                    onChange={() => toggleKind(k)}
                                />
                            }
                        />
                    ))}
                    <MenuDivider/>
                    <MenuItem
                        key="metadata"
                        shouldDismissPopover={false}
                        text={
                                <Switch
                                    checked={search_metadata}
                                    label="Metadata"
                                    className="menu-control"
                                    onChange={_handleSearchMetadataChange}
                                />
                            }/>
                    <MenuItem
                        key="inside"
                        shouldDismissPopover={false}
                        text={
                                <Switch
                                    checked={search_inside}
                                    label="inside"
                                    className="menu-control"
                                    onChange={_handleSearchInsideChange}
                                />
                            }/>
                    <MenuDivider/>
                    <MenuItem
                        key="hidden"
                        shouldDismissPopover={false}
                        text={
                                <Switch
                                    checked={show_hidden}
                                    label="show hidden"
                                    className="menu-control"
                                    alignIndicator={Alignment.END}
                                    onChange={_handleShowHiddenChange}
                                />
                            }/>
                </Menu>
            }
        >
            <Button icon="filter" text={`${summary}`}/>
        </Popover>
    );
}

function BpSelectorTable(props) {
    props = {
        columns: ["name", "created", "updated"],
        identifier_field: "_id",
        enableColumnResigin: false,
        onColumnWidthChanged: null,
        maxColumnWidth: null,
        active_row: 0,
        show_animations: false,
        handleSpaceBarPress: null,
        keyHandler: null,
        draggable: true,
        rowChanged: 0,
        columnWidths: null,
        ...props
    };
    const [columnWidths, setColumnWidths] = useState(null);
    const saved_data_dict = useRef(null);
    const data_update_required = useRef(null);
    const table_ref = useRef(null);

    useEffect(() => {
        // computeColumnWidths();
        saved_data_dict.current = props.data_dict;
    }, []);

    // useEffect(() => {
    //     if ((columnWidthsRef.current == null) || !_.isEqual(props.data_dict, saved_data_dict.current)) {
    //         computeColumnWidths();
    //         saved_data_dict.current = props.data_dict;
    //     }
    // });

    function computeColumnWidths() {
        if (Object.keys(props.data_dict).length == 0) return;
        let column_names = props.columns;
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
    }

    async function _onCompleteRender() {
        if (!props.columnWidths) {
            computeColumnWidths();
        }
        if (data_update_required.current != null) {
            await props.initiateDataGrab(data_update_required.current);
            data_update_required.current = null
        }
        const lastColumnRegion = Regions.column(props.columns.length - 1);
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
                    if (("res_type" in props.data_dict[rowIndex]) && (props.data_dict[rowIndex]["res_type"] == "tile")) {
                        the_class = "tile-icon-cell"

                    } else {
                        the_class = "icon-cell";
                    }
                    the_text = the_text.replace(/(^icon:)/gi, "");
                    the_body = <Icon className={the_class} icon={the_text} size={14}/>
                } else {
                    the_body = (<TruncatedFormat className={the_class}>
                        {the_text}
                    </TruncatedFormat>)
                }

            } else {
                the_body = ""
            }
            return (
                <Cell key={column_name}
                      className="library-table-cell"
                      interactive={true}
                      truncated={true}
                      tabIndex={-1}
                      onKeyDown={props.keyHandler}
                      wrapText={true}>
                    <Fragment>
                        <div onDoubleClick={() => props.handleRowDoubleClick(props.data_dict[rowIndex])}>
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
            the_body = <div className="bp6-table-truncated-text">{the_text}</div>
        }
        return the_body
    }

    let column_names = props.columns;
    let columns = column_names.map((column_name) => {
        const cellRenderer = _cellRendererCreator(column_name);
        const columnHeaderCellRenderer = () => <ColumnHeaderCell name={column_name}
                                                                 className='library-header-cell'
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
    let dependencies;
    if (props.open_resources_ref && props.open_resources_ref.current) {
        dependencies = [props.data_dict, props.open_resources_ref.current]
    } else {
        dependencies = [props.data_dict]
    }
    return (
        <Table numRows={props.num_rows}
               ref={table_ref}
               cellRendererDependencies={dependencies}
               bodyContextMenuRenderer={props.renderBodyContextMenu}
               enableColumnReordering={false}
               enableColumnResizing={props.enableColumnResizing}
               maxColumnWidth={props.maxColumnWidth}
               enableMultipleSelection={true}
               defaultRowHeight={DEFAULT_ROW_HEIGHT}
               selectedRegions={props.selectedRegions}
               enableRowHeader={false}
               onColumnWidthChanged={props.onColumnWidthChanged}
               columnWidths={props.columnWidths ? props.columnWidths : columnWidths}
               onCompleteRender={_onCompleteRender}
               selectionModes={SelectionModes.ALL}
               onSelection={(regions) => props.onSelection(regions)}
        >
            {columns}
        </Table>
    )
}

BpSelectorTable = memo(BpSelectorTable);

function compute_initial_column_widths(header_list, data_list) {
    const max_field_width = MAX_INITIAL_CELL_WIDTH;

    // Get sample header and body cells

    // set up a canvas so that we can use it to compute the width of text
    // let body_font = $($(".bp6-table-truncated-text")[0]).css("font");
    const element = document.querySelector(".bp6-table-truncated-text");
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