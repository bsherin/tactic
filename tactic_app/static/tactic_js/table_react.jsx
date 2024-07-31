
import React from "react";
import {useState, useEffect, useRef, memo} from "react";
import PropTypes from 'prop-types';

import { Text, FormGroup, Spinner, InputGroup, ButtonGroup, Button, Card, Switch } from "@blueprintjs/core";

import {GlyphButton} from "./blueprint_react_widgets";
import {ReactCodemirror6} from "./react-codemirror6";
import {BpSelect} from "./blueprint_mdata_fields";
import {postPromise, postWithCallback} from "./communication_react"

export {MainTableCard, MainTableCardHeader, FreeformBody}

function FreeformBody(props) {
    const top_ref = useRef(null);
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
        <div ref={top_ref}>
            <ReactCodemirror6 handleBlur={_handleBlur}
                             handleChange={null}
                             code_content={props.mState.data_text}
                             sync_to_prop={true}
                             soft_wrap={props.mState.soft_wrap}
                             mode="text"
                             setCMObject={_setCMObject}
                             readOnly={false}/>
        </div>
    )
}

FreeformBody = memo(FreeformBody);

function SmallSpinner () {
    return (
        <div className="d-flex">
            <span className=" loader-small"></span>
        </div>
    )
}

function MainTableCardHeader(props) {
    props = {
        is_freeform: false,
        soft_wrap: false,
        handleSoftWrapChange: null,
        ...props
    };

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

    async function _handleFilter() {
        const data_dict = {"text_to_find": props.mState.search_text};
        try {
            await postPromise(props.main_id, "UnfilterTable", data_dict);
            if (props.search_text !== "") {
                await postPromise(props.main_id, "FilterTable", data_dict);
                props.setMainStateValue({"table_is_filtered": true,
                    "selected_regions": null,
                    "selected_row": null})

            }
        }
        catch (e) {
            errorDrawerFuncs.addFromError("Error filtering table", e);
        }
    }

    async function _handleUnFilter() {
        props.handleSearchFieldChange(null);
        try {
            if (props.mState.table_is_filtered) {
                await postPromise(props.main_id, "UnfilterTable", {selected_row: props.mState.selected_row});
                props.setMainStateValue({"table_is_filtered": false,
                    "selected_regions": null,
                    "selected_row": null})
            }
        }
        catch (e) {
            errorDrawerFuncs.addFromError("Error unfiltering table", e);
            return
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

