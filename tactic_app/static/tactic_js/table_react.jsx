

import React from "react";
import {useState, useEffect, useRef, memo, forwardRef} from "react";
import PropTypes from 'prop-types';

import { Text, FormGroup, Spinner, InputGroup, ButtonGroup, Button, Card, Switch } from "@blueprintjs/core";

import {GlyphButton} from "./blueprint_react_widgets";
import {ReactCodemirror} from "./react-codemirror";
import {BpSelect} from "./blueprint_mdata_fields";
import {postWithCallback} from "./communication_react"

export {MainTableCard, MainTableCardHeader, FreeformBody}

function FreeformBody(props, passedRef) {

    const cmobject = useRef(null);
    const overlay = useRef(null);

    function _setCMObject(lcmobject) {
        cmobject.current = lcmobject
    }

    function _clearSearch() {
        if (cmobject.current && overlay.current) {
            cmobject.current.removeOverlay(overlay.current);
            overlay.current = null
        }
    }

    function _doSearch(){
        if (props.mState.alt_search_text && (props.mState.alt_search_text != "") && cmobject.current) {
            overlay.current = mySearchOverlay(props.mState.alt_search_text, true);
            cmobject.current.addOverlay(overlay.current)
        }
        else if (props.mState.search_text && (props.mState.search_text != "") && cmobject) {
            overlay.current = mySearchOverlay(props.mState.search_text, true);
            cmobject.current.addOverlay(overlay.current)
        }
    }

    function mySearchOverlay(query, caseInsensitive) {
        if (typeof query == "string")
          { // noinspection RegExpRedundantEscape
              query = new RegExp(query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), caseInsensitive ? "gi" : "g");
          }
        else if (!query.global)
          query = new RegExp(query.source, query.ignoreCase ? "gi" : "g");

        return {token: function(stream) {
          query.lastIndex = stream.pos;
          const match = query.exec(stream.string);
          if (match && match.index == stream.pos) {
            stream.pos += match[0].length || 1;
            return "searching"; // I believe this causes the style .cm-searching to be applied
          } else if (match) {
            stream.pos = match.index;
          } else {
            stream.skipToEnd();
          }
        }};
      }

    function _handleBlur(new_data_text) {
        postWithCallback(props.main_id, "add_freeform_document",
            { document_name: props.mState.table_spec.document_name, doc_text: new_data_text }, null)
    }

    function _handleChange(new_data_text) {

    }

    _clearSearch();
    _doSearch();
    return (
        <div ref={passedRef}>
            <ReactCodemirror handleBlur={_handleBlur}
                             handleChange={null}
                             code_content={props.mState.data_text}
                             sync_to_prop={true}
                             dark_theme={props.dark_theme}
                             soft_wrap={props.mState.soft_wrap}
                             mode="Plain Text"
                             code_container_height={props.code_container_height}
                             code_container_width={props.code_container_width - 30}
                             setCMObject={_setCMObject}
                             readOnly={false}/>
        </div>
    )
}

// FreeformBody.propTypes = {
//     main_id: PropTypes.string,
//     document_name: PropTypes.string,
//     my_ref: PropTypes.object,
//     data_text: PropTypes.string,
//     code_container_height: PropTypes.number,
//     search_text: PropTypes.string,
//     alt_search_text: PropTypes.string,
//     setMainStateValue: PropTypes.func,
//     soft_wrap: PropTypes.bool,
// };

FreeformBody = memo(forwardRef(FreeformBody));


function SmallSpinner () {
    return (
        <div className="d-flex">
            <span className=" loader-small"></span>
        </div>
    )
}

