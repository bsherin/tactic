import React from "react";
import {FormGroup} from "@blueprintjs/core";
import {useState, Fragment} from "react";

import {TagButtonList} from "./tag_buttons_react";
import {BpSelectorTable, SearchForm} from "./library_widgets";
export {LibraryTablePane}

function LibraryTablePane(props) {
    const [, set_total_width] = useState(500);

    return (
        <Fragment>
            <div className="d-flex flex-row" style={{height: "100%", width: "100%", position: "relative"}}>
                <div className="d-flex justify-content-around"
                     style={{
                         paddingRight: 10,
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
                <div className={props.pane_type + "-pane"}
                     style={{
                         flex: "1 1 0",
                         minWidth: 0,
                         overflowY: "auto",
                         marginTop: 15,
                         padding: 5,
                         marginBottom: 15,
                         display: "flex",
                         flexDirection: "column"
                     }}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        {props.pane_type == "all" &&
                            <FormGroup label="Filter:" inline={true} style={{marginBottom: 0}}>
                                {props.filter_buttons}
                            </FormGroup>
                        }
                        <SearchForm allow_search_inside={props.allow_search_inside}
                                    allow_search_metadata={props.allow_search_metadata}
                                    allow_show_hidden={true}
                                    update_search_state={props.update_search_state}
                                    search_string={props.pStateRef.current.search_state.search_string}
                                    search_inside={props.pStateRef.current.search_state.search_inside}
                                    show_hidden={props.pStateRef.current.search_state.show_hidden}
                                    search_metadata={props.pStateRef.current.search_state.search_metadata}
                        />
                    </div>
                    <BpSelectorTable data_dict={props.pStateRef.current.data_dict}
                                     rowChanged={props.pStateRef.current.rowChanged}
                                     columns={props.columns}
                                     num_rows={props.pStateRef.current.num_rows}
                                     open_resources_ref={props.open_resources_ref}
                                     sortColumn={props.sortColumn}
                                     selectedRegions={props.pStateRef.current.select_state.selectedRegions}
                                     communicateColumnWidthSum={set_total_width}
                                     onSelection={props.onSelection}
                                     keyHandler={props.keyHandler}
                                     initiateDataGrab={props.initiateDataGrab}
                                     renderBodyContextMenu={props.renderBodyContextMenu}
                                     handleRowDoubleClick={props.handleRowDoubleClick}
                    />
                </div>
            </div>
        </Fragment>
    )
}