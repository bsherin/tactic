// noinspection XmlDeprecatedElement

import React from "react";
import {useState, useEffect, useRef, memo, useContext} from "react";

import {Icon, Card, Button, ButtonGroup, Spinner, PopoverPosition} from "@blueprintjs/core";
import _ from 'lodash';

import {TileForm} from "./tile_form_react";
import {GlyphButton} from "./blueprint_react_widgets";
import {DragHandle} from "./drag_handle"


import {postWithCallback, postPromise} from "./communication_react"
import {useCallbackStack} from "./utilities_react";
import {ErrorBoundary} from "./error_boundary";
import {MenuComponent} from "./menu_utilities"
import {SearchableConsole} from "./searchable_console";


import {DialogContext} from "./modal_react";
import {ErrorDrawerContext} from "./error_drawer";
import {widgetDict} from "./widgets";

export {TileComponent}


const using_touch = "ontouchend" in document;

const click_event = using_touch ? "touchstart" : "click";

const TILE_DISPLAY_AREA_MARGIN = 15;
const MIN_TILE_WIDTH = 150;
const MIN_TILE_HEIGHT = 100;

function SortHandle(props) {
    return (
        <span className="tile-name-div" {...props.dragHandleProps} ><Icon icon="drag-handle-vertical"
                                                                          size={15}/>{props.tile_name}</span>
    )
}

SortHandle = memo(SortHandle);

const menu_icons = {
    "Kill and reload": "refresh",
    "Kill, reload, and resubmit": "social-media",
    "Run me": "play",
    "Stop me": "stop",
    "Toggle console": "console",
    "Log me": "clipboard",
    "Log parameters": "th",
    "Edit my source": "edit",
    "Delete me": "trash"
};

const menu_button = (<Button variant="minimal"
                           size="small"
                           icon="more"/>);

const alt_button = () => (menu_button);

