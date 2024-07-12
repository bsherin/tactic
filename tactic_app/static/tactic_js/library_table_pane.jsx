import React from "react";
import {FormGroup} from "@blueprintjs/core";
import {useState, useRef, Fragment} from "react";

import {TagButtonList} from "./tag_buttons_react";
import {BpSelectorTable, SearchForm} from "./library_widgets";
import {useSize} from "./sizing_tools";
import {postAjaxPromise} from "./communication_react";
export {LibraryTablePane}

function LibraryTablePane(props) {
    const [total_width, set_total_width] = useState(500);
    const top_ref = useRef(null);
    const [usable_width, usable_height, topX, topY] = useSize(top_ref, 0, "LibraryTablePane");


    async function _doTagDelete(tag) {
        const result_dict = {"pane_type": props.pane_type, "tag": tag};
        let data;
        try {
            await postAjaxPromise("delete_tag", result_dict);
            await _refresh_func()
        } catch (e) {
            errorDrawerFuncs.addFromError("Error deleting tag", e)
        }
    }

    async function _doTagRename(tag_changes) {
        const result_dict = {"pane_type": props.pane_type, "tag_changes": tag_changes};
        try {
            await postAjaxPromise("rename_tag", result_dict);
            await _refresh_func()
        } catch (e) {
            errorDrawerFuncs.addFromError("Error renaming tag", e)
        }
    }
    return (


        <Fragment>
            <div className="d-flex flex-row" style={{maxHeight: "100%", position: "relative"}}>
                <div className="d-flex justify-content-around"
                     style={{
                         paddingRight: 10,
                         maxHeight: usable_height
                     }}>
                    <TagButtonList tag_list={props.tag_list}
                                   tagRoot={props.tagRoot}
                                   expanded_tags={props.expanded_tags_ref.current}
                                   active_tag={props.active_tag_ref.current}
                                   updateTagState={props.updateTagState}
                                   doTagDelete={props.doTagDelete}
                                   doTagRename={props.doTagRename}
                    />
                </div>
                <div ref={top_ref}
                     className={props.pane_type + "-pane"}
                     style={{
                         width: usable_width,
                         maxWidth: total_width,
                         maxHeight: usable_height - 20, // The 20 is for the marginTop and padding
                         overflowY: "scroll",
                         marginTop: 15,
                         padding: 5
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
                                    search_string={props.search_string_ref.current}
                                    search_inside={props.search_inside_ref.current}
                                    show_hidden={props.show_hidden_ref.current}
                                    search_metadata={props.search_metadata_ref.current}
                        />
                    </div>
                    <BpSelectorTable data_dict={props.data_dict_ref.current}
                                     rowChanged={props.rowChanged}
                                     columns={props.columns}
                                     num_rows={props.num_rows}
                                     open_resources_ref={props.open_resources_ref}
                                     sortColumn={props.sortColumn}
                                     selectedRegions={props.selectedRegionsRef.current}
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