import React from "react";
import {Fragment, useState, useEffect} from "react";

import _ from "lodash";

import {Button} from "@blueprintjs/core";
import {icon_dict} from "./combined_metadata";

import {TagButtonList} from "./tag_buttons_react";
import {BpSelectorTable, SearchForm, FilterBar} from "./library_widgets";
import {res_types} from "./library_pane";

export {LibraryTablePane}

function sumArray(arr) {
    return arr.reduce((acc, val) => acc + val, 0);
}

const defaultColumnWidths = {
    "icon:th": 35,
    "name": 280,
    "icon:upload": 35,
    "created": 165,
    "updated": 165,
    "size": 75
};

function LibraryTablePane(props) {

    const [columnWidths, setColumnWidths] = useState([]);
    const [totalWidth, setTotalWidth] = useState(700);

    function onColumnWidthChange(index, newWidth) {
        const newWidths = [...columnWidths];
        newWidths[index] = newWidth;
        setColumnWidths(newWidths);
    }

    useEffect(() => {
        let newWidths = [];
        for (let col of props.columns) {
            newWidths.push(defaultColumnWidths[col]);
        }
        setColumnWidths(newWidths);
    }, [props.columns]);

    useEffect(() => {
        let total = sumArray(columnWidths);
        setTotalWidth(total);
    }, [columnWidths]);

    function filterIsActive() {
        return props.pStateRef.current.search_state.show_hidden ||
            props.pStateRef.current.search_state.search_metadata ||
            props.pStateRef.current.search_state.search_inside ||
            !(_.isEqual(res_types, props.pStateRef.current.search_state.filterType) ||
                _.isEqual([], props.pStateRef.current.search_state.filterType))
    }

    function filteredByResources() {
        return !(_.isEqual(res_types, props.pStateRef.current.search_state.filterType) ||
                _.isEqual([], props.pStateRef.current.search_state.filterType))
    }

    let pane_class = "all-pane";
    if (filterIsActive()) {
        pane_class += " filter-bar-active"
    }
    if (filteredByResources()) {
        pane_class += " filtered-by-resources"
    }

    return (
        <Fragment>
            <div className="d-flex flex-row resource-viewer-left-pane-holder top-padded"
                 style={{height: "100%", width: "100%", position: "relative"}}>
                <div className="d-flex"
                     style={{
                         flex: "1 1 0",
                         minWidth: 0,
                         justifyContent: "flex-start",
                         height: "100%",
                         position: "relative"
                     }}>
                    <TagButtonList tag_list={props.pStateRef.current.tag_list}
                                   tagRoot={props.pStateRef.current.search_state.tagRoot}
                                   expanded_tags={props.pStateRef.current.search_state.expanded_tags}
                                   active_tag={props.pStateRef.current.search_state.active_tag}
                                   updateTagState={props.updateTagState}
                                   doTagDelete={props.doTagDelete}
                                   doTagRename={props.doTagRename}
                    />
                </div>
                <div className={pane_class}
                     style={{
                         flex: "5 5 0",
                         minWidth: 0,
                         overflowY: "auto",
                         display: "flex",
                         flexDirection: "column"
                     }}>
                    <div style={{
                        display: "flex", flexDirection: "row",
                        justifyContent: "space-between", width: totalWidth
                    }}>

                        <SearchForm allow_search_inside={false}
                                    allow_search_metadata={false}
                                    allow_show_hidden={false}
                                    update_search_state={props.update_search_state}
                                    search_string={props.pStateRef.current.search_state.search_string}
                                    search_inside={props.pStateRef.current.search_state.search_inside}
                                    show_hidden={props.pStateRef.current.search_state.show_hidden}
                                    search_metadata={props.pStateRef.current.search_state.search_metadata}
                        />
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <Button icon="filter" variant="minimal" onClick={props.toggleFilterBar}/>
                            {props.column_selector && props.column_selector}
                        </div>
                    </div>
                    {props.show_filter_bar &&
                        <FilterBar kinds={res_types}
                                   icon_dict={icon_dict}
                                   selectedKinds={props.pStateRef.current.search_state.filterType}
                                   search_string={props.pStateRef.current.search_state.search_string}
                                   search_inside={props.pStateRef.current.search_state.search_inside}
                                   show_hidden={props.pStateRef.current.search_state.show_hidden}
                                   search_metadata={props.pStateRef.current.search_state.search_metadata}
                                   update_search_state={props.update_search_state}
                                   width={totalWidth}
                                   onKindChange={async (rtypes) => {
                                       await props.setFilterType(rtypes)
                                   }}/>
                    }
                    {props.columns.length > 0 && props.columns.length === columnWidths.length &&
                        <BpSelectorTable data_dict={props.pStateRef.current.data_dict}
                                         rowChanged={props.pStateRef.current.rowChanged}
                                         columns={props.columns}
                                         columnWidths={columnWidths}
                                         onColumnWidthChanged={onColumnWidthChange}
                                         num_rows={props.pStateRef.current.num_rows}
                                         open_resources_ref={props.open_resources_ref}
                                         sortColumn={props.sortColumn}
                                         selectedRegions={props.pStateRef.current.select_state.selectedRegions}
                                         onSelection={props.onSelection}
                                         keyHandler={props.keyHandler}
                                         initiateDataGrab={props.initiateDataGrab}
                                         renderBodyContextMenu={props.renderBodyContextMenu}
                                         handleRowDoubleClick={props.handleRowDoubleClick}
                        />
                    }
                </div>
            </div>
        </Fragment>
    )
}