function TileComponent(props) {
    props = {
        log_since: null,
        max_console_lines: 100,
        ...props
    };

    const my_ref = useRef(null);
    const body_ref = useRef(null);
    const inner_log_ref = useRef(null);
    const tda_ref = useRef(null);
    const log_ref = useRef(null);

    const last_front_content = useRef("");

    const [header_height, set_header_height] = useState(34);
    const [resizing, set_resizing] = useState(false);
    const [dwidth, set_dwidth] = useState(0);
    const [dheight, set_dheight] = useState(0);

    const pushCallback = useCallbackStack();
    const dialogFuncs = useContext(DialogContext);
    const errorDrawerFuncs = useContext(ErrorDrawerContext);

    useEffect(() => {
        _broadcastTileSize(props.tile_width, props.tile_height);
        executeEmbeddedScripts();
        listen_for_clicks();
    }, []);

    useEffect(() => {
        if (!resizing) {
            executeEmbeddedScripts();
        }
        listen_for_clicks();
        if (props.show_log) {
            if (log_ref && log_ref.current) {
                log_ref.current.scrollTo(0, log_ref.current.scrollHeight)
            }
        }
    });

    useEffect(() => {
        _broadcastTileSize(props.tile_width, props.tile_height)
    }, [props.tile_width, props.tile_height]);


    // Broadcasting the tile size is necessary because some tiles (notably matplotlib tiles)
    // need to know the size of the display area.
    function _broadcastTileSize() {
        postWithCallback(props.tile_id, "TileSizeChange",
            {width: tdaWidth(), height: tdaHeight()}, null, null, props.main_id)
    }

    function _resizeTileArea(dx, dy) {
        let hheight = $(body_ref.current).position().top;
        set_header_height(hheight);
        const new_height = Math.max(MIN_TILE_HEIGHT, props.tile_height + dy);
        const new_width = Math.max(MIN_TILE_WIDTH, props.tile_width + dx);
        let new_state = {
            tile_height: new_height,
            tile_width: new_width
        };

        props.setTileState(props.tile_id, new_state)
    }

    function executeEmbeddedScripts() {
        if (props.front_content != last_front_content.current) { // to avoid doubles of bokeh images
            last_front_content.current = props.front_content;
            let scripts = $("#" + props.tile_id + " .tile-display-area script").toArray();
            for (let script of scripts) {
                try {
                    window.eval(script.text)
                } catch (e) {

                }
            }
        }
    }

    // function makeTablesSortable() {
    //     let tables = $("#" + props.tile_id + " table.sortable").toArray();
    //     for (let table of tables) {
    //         sorttable.makeSortable(table)
    //     }
    // }

    function tdaWidth() {
        return props.tile_width + dwidth - TILE_DISPLAY_AREA_MARGIN * 2
    }

    function tdaHeight() {
        return props.tile_height + dheight - header_height - TILE_DISPLAY_AREA_MARGIN * 2
    }

    // function _executeJavascript() {
    //     try {
    //         if (!javascript_error_ref.current) {
    //             let selector = "[id='" + props.tile_id + "'] .jscript-target";
    //             eval(props.javascript_code)(selector, tdaWidth(), tdaHeight(), props.javascript_arg_dict, resizing)
    //         }
    //     } catch (err) {
    //         javascript_error_ref.current = true;
    //         errorDrawerFuncs.addErrorDrawerEntry({
    //             title: "Error evaluating javascript",
    //             content: err.message
    //         });
    //     }
    // }

    function _toggleTileLog() {
        props.setTileState(props.tile_id, {show_log: !props.show_log, show_form: false});
    }

    function _toggleShrunk() {
        props.setTileValue(props.tile_id, "shrunk", !props.shrunk);
    }

    async function _closeTile() {
        try {
            await dialogFuncs.showModalPromise("ConfirmDialog", {
                title: "Delete Tile",
                text_body: `Delete tile ${props.tile_name}`,
                cancel_text: "do nothing",
                submit_text: "delete",
                handleClose: dialogFuncs.hideModal,
            });
            props.handleClose(props.tile_id);
        }
        catch (e) {
        if (e != "canceled") {
            errorDrawerFuncs.addFromError(`Error closing tile`, e)
        }
    }
    }

    function _standard_click_data() {
        return {
            tile_id: props.tile_id,
            main_id: props.main_id,
            doc_name: props.current_doc_name,
            active_row_id: props.selected_row
        }
    }

    async function _updateOptionValue(option_name, value, callback = null) {
        const data_dict = {tile_id: props.tile_id, option_name: option_name, value: value};
        try {
            let data = await postPromise(props.tile_id, "_update_single_option", data_dict);
            if (data && ("form_data" in data)) {
                props.setTileValue(props.tile_id, "form_data", data.form_data, callback)
            }
        }
        catch (e) {
            errorDrawerFuncs.addFromError("Error updating option value", e);
        }
    }

    function _toggleBack() {
        props.setTileState(props.tile_id, {show_log: false, show_form: !props.show_form});
    }

    function _showTileBack() {
        props.setTileState(props.tile_id, {show_log: false, show_form: true});
    }

    function _handleSubmitOptions() {
        props.setTileState(props.tile_id, {
            show_form: false,
            show_spinner: true

        });
        let data = {};
        for (let opt of props.form_data) {
            data[opt.name] = opt["starting_value"]
        }
        data.tile_id = props.tile_id;
        props.broadcast_event("UpdateOptions", data)
    }

    function _startSpinner() {
        props.setTileValue(props.tile_id, "show_spinner", true)
    }

    function _stopSpinner() {
        props.setTileValue(props.tile_id, "show_spinner", false)
    }

    function _displayFormContent(data) {
        props.setTileValue(props.tile_id, "form_data", data.form_data)
    }

    async function spin_and_refresh() {
        _startSpinner();
        await postPromise(props.tile_id, "RefreshTile", {}, props.main_id);
        _stopSpinner();
    }

    async function _reloadTile(resubmit = false) {
        const data_dict = {"tile_id": props.tile_id, "tile_name": props.tile_name};
        try {
            _startSpinner();
            let data = await postPromise(props.main_id, "reload_tile", data_dict, props.main_id);
            _displayFormContent(data);
            props.setTileValue(props.tile_id, "source_changed", false);
            if (data["options_changed"] || !resubmit) {
                _stopSpinner();
                _showTileBack()
            } else {
                await spin_and_refresh()
            }
        }
        catch (e) {
            _stopSpinner();
            errorDrawerFuncs.addFromError("Error reloading tile", e)
        }
    }

    function listen_for_clicks() {
        let selector = `#${props.tile_id} .raw-html-widget`;
        $(selector).off();
        $(selector).on(click_event, '.element-clickable', function (e) {
            let data_dict = _standard_click_data();
            const dset = e.target.dataset;
            data_dict.dataset = {};
            for (let key in dset) {
                if (!dset.hasOwnProperty(key)) continue;
                data_dict.dataset[key] = dset[key]
            }
            postWithCallback(props.tile_id, "TileElementClick", data_dict, null, null, props.main_id);
            e.stopPropagation()
        });
        $(selector).on(click_event, '.word-clickable', function () {
            let data_dict = _standard_click_data();
            const s = window.getSelection();
            const range = s.getRangeAt(0);
            const node = s.anchorNode;
            while ((range.toString().indexOf(' ') !== 0) && (range.startOffset !== 0)) {
                range.setStart(node, (range.startOffset - 1));
            }
            const nlen = node.textContent.length;
            if (range.startOffset !== 0) {
                range.setStart(node, range.startOffset + 1);
            }
            do {
                range.setEnd(node, range.endOffset + 1);
            } while (range.toString().indexOf(' ') == -1 && range.toString().trim() !== '' && range.endOffset < nlen);
            data_dict.clicked_text = range.toString().trim();
            postWithCallback(props.tile_id, "TileWordClick", data_dict, null, null, props.main_id)
        });
        $(selector).on(click_event, '.cell-clickable', function () {
            let data_dict = _standard_click_data();
            data_dict.clicked_cell = $(this).text();
            postWithCallback(props.tile_id, "TileCellClick", data_dict, null, null, props.main_id)
        });
        $(selector).on(click_event, '.row-clickable', function () {
            let data_dict = _standard_click_data();
            const cells = $(this).children();
            const row_vals = [];
            cells.each(function () {
                row_vals.push($(this).text())
            });
            data_dict["clicked_row"] = row_vals;
            postWithCallback(props.tile_id, "TileRowClick", data_dict, null, null, props.main_id)
        });
        $(selector).on(click_event, 'button', function (e) {
            let data_dict = _standard_click_data();
            data_dict["button_value"] = e.target.value;
            postWithCallback(props.tile_id, "TileButtonClick", data_dict, null, null, props.main_id)
        });
        $(selector).on('submit', 'form', function (e) {
            let data_dict = _standard_click_data();
            const form_data = {};
            let the_form = e.target;
            for (let i = 0; i < the_form.length; i += 1) {
                form_data[the_form[i]["name"]] = the_form[i]["value"]
            }
            data_dict["form_data"] = form_data;
            postWithCallback(props.tile_id, "TileFormSubmit", data_dict, null, null, props.main_id);
            return false
        });
        $(selector).on("change", 'select', function (e) {
            let data_dict = _standard_click_data();
            data_dict.select_value = e.target.value;
            data_dict.select_name = e.target.name;
            postWithCallback(props.tile_id, "SelectChange", data_dict, null, null, props.main_id)
        });
        $(selector).on('change', 'textarea', function (e) {
            let data_dict = _standard_click_data();
            data_dict["text_value"] = e.target.value;
            postWithCallback(props.tile_id, "TileTextAreaChange", data_dict, null, null, props.main_id)
        });
    }

    function logText() {
        postWithCallback(props.tile_id, "LogTile", {}, null, null, props.main_id);
    }

    function _stopMe() {
        postWithCallback("kill_" + props.tile_id, "StopMe", {}, null)
    }

    async function _editMe() {
        if (!window.in_context) {
            window.blur();
            try {
                let data = await postPromise("host", "go_to_module_viewer_if_exists", {
                    user_id: window.user_id,
                    tile_type: props.tile_type,
                    line_number: 0
                }, props.main_id);
                window.open("", data["window_name"]);
            }
            catch (e) {
                window.open($SCRIPT_ROOT + "/view_location_in_creator/" + props.tile_type + "/" + "0");
            }
        } else {
            props.goToModule(props.tile_type, 0)
        }
    }

    function _logMe() {
        logText(props.front_content)
    }

    function _logParams() {
        const data_dict = {};
        data_dict["main_id"] = props.main_id;
        data_dict["tile_id"] = props.tile_id;
        data_dict["tile_name"] = props.tile_name;
        postWithCallback(props.tile_id, "LogParams", data_dict, null, null, props.main_id)
    }

    function _startResize() {
        set_resizing(true);
        set_dwidth(0);
        set_dheight(0);
    }

    function _onResize(e, ui, x, y, dx, dy) {
        set_dwidth(dx);
        set_dheight(dy);
    }

    function _stopResize(e, ui, x, y, dx, dy) {
        set_resizing(false);
        set_dwidth(0);
        set_dheight(0);
        pushCallback(() => {
            _resizeTileArea(dx, dy)
        })
    }

    let show_front = (!props.show_form) && (!props.show_log);

    let outputWidgets = props.front_content.map((outputDict, idx) => {
        let widgetKind = outputDict["widgetKind"];
        let widgetId = outputDict["widgetId"];
        let widgetData = outputDict["widgetData"];
        let the_widget;
        if (widgetKind in widgetDict) {
            let WidgetComponent = widgetDict[widgetKind];
            the_widget = <WidgetComponent key={widgetId} widgetId={widgetId} main_id={props.main_id}
                                          console_id={null}
                                          tile_id={props.tile_id}
                                          row={idx}
                                          dispatch={null}
                                          tileWidth={tdaWidth()}
                                          tileHeight={tdaHeight()}
                                          resizing={resizing}
                                          widgetDict={widgetDict}
                                          widgetData={widgetData} tsocket={props.tsocket}/>;
        } else {
            let WidgetComponent = widgetDict["text"];
            the_widget = <WidgetComponent key={widgetId} widgetId={widgetId} main_id={props.main_id}
                                          row={idx}
                                          tile_id={props.tile_id}
                                          console_id={null}
                                          dispatch={null}
                                          resizing={resizing}
                                          widgetData={`Widget kind not found ${widgetId}, ${widgetKind} ${widgetData}`} />;
        }
        return the_widget;
    });

    let draghandle_position_dict = {position: "absolute", bottom: 2, right: 1};



    let tile_menu_options = {
        "Run me": _handleSubmitOptions,
        "Stop me": _stopMe,
        "divider99": "divider",
        "Kill and reload": async () => {
            await _reloadTile(false)
        },
        "Kill, reload, and resubmit": async () => {
            await _reloadTile(true)
        },
        "divider0": "divider",
        "Toggle console": _toggleTileLog,
        "divider1": "divider",
        "Log me": _logMe,
        "Log parameters": _logParams,
        "divider2": "divider",
        "Edit my source": _editMe,
        "divider3": "divider",
        "Delete me": _closeTile
    };

    let tile_height = props.shrunk ? header_height : props.tile_height;

    let tile_log_style = {
        overflow: "auto",
        width: "100%",
        height: "100%"
    };

    let main_style = {
            width: props.tile_width + dwidth,
            height: tile_height + dheight,
            display: "flex",
            flexDirection: "column",
            position: "relative"
        };
        if (!props.finished_loading) {
            main_style.opacity = .5
        }
    return (
        <Card ref={my_ref} elevation={2} style={main_style} className="tile-panel" id={props.tile_id}>
            <ErrorBoundary>
                <div className={props.source_changed ? "tile-panel-heading tile-source-changed" : "tile-panel-heading"}
                     style={{display: "flex",  paddingRight: 10,
                         flexDirection: "row", justifyContent: "space-between"}}>
                    <div className="left-glyphs" style={{overflow: "hidden"}}>
                        <ButtonGroup>
                            {props.shrunk &&
                                <GlyphButton
                                    icon="chevron-right"
                                    handleClick={_toggleShrunk}/>}

                            {!props.shrunk &&
                                <GlyphButton
                                    icon="chevron-down"
                                    handleClick={_toggleShrunk}/>}
                            <GlyphButton intent="primary"
                                         handleClick={_toggleBack}
                                         icon="cog"/>
                            <SortHandle dragHandleProps={props.dragHandleProps} tile_name={props.tile_name}/>
                        </ButtonGroup>
                    </div>

                    <div className="right-glyphs">
                        <ButtonGroup>
                            {props.show_log && <GlyphButton intent="primary"
                                                            handleClick={_toggleTileLog}
                                                            icon="console"/>}
                            {props.source_changed && !props.show_spinner &&
                                <GlyphButton intent="danger"
                                             handleClick={async () => {
                                                 await _reloadTile(true)
                                             }}
                                             icon="social-media"/>}
                            {props.show_spinner && <GlyphButton intent="danger"
                                                                handleClick={_stopMe}
                                                                icon="stop"/>}
                            {props.show_spinner && <Spinner size={17}/>}
                            <MenuComponent
                                option_dict={tile_menu_options}
                                icon_dict={menu_icons}
                                createOmniItems={false}
                                item_class="tile-menu-item"
                                position={PopoverPosition.BOTTOM_RIGHT}
                                alt_button={alt_button}/>
                        </ButtonGroup>
                    </div>
                </div>
                <ErrorBoundary>
                    {!props.shrunk &&
                        <div ref={body_ref}
                             style={{
                                 width: "100%",
                                 minHeight: 0,
                                 flex: "1 1 0",
                                 display: "flex",
                                 flexDirection: "column",
                                 padding: TILE_DISPLAY_AREA_MARGIN,
                                 overflow: "auto",
                                 position: "relative"
                        }}
                             className="tile-body">
                                <div className={`back ${props.show_form ? "show-me" : "hide-me"}`}
                                     style={{width: "100%", height: "100%",
                                         overflow: "auto",
                                         position: "relative"}} >
                                    <TileForm options={_.cloneDeep(props.form_data)}
                                              tile_id={props.tile_id}
                                              updateValue={_updateOptionValue}
                                              handleSubmit={_handleSubmitOptions}/>
                                </div>
                                <div className={`tile-log-area ${props.show_log ? "show-me" : "hide-me"}`}
                                     style={{width: "100%", height: "100%", position: "relative"}}
                                     ref={log_ref}>
                                    <SearchableConsole main_id={props.main_id}
                                                       streaming_host="host"
                                                       container_id={props.tile_id}
                                                       ref={inner_log_ref}
                                                       outer_style={tile_log_style}
                                                       showCommandField={true}
                                    />
                                </div>
                                <div className={`tile-display-area front ${show_front ? "show-me" : "hide-me"}`}
                                     style={{
                                         width: "100%",
                                         position: "relative"}}
                                     ref={tda_ref}>
                                    {(outputWidgets && (outputWidgets.length > 0)) ?
                                            outputWidgets : ""
                                    }
                                </div>
                        </div>
                    }
                </ErrorBoundary>
                <DragHandle position_dict={draghandle_position_dict}
                            dragStart={_startResize}
                            onDrag={_onResize}
                            dragEnd={_stopResize}
                            direction="both"/>
            </ErrorBoundary>
        </Card>
    )
}

TileComponent = memo(TileComponent);
