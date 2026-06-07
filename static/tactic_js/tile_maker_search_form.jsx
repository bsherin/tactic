import React, {Fragment, memo} from "react";
import {useDebounce} from "./utilities_react";
import {
    Button,
    ButtonGroup,
    FormGroup,
    InputGroup,
    Switch,
    Popover,
    Menu,
    MenuItem,
    MenuDivider,
    EntityTitle,
    Text
} from "@blueprintjs/core";

export {TileMakerSearchForm};

const dividerIconDict = {
    "code": "code",
    "signature": "code",
    "render_content": "control",
    "globals": "globe",
    "options": "select",
    "widgets": "widget",
    "exports": "export",
}

function getMatchingIcon(result) {
    if (result.kind == "code") {
        if (result.paneName in dividerIconDict) {
            return dividerIconDict[result.paneName];
        }
        else {
            return dividerIconDict["code"];
        }
    }
    return dividerIconDict[result.kind];
}

function SearchResultsMenu(props) {
    const results = props.searchStateRef.current.search_results ?? [];

    if (results.length === 0) {
        return (
            <Menu>
                <MenuItem disabled={true} text="No matches" />
            </Menu>
        );
    }
    let menuDividerTitle = null;
    let showTitle = false;
    let iconName = null;

    return (
        <Menu className="maker-search-menu" style={{maxHeight: 360, overflowY: "auto", minWidth: 520}}>
            {results.map((result) => {
                const isCurrent =
                    result.kind == "code" &&
                    result.identifier === props.searchStateRef.current.current_search_cm &&
                    result.matchNumber === props.searchStateRef.current.current_search_number;
                if (result.paneName != menuDividerTitle) {
                    showTitle = true;
                    menuDividerTitle = result.paneName;
                    iconName = getMatchingIcon(result);
                }
                else {
                    showTitle = false;
                }
                return (
                    <Fragment>
                        {showTitle && <MenuDivider
                            title={
                            <EntityTitle title={result.paneName} icon={iconName}/>
                        } />}
                        <MenuItem
                            key={`${result.identifier}-${result.matchNumber}`}
                            icon={isCurrent ? "small-tick" : "blank"}
                            text={
                                <div style={{display: "flex", flexDirection: "row", alignItems: "baseline"}}>
                                    <span
                                        style={{
                                            opacity: .5,
                                            flex: "0 0 25px",      // fixed label column
                                            textAlign: "left",
                                            paddingRight: 8,
                                            whiteSpace: "nowrap",
                                        }}
                                        className="sub-label"
                                    >
                                        {result.subLabel}
                                    </span>

                                    <Text
                                        ellipsize={true}
                                        className="code-font"
                                        style={{
                                            flex: "1 1 auto",
                                            minWidth: 0,           // important for ellipsize inside flex
                                            maxWidth: 460,
                                            opacity: .85,
                                        }}
                                    >
                                        {result.preview}
                                    </Text>
                                </div>
                            }
                            onClick={() => {
                                props.onSelectResult(result);
                            }}
                        />
                    </Fragment>
                );
            })}
        </Menu>
    );
}

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
        showSearchResult: null,
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

    function _handleSelectResult(result) {
        props.searchDispatch({
            type: "GOTO_SEARCH_MATCH",
            payload: {
                identifier: result.identifier,
                matchNumber: result.matchNumber ?? 0
            }
        });

        if (props.showSearchResult) {
            props.showSearchResult(result.identifier);
        }
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
            <FormGroup helperText={match_text}
                       style={{marginBottom: 0, paddingLeft: 5}}>
                <div className="d-flex flex-row" style={{marginTop: 5, marginBottom: 5}}>
                    <InputGroup type="search"
                                className="search-input"
                                placeholder="Search code..."
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
                                size="medium"
                                checked={props.searchStateRef.current.use_regex}
                                onChange={_handleRegexChange}
                        />
                    }
                    {props.include_search_jumper &&
                        <ButtonGroup style={{marginLeft: 5, padding: 2}}>
                            <Button onClick={props.searchNext} icon="caret-down" text={undefined} size="small" />
                            <Button onClick={props.searchPrev} icon="caret-up" text={undefined} size="small" />

                            <Popover
                                placement="bottom-start"
                                content={
                                    <SearchResultsMenu
                                        searchStateRef={props.searchStateRef}
                                        onSelectResult={_handleSelectResult}
                                    />
                                }
                            >
                                <Button
                                    icon="list"
                                    size="small"
                                    disabled={!props.searchStateRef.current.search_matches}
                                />
                            </Popover>
                        </ButtonGroup>
                    }
                </div>
            </FormGroup>
        </Fragment>
    )
}

TileMakerSearchForm = memo(TileMakerSearchForm);