
import React from "react";
import {memo} from "react";
import PropTypes from 'prop-types';

import {InputGroup, ButtonGroup, Button} from "@blueprintjs/core";
export {FilterSearchForm}

function FilterSearchForm(props) {

     function _handleSubmit(e) {
         props.searchNext();
         e.preventDefault();
     }

    return (
        <form onSubmit={_handleSubmit} id="console-search-form"
              className="d-flex flex-row bp5-form-group" style={{
            justifyContent: "flex-end", marginRight: props.margin_right,
            marginBottom: 6, marginTop: 12
        }}>
            <div className="d-flex flex-column">
                <div className="d-flex flex-row">
                    <InputGroup type="search"
                                leftIcon="search"
                                placeholder="Search"
                                small={true}
                                value={!props.search_string ? "" : props.search_string}
                                onChange={props.handleSearchFieldChange}
                                autoCapitalize="none"
                                autoCorrect="off"
                                className="mr-2"/>
                    <ButtonGroup>
                        {props.handleFilter &&
                            <Button onClick={props.handleFilter} small={true}>
                                Filter
                            </Button>
                        }

                        {props.handleUnFilter &&
                            <Button onClick={props.handleUnFilter} small={true}>
                                Clear
                            </Button>
                        }
                        {props.searchNext &&
                            <Button onClick={props.searchNext} icon="caret-down" text={undefined} small={true}/>
                        }
                        {props.searchPrevious &&
                            <Button onClick={props.searchPrevious} icon="caret-up" text={undefined}
                                 small={true}/>
                        }
                    </ButtonGroup>
                </div>
                <div className="bp5-form-helper-text" style={{marginLeft: 10}}>{props.search_helper_text}</div>
            </div>
        </form>
    )
 }

 FilterSearchForm.propTypes = {
     search_string: PropTypes.string,
     handleSearchFieldChange: PropTypes.func,
     handleFilter: PropTypes.func,
     handleUnFilter: PropTypes.func,
     searchNext: PropTypes.func,
     searchPrevious: PropTypes.func,
     search_helper_text: PropTypes.string,
     margin_right: PropTypes.number
};

 FilterSearchForm.defaultProps = {
     handleFilter: null,
     handleUnfilter: null,
     searchNext: null,
     searchPrevious: null,
     search_helper_text: null,
     margin_right: 116
 };

 FilterSearchForm = memo(FilterSearchForm);