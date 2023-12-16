
import React from "react";
import {Fragment, useState, useEffect, useRef, memo} from "react";
import PropTypes from 'prop-types';
import { Card, Button, InputGroup, Spinner, ButtonGroup, FormGroup, Divider} from "@blueprintjs/core";

import {GlyphButton, SelectList} from "./blueprint_react_widgets.js";
import {postWithCallback} from "./communication_react.js"
import {useCallbackStack, useStateAndRef} from "./utilities_react";

export {ExportsViewer}

function TextIcon(props) {
    return (
            <Fragment>
                <span className="bp5-icon" style={{fontWeight: 500}}>
                    {props.the_text}
                </span>
            </Fragment>
        )
}

TextIcon = memo(TextIcon);

TextIcon.propTypes = {
    the_text: PropTypes.string
};

const export_icon_dict = {
    str: "font",
    list: "array",
    range: "array",
    dict: <TextIcon the_text="{#}"/>,
    set: <TextIcon the_text="{..}"/>,
    tuple: <TextIcon the_text="(..)"/>,
    bool: <TextIcon the_text="tf"/>,
    bytes: <TextIcon the_text="b"/>,
    NoneType: "small-cross",
    int: "numerical",
    float: "numerical",
    complex: "numerical",
    function: "function",
    TacticDocument: "th",
    DetachedTacticDocument: "th",
    TacticCollection: "database",
    DetachedTacticCollection: "database",
    DetachedTacticRow: "th-derived",
    TacticRow: "th-derived",
    ndarray: "array-numeric",
    DataFrame: <TextIcon the_text="df"/>,
    other: "cube",
    unknown: <TextIcon the_text="?"/>
};

function ExportButtonListButton(props) {
    function _onPressed() {
        props.buttonPress(props.fullname)
    }
    return (
        <Button className="export-button" icon={export_icon_dict[props.type]} minimal={false}
                onClick={_onPressed} key={props.fullname}
                active={props.active} small={true} value={props.fullname} text={props.shortname}/>
    )
}

ExportButtonListButton = memo(ExportButtonListButton);

ExportButtonListButton.propTypes = {
    fullname: PropTypes.string,
    shortname: PropTypes.string,
    type: PropTypes.string,
    buttonPress: PropTypes.func,
    active: PropTypes.bool
};

function ExportButtonList(props) {
    const select_ref = useRef(null);
    const export_index_ref = useRef({});

    function _buttonPress(fullname) {
        props.handleChange(fullname, export_index_ref.current[fullname].shortname, export_index_ref.current[fullname].tilename)
    }

    function _compareEntries(a, b) {
        if (a[1].toLowerCase() == b[1].toLowerCase()) return 0;
        if (b[1].toLowerCase() > a[1].toLowerCase()) return -1;
        return 1
    }

    function create_groups() {
        let groups = [];
        let group_names = Object.keys(props.pipe_dict);
        group_names.sort();
        let index = 0;
        for (let group of group_names) {
            let group_items = [];
            let entries = props.pipe_dict[group];
            entries.sort(_compareEntries);
            for (let entry of entries) {
                let fullname = entry[0];
                let shortname = entry[1];
                let type = entry.length == 3 ? entry[2] : "unknown";
                if (!(type in export_icon_dict)) {
                    type = "other"
                }
                export_index_ref.current[fullname] = {tilename: group, shortname: shortname};
                group_items.push(
                    <ExportButtonListButton fullname={fullname}
                                            key={fullname}
                                            shortname={shortname}
                                            type={type}
                                            active={props.value == fullname}
                                            buttonPress={_buttonPress}
                    />)
            }
            if (group == "__log__") {
                groups.unshift(
                    <FormGroup key={group} inline={false} label={null} className="export-label">
                        <ButtonGroup minimal={false} vertical={true} alignText="left" key={group} >
                            {group_items}
                        </ButtonGroup>
                    </FormGroup>
                )
            }
            else {
                groups.push(
                    <FormGroup key={group} inline={false} label={group} className="export-label">
                        <ButtonGroup minimal={false} vertical={true} alignText="left" key={group} >
                            {group_items}
                        </ButtonGroup>
                    </FormGroup>
                )
            }

        }
        return groups
    }
    return (
        <div id="exports-button-list" style={{flexDirection: "column", display: "inline-block", verticalAlign: "top", padding: 15, height:props.body_height}}
            className="contingent-scroll">
            {create_groups()}
        </div>
    )
}

ExportButtonList = memo(ExportButtonList);

ExportButtonList.propTypes = {
    pipe_dict: PropTypes.object,
    body_height:PropTypes.number,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number]),
    handleChange: PropTypes.func
};

