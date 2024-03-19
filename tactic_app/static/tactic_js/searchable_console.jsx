import React from "react";
import {useState, useEffect, useRef, memo, forwardRef} from "react";

import {Button, ControlGroup, HTMLSelect, InputGroup, Switch} from "@blueprintjs/core";
import {FilterSearchForm} from "./search_form";
import {postPromise} from "./communication_react";
import {guid, useStateAndRef, useDidMount} from "./utilities_react";
import {TacticSocket} from "./tactic_socket";

export {SearchableConsole}

function SearchableConsole(props, inner_ref) {

    const [search_string, set_search_string] = useState(null);
    const [search_helper_text, set_search_helper_text] = useState(null);
    const [filter, set_filter] = useState(false);
    const [console_command_value, set_console_command_value] = useState("");
    const [livescroll, set_livescroll] = useState(true);
    const [log_since, set_log_since] = useState(null);

    // I need to have these as refs because the are accessed within the _handleUpdateMessage
    // callback. So they would have the old value.
    const [max_console_lines, set_max_console_lines, max_console_lines_ref] = useStateAndRef(100);
    const [log_content, set_log_content, log_content_ref] = useStateAndRef("");
    const cont_id = useRef(props.container_id);
    const my_room = useRef(null);
    const streamer_id = useRef(null);

    const tsocket = useRef(null);

    const past_commands = useRef([]);
    const past_commands_index = useRef(null);

    useEffect(() => {
        if (livescroll && inner_ref && inner_ref.current) {
            inner_ref.current.scrollTo(0, inner_ref.current.scrollHeight)
        }
    });

    useEffect(async () => {
        my_room.current = guid();
        tsocket.current = new TacticSocket("main", 5000, "searchable-console", props.main_id);
        tsocket.current.socket.emit("join", {"room": my_room.current});
        async function cleanup() {
            await _stopLogStreaming();
            tsocket.current.disconnect();
        }
        initSocket();
        await _getLogAndStartStreaming();
        window.addEventListener('beforeunload', cleanup);
        return (() => {
            cleanup();
            window.removeEventListener('beforeunload', cleanup);
        })
    }, []);

    useDidMount(async () => {
        await _stopLogStreaming(_getLogAndStartStreaming)
    }, [max_console_lines]);

    useDidMount(async () => {
        await _stopLogStreaming();
        cont_id.current = props.container_id;
        set_log_since(null);
        set_max_console_lines(100);
        await _getLogAndStartStreaming()
    }, [props.container_id]);

    function initSocket() {
        tsocket.current.attachListener("searchable-console-message", _handleUpdateMessage);
    }

    function _handleUpdateMessage(data) {
        if (data.message != "updateLog") return;
        _addToLog(data.new_line);
    }

    function _setLogSince() {
        var now = new Date().getTime();
        set_log_since(now);
        set_log_content("")
    }

    function _setMaxConsoleLines(event) {
        set_max_console_lines(parseInt(event.target.value))
    }

    async function _getLogAndStartStreaming() {
        function gotStreamerId(data) {
            streamer_id.current = data.streamer_id
        }
        let res = await postPromise("host", "get_container_log",
            {container_id: cont_id.current, since: log_since, max_lines: max_console_lines_ref.current},
            props.main_id);
        set_log_content(res.log_text);
        let data = await postPromise(props.streaming_host, "StartLogStreaming",
            {container_id: cont_id.current, room: my_room.current, user_id: window.user_id},
            props.main_id);
        gotStreamerId(data);
    }

    async function _stopLogStreaming(callback = null) {
        if (streamer_id && streamer_id.current) {
            return postPromise(props.streaming_host, "StopLogStreaming", {streamer_id: streamer_id.current},
                props.main_id);
        }
        return null
    }

    function _addToLog(new_line) {
        set_log_content(log_content_ref.current + new_line)
    }

    function _prepareText() {
        let the_text = "";
        if (log_content_ref.current) { // without this can get an error if project saved with tile log showing
            var tlist = log_content_ref.current.split(/\r?\n/);
            tlist = tlist.slice(-1 * max_console_lines_ref.current);
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

    async function _logExec(command, callback = null) {
        return await postPromise(cont_id.current, "os_command_exec", {
            "the_code": command,
        }, props.main_id);
    }

    async function _commandSubmit(e) {
        e.preventDefault();
        past_commands.current.push(console_command_value);
        past_commands_index.current = null;
        await _logExec(console_command_value);
        set_console_command_value("")
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
    if (props.showCommandField) {
        the_style.height = the_style.height - 40
    }
    let bottom_info = "575 lines";
    return (
        <div className="searchable-console" style={{width: "100%"}}>
            <div className="d-flex flex-row" style={{justifyContent: "space-between"}}>
                <ControlGroup vertical={false}
                              style={{marginLeft: 15, marginTop: 10}}>
                    <Button onClick={_setLogSince}
                            style={{height: 30}}
                            minimal={true} small={true} icon="trash"/>
                    <HTMLSelect onChange={_setMaxConsoleLines}
                                large={false}
                                minimal={true}
                                value={max_console_lines_ref.current}
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
            {props.showCommandField && (
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
                </form> )
            }

        </div>
    )
}

SearchableConsole = memo(forwardRef(SearchableConsole));