function MainTableCardHeader(props) {

    const heading_left_ref = useRef(null);
    const heading_right_ref = useRef(null);

    const [hide_right_element, set_hide_right_element] = useState(false);

    useEffect(()=>{
        let hide_right = _getHideRight();
        if (hide_right != hide_right_element) {
            set_hide_right_element(hide_right)
        }
    });

    function _getHideRight() {
        let le_rect = heading_left_ref.current.getBoundingClientRect();
        let re_rect = heading_right_ref.current.getBoundingClientRect();
        return re_rect.x < (le_rect.x + le_rect.width + 10);
    }

    function _handleSearchFieldChange(event) {
        props.handleSearchFieldChange(event.target.value)
    }

    function _handleFilter() {
        const data_dict = {"text_to_find": props.mState.search_text};
        postWithCallback(props.main_id, "UnfilterTable", data_dict, function () {
            if (props.search_text !== "") {
                postWithCallback(props.main_id, "FilterTable", data_dict,
                    props.setMainStateValue({"table_is_filtered": true,
                        "selected_regions": null,
                        "selected_row": null}), null)
                }
        });
    }

    function _handleUnFilter() {
        props.handleSearchFieldChange(null);
        if (props.mState.table_is_filtered) {
            postWithCallback(props.main_id, "UnfilterTable", {selected_row: props.mState.selected_row}, null);
            props.setMainStateValue({"table_is_filtered": false,
                "selected_regions": null,
                "selected_row": null})
        }
    }

    function _handleSubmit(e) {
        e.preventDefault();
    }

    function _onChangeDoc(value) {
        props.handleChangeDoc(value)
    }

    let heading_right_opacity = hide_right_element ? 0 : 100;
    let select_style = {height: 30, maxWidth: 250};
    let doc_button_text = <Text ellipsize={true}>{props.mState.table_spec.current_doc_name}</Text>;
    let self = this;
    return (
        <div className="d-flex pl-2 pr-2 justify-content-between align-baseline main-heading" style={{height: 50}}>
            <div id="heading-left" ref={heading_left_ref} className="d-flex flex-column justify-content-around">
                <div className="d-flex flex-row">
                    <GlyphButton handleClick={props.toggleShrink} icon="minimize"/>
                    <div className="d-flex flex-column justify-content-around">
                        <form className="d-flex flex-row">
                            <FormGroup label={props.mState.short_collection_name}
                                          inline={true}
                                          style={{marginBottom: 0, marginLeft: 5, marginRight: 10}}>
                                <BpSelect options={props.mState.doc_names}
                                          onChange={_onChangeDoc}
                                          buttonStyle={select_style}
                                          buttonTextObject={doc_button_text}
                                          value={props.mState.table_spec.current_doc_name}/>
                            </FormGroup>
                            {props.mState.show_table_spinner &&
                                <Spinner size={15} />}
                        </form>
                    </div>
                </div>

            </div>
            <div id="heading-right" ref={heading_right_ref} style={{opacity: heading_right_opacity}} className="d-flex flex-column justify-content-around">
                <form onSubmit={_handleSubmit} style={{alignItems: "center"}} className="d-flex flex-row">
                    {props.is_freeform &&
                        <Switch label="soft wrap"
                                 className="mr-2 mb-0"
                                large={false}
                                checked={props.mState.soft_wrap}
                                onChange={props.handleSoftWrapChange}
                        />
                    }
                        <Switch label="edit"
                                 className="mr-4 mb-0"
                                large={false}
                                checked={props.mState.spreadsheet_mode}
                                onChange={props.handleSpreadsheetModeChange}
                        />
                        <InputGroup type="search"
                                       leftIcon="search"
                                       placeholder="Search"
                                       value={!props.mState.search_text ? "" : props.mState.search_text}
                                       onChange={_handleSearchFieldChange}
                                       autoCapitalize="none"
                                       autoCorrect="off"
                                       className="mr-2"/>
                       <ButtonGroup>
                            {props.show_filter_button &&
                                <Button onClick={_handleFilter}>
                                    Filter
                                </Button>
                            }
                            <Button onClick={_handleUnFilter}>
                                Clear
                            </Button>
                       </ButtonGroup>
                </form>
            </div>
        </div>
    )
}

MainTableCardHeader.propTypes = {
    toggleShrink: PropTypes.func,
    selected_row: PropTypes.number,
    table_is_filtered: PropTypes.bool,
    setMainStateValue: PropTypes.func,
    handleSearchFieldChange: PropTypes.func,
    search_text: PropTypes.string,
    handleFilter: PropTypes.func,
    short_collection_name: PropTypes.string,
    current_doc_name: PropTypes.string,
    handleChangeDoc: PropTypes.func,
    spreadsheet_mode: PropTypes.bool,
    handleSpreadsheetModeChange: PropTypes.func,
    doc_names: PropTypes.array,
    show_table_spinner: PropTypes.bool,
    show_filter_button: PropTypes.bool,
    is_freeform: PropTypes.bool,
    soft_wrap: PropTypes.bool,
    handleSoftWrapChange: PropTypes.func

};

MainTableCardHeader.defaultProps = {
    is_freeform: false,
    soft_wrap: false,
    handleSoftWrapChange: null
};

MainTableCardHeader = memo(MainTableCardHeader);

const MAX_INITIAL_CELL_WIDTH = 400;
const EXTRA_TABLE_AREA_SPACE = 500;

function MainTableCard(props) {

    return (
        <Card id="main-panel" elevation={2}>
            {props.card_header}
            <div id="table-wrapper">
                {props.card_body}
            </div>
        </Card>
    )
}

MainTableCard.propTypes = {
    card_body: PropTypes.object,
    card_header: PropTypes.object,
};

MainTableCard = memo(MainTableCard);

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

function compute_initial_column_widths(header_list) {
    const ncols = header_list.length;
    const max_field_width = MAX_INITIAL_CELL_WIDTH;

    // Get sample header and body cells
    let header_cell = $($("#table-wrapper th")[0]);
    let body_cell = $($("#table-wrapper td")[0]);

    // set up a canvas so that we can use it to compute the width of text
    let header_font = header_cell.css("font");
    let body_font = body_cell.css("font");
    let canvas_element = document.getElementById("measure-canvas");
    let ctx = canvas_element.getContext("2d");
    let added_header_width = parseInt(header_cell.css("padding-right")) + parseInt(header_cell.css("padding-left")) + 2;
    let added_body_width = parseInt(body_cell.css("padding-right")) + parseInt(body_cell.css("padding-left")) + 2;

    let header_row = $("#table-area thead tr")[0];
    let body_rows = $("#table-area tbody tr");

    let column_widths = [];
    let columns_remaining = [];
    for (let c = 0; c < ncols; ++c) {
        column_widths.push(0);
        columns_remaining.push(c)
    }
    // Get the width for each header column
    ctx.font = header_font;
    let the_row;
    let the_width;
    let the_text;
    let the_child;
    for (let c of columns_remaining) {
        the_child = header_row.cells[c];
        the_text = the_child.innerText;
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
    for (let r = 0; r < body_rows.length; ++r) {
        if (columns_remaining.length == 0) {
            break;
        }
        the_row = body_rows[r];
        if ($(the_row).hasClass("spinner-row")) continue;
        let cols_to_remove = [];
        for (let c of columns_remaining) {
            the_child = the_row.cells[c];
            the_text = the_child.innerText;
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
    return column_widths;
}
