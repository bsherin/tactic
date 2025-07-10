import React, {Fragment, memo} from "react";
import {useDebounce} from "./utilities_react";
import {Button, ButtonGroup, FormGroup, InputGroup, Switch} from "@blueprintjs/core";

export {TileMakerSearchForm};

function TileMakerSearchForm(props) {
    props = {
        allow_regex: false,
        regex: false,
        show_hidden: false,
        field_width: 265,
        include_search_jumper: false,
        search_ref: null,
        number_matches: null,
        update_delay: 500,
        searchState: null,
        searchStateRef: null,
        searchDispatch: null,
        searchNext: null,
        searchPrev: null,
        ...props
    };
    const [, doUpdate] = useDebounce((newval)=>{
        props.searchDispatch({type:"SET_SEARCH_STRING", payload: newval});
    });

    function _handleSearchFieldChange(event) {
        doUpdate(event.target.value);
        props.searchDispatch({type: "SET_TEMP_SEARCH_STRING", payload: event.target.value})
    }


    function _handleRegexChange(event) {
        props.searchDispatch({type: "SET_REGEX", payload: event.target.checked});
    }

    let match_text;
    if (props.searchStateRef.current.search_matches != null && props.searchStateRef.current.search_string != "") {
        switch (props.searchStateRef.current.search_matches) {
            case 0:
                match_text = "no matches";
                break;
            case 1:
                match_text = "1 match";
                break;
            default:
                match_text = `${props.searchStateRef.current.search_matches} matches`;
                break;
        }
    } else {
        match_text = null
    }
    return (
        <Fragment>
            <FormGroup helperText={match_text} style={{marginBottom: 15}}>
                <div className="d-flex flex-row" style={{marginTop: 5, marginBottom: 5}}>
                    <InputGroup type="search"
                                className="search-input"
                                placeholder="Search"
                                leftIcon="search"
                                value={props.searchStateRef.current.temp_search_string}
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
                                large={false}
                                checked={props.searchStateRef.current.use_regex}
                                onChange={_handleRegexChange}
                        />
                    }
                    {props.include_search_jumper &&
                        <ButtonGroup style={{marginLeft: 5, padding: 2}}>
                            <Button onClick={props.searchNext} icon="caret-down" text={undefined} size="small" />
                            <Button onClick={props.searchPrev} icon="caret-up" text={undefined} size="small" />
                        </ButtonGroup>

                    }
                </div>
            </FormGroup>
        </Fragment>
    )
}

TileMakerSearchForm = memo(TileMakerSearchForm);