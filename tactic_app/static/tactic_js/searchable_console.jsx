import React from "react";
import {useState, useEffect, useRef, memo, forwardRef} from "react";

import {Button, ControlGroup, HTMLSelect, InputGroup, Switch} from "@blueprintjs/core";
import {FilterSearchForm} from "./search_form";

export {SearchableConsole}

function SearchableConsole(props, inner_ref) {

    const [search_string, set_search_string] = useState(null);
    const [search_helper_text, set_search_helper_text] = useState(null);
    const [filter, set_filter] = useState(false);
    const [console_command_value, set_console_command_value] = useState("");
    const [livescroll, set_livescroll] = useState(true);

    const past_commands = useRef([]);
    const past_commands_index = useRef(null);

    useEffect(() => {
        if (livescroll && inner_ref && inner_ref.current) {
            inner_ref.current.scrollTo(0, inner_ref.current.scrollHeight)
        }
    });

    function _prepareText() {
        let tlist = props.log_content.split(/\r?\n/);

        let the_text = "";
        if (search_string) {
            if (filter) {
                let new_tlist = [];
                for (let t of tlist) {
                    if (t.includes(search_string)) {
                        new_tlist.push(t)
                    }
                }
                tlist = new_tlist;

            }
            for (let t of tlist) {
                the_text = the_text + t + "<br>";
            }
            const regex = new RegExp(search_string, "gi");
            the_text = String(the_text).replace(regex, function (matched) {
                    return "<mark>" + matched + "</mark>";
                }
            )
        } else {
            for (let t of tlist) {
                the_text = the_text + t + "<br>";
            }
        }
        return `<div style="white-space:pre">${the_text}</div>`
    }

    function _handleSearchFieldChange(event) {
        set_search_helper_text(null);
        set_search_string(event.target.value)
    }

    function _handleFilter() {
        set_filter(true)
    }

    function _handleUnFilter() {
        set_search_helper_text(null);
        set_search_string(null);
        set_filter(false)
    }

    function _searchNext() {

    }

    function _structureText() {

    }

    function _searchPrevious() {

    }

    function _setMaxConsoleLines(event) {
        props.setMaxConsoleLines(parseInt(event.target.value))
    }

    function _commandSubmit(e) {
        e.preventDefault();
        past_commands.current.push(console_command_value);
        past_commands_index.current = null;
        props.commandExec(console_command_value, () => {
            set_console_command_value("")
        })
    }

    function _setLiveScroll(event) {
        set_livescroll(event.target.checked)
    }

    function _onInputChange(event) {
        set_console_command_value(event.target.value)
    }

    function _handleKeyDown(event) {
        let charCode = event.keyCode;
        let new_val;
        if (charCode == 38) {  // down arraw
            if (past_commands.current.length == 0) {
                return
            }
            if (past_commands_index.current == null) {
                past_commands_index.current = past_commands.current.length - 1
            }
            new_val = past_commands.current[past_commands_index.current];
            if (past_commands_index.current > 0) {
                past_commands_index.current -= 1
            }

        } else if (charCode == 40) {  // up arro
            if (past_commands.current.length == 0 || past_commands_index.current == null ||
                past_commands_index.current == past_commands.current.length - 1) {
                return
            }
            past_commands_index.current += 1;
            new_val = past_commands.current[past_commands_index.current];
        } else {
            return
        }
        set_console_command_value(new_val)
    }

    let the_text = {__html: _prepareText()};
    let the_style = {whiteSpace: "nowrap", fontSize: 12, fontFamily: "monospace", ...props.outer_style};
    if (props.commandExec) {
        the_style.height = the_style.height - 40
    }
    let bottom_info = "575 lines";
    let self = this;
    return (
        <div className="searchable-console">
            <div className="d-flex flex-row" style={{justifyContent: "space-between"}}>
                <ControlGroup vertical={false}
                              style={{marginLeft: 15, marginTop: 10}}>
                    <Button onClick={props.clearConsole}
                            style={{height: 30}}
                            minimal={true} small={true} icon="trash"/>
                    <HTMLSelect onChange={_setMaxConsoleLines}
                                large={false}
                                minimal={true}
                                value={props.max_console_lines}
                                options={[100, 250, 500, 1000, 2000]}
                    />
                    <Switch label="livescroll"
                            large={false}
                            checked={livescroll}
                            onChange={_setLiveScroll}
                            style={{marginBottom: 0, marginTop: 5, alignSelf: "center", height: 30}}
                    />

                </ControlGroup>
                <FilterSearchForm
                    search_string={search_string}
                    handleSearchFieldChange={_handleSearchFieldChange}
                    handleFilter={_handleFilter}
                    handleUnFilter={_handleUnFilter}
                    searchNext={null}
                    searchPrevious={null}
                    search_helper_text={search_helper_text}
                    margin_right={25}
                />
            </div>
            <div ref={inner_ref} style={the_style} dangerouslySetInnerHTML={the_text}/>
            {props.commandExec && (
                <form onSubmit={_commandSubmit} style={{position: "relative", bottom: 8, margin: 10}}>

                    <InputGroup type="text"
                                className="bp5-monospace-text"
                                onChange={_onInputChange}
                                small={true}
                                large={false}
                                leftIcon="chevron-right"
                                fill={true}
                                onKeyDown={(e) => _handleKeyDown(e)}
                                value={console_command_value}
                    />
                </form>
            )
            }

        </div>
    )
}

SearchableConsole = memo(forwardRef(SearchableConsole));

