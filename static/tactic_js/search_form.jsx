
import React from "react";
import {memo} from "react";

import {InputGroup, ButtonGroup, Button} from "@blueprintjs/core";
export {FilterSearchForm}

function FilterSearchForm(props) {
    props = {
         handleFilter: null,
         handleUnfilter: null,
         searchNext: null,
         searchPrevious: null,
         search_helper_text: null,
         outer_style: {},
        ...props
     };

     function _handleSubmit(e) {
         props.searchNext();
         e.preventDefault();
     }

    return (
        <form onSubmit={_handleSubmit}
              className="console-search-form d-flex flex-row bp6-form-group" style={props.outer_style}>
            <div className="d-flex flex-column">
                <div className="d-flex flex-row">
                    <InputGroup type="search"
                                leftIcon="search"
                                placeholder="Search"
                                size="small"
                                value={!props.search_string ? "" : props.search_string}
                                onChange={props.handleSearchFieldChange}
                                autoCapitalize="none"
                                autoCorrect="off"
                                className="mr-2"/>
                    <ButtonGroup>
                        {props.handleFilter &&
                            <Button onClick={props.handleFilter} size="small">
                                Filter
                            </Button>
                        }

                        {props.handleUnFilter &&
                            <Button onClick={props.handleUnFilter} size="small">
                                Clear
                            </Button>
                        }
                        {props.searchNext &&
                            <Button onClick={props.searchNext} icon="caret-down" text={undefined} size="small"/>
                        }
                        {props.searchPrevious &&
                            <Button onClick={props.searchPrevious} icon="caret-up" text={undefined}
                                 size="small"/>
                        }
                    </ButtonGroup>
                </div>
                <div className="bp6-form-helper-text" style={{marginLeft: 10}}>{props.search_helper_text}</div>
            </div>
        </form>
    )
 }

 FilterSearchForm = memo(FilterSearchForm);