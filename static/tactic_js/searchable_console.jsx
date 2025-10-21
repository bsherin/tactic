import React from "react";
import {useState, useEffect, useRef, memo, forwardRef} from "react";

import {Button, ControlGroup, HTMLSelect, InputGroup, Switch} from "@blueprintjs/core";
import {FilterSearchForm} from "./search_form";
import {postPromise} from "./communication_react";
import {guid, useStateAndRef, useDidMount} from "./utilities_react";
import {TacticSocket} from "./tactic_socket";

export {SearchableConsole, ResponsiveFlex}


function SearchableConsole(props, inner_ref) {

    const [search_string, set_search_string] = useState(null);
    const [search_helper_text, set_search_helper_text] = useState(null);
    const [filter, set_filter] = useState(false);
    const [console_command_value, set_console_command_value] = useState("");
    const [livescroll, set_livescroll] = useState(true);
    const [log_since, set_log_since] = useState(null);

    // I need to have these as refs because they are accessed within the _handleUpdateMessage
    // callback. So they would have the old value.
    const [max_console_lines, set_max_console_lines, max_console_lines_ref] = useStateAndRef(100);
    const [, set_log_content, log_content_ref] = useStateAndRef("");
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

    useEffect(() => {
        my_room.current = guid();
        tsocket.current = new TacticSocket("main", 5000, "searchable-console", props.local_id);
        tsocket.current.socket.emit("join", {"room": my_room.current});

        function cleanup() {
            _stopLogStreaming().then(() => {
                tsocket.current.disconnect()
            });
        }

        initSocket();
        _getLogAndStartStreaming()
            .then(() => {
                window.addEventListener('beforeunload', cleanup)
            });
        return (() => {
            cleanup();
            window.removeEventListener('beforeunload', cleanup);
        })
    }, []);

    useEffect(() => {
        if (!streamer_id.current) {
            _getLogAndStartStreaming()
                .then(() => {
                    console.log("streamer_id.current", streamer_id.current);
                });
        }

    }, [streamer_id.current]);

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
        if (data.message == "streamerExited") {
            streamer_id.current = null;
            return;
        }
        if (data.message != "updateLog") return;
        _addToLog(data["new_line"]);
    }

    function _setLogSince() {
        const now = new Date().getTime();
        set_log_since(now);
        set_log_content("")
    }

    function _setMaxConsoleLines(event) {
        set_max_console_lines(parseInt(event.target.value))
    }

    async function _getLogAndStartStreaming() {
        let res = await postPromise("log_streamer", "get_container_log",
            {cont_id: cont_id.current, since: log_since, max_lines: max_console_lines_ref.current},
            props.local_id);
        set_log_content(res["log_text"]);
        let data = await postPromise("log_streamer", "start_log_stream",
            {cont_id: cont_id.current, room: my_room.current, user_id: window.user_id},
            props.local_id);
        streamer_id.current = my_room.current
    }

    async function _stopLogStreaming(callback = null) {
        if (streamer_id && streamer_id.current) {
            await postPromise("log_streamer", "stop_log_stream", {streamer_id: streamer_id.current}, props.local_id);
            if (callback) {
                callback()
            }
        }
        return null
    }

    function _addToLog(new_line) {
        set_log_content(prev_log_content => prev_log_content + new_line)
    }

    function _prepareText() {
        let the_text = "";
        if (log_content_ref.current) { // without this can get an error if project saved with tile log showing
            let tlist = log_content_ref.current.split(/\r?\n/);
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

    async function _logExec(command) {
        return await postPromise(cont_id.current, "os_command_exec", {
            "the_code": command,
        }, props.local_id);
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
    const inner_style = {
        whiteSpace: "nowrap",
        fontSize: 12,
        fontFamily: "monospace",
        flex: "1 1 0",
        minHeight: 0,
        overflow: "auto"
    };
    const outer_style = {
        width: "100%", height: "100%", overflow: "hidden", display: "flex", flexDirection: "column",
        ...props.outer_style
    };
    const leftContent = (
        <ControlGroup vertical={false}>
            <Button onClick={_setLogSince}
                    style={{height: 30}}
                    variant="minimal" size="small" icon="trash"/>
            <HTMLSelect onChange={_setMaxConsoleLines}
                        large={false}
                        variant="minimal"
                        value={max_console_lines_ref.current}
                        options={[100, 250, 500, 1000, 2000]}
            />
            <Switch label="livescroll"
                    size="medium"
                    checked={livescroll}
                    onChange={_setLiveScroll}
                    style={{
                        marginBottom: 0,
                        marginLeft: 5,
                        alignSelf: "center"
                    }}
            />

        </ControlGroup>
    );
    const rightContent = (
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
    );
    return (

        <div className="searchable-console"
             style={outer_style}>
            <ResponsiveFlex
                leftContent={leftContent}
                rightContent={rightContent}
            />
            {/*</div>*/}
            <div ref={inner_ref} style={inner_style} dangerouslySetInnerHTML={the_text}/>
            {props.showCommandField && (
                <form onSubmit={_commandSubmit}>

                    <InputGroup type="text"
                                className="bp6-monospace-text"
                                onChange={_onInputChange}
                                size="small"
                                leftIcon="chevron-right"
                                fill={true}
                                onKeyDown={(e) => _handleKeyDown(e)}
                                value={console_command_value}
                    />
                </form>)
            }

        </div>
    )
}

SearchableConsole = memo(forwardRef(SearchableConsole));

function ResponsiveFlex(props) {
    props = {
        gapThreshold: 100,
        leftContent: null,
        rightContent: null,
        ...props
    };
    const containerRef = useRef(null);
    const leftContentRef = useRef(null);
    const rightContentRef = useRef(null);
    const [hideRight, setHideRight] = useState(false);

    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
            const {width} = entry.contentRect;
            const le_width = leftContentRef.current.getBoundingClientRect().width;
            const re_width = rightContentRef.current.getBoundingClientRect().width;

            if ((width - (re_width + le_width)) < props.gapThreshold) {
                setHideRight(true);
            } else {
                setHideRight(false);
            }
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "self-start",
                width: "100%",
                position: "relative"
            }}
        >
            <div ref={leftContentRef}>
                {props.leftContent}
            </div>

            {/* The right side collapses when hideRight is true */}
            <div style={{opacity: hideRight ? 0 : 1}} ref={rightContentRef}>
                {props.rightContent}
            </div>
        </div>
    );
}