function ExportsViewer(props) {
    const header_ref = useRef(null);
    const footer_ref = useRef(null);

    const [selected_export, set_selected_export, selected_export_ref] = useStateAndRef("");
    const [selected_export_tilename, set_selected_export_tilename] = useState(null);
    const [key_list, set_key_list] = useState(null);
    const [key_list_value, set_key_list_value] = useState(null);
    const [tail_value, set_tail_value] = useState("");
    const [max_rows, set_max_rows, max_rows_ref] = useStateAndRef(25);
    const [exports_info_value, set_exports_info_value] = useState(null);
    const [selected_export_short_name, set_selected_export_short_name] = useState(null);
    const [show_spinner, set_show_spinner] = useState(false);
    const [running, set_running] = useState(false);
    const [exports_body_value, set_exports_body_value] = useState("");
    const [type, set_type] = useState(null);
    const [pipe_dict, set_pipe_dict] = useState({});

    const pushCallback = useCallbackStack();

    useEffect(() => {
        initSocket();
        props.setUpdate(_updateExportsList);
        _updateExportsList();
    }, []);

    function initSocket() {
        props.tsocket.attachListener("export-viewer-message", _handleExportViewerMessage);
    }

    function _handleExportViewerMessage(data) {
        if (data.main_id == props.main_id) {
            let self = this;
            let handlerDict = {
                update_exports_popup: () => _updateExportsList(),
                display_result: _displayResult,
                showMySpinner: _showMySpinner,
                stopMySpinner: _stopMySpinner,
                startMySpinner: _startMySpinner,
                got_export_info: _gotExportInfo
            };
            handlerDict[data.export_viewer_message](data)
        }
    }

    function _handleMaxRowsChange(new_value) {
        set_max_rows(parseInt(new_value));
        pushCallback(_eval)
    }

    function _updateExportsList() {
        postWithCallback(props.main_id, "get_full_pipe_dict", {}, function (data) {
            set_pipe_dict(data.pipe_dict);
        }, null, props.main_id)
    }

    function _refresh() {
        _handleExportListChange(selected_export_ref.current, selected_export_short_name, true)
    }

    function _displayResult(data) {
        set_exports_body_value(data.the_html);
        set_show_spinner(false);
        set_running(false)
    }

    function _eval(e = null) {
        _showMySpinner();
        let send_data = {
            "export_name": selected_export_ref.current,
            "tail": tail_value,
            "max_rows": max_rows_ref.current
        };
        if (key_list) {
            send_data.key = key_list_value
        }
        postWithCallback(props.main_id, "evaluate_export", send_data, null,null, props.main_id);
        if (e) e.preventDefault();
    }

    function _stopMe() {
        _stopMySpinner();
        postWithCallback(props.main_id, "stop_evaluate_export", {}, null, null, props.main_id);
    }

    function _showMySpinner() {
        set_show_spinner(true);
    }

    function _startMySpinner() {
        set_show_spinner(true);
        set_running(true);
    }

    function _stopMySpinner() {
        set_show_spinner(false);
        set_running(false);
    }

    function _gotExportInfo(data) {
        var new_key_list = null;
        var new_key_list_value = null;
        if (data.hasOwnProperty("key_list")) {
            new_key_list = data.key_list;
            if (data.hasOwnProperty("key_list_value")) {
                new_key_list_value = data.key_list_value
            }
            else {
                if (new_key_list.length > 0) {
                    new_key_list_value = data.key_list[0]
                }
            }
        }
        set_type(data.type);
        set_exports_info_value(data.info_string);
        set_tail_value("");
        set_show_spinner(false);
        set_running(false);
        set_key_list(new_key_list);
        set_key_list_value(new_key_list_value);
        pushCallback(_eval);
    }

    function _handleExportListChange(fullname, shortname, tilename, force_refresh = false) {
        if (!force_refresh && fullname == selected_export_ref.current) return;
        set_show_spinner(true);
        set_selected_export(fullname);
        set_selected_export_tilename(tilename);
        set_selected_export_short_name(shortname);
        postWithCallback(props.main_id, "get_export_info", {"export_name": fullname}, null, null, props.main_id);
    }

    function _handleKeyListChange(new_value) {
        set_key_list_value(new_value);
        pushCallback(_eval);
    }

    function _handleTailChange(event) {
        set_tail_value(event.target.value);
    }

    function _bodyHeight() {
        if (header_ref && header_ref.current && footer_ref && footer_ref.current) {
            return props.available_height - $(header_ref.current).outerHeight() - $(footer_ref.current).outerHeight()
        }
        else {
            return props.available_height - 75
        }
    }

    function _sendToConsole() {
        const tail = tail_value;
        let tilename = selected_export_tilename;
        let shortname = selected_export_short_name;

        let key_string = "";
        if (!(key_list == null)) {
            key_string = `["${key_list_value}"]`;
        }

        let the_text;
        if (tilename == "__log__") {
            the_text = shortname + key_string + tail
        }
        else {
            the_text = `Tiles["${tilename}"]["${shortname}"]`+ key_string + tail;
        }

        let self = this;
        postWithCallback("host", "print_code_area_to_console",
            {"console_text": the_text, "user_id": window.user_id, "main_id": props.main_id}, function (data) {
            if (!data.success) {
                errorDrawerFuncs.addErrorDrawerEntry({
                    title: "Error creating code area",
                    content: "message" in data ? data.message : ""
                });
            }
        }, null, props.main_id);
    }

    let exports_body_dict = {__html: exports_body_value};
    let butclass = "notclose bottom-heading-element bottom-heading-element-button";
    let exports_class = props.console_is_shrunk ? "am-shrunk" : "not-shrunk";
    let spinner_val = running ? null : 0;
    if (props.console_is_zoomed) {
        exports_class = "am-zoomed"
    }
    return (
         <Card id="exports-panel" elevation={2} className={"mr-3 " + exports_class} style={props.style}>
             <div className="d-flex flex-column justify-content-around">
                 <div id="exports-heading"
                      ref={header_ref}
                     className="d-flex flex-row justify-content-start">
                     {!show_spinner &&
                        <GlyphButton handleClick={_eval}
                                      intent="primary"
                                      tooltip="Send code to the console"
                                      style={{marginLeft: 6, marginTop: 2}}
                                      icon="play"/>
                     }
                     {show_spinner &&
                        <GlyphButton handleClick={_stopMe}
                                          intent="danger"
                                          tooltip="Send code to the console"
                                          style={{marginLeft: 6, marginTop: 2}}
                                          icon="stop"/>

                     }

                     <GlyphButton handleClick={_sendToConsole}
                                  intent="primary"
                                  tooltip="Send code to the console"
                                  style={{marginLeft: 6, marginTop: 2}}
                                  icon="circle-arrow-left"/>
                     {(Object.keys(pipe_dict).length > 0) && (
                         <form onSubmit={_eval} className="d-flex flex-row">
                               <span id="selected-export"
                                     className="bottom-heading-element mr-2">{selected_export_short_name}</span>
                               {key_list && <SelectList option_list={key_list}
                                                         onChange={_handleKeyListChange}
                                                         the_value={key_list_value}
                                                         minimal={true}
                                                         fontSize={11}/>
                                }
                             <InputGroup type="text"
                                         small={true}
                                         onChange={_handleTailChange}
                                         onSubmit={_eval}
                                         value={tail_value}
                                         className="export-tail"/>
                         </form>
                         )
                     }

                     {show_spinner &&
                         <div style={{marginTop: 7, marginRight: 10, marginLeft: 10}}>
                            <Spinner size={13} value={spinner_val}/>
                         </div>
                     }


                 </div>
                 {!props.console_is_shrunk &&
                     <Fragment>
                         <div className="d-flex flex_row">
                             <ExportButtonList pipe_dict={pipe_dict}
                                               body_height={_bodyHeight()}
                                               value={selected_export_ref.current}
                                               handleChange={_handleExportListChange}
                             />
                             <Divider/>
                             <div id="exports-body" style={{padding: 15, width: "80%", height: _bodyHeight(), display: "inline-block"}}
                                  className="contingent-scroll" dangerouslySetInnerHTML={exports_body_dict}/>
                         </div>
                         <div id="exports-footing"
                              ref={footer_ref}
                              className="d-flex flex-row justify-content-between">
                             <span id="exports-info" className="bottom-heading-element ml-2">{exports_info_value}</span>
                             <FormGroup label="max rows" inline={true}>
                                 <SelectList option_list={[25, 100, 250, 500]}
                                             onChange={_handleMaxRowsChange}
                                             the_value={max_rows_ref.current}
                                             minimal={true}
                                             fontSize={11}/>
                             </FormGroup>
                         </div>
                     </Fragment>
             }
             </div>
         </Card>
    )
}

ExportsViewer = memo(ExportsViewer);

ExportsViewer.propTypes = {
    available_height: PropTypes.number,
    console_is_shrunk: PropTypes.bool,
    console_is_zoomed: PropTypes.bool,
    setUpdate: PropTypes.func,
    style: PropTypes.object
};

ExportsViewer.defaultProps = {
    style: {}
};